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
      title: "1. Gallery Entrance: The Ontology of Mathematics",
      subtitle: "The absolute cycle of syntax and relations.",
      audioText: "Welcome to the Adjunction Museum Tour. At its ultimate foundation, mathematics is the structural cycle of Free Generation and Collapse or Quotienting. Every mathematical system is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations and equations. Category Theory later formalized this absolute truth through Adjoint Functors and the duality of Unit and Counit. Today, we explore this universal reality through the classic adjunction between Sets and Monoids.",
      explanation: (
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-text-muted">
          <p>
            Welcome to the <strong>Adjunction Museum Tour</strong>. 
          </p>
          <p>
            At its ultimate foundation, mathematics <strong>is</strong> the structural cycle of <strong>Free Generation</strong> and <strong>Collapse / Quotienting</strong>.
          </p>
          <p>
            Every mathematical object is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations and equations. Category Theory later formalized this absolute truth through Adjoint Functors (F ⊣ U) and the duality of Unit and Counit.
          </p>
          <p className="text-xs border-l-2 border-accent/40 pl-3 italic text-text-muted mt-2">
            Use the controller above to play the Audio Guide and navigate through the gallery rooms!
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "2. Category C: The Sets Domain",
      subtitle: "Plain elements without any operations.",
      audioText: "Stop 2, Category C representing Sets. Here we observe raw entities with no algebraic operations or structural relationships. This set X contains only plain generators. You can click Add Point to populate the set, or Reset to clear it.",
      explanation: (
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-text-muted">
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
      title: "3. Category D: The Realm of Structure",
      subtitle: "Free Monoids and string concatenation.",
      audioText: "Stop 3, Category D representing Monoids. Unlike sets, monoids contain a binary operation and an identity element. We can freely generate a monoid F(X) from our set X. Click Generate Structure to apply the Free Functor F. This creates all possible finite words over our set elements, where the monoid operation is string concatenation.",
      explanation: (
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-text-muted">
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
      title: "4. The Adjunction Bridge (F ⊣ U)",
      subtitle: "The natural isomorphism of mapping.",
      audioText: "Stop 4, The Adjunction Duality. The Left Adjoint F and Right Adjoint U form an adjunction, denoted F adjoint to U. This asserts a natural isomorphism between the set of monoid homomorphisms out of a free monoid, and the set of plain mappings out of its underlying set of generators. Defining a homomorphism is exactly equivalent to choosing where the raw generators go.",
      explanation: (
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-text-muted">
          <p>
            The core mathematical duality: <strong>F is Left Adjoint to U (F ⊣ U)</strong>.
          </p>
          <p>
            This establishes a natural isomorphism:
            <br />
            <span className="font-mono block text-center py-2 bg-slate-900/60 rounded border border-slate-800 my-2 text-accent">
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
      title: "5. Room of Inclusion: The Unit (η)",
      subtitle: "Embedding elements as singletons.",
      audioText: "Stop 5, The Adjunction Unit, denoted eta. For any set X, the unit is a natural mapping from X to the underlying set of the free monoid. It embeds each raw element x as a singleton word, containing just that element. Click the unit map button to see the injection in action.",
      explanation: (
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-text-muted">
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
      title: "6. Room of Reduction: The Counit (ε)",
      subtitle: "Collapsing syntax into actual evaluation.",
      audioText: "Stop 6, The Adjunction Counit, denoted epsilon. For any Monoid M, the Counit is a monoid homomorphism that collapses a freely generated word of monoid elements into their actual product in M. Enter a hyphenated word in the evaluator and click collapse to see the product evaluate.",
      explanation: (
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-text-muted">
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

  return (
    <div className="container max-w-5xl mx-auto w-full animate-pop-in px-4">
      
      {/* Museum Guide Nav Controller */}
      <div className="glass-panel p-5 mb-10 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
            {currentStop}
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide">ADJUNCTION AUDIO TOUR</h4>
            <p className="text-xs text-text-muted font-mono">Room {currentStop} of {tourStops.length}</p>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => speakCurrentStop(currentTourStop.audioText)}
            className={`btn flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all duration-300 ${
              activeSpeechText === currentTourStop.audioText
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20'
            }`}
          >
            {activeSpeechText === currentTourStop.audioText ? (
              <>
                <VolumeX size={16} /> Stop Audio Guide
              </>
            ) : (
              <>
                <Volume2 size={16} /> Play Audio Guide
              </>
            )}
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevStop}
            disabled={currentStop === 1}
            className="btn btn-outline p-2 rounded-full"
            title="Previous Room"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-semibold font-mono w-20 text-center text-text-muted">
            Station {currentStop}
          </span>
          <button
            onClick={nextStop}
            disabled={currentStop === tourStops.length}
            className="btn btn-outline p-2 rounded-full"
            title="Next Room"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Museum Exhibit Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-stretch">
        
        {/* Left Column: Audio Guide Transcript & Explanations */}
        <div className="lg:col-span-5 glass-panel p-6 flex flex-col justify-between min-h-[380px] bg-slate-900/20">
          <div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <BookOpen size={16} />
              <span className="text-xs font-bold font-mono uppercase tracking-widest text-primary/80">Exhibit Information</span>
            </div>
            <h3 className="text-xl font-extrabold text-text-main mb-2">
              {currentTourStop.title}
            </h3>
            <p className="text-xs text-text-muted mb-6 font-semibold italic">
              {currentTourStop.subtitle}
            </p>
            {currentTourStop.explanation}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-text-muted font-mono">
            <span>TNG Coop Math Museum</span>
            <span>Room {currentStop}/6</span>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Exhibit Area */}
        <div className="lg:col-span-7 glass-panel p-8 flex flex-col justify-center min-h-[380px]">
          
          {/* STOP 1: Entrance */}
          {currentStop === 1 && (
            <div className="text-center p-6 max-w-md mx-auto animate-pop-in">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary mb-6 animate-pulse">
                <Layers size={36} />
              </div>
              <h4 className="text-lg font-bold mb-3 text-primary font-mono">Sets and Monoids (F ⊣ U)</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Step inside the interactive exhibits. Click next to enter the Category C Sets workspace, where we generate raw elements before creating structure.
              </p>
              <button onClick={nextStop} className="btn btn-primary mt-6 text-xs font-bold py-2 px-4 rounded-full">
                Enter Sets Gallery <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          )}

          {/* STOP 2: Category C Sets */}
          {currentStop === 2 && (
            <div className="animate-pop-in flex flex-col justify-between h-full gap-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm text-primary uppercase font-mono">Set X Workspace</h4>
                  <div className="flex gap-2">
                    <button onClick={addElement} className="btn btn-outline py-1 px-2.5 text-[10px] font-semibold">
                      + Add Point
                    </button>
                    <button onClick={clearElements} className="btn btn-outline py-1 px-2.5 text-[10px] border-red-500/20 text-red-400 hover:bg-red-500/10">
                      Reset
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-8 min-h-[160px] flex items-center justify-center gap-6 flex-wrap mt-2">
                  {setElements.length === 0 ? (
                    <span className="text-xs text-text-muted">Set is empty. Add a point!</span>
                  ) : (
                    setElements.map(e => (
                      <div
                        key={e.id}
                        className="w-14 h-14 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-lg font-bold shadow-lg"
                      >
                        {e.label}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-800/60 flex justify-between items-center">
                <span className="text-xs text-text-muted">Populate the set and click next stop to generate structure.</span>
                <button onClick={nextStop} className="btn btn-primary text-xs font-bold py-1.5 px-3 rounded-full">
                  Go to Monoids <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* STOP 3: Category D Monoids */}
          {currentStop === 3 && (
            <div className="animate-pop-in flex flex-col justify-between h-full gap-6">
              <div>
                <h4 className="font-bold text-sm text-secondary uppercase font-mono mb-4">Free Monoid F(X) Workspace</h4>
                
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    onClick={triggerFreeGeneration}
                    disabled={setElements.length === 0}
                    className="btn btn-primary w-full py-2 text-xs font-semibold"
                  >
                    Apply Free Functor (F) <Sparkles size={14} className="ml-1" />
                  </button>
                  <button
                    onClick={triggerForgetfulCollapse}
                    disabled={monoidWords.length === 0}
                    className="btn btn-secondary w-full py-2 text-xs font-semibold"
                  >
                    Apply Forgetful Functor (U) <LogOut size={14} className="ml-1" />
                  </button>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-8 min-h-[140px] flex items-center justify-center gap-4 flex-wrap">
                  {animationState === 'free' && monoidWords.length === 0 && (
                    <div className="animate-spin text-primary">
                      <RefreshCw size={24} />
                    </div>
                  )}
                  {monoidWords.length === 0 && animationState !== 'free' && (
                    <span className="text-xs text-text-muted text-center">Structure collapsed. Apply F to generate monoids.</span>
                  )}
                  {monoidWords.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 w-full text-center">
                      {monoidWords.map((word, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-secondary/40 text-xs font-mono font-semibold text-secondary">
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
              <div className="inline-flex items-center gap-6 bg-slate-950/40 border border-slate-800 p-6 rounded-2xl mb-6">
                <div className="px-4 py-2 bg-slate-900 border border-primary/30 rounded text-xs font-mono font-bold text-primary">
                  hom(F(X), M)
                </div>
                <div className="text-accent font-bold">
                  ≅
                </div>
                <div className="px-4 py-2 bg-slate-900 border border-secondary/30 rounded text-xs font-mono font-bold text-secondary">
                  hom(X, U(M))
                </div>
              </div>
              <h4 className="text-sm font-bold mb-2 text-accent uppercase font-mono">Natural Isomorphism Duality</h4>
              <p className="text-xs text-text-muted leading-relaxed max-w-sm mx-auto">
                Universal property of free monoids. Mapping plain elements to any monoid automatically, uniquely induces a full structure-preserving Monoid Homomorphism out of the Free Monoid.
              </p>
            </div>
          )}

          {/* STOP 5: Unit η */}
          {currentStop === 5 && (
            <div className="animate-pop-in flex flex-col justify-between h-full gap-6">
              <div>
                <h4 className="font-bold text-sm text-primary uppercase font-mono mb-4">Unit Mapping (η_X) Simulation</h4>
                <p className="text-xs text-text-muted mb-4 leading-relaxed">
                  Click below to inject the Set generators into the free monoid as singleton words:
                </p>
                <button
                  onClick={triggerUnitMap}
                  disabled={setElements.length === 0}
                  className="btn btn-outline w-full py-2 text-xs font-semibold mb-6"
                >
                  Trigger η_X Mapping
                </button>

                <div className="flex flex-col gap-2 font-mono text-xs">
                  {setElements.map(e => (
                    <div key={e.id} className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                      <span className="text-primary font-bold">{e.label}</span>
                      <ArrowRight size={12} className="text-text-muted" />
                      <span className="text-secondary font-bold transition-all duration-500 scale-105">
                        {animationState === 'unit' ? `[${e.label}]` : '?'}
                      </span>
                      <span className="text-text-muted text-[10px] ml-auto">
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
                <h4 className="font-bold text-sm text-accent uppercase font-mono mb-4">Counit Evaluation (ε_M)</h4>
                <p className="text-xs text-text-muted mb-4 leading-relaxed">
                  Enter a string of monoid elements separated by hyphens and click to collapse/evaluate their binary product:
                </p>
                <form onSubmit={handleCounitCollapse} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={counitInput}
                    onChange={e => setCounitInput(e.target.value)}
                    placeholder="x-y-z"
                    className="input-text text-sm font-mono flex-grow"
                    required
                  />
                  <button type="submit" className="btn btn-primary text-xs py-2 px-4 font-bold whitespace-nowrap">
                    Collapse (ε_M)
                  </button>
                </form>

                {animationState === 'counit' && (
                  <div className="animate-pop-in bg-slate-900 border border-accent/20 p-4 rounded-xl text-xs flex items-center justify-center gap-2 min-h-[60px]">
                    {counitResult ? (
                      <span className="text-success font-bold flex items-center gap-1.5 animate-pulse text-sm">
                        <CheckCircle2 size={16} /> Evaluation Product: <span className="font-mono text-secondary ml-1">{counitResult}</span>
                      </span>
                    ) : (
                      <span className="text-accent flex items-center gap-2 animate-pulse font-mono">
                        <RefreshCw size={14} className="animate-spin" /> folding/evaluating syntax...
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
