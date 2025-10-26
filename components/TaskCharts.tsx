import React from 'react';
import type { Client, TaskProgress } from '../types';
import { PostIcon, VideoIcon, SponsorshipIcon, VisitingIcon, StoriesIcon } from './icons';

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

const ProgressBar: React.FC<{
  label: string;
  completed: number;
  total: number;
  icon: React.ReactNode;
  unit?: string;
  t: (key: string) => string;
}> = ({ label, completed, total, icon, unit = '', t }) => {
  if (total === 0) return null;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const displayCompleted = unit === '$' ? completed.toLocaleString() : completed;
  const displayTotal = unit === '$' ? total.toLocaleString() : total;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="flex items-center gap-2 font-medium dark:text-slate-300 text-slate-700">
          {icon}
          <span>{label}</span>
        </span>
        <span className="text-sm dark:text-slate-400 text-slate-600">
          {unit}{displayCompleted} / {unit}{displayTotal} {unit ? '' : t('completed')}
        </span>
      </div>
      <div className="w-full dark:bg-slate-700 bg-slate-200 rounded-full h-2.5">
        <div 
          className="bg-[#1f9a65] h-2.5 rounded-full transition-all" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export const TaskCharts: React.FC<{ clients: Client[], progressData: TaskProgress['key'], t: (key: string) => string }> = ({ clients, progressData, t }) => {
    
    const summary = clients.reduce(
        (acc, client) => {
            const progress = progressData[client.id] || { completedPosts: 0, completedVideos: 0, completedSponsorship: 0, completedVisiting: 0, completedStories: 0 };
            
            const clientTotalPosts = parseTaskCount(client.tasks.posts);
            acc.totalPosts += clientTotalPosts;
            acc.completedPosts += Math.min(progress.completedPosts, clientTotalPosts);

            const clientTotalVideos = parseTaskCount(client.tasks.videos);
            acc.totalVideos += clientTotalVideos;
            acc.completedVideos += Math.min(progress.completedVideos, clientTotalVideos);
            
            const clientTotalVisiting = parseTaskCount(client.tasks.visiting);
            acc.totalVisiting += clientTotalVisiting;
            acc.completedVisiting += Math.min(progress.completedVisiting, clientTotalVisiting);
            
            const clientTotalStories = parseTaskCount(client.tasks.stories);
            acc.totalStories += clientTotalStories;
            acc.completedStories += Math.min(progress.completedStories, clientTotalStories);

            const clientTotalSponsorship = parseSponsorship(client.tasks.sponsorship);
            acc.totalSponsorship += clientTotalSponsorship;
            acc.completedSponsorship += progress.completedSponsorship;
            
            return acc;
        },
        {
            totalPosts: 0, completedPosts: 0,
            totalVideos: 0, completedVideos: 0,
            totalVisiting: 0, completedVisiting: 0,
            totalStories: 0, completedStories: 0,
            totalSponsorship: 0, completedSponsorship: 0,
        }
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="backdrop-filter backdrop-blur-xl dark:bg-slate-900/30 bg-white/30 rounded-2xl shadow-md p-6 border dark:border-slate-700 border-slate-200">
                <h2 className="text-2xl font-bold dark:text-white text-slate-950 mb-6">{t('overallProgress')}</h2>
                <div className="space-y-4">
                    <ProgressBar label={t('videos')} completed={summary.completedVideos} total={summary.totalVideos} icon={<VideoIcon />} t={t} />
                    <ProgressBar label={t('posts')} completed={summary.completedPosts} total={summary.totalPosts} icon={<PostIcon />} t={t} />
                    <ProgressBar label={t('stories')} completed={summary.completedStories} total={summary.totalStories} icon={<StoriesIcon />} t={t} />
                    <ProgressBar label={t('visiting')} completed={summary.completedVisiting} total={summary.totalVisiting} icon={<VisitingIcon />} t={t} />
                    <ProgressBar label={t('sponsorship')} completed={summary.completedSponsorship} total={summary.totalSponsorship} icon={<SponsorshipIcon />} unit="$" t={t} />
                </div>
            </div>

            <h2 className="text-2xl font-bold dark:text-white text-slate-950 pt-4">{t('progressByClient')}</h2>
            
            <div className="grid grid-cols-1 gap-4">
                {clients.map(client => {
                    const totalPosts = parseTaskCount(client.tasks.posts);
                    const totalVideos = parseTaskCount(client.tasks.videos);
                    const totalVisiting = parseTaskCount(client.tasks.visiting);
                    const totalStories = parseTaskCount(client.tasks.stories);
                    const totalSponsorship = parseSponsorship(client.tasks.sponsorship);

                    const hasTasks = totalPosts > 0 || totalVideos > 0 || totalVisiting > 0 || totalStories > 0 || totalSponsorship > 0;
                    if (!hasTasks) return null;

                    const progress = progressData[client.id] || { completedPosts: 0, completedVideos: 0, completedSponsorship: 0, completedVisiting: 0, completedStories: 0 };
                    const completedPosts = Math.min(progress.completedPosts, totalPosts);
                    const completedVideos = Math.min(progress.completedVideos, totalVideos);
                    const completedVisiting = Math.min(progress.completedVisiting, totalVisiting);
                    const completedStories = Math.min(progress.completedStories, totalStories);
                    const completedSponsorship = progress.completedSponsorship;

                    return (
                        <div key={client.id} className="backdrop-filter backdrop-blur-xl dark:bg-slate-900/30 bg-white/30 rounded-2xl shadow-md p-6 border dark:border-slate-700 border-slate-200">
                            <h3 className="text-xl font-bold dark:text-white text-slate-950 mb-4">{client.name}</h3>
                            <div className="space-y-4">
                                <ProgressBar label={t('videos')} completed={completedVideos} total={totalVideos} icon={<VideoIcon />} t={t} />
                                <ProgressBar label={t('posts')} completed={completedPosts} total={totalPosts} icon={<PostIcon />} t={t} />
                                <ProgressBar label={t('stories')} completed={completedStories} total={totalStories} icon={<StoriesIcon />} t={t} />
                                <ProgressBar label={t('visiting')} completed={completedVisiting} total={totalVisiting} icon={<VisitingIcon />} t={t} />
                                <ProgressBar label={t('sponsorship')} completed={completedSponsorship} total={totalSponsorship} icon={<SponsorshipIcon />} unit="$" t={t} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
