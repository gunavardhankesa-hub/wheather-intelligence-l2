import React from 'react';
import { MapPin, Star, Clock, ArrowUp, ArrowDown, Droplets, Wind, Sun, ShieldAlert } from 'lucide-react';
import { WeatherData, TemperatureUnit, SpeedUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { formatTemperature, formatSpeed, getWindDirectionLabel } from '../utils/unitConversion';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  tempUnit,
  speedUnit,
  isFavorite,
  onToggleFavorite,
}) => {
  const codeInfo = getWeatherCodeInfo(weather.current.weathercode);
  const currentTemp = formatTemperature(weather.current.temperature, tempUnit);
  const feelsLike = formatTemperature(
    weather.current.apparent_temperature ?? weather.current.temperature,
    tempUnit
  );

  const todayMax = weather.daily.temperature_2m_max[0] !== undefined
    ? formatTemperature(weather.daily.temperature_2m_max[0], tempUnit)
    : '--';

  const todayMin = weather.daily.temperature_2m_min[0] !== undefined
    ? formatTemperature(weather.daily.temperature_2m_min[0], tempUnit)
    : '--';

  const windSpeedFormatted = formatSpeed(weather.current.windspeed, speedUnit);
  const windDirLabel = getWindDirectionLabel(weather.current.winddirection);
  const humidity = weather.current.relative_humidity ?? 50;
  const precipProb = weather.daily.precipitation_probability_max?.[0] ?? 0;
  const uvMax = weather.daily.uv_index_max?.[0] ?? 0;

  const isDay = weather.current.is_day === 1;

  const formattedTime = new Date(weather.fetchedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${codeInfo.bgGradient} p-6 sm:p-8 border border-slate-700/80 shadow-2xl backdrop-blur-xl transition-all duration-300`}
    >
      {/* Decorative ambient background blur */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4 relative z-10 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {weather.locationName}
            </h2>
            {weather.country && (
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/80">
                {weather.country}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            {weather.admin1 && <span>{weather.admin1}</span>}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Updated {formattedTime}
            </span>
          </div>
        </div>

        {/* Favorite Pin Button & Day/Night Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
              isDay
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDay ? 'bg-amber-400 animate-pulse' : 'bg-indigo-400'}`} />
            {isDay ? 'Daytime' : 'Night'}
          </span>

          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Temperature & Weather Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10 my-4">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-inner ${codeInfo.accentColor}`}>
            <WeatherIcon name={codeInfo.icon} size={56} className="shrink-0" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter">
                {currentTemp}
              </span>
            </div>
            <div className="text-sm font-medium text-slate-300 mt-1 flex items-center gap-2">
              <span>Feels like {feelsLike}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end justify-center space-y-2">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-bold ${codeInfo.badgeBg} ${codeInfo.badgeText}`}>
            <span>{codeInfo.label}</span>
          </div>
          <p className="text-xs text-slate-300 md:text-right max-w-xs leading-relaxed">
            {codeInfo.description}
          </p>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 pt-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <ArrowDown className="w-3.5 h-3.5" /> Low: {todayMin}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-rose-400">
              <ArrowUp className="w-3.5 h-3.5" /> High: {todayMax}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Pill Strip */}
      <div className="mt-6 pt-6 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center gap-3">
          <Wind className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Wind Speed</div>
            <div className="text-xs font-bold text-slate-100">
              {windSpeedFormatted} <span className="text-[10px] text-slate-400">({windDirLabel})</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center gap-3">
          <Droplets className="w-5 h-5 text-teal-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Humidity</div>
            <div className="text-xs font-bold text-slate-100">{humidity}%</div>
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Rain Chance</div>
            <div className="text-xs font-bold text-slate-100">{precipProb}%</div>
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center gap-3">
          <Sun className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 font-medium">UV Max Today</div>
            <div className="text-xs font-bold text-slate-100">{uvMax} / 12</div>
          </div>
        </div>
      </div>
    </div>
  );
};
