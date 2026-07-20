import AdjunctionVisualizer from './components/AdjunctionVisualizer';

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#060810] flex flex-col">
      {/* Immersive Museum Status Bar */}
      <header className="px-8 py-4 border-b border-primary/10 flex justify-between items-center bg-slate-950/20 backdrop-blur-md select-none">
        <div className="flex items-center gap-3">
          <span className="text-primary text-lg font-bold font-mono tracking-widest">MathBasics</span>
          <span className="text-text-muted text-xs font-semibold font-mono border-l border-primary/20 pl-3">EXHIBIT #07: ONTOLOGY (FREE GENERATION & COLLAPSE)</span>
        </div>
        <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase hidden sm:block">
          TNG Worker Cooperative &copy; {new Date().getFullYear()}
        </div>
      </header>

      {/* Immersive Exhibit Room */}
      <main className="flex-grow overflow-hidden flex flex-col justify-center">
        <AdjunctionVisualizer />
      </main>
    </div>
  );
}
