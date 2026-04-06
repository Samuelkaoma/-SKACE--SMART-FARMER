import type { SupabaseClient } from '@supabase/supabase-js'

import type {
  AchievementDefinitionRecord,
  AchievementRecord,
  CropRecord,
  DiseaseLibraryEntry,
  FarmLogRecord,
  LivestockRecord,
  MarketPriceRecord,
  NotificationRecord,
  ProfileSummary,
  StorageRecord,
  UserStatsRecord,
  WeatherRecord,
} from '@/lib/types/farm'

type DatabaseClient = SupabaseClient<any, 'public', any>

function throwIfError(error: { message: string } | null, context: string) {
  if (error) {
    throw new Error(`${context}: ${error.message}`)
  }
}

export async function getUserProfileSummary(supabase: DatabaseClient, userId: string) {
  const [profileResult, notificationResult] = await Promise.all([
    supabase
      .from('profiles')
      .select(
        'first_name, last_name, region, primary_crop, primary_livestock, years_farming, farm_size_hectares, notifications_enabled',
      )
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .eq('is_deleted', false),
  ])

  throwIfError(profileResult.error, 'Failed to load user profile')
  throwIfError(notificationResult.error, 'Failed to load notification summary')

  return {
    profile: (profileResult.data ?? {
      first_name: null,
      last_name: null,
      region: null,
      primary_crop: null,
      primary_livestock: null,
      years_farming: null,
      farm_size_hectares: null,
      notifications_enabled: true,
    }) as ProfileSummary,
    unreadNotifications: notificationResult.count ?? 0,
  }
}

export async function getDashboardSnapshot(supabase: DatabaseClient, userId: string) {
  const [cropsResult, livestockResult, storageResult, achievementsResult, statsResult] =
    await Promise.all([
      supabase
        .from('crops')
        .select(
          'id, crop_name, crop_type, variety, planting_date, expected_harvest_date, area_planted_hectares, seed_quantity_kg, fertilizer_type, fertilizer_quantity_kg, current_stage, soil_type, soil_ph, moisture_level, health_status, disease_detected, pest_detected, yield_estimate_kg, actual_yield_kg, estimated_revenue, notes, created_at',
        )
        .eq('user_id', userId),
      supabase
        .from('livestock')
        .select(
          'id, animal_type, breed, quantity, average_weight_kg, acquisition_date, health_status, last_vaccinated, next_vaccination_due, feed_type, daily_feed_quantity_kg, water_liters_per_day, shelter_type, space_per_animal_sqm, mortality_count, production_type, monthly_production, production_unit, estimated_value, notes, created_at',
        )
        .eq('user_id', userId),
      supabase
        .from('storage')
        .select(
          'id, item_name, category, quantity, unit, storage_location, storage_condition, purchase_price_per_unit, current_value, expiry_date, last_checked_date, quality_status, notes, created_at',
        )
        .eq('user_id', userId),
      supabase
        .from('achievements')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_unlocked', true),
      supabase
        .from('user_stats')
        .select(
          'total_points, current_tier, total_revenue, crops_managed, livestock_managed, total_harvest_kg, achievements_unlocked, current_streak',
        )
        .eq('id', userId)
        .maybeSingle(),
    ])

  throwIfError(cropsResult.error, 'Failed to load crops')
  throwIfError(livestockResult.error, 'Failed to load livestock')
  throwIfError(storageResult.error, 'Failed to load storage')
  throwIfError(achievementsResult.error, 'Failed to load achievements')
  throwIfError(statsResult.error, 'Failed to load user stats')

  return {
    crops: (cropsResult.data ?? []) as CropRecord[],
    livestock: (livestockResult.data ?? []) as LivestockRecord[],
    storage: (storageResult.data ?? []) as StorageRecord[],
    achievementsCount: achievementsResult.count ?? 0,
    userStats: (statsResult.data ?? {
      total_points: 0,
      current_tier: 'bronze',
      total_revenue: 0,
      crops_managed: 0,
      livestock_managed: 0,
      total_harvest_kg: 0,
      achievements_unlocked: 0,
      current_streak: 0,
    }) as UserStatsRecord,
  }
}

