import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

interface MappingsProps {
  language: 'en' | 'ja';
}

export default function MappingsSandbox({ language }: MappingsProps) {
  const [setA, setSetA] = useState<string[]>(['a1', 'a2', 'a3']);
  const [setB, setSetB] = useState<string[]>(['b1', 'b2', 'b3']);
  const [morphisms, setMorphisms] = useState<Record<string, string>>({
    'a1': 'b1',
    'a2': 'b2',
    'a3': 'b3'
  });
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null);
  const [isInverted, setIsInverted] = useState(false);

  // Add elements
  const addNodeA = () => {
    if (setA.length < 6) {
      const nextId = `a${setA.length + 1}`;
      setSetA([...setA, nextId]);
    }
  };
  const removeNodeA = () => {
    if (setA.length > 1) {
      const target = setA[setA.length - 1];
      setSetA(setA.slice(0, -1));
      const nextM = { ...morphisms };
      delete nextM[target];
      setMorphisms(nextM);
      if (selectedSrc === target) setSelectedSrc(null);
    }
  };

  const addNodeB = () => {
    if (setB.length < 6) {
      const nextId = `b${setB.length + 1}`;
      setSetB([...setB, nextId]);
    }
  };
  const removeNodeB = () => {
    if (setB.length > 1) {
      const target = setB[setB.length - 1];
      setSetB(setB.slice(0, -1));
      // Reset any mapping that points to this removed node
      const nextM = { ...morphisms };
      Object.keys(nextM).forEach(k => {
        if (nextM[k] === target) {
          delete nextM[k];
        }
      });
      setMorphisms(nextM);
    }
  };

  // Create/update mapping on click
  const handleSrcClick = (src: string) => {
    if (isInverted) return; // Cannot edit while inverted
    setSelectedSrc(src);
  };

  const handleDstClick = (dst: string) => {
    if (selectedSrc && !isInverted) {
      setMorphisms({
        ...morphisms,
        [selectedSrc]: dst
      });
      setSelectedSrc(null);
    }
  };

  // Classify mapping properties
  const analysis = useMemo(() => {
    const isComplete = setA.every(node => !!morphisms[node]);

    if (!isComplete) {
      return {
        complete: false,
        injective: false,
        surjective: false,
        bijective: false,
        tag: language === 'en' ? 'INCOMPLETE FUNCTION' : '不完全な関数',
        desc: language === 'en' 
          ? 'Morphism must assign a codomain element to ALL domain elements.' 
          : '関数であるためには、定義域のすべての要素に対して値が割り当てられている必要があります。',
        color: '#ef4444'
      };
    }

    const targets = setA.map(node => morphisms[node]);
    const uniqueTargets = new Set(targets);
    
    const isInjective = uniqueTargets.size === targets.length;
    const isSurjective = setB.every(bNode => uniqueTargets.has(bNode));
    const isBijective = isInjective && isSurjective;

    let tag = '';
    let desc = '';
    let color = 'var(--primary)';

    if (isBijective) {
      tag = language === 'en' ? 'BIJECTIVE / ISOMORPHISM' : '全単射 / 同型写像';
      desc = language === 'en'
        ? 'Perfect 1-to-1 match. The mapping is invertible (an isomorphism in Set).'
        : '完全な1対1の対応。この写像は可逆です（集合の圏における同型射）。';
      color = '#ffbf00'; // gold
    } else if (isInjective) {
      tag = language === 'en' ? 'INJECTIVE / MONOMORPHISM' : '単射 / 単射モノ射';
      desc = language === 'en'
        ? 'Distinct inputs map to distinct outputs. A left-inverse exists.'
        : '異なる入力が必ず異なる出力にマッピングされています。左逆写像が存在します。';
      color = '#10b981'; // green
    } else if (isSurjective) {
      tag = language === 'en' ? 'SURJECTIVE / EPIMORPHISM' : '全射 / 全射エピ射';
      desc = language === 'en'
        ? 'All target elements are covered. A right-inverse (section) exists.'
        : '余域のすべての要素がカバーされています。右逆写像が存在します。';
      color = '#10b981';
    } else {
      tag = language === 'en' ? 'STANDARD FUNCTION' : '一般の写像';
      desc = language === 'en'
        ? 'A valid function, but neither injective nor surjective.'
        : '妥当な関数ですが、単射でも全射でもありません。';
      color = '#3b82f6'; // blue
    }

    return {
      complete: true,
      injective: isInjective,
      surjective: isSurjective,
      bijective: isBijective,
      tag,
      desc,
      color
    };
  }, [morphisms, setA, setB, language]);

  // Invert action
  const handleInvert = () => {
    if (analysis.bijective) {
      setIsInverted(!isInverted);
    }
  };

  const clearMappings = () => {
    setMorphisms({});
    setSelectedSrc(null);
    setIsInverted(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', color: 'white', background: 'rgba(15,15,20,0.85)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)' }}>
            {language === 'en' ? 'Concept II: Mappings & Functions Sandbox' : '概念II: 写像と関数のサンドボックス'}
          </h3>
          <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 'bold' }}>
            SEMANTIC MAPPING
          </span>
        </div>
        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {language === 'en'
            ? 'Build a function $f: A \\to B$. Investigate injectivity (monomorphism), surjectivity (epimorphism), and bijectivity (isomorphism).'
            : '写像 $f: A \\to B$ を構築します。単射性（モノ射）、全射性（エピ射）、そして全単射性（同型射）の性質を観察します。'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1, minHeight: '350px' }}>
        
        {/* Left column: Setup and properties controls */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Node Count Config */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.25rem' }}>Domain Set A</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={addNodeA} disabled={setA.length >= 5 || isInverted} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '3px', cursor: 'pointer', padding: '2px 6px', fontSize: '0.65rem' }}>+ Add</button>
                <button onClick={removeNodeA} disabled={setA.length <= 1 || isInverted} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '3px', cursor: 'pointer', padding: '2px 6px', fontSize: '0.65rem' }}>- Remove</button>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.25rem' }}>Codomain Set B</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={addNodeB} disabled={setB.length >= 5 || isInverted} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '3px', cursor: 'pointer', padding: '2px 6px', fontSize: '0.65rem' }}>+ Add</button>
                <button onClick={removeNodeB} disabled={setB.length <= 1 || isInverted} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '3px', cursor: 'pointer', padding: '2px 6px', fontSize: '0.65rem' }}>- Remove</button>
              </div>
            </div>
          </div>

          {/* Tutorial Helper */}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <strong>{language === 'en' ? 'Instruction:' : '使い方:'}</strong><br/>
            {isInverted ? (
              <span>{language === 'en' ? 'Viewing the inverse mapping f⁻¹. Click "Reset/Invert" to return.' : '逆写像 f⁻¹ を表示中です。解除するには「元に戻す」をクリックしてください。'}</span>
            ) : (
              <span>
                {language === 'en' 
                  ? 'Click a node in Set A (amber), then click a target node in Set B (green) to draw a mapping arrow.' 
                  : '集合 A（黄色）のノードをクリックしてから、集合 B（緑）のノードをクリックしてマッピングを設定します。'}
              </span>
            )}
          </div>

          {/* Classification Tags and feedback */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
              {language === 'en' ? 'Property Classification:' : '写像の分類:'}
            </span>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: `1px solid ${analysis.color}`,
              borderRadius: '6px',
              padding: '0.75rem',
              boxShadow: `0 0 12px ${analysis.color}15`,
              transition: 'all 0.3s ease'
            }}>
              <span style={{ color: analysis.color, fontWeight: 'bold', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>
                {analysis.tag}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4', display: 'block' }}>
                {analysis.desc}
              </span>
            </div>

            {/* Invert Button */}
            {analysis.bijective && (
              <button
                onClick={handleInvert}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  background: isInverted ? 'rgba(255,191,0,0.2)' : '#ffbf00',
                  border: '1px solid #ffbf00',
                  color: isInverted ? '#ffbf00' : 'black',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 0 8px rgba(255,191,0,0.3)'
                }}
              >
                <RefreshCw size={12} className={isInverted ? 'animate-spin' : ''} />
                {isInverted 
                  ? (language === 'en' ? 'Restore Original f' : '元に戻す') 
                  : (language === 'en' ? 'Invert Mapping (f⁻¹)' : '逆写像を適用する (f⁻¹)')}
              </button>
            )}
          </div>

          <button onClick={clearMappings} style={{ fontSize: '0.65rem', alignSelf: 'flex-start', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            {language === 'en' ? 'Clear Mappings' : 'マッピングをクリア'}
          </button>
        </div>

        {/* Right column: Interactive Bipartite Canvas */}
        <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              {isInverted 
                ? (language === 'en' ? 'Inverse Mapping Canvas (f⁻¹ : B → A)' : '逆写像表示 (f⁻¹ : B → A)') 
                : (language === 'en' ? 'Mapping Canvas (f : A → B)' : '写像表示 (f : A → B)')}
            </span>
          </div>

          <div style={{ flex: 1, position: 'relative', minHeight: '260px' }}>
            <svg width="100%" height="100%" viewBox="0 0 350 260" style={{ display: 'block' }}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(255, 191, 0, 0.9)" />
                </marker>
                <marker id="arrow-green" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
              </defs>

              {/* Draw connection lines */}
              {Object.entries(morphisms).map(([aNode, bNode]) => {
                const idxA = setA.indexOf(aNode);
                const idxB = setB.indexOf(bNode);
                if (idxA === -1 || idxB === -1) return null;

                // Node positions
                const countA = setA.length;
                const countB = setB.length;

                const x1 = 60;
                const y1 = 40 + idxA * (180 / Math.max(1, countA - 1));

                const x2 = 290;
                const y2 = 40 + idxB * (180 / Math.max(1, countB - 1));

                return (
                  <line
                    key={`${aNode}-${bNode}`}
                    x1={isInverted ? x2 : x1}
                    y1={isInverted ? y2 : y1}
                    x2={isInverted ? x1 : x2}
                    y2={isInverted ? y1 : y2}
                    stroke={analysis.bijective ? 'rgba(255, 191, 0, 0.7)' : '#3b82f6'}
                    strokeWidth={2}
                    markerEnd={analysis.bijective ? 'url(#arrow)' : 'url(#arrow-green)'}
                    style={{ transition: 'all 0.5s ease' }}
                  />
                );
              })}

              {/* Draw Set A Nodes (Left side normally) */}
              {setA.map((node, idx) => {
                const count = setA.length;
                const cy = 40 + idx * (180 / Math.max(1, count - 1));
                const cx = 60;
                const isSelected = selectedSrc === node;

                return (
                  <g key={node} style={{ cursor: isInverted ? 'default' : 'pointer' }} onClick={() => handleSrcClick(node)}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={18}
                      fill={isSelected ? '#f59e0b' : 'rgba(245,158,11,0.1)'}
                      stroke="#f59e0b"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      style={{ transition: 'all 0.2s ease', filter: isSelected ? 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' : 'none' }}
                    />
                    <text cx={cx} cy={cy} textAnchor="middle" dy="4" fill={isSelected ? 'black' : 'white'} fontSize="0.7rem" fontWeight="bold">
                      {node}
                    </text>
                  </g>
                );
              })}

              {/* Draw Set B Nodes (Right side normally) */}
              {setB.map((node, idx) => {
                const count = setB.length;
                const cy = 40 + idx * (180 / Math.max(1, count - 1));
                const cx = 290;
                const isTargetable = !!selectedSrc;

                return (
                  <g key={node} style={{ cursor: isTargetable ? 'pointer' : 'default' }} onClick={() => handleDstClick(node)}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={18}
                      fill="rgba(16,185,129,0.1)"
                      stroke="#10b981"
                      strokeWidth={1.5}
                      style={{
                        transition: 'all 0.2s ease',
                        animation: isTargetable ? 'pulse-green 1.5s infinite' : 'none'
                      }}
                    />
                    <text cx={cx} cy={cy} textAnchor="middle" dy="4" fill="white" fontSize="0.7rem" fontWeight="bold">
                      {node}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
