import { useState, useEffect, useMemo, useRef } from 'react';

interface Node {
  id: number;
  x: number; // original X
  y: number; // original Y
  currentX: number; // animated X
  currentY: number; // animated Y
  label: string;
  color: string;
}

interface Link {
  from: number;
  to: number;
}

interface QuotientsProps {
  language: 'en' | 'ja';
}

const COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#ffbf00', // gold
  '#10b981', // green
  '#a855f7', // purple
  '#f97316', // orange
];

export default function QuotientsSandbox({ language }: QuotientsProps) {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, x: 80, y: 70, currentX: 80, currentY: 70, label: 'x1', color: COLORS[0] },
    { id: 2, x: 130, y: 150, currentX: 130, currentY: 150, label: 'x2', color: COLORS[1] },
    { id: 3, x: 260, y: 80, currentX: 260, currentY: 80, label: 'x3', color: COLORS[2] },
    { id: 4, x: 80, y: 200, currentX: 80, currentY: 200, label: 'x4', color: COLORS[3] },
    { id: 5, x: 250, y: 180, currentX: 250, currentY: 180, label: 'x5', color: COLORS[4] },
    { id: 6, x: 180, y: 110, currentX: 180, currentY: 110, label: 'x6', color: COLORS[5] }
  ]);
  const [links, setLinks] = useState<Link[]>([
    { from: 1, to: 2 },
    { from: 3, to: 5 }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [isQuotiented, setIsQuotiented] = useState(false);
  const animRef = useRef<number | null>(null);

  // Compute equivalence classes via connected components
  const equivalenceClasses = useMemo(() => {
    const parent: Record<number, number> = {};
    nodes.forEach(n => { parent[n.id] = n.id; });

    const find = (i: number): number => {
      if (parent[i] === i) return i;
      return find(parent[i]);
    };

    const union = (i: number, j: number) => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
      }
    };

    links.forEach(link => union(link.from, link.to));

    const classesMap: Record<number, number[]> = {};
    nodes.forEach(n => {
      const root = find(n.id);
      if (!classesMap[root]) {
        classesMap[root] = [];
      }
      classesMap[root].push(n.id);
    });

    return Object.values(classesMap);
  }, [nodes, links]);

  // Map each node ID to its equivalence class index
  const nodeClassIndices = useMemo(() => {
    const map: Record<number, number> = {};
    equivalenceClasses.forEach((cls, classIdx) => {
      cls.forEach(id => {
        map[id] = classIdx;
      });
    });
    return map;
  }, [equivalenceClasses]);

  // Click canvas to spawn a new node
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isQuotiented) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Don't spawn node too close to an existing one
    const isTooClose = nodes.some(n => Math.hypot(n.x - x, n.y - y) < 30);
    if (!isTooClose && nodes.length < 12) {
      const nextId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 1;
      const newNode: Node = {
        id: nextId,
        x,
        y,
        currentX: x,
        currentY: y,
        label: `x${nextId}`,
        color: COLORS[nextId % COLORS.length]
      };
      setNodes([...nodes, newNode]);
    }
  };

  // Node clicks to draw equivalence links
  const handleNodeClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (isQuotiented) return;

    if (selectedNodeId === null) {
      setSelectedNodeId(id);
    } else {
      if (selectedNodeId !== id) {
        // Toggle relation link
        const existsIndex = links.findIndex(l => 
          (l.from === selectedNodeId && l.to === id) || (l.from === id && l.to === selectedNodeId)
        );
        if (existsIndex === -1) {
          setLinks([...links, { from: selectedNodeId, to: id }]);
        } else {
          setLinks(links.filter((_, idx) => idx !== existsIndex));
        }
      }
      setSelectedNodeId(null);
    }
  };

  // Spring animation effect loop
  useEffect(() => {
    const updatePhysics = () => {
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          let targetX = node.x;
          let targetY = node.y;

          if (isQuotiented) {
            // Find class centroid
            const classIdx = nodeClassIndices[node.id];
            const cls = equivalenceClasses[classIdx] || [node.id];
            
            let sumX = 0;
            let sumY = 0;
            cls.forEach(id => {
              const buddy = prevNodes.find(n => n.id === id);
              if (buddy) {
                sumX += buddy.x;
                sumY += buddy.y;
              }
            });
            targetX = sumX / cls.length;
            targetY = sumY / cls.length;
          }

          // Ease towards target
          const dx = targetX - node.currentX;
          const dy = targetY - node.currentY;

          return {
            ...node,
            currentX: node.currentX + dx * 0.12,
            currentY: node.currentY + dy * 0.12
          };
        });
      });
      animRef.current = requestAnimationFrame(updatePhysics);
    };

    animRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isQuotiented, equivalenceClasses, nodeClassIndices]);

  const clearRelations = () => {
    setLinks([]);
    setSelectedNodeId(null);
    setIsQuotiented(false);
  };

  // Compute centroid and size for each class bubble
  const classBubbles = useMemo(() => {
    return equivalenceClasses.map((cls, idx) => {
      if (cls.length === 0) return null;
      let sumX = 0;
      let sumY = 0;
      cls.forEach(id => {
        const n = nodes.find(node => node.id === id);
        if (n) {
          sumX += n.currentX;
          sumY += n.currentY;
        }
      });
      const cx = sumX / cls.length;
      const cy = sumY / cls.length;

      // Find max distance from centroid to define radius
      let maxDist = 20;
      cls.forEach(id => {
        const n = nodes.find(node => node.id === id);
        if (n) {
          const d = Math.hypot(n.currentX - cx, n.currentY - cy);
          if (d > maxDist) maxDist = d;
        }
      });

      return {
        cx,
        cy,
        r: maxDist + 22,
        color: COLORS[idx % COLORS.length]
      };
    }).filter(Boolean);
  }, [equivalenceClasses, nodes]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', color: 'white', background: 'rgba(15,15,20,0.85)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)' }}>
            {language === 'en' ? 'Concept III: Quotients & Coequalizers' : '概念III: 商集合とコイコライザー'}
          </h3>
          <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 'bold' }}>
            SEMANTIC COLLAPSE
          </span>
        </div>
        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {language === 'en'
            ? 'Define equivalence relations $x \\sim y$ by drawing links. Click "Quotient" to animate the spring collapse into equivalence classes.'
            : 'リンクを描いて同値関係 $x \\sim y$ を定義します。「商写像」をクリックすると、同値類へ収縮するスプリング物理アニメーションが動作します。'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '1rem', flex: 1, minHeight: '350px' }}>
        
        {/* Left Control Panel */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setIsQuotiented(!isQuotiented)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                background: isQuotiented ? 'rgba(16,185,129,0.2)' : 'var(--primary)',
                border: isQuotiented ? '1px solid #10b981' : '1px solid var(--primary)',
                color: isQuotiented ? '#10b981' : 'black',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              {isQuotiented 
                ? (language === 'en' ? 'Expand to Raw (X)' : '未接着に戻す (X)') 
                : (language === 'en' ? 'Quotient Collapse (X/R)' : '商化してつぶす (X/R)')}
            </button>
            <button onClick={clearRelations} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
              Reset
            </button>
          </div>

          {/* Interactive Tutorial Box */}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <strong>{language === 'en' ? 'How to play:' : '操作方法:'}</strong><br/>
            {isQuotiented ? (
              <span>{language === 'en' ? 'Equivalence classes are clustered. Translucent regions are open sets in the quotient topology.' : '同値関係にあるノードが1点に集約されました。半透明の領域が商位相空間の開集合を成します。'}</span>
            ) : (
              <span>
                1. {language === 'en' ? 'Click on open space to add a node (max 12).' : '空いている場所をクリックしてノードを追加します。'}<br/>
                2. {language === 'en' ? 'Click node A then node B to declare equation A ∼ B.' : 'あるノードをクリックし、別のノードをクリックすると関係（接着線）が描かれます。'}
              </span>
            )}
          </div>

          {/* Equivalence Classes list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto' }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
              {language === 'en' ? 'Equivalence Classes:' : '同値類一覧:'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {equivalenceClasses.map((cls, idx) => {
                const names = cls.map(id => nodes.find(n => n.id === id)?.label || '').join(', ');
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }}></span>
                    <span>[{cls[0]}]: </span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{`{ ${names} }`}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: 'rgba(16,185,129,0.02)', borderLeft: '3px solid #10b981', padding: '0.4rem 0.6rem', borderRadius: '0 4px 4px 0', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 'bold', color: '#10b981', display: 'block', marginBottom: '0.15rem' }}>Coequalizer Universal Property</span>
            {language === 'en' ? (
              <span>{"Quotient projection $\\pi: X \\to X/\\sim$ is the coequalizer of links. For any $f: X \\to Y$ respecting relations, there is a unique \\bar{f}: X/\\sim \\to Y$."}</span>
            ) : (
              <span>{"正準射影 $\\pi: X \\to X/\\sim$ は関係式の余等化子です。関係式を保存する任意の写像 $f: X \\to Y$ に対し、一意な \\bar{f}: X/\\sim \\to Y$ が存在します。"}</span>
            )}
          </div>
        </div>

        {/* Right Topological Canvas */}
        <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              {language === 'en' ? 'Topological Quotient Coordinate Space' : 'トポロジー・商空間キャンバス'}
            </span>
          </div>

          <div style={{ flex: 1, position: 'relative', minHeight: '260px' }}>
            <svg
              width="100%"
              height="100%"
              onClick={handleCanvasClick}
              style={{ display: 'block', cursor: isQuotiented ? 'default' : 'crosshair' }}
            >
              {/* Grid */}
              <defs>
                <pattern id="grid-green" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(16,185,129,0.02)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-green)" />

              {/* Draw Quotient Open Sets (translucent regions) */}
              {isQuotiented && classBubbles.map((bubble, idx) => {
                if (!bubble) return null;
                return (
                  <circle
                    key={idx}
                    cx={bubble.cx}
                    cy={bubble.cy}
                    r={bubble.r}
                    fill={`${bubble.color}0a`}
                    stroke={`${bubble.color}2b`}
                    strokeWidth={1.5}
                    strokeDasharray="4,4"
                    style={{ transition: 'all 0.5s ease', filter: `drop-shadow(0 0 8px ${bubble.color}05)` }}
                  />
                );
              })}

              {/* Draw Equivalence Links */}
              {!isQuotiented && links.map((link, idx) => {
                const nodeF = nodes.find(n => n.id === link.from);
                const nodeT = nodes.find(n => n.id === link.to);
                if (!nodeF || !nodeT) return null;
                return (
                  <line
                    key={idx}
                    x1={nodeF.currentX}
                    y1={nodeF.currentY}
                    x2={nodeT.currentX}
                    y2={nodeT.currentY}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth={1.5}
                    strokeDasharray="4,3"
                  />
                );
              })}

              {/* Draw Nodes */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <g key={node.id} onClick={(e) => handleNodeClick(e, node.id)} style={{ cursor: isQuotiented ? 'default' : 'pointer' }}>
                    <circle
                      cx={node.currentX}
                      cy={node.currentY}
                      r={14}
                      fill={node.color}
                      stroke={isSelected ? '#fff' : 'rgba(0,0,0,0.5)'}
                      strokeWidth={isSelected ? 2 : 1}
                      style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))' }}
                    />
                    <text
                      x={node.currentX}
                      y={node.currentY}
                      textAnchor="middle"
                      dy="4"
                      fill="black"
                      fontSize="0.65rem"
                      fontWeight="bold"
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
