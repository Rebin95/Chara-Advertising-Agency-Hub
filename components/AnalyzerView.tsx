import React, { useState, useRef } from 'react';
import { generateAnalyzerResponse, generateTranslations, extractTextFromFile } from '../services/geminiService';
import { AnalyzeIcon, TranslateIcon, GrammarIcon, SummarizeIcon, CopyIcon, CheckIcon } from './icons';

type Tab = 'analyzer' | 'translator' | 'grammar' | 'summarizer';
type TranslationResult = { kurdish: string; arabic?: string; english?: string; };

const TRANSLATION_TYPES = {
    ku: { normal: 'ئاسایی', scientific: 'زانستی', medical: 'پزیشکی', literary: 'ئەدەبی' },
    en: { normal: 'Normal', scientific: 'Scientific', medical: 'Medical', literary: 'Literary' },
    ar: { normal: 'عادي', scientific: 'علمي', medical: 'طبي', literary: 'أدبي' },
};
const SUMMARY_LENGTHS = {
    ku: { short: 'کورت', medium: 'ناوەند', detailed: 'ورد' },
    en: { short: 'Short', medium: 'Medium', detailed: 'Detailed' },
    ar: { short: 'قصير', medium: 'متوسط', detailed: 'مفصل' },
};

const TabButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${isActive ? 'dark:text-white text-[#1f9a65] border-[#1f9a65]' : 'dark:text-slate-400 text-slate-600 border-transparent dark:hover:text-white hover:text-slate-950'}`}>
        {icon}
        <span>{label}</span>
    </button>
);

const FileUpload: React.FC<{ onFile: (file: File) => void, t: (key: string) => string }> = ({ onFile, t }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
        else if (e.type === "dragleave") setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFile(e.target.files[0]);
        }
    };

    return (
        <div 
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-4 p-6 border-2 border-dashed dark:border-slate-600 border-slate-300 rounded-lg text-center cursor-pointer transition-colors ${isDragging ? 'dark:bg-slate-700 bg-slate-100' : 'dark:hover:bg-slate-800/50 hover:bg-slate-50'}`}
        >
            <input type="file" ref={fileInputRef} onChange={handleChange} accept=".txt,.md,image/*,.pdf,.doc,.docx" className="hidden" />
            <p className="dark:text-slate-400 text-slate-600">{t('dragAndDropImage')}</p>
            <p className="text-sm dark:text-slate-500 text-slate-500">{t('orBrowse')}</p>
        </div>
    );
};

