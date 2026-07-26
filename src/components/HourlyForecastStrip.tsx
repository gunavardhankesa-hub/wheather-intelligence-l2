import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { formatTemperature } from '../utils/unitConversion';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastStripProps {
  weather: WeatherData;
  tempUnit: TemperatureUnit;
}

export const HourlyForecastStrip: React.FC<HourlyForecastStripProps> = ({ weather, tempUnit }) => {
  const times = weather.hourly.time || [];
  const temps = weather.hourly.temperature_2m || [];
  const codes = weather.hourly.weathercode || [];
  const precips = weather.hourly.precipitation_probability || [];

  // Get next 24 hourly slices starting from current hour
  const nowISO = new Date().toISOString().slice(0, 13);
  let startIndex = times.findIndex((t) => t.slice(0, 13) >= nowISO);
  if (startIndex === -1) startIndex = 0;

  const hourlySlice = times.slice(startIndex, startIndex + 24).map((time, idx) => {
    const realIdx = startIndex + idx;
    const dateObj = new Date(time);
    const hourFormatted = dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const code = codes[realIdx] ?? 0;
    const temp = temps[realIdx] ?? 0;
    const precipProb = precips[realIdx] ?? 0;
    const info = getWeatherCodeInfo(code);

    return {
      time,
      hourFormatted,
      temp,
      code,
      precipProb,
      info,
      isNow: idx === 0,
    };
  });

  if (hourlySlice.length === 0) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" /> 24-Hour Forecast
        </h3>
        <span className="text-xs text-slate-400">Scroll horizontally →</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {hourlySlice.map((item, idx) => (
          <div
            key={`${item.time}-${idx}`}
            className={`flex flex-col items-center justify-between p-3.5 rounded-xl min-w-[88px] border transition-all shrink-0 ${
              item.isNow
                ? 'bg-blue-600/20 border-blue-500/40 text-white shadow-md shadow-blue-500/10'
                : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
            }`}
          >
            <span className={`text-xs font-semibold ${item.isNow ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
              {item.isNow ? 'Now' : item.hourFormatted}
            </span>

            <div className={`my-3.5 ${item.info.accentColor}`}>
              <WeatherIcon name={item.info.icon} size={28} />
            </div>

            <span className="text-sm font-bold text-slate-100">
              {formatTemperature(item.temp, tempUnit)}
            </span>

            {/* Rain chance badge */}
            <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-sky-400">
              <Droplets className="w-3 h-3 shrink-0" />
              <span>{item.precipProb}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
