import { useState } from 'react';
import AdjunctionVisualizer from './components/AdjunctionVisualizer';

export default function App() {
  const getInitialLanguage = (): 'en' | 'ja' => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get('lang');
      return (lang === 'ja' || lang === 'jp') ? 'ja' : 'en';
    }
    return 'en';
  };

  const [language, setLanguageState] = useState<'en' | 'ja'>(getInitialLanguage);

  const setLanguage = (newLang: 'en' | 'ja') => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('lang', newLang);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  return (
    <div className="museum-app">
      {/* Immersive Museum Status Bar */}
      <header className="museum-header">
        <div className="museum-header-logo">
          <span>MathBasics</span>
          <span className="museum-header-exhibit">
            {language === 'en' 
              ? 'EXHIBIT #07: ONTOLOGY (FREE GENERATION & COLLAPSE)' 
              : '展示 #07：存在論的サイクル（自由生成と崩壊）'
            }
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
      </header>

      {/* Immersive Exhibit Room */}
      <main className="museum-main-viewport">
        <AdjunctionVisualizer language={language} />
      </main>
    </div>
  );
}
