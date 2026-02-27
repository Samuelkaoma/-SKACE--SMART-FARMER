import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's crops and livestock
    const [cropsRes, livestockRes, weatherRes, marketRes] = await Promise.all([
      supabase.from('crops').select('*').eq('user_id', user.id),
      supabase.from('livestock').select('*').eq('user_id', user.id),
      supabase.from('weather_data').select('*').eq('region', 'Zambia').order('date', { ascending: false }).limit(1),
      supabase.from('market_prices').select('*').order('date', { ascending: false }).limit(5),
    ])

    const recommendations = []

    // Disease recommendations
    if (cropsRes.data && cropsRes.data.length > 0) {
      const unhealthyCrops = cropsRes.data.filter((c: any) => c.health_score < 70)
      if (unhealthyCrops.length > 0) {
        recommendations.push({
          id: 'disease-1',
          title: 'Crop Health Alert',
          description: `${unhealthyCrops.length} crop(s) have health scores below 70%. Apply fungicide or pesticide treatment.`,
          priority: 'high',
          type: 'disease',
          crops: unhealthyCrops.map((c: any) => c.name),
        })
      }
    }

    // Weather recommendations
    if (weatherRes.data && weatherRes.data[0]) {
      const weather = weatherRes.data[0]
      if (weather.rainfall < 10) {
        recommendations.push({
          id: 'weather-1',
          title: 'Low Rainfall Alert',
          description: 'Expect low rainfall this week. Ensure irrigation systems are ready.',
          priority: 'medium',
          type: 'weather',
        })
      }
      if (weather.temperature > 32) {
        recommendations.push({
          id: 'weather-2',
          title: 'High Temperature Warning',
          description: 'High temperatures expected. Provide shade and increase watering.',
          priority: 'medium',
          type: 'weather',
        })
      }
    }

    // Market recommendations
    if (marketRes.data && marketRes.data.length > 0) {
      const bestPrice = marketRes.data[0]
      recommendations.push({
        id: 'market-1',
        title: 'Market Price Alert',
        description: `${bestPrice.commodity} is at a 5-week high (ZMW ${bestPrice.price}). Consider selling if you have excess stock.`,
        priority: 'medium',
        type: 'market',
        crop: bestPrice.commodity,
      })
    }

    // Harvest recommendations
    if (cropsRes.data) {
      const readyHarvest = cropsRes.data.filter((c: any) => {
        const daysToHarvest = Math.floor((new Date(c.expected_harvest).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return daysToHarvest <= 7 && daysToHarvest > 0
      })
      if (readyHarvest.length > 0) {
        recommendations.push({
          id: 'harvest-1',
          title: 'Harvest Preparation',
          description: `${readyHarvest.length} crop(s) ready for harvest soon. Prepare equipment and storage.`,
          priority: 'high',
          type: 'harvest',
          crops: readyHarvest.map((c: any) => c.name),
        })
      }
    }

    return NextResponse.json({ 
      data: recommendations,
      total: recommendations.length 
    })
  } catch (error) {
    console.log('[v0] Recommendations API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { error } = await supabase.from('recommendations').insert({
      user_id: user.id,
      title: body.title,
      description: body.description,
      type: body.type,
      priority: body.priority,
      is_read: false,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log('[v0] Error creating recommendation:', error)
    return NextResponse.json({ error: 'Failed to save recommendation' }, { status: 500 })
  }
}
