-- SmartFarmer SKACE - Farm Activity Logs
-- Daily records of farm activities, weather, observations

CREATE TABLE IF NOT EXISTS public.farm_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  log_type TEXT NOT NULL, -- crop_activity, livestock_activity, weather, observation, expense, harvest
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  livestock_id UUID REFERENCES public.livestock(id) ON DELETE SET NULL,
  activity_description TEXT NOT NULL,
  weather_condition TEXT,
  temperature_celsius DECIMAL(5, 1),
  rainfall_mm DECIMAL(8, 2),
  labor_hours DECIMAL(5, 1),
  expense_amount DECIMAL(12, 2),
  expense_category TEXT,
  harvest_quantity_kg DECIMAL(12, 2),
  quality_grade TEXT,
  attachment_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.farm_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "farm_logs_select_own" ON public.farm_logs 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "farm_logs_insert_own" ON public.farm_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "farm_logs_update_own" ON public.farm_logs 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "farm_logs_delete_own" ON public.farm_logs 
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_farm_logs_timestamp BEFORE UPDATE ON public.farm_logs
FOR EACH ROW EXECUTE FUNCTION public.update_profiles_updated_at();

CREATE INDEX idx_farm_logs_user_id ON public.farm_logs(user_id);
CREATE INDEX idx_farm_logs_log_date ON public.farm_logs(log_date);
CREATE INDEX idx_farm_logs_log_type ON public.farm_logs(log_type);
