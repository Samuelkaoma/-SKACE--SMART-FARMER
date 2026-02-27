'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  AlertTriangle, 
  Star, 
  Zap,
  Plus,
  Eye,
  Award,
  Sprout
} from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { toast } from 'sonner'

interface DashboardStats {
  totalCrops: number
  activeCrops: number
  livestock: number
  achievements: number
  points: number
  level: string
}

interface RecommendationAlert {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  type: 'disease' | 'weather' | 'market' | 'harvest'
}

const performanceData = [
  { month: 'Jan', yield: 65, health: 72 },
  { month: 'Feb', yield: 72, health: 75 },
  { month: 'Mar', yield: 78, health: 80 },
  { month: 'Apr', yield: 85, health: 85 },
  { month: 'May', yield: 90, health: 88 },
]

const cropsDistribution = [
  { name: 'Maize', value: 45 },
  { name: 'Sorghum', value: 25 },
  { name: 'Wheat', value: 20 },
  { name: 'Other', value: 10 },
]

const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#8b5cf6']

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCrops: 0,
    activeCrops: 0,
    livestock: 0,
    achievements: 0,
    points: 0,
    level: 'Bronze',
  })
  const [recommendations, setRecommendations] = useState<RecommendationAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          window.location.href = '/auth/login'
          return
        }

        // Load stats
        const [cropsRes, livestockRes, achievementsRes, statsRes] = await Promise.all([
          supabase.from('crops').select('id, status').eq('user_id', user.id),
          supabase.from('livestock').select('id').eq('user_id', user.id),
          supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
          supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
        ])

        const activeCrops = cropsRes.data?.filter(c => c.status === 'active').length || 0
        const totalCrops = cropsRes.data?.length || 0
        const livestock = livestockRes.data?.length || 0
        const achievements = achievementsRes.data?.length || 0

        setStats({
          totalCrops,
          activeCrops,
          livestock,
          achievements,
          points: statsRes.data?.points || 0,
          level: statsRes.data?.tier || 'Bronze',
        })

        // Load recommendations (mock data for now)
        const mockRecommendations: RecommendationAlert[] = [
          {
            id: '1',
            title: 'Watering Reminder',
            description: 'Your maize in plot A needs watering soon',
            priority: 'high',
            type: 'weather'
          },
          {
            id: '2',
            title: 'Market Price Alert',
            description: 'Maize prices are at 5-week high - good time to sell',
            priority: 'medium',
            type: 'market'
          },
          {
            id: '3',
            title: 'Disease Warning',
            description: 'Slight chance of leaf spot in your sorghum crop',
            priority: 'medium',
            type: 'disease'
          },
        ]

        setRecommendations(mockRecommendations)
      } catch (error) {
        console.log('[v0] Error loading dashboard:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [supabase])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'disease':
        return '🦠'
      case 'weather':
        return '☀️'
      case 'market':
        return '💰'
      case 'harvest':
        return '🌾'
      default:
        return '📌'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back to your smart farming hub</p>
        </div>
        <div className="space-x-3">
          <Link href="/dashboard/crops">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Crop
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-200 hover:shadow-lg transition">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Active Crops</p>
                <p className="text-3xl font-bold text-emerald-700">{stats.activeCrops}</p>
                <p className="text-xs text-gray-500 mt-1">of {stats.totalCrops} total</p>
              </div>
              <Sprout className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200 hover:shadow-lg transition">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Livestock</p>
                <p className="text-3xl font-bold text-teal-700">{stats.livestock}</p>
                <p className="text-xs text-gray-500 mt-1">in your farm</p>
              </div>
              <Zap className="w-8 h-8 text-teal-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 hover:shadow-lg transition">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Points</p>
                <p className="text-3xl font-bold text-amber-700">{stats.points}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.level} Tier</p>
              </div>
              <Star className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Achievements</p>
                <p className="text-3xl font-bold text-purple-700">{stats.achievements}</p>
                <p className="text-xs text-gray-500 mt-1">badges earned</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendations */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-emerald-600" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Smart alerts powered by farm data analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-lg border-2 transition hover:shadow ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex gap-3 items-start">
                    <span className="text-2xl">{getPriorityIcon(rec.type)}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{rec.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                        View Details →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle>Farm Performance</CardTitle>
              <CardDescription>Yield and crop health trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="yield" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="health" 
                    stroke="#14b8a6" 
                    strokeWidth={2}
                    dot={{ fill: '#14b8a6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Crops Distribution */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-base">Crops Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={cropsDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {cropsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-sm">
                {cropsDistribution.map((crop, idx) => (
                  <div key={crop.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                      <span className="text-gray-600">{crop.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{crop.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/crops" className="block">
                <Button variant="outline" className="w-full justify-start border-emerald-200">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Crops
                </Button>
              </Link>
              <Link href="/dashboard/analytics" className="block">
                <Button variant="outline" className="w-full justify-start border-emerald-200">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/dashboard/storage" className="block">
                <Button variant="outline" className="w-full justify-start border-emerald-200">
                  <Sprout className="w-4 h-4 mr-2" />
                  Check Storage
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
