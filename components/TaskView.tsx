import React, { useState } from 'react';
import type { Client, TaskProgress } from '../types';
import { PdfIcon, WhatsAppIcon, PostIcon, VideoIcon, SponsorshipIcon, VisitingIcon, StoriesIcon, ListIcon, ChartIcon } from './icons';
import { TaskCharts } from './TaskCharts';


interface TaskViewProps {
  onBack: () => void;
  clients: Client[];
  taskProgress: TaskProgress;
  onProgressChange: (clientId: number, taskType: 'posts' | 'videos' | 'sponsorship' | 'visiting' | 'stories', newCount: number) => void;
  t: (key: string) => string;
}

const getCurrentYearMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
};

const formatMonthForDisplay = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    return `${monthName} ${year}`;
};


const parseTaskCount = (taskString: string): number => {
    if (!taskString || taskString.toLowerCase() === 'n/a' || isNaN(parseInt(taskString, 10))) {
        return 0;
    }
    if (taskString.includes('-')) {
        const parts = taskString.split('-').map(s => parseInt(s.trim(), 10));
        return Math.max(...parts.filter(num => !isNaN(num)));
    }
    const parsed = parseInt(taskString, 10);
    return isNaN(parsed) ? 0 : parsed;
};

const parseSponsorship = (taskString: string): number => {
    if (!taskString || taskString.toLowerCase() === 'n/a') {
        return 0;
    }
    const match = taskString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};


