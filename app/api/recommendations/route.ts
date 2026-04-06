import { NextResponse } from 'next/server'
import { z } from 'zod'

import { handleRouteError, parseRequestBody } from '@/lib/api/route-helpers'
import { requireRouteUser } from '@/lib/auth/server'
import { getRecommendationFeed } from '@/lib/services/dashboard-service'
import { createClient } from '@/lib/supabase/server'

const createRecommendationSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(400),
  recommendationType: z.enum(['alert', 'suggestion', 'prediction', 'warning']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  actionItems: z.array(z.string().min(1)).default([]),
  estimatedImpact: z.string().max(180).optional(),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const user = await requireRouteUser(supabase)
    const data = await getRecommendationFeed({
      supabase,
      userId: user.id,
    })

    return NextResponse.json({
      data,
      total: data.length,
    })
  } catch (error) {
    return handleRouteError(error, 'Failed to generate recommendations.')
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const user = await requireRouteUser(supabase)
    const body = await parseRequestBody(request, createRecommendationSchema)

    const insertResult = await supabase.from('recommendations').insert({
      user_id: user.id,
      recommendation_type: body.recommendationType,
      title: body.title,
      description: body.description,
      priority: body.priority,
      action_items: body.actionItems,
      estimated_impact: body.estimatedImpact ?? null,
      is_read: false,
      is_resolved: false,
    })

    if (insertResult.error) {
      throw new Error(insertResult.error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleRouteError(error, 'Failed to save recommendation.')
  }
}
