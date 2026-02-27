import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's earned achievements
    const { data: earnedData, error: earnedError } = await supabase
      .from('user_achievements')
      .select('achievement_id, created_at')
      .eq('user_id', user.id)

    if (earnedError) throw earnedError

    // Get all achievements
    const { data: allData, error: allError } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: true })

    if (allError) throw allError

    const earnedIds = new Set(earnedData?.map(e => e.achievement_id) || [])

    const achievements = allData?.map(achievement => ({
      ...achievement,
      earned: earnedIds.has(achievement.id)
    })) || []

    return NextResponse.json({ 
      data: achievements,
      earnedCount: earnedIds.size 
    })
  } catch (error) {
    console.log('[v0] Achievements API error:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { achievementId } = body

    // Check if already earned
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', user.id)
      .eq('achievement_id', achievementId)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already earned' }, { status: 400 })
    }

    // Award achievement and points
    const { error } = await supabase.from('user_achievements').insert({
      user_id: user.id,
      achievement_id: achievementId,
    })

    if (error) throw error

    // Add points
    const { data: stats } = await supabase
      .from('user_stats')
      .select('points')
      .eq('user_id', user.id)
      .single()

    const newPoints = (stats?.points || 0) + 50

    await supabase
      .from('user_stats')
      .update({ points: newPoints })
      .eq('user_id', user.id)

    return NextResponse.json({ 
      success: true, 
      pointsEarned: 50,
      totalPoints: newPoints 
    })
  } catch (error) {
    console.log('[v0] Error awarding achievement:', error)
    return NextResponse.json({ error: 'Failed to award achievement' }, { status: 500 })
  }
}
