import React from 'react';

interface InstallViewProps {
    onBack: () => void;
    t: (key: string) => string;
}

const InstructionCard: React.FC<{ title: string, steps: string }> = ({ title, steps }) => (
    <div className="dark:bg-slate-900/50 bg-white/80 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-3">{title}</h3>
        <p className="whitespace-pre-wrap leading-relaxed dark:text-slate-300 text-slate-700 prose">{steps}</p>
    </div>
);

export const InstallView: React.FC<InstallViewProps> = ({ onBack, t }) => {
    return (
        <div className="dark:bg-black/50 bg-white dark:text-white text-slate-950 min-h-screen flex flex-col -m-4 sm:-m-6 lg:-m-8">
            <header className="dark:bg-slate-900/80 bg-white/80 backdrop-blur-sm p-4 flex items-center justify-between border-b dark:border-slate-800 border-slate-200 sticky top-0 z-10">
                <button onClick={onBack} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-950 transition-colors p-2 rounded-full" aria-label={t('back')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-bold">{t('installTitle')}</h1>
                    <p className="text-sm dark:text-[var(--text-accent)] text-[var(--text-accent)]">{t('installSubtitle')}</p>
                </div>
                <div className="w-10 h-10"></div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <InstructionCard title={t('installChromeEdge')} steps={t('installChromeEdgeSteps')} />
                    <InstructionCard title={t('installSafari')} steps={t('installSafariSteps')} />
                    <InstructionCard title={t('installGeneral')} steps={t('installGeneralSteps')} />
                </div>
            </main>
        </div>
    );
};