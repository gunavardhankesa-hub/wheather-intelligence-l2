import { useState, useEffect, useCallback } from 'react';
import { Loader2, CloudSun, MapPin, RefreshCw } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { HourlyForecastStrip } from './components/HourlyForecastStrip';
import { SevenDayForecastGrid } from './components/SevenDayForecastGrid';
import { TemperatureTrendChart } from './components/TemperatureTrendChart';
import { SmartPlanningCard } from './components/SmartPlanningCard';
import { FavoritesBar, FavoriteCity } from './components/FavoritesBar';
import { ErrorCard } from './components/ErrorCard';

import { LocationResult, WeatherData, TemperatureUnit, SpeedUnit } from './types/weather';
import { fetchWeatherData, reverseGeocode } from './services/openMeteo';

const DEFAULT_CITY = {
  name: 'Tokyo',
  country: 'Japan',
  lat: 35.6895,
  lng: 139.6917,
};

const FAVORITES_STORAGE_KEY = 'weather_intelligence_favorites_v1';
const TEMP_UNIT_KEY = 'weather_intelligence_temp_unit';
const SPEED_UNIT_KEY = 'weather_intelligence_speed_unit';

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(() => {
    return (localStorage.getItem(TEMP_UNIT_KEY) as TemperatureUnit) || 'celsius';
  });

  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(() => {
    return (localStorage.getItem(SPEED_UNIT_KEY) as SpeedUnit) || 'kmh';
  });

  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [currentLocation, setCurrentLocation] = useState(DEFAULT_CITY);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem(TEMP_UNIT_KEY, tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem(SPEED_UNIT_KEY, speedUnit);
  }, [speedUnit]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Main weather fetch function
  const loadWeather = useCallback(
    async (lat: number, lng: number, name: string, country?: string, admin1?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherData(lat, lng, name, country, admin1);
        setWeather(data);
        setCurrentLocation({ name, country: country || '', lat, lng });
      } catch (err) {
        console.error('Failed to load weather:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Could not retrieve weather forecast from Open-Meteo. Please check your network and try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load or Geolocation request
  useEffect(() => {
    let mounted = true;

    // Try geolocation first if available
    if ('geolocation' in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!mounted) return;
          const { latitude, longitude } = position.coords;
          try {
            const loc = await reverseGeocode(latitude, longitude);
            loadWeather(latitude, longitude, loc.name, loc.country, loc.admin1);
          } catch {
            loadWeather(DEFAULT_CITY.lat, DEFAULT_CITY.lng, DEFAULT_CITY.name, DEFAULT_CITY.country);
          } finally {
            if (mounted) setIsLoadingLocation(false);
          }
        },
        () => {
          // Fallback to default city on permission denial or position error
          if (mounted) {
            setIsLoadingLocation(false);
            loadWeather(DEFAULT_CITY.lat, DEFAULT_CITY.lng, DEFAULT_CITY.name, DEFAULT_CITY.country);
          }
        },
        { timeout: 8000 }
      );
    } else {
      loadWeather(DEFAULT_CITY.lat, DEFAULT_CITY.lng, DEFAULT_CITY.name, DEFAULT_CITY.country);
    }

    return () => {
      mounted = false;
    };
  }, [loadWeather]);

  const handleSelectCity = (location: LocationResult) => {
    loadWeather(location.latitude, location.longitude, location.name, location.country, location.admin1);
  };

  const handleUseLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          await loadWeather(latitude, longitude, loc.name, loc.country, loc.admin1);
        } catch {
          await loadWeather(latitude, longitude, 'My Location');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (err) => {
        setIsLoadingLocation(false);
        setError(`Location access error: ${err.message}. Please select a city manually.`);
      },
      { timeout: 8000 }
    );
  };

  const isCurrentFavorite = favorites.some(
    (f) => f.name.toLowerCase() === currentLocation.name.toLowerCase()
  );

  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== currentLocation.name.toLowerCase()));
    } else {
      const newFav: FavoriteCity = {
        id: Date.now(),
        name: currentLocation.name,
        country: currentLocation.country,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
      };
      setFavorites((prev) => [newFav, ...prev]);
    }
  };

  const handleRemoveFavorite = (id: string | number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar Header */}
      <Navbar
        tempUnit={tempUnit}
        speedUnit={speedUnit}
        onToggleTempUnit={() => setTempUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'))}
        onToggleSpeedUnit={() => setSpeedUnit((prev) => (prev === 'kmh' ? 'mph' : 'kmh'))}
        onRefresh={() =>
          loadWeather(currentLocation.lat, currentLocation.lng, currentLocation.name, currentLocation.country)
        }
        isRefreshing={isLoading}
        timezone={weather?.timezone}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Bar & Favorites */}
        <section className="space-y-3">
          <SearchBar
            onSelectCity={handleSelectCity}
            onUseLocation={handleUseLocation}
            isLoadingLocation={isLoadingLocation}
            activeCityName={currentLocation.name}
          />
          <FavoritesBar
            favorites={favorites}
            onSelectFavorite={handleSelectCity}
            onRemoveFavorite={handleRemoveFavorite}
            activeCityName={currentLocation.name}
          />
        </section>

        {/* Loading Skeleton */}
        {isLoading && !weather && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center space-y-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Loading Weather Intelligence...</h3>
              <p className="text-xs text-slate-400">Fetching live atmospheric metrics from Open-Meteo</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorCard
            errorMessage={error}
            onRetry={() =>
              loadWeather(currentLocation.lat, currentLocation.lng, currentLocation.name, currentLocation.country)
            }
            onSelectFallbackCity={handleSelectCity}
          />
        )}

        {/* Weather Dashboard UI */}
        {weather && (
          <div className="space-y-6 animate-fadeIn">
            {/* Current Weather Card */}
            <CurrentWeatherCard
              weather={weather}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* 24-Hour Forecast Strip */}
            <HourlyForecastStrip weather={weather} tempUnit={tempUnit} />

            {/* Middle Grid: 7-Day Forecast + Temperature Trend Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SevenDayForecastGrid weather={weather} tempUnit={tempUnit} speedUnit={speedUnit} />
              <TemperatureTrendChart weather={weather} tempUnit={tempUnit} />
            </div>

            {/* Smart Planning Section */}
            <SmartPlanningCard weather={weather} />

            {/* Environmental Metrics Grid */}
            <WeatherMetricsGrid weather={weather} speedUnit={speedUnit} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500 space-y-1 mt-12">
        <div className="flex items-center justify-center gap-2">
          <CloudSun className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-slate-400">Weather Intelligence Platform</span>
        </div>
        <p>
          Powered by Open-Meteo Forecast & Geocoding APIs. All weather data updated real-time.
        </p>
      </footer>
    </div>
  );
}
