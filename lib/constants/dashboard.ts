import type { PerformanceDataPoint } from '@/lib/types/farm'

export const DASHBOARD_CHART_COLORS = ['#0f9f6e', '#0e7490', '#f59e0b', '#1d4ed8']

export const DEFAULT_PERFORMANCE_DATA: PerformanceDataPoint[] = [
  { month: 'Jan', yield: 61, health: 70 },
  { month: 'Feb', yield: 67, health: 73 },
  { month: 'Mar', yield: 74, health: 77 },
  { month: 'Apr', yield: 81, health: 82 },
  { month: 'May', yield: 86, health: 85 },
]
