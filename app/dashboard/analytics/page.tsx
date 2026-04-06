'use client'

import { type ReactNode, useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Award, Star, Target, TrendingUp, Trophy, Zap } from 'lucide-react'

import { useDashboardSession } from '@/components/dashboard/dashboard-session-provider'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const revenueData = [
  { month: 'Jan', revenue: 2400, target: 3000 },
  { month: 'Feb', revenue: 3200, target: 3000 },
  { month: 'Mar', revenue: 2800, target: 3000 },
  { month: 'Apr', revenue: 4200, target: 3000 },
  { month: 'May', revenue: 5100, target: 3000 },
]

const resourceUsage = [
  { resource: 'Water', usage: 65, efficient: 80 },
  { resource: 'Fertilizer', usage: 72, efficient: 75 },
  { resource: 'Labor', usage: 58, efficient: 70 },
  { resource: 'Seeds', usage: 85, efficient: 90 },
]

const regionalData = [
  { region: 'Lusaka', yield: 85, health: 88 },
  { region: 'Copperbelt', yield: 78, health: 82 },
  { region: 'Northern Region', yield: 92, health: 90 },
  { region: 'Southern Region', yield: 75, health: 80 },
]

const achievements = [
  { name: 'First Crop', badge: 'FC', description: 'Plant your first crop', earned: true },
  { name: 'Harvest Master', badge: 'HM', description: 'Complete 5 crop harvests', earned: false },
  { name: 'Livestock Leader', badge: 'LL', description: 'Add 10 livestock entries', earned: true },
  { name: 'Data Champion', badge: 'DC', description: 'Log 30 farm activities', earned: false },
  { name: 'Storage Expert', badge: 'SE', description: 'Store 1000 kg of produce', earned: false },
  { name: 'Market Master', badge: 'MM', description: 'Track prices 10 times', earned: true },
]

const chartPalette = ['#0f9f6e', '#0e7490', '#f59e0b', '#94a3b8']

