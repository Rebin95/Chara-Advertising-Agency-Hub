import React, { useState, useRef, useEffect } from 'react';
import { RobotIcon, CloseIcon } from './icons';
import type { ChatMessage } from '../types';

interface CharaRobotProps {
    history: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    t: (key: string) => string;
}

const RobotMessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
    return (
        <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && 
                <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-slate-800 bg-slate-100 dark:text-[#28c780] text-[#1f9a65] shrink-0">
                    <RobotIcon />
                </div>
            }
            <div className={`rounded-xl p-3 max-w-xs ${msg.role === 'user' ? 'bg-[#1f9a65] text-white' : 'dark:bg-slate-800 bg-slate-100'}`}>
                {msg.parts.map((part, index) => (
                    <p key={index} className="whitespace-pre-wrap prose">{part.text}</p>
                ))}
            </div>
        </div>
    );
};

export const CharaRobot: React.FC<CharaRobotProps> = ({ history, onSendMessage, isLoading, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [history, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };
    
    return (
        <>
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#1f9a65] text-white rounded-full p-4 shadow-lg hover:bg-[#15803d] transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#1f9a65] focus:ring-offset-2 dark:focus:ring-offset-slate-950"
                    aria-label={t('charaRobot')}
                >
                    <RobotIcon />
                </button>
            </div>
            
            <div 
                className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`} 
                onClick={() => setIsOpen(false)}
                aria-hidden={!isOpen}
            >
                <div 
                    onClick={e => e.stopPropagation()}
                    className={`fixed bottom-0 right-0 m-0 sm:m-6 dark:bg-black/50 bg-white/80 backdrop-blur-md rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md h-[80vh] sm:h-[70vh] flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="chara-robot-title"
                >
                    <header className="flex items-center justify-between p-4 border-b dark:border-slate-800 border-slate-200 shrink-0">
                        <div className="flex items-center gap-3">
                            <RobotIcon />
                            <h2 id="chara-robot-title" className="font-bold text-lg">{t('charaRobot')}</h2>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full dark:hover:bg-slate-700 hover:bg-slate-200" aria-label="Close chat">
                            <CloseIcon />
                        </button>
                    </header>
                    
                    <main className="flex-1 overflow-y-auto p-4 space-y-4">
                        {history.map((msg) => <RobotMessageBubble key={msg.id} msg={msg} />)}
                        {isLoading && (
                            <div className="flex items-start gap-3 justify-start">
                                <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-slate-800 bg-slate-100 dark:text-[#28c780] text-[#1f9a65] shrink-0"><RobotIcon /></div>
                                <div className="rounded-xl p-3 dark:bg-slate-800 bg-slate-100 flex items-center">
                                    <span className="block w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:0ms]"></span>
                                    <span className="block w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:200ms] ml-1.5"></span>
                                    <span className="block w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:400ms] ml-1.5"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>

                    <footer className="p-4 border-t dark:border-slate-800 border-slate-200 shrink-0">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t('robotPlaceholder')}
                                disabled={isLoading}
                                className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#1f9a65]"
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} className="bg-[#1f9a65] text-white font-bold rounded-full p-2.5 hover:bg-[#15803d] transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                    </footer>
                </div>
            </div>
        </>
    );
};