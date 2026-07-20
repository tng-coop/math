import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Play, Pause, Square, FastForward, Rewind
} from 'lucide-react';
import { roomsData } from '../data/curriculumData';
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
  MonadsVisualizer
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
          {currentStop === 1 && <OntologicalCycleVisualizer language={language} />}
          {currentStop === 2 && <LebomboBoneVisualizer language={language} />}
          {currentStop === 3 && <SumerianBullaVisualizer language={language} />}
          {currentStop === 4 && <IncaQuipuVisualizer language={language} />}
          {currentStop === 5 && <LanguageSynonymyVisualizer language={language} />}
          {currentStop === 6 && <LindenbaumTarskiVisualizer language={language} />}
          {currentStop === 7 && <TextileWeavingVisualizer language={language} />}
          {currentStop === 8 && <OrigamiCreaseVisualizer language={language} />}
          {currentStop === 10 && <ProjectiveGeometryVisualizer language={language} />}
          {currentStop === 11 && <PathHomotopyVisualizer language={language} />}
          {currentStop === 12 && <EinsteinSpacetimeVisualizer language={language} />}
          {currentStop === 13 && <LambdaCalculusVisualizer language={language} />}
          {currentStop === 15 && <RelationalAlgebraVisualizer language={language} />}
          {currentStop === 16 && <RegExAutomataVisualizer language={language} />}
          {currentStop === 17 && <TypeTheoryVisualizer language={language} />}
          {currentStop === 18 && <HoTTVisualizer language={language} />}
          {currentStop === 19 && <CategorySetsVisualizer language={language} />}
          {currentStop === 20 && <CategoryMonoidsVisualizer language={language} />}
          {currentStop === 21 && <FunctorialBridgesVisualizer language={language} />}
          {currentStop === 22 && <AdjunctionDualityVisualizer language={language} />}
          {currentStop === 23 && <UnitCounitVisualizer language={language} />}
          {currentStop === 24 && <MonadsVisualizer language={language} />}
        </div>

      </div>

    </div>
  );
}
