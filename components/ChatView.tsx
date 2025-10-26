import React, { useState, useRef, useEffect } from 'react';
import type { Employee, ChatMessage, PromptTemplate, Client } from '../types';
import { PaperclipIcon, TagIcon, CopyIcon, CheckIcon, SpeakerIcon, SheetsIcon, IdeaIcon } from './icons';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils';


interface ChatViewProps {
  employee: Employee;
  history: ChatMessage[];
  onSendMessage: (message: string, image?: { base64: string; mimeType: string }, clientTag?: string) => void;
  onBack: () => void;
  isLoading: boolean;
  promptTemplates: PromptTemplate[];
  clients: Client[];
  speechRate: number;
  t: (key: string) => string;
}

const renderTextWithLinks = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const [fullMatch, linkText, url] = match;
    parts.push(
      <a href={url} key={url + match.index} target="_blank" rel="noopener noreferrer" className="dark:text-[#28c780] text-[#1f9a65] underline hover:text-green-700">
        {linkText}
      </a>
    );
    lastIndex = match.index + fullMatch.length;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>);
};

const MessageBubble: React.FC<{ msg: ChatMessage, audioContext: AudioContext | null, activeAudioSource: React.MutableRefObject<AudioBufferSourceNode | null>, stopActiveAudio: () => void, speechRate: number }> = ({ msg, audioContext, activeAudioSource, stopActiveAudio, speechRate }) => {
  const [copied, setCopied] = useState(false);
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const textToCopy = msg.parts.filter(p => p.text).map(p => p.text).join('\n');
  const isTable = msg.role === 'model' && textToCopy && textToCopy.includes('|') && textToCopy.includes('---');


  const handleCopy = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportToSheets = () => {
    if (!textToCopy) return;

    const lines = textToCopy.split('\n').filter(line => line.trim().startsWith('|') && line.trim().endsWith('|'));
    const contentLines = lines.filter(line => !/\|-*\|/.test(line.replace(/\s/g, '')));

    const csvContent = contentLines.map(line => 
      line.split('|')
        .slice(1, -1)
        .map(cell => `"${cell.trim().replace(/"/g, '""')}"`)
        .join(',')
    ).join('\n');
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "content-plan.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePlayAudio = async () => {
    if (audioState === 'playing') {
      stopActiveAudio();
      setAudioState('idle');
      return;
    }

    if (!textToCopy || !audioContext) return;
    
    stopActiveAudio();
    setAudioState('loading');

    try {
      const base64Audio = await generateSpeech(textToCopy);
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = speechRate;
      source.connect(audioContext.destination);
      source.onended = () => {
        setAudioState('idle');
        if (activeAudioSource.current === source) {
            activeAudioSource.current = null;
        }
      };
      
      source.start();
      activeAudioSource.current = source;
      setAudioState('playing');

    } catch (error) {
      console.error("Failed to play audio:", error);
      setAudioState('idle');
    }
  };

  return (
    <div className={`group relative flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {msg.role === 'model' && <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-slate-800 bg-slate-100 dark:text-[#28c780] text-[#1f9a65] shrink-0 text-sm font-bold">AI</div>}
        
        <div className="flex flex-col gap-1 w-full max-w-lg md:max-w-xl lg:max-w-2xl">
          {msg.role === 'user' && msg.clientTag && (
            <div className="text-xs dark:text-green-300 text-green-700 self-end mb-1 px-2 py-0.5 dark:bg-green-900/50 bg-green-100 border dark:border-green-800 border-green-200 rounded-full">{msg.clientTag}</div>
          )}
          <div className={`rounded-xl p-3 ${msg.role === 'user' ? 'bg-[#1f9a65] text-white self-end' : 'dark:bg-slate-800 bg-slate-50 self-start'}`}>
            {msg.parts.map((part, index) => (
              <React.Fragment key={index}>
                {part.imageUrl && <img src={part.imageUrl} alt="Content" className="mb-2 rounded-lg max-w-full h-auto" />}
                {part.text && <div className="whitespace-pre-wrap prose">{renderTextWithLinks(part.text)}</div>}
              </React.Fragment>
            ))}
          </div>
          {isTable && (
            <div className="self-start mt-2">
                <button 
                    onClick={handleExportToSheets}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium dark:text-slate-300 text-slate-700 dark:bg-slate-700/50 bg-slate-100 border dark:border-slate-600 border-slate-200 rounded-lg dark:hover:bg-slate-700 hover:bg-slate-200 transition-colors"
                >
                    <SheetsIcon />
                    <span>Export to Sheets</span>
                </button>
            </div>
          )}
          {msg.timestamp && (
            <div className={`text-xs dark:text-slate-400 text-slate-600 mt-1 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        {textToCopy && msg.role === 'model' && (
          <div className="absolute -top-3 p-1.5 flex gap-1 right-2">
            <button 
                onClick={handlePlayAudio}
                disabled={audioState === 'loading'}
                className="p-1.5 rounded-full dark:bg-slate-700 bg-white dark:text-slate-300 text-slate-600 shadow-md border border-transparent dark:border-transparent transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                aria-label="Play audio"
            >
              {audioState === 'loading' ? 
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                : <SpeakerIcon /> 
              }
            </button>
            <button 
                onClick={handleCopy}
                className="p-1.5 rounded-full dark:bg-slate-700 bg-white dark:text-slate-300 text-slate-600 shadow-md border border-transparent dark:border-transparent transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Copy message"
            >
                {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        )}
        {textToCopy && msg.role === 'user' && (
             <button 
                onClick={handleCopy}
                className="absolute -top-3 p-1.5 rounded-full dark:bg-slate-700 bg-white dark:text-slate-300 text-slate-600 shadow-md border border-transparent dark:border-transparent transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 left-2"
                aria-label="Copy message"
            >
                {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
        )}
    </div>
  );
};

const PromptSuggestions: React.FC<{ templates: PromptTemplate[], onSelect: (prompt: string) => void }> = ({ templates, onSelect }) => (
    <div className="max-w-4xl mx-auto mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map(template => (
          <button 
            key={template.title}
            onClick={() => onSelect(template.prompt)}
            className="dark:bg-slate-800/80 bg-white/80 p-4 rounded-lg text-right dark:hover:bg-slate-700/80 hover:bg-slate-50/80 transition-colors border dark:border-slate-700 border-slate-200"
          >
            <p className="font-semibold dark:text-white text-slate-800">{template.title}</p>
            <p className="text-sm dark:text-slate-400 text-slate-600">{template.prompt.substring(0, 50)}...</p>
          </button>
        ))}
      </div>
    </div>
);

