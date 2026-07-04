import { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown, Command } from 'lucide-react';
import { useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlobalSearch from './GlobalSearch';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back' },
  '/analytics': { title: 'Analytics', subtitle: 'Data statistics & charts' },
  '/reports': { title: 'Reports', subtitle: 'Export your statistics and insights' },
  '/data-upload': { title: 'Data Upload', subtitle: 'Upload and analyze your datasets' },
  '/profile': { title: 'Profile', subtitle: 'Manage your profile details' },
  '/settings': { title: 'Settings', subtitle: 'Manage theme & accent preferences' },
  '/about': { title: 'About', subtitle: 'About InsightAI platform' },
  '/help': { title: 'Help & Workflow', subtitle: 'Understand how InsightAI works' },
};

const initialNotifications = [
  { id: 1, title: 'Sample Dataset Loaded', desc: 'Default sales dataset is ready for inspection.', time: 'Just now', read: false },
  { id: 2, title: 'Local DB Connection', desc: 'SQLite storage successfully connected.', time: '5m ago', read: false },
  { id: 3, title: 'InsightAI Operational', desc: 'Automatic feature analysis ready.', time: '1h ago', read: true },
];

// Topbar
function Topbar({ sidebarCollapsed }) {
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: 'InsightAI', subtitle: '' };
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const { user } = useAuth();
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <>
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      
      <header
        className="fixed top-0 right-0 z-30 flex items-center justify-between px-6 h-16 transition-all duration-300"
        style={{
          left: sidebarCollapsed ? '64px' : '256px',
          background: 'var(--bg-primary, rgba(10, 15, 28, 0.85))',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-secondary, rgba(255,255,255,0.05))',
        }}
      >
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary,#fff)] leading-none">{pageInfo.title}</h2>
            <p className="text-xs text-[var(--text-muted,#64748b)] mt-0.5">{pageInfo.subtitle}{user && location.pathname === '/dashboard' ? `, ${user.name.split(' ')[0]}` : ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <div className="relative">
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 text-[var(--text-secondary,#94a3b8)] hover:text-[var(--text-primary,#fff)] bg-[var(--border-secondary,rgba(255,255,255,0.05))] hover:bg-[var(--border-primary,rgba(255,255,255,0.1))] px-3 py-1.5 rounded-xl text-sm transition-all duration-200 border border-[var(--border-secondary,rgba(255,255,255,0.05))]"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:block text-xs">Search...</span>
              <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] opacity-70 border border-current rounded px-1.5 py-0.5">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[var(--text-secondary,#94a3b8)] hover:text-[var(--text-primary,#fff)] hover:bg-[var(--border-secondary,rgba(255,255,255,0.05))] rounded-xl transition-all duration-200"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-2xl overflow-hidden shadow-2xl z-50 animate-slide-up bg-[var(--bg-card)]">
                <div className="px-4 py-3 border-b border-[var(--border-secondary,rgba(255,255,255,0.05))] flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--text-primary,#fff)]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="divide-y divide-[var(--border-secondary,rgba(255,255,255,0.05))] max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`px-4 py-3 hover:bg-[var(--border-secondary,rgba(255,255,255,0.05))] transition-colors cursor-pointer ${!n.read ? 'bg-[var(--accent-glow,rgba(6,182,212,0.1))]' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-[var(--accent-primary,#06b6d4)] shadow-[0_0_8px_var(--accent-primary,#06b6d4)]' : 'bg-slate-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!n.read ? 'font-semibold text-[var(--text-primary,#fff)]' : 'text-[var(--text-secondary,#94a3b8)]'}`}>{n.title}</p>
                          <p className="text-xs text-[var(--text-muted,#475569)] mt-0.5">{n.desc}</p>
                          <p className="text-[10px] text-[var(--text-muted,#475569)] mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-[var(--border-secondary,rgba(255,255,255,0.05))] text-center bg-slate-900/20">
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                    className="text-xs font-medium text-[var(--accent-primary,#06b6d4)] hover:text-[var(--accent-secondary,#22d3ee)] transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/profile" className="flex items-center gap-2 hover:bg-[var(--border-secondary,rgba(255,255,255,0.05))] rounded-xl p-1.5 transition-all duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary,#06b6d4)] to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md overflow-hidden shrink-0">
              {user?.photo ? (
                <img src={user.photo} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AI'
              )}
            </div>
            <ChevronDown className="w-3 h-3 text-[var(--text-secondary,#94a3b8)] hidden sm:block" />
          </NavLink>
        </div>
      </header>
    </>
  );
}

export default Topbar;
