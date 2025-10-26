import React from 'react';
import type { View } from '../App';
import { SettingsIcon, TaskIcon, ProfileIcon, InstallIcon, SunIcon, MoonIcon } from './icons';

const NavButton: React.FC<{ children: React.ReactNode; active?: boolean; onClick?: () => void; }> = ({ children, active, onClick }) => (
  <button onClick={onClick} className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
    active 
      ? 'dark:bg-[#28c780]/20 dark:text-white bg-[#1f9a65]/10 text-[#1f9a65]' 
      : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-800/60 dark:hover:text-white hover:bg-slate-100/60 hover:text-slate-950'
  }`}>
    {children}
  </button>
);


interface HeaderProps {
    onNavigate: (view: View) => void;
    activeView: View;
    t: (key: string) => string;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activeView, t, theme, onThemeToggle }) => {
  return (
    <div className="flex justify-center mb-12">
      <nav className="flex flex-wrap items-center justify-center sm:justify-between gap-2 w-full max-w-3xl p-1.5 dark:bg-slate-900/30 bg-white/30 backdrop-filter backdrop-blur-xl rounded-full border dark:border-slate-700/50 border-slate-200/80 shadow-md">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <NavButton active={activeView === 'home'} onClick={() => onNavigate('home')}>{t('home')}</NavButton>
          <NavButton active={activeView === 'clients'} onClick={() => onNavigate('clients')}>{t('clients')}</NavButton>
          <NavButton active={activeView === 'tasks'} onClick={() => onNavigate('tasks')}>{t('tasks')}</NavButton>
          <NavButton active={activeView === 'design'} onClick={() => onNavigate('design')}>{t('design')}</NavButton>
          <NavButton active={activeView === 'analyzer'} onClick={() => onNavigate('analyzer')}>{t('analyzer')}</NavButton>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 pr-1">
          <button onClick={onThemeToggle} className="p-2 rounded-full transition-colors dark:text-slate-400 text-slate-600 dark:hover:bg-slate-800/60 dark:hover:text-white hover:bg-slate-100/60 hover:text-slate-950" aria-label={t('theme')}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button onClick={() => onNavigate('install')} className={`p-2 rounded-full transition-colors ${ activeView === 'install' ? 'dark:bg-[#28c780]/20 dark:text-white bg-[#1f9a65]/10 text-[#1f9a65]' : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-800/60 dark:hover:text-white hover:bg-slate-100/60 hover:text-slate-950'}`} aria-label={t('install')}>
            <InstallIcon />
          </button>
          <button onClick={() => onNavigate('profile')} className={`p-2 rounded-full transition-colors ${ activeView === 'profile' ? 'dark:bg-[#28c780]/20 dark:text-white bg-[#1f9a65]/10 text-[#1f9a65]' : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-800/60 dark:hover:text-white hover:bg-slate-100/60 hover:text-slate-950'}`} aria-label={t('profile')}>
            <ProfileIcon />
          </button>
          <button onClick={() => onNavigate('settings')} className={`p-2 rounded-full transition-colors ${ activeView === 'settings' ? 'dark:bg-[#28c780]/20 dark:text-white bg-[#1f9a65]/10 text-[#1f9a65]' : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-800/60 dark:hover:text-white hover:bg-slate-100/60 hover:text-slate-950'}`} aria-label={t('settings')}>
            <SettingsIcon />
          </button>
        </div>
      </nav>
    </div>
  );
};