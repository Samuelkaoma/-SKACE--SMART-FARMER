import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck,
  ChartColumnIncreasing,
  CloudSun,
  ShieldCheck,
  Sprout,
  Tractor,
  Warehouse,
} from 'lucide-react'

export interface LandingFeature {
  title: string
  description: string
  icon: LucideIcon
}

export interface LandingMetric {
  label: string
  value: string
  note: string
}

export const landingMetrics: LandingMetric[] = [
  {
    label: 'Workflows',
    value: '5 connected modules',
    note: 'Crops, livestock, storage, logbook, and analytics in one system.',
  },
  {
    label: 'Guidance',
    value: '1 farm command center',
    note: 'Recommendations, field guide, market pulse, and next-step playbooks.',
  },
  {
    label: 'Readiness',
    value: 'Structured data capture',
    note: 'Richer inputs now support better future forecasting and coaching.',
  },
]

export const landingFeatures: LandingFeature[] = [
  {
    title: 'Crop intelligence',
    description:
      'Capture planting dates, field size, soil conditions, disease signals, and yield expectations in one workflow.',
    icon: Sprout,
  },
  {
    title: 'Livestock management',
    description:
      'Track herd health, vaccinations, feed, water, production, and estimated value with update-friendly records.',
    icon: Tractor,
  },
  {
    title: 'Storage oversight',
    description:
      'Monitor inventory quality, expiry risk, storage conditions, and current value before losses grow.',
    icon: Warehouse,
  },
  {
    title: 'Operational logbook',
    description:
      'Record activities, weather, expenses, harvest events, and observations so patterns can emerge over time.',
    icon: CloudSun,
  },
  {
    title: 'Decision support',
    description:
      'Surface weather, disease, market, and farm-health alerts in a dashboard that points users toward the next best action.',
    icon: ChartColumnIncreasing,
  },
  {
    title: 'Production-grade foundation',
    description:
      'Shared services, guarded routes, and schema-aligned data flows make the product easier to trust and easier to extend.',
    icon: ShieldCheck,
  },
]

export const operatingPrinciples = [
  {
    title: 'Guide the next move',
    description:
      'The product should help farmers decide what to do next, not just store information in forms.',
  },
  {
    title: 'Collect useful evidence',
    description:
      'Every core form now captures more of the field, herd, storage, and logbook context needed for practical insights.',
  },
  {
    title: 'Scale with clear boundaries',
    description:
      'Repositories, services, validation, and server-led dashboard loading reduce coupling as the intelligence layer grows.',
  },
]

export const trustPoints = [
  'Dashboard and API behavior now align with the real Supabase schema instead of placeholder fields.',
  'Users can add, edit, and remove crop, livestock, storage, settings, and logbook records from the app.',
  'Route protection, validation helpers, and server-first loading make the product more credible for deployment.',
  'The current version is pitchable now and positioned for external weather feeds, multilingual coaching, and richer disease intelligence next.',
]

export const ctaLinks = {
  primary: '/auth/sign-up',
  story: '/about',
  signin: '/auth/login',
}
