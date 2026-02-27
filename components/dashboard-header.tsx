'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  const [userName, setUserName] = useState<string>('Farmer')
  const [notifications, setNotifications] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setUserName(user.email.split('@')[0])
        }

        // Get unread notifications count
        const { data: notifs } = await supabase
          .from('notifications')
          .select('id')
          .eq('is_read', false)
          .limit(10)

        if (notifs) {
          setNotifications(notifs.length)
        }
      } catch (error) {
        console.log('[v0] Error loading header data:', error)
      }
    }

    loadUserData()
  }, [supabase])

  return (
    <header className="h-16 border-b border-emerald-200 bg-white/80 backdrop-blur px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search crops, livestock, recommendations..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-emerald-50"
          >
            <Bell className="w-5 h-5 text-emerald-700" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">Welcome, {userName}</p>
            <p className="text-xs text-gray-500">Smart Farmer</p>
          </div>
        </div>
      </div>
    </header>
  )
}
