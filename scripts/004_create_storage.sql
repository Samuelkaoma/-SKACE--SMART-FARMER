-- SmartFarmer SKACE - Storage Inventory
-- Tracks stored produce, seeds, fertilizers, etc.

CREATE TABLE IF NOT EXISTS public.storage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL, -- produce, seeds, fertilizer, equipment, other
  quantity DECIMAL(12, 2) NOT NULL,
  unit TEXT NOT NULL, -- kg, bags, liters, units
  storage_location TEXT,
  storage_condition TEXT DEFAULT 'dry',
  purchase_price_per_unit ZMW DECIMAL(10, 2),
  current_value ZMW DECIMAL(12, 2),
  expiry_date DATE,
  last_checked_date DATE,
  quality_status TEXT DEFAULT 'good', -- good, fair, poor
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.storage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "storage_select_own" ON public.storage 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "storage_insert_own" ON public.storage 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "storage_update_own" ON public.storage 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "storage_delete_own" ON public.storage 
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_storage_timestamp BEFORE UPDATE ON public.storage
FOR EACH ROW EXECUTE FUNCTION public.update_profiles_updated_at();

CREATE INDEX idx_storage_user_id ON public.storage(user_id);
CREATE INDEX idx_storage_category ON public.storage(category);
CREATE INDEX idx_storage_expiry_date ON public.storage(expiry_date);
