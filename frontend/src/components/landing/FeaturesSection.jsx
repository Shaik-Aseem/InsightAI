import { BarChart3, Database, FileSpreadsheet, Sparkles } from 'lucide-react';

function FeaturesSection() {
  const features = [
    {
      icon: Database,
      title: 'Local Data Processing',
      description: 'Upload CSV or XLSX datasets. All parsing and analysis happens entirely in the browser using PapaParse and SheetJS.',
    },
    {
      icon: BarChart3,
      title: 'Dynamic Visualizations',
      description: 'Automatically generates Bar, Line, Pie, and Histogram charts using Recharts based on your dataset columns.',
    },
    {
      icon: Sparkles,
      title: 'Rule-Based Insights',
      description: 'Automatically detect outliers, highest values, missing data, and generate actionable recommendations.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Summary Reports',
      description: 'Export analyzed data and charts directly to PDF or download processed datasets as CSV files.',
    },
  ];

  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
          <p className="text-slate-400">
            A data analytics platform designed to analyze trends, visualize insights and generate reports.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-card p-6 card-hover">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
