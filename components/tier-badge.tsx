'use client'

import { Crown } from 'lucide-react'

interface TierBadgeProps {
  tier: 'Beginner' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  points: number
  nextThreshold: number
  size?: 'sm' | 'md' | 'lg'
}

const tierConfig = {
  Beginner: {
    icon: '🌱',
    gradient: 'from-emerald-400 to-emerald-600',
    bgGradient: 'from-emerald-100 to-emerald-200',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-400',
  },
  Bronze: {
    icon: '🥉',
    gradient: 'from-orange-400 to-orange-600',
    bgGradient: 'from-orange-100 to-orange-200',
    textColor: 'text-orange-900',
    borderColor: 'border-orange-400',
  },
  Silver: {
    icon: '🥈',
    gradient: 'from-slate-400 to-slate-600',
    bgGradient: 'from-slate-100 to-slate-200',
    textColor: 'text-slate-900',
    borderColor: 'border-slate-400',
  },
  Gold: {
    icon: '🏆',
    gradient: 'from-amber-400 to-amber-600',
    bgGradient: 'from-amber-100 to-amber-200',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-400',
  },
  Platinum: {
    icon: '👑',
    gradient: 'from-purple-400 to-purple-600',
    bgGradient: 'from-purple-100 to-purple-200',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-400',
  },
}

export function TierBadge({ tier, points, nextThreshold, size = 'md' }: TierBadgeProps) {
  const config = tierConfig[tier]
  const progressPercent = nextThreshold > 0 ? (points / nextThreshold) * 100 : 100

  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-lg',
    lg: 'w-32 h-32 text-4xl',
  }

  const sizeClass = sizeClasses[size]

  return (
    <div className="relative inline-block">
      {/* Circular background */}
      <div className={`${sizeClass} ${config.bgGradient} rounded-full border-4 ${config.borderColor} shadow-lg flex items-center justify-center relative overflow-hidden`}>
        {/* Animated background shine */}
        <div className="absolute inset-0 opacity-20 animate-pulse-soft"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="text-4xl mb-1">{config.icon}</div>
          <p className={`font-bold ${config.textColor} leading-tight text-xs`}>{tier}</p>
        </div>

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${progressPercent * 2.827} 282.7`}
            className={`text-emerald-600 transition-all duration-1000`}
          />
        </svg>
      </div>

      {/* Points info */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
        <p className="text-xs font-semibold text-emerald-900">{points} pts</p>
      </div>
    </div>
  )
}
