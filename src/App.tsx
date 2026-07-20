import { useState } from 'react';
import AdjunctionVisualizer from './components/AdjunctionVisualizer';
import Hall3Visualizer from './components/Hall3Visualizer';
import Hall5Visualizer from './components/Hall5Visualizer';
import Hall10Visualizer from './components/Hall10Visualizer';

export default function App() {
  const getInitialLanguage = (): 'en' | 'ja' => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get('lang');
      return (lang === 'ja' || lang === 'jp') ? 'ja' : 'en';
    }
    return 'en';
  };

  const getInitialExhibit = (): string => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('exhibit') || '1'; // Default to Hall 1 Entrance
    }
    return '1';
  };

  const [language, setLanguageState] = useState<'en' | 'ja'>(getInitialLanguage);
  const [exhibit, setExhibitState] = useState<string>(getInitialExhibit);

  const setLanguage = (newLang: 'en' | 'ja') => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('lang', newLang);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const setExhibit = (newEx: string) => {
    setExhibitState(newEx);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('exhibit', newEx);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const getExhibitTitle = () => {
    if (language === 'en') {
      switch (exhibit) {
        case '1':
          return 'EXHIBIT #01: THE ONTOLOGICAL CYCLE (MUSEUM ENTRANCE)';
        case '2':
          return 'EXHIBIT #02: DISCRETE TALLIES (PEBBLES & BONE NOTCHES)';
        case '3':
          return 'EXHIBIT #03: QUOTIENT TOPOLOGY (TORUS FOLDING)';
        case '4':
          return 'EXHIBIT #04: LANGUAGE & GRAMMAR (SEMANTIC SYNONYMY)';
        case '5':
          return 'EXHIBIT #05: COMPUTATION ALGORITHMS (AST EVALUATION)';
        case '6':
          return 'EXHIBIT #06: CATEGORY OF SETS (THE RAW MATERIALS)';
        case '7':
          return 'EXHIBIT #07: ADJUNCTION DUALITY (FREE FUNCTOR F ⊣ U)';
        case '8':
          return 'EXHIBIT #08: EXISTENCE AS RELATION (YONEDA PRELUDE)';
        case '9':
          return 'EXHIBIT #09: REPRESENTABLE FUNCTOR HOM(A, -)';
        case '10':
        default:
          return 'EXHIBIT #10: THE YONEDA LEMMA (NATURAL ISOMORPHISM)';
      }
    } else {
      switch (exhibit) {
        case '1':
          return '展示 #01：存在論的サイクル（美術館入口）';
        case '2':
          return '展示 #02：離散的数え上げ（小石と骨の刻み目）';
        case '3':
          return '展示 #03：商位相（トーラス境界接着）';
        case '4':
          return '展示 #04：言語と文法（同義語の商化）';
        case '5':
          return '展示 #05：代数的評価（AST簡約）';
        case '6':
          return '展示 #06：集合の圏（構造のない生の素材）';
        case '7':
          return '展示 #07：随伴の双対性（自由関手 F ⊣ U）';
        case '8':
          return '展示 #08：関係性としての存在（米田の補題導入）';
        case '9':
          return '展示 #09：表現可能関手 Hom(A, -)';
        case '10':
        default:
          return '展示 #10：米田の補題（自然同型と可換性）';
      }
    }
  };

  return (
    <div className="museum-app">
      {/* Immersive Museum Status Bar */}
      <header className="museum-header">
        <div className="museum-header-logo">
          <span>MathBasics</span>
          <span className="museum-header-exhibit">
            {getExhibitTitle()}
          </span>
        </div>

        {/* Exhibit Selector Navigation */}
        <div className="exhibit-selector-scroll" style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', overflowX: 'auto', maxWidth: '65%' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((num) => (
            <button
              key={num}
              onClick={() => setExhibit(num)}
              className={`btn-lang ${exhibit === num ? 'active' : ''}`}
              style={{ fontSize: '0.625rem', padding: '3px 7px', minWidth: '46px', textAlign: 'center' }}
            >
              {num.padStart(2, '0')}
            </button>
          ))}
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
      </header>

      {/* Immersive Exhibit Room */}
      <main className="museum-main-viewport">
        {exhibit === '1' && <AdjunctionVisualizer language={language} forcedRoom={1} />}
        {exhibit === '2' && <AdjunctionVisualizer language={language} forcedRoom={2} />}
        {exhibit === '3' && <Hall3Visualizer language={language} onlyVisualizer={false} />}
        {exhibit === '4' && <AdjunctionVisualizer language={language} forcedRoom={3} />}
        {exhibit === '5' && <Hall5Visualizer language={language} onlyVisualizer={false} />}
        {exhibit === '6' && <AdjunctionVisualizer language={language} forcedRoom={5} />}
        {exhibit === '7' && <AdjunctionVisualizer language={language} forcedRoom={6} />}
        {exhibit === '8' && <Hall10Visualizer language={language} forcedRoom={1} />}
        {exhibit === '9' && <Hall10Visualizer language={language} forcedRoom={2} />}
        {exhibit === '10' && <Hall10Visualizer language={language} forcedRoom={4} />}
      </main>
    </div>
  );
}
