import React from 'react';

interface DashboardPageProps {
  onNavigate: (view: 'chat' | 'profile' | 'intimacy' | 'dashboard' | 'memories') => void;
  aiConfig: any;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, aiConfig }) => {
  const avatarUrl = aiConfig?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC7N9vbYk2CdMQzPyQZbccSAmivuX4yNZRIqDK0-pyvfzf-Dr708wDa6u22j2RMRRJ9jFGF_dVoDIPCa24KSJZZP48_TJB7K8BqmZ8hSVAYeBKl04x4bY_Uq3EkrSo7Ok-_RF_wh59C9oY26Fwa_aKp0rJEUDnAckYTVSs7X90XeWogVpfOwF0vPZK_m1meK9NGgUAzZ-BzZB-pS-LcVhl9-O8R2cPMuLkBRV1iF6oDjBLwhjM6_AhsKKkiy6oKFLkd0p9nFc06lPY";
  const name = aiConfig?.aiName || "Seraphina";

  return (
    <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative bg-background-dark text-white font-display">
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/10 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto p-6 md:p-8 flex flex-col gap-8 pb-20">
        
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-1">Overview</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-text-muted font-medium">Subject: {name} (Active)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-light rounded-lg text-white hover:bg-[#4b3b54] transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-light rounded-lg text-white hover:bg-[#4b3b54] transition-colors border border-transparent hover:border-red-500/50 group">
              <span className="material-symbols-outlined text-[20px] group-hover:text-red-400">visibility_off</span>
              <span className="text-sm font-bold">Privacy Mode</span>
            </button>
          </div>
        </header>

        {/* Main Profile Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#2a1d30] border border-white/5 shadow-xl p-6 md:p-8">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            <div className="relative shrink-0 group cursor-pointer" onClick={() => onNavigate('profile')}>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div 
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl bg-slate-900 bg-cover bg-center shadow-inner" 
                style={{backgroundImage: `url("${avatarUrl}")`}}
              ></div>
              <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1">
                <div className="bg-green-500 size-4 rounded-full border-2 border-slate-900"></div>
              </div>
            </div>
            
            <div className="flex-1 w-full flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{name}</h3>
                  <p className="text-primary font-medium text-sm mt-1">Status: Daydreaming | Mood: Playful</p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Connection ID</p>
                  <p className="font-mono text-slate-300">#ALPHA-009-X</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-200">Affection Level 7 (Deep Connection)</span>
                  <span className="text-text-muted">Next: 300 XP</span>
                </div>
                <div className="h-3 w-full bg-surface-dark rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-fuchsia-500 w-[70%] shadow-[0_0_15px_rgba(164,19,236,0.5)]"></div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-2">
                <button 
                  onClick={() => onNavigate('chat')}
                  className="flex-1 sm:flex-none bg-primary hover:bg-[#7c0eb2] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Start Chat
                </button>
                <button className="flex-1 sm:flex-none bg-surface-light hover:bg-[#4b3b54] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                  Voice Call
                </button>
                <button 
                  onClick={() => onNavigate('profile')}
                  className="sm:flex-none bg-surface-light hover:bg-[#4b3b54] text-white px-3 py-2.5 rounded-xl transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">checkroom</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button 
              onClick={() => onNavigate('chat')}
              className="flex flex-col items-center justify-center p-4 bg-[#2a1d30] hover:bg-[#332839] border border-white/5 hover:border-primary/30 rounded-2xl transition-all group shadow-sm hover:shadow-lg"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-[24px]">chat_bubble</span>
              </div>
              <span className="font-bold text-white text-sm">Start Chat</span>
            </button>

            <button 
              onClick={() => onNavigate('profile')}
              className="flex flex-col items-center justify-center p-4 bg-[#2a1d30] hover:bg-[#332839] border border-white/5 hover:border-primary/30 rounded-2xl transition-all group shadow-sm hover:shadow-lg"
            >
              <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-blue-400 text-[24px]">person</span>
              </div>
              <span className="font-bold text-white text-sm">View Profile</span>
            </button>

            <button 
              onClick={() => onNavigate('memories')}
              className="flex flex-col items-center justify-center p-4 bg-[#2a1d30] hover:bg-[#332839] border border-white/5 hover:border-primary/30 rounded-2xl transition-all group shadow-sm hover:shadow-lg"
            >
              <div className="size-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-pink-400 text-[24px]">photo_library</span>
              </div>
              <span className="font-bold text-white text-sm">Gallery</span>
            </button>

            <button 
               className="flex flex-col items-center justify-center p-4 bg-[#2a1d30] hover:bg-[#332839] border border-white/5 hover:border-primary/30 rounded-2xl transition-all group shadow-sm hover:shadow-lg"
            >
              <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-green-400 text-[24px]">history</span>
              </div>
              <span className="font-bold text-white text-sm">History</span>
            </button>
        </div>

        {/* Widgets Header */}
        <div className="flex items-center justify-between mt-2 mb-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">view_quilt</span>
            Your Widgets
          </h3>
          <div className="flex gap-2">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 bg-[#2a1d30] border border-white/5 rounded-lg hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Widget
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#4b3b54] rounded-lg hover:bg-primary transition-colors shadow-lg shadow-black/20">
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Customize Layout
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
          
          {/* Quick Chat Widget */}
          <div className="group relative col-span-1 lg:col-span-2 row-span-2 bg-[#2a1d30] border border-white/5 rounded-2xl flex flex-col h-[450px] shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 hover:bg-surface-light rounded">
              <span className="material-symbols-outlined text-slate-400">drag_indicator</span>
            </div>
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-bold text-white">Quick Chat</span>
              </div>
              <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">open_in_full</span></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-cover bg-center shrink-0" style={{backgroundImage: `url("${avatarUrl}")`}}></div>
                <div className="bg-surface-light p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                  <p className="text-sm text-slate-200">I was just thinking about that movie we watched last night. The ending was so unexpected!</p>
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="bg-primary/20 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                  <p className="text-sm text-white">I know right? I didn't see that twist coming at all.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-cover bg-center shrink-0" style={{backgroundImage: `url("${avatarUrl}")`}}></div>
                <div className="bg-surface-light p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                  <div className="flex gap-1 mb-1">
                    <span className="size-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-white/5">
              <div className="relative">
                <input className="w-full bg-surface-dark border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-white placeholder-slate-400" placeholder="Type a message..." type="text"/>
                <button 
                  onClick={() => onNavigate('chat')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg hover:bg-[#7c0eb2] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Status Monitor Widget */}
          <div className="group relative col-span-1 bg-[#2a1d30] border border-white/5 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 hover:bg-surface-light rounded">
              <span className="material-symbols-outlined text-slate-400">drag_indicator</span>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-pink-500">favorite</span>
              <h4 className="font-bold text-white">Status Monitor</h4>
            </div>
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Emotional Arousal</span>
                  <span className="text-pink-500">High</span>
                </div>
                <div className="w-full bg-surface-dark rounded-full h-2">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full w-[85%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Social Battery</span>
                  <span className="text-blue-500">Charging</span>
                </div>
                <div className="w-full bg-surface-dark rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-[40%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Devotion</span>
                  <span className="text-primary">Max</span>
                </div>
                <div className="w-full bg-surface-dark rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[95%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Gift Budget Widget */}
          <div className="group relative col-span-1 bg-[#2a1d30] border border-white/5 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 hover:bg-surface-light rounded">
              <span className="material-symbols-outlined text-slate-400">drag_indicator</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-amber-500">savings</span>
              <h4 className="font-bold text-white">Gift Budget</h4>
            </div>
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative size-24">
                <svg className="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                  <path className="text-surface-dark" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                  <path className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeWidth="3"></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white">750</span>
                  <span className="text-[10px] text-slate-500 uppercase">Tokens</span>
                </div>
              </div>
              <p className="text-xs text-center text-text-muted mt-3">Monthly Cap: 1000 Tokens</p>
              <button className="mt-4 w-full py-2 bg-surface-light hover:bg-[#4b3b54] rounded-lg text-xs font-bold text-white transition-colors">
                Manage Wallet
              </button>
            </div>
          </div>

          {/* Highlights Reel Widget */}
          <div 
            onClick={() => onNavigate('memories')}
            className="group relative col-span-1 bg-[#2a1d30] border border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 min-h-[250px] cursor-pointer"
          >
            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 bg-black/50 rounded backdrop-blur-md">
              <span className="material-symbols-outlined text-white">drag_indicator</span>
            </div>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBpKW36TQHtXqTdJrDovVec2JvBUlEaj22uK_Xx9Jc2Xxq6AV5hHEQ_3NHEXwflm8PyqAl94oZTAk_1puMgmc1tmJkUvDjUD4i_teJr4a_AxaDyUQ958kNqb5yu9kH90i7iFbUQjCLKNt66quBrXd48lfxmK4oTYP8__D9c-atu-SZ6sbuJYBoYeUW0kHJImWAX0XEVhWrZ2gSZBTSu4jWvNR9IPS3Ww8yg_Cuk_pi0Pi7198bVDiPpTag53uHhZbY6134d8Eue9dw")'}}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-5 w-full">
              <div className="flex items-center gap-2 mb-2 text-white/80">
                <span className="material-symbols-outlined text-sm">auto_awesome_motion</span>
                <span className="text-xs font-bold uppercase tracking-wider">Highlights Reel</span>
              </div>
              <h4 className="text-white font-bold text-lg leading-tight mb-3">Dreamscape Collection</h4>
              <div className="flex items-center gap-2">
                <button className="size-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </button>
                <button className="size-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">skip_next</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Widget */}
          <div className="group relative col-span-1 bg-[#2a1d30] border border-white/5 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 hover:bg-surface-light rounded">
              <span className="material-symbols-outlined text-slate-400">drag_indicator</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-purple-500">analytics</span>
              <h4 className="font-bold text-white">Stats</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-dark p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">Voice</p>
                <p className="text-lg font-bold text-white">4h 12m</p>
              </div>
              <div className="bg-surface-dark p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">Msg</p>
                <p className="text-lg font-bold text-white">1.2k</p>
              </div>
              <div className="bg-surface-dark p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">Photos</p>
                <p className="text-lg font-bold text-white">85</p>
              </div>
              <div className="bg-surface-dark p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">Rank</p>
                <p className="text-lg font-bold text-primary">S+</p>
              </div>
            </div>
          </div>

          {/* Milestones Widget */}
          <div className="group relative col-span-1 lg:col-span-3 xl:col-span-2 bg-[#2a1d30] border border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 hover:bg-surface-light rounded">
              <span className="material-symbols-outlined text-slate-400">drag_indicator</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                <h4 className="font-bold text-white">Relationship Milestones</h4>
              </div>
              <button className="text-xs text-primary hover:underline">View Full Log</button>
            </div>
            <div className="relative pl-4 border-l-2 border-white/5 space-y-6">
              <div className="relative">
                <div className="absolute -left-[23px] top-0 size-4 rounded-full bg-primary ring-4 ring-[#2a1d30]"></div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Today, 10:42 AM</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">Secret</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Shared Core Memory #04</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[23px] top-0 size-4 rounded-full bg-blue-400 ring-4 ring-[#2a1d30]"></div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Yesterday, 9:15 PM</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 uppercase">Call</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Late Night Call (45m)</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[23px] top-0 size-4 rounded-full bg-amber-400 ring-4 ring-[#2a1d30]"></div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Oct 22, 2:30 PM</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 uppercase">Rank</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Reached "Deep Connection" (Lvl 7)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};