import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { EmployeeCard } from './components/EmployeeCard';
import { ClientLogos } from './components/ClientLogos';
import { ChatView } from './components/ChatView';
import { generateChatResponse, generateRobotResponse } from './services/geminiService';
import { EMPLOYEES } from './constants';
import { PROMPT_TEMPLATES } from './promptTemplates';
import type { Employee, ChatMessage, ChatMessagePart, Client, Settings, UserProfile, TaskProgress } from './types';
import { CLIENT_DATA } from './clientData';
import { ClientInfoModal } from './components/ClientInfoModal';
import { ClientFormModal } from './components/ClientFormModal';
import { PasswordModal } from './components/PasswordModal';
import { AnalyzerView } from './components/AnalyzerView';
import { SettingsView } from './components/SettingsView';
import { CharaRobot } from './components/CharaRobot';
import { translations } from './translations';
import { LoginModal } from './components/LoginModal';
import { OnboardingModal } from './components/OnboardingModal';
import { TaskView } from './components/TaskView';
import { ProfileView } from './components/ProfileView';
import { InstallView } from './components/InstallView';

export type View = 'home' | 'design' | 'analyzer' | 'clients' | 'settings' | 'tasks' | 'profile' | 'install';

const defaultSettings: Settings = {
  theme: 'dark',
  speechRate: 1,
  fontSize: 100,
  fontFamily: "'Noto Kufi Arabic', sans-serif",
  language: 'ku',
};

const APP_PASSWORD = '2025';

