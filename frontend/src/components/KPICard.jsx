import { TrendingUp, TrendingDown } from 'lucide-react';

function KPICard({ title, value, change, trend, icon: Icon, prefix = '', suffix = '', format = 'number' }) {
  const isPositive = trend === 'up';
  const formattedValue = format === 'currency'
    ? `$${(value / 1000).toFixed(0)}K`
    : format === 'percent'
    ? `${value}%`
    : value.toLocaleString();

  return (
    <div className="glass-card p-6 card-hover relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -translate-y-8 translate-x-8 blur-2xl" />

      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          isPositive
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">
          {prefix}{formattedValue}{suffix}
        </p>
        <p className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}% vs last month
        </p>
      </div>
    </div>
  );
}

export default KPICard;
