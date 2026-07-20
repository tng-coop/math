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
        <div className="flex flex-col gap-5 placard-text">
          <p>
            Welcome to the <strong>Ontology Gallery</strong>. 
          </p>
          <p>
            At its ultimate foundation, mathematics <strong>is</strong> the structural cycle of <strong>Free Generation</strong> and <strong>Collapse / Quotienting</strong>.
          </p>
          <p>
            Every mathematical object is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations, equations, and quotients. Category Theory is just one formal language that models this ontological duality (through adjoint functors F ⊣ U and the unit and counit).
          </p>
          <p className="text-xs border-l-2 border-primary/45 pl-3 italic text-text-muted mt-3">
            Use the controller above to play the Audio Guide and navigate through the gallery rooms.
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
        <div className="flex flex-col gap-5 placard-text">
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
        <div className="flex flex-col gap-5 placard-text">
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
        <div className="flex flex-col gap-5 placard-text">
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
        <div className="flex flex-col gap-5 placard-text">
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
        <div className="flex flex-col gap-5 placard-text">
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

  const currentTourStop = tourStops[currentStop - 1];

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

  const isSpeaking = activeSpeechText === currentTourStop.audioText;

  return (
    <div className="h-full w-full max-w-none flex flex-col justify-between p-8 gap-6 overflow-hidden select-none">
      
      {/* Museum Guide Nav Controller (Audio Guide Device Mock-up) */}
      <div className="audio-guide-player p-4 flex flex-col md:flex-row items-center justify-between gap-6 flex-shrink-0">
        
        {/* Device Brand & Screen */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold font-mono text-base shadow-inner">
            {currentStop}
          </div>
          <div>
            <h4 className="font-bold text-[10px] tracking-widest text-primary font-sans uppercase">ONTOLOGY AUDIO GUIDE</h4>
            <p className="text-[9px] text-text-muted font-mono uppercase mt-0.5">Station {currentStop} of {tourStops.length}</p>
          </div>
        </div>

        {/* Audio controls with Animated Waveform */}
        <div className="flex items-center gap-5 bg-slate-950/60 py-1.5 px-5 rounded-full border border-white/5">
          <div className="audio-wave">
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          </div>

          <button
            onClick={() => speakCurrentStop(currentTourStop.audioText)}
            className={`btn flex items-center gap-2 px-5 py-2 text-[10px] font-bold rounded-full transition-all duration-500 tracking-wider ${
              isSpeaking
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                : 'btn-primary shadow-lg shadow-primary/20'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={12} /> Stop Audio
              </>
            ) : (
              <>
                <Volume2 size={12} /> Play Audio
              </>
            )}
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevStop}
            disabled={currentStop === 1}
            className="btn btn-outline p-2 rounded-full border border-primary/20 text-primary hover:bg-primary/10 disabled:opacity-30"
            title="Previous Room"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[10px] font-bold font-mono w-20 text-center text-text-muted tracking-widest">
            ROOM {currentStop}
          </span>
          <button
            onClick={nextStop}
            disabled={currentStop === tourStops.length}
            className="btn btn-outline p-2 rounded-full border border-primary/20 text-primary hover:bg-primary/10 disabled:opacity-30"
            title="Next Room"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Museum Exhibit Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow min-h-0 overflow-hidden items-stretch">
        
        {/* Left Column: Audio Guide Transcript & Explanations (The Placard Card) */}
        <div className="lg:col-span-5 glass-panel p-6 flex flex-col justify-between min-h-0 bg-gradient-to-b from-slate-900/40 to-slate-950/60 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-primary/70 mb-4 border-b border-primary/10 pb-3">
              <BookOpen size={12} />
              <span className="text-[9px] font-bold font-mono uppercase tracking-widest">Gallery Placard</span>
            </div>
            <h3 className="text-lg font-bold text-text-main mb-2 placard-title">
              {currentTourStop.title}
            </h3>
            <p className="text-[10px] text-primary/80 mb-5 font-semibold italic">
              {currentTourStop.subtitle}
            </p>
            {currentTourStop.explanation}
          </div>

          <div className="mt-6 pt-3 border-t border-primary/10 flex items-center justify-between text-[9px] text-text-muted font-mono tracking-widest">
            <span>TNG COOP EXHIBITION</span>
            <span>STATION {currentStop}/6</span>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Exhibit Area (The Kiosk Screen) */}
        <div className="lg:col-span-7 glass-panel p-6 flex flex-col justify-center min-h-0 exhibit-canvas bg-slate-950/50 overflow-hidden">
          
          {/* STOP 1: Entrance */}
          {currentStop === 1 && (
            <div className="text-center p-6 max-w-sm mx-auto animate-pop-in">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto text-primary mb-6 shadow-inner shadow-primary/10">
                <Layers size={32} className="animate-pulse text-primary" />
              </div>
              <h4 className="text-xs font-bold mb-3 text-primary font-mono tracking-wider font-semibold">FREE GENERATION & COLLAPSE</h4>
              <p className="text-[11px] text-text-muted leading-relaxed font-sans max-w-xs mx-auto">
                Step inside the interactive exhibits. Click below to enter the Sets gallery room, representing raw mathematical generators.
              </p>
              <button onClick={nextStop} className="btn btn-primary mt-6 text-[10px] font-bold py-2 px-5 rounded-full">
                Enter Sets Gallery <ChevronRight size={12} className="ml-1" />
              </button>
            </div>
          )}

          {/* STOP 2: Category C Sets */}
          {currentStop === 2 && (
            <div className="animate-pop-in flex flex-col justify-between h-full gap-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-[10px] text-primary uppercase font-mono tracking-widest">Set X Workspace</h4>
                  <div className="flex gap-2">
                    <button onClick={addElement} className="btn btn-primary py-1 px-3 text-[9px] font-bold rounded-full">
                      + Add Point
                    </button>
                    <button onClick={clearElements} className="btn btn-outline py-1 px-3 text-[9px] border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-full">
                      Reset Set
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-6 min-h-[180px] flex items-center justify-center gap-6 flex-wrap mt-2 shadow-inner overflow-y-auto">
                  {setElements.length === 0 ? (
                    <span className="text-xs text-text-muted italic">Set is empty. Add a point!</span>
                  ) : (
                    setElements.map(e => (
                      <div
                        key={e.id}
                        className="w-12 h-12 rounded-full bg-slate-900 border border-primary/45 flex items-center justify-center text-base font-bold shadow-2xl text-primary font-mono floating-node"
                      >
                        {e.label}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-text-muted">
                <span>Populate the set and proceed to the Monoid gallery room.</span>
                <button onClick={nextStop} className="btn btn-secondary text-[9px] font-bold py-1.5 px-3 rounded-full">
                  Go to Monoids <ChevronRight size={10} className="ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STOP 3: Category D Monoids */}
          {currentStop === 3 && (
            <div className="animate-pop-in flex flex-col justify-between h-full gap-6">
              <div>
                <h4 className="font-bold text-[10px] text-secondary uppercase font-mono tracking-widest mb-4">Free Monoid F(X) Workspace</h4>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={triggerFreeGeneration}
                    disabled={setElements.length === 0}
                    className="btn btn-primary py-2 text-[10px] font-bold"
                  >
                    Apply Free Functor (F) <Sparkles size={12} className="ml-1" />
                  </button>
                  <button
                    onClick={triggerForgetfulCollapse}
                    disabled={monoidWords.length === 0}
                    className="btn btn-secondary py-2 text-[10px] font-bold"
                  >
                    Apply Forgetful (U) <LogOut size={12} className="ml-1" />
                  </button>
                </div>

                <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-6 min-h-[140px] flex items-center justify-center gap-3 flex-wrap shadow-inner overflow-y-auto">
                  {animationState === 'free' && monoidWords.length === 0 && (
                    <div className="animate-spin text-primary">
                      <RefreshCw size={20} />
                    </div>
                  )}
                  {monoidWords.length === 0 && animationState !== 'free' && (
                    <span className="text-xs text-text-muted italic text-center">Structure collapsed. Apply F to generate monoids.</span>
                  )}
                  {monoidWords.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 w-full text-center">
                      {monoidWords.map((word, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-secondary/20 text-xs font-mono font-semibold text-secondary shadow-md floating-node">
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
            <div className="animate-pop-in text-center p-4">
              <div className="inline-flex items-center gap-6 bg-slate-950/60 border border-white/5 p-6 rounded-3xl mb-6 shadow-2xl">
                <div className="px-4 py-2 bg-slate-900 border border-primary/20 rounded-xl text-xs font-mono font-bold text-primary shadow-inner">
                  hom(F(X), M)
                </div>
                <div className="text-primary font-bold text-xl animate-pulse">
                  ≅
                </div>
                <div className="px-4 py-2 bg-slate-900 border border-secondary/20 rounded-xl text-xs font-mono font-bold text-secondary shadow-inner">
                  hom(X, U(M))
                </div>
              </div>
              <h4 className="text-[10px] font-bold mb-2 text-primary uppercase font-mono tracking-widest">Natural Isomorphism Duality</h4>
              <p className="text-[11px] text-text-muted leading-relaxed max-w-xs mx-auto font-sans">
                Universal property of free monoids. Mapping plain elements to any monoid automatically, uniquely induces a full structure-preserving Monoid Homomorphism out of the Free Monoid.
              </p>
            </div>
          )}

          {/* STOP 5: Unit η */}
          {currentStop === 5 && (
            <div className="animate-pop-in flex flex-col justify-between h-full gap-6">
              <div>
                <h4 className="font-bold text-[10px] text-primary uppercase font-mono tracking-widest mb-4">Ontological Unit (η_X) Simulation</h4>
                <p className="text-[11px] text-text-muted mb-4 leading-relaxed font-sans">
                  Click below to inject the Set generators into the free monoid as singleton words:
                </p>
                <button
                  onClick={triggerUnitMap}
                  disabled={setElements.length === 0}
                  className="btn btn-primary w-full py-2 text-[10px] font-bold mb-4 rounded-full"
                >
                  Trigger η_X Mapping
                </button>

                <div className="flex flex-col gap-2 font-mono text-[11px] overflow-y-auto max-h-[160px] pr-2">
                  {setElements.map(e => (
                    <div key={e.id} className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-white/5 shadow-md">
                      <span className="text-primary font-bold">{e.label}</span>
                      <ArrowRight size={12} className="text-text-muted" />
                      <span className="text-secondary font-bold transition-all duration-500 scale-105">
                        {animationState === 'unit' ? `[${e.label}]` : '?'}
                      </span>
                      <span className="text-text-muted text-[9px] ml-auto uppercase tracking-wider">
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
            <div className="animate-pop-in flex flex-col justify-between h-full gap-6">
              <div>
                <h4 className="font-bold text-[10px] text-accent uppercase font-mono tracking-widest mb-4 font-semibold">Quotient Collapse (ε_M)</h4>
                <p className="text-[11px] text-text-muted mb-3 leading-relaxed font-sans">
                  Enter a string of monoid elements separated by hyphens and click to collapse/evaluate their binary product:
                </p>
                <form onSubmit={handleCounitCollapse} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={counitInput}
                    onChange={e => setCounitInput(e.target.value)}
                    placeholder="x-y-z"
                    className="input-text text-xs font-mono flex-grow"
                    required
                  />
                  <button type="submit" className="btn btn-primary text-[10px] py-2 px-4 font-bold whitespace-nowrap rounded-xl">
                    Collapse (ε_M)
                  </button>
                </form>

                {animationState === 'counit' && (
                  <div className="animate-pop-in bg-slate-900 border border-primary/10 p-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 min-h-[60px] shadow-inner">
                    {counitResult ? (
                      <span className="text-success font-bold flex items-center gap-1.5 animate-pulse text-[11px]">
                        <CheckCircle2 size={14} /> Evaluation Product: <span className="font-mono text-secondary ml-1 text-xs">{counitResult}</span>
                      </span>
                    ) : (
                      <span className="text-primary flex items-center gap-2 animate-pulse font-mono tracking-widest text-[9px]">
                        <RefreshCw size={12} className="animate-spin" /> FOLDING SYNTAX TREES...
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
