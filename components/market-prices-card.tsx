'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface MarketPrice {
  id: string
  commodity_name: string
  price_per_unit: number
  region: string
  change_percent?: number
  demand_trend?: 'increasing' | 'stable' | 'decreasing'
}

interface MarketPricesCardProps {
  prices: MarketPrice[]
  loading?: boolean
}

const commodityEmojis: Record<string, string> = {
  Maize: '🌽',
  Sorghum: '🌾',
  Wheat: '🍞',
  Groundnuts: '🥜',
  Beans: '🫘',
  Cabbage: '🥬',
  Tomatoes: '🍅',
  Rice: '🍚',
}

export function MarketPricesCard({ prices, loading = false }: MarketPricesCardProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const topPrices = prices.slice(0, 6)
  const avgPrice = topPrices.length > 0 ? Math.round(topPrices.reduce((sum, p) => sum + p.price_per_unit, 0) / topPrices.length) : 0
  const bestOpportunity = topPrices.reduce((prev, current) => (prev.price_per_unit > current.price_per_unit ? prev : current), topPrices[0])

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Market Intelligence
        </CardTitle>
        <CardDescription>Current commodity prices in Zambia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topPrices.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No market data available</p>
          </div>
        ) : (
          <>
            {/* Best Opportunity */}
            {bestOpportunity && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-emerald-700 mb-2">BEST OPPORTUNITY</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-emerald-900">
                      {commodityEmojis[bestOpportunity.commodity_name] || '📦'} {bestOpportunity.commodity_name}
                    </p>
                    <p className="text-sm text-emerald-700 mt-1">
                      ZMW {bestOpportunity.price_per_unit}/kg
                    </p>
                  </div>
                  <Badge className="bg-emerald-600 text-white">High Demand</Badge>
                </div>
              </div>
            )}

            {/* Price List */}
            <div className="space-y-3">
              {topPrices.map((price) => {
                const change = price.change_percent || 0
                const isUp = change > 0
                return (
                  <div key={price.id} className="flex items-center justify-between p-3 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-smooth">
                    <div className="flex-1">
                      <p className="font-medium text-emerald-900 text-sm">
                        {commodityEmojis[price.commodity_name] || '📦'} {price.commodity_name}
                      </p>
                      <p className="text-xs text-gray-500">{price.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-900">ZMW {price.price_per_unit}</p>
                      {change !== 0 && (
                        <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{Math.abs(change)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {prices.length > 6 && (
              <button className="w-full mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                View all {prices.length} prices →
              </button>
            )}

            {/* Average Price Summary */}
            <div className="pt-4 border-t border-emerald-100 text-center">
              <p className="text-xs text-gray-600 mb-1">Average Market Price</p>
              <p className="text-2xl font-bold text-emerald-900">ZMW {avgPrice}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
