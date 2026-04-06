import { getServerSessionOrRedirect } from '@/lib/auth/server'

import { DashboardShell } from '@/components/dashboard/dashboard-shell'

function resolveDashboardUserName(email: string | null) {
  if (!email) {
    return 'Farmer'
  }

  const localPart = email.split('@')[0]?.trim()

  if (!localPart) {
    return 'Farmer'
  }

  return localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getServerSessionOrRedirect()

  return (
    <DashboardShell
      unreadNotifications={0}
      userEmail={user.email}
      userId={user.id}
      userName={resolveDashboardUserName(user.email)}
    >
      {children}
    </DashboardShell>
  )
}
