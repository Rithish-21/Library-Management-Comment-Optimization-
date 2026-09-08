import React from 'react';
export const MetricCard = ({ title, value, subtitle, icon, trend, colorScheme = 'indigo', onClick, }) => {
    const colorStyles = {
        indigo: {
            border: 'border-indigo-500/20 hover:border-indigo-500/40',
            iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
            glow: 'hover:shadow-glow',
        },
        emerald: {
            border: 'border-emerald-500/20 hover:border-emerald-500/40',
            iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
            glow: 'hover:shadow-glow-emerald',
        },
        amber: {
            border: 'border-amber-500/20 hover:border-amber-500/40',
            iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
            glow: 'hover:shadow-glow-amber',
        },
        rose: {
            border: 'border-rose-500/20 hover:border-rose-500/40',
            iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
            glow: 'hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.25)]',
        },
        purple: {
            border: 'border-purple-500/20 hover:border-purple-500/40',
            iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
            glow: 'hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.25)]',
        },
    };
    const scheme = colorStyles[colorScheme];
    return (<div onClick={onClick} className={`glass-card p-5 rounded-2xl border transition-all duration-300 ${scheme.border} ${scheme.glow} ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>

      {trend && (<div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className={trend.positive ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
            {trend.value}
          </span>
          <span className="text-slate-500">vs last month</span>
        </div>)}
    </div>);
};
