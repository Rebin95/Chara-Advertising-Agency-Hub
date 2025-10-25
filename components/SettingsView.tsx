import React from 'react';
import type { Settings } from '../types';

interface SettingsViewProps {
    onBack: () => void;
    settings: Omit<Settings, 'theme'>;
    onSettingsChange: (newSettings: Omit<Settings, 'theme'>) => void;
    t: (key: string) => string;
}

const fontOptions = [
    { name: 'Noto Kufi Arabic', value: "'Noto Kufi Arabic', sans-serif" },
    { name: 'Mirza', value: "'Mirza', serif" },
    { name: 'Vazirmatn', value: "'Vazirmatn', sans-serif" },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack, settings, onSettingsChange, t }) => {
    
    const handleSettingChange = <K extends keyof Omit<Settings, 'theme'>>(key: K, value: Omit<Settings, 'theme'>[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="dark:bg-black/50 bg-white dark:text-white text-slate-950 min-h-screen flex flex-col -m-4 sm:-m-6 lg:-m-8">
            <header className="dark:bg-slate-900/80 bg-white/80 backdrop-blur-sm p-4 flex items-center justify-between border-b dark:border-slate-800 border-slate-200 sticky top-0 z-10">
                <button onClick={onBack} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-950 transition-colors p-2 rounded-full" aria-label={t('back')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-bold">{t('settingsTitle')}</h1>
                    <p className="text-sm dark:text-[var(--text-accent)] text-[var(--text-accent)]">{t('settingsSubtitle')}</p>
                </div>
                <div className="w-10 h-10"></div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Speech Rate */}
                    <div>
                        <label htmlFor="speechRate" className="block font-bold text-lg dark:text-[var(--text-accent)] text-[var(--text-accent)] mb-2">{t('speechRate')}</label>
                        <input
                            id="speechRate" type="range" min="0.5" max="2" step="0.1"
                            value={settings.speechRate}
                            onChange={(e) => handleSettingChange('speechRate', parseFloat(e.target.value))}
                            className="w-full h-2 dark:bg-slate-700 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs dark:text-slate-400 text-slate-600 mt-1">
                            <span>{t('slow')} (0.5x)</span>
                            {/* FIX: Use 'normalSpeed' key to resolve ambiguity with translator 'normal' option. */}
                            <span>{t('normalSpeed')} ({settings.speechRate.toFixed(1)}x)</span>
                            <span>{t('fast')} (2x)</span>
                        </div>
                    </div>
                    
                    {/* Font Size */}
                    <div>
                        <label htmlFor="fontSize" className="block font-bold text-lg dark:text-[var(--text-accent)] text-[var(--text-accent)] mb-2">{t('fontSize')}</label>
                        <input
                            id="fontSize" type="range" min="80" max="140" step="5"
                            value={settings.fontSize}
                            onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value, 10))}
                            className="w-full h-2 dark:bg-slate-700 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                         <div className="flex justify-between text-xs dark:text-slate-400 text-slate-600 mt-1">
                            <span>80%</span>
                            <span>{settings.fontSize}%</span>
                            <span>140%</span>
                        </div>
                    </div>

                    {/* Font Family */}
                    <div>
                        <label className="block font-bold text-lg dark:text-[var(--text-accent)] text-[var(--text-accent)] mb-2">{t('fontFamily')}</label>
                        <select
                            value={settings.fontFamily}
                            onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                            className="w-full dark:bg-slate-800 bg-white dark:border-slate-700 border-slate-200 border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--text-accent)]"
                        >
                            {fontOptions.map(font => (
                                <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Language */}
                    <div>
                        <label className="block font-bold text-lg dark:text-[var(--text-accent)] text-[var(--text-accent)] mb-2">{t('language')}</label>
                        <div className="grid grid-cols-3 gap-2">
                             <button onClick={() => handleSettingChange('language', 'ku')} className={`py-2 rounded-lg font-medium transition-colors border ${settings.language === 'ku' ? 'bg-[var(--text-accent)] text-white border-[var(--text-accent)]' : 'dark:bg-slate-800 bg-white dark:border-slate-700 border-slate-200 dark:hover:bg-slate-700 hover:bg-slate-100'}`}>{t('kurdish')}</button>
                             <button onClick={() => handleSettingChange('language', 'ar')} className={`py-2 rounded-lg font-medium transition-colors border ${settings.language === 'ar' ? 'bg-[var(--text-accent)] text-white border-[var(--text-accent)]' : 'dark:bg-slate-800 bg-white dark:border-slate-700 border-slate-200 dark:hover:bg-slate-700 hover:bg-slate-100'}`}>{t('arabic')}</button>
                             <button onClick={() => handleSettingChange('language', 'en')} className={`py-2 rounded-lg font-medium transition-colors border ${settings.language === 'en' ? 'bg-[var(--text-accent)] text-white border-[var(--text-accent)]' : 'dark:bg-slate-800 bg-white dark:border-slate-700 border-slate-200 dark:hover:bg-slate-700 hover:bg-slate-100'}`}>{t('english')}</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};