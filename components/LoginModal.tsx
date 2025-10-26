import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (password: string) => boolean;
  t: (key: string) => string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, t }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      // Success, modal will be closed by parent
    } else {
      setError(t('loginError'));
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                <span className="text-[var(--text-accent)]">Chara</span> Hub
            </h1>
        </div>
        <div 
          className="dark:bg-black/30 bg-white/10 backdrop-filter backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl w-full"
        >
          <form onSubmit={handleSubmit} className="p-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center">{t('loginTitle')}</h3>
            <label htmlFor="password-input" className="sr-only">{t('password')}</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder={t('password')}
              className="w-full bg-slate-700/50 border-slate-600 border rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--text-accent)]"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            <div className="mt-6">
             <button 
               type="submit"
               className="w-full bg-[#1f9a65] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-[#1f9a65] focus:ring-opacity-50 transition-colors"
             >
               {t('login')}
             </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
