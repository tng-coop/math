import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Play, Pause, RotateCcw, ChevronRight, AlertCircle, Info, Sparkles, BookOpen, Sliders, Square, FastForward, Rewind
} from 'lucide-react';

// ============================================================================
// Types & AST Definitions
// ============================================================================

interface SpokenWord {
  text: string;
  start: number;
  end: number;
}

let activeUtteranceRef: SpeechSynthesisUtterance | null = null;
// Types & AST Definitions
// ============================================================================

interface ASTNode {
  id: string;
  type: 'operator' | 'literal';
  value: string; // e.g. "+", "*", "3", "5", etc.
  left: ASTNode | null;
  right: ASTNode | null;
  
  // Animation / Evaluation states
  collapsed: boolean;
  collapsedValue?: string; // value after reduction
  evaluating?: boolean; // highlight status
  
  // Layout coordinates (computed recursively)
  x?: number;
  y?: number;
}

interface FlatNode {
  id: string;
  type: 'operator' | 'literal';
  label: string;
  x: number;
  y: number;
  opacity: number;
  evaluating: boolean;
  isCollapsed: boolean;
}

interface FlatLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

interface CollapseCandidate {
  node: ASTNode;
  depth: number;
  parent: ASTNode | null;
  childKey: 'left' | 'right' | null;
}

// ============================================================================
// Pratt-style/Recursive Descent Parser for Arithmetic Expressions
// ============================================================================

interface Token {
  type: 'NUMBER' | 'PLUS' | 'MINUS' | 'MULTIPLY' | 'DIVIDE' | 'LPAREN' | 'RPAREN' | 'EOF';
  value: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const char = input[i];
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    if (/[0-9]/.test(char)) {
      let numStr = '';
      while (i < input.length && /[0-9]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }
    if (char === '+') {
      tokens.push({ type: 'PLUS', value: '+' });
      i++;
      continue;
    }
    if (char === '-') {
      tokens.push({ type: 'MINUS', value: '-' });
      i++;
      continue;
    }
    if (char === '*') {
      tokens.push({ type: 'MULTIPLY', value: '*' });
      i++;
      continue;
    }
    if (char === '/') {
      tokens.push({ type: 'DIVIDE', value: '/' });
      i++;
      continue;
    }
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }
    throw new Error(`Unexpected character: ${char}`);
  }
  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}

