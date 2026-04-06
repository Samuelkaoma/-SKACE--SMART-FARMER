'use client'

import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardNav } from '@/components/dashboard-nav'

interface DashboardShellProps {
  children: ReactNode
  unreadNotifications: number
  userName: string
}

export function DashboardShell({
  children,
  unreadNotifications,
  userName,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),transparent_32%),linear-gradient(180deg,#f6fff9_0%,#ffffff_52%,#f0fdf8_100%)]">
      <div className="flex min-h-screen">
        <DashboardNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader
            unreadNotifications={unreadNotifications}
            userName={userName}
          />
          <main className="flex-1 overflow-auto">
            <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</div>
          </main>
        </div>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
