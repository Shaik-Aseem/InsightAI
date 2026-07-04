import { ShieldCheck, LogIn, UploadCloud, Cpu, BarChart3, Download, Home } from 'lucide-react';

// Workflow
function WorkflowSection() {
  const steps = [
    {
      icon: Home,
      title: '1. Landing Page',
      desc: 'Explore platform capabilities and standard analytical workflows.'
    },
    {
      icon: ShieldCheck,
      title: '2. Signup / Login',
      desc: 'Register custom credentials or log in with student default account.'
    },
    {
      icon: LogIn,
      title: '3. Dashboard',
      desc: 'Check SQLite active datasets summary and live transaction logs.'
    },
    {
      icon: UploadCloud,
      title: '4. Upload Dataset',
      desc: 'Drag & Drop CSV or Excel files locally into the analysis engine.'
    },
    {
      icon: Cpu,
      title: '5. Analytics',
      desc: 'View dynamic charts and calculated statistics (Mean, Median, Mode, Std Dev).'
    },
    {
      icon: Download,
      title: '6. Reports',
      desc: 'Export database files as CSV, PDF, or text summaries instantly.'
    }
  ];

  return (
    <section id="workflow" className="py-24 relative z-10 border-t border-white/5 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-white mb-4">Platform Workflow Flowchart</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            InsightAI is architected with a sequential pipeline. Ranging from local file parsing
            to deep statistics calculations and visual summaries, the entire process is handled locally.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="glass-card p-4 card-hover relative flex flex-col justify-between border border-white/5 bg-slate-900/35"
              >
                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                  {idx + 1}
                </div>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1.5">{step.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WorkflowSection;
