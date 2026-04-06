import type { GuideModule } from '@/lib/types/farm'

export interface GuideLibraryEntry extends GuideModule {
  alwaysInclude?: boolean
  cropTypes?: string[]
  livestockTypes?: string[]
  noviceOnly?: boolean
  requiresStorage?: boolean
  requiresHeat?: boolean
  requiresDryConditions?: boolean
}

export const GUIDE_LIBRARY: GuideLibraryEntry[] = [
  {
    id: 'farm-baseline',
    title: 'Build a reliable farm baseline',
    category: 'Foundation',
    summary:
      'Start by recording your land, crop blocks, livestock groups, and storage items so every later recommendation is tied to something real.',
    favorableSignals: [
      'Each field or group has a clear name',
      'Planting dates and herd counts are recorded',
      'You can compare this week against last week',
    ],
    cautionSignals: [
      'You rely on memory instead of written records',
      'You do not know which plot had the problem',
      'Input costs and harvests are not being tracked',
    ],
    nextSteps: [
      'Name each crop block clearly',
      'Record quantities, dates, and health notes weekly',
      'Use the logbook after each important activity',
    ],
    recordsToKeep: [
      'Planting dates',
      'Field size and crop variety',
      'Livestock counts and health notes',
      'Storage quantity and quality checks',
    ],
    alwaysInclude: true,
  },
  {
    id: 'conditions-reading',
    title: 'Read whether conditions are favorable',
    category: 'Timing',
    summary:
      'Good farm timing comes from checking rainfall, heat, moisture, crop stage, and animal stress together instead of relying on one signal alone.',
    favorableSignals: [
      'Rainfall or irrigation is steady',
      'Temperature is not extreme',
      'Crop moisture and health readings are stable',
    ],
    cautionSignals: [
      'Hot days and dry soil appear together',
      'Disease or pest signals are increasing',
      'Animals are stressed while water demand is rising',
    ],
    nextSteps: [
      'Review dashboard condition cards twice a week',
      'Delay non-urgent spraying during extreme heat',
      'Increase field scouting when weather turns sharply',
    ],
    recordsToKeep: [
      'Rainfall or irrigation notes',
      'Soil moisture readings',
      'Temperature notes from the field',
      'Weekly crop and animal health observations',
    ],
    alwaysInclude: true,
  },
  {
    id: 'maize-establishment',
    title: 'Maize establishment and protection',
    category: 'Crop guide',
    summary:
      'Maize performs best when planting is timely, early growth is protected, and pest pressure is handled before it spreads across the block.',
    favorableSignals: [
      'Moisture is holding after planting',
      'Leaves are evenly colored and upright',
      'No fresh pest damage is appearing on new growth',
    ],
    cautionSignals: [
      'Leaves are curling or yellowing',
      'Armyworm or stem borer damage is visible',
      'The field is drying out during vegetative growth',
    ],
    nextSteps: [
      'Scout the field row by row every few days',
      'Treat pest hotspots before they spread',
      'Record fertilizer timing and visible response',
    ],
    recordsToKeep: [
      'Planting date and variety',
      'Soil moisture and fertilizer use',
      'Pest or disease observations',
      'Expected harvest date',
    ],
    cropTypes: ['Maize'],
  },
  {
    id: 'groundnut-guide',
    title: 'Groundnut flowering and harvest timing',
    category: 'Crop guide',
    summary:
      'Groundnuts need clean weed control, stable moisture during pod development, and careful drying plans before storage.',
    favorableSignals: [
      'Canopy cover is even',
      'Pod development is progressing without stress',
      'Drying and storage space are ready before harvest',
    ],
    cautionSignals: [
      'Pods are forming unevenly',
      'Warm damp conditions are affecting drying',
      'Harvest is approaching without storage preparation',
    ],
    nextSteps: [
      'Check pod development weekly',
      'Prepare drying surfaces early',
      'Move harvested nuts quickly into dry protected storage',
    ],
    recordsToKeep: [
      'Field observations during flowering',
      'Expected harvest window',
      'Drying duration and quality notes',
      'Stored quantity after harvest',
    ],
    cropTypes: ['Groundnuts'],
  },
  {
    id: 'generic-crop-monitoring',
    title: 'Crop monitoring basics',
    category: 'Crop guide',
    summary:
      'Even when crop-specific playbooks are not available yet, weekly field checks still reveal the biggest risks before they become expensive.',
    favorableSignals: [
      'Growth stage is moving forward normally',
      'Color and canopy are mostly uniform',
      'Soil moisture is not swinging sharply',
    ],
    cautionSignals: [
      'Parts of the plot are lagging behind',
      'Moisture stress is showing up in leaves',
      'You notice symptoms but do not log them',
    ],
    nextSteps: [
      'Walk every plot on a weekly rhythm',
      'Take note of the first unusual symptom',
      'Record where the problem starts and how quickly it spreads',
    ],
    recordsToKeep: [
      'Growth stage by plot',
      'Health status by week',
      'Moisture and weather notes',
      'Treatment dates and outcomes',
    ],
    cropTypes: ['*'],
  },
  {
    id: 'cattle-health',
    title: 'Cattle health and vaccination rhythm',
    category: 'Livestock guide',
    summary:
      'Cattle performance improves when vaccination, feed, water, and heat stress are monitored on a schedule instead of after an outbreak.',
    favorableSignals: [
      'Vaccinations are booked before due dates',
      'Animals are eating and moving normally',
      'Water access is stable during hot days',
    ],
    cautionSignals: [
      'Weight or milk output is dropping',
      'Vaccination dates are close or overdue',
      'Animals are crowding or heat stressed',
    ],
    nextSteps: [
      'Review due vaccinations each week',
      'Check feed and water access daily',
      'Log any respiratory or digestive symptoms immediately',
    ],
    recordsToKeep: [
      'Vaccination dates',
      'Feed type and quantity',
      'Average weight or production notes',
      'Observed symptoms and treatment',
    ],
    livestockTypes: ['Cattle'],
  },
  {
    id: 'goat-health',
    title: 'Goat resilience and recovery checks',
    category: 'Livestock guide',
    summary:
      'Goats are resilient, but small respiratory or feeding issues spread quickly when crowded shelters and changing weather are ignored.',
    favorableSignals: [
      'Shelter stays dry and ventilated',
      'Recovered animals regain appetite quickly',
      'The herd remains active and alert',
    ],
    cautionSignals: [
      'Coughing or nasal discharge appears',
      'Group appetite drops suddenly',
      'Shelter moisture and crowding are increasing',
    ],
    nextSteps: [
      'Separate weak animals early',
      'Increase shelter checks after weather shifts',
      'Log recovery progress for recently sick groups',
    ],
    recordsToKeep: [
      'Health status by group',
      'Shelter notes',
      'Feed changes',
      'Vaccination and treatment history',
    ],
    livestockTypes: ['Goats'],
  },
  {
    id: 'generic-livestock-care',
    title: 'Livestock care basics',
    category: 'Livestock guide',
    summary:
      'Routine care wins: feed, water, shelter, vaccination, and quick symptom logging are the foundation of healthy livestock operations.',
    favorableSignals: [
      'Animals are active and feeding well',
      'Shelter and water are consistent',
      'Preventive care is scheduled ahead of time',
    ],
    cautionSignals: [
      'Health notes are being skipped',
      'Vaccinations are overdue',
      'Stress increases during weather extremes',
    ],
    nextSteps: [
      'Review each group weekly',
      'Log changes in appetite, weight, or movement',
      'Treat preventive care as a calendar task',
    ],
    recordsToKeep: [
      'Quantity by group',
      'Feed and water records',
      'Vaccination schedule',
      'Health and mortality notes',
    ],
    livestockTypes: ['*'],
  },
  {
    id: 'storage-protection',
    title: 'Protect value in storage',
    category: 'Storage guide',
    summary:
      'A good harvest still loses value if stored produce is not checked for moisture, pests, airflow, and expiry timing.',
    favorableSignals: [
      'Stock is dry, elevated, and regularly inspected',
      'Quality checks happen on a schedule',
      'Older stock is used or sold first',
    ],
    cautionSignals: [
      'Moisture or pests are building up',
      'Items are nearing expiry without a plan',
      'Storage notes are missing or irregular',
    ],
    nextSteps: [
      'Inspect stock weekly',
      'Move oldest stock first',
      'Record quality changes before losses spread',
    ],
    recordsToKeep: [
      'Quantity on hand',
      'Quality status',
      'Last checked date',
      'Expiry or spoilage notes',
    ],
    requiresStorage: true,
  },
  {
    id: 'dry-spell-response',
    title: 'Respond to dry spells early',
    category: 'Weather guide',
    summary:
      'Dry conditions are manageable when farmers act early with irrigation planning, mulch, scouting, and reduced stress on vulnerable crops.',
    favorableSignals: [
      'Moisture is still holding despite lower rainfall',
      'Critical plots are being prioritized',
      'Stress symptoms are identified early',
    ],
    cautionSignals: [
      'Rainfall is low and temperatures are high together',
      'Moisture readings are falling below safe levels',
      'Crop stress is appearing during sensitive stages',
    ],
    nextSteps: [
      'Prioritize water for the most vulnerable plots',
      'Reduce unnecessary field disturbance',
      'Increase scouting frequency until weather improves',
    ],
    recordsToKeep: [
      'Rainfall amounts',
      'Moisture levels',
      'Stress symptoms by plot',
      'Interventions taken during the dry spell',
    ],
    requiresDryConditions: true,
  },
  {
    id: 'heat-stress-response',
    title: 'Manage heat stress on the farm',
    category: 'Weather guide',
    summary:
      'Heat changes the timing of spraying, watering, feed demand, and animal comfort, so it should trigger a faster review rhythm.',
    favorableSignals: [
      'Work is being scheduled outside peak heat',
      'Water and shade are available',
      'High heat is not causing new visible stress',
    ],
    cautionSignals: [
      'Leaf scorch, wilting, or heavy panting are increasing',
      'Animals cluster around limited shade or water',
      'Spraying is still happening in peak heat',
    ],
    nextSteps: [
      'Move field work to cooler hours',
      'Increase shade and water access',
      'Review both crops and livestock after hot afternoons',
    ],
    recordsToKeep: [
      'Temperature notes',
      'Crop stress observations',
      'Animal comfort notes',
      'Adjusted work timings',
    ],
    requiresHeat: true,
  },
]
