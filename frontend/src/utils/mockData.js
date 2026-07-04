// Sample datasets

// Sales data
export const sampleSalesData = {
  fileName: 'sample_sales_data.csv',
  columns: ['Date', 'Product', 'Region', 'Units', 'Revenue', 'Cost', 'Profit', 'Customer_Satisfaction'],
  rows: [
    { Date: '2024-01-15', Product: 'Laptop Pro', Region: 'North America', Units: 15, Revenue: 74985, Cost: 25000, Profit: 49985, Customer_Satisfaction: 4.8 },
    { Date: '2024-01-22', Product: 'Monitor 4K', Region: 'Europe', Units: 32, Revenue: 47968, Cost: 18000, Profit: 29968, Customer_Satisfaction: 4.5 },
    { Date: '2024-02-05', Product: 'Wireless Mouse', Region: 'North America', Units: 45, Revenue: 35955, Cost: 12000, Profit: 23955, Customer_Satisfaction: 4.2 },
    { Date: '2024-02-18', Product: 'Mechanical Keyboard', Region: 'Asia Pacific', Units: 85, Revenue: 212415, Cost: 65000, Profit: 147415, Customer_Satisfaction: 4.7 },
    { Date: '2024-03-10', Product: 'Webcam HD', Region: 'Europe', Units: 12, Revenue: 35988, Cost: 15000, Profit: 20988, Customer_Satisfaction: 4.9 },
    { Date: '2024-03-25', Product: 'Laptop Pro', Region: 'Latin America', Units: 5, Revenue: 24995, Cost: 9000, Profit: 15995, Customer_Satisfaction: 4.6 },
    { Date: '2024-04-12', Product: 'USB-C Hub', Region: 'North America', Units: 120, Revenue: 59880, Cost: 20000, Profit: 39880, Customer_Satisfaction: 4.1 },
    { Date: '2024-04-28', Product: 'Desk Mat', Region: 'Asia Pacific', Units: 85, Revenue: 25415, Cost: 8000, Profit: 17415, Customer_Satisfaction: 4.3 },
    { Date: '2024-05-15', Product: 'Monitor 4K', Region: 'North America', Units: 42, Revenue: 62958, Cost: 22000, Profit: 40958, Customer_Satisfaction: 4.6 },
    { Date: '2024-05-30', Product: 'Wireless Mouse', Region: 'Europe', Units: 55, Revenue: 43945, Cost: 16000, Profit: 27945, Customer_Satisfaction: 4.4 },
    { Date: '2024-06-12', Product: 'Webcam HD', Region: 'North America', Units: 18, Revenue: 53982, Cost: 21000, Profit: 32982, Customer_Satisfaction: 4.9 },
    { Date: '2024-06-25', Product: 'Laptop Pro', Region: 'Asia Pacific', Units: 14, Revenue: 69986, Cost: 26000, Profit: 43986, Customer_Satisfaction: 4.7 },
    { Date: '2024-07-10', Product: 'Mechanical Keyboard', Region: 'Europe', Units: 65, Revenue: 162435, Cost: 55000, Profit: 107435, Customer_Satisfaction: 4.5 },
    { Date: '2024-07-22', Product: 'USB-C Hub', Region: 'Latin America', Units: 45, Revenue: 22455, Cost: 8000, Profit: 14455, Customer_Satisfaction: 4.2 },
    { Date: '2024-08-05', Product: 'Monitor 4K', Region: 'Asia Pacific', Units: 28, Revenue: 41972, Cost: 15000, Profit: 26972, Customer_Satisfaction: 4.6 },
    { Date: '2024-08-18', Product: 'Laptop Pro', Region: 'North America', Units: 22, Revenue: 109978, Cost: 38000, Profit: 71978, Customer_Satisfaction: 4.8 },
    { Date: '2024-09-12', Product: 'Webcam HD', Region: 'Europe', Units: 25, Revenue: 74975, Cost: 28000, Profit: 46975, Customer_Satisfaction: 4.9 },
    { Date: '2024-09-28', Product: 'Wireless Mouse', Region: 'Asia Pacific', Units: 62, Revenue: 49538, Cost: 18000, Profit: 31538, Customer_Satisfaction: 4.3 },
    { Date: '2024-10-15', Product: 'Mechanical Keyboard', Region: 'North America', Units: 110, Revenue: 274890, Cost: 85000, Profit: 189890, Customer_Satisfaction: 4.7 },
    { Date: '2024-10-30', Product: 'USB-C Hub', Region: 'Europe', Units: 85, Revenue: 42415, Cost: 15000, Profit: 27415, Customer_Satisfaction: 4.4 }
  ]
};

