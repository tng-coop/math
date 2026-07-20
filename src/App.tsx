import { useState } from 'react';
import AdjunctionVisualizer from './components/AdjunctionVisualizer';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'ja'>('en');

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
