import { useState, useMemo } from 'react';
import { AlertCircle, Plus, Info } from 'lucide-react';

interface ASTNode {
  id: string;
  type: 'generator' | 'binary' | 'unary';
  value: string;
  left?: ASTNode;
  right?: ASTNode;
}

interface FreeGenProps {
  language: 'en' | 'ja';
}

export default function FreeGenSandbox({ language }: FreeGenProps) {
  const [generators, setGenerators] = useState<string[]>(['a', 'b', 'c']);
  const [newGen, setNewGen] = useState('');
  const [inputText, setInputText] = useState('a * (b * a)');
  const [parseError, setParseError] = useState<string | null>(null);

  // Pre-loaded presets for ease of play
  const presets = [
    { labelEn: 'Simple Node', labelJa: '単一ノード', expr: 'a' },
    { labelEn: 'Concatenation', labelJa: '単純結合', expr: 'a * b' },
    { labelEn: 'Left Associative', labelJa: '左結合木', expr: '(a * b) * c' },
    { labelEn: 'Right Associative', labelJa: '右結合木', expr: 'a * (b * c)' },
    { labelEn: 'Complex Tree', labelJa: '複合同反転', expr: '(a * b) * (c * a)' },
  ];

  // Helper to add a custom generator
  const handleAddGenerator = () => {
    const cleaned = newGen.trim().toLowerCase();
    if (cleaned && cleaned.length === 1 && /^[a-z]$/.test(cleaned)) {
      if (!generators.includes(cleaned)) {
        setGenerators([...generators, cleaned]);
        setNewGen('');
      } else {
        setParseError(language === 'en' ? 'Generator already exists' : '生成元は既に存在します');
      }
    } else {
      setParseError(language === 'en' ? 'Generator must be a single letter a-z' : '生成元はa-zの1文字である必要があります');
    }
  };

  // Simple token parser to build the AST from the expression
  // Supports generators, binary multiplication '*' and parentheses '()'
  const parseExpression = (expr: string): ASTNode => {
    const tokens = expr.replace(/\s+/g, '').split(/([a-z]|\*|\(|\))/g).filter(Boolean);
    let tokenIndex = 0;

    const parsePrimary = (): ASTNode => {
      if (tokenIndex >= tokens.length) {
        throw new Error(language === 'en' ? 'Unexpected end of expression' : '数式の末尾に予期しない文字があります');
      }
      const token = tokens[tokenIndex];
      if (generators.includes(token)) {
        tokenIndex++;
        return { id: Math.random().toString(), type: 'generator', value: token };
      } else if (token === '(') {
        tokenIndex++; // consume '('
        const node = parseExpr();
        if (tokenIndex >= tokens.length || tokens[tokenIndex] !== ')') {
          throw new Error(language === 'en' ? "Missing closing parenthesis ')'" : '閉じカッコ \')\' がありません');
        }
        tokenIndex++; // consume ')'
        return node;
      } else {
        throw new Error(language === 'en' ? `Unexpected token: ${token}` : `予期しないトークン: ${token}`);
      }
    };

    const parseExpr = (): ASTNode => {
      let left = parsePrimary();
      while (tokenIndex < tokens.length && tokens[tokenIndex] === '*') {
        tokenIndex++; // consume '*'
        const right = parsePrimary();
        left = {
          id: Math.random().toString(),
          type: 'binary',
          value: '•',
          left,
          right
        };
      }
      return left;
    };

    const ast = parseExpr();
    if (tokenIndex < tokens.length) {
      throw new Error(language === 'en' ? 'Extra tokens at end of expression' : '数式の末尾に余分なトークンがあります');
    }
    return ast;
  };

  const ast = useMemo(() => {
    try {
      setParseError(null);
      return parseExpression(inputText);
    } catch (e: any) {
      setParseError(e.message);
      return null;
    }
  }, [inputText, generators, language]);

  // Layout calculations for drawing the AST tree inside SVG
  const layoutTree = (
    node: ASTNode | undefined,
    x: number,
    y: number,
    hSpacing: number,
    levelHeight: number
  ): { nodes: any[]; links: any[] } => {
    if (!node) return { nodes: [], links: [] };

    let nodes: any[] = [{ id: node.id, x, y, value: node.value, type: node.type }];
    let links: any[] = [];

    if (node.left) {
      const leftX = x - hSpacing;
      const leftY = y + levelHeight;
      const leftLayout = layoutTree(node.left, leftX, leftY, hSpacing * 0.5, levelHeight);
      nodes = [...nodes, ...leftLayout.nodes];
      links = [...links, { from: { x, y }, to: { x: leftX, y: leftY } }, ...leftLayout.links];
    }

    if (node.right) {
      const rightX = x + hSpacing;
      const rightY = y + levelHeight;
      const rightLayout = layoutTree(node.right, rightX, rightY, hSpacing * 0.5, levelHeight);
      nodes = [...nodes, ...rightLayout.nodes];
      links = [...links, { from: { x, y }, to: { x: rightX, y: rightY } }, ...rightLayout.links];
    }

    return { nodes, links };
  };

  const treeLayout = useMemo(() => {
    if (!ast) return null;
    return layoutTree(ast, 250, 40, 100, 45);
  }, [ast]);

  // List of first 25 elements in Free Monoid F(X)
  const freeMonoidElements = useMemo(() => {
    const list: string[] = ['ε'];
    let queue = [''];
    while (queue.length > 0 && list.length < 25) {
      const curr = queue.shift()!;
      for (const g of generators) {
        const next = curr + g;
        list.push(next);
        queue.push(next);
      }
    }
    return list;
  }, [generators]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', color: 'white', background: 'rgba(15,15,20,0.85)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Title & Theory */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)', textShadow: '0 0 10px rgba(245,158,11,0.2)' }}>
            {language === 'en' ? 'Concept I: Free Generation Playground' : '概念I: 自由生成プレイグラウンド'}
          </h3>
          <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.3)', fontWeight: 'bold' }}>
            SYNTAX SPACE
          </span>
        </div>
        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {language === 'en'
            ? 'Free generation builds raw syntactic terms from generators without any equivalence relations. The syntax tree expands infinitely under operations.'
            : '自由生成とは、一切の等価関係を入れずに、生成元から生の構文を組み立てる行為です。演算によって項の木が無限に拡大します。'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem', flex: 1, minHeight: '350px' }}>
        
        {/* Left Panel: Syntax Editor & Generative Tools */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* Generator Config */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              {language === 'en' ? '1. Alphabet / Generators (Set X):' : '1. 生成元のアルファベット集合 (X):'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              {generators.map(g => (
                <span key={g} style={{ padding: '3px 8px', fontSize: '0.75rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 'bold', color: '#f59e0b' }}>
                  {g}
                </span>
              ))}
              
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                <input
                  type="text"
                  maxLength={1}
                  value={newGen}
                  onChange={e => setNewGen(e.target.value)}
                  placeholder="d"
                  style={{ width: '30px', background: 'black', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '3px', fontSize: '0.7rem', padding: '1px 3px', textAlign: 'center' }}
                />
                <button onClick={handleAddGenerator} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '3px', cursor: 'pointer', padding: '1px 5px', display: 'flex', alignItems: 'center' }}>
                  <Plus size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Preset terms */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              {language === 'en' ? 'Quick Term Presets:' : '項プリセット:'}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {presets.map(p => (
                <button
                  key={p.expr}
                  onClick={() => setInputText(p.expr)}
                  style={{
                    fontSize: '0.625rem',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: inputText === p.expr ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.03)',
                    border: inputText === p.expr ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
                    color: inputText === p.expr ? '#f59e0b' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer'
                  }}
                >
                  {language === 'en' ? p.labelEn : p.labelJa} ({p.expr})
                </button>
              ))}
            </div>
          </div>

          {/* Typewriter Input Grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
              {language === 'en' ? '2. Construct Term Syntax (Type or Click):' : '2. 構文項の組み立て (入力またはクリック):'}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                style={{ flex: 1, background: 'black', border: '1px solid rgba(255,255,255,0.15)', color: '#f59e0b', borderRadius: '4px', fontSize: '0.8rem', padding: '6px 10px', fontFamily: 'monospace' }}
              />
              <button 
                onClick={() => setInputText('a')}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', padding: '0 10px', fontSize: '0.7rem' }}
              >
                Reset
              </button>
            </div>

            {/* Virtual Keyboard */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '6px' }}>
              {generators.map(g => (
                <button
                  key={g}
                  onClick={() => setInputText(prev => prev === 'a' && inputText.length === 1 ? g : `${prev} * ${g}`)}
                  style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'monospace' }}
                >
                  {g}
                </button>
              ))}
              <button
                onClick={() => setInputText(prev => `${prev} * `)}
                style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#f59e0b', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'monospace' }}
              >
                *
              </button>
              <button
                onClick={() => setInputText(prev => `(${prev})`)}
                style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                ( )
              </button>
            </div>

            {parseError && (
              <div style={{ color: '#ef4444', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(239,68,68,0.05)', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.15)' }}>
                <AlertCircle size={12} />
                <span>{parseError}</span>
              </div>
            )}
          </div>

          {/* Academic Rigor Info Box */}
          <div style={{ background: 'rgba(245,158,11,0.02)', borderLeft: '3px solid #f59e0b', padding: '0.5rem 0.75rem', borderRadius: '0 4px 4px 0', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem', color: '#f59e0b', fontWeight: 'bold' }}>
              <Info size={11} />
              <span>Universal Property of F(X)</span>
            </div>
            {language === 'en' ? (
              <span>{"Let $i: X \\to U(F(X))$ be the canonical injection. For any monoid $M$ and set map $f: X \\to U(M)$, there exists a unique monoid homomorphism \\bar{f}: F(X) \\to M$ such that $U(\\bar{f}) \\circ i = f$."}</span>
            ) : (
              <span>{"$i: X \\to U(F(X))$ を自然な埋め込みとします。任意のモノイド $M$ と写像 $f: X \\to U(M)$ に対し、 $U(\\bar{f}) \\circ i = f$ を満たす唯一のモノイド準同型 \\bar{f}: F(X) \\to M$ が存在します。"}</span>
            )}
          </div>
        </div>

        {/* Right Panel: SVG Visualizer of Free Term Tree */}
        <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              {language === 'en' ? 'Algebraic Word Space' : '代数的な単語・木の空間'}
            </span>
          </div>

          <div style={{ flex: 1, position: 'relative', minHeight: '200px', background: 'radial-gradient(circle at center, rgba(245,158,11,0.05) 0%, transparent 70%)' }}>
            {treeLayout ? (
              <svg width="100%" height="100%" viewBox="0 0 500 240" style={{ display: 'block' }}>
                <defs>
                  <pattern id="grid-amber" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(245,158,11,0.03)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-amber)" />

                {/* Draw links */}
                {treeLayout.links.map((link, idx) => (
                  <line
                    key={idx}
                    x1={link.from.x}
                    y1={link.from.y}
                    x2={link.to.x}
                    y2={link.to.y}
                    stroke="rgba(245, 158, 11, 0.4)"
                    strokeWidth={1.5}
                    strokeDasharray="2,2"
                  />
                ))}

                {/* Draw nodes */}
                {treeLayout.nodes.map(node => (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    <circle
                      r={node.type === 'generator' ? 12 : 14}
                      fill={node.type === 'generator' ? '#f59e0b' : '#0a0a0c'}
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.4))' }}
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill={node.type === 'generator' ? 'black' : '#f59e0b'}
                      fontSize={node.type === 'generator' ? '0.75rem' : '1rem'}
                      fontWeight="bold"
                      fontFamily="serif"
                    >
                      {node.value}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.75rem', color: '#ef4444' }}>
                {language === 'en' ? 'Fix expression syntax to grow tree' : '構文エラーを修正すると木が生成されます'}
              </div>
            )}
          </div>

          {/* Underpinning list of free monoid items */}
          <div style={{ height: '80px', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', overflowY: 'auto' }}>
            <span style={{ fontSize: '0.58rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: '0.25rem' }}>
              {language === 'en' ? `First 25 Elements of Free Monoid F(X):` : `自由モノイド F(X) の最初の25個の要素:`}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
              {freeMonoidElements.map((el, i) => (
                <span key={i} style={{ fontSize: '0.625rem', fontFamily: 'monospace', padding: '2px 5px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', color: 'rgba(255,255,255,0.6)' }}>
                  {el || 'ε'}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
