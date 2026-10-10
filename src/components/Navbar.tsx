import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { PortfolioProfile } from '../types/portfolio.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface NavbarProps {
  profile: PortfolioProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#070b09]/90 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-950/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Brand wordmark */}
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
          <span>{profile.name || 'Alazar.A'}</span>
        </a>

        {/* Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Zone: Theme toggle + Let's Talk CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg text-slate-600 hover:text-emerald-700 bg-slate-100/80 hover:bg-emerald-50 border border-slate-200/80 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-slate-300 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/40 transition-all cursor-pointer shadow-xs"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700 hover:text-emerald-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300 hover:text-amber-200" />
            )}
          </button>

          <a
            href="#contact"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-700/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-emerald-500/30 cursor-pointer"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 bg-slate-100 border border-slate-200 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-slate-300 cursor-pointer"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none rounded-lg bg-slate-100 border border-slate-200 dark:bg-emerald-950/40 dark:border-emerald-900/60 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-emerald-950/80 bg-white/95 dark:bg-[#0a0f0d] px-4 pt-3 pb-6 space-y-3 transition-colors">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-emerald-950/60 flex flex-col gap-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-3 text-xs font-semibold text-center text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
