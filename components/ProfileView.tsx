import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile } from '../types';
import { ProfileIcon } from './icons';

interface ProfileViewProps {
    onBack: () => void;
    profile: UserProfile;
    onSave: (newProfile: UserProfile) => void;
    t: (key: string) => string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack, profile, onSave, t }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile>(profile);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({ ...prev, picture: event.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    return (
        <div className="dark:bg-transparent bg-transparent dark:text-white text-slate-950 min-h-screen flex flex-col -m-4 sm:-m-6 lg:-m-8">
            <header className="dark:bg-slate-900/40 bg-white/40 backdrop-filter backdrop-blur-xl p-4 flex items-center justify-between border-b dark:border-slate-800 border-slate-200 sticky top-0 z-10">
                <button onClick={onBack} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-950 transition-colors p-2 rounded-full" aria-label={t('back')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-bold">{t('profileTitle')}</h1>
                    <p className="text-sm dark:text-[var(--text-accent)] text-[var(--text-accent)]">{t('profileSubtitle')}</p>
                </div>
                <div className="w-10 h-10"></div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-2xl mx-auto backdrop-filter backdrop-blur-xl dark:bg-slate-900/30 bg-white/30 rounded-2xl shadow-lg p-8 border dark:border-slate-700 border-slate-200">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full dark:bg-slate-700 bg-slate-200 flex items-center justify-center overflow-hidden">
                                {formData.picture ? (
                                    <img src={formData.picture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-6xl dark:text-slate-500 text-slate-400"><ProfileIcon /></span>
                                )}
                            </div>
                            {isEditing && (
                                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 dark:bg-slate-600 bg-white rounded-full p-2 shadow-md dark:text-white text-slate-800 dark:hover:bg-slate-500 hover:bg-slate-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                </button>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>

                        {isEditing ? (
                            <div className="w-full space-y-4">
                                <div>
                                    <label htmlFor="fullNameEdit" className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-1">{t('fullName')}</label>
                                    <input id="fullNameEdit" type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full dark:bg-slate-700 bg-slate-100 dark:border-slate-600 border-slate-200 border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--text-accent)]" />
                                </div>
                                <div>
                                    <label htmlFor="roleEdit" className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-1">{t('roleAtChara')}</label>
                                    <input id="roleEdit" type="text" value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} className="w-full dark:bg-slate-700 bg-slate-100 dark:border-slate-600 border-slate-200 border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--text-accent)]" />
                                </div>
                                <div className="flex justify-center gap-4 pt-4">
                                    <button onClick={() => { setIsEditing(false); setFormData(profile); }} className="dark:bg-slate-600 bg-slate-200 font-bold py-2 px-6 rounded-lg dark:hover:bg-slate-500 hover:bg-slate-300 transition-colors">{t('back')}</button>
                                    <button onClick={handleSave} className="bg-[var(--text-accent)] text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">{t('save')}</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h2 className="text-3xl font-bold">{profile.name}</h2>
                                <p className="text-lg dark:text-slate-400 text-slate-600">{profile.role}</p>
                                <button onClick={() => setIsEditing(true)} className="mt-6 bg-[var(--text-accent)] text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
                                    {t('editProfile')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
