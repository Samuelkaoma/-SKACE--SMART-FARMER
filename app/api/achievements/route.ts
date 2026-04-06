import { NextResponse } from 'next/server'
import { z } from 'zod'

import { ApiError, handleRouteError, parseRequestBody } from '@/lib/api/route-helpers'
import { requireRouteUser } from '@/lib/auth/server'
import { calculateFarmerTier } from '@/lib/farm-calculations'
import { getAchievementFeed } from '@/lib/services/dashboard-service'
import { createClient } from '@/lib/supabase/server'

const awardAchievementSchema = z.object({
  achievementName: z.string().min(1),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const user = await requireRouteUser(supabase)
    const achievements = await getAchievementFeed({ supabase, userId: user.id })

    return NextResponse.json({
      data: achievements,
      earnedCount: achievements.filter((achievement) => achievement.earned).length,
    })
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch achievements.')
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const user = await requireRouteUser(supabase)
    const { achievementName } = await parseRequestBody(request, awardAchievementSchema)

    const definitionResult = await supabase
      .from('achievement_definitions')
      .select('name, description, icon_name, points_reward')
      .eq('name', achievementName)
      .maybeSingle()

    if (definitionResult.error) {
      throw new Error(definitionResult.error.message)
    }

    if (!definitionResult.data) {
      throw new ApiError(404, 'Achievement definition not found.')
    }

    const existingResult = await supabase
      .from('achievements')
      .select('id')
      .eq('user_id', user.id)
      .eq('achievement_name', achievementName)
      .eq('is_unlocked', true)
      .maybeSingle()

    if (existingResult.error) {
      throw new Error(existingResult.error.message)
    }

    if (existingResult.data) {
      throw new ApiError(409, 'Achievement already earned.')
    }

    const insertResult = await supabase.from('achievements').insert({
      user_id: user.id,
      achievement_type: 'badge',
      achievement_name: definitionResult.data.name,
      description: definitionResult.data.description,
      points_earned: definitionResult.data.points_reward,
      badge_icon: definitionResult.data.icon_name,
      tier: 'bronze',
      progress_percentage: 100,
      unlocked_at: new Date().toISOString(),
      is_unlocked: true,
    })

    if (insertResult.error) {
      throw new Error(insertResult.error.message)
    }

    const statsResult = await supabase
      .from('user_stats')
      .select('total_points')
      .eq('id', user.id)
      .maybeSingle()

    if (statsResult.error) {
      throw new Error(statsResult.error.message)
    }

    const totalPoints = (statsResult.data?.total_points ?? 0) + definitionResult.data.points_reward
    const nextTier = calculateFarmerTier(totalPoints).tier.toLowerCase()

    const upsertResult = await supabase.from('user_stats').upsert(
      {
        id: user.id,
        total_points: totalPoints,
        current_tier: nextTier,
      },
      { onConflict: 'id' },
    )

    if (upsertResult.error) {
      throw new Error(upsertResult.error.message)
    }

    return NextResponse.json({
      success: true,
      pointsEarned: definitionResult.data.points_reward,
      totalPoints,
      tier: nextTier,
    })
  } catch (error) {
    return handleRouteError(error, 'Failed to award achievement.')
  }
}