class Parser {
  private tokens: Token[];
  private current = 0;
  private nodeIdCounter = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private nextId(): string {
    return `node_${this.nodeIdCounter++}`;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private match(type: Token['type']): boolean {
    if (this.peek().type === type) {
      this.current++;
      return true;
    }
    return false;
  }

  private consume(type: Token['type'], message: string): Token {
    if (this.peek().type === type) {
      return this.tokens[this.current++];
    }
    throw new Error(message);
  }

  public parse(): ASTNode {
    const expr = this.expression();
    if (this.peek().type !== 'EOF') {
      throw new Error(`Unexpected token at end of expression: "${this.peek().value}"`);
    }
    return expr;
  }

  private expression(): ASTNode {
    let node = this.term();
    while (this.peek().type === 'PLUS' || this.peek().type === 'MINUS') {
      const opToken = this.tokens[this.current++];
      const right = this.term();
      node = {
        id: this.nextId(),
        type: 'operator',
        value: opToken.value,
        left: node,
        right: right,
        collapsed: false,
      };
    }
    return node;
  }

  private term(): ASTNode {
    let node = this.factor();
    while (this.peek().type === 'MULTIPLY' || this.peek().type === 'DIVIDE') {
      const opToken = this.tokens[this.current++];
      const right = this.factor();
      node = {
        id: this.nextId(),
        type: 'operator',
        value: opToken.value,
        left: node,
        right: right,
        collapsed: false,
      };
    }
    return node;
  }

  private factor(): ASTNode {
    const token = this.peek();
    if (this.match('NUMBER')) {
      return {
        id: this.nextId(),
        type: 'literal',
        value: token.value,
        left: null,
        right: null,
        collapsed: true, // literals start fully resolved
      };
    }
    if (this.match('LPAREN')) {
      const node = this.expression();
      this.consume('RPAREN', "Expect ')' after expression.");
      return node;
    }
    throw new Error(`Expect number or '(' but found "${token.value || 'EOF'}"`);
  }
}

// Helper to parse input into AST and set coordinates
function parseExpression(input: string, width: number, height: number): ASTNode {
  const tokens = tokenize(input);
  const parser = new Parser(tokens);
  const root = parser.parse();
  layoutTree(root, width, height);
  return root;
}

// ============================================================================
// Tree Layout & Serialization Utilities
// ============================================================================

function getTreeDepth(node: ASTNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

function layoutTree(node: ASTNode | null, width: number, height: number) {
  if (!node) return;
  const depth = getTreeDepth(node);
  // Vertical spacing scaled dynamically by depth
  const ySpacing = depth > 1 ? (height - 110) / (depth - 1) : 0;
  
  function setPositions(curr: ASTNode, d: number, left: number, right: number) {
    const x = (left + right) / 2;
    const y = 60 + d * ySpacing;
    curr.x = x;
    curr.y = y;
    
    if (curr.left) {
      setPositions(curr.left, d + 1, left, x);
    }
    if (curr.right) {
      setPositions(curr.right, d + 1, x, right);
    }
  }
  
  setPositions(node, 0, 40, width - 40);
}

function cloneTree(node: ASTNode): ASTNode {
  return {
    id: node.id,
    type: node.type,
    value: node.value,
    collapsed: node.collapsed,
    collapsedValue: node.collapsedValue,
    evaluating: node.evaluating,
    x: node.x,
    y: node.y,
    left: node.left ? cloneTree(node.left) : null,
    right: node.right ? cloneTree(node.right) : null,
  };
}

function findNodeById(node: ASTNode | null, id: string): ASTNode | null {
  if (!node) return null;
  if (node.id === id) return node;
  const leftRes = findNodeById(node.left, id);
  if (leftRes) return leftRes;
  return findNodeById(node.right, id);
}

function serializeTree(node: ASTNode): string {
  if (node.collapsed && node.collapsedValue !== undefined) {
    return node.collapsedValue;
  }
  if (node.type === 'literal') {
    return node.value;
  }
  const leftStr = node.left ? serializeTree(node.left) : '';
  const rightStr = node.right ? serializeTree(node.right) : '';
  return `(${leftStr} ${node.value} ${rightStr})`;
}

// Recurse and extract coordinates, resolving collapsible states
function flattenTree(
  node: ASTNode,
  parentParams: { x: number; y: number; opacity: number; isCollapsed: boolean } | null,
  nodesList: FlatNode[],
  linesList: FlatLine[]
) {
  let visualX = node.x ?? 0;
  let visualY = node.y ?? 0;
  let visualOpacity = 1;

  if (parentParams) {
    if (parentParams.opacity === 0 || parentParams.isCollapsed) {
      visualX = parentParams.x;
      visualY = parentParams.y;
      visualOpacity = 0;
    }
  }

  const label = node.collapsed && node.collapsedValue !== undefined 
    ? node.collapsedValue 
    : node.value;

  nodesList.push({
    id: node.id,
    type: node.type,
    label,
    x: visualX,
    y: visualY,
    opacity: visualOpacity,
    evaluating: !!node.evaluating,
    isCollapsed: !!node.collapsed
  });

  const currentParams = {
    x: visualX,
    y: visualY,
    opacity: visualOpacity,
    isCollapsed: !!node.collapsed
  };

  if (node.left) {
    flattenTree(node.left, currentParams, nodesList, linesList);
    
    let childX = node.left.x ?? 0;
    let childY = node.left.y ?? 0;
    let lineOpacity = visualOpacity;

    if (node.collapsed || visualOpacity === 0) {
      childX = visualX;
      childY = visualY;
      lineOpacity = 0;
    }

    linesList.push({
      id: `line_${node.id}_${node.left.id}`,
      x1: visualX,
      y1: visualY,
      x2: childX,
      y2: childY,
      opacity: lineOpacity
    });
  }

  if (node.right) {
    flattenTree(node.right, currentParams, nodesList, linesList);
    
    let childX = node.right.x ?? 0;
    let childY = node.right.y ?? 0;
    let lineOpacity = visualOpacity;

    if (node.collapsed || visualOpacity === 0) {
      childX = visualX;
      childY = visualY;
      lineOpacity = 0;
    }

    linesList.push({
      id: `line_${node.id}_${node.right.id}`,
      x1: visualX,
      y1: visualY,
      x2: childX,
      y2: childY,
      opacity: lineOpacity
    });
  }
}

// Find all operator nodes that are ready to evaluate
function findCollapseCandidates(
  node: ASTNode,
  depth: number,
  parent: ASTNode | null,
  childKey: 'left' | 'right' | null,
  candidates: CollapseCandidate[]
) {
  if (node.collapsed) return;

  const leftResolved = !node.left || node.left.collapsed;
  const rightResolved = !node.right || node.right.collapsed;

  if (leftResolved && rightResolved) {
    candidates.push({ node, depth, parent, childKey });
  } else {
    if (node.left) {
      findCollapseCandidates(node.left, depth + 1, node, 'left', candidates);
    }
    if (node.right) {
      findCollapseCandidates(node.right, depth + 1, node, 'right', candidates);
    }
  }
}

// ============================================================================
// Translations
// ============================================================================

const translations = {
  en: {
    title: 'AST Evaluation & Reduction',
    subtitle: 'Free AST nodes collapsing under evaluation to a semantic value',
    selectExpression: 'Select Preset Expression',
    customExpression: 'Custom Infix Expression',
    enterExpression: 'Enter arithmetic expression, e.g. (3 + 5) * (10 - 4)',
    parseError: 'Invalid syntax. Use integers, parentheses, and +, -, *, /.',
    step: 'Step Collapse',
    autoPlay: 'Autoplay',
    pause: 'Pause',
    reset: 'Reset',
    speed: 'Evaluation Speed',
    reductionLogs: 'Syntactic Reductions',
    equivalenceExplanation: 'Quotient Space of Syntax',
    sidebarDesc: 'Watch how sub-trees (syntactic terms) collapse into semantic values. Each step replaces an equivalent expression, quotienting the syntax space until we reach the final semantic value.',
    noLogs: 'No reductions yet. Click "Step Collapse" or "Autoplay" to begin.',
    originalExpression: 'Original Expression',
    finalValue: 'Final Value',
    nodeOperator: 'Operator Node (Gold)',
    nodeLiteral: 'Literal Node (Cyan)',
    syntacticEquivalence: 'Algebraic Congruence',
    apply: 'Apply Custom',
    infoTitle: 'Homomorphism & Syntax Reductions',
    infoParagraph1: 'An Abstract Syntax Tree (AST) represents algebraic terms formed freely over a set of operations. Evaluation is a homomorphism from the syntactic algebra to the semantic algebra of numbers.',
    infoParagraph2: 'During reduction, subexpressions collapse. By substituting a term with its semantic equivalent, we quotient the syntactic space step-by-step. The entire tree collapses until only a single value remains.',
    reductionStep: (op: string, left: string, right: string, res: string, currentExpr: string) => 
      `Evaluated [${left} ${op} ${right}] to [${res}]. Congruent term: ${currentExpr}`,
    reductionStepTitle: (stepNum: number) => `Step ${stepNum}: Local Reduction`,
    completed: 'Fully collapsed to semantic value!'
  },
  ja: {
    title: 'AST評価と簡約ビジュアライザ',
    subtitle: '自由な抽象構文木（AST）ノードが評価によって意味値へと崩壊するプロセス',
    selectExpression: 'プリセット式の選択',
    customExpression: 'カスタム中置式の入力',
    enterExpression: '算術式を入力してください（例：(3 + 5) * (10 - 4)）',
    parseError: '無効な構文です。整数、カッコ、および +, -, *, / のみ使用可能です。',
    step: 'ステップ崩壊',
    autoPlay: '自動再生',
    pause: '一時停止',
    reset: 'リセット',
    speed: '評価の速度',
    reductionLogs: '構文上の簡約履歴',
    equivalenceExplanation: '構文空間の商空間化',
    sidebarDesc: '部分木（構文の項）が意味値へと崩壊する様子を観察します。各ステップで同値な式が置き換えられ、最終的な意味値に達するまで構文空間が商（同値関係による類別）されます。',
    noLogs: '簡約はまだ行われていません。「ステップ崩壊」または「自動再生」を開始してください。',
    originalExpression: '元の式',
    finalValue: '最終値',
    nodeOperator: '演算子ノード（金）',
    nodeLiteral: 'リテラルノード（シアン）',
    syntacticEquivalence: '代数的合同関係',
    apply: 'カスタム適用',
    infoTitle: '準同型写像と構文簡約',
    infoParagraph1: '抽象構文木（AST）は、演算子の集合の上に自由生成された代数的な「項」を表します。評価は、構文的な代数から数値という「意味的代数」への準同型写像（ホモモルフィズム）です。',
    infoParagraph2: '簡約中、部分式が崩壊します。項をその意味的同値物で置き換えることで、構文空間を段階的に商空間（Quotient Space）化します。木全体が崩壊し、最終的に単一の値のみが残ります。',
    reductionStep: (op: string, left: string, right: string, res: string, currentExpr: string) => 
      `部分木 [${left} ${op} ${right}] を [${res}] に評価しました。合同な項: ${currentExpr}`,
    reductionStepTitle: (stepNum: number) => `ステップ ${stepNum}: 局所簡約`,
    completed: '意味値へ完全に崩壊しました！'
  }
};

// ============================================================================
// Exhibit Component
// ============================================================================

export default function Hall5Visualizer({ language, onlyVisualizer = false }: { language: 'en' | 'ja', onlyVisualizer?: boolean }) {
  const t = translations[language];

  const tabContent = useMemo(() => {
    return {
      en: {
        narrative: "Mathematics is ONLY the dual cycle of Free Generation (Syntax) vs. Quotienting (Semantics). Computation is the perfect instantiation of this core philosophy: we begin with free generation by combining integers and operators into Abstract Syntax Trees (ASTs), which represent syntactically valid terms without a computed value. Semantics are introduced by running evaluation reduction rules as equivalence equations (e.g., $3 + 4 \\equiv 7$). Each evaluation step collapses a subtree down to a single evaluated value, quotienting the syntax tree until we reach the final semantic value.",
        rigor: "Mathematically, the process of free generation and quotienting is formally known as defining structures via 'Generators and Relations' (or 'Presentations'). This reveals the 'Core Logic' connection: human logical reason (Intuitionistic Logic) is itself a presentation, where we freely generate the syntax of propositional formulas (generators) and quotient them by provable equivalence (relations), collapsing the infinite syntactic tree of formulas into a Heyting Algebra (or a Boolean Algebra for Classical Logic). For arithmetic, the syntax of terms $T$ is freely generated over numbers and operators, and quotiented by the congruence relation $t_1 \\equiv t_2$ defined by semantic evaluation, collapsing the tree to a single quotient representative.",
        history: "The historical quest of Hilbert, Frege, and Russell to reduce mathematics to pure syntax failed because mathematics is only the dual cycle of free syntactic generation followed by quotient semantic collapse. Gödel's incompleteness and Turing's computability showed that syntax remains inert without the quotienting reduction rules that collapse computations to semantic values. This history proves that logic and computation are semantic quotients of freely generated syntactic structures.",
        exercises: "1. Parse the arithmetic term $(3 + 5) * (10 - 4)$ into its freely generated AST syntax. Find the equivalence class of terms quotiented to the same semantic value $48$.\n2. Explain how logical deduction acts as a quotient collapse on freely generated propositional formulas, collapsing syntax into Heyting algebraic semantics, verifying the Core Logic presentation."
      },
      ja: {
        narrative: "数学は、自由生成（構文）と商化（意味論）の双対サイクル「のみ」で構成されています。計算はこの核心的哲学の完全な具現化です。まず、整数と演算子を抽象構文木（AST）に組み合わせることで自由生成を行います。これは計算された値を持たない、構文的に妥当な項を表します。意味論は、評価の簡約ルールを同値等式（例：$3 + 4 \\equiv 7$）として実行することによって導入されます。各評価ステップは部分木を単一の評価値に崩壊させ、最終的な意味値に達するまで構文木を商化します。",
        rigor: "数学において、自由生成と商化を介して計算を定義することは、「生成元と関係式」（あるいは「プレゼンテーション」）による構造の定義として正式に知られています。これは「核心的論理（Core Logic）」の接続を明らかにします。人間の論理的推論（直観主義論理）自体がプレゼンテーションであり、命題論理式の構文を自由に生成し（生成元）、それらを証明可能な同値性（関係式）で商化することで、論理式の無限の構文木をハイティング代数（古典論理の場合はブール代数）に崩壊させます。算術の場合、項の構文 $T$ は数値と演算子から自由生成され、意味的評価によって合同関係 $t_1 \\equiv t_2$ に商化され、単一の商代表元に崩壊します。",
        history: "数学を純粋な構文へと還元しようとしたヒルベルト、フレーゲ、ラッセルの歴史的探求が失敗したのは、数学が「構文の自由生成とその後の意味的商崩壊」の双対サイクルのみで成り立っているからです。ゲーデルの不完全性とチューリングの計算可能性は、計算を意味値へと崩壊させる商化の簡約ルールなしには、構文は不活性なままであることを示しました。この歴史は、論理と計算が自由生成された構文構造の意味的商であることを証明しています。",
        exercises: "1. 算術項 $(3 + 5) * (10 - 4)$ を自由生成されたAST構文に解析してください。同じ意味値 $48$ に商化される項の同値類を求めてください。 2. 論理的演繹が、自由生成された命題論理式に対する商崩壊として機能し、構文をハイティング代数的意味論へと崩壊させ、核心的論理プレゼンテーションを検証することを説明してください。"
      }
    }[language];
  }, [language]);

  // TTS States
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'narrative' | 'rigor' | 'history' | 'exercises'>('narrative');

  // Load voices dynamically based on active language selection
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const langPrefix = language === 'ja' ? 'ja' : 'en';
      const filteredVoices = allVoices.filter(v => v.lang.startsWith(langPrefix));
      setVoices(filteredVoices);

      const scoredVoices = filteredVoices.map(v => {
        let score = 0;
        const nameLower = v.name.toLowerCase();
        const langLower = v.lang.toLowerCase();

        if (language === 'en') {
          if (langLower.includes('en-us') || langLower.includes('en_us')) score += 100;
          if (nameLower.includes('natural') || nameLower.includes('neural') || nameLower.includes('online')) score += 50;
          if (nameLower.includes('google') || nameLower.includes('microsoft') || nameLower.includes('apple')) score += 30;
        } else {
          if (nameLower.includes('google') || nameLower.includes('natural') || nameLower.includes('neural') || nameLower.includes('online')) score += 50;
          if (nameLower.includes('sayaka') || nameLower.includes('haruka')) score += 20;
        }
        return { voice: v, score };
      });

      scoredVoices.sort((a, b) => b.score - a.score);
      const bestVoice = scoredVoices[0]?.voice || filteredVoices[0];

      if (bestVoice) {
        setSelectedVoiceName(bestVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [language]);

  // Stop speech when active tab or language changes
  useEffect(() => {
    stopSpeechComplete();
  }, [activeTab, language]);

  // Hot-reload speed multiplier mid-speech
  useEffect(() => {
    if (activeSpeechText) {
      const activeIdx = currentCharIndex >= 0 ? currentCharIndex : 0;
      startSpeech(activeSpeechText, activeIdx);
    }
  }, [speedMultiplier]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeechComplete = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (activeUtteranceRef) {
      activeUtteranceRef = null;
    }
    setActiveSpeechText(null);
    setCurrentCharIndex(-1);
    setIsPaused(false);
  };

  const startSpeech = (text: string, startIndex: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const sliceText = text.substring(startIndex);
      if (!sliceText.trim()) {
        stopSpeechComplete();
        return;
      }

      const cleanText = ", " + sliceText.replace(/[\$\{\}\[\]\(\)⊣→≅↦]/g, ' '); 
      const utterance = new SpeechSynthesisUtterance(cleanText);
      activeUtteranceRef = utterance; // Prevent garbage collection
      
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) {
        utterance.voice = voice;
      }

      const baseRate = language === 'ja' ? 0.95 : 0.92;
      utterance.rate = baseRate * speedMultiplier;
      utterance.pitch = 1.0;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const adjustedCharIdx = event.charIndex - 2;
          if (adjustedCharIdx >= 0) {
            const currentIdx = startIndex + adjustedCharIdx;
            setCurrentCharIndex(currentIdx);
            
            // Extract the word that is currently being spoken
            const spokenWord = getWordAtCharIndex(text, currentIdx);
            if (spokenWord) {
              handleSpeechTrigger(spokenWord);
            }
          }
        }
      };

      utterance.onend = () => {
        setTimeout(() => {
          if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
            stopSpeechComplete();
          }
        }, 60);
      };

