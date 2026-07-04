import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, FileText, Upload, Users, Settings } from 'lucide-react';

const pagesList = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', path: '/analytics', icon: LayoutDashboard },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Data Upload', path: '/data-upload', icon: Upload },
  { name: 'Profile', path: '/profile', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
];

function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchQuery = query.toLowerCase();

  const filteredPages = pagesList.filter(p => p.name.toLowerCase().includes(searchQuery)).slice(0, 5);

  const hasResults = query.length > 0 && filteredPages.length > 0;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="glass-card w-full max-w-xl mx-4 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex items-center gap-3 shrink-0">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-lg"
          />
          <div className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">ESC</div>
        </div>

        <div className="overflow-y-auto p-2 custom-scrollbar">
          {query.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>Type to search across your workspace...</p>
            </div>
          ) : !hasResults ? (
            <div className="p-8 text-center text-slate-500">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-4 p-2">
              {filteredPages.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Pages</h3>
                  {filteredPages.map(page => (
                    <button
                      key={page.path}
                      onClick={() => handleNavigate(page.path)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-left transition-colors"
                    >
                      <page.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 group-hover:text-cyan-400">{page.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;