// Superstore data
export const sampleSuperstoreData = {
  fileName: 'sample_superstore.csv',
  columns: ['OrderID', 'Category', 'SubCategory', 'Quantity', 'Sales', 'Profit', 'Discount', 'CustomerRegion'],
  rows: [
    { OrderID: 'CA-2024-101', Category: 'Technology', SubCategory: 'Phones', Quantity: 3, Sales: 1800.50, Profit: 450.25, Discount: 0.15, CustomerRegion: 'East' },
    { OrderID: 'CA-2024-102', Category: 'Furniture', SubCategory: 'Chairs', Quantity: 5, Sales: 1250.00, Profit: 180.00, Discount: 0.20, CustomerRegion: 'West' },
    { OrderID: 'CA-2024-103', Category: 'Office Supplies', SubCategory: 'Paper', Quantity: 10, Sales: 150.00, Profit: 65.50, Discount: 0.00, CustomerRegion: 'Central' },
    { OrderID: 'CA-2024-104', Category: 'Technology', SubCategory: 'Accessories', Quantity: 6, Sales: 540.00, Profit: 112.00, Discount: 0.10, CustomerRegion: 'South' },
    { OrderID: 'CA-2024-105', Category: 'Furniture', SubCategory: 'Tables', Quantity: 2, Sales: 980.00, Profit: -45.00, Discount: 0.25, CustomerRegion: 'West' },
    { OrderID: 'CA-2024-106', Category: 'Office Supplies', SubCategory: 'Storage', Quantity: 4, Sales: 380.00, Profit: 75.00, Discount: 0.05, CustomerRegion: 'East' },
    { OrderID: 'CA-2024-107', Category: 'Technology', SubCategory: 'Copiers', Quantity: 1, Sales: 2400.00, Profit: 850.00, Discount: 0.10, CustomerRegion: 'Central' },
    { OrderID: 'CA-2024-108', Category: 'Office Supplies', SubCategory: 'Binders', Quantity: 15, Sales: 95.50, Profit: 35.20, Discount: 0.00, CustomerRegion: 'East' },
    { OrderID: 'CA-2024-109', Category: 'Furniture', SubCategory: 'Bookcases', Quantity: 4, Sales: 680.00, Profit: 12.00, Discount: 0.15, CustomerRegion: 'South' },
    { OrderID: 'CA-2024-110', Category: 'Office Supplies', SubCategory: 'Art', Quantity: 8, Sales: 64.00, Profit: 24.80, Discount: 0.00, CustomerRegion: 'West' },
    { OrderID: 'CA-2024-111', Category: 'Technology', SubCategory: 'Phones', Quantity: 2, Sales: 1200.00, Profit: 310.00, Discount: 0.00, CustomerRegion: 'East' },
    { OrderID: 'CA-2024-112', Category: 'Furniture', SubCategory: 'Chairs', Quantity: 3, Sales: 750.00, Profit: 95.00, Discount: 0.10, CustomerRegion: 'Central' },
    { OrderID: 'CA-2024-113', Category: 'Office Supplies', SubCategory: 'Fasteners', Quantity: 12, Sales: 36.00, Profit: 12.50, Discount: 0.00, CustomerRegion: 'West' },
    { OrderID: 'CA-2024-114', Category: 'Technology', SubCategory: 'Accessories', Quantity: 5, Sales: 450.00, Profit: 98.00, Discount: 0.05, CustomerRegion: 'South' },
    { OrderID: 'CA-2024-115', Category: 'Office Supplies', SubCategory: 'Appliances', Quantity: 4, Sales: 720.00, Profit: 150.00, Discount: 0.10, CustomerRegion: 'Central' }
  ]
};

