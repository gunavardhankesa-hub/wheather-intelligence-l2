import React from 'react';
import { Bookmark, MapPin, Trash2 } from 'lucide-react';
import { LocationResult } from '../types/weather';

export interface FavoriteCity {
  id: string | number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface FavoritesBarProps {
  favorites: FavoriteCity[];
  onSelectFavorite: (fav: LocationResult) => void;
  onRemoveFavorite: (id: string | number) => void;
  activeCityName?: string;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
  activeCityName,
}) => {
  if (favorites.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 shrink-0">
        <Bookmark className="w-4 h-4 fill-amber-400/20" /> Favorites ({favorites.length}):
      </div>

      <div className="flex items-center gap-2">
        {favorites.map((fav) => {
          const isActive = activeCityName?.toLowerCase() === fav.name.toLowerCase();
          return (
            <div
              key={fav.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <button
                onClick={() =>
                  onSelectFavorite({
                    id: typeof fav.id === 'number' ? fav.id : Math.random(),
                    name: fav.name,
                    latitude: fav.latitude,
                    longitude: fav.longitude,
                    country: fav.country,
                    admin1: fav.admin1,
                  })
                }
                className="flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-semibold">{fav.name}</span>
                {fav.country && <span className="text-[10px] text-slate-400">({fav.country})</span>}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(fav.id);
                }}
                className="text-slate-500 hover:text-rose-400 transition-colors p-0.5 ml-1"
                title="Remove from favorites"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
