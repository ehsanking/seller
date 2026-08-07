import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeFloatingToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeFloatingToggle: React.FC<ThemeFloatingToggleProps> = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer border ${
          isDark
            ? 'bg-slate-800 text-amber-400 border-slate-700 hover:border-amber-400/50 hover:shadow-amber-500/20'
            : 'bg-white text-indigo-600 border-slate-200 hover:border-indigo-400/50 hover:shadow-indigo-500/20'
        }`}
        id="theme-floating-toggle-btn"
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          {isDark ? (
            <Sun className="w-5 h-5 transition-transform duration-500 rotate-0 group-hover:rotate-90 text-amber-400 fill-amber-400/20" />
          ) : (
            <Moon className="w-5 h-5 transition-transform duration-500 rotate-0 group-hover:-rotate-12 text-indigo-600 fill-indigo-600/20" />
          )}
        </div>

        {/* Floating Tooltip */}
        <span className="absolute bottom-14 right-0 px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[11px] font-bold rounded-xl whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-800 dark:border-slate-200">
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </span>
      </button>
    </div>
  );
};
