import { TemperatureUnit, SpeedUnit } from '../types/weather';

export function convertTemperature(tempCelsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((tempCelsius * 9) / 5 + 32);
  }
  return Math.round(tempCelsius);
}

export function formatTemperature(tempCelsius: number, unit: TemperatureUnit): string {
  const converted = convertTemperature(tempCelsius, unit);
  const symbol = unit === 'fahrenheit' ? '°F' : '°C';
  return `${converted}${symbol}`;
}

export function convertSpeed(speedKmh: number, unit: SpeedUnit): number {
  if (unit === 'mph') {
    return Math.round(speedKmh * 0.621371);
  }
  return Math.round(speedKmh);
}

export function formatSpeed(speedKmh: number, unit: SpeedUnit): string {
  const converted = convertSpeed(speedKmh, unit);
  const symbol = unit === 'mph' ? 'mph' : 'km/h';
  return `${converted} ${symbol}`;
}

export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'N';
}

export function formatTime(isoString: string, timezone?: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return isoString.split('T')[1]?.slice(0, 5) || isoString;
  }
}

export function formatDateDayOfWeek(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(dateString + 'T00:00:00');
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}
