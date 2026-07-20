import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Play, Pause, Square, 
  FastForward, Rewind, ChevronRight, CheckCircle2,
  Info
} from 'lucide-react';

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

// Types for objects, elements and morphisms
type CatObject = 'A' | 'B' | 'C';

export default function Hall10Visualizer({ language }: { language: 'en' | 'ja' }) {
  // Tour stop state: room 1 to 5
  const getInitialRoom = (): number => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const room = parseInt(params.get('room') || '1', 10);
      return (room >= 1 && room <= 5) ? room : 1;
    }
    return 1;
  };

  const [currentStop, setCurrentStop] = useState<number>(getInitialRoom);

  // Synchronize room state with URL query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('room') !== currentStop.toString()) {
        params.set('room', currentStop.toString());
        const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [currentStop]);

  // Yoneda state
  const [representingObj, setRepresentingObj] = useState<CatObject>('A');
  const [selectedU, setSelectedU] = useState<string>('a1'); // u in X(R)
  const [hoveredAElement, setHoveredAElement] = useState<string | null>(null);

  // Commutative Diagram Animation states
  const [selectedMorphism, setSelectedMorphism] = useState<string>('f');
  const [animating, setAnimating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [burst, setBurst] = useState<boolean>(false);

  // Text-to-Speech (TTS) states
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Functor X sets and maps definition
  const X_sets: Record<CatObject, string[]> = {
    A: ['a1', 'a2', 'a3'],
    B: ['b1', 'b2'],
    C: ['c1', 'c2', 'c3']
  };

  // Maps for morphisms
  const applyX_f = (element: string): string => {
    if (element === 'a1') return 'b1';
    if (element === 'a2') return 'b2';
    return 'b1'; // a3 -> b1
  };

  const applyX_g = (element: string): string => {
    if (element === 'b1') return 'c1';
    return 'c2'; // b2 -> c2
  };

  const applyX_h = (element: string): string => {
    // X(h) = X(g) o X(f)
    return applyX_g(applyX_f(element));
  };

  const applyX_id = (element: string): string => {
    return element;
  };

  // Helper to map morphism name to function
  const applyX = (morphism: string, element: string): string => {
    if (morphism === 'f') return applyX_f(element);
    if (morphism === 'g') return applyX_g(element);
    if (morphism === 'h') return applyX_h(element);
    return applyX_id(element);
  };

  // Get valid morphisms in Hom(R, Y)
  const getHomSet = (R: CatObject, Y: CatObject): string[] => {
    if (R === 'A') {
      if (Y === 'A') return ['1_A'];
      if (Y === 'B') return ['f'];
      if (Y === 'C') return ['h'];
    } else if (R === 'B') {
      if (Y === 'A') return [];
      if (Y === 'B') return ['1_B'];
      if (Y === 'C') return ['g'];
    } else if (R === 'C') {
      if (Y === 'A') return [];
      if (Y === 'B') return [];
      if (Y === 'C') return ['1_C'];
    }
    return [];
  };

  // Reset default selected element u when representing object changes
  useEffect(() => {
    if (representingObj === 'A') {
      setSelectedU('a1');
      setSelectedMorphism('f');
    } else if (representingObj === 'B') {
      setSelectedU('b1');
      setSelectedMorphism('g');
    } else {
      setSelectedU('c1');
      setSelectedMorphism('1_C');
    }
    setAnimating(false);
    setProgress(0);
    setBurst(false);
  }, [representingObj]);

  // Adjust selected morphism if it is invalid for the new representing object
  useEffect(() => {
    const validMorphisms = representingObj === 'A' ? ['f', 'h'] 
                          : representingObj === 'B' ? ['g'] 
                          : ['1_C'];
    if (!validMorphisms.includes(selectedMorphism)) {
      setSelectedMorphism(validMorphisms[0]);
    }
    setAnimating(false);
    setProgress(0);
    setBurst(false);
  }, [representingObj, selectedMorphism]);

  // Commutative diagram particle animation driver
  useEffect(() => {
    if (!animating) return;
    setProgress(0);
    setBurst(false);
    let startTime = performance.now();
    const duration = 2500; // 2.5 seconds
    let frameId: number;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);
      if (p < 100) {
        frameId = requestAnimationFrame(update);
      } else {
        setBurst(true);
        setAnimating(false);
        setTimeout(() => setBurst(false), 800);
      }
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [animating]);

  // Speech synthesis configuration
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

  // Speech Synthesis player helper
  useEffect(() => {
    stopSpeechComplete();
  }, [currentStop, language]);

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

      // Filter math symbols for smoother speech synthesis output
      const cleanText = ", " + sliceText.replace(/[\$\{\}\[\]\(\)⊣→≅↦ηε\_\Rightarrow]/g, ' '); 
      const utterance = new SpeechSynthesisUtterance(cleanText);
      activeUtteranceRef = utterance;
      
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) {
        utterance.voice = voice;
      }

      const baseRate = language === 'ja' ? 0.98 : 0.95;
      utterance.rate = baseRate * speedMultiplier;
      utterance.pitch = 1.05;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const adjustedCharIdx = event.charIndex - 2;
          if (adjustedCharIdx >= 0) {
            setCurrentCharIndex(startIndex + adjustedCharIdx);
          }
        }
      };

      utterance.onend = () => {
        setTimeout(() => {
          if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
            stopSpeechComplete();
          }
        }, 80);
      };

      utterance.onerror = () => {
        stopSpeechComplete();
      };

      window.speechSynthesis.speak(utterance);
      setActiveSpeechText(text);
      setIsPaused(false);
      setCurrentCharIndex(startIndex);
    }, 80);
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
    if (targetWord) {
      startSpeech(activeSpeechText, targetWord.start);
    }
  };

  const getSpokenWords = (text: string, lang: 'en' | 'ja'): SpokenWord[] => {
    const words: SpokenWord[] = [];
    if (lang === 'ja') {
      for (let i = 0; i < text.length; i++) {
        words.push({ text: text[i], start: i, end: i + 1 });
      }
    } else {
      const wordRegex = /[a-zA-Z0-9'’→≅↦\_\:\,\Rightarrow\(\)\{\}\.\-]+/g;
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
    if (currentStop < 5) {
      setCurrentStop(currentStop + 1);
    }
  };

  const prevStop = () => {
    if (currentStop > 1) {
      setCurrentStop(currentStop - 1);
    }
  };

  // Room Stops explanations
  const tourStops: TourStop[] = language === 'ja' ? [
    {
      id: 1,
      title: "I. 関係性としての存在",
      subtitle: "対象の「中身」ではなく「関係」によって本質を記述する。",
      text: "現代数学の画期的な洞察は「対象そのものの本質は、他のすべてのものとの関係性の全体によって完全に規定される」という点にあります。この展示では、3つの対象 A, B, C とその間の射（恒等射 1_A, 1_B, 1_C、f: A -> B、g: B -> C、および合成 h = g o f: A -> C）からなる小さな圏 C を考えます。任意の対象をクリックして「基準点（表現対象）」に指定し、そこから広がる関係性のネットワークを探検しましょう。"
    },
    {
      id: 2,
      title: "II. 表現可能関手 h_A = Hom(A, -)",
      subtitle: "選択した対象 A から、他の対象への「接続ベクトル」を収集する。",
      text: "対象 A が圏の他の対象とどのように繋がっているかを測るために、表現可能関手 h_A = Hom(A, -) を定義します。この関手は、任意の対象 Y に対して、A から Y へのすべての射の集合である Hom 集合 Hom(A, Y) を割り当てます。A を表現対象とすると、h_A(A) = {1_A}、h_A(B) = {f}、h_A(C) = {h} となり、他の対象への道筋が完全にリストアップされます。対象をクリックして変更すると、このレーダー波のような集合が動的に変化します。"
    },
    {
      id: 3,
      title: "III. 集合値関手 X: C -> Set",
      subtitle: "圏 C を、要素と関数からなる具体的な集合の世界に射影する。",
      text: "抽象的な圏 C を具体化するため、別の関手 X: C -> Set を考えます。これは各対象 Y を具体的な要素の集合 X(Y) へ写し、各射を集合間の関数へ写します。ここでは、X(A) = {a1, a2, a3}、X(B) = {b1, b2}、X(C) = {c1, c2, c3} と定義します。射 f, g はそれぞれ要素をマッピングする関数になり、合成 h の挙動は X(h) = X(g) o X(f) として厳密に計算されます。要素にホバーして関数の挙動を確認できます。"
    },
    {
      id: 4,
      title: "IV. 米田の同型：Nat(h_A, X) ≅ X(A)",
      subtitle: "X(A) から1つの要素 u を選ぶだけで、全宇宙への自然変換が決まる。",
      text: "米田の補題の核心は次の同型です：自然変換 alpha: h_A => X の全体は、集合 X(A) の要素 u と完全に1対1対応します。つまり、X(A) の中から代表点 u を1つ指定するだけで、圏全体の Hom 集合から X の集合へと渡るすべての関数 alpha_Y: Hom(A, Y) -> X(Y) が一意にロックされます！その規則は極めて単純で、任意の射 m に対して alpha_Y(m) = X(m)(u) です。X(A) の要素をクリックして u を選択し、発生する矢印を確認してください。"
    },
    {
      id: 5,
      title: "V. 自然性の可換正方形 (Commutative Square)",
      subtitle: "２本の経路が同じ地点に到達し、構造の整合性を証明する。",
      text: "自然変換としての整合性を検証するため、任意の射（例：f: A -> B）に対する「自然性の可換正方形」を見てみましょう。h_A(A) にある恒等射 1_A から出発して、「右に行ってから下に行く経路（射 f_* を経て alpha_B にマップされる）」と、「下に行ってから右に行く経路（alpha_A により u にマップされてから X(f) で送られる）」は、X(B) の全く同一の要素に到着します。アニメーションを再生して、2つの光の粒子が完全に合流する様子を確認してください。"
    }
  ] : [
    {
      id: 1,
      title: "I. Existence as Relation",
      subtitle: "An object is defined not by its internal substance, but by its relations.",
      text: "A profound insight of modern mathematics is that the identity of an object is completely determined by its network of relations with other objects. Here, we define a small category C with three objects: A, B, and C, containing identity morphisms, f: A -> B, g: B -> C, and the composite h = g o f: A -> C. Click on any object in the diagram to designate it as our 'representing object' (representing point) and see the relational network."
    },
    {
      id: 2,
      title: "II. The Representable Functor h_A = Hom(A, -)",
      subtitle: "Probing the category from the viewpoint of A to collect outgoing arrows.",
      text: "To measure how the category looks from a chosen representing object A, we construct the representable functor h_A = Hom(A, -). For each target object Y, this functor returns the Hom-set Hom(A, Y) consisting of all morphisms from A to Y. When A is the representing object, h_A(A) = {1_A}, h_A(B) = {f}, and h_A(C) = {h}. Changing the representing object updates these sets dynamically, acting as a relational radar."
    },
    {
      id: 3,
      title: "III. The Set-Valued Functor X: C -> Set",
      subtitle: "Projecting the abstract category C into concrete sets and functions.",
      text: "To ground our analysis, we introduce another functor X: C -> Set, mapping each object Y to a concrete set X(Y), and each morphism to a function. We define X(A) = {a1, a2, a3}, X(B) = {b1, b2}, and X(C) = {c1, c2, c3}. The maps are functions: X(f) maps a1 -> b1, a2 -> b2, a3 -> b1; X(g) maps b1 -> c1, b2 -> c2; and functoriality dictates that the composite X(h) must equal X(g) o X(f). Hover over elements to trace the mappings."
    },
    {
      id: 4,
      title: "IV. Yoneda Isomorphism: Nat(h_A, X) ≅ X(A)",
      subtitle: "Selecting a single element u in X(A) uniquely generates a natural transformation.",
      text: "The Yoneda Lemma establishes a bijection between natural transformations alpha: h_A => X and elements in the set X(A). By picking a single seed element u in X(A), you uniquely determine the entire natural transformation! For any morphism m in Hom(A, Y), the component alpha_Y maps m to X(m)(u) in X(Y). Select an element u in X(A) by clicking it, and watch the entire natural transformation mapping update in real time."
    },
    {
      id: 5,
      title: "V. The Commutative Naturality Square",
      subtitle: "Verifying structural consistency along two different compositional paths.",
      text: "To witness naturality in action, we analyze the commuting square for a morphism (e.g. f: A -> B). Starting with the identity 1_A in h_A(A), we can travel via two paths: either map right via f_* to f, then down via alpha_B to alpha_B(f); or map down via alpha_A to u, then right via X(f) to X(f)(u). Both paths land on the exact same element in X(B). Trigger the animation to watch the particles merge, proving the diagram commutes."
    }
  ];

  const currentTourStop = tourStops[currentStop - 1];
  const isSpeaking = activeSpeechText === currentTourStop.text;

  // Calculate image for a morphism under alpha
  // alpha_Y(m) = X(m)(u)
  const getAlphaMapping = (_Y: CatObject, morphism: string): string => {
    return applyX(morphism, selectedU);
  };

  // Determine Roman numerals for navigation tabs
  const getRoman = (num: number): string => {
    return ['I', 'II', 'III', 'IV', 'V'][num - 1];
  };

  return (
    <div className="visualizer-container animate-pop-in" style={{ height: '100%', width: '100%' }}>
      {/* Exhibit Header / Room Tabs */}
      <nav className="room-nav-tabs">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => {
          const isActive = currentStop === num;
          const roman = getRoman(num);
          return (
            <button
              key={num}
              onClick={() => setCurrentStop(num)}
              className={`room-tab-btn ${isActive ? 'active' : ''}`}
            >
              <span className="room-tab-num">{roman}</span>
              <span className="room-tab-title">
                {language === 'en' 
                  ? ['Relational C', 'Hom-Sets (h_A)', 'Target Functor X', 'Yoneda Bijection', 'Naturality Square'][num - 1]
                  : ['関係性の圏 C', 'Hom集合 (h_A)', '対象関手 X', '米田の同型', '自然性の可換性'][num - 1]
                }
              </span>
            </button>
          );
        })}
      </nav>

      {/* Audio Guide Device Widget */}
      <div className="audio-guide-player">
        <div className="device-info">
          <div className="device-screen" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
            {isSpeaking ? 'ON' : 'OFF'}
          </div>
          <div className="device-meta">
            <h4>{language === 'en' ? 'Yoneda Exhibit Audio Guide' : '米田の補題 音声解説ガイド'}</h4>
            <p>{language === 'en' ? 'STOP #' + getRoman(currentStop) : '解説スポット #' + getRoman(currentStop)}</p>
          </div>
        </div>

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
            <option value="1.8" style={{ background: '#0b0f19', color: '#fff' }}>1.80x</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => handleSeek('rwd')}
              disabled={!isSpeaking}
              className="btn btn-outline"
              style={{ width: '24px', height: '24px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={language === 'en' ? 'Rewind' : '巻き戻し'}
            >
              <Rewind size={10} />
            </button>

            <button
              onClick={() => speakCurrentStop(currentTourStop.text)}
              className="btn btn-primary"
              style={{ width: '28px', height: '28px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
              title={isSpeaking && !isPaused ? (language === 'en' ? 'Pause' : '一時停止') : (language === 'en' ? 'Play' : '再生')}
            >
              {isSpeaking && !isPaused ? <Pause size={10} /> : <Play size={10} />}
            </button>

            <button
              onClick={() => handleSeek('fwd')}
              disabled={!isSpeaking}
              className="btn btn-outline"
              style={{ width: '24px', height: '24px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={language === 'en' ? 'Fast-Forward' : '早送り'}
            >
              <FastForward size={10} />
            </button>

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

      {/* Main Exhibit Grid */}
      <div className="exhibit-grid">
        
        {/* Left Side: Placard explanation */}
        <div className="placard-panel">
          <div>
            <div className="placard-header">
              <BookOpen size={12} />
              <span>{language === 'en' ? 'Exhibit Placard' : '展示解説パネル'}</span>
            </div>

            <div className="animate-pop-in">
              <h3 className="placard-title">{currentTourStop.title}</h3>
              <p className="placard-subtitle">{currentTourStop.subtitle}</p>
              
              <div className="placard-text" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                {renderHighlightedText(currentTourStop.text)}
              </div>

              {/* Extra context / interactive prompt depending on current stop */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.1)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <Info size={12} />
                  {language === 'en' ? 'Exhibit State Dashboard' : '展示ステータス'}
                </span>
                
                <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>{language === 'en' ? 'Representing Object R: ' : '表現対象 R: '}</span>
                    <strong style={{ color: 'var(--secondary)' }}>{representingObj}</strong>
                    <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: '0.5rem' }}>|</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{language === 'en' ? 'Selected Seed u: ' : '種要素 u: '}</span>
                    <strong style={{ color: 'var(--accent)' }}>{selectedU} ∈ X({representingObj})</strong>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{language === 'en' ? 'Induced Nat Transformation α: ' : '誘起された自然変換 α: '}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      {getHomSet(representingObj, 'A').map(m => (
                        <span key={m} style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          α_A({m}) = {getAlphaMapping('A', m)}
                        </span>
                      ))}
                      {getHomSet(representingObj, 'B').map(m => (
                        <span key={m} style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          α_B({m}) = {getAlphaMapping('B', m)}
                        </span>
                      ))}
                      {getHomSet(representingObj, 'C').map(m => (
                        <span key={m} style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          α_C({m}) = {getAlphaMapping('C', m)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="placard-footer" style={{ borderTop: '1px solid rgba(212,175,55,0.1)', paddingTop: '1rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={prevStop} 
              disabled={currentStop === 1}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.65rem' }}
            >
              {language === 'en' ? 'Previous Stop' : '前のスポット'}
            </button>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
              {currentStop} / 5
            </span>
            <button 
              onClick={nextStop} 
              disabled={currentStop === 5}
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.65rem' }}
            >
              {language === 'en' ? 'Next Stop' : '次のスポット'}
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Visualizations (Kiosk Panel) */}
        <div className="kiosk-panel" style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
          
          {/* Stop 1: Category C representation */}
          {currentStop === 1 && (
            <div className="animate-pop-in" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="workspace-title-bar">
                <span className="workspace-title">
                  {language === 'en' ? 'Interactive Category C Graph' : 'インタラクティブ圏 C のグラフ'}
                </span>
                <span className="empty-state">
                  {language === 'en' ? 'Click nodes to change representing object R' : 'ノードをクリックして表現対象 R を指定してください'}
                </span>
              </div>

              <div className="workspace-canvas" style={{ background: 'rgba(5, 7, 12, 0.5)', border: '1px solid rgba(212, 175, 55, 0.1)', width: '100%', flexGrow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg viewBox="0 0 400 280" width="100%" height="100%" style={{ maxWidth: '400px' }}>
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="21" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--primary)" />
                    </marker>
                    <marker id="selected-arrow" viewBox="0 0 10 10" refX="21" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--secondary)" />
                    </marker>
                  </defs>

                  {/* Morphism f: A -> B */}
                  <path 
                    d="M 100,200 L 200,80" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="2" 
                    markerEnd="url(#arrow)" 
                    style={{ transition: 'stroke 0.3s' }}
                  />
                  <text x="135" y="130" fill="var(--text-muted)" fontSize="12" fontFamily="serif" fontWeight="bold">f</text>

                  {/* Morphism g: B -> C */}
                  <path 
                    d="M 200,80 L 300,200" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="2" 
                    markerEnd="url(#arrow)"
                    style={{ transition: 'stroke 0.3s' }}
                  />
                  <text x="255" y="130" fill="var(--text-muted)" fontSize="12" fontFamily="serif" fontWeight="bold">g</text>

                  {/* Morphism h: A -> C (composition) */}
                  <path 
                    d="M 100,200 L 300,200" 
                    fill="none" 
                    stroke="var(--secondary)" 
                    strokeWidth="2" 
                    strokeDasharray="4,4" 
                    markerEnd="url(#selected-arrow)"
                  />
                  <text x="190" y="222" fill="var(--secondary)" fontSize="11" fontFamily="serif" fontWeight="bold">h = g ∘ f</text>

                  {/* Identity Loops */}
                  {/* Loop 1_A */}
                  <path 
                    d="M 88,183 C 58,163 58,123 98,123 C 118,123 112,158 103,176" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.2)" 
                    strokeWidth="1.5" 
                    markerEnd="url(#arrow)"
                  />
                  <text x="80" y="115" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">1_A</text>

                  {/* Loop 1_B */}
                  <path 
                    d="M 188,63 C 158,43 158,3 198,3 C 218,3 212,38 203,56" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.2)" 
                    strokeWidth="1.5" 
                    markerEnd="url(#arrow)"
                  />
                  <text x="195" y="0" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">1_B</text>

                  {/* Loop 1_C */}
                  <path 
                    d="M 288,183 C 258,163 258,123 298,123 C 318,123 312,158 303,176" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.2)" 
                    strokeWidth="1.5" 
                    markerEnd="url(#arrow)"
                  />
                  <text x="295" y="115" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">1_C</text>

                  {/* Node A */}
                  <g 
                    onClick={() => setRepresentingObj('A')} 
                    style={{ cursor: 'pointer' }}
                  >
                    <circle 
                      cx="100" 
                      cy="200" 
                      r="24" 
                      fill="rgba(10, 15, 30, 0.9)" 
                      stroke={representingObj === 'A' ? 'var(--secondary)' : 'var(--primary)'} 
                      strokeWidth={representingObj === 'A' ? '3' : '1.5'}
                      style={{ transition: 'stroke-width 0.2s, stroke 0.2s' }}
                    />
                    <text x="100" y="205" fill="#fff" textAnchor="middle" fontWeight="bold" fontSize="12" fontFamily="serif">A</text>
                  </g>

                  {/* Node B */}
                  <g 
                    onClick={() => setRepresentingObj('B')} 
                    style={{ cursor: 'pointer' }}
                  >
                    <circle 
                      cx="200" 
                      cy="80" 
                      r="24" 
                      fill="rgba(10, 15, 30, 0.9)" 
                      stroke={representingObj === 'B' ? 'var(--secondary)' : 'var(--primary)'} 
                      strokeWidth={representingObj === 'B' ? '3' : '1.5'}
                      style={{ transition: 'stroke-width 0.2s, stroke 0.2s' }}
                    />
                    <text x="200" y="85" fill="#fff" textAnchor="middle" fontWeight="bold" fontSize="12" fontFamily="serif">B</text>
                  </g>

                  {/* Node C */}
                  <g 
                    onClick={() => setRepresentingObj('C')} 
                    style={{ cursor: 'pointer' }}
                  >
                    <circle 
                      cx="300" 
                      cy="200" 
                      r="24" 
                      fill="rgba(10, 15, 30, 0.9)" 
                      stroke={representingObj === 'C' ? 'var(--secondary)' : 'var(--primary)'} 
                      strokeWidth={representingObj === 'C' ? '3' : '1.5'}
                      style={{ transition: 'stroke-width 0.2s, stroke 0.2s' }}
                    />
                    <text x="300" y="205" fill="#fff" textAnchor="middle" fontWeight="bold" fontSize="12" fontFamily="serif">C</text>
                  </g>
                </svg>
              </div>

              <div className="workspace-footer" style={{ width: '100%', marginTop: '1rem' }}>
                <span>{language === 'en' ? `Representing object is set to ${representingObj}.` : `現在、表現対象は ${representingObj} に指定されています。`}</span>
                <button onClick={nextStop} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.65rem' }}>
                  {language === 'en' ? 'Proceed to Functor h_A' : '関手 h_A の観察へ'} <ChevronRight size={10} />
                </button>
              </div>
            </div>
          )}

          {/* Stop 2: Representable Functor h_A (Hom sets mapping) */}
          {currentStop === 2 && (
            <div className="animate-pop-in" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="workspace-title-bar">
                <span className="workspace-title">
                  {language === 'en' ? `Represented Functor h_${representingObj} = Hom(${representingObj}, -)` : `表現された関手 h_${representingObj} = Hom(${representingObj}, -)`}
                </span>
                <span className="empty-state">
                  {language === 'en' ? 'Click category nodes below to shift viewpoint' : '下の圏のノードをクリックして視点を移動できます'}
                </span>
              </div>

              <div className="workspace-canvas" style={{ width: '100%', flexGrow: '1', minHeight: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '1rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', width: '100%' }}>
                  {(['A', 'B', 'C'] as CatObject[]).map((obj) => {
                    const homs = getHomSet(representingObj, obj);
                    return (
                      <div 
                        key={obj} 
                        style={{ 
                          background: 'rgba(10, 15, 30, 0.65)', 
                          border: '1.5px solid rgba(212, 175, 55, 0.15)', 
                          borderRadius: '12px', 
                          padding: '1.25rem', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)'
                        }}
                      >
                        <h5 style={{ fontFamily: 'Cinzel', color: 'var(--primary)', fontSize: '0.75rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                          h_{representingObj}({obj}) = Hom({representingObj}, {obj})
                        </h5>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', minHeight: '40px', alignItems: 'center' }}>
                          {homs.length === 0 ? (
                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.15)', fontFamily: 'serif' }}>∅ (Empty)</span>
                          ) : (
                            homs.map((m) => (
                              <div 
                                key={m} 
                                className="set-element floating-node"
                                style={{ 
                                  width: '2.5rem', 
                                  height: '2.5rem', 
                                  fontSize: '0.8rem', 
                                  borderRadius: '6px', 
                                  border: '1px solid var(--secondary)',
                                  color: 'var(--secondary)',
                                  boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)'
                                }}
                              >
                                {m}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Micro mini Category C selector graph */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    {language === 'en' ? 'Shift Representing Object: ' : '表現対象を切り替え：'}
                  </span>
                  {(['A', 'B', 'C'] as CatObject[]).map(o => (
                    <button
                      key={o}
                      onClick={() => setRepresentingObj(o)}
                      className={`btn ${representingObj === o ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem', minWidth: '32px' }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div className="workspace-footer" style={{ width: '100%', marginTop: '1rem' }}>
                <span>{language === 'en' ? 'The hom-sets represent the structure as seen from the chosen origin.' : 'Hom集合は、選択された起点から捉えられた圏の構造を表しています。'}</span>
                <button onClick={nextStop} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.65rem' }}>
                  {language === 'en' ? 'Proceed to Functor X' : '対象関手 X の観察へ'} <ChevronRight size={10} />
                </button>
              </div>
            </div>
          )}

          {/* Stop 3: Target Functor X: C -> Set mapping elements */}
          {currentStop === 3 && (
            <div className="animate-pop-in" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="workspace-title-bar">
                <span className="workspace-title">
                  {language === 'en' ? 'Functorial Mapping X: C → Set' : '関手マッピング X: C → Set'}
                </span>
                <span className="empty-state">
                  {language === 'en' ? 'Hover over elements in X(A) to trace the functions' : 'X(A) 内の要素にホバーして関数の挙動をトレースできます'}
                </span>
              </div>

              <div className="workspace-canvas" style={{ background: 'rgba(5, 7, 12, 0.6)', border: '1px solid rgba(255,255,255,0.03)', width: '100%', flexGrow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg viewBox="0 0 500 320" width="100%" height="100%" style={{ maxWidth: '500px' }}>
                  <defs>
                    <marker id="arrow-blue" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--secondary)" />
                    </marker>
                    <marker id="arrow-gold" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--primary)" />
                    </marker>
                  </defs>

                  {/* Functor X(Y) bubbles */}
                  {/* Bubble X(A) */}
                  <rect x="20" y="20" width="110" height="280" rx="12" fill="rgba(10, 15, 30, 0.4)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  <text x="75" y="15" fill="var(--primary)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">X(A)</text>
                  
                  {/* Bubble X(B) */}
                  <rect x="195" y="50" width="110" height="220" rx="12" fill="rgba(10, 15, 30, 0.4)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  <text x="250" y="45" fill="var(--primary)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">X(B)</text>

                  {/* Bubble X(C) */}
                  <rect x="370" y="20" width="110" height="280" rx="12" fill="rgba(10, 15, 30, 0.4)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  <text x="425" y="15" fill="var(--primary)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">X(C)</text>

                  {/* Draw mapping arrows for X(f) */}
                  {X_sets.A.map((el, i) => {
                    const target = applyX_f(el);
                    const targetIdx = X_sets.B.indexOf(target);
                    
                    const startY = 60 + i * 90;
                    const endY = 100 + targetIdx * 110;
                    
                    const isHighlighted = hoveredAElement === el;
                    const isDimmed = hoveredAElement !== null && !isHighlighted;
                    
                    return (
                      <path
                        key={`f-${el}`}
                        d={`M 75,${startY} Q 150,${(startY+endY)/2} 250,${endY}`}
                        fill="none"
                        stroke={isHighlighted ? 'var(--primary)' : 'var(--secondary)'}
                        strokeWidth={isHighlighted ? 2.5 : 1}
                        strokeOpacity={isDimmed ? 0.15 : 0.6}
                        markerEnd={isHighlighted ? 'url(#arrow-gold)' : 'url(#arrow-blue)'}
                        style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s, stroke 0.2s' }}
                      />
                    );
                  })}
                  <text x="160" y="80" fill="var(--text-muted)" fontSize="9" fontWeight="bold" opacity="0.6">X(f)</text>

                  {/* Draw mapping arrows for X(g) */}
                  {X_sets.B.map((el, i) => {
                    const target = applyX_g(el);
                    const targetIdx = X_sets.C.indexOf(target);
                    
                    const startY = 100 + i * 110;
                    const endY = 60 + targetIdx * 90;
                    
                    const matchesHover = hoveredAElement !== null && applyX_f(hoveredAElement) === el;
                    const isDimmed = hoveredAElement !== null && !matchesHover;
                    
                    return (
                      <path
                        key={`g-${el}`}
                        d={`M 250,${startY} Q 320,${(startY+endY)/2} 425,${endY}`}
                        fill="none"
                        stroke={matchesHover ? 'var(--primary)' : 'var(--secondary)'}
                        strokeWidth={matchesHover ? 2.5 : 1}
                        strokeOpacity={isDimmed ? 0.15 : 0.6}
                        markerEnd={matchesHover ? 'url(#arrow-gold)' : 'url(#arrow-blue)'}
                        style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s, stroke 0.2s' }}
                      />
                    );
                  })}
                  <text x="330" y="80" fill="var(--text-muted)" fontSize="9" fontWeight="bold" opacity="0.6">X(g)</text>

                  {/* Draw mapping arrows for composite X(h) as dashed bottom curves */}
                  {X_sets.A.map((el, i) => {
                    const target = applyX_h(el);
                    const targetIdx = X_sets.C.indexOf(target);
                    
                    const startY = 60 + i * 90;
                    const endY = 60 + targetIdx * 90;
                    
                    const isHighlighted = hoveredAElement === el;
                    
                    if (!isHighlighted) return null; // Show only on hover to prevent visual clutter
                    
                    return (
                      <path
                        key={`h-${el}`}
                        d={`M 75,${startY} C 150,${startY + 60} 350,${endY + 60} 425,${endY}`}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="2"
                        strokeDasharray="3,3"
                        markerEnd="url(#arrow-gold)"
                      />
                    );
                  })}
                  {hoveredAElement && (
                    <text x="250" y="270" fill="var(--primary)" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Composite path X(h) = X(g) ∘ X(f)
                    </text>
                  )}

                  {/* Elements inside X(A) */}
                  {X_sets.A.map((el, i) => (
                    <g 
                      key={el}
                      onMouseEnter={() => setHoveredAElement(el)}
                      onMouseLeave={() => setHoveredAElement(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle 
                        cx="75" 
                        cy={60 + i * 90} 
                        r="14" 
                        fill="rgba(10, 15, 30, 0.95)" 
                        stroke={hoveredAElement === el ? 'var(--primary)' : 'var(--border-color)'} 
                        strokeWidth="1.5"
                      />
                      <text x="75" y={64 + i * 90} fill="#fff" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace">{el}</text>
                    </g>
                  ))}

                  {/* Elements inside X(B) */}
                  {X_sets.B.map((el, i) => {
                    const isHighlighted = hoveredAElement !== null && applyX_f(hoveredAElement) === el;
                    return (
                      <g key={el}>
                        <circle 
                          cx="250" 
                          cy={100 + i * 110} 
                          r="14" 
                          fill="rgba(10, 15, 30, 0.95)" 
                          stroke={isHighlighted ? 'var(--primary)' : 'var(--border-color)'} 
                          strokeWidth="1.5"
                        />
                        <text x="250" y={104 + i * 110} fill="#fff" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace">{el}</text>
                      </g>
                    );
                  })}

                  {/* Elements inside X(C) */}
                  {X_sets.C.map((el, i) => {
                    const isHighlighted = hoveredAElement !== null && applyX_h(hoveredAElement) === el;
                    return (
                      <g key={el}>
                        <circle 
                          cx="425" 
                          cy={60 + i * 90} 
                          r="14" 
                          fill="rgba(10, 15, 30, 0.95)" 
                          stroke={isHighlighted ? 'var(--primary)' : 'var(--border-color)'} 
                          strokeWidth="1.5"
                        />
                        <text x="425" y={64 + i * 90} fill="#fff" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace">{el}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="workspace-footer" style={{ width: '100%', marginTop: '1rem' }}>
                <span>{language === 'en' ? 'Functions behave strictly functorially: composition is preserved.' : '関数は厳密に関手的であり、写像の合成は完全に保存されます。'}</span>
                <button onClick={nextStop} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.65rem' }}>
                  {language === 'en' ? 'Witness Yoneda Isomorphism' : '米田同型の観察へ'} <ChevronRight size={10} />
                </button>
              </div>
            </div>
          )}

          {/* Stop 4: Yoneda Isomorphism (Mapping Hom-sets to Sets) */}
          {currentStop === 4 && (
            <div className="animate-pop-in" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="workspace-title-bar">
                <span className="workspace-title">
                  {language === 'en' ? `Yoneda Bijection: Nat(h_${representingObj}, X) ≅ X(${representingObj})` : `米田の双射: Nat(h_${representingObj}, X) ≅ X(${representingObj})`}
                </span>
                <span className="empty-state">
                  {language === 'en' ? `Click element inside X(${representingObj}) to set seed u` : `X(${representingObj}) の要素をクリックして、種 u を変更してください`}
                </span>
              </div>

              <div className="workspace-canvas" style={{ background: 'rgba(5, 7, 12, 0.5)', border: '1px solid rgba(255, 255, 255, 0.03)', width: '100%', flexGrow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg viewBox="0 0 650 360" width="100%" height="100%">
                  <defs>
                    <marker id="nat-arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--accent)" />
                    </marker>
                  </defs>

                  {/* Left Column Label */}
                  <text x="120" y="25" fill="var(--secondary)" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {language === 'en' ? `Representable Functor h_${representingObj}(-)` : `表現可能関手 h_${representingObj}(-)`}
                  </text>

                  {/* Right Column Label */}
                  <text x="530" y="25" fill="var(--primary)" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {language === 'en' ? 'Target Functor X(-)' : '対象関手 X(-)'}
                  </text>

                  {/* Horizontal dividers indicating objects */}
                  <line x1="20" y1="125" x2="630" y2="125" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <line x1="20" y1="240" x2="630" y2="240" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                  {/* Object Labels in margins */}
                  <text x="325" y="75" fill="rgba(255,255,255,0.15)" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="serif">Object A</text>
                  <text x="325" y="190" fill="rgba(255,255,255,0.15)" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="serif">Object B</text>
                  <text x="325" y="305" fill="rgba(255,255,255,0.15)" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="serif">Object C</text>

                  {/* --- HOM-SETS (Left Column Boxes) --- */}
                  {/* h_R(A) Box */}
                  <rect x="35" y="40" width="170" height="70" rx="8" fill="rgba(10, 15, 30, 0.5)" stroke="rgba(56, 189, 248, 0.15)" />
                  <text x="45" y="55" fill="var(--secondary)" fontSize="8" fontFamily="monospace">h_{representingObj}(A)</text>
                  
                  {/* h_R(B) Box */}
                  <rect x="35" y="155" width="170" height="70" rx="8" fill="rgba(10, 15, 30, 0.5)" stroke="rgba(56, 189, 248, 0.15)" />
                  <text x="45" y="170" fill="var(--secondary)" fontSize="8" fontFamily="monospace">h_{representingObj}(B)</text>

                  {/* h_R(C) Box */}
                  <rect x="35" y="270" width="170" height="70" rx="8" fill="rgba(10, 15, 30, 0.5)" stroke="rgba(56, 189, 248, 0.15)" />
                  <text x="45" y="285" fill="var(--secondary)" fontSize="8" fontFamily="monospace">h_{representingObj}(C)</text>

                  {/* Morphisms nodes inside Hom sets */}
                  {/* Y = A */}
                  {representingObj === 'A' && (
                    <g>
                      <circle cx="120" cy="80" r="14" fill="rgba(10, 15, 30, 0.9)" stroke="var(--secondary)" strokeWidth="1.5" />
                      <text x="120" y="83" fill="#fff" textAnchor="middle" fontSize="9" fontFamily="monospace">1_A</text>
                    </g>
                  )}
                  {representingObj !== 'A' && (
                    <text x="120" y="80" fill="rgba(255,255,255,0.15)" textAnchor="middle" fontSize="12">∅</text>
                  )}

                  {/* Y = B */}
                  {representingObj === 'A' && (
                    <g>
                      <circle cx="120" cy="195" r="14" fill="rgba(10, 15, 30, 0.9)" stroke="var(--secondary)" strokeWidth="1.5" />
                      <text x="120" y="198" fill="#fff" textAnchor="middle" fontSize="9" fontFamily="monospace">f</text>
                    </g>
                  )}
                  {representingObj === 'B' && (
                    <g>
                      <circle cx="120" cy="195" r="14" fill="rgba(10, 15, 30, 0.9)" stroke="var(--secondary)" strokeWidth="1.5" />
                      <text x="120" y="198" fill="#fff" textAnchor="middle" fontSize="9" fontFamily="monospace">1_B</text>
                    </g>
                  )}
                  {representingObj === 'C' && (
                    <text x="120" y="195" fill="rgba(255,255,255,0.15)" textAnchor="middle" fontSize="12">∅</text>
                  )}

                  {/* Y = C */}
                  {representingObj === 'A' && (
                    <g>
                      <circle cx="120" cy="310" r="14" fill="rgba(10, 15, 30, 0.9)" stroke="var(--secondary)" strokeWidth="1.5" />
                      <text x="120" y="313" fill="#fff" textAnchor="middle" fontSize="9" fontFamily="monospace">h</text>
                    </g>
                  )}
                  {representingObj === 'B' && (
                    <g>
                      <circle cx="120" cy="310" r="14" fill="rgba(10, 15, 30, 0.9)" stroke="var(--secondary)" strokeWidth="1.5" />
                      <text x="120" y="313" fill="#fff" textAnchor="middle" fontSize="9" fontFamily="monospace">g</text>
                    </g>
                  )}
                  {representingObj === 'C' && (
                    <g>
                      <circle cx="120" cy="310" r="14" fill="rgba(10, 15, 30, 0.9)" stroke="var(--secondary)" strokeWidth="1.5" />
                      <text x="120" y="313" fill="#fff" textAnchor="middle" fontSize="9" fontFamily="monospace">1_C</text>
                    </g>
                  )}


                  {/* --- TARGET SETS X(Y) (Right Column Boxes) --- */}
                  {/* X(A) Box */}
                  <rect x="440" y="40" width="180" height="70" rx="8" fill="rgba(10, 15, 30, 0.5)" stroke="rgba(212, 175, 55, 0.15)" />
                  <text x="450" y="55" fill="var(--primary)" fontSize="8" fontFamily="monospace">X(A)</text>
                  {/* Elements inside X(A) */}
                  {X_sets.A.map((el, i) => {
                    const isRepresenting = representingObj === 'A';
                    const isSelected = selectedU === el && isRepresenting;
                    return (
                      <g 
                        key={`xa-${el}`} 
                        onClick={() => isRepresenting && setSelectedU(el)}
                        style={{ cursor: isRepresenting ? 'pointer' : 'default' }}
                      >
                        <circle 
                          cx={480 + i * 50} 
                          cy="80" 
                          r="13" 
                          fill="rgba(10, 15, 30, 0.9)" 
                          stroke={isSelected ? 'var(--accent)' : (isRepresenting ? 'var(--primary)' : 'rgba(255,255,255,0.06)')} 
                          strokeWidth={isSelected ? '2.5' : '1'} 
                        />
                        <text x={480 + i * 50} y="83" fill={isRepresenting ? '#fff' : 'rgba(255,255,255,0.3)'} textAnchor="middle" fontSize="9" fontFamily="monospace">{el}</text>
                      </g>
                    );
                  })}

                  {/* X(B) Box */}
                  <rect x="440" y="155" width="180" height="70" rx="8" fill="rgba(10, 15, 30, 0.5)" stroke="rgba(212, 175, 55, 0.15)" />
                  <text x="450" y="170" fill="var(--primary)" fontSize="8" fontFamily="monospace">X(B)</text>
                  {/* Elements inside X(B) */}
                  {X_sets.B.map((el, i) => {
                    const isRepresenting = representingObj === 'B';
                    const isSelected = selectedU === el && isRepresenting;
                    return (
                      <g 
                        key={`xb-${el}`}
                        onClick={() => isRepresenting && setSelectedU(el)}
                        style={{ cursor: isRepresenting ? 'pointer' : 'default' }}
                      >
                        <circle 
                          cx={505 + i * 50} 
                          cy="195" 
                          r="13" 
                          fill="rgba(10, 15, 30, 0.9)" 
                          stroke={isSelected ? 'var(--accent)' : (isRepresenting ? 'var(--primary)' : 'rgba(255,255,255,0.06)')} 
                          strokeWidth={isSelected ? '2.5' : '1'} 
                        />
                        <text x={505 + i * 50} y="198" fill={isRepresenting ? '#fff' : 'rgba(255,255,255,0.3)'} textAnchor="middle" fontSize="9" fontFamily="monospace">{el}</text>
                      </g>
                    );
                  })}

                  {/* X(C) Box */}
                  <rect x="440" y="270" width="180" height="70" rx="8" fill="rgba(10, 15, 30, 0.5)" stroke="rgba(212, 175, 55, 0.15)" />
                  <text x="450" y="285" fill="var(--primary)" fontSize="8" fontFamily="monospace">X(C)</text>
                  {/* Elements inside X(C) */}
                  {X_sets.C.map((el, i) => {
                    const isRepresenting = representingObj === 'C';
                    const isSelected = selectedU === el && isRepresenting;
                    return (
                      <g 
                        key={`xc-${el}`}
                        onClick={() => isRepresenting && setSelectedU(el)}
                        style={{ cursor: isRepresenting ? 'pointer' : 'default' }}
                      >
                        <circle 
                          cx={480 + i * 50} 
                          cy="310" 
                          r="13" 
                          fill="rgba(10, 15, 30, 0.9)" 
                          stroke={isSelected ? 'var(--accent)' : (isRepresenting ? 'var(--primary)' : 'rgba(255,255,255,0.06)')} 
                          strokeWidth={isSelected ? '2.5' : '1'} 
                        />
                        <text x={480 + i * 50} y="313" fill={isRepresenting ? '#fff' : 'rgba(255,255,255,0.3)'} textAnchor="middle" fontSize="9" fontFamily="monospace">{el}</text>
                      </g>
                    );
                  })}


                  {/* --- NATURAL TRANSFORMATION ARROWS α_Y (Connecting Left to Right) --- */}
                  {representingObj === 'A' && (
                    <g>
                      {/* α_A: 1_A -> u */}
                      {(() => {
                        const targetIdx = X_sets.A.indexOf(selectedU);
                        const endX = 480 + targetIdx * 50;
                        return (
                          <path 
                            d={`M 134,80 L ${endX - 14},80`} 
                            fill="none" 
                            stroke="var(--accent)" 
                            strokeWidth="2" 
                            markerEnd="url(#nat-arrow)" 
                          />
                        );
                      })()}
                      <text x="290" y="74" fill="var(--accent)" fontSize="9" fontWeight="bold" textAnchor="middle">α_A</text>

                      {/* α_B: f -> X(f)(u) */}
                      {(() => {
                        const targetVal = applyX_f(selectedU);
                        const targetIdx = X_sets.B.indexOf(targetVal);
                        const endX = 505 + targetIdx * 50;
                        return (
                          <path 
                            d={`M 134,195 L ${endX - 14},195`} 
                            fill="none" 
                            stroke="var(--accent)" 
                            strokeWidth="2" 
                            markerEnd="url(#nat-arrow)" 
                          />
                        );
                      })()}
                      <text x="290" y="189" fill="var(--accent)" fontSize="9" fontWeight="bold" textAnchor="middle">α_B</text>

                      {/* α_C: h -> X(h)(u) */}
                      {(() => {
                        const targetVal = applyX_h(selectedU);
                        const targetIdx = X_sets.C.indexOf(targetVal);
                        const endX = 480 + targetIdx * 50;
                        return (
                          <path 
                            d={`M 134,310 L ${endX - 14},310`} 
                            fill="none" 
                            stroke="var(--accent)" 
                            strokeWidth="2" 
                            markerEnd="url(#nat-arrow)" 
                          />
                        );
                      })()}
                      <text x="290" y="304" fill="var(--accent)" fontSize="9" fontWeight="bold" textAnchor="middle">α_C</text>
                    </g>
                  )}

                  {representingObj === 'B' && (
                    <g>
                      {/* α_B: 1_B -> u */}
                      {(() => {
                        const targetIdx = X_sets.B.indexOf(selectedU);
                        const endX = 505 + targetIdx * 50;
                        return (
                          <path 
                            d={`M 134,195 L ${endX - 14},195`} 
                            fill="none" 
                            stroke="var(--accent)" 
                            strokeWidth="2" 
                            markerEnd="url(#nat-arrow)" 
                          />
                        );
                      })()}
                      <text x="290" y="189" fill="var(--accent)" fontSize="9" fontWeight="bold" textAnchor="middle">α_B</text>

                      {/* α_C: g -> X(g)(u) */}
                      {(() => {
                        const targetVal = applyX_g(selectedU);
                        const targetIdx = X_sets.C.indexOf(targetVal);
                        const endX = 480 + targetIdx * 50;
                        return (
                          <path 
                            d={`M 134,310 L ${endX - 14},310`} 
                            fill="none" 
                            stroke="var(--accent)" 
                            strokeWidth="2" 
                            markerEnd="url(#nat-arrow)" 
                          />
                        );
                      })()}
                      <text x="290" y="304" fill="var(--accent)" fontSize="9" fontWeight="bold" textAnchor="middle">α_C</text>
                    </g>
                  )}

                  {representingObj === 'C' && (
                    <g>
                      {/* α_C: 1_C -> u */}
                      {(() => {
                        const targetIdx = X_sets.C.indexOf(selectedU);
                        const endX = 480 + targetIdx * 50;
                        return (
                          <path 
                            d={`M 134,310 L ${endX - 14},310`} 
                            fill="none" 
                            stroke="var(--accent)" 
                            strokeWidth="2" 
                            markerEnd="url(#nat-arrow)" 
                          />
                        );
                      })()}
                      <text x="290" y="304" fill="var(--accent)" fontSize="9" fontWeight="bold" textAnchor="middle">α_C</text>
                    </g>
                  )}
                </svg>
              </div>

              <div className="workspace-footer" style={{ width: '100%', marginTop: '1rem' }}>
                <span>{language === 'en' ? `Click elements in X(${representingObj}) to shift u and generate a new transformation α.` : `X(${representingObj}) の要素をクリックして u を切り替え、新しい自然変換 α を生成してください。`}</span>
                <button onClick={nextStop} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.65rem' }}>
                  {language === 'en' ? 'Check Commutative Square' : '可換正方形の検証へ'} <ChevronRight size={10} />
                </button>
              </div>
            </div>
          )}

          {/* Stop 5: Commutative Square & Particle flow animation */}
          {currentStop === 5 && (
            <div className="animate-pop-in" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="workspace-title-bar">
                <span className="workspace-title">
                  {language === 'en' ? 'Verification of Naturality Commutation' : '自然性における可換性の検証'}
                </span>
                
                {/* Morphism selector depending on representing object R */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {language === 'en' ? 'Test Morphism: ' : '検証対象の射：'}
                  </span>
                  {representingObj === 'A' && (
                    <>
                      <button 
                        onClick={() => setSelectedMorphism('f')} 
                        className={`btn ${selectedMorphism === 'f' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
                      >
                        f: A → B
                      </button>
                      <button 
                        onClick={() => setSelectedMorphism('h')} 
                        className={`btn ${selectedMorphism === 'h' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
                      >
                        h: A → C
                      </button>
                    </>
                  )}
                  {representingObj === 'B' && (
                    <button 
                      onClick={() => setSelectedMorphism('g')} 
                      className="btn btn-primary"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
                    >
                      g: B → C
                    </button>
                  )}
                  {representingObj === 'C' && (
                    <button 
                      onClick={() => setSelectedMorphism('1_C')} 
                      className="btn btn-primary"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
                    >
                      1_C: C → C
                    </button>
                  )}
                </div>
              </div>

              {/* Commutative Square SVG */}
              {(() => {
                // Determine nodes names and values based on selected morphism and representing object R
                let topL = `1_${representingObj}`;
                let topR = selectedMorphism;
                let bottomL = selectedU;
                let bottomR = getAlphaMapping(selectedMorphism === 'f' ? 'B' : 'C', selectedMorphism);

                if (representingObj === 'C') {
                  bottomR = selectedU;
                } else if (representingObj === 'B' && selectedMorphism === 'g') {
                  bottomR = applyX_g(selectedU);
                }

                // Compute particle positions
                let p1X = 70, p1Y = 50;
                let p2X = 70, p2Y = 50;

                if (animating) {
                  if (progress <= 45) {
                    const ratio = progress / 45;
                    p1X = 70 + ratio * 260;
                    p1Y = 50;
                    p2X = 70;
                    p2Y = 50 + ratio * 180;
                  } else if (progress <= 55) {
                    p1X = 330;
                    p1Y = 50;
                    p2X = 70;
                    p2Y = 230;
                  } else {
                    const ratio = (progress - 55) / 45;
                    p1X = 330;
                    p1Y = 50 + ratio * 180;
                    p2X = 70 + ratio * 260;
                    p2Y = 230;
                  }
                } else {
                  p1X = 70; p1Y = 50;
                  p2X = 70; p2Y = 50;
                }

                // Dynamic label texts
                const topLabel = `${selectedMorphism}_*`;
                const bottomLabel = `X(${selectedMorphism})`;
                const leftLabel = `α_${representingObj}`;
                const rightLabel = `α_${selectedMorphism === 'f' ? 'B' : (selectedMorphism === 'g' || selectedMorphism === 'h' ? 'C' : representingObj)}`;

                return (
                  <div className="workspace-canvas" style={{ background: 'rgba(5, 7, 12, 0.65)', border: '1px solid rgba(212, 175, 55, 0.1)', width: '100%', flexGrow: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', height: '280px' }}>
                      <svg viewBox="0 0 400 280" width="100%" height="100%">
                        <defs>
                          <marker id="sq-arrow-cyan" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--secondary)" />
                          </marker>
                          <marker id="sq-arrow-gold" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--primary)" />
                          </marker>
                          <marker id="sq-arrow-accent" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--accent)" />
                          </marker>
                          
                          {/* Glow filter for animating particles */}
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Top path: h_R(R) -> h_R(Y) via m_* */}
                        <path d="M 70,50 L 330,50" fill="none" stroke="var(--secondary)" strokeWidth="2" markerEnd="url(#sq-arrow-cyan)" />
                        <text x="200" y="42" fill="var(--secondary)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">{topLabel}</text>

                        {/* Left path: h_R(R) -> X(R) via α_R */}
                        <path d="M 70,50 L 70,230" fill="none" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#sq-arrow-accent)" />
                        <text x="44" y="145" fill="var(--accent)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">{leftLabel}</text>

                        {/* Bottom path: X(R) -> X(Y) via X(m) */}
                        <path d="M 70,230 L 330,230" fill="none" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#sq-arrow-gold)" />
                        <text x="200" y="246" fill="var(--primary)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">{bottomLabel}</text>

                        {/* Right path: h_R(Y) -> X(Y) via α_Y */}
                        <path d="M 330,50 L 330,230" fill="none" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#sq-arrow-accent)" />
                        <text x="356" y="145" fill="var(--accent)" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">{rightLabel}</text>

                        {/* Top-Left node: h_R(R) = {1_R} */}
                        <g>
                          <circle cx="70" cy="50" r="20" fill="rgba(10, 15, 30, 0.95)" stroke="var(--secondary)" strokeWidth="1.5" />
                          <text x="70" y="54" fill="#fff" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace">{topL}</text>
                          <text x="70" y="24" fill="var(--secondary)" textAnchor="middle" fontSize="7" fontFamily="monospace">h_{representingObj}({representingObj})</text>
                        </g>

                        {/* Top-Right node: h_R(Y) = {m} */}
                        <g>
                          <circle cx="330" cy="50" r="20" fill="rgba(10, 15, 30, 0.95)" stroke="var(--secondary)" strokeWidth="1.5" />
                          <text x="330" y="54" fill="#fff" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace">{topR}</text>
                          <text x="330" y="24" fill="var(--secondary)" textAnchor="middle" fontSize="7" fontFamily="monospace">
                            h_{representingObj}({selectedMorphism === 'f' ? 'B' : (selectedMorphism === 'g' || selectedMorphism === 'h' ? 'C' : representingObj)})
                          </text>
                        </g>

                        {/* Bottom-Left node: X(R) = {u} */}
                        <g>
                          <circle cx="70" cy="230" r="20" fill="rgba(10, 15, 30, 0.95)" stroke="var(--primary)" strokeWidth="1.5" />
                          <text x="70" y="234" fill="#fff" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace">{bottomL}</text>
                          <text x="70" y="260" fill="var(--primary)" textAnchor="middle" fontSize="7" fontFamily="monospace">X({representingObj})</text>
                        </g>

                        {/* Bottom-Right node: X(Y) = {X(m)(u)} */}
                        <g>
                          <circle cx="330" cy="230" r="20" fill="rgba(10, 15, 30, 0.95)" stroke="var(--primary)" strokeWidth="1.5" />
                          <text x="330" y="234" fill="#fff" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace">{bottomR}</text>
                          <text x="330" y="260" fill="var(--primary)" textAnchor="middle" fontSize="7" fontFamily="monospace">
                            X({selectedMorphism === 'f' ? 'B' : (selectedMorphism === 'g' || selectedMorphism === 'h' ? 'C' : representingObj)})
                          </text>
                        </g>

                        {/* Fusing burst animation at the destination */}
                        {burst && (
                          <g>
                            <circle cx="330" cy="230" r="32" fill="none" stroke="var(--accent)" strokeWidth="3" opacity="0.8" className="animate-ping" style={{ animationDuration: '0.8s' }} />
                            <circle cx="330" cy="230" r="20" fill="var(--accent)" opacity="0.35" style={{ filter: 'url(#glow)' }} />
                          </g>
                        )}

                        {/* Animating Particles */}
                        {animating && (
                          <g>
                            {/* Particle 1: Top-Right path (cyan/accent) */}
                            <circle cx={p1X} cy={p1Y} r="6" fill="var(--secondary)" style={{ filter: 'url(#glow)' }} />
                            {/* Particle 2: Bottom-Left path (gold/accent) */}
                            <circle cx={p2X} cy={p2Y} r="6" fill="var(--primary)" style={{ filter: 'url(#glow)' }} />
                          </g>
                        )}
                      </svg>

                      {/* Floating result indicator */}
                      {burst && (
                        <div style={{ position: 'absolute', bottom: '70px', left: '0', right: '0', display: 'flex', justifyContent: 'center' }}>
                          <span style={{ background: 'rgba(16,185,129,0.95)', border: '1px solid var(--success)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                            <CheckCircle2 size={10} />
                            {language === 'en' ? `Commutes! Target: ${bottomR}` : `可換！到達点: ${bottomR}`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button 
                        onClick={() => setAnimating(true)} 
                        disabled={animating}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.7rem' }}
                      >
                        {language === 'en' ? 'Trigger Animation' : 'アニメーションを再生'}
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="workspace-footer" style={{ width: '100%', marginTop: '1rem' }}>
                <span>{language === 'en' ? 'Both paths starting from 1_R evaluate to the exact same value.' : '1_R から出発するどちらの経路も、完全に同じ値に評価されます。'}</span>
                <button onClick={() => setCurrentStop(1)} className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.65rem' }}>
                  {language === 'en' ? 'Restart Tour' : 'ツアーの最初に戻る'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
