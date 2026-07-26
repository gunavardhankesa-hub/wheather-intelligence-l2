import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Navigation, Building2 } from 'lucide-react';
import { LocationResult } from '../types/weather';
import { searchCities } from '../services/openMeteo';

interface SearchBarProps {
  onSelectCity: (location: LocationResult) => void;
  onUseLocation: () => void;
  isLoadingLocation: boolean;
  activeCityName?: string;
}

const POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lng: 139.6917 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.006 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseLocation,
  isLoadingLocation,
  activeCityName,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: LocationResult) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full space-y-3" ref={wrapperRef}>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        {/* Input box */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> : <Search className="w-5 h-5" />}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search city, region, or country (e.g., Tokyo, London, Berlin)..."
            className="w-full pl-11 pr-10 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete suggestions dropdown */}
          {isOpen && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto divide-y divide-slate-800/80 backdrop-blur-xl">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/50">
                Matching Locations ({suggestions.length})
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition-colors ${
                    selectedIndex === idx ? 'bg-blue-600/30 text-white' : 'hover:bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-100">{item.name}</span>
                      <span className="text-xs text-slate-400 ml-2">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>
                  {item.elevation !== undefined && (
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      Elev. {Math.round(item.elevation)}m
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {isOpen && !isSearching && query.length >= 2 && suggestions.length === 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-xl p-4 text-center text-sm text-slate-400 shadow-xl z-50">
              No matching cities found for &quot;{query}&quot;. Try another search.
            </div>
          )}
        </div>

        {/* GPS Location Button */}
        <button
          onClick={onUseLocation}
          disabled={isLoadingLocation}
          className="w-full sm:w-auto px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 shrink-0"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>Use Location</span>
        </button>
      </div>

      {/* Popular City Triggers */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
        <span className="text-xs font-medium text-slate-400 shrink-0 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" /> Popular:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isActive = activeCityName?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              onClick={() =>
                onSelectCity({
                  id: Math.random(),
                  name: city.name,
                  latitude: city.lat,
                  longitude: city.lng,
                  country: city.country,
                })
              }
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/60 hover:text-white'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