export default function AnalyticsPage() {
  const { userId } = useDashboardSession()
  const [userStats, setUserStats] = useState({
    totalRevenue: 0,
    totalHarvestKg: 0,
    points: 0,
    tier: 'bronze',
    achievementsUnlocked: 0,
    cropsManaged: 0,
    livestockManaged: 0,
  })

  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) {
        return
      }

      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select(
            'total_revenue, total_harvest_kg, total_points, current_tier, achievements_unlocked, crops_managed, livestock_managed',
          )
          .eq('id', userId)
          .maybeSingle()

        if (error) {
          throw error
        }

        if (data) {
          setUserStats({
            totalRevenue: data.total_revenue || 0,
            totalHarvestKg: data.total_harvest_kg || 0,
            points: data.total_points || 0,
            tier: data.current_tier || 'bronze',
            achievementsUnlocked: data.achievements_unlocked || 0,
            cropsManaged: data.crops_managed || 0,
            livestockManaged: data.livestock_managed || 0,
          })
        }
      } catch (error) {
        console.error('Error loading analytics stats:', error)
      }
    }

    void loadStats()
  }, [supabase, userId])

  const tierStyles = getTierStyles(userStats.tier)

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-sm shadow-emerald-100 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
          Analytics
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Operational analytics and traction signals
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Use these views to explain farm performance, reward progression, and why consistent record keeping matters.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className={`border-2 ${tierStyles.bg}`}>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <Trophy className={`mx-auto h-16 w-16 ${tierStyles.icon}`} />
              <div>
                <p className={`text-sm ${tierStyles.text}`}>Current tier</p>
                <h2 className={`text-3xl font-bold ${tierStyles.text}`}>
                  {titleCase(userStats.tier)}
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                Progress improves as farmers log activity, protect crop health, and grow harvest output.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <Zap className="mx-auto h-16 w-16 text-amber-500" />
              <div>
                <p className="text-sm text-slate-600">Total points</p>
                <h2 className="text-3xl font-bold text-amber-600">{userStats.points}</h2>
              </div>
              <p className="text-sm text-slate-500">
                Points turn activity and discipline into visible momentum for the farmer.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard
          icon={<TrendingUp className="h-8 w-8 text-emerald-400" />}
          title="Total revenue"
          value={`ZMW ${userStats.totalRevenue}`}
          note="Financial visibility"
          accent="text-emerald-700"
        />
        <MetricCard
          icon={<Target className="h-8 w-8 text-teal-400" />}
          title="Harvest tracked"
          value={`${userStats.totalHarvestKg} kg`}
          note="Production evidence"
          accent="text-teal-700"
        />
        <MetricCard
          icon={<Star className="h-8 w-8 text-amber-400" />}
          title="Crops managed"
          value={`${userStats.cropsManaged}`}
          note="Operational scope"
          accent="text-amber-700"
        />
        <MetricCard
          icon={<Award className="h-8 w-8 text-sky-400" />}
          title="Achievements"
          value={`${userStats.achievementsUnlocked}`}
          note="Behavioral progress"
          accent="text-sky-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
            <CardDescription>Illustrative monthly revenue compared with target</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ border: 'none', borderRadius: '16px' }} />
                <Legend />
                <Bar dataKey="revenue" fill="#0f9f6e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Resource efficiency</CardTitle>
            <CardDescription>Illustrative usage versus healthy benchmark</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={resourceUsage} layout="vertical">
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis stroke="#64748b" type="number" />
                <YAxis dataKey="resource" stroke="#64748b" type="category" />
                <Tooltip contentStyle={{ border: 'none', borderRadius: '16px' }} />
                <Legend />
                <Bar dataKey="usage" fill="#0e7490" radius={[0, 8, 8, 0]} />
                <Bar dataKey="efficient" fill="#cbd5e1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Regional comparison</CardTitle>
            <CardDescription>Illustrative benchmark by province</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={regionalData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="region" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ border: 'none', borderRadius: '16px' }} />
                <Legend />
                <Area dataKey="yield" fill="#34d399" stroke="#0f9f6e" type="monotone" />
                <Area dataKey="health" fill="#67e8f9" stroke="#0e7490" type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Achievement progress</CardTitle>
            <CardDescription>Completed versus remaining milestone targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Earned', value: userStats.achievementsUnlocked },
                    {
                      name: 'Remaining',
                      value: Math.max(achievements.length - userStats.achievementsUnlocked, 0),
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {chartPalette.slice(0, 2).map((color) => (
                    <Cell key={color} fill={color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ border: 'none', borderRadius: '16px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Milestone ladder
          </CardTitle>
          <CardDescription>Achievements that make the product more engaging and pitchable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.name}
                className={`rounded-2xl border-2 p-4 text-center transition hover:-translate-y-0.5 ${
                  achievement.earned
                    ? 'border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100'
                    : 'border-slate-200 bg-slate-50 opacity-70'
                }`}
              >
                <div
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold ${
                    achievement.earned
                      ? 'bg-amber-500 text-white'
                      : `text-slate-700`
                  }`}
                  style={
                    achievement.earned
                      ? undefined
                      : { backgroundColor: chartPalette[index % chartPalette.length] + '22' }
                  }
                >
                  {achievement.badge}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{achievement.name}</h3>
                <p className="mt-1 text-xs text-slate-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  icon,
  title,
  value,
  note,
  accent,
}: {
  icon: ReactNode
  title: string
  value: string
  note: string
  accent: string
}) {
  return (
    <Card className="border-emerald-200">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600">{title}</p>
            <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
            <p className="mt-1 text-xs text-slate-500">{note}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

function getTierStyles(tier: string) {
  switch (tier) {
    case 'gold':
      return {
        bg: 'bg-yellow-100 border-yellow-200',
        text: 'text-yellow-900',
        icon: 'text-yellow-700',
      }
    case 'silver':
      return {
        bg: 'bg-slate-100 border-slate-200',
        text: 'text-slate-900',
        icon: 'text-slate-700',
      }
    case 'bronze':
      return {
        bg: 'bg-amber-100 border-amber-200',
        text: 'text-amber-900',
        icon: 'text-amber-700',
      }
    default:
      return {
        bg: 'bg-purple-100 border-purple-200',
        text: 'text-purple-900',
        icon: 'text-purple-700',
      }
  }
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
