import { HelpCircle, ChevronRight, FileUp, LineChart, Shield, Download } from 'lucide-react';

// Help
function HelpPage() {
  const steps = [
    {
      icon: Shield,
      title: '1. Login',
      desc: 'Sign in to the system. You can use the seeded credentials student@insightai.com / 123456 or sign up with a new account.'
    },
    {
      icon: FileUp,
      title: '2. Upload Dataset',
      desc: 'Drag & drop or browse for a CSV or Excel (.xlsx) file in the Upload Dataset tab to instantly ingest your data.'
    },
    {
      icon: LineChart,
      title: '3. Analyze Data',
      desc: 'Head to the Analytics tab to view binned distributions, numerical stats, and descriptive chart visualizations.'
    },
    {
      icon: Download,
      title: '4. Export Report',
      desc: 'Go to the Reports page to download your modified tables as CSV files, generate printable PDFs, or export summary reports.'
    }
  ];

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[var(--accent-glow)] rounded-xl border border-[var(--border-secondary)]">
            <HelpCircle className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">User Guide</h1>
            <p className="text-xs text-[var(--text-secondary)]">Learn how to parse, analyze, and export datasets in four simple steps.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="glass-card p-5 flex items-start gap-4 card-hover">
              <div className="p-3 bg-[var(--accent-glow)] rounded-xl border border-[var(--border-secondary)] shrink-0">
                <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HelpPage;
