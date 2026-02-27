-- Seed mock weather data for Zambia
INSERT INTO public.weather_data (region, forecast_date, temperature_celsius, rainfall_mm, humidity_percent, wind_speed_kmh, condition) VALUES
('Northern Region', CURRENT_DATE, 28, 15, 65, 8, 'Partly Cloudy'),
('Southern Region', CURRENT_DATE - INTERVAL '1 day', 30, 8, 60, 10, 'Sunny'),
('Eastern Region', CURRENT_DATE - INTERVAL '2 days', 26, 22, 72, 6, 'Rainy'),
('Western Region', CURRENT_DATE - INTERVAL '3 days', 29, 12, 68, 9, 'Cloudy'),
('Central Region', CURRENT_DATE - INTERVAL '4 days', 27, 18, 70, 7, 'Partly Cloudy'),
('Northern Region', CURRENT_DATE - INTERVAL '5 days', 31, 5, 55, 12, 'Sunny'),
('Southern Region', CURRENT_DATE - INTERVAL '6 days', 25, 25, 75, 5, 'Rainy');

-- Seed mock market prices for Zambian crops
INSERT INTO public.market_prices (commodity_name, region, price_per_unit, unit, recorded_date) VALUES
('Maize', 'Lusaka', 2500, 'kg', CURRENT_DATE),
('Maize', 'Copperbelt', 2450, 'kg', CURRENT_DATE - INTERVAL '1 day'),
('Maize', 'Southern', 2400, 'kg', CURRENT_DATE - INTERVAL '2 days'),
('Sorghum', 'Lusaka', 2200, 'kg', CURRENT_DATE),
('Sorghum', 'Copperbelt', 2180, 'kg', CURRENT_DATE - INTERVAL '1 day'),
('Groundnuts', 'Lusaka', 3500, 'kg', CURRENT_DATE),
('Groundnuts', 'Southern', 3480, 'kg', CURRENT_DATE - INTERVAL '1 day'),
('Wheat', 'Lusaka', 3200, 'kg', CURRENT_DATE),
('Wheat', 'Copperbelt', 3180, 'kg', CURRENT_DATE - INTERVAL '1 day'),
('Beans', 'Lusaka', 4500, 'kg', CURRENT_DATE),
('Beans', 'Southern', 4480, 'kg', CURRENT_DATE - INTERVAL '1 day'),
('Cabbage', 'Lusaka', 800, 'head', CURRENT_DATE),
('Tomatoes', 'Copperbelt', 1200, 'kg', CURRENT_DATE);

-- Seed disease patterns
INSERT INTO public.disease_pest_library (name, type, affects_crop_type, description, symptoms, prevention_methods, treatment_methods, severity) VALUES
('Leaf Spot', 'disease', 'Maize', 'Fungal disease affecting foliage', ARRAY['Brown spots on leaves', 'Yellowing', 'Leaf decay'], ARRAY['Proper spacing', 'Apply fungicide', 'Remove infected leaves'], ARRAY['Spray fungicide', 'Remove affected foliage'], 'moderate'),
('Fall Armyworm', 'pest', 'Maize', 'Lepidopteran insect pest', ARRAY['Holes in leaves', 'Damaged kernels', 'Wilting'], ARRAY['Scout regularly', 'Use pheromone traps', 'Early season control'], ARRAY['Apply insecticide', 'Hand-pick larvae'], 'severe'),
('Rust', 'disease', 'Wheat', 'Fungal disease on stems', ARRAY['Rusty powder on leaves', 'Reduced yield', 'Stem discoloration'], ARRAY['Plant resistant varieties', 'Apply fungicide'], ARRAY['Spray fungicide immediately'], 'moderate'),
('Root Rot', 'disease', 'Groundnuts', 'Soil-borne fungal pathogen', ARRAY['Wilting', 'Yellowing', 'Root decay'], ARRAY['Good drainage', 'Crop rotation', 'Avoid waterlogging'], ARRAY['Improve drainage', 'Treat soil'], 'severe'),
('Powdery Mildew', 'disease', 'Sorghum', 'Fungal disease on leaves', ARRAY['White powder coating', 'Leaf distortion'], ARRAY['Improve air circulation', 'Apply sulfur'], ARRAY['Apply fungicide', 'Remove affected leaves'], 'mild');

-- Seed achievement definitions
INSERT INTO public.achievement_definitions (name, description, icon_name, badge_color, requirement_type, requirement_value, points_reward) VALUES
('First Crop', 'Plant your first crop', 'leaf', 'emerald', 'crops_created', 1, 50),
('Harvest Master', 'Complete 5 crop harvests', 'wheat', 'amber', 'crops_harvested', 5, 150),
('Livestock Leader', 'Add 10 livestock entries', 'home', 'orange', 'livestock_count', 10, 100),
('Data Champion', 'Log 30 farm activities', 'activity', 'blue', 'farm_logs', 30, 75),
('Storage Expert', 'Store 1000kg of produce', 'package', 'orange', 'storage_amount', 1000, 120),
('Weather Watcher', 'Check weather 15 times', 'cloud', 'cyan', 'weather_checks', 15, 60),
('Market Master', 'Track market prices 10 times', 'trending-up', 'emerald', 'market_checks', 10, 80),
('Health Guardian', 'Maintain 90%+ crop health', 'heart', 'red', 'health_score', 90, 180),
('Efficiency King', 'Reduce waste by 20%', 'zap', 'yellow', 'efficiency_score', 20, 150),
('Tier Up Gold', 'Reach Gold farmer tier', 'star', 'amber', 'tier_level', 3, 200);
