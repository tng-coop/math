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
      return params.get('exhibit') || '3'; // Default to Hall 3 Quotient Topology
    }
    return '3';
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
        case '3':
          return 'EXHIBIT #03: QUOTIENT TOPOLOGY (TORUS FOLDING)';
        case '5':
          return 'EXHIBIT #05: ALGEBRAIC EVALUATION (AST REDUCTION)';
        case '7':
          return 'EXHIBIT #07: ONTOLOGY (FREE GENERATION & COLLAPSE)';
        case '10':
        default:
          return 'EXHIBIT #10: THE YONEDA LEMMA (EXISTENCE AS RELATION)';
      }
    } else {
      switch (exhibit) {
        case '3':
          return '展示 #03：商位相（トーラス境界接着）';
        case '5':
          return '展示 #05：代数的評価（AST簡約）';
        case '7':
          return '展示 #07：存在論的サイクル（自由生成と崩壊）';
        case '10':
        default:
          return '展示 #10：米田の補題（関係性としての存在）';
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
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button 
            onClick={() => setExhibit('3')} 
            className={`btn-lang ${exhibit === '3' ? 'active' : ''}`}
            style={{ fontSize: '0.725rem', padding: '4px 10px' }}
          >
            EXHIBIT 03
          </button>
          <button 
            onClick={() => setExhibit('5')} 
            className={`btn-lang ${exhibit === '5' ? 'active' : ''}`}
            style={{ fontSize: '0.725rem', padding: '4px 10px' }}
          >
            EXHIBIT 05
          </button>
          <button 
            onClick={() => setExhibit('7')} 
            className={`btn-lang ${exhibit === '7' ? 'active' : ''}`}
            style={{ fontSize: '0.725rem', padding: '4px 10px' }}
          >
            EXHIBIT 07
          </button>
          <button 
            onClick={() => setExhibit('10')} 
            className={`btn-lang ${exhibit === '10' ? 'active' : ''}`}
            style={{ fontSize: '0.725rem', padding: '4px 10px' }}
          >
            EXHIBIT 10
          </button>
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
        {exhibit === '3' && <Hall3Visualizer language={language} />}
        {exhibit === '5' && <Hall5Visualizer language={language} />}
        {exhibit === '7' && <AdjunctionVisualizer language={language} />}
        {exhibit === '10' && <Hall10Visualizer language={language} />}
      </main>
    </div>
  );
}
