import { useState, useRef, useMemo } from 'react';
import { 
  Upload, FileSpreadsheet, Trash2, Download, Table, BarChart2, 
  Lightbulb, AlertTriangle, TrendingUp, Sparkles, ChevronRight, File,
  Search, ArrowUpDown, ChevronLeft, ChevronRight as ChevronRightIcon, Filter, X
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useData } from '../contexts/DataContext';
import { parseFileToRows } from '../utils/csvParser';
import { exportToCSV } from '../utils/exportUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md text-xs">
        <p className="text-slate-300 font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-medium">{typeof entry.value === 'number' ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f43f5e', '#6366f1'];

// Upload form
function DataUploadPage() {
  const { data, isDataLoaded, uploadDataset, clearData } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);

  // Table states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterCol, setFilterCol] = useState('');
  const [filterVal, setFilterVal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // Handle file
  const handleFile = async (file) => {
    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert('Please upload a CSV or Excel file.');
      return;
    }

    setIsLoading(true);
    try {
      const { rows, columns } = await parseFileToRows(file);
      await uploadDataset(file.name, file.size, rows, columns);
      setSearchQuery('');
      setSortConfig({ key: null, direction: 'asc' });
      setFilterCol('');
      setFilterVal('');
      setCurrentPage(1);
      setActiveTab('overview');
    } catch (error) {
      console.error("Error parsing file:", error);
      alert('Error reading file. Please check the format.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Sort table
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const stringCols = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.columnTypes).filter(col => data.columnTypes[col] === 'string');
  }, [data]);

  const uniqueFilterValues = useMemo(() => {
    if (!data || !filterCol) return [];
    const values = data.rows.map(r => r[filterCol]).filter(v => v !== null && v !== undefined && v !== '');
    return Array.from(new Set(values));
  }, [data, filterCol]);

  // Search and filter
  const processedRows = useMemo(() => {
    if (!data) return [];
    let rows = [...data.rows];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      rows = rows.filter(row => 
        data.columns.some(col => String(row[col] || '').toLowerCase().includes(query))
      );
    }

    if (filterCol && filterVal) {
      rows = rows.filter(row => String(row[filterCol] || '') === filterVal);
    }

    if (sortConfig.key) {
      rows.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal === null || aVal === undefined || aVal === '') return 1;
        if (bVal === null || bVal === undefined || bVal === '') return -1;
        
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        return sortConfig.direction === 'asc' 
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return rows;
  }, [data, searchQuery, sortConfig, filterCol, filterVal]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return processedRows.slice(startIndex, startIndex + rowsPerPage);
  }, [processedRows, currentPage]);

  const totalPages = Math.ceil(processedRows.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;

  // Render functions
  const renderUploadZone = () => (
    <div className="max-w-3xl mx-auto mt-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Analyze Your Dataset</h1>
        <p className="text-slate-400 text-lg">Upload your CSV or Excel files to automatically generate insights and charts.</p>
      </div>

      <div 
        className={`glass-card p-12 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer ${
          isDragging ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10 hover:border-cyan-500/50 hover:bg-slate-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileInput} 
          accept=".csv,.xlsx,.xls" 
          className="hidden" 
        />
        
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-xl">
          {isLoading ? (
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-cyan-400" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          {isLoading ? 'Analyzing Data...' : 'Drag & Drop your file here'}
        </h3>
        <p className="text-slate-400 mb-6 max-w-md">
          {isLoading ? 'Processing your dataset locally.' : 'Supported formats: .CSV, .XLSX, .XLS'}
        </p>
        
        {!isLoading && (
          <button className="btn-primary px-6 py-2.5 rounded-xl text-white font-semibold">
            Browse Files
          </button>
        )}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      <div className="glass-card p-6 rounded-xl border-t-4 border-t-cyan-500">
        <p className="text-slate-400 text-xs mb-1">Total Rows</p>
        <p className="text-3xl font-black text-[var(--text-primary)]">{data.totalRows.toLocaleString()}</p>
      </div>
      <div className="glass-card p-6 rounded-xl border-t-4 border-t-blue-500">
        <p className="text-slate-400 text-xs mb-1">Total Columns</p>
        <p className="text-3xl font-black text-[var(--text-primary)]">{data.totalColumns.toLocaleString()}</p>
      </div>
      <div className="glass-card p-6 rounded-xl border-t-4 border-t-amber-500">
        <p className="text-slate-400 text-xs mb-1">Duplicate Rows</p>
        <p className="text-3xl font-black text-[var(--text-primary)]">{data.duplicateRows.toLocaleString()}</p>
      </div>
      <div className="glass-card p-6 rounded-xl border-t-4 border-t-purple-500">
        <p className="text-slate-400 text-xs mb-1">File Name</p>
        <p className="text-lg font-black text-[var(--text-primary)] truncate" title={data.fileName}>{data.fileName}</p>
      </div>

      <div className="lg:col-span-4 glass-card p-6 rounded-xl">
        <h3 className="text-base font-bold text-white mb-6">Column Data Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(data.columnTypes).map(([col, type]) => (
            <div key={col} className="p-4 bg-slate-900/30 rounded-xl border border-[var(--border-secondary)] flex justify-between items-center">
              <span className="text-[var(--text-primary)] text-xs font-semibold truncate pr-2" title={col}>{col}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold border ${
                type === 'numeric' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                type === 'date' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in flex flex-col h-[620px]">
      
      <div className="p-4 border-b border-[var(--border-secondary)] bg-slate-900/10 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0 text-xs">
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search all columns..."
            className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-[var(--border-secondary)] rounded-xl text-slate-200 focus:outline-none focus:border-[var(--accent-primary)] placeholder-slate-600 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={filterCol}
            onChange={(e) => {
              setFilterCol(e.target.value);
              setFilterVal('');
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-[var(--border-secondary)] rounded-xl px-2 py-2 text-slate-300 outline-none focus:border-[var(--accent-primary)] w-1/2 md:w-40"
          >
            <option value="">Select Filter Column</option>
            {stringCols.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>

          <select
            value={filterVal}
            disabled={!filterCol}
            onChange={(e) => {
              setFilterVal(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-[var(--border-secondary)] rounded-xl px-2 py-2 text-slate-300 outline-none focus:border-[var(--accent-primary)] disabled:opacity-50 w-1/2 md:w-40"
          >
            <option value="">Select Value</option>
            {uniqueFilterValues.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          {(filterCol || filterVal) && (
            <button 
              onClick={() => {
                setFilterCol('');
                setFilterVal('');
                setCurrentPage(1);
              }}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-auto flex-1 p-0 custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              {data.columns.map(col => (
                <th 
                  key={col} 
                  onClick={() => handleSort(col)}
                  className="px-6 py-4 font-bold text-slate-300 whitespace-nowrap border-b border-[var(--border-secondary)] cursor-pointer select-none hover:bg-white/5"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-secondary)]">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  {data.columns.map(col => (
                    <td key={col} className="px-6 py-3 text-slate-400 whitespace-nowrap max-w-[200px] truncate" title={row[col]}>
                      {row[col] === null || row[col] === '' ? (
                        <span className="text-slate-600 italic">null</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={data.columns.length} className="px-6 py-12 text-center text-slate-500 italic">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[var(--border-secondary)] bg-slate-900/10 flex items-center justify-between shrink-0 text-xs">
        <span className="text-slate-500">
          Showing {processedRows.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, processedRows.length)} of {processedRows.length} rows
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[var(--border-secondary)] bg-slate-900 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-slate-400 font-medium font-mono">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[var(--border-secondary)] bg-slate-900 text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-opacity"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );

  const renderStats = () => {
    const numericCols = Object.keys(data.stats || {});
    
    if (numericCols.length === 0) {
      return (
        <div className="glass-card p-12 text-center rounded-xl animate-fade-in">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Numeric Data Found</h3>
          <p className="text-slate-400">Statistical analysis requires numeric columns. The uploaded dataset only contains categorical or date values.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        {numericCols.map(col => {
          const stat = data.stats[col];
          return (
            <div key={col} className="glass-card p-6 rounded-xl">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                {col}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                <div className="bg-slate-900/30 p-4 rounded-lg border border-[var(--border-secondary)]">
                  <p className="text-slate-500 uppercase tracking-wider mb-1">Count</p>
                  <p className="text-white font-bold">{stat.count.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/30 p-4 rounded-lg border border-[var(--border-secondary)]">
                  <p className="text-slate-500 uppercase tracking-wider mb-1">Sum</p>
                  <p className="text-white font-bold">{stat.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-slate-900/30 p-4 rounded-lg border border-[var(--border-secondary)]">
                  <p className="text-slate-500 uppercase tracking-wider mb-1">Mean</p>
                  <p className="text-white font-bold">{stat.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-slate-900/30 p-4 rounded-lg border border-[var(--border-secondary)]">
                  <p className="text-slate-500 uppercase tracking-wider mb-1">Median</p>
                  <p className="text-white font-bold">{stat.median.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-slate-900/30 p-4 rounded-lg border border-[var(--border-secondary)]">
                  <p className="text-slate-500 uppercase tracking-wider mb-1">Min</p>
                  <p className="text-white font-bold">{stat.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-slate-900/30 p-4 rounded-lg border border-[var(--border-secondary)]">
                  <p className="text-slate-500 uppercase tracking-wider mb-1">Max</p>
                  <p className="text-white font-bold">{stat.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCharts = () => {
    const numericCols = Object.keys(data.stats || {});
    const stringCols = Object.keys(data.columnTypes).filter(col => data.columnTypes[col] === 'string');
    
    if (numericCols.length === 0) {
      return (
        <div className="glass-card p-12 text-center rounded-xl animate-fade-in">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Insufficient Data for Charts</h3>
          <p className="text-slate-400">Charts require at least one numeric column to visualize.</p>
        </div>
      );
    }

    const firstNumCol = numericCols[0];
    const secondNumCol = numericCols.length > 1 ? numericCols[1] : null;
    const firstCatCol = stringCols.length > 0 ? stringCols[0] : null;

    const barData = data.rows.slice(0, 20).map((r, i) => ({
      name: firstCatCol ? String(r[firstCatCol] || '').substring(0, 12) : `Row ${i+1}`,
      [firstNumCol]: Number(r[firstNumCol]) || 0
    }));

    const lineData = data.rows.slice(0, 20).map((r, i) => ({
      name: firstCatCol ? String(r[firstCatCol] || '').substring(0, 12) : `Row ${i+1}`,
      [firstNumCol]: Number(r[firstNumCol]) || 0,
      ...(secondNumCol ? { [secondNumCol]: Number(r[secondNumCol]) || 0 } : {})
    }));

    let pieData = [];
    if (firstCatCol && firstNumCol) {
      const agg = {};
      data.rows.forEach(r => {
        const cat = r[firstCatCol] || 'Unknown';
        const val = Number(r[firstNumCol]) || 0;
        agg[cat] = (agg[cat] || 0) + val;
      });
      
      pieData = Object.entries(agg)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8); 
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-base font-bold text-white mb-6">Distribution: {firstNumCol}</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                <Bar dataKey={firstNumCol} fill="var(--accent-primary, #06b6d4)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-base font-bold text-white mb-6">
            Trend: {firstNumCol} {secondNumCol ? `vs ${secondNumCol}` : ''}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: 11 }} />
                <Line type="monotone" dataKey={firstNumCol} stroke="var(--accent-primary, #06b6d4)" strokeWidth={2.5} dot={{r: 3}} />
                {secondNumCol && (
                  <Line type="monotone" dataKey={secondNumCol} stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {pieData.length > 0 && (
          <div className="glass-card p-6 rounded-xl lg:col-span-2">
            <h3 className="text-base font-bold text-white mb-6">{firstNumCol} by {firstCatCol} (Top 8)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name.substring(0, 8)} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInsights = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        {data.insights.map(insight => {
          const Icon = 
            insight.type === 'trend' ? TrendingUp :
            insight.type === 'warning' ? AlertTriangle :
            insight.type === 'recommendation' ? Sparkles :
            Lightbulb;

          const colorClasses = 
            insight.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' :
            insight.color === 'amber' ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' :
            insight.color === 'purple' ? 'bg-purple-500/10 border-purple-500/25 text-purple-400' :
            'bg-cyan-500/10 border-cyan-500/25 text-cyan-400';

          return (
            <div key={insight.id} className="glass-card p-6 rounded-xl card-hover flex gap-4 text-xs border border-[var(--border-secondary)]">
              <div className={`p-3 rounded-xl border shrink-0 ${colorClasses} h-fit`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-3">
                  <h4 className="text-white font-bold text-sm leading-snug">{insight.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase shrink-0 ${colorClasses}`}>
                    {insight.value}
                  </span>
                </div>
                <p className="text-slate-400 leading-normal">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!isDataLoaded) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Data Upload</h1>
          <p className="text-slate-400">Upload your datasets to generate instant AI insights and analytics.</p>
        </div>
        {renderUploadZone()}
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: File },
    { id: 'preview', label: 'Preview', icon: Table },
    { id: 'statistics', label: 'Statistics', icon: BarChart2 },
    { id: 'charts', label: 'Charts', icon: PieChart },
    { id: 'insights', label: 'AI Insights', icon: Sparkles }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Data Ingestion Center</h1>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{data.fileName}</span>
            <span>•</span>
            <span>{data.totalRows.toLocaleString()} rows</span>
            <span>•</span>
            <span>{data.totalColumns.toLocaleString()} columns</span>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto text-xs">
          <button 
            onClick={() => exportToCSV(data.rows, `export_${data.fileName}.csv`)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl border border-white/10 hover:bg-slate-700 transition-colors cursor-pointer font-semibold"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={clearData}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Data</span>
          </button>
        </div>
      </div>

      <div className="glass-card p-1 rounded-xl flex flex-wrap gap-1 overflow-x-auto border border-[var(--border-secondary)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'preview' && renderPreview()}
        {activeTab === 'statistics' && renderStats()}
        {activeTab === 'charts' && renderCharts()}
        {activeTab === 'insights' && renderInsights()}
      </div>
    </div>
  );
}

export default DataUploadPage;
