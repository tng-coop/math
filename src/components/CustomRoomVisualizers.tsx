import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeftRight, Lock, Sparkles, BookOpen, X, Play, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';


interface VisualizerProps {
  language: 'en' | 'ja';
  onNavigate?: (room: number) => void;
  hoveredSymbol?: string | null;
}

// ============================================================================
// ROOM 1: Ontological Cycle
// ============================================================================
export type TermNode =
  | { type: 'generator'; value: 'a' | 'b'; id: string }
  | { type: 'unary'; op: 'f' | 'g'; child: TermNode; id: string }
  | { type: 'binary'; op: '•'; left: TermNode; right: TermNode; id: string }
  | { type: 'collapsed'; value: string; id: string };

interface FloatingTree {
  id: string;
  node: TermNode;
  x: number;
  y: number;
  vx: number;
  vy: number;
  animMode: 'left' | 'to-funnel' | 'to-bubble' | 'right';
  animProgress: number;
  startX?: number;
  startY?: number;
  targetX?: number;
  targetY?: number;
}

const MathView = ({ formula, displayMode = false, style = {} }: {
  formula: string;
  displayMode?: boolean;
  style?: React.CSSProperties;
}) => {
  const html = (window as any).katex 
    ? (window as any).katex.renderToString(formula, { displayMode, throwOnError: false }) 
    : formula
        .replace(/\\begin\{matrix\}([\s\S]*?)\\end\{matrix\}/g, (_, inner) => {
          return inner
            .replace(/&/g, '  ')
            .replace(/\\\\/g, '\n')
            .replace(/\\begin\{matrix\}/g, '')
            .replace(/\\end\{matrix\}/g, '');
        })
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\bullet/g, '•')
        .replace(/\\dashv/g, '⊣')
        .replace(/\\langle/g, '⟨')
        .replace(/\\rangle/g, '⟩')
        .replace(/\\rightrightarrows/g, '⇉')
        .replace(/\\rightarrows/g, '⇉')
        .replace(/\\xrightarrow\{([^}]+)\}/g, '──$1──>')
        .replace(/\\searrow/g, '↘')
        .replace(/\\swarrow/g, '↙')
        .replace(/\\exists!/g, '∃!')
        .replace(/\\forall/g, '∀')
        .replace(/\\bar\{h\}/g, 'h̄')
        .replace(/\\pi/g, 'π')
        .replace(/\\sim/g, '~')
        .replace(/\\quad/g, ' ')
        .replace(/\\;/g, ' ');
  
  return (
    <span 
      style={{ 
        display: displayMode ? 'block' : 'inline-block',
        verticalAlign: displayMode ? 'block' : 'middle',
        whiteSpace: displayMode ? 'pre' : 'normal',
        ...style 
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// Stringify a TermNode recursively for comparison
const termToKey = (node: TermNode): string => {
  if (node.type === 'generator') return node.value;
  if (node.type === 'collapsed') return node.value;
  if (node.type === 'unary') return `${node.op}(${termToKey(node.child)})`;
  if (node.type === 'binary') {
    const l = termToKey(node.left);
    const r = termToKey(node.right);
    return `(${l}${node.op}${r})`;
  }
  return '';
};

// Stringify to LaTeX format for nice equations
const termToMath = (node: TermNode): string => {
  if (node.type === 'generator') return node.value;
  if (node.type === 'collapsed') return node.value;
  if (node.type === 'unary') return `${node.op}(${termToMath(node.child)})`;
  if (node.type === 'binary') {
    return `${termToMath(node.left)} \\bullet ${termToMath(node.right)}`;
  }
  return '';
};

// Congruence Closure Solver running to a fixed point
const normalizeTerm = (
  node: TermNode, 
  relations: { idempotence: boolean; commutativity: boolean; spinCollapse: boolean }
): TermNode => {
  const step = (n: TermNode): TermNode => {
    if (n.type === 'generator' || n.type === 'collapsed') return n;
    
    if (n.type === 'unary') {
      const childNorm = step(n.child);
      if (relations.spinCollapse && n.op === 'f' && childNorm.type === 'generator' && childNorm.value === 'a') {
        return { type: 'generator', value: 'b', id: n.id };
      }
      return { type: 'unary', op: n.op, child: childNorm, id: n.id };
    }
    
    if (n.type === 'binary') {
      const leftNorm = step(n.left);
      const rightNorm = step(n.right);
      
      if (relations.spinCollapse && n.op === '•') {
        const lKey = termToKey(leftNorm);
        const rKey = termToKey(rightNorm);
        if ((lKey === 'a' && rKey === 'b') || (lKey === 'b' && rKey === 'a')) {
          return { type: 'collapsed', value: 'c', id: n.id };
        }
      }
      
      if (relations.idempotence && n.op === '•') {
        if (termToKey(leftNorm) === termToKey(rightNorm)) {
          return leftNorm;
        }
      }
      
      if (relations.commutativity && n.op === '•') {
        if (termToKey(leftNorm) > termToKey(rightNorm)) {
          return { type: 'binary', op: '•', left: rightNorm, right: leftNorm, id: n.id };
        }
      }
      
      return { type: 'binary', op: '•', left: leftNorm, right: rightNorm, id: n.id };
    }
    return n;
  };

  let current = node;
  let prevKey = '';
  for (let i = 0; i < 5; i++) {
    const nextNode = step(current);
    const nextKey = termToKey(nextNode);
    if (nextKey === prevKey) {
      break;
    }
    current = nextNode;
    prevKey = nextKey;
  }
  return current;
};

const getTreeDepth = (node: TermNode): number => {
  if (node.type === 'generator' || node.type === 'collapsed') return 0;
  if (node.type === 'unary') return 1 + getTreeDepth(node.child);
  if (node.type === 'binary') {
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  }
  return 0;
};

// Space out equivalence class bubbles vertically or in a grid in the right box (217 to 352)
const getClassBubblePosition = (index: number, total: number) => {
  const centerX = 285;
  if (total <= 1) {
    return { x: centerX, y: 110 };
  }
  if (total === 2) {
    return { x: centerX, y: index === 0 ? 65 : 155 };
  }
  if (total === 3) {
    return { x: centerX, y: 55 + index * 55 };
  }
  
  // Grid layout for 4 or more
  const cols = 2;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const rows = Math.ceil(total / cols);
  const x = 250 + col * 70;
  const y = 55 + row * (110 / Math.max(1, rows - 1));
  return { x, y };
};

const BlockyTheLegoMascot = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" style={{ marginRight: '8px', flexShrink: 0 }}>
    <rect x="8" y="12" width="24" height="20" rx="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
    <rect x="12" y="8" width="5" height="4" rx="1" fill="#b91c1c" />
    <rect x="23" y="8" width="5" height="4" rx="1" fill="#b91c1c" />
    <circle cx="16" cy="18" r="2" fill="#fff" />
    <circle cx="16" cy="18" r="0.8" fill="#000" />
    <circle cx="24" cy="18" r="2" fill="#fff" />
    <circle cx="24" cy="18" r="0.8" fill="#000" />
    <circle cx="13" cy="22" r="1" fill="#f43f5e" opacity="0.6" />
    <circle cx="27" cy="22" r="1" fill="#f43f5e" opacity="0.6" />
    <path d="M 17,23 Q 20,26 23,23" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const RexTheDinoMascot = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" style={{ marginRight: '8px', flexShrink: 0 }}>
    <path d="M 10,35 C 10,20 18,10 28,10 C 33,10 38,13 38,18 C 38,22 34,25 30,25 C 28,28 28,32 30,35 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
    <circle cx="28" cy="16" r="2.5" fill="#fff" />
    <circle cx="28.5" cy="15.5" r="1" fill="#000" />
    <circle cx="25" cy="20" r="1.5" fill="#f43f5e" opacity="0.6" />
    <path d="M 27,21 Q 30,22 32,20" fill="none" stroke="#15803d" strokeWidth="1" strokeLinecap="round" />
    <path d="M 12,22 L 9,20 L 11,26 L 8,24 L 10,30" fill="#eab308" />
  </svg>
);

const PhotiThePhotonMascot = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" style={{ marginRight: '8px', flexShrink: 0 }}>
    <circle cx="20" cy="20" r="14" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
    <circle cx="20" cy="20" r="18" fill="rgba(234,179,8,0.2)" />
    <circle cx="15" cy="18" r="2" fill="#fff" />
    <circle cx="15" cy="18" r="0.8" fill="#000" />
    <circle cx="25" cy="18" r="2" fill="#fff" />
    <circle cx="25" cy="18" r="0.8" fill="#000" />
    <path d="M 17,24 Q 20,27 23,24" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="20" y1="2" x2="20" y2="5" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5" y1="20" x2="2" y2="20" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="35" y1="20" x2="38" y2="20" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ClayeyTheBullaMascot = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" style={{ marginRight: '8px', flexShrink: 0 }}>
    <rect x="8" y="8" width="24" height="24" rx="4" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1" />
    <rect x="12" y="12" width="16" height="8" rx="1" fill="#78716c" opacity="0.3" />
    <circle cx="15" cy="22" r="2" fill="#fff" />
    <circle cx="15" cy="22" r="0.8" fill="#000" />
    <circle cx="25" cy="22" r="2" fill="#fff" />
    <circle cx="25" cy="22" r="0.8" fill="#000" />
    <path d="M 17,27 Q 20,30 23,27" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const SpeakerIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const BouncingArrow = ({ color = 'var(--primary)' }: { color?: string }) => (
  <div className="bouncing-pointer" style={{ display: 'inline-block', filter: `drop-shadow(0 0 5px ${color})` }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  </div>
);

export function OntologicalCycleVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [trees, setTrees] = useState<FloatingTree[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeRelations, setActiveRelations] = useState({
    idempotence: false,
    commutativity: false,
    spinCollapse: false
  });
  const [isCoequalizerActive, setIsCoequalizerActive] = useState(false);
  const [narrativeMode, setNarrativeMode] = useState<'toy' | 'neuro' | 'sumerian'>('toy');
  const [activeConcept, setActiveConcept] = useState<number | null>(null);
  const [selectedClassKey, setSelectedClassKey] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState<number | null>(null);
  const [showNotationGuide, setShowNotationGuide] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [storyMode, setStoryMode] = useState<'kid' | 'graduate'>('kid');

  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMaximized]);

  useEffect(() => {
    if (wizardStep === null && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [wizardStep]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/\$[^$]+\$/g, '')
        .replace(/[🧸🎓🌟🟥🦖🪙📐🪵🏛️🧠📖⛶]/g, '')
        .replace(/\*/g, '')
        .replace(/F\(X\)/g, 'F of X')
        .replace(/~|\\sim/g, 'tilde');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'en' ? 'en-US' : 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const wizardStepRef = useRef<number | null>(null);

  useEffect(() => {
    wizardStepRef.current = wizardStep;
  }, [wizardStep]);

  // Sync state transitions on wizard step change
  useEffect(() => {
    if (wizardStep !== null && wizardStep <= 3) {
      if (wizardStep === 1 || wizardStep === 2) {
        setActiveRelations({ idempotence: false, commutativity: false, spinCollapse: false });
      }
      if (isCoequalizerActive) {
        setIsCoequalizerActive(false);
        setSelectedClassKey(null);
      }
      setTrees(prev =>
        prev.map(t => {
          const isExpanded = wizardStep <= 3;
          const tx = 20 + Math.random() * (isExpanded ? 300 : 60);
          const ty = 25 + Math.random() * 30;
          return {
            ...t,
            animMode: 'left',
            animProgress: 0,
            x: tx,
            y: ty,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
          };
        })
      );
    } else if (wizardStep === 4) {
      setActiveRelations(prev => ({ ...prev, spinCollapse: true }));
      setIsCoequalizerActive(true);
      const tempRelations = { idempotence: activeRelations.idempotence, commutativity: activeRelations.commutativity, spinCollapse: true };
      const currentClasses = getEquivalenceClasses(trees, tempRelations);
      setTrees(prev =>
        prev.map(t => {
          const norm = normalizeTerm(t.node, tempRelations);
          const key = termToKey(norm);
          const classIdx = currentClasses.findIndex(c => c.key === key);
          const bubblePos = getClassBubblePosition(classIdx, currentClasses.length);

          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 8;
          const tx = bubblePos.x + Math.cos(angle) * dist;
          const ty = bubblePos.y + Math.sin(angle) * dist;

          return {
            ...t,
            animMode: 'to-funnel',
            animProgress: 0,
            startX: t.x,
            startY: t.y,
            targetX: tx,
            targetY: ty
          };
        })
      );
    } else if (wizardStep === 5) {
      setIsCoequalizerActive(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardStep]);

  // Initialize with some default trees
  useEffect(() => {
    const initialNodes: TermNode[] = [
      { type: 'generator', value: 'a', id: 'init-a' },
      { type: 'generator', value: 'b', id: 'init-b' },
      {
        type: 'binary',
        op: '•',
        left: { type: 'generator', value: 'a', id: 'sub-a' },
        right: { type: 'generator', value: 'b', id: 'sub-b' },
        id: 'init-ab'
      }
    ];

    setTrees(
      initialNodes.map((node, i) => ({
        id: node.id,
        node,
        x: 20 + i * 25,
        y: 25 + (i % 2) * 20,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        animMode: 'left',
        animProgress: 0
      }))
    );
  }, []);

  // Physics and slide transitions loop
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setTrees(prev =>
        prev.map(t => {
          if (t.animMode === 'left') {
            let x = t.x + t.vx;
            let y = t.y + t.vy;
            let vx = t.vx;
            let vy = t.vy;

            // Bounded inside Left syntax box
            const currentWizardStep = wizardStepRef.current;
            const isExpanded = currentWizardStep !== null && currentWizardStep <= 3;
            const minX = 15;
            const maxX = isExpanded ? 325 : 85;
            const minY = 22;
            const maxY = 60;

            if (x < minX || x > maxX) vx = -vx;
            if (y < minY || y > maxY) vy = -vy;

            x = Math.max(minX, Math.min(maxX, x));
            y = Math.max(minY, Math.min(maxY, y));

            return { ...t, x, y, vx, vy };
          } else if (t.animMode === 'to-funnel') {
            const newProgress = Math.min(1, t.animProgress + 0.03);
            const startX = t.startX ?? t.x;
            const startY = t.startY ?? t.y;
            const x = startX * (1 - newProgress) + 180 * newProgress;
            const y = startY * (1 - newProgress) + 110 * newProgress;

            if (newProgress >= 1) {
              return {
                ...t,
                x: 180,
                y: 110,
                animMode: 'to-bubble',
                animProgress: 0,
                startX: 180,
                startY: 110
              };
            }
            return { ...t, x, y, animProgress: newProgress };
          } else if (t.animMode === 'to-bubble') {
            const newProgress = Math.min(1, t.animProgress + 0.03);
            const startX = t.startX ?? 180;
            const startY = t.startY ?? 110;
            const tx = t.targetX ?? 285;
            const ty = t.targetY ?? 110;
            const x = startX * (1 - newProgress) + tx * newProgress;
            const y = startY * (1 - newProgress) + ty * newProgress;

            if (newProgress >= 1) {
              return {
                ...t,
                x: tx,
                y: ty,
                animMode: 'right',
                animProgress: 0
              };
            }
            return { ...t, x, y, animProgress: newProgress };
          } else {
            // animMode === 'right': locally float around targetX, targetY
            const tx = t.targetX ?? 285;
            const ty = t.targetY ?? 110;
            const time = performance.now() * 0.002;
            const seed = parseFloat(t.id.replace(/[^0-9]/g, '')) || 1;
            const dx = Math.sin(time + seed) * 3;
            const dy = Math.cos(time * 0.8 + seed) * 3;
            return {
              ...t,
              x: tx + dx,
              y: ty + dy
            };
          }
        })
      );
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute equivalence groups
  const classes = getEquivalenceClasses(trees, activeRelations);

  function getEquivalenceClasses(
    items: FloatingTree[],
    relations: { idempotence: boolean; commutativity: boolean; spinCollapse: boolean }
  ) {
    const groups: { [key: string]: { key: string; normalizedNode: TermNode; members: FloatingTree[] } } = {};
    items.forEach(t => {
      const norm = normalizeTerm(t.node, relations);
      const key = termToKey(norm);
      if (!groups[key]) {
        groups[key] = { key, normalizedNode: norm, members: [] };
      }
      groups[key].members.push(t);
    });
    return Object.values(groups);
  }

  // Handle morph transitions on Coequalizer toggle
  const handleToggleCoequalizer = () => {
    const nextActive = !isCoequalizerActive;
    setIsCoequalizerActive(nextActive);

    if (nextActive) {
      const currentClasses = getEquivalenceClasses(trees, activeRelations);
      setTrees(prev =>
        prev.map(t => {
          const norm = normalizeTerm(t.node, activeRelations);
          const key = termToKey(norm);
          const classIdx = currentClasses.findIndex(c => c.key === key);
          const bubblePos = getClassBubblePosition(classIdx, currentClasses.length);

          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 8;
          const tx = bubblePos.x + Math.cos(angle) * dist;
          const ty = bubblePos.y + Math.sin(angle) * dist;

          return {
            ...t,
            animMode: 'to-funnel',
            animProgress: 0,
            startX: t.x,
            startY: t.y,
            targetX: tx,
            targetY: ty
          };
        })
      );
    } else {
      setTrees(prev =>
        prev.map(t => {
          const isExpanded = (wizardStep !== null && wizardStep <= 3);
          const tx = 20 + Math.random() * (isExpanded ? 300 : 60);
          const ty = 25 + Math.random() * 30;
          return {
            ...t,
            animMode: 'left',
            animProgress: 0,
            x: tx,
            y: ty,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
          };
        })
      );
      setSelectedClassKey(null);
    }
  };

  // Add generator term to Syntax space
  const addGen = (char: 'a' | 'b') => {
    if (trees.length >= 15) return;
    const id = 'gen-' + Math.random().toString(36).substr(2, 9);
    const isExpanded = wizardStep !== null && wizardStep <= 3;
    const startX = 20 + Math.random() * (isExpanded ? 300 : 60);
    const startY = 25 + Math.random() * 30;

    const newTree: FloatingTree = {
      id,
      node: { type: 'generator', value: char, id },
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      animMode: isCoequalizerActive ? 'to-funnel' : 'left',
      animProgress: 0,
      startX,
      startY
    };

    if (isCoequalizerActive) {
      const temp = [...trees, newTree];
      const updatedClasses = getEquivalenceClasses(temp, activeRelations);
      const norm = normalizeTerm(newTree.node, activeRelations);
      const key = termToKey(norm);
      const classIdx = updatedClasses.findIndex(c => c.key === key);
      const bubblePos = getClassBubblePosition(classIdx, updatedClasses.length);
      newTree.targetX = bubblePos.x + (Math.random() - 0.5) * 10;
      newTree.targetY = bubblePos.y + (Math.random() - 0.5) * 10;

      setTrees(prev => {
        const updated = prev.map(t => {
          const tNorm = normalizeTerm(t.node, activeRelations);
          const tKey = termToKey(tNorm);
          const tIdx = updatedClasses.findIndex(c => c.key === tKey);
          const tBubblePos = getClassBubblePosition(tIdx, updatedClasses.length);
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 8;
          return {
            ...t,
            targetX: tBubblePos.x + Math.cos(angle) * dist,
            targetY: tBubblePos.y + Math.sin(angle) * dist
          };
        });
        return [...updated, newTree];
      });
    } else {
      setTrees(prev => [...prev, newTree]);
    }
  };

  // Apply unary operation (Spin / Paint)
  const applyUnary = (op: 'f' | 'g') => {
    if (selectedIds.size !== 1) return;
    const selectedId = Array.from(selectedIds)[0];
    const selected = trees.find(t => t.id === selectedId);
    if (!selected) return;

    const newId = 'unary-' + Math.random().toString(36).substr(2, 9);
    const newNode: TermNode = {
      type: 'unary',
      op,
      child: selected.node,
      id: newId
    };

    setTrees(prev =>
      prev.map(t => {
        if (t.id === selectedId) {
          return {
            ...t,
            id: newId,
            node: newNode,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3
          };
        }
        return t;
      })
    );
    setSelectedIds(new Set());
  };

  // Apply binary operation (Combine)
  const combineSelected = () => {
    if (selectedIds.size !== 2) return;
    const selectedList = trees.filter(t => selectedIds.has(t.id));
    if (selectedList.length !== 2) return;

    const [t1, t2] = selectedList;
    const newId = 'binary-' + Math.random().toString(36).substr(2, 9);
    const newNode: TermNode = {
      type: 'binary',
      op: '•',
      left: t1.node,
      right: t2.node,
      id: newId
    };

    setTrees(prev => {
      const remaining = prev.filter(t => !selectedIds.has(t.id));
      return [
        ...remaining,
        {
          id: newId,
          node: newNode,
          x: (t1.x + t2.x) / 2,
          y: (t1.y + t2.y) / 2,
          vx: (t1.vx + t2.vx) / 2,
          vy: (t1.vy + t2.vy) / 2,
          animMode: 'left',
          animProgress: 0
        }
      ];
    });
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    if (isCoequalizerActive) return; // syntax edits locked in semantic view
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < 2) {
          next.add(id);
        } else {
          const first = next.values().next().value;
          if (first !== undefined) next.delete(first);
          next.add(id);
        }
      }
      return next;
    });
  };

  const toggleRelation = (rel: 'idempotence' | 'commutativity' | 'spinCollapse') => {
    const next = { ...activeRelations, [rel]: !activeRelations[rel] };
    setActiveRelations(next);

    if (isCoequalizerActive) {
      const updatedClasses = getEquivalenceClasses(trees, next);
      setTrees(prev =>
        prev.map(t => {
          const norm = normalizeTerm(t.node, next);
          const key = termToKey(norm);
          const classIdx = updatedClasses.findIndex(c => c.key === key);
          const bubblePos = getClassBubblePosition(classIdx, updatedClasses.length);

          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 8;
          return {
            ...t,
            targetX: bubblePos.x + Math.cos(angle) * dist,
            targetY: bubblePos.y + Math.sin(angle) * dist,
            animMode: t.animMode === 'right' ? 'to-bubble' : t.animMode,
            animProgress: t.animMode === 'right' ? 0 : t.animProgress,
            startX: t.x,
            startY: t.y
          };
        })
      );
    }
  };

  const clearGen = () => {
    setTrees([]);
    setSelectedIds(new Set());
    setSelectedClassKey(null);
  };

  const isSyntaxHovered =
    hoveredSymbol === 'X' ||
    hoveredSymbol === 'F(X)' ||
    hoveredSymbol === 'free-functor' ||
    hoveredSymbol === 'signature' ||
    hoveredSymbol === 'arity' ||
    hoveredSymbol === 'term-algebra' ||
    hoveredSymbol === 'finite' ||
    hoveredSymbol === 'operation' ||
    activeConcept === 1 ||
    activeConcept === 2 ||
    activeConcept === 3;

  const isSemanticsHovered =
    hoveredSymbol === 'R' ||
    hoveredSymbol === '\\langle R \\rangle' ||
    hoveredSymbol === 'F(X)/\\langle R \\rangle' ||
    hoveredSymbol === 'congruence-relation' ||
    hoveredSymbol === 'quotient' ||
    hoveredSymbol === 'coequalizer' ||
    hoveredSymbol === '\\pi' ||
    activeConcept === 4 ||
    activeConcept === 5 ||
    activeConcept === 6 ||
    activeConcept === 7;

  // Render nodes visual depending on narrativeMode
  const drawNodeGraphic = (
    node: TermNode,
    isSpun: boolean,
    isPainted: boolean,
    size: number
  ) => {
    const transform = isSpun ? 'rotate(180)' : '';

    if (node.type === 'generator' || node.type === 'collapsed') {
      const val = node.value;
      if (narrativeMode === 'toy') {
        if (val === 'a') {
          const fill = isPainted ? '#10b981' : '#ef4444';
          const stroke = isPainted ? '#a7f3d0' : '#fca5a5';
          const studFill = isPainted ? '#047857' : '#991b1b';
          return (
            <g transform={transform}>
              <rect x={-size} y={-size / 1.5} width={size * 2} height={size * 1.3} rx={1.5} fill={fill} stroke={stroke} strokeWidth="0.8" />
              <circle cx={-size / 2} cy={-size / 1.5} r={size / 4} fill={studFill} />
              <circle cx={size / 2} cy={-size / 1.5} r={size / 4} fill={studFill} />
            </g>
          );
        } else if (val === 'b') {
          const fill = isPainted ? '#8b5cf6' : '#3b82f6';
          const stroke = isPainted ? '#ddd6fe' : '#93c5fd';
          return (
            <g transform={transform}>
              <path
                d={`M ${-size},${size / 2} C ${-size},${-size} ${-size / 2},${-size} 0,${-size} C ${size / 2},${-size} ${size},${-size / 2} ${size},0 C ${size},${size / 2} ${size / 2},${size} ${-size / 2},${size} Z`}
                fill={fill}
                stroke={stroke}
                strokeWidth="0.8"
              />
              <circle cx={size / 3} cy={-size / 3} r="1.2" fill="#fff" />
            </g>
          );
        } else {
          // Spaceship!
          return (
            <g transform={transform}>
              <ellipse cx="0" cy="0" rx={size * 1.2} ry={size * 0.55} fill="#10b981" stroke="#a7f3d0" strokeWidth="0.8" />
              <ellipse cx="0" cy={-size * 0.25} rx={size * 0.5} ry={size * 0.25} fill="#3b82f6" stroke="#93c5fd" strokeWidth="0.5" />
              <path d={`M ${-size * 1.0} 0 L ${-size * 1.4} ${size * 0.6} L ${-size * 0.7} ${size * 0.3} Z`} fill="#f59e0b" />
              <path d={`M ${size * 1.0} 0 L ${size * 1.4} ${size * 0.6} L ${size * 0.7} ${size * 0.3} Z`} fill="#f59e0b" />
            </g>
          );
        }
      } else if (narrativeMode === 'neuro') {
        if (val === 'a') {
          const fill = isPainted ? '#ec4899' : '#eab308';
          const glowColor = isPainted ? 'rgba(236,72,153,0.3)' : 'rgba(234,179,8,0.3)';
          return (
            <g transform={transform}>
              <circle cx="0" cy="0" r={size * 1.2} fill={glowColor} filter="blur(1px)" />
              {isSpun ? (
                <g>
                  <line x1="0" y1={-size} x2="0" y2={size} stroke={fill} strokeWidth="1" strokeDasharray="1,1" />
                  <circle cx="0" cy={-size / 2} r="1.5" fill="#fff" />
                  <circle cx="0" cy="0" r="1.5" fill={fill} />
                  <circle cx="0" cy={size / 2} r="1.5" fill="#fff" />
                </g>
              ) : (
                <g>
                  <circle cx={-size / 2.5} cy={-size / 2.5} r="1.2" fill={fill} />
                  <circle cx={size / 2.5} cy={-size / 3} r="1" fill={fill} />
                  <circle cx={-size / 4} cy={size / 2.5} r="1.2" fill={fill} />
                  <circle cx={size / 3} cy={size / 3} r="1.1" fill={fill} />
                  <circle cx="0" cy="-0.5" r="1.3" fill="#fff" />
                </g>
              )}
            </g>
          );
        } else if (val === 'b') {
          const fill = isPainted ? '#a78bfa' : '#06b6d4';
          const glowColor = isPainted ? 'rgba(167,139,250,0.3)' : 'rgba(6,182,212,0.3)';
          return (
            <g transform={transform}>
              <circle cx="0" cy="0" r={size * 1.2} fill={glowColor} filter="blur(1px)" />
              {isSpun ? (
                <g>
                  <line x1={-size} y1="0" x2={size} y2="0" stroke={fill} strokeWidth="1" strokeDasharray="1,1" />
                  <circle cx={-size / 2} cy="0" r="1.5" fill="#fff" />
                  <circle cx="0" cy="0" r="1.5" fill={fill} />
                  <circle cx={size / 2} cy="0" r="1.5" fill="#fff" />
                </g>
              ) : (
                <g>
                  <circle cx={-size / 3} cy={-size / 2.5} r="1.1" fill={fill} />
                  <circle cx={size / 2.5} cy={-size / 2.5} r="1.2" fill={fill} />
                  <circle cx={-size / 2.5} cy={size / 3} r="1" fill={fill} />
                  <circle cx={size / 3} cy={size / 2.5} r="1.3" fill={fill} />
                  <circle cx="-0.5" cy="0" r="1.4" fill="#fff" />
                </g>
              )}
            </g>
          );
        } else {
          // Neural Synapse / Wave
          const fill = '#10b981';
          const glowColor = 'rgba(16,185,129,0.4)';
          return (
            <g transform={transform}>
              <circle cx="0" cy="0" r={size * 1.5} fill={glowColor} filter="blur(2px)" />
              <path d={`M ${-size} 0 Q ${-size/2} ${-size} 0 0 T ${size} 0`} fill="none" stroke={fill} strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2.5" fill="#fff" />
            </g>
          );
        }
      } else {
        const fill = isPainted ? '#c2410c' : '#78716c';
        const stroke = isPainted ? '#ea580c' : '#a8a29e';
        const shadowColor = '#292524';
        if (val === 'a') {
          return (
            <g transform={transform}>
              <rect x={-size / 1.5} y={-size} width={size * 1.3} height={size * 2} rx={1.5} fill={fill} stroke={stroke} strokeWidth="0.8" />
              <ellipse cx="0" cy={-size} rx={size / 1.5} ry={size / 4} fill={stroke} />
              {isSpun && <line x1={-size / 2} y1="0" x2={size / 2} y2="0" stroke={shadowColor} strokeWidth="0.6" />}
            </g>
          );
        } else if (val === 'b') {
          return (
            <g transform={transform}>
              <path d={`M 0,${-size} L ${-size / 1.2},${size} Q 0,${size * 1.3} ${size / 1.2},${size} Z`} fill={fill} stroke={stroke} strokeWidth="0.8" />
              <ellipse cx="0" cy={size} rx={size / 1.2} ry={size / 3} fill={stroke} />
              {isSpun && <circle cx="0" cy="0" r="1" fill={shadowColor} />}
            </g>
          );
        } else {
          // Clay envelope / bulla
          return (
            <g transform={transform}>
              <circle cx="0" cy="0" r={size * 1.2} fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1.2" />
              <rect x={-size*0.6} y={-size*0.4} width={size*1.2} height={size*0.8} fill="#78716c" rx="1" />
              <line x1={-size*0.4} y1="0" x2={size*0.4} y2="0" stroke="#f5f5f4" strokeWidth="0.8" />
            </g>
          );
        }
      }
    }
    return null;
  };

  // Recursively draw SVG term trees
  const drawRecursiveTree = (
    node: TermNode,
    x: number,
    y: number,
    depth: number = 0,
    scale: number = 1,
    isSpun = false,
    isPainted = false
  ): React.ReactNode => {
    const horizontalSpacing = 16 / (depth + 1);
    const verticalSpacing = 14;

    if (node.type === 'generator' || node.type === 'collapsed') {
      return (
        <g key={node.id} transform={`translate(${x}, ${y}) scale(${scale})`}>
          {drawNodeGraphic(node, isSpun, isPainted, 10)}
        </g>
      );
    }

    if (node.type === 'unary') {
      const nextSpun = node.op === 'f' ? !isSpun : isSpun;
      const nextPainted = node.op === 'g' ? !isPainted : isPainted;

      return (
        <g key={node.id}>
          {/* Connection line down to child */}
          <line
            x1={x}
            y1={y}
            x2={x}
            y2={y + verticalSpacing}
            stroke={narrativeMode === 'neuro' ? '#06b6d4' : 'rgba(255,255,255,0.2)'}
            strokeWidth="0.8"
          />
          {/* Unary operator node */}
          <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            <circle cx="0" cy="0" r="5" fill={node.op === 'f' ? '#f59e0b' : '#ec4899'} stroke="#fff" strokeWidth="0.5" />
            <text x="0" y="1.8" fill="#fff" fontSize="6" fontWeight="bold" textAnchor="middle">
              {node.op}
            </text>
          </g>
          {drawRecursiveTree(node.child, x, y + verticalSpacing, depth + 1, scale * 0.85, nextSpun, nextPainted)}
        </g>
      );
    }

    return (
      <g key={node.id}>
        {/* Draw connection lines to child branches */}
        <line x1={x} y1={y} x2={x - horizontalSpacing} y2={y + verticalSpacing} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        <line x1={x} y1={y} x2={x + horizontalSpacing} y2={y + verticalSpacing} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />

        {/* Binary operation node */}
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
          <circle cx="0" cy="0" r="5.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
          <text x="0" y="2" fill="#fff" fontSize="7" fontWeight="bold" textAnchor="middle">
            {node.op}
          </text>
        </g>

        {/* Children */}
        {drawRecursiveTree(node.left, x - horizontalSpacing, y + verticalSpacing, depth + 1, scale * 0.85, isSpun, isPainted)}
        {drawRecursiveTree(node.right, x + horizontalSpacing, y + verticalSpacing, depth + 1, scale * 0.85, isSpun, isPainted)}
      </g>
    );
  };

  const getWizardContent = () => {
    if (storyMode === 'kid') {
      switch (wizardStep) {
        case 1:
          return {
            titleEn: '\\text{Step 1: The Toy Box (Syntax } F(X) \\text{)}',
            titleJa: '\\text{ステップ1：おもちゃ箱（構文 } F(X) \\text{）}',
            promptEn: "Click '+ Block' and '+ Dino' to spawn toys, then select them and click 'Combine' to plug them together.",
            promptJa: "「+ Block」と「+ Dino」をクリックしておもちゃを生み出し、選択して「Combine」をクリックしてガッチャンコしよう！",
            pedagogyEn: "Welcome to the Toy Box! Click '+ Block' and '+ Dino' to spawn toys. Select them and click 'Combine' to plug them together. Here, you have total freedom to build any crazy toy tree you want!",
            pedagogyJa: "おもちゃ箱へようこそ！「+ Block」や「+ Dino」をクリックしておもちゃを生み出そう。2つ選んで「Combine」を押すと、ガッチャンコしてつなげられるよ。ここでは、どんなおもしろいおもちゃの木も、じゆうにつくっていいんだよ！"
          };
        case 2:
          return {
            titleEn: '\\text{Step 2: The Chaos of Play}',
            titleJa: '\\text{ステップ2：ごっこ遊びのごちゃごちゃ}',
            promptEn: "Observe the toys floating in the Toy Box.",
            promptJa: "おもちゃ箱にふわふわ浮いているおもちゃを観察してみよう。",
            pedagogyEn: "But wait! If you build a Block-Dino combo and call it a 'Spaceship', and your friend calls it a 'Monster', how can we play together? Pure freedom is too chaotic—we need rules!",
            pedagogyJa: "でもちょっとまって！きみがブロックと恐竜を合体させて「宇宙船」とよんだのに、お友達が「かいじゅう」ってよんだら、いっしょに遊べないよね？みんなが自由にバラバラなことを言うとごちゃごちゃになっちゃう。だからルールが必要んだ！"
          };
        case 3:
          return {
            titleEn: '\\text{Step 3: The Magic Rule (Relation } R \\text{)}',
            titleJa: '\\text{ステップ3：まほうのルール（関係式 } R \\text{）}',
            promptEn: "Select the Spaceship Rule (a • b = c) button below to set our agreement.",
            promptJa: "下の「宇宙船ルール (a • b = c)」ボタンを押して、みんなのやくそくをきめよう。",
            pedagogyEn: "Let's make a rule: whenever a Block and a Dino combine, they fuse into a Spaceship! Select the Spaceship Rule button to set our agreement.",
            pedagogyJa: "ルールをきめよう：「ブロックと恐竜をガッチャンコしたら、ぜんぶ宇宙船に変身する」ことにしよう！「宇宙船ルール」のボタンを押して、みんなでやくそくを結んでね。"
          };
        case 4:
          return {
            titleEn: '\\text{Step 4: The Fusing Box (Quotient } F(X)/\\sim \\text{)}',
            titleJa: '\\text{ステップ4：がっちゃんこ箱（商代数 } F(X)/\\sim \\text{）}',
            promptEn: "Click 'Activate Coequalizer (Funnel)' to slide our toys into the magic fusing box.",
            promptJa: "「コイコライザー起動」をクリックして、おもちゃをまほうのすべり台からがっちゃんこ箱に入れよう！",
            pedagogyEn: "Click 'Activate Coequalizer (Funnel)'. Look! All our separate block-dino trees slide into the funnel and pop out as neat, shiny spaceships on the right. By setting rules, we turn chaotic combinations into shared meaning!",
            pedagogyJa: "「コイコライザー起動」を押してみて！ほら、バラバラだったブロックと恐竜の木たちが、すべり台をすべって、右側できれいな「宇宙船」に合体したよ！ルールを決めることで、バラバラだったおもちゃが、みんなで遊べる『いみ』になるんだ！"
          };
        case 5:
          return {
            titleEn: '\\text{Step 5: You are a Math Genius!}',
            titleJa: '\\text{ステップ5：きみは数学の天才だよ！}',
            promptEn: "Your brain does this every single day. You are using category theory!",
            promptJa: "きみの頭はまいにちこれをおこなっているんだよ。きみはもう数学 of 圏論の使い手だね！",
            pedagogyEn: "Your brain does this every day: it takes millions of light beams (photons) and groups them into 'mom', 'dad', and 'doggy'. You just modeled human category formation using category theory!",
            pedagogyJa: "きみの脳みそは、まいにちこれをおこなっているんだよ。目に入ってくる何百万もの光のつぶ（光子）を、「ママ」「パパ」「わんちゃん」ってグループにまとめているの。きみは今、人間がものごとをりかいするしくみを、数学の「圏論（けんろん）」という魔法のちからでうつしだしたんだ！"
          };
        default:
          return null;
      }
    } else {
      switch (wizardStep) {
        case 1:
          return {
            titleEn: '\\text{Step 1: Free Term Algebra } F(X) \\text{ Generation}',
            titleJa: '\\text{ステップ1：自由項代数 } F(X) \\text{ の生成}',
            promptEn: "Click generators, select two terms, and apply the binary operator \\bullet to build recursive tree terms.",
            promptJa: "生成元をクリックし、2つの項を選択してから、二項演算子 \\bullet を適用して再帰的木を構築してください。",
            pedagogyEn: "Let \\Sigma be a signature and X a set of generators. The free algebra F(X) = T(\\Sigma, X) is the term algebra generated by X under the operations of \\Sigma. In this space, every syntactic construction is distinct (no reduction relations are applied), yielding the initial object in the category of algebras equipped with a valuation map X \\to U(A).",
            pedagogyJa: "シグネチャを \\Sigma、生成元の集合を X とします。自由代数 F(X) = T(\\Sigma, X) は、\\Sigma の演算のもとで X から生成される項代数です。この空間では、すべての構文的構成が明確に区別され（簡約関係は未適用）、評価写像 X \\to U(A) を伴う代数の圏における始対象を与えます。"
          };
        case 2:
          return {
            titleEn: '\\text{Step 2: Adjunction } (F \\dashv U) \\text{ \\& Syntactic Infinity}',
            titleJa: '\\text{ステップ2：随伴関係 } (F \\dashv U) \\text{ と構文上の無限性}',
            promptEn: "Observe the algebraic term trees floating in syntax space without congruence relations.",
            promptJa: "合同関係式が存在しない状態で、構文空間に浮遊する代数的項木を観察してください。",
            pedagogyEn: "The free functor F: \\text{Set} \\to \\text{Alg}(\\Sigma) is left adjoint to the forgetful functor U: \\text{Alg}(\\Sigma) \\to \\text{Set} (F \\dashv U). This adjunction establishes a bijection \\text{Hom}_{\\text{Alg}}(F(X), A) \\cong \\text{Hom}_{\\text{Set}}(X, U(A)). Maps out of the free algebra are uniquely determined by assigning values to generators. Without relations, the size of F(X) grows exponentially, presenting no shared semantical invariants.",
            pedagogyJa: "自由関手 F: \\text{Set} \\to \\text{Alg}(\\Sigma) は忘却関手 U: \\text{Alg}(\\Sigma) \\to \\text{Set} に対して左随伴です (F \\dashv U)。この随伴関係は、全単射 \\text{Hom}_{\\text{Alg}}(F(X), A) \\cong \\text{Hom}_{\\text{Set}}(X, U(A)) を確立します。自由代数からの写像は生成元への値割り当てにより一意に決定されます。関係式がなければ、F(X) のサイズは指数関数的に増大し、共有される意味的不変量は生じません。"
          };
        case 3:
          return {
            titleEn: '\\text{Step 3: Congruence Relation } \\langle R \\rangle \\text{ \\& Algebraic Kernels}',
            titleJa: '\\text{ステップ3：合同関係式 } \\langle R \\rangle \\text{ と代数的核}',
            promptEn: "Activate the relation equation a \\bullet b = c to establish the equivalence relation kernel R.",
            promptJa: "関係式 a \\bullet b = c を有効にして、同値関係の核 R を確立してください。",
            pedagogyEn: "Let R \\subseteq F(X) \\times F(X) be a set of generator equations. To preserve the algebraic structure, we construct the congruence closure \\langle R \\rangle, which is the smallest equivalence relation containing R that is closed under all algebraic operations (i.e. s \\sim t \\implies f(s) \\sim f(t)). This acts as a kernel specifying which syntax terms must collapse.",
            pedagogyJa: "R \\subseteq F(X) \\times F(X) を生成元方程式の集合とする。代数的構造を維持するために、R を含む最小の同値関係であり、すべての代数演算の下で閉じている（s \\sim t \\implies f(s) \\sim f(t)）合同閉包 \\langle R \\rangle を構築します。これは、どの構文項が収縮すべきかを指定する核として機能します。"
          };
        case 4:
          return {
            titleEn: '\\text{Step 4: The Coequalizer Colimit } (\\pi)',
            titleJa: '\\text{ステップ4：コイコライザー余極限 } (\\pi)',
            promptEn: "Click 'Activate Coequalizer (π)' to project syntax trees into their quotient equivalence classes.",
            promptJa: "「コイコライザー起動 (π)」をクリックし、構文木をその商同値類へ射影します。",
            pedagogyEn: "The projection \\pi: F(X) \\to F(X)/\\langle R \\rangle is the coequalizer colimit of the parallel maps representing the relation R \\rightrightarrows F(X). The quotient algebra collapses syntactic terms into equivalence classes. The universal property guarantees a unique algebra homomorphism \\bar{h} factorizing any relation-preserving map h: F(X) \\to A.",
            pedagogyJa: "射影 \\pi: F(X) \\to F(X)/\\langle R \\rangle は、関係式を表す平行写像 R \\rightrightarrows F(X) のコイコライザー余極限です。商代数は構文項を同値類へと縮退させます。普遍随伴性は、関係を保存する任意の写像 h: F(X) \\to A を因数分解する一意の代数準同型写像 \\bar{h} の存在を保証します。"
          };
        case 5:
          return {
            titleEn: '\\text{Step 5: Epistemological Quotienting } (\\pi^{-1})',
            titleJa: '\\text{ステップ5：知覚・認識における商化 } (\\pi^{-1})',
            promptEn: "Click on the semantic equivalence class bubbles to inspect their fiber pre-images in the syntax space.",
            promptJa: "意味同値類バブルをクリックして、構文空間におけるファイバー（原像）を検査します。",
            pedagogyEn: "Perceptual categorization models this exact quotienting. The infinite-dimensional sensorium (Syntax F(X)) is quotiented by cognitive equivalence relations (e.g. Gestalt laws) to map into a finite set of concepts (Semantics). Click the semantic bubbles on the right to trace the fibers (pre-images \\pi^{-1}([t])) of the coequalizer projection map.",
            pedagogyJa: "知覚的カテゴリ化はこの商化そのものをモデル化します。無限次元の感覚入力（構文 F(X)）が、認知的同値関係（ゲシュタルト法則など）によって商化され、有限の概念集合（意味論）へとマッピングされます。右側のバブルをクリックして、コイコライザー射影写像のファイバー（原像 \\pi^{-1}([t])）を追跡してください。"
          };
        default:
          return null;
      }
    }
  };

  const concepts = [
    {
      id: 1,
      titleEn: 'Generators (X)',
      titleJa: '生成元 (X)',
      formula: 'X = \\{a, b\\}',
      descEn: 'Raw symbol terms. Represent Lego, light photon streams, or clay shapes.',
      descJa: '生の記号項。レゴ、光子ストリーム、または粘土の形状を表します。'
    },
    {
      id: 2,
      titleEn: 'Signature (Σ) & Arity',
      titleJa: 'シグネチャとアリティ',
      formula: '\\Sigma = \\{a^{(0)}, b^{(0)}, f^{(1)}, g^{(1)}, \\bullet^{(2)}\\}',
      descEn: 'Defines constants (arity 0), unary functions (arity 1), and binary operators (arity 2).',
      descJa: '定数（アリティ0）、単項演算（アリティ1）、二項演算（アリティ2）を規定します。'
    },
    {
      id: 3,
      titleEn: 'Free Term Algebra F(X)',
      titleJa: '自由項代数 F(X)',
      formula: 'F(X) = T(\\Sigma, X)',
      descEn: 'Infinite syntactic space of all possible unreduced syntax trees you can build.',
      descJa: '簡約を一切行わずに構築される、すべての可能な再帰的木の無限構文空間。'
    },
    {
      id: 4,
      titleEn: 'Quotient Relation (R)',
      titleJa: '商関係式 (R)',
      formula: 'R \\subseteq F(X) \\times F(X)',
      descEn: 'Equivalence equations (e.g. idempotence) that collapse syntax trees together.',
      descJa: '式ツリー同士を折りたたむための同値方程式（ベキ等関係など）。'
    },
    {
      id: 5,
      titleEn: 'Congruence Closure ⟨R⟩',
      titleJa: '合同閉包 ⟨R⟩',
      formula: '\\langle R \\rangle',
      descEn: 'Recursive propagation of equivalence through operations: s ~ t ➔ f(s) ~ f(t).',
      descJa: '演算による同値性の再帰的伝播：s ~ t ならば f(s) ~ f(t) も同値になります。'
    },
    {
      id: 6,
      titleEn: 'Quotient Algebra',
      titleJa: '商代数',
      formula: 'F(X)/\\langle R \\rangle',
      descEn: 'Fused semantic space of equivalence classes. Structure invariants collapse.',
      descJa: '同値類からなる融合された意味空間。構造の不変性が収縮します。'
    },
    {
      id: 7,
      titleEn: 'Coequalizer Map (π)',
      titleJa: '射影射 (π)',
      formula: '\\pi: F(X) \\to F(X)/\\langle R \\rangle',
      descEn: 'Morphism projection mapping syntax to semantics. Click bubbles to inspect pre-images.',
      descJa: '構文を意味に射影する普遍的射。バブルをクリックして原像を確認できます。'
    },
    {
      id: 8,
      titleEn: 'Perceptual Quotienting',
      titleJa: '知覚的商化',
      formula: '\\text{Photon} \\xrightarrow{\\pi} \\text{Shape}',
      descEn: 'Cognitive Gestalt where chaotic photons quotient into stable solid shapes.',
      descJa: '無秩序な光子流が安定した認知形状（ゲシュタルト）に商化されるプロセス。'
    },
    {
      id: 9,
      titleEn: 'Transactional Equiv.',
      titleJa: '取引同値関係',
      formula: '\\text{Tokens} \\xrightarrow{\\pi} \\text{Bulla}',
      descEn: 'Economic abstraction. Sealing clay tokens into clay Bullae yields integers.',
      descJa: '経済的抽象。粘土トークンを粘土球に封入することで抽象的な整数を生み出します。'
    }
  ];

  const getButtonLabelA = () => {
    if (narrativeMode === 'toy') return language === 'en' ? '+ Block 🟥' : '+ ブロック 🟥';
    if (narrativeMode === 'neuro') return language === 'en' ? '+ Photon A 🟡' : '+ 光子A 🟡';
    return language === 'en' ? '+ Cylinder 🪵' : '+ 円柱 🪵';
  };

  const getButtonLabelB = () => {
    if (narrativeMode === 'toy') return language === 'en' ? '+ Dino 🦖' : '+ 恐竜 🦖';
    if (narrativeMode === 'neuro') return language === 'en' ? '+ Photon B 🔵' : '+ 光子B 🔵';
    return language === 'en' ? '+ Cone 📐' : '+ 円錐 📐';
  };

  const isStep1 = wizardStep === 1;
  const isStep3 = wizardStep === 3;

  const getLabelA = () => {
    if (narrativeMode === 'toy') return language === 'en' ? 'Block' : 'ブロック';
    if (narrativeMode === 'neuro') return language === 'en' ? 'Photon A' : '光子A';
    return language === 'en' ? 'Cylinder' : '円柱';
  };

  const getLabelB = () => {
    if (narrativeMode === 'toy') return language === 'en' ? 'Dino' : '恐竜';
    if (narrativeMode === 'neuro') return language === 'en' ? 'Photon B' : '光子B';
    return language === 'en' ? 'Cone' : '円錐';
  };

  const getLabelC = () => {
    if (narrativeMode === 'toy') return language === 'en' ? 'Spaceship' : '宇宙船';
    if (narrativeMode === 'neuro') return language === 'en' ? 'Wave' : '波';
    return language === 'en' ? 'Bulla' : '粘土球';
  };

  const getCombineMessage = () => {
    if (narrativeMode === 'toy') return language === 'en' ? 'toys' : 'おもちゃ';
    if (narrativeMode === 'neuro') return language === 'en' ? 'photons' : '光子';
    return language === 'en' ? 'tokens' : '粘土トークン';
  };

  const getActionHintText = () => {
    const labelA = getLabelA();
    const labelB = getLabelB();
    const labelC = getLabelC();
    const combineMsg = getCombineMessage();

    const hasBlockBlockTree = trees.some(t => {
      if (t.node.type === 'binary' && t.node.op === '•') {
        return termToKey(t.node.left) === termToKey(t.node.right);
      }
      return false;
    });

    const hasBlockDinoTree = trees.some(t => {
      if (t.node.type === 'binary' && t.node.op === '•') {
        const leftKey = termToKey(t.node.left);
        const rightKey = termToKey(t.node.right);
        return (leftKey === 'a' && rightKey === 'b') || (leftKey === 'b' && rightKey === 'a');
      }
      return false;
    });

    if (activeRelations.idempotence && !hasBlockBlockTree) {
      return language === 'en'
        ? `💡 Click two ${labelA}s on the left, combine them, then activate the coequalizer to see them collapse into a single ${labelA}!`
        : `💡 左側で2つの${labelA}をクリックし、「Combine」で結合してからコイコライザーを起動して、1つの${labelA}に縮退する様子を見てみましょう！`;
    }
    if (activeRelations.spinCollapse && !hasBlockDinoTree) {
      return language === 'en'
        ? `💡 Select both ${labelA} and ${labelB} on the left, click 'Combine Selected', then activate the coequalizer to see them fuse into a ${labelC}!`
        : `💡 左側で${labelA}と${labelB}を両方選択し、「Combine」をクリックしてからコイコライザーを起動して、それらが${labelC}に融合する様子を見てみましょう！`;
    }
    return language === 'en'
      ? `💡 Combine ${combineMsg} in Syntax Space to see rules collapse them in Semantic Space.`
      : `💡 構文空間で${combineMsg}を結合し、ルールが意味空間でそれらを縮退させる様子を観察しましょう。`;
  };

  const containerStyle: React.CSSProperties = isMaximized ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    background: 'rgba(5, 7, 12, 0.98)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem',
    boxSizing: 'border-box',
    overflowY: 'auto'
  } : {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    gap: '0.75rem',
    width: '100%',
    position: 'relative'
  };

  return (
    <div
      className={isMaximized ? "maximized-overlay flex flex-col" : "animate-pop-in flex flex-col h-full justify-between"}
      style={containerStyle}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-pointer {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bounce-pointer-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 5px var(--primary); }
          100% { box-shadow: 0 0 15px var(--primary); }
        }
        @keyframes pulse-glow-success {
          0% { box-shadow: 0 0 5px var(--success); }
          100% { box-shadow: 0 0 15px var(--success); }
        }
        .bouncing-pointer {
          animation: bounce-pointer 1.2s ease-in-out infinite;
        }
        .bouncing-pointer-horizontal {
          animation: bounce-pointer-horizontal 1.2s ease-in-out infinite;
        }
        .maximized-overlay {
          overflow-y: auto !important;
        }
        .maximized-overlay::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .maximized-overlay::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 3px;
        }
        .maximized-overlay::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(0, 180, 255, 0.15), rgba(212, 175, 55, 0.15));
          border-radius: 3px;
        }
        .maximized-overlay::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(0, 180, 255, 0.4), rgba(212, 175, 55, 0.4));
        }
        @media (max-height: 700px) {
          .maximized-overlay .canvas-row {
            min-height: 260px !important;
            flex-grow: 0 !important;
          }
        }
      `}} />
      {/* Header Row (flex-shrink: 0) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', flexShrink: 0 }}>
        <div>
          <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.1rem', fontSize: '0.85rem' }}>
            {language === 'en' ? 'The Ontological Cycle (Room 1)' : '存在論的サイクル (第1展示室)'}
          </h4>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
            {language === 'en'
              ? 'Model, synthesize, and project syntactic trees into quotient semantic classes.'
              : '構文式木を組み立て、合同関係のもとで商化された意味モデルへ投影します。'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setWizardStep(1)}
            style={{
              padding: '6px 12px',
              fontSize: '0.85rem',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #d4af37 100%)',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 0 10px rgba(212,175,55,0.3)',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={13} />
            {language === 'en' ? '🌟 Guided Duality Walkthrough (Start Story)' : '🌟 双対性の旅（ストーリー開始）'}
          </button>
          
          <button
            onClick={() => setShowNotationGuide(true)}
            style={{
              padding: '6px 12px',
              fontSize: '0.85rem',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--text-main)',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'background 0.2s'
            }}
          >
            <BookOpen size={13} />
            {language === 'en' ? '📖 Decode the Math Notation: What is F(X)?' : '📖 数式記号の解説: F(X) とは？'}
          </button>

          <div
            style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.4)',
              padding: '2px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            title={language === 'en' ? 'Select Story Mode' : 'ストーリーモードを切り替えます'}
          >
            <button
              onClick={() => {
                setStoryMode('kid');
                setNarrativeMode('toy');
              }}
              style={{
                padding: '4px 10px',
                fontSize: '0.85rem',
                borderRadius: '4px',
                background: storyMode === 'kid' ? 'var(--primary)' : 'transparent',
                color: storyMode === 'kid' ? '#000' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              🧸 {language === 'en' ? 'Kid Analogy' : 'キッズ'}
            </button>
            <button
              onClick={() => setStoryMode('graduate')}
              style={{
                padding: '4px 10px',
                fontSize: '0.85rem',
                borderRadius: '4px',
                background: storyMode === 'graduate' ? 'var(--primary)' : 'transparent',
                color: storyMode === 'graduate' ? '#000' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              🎓 {language === 'en' ? 'Graduate Rigor' : '院生'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.4)',
              padding: '2px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            title={language === 'en' ? 'Select Cognitive/Narrative Representation' : '認知的・歴史的な表現手法を切り替えます'}
          >
            <button
              onClick={() => setNarrativeMode('toy')}
              style={{
                padding: '4px 10px',
                fontSize: '0.85rem',
                borderRadius: '4px',
                background: narrativeMode === 'toy' ? 'var(--primary)' : 'transparent',
                color: narrativeMode === 'toy' ? '#000' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              🧸 {language === 'en' ? 'Toy' : '玩具'}
            </button>
            <button
              onClick={() => setNarrativeMode('neuro')}
              style={{
                padding: '4px 10px',
                fontSize: '0.85rem',
                borderRadius: '4px',
                background: narrativeMode === 'neuro' ? 'var(--primary)' : 'transparent',
                color: narrativeMode === 'neuro' ? '#000' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              🧠 {language === 'en' ? 'Neuro' : '脳科学'}
            </button>
            <button
              onClick={() => setNarrativeMode('sumerian')}
              style={{
                padding: '4px 10px',
                fontSize: '0.85rem',
                borderRadius: '4px',
                background: narrativeMode === 'sumerian' ? 'var(--primary)' : 'transparent',
                color: narrativeMode === 'sumerian' ? '#000' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              🏛️ {language === 'en' ? 'Sumerian' : '粘土'}
            </button>
          </div>

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            style={{
              padding: '6px 12px',
              fontSize: '0.85rem',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--text-main)',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'background 0.2s'
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>⛶</span>
            {isMaximized 
              ? (language === 'en' ? 'Exit Maximize' : '元に戻す')
              : (language === 'en' ? 'Maximize' : '拡大表示')}
          </button>
        </div>
      </div>

      {/* Canvas Row (flex-grow: 1, min-height: 0, margin: 0.75rem 0) */}
      <div
        className="canvas-row"
        style={isMaximized ? {
          display: 'flex',
          gap: '1rem',
          width: '100%',
          height: '35vh',
          maxHeight: '300px',
          margin: '0.75rem 0',
          position: 'relative',
          flexShrink: 0
        } : {
          position: 'relative',
          width: '100%',
          height: '180px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '0.25rem',
          boxShadow: 'inset 0 3px 15px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          transition: 'height 0.3s ease'
        }}
      >
        {isMaximized && (
          <>
            {/* Syntax SVG Wrapper Panel */}
            <div
              style={{
                flex: 1,
                height: '35vh',
                maxHeight: '300px',
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: isSyntaxHovered ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '0.25rem',
                boxShadow: 'inset 0 3px 15px rgba(0,0,0,0.8)',
                position: 'relative',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'rgba(245, 158, 11, 0.9)' }}>
                  {language === 'en' ? 'Syntax Space F(X)' : '構文空間 F(X)'}
                </span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                  {language === 'en' ? 'Absolute Freedom' : '絶対的自由'}
                </span>
              </div>
            </div>

            {/* Semantic SVG Wrapper Panel */}
            {(wizardStep === null || wizardStep >= 4) && (
              <div
                style={{
                  flex: 1,
                  height: '35vh',
                  maxHeight: '300px',
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: isSemanticsHovered ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '0.25rem',
                  boxShadow: 'inset 0 3px 15px rgba(0,0,0,0.8)',
                  position: 'relative',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'rgba(16, 185, 129, 0.9)' }}>
                    {language === 'en' ? 'Semantic Space F(X)/~' : '意味空間 F(X)/~'}
                  </span>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                    {language === 'en' ? 'Quotient Collapse' : '商の収縮'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        <div style={isMaximized ? { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 } : { width: '100%', height: '100%' }}>
          <svg
            viewBox="0 0 360 220"
            preserveAspectRatio="xMidYMid meet"
            style={{
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--secondary)" />
              </marker>
              <linearGradient id="syntaxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.06)" />
                <stop offset="100%" stopColor="rgba(245, 158, 11, 0.01)" />
              </linearGradient>
              <linearGradient id="semanticGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(16, 185, 129, 0.06)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0.01)" />
              </linearGradient>
            </defs>

            {!isMaximized && (
              <rect
                x="8"
                y="15"
                width={wizardStep !== null && wizardStep <= 3 ? "344" : "135"}
                height="190"
                rx="6"
                fill="url(#syntaxGrad)"
                stroke={isSyntaxHovered ? 'rgba(245, 158, 11, 0.6)' : 'rgba(245, 158, 11, 0.1)'}
                strokeWidth={isSyntaxHovered ? 1.5 : 1}
                style={{ transition: 'all 0.5s ease' }}
              />
            )}
            {!isMaximized && (
              <text x="14" y="24" fill="rgba(245, 158, 11, 0.8)" fontSize="5.5" fontWeight="bold">
                SYNTAX SPACE F(X)
              </text>
            )}
            {!isMaximized && language === 'ja' && (
              <text x="14" y="31" fill="rgba(245, 158, 11, 0.4)" fontSize="4.5">
                構文自由代数箱
              </text>
            )}

            {!isMaximized && (wizardStep === null || wizardStep >= 4) && (
              <rect
                x="217"
                y="15"
                width="135"
                height="190"
                rx="6"
                fill="url(#semanticGrad)"
                stroke={isSemanticsHovered ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.1)'}
                strokeWidth={isSemanticsHovered ? 1.5 : 1}
                style={{ transition: 'all 0.5s ease' }}
              />
            )}
            {!isMaximized && (wizardStep === null || wizardStep >= 4) && (
              <g>
                <text x="223" y="24" fill="rgba(16, 185, 129, 0.8)" fontSize="5.5" fontWeight="bold">
                  SEMANTIC SPACE F(X)/~
                </text>
                {language === 'ja' && (
                  <text x="223" y="31" fill="rgba(16, 185, 129, 0.4)" fontSize="4.5">
                    商代数意味モデル箱
                  </text>
                )}
              </g>
            )}

            {isCoequalizerActive && (wizardStep === null || wizardStep >= 4) &&
              classes.map((cls, classIdx) => {
                const bubblePos = getClassBubblePosition(classIdx, classes.length);
                const isSelected = selectedClassKey === cls.key;
                const isAnySelected = selectedClassKey !== null;
                const pathOpacity = isSelected ? 0.75 : isAnySelected ? 0.05 : 0.25;
                const strokeColor = isSelected ? 'var(--success)' : 'rgba(56, 189, 248, 0.4)';
                const strokeWidth = isSelected ? 1.2 : 0.6;

                return cls.members.map(t => {
                  const sx = t.startX ?? 50;
                  const sy = t.startY ?? 75;
                  const tx = bubblePos.x;
                  const ty = bubblePos.y;

                  return (
                    <path
                      key={`proj-line-${t.id}`}
                      d={`M ${sx} ${sy} C ${sx + 35} ${sy}, ${tx - 35} ${ty}, ${tx} ${ty}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      opacity={pathOpacity}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  );
                });
              })}

            {(wizardStep === null || wizardStep >= 4) && (
              <g opacity={activeConcept === 7 ? 1 : 0.8} style={{ transition: 'all 0.3s' }}>
                <path
                  d="M 155,70 C 168,70 172,100 177,103 L 177,117 C 172,120 168,150 155,150 M 205,70 C 192,70 188,100 183,103 L 183,117 C 188,120 192,150 205,150"
                  fill="none"
                  stroke={isCoequalizerActive ? 'var(--secondary)' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="1.5"
                  style={{ transition: 'all 0.3s' }}
                />
                {isCoequalizerActive ? (
                  <line
                    x1="160"
                    y1="110"
                    x2="196"
                    y2="110"
                    stroke="var(--secondary)"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow)"
                    strokeDasharray="3,3"
                    style={{ strokeDashoffset: -10 }}
                  />
                ) : (
                  <line x1="165" y1="110" x2="192" y2="110" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" />
                )}
                <text x="180" y="63" fill="var(--secondary)" fontSize="5.5" fontWeight="bold" textAnchor="middle">
                  MAP π
                </text>
                <text x="180" y="162" fill="rgba(255,255,255,0.3)" fontSize="4.5" textAnchor="middle">
                  COEQUALIZER
                </text>
              </g>
            )}

            {trees.map(t => {
              const isSelected = selectedIds.has(t.id);
              const isSpelledOut = isCoequalizerActive && selectedClassKey !== null;
              const norm = normalizeTerm(t.node, activeRelations);
              const key = termToKey(norm);
              const isPreimage = selectedClassKey === key;
              const treeOpacity = isSpelledOut ? (isPreimage ? 1 : 0.15) : t.animMode === 'left' ? 1 : 0;

              const nodeDepth = getTreeDepth(t.node);
              const dynamicScale = Math.min(1.0, 1 / (1 + nodeDepth * 0.45));

              return (
                <g
                  key={t.id}
                  onClick={() => toggleSelect(t.id)}
                  style={{ cursor: isCoequalizerActive ? 'default' : 'pointer', transition: 'opacity 0.3s ease' }}
                  opacity={treeOpacity}
                >
                  {isSelected && (
                    <circle cx={t.x} cy={t.y + 6} r="18" fill="none" stroke="var(--secondary)" strokeWidth="1.2" strokeDasharray="3,2" />
                  )}
                  {isCoequalizerActive && isPreimage && (
                    <circle cx={t.x} cy={t.y + 6} r="20" fill="none" stroke="var(--success)" strokeWidth="1.5" filter="drop-shadow(0 0 3px #10b981)" />
                  )}
                  {wizardStep === 1 && !isSelected && selectedIds.size < 2 && (
                    <g transform={`translate(${t.x}, ${t.y - 25})`} className="bouncing-pointer" style={{ pointerEvents: 'none' }}>
                      <path d="M 0,-5 L 0,8 M -4,3 L 0,8 L 4,3" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  )}
                  <g transform={`translate(${t.x}, ${t.y}) scale(${dynamicScale}) translate(${-t.x}, ${-t.y})`}>
                    {drawRecursiveTree(t.node, t.x, t.y - 4, 0, 0.95)}
                  </g>
                </g>
              );
            })}

            {trees.length === 0 && (
              <text
                x={(wizardStep !== null && wizardStep <= 3) ? 180 : 75}
                y={110}
                fill="rgba(255,255,255,0.2)"
                fontSize="5.5"
                fontStyle="italic"
                textAnchor="middle"
              >
                {language === 'en' ? 'Add generators to start' : '生成元を追加して開始'}
              </text>
            )}

            {isCoequalizerActive && (wizardStep === null || wizardStep >= 4) &&
              classes.map((cls, classIdx) => {
                const bubblePos = getClassBubblePosition(classIdx, classes.length);
                const isSelected = selectedClassKey === cls.key;
                const isAnySelected = selectedClassKey !== null;
                const bubbleOpacity = isSelected ? 1 : isAnySelected ? 0.3 : 0.85;

                return (
                  <g
                    key={cls.key}
                    onClick={() => setSelectedClassKey(prev => (prev === cls.key ? null : cls.key))}
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    opacity={bubbleOpacity}
                  >
                    <circle
                      cx={bubblePos.x}
                      cy={bubblePos.y}
                      r="20"
                      fill={isSelected ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.02)'}
                      stroke={isSelected ? 'var(--success)' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={isSelected ? 1.5 : 0.8}
                      strokeDasharray={isSelected ? '' : '3,2'}
                    />

                    {wizardStep === 5 && selectedClassKey === null && classIdx === 0 && (
                      <g transform={`translate(${bubblePos.x - 30}, ${bubblePos.y})`} className="bouncing-pointer-horizontal" style={{ pointerEvents: 'none' }}>
                        <path d="M 0,0 L 15,0 M 10,-4 L 15,0 L 10,4" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </g>
                    )}

                    <g transform={`translate(${bubblePos.x}, ${bubblePos.y - 23})`}>
                      <text x="0" y="0" fill={isSelected ? 'var(--success)' : 'var(--primary)'} fontSize="5" fontWeight="bold" textAnchor="middle">
                        {`[${termToMath(cls.normalizedNode)}]`}
                      </text>
                    </g>

                    <g transform={`translate(${bubblePos.x}, ${bubblePos.y}) scale(0.95)`}>
                      {drawNodeGraphic(cls.normalizedNode, false, false, 8)}
                    </g>
                  </g>
                );
              })}

            {!isCoequalizerActive && (wizardStep === null || wizardStep >= 4) && (
              <g transform="translate(285, 110)" opacity="0.4">
                <circle cx="0" cy="0" r="16" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" />
                <text x="0" y="2" fill="rgba(255,255,255,0.3)" fontSize="5.5" fontStyle="italic" textAnchor="middle">
                  Locked
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      <div
        style={isMaximized ? {
          display: 'grid',
          gridTemplateColumns: (wizardStep !== null && wizardStep <= 2) ? '1fr' : '1fr 1fr',
          gap: '1rem',
          width: '100%',
          flexShrink: 0,
          marginBottom: '0.5rem'
        } : {
          display: 'grid',
          gridTemplateColumns: (wizardStep !== null && wizardStep <= 2) ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          width: '100%'
        }}
      >
        {/* Signature Box */}
        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: wizardStep === 1 ? '1.5px solid var(--secondary)' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '0.75rem 0.9rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: wizardStep === 1 ? '0 0 15px rgba(245,158,11,0.25)' : 'none',
            transition: 'all 0.3s ease',
            gap: '0.5rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              {language === 'en' ? 'Interactive Signature Panel (Σ)' : 'シグネチャ操作パネル (Σ)'}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  onClick={() => addGen('a')}
                  className="btn btn-secondary"
                  disabled={isCoequalizerActive}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    opacity: isCoequalizerActive ? 0.3 : 1,
                    cursor: isCoequalizerActive ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    ...(isStep1 && trees.length < 2 ? {
                      border: '1.5px solid var(--primary)',
                      boxShadow: '0 0 10px rgba(212,175,55,0.3)',
                      animation: 'pulse-glow 1.5s ease-in-out infinite alternate'
                    } : {})
                  }}
                  title="Add Constant a (Arity 0)"
                >
                  {getButtonLabelA()}
                </button>
                {wizardStep === 1 && trees.length < 2 && (
                  <div style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none' }}>
                    <BouncingArrow />
                  </div>
                )}
              </div>

              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  onClick={() => addGen('b')}
                  className="btn btn-secondary"
                  disabled={isCoequalizerActive}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    opacity: isCoequalizerActive ? 0.3 : 1,
                    cursor: isCoequalizerActive ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    ...(isStep1 && trees.length < 2 ? {
                      border: '1.5px solid var(--primary)',
                      boxShadow: '0 0 10px rgba(212,175,55,0.3)',
                      animation: 'pulse-glow 1.5s ease-in-out infinite alternate'
                    } : {})
                  }}
                  title="Add Constant b (Arity 0)"
                >
                  {getButtonLabelB()}
                </button>
                {wizardStep === 1 && trees.length < 2 && (
                  <div style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none' }}>
                    <BouncingArrow />
                  </div>
                )}
              </div>

              <button
                onClick={() => applyUnary('f')}
                className="btn btn-secondary"
                disabled={selectedIds.size !== 1 || isCoequalizerActive}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  opacity: selectedIds.size === 1 && !isCoequalizerActive ? 1 : 0.35,
                  cursor: selectedIds.size === 1 && !isCoequalizerActive ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                title="Apply Unary Operation f(x) (Spin)"
              >
                {narrativeMode === 'toy' ? 'f (Spin)' : narrativeMode === 'neuro' ? 'f (Spin)' : 'f (Rotate)'}
              </button>
              <button
                onClick={() => applyUnary('g')}
                className="btn btn-secondary"
                disabled={selectedIds.size !== 1 || isCoequalizerActive}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  opacity: selectedIds.size === 1 && !isCoequalizerActive ? 1 : 0.35,
                  cursor: selectedIds.size === 1 && !isCoequalizerActive ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                title="Apply Unary Operation g(x) (Paint)"
              >
                {narrativeMode === 'toy' ? 'g (Paint)' : narrativeMode === 'neuro' ? 'g (Glow)' : 'g (Stamp)'}
              </button>

              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  onClick={combineSelected}
                  className="btn btn-primary"
                  disabled={selectedIds.size !== 2 || isCoequalizerActive}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    background: selectedIds.size === 2 && !isCoequalizerActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: selectedIds.size === 2 && !isCoequalizerActive ? '#000' : 'rgba(255,255,255,0.2)',
                    opacity: selectedIds.size === 2 && !isCoequalizerActive ? 1 : 0.35,
                    cursor: selectedIds.size === 2 && !isCoequalizerActive ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    border: 'none',
                    ...(isStep1 && selectedIds.size === 2 ? {
                      border: '1.5px solid var(--primary)',
                      boxShadow: '0 0 10px rgba(212,175,55,0.5)',
                      animation: 'pulse-glow 1.5s ease-in-out infinite alternate'
                    } : {})
                  }}
                  title="Apply Binary Operation (x • y)"
                >
                  • Combine
                </button>
                {wizardStep === 1 && selectedIds.size === 2 && (
                  <div style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none' }}>
                    <BouncingArrow />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {selectedIds.size === 0
                ? (language === 'en' ? 'Select terms to apply functions' : '式を選択して演算子を適用します')
                : (language === 'en' ? `${selectedIds.size} term(s) selected` : `${selectedIds.size}個を選択中`)}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <button
                onClick={clearGen}
                className="btn"
                disabled={isCoequalizerActive}
                style={{
                  padding: '3px 8px',
                  fontSize: '0.8rem',
                  borderRadius: '4px',
                  background: 'rgba(239,68,68,0.1)',
                  color: 'var(--error)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  opacity: isCoequalizerActive ? 0.3 : 1,
                  cursor: isCoequalizerActive ? 'not-allowed' : 'pointer'
                }}
              >
                Reset
              </button>
              {isMaximized && (
                <button
                  onClick={() => setIsMaximized(false)}
                  className="btn"
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.8rem',
                    borderRadius: '4px',
                    background: 'rgba(239,68,68,0.2)',
                    color: 'var(--error)',
                    border: '1px solid var(--error)',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {language === 'en' ? 'Exit Maximize Mode [X]' : '全画面終了 [X]'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quotient Box */}
        {(wizardStep === null || wizardStep >= 3) && (
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: wizardStep === 3 ? '1.5px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '0.75rem 0.9rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: wizardStep === 3 ? '0 0 15px rgba(212,175,55,0.25)' : 'none',
              transition: 'all 0.3s ease',
              gap: '0.5rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                {language === 'en' ? 'Quotient Relation (R) Equations' : '商関係式 (R) 等式'}
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => toggleRelation('idempotence')}
                  className={`btn ${activeRelations.idempotence ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title={language === 'en' ? "Idempotence: Block • Block = Block" : "べき等律: ブロック • ブロック = ブロック"}
                >
                  <MathView formula="x \bullet x = x" style={{ fontSize: '0.8rem' }} />
                </button>
                <button
                  onClick={() => toggleRelation('commutativity')}
                  className={`btn ${activeRelations.commutativity ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title={language === 'en' ? "Commutativity: Block • Dino = Dino • Block" : "交換律: ブロック • 恐竜 = 恐竜 • ブロック"}
                >
                  <MathView formula="x \bullet y = y \bullet x" style={{ fontSize: '0.8rem' }} />
                </button>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    onClick={() => toggleRelation('spinCollapse')}
                    className={`btn ${activeRelations.spinCollapse ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      padding: '5px 10px',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      ...(isStep3 && !activeRelations.spinCollapse ? {
                        border: '1.5px solid var(--primary)',
                        boxShadow: '0 0 12px rgba(212,175,55,0.5)',
                        animation: 'pulse-glow 1.5s ease-in-out infinite alternate'
                      } : {})
                    }}
                    title={language === 'en' ? "Spaceship Rule: Block • Dino = Spaceship" : "宇宙船ルール: ブロック • 恐竜 = 宇宙船"}
                  >
                    <MathView formula="a \bullet b = c" style={{ fontSize: '0.8rem' }} />
                  </button>
                  {wizardStep === 3 && !activeRelations.spinCollapse && (
                    <div style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none' }}>
                      <BouncingArrow />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic pulsing action hints */}
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--primary)',
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1.5px dashed rgba(212, 175, 55, 0.3)',
                borderRadius: '6px',
                padding: '0.5rem 0.6rem',
                margin: '0.2rem 0',
                lineHeight: '1.35',
                animation: 'pulse-opacity 1.5s ease-in-out infinite alternate',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <span>{getActionHintText()}</span>
            </div>

            <div style={{ position: 'relative', width: '100%' }}>
              <button
                onClick={handleToggleCoequalizer}
                className="btn"
                disabled={trees.length === 0}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  marginTop: '0.4rem',
                  background: isCoequalizerActive ? 'var(--success)' : 'var(--primary)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  opacity: trees.length === 0 ? 0.4 : 1,
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: trees.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  ...(wizardStep === 4 && !isCoequalizerActive ? {
                    border: '1.5px solid var(--success)',
                    boxShadow: '0 0 12px rgba(16,185,129,0.5)',
                    animation: 'pulse-glow-success 1.5s ease-in-out infinite alternate'
                  } : {})
                }}
              >
                <Sparkles size={13} />
                {isCoequalizerActive
                  ? language === 'en'
                    ? 'Deactivate Coequalizer'
                    : 'コイコライザー停止'
                  : language === 'en'
                  ? 'Activate Coequalizer (π)'
                  : 'コイコライザー起動 (π)'}
              </button>
              {wizardStep === 4 && !isCoequalizerActive && (
                <div style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none' }}>
                  <BouncingArrow color="var(--success)" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {wizardStep === null ? (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.6rem', width: '100%' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {language === 'en' ? 'Placard Concepts (Hover to Inspect Duality / Morphism)' : '存在論プレート・数学的解説（ホバーで対応部を強調）'}
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', width: '100%' }}>
            {concepts.map(c => {
              const isHovered = activeConcept === c.id;
              return (
                <div
                  key={c.id}
                  onMouseEnter={() => setActiveConcept(c.id)}
                  onMouseLeave={() => setActiveConcept(null)}
                  onClick={() => {
                    if (c.id === 7) handleToggleCoequalizer();
                    if (c.id === 8) setNarrativeMode('neuro');
                    if (c.id === 9) setNarrativeMode('sumerian');
                  }}
                  style={{
                    background: isHovered ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.01)',
                    border: isHovered ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    padding: '0.6rem 0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '70px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isHovered ? 'var(--primary)' : 'var(--text-main)' }}>
                      {c.id}. {language === 'en' ? c.titleEn : c.titleJa}
                    </span>
                    <MathView formula={c.formula} style={{ fontSize: '0.8rem', color: 'var(--secondary)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3', margin: 0 }}>
                    {language === 'en' ? c.descEn : c.descJa}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        getWizardContent() && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.6rem', width: '100%', flexShrink: 0 }}>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1.5px solid var(--primary)',
                boxShadow: '0 0 20px rgba(212,175,55,0.2), inset 0 1px 1px rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      background: 'var(--primary)',
                      color: '#000',
                      padding: '2.5px 7px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '900',
                      textTransform: 'uppercase'
                    }}
                  >
                    {language === 'en' ? `Step ${wizardStep} / 5` : `ステップ ${wizardStep} / 5`}
                  </span>
                  <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                    <span>
                      {language === 'en'
                        ? '🔮 Unveil the Mystery of Duality - '
                        : '🔮 双対性の謎を解き明かす - '}
                    </span>
                    <MathView formula={language === 'en' ? getWizardContent()?.titleEn || '' : getWizardContent()?.titleJa || ''} style={{ fontSize: '0.95rem' }} />
                  </h5>
                </div>
                
                <button
                  onClick={() => setWizardStep(null)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                  className="hover:text-white"
                >
                  <X size={12} />
                  {language === 'en' ? 'Exit' : '終了'}
                </button>
              </div>

              {storyMode === 'kid' ? (
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.6rem 0.8rem', borderRadius: '8px', borderLeft: '3px solid var(--success)', gap: '0.75rem' }}>
                  {narrativeMode === 'toy' ? (
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center', flexShrink: 0 }}>
                      <BlockyTheLegoMascot />
                      <RexTheDinoMascot />
                    </div>
                  ) : narrativeMode === 'neuro' ? (
                    <PhotiThePhotonMascot />
                  ) : (
                    <ClayeyTheBullaMascot />
                  )}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {narrativeMode === 'toy' 
                        ? (language === 'en' ? 'Blocky & Rex' : 'ブロッキー＆レックス') 
                        : narrativeMode === 'neuro'
                        ? (language === 'en' ? 'Photi the Photon' : '光子のフォティ')
                        : (language === 'en' ? 'Clayey the Bulla' : '粘土のクレイイ')}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.35', fontStyle: 'italic' }}>
                      {language === 'en' ? getWizardContent()?.pedagogyEn : getWizardContent()?.pedagogyJa}
                    </p>
                  </div>
                  <button
                    onClick={() => speakText(language === 'en' ? getWizardContent()?.pedagogyEn || '' : getWizardContent()?.pedagogyJa || '')}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--primary)',
                      flexShrink: 0,
                      transition: 'background 0.2s'
                    }}
                    title={language === 'en' ? "Speak Text" : "読み上げる"}
                  >
                    <SpeakerIcon size={14} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.6rem 0.8rem', borderRadius: '6px', borderLeft: '3px solid var(--secondary)' }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.35' }}>
                    {language === 'en' ? getWizardContent()?.pedagogyEn : getWizardContent()?.pedagogyJa}
                  </p>
                  
                  {/* KaTeX Commutative Diagram or Formula display */}
                  <div style={{ display: 'flex', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '0.3rem' }}>
                    {wizardStep === 1 && <MathView formula="F(X) = T(\Sigma, X)" displayMode style={{ fontSize: '0.95rem' }} />}
                    {wizardStep === 2 && <MathView formula="F \dashv U \implies \text{Hom}_{\text{Alg}}(F(X), A) \cong \text{Hom}_{\text{Set}}(X, U(A))" displayMode style={{ fontSize: '0.95rem' }} />}
                    {wizardStep === 3 && <MathView formula="R \subseteq F(X) \times F(X) \implies \langle R \rangle = \bigcap \{ \equiv \;\mid\; R \subseteq \; \equiv \;\land\; \equiv \text{ is a congruence} \}" displayMode style={{ fontSize: '0.95rem' }} />}
                    {wizardStep === 4 && (
                      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                        <MathView formula={"\\begin{matrix} R & \\begin{matrix} d_0 \\\\ \\rightrightarrows \\\\ d_1 \\end{matrix} & F(X) & \\xrightarrow{\\quad\\pi\\quad} & F(X)/\\langle R \\rangle \\\\ & & \\quad\\searrow _h & & \\swarrow _{\\exists! \\bar{h}} \\\\ & & & A & \\end{matrix}"} displayMode style={{ fontSize: '0.95rem' }} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Universal Property: <MathView formula="\\forall h: F(X) \\to A \\text{ s.t. } h \\circ d_0 = h \\circ d_1, \\; \\exists! \\bar{h}: F(X)/\\langle R \\rangle \\to A \\text{ s.t. } \\bar{h} \\circ \\pi = h" style={{ fontSize: '0.75rem' }} />
                        </div>
                      </div>
                    )}
                    {wizardStep === 5 && (
                      <div style={{ textAlign: 'center' }}>
                        <MathView formula="\pi^{-1}([t]) = \{ s \in F(X) \mid s \sim t \}" displayMode style={{ fontSize: '0.95rem' }} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Fiber Pre-image under Coequalizer Colimit morphism
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', color: 'var(--secondary)', fontWeight: 'bold' }}>
                <Play size={12} style={{ flexShrink: 0 }} />
                <span>
                  {language === 'en' ? getWizardContent()?.promptEn : getWizardContent()?.promptJa}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <div
                      key={s}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: s === wizardStep ? 'var(--primary)' : s < wizardStep ? 'var(--success)' : 'rgba(255,255,255,0.15)',
                        boxShadow: s === wizardStep ? '0 0 6px var(--primary)' : 'none',
                        transition: 'all 0.3s'
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    disabled={wizardStep === 1}
                    onClick={() => setWizardStep(prev => prev ? prev - 1 : 1)}
                    style={{
                      padding: '5px 10px',
                      fontSize: '0.85rem',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.05)',
                      color: wizardStep === 1 ? 'var(--text-muted)' : 'var(--text-main)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      cursor: wizardStep === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ChevronLeft size={13} />
                    {language === 'en' ? 'Back' : '戻る'}
                  </button>

                  <button
                    onClick={() => {
                      if (wizardStep === 5) {
                        setWizardStep(null);
                      } else {
                        setWizardStep(prev => prev ? prev + 1 : 1);
                      }
                    }}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.85rem',
                      borderRadius: '4px',
                      background: 'var(--primary)',
                      color: '#000',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {wizardStep === 5 ? (
                      <>
                        <Sparkles size={13} />
                        {language === 'en' ? 'Finish' : 'ツアー完了'}
                      </>
                    ) : (
                      <>
                        {language === 'en' ? 'Next' : '次へ'}
                        <ChevronRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Notation Guide Overlay (Modal dialog style) */}
      {showNotationGuide && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 7, 12, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            padding: '1rem'
          }}
          onClick={() => setShowNotationGuide(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '550px',
              maxHeight: '90vh',
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              color: 'var(--text-main)',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} style={{ color: 'var(--primary)' }} />
                <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {language === 'en' ? '📖 Decode the Math Notation: What is F(X)?' : '📖 数式記号の解説: F(X) とは？'}
                </h5>
              </div>
              <button
                onClick={() => setShowNotationGuide(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flexGrow: 1, fontSize: '0.65rem' }}>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.6rem', fontStyle: 'italic', marginBottom: '0.3rem' }}>
                {language === 'en' 
                  ? 'Category Theory formalizes the relationship between syntax (free structures) and semantics (collapsing under equations).' 
                  : '圏論は、構文（自由な構造）と意味論（方程式による収縮）の関係を数式モデル化します。'}
              </p>

              {[
                {
                  symbol: 'X',
                  nameEn: 'X (Generators)',
                  nameJa: 'X (生成元)',
                  descEn: 'Raw starting toys (Block 🟥, Dino 🦖). Represents basic building blocks.',
                  descJa: 'すべての出発点となる生の玩具（ブロック 🟥、恐竜 🦖）。基本的な構成要素。'
                },
                {
                  symbol: 'F',
                  nameEn: 'F (Free Functor)',
                  nameJa: 'F (自由関手)',
                  descEn: 'The action of using connectors to build all possible combinations of toys.',
                  descJa: 'コネクタを使って玩具のあらゆる組み合わせを構築する操作。'
                },
                {
                  symbol: 'F(X)',
                  nameEn: 'F(X) (Term Algebra / Syntax Space)',
                  nameJa: 'F(X) (自由項代数 / 構文空間)',
                  descEn: 'The infinite space of all possible unreduced syntax trees you can build.',
                  descJa: '簡約を一切行わずに構築される、あらゆる可能な構文木の無限空間。'
                },
                {
                  symbol: '\\sim',
                  nameEn: '\\sim (Equivalence Relation)',
                  nameJa: '\\sim (同値関係)',
                  descEn: 'The "make-believe rules" you decide (e.g., Block • Dino = Spaceship).',
                  descJa: '異なる木に同じ意味があるとみなす「ごっこ遊びのルール」（例：ブロック • 恐竜 = 宇宙船）。'
                },
                {
                  symbol: 'F(X)/\\sim',
                  nameEn: 'F(X)/\\sim (Quotient Algebra / Semantic Space)',
                  nameJa: 'F(X)/\\sim (商代数 / 意味空間)',
                  descEn: 'The simplified semantic space where equivalent toys collapse into a single unique toy model class (meaning).',
                  descJa: '同値な玩具が1つのユニークなトイモデルクラス（意味）へと融合・収縮した商空間。'
                },
                {
                  symbol: '\\pi',
                  nameEn: '\\pi (Coequalizer Map)',
                  nameJa: '\\pi (射影写像 / コイコライザー)',
                  descEn: 'The mapping projection from raw syntax to stable semantic equivalence classes.',
                  descJa: '生の構文を安定した意味の同値類へと商化投影する写像（コイコライザー）。'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    padding: '0.4rem 0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(212,175,55,0.1)',
                      border: '1px solid var(--primary)',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      minWidth: '65px',
                      textAlign: 'center'
                    }}
                  >
                    <MathView formula={item.symbol} style={{ fontSize: '0.7rem', color: 'var(--primary)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.68rem' }}>
                      {language === 'en' ? item.nameEn : item.nameJa}
                    </span>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.6rem', lineHeight: '1.3' }}>
                      {language === 'en' ? item.descEn : item.descJa}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowNotationGuide(false)}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '6px 12px',
                fontSize: '0.68rem',
                marginTop: '0.8rem',
                color: '#000',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {language === 'en' ? 'I Understand!' : '理解しました！'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ROOM 2: Lebombo Bone
// ============================================================================
export function LebomboBoneVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [notches, setNotches] = useState<number>(3);
  const [bijectionActive, setBijectionActive] = useState<boolean>(false);
  const [_slashTrigger, setSlashTrigger] = useState<boolean>(false);
  const maxNotches = 10;

  const highlightSyntax = hoveredSymbol === 'X';
  const highlightSemantics = hoveredSymbol === 'R' || hoveredSymbol === 'F(X)/\\langle R \\rangle';

  // Trigger slash fold animation when notches count crosses a multiple of 5
  React.useEffect(() => {
    if (notches >= 5) {
      setSlashTrigger(true);
    } else {
      setSlashTrigger(false);
    }
  }, [notches]);

  const handleCarve = () => {
    if (notches < maxNotches) {
      setNotches(n => n + 1);
      setBijectionActive(false);
    }
  };

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
            onClick={handleCarve}
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
        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          border: highlightSemantics ? '2px solid rgba(16, 185, 129, 0.8)' : '1px solid rgba(255,255,255,0.06)', 
          borderRadius: '8px', 
          padding: '1rem', 
          minHeight: '220px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: highlightSemantics ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}>
          
          <svg width="100%" height="200" viewBox="0 0 220 200">
            <defs>
              <linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffae8" />
                <stop offset="50%" stopColor="#f7ebd0" />
                <stop offset="100%" stopColor="#e3d4b6" />
              </linearGradient>
              <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Bone Representation (Clickable Bone Shank) */}
            <g transform="translate(0, 10)">
              <path 
                d="M 15 35 C 5 35, 5 15, 20 15 C 30 15, 35 25, 45 25 L 175 25 C 185 25, 190 15, 200 15 C 215 15, 215 35, 205 35 C 215 35, 215 55, 200 55 C 190 55, 185 45, 175 45 L 45 45 C 35 45, 30 55, 20 55 C 5 55, 5 35, 15 35 Z" 
                fill="url(#boneGrad)" 
                stroke={highlightSyntax ? 'var(--secondary)' : '#c0b49c'} 
                strokeWidth="1.5" 
                filter="url(#shadow)"
                style={{ cursor: 'pointer' }}
                onClick={handleCarve}
              />
              <text x="110" y="20" fill="#a19379" fontSize="5" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                LEBOMBO FIBULA BONE
              </text>

              {/* Draw Notches inside the bone shank with Tally fold grouping */}
              {Array.from({ length: notches }).map((_, i) => {
                const groupIdx = Math.floor(i / 5);
                const itemIdx = i % 5;
                const baseX = 65 + groupIdx * 45;
                const x = baseX + itemIdx * 6;
                const y = 30;

                // Render vertical notches
                if (itemIdx < 4) {
                  return (
                    <line
                      key={`notch-${i}`}
                      x1={x}
                      y1={y}
                      x2={x}
                      y2={y + 12}
                      stroke="#853b1b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  );
                }

                // Render 5th diagonal slash quotient fold
                return (
                  <line
                    key={`notch-${i}`}
                    x1={baseX - 3}
                    y1={y + 11}
                    x2={baseX + 22}
                    y2={y + 1}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animate-draw-line"
                    style={{
                      strokeDasharray: 30,
                      animation: 'dash 0.4s ease-out forwards'
                    }}
                  />
                );
              })}
              {notches === 0 && (
                <text x="110" y="37" fill="rgba(0,0,0,0.3)" fontSize="6" fontStyle="italic" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                  {language === 'en' ? 'Click bone to carve notches' : '骨をクリックしてノッチを刻みます'}
                </text>
              )}
            </g>

            {/* Bijection connection lines */}
            {bijectionActive && Array.from({ length: notches }).map((_, i) => {
              const groupIdx = Math.floor(i / 5);
              const itemIdx = i % 5;
              
              // Notch endpoint coordinates
              const notchX = 65 + groupIdx * 45 + (itemIdx === 4 ? 9.5 : itemIdx * 6);
              const notchY = 52;

              // Sheep start coordinates
              const sheepX = 22 + i * 19;
              const sheepY = 135;

              return (
                <path
                  key={`line-${i}`}
                  d={`M ${notchX} ${notchY} C ${notchX} ${notchY + 40}, ${sheepX} ${sheepY - 40}, ${sheepX} ${sheepY}`}
                  fill="none"
                  stroke={bijectionActive ? 'rgba(56, 189, 248, 0.6)' : 'none'}
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              );
            })}

            {/* Herd of Sheep (Reality objects) */}
            <g transform="translate(0, 140)">
              {Array.from({ length: notches }).map((_, i) => {
                const x = 12 + i * 19;
                return (
                  <g key={`sheep-${i}`} transform={`translate(${x}, 0)`}>
                    {/* Glowing background if bijection active */}
                    <circle cx="10" cy="10" r="10" fill={bijectionActive ? 'rgba(56,189,248,0.1)' : 'none'} />
                    {/* Sheep emoji inside tag */}
                    <text x="10" y="14" fontSize="11" textAnchor="middle" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>🐏</text>
                  </g>
                );
              })}
              {notches === 0 && (
                <text x="110" y="10" fill="rgba(255,255,255,0.2)" fontSize="6" fontStyle="italic" textAnchor="middle">
                  Empty set
                </text>
              )}
            </g>
          </svg>

          {/* Collapsed Semantic Class Card */}
          {bijectionActive && notches > 0 && (
            <div className="animate-pop-in" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              background: 'rgba(16,185,129,0.06)', 
              border: '1px solid rgba(16,185,129,0.4)', 
              borderRadius: '6px', 
              padding: '0.4rem', 
              textAlign: 'center',
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              boxShadow: '0 0 10px rgba(16,185,129,0.1)'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 'bold' }}>
                {language === 'en' 
                  ? `Equipotence quotient bijection found! Cardinal Number class: ${notches}` 
                  : `対等関係（全単射）の商を検出！基数同値類: ${notches}`}
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
export function SumerianBullaVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [cones, setCones] = useState<number>(0);
  const [spheres, setSpheres] = useState<number>(0);
  const [sealed, setSealed] = useState<boolean>(false);
  const [sealProgress, setSealProgress] = useState(1);

  const addToken = (type: 'cone' | 'sphere') => {
    if (sealed) return;
    if (type === 'cone' && cones < 12) setCones(c => c + 1);
    if (type === 'sphere' && spheres < 6) setSpheres(s => s + 1);
  };

  const reset = () => {
    setCones(0);
    setSpheres(0);
    setSealed(false);
    setSealProgress(1);
  };

  // Run slide animation when sealing is toggled
  React.useEffect(() => {
    if (sealed) {
      setSealProgress(0);
      const start = performance.now();
      let animId: number;
      const step = (time: number) => {
        const elapsed = time - start;
        const val = Math.min(1, elapsed / 800); // 800ms slide
        setSealProgress(val);
        if (val < 1) {
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animId);
    } else {
      setSealProgress(1);
    }
  }, [sealed]);

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
          {/* Tokens Tray (Syntax) */}
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: hoveredSymbol === 'X' ? '2px solid rgba(245, 158, 11, 0.8)' : '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '8px', 
            padding: '0.75rem', 
            minHeight: '140px',
            boxShadow: hoveredSymbol === 'X' ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {sealed ? (language === 'en' ? 'SEALED TOKENS (HIDDEN)' : '封入されたトークン (不可視)') : (language === 'en' ? 'OPEN TRAY' : 'トレイ')}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {/* Show tokens inside tray when open, or sliding when sealing */}
              {!sealed && Array.from({ length: cones }).map((_, i) => (
                <span key={`c-${i}`} style={{ fontSize: '1.1rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} title="Cone (1)">📐</span>
              ))}
              {!sealed && Array.from({ length: spheres }).map((_, i) => (
                <span key={`s-${i}`} style={{ fontSize: '1.1rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} title="Sphere (10)">⚪</span>
              ))}
              {cones === 0 && spheres === 0 && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>Tray is empty</span>}
              
              {sealed && sealProgress < 1 && (
                <span style={{ fontSize: '0.65rem', color: 'var(--primary)' }} className="animate-pulse">
                  {language === 'en' ? 'Tokens sliding into Bulla...' : 'トークンがブッラ内へスライド中...'}
                </span>
              )}
              {sealed && sealProgress === 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', width: '100%' }}>
                  <Lock size={20} style={{ color: 'var(--primary)', opacity: 0.6 }} />
                </div>
              )}
            </div>
          </div>

          {/* Sealed Bulla Exterior (Semantics) */}
          <div style={{ 
            background: 'rgba(212,175,55,0.04)', 
            border: (hoveredSymbol === 'R' || hoveredSymbol === 'F(X)/\\langle R \\rangle') ? '2px solid rgba(16, 185, 129, 0.8)' : '1px solid rgba(212,175,55,0.15)', 
            borderRadius: '8px', 
            padding: '0.75rem', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            textAlign: 'center',
            minHeight: '140px',
            boxShadow: (hoveredSymbol === 'R' || hoveredSymbol === 'F(X)/\\langle R \\rangle') ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <defs>
                <radialGradient id="clayBulla" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#cf9e78" />
                  <stop offset="75%" stopColor="#bd8c66" />
                  <stop offset="100%" stopColor="#966947" />
                </radialGradient>
              </defs>

              {/* Bulla sphere envelope outline */}
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                fill={sealed && sealProgress === 1 ? 'url(#clayBulla)' : 'rgba(255,255,255,0.02)'} 
                stroke={sealed ? 'var(--primary)' : 'rgba(255,255,255,0.2)'} 
                strokeWidth="1.5" 
                strokeDasharray={sealed ? 'none' : '3,3'} 
                style={{ transition: 'all 0.5s' }}
              />

              {/* Tokens sliding inside during sealing animation */}
              {sealed && sealProgress < 1 && (
                <g opacity={1 - sealProgress} transform={`translate(${50 * sealProgress - 50}, 0)`}>
                  {Array.from({ length: cones }).map((_, i) => (
                    <text key={`slide-c-${i}`} x={30 + (i % 3) * 10} y={35 + Math.floor(i / 3) * 10} fontSize="8">📐</text>
                  ))}
                  {Array.from({ length: spheres }).map((_, i) => (
                    <text key={`slide-s-${i}`} x={30 + (i % 3) * 10} y={65 + Math.floor(i / 3) * 10} fontSize="8">⚪</text>
                  ))}
                </g>
              )}

              {/* Stamped markings on outside of Sealed Bulla */}
              {sealed && sealProgress === 1 && (
                <g className="animate-pop-in">
                  <text x="50" y="24" fill="#693b1d" fontSize="6" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">
                    STAMPED CONTRACT
                  </text>
                  
                  {/* Sphere stamps (circles) */}
                  {Array.from({ length: spheres }).map((_, i) => {
                    const cx = 35 + (i % 3) * 15;
                    const cy = 40 + Math.floor(i / 3) * 15;
                    return (
                      <circle 
                        key={`stamp-s-${i}`} 
                        cx={cx} 
                        cy={cy} 
                        r="4" 
                        fill="none" 
                        stroke="#693b1d" 
                        strokeWidth="1.2" 
                      />
                    );
                  })}

                  {/* Cone stamps (triangles) */}
                  {Array.from({ length: cones }).map((_, i) => {
                    const idx = i + spheres; // draw after spheres
                    const cx = 35 + (idx % 3) * 15;
                    const cy = 40 + Math.floor(idx / 3) * 15;
                    return (
                      <polygon
                        key={`stamp-c-${i}`}
                        points={`${cx},${cy - 4} ${cx - 4},${cy + 4} ${cx + 4},${cy + 4}`}
                        fill="none"
                        stroke="#693b1d"
                        strokeWidth="1.2"
                      />
                    );
                  })}
                </g>
              )}
            </svg>

            {sealed && sealProgress === 1 ? (
              <div className="animate-pop-in" style={{ marginTop: '0.25rem' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                  {language === 'en' ? `Contract Val: ${totalValue}` : `取引契約価値: ${totalValue}`}
                </span>
                <span style={{ display: 'block', fontSize: '0.52rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {language === 'en' ? 'Cuneiform markings stamped' : '粘土表面に押印が完了（商化完了）'}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>
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
export function IncaQuipuVisualizer({ language, hoveredSymbol }: VisualizerProps) {
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
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            border: hoveredSymbol === 'X' ? '2px solid rgba(245, 158, 11, 0.8)' : '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '8px', 
            padding: '1rem 0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            minHeight: '220px', 
            position: 'relative',
            boxShadow: hoveredSymbol === 'X' ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
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
          <div style={{ 
            textAlign: 'center',
            border: (hoveredSymbol === 'R' || hoveredSymbol === 'F(X)/\\langle R \\rangle') ? '2px solid rgba(16, 185, 129, 0.8)' : '1px solid transparent',
            borderRadius: '8px',
            padding: '0.75rem',
            boxShadow: (hoveredSymbol === 'R' || hoveredSymbol === 'F(X)/\\langle R \\rangle') ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
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
import { Pause } from 'lucide-react';

function resamplePath(points: {x: number, y: number}[], numPoints: number): {x: number, y: number}[] {
  if (points.length === 0) return Array(numPoints).fill({x: 0, y: 0});
  if (points.length === 1) return Array(numPoints).fill(points[0]);
  
  const dists = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    dists.push(dists[i - 1] + Math.sqrt(dx*dx + dy*dy));
  }
  const totalLength = dists[dists.length - 1];
  const resampled: {x: number, y: number}[] = [];
  
  for (let i = 0; i < numPoints; i++) {
    const targetDist = (i / (numPoints - 1)) * totalLength;
    let idx = 0;
    while (idx < dists.length - 1 && dists[idx + 1] < targetDist) {
      idx++;
    }
    const d0 = dists[idx];
    const d1 = dists[idx + 1];
    const t = (d1 === d0) ? 0 : (targetDist - d0) / (d1 - d0);
    const p0 = points[idx];
    const p1 = points[idx + 1];
    resampled.push({
      x: p0.x + t * (p1.x - p0.x),
      y: p0.y + t * (p1.y - p0.y)
    });
  }
  return resampled;
}

function generateCanonicalPath(W: number, numPoints: number, xc: number, yc: number, x0: number, y0: number): {x: number, y: number}[] {
  const points: {x: number, y: number}[] = [];
  const R = 20; // radius of loop
  
  if (W === 0) {
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1 || 1);
      const offset = Math.sin(t * Math.PI) * 10;
      points.push({ x: x0 + offset, y: y0 });
    }
    return points;
  }
  
  const xCircleLeft = xc - R;
  const yCircleLeft = yc;
  const nLine = Math.floor(numPoints * 0.15);
  const nCircle = numPoints - 2 * nLine;
  
  for (let i = 0; i < nLine; i++) {
    const t = i / (nLine - 1 || 1);
    points.push({
      x: x0 + t * (xCircleLeft - x0),
      y: y0 + t * (yCircleLeft - y0)
    });
  }
  
  for (let i = 0; i < nCircle; i++) {
    const t = i / (nCircle - 1 || 1);
    const angle = Math.PI + 2 * Math.PI * W * t;
    points.push({
      x: xc + R * Math.cos(angle),
      y: yc + R * Math.sin(angle)
    });
  }
  
  for (let i = 0; i < nLine; i++) {
    const t = i / (nLine - 1 || 1);
    points.push({
      x: xCircleLeft + t * (x0 - xCircleLeft),
      y: yCircleLeft + t * (y0 - yCircleLeft)
    });
  }
  
  return points;
}

function computeWindingNumber(points: {x: number, y: number}[], xc: number, yc: number): number {
  if (points.length < 3) return 0;
  let totalAngle = 0;
  let prevAngle = Math.atan2(points[0].y - yc, points[0].x - xc);
  
  for (let i = 1; i < points.length; i++) {
    const currentAngle = Math.atan2(points[i].y - yc, points[i].x - xc);
    let diff = currentAngle - prevAngle;
    
    while (diff < -Math.PI) diff += 2 * Math.PI;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    
    totalAngle += diff;
    prevAngle = currentAngle;
  }
  
  return Math.round(totalAngle / (2 * Math.PI));
}

export function PathHomotopyVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [xc, setXc] = React.useState<number>(110); 
  const [yc, setYc] = React.useState<number>(65); 
  const x0 = 25;
  const y0 = 65;   
  
  const [drawingPoints, setDrawingPoints] = React.useState<{x: number, y: number}[]>([]);
  const [isDrawing, setIsDrawing] = React.useState<boolean>(false);
  const [isDraggingObstacle, setIsDraggingObstacle] = React.useState<boolean>(false);
  const [pathPoints, setPathPoints] = React.useState<{x: number, y: number}[]>(() => 
    generateCanonicalPath(0, 60, 110, 65, x0, y0)
  );
  const [winding, setWinding] = React.useState<number>(0);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);
  const [targetPoints, setTargetPoints] = React.useState<{x: number, y: number}[]>([]);

  React.useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setPathPoints(prev => {
        let done = true;
        const next = prev.map((p, idx) => {
          const target = targetPoints[idx];
          if (!target) return p;
          const dx = target.x - p.x;
          const dy = target.y - p.y;
          if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
            done = false;
            return {
              x: p.x + dx * 0.12,
              y: p.y + dy * 0.12
            };
          }
          return target;
        });
        
        if (done) {
          setIsAnimating(false);
          clearInterval(interval);
          return targetPoints;
        }
        return next;
      });
    }, 16);
    
    return () => clearInterval(interval);
  }, [isAnimating, targetPoints]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isAnimating || isDraggingObstacle) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 220;
    const y = ((e.clientY - rect.top) / rect.height) * 130;
    
    setIsDrawing(true);
    setDrawingPoints([{ x: x0, y: y0 }, { x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 220;
    const y = ((e.clientY - rect.top) / rect.height) * 130;

    if (isDraggingObstacle) {
      const newXc = Math.max(50, Math.min(170, x));
      const newYc = Math.max(30, Math.min(100, y));
      setXc(newXc);
      setYc(newYc);
      setPathPoints(generateCanonicalPath(winding, 60, newXc, newYc, x0, y0));
    } else if (isDrawing) {
      setDrawingPoints(prev => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    if (isDraggingObstacle) {
      setIsDraggingObstacle(false);
      return;
    }
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const closed = [...drawingPoints, { x: x0, y: y0 }];
    const resampled = resamplePath(closed, 60);
    setPathPoints(resampled);
    
    const W = computeWindingNumber(resampled, xc, yc);
    setWinding(W);
    
    const target = generateCanonicalPath(W, 60, xc, yc, x0, y0);
    setTargetPoints(target);
    setIsAnimating(true);
  };

  const startCollapse = () => {
    const target = generateCanonicalPath(winding, 60, xc, yc, x0, y0);
    setTargetPoints(target);
    setIsAnimating(true);
  };

  const selectWinding = (w: number) => {
    setIsAnimating(false);
    setWinding(w);
    const start = generateCanonicalPath(w, 60, xc, yc, x0, y0).map(p => ({
      x: p.x + (Math.random() - 0.5) * 15,
      y: p.y + (Math.random() - 0.5) * 15
    }));
    setPathPoints(start);
    setTargetPoints(generateCanonicalPath(w, 60, xc, yc, x0, y0));
  };

  const reset = () => {
    setIsAnimating(false);
    setWinding(0);
    setDrawingPoints([]);
    setPathPoints(generateCanonicalPath(0, 60, xc, yc, x0, y0));
  };

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>
          {language === 'en' ? 'Hall XI: Fundamental Group π₁(X, x₀)' : '第XI室：基本群 π₁(X, x₀) とホモトピー商'}
        </h4>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {language === 'en'
            ? 'Drag the red obstacle to move the topological hole. Draw a loop around it. Snaps to canonical homotopy representatives on release.'
            : '赤い障害物をドラッグして穴の位置を変更できます。周囲にループを描くと、指を離した際に対応するホモトピー同値類に収縮します。'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ 
            background: 'rgba(56, 189, 248, 0.02)', 
            border: (hoveredSymbol === '\\gamma(s)' || hoveredSymbol === 'X') ? '2px solid rgba(245, 158, 11, 0.8)' : '1px solid rgba(56, 189, 248, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: (hoveredSymbol === '\\gamma(s)' || hoveredSymbol === 'X') ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '0.55rem', color: '#38bdf8', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              SYNTAX SPACE (RAW PATHS γ)
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 220 130" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', cursor: 'crosshair', marginTop: '0.25rem' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <circle 
                cx={xc} 
                cy={yc} 
                r="10" 
                fill="#ef4444" 
                opacity="0.8" 
                style={{ cursor: isAnimating ? 'not-allowed' : 'grab' }}
                onMouseDown={(e) => {
                  if (isAnimating) return;
                  e.stopPropagation();
                  setIsDraggingObstacle(true);
                }}
              />
              <text x={xc} y={yc + 3} fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>X</text>
              
              <circle cx={x0} cy={y0} r="3" fill="#38bdf8" />
              <text x={x0 - 5} y={y0 - 5} fill="#38bdf8" fontSize="7">x₀</text>

              {isDrawing ? (
                <path 
                  d={`M ${drawingPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
              ) : (
                <path 
                  d={`M ${pathPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                />
              )}
            </svg>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'center' }}>
              {isDraggingObstacle ? 'Dragging hole...' : (isDrawing ? 'Drawing loop...' : 'Drag circle or draw a loop.')}
            </div>
          </div>

          <div style={{ 
            background: 'rgba(212, 175, 55, 0.02)', 
            border: (hoveredSymbol === '\\pi_1(X, x_0)' || hoveredSymbol === '\\pi') ? '2px solid rgba(16, 185, 129, 0.8)' : '1px solid rgba(212, 175, 55, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: (hoveredSymbol === '\\pi_1(X, x_0)' || hoveredSymbol === '\\pi') ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--primary)', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              SEMANTIC SPACE (π₁(X, x₀) ≅ ℤ)
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 220 130" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
            >
              <circle cx={xc} cy={yc} r="10" fill="#ef4444" opacity="0.6" />
              <text x={xc} y={yc + 3} fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">X</text>
              
              <circle cx={x0} cy={y0} r="3" fill="var(--primary)" />

              <path 
                d={`M ${generateCanonicalPath(winding, 60, xc, yc, x0, y0).map(p => `${p.x} ${p.y}`).join(' L ')}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
              />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                Winding Class [γ] = {winding}
              </span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                {winding === 0 ? 'Contractible' : 'Non-trivial'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button onClick={() => selectWinding(0)} className={`btn ${winding === 0 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '2px 6px', fontSize: '0.6rem' }}>W = 0</button>
            <button onClick={() => selectWinding(1)} className={`btn ${winding === 1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '2px 6px', fontSize: '0.6rem' }}>W = +1</button>
            <button onClick={() => selectWinding(-1)} className={`btn ${winding === -1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '2px 6px', fontSize: '0.6rem' }}>W = -1</button>
          </div>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              onClick={startCollapse} 
              disabled={isAnimating}
              className="btn btn-outline" 
              style={{ padding: '2px 8px', fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '2px', borderColor: 'var(--primary)', color: 'var(--primary)' }}
            >
              {isAnimating ? <Pause size={8} /> : <Play size={8} />}
              {language === 'en' ? 'Collapse' : '収縮'}
            </button>
            <button onClick={reset} className="btn btn-outline" style={{ padding: '2px 4px', fontSize: '0.6rem', color: 'var(--error)' }}>
              <RotateCcw size={8} />
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.25rem' }}>
        {"LaTeX mapping: $\\gamma \\simeq \\gamma' \\iff [\\gamma] = [\\gamma'] \\in \\pi_1(X, x_0)$"}
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 12: Einstein Spacetime
// ============================================================================
export function EinsteinSpacetimeVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [mass, setMass] = React.useState<number>(40);
  const [massPos, setMassPos] = React.useState<{x: number, y: number}>({ x: 110, y: 65 });
  const [diffM, setDiffM] = React.useState<boolean>(false);
  
  // Geodesic particle state
  const [particle, setParticle] = React.useState<{x: number, y: number, vx: number, vy: number}>({ x: 10, y: 35, vx: 2.2, vy: 0 });
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (hoveredSymbol === 'T_{\\mu\\nu}') {
      setMass(85);
      setDiffM(false);
    } else if (hoveredSymbol === '\\text{Diff}(M)') {
      setDiffM(true);
    } else if (hoveredSymbol === 'g_{\\mu\\nu}') {
      setMass(50);
      setDiffM(false);
    }
  }, [hoveredSymbol]);
  
  // Coordinate warp for diffeomorphism Diff(M)
  const warp = React.useCallback((x: number, y: number) => {
    if (!diffM) return { x, y };
    // Applying a diffeomorphism coordinate transformation (sinusoidal coordinate warp)
    const warpX = x + Math.sin(y / 12) * 12;
    const warpY = y + Math.cos(x / 15) * 8;
    return { x: warpX, y: warpY };
  }, [diffM]);

  // Warps coordinate grids toward the mass
  const applyGravityWarp = React.useCallback((gridX: number, gridY: number) => {
    const dx = gridX - massPos.x;
    const dy = gridY - massPos.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    const strength = mass * 0.45;
    const factor = strength / (d + 8);
    const rawX = gridX - dx * factor;
    const rawY = gridY - dy * factor;
    return warp(rawX, rawY);
  }, [mass, massPos, warp]);

  // Run physics integration for the geodesic path
  React.useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setParticle(prev => {
        const dx = massPos.x - prev.x;
        const dy = massPos.y - prev.y;
        const d2 = dx*dx + dy*dy;
        const d = Math.sqrt(d2);
        
        // Newtonian/Schwarzschild effective acceleration
        const G = 0.55;
        const acc = G * mass / (d2 * d + 20);
        const ax = dx * acc;
        const ay = dy * acc;
        
        const nextX = prev.x + prev.vx;
        const nextY = prev.y + prev.vy;
        
        if (nextX > 220 || nextX < 0 || nextY > 130 || nextY < 0) {
          setIsPlaying(false);
          clearInterval(interval);
        }
        
        return {
          x: nextX,
          y: nextY,
          vx: prev.vx + ax,
          vy: prev.vy + ay
        };
      });
    }, 20);
    
    return () => clearInterval(interval);
  }, [isPlaying, mass, massPos]);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 220;
    const y = ((e.clientY - rect.top) / rect.height) * 130;
    setMassPos({ x, y });
    resetParticle();
  };

  const resetParticle = () => {
    setParticle({ x: 10, y: 35, vx: 2.2, vy: 0 });
    setIsPlaying(false);
  };

  // Generate geodesic lines
  const geodesicPath = React.useMemo(() => {
    // Generate precalculated trail for visualization
    let x = 10, y = 35, vx = 2.2, vy = 0;
    const path: {x: number, y: number}[] = [];
    const G = 0.55;
    for (let step = 0; step < 120; step++) {
      const dx = massPos.x - x;
      const dy = massPos.y - y;
      const d2 = dx*dx + dy*dy;
      const d = Math.sqrt(d2);
      const acc = G * mass / (d2 * d + 20);
      const ax = dx * acc;
      const ay = dy * acc;
      x += vx;
      y += vy;
      vx += ax;
      vy += ay;
      path.push(warp(x, y));
      if (x > 220 || x < 0 || y > 130 || y < 0) break;
    }
    return path;
  }, [mass, massPos, warp]);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>
          {language === 'en' ? 'Hall XII: Spacetime Diffeomorphisms Diff(M)' : '第XII室：時空多様体と座標変換不変性 Diff(M)'}
        </h4>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {language === 'en'
            ? 'Drag the mass center. Coordinate changes (Diff(M)) bend the grid but preserve physical geodesic trajectories.'
            : '質量点をクリックで移動させます。座標変換（Diff）をONにすると座標線は歪みますが、測地線（物理経路）は変化しません。'}
        </p>

        {/* The Visual Dialectic (Left vs Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {/* Syntax Space (Left) */}
          <div style={{ background: 'rgba(56, 189, 248, 0.02)', border: '1px solid rgba(56, 189, 248, 0.12)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.55rem', color: '#38bdf8', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              SYNTAX SPACE (COORDINATES η_μν)
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 220 130" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
            >
              {/* Flat Cartesian grid */}
              <g stroke="rgba(56,189,248,0.1)" strokeWidth="0.5">
                {Array.from({ length: 11 }).map((_, i) => (
                  <line key={`x-${i}`} x1={i * 22} y1="0" x2={i * 22} y2="130" />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <line key={`y-${i}`} x1="0" y1={i * 21.6} x2="220" y2={i * 21.6} />
                ))}
              </g>
              {/* Unwarped flat geodesic path */}
              <line x1="10" y1="35" x2="210" y2="35" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx="10" cy="35" r="3" fill="#38bdf8" />
              <text x="12" y="30" fill="#38bdf8" fontSize="7">Flat Path</text>
            </svg>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'center' }}>
              {"Euclidean flat metric: $g_{ij} = \\delta_{ij}$"}
            </div>
          </div>

          {/* Semantic Space (Right) */}
          <div style={{ 
            background: 'rgba(212, 175, 55, 0.02)', 
            border: (hoveredSymbol === 'g_{\\mu\\nu}') ? '2px solid rgba(16, 185, 129, 0.8)' : '1px solid rgba(212, 175, 55, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: (hoveredSymbol === 'g_{\\mu\\nu}') ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--primary)', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              SEMANTIC SPACE (METRIC WELL g_μν)
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 220 130" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
              onClick={handleCanvasClick}
            >
              {/* Warped Coordinate Grid */}
              <g stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none">
                {/* Vertical curves */}
                {Array.from({ length: 11 }).map((_, i) => {
                  const xGrid = i * 22;
                  const pts: string[] = [];
                  for (let yGrid = 0; yGrid <= 130; yGrid += 10) {
                    const wp = applyGravityWarp(xGrid, yGrid);
                    pts.push(`${wp.x},${wp.y}`);
                  }
                  return <path key={`wc-v-${i}`} d={`M ${pts.join(' L ')}`} />;
                })}
                {/* Horizontal curves */}
                {Array.from({ length: 7 }).map((_, i) => {
                  const yGrid = i * 21.6;
                  const pts: string[] = [];
                  for (let xGrid = 0; xGrid <= 220; xGrid += 15) {
                    const wp = applyGravityWarp(xGrid, yGrid);
                    pts.push(`${wp.x},${wp.y}`);
                  }
                  return <path key={`wc-h-${i}`} d={`M ${pts.join(' L ')}`} />;
                })}
              </g>

              {/* Mass Gravity Center */}
              {(() => {
                const wp = warp(massPos.x, massPos.y);
                const isHighlighted = hoveredSymbol === 'T_{\\mu\\nu}';
                return (
                  <circle 
                    cx={wp.x} 
                    cy={wp.y} 
                    r={mass * 0.1 + 4} 
                    fill={isHighlighted ? "#f59e0b" : "var(--primary)"} 
                    opacity="0.8" 
                    style={{ 
                      cursor: 'pointer', 
                      filter: isHighlighted ? 'drop-shadow(0 0 8px #f59e0b)' : 'drop-shadow(0 0 4px var(--primary))',
                      transition: 'all 0.3s ease'
                    }} 
                  />
                );
              })()}

              {/* Bending Geodesic Line */}
              {geodesicPath.length > 0 && (
                <path 
                  d={`M ${geodesicPath.map(p => `${p.x} ${p.y}`).join(' L ')}`} 
                  fill="none" 
                  stroke="var(--primary)" 
                  strokeWidth="2" 
                />
              )}

              {/* Animated particle along path */}
              {isPlaying && (() => {
                const wp = warp(particle.x, particle.y);
                return <circle cx={wp.x} cy={wp.y} r="3" fill="#fff" />;
              })()}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                Mass T₀₀ = {mass}
              </span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                {diffM ? 'Diffeo Warp Active' : 'Standard Coord'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          {/* Mass slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexGrow: 1 }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Mass:</span>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={mass} 
              onChange={e => setMass(parseInt(e.target.value))}
              style={{ width: '100px', accentColor: 'var(--primary)', height: '3px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              onClick={() => setDiffM(!diffM)} 
              className={`btn ${diffM ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ 
                padding: '2px 6px', 
                fontSize: '0.6rem',
                border: hoveredSymbol === '\\text{Diff}(M)' ? '2px solid rgba(245, 158, 11, 0.8)' : 'none',
                boxShadow: hoveredSymbol === '\\text{Diff}(M)' ? '0 0 8px rgba(245, 158, 11, 0.5)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Diff(M)
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="btn btn-outline" 
              style={{ padding: '2px 8px', fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: '2px', borderColor: 'var(--primary)', color: 'var(--primary)' }}
            >
              {isPlaying ? <Pause size={8} /> : <Play size={8} />}
              {language === 'en' ? 'Launch' : '投射'}
            </button>
            <button onClick={resetParticle} className="btn btn-outline" style={{ padding: '2px 4px', fontSize: '0.6rem', color: 'var(--error)' }}>
              <RotateCcw size={8} />
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.25rem' }}>
        {"Einstein equation: $G_{\\mu\\nu} + g_{\\mu\\nu}\\Lambda = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$"}
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 13: Lambda Calculus
// ============================================================================
export function LambdaCalculusVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [step, setStep] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (hoveredSymbol === '(\\lambda x. M)N') {
      setStep(0);
    } else if (hoveredSymbol === 'M[x \\coloneqq N]') {
      setStep(3);
    }
  }, [hoveredSymbol]);

  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep(s => {
        if (s >= 3) {
          setIsPlaying(false);
          return 3;
        }
        return s + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const stepForward = () => {
    setStep(s => Math.min(3, s + 1));
  };

  const stepBackward = () => {
    setStep(s => Math.max(0, s - 1));
  };

  const togglePlay = () => {
    if (step === 3) {
      setStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  // Node position calculation helper
  const getNodePos = (nodeName: string) => {
    switch (nodeName) {
      case 'root': return { x: 110, y: 20 };
      case 'abs': return { x: 60, y: 55 };
      case 'arg': return { x: 160, y: 55 };
      case 'op': return { x: 60, y: 90 };
      case 'var1': return { x: 40, y: 120 };
      case 'var2': return { x: 80, y: 120 };
      default: return { x: 110, y: 65 };
    }
  };

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>
          {language === 'en' ? 'Hall XIII: λ-Calculus Beta Reduction' : '第XIII室：ラムダ計算のベータ簡約とAST崩壊'}
        </h4>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {language === 'en'
            ? 'Observe the substitution in the Abstract Syntax Tree. Beta reduction collapses functional abstractions into normalized semantics.'
            : '抽象構文木（AST）での変数代入を観察します。ベータ簡約は、関数の抽象化（構文）を評価値（意味論）へ崩壊させます。'}
        </p>

        {/* The Visual Dialectic (Left vs Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {/* Syntax AST Canvas (Left) */}
          <div style={{ 
            background: 'rgba(56, 189, 248, 0.02)', 
            border: hoveredSymbol === '(\\lambda x. M)N' ? '2px solid rgba(245, 158, 11, 0.8)' : '1px solid rgba(56, 189, 248, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: hoveredSymbol === '(\\lambda x. M)N' ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '0.55rem', color: '#38bdf8', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              AST SYNTAX SPACE ((λx. x + x) 3)
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 220 135" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
            >
              {/* Render connecting lines based on step */}
              {step === 0 && (
                <>
                  <line x1={getNodePos('root').x} y1={getNodePos('root').y} x2={getNodePos('abs').x} y2={getNodePos('abs').y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1={getNodePos('root').x} y1={getNodePos('root').y} x2={getNodePos('arg').x} y2={getNodePos('arg').y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1={getNodePos('abs').x} y1={getNodePos('abs').y} x2={getNodePos('op').x} y2={getNodePos('op').y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1={getNodePos('op').x} y1={getNodePos('op').y} x2={getNodePos('var1').x} y2={getNodePos('var1').y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1={getNodePos('op').x} y1={getNodePos('op').y} x2={getNodePos('var2').x} y2={getNodePos('var2').y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </>
              )}
              {step === 1 && (
                <>
                  <line x1={getNodePos('abs').x} y1={getNodePos('abs').y} x2={getNodePos('op').x} y2={getNodePos('op').y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1={getNodePos('op').x} y1={getNodePos('op').y} x2={getNodePos('var1').x} y2={getNodePos('var1').y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1={getNodePos('op').x} y1={getNodePos('op').y} x2={getNodePos('var2').x} y2={getNodePos('var2').y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </>
              )}
              {step === 2 && (
                <>
                  <line x1={getNodePos('op').x} y1={getNodePos('op').y} x2={getNodePos('var1').x} y2={getNodePos('var1').y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1={getNodePos('op').x} y1={getNodePos('op').y} x2={getNodePos('var2').x} y2={getNodePos('var2').y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </>
              )}

              {/* Render AST nodes */}
              {/* Step 0: Abstraction & Application */}
              {step === 0 && (
                <>
                  <circle cx={getNodePos('root').x} cy={getNodePos('root').y} r="10" fill="#38bdf8" />
                  <text x={getNodePos('root').x} y={getNodePos('root').y + 3} fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">@</text>

                  <circle cx={getNodePos('abs').x} cy={getNodePos('abs').y} r="10" fill="#38bdf8" />
                  <text x={getNodePos('abs').x} y={getNodePos('abs').y + 3} fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">λx</text>

                  <circle cx={getNodePos('arg').x} cy={getNodePos('arg').y} r="10" fill="var(--primary)" />
                  <text x={getNodePos('arg').x} y={getNodePos('arg').y + 3} fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">3</text>

                  <circle cx={getNodePos('op').x} cy={getNodePos('op').y} r="10" fill="#38bdf8" />
                  <text x={getNodePos('op').x} y={getNodePos('op').y + 3} fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">+</text>

                  <circle cx={getNodePos('var1').x} cy={getNodePos('var1').y} r="8" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="1" />
                  <text x={getNodePos('var1').x} y={getNodePos('var1').y + 3} fill="#fff" fontSize="8" textAnchor="middle">x</text>

                  <circle cx={getNodePos('var2').x} cy={getNodePos('var2').y} r="8" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="1" />
                  <text x={getNodePos('var2').x} y={getNodePos('var2').y + 3} fill="#fff" fontSize="8" textAnchor="middle">x</text>
                </>
              )}

              {/* Step 1: Beta Reduction (flying substitution) */}
              {step === 1 && (
                <>
                  <circle cx={getNodePos('abs').x} cy={getNodePos('abs').y} r="10" fill="rgba(56,189,248,0.15)" />
                  <text x={getNodePos('abs').x} y={getNodePos('abs').y + 3} fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="middle">λx</text>

                  <circle cx={getNodePos('op').x} cy={getNodePos('op').y} r="10" fill="#38bdf8" />
                  <text x={getNodePos('op').x} y={getNodePos('op').y + 3} fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">+</text>

                  {/* Flying argument 3 towards var1 and var2 */}
                  <circle cx={40 + (160 - 40) * 0.4} cy={120 + (55 - 120) * 0.4} r="9" fill="var(--primary)" style={{ transition: 'all 1s ease' }} />
                  <text x={40 + (160 - 40) * 0.4} y={120 + (55 - 120) * 0.4 + 3} fill="#000" fontSize="7" fontWeight="bold" textAnchor="middle">3</text>

                  <circle cx={80 + (160 - 80) * 0.4} cy={120 + (55 - 120) * 0.4} r="9" fill="var(--primary)" style={{ transition: 'all 1s ease' }} />
                  <text x={80 + (160 - 80) * 0.4} y={80 + (55 - 80) * 0.4 + 3} fill="#000" fontSize="7" fontWeight="bold" textAnchor="middle">3</text>

                  <circle cx={getNodePos('var1').x} cy={getNodePos('var1').y} r="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <text x={getNodePos('var1').x} y={getNodePos('var1').y + 3} fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="middle">x</text>

                  <circle cx={getNodePos('var2').x} cy={getNodePos('var2').y} r="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <text x={getNodePos('var2').x} y={getNodePos('var2').y + 3} fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="middle">x</text>
                </>
              )}

              {/* Step 2: Substituted body (3 + 3) */}
              {step === 2 && (
                <>
                  <circle cx={getNodePos('op').x} cy={getNodePos('op').y - 20} r="10" fill="#38bdf8" />
                  <text x={getNodePos('op').x} y={getNodePos('op').y - 17} fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">+</text>

                  <circle cx={getNodePos('var1').x} cy={getNodePos('var1').y - 20} r="10" fill="var(--primary)" />
                  <text x={getNodePos('var1').x} y={getNodePos('var1').y - 17} fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">3</text>

                  <circle cx={getNodePos('var2').x} cy={getNodePos('var2').y - 20} r="10" fill="var(--primary)" />
                  <text x={getNodePos('var2').x} y={getNodePos('var2').y - 17} fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">3</text>

                  <line x1={getNodePos('op').x} y1={getNodePos('op').y - 20} x2={getNodePos('var1').x} y2={getNodePos('var1').y - 20} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1={getNodePos('op').x} y1={getNodePos('op').y - 20} x2={getNodePos('var2').x} y2={getNodePos('var2').y - 20} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </>
              )}

              {/* Step 3: Evaluated normal form (6) */}
              {step === 3 && (
                <g className="animate-pop-in">
                  <circle cx="110" cy="65" r="14" fill="var(--success)" stroke="#fff" strokeWidth="1.5" />
                  <text x="110" y="69" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">6</text>
                </g>
              )}
            </svg>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'center' }}>
              {step === 0 && 'Initial application redex detected.'}
              {step === 1 && 'Substitution: variables bound to argument.'}
              {step === 2 && 'Beta-reduced term: addition structure.'}
              {step === 3 && 'Fully normalized semantic form.'}
            </div>
          </div>

          {/* Semantic Evaluation Log (Right) */}
          <div style={{ 
            background: 'rgba(212, 175, 55, 0.02)', 
            border: hoveredSymbol === 'M[x \\coloneqq N]' ? '2px solid rgba(16, 185, 129, 0.8)' : '1px solid rgba(212, 175, 55, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            boxShadow: hoveredSymbol === 'M[x \\coloneqq N]' ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <div>
              <span style={{ fontSize: '0.55rem', color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                SEMANTIC COALGEBRA
              </span>
              <div style={{ fontFamily: 'monospace', fontSize: '0.625rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ opacity: step >= 0 ? 1 : 0.2, color: step === 0 ? 'var(--primary)' : '#fff' }}>
                  t₀: ((λx. x+x) 3)
                </div>
                <div style={{ opacity: step >= 1 ? 1 : 0.2, color: step === 1 ? 'var(--primary)' : '#fff' }}>
                  t₁: [x↦3](x + x)
                </div>
                <div style={{ opacity: step >= 2 ? 1 : 0.2, color: step === 2 ? 'var(--primary)' : '#fff' }}>
                  t₂: 3 + 3
                </div>
                <div style={{ opacity: step >= 3 ? 1 : 0.2, color: step === 3 ? 'var(--success)' : '#fff', fontWeight: step === 3 ? 'bold' : 'normal' }}>
                  t₃: 6 (Normal Form)
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.25rem', marginTop: '0.5rem' }}>
              {language === 'en' ? 'Normal Form has no redexes.' : 'これ以上簡約できない極小状態。'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
          <button onClick={reset} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Reset</button>
          <button onClick={stepBackward} disabled={step === 0} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Step Back</button>
          <button onClick={stepForward} disabled={step === 3} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Step Next</button>
          <button 
            onClick={togglePlay} 
            className="btn btn-primary"
            style={{ padding: '3px 10px', fontSize: '0.6rem' }}
          >
            {isPlaying ? 'Pause' : (step === 3 ? 'Restart' : 'Auto Play')}
          </button>
        </div>
      </div>
      
      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.25rem' }}>
        {"Beta-reduction relation: $(\\lambda x. M) N \\to_\\beta M[x \\coloneqq N]$"}
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 15: Relational Algebra
// ============================================================================
export function RelationalAlgebraVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [mode, setMode] = React.useState<'cartesian' | 'pullback' | 'groupby'>('cartesian');
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (hoveredSymbol === 'R \\bowtie S') {
      setMode('pullback');
    } else if (hoveredSymbol === '\\text{GROUP BY}') {
      setMode('groupby');
    }
  }, [hoveredSymbol]);

  const highlightLeft = hoveredSymbol === 'R \\bowtie S';
  const highlightRight = hoveredSymbol === '\\text{GROUP BY}';

  const students = [
    { id: 1, name: 'Alice', majorId: 1 }, // Math
    { id: 2, name: 'Bob', majorId: 2 },   // Physics
    { id: 3, name: 'Charlie', majorId: 1 }, // Math
    { id: 4, name: 'Diana', majorId: 2 }   // Physics
  ];

  const majors = [
    { id: 1, name: 'Math' },
    { id: 2, name: 'Physics' }
  ];

  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMode(m => {
        if (m === 'cartesian') return 'pullback';
        if (m === 'pullback') return 'groupby';
        setIsPlaying(false);
        return 'cartesian';
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Point positions for Cartesian Grid:
  // X axis: Majors (1: Math, 2: Physics) -> x = 60, 160
  // Y axis: Students (1: Alice, 2: Bob, 3: Charlie, 4: Diana) -> y = 25, 55, 85, 115
  const getPointCoords = (studentId: number, majorId: number) => {
    const x = majorId === 1 ? 65 : 155;
    const y = 20 + (studentId - 1) * 26;
    return { x, y };
  };

  const reset = () => {
    setMode('cartesian');
    setIsPlaying(false);
  };

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>
          {language === 'en' ? 'Hall XV: Relational Algebra Pullbacks' : '第XV室：関係代数のプルバック（等結合）と商化'}
        </h4>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {language === 'en'
            ? 'Observe the tables as coordinate spaces. Equijoin is a pullback (intersection), while GROUP BY is a quotient collapse.'
            : '表を座標空間として表現します。等結合はプルバック（交差）であり、GROUP BY は同値関係による射影（商化）です。'}
        </p>

        {/* The Visual Dialectic (Left vs Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {/* Left Panel: Cartesian / Pullback Space */}
          <div style={{ 
            background: 'rgba(56, 189, 248, 0.02)', 
            border: highlightLeft ? '2px solid var(--primary)' : '1px solid rgba(56, 189, 248, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: highlightLeft ? '0 0 12px rgba(245, 158, 11, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '0.55rem', color: '#38bdf8', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              {mode === 'cartesian' ? 'SYNTAX: CARTESIAN PRODUCT R × S' : 'PULLBACK: EQUIJOIN R ⋈ S'}
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 220 135" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
            >
              {/* Axes */}
              <line x1="25" y1="120" x2="210" y2="120" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <line x1="25" y1="10" x2="25" y2="120" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              
              {/* Y Axis Labels (Students) */}
              {students.map(s => (
                <text key={`yl-${s.id}`} x="20" y={20 + (s.id - 1) * 26 + 3} fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="end">{s.name}</text>
              ))}

              {/* X Axis Labels (Majors) */}
              <text x="65" y="129" fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">Math</text>
              <text x="155" y="129" fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">Physics</text>

              {/* Grid lines */}
              <line x1="65" y1="10" x2="65" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="155" y1="10" x2="155" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2,2" />

              {/* Cartesian / Pullback Points */}
              {students.map(s => 
                majors.map(m => {
                  const pt = getPointCoords(s.id, m.id);
                  const isMatch = s.majorId === m.id;
                  
                  if (mode === 'cartesian') {
                    return (
                      <circle 
                        key={`pt-${s.id}-${m.id}`} 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="4" 
                        fill={isMatch ? '#38bdf8' : 'rgba(56,189,248,0.25)'} 
                        stroke="#38bdf8" 
                        strokeWidth="0.5" 
                      />
                    );
                  } else if (mode === 'pullback') {
                    // Only render matching tuples in pullback
                    return isMatch ? (
                      <circle 
                        key={`pt-${s.id}-${m.id}`} 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="5" 
                        fill="var(--primary)" 
                        style={{ filter: 'drop-shadow(0 0 2px var(--primary))' }}
                      />
                    ) : (
                      <circle 
                        key={`pt-${s.id}-${m.id}`} 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="3" 
                        fill="rgba(255,255,255,0.04)" 
                      />
                    );
                  } else {
                    // Group By Mode: points slide down to bottom axis and stack
                    const isMath = s.majorId === 1;
                    const stackIndex = s.id <= 2 ? 0 : 1;
                    const targetY = 110 - stackIndex * 15;
                    const targetX = isMath ? 65 : 155;
                    
                    return isMatch ? (
                      <circle 
                        key={`pt-${s.id}-${m.id}`} 
                        cx={targetX} 
                        cy={targetY} 
                        r="6" 
                        fill="var(--success)" 
                        style={{ transition: 'all 1s ease-in-out' }}
                      />
                    ) : null;
                  }
                })
              )}
            </svg>
          </div>

          {/* Right Panel: Tabular / Equivalence Class Details */}
          <div style={{ 
            background: 'rgba(212, 175, 55, 0.02)', 
            border: highlightRight ? '2px solid var(--success)' : '1px solid rgba(212, 175, 55, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            boxShadow: highlightRight ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <div>
              <span style={{ fontSize: '0.55rem', color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                SEMANTICS: RELATION
              </span>
              <div style={{ minHeight: '90px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {mode === 'cartesian' && (
                  <div style={{ fontSize: '0.625rem', color: '#fff' }}>
                    <strong>Unfiltered Product Space:</strong>
                    <div style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.55rem', marginTop: '2px' }}>
                      | Alice | Math |<br />
                      | Alice | Physics |<br />
                      | Bob | Math |<br />
                      | Bob | Physics |
                    </div>
                  </div>
                )}
                {mode === 'pullback' && (
                  <div style={{ fontSize: '0.625rem', color: '#fff' }}>
                    <strong>Pullback (Join Match):</strong>
                    <div style={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.55rem', marginTop: '2px' }}>
                      | Alice | Math | ✓<br />
                      | Bob | Physics | ✓<br />
                      | Charlie | Math | ✓<br />
                      | Diana | Physics | ✓
                    </div>
                  </div>
                )}
                {mode === 'groupby' && (
                  <div style={{ fontSize: '0.625rem', color: '#fff' }}>
                    <strong>Quotient Groups (Major):</strong>
                    <div style={{ color: 'var(--success)', fontFamily: 'monospace', fontSize: '0.55rem', marginTop: '2px' }}>
                      [Math]: {`{Alice, Charlie}`} (Count: 2)<br />
                      [Physics]: {`{Bob, Diana}`} (Count: 2)
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.25rem' }}>
              {mode === 'groupby' ? 'Quotient classes form aggregations.' : 'Join operates as categorical fiber product.'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
          <button onClick={reset} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Reset</button>
          <button 
            onClick={() => setMode('cartesian')} 
            className={`btn ${mode === 'cartesian' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '3px 8px', fontSize: '0.6rem' }}
          >
            Product
          </button>
          <button 
            onClick={() => setMode('pullback')} 
            className={`btn ${mode === 'pullback' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '3px 8px', fontSize: '0.6rem' }}
          >
            Equijoin
          </button>
          <button 
            onClick={() => setMode('groupby')} 
            className={`btn ${mode === 'groupby' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '3px 8px', fontSize: '0.6rem' }}
          >
            Group By
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="btn btn-outline" 
            style={{ padding: '3px 8px', fontSize: '0.6rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            {isPlaying ? 'Pause' : 'Auto Play'}
          </button>
        </div>
      </div>
      
      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.25rem' }}>
        {"Pullback diagram: $R \\times_M S = \\{(r, s) \\in R \\times S \\mid \\pi_R(r) = \\pi_S(s)\\}$"}
      </div>
    </div>
  );
}

// ============================================================================
// ROOM 16: Regular Expressions & Automata
// ============================================================================
export function RegExAutomataVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [input, setInput] = React.useState<string>('ab');
  const [minimized, setMinimized] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [charIndex, setCharIndex] = React.useState<number>(-1);
  const [activeState, setActiveState] = React.useState<string>('q0');

  React.useEffect(() => {
    if (hoveredSymbol === '\\equiv_L') {
      setMinimized(true);
    }
  }, [hoveredSymbol]);

  const highlightSemantics = hoveredSymbol === '\\equiv_L';

  // Unminimized states: q0, q1, q2, q3 (where q1 and q2 are equivalent)
  // Coordinates:
  // q0 (start): (30, 65)
  // q1 (redundant 1): (95, 30)
  // q2 (redundant 2): (95, 100)
  // q3 (accept): (175, 65)
  // In minimized mode, q1 and q2 collapse to q12 at (95, 65)
  
  const getStatePos = React.useCallback((stateName: string) => {
    if (minimized) {
      switch (stateName) {
        case 'q0': return { x: 40, y: 65 };
        case 'q1': return { x: 110, y: 65 };
        case 'q2': return { x: 110, y: 65 }; // fused
        case 'q3': return { x: 180, y: 65 };
        default: return { x: 110, y: 65 };
      }
    } else {
      switch (stateName) {
        case 'q0': return { x: 35, y: 65 };
        case 'q1': return { x: 105, y: 30 };
        case 'q2': return { x: 105, y: 100 };
        case 'q3': return { x: 175, y: 65 };
        default: return { x: 110, y: 65 };
      }
    }
  }, [minimized]);

  // DFA transition function
  const transition = (state: string, char: string): string => {
    if (state === 'q0') {
      return char === 'a' ? 'q1' : 'q0';
    }
    if (state === 'q1' || state === 'q2') {
      return char === 'b' ? 'q3' : 'q1'; // both transit to q3 on b, and q1 on a
    }
    if (state === 'q3') {
      return char === 'a' ? 'q1' : 'q0';
    }
    return 'q0';
  };

  // Run input evaluation step-by-step
  React.useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCharIndex(idx => {
        const nextIdx = idx + 1;
        if (nextIdx >= input.length) {
          setIsPlaying(false);
          clearInterval(interval);
          return idx;
        }
        
        const nextChar = input[nextIdx];
        setActiveState(state => transition(state, nextChar));
        return nextIdx;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, input]);

  const startTracing = () => {
    setActiveState('q0');
    setCharIndex(-1);
    setIsPlaying(true);
  };

  const stepTracing = () => {
    if (charIndex + 1 >= input.length) return;
    const nextIdx = charIndex + 1;
    const nextChar = input[nextIdx];
    setActiveState(state => transition(state, nextChar));
    setCharIndex(nextIdx);
  };

  const reset = () => {
    setActiveState('q0');
    setCharIndex(-1);
    setIsPlaying(false);
  };

  const toggleMinimization = () => {
    setMinimized(!minimized);
    reset();
  };

  const matches = activeState === 'q3';

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>
          {language === 'en' ? 'Hall XVI: Myhill-Nerode DFA Minimization' : '第XVI室：マイヒル・ネローデの定理とDFAの商化'}
        </h4>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {language === 'en'
            ? 'Minimize equivalent states. The quotient relation merges redundant DFA states into a single minimal state.'
            : '同値な状態を最小化します。商関係により、冗長なDFA状態が衝突・融合して単一の最小状態になります。'}
        </p>

        {/* The Visual Dialectic (Left vs Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {/* Syntax DFA Grid (Left) */}
          <div style={{ background: 'rgba(56, 189, 248, 0.02)', border: '1px solid rgba(56, 189, 248, 0.12)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.55rem', color: '#38bdf8', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              DFA STATE GRAPH (SYNTAX GENERATORS)
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 220 135" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
            >
              <defs>
                <marker id="dfa-arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="rgba(255,255,255,0.4)" />
                </marker>
                <marker id="dfa-active-arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--primary)" />
                </marker>
              </defs>

              {/* Transitions */}
              {/* q0 -> q1 (on a) */}
              <path 
                d={`M ${getStatePos('q0').x},${getStatePos('q0').y} L ${getStatePos('q1').x},${getStatePos('q1').y}`}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
                markerEnd="url(#dfa-arrow)"
              />
              <text x={(getStatePos('q0').x + getStatePos('q1').x)/2} y={(getStatePos('q0').y + getStatePos('q1').y)/2 - 2} fill="#38bdf8" fontSize="6" fontWeight="bold">a</text>

              {/* q0 -> q0 (on b) loop */}
              <path 
                d={`M ${getStatePos('q0').x - 5},${getStatePos('q0').y - 8} C ${getStatePos('q0').x - 15},${getStatePos('q0').y - 25} ${getStatePos('q0').x + 10},${getStatePos('q0').y - 25} ${getStatePos('q0').x},${getStatePos('q0').y - 8}`}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
                markerEnd="url(#dfa-arrow)"
              />
              <text x={getStatePos('q0').x - 3} y={getStatePos('q0').y - 20} fill="#38bdf8" fontSize="6">b</text>

              {/* q1 -> q3 (on b) */}
              {!minimized && (
                <>
                  <path 
                    d={`M ${getStatePos('q1').x},${getStatePos('q1').y} L ${getStatePos('q3').x},${getStatePos('q3').y}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    markerEnd="url(#dfa-arrow)"
                  />
                  <text x={(getStatePos('q1').x + getStatePos('q3').x)/2} y={(getStatePos('q1').y + getStatePos('q3').y)/2 - 2} fill="#38bdf8" fontSize="6" fontWeight="bold">b</text>
                </>
              )}

              {/* q2 -> q3 (on b) */}
              {!minimized && (
                <>
                  <path 
                    d={`M ${getStatePos('q2').x},${getStatePos('q2').y} L ${getStatePos('q3').x},${getStatePos('q3').y}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    markerEnd="url(#dfa-arrow)"
                  />
                  <text x={(getStatePos('q2').x + getStatePos('q3').x)/2} y={(getStatePos('q2').y + getStatePos('q3').y)/2 + 6} fill="#38bdf8" fontSize="6" fontWeight="bold">b</text>
                </>
              )}

              {/* q12 -> q3 (fused transition on b) */}
              {minimized && (
                <>
                  <path 
                    d={`M ${getStatePos('q1').x},${getStatePos('q1').y} L ${getStatePos('q3').x},${getStatePos('q3').y}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    markerEnd="url(#dfa-arrow)"
                  />
                  <text x={(getStatePos('q1').x + getStatePos('q3').x)/2} y={(getStatePos('q1').y + getStatePos('q3').y)/2 - 3} fill="#38bdf8" fontSize="6" fontWeight="bold">b</text>
                </>
              )}

              {/* q3 -> q0 (on b) */}
              <path 
                d={`M ${getStatePos('q3').x},${getStatePos('q3').y} C ${(getStatePos('q3').x + getStatePos('q0').x)/2},130 ${(getStatePos('q3').x + getStatePos('q0').x)/2},130 ${getStatePos('q0').x},${getStatePos('q0').y}`}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                markerEnd="url(#dfa-arrow)"
              />
              <text x={(getStatePos('q3').x + getStatePos('q0').x)/2} y={125} fill="#38bdf8" fontSize="6">b</text>

              {/* Render DFA states */}
              {['q0', 'q1', 'q2', 'q3'].map(s => {
                // If minimized, q2 is completely hidden (fused with q1)
                if (minimized && s === 'q2') return null;
                const pos = getStatePos(s);
                const isActive = activeState === s || (minimized && activeState === 'q2' && s === 'q1');
                const isAccept = s === 'q3';
                
                const label = minimized && s === 'q1' ? 'q₁₂' : s;
                
                return (
                  <g key={`st-${s}`} style={{ transition: 'all 1s ease-in-out' }}>
                    {isAccept && (
                      <circle 
                        cx={pos.x} 
                        cy={pos.y} 
                        r="11" 
                        fill="none" 
                        stroke={isActive ? 'var(--success)' : 'rgba(255,255,255,0.3)'} 
                        strokeWidth="0.8" 
                      />
                    )}
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r="9" 
                      fill={isActive ? (isAccept ? 'var(--success)' : 'var(--primary)') : 'rgba(10,15,30,0.8)'}
                      stroke={isActive ? '#fff' : 'rgba(255,255,255,0.2)'}
                      strokeWidth="1"
                      style={{ cursor: 'pointer' }}
                    />
                    <text x={pos.x} y={pos.y + 3} fill={isActive ? '#000' : '#fff'} fontSize="7" fontWeight="bold" textAnchor="middle">{label}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right Panel: Minimization Equivalence Partition (Right) */}
          <div style={{ 
            background: 'rgba(212, 175, 55, 0.02)', 
            border: highlightSemantics ? '2px solid var(--success)' : '1px solid rgba(212, 175, 55, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            boxShadow: highlightSemantics ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <div>
              <span style={{ fontSize: '0.55rem', color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                MYHILL-NERODE QUOTIENT
              </span>
              <div style={{ minHeight: '85px', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.625rem' }}>
                <div><strong>Equivalence Classes:</strong></div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', marginTop: '2px' }}>
                  [q₀] = {`{ε, b, bb, ...}`}<br />
                  <span style={{ color: minimized ? 'var(--success)' : 'inherit' }}>
                    [q₁] = {`{a, aa, ...}`}
                  </span><br />
                  {!minimized ? (
                    <span>[q₂] = {`{a, aa, ...}`} (Redundant!)</span>
                  ) : (
                    <span style={{ color: 'var(--success)' }}>[q₁₂] = [q₁] ∪ [q₂] (Fused)</span>
                  )}<br />
                  [q₃] = {`{ab, aab, ...}`} (Accept)
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.25rem' }}>
              {minimized ? 'Minimal DFA: 3 states.' : 'Syntax DFA: 4 states.'}
            </div>
          </div>
        </div>

        {/* Input box */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Input:</span>
          <input
            type="text"
            value={input}
            onChange={e => {
              setInput(e.target.value.replace(/[^ab]/g, ''));
              reset();
            }}
            placeholder="e.g. ab"
            className="input-text"
            style={{ fontSize: '0.65rem', padding: '3px 6px', background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', flexGrow: 1 }}
          />
          {charIndex >= 0 && (
            <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--primary)' }}>
              {input.split('').map((c, i) => (
                <span key={i} style={{ color: i === charIndex ? 'var(--primary)' : 'rgba(255,255,255,0.3)', fontWeight: i === charIndex ? 'bold' : 'normal' }}>{c}</span>
              ))}
            </span>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
          <button onClick={reset} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Reset</button>
          <button onClick={stepTracing} disabled={isPlaying || charIndex + 1 >= input.length} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Step</button>
          <button onClick={startTracing} disabled={isPlaying} className="btn btn-primary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Run Path</button>
          <button 
            onClick={toggleMinimization} 
            className="btn btn-outline" 
            style={{ padding: '3px 8px', fontSize: '0.6rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            {minimized ? 'Expand DFA' : 'Minimize DFA'}
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '0.25rem', textAlign: 'center', fontSize: '0.65rem' }}>
        {matches ? (
          <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ Accepted (Equivalent to regex (a|b)*ab*)</span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>State: {activeState}</span>
        )}
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
export function HoTTVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [progress, setProgress] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (hoveredSymbol === 'A =_{\\mathcal{U}} B') {
      setProgress(100);
    } else if (hoveredSymbol === 'A \\simeq B') {
      setProgress(0);
    }
  }, [hoveredSymbol]);

  const highlightLeft = hoveredSymbol === 'A \\simeq B';
  const highlightRight = hoveredSymbol === 'A =_{\\mathcal{U}} B';

  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const reset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const stepForward = () => {
    setProgress(p => Math.min(100, p + 10));
  };

  const stepBackward = () => {
    setProgress(p => Math.max(0, p - 10));
  };

  // Interpolated shape coordinates
  // Circle at 0 progress, morphs to match B (ellipse) at 100 progress
  const rX = 15 + (progress * 0.1);  // 15 -> 25
  const rY = 15 - (progress * 0.05); // 15 -> 10
  
  // Interpolated position from A (40, 65) to B (170, 65)
  const posX = 40 + (progress * 1.3);

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>
          {language === 'en' ? 'Hall XVIII: Voevodsky Univalence Axiom' : '第XVIII室：ヴォエヴォドスキーの一価性公理'}
        </h4>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {language === 'en'
            ? 'Observe equivalent types morphing. The Univalence Axiom identifies equivalent types as identical in the universe.'
            : '同値な型同士が変形する様子を観察します。一価性公理は、同値な型（構文）を宇宙における同一（意味論）とみなします。'}
        </p>

        {/* The Visual Dialectic (Left vs Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {/* Syntax Space (Left) */}
          <div style={{ 
            background: 'rgba(56, 189, 248, 0.02)', 
            border: highlightLeft ? '2px solid var(--primary)' : '1px solid rgba(56, 189, 248, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: highlightLeft ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '0.55rem', color: '#38bdf8', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              SYNTAX: EQUIVALENCE A ≃ B
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 220 130" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
            >
              {/* Type A (Circle) */}
              <circle cx="45" cy="65" r="14" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="45" y="68" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">Type A</text>

              {/* Equivalence path */}
              <path d="M 65 65 L 155 65" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3,3" />
              <text x="110" y="60" fill="#38bdf8" fontSize="8" textAnchor="middle">≃</text>

              {/* Type B (Ellipse) */}
              <ellipse cx="175" cy="65" rx="22" ry="11" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="175" y="68" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">Type B</text>
            </svg>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'center' }}>
              Distinct types with isomorphic structure
            </div>
          </div>

          {/* Semantic Space (Right) */}
          <div style={{ 
            background: 'rgba(212, 175, 55, 0.02)', 
            border: highlightRight ? '2px solid var(--success)' : '1px solid rgba(212, 175, 55, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: highlightRight ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--primary)', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              UNIVALENCE: IDENTITY A = B
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 220 130" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
            >
              {/* Type Universe Grid background */}
              <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <path key={`g-${i}`} d={`M ${10 + i * 40} 0 Q 110 65 ${10 + i * 40} 130`} fill="none" />
                ))}
              </g>

              {/* Destination Type B */}
              <ellipse cx="170" cy="65" rx="25" ry="10" fill="rgba(212, 175, 55, 0.1)" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" />
              <text x="170" y="68" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">B</text>

              {/* Morphing and Moving Type A */}
              <ellipse 
                cx={posX} 
                cy="65" 
                rx={rX} 
                ry={rY} 
                fill={progress === 100 ? 'var(--success)' : 'var(--primary)'} 
                stroke="#fff" 
                strokeWidth="1.5"
                style={{ filter: progress === 100 ? 'drop-shadow(0 0 4px var(--success))' : 'none' }}
              />
              <text x={posX} y="68" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">
                {progress === 100 ? 'A = B' : 'A'}
              </text>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                Universe Morpher: {progress}%
              </span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                {progress === 100 ? 'Identity Achieved' : 'Warping path'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
          <button onClick={reset} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Reset</button>
          <button onClick={stepBackward} disabled={progress === 0} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Step Back</button>
          <button onClick={stepForward} disabled={progress === 100} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.6rem' }}>Step Next</button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="btn btn-primary"
            style={{ padding: '3px 10px', fontSize: '0.6rem' }}
          >
            {isPlaying ? 'Pause' : (progress === 100 ? 'Restart' : 'Univalence')}
          </button>
        </div>
      </div>
      
      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.25rem' }}>
        {"Univalence Axiom: $(A \\simeq B) \\simeq (A =_{\\mathcal{U}} B)$"}
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

// ============================================================================
// ROOM 25: The Yoneda Lemma
// ============================================================================
export function YonedaVisualizer({ language, hoveredSymbol }: VisualizerProps) {
  const [selectedObj, setSelectedObj] = React.useState<'A' | 'B' | 'C'>('A');
  const [hoveredObj, setHoveredObj] = React.useState<'A' | 'B' | 'C' | null>(null);
  const [functorType, setFunctorType] = React.useState<'contravariant' | 'covariant'>('contravariant');
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (hoveredSymbol === '\\text{Hom}(-, A)') {
      setSelectedObj('A');
      setFunctorType('contravariant');
    }
  }, [hoveredSymbol]);

  const highlightRight = hoveredSymbol === '\\text{Hom}(-, A)';

  const activeFocus = hoveredObj || selectedObj;

  // Node position coordinates for A, B, C on left/right panels
  const getLeftNodePos = (name: string) => {
    switch (name) {
      case 'A': return { x: 45, y: 35 };
      case 'B': return { x: 45, y: 70 };
      case 'C': return { x: 45, y: 105 };
      default: return { x: 45, y: 70 };
    }
  };

  const getRightNodePos = (name: string) => {
    switch (name) {
      case 'A': return { x: 175, y: 35 };
      case 'B': return { x: 110, y: 70 };
      case 'C': return { x: 175, y: 105 };
      default: return { x: 175, y: 70 };
    }
  };

  return (
    <div className="animate-pop-in flex flex-col h-full justify-between" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h4 className="workspace-title" style={{ color: 'var(--primary)', marginBottom: '0.4rem' }}>
          {language === 'en' ? 'Hall XXV: The Yoneda Lemma Relationalism' : '第XXV室：米田の補題と関係性の存在論'}
        </h4>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {language === 'en'
            ? 'Hover over nodes. Category objects have no internal elements; identity is the sum of incoming/outgoing morphisms Hom(-, X).'
            : 'ノードにホバーします。対象自体には「中身」がなく、その同一性は他対象との関係性の総和 Hom(-, X) として定義されます。'}
        </p>

        {/* The Visual Dialectic (Left vs Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {/* Syntax Space (Left) */}
          <div style={{ background: 'rgba(56, 189, 248, 0.02)', border: '1px solid rgba(56, 189, 248, 0.12)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.55rem', color: '#38bdf8', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              SYNTAX SPACE (OBJECTS WITH NO ESSENCE)
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 100 135" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
            >
              {['A', 'B', 'C'].map(name => {
                const pos = getLeftNodePos(name);
                const isFocused = activeFocus === name;
                return (
                  <g 
                    key={`ln-${name}`} 
                    onMouseEnter={() => setHoveredObj(name as any)}
                    onMouseLeave={() => setHoveredObj(null)}
                    onClick={() => setSelectedObj(name as any)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r="12" 
                      fill="rgba(10,15,30,0.9)" 
                      stroke={isFocused ? '#38bdf8' : 'rgba(56,189,248,0.3)'} 
                      strokeWidth={isFocused ? '2' : '1'} 
                      style={{ filter: isFocused ? 'drop-shadow(0 0 3px #38bdf8)' : 'none', transition: 'all 0.2s' }}
                    />
                    <text x={pos.x} y={pos.y + 3} fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">{name}</text>
                    {/* Visualizing "No internal elements" as a hollow void */}
                    <circle cx={pos.x} cy={pos.y} r="4" fill="#000" opacity="0.8" />
                  </g>
                );
              })}
            </svg>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'center' }}>
              Click to select object.
            </div>
          </div>

          {/* Semantic Space (Right) */}
          <div style={{ 
            background: 'rgba(212, 175, 55, 0.02)', 
            border: highlightRight ? '2px solid var(--success)' : '1px solid rgba(212, 175, 55, 0.12)', 
            borderRadius: '8px', 
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: highlightRight ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--primary)', fontWeight: 'bold', alignSelf: 'flex-start' }}>
              SEMANTIC SPACE (RELATIONAL PRE-SHEAF Hom(-, {activeFocus}))
            </span>
            <svg 
              width="100%" 
              viewBox="0 0 240 135" 
              style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '0.25rem' }}
            >
              <defs>
                <marker id="yoneda-arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--primary)" />
                </marker>
                <marker id="yoneda-active-arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--success)" />
                </marker>
              </defs>

              {/* Render structural morphism arrows */}
              {/* Arrow f: B -> A */}
              <path 
                d={`M ${getRightNodePos('B').x},${getRightNodePos('B').y} L ${getRightNodePos('A').x},${getRightNodePos('A').y}`}
                fill="none"
                stroke={activeFocus === 'A' && functorType === 'contravariant' ? 'var(--success)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={activeFocus === 'A' && functorType === 'contravariant' ? '1.5' : '0.8'}
                markerEnd={activeFocus === 'A' && functorType === 'contravariant' ? 'url(#yoneda-active-arrow)' : 'url(#yoneda-arrow)'}
              />
              <text x={(getRightNodePos('B').x + getRightNodePos('A').x)/2 - 8} y={(getRightNodePos('B').y + getRightNodePos('A').y)/2 - 2} fill="rgba(255,255,255,0.4)" fontSize="7">f</text>

              {/* Arrow g: B -> C */}
              <path 
                d={`M ${getRightNodePos('B').x},${getRightNodePos('B').y} L ${getRightNodePos('C').x},${getRightNodePos('C').y}`}
                fill="none"
                stroke={activeFocus === 'C' && functorType === 'contravariant' ? 'var(--success)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={activeFocus === 'C' && functorType === 'contravariant' ? '1.5' : '0.8'}
                markerEnd={activeFocus === 'C' && functorType === 'contravariant' ? 'url(#yoneda-active-arrow)' : 'url(#yoneda-arrow)'}
              />
              <text x={(getRightNodePos('B').x + getRightNodePos('C').x)/2 - 8} y={(getRightNodePos('B').y + getRightNodePos('C').y)/2 + 6} fill="rgba(255,255,255,0.4)" fontSize="7">g</text>

              {/* Arrow h: A -> C (composition) */}
              <path 
                d={`M ${getRightNodePos('A').x},${getRightNodePos('A').y} L ${getRightNodePos('C').x},${getRightNodePos('C').y}`}
                fill="none"
                stroke={activeFocus === 'C' && functorType === 'contravariant' ? 'var(--success)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={activeFocus === 'C' && functorType === 'contravariant' ? '1.5' : '0.8'}
                strokeDasharray="2,2"
                markerEnd="url(#yoneda-arrow)"
              />
              <text x={getRightNodePos('A').x + 5} y={(getRightNodePos('A').y + getRightNodePos('C').y)/2 + 2} fill="rgba(255,255,255,0.3)" fontSize="6">h=g∘f</text>

              {/* Loop id_X */}
              {['A', 'B', 'C'].map(name => {
                const pos = getRightNodePos(name);
                const isSelected = activeFocus === name;
                if (!isSelected) return null;
                return (
                  <path 
                    key={`loop-${name}`}
                    d={`M ${pos.x - 5},${pos.y - 10} C ${pos.x - 15},${pos.y - 22} ${pos.x + 15},${pos.y - 22} ${pos.x + 5},${pos.y - 10}`}
                    fill="none"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    markerEnd="url(#yoneda-active-arrow)"
                  />
                );
              })}

              {/* Render category objects */}
              {['A', 'B', 'C'].map(name => {
                const pos = getRightNodePos(name);
                const isTarget = activeFocus === name;
                return (
                  <g key={`rn-${name}`}>
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r="10" 
                      fill={isTarget ? 'var(--success)' : 'rgba(10,15,30,0.9)'} 
                      stroke={isTarget ? '#fff' : 'rgba(255,255,255,0.2)'} 
                      strokeWidth="1"
                    />
                    <text x={pos.x} y={pos.y + 3} fill={isTarget ? '#000' : '#fff'} fontSize="7" fontWeight="bold" textAnchor="middle">{name}</text>
                  </g>
                );
              })}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                Hom(-, {activeFocus})
              </span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                {activeFocus === 'A' ? 'Hom(B,A) = {f}' : activeFocus === 'B' ? 'Hom(X,B) = {id_B}' : 'Hom(A,C)={h}, Hom(B,C)={g}'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.25rem' }}>
          <button 
            onClick={() => setFunctorType(t => t === 'contravariant' ? 'covariant' : 'contravariant')} 
            className="btn btn-secondary" 
            style={{ padding: '3px 8px', fontSize: '0.6rem' }}
          >
            {functorType === 'contravariant' ? 'Presheaf Hom(-, X)' : 'Copresheaf Hom(X, -)'}
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="btn btn-outline" 
            style={{ padding: '3px 8px', fontSize: '0.6rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            {isPlaying ? 'Pause' : 'Compose Play'}
          </button>
        </div>
      </div>
      
      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.25rem' }}>
        {"Yoneda isomorphism: $\\text{Nat}(h^X, P) \\cong P(X)$ or embedding $\\mathcal{C}(X, Y) \\cong \\text{Nat}(h^X, h^Y)$"}
      </div>
    </div>
  );
}