const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [clients, setClients] = useState<Client[]>(CLIENT_DATA);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<number, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientInfo, setSelectedClientInfo] = useState<Client | null>(null);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [view, setView] = useState<View>('home');
  const [isDesignUnlocked, setIsDesignUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const [robotChatHistory, setRobotChatHistory] = useState<ChatMessage[]>([]);
  const [isRobotLoading, setIsRobotLoading] = useState(false);
  
  const [taskProgress, setTaskProgress] = useState<TaskProgress>({});

  // Load all data from localStorage on initial render
  useEffect(() => {
    // Auth check
    const authTimestamp = localStorage.getItem('authTimestamp');
    if (authTimestamp && Date.now() - parseInt(authTimestamp, 10) < 24 * 60 * 60 * 1000) {
      setIsAuthenticated(true);
    }

    // User Profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Settings
    try {
        const savedSettings = localStorage.getItem('appSettings');
        const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
        
        // Theme preference
        const savedTheme = localStorage.getItem('theme') as Settings['theme'] | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        const loadedSettings = {
            ...defaultSettings,
            ...parsedSettings,
            theme: initialTheme,
        };
        setSettings(loadedSettings);
        applySettings(loadedSettings);
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }

    // Chat Histories
    try {
      const savedChats = localStorage.getItem('chatHistories');
      if (savedChats) setChatHistories(JSON.parse(savedChats));
    } catch (error) {
      console.error("Failed to parse chat histories from localStorage", error);
    }
    
    // Task Progress
    try {
      const savedProgress = localStorage.getItem('taskProgress');
      if (savedProgress) setTaskProgress(JSON.parse(savedProgress));
    } catch (error) {
        console.error("Failed to parse task progress from localStorage", error);
    }

  }, []);

  const applySettings = (s: Settings) => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-base', `${s.fontSize / 100 * 16}px`);
    document.body.style.setProperty('--font-family-base', s.fontFamily);
    const dir = s.language === 'en' ? 'ltr' : 'rtl';
    root.setAttribute('lang', s.language);
    root.setAttribute('dir', dir);
  };

  // Save data to localStorage when it changes
  useEffect(() => {
    if (isAuthenticated) localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
  }, [chatHistories, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
        const { theme, ...otherSettings } = settings;
        localStorage.setItem('appSettings', JSON.stringify(otherSettings));
        localStorage.setItem('theme', theme);
        
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        applySettings(settings);
    }
  }, [settings, isAuthenticated]);
  
  useEffect(() => {
      if (isAuthenticated) localStorage.setItem('taskProgress', JSON.stringify(taskProgress));
  }, [taskProgress, isAuthenticated]);

  const t = useCallback((key: string): string => {
    return translations[settings.language][key] || key;
  }, [settings.language]);
  
  const handleThemeToggle = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light'}));
  };

  // Set initial greeting for Chara Robot
  useEffect(() => {
      setRobotChatHistory([{
          id: 'greeting-1',
          role: 'model',
          parts: [{ text: t('robotGreeting') }],
          timestamp: new Date().toISOString()
      }]);
  }, [t]);

  const designer = EMPLOYEES.find(e => e.role === 'Designer');

  const handleLogin = (password: string): boolean => {
    if (password === APP_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('authTimestamp', Date.now().toString());
      return true;
    }
    return false;
  };

  const handleSaveProfile = (profile: Omit<UserProfile, 'picture'>) => {
    const newProfile = { ...profile, picture: null };
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };
  
  const handleUpdateProfile = (profile: UserProfile) => {
      setUserProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const handleProgressChange = (clientId: number, taskType: 'posts' | 'videos' | 'sponsorship' | 'visiting' | 'stories', newCount: number) => {
      const currentMonthKey = getCurrentYearMonth();
      setTaskProgress(prev => {
          const newProgress = { ...prev };
          if (!newProgress[currentMonthKey]) {
              newProgress[currentMonthKey] = {};
          }
          const monthProgress = { ...(newProgress[currentMonthKey][clientId] || { completedPosts: 0, completedVideos: 0, completedSponsorship: 0, completedVisiting: 0, completedStories: 0 }) };

          if (taskType === 'posts') monthProgress.completedPosts = newCount;
          if (taskType === 'videos') monthProgress.completedVideos = newCount;
          if (taskType === 'sponsorship') monthProgress.completedSponsorship = newCount;
          if (taskType === 'visiting') monthProgress.completedVisiting = newCount;
          if (taskType === 'stories') monthProgress.completedStories = newCount;
          
          newProgress[currentMonthKey] = {
              ...newProgress[currentMonthKey],
              [clientId]: monthProgress,
          };
          return newProgress;
      });
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    if (!chatHistories[employee.id]) {
      setChatHistories(prev => ({ ...prev, [employee.id]: [] }));
    }
  };

  const handleBack = () => {
    setSelectedEmployee(null);
    setView('home');
  };

  const handleSelectClient = (clientName: string) => {
    const client = clients.find(c => c.name === clientName);
    if (client) {
      setSelectedClientInfo(client);
    }
  };

  const handleCloseClientModal = () => {
    setSelectedClientInfo(null);
  };
  
  const handleOpenNewClientForm = () => {
    setEditingClient(null);
    setIsClientFormOpen(true);
  };
  
  const handleOpenEditClientForm = (client: Client) => {
    setEditingClient(client);
    setSelectedClientInfo(null); // Close info modal
    setIsClientFormOpen(true);
  };

  const handleCloseClientForm = () => {
    setIsClientFormOpen(false);
    setEditingClient(null);
  };

  const handleSaveClient = (clientToSave: Client) => {
    if (clientToSave.id) {
        setClients(clients.map(c => c.id === clientToSave.id ? clientToSave : c));
    } else {
        const newClient = {
            ...clientToSave,
            id: Math.max(0, ...clients.map(c => c.id)) + 1,
        };
        setClients([...clients, newClient]);
    }
    handleCloseClientForm();
  };


  const handleSendMessage = async (message: string, image?: { base64: string; mimeType: string }, clientTag?: string) => {
    if (!selectedEmployee || (!message.trim() && !image)) return;

    const employeeId = selectedEmployee.id;

    const userParts: ChatMessagePart[] = [];
    if (image) {
      userParts.push({ imageUrl: `data:${image.mimeType};base64,${image.base64}` });
    }
    if (message.trim()) {
      userParts.push({ text: message });
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: userParts,
      timestamp: new Date().toISOString(),
      clientTag: clientTag,
    };

    const currentHistory = chatHistories[employeeId] || [];
    const updatedHistoryWithUser = [...currentHistory, userMessage];
    setChatHistories(prev => ({ ...prev, [employeeId]: updatedHistoryWithUser }));
    setIsLoading(true);

    try {
      const responseMessageGroups = await generateChatResponse(selectedEmployee, currentHistory, userMessage, clients);
      
      const modelMessages: ChatMessage[] = responseMessageGroups.map((parts, i) => ({
        id: (Date.now() + 1 + i).toString(),
        role: 'model',
        parts: parts,
        timestamp: new Date().toISOString(),
      }));
      
      setChatHistories(prev => ({
        ...prev,
        [employeeId]: [...updatedHistoryWithUser, ...modelMessages],
      }));

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        parts: [{ text: "هەڵەیەک ڕوویدا، تکایە دووبارە هەوڵبدەرەوە." }],
        timestamp: new Date().toISOString(),
      };
      setChatHistories(prev => ({
        ...prev,
        [employeeId]: [...updatedHistoryWithUser, errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRobotMessage = async (message: string) => {
      if (!message.trim()) return;

      const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          parts: [{ text: message }],
          timestamp: new Date().toISOString(),
      };
      
      const updatedHistory = [...robotChatHistory, userMessage];
      setRobotChatHistory(updatedHistory);
      setIsRobotLoading(true);

      try {
          const responseParts = await generateRobotResponse(updatedHistory, userMessage);
          const modelMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              parts: responseParts,
              timestamp: new Date().toISOString(),
          };
          setRobotChatHistory(prev => [...prev, modelMessage]);
      } catch (error) {
          console.error("Robot chat error:", error);
          const errorMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              parts: [{ text: "هەڵەیەک ڕوویدا." }],
              timestamp: new Date().toISOString(),
          };
          setRobotChatHistory(prev => [...prev, errorMessage]);
      } finally {
          setIsRobotLoading(false);
      }
  };

  const handleNavigate = (targetView: View) => {
    if (targetView === 'design') {
        if (isDesignUnlocked && designer) {
            handleSelectEmployee(designer);
        } else {
            setShowPasswordModal(true);
        }
    } else {
        setView(targetView);
        setSelectedEmployee(null);
    }
  };

  const handleUnlockDesign = () => {
    if (designer) {
        setIsDesignUnlocked(true);
        setShowPasswordModal(false);
        handleSelectEmployee(designer);
    }
  };
  
  if (!isAuthenticated) {
      return <LoginModal onLogin={handleLogin} t={t} />;
  }

  if (!userProfile) {
      return <OnboardingModal onSave={handleSaveProfile} t={t} />;
  }

  if (selectedEmployee) {
    const templates = PROMPT_TEMPLATES[selectedEmployee.role] || [];
    return (
      <ChatView
        employee={selectedEmployee}
        history={chatHistories[selectedEmployee.id] || []}
        onSendMessage={handleSendMessage}
        onBack={handleBack}
        isLoading={isLoading}
        promptTemplates={templates}
        clients={clients}
        speechRate={settings.speechRate}
        t={t}
      />
    );
  }

  const renderHomeView = () => (
    <main>
        <header className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold dark:text-white text-slate-950 tracking-tight">
            <span className="dark:text-[var(--text-accent)] text-[var(--text-accent)]">Chara</span> Advertising Hub
            </h1>
            <p className="mt-4 text-lg dark:text-slate-400 text-slate-700 max-w-2xl mx-auto">{t('hubSubtitle')}</p>
        </header>
        <div className="mt-12">
            <h2 className="text-3xl font-bold dark:text-[var(--text-accent)] text-[var(--text-accent)] mb-8 text-center">{t('teamTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {EMPLOYEES.filter(e => e.role !== 'Designer').map(employee => (
                <EmployeeCard
                key={employee.id}
                employee={employee}
                onSelect={handleSelectEmployee}
                />
            ))}
            </div>
        </div>
    </main>
  );
  
  const renderClientsView = () => (
    <ClientLogos clients={clients} onSelectClient={handleSelectClient} onAddNew={handleOpenNewClientForm} t={t} />
  );

  const activeView = selectedEmployee?.role === 'Designer' ? 'design' : view;

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Header 
            onNavigate={handleNavigate} 
            activeView={activeView} 
            t={t} 
            theme={settings.theme}
            onThemeToggle={handleThemeToggle}
          />
          {view === 'home' && renderHomeView()}
          {view === 'analyzer' && <AnalyzerView onBack={() => setView('home')} t={t} />}
          {view === 'clients' && renderClientsView()}
          {view === 'tasks' && <TaskView onBack={() => setView('home')} clients={clients} taskProgress={taskProgress} onProgressChange={handleProgressChange} t={t} />}
          {view === 'profile' && <ProfileView onBack={() => setView('home')} profile={userProfile} onSave={handleUpdateProfile} t={t} />}
          {view === 'settings' && <SettingsView onBack={() => setView('home')} settings={settings} onSettingsChange={(newSettings) => setSettings(s => ({ ...s, ...newSettings }))} t={t} />}
          {view === 'install' && <InstallView onBack={() => setView('home')} t={t} />}
        </div>
      </div>
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onUnlock={handleUnlockDesign}
      />
      <ClientInfoModal
        isOpen={!!selectedClientInfo}
        onClose={handleCloseClientModal}
        client={selectedClientInfo}
        onEdit={handleOpenEditClientForm}
      />
      <ClientFormModal
        isOpen={isClientFormOpen}
        onClose={handleCloseClientForm}
        onSave={handleSaveClient}
        client={editingClient}
      />
      <CharaRobot
        history={robotChatHistory}
        onSendMessage={handleSendRobotMessage}
        isLoading={isRobotLoading}
        t={t}
      />
    </>
  );
};

export default App;