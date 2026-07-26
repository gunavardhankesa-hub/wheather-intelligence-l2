import React, { useState } from 'react';
import { Lightbulb, Activity, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { WeatherData, RecommendationCategory } from '../types/weather';
import { calculateOutdoorScore, generateSmartRecommendations } from '../utils/smartRecommendations';
import { WeatherIcon } from './WeatherIcon';

interface SmartPlanningCardProps {
  weather: WeatherData;
}

export const SmartPlanningCard: React.FC<SmartPlanningCardProps> = ({ weather }) => {
  const [filter, setFilter] = useState<RecommendationCategory | 'all'>('all');

  const outdoor = calculateOutdoorScore(weather);
  const recommendations = generateSmartRecommendations(weather);

  const filteredRecs = filter === 'all'
    ? recommendations
    : recommendations.filter((r) => r.category === filter);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'alert':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
        };
      case 'success':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
        };
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Smart Planning Intelligence
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic activity scores and tailored daily recommendations
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {(['all', 'activity', 'clothing', 'warning', 'health'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Outdoor Activity Suitability Gauge */}
      <div className="bg-gradient-to-r from-slate-950/80 to-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center">
              <span className="text-xl font-extrabold text-white">{outdoor.score}</span>
            </div>
            <Activity className="absolute -top-1 -right-1 w-5 h-5 text-blue-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Outdoor Suitability
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${outdoor.color}`}>
                {outdoor.label} ({outdoor.score}/100)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
              {outdoor.summary}
            </p>
          </div>
        </div>

        {/* Score Progress Visual */}
        <div className="w-full md:w-48 shrink-0">
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
            <span>Poor</span>
            <span>Moderate</span>
            <span>Ideal</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${outdoor.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommendation List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {filteredRecs.length > 0 ? (
          filteredRecs.map((rec) => {
            const badge = getSeverityBadge(rec.severity);
            return (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3.5 group"
              >
                <div className={`p-2.5 rounded-xl border ${badge.bg} shrink-0 mt-0.5`}>
                  <WeatherIcon name={rec.iconName} size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                      {rec.title}
                    </h4>
                    {badge.icon}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8 text-slate-400 text-sm">
            No recommendations match the selected category &quot;{filter}&quot;.
          </div>
        )}
      </div>
    </div>
  );
};
