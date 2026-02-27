'use client'

import { AlertCircle, Lightbulb, TrendingUp, Cloud } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  category: 'disease' | 'pest' | 'weather' | 'soil' | 'market' | 'general'
  action_items: string[]
  confidence: number
}

interface RecommendationsCardProps {
  recommendations: Recommendation[]
  loading?: boolean
}

const categoryIcons = {
  disease: AlertCircle,
  pest: AlertCircle,
  weather: Cloud,
  soil: TrendingUp,
  market: TrendingUp,
  general: Lightbulb,
}

const priorityColors = {
  urgent: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
}

export function RecommendationsCard({ recommendations, loading = false }: RecommendationsCardProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const urgentCount = recommendations.filter((r) => r.priority === 'urgent').length
  const topRecommendations = recommendations.slice(0, 5)

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-emerald-600" />
          AI Recommendations
        </CardTitle>
        <CardDescription>
          {urgentCount > 0 && <span className="text-red-600 font-medium">{urgentCount} urgent • </span>}
          {recommendations.length} recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topRecommendations.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No recommendations at this time. Keep monitoring your farm!</p>
          </div>
        ) : (
          topRecommendations.map((rec) => {
            const IconComponent = categoryIcons[rec.category]
            return (
              <div key={rec.id} className="border border-emerald-100 rounded-lg p-4 animate-fade-in hover:bg-emerald-50 transition-smooth">
                <div className="flex items-start gap-3 mb-2">
                  <IconComponent className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-900">{rec.title}</h4>
                    <p className="text-sm text-emerald-700 mt-1">{rec.description}</p>
                  </div>
                  <Badge variant="outline" className={`whitespace-nowrap ml-2 ${priorityColors[rec.priority]}`}>
                    {rec.priority}
                  </Badge>
                </div>
                {rec.action_items.length > 0 && (
                  <ul className="text-sm text-emerald-700 space-y-1 mt-3 ml-8">
                    {rec.action_items.slice(0, 2).map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                    {rec.action_items.length > 2 && (
                      <li className="text-emerald-600 italic">+{rec.action_items.length - 2} more actions</li>
                    )}
                  </ul>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${rec.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{Math.round(rec.confidence * 100)}%</span>
                </div>
              </div>
            )
          })
        )}
        {recommendations.length > 5 && (
          <button className="w-full mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
            View all {recommendations.length} recommendations →
          </button>
        )}
      </CardContent>
    </Card>
  )
}
