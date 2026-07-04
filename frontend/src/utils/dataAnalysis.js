export function getColumnType(values) {
  let hasNumeric = false;
  let hasString = false;
  let hasDate = false;

  const sampleSize = Math.min(values.length, 50);
  let validCount = 0;

  for (let i = 0; i < values.length && validCount < sampleSize; i++) {
    const val = values[i];
    if (val === null || val === undefined || val === '') continue;
    
    validCount++;
    const num = Number(val);
    if (!isNaN(num)) {
      hasNumeric = true;
    } else if (!isNaN(Date.parse(val))) {
      hasDate = true;
    } else {
      hasString = true;
    }
  }

  if (hasString) return 'string';
  if (hasDate && !hasNumeric) return 'date';
  if (hasNumeric) return 'numeric';
  return 'string';
}

export function calculateStats(values) {
  const nums = values.map(v => Number(v)).filter(v => !isNaN(v) && v !== null && v !== '');
  if (nums.length === 0) return null;

  nums.sort((a, b) => a - b);
  
  const count = nums.length;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / count;
  const min = nums[0];
  const max = nums[count - 1];
  
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;

  const sqDiffs = nums.map(value => Math.pow(value - mean, 2));
  const variance = sqDiffs.reduce((a, b) => a + b, 0) / count;
  const std = Math.sqrt(variance);

  // Mode calculation
  const frequency = {};
  let maxFreq = 0;
  nums.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
    }
  });

  const modes = [];
  for (const val in frequency) {
    if (frequency[val] === maxFreq) {
      modes.push(Number(val));
    }
  }

  let modeText = '';
  if (maxFreq === 1) {
    modeText = 'No Mode (All unique)';
  } else if (modes.length === count) {
    modeText = 'No Mode';
  } else if (modes.length > 3) {
    modeText = 'Multiple Modes';
  } else {
    modeText = modes.slice(0, 3).map(m => m.toLocaleString(undefined, { maximumFractionDigits: 2 })).join(', ');
  }

  return { count, sum, mean, median, mode: modeText, min, max, std };
}

export function detectOutliers(values, stats) {
  if (!stats) return [];
  const { mean, std } = stats;
  const threshold = 2 * std;
  
  const outliers = [];
  values.forEach((v, idx) => {
    const num = Number(v);
    if (!isNaN(num) && (num > mean + threshold || num < mean - threshold)) {
      outliers.push({ index: idx, value: num });
    }
  });
  return outliers;
}

// Histogram bins
export function generateHistogram(rows, col, stats) {
  if (!stats) return [];
  const min = stats.min;
  const max = stats.max;
  const range = max - min;
  
  if (range === 0) {
    return [{ name: `${min.toFixed(1)}`, count: rows.length }];
  }
  
  const binCount = 6;
  const binWidth = range / binCount;
  const bins = Array(binCount).fill(0).map((_, i) => {
    const start = min + i * binWidth;
    const end = start + binWidth;
    return {
      start,
      end,
      label: `${start.toFixed(1)} - ${end.toFixed(1)}`,
      count: 0
    };
  });
  
  rows.forEach(row => {
    const val = Number(row[col]);
    if (isNaN(val) || val === null || val === '') return;
    
    let binIdx = Math.floor((val - min) / binWidth);
    if (binIdx >= binCount) binIdx = binCount - 1;
    if (binIdx < 0) binIdx = 0;
    bins[binIdx].count++;
  });
  
  return bins.map(b => ({
    name: b.label,
    count: b.count
  }));
}

