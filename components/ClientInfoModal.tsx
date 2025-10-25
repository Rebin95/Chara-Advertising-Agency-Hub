import React from 'react';
import type { Client } from '../types';

interface ClientInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onEdit: (client: Client) => void;
}

export const ClientInfoModal: React.FC<ClientInfoModalProps> = ({ isOpen, onClose, client, onEdit }) => {
  if (!isOpen || !client) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-modal-title"
    >
      <div 
        className="dark:bg-black/50 backdrop-blur-md bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 border-slate-200">
          <h3 id="client-modal-title" className="text-2xl font-bold dark:text-[#28c780] text-[#1f9a65]">{client.name}</h3>
          <button onClick={onClose} className="dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4 dark:text-slate-200 text-slate-900">
            <div>
              <h4 className="font-semibold dark:text-[#28c780] text-[#1f9a65]">جۆری کار</h4>
              <p>{client.type}</p>
            </div>
            <div>
              <h4 className="font-semibold dark:text-[#28c780] text-[#1f9a65]">دەربارە</h4>
              <p className="prose">{client.about}</p>
            </div>
            {client.locations.length > 0 && (
              <div>
                <h4 className="font-semibold dark:text-[#28c780] text-[#1f9a65]">ناونیشانەکان</h4>
                <ul className="list-disc list-inside space-y-1">
                  {client.locations.map((loc, i) => <li key={i}>{loc}</li>)}
                </ul>
              </div>
            )}
            <div>
              <h4 className="font-semibold dark:text-[#28c780] text-[#1f9a65]">ئەرکەکانی مانگانە</h4>
              <p><span className="font-medium dark:text-slate-400 text-slate-600">ڤیدیۆ:</span> {client.tasks.videos}</p>
              <p><span className="font-medium dark:text-slate-400 text-slate-600">پۆست:</span> {client.tasks.posts}</p>
              <p><span className="font-medium dark:text-slate-400 text-slate-600">سپۆنسەر:</span> {client.tasks.sponsorship}</p>
            </div>
            {(client.pages.facebook || client.pages.instagram || client.pages.tiktok) && (
              <div>
                <h4 className="font-semibold dark:text-[#28c780] text-[#1f9a65]">پەیجەکانی سۆشیاڵ میدیا</h4>
                <div className="flex flex-wrap gap-4 mt-2">
                    {client.pages.facebook && <a href={client.pages.facebook} target="_blank" rel="noopener noreferrer" className="dark:text-green-400 text-green-600 hover:underline">فەیسبووک</a>}
                    {client.pages.instagram && <a href={client.pages.instagram} target="_blank" rel="noopener noreferrer" className="dark:text-green-400 text-green-600 hover:underline">ئینستاگرام</a>}
                    {client.pages.tiktok && <a href={client.pages.tiktok} target="_blank" rel="noopener noreferrer" className="dark:text-green-400 text-green-600 hover:underline">تیکتۆک</a>}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-t dark:border-slate-700 border-slate-200 flex justify-end gap-3">
            <button 
                onClick={() => onEdit(client)}
                className="dark:bg-slate-600 bg-slate-100 dark:text-white text-slate-800 font-bold py-2 px-6 rounded-lg dark:hover:bg-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition-colors"
            >
                دەستکاری
            </button>
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