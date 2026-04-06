import { getServerSessionOrRedirect } from '@/lib/auth/server'
import { getDashboardOverviewData } from '@/lib/services/dashboard-service'

import { DashboardOverview } from '@/components/dashboard/dashboard-overview'

export default async function DashboardHome() {
  const { supabase, user } = await getServerSessionOrRedirect()
  const dashboardData = await getDashboardOverviewData({
    supabase,
    userId: user.id,
  })

  return <DashboardOverview data={dashboardData} />
}
