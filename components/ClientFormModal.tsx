import React, { useState, useEffect } from 'react';
import type { Client } from '../types';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  client: Client | null;
}

const initialFormData: Client = {
  id: 0,
  name: '',
  type: '',
  about: '',
  locations: [],
  tasks: { videos: '', posts: '', visiting: '', stories: '', sponsorship: '' },
  pages: { facebook: '', instagram: '', tiktok: '' },
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium dark:text-[#28c780] text-[#1f9a65] mb-1">{label}</label>
        <input {...props} className="w-full dark:bg-slate-700 bg-slate-100 dark:border-slate-600 border-slate-200 rounded-md py-2 px-3 dark:text-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1f9a65]" />
    </div>
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium dark:text-[#28c780] text-[#1f9a65] mb-1">{label}</label>
        <textarea {...props} rows={3} className="w-full dark:bg-slate-700 bg-slate-100 dark:border-slate-600 border-slate-200 rounded-md py-2 px-3 dark:text-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1f9a65]" />
    </div>
);


export const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSave, client }) => {
  const [formData, setFormData] = useState<Client>(initialFormData);

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData(initialFormData);
    }
  }, [client, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'tasks' | 'pages') => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [category]: {
            ...prev[category],
            [name]: value,
        }
    }));
  };
  
  const handleLocationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFormData(prev => ({ ...prev, locations: value.split('\n') }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
        alert("تکایە ناوی کڕیار بنووسە.");
        return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <form 
        onSubmit={handleSubmit}
        className="dark:bg-slate-900/40 bg-white/40 backdrop-filter backdrop-blur-xl border dark:border-slate-700 border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 border-slate-200">
          <h3 className="text-2xl font-bold dark:text-[#28c780] text-[#1f9a65]">{client ? 'دەستکاریکردنی کڕیار' : 'زیادکردنی کڕیاری نوێ'}</h3>
          <button type="button" onClick={onClose} className="dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
            <FormInput label="ناوی کڕیار" name="name" value={formData.name} onChange={handleChange} required />
            <FormInput label="جۆری کار" name="type" value={formData.type} onChange={handleChange} />
            <FormTextarea label="دەربارە" name="about" value={formData.about} onChange={handleChange} />
            <FormTextarea label="ناونیشانەکان (هەر ناونیشانێک لەسەر دێڕێک)" value={formData.locations.join('\n')} onChange={handleLocationsChange} />
            
            <h4 className="font-semibold dark:text-[#28c780] text-[#1f9a65] pt-2 border-t dark:border-slate-700/50 border-slate-200">ئەرکەکانی مانگانە</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="ڤیدیۆ" name="videos" value={formData.tasks.videos} onChange={(e) => handleNestedChange(e, 'tasks')} />
                <FormInput label="پۆست" name="posts" value={formData.tasks.posts} onChange={(e) => handleNestedChange(e, 'tasks')} />
                <FormInput label="سەردانکردن" name="visiting" value={formData.tasks.visiting} onChange={(e) => handleNestedChange(e, 'tasks')} />
                <FormInput label="ستۆری" name="stories" value={formData.tasks.stories} onChange={(e) => handleNestedChange(e, 'tasks')} />
                <FormInput label="سپۆنسەر" name="sponsorship" value={formData.tasks.sponsorship} onChange={(e) => handleNestedChange(e, 'tasks')} />
            </div>

            <h4 className="font-semibold dark:text-[#28c780] text-[#1f9a65] pt-2 border-t dark:border-slate-700/50 border-slate-200">پەیجەکانی سۆشیاڵ میدیا</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="فەیسبووک" name="facebook" value={formData.pages.facebook} onChange={(e) => handleNestedChange(e, 'pages')} />
                <FormInput label="ئینستاگرام" name="instagram" value={formData.pages.instagram} onChange={(e) => handleNestedChange(e, 'pages')} />
                <FormInput label="تیکتۆک" name="tiktok" value={formData.pages.tiktok} onChange={(e) => handleNestedChange(e, 'pages')} />
            </div>

        </div>
        <div className="p-4 border-t dark:border-slate-700 border-slate-200 flex justify-end gap-3">
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
             پاشەکەوتکردن
           </button>
        </div>
      </form>
    </div>
  );
};
