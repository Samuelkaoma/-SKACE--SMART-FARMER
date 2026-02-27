'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings, Bell, Lock, User } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [farmName, setFarmName] = useState('')
  const [region, setRegion] = useState('Lusaka')
  const [notifications, setNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        setEmail(user.email || '')

        const { data: profile } = await supabase
          .from('profiles')
          .select('farm_name, region, notifications_enabled')
          .eq('user_id', user.id)
          .single()

        if (profile) {
          setFarmName(profile.farm_name || '')
          setRegion(profile.region || 'Lusaka')
          setNotifications(profile.notifications_enabled !== false)
        }
      } catch (error) {
        console.log('[v0] Error loading settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [supabase])

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({
          farm_name: farmName,
          region,
          notifications_enabled: notifications,
        })
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Settings saved successfully!')
    } catch (error) {
      console.log('[v0] Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error

      toast.success('Password reset email sent!')
    } catch (error) {
      console.log('[v0] Error requesting password reset:', error)
      toast.error('Failed to send reset email')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-emerald-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>Update your farm information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="mt-2 bg-gray-50 border-gray-200"
            />
            <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
          </div>

          <div>
            <Label htmlFor="farm_name" className="text-sm font-medium">
              Farm Name
            </Label>
            <Input
              id="farm_name"
              placeholder="Your farm name"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="mt-2 border-emerald-200"
            />
            <p className="text-xs text-gray-500 mt-2">The name of your farm for identification</p>
          </div>

          <div>
            <Label htmlFor="region" className="text-sm font-medium">
              Region/Province
            </Label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-emerald-200 rounded-md bg-white"
            >
              <option value="Lusaka">Lusaka</option>
              <option value="Copperbelt">Copperbelt</option>
              <option value="Northern">Northern</option>
              <option value="Eastern">Eastern</option>
              <option value="Western">Western</option>
              <option value="Southern">Southern</option>
              <option value="Central">Central</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">Used for weather and market data</p>
          </div>

          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">All Notifications</p>
              <p className="text-sm text-gray-600">Receive alerts and updates</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            To change your password, click the button below to receive a reset email.
          </p>

          <Button
            onClick={handleChangePassword}
            variant="outline"
            className="w-full border-emerald-200"
          >
            Change Password
          </Button>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Security Tip</p>
            <p className="text-xs text-blue-800">
              Use a strong, unique password with at least 8 characters including uppercase, 
              lowercase, numbers, and symbols.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-900">SmartFarmer SKACE</p>
            <p>Version 1.0.0</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Created by</p>
            <p>Samuel Kaoma</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Purpose</p>
            <p>Empowering Zambian farmers with intelligent farming technology</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
