import { useState, useEffect } from 'react';
import { Shuffle, ArrowRight, Layers, RefreshCw, Sparkles, LogOut, CheckCircle2, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';

interface ElementNode {
  id: string;
  label: string;
}

export default function AdjunctionVisualizer() {
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

  // Collapsible cards state
  const [openCards, setOpenCards] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false
  });

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleCard = (id: number) => {
    setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (activeSpeechText === text) {
        window.speechSynthesis.cancel();
        setActiveSpeechText(null);
      } else {
        window.speechSynthesis.cancel(); // Stop current speech
        const cleanText = text.replace(/[\$\{\}\[\]\(\)]/g, ' '); // Clean mathematical symbols for TTS
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

  // Speech Text Constants
  const PREAMBLE_TEXT = "At its most fundamental level, the entirety of mathematics can be viewed as the dynamic interplay between two dual actions: Free Generation (the Left Adjoint) and Collapse or Forgetfulness (the Right Adjoint). Every structured mathematical system—whether in algebra, topology, or computer science—arises from this universal adjunction (F ⊣ U). Here, we explore this profound duality through the classic adjunction between Sets and Monoids.";
  const SETS_DESC_TEXT = "Discrete elements without structure or binary operations. Plain dots representing the set X.";
  const MONOIDS_DESC_TEXT = "Algebraic structure containing identity (ε) and associative multiplication. Here, F(X) is the free monoid of words over X.";
  const ADJUNCTION_TEXT = "An adjunction asserts a natural isomorphism between the set of monoid homomorphisms out of a free monoid, and the set of plain mappings out of its underlying set of generators. Defining a homomorphism is exactly equivalent to choosing where the raw generators go.";
  const UNIT_COUNIT_DESC_TEXT = "The Unit η_X embeds elements into the free list (x maps to [x]). The Counit ε_M evaluates and collapses a freely generated word of monoid elements into their actual product using the monoid multiplication operation.";

  return (
    <div className="container max-w-5xl mx-auto w-full animate-pop-in px-4">
      
      {/* Title Section */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-2">
          <Shuffle className="text-secondary" /> Free Functors & Adjunctions
        </h2>
        <p className="text-text-muted mt-3 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Adjunctions represent the ultimate translation between raw elements (Sets) and structured spaces (Monoids).
        </p>
      </div>

      {/* Universal Math Core Preamble */}
      <div className="glass-panel p-6 mb-10 border-l-4 border-l-primary/60 bg-gradient-to-r from-slate-900/40 via-slate-950/20 to-slate-900/40">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Sparkles size={14} className="text-accent" /> The Universal Core of Mathematics
          </h3>
          <button
            onClick={() => speakText(PREAMBLE_TEXT)}
            className="p-1.5 rounded-full hover:bg-slate-800/80 text-text-muted hover:text-text-main transition-colors"
            title="Read aloud"
          >
            {activeSpeechText === PREAMBLE_TEXT ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
          At its most fundamental level, the entirety of mathematics can be viewed as the dynamic interplay between two dual actions: <strong>Free Generation</strong> (the Left Adjoint) and <strong>Collapse/Forgetfulness</strong> (the Right Adjoint). 
          Every structured mathematical system—whether in algebra (generating free groups and folding operations), topology (equipping sets with discrete spaces and stripping them down), or computer science (building complex syntax trees and compiling/evaluating them)—arises from this universal adjunction (F ⊣ U). 
          Here, we explore this profound duality through the classic adjunction between Sets and Monoids.
        </p>
      </div>

      {/* Dual Category Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        
        {/* Category C: Sets */}
        <div className="glass-panel p-6 flex flex-col justify-between min-h-[420px] gap-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                Category C <span className="text-xs text-text-muted font-normal">(Sets)</span>
              </h3>
              <div className="flex gap-2">
                <button onClick={addElement} className="btn btn-outline py-1.5 px-3 text-xs font-semibold">
                  + Add Point
                </button>
                <button onClick={clearElements} className="btn btn-outline py-1.5 px-3 text-xs border-red-500/20 text-red-400 hover:bg-red-500/10">
                  Reset
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-start gap-4 mb-4">
              <p className="text-xs text-text-muted leading-relaxed">
                Discrete elements without structure or binary operations. Plain dots representing the set X = {'{'} {setElements.map(e => e.label).join(', ')} {'}'}.
              </p>
              <button
                onClick={() => speakText(SETS_DESC_TEXT)}
                className="p-1 rounded-full hover:bg-slate-800 text-text-muted hover:text-text-main transition-colors flex-shrink-0"
              >
                {activeSpeechText === SETS_DESC_TEXT ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            {/* Set Workspace Canvas */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-8 min-h-[180px] flex items-center justify-center gap-6 flex-wrap relative overflow-hidden mt-2">
              {setElements.length === 0 ? (
                <span className="text-xs text-text-muted">Set is empty. Add a point!</span>
              ) : (
                setElements.map(e => (
                  <div
                    key={e.id}
                    className={`w-14 h-14 rounded-full bg-slate-900 border-2 flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300 ${
                      animationState === 'free' || animationState === 'unit'
                        ? 'border-primary scale-110 shadow-primary/20 animate-pulse'
                        : 'border-slate-700 text-text-main'
                    }`}
                  >
                    {e.label}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={triggerFreeGeneration}
              disabled={setElements.length === 0}
              className="btn btn-primary w-full py-2.5 text-sm font-semibold"
            >
              Generate Structure (Free Functor F) <Sparkles size={16} />
            </button>
            <button
              onClick={triggerUnitMap}
              disabled={setElements.length === 0}
              className="btn btn-outline w-full py-2 text-xs font-semibold"
            >
              Visualize Adjunction Unit (η_X : X → U(F(X)))
            </button>
          </div>
        </div>

        {/* Category D: Monoids */}
        <div className="glass-panel p-6 flex flex-col justify-between min-h-[420px] gap-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                Category D <span className="text-xs text-text-muted font-normal">(Monoids)</span>
              </h3>
              <div className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded text-secondary border border-slate-700">
                Structure: Concatenation
              </div>
            </div>

            <div className="flex justify-between items-start gap-4 mb-4">
              <p className="text-xs text-text-muted leading-relaxed">
                Algebraic structure containing identity (ε) and associative multiplication. Here, F(X) is the free monoid of words over X.
              </p>
              <button
                onClick={() => speakText(MONOIDS_DESC_TEXT)}
                className="p-1 rounded-full hover:bg-slate-800 text-text-muted hover:text-text-main transition-colors flex-shrink-0"
              >
                {activeSpeechText === MONOIDS_DESC_TEXT ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            {/* Monoid Workspace Canvas */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-8 min-h-[180px] flex items-center justify-center gap-4 flex-wrap relative overflow-hidden mt-2">
              {animationState === 'free' && monoidWords.length === 0 && (
                <div className="animate-spin text-primary">
                  <RefreshCw size={24} />
                </div>
              )}
              {monoidWords.length === 0 && animationState !== 'free' && (
                <span className="text-xs text-text-muted">Structure collapsed. No Monoid generated.</span>
              )}
              {monoidWords.length > 0 && (
                <div className="grid grid-cols-3 gap-2 w-full text-center">
                  {monoidWords.map((word, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg bg-slate-900 border text-xs font-mono font-semibold transition-all duration-300 ${
                        animationState === 'forget'
                          ? 'border-red-500/40 text-red-300 scale-90 opacity-50'
                          : 'border-secondary/40 text-secondary'
                      }`}
                    >
                      {word}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={triggerForgetfulCollapse}
              disabled={monoidWords.length === 0}
              className="btn btn-secondary w-full py-2.5 text-sm font-semibold"
            >
              Collapse/Forget Structure (Forgetful Functor U) <LogOut size={16} />
            </button>
            <a href="#counit-workspace" className="btn btn-outline w-full py-2 text-xs font-semibold text-center">
              Visualize Adjunction Counit (ε_M)
            </a>
          </div>
        </div>

      </div>

      {/* Concept Explainer Accordions (Reduces screen crowdedness) */}
      <div className="flex flex-col gap-4 mb-10">
        
        {/* Accordion 1 */}
        <div className="glass-panel overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleCard(1)}
            className="w-full p-5 flex justify-between items-center hover:bg-slate-900/30 transition-colors text-left"
          >
            <span className="font-bold text-sm text-primary">1. Left Adjoint (Free Functor F)</span>
            {openCards[1] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openCards[1] && (
            <div className="p-5 pt-0 border-t border-slate-800/40 animate-slide-down">
              <div className="flex justify-between items-start gap-4 mb-2">
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Takes a raw set of points X in Sets and <em>freely generates</em> the free monoid F(X) containing all lists/words. This is the "least constrained" way to turn a set into a monoid without imposing any arbitrary equations.
                </p>
                <button
                  onClick={() => speakText("Left Adjoint (Free Functor F). Takes a raw set of points X in Sets and freely generates the free monoid F(X) containing all lists/words. This is the least constrained way to turn a set into a monoid without imposing any arbitrary equations.")}
                  className="p-1 rounded-full hover:bg-slate-800 text-text-muted"
                >
                  {activeSpeechText?.includes("Left Adjoint") ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2 */}
        <div className="glass-panel overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleCard(2)}
            className="w-full p-5 flex justify-between items-center hover:bg-slate-900/30 transition-colors text-left"
          >
            <span className="font-bold text-sm text-secondary">2. Right Adjoint (Forgetful U)</span>
            {openCards[2] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openCards[2] && (
            <div className="p-5 pt-0 border-t border-slate-800/40 animate-slide-down">
              <div className="flex justify-between items-start gap-4 mb-2">
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Takes a structured Monoid M in Monoids and strips away the associative operation and identity element, returning the simple underlying set of elements U(M). It represents a loss/collapse of structure.
                </p>
                <button
                  onClick={() => speakText("Right Adjoint (Forgetful U). Takes a structured Monoid M in Monoids and strips away the associative operation and identity element, returning the simple underlying set of elements U(M). It represents a loss or collapse of structure.")}
                  className="p-1 rounded-full hover:bg-slate-800 text-text-muted"
                >
                  {activeSpeechText?.includes("Right Adjoint") ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3 */}
        <div className="glass-panel overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleCard(3)}
            className="w-full p-5 flex justify-between items-center hover:bg-slate-900/30 transition-colors text-left"
          >
            <span className="font-bold text-sm text-accent">3. The Adjunction Duality (F ⊣ U)</span>
            {openCards[3] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openCards[3] && (
            <div className="p-5 pt-0 border-t border-slate-800/40 animate-slide-down">
              <div className="flex justify-between items-start gap-4 mb-2">
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  An adjunction asserts a natural isomorphism hom(F(X), M) ≅ hom(X, U(M)). Defining a monoid homomorphism out of a free monoid is exactly equivalent to choosing where the raw generators go.
                </p>
                <button
                  onClick={() => speakText(ADJUNCTION_TEXT)}
                  className="p-1 rounded-full hover:bg-slate-800 text-text-muted"
                >
                  {activeSpeechText === ADJUNCTION_TEXT ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Adjunction Unit & Counit Visualization Panel */}
      <div id="counit-workspace" className="glass-panel p-8 mb-10 animate-pop-in">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Layers className="text-accent" /> Adjunction Unit (η) and Counit (ε) in Action
            </h3>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              The Unit η_X embeds elements into the free list (x ↦ [x]). The Counit ε_M evaluates and collapses a freely generated word of monoid elements into their actual product using the monoid multiplication operation.
            </p>
          </div>
          <button
            onClick={() => speakText(UNIT_COUNIT_DESC_TEXT)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-text-muted"
          >
            {activeSpeechText === UNIT_COUNIT_DESC_TEXT ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-6">
          {/* Unit Simulation */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6">
            <h4 className="text-sm font-bold mb-3 text-primary flex items-center gap-1.5">
              Unit Mapping (η_X)
            </h4>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Every element in the Set X canonically injects as a singleton word in the Free Monoid F(X).
            </p>
            <div className="flex flex-col gap-2 font-mono text-xs">
              {setElements.map(e => (
                <div key={e.id} className="flex items-center gap-3 bg-slate-900/60 p-2 rounded border border-slate-800/50">
                  <span className="text-primary font-bold">{e.label}</span>
                  <ArrowRight size={12} className="text-text-muted" />
                  <span className="text-secondary font-bold">[{e.label}]</span>
                  <span className="text-text-muted text-[10px] ml-auto">(singleton word)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Counit Simulation */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6">
            <h4 className="text-sm font-bold mb-3 text-accent flex items-center gap-1.5">
              Counit Evaluation (ε_M)
            </h4>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Input a word of monoid elements separated by hyphens (e.g. <code>x-y-z</code>) and click collapse to evaluate the product.
            </p>
            <form onSubmit={handleCounitCollapse} className="flex gap-2 mb-4">
              <input
                type="text"
                value={counitInput}
                onChange={e => setCounitInput(e.target.value)}
                placeholder="x-y-z"
                className="input-text text-sm font-mono"
                required
              />
              <button type="submit" className="btn btn-primary text-xs py-2.5 font-bold whitespace-nowrap">
                Collapse Word
              </button>
            </form>

            {animationState === 'counit' && (
              <div className="animate-pop-in bg-slate-900/60 p-3 rounded border border-accent/20 text-xs flex items-center gap-2">
                {counitResult ? (
                  <span className="text-success font-bold flex items-center gap-1.5 animate-pulse">
                    <CheckCircle2 size={14} /> Product evaluated to: <span className="font-mono text-secondary text-sm ml-1">{counitResult}</span>
                  </span>
                ) : (
                  <span className="text-accent flex items-center gap-2 animate-pulse">
                    <RefreshCw size={14} className="animate-spin" /> Evaluating monoid products...
                  </span>
                )}
              </div>
            )}
          </div>
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