// Memory usage
export function calculateMemoryUsage(rows) {
  const jsonString = JSON.stringify(rows);
  const bytes = new Blob([jsonString]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Analyze data
export function analyzeData(rows, columns) {
  const columnTypes = {};
  const stats = {};
  const missingValues = {};
  const insights = [];
  let duplicateRows = 0;
  let totalRows = rows.length;
  let totalColumns = columns.length;

  columns.forEach(col => {
    missingValues[col] = 0;
  });

  // Missing values
  const rowStrings = new Set();
  rows.forEach(row => {
    columns.forEach(col => {
      if (row[col] === null || row[col] === undefined || row[col] === '') {
        missingValues[col]++;
      }
    });
    
    const str = JSON.stringify(row);
    if (rowStrings.has(str)) {
      duplicateRows++;
    } else {
      rowStrings.add(str);
    }
  });

  // Check types
  columns.forEach(col => {
    const values = rows.map(r => r[col]);
    columnTypes[col] = getColumnType(values);
    
    if (columnTypes[col] === 'numeric') {
      stats[col] = calculateStats(values);
    }
  });

  const numericCols = Object.keys(stats);
  const stringCols = columns.filter(c => columnTypes[c] === 'string');

  let id = 1;

  // Check duplicates
  if (duplicateRows > 0) {
    insights.push({
      id: id++,
      type: 'warning',
      title: 'Duplicate Records Detected',
      description: `We detected ${duplicateRows} exact duplicate records in the dataset. This could distort statistical calculations and model training. Consider cleaning duplicates.`,
      value: `${duplicateRows} rows`,
      color: 'amber'
    });
  }

  // Check missing
  const colsWithMissing = Object.entries(missingValues).filter(([_, count]) => count > 0);
  if (colsWithMissing.length > 0) {
    const highestMissing = colsWithMissing.sort((a, b) => b[1] - a[1])[0];
    insights.push({
      id: id++,
      type: 'warning',
      title: 'Missing Data Alert',
      description: `Column "${highestMissing[0]}" has the highest level of missing values. We recommend using mean imputation for numeric values or modal imputation for categories.`,
      value: `${highestMissing[1]} missing`,
      color: 'amber'
    });
  }

  // Categories
  if (stringCols.length > 0) {
    const primaryCat = stringCols[0];
    const freqMap = {};
    rows.forEach(r => {
      const val = r[primaryCat];
      if (val !== null && val !== undefined && val !== '') {
        freqMap[val] = (freqMap[val] || 0) + 1;
      }
    });
    const sortedCats = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
    
    if (sortedCats.length > 0) {
      const [topCatName, topCatCount] = sortedCats[0];
      const [worstCatName, worstCatCount] = sortedCats[sortedCats.length - 1];
      
      insights.push({
        id: id++,
        type: 'trend',
        title: `Dominant Category: ${primaryCat}`,
        description: `"${topCatName}" is the highest occurring category, representing ${((topCatCount / totalRows) * 100).toFixed(1)}% of all entries.`,
        value: `${topCatName}`,
        color: 'emerald'
      });

      if (sortedCats.length > 1 && topCatName !== worstCatName) {
        insights.push({
          id: id++,
          type: 'insight',
          title: `Minority Category: ${primaryCat}`,
          description: `"${worstCatName}" is the least occurring category in the dataset with only ${worstCatCount} occurrences.`,
          value: `${worstCatName}`,
          color: 'purple'
        });
      }
    }
  }

  // Numeric insights
  if (numericCols.length > 0) {
    const primaryCol = numericCols.find(c => c.toLowerCase().includes('revenue') || c.toLowerCase().includes('sales') || c.toLowerCase().includes('profit') || c.toLowerCase().includes('units')) || numericCols[0];
    const primaryStats = stats[primaryCol];
    
    if (primaryStats) {
      insights.push({
        id: id++,
        type: 'insight',
        title: `Average ${primaryCol}`,
        description: `The calculated mean for ${primaryCol} is ${primaryStats.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })}. Outlier boundary starts beyond ±2 Standard Deviations.`,
        value: primaryStats.mean.toLocaleString(undefined, { maximumFractionDigits: 1 }),
        color: 'cyan'
      });

      insights.push({
        id: id++,
        type: 'trend',
        title: `Peak Value for ${primaryCol}`,
        description: `The maximum value observed is ${primaryStats.max.toLocaleString()}. The spread between Min (${primaryStats.min.toLocaleString()}) and Max indicates high variance.`,
        value: primaryStats.max.toLocaleString(),
        color: 'emerald'
      });

      // Check outliers
      const outliers = detectOutliers(rows.map(r => r[primaryCol]), primaryStats);
      if (outliers.length > 0) {
        insights.push({
          id: id++,
          type: 'warning',
          title: `Statistical Outliers: ${primaryCol}`,
          description: `Found ${outliers.length} records that fall outside 2 Standard Deviations of the mean. These may represent anomalies or special customer behavior.`,
          value: `${outliers.length} anomalies`,
          color: 'purple'
        });
      }

      // ML suggestion
      insights.push({
        id: id++,
        type: 'recommendation',
        title: 'Analytical Recommendation',
        description: `Due to standard deviation of ${primaryStats.std.toLocaleString(undefined, { maximumFractionDigits: 1 })} in ${primaryCol}, you should apply scaling (MinMax or Standardizer) before running K-Means Clustering.`,
        value: 'Feature Scaling',
        color: 'purple'
      });
    }
  }
  
  if (insights.length === 0) {
    insights.push({
      id: 1,
      type: 'recommendation',
      title: 'Analytical Readiness',
      description: 'Your dataset is clean with zero missing values or duplicate records. Ready for model engineering.',
      value: 'Perfect',
      color: 'emerald'
    });
  }

  const memoryUsage = calculateMemoryUsage(rows);

  return { columnTypes, stats, missingValues, duplicateRows, totalRows, totalColumns, insights, memoryUsage };
}
