import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Database, AlertTriangle, BarChart3, TrendingUp, PieChart as PieIcon, BarChart2, Plus, Info } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils/helpers';
import { generateHistogram } from '../utils/dataAnalysis';

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f43f5e', '#6366f1'];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs border border-[var(--border-secondary,rgba(255,255,255,0.1))] bg-[var(--bg-card)] shadow-xl">
        {payload.map((p, idx) => (
          <p key={idx} style={{ color: p.color || 'var(--accent-primary, #06b6d4)' }}>
            {p.name || 'Value'}: {typeof p.value === 'number' ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Analytics
function AnalyticsPage() {
  const { data, isDataLoaded } = useData();
  const [activeTab, setActiveTab] = useState('bar');

  const [selectedNumCol, setSelectedNumCol] = useState('');
  const [selectedNumCol2, setSelectedNumCol2] = useState('');
  const [selectedCatCol, setSelectedCatCol] = useState('');

  if (!isDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center">
        <Database className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Data Available</h2>
        <p className="text-slate-400 max-w-md">Upload a dataset to view detailed analytics.</p>
      </div>
    );
  }

  const numericCols = Object.keys(data.stats || {});
  const stringCols = Object.keys(data.columnTypes).filter(col => data.columnTypes[col] === 'string');

  if (numericCols.length === 0) {
    return (
      <div className="glass-card p-12 text-center rounded-xl animate-fade-in">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Insufficient Numerical Columns</h3>
        <p className="text-slate-400">Detailed analytics require at least one numeric column to compute distributions and statistics.</p>
      </div>
    );
  }

  const activeNumCol = selectedNumCol || numericCols[0];
  const activeNumCol2 = selectedNumCol2 || (numericCols.length > 1 ? numericCols[1] : numericCols[0]);
  const activeCatCol = selectedCatCol || (stringCols.length > 0 ? stringCols[0] : data.columns[0]);

  const chartRows = data.rows.slice(0, 20);

  const barData = chartRows.map((r, i) => ({
    name: String(r[activeCatCol] || `Row ${i+1}`).substring(0, 12),
    [activeNumCol]: Number(r[activeNumCol]) || 0
  }));

  const lineData = chartRows.map((r, i) => ({
    name: String(r[activeCatCol] || `Row ${i+1}`).substring(0, 12),
    [activeNumCol]: Number(r[activeNumCol]) || 0,
    [activeNumCol2]: Number(r[activeNumCol2]) || 0
  }));

  let pieData = [];
  if (stringCols.length > 0) {
    const agg = {};
    data.rows.forEach(r => {
      const cat = r[activeCatCol] || 'Unknown';
      const val = Number(r[activeNumCol]) || 0;
      agg[cat] = (agg[cat] || 0) + val;
    });
    
    pieData = Object.entries(agg)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }

  const histogramData = generateHistogram(data.rows, activeNumCol, data.stats[activeNumCol]);

  const scatterData = data.rows.map(r => ({
    x: Number(r[activeNumCol]) || 0,
    y: Number(r[activeNumCol2]) || 0,
    name: String(r[activeCatCol] || '')
  }));

  const areaData = chartRows.map((r, i) => ({
    name: String(r[activeCatCol] || `Row ${i+1}`).substring(0, 12),
    [activeNumCol]: Number(r[activeNumCol]) || 0
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Statistics table */}
      <div className="glass-card p-5 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-[var(--accent-primary,#06b6d4)]" />
          Summary Statistics Table
        </h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-400 border-b border-[var(--border-secondary)]">Numeric Column</th>
                <th className="px-4 py-3 font-semibold text-slate-400 border-b border-[var(--border-secondary)]">Mean</th>
                <th className="px-4 py-3 font-semibold text-slate-400 border-b border-[var(--border-secondary)]">Median</th>
                <th className="px-4 py-3 font-semibold text-slate-400 border-b border-[var(--border-secondary)]">Mode</th>
                <th className="px-4 py-3 font-semibold text-slate-400 border-b border-[var(--border-secondary)]">Minimum</th>
                <th className="px-4 py-3 font-semibold text-slate-400 border-b border-[var(--border-secondary)]">Maximum</th>
                <th className="px-4 py-3 font-semibold text-slate-400 border-b border-[var(--border-secondary)]">Std Dev (σ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              {numericCols.map((col) => {
                const stat = data.stats[col];
                if (!stat) return null;
                return (
                  <tr key={col} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-200">{col}</td>
                    <td className="px-4 py-3 text-slate-300">{stat.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-slate-300">{stat.median.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-slate-300">{stat.mode}</td>
                    <td className="px-4 py-3 text-slate-300">{stat.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-slate-300">{stat.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-slate-300">{stat.std.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart selectors */}
      <div className="glass-card p-4 grid sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Primary Variable (Y-Axis)</label>
          <select
            value={activeNumCol}
            onChange={(e) => setSelectedNumCol(e.target.value)}
            className="w-full bg-slate-900 border border-[var(--border-secondary)] rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-[var(--accent-primary)] transition-colors"
          >
            {numericCols.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Secondary Variable (Scatter / Line)</label>
          <select
            value={activeNumCol2}
            onChange={(e) => setSelectedNumCol2(e.target.value)}
            className="w-full bg-slate-900 border border-[var(--border-secondary)] rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-[var(--accent-primary)] transition-colors"
          >
            {numericCols.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Categorical Label (X-Axis / Grouping)</label>
          <select
            value={activeCatCol}
            onChange={(e) => setSelectedCatCol(e.target.value)}
            className="w-full bg-slate-900 border border-[var(--border-secondary)] rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-[var(--accent-primary)] transition-colors"
          >
            {stringCols.length > 0 ? (
              stringCols.map(c => (
                <option key={c} value={c}>{c}</option>
              ))
            ) : (
              data.columns.map(c => (
                <option key={c} value={c}>{c}</option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-4">
        
        <div className="flex gap-1 bg-slate-900/30 p-1.5 rounded-xl border border-[var(--border-secondary)] w-wrap overflow-x-auto">
          {[
            { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
            { id: 'line', label: 'Line Chart', icon: TrendingUp },
            { id: 'pie', label: 'Pie Chart', icon: PieIcon },
            { id: 'histogram', label: 'Histogram', icon: BarChart2 },
            { id: 'scatter', label: 'Scatter Plot', icon: Plus },
            { id: 'area', label: 'Area Chart', icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--accent-glow,rgba(6,182,212,0.2))] text-[var(--accent-primary,#06b6d4)] border border-[var(--accent-primary,#06b6d4)]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="glass-card p-5">
          
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {activeTab === 'bar' && `Distribution: ${activeNumCol} by ${activeCatCol}`}
              {activeTab === 'line' && `Trend Comparison: ${activeNumCol} vs ${activeNumCol2}`}
              {activeTab === 'pie' && `Market share: Proportion of ${activeNumCol} grouped by ${activeCatCol}`}
              {activeTab === 'histogram' && `Frequency Histogram: ${activeNumCol}`}
              {activeTab === 'scatter' && `Correlation: ${activeNumCol} (X-Axis) vs ${activeNumCol2} (Y-Axis)`}
              {activeTab === 'area' && `Accumulative Aggregate: ${activeNumCol}`}
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Auto-computed directly from active uploaded columns.</p>
          </div>

          <div className="h-[400px]">
            
            {activeTab === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey={activeNumCol} fill="var(--accent-primary, #06b6d4)" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  <Line type="monotone" dataKey={activeNumCol} stroke="var(--accent-primary, #06b6d4)" strokeWidth={2.5} dot={{ r: 3 }} />
                  {numericCols.length > 1 && (
                    <Line type="monotone" dataKey={activeNumCol2} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'pie' && pieData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={true}
                    label={({ name, percent }) => `${name.substring(0, 8)} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
            {activeTab === 'pie' && pieData.length === 0 && (
              <div className="h-full flex items-center justify-center border border-dashed border-[var(--border-secondary)] rounded-xl">
                <p className="text-xs text-slate-500">No categorical labels found to aggregate.</p>
              </div>
            )}

            {activeTab === 'histogram' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Frequency" fill="var(--accent-primary, #06b6d4)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'scatter' && (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="x" name={activeNumCol} stroke="var(--text-muted, #475569)" tick={{ fontSize: 10 }} />
                  <YAxis type="number" dataKey="y" name={activeNumCol2} stroke="var(--text-muted, #475569)" tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Scatter name={`${activeNumCol} vs ${activeNumCol2}`} data={scatterData} fill="var(--accent-primary, #06b6d4)">
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'area' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="colorAreaPrim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary, #06b6d4)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--accent-primary, #06b6d4)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted, #475569)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey={activeNumCol} stroke="var(--accent-primary, #06b6d4)" strokeWidth={2.5} fill="url(#colorAreaPrim)" />
                </AreaChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>
      </div>

      {/* Data suggestions */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400" />
          Data Correlation Notes
        </h3>
        <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>• <strong>Outlier Analysis:</strong> Outliers are selected using Standard Deviations from the Mean (<span className="font-mono">μ ± 2σ</span>). Outliers might signify sensor glitches, input mistakes, or rare transactions. Before applying classification algorithms like Support Vector Machines (SVM), scaling operations should be implemented to prevent anomalies from dominating hyperplane orientation.</p>
          <p>• <strong>Visual Suggestions:</strong> We recommend plotting Scatter views to visually check linear correlation. Linear relationships align perfectly with Simple Linear Regression, whereas clusters or non-linear distributions suggest fitting Decision Tree Regressors or Random Forests.</p>
        </div>
      </div>

    </div>
  );
}

export default AnalyticsPage;
