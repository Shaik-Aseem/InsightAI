import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Parse files
export function parseFileToRows(file) {
  return new Promise((resolve, reject) => {
    if (file.name.toLowerCase().endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length && !results.data.length) {
            reject(new Error('Failed to parse CSV: ' + results.errors[0].message));
            return;
          }
          const rows = results.data;
          const columns = results.meta.fields || [];
          resolve({ rows, columns, fileName: file.name });
        },
        error: (error) => {
          reject(error);
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
          
          if (jsonData.length === 0) {
            resolve({ rows: [], columns: [], fileName: file.name });
            return;
          }
          
          const columns = Object.keys(jsonData[0]);
          resolve({ rows: jsonData, columns, fileName: file.name });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    }
  });
}
