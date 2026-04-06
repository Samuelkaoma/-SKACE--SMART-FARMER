-- SmartFarmer SKACE - Livestock Table
-- Tracks cattle, goats, pigs, chickens, etc.

CREATE TABLE IF NOT EXISTS public.livestock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_type TEXT NOT NULL, -- cattle, goats, pigs, chickens, sheep, ducks, rabbits
  breed TEXT,
  quantity INTEGER NOT NULL,
  average_weight_kg DECIMAL(8, 2),
  acquisition_date DATE,
  health_status TEXT DEFAULT 'healthy', -- healthy, sick, vaccinated, recovering
  last_vaccinated DATE,
  next_vaccination_due DATE,
  feed_type TEXT,
  daily_feed_quantity_kg DECIMAL(8, 2),
  water_liters_per_day DECIMAL(8, 2),
  shelter_type TEXT,
  space_per_animal_sqm DECIMAL(8, 2),
  mortality_count INTEGER DEFAULT 0,
  production_type TEXT, -- meat, dairy, eggs, wool
  monthly_production DECIMAL(10, 2),
  production_unit TEXT, -- kg, liters, eggs
  estimated_value DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "livestock_select_own" ON public.livestock 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "livestock_insert_own" ON public.livestock 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "livestock_update_own" ON public.livestock 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "livestock_delete_own" ON public.livestock 
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_livestock_timestamp BEFORE UPDATE ON public.livestock
FOR EACH ROW EXECUTE FUNCTION public.update_profiles_updated_at();

CREATE INDEX idx_livestock_user_id ON public.livestock(user_id);
CREATE INDEX idx_livestock_animal_type ON public.livestock(animal_type);
CREATE INDEX idx_livestock_health_status ON public.livestock(health_status);
