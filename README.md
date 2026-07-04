# InsightAI – AI-Powered Data Analytics Platform

Transform Your Data into Actionable Insights. Upload CSV or Excel datasets, analyze trends, visualize insights and generate professional reports—all in one place.

---

## 🚀 Key Features

1. **Local File Ingestion**: Ingests CSV and Excel (.xlsx) files directly in the browser using PapaParse and SheetJS libraries.
2. **Interactive Data Visualization**: Generates Bar, Line, Pie, Area, Scatter, and Histogram charts using Recharts.
3. **Statistical Analysis**: Computes mathematical properties (Mean, Median, Mode, Min, Max, and Standard Deviation) for all numerical columns.
4. **Data Integrity Review**: Identifies outlier boundaries, missing data cells, row duplicates, and memory sizing.
5. **Session Authorization**: Secure cookie sessions and registration profiles stored inside a local SQLite database using bcryptjs password hashing.
6. **Customizable Theme System**: Toggleable Dark mode and Light mode with primary custom accent colors.
7. **Reports Exporter**: Generates PDF summaries, CSV files, and plain text report exports instantly.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts, PapaParse, SheetJS
- **Backend**: Node.js, Express, SQLite3 (database storage), Cookie Session, Bcryptjs

---

## ⚙️ Quick Start Installation

Run these commands from the project root directory:

1. **Install All Dependencies**:
   ```bash
   npm run install-all
   ```

2. **Run Development Server concurrently**:
   ```bash
   npm run dev
   ```
   *This starts both the Express API backend on port `5000` and the Vite client on port `5173` simultaneously.*

3. **Build Frontend Package**:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Account Credentials

Use these seeded details to test the dashboard immediately:
- **Email**: `student@insightai.com`
- **Password**: `123456`
- *Alternatively, you can register a new account on the Sign Up page.*
