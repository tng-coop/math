import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Layers, RefreshCw, Sparkles, LogOut, 
  CheckCircle2, Volume2, VolumeX, ChevronLeft, ChevronRight, BookOpen 
} from 'lucide-react';

interface ElementNode {
  id: string;
  label: string;
}

interface TourStop {
  id: number;
  title: string;
  subtitle: string;
  audioText: string;
  explanation: React.ReactNode;
}

export default function AdjunctionVisualizer() {
  const [currentStop, setCurrentStop] = useState<number>(1);
  const [setElements, setSetElements] = useState<ElementNode[]>([
    { id: '1', label: 'x' },
    { id: '2', label: 'y' },
    { id: '3', label: 'z' }
  ]);
  const [monoidWords, setMonoidWords] = useState<string[]>([]);
  const [animationState, setAnimationState] = useState<'idle' | 'free' | 'forget' | 'unit' | 'counit'>('idle');
  const [counitInput, setCounitInput] = useState<string>('x-y-z');
  const [counitResult, setCounitResult] = useState<string | null>(null);

  // Text-to-Speech (TTS) state
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  // Load voices dynamically (handles async voice loading in Chrome/Edge)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter for English voices
      const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
      setVoices(englishVoices);

      // Auto-select the best available premium/natural voice
      const premiumKeywords = ['google', 'natural', 'neural', 'online', 'aria', 'guy'];
      const bestVoice = englishVoices.find(v => 
        premiumKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
      ) || englishVoices[0];

      if (bestVoice) {
        setSelectedVoiceName(bestVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Stop speech when component unmounts or stop changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setActiveSpeechText(null);
    }
  }, [currentStop]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakCurrentStop = (text: string) => {
    if ('speechSynthesis' in window) {
      if (activeSpeechText === text) {
        window.speechSynthesis.cancel();
        setActiveSpeechText(null);
      } else {
        window.speechSynthesis.cancel(); // Stop current speech
        const cleanText = text.replace(/[\$\{\}\[\]\(\)⊣→≅↦]/g, ' '); // Clean mathematical symbols for TTS
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Apply selected voice
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) {
          utterance.voice = voice;
        }

        // Professional museum docent cadence
        utterance.rate = 0.92; // Slightly slower for clarity and premium feel
        utterance.pitch = 1.0;

        utterance.onend = () => setActiveSpeechText(null);
        utterance.onerror = () => setActiveSpeechText(null);
        window.speechSynthesis.speak(utterance);
        setActiveSpeechText(text);
      }
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const addElement = () => {
    const labels = ['x', 'y', 'z', 'w', 'u', 'v', 'a', 'b', 'c'];
    const usedLabels = setElements.map(e => e.label);
    const available = labels.filter(l => !usedLabels.includes(l));
    if (available.length === 0) return;
    
    const nextLabel = available[0];
    const newId = (setElements.length + 1).toString();
    setSetElements([...setElements, { id: newId, label: nextLabel }]);
    setMonoidWords([]);
  };

  const clearElements = () => {
    setSetElements([]);
    setMonoidWords([]);
    setAnimationState('idle');
    setCounitResult(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setActiveSpeechText(null);
    }
  };

  // Functor F: Free Generation
  const triggerFreeGeneration = () => {
    setAnimationState('free');
    setCounitResult(null);
    setTimeout(() => {
      const letters = setElements.map(e => e.label);
      if (letters.length === 0) {
        setMonoidWords(['ε (empty)']);
        return;
      }
      
      const generated: string[] = ['ε']; 
      letters.forEach(l => generated.push(`[${l}]`));
      if (letters.length >= 2) {
        for (let i = 0; i < letters.length - 1; i++) {
          generated.push(`[${letters[i]},${letters[i+1]}]`);
        }
      }
      if (letters.length >= 3) {
        generated.push(`[${letters.slice(0, 3).join(',')}]`);
      }
      
      setMonoidWords(generated);
    }, 800);
  };

  // Functor U: Forgetful
  const triggerForgetfulCollapse = () => {
    setAnimationState('forget');
    setTimeout(() => {
      setMonoidWords([]);
    }, 800);
  };

  // Unit of Adjunction
  const triggerUnitMap = () => {
    setAnimationState('unit');
    triggerFreeGeneration();
  };

  // Counit of Adjunction
  const triggerCounitCollapse = () => {
    setAnimationState('counit');
    const parts = counitInput.split('-');
    const product = parts.join('');
    setTimeout(() => {
      setCounitResult(product);
    }, 1000);
  };

  // Tour stops definitions
  const tourStops: TourStop[] = [
    {
      id: 1,
      title: "I. Gallery Entrance: The Ontological Cycle",
      subtitle: "The absolute nature of mathematical existence.",
      audioText: "Welcome to the Ontology Museum Tour. At its ultimate foundation, mathematics is the structural cycle of Free Generation and Collapse or Quotienting. Every mathematical system is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations and equations. Category Theory is just a part of this, acting as the formal language that represents this ontological cycle. Today, we explore this reality through the classic example of Sets and Monoids.",
      explanation: (
        <div className="placard-text">
          <p>
            Welcome to the <strong>Ontology Gallery</strong>. 
          </p>
          <p>
            At its ultimate foundation, mathematics <strong>is</strong> the structural cycle of <strong>Free Generation</strong> and <strong>Collapse / Quotienting</strong>.
          </p>
          <p>
            Every mathematical object is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations, equations, and quotients. Category Theory is just one formal language that models this ontological duality (through adjoint functors F ⊣ U and the unit and counit).
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "II. Category C: The Sets Domain",
      subtitle: "Plain elements without any operations.",
      audioText: "Stop 2, Category C representing Sets. Here we observe raw entities with no algebraic operations or structural relationships. This set X contains only plain generators. You can click Add Point to populate the set, or Reset to clear it.",
      explanation: (
        <div className="placard-text">
          <p>
            Here we observe Category <strong>C (Sets)</strong>. Elements in this category have no operations, no structures, and no connections. They are raw, discrete points.
          </p>
          <p>
            Let's call this set <strong>X</strong>. Currently, X = {'{'} {setElements.map(e => e.label).join(', ')} {'}'}.
          </p>
          <p>
            In the interactive canvas, you can add raw points or reset the set to experience pure unstructured math.
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "III. Category D: The Realm of Structure",
      subtitle: "Free Monoids and string concatenation.",
      audioText: "Stop 3, Category D representing Monoids. Unlike sets, monoids contain a binary operation and an identity element. We can freely generate a monoid F(X) from our set X. Click Generate Structure to apply the Free Functor F. This creates all possible finite words over our set elements, where the monoid operation is string concatenation.",
      explanation: (
        <div className="placard-text">
          <p>
            We cross over into Category <strong>D (Monoids)</strong>. Monoids contain a binary operation (multiplication) and an identity element (ε).
          </p>
          <p>
            The <strong>Free Functor F</strong> (Left Adjoint) takes our raw set <strong>X</strong> and generates the free monoid <strong>F(X)</strong> containing all finite lists/words.
          </p>
          <p>
            Click the buttons on the workspace to generate this algebraic structure, or collapse it back using the <strong>Forgetful Functor U</strong> (Right Adjoint) to strip the multiplication.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "IV. The Formal Adjunction Bridge (F ⊣ U)",
      subtitle: "Category Theory as a formal language for ontology.",
      audioText: "Stop 4, The Adjunction Duality. The Left Adjoint F and Right Adjoint U form an adjunction, denoted F adjoint to U. This asserts a natural isomorphism between the set of monoid homomorphisms out of a free monoid, and the set of plain mappings out of its underlying set of generators. Defining a homomorphism is exactly equivalent to choosing where the raw generators go.",
      explanation: (
        <div className="placard-text">
          <p>
            The formalization of our ontology: <strong>F is Left Adjoint to U (F ⊣ U)</strong>.
          </p>
          <p>
            This establishes a natural isomorphism:
            <br />
            <span className="font-mono block text-center py-3 bg-slate-950/60 rounded border border-primary/20 my-3 text-primary text-base shadow-inner">
              hom(F(X), M) ≅ hom(X, U(M))
            </span>
          </p>
          <p>
            This means that specifying a structure-preserving monoid homomorphism out of a free monoid <strong>F(X)</strong> is exactly equivalent to choosing where the raw set generators in <strong>X</strong> should map.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "V. Room of Free Inclusion: The Unit (η)",
      subtitle: "Embedding elements as singletons.",
      audioText: "Stop 5, The Adjunction Unit, denoted eta. For any set X, the unit is a natural mapping from X to the underlying set of the free monoid. It embeds each raw element x as a singleton word, containing just that element. Click the unit map button to see the injection in action.",
      explanation: (
        <div className="placard-text">
          <p>
            The Adjunction Unit <strong>η_X : X → U(F(X))</strong> is a natural transformation representing insertion/inclusion.
          </p>
          <p>
            It maps each raw element <strong>x ∈ X</strong> to its singleton word representation <strong>[x]</strong> in the underlying set of the free monoid.
          </p>
          <p>
            Click the Unit mapping visualizer to observe the canonical injection.
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "VI. Room of Quotient Collapse: The Counit (ε)",
      subtitle: "Collapsing syntax under equivalence relations.",
      audioText: "Stop 6, The Adjunction Counit, denoted epsilon. It represents the quotienting action where freely generated syntax collapses into evaluated values. For any Monoid M, the Counit is a monoid homomorphism that collapses a freely generated word of monoid elements into their actual product in M. Enter a hyphenated word in the evaluator and click collapse to see the product evaluate.",
      explanation: (
        <div className="placard-text">
          <p>
            The Adjunction Counit <strong>ε_M : F(U(M)) → M</strong> is a natural transformation representing evaluation or collapse.
          </p>
          <p>
            It takes a freely generated word of monoid elements and collapses it into their actual product using the Monoid's binary operation.
          </p>
          <p>
            Input a hyphenated sequence (e.g. <code>a-b-c</code>) in the evaluator and trigger the Counit collapse to evaluate the product.
          </p>
        </div>
      )
    }
  ];

  const nextStop = () => {
    if (currentStop < tourStops.length) {
      setCurrentStop(currentStop + 1);
    }
  };

  const prevStop = () => {
    if (currentStop > 1) {
      setCurrentStop(currentStop - 1);
    }
  };

  const currentTourStop = tourStops[currentStop - 1];

  const isSpeaking = activeSpeechText === currentTourStop.audioText;

  return (
    <div className="visualizer-container animate-pop-in">
      
      {/* Museum Guide Nav Controller (Audio Guide Device Mock-up) */}
      <div className="audio-guide-player">
        
        {/* Device Brand & Screen */}
        <div className="device-info">
          <div className="device-screen">
            {currentStop}
          </div>
          <div className="device-meta">
            <h4>Ontology Audio Guide</h4>
            <p>Station {currentStop} of {tourStops.length}</p>
          </div>
        </div>

        {/* Dynamic Voice Selection & Playback Controls */}
        <div className="audio-controls-group">
          {voices.length > 0 && (
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="input-text"
              style={{ 
                width: '140px', 
                fontSize: '0.65rem', 
                padding: '4px 8px', 
                height: '24px', 
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: 'var(--primary)',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
            >
              {voices.map((v, i) => (
                <option key={i} value={v.name} style={{ background: '#0b0f19', color: '#fff' }}>
                  {v.name.replace('Microsoft', 'MS').replace('Google', 'G')}
                </option>
              ))}
            </select>
          )}

          <div className="audio-wave">
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          </div>

          <button
            onClick={() => speakCurrentStop(currentTourStop.audioText)}
            className={`btn ${isSpeaking ? 'btn-secondary' : 'btn-primary'}`}
            style={isSpeaking ? { backgroundColor: 'var(--error)', color: 'white', borderColor: 'var(--error)', padding: '4px 12px', height: '24px' } : { padding: '4px 12px', height: '24px' }}
          >
            {isSpeaking ? <VolumeX size={10} /> : <Volume2 size={10} />}
            {isSpeaking ? 'Stop' : 'Play'}
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="device-nav">
          <button
            onClick={prevStop}
            disabled={currentStop === 1}
            className="btn btn-outline"
            title="Previous Room"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="device-nav-text">
            ROOM {currentStop}
          </span>
          <button
            onClick={nextStop}
            disabled={currentStop === tourStops.length}
            className="btn btn-outline"
            title="Next Room"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Museum Exhibit Display */}
      <div className="exhibit-grid">
        
        {/* Left Column: Audio Guide Transcript & Explanations (The Placard Card) */}
        <div className="placard-panel">
          <div>
            <div className="placard-header">
              <BookOpen size={12} />
              <span>Gallery Placard</span>
            </div>
            <h3 className="placard-title">
              {currentTourStop.title}
            </h3>
            <p className="placard-subtitle">
              {currentTourStop.subtitle}
            </p>
            {currentTourStop.explanation}
          </div>

          <div className="placard-footer">
            <span>TNG COOP EXHIBITION</span>
            <span>STATION {currentStop}/6</span>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Exhibit Area (The Kiosk Screen) */}
        <div className="kiosk-panel">
          
          {/* STOP 1: Entrance */}
          {currentStop === 1 && (
            <div className="entrance-display animate-pop-in">
              <div className="entrance-icon-container">
                <Layers size={32} />
              </div>
              <h4>Free Generation & Collapse</h4>
              <p>
                Step inside the interactive exhibits. Click below to enter the Sets gallery room, representing raw mathematical generators.
              </p>
              <button onClick={nextStop} className="btn btn-primary">
                Enter Sets Gallery <ChevronRight size={12} />
              </button>
            </div>
          )}

          {/* STOP 2: Category C Sets */}
          {currentStop === 2 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <div className="workspace-title-bar">
                  <h4 className="workspace-title">Set X Workspace</h4>
                  <div className="workspace-controls">
                    <button onClick={addElement} className="btn btn-primary">
                      + Add Point
                    </button>
                    <button onClick={clearElements} className="btn btn-secondary" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--error)' }}>
                      Reset Set
                    </button>
                  </div>
                </div>
                
                <div className="workspace-canvas">
                  {setElements.length === 0 ? (
                    <span className="empty-state">Set is empty. Add a point!</span>
                  ) : (
                    setElements.map(e => (
                      <div
                        key={e.id}
                        className="set-element floating-node"
                      >
                        {e.label}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="workspace-footer">
                <span>Populate the set and proceed to the Monoid gallery room.</span>
                <button onClick={nextStop} className="btn btn-secondary">
                  Go to Monoids <ChevronRight size={10} />
                </button>
              </div>
            </div>
          )}

          {/* STOP 3: Category D Monoids */}
          {currentStop === 3 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1.5rem' }}>Free Monoid F(X) Workspace</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <button
                    onClick={triggerFreeGeneration}
                    disabled={setElements.length === 0}
                    className="btn btn-primary"
                  >
                    Apply Free Functor (F) <Sparkles size={12} />
                  </button>
                  <button
                    onClick={triggerForgetfulCollapse}
                    disabled={monoidWords.length === 0}
                    className="btn btn-secondary"
                  >
                    Apply Forgetful (U) <LogOut size={12} />
                  </button>
                </div>

                <div className="workspace-canvas">
                  {animationState === 'free' && monoidWords.length === 0 && (
                    <div className="animate-spin" style={{ color: 'var(--primary)' }}>
                      <RefreshCw size={20} />
                    </div>
                  )}
                  {monoidWords.length === 0 && animationState !== 'free' && (
                    <span className="empty-state">Structure collapsed. Apply F to generate monoids.</span>
                  )}
                  {monoidWords.length > 0 && (
                    <div className="monoid-words-grid">
                      {monoidWords.map((word, idx) => (
                        <div key={idx} className="monoid-item floating-node">
                          {word}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STOP 4: Adjunction Bridge */}
          {currentStop === 4 && (
            <div className="animate-pop-in text-center">
              <div className="bridge-box">
                <div className="bridge-term primary">hom(F(X), M)</div>
                <div className="bridge-iso-symbol">≅</div>
                <div className="bridge-term secondary">hom(X, U(M))</div>
              </div>
              <h4 className="bridge-label">Natural Isomorphism Duality</h4>
              <p className="bridge-text">
                Universal property of free monoids. Mapping plain elements to any monoid automatically, uniquely induces a full structure-preserving Monoid Homomorphism out of the Free Monoid.
              </p>
            </div>
          )}

          {/* STOP 5: Unit η */}
          {currentStop === 5 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1.5rem' }}>Unit Mapping (η_X) Simulation</h4>
                <p className="placard-text" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                  Click below to inject the Set generators into the free monoid as singleton words:
                </p>
                <button
                  onClick={triggerUnitMap}
                  disabled={setElements.length === 0}
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '1.5rem' }}
                >
                  Trigger η_X Mapping
                </button>

                <div className="unit-list">
                  {setElements.map(e => (
                    <div key={e.id} className="unit-row">
                      <span className="unit-val-src">{e.label}</span>
                      <ArrowRight size={12} className="text-text-muted" />
                      <span className="unit-val-target">
                        {animationState === 'unit' ? `[${e.label}]` : '?'}
                      </span>
                      <span className="unit-val-desc">
                        {animationState === 'unit' ? 'singleton word' : 'awaiting mapping'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STOP 6: Counit ε */}
          {currentStop === 6 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1.5rem' }}>Quotient Collapse (ε_M)</h4>
                <p className="placard-text" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                  Enter a string of monoid elements separated by hyphens and click to collapse/evaluate their binary product:
                </p>
                <form onSubmit={handleCounitCollapse} className="counit-form">
                  <input
                    type="text"
                    value={counitInput}
                    onChange={e => setCounitInput(e.target.value)}
                    placeholder="x-y-z"
                    className="input-text"
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Collapse (ε_M)
                  </button>
                </form>

                {animationState === 'counit' && (
                  <div className="counit-result-box">
                    {counitResult ? (
                      <span className="counit-val-result flex items-center gap-1.5" style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} /> Evaluation Product: <span className="font-mono text-secondary ml-2 text-base">{counitResult}</span>
                      </span>
                    ) : (
                      <span className="counit-loading-text">
                        FOLDING SYNTAX TREES...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );

  function handleCounitCollapse(e: React.FormEvent) {
    e.preventDefault();
    setCounitResult(null);
    triggerCounitCollapse();
  }
}
