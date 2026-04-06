import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { Client } from 'pg'

const rootDir = process.cwd()
const envPath = path.join(rootDir, '.env')

function parseEnvFile(content) {
  const env = {}

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    env[key] = value
  }

  return env
}

function makeDate(offsetDays) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

function buildMixedFarmScenario() {
  return {
    profile: {
      first_name: 'Samuel',
      last_name: 'Kaoma',
      phone: '+260977100221',
      region: 'Central Region',
      farm_size_hectares: 18.5,
      years_farming: 4,
      primary_crop: 'Maize',
      primary_livestock: 'Cattle',
      notifications_enabled: true,
    },
    stats: {
      total_points: 245,
      current_tier: 'silver',
      crops_managed: 3,
      livestock_managed: 52,
      total_harvest_kg: 8150,
      total_revenue: 124350,
      achievements_unlocked: 3,
      current_streak: 9,
      best_streak: 16,
    },
    achievements: [
      {
        achievement_type: 'badge',
        achievement_name: 'First Crop',
        description: 'Plant your first crop',
        points_earned: 50,
        badge_icon: 'leaf',
        tier: 'bronze',
        progress_percentage: 100,
        is_unlocked: true,
      },
      {
        achievement_type: 'milestone',
        achievement_name: 'Storage Expert',
        description: 'Store 1000kg of produce',
        points_earned: 120,
        badge_icon: 'package',
        tier: 'silver',
        progress_percentage: 100,
        is_unlocked: true,
      },
      {
        achievement_type: 'streak',
        achievement_name: 'Data Champion',
        description: 'Keep logging farm activity consistently',
        points_earned: 75,
        badge_icon: 'activity',
        tier: 'silver',
        progress_percentage: 80,
        is_unlocked: false,
      },
    ],
    crops: [
      {
        key: 'maize',
        crop_name: 'North Block Maize',
        crop_type: 'Maize',
        variety: 'SC 403',
        planting_date: makeDate(-76),
        expected_harvest_date: makeDate(16),
        area_planted_hectares: 9.5,
        seed_quantity_kg: 42,
        fertilizer_type: 'Compound D',
        fertilizer_quantity_kg: 175,
        current_stage: 'flowering',
        soil_type: 'Loam',
        soil_ph: 6.4,
        moisture_level: 34,
        health_status: 'stressed',
        disease_detected: null,
        pest_detected: 'Fall armyworm',
        yield_estimate_kg: 21800,
        actual_yield_kg: null,
        estimated_revenue: 54500,
        notes:
          'Pest pressure is concentrated on the eastern section. Moisture is falling after a dry stretch.',
      },
      {
        key: 'groundnuts',
        crop_name: 'South Plot Groundnuts',
        crop_type: 'Groundnuts',
        variety: 'Makulu Red',
        planting_date: makeDate(-58),
        expected_harvest_date: makeDate(24),
        area_planted_hectares: 5.2,
        seed_quantity_kg: 19,
        fertilizer_type: 'Basal blend',
        fertilizer_quantity_kg: 58,
        current_stage: 'fruiting',
        soil_type: 'Sandy',
        soil_ph: 6.2,
        moisture_level: 49,
        health_status: 'healthy',
        disease_detected: null,
        pest_detected: null,
        yield_estimate_kg: 7900,
        actual_yield_kg: null,
        estimated_revenue: 43450,
        notes:
          'Good canopy cover and pod development. Drying space needs to be ready before harvest.',
      },
      {
        key: 'sorghum',
        crop_name: 'West Ridge Sorghum',
        crop_type: 'Sorghum',
        variety: 'Red Swazi',
        planting_date: makeDate(-148),
        expected_harvest_date: makeDate(-8),
        area_planted_hectares: 3.8,
        seed_quantity_kg: 12,
        fertilizer_type: 'Organic manure',
        fertilizer_quantity_kg: 90,
        current_stage: 'harvested',
        soil_type: 'Clay',
        soil_ph: 6.8,
        moisture_level: 42,
        health_status: 'healthy',
        disease_detected: null,
        pest_detected: null,
        yield_estimate_kg: 4600,
        actual_yield_kg: 4380,
        estimated_revenue: 26300,
        notes:
          'Harvest completed. Use this block as a reference for next season cost and yield comparisons.',
      },
    ],
    livestock: [
      {
        key: 'cattle',
        animal_type: 'Cattle',
        breed: 'Boran',
        quantity: 18,
        average_weight_kg: 238,
        acquisition_date: makeDate(-320),
        health_status: 'healthy',
        last_vaccinated: makeDate(-42),
        next_vaccination_due: makeDate(7),
        feed_type: 'Hay and concentrate',
        daily_feed_quantity_kg: 4.8,
        water_liters_per_day: 26,
        shelter_type: 'Covered pen',
        space_per_animal_sqm: 4.5,
        mortality_count: 0,
        production_type: 'dairy',
        monthly_production: 1520,
        production_unit: 'liters',
        estimated_value: 149000,
        notes:
          'Milk output remains steady, but the next vaccination cycle should be booked this week.',
      },
      {
        key: 'goats',
        animal_type: 'Goats',
        breed: 'Boer cross',
        quantity: 34,
        average_weight_kg: 39,
        acquisition_date: makeDate(-220),
        health_status: 'recovering',
        last_vaccinated: makeDate(-20),
        next_vaccination_due: makeDate(18),
        feed_type: 'Browse and supplement',
        daily_feed_quantity_kg: 1.7,
        water_liters_per_day: 6,
        shelter_type: 'Raised shelter',
        space_per_animal_sqm: 1.3,
        mortality_count: 1,
        production_type: 'meat',
        monthly_production: 0,
        production_unit: 'kg',
        estimated_value: 55800,
        notes:
          'One group recently recovered from respiratory stress. Keep airflow high in the shelter.',
      },
    ],
    storage: [
      {
        item_name: 'Stored maize grain',
        category: 'produce',
        quantity: 4200,
        unit: 'kg',
        storage_location: 'Main shed',
        storage_condition: 'dry',
        purchase_price_per_unit: 2.8,
        current_value: 12600,
        expiry_date: makeDate(120),
        last_checked_date: makeDate(-2),
        quality_status: 'good',
        notes: 'Bagged, elevated, and dry. Continue weekly pest checks.',
      },
      {
        item_name: 'Groundnut seed reserve',
        category: 'seeds',
        quantity: 350,
        unit: 'kg',
        storage_location: 'Seed room',
        storage_condition: 'sealed',
        purchase_price_per_unit: 19,
        current_value: 6650,
        expiry_date: makeDate(44),
        last_checked_date: makeDate(-3),
        quality_status: 'fair',
        notes: 'Ventilation needs attention during warm afternoons.',
      },
      {
        item_name: 'Urea stock',
        category: 'fertilizer',
        quantity: 24,
        unit: 'bags',
        storage_location: 'Input cage',
        storage_condition: 'dry',
        purchase_price_per_unit: 610,
        current_value: 14640,
        expiry_date: makeDate(280),
        last_checked_date: makeDate(-8),
        quality_status: 'good',
        notes: 'Enough stock for top dressing across the main maize block.',
      },
      {
        item_name: 'Damaged maize bags',
        category: 'produce',
        quantity: 180,
        unit: 'kg',
        storage_location: 'Old annex',
        storage_condition: 'ventilated',
        purchase_price_per_unit: 2.6,
        current_value: 360,
        expiry_date: makeDate(8),
        last_checked_date: makeDate(-1),
        quality_status: 'poor',
        notes: 'Inspect immediately and salvage what can still be sold or fed.',
      },
    ],
  }
}

