import { NextResponse } from 'next/server'
import { z } from 'zod'

import { handleRouteError, parseRequestBody } from '@/lib/api/route-helpers'
import { requireRouteUser } from '@/lib/auth/server'
import {
  getNotifications,
  markNotificationAsRead,
} from '@/lib/repositories/farm-repository'
import { createClient } from '@/lib/supabase/server'

const markNotificationSchema = z.object({
  notificationId: z.string().min(1),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const user = await requireRouteUser(supabase)
    const data = await getNotifications(supabase, user.id, 20)

    return NextResponse.json({ data })
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch notifications.')
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const user = await requireRouteUser(supabase)
    const { notificationId } = await parseRequestBody(request, markNotificationSchema)

    await markNotificationAsRead(supabase, user.id, notificationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleRouteError(error, 'Failed to update notification.')
  }
}
