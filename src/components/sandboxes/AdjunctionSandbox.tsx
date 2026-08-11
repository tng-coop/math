import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface AdjunctionProps {
  language: 'en' | 'ja';
}

// Monoid multiplication table for M = Z_3 (cyclic group of order 3)
// Elements: e (0), a (1), b (2)
// Identity: e
// a*a=b, a*b=e, b*b=a, b*a=e
const Z3_MULT: Record<string, Record<string, string>> = {
  'e': { 'e': 'e', 'a': 'a', 'b': 'b' },
  'a': { 'e': 'a', 'a': 'b', 'b': 'e' },
  'b': { 'e': 'b', 'a': 'e', 'b': 'a' }
};

export default function AdjunctionSandbox({ language }: AdjunctionProps) {
  // Left: mapping generators X = {x, y} to U(M) = {e, a, b}
  const [fMap, setFMap] = useState<Record<string, string>>({
    'x': 'a',
    'y': 'b'
  });

  // Multiplication helper in M
  const multiplyM = (elem1: string, elem2: string): string => {
    return Z3_MULT[elem1]?.[elem2] || 'e';
  };

  // Evaluate any word in F(X) = X* to an element of M
  const evaluateWord = (word: string): string => {
    if (!word || word === 'ε') return 'e';
    let result = 'e';
    for (let char of word) {
      const val = fMap[char] || 'e';
      result = multiplyM(result, val);
    }
    return result;
  };

  // List of words in F(X)
  const words = ['ε', 'x', 'y', 'xx', 'xy', 'yx', 'yy', 'xxx', 'xxy', 'xyx', 'xyy'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', color: 'white', background: 'rgba(15,15,20,0.85)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)' }}>
            {language === 'en' ? 'Concept V: Adjunction Duality Sandbox' : '概念V: 随伴双対性のサンドボックス'}
          </h3>
          <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 'bold' }}>
            ADJUNCTION ISOMORPHISM
          </span>
        </div>
        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {language === 'en'
            ? 'Hom-set isomorphism $\\text{Hom}_{\\mathbf{Mon}}(F(X), M) \\cong \\text{Hom}_{\\mathbf{Set}}(X, U(M))$. Setting the generators on the left uniquely lifts to the homomorphism on the right.'
            : 'Hom集合の全単射 $\\text{Hom}_{\\mathbf{Mon}}(F(X), M) \\cong \\text{Hom}_{\\mathbf{Set}}(X, U(M))$。左の生成元のマッピングが、右の単語全体の準同型写像を一意に決定（リフト）します。'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '1.25rem', flex: 1, minHeight: '360px' }}>
        
        {/* Left Category: Set */}
        <div style={{ background: 'rgba(245,158,11,0.02)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(245,158,11,0.15)', paddingBottom: '0.35rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#f59e0b' }}>Category Set (Raw Generators)</span>
            <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>f : X → U(M)</span>
          </div>

          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {language === 'en'
              ? 'Assign target elements for generators x and y. U(M) is the underlying set of Monoid M.'
              : '生成元 x と y のマッピング先を指定します。U(M) はモノイド M から演算構造を忘れた集合です。'}
          </p>

          <div style={{ flex: 1, position: 'relative', minHeight: '180px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {/* Set X */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', minWidth: '70px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#f59e0b' }}>Set X</span>
              {['x', 'y'].map(src => (
                <div key={src} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1.5px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {src}
                  </div>
                  <select
                    value={fMap[src]}
                    onChange={(e) => setFMap({ ...fMap, [src]: e.target.value })}
                    style={{ background: 'black', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px', fontSize: '0.65rem', padding: '2px' }}
                  >
                    <option value="e">e (id)</option>
                    <option value="a">a</option>
                    <option value="b">b</option>
                  </select>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.3)' }}>↦</div>

            {/* Set U(M) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', minWidth: '70px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#3b82f6' }}>Set U(M)</span>
              {['e', 'a', 'b'].map(val => {
                const isTargetOfX = fMap['x'] === val;
                const isTargetOfY = fMap['y'] === val;

                return (
                  <div
                    key={val}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      background: 'rgba(59,130,246,0.1)',
                      border: '1.5px solid #3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      position: 'relative',
                      boxShadow: (isTargetOfX || isTargetOfY) ? '0 0 8px rgba(59,130,246,0.5)' : 'none'
                    }}
                  >
                    {val}
                    {/* Tiny badges for generators */}
                    <div style={{ position: 'absolute', right: '-8px', top: '-4px', display: 'flex', gap: '2px' }}>
                      {isTargetOfX && <span style={{ fontSize: '0.5rem', background: '#f59e0b', color: 'black', borderRadius: '2px', padding: '1px 3px', fontWeight: 'bold' }}>x</span>}
                      {isTargetOfY && <span style={{ fontSize: '0.5rem', background: '#f59e0b', color: 'black', borderRadius: '2px', padding: '1px 3px', fontWeight: 'bold' }}>y</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Category: Monoid */}
        <div style={{ background: 'rgba(16,185,129,0.02)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(16,185,129,0.15)', paddingBottom: '0.35rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>Category Mon (Lifted Algebra)</span>
            <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>F(f) : F(X) → M</span>
          </div>

          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {language === 'en'
              ? 'Unique Monoid Homomorphism induced automatically. Notice how products evaluate under Z₃ algebra.'
              : '自動的に誘起された唯一のモノイド準同型。単語の結合がZ₃モノイドの乗法に従って評価されます。'}
          </p>

          <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)', padding: '0.5rem', overflowY: 'auto', maxHeight: '200px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                  <th style={{ textAlign: 'left', padding: '4px' }}>F(X) (Words)</th>
                  <th></th>
                  <th style={{ textAlign: 'right', padding: '4px' }}>M (Z₃ Value)</th>
                </tr>
              </thead>
              <tbody>
                {words.map(w => {
                  const val = evaluateWord(w);
                  return (
                    <tr key={w} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ fontFamily: 'monospace', padding: '4px', color: '#f59e0b', fontWeight: 'bold' }}>{w}</td>
                      <td style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}><ArrowRight size={10} style={{ display: 'inline' }} /></td>
                      <td style={{ fontFamily: 'monospace', padding: '4px', textAlign: 'right', color: '#10b981', fontWeight: 'bold' }}>{val}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.35rem', borderRadius: '4px', marginTop: '0.5rem', fontSize: '0.58rem', display: 'flex', flexDirection: 'column', gap: '2px', fontFamily: 'monospace' }}>
            <span style={{ color: '#10b981' }}>Example:</span>
            <span>F(xy) = F(x) • F(y) = {fMap['x']} * {fMap['y']} = {multiplyM(fMap['x'], fMap['y'])}</span>
            <span>F(yy) = F(y) • F(y) = {fMap['y']} * {fMap['y']} = {multiplyM(fMap['y'], fMap['y'])}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
