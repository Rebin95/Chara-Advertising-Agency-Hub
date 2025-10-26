import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const correctPassword = '19953025';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onUnlock();
    } else {
      setError('وشەی نهێنی هەڵەیە. تکایە دووبارە هەوڵبدەرەوە.');
      setPassword('');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="dark:bg-slate-900/40 bg-white/40 backdrop-filter backdrop-blur-xl border dark:border-slate-700 border-slate-200 rounded-xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-xl font-bold dark:text-[#28c780] text-[#1f9a65] mb-4">وشەی نهێنی</h3>
          <p className="dark:text-slate-300 text-slate-700 mb-4 text-sm">بۆ کردنەوەی بەشی دیزاین، تکایە وشەی نهێنی بنووسە.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if(error) setError('');
            }}
            className="w-full dark:bg-slate-700 bg-slate-100 dark:border-slate-600 border-slate-200 rounded-md py-2 px-3 dark:text-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1f9a65]"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <div className="mt-6 flex justify-end gap-3">
           <button 
             type="button"
             onClick={onClose}
             className="dark:bg-slate-600 bg-slate-100 dark:text-white text-slate-800 font-bold py-2 px-6 rounded-lg dark:hover:bg-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition-colors"
           >
             پاشگەزبوونەوە
           </button>
           <button 
             type="submit"
             className="bg-[#1f9a65] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-[#1f9a65] focus:ring-opacity-50 transition-colors"
           >
             کردنەوە
           </button>
          </div>
        </form>
      </div>
    </div>
  );
};