const ResultDisplay: React.FC<{ title: string; text: string; }> = ({ title, text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <div className="relative dark:bg-slate-900/50 bg-slate-50 p-4 rounded-lg border dark:border-slate-700 border-slate-200">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-lg dark:text-[#28c780] text-[#1f9a65]">{title}</h4>
                <button onClick={handleCopy} className="p-1.5 dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-800 rounded-full transition-colors">
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed prose">{text}</p>
        </div>
    );
};

interface AnalyzerViewProps {
    onBack: () => void;
    t: (key: string) => string;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({ onBack, t }) => {
    const [activeTab, setActiveTab] = useState<Tab>('analyzer');
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOcrLoading, setIsOcrLoading] = useState(false);
    
    // Results state
    const [genericResult, setGenericResult] = useState('');
    const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);

    // Tab-specific options state
    const currentLang = t('language') === 'Language' ? 'en' : t('language') === 'اللغة' ? 'ar' : 'ku';
    const [translationType, setTranslationType] = useState('normal');
    const [targetLanguages, setTargetLanguages] = useState({ ar: false, en: false });
    const [summaryLength, setSummaryLength] = useState<string>('medium');

    const clearState = () => {
        setInput('');
        setGenericResult('');
        setTranslationResult(null);
    };

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        clearState();
    };

    const handleFile = (file: File) => {
        clearState();

        // Simple text files can be read directly by the browser
        if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
            const reader = new FileReader();
            reader.onload = (e) => setInput(e.target?.result as string);
            reader.readAsText(file);
            return;
        }
    
        // Other supported files (images, pdf, doc, docx) are processed by Gemini
        const supportedMimeTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
    
        if (supportedMimeTypes.includes(file.type)) {
            setIsOcrLoading(true); // Reuse the same loading indicator
            const reader = new FileReader();
            reader.onload = async (event) => {
                const dataUrl = event.target?.result as string;
                const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
                if (match) {
                    try {
                        const extractedText = await extractTextFromFile({ mimeType: match[1], base64: match[2] });
                        setInput(extractedText);
                    } catch (e) {
                        setInput(t('ocrError'));
                    } finally {
                        setIsOcrLoading(false);
                    }
                } else {
                    setInput(t('ocrError'));
                    setIsOcrLoading(false);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert(t('unsupportedFileImage'));
        }
    };

    const handleSubmit = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setGenericResult('');
        setTranslationResult(null);

        let fullPrompt = '';

        try {
            switch (activeTab) {
                case 'analyzer':
                    fullPrompt = `Analyze and explain the following text, which may be complex or difficult to understand. Break down the key ideas, simplify complex concepts, and provide a clear summary. The response must be in Kurdish Sorani.\n\n**Source Text:**\n---\n${input}\n---`;
                    const analysisResponse = await generateAnalyzerResponse(fullPrompt);
                    setGenericResult(analysisResponse);
                    break;
                case 'translator':
                    const selectedLangs = Object.entries(targetLanguages)
                        .filter(([, isSelected]) => isSelected)
                        .map(([lang]) => lang) as ('ar' | 'en')[];
                    const typeName = TRANSLATION_TYPES[currentLang][translationType as keyof typeof TRANSLATION_TYPES['ku']] || 'normal';
                    const translationResponse = await generateTranslations(input, typeName, selectedLangs);
                    setTranslationResult(translationResponse);
                    break;
                case 'grammar':
                    fullPrompt = `Correct the grammar, spelling, and punctuation of the following Kurdish (Sorani) text. Make it clearer and more professional, but do not change its core meaning. Return only the corrected text.\n\n---\n${input}\n---`;
                    const grammarResponse = await generateAnalyzerResponse(fullPrompt);
                    setGenericResult(grammarResponse);
                    break;
                case 'summarizer':
                    const lengthDesc = { short: 'a very short, one-paragraph', medium: 'a medium-length, multi-paragraph', detailed: 'a detailed and comprehensive' }[summaryLength] || 'a';
                    fullPrompt = `Provide ${lengthDesc} summary of the following text in Kurdish (Sorani).\n\n---\n${input}\n---`;
                    const summaryResponse = await generateAnalyzerResponse(fullPrompt);
                    setGenericResult(summaryResponse);
                    break;
            }
        } catch (error) {
            setGenericResult(t('errorGeneric'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderOptions = () => {
        switch (activeTab) {
            case 'analyzer': return null;
            case 'translator':
                return (
                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="translationType" className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-2">{t('translationType')}</label>
                            <select id="translationType" value={translationType} onChange={e => setTranslationType(e.target.value)} className="w-full dark:bg-slate-700 bg-white dark:border-slate-600 border-slate-300 border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1f9a65]">
                                {Object.entries(TRANSLATION_TYPES[currentLang]).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-2">{t('targetLanguages')}</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 rounded-lg dark:bg-slate-700/50 bg-slate-100 opacity-70">
                                    <input type="checkbox" checked disabled className="h-5 w-5 rounded text-[#1f9a65] focus:ring-[#1f9a65] dark:bg-slate-600 dark:border-slate-500" />
                                    <span>{t('kurdishSorani')} <span className="text-xs">({t('automatic')})</span></span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg dark:bg-slate-700/50 bg-slate-100 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-200">
                                    <input type="checkbox" checked={targetLanguages.ar} onChange={e => setTargetLanguages(p => ({...p, ar: e.target.checked}))} className="h-5 w-5 rounded text-[#1f9a65] focus:ring-[#1f9a65] dark:bg-slate-600 dark:border-slate-500" />
                                    <span>{t('arabic')}</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg dark:bg-slate-700/50 bg-slate-100 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-200">
                                    <input type="checkbox" checked={targetLanguages.en} onChange={e => setTargetLanguages(p => ({...p, en: e.target.checked}))} className="h-5 w-5 rounded text-[#1f9a65] focus:ring-[#1f9a65] dark:bg-slate-600 dark:border-slate-500" />
                                    <span>{t('english')}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'grammar': return null;
            case 'summarizer':
                 return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-2">{t('summaryLength')}</label>
                        <div className="flex gap-2 p-1 dark:bg-slate-900 bg-slate-100 rounded-full">
                            {Object.entries(SUMMARY_LENGTHS[currentLang]).map(([key, value]) => (
                                <button key={key} onClick={() => setSummaryLength(key)} className={`w-full py-1.5 text-sm rounded-full transition-colors ${summaryLength === key ? 'bg-[#1f9a65] text-white shadow-sm' : 'dark:hover:bg-slate-700 hover:bg-slate-200'}`}>{value}</button>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    const renderResult = () => {
        const hasResult = genericResult || translationResult;
        
        if (isLoading || isOcrLoading) {
            return (
                <div className="space-y-4 animate-pulse p-2">
                    <div className="h-4 dark:bg-slate-700 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 dark:bg-slate-700 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 dark:bg-slate-700 bg-slate-200 rounded w-5/6"></div>
                </div>
            )
        }
        
        if (!hasResult) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="dark:text-slate-500 text-slate-400">{t('resultsPlaceholder')}</p>
                </div>
            )
        }

        if (activeTab === 'translator' && translationResult) {
            return (
                <div className="space-y-4">
                    {translationResult.kurdish && <ResultDisplay title={t('kurdishTranslation')} text={translationResult.kurdish} />}
                    {translationResult.arabic && <ResultDisplay title={t('arabicTranslation')} text={translationResult.arabic} />}
                    {translationResult.english && <ResultDisplay title={t('englishTranslation')} text={translationResult.english} />}
                </div>
            );
        }

        return <div className="dark:text-slate-200 text-slate-900 whitespace-pre-wrap leading-relaxed prose">{genericResult}</div>;
    };


    return (
        <div className="dark:bg-transparent bg-transparent dark:text-white text-slate-950 min-h-screen flex flex-col -m-4 sm:-m-6 lg:-m-8">
            <header className="dark:bg-slate-900/40 bg-white/40 backdrop-filter backdrop-blur-xl p-4 flex items-center justify-between border-b dark:border-slate-800 border-slate-200 sticky top-0 z-10">
                <button onClick={onBack} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-950 transition-colors p-2 rounded-full" aria-label={t('back')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-bold">{t('analyzerTitle')}</h1>
                    <p className="text-sm dark:text-[#28c780] text-[#1f9a65]">{t('analyzerSubtitle')}</p>
                </div>
                <div className="w-10 h-10"></div>
            </header>
            
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8 flex justify-center">
                    <div className="flex border-b dark:border-slate-800 border-slate-200">
                        <TabButton icon={<AnalyzeIcon />} label={t('analyzeContent')} isActive={activeTab === 'analyzer'} onClick={() => handleTabChange('analyzer')} />
                        <TabButton icon={<TranslateIcon />} label={t('translation')} isActive={activeTab === 'translator'} onClick={() => handleTabChange('translator')} />
                        <TabButton icon={<GrammarIcon />} label={t('grammarCorrector')} isActive={activeTab === 'grammar'} onClick={() => handleTabChange('grammar')} />
                        <TabButton icon={<SummarizeIcon />} label={t('textShortener')} isActive={activeTab === 'summarizer'} onClick={() => handleTabChange('summarizer')} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Input Column */}
                    <div className="flex flex-col">
                        <div className="relative flex-grow flex flex-col">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t('pasteTextHere')}
                                className="w-full flex-grow dark:bg-slate-800/50 bg-slate-50/50 dark:border-slate-700 border-slate-200 border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#1f9a65] transition-shadow min-h-[250px]"
                                disabled={isLoading || isOcrLoading}
                            />
                            {isOcrLoading && <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center rounded-lg"><p>{t('extractingText')}</p></div>}
                        </div>
                        <FileUpload onFile={handleFile} t={t} />
                        {renderOptions()}
                        <button 
                            onClick={handleSubmit} 
                            disabled={isLoading || isOcrLoading || !input.trim()}
                            className="w-full mt-6 bg-[#1f9a65] text-white font-bold rounded-lg py-3 px-8 hover:bg-[#15803d] transition-colors dark:disabled:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#1f9a65] focus:ring-offset-2 dark:focus:ring-offset-slate-950 focus:ring-offset-slate-50"
                        >
                            {isLoading || isOcrLoading ? t('waiting') : t('execute')}
                        </button>
                    </div>

                    {/* Output Column */}
                    <div className="relative min-h-[400px] backdrop-filter backdrop-blur-xl dark:bg-slate-900/30 bg-white/30 border dark:border-slate-700 border-slate-200 rounded-xl shadow-inner">
                        <div className="p-6 h-full overflow-y-auto">
                            {renderResult()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
