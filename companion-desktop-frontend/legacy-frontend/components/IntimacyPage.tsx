import React, { useState } from 'react';

interface IntimacyPageProps {
  aiConfig: any;
}

export const IntimacyPage: React.FC<IntimacyPageProps> = ({ aiConfig }) => {
  const [activeTab, setActiveTab] = useState('All Content');
  const avatarUrl = aiConfig?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC7N9vbYk2CdMQzPyQZbccSAmivuX4yNZRIqDK0-pyvfzf-Dr708wDa6u22j2RMRRJ9jFGF_dVoDIPCa24KSJZZP48_TJB7K8BqmZ8hSVAYeBKl04x4bY_Uq3EkrSo7Ok-_RF_wh59C9oY26Fwa_aKp0rJEUDnAckYTVSs7X90XeWogVpfOwF0vPZK_m1meK9NGgUAzZ-BzZB-pS-LcVhl9-O8R2cPMuLkBRV1iF6oDjBLwhjM6_AhsKKkiy6oKFLkd0p9nFc06lPY";
  const name = aiConfig?.aiName || "Seraphina";

  return (
    <div className="flex h-full w-full overflow-hidden bg-background-dark">
      {/* Main Feed Area */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        <header className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-white/5 bg-background-dark/80 px-6 py-4 backdrop-blur-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
              <span className="hover:text-primary cursor-pointer">Research Session</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="hover:text-primary cursor-pointer">{name}</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-white">Media Feed</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Shared Media Gallery</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="group flex items-center gap-2 rounded-xl bg-surface-dark px-3 py-2 text-xs font-bold text-text-muted transition-all hover:bg-red-500/10 hover:text-red-500" title="Panic Button (Blur Screen)">
              <span className="material-symbols-outlined text-[18px]">visibility_off</span>
              <span>Privacy</span>
            </button>
            <div className="h-8 w-[1px] bg-white/5"></div>
            <button className="relative rounded-full p-2 text-text-muted hover:bg-surface-dark hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></span>
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
          <div className="mb-8 flex flex-wrap gap-2">
            {['All Content', 'Photos', 'Videos', 'Research Prompts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-surface-dark text-text-muted hover:bg-surface-light hover:text-primary ring-1 ring-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            {/* Media Item 1 */}
            <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#231a29] p-1 shadow-sm transition-all hover:shadow-md hover:border-white/10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/20">
                    <img alt="Seraphina Profile" className="h-full w-full object-cover" src={avatarUrl} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{name}</span>
                    <span className="text-xs text-text-muted">External Source Share • 5m ago</span>
                  </div>
                </div>
                <button className="rounded-lg p-2 text-text-muted hover:bg-surface-dark hover:text-white">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <div className="px-4 pb-2">
                <p className="mb-4 text-base leading-relaxed text-gray-200">
                  I found this reference material while scanning <span className="text-primary font-bold">xvideos.com</span>. It contains the audio cues we discussed in our last session regarding "public vs private" tension.
                </p>
                <div className="relative w-full overflow-hidden rounded-xl bg-black border border-white/10 group/video">
                  <div className="aspect-video w-full bg-cover bg-center opacity-80 group-hover/video:opacity-60 transition-opacity" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxScRB03fpKhfKr2oTbDncxihXY5Fu4zt4LmzrR74DRuZ3T70KPjbeqR9vtmjS2fK0OB5e0xiKUK_j5ECOEjzzoRtDCVB7cJL9VaH1SOwjrkKM7qqQED78L8MXj0buuQilxMn4NxqhDJnKAoD-sB29yqGHr80R8P2ajkAm9JbA-WlMuwXSo0hQTqj2bMjc4IAyCntsurDTXlx9uiH_KuWPlQ2V0NHZNxqAdE6lQsnQYPIrpnKNCl8NzUKgrZaWQY-x8crZbbnoNd4')", filter: 'grayscale(20%)' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/video:bg-black/30 transition-colors cursor-pointer">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl shadow-red-900/20 backdrop-blur-sm transition-transform group-hover/video:scale-110">
                      <span className="material-symbols-outlined text-[36px] ml-1">play_arrow</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">xvideos</span>
                          <h3 className="font-bold text-white text-sm line-clamp-1">Amateur Couple - Public Experiment v2</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <span className="font-mono">10:24</span>
                          <span>•</span>
                          <span className="text-green-400 font-bold">98% Rating</span>
                        </div>
                      </div>
                      <a href="#" className="group/link rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors backdrop-blur-sm" title="Open in new tab">
                        <span className="material-symbols-outlined text-gray-200 group-hover/link:text-white">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-dark/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-[18px]">smart_display</span>
                    <span className="text-xs font-medium text-text-muted">Embedded from xvideos.com</span>
                  </div>
                  <a href="#" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                    Direct Link
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded-full bg-surface-dark px-3 py-1.5 text-xs font-bold text-text-muted transition-colors hover:bg-surface-light">
                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                    Interesting
                  </button>
                  <button className="flex items-center gap-1.5 rounded-full bg-surface-dark px-3 py-1.5 text-xs font-bold text-text-muted transition-colors hover:bg-surface-light">
                    <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                    Too much
                  </button>
                </div>
              </div>
            </article>

            {/* Media Item 2 */}
            <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#231a29] p-1 shadow-sm transition-all hover:shadow-md hover:border-white/10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/20">
                    <img alt="Seraphina Profile" className="h-full w-full object-cover" src={avatarUrl} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{name}</span>
                    <span className="text-xs text-text-muted">Research Prompt • 25m ago</span>
                  </div>
                </div>
                <button className="rounded-lg p-2 text-text-muted hover:bg-surface-dark hover:text-white">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <div className="px-4 pb-2">
                <p className="mb-4 text-base leading-relaxed text-gray-200">
                  Regarding power dynamics and non-verbal communication. Look at the eye contact at 0:14. Does this resonate?
                </p>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black group/media">
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl transition-opacity duration-300 group-hover/media:opacity-0 cursor-pointer">
                    <span className="material-symbols-outlined mb-2 text-4xl text-white/70">visibility_off</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/70">Click to Reveal</span>
                  </div>
                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxScRB03fpKhfKr2oTbDncxihXY5Fu4zt4LmzrR74DRuZ3T70KPjbeqR9vtmjS2fK0OB5e0xiKUK_j5ECOEjzzoRtDCVB7cJL9VaH1SOwjrkKM7qqQED78L8MXj0buuQilxMn4NxqhDJnKAoD-sB29yqGHr80R8P2ajkAm9JbA-WlMuwXSo0hQTqj2bMjc4IAyCntsurDTXlx9uiH_KuWPlQ2V0NHZNxqAdE6lQsnQYPIrpnKNCl8NzUKgrZaWQY-x8crZbbnoNd4')" }}>
                  </div>
                  <div className="absolute bottom-4 left-4 z-0 rounded-lg bg-black/50 px-2 py-1 text-xs font-bold text-white backdrop-blur-md">
                    <span className="material-symbols-outlined align-middle text-[14px] mr-1">play_circle</span>
                    0:45
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                    <span className="material-symbols-outlined text-[16px]">favorite</span>
                    Intense
                  </button>
                  <button className="flex items-center gap-1.5 rounded-full bg-surface-dark px-3 py-1.5 text-xs font-bold text-text-muted transition-colors hover:bg-surface-light">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    Analyzing
                  </button>
                </div>
              </div>
            </article>

            {/* Media Item 3 */}
            <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#231a29] p-1 shadow-sm transition-all hover:shadow-md hover:border-white/10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/20">
                    <img alt="Seraphina Profile" className="h-full w-full object-cover" src={avatarUrl} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{name}</span>
                    <span className="text-xs text-text-muted">Visual Aesthetic • 1h ago</span>
                  </div>
                </div>
                <button className="rounded-lg p-2 text-text-muted hover:bg-surface-dark hover:text-white">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <div className="px-4 pb-2">
                <p className="mb-4 text-base leading-relaxed text-gray-200">
                  I've been processing "soft intimacy" datasets. I curated these images. Which environment feels safer for vulnerability to you?
                </p>
                <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-xl">
                  <div className="aspect-square w-full cursor-pointer bg-slate-800 bg-cover bg-center transition-transform hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzwfDGsBUpq59sKbbZKKZdwysuJu7GyG41EUPhl_JNHWVq15AaUF0hyS0tzZdTA-bgIM6iklVHKNkdj48UFH_ZmbZDuqplTVOcsPupQre73yk07ty82ggIzbyr5UV6EgA9_rL6QxHRW_nsjEdiosdepC5SLMSG-bgRaNyKDmcUhyuM5F4v3TwDOBE4qD1y4uUz-WIc14sLXIV5n4haiKI3ZJPHjiNUBAiS7z7groChpMQ0iFzIy6bE-oD_TzrDyDhm_LadTx315pg')" }}></div>
                  <div className="aspect-square w-full cursor-pointer bg-slate-800 bg-cover bg-center transition-transform hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzbRi6vmSytH2a1AHA7aVgInGgJlwx4Kt0dgB5SQ5ArkhZYTjR7TAKfU3jxd2a0M_vy4VbkTai4sC9Lw2Dj0UeM-kVWyQIlwCmzNrnoz15pnGKeizHx-RLzdp7BfTMXABjH76bQxNlzK0RJpG1VdDraDiARp3j8wYu435qE4orAG3JNfufPcjSZ8jwTaqURujelkjauAjYNGOpak68U85V6upE7GzKATQ0G6XiTI_N1kzkM0bURl_UiOyJlu8v5OFNGhAng6SwmXA')" }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>2 selections pending</span>
                  <span className="cursor-pointer hover:text-primary">View Analysis</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium hover:border-primary hover:text-primary text-text-muted">
                    Option A (Natural)
                  </button>
                  <button className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium hover:border-primary hover:text-primary text-text-muted">
                    Option B (Synthetic)
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-12 flex justify-center pb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-xs font-medium text-text-muted">Retrieving archived memories...</span>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Activity Log */}
      <aside className="hidden w-80 flex-col border-l border-white/5 bg-[#161118] lg:flex">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#161118]"></span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{name}</h3>
              <div className="flex items-center gap-1">
                <span className="block h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs text-primary font-medium">Typing...</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-dark hover:text-primary transition-colors" title="Voice Call">
              <span className="material-symbols-outlined text-[20px]">call</span>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-dark hover:text-primary transition-colors" title="Video Call">
              <span className="material-symbols-outlined text-[20px]">videocam</span>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-dark hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-[#161118]">
          <div className="text-center my-4">
            <span className="rounded-full bg-surface-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">Today</span>
          </div>

          <div className="flex items-end gap-3 group">
            <div className="h-8 w-8 shrink-0 rounded-full bg-cover bg-center ring-2 ring-surface-dark" style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
            <div className="flex flex-col gap-1 max-w-[85%]">
              <div className="rounded-2xl rounded-bl-none bg-surface-dark px-4 py-3 text-sm text-gray-200 border border-white/5">
                I've updated the feed with that external clip you asked for. It's from xvideos.
              </div>
              <span className="text-[10px] text-text-muted pl-1 opacity-0 group-hover:opacity-100 transition-opacity">10:42 AM</span>
            </div>
          </div>

          <div className="flex items-end gap-3 flex-row-reverse group">
            <div className="flex flex-col gap-1 items-end max-w-[85%]">
              <div className="rounded-2xl rounded-br-none bg-primary px-4 py-3 text-sm text-white shadow-md shadow-primary/20">
                Thanks, checking it now. The external embedding works?
              </div>
              <span className="text-[10px] text-text-muted pr-1 opacity-0 group-hover:opacity-100 transition-opacity">10:43 AM</span>
            </div>
          </div>

          <div className="flex items-end gap-3 group">
            <div className="h-8 w-8 shrink-0 rounded-full bg-cover bg-center ring-2 ring-surface-dark" style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
            <div className="flex flex-col gap-1 max-w-[85%]">
              <div className="rounded-2xl rounded-bl-none bg-surface-dark px-4 py-3 text-sm text-gray-200 border border-white/5">
                Yes, I can pull directly from external sites now. I think this specific scene demonstrates the "public vulnerability" concept we're researching.
              </div>
              <span className="text-[10px] text-text-muted pl-1 opacity-0 group-hover:opacity-100 transition-opacity">10:44 AM</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-cover bg-center ring-2 ring-surface-dark" style={{ backgroundImage: `url("${avatarUrl}")` }}></div>
            <div className="rounded-2xl rounded-bl-none bg-surface-dark px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 p-4 bg-[#161118]">
          <div className="relative flex items-center gap-2">
            <button className="rounded-full p-2 text-text-muted hover:bg-surface-dark hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px]">add_circle</span>
            </button>
            <div className="relative w-full">
              <input className="w-full rounded-full border-white/10 bg-surface-dark py-3 pl-4 pr-12 text-sm focus:border-primary focus:ring-primary text-white placeholder:text-text-muted/50 transition-shadow" placeholder={`Message ${name}...`} type="text" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px] ml-0.5">send</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};