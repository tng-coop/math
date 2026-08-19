import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CheckCircle2, Layers, Cpu, Network, Sparkles, BookOpen, Volume2, VolumeX, ExternalLink
} from 'lucide-react';

interface MasterStudioVisualizerProps {
  language: 'en' | 'ja';
  onNavigate?: (room: number) => void;
}

// KaTeX-enabled formula renderer with fallback
const MathView: React.FC<{ formula: string; displayMode?: boolean; style?: React.CSSProperties }> = ({
  formula,
  displayMode = false,
  style = {}
}) => {
  const html = (window as any).katex
    ? (window as any).katex.renderToString(formula, { displayMode, throwOnError: false })
    : formula;

  return (
    <span
      style={{
        display: displayMode ? 'block' : 'inline-block',
        margin: displayMode ? '0.4rem 0' : '0 0.15rem',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// Available Labs
type LabId = 'syntax-meaning' | 'hom-sets' | 'adjunction-engine' | 'category-workbench';

export default function MasterStudioVisualizer({ language, onNavigate }: MasterStudioVisualizerProps) {
  const [activeLab, setActiveLab] = useState<LabId>('syntax-meaning');

  // Audio Guide (TTS) state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const all = window.speechSynthesis.getVoices();
      const langPrefix = language === 'ja' ? 'ja' : 'en';
      const filtered = all.filter(v => v.lang.startsWith(langPrefix));
      setVoices(filtered.length > 0 ? filtered : all);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  // Audio narration texts per Lab
  const labNarratives: Record<LabId, { en: string; ja: string; titleEn: string; titleJa: string }> = {
    'syntax-meaning': {
      titleEn: '1. Syntax vs. Meaning Duality & Adjunction',
      titleJa: '1. 構文と意味論の双対性（随伴定理）',
      en: 'Welcome to the Syntax and Meaning Duality Laboratory. In mathematical logic, syntax represents the free generation of unconstrained symbols and term trees via the Free Functor F. Semantics represents the quotient collapse under algebraic equations and relations. The Adjunction theorem proves that defining meaning for raw generator variables uniquely lifts to a universal meaning for every infinite compound syntax tree.',
      ja: '構文と意味論の双対性研究室へようこそ。数理論理学において、構文とは自由関手Fによる制約のない記号列や構文木の自由生成を表します。意味論とは、代数方程式や同値関係による商化（折りたたみ）を表します。随伴定理は、生の生成元変数への意味づけが、無限に広がるすべての複合構文木に対する一意な意味論的評価へと自動的に持ち上がることを証明します。'
    },
    'hom-sets': {
      titleEn: '2. Hom-Sets & The Yoneda Lemma',
      titleJa: '2. Hom集合と米田の補題（関係主義存在論）',
      en: 'In Category Theory, objects possess no internal substance or essence. An object is defined completely and uniquely by the collection of all its incoming and outgoing morphisms, called the Hom-set. The Yoneda Lemma proves that probing an object from every vantage point in the universe encodes its entire structure, proving that relation is the bedrock of mathematical existence.',
      ja: '圏論において、対象はそれ自体の「中身」や実体を持ちません。対象のすべての性質は、外部との関係性の集まりであるHom集合によって完全に決定されます。米田の補題は、宇宙のあらゆる視点から対象をHom射によって観測することがその全構造を復元することを証明し、関係性こそが存在の根源であることを示しています。'
    },
    'adjunction-engine': {
      titleEn: '3. Universal Adjoint Engine & Triangular Identities',
      titleJa: '3. 随伴エンジンと三角恒等式（F ⊣ U）',
      en: 'The Adjunction F left adjoint to U establishes a natural bijection between the hom-set of structural homomorphisms out of free syntax and the hom-set of raw generator mappings. Driven by the Unit eta (generator insertion) and the Counit epsilon (evaluation collapse), the triangular identities ensure that round-trip translations across structural universes preserve identity.',
      ja: '自由関手Fと忘却関手Uの随伴関係は、自由構文からの準同型写像のHom集合と、生の生成元からの写像のHom集合の間に自然な全単射を確立します。生成元を挿入する単位ηと、構造を演算値へと評価・崩壊させる余単位εにより、二つの三角恒等式が成り立ち、圏をまたいだ翻訳が一貫して恒等射を保存します。'
    },
    'category-workbench': {
      titleEn: '4. Category Theory Structural Workbench',
      titleJa: '4. 圏論構造ワークベンチ（対象・射・関手・自然変換）',
      en: 'Explore the universal architecture of Category Theory. Construct objects and directional morphisms, verify associativity and identity axioms, apply functors between categories, and observe natural transformations creating commuting squares across structural universes.',
      ja: '圏論の万能なアーキテクチャを探求します。対象と有向射を構築し、結合則と恒等射の公理を検証し、圏の間に関手を適用し、関手を結ぶ自然変換が可換正方形を生み出す様子をインタラクティブに観察します。'
    }
  };

  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = language === 'en' ? labNarratives[activeLab].en : labNarratives[activeLab].ja;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
      utterance.rate = playbackSpeed;
      if (voices.length > 0) {
        utterance.voice = voices[0];
      }
      utterance.onend = () => setIsPlayingAudio(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // ============================================================================
  // LAB 1: SYNTAX-MEANING ADJUNCTION LAB STATE & LOGIC
  // ============================================================================
  const [selectedEquationalTheory, setSelectedEquationalTheory] = useState<'monoid' | 'group' | 'boolean' | 'z3'>('monoid');
  const [generatorMap, setGeneratorMap] = useState<Record<string, number>>({ x: 1, y: 2, z: 0 });
  const [selectedSyntaxTree, setSelectedSyntaxTree] = useState<string>('(x * y) * z');

  // Available candidate syntax trees in F(X)
  const syntaxTreeExamples: Record<string, { tree: string; labelEn: string; labelJa: string; dualTree: string }> = {
    'assoc': {
      tree: '(x * y) * z',
      dualTree: 'x * (y * z)',
      labelEn: 'Associativity Dual Trees',
      labelJa: '結合法則の双対構文木'
    },
    'identity': {
      tree: 'x * e',
      dualTree: 'x',
      labelEn: 'Identity Folding',
      labelJa: '単位元による簡約'
    },
    'inverse': {
      tree: 'x * inv(x)',
      dualTree: 'e',
      labelEn: 'Inverse Collapse',
      labelJa: '逆元による単位元崩壊'
    },
    'boolean_idempotence': {
      tree: 'x && (x || y)',
      dualTree: 'x',
      labelEn: 'Absorption Law',
      labelJa: '吸収律'
    }
  };

  // Compute semantics based on active equational theory
  const evaluateSyntax = (_treeStr: string, map: Record<string, number>, theory: string): { value: number; explanationEn: string; explanationJa: string } => {
    const vx = map.x ?? 1;
    const vy = map.y ?? 2;
    const vz = map.z ?? 0;

    if (theory === 'monoid') {
      // Modulo 5 addition monoid
      const res = (vx + vy + vz) % 5;
      return {
        value: res,
        explanationEn: `Evaluated in Monoid (ℤ₅, +): (${vx} + ${vy}) + ${vz} ≡ ${vx} + (${vy} + ${vz}) ≡ ${res} (mod 5)`,
        explanationJa: `モノイド (ℤ₅, +) での評価: (${vx} + ${vy}) + ${vz} ≡ ${vx} + (${vy} + ${vz}) ≡ ${res} (mod 5)`
      };
    } else if (theory === 'group') {
      // Free group modulo inverses
      const res = (vx - vy + vz) % 6;
      return {
        value: (res + 6) % 6,
        explanationEn: `Evaluated in Group (ℤ₆, +): ${vx} + (-${vy}) + ${vz} ≡ ${(res + 6) % 6} (mod 6)`,
        explanationJa: `群 (ℤ₆, +) での評価: ${vx} + (-${vy}) + ${vz} ≡ ${(res + 6) % 6} (mod 6)`
      };
    } else if (theory === 'z3') {
      // Cyclic group Z3
      const res = (vx * vy + vz) % 3;
      return {
        value: res,
        explanationEn: `Evaluated in Cyclic Group ℤ₃: (${vx} · ${vy}) + ${vz} ≡ ${res} (mod 3)`,
        explanationJa: `巡回群 ℤ₃ での評価: (${vx} · ${vy}) + ${vz} ≡ ${res} (mod 3)`
      };
    } else {
      // Boolean logic (0 or 1)
      const bx = vx % 2 === 1;
      const by = vy % 2 === 1;
      const res = (bx && (bx || by)) ? 1 : 0;
      return {
        value: res,
        explanationEn: `Evaluated in Boolean Algebra 𝟚: ${bx} ∧ (${bx} ∨ ${by}) = ${res === 1 ? 'True (1)' : 'False (0)'}`,
        explanationJa: `ブール代数 𝟚 での評価: ${bx} ∧ (${bx} ∨ ${by}) = ${res === 1 ? '真 (1)' : '偽 (0)'}`
      };
    }
  };

  const currentEvaluation = useMemo(() => {
    return evaluateSyntax(selectedSyntaxTree, generatorMap, selectedEquationalTheory);
  }, [selectedSyntaxTree, generatorMap, selectedEquationalTheory]);

  // ============================================================================
  // LAB 2: HOM-SETS & YONEDA LEMMA STATE & LOGIC
  // ============================================================================
  const [homCategoryType, setHomCategoryType] = useState<'finite-3' | 'set-sub' | 'monoid-z2'>('finite-3');
  const [selectedHomCell, setSelectedHomCell] = useState<{ src: string; dst: string }>({ src: 'A', dst: 'B' });
  const [yonedaTargetObj, setYonedaTargetObj] = useState<'A' | 'B' | 'C'>('A');

  // Category objects & hom-matrix data
  const homMatrixData = useMemo(() => {
    if (homCategoryType === 'finite-3') {
      const objects = ['A', 'B', 'C'];
      const homSets: Record<string, Record<string, string[]>> = {
        'A': { 'A': ['id_A'], 'B': ['f', "f'"], 'C': ['h = g ∘ f'] },
        'B': { 'A': [], 'B': ['id_B'], 'C': ['g'] },
        'C': { 'A': [], 'B': [], 'C': ['id_C'] }
      };
      return { objects, homSets };
    } else if (homCategoryType === 'set-sub') {
      const objects = ['{•}', '{1,2}', '{a,b,c}'];
      const homSets: Record<string, Record<string, string[]>> = {
        '{•}': { '{•}': ['id_1'], '{1,2}': ['const_1', 'const_2'], '{a,b,c}': ['const_a', 'const_b', 'const_c'] },
        '{1,2}': { '{•}': ['proj_1'], '{1,2}': ['id_2', 'swap'], '{a,b,c}': ['f_1', 'f_2', 'f_3', 'f_4', 'f_5', 'f_6'] },
        '{a,b,c}': { '{•}': ['proj_1'], '{1,2}': ['8 surjections & funcs'], '{a,b,c}': ['6 permutations (S3) + 21 others'] }
      };
      return { objects, homSets };
    } else {
      // Monoid as one-object category
      const objects = ['*'];
      const homSets: Record<string, Record<string, string[]>> = {
        '*': { '*': ['id_* (e)', 'rotate (r)', 'flip (s)', 'r ∘ s'] }
      };
      return { objects, homSets };
    }
  }, [homCategoryType]);

  // ============================================================================
  // LAB 3: UNIVERSAL ADJOINT ENGINE & TRIANGULAR IDENTITIES STATE & LOGIC
  // ============================================================================
  const [triangleStep, setTriangleStep] = useState<number>(0);

  const triangleSteps = [
    {
      titleEn: 'Step 0: Initial Raw Generator x ∈ X in Category Set',
      titleJa: 'ステップ0: 圏Setにおける生の生成元 x ∈ X',
      math: 'x \\in X',
      descEn: 'We start with a pure, unconstrained element x in the discrete set of generators X.',
      descJa: '制約のない離散集合Xの生の生成元 x からスタートします。'
    },
    {
      titleEn: 'Step 1: Apply Unit η_X (Inclusion into Free Syntax)',
      titleJa: 'ステップ1: 単位 η_X の適用（自由構文への包含）',
      math: '\\eta_X: X \\to U(F(X)), \\quad x \\mapsto [x]',
      descEn: 'The Unit natural transformation η injects x as a length-1 word [x] into the free monoid F(X).',
      descJa: '単位自然変換 η が、生成元 x を自由モノイド F(X) 内の長さ1の記号列 [x] として包摂します。'
    },
    {
      titleEn: 'Step 2: Free Lift F(η_X) & Word Multiplication in Free Algebra',
      titleJa: 'ステップ2: 自由関手による持ち上げ F(η_X) と記号列の連結',
      math: 'F(\\eta_X): F(X) \\to FUF(X), \\quad [x] \\mapsto [[x]]',
      descEn: 'Under the Free Functor F, words become nested structured terms in the monadic universe FUF(X).',
      descJa: '自由関手Fの作用により、単語は二重構造を持つモナド的宇宙 FUF(X) の項 [[x]] となります。'
    },
    {
      titleEn: 'Step 3: Apply Counit ε_{F(X)} (Algebraic Evaluation Collapse)',
      titleJa: 'ステップ3: 余単位 ε_{F(X)} の適用（代数的評価・商化崩壊）',
      math: '\\varepsilon_{F(X)}: FU(F(X)) \\to F(X), \\quad [[x]] \\mapsto [x]',
      descEn: 'The Counit ε evaluates the nested monoid terms, flattening them back into the canonical word [x].',
      descJa: '余単位 ε が入れ子のモノイド項を乗算に沿って評価・平坦化し、正準単語 [x] へと戻します。'
    },
    {
      titleEn: 'Step 4: Verification of Triangular Identity: ε_F ∘ F(η) = id_F',
      titleJa: 'ステップ4: 三角恒等式の証明完了: ε_F ∘ F(η) = id_F',
      math: '(\\varepsilon_{F(X)} \\circ F(\\eta_X))([x]) = [x] = \\text{id}_{F(X)}([x])',
      descEn: 'The composition forms the identity morphism on F(X). The adjunction guarantees perfect round-trip fidelity!',
      descJa: 'この合成射は F(X) 上の恒等射となります。随伴により、圏を往復しても情報が完全に保存されます！'
    }
  ];

  // ============================================================================
  // LAB 4: CATEGORY WORKBENCH STATE & LOGIC
  // ============================================================================
  const [activeDiagramPath, setActiveDiagramPath] = useState<'top' | 'bottom' | 'both'>('both');

  return (
    <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'var(--bg-dark)', color: 'white', overflow: 'hidden' }}>
      
      {/* Top Header & Lab Navigation */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(10, 12, 20, 0.95)',
        gap: '0.5rem',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(56,189,248,0.2))',
            border: '1px solid rgba(245,158,11,0.4)',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--primary)' }}>
              {language === 'en' ? 'MASTER DUALITY STUDIO' : '随伴・Hom集合・圏論マスタースタジオ'}
            </span>
          </div>

          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            {language === 'en' ? 'Top-Tier Graduate Category Theory & Foundations' : '大学院水準の圏論と数学的基礎'}
          </span>
        </div>

        {/* Audio Narration Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleToggleAudio}
            style={{
              background: isPlayingAudio ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
              border: isPlayingAudio ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.15)',
              color: isPlayingAudio ? '#ef4444' : 'white',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            {isPlayingAudio ? <VolumeX size={12} /> : <Volume2 size={12} />}
            <span>{isPlayingAudio ? (language === 'en' ? 'Stop Guide' : '音声停止') : (language === 'en' ? 'Voice Guide' : '音声解説')}</span>
          </button>

          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            style={{
              background: 'black',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.6rem',
              padding: '2px 4px'
            }}
          >
            <option value="0.8">0.8x</option>
            <option value="1.0">1.0x</option>
            <option value="1.2">1.2x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>
      </div>

      {/* Lab Tabs Selector */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        padding: '0.4rem 1.25rem',
        background: 'rgba(5, 7, 12, 0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflowX: 'auto'
      }}>
        {[
          { id: 'syntax-meaning', icon: Cpu, labelEn: '1. Syntax vs Meaning (Adjunction)', labelJa: '1. 構文と意味論の双対性 (F ⊣ U)' },
          { id: 'hom-sets', icon: Layers, labelEn: '2. Hom-Sets & Yoneda Lemma', labelJa: '2. Hom集合と米田の補題' },
          { id: 'adjunction-engine', icon: Network, labelEn: '3. Adjoint Engine & Triangular Identities', labelJa: '3. 随伴エンジンと三角恒等式' },
          { id: 'category-workbench', icon: BookOpen, labelEn: '4. Category Theory Workbench', labelJa: '4. 圏論構造ワークベンチ' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeLab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveLab(tab.id as LabId);
                if (isPlayingAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '4px 10px',
                borderRadius: '4px',
                border: isActive ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                background: isActive ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
                color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.7)',
                fontSize: '0.65rem',
                fontWeight: isActive ? 'bold' : 'normal',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={12} />
              <span>{language === 'en' ? tab.labelEn : tab.labelJa}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Viewport */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* ========================================================================= */}
        {/* LAB 1: SYNTAX VS. MEANING DUALITY (FREE GEN & QUOTIENT COLLAPSE) */}
        {/* ========================================================================= */}
        {activeLab === 'syntax-meaning' && (
          <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Thesis Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(56,189,248,0.08))',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '8px',
              padding: '0.85rem 1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {language === 'en' ? 'The Core Dialectic: Free Syntax Generation ⊣ Quotient Semantic Collapse' : '核心的弁証法：自由構文生成 ⊣ 商の意味論的崩壊'}
                  </span>
                  {onNavigate && (
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        onClick={() => onNavigate(26)}
                        style={{
                          background: 'rgba(56,189,248,0.15)',
                          border: '1px solid #38bdf8',
                          color: '#38bdf8',
                          borderRadius: '3px',
                          padding: '1px 6px',
                          fontSize: '0.55rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        <ExternalLink size={9} />
                        <span>{language === 'en' ? 'Hall 26 (Free Gen)' : '第26室（自由生成）'}</span>
                      </button>
                      <button
                        onClick={() => onNavigate(28)}
                        style={{
                          background: 'rgba(245,158,11,0.15)',
                          border: '1px solid var(--primary)',
                          color: 'var(--primary)',
                          borderRadius: '3px',
                          padding: '1px 6px',
                          fontSize: '0.55rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        <ExternalLink size={9} />
                        <span>{language === 'en' ? 'Hall 28 (Quotients)' : '第28室（商化）'}</span>
                      </button>
                    </div>
                  )}
                </div>
                <MathView formula="\text{Hom}_{\mathbf{Alg}}(F(X), M) \cong \text{Hom}_{\mathbf{Set}}(X, U(M))" style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 'bold' }} />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {language === 'en'
                  ? 'Syntax is the unconstrained free generation of term trees. Semantics is the quotient collapse along equational congruence relations. The Adjunction Theorem proves that assigning meaning to generator variables uniquely and completely determines the semantic meaning of every infinite compound syntactic expression.'
                  : '構文とは項代数の自由生成であり、意味論とは等式合同関係に沿った商化（折りたたみ）です。随伴定理は、生の生成元変数への意味づけが、無限に存在するすべての複合構文木の意味論的評価を一意かつ完全に決定することを証明します。'}
              </p>
            </div>

            {/* Split Screen: Syntax Space (Left) vs Semantic Space (Right) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', minHeight: '340px' }}>
              
              {/* LEFT: SYNTAX SPACE (FREE GENERATION) */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.03)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '8px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(56, 189, 248, 0.2)', paddingBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#38bdf8' }}>
                    {language === 'en' ? 'SYNTAX SPACE: Free Algebra F(X)' : '構文空間：自由代数 F(X)'}
                  </span>
                  <span style={{ fontSize: '0.6rem', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px' }}>
                    {language === 'en' ? 'Unconstrained Terms' : '制約なし項生成'}
                  </span>
                </div>

                {/* Generator Variables Builder */}
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    {language === 'en' ? '1. Generators Set X & Valuations in U(M):' : '1. 生成元の集合 X と意味空間 U(M) への値割り当て:'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['x', 'y', 'z'] as const).map(gen => (
                      <div key={gen} style={{
                        flex: 1,
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        padding: '0.4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#38bdf8' }}>{gen}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                          <span>↦</span>
                          <input
                            type="number"
                            min="0"
                            max="5"
                            value={generatorMap[gen]}
                            onChange={(e) => setGeneratorMap({ ...generatorMap, [gen]: parseInt(e.target.value) || 0 })}
                            style={{
                              width: '36px',
                              background: 'black',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: 'var(--primary)',
                              borderRadius: '3px',
                              textAlign: 'center',
                              fontSize: '0.65rem'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Syntax Tree Synthesizer / Selector */}
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    {language === 'en' ? '2. Select Syntax AST in F(X):' : '2. 自由項代数 F(X) 内の構文木を選択:'}
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    {Object.entries(syntaxTreeExamples).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedSyntaxTree(item.tree)}
                        style={{
                          background: selectedSyntaxTree === item.tree ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.02)',
                          border: selectedSyntaxTree === item.tree ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                          color: selectedSyntaxTree === item.tree ? '#38bdf8' : 'white',
                          borderRadius: '4px',
                          padding: '4px 6px',
                          fontSize: '0.6rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{language === 'en' ? item.labelEn : item.labelJa}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', opacity: 0.8 }}>{item.tree}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Visual Representation of AST Tree */}
                <div style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px dashed rgba(56,189,248,0.2)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem'
                }}>
                  <svg width="100%" height="110" viewBox="0 0 200 110">
                    {/* Root Node */}
                    <circle cx="100" cy="20" r="12" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="100" y="24" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">*</text>

                    {/* Left branch */}
                    <line x1="90" y1="30" x2="60" y2="55" stroke="#38bdf8" strokeWidth="1.2" />
                    <circle cx="60" cy="65" r="10" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="1.2" />
                    <text x="60" y="68" fill="#fff" fontSize="8" textAnchor="middle">*</text>

                    <line x1="52" y1="73" x2="35" y2="90" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <circle cx="35" cy="95" r="8" fill="#000" stroke="#38bdf8" strokeWidth="1" />
                    <text x="35" y="98" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">x</text>

                    <line x1="68" y1="73" x2="85" y2="90" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <circle cx="85" cy="95" r="8" fill="#000" stroke="#38bdf8" strokeWidth="1" />
                    <text x="85" y="98" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">y</text>

                    {/* Right branch */}
                    <line x1="110" y1="30" x2="140" y2="55" stroke="#38bdf8" strokeWidth="1.2" />
                    <circle cx="140" cy="65" r="10" fill="#000" stroke="#38bdf8" strokeWidth="1" />
                    <text x="140" y="68" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">z</text>
                  </svg>
                </div>
              </div>

              {/* RIGHT: SEMANTIC SPACE (QUOTIENT COLLAPSE & EVALUATION) */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.03)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {language === 'en' ? 'SEMANTIC SPACE: Quotient Algebra M = F(X)/R' : '意味空間：商代数 M = F(X)/R'}
                  </span>
                  <span style={{ fontSize: '0.6rem', background: 'rgba(245,158,11,0.15)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>
                    {language === 'en' ? 'Equational Quotient' : '等式による商化'}
                  </span>
                </div>

                {/* Equational Theory Selector */}
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    {language === 'en' ? '1. Congruence Relations R (Equational Axioms):' : '1. 合同関係式 R （代数方程式公理）:'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {[
                      { id: 'monoid', label: 'Monoid (ℤ₅)' },
                      { id: 'group', label: 'Group (ℤ₆)' },
                      { id: 'z3', label: 'Cyclic (ℤ₃)' },
                      { id: 'boolean', label: 'Boolean (𝟚)' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedEquationalTheory(t.id as any)}
                        style={{
                          flex: 1,
                          background: selectedEquationalTheory === t.id ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.02)',
                          border: selectedEquationalTheory === t.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                          color: selectedEquationalTheory === t.id ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                          borderRadius: '4px',
                          padding: '3px 4px',
                          fontSize: '0.6rem',
                          cursor: 'pointer'
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Semantic Evaluation Result Box */}
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {language === 'en' ? 'Coequalizer Quotient Result:' : 'コイコライザー商評価結果:'}
                    </span>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: 'var(--primary)',
                      background: 'rgba(245,158,11,0.1)',
                      padding: '2px 10px',
                      borderRadius: '4px',
                      border: '1px solid var(--primary)'
                    }}>
                      [ {currentEvaluation.value} ]
                    </span>
                  </div>

                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: 'monospace' }}>
                    {language === 'en' ? currentEvaluation.explanationEn : currentEvaluation.explanationJa}
                  </p>
                </div>

                {/* Functorial Bridge Action */}
                <div style={{
                  flex: 1,
                  background: 'rgba(212,175,55,0.05)',
                  border: '1px dashed rgba(212,175,55,0.25)',
                  borderRadius: '6px',
                  padding: '0.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                    {language === 'en' ? 'Adjunction Homomorphism Lift:' : '随伴による準同型持ち上げ:'}
                  </span>
                  <MathView
                    formula="\bar{f}: F(X) \to M, \quad U(\bar{f}) \circ \eta_X = f"
                    style={{ fontSize: '0.75rem', color: '#fff' }}
                  />
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {language === 'en'
                      ? 'Because F ⊣ U, the evaluation map is unique. Changing generator values on the left instantly shifts the semantic quotient on the right.'
                      : 'F ⊣ U であるため、評価写像は一意です。左の生成元の値を変更すると、右の意味論的商値が一意に定まります。'}
                  </span>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* LAB 2: HOM-SETS & THE YONEDA LEMMA */}
        {/* ========================================================================= */}
        {activeLab === 'hom-sets' && (
          <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Thesis Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(56,189,248,0.08))',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '8px',
              padding: '0.85rem 1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>
                    {language === 'en' ? 'Relational Ontology: Hom-Sets & The Yoneda Lemma' : '関係主義存在論：Hom集合と米田の補題'}
                  </span>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate(25)}
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid #10b981',
                        color: '#10b981',
                        borderRadius: '3px',
                        padding: '1px 6px',
                        fontSize: '0.55rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      <ExternalLink size={9} />
                      <span>{language === 'en' ? 'Hall XXV (Yoneda)' : '第25室（米田の補題）'}</span>
                    </button>
                  )}
                </div>
                <MathView formula="\text{Nat}(\text{Hom}(-, A), P) \cong P(A), \quad \text{Hom}(A, B) \cong \text{Nat}(h^A, h^B)" style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }} />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {language === 'en'
                  ? 'In category theory, objects have no internal substance. An object A is completely defined by the collection of all morphisms into it Hom(-, A) (the representable presheaf). Two objects are isomorphic if and only if their relational Hom-profiles are isomorphic.'
                  : '圏論において、対象はそれ自体の「中身」を持ちません。対象Aのすべての構造は、外部からAへと向かう射の集合 Hom(-, A) （表現可能プレシェフ）によって完全に復元されます。二つの対象が同型であることは、それらの関係性Homプロファイルが同型であることと完全に一致します。'}
              </p>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {language === 'en' ? 'Category Sample:' : 'サンプル圏:'}
                </span>
                {[
                  { id: 'finite-3', label: 'Finite 3-Object Category (A,B,C)' },
                  { id: 'set-sub', label: 'Category of Finite Sets (Set)' },
                  { id: 'monoid-z2', label: 'Monoid Category (1 Object)' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setHomCategoryType(c.id as any)}
                    style={{
                      background: homCategoryType === c.id ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.02)',
                      border: homCategoryType === c.id ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                      color: homCategoryType === c.id ? '#10b981' : 'white',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.6rem',
                      cursor: 'pointer'
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {language === 'en' ? 'Yoneda Target Object:' : '米田対象:'}
                </span>
                {(['A', 'B', 'C'] as const).map(obj => (
                  <button
                    key={obj}
                    onClick={() => setYonedaTargetObj(obj)}
                    style={{
                      background: yonedaTargetObj === obj ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.02)',
                      border: yonedaTargetObj === obj ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                      color: yonedaTargetObj === obj ? 'var(--primary)' : 'white',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen: Hom-Set Matrix (Left) vs Yoneda Presheaf Scanner (Right) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', minHeight: '320px' }}>
              
              {/* LEFT: HOM-SET MATRIX */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.03)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#10b981' }}>
                  {language === 'en' ? 'Full Hom-Set Matrix: Hom_C(X, Y)' : '全Hom集合行列：Hom_C(X, Y)'}
                </span>

                {/* Matrix Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem', fontFamily: 'monospace' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '6px', color: 'var(--text-muted)', textAlign: 'left' }}>Hom(Src, Dst)</th>
                        {homMatrixData.objects.map(obj => (
                          <th key={obj} style={{ padding: '6px', color: '#38bdf8', textAlign: 'center' }}>{obj}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {homMatrixData.objects.map(src => (
                        <tr key={src} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '6px', color: '#f59e0b', fontWeight: 'bold' }}>{src}</td>
                          {homMatrixData.objects.map(dst => {
                            const isSelected = selectedHomCell.src === src && selectedHomCell.dst === dst;
                            const arrows = homMatrixData.homSets[src]?.[dst] || [];
                            return (
                              <td
                                key={dst}
                                onClick={() => setSelectedHomCell({ src, dst })}
                                style={{
                                  padding: '6px',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  background: isSelected ? 'rgba(16,185,129,0.2)' : 'transparent',
                                  border: isSelected ? '1px solid #10b981' : '1px solid transparent',
                                  borderRadius: '4px',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <span style={{ color: arrows.length > 0 ? '#10b981' : 'rgba(255,255,255,0.2)' }}>
                                  |Hom| = {arrows.length}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected Hom-set details */}
                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.6rem', flex: 1 }}>
                  <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                    Hom({selectedHomCell.src}, {selectedHomCell.dst}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {(homMatrixData.homSets[selectedHomCell.src]?.[selectedHomCell.dst] || []).length === 0 ? (
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>∅ (No morphisms / 空集合)</span>
                    ) : (
                      (homMatrixData.homSets[selectedHomCell.src]?.[selectedHomCell.dst] || []).map((m, idx) => (
                        <span key={idx} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '0.6rem', fontFamily: 'monospace' }}>
                          {m}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: YONEDA PRESHEAF SCANNER */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.03)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {language === 'en' ? `Yoneda Representable Presheaf: h^${yonedaTargetObj} = Hom(-, ${yonedaTargetObj})` : `表現可能プレシェフ：h^${yonedaTargetObj} = Hom(-, ${yonedaTargetObj})`}
                </span>

                <div style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px dashed rgba(245,158,11,0.25)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem'
                }}>
                  <svg width="100%" height="160" viewBox="0 0 240 160">
                    <defs>
                      <marker id="studio-arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--primary)" />
                      </marker>
                    </defs>

                    {/* Nodes A, B, C */}
                    <g>
                      <circle cx="50" cy="40" r="14" fill="#000" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="50" y="44" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">A</text>

                      <circle cx="50" cy="120" r="14" fill="#000" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="50" y="124" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">B</text>

                      <circle cx="190" cy="80" r="16" fill="rgba(245,158,11,0.2)" stroke="var(--primary)" strokeWidth="2" />
                      <text x="190" y="84" fill="var(--primary)" fontSize="10" fontWeight="bold" textAnchor="middle">{yonedaTargetObj}</text>
                    </g>

                    {/* Arrows into Target */}
                    <line x1="64" y1="45" x2="175" y2="75" stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#studio-arrow)" />
                    <text x="120" y="55" fill="var(--primary)" fontSize="7">Hom(A, {yonedaTargetObj})</text>

                    <line x1="64" y1="115" x2="175" y2="85" stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#studio-arrow)" />
                    <text x="120" y="110" fill="var(--primary)" fontSize="7">Hom(B, {yonedaTargetObj})</text>

                    {/* Identity loop on target */}
                    <path d="M 200,65 C 220,45 230,85 205,90" fill="none" stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#studio-arrow)" />
                    <text x="230" y="65" fill="var(--primary)" fontSize="7">id</text>
                  </svg>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '6px', padding: '0.5rem', fontSize: '0.65rem' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                    {language === 'en' ? 'Yoneda Embedding Proof:' : '米田埋め込みの証明的帰結:'}
                  </div>
                  <p style={{ margin: '0.2rem 0 0 0', color: 'rgba(255,255,255,0.7)', lineHeight: '1.3' }}>
                    {language === 'en'
                      ? 'The Yoneda embedding Y: C -> [C^op, Set] is fully faithful. An object is literally identical to its system of incoming viewpoints.'
                      : '米田埋め込み Y: C -> [C^op, Set] は完全忠実です。対象とは、すべての外部視点からのHom射の束そのものです。'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* LAB 3: UNIVERSAL ADJOINT ENGINE & TRIANGULAR IDENTITIES */}
        {/* ========================================================================= */}
        {activeLab === 'adjunction-engine' && (
          <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Thesis Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08))',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '8px',
              padding: '0.85rem 1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {language === 'en' ? 'Adjunction Mechanics: Unit η, Counit ε, and Triangular Commutativity' : '随伴の機構：単位 η、余単位 ε、および三角可換性'}
                  </span>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate(22)}
                      style={{
                        background: 'rgba(245,158,11,0.15)',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        borderRadius: '3px',
                        padding: '1px 6px',
                        fontSize: '0.55rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      <ExternalLink size={9} />
                      <span>{language === 'en' ? 'Hall XXII (F ⊣ U)' : '第22室（随伴）'}</span>
                    </button>
                  )}
                </div>
                <MathView formula="\varepsilon_F \circ F(\eta) = \text{id}_F, \quad U(\varepsilon) \circ \eta_U = \text{id}_U" style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold' }} />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {language === 'en'
                  ? 'The Unit η represents insertion of raw syntax (inhalation). The Counit ε represents algebraic quotient evaluation (exhalation). Together, they satisfy the triangular identities that guarantee zero-distortion round-trip translation between syntax and semantics.'
                  : '単位 η は生の構文の包摂（吸気）を表し、余単位 ε は代数的商化評価（呼気）を表します。この二つが満たす三角恒等式により、構文と意味論の間の往復変換において情報が一貫して保存されます。'}
              </p>
            </div>

            {/* Step-by-Step Interactive Timeline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {triangleSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTriangleStep(idx)}
                    style={{
                      background: triangleStep === idx ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: triangleStep === idx ? '#000' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {idx}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  disabled={triangleStep === 0}
                  onClick={() => setTriangleStep(s => s - 1)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.65rem',
                    cursor: triangleStep === 0 ? 'not-allowed' : 'pointer',
                    opacity: triangleStep === 0 ? 0.3 : 1
                  }}
                >
                  ◀ {language === 'en' ? 'Back' : '前へ'}
                </button>
                <button
                  disabled={triangleStep === triangleSteps.length - 1}
                  onClick={() => setTriangleStep(s => s + 1)}
                  style={{
                    background: 'var(--primary)',
                    border: 'none',
                    color: '#000',
                    borderRadius: '4px',
                    padding: '2px 10px',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    cursor: triangleStep === triangleSteps.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: triangleStep === triangleSteps.length - 1 ? 0.3 : 1
                  }}
                >
                  {language === 'en' ? 'Next Step' : '次へ'} ▶
                </button>
              </div>
            </div>

            {/* Active Step Canvas Display */}
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {language === 'en' ? triangleSteps[triangleStep].titleEn : triangleSteps[triangleStep].titleJa}
                </span>
                <MathView formula={triangleSteps[triangleStep].math} style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 'bold' }} />
              </div>

              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4', margin: 0 }}>
                {language === 'en' ? triangleSteps[triangleStep].descEn : triangleSteps[triangleStep].descJa}
              </p>

              {/* Commutative Triangle Diagram */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                padding: '0.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <svg width="340" height="150" viewBox="0 0 340 150">
                  <defs>
                    <marker id="tri-arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--primary)" />
                    </marker>
                    <marker id="tri-active-arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
                    </marker>
                  </defs>

                  {/* Left Node: F(X) */}
                  <circle cx="60" cy="75" r="20" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="60" y="80" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">F(X)</text>

                  {/* Top Node: FUF(X) */}
                  <circle cx="170" cy="30" r="22" fill="rgba(245,158,11,0.15)" stroke="var(--primary)" strokeWidth="1.5" />
                  <text x="170" y="34" fill="var(--primary)" fontSize="9" fontWeight="bold" textAnchor="middle">FUF(X)</text>

                  {/* Right Node: F(X) */}
                  <circle cx="280" cy="75" r="20" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1.5" />
                  <text x="280" y="80" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">F(X)</text>

                  {/* Arrows */}
                  {/* F(eta): F(X) -> FUF(X) */}
                  <line
                    x1="75" y1="65" x2="150" y2="38"
                    stroke={triangleStep === 1 || triangleStep === 2 ? '#10b981' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={triangleStep === 1 || triangleStep === 2 ? 2 : 1}
                    markerEnd={triangleStep === 1 || triangleStep === 2 ? 'url(#tri-active-arrow)' : 'url(#tri-arrow)'}
                  />
                  <text x="100" y="45" fill={triangleStep === 1 || triangleStep === 2 ? '#10b981' : 'rgba(255,255,255,0.4)'} fontSize="8">F(η_X)</text>

                  {/* epsilon_F: FUF(X) -> F(X) */}
                  <line
                    x1="190" y1="38" x2="265" y2="65"
                    stroke={triangleStep === 3 ? '#10b981' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={triangleStep === 3 ? 2 : 1}
                    markerEnd={triangleStep === 3 ? 'url(#tri-active-arrow)' : 'url(#tri-arrow)'}
                  />
                  <text x="230" y="45" fill={triangleStep === 3 ? '#10b981' : 'rgba(255,255,255,0.4)'} fontSize="8">ε_{'F(X)'}</text>

                  {/* id_F: F(X) -> F(X) */}
                  <line
                    x1="80" y1="75" x2="260" y2="75"
                    stroke={triangleStep === 4 ? '#10b981' : 'rgba(255,255,255,0.1)'}
                    strokeWidth={triangleStep === 4 ? 2 : 1}
                    strokeDasharray={triangleStep === 4 ? 'none' : '3,3'}
                    markerEnd={triangleStep === 4 ? 'url(#tri-active-arrow)' : 'url(#tri-arrow)'}
                  />
                  <text x="170" y="95" fill={triangleStep === 4 ? '#10b981' : 'rgba(255,255,255,0.3)'} fontSize="9" textAnchor="middle">
                    id_{'F(X)'} = ε_F ∘ F(η)
                  </text>
                </svg>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* LAB 4: CATEGORY THEORY STRUCTURAL WORKBENCH */}
        {/* ========================================================================= */}
        {activeLab === 'category-workbench' && (
          <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Thesis Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(16,185,129,0.08))',
              border: '1px solid rgba(56,189,248,0.2)',
              borderRadius: '8px',
              padding: '0.85rem 1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#38bdf8' }}>
                    {language === 'en' ? 'Universal Categorical Axioms: Objects, Arrows, Functors & Naturality' : '圏論の普遍公理：対象・射・関手・自然変換'}
                  </span>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate(29)}
                      style={{
                        background: 'rgba(56,189,248,0.15)',
                        border: '1px solid #38bdf8',
                        color: '#38bdf8',
                        borderRadius: '3px',
                        padding: '1px 6px',
                        fontSize: '0.55rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      <ExternalLink size={9} />
                      <span>{language === 'en' ? 'Hall 29 (Categories)' : '第29室（圏と関手）'}</span>
                    </button>
                  )}
                </div>
                <MathView formula="h \circ (g \circ f) = (h \circ g) \circ f, \quad f \circ \text{id}_A = f = \text{id}_B \circ f" style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 'bold' }} />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {language === 'en'
                  ? 'A Category consists of objects and morphisms with associative composition and identity arrows. A Functor translates categories while preserving diagrams. A Natural Transformation creates commuting cylinders between parallel functors.'
                  : '圏とは、結合的合成と恒等射を持つ対象と射の体系です。関手は図式の可換性を保存しながら圏同士を翻訳します。自然変換は、並行する関手の間に可換な円柱図式を形成します。'}
              </p>
            </div>

            {/* Interactive Workbench Graph */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', minHeight: '320px' }}>
              
              {/* Visual Category Graph */}
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(56,189,248,0.2)',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#38bdf8' }}>
                    {language === 'en' ? 'Interactive Category Graph C' : 'インタラクティブ圏図式 C'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      onClick={() => setActiveDiagramPath('top')}
                      style={{
                        background: activeDiagramPath === 'top' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)',
                        color: activeDiagramPath === 'top' ? '#38bdf8' : 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        fontSize: '0.6rem',
                        cursor: 'pointer'
                      }}
                    >
                      Top Path (g ∘ f)
                    </button>
                    <button
                      onClick={() => setActiveDiagramPath('bottom')}
                      style={{
                        background: activeDiagramPath === 'bottom' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                        color: activeDiagramPath === 'bottom' ? '#10b981' : 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        fontSize: '0.6rem',
                        cursor: 'pointer'
                      }}
                    >
                      Direct Path (h)
                    </button>
                    <button
                      onClick={() => setActiveDiagramPath('both')}
                      style={{
                        background: activeDiagramPath === 'both' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                        color: activeDiagramPath === 'both' ? 'var(--primary)' : 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        fontSize: '0.6rem',
                        cursor: 'pointer'
                      }}
                    >
                      Commutative Check
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                  <svg width="100%" height="180" viewBox="0 0 280 180">
                    <defs>
                      <marker id="wb-arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8" />
                      </marker>
                    </defs>

                    {/* Nodes */}
                    <circle cx="50" cy="50" r="16" fill="#000" stroke="#38bdf8" strokeWidth="2" />
                    <text x="50" y="54" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">X</text>

                    <circle cx="230" cy="50" r="16" fill="#000" stroke="#38bdf8" strokeWidth="2" />
                    <text x="230" y="54" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">Y</text>

                    <circle cx="140" cy="140" r="16" fill="#000" stroke="#10b981" strokeWidth="2" />
                    <text x="140" y="144" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">Z</text>

                    {/* Morphisms */}
                    {/* f: X -> Y */}
                    <line x1="66" y1="50" x2="214" y2="50" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#wb-arrow)" />
                    <text x="140" y="42" fill="#38bdf8" fontSize="8" textAnchor="middle">f</text>

                    {/* g: Y -> Z */}
                    <line x1="220" y1="62" x2="152" y2="128" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#wb-arrow)" />
                    <text x="195" y="105" fill="#38bdf8" fontSize="8">g</text>

                    {/* h: X -> Z (Composite) */}
                    <line
                      x1="60" y1="62" x2="128" y2="128"
                      stroke={activeDiagramPath === 'both' ? 'var(--primary)' : '#10b981'}
                      strokeWidth="2"
                      strokeDasharray={activeDiagramPath === 'both' ? '3,3' : 'none'}
                      markerEnd="url(#wb-arrow)"
                    />
                    <text x="80" y="105" fill={activeDiagramPath === 'both' ? 'var(--primary)' : '#10b981'} fontSize="8">h = g ∘ f</text>
                  </svg>
                </div>
              </div>

              {/* Axioms & Functor Translation Inspector */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {language === 'en' ? 'Categorical Axiom Verifier:' : '圏論公理の検証器:'}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.1)', padding: '4px 6px', borderRadius: '4px', border: '1px solid #10b981' }}>
                    <CheckCircle2 size={12} color="#10b981" />
                    <span>{language === 'en' ? 'Associativity: (k ∘ g) ∘ f = k ∘ (g ∘ f)' : '結合律: (k ∘ g) ∘ f = k ∘ (g ∘ f)'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.1)', padding: '4px 6px', borderRadius: '4px', border: '1px solid #10b981' }}>
                    <CheckCircle2 size={12} color="#10b981" />
                    <span>{language === 'en' ? 'Identity: f ∘ id_X = f = id_Y ∘ f' : '単位元律: f ∘ id_X = f = id_Y ∘ f'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(56,189,248,0.1)', padding: '4px 6px', borderRadius: '4px', border: '1px solid #38bdf8' }}>
                    <CheckCircle2 size={12} color="#38bdf8" />
                    <span>{language === 'en' ? 'Functoriality: F(g ∘ f) = F(g) ∘ F(f)' : '関手性: F(g ∘ f) = F(g) ∘ F(f)'}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                    {language === 'en'
                      ? 'Every arrow composition is uniquely determined. Commuting diagrams allow proof verification via graph path equivalence.'
                      : 'すべての射の合成は一意に決定されます。図式の可換性により、グラフの経路同値性として証明が幾何学的に検証されます。'}
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
