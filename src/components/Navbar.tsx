import React from 'react';
import { CloudSun, RefreshCw, Compass } from 'lucide-react';
import { TemperatureUnit, SpeedUnit } from '../types/weather';

interface NavbarProps {
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  onToggleTempUnit: () => void;
  onToggleSpeedUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  timezone?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  tempUnit,
  speedUnit,
  onToggleTempUnit,
  onToggleSpeedUnit,
  onRefresh,
  isRefreshing,
  timezone,
}) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                Weather Intelligence
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                Live Open-Meteo
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
              Precision global forecasts & smart activity planning
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {timezone && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>{timezone}</span>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh weather data"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* Unit Toggle Group */}
          <div className="flex items-center rounded-lg bg-slate-800/90 p-1 border border-slate-700/80">
            <button
              onClick={onToggleTempUnit}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 text-slate-200 hover:text-white"
            >
              <span className={tempUnit === 'celsius' ? 'text-blue-400 font-bold' : 'text-slate-500'}>°C</span>
              <span className="text-slate-600">/</span>
              <span className={tempUnit === 'fahrenheit' ? 'text-blue-400 font-bold' : 'text-slate-500'}>°F</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center rounded-lg bg-slate-800/90 p-1 border border-slate-700/80">
            <button
              onClick={onToggleSpeedUnit}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all text-slate-300 hover:text-white"
            >
              <span className={speedUnit === 'kmh' ? 'text-indigo-400 font-bold' : 'text-slate-500'}>km/h</span>
              <span className="text-slate-600">/</span>
              <span className={speedUnit === 'mph' ? 'text-indigo-400 font-bold' : 'text-slate-500'}>mph</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
