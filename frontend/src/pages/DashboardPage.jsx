import { useEffect } from 'react';
import {
  Users,
  Database,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  AlertTriangle,
  Upload,
  Calendar,
  Activity,
  History,
  GraduationCap,
  Trash2,
  FileSpreadsheet,
  CheckCircle,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs border border-[var(--border-secondary,rgba(255,255,255,0.1))] bg-[var(--bg-card)] shadow-xl">
        <p className="text-[var(--text-secondary,#94a3b8)] mb-2 font-medium">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color || 'var(--accent-primary, #06b6d4)' }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

const insightTypeIcons = {
  insight: Lightbulb,
  recommendation: Lightbulb,
  warning: AlertTriangle,
  trend: TrendingUp,
};

const insightTypeColors = {
  insight: { bg: 'bg-[var(--accent-glow,rgba(6,182,212,0.1))] border-[var(--accent-primary,rgba(6,182,212,0.2))]', text: 'text-[var(--accent-primary,#06b6d4)]', dot: 'bg-[var(--accent-primary,#06b6d4)]' },
  warning: { bg: 'bg-red-500/10 border-red-500/20 border', text: 'text-red-400', dot: 'bg-red-400' },
  trend: { bg: 'bg-emerald-500/10 border-emerald-500/20 border', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  recommendation: { bg: 'bg-purple-500/10 border-purple-500/20 border', text: 'text-purple-400', dot: 'bg-purple-400' },
};

// Dashboard
function DashboardPage() {
  const { user } = useAuth();
  const { 
    data, 
    isDataLoaded, 
    isSample, 
    recentDatasets, 
    dashboardSummary, 
    loadSampleDataset, 
    loadRecentDataset, 
    deleteDataset, 
    refreshMetadata 
  } = useData();
  const navigate = useNavigate();

  // Load metadata
  useEffect(() => {
    refreshMetadata();
  }, []);

  if (!isDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center space-y-6">
        <Database className="w-16 h-16 text-slate-600 mb-2" />
        <h2 className="text-2xl font-bold text-white">No Dataset Available</h2>
        <p className="text-slate-400 max-w-md">
          Please upload a CSV or Excel dataset to get started with analytics.
        </p>
        <button
          onClick={() => navigate('/data-upload')}
          className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 shadow-lg"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Dataset</span>
        </button>
      </div>
    );
  }

  const totalRows = data.totalRows;
  const numericCols = Object.keys(data.stats || {});
  const categoricalCols = Object.keys(data.columnTypes).filter(col => data.columnTypes[col] === 'string');
  const totalMissing = Object.values(data.missingValues).reduce((a, b) => a + b, 0);
  const dataQualityScore = Math.max(0, 100 - (data.duplicateRows / Math.max(totalRows, 1)) * 100 - (totalMissing / Math.max(totalRows * data.totalColumns, 1)) * 100);

  const displayKpiCards = [
    { title: 'Dataset Name', value: data.fileName, icon: FileText, format: 'string' },
    { title: 'Total Rows', value: totalRows, icon: Database, format: 'number' },
    { title: 'Total Columns', value: data.totalColumns, icon: Database, format: 'number' },
    { title: 'Missing Values', value: totalMissing, icon: AlertTriangle, format: 'number' },
    { title: 'Duplicate Rows', value: data.duplicateRows, icon: AlertTriangle, format: 'number' },
    { title: 'Numeric Columns', value: numericCols.length, icon: TrendingUp, format: 'number' },
    { title: 'Categorical Columns', value: categoricalCols.length, icon: FileText, format: 'number' },
    { title: 'Data Quality Score (%)', value: dataQualityScore, icon: CheckCircle, format: 'percent' }
  ];

  let displayChartData = [];
  if (numericCols.length > 0) {
    displayChartData = data.rows.slice(0, 15).map((row, i) => {
      const chartPoint = { name: row[data.columns[0]] || `Row ${i+1}` };
      chartPoint[numericCols[0]] = Number(row[numericCols[0]]) || 0;
      if (numericCols.length > 1) {
        chartPoint[numericCols[1]] = Number(row[numericCols[1]]) || 0;
      }
      return chartPoint;
    });
  }

  // Format file size
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getSuggestedCharts = () => {
    const suggestions = [];
    if (numericCols.length > 0 && categoricalCols.length > 0) {
      suggestions.push(`Bar/Pie Chart: Compare aggregate ${numericCols[0]} grouped by ${categoricalCols[0]}.`);
      suggestions.push(`Line Chart: Plot trend of ${numericCols[0]} progression across records.`);
    }
    if (numericCols.length > 1) {
      suggestions.push(`Scatter Plot: Correlation distribution of ${numericCols[0]} vs ${numericCols[1]}.`);
    }
    if (numericCols.length > 0) {
      suggestions.push(`Histogram: Distribution spread of ${numericCols[0]} values grouped into statistical bins.`);
    }
    return suggestions.slice(0, 3);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome section */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="glass-card p-5 md:col-span-2 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow,rgba(6,182,212,0.05))] rounded-full -translate-y-6 translate-x-6 blur-xl" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary,#06b6d4)] to-blue-600 flex items-center justify-center shadow-md shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary,#fff)]">Welcome back, {user?.name}!</h2>
                <p className="text-xs text-[var(--text-secondary,#94a3b8)]">Specialization: {user?.branch || 'Data Analyst'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-900/40 rounded-xl border border-[var(--border-secondary,rgba(255,255,255,0.05))]">
                <p className="text-[10px] text-[var(--text-muted,#64748b)] font-semibold uppercase tracking-wider">College / University</p>
                <p className="text-xs font-bold text-slate-300 truncate mt-1">{user?.college || 'Not Specified'}</p>
              </div>
              <div className="p-3 bg-slate-900/40 rounded-xl border border-[var(--border-secondary,rgba(255,255,255,0.05))]">
                <p className="text-[10px] text-[var(--text-muted,#64748b)] font-semibold uppercase tracking-wider">Last Session Login</p>
                <p className="text-xs font-bold text-slate-300 mt-1">
                  {dashboardSummary.lastLogin ? new Date(dashboardSummary.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date(dashboardSummary.lastLogin).toLocaleDateString() : 'First Session'}
                </p>
              </div>
              <div className="p-3 bg-slate-900/40 rounded-xl border border-[var(--border-secondary,rgba(255,255,255,0.05))] col-span-2 sm:col-span-1">
                <p className="text-[10px] text-[var(--text-muted,#64748b)] font-semibold uppercase tracking-wider">Active Dataset</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-xs font-bold text-slate-300 truncate max-w-[120px]">{data.fileName}</p>
                  {isSample && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase shrink-0">Sample</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[var(--border-secondary,rgba(255,255,255,0.05))] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-[var(--text-secondary,#94a3b8)]">Explore Built-in Sample Datasets:</span>
            <div className="flex gap-2 w-full sm:w-auto">
              {[
                { name: 'sample_sales_data.csv', label: 'Sales Data' },
                { name: 'sample_superstore.csv', label: 'Superstore' },
                { name: 'sample_customer_data.csv', label: 'Customers' }
              ].map(opt => (
                <button
                  key={opt.name}
                  onClick={() => loadSampleDataset(opt.name)}
                  className={`flex-1 sm:flex-none text-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isSample && data.fileName === opt.name
                      ? 'bg-[var(--accent-glow,rgba(6,182,212,0.2))] text-[var(--accent-primary,#06b6d4)] border-[var(--accent-primary,#06b6d4)]'
                      : 'bg-slate-800/40 text-slate-400 border-[var(--border-secondary,rgba(255,255,255,0.08))] hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Activity log */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--accent-primary,#06b6d4)]" />
              Recent Activity Log
            </h3>
            <div className="space-y-3 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
              {dashboardSummary.recentActivities && dashboardSummary.recentActivities.length > 0 ? (
                dashboardSummary.recentActivities.map((act, idx) => (
                  <div key={idx} className="flex gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary,#06b6d4)] mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-200 truncate">{act.action}</p>
                      <p className="text-[10px] text-slate-400 truncate">{act.details}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 whitespace-nowrap align-self-start">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No activity logs recorded.</p>
              )}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--border-secondary,rgba(255,255,255,0.05))] text-right">
            <span className="text-[10px] text-slate-500 font-mono">SQLite Session Tracker Active</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between glass-card p-4 rounded-xl border border-[var(--border-secondary,rgba(255,255,255,0.05))]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--accent-glow,rgba(6,182,212,0.1))] rounded-lg">
            <FileSpreadsheet className="w-5 h-5 text-[var(--accent-primary,#06b6d4)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary,#fff)]">Active Data: {data.fileName}</h3>
              {isSample ? (
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                  Using Sample Dataset
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                  Uploaded Dataset
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary,#94a3b8)]">Dynamic analytics and mathematical distributions updated live.</p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {displayKpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const formattedValue = kpi.format === 'string'
            ? kpi.value
            : kpi.format === 'percent'
              ? `${kpi.value.toFixed(1)}%`
              : kpi.value.toLocaleString();

          return (
            <div key={kpi.title} className="glass-card p-5 card-hover relative overflow-hidden border border-[var(--border-secondary)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-glow,rgba(6,182,212,0.05))] rounded-full -translate-y-6 translate-x-6 blur-xl" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-[var(--accent-glow,rgba(6,182,212,0.1))] border border-[var(--border-secondary,rgba(255,255,255,0.05))]">
                  <Icon className="w-4 h-4 text-[var(--accent-primary,#06b6d4)]" />
                </div>
              </div>
              <p className="text-[var(--text-secondary,#94a3b8)] text-xs font-semibold mb-1 truncate">{kpi.title}</p>
              <p className="text-xl font-black text-[var(--text-primary,#fff)] truncate" title={formattedValue}>{formattedValue}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="glass-card p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary,#fff)]">Metrics Distribution Visualizer</h3>
              <p className="text-[var(--text-secondary,#94a3b8)] text-[11px] mt-0.5">Plotting leading 15 rows of {numericCols[0] || 'records'}</p>
            </div>
          </div>
          {numericCols.length > 0 ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary, #06b6d4)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--accent-primary, #06b6d4)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v > 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey={numericCols[0]} name={numericCols[0]} stroke="var(--accent-primary, #06b6d4)" strokeWidth={2.5} fill="url(#colorPrimary)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center bg-slate-900/10 rounded-xl border border-dashed border-slate-700">
              <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
              <p className="text-xs text-slate-400">Add numeric columns to plot area trends.</p>
            </div>
          )}
        </div>

        {/* Recent uploads */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--accent-primary,#06b6d4)]" />
              Recent Uploads (SQLite Cache)
            </h3>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {recentDatasets && recentDatasets.length > 0 ? (
                recentDatasets.map((ds) => (
                  <div 
                    key={ds.id} 
                    className="p-2.5 bg-slate-900/30 rounded-xl border border-[var(--border-secondary)] hover:border-[var(--accent-primary)]/50 transition-colors flex items-center justify-between group cursor-pointer"
                    onClick={() => loadRecentDataset(ds.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-200 truncate">{ds.file_name}</p>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-1">
                        <span>{ds.rows_count} rows</span>
                        <span>•</span>
                        <span>{formatBytes(ds.file_size)}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDataset(ds.id);
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 border border-dashed border-[var(--border-secondary)] rounded-xl">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-xs">No previous uploads in cache.</p>
                  <p className="text-[10px] mt-0.5">Your last 5 uploads will appear here.</p>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/data-upload')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Dataset
          </button>
        </div>
      </div>

      {/* Quick insights */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Quick Meta-Insights
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/30 border border-[var(--border-secondary)]">
              <span className="text-[10px] text-slate-500 font-semibold block">Total Columns</span>
              <span className="text-base font-black text-slate-200 mt-1 block">{data.totalColumns}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/30 border border-[var(--border-secondary)]">
              <span className="text-[10px] text-slate-500 font-semibold block">Total Rows</span>
              <span className="text-base font-black text-slate-200 mt-1 block">{data.totalRows.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/30 border border-[var(--border-secondary)]">
              <span className="text-[10px] text-slate-500 font-semibold block">Numeric Columns</span>
              <span className="text-base font-black text-cyan-400 mt-1 block">{numericCols.length}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/30 border border-[var(--border-secondary)]">
              <span className="text-[10px] text-slate-500 font-semibold block">Categorical Columns</span>
              <span className="text-base font-black text-purple-400 mt-1 block">{categoricalCols.length}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/30 border border-[var(--border-secondary)]">
              <span className="text-[10px] text-slate-500 font-semibold block">Missing Values</span>
              <span className={`text-base font-black mt-1 block ${Object.values(data.missingValues).reduce((a,b)=>a+b,0) > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                {Object.values(data.missingValues).reduce((a,b)=>a+b,0)}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/30 border border-[var(--border-secondary)]">
              <span className="text-[10px] text-slate-500 font-semibold block">Memory Footprint</span>
              <span className="text-base font-black text-slate-200 mt-1 block">{data.memoryUsage || '0 KB'}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Suggested visualizer Charts
          </h3>
          <p className="text-xs text-[var(--text-secondary,#94a3b8)]">The following graph charts match best with the distribution of data types inside the active dataset:</p>
          <div className="space-y-3">
            {getSuggestedCharts().map((sug, i) => (
              <div key={i} className="p-3 bg-[var(--accent-glow,rgba(6,182,212,0.06))] rounded-xl border border-[var(--accent-primary,#06b6d4)]/20 text-xs text-slate-200 leading-normal flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary,#06b6d4)] rounded-full mt-1.5 shrink-0" />
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-purple-400" />
            AI Analytical Insights
          </h3>
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {data.insights.slice(0, 3).map((insight) => {
              const colors = insightTypeColors[insight.type] || insightTypeColors.insight;
              const Icon = insightTypeIcons[insight.type] || Lightbulb;
              return (
                <div key={insight.id} className={`p-3 rounded-xl border ${colors.bg} flex gap-2.5 items-start`}>
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${colors.text}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold ${colors.text}`}>{insight.title}</p>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Data tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        <div className="glass-card p-5 overflow-hidden flex flex-col h-72">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            First 5 Records (Top)
          </h3>
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-900/50 sticky top-0">
                <tr>
                  {data.columns.slice(0, 5).map(col => (
                    <th key={col} className="px-3 py-2 text-slate-400 font-semibold border-b border-[var(--border-secondary)]">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-secondary)]">
                {data.rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    {data.columns.slice(0, 5).map(col => (
                      <td key={col} className="px-3 py-2 text-slate-300 truncate max-w-[100px]" title={row[col]}>{row[col] === null || row[col] === '' ? 'null' : String(row[col])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-5 overflow-hidden flex flex-col h-72">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 rotate-180 text-red-400" />
            Last 5 Records (Bottom)
          </h3>
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-900/50 sticky top-0">
                <tr>
                  {data.columns.slice(0, 5).map(col => (
                    <th key={col} className="px-3 py-2 text-slate-400 font-semibold border-b border-[var(--border-secondary)]">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-secondary)]">
                {data.rows.slice(-5).map((row, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    {data.columns.slice(0, 5).map(col => (
                      <td key={col} className="px-3 py-2 text-slate-300 truncate max-w-[100px]" title={row[col]}>{row[col] === null || row[col] === '' ? 'null' : String(row[col])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

export default DashboardPage;
