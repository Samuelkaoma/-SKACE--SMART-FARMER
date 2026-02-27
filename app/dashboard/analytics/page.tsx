'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { 
  TrendingUp, Award, Zap, Target, Star, Trophy
} from 'lucide-react'

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

const achievements = [
  { name: 'First Harvest', icon: '🌾', description: 'Harvest your first crop', earned: true },
  { name: 'Livestock Master', icon: '🐄', description: 'Record 10 livestock entries', earned: true },
  { name: 'Data Keeper', icon: '📊', description: 'Log 30+ farm entries', earned: false },
  { name: 'Eco Warrior', icon: '♻️', description: 'Reduce resource usage by 20%', earned: false },
  { name: 'Market Expert', icon: '💰', description: 'Use market insights 5 times', earned: true },
  { name: 'Farmer Pro', icon: '⭐', description: 'Reach Gold tier', earned: false },
  { name: 'Weather Watcher', icon: '☀️', description: 'Check weather 15 times', earned: false },
  { name: 'Storage King', icon: '🏪', description: 'Store 1000kg of produce', earned: false },
]

const regionalData = [
  { region: 'Lusaka', yield: 85, health: 88 },
  { region: 'Copperbelt', yield: 78, health: 82 },
  { region: 'Northern', yield: 92, health: 90 },
  { region: 'Southern', yield: 75, health: 80 },
]

const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444']

export default function AnalyticsPage() {
  const [userStats, setUserStats] = useState({
    totalRevenue: 18000,
    points: 450,
    tier: 'Silver',
    percentToNextTier: 65,
    earnedAchievements: 3,
    totalAchievements: 8,
  })
  const supabase = createClient()

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (data) {
          setUserStats({
            totalRevenue: data.total_revenue || 18000,
            points: data.points || 450,
            tier: data.tier || 'Silver',
            percentToNextTier: data.percent_to_next_tier || 65,
            earnedAchievements: data.achievements_count || 3,
            totalAchievements: 8,
          })
        }
      } catch (error) {
        console.log('[v0] Error loading stats:', error)
      }
    }

    loadStats()
  }, [supabase])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return { bg: 'bg-amber-100', text: 'text-amber-800', accent: '#92400e' }
      case 'Silver':
        return { bg: 'bg-gray-100', text: 'text-gray-800', accent: '#4b5563' }
      case 'Gold':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', accent: '#b45309' }
      default:
        return { bg: 'bg-purple-100', text: 'text-purple-800', accent: '#6d28d9' }
    }
  }

  const tierColors = getTierColor(userStats.tier)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-900">Analytics & Performance</h1>
        <p className="text-gray-500 mt-1">Track your farm's performance and achievements</p>
      </div>

      {/* Tier & Points Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier Progress */}
        <Card className={`border-2 ${tierColors.bg}`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Trophy className="w-16 h-16 mx-auto text-amber-600" />
              <div>
                <p className={`text-sm ${tierColors.text}`}>Current Tier</p>
                <h2 className={`text-3xl font-bold ${tierColors.text}`}>{userStats.tier}</h2>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Progress to Next Tier</p>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all"
                    style={{ width: `${userStats.percentToNextTier}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{userStats.percentToNextTier}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points */}
        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Zap className="w-16 h-16 mx-auto text-amber-500" />
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <h2 className="text-3xl font-bold text-amber-600">{userStats.points}</h2>
              </div>
              <p className="text-sm text-gray-500">Earn points from activities and achievements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-700 mt-2">ZMW {userStats.totalRevenue}</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Avg Yield</p>
                <p className="text-3xl font-bold text-teal-700 mt-2">85%</p>
                <p className="text-xs text-green-600 mt-1">Excellent performance</p>
              </div>
              <Target className="w-8 h-8 text-teal-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Efficiency</p>
                <p className="text-3xl font-bold text-amber-700 mt-2">78%</p>
                <p className="text-xs text-green-600 mt-1">Above target</p>
              </div>
              <Star className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none' }} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" />
                <Bar dataKey="target" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resource Efficiency */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Resource Efficiency</CardTitle>
            <CardDescription>Usage vs optimal levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={resourceUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="resource" type="category" stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none' }} />
                <Bar dataKey="usage" fill="#14b8a6" />
                <Bar dataKey="efficient" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Comparison */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Comparison across regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="region" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none' }} />
                <Legend />
                <Area type="monotone" dataKey="yield" fill="#10b981" stroke="#059669" />
                <Area type="monotone" dataKey="health" fill="#14b8a6" stroke="#0d9488" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Achievements Progress */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Achievement Progress</CardTitle>
            <CardDescription>{userStats.earnedAchievements} of {userStats.totalAchievements} earned</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Earned', value: userStats.earnedAchievements },
                    { name: 'Remaining', value: userStats.totalAchievements - userStats.earnedAchievements }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#d1d5db" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
          <CardDescription>Unlock badges by completing farm milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg text-center transition transform hover:scale-105 ${
                  achievement.earned
                    ? 'bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-300'
                    : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h3 className="font-bold text-sm text-gray-900">{achievement.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                {achievement.earned && (
                  <div className="mt-2">
                    <span className="inline-block bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      ✓ Earned
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
