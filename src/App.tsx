import { useState, useEffect } from 'react';
import AdjunctionVisualizer from './components/AdjunctionVisualizer';
import Hall3Visualizer from './components/Hall3Visualizer';
import Hall5Visualizer from './components/Hall5Visualizer';
import FoundationsVisualizer from './components/FoundationsVisualizer';
import { roomsData } from './data/curriculumData';

import {
  FreeGenSandbox,
  MappingsSandbox,
  QuotientsSandbox,
  CategoriesSandbox,
  AdjunctionSandbox
} from './components/sandboxes';

const wings = [
  {
    id: 'A',
    nameEn: 'Wing A: Anthropology & Syntax',
    nameJa: 'A翼：人類学と構文',
    rooms: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 'B',
    nameEn: 'Wing B: Topology & Gluing',
    nameJa: 'B翼：トポロジーと接着',
    rooms: [7, 8, 9, 10, 11, 12]
  },
  {
    id: 'C',
    nameEn: 'Wing C: Computation & Collapse',
    nameJa: 'C翼：計算機と代数的評価',
    rooms: [13, 14, 15, 16, 17, 18]
  },
  {
    id: 'D',
    nameEn: 'Wing D: Category Formalization',
    nameJa: 'D翼：圏論的定式化',
    rooms: [19, 20, 21, 22, 23, 24, 25]
  },
  {
    id: 'F',
    nameEn: 'Wing F: Foundational Concepts',
    nameJa: 'F翼：基礎概念ライブラリ',
    rooms: [26, 27, 28, 29, 30]
  }
];

// Mapping of math symbol terms to their specific sandbox playground
const termToSandboxMap: Record<string, 'free-gen' | 'mappings' | 'quotients' | 'categories' | 'adjunctions'> = {
  // Free Gen (Concept I)
  'X': 'free-gen',
  'F(X)': 'free-gen',
  'F_{\\Sigma}(X)': 'free-gen',
  'X = [0,1]^2': 'free-gen',

  // Mappings (Concept II)
  'f: A \\to B': 'mappings',
  '\\text{eval}_v': 'mappings',

  // Quotients (Concept III)
  'R': 'quotients',
  '\\langle R \\rangle': 'quotients',
  'F(X)/\\langle R \\rangle': 'quotients',
  '\\pi': 'quotients',
  '\\pi_1(X, x_0)': 'quotients',
  'X/\\sim': 'quotients',
  '\\sim_v': 'quotients',
  '\\text{GROUP BY}': 'quotients',
  '\\equiv_L': 'quotients',

  // Categories (Concept IV)
  '\\text{Hom}(-, A)': 'categories',

  // Adjunctions (Concept V)
  'F \\dashv U': 'adjunctions',
  '\\eta': 'adjunctions',
  '\\varepsilon': 'adjunctions'
};

// Mapping of generic english/japanese words to sandbox
const wordToSandboxMap: Record<string, 'free-gen' | 'mappings' | 'quotients' | 'categories' | 'adjunctions'> = {
  'free': 'free-gen',
  'free generation': 'free-gen',
  'generator': 'free-gen',
  'generators': 'free-gen',
  'injective': 'mappings',
  'surjective': 'mappings',
  'bijective': 'mappings',
  'mapping': 'mappings',
  'mappings': 'mappings',
  'function': 'mappings',
  'functions': 'mappings',
  'monomorphism': 'mappings',
  'epimorphism': 'mappings',
  'isomorphism': 'mappings',
  'quotient': 'quotients',
  'quotients': 'quotients',
  'coequalizer': 'quotients',
  'equivalence': 'quotients',
  'category': 'categories',
  'categories': 'categories',
  'functor': 'categories',
  'functors': 'categories',
  'morphism': 'categories',
  'morphisms': 'categories',
  'adjunction': 'adjunctions',
  'adjunctions': 'adjunctions',
  '自由生成': 'free-gen',
  '写像': 'mappings',
  '関数': 'mappings',
  '商集合': 'quotients',
  '同値関係': 'quotients',
  '圏': 'categories',
  '関手': 'categories',
  '随伴': 'adjunctions'
};

