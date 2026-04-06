import { NextResponse } from 'next/server'

import { ApiError, handleRouteError } from '@/lib/api/route-helpers'
import { requireRouteUser } from '@/lib/auth/server'
import { isDevSeedRouteEnabled } from '@/lib/config/env'
import { getMarketSummary } from '@/lib/services/dashboard-service'
import { createClient } from '@/lib/supabase/server'

const seededCommodities = [
  { commodity_name: 'Maize', basePrice: 2500, unit: 'kg' },
  { commodity_name: 'Sorghum', basePrice: 2200, unit: 'kg' },
  { commodity_name: 'Groundnuts', basePrice: 3500, unit: 'kg' },
  { commodity_name: 'Wheat', basePrice: 3200, unit: 'kg' },
  { commodity_name: 'Beans', basePrice: 4500, unit: 'kg' },
]

export async function GET() {
  try {
    const supabase = await createClient()
    await requireRouteUser(supabase)
    const data = await getMarketSummary({ supabase })

    return NextResponse.json({ data })
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch market data.')
  }
}

export async function POST() {
  try {
    const supabase = await createClient()
    await requireRouteUser(supabase)

    if (!isDevSeedRouteEnabled()) {
      throw new ApiError(403, 'Market seed endpoint is disabled for this environment.')
    }

    const today = new Date()
    const mockPrices = seededCommodities.flatMap((commodity, commodityIndex) =>
      Array.from({ length: 10 }).map((_, dayOffset) => {
        const date = new Date(today)
        date.setDate(today.getDate() - dayOffset)

        return {
          commodity_name: commodity.commodity_name,
          price_per_unit: commodity.basePrice + commodityIndex * 85 - dayOffset * 20,
          recorded_date: date.toISOString().slice(0, 10),
          region: 'Lusaka',
          unit: commodity.unit,
          demand_trend: dayOffset < 3 ? 'rising' : 'stable',
        }
      }),
    )

    const insertResult = await supabase.from('market_prices').insert(mockPrices)

    if (insertResult.error) {
      throw new Error(insertResult.error.message)
    }

    return NextResponse.json({ success: true, inserted: mockPrices.length })
  } catch (error) {
    return handleRouteError(error, 'Failed to seed market data.')
  }
}
