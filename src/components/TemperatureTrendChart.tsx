import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart2, CloudRain, Sun } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { convertTemperature, formatDateDayOfWeek, formatDateShort } from '../utils/unitConversion';

interface TemperatureTrendChartProps {
  weather: WeatherData;
  tempUnit: TemperatureUnit;
}

type ChartMetric = 'temp' | 'rain' | 'uv';

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({ weather, tempUnit }) => {
  const [metric, setMetric] = useState<ChartMetric>('temp');

  const times = weather.daily.time || [];
  const maxTemps = weather.daily.temperature_2m_max || [];
  const minTemps = weather.daily.temperature_2m_min || [];
  const apparentMax = weather.daily.apparent_temperature_max || maxTemps;
  const precipProbs = weather.daily.precipitation_probability_max || [];
  const precipSums = weather.daily.precipitation_sum || [];
  const uvMaxs = weather.daily.uv_index_max || [];

  const chartData = times.map((dateStr, idx) => {
    const dayLabel = formatDateDayOfWeek(dateStr);
    const dateShort = formatDateShort(dateStr);

    const maxTempC = maxTemps[idx] ?? 0;
    const minTempC = minTemps[idx] ?? 0;
    const appMaxC = apparentMax[idx] ?? maxTempC;

    return {
      dayLabel,
      dateShort,
      maxTemp: convertTemperature(maxTempC, tempUnit),
      minTemp: convertTemperature(minTempC, tempUnit),
      apparentMax: convertTemperature(appMaxC, tempUnit),
      rainProb: precipProbs[idx] ?? 0,
      rainSum: precipSums[idx] ?? 0,
      uvIndex: uvMaxs[idx] ?? 0,
    };
  });

  const tempSymbol = tempUnit === 'fahrenheit' ? '°F' : '°C';

  // Custom Recharts Tooltip Component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 backdrop-blur-xl">
          <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">
            {label} ({payload[0]?.payload?.dateShort})
          </p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-semibold">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="text-white">
                {entry.value}
                {metric === 'temp' ? tempSymbol : metric === 'rain' ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> 7-Day Trend Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualization of daily maximum and minimum weather parameters
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setMetric('temp')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              metric === 'temp'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> Temperature
          </button>

          <button
            onClick={() => setMetric('rain')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              metric === 'rain'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain Chance
          </button>

          <button
            onClick={() => setMetric('uv')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              metric === 'uv'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> UV Index
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="uvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="dayLabel" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit={metric === 'temp' ? tempSymbol : metric === 'rain' ? '%' : ''}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#cbd5e1', paddingBottom: '12px' }}
            />

            {metric === 'temp' && (
              <>
                <Area
                  type="monotone"
                  dataKey="maxTemp"
                  name={`High Temp (${tempSymbol})`}
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#maxTempGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="minTemp"
                  name={`Low Temp (${tempSymbol})`}
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#minTempGrad)"
                />
              </>
            )}

            {metric === 'rain' && (
              <Area
                type="monotone"
                dataKey="rainProb"
                name="Precipitation Probability (%)"
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#rainGrad)"
              />
            )}

            {metric === 'uv' && (
              <Area
                type="monotone"
                dataKey="uvIndex"
                name="Max UV Index"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#uvGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
