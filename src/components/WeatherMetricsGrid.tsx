import React from 'react';
import { Wind, Droplets, Sun, Gauge, Sunrise, Sunset, CloudRain, Compass } from 'lucide-react';
import { WeatherData, SpeedUnit } from '../types/weather';
import { formatSpeed, getWindDirectionLabel, formatTime } from '../utils/unitConversion';

interface WeatherMetricsGridProps {
  weather: WeatherData;
  speedUnit: SpeedUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ weather, speedUnit }) => {
  const windSpeed = weather.current.windspeed;
  const windDir = weather.current.winddirection;
  const windDirLabel = getWindDirectionLabel(windDir);
  const humidity = weather.current.relative_humidity ?? 50;
  const pressure = Math.round(weather.current.surface_pressure ?? 1013);
  const uvMax = weather.daily.uv_index_max?.[0] ?? 0;
  const precipSum = weather.daily.precipitation_sum?.[0] ?? 0;

  const sunriseIso = weather.daily.sunrise?.[0];
  const sunsetIso = weather.daily.sunset?.[0];

  const sunriseFormatted = sunriseIso ? formatTime(sunriseIso, weather.timezone) : '06:00 AM';
  const sunsetFormatted = sunsetIso ? formatTime(sunsetIso, weather.timezone) : '07:30 PM';

  // UV index classification
  let uvLevel = 'Low';
  let uvColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (uvMax >= 11) {
    uvLevel = 'Extreme';
    uvColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
  } else if (uvMax >= 8) {
    uvLevel = 'Very High';
    uvColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (uvMax >= 6) {
    uvLevel = 'High';
    uvColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (uvMax >= 3) {
    uvLevel = 'Moderate';
    uvColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Wind & Direction */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl hover:border-slate-700/80 transition-all shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <Wind className="w-4 h-4 text-blue-400" /> Wind & Direction
          </span>
          <span className="text-xs font-bold text-slate-200">{windDirLabel}</span>
        </div>

        <div className="flex items-center justify-between my-2">
          <div>
            <div className="text-2xl font-extrabold text-white">
              {formatSpeed(windSpeed, speedUnit)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Heading {windDir}° ({windDirLabel})
            </p>
          </div>

          {/* Compass direction indicator */}
          <div className="relative w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6 text-slate-500" />
            <div
              className="absolute w-1 h-6 bg-gradient-to-t from-transparent to-blue-400 rounded-full origin-bottom transition-transform duration-500"
              style={{ transform: `rotate(${windDir}deg)`, bottom: '50%' }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
          {windSpeed > 30 ? 'High wind velocity. Exercise caution.' : 'Gentle to moderate breezes.'}
        </div>
      </div>

      {/* 2. Relative Humidity */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl hover:border-slate-700/80 transition-all shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <Droplets className="w-4 h-4 text-teal-400" /> Relative Humidity
          </span>
          <span className="text-xs font-bold text-teal-400">{humidity}%</span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-extrabold text-white">{humidity}%</div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${humidity}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
          {humidity > 70
            ? 'High moisture content in the air.'
            : humidity < 35
            ? 'Dry air conditions. Stay hydrated.'
            : 'Comfortable humidity level.'}
        </div>
      </div>

      {/* 3. UV Index */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl hover:border-slate-700/80 transition-all shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" /> Max UV Index
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${uvColor}`}>
            {uvLevel}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{uvMax}</span>
            <span className="text-xs text-slate-400">/ 12</span>
          </div>
          {/* UV Meter */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (uvMax / 12) * 100)}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
          {uvMax >= 6 ? 'Sun protection required (SPF 30+, hat).' : 'Minimal sun exposure risk.'}
        </div>
      </div>

      {/* 4. Atmospheric Pressure */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl hover:border-slate-700/80 transition-all shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-400" /> Surface Pressure
          </span>
          <span className="text-xs font-bold text-slate-300">hPa</span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-extrabold text-white">{pressure} hPa</div>
          <div className="text-xs text-slate-400 mt-1">
            {pressure > 1013 ? 'High pressure system (Stable)' : 'Low pressure system (Unstable)'}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
          Standard sea-level pressure is 1013.25 hPa.
        </div>
      </div>

      {/* 5. Sunrise & Sunset */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl hover:border-slate-700/80 transition-all shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400" /> Sun Schedule
          </span>
          <span className="text-xs font-bold text-slate-400">Solar Cycle</span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sunrise className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Sunrise</div>
              <div className="text-xs font-bold text-slate-100">{sunriseFormatted}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sunset className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Sunset</div>
              <div className="text-xs font-bold text-slate-100">{sunsetFormatted}</div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
          Calculated based on geographical coordinates.
        </div>
      </div>

      {/* 6. Precipitation Summary */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl hover:border-slate-700/80 transition-all shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-sky-400" /> Daily Accumulation
          </span>
          <span className="text-xs font-bold text-sky-400">{precipSum} mm</span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-extrabold text-white">{precipSum} mm</div>
          <div className="text-xs text-slate-400 mt-1">
            {precipSum > 5 ? 'Significant rainfall accumulation.' : precipSum > 0 ? 'Light moisture / showers.' : 'No rainfall expected today.'}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
          Total estimated 24-hour precipitation depth.
        </div>
      </div>
    </div>
  );
};
