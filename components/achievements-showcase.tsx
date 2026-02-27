'use client'

import { Award, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Achievement {
  id: string
  name: string
  description: string
  icon_name: string
  badge_color: string
  points_reward: number
  unlocked: boolean
  progress?: number
}

interface AchievementsShowcaseProps {
  achievements: Achievement[]
  points: number
  tier: string
  nextThreshold: number
}

const iconEmojis = {
  leaf: '🍃',
  wheat: '🌾',
  home: '🏠',
  activity: '📊',
  package: '📦',
  cloud: '☁️',
  'trending-up': '📈',
  heart: '❤️',
  zap: '⚡',
  star: '⭐',
}

export function AchievementsShowcase({ achievements, points, tier, nextThreshold }: AchievementsShowcaseProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalPoints = achievements.reduce((sum, a) => sum + (a.unlocked ? a.points_reward : 0), 0)
  const topAchievements = achievements.filter((a) => a.unlocked).slice(0, 6)
  const recentProgress = achievements.find((a) => !a.unlocked && (a.progress || 0) > 0)

  const tierColors = {
    Platinum: 'from-slate-300 to-slate-500',
    Gold: 'from-amber-300 to-amber-500',
    Silver: 'from-slate-300 to-slate-400',
    Bronze: 'from-orange-300 to-orange-500',
    Beginner: 'from-emerald-300 to-emerald-500',
  }

  const bgGradient = tierColors[tier as keyof typeof tierColors] || tierColors.Beginner

  return (
    <Card className="border-emerald-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${bgGradient} h-24`}></div>
      <CardHeader className="-mt-12 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-emerald-900">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
            <CardDescription className="mt-1">
              {unlockedCount} of {achievements.length} unlocked
            </CardDescription>
          </div>
          <div className="text-right bg-white/90 backdrop-blur px-4 py-2 rounded-lg">
            <p className="text-sm font-semibold text-emerald-600">{tier}</p>
            <p className="text-xs text-gray-600">{points} pts</p>
          </div>
        </div>

        {/* Progress to next tier */}
        {nextThreshold > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progress to next tier</span>
              <span>
                {points} / {nextThreshold}
              </span>
            </div>
            <Progress value={(points / nextThreshold) * 100} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Unlocked Achievements */}
        {topAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-emerald-900 mb-3">Recent Achievements</h4>
            <div className="grid grid-cols-3 gap-3">
              {topAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="relative group animate-scale-in"
                  title={achievement.description}
                >
                  <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-2xl cursor-pointer hover:shadow-lg transition-shadow">
                    {iconEmojis[achievement.icon_name as keyof typeof iconEmojis] || '🏆'}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-emerald-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    +{achievement.points_reward}
                  </div>
                  <p className="text-xs text-center mt-2 font-medium text-emerald-900 truncate">
                    {achievement.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In Progress */}
        {recentProgress && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <div className="text-xl">🎯</div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 text-sm">{recentProgress.name}</h4>
                <p className="text-xs text-blue-700 mt-1">{recentProgress.description}</p>
                <div className="mt-2 space-y-1">
                  <Progress value={recentProgress.progress || 0} className="h-1.5" />
                  <p className="text-xs text-blue-600 text-right font-medium">
                    {recentProgress.progress || 0}% complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Locked Achievements Preview */}
        {achievements.filter((a) => !a.unlocked).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-emerald-900 mb-3">Locked Achievements</h4>
            <div className="grid grid-cols-3 gap-3">
              {achievements
                .filter((a) => !a.unlocked)
                .slice(0, 3)
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className="relative group opacity-50"
                    title={achievement.description}
                  >
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-xs text-center mt-2 font-medium text-gray-600 truncate">
                      {achievement.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        <button className="w-full mt-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
          View all achievements →
        </button>
      </CardContent>
    </Card>
  )
}
