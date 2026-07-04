import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#workflow', label: 'Workflow' },
];

// Navbar
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">InsightAI</span>
              <span className="block text-[9px] text-cyan-400 font-bold uppercase tracking-widest -mt-1">
                AI Data Analytics Platform
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-slate-400 hover:text-white text-sm font-semibold transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-primary text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl inline-flex items-center justify-center"
            >
              <span>Create Account</span>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-3 animate-slide-up">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block text-slate-400 hover:text-white text-sm font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center text-slate-400 hover:text-white text-sm font-semibold py-2.5 rounded-xl border border-white/10"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="text-center btn-primary text-white text-xs font-semibold py-2.5 rounded-xl"
              >
                <span>Create Account</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;