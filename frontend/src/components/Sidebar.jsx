import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  Upload,
  LogOut,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

import { Link } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/data-upload', icon: Upload, label: 'Upload Dataset' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/about', icon: BookOpen, label: 'About' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
];

// Sidebar
function Sidebar({ onCollapsedChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleCollapse = () => {
    const nextVal = !collapsed;
    setCollapsed(nextVal);
    if (onCollapsedChange) {
      onCollapsedChange(nextVal);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        background: 'var(--bg-primary, rgba(10, 15, 28, 0.95))',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-secondary, rgba(255,255,255,0.06))',
      }}
    >
      <Link
        to="/dashboard"
        className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border-secondary,rgba(255,255,255,0.05))] hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary,#06b6d4)] to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--accent-glow,rgba(6,182,212,0.25))]">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold gradient-text tracking-tight">InsightAI</h1>
            <p className="text-[10px] text-[var(--text-muted,#64748b)] -mt-0.5">Transform Your Data into Actionable Insights</p>
          </div>
        )}
      </Link>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'nav-link-active text-[var(--accent-primary,#06b6d4)]'
                  : 'text-[var(--text-secondary,#94a3b8)] hover:text-[var(--text-primary,#e2e8f0)] hover:bg-[var(--border-secondary,rgba(255,255,255,0.05))]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-[var(--accent-primary,#06b6d4)]' : 'text-[var(--text-muted,#475569)] group-hover:text-[var(--text-secondary,#94a3b8)]'
                }`} />
                {!collapsed && <span>{label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-primary,#06b6d4)]" />
                )}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary,#1e293b)] border border-[var(--border-secondary,rgba(255,255,255,0.1))] text-xs text-[var(--text-primary,#fff)] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-[var(--border-secondary,rgba(255,255,255,0.05))] space-y-0.5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary,#94a3b8)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium relative group"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0 transition-colors text-[var(--text-muted,#475569)] group-hover:text-red-400" />
          {!collapsed && <span>Logout</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary,#1e293b)] border border-[var(--border-secondary,rgba(255,255,255,0.1))] text-xs text-red-400 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
              Logout
            </div>
          )}
        </button>

        <button
          onClick={handleToggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-muted,#475569)] hover:text-[var(--text-secondary,#94a3b8)] hover:bg-[var(--border-secondary,rgba(255,255,255,0.05))] transition-all duration-200 text-sm font-medium mt-2"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {!collapsed && user && (
        <div className="px-3 pb-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--border-secondary,rgba(255,255,255,0.05))] border border-[var(--border-secondary,rgba(255,255,255,0.08))]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary,#06b6d4)] to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm overflow-hidden">
              {user.photo ? (
                <img src={user.photo} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text-primary,#e2e8f0)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--text-muted,#64748b)] truncate">{user.branch || 'Data Analyst'}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
