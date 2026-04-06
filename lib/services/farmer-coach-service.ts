import { GUIDE_LIBRARY } from '@/lib/content/farmer-guide'
import type {
  ConditionSignal,
  CropRecord,
  GuideModule,
  LivestockRecord,
  ProfileSummary,
  StorageRecord,
  WeatherRecord,
} from '@/lib/types/farm'

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

function average(values: number[]) {
  if (values.length === 0) {
    return null
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function hasWildcardMatch(candidates: string[], values: string[]) {
  return candidates.includes('*') || candidates.some((candidate) => values.includes(candidate))
}

export function buildConditionSignals({
  crops,
  livestock,
  storage,
  weather,
}: {
  crops: CropRecord[]
  livestock: LivestockRecord[]
  storage: StorageRecord[]
  weather: WeatherRecord | null
}): ConditionSignal[] {
  const averageMoisture = average(
    crops
      .map((crop) => crop.moisture_level)
      .filter((value): value is number => typeof value === 'number'),
  )
  const diseasedOrPestCrops = crops.filter(
    (crop) =>
      (crop.health_status ?? '').toLowerCase() === 'diseased' ||
      Boolean(crop.disease_detected) ||
      Boolean(crop.pest_detected),
  ).length
  const stressedCrops = crops.filter((crop) =>
    ['stressed', 'recovering'].includes((crop.health_status ?? '').toLowerCase()),
  ).length
  const sickLivestock = livestock.filter((record) =>
    ['sick', 'recovering', 'poor'].includes((record.health_status ?? '').toLowerCase()),
  ).length
  const vaccinationDue = livestock.filter((record) => {
    const days = getDaysUntil(record.next_vaccination_due)
    return days !== null && days >= 0 && days <= 10
  }).length
  const expiringSoon = storage.filter((item) => {
    const days = getDaysUntil(item.expiry_date)
    return days !== null && days >= 0 && days <= 14
  }).length
  const poorStorage = storage.filter((item) => (item.quality_status ?? '').toLowerCase() === 'poor')
    .length

  const fieldSignal: ConditionSignal = (() => {
    if (crops.length === 0) {
      return {
        id: 'field-conditions',
        title: 'Field conditions',
        status: 'watch',
        summary:
          'Add crop and moisture records first. The app can only judge field timing well when there is real plot data to compare.',
        reasons: [
          'No crop blocks are recorded yet',
          'No moisture history is available yet',
        ],
        nextStep: 'Add your active crop blocks and current field observations.',
      }
    }

    const reasons = [
      averageMoisture === null
        ? 'Moisture readings are missing on most crop blocks'
        : `Average recorded crop moisture is ${Math.round(averageMoisture)}%`,
      weather?.rainfall_mm === null || weather?.rainfall_mm === undefined
        ? 'Rainfall data is limited right now'
        : `Recent rainfall is ${weather.rainfall_mm} mm`,
      weather?.temperature_celsius === null || weather?.temperature_celsius === undefined
        ? 'Temperature data is limited right now'
        : `Temperature is ${weather.temperature_celsius} C`,
    ]

    if (
      diseasedOrPestCrops > 0 ||
      averageMoisture !== null && averageMoisture < 35 ||
      weather?.temperature_celsius !== null &&
        weather?.temperature_celsius !== undefined &&
        weather.temperature_celsius >= 34
    ) {
      return {
        id: 'field-conditions',
        title: 'Field conditions',
        status: 'risky',
        summary:
          'Current field conditions are risky for stable crop performance. Stress signals are already visible, so the focus should shift to protection and moisture preservation.',
        reasons,
        nextStep: 'Prioritize scouting, irrigation or mulch, and treatment in the most affected plots.',
      }
    }

    if (
      stressedCrops > 0 ||
      averageMoisture !== null && averageMoisture < 45 ||
      weather?.rainfall_mm !== null &&
        weather?.rainfall_mm !== undefined &&
        weather.rainfall_mm < 10
    ) {
      return {
        id: 'field-conditions',
        title: 'Field conditions',
        status: 'watch',
        summary:
          'Field conditions are workable, but not fully comfortable. This is the time to watch moisture, stress, and pest pressure before they become season-shaping problems.',
        reasons,
        nextStep: 'Increase field checks this week and log changes before the next decision point.',
      }
    }

    return {
      id: 'field-conditions',
      title: 'Field conditions',
      status: 'favorable',
      summary:
        'Conditions look favorable for normal crop management. Keep the review rhythm going so you notice problems before they spread.',
      reasons,
      nextStep: 'Stay consistent with scouting, feeding the logbook with fresh observations.',
    }
  })()

  const livestockSignal: ConditionSignal = (() => {
    if (livestock.length === 0) {
      return {
        id: 'livestock-conditions',
        title: 'Livestock conditions',
        status: 'watch',
        summary:
          'No livestock groups are recorded yet, so animal comfort and preventive care cannot be assessed.',
        reasons: [
          'No livestock groups are available',
          'Vaccination and feed records are not present yet',
        ],
        nextStep: 'Add each herd or flock with health and vaccination dates.',
      }
    }

    const reasons = [
      `${sickLivestock} livestock group(s) currently need closer health attention`,
      `${vaccinationDue} group(s) have vaccinations due within 10 days`,
      weather?.temperature_celsius === null || weather?.temperature_celsius === undefined
        ? 'Temperature data is limited right now'
        : `Temperature is ${weather.temperature_celsius} C`,
    ]

    if (
      sickLivestock > 0 ||
      weather?.temperature_celsius !== null &&
        weather?.temperature_celsius !== undefined &&
        weather.temperature_celsius >= 34
    ) {
      return {
        id: 'livestock-conditions',
        title: 'Livestock conditions',
        status: 'risky',
        summary:
          'Livestock conditions need stronger attention now. Health or heat stress can compound quickly when checks are delayed.',
        reasons,
        nextStep: 'Review weak groups, water access, shelter, and upcoming vaccinations today.',
      }
    }

    if (vaccinationDue > 0) {
      return {
        id: 'livestock-conditions',
        title: 'Livestock conditions',
        status: 'watch',
        summary:
          'Livestock conditions are stable, but preventive care timing needs attention soon.',
        reasons,
        nextStep: 'Confirm vaccine availability and update the herd plan before due dates arrive.',
      }
    }

    return {
      id: 'livestock-conditions',
      title: 'Livestock conditions',
      status: 'favorable',
      summary:
        'Livestock conditions look stable. Keep health, feed, and water routines consistent so small issues stay small.',
      reasons,
      nextStep: 'Continue weekly health reviews and keep preventive care ahead of schedule.',
    }
  })()

  const storageSignal: ConditionSignal = (() => {
    if (storage.length === 0) {
      return {
        id: 'storage-conditions',
        title: 'Storage conditions',
        status: 'watch',
        summary:
          'No storage records are being tracked yet, so post-harvest risk is still mostly invisible.',
        reasons: [
          'No produce, seed, or inventory records are available',
          'Quality check dates are not being monitored yet',
        ],
        nextStep: 'Record stored produce and inspection dates before harvests build up.',
      }
    }

    const reasons = [
      `${poorStorage} storage item(s) are marked poor quality`,
      `${expiringSoon} storage item(s) are approaching expiry soon`,
      `${storage.length} storage item(s) are currently monitored`,
    ]

    if (poorStorage > 0 || expiringSoon > 1) {
      return {
        id: 'storage-conditions',
        title: 'Storage conditions',
        status: 'risky',
        summary:
          'Stored value is at risk. Quality loss usually gets more expensive when inspection and movement are delayed.',
        reasons,
        nextStep: 'Inspect stock immediately, move older produce first, and document any quality loss.',
      }
    }

    if (expiringSoon > 0) {
      return {
        id: 'storage-conditions',
        title: 'Storage conditions',
        status: 'watch',
        summary:
          'Storage is mostly steady, but some stock needs a near-term decision so value is not lost.',
        reasons,
        nextStep: 'Plan sale, use, or processing for the items that are nearing expiry.',
      }
    }

    return {
      id: 'storage-conditions',
      title: 'Storage conditions',
      status: 'favorable',
      summary:
        'Storage conditions look manageable. Keep the inspection rhythm regular so quality stays visible instead of surprising you later.',
      reasons,
      nextStep: 'Continue weekly checks and keep older stock moving first.',
    }
  })()

  return [fieldSignal, livestockSignal, storageSignal]
}

export function buildGuideModules({
  crops,
  livestock,
  profile,
  storage,
  weather,
}: {
  crops: CropRecord[]
  livestock: LivestockRecord[]
  profile: ProfileSummary
  storage: StorageRecord[]
  weather: WeatherRecord | null
}): GuideModule[] {
  const cropTypes = [...new Set(crops.map((crop) => crop.crop_type).filter(Boolean))]
  const livestockTypes = [
    ...new Set(livestock.map((record) => record.animal_type).filter(Boolean)),
  ]
  const novice = (profile.years_farming ?? 0) < 3
  const dryConditions = Boolean(
    weather?.rainfall_mm !== null &&
      weather?.rainfall_mm !== undefined &&
      weather.rainfall_mm < 10,
  )
  const hotConditions = Boolean(
    weather?.temperature_celsius !== null &&
      weather?.temperature_celsius !== undefined &&
      weather.temperature_celsius >= 33,
  )

  const selected = GUIDE_LIBRARY.filter((entry) => {
    if (entry.alwaysInclude) {
      return true
    }

    if (entry.noviceOnly && !novice) {
      return false
    }

    if (entry.requiresStorage && storage.length === 0) {
      return false
    }

    if (entry.requiresDryConditions && !dryConditions) {
      return false
    }

    if (entry.requiresHeat && !hotConditions) {
      return false
    }

    if (entry.cropTypes && cropTypes.length > 0 && hasWildcardMatch(entry.cropTypes, cropTypes)) {
      return true
    }

    if (
      entry.livestockTypes &&
      livestockTypes.length > 0 &&
      hasWildcardMatch(entry.livestockTypes, livestockTypes)
    ) {
      return true
    }

    return false
  })

  const uniqueEntries = Array.from(new Map(selected.map((entry) => [entry.id, entry])).values())

  return uniqueEntries.slice(0, 6).map(({ alwaysInclude: _alwaysInclude, cropTypes: _cropTypes, livestockTypes: _livestockTypes, noviceOnly: _noviceOnly, requiresStorage: _requiresStorage, requiresHeat: _requiresHeat, requiresDryConditions: _requiresDryConditions, ...module }) => module)
}
