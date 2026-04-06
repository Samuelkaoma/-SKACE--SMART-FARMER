'use client'

import { Bell, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DashboardHeaderProps {
  unreadNotifications: number
  userName: string
}

export function DashboardHeader({
  unreadNotifications,
  userName,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-emerald-200/70 bg-white/85 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 md:h-20 md:flex-row md:items-center md:justify-between md:py-0">
        <div className="w-full max-w-xl">
          <label className="sr-only" htmlFor="dashboard-search">
            Search across your farm records
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="dashboard-search"
              className="border-emerald-200 bg-white pl-10 shadow-sm"
              placeholder="Search crops, livestock, storage, and recommendations"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 md:justify-end">
          <Button
            className="relative border-emerald-200 hover:bg-emerald-50"
            size="icon"
            type="button"
            variant="outline"
          >
            <Bell className="h-5 w-5 text-emerald-800" />
            {unreadNotifications > 0 ? (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            ) : null}
          </Button>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#0f766e_100%)] font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {userName}
              </p>
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                Smart Farmer
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