function buildSmallholderScenario() {
  return {
    profile: {
      first_name: 'Demo',
      last_name: 'Farmer',
      phone: '+260977000111',
      region: 'Eastern Region',
      farm_size_hectares: 6.4,
      years_farming: 1,
      primary_crop: 'Maize',
      primary_livestock: 'Goats',
      notifications_enabled: true,
    },
    stats: {
      total_points: 135,
      current_tier: 'bronze',
      crops_managed: 2,
      livestock_managed: 18,
      total_harvest_kg: 2920,
      total_revenue: 43200,
      achievements_unlocked: 2,
      current_streak: 5,
      best_streak: 7,
    },
    achievements: [
      {
        achievement_type: 'badge',
        achievement_name: 'First Crop',
        description: 'Plant your first crop',
        points_earned: 50,
        badge_icon: 'leaf',
        tier: 'bronze',
        progress_percentage: 100,
        is_unlocked: true,
      },
      {
        achievement_type: 'milestone',
        achievement_name: 'Weather Watcher',
        description: 'Check weather and timing signals regularly',
        points_earned: 60,
        badge_icon: 'cloud',
        tier: 'bronze',
        progress_percentage: 100,
        is_unlocked: true,
      },
      {
        achievement_type: 'streak',
        achievement_name: 'Market Master',
        description: 'Track prices before selling produce',
        points_earned: 80,
        badge_icon: 'trending-up',
        tier: 'bronze',
        progress_percentage: 40,
        is_unlocked: false,
      },
    ],
    crops: [
      {
        key: 'maize',
        crop_name: 'Home Plot Maize',
        crop_type: 'Maize',
        variety: 'PAN 53',
        planting_date: makeDate(-64),
        expected_harvest_date: makeDate(22),
        area_planted_hectares: 3.1,
        seed_quantity_kg: 14,
        fertilizer_type: 'Compound D',
        fertilizer_quantity_kg: 55,
        current_stage: 'vegetative',
        soil_type: 'Loam',
        soil_ph: 6.3,
        moisture_level: 39,
        health_status: 'stressed',
        disease_detected: null,
        pest_detected: null,
        yield_estimate_kg: 6100,
        actual_yield_kg: null,
        estimated_revenue: 15250,
        notes: 'Crop is holding, but moisture stress is becoming visible after a dry week.',
      },
      {
        key: 'sorghum',
        crop_name: 'Back Plot Sorghum',
        crop_type: 'Sorghum',
        variety: 'Local mix',
        planting_date: makeDate(-42),
        expected_harvest_date: makeDate(35),
        area_planted_hectares: 1.2,
        seed_quantity_kg: 8,
        fertilizer_type: 'Compost',
        fertilizer_quantity_kg: 30,
        current_stage: 'flowering',
        soil_type: 'Mixed',
        soil_ph: 6.6,
        moisture_level: 47,
        health_status: 'healthy',
        disease_detected: null,
        pest_detected: null,
        yield_estimate_kg: 1450,
        actual_yield_kg: null,
        estimated_revenue: 7250,
        notes: 'Strong recovery after last light rainfall.',
      },
    ],
    livestock: [
      {
        key: 'goats',
        animal_type: 'Goats',
        breed: 'Local cross',
        quantity: 12,
        average_weight_kg: 31,
        acquisition_date: makeDate(-170),
        health_status: 'healthy',
        last_vaccinated: makeDate(-28),
        next_vaccination_due: makeDate(12),
        feed_type: 'Browse and maize bran',
        daily_feed_quantity_kg: 1.2,
        water_liters_per_day: 5,
        shelter_type: 'Raised shelter',
        space_per_animal_sqm: 1,
        mortality_count: 0,
        production_type: 'meat',
        monthly_production: 0,
        production_unit: 'kg',
        estimated_value: 16800,
        notes: 'Good energy levels, but routine vaccination planning should improve.',
      },
      {
        key: 'chickens',
        animal_type: 'Chickens',
        breed: 'Village mix',
        quantity: 6,
        average_weight_kg: 1.8,
        acquisition_date: makeDate(-96),
        health_status: 'recovering',
        last_vaccinated: makeDate(-16),
        next_vaccination_due: makeDate(9),
        feed_type: 'Mixed grain',
        daily_feed_quantity_kg: 0.7,
        water_liters_per_day: 1.5,
        shelter_type: 'Wire coop',
        space_per_animal_sqm: 0.35,
        mortality_count: 1,
        production_type: 'eggs',
        monthly_production: 88,
        production_unit: 'eggs',
        estimated_value: 900,
        notes: 'Recovery is improving, but the coop needs more consistent cleaning.',
      },
    ],
    storage: [
      {
        item_name: 'Maize meal reserve',
        category: 'produce',
        quantity: 260,
        unit: 'kg',
        storage_location: 'Kitchen store',
        storage_condition: 'dry',
        purchase_price_per_unit: 3.1,
        current_value: 910,
        expiry_date: makeDate(46),
        last_checked_date: makeDate(-2),
        quality_status: 'good',
        notes: 'Enough household reserve for the next few weeks.',
      },
      {
        item_name: 'Bean seed stock',
        category: 'seeds',
        quantity: 75,
        unit: 'kg',
        storage_location: 'Plastic drums',
        storage_condition: 'sealed',
        purchase_price_per_unit: 22,
        current_value: 1650,
        expiry_date: makeDate(18),
        last_checked_date: makeDate(-4),
        quality_status: 'fair',
        notes: 'Use soon or refresh the stock before the next season.',
      },
    ],
  }
}

