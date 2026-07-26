import React from 'react';
import { AlertTriangle, RefreshCw, MapPin, Search } from 'lucide-react';
import { LocationResult } from '../types/weather';

interface ErrorCardProps {
  errorMessage: string;
  onRetry: () => void;
  onSelectFallbackCity: (city: LocationResult) => void;
}

const FALLBACK_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lng: 139.6917 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.006 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
];

export const ErrorCard: React.FC<ErrorCardProps> = ({
  errorMessage,
  onRetry,
  onSelectFallbackCity,
}) => {
  return (
    <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl my-6 space-y-5 animate-fadeIn">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Unable to Fetch Weather Data
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {errorMessage || 'Something went wrong while connecting to the weather network. Please check your internet connection or city name.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-rose-600/20 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>

      <div className="pt-4 border-t border-rose-500/20 max-w-md mx-auto space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
          <Search className="w-3.5 h-3.5 text-blue-400" /> Or try searching one of these popular cities:
        </span>
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {FALLBACK_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() =>
                onSelectFallbackCity({
                  id: Math.random(),
                  name: city.name,
                  latitude: city.lat,
                  longitude: city.lng,
                  country: city.country,
                })
              }
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-medium rounded-lg border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
