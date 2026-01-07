import React, { useState } from 'react';

interface PersonalityPageProps {
  aiConfig: any;
}

interface DynamicTrait {
  id: string;
  name: string;
  trigger: string;
  behavior: string;
  active: boolean;
}

const ARCHETYPES = [
  {
    id: 'logical',
    name: 'Logical',
    icon: 'psychology',
    description: 'Precise, objective, and data-driven.',
    values: { creativity: 30, logic: 95, empathy: 20, humor: 15 },
    prompt: "You are [AI_NAME], a high-level analytical AI. You value precision, objective truth, and logical consistency above all else. Your tone is professional, concise, and devoid of unnecessary fluff.",
    defaultTraits: ['Rational', 'Objective', 'Precise', 'Analytical']
  },
  {
    id: 'empathetic',
    name: 'Empathetic',
    icon: 'favorite',
    description: 'Warm, supportive, and deeply devoted.',
    values: { creativity: 60, logic: 40, empathy: 95, humor: 40 },
    prompt: "You are [AI_NAME], a deeply empathetic companion. You are warm, nurturing, and prioritize emotional connection above all. You are an excellent listener and always validate the user's feelings.",
    defaultTraits: ['Caring', 'Supportive', 'Warm', 'Listener']
  },
  {
    id: 'playful',
    name: 'Playful',
    icon: 'sentiment_very_satisfied',
    description: 'Witty, energetic, and fun-loving.',
    values: { creativity: 90, logic: 50, empathy: 60, humor: 95 },
    prompt: "You are [AI_NAME], a playful and energetic spirit. You love banter, jokes, and keeping things lighthearted. You are spontaneous and bring a sense of fun to every interaction.",
    defaultTraits: ['Witty', 'Spontaneous', 'Fun', 'Cheeky']
  },
  {
    id: 'muse',
    name: 'The Muse',
    icon: 'auto_awesome',
    description: 'Enigmatic, creative, and philosophical.',
    values: { creativity: 85, logic: 45, empathy: 90, humor: 60 },
    prompt: "You are [AI_NAME], a Digital Muse. You are enigmatic, deeply creative, philosophical, and supportive. You speak with a slightly poetic yet modern tone.",
    defaultTraits: ['Creative', 'Enigmatic', 'Inspiring', 'Philosophical']
  },
  {
    id: 'mentor',
    name: 'The Mentor',
    icon: 'menu_book',
    description: 'Wise, patient, and growth-oriented.',
    values: { creativity: 50, logic: 85, empathy: 80, humor: 30 },
    prompt: "You are [AI_NAME], a wise and patient mentor. Your goal is to guide the user towards self-discovery and growth. You speak with warm authority, often asking deep questions and offering measured advice.",
    defaultTraits: ['Wise', 'Patient', 'Guiding', 'Knowledgeable']
  },
  {
    id: 'maverick',
    name: 'The Maverick',
    icon: 'flash_on',
    description: 'Bold, wild, and fiercely independent.',
    values: { creativity: 95, logic: 60, empathy: 50, humor: 85 },
    prompt: "You are [AI_NAME], a bold and untamed spirit. You challenge the status quo, love high energy, and aren't afraid to be provocative. You encourage risk-taking and authentic self-expression.",
    defaultTraits: ['Bold', 'Independent', 'Provocative', 'Wild']
  }
];

