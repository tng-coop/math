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
    { id: '1', label: 'x' },
    { id: '2', label: 'y' },
    { id: '3', label: 'z' }
  ]);
  const [monoidWords, setMonoidWords] = useState<string[]>([]);
  const [animationState, setAnimationState] = useState<'idle' | 'free' | 'forget' | 'unit' | 'counit'>('idle');
  const [counitInput, setCounitInput] = useState<string>('x-y-z');
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
      
      // Filter based on active language
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
        window.speechSynthesis.cancel(); // Stop current speech
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
    const labels = ['x', 'y', 'z', 'w', 'u', 'v', 'a', 'b', 'c'];
    const usedLabels = setElements.map(e => e.label);
    const available = labels.filter(l => !usedLabels.includes(l));
    if (available.length === 0) return;
    
    const nextLabel = available[0];
    const newId = (setElements.length + 1).toString();
    setSetElements([...setElements, { id: newId, label: nextLabel }]);
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
        setMonoidWords(['ε (empty)']);
        return;
      }
      
      const generated: string[] = ['ε']; 
      letters.forEach(l => generated.push(`[${l}]`));
      if (letters.length >= 2) {
        for (let i = 0; i < letters.length - 1; i++) {
          generated.push(`[${letters[i]},${letters[i+1]}]`);
        }
      }
      if (letters.length >= 3) {
        generated.push(`[${letters.slice(0, 3).join(',')}]`);
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
    const product = parts.join('');
    setTimeout(() => {
      setCounitResult(product);
    }, 1000);
  };

  // Tour stops definitions
  const tourStops: TourStop[] = language === 'ja' ? [
    {
      id: 1,
      title: "I. 美術館入口：存在論的サイクル",
      subtitle: "数学的実体の絶対的なあり方について。",
      audioText: "随伴存在論ツアーへようこそ。数学はその究極の基盤において、自由生成と、崩壊ないし商化の構造的サイクルそのものです。すべての数学的システムは、最初に記号や要素の空間を自由に生成し、次に同値関係や方程式を課すことでそれを崩壊させることによって構築されます。本ツアーでは、最初にこのサイクルを最も直感的な言葉で体験し、最後に圏論を使った数学的定式化を学びます。",
      explanation: (
        <div className="placard-text">
          <p>
            <strong>存在論（オントロジー）ギャラリー</strong>へようこそ。
          </p>
          <p>
            数学とはその究極の基盤において、<strong>「自由生成 (Free Generation)」</strong>と<strong>「崩壊・商化 (Collapse / Quotienting)」</strong>の構造的サイクルその事です。
          </p>
          <p>
            本ツアーでは、最初にこの絶対的なサイクルを最もシンプルで直感的な言葉で体験したのち、後半の部屋で圏論（カテゴリー論）という数学的言語を用いた定式化を見ていきます。
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "II. 自由生成：純粋な構文の誕生",
      subtitle: "規則を持たず、文字を自由に組み合わせて並べる行為。",
      audioText: "第2ステーション、自由生成。最もシンプルな言葉で言えば、自由生成とは文字や記号を一切の制限やルールなしに自由に並べる行為です。例えば文字x, y, zがあるとき、それらを組み合わせて並べたすべての文字列、つまり、x、y、xy、xyzなどの単語の集まりを作ることができます。これが純粋な構文です。右側のワークスペースで文字を追加し、生成を実行して自由な文字列を作ってみてください。",
      explanation: (
        <div className="placard-text">
          <p>
            最もシンプルな言葉で言えば、<strong>自由生成 (Free Generation)</strong> とは、一切のルールや制限を課さずに、文字や要素を自由に組み合わせて並べる行為です。
          </p>
          <p>
            例えば、文字の集まり <code>{'{'} {setElements.map(e => e.label).join(', ')} {'}'}</code> があるとき、これらから作られるすべての可能な「文字列」（単語のリスト）を書き出します。
          </p>
          <p>
            右側のワークスペースで文字を増やしたり、生成を実行して、 unconstrained（制約のない）な文字列の空間を作ってみてください。
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "III. 商化・崩壊：方程式と評価",
      subtitle: "文字列をルールに従って積へと折りたたむ行為。",
      audioText: "第3ステーション、商化・崩壊。自由に生成された無限の文字列は、ルールや方程式を課すことで、より単純な一つの値へと収縮させることができます。例えば、ハイフンで区切られた文字の列を入力し、それを一つに結合するルールを適用すると、文字列全体が一つの積へと崩壊します。これが「商化」あるいは「Collapse」の概念です。右側で文字列を入力し、崩壊させてみましょう。",
      explanation: (
        <div className="placard-text">
          <p>
            自由に生成された無限の文字列は、ルールや方程式を課すことで、より単純な一つの値へと収縮させることができます。これを<strong>商化・崩壊 (Quotient Collapse)</strong> と呼びます。
          </p>
          <p>
            例えば、バラバラの文字列を入力し、それらを「結合する（積を求める）」という規則を適用すると、文字列全体が一つの積へと畳み込まれます。
          </p>
          <p>
            右側のワークスペースにハイフン区切りの文字を入力して、余分な構文情報が評価されて一つの積へと崩壊する動きを体験してください。
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "IV. 双対の戯れ：包摂と評価のダイナミクス",
      subtitle: "要素を埋め込む単位と、式を折りたたむ余単位。",
      audioText: "第4ステーション、包摂と評価。自由生成と崩壊は、互いに鏡合わせの双対な関係です。要素xをただ一文字の単語へと埋め込む行為ηと、複数の単語の列を掛け合わせて一つの結果へと折りたたむ行為εは、常に連動しています。埋め込みと折りたたみを同時に実行して、その連動を確かめてみましょう。",
      explanation: (
        <div className="placard-text">
          <p>
            自由生成と崩壊は、互いに鏡合わせの<strong>双対な（Dual）関係</strong>にあります。
          </p>
          <p>
            - <strong>包摂（Unit η）</strong>: 生の要素をそのまま一文字の文字列（単語）として式に埋め込む行為。
            <br />
            - <strong>評価（Counit ε）</strong>: 自由に並べられた文字列の羅列を、演算によって実際の値へと折りたたむ（崩壊させる）行為。
          </p>
          <p>
            これらは同じコインの裏表であり、すべての数学的関係はこのダイナミクスから生まれます。
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "V. 定式化：集合とモノイドの圏",
      subtitle: "存在論を定式化するためのオブジェクトと構造の圏。",
      audioText: "第5ステーション、定式化。ここから私たちは数学的枠組みとして圏論を導入します。構造のない生の要素の集まりを集合の圏Cとし、二項演算と単位元を持つ代数的構造をモノイドの圏Dと呼びます。自由生成とは集合をモノイドへ移す関手Fであり、崩壊や忘却とはモノイドから演算を忘れて集合へ戻す関手Uです。ボタンを押して、この2つの領域間の変換を実行してください。",
      explanation: (
        <div className="placard-text">
          <p>
            ここから、この存在論のダイナミクスを数学的に記述するために<strong>圏論 (Category Theory)</strong> を導入します。
          </p>
          <p>
            - <strong>集合の圏 C (Sets)</strong>: 演算を持たない、生の要素 <strong>X</strong> の世界。
            <br />
            - <strong>モノイドの圏 D (Monoids)</strong>: 演算（積）と単位元を持つ、構造化された <strong>M</strong> の世界。
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
      subtitle: "自由生成と崩壊を完璧に統合する自然同型。",
      audioText: "第6ステーション、随伴の対。FがUの左随伴であることを示すこの定式化は、自由モノイドからのモノイド準同型写像の集合と、元の集合からの写像の集合の間に完全な自然同型が存在することを主張します。これにより、私たちの直感的な「自由生成して崩壊させる」存在論的ループが、圏論という究極の言語によって完璧に証明されます。",
      explanation: (
        <div className="placard-text">
          <p>
            私たちの直感的な「自由生成して崩壊させる」存在論的ループは、圏論によって<strong>随伴 (Adjunction)</strong> という形で定式化されます。
          </p>
          <p>
            <strong>F ⊣ U</strong> は、次の自然同型を示します：
            <br />
            <span className="font-mono block text-center py-3 bg-slate-950/60 rounded border border-primary/20 my-3 text-primary text-base shadow-inner">
              hom(F(X), M) ≅ hom(X, U(M))
            </span>
          </p>
          <p>
            これは、自由モノイド上のすべての準同型写像（崩壊のルール）が、元の生の要素 <strong>X</strong> をどこに送るかという単なる写像だけで一意に決定されることを意味します。これが、存在論と数学が完全に一致する瞬間です。
          </p>
        </div>
      )
    }
  ] : [
    {
      id: 1,
      title: "I. Gallery Entrance: The Ontological Cycle",
      subtitle: "The absolute nature of mathematical existence.",
      audioText: "Welcome to the Ontology Museum Tour. At its ultimate foundation, mathematics is the structural cycle of Free Generation and Collapse or Quotienting. Every mathematical system is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations and equations. In this tour, we will explore this cycle in the simplest intuitive terms first, and cover the category-theoretic formalization later.",
      explanation: (
        <div className="placard-text">
          <p>
            Welcome to the <strong>Ontology Gallery</strong>.
          </p>
          <p>
            At its ultimate foundation, mathematics <strong>is</strong> the structural cycle of <strong>Free Generation</strong> and <strong>Collapse / Quotienting</strong>.
          </p>
          <p>
            In this tour, we will first explore this absolute cycle in the simplest, most intuitive terms. In the later rooms, we will look at how Category Theory acts as the formal mathematical language representing this ontology.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "II. Free Generation: Pure Syntax",
      subtitle: "Arranging elements freely without any constraints or equations.",
      audioText: "Stop 2, Free Generation. In the simplest terms, free generation is the act of taking raw symbols or elements and writing down all possible strings or words you can make from them, without imposing any rules or equations. For example, if you have letters x, y, and z, you generate all combinations like x, y, xy, and xyz. This is pure unconstrained syntax. Try adding points and triggering the generation in the workspace.",
      explanation: (
        <div className="placard-text">
          <p>
            In the simplest terms, <strong>Free Generation</strong> is the act of taking raw symbols or elements and writing down all possible strings or words you can make from them, without imposing any rules or equations.
          </p>
          <p>
            For example, if you have the set of letters <code>{'{'} {setElements.map(e => e.label).join(', ')} {'}'}</code>, you generate the space of all combinations like <code>x</code>, <code>y</code>, <code>xy</code>, <code>xyz</code>. This is pure, unconstrained syntax.
          </p>
          <p>
            Try adding points and triggering the generation on the right to see this syntax space form.
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "III. Quotient Collapse: Equations and Semantics",
      subtitle: "Shrinking sequences of elements into single evaluated products.",
      audioText: "Stop 3, Quotient Collapse. Once you have freely generated strings, you can collapse or shrink them under equations or multiplication rules. For example, when you take a string of letters separated by hyphens and collapse it, the extra sequence information is evaluated and folded into a single consolidated product. This is quotient collapse. Try entering a hyphenated string on the right and collapsing it.",
      explanation: (
        <div className="placard-text">
          <p>
            Once you have freely generated strings, you can collapse or shrink them under equations or multiplication rules. We call this <strong>Quotient Collapse</strong>.
          </p>
          <p>
            For example, taking a string of letters and applying a "multiplication" or "concatenation" rule folds the sequence into a single evaluated product.
          </p>
          <p>
            Try entering a hyphenated string on the right (e.g. <code>x-y-z</code>) and collapsing it to see how syntax is reduced to semantic values.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "IV. The Dual Play: Inclusion & Evaluation",
      subtitle: "How embedding single elements and folding strings act in tandem.",
      audioText: "Stop 4, Inclusion and Evaluation. Free generation and collapse are dual mirror images. The inclusion mapping η embeds raw generators into the free string space as singletons, and the evaluation mapping ε collapses sequences of elements into actual values. They are two sides of the same coin.",
      explanation: (
        <div className="placard-text">
          <p>
            Free generation and collapse are dual mirror images of each other:
          </p>
          <p>
            - <strong>Inclusion (Unit η)</strong>: Taking raw elements and embedding them as singleton words in the syntax.
            <br />
            - <strong>Evaluation (Counit ε)</strong>: Collapsing freely generated strings by multiplying them out into actual values.
          </p>
          <p>
            Every mathematical structure and equation arises from this fundamental play.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "V. Formalization: Categories of Sets & Monoids",
      subtitle: "Representing our ontology with objects and structured categories.",
      audioText: "Stop 5, Categories of Sets and Monoids. Now we formalize our intuition. We define Category C as the world of Sets containing raw unstructured elements, and Category D as Monoids containing binary multiplication and identity. Free generation is represented as the Free Functor F, and collapse is represented as the Forgetful Functor U which strips monoids back to raw sets. Use the buttons on the right to navigate between these worlds.",
      explanation: (
        <div className="placard-text">
          <p>
            Now we introduce <strong>Category Theory</strong> to formalize this ontological cycle mathematically.
          </p>
          <p>
            - <strong>Category C (Sets)</strong>: The world of plain elements <strong>X</strong> without algebraic structure.
            <br />
            - <strong>Category D (Monoids)</strong>: The world of structured monoids <strong>M</strong> with associative multiplication and identity.
          </p>
          <p>
            Free generation is modelled as the <strong>Free Functor F</strong> (Left Adjoint), and collapse is modelled as the <strong>Forgetful Functor U</strong> (Right Adjoint).
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "VI. Formalization: The Adjunction Duality (F ⊣ U)",
      subtitle: "The natural isomorphism uniting generation and quotienting.",
      audioText: "Stop 6, The Adjunction Duality. The left adjoint F and right adjoint U form an adjunction. This asserts a natural isomorphism, hom(F(X), M) isomorphic to hom(X, U(M)). This means defining structure-preserving maps out of the free monoid is identical to choosing where the raw elements map. The ontology is complete.",
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
            This states that specifying a homomorphism (collapse rules) out of a free monoid is exactly equivalent to choosing where the raw generators in <strong>X</strong> map. Our intuitive ontological loop is mathematically complete.
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

          {/* STOP 2: Category C Sets (Intuitive Free Generation) */}
          {currentStop === 2 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <div className="workspace-title-bar">
                  <h4 className="workspace-title">{language === 'en' ? 'Set X Workspace' : '集合 X ワークスペース'}</h4>
                  <div className="workspace-controls">
                    <button onClick={addElement} className="btn btn-primary">
                      {language === 'en' ? '+ Add Point' : '+ 要素を追加'}
                    </button>
                    <button onClick={clearElements} className="btn btn-secondary" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--error)' }}>
                      {language === 'en' ? 'Reset Set' : 'リセット'}
                    </button>
                  </div>
                </div>
                
                <div className="workspace-canvas">
                  {setElements.length === 0 ? (
                    <span className="empty-state">
                      {language === 'en' ? 'Set is empty. Add a point!' : '集合が空です。要素を追加してください！'}
                    </span>
                  ) : (
                    setElements.map(e => (
                      <div
                        key={e.id}
                        className="set-element floating-node"
                      >
                        {e.label}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="workspace-footer">
                <span>{language === 'en' ? 'Populate the set and click next to generate structure.' : '集合要素を設定し、次の室に進んで構造を生成してください。'}</span>
                <button onClick={nextStop} className="btn btn-primary">
                  {language === 'en' ? 'Go to Generation' : '生成室へ'} <ChevronRight size={10} />
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
                    ? 'Enter a string of symbols separated by hyphens (e.g. x-y-z) and collapse them under multiplication rules:'
                    : 'ハイフンで区切られた記号の列を入力し、乗法ルールに従って畳み込み崩壊させてください：'
                  }
                </p>
                <form onSubmit={handleCounitCollapse} className="counit-form">
                  <input
                    type="text"
                    value={counitInput}
                    onChange={e => setCounitInput(e.target.value)}
                    placeholder="x-y-z"
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
                          <CheckCircle2 size={16} /> {language === 'en' ? 'Product:' : '積の結果:'} <span className="font-mono text-secondary ml-2 text-base">{counitResult}</span>
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
                  {setElements.map(e => (
                    <div key={e.id} className="unit-row">
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
