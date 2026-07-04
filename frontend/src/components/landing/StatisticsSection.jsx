import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 4827, suffix: '+', prefix: '$', unit: 'M', label: 'Revenue Tracked', description: 'Total revenue analyzed across all customers' },
  { value: 2847, suffix: '+', label: 'Enterprise Customers', description: 'Active companies using InsightAI daily' },
  { value: 94, suffix: '%', label: 'Forecast Accuracy', description: 'AI prediction accuracy for revenue forecasting' },
  { value: 31, suffix: '%', label: 'Revenue Growth', description: 'Average revenue increase after 6 months' },
  { value: 8, suffix: 'min', label: 'Setup Time', description: 'Time to connect your CRM and go live' },
  { value: 99.9, suffix: '%', label: 'Uptime SLA', description: 'Enterprise-grade reliability guaranteed' },
];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

function StatCard({ stat, animate }) {
  const count = useCountUp(stat.value, 2000, animate);

  return (
    <div className="glass-card p-6 text-center card-hover group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="text-4xl font-black mb-2">
          <span className="gradient-text">
            {stat.prefix || ''}
            {Number.isInteger(stat.value)
              ? Math.round(count).toLocaleString()
              : count.toFixed(1)}
            {stat.unit || ''}
            {stat.suffix}
          </span>
        </div>
        <p className="text-white font-semibold text-sm mb-1">{stat.label}</p>
        <p className="text-slate-500 text-xs leading-relaxed">{stat.description}</p>
      </div>
    </div>
  );
}

// Statistics
function StatisticsSection() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={ref} className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">
              By the Numbers
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Results that <span className="gradient-text">speak for themselves</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Join thousands of sales teams that have transformed their performance with InsightAI.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatisticsSection;
