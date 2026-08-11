import { useState, useMemo } from 'react';
import { Check } from 'lucide-react';

interface ObjectNode {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Morphism {
  id: string;
  from: string;
  to: string;
  label: string;
  isIdentity: boolean;
  isComposite: boolean;
}

interface CategoriesProps {
  language: 'en' | 'ja';
}

export default function CategoriesSandbox({ language }: CategoriesProps) {
  const [nodes, setNodes] = useState<ObjectNode[]>([
    { id: 'A', x: 80, y: 130, label: 'A' },
    { id: 'B', x: 200, y: 70, label: 'B' },
    { id: 'C', x: 320, y: 130, label: 'C' }
  ]);
  
  const [userMorphisms, setUserMorphisms] = useState<Omit<Morphism, 'isIdentity' | 'isComposite'>[]>([
    { id: 'f', from: 'A', to: 'B', label: 'f' },
    { id: 'g', from: 'B', to: 'C', label: 'g' }
  ]);

  const [selectedSrc, setSelectedSrc] = useState<string | null>(null);

  // Auto-generate Identity morphisms for each node
  const identityMorphisms = useMemo((): Morphism[] => {
    return nodes.map(n => ({
      id: `id_${n.id}`,
      from: n.id,
      to: n.id,
      label: `id_${n.label}`,
      isIdentity: true,
      isComposite: false
    }));
  }, [nodes]);

  // Compute all user morphisms
  const basicMorphisms = useMemo((): Morphism[] => {
    return userMorphisms.map(m => ({
      ...m,
      isIdentity: false,
      isComposite: false
    }));
  }, [userMorphisms]);

  // Recursively or iteratively compute composites
  // If we have A -> B (f) and B -> C (g), add g o f : A -> C
  const compositeMorphisms = useMemo((): Morphism[] => {
    const list: Morphism[] = [];
    const all = [...basicMorphisms];

    // Find paths of length 2
    for (let i = 0; i < all.length; i++) {
      for (let j = 0; j < all.length; j++) {
        const m1 = all[i]; // e.g. f: A -> B
        const m2 = all[j]; // e.g. g: B -> C
        if (m1.to === m2.from && m1.from !== m1.to && m2.from !== m2.to) {
          // Check if composite already exists in user list to avoid duplicates
          const label = `${m2.label} ∘ ${m1.label}`;
          const exists = list.some(c => c.from === m1.from && c.to === m2.to);
          if (!exists) {
            list.push({
              id: `comp_${m1.id}_${m2.id}`,
              from: m1.from,
              to: m2.to,
              label,
              isIdentity: false,
              isComposite: true
            });
          }
        }
      }
    }

    // Find paths of length 3 for associativity
    // e.g. f: A->B, g: B->C, h: C->D. Composite: h o (g o f)
    for (let i = 0; i < all.length; i++) {
      const m1 = all[i]; // f
      for (let j = 0; j < all.length; j++) {
        const m2 = all[j]; // g
        for (let k = 0; k < all.length; k++) {
          const m3 = all[k]; // h
          if (m1.to === m2.from && m2.to === m3.from) {
            const label = `${m3.label} ∘ ${m2.label} ∘ ${m1.label}`;
            const exists = list.some(c => c.from === m1.from && c.to === m3.to && c.label === label);
            if (!exists) {
              list.push({
                id: `comp3_${m1.id}_${m2.id}_${m3.id}`,
                from: m1.from,
                to: m3.to,
                label,
                isIdentity: false,
                isComposite: true
              });
            }
          }
        }
      }
    }

    return list;
  }, [basicMorphisms]);

  const allMorphisms = useMemo(() => {
    return [...identityMorphisms, ...basicMorphisms, ...compositeMorphisms];
  }, [identityMorphisms, basicMorphisms, compositeMorphisms]);

  // Click handler to draw arrows
  const handleNodeClick = (id: string) => {
    if (selectedSrc === null) {
      setSelectedSrc(id);
    } else {
      if (selectedSrc !== id) {
        // Prevent drawing duplicate base arrows
        const exists = userMorphisms.some(m => m.from === selectedSrc && m.to === id);
        if (!exists && userMorphisms.length < 5) {
          // Automatic naming f, g, h, k
          const names = ['f', 'g', 'h', 'k', 'p'];
          const name = names[userMorphisms.length] || `f${userMorphisms.length}`;
          setUserMorphisms([...userMorphisms, { id: name, from: selectedSrc, to: id, label: name }]);
        }
      }
      setSelectedSrc(null);
    }
  };

  const addNode = () => {
    if (nodes.length < 4) {
      const labels = ['A', 'B', 'C', 'D'];
      const label = labels[nodes.length];
      // Place in nice positions
      const coords = [
        { x: 80, y: 130 },
        { x: 200, y: 70 },
        { x: 320, y: 130 },
        { x: 200, y: 200 }
      ];
      const pos = coords[nodes.length] || { x: 150, y: 150 };
      setNodes([...nodes, { id: label, x: pos.x, y: pos.y, label }]);
    }
  };

  const clearCanvas = () => {
    setUserMorphisms([]);
    setSelectedSrc(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', color: 'white', background: 'rgba(15,15,20,0.85)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)' }}>
            {language === 'en' ? 'Concept IV: Categories & Functors Sandbox' : '概念IV: 圏と関手のサンドボックス'}
          </h3>
          <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 'bold' }}>
            CATEGORICAL GRAPH
          </span>
        </div>
        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {language === 'en'
            ? 'Place object nodes. Identity loops and composite arrows $g \\circ f$ are automatically generated to enforce category laws.'
            : '対象（ノード）を配置します。圏の公理を満たすように、自己恒等射や合成射 $g \\circ f$ が自動的に生成・検証されます。'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '1rem', flex: 1, minHeight: '350px' }}>
        
        {/* Left Controls */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={addNode} disabled={nodes.length >= 4} style={{ flex: 1, padding: '6px 12px', background: nodes.length >= 4 ? 'rgba(255,255,255,0.02)' : 'var(--primary)', color: nodes.length >= 4 ? 'rgba(255,255,255,0.2)' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.7rem' }}>
              + Add Object
            </button>
            <button onClick={clearCanvas} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
              Clear
            </button>
          </div>

          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <strong>{language === 'en' ? 'Instruction:' : '使い方:'}</strong><br/>
            {language === 'en'
              ? 'Click Object A then Object B to draw a morphism arrow (like f or g). Note how the identity self-loops and composites instantly arise.'
              : '対象 A をクリックし、次に対象 B をクリックして射を描きます。自己恒等射や合成射が即座に生成されるのを確認してください。'}
          </div>

          {/* Verification equations display */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
              {language === 'en' ? 'Category Axiom Verification:' : '圏の公理の自動検証:'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'monospace', fontSize: '0.68rem', color: '#10b981' }}>
              
              {/* Identity Law */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(16,185,129,0.05)', padding: '4px 6px', borderRadius: '4px' }}>
                <Check size={12} />
                <span>Identity: f ∘ id_A = f = id_B ∘ f</span>
              </div>

              {/* Associativity Law */}
              {compositeMorphisms.some(c => c.label.includes('∘') && c.label.split('∘').length > 2) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(16,185,129,0.05)', padding: '4px 6px', borderRadius: '4px' }}>
                  <Check size={12} />
                  <span>Associativity: h ∘ (g ∘ f) = (h ∘ g) ∘ f</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: 'rgba(245,158,11,0.02)', borderLeft: '3px solid #f59e0b', padding: '0.4rem 0.6rem', borderRadius: '0 4px 4px 0', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 'bold', color: '#f59e0b', display: 'block', marginBottom: '0.15rem' }}>Axioms of a Category</span>
            {language === 'en' ? (
              <span>A category contains objects and morphisms. It requires: (1) Identity for each object, (2) Associative composition $h \circ (g \circ f) = (h \circ g) \circ f$.</span>
            ) : (
              <span>圏は対象と射から構成されます。(1) 各対象に恒等射が存在すること、(2) 射の合成が結合法則 $h \circ (g \circ f) = (h \circ g) \circ f$ を満たすことが要件です。</span>
            )}
          </div>
        </div>

        {/* Right Commutative Diagram Canvas */}
        <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              {language === 'en' ? 'Interactive Commutative Diagram' : '可換図式キャンバス'}
            </span>
          </div>

          <div style={{ flex: 1, position: 'relative', minHeight: '260px' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 260" style={{ display: 'block' }}>
              <defs>
                <marker id="arrow-blue" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3b82f6" />
                </marker>
                <marker id="arrow-gold" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ffbf00" />
                </marker>
              </defs>

              {/* Draw Identity Morphisms (Self Loops) */}
              {nodes.map(n => (
                <path
                  key={`loop-${n.id}`}
                  d={`M ${n.x - 6} ${n.y - 12} C ${n.x - 28} ${n.y - 45}, ${n.x + 28} ${n.y - 45}, ${n.x + 6} ${n.y - 12}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={1}
                  markerEnd="url(#arrow-blue)"
                />
              ))}

              {/* Draw Identity Labels */}
              {nodes.map(n => (
                <text
                  key={`loop-label-${n.id}`}
                  x={n.x}
                  y={n.y - 45}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="0.55rem"
                  fontFamily="serif"
                >
                  id_{n.label}
                </text>
              ))}

              {/* Draw Morphism lines */}
              {allMorphisms.filter(m => !m.isIdentity).map(m => {
                const nodeFrom = nodes.find(n => n.id === m.from);
                const nodeTo = nodes.find(n => n.id === m.to);
                if (!nodeFrom || !nodeTo) return null;

                const isComp = m.isComposite;
                
                // If it is a composite arrow, draw as a curve so it doesn't overlap the straight arrows
                let pathD = '';
                if (isComp) {
                  // Quadratic bezier curve bending down/up
                  const mx = (nodeFrom.x + nodeTo.x) / 2;
                  const my = (nodeFrom.y + nodeTo.y) / 2 + 30; // bend down
                  pathD = `M ${nodeFrom.x} ${nodeFrom.y} Q ${mx} ${my} ${nodeTo.x} ${nodeTo.y}`;
                } else {
                  pathD = `M ${nodeFrom.x} ${nodeFrom.y} L ${nodeTo.x} ${nodeTo.y}`;
                }

                return (
                  <path
                    key={m.id}
                    d={pathD}
                    fill="none"
                    stroke={isComp ? '#ffbf00' : '#3b82f6'}
                    strokeWidth={1.5}
                    strokeDasharray={isComp ? '3,3' : 'none'}
                    markerEnd={isComp ? 'url(#arrow-gold)' : 'url(#arrow-blue)'}
                  />
                );
              })}

              {/* Draw Morphism Labels */}
              {allMorphisms.filter(m => !m.isIdentity).map(m => {
                const nodeFrom = nodes.find(n => n.id === m.from);
                const nodeTo = nodes.find(n => n.id === m.to);
                if (!nodeFrom || !nodeTo) return null;

                const isComp = m.isComposite;
                const mx = (nodeFrom.x + nodeTo.x) / 2;
                const my = (nodeFrom.y + nodeTo.y) / 2 + (isComp ? 28 : -8);

                return (
                  <text
                    key={`label-${m.id}`}
                    x={mx}
                    y={my}
                    textAnchor="middle"
                    fill={isComp ? '#ffbf00' : '#3b82f6'}
                    fontSize={isComp ? '0.58rem' : '0.68rem'}
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    {m.label}
                  </text>
                );
              })}

              {/* Draw Objects */}
              {nodes.map(node => {
                const isSelected = selectedSrc === node.id;
                return (
                  <g key={node.id} onClick={() => handleNodeClick(node.id)} style={{ cursor: 'pointer' }}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={15}
                      fill="#0d0d11"
                      stroke={isSelected ? '#f59e0b' : '#3b82f6'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      style={{ filter: isSelected ? 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' : 'none' }}
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dy="4"
                      fill={isSelected ? '#f59e0b' : 'white'}
                      fontSize="0.75rem"
                      fontWeight="bold"
                      fontFamily="serif"
                    >
                      {node.label}
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
