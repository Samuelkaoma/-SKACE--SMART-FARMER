-- SmartFarmer SKACE - Market Intelligence Data
-- Commodity prices, demand, seasonal trends

CREATE TABLE IF NOT EXISTS public.market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_name TEXT NOT NULL,
  region TEXT NOT NULL,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  grade TEXT DEFAULT 'standard',
  market_type TEXT DEFAULT 'wholesale',
  supply_status TEXT DEFAULT 'normal',
  demand_trend TEXT DEFAULT 'stable',
  recorded_date DATE NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view market prices" ON public.market_prices FOR SELECT USING (true);

CREATE INDEX idx_market_prices_commodity ON public.market_prices(commodity_name);
CREATE INDEX idx_market_prices_region ON public.market_prices(region);
CREATE INDEX idx_market_prices_recorded_date ON public.market_prices(recorded_date);

-- Disease & Pest Library
CREATE TABLE IF NOT EXISTS public.disease_pest_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  affects_crop_type TEXT NOT NULL,
  description TEXT,
  symptoms TEXT[],
  prevention_methods TEXT[],
  treatment_methods TEXT[],
  severity TEXT DEFAULT 'moderate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.disease_pest_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view disease/pest library" ON public.disease_pest_library FOR SELECT USING (true);

CREATE INDEX idx_disease_pest_type ON public.disease_pest_library(type);
CREATE INDEX idx_disease_pest_crop ON public.disease_pest_library(affects_crop_type);
