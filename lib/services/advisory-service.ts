import { DEFAULT_PERFORMANCE_DATA } from '@/lib/constants/dashboard'
import type {
  CropDistributionPoint,
  CropRecord,
  DiseaseLibraryEntry,
  FarmLogRecord,
  LivestockRecord,
  MarketCommoditySummary,
  MarketPriceRecord,
  PerformanceDataPoint,
  PlaybookStep,
  RecommendationAlert,
  StorageRecord,
  UserStatsRecord,
  WeatherRecord,
} from '@/lib/types/farm'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getDaysUntil(dateString: string | null) {
  if (!dateString) {
    return null
  }

  const timestamp = new Date(dateString).getTime()

  if (Number.isNaN(timestamp)) {
    return null
  }

  return Math.floor((timestamp - Date.now()) / (1000 * 60 * 60 * 24))
}

function healthScoreForStatus(status: string | null | undefined) {
  switch ((status ?? '').toLowerCase()) {
    case 'healthy':
      return 92
    case 'recovering':
      return 68
    case 'stressed':
      return 58
    case 'vaccinated':
      return 88
    case 'sick':
    case 'diseased':
    case 'poor':
      return 38
    case 'fair':
      return 55
    default:
      return 74
  }
}

function titleCase(value: string | null | undefined) {
  if (!value) {
    return ''
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function buildRecommendationAlerts({
  crops,
  livestock,
  storage,
  weather,
}: {
  crops: CropRecord[]
  livestock: LivestockRecord[]
  storage: StorageRecord[]
  weather: WeatherRecord | null
}) {
  const recommendations: RecommendationAlert[] = []

  const diseasedCrops = crops.filter(
    (crop) =>
      (crop.health_status ?? '').toLowerCase() === 'diseased' ||
      crop.disease_detected ||
      crop.pest_detected,
  )
  if (diseasedCrops.length > 0) {
    recommendations.push({
      id: 'crop-disease-alert',
      title: 'Crop disease and pest follow-up',
      description: `${diseasedCrops.length} crop record(s) show disease or pest signals. Inspect the affected plots, isolate severe patches, and document treatment.`,
      priority: 'critical',
      type: 'alert',
      actionItems: [
        'Inspect affected fields today',
        'Record symptoms and likely spread pattern',
        'Apply treatment and log the intervention',
      ],
      sourceLabel: 'Crop health',
    })
  }

  const dryCrops = crops.filter((crop) => (crop.moisture_level ?? 100) < 40)
  if (dryCrops.length > 0) {
    recommendations.push({
      id: 'soil-moisture',
      title: 'Low soil moisture risk',
      description: `${dryCrops.length} crop block(s) are below the preferred moisture threshold. Prioritize irrigation or mulch protection on the weakest plots.`,
      priority: 'high',
      type: 'warning',
      actionItems: [
        'Water moisture-sensitive plots',
        'Check rainfall forecast before applying inputs',
        'Log new moisture readings after intervention',
      ],
      sourceLabel: 'Field monitoring',
    })
  }

  const harvestSoon = crops.filter((crop) => {
    const daysUntilHarvest = getDaysUntil(crop.expected_harvest_date)
    return daysUntilHarvest !== null && daysUntilHarvest >= 0 && daysUntilHarvest <= 14
  })
  if (harvestSoon.length > 0) {
    recommendations.push({
      id: 'harvest-window',
      title: 'Harvest preparation window',
      description: `${harvestSoon.length} crop record(s) are within the next 14 days of harvest. Prepare labor, transport, grading, and storage now.`,
      priority: 'high',
      type: 'suggestion',
      actionItems: [
        'Book labor and transport',
        'Prepare clean storage space',
        'Estimate harvest yield and expected sales value',
      ],
      sourceLabel: 'Harvest readiness',
    })
  }

  const sickLivestock = livestock.filter((record) =>
    ['sick', 'poor', 'recovering'].includes((record.health_status ?? '').toLowerCase()),
  )
  if (sickLivestock.length > 0) {
    recommendations.push({
      id: 'livestock-health',
      title: 'Livestock health follow-up',
      description: `${sickLivestock.length} livestock record(s) need attention. Review isolation, feeding, and vaccination history before losses escalate.`,
      priority: 'high',
      type: 'alert',
      actionItems: [
        'Separate weak or sick animals',
        'Review vaccination and feed plan',
        'Schedule veterinary support if symptoms worsen',
      ],
      sourceLabel: 'Livestock care',
    })
  }

  const vaccinationDue = livestock.filter((record) => {
    const daysUntilVaccination = getDaysUntil(record.next_vaccination_due)
    return daysUntilVaccination !== null && daysUntilVaccination >= 0 && daysUntilVaccination <= 10
  })
  if (vaccinationDue.length > 0) {
    recommendations.push({
      id: 'vaccination-due',
      title: 'Vaccination schedule is due soon',
      description: `${vaccinationDue.length} livestock group(s) have vaccinations due within 10 days. Preventive care is easier than emergency treatment.`,
      priority: 'medium',
      type: 'suggestion',
      actionItems: [
        'Confirm vaccine availability',
        'Schedule the next vaccination date',
        'Record the dosage and follow-up date',
      ],
      sourceLabel: 'Preventive care',
    })
  }

  const expiringStorage = storage.filter((item) => {
    const daysUntilExpiry = getDaysUntil(item.expiry_date)
    return daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 14
  })
  if (expiringStorage.length > 0) {
    recommendations.push({
      id: 'storage-expiry',
      title: 'Storage items need review',
      description: `${expiringStorage.length} storage item(s) are approaching expiry or spoilage risk. Sell, process, or use them before value drops.`,
      priority: 'medium',
      type: 'warning',
      actionItems: [
        'Inspect quality and moisture condition',
        'Move older stock first',
        'Log any loss to improve storage planning',
      ],
      sourceLabel: 'Inventory control',
    })
  }

  if (
    weather?.rainfall_mm !== null &&
    weather?.rainfall_mm !== undefined &&
    weather.rainfall_mm < 10
  ) {
    recommendations.push({
      id: 'weather-dry-spell',
      title: 'Dry weather advisory',
      description: 'Recent rainfall is low for your region. Focus on irrigation planning, soil cover, and crop stress scouting this week.',
      priority: 'medium',
      type: 'prediction',
      actionItems: [
        'Prioritize water-efficient plots',
        'Reduce unnecessary field disturbance',
        'Watch for early drought stress',
      ],
      sourceLabel: 'Weather signal',
    })
  }

  if (
    weather?.temperature_celsius !== null &&
    weather?.temperature_celsius !== undefined &&
    weather.temperature_celsius > 32
  ) {
    recommendations.push({
      id: 'weather-heat',
      title: 'Heat stress advisory',
      description: 'High temperatures are forecast. Increase shade, water, and field checks to prevent avoidable losses.',
      priority: 'medium',
      type: 'warning',
      actionItems: [
        'Increase watering for vulnerable crops',
        'Provide shade or cooling measures for animals',
        'Avoid spraying in the hottest hours',
      ],
      sourceLabel: 'Weather signal',
    })
  }

  return recommendations.slice(0, 5)
}

export function buildCropDistribution(crops: CropRecord[]): CropDistributionPoint[] {
  if (crops.length === 0) {
    return [{ name: 'No crops yet', value: 100 }]
  }

  const grouped = crops.reduce<Map<string, number>>((accumulator, crop) => {
    const label = crop.crop_type || crop.crop_name || 'Unknown'
    accumulator.set(label, (accumulator.get(label) ?? 0) + 1)
    return accumulator
  }, new Map())

  return [...grouped.entries()]
    .map(([name, count]) => ({
      name,
      value: Math.round((count / crops.length) * 100),
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5)
}

export function buildPerformanceSeries({
  crops,
  livestock,
  logs,
  userStats,
}: {
  crops: CropRecord[]
  livestock: LivestockRecord[]
  logs: FarmLogRecord[]
  userStats: UserStatsRecord
}): PerformanceDataPoint[] {
  const cropHealthAverage =
    crops.length === 0
      ? 72
      : Math.round(
          crops.reduce((sum, crop) => sum + healthScoreForStatus(crop.health_status), 0) /
            crops.length,
        )

  const livestockHealthAverage =
    livestock.length === 0
      ? 76
      : Math.round(
          livestock.reduce((sum, record) => sum + healthScoreForStatus(record.health_status), 0) /
            livestock.length,
        )

  const yieldAverage =
    crops.length === 0
      ? 68
      : Math.round(
          crops.reduce(
            (sum, crop) => sum + clamp((crop.yield_estimate_kg ?? 1500) / 60, 20, 100),
            0,
          ) / crops.length,
        )

  const loggingBonus = clamp(logs.length * 2, 0, 12)
  const streakBonus = clamp(userStats.current_streak ?? 0, 0, 8)

  return DEFAULT_PERFORMANCE_DATA.map((point, index) => {
    const drift = index - 2

    return {
      month: point.month,
      yield: clamp(
        Math.round((point.yield + yieldAverage) / 2 + drift + loggingBonus),
        20,
        100,
      ),
      health: clamp(
        Math.round(
          (point.health + cropHealthAverage + livestockHealthAverage) / 3 + drift + streakBonus,
        ),
        20,
        100,
      ),
    }
  })
}

export function buildMarketSummaries(
  marketPrices: MarketPriceRecord[],
): MarketCommoditySummary[] {
  const commodityMap = new Map<string, MarketPriceRecord[]>()

  for (const price of marketPrices) {
    if (!commodityMap.has(price.commodity_name)) {
      commodityMap.set(price.commodity_name, [])
    }

    commodityMap.get(price.commodity_name)?.push(price)
  }

  return [...commodityMap.entries()]
    .map(([name, prices]) => {
      const recent = prices[0]
      const comparison = prices[1] ?? prices[prices.length - 1] ?? prices[0]
      const delta = recent.price_per_unit - comparison.price_per_unit
      const percentChange =
        comparison.price_per_unit === 0
          ? 0
          : Number(((delta / comparison.price_per_unit) * 100).toFixed(1))
      const trend: MarketCommoditySummary['trend'] =
        delta === 0 ? 'steady' : delta > 0 ? 'up' : 'down'

      return {
        name,
        currentPrice: recent.price_per_unit,
        date: recent.recorded_date,
        trend,
        percentChange,
        unit: recent.unit,
        priceHistory: prices.slice(0, 10).reverse(),
      }
    })
    .sort((left, right) => right.currentPrice - left.currentPrice)
}

export function buildPlaybook({
  hasCrops,
  hasLivestock,
  hasLogs,
  yearsFarming,
}: {
  hasCrops: boolean
  hasLivestock: boolean
  hasLogs: boolean
  yearsFarming: number | null
}): PlaybookStep[] {
  const novice = (yearsFarming ?? 0) < 3

  if (novice) {
    return [
      {
        id: 'capture-baseline',
        title: 'Capture your baseline',
        description:
          'Register each crop block, livestock group, and storage item so the dashboard can produce useful guidance.',
        href: '/dashboard/crops',
        label: 'Add farm records',
      },
      {
        id: 'learn-season-signals',
        title: 'Learn what favorable conditions look like',
        description:
          'Use the built-in learning center to understand when weather, moisture, and health signals mean go, caution, or protect now.',
        href: '/dashboard/learn',
        label: 'Open learning center',
      },
      {
        id: 'log-activities',
        title: 'Keep a weekly logbook',
        description:
          'Patterns become visible only when you track activities, weather, and outcomes regularly.',
        href: '/dashboard/logbook',
        label: 'Open logbook',
      },
      {
        id: 'review-health',
        title: 'Inspect health risks early',
        description:
          'Use the field guide and recommendations to act on disease, pests, moisture stress, and vaccination timing before losses spread.',
        href: '/dashboard',
        label: 'Review alerts',
      },
    ]
  }

  const steps: PlaybookStep[] = []

  if (!hasCrops) {
    steps.push({
      id: 'add-crops',
      title: 'Add crop records',
      description:
        'Start with your active fields so expected harvest, disease, and moisture guidance can work.',
      href: '/dashboard/crops',
      label: 'Manage crops',
    })
  }

  if (!hasLivestock) {
    steps.push({
      id: 'add-livestock',
      title: 'Add livestock groups',
      description:
        'Capture herd data so feed, vaccination, and health monitoring become visible.',
      href: '/dashboard/livestock',
      label: 'Manage livestock',
    })
  }

  if (!hasLogs) {
    steps.push({
      id: 'start-logbook',
      title: 'Start the farm logbook',
      description:
        'Logging activities is the fastest way to unlock meaningful patterns and recommendations.',
      href: '/dashboard/logbook',
      label: 'Add logs',
    })
  }

  return steps.length > 0
    ? steps
    : [
        {
          id: 'tighten-review-rhythm',
          title: 'Review alerts twice a week',
          description:
            'A regular review rhythm keeps small field issues from turning into season-long losses.',
          href: '/dashboard',
          label: 'Open dashboard',
        },
      ]
}

export function sortKnowledgeCards(entries: DiseaseLibraryEntry[], crops: CropRecord[]) {
  const cropPriority = new Map<string, number>()

  crops.forEach((crop, index) => {
    if (!cropPriority.has(crop.crop_type)) {
      cropPriority.set(crop.crop_type, index)
    }
  })

  return [...entries].sort((left, right) => {
    const leftPriority = cropPriority.get(left.affects_crop_type) ?? Number.MAX_SAFE_INTEGER
    const rightPriority = cropPriority.get(right.affects_crop_type) ?? Number.MAX_SAFE_INTEGER

    return leftPriority - rightPriority
  })
}

export function summarizeRecentLogs(logs: FarmLogRecord[]) {
  return logs.map((log) => ({
    ...log,
    log_type: titleCase(log.log_type.replace(/_/g, ' ')),
  }))
}
