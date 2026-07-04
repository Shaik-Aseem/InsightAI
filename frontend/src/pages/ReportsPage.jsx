import { FileText, Download, Database, CheckCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { exportToPDF, exportToCSV, exportToTXT } from '../utils/exportUtils';
import { formatCurrency } from '../utils/helpers';
import axios from 'axios';

// Reports
function ReportsPage() {
  const { data, isDataLoaded } = useData();

  if (!isDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center">
        <Database className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Data Available</h2>
        <p className="text-slate-400 max-w-md">Upload a dataset to generate and export reports.</p>
      </div>
    );
  }

  const numericCols = Object.keys(data.stats || {});
  
  let sum1 = 0, sum2 = 0;
  if (numericCols.length > 0) sum1 = data.stats[numericCols[0]].sum;
  if (numericCols.length > 1) sum2 = data.stats[numericCols[1]].sum;

  const summaryCards = [
    { title: numericCols.length > 0 ? `Total ${numericCols[0]}` : 'Total Rows', value: numericCols.length > 0 ? sum1 : data.totalRows, format: numericCols.length > 0 && numericCols[0].toLowerCase().match(/rev|sales|cost|profit|price|income/) ? 'currency' : 'number' },
    { title: numericCols.length > 1 ? `Total ${numericCols[1]}` : 'Total Columns', value: numericCols.length > 1 ? sum2 : data.totalColumns, format: numericCols.length > 1 && numericCols[1].toLowerCase().match(/rev|sales|cost|profit|price|score/) ? 'currency' : 'number' },
    { title: 'Data Sizing (Memory)', value: data.memoryUsage || '0 B', format: 'raw' },
    { title: 'Data Integrity Score', value: Math.max(0, 100 - (data.duplicateRows / Math.max(data.totalRows, 1)) * 100), format: 'percent' },
    { title: 'Insights Generated', value: data.insights.length, format: 'number' },
    { title: 'Missing Values', value: Object.values(data.missingValues).reduce((a, b) => a + b, 0), format: 'number' }
  ];

  const handleExportPDF = () => {
    const sections = [
      {
        heading: 'Data Quality & Sizing Summary',
        content: `
          <div style="font-size: 14px; color: #cbd5e1;">
            <p>Dataset File Name: <strong>${data.fileName}</strong></p>
            <p>Total Rows: <strong>${data.totalRows.toLocaleString()}</strong></p>
            <p>Total Columns: <strong>${data.totalColumns}</strong></p>
            <p>Duplicate Rows: <strong>${data.duplicateRows}</strong></p>
            <p>Total Missing Values: <strong>${Object.values(data.missingValues).reduce((a, b) => a + b, 0)}</strong></p>
            <p>Estimated Memory Footprint: <strong>${data.memoryUsage || 'Unknown'}</strong></p>
          </div>
        `
      },
      {
        heading: 'Generated Rule-Based Insights',
        content: `
          <ul style="padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
            ${data.insights.map(i => `
              <li style="margin-bottom: 12px;">
                <strong style="color: #38bdf8;">${i.title} (${i.value}):</strong> ${i.description}
              </li>
            `).join('')}
          </ul>
        `
      }
    ];

    if (numericCols.length > 0) {
      sections.push({
        heading: 'Statistical Variables Summary',
        content: `
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; text-align: left; color: #e2e8f0;">
            <thead>
              <tr style="border-bottom: 2px solid rgba(255,255,255,0.1); color: #94a3b8;">
                <th style="padding: 8px;">Column</th>
                <th style="padding: 8px;">Mean</th>
                <th style="padding: 8px;">Median</th>
                <th style="padding: 8px;">Mode</th>
                <th style="padding: 8px;">Min</th>
                <th style="padding: 8px;">Max</th>
                <th style="padding: 8px;">Std Dev (σ)</th>
              </tr>
            </thead>
            <tbody>
              ${numericCols.map(col => {
                const stat = data.stats[col];
                return `
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 8px; font-weight: bold; color: #fff;">${col}</td>
                    <td style="padding: 8px;">${stat.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td style="padding: 8px;">${stat.median.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td style="padding: 8px;">${stat.mode}</td>
                    <td style="padding: 8px;">${stat.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td style="padding: 8px;">${stat.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td style="padding: 8px;">${stat.std.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `
      });
    }
    
    exportToPDF(`Analysis Report: ${data.fileName}`, sections);
    axios.post('/api/activities', { action: 'Report Exported', details: `Exported PDF Report for ${data.fileName}` }).catch(err => {});
  };

  const handleExportSummary = () => {
    const totalMissing = Object.values(data.missingValues).reduce((a, b) => a + b, 0);
    const summaryText = `InsightAI Dataset Summary Report
====================================
Dataset Name: ${data.fileName}
Total Rows: ${data.totalRows}
Total Columns: ${data.totalColumns}
Duplicate Rows: ${data.duplicateRows}
Missing Values: ${totalMissing}
Memory Size: ${data.memoryUsage || '0 B'}
Generated Date: ${new Date().toLocaleString()}

Statistical Variables Summary:
${numericCols.map(col => {
  const stat = data.stats[col];
  return `
Column: ${col}
  Mean: ${stat.mean.toFixed(2)}
  Median: ${stat.median.toFixed(2)}
  Mode: ${stat.mode}
  Min: ${stat.min.toFixed(2)}
  Max: ${stat.max.toFixed(2)}
  Standard Deviation: ${stat.std.toFixed(2)}
`;
}).join('\n')}

AI Insights:
${data.insights.map((insight, idx) => `${idx + 1}. ${insight.title}: ${insight.description} (${insight.value})`).join('\n')}
`;

    exportToTXT(summaryText, 'InsightAI_Summary.txt');
    axios.post('/api/activities', { action: 'Report Exported', details: `Exported text Summary Report for ${data.fileName}` }).catch(err => {});
  };

  const reports = [
    {
      id: 1,
      name: 'Dataset Analysis Summary PDF',
      desc: 'Generates a PDF report containing data sizing, duplicate summaries, numerical standard deviations, modal averages, and ML scaling recommendations.',
      color: 'cyan',
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/15 border-cyan-500/25',
      action: handleExportPDF,
      actionText: 'Export PDF'
    },
    {
      id: 2,
      name: 'Dataset CSV Exporter',
      desc: 'Converts current parsed values into standard CSV spreadsheet file format and initiates browser download.',
      color: 'emerald',
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15 border-emerald-500/25',
      action: () => {
        exportToCSV(data.rows, 'InsightAI_Dataset.csv');
        axios.post('/api/activities', { action: 'Report Exported', details: `Exported CSV Report for ${data.fileName}` }).catch(err => {});
      },
      actionText: 'Export CSV'
    },
    {
      id: 3,
      name: 'Dataset Text Summary Report',
      desc: 'Generates a clean text file summary report containing stats, variables, and insights.',
      color: 'purple',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/15 border-purple-500/25',
      action: handleExportSummary,
      actionText: 'Export Text'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map(card => {
           const formattedValue = card.format === 'currency'
             ? formatCurrency(card.value, true)
             : card.format === 'percent'
               ? `${card.value.toFixed(1)}%`
               : card.format === 'raw'
                 ? card.value
                 : card.value.toLocaleString();

          return (
            <div key={card.title} className="glass-card p-4 card-hover">
              <p className="text-slate-500 text-[11px] mb-2">{card.title}</p>
              <p className="text-lg font-black text-white truncate" title={formattedValue}>{formattedValue}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Generated Reports Exporter</h3>
            <p className="text-slate-500 text-xs mt-0.5">Based on dataset: {data.fileName}</p>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {reports.map(report => (
            <div key={report.id} className="px-5 py-4 flex items-center gap-4 table-row-hover group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${report.bgColor}`}>
                <FileText className={`w-4 h-4 ${report.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-slate-200 font-semibold text-sm">{report.name}</p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{report.desc}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  Ready
                </span>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={report.action}
                    className="px-3 py-2 rounded-xl text-white bg-slate-800 hover:bg-slate-700 transition-all text-xs font-semibold flex items-center gap-1.5 border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{report.actionText}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
