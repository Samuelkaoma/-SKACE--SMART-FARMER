'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  BarChart3,
  BookOpen,
  Box,
  Compass,
  Home,
  Leaf,
  LogOut,
  Menu,
  Settings,
  Wheat,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/crops', label: 'My Crops', icon: Wheat },
  { href: '/dashboard/livestock', label: 'Livestock', icon: Leaf },
  { href: '/dashboard/logbook', label: 'Logbook', icon: BookOpen },
  { href: '/dashboard/learn', label: 'Learn', icon: Compass },
  { href: '/dashboard/storage', label: 'Storage', icon: Box },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    navItems.forEach((item) => router.prefetch(item.href))
    router.prefetch('/dashboard/settings')
  }, [router])

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      router.replace('/auth/login')
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <Button
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          size="icon"
          variant="outline"
          className="border-emerald-200 bg-white/90 shadow-sm hover:bg-emerald-50"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <nav
        className={`
          fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-emerald-950/20
          bg-[linear-gradient(180deg,#052e2b_0%,#064e3b_48%,#0f766e_100%)] px-4 py-6 text-white
          shadow-2xl transition-transform duration-300 md:static md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Link
          className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
          href="/dashboard"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300 text-emerald-950 transition group-hover:bg-emerald-200">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">SmartFarmer</p>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/80">
              SKACE Platform
            </p>
          </div>
        </Link>

        <div className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                className={`
                  flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition
                  ${active
                    ? 'bg-white text-emerald-950 shadow-lg'
                    : 'text-emerald-50/85 hover:bg-white/10 hover:text-white'}
                `}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
          <Link
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-emerald-50/85 transition hover:bg-white/10 hover:text-white"
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <button
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-emerald-50/85 transition hover:bg-rose-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="h-5 w-5" />
            <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
          </button>
        </div>
      </nav>

      {isOpen ? (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
          onClick={() => setIsOpen(false)}
          type="button"
        />
      ) : null}
    </>
  )
}
