// Farm calculation utilities for yield, health, and efficiency predictions

export interface CropHealthMetrics {
  health_percentage: number;
  disease_risk: 'low' | 'medium' | 'high';
  growth_stage: string;
  estimated_yield: number;
  days_to_harvest: number;
}

export interface FarmingRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'disease' | 'pest' | 'weather' | 'soil' | 'market' | 'general';
  action_items: string[];
  confidence: number;
}

// Calculate crop health based on various metrics
export function calculateCropHealth(
  age_days: number,
  planted_date: Date,
  rainfall: number,
  temperature: number,
  last_disease_check: Date,
  has_pest_issues: boolean
): CropHealthMetrics {
  const now = new Date();
  const days_since_planted = Math.floor((now.getTime() - planted_date.getTime()) / (1000 * 60 * 60 * 24));
  
  // Base health starts at 100%
  let health = 100;
  
  // Temperature impact (-5% per degree away from optimal 25-28°C)
  const optimal_temp = 26.5;
  const temp_deviation = Math.abs(temperature - optimal_temp);
  health -= temp_deviation * 5;
  
  // Rainfall impact (optimal 200-300mm per month)
  const optimal_rainfall = 250;
  const rainfall_deviation = Math.abs(rainfall - optimal_rainfall);
  if (rainfall_deviation > 100) health -= 10;
  
  // Disease check timeliness (-15% if not checked in 14+ days)
  const days_since_check = Math.floor((now.getTime() - last_disease_check.getTime()) / (1000 * 60 * 60 * 24));
  if (days_since_check > 14) health -= 15;
  
  // Pest issues (-25% if present)
  if (has_pest_issues) health -= 25;
  
  health = Math.max(0, Math.min(100, health));
  
  // Estimate yield based on health and days
  const estimated_yield = (health / 100) * 3000; // Base yield 3000kg/hectare
  
  // Estimate days to harvest based on crop type and days planted
  const days_to_harvest = Math.max(0, 120 - days_since_planted); // Typical 120-day crop cycle
  
  // Determine growth stage
  let growth_stage = 'Seedling';
  if (days_since_planted > 30) growth_stage = 'Vegetative';
  if (days_since_planted > 60) growth_stage = 'Flowering';
  if (days_since_planted > 90) growth_stage = 'Maturation';
  
  // Disease risk assessment
  let disease_risk: 'low' | 'medium' | 'high' = 'low';
  if (health < 40) disease_risk = 'high';
  else if (health < 70) disease_risk = 'medium';
  
  return {
    health_percentage: Math.round(health),
    disease_risk,
    growth_stage,
    estimated_yield: Math.round(estimated_yield),
    days_to_harvest,
  };
}

// Generate recommendations based on farm data
export function generateRecommendations(
  crops: any[],
  livestock: any[],
  weather: any,
  market_prices: any
): FarmingRecommendation[] {
  const recommendations: FarmingRecommendation[] = [];
  
  // Weather-based recommendations
  if (weather.rainfall_mm > 500) {
    recommendations.push({
      id: 'flood-risk-1',
      title: 'Heavy Rainfall Alert',
      description: 'Severe rainfall expected. Ensure proper drainage in low-lying fields.',
      priority: 'urgent',
      category: 'weather',
      action_items: [
        'Clear drainage channels',
        'Check field elevation',
        'Monitor crops for waterlogging',
        'Prepare for pest emergence after rainfall'
      ],
      confidence: 0.95,
    });
  }
  
  if (weather.temperature_celsius > 35) {
    recommendations.push({
      id: 'heat-stress-1',
      title: 'Heat Stress Warning',
      description: 'High temperatures can cause crop wilting and reduced yields.',
      priority: 'high',
      category: 'general',
      action_items: [
        'Increase irrigation frequency',
        'Monitor plants for stress signs',
        'Apply mulch to retain soil moisture',
        'Scout for heat-related pest outbreaks'
      ],
      confidence: 0.9,
    });
  }
  
  // Market-based recommendations
  const high_price_crops = market_prices.filter((p: any) => p.price_per_unit > 3000);
  if (high_price_crops.length > 0) {
    recommendations.push({
      id: 'market-opportunity-1',
      title: 'Market Price Opportunity',
      description: `Commodity prices are favorable for ${high_price_crops.map((p: any) => p.commodity_name).join(', ')}.`,
      priority: 'medium',
      category: 'market',
      action_items: [
        'Check storage for mature produce',
        'Contact local buyers',
        'Plan harvest timing for peak prices',
        'Monitor price trends daily'
      ],
      confidence: 0.85,
    });
  }
  
  // Crop health recommendations
  crops.forEach((crop) => {
    if (crop.health_score < 40) {
      recommendations.push({
        id: `crop-health-${crop.id}`,
        title: `Critical Health: ${crop.crop_type}`,
        description: `Your ${crop.crop_type} requires immediate attention. Health is critically low.`,
        priority: 'urgent',
        category: 'disease',
        action_items: [
          'Inspect plant thoroughly for diseases/pests',
          'Apply appropriate fungicide/insecticide',
          'Adjust irrigation schedule',
          'Increase monitoring frequency'
        ],
        confidence: 0.9,
      });
    }
  });
  
  // Livestock care recommendations
  livestock.forEach((animal) => {
    if (animal.health_status === 'sick' || animal.health_status === 'poor') {
      recommendations.push({
        id: `livestock-health-${animal.id}`,
        title: `Health Alert: ${animal.animal_type}`,
        description: `Your ${animal.animal_type} (#${animal.tag_id}) shows signs of illness.`,
        priority: 'urgent',
        category: 'general',
        action_items: [
          'Isolate animal from others',
          'Consult veterinarian immediately',
          'Monitor temperature and appetite',
          'Prepare quarantine area if needed'
        ],
        confidence: 0.95,
      });
    }
  });
  
  return recommendations;
}

// Calculate farmer tier based on points
export function calculateFarmerTier(points: number): { tier: string; color: string; nextThreshold: number } {
  if (points >= 5000) return { tier: 'Platinum', color: 'platinum', nextThreshold: 0 };
  if (points >= 3000) return { tier: 'Gold', color: 'amber', nextThreshold: 5000 };
  if (points >= 1500) return { tier: 'Silver', color: 'slate', nextThreshold: 3000 };
  if (points >= 500) return { tier: 'Bronze', color: 'orange', nextThreshold: 1500 };
  return { tier: 'Beginner', color: 'emerald', nextThreshold: 500 };
}

// Calculate efficiency score
export function calculateEfficiencyScore(
  resources_used: number,
  yield_produced: number,
  waste_percentage: number
): number {
  // Efficiency = (yield / resources) * (100 - waste)
  if (resources_used === 0) return 0;
  const score = (yield_produced / resources_used) * (100 - waste_percentage);
  return Math.min(100, Math.max(0, score / 10)); // Normalize to 0-100
}
