import React from 'react';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="dark:bg-black/50 backdrop-blur-md bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 border-slate-200">
          <h3 className="text-xl font-bold dark:text-[var(--text-accent-dark)] text-[var(--text-accent-light)]">{title}</h3>
          <button onClick={onClose} className="dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <p className="dark:text-slate-200 text-slate-700 whitespace-pre-wrap">{content}</p>
        </div>
        <div className="p-4 border-t dark:border-slate-700 border-slate-200 text-right">
           <button 
             onClick={onClose}
             className="bg-[#1f9a65] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-[#1f9a65] focus:ring-opacity-50 transition-colors"
           >
             داخستن
           </button>
        </div>
      </div>
    </div>
  );
};