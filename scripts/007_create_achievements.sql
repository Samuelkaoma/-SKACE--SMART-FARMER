-- SmartFarmer SKACE - Gamification & Achievements
-- Tracks badges, points, and user progression

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL, -- badge, milestone, streak
  achievement_name TEXT NOT NULL,
  description TEXT,
  points_earned INTEGER DEFAULT 0,
  badge_icon TEXT,
  tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
  progress_percentage INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  is_unlocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements_select_own" ON public.achievements 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "achievements_insert_own" ON public.achievements 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "achievements_update_own" ON public.achievements 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "achievements_delete_own" ON public.achievements 
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_achievements_is_unlocked ON public.achievements(is_unlocked);
CREATE INDEX idx_achievements_tier ON public.achievements(tier);

-- User stats aggregate table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_tier TEXT DEFAULT 'bronze',
  crops_managed INTEGER DEFAULT 0,
  livestock_managed INTEGER DEFAULT 0,
  total_harvest_kg DECIMAL(15, 2) DEFAULT 0,
  total_revenue ZMW DECIMAL(15, 2) DEFAULT 0,
  achievements_unlocked INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_stats_select_own" ON public.user_stats 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_stats_update_own" ON public.user_stats 
  FOR UPDATE USING (auth.uid() = id);