function getScenarioForUser(email) {
  const base =
    email === 'samuelkaomaa@gmail.com'
      ? buildMixedFarmScenario()
      : buildSmallholderScenario()

  if (email === 'samuelkaomaa@gmail.com') {
    return {
      ...base,
      logs: [
        {
          log_date: makeDate(-9),
          log_type: 'weather',
          activity_description:
            'Recorded a hot dry day and noted falling field moisture across the maize block.',
          weather_condition: 'Sunny and dry',
          temperature_celsius: 33,
          rainfall_mm: 0,
          labor_hours: 1,
          notes: 'Dry spell is becoming a planning issue.',
        },
        {
          log_date: makeDate(-7),
          log_type: 'crop_activity',
          cropKey: 'maize',
          activity_description:
            'Scouted the maize field and found fresh fall armyworm damage on the eastern rows.',
          weather_condition: 'Warm',
          temperature_celsius: 31,
          rainfall_mm: 0,
          labor_hours: 4,
          notes: 'Spray crew should revisit in 72 hours.',
        },
        {
          log_date: makeDate(-6),
          log_type: 'expense',
          cropKey: 'maize',
          activity_description:
            'Purchased pesticide and arranged labor for targeted pest treatment.',
          labor_hours: 2,
          expense_amount: 1450,
          expense_category: 'Crop protection',
          notes: 'Track effectiveness against next scouting report.',
        },
        {
          log_date: makeDate(-4),
          log_type: 'livestock_activity',
          livestockKey: 'cattle',
          activity_description: 'Reviewed dairy feed mix and checked milk output consistency.',
          weather_condition: 'Sunny',
          temperature_celsius: 29,
          labor_hours: 3,
          notes: 'Vaccination booking should be confirmed soon.',
        },
        {
          log_date: makeDate(-3),
          log_type: 'observation',
          cropKey: 'groundnuts',
          activity_description:
            'Groundnut field is showing strong pod development and even canopy growth.',
          weather_condition: 'Partly cloudy',
          temperature_celsius: 28,
          rainfall_mm: 4,
          notes: 'Begin preparing drying surfaces and buyer options.',
        },
        {
          log_date: makeDate(-2),
          log_type: 'harvest',
          cropKey: 'sorghum',
          activity_description: 'Completed final sorghum threshing and moved cleaned grain to storage.',
          labor_hours: 5,
          harvest_quantity_kg: 4380,
          quality_grade: 'A',
          notes: 'Yield slightly below estimate but grain quality is strong.',
        },
        {
          log_date: makeDate(-1),
          log_type: 'observation',
          livestockKey: 'goats',
          activity_description:
            'Goat group remains in recovery and is feeding better after shelter ventilation was improved.',
          weather_condition: 'Warm afternoon',
          temperature_celsius: 30,
          labor_hours: 1.5,
          notes: 'Keep watching respiratory symptoms through the week.',
        },
      ],
      recommendations: [
        {
          cropKey: 'maize',
          recommendation_type: 'alert',
          priority: 'high',
          title: 'Contain fall armyworm in the maize block',
          description:
            'Armyworm pressure is active in the maize block. The next 72 hours matter for limiting spread and protecting yield.',
          action_items: ['Spray affected rows', 'Re-scout after 3 days', 'Log damage progression'],
          estimated_impact: 'Reduce yield loss and stop spread.',
        },
        {
          livestockKey: 'cattle',
          recommendation_type: 'suggestion',
          priority: 'medium',
          title: 'Book the next cattle vaccination visit',
          description:
            'The dairy group has a vaccination due window approaching. Preventive action is cheaper than treatment.',
          action_items: ['Call the vet', 'Prepare herd records', 'Set the next due date in the logbook'],
          estimated_impact: 'Lower health risk and keep production stable.',
        },
        {
          recommendation_type: 'warning',
          priority: 'medium',
          title: 'Move poor-quality maize bags first',
          description:
            'Damaged maize bags in the old annex are at risk of turning into a direct storage loss if left untouched.',
          action_items: ['Inspect the damaged bags', 'Separate salvageable stock', 'Log quality loss if any'],
          estimated_impact: 'Protect stored value and improve storage planning.',
        },
      ],
      notifications: [
        {
          notification_type: 'alert',
          title: 'Pest pressure recorded in maize',
          message:
            'North Block Maize has active pest pressure and should be rescanned within 72 hours.',
          action_url: '/dashboard/crops',
        },
        {
          notification_type: 'reminder',
          title: 'Vaccination window approaching',
          message:
            'The dairy cattle group has a vaccination due soon. Book the visit before the date slips.',
          action_url: '/dashboard/livestock',
        },
        {
          notification_type: 'news',
          title: 'Storage quality check due',
          message: 'One produce stock item is marked poor quality and should be reviewed now.',
          action_url: '/dashboard/storage',
        },
      ],
    }
  }

  return {
    ...base,
    logs: [
      {
        log_date: makeDate(-8),
        log_type: 'weather',
        activity_description:
          'Observed a dry windy afternoon and noted that topsoil is losing moisture faster than usual.',
        weather_condition: 'Dry and windy',
        temperature_celsius: 32,
        rainfall_mm: 0,
        labor_hours: 0.5,
        notes: 'Mulch is becoming more important on the maize plot.',
      },
      {
        log_date: makeDate(-6),
        log_type: 'crop_activity',
        cropKey: 'maize',
        activity_description:
          'Applied weeding and inspected maize for moisture stress and uneven growth.',
        weather_condition: 'Sunny',
        temperature_celsius: 30,
        labor_hours: 3,
        notes: 'No major pest damage seen, but the crop is thirsty.',
      },
      {
        log_date: makeDate(-5),
        log_type: 'expense',
        activity_description: 'Bought small irrigation hoses and transport for the field.',
        expense_amount: 520,
        expense_category: 'Water management',
        labor_hours: 1,
        notes: 'Should reduce pressure if dry weather continues.',
      },
      {
        log_date: makeDate(-3),
        log_type: 'livestock_activity',
        livestockKey: 'goats',
        activity_description:
          'Checked goat shelter, feed supply, and body condition after a warm afternoon.',
        weather_condition: 'Warm',
        temperature_celsius: 29,
        labor_hours: 1.5,
        notes: 'Vaccination schedule should be prepared in advance.',
      },
      {
        log_date: makeDate(-2),
        log_type: 'observation',
        livestockKey: 'chickens',
        activity_description:
          'Chicken recovery is improving after coop cleaning and feed changes.',
        weather_condition: 'Partly cloudy',
        temperature_celsius: 27,
        labor_hours: 1,
        notes: 'Repeat coop cleaning on schedule.',
      },
    ],
    recommendations: [
      {
        cropKey: 'maize',
        recommendation_type: 'warning',
        priority: 'medium',
        title: 'Watch maize moisture closely this week',
        description:
          'The maize plot is trending toward moisture stress. Smallholder plots usually benefit from early action before leaf curling becomes severe.',
        action_items: ['Check moisture every two days', 'Mulch exposed areas', 'Use irrigation on the driest section first'],
        estimated_impact: 'Protect early yield potential.',
      },
      {
        livestockKey: 'chickens',
        recommendation_type: 'suggestion',
        priority: 'medium',
        title: 'Keep poultry recovery on a schedule',
        description:
          'The chickens are improving, but shelter hygiene and follow-up checks need to stay consistent.',
        action_items: ['Clean the coop regularly', 'Watch appetite and movement', 'Prepare the next vaccine date'],
        estimated_impact: 'Reduce repeat health setbacks.',
      },
    ],
    notifications: [
      {
        notification_type: 'reminder',
        title: 'Dry spell watch',
        message: 'Your maize plot is showing moisture pressure. Increase checks this week.',
        action_url: '/dashboard/crops',
      },
      {
        notification_type: 'alert',
        title: 'Poultry recovery follow-up',
        message: 'Log another poultry health check to keep the recovery history visible.',
        action_url: '/dashboard/logbook',
      },
    ],
  }
}