export async function getLatestRegionalWeather(supabase: DatabaseClient, region: string | null) {
  const baseQuery = supabase
    .from('weather_data')
    .select(
      'region, temperature_celsius, humidity_percent, rainfall_mm, wind_speed_kmh, condition, forecast_date',
    )
    .order('forecast_date', { ascending: false })

  const result = region
    ? await baseQuery.ilike('region', `%${region}%`).limit(1).maybeSingle()
    : await baseQuery.limit(1).maybeSingle()

  throwIfError(result.error, 'Failed to load weather data')

  return (result.data ?? null) as WeatherRecord | null
}

export async function getLatestMarketPrices(supabase: DatabaseClient, limit = 50) {
  const result = await supabase
    .from('market_prices')
    .select('commodity_name, price_per_unit, recorded_date, region, unit, demand_trend')
    .order('recorded_date', { ascending: false })
    .limit(limit)

  throwIfError(result.error, 'Failed to load market prices')

  return (result.data ?? []) as MarketPriceRecord[]
}

export async function getNotifications(
  supabase: DatabaseClient,
  userId: string,
  limit = 20,
) {
  const result = await supabase
    .from('notifications')
    .select('id, notification_type, title, message, is_read, action_url, created_at')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(limit)

  throwIfError(result.error, 'Failed to load notifications')

  return (result.data ?? []) as NotificationRecord[]
}

export async function markNotificationAsRead(
  supabase: DatabaseClient,
  userId: string,
  notificationId: string,
) {
  const result = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', userId)

  throwIfError(result.error, 'Failed to update notification')
}

export async function getAchievementDefinitions(supabase: DatabaseClient) {
  const result = await supabase
    .from('achievement_definitions')
    .select(
      'id, name, description, icon_name, badge_color, requirement_type, requirement_value, points_reward, created_at',
    )
    .order('created_at', { ascending: true })

  throwIfError(result.error, 'Failed to load achievement definitions')

  return (result.data ?? []) as AchievementDefinitionRecord[]
}

export async function getUnlockedAchievements(supabase: DatabaseClient, userId: string) {
  const result = await supabase
    .from('achievements')
    .select(
      'id, achievement_type, achievement_name, description, points_earned, badge_icon, tier, progress_percentage, unlocked_at, is_unlocked, created_at',
    )
    .eq('user_id', userId)

  throwIfError(result.error, 'Failed to load user achievements')

  return (result.data ?? []) as AchievementRecord[]
}

export async function getKnowledgeEntriesForCrops(
  supabase: DatabaseClient,
  cropTypes: string[],
  limit = 4,
) {
  if (cropTypes.length === 0) {
    return [] as DiseaseLibraryEntry[]
  }

  const result = await supabase
    .from('disease_pest_library')
    .select(
      'id, name, type, affects_crop_type, description, symptoms, prevention_methods, treatment_methods, severity',
    )
    .in('affects_crop_type', cropTypes)
    .limit(limit)

  throwIfError(result.error, 'Failed to load field guide entries')

  return (result.data ?? []) as DiseaseLibraryEntry[]
}

export async function getRecentFarmLogs(
  supabase: DatabaseClient,
  userId: string,
  limit = 6,
) {
  const result = await supabase
    .from('farm_logs')
    .select(
      'id, log_date, log_type, crop_id, livestock_id, activity_description, weather_condition, temperature_celsius, rainfall_mm, labor_hours, expense_amount, expense_category, harvest_quantity_kg, quality_grade, notes, created_at',
    )
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .limit(limit)

  throwIfError(result.error, 'Failed to load farm logs')

  return (result.data ?? []) as FarmLogRecord[]
}
