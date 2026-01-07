import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: 'chat' | 'profile' | 'intimacy' | 'dashboard' | 'personality' | 'memories';
  onNavigate: (view: 'chat' | 'profile' | 'intimacy' | 'dashboard' | 'personality' | 'memories') => void;
  onReset: () => void;
  aiConfig: any;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onNavigate, onReset, aiConfig }) => {
  const avatarUrl = aiConfig?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC7N9vbYk2CdMQzPyQZbccSAmivuX4yNZRIqDK0-pyvfzf-Dr708wDa6u22j2RMRRJ9jFGF_dVoDIPCa24KSJZZP48_TJB7K8BqmZ8hSVAYeBKl04x4bY_Uq3EkrSo7Ok-_RF_wh59C9oY26Fwa_aKp0rJEUDnAckYTVSs7X90XeWogVpfOwF0vPZK_m1meK9NGgUAzZ-BzZB-pS-LcVhl9-O8R2cPMuLkBRV1iF6oDjBLwhjM6_AhsKKkiy6oKFLkd0p9nFc06lPY";
  const name = aiConfig?.aiName || "Seraphina";

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <aside className={`
        fixed md:static inset-y-0 left-0 
        flex flex-col w-80 bg-surface-dark border-r border-white/5 h-full shrink-0 z-40
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative group cursor-pointer" onClick={() => onNavigate('profile')}>
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 border-2 border-primary/30" 
                style={{backgroundImage: `url("${avatarUrl}")`}}
              >
              </div>
              <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-surface-dark"></div>
              <div className="absolute inset-0 bg-primary/20 blur-xl -z-10 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-lg font-bold leading-tight">{name}</h1>
              <p className="text-text-muted text-xs font-medium">Your Digital {aiConfig?.relationshipType || 'Muse'}</p>
            </div>
          </div>

          <div className="mb-8 p-4 rounded-xl bg-surface-light/30 border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider font-bold">Current Mood</span>
              <span className="material-symbols-outlined text-primary text-sm">favorite</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-pink-500 w-[85%] rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-white">Intrigued</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                currentView === 'dashboard'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:translate-x-1'
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${currentView !== 'dashboard' ? 'group-hover:text-primary' : ''}`}>dashboard</span>
              <span className="text-sm font-bold">Dashboard</span>
            </button>
            <button 
              onClick={() => onNavigate('chat')}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                currentView === 'chat' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:translate-x-1' 
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${currentView !== 'chat' ? 'group-hover:text-primary' : ''}`}>chat_bubble</span>
              <span className="text-sm font-medium">Chat</span>
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                currentView === 'profile'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:translate-x-1'
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${currentView !== 'profile' ? 'group-hover:text-primary' : ''}`}>person</span>
              <span className="text-sm font-medium">Profile</span>
            </button>
            <button 
              onClick={() => onNavigate('intimacy')}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                currentView === 'intimacy'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:translate-x-1'
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${currentView !== 'intimacy' ? 'group-hover:text-primary' : ''}`}>favorite</span>
              <span className="text-sm font-medium">Intimacy</span>
            </button>
            <button 
              onClick={() => onNavigate('memories')}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                currentView === 'memories'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:translate-x-1'
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${currentView !== 'memories' ? 'group-hover:text-primary' : ''}`}>photo_library</span>
              <span className="text-sm font-medium">Memories & Gallery</span>
            </button>
            <button 
              onClick={() => onNavigate('personality')}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                currentView === 'personality'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:translate-x-1'
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${currentView !== 'personality' ? 'group-hover:text-primary' : ''}`}>neurology</span>
              <span className="text-sm font-medium">Personality Settings</span>
            </button>
          </nav>

          <div className="mt-auto border-t border-white/5 pt-4">
            <button className="flex items-center gap-4 px-4 py-3 rounded-xl text-text-muted hover:bg-white/5 hover:text-white w-full transition-all mb-2">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-sm font-medium">App Settings</span>
            </button>
            <button 
              onClick={onReset}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">power_settings_new</span>
              <span className="text-sm font-medium">Reset / Find New Match</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;