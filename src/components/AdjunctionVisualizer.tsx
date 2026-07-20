import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Layers, RefreshCw, Sparkles, LogOut, 
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

      // Auto-select the best available voice
      const premiumKeywords = language === 'ja'
        ? ['google', 'natural', 'neural', 'online', 'sayaka', 'haruka']
        : ['google', 'natural', 'neural', 'online', 'aria', 'guy'];

      const bestVoice = filteredVoices.find(v => 
        premiumKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
      ) || filteredVoices[0];

      if (bestVoice) {
        setSelectedVoiceName(bestVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [language]);

  // Stop speech when component unmounts or stop/language changes
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
        // Clean mathematical symbols for clear TTS reading
        const cleanText = text.replace(/[\$\{\}\[\]\(\)⊣→≅↦]/g, ' '); 
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Apply selected voice
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) {
          utterance.voice = voice;
        }

        // Adjust rate for premium museum feel
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

  // Tour stops definitions in EN and JP
  const tourStops: TourStop[] = language === 'ja' ? [
    {
      id: 1,
      title: "I. 美術館入口：存在論的サイクル",
      subtitle: "数学的実体の絶対的なあり方について。",
      audioText: "随伴存在論ツアーへようこそ。数学はその究極の基盤において、自由生成と、崩壊ないし商化の構造的サイクルそのものです。すべての数学的システムは、最初に記号や要素の空間を自由に生成し、次に同値関係や方程式を課すことでそれを崩壊させることによって構築されます。圏論は、この存在論的サイクルを随伴関手や単位・余単位として定式化した部分言語に過ぎません。本日は、集合とモノイドの古典的な例を通して、この現実を体験してください。",
      explanation: (
        <div className="placard-text">
          <p>
            <strong>存在論（オントロジー）ギャラリー</strong>へようこそ。 
          </p>
          <p>
            数学とはその究極の基盤において、<strong>「自由生成 (Free Generation)」</strong>と<strong>「崩壊・商化 (Collapse / Quotienting)」</strong>の構造的サイクルそのものです。
          </p>
          <p>
            あらゆる数学的対象は、最初に記号や要素の空間を「自由に生成」し、次に関係や方程式を課して「崩壊させる」ことによって構築されます。圏論（カテゴリー論）は、この普遍的な存在論のダイナミクスを、随伴関手（F ⊣ U）や単位・余単位という形で表現した一形態にすぎません。
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "II. 圏 C：集合の領域",
      subtitle: "演算を持たない離散的な要素の集まり。",
      audioText: "第2ステーション、集合の圏Cです。ここでは代数演算や構造を持たない生身の実体のみを観察します。この集合Xには純粋な生成子のみが含まれています。Add Pointをクリックして点（要素）を追加するか、Resetをクリックしてクリアしてください。",
      explanation: (
        <div className="placard-text">
          <p>
            ここでは<strong>圏 C（集合の圏）</strong>を観察します。この圏のオブジェクトは演算も構造も持ちません。ただの離散的な点の集まりです。
          </p>
          <p>
            この集合を <strong>X</strong> と呼びましょう。現在、X = {'{'} {setElements.map(e => e.label).join(', ')} {'}'} です。
          </p>
          <p>
            操作パネルで要素を追加したりリセットしたりして、構造のない純粋な数学的素材を体験してください。
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "III. 圏 D：構造の領域",
      subtitle: "自由モノイドと文字列の結合演算。",
      audioText: "第3ステーション、モノイドの圏Dです。集合とは異なり、モノイドは二項演算と単位元を含みます。集合Xから自由モノイドF(X)を自由に生成できます。Generate Structureをクリックして自由関手Fを適用し、文字を結合したすべての有限語の集合を生成してください。",
      explanation: (
        <div className="placard-text">
          <p>
            ここから<strong>圏 D（モノイドの圏）</strong>に入ります。モノイドは二項演算（積）と単位元（ε）を持ちます。
          </p>
          <p>
            <strong>自由関手 F</strong> (左随伴) は、構造のない集合 <strong>X</strong> から、すべての有限列（単語）の集合である自由モノイド <strong>F(X)</strong> を生成します。
          </p>
          <p>
            操作ボタンでこの代数的構造を生成したり、<strong>忘却関手 U</strong> (右随伴) を適用して演算を取り除き、再び集合へと崩壊させてみましょう。
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "IV. 随伴の橋渡し (F ⊣ U)",
      subtitle: "存在論の表現言語としての圏論。",
      audioText: "第4ステーション、随伴の双対性です。左随伴Fと右随伴Uは、FがUの左随伴であることを示します。これは自由モノイドからのモノイド準同型写像の集合と、生成元の集合からの単なる写像の集合の間に自然な同型が存在することを主張します。準同型を定義することは、生成元をどこに送るかを選ぶことと完全に等価です。",
      explanation: (
        <div className="placard-text">
          <p>
            存在論の定式化としての<strong>左随伴と右随伴の対（F ⊣ U）</strong>。
          </p>
          <p>
            これは以下の自然同型を確立します：
            <br />
            <span className="font-mono block text-center py-3 bg-slate-950/60 rounded border border-primary/20 my-3 text-primary text-base shadow-inner">
              hom(F(X), M) ≅ hom(X, U(M))
            </span>
          </p>
          <p>
            これは、自由モノイド <strong>F(X)</strong> から他のモノイドへの構造を保つ「準同型写像」を定義することは、単に生成元 <strong>X</strong> がどこに写るかを決めることと完全に等価であることを意味します。
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "V. 包摂の部屋：単位 (η)",
      subtitle: "要素を単一単語として埋め込む。",
      audioText: "第5ステーション、随伴の単位イータです。任意の集合Xに対して、単位は集合Xから自由モノイドの台集合への自然な写像です。各要素xをそれ自身のみからなる単語として埋め込みます。ボタンを押してその埋め込みを実行してください。",
      explanation: (
        <div className="placard-text">
          <p>
            随伴の<strong>単位 η_X : X → U(F(X))</strong> は、包摂（含み入れ）を表す自然変換です。
          </p>
          <p>
            集合の各要素 <strong>x ∈ X</strong> を、自由モノイドの要素である一文字の単語 <strong>[x]</strong> へと標準的に対応させます。
          </p>
          <p>
            単位マッピングを実行し、その対応関係を視覚的に確かめてください。
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "VI. 商化・崩壊の部屋：余単位 (ε)",
      subtitle: "同値関係の下で構文を積へと折りたたむ。",
      audioText: "第6ステーション、余単位エプシロンです。これは、自由に生成された構文が評価されて値へと崩壊する商化アクションを表します。モノイドMに対して、余単位は自由に生成されたモノイド要素の列をモノイドの演算を使って実際の積へと畳み込む準同型写像です。",
      explanation: (
        <div className="placard-text">
          <p>
            随伴の<strong>余単位 ε_M : F(U(M)) → M</strong> は、評価または崩壊（商化）を表す自然変換です。
          </p>
          <p>
            自由に生成されたモノイド要素の並び（構文）を、実際のモノイドの乗法を使って一つの要素へと畳み込みます。
          </p>
          <p>
            ハイフンで区切られた列（例：<code>a-b-c</code>）を入力し、余単位による崩壊を実行して、演算が実行される様子を観察してください。
          </p>
        </div>
      )
    }
  ] : [
    {
      id: 1,
      title: "I. Gallery Entrance: The Ontological Cycle",
      subtitle: "The absolute nature of mathematical existence.",
      audioText: "Welcome to the Ontology Museum Tour. At its ultimate foundation, mathematics is the structural cycle of Free Generation and Collapse or Quotienting. Every mathematical system is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations and equations. Category Theory is just a part of this, acting as the formal language that represents this ontological cycle. Today, we explore this reality through the classic example of Sets and Monoids.",
      explanation: (
        <div className="placard-text">
          <p>
            Welcome to the <strong>Ontology Gallery</strong>. 
          </p>
          <p>
            At its ultimate foundation, mathematics <strong>is</strong> the structural cycle of <strong>Free Generation</strong> and <strong>Collapse / Quotienting</strong>.
          </p>
          <p>
            Every mathematical object is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations, equations, and quotients. Category Theory is just one formal language that models this ontological duality (through adjoint functors F ⊣ U and the unit and counit).
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "II. Category C: The Sets Domain",
      subtitle: "Plain elements without any operations.",
      audioText: "Stop 2, Category C representing Sets. Here we observe raw entities with no algebraic operations or structural relationships. This set X contains only plain generators. You can click Add Point to populate the set, or Reset to clear it.",
      explanation: (
        <div className="placard-text">
          <p>
            Here we observe Category <strong>C (Sets)</strong>. Elements in this category have no operations, no structures, and no connections. They are raw, discrete points.
          </p>
          <p>
            Let's call this set <strong>X</strong>. Currently, X = {'{'} {setElements.map(e => e.label).join(', ')} {'}'}.
          </p>
          <p>
            In the interactive canvas, you can add raw points or reset the set to experience pure unstructured math.
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: "III. Category D: The Realm of Structure",
      subtitle: "Free Monoids and string concatenation.",
      audioText: "Stop 3, Category D representing Monoids. Unlike sets, monoids contain a binary operation and an identity element. We can freely generate a monoid F(X) from our set X. Click Generate Structure to apply the Free Functor F. This creates all possible finite words over our set elements, where the monoid operation is string concatenation.",
      explanation: (
        <div className="placard-text">
          <p>
            We cross over into Category <strong>D (Monoids)</strong>. Monoids contain a binary operation (multiplication) and an identity element (ε).
          </p>
          <p>
            The <strong>Free Functor F</strong> (Left Adjoint) takes our raw set <strong>X</strong> and generates the free monoid <strong>F(X)</strong> containing all finite lists/words.
          </p>
          <p>
            Click the buttons on the workspace to generate this algebraic structure, or collapse it back using the <strong>Forgetful Functor U</strong> (Right Adjoint) to strip the multiplication.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "IV. The Formal Adjunction Bridge (F ⊣ U)",
      subtitle: "Category Theory as a formal language for ontology.",
      audioText: "Stop 4, The Adjunction Duality. The Left Adjoint F and Right Adjoint U form an adjunction, denoted F adjoint to U. This asserts a natural isomorphism between the set of monoid homomorphisms out of a free monoid, and the set of plain mappings out of its underlying set of generators. Defining a homomorphism is exactly equivalent to choosing where the raw generators go.",
      explanation: (
        <div className="placard-text">
          <p>
            The formalization of our ontology: <strong>F is Left Adjoint to U (F ⊣ U)</strong>.
          </p>
          <p>
            This establishes a natural isomorphism:
            <br />
            <span className="font-mono block text-center py-3 bg-slate-950/60 rounded border border-primary/20 my-3 text-primary text-base shadow-inner">
              hom(F(X), M) ≅ hom(X, U(M))
            </span>
          </p>
          <p>
            This means that specifying a structure-preserving monoid homomorphism out of a free monoid <strong>F(X)</strong> is exactly equivalent to choosing where the raw set generators in <strong>X</strong> should map.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "V. Room of Free Inclusion: The Unit (η)",
      subtitle: "Embedding elements as singletons.",
      audioText: "Stop 5, The Adjunction Unit, denoted eta. For any set X, the unit is a natural mapping from X to the underlying set of the free monoid. It embeds each raw element x as a singleton word, containing just that element. Click the unit map button to see the injection in action.",
      explanation: (
        <div className="placard-text">
          <p>
            The Adjunction Unit <strong>η_X : X → U(F(X))</strong> is a natural transformation representing insertion/inclusion.
          </p>
          <p>
            It maps each raw element <strong>x ∈ X</strong> to its singleton word representation <strong>[x]</strong> in the underlying set of the free monoid.
          </p>
          <p>
            Click the Unit mapping visualizer to observe the canonical injection.
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "VI. Room of Quotient Collapse: The Counit (ε)",
      subtitle: "Collapsing syntax under equivalence relations.",
      audioText: "Stop 6, The Adjunction Counit, denoted epsilon. It represents the quotienting action where freely generated syntax collapses into evaluated values. For any Monoid M, the Counit is a monoid homomorphism that collapses a freely generated word of monoid elements into their actual product in M. Enter a hyphenated word in the evaluator and click collapse to see the product evaluate.",
      explanation: (
        <div className="placard-text">
          <p>
            The Adjunction Counit <strong>ε_M : F(U(M)) → M</strong> is a natural transformation representing evaluation or collapse.
          </p>
          <p>
            It takes a freely generated word of monoid elements and collapses it into their actual product using the Monoid's binary operation.
          </p>
          <p>
            Input a hyphenated sequence (e.g. <code>a-b-c</code>) in the evaluator and trigger the Counit collapse to evaluate the product.
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

          {/* STOP 2: Category C Sets */}
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
                <span>{language === 'en' ? 'Populate the set and proceed to the Monoid gallery room.' : '集合要素を設定し、モノイド展示室へと進んでください。'}</span>
                <button onClick={nextStop} className="btn btn-secondary">
                  {language === 'en' ? 'Go to Monoids' : 'モノイドへ'} <ChevronRight size={10} />
                </button>
              </div>
            </div>
          )}

          {/* STOP 3: Category D Monoids */}
          {currentStop === 3 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1.5rem' }}>
                  {language === 'en' ? 'Free Monoid F(X) Workspace' : '自由モノイド F(X) ワークスペース'}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <button
                    onClick={triggerFreeGeneration}
                    disabled={setElements.length === 0}
                    className="btn btn-primary"
                  >
                    {language === 'en' ? 'Apply Free Functor (F)' : '自由関手 (F) を適用'} <Sparkles size={12} />
                  </button>
                  <button
                    onClick={triggerForgetfulCollapse}
                    disabled={monoidWords.length === 0}
                    className="btn btn-secondary"
                  >
                    {language === 'en' ? 'Apply Forgetful (U)' : '忘却関手 (U) を適用'} <LogOut size={12} />
                  </button>
                </div>

                <div className="workspace-canvas">
                  {animationState === 'free' && monoidWords.length === 0 && (
                    <div className="animate-spin" style={{ color: 'var(--primary)' }}>
                      <RefreshCw size={20} />
                    </div>
                  )}
                  {monoidWords.length === 0 && animationState !== 'free' && (
                    <span className="empty-state">
                      {language === 'en' ? 'Structure collapsed. Apply F to generate monoids.' : '構造が崩壊しました。Fを適用してモノイドを生成してください。'}
                    </span>
                  )}
                  {monoidWords.length > 0 && (
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

          {/* STOP 4: Adjunction Bridge */}
          {currentStop === 4 && (
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

          {/* STOP 5: Unit η */}
          {currentStop === 5 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1.5rem' }}>
                  {language === 'en' ? 'Unit Mapping (η_X) Simulation' : '単位マッピング (η_X) シミュレーション'}
                </h4>
                <p className="placard-text" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {language === 'en'
                    ? 'Click below to inject the Set generators into the free monoid as singleton words:'
                    : '集合の生成元を、自由モノイド内の一文字の単語（単一単語）として包摂・埋め込みます：'
                  }
                </p>
                <button
                  onClick={triggerUnitMap}
                  disabled={setElements.length === 0}
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '1.5rem' }}
                >
                  {language === 'en' ? 'Trigger η_X Mapping' : '単位射 (η_X) を実行'}
                </button>

                <div className="unit-list">
                  {setElements.map(e => (
                    <div key={e.id} className="unit-row">
                      <span className="unit-val-src">{e.label}</span>
                      <ArrowRight size={12} className="text-text-muted" />
                      <span className="unit-val-target">
                        {animationState === 'unit' ? `[${e.label}]` : '?'}
                      </span>
                      <span className="unit-val-desc">
                        {animationState === 'unit' 
                          ? (language === 'en' ? 'singleton word' : '単一単語') 
                          : (language === 'en' ? 'awaiting mapping' : 'マッピング待機中')
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STOP 6: Counit ε */}
          {currentStop === 6 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1.5rem' }}>
                  {language === 'en' ? 'Quotient Collapse (ε_M)' : '商化・崩壊 (ε_M)'}
                </h4>
                <p className="placard-text" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {language === 'en'
                    ? 'Enter a string of monoid elements separated by hyphens and click to collapse/evaluate their binary product:'
                    : 'ハイフンで区切られた自由モノイド要素の列を入力し、実際の演算（乗法）によって積へと畳み込みます：'
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
                    {language === 'en' ? 'Collapse (ε_M)' : '崩壊させる'}
                  </button>
                </form>

                {animationState === 'counit' && (
                  <div className="counit-result-box">
                    {counitResult ? (
                      <span className="counit-val-result flex items-center gap-1.5" style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} /> {language === 'en' ? 'Evaluation Product:' : '積の計算結果:'} <span className="font-mono text-secondary ml-2 text-base">{counitResult}</span>
                      </span>
                    ) : (
                      <span className="counit-loading-text">
                        {language === 'en' ? 'FOLDING SYNTAX TREES...' : '構文関係の畳み込み・商化中...'}
                      </span>
                    )}
                  </div>
                )}
              </div>
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