export default function App() {
  const getInitialLanguage = (): 'en' | 'ja' => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get('lang');
      return (lang === 'ja' || lang === 'jp') ? 'ja' : 'en';
    }
    return 'en';
  };

  const getInitialRoom = (): number => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roomVal = parseInt(params.get('exhibit') || '1', 10);
      return (roomVal >= 1 && roomVal <= 30) ? roomVal : 1;
    }
    return 1;
  };

  const [language, setLanguageState] = useState<'en' | 'ja'>(getInitialLanguage);
  const [activeRoom, setActiveRoomState] = useState<number>(getInitialRoom);
  const [activeSandbox, setActiveSandbox] = useState<'free-gen' | 'mappings' | 'quotients' | 'categories' | 'adjunctions' | null>(null);

  const activeWing = wings.find(w => w.rooms.includes(activeRoom)) || wings[0];

  const setLanguage = (newLang: 'en' | 'ja') => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('lang', newLang);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const setActiveRoom = (roomNum: number) => {
    setActiveRoomState(roomNum);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('exhibit', roomNum.toString());
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  // Register listener for Custom Event to open a sandbox drawer
  useEffect(() => {
    const handleOpenDrawer = (e: Event) => {
      const customEvent = e as CustomEvent<{ term: string }>;
      const term = customEvent.detail?.term;
      if (!term) return;

      // 1. Try mapping as strict math symbol
      let sandboxId = termToSandboxMap[term];
      
      // 2. Try mapping as word/tag (lowercase)
      if (!sandboxId) {
        const lowerWord = term.toLowerCase().trim();
        sandboxId = wordToSandboxMap[lowerWord];
      }

      if (sandboxId) {
        setActiveSandbox(sandboxId);
      }
    };

    window.addEventListener('open-sandbox-drawer', handleOpenDrawer);
    return () => {
      window.removeEventListener('open-sandbox-drawer', handleOpenDrawer);
    };
  }, []);

  return (
    <div className="museum-app">
      {/* Immersive Museum Status Bar */}
      <header className="museum-header" style={{ flexDirection: 'column', height: 'auto', padding: '0.75rem 1.5rem', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div className="museum-header-logo" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>MathBasics</span>
            <span className="museum-header-exhibit" style={{ fontSize: '0.7rem', color: 'var(--primary)', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '1rem' }}>
              {language === 'en' ? activeWing.nameEn : activeWing.nameJa}
            </span>
          </div>

          {/* Bilingual Language Switch Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => setLanguage('en')} 
              className={`btn-lang ${language === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>|</span>
            <button 
              onClick={() => setLanguage('ja')} 
              className={`btn-lang ${language === 'ja' ? 'active' : ''}`}
            >
              JP
            </button>
          </div>
        </div>

        {/* Wing Selector Navigation */}
        <div className="wing-selector-container" style={{ display: 'flex', gap: '0.5rem', width: '100%', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
          {wings.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveRoom(w.rooms[0])}
              className={`btn-lang ${activeWing.id === w.id ? 'active' : ''}`}
              style={{ fontSize: '0.65rem', padding: '4px 12px', minWidth: '120px', whiteSpace: 'nowrap', borderRadius: '4px' }}
            >
              {language === 'en' ? w.nameEn : w.nameJa}
            </button>
          ))}
        </div>

        {/* Room Selector Navigation */}
        <div className="room-selector-container" style={{ display: 'flex', gap: '0.3rem', width: '100%', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {activeWing.rooms.map((roomNum) => {
            const rData = roomsData[roomNum];
            const name = language === 'en' ? rData.nameEn : rData.nameJa;
            return (
              <button
                key={roomNum}
                onClick={() => setActiveRoom(roomNum)}
                className={`btn-lang ${activeRoom === roomNum ? 'active' : ''}`}
                style={{ fontSize: '0.6rem', padding: '3px 8px', whiteSpace: 'nowrap', borderRadius: '3px' }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main split-screen container */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', width: '100%' }}>
        
        {/* Left Side: Main Exhibit Viewport */}
        <div style={{
          width: activeSandbox ? '50%' : '100%',
          transition: 'width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <main className="museum-main-viewport">
            {activeRoom === 9 ? (
              <Hall3Visualizer language={language} onlyVisualizer={false} onNavigate={setActiveRoom} />
            ) : activeRoom === 14 ? (
              <Hall5Visualizer language={language} onlyVisualizer={false} onNavigate={setActiveRoom} />
            ) : activeRoom >= 26 ? (
              <FoundationsVisualizer language={language} forcedRoom={activeRoom} onNavigate={setActiveRoom} />
            ) : (
              <AdjunctionVisualizer language={language} forcedRoom={activeRoom} onNavigate={setActiveRoom} />
            )}
          </main>
        </div>

        {/* Right Side: Split-screen Sliding Sandbox Overlay */}
        <div style={{
          width: activeSandbox ? '50%' : '0%',
          opacity: activeSandbox ? 1 : 0,
          pointerEvents: activeSandbox ? 'auto' : 'none',
          transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          borderLeft: activeSandbox ? '1.5px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
          background: 'rgba(10, 10, 15, 0.9)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 100
        }}>
          {activeSandbox && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
              {/* Panel Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {language === 'en' ? 'Interactive Sandbox Overlay' : '対話型サンドボックス・オーバーレイ'}
                </span>
                <button
                  onClick={() => setActiveSandbox(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}
                >
                  {language === 'en' ? 'Close Panel ✕' : '閉じる ✕'}
                </button>
              </div>

              {/* Dynamic Sandbox selector */}
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                {activeSandbox === 'free-gen' && <FreeGenSandbox language={language} />}
                {activeSandbox === 'mappings' && <MappingsSandbox language={language} />}
                {activeSandbox === 'quotients' && <QuotientsSandbox language={language} />}
                {activeSandbox === 'categories' && <CategoriesSandbox language={language} />}
                {activeSandbox === 'adjunctions' && <AdjunctionSandbox language={language} />}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