// Customer data
export const sampleCustomerData = {
  fileName: 'sample_customer_data.csv',
  columns: ['CustomerID', 'Age', 'Gender', 'AnnualIncome_K', 'SpendingScore', 'PurchaseFrequency', 'LastPurchaseDays'],
  rows: [
    { CustomerID: 'CUST-001', Age: 25, Gender: 'Female', AnnualIncome_K: 45, SpendingScore: 78, PurchaseFrequency: 14, LastPurchaseDays: 4 },
    { CustomerID: 'CUST-002', Age: 42, Gender: 'Male', AnnualIncome_K: 85, SpendingScore: 35, PurchaseFrequency: 8, LastPurchaseDays: 22 },
    { CustomerID: 'CUST-003', Age: 31, Gender: 'Female', AnnualIncome_K: 62, SpendingScore: 89, PurchaseFrequency: 18, LastPurchaseDays: 2 },
    { CustomerID: 'CUST-004', Age: 58, Gender: 'Male', AnnualIncome_K: 98, SpendingScore: 12, PurchaseFrequency: 3, LastPurchaseDays: 45 },
    { CustomerID: 'CUST-005', Age: 22, Gender: 'Female', AnnualIncome_K: 35, SpendingScore: 92, PurchaseFrequency: 24, LastPurchaseDays: 1 },
    { CustomerID: 'CUST-006', Age: 37, Gender: 'Male', AnnualIncome_K: 75, SpendingScore: 46, PurchaseFrequency: 11, LastPurchaseDays: 14 },
    { CustomerID: 'CUST-007', Age: 49, Gender: 'Female', AnnualIncome_K: 58, SpendingScore: 50, PurchaseFrequency: 9, LastPurchaseDays: 19 },
    { CustomerID: 'CUST-008', Age: 28, Gender: 'Male', AnnualIncome_K: 52, SpendingScore: 68, PurchaseFrequency: 15, LastPurchaseDays: 8 },
    { CustomerID: 'CUST-009', Age: 54, Gender: 'Female', AnnualIncome_K: 110, SpendingScore: 24, PurchaseFrequency: 4, LastPurchaseDays: 32 },
    { CustomerID: 'CUST-010', Age: 33, Gender: 'Male', AnnualIncome_K: 68, SpendingScore: 72, PurchaseFrequency: 16, LastPurchaseDays: 6 },
    { CustomerID: 'CUST-011', Age: 45, Gender: 'Female', AnnualIncome_K: 72, SpendingScore: 40, PurchaseFrequency: 10, LastPurchaseDays: 15 },
    { CustomerID: 'CUST-012', Age: 19, Gender: 'Male', AnnualIncome_K: 28, SpendingScore: 85, PurchaseFrequency: 20, LastPurchaseDays: 3 },
    { CustomerID: 'CUST-013', Age: 61, Gender: 'Female', AnnualIncome_K: 92, SpendingScore: 18, PurchaseFrequency: 5, LastPurchaseDays: 38 },
    { CustomerID: 'CUST-014', Age: 35, Gender: 'Male', AnnualIncome_K: 80, SpendingScore: 55, PurchaseFrequency: 12, LastPurchaseDays: 11 },
    { CustomerID: 'CUST-015', Age: 27, Gender: 'Female', AnnualIncome_K: 48, SpendingScore: 62, PurchaseFrequency: 13, LastPurchaseDays: 7 }
  ]
};

export const sampleDataset = sampleSalesData;