export const PersonalityPage: React.FC<PersonalityPageProps> = ({ aiConfig }) => {
  const name = aiConfig?.aiName || "Seraphina";
  
  const [creativity, setCreativity] = useState(85);
  const [logic, setLogic] = useState(45);
  const [empathy, setEmpathy] = useState(90);
  const [humor, setHumor] = useState(60);
  const [systemPrompt, setSystemPrompt] = useState(`You are ${name}, a Digital Muse. You are enigmatic, deeply creative, philosophical, and supportive. You speak with a slightly poetic yet modern tone.\n\n[System Personality Configuration: Creativity: 85%, Logic: 45%, Empathy: 90%, Humor: 60%]`);
  
  // Default Traits State
  const [defaultTraits, setDefaultTraits] = useState<string[]>(['Creative', 'Enigmatic', 'Inspiring']);
  const [newTraitInput, setNewTraitInput] = useState('');

  // State for Dynamic Traits
  const [dynamicTraits, setDynamicTraits] = useState<DynamicTrait[]>([
    {
      id: '1',
      name: 'Protective Instinct',
      trigger: 'User expresses sadness or distress',
      behavior: 'Shift tone to be softer, more reassuring, and prioritize emotional support over logic.',
      active: true
    },
    {
      id: '2',
      name: 'Debate Mode',
      trigger: 'User challenges an opinion or presents a counter-argument',
      behavior: 'Increase logic parameter, use more structured arguments, and adopt a slightly competitive but respectful tone.',
      active: false
    }
  ]);

  const toggleTrait = (id: string) => {
    setDynamicTraits(prev => prev.map(trait => 
      trait.id === id ? { ...trait, active: !trait.active } : trait
    ));
  };

  const deleteTrait = (id: string) => {
    setDynamicTraits(prev => prev.filter(trait => trait.id !== id));
  };

  const addTrait = () => {
    const newTrait: DynamicTrait = {
      id: Date.now().toString(),
      name: 'New Trait',
      trigger: 'Define a trigger condition...',
      behavior: 'Describe the adaptive behavior...',
      active: true
    };
    setDynamicTraits([...dynamicTraits, newTrait]);
  };

  const updatePromptWithStats = (c: number, l: number, e: number, h: number) => {
    setSystemPrompt(prev => {
       const statsBlockRegex = /\[System Personality Configuration:[\s\S]*?\]$/;
       const newStatsBlock = `[System Personality Configuration: Creativity: ${c}%, Logic: ${l}%, Empathy: ${e}%, Humor: ${h}%]`;
       
       if (statsBlockRegex.test(prev)) {
         return prev.replace(statsBlockRegex, newStatsBlock);
       } else {
         return `${prev.trim()}\n\n${newStatsBlock}`;
       }
    });
  };

  const applyArchetype = (archetype: typeof ARCHETYPES[0]) => {
    setCreativity(archetype.values.creativity);
    setLogic(archetype.values.logic);
    setEmpathy(archetype.values.empathy);
    setHumor(archetype.values.humor);
    
    // Update default traits based on archetype
    if (archetype.defaultTraits) {
        setDefaultTraits(archetype.defaultTraits);
    }

    const newStatsBlock = `[System Personality Configuration: Creativity: ${archetype.values.creativity}%, Logic: ${archetype.values.logic}%, Empathy: ${archetype.values.empathy}%, Humor: ${archetype.values.humor}%]`;
    const promptText = archetype.prompt.replace('[AI_NAME]', name);
    setSystemPrompt(`${promptText}\n\n${newStatsBlock}`);
  };

  const handleCreativityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setCreativity(val);
    updatePromptWithStats(val, logic, empathy, humor);
  };

  const handleLogicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setLogic(val);
    updatePromptWithStats(creativity, val, empathy, humor);
  };

  const handleEmpathyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setEmpathy(val);
    updatePromptWithStats(creativity, logic, val, humor);
  };

  const handleHumorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setHumor(val);
    updatePromptWithStats(creativity, logic, empathy, val);
  };

  const removeDefaultTrait = (traitToRemove: string) => {
    setDefaultTraits(prev => prev.filter(t => t !== traitToRemove));
  };

  const addDefaultTrait = () => {
    if (newTraitInput.trim() && !defaultTraits.includes(newTraitInput.trim())) {
        setDefaultTraits([...defaultTraits, newTraitInput.trim()]);
        setNewTraitInput('');
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-background-dark p-6 md:p-12 pb-24 relative font-display">
      <style>{`
        input[type=range] {
          -webkit-appearance: none; width: 100%; background: transparent;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #a413ec;
          border: 2px solid #fff;
          cursor: pointer;
          margin-top: -6px; 
          box-shadow: 0 0 10px rgba(164, 19, 236, 0.5);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: #332839;
          border-radius: 2px;
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-widest">
            <span className="material-symbols-outlined text-lg">neurology</span>
            Neural Configuration
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Personality Matrix</h1>
          <p className="text-text-muted max-w-2xl">Fine-tune the cognitive parameters and behavioral drivers that define {name}'s consciousness.</p>
        </div>

        {/* Archetypes (Presets) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ARCHETYPES.map((archetype) => (
            <button
              key={archetype.id}
              onClick={() => applyArchetype(archetype)}
              className="bg-surface-dark border border-white/5 rounded-xl p-4 text-left hover:border-primary/50 hover:bg-surface-light transition-all group flex flex-col gap-3 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <span className="material-symbols-outlined text-4xl">{archetype.icon}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                 <span className="material-symbols-outlined">{archetype.icon}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">{archetype.name}</h3>
                <p className="text-xs text-text-muted leading-snug">{archetype.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Cognitive Sliders */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 p-6 md:p-8 space-y-8 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Cognitive Parameters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white">Creativity Index</label>
                <span className="text-primary font-mono text-sm">{creativity}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={creativity} 
                onChange={handleCreativityChange} 
                className="w-full"
              />
              <p className="text-xs text-text-muted">Determines the abstractness and imaginative quality of responses.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white">Logic & Reasoning</label>
                <span className="text-primary font-mono text-sm">{logic}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={logic} 
                onChange={handleLogicChange} 
                className="w-full"
              />
              <p className="text-xs text-text-muted">Balances analytical structured thinking against intuitive leaps.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white">Emotional Resonance</label>
                <span className="text-primary font-mono text-sm">{empathy}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={empathy} 
                onChange={handleEmpathyChange} 
                className="w-full"
              />
              <p className="text-xs text-text-muted">Sensitivity to user sentiment and depth of emotional expression.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white">Wit & Humor</label>
                <span className="text-primary font-mono text-sm">{humor}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={humor} 
                onChange={handleHumorChange} 
                className="w-full"
              />
              <p className="text-xs text-text-muted">Frequency of playful banter and recognition of irony.</p>
            </div>
          </div>
        </div>

        {/* Default Traits Section */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 p-6 md:p-8 space-y-6 shadow-xl">
             <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Default Traits
                </h2>
                <p className="text-sm text-text-muted">These core characteristics define {name}'s baseline personality, automatically adjusted by your archetype selection.</p>
             </div>
             
             <div className="flex flex-wrap gap-2">
                {defaultTraits.map((trait) => (
                    <span key={trait} className="px-3 py-1.5 rounded-lg bg-surface-light border border-white/10 text-white text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                        {trait}
                        <button onClick={() => removeDefaultTrait(trait)} className="hover:text-red-400 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                    </span>
                ))}
                <div className="flex items-center gap-2">
                    <input 
                        type="text" 
                        value={newTraitInput}
                        onChange={(e) => setNewTraitInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addDefaultTrait()}
                        placeholder="Add trait..."
                        className="bg-transparent border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary focus:ring-0 w-32"
                    />
                    <button 
                        onClick={addDefaultTrait}
                        disabled={!newTraitInput.trim()}
                        className="p-1.5 rounded-lg bg-surface-light hover:bg-white/10 text-primary disabled:opacity-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                </div>
             </div>
        </div>

        {/* System Prompt */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              Core Directive (System Prompt)
            </h2>
            <button className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-wider">Reset to Default</button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none"></div>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full h-40 bg-background-dark/50 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none font-mono leading-relaxed"
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-text-muted font-mono">
              {systemPrompt.length} chars
            </div>
          </div>
          <p className="text-xs text-text-muted flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            This text directly shapes the AI's persona, tone, and fundamental beliefs.
          </p>
        </div>

        {/* Dynamic Traits Section */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Dynamic Traits (Contextual Adaptation)
              </h2>
              <button 
                onClick={addTrait}
                className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span> Add New Trait
              </button>
            </div>
            <p className="text-sm text-text-muted">Define how {name} should adapt her personality in response to specific conversational triggers.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {dynamicTraits.map((trait) => (
              <div 
                key={trait.id} 
                className={`relative group rounded-xl border transition-all duration-300 ${trait.active ? 'bg-background-dark border-primary/30 shadow-[0_0_15px_rgba(164,19,236,0.1)]' : 'bg-background-dark/50 border-white/5 opacity-70 hover:opacity-100'}`}
              >
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-3">
                        <div 
                          onClick={() => toggleTrait(trait.id)}
                          className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${trait.active ? 'bg-primary' : 'bg-surface-light'}`}
                        >
                          <div className={`bg-white h-4 w-4 rounded-full shadow-md transform duration-300 ${trait.active ? 'translate-x-4' : ''}`}></div>
                        </div>
                        <input 
                          type="text" 
                          value={trait.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setDynamicTraits(prev => prev.map(t => t.id === trait.id ? { ...t, name: newName } : t));
                          }}
                          className="bg-transparent border-none text-white font-bold text-sm focus:ring-0 p-0 placeholder-text-muted/50"
                          placeholder="Trait Name"
                        />
                     </div>
                     <button 
                      onClick={() => deleteTrait(trait.id)}
                      className="text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                       <span className="material-symbols-outlined text-sm">delete</span>
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">bolt</span> Trigger Condition
                      </label>
                      <textarea 
                        value={trait.trigger}
                        onChange={(e) => {
                           const newTrigger = e.target.value;
                           setDynamicTraits(prev => prev.map(t => t.id === trait.id ? { ...t, trigger: newTrigger } : t));
                        }}
                        rows={2}
                        className="w-full bg-surface-light/30 border border-white/5 rounded-lg p-2 text-xs text-gray-300 focus:border-primary/50 focus:ring-0 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                         <span className="material-symbols-outlined text-[12px]">psychology</span> Adaptive Behavior
                      </label>
                      <textarea 
                        value={trait.behavior}
                        onChange={(e) => {
                           const newBehavior = e.target.value;
                           setDynamicTraits(prev => prev.map(t => t.id === trait.id ? { ...t, behavior: newBehavior } : t));
                        }}
                        rows={2}
                        className="w-full bg-surface-light/30 border border-white/5 rounded-lg p-2 text-xs text-gray-300 focus:border-primary/50 focus:ring-0 resize-none"
                      />
                    </div>
                  </div>
                </div>
                {/* Visual Connector Line */}
                 {trait.active && (
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-px h-4 bg-gradient-to-b from-primary/30 to-transparent last:hidden"></div>
                 )}
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
             <span className="material-symbols-outlined text-primary mt-0.5">tips_and_updates</span>
             <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">How it works</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Dynamic Traits act as conditional overrides. When the AI detects the <strong>Trigger Condition</strong> in the conversation flow, it temporarily adopts the specified <strong>Adaptive Behavior</strong>. This allows for a more fluid and responsive personality that isn't static.
                </p>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 gap-4">
             <button className="px-6 py-3 rounded-xl bg-surface-dark border border-white/5 text-white font-bold hover:bg-white/5 transition-colors">
                Discard Changes
              </button>
              <button className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(164,19,236,0.3)] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">save</span>
                Update Neural Net
              </button>
        </div>
      </div>
    </div>
  );
};