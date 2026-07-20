import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Layers, 
  CheckCircle2, Volume2, VolumeX, ChevronLeft, ChevronRight, BookOpen 
} from 'lucide-react';

interface ElementNode {
  id: string;
  label: string;
}

interface TourStop {
  id: number;
  title: string;
  subtitle: string;
  audioText: string;
  explanation: React.ReactNode;
}

export default function AdjunctionVisualizer({ language }: { language: 'en' | 'ja' }) {
  const [currentStop, setCurrentStop] = useState<number>(1);
  const [setElements, setSetElements] = useState<ElementNode[]>([
    { id: '1', label: 'I' },
    { id: '2', label: 'I' },
    { id: '3', label: 'I' }
  ]);
  const [monoidWords, setMonoidWords] = useState<string[]>([]);
  const [animationState, setAnimationState] = useState<'idle' | 'free' | 'forget' | 'unit' | 'counit'>('idle');
  const [counitInput, setCounitInput] = useState<string>('I-I-I');
  const [counitResult, setCounitResult] = useState<string | null>(null);

  // Text-to-Speech (TTS) state
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

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

  // Reset elements labels depending on stop (e.g. notches 'I' for tallying, characters 'x' for alphabet)
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

  // Stop speech when current stop or language changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setActiveSpeechText(null);
    }
  }, [currentStop, language]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakCurrentStop = (text: string) => {
    if ('speechSynthesis' in window) {
      if (activeSpeechText === text) {
        window.speechSynthesis.cancel();
        setActiveSpeechText(null);
      } else {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[\$\{\}\[\]\(\)⊣→≅↦]/g, ' '); 
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.rate = language === 'ja' ? 0.95 : 0.92;
        utterance.pitch = 1.0;

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
        setMonoidWords(currentStop === 2 ? ['0 (empty)'] : ['ε (empty)']);
        return;
      }
      
      const generated: string[] = currentStop === 2 ? ['0'] : ['ε']; 
      if (currentStop === 2) {
        // Tally accumulation words
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
      // Notches collapse to an integer count
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

  // Tour stops definitions
  const tourStops: TourStop[] = language === 'ja' ? [
    {
      id: 1,
      title: "I. 美術館入口：百万年の双対性",
      subtitle: "人類が記法と意味論を通じて存在を発見した物語。",
      audioText: "随伴存在論ツアーへようこそ。数学とはその究極の基盤において、自由生成と、崩壊ないし商化の構造的サイクルそのものです。この二重性は、現代の高度な抽象概念ではなく、実のところ百万年前の人類が認知能力を獲得した黎明期から、脳の中で常に機能し続けてきた仕組みです。本日は、石ころの数え上げから、言語の誕生、そして現代の計算機科学を巡り、最後にこれらが圏論という数学言語でどのように定式化されるかを探求します。",
      explanation: (
        <div className="placard-text">
          <p>
            <strong>存在論（オントロジー）ギャラリー</strong>へようこそ。
          </p>
          <p>
            数学とはその究極の基盤において、<strong>「自由生成 (Free Generation)」</strong>と<strong>「崩壊・商化 (Collapse / Quotienting)」</strong>の構造的サイクルそのものです。
          </p>
          <p>
            この対話的な認知の往復は、現代の数学者が作り出した抽象概念ではありません。百万年前の原始的な数え上げから、言葉の創造、デジタル回路に至るまで、人類の知性の歴史そのものです。
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "II. 数え上げの黎明：石ころと刻み目 (百万年前)",
      subtitle: "無制限に刻み目を打つ「自由生成」と、個数へ折りたたむ「商化」。",
      audioText: "第2ステーション、百万年前の数え上げ。私たちの祖先は、小石を並べたり、骨に刻み目を刻んだりして数量を記録しました。刻み目を打つ行為は、純粋に自由な構文の生成です。しかし、バラバラの刻み目そのものは役に立ちません。これを「5頭のマンモス」や「3日間の移動」という一つの数字や価値へと折りたたんで理解する行為、これこそが最初の商化、つまり collapsed quotienting です。右側で刻み目を増やし、数え上げをシミュレートしてください。",
      explanation: (
        <div className="placard-text">
          <p>
            百万年前、私たちの祖先は小石を集めたり、骨に<strong>刻み目（ノッチ）</strong>を刻み始めました。
          </p>
          <p>
            - <strong>自由生成 (Free Generation)</strong>: ルールを課さずに刻み目 <code>I, I, I, I...</code> を無数に刻んでいく行為。
            <br />
            - <strong>商化・崩壊 (Quotient Collapse)</strong>: バラバラの刻み目たちを、「5頭の獲物」のように一つの概念や数字へと折りたたみ、共通の価値に還元する行為。
          </p>
          <p>
            右側のワークスペースで刻み目 <code>I</code> を増やし、数を表記する構文を生成してみましょう。
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "III. 言語の誕生：アルファベットと意味論 (古代)",
      subtitle: "アルファベットから無限の文を生成し、共通概念へと崩壊させる。",
      audioText: "第3ステーション、言語の誕生。人類は少数の音や文字からなるアルファベットを手に入れました。ここから私たちは無限の言葉や文を自由に紡ぎ出すことができます。これが無制限の構文生成です。しかし、綴りや言い回しが違っても、伝えたい核心的な概念は一つに収縮します。異なった構文が、意味という一つの商集合へと崩壊する。これこそが言語の意味論の正体です。右側で文字列を入力し、崩壊させてみましょう。",
      explanation: (
        <div className="placard-text">
          <p>
            古代、人類は少数の文字（アルファベット）から無限の文や単語を生成する能力を獲得しました。
          </p>
          <p>
            - <strong>自由生成</strong>: 限られた記号を並べて、無数の文字列（構文）を作る行為。
            <br />
            - <strong>商化・崩壊</strong>: 異なる文字の並びや表現を、シノニム（同義語）や「共通の意味」という一つの同値クラスに折りたたむ行為。
          </p>
          <p>
            右側のワークスペースにハイフンで区切った言葉を入力し、構文が意味論（積）へと崩壊する関係を体験してください。
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "IV. アルゴリズムの時代：構文木とコンパイル (現代)",
      subtitle: "コード構文を生成し、コンピューターで評価して値へ崩壊させる。",
      audioText: "第4ステーション、現代の計算機。私たちはプログラムを書くとき、数式やコードの構文木を自由に組み立てます。コンパイラや実行エンジンは、この構文の木を二項演算に従って再帰的に折りたたみ、最終的な実行結果という一つのデータへと崩壊させます。包摂ηは変数を構文に割り当てることであり、評価εはコードを実行することに他なりません。",
      explanation: (
        <div className="placard-text">
          <p>
            現代のコンピューター科学においても、このサイクルは不変です。
          </p>
          <p>
            - <strong>自由生成</strong>: 変数や演算子からプログラムの<strong>抽象構文木 (AST)</strong> を自由に生成する。
            <br />
            - <strong>商化・崩壊</strong>: コンパイラやCPUが二項演算に沿って構文木を評価 (evaluation) し、最終的な出力値へと収縮させる。
          </p>
          <p>
            コードの記述と実行のダイナミクスを、右側のシミュレーターで確認してください。
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "V. 定式化：集合とモノイドの圏",
      subtitle: "人類の認知の往復を、数学的なオブジェクトの接続として記述する。",
      audioText: "第5ステーション、定式化。この百万年の知性の往復を、圏論を用いて正式に定義します。生の刻み目やアルファベットの世界を集合の圏Cとし、結合ルールを持つ体系をモノイドの圏Dと呼びます。自由生成は集合をモノイドにする関手Fであり、崩壊は構造を忘れる関手Uです。ボタンを押して、2つの世界の変換を実行してください。",
      explanation: (
        <div className="placard-text">
          <p>
            人類の百万年の認知の歩みを、数学的枠組みである<strong>圏論 (Category Theory)</strong> を用いて正式に記述します。
          </p>
          <p>
            - <strong>集合の圏 C (Sets)</strong>: 演算を持たない、生の要素 <strong>X</strong> （刻み目、文字、変数）の領域。
            <br />
            - <strong>モノイドの圏 D (Monoids)</strong>: 結合規則を持つ、構造化された <strong>M</strong> （数、単語、計算結果）の領域。
          </p>
          <p>
            自由生成は集合をモノイドへ移す<strong>自由関手 F</strong> であり、崩壊はモノイドから構造を取り除く<strong>忘却関手 U</strong> です。
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "VI. 定式化：随伴 duality (F ⊣ U)",
      subtitle: "自由生成と商化崩壊を完璧に統合する自然同型。",
      audioText: "最終ステーション、随伴。FがUの左随伴であることを示すこの定式化は、自由モノイドからのモノイド準同型写像の集合と、元の集合からの写像の集合の間に完全な自然同型が存在することを証明します。骨の刻み目から始まった人類の認知のループが、随伴という数学の最も美しい橋によって完成します。",
      explanation: (
        <div className="placard-text">
          <p>
            私たちの直感的な「自由生成して崩壊させる」存在論的ループは、圏論によって<strong>随伴 (Adjunction)</strong> という形で統合されます。
          </p>
          <p>
            <strong>F ⊣ U</strong> は、次の自然同型を示します：
            <br />
            <span className="font-mono block text-center py-3 bg-slate-950/60 rounded border border-primary/20 my-3 text-primary text-base shadow-inner">
              hom(F(X), M) ≅ hom(X, U(M))
            </span>
          </p>
          <p>
            これは、すべての collapsed rules（崩壊のルール）が、元の生の要素 <strong>X</strong> をどこに送るかという最初の写像だけで一意に決定されることを意味します。百万年前に小石の山を数え始めた人類の思考の必然が、数学的に証明される瞬間です。
          </p>
        </div>
      )
    }
  ] : [
    {
      id: 1,
      title: "I. Gallery Entrance: The Million-Year Duality",
      subtitle: "How humanity discovered existence through syntax and collapse.",
      audioText: "Welcome to the Ontology Museum Tour. At its ultimate foundation, mathematics is the structural cycle of Free Generation and Collapse or Quotienting. This duality is not a modern abstraction, but a cognitive engine that has operated in the human brain for a million years. Today, we journey from primitive tally marks to ancient language, modern computing, and finally, look at how Category Theory formalizes this loop using adjoint functors.",
      explanation: (
        <div className="placard-text">
          <p>
            Welcome to the <strong>Ontology Gallery</strong>.
          </p>
          <p>
            At its ultimate foundation, mathematics <strong>is</strong> the structural cycle of <strong>Free Generation</strong> and <strong>Collapse / Quotienting</strong>.
          </p>
          <p>
            This interactive loop is not an abstraction invented by modern mathematicians. It is the history of human intelligence itself—stretching from prehistoric tally marks to language creation, digital circuits, and beyond.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "II. The Dawn of Counting: Pebbles and Notches (1M Years Ago)",
      subtitle: "Generating notches freely and collapsing them into numeric quantities.",
      audioText: "Stop 2, Tally Marks. A million years ago, our ancestors recorded quantities by collecting pebbles or carving notches on bones. Making a notch is pure free syntax generation. But raw notches are useless on their own. Collapsing them into a single numeric concept like five mammoths or three days of travel to trade or compare is the first quotient collapse. Try adding notches on the right and collapsing them.",
      explanation: (
        <div className="placard-text">
          <p>
            A million years ago, our ancestors collected pebbles or carved <strong>notches (tally marks)</strong> on bones to record quantities.
          </p>
          <p>
            - <strong>Free Generation</strong>: Carving notches <code>I, I, I, I...</code> freely onto a bone with no constraints.
            <br />
            - <strong>Quotient Collapse</strong>: Folding those discrete marks into a single numeric value (e.g. "5 mammoths") to trade, compare, or share.
          </p>
          <p>
            On the right, add notches <code>I</code> to generate a tally syntax, and click Next to see how we collapse them.
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "III. The Birth of Language: Alphabet & Semantics (Ancient Eras)",
      subtitle: "Generating infinite strings of text and collapsing them into shared meaning.",
      audioText: "Stop 3, Language. Humanity created alphabets with a small set of symbols. From this, we freely generate infinite words and sentences. This is unconstrained syntax. However, many different sentence configurations collapse into the exact same semantic idea or synonym. This is quotient collapse at the core of human communication. Try entering a hyphenated string on the right and collapsing it.",
      explanation: (
        <div className="placard-text">
          <p>
            In ancient eras, humanity created alphabets to generate infinite sentences and text configurations.
          </p>
          <p>
            - <strong>Free Generation</strong>: Arranging a small set of letters to write down infinite sentences (syntax).
            <br />
            - <strong>Quotient Collapse</strong>: Collapsing multiple formulations or synonyms under a single, shared definition (semantics/meaning).
          </p>
          <p>
            Enter a hyphenated word sequence on the right to simulate syntax collapsing into a single semantic product.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "IV. The Algorithmic Era: Syntax Trees & Evaluation (Modern)",
      subtitle: "Generating abstract syntax trees and collapsing them into values.",
      audioText: "Stop 4, Modern Computing. When we write programs, we freely assemble variables and operators into complex syntax trees. The CPU or compiler then collapses this tree using binary operations, reducing it into a single computed output value. Inclusion eta allocates variables, and evaluation epsilon executes the code. Experience this in the simulator.",
      explanation: (
        <div className="placard-text">
          <p>
            Modern computer science follows the exact same cognitive cycle.
          </p>
          <p>
            - <strong>Free Generation</strong>: Assembling code and variables into nested <strong>Abstract Syntax Trees (ASTs)</strong>.
            <br />
            - <strong>Quotient Collapse</strong>: Compiling and executing the code, folding the syntax tree down recursively into a single computed value.
          </p>
          <p>
            Observe this execution loop in the interactive simulator on the right.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "V. Formalization: Categories of Sets & Monoids",
      subtitle: "Representing our cognitive cycle with objects and structured categories.",
      audioText: "Stop 5, Categories. We now formalize this million-year-old journey using Category Theory. The world of raw elements, notches, or variables is represented as Category C of Sets. The world of structured operations, concatenation, or numbers is Category D of Monoids. Functor F generates structure, and Functor U forgets it. Map between them on the right.",
      explanation: (
        <div className="placard-text">
          <p>
            We now introduce <strong>Category Theory</strong> to formalize this cognitive loop mathematically.
          </p>
          <p>
            - <strong>Category C (Sets)</strong>: The world of raw elements <strong>X</strong> (notches, letters, variables) without structure.
            <br />
            - <strong>Category D (Monoids)</strong>: The world of structured objects <strong>M</strong> (counts, words, values) with associative multiplication.
          </p>
          <p>
            Free generation is modelled as the <strong>Free Functor F</strong>, and collapse is modelled as the <strong>Forgetful Functor U</strong>.
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "VI. Formalization: The Adjunction Bridge (F ⊣ U)",
      subtitle: "The natural isomorphism uniting notation and meaning.",
      audioText: "Stop 6, The Adjunction Duality. The left adjoint F and right adjoint U form an adjunction. This asserts a natural isomorphism, hom(F(X), M) isomorphic to hom(X, U(M)). This means defining structure-preserving maps out of the free monoid is identical to choosing where the raw elements map. The million-year-old loop of counting bone notches is mathematically complete.",
      explanation: (
        <div className="placard-text">
          <p>
            The ultimate mathematical formalization of our ontology is the <strong>Adjunction (F ⊣ U)</strong>.
          </p>
          <p>
            It establishes a natural isomorphism:
            <br />
            <span className="font-mono block text-center py-3 bg-slate-950/60 rounded border border-primary/20 my-3 text-primary text-base shadow-inner">
              hom(F(X), M) ≅ hom(X, U(M))
            </span>
          </p>
          <p>
            This states that specifying a collapsed evaluation map out of a free structure is identical to choosing where the raw generators in <strong>X</strong> map. The cognitive circle that began with notch-carving a million years ago is mathematically unified.
          </p>
        </div>
      )
    }
  ];

  const nextStop = () => {
    if (currentStop < tourStops.length) {
      setCurrentStop(currentStop + 1);
    }
  };

  const prevStop = () => {
    if (currentStop > 1) {
      setCurrentStop(currentStop - 1);
    }
  };

  const currentTourStop = tourStops[currentStop - 1];

  const isSpeaking = activeSpeechText === currentTourStop.audioText;

  return (
    <div className="visualizer-container animate-pop-in">
      
      {/* Museum Guide Nav Controller (Audio Guide Device Mock-up) */}
      <div className="audio-guide-player">
        
        {/* Device Brand & Screen */}
        <div className="device-info">
          <div className="device-screen">
            {currentStop}
          </div>
          <div className="device-meta">
            <h4>{language === 'en' ? 'Ontology Audio Guide' : '存在論音声ガイド'}</h4>
            <p>{language === 'en' ? `Station ${currentStop} of ${tourStops.length}` : `ステーション ${currentStop} / ${tourStops.length}`}</p>
          </div>
        </div>

        {/* Dynamic Voice Selection & Playback Controls */}
        <div className="audio-controls-group">
          {voices.length > 0 && (
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="input-text"
              style={{ 
                width: '130px', 
                fontSize: '0.65rem', 
                padding: '2px 6px', 
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

          <div className="audio-wave">
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
            <div className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
          </div>

          <button
            onClick={() => speakCurrentStop(currentTourStop.audioText)}
            className={`btn ${isSpeaking ? 'btn-secondary' : 'btn-primary'}`}
            style={isSpeaking ? { backgroundColor: 'var(--error)', color: 'white', borderColor: 'var(--error)', padding: '4px 12px', height: '24px' } : { padding: '4px 12px', height: '24px' }}
          >
            {isSpeaking ? <VolumeX size={10} /> : <Volume2 size={10} />}
            {isSpeaking ? (language === 'en' ? 'Stop' : '停止') : (language === 'en' ? 'Play' : '再生')}
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="device-nav">
          <button
            onClick={prevStop}
            disabled={currentStop === 1}
            className="btn btn-outline"
            title="Previous Room"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="device-nav-text">
            {language === 'en' ? `ROOM ${currentStop}` : `第 ${currentStop} 室`}
          </span>
          <button
            onClick={nextStop}
            disabled={currentStop === tourStops.length}
            className="btn btn-outline"
            title="Next Room"
          >
            <ChevronRight size={14} />
          </button>
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
            <h3 className="placard-title">
              {currentTourStop.title}
            </h3>
            <p className="placard-subtitle">
              {currentTourStop.subtitle}
            </p>
            {currentTourStop.explanation}
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
                  <h4 className="workspace-title">{language === 'en' ? 'Notch Generator (Syntax)' : 'ノッチ生成子（構文）'}</h4>
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
                  : '自由モノイドの普遍的性質。構造を持たない集合의 要素から他のモノイドへの写像を定義すると、それは自動的かつ一意に自由モノイドからの構造保存準同型写像を誘起します。'
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