const resizeImage = (file: File, maxSize: number = 1024): Promise<{ file: File; dataUrl: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height *= maxSize / width;
                        width = maxSize;
                    } else {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const newFile = new File([blob], file.name, { type: file.type });
                        const dataUrl = canvas.toDataURL(file.type);
                        resolve({ file: newFile, dataUrl });
                    } else {
                        reject(new Error('Canvas to blob conversion failed'));
                    }
                }, file.type, 0.9);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

export const ChatView: React.FC<ChatViewProps> = ({ employee, history, onSendMessage, onBack, isLoading, promptTemplates, clients, speechRate, t }) => {
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<{ dataUrl: string; file: File } | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [captionLength, setCaptionLength] = useState<'short' | 'medium' | 'long'>('medium');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return () => {
        stopActiveAudio();
        audioContextRef.current?.close();
    };
  }, []);

  const stopActiveAudio = () => {
    if (activeAudioSourceRef.current) {
        activeAudioSourceRef.current.stop();
        activeAudioSourceRef.current.disconnect();
        activeAudioSourceRef.current = null;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || imagePreview) && !isLoading) {
      let messageToSend = input;

      if (employee.role === 'Caption Writer') {
        const lengthText = t(captionLength);
        const promptInstruction = `Write a ${lengthText} caption for a social media post about the following topic/image.`;
        messageToSend = `${promptInstruction}\n\n${input}`;
      }
      
      if (imagePreview) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const base64 = (loadEvent.target?.result as string)?.split(',')[1];
          if(base64) {
            onSendMessage(messageToSend, { base64, mimeType: imagePreview.file.type }, selectedClient ?? undefined);
            setImagePreview(null);
            setInput('');
            setSelectedClient(null);
          }
        };
        reader.readAsDataURL(imagePreview.file);
      } else {
        onSendMessage(messageToSend, undefined, selectedClient ?? undefined);
        setInput('');
        setSelectedClient(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            // Resize image to prevent crashes on mobile with large files
            const { file: resizedFile, dataUrl } = await resizeImage(file);
            setImagePreview({
                dataUrl: dataUrl,
                file: resizedFile,
            });
        } catch (error) {
            console.error("Error resizing image:", error);
            // Fallback to using original file if resize fails
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setImagePreview({
                    dataUrl: loadEvent.target?.result as string,
                    file: file,
                });
            };
            reader.readAsDataURL(file);
        }
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }
  
  const handleClientSelect = (client: string) => {
    setSelectedClient(client);
    setIsClientModalOpen(false);
  };
  
  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
    setShowSuggestions(false);
  };

  return (
    <div className="dark:bg-black/30 bg-white/10 backdrop-filter backdrop-blur-lg dark:text-white text-slate-950 h-screen flex flex-col">
      <header className="p-4 flex items-center justify-between border-b dark:border-slate-800/50 border-slate-200/50 sticky top-0 z-10">
        <button onClick={onBack} className="dark:text-slate-300 text-slate-600 dark:hover:text-white hover:text-slate-950 transition-colors p-2 rounded-full" aria-label={t('back')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">{employee.name}</h1>
          <p className="text-sm dark:text-[#28c780] text-[#1f9a65]">{employee.roleKurdish}</p>
        </div>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {history.length > 0 ? (
             history.map((msg) => <MessageBubble key={msg.id} msg={msg} audioContext={audioContextRef.current} activeAudioSource={activeAudioSourceRef} stopActiveAudio={stopActiveAudio} speechRate={speechRate} />)
          ) : (
            <div className="text-center dark:text-slate-400 text-slate-600 pt-16">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full dark:bg-slate-800 bg-slate-100 dark:text-[#28c780] text-[#1f9a65] text-3xl">
                  {employee.icon}
                </div>
                <h2 className="text-2xl font-bold dark:text-white text-slate-950">دەستپێبکە لەگەڵ {employee.name}</h2>
                <p className="max-w-md mx-auto mt-2">{employee.description}</p>
            </div>
          )}

          {isLoading && history.length > 0 && (
            <div className="flex items-end gap-3 justify-start">
              <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-slate-800 bg-slate-100 dark:text-[#28c780] text-[#1f9a65] shrink-0 text-sm font-bold">AI</div>
              <div className="max-w-lg rounded-xl p-3 dark:bg-slate-800 bg-slate-100 flex items-center">
                <span className="text-sm dark:text-slate-400 text-slate-600 italic mr-3">AI دەنووسێت</span>
                <span className="block w-2 h-2 dark:bg-slate-400 bg-slate-500 rounded-full animate-pulse [animation-delay:0ms]"></span>
                <span className="block w-2 h-2 dark:bg-slate-400 bg-slate-500 rounded-full animate-pulse [animation-delay:200ms] ml-1.5"></span>
                <span className="block w-2 h-2 dark:bg-slate-400 bg-slate-500 rounded-full animate-pulse [animation-delay:400ms] ml-1.5"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 dark:border-t dark:border-slate-800/50 border-t border-slate-200/50 sticky bottom-0">
        {showSuggestions && !isLoading && promptTemplates.length > 0 && <PromptSuggestions templates={promptTemplates} onSelect={handlePromptSelect} />}
        
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
           {employee.role === 'Caption Writer' && (
             <div className="flex justify-center items-center gap-2 mb-3">
                 <div className="p-1 dark:bg-slate-800 bg-slate-200 rounded-full flex items-center gap-1 text-sm font-medium">
                     <button type="button" onClick={() => setCaptionLength('short')} className={`px-4 py-1.5 rounded-full transition-colors ${captionLength === 'short' ? 'bg-white dark:bg-slate-700 shadow' : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-700/60 hover:bg-white/60'}`}>{t('short')}</button>
                     <button type="button" onClick={() => setCaptionLength('medium')} className={`px-4 py-1.5 rounded-full transition-colors ${captionLength === 'medium' ? 'bg-white dark:bg-slate-700 shadow' : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-700/60 hover:bg-white/60'}`}>{t('medium')}</button>
                     <button type="button" onClick={() => setCaptionLength('long')} className={`px-4 py-1.5 rounded-full transition-colors ${captionLength === 'long' ? 'bg-white dark:bg-slate-700 shadow' : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-700/60 hover:bg-white/60'}`}>{t('long')}</button>
                 </div>
             </div>
           )}
           {imagePreview && (
            <div className="relative inline-block mb-2">
              <img src={imagePreview.dataUrl} alt="Preview" className="h-24 w-auto rounded-lg" />
              <button
                type="button" onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-slate-700 text-white rounded-full p-1 leading-none" aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
           {selectedClient && (
            <div className="inline-flex items-center gap-2 mb-2 ml-2 px-3 py-1 dark:bg-green-900/50 bg-green-100 border dark:border-green-800 border-green-200 rounded-full text-sm dark:text-green-300 text-green-700">
              {selectedClient}
              <button type="button" onClick={() => setSelectedClient(null)} className="dark:text-green-400 text-green-500 dark:hover:text-white hover:text-green-800">&times;</button>
            </div>
           )}
          <div className="flex items-end gap-2">
            <div className="flex-1 relative dark:bg-slate-800 bg-slate-100 dark:border dark:border-slate-700 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-[#1f9a65] transition-shadow">
                <textarea
                    value={input} onChange={handleTextareaInput}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                    placeholder={`...نامەیەک بۆ ${employee.name} بنێرە`}
                    className="w-full bg-transparent border-0 rounded-lg py-3 px-4 pr-28 sm:pr-36 resize-none focus:outline-none"
                    rows={1} disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    {employee.role !== 'Caption Writer' && !isLoading && promptTemplates.length > 0 && (
                        <button 
                            type="button" 
                            onClick={() => setShowSuggestions(prev => !prev)} 
                            className="dark:text-slate-400 text-slate-500 rounded-full p-2 dark:hover:bg-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50" 
                            aria-label="Toggle suggestions"
                            aria-expanded={showSuggestions}
                        >
                            <IdeaIcon />
                        </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="dark:text-slate-400 text-slate-500 rounded-full p-2 dark:hover:bg-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50" aria-label="Attach file">
                    <PaperclipIcon />
                    </button>
                    <button type="button" onClick={() => setIsClientModalOpen(true)} disabled={isLoading} className="dark:text-slate-400 text-slate-500 rounded-full p-2 dark:hover:bg-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50" aria-label="Tag client">
                    <TagIcon />
                    </button>
                </div>
            </div>
            <button type="submit" disabled={isLoading || (!input.trim() && !imagePreview)} className="bg-[#1f9a65] text-white font-bold rounded-lg p-3 hover:bg-[#15803d] transition-colors dark:disabled:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed shrink-0 focus:outline-none focus:ring-2 focus:ring-[#1f9a65] focus:ring-offset-2 dark:focus:ring-offset-slate-950 focus:ring-offset-white" aria-label="Send message">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </form>
      </footer>
       {isClientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setIsClientModalOpen(false)}>
          <div className="dark:bg-slate-800 bg-white rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold dark:text-[#28c780] text-[#1f9a65] p-4 border-b dark:border-slate-700 border-slate-200">کڕیارێک تاگ بکە</h3>
            <ul className="p-2 max-h-60 overflow-y-auto">
              {clients.map(client => (
                <li key={client.id} onClick={() => handleClientSelect(client.name)} className="p-3 rounded-lg dark:hover:bg-slate-700 hover:bg-slate-100 cursor-pointer transition-colors dark:text-slate-200 text-slate-800">
                  {client.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};