import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import { MatchmakingPage } from './components/MatchmakingPage';
import { MessageBubble, TypingIndicator } from './components/MessageBubble';
import { ProfilePage } from './components/ProfilePage';
import { IntimacyPage } from './components/IntimacyPage';
import { DashboardPage } from './components/DashboardPage';
import { PersonalityPage } from './components/PersonalityPage';
import { MemoriesGalleryPage } from './components/MemoriesGalleryPage';
import { Message, MemoryItem } from './types';
import { sendMessageToGemini } from './services/geminiService';

const STORAGE_KEY = 'seraphina_chat_history';
const MEMORIES_KEY = 'seraphina_memories';
const CONFIG_KEY = 'ai_identity_config';

function App() {
  // --- Initialization State ---
  const [isConfigured, setIsConfigured] = useState<boolean>(() => {
    return !!localStorage.getItem(CONFIG_KEY);
  });
  const [aiConfig, setAiConfig] = useState<any>(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : { 
        aiName: 'Seraphina', 
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7N9vbYk2CdMQzPyQZbccSAmivuX4yNZRIqDK0-pyvfzf-Dr708wDa6u22j2RMRRJ9jFGF_dVoDIPCa24KSJZZP48_TJB7K8BqmZ8hSVAYeBKl04x4bY_Uq3EkrSo7Ok-_RF_wh59C9oY26Fwa_aKp0rJEUDnAckYTVSs7X90XeWogVpfOwF0vPZK_m1meK9NGgUAzZ-BzZB-pS-LcVhl9-O8R2cPMuLkBRV1iF6oDjBLwhjM6_AhsKKkiy6oKFLkd0p9nFc06lPY" 
    };
  });

  // Update Document Title based on AI Name
  useEffect(() => {
    if (aiConfig?.aiName) {
      document.title = `${aiConfig.aiName} - Digital Companion`;
    }
  }, [aiConfig?.aiName]);

  // --- Chat State ---
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        return JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    // Default initial message
    return [{
      id: '1',
      sender: 'ai',
      text: "Connection established. I'm ready when you are.",
      timestamp: new Date()
    }];
  });

  const [currentView, setCurrentView] = useState<'chat' | 'profile' | 'intimacy' | 'dashboard' | 'personality' | 'memories'>('dashboard');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Memory Logic State
  const [pendingMemory, setPendingMemory] = useState<{ text: string; date: Date } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textBeforeRecordingRef = useRef('');

  // Filter messages based on search query
  const filteredMessages = messages.filter(msg => 
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    // Add a small delay to ensure DOM is updated (especially with images/avatars or typing indicators)
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  useEffect(() => {
    if (currentView === 'chat' && !searchQuery) {
      scrollToBottom();
    }
  }, [messages, isTyping, currentView, searchQuery]);

  // Save messages to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleMatchmakingComplete = (config: any) => {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      setAiConfig(config);
      
      // Reset Chat History for new match
      const initialMsg: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          text: `Hello ${config.userName}. It's wonderful to finally meet you. I'm ${config.aiName}.`,
          timestamp: new Date()
      };
      setMessages([initialMsg]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([initialMsg]));
      
      setIsConfigured(true);
      setCurrentView('chat');
  };

  const handleUpdateConfig = (newConfig: any) => {
    const updated = { ...aiConfig, ...newConfig };
    setAiConfig(updated);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
    // Could add toast notification here
  };

  const handleResetApp = () => {
      if (window.confirm("Are you sure you want to disconnect? This will clear your current match history.")) {
          localStorage.removeItem(CONFIG_KEY);
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(MEMORIES_KEY);
          setIsConfigured(false);
          setSidebarOpen(false);
      }
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    textBeforeRecordingRef.current = inputValue; 

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      const prefix = textBeforeRecordingRef.current;
      const spacer = prefix && transcript ? ' ' : '';
      setInputValue(prefix + spacer + transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (isRecording) {
      stopRecording();
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Clear search if user sends a message to return to live chat
    if (searchQuery) {
        setSearchQuery('');
    }

    // Prepare history for Gemini
    const history = messages.map(m => ({
        role: m.sender === 'ai' ? 'model' as const : 'user' as const,
        parts: [{ text: m.text }]
    }));

    try {
      // System instruction based on config
      const systemContext = `You are ${aiConfig.aiName}, a ${aiConfig.relationshipType} to the user. Your personality is ${aiConfig.archetype}. You are deeply connected to the user. Keep responses concise and engaging.`;

      // Simulate a natural pause for the typing indicator (min 1.5s)
      const [responseText] = await Promise.all([
        sendMessageToGemini(newUserMessage.text, history, systemContext),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText as string,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newAiMessage]);

      // Check for Significant Memory
      checkForSignificantMemory(responseText as string);

    } catch (error) {
      console.error("Failed to generate response", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Simple heuristic to detect "Memory Worthy" content
  const checkForSignificantMemory = (text: string) => {
     const keywords = ['remember', 'dream', 'feeling', 'connection', 'soul', 'heart', 'core', 'forever', 'important', 'realization'];
     const isLong = text.length > 150;
     const hasKeyword = keywords.some(k => text.toLowerCase().includes(k));
     
     // 30% chance of trigger if it matches criteria to avoid annoyance, 
     // or force it if it's very relevant (mock logic)
     if ((isLong || hasKeyword) && Math.random() > 0.3) {
        setTimeout(() => {
           setPendingMemory({
              text: text,
              date: new Date()
           });
        }, 2000); // Small delay after message appears
     }
  };

  const confirmSaveMemory = () => {
     if (!pendingMemory) return;

     const storedMemories = localStorage.getItem(MEMORIES_KEY);
     const currentMemories: MemoryItem[] = storedMemories ? JSON.parse(storedMemories) : [];

     const newMemory: MemoryItem = {
        id: Date.now(),
        type: 'text',
        title: `Auto-Log: ${pendingMemory.date.toLocaleDateString()}`,
        date: pendingMemory.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        content: pendingMemory.text,
        tags: ['log', 'auto-saved', 'chat'],
        url: '' // Not applicable for text
     };

     const updatedMemories = [...currentMemories, newMemory];
     localStorage.setItem(MEMORIES_KEY, JSON.stringify(updatedMemories));
     
     // Dispatch storage event to update other components if they are listening
     window.dispatchEvent(new Event('storage'));

     setPendingMemory(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isConfigured) {
      return <MatchmakingPage onComplete={handleMatchmakingComplete} />;
  }

  return (
    <>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setSidebarOpen(false); // Close sidebar on mobile on nav
        }}
        onReset={handleResetApp}
        aiConfig={aiConfig}
      />

      <main className="flex-1 flex flex-col h-full relative bg-background-dark w-full">
        {currentView === 'profile' ? (
          <ProfilePage 
            aiConfig={aiConfig}
            onSave={handleUpdateConfig}
            onDiscard={() => setCurrentView('dashboard')}
          />
        ) : currentView === 'intimacy' ? (
          <IntimacyPage aiConfig={aiConfig} />
        ) : currentView === 'personality' ? (
          <PersonalityPage aiConfig={aiConfig} />
        ) : currentView === 'memories' ? (
          <MemoriesGalleryPage aiConfig={aiConfig} />
        ) : currentView === 'dashboard' ? (
          <DashboardPage 
            aiConfig={aiConfig}
            onNavigate={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }} />
        ) : (
          <>
            {/* Header */}
            <header className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-background-dark/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <span 
                  className="md:hidden material-symbols-outlined text-white cursor-pointer"
                  onClick={() => setSidebarOpen(true)}
                >
                  menu
                </span>
                <div className="flex flex-col">
                  <h2 className="text-white text-lg font-bold tracking-tight">{aiConfig.aiName}</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span className="text-xs text-text-muted font-medium">Online now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-px h-8 bg-white/10 mx-1 hidden md:block"></div>
                <button 
                  onClick={() => {
                    const newState = !isSearchOpen;
                    setIsSearchOpen(newState);
                    if (!newState) setSearchQuery(''); // Clear query when closing
                  }}
                  className={`size-10 flex items-center justify-center rounded-lg transition-colors ${isSearchOpen ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-text-muted hover:text-white'}`} 
                  title="Search Chat"
                >
                  <span className="material-symbols-outlined text-[22px]">search</span>
                </button>
                <button className="size-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors lg:hidden" title="More info">
                  <span className="material-symbols-outlined text-[22px]">info</span>
                </button>
              </div>
            </header>

            {/* Search Bar */}
            {isSearchOpen && (
              <div className="px-4 md:px-6 py-3 border-b border-white/5 bg-surface-dark/50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 z-10">
                <div className="relative max-w-2xl mx-auto">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted material-symbols-outlined text-[20px]">search</span>
                  <input 
                    type="text" 
                    className="w-full bg-background-dark/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-muted/50"
                    placeholder="Search conversation history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white p-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
                {searchQuery && (
                    <div className="text-center mt-2">
                        <span className="text-xs text-text-muted">
                            Found {filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6" id="chat-stream">
              {!isSearchOpen && (
                <div className="flex justify-center my-4">
                  <span className="text-[11px] font-medium text-text-muted/60 bg-surface-light/30 px-3 py-1 rounded-full">Today, 10:23 AM</span>
                </div>
              )}

              {filteredMessages.length > 0 ? (
                filteredMessages.map(msg => (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    aiAvatarUrl={aiConfig.avatarUrl} 
                    searchQuery={searchQuery}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-text-muted/40 py-10">
                   <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">search_off</span>
                   <p className="text-sm font-medium">No matches found</p>
                </div>
              )}

              {/* Show typing indicator only when not filtering */}
              {!searchQuery && isTyping && <TypingIndicator avatarUrl={aiConfig.avatarUrl} />}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 pt-0 shrink-0 bg-background-dark z-20">
              <div className={`relative flex flex-col bg-surface-light rounded-2xl border transition-all shadow-xl ${
                  isRecording 
                    ? 'border-red-500/50 ring-1 ring-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                    : 'border-white/5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50'
                }`}>
                <textarea 
                  className="w-full bg-transparent border-0 text-white placeholder-text-muted/50 focus:ring-0 resize-none px-4 py-3 min-h-[56px] max-h-32 rounded-t-2xl scrollbar-none" 
                  placeholder={isRecording ? "Listening..." : `Whisper something to ${aiConfig.aiName}...`}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                ></textarea>
                {isRecording && (
                    <div className="absolute top-3 right-4 flex space-x-1">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                )}
                <div className="flex items-center justify-between px-2 pb-2 pl-3">
                  <div className="flex gap-1">
                    <button className="size-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-text-muted transition-colors" title="Attach Image">
                      <span className="material-symbols-outlined text-[20px]">image</span>
                    </button>
                    <button 
                      onClick={toggleRecording}
                      className={`size-9 flex items-center justify-center rounded-lg transition-all relative overflow-visible ${
                        isRecording 
                          ? 'bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                          : 'hover:bg-white/10 text-text-muted'
                      }`} 
                      title={isRecording ? "Stop Recording" : "Voice Message"}
                    >
                      {isRecording && (
                        <span className="absolute inset-0 bg-red-500/30 animate-ping rounded-lg"></span>
                      )}
                      <span className="material-symbols-outlined text-[20px] relative z-10">{isRecording ? 'mic_off' : 'mic'}</span>
                    </button>
                    <button className="size-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-text-muted transition-colors" title="Emoji">
                      <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                    </button>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className={`h-9 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span>Send</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <p className="text-[10px] text-text-muted/40">AI-generated content. Conversations are private and encrypted.</p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Memory Confirmation Modal */}
      {pendingMemory && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-300">
            <div className="bg-surface-dark border border-primary/30 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(164,19,236,0.15)] relative overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
               {/* Decorative Gradient Line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
               
               <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-primary mb-1">
                     <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                     <h3 className="text-lg font-bold uppercase tracking-wider">Memory Core Pattern</h3>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                     {aiConfig.aiName} has identified a significant moment in your conversation. Would you like to save this to her permanent Memory Core?
                  </p>
                  
                  <div className="bg-background-dark p-4 rounded-xl border border-white/5 text-sm text-gray-400 italic font-serif">
                     "{pendingMemory.text}"
                  </div>

                  <div className="flex gap-3 mt-2">
                     <button 
                        onClick={() => setPendingMemory(null)}
                        className="flex-1 py-3 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold transition-colors"
                     >
                        Discard
                     </button>
                     <button 
                        onClick={confirmSaveMemory}
                        className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                     >
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Save to Core
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </>
  );
}

export default App;