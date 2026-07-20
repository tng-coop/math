import React, { useState, useEffect } from 'react';
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

export default function AdjunctionVisualizer({ language }: { language: 'en' | 'ja' }) {
  const getInitialRoom = (): number => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const room = parseInt(params.get('room') || '1', 10);
      return (room >= 1 && room <= 6) ? room : 1;
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
  const [setElements, setSetElements] = useState<ElementNode[]>([
    { id: '1', label: 'I' },
    { id: '2', label: 'I' },
    { id: '3', label: 'I' }
  ]);
  const [monoidWords, setMonoidWords] = useState<string[]>([]);
  const [animationState, setAnimationState] = useState<'idle' | 'free' | 'forget' | 'unit' | 'counit'>('idle');
  const [counitInput, setCounitInput] = useState<string>('I-I-I');
  const [counitResult, setCounitResult] = useState<string | null>(null);

  // Text-to-Speech (TTS) states
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

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

  // Stop speech when current stop or language changes
  useEffect(() => {
    stopSpeechComplete();
  }, [currentStop, language]);

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
      // Read to satisfy TS compiler check and release reference
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
            setCurrentCharIndex(startIndex + adjustedCharIdx);
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
      // Toggle play / pause state
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

    const wordSkip = 4; // Word seek step size
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

  // Tour stops definitions
  const tourStops: TourStop[] = language === 'ja' ? [
    {
      id: 1,
      title: "I. 美術館入口：存在論的サイクル",
      subtitle: "数学的実体の絶対的なあり方について。",
      text: "随伴存在論ツアーへようこそ。数学はその究極の基盤において、自由生成と、崩壊ないし商化の構造的サイクルその事です。この二重性は、現代の高度な抽象概念ではなく、実のところ百万年前の人類が認知能力を獲得した黎明期から、脳の中で常に機能し続けてきた仕組みです。本ツアーでは、最初にこのサイクルを最も直感的な言葉で体験し、最後に圏論を使った数学的定式化を学びます。"
    },
    {
      id: 2,
      title: "II. 数え上げの黎明：石ころと刻み目 (百万年前)",
      subtitle: "無制限に刻み目を打つ「自由生成」と、個数へ折りたたむ「商化」。",
      text: "百万年前、私たちの祖先は小石を集めたり、骨に刻み目を刻み始めました。ノッチを無数に刻んでいく行為は、一切のルールや制限を持たない自由生成であり、純粋な構文の誕生を表します。これに対し、バラバラの刻み目たちを、例えば5頭の獲物のように一つの概念や数字へと折りたたみ、共通の価値に還元する行為が、商化ないし崩壊です。"
    },
    {
      id: 3,
      title: "III. 言語の誕生：アルファベットと意味論 (古代)",
      subtitle: "アルファベットから無限の文を生成し、共通概念へと崩壊させる。",
      text: "古代、人類は少数の文字から無限の文や単語を生成する能力を獲得しました。限られた記号を並べて無数の文字列を作る行為は自由生成です。そして、異なる文字の並びや表現を、共通の意味という一つの概念に折りたたむ行為が商化です。異なる構文が意味という一つの積へと崩壊する。これこそが言語の意味論の正体です。"
    },
    {
      id: 4,
      title: "IV. アルゴリズムの時代：構文木とコンパイル (現代)",
      subtitle: "コード構文を生成し、コンピューターで評価して値へ崩壊させる。",
      text: "現代のコンピューター科学においても、このサイクルは不変です。変数や演算子からプログラムの抽象構文木を自由に生成し、コンパイラやプロセッサが二項演算に沿って構文木を評価して、最終的な出力値へと収縮させます。包摂イータは変数を割り当てることであり、評価エプシロンはコードを実行することに他なりません。"
    },
    {
      id: 5,
      title: "V. 定式化：集合とモノイドの圏",
      subtitle: "人類の認知の往復を、数学的なオブジェクトの接続として記述する。",
      text: "この百万年の知性の往復を、圏論を用いて正式に定義します。生の要素の領域を集合の圏Cとし、結合規則を持つ体系をモノイドの圏Dと呼びます。自由生成は集合をモノイドにする自由関手Fであり、崩壊は構造を忘れて集合へと戻す忘却関手Uです。これらは２つの圏の間の変換です。"
    },
    {
      id: 6,
      title: "VI. 定式化：随伴 duality (F ⊣ U)",
      subtitle: "自由生成と商化崩壊を完璧に統合する自然同型。",
      text: "私たちの直感的な「自由生成して崩壊させる」存在論的ループは、圏論によって随伴（F ⊣ U）という形で統合されます。これは自然同型を確立します。この式は、自由モノイド上のすべての準同型写像（崩壊のルール）が、元の生の要素をどこに送るかという最初の写像だけで一意に決定されることを意味します。知性の歩みが数学的に証明される瞬間です。"
    }
  ] : [
    {
      id: 1,
      title: "I. Gallery Entrance: The Ontological Cycle",
      subtitle: "The absolute nature of mathematical existence.",
      text: "Welcome to the Ontology Museum Tour. At its ultimate foundation, mathematics is the structural cycle of Free Generation and Collapse or Quotienting. Every mathematical system is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations and equations. In this tour, we will explore this cycle in the simplest intuitive terms first, and cover the category-theoretic formalization later."
    },
    {
      id: 2,
      title: "II. The Dawn of Counting: Pebbles and Notches (1M Years Ago)",
      subtitle: "Generating notches freely and collapsing them into numeric quantities.",
      text: "A million years ago, our ancestors collected pebbles or carved notches on bones to record quantities. Carving notches freely onto a bone with no constraints is the free generation of pure syntax. Conversely, folding those discrete marks into a single numeric value, such as 5 mammoths, to trade, compare, or share is the quotient collapse. This is the origin of arithmetic."
    },
    {
      id: 3,
      title: "III. The Birth of Language: Alphabet & Semantics (Ancient Eras)",
      subtitle: "Generating infinite strings of text and collapsing them into shared meaning.",
      text: "In ancient eras, humanity created alphabets to generate infinite sentences and text configurations. Arranging a small set of letters to write down infinite sentences represents the free generation of syntax. Quotient collapse is the mechanism of semantics, where multiple syntactic formulations or synonyms collapse under a single, shared definition or meaning."
    },
    {
      id: 4,
      title: "IV. The Algorithmic Era: Syntax Trees & Evaluation (Modern)",
      subtitle: "Generating abstract syntax trees and collapsing them into values.",
      text: "Modern computer science follows the exact same cognitive cycle. We freely assemble variables and operators into nested Abstract Syntax Trees. The CPU or compiler then collapses this tree using binary operations, reducing it into a single computed output value. Inclusion eta allocates variables, and evaluation epsilon executes the code."
    },
    {
      id: 5,
      title: "V. Formalization: Categories of Sets & Monoids",
      subtitle: "Representing our cognitive cycle with objects and structured categories.",
      text: "We now introduce Category Theory to formalize this cognitive loop mathematically. Category C of Sets represents the world of raw elements without structure. Category D of Monoids represents structured objects with associative multiplication. Free generation is modelled as the Free Functor F, and collapse is modelled as the Forgetful Functor U."
    },
    {
      id: 6,
      title: "VI. Formalization: The Adjunction Duality (F ⊣ U)",
      subtitle: "The natural isomorphism uniting notation and meaning.",
      text: "The ultimate mathematical formalization of our ontology is the Adjunction. It establishes a natural isomorphism between hom-sets. This states that specifying a collapsed evaluation map out of a free structure is identical to choosing where the raw generators map. The cognitive circle that began with notch-carving a million years ago is mathematically unified."
    }
  ];

  const nextStop = () => {
    if (currentStop < tourStops.length) {
      setCurrentStop(currentStop + 1);
    }
  };


  const currentTourStop = tourStops[currentStop - 1];

  const isSpeaking = activeSpeechText === currentTourStop.text;

  return (
    <div className="visualizer-container animate-pop-in">
      
      {/* Prominent Segmented Room Navigation Dashboard */}
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
              onClick={() => speakCurrentStop(currentTourStop.text)}
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
                {currentTourStop.title}
              </h3>
              <p className="placard-subtitle">
                {currentTourStop.subtitle}
              </p>
              <div className="placard-text">
                <p>
                  {renderHighlightedText(currentTourStop.text)}
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
