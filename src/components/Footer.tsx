import React from 'react';
import { Database, Lock, Sun, Moon } from 'lucide-react';
import { DatabaseStatus } from '../types/portfolio.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface FooterProps {
  dbStatus: DatabaseStatus | null;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ dbStatus, onOpenAdmin }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="border-t border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#050806] py-14 text-slate-600 dark:text-slate-300 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand info */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-bold text-slate-900 dark:text-white text-sm">Alazar.A</span>
            <span className="hidden sm:inline text-slate-300 dark:text-emerald-800">·</span>
            <span className="text-slate-600 dark:text-slate-300">Full-Stack MERN Software Engineer</span>
            <span className="hidden sm:inline text-slate-300 dark:text-emerald-800">·</span>
            <span className="text-slate-400">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          {/* Controls: Theme switch, Database indicator, and Admin Login Button */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 border border-slate-200 dark:border-emerald-900/60 font-medium text-[11px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Light Mode</span>
                </>
              )}
            </button>

            {/* Database indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 font-mono text-[11px] text-emerald-800 dark:text-emerald-300">
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {dbStatus?.connected ? 'MongoDB Atlas: Connected' : 'Engine: MERN Store'}
              </span>
            </div>

            {/* Minimized Login Button */}
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Login"
            >
              <Lock className="w-3 h-3 text-white" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
