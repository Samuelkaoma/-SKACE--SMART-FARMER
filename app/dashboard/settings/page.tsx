'use client'

import { useEffect, useState } from 'react'
import { Bell, Lock, Settings, User } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'

const REGIONS = [
  'Lusaka',
  'Copperbelt',
  'Northern Region',
  'Eastern Region',
  'Western Region',
  'Southern Region',
  'Central Region',
]

export default function SettingsPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [region, setRegion] = useState('Lusaka')
  const [farmSize, setFarmSize] = useState('')
  const [yearsFarming, setYearsFarming] = useState('')
  const [primaryCrop, setPrimaryCrop] = useState('')
  const [primaryLivestock, setPrimaryLivestock] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          return
        }

        setEmail(user.email || '')

        const { data: profile, error } = await supabase
          .from('profiles')
          .select(
            'first_name, last_name, phone, region, farm_size_hectares, years_farming, primary_crop, primary_livestock, notifications_enabled',
          )
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          throw error
        }

        if (profile) {
          setFirstName(profile.first_name || '')
          setLastName(profile.last_name || '')
          setPhone(profile.phone || '')
          setRegion(profile.region || 'Lusaka')
          setFarmSize(profile.farm_size_hectares?.toString() || '')
          setYearsFarming(profile.years_farming?.toString() || '')
          setPrimaryCrop(profile.primary_crop || '')
          setPrimaryLivestock(profile.primary_livestock || '')
          setNotifications(profile.notifications_enabled !== false)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        toast.error('Failed to load settings')
      }
    }

    void loadSettings()
  }, [supabase])

  async function handleSaveSettings() {
    setIsSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      const { error } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          region,
          farm_size_hectares: farmSize ? Number(farmSize) : null,
          years_farming: yearsFarming ? Number(yearsFarming) : null,
          primary_crop: primaryCrop || null,
          primary_livestock: primaryLivestock || null,
          notifications_enabled: notifications,
        },
        { onConflict: 'id' },
      )

      if (error) {
        throw error
      }

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleChangePassword() {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        throw error
      }

      toast.success('Password reset email sent')
    } catch (error) {
      console.error('Error requesting password reset:', error)
      toast.error('Failed to send reset email')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <section className="rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-sm shadow-emerald-100 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
          Farm profile
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Tune the profile that powers recommendations
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Region, farming experience, and farm focus help the dashboard tailor guidance for both novice and experienced farmers.
        </p>
      </section>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile settings
          </CardTitle>
          <CardDescription>Update identity, farm focus, and experience details.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Email">
            <Input value={email} disabled className="bg-gray-50" />
          </Field>
          <Field label="Phone">
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+260..." />
          </Field>
          <Field label="First name">
            <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </Field>
          <Field label="Last name">
            <Input value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </Field>
          <Field label="Region">
            <select
              className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              {REGIONS.map((regionName) => (
                <option key={regionName} value={regionName}>
                  {regionName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Farm size (ha)">
            <Input
              type="number"
              step="0.1"
              value={farmSize}
              onChange={(event) => setFarmSize(event.target.value)}
              placeholder="4.5"
            />
          </Field>
          <Field label="Years farming">
            <Input
              type="number"
              value={yearsFarming}
              onChange={(event) => setYearsFarming(event.target.value)}
              placeholder="2"
            />
          </Field>
          <Field label="Primary crop">
            <Input
              value={primaryCrop}
              onChange={(event) => setPrimaryCrop(event.target.value)}
              placeholder="Maize"
            />
          </Field>
          <Field label="Primary livestock">
            <Input
              value={primaryLivestock}
              onChange={(event) => setPrimaryLivestock(event.target.value)}
              placeholder="Cattle"
            />
          </Field>
          <div className="md:col-span-2">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Control whether the platform should keep surfacing alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-900">Operational alerts</p>
              <p className="text-sm text-slate-600">Receive reminders, warnings, and guidance updates.</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Save notification preferences
          </Button>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your password reset flow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Send yourself a password reset link if you need to update your login credentials.
          </p>
          <Button onClick={handleChangePassword} variant="outline" className="border-emerald-200">
            Change password
          </Button>
        </CardContent>
      </Card>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Product context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>
            SmartFarmer SKACE is now structured as a production-minded farm operations platform with stronger schema alignment, better data capture, and more pitch-ready UX.
          </p>
          <p>
            The more accurate your profile and farm records are, the more credible the dashboard guidance becomes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  )
}
