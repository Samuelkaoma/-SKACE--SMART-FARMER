'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Leaf, 
  Home, 
  Wheat, 
  Dumbbell, 
  Box, 
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/crops', label: 'My Crops', icon: Wheat },
  { href: '/dashboard/livestock', label: 'Livestock', icon: Dumbbell },
  { href: '/dashboard/storage', label: 'Storage', icon: Box },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="border-emerald-200 hover:bg-emerald-50"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <nav className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-emerald-900 to-emerald-800
        border-r border-emerald-700 flex flex-col transition-transform duration-300 z-40
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-emerald-700">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center group-hover:bg-emerald-300 transition">
              <Leaf className="w-6 h-6 text-emerald-900" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-white text-lg">SmartFarmer</h1>
              <p className="text-xs text-emerald-200">SKACE Edition</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-6 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${active
                    ? 'bg-emerald-400 text-emerald-900 font-semibold shadow-lg'
                    : 'text-emerald-100 hover:bg-emerald-700'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Settings & Logout */}
        <div className="border-t border-emerald-700 p-4 space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-emerald-700 transition"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
