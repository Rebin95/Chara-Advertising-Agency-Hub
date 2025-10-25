import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface OnboardingModalProps {
  onSave: (profile: Omit<UserProfile, 'picture'>) => void;
  t: (key: string) => string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onSave, t }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name, role });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div 
        className="dark:bg-black/50 backdrop-blur-md bg-white/10 rounded-xl shadow-2xl w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">{t('welcome')}</h2>
            <p className="text-slate-400 mt-2">{t('setupProfile')}</p>
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1">{t('fullName')}</label>
            <input
              id="fullName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700/50 border-slate-600 border rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--text-accent)]"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">
              {t('roleAtChara')} <span className="text-slate-400 text-xs">({t('optional')})</span>
            </label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-700/50 border-slate-600 border rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--text-accent)]"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#1f9a65] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-[#1f9a65] focus:ring-opacity-50 transition-colors"
          >
            {t('save')}
          </button>
        </form>
      </div>
    </div>
  );
};