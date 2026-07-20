import { useState } from 'react';
import AdjunctionVisualizer from './components/AdjunctionVisualizer';
import Hall3Visualizer from './components/Hall3Visualizer';
import Hall5Visualizer from './components/Hall5Visualizer';
import Hall10Visualizer from './components/Hall10Visualizer';
import { roomsData } from './data/curriculumData';

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
  }
];

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
      return (roomVal >= 1 && roomVal <= 25) ? roomVal : 1;
    }
    return 1;
  };

  const [language, setLanguageState] = useState<'en' | 'ja'>(getInitialLanguage);
  const [activeRoom, setActiveRoomState] = useState<number>(getInitialRoom);

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

      {/* Immersive Exhibit Room */}
      <main className="museum-main-viewport">
        {activeRoom === 9 ? (
          <Hall3Visualizer language={language} onlyVisualizer={false} />
        ) : activeRoom === 14 ? (
          <Hall5Visualizer language={language} onlyVisualizer={false} />
        ) : activeRoom === 25 ? (
          <Hall10Visualizer language={language} forcedRoom={4} />
        ) : (
          <AdjunctionVisualizer language={language} forcedRoom={activeRoom} />
        )}
      </main>
    </div>
  );
}
