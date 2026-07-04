// Export helpers

export function exportToCSV(data, filename = 'InsightAI_Dataset.csv') {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header] === null || row[header] === undefined ? '' : row[header];
        cell = String(cell).replace(/"/g, '""');
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  // Excel UTF-8 BOM prefix
  const BOM = '\uFEFF';
  const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(BOM + csvContent);
  const link = document.createElement('a');
  
  link.style.display = 'none';
  link.href = encodedUri;
  link.setAttribute('download', filename);
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
  }, 1500);
}

export function exportToTXT(content, filename = 'InsightAI_Summary.txt') {
  if (!content) return;
  
  const encodedUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
  const link = document.createElement('a');
  
  link.style.display = 'none';
  link.href = encodedUri;
  link.setAttribute('download', filename);
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
  }, 1500);
}

export function exportToPDF(title, sections) {
  const printWindow = window.open('', '_blank');
  
  const styles = `
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #0f172a;
      color: #e2e8f0;
      padding: 40px;
      margin: 0;
    }
    .header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #fff;
      font-size: 28px;
      margin: 0;
    }
    p.date {
      color: #94a3b8;
      font-size: 14px;
      margin-top: 8px;
    }
    .section {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .section h2 {
      color: #38bdf8;
      font-size: 18px;
      margin-top: 0;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 12px;
    }
    .content {
      line-height: 1.6;
      font-size: 14px;
    }
    @media print {
      body {
        background-color: #fff;
        color: #000;
        padding: 0;
      }
      .section {
        background: #fff;
        border: 1px solid #e2e8f0;
      }
      h1 { color: #000; }
      .section h2 { color: #0369a1; border-bottom: 1px solid #e2e8f0; }
      p.date { color: #64748b; }
      @page { margin: 2cm; }
    }
  `;

  let htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>InsightAI_Report</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p class="date">Generated on: ${new Date().toLocaleString()}</p>
        </div>
  `;

  sections.forEach(sec => {
    htmlContent += `
      <div class="section">
        <h2>${sec.heading}</h2>
        <div class="content">${sec.content}</div>
      </div>
    `;
  });

  htmlContent += `
      </body>
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 500);
        };
      </script>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export function generateSummaryReport(data, stats, insights) {
  let content = '<h3>Data Overview</h3>';
  content += `<ul>
    <li>Total Rows: ${data.length}</li>
    <li>Analyzed Columns: ${Object.keys(stats || {}).length}</li>
  </ul>`;

  if (insights && insights.length > 0) {
    content += '<h3>Key Insights</h3><ul>';
    insights.forEach(insight => {
      content += `<li><strong>${insight.title}:</strong> ${insight.description} (${insight.value})</li>`;
    });
    content += '</ul>';
  }

  return content;
}
