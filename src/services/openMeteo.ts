import { LocationResult, WeatherData } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1';

export async function searchCities(query: string, count: number = 8): Promise<LocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  try {
    const url = `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: LocationResult) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      admin2: item.admin2 || '',
      timezone: item.timezone || 'auto',
      population: item.population || 0,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<{ name: string; country?: string; admin1?: string }> {
  try {
    // Open-Meteo doesn't have a direct reverse geocoding endpoint, but BigDataCloud or OpenStreetMap Nominatim / Open-Meteo search can be used.
    // Let's use OpenStreetMap Nominatim or BigDataCloud client-side reverse geocoding API for exact location naming
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (response.ok) {
      const data = await response.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryName || '';
      const admin1 = data.principalSubdivision || '';
      return { name: city, country, admin1 };
    }
  } catch {
    // Fallback
  }
  return { name: 'My Location', country: '' };
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  locationName: string,
  country?: string,
  admin1?: string
): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
      hourly:
        'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,weather_code,surface_pressure,wind_speed_10m,uv_index',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
      current_weather: 'true',
      timezone: 'auto',
    });

    const url = `${FORECAST_BASE_URL}/forecast?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather service responded with code ${response.status}`);
    }

    const json = await response.json();

    const currentWeather = {
      time: json.current?.time || json.current_weather?.time || new Date().toISOString(),
      temperature: json.current?.temperature_2m ?? json.current_weather?.temperature ?? 0,
      windspeed: json.current?.wind_speed_10m ?? json.current_weather?.windspeed ?? 0,
      winddirection: json.current?.wind_direction_10m ?? json.current_weather?.winddirection ?? 0,
      weathercode: json.current?.weather_code ?? json.current_weather?.weathercode ?? 0,
      is_day: json.current?.is_day ?? json.current_weather?.is_day ?? 1,
      relative_humidity: json.current?.relative_humidity_2m ?? 50,
      apparent_temperature: json.current?.apparent_temperature ?? json.current?.temperature_2m ?? 0,
      precipitation: json.current?.precipitation ?? 0,
      surface_pressure: json.current?.surface_pressure ?? json.current?.pressure_msl ?? 1013,
    };

    return {
      latitude: json.latitude,
      longitude: json.longitude,
      elevation: json.elevation,
      timezone: json.timezone || 'UTC',
      timezone_abbreviation: json.timezone_abbreviation,
      locationName,
      country,
      admin1,
      current: currentWeather,
      daily: json.daily || {
        time: [],
        weathercode: [],
        temperature_2m_max: [],
        temperature_2m_min: [],
        precipitation_sum: [],
      },
      hourly: json.hourly || {
        time: [],
        temperature_2m: [],
        relative_humidity_2m: [],
        precipitation_probability: [],
        weathercode: [],
        wind_speed_10m: [],
      },
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
}
