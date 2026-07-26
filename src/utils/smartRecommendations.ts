import { WeatherData, SmartRecommendation, OutdoorScore } from '../types/weather';

export function calculateOutdoorScore(data: WeatherData): OutdoorScore {
  const currentTemp = data.current.temperature;
  const precipProb = data.daily.precipitation_probability_max?.[0] ?? (data.current.precipitation ? 70 : 10);
  const windSpeed = data.current.windspeed;
  const weatherCode = data.current.weathercode;
  const uvMax = data.daily.uv_index_max?.[0] ?? 5;

  let score = 100;

  // Temperature impact (ideal is 18 - 25°C)
  if (currentTemp < 0) score -= 40;
  else if (currentTemp < 10) score -= 20;
  else if (currentTemp > 35) score -= 35;
  else if (currentTemp > 30) score -= 20;
  else if (currentTemp >= 18 && currentTemp <= 25) score += 5;

  // Rain probability impact
  if (precipProb > 70) score -= 45;
  else if (precipProb > 40) score -= 25;
  else if (precipProb > 20) score -= 10;

  // Severe Weather code penalties
  if ([95, 96, 99].includes(weatherCode)) score -= 60; // Thunderstorm
  else if ([65, 82, 67].includes(weatherCode)) score -= 50; // Heavy rain / freezing rain
  else if ([71, 73, 75, 85, 86].includes(weatherCode)) score -= 35; // Snow
  else if ([45, 48].includes(weatherCode)) score -= 25; // Fog

  // Wind penalty (> 30 km/h)
  if (windSpeed > 45) score -= 30;
  else if (windSpeed > 30) score -= 15;

  // UV penalty if extreme
  if (uvMax > 9) score -= 10;

  score = Math.max(10, Math.min(100, Math.round(score)));

  let label = 'Excellent';
  let summary = 'Ideal weather conditions for running, cycling, or outdoor gatherings.';
  let color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';

  if (score >= 85) {
    label = 'Excellent';
    summary = 'Perfect weather for outdoor activities, sports, and walking.';
    color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  } else if (score >= 70) {
    label = 'Good';
    summary = 'Great conditions for outdoor plans with light preparation.';
    color = 'text-teal-500 bg-teal-500/10 border-teal-500/20';
  } else if (score >= 50) {
    label = 'Moderate';
    summary = 'Fair conditions. Check rain chances and dress appropriately.';
    color = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  } else if (score >= 30) {
    label = 'Poor';
    summary = 'Suboptimal weather. Consider short outdoor trips or indoor alternatives.';
    color = 'text-orange-500 bg-orange-500/10 border-orange-500/20';
  } else {
    label = 'Unfavorable';
    summary = 'Adverse weather conditions. Outdoor plans are not recommended.';
    color = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  }

  return { score, label, summary, color };
}

export function generateSmartRecommendations(data: WeatherData): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];
  const temp = data.current.temperature;
  const precipProb = data.daily.precipitation_probability_max?.[0] ?? 0;
  const precipSum = data.daily.precipitation_sum?.[0] ?? 0;
  const windSpeed = data.current.windspeed;
  const uvIndex = data.daily.uv_index_max?.[0] ?? 0;
  const weatherCode = data.current.weathercode;
  const humidity = data.current.relative_humidity ?? 50;

  // 1. Rain / Umbrella Advice
  if (precipProb >= 50 || precipSum > 2 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    recommendations.push({
      id: 'rec-umbrella',
      category: 'clothing',
      severity: precipProb > 75 || precipSum > 5 ? 'alert' : 'warning',
      title: 'Bring an Umbrella',
      description: `High precipitation likelihood (${precipProb}% chance, ${precipSum}mm expected). Carry an umbrella or waterproof jacket.`,
      iconName: 'Umbrella',
    });
  }

  // 2. Outdoor Activity Recommendation
  const outdoor = calculateOutdoorScore(data);
  if (outdoor.score >= 75) {
    recommendations.push({
      id: 'rec-activity-good',
      category: 'activity',
      severity: 'success',
      title: 'Great Day for Outdoor Activities',
      description: 'Temperatures and conditions are optimal for workouts, parks, picnics, or outdoor errands.',
      iconName: 'Footprints',
    });
  } else if (outdoor.score < 40) {
    recommendations.push({
      id: 'rec-activity-poor',
      category: 'activity',
      severity: 'warning',
      title: 'Prefer Indoor Activities',
      description: 'Chilly, rainy, or harsh conditions make indoor plans significantly more comfortable today.',
      iconName: 'Home',
    });
  }

  // 3. Clothing Tip based on Temperature
  if (temp <= 5) {
    recommendations.push({
      id: 'rec-clothing-cold',
      category: 'clothing',
      severity: 'info',
      title: 'Heavy Winter Apparel Required',
      description: 'Sub-zero or freezing feeling. Wear thermal layers, heavy coat, scarf, gloves, and insulated footwear.',
      iconName: 'Shirt',
    });
  } else if (temp <= 15) {
    recommendations.push({
      id: 'rec-clothing-cool',
      category: 'clothing',
      severity: 'info',
      title: 'Layer Up for Crisp Weather',
      description: 'Cool temperatures outdoors. A sweater, jacket, or trench coat with pants will keep you comfortable.',
      iconName: 'Shirt',
    });
  } else if (temp >= 28) {
    recommendations.push({
      id: 'rec-clothing-hot',
      category: 'clothing',
      severity: 'info',
      title: 'Breathable Summer Wear',
      description: 'Warm to hot weather. Wear lightweight, loose cotton clothes, sunglasses, and drink plenty of water.',
      iconName: 'Sun',
    });
  }

  // 4. UV Protection Warning
  if (uvIndex >= 6) {
    recommendations.push({
      id: 'rec-uv',
      category: 'health',
      severity: uvIndex >= 8 ? 'alert' : 'warning',
      title: `High UV Index (${uvIndex})`,
      description: 'Protection against skin and eye damage is needed. Apply SPF 30+ sunscreen, wear a hat and sunglasses.',
      iconName: 'SunMedium',
    });
  }

  // 5. Wind Advisory
  if (windSpeed >= 30) {
    recommendations.push({
      id: 'rec-wind',
      category: 'warning',
      severity: windSpeed >= 50 ? 'alert' : 'warning',
      title: 'High Winds Expected',
      description: `Wind gusts up to ${windSpeed} km/h. Secure loose outdoor furniture, drive cautiously, and watch for tree branches.`,
      iconName: 'Wind',
    });
  }

  // 6. Thunderstorm Caution
  if ([95, 96, 99].includes(weatherCode)) {
    recommendations.push({
      id: 'rec-thunder',
      category: 'warning',
      severity: 'alert',
      title: 'Thunderstorm Warning',
      description: 'Active lightning storms expected. Stay indoors away from windows and delay travel until conditions clear.',
      iconName: 'Zap',
    });
  }

  // 7. Humidity / Air Comfort
  if (humidity >= 85 && temp > 22) {
    recommendations.push({
      id: 'rec-humidity',
      category: 'health',
      severity: 'info',
      title: 'Muggy & High Humidity',
      description: 'Humidity is around ' + humidity + '%. Stay hydrated and spend time in ventilated or air-conditioned spaces.',
      iconName: 'Droplets',
    });
  }

  return recommendations;
}
