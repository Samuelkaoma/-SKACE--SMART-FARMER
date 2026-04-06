import type { SupabaseClient } from '@supabase/supabase-js'

import {
  getAchievementDefinitions,
  getDashboardSnapshot,
  getKnowledgeEntriesForCrops,
  getLatestMarketPrices,
  getLatestRegionalWeather,
  getRecentFarmLogs,
  getUnlockedAchievements,
  getUserProfileSummary,
} from '@/lib/repositories/farm-repository'
import {
  buildCropDistribution,
  buildMarketSummaries,
  buildPerformanceSeries,
  buildPlaybook,
  buildRecommendationAlerts,
  sortKnowledgeCards,
  summarizeRecentLogs,
} from '@/lib/services/advisory-service'
import {
  buildConditionSignals,
  buildGuideModules,
} from '@/lib/services/farmer-coach-service'
import type {
  AchievementWithStatus,
  DashboardOverviewData,
  DashboardShellData,
  FarmerGuideData,
  MarketCommoditySummary,
} from '@/lib/types/farm'

type DatabaseClient = SupabaseClient<any, 'public', any>

function titleCase(value: string | null | undefined) {
  if (!value) {
    return 'Bronze'
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

function resolveDisplayName({
  firstName,
  lastName,
  email,
}: {
  firstName: string | null | undefined
  lastName: string | null | undefined
  email: string | null | undefined
}) {
  const combined = [firstName, lastName].filter(Boolean).join(' ').trim()

  if (combined) {
    return combined
  }

  if (!email) {
    return 'Farmer'
  }

  return email.split('@')[0]
}

export async function getDashboardShellData({
  supabase,
  userId,
  email,
}: {
  supabase: DatabaseClient
  userId: string
  email?: string | null
}): Promise<DashboardShellData> {
  const profileSummary = await getUserProfileSummary(supabase, userId)

  return {
    userName: resolveDisplayName({
      firstName: profileSummary.profile.first_name,
      lastName: profileSummary.profile.last_name,
      email,
    }),
    unreadNotifications: profileSummary.unreadNotifications,
  }
}

export async function getDashboardOverviewData({
  supabase,
  userId,
}: {
  supabase: DatabaseClient
  userId: string
}): Promise<DashboardOverviewData> {
  const profileSummary = await getUserProfileSummary(supabase, userId)
  const dashboardSnapshot = await getDashboardSnapshot(supabase, userId)

  const cropTypes = [...new Set(dashboardSnapshot.crops.map((crop) => crop.crop_type))]

  const [weather, marketPrices, knowledgeCards, recentLogs] = await Promise.all([
    getLatestRegionalWeather(supabase, profileSummary.profile.region),
    getLatestMarketPrices(supabase, 50),
    getKnowledgeEntriesForCrops(supabase, cropTypes, 4),
    getRecentFarmLogs(supabase, userId, 6),
  ])

  return {
    stats: {
      activeCrops: dashboardSnapshot.crops.filter(
        (crop) => (crop.current_stage ?? '').toLowerCase() !== 'harvested',
      ).length,
      trackedArea: Number(
        dashboardSnapshot.crops
          .reduce((sum, crop) => sum + (crop.area_planted_hectares ?? 0), 0)
          .toFixed(1),
      ),
      livestock: dashboardSnapshot.livestock.reduce(
        (count, record) => count + (record.quantity ?? 0),
        0,
      ),
      storageItems: dashboardSnapshot.storage.length,
      points: dashboardSnapshot.userStats.total_points ?? 0,
      level: titleCase(dashboardSnapshot.userStats.current_tier),
      totalRevenue: dashboardSnapshot.userStats.total_revenue ?? 0,
      totalHarvestKg: dashboardSnapshot.userStats.total_harvest_kg ?? 0,
    },
    conditionSignals: buildConditionSignals({
      crops: dashboardSnapshot.crops,
      livestock: dashboardSnapshot.livestock,
      storage: dashboardSnapshot.storage,
      weather,
    }),
    recommendations: buildRecommendationAlerts({
      crops: dashboardSnapshot.crops,
      livestock: dashboardSnapshot.livestock,
      storage: dashboardSnapshot.storage,
      weather,
    }),
    performanceData: buildPerformanceSeries({
      crops: dashboardSnapshot.crops,
      livestock: dashboardSnapshot.livestock,
      logs: recentLogs,
      userStats: dashboardSnapshot.userStats,
    }),
    cropsDistribution: buildCropDistribution(dashboardSnapshot.crops),
    marketHighlights: buildMarketSummaries(marketPrices).slice(0, 4),
    knowledgeCards: sortKnowledgeCards(knowledgeCards, dashboardSnapshot.crops),
    playbook: buildPlaybook({
      hasCrops: dashboardSnapshot.crops.length > 0,
      hasLivestock: dashboardSnapshot.livestock.length > 0,
      hasLogs: recentLogs.length > 0,
      yearsFarming: profileSummary.profile.years_farming,
    }),
    recentLogs: summarizeRecentLogs(recentLogs),
  }
}

export async function getFarmerGuideData({
  supabase,
  userId,
}: {
  supabase: DatabaseClient
  userId: string
}): Promise<FarmerGuideData> {
  const profileSummary = await getUserProfileSummary(supabase, userId)
  const dashboardSnapshot = await getDashboardSnapshot(supabase, userId)
  const weather = await getLatestRegionalWeather(supabase, profileSummary.profile.region)

  return {
    modules: buildGuideModules({
      crops: dashboardSnapshot.crops,
      livestock: dashboardSnapshot.livestock,
      profile: profileSummary.profile,
      storage: dashboardSnapshot.storage,
      weather,
    }),
    conditionSignals: buildConditionSignals({
      crops: dashboardSnapshot.crops,
      livestock: dashboardSnapshot.livestock,
      storage: dashboardSnapshot.storage,
      weather,
    }),
    region: profileSummary.profile.region,
    yearsFarming: profileSummary.profile.years_farming,
  }
}

export async function getRecommendationFeed({
  supabase,
  userId,
}: {
  supabase: DatabaseClient
  userId: string
}) {
  return (await getDashboardOverviewData({ supabase, userId })).recommendations
}

export async function getMarketSummary({
  supabase,
}: {
  supabase: DatabaseClient
}): Promise<MarketCommoditySummary[]> {
  const marketPrices = await getLatestMarketPrices(supabase, 50)
  return buildMarketSummaries(marketPrices)
}

export async function getAchievementFeed({
  supabase,
  userId,
}: {
  supabase: DatabaseClient
  userId: string
}): Promise<AchievementWithStatus[]> {
  const [definitions, unlocked] = await Promise.all([
    getAchievementDefinitions(supabase),
    getUnlockedAchievements(supabase, userId),
  ])

  const unlockedMap = new Map(unlocked.map((record) => [record.achievement_name, record]))

  return definitions.map((definition) => ({
    ...definition,
    earned: unlockedMap.get(definition.name)?.is_unlocked === true,
    unlockedAt: unlockedMap.get(definition.name)?.unlocked_at ?? null,
  }))
}
