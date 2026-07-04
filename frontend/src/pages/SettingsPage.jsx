import { useTheme } from '../contexts/ThemeContext';
import { Check, Sun, Moon } from 'lucide-react';

// Settings
function SettingsPage() {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  return (
    <div className="max-w-3xl animate-fade-in space-y-8">
      <div className="glass-card p-8 space-y-8">
        
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-white">Theme & Display Settings</h2>
          <p className="text-xs text-[var(--text-secondary,#94a3b8)] mt-1">Configure your workspace visual style and primary highlight colors.</p>
        </div>

        <hr className="border-white/5" />

        {/* Section 1: Theme Mode */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-white">Theme Mode</h3>
            <p className="text-xs text-[var(--text-secondary,#94a3b8)] mt-0.5">Switch between light and dark themes to optimize readability.</p>
          </div>
          <div className="flex gap-4">
            {[
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'light', label: 'Light Mode', icon: Sun }
            ].map(t => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-semibold transition-all border ${
                    isSelected
                      ? 'bg-[var(--accent-glow,rgba(6,182,212,0.15))] text-[var(--accent-primary,#06b6d4)] border-[var(--accent-primary,#06b6d4)] shadow-lg'
                      : 'bg-slate-800/40 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Section 2: Accent Colors */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-white">Accent Color</h3>
            <p className="text-xs text-[var(--text-secondary,#94a3b8)] mt-0.5">Select a color to personalize links, buttons, and visual focus borders.</p>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            {['cyan', 'blue', 'purple', 'green'].map(color => {
              const hex = color === 'cyan' ? '#06b6d4' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : '#10b981';
              const isSelected = accentColor === color;
              return (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer transform hover:scale-105 ${
                    isSelected
                      ? 'border-white scale-110 shadow-xl ring-4 ring-[var(--accent-glow,rgba(6,182,212,0.3))]'
                      : 'border-transparent hover:border-white/40'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={color.toUpperCase()}
                >
                  {isSelected && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SettingsPage;
