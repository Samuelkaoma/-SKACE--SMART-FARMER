export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low'
export type RecommendationType = 'alert' | 'suggestion' | 'prediction' | 'warning'

export interface ProfileSummary {
  first_name: string | null
  last_name: string | null
  region: string | null
  primary_crop: string | null
  primary_livestock: string | null
  years_farming: number | null
  farm_size_hectares: number | null
  notifications_enabled: boolean | null
}

export interface CropRecord {
  id: string
  crop_name: string
  crop_type: string
  variety: string | null
  planting_date: string | null
  expected_harvest_date: string | null
  area_planted_hectares: number | null
  seed_quantity_kg: number | null
  fertilizer_type: string | null
  fertilizer_quantity_kg: number | null
  current_stage: string | null
  soil_type: string | null
  soil_ph: number | null
  moisture_level: number | null
  health_status: string | null
  disease_detected: string | null
  pest_detected: string | null
  yield_estimate_kg: number | null
  actual_yield_kg: number | null
  estimated_revenue: number | null
  notes: string | null
  created_at?: string | null
}

export interface LivestockRecord {
  id: string
  animal_type: string
  breed: string | null
  quantity: number | null
  average_weight_kg: number | null
  acquisition_date: string | null
  health_status: string | null
  last_vaccinated: string | null
  next_vaccination_due: string | null
  feed_type: string | null
  daily_feed_quantity_kg: number | null
  water_liters_per_day: number | null
  shelter_type: string | null
  space_per_animal_sqm: number | null
  mortality_count: number | null
  production_type: string | null
  monthly_production: number | null
  production_unit: string | null
  estimated_value: number | null
  notes: string | null
  created_at?: string | null
}

export interface StorageRecord {
  id: string
  item_name: string
  category: string
  quantity: number
  unit: string
  storage_location: string | null
  storage_condition: string | null
  purchase_price_per_unit: number | null
  current_value: number | null
  expiry_date: string | null
  last_checked_date: string | null
  quality_status: string | null
  notes: string | null
  created_at?: string | null
}

export interface FarmLogRecord {
  id: string
  log_date: string
  log_type: string
  crop_id: string | null
  livestock_id: string | null
  activity_description: string
  weather_condition: string | null
  temperature_celsius: number | null
  rainfall_mm: number | null
  labor_hours: number | null
  expense_amount: number | null
  expense_category: string | null
  harvest_quantity_kg: number | null
  quality_grade: string | null
  notes: string | null
  created_at?: string | null
}

export interface UserStatsRecord {
  total_points: number | null
  current_tier: string | null
  total_revenue: number | null
  crops_managed: number | null
  livestock_managed: number | null
  total_harvest_kg: number | null
  achievements_unlocked: number | null
  current_streak: number | null
}

export interface WeatherRecord {
  region: string
  temperature_celsius: number | null
  humidity_percent: number | null
  rainfall_mm: number | null
  wind_speed_kmh: number | null
  condition: string | null
  forecast_date: string | null
}

export interface MarketPriceRecord {
  commodity_name: string
  price_per_unit: number
  recorded_date: string
  region: string
  unit: string | null
  demand_trend?: string | null
}

export interface DiseaseLibraryEntry {
  id: string
  name: string
  type: string
  affects_crop_type: string
  description: string | null
  symptoms: string[] | null
  prevention_methods: string[] | null
  treatment_methods: string[] | null
  severity: string | null
}

export interface DashboardStats {
  activeCrops: number
  trackedArea: number
  livestock: number
  storageItems: number
  points: number
  level: string
  totalRevenue: number
  totalHarvestKg: number
}

export interface RecommendationAlert {
  id: string
  title: string
  description: string
  priority: RecommendationPriority
  type: RecommendationType
  actionItems: string[]
  sourceLabel: string
}

export interface PerformanceDataPoint {
  month: string
  yield: number
  health: number
}

export interface CropDistributionPoint {
  name: string
  value: number
}

export interface PlaybookStep {
  id: string
  title: string
  description: string
  href: string
  label: string
}

export interface DashboardOverviewData {
  stats: DashboardStats
  recommendations: RecommendationAlert[]
  performanceData: PerformanceDataPoint[]
  cropsDistribution: CropDistributionPoint[]
  marketHighlights: MarketCommoditySummary[]
  knowledgeCards: DiseaseLibraryEntry[]
  playbook: PlaybookStep[]
  recentLogs: FarmLogRecord[]
}

export interface DashboardShellData {
  userName: string
  unreadNotifications: number
}

export interface AchievementDefinitionRecord {
  id: string
  name: string
  description: string
  icon_name: string
  badge_color: string
  requirement_type: string
  requirement_value: number
  points_reward: number
  created_at?: string | null
}

export interface AchievementRecord {
  id: string
  achievement_type: string | null
  achievement_name: string
  description: string | null
  points_earned: number | null
  badge_icon: string | null
  tier: string | null
  progress_percentage: number | null
  unlocked_at: string | null
  is_unlocked: boolean | null
  created_at?: string | null
}

export interface AchievementWithStatus extends AchievementDefinitionRecord {
  earned: boolean
  unlockedAt?: string | null
}

export interface NotificationRecord {
  id: string
  notification_type?: string | null
  title?: string | null
  message?: string | null
  is_read?: boolean | null
  action_url?: string | null
  created_at?: string | null
}

export interface MarketCommoditySummary {
  name: string
  currentPrice: number
  date: string
  trend: 'up' | 'down' | 'steady'
  percentChange: number
  unit: string | null
  priceHistory: MarketPriceRecord[]
}
