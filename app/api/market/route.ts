import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current market prices
    const { data, error } = await supabase
      .from('market_prices')
      .select('*')
      .order('date', { ascending: false })
      .limit(50)

    if (error) throw error

    // Group by commodity and get recent prices
    const commodityMap = new Map()
    data?.forEach(item => {
      if (!commodityMap.has(item.commodity)) {
        commodityMap.set(item.commodity, [])
      }
      commodityMap.get(item.commodity).push(item)
    })

    // Calculate price trends
    const commodities = Array.from(commodityMap.entries()).map(([name, prices]) => {
      const recent = prices[0]
      const previous = prices[5] || prices[prices.length - 1]
      const trend = recent.price >= previous.price ? 'up' : 'down'
      const percentChange = ((recent.price - previous.price) / previous.price * 100).toFixed(1)

      return {
        name,
        currentPrice: recent.price,
        date: recent.date,
        trend,
        percentChange,
        priceHistory: prices.slice(0, 10).reverse(),
      }
    })

    return NextResponse.json({ data: commodities })
  } catch (error) {
    console.log('[v0] Market API error:', error)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}

// Seed market data endpoint (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const commodities = ['Maize', 'Sorghum', 'Groundnuts', 'Wheat', 'Beans']
    const mockPrices = []

    for (const commodity of commodities) {
      for (let i = 0; i < 10; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const basePrice = Math.random() * 1000 + 2000
        
        mockPrices.push({
          commodity,
          price: Math.round(basePrice),
          date: date.toISOString(),
          region: 'Zambia',
        })
      }
    }

    const { error } = await supabase.from('market_prices').insert(mockPrices)
    if (error) throw error

    return NextResponse.json({ success: true, inserted: mockPrices.length })
  } catch (error) {
    console.log('[v0] Error seeding market data:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}
