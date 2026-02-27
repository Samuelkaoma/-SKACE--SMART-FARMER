-- Create weather_data table
CREATE TABLE IF NOT EXISTS public.weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  temperature_celsius DECIMAL(5, 2) NOT NULL,
  humidity_percent DECIMAL(5, 2) NOT NULL,
  rainfall_mm DECIMAL(8, 2),
  wind_speed_kmh DECIMAL(5, 2),
  condition TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view weather data" ON public.weather_data
  FOR SELECT USING (true);

-- Create disease_data table
CREATE TABLE IF NOT EXISTS public.disease_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_type TEXT NOT NULL,
  disease_name TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  prevention TEXT NOT NULL,
  treatment TEXT NOT NULL,
  severity_level TEXT DEFAULT 'moderate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.disease_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view disease data" ON public.disease_data
  FOR SELECT USING (true);

-- Create pest_data table
CREATE TABLE IF NOT EXISTS public.pest_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_type TEXT NOT NULL,
  pest_name TEXT NOT NULL,
  description TEXT NOT NULL,
  damage_indicators TEXT NOT NULL,
  control_methods TEXT NOT NULL,
  prevention_tips TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.pest_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pest data" ON public.pest_data
  FOR SELECT USING (true);

-- Create achievement_definitions table
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  badge_color TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points_reward INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievement definitions" ON public.achievement_definitions
  FOR SELECT USING (true);
