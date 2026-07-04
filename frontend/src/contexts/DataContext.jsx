import { createContext, useContext, useState, useEffect } from 'react';
import { analyzeData } from '../utils/dataAnalysis';
import { sampleSalesData, sampleSuperstoreData, sampleCustomerData } from '../utils/mockData';
import axios from 'axios';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [isSample, setIsSample] = useState(true);
  const [recentDatasets, setRecentDatasets] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState({
    recentActivities: [],
    lastLogin: null,
    lastDatasetUsed: 'Default Samples'
  });

  // Load default data
  useEffect(() => {
    loadSampleDataset('sample_sales_data.csv');
    fetchRecentDatasets();
    fetchDashboardSummary();
  }, []);

  const fetchRecentDatasets = async () => {
    try {
      const res = await axios.get('/api/datasets');
      if (res.data && res.data.datasets) {
        setRecentDatasets(res.data.datasets);
      }
    } catch (err) {
      console.error('Failed to load recent datasets:', err);
    }
  };

  const fetchDashboardSummary = async () => {
    try {
      const res = await axios.get('/api/dashboard/summary');
      if (res.data) {
        setDashboardSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard summary:', err);
    }
  };

  const loadSampleDataset = (name) => {
    let source = sampleSalesData;
    if (name === 'sample_superstore.csv') {
      source = sampleSuperstoreData;
    } else if (name === 'sample_customer_data.csv') {
      source = sampleCustomerData;
    }

    const analysis = analyzeData(source.rows, source.columns);
    setData({
      rows: source.rows,
      columns: source.columns,
      fileName: source.fileName,
      ...analysis
    });
    setIsSample(true);
  };

  const uploadDataset = async (fileName, fileSize, rows, columns) => {
    const analysis = analyzeData(rows, columns);
    const datasetData = {
      rows,
      columns,
      fileName,
      ...analysis
    };

    setData(datasetData);
    setIsSample(false);

    // Save to database
    try {
      await axios.post('/api/datasets', {
        file_name: fileName,
        file_size: fileSize,
        rows_count: rows.length,
        cols_count: columns.length,
        data_json: JSON.stringify({ rows, columns })
      });
      fetchRecentDatasets();
      fetchDashboardSummary();
    } catch (err) {
      console.error('Failed to persist dataset in SQLite:', err);
    }
  };

  const loadRecentDataset = async (id) => {
    try {
      const res = await axios.get(`/api/datasets/${id}`);
      if (res.data && res.data.dataset) {
        const { file_name, data_json } = res.data.dataset;
        const parsed = JSON.parse(data_json);
        const analysis = analyzeData(parsed.rows, parsed.columns);

        setData({
          rows: parsed.rows,
          columns: parsed.columns,
          fileName: file_name,
          ...analysis
        });
        setIsSample(false);
        fetchDashboardSummary();
      }
    } catch (err) {
      console.error('Error fetching recent dataset detail:', err);
      alert('Failed to load dataset from database.');
    }
  };

  const deleteDataset = async (id) => {
    try {
      await axios.delete(`/api/datasets/${id}`);
      fetchRecentDatasets();
      fetchDashboardSummary();
      if (data && !isSample) {
        loadSampleDataset('sample_sales_data.csv');
      }
    } catch (err) {
      console.error('Error deleting dataset:', err);
    }
  };

  const clearData = () => {
    setData(null);
  };

  const value = {
    data,
    isDataLoaded: data !== null,
    isSample,
    recentDatasets,
    dashboardSummary,
    loadSampleDataset,
    uploadDataset,
    loadRecentDataset,
    deleteDataset,
    clearData,
    refreshMetadata: () => {
      fetchRecentDatasets();
      fetchDashboardSummary();
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
