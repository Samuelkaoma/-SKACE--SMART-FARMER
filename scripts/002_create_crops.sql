-- SmartFarmer SKACE - Crops Table
-- Stores crop planting and growth tracking

CREATE TABLE IF NOT EXISTS public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  crop_type TEXT NOT NULL, -- maize, soybean, wheat, groundnuts, cotton, tobacco, sunflower
  variety TEXT,
  planting_date DATE NOT NULL,
  expected_harvest_date DATE NOT NULL,
  area_planted_hectares DECIMAL(10, 2) NOT NULL,
  seed_quantity_kg DECIMAL(10, 2),
  fertilizer_type TEXT,
  fertilizer_quantity_kg DECIMAL(10, 2),
  current_stage TEXT DEFAULT 'seedling', -- seedling, vegetative, flowering, fruiting, mature, harvested
  soil_type TEXT,
  soil_ph DECIMAL(3, 1),
  moisture_level DECIMAL(3, 1),
  health_status TEXT DEFAULT 'healthy', -- healthy, stressed, diseased, recovering
  disease_detected TEXT,
  pest_detected TEXT,
  yield_estimate_kg DECIMAL(12, 2),
  actual_yield_kg DECIMAL(12, 2),
  estimated_revenue DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crops_select_own" ON public.crops 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "crops_insert_own" ON public.crops 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "crops_update_own" ON public.crops 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "crops_delete_own" ON public.crops 
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_crops_timestamp BEFORE UPDATE ON public.crops
FOR EACH ROW EXECUTE FUNCTION public.update_profiles_updated_at();

CREATE INDEX idx_crops_user_id ON public.crops(user_id);
CREATE INDEX idx_crops_crop_type ON public.crops(crop_type);
CREATE INDEX idx_crops_health_status ON public.crops(health_status);
