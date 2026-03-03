import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { calculateLevel, getXPForNextLevel } from '@/lib/gamification';
import type { UserProfile, UserAchievement } from '@/types';
import type { GamificationState } from '@/types';

export function useGamification(profile: UserProfile | null) {
  const [state, setState] = useState<GamificationState>({
    level: 1,
    xp: 0,
    nextLevelXP: 100,
    streak: 0,
    totalEvaluations: 0,
    recentAchievements: [],
  });

  useEffect(() => {
    if (!profile) return;

    const level = calculateLevel(profile.experience_points);
    const nextLevelXP = getXPForNextLevel(level);

    setState({
      level,
      xp: profile.experience_points,
      nextLevelXP,
      streak: profile.streak_days,
      totalEvaluations: profile.total_evaluations,
      recentAchievements: [],
    });

    fetchRecentAchievements(profile.id);
  }, [profile]);

  async function fetchRecentAchievements(userId: string) {
    const { data } = await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
      .limit(3);

    if (data) {
      setState(prev => ({ ...prev, recentAchievements: data }));
    }
  }

  return state;
}