const TaskCard: React.FC<{ client: Client, progress: TaskProgress['key'][number], isEditable: boolean, onProgressChange?: (taskType: 'posts' | 'videos' | 'sponsorship' | 'visiting' | 'stories', newCount: number) => void, t: (key: string) => string }> = ({ client, progress, isEditable, onProgressChange, t }) => {
    const totalPosts = parseTaskCount(client.tasks.posts);
    const totalVideos = parseTaskCount(client.tasks.videos);
    const totalVisiting = parseTaskCount(client.tasks.visiting);
    const totalStories = parseTaskCount(client.tasks.stories);
    const totalSponsorship = parseSponsorship(client.tasks.sponsorship);

    const completedPosts = Math.min(progress?.completedPosts || 0, totalPosts);
    const completedVideos = Math.min(progress?.completedVideos || 0, totalVideos);
    const completedVisiting = Math.min(progress?.completedVisiting || 0, totalVisiting);
    const completedStories = Math.min(progress?.completedStories || 0, totalStories);
    const completedSponsorship = progress?.completedSponsorship || 0;

    const postPercentage = totalPosts > 0 ? (completedPosts / totalPosts) * 100 : 0;
    const videoPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;
    const visitingPercentage = totalVisiting > 0 ? (completedVisiting / totalVisiting) * 100 : 0;
    const storiesPercentage = totalStories > 0 ? (completedStories / totalStories) * 100 : 0;

    const handleUpdate = (task: 'posts' | 'videos' | 'visiting' | 'stories', delta: number) => {
        if (!isEditable || !onProgressChange) return;
        let current: number, total: number;

        switch (task) {
            case 'posts':
                current = completedPosts;
                total = totalPosts;
                break;
            case 'videos':
                current = completedVideos;
                total = totalVideos;
                break;
            case 'visiting':
                current = completedVisiting;
                total = totalVisiting;
                break;
            case 'stories':
                current = completedStories;
                total = totalStories;
                break;
            default: return;
        }

        const newCount = Math.max(0, Math.min(total, current + delta));
        onProgressChange(task, newCount);
    };
    
    const handleSponsorshipUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isEditable || !onProgressChange) return;
        const value = e.target.value;
        const newAmount = value === '' ? 0 : parseInt(value, 10);
        if (!isNaN(newAmount)) {
            onProgressChange('sponsorship', Math.max(0, newAmount));
        }
    };


    return (
        <div className="backdrop-filter backdrop-blur-xl dark:bg-slate-900/30 bg-white/30 rounded-2xl shadow-md p-6 border dark:border-slate-700 border-slate-200 task-card-print">
            <h3 className="text-xl font-bold dark:text-white text-slate-950 mb-4">{client.name}</h3>
            <div className="space-y-4">
                 {totalVideos > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="flex items-center gap-2 font-medium dark:text-slate-300 text-slate-700">
                                <VideoIcon />
                                <span>{t('videos')}</span>
                            </span>
                            <span className="text-sm dark:text-slate-400 text-slate-600">{completedVideos} / {totalVideos} {t('completed')}</span>
                        </div>
                        <div className="w-full dark:bg-slate-700 bg-slate-200 rounded-full h-2.5 progress-bar-bg">
                            <div className="bg-[#1f9a65] h-2.5 rounded-full transition-all progress-bar-fg" style={{ width: `${videoPercentage}%` }}></div>
                        </div>
                         {isEditable && (
                            <div className="flex justify-end items-center gap-2 mt-2 no-print">
                                <button onClick={() => handleUpdate('videos', -1)} className="w-8 h-8 rounded-full dark:bg-slate-700 bg-slate-100 dark:hover:bg-slate-600 hover:bg-slate-200">-</button>
                                <button onClick={() => handleUpdate('videos', 1)} className="w-8 h-8 rounded-full dark:bg-slate-700 bg-slate-100 dark:hover:bg-slate-600 hover:bg-slate-200">+</button>
                            </div>
                         )}
                    </div>
                )}
                {totalPosts > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="flex items-center gap-2 font-medium dark:text-slate-300 text-slate-700">
                                <PostIcon />
                                <span>{t('posts')}</span>
                            </span>
                            <span className="text-sm dark:text-slate-400 text-slate-600">{completedPosts} / {totalPosts} {t('completed')}</span>
                        </div>
                        <div className="w-full dark:bg-slate-700 bg-slate-200 rounded-full h-2.5 progress-bar-bg">
                            <div className="bg-[#1f9a65] h-2.5 rounded-full transition-all progress-bar-fg" style={{ width: `${postPercentage}%` }}></div>
                        </div>
                        {isEditable && (
                            <div className="flex justify-end items-center gap-2 mt-2 no-print">
                                <button onClick={() => handleUpdate('posts', -1)} className="w-8 h-8 rounded-full dark:bg-slate-700 bg-slate-100 dark:hover:bg-slate-600 hover:bg-slate-200">-</button>
                                <button onClick={() => handleUpdate('posts', 1)} className="w-8 h-8 rounded-full dark:bg-slate-700 bg-slate-100 dark:hover:bg-slate-600 hover:bg-slate-200">+</button>
                            </div>
                        )}
                    </div>
                )}
                {totalVisiting > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="flex items-center gap-2 font-medium dark:text-slate-300 text-slate-700">
                                <VisitingIcon />
                                <span>{t('visiting')}</span>
                            </span>
                            <span className="text-sm dark:text-slate-400 text-slate-600">{completedVisiting} / {totalVisiting} {t('completed')}</span>
                        </div>
                        <div className="w-full dark:bg-slate-700 bg-slate-200 rounded-full h-2.5 progress-bar-bg">
                            <div className="bg-[#1f9a65] h-2.5 rounded-full transition-all progress-bar-fg" style={{ width: `${visitingPercentage}%` }}></div>
                        </div>
                        {isEditable && (
                            <div className="flex justify-end items-center gap-2 mt-2 no-print">
                                <button onClick={() => handleUpdate('visiting', -1)} className="w-8 h-8 rounded-full dark:bg-slate-700 bg-slate-100 dark:hover:bg-slate-600 hover:bg-slate-200">-</button>
                                <button onClick={() => handleUpdate('visiting', 1)} className="w-8 h-8 rounded-full dark:bg-slate-700 bg-slate-100 dark:hover:bg-slate-600 hover:bg-slate-200">+</button>
                            </div>
                        )}
                    </div>
                )}
                {totalStories > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="flex items-center gap-2 font-medium dark:text-slate-300 text-slate-700">
                                <StoriesIcon />
                                <span>{t('stories')}</span>
                            </span>
                            <span className="text-sm dark:text-slate-400 text-slate-600">{completedStories} / {totalStories} {t('completed')}</span>
                        </div>
                        <div className="w-full dark:bg-slate-700 bg-slate-200 rounded-full h-2.5 progress-bar-bg">
                            <div className="bg-[#1f9a65] h-2.5 rounded-full transition-all progress-bar-fg" style={{ width: `${storiesPercentage}%` }}></div>
                        </div>
                        {isEditable && (
                            <div className="flex justify-end items-center gap-2 mt-2 no-print">
                                <button onClick={() => handleUpdate('stories', -1)} className="w-8 h-8 rounded-full dark:bg-slate-700 bg-slate-100 dark:hover:bg-slate-600 hover:bg-slate-200">-</button>
                                <button onClick={() => handleUpdate('stories', 1)} className="w-8 h-8 rounded-full dark:bg-slate-700 bg-slate-100 dark:hover:bg-slate-600 hover:bg-slate-200">+</button>
                            </div>
                        )}
                    </div>
                )}
                 {totalSponsorship > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="flex items-center gap-2 font-medium dark:text-slate-300 text-slate-700">
                                <SponsorshipIcon />
                                <span>{t('sponsorship')}</span>
                            </span>
                            <span className="text-sm dark:text-slate-400 text-slate-600">{t('spent')} {completedSponsorship}$ / {totalSponsorship}$</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                             <input
                                type="number"
                                value={completedSponsorship === 0 ? '' : completedSponsorship}
                                onChange={handleSponsorshipUpdate}
                                className="w-full dark:bg-slate-700 bg-slate-100 dark:border-slate-600 border-slate-200 border rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#1f9a65]"
                                placeholder={t('amountSpent')}
                                readOnly={!isEditable}
                                disabled={!isEditable}
                            />
                            <span className="dark:text-slate-400 text-slate-600">$</span>
                        </div>
                    </div>
                )}
                {totalPosts === 0 && totalVideos === 0 && totalSponsorship === 0 && totalVisiting === 0 && totalStories === 0 && (
                    <p className="text-sm dark:text-slate-500 text-slate-500 text-center py-4">هیچ ئەرکێکی دیاریکراو نییە بۆ ئەم کڕیارە.</p>
                )}
            </div>
        </div>
    );
};

