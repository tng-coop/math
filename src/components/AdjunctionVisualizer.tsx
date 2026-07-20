import { useState } from 'react';
import { Shuffle, ArrowRight, Layers, RefreshCw, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';

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

  const addElement = () => {
    const labels = ['x', 'y', 'z', 'w', 'u', 'v', 'a', 'b', 'c'];
    const usedLabels = setElements.map(e => e.label);
    const available = labels.filter(l => !usedLabels.includes(l));
    if (available.length === 0) return;
    
    const nextLabel = available[0];
    const newId = (setElements.length + 1).toString();
    setSetElements([...setElements, { id: newId, label: nextLabel }]);
    // Reset output
    setMonoidWords([]);
  };

  const clearElements = () => {
    setSetElements([]);
    setMonoidWords([]);
    setAnimationState('idle');
    setCounitResult(null);
  };

  // Functor F: Free Generation
  const triggerFreeGeneration = () => {
    setAnimationState('free');
    setCounitResult(null);
    setTimeout(() => {
      // Free Monoid F(X) is the set of all strings/lists over X
      // Let's generate a subset of words in F(X): singletons and doubles
      const letters = setElements.map(e => e.label);
      if (letters.length === 0) {
        setMonoidWords(['ε (empty)']);
        return;
      }
      
      const generated: string[] = ['ε']; // Identity element
      // Singletons: [x], [y]
      letters.forEach(l => generated.push(`[${l}]`));
      // Doubles: [x,y], [y,z]
      if (letters.length >= 2) {
        for (let i = 0; i < letters.length - 1; i++) {
          generated.push(`[${letters[i]},${letters[i+1]}]`);
        }
      }
      // Triple: [x,y,z]
      if (letters.length >= 3) {
        generated.push(`[${letters.slice(0, 3).join(',')}]`);
      }
      
      setMonoidWords(generated);
    }, 800);
  };

  // Functor U: Forgetful (Dissolve structure to underlying Set)
  const triggerForgetfulCollapse = () => {
    setAnimationState('forget');
    setTimeout(() => {
      setMonoidWords([]);
      // We are back to C (Sets), we "forgot" the monoid binary operation and identity
    }, 800);
  };

  // Unit of Adjunction: η_X : X -> U(F(X))
  // Maps x in X to singleton word [x] in the underlying set of F(X)
  const triggerUnitMap = () => {
    setAnimationState('unit');
    triggerFreeGeneration();
  };

  // Counit of Adjunction: ε_M : F(U(M)) -> M
  // Evaluates a word of elements using the Monoid product (concatenation / folding)
  const triggerCounitCollapse = () => {
    setAnimationState('counit');
    const parts = counitInput.split('-');
    const product = parts.join(''); // In the Free Monoid of strings, the product is concatenation
    setTimeout(() => {
      setCounitResult(product);
    }, 1000);
  };

  return (
    <div className="container max-w-5xl mx-auto w-full animate-pop-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-2">
          <Shuffle className="text-secondary" /> Free Functors & Adjunctions
        </h2>
        <p className="text-text-muted mt-2 text-sm sm:text-base max-w-xl mx-auto">
          Adjunctions represent the ultimate translation between raw elements (Sets) and structured spaces (Monoids).
        </p>
      </div>

      {/* Dual Category Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Category C: Sets */}
        <div className="glass-panel p-6 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                Category C <span className="text-xs text-text-muted font-normal">(Sets)</span>
              </h3>
              <div className="flex gap-2">
                <button onClick={addElement} className="btn btn-outline py-1.5 px-3 text-xs">
                  + Add Point
                </button>
                <button onClick={clearElements} className="btn btn-outline py-1.5 px-3 text-xs border-red-500/20 text-red-400 hover:bg-red-500/10">
                  Reset
                </button>
              </div>
            </div>
            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              Discrete elements without structure or binary operations. Plain dots representing the set $X = {'{'} {setElements.map(e => e.label).join(', ')} {'}'}$.
            </p>

            {/* Set Workspace Canvas */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex items-center justify-center gap-6 flex-wrap relative overflow-hidden">
              {setElements.length === 0 ? (
                <span className="text-xs text-text-muted">Set is empty. Add a point!</span>
              ) : (
                setElements.map(e => (
                  <div
                    key={e.id}
                    className={`w-12 h-12 rounded-full bg-slate-900 border-2 flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300 ${
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

          <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col gap-2">
            <button
              onClick={triggerFreeGeneration}
              disabled={setElements.length === 0}
              className="btn btn-primary w-full text-sm font-semibold"
            >
              Generate Structure (Free Functor $F$) <Sparkles size={16} />
            </button>
            <button
              onClick={triggerUnitMap}
              disabled={setElements.length === 0}
              className="btn btn-outline w-full text-xs font-semibold"
            >
              Visualize Adjunction Unit ($\eta_X: X \to U(F(X))$)
            </button>
          </div>
        </div>

        {/* Category D: Monoids */}
        <div className="glass-panel p-6 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                Category D <span className="text-xs text-text-muted font-normal">(Monoids)</span>
              </h3>
              <div className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded text-secondary border border-slate-700">
                Structure: Concatenation
              </div>
            </div>
            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              Algebraic structure containing identity ($\varepsilon$) and associative multiplication. Here, $F(X)$ is the free monoid of words over $X$.
            </p>

            {/* Monoid Workspace Canvas */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-6 min-h-[160px] flex items-center justify-center gap-4 flex-wrap relative overflow-hidden">
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

          <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col gap-2">
            <button
              onClick={triggerForgetfulCollapse}
              disabled={monoidWords.length === 0}
              className="btn btn-secondary w-full text-sm font-semibold"
            >
              Collapse/Forget Structure (Forgetful Functor $U$) <LogOut size={16} />
            </button>
            <a href="#counit-workspace" className="btn btn-outline w-full text-xs font-semibold">
              Visualize Adjunction Counit ($\varepsilon_M$)
            </a>
          </div>
        </div>

      </div>

      {/* Concept Explainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-sm">
        <div className="glass-panel p-5">
          <h4 className="font-bold mb-2 text-primary">1. Left Adjoint (Free Functor $F$)</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Takes a raw set of points $X$ in Sets and <em>freely generates</em> the free monoid $F(X)$ containing all lists/words. This is the "least constrained" way to turn a set into a monoid without imposing any arbitrary equations.
          </p>
        </div>
        <div className="glass-panel p-5">
          <h4 className="font-bold mb-2 text-secondary">2. Right Adjoint (Forgetful $U$)</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Takes a structured Monoid $M$ in Monoids and strips away the associative operation and identity element, returning the simple underlying set of elements $U(M)$. It represents a loss/collapse of structure.
          </p>
        </div>
        <div className="glass-panel p-5">
          <h4 className="font-bold mb-2 text-accent">3. The Adjunction ($F \dashv U$)</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            An adjunction asserts a natural isomorphism $\hom(F(X), M) \cong \hom(X, U(M))$. Defining a monoid homomorphism out of a free monoid is exactly equivalent to choosing where the raw generators go.
          </p>
        </div>
      </div>

      {/* Adjunction Unit & Counit Visualization Panel */}
      <div id="counit-workspace" className="glass-panel p-8 mb-8 animate-pop-in">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Layers className="text-accent" /> Adjunction Unit ($\eta$) and Counit ($\varepsilon$) in Action
        </h3>
        <p className="text-xs text-text-muted mb-6 leading-relaxed">
          The Unit $\eta_X$ embeds elements into the free list ($x \mapsto [x]$). The Counit $\varepsilon_M$ evaluates and collapses a freely generated word of monoid elements into their actual product using the monoid multiplication operation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Unit Simulation */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6">
            <h4 className="text-sm font-bold mb-3 text-primary flex items-center gap-1.5">
              Unit Mapping ($\eta_X$)
            </h4>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Every element in the Set $X$ canonically injects as a singleton word in the Free Monoid $F(X)$.
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
              Counit Evaluation ($\varepsilon_M$)
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
              <button type="submit" className="btn btn-primary text-xs py-2 font-bold whitespace-nowrap">
                Collapse Word
              </button>
            </form>

            {animationState === 'counit' && (
              <div className="animate-pop-in bg-slate-900/60 p-3 rounded border border-accent/20 text-xs flex items-center gap-2">
                {counitResult ? (
                  <span className="text-success font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Product evaluated to: <span className="font-mono text-secondary text-sm">{counitResult}</span>
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
