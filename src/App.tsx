import { GraduationCap, Home } from 'lucide-react';
import AdjunctionVisualizer from './components/AdjunctionVisualizer';

export default function App() {
  return (
    <div className="container flex-grow flex flex-col justify-between min-h-[90vh]">
      <div>
        {/* Header Section */}
        <header className="text-center mb-10 animate-pop-in">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 mb-3 text-primary">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2 font-mono">
            MathBasics
          </h1>
          <p className="text-text-muted max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Free Generation and Collapse: The universal dynamics of Adjoint Functors (F ⊣ U) in Category Theory.
          </p>
        </header>

        {/* Adjunction Workspace */}
        <main className="flex-grow">
          <AdjunctionVisualizer />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-slate-800/80 text-center text-xs text-text-muted flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          &copy; {new Date().getFullYear()} TNG Worker Cooperative. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://tng.coop"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-main transition-colors flex items-center gap-1 font-semibold"
          >
            <Home size={12} /> TNG Coop Homepage
          </a>
        </div>
      </footer>
    </div>
  );
}
