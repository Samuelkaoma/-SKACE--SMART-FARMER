import { getServerSessionOrRedirect } from '@/lib/auth/server'
import { getDashboardShellData } from '@/lib/services/dashboard-service'

import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { supabase, user } = await getServerSessionOrRedirect()
  const shellData = await getDashboardShellData({
    supabase,
    userId: user.id,
    email: user.email,
  })

  return (
    <DashboardShell
      unreadNotifications={shellData.unreadNotifications}
      userName={shellData.userName}
    >
      {children}
    </DashboardShell>
  )
}
