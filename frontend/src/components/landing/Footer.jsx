import { Link } from 'react-router-dom';
import { Zap, GitBranch, Globe, Mail } from 'lucide-react';

// Footer
function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-slate-950/40 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          
          <div className="text-center md:text-left space-y-2.5 max-w-sm">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text-cyan">InsightAI</span>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed">
              AI-Powered Data Analytics Platform. 
              Built with React, Express, and SQLite for local data analytics.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">Workflow</a>
            <Link to="/login" className="hover:text-cyan-400 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-cyan-400 transition-colors">Create Account</Link>
          </div>

          <div className="flex items-center gap-3">
            {[
              { icon: Mail, link: 'mailto:student@insightai.com', label: 'Email' }
            ].map((social, i) => (
              <a
                key={i}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-all duration-200"
              >
                <social.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © 2026 InsightAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Local Database Ingestion Operational
            </span>
            <span className="text-slate-600 text-[10px] font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
