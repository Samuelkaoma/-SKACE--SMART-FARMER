'use client'

import { BarChart3, Zap, Target, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface FarmStat {
  label: string
  value: string | number
  icon: any
  trend?: { value: number; isPositive: boolean }
  color: string
}

interface FarmStatsProps {
  stats: FarmStat[]
}

export function FarmStats({ stats }: FarmStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className={`p-6 border-l-4 hover:shadow-lg transition-shadow animate-fade-in`} style={{
            borderLeftColor: stat.color,
          }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-emerald-900">{stat.value}</p>
                {stat.trend && (
                  <p className={`text-xs mt-2 ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend.isPositive ? '↑' : '↓'} {Math.abs(stat.trend.value)}% from last month
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${stat.color}20` }}>
                <Icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
