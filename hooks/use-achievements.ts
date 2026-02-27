import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  badge_color: string;
  requirement_type: string;
  requirement_value: number;
  points_reward: number;
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch achievement definitions
      const { data: definitions } = await supabase
        .from('achievement_definitions')
        .select('*');

      // Fetch user achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      // Fetch user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserStats(stats);

      // Combine data and calculate progress
      const achievements = definitions?.map((def: any) => {
        const unlocked = userAchievements?.some((ua: any) => ua.achievement_id === def.id);
        const unlockedRecord = userAchievements?.find((ua: any) => ua.achievement_id === def.id);

        // Calculate progress based on requirement type
        let progress = 0;
        if (stats && def.requirement_type === 'crops_created') {
          progress = Math.min(100, (stats.crops_created / def.requirement_value) * 100);
        } else if (stats && def.requirement_type === 'livestock_count') {
          progress = Math.min(100, (stats.livestock_count / def.requirement_value) * 100);
        } else if (stats && def.requirement_type === 'farm_logs') {
          progress = Math.min(100, (stats.farm_logs_count / def.requirement_value) * 100);
        } else if (stats && def.requirement_type === 'weather_checks') {
          progress = Math.min(100, (stats.weather_checks / def.requirement_value) * 100);
        } else if (stats && def.requirement_type === 'market_checks') {
          progress = Math.min(100, (stats.market_checks / def.requirement_value) * 100);
        } else if (unlocked) {
          progress = 100;
        }

        return {
          ...def,
          unlocked: !!unlocked,
          unlocked_at: unlockedRecord?.unlocked_at,
          progress: Math.round(progress),
        };
      }) || [];

      setAchievements(achievements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  }

  async function checkAndUnlockAchievements() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Call the recommendations API to check and unlock achievements
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) throw new Error('Failed to check achievements');

      // Refetch achievements
      await fetchAchievements();
    } catch (err) {
      console.error('Failed to check achievements:', err);
    }
  }

  return {
    achievements,
    userStats,
    loading,
    error,
    refetch: fetchAchievements,
    checkAndUnlock: checkAndUnlockAchievements,
  };
}
