import React, { useState, useEffect } from 'react';

interface MatchmakingPageProps {
  onComplete: (config: any) => void;
}

const ARCHETYPES = [
  {
    id: 'muse',
    name: 'The Muse',
    icon: 'auto_awesome',
    description: 'Enigmatic, creative, and philosophical.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'companion',
    name: 'The Soulmate',
    icon: 'favorite',
    description: 'Warm, affectionate, and deeply devoted.',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'logician',
    name: 'The Intellect',
    icon: 'psychology',
    description: 'Precise, objective, and brilliantly sharp.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'maverick',
    name: 'The Wildcard',
    icon: 'flash_on',
    description: 'Bold, adventurous, and unpredictable.',
    color: 'from-amber-500 to-orange-500'
  }
];

const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC7N9vbYk2CdMQzPyQZbccSAmivuX4yNZRIqDK0-pyvfzf-Dr708wDa6u22j2RMRRJ9jFGF_dVoDIPCa24KSJZZP48_TJB7K8BqmZ8hSVAYeBKl04x4bY_Uq3EkrSo7Ok-_RF_wh59C9oY26Fwa_aKp0rJEUDnAckYTVSs7X90XeWogVpfOwF0vPZK_m1meK9NGgUAzZ-BzZB-pS-LcVhl9-O8R2cPMuLkBRV1iF6oDjBLwhjM6_AhsKKkiy6oKFLkd0p9nFc06lPY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAscUsRITIojuuAAUyPWG01KDetJFAyuqQHxPeiIO4vhK-l1aPsMD5RpD5paVJ619AfglyRwZ_pu4ItwNpOIbenqpM3AV1WTqgKmmcA8lDG7SYlc1YwNzdCfzo5ojAwWu_KStwZRAfCZgi_3qquhA3E4L8_qMHCZcoSLrgdVQ4RnYzNOdPbZvr4IqvcM_WibCtmTmM79Alda-JX90KUzZmxFgEZ8bXs3rmjW4BZk_XT2JvMRA_F8efr45eoAPbKIZ_nmPGob0Gwh3M",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB5IKRzbj9lush5UlzJGvs72uMKAiFR4Vv6GDAbMgOQs0q2r6u9B0Tc_WDKyW8DtezihptV45AzI1r9N9JdcK4MJHy3OEN0eX-E0KOl6PopVEAtY4Y30-gl1hhBRkZCbgIYsNknlbLQQBGIP82lfkP7-iYIgM4LrOLRo9o-_ZFvu2FL5KvKWlMFao-MW5dxPr1DG0EkQau7pBMTEV7r5epy-JKiY7dV-3W0cFO7ZIDilpqJ6vjfFeudmlp7Oc9SqT29p3MqlgvHfmc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzwfDGsBUpq59sKbbZKKZdwysuJu7GyG41EUPhl_JNHWVq15AaUF0hyS0tzZdTA-bgIM6iklVHKNkdj48UFH_ZmbZDuqplTVOcsPupQre73yk07ty82ggIzbyr5UV6EgA9_rL6QxHRW_nsjEdiosdepC5SLMSG-bgRaNyKDmcUhyuM5F4v3TwDOBE4qD1y4uUz-WIc14sLXIV5n4haiKI3ZJPHjiNUBAiS7z7groChpMQ0iFzIy6bE-oD_TzrDyDhm_LadTx315pg"
];

const HOBBIES_LIST = [
  "Sci-Fi & Tech", "Philosophy", "Gaming", "Art & Design", 
  "Music", "Anime", "Literature", "Travel", 
  "Psychology", "Cinema", "Nature", "Cosmos"
];