async function insertMany(client, tableName, rows) {
  if (rows.length === 0) {
    return
  }

  const columns = Object.keys(rows[0])
  const values = []
  const placeholders = rows.map((row, rowIndex) => {
    const tuple = columns.map((column, columnIndex) => {
      values.push(row[column])
      return `$${rowIndex * columns.length + columnIndex + 1}`
    })

    return `(${tuple.join(', ')})`
  })

  await client.query(
    `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${placeholders.join(', ')}`,
    values,
  )
}

async function seedUser(client, user) {
  const scenario = getScenarioForUser(user.email)
  const cropIdMap = new Map()
  const livestockIdMap = new Map()
  const nowIso = new Date().toISOString()

  await client.query('DELETE FROM public.notifications WHERE user_id = $1', [user.id])
  await client.query('DELETE FROM public.recommendations WHERE user_id = $1', [user.id])
  await client.query('DELETE FROM public.farm_logs WHERE user_id = $1', [user.id])
  await client.query('DELETE FROM public.storage WHERE user_id = $1', [user.id])
  await client.query('DELETE FROM public.livestock WHERE user_id = $1', [user.id])
  await client.query('DELETE FROM public.crops WHERE user_id = $1', [user.id])
  await client.query('DELETE FROM public.achievements WHERE user_id = $1', [user.id])

  await client.query(
    `
      INSERT INTO public.profiles (
        id,
        first_name,
        last_name,
        phone,
        region,
        farm_size_hectares,
        years_farming,
        primary_crop,
        primary_livestock,
        notifications_enabled
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        phone = EXCLUDED.phone,
        region = EXCLUDED.region,
        farm_size_hectares = EXCLUDED.farm_size_hectares,
        years_farming = EXCLUDED.years_farming,
        primary_crop = EXCLUDED.primary_crop,
        primary_livestock = EXCLUDED.primary_livestock,
        notifications_enabled = EXCLUDED.notifications_enabled
    `,
    [
      user.id,
      scenario.profile.first_name,
      scenario.profile.last_name,
      scenario.profile.phone,
      scenario.profile.region,
      scenario.profile.farm_size_hectares,
      scenario.profile.years_farming,
      scenario.profile.primary_crop,
      scenario.profile.primary_livestock,
      scenario.profile.notifications_enabled,
    ],
  )

  await client.query(
    `
      INSERT INTO public.user_stats (
        id,
        total_points,
        current_tier,
        crops_managed,
        livestock_managed,
        total_harvest_kg,
        total_revenue,
        achievements_unlocked,
        current_streak,
        best_streak
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        total_points = EXCLUDED.total_points,
        current_tier = EXCLUDED.current_tier,
        crops_managed = EXCLUDED.crops_managed,
        livestock_managed = EXCLUDED.livestock_managed,
        total_harvest_kg = EXCLUDED.total_harvest_kg,
        total_revenue = EXCLUDED.total_revenue,
        achievements_unlocked = EXCLUDED.achievements_unlocked,
        current_streak = EXCLUDED.current_streak,
        best_streak = EXCLUDED.best_streak
    `,
    [
      user.id,
      scenario.stats.total_points,
      scenario.stats.current_tier,
      scenario.stats.crops_managed,
      scenario.stats.livestock_managed,
      scenario.stats.total_harvest_kg,
      scenario.stats.total_revenue,
      scenario.stats.achievements_unlocked,
      scenario.stats.current_streak,
      scenario.stats.best_streak,
    ],
  )

  const cropRows = scenario.crops.map((crop) => {
    const id = crypto.randomUUID()
    cropIdMap.set(crop.key, id)

    return {
      id,
      user_id: user.id,
      crop_name: crop.crop_name,
      crop_type: crop.crop_type,
      variety: crop.variety,
      planting_date: crop.planting_date,
      expected_harvest_date: crop.expected_harvest_date,
      area_planted_hectares: crop.area_planted_hectares,
      seed_quantity_kg: crop.seed_quantity_kg,
      fertilizer_type: crop.fertilizer_type,
      fertilizer_quantity_kg: crop.fertilizer_quantity_kg,
      current_stage: crop.current_stage,
      soil_type: crop.soil_type,
      soil_ph: crop.soil_ph,
      moisture_level: crop.moisture_level,
      health_status: crop.health_status,
      disease_detected: crop.disease_detected,
      pest_detected: crop.pest_detected,
      yield_estimate_kg: crop.yield_estimate_kg,
      actual_yield_kg: crop.actual_yield_kg,
      estimated_revenue: crop.estimated_revenue,
      notes: crop.notes,
    }
  })

  await insertMany(client, 'public.crops', cropRows)

  const livestockRows = scenario.livestock.map((record) => {
    const id = crypto.randomUUID()
    livestockIdMap.set(record.key, id)

    return {
      id,
      user_id: user.id,
      animal_type: record.animal_type,
      breed: record.breed,
      quantity: record.quantity,
      average_weight_kg: record.average_weight_kg,
      acquisition_date: record.acquisition_date,
      health_status: record.health_status,
      last_vaccinated: record.last_vaccinated,
      next_vaccination_due: record.next_vaccination_due,
      feed_type: record.feed_type,
      daily_feed_quantity_kg: record.daily_feed_quantity_kg,
      water_liters_per_day: record.water_liters_per_day,
      shelter_type: record.shelter_type,
      space_per_animal_sqm: record.space_per_animal_sqm,
      mortality_count: record.mortality_count,
      production_type: record.production_type,
      monthly_production: record.monthly_production,
      production_unit: record.production_unit,
      estimated_value: record.estimated_value,
      notes: record.notes,
    }
  })

  await insertMany(client, 'public.livestock', livestockRows)

  const storageRows = scenario.storage.map((item) => ({
    id: crypto.randomUUID(),
    user_id: user.id,
    item_name: item.item_name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    storage_location: item.storage_location,
    storage_condition: item.storage_condition,
    purchase_price_per_unit: item.purchase_price_per_unit,
    current_value: item.current_value,
    expiry_date: item.expiry_date,
    last_checked_date: item.last_checked_date,
    quality_status: item.quality_status,
    notes: item.notes,
  }))

  await insertMany(client, 'public.storage', storageRows)

  const logRows = scenario.logs.map((log) => ({
    id: crypto.randomUUID(),
    user_id: user.id,
    log_date: log.log_date,
    log_type: log.log_type,
    crop_id: log.cropKey ? cropIdMap.get(log.cropKey) ?? null : null,
    livestock_id: log.livestockKey ? livestockIdMap.get(log.livestockKey) ?? null : null,
    activity_description: log.activity_description,
    weather_condition: log.weather_condition ?? null,
    temperature_celsius: log.temperature_celsius ?? null,
    rainfall_mm: log.rainfall_mm ?? null,
    labor_hours: log.labor_hours ?? null,
    expense_amount: log.expense_amount ?? null,
    expense_category: log.expense_category ?? null,
    harvest_quantity_kg: log.harvest_quantity_kg ?? null,
    quality_grade: log.quality_grade ?? null,
    notes: log.notes ?? null,
  }))

  await insertMany(client, 'public.farm_logs', logRows)

  const recommendationRows = scenario.recommendations.map((recommendation) => ({
    id: crypto.randomUUID(),
    user_id: user.id,
    crop_id: recommendation.cropKey ? cropIdMap.get(recommendation.cropKey) ?? null : null,
    livestock_id: recommendation.livestockKey
      ? livestockIdMap.get(recommendation.livestockKey) ?? null
      : null,
    recommendation_type: recommendation.recommendation_type,
    priority: recommendation.priority,
    title: recommendation.title,
    description: recommendation.description,
    action_items: recommendation.action_items,
    estimated_impact: recommendation.estimated_impact,
    is_read: false,
    is_resolved: false,
  }))

  await insertMany(client, 'public.recommendations', recommendationRows)

  const notificationRows = scenario.notifications.map((notification, index) => ({
    id: crypto.randomUUID(),
    user_id: user.id,
    notification_type: notification.notification_type,
    title: notification.title,
    message: notification.message,
    action_url: notification.action_url,
    is_read: index === 0,
    read_at: index === 0 ? nowIso : null,
    is_deleted: false,
  }))

  await insertMany(client, 'public.notifications', notificationRows)

  const achievementRows = scenario.achievements.map((achievement) => ({
    id: crypto.randomUUID(),
    user_id: user.id,
    achievement_type: achievement.achievement_type,
    achievement_name: achievement.achievement_name,
    description: achievement.description,
    points_earned: achievement.points_earned,
    badge_icon: achievement.badge_icon,
    tier: achievement.tier,
    progress_percentage: achievement.progress_percentage,
    unlocked_at: achievement.is_unlocked ? nowIso : null,
    is_unlocked: achievement.is_unlocked,
  }))

  await insertMany(client, 'public.achievements', achievementRows)

  console.log(
    `Seeded showcase data for ${user.email}: ${cropRows.length} crops, ${livestockRows.length} livestock groups, ${storageRows.length} storage items, ${logRows.length} logs.`,
  )
}

