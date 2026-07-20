import React, { useState, useMemo } from 'react';
import { ArrowRight, ArrowLeftRight, Lock } from 'lucide-react';

interface VisualizerProps {
  language: 'en' | 'ja';
  onNavigate?: (room: number) => void;
}

// ============================================================================
// ROOM 1: Ontological Cycle
// ============================================================================
export function OntologicalCycleVisualizer({ language }: VisualizerProps) {
  const [generators, setGenerators] = useState<string[]>([]);
  const [relation, setRelation] = useState<'none' | 'aa=a' | 'ab=ba'>('none');
  
  const addGen = (char: 'a' | 'b') => {
    setGenerators(prev => [...prev, char]);
  };

  const clearGen = () => setGenerators([]);

  // Compute quotient representation
  const semanticValue = useMemo(() => {
    if (generators.length === 0) return 'ε';
    let term = generators.join('');
    if (relation === 'aa=a') {
      // Collapse consecutive duplicates
      let collapsed = '';
      for (let i = 0; i < term.length; i++) {
        if (term[i] !== term[i - 1]) {
          collapsed += term[i];
        }
      }
      return collapsed;
    } else if (relation === 'ab=ba') {
      // Sort to represent commutative equivalence class
      return [...term].sort().join('');
    }
    return term;
  }, [generators, relation]);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'The Ontological Cycle (Syntax vs Semantics)' : '存在論的サイクル (構文 vs 意味論)'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Generate a free syntax word, then apply quotient relations to collapse it into its semantic equivalence class.'
            : '生の構文の言葉を生成し、同値関係を適用して意味論的な同値類へと崩壊（商化）させます。'}
        </p>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => addGen('a')} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>+ a</button>
          <button onClick={() => addGen('b')} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>+ b</button>
          <button onClick={clearGen} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.7rem', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.2)' }}>Reset</button>
        </div>

        {/* Relation Selector */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setRelation('none')} 
            className={`btn ${relation === 'none' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '3px 8px', fontSize: '0.65rem' }}
          >
            {language === 'en' ? 'No Relation (Free F(X))' : '関係式なし (自由 F(X))'}
          </button>
          <button 
            onClick={() => setRelation('aa=a')} 
            className={`btn ${relation === 'aa=a' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '3px 8px', fontSize: '0.65rem' }}
          >
            {language === 'en' ? 'Idempotence (aa = a)' : 'ベキ等関係 (aa = a)'}
          </button>
          <button 
            onClick={() => setRelation('ab=ba')} 
            className={`btn ${relation === 'ab=ba' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '3px 8px', fontSize: '0.65rem' }}
          >
            {language === 'en' ? 'Commutativity (ab = ba)' : '可換関係 (ab = ba)'}
          </button>
        </div>

        {/* Dual Space Diagrams */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
          {/* Syntax Side */}
          <div style={{ background: 'rgba(56, 189, 248, 0.03)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '8px', padding: '0.75rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--secondary)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {language === 'en' ? 'Syntax Space F(X)' : '構文空間 F(X)'}
            </span>
            <div style={{ minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
              <span className="font-mono" style={{ fontSize: '1.25rem', color: '#fff', letterSpacing: '0.05em' }}>
                {generators.length === 0 ? 'ε' : generators.join('')}
              </span>
            </div>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
              {language === 'en' ? 'Unreduced free word generators' : '簡約されていない生の記号列'}
            </span>
          </div>

          {/* Semantics Side */}
          <div style={{ background: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '8px', padding: '0.75rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--primary)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {language === 'en' ? 'Semantic Space F(X)/~' : '意味空間 F(X)/~'}
            </span>
            <div style={{ minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
              <span className="font-mono" style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                [{semanticValue}]
              </span>
            </div>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
              {language === 'en' ? 'Collapsed equivalence class' : '商化された代表元の同値類'}
            </span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem', marginTop: '1rem' }}>
        {language === 'en' 
          ? 'Notice that imposing relations folds the infinite syntax into finite semantic classes.' 
          : '関係式を課すことで、無限の構文空間が意味論的な同値類へと折りたたまれます。'}
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 2: Lebombo Bone
// ============================================================================
export function LebomboBoneVisualizer({ language }: VisualizerProps) {
  const [notches, setNotches] = useState<number>(3);
  const [bijectionActive, setBijectionActive] = useState<boolean>(false);
  const maxNotches = 10;

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Lebombo Bone & Equipotence' : 'レボンボ骨と集合の対等性'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Carve notches (syntax), then establish a bijection with objects (sheep) to collapse them into a cardinal number (semantics).'
            : '骨に刻み目を刻み（構文）、対象（羊）との全単射対応を確立させて、基数という抽象概念（意味論）へ折りたたみます。'}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button 
            disabled={notches >= maxNotches} 
            onClick={() => { setNotches(n => n + 1); setBijectionActive(false); }}
            className="btn btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
          >
            + Carve Notch
          </button>
          <button 
            disabled={notches <= 0} 
            onClick={() => { setNotches(n => n - 1); setBijectionActive(false); }}
            className="btn btn-outline"
            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
          >
            - Remove Notch
          </button>
          <button 
            onClick={() => setBijectionActive(b => !b)} 
            disabled={notches === 0}
            className={`btn ${bijectionActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ArrowLeftRight size={12} />
            {language === 'en' ? 'Match bijection' : '全単射対応'}
          </button>
        </div>

        {/* Interactive SVG Workspace */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', minHeight: '180px', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
          
          {/* Bone Representation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 'bold' }}>LEBOMBO FIBULA (SYNTAX)</span>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(212,175,55,0.1)', height: '40px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', padding: '0 20px', gap: '10px' }}>
              {Array.from({ length: notches }).map((_, i) => (
                <div key={i} style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px', opacity: 0.9, transition: 'all 0.3s' }} />
              ))}
              {notches === 0 && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>No notches carved</span>}
            </div>
          </div>

          {/* Mappings lines if active */}
          {bijectionActive && (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
              {/* Dynamic lines drawing would go here. We can render standard elements inside DOM instead for ease or SVG lines. */}
            </svg>
          )}

          {/* Sheep Representation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--secondary)', fontWeight: 'bold' }}>HERD OF SHEEP (REALITY SET)</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '32px', alignItems: 'center' }}>
              {Array.from({ length: notches }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: bijectionActive ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', transition: 'all 0.3s' }}>
                  <span style={{ fontSize: '0.8rem' }}>🐏</span>
                </div>
              ))}
              {notches === 0 && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>Set is empty</span>}
            </div>
          </div>

          {/* Collapsed Semantic Class Card */}
          {bijectionActive && notches > 0 && (
            <div className="animate-pop-in" style={{ display: 'flex', justifyContent: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', borderRadius: '6px', padding: '0.5rem', textAlign: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold' }}>
                {language === 'en' 
                  ? `Equipotent class established! Cardinal Number: ${notches}` 
                  : `対等関係（全単射）を検知！基数: ${notches}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 3: Sumerian Bulla
// ============================================================================
export function SumerianBullaVisualizer({ language }: VisualizerProps) {
  const [cones, setCones] = useState<number>(0);
  const [spheres, setSpheres] = useState<number>(0);
  const [sealed, setSealed] = useState<boolean>(false);

  const addToken = (type: 'cone' | 'sphere') => {
    if (sealed) return;
    if (type === 'cone') setCones(c => c + 1);
    if (type === 'sphere') setSpheres(s => s + 1);
  };

  const reset = () => {
    setCones(0);
    setSpheres(0);
    setSealed(false);
  };

  // 10 cones collapse to 1 sphere under Sumerian positional relations
  const totalValue = cones + (spheres * 10);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Sumerian Bullae & Congruence' : 'シュメールのブッラと同値合同'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Add clay tokens (generators), then seal them in a Bulla envelope to verify value under contract quotient (10 Cones = 1 Sphere).'
            : '粘土トークンを生成し（生成元）、ブッラに封入・密封して、契約関係式（円錐10個 = 球1個）のもとで総価値を商化・算定します。'}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button disabled={sealed} onClick={() => addToken('cone')} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>+ Cone (1)</button>
          <button disabled={sealed} onClick={() => addToken('sphere')} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>+ Sphere (10)</button>
          <button disabled={cones === 0 && spheres === 0} onClick={() => setSealed(s => !s)} className={`btn ${sealed ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '4px 12px', fontSize: '0.7rem' }}>
            {sealed ? (language === 'en' ? 'Open Envelope' : '封印を解く') : (language === 'en' ? 'Seal Bulla' : 'ブッラを封印する')}
          </button>
          <button onClick={reset} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>Clear</button>
        </div>

        {/* Envelope Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
          {/* Tokens Tray */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem', minHeight: '120px' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {sealed ? (language === 'en' ? 'SEALED TOKENS (HIDDEN)' : '封入されたトークン (不可視)') : (language === 'en' ? 'OPEN TRAY' : 'トレイ')}
            </span>
            {!sealed ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Array.from({ length: cones }).map((_, i) => (
                  <span key={`c-${i}`} style={{ fontSize: '1.1rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} title="Cone (1)">📐</span>
                ))}
                {Array.from({ length: spheres }).map((_, i) => (
                  <span key={`s-${i}`} style={{ fontSize: '1.1rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} title="Sphere (10)">⚪</span>
                ))}
                {cones === 0 && spheres === 0 && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>Tray is empty</span>}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px' }}>
                <Lock size={20} style={{ color: 'var(--primary)', opacity: 0.6 }} />
              </div>
            )}
          </div>

          {/* Sealed Bulla Exterior */}
          <div style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: sealed ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)', border: sealed ? '2px solid var(--primary)' : '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s' }}>
              <span style={{ fontSize: '1.5rem' }}>🫓</span>
            </div>
            {sealed ? (
              <div className="animate-pop-in" style={{ marginTop: '0.5rem' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                  {language === 'en' ? `Contract Val: ${totalValue}` : `取引契約価値: ${totalValue}`}
                </span>
                <span style={{ display: 'block', fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {language === 'en' ? 'Cuneiform markings stamped' : '粘土表面に押印が完了'}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>
                {language === 'en' ? 'Seal bulla to see marks' : 'ブッラを封印して刻印を表示'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 4: Inca Quipu
// ============================================================================
export function IncaQuipuVisualizer({ language }: VisualizerProps) {
  const [hundreds, setHundreds] = useState<number>(1);
  const [tens, setTens] = useState<number>(3);
  const [units, setUnits] = useState<number>(5);

  const adjustKnots = (tier: 'h' | 't' | 'u', action: 'add' | 'sub') => {
    const change = action === 'add' ? 1 : -1;
    if (tier === 'h') setHundreds(prev => Math.max(0, Math.min(9, prev + change)));
    if (tier === 't') setTens(prev => Math.max(0, Math.min(9, prev + change)));
    if (tier === 'u') setUnits(prev => Math.max(0, Math.min(9, prev + change)));
  };

  const total = hundreds * 100 + tens * 10 + units;

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Inca Quipu Positional Spacing' : 'インカ帝国のキープ十進法商化'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Add knots to positional tiers on the cord. Spacing quotients free geometric knots into a base-10 numerical register.'
            : '紐の異なる高さ（桁）に結び目を作ります。位置の間隔が、自由な結び目の配列を10進法レジスタへと商化します。'}
        </p>

        {/* Quipu SVG / Canvas Display */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
          {/* Rope Widget */}
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '220px', position: 'relative' }}>
            {/* Main Horizontal String */}
            <div style={{ width: '90%', height: '6px', background: '#8b5a2b', borderRadius: '3px', marginBottom: '15px' }} />
            
            {/* Hanging Cord */}
            <div style={{ width: '4px', height: '180px', background: '#cd853f', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
              
              {/* Hundreds Tier */}
              <div style={{ width: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', padding: '2px' }}>
                <span style={{ fontSize: '0.5rem', color: 'var(--secondary)' }}>x100</span>
                <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center', width: '20px', margin: '2px 0' }}>
                  {Array.from({ length: hundreds }).map((_, i) => (
                    <div key={`h-${i}`} style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => adjustKnots('h', 'add')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.6rem', cursor: 'pointer' }}>+</button>
                  <button onClick={() => adjustKnots('h', 'sub')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.6rem', cursor: 'pointer' }}>-</button>
                </div>
              </div>

              {/* Tens Tier */}
              <div style={{ width: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', padding: '2px' }}>
                <span style={{ fontSize: '0.5rem', color: 'var(--secondary)' }}>x10</span>
                <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center', width: '20px', margin: '2px 0' }}>
                  {Array.from({ length: tens }).map((_, i) => (
                    <div key={`t-${i}`} style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => adjustKnots('t', 'add')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.6rem', cursor: 'pointer' }}>+</button>
                  <button onClick={() => adjustKnots('t', 'sub')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.6rem', cursor: 'pointer' }}>-</button>
                </div>
              </div>

              {/* Units Tier */}
              <div style={{ width: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', padding: '2px' }}>
                <span style={{ fontSize: '0.5rem', color: 'var(--secondary)' }}>x1</span>
                <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center', width: '20px', margin: '2px 0' }}>
                  {Array.from({ length: units }).map((_, i) => (
                    <div key={`u-${i}`} style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => adjustKnots('u', 'add')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.6rem', cursor: 'pointer' }}>+</button>
                  <button onClick={() => adjustKnots('u', 'sub')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.6rem', cursor: 'pointer' }}>-</button>
                </div>
              </div>

            </div>
          </div>

          {/* Decimal output */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
              {language === 'en' ? 'Calculated Value' : '計算結果（数値）'}
            </span>
            <span className="font-mono text-3xl font-bold" style={{ fontSize: '2.5rem', color: 'var(--primary)', display: 'block', margin: '0.5rem 0' }}>
              {total}
            </span>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
              {hundreds}×100 + {tens}×10 + {units}×1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 5: Language Synonymy
// ============================================================================
export function LanguageSynonymyVisualizer({ language }: VisualizerProps) {
  const [grouped, setGrouped] = useState<boolean>(false);

  const synonyms = [
    { word: 'automobile', category: 'car' },
    { word: 'car', category: 'car' },
    { word: 'motorcar', category: 'car' },
    { word: 'bicycle', category: 'bike' },
    { word: 'bike', category: 'bike' },
    { word: 'two-wheeler', category: 'bike' }
  ];

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Language Synonymy Congruence' : '言語の同義性による合同関係'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Different words (syntax) are mapped to equivalent semantic classes. Quotienting collapses synonymy.'
            : '異なる単語（構文）を意味的同値類にマッピングします。商化によって「同義語」が一つの概念へ縮退されます。'}
        </p>

        <button 
          onClick={() => setGrouped(g => !g)}
          className="btn btn-primary"
          style={{ padding: '4px 12px', fontSize: '0.7rem', marginBottom: '1rem' }}
        >
          {grouped 
            ? (language === 'en' ? 'Show Raw Words (Syntax)' : '生の単語を表示 (構文)') 
            : (language === 'en' ? 'Apply Synonymy Quotient' : '同義同値関係を適用 (商化)')}
        </button>

        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', minHeight: '130px' }}>
          {!grouped ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {synonyms.map((s, idx) => (
                <span key={idx} className="floating-node font-mono" style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.75rem' }}>
                  {s.word}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Car class */}
              <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--primary)', padding: '0.5rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>CLASS: [CAR]</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {synonyms.filter(s => s.category === 'car').map(s => (
                    <span key={s.word} style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#fff' }}>{s.word}</span>
                  ))}
                </div>
              </div>

              {/* Bike class */}
              <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px dashed var(--secondary)', padding: '0.5rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--secondary)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>CLASS: [BIKE]</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {synonyms.filter(s => s.category === 'bike').map(s => (
                    <span key={s.word} style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#fff' }}>{s.word}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 6: Lindenbaum-Tarski Logic
// ============================================================================
export function LindenbaumTarskiVisualizer({ language }: VisualizerProps) {
  const [formula, setFormula] = useState<'A' | 'B'>('A');
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const formulas = {
    A: {
      raw: 'p ∧ (q ∨ ¬q)',
      canonical: 'p',
      steps: [
        { label: 'Raw syntax tree', val: 'p ∧ (q ∨ ¬q)' },
        { label: 'Excluded Middle (q ∨ ¬q ≡ ⊤)', val: 'p ∧ ⊤' },
        { label: 'Identity (p ∧ ⊤ ≡ p)', val: 'p' }
      ]
    },
    B: {
      raw: 'p ∨ (p ∧ q)',
      canonical: 'p',
      steps: [
        { label: 'Raw syntax tree', val: 'p ∨ (p ∧ q)' },
        { label: 'Absorption Law', val: 'p' }
      ]
    }
  };

  const current = formulas[formula];

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Lindenbaum-Tarski Algebra Quotient' : 'リンデンバウム・タルスキ代数商'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Collapse infinite logic trees quotiented by provable logical equivalence classes.'
            : '証明可能な論理同値関係による商化を通じて、無限の論理式の木を簡約・崩壊させます。'}
        </p>

        {/* Form Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => { setFormula('A'); setCollapsed(false); }} className={`btn ${formula === 'A' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>
            Formula I: p ∧ (q ∨ ¬q)
          </button>
          <button onClick={() => { setFormula('B'); setCollapsed(false); }} className={`btn ${formula === 'B' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>
            Formula II: p ∨ (p ∧ q)
          </button>
          <button onClick={() => setCollapsed(c => !c)} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.7rem' }}>
            {collapsed ? 'Reset' : (language === 'en' ? 'Deduce / Collapse' : '同値簡約を実行')}
          </button>
        </div>

        {/* Step-by-Step simplification display */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem', minHeight: '120px' }}>
          {!collapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--secondary)' }}>SYNTAX FORMULA</span>
              <span className="font-mono text-lg text-white" style={{ display: 'block', margin: '0.5rem 0' }}>{current.raw}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {current.steps.map((s, idx) => (
                <div key={idx} className="animate-pop-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: idx === current.steps.length - 1 ? 'var(--success)' : 'var(--text-muted)' }}>
                  <span style={{ minWidth: '150px' }}>{s.label}</span>
                  <ArrowRight size={10} />
                  <span className="font-mono font-bold">{s.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 7: Textile Weaving
// ============================================================================
export function TextileWeavingVisualizer({ language }: VisualizerProps) {
  const [grid, setGrid] = useState<boolean[][]>([
    [true, false, true, false],
    [false, true, false, true],
    [true, false, true, false],
    [false, true, false, true]
  ]);

  const toggleCell = (r: number, c: number) => {
    setGrid(prev => {
      const copy = prev.map(row => [...row]);
      copy[r][c] = !copy[r][c];
      return copy;
    });
  };

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Warp/Weft Loom Interlacing' : '織機における経糸・緯糸の商接着'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Toggle intersection overlaps. Warp and weft coordinate lines are quotiented (glued) to construct a continuous sheet manifold.'
            : '格子の交差を切り替えます。独立した縦糸・横糸の座標が、交差関係式によって1つの連続した織物多様体へと接着されます。'}
        </p>

        {/* Loom Grid Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 30px)', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {grid.map((row, r) => 
              row.map((val, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => toggleCell(r, c)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '4px',
                    background: val ? 'var(--primary)' : 'var(--secondary)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    fontSize: '0.55rem',
                    fontWeight: 'bold',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title={val ? 'Warp over Weft' : 'Weft over Warp'}
                >
                  {val ? '↑' : '→'}
                </button>
              ))
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          {language === 'en'
            ? 'Yellow represents Warp thread on top. Cyan represents Weft thread on top.'
            : '黄色は経糸が上、シアンは緯糸が上の交差状態を表します。'}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 8: Origami Crease Pattern
// ============================================================================
export function OrigamiCreaseVisualizer({ language }: VisualizerProps) {
  const [folded, setFolded] = useState<number>(0);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Crease Pattern Spatial Quotienting' : '折り紙の折れ線による空間商化'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Folding identifies different points on flat paper (syntax) to shape a 3D structure (semantics).'
            : '折り畳み操作は、平らな紙の上の異なる座標点（構文）を同一視し、3次元構造（意味論）を形成する空間の商化です。'}
        </p>

        {/* Fold slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem' }}>
            <span>{language === 'en' ? 'Flat state' : '平坦状態'}</span>
            <span>{language === 'en' ? 'Folded state' : '折り畳み状態'}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={folded} 
            onChange={e => setFolded(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
        </div>

        {/* Visualization of folding point gluing */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', minHeight: '120px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', border: '1px dashed rgba(255,255,255,0.2)', transition: 'all 0.5s' }}>
            {/* Top-left corner */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', transform: `translate(${folded * 0.4}px, ${folded * 0.4}px)`, transition: 'all 0.1s' }} />
            {/* Bottom-right corner */}
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', transform: `translate(${-folded * 0.4}px, ${-folded * 0.4}px)`, transition: 'all 0.1s' }} />
            
            <span style={{ position: 'absolute', top: '35%', left: '20%', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>Fold Line</span>
            <div style={{ position: 'absolute', top: 0, left: '80px', width: '1px', height: '80px', background: 'rgba(255,255,255,0.15)', transform: 'rotate(45deg)', transformOrigin: 'top left' }} />
          </div>

          <div style={{ fontSize: '0.65rem' }}>
            {folded === 100 ? (
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                {language === 'en' ? 'Points A & B collapsed!' : '頂点 A と 頂点 B が接着されました！'}<br/>
                x ~ y
              </span>
            ) : (
              <span>
                {language === 'en' ? 'Points moving towards collapse...' : '折り畳みに伴って座標同士が接近中...'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 10: Projective Geometry
// ============================================================================
export function ProjectiveGeometryVisualizer({ language }: VisualizerProps) {
  const [point, setPoint] = useState<{ x: number, y: number } | null>(null);

  const handleSphereClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 60; // relative to center (60, 60)
    const y = e.clientY - rect.top - 60;
    // Normalize to circle radius 50
    const dist = Math.sqrt(x*x + y*y);
    if (dist <= 50) {
      setPoint({ x, y });
    }
  };

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Real Projective Plane (RP²)' : '実射影平面 (RP²)'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Click the sphere. Opposite (antipodal) points collapse into a single projective point: x ~ -x.'
            : '球面をクリックします。対向する対蹠点同士が1つの射影空間座標へとコイコライズ（商化）されます: x ~ -x。'}
        </p>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', margin: '0.5rem 0' }}>
          {/* Sphere S2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--secondary)', marginBottom: '4px' }}>SPHERE S²</span>
            <svg width="120" height="120" onClick={handleSphereClick} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.02)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
              {/* Sphere wireframe */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.15)" />
              <ellipse cx="60" cy="60" rx="50" ry="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="3,3" />
              <ellipse cx="60" cy="60" rx="15" ry="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="3,3" />
              
              {point && (
                <>
                  {/* Point X */}
                  <circle cx={60 + point.x} cy={60 + point.y} r="4" fill="var(--primary)" />
                  <text x={65 + point.x} y={65 + point.y} fill="var(--primary)" fontSize="8">x</text>
                  
                  {/* Antipodal point -X */}
                  <circle cx={60 - point.x} cy={60 - point.y} r="4" fill="var(--secondary)" />
                  <text x={65 - point.x} y={65 - point.y} fill="var(--secondary)" fontSize="8">-x</text>
                  
                  {/* Line through origin */}
                  <line x1={60 + point.x} y1={60 + point.y} x2={60 - point.x} y2={60 - point.y} stroke="rgba(255,255,255,0.2)" strokeDasharray="2,2" />
                </>
              )}
            </svg>
          </div>

          {/* Projective Space RP2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--primary)', marginBottom: '4px' }}>PROJECTIVE SPACE RP²</span>
            <svg width="120" height="120" style={{ background: 'rgba(212,175,55,0.02)', borderRadius: '50%', border: '2px solid var(--primary)' }}>
              <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(212,175,55,0.15)" />
              {point && (
                <>
                  {/* Both points mapped to one */}
                  <circle cx={60 + Math.abs(point.x)} cy={60 + Math.abs(point.y)} r="5" fill="var(--primary)" />
                  <text x={68 + Math.abs(point.x)} y={65 + Math.abs(point.y)} fill="var(--primary)" fontSize="8">[x] = [-x]</text>
                </>
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 11: Path Homotopy
// ============================================================================
export function PathHomotopyVisualizer({ language }: VisualizerProps) {
  const [winding, setWinding] = useState<number>(0);
  const [collapsing, setCollapsing] = useState<boolean>(false);

  const triggerCollapse = () => {
    setCollapsing(true);
    setTimeout(() => setCollapsing(false), 800);
  };

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Path Homotopy & Winding Number' : '経路ホモトピーと同値類（巻き数）'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Adjust winding loops. Geodesic collapse quotients infinite drawn paths into integer homotopy classes.'
            : '障害物の周りを回る巻き数を選びます。ホモトピー商化は、多様な経路同値関係を整数値（ホモトピー類）へと崩壊させます。'}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => setWinding(0)} className={`btn ${winding === 0 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>0 Loop</button>
          <button onClick={() => setWinding(1)} className={`btn ${winding === 1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>1 Loop</button>
          <button onClick={() => setWinding(-1)} className={`btn ${winding === -1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>-1 Loop</button>
          <button onClick={triggerCollapse} className="btn btn-outline" style={{ padding: '3px 8px', fontSize: '0.65rem', borderColor: 'var(--success)', color: 'var(--success)' }}>
            Collapse Path
          </button>
        </div>

        {/* SVG Drawing */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.5rem', minHeight: '140px', display: 'flex', justifyContent: 'center' }}>
          <svg width="240" height="130">
            {/* Obstacle (Puncture) */}
            <circle cx="120" cy="65" r="12" fill="var(--error)" opacity={0.8} />
            <text x="113" y="69" fill="black" fontSize="9" fontWeight="bold">0</text>
            
            {/* Start and End nodes */}
            <circle cx="40" cy="65" r="4" fill="white" />
            <text x="30" y="60" fill="white" fontSize="8">Start</text>
            <circle cx="200" cy="65" r="4" fill="white" />
            <text x="195" y="60" fill="white" fontSize="8">End</text>

            {/* Path visualization based on winding */}
            {!collapsing ? (
              winding === 0 ? (
                <path d="M 40 65 Q 120 20 200 65" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="3,3" />
              ) : winding === 1 ? (
                <path d="M 40 65 C 100 20, 150 20, 150 65 C 150 100, 90 100, 90 65 C 90 20, 160 20, 200 65" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="3,3" />
              ) : (
                <path d="M 40 65 C 100 110, 150 110, 150 65 C 150 30, 90 30, 90 65 C 90 110, 160 110, 200 65" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="3,3" />
              )
            ) : (
              // Collapsed Path (straight or tight geodesic)
              winding === 0 ? (
                <line x1="40" y1="65" x2="200" y2="65" stroke="var(--success)" strokeWidth="2" />
              ) : winding === 1 ? (
                <path d="M 40 65 Q 120 40 135 65 Q 120 90 105 65 Q 120 40 200 65" fill="none" stroke="var(--success)" strokeWidth="2" />
              ) : (
                <path d="M 40 65 Q 120 90 135 65 Q 120 40 105 65 Q 120 90 200 65" fill="none" stroke="var(--success)" strokeWidth="2" />
              )
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 12: Einstein Spacetime
// ============================================================================
export function EinsteinSpacetimeVisualizer({ language }: VisualizerProps) {
  const [gravity, setGravity] = useState<number>(30);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Einstein Spacetime Geodesics' : 'アインシュタイン時空の測地線'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Adjust star mass. Gravity acts as a metric quotient, warping the flat coordinate syntax into physical curves.'
            : '恒星の質量を変化させます。重力は時空計量による商化（接着）として機能し、平坦な座標の構文を物理的な曲線へと歪めます。'}
        </p>

        {/* Mass Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem' }}>
            <span>{language === 'en' ? 'Flat coordinate system' : '平坦な座標系'}</span>
            <span>{language === 'en' ? 'Curved gravity well' : '歪んだ重力場'}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={gravity} 
            onChange={e => setGravity(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
        </div>

        {/* Warp grid representation */}
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.5rem', minHeight: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="240" height="120">
            {/* Grid coordinates warped by gravity */}
            <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
              {Array.from({ length: 9 }).map((_, i) => {
                const x = 20 + i * 25;
                // Pull lines in center towards center y=60
                return (
                  <path key={`v-${i}`} d={`M ${x} 0 Q ${120 + (x - 120) * (1 - gravity*0.005)} ${60} ${x} 120`} fill="none" />
                );
              })}
              {Array.from({ length: 5 }).map((_, i) => {
                const y = 20 + i * 20;
                return (
                  <path key={`h-${i}`} d={`M 0 ${y} Q ${120} ${60 + (y - 60) * (1 - gravity*0.005)} 240 ${y}`} fill="none" />
                );
              })}
            </g>

            {/* Mass Center */}
            {gravity > 0 && (
              <circle cx="120" cy="60" r={gravity * 0.12 + 4} fill="var(--primary)" opacity={0.8} />
            )}

            {/* Particle geodesic path */}
            <path d={`M 10 30 Q 120 ${30 + gravity * 0.25} 230 30`} fill="none" stroke="var(--secondary)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 13: Lambda Calculus
// ============================================================================
export function LambdaCalculusVisualizer({ language }: VisualizerProps) {
  const [step, setStep] = useState<number>(0);

  const steps = [
    { code: '((λx. λy. x + y) 3) 5', descEn: 'Apply 3 to x', descJa: '引数 3 を x にバインドします' },
    { code: '(λy. 3 + y) 5', descEn: 'Apply 5 to y', descJa: '引数 5 を y にバインドします' },
    { code: '3 + 5', descEn: 'Add values', descJa: '加算を実行します' },
    { code: '8', descEn: 'Final Normal Form (Semantic result)', descJa: '正規形（評価結果）' }
  ];

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'λ-Calculus Beta Reduction' : 'ラムダ計算のベータ簡約'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Step through variable substitutions. Beta reduction acts as the algebraic quotient of logic terms.'
            : '変数代入のステップを実行します。ベータ簡約は、論理式の代数的な商化に相当します。'}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button 
            disabled={step >= steps.length - 1} 
            onClick={() => setStep(s => s + 1)}
            className="btn btn-primary"
            style={{ padding: '4px 12px', fontSize: '0.7rem' }}
          >
            Beta Reduction Step
          </button>
          <button onClick={() => setStep(0)} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>Reset</button>
        </div>

        {/* Tree reduction display */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.55rem', color: 'var(--secondary)' }}>
            {language === 'en' ? 'REDUCTION LOG' : '簡約過程'}
          </span>
          <div style={{ margin: '0.5rem 0' }}>
            {steps.slice(0, step + 1).map((s, idx) => (
              <div key={idx} className="animate-pop-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '4px', opacity: idx === step ? 1 : 0.4 }}>
                <span className="font-mono text-white font-bold">{s.code}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>— {language === 'en' ? s.descEn : s.descJa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 15: Relational Algebra
// ============================================================================
export function RelationalAlgebraVisualizer({ language }: VisualizerProps) {
  const [projection, setProjection] = useState<'none' | 'major' | 'group'>('none');

  const dataset = [
    { name: 'Alice', age: 21, major: 'Math' },
    { name: 'Bob', age: 22, major: 'Physics' },
    { name: 'Charlie', age: 21, major: 'Math' },
    { name: 'Diana', age: 20, major: 'Physics' }
  ];

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Relational Algebra Quotienting' : '関係代数における直和分割'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Apply query projection. Duplicate tuples collapse into unique quotient sets.'
            : 'クエリの射影を適用します。属性が重複する組（タプル）が、商集合の操作によって折りたたまれます。'}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => setProjection('none')} className={`btn ${projection === 'none' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>Raw Table</button>
          <button onClick={() => setProjection('major')} className={`btn ${projection === 'major' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>Project [Major]</button>
          <button onClick={() => setProjection('group')} className={`btn ${projection === 'group' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>Group by [Major]</button>
        </div>

        {/* Data Table */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.5rem', minHeight: '140px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {projection !== 'major' && projection !== 'group' && <th style={{ textAlign: 'left', padding: '4px' }}>Name</th>}
                {projection !== 'major' && projection !== 'group' && <th style={{ textAlign: 'left', padding: '4px' }}>Age</th>}
                <th style={{ textAlign: 'left', padding: '4px' }}>Major</th>
                {projection === 'group' && <th style={{ textAlign: 'left', padding: '4px' }}>Count</th>}
              </tr>
            </thead>
            <tbody>
              {projection === 'none' && dataset.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '4px' }}>{d.name}</td>
                  <td style={{ padding: '4px' }}>{d.age}</td>
                  <td style={{ padding: '4px', color: 'var(--primary)' }}>{d.major}</td>
                </tr>
              ))}
              {projection === 'major' && (
                <>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '4px', color: 'var(--primary)', fontWeight: 'bold' }}>Math</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '4px', color: 'var(--primary)', fontWeight: 'bold' }}>Physics</td>
                  </tr>
                </>
              )}
              {projection === 'group' && (
                <>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '4px', color: 'var(--primary)', fontWeight: 'bold' }}>Math</td>
                    <td style={{ padding: '4px' }}>2</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '4px', color: 'var(--primary)', fontWeight: 'bold' }}>Physics</td>
                    <td style={{ padding: '4px' }}>2</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 16: Regular Expressions & Automata
// ============================================================================
export function RegExAutomataVisualizer({ language }: VisualizerProps) {
  const [input, setInput] = useState<string>('');
  const [activeState, setActiveState] = useState<'S0' | 'S1' | 'S2'>('S0');

  const processInput = (val: string) => {
    setInput(val);
    let state: 'S0' | 'S1' | 'S2' = 'S0';
    for (const char of val) {
      if (state === 'S0') {
        if (char === 'a') state = 'S1';
      } else if (state === 'S1') {
        if (char === 'b') state = 'S2';
      } else if (state === 'S2') {
        if (char === 'a') state = 'S1';
        else if (char === 'b') state = 'S0';
      }
    }
    setActiveState(state);
  };

  const matches = activeState === 'S2';

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'DFA Syntactic Quotienting' : 'DFAと言語の同値類（マイヒル・ネローデ）'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Type a/b strings. The DFA partitions the infinite string space into finite equivalence classes representing states.'
            : 'a または b の文字列を入力します。DFAは、無限の文字列空間を状態数と同数の有限な同値類へと商化します。'}
        </p>

        {/* Input box */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={input}
            onChange={e => processInput(e.target.value.replace(/[^ab]/g, ''))}
            placeholder="e.g. ababab"
            className="input-text"
            style={{ width: '100%', fontSize: '0.75rem', padding: '6px' }}
          />
        </div>

        {/* DFA States Graphic */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
          {['S0', 'S1', 'S2'].map((s) => {
            const isActive = activeState === s;
            return (
              <div 
                key={s} 
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  border: isActive ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                  color: isActive ? 'black' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  boxShadow: isActive ? '0 0 10px var(--primary)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                {s}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.7rem' }}>
          {matches ? (
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
              {language === 'en' ? 'String accepted by regular class!' : '正規表現によって受理されました！'}
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              {language === 'en' ? 'DFA state: ' + activeState : '現在のDFA状態: ' + activeState}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 17: Type Theory
// ============================================================================
export function TypeTheoryVisualizer({ language }: VisualizerProps) {
  const [normalized, setNormalized] = useState<boolean>(false);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Curry-Howard Proof Normalization' : 'カリー＝ハワードの証明項簡約'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Normalize proof terms. Curry-Howard maps logic deduction to code, collapsing redundant proofs.'
            : '証明項を正規化します。カリー＝ハワードは論理とコードを同一視し、冗長な証明を最小形式へと商化します。'}
        </p>

        <button 
          onClick={() => setNormalized(n => !n)}
          className="btn btn-primary"
          style={{ padding: '4px 12px', fontSize: '0.7rem', marginBottom: '1rem' }}
        >
          {normalized ? 'Reset' : (language === 'en' ? 'Normalize proof' : '証明を正規化（簡約）')}
        </button>

        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', minHeight: '120px' }}>
          {!normalized ? (
            <div>
              <span style={{ fontSize: '0.6rem', color: 'var(--secondary)' }}>REDUNDANT PROOF TERM (SYNTAX)</span>
              <div className="font-mono text-xs text-white" style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '4px', margin: '4px 0' }}>
                fst (pair (A, B))
              </div>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                {language === 'en' ? 'Takes product pair then projections' : '直積のペアを生成し、直後に第1射影を取り出す冗長な操作'}
              </span>
            </div>
          ) : (
            <div className="animate-pop-in">
              <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>NORMALIZED PROOF TERM (SEMANTICS)</span>
              <div className="font-mono text-xs text-white" style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '4px', margin: '4px 0', border: '1px solid var(--success)' }}>
                A
              </div>
              <span style={{ fontSize: '0.55rem', color: 'var(--success)' }}>
                {language === 'en' ? 'Direct normalized type representation' : 'カットフリーな最小証明項'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 18: Homotopy Type Theory
// ============================================================================
export function HoTTVisualizer({ language }: VisualizerProps) {
  const [slide, setSlide] = useState<number>(0);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Identity Types as Path Homotopies' : '恒等型としてのパスホモトピー'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Drag slider. In HoTT, equivalence between proofs (paths) is itself a geometric path (homotopy).'
            : 'スライダーを動かします。HoTTでは、証明（パス）間の同値関係はそれ自体が幾何学的な高次パス（ホモトピー）です。'}
        </p>

        {/* Slider */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={slide} 
          onChange={e => setSlide(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary)', marginBottom: '1rem' }}
        />

        {/* Path diagram */}
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.5rem', minHeight: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="220" height="120">
            {/* Points A and B */}
            <circle cx="30" cy="60" r="5" fill="#fff" />
            <text x="25" y="50" fill="#fff" fontSize="10">x</text>
            
            <circle cx="190" cy="60" r="5" fill="#fff" />
            <text x="185" y="50" fill="#fff" fontSize="10">y</text>

            {/* Path p (top curve) */}
            <path d="M 30 60 Q 110 15 190 60" fill="none" stroke="var(--secondary)" strokeWidth="1" />
            <text x="105" y="25" fill="var(--secondary)" fontSize="8">path p</text>
            
            {/* Path q (bottom curve) */}
            <path d="M 30 60 Q 110 105 190 60" fill="none" stroke="var(--secondary)" strokeWidth="1" />
            <text x="105" y="100" fill="var(--secondary)" fontSize="8">path q</text>

            {/* Homotopy Path of paths (morphing line) */}
            <path 
              d={`M 30 60 Q 110 ${15 + slide * 0.9} 190 60`} 
              fill="none" 
              stroke="var(--primary)" 
              strokeWidth="2.5" 
            />
            <text x="105" y={20 + slide * 0.9} fill="var(--primary)" fontSize="9" fontWeight="bold">H: p ≃ q</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 19: Category of Sets
// ============================================================================
export function CategorySetsVisualizer({ language }: VisualizerProps) {
  const [hoveredSet, setHoveredSet] = useState<'A' | 'B' | 'C' | null>(null);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'The Category of Sets (Set)' : '集合の圏 (Set)'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Hover over set objects. Set category equivalence skeletonizes sets to natural cardinality ordinals.'
            : '集合の対象（セット）にホバーします。同型による骨格圏への商化が、集合を単なる自然数の基数へと縮退させます。'}
        </p>

        {/* Set Objects */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          <div 
            onMouseEnter={() => setHoveredSet('A')}
            onMouseLeave={() => setHoveredSet(null)}
            style={{ background: hoveredSet === 'A' ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.5rem', textAlign: 'center', transition: 'all 0.3s' }}
          >
            <span style={{ fontSize: '0.6rem', color: 'var(--secondary)' }}>Set A</span>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', margin: '0.5rem 0' }}>
              <span style={{ fontSize: '1rem' }}>🍎</span>
            </div>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>1 Element</span>
          </div>

          <div 
            onMouseEnter={() => setHoveredSet('B')}
            onMouseLeave={() => setHoveredSet(null)}
            style={{ background: hoveredSet === 'B' ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.5rem', textAlign: 'center', transition: 'all 0.3s' }}
          >
            <span style={{ fontSize: '0.6rem', color: 'var(--secondary)' }}>Set B</span>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', margin: '0.5rem 0' }}>
              <span style={{ fontSize: '1rem' }}>🍌</span>
              <span style={{ fontSize: '1rem' }}>🍌</span>
            </div>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>2 Elements</span>
          </div>

          <div 
            onMouseEnter={() => setHoveredSet('C')}
            onMouseLeave={() => setHoveredSet(null)}
            style={{ background: hoveredSet === 'C' ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.5rem', textAlign: 'center', transition: 'all 0.3s' }}
          >
            <span style={{ fontSize: '0.6rem', color: 'var(--secondary)' }}>Set C</span>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', margin: '0.5rem 0' }}>
              <span style={{ fontSize: '1rem' }}>🍊</span>
              <span style={{ fontSize: '1rem' }}>🍊</span>
              <span style={{ fontSize: '1rem' }}>🍊</span>
            </div>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>3 Elements</span>
          </div>
        </div>

        {/* Skeleton result */}
        <div style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '6px', padding: '0.5rem', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {hoveredSet ? (
            <span className="font-mono text-xs font-bold" style={{ color: 'var(--primary)' }}>
              {hoveredSet === 'A' && 'Isomorphic Class in sk(Set): [1] = {0}'}
              {hoveredSet === 'B' && 'Isomorphic Class in sk(Set): [2] = {0, 1}'}
              {hoveredSet === 'C' && 'Isomorphic Class in sk(Set): [3] = {0, 1, 2}'}
            </span>
          ) : (
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
              {language === 'en' ? 'Hover a Set to view its skeleton representation' : '集合にホバーして圏の骨格表現を表示'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 20: Category of Monoids
// ============================================================================
export function CategoryMonoidsVisualizer({ language }: VisualizerProps) {
  const [presentation, setPresentation] = useState<'Z2' | 'Z3'>('Z2');

  const mulTable = presentation === 'Z2' ? [
    ['e', 'a'],
    ['a', 'e']
  ] : [
    ['e', 'a', 'b'],
    ['a', 'b', 'e'],
    ['b', 'e', 'a']
  ];

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Cayley Multiplication Table' : 'ケーリー乗積表（商モノイドの構造）'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Choose quotient relation. Shows algebraic collapse of free monoid into finite closed groups.'
            : '関係式を選択します。自由モノイドが有限な群の積構造へと商化されていく乗積表を示します。'}
        </p>

        {/* Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => setPresentation('Z2')} className={`btn ${presentation === 'Z2' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>
            Relation: aa = e (ℤ₂)
          </button>
          <button onClick={() => setPresentation('Z3')} className={`btn ${presentation === 'Z3' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>
            Relation: aaa = e (ℤ₃)
          </button>
        </div>

        {/* Multiplication grid */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <table style={{ border: '1px solid rgba(255,255,255,0.1)', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <tbody>
              {/* Header row */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                <td style={{ padding: '6px 12px', borderRight: '1px solid rgba(255,255,255,0.15)', color: 'var(--primary)', fontWeight: 'bold' }}>•</td>
                {mulTable[0].map((h, i) => (
                  <td key={i} style={{ padding: '6px 12px', color: 'var(--secondary)' }}>{h}</td>
                ))}
              </tr>
              {/* Rows */}
              {mulTable.map((row, r) => (
                <tr key={r} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '6px 12px', borderRight: '1px solid rgba(255,255,255,0.15)', color: 'var(--secondary)' }}>{mulTable[0][r]}</td>
                  {row.map((val, c) => (
                    <td key={c} style={{ padding: '6px 12px', color: '#fff' }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 21: Functorial Bridges
// ============================================================================
export function FunctorialBridgesVisualizer({ language }: VisualizerProps) {
  const [bridge, setBridge] = useState<'SetToMon' | 'MonToSet' | 'none'>('none');

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Free (F) & Forgetful (U) Functors' : '自由関手 F と忘却関手 U の架け橋'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Click arrows to bridge. Free functor F generates word syntax; forgetful functor U forgets structure.'
            : '関手をクリックして圏を渡ります。自由関手 F は構文を生成し、忘却関手 U はモノイド演算を忘却します。'}
        </p>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', margin: '0.5rem 0' }}>
          {/* Category Set */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--secondary)', display: 'block' }}>CATEGORY SET</span>
            <div style={{ margin: '0.5rem 0', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
              <span className="font-mono text-xs text-white">X = {"{a, b}"}</span>
            </div>
            <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>Raw element generators</span>
          </div>

          {/* Functor Bridge Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => setBridge('SetToMon')} className={`btn ${bridge === 'SetToMon' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.6rem' }}>
              Apply F →
            </button>
            <button onClick={() => setBridge('MonToSet')} className={`btn ${bridge === 'MonToSet' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 8px', fontSize: '0.6rem' }}>
              ← Apply U
            </button>
          </div>

          {/* Category Monoid */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--primary)', display: 'block' }}>CATEGORY MONOID</span>
            <div style={{ margin: '0.5rem 0', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
              <span className="font-mono text-xs text-white">F(X) = {"{ε, a, b, aa, ab, ...}"}</span>
            </div>
            <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>Syntax monoid under concat</span>
          </div>
        </div>

        {/* Bridge explanation */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.5rem', fontSize: '0.65rem', textAlign: 'center' }}>
          {bridge === 'SetToMon' && (
            <span style={{ color: 'var(--primary)' }}>
              {language === 'en' ? 'F(X) creates the free algebra of all possible string configurations.' : 'F(X) は、すべての可能な文字列の自由代数（構文）を生成します。'}
            </span>
          )}
          {bridge === 'MonToSet' && (
            <span style={{ color: 'var(--secondary)' }}>
              {language === 'en' ? 'U(M) forgets the composition operation, returning just the set of elements.' : 'U(M) はモノイドの積演算を忘れ、単なる要素の集合へと戻します。'}
            </span>
          )}
          {bridge === 'none' && (
            <span>
              {language === 'en' ? 'Select F or U functor translation' : '関手 F または U による翻訳を選択してください'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 22: Adjunction Duality
// ============================================================================
export function AdjunctionDualityVisualizer({ language }: VisualizerProps) {
  const [mapVal, setMapVal] = useState<number>(2);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Hom-set Natural Isomorphism' : '随伴写像の自然同型 (F ⊣ U)'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Map generator x in Set to Monoid element. The adjunction uniquely lifts it to a Monoid Homomorphism.'
            : '集合の生成元 x の行先を選択します。随伴により、この写像は自由モノイドからの唯一の構造保存準同型へと持ち上がります。'}
        </p>

        {/* Interactive map */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', margin: '0.5rem 0' }}>
          {/* Generator Side */}
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--secondary)' }}>X = {"{x}"}</span>
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', margin: '0.25rem 0' }}>
              x ↦ 
              <select 
                value={mapVal} 
                onChange={e => setMapVal(parseInt(e.target.value))}
                style={{ background: 'black', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '3px', marginLeft: '4px', fontSize: '0.65rem' }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>Map in Set</span>
          </div>

          <ArrowRight size={16} />

          {/* Homomorphism Side */}
          <div style={{ textAlign: 'center', background: 'rgba(212,175,55,0.04)', padding: '0.5rem', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--primary)' }}>F(X) → M (ℤ₄, +)</span>
            <div className="font-mono text-[10px]" style={{ margin: '0.25rem 0', color: 'var(--primary)' }}>
              F(x) = {mapVal}<br/>
              F(xx) = {(mapVal * 2) % 4}<br/>
              F(xxx) = {(mapVal * 3) % 4}
            </div>
            <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>Unique hom lift</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 23: Unit & Counit
// ============================================================================
export function UnitCounitVisualizer({ language }: VisualizerProps) {
  const [step, setStep] = useState<number>(0);

  const steps = [
    { label: 'Start with set element X', val: 'x' },
    { label: 'Apply Unit η_X (Singleton inject)', val: '[x] in F(X)' },
    { label: 'Concatenate word structure', val: '[x, x, x] in F(X)' },
    { label: 'Apply Counit ε_M (Evaluation map)', val: 'x * x * x = x³ in M' }
  ];

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Unit (η) & Counit (ε) Cycle' : '単位 η と余単位 ε の循環サイクル'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Step through. η includes raw elements; ε evaluates (quotients) structures back to elements.'
            : '順を追って進めます。単位 η は要素を構造へ包摂し、余単位 ε は構造を演算値へと商化（簡約）します。'}
        </p>

        {/* Button */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button 
            disabled={step >= steps.length - 1} 
            onClick={() => setStep(s => s + 1)}
            className="btn btn-primary"
            style={{ padding: '4px 12px', fontSize: '0.7rem' }}
          >
            Next Step
          </button>
          <button onClick={() => setStep(0)} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>Reset</button>
        </div>

        {/* Steps display */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', minHeight: '125px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {steps.slice(0, step + 1).map((s, idx) => (
            <div key={idx} className="animate-pop-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', marginBottom: '4px', opacity: idx === step ? 1 : 0.4 }}>
              <span style={{ minWidth: '160px' }}>{s.label}</span>
              <ArrowRight size={10} />
              <span className="font-mono font-bold text-white">{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 24: Monads
// ============================================================================
export function MonadsVisualizer({ language }: VisualizerProps) {
  const [flattened, setFlattened] = useState<boolean>(false);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Monad Multiplication (μ: T² → T)' : 'モナドの積写像による多重構文の崩壊'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {language === 'en'
            ? 'Monad multiplication μ flattens nested words of words (redundant syntax) into a single flat word.'
            : 'モナドの乗法 μ は、入れ子になった記号列（多重構文）を1階のフラットな記号列へと平坦化（商化）します。'}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => setFlattened(f => !f)}
            className="btn btn-primary"
            style={{ padding: '4px 12px', fontSize: '0.7rem' }}
          >
            {flattened ? 'Reset' : (language === 'en' ? 'Apply multiplication μ (Flatten)' : '乗法 μ を適用（平坦化）')}
          </button>
        </div>

        {/* Nesting display */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {!flattened ? (
            <div>
              <span style={{ fontSize: '0.6rem', color: 'var(--secondary)' }}>NESTED STRUCTURE (T²X)</span>
              <div className="font-mono text-xs text-white" style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '4px', margin: '4px 0' }}>
                [ [a, b], [c], [d, e] ]
              </div>
            </div>
          ) : (
            <div className="animate-pop-in">
              <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>FLATTENED STRUCTURE (TX)</span>
              <div className="font-mono text-xs text-white" style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '4px', margin: '4px 0', border: '1px solid var(--success)' }}>
                [ a, b, c, d, e ]
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
