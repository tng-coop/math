import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Play, Pause, Square, FastForward, Rewind
} from 'lucide-react';
import { roomsData } from '../data/curriculumData';
import { glossaryDb } from '../data/glossaryData';
import { inspectorDb } from '../data/inspectorDb';
import {
  OntologicalCycleVisualizer,
  LebomboBoneVisualizer,
  SumerianBullaVisualizer,
  IncaQuipuVisualizer,
  LanguageSynonymyVisualizer,
  LindenbaumTarskiVisualizer,
  TextileWeavingVisualizer,
  OrigamiCreaseVisualizer,
  ProjectiveGeometryVisualizer,
  PathHomotopyVisualizer,
  EinsteinSpacetimeVisualizer,
  LambdaCalculusVisualizer,
  RelationalAlgebraVisualizer,
  RegExAutomataVisualizer,
  TypeTheoryVisualizer,
  HoTTVisualizer,
  CategorySetsVisualizer,
  CategoryMonoidsVisualizer,
  FunctorialBridgesVisualizer,
  AdjunctionDualityVisualizer,
  UnitCounitVisualizer,
  MonadsVisualizer,
  YonedaVisualizer
} from './CustomRoomVisualizers';

interface SpokenWord {
  text: string;
  start: number;
  end: number;
}

let activeUtteranceRef: SpeechSynthesisUtterance | null = null;

