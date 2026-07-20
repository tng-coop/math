import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Play, Pause, Square, 
  FastForward, Rewind, ChevronRight, CheckCircle2,
  Info
} from 'lucide-react';



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
  const tabContent = useMemo(() => {
    return {
      en: {
        narrative: "Mathematics is ONLY the dual cycle of Free Generation (Syntax) vs. Quotienting (Semantics). The Yoneda Lemma represents the ultimate statement that mathematical existence is defined entirely by relational context. Free generation builds out the representable functor $h_A = \\text{Hom}(A, -)$ mapping all syntactic relationships outgoing from an object $A$. Quotienting defines $A$'s semantic existence entirely by collapsing its relational Hom-set connections to the rest of the category, proving that internal substance is equivalent to quotiented external relations.",
        rigor: "Mathematically, defining structures via relationships is formally known as defining structures via 'Generators and Relations' (or 'Presentations'). The Yoneda Lemma asserts a natural isomorphism $\\text{Nat}(h_A, X) \\cong X(A)$ for any functor $X: \\mathcal{C} \\to \\text{Set}$ and object $A \\in \\mathcal{C}$. Free generation constructs the representable functor $h_A(Y) = \\text{Hom}(A, Y)$ as the syntactic collection of outgoing arrows. The quotient collapse occurs because the naturality of any transformation $\\alpha: h_A \\Rightarrow X$ forces it to be completely determined by the image of the identity morphism $\\alpha_A(1_A) = u \\in X(A)$, collapsing all Hom-set mappings into a single semantic point.",
        history: "Proved by Nobuo Yoneda in 1954, the lemma revolutionized the philosophical stance of mathematical ontology. It demonstrated that an object has no isolated internal structure; its properties are completely encoded by its relations. This historical realization establishes that mathematical identity is exclusively born of the dual cycle of freely generating relational syntax ($h_A$) and quotienting it to resolve semantic existence, showing that objects are defined by presentations of their morphisms.",
        exercises: "1. Select $A$ as the representing object. Calculate the freely generated representable Hom-sets $h_A(B)$ and $h_A(C)$ syntax.\n2. Choose an element $u \\in X(A)$. Show how the natural transformation components $\\alpha_B(f)$ and $\\alpha_C(h)$ collapse to specific semantic elements in the target sets via quotienting. Prove that this collapse demonstrates that an object's identity is the quotient limit of its relations."
      },
      ja: {
        narrative: "数学は、自由生成（構文）と商化（意味論）の双対サイクル「のみ」で構成されています。米田の補題は、数学的存在が関係的文脈によって完全に定義されるという究極の言明です。自由生成は、対象 $A$ からのすべての発信矢印を写す表現可能関手 $h_A = \\text{Hom}(A, -)$ を構築します。商化は、対象 $A$ の意味的存在を圏の他の部分への関係的Hom集合を崩壊（商崩壊）させることで定義し、本質が自由生成された構文の意図的な商であることを証明します。",
        rigor: "数学において、関係性を介して構造を定義することは、公式に「生成元と関係式」（あるいは「プレゼンテーション」）による定義として知られています。米田の補題は、任意の関手 $X: \\mathcal{C} \\to \\text{Set}$ と対象 $A \\in \\mathcal{C}$ に対する自然同型 $\\text{Nat}(h_A, X) \\cong X(A)$ を主張します。自由生成は、射の構文的集合として表現可能関手 $h_A(Y) = \\text{Hom}(A, Y)$ を作成します。任意の自然変換 $\\alpha: h_A \\Rightarrow X$ は、その自然性により恒等射の像 $\\alpha_A(1_A) = u \\in X(A)$ によって完全に決定され、すべてのHom集合の写像を単一の意味的点へと商崩壊させるため、商化が発生します。",
        history: "1954年に米田信夫によって証明されたこの補題は、数学的存在論の哲学的立場に革命をもたらしました。対象は独立した内部構造を持たず、その存在は関係性の全体によって完全に商化されることを示しました。この歴史的認識は、数学的同一性が、関係的構文（$h_A$）の自由生成とその意味的存在を解決するための商化という双対サイクルのみから生まれることを確立し、対象がその射のプレゼンテーションによって定義されることを示しています。",
        exercises: "1. 表現対象として $A$ を選択します。自由生成された表現可能Hom集合 $h_A(B)$ および $h_A(C)$ の構文を計算してください。\n2. 要素 $u \\in X(A)$ を選択します。自然変換コンポーネント $\\alpha_B(f)$ および $\\alpha_C(h)$ が、商化を介してターゲット集合内の特定の意味的要素にどのように崩壊するかを示してください。この崩壊が、対象の同一性がその関係性の商極限であることを実証しているか証明してください。"
      }
    }[language];
  }, [language]);

  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'narrative' | 'rigor' | 'history' | 'exercises'>('narrative');

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

  // Stop speech when current stop, language, or active tab changes
  useEffect(() => {
    stopSpeechComplete();
  }, [currentStop, language, activeTab]);

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

  const getWordAtCharIndex = (text: string, charIdx: number): string | null => {
    const words = getSpokenWords(text, language);
    const match = words.find(w => charIdx >= w.start && charIdx < w.end);
    return match ? match.text : null;
  };

  const handleSpeechTrigger = (word: string) => {
    const w = word.toLowerCase();
    if (w.includes('representable') || w.includes('outgoing') || w.includes('arrow') || 
        w.includes('表現可能') || w.includes('発信') || w.includes('矢印')) {
      setRepresentingObj('A');
    } else if (w.includes('yoneda') || w.includes('lemma') || w.includes('isomorphism') || w.includes('natural') || 
               w.includes('米田') || w.includes('補題') || w.includes('同型') || w.includes('自然')) {
      setAnimating(true);
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

  const isSpeaking = activeSpeechText === tabContent[activeTab];

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
              onClick={() => speakCurrentStop(tabContent[activeTab])}
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
              <h3 className="placard-title">
                {language === 'en' ? 'The Yoneda Ontology' : '米田存在論'}
              </h3>
              <p className="placard-subtitle">
                {language === 'en' ? 'Defining existence through relational Hom-sets' : '関係性（Hom集合）による存在の定義'}
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
              
              <div className="placard-text" style={{ fontSize: '0.85rem', lineHeight: '1.6', minHeight: '140px', whiteSpace: 'pre-line' }}>
                {renderHighlightedText(tabContent[activeTab])}
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