      utterance.onerror = () => {
        stopSpeechComplete();
      };

      window.speechSynthesis.speak(utterance);
      setActiveSpeechText(text);
      setIsPaused(false);
      setCurrentCharIndex(startIndex);
    }, 100);
  };

  const speakCurrentStop = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (activeSpeechText === text) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      startSpeech(text, 0);
    }
  };

  const handleSeek = (direction: 'fwd' | 'rwd') => {
    if (!activeSpeechText) return;
    const words = getSpokenWords(activeSpeechText, language);
    if (words.length === 0) return;

    let currentWordIdx = words.findIndex(
      w => currentCharIndex >= w.start && currentCharIndex <= w.end
    );
    if (currentWordIdx === -1) {
      currentWordIdx = words.findIndex(w => w.start > currentCharIndex);
      if (currentWordIdx === -1) currentWordIdx = words.length - 1;
    }

    const wordSkip = 4;
    let targetWordIdx = direction === 'fwd' 
      ? Math.min(words.length - 1, currentWordIdx + wordSkip) 
      : Math.max(0, currentWordIdx - wordSkip);

    const targetWord = words[targetWordIdx];
    startSpeech(activeSpeechText, targetWord.start);
  };

  const getSpokenWords = (text: string, lang: 'en' | 'ja'): SpokenWord[] => {
    const words: SpokenWord[] = [];
    if (lang === 'ja') {
      for (let i = 0; i < text.length; i++) {
        words.push({ text: text[i], start: i, end: i + 1 });
      }
    } else {
      const wordRegex = /[a-zA-Z0-9'’⊣→≅↦ηε\(\)\{\}\-\:\,]+/g;
      let match;
      while ((match = wordRegex.exec(text)) !== null) {
        words.push({
          text: match[0],
          start: match.index,
          end: match.index + match[0].length
        });
      }
    }
    return words;
  };

  const getWordAtCharIndex = (text: string, charIdx: number): string | null => {
    const words = getSpokenWords(text, language);
    const match = words.find(w => charIdx >= w.start && charIdx < w.end);
    return match ? match.text : null;
  };

  const handleSpeechTrigger = (word: string) => {
    const w = word.toLowerCase();
    if (w.includes('ast') || w.includes('tree') || w.includes('syntax') || w.includes('generate') || w.includes('木') || w.includes('構文') || w.includes('生成')) {
      try {
        setErrorMsg(null);
        const parsed = parseExpression(originalExpr, svgWidth, svgHeight);
        setTree(parsed);
        setLogs([]);
        setAutoplay(false);
        setIsEvaluating(false);
      } catch (err: any) {}
    } else if (w.includes('evaluate') || w.includes('evaluation') || w.includes('collapse') || w.includes('reduction') || w.includes('equivalence') || w.includes('semantics') || w.includes('評価') || w.includes('崩壊') || w.includes('簡約') || w.includes('同値') || w.includes('意味')) {
      setAutoplay(true);
    }
  };

  const renderHighlightedText = (text: string) => {
    const words = getSpokenWords(text, language);
    let result: React.ReactNode[] = [];
    let lastIdx = 0;
    
    words.forEach((w, idx) => {
      if (w.start > lastIdx) {
        result.push(text.substring(lastIdx, w.start));
      }
      
      const isCurrent = currentCharIndex >= w.start && currentCharIndex < w.end;
      result.push(
        <span 
          key={idx} 
          className={isCurrent ? "word-highlight" : "word-normal"}
          onClick={() => startSpeech(text, w.start)}
          title={language === 'en' ? 'Click to play from here' : 'ここから再生'}
        >
          {w.text}
        </span>
      );
      lastIdx = w.end;
    });
    
    if (lastIdx < text.length) {
      result.push(text.substring(lastIdx));
    }
    
    return result;
  };

  // Preset Expressions
  const presets = [
    '(3 + 5) * (10 - 4)',
    '(2 * (5 + 3)) / (12 - 4)',
    '7 + 2 * 3'
  ];

  // Component States
  const [selectedPreset, setSelectedPreset] = useState<string>(presets[0]);
  const [customInput, setCustomInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tree, setTree] = useState<ASTNode | null>(null);
  const [originalExpr, setOriginalExpr] = useState<string>(presets[0]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.2); // Anim speed multiplier
  const [logs, setLogs] = useState<{ id: string; step: number; text: string; detail: string }[]>([]);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const svgWidth = 600;
  const svgHeight = 350;

  // Initialize/Reset tree when selected preset or originalExpr changes
  useEffect(() => {
    try {
      setErrorMsg(null);
      const parsed = parseExpression(originalExpr, svgWidth, svgHeight);
      setTree(parsed);
      setLogs([]);
      setAutoplay(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error parsing expression');
    }
  }, [originalExpr]);

  // Execute a single collapse step
  const triggerStep = useCallback(() => {
    if (!tree || isEvaluating) return;

    // 1. Find all eligible collapse nodes
    const candidates: CollapseCandidate[] = [];
    findCollapseCandidates(tree, 0, null, null, candidates);

    if (candidates.length === 0) {
      setAutoplay(false);
      return;
    }

    // 2. Select the deepest candidate (innermost subexpression)
    candidates.sort((a, b) => b.depth - a.depth);
    const candidate = candidates[0];

    // 3. Begin "highlighting" stage
    setIsEvaluating(true);
    const updatedTree = cloneTree(tree);
    const nodeInClone = findNodeById(updatedTree, candidate.node.id);
    if (nodeInClone) {
      nodeInClone.evaluating = true;
    }
    setTree(updatedTree);

    // Dynamic delay based on speed factor
    const delay = Math.max(300, 700 / speed);

    setTimeout(() => {
      // 4. Perform the algebraic reduction
      const finalTree = cloneTree(updatedTree);
      const targetNode = findNodeById(finalTree, candidate.node.id);

      if (targetNode && targetNode.left && targetNode.right) {
        targetNode.evaluating = false;
        targetNode.collapsed = true;

        const leftValStr = targetNode.left.collapsedValue !== undefined 
          ? targetNode.left.collapsedValue 
          : targetNode.left.value;
        const rightValStr = targetNode.right.collapsedValue !== undefined 
          ? targetNode.right.collapsedValue 
          : targetNode.right.value;

        const v1 = parseFloat(leftValStr);
        const v2 = parseFloat(rightValStr);

        let result = 0;
        switch (targetNode.value) {
          case '+': result = v1 + v2; break;
          case '-': result = v1 - v2; break;
          case '*': result = v1 * v2; break;
          case '/': 
            result = v2 !== 0 ? v1 / v2 : 0; 
            // format floating point decimals
            result = Math.round(result * 100) / 100;
            break;
        }

        targetNode.collapsedValue = String(result);

        // Record equivalence reduction log
        const currentEquivalent = serializeTree(finalTree);
        const logText = t.reductionStep(
          targetNode.value,
          leftValStr,
          rightValStr,
          String(result),
          currentEquivalent
        );

        const detailText = language === 'en'
          ? `Evaluating [${leftValStr} ${targetNode.value} ${rightValStr}] to equivalent literal [${result}] quotienting the tree.`
          : `部分木 [${leftValStr} ${targetNode.value} ${rightValStr}] を意味値 [${result}] に写像し、構文木を商空間化。`;

        setLogs(prev => [
          ...prev,
          {
            id: `log_${Date.now()}_${Math.random()}`,
            step: prev.length + 1,
            text: logText,
            detail: detailText
          }
        ]);
      }

      setTree(finalTree);
      setIsEvaluating(false);
    }, delay);
  }, [tree, isEvaluating, speed, language, t]);

  // Autoplay Logic Effect
  useEffect(() => {
    if (!autoplay || isEvaluating || !tree) return;

    // Check if there are collapse candidates left
    const candidates: CollapseCandidate[] = [];
    findCollapseCandidates(tree, 0, null, null, candidates);

    if (candidates.length === 0) {
      setAutoplay(false);
      return;
    }

    const timer = setTimeout(() => {
      triggerStep();
    }, Math.max(250, 1000 / speed));

    return () => clearTimeout(timer);
  }, [autoplay, isEvaluating, tree, speed, triggerStep]);

  // Auto-scroll logs container to the bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Flatten the current tree state for SVG drawing
  const flatNodes: FlatNode[] = [];
  const flatLines: FlatLine[] = [];
  if (tree) {
    flattenTree(tree, null, flatNodes, flatLines);
  }

  // Handle Preset Select
  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setOriginalExpr(preset);
    setCustomInput('');
    setErrorMsg(null);
  };

  // Handle Custom Input Apply
  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    try {
      setErrorMsg(null);
      // Validate parsing before setting
      const tokens = tokenize(customInput);
      const parser = new Parser(tokens);
      parser.parse(); // throws if invalid
      setOriginalExpr(customInput);
    } catch {
      setErrorMsg(t.parseError);
    }
  };

  const hasMoreSteps = tree ? (() => {
    const candidates: CollapseCandidate[] = [];
    findCollapseCandidates(tree, 0, null, null, candidates);
    return candidates.length > 0;
  })() : false;

  return (
    <div className="visualizer-container">
      {/* CSS Keyframes for the dynamic pulsing visual ring */}
      <style>{`
        @keyframes evaluating-ring-pulse {
          0% {
            r: 20px;
            opacity: 1;
            stroke-width: 1px;
          }
          100% {
            r: 38px;
            opacity: 0;
            stroke-width: 4px;
          }
        }
        .evaluating-ring {
          animation: evaluating-ring-pulse 0.9s infinite linear;
        }
        .ast-node-circle, .ast-node-text, .ast-line {
          transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .log-item-animation {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="exhibit-grid">
        
        {/* Left Panel: Placard, presets and controls */}
        <div className="placard-panel">
          <div>
            {!onlyVisualizer && (
              <>
                <div className="placard-header">
                  <BookOpen size={12} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.15em' }}>
                    EXHIBIT #05: ALGORITHMS
                  </span>
                </div>
                <h1 className="placard-title">{t.title}</h1>
                <p className="placard-subtitle">{t.subtitle}</p>

                {/* Tab Selector */}
                <div className="placard-tabs" style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                  {(['narrative', 'rigor', 'history', 'exercises'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`btn-lang ${activeTab === tab ? 'active' : ''}`}
                      style={{ fontSize: '0.68rem', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      {tab === 'narrative' ? (language === 'en' ? 'Narrative' : '叙事') :
                       tab === 'rigor' ? (language === 'en' ? 'Mathematical Rigor' : '数学的厳密性') :
                       tab === 'history' ? (language === 'en' ? 'Historical Context' : '歴史的背景') :
                       (language === 'en' ? 'Exercises' : '演習')}
                    </button>
                  ))}
                </div>

                {/* Audio Guide Device Widget */}
                <div className="audio-guide-player" style={{ marginBottom: '1.25rem', padding: '0.6rem 1rem', gap: '1rem', borderRadius: '0.75rem' }}>
                  <div className="device-info">
                    <div className="device-screen" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', fontSize: '0.55rem' }}>
                      {activeSpeechText ? 'ON' : 'OFF'}
                    </div>
                    <div className="device-meta">
                      <h4 style={{ fontSize: '0.55rem' }}>{language === 'en' ? 'Audio Companion' : '音声ガイド'}</h4>
                      <p style={{ fontSize: '0.5rem' }}>{activeTab.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="audio-controls-group" style={{ gap: '0.5rem', padding: '0.2rem 0.75rem' }}>
                    {voices.length > 0 && (
                      <select
                        value={selectedVoiceName}
                        onChange={(e) => setSelectedVoiceName(e.target.value)}
                        className="input-text"
                        style={{ 
                          width: '80px', 
                          fontSize: '0.55rem', 
                          padding: '1px 2px', 
                          height: '20px', 
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(212,175,55,0.3)',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          borderRadius: '4px'
                        }}
                      >
                        {voices.map((v, i) => (
                          <option key={i} value={v.name} style={{ background: '#0b0f19', color: '#fff' }}>
                            {v.name.replace('Microsoft', 'MS').replace('Google', 'G').replace('日本語', 'JP')}
                          </option>
                        ))}
                      </select>
                    )}

                    <select
                      value={speedMultiplier.toString()}
                      onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                      className="input-text"
                      style={{ 
                        width: '48px', 
                        fontSize: '0.55rem', 
                        padding: '1px 2px', 
                        height: '20px', 
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(212,175,55,0.3)',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      <option value="1">1.0x</option>
                      <option value="1.25">1.2x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2.0x</option>
                    </select>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <button
                        onClick={() => handleSeek('rwd')}
                        disabled={!activeSpeechText}
                        className="btn btn-outline"
                        style={{ width: '20px', height: '20px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Rewind size={8} />
                      </button>

                      <button
                        onClick={() => speakCurrentStop(tabContent[activeTab])}
                        className="btn btn-primary"
                        style={{ width: '22px', height: '22px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
                      >
                        {activeSpeechText && !isPaused ? <Pause size={8} /> : <Play size={8} />}
                      </button>

                      <button
                        onClick={() => handleSeek('fwd')}
                        disabled={!activeSpeechText}
                        className="btn btn-outline"
                        style={{ width: '20px', height: '20px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <FastForward size={8} />
                      </button>

                      <button
                        onClick={stopSpeechComplete}
                        disabled={!activeSpeechText}
                        className="btn btn-outline"
                        style={{ width: '20px', height: '20px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: activeSpeechText ? 'var(--error)' : 'rgba(255,255,255,0.1)' }}
                      >
                        <Square size={8} style={{ fill: activeSpeechText ? 'var(--error)' : 'none', color: activeSpeechText ? 'var(--error)' : 'currentColor' }} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="placard-text" style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '140px', whiteSpace: 'pre-line' }}>
                  <p>{renderHighlightedText(tabContent[activeTab])}</p>
                </div>
              </>
            )}

            {/* Expression Select Panel */}
            <div style={{ margin: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.selectExpression}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePresetSelect(preset)}
                    className={`btn-lang ${selectedPreset === preset && !customInput ? 'active' : ''}`}
                    style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.4rem 0.8rem',
                      fontFamily: 'monospace',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      borderRadius: '6px'
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <form onSubmit={handleApplyCustom} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.customExpression}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={t.enterExpression}
                  style={{
                    flex: 1,
                    background: 'rgba(5, 8, 15, 0.8)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem' }}
                >
                  {t.apply}
                </button>
              </div>
              {errorMsg && (
                <div style={{ color: 'var(--error)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                  <AlertCircle size={12} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          </div>

          {/* Interactive Player Controls */}
          <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.12)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <button
                onClick={triggerStep}
                disabled={isEvaluating || !hasMoreSteps}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px' }}
              >
                <ChevronRight size={16} />
                {t.step}
              </button>

              <button
                onClick={() => setAutoplay(!autoplay)}
                disabled={!hasMoreSteps}
                className="btn btn-secondary"
                style={{ 
                  flex: 1, 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px',
                  borderColor: autoplay ? 'var(--primary)' : 'rgba(56, 189, 248, 0.25)',
                  color: autoplay ? 'var(--primary)' : 'var(--secondary)'
                }}
              >
                {autoplay ? <Pause size={16} /> : <Play size={16} />}
                {autoplay ? t.pause : t.autoPlay}
              </button>

              <button
                onClick={() => {
                  setOriginalExpr(originalExpr + ' '); // forces parser re-run
                  setOriginalExpr(originalExpr.trim());
                }}
                className="btn"
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  color: '#ffffff',
                  width: '2.75rem', 
                  height: '2.75rem', 
                  borderRadius: '12px', 
                  padding: 0 
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Evaluation Speed Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sliders size={12} />
                  {t.speed}
                </span>
                <span>{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="3.0"
                step="0.2"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--primary)',
                  background: 'rgba(255,255,255,0.1)',
                  height: '4px',
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive Canvas + Reduction Logs Side-by-Side */}
        <div 
          className="kiosk-panel"
          style={{ 
            padding: '1.5rem', 
            width: '100%', 
            height: '100%', 
            flexDirection: 'row', 
            gap: '1.5rem', 
            alignItems: 'stretch' 
          }}
        >
          {/* Visualizer Canvas Area */}
          <div style={{ flex: 1.8, display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontFamily: 'Cinzel', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  AST VIEWPORT
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.65rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d4af37' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#d4af37' }}></span>
                  {t.nodeOperator}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#38bdf8' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38bdf8' }}></span>
                  {t.nodeLiteral}
                </span>
              </div>
            </div>

            {/* SVG AST Canvas */}
            <div style={{ flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                width="100%" 
                height="100%"
                style={{ 
                  background: 'rgba(5, 7, 12, 0.4)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.03)'
                }}
              >
                {/* Visual grid lines behind */}
                <defs>
                  <pattern id="ast-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ast-grid)" />

                {/* Draw Parent-Child Connectors */}
                {flatLines.map((line) => (
                  <line
                    key={line.id}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth={2}
                    className="ast-line"
                    style={{
                      opacity: line.opacity,
                    }}
                  />
                ))}

                {/* Draw AST Nodes */}
                {flatNodes.map((node) => {
                  const isOperator = node.type === 'operator';
                  
                  // Color codes: Operators are Gold, Literals/collapsed results are Cyan
                  const strokeColor = (isOperator && !node.isCollapsed) 
                    ? '#d4af37' 
                    : '#38bdf8';
                  
                  const fillColor = (isOperator && !node.isCollapsed)
                    ? 'rgba(212, 175, 55, 0.08)'
                    : 'rgba(56, 189, 248, 0.08)';

                  return (
                    <g 
                      key={node.id} 
                      style={{ 
                        opacity: node.opacity,
                        transform: node.evaluating ? 'scale(1.05)' : 'none',
                        transformOrigin: `${node.x}px ${node.y}px`,
                        transition: 'opacity 0.6s ease, transform 0.3s ease'
                      }}
                    >
                      {/* Pulsing ring during evaluation highlight */}
                      {node.evaluating && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={20}
                          className="evaluating-ring"
                          style={{
                            stroke: '#d4af37',
                            fill: 'none',
                          }}
                        />
                      )}
                      
                      {/* Background Glow */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        fill="transparent"
                        stroke={node.evaluating ? 'rgba(212,175,55,0.4)' : 'transparent'}
                        strokeWidth={6}
                        style={{ filter: 'blur(3px)' }}
                      />

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        stroke={strokeColor}
                        strokeWidth={node.evaluating ? 3 : 2}
                        fill={fillColor}
                        className="ast-node-circle"
                        style={{
                          filter: node.evaluating ? 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' : 'none'
                        }}
                      />

                      {/* Value/Operator Label */}
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill={strokeColor}
                        fontSize={13}
                        fontWeight={700}
                        className="ast-node-text"
                        style={{
                          textShadow: node.evaluating ? '0 0 4px rgba(212,175,55,0.6)' : 'none'
                        }}
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Status Overlay */}
              {!hasMoreSteps && (
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(4px)'
                }}>
                  <Sparkles size={14} />
                  <span>{t.completed} ({originalExpr} = {serializeTree(tree!)})</span>
                </div>
              )}
            </div>

            {/* Equivalent reduction progression display */}
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05rem' }}>
                {t.syntacticEquivalence}
              </span>
              <div style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.85rem', 
                background: 'rgba(5, 7, 12, 0.3)', 
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflowX: 'auto'
              }}>
                <span style={{ color: 'var(--primary)' }}>{t.originalExpression}: </span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{originalExpr}</span>
                <span style={{ margin: '0 0.5rem', color: 'var(--primary)' }}>≡</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{tree ? serializeTree(tree) : originalExpr}</span>
              </div>
            </div>
          </div>

          {/* Right Log Sidebar */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(212, 175, 55, 0.12)', paddingLeft: '1.5rem', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <BookOpen size={15} style={{ color: 'var(--secondary)' }} />
              <span style={{ fontFamily: 'Cinzel', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                {t.reductionLogs}
              </span>
            </div>

            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
              <strong>{t.equivalenceExplanation}:</strong>
              <p style={{ marginTop: '0.25rem', color: 'rgba(255,255,255,0.4)' }}>
                {t.sidebarDesc}
              </p>
            </div>

            {/* Scrollable logs list */}
            <div 
              ref={logContainerRef}
              className="log-sidebar"
              style={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem',
                paddingRight: '0.25rem'
              }}
            >
              {logs.length === 0 ? (
                <div style={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.15)',
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  padding: '1rem',
                  border: '1px dashed rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  <Info size={20} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                  <p>{t.noLogs}</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="log-item-animation"
                    style={{
                      background: 'linear-gradient(to right, rgba(15, 22, 42, 0.5), rgba(5, 8, 15, 0.7))',
                      border: '1px solid rgba(56, 189, 248, 0.1)',
                      borderLeft: '3px solid var(--secondary)',
                      borderRadius: '6px',
                      padding: '0.6rem 0.8rem',
                    }}
                  >
                    <div style={{ 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      color: 'var(--secondary)', 
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: '0.25rem',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>{t.reductionStepTitle(log.step)}</span>
                      <span>[Equiv Class Resolution]</span>
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontFamily: 'monospace', 
                      color: '#ffffff',
                      marginBottom: '0.25rem',
                      lineHeight: 1.3
                    }}>
                      {log.text}
                    </div>
                    <div style={{ 
                      fontSize: '0.6rem', 
                      color: 'rgba(255, 255, 255, 0.35)', 
                      lineHeight: 1.3 
                    }}>
                      {log.detail}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
