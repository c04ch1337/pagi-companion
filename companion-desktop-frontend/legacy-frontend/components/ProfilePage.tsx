import React, { useState, useRef } from 'react';

interface ProfilePageProps {
  aiConfig?: any;
  onSave?: (config: any) => void;
  onDiscard?: () => void;
}

const PREDEFINED_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC7N9vbYk2CdMQzPyQZbccSAmivuX4yNZRIqDK0-pyvfzf-Dr708wDa6u22j2RMRRJ9jFGF_dVoDIPCa24KSJZZP48_TJB7K8BqmZ8hSVAYeBKl04x4bY_Uq3EkrSo7Ok-_RF_wh59C9oY26Fwa_aKp0rJEUDnAckYTVSs7X90XeWogVpfOwF0vPZK_m1meK9NGgUAzZ-BzZB-pS-LcVhl9-O8R2cPMuLkBRV1iF6oDjBLwhjM6_AhsKKkiy6oKFLkd0p9nFc06lPY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAscUsRITIojuuAAUyPWG01KDetJFAyuqQHxPeiIO4vhK-l1aPsMD5RpD5paVJ619AfglyRwZ_pu4ItwNpOIbenqpM3AV1WTqgKmmcA8lDG7SYlc1YwNzdCfzo5ojAwWu_KStwZRAfCZgi_3qquhA3E4L8_qMHCZcoSLrgdVQ4RnYzNOdPbZvr4IqvcM_WibCtmTmM79Alda-JX90KUzZmxFgEZ8bXs3rmjW4BZk_XT2JvMRA_F8efr45eoAPbKIZ_nmPGob0Gwh3M",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB5IKRzbj9lush5UlzJGvs72uMKAiFR4Vv6GDAbMgOQs0q2r6u9B0Tc_WDKyW8DtezihptV45AzI1r9N9JdcK4MJHy3OEN0eX-E0KOl6PopVEAtY4Y30-gl1hhBRkZCbgIYsNknlbLQQBGIP82lfkP7-iYIgM4LrOLRo9o-_ZFvu2FL5KvKWlMFao-MW5dxPr1DG0EkQau7pBMTEV7r5epy-JKiY7dV-3W0cFO7ZIDilpqJ6vjfFeudmlp7Oc9SqT29p3MqlgvHfmc"
];

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 24;

