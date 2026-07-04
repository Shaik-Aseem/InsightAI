import { BookOpen, Target, Cpu, CheckSquare, Zap, BarChart2 } from 'lucide-react';

// About
function AboutPage() {
  const sections = [
    {
      title: 'Project Objective',
      content: 'InsightAI is designed to provide quick and local-first data processing. The main objective is to parse user datasets (CSV or Excel formats), calculate basic descriptive statistics, and plot distributions instantly without uploading files to remote SaaS servers.'
    },
    {
      title: 'Technologies Used',
      content: 'The platform frontend is built with React, Vite, and Tailwind CSS. Charts are animated using Recharts, and spreadsheets are handled locally via PapaParse and SheetJS. The backend relies on Node.js, Express, and a local SQLite database for profile statistics and activities logging.'
    },
    {
      title: 'Features',
      content: 'Key features include dynamic dataset KPIs, binned distributions, automated chart type selection based on feature types, statistical calculations (Mean, Median, Mode, Std Dev), text summaries, and printable PDF report exports.'
    },
    {
      title: 'Workflow',
      content: 'First, visit the landing page. Sign up or login to access the dashboard. Upload custom files using drag and drop. Go to analytics to visualize distributions, and finally head to reports to export CSV, PDF, or plain text dataset summaries.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="glass-card p-6 border-b border-t border-[var(--border-secondary)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[var(--accent-glow)] rounded-xl border border-[var(--border-secondary)]">
            <BookOpen className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">About InsightAI</h1>
            <p className="text-xs text-[var(--text-secondary)]">Overview and technical stack details</p>
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          InsightAI is an analytical platform that helps you parse, analyze, and visualize datasets locally.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((sec, i) => (
          <div key={i} className="glass-card p-5 flex flex-col card-hover">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
              {sec.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">
              {sec.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutPage;