export const TaskView: React.FC<TaskViewProps> = ({ onBack, clients, taskProgress, onProgressChange, t }) => {
    const [selectedMonth, setSelectedMonth] = useState(getCurrentYearMonth());
    const [tasksViewMode, setTasksViewMode] = useState<'list' | 'chart'>('list');

    const currentMonthKey = getCurrentYearMonth();
    const availableMonths = Object.keys(taskProgress).sort((a, b) => b.localeCompare(a));
    if (!availableMonths.includes(currentMonthKey)) {
        availableMonths.unshift(currentMonthKey);
    }
    const isEditable = selectedMonth === currentMonthKey;

    const handlePdfExport = () => {
        window.print();
    };

    const handleWhatsAppShare = () => {
        const monthData = taskProgress[selectedMonth] || {};
        const monthDisplay = formatMonthForDisplay(selectedMonth);
        
        let message = `*${t('tasksReportFor')} ${monthDisplay}*\n\n`;

        clients.forEach(client => {
            const progress = monthData[client.id] || { completedPosts: 0, completedVideos: 0, completedSponsorship: 0, completedVisiting: 0, completedStories: 0 };
            const totalPosts = parseTaskCount(client.tasks.posts);
            const totalVideos = parseTaskCount(client.tasks.videos);
            const totalVisiting = parseTaskCount(client.tasks.visiting);
            const totalStories = parseTaskCount(client.tasks.stories);
            const totalSponsorship = parseSponsorship(client.tasks.sponsorship);

            if (totalPosts > 0 || totalVideos > 0 || totalVisiting > 0 || totalStories > 0 || totalSponsorship > 0) {
                message += `*${client.name}*:\n`;
                if (totalVideos > 0) message += `- ${t('videos')}: ${progress.completedVideos || 0}/${totalVideos}\n`;
                if (totalPosts > 0) message += `- ${t('posts')}: ${progress.completedPosts || 0}/${totalPosts}\n`;
                if (totalVisiting > 0) message += `- ${t('visiting')}: ${progress.completedVisiting || 0}/${totalVisiting}\n`;
                if (totalStories > 0) message += `- ${t('stories')}: ${progress.completedStories || 0}/${totalStories}\n`;
                if (totalSponsorship > 0) message += `- ${t('sponsorship')}: $${progress.completedSponsorship || 0} / $${totalSponsorship}\n`;
                message += '\n';
            }
        });

        const phoneNumber = '9647730413940';
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="dark:bg-transparent bg-transparent dark:text-white text-slate-950 min-h-screen flex flex-col -m-4 sm:-m-6 lg:-m-8">
            <header className="dark:bg-slate-900/40 bg-white/40 backdrop-filter backdrop-blur-xl p-4 flex items-center justify-between border-b dark:border-slate-800 border-slate-200 sticky top-0 z-10 no-print">
                <button onClick={onBack} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-950 transition-colors p-2 rounded-full" aria-label={t('back')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <div className="text-center">
                        <h1 className="text-xl font-bold">{t('tasksTitle')}</h1>
                        <p className="text-sm dark:text-[var(--text-accent)] text-[var(--text-accent)]">{t('tasksSubtitle')}</p>
                    </div>
                     <div className="flex items-center gap-4">
                        <select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="dark:bg-slate-800 bg-white dark:border-slate-700 border-slate-200 border rounded-lg py-1 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--text-accent)] text-sm"
                        >
                            {availableMonths.map(month => <option key={month} value={month}>{formatMonthForDisplay(month)}</option>)}
                        </select>
                        <div className="p-1 dark:bg-slate-900 bg-slate-100 rounded-full flex items-center gap-1">
                            <button onClick={() => setTasksViewMode('list')} className={`flex items-center gap-1.5 px-3 py-1 text-sm rounded-full transition-colors ${tasksViewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                                <ListIcon />
                                <span>{t('listView')}</span>
                            </button>
                            <button onClick={() => setTasksViewMode('chart')} className={`flex items-center gap-1.5 px-3 py-1 text-sm rounded-full transition-colors ${tasksViewMode === 'chart' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                                <ChartIcon />
                                <span>{t('chartView')}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={handleWhatsAppShare} className="p-2 rounded-full transition-colors dark:text-slate-400 text-slate-600 dark:hover:bg-slate-800/60 dark:hover:text-white hover:bg-slate-100/60 hover:text-slate-950" aria-label="Share on WhatsApp">
                        <WhatsAppIcon />
                    </button>
                    <button onClick={handlePdfExport} className="p-2 rounded-full transition-colors dark:text-slate-400 text-slate-600 dark:hover:bg-slate-800/60 dark:hover:text-white hover:bg-slate-100/60 hover:text-slate-950" aria-label="Export PDF">
                        <PdfIcon />
                    </button>
                </div>
            </header>
            <main id="pdf-export-area" className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="pdf-header hidden print:block">
                    <h1>{t('tasksReportFor')} {formatMonthForDisplay(selectedMonth)}</h1>
                    <p>Chara Advertising Hub</p>
                </div>
                {tasksViewMode === 'list' ? (
                    <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4 task-grid-print">
                        {clients.map(client => (
                            <TaskCard 
                                key={client.id} 
                                client={client} 
                                progress={taskProgress[selectedMonth]?.[client.id]}
                                isEditable={isEditable}
                                onProgressChange={isEditable ? (taskType, newCount) => onProgressChange(client.id, taskType, newCount) : undefined}
                                t={t}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="no-print">
                        <TaskCharts clients={clients} progressData={taskProgress[selectedMonth] || {}} t={t} />
                    </div>
                )}
            </main>
        </div>
    );
};