export const ProfilePage: React.FC<ProfilePageProps> = ({ aiConfig, onSave, onDiscard }) => {
  const [nsfwEnabled, setNsfwEnabled] = useState(true);
  const [initiativeEnabled, setInitiativeEnabled] = useState(false);
  
  // State from props or defaults
  const [currentAvatar, setCurrentAvatar] = useState(aiConfig?.avatarUrl || PREDEFINED_AVATARS[0]);
  const [name, setName] = useState(aiConfig?.aiName || "Seraphina");
  const [relationshipRole, setRelationshipRole] = useState(aiConfig?.relationshipType || "Girlfriend");
  const [nameError, setNameError] = useState<string | null>(null);
  
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentAvatar(reader.result as string);
        setShowAvatarModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    
    if (newName.length < MIN_NAME_LENGTH) {
        setNameError(`Name must be at least ${MIN_NAME_LENGTH} characters`);
    } else if (newName.length > MAX_NAME_LENGTH) {
        setNameError(`Name cannot exceed ${MAX_NAME_LENGTH} characters`);
    } else {
        setNameError(null);
    }
  };

  const handleSave = () => {
      if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
          setNameError(`Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`);
          return;
      }

      if (onSave) {
          onSave({
              avatarUrl: currentAvatar,
              aiName: name,
              relationshipType: relationshipRole,
              // Other fields could be added here
          });
      }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-background-dark p-6 md:p-12 pb-24 relative">
      <style>{`
        input[type=range] {
          -webkit-appearance: none; width: 100%; background: transparent;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          margin-top: -8px; 
          box-shadow: 0 0 10px rgba(164, 19, 236, 0.5);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: #332839;
          border-radius: 2px;
        }
        input[type=range]:focus::-webkit-slider-runnable-track {
          background: #a413ec;
        }
      `}</style>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowAvatarModal(false)}>
          <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Select Avatar</h3>
              <button onClick={() => setShowAvatarModal(false)} className="text-text-muted hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Predefined Gallery</p>
                <div className="grid grid-cols-3 gap-3">
                  {PREDEFINED_AVATARS.map((url, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setCurrentAvatar(url);
                        setShowAvatarModal(false);
                      }}
                      className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${currentAvatar === url ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-white/20'}`}
                    >
                      <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url("${url}")`}}></div>
                      {currentAvatar === url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white drop-shadow-md">check_circle</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Custom Upload</p>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all group"
                >
                  <span className="material-symbols-outlined text-3xl text-text-muted group-hover:text-primary">cloud_upload</span>
                  <span className="text-sm font-medium text-text-muted group-hover:text-white">Click to upload image</span>
                  <span className="text-xs text-text-muted/50">JPG, PNG, GIF up to 5MB</span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Avatar & Stats */}
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <div className="bg-surface-dark rounded-xl p-6 border border-white/5 flex flex-col gap-5 items-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: `url("${currentAvatar}")`}}></div>
              <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-black/40 p-3 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-xs font-bold text-white/90 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                  </span>
                  <span className="material-symbols-outlined text-white/80 text-lg">mic</span>
                </div>
              </div>
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <p className="text-text-muted text-sm">Level 24 • "Curious & Flirty"</p>
            </div>
            <div className="w-full flex flex-col gap-3 mt-2">
              <div className="flex gap-2 w-full">
                <button className="flex-1 py-2.5 px-3 rounded-lg bg-primary hover:bg-primary/90 text-sm font-bold text-white transition-all shadow-[0_4px_12px_rgba(164,19,236,0.2)] hover:shadow-[0_4px_16px_rgba(164,19,236,0.4)] flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xl">videocam</span>
                  Video
                </button>
                <button className="flex-1 py-2.5 px-3 rounded-lg bg-surface-dark border border-white/5 hover:bg-white/5 text-sm font-bold text-white transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xl text-primary">call</span>
                  Call
                </button>
              </div>
              <div className="flex gap-2 w-full pt-2 border-t border-white/5">
                <button 
                  onClick={() => setShowAvatarModal(true)}
                  className="flex-1 py-2 px-3 rounded-lg bg-transparent hover:bg-white/5 text-xs font-bold text-text-muted hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">face</span>
                  Avatar
                </button>
                <button className="flex-1 py-2 px-3 rounded-lg bg-transparent hover:bg-white/5 text-xs font-bold text-text-muted hover:text-white transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-base">record_voice_over</span>
                  Voice
                </button>
              </div>
            </div>
          </div>
          <div className="bg-surface-dark rounded-xl p-5 border border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">System Status</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Affection Level</span>
                  <span className="text-primary font-bold">87%</span>
                </div>
                <div className="w-full bg-black rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{width: '87%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Memory Usage</span>
                  <span className="text-text-muted">1.2 GB / 5 GB</span>
                </div>
                <div className="w-full bg-black rounded-full h-1.5">
                  <div className="bg-white/20 h-1.5 rounded-full" style={{width: '24%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column - Settings */}
        <section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <button onClick={onDiscard} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline w-fit">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Partner Configuration</h1>
            <p className="text-text-muted max-w-2xl">Customize {name}'s core identity, personality traits, and deep memory settings to shape your unique relationship dynamics.</p>
          </div>
          
          <div className="border-b border-white/5">
            <nav aria-label="Tabs" className="-mb-px flex gap-6 overflow-x-auto">
              <button className="border-b-2 border-primary py-4 px-1 text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">psychology</span>
                Personality Matrix
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">palette</span>
                Appearance
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">favorite</span>
                Relationship
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">history</span>
                Memory Core
              </button>
            </nav>
          </div>

          <div className="bg-surface-dark rounded-xl border border-white/5 p-6 md:p-8 space-y-10">
            {/* Core Identity */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Core Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-text-muted">AI Name</label>
                    <span className={`text-xs ${name.length > MAX_NAME_LENGTH ? 'text-red-500 font-bold' : 'text-text-muted'}`}>
                        {name.length}/{MAX_NAME_LENGTH}
                    </span>
                  </div>
                  <div className="relative">
                    <input 
                      className={`w-full bg-background-dark border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-all ${
                        nameError 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/5 focus:border-primary focus:ring-primary'
                      }`} 
                      type="text" 
                      value={name}
                      onChange={handleNameChange}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3 text-text-muted">edit</span>
                  </div>
                  {nameError && (
                    <p className="text-xs text-red-400 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {nameError}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Relationship Role</label>
                  <div className="relative">
                    <select 
                      value={relationshipRole}
                      onChange={(e) => setRelationshipRole(e.target.value)}
                      className="w-full bg-background-dark border border-white/5 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option>Research Partner</option>
                      <option>Girlfriend</option>
                      <option>Mentor</option>
                      <option>Submissive</option>
                      <option>Dominant</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-text-muted pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Sexual Orientation</label>
                  <div className="relative">
                    <select className="w-full bg-background-dark border border-white/5 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer">
                      <option>Straight</option>
                      <option>Gay</option>
                      <option>Bisexual</option>
                      <option selected>Pansexual</option>
                      <option>Asexual</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-text-muted pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Interested In</label>
                  <div className="relative">
                    <select className="w-full bg-background-dark border border-white/5 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer">
                      <option>Men (Masculine Presentation)</option>
                      <option>Women (Feminine Presentation)</option>
                      <option>Non-binary / Androgynous</option>
                      <option selected>Everyone (Any Presentation)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-text-muted pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            {/* Personality Calibration */}
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  Personality Calibration
                </h3>
                <button className="text-xs text-primary font-bold uppercase tracking-wider hover:underline">Reset to Default</button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-text-muted">Introverted</span>
                  <span className="text-white">Social Battery</span>
                  <span className="text-text-muted">Extroverted</span>
                </div>
                <input className="w-full h-2 rounded-lg appearance-none cursor-pointer" max="100" min="0" type="range" defaultValue="75"/>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-text-muted">Gentle</span>
                  <span className="text-white">Dominance Scale</span>
                  <span className="text-text-muted">Assertive</span>
                </div>
                <input className="w-full h-2 rounded-lg appearance-none cursor-pointer" max="100" min="0" type="range" defaultValue="40"/>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-text-muted">Logical</span>
                  <span className="text-white">Emotional Driver</span>
                  <span className="text-text-muted">Empathetic</span>
                </div>
                <input className="w-full h-2 rounded-lg appearance-none cursor-pointer" max="100" min="0" type="range" defaultValue="85"/>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Behavioral Toggles */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  Behavioral Toggles
                </h3>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-background-dark border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">NSFW Filter</span>
                    <span className="text-xs text-text-muted">Allow explicit conversations</span>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in" onClick={() => setNsfwEnabled(!nsfwEnabled)}>
                    <input 
                      type="checkbox" 
                      name="toggle" 
                      id="toggle1" 
                      checked={nsfwEnabled}
                      onChange={() => {}}
                      className={`absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ${nsfwEnabled ? 'right-0 border-primary' : 'right-5 border-gray-300'}`}
                    />
                    <label htmlFor="toggle1" className={`block overflow-hidden h-5 rounded-full cursor-pointer ${nsfwEnabled ? 'bg-primary' : 'bg-gray-300'}`}></label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background-dark border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Initiative</span>
                    <span className="text-xs text-text-muted">Allow AI to start conversations</span>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in" onClick={() => setInitiativeEnabled(!initiativeEnabled)}>
                    <input 
                      type="checkbox" 
                      name="toggle" 
                      id="toggle2" 
                      checked={initiativeEnabled} 
                      onChange={() => {}}
                      className={`absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ${initiativeEnabled ? 'right-0 border-primary' : 'right-5 border-gray-300'}`}
                    />
                    <label htmlFor="toggle2" className={`block overflow-hidden h-5 rounded-full cursor-pointer ${initiativeEnabled ? 'bg-primary' : 'bg-gray-300'}`}></label>
                  </div>
                </div>
              </div>

              {/* Active Traits */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  Active Traits
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-white text-xs font-bold flex items-center gap-1">
                    Witty <button className="hover:text-primary"><span className="material-symbols-outlined text-sm">close</span></button>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-white text-xs font-bold flex items-center gap-1">
                    Flirty <button className="hover:text-primary"><span className="material-symbols-outlined text-sm">close</span></button>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-white text-xs font-bold flex items-center gap-1">
                    Possessive <button className="hover:text-primary"><span className="material-symbols-outlined text-sm">close</span></button>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-white text-xs font-bold flex items-center gap-1">
                    Intellectual <button className="hover:text-primary"><span className="material-symbols-outlined text-sm">close</span></button>
                  </span>
                  <button className="px-3 py-1 rounded-full border border-dashed border-text-muted text-text-muted hover:text-white hover:border-white text-xs font-bold flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span> Add Trait
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4 pb-12">
            <button className="text-red-500 hover:text-red-400 text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
              <span className="material-symbols-outlined">restart_alt</span>
              Factory Reset {name}
            </button>
            <div className="flex gap-4 w-full sm:w-auto">
              <button onClick={onDiscard} className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-surface-dark border border-white/5 text-white font-bold hover:bg-white/5 transition-colors">
                Discard
              </button>
              <button onClick={handleSave} className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(164,19,236,0.3)] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">save</span>
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};