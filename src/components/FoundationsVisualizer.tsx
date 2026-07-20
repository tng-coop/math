import { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, ArrowRight, CheckCircle2, Play, Pause, FastForward, Rewind
} from 'lucide-react';
import { roomsData } from '../data/curriculumData';

interface FoundationsVisualizerProps {
  language: 'en' | 'ja';
  forcedRoom: number; // 26 to 30
  onNavigate?: (room: number) => void;
}

interface MorphismArrow {
  from: string;
  to: string;
}

interface SpokenWord {
  text: string;
  start: number;
  end: number;
}

let activeUtteranceRef: SpeechSynthesisUtterance | null = null;

export default function FoundationsVisualizer({ language, forcedRoom, onNavigate }: FoundationsVisualizerProps) {
  const activeRoomData = useMemo(() => {
    return roomsData[forcedRoom] || roomsData[26];
  }, [forcedRoom]);

  const tabContent = useMemo(() => {
    return language === 'en' ? activeRoomData.en : activeRoomData.ja;
  }, [activeRoomData, language]);

  const [activeTab, setActiveTab] = useState<'narrative' | 'rigor' | 'history' | 'exercises'>('narrative');

  // Text-to-Speech (TTS) states
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const isSpeaking = activeSpeechText !== null;

  // Stop 1: Free Generation state
  const generators = ['a', 'b'];
  const [freeStrings, setFreeStrings] = useState<string[]>(['ε']);
  const [activeGenStr, setActiveGenStr] = useState<string>('');

  // Stop 2: Mappings state
  const leftNodes = ['x1', 'x2', 'x3'];
  const rightNodes = ['y1', 'y2', 'y3'];
  const [morphisms, setMorphisms] = useState<MorphismArrow[]>([
    { from: 'x1', to: 'y1' },
    { from: 'x2', to: 'y2' },
    { from: 'x3', to: 'y3' }
  ]);
  const [selectedLeftNode, setSelectedLeftNode] = useState<string | null>(null);

  // Stop 3: Quotients state
  type ShapeType = 'circle' | 'square' | 'triangle';
  type ColorType = 'red' | 'blue' | 'gold';
  interface QuotientItem {
    id: number;
    shape: ShapeType;
    color: ColorType;
  }
  const quotientItems: QuotientItem[] = [
    { id: 1, shape: 'circle', color: 'red' },
    { id: 2, shape: 'circle', color: 'blue' },
    { id: 3, shape: 'circle', color: 'gold' },
    { id: 4, shape: 'square', color: 'red' },
    { id: 5, shape: 'square', color: 'blue' },
    { id: 6, shape: 'square', color: 'gold' },
    { id: 7, shape: 'triangle', color: 'red' },
    { id: 8, shape: 'triangle', color: 'blue' },
    { id: 9, shape: 'triangle', color: 'gold' },
  ];
  const [quotientRule, setQuotientRule] = useState<'none' | 'color' | 'shape'>('none');

  // Stop 4: Functors state
  const [hoveredFunctorElement, setHoveredFunctorElement] = useState<string | null>(null);

  // Stop 5: Adjunction state
  const [adjunctSourceMap, setAdjunctSourceMap] = useState<Record<string, string>>({
    'x': 'A',
    'y': 'B'
  });

  // TTS implementation
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const langPrefix = language === 'ja' ? 'ja' : 'en';
      setVoices(allVoices.filter(v => v.lang.startsWith(langPrefix)));
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [language]);

  const stopSpeechComplete = () => {
    if (activeUtteranceRef) {
      activeUtteranceRef.onboundary = null;
      activeUtteranceRef.onend = null;
      activeUtteranceRef.onerror = null;
      activeUtteranceRef = null;
    }
    setActiveSpeechText(null);
    setCurrentCharIndex(-1);
    setIsPaused(false);
  };

  const startSpeech = (text: string, startIndex: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Brief timeout to let cancel finish
    setTimeout(() => {
      const sliceText = text.substring(startIndex);
      if (!sliceText.trim()) {
        stopSpeechComplete();
        return;
      }

      const cleanText = ", " + sliceText.replace(/[\$\{\}\[\]\(\)⊣→≅↦]/g, ' '); 
      const utterance = new SpeechSynthesisUtterance(cleanText);
      activeUtteranceRef = utterance;
      
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

  const stopSpeech = () => {
    stopSpeechComplete();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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

  // Math equation renderer helper that splits into words/symbols for highlighting & click-to-seek
  const renderHighlightedText = (text: string) => {
    const words = getSpokenWords(text, language);
    let result: React.ReactNode[] = [];
    let lastIdx = 0;
    
    words.forEach((w, idx) => {
      if (w.start > lastIdx) {
        const betweenText = text.substring(lastIdx, w.start);
        const parts = betweenText.split(/(\$\$[^\$]+\$\$|\$[^\$]+\$)/g);
        parts.forEach((part, pidx) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            result.push(<div key={`math-b-${idx}-${pidx}`} className="math-block font-serif text-center my-4 text-primary">{part.slice(2, -2)}</div>);
          } else if (part.startsWith('$') && part.endsWith('$')) {
            result.push(<span key={`math-i-${idx}-${pidx}`} className="math-inline font-serif text-secondary px-0.5">{part.slice(1, -1)}</span>);
          } else {
            result.push(part);
          }
        });
      }
      
      const isCurrent = currentCharIndex >= w.start && currentCharIndex < w.end;
      
      if (w.text.startsWith('$') && w.text.endsWith('$')) {
        result.push(
          <span 
            key={`word-${idx}`} 
            className={isCurrent ? "word-highlight" : "word-normal"}
            onClick={() => startSpeech(text, w.start)}
            style={{ cursor: 'pointer' }}
            title={language === 'en' ? 'Click to play from here' : 'ここから再生'}
          >
            <span className="math-inline font-serif text-secondary px-0.5">{w.text.slice(1, -1)}</span>
          </span>
        );
      } else {
        result.push(
          <span 
            key={`word-${idx}`} 
            className={isCurrent ? "word-highlight" : "word-normal"}
            onClick={() => startSpeech(text, w.start)}
            style={{ cursor: 'pointer' }}
            title={language === 'en' ? 'Click to play from here' : 'ここから再生'}
          >
            {w.text}
          </span>
        );
      }
      lastIdx = w.end;
    });
    
    if (lastIdx < text.length) {
      const remainingText = text.substring(lastIdx);
      const parts = remainingText.split(/(\$\$[^\$]+\$\$|\$[^\$]+\$)/g);
      parts.forEach((part, pidx) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          result.push(<div key={`math-b-end-${pidx}`} className="math-block font-serif text-center my-4 text-primary">{part.slice(2, -2)}</div>);
        } else if (part.startsWith('$') && part.endsWith('$')) {
          result.push(<span key={`math-i-end-${pidx}`} className="math-inline font-serif text-secondary px-0.5">{part.slice(1, -1)}</span>);
        } else {
          result.push(part);
        }
      });
    }
    
    return result;
  };

  // Stop 1: Append Free character
  const appendFreeGen = (char: string) => {
    const newStr = activeGenStr + char;
    setActiveGenStr(newStr);
    if (!freeStrings.includes(newStr)) {
      setFreeStrings([...freeStrings, newStr]);
    }
  };

  const clearFreeGen = () => {
    setActiveGenStr('');
    setFreeStrings(['ε']);
  };

  // Stop 2: Mapping evaluation
  const setMappingTarget = (from: string, to: string) => {
    setMorphisms(prev => {
      const filtered = prev.filter(m => m.from !== from);
      return [...filtered, { from, to }];
    });
    setSelectedLeftNode(null);
  };

  const mappingClassification = useMemo(() => {
    // Check if every domain maps to exactly one codomain (always true with this model, but lets verify)
    const domainMapped = leftNodes.every(l => morphisms.some(m => m.from === l));
    if (!domainMapped) return { text: language === 'en' ? 'Incomplete Relation' : '不完全な関係', type: 'error' };

    const mappedTargets = morphisms.map(m => m.to);
    const uniqueTargets = Array.from(new Set(mappedTargets));

    const isSurjective = rightNodes.every(r => mappedTargets.includes(r));
    const isInjective = uniqueTargets.length === mappedTargets.length;

    if (isInjective && isSurjective) {
      return { 
        text: language === 'en' ? 'Bijective (Isomorphism / Perfect Balance)' : '全単射（同型・完璧な対話）', 
        type: 'success' 
      };
    }
    if (isInjective) {
      return { 
        text: language === 'en' ? 'Injective (Distinctness Preserved)' : '単射（個別の区別を保存）', 
        type: 'info' 
      };
    }
    if (isSurjective) {
      return { 
        text: language === 'en' ? 'Surjective (Target Fully Covered)' : '全射（全体をカバー）', 
        type: 'info' 
      };
    }
    return { 
      text: language === 'en' ? 'General Mapping (Not Injective or Surjective)' : '一般的な写像（構造の重複あり）', 
      type: 'warning' 
    };
  }, [morphisms, language]);

  return (
    <div className="museum-exhibit-container">

      <div className="exhibit-grid">
        {/* Left Side: Dynamic placard panel */}
        <div className="placard-panel">
          <div>
            <div className="placard-header">
              <BookOpen size={12} />
              <span>{language === 'en' ? 'Foundation Placard' : '基礎概念解説パネル'}</span>
            </div>

            <div className="animate-pop-in">
              <h3 className="placard-title">
                {language === 'en' ? activeRoomData.nameEn : activeRoomData.nameJa}
              </h3>
              <p className="placard-subtitle">
                {language === 'en' ? activeRoomData.thesisEn : activeRoomData.thesisJa}
              </p>

              {activeRoomData.image && (
                <div className="placard-image-container" style={{ marginBottom: '1.25rem', width: '100%', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={activeRoomData.image} alt={activeRoomData.imageAlt || ''} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              )}

              {/* Tab Selector */}
              <div className="placard-tabs" style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                {(['narrative', 'rigor', 'history', 'exercises'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { stopSpeech(); setActiveTab(tab); }}
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

              {/* Premium Audio Guide receiver dashboard */}
              <div className="audio-guide-player" style={{ marginBottom: '1.25rem', padding: '0.6rem 1rem', gap: '1rem', borderRadius: '0.75rem' }}>
                <div className="device-info">
                  <div className="device-screen" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', fontSize: '0.55rem', fontFamily: 'monospace' }}>
                    {isSpeaking ? 'ON' : 'OFF'}
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
                      <option value="">{language === 'en' ? 'Default Voice' : 'デフォルト音声'}</option>
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
                  >
                    <option value="0.8">0.80x</option>
                    <option value="1">1.00x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.50x</option>
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
                      title={language === 'en' ? 'Fast Forward' : '早送り'}
                    >
                      <FastForward size={10} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="placard-text" style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-muted)', minHeight: '140px', whiteSpace: 'pre-line' }}>
                {renderHighlightedText(tabContent[activeTab])}
              </div>

              {/* Foundational Concepts Quick Links */}
              <div className="tied-foundations" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {language === 'en' ? 'Related Foundational Pages:' : '関連する基礎概念ライブラリ:'}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {[
                    { room: 26, nameEn: 'Free Gen', nameJa: '自由生成' },
                    { room: 27, nameEn: 'Mappings', nameJa: '写像と関数' },
                    { room: 28, nameEn: 'Quotients', nameJa: '商集合・同一視' },
                    { room: 29, nameEn: 'Categories', nameJa: '圏と関手' },
                    { room: 30, nameEn: 'Adjunctions', nameJa: '随伴と双対性' }
                  ].map(item => (
                    <button
                      key={item.room}
                      onClick={() => onNavigate && onNavigate(item.room)}
                      className={`btn-lang ${forcedRoom === item.room ? 'active' : ''}`}
                      style={{ fontSize: '0.625rem', padding: '3px 8px', borderRadius: '3px' }}
                    >
                      {language === 'en' ? item.nameEn : item.nameJa}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="placard-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
            <span>TNG COOP FOUNDATIONAL LIBRARIES</span>
            <span>SECTION F{forcedRoom - 25}/5</span>
          </div>
        </div>

        {/* Right Side: Interactive Concept Visualizer Kiosk */}
        <div className="kiosk-panel" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1.25rem' }}>
          
          {/* STOP 1: Free Generation */}
          {forcedRoom === 26 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                  {language === 'en' ? 'Free Syntax Generator' : '自由構文ジェネレータ'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {language === 'en' 
                    ? 'Click generators to construct raw terms. Notice that they stack without any simplification rules.' 
                    : '生成元をクリックして生の文字列を生成します。簡約ルールがないため、そのまま結合されていきます。'}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {generators.map(g => (
                    <button key={g} onClick={() => appendFreeGen(g)} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>
                      {g}
                    </button>
                  ))}
                  <button onClick={clearFreeGen} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.7rem', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.2)' }}>
                    Reset
                  </button>
                </div>

                <div className="workspace-canvas" style={{ minHeight: '120px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    <span>{language === 'en' ? 'Current Syntactic Term (Word):' : '現在の構文表現 (単語):'}</span>
                    <span className="font-mono" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{activeGenStr || 'ε'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', width: '100%' }}>
                      {language === 'en' ? 'Generated Elements in Free Monoid F(X):' : '自由モノイド F(X) の生成済み要素:'}
                    </span>
                    {freeStrings.map((str, idx) => (
                      <span key={idx} className="floating-node font-mono" style={{ padding: '2px 6px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="workspace-footer" style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {language === 'en' ? 'This represents pure syntactic possibilities.' : 'これは簡約のない純粋な記号的記述の全宇宙です。'}
              </div>
            </div>
          )}

          {/* STOP 2: Mappings & Functions */}
          {forcedRoom === 27 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  {language === 'en' ? 'Bipartite Mapping Inspector' : '写像インスペクター'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {language === 'en' 
                    ? 'Click an element in Set X, then click a target in Set Y to map it. Inspect the injection/surjection status.'
                    : '集合Xの要素を選び、集合Yの要素を選んで矢印をつなぎます。単射・全射のステータスを確認します。'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', margin: '1rem 0' }}>
                  {/* Left Set X */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)' }}>Set X</span>
                    {leftNodes.map(x => (
                      <button 
                        key={x} 
                        onClick={() => setSelectedLeftNode(x)}
                        className={`floating-node ${selectedLeftNode === x ? 'active' : ''}`}
                        style={{ width: '45px', height: '45px', borderRadius: '50%', background: selectedLeftNode === x ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: selectedLeftNode === x ? 'black' : 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                      >
                        {x}
                      </button>
                    ))}
                  </div>

                  {/* Morphism arrows display */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.65rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '6px', minWidth: '90px' }}>
                    <span style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px', color: 'var(--text-muted)' }}>Maps</span>
                    {morphisms.map(m => (
                      <div key={m.from} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', fontFamily: 'monospace' }}>
                        <span>{m.from}</span>
                        <ArrowRight size={10} style={{ alignSelf: 'center' }} />
                        <span>{m.to}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right Set Y */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--secondary)' }}>Set Y</span>
                    {rightNodes.map(y => (
                      <button 
                        key={y} 
                        onClick={() => selectedLeftNode && setMappingTarget(selectedLeftNode, y)}
                        disabled={!selectedLeftNode}
                        className="floating-node"
                        style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: selectedLeftNode ? 'pointer' : 'default', opacity: selectedLeftNode ? 1 : 0.6 }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={14} style={{ color: mappingClassification.type === 'success' ? 'var(--success)' : 'var(--primary)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{mappingClassification.text}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STOP 3: Quotients & Grouping */}
          {forcedRoom === 28 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  {language === 'en' ? 'Equivalence Class Partition' : '同値類による直和分割'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {language === 'en'
                    ? 'Select an equivalence relation rule and watch the elements collapse into distinct quotient spaces.'
                    : '同値関係のルールを選び、要素がどのように商集合へと収縮（商化）するかを観察します。'}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <button onClick={() => setQuotientRule('none')} className={`btn ${quotientRule === 'none' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                    {language === 'en' ? 'Raw Elements' : '生の集合 (X)'}
                  </button>
                  <button onClick={() => setQuotientRule('color')} className={`btn ${quotientRule === 'color' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                    {language === 'en' ? 'Rule: Same Color' : '同色関係 (X/color)'}
                  </button>
                  <button onClick={() => setQuotientRule('shape')} className={`btn ${quotientRule === 'shape' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                    {language === 'en' ? 'Rule: Same Shape' : '同形関係 (X/shape)'}
                  </button>
                </div>

                <div className="workspace-canvas" style={{ minHeight: '180px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                  {quotientRule === 'none' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                      {quotientItems.map(item => (
                        <div 
                          key={item.id} 
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: item.shape === 'circle' ? '50%' : item.shape === 'square' ? '4px' : '0',
                            borderWidth: item.shape === 'triangle' ? '0 16px 32px 16px' : '0',
                            borderStyle: item.shape === 'triangle' ? 'solid' : 'none',
                            borderColor: item.shape === 'triangle' ? `transparent transparent ${item.color === 'red' ? '#ef4444' : item.color === 'blue' ? '#3b82f6' : '#ffbf00'} transparent` : 'none',
                            backgroundColor: item.shape !== 'triangle' ? (item.color === 'red' ? '#ef4444' : item.color === 'blue' ? '#3b82f6' : '#ffbf00') : 'transparent',
                            transition: 'all 0.5s ease'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {quotientRule === 'color' && (
                    <div style={{ display: 'flex', gap: '1.5rem', width: '100%', justifyContent: 'space-around' }}>
                      {['red', 'blue', 'gold'].map(color => (
                        <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.5rem', minWidth: '70px' }}>
                          <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: color === 'red' ? '#ef4444' : color === 'blue' ? '#3b82f6' : '#ffbf00' }}>{color}</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '50px', justifyContent: 'center' }}>
                            {quotientItems.filter(i => i.color === color).map(item => (
                              <div key={item.id} style={{ width: '10px', height: '10px', borderRadius: '50%', background: color === 'red' ? '#ef4444' : color === 'blue' ? '#3b82f6' : '#ffbf00' }} />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>Class [{color[0]}]</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {quotientRule === 'shape' && (
                    <div style={{ display: 'flex', gap: '1.5rem', width: '100%', justifyContent: 'space-around' }}>
                      {['circle', 'square', 'triangle'].map(shape => (
                        <div key={shape} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.5rem', minWidth: '70px' }}>
                          <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--primary)' }}>{shape}</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '50px', justifyContent: 'center' }}>
                            {quotientItems.filter(i => i.shape === shape).map(item => (
                              <div key={item.id} style={{ width: '10px', height: '10px', borderRadius: shape === 'square' ? '2px' : '50%', background: 'white' }} />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>Class [{shape[0]}]</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STOP 4: Categories & Functors */}
          {forcedRoom === 29 && (
            <div className="animate-pop-in animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  {language === 'en' ? 'Inter-Category Functor Translation' : '異圏間の関手翻訳マッピング'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {language === 'en'
                    ? 'Hover over components in Set-Category C to observe Functor mapping F translating them into Monoid-Category D.'
                    : '集合の圏 C の要素にホバーして、関手 F がモノイドの圏 D へと構造を翻訳・マッピングする様子を観察します。'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', margin: '1rem 0' }}>
                  {/* Category C */}
                  <div 
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}
                    onMouseEnter={() => setHoveredFunctorElement('cat_c')}
                    onMouseLeave={() => setHoveredFunctorElement(null)}
                  >
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)' }}>Category C (Set)</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                      <span className="font-mono text-xs text-white">Object: X</span>
                      <span className="font-mono text-xs text-white">Object: Y</span>
                      <span className="font-mono text-[10px] text-text-muted">Morphism: f: X → Y</span>
                    </div>
                  </div>

                  {/* Functor Bridge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>Functor F</span>
                    <ArrowRight size={24} style={{ color: hoveredFunctorElement ? 'var(--primary)' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }} />
                  </div>

                  {/* Category D */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--secondary)' }}>Category D (Monoid)</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', padding: '0.5rem', background: hoveredFunctorElement === 'cat_c' ? 'rgba(255,191,0,0.1)' : 'rgba(0,0,0,0.3)', border: hoveredFunctorElement === 'cat_c' ? '1px solid var(--primary)' : '1px solid transparent', borderRadius: '4px', transition: 'all 0.3s' }}>
                      <span className="font-mono text-xs text-white">Object: F(X) = X*</span>
                      <span className="font-mono text-xs text-white">Object: F(Y) = Y*</span>
                      <span className="font-mono text-[10px] text-text-muted">Morphism: F(f): F(X) → F(Y)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STOP 5: Adjunction & Duality */}
          {forcedRoom === 30 && (
            <div className="animate-pop-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <h4 className="workspace-title" style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  {language === 'en' ? 'Hom-set Natural Bijection' : 'Hom集合の自然全単射の双対性'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {language === 'en'
                    ? 'Map the generators on the set side X → U(Y). See how the adjunction automatically lifts it into a full homomorphism F(X) → Y.'
                    : '生の生成元 X から U(Y) へのマッピングを割り当てます。随伴がそれをどのようにモノイドの完全な準同型写像 F(X) → Y へと持ち上げる（Lift）かを確認します。'}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.75rem', margin: '0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{language === 'en' ? 'Set Side Map' : '生の写像'}</span>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {['x', 'y'].map(src => (
                          <div key={src} style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            <span>{src} ↦ </span>
                            <select 
                              value={adjunctSourceMap[src]} 
                              onChange={e => setAdjunctSourceMap(prev => ({ ...prev, [src]: e.target.value }))}
                              style={{ background: 'black', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '3px', fontSize: '0.65rem' }}
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <ArrowRight size={16} />

                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--primary)' }}>{language === 'en' ? 'Lifted Homomorphism' : '誘起された準同型'}</span>
                      <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--primary)', marginTop: '0.25rem' }}>
                        <span>F(x) = [{adjunctSourceMap['x']}]</span><br/>
                        <span>F(y) = [{adjunctSourceMap['y']}]</span><br/>
                        <span>F(xy) = [{adjunctSourceMap['x']},{adjunctSourceMap['y']}]</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
