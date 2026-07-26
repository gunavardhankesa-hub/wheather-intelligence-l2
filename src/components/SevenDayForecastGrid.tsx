import React, { useState } from 'react';
import { Calendar, Droplets, Sun, Wind, ChevronRight, X, ArrowUp, ArrowDown } from 'lucide-react';
import { WeatherData, TemperatureUnit, SpeedUnit } from '../types/weather';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { formatTemperature, formatSpeed, formatDateDayOfWeek, formatDateShort, formatTime } from '../utils/unitConversion';
import { WeatherIcon } from './WeatherIcon';

interface SevenDayForecastGridProps {
  weather: WeatherData;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const SevenDayForecastGrid: React.FC<SevenDayForecastGridProps> = ({ weather, tempUnit, speedUnit }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  const times = weather.daily.time || [];
  const codes = weather.daily.weathercode || [];
  const maxTemps = weather.daily.temperature_2m_max || [];
  const minTemps = weather.daily.temperature_2m_min || [];
  const precips = weather.daily.precipitation_probability_max || weather.daily.precipitation_sum || [];
  const precipSums = weather.daily.precipitation_sum || [];
  const uvMaxs = weather.daily.uv_index_max || [];
  const windMaxs = weather.daily.wind_speed_10m_max || [];
  const sunrises = weather.daily.sunrise || [];
  const sunsets = weather.daily.sunset || [];

  // Calculate global min and max across all 7 days for relative progress bar scaling
  const globalMin = Math.min(...minTemps.filter((t) => t !== undefined), 0);
  const globalMax = Math.max(...maxTemps.filter((t) => t !== undefined), 30);
  const tempRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" /> 7-Day Forecast
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any day for detailed daily environmental metrics
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {times.map((dateStr, idx) => {
          const code = codes[idx] ?? 0;
          const maxTemp = maxTemps[idx] ?? 0;
          const minTemp = minTemps[idx] ?? 0;
          const precipProb = precips[idx] ?? 0;
          const info = getWeatherCodeInfo(code);

          const dayLabel = formatDateDayOfWeek(dateStr);
          const dateShort = formatDateShort(dateStr);

          // Calculate bar offsets
          const leftPercent = Math.max(0, ((minTemp - globalMin) / tempRange) * 100);
          const barWidthPercent = Math.max(10, ((maxTemp - minTemp) / tempRange) * 100);

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDayIdx(idx)}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all gap-3"
            >
              {/* Left Day & Icon */}
              <div className="flex items-center gap-4 w-full sm:w-56 shrink-0">
                <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${info.accentColor} shrink-0`}>
                  <WeatherIcon name={info.icon} size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    {dayLabel}
                    <span className="text-xs font-normal text-slate-400">({dateShort})</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium truncate max-w-[140px]">
                    {info.label}
                  </div>
                </div>
              </div>

              {/* Rain Chance */}
              <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium w-24 shrink-0">
                <Droplets className="w-3.5 h-3.5 shrink-0" />
                <span>{precipProb}% rain</span>
              </div>

              {/* Temperature Bar Visualizer */}
              <div className="flex items-center gap-3 w-full sm:w-64">
                <span className="text-xs font-bold text-slate-400 w-10 text-right">
                  {formatTemperature(minTemp, tempUnit)}
                </span>

                <div className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-amber-400 to-rose-400 transition-all duration-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-slate-100 w-10">
                  {formatTemperature(maxTemp, tempUnit)}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors hidden sm:block shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Expanded Daily Details Modal */}
      {selectedDayIdx !== null && times[selectedDayIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedDayIdx(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-slate-800 border border-slate-700 ${getWeatherCodeInfo(codes[selectedDayIdx] ?? 0).accentColor}`}>
                <WeatherIcon name={getWeatherCodeInfo(codes[selectedDayIdx] ?? 0).icon} size={32} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {formatDateDayOfWeek(times[selectedDayIdx])}, {formatDateShort(times[selectedDayIdx])}
                </h4>
                <p className="text-xs text-slate-400">
                  {getWeatherCodeInfo(codes[selectedDayIdx] ?? 0).label}
                </p>
              </div>
            </div>

            {/* Detail Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Temperature High</span>
                <div className="text-sm font-bold text-rose-400 flex items-center gap-1 mt-1">
                  <ArrowUp className="w-3.5 h-3.5" />
                  {formatTemperature(maxTemps[selectedDayIdx] ?? 0, tempUnit)}
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Temperature Low</span>
                <div className="text-sm font-bold text-blue-400 flex items-center gap-1 mt-1">
                  <ArrowDown className="w-3.5 h-3.5" />
                  {formatTemperature(minTemps[selectedDayIdx] ?? 0, tempUnit)}
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" /> Rain Chance
                </span>
                <div className="text-sm font-bold text-slate-100 mt-1">
                  {precips[selectedDayIdx] ?? 0}% ({precipSums[selectedDayIdx] ?? 0} mm)
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Max UV Index
                </span>
                <div className="text-sm font-bold text-slate-100 mt-1">
                  {uvMaxs[selectedDayIdx] ?? 0} / 12
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-indigo-400" /> Max Wind Gust
                </span>
                <div className="text-sm font-bold text-slate-100 mt-1">
                  {formatSpeed(windMaxs[selectedDayIdx] ?? 0, speedUnit)}
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Sunrise / Sunset</span>
                <div className="text-xs font-bold text-slate-100 mt-1">
                  {sunrises[selectedDayIdx] ? formatTime(sunrises[selectedDayIdx], weather.timezone) : '--'} /{' '}
                  {sunsets[selectedDayIdx] ? formatTime(sunsets[selectedDayIdx], weather.timezone) : '--'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDayIdx(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
