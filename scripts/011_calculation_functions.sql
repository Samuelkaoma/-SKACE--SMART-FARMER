-- SmartFarmer SKACE - Calculation & Intelligence Functions
-- Functions for predictions, recommendations, and auto-calculations

-- Function to calculate yield prediction based on crop metrics
CREATE OR REPLACE FUNCTION public.calculate_yield_prediction(
  crop_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  health_score DECIMAL;
  stage_multiplier DECIMAL;
  area_planted DECIMAL;
  base_yield DECIMAL;
BEGIN
  SELECT area_planted_hectares INTO area_planted FROM public.crops WHERE id = crop_id;
  
  -- Calculate health score (0-100)
  SELECT CASE 
    WHEN health_status = 'healthy' THEN 100
    WHEN health_status = 'stressed' THEN 70
    WHEN health_status = 'diseased' THEN 40
    WHEN health_status = 'recovering' THEN 60
    ELSE 50
  END INTO health_score FROM public.crops WHERE id = crop_id;

  -- Stage multiplier (how far along in growth)
  SELECT CASE 
    WHEN current_stage = 'seedling' THEN 0.2
    WHEN current_stage = 'vegetative' THEN 0.4
    WHEN current_stage = 'flowering' THEN 0.7
    WHEN current_stage = 'fruiting' THEN 0.85
    WHEN current_stage = 'mature' THEN 0.95
    ELSE 0.5
  END INTO stage_multiplier FROM public.crops WHERE id = crop_id;

  -- Base yield estimates by crop (kg/hectare)
  SELECT CASE 
    WHEN crop_type = 'maize' THEN 6000
    WHEN crop_type = 'soybean' THEN 2500
    WHEN crop_type = 'wheat' THEN 5000
    WHEN crop_type = 'groundnuts' THEN 3500
    WHEN crop_type = 'cotton' THEN 2000
    WHEN crop_type = 'tobacco' THEN 2500
    WHEN crop_type = 'sunflower' THEN 3000
    ELSE 3000
  END INTO base_yield FROM public.crops WHERE id = crop_id;

  RETURN ROUND((base_yield * (health_score / 100) * stage_multiplier * area_planted)::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to generate recommendations based on crop health
CREATE OR REPLACE FUNCTION public.generate_crop_recommendations(
  crop_id UUID,
  user_id UUID
)
RETURNS void AS $$
DECLARE
  crop_record RECORD;
  days_to_harvest INTEGER;
BEGIN
  SELECT * INTO crop_record FROM public.crops WHERE id = crop_id;

  -- Calculate days until harvest
  days_to_harvest := (crop_record.expected_harvest_date - CURRENT_DATE);

  -- Alert for disease
  IF crop_record.disease_detected IS NOT NULL THEN
    INSERT INTO public.recommendations (
      user_id, crop_id, recommendation_type, priority, title, description
    ) VALUES (
      user_id,
      crop_id,
      'alert',
      'critical',
      'Disease Detected: ' || crop_record.disease_detected,
      'Your ' || crop_record.crop_name || ' has ' || crop_record.disease_detected || '. Immediate action required to prevent spread.',
      ARRAY['Isolate affected plants', 'Apply recommended treatment', 'Monitor daily'],
      'Prevent significant yield loss'
    );
  END IF;

  -- Alert for pest
  IF crop_record.pest_detected IS NOT NULL THEN
    INSERT INTO public.recommendations (
      user_id, crop_id, recommendation_type, priority, title, description
    ) VALUES (
      user_id,
      crop_id,
      'alert',
      'high',
      'Pest Infestation: ' || crop_record.pest_detected,
      'Pests detected in your ' || crop_record.crop_name || ' field.',
      ARRAY['Use appropriate pesticide', 'Increase monitoring', 'Remove affected plants if needed'],
      'Protect crop yield'
    );
  END IF;

  -- Harvest preparation suggestion
  IF days_to_harvest <= 14 AND days_to_harvest > 0 THEN
    INSERT INTO public.recommendations (
      user_id, crop_id, recommendation_type, priority, title, description
    ) VALUES (
      user_id,
      crop_id,
      'suggestion',
      'high',
      'Harvest Preparation Needed',
      'Your ' || crop_record.crop_name || ' will be ready to harvest in ' || days_to_harvest || ' days.',
      ARRAY['Prepare harvesting equipment', 'Arrange transport', 'Plan storage'],
      'Maximize yield quality'
    );
  END IF;

  -- Watering recommendation
  IF crop_record.moisture_level < 40 THEN
    INSERT INTO public.recommendations (
      user_id, crop_id, recommendation_type, priority, title, description
    ) VALUES (
      user_id,
      crop_id,
      'alert',
      'medium',
      'Low Soil Moisture Detected',
      'Soil moisture is below optimal level (' || crop_record.moisture_level || '%). Water your fields.',
      ARRAY['Irrigate immediately', 'Monitor weather', 'Check moisture daily'],
      'Prevent drought stress'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update user stats based on achievements
CREATE OR REPLACE FUNCTION public.update_user_tier()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  points INTEGER;
  new_tier TEXT;
BEGIN
  FOR user_record IN SELECT id FROM auth.users LOOP
    -- Count total points
    SELECT COALESCE(SUM(points_earned), 0) INTO points
    FROM public.achievements
    WHERE user_id = user_record.id AND is_unlocked = true;

    -- Determine tier based on points
    new_tier := CASE 
      WHEN points >= 5000 THEN 'platinum'
      WHEN points >= 3000 THEN 'gold'
      WHEN points >= 1500 THEN 'silver'
      ELSE 'bronze'
    END;

    -- Update user stats
    UPDATE public.user_stats
    SET total_points = points, current_tier = new_tier
    WHERE id = user_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
