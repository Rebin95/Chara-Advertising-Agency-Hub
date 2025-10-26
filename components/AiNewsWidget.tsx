import React, { useState, useEffect } from 'react';
import { getAiNews } from '../services/geminiService';
import type { NewsItem } from '../types';

export const AiNewsWidget: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await getAiNews();
      setNewsItems(items);
    } catch (err) {
      setError('نەتوانرا هەواڵەکان وەربگیرێت. تکایە دووبارە هەوڵبدەرەوە.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="dark:bg-slate-900/30 bg-white/30 backdrop-filter backdrop-blur-xl border dark:border-slate-700/50 border-slate-200/80 rounded-2xl shadow-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-[#28c780] text-[#1f9a65]">هەواڵەکانی تەکنەلۆژیا و بازاڕگەری</h2>
        <button onClick={fetchNews} disabled={isLoading} className="dark:text-slate-400 text-slate-600 dark:hover:text-white hover:text-slate-950 transition-colors disabled:opacity-50" aria-label="Refresh news">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>
      </div>
      {isLoading && <p className="dark:text-slate-300 text-slate-600 text-center">...بارکردنی هەواڵەکان</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <div key={index} className="dark:bg-slate-800/40 bg-white/40 p-4 rounded-lg border dark:border-slate-700 border-slate-200">
                <h3 className="font-bold dark:text-[#28c780] text-[#1f9a65] mb-2">{item.headline}</h3>
                <p className="dark:text-slate-300 text-slate-700 text-sm">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
