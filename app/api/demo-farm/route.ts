import { NextResponse } from 'next/server'
import { z } from 'zod'

import { ApiError, handleRouteError, parseRequestBody } from '@/lib/api/route-helpers'
import { requireRouteUser } from '@/lib/auth/server'
import { isDevSeedRouteEnabled } from '@/lib/config/env'
import { createClient } from '@/lib/supabase/server'

const demoFarmSchema = z.object({
  replaceExisting: z.boolean().default(false),
})

function formatDate(offsetDays: number) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

export async function POST(request: Request) {
  try {
    if (!isDevSeedRouteEnabled()) {
      throw new ApiError(403, 'Demo farm seeding is disabled for this environment.')
    }

    const supabase = await createClient()
    const user = await requireRouteUser(supabase)
    const { replaceExisting } = await parseRequestBody(request, demoFarmSchema)

    const existingResult = await supabase
      .from('crops')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (existingResult.error) {
      throw new Error(existingResult.error.message)
    }

    if ((existingResult.count ?? 0) > 0 && !replaceExisting) {
      throw new ApiError(
        409,
        'Demo data already exists for this user. Resubmit with replaceExisting=true to overwrite it.',
      )
    }

    if (replaceExisting) {
      const cleanupResults = await Promise.all([
        supabase.from('notifications').delete().eq('user_id', user.id),
        supabase.from('recommendations').delete().eq('user_id', user.id),
        supabase.from('farm_logs').delete().eq('user_id', user.id),
        supabase.from('storage').delete().eq('user_id', user.id),
        supabase.from('livestock').delete().eq('user_id', user.id),
        supabase.from('crops').delete().eq('user_id', user.id),
        supabase.from('achievements').delete().eq('user_id', user.id),
      ])

      const failedCleanup = cleanupResults.find((result) => result.error)

      if (failedCleanup?.error) {
        throw new Error(failedCleanup.error.message)
      }
    }

    const maizeCropId = crypto.randomUUID()
    const groundnutCropId = crypto.randomUUID()
    const cattleGroupId = crypto.randomUUID()
    const goatGroupId = crypto.randomUUID()

    const profileResult = await supabase.from('profiles').upsert(
      {
        id: user.id,
        first_name: 'Demo',
        last_name: 'Farmer',
        phone: '+260977000111',
        region: 'Central Region',
        farm_size_hectares: 18.5,
        years_farming: 2,
        primary_crop: 'Maize',
        primary_livestock: 'Cattle',
        notifications_enabled: true,
      },
      { onConflict: 'id' },
    )

    if (profileResult.error) {
      throw new Error(profileResult.error.message)
    }

    const cropsResult = await supabase.from('crops').insert([
      {
        id: maizeCropId,
        user_id: user.id,
        crop_name: 'North Block Maize',
        crop_type: 'Maize',
        variety: 'SC 403',
        planting_date: formatDate(-70),
        expected_harvest_date: formatDate(35),
        area_planted_hectares: 11.5,
        seed_quantity_kg: 48,
        fertilizer_type: 'Compound D',
        fertilizer_quantity_kg: 180,
        current_stage: 'flowering',
        soil_type: 'Loam',
        soil_ph: 6.4,
        moisture_level: 43,
        health_status: 'stressed',
        disease_detected: null,
        pest_detected: 'Fall armyworm',
        yield_estimate_kg: 26500,
        estimated_revenue: 66250,
        notes: 'Needs close scouting on the eastern edge after recent pest pressure.',
      },
      {
        id: groundnutCropId,
        user_id: user.id,
        crop_name: 'South Plot Groundnuts',
        crop_type: 'Groundnuts',
        variety: 'Makulu Red',
        planting_date: formatDate(-54),
        expected_harvest_date: formatDate(28),
        area_planted_hectares: 7,
        seed_quantity_kg: 22,
        fertilizer_type: 'Basal blend',
        fertilizer_quantity_kg: 60,
        current_stage: 'fruiting',
        soil_type: 'Sandy',
        soil_ph: 6.1,
        moisture_level: 51,
        health_status: 'healthy',
        disease_detected: null,
        pest_detected: null,
        yield_estimate_kg: 9100,
        estimated_revenue: 45500,
        notes: 'Strong pod development. Keep watch for storage preparation and drying space.',
      },
    ])

    if (cropsResult.error) {
      throw new Error(cropsResult.error.message)
    }

    const livestockResult = await supabase.from('livestock').insert([
      {
        id: cattleGroupId,
        user_id: user.id,
        animal_type: 'Cattle',
        breed: 'Boran',
        quantity: 18,
        average_weight_kg: 235,
        acquisition_date: formatDate(-320),
        health_status: 'healthy',
        last_vaccinated: formatDate(-40),
        next_vaccination_due: formatDate(12),
        feed_type: 'Hay and concentrate',
        daily_feed_quantity_kg: 4.8,
        water_liters_per_day: 26,
        shelter_type: 'Covered pen',
        space_per_animal_sqm: 4.5,
        production_type: 'dairy',
        monthly_production: 1480,
        production_unit: 'liters',
        estimated_value: 148000,
        notes: 'Milk output is steady, but vaccination prep is due soon.',
      },
      {
        id: goatGroupId,
        user_id: user.id,
        animal_type: 'Goats',
        breed: 'Boer cross',
        quantity: 32,
        average_weight_kg: 41,
        acquisition_date: formatDate(-210),
        health_status: 'recovering',
        last_vaccinated: formatDate(-18),
        next_vaccination_due: formatDate(24),
        feed_type: 'Browse and supplement',
        daily_feed_quantity_kg: 1.7,
        water_liters_per_day: 6,
        shelter_type: 'Raised shelter',
        space_per_animal_sqm: 1.2,
        production_type: 'meat',
        monthly_production: 0,
        production_unit: 'kg',
        estimated_value: 54400,
        notes: 'One small group recently recovered from respiratory stress.',
      },
    ])

    if (livestockResult.error) {
      throw new Error(livestockResult.error.message)
    }

    const storageResult = await supabase.from('storage').insert([
      {
        user_id: user.id,
        item_name: 'Stored maize grain',
        category: 'produce',
        quantity: 4200,
        unit: 'kg',
        storage_location: 'Main shed',
        storage_condition: 'dry',
        purchase_price_per_unit: 2.8,
        current_value: 12600,
        expiry_date: formatDate(120),
        last_checked_date: formatDate(-3),
        quality_status: 'good',
        notes: 'Bagged and elevated. Continue weekly pest inspection.',
      },
      {
        user_id: user.id,
        item_name: 'Groundnut seed reserve',
        category: 'seeds',
        quantity: 350,
        unit: 'kg',
        storage_location: 'Seed room',
        storage_condition: 'sealed',
        purchase_price_per_unit: 19,
        current_value: 6650,
        expiry_date: formatDate(95),
        last_checked_date: formatDate(-2),
        quality_status: 'fair',
        notes: 'Moisture acceptable, but room ventilation needs watching during warm afternoons.',
      },
    ])

    if (storageResult.error) {
      throw new Error(storageResult.error.message)
    }

    const logsResult = await supabase.from('farm_logs').insert([
      {
        user_id: user.id,
        log_date: formatDate(-6),
        log_type: 'crop_activity',
        crop_id: maizeCropId,
        activity_description:
          'Scouted the maize block, confirmed fall armyworm pressure, and scheduled spot treatment.',
        weather_condition: 'Warm and dry',
        temperature_celsius: 30,
        rainfall_mm: 0,
        labor_hours: 5,
        notes: 'Damage concentrated on the eastern rows.',
      },
      {
        user_id: user.id,
        log_date: formatDate(-4),
        log_type: 'livestock_activity',
        livestock_id: cattleGroupId,
        activity_description:
          'Reviewed cattle feed mix and checked milk yield consistency across the dairy group.',
        weather_condition: 'Sunny',
        temperature_celsius: 28,
        rainfall_mm: 0,
        labor_hours: 3,
        notes: 'Vaccination visit should be booked before the next two weeks.',
      },
      {
        user_id: user.id,
        log_date: formatDate(-2),
        log_type: 'expense',
        crop_id: maizeCropId,
        activity_description: 'Purchased pesticide and hired sprayer labor for targeted pest control.',
        expense_amount: 1450,
        expense_category: 'Crop protection',
        labor_hours: 2,
        notes: 'Track effectiveness over the next scouting round.',
      },
      {
        user_id: user.id,
        log_date: formatDate(-1),
        log_type: 'observation',
        crop_id: groundnutCropId,
        activity_description:
          'Groundnut field looks strong with even canopy cover and good pod formation.',
        weather_condition: 'Partly cloudy',
        temperature_celsius: 27,
        rainfall_mm: 4,
        notes: 'Start preparing drying surfaces and buyer options.',
      },
    ])

    if (logsResult.error) {
      throw new Error(logsResult.error.message)
    }

    const recommendationsResult = await supabase.from('recommendations').insert([
      {
        user_id: user.id,
        crop_id: maizeCropId,
        recommendation_type: 'alert',
        priority: 'high',
        title: 'Contain pest pressure in the maize block',
        description:
          'The demo maize field shows active fall armyworm signs. Prioritize treatment and rescout within 72 hours.',
        action_items: ['Spray the affected rows', 'Recheck in 3 days', 'Log visible damage'],
        estimated_impact: 'Protect yield and reduce spread.',
      },
      {
        user_id: user.id,
        livestock_id: cattleGroupId,
        recommendation_type: 'suggestion',
        priority: 'medium',
        title: 'Prepare the next cattle vaccination visit',
        description:
          'The dairy group has a vaccination due date approaching. Scheduling early will avoid missed protection windows.',
        action_items: ['Book the vet visit', 'Prepare dosage records', 'Update the herd logbook'],
        estimated_impact: 'Reduce health risk and maintain production stability.',
      },
    ])

    if (recommendationsResult.error) {
      throw new Error(recommendationsResult.error.message)
    }

    const notificationsResult = await supabase.from('notifications').insert([
      {
        user_id: user.id,
        notification_type: 'alert',
        title: 'Demo pest alert loaded',
        message: 'The maize block includes pest pressure so you can test recommendation flows immediately.',
        is_read: false,
      },
      {
        user_id: user.id,
        notification_type: 'reminder',
        title: 'Demo vaccination reminder loaded',
        message: 'The cattle group includes a near-term vaccination due date for testing health workflows.',
        is_read: false,
      },
    ])

    if (notificationsResult.error) {
      throw new Error(notificationsResult.error.message)
    }

    const achievementResult = await supabase.from('achievements').insert([
      {
        user_id: user.id,
        achievement_type: 'badge',
        achievement_name: 'First Crop',
        description: 'Plant your first crop',
        points_earned: 50,
        badge_icon: 'leaf',
        tier: 'bronze',
        progress_percentage: 100,
        unlocked_at: new Date().toISOString(),
        is_unlocked: true,
      },
    ])

    if (achievementResult.error) {
      throw new Error(achievementResult.error.message)
    }

    const statsResult = await supabase.from('user_stats').upsert(
      {
        id: user.id,
        total_points: 50,
        current_tier: 'bronze',
        total_revenue: 111750,
        crops_managed: 2,
        livestock_managed: 50,
        total_harvest_kg: 4200,
        achievements_unlocked: 1,
        current_streak: 4,
      },
      { onConflict: 'id' },
    )

    if (statsResult.error) {
      throw new Error(statsResult.error.message)
    }

    return NextResponse.json({
      success: true,
      summary: {
        landHectares: 18.5,
        crops: 2,
        livestockGroups: 2,
        storageItems: 2,
        logs: 4,
      },
    })
  } catch (error) {
    return handleRouteError(error, 'Failed to create demo farm data.')
  }
}
