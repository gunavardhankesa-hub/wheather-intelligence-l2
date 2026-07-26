export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph';

export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  relative_humidity?: number;
  apparent_temperature?: number;
  precipitation?: number;
  surface_pressure?: number;
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  precipitation_sum: number[];
  precipitation_probability_max?: number[];
  uv_index_max?: number[];
  wind_speed_10m_max?: number[];
  wind_direction_10m_dominant?: number[];
  sunrise?: string[];
  sunset?: string[];
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature?: number[];
  precipitation_probability: number[];
  weathercode: number[];
  wind_speed_10m: number[];
  uv_index?: number[];
  surface_pressure?: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone: string;
  timezone_abbreviation?: string;
  locationName: string;
  country?: string;
  admin1?: string;
  current: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
  fetchedAt: string;
}

export type RecommendationCategory = 'activity' | 'clothing' | 'warning' | 'health';
export type RecommendationSeverity = 'info' | 'success' | 'warning' | 'alert';

export interface SmartRecommendation {
  id: string;
  category: RecommendationCategory;
  severity: RecommendationSeverity;
  title: string;
  description: string;
  iconName: string;
}

export interface OutdoorScore {
  score: number; // 0 to 100
  label: string; // 'Excellent', 'Good', 'Moderate', 'Poor', 'Unfavorable'
  summary: string;
  color: string;
}
