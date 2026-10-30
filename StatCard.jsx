import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendPositive = true, 
  color = 'amber' 
}) {
  const colorStyles = {
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400',
      bar: 'bg-amber-400',
      text: 'text-amber-400'
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      bar: 'bg-emerald-400',
      text: 'text-emerald-400'
    },
    blue: {
      border: 'hover:border-blue-500/50',
      iconBg: 'bg-blue-500/10 text-blue-400',
      bar: 'bg-blue-400',
      text: 'text-blue-400'
    },
    purple: {
      border: 'hover:border-purple-500/50',
      iconBg: 'bg-purple-500/10 text-purple-400',
      bar: 'bg-purple-400',
      text: 'text-purple-400'
    },
    rose: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-400',
      bar: 'bg-rose-400',
      text: 'text-rose-400'
    }
  }[color] || {
    border: 'hover:border-amber-500/50',
    iconBg: 'bg-amber-500/10 text-amber-400',
    bar: 'bg-amber-400',
    text: 'text-amber-400'
  };

  return (
    <div className={`relative bg-slate-900/80 rounded-2xl p-5 border border-slate-800 transition-all duration-300 overflow-hidden shadow-lg shadow-black/20 powerbi-card ${colorStyles.border}`}>
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorStyles.bar}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                trendPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
              }`}>
                {trend}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${colorStyles.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5 flex items-center justify-between">
          <span>{subtitle}</span>
          <span className="text-[10px] text-slate-500 font-mono">Live</span>
        </p>
      )}
    </div>
  );
}