async function main() {
  const envContent = await fs.readFile(envPath, 'utf8')
  const env = parseEnvFile(envContent)
  const rawConnectionString =
    env.POSTGRES_URL_NON_POOLING ?? env.POSTGRES_URL ?? env.POSTGRES_PRISMA_URL

  if (!rawConnectionString) {
    throw new Error('Missing POSTGRES_URL_NON_POOLING, POSTGRES_URL, or POSTGRES_PRISMA_URL in .env')
  }

  const connectionUrl = new URL(rawConnectionString)
  connectionUrl.searchParams.delete('sslmode')
  connectionUrl.searchParams.delete('supa')
  connectionUrl.searchParams.delete('pgbouncer')

  const client = new Client({
    connectionString: connectionUrl.toString(),
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  })

  await client.connect()

  try {
    const usersResult = await client.query(`
      SELECT id, email
      FROM auth.users
      ORDER BY created_at ASC
    `)

    if (usersResult.rows.length === 0) {
      throw new Error('No auth users were found. Create at least one user before seeding showcase data.')
    }

    await client.query('BEGIN')

    for (const user of usersResult.rows) {
      await seedUser(client, user)
    }

    await client.query("NOTIFY pgrst, 'reload schema';")
    await client.query('COMMIT')
    console.log(`Showcase seeding complete for ${usersResult.rows.length} user(s).`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
