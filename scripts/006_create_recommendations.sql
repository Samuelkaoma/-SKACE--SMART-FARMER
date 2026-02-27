-- SmartFarmer SKACE - AI Recommendations & Alerts
-- Smart recommendations based on crop/livestock status, weather, etc.

CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  livestock_id UUID REFERENCES public.livestock(id) ON DELETE SET NULL,
  recommendation_type TEXT NOT NULL, -- alert, suggestion, prediction, warning
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_items TEXT[],
  estimated_impact TEXT,
  tutorial_url TEXT,
  video_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  resolved_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recommendations_select_own" ON public.recommendations 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "recommendations_insert_own" ON public.recommendations 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "recommendations_update_own" ON public.recommendations 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "recommendations_delete_own" ON public.recommendations 
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX idx_recommendations_priority ON public.recommendations(priority);
CREATE INDEX idx_recommendations_is_read ON public.recommendations(is_read);
