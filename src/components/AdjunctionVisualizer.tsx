import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, Layers, CheckCircle2, BookOpen,
  Play, Pause, Square, FastForward, Rewind,
  ChevronRight
} from 'lucide-react';

interface ElementNode {
  id: string;
  label: string;
}

interface TourStop {
  id: number;
  title: string;
  subtitle: string;
  text: string;
}

interface SpokenWord {
  text: string;
  start: number;
  end: number;
}

let activeUtteranceRef: SpeechSynthesisUtterance | null = null;

export default function AdjunctionVisualizer({ language, forcedRoom }: { language: 'en' | 'ja', forcedRoom?: number }) {
  const getInitialRoom = (): number => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const room = parseInt(params.get('room') || '1', 10);
      return (room >= 1 && room <= 10) ? room : 1;
    }
    return 1;
  };

  const [currentStopState, setCurrentStop] = useState<number>(getInitialRoom);
  const currentStop = forcedRoom !== undefined ? forcedRoom : currentStopState;

  // Synchronize room state with URL query parameter
  useEffect(() => {
    if (forcedRoom !== undefined) return;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('room') !== currentStop.toString()) {
        params.set('room', currentStop.toString());
        const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [currentStop, forcedRoom]);

  const [setElements, setSetElements] = useState<ElementNode[]>([
    { id: '1', label: 'I' },
    { id: '2', label: 'I' },
    { id: '3', label: 'I' }
  ]);
  const [monoidWords, setMonoidWords] = useState<string[]>([]);
  const [animationState, setAnimationState] = useState<'idle' | 'free' | 'forget' | 'unit' | 'counit'>('idle');
  const [counitInput, setCounitInput] = useState<string>('I-I-I');
  const [counitResult, setCounitResult] = useState<string | null>(null);

  const tabContent = useMemo(() => {
    // Stop 1 -> Room 1 (Hall I: Entrance)
    // Stop 2 -> Room 2 (Hall II: Counting)
    // Stop 3 -> Room 4 (Hall IV: Language & Grammar)
    // Stop 4 -> Room 5 (Hall V: Computation)
    // Stop 5 -> Room 6 (Hall VI: Category of Sets)
    // Stop 6 -> Room 9 (Hall IX: Adjunction Duality)
    const roomNum = currentStop === 3 ? 4 : (currentStop === 4 ? 5 : (currentStop === 5 ? 6 : (currentStop === 6 ? 9 : currentStop)));

    const contentByRoom: Record<number, {
      en: { narrative: string; rigor: string; history: string; exercises: string };
      ja: { narrative: string; rigor: string; history: string; exercises: string };
    }> = {
      1: {
        en: {
          narrative: "Welcome to the Ontology Museum. At its ultimate foundation, mathematics is not the study of numbers or shapes, but the dialogical cycle of Free Generation and Quotienting. We begin by writing down raw symbols without constraint—this is the creation of pure Syntax (Generators). We then fold, identify, and group these symbols under equations to resolve their meaning—this is Semantics (Relations). Every mathematical structure is born of this simple cognitive loop.",
          rigor: "In formal terms, this cycle is modeled as a presentation by Generators and Relations. Given a set of raw elements $X$ (generators), we construct a free algebra $F(X)$ containing all possible syntactic terms. We then define a set of relations $R \\subseteq F(X) \\times F(X)$ representing equations we wish to force. The quotient structure $F(X)/\\sim$ is the finest algebraic structure where these relations hold, formalized category-theoretically as a Coequalizer.",
          history: "\"The limits of my language mean the limits of my world.\" — Ludwig Wittgenstein, *Tractatus Logico-Philosophicus*. This exhibition draws connections between Wittgenstein's logical syntax, Immanuel Kant's schemata of pure understanding, and F. William Lawvere's category-theoretic foundations of physics and logic.",
          exercises: "1. If syntax is represented as the set of all possible keystrokes on a typewriter, what mathematical tool represents the meaning of the written sentences?\n2. Prove that the quotient map $\\pi: F(X) \\to F(X)/\\sim$ is a homomorphism."
        },
        ja: {
          narrative: "随伴存在論ツアーへようこそ。数学はその最も根源的な土台において、数や図形の研究ではなく、自由生成と商化（関係性の構築）という２つの認知の対話的サイクルそのものです。私たちは最初に一切の制約なしに生の記号を並べて「構文（Syntax）」を作り出し、次にそれらを方程式によって結びつけて折りたたむことで「意味論（Semantics）」を与えます。",
          rigor: "形式的には、このサイクルは「生成元と関係式（Generators and Relations）」による表示としてモデル化されます。生の要素の集合 $X$ から自由代数 $F(X)$ を生成し、同値関係 $\\sim$ を定める関係式 $R$ によって商構造 $F(X)/\\sim$ を構成します。これは圏論におけるコイコライザー（余等化子）の構成に対応します。",
          history: "「私の言語の限界は、私の世界の限界を意味する」 — ルートヴィヒ・ウィトゲンシュタイン『論理哲学論考』。本展示は、ウィトゲンシュタインの論理的構文論、イマヌエル・カントの純粋悟性概念、そしてウィリアム・ローヴェアによる物理と論理の圏論的基礎づけを結びつけます。",
          exercises: "1. タイプライターの打鍵の集合を「構文」とするとき、書かれた文章の「意味」を数学的に表す操作は何ですか？\n2. 射影写像 $\\pi: F(X) \\to F(X)/\\sim$ が準同型写像であることを証明しなさい。"
        }
      },
      2: {
        en: {
          narrative: "A million years ago, our ancestors carved notches on the Lebombo bone. The act of cutting tally marks I, II, III freely is the free generation of syntax. But raw marks are useless without a contract. By grouping these notches into equivalent packets (like five-notch bundles or Sumerian clay tokens) and establishing a bijection to a herd of sheep, humanity discovered cardinality. The number \"5\" is not a physical object; it is the quotient class of all tally marks that can be put in one-to-one correspondence.",
          rigor: "Let $Set$ be the category of sets. The free generation step is the construction of finite ordinal sets. The quotienting step is the partition of the class of all sets under the equivalence relation of equipotence (bijection): $A \\sim B \\iff \\exists f: A \\to B$ which is bijective. The isomorphism class $[A]_\\sim$ defines the cardinal number.",
          history: "Anthropologists trace the birth of writing and mathematics to clay token accounting systems in ancient Mesopotamia (8000 BCE) and the knotted strings (*quipu*) of the Inca Empire. Raw elements (clay shapes or string loops) were freely generated and then quotiented by economic transactions to represent structural assets.",
          exercises: "1. Explain how an Inca *quipu* represents both free generation and quotienting.\n2. Show that equipotence ($\\sim$) is an equivalence relation on sets."
        },
        ja: {
          narrative: "百万年前、人類の祖先はレボンボ骨に刻み目（タノッチ）を刻みました。ルールなしに刻み目 I, II, III を無数に刻む行為は、純粋な記号構文の「自由生成」です。しかし、ただの刻み目だけでは意味をなしません。刻み目を特定の束（5本括りなど）やメソポタミアの粘土トークンに対応させ、羊の群れと「一対一の対応（写像）」を作ることで、人類は個数（基数）を発見しました。数「5」とは物理的な実体ではなく、一対一対応するすべてのノッチの「商集合（同値類）」なのです。",
          rigor: "集合の圏 $Set$ において、自由生成ステップは有限順序数の構成です。商化ステップは、対等（全単射の存在）という同値関係 $A \\sim B \\iff \\exists f: A \\to B$ による集合全体のクラスの分割です。同値類 $[A]_\\sim$ が基数（カルディナリティ）を定義します。",
          history: "考古学者は、文字と数学の起源を古代メソポタミアの粘土トークン会計システム（紀元前8000年）やインカ帝国の結縄（キープ）に求めます。生の要素（粘土や結び目）が自由に生成され、取引契約という「商化」によって価値に折りたまれました。",
          exercises: "1. インカのキープがどのように「自由生成」と「商化」の両方を表現しているか説明しなさい。\n2. 集合間の対等関係（$\\sim$）が同値関係であることを示しなさい。"
        }
      },
      4: {
        en: {
          narrative: "With the alphabet, humanity unlocked infinite expression. Arranging letters freely to generate strings of text is the free generation of syntax. But stringing symbols together does not create communication. Language requires a semantic quotient. When we group different strings under equivalence classes of synonyms or definitions (e.g., \"automobile\" $\\equiv$ \"car\"), we partition the free syntactic monoid into semantic meaning.",
          rigor: "Let $\\Sigma$ be a finite alphabet. The free monoid $\\Sigma^*$ consists of all finite strings. A grammar defines a congruence relation $\\sim$ on $\\Sigma^*$ where $u \\sim v$ if they represent the same meaning or semantic evaluation. The quotient monoid $\\Sigma^*/\\sim$ represents the semantic algebra of the language.",
          history: "This matches Gottlob Frege's distinction between *Sinn* (Sense/Syntax) and *Bedeutung* (Reference/Meaning). Frege argued that language freely generates infinite senses, but we quotient them by their real-world references to evaluate truth values.",
          exercises: "1. If two distinct program code strings compile to compile the exact same binary output, are they equivalent in the syntactic free monoid or the semantic quotient?\n2. Show that if $\\sim$ is a congruence relation on a monoid $M$, then the quotient $M/\\sim$ inherits the monoid structure."
        },
        ja: {
          narrative: "文字と言葉を手に入れることで、人類は無限の表現力を獲得しました。アルファベットを自由に並べて文字列を生成する行為は、構文の「自由生成」です。しかし、文字列をただ並べるだけではコミュニケーションは生まれません。言語には意味論的な「商化」が必要です。異なる文字列を「同義語（シンタックスが違ってもセマンティクスが同じ）」として同じグループに分類するとき、私たちは自由な文字列のモノイドを意味の世界へと商化しているのです。",
          rigor: "有限アルファベット $\\Sigma$ に対し、すべての文字列からなる自由モノイドを $\\Sigma^*$ とします。文法や意味論は $\\Sigma^*$ 上の合同関係（Congruence Relation） $\\sim$ を定義し、同一の意味を表す文字列同士を結びつけます。商モノイド $\\Sigma^*/\\sim$ が、言語の意味代数を表します。",
          history: "これはゴットロープ・フレーゲの「意義（Sinn/構文）」と「意味（Bedeutung/意味論）」の区別に一致します。フレーゲは、言語が無限の意義を自由生成し、それを現実の指示対象によって商化することで真理値を評価すると主張しました。",
          exercises: "1. 異なる2つのプログラムコードが全く同じバイナリを出力するとき、それらは「自由モノイド」と「商モノイド」のどちらにおいて同値ですか？\n2. モノイド $M$ 上の合同関係 $\\sim$ に対し、商集合 $M/\\sim$ がモノイドの構造を継承することを示しなさい。"
        }
      },
      5: {
        en: {
          narrative: "In computer science, writing code is the free generation of syntax trees (ASTs). The compiler parses raw text characters into structured, nested operators and literals without executing them. Executing the code means collapsing this tree. The CPU recursively applies binary operations—folding $3 + 5$ to $8$—until the entire tree collapses into a single semantic value. Computation is the strict algebraic collapse of syntax.",
          rigor: "Let $T$ be the algebraic theory of arithmetic. The free algebra $F(X)$ represents all arithmetic syntax trees. The evaluation is a homomorphism $eval: F(X) \\to \\mathbb{Z}$ that quotients the terms by the computational rewrite relations (e.g., $x + y \\sim z$). The final value is the equivalence class of the tree under computation.",
          history: "This is the foundation of Alonzo Church's $\\lambda$-calculus, where terms are freely generated and then quotiented by $\\beta$-reduction equivalence. It proves that software execution is literally the mathematical quotienting of syntax.",
          exercises: "1. Walk through the AST evaluation steps of $(2 * 3) + (10 / 2)$ and identify the relations applied at each collapse.\n2. Prove that evaluation is a homomorphic mapping from the tree algebra to the integer algebra."
        },
        ja: {
          narrative: "コンピュータサイエンスにおいて、プログラムを書くことは「抽象構文木（AST）」を自由生成することです。コンパイラは生のテキストを、実行することなく、入れ子状の演算子とリテラルへと構造化します。コードを実行することは、この構文木を折りたたむ（Collapse）ことに他なりません。CPUは二項演算を再帰的に適用し、$3 + 5$ を $8$ へと折りたたみ、最終的に木全体を１つの値へと商化させます。計算とは、構文の代数的な崩壊そのものなのです。",
          rigor: "算術の代数理論を $T$ とします。自由代数 $F(X)$ はすべての算術構文木を表します。評価（Evaluation）は、計算の書き換え規則（例：$x + y \\sim z$）によって項を商化する準同型写像 $eval: F(X) \\to \\mathbb{Z}$ です。最終的な出力値は、計算関係の下での構文木の同値類です。",
          history: "これはアロンゾ・チャーチの $\\lambda$ 算術の基礎であり、項は自由生成された後、$\\beta$ 簡約の同値関係によって商化されます。ソフトウェアの実行とは、文字通り構文を数学的に商化することであると証明されています。",
          exercises: "1. 式 $(2 * 3) + (10 / 2)$ のAST評価ステップをたどり、各崩壊ステップで適用される「関係式」を特定しなさい。\n2. 評価写像が構文木の代数から整数の代数への準同型写像であることを証明しなさい。"
        }
      },
      6: {
        en: {
          narrative: "We now enter formal Category Theory. The Category of Sets (denoted as $\\mathcal{C}$ or $\\mathcal{S}et$) represents the mathematical state of nature: a universe of isolated, unstructured points and simple functions (mappings) between them. Here, there are no algebraic operations, no multiplication, and no paths. It is the realm of pure, unconstrained generators—the raw input material of mathematics.",
          rigor: "The category $Set$ has sets as objects and functions as morphisms. Composition of morphisms is the standard composition of functions, which is associative, and for every set $X$ there exists an identity function $id_X$. Set represents the primordial category from which we forget algebraic structure.",
          history: "Developed by Georg Cantor in the late 19th century, Set Theory was designed to formalize the absolute foundation of all mathematical objects. Category theory frames it as the base category $\\mathcal{C}$ before any structured universal functors are applied.",
          exercises: "1. Why do we say Set has no algebraic structure?\n2. Show that function composition in Set is associative."
        },
        ja: {
          narrative: "ここから本格的な圏論に入ります。集合の圏（$\\mathcal{C}$ または $\\mathcal{S}et$）は、数学における「自然状態」を表しています。そこにあるのは、互いにつながりのない、構造を持たない個々の「点（要素）」と、それらの間の単純な写像（関数）だけです。代数演算も、掛け算も、経路も存在しません。純粋な『生の生成元』が集まる、数学における最も自由で制約のない空間です。",
          rigor: "圏 $Set$ は集合を対象（Objects）とし、写像を射（Morphisms）とする、代数的構造を取り去った「原初」の圏です。射の合成は写像の通常の合成であり、結合法則を満たし、すべての集合 $X$ に対して恒等写像 $id_X$ が存在します。",
          history: "19世紀後半にゲオルク・カントールによって開発された集合論は、すべての数学的対象の基礎を定式化するために設計されました。圏論では、これを構造化関手が適用される前の基本の圏 $\\mathcal{C}$ として位置づけます。",
          exercises: "1. なぜ「集合の圏には代数的構造がない」と言われるのですか？\n2. 集合の圏における関数の合成が結合法則を満たすことを示しなさい。"
        }
      },
      9: {
        en: {
          narrative: "The climax of our exhibition is the Adjunction Duality ($F \\dashv U$). It establishes a natural isomorphism between mapping spaces: $\\text{hom}(F(X), M) \\cong \\text{hom}(X, U(M))$. This is the formal mathematical proof of our core thesis. It states that defining a structural homomorphism (the quotient evaluation) out of a freely generated structure is identical to simply choosing where the raw generators map. Evaluating a quotient is uniquely determined at the generators.",
          rigor: "The bijection $\\Phi: \\text{hom}_{Mon}(F(X), M) \\cong \\text{hom}_{Set}(X, U(M))$ is natural in both $X$ and $M$. For any set map $f: X \\to U(M)$, there exists a unique monoid homomorphism $\\bar{f}: F(X) \\to M$ such that $\\bar{f} \\circ \\eta_X = f$, where $\\eta_X: X \\to U(F(X))$ is the unit of the adjunction (the inclusion of generators).",
          history: "Adjunctions were discovered by Daniel Kan in 1958. Saunders Mac Lane famously summarized the unity of mathematics under this duality: \"Adjoint functors arise everywhere.\" It proves that the tension between syntax (F) and semantics (U) is in perfect, symmetric balance.",
          exercises: "1. Explain the role of the unit $\\eta_X$ in the adjunction.\n2. Prove that if $\\bar{f}$ and $\\bar{g}$ are monoid homomorphisms out of a free monoid $F(X)$ that agree on the generators $X$, then $\\bar{f} = \\bar{g}$."
        },
        ja: {
          narrative: "本展示のクライマックスは、随伴双対性（$F \\dashv U$）です。これは写像空間の間の自然同型 $\\text{hom}(F(X), M) \\cong \\text{hom}(X, U(M))$ を確立します。これは私たちの核心的テーゼの数学的証明です。「自由生成された構造からの準同型写像（商の評価）」を定義することは、単に「生の生成元をどこに送るかを選ぶこと」と完全に同一であると述べています。商の評価は、生成元の挙動だけで一意に決定されるのです。",
          rigor: "全単射 $\\Phi: \\text{hom}_{Mon}(F(X), M) \\cong \\text{hom}_{Set}(X, U(M))$ は $X$ と $M$ に関して自然（Natural）です。任意の写像 $f: X \\to U(M)$ に対し、$\\bar{f} \\circ \\eta_X = f$ を満たす一意のモノイド準同型写像 $\\bar{f}: F(X) \\to M$ が存在します（$\\eta_X: X \\to U(F(X))$ は随伴の単位元、すなわち生成元の埋め込みです）。",
          history: "随伴は1958年にダニエル・カンによって発見されました。ソーンダース・マックレーンは、この双対性の下での数学の統一性を「随伴関手は至る所に現れる」という有名な言葉でまとめました。構文（F）と意味論（U）の間の緊張関係が、完璧に対称的なバランスにあることを証明しています。",
          exercises: "1. 随伴における単位元 $\\eta_X$ の役割を説明しなさい。\n2. 自由モノイド $F(X)$ からのモノイド準同型 $\\bar{f}, \\bar{g}$ が、生成元 $X$ 上で一致するならば、$\\bar{f} = \\bar{g}$ であることを証明しなさい。"
        }
      }
    };

    const activeRoomContent = contentByRoom[roomNum] || contentByRoom[1];
    return activeRoomContent[language];
  }, [currentStop, language]);

  // Text-to-Speech (TTS) states
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'narrative' | 'rigor' | 'history' | 'exercises'>('narrative');

  // Load voices dynamically based on active language selection
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      
      const langPrefix = language === 'ja' ? 'ja' : 'en';
      const filteredVoices = allVoices.filter(v => v.lang.startsWith(langPrefix));
      setVoices(filteredVoices);

      // Auto-select US English Neural voices
      const scoredVoices = filteredVoices.map(v => {
        let score = 0;
        const nameLower = v.name.toLowerCase();
        const langLower = v.lang.toLowerCase();

        if (language === 'en') {
          if (langLower.includes('en-us') || langLower.includes('en_us')) score += 100;
          if (nameLower.includes('natural') || nameLower.includes('neural') || nameLower.includes('online')) score += 50;
          if (nameLower.includes('google') || nameLower.includes('microsoft') || nameLower.includes('apple')) score += 30;
          if (nameLower.includes('aria') || nameLower.includes('guy') || nameLower.includes('samantha') || nameLower.includes('female') || nameLower.includes('male')) score += 20;
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

  // Reset elements labels depending on stop
  useEffect(() => {
    if (currentStop === 2) {
      setSetElements([
        { id: '1', label: 'I' },
        { id: '2', label: 'I' },
        { id: '3', label: 'I' }
      ]);
      setCounitInput('I-I-I');
    } else {
      setSetElements([
        { id: '1', label: 'x' },
        { id: '2', label: 'y' },
        { id: '3', label: 'z' }
      ]);
      setCounitInput('x-y-z');
    }
    setMonoidWords([]);
    setAnimationState('idle');
    setCounitResult(null);
  }, [currentStop]);

  // Stop speech when current stop, language, or active tab changes
  useEffect(() => {
    stopSpeechComplete();
  }, [currentStop, language, activeTab]);

  // Hot-reload speed multiplier mid-speech
  useEffect(() => {
    if (activeSpeechText) {
      const activeIdx = currentCharIndex >= 0 ? currentCharIndex : 0;
      startSpeech(activeSpeechText, activeIdx);
    }
  }, [speedMultiplier]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeechComplete = () => {
    if ('speechSynthesis' in window) {
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
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Introduce a brief timeout to let the browser cancel process complete
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
    if (!('speechSynthesis' in window)) return;

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

    // Locate active word index
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

  const addElement = () => {
    const labels = currentStop === 2 
      ? ['I', 'I', 'I', 'I', 'I', 'I']
      : ['x', 'y', 'z', 'w', 'u', 'v', 'a', 'b', 'c'];
    
    if (currentStop === 2) {
      if (setElements.length >= 8) return;
      const newId = (setElements.length + 1).toString();
      setSetElements([...setElements, { id: newId, label: 'I' }]);
    } else {
      const usedLabels = setElements.map(e => e.label);
      const available = labels.filter(l => !usedLabels.includes(l));
      if (available.length === 0) return;
      const nextLabel = available[0];
      const newId = (setElements.length + 1).toString();
      setSetElements([...setElements, { id: newId, label: nextLabel }]);
    }
    setMonoidWords([]);
  };

  const clearElements = () => {
    setSetElements([]);
    setMonoidWords([]);
    setAnimationState('idle');
    setCounitResult(null);
    stopSpeechComplete();
  };

  // Functor F: Free Generation
  const triggerFreeGeneration = () => {
    setAnimationState('free');
    setCounitResult(null);
    setTimeout(() => {
      const letters = setElements.map(e => e.label);
      if (letters.length === 0) {
        setMonoidWords(currentStop === 2 ? ['0 (empty)'] : ['ε (empty)']);
        return;
      }
      
      const generated: string[] = currentStop === 2 ? ['0'] : ['ε']; 
      if (currentStop === 2) {
        let tally = '';
        letters.forEach(() => {
          tally += 'I';
          generated.push(tally);
        });
      } else {
        letters.forEach(l => generated.push(`[${l}]`));
        if (letters.length >= 2) {
          for (let i = 0; i < letters.length - 1; i++) {
            generated.push(`[${letters[i]},${letters[i+1]}]`);
          }
        }
        if (letters.length >= 3) {
          generated.push(`[${letters.slice(0, 3).join(',')}]`);
        }
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
    if (currentStop === 2) {
      const sum = parts.join('').length;
      setTimeout(() => {
        setCounitResult(sum.toString() + ' (mammoths / objects)');
      }, 1000);
    } else {
      const product = parts.join('');
      setTimeout(() => {
        setCounitResult(product);
      }, 1000);
    }
  };

  const getWordAtCharIndex = (text: string, charIdx: number): string | null => {
    const words = getSpokenWords(text, language);
    const match = words.find(w => charIdx >= w.start && charIdx < w.end);
    return match ? match.text : null;
  };

  const handleSpeechTrigger = (word: string) => {
    const w = word.toLowerCase();
    if (w.includes('free') || w.includes('functor') || w.includes('generate') || w.includes('path') || w.includes('monoid') || 
        w.includes('自由') || w.includes('関手') || w.includes('生成') || w.includes('経路') || w.includes('モノイド')) {
      triggerFreeGeneration();
    } else if (w.includes('forgetful') || w.includes('collapse') || w.includes('forget') || w.includes('isomorphism') || 
               w.includes('忘却') || w.includes('崩壊') || w.includes('忘れる') || w.includes('同型')) {
      triggerForgetfulCollapse();
    } else if (w.includes('unit') || w.includes('counit') || w.includes('adjoining') || w.includes('adjunction') || 
               w.includes('随伴') || w.includes('単位') || w.includes('余単位')) {
      if (w.includes('counit') || w.includes('余単位')) {
        triggerCounitCollapse();
      } else {
        triggerUnitMap();
      }
    }
  };

  // Tokenize text into segments with positions
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

  // Renders spoken words in Spans for real-time gold highlighting
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

  const nextStop = () => {
    if (currentStop < tourStops.length) {
      setCurrentStop(currentStop + 1);
    }
  };

  // Tour stops definitions (Gradual, rigorous buildup of Free Generation & Quotients)
  const tourStops: TourStop[] = language === 'ja' ? [
    {
      id: 1,
      title: "I. 美術館入口：存在論的サイクル",
      subtitle: "人類が記法と意味論を通じて存在を発見した物語。",
      text: "随伴存在論ツアーへようこそ。数学はその究極の基盤において、自由生成と商化という２つの認知の対話的サイクルそのものです。私たちは最初に文字や記号を一切の制約なしに並べて「構文（Syntax）」を作り出し、次にそれらを方程式によって特定の価値へと折りたたむことで「意味論（Semantics）」を与えます。この一見単純なプロセスこそがすべての数学的構造の起源です。本ツアーでは、骨の刻み目から言語の文法、そして圏論へとこの二重性を段階的に追っていきます。"
    },
    {
      id: 2,
      title: "II. 数え上げの黎明：石ころと刻み目 (百万年前)",
      subtitle: "無制限に刻み目を打つ「自由生成」と、個数へ折りたたむ「商化」。",
      text: "百万年前、私たちの祖先は骨に刻み目（ノッチ）を刻み始めました。追加のルールを持たずに、刻み目 I を I, II, III と無数に刻み続ける行為は、純粋な記号構文の「自由生成」です。しかし、バラバラの刻み目そのものは役に立ちません。これを「5頭の獲物」という単一の数概念へと折りたたむ行為、これこそが「商化」です。バラバラな表記を同値関係でまとめ上げることで、私たちは数を把握したのです。"
    },
    {
      id: 3,
      title: "III. 言語の誕生：アルファベットと意味論 (古代)",
      subtitle: "アルファベットから無限の文を生成し、共通概念へと商化させる。",
      text: "文字を手に入れた人類は、少数の記号から無限の言葉や文を紡ぎ出す能力を獲得しました。ルールを無視してアルファベットを自由に並べる行為は、無制限な記号空間の「自由生成」です。しかし、綴りや言い回しが異なっていても、伝わる核心的なイメージは一つに収縮します。私たちは異なる表現を「同義」としてグループ化（商化）することで、言語に共通の意味論を与えたのです。"
    },
    {
      id: 4,
      title: "IV. アルゴリズムの時代：構文木とコンパイル (現代)",
      subtitle: "コード構文を生成し、コンピューターで評価して値へ崩壊させる。",
      text: "現代のコンピューターサイエンスも、このサイクルを共有しています。コードを書く際、私たちは変数や演算子を自由に並べて「抽象構文木（AST）」を生成します。そしてコンパイラやCPUが二項演算に従って式を再帰的に評価し、最終的な出力値へと「崩壊（Quotient Collapse）」させます。コードの記述が自由生成であり、その実行が商化による値の導出に他なりません。"
    },
    {
      id: 5,
      title: "V. 定式化：集合とモノイドの圏",
      subtitle: "認知の往復を、数学的なオブジェクトの接続として記述する。",
      text: "この知性の往復を、圏論を用いて正式に定義します。構造を持たない生の記号の世界を「集合の圏C」とし、結合ルールを持つ体系を「モノイドの圏D」と呼びます。集合から自由な文字列を作る操作は「自由関手F」であり、モノイドから演算構造を無視して生の文字列に戻す操作は「忘却関手U」です。これらは２つの世界の架け橋です。"
    },
    {
      id: 6,
      title: "VI. 定式化：随伴 duality (F ⊣ U)",
      subtitle: "自由生成と商化崩壊を完璧に統合する自然同型。",
      text: "自由生成と商化のループは、圏論において「随伴（F ⊣ U）」として統合されます。これは、自由モノイド上のすべての準同型写像（崩壊のルール）が、元の生の要素をどこに送るかという最初の写像だけで一意に決定されることを意味します。百万年前に小石を数え始めた人類の思考の必然が、数学の最も美しい随伴の橋によって証明されるのです。"
    }
  ] : [
    {
      id: 1,
      title: "I. Gallery Entrance: The Ontological Cycle",
      subtitle: "The absolute nature of mathematical existence.",
      text: "Welcome to the Ontology Museum Tour. At its ultimate foundation, mathematics is the dialogical cycle of Free Generation and Quotienting. Every mathematical system is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations and equations to resolve semantics. In this tour, we will explore this duality step-by-step, starting from bone notches and language grammar, to formal Category Theory."
    },
    {
      id: 2,
      title: "II. The Dawn of Counting: Pebbles and Notches (1M Years Ago)",
      subtitle: "Generating notches freely and collapsing them into numeric quantities.",
      text: "A million years ago, our ancestors carved notches on bones to record quantity. Carving notches I, II, III freely with no rules is the free generation of pure syntax. However, raw notches are useless on their own. Folding those discrete marks into a single numeric concept, such as 5, to trade, compare, or share is the quotient collapse. By grouping syntactic marks under bijection, we discovered numbers."
    },
    {
      id: 3,
      title: "III. The Birth of Language: Alphabet & Semantics (Ancient Eras)",
      subtitle: "Generating infinite strings of text and collapsing them into shared meaning.",
      text: "With alphabets, humanity gained the ability to generate infinite sentences. Arranging letters freely to write down expressions represents the free generation of syntax. Quotienting is the mechanism of semantics, where multiple different syntactic formulations or synonyms collapse under a single equivalence class representing a shared definition or meaning."
    },
    {
      id: 4,
      title: "IV. The Algorithmic Era: Syntax Trees & Evaluation (Modern)",
      subtitle: "Generating abstract syntax trees and collapsing them into values.",
      text: "Modern computer science follows the exact same cognitive cycle. We freely assemble variables and operators into nested Abstract Syntax Trees (Syntax). The CPU or compiler then collapses this tree using binary operations, reducing it into a single computed output value (Evaluation). Writing code is free generation, while executing it is quotient collapse."
    },
    {
      id: 5,
      title: "V. Formalization: Categories of Sets & Monoids",
      subtitle: "Representing our cognitive cycle with objects and structured categories.",
      text: "We now introduce Category Theory to formalize this cognitive loop mathematically. Category C of Sets represents the world of raw elements (notches, variables) without structure. Category D of Monoids represents structured objects with associative multiplication. Free generation is represented as the Free Functor F, and collapse is represented as the Forgetful Functor U."
    },
    {
      id: 6,
      title: "VI. Formalization: The Adjunction Duality (F ⊣ U)",
      subtitle: "The natural isomorphism uniting notation and meaning.",
      text: "The ultimate mathematical formalization of our ontology is the Adjunction. It establishes a natural isomorphism between hom-sets. This states that specifying a collapsed evaluation map out of a free structure is identical to choosing where the raw generators map. The cognitive circle that began with notch-carving a million years ago is mathematically unified."
    }
  ];

  const isSpeaking = activeSpeechText === tabContent[activeTab];

  return (
    <div className="visualizer-container animate-pop-in">
      
      {/* Prominent Segmented Room Navigation Dashboard */}
      {forcedRoom === undefined && (
        <nav className="room-nav-tabs">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'][num - 1];
            const isActive = currentStop === num;
            return (
              <button
                key={num}
                onClick={() => setCurrentStop(num)}
                className={`room-tab-btn ${isActive ? 'active' : ''}`}
              >
                <span className="room-tab-num">{roman}</span>
                <span className="room-tab-title">
                  {language === 'en' 
                    ? ['Entrance', 'Counting', 'Language', 'Algorithms', 'Categories', 'Adjunction'][num - 1]
                    : ['入口', '数え上げ', '言語', '計算機', '定式化', '随伴'][num - 1]
                  }
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Museum Guide Nav Controller (Audio Guide Device Mock-up) */}
      <div className="audio-guide-player">
        
        {/* Device Brand & Screen */}
        <div className="device-info">
          <div className="device-screen" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
            {isSpeaking ? 'ON' : 'OFF'}
          </div>
          <div className="device-meta">
            <h4>{language === 'en' ? 'Audio Companion Guide' : '解説ガイドレシーバー'}</h4>
            <p>{language === 'en' ? 'Exhibition Sound Guide' : '展示音声アナウンス'}</p>
          </div>
        </div>

        {/* Dynamic Voice Selection */}
        <div className="audio-controls-group" style={{ gap: '0.75rem' }}>
          {voices.length > 0 && (
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="input-text"
              style={{ 
                width: '100px', 
                fontSize: '0.6rem', 
                padding: '1px 4px', 
                height: '24px', 
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: 'var(--primary)',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
            >
              {voices.map((v, i) => (
                <option key={i} value={v.name} style={{ background: '#0b0f19', color: '#fff' }}>
                  {v.name.replace('Microsoft', 'MS').replace('Google', 'G').replace('日本語', 'JP')}
                </option>
              ))}
            </select>
          )}

          {/* Speed Selector Menu */}
          <select
            value={speedMultiplier.toString()}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="input-text"
            style={{ 
              width: '64px', 
              fontSize: '0.65rem', 
              padding: '2px 4px', 
              height: '24px', 
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: 'var(--primary)',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
            title={language === 'en' ? 'Playback Speed' : '再生速度'}
          >
            <option value="1" style={{ background: '#0b0f19', color: '#fff' }}>1.00x</option>
            <option value="1.25" style={{ background: '#0b0f19', color: '#fff' }}>1.25x</option>
            <option value="1.5" style={{ background: '#0b0f19', color: '#fff' }}>1.50x</option>
            <option value="2" style={{ background: '#0b0f19', color: '#fff' }}>2.00x</option>
          </select>

          {/* Player controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            
            {/* Rewind Word-by-Word */}
            <button
              onClick={() => handleSeek('rwd')}
              disabled={!isSpeaking}
              className="btn btn-outline"
              style={{ width: '24px', height: '24px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={language === 'en' ? 'Rewind' : '巻き戻し'}
            >
              <Rewind size={10} />
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => speakCurrentStop(tabContent[activeTab])}
              className="btn btn-primary"
              style={{ width: '28px', height: '28px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
              title={isSpeaking && !isPaused ? (language === 'en' ? 'Pause' : '一時停止') : (language === 'en' ? 'Play' : '再生')}
            >
              {isSpeaking && !isPaused ? <Pause size={10} /> : <Play size={10} />}
            </button>

            {/* Fast-Forward Word-by-Word */}
            <button
              onClick={() => handleSeek('fwd')}
              disabled={!isSpeaking}
              className="btn btn-outline"
              style={{ width: '24px', height: '24px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={language === 'en' ? 'Fast-Forward' : '早送り'}
            >
              <FastForward size={10} />
            </button>

            {/* Stop Speech */}
            <button
              onClick={stopSpeechComplete}
              disabled={!activeSpeechText}
              className="btn btn-outline"
              style={{ width: '24px', height: '24px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: activeSpeechText ? 'var(--error)' : 'rgba(255,255,255,0.1)' }}
              title={language === 'en' ? 'Stop' : '停止'}
            >
              <Square size={10} style={{ fill: activeSpeechText ? 'var(--error)' : 'none', color: activeSpeechText ? 'var(--error)' : 'currentColor' }} />
            </button>
          </div>
        </div>

      </div>

      {/* Main Museum Exhibit Display */}
      <div className="exhibit-grid">
        
        {/* Left Column: Audio Guide Transcript & Explanations (The Placard Card) */}
        <div className="placard-panel">
          <div>
            <div className="placard-header">
              <BookOpen size={12} />
              <span>{language === 'en' ? 'Gallery Placard' : '展示説明'}</span>
            </div>
            
            <div className="animate-pop-in">
              <h3 className="placard-title">
                {language === 'en' ? 'The Adjunction Bridge' : '随伴の架け橋'}
              </h3>
              <p className="placard-subtitle">
                {language === 'en' ? 'Unifying notation and meaning via F ⊣ U' : '自由関手と忘却関手による構文と意味の統合'}
              </p>

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

              <div className="placard-text" style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-muted)', minHeight: '140px', whiteSpace: 'pre-line' }}>
                <p>
                  {renderHighlightedText(tabContent[activeTab])}
                </p>
              </div>
            </div>
          </div>

          <div className="placard-footer">
            <span>TNG COOP EXHIBITION</span>
            <span>STATION {currentStop}/6</span>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Exhibit Area (The Kiosk Screen) */}
        <div className="kiosk-panel">
          
          {/* STOP 1: Entrance */}
          {currentStop === 1 && (
            <div className="entrance-display animate-pop-in">
              <div className="entrance-icon-container">
                <Layers size={32} />
              </div>
              <h4>{language === 'en' ? 'Free Generation & Collapse' : '自由生成と崩壊'}</h4>
              <p>
                {language === 'en'
                  ? 'Step inside the interactive exhibits. Click below to enter the Sets gallery room, representing raw mathematical generators.'
                  : '対話型の展示室に入ります。以下をクリックして、生の数学的生成元を表す「集合（Sets）展示室」に進んでください。'
                }
              </p>
              <button onClick={nextStop} className="btn btn-primary">
                {language === 'en' ? 'Enter Sets Gallery' : '集合展示室へ進む'} <ChevronRight size={12} />
              </button>
            </div>
          )}

          {/* STOP 2: The Dawn of Counting (Pebbles & Notches) */}
          {currentStop === 2 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <div className="workspace-title-bar">
                  <h4 className="workspace-title">{language === 'en' ? 'Notch Tally Workspace' : 'ノッチ集計ワークスペース'}</h4>
                  <div className="workspace-controls">
                    <button onClick={addElement} className="btn btn-primary">
                      {language === 'en' ? '+ Carve Notch' : '+ 刻み目を刻む'}
                    </button>
                    <button onClick={clearElements} className="btn btn-secondary" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--error)' }}>
                      {language === 'en' ? 'Clear Notches' : 'ノッチを消去'}
                    </button>
                  </div>
                </div>
                
                <div className="workspace-canvas">
                  {setElements.length === 0 ? (
                    <span className="empty-state">
                      {language === 'en' ? 'No notches carved yet.' : '刻み目がまだありません。'}
                    </span>
                  ) : (
                    setElements.map((e, index) => (
                      <div
                        key={index}
                        className="set-element floating-node"
                        style={{ borderStyle: 'dashed', borderRadius: '4px', width: '2rem', height: '3.5rem', fontFamily: 'monospace' }}
                      >
                        {e.label}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="workspace-footer">
                <span>{language === 'en' ? 'Carve notches freely, then proceed to Room III to collapse them.' : 'ノッチを自由に刻んだら、第3室に進んで数へ折りたたんでください。'}</span>
                <button onClick={nextStop} className="btn btn-primary">
                  {language === 'en' ? 'Go to Collapse' : '崩壊・商化室へ'} <ChevronRight size={10} />
                </button>
              </div>
            </div>
          )}

          {/* STOP 3: Pure Quotient Collapse (Folding words) */}
          {currentStop === 3 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1.5rem' }}>
                  {language === 'en' ? 'Quotient Collapse' : '商化・崩壊'}
                </h4>
                <p className="placard-text" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {language === 'en'
                    ? 'Enter hyphenated tally marks (e.g. I-I-I) or words, and collapse them into a single numeric concept or meaning:'
                    : 'ハイフンで区切られたノッチ（例: I-I-I）や単語を入力し、二項演算（積）によって一つの概念へ崩壊させてください：'
                  }
                </p>
                <form onSubmit={handleCounitCollapse} className="counit-form">
                  <input
                    type="text"
                    value={counitInput}
                    onChange={e => setCounitInput(e.target.value)}
                    placeholder="I-I-I"
                    className="input-text"
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    {language === 'en' ? 'Collapse' : '崩壊させる'}
                  </button>
                </form>

                <div className="workspace-canvas" style={{ minHeight: '120px' }}>
                  {animationState === 'counit' && (
                    <div className="counit-result-box" style={{ width: '100%', border: 'none', background: 'transparent', minHeight: 'auto' }}>
                      {counitResult ? (
                        <span className="counit-val-result flex items-center gap-1.5" style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={16} /> {language === 'en' ? 'Product:' : '評価結果:'} <span className="font-mono text-secondary ml-2 text-base">{counitResult}</span>
                        </span>
                      ) : (
                        <span className="counit-loading-text">
                          {language === 'en' ? 'FOLDING SYNTAX...' : '構文の折りたたみ・商化中...'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STOP 4: The Dual Play */}
          {currentStop === 4 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1rem' }}>
                  {language === 'en' ? 'Dual Play: Inclusion & Evaluation' : '双対の戯れ：包摂と評価'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <button onClick={triggerUnitMap} disabled={setElements.length === 0} className="btn btn-primary text-[9px]">
                    {language === 'en' ? '1. Trigger η_X' : '1. 包摂 (η_X) を実行'}
                  </button>
                  <button onClick={triggerCounitCollapse} className="btn btn-secondary text-[9px]">
                    {language === 'en' ? '2. Trigger ε_M' : '2. 評価 (ε_M) を実行'}
                  </button>
                </div>

                <div className="unit-list" style={{ maxHeight: '140px' }}>
                  {setElements.map((e, index) => (
                    <div key={index} className="unit-row">
                      <span className="unit-val-src">{e.label}</span>
                      <ArrowRight size={12} className="text-text-muted" />
                      <span className="unit-val-target">
                        {animationState === 'unit' ? `[${e.label}]` : '?'}
                      </span>
                      <span className="unit-val-desc" style={{ fontSize: '9px' }}>
                        {animationState === 'unit' 
                          ? (language === 'en' ? 'singleton (η)' : '単一単語 (η)') 
                          : (language === 'en' ? 'raw element' : '生の要素')
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STOP 5: Categories of Sets and Monoids */}
          {currentStop === 5 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1rem' }}>
                  {language === 'en' ? 'Mapping between Categories C and D' : '圏 C と 圏 D の間の写像'}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <button onClick={triggerFreeGeneration} disabled={setElements.length === 0} className="btn btn-primary">
                    {language === 'en' ? 'Apply Functor F' : '関手 F を適用'}
                  </button>
                  <button onClick={triggerForgetfulCollapse} disabled={monoidWords.length === 0} className="btn btn-secondary">
                    {language === 'en' ? 'Apply Functor U' : '関手 U を適用'}
                  </button>
                </div>

                <div className="workspace-canvas">
                  {monoidWords.length === 0 ? (
                    <span className="empty-state">
                      {language === 'en' ? 'No structure. Categories disconnected.' : '構造なし。圏の接続は切断されています。'}
                    </span>
                  ) : (
                    <div className="monoid-words-grid">
                      {monoidWords.map((word, idx) => (
                        <div key={idx} className="monoid-item floating-node">
                          {word}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STOP 6: Adjunction Duality (F ⊣ U) */}
          {currentStop === 6 && (
            <div className="animate-pop-in text-center">
              <div className="bridge-box">
                <div className="bridge-term primary">hom(F(X), M)</div>
                <div className="bridge-iso-symbol">≅</div>
                <div className="bridge-term secondary">hom(X, U(M))</div>
              </div>
              <h4 className="bridge-label">{language === 'en' ? 'Natural Isomorphism Duality' : '自然同型の双対性'}</h4>
              <p className="bridge-text">
                {language === 'en'
                  ? 'Universal property of free monoids. Mapping plain elements to any monoid automatically, uniquely induces a full structure-preserving Monoid Homomorphism out of the Free Monoid.'
                  : '自由モノイドの普遍的性質。構造を持たない集合の要素から他のモノイドへの写像を定義すると、それは自動的かつ一意に自由モノイドからの構造保存準同型写像を誘起します。'
                }
              </p>
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
