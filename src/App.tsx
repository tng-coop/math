import AdjunctionVisualizer from './components/AdjunctionVisualizer';

export default function App() {
  return (
    <div className="museum-app">
      {/* Immersive Museum Status Bar */}
      <header className="museum-header">
        <div className="museum-header-logo">
          <span>MathBasics</span>
          <span className="museum-header-exhibit">EXHIBIT #07: ONTOLOGY (FREE GENERATION & COLLAPSE)</span>
        </div>
        <div className="museum-header-credits">
          TNG Worker Cooperative &copy; {new Date().getFullYear()}
        </div>
      </header>

      {/* Immersive Exhibit Room */}
      <main className="museum-main-viewport">
        <AdjunctionVisualizer />
      </main>
    </div>
  );
}