export default function AdjunctionVisualizer({ language, forcedRoom, onNavigate }: { language: 'en' | 'ja', forcedRoom?: number, onNavigate?: (room: number) => void }) {
  const getInitialRoom = (): number => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const room = parseInt(params.get('room') || '1', 10);
      return (room >= 1 && room <= 25) ? room : 1;
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

  const activeRoomData = useMemo(() => {
    return roomsData[currentStop] || roomsData[1];
  }, [currentStop]);

  const tabContent = useMemo(() => {
    return language === 'en' ? activeRoomData.en : activeRoomData.ja;
  }, [activeRoomData, language]);

  // Text-to-Speech (TTS) states
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(-1);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'narrative' | 'rigor' | 'history' | 'exercises'>('narrative');

  // Interactive Duality Inspector states
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

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

  const handleSpeechTrigger = (_word: string) => {
    // No-op
  };

  const getWordAtCharIndex = (text: string, charIdx: number): string | null => {
    const words = getSpokenWords(text, language);
    const match = words.find(w => charIdx >= w.start && charIdx < w.end);
    return match ? match.text : null;
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

  // Math equation renderer helper that splits into words/symbols for highlighting & click-to-seek
  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(\$\$[^\$]+\$\$|\$[^\$]+\$)/g);
    let currentPos = 0;
    
    return parts.map((part, i) => {
      const partStart = currentPos;
      currentPos += part.length;
      
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const isCurrent = currentCharIndex >= partStart && currentCharIndex < partStart + part.length;
        const formula = part.slice(2, -2);
        const trimmed = formula.trim();
        const hasInspector = !!inspectorDb[trimmed];
        const html = (window as any).katex 
          ? (window as any).katex.renderToString(formula, { displayMode: true, throwOnError: false }) 
          : formula;
        return (
          <div 
            key={i} 
            className={`math-block font-serif text-center my-4 ${isCurrent ? 'text-secondary' : 'text-primary'} ${hasInspector ? 'interactive-inspector-term' : ''}`}
            onMouseEnter={hasInspector ? () => setHoveredSymbol(trimmed) : undefined}
            onMouseLeave={hasInspector ? () => setHoveredSymbol(null) : undefined}
            onClick={hasInspector ? (e) => {
              e.stopPropagation();
              setSelectedSymbol(prev => prev === trimmed ? null : trimmed);
              window.dispatchEvent(new CustomEvent('open-sandbox-drawer', { detail: { term: trimmed } }));
            } : () => startSpeech(text, partStart)}
            style={{ 
              cursor: 'pointer',
              border: hasInspector ? '1px dashed rgba(212,175,55,0.4)' : 'none',
              borderRadius: hasInspector ? '4px' : '0',
              padding: hasInspector ? '4px' : '0',
              transition: 'all 0.2s ease',
              backgroundColor: hasInspector && (hoveredSymbol === trimmed || selectedSymbol === trimmed) ? 'rgba(212, 175, 55, 0.05)' : 'transparent'
            }}
            title={hasInspector 
              ? (language === 'en' ? 'Hover to inspect, Click to lock/unlock duality' : 'ホバーで双対性表示、クリックで固定/解除') 
              : (language === 'en' ? 'Click to play from here' : 'ここから再生')
            }
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const isCurrent = currentCharIndex >= partStart && currentCharIndex < partStart + part.length;
        const formula = part.slice(1, -1);
        const trimmed = formula.trim();
        const hasInspector = !!inspectorDb[trimmed];
        const html = (window as any).katex 
          ? (window as any).katex.renderToString(formula, { displayMode: false, throwOnError: false }) 
          : formula;
        const isActive = (hoveredSymbol === trimmed || selectedSymbol === trimmed);
        return (
          <span 
            key={i} 
            className={`math-inline font-serif px-0.5 ${isCurrent ? 'word-highlight text-secondary' : 'text-secondary'} ${hasInspector ? 'interactive-inspector-term' : ''}`}
            onMouseEnter={hasInspector ? () => setHoveredSymbol(trimmed) : undefined}
            onMouseLeave={hasInspector ? () => setHoveredSymbol(null) : undefined}
            onClick={hasInspector ? (e) => {
              e.stopPropagation();
              setSelectedSymbol(prev => prev === trimmed ? null : trimmed);
              window.dispatchEvent(new CustomEvent('open-sandbox-drawer', { detail: { term: trimmed } }));
            } : () => startSpeech(text, partStart)}
            style={{ 
              cursor: 'pointer',
              borderBottom: hasInspector ? (isActive ? '2px solid var(--secondary)' : '1px dashed var(--secondary)') : 'none',
              paddingBottom: hasInspector ? '1px' : '0',
              backgroundColor: hasInspector && isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              transition: 'all 0.2s ease',
              borderRadius: hasInspector ? '2px' : '0'
            }}
            title={hasInspector 
              ? (language === 'en' ? 'Hover to inspect, Click to lock/unlock duality' : 'ホバーで双対性表示、クリックで固定/解除') 
              : (language === 'en' ? 'Click to play from here' : 'ここから再生')
            }
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else {
        const words = getSpokenWords(part, language);
        let result: React.ReactNode[] = [];
        let lastIdx = 0;
        
        words.forEach((w, idx) => {
          if (w.start > lastIdx) {
            result.push(part.substring(lastIdx, w.start));
          }
          
          const wordAbsoluteStart = partStart + w.start;
          const wordAbsoluteEnd = partStart + w.end;
          const isCurrent = currentCharIndex >= wordAbsoluteStart && currentCharIndex < wordAbsoluteEnd;
          
          result.push(
            <span 
              key={idx} 
              className={isCurrent ? "word-highlight" : "word-normal"}
              onClick={() => startSpeech(text, wordAbsoluteStart)}
              style={{ cursor: 'pointer' }}
              title={language === 'en' ? 'Click to play from here' : 'ここから再生'}
            >
              {w.text}
            </span>
          );
          lastIdx = w.end;
        });
        
        if (lastIdx < part.length) {
          result.push(part.substring(lastIdx));
        }
        
        return <span key={i}>{result}</span>;
      }
    });
  };


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
                {language === 'en' ? activeRoomData.nameEn : activeRoomData.nameJa}
              </h3>
              <p className="placard-subtitle">
                {renderHighlightedText(language === 'en' ? activeRoomData.thesisEn : activeRoomData.thesisJa)}
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

              {/* Interactive Duality Inspector Card */}
              {(() => {
                const activeSymbolKey = hoveredSymbol || selectedSymbol;
                const activeSymbolData = activeSymbolKey ? inspectorDb[activeSymbolKey] : null;
                return (
                  <div className="duality-inspector-card" style={{
                    background: activeSymbolData 
                      ? (activeSymbolData.classification === 'FREE' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)')
                      : 'rgba(255, 255, 255, 0.01)',
                    border: activeSymbolData
                      ? (activeSymbolData.classification === 'FREE' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)')
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    marginTop: '1.25rem',
                    minHeight: '145px',
                    transition: 'all 0.3s ease',
                    boxShadow: activeSymbolData ? '0 4px 20px rgba(0,0,0,0.3)' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                          {language === 'en' ? 'Interactive Duality Inspector' : '双対性インスペクター'}
                        </span>
                        {selectedSymbol && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSymbol(null);
                            }}
                            className="btn-lang"
                            style={{ 
                              fontSize: '0.55rem', 
                              padding: '1px 5px', 
                              borderRadius: '3px',
                              background: 'rgba(239, 68, 68, 0.1)', 
                              color: 'var(--error)', 
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              cursor: 'pointer'
                            }}
                            title={language === 'en' ? 'Click to deselect/unlock symbol' : 'クリックで選択・固定解除'}
                          >
                            {language === 'en' ? '🔒 Click to Unlock' : '🔒 固定解除'}
                          </button>
                        )}
                      </div>
                      {activeSymbolData && (
                        <span style={{
                          fontSize: '0.55rem',
                          fontWeight: 'bold',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: activeSymbolData.classification === 'FREE' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: activeSymbolData.classification === 'FREE' ? '#f59e0b' : '#10b981',
                          border: activeSymbolData.classification === 'FREE' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                        }}>
                          {activeSymbolData.classification === 'FREE' 
                            ? (language === 'en' ? 'FREE GENERATION / SYNTAX' : '自由生成 / 構文')
                            : (language === 'en' ? 'RELATION / COLLAPSE' : '関係式 / 意味の崩壊')}
                        </span>
                      )}
                    </div>

                    {activeSymbolData ? (
                      <div className="animate-fade-in">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <span style={{
                            fontFamily: 'serif',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: activeSymbolData.classification === 'FREE' ? '#f59e0b' : '#10b981',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255,255,255,0.05)'
                          }}>
                            {activeSymbolData.symbol}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>
                            {language === 'en' ? activeSymbolData.nameEn : activeSymbolData.nameJa}
                          </span>
                        </div>
                        
                        <div style={{
                          fontSize: '0.7rem',
                          fontStyle: 'italic',
                          color: activeSymbolData.classification === 'FREE' ? '#f59e0b' : '#10b981',
                          marginBottom: '0.4rem',
                          opacity: 0.9
                        }}>
                          {activeSymbolData.classification === 'FREE'
                            ? (language === 'en'
                              ? "This is a generator. It represents the unconstrained creation of raw symbols."
                              : "「これは生成元です。生の記号の無制約な作成を表します。」")
                            : (language === 'en'
                              ? "This is a relation. It represents the collapsing fold that creates semantic meaning."
                              : "「関係式です。意味論的な意味を生み出す崩壊・折りたたみを表します。」")}
                        </div>
                        
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                          {language === 'en' ? activeSymbolData.descEn : activeSymbolData.descJa}
                        </p>

                        {activeSymbolData.backlinks.length > 0 && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                              {language === 'en' ? 'Concept Back-links (Non-sequential Explorer):' : '関連概念バックリンク (非線形探索):'}
                            </span>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                              {activeSymbolData.backlinks.map(link => (
                                <button
                                  key={link.roomNum}
                                  onClick={() => onNavigate && onNavigate(link.roomNum)}
                                  className="btn-lang"
                                  style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '3px', background: 'rgba(255,255,255,0.03)' }}
                                >
                                  {language === 'en' ? link.nameEn : link.nameJa}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '110px', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', textAlign: 'center', padding: '0 0.5rem' }}>
                          {language === 'en' 
                            ? 'Hover or Click a math symbol ($X$, $F(X)$, etc.) in the placard text, Rosetta stone, or glossary to inspect its duality.' 
                            : '説明文、ロゼッタストーン、解説内の数式記号（$X$, $F(X)$ など）にホバーまたはクリックすると、その双対性が表示されます。'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
              {/* Duality Rosetta Stone Panel */}
              {activeRoomData.rosettaStone && (() => {
                const rosetta = language === 'en' ? activeRoomData.rosettaStone.en : activeRoomData.rosettaStone.ja;
                const hoverMap: Record<number, { generators: string; relations: string }> = {
                  1: { generators: 'X', relations: 'R' },
                  2: { generators: 'X', relations: 'R' },
                  3: { generators: 'X', relations: 'R' },
                  4: { generators: 'X', relations: 'R' },
                  5: { generators: 'X', relations: 'R' },
                  6: { generators: 'X', relations: 'R' },
                  7: { generators: 'X', relations: 'R' },
                  8: { generators: 'X', relations: 'R' },
                  9: { generators: 'X', relations: 'R' },
                  10: { generators: 'X', relations: 'R' },
                  11: { generators: 'X', relations: '\\pi' },
                  12: { generators: '\\text{Diff}(M)', relations: 'g_{\\mu\\nu}' },
                  13: { generators: '(\\lambda x. M)N', relations: 'M[x \\coloneqq N]' },
                  14: { generators: 'X', relations: 'R' },
                  15: { generators: 'X', relations: 'R' },
                  16: { generators: 'X', relations: 'R' },
                  17: { generators: 'X', relations: 'R' },
                  18: { generators: 'X', relations: 'R' },
                  19: { generators: 'X', relations: 'R' },
                  20: { generators: 'X', relations: 'R' },
                  21: { generators: 'X', relations: 'R' },
                  22: { generators: 'X', relations: 'R' },
                  23: { generators: 'X', relations: 'R' },
                  24: { generators: 'X', relations: 'R' },
                  25: { generators: 'X', relations: 'R' },
                  26: { generators: 'X', relations: 'R' },
                  27: { generators: 'X', relations: 'R' },
                  28: { generators: 'X', relations: 'R' },
                  29: { generators: 'X', relations: 'R' },
                  30: { generators: 'X', relations: 'R' }
                };
                const genSym = hoverMap[activeRoomData.id]?.generators || 'X';
                const relSym = hoverMap[activeRoomData.id]?.relations || 'R';
                return (
                  <div className="rosetta-stone-panel text-left" style={{
                    marginTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '1.25rem'
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      color: 'var(--primary)',
                      display: 'block',
                      marginBottom: '0.6rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {language === 'en' ? 'DUALITY ROSETTA STONE' : '二重性ロゼッタストーン'}
                    </span>
                    <div style={{
                      overflowX: 'auto',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      background: 'rgba(0,0,0,0.15)'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.68rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                            <th style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                              {language === 'en' ? 'Core Duality Lens' : '二重性のレンズ'}
                            </th>
                            <th style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                              {language === 'en' ? 'Lego Child-Analogy' : '子供向けのアナロジー'}
                            </th>
                            <th style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                              {language === 'en' ? 'Historical / Physical' : '歴史的・物理的技術'}
                            </th>
                            <th style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                              {language === 'en' ? 'Graduate Category Theory' : '大学院レベル圏論'}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr 
                            onMouseEnter={() => setHoveredSymbol(genSym)}
                            onMouseLeave={() => setHoveredSymbol(null)}
                            onClick={() => setSelectedSymbol(prev => prev === genSym ? null : genSym)}
                            style={{
                              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                              background: selectedSymbol === genSym 
                                ? 'rgba(245, 158, 11, 0.15)' 
                                : (hoveredSymbol === genSym ? 'rgba(245, 158, 11, 0.08)' : 'transparent'),
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                            title={language === 'en' ? 'Click to inspect/lock this concept' : 'クリックで解説を固定表示'}
                          >
                            <td style={{ padding: '6px 8px', fontWeight: 'bold', color: 'var(--secondary)' }}>
                              {rosetta.generators.lens}
                            </td>
                            <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.8)' }}>
                              {rosetta.generators.lego}
                            </td>
                            <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.8)' }}>
                              {rosetta.generators.tech}
                            </td>
                            <td style={{ padding: '6px 8px', color: '#fff', fontFamily: 'serif' }}>
                              {renderHighlightedText(rosetta.generators.theory)}
                            </td>
                          </tr>
                          <tr 
                            onMouseEnter={() => setHoveredSymbol(relSym)}
                            onMouseLeave={() => setHoveredSymbol(null)}
                            onClick={() => setSelectedSymbol(prev => prev === relSym ? null : relSym)}
                            style={{
                              background: selectedSymbol === relSym 
                                ? 'rgba(16, 185, 129, 0.15)' 
                                : (hoveredSymbol === relSym ? 'rgba(16, 185, 129, 0.08)' : 'transparent'),
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                            title={language === 'en' ? 'Click to inspect/lock this concept' : 'クリックで解説を固定表示'}
                          >
                            <td style={{ padding: '6px 8px', fontWeight: 'bold', color: 'var(--success)' }}>
                              {rosetta.relations.lens}
                            </td>
                            <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.8)' }}>
                              {rosetta.relations.lego}
                            </td>
                            <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.8)' }}>
                              {rosetta.relations.tech}
                            </td>
                            <td style={{ padding: '6px 8px', color: '#fff', fontFamily: 'serif' }}>
                              {renderHighlightedText(rosetta.relations.theory)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Exhibit Concept Glossary Accordion */}
              {activeRoomData.glossaryKeys && activeRoomData.glossaryKeys.length > 0 && (
                <div className="glossary-accordion" style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--secondary)', display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {language === 'en' ? 'Exhibit Concept Glossary:' : '展示概念解説ヘルパー:'}
                  </span>
                  <div className="glossary-details-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                    {activeRoomData.glossaryKeys.map(key => {
                      const entry = glossaryDb[key];
                      if (!entry) return null;
                      const term = language === 'en' ? entry.termEn : entry.termJa;
                      const rigor = language === 'en' ? entry.rigorEn : entry.rigorJa;
                      const analogy = language === 'en' ? entry.analogyEn : entry.analogyJa;
                      return (
                        <details 
                          key={key} 
                          onMouseEnter={() => setHoveredSymbol(key)}
                          onMouseLeave={() => setHoveredSymbol(null)}
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.4rem 0.6rem' }}
                        >
                          <summary 
                            onClick={() => setSelectedSymbol(prev => prev === key ? null : key)}
                            style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', cursor: 'pointer', outline: 'none', listStyle: 'none' }}
                          >
                            <span className="summary-arrow" style={{ color: 'var(--secondary)', marginRight: '0.4rem' }}>▸</span>{renderHighlightedText(term)}
                          </summary>
                          <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div>
                              <strong>{language === 'en' ? 'Rigorous:' : '厳密な定義:'}</strong> {renderHighlightedText(rigor)}
                            </div>
                            <div style={{ borderLeft: '2px solid var(--secondary)', paddingLeft: '0.4rem', fontStyle: 'italic', background: 'rgba(212,175,55,0.02)' }}>
                              <strong>{language === 'en' ? 'Analogy:' : '直感的イメージ:'}</strong> {renderHighlightedText(analogy)}
                            </div>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Foundational Concepts Quick Reference */}
              <div className="tied-foundations" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {language === 'en' ? 'Foundational References:' : '基礎概念リファレンス:'}
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
                      className="btn-lang"
                      style={{ fontSize: '0.625rem', padding: '3px 8px', borderRadius: '3px' }}
                    >
                      {language === 'en' ? item.nameEn : item.nameJa}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="placard-footer">
            <span>TNG COOP EXHIBITION</span>
            <span>STATION {currentStop}/25</span>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Exhibit Area (The Kiosk Screen) */}
        <div className="kiosk-panel">
          {currentStop === 1 && <OntologicalCycleVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 2 && <LebomboBoneVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 3 && <SumerianBullaVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 4 && <IncaQuipuVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 5 && <LanguageSynonymyVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 6 && <LindenbaumTarskiVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 7 && <TextileWeavingVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 8 && <OrigamiCreaseVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 10 && <ProjectiveGeometryVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 11 && <PathHomotopyVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 12 && <EinsteinSpacetimeVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 13 && <LambdaCalculusVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 15 && <RelationalAlgebraVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 16 && <RegExAutomataVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 17 && <TypeTheoryVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 18 && <HoTTVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 19 && <CategorySetsVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 20 && <CategoryMonoidsVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 21 && <FunctorialBridgesVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 22 && <AdjunctionDualityVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 23 && <UnitCounitVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 24 && <MonadsVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
          {currentStop === 25 && <YonedaVisualizer language={language} hoveredSymbol={hoveredSymbol || selectedSymbol} />}
        </div>

      </div>

    </div>
  );
}
