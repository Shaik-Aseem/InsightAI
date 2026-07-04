import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

// Hero section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
          <span className="text-cyan-400 text-xs font-semibold tracking-wide uppercase">
            Data Analysis & Visualizations
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6 animate-slide-up">
          InsightAI <br />
          <span className="gradient-text text-3xl md:text-5xl block mt-2">Transform Your Data into Actionable Insights</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Upload CSV or Excel datasets, analyze trends, visualize insights and generate professional reports—all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/login"
            className="btn-primary inline-flex items-center gap-2.5 text-white font-semibold px-8 py-4 rounded-2xl text-base shadow-xl shadow-[var(--accent-glow,rgba(6,182,212,0.2))]"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2.5 text-slate-300 hover:text-white font-medium px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-base"
          >
            <Play className="w-4 h-4 text-cyan-400" />
            <span>Create Account</span>
          </Link>
        </div>

        <div className="mt-10 relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none" style={{ top: '60%' }} />
          <div className="relative rounded-2xl overflow-hidden border border-[var(--border-secondary,rgba(255,255,255,0.1))] shadow-2xl shadow-black/50"
            style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-secondary,rgba(255,255,255,0.05))]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-slate-800 rounded-lg px-8 py-1.5 text-xs text-slate-500">
                  insightai.edu/dashboard
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Rows', value: '450', color: 'cyan' },
                  { label: 'Total Columns', value: '12', color: 'blue' },
                  { label: 'Numeric Cols', value: '5', color: 'purple' },
                  { label: 'Missing Values', value: '0', color: 'emerald' },
                ].map((kpi) => (
                  <div key={kpi.label} className="glass-card p-4">
                    <p className="text-slate-500 text-xs mb-2">{kpi.label}</p>
                    <p className="text-[var(--text-primary,#fff)] font-bold text-xl">{kpi.value}</p>
                  </div>
                ))}
              </div>
              <div className="glass-card p-4">
                <p className="text-slate-400 text-sm font-medium mb-4">Sample Data Distribution</p>
                <div className="flex items-end gap-3 h-24">
                  {[40, 55, 48, 70, 65, 80, 75, 90, 85, 100, 95, 110].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-lg"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, var(--accent-primary, #06b6d4), var(--accent-glow, rgba(59,130,246,0.4)))`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