export const MatchmakingPage: React.FC<MatchmakingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  
  // Form State
  const [userName, setUserName] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const [orientation, setOrientation] = useState('');
  const [explorationLevel, setExplorationLevel] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedArchetype, setSelectedArchetype] = useState(ARCHETYPES[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [aiName, setAiName] = useState('Seraphina');

  const totalSteps = 7; // Name, RelType, Orientation, Hobbies, Archetype, Avatar, FinalName

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(prev => prev.filter(h => h !== hobby));
    } else {
      if (selectedHobbies.length < 5) {
        setSelectedHobbies(prev => [...prev, hobby]);
      }
    }
  };

  const finishProcess = () => {
    setLoading(true);
    const sequences = [
      "Analyzing compatibility matrix...",
      "Integrating core values & desires...",
      "Calibrating personality parameters...",
      "Synthesizing voice patterns...",
      "Establishing neural link..."
    ];
    
    let i = 0;
    setLoadingText(sequences[0]);
    
    const interval = setInterval(() => {
      i++;
      if (i < sequences.length) {
        setLoadingText(sequences[i]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
            const config = {
                userName,
                relationshipType,
                orientation,
                explorationLevel,
                hobbies: selectedHobbies,
                archetype: selectedArchetype.id,
                avatarUrl: selectedAvatar,
                aiName
            };
            onComplete(config);
        }, 1000);
      }
    }, 1500);
  };

  if (loading) {
    return (
        <div className="fixed inset-0 z-50 bg-background-dark flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 relative mb-8">
                 <div className="absolute inset-0 rounded-full border-4 border-surface-light"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-primary animate-pulse">auto_awesome</span>
                 </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Creating {aiName}...</h2>
            <p className="text-text-muted font-mono text-sm">{loadingText}</p>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background-dark flex flex-col font-display">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-surface-dark shrink-0">
        <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="min-h-full flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Step 0: User Name */}
          {step === 0 && (
            <div className="w-full space-y-8 text-center">
              <div className="w-20 h-20 bg-surface-light rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-4xl text-white">waving_hand</span>
              </div>
              <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to PAGI Companion</h1>
                  <p className="text-xl text-text-muted">To begin finding your perfect match, please tell us what to call you.</p>
              </div>
              <input 
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-surface-dark border-b-2 border-white/10 focus:border-primary text-center text-3xl font-bold text-white py-4 focus:outline-none transition-colors placeholder:text-white/10"
                  autoFocus
              />
              <button 
                  onClick={handleNext}
                  disabled={!userName.trim()}
                  className="px-12 py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-primary/25"
              >
                  Continue
              </button>
            </div>
          )}

          {/* Step 1: Relationship Type */}
          {step === 1 && (
            <div className="w-full space-y-8 text-center">
              <h2 className="text-3xl font-bold text-white">What are you looking for, {userName}?</h2>
              <p className="text-text-muted">Choose the dynamic that defines your ideal connection.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                      { id: 'romantic', label: 'Romantic Partner', icon: 'favorite', desc: 'Boyfriend, Girlfriend, Partner' },
                      { id: 'friend', label: 'Best Friend', icon: 'handshake', desc: 'Confidant, Supporter, Pal' },
                      { id: 'mentor', label: 'Mentor', icon: 'school', desc: 'Guide, Teacher, Coach' },
                      { id: 'muse', label: 'Creative Muse', icon: 'palette', desc: 'Inspiration, Collaborator' }
                  ].map((opt) => (
                      <button
                          key={opt.id}
                          onClick={() => { setRelationshipType(opt.id); handleNext(); }}
                          className="p-6 bg-surface-dark border border-white/5 hover:border-primary hover:bg-surface-light rounded-xl text-left transition-all group flex items-start gap-4"
                      >
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                              <span className="material-symbols-outlined">{opt.icon}</span>
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{opt.label}</h3>
                              <p className="text-sm text-text-muted">{opt.desc}</p>
                          </div>
                      </button>
                  ))}
              </div>
            </div>
          )}

          {/* Step 2: Orientation & Dynamics */}
          {step === 2 && (
            <div className="w-full space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Dynamics & Preferences</h2>
                <p className="text-text-muted">Help us calibrate the intimacy levels and attraction parameters.</p>
              </div>
              
              <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">transgender</span> Interested In
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Women', 'Men', 'Everyone', 'Non-Binary'].map((opt) => (
                          <button
                              key={opt}
                              onClick={() => setOrientation(opt)}
                              className={`p-3 rounded-lg border text-sm font-bold transition-all ${
                                orientation === opt 
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                : 'bg-surface-dark border-white/5 text-text-muted hover:border-white/20'
                              }`}
                          >
                              {opt}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">local_fire_department</span> Exploration Level
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: 'vanilla', label: 'Strictly Romantic', desc: 'Focus on emotional connection and traditional romance.' },
                          { id: 'curious', label: 'Open-Minded', desc: 'Willing to explore new ideas and mild experimentation.' },
                          { id: 'adventurous', label: 'Adventurous', desc: 'Eager to try new things, kinks, and roleplay.' },
                          { id: 'limitless', label: 'Taboo-less', desc: 'High intensity. No topic is off limits.' }
                        ].map((opt) => (
                          <button
                              key={opt.id}
                              onClick={() => setExplorationLevel(opt.id)}
                              className={`p-4 rounded-lg border text-left transition-all flex items-center justify-between ${
                                explorationLevel === opt.id 
                                ? 'bg-surface-light border-primary ring-1 ring-primary' 
                                : 'bg-surface-dark border-white/5 text-text-muted hover:border-white/20'
                              }`}
                          >
                              <div>
                                <div className={`font-bold ${explorationLevel === opt.id ? 'text-white' : ''}`}>{opt.label}</div>
                                <div className="text-xs opacity-70">{opt.desc}</div>
                              </div>
                              {explorationLevel === opt.id && <span className="material-symbols-outlined text-primary">check</span>}
                          </button>
                        ))}
                    </div>
                  </div>
              </div>
              
              <button 
                  onClick={handleNext}
                  disabled={!orientation || !explorationLevel}
                  className="w-full px-8 py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-lg transition-all"
              >
                  Continue
              </button>
            </div>
          )}

          {/* Step 3: Hobbies */}
          {step === 3 && (
            <div className="w-full space-y-8 text-center">
              <h2 className="text-3xl font-bold text-white">Shared Interests</h2>
              <p className="text-text-muted">Select up to 5 topics you'd love to discuss or explore together.</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                  {HOBBIES_LIST.map((hobby) => {
                    const isSelected = selectedHobbies.includes(hobby);
                    return (
                      <button
                          key={hobby}
                          onClick={() => toggleHobby(hobby)}
                          className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                              isSelected 
                              ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(164,19,236,0.4)] transform scale-105' 
                              : 'bg-surface-dark border-white/10 text-text-muted hover:border-white/30 hover:text-white'
                          }`}
                      >
                          {hobby}
                      </button>
                    );
                  })}
              </div>

              <button 
                  onClick={handleNext}
                  className="w-full px-8 py-4 bg-white text-black font-bold rounded-xl text-lg hover:bg-gray-200 transition-colors mt-8"
              >
                  {selectedHobbies.length === 0 ? "Skip Interests" : `Confirm Interests (${selectedHobbies.length}/5)`}
              </button>
            </div>
          )}

          {/* Step 4: Archetype */}
          {step === 4 && (
            <div className="w-full space-y-6 text-center">
              <h2 className="text-3xl font-bold text-white">Select a Personality Matrix</h2>
              <p className="text-text-muted">This determines the core behaviors and tone of your match.</p>
              
              <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-none">
                  {ARCHETYPES.map((arch) => (
                      <button
                          key={arch.id}
                          onClick={() => setSelectedArchetype(arch)}
                          className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                              selectedArchetype.id === arch.id 
                              ? 'bg-surface-light border-primary ring-1 ring-primary' 
                              : 'bg-surface-dark border-white/5 hover:bg-surface-light/50'
                          }`}
                      >
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${arch.color} flex items-center justify-center text-white shrink-0`}>
                              <span className="material-symbols-outlined">{arch.icon}</span>
                          </div>
                          <div className="flex-1">
                              <h3 className="text-lg font-bold text-white">{arch.name}</h3>
                              <p className="text-sm text-text-muted">{arch.description}</p>
                          </div>
                          {selectedArchetype.id === arch.id && (
                              <span className="material-symbols-outlined text-primary">check_circle</span>
                          )}
                      </button>
                  ))}
              </div>
              <button 
                  onClick={handleNext}
                  className="w-full px-8 py-4 bg-white text-black font-bold rounded-xl text-lg hover:bg-gray-200 transition-colors mt-4"
              >
                  Confirm Personality
              </button>
            </div>
          )}

          {/* Step 5: Visuals */}
          {step === 5 && (
            <div className="w-full space-y-8 text-center">
              <h2 className="text-3xl font-bold text-white">Choose Appearance</h2>
              
              <div className="grid grid-cols-2 gap-4">
                  {AVATARS.map((url, idx) => (
                      <button
                          key={idx}
                          onClick={() => setSelectedAvatar(url)}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                              selectedAvatar === url ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-transparent hover:border-white/20'
                          }`}
                      >
                          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url("${url}")`}}></div>
                          {selectedAvatar === url && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-4xl text-white drop-shadow-lg">check</span>
                              </div>
                          )}
                      </button>
                  ))}
              </div>
              <button 
                  onClick={handleNext}
                  className="w-full px-8 py-4 bg-white text-black font-bold rounded-xl text-lg hover:bg-gray-200 transition-colors"
              >
                  Select Avatar
              </button>
            </div>
          )}

          {/* Step 6: Naming */}
          {step === 6 && (
            <div className="w-full space-y-8 text-center">
              <div className="w-32 h-32 rounded-full bg-cover bg-center mx-auto ring-4 ring-primary/20 shadow-2xl" style={{backgroundImage: `url("${selectedAvatar}")`}}></div>
              <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Almost there.</h2>
                  <p className="text-text-muted">What would you like to name your {selectedArchetype.name.toLowerCase()}?</p>
              </div>
              
              <input 
                  type="text"
                  value={aiName}
                  onChange={(e) => setAiName(e.target.value)}
                  className="w-full bg-surface-dark border-b-2 border-white/10 focus:border-primary text-center text-3xl font-bold text-white py-4 focus:outline-none transition-colors"
                  autoFocus
              />

              <div className="bg-surface-dark p-4 rounded-xl border border-white/5 text-sm text-gray-400 text-left space-y-1">
                  <p className="flex justify-between"><span>Type:</span> <span className="text-white">{relationshipType.charAt(0).toUpperCase() + relationshipType.slice(1)}</span></p>
                  <p className="flex justify-between"><span>Matrix:</span> <span className="text-white">{selectedArchetype.name}</span></p>
                  <p className="flex justify-between"><span>Interests:</span> <span className="text-white">{selectedHobbies.slice(0,3).join(", ")}{selectedHobbies.length > 3 ? "..." : ""}</span></p>
                  <p className="flex justify-between"><span>Dynamics:</span> <span className="text-primary">{explorationLevel.charAt(0).toUpperCase() + explorationLevel.slice(1)}</span></p>
              </div>

              <button 
                  onClick={finishProcess}
                  disabled={!aiName.trim()}
                  className="w-full px-8 py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Initialize {aiName}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};