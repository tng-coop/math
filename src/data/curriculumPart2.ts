import type { RoomData } from './curriculumData';

export const roomsPart2: Record<number, RoomData> = {
  11: {
    id: 11,
    nameEn: "Hall XI: Path Homotopy & Fundamental Groups",
    nameJa: "第XI室：経路ホモトピー（基本群）",
    thesisEn: "Free space of all continuous loops vs. Quotienting by continuous deformation (homotopy equivalence) to form fundamental groups $\\pi_1(X)$.",
    thesisJa: "すべての連続ループの自由空間と、基本群を形成するための連続変形（ホモトピー同値）による商化。",
    en: {
      narrative: "How do we measure holes in spaces? We draw loops. On a space, we can trace infinitely many different closed loops starting and ending at a basepoint (free loop generation). If we quotient these loops by continuous deformation (declaring two loops equivalent if they can be warped into each other without crossing a hole), we obtain a discrete group that measures the space's topology: the Fundamental Group. This quotients continuous infinity into discrete algebraic invariants.",
      rigor: "Let $X$ be a topological space and $x_0 \\in X$ a basepoint. Let $\\Omega(X, x_0)$ be the set of continuous loops $\\gamma: [0,1] \\to X$ with $\\gamma(0)=\\gamma(1)=x_0$. We define $\\gamma_0 \\sim \\gamma_1$ if there exists a continuous homotopy $H: [0,1]\\times[0,1] \\to X$ such that $H(s, 0) = \\gamma_0(s)$, $H(s, 1) = \\gamma_1(s)$, and $H(0, t) = H(1, t) = x_0$ for all $s, t \\in [0,1]$. The fundamental group $\\pi_1(X, x_0)$ is the quotient set $\\Omega(X, x_0)/\\sim$. The group operation is induced by loop concatenation: $(\\gamma_0 * \\gamma_1)(s) = \\gamma_0(2s)$ for $s \\in [0, 1/2]$ and $\\gamma_1(2s-1)$ for $s \\in [1/2, 1]$. Associativity, identity, and inverse axioms hold strictly only on the quotient classes, yielding a well-defined group.",
      history: "Henri Poincaré introduced path homotopy in his groundbreaking paper *Analysis Situs* (1895), creating algebraic topology. It showed that we can understand continuous shapes through discrete algebraic quotient structures, converting continuous paths into discrete numbers of holes (like the winding number).",
      exercises: "1. Prove that the loop concatenation operation $*$ is compatible with homotopy: if $\\gamma_0 \\sim \\gamma_0'$ and $\\gamma_1 \\sim \\gamma_1'$, then $\\gamma_0 * \\gamma_1 \\sim \\gamma_0' * \\gamma_1'$.\n2. Prove that $\\pi_1(S^1, 1) \\cong \\mathbb{Z}$ by constructing the winding number mapping. Use the universal covering space $p: \\mathbb{R} \\to S^1$ (given by $x \\mapsto e^{2\\pi i x}$) and the Path Lifting Theorem to prove bijectivity."
    },
    ja: {
      narrative: "空間に開いた「穴」をどうやって測定するでしょうか？私たちはループを描きます。ある空間の上で、基準点から出発して戻ってくるループは無限に描くことができます。これはループの「自由生成」です。これらのループを「連続的な変形（穴をまたぐことなく一方を他方に変形できるなら同値）」によって商化すると、空間の穴をカウントする離散的な群「基本群」が得られます。これにより、連続的な無限大が離散的な代数的不変量へと商化されます。",
      rigor: "位相空間 $X$ と基準点 $x_0 \\in X$ に対し、連続ループ全体の集合を $\\Omega(X, x_0)$ とする。端点を固定した連続変形ホモトピーの存在による同値関係 $\\gamma_0 \\sim \\gamma_1$ を定義する。すなわち、連続写像 $H: [0,1]\\times[0,1] \\to X$ が存在して、すべての $s, t \\in [0,1]$ に対し $H(s, 0) = \\gamma_0(s)$, $H(s, 1) = \\gamma_1(s)$, $H(0, t) = H(1, t) = x_0$ が成り立つことである。基本群 $\\pi_1(X, x_0)$ は商集合 $\\Omega(X, x_0)/\\sim$ である。群演算はループの結合演算 $(\\gamma_0 * \\gamma_1)(s)$ （前半で $\\gamma_0$、後半で $\\gamma_1$ をなぞる）によって誘導される。結合法則、単位元、逆元の存在は商同値類の上でのみ厳密に成り立ち、群を構成する。",
      history: "アンリ・ポアンカレが1895年の記念碑的論文『位置の解析（Analysis Situs）』で導入し、代数的位相幾何学を創始しました。連続的な幾何学図形を、離散的な代数の商構造によって記述できることを示し、連続的な経路を巻き数などの離散的な整数（商）へと変換する道を開きました。",
      exercises: "1. パスの結合演算 $*$ がホモトピー関係と両立すること、すなわち $\\gamma_0 \\sim \\gamma_0'$ かつ $\\gamma_1 \\sim \\gamma_1'$ ならば $\\gamma_0 * \\gamma_1 \\sim \\gamma_0' * \\gamma_1'$ であることを証明せよ。\n2. 巻き数写像を構成することにより、$\\pi_1(S^1, 1) \\cong \\mathbb{Z}$ であることを証明せよ。普遍被覆空間 $p: \\mathbb{R} \\to S^1$ （$x \\mapsto e^{2\\pi i x}$）およびパス持ち上げ定理（Path Lifting Theorem）を用いて全単射性を示せ。"
    }
  },
  12: {
    id: 12,
    nameEn: "Hall XII: Einstein Spacetime & General Relativity",
    nameJa: "第XII室：アインシュタインの時空（一般相対性理論）",
    thesisEn: "Free flat Minkowski spacetime coordinates vs. Quotienting by energy-momentum distributions to curve and glue spacetime.",
    thesisJa: "自由な平坦ミンコフスキー時空座標と、時空を湾曲・接着するためのエネルギー・運動量分布による商化。",
    en: {
      narrative: "Einstein revolutionized gravity by geometry. Initially, special relativity defines a flat, rigid Minkowski spacetime coordinate system (free coordinates). General relativity asserts that the presence of matter and energy curves this coordinate grid. Coordinate systems are just labels (syntax); the physical universe is formed by quotienting the coordinate space under diffeomorphism equivalence, proving that physical reality is coordinate-invariant.",
      rigor: "Let $M$ be a smooth 4D manifold, and let $\\mathcal{M}(M)$ be the space of smooth Lorentzian metrics on $M$. The Einstein Field Equations, $R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$, determine the metric $g$ dynamically. However, physical spacetime geometry is not a single metric, but an equivalence class. The diffeomorphism group $\\text{Diff}(M)$ acts on $\\mathcal{M}(M)$ via pullback: $g \\sim \\phi^* g$ for $\\phi \\in \\text{Diff}(M)$. The physical space of solutions (or superspace) is the quotient space $\\mathcal{M}(M)/\\text{Diff}(M)$, quotienting out coordinate gauge choices.",
      history: "Albert Einstein presented General Relativity in 1915. It unified space, time, and gravity, proving that gravity is not an attractive force, but the natural curved geodesic path in a quotiented, coordinate-free spacetime manifold, showing that coordinate systems are gauge syntax that must be quotiented out.",
      exercises: "1. Prove that the Riemann curvature tensor is equivariant under diffeomorphisms, meaning $R(\\phi^* g) = \\phi^*(R(g))$ for any $\\phi \\in \\text{Diff}(M)$, confirming that the Einstein Field Equations are coordinate-invariant.\n2. Sketch the derivation of the Einstein Field Equations by varying the Einstein-Hilbert action $S[g] = \\int_M R \\sqrt{-g} \\, d^4x$ with respect to the metric tensor $g^{\\mu\\nu}$."
    },
    ja: {
      narrative: "アインシュタインは幾何学によって重力に革命を起こしました。特殊相対論は、平坦で硬いミンコフスキー時空座標を定義します。しかし一般相対論は、物質とエネルギーの存在がこの座標グリッドを歪めると主張します。座標系は単なるラベル（構文）であり、物理的な宇宙は、微分同相写像同値の下で座標空間を商化することで形成されます。物理的現少しは座標に依存しないのです。",
      rigor: "時空を滑らかな4次元多様体 $M$ とし、$\\mathcal{M}(M)$ を $M$ 上の滑らかなローレンツ計量の空間とする。アインシュタイン方程式 $R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$ が計量 $g$ を決定する。しかし、物理的な時空幾何学は単一の計量ではなく、その同値類である。微分同相写像群 $\\text{Diff}(M)$ はプルバックによって $\\mathcal{M}(M)$ に作用する：$g \\sim \\phi^* g$ （$\\phi \\in \\text{Diff}(M)$）。物理的な解の空間（あるいは超空間：superspace）は、座標というゲージの選択を商化した商空間 $\\mathcal{M}(M)/\\text{Diff}(M)$ である。",
      history: "1915年にアルベルト・アインシュタインによって発表されました。重力とは引っ張る力ではなく、質量とエネルギーの関係式によって商化され、歪んだ時空を物体がまっすぐ進もうとする測地線経路そのものであると証明しました。座標系は商化によって取り除かれるべき「ゲージ構文」であることを示しています。",
      exercises: "1. リーマン曲率テンソルが微分同相写像に関して同変であること、すなわち任意の $\\phi \\in \\text{Diff}(M)$ に対して $R(\\phi^* g) = \\phi^*(R(g))$ が成り立つことを証明し、アインシュタイン方程式が座標不変であることを確かめよ。\n2. アインシュタイン・ヒルベルト作用 $S[g] = \\int_M R \\sqrt{-g} \\, d^4x$ を計量テンソル $g^{\\mu\\nu}$ に関して変分することにより、アインシュタイン方程式が導出されるプロセスの骨子を証明せよ。"
    }
  },
  13: {
    id: 13,
    nameEn: "Hall XIII: Lambda Calculus (λ-Calculus)",
    nameJa: "第XIII室：ラムダ計算",
    thesisEn: "Free syntactic variable terms vs. Quotienting by β-reduction equivalence to compute results.",
    thesisJa: "自由な構文上の変数項と、計算結果を得るためのβ簡約同値性による商化。",
    en: {
      narrative: "Lambda calculus is the foundational syntax of computation. We write functions and variables as raw text terms (free syntax trees). But functions are meant to be executed, not just written. To run a program, we substitute arguments into function variables—applying beta-reduction. Computation is the quotient process that collapses raw lambda terms into equivalent evaluated values, establishing execution as a quotient relation.",
      rigor: "Let $\\Lambda$ be the set of lambda terms generated by variables $x$, abstractions $\\lambda x. M$, and applications $M N$. The equivalence relation $\\sim_{\\beta\\eta}$ is the symmetric, reflexive, transitive, and contextual closure of one-step $\\beta$-reduction ($(\\lambda x. M)N \\to_\\beta M[x \\coloneqq N]$) and $\\eta$-conversion. The space of computed values is the quotient algebra $\\Lambda/\\sim_{\\beta\\eta}$. The Church-Rosser theorem guarantees that $\\to_\\beta$ is confluent, which implies that each equivalence class contains at most one $\\beta$-normal form (a term that cannot be reduced further), serving as a unique canonical representative of the quotient class.",
      history: "Invented by Alonzo Church in the 1930s to study the limits of mathematics. It became the theoretical bedrock of functional programming languages like Lisp, Haskell, and Scheme, proving that execution is formal syntax reduction and that programs are evaluated by quotienting.",
      exercises: "1. State and sketch the proof of the Church-Rosser Theorem (confluence of $\\beta$-reduction) using the parallel reduction method (Tait-Martin-Löf formulation).\n2. Show that the lambda term $\\Omega = (\\lambda x. x \\ x)(\\lambda x. x \\ x)$ has no normal form, and discuss what this implies for the quotient space $\\Lambda/\\sim_\\beta$."
    },
    ja: {
      narrative: "ラムダ計算は、計算の基礎となる最もシンプルな構文体系です。私たちは関数と変数からなる文字列の式を書きます（自由構文木）。しかし、関数は「実行」されるためにあります。関数に変数を代入し、式を「β簡約」によって縮小（Collapse）していくプロセスこそが、生の構文項を計算結果という同値類へ「商化」する行為なのです。実行とは商関係の適用そのものです。",
      rigor: "変数 $x$、ラムダ抽象 $\\lambda x. M$、および関数適用 $M N$ から生成される項の集合を $\\Lambda$ と置く。同値関係 $\\sim_{\\beta\\eta}$ は、1ステップの $\\beta$簡約 $(\\lambda x. M)N \\to_\\beta M[x \\coloneqq N]$ および $\\eta$変換の対称・反射・推移・文脈閉包である。評価された計算値の空間は商代数 $\\Lambda/\\sim_{\\beta\\eta}$ である。チャーチ・ロッサーの定理は $\\to_\\beta$ が合流性（Confluent）を持つことを保証し、これは各同値類が最大でも1つの $\\beta$正規形（これ以上簡約できない項）しか持たないことを意味し、これが商クラスの一意な代表元となる。",
      history: "1930年代にアロンゾ・チャーチによって数学の決定不可能性を証明するために考案されました。後にLispやHaskellなどの関数型プログラミング言語の論理的基礎となり、プログラムの実行が文字通り「構文の簡約（商化）」であることを示しました。",
      exercises: "1. 並行簡約法（テイト＝マーティン＝レフの定式化）を用いて、$\\beta$簡約の合流性を保証するチャーチ・ロッサーの定理を定式化し、その証明の骨子を示せ。\n2. ラムダ項 $\\Omega = (\\lambda x. x \\ x)(\\lambda x. x \\ x)$ が正規形を持たないことを示し、これが商空間 $\\Lambda/\\sim_\\beta$ において何を意味するか論ぜよ。"
    }
  },
  14: {
    id: 14,
    nameEn: "Hall XIV: Abstract Syntax Trees (AST Evaluation)",
    nameJa: "第XIV室：抽象構文木（AST）評価",
    thesisEn: "Free generation of nested operators and literals vs. Quotienting by evaluation rewrites ($2+3 \\sim 5$) to compile into a single value.",
    thesisJa: "入れ子になった演算子とリテラルの自由生成と、単一の値へコンパイルするための評価書き換え（$2+3 \\sim 5$）による商化。",
    en: {
      narrative: "In computer science, writing code is the free generation of syntax trees (ASTs). The compiler parses raw text characters into structured, nested operators and literals without executing them. Executing the code means collapsing this tree. The CPU recursively applies binary operations—folding $3 + 5$ to $8$—until the entire tree collapses into a single semantic value. Computation is the strict algebraic collapse of syntax.",
      rigor: "Let $\\Sigma = \\{+, \\times, -\\}$ be a signature of arithmetic operators. The free $\\Sigma$-algebra $F_{\\Sigma}(X)$ on a set of variables $X$ represents the space of all abstract syntax trees. Let $\\mathbb{Z}$ be the standard arithmetic algebra (which is also a $\\Sigma$-algebra). Given a valuation function $v: X \\to \\mathbb{Z}$, the universal property of free algebras guarantees a unique $\\Sigma$-algebra homomorphism $\\text{eval}_v: F_{\\Sigma}(X) \\to \\mathbb{Z}$. The kernel $\\text{ker}(\\text{eval}_v)$ defines the evaluation congruence $\\sim_v$ on ASTs, and by the First Isomorphism Theorem for algebras, the quotient $F_{\\Sigma}(X)/\\sim_v$ is isomorphic to $\\mathbb{Z}$, showing computation as a homomorphic quotient.",
      history: "This is the practical execution model of modern programming languages. Syntactic compiler representations are parsed freely and then quotiented by execution, showing that software execution is literally the mathematical quotienting of syntax.",
      exercises: "1. Define the category of $\\Sigma$-algebras for an arbitrary signature $\\Sigma$. State and prove the universal property of the free $\\Sigma$-algebra $F_{\\Sigma}(X)$ using the term algebra construction.\n2. Prove the First Isomorphism Theorem for algebras: if $h: A \\to B$ is a homomorphism of $\\Sigma$-algebras, then the kernel relation $\\text{ker}(h) = \\{(x, y) \\in A^2 \\mid h(x) = h(y)\\}$ is a congruence relation, and $A/\\text{ker}(h) \\cong \\text{Im}(h)$."
    },
    ja: {
      narrative: "コンュータサイエンスにおいて、プログラムを書くことは「抽象構文木（AST）」を自由生成することです。コンパイラは生のテキストを、実行することなく、入れ子状の演算子とリテラルへと構造化します。コードを実行することは、この構文木を折りたたむ（Collapse）ことに他なりません。CPUは二項演算を再帰的に適用し、$3 + 5$ を $8$ へと折りたたみ、最終的に木全体を１つの値へと商化させます。計算とは、構文の代数的な崩壊そのものなのです。",
      rigor: "算術演算のシグネチャを $\\Sigma = \\{+, \\times, -\\}$ とする。変数集合 $X$ 上の自由 $\\Sigma$-代数 $F_{\\Sigma}(X)$ は、すべての抽象構文木の空間を表す。標準的な整数代数 $\\mathbb{Z}$ もまた $\\Sigma$-代数である。変数への値の割り当て $v: X \\to \\mathbb{Z}$ が与えられたとき、自由代数の普遍性により、一意な $\\Sigma$-代数準同型写像 $\\text{eval}_v: F_{\\Sigma}(X) \\to \\mathbb{Z}$ が存在する。その核 $\\text{ker}(\\text{eval}_v)$ がAST上の評価合同関係 $\\sim_v$ を定義し、代数系の第1同型定理により、商代数 $F_{\\Sigma}(X)/\\sim_v \\cong \\mathbb{Z}$ となる。計算は準同型写像による商化である。",
      history: "これは現代のプログラミング言語の実用的な実行モデルです。コンパイラ内の構文的表現が自由にパースされ、実行によって商化される様子は、ソフトウェアの実行が数学的な構文商化そのものであることを裏付けています。",
      exercises: "1. 任意のシグネチャ $\\Sigma$ に対する $\\Sigma$-代数の圏を定義せよ。項代数（term algebra）の構成を用いて、自由 $\\Sigma$-代数 $F_{\\Sigma}(X)$ の普遍性を定式化し証明せよ。\n2. 代数系の第一同型定理を証明せよ：$\\Sigma$-代数の準同型写像 $h: A \\to B$ に対し、その核 $\\text{ker}(h) = \\{(x, y) \\in A^2 \\mid h(x) = h(y)\\}$ が合同関係であることを示し、$A/\\text{ker}(h) \\cong \\text{Im}(h)$ であることを証明せよ。"
    }
  },
  15: {
    id: 15,
    nameEn: "Hall XV: Relational Algebra & Database Schemas",
    nameJa: "第XV室：関係代数とデータベース",
    thesisEn: "Free query string statements vs. Quotienting by schema indexes and join filters to output tables.",
    thesisJa: "自由なクエリ文字列ステートメントと、テーブルを出力するためのスキーマインデックスや結合フィルタによる商化。",
    en: {
      narrative: "Databases manage structured information. An SQL query is a text string generated freely from keywords (SELECT, JOIN, WHERE). Running a query means collapsing the Cartesian product of tables. By applying join conditions and filter relations, we collapse huge multi-dimensional spaces of raw tuples into a specific quotient table. This shows how relational schemas quotient unstructured products into structured information.",
      rigor: "In category theory, database operations correspond to limits and colimits in $Set$. Given tables $R$ (with key mapping $p_1: R \\to K$) and $S$ (with key mapping $p_2: S \\to K$), the Cartesian product $R \\times S$ is the categorical product. The equijoin $R \\bowtie_{p_1=p_2} S$ is the pullback of the diagram $R \\xrightarrow{p_1} K \\xleftarrow{p_2} S$, which is the equalizer of $p_1 \\circ \\pi_1$ and $p_2 \\circ \\pi_2$. Conversely, a `GROUP BY` operation quotients the table $R$ (a set of tuples) by the equivalence relation $t_1 \\sim_A t_2 \\iff \\pi_A(t_1) = \\pi_A(t_2)$ for grouping attributes $A$. The quotient set $R/\\sim_A$ is the colimit representing the grouped records.",
      history: "Edgar F. Codd introduced the Relational Model in 1970. It structured data using mathematical relation theory instead of nested pointer loops, proving that querying is the algebraic reduction (quotienting) of sets and revolutionizing data retrieval.",
      exercises: "1. Prove that the equijoin $R \\bowtie_{p_1=p_2} S$ satisfies the universal property of the pullback in the category $Set$.\n2. Formulate the `GROUP BY` and aggregation operators category-theoretically as a quotient map. Show that any aggregation function (e.g., SUM) factors uniquely through the quotient map $\\pi_A: R \\to R/\\sim_A$."
    },
    ja: {
      narrative: "データベースは情報を管理・抽出する仕組みです。SQLクエリは、SELECTやJOINなどのキーワードを並べた「自由な構文（文字列）」です。クエリを実行することは、複数のテーブルの「直積（すべての組み合わせ）」を計算し、JOIN条件やフィルタ条件という「関係式」によって縮小させ、必要な結果テーブルへと「商化」することです。関係スキーマは無構造な直積を情報へと商化します。",
      rigor: "圏論において、データベース操作は $Set$ における極限と余極限に対応する。テーブル $R$ （キー写像 $p_1: R \\to K$）と $S$ （キー写像 $p_2: S \\to K$）に対し、直積 $R \\times S$ は圏論的直積である。結合クエリ $R \\bowtie_{p_1=p_2} S$ は、図式 $R \\xrightarrow{p_1} K \\xleftarrow{p_2} S$ のプルバック（引き戻し）であり、これは並行射 $p_1 \\circ \\pi_1$ と $p_2 \\circ \\pi_2$ のイコライザー（等化子）である。逆に、`GROUP BY` 操作は、グループ化属性 $A$ の値が一致するタプル同士を同一視する同値関係 $t_1 \\sim_A t_2 \\iff \\pi_A(t_1) = \\pi_A(t_2)$ によってテーブル $R$ を割る商演算（余極限）である。",
      history: "エドガー・F・コッドが1970年に関係モデル（Relational Model）を発表しました。複雑なポインタ構造を排し、純粋な関係代数（商構造の応用）としてデータベースを再構築したことで、情報検索技術に革命をもたらし、現代の情報インフラが完成しました。",
      exercises: "1. 結合テーブル $R \\bowtie_{p_1=p_2} S$ が、集合の圏 $Set$ におけるプルバックの普遍性を満たすことを証明せよ。\n2. `GROUP BY` および集計演算を圏論的な商写像として定式化せよ。任意の集計関数（例：SUM）が、商写像 $\\pi_A: R \\to R/\\sim_A$ を経由して一意に分解（Factor）されることを示せ。"
    }
  },
  16: {
    id: 16,
    nameEn: "Hall XVI: Regular Expressions & Automata",
    nameJa: "第XVI室：正規表現と有限オートマトン",
    thesisEn: "Free string matching paths vs. Quotienting by DFA state transitions to define regular languages.",
    thesisJa: "自由な文字列マッチング経路と、正規言語を定義するためのDFA状態遷移による商化。",
    en: {
      narrative: "Regular expressions match string patterns. We generate regular expressions freely using characters, wildcards, and stars. To execute them efficiently, compilers translate them into State Machines (DFAs). The infinite space of matching string paths is quotiented into a finite set of equivalence states, proving that regular languages are finite quotient classifications of infinite string sets.",
      rigor: "Let $L \\subseteq \\Sigma^*$ be a regular language. The Myhill-Nerode theorem defines the equivalence relation $\\sim_L$ on $\\Sigma^*$ by $x \\sim_L y \\iff \\forall z \\in \\Sigma^*, (xz \\in L \\iff yz \\in L)$. This is a right congruence of the free monoid $\\Sigma^*$, meaning $x \\sim_L y \\implies xz \\sim_L yz$. The quotient set $Q = \\Sigma^*/\\sim_L$ is the state space of the minimal DFA recognizing $L$. The transition function is given by the right action of $\\Sigma^*$ on $Q$: $[x] \\cdot z = [xz]$. DFA minimization is the quotienting of a DFA's state set by the equivalence relation of behavioral indistinguishability.",
      history: "Developed by Stephen Kleene and formalized by John Myhill and Anil Nerode in the 1950s, this quotient proved that regular languages are defined by finite quotient spaces of strings, establishing the foundation of lexical analysis and string compilation.",
      exercises: "1. Prove that the Myhill-Nerode relation $\\sim_L$ is a right congruence on $\\Sigma^*$, and explain why this ensures the transition function $\\delta([x], a) = [xa]$ is well-defined.\n2. Prove that the number of states in any DFA recognizing $L$ is greater than or equal to the index of $\\sim_L$. Show how the quotient set $\\Sigma^*/\\sim_L$ directly constructs the minimal DFA."
    },
    ja: {
      narrative: "正規表現は文字列のパターンを判定します。私たちは記号やワイルドカード、スターを使って正規表現を自由に生成します。これを判定する際、コンピュータはそれを有限オートマトン（DFA）へと変換します。文字列の照合経路を、遷移状態という有限個の「状態同値類」へと折りたたむ（商化する）のです。正規言語とは、無限の文字列集合を有限の状態同値類に商化したものと言えます。",
      rigor: "正規言語 $L \\subseteq \\Sigma^*$ に対し、マイヒル・ネローデの同値関係を $x \\sim_L y \\iff \\forall z \\in \\Sigma^*, (xz \\in L \\iff yz \\in L)$ で定義する。これは自由モノイド $\\Sigma^*$ 上の右合同関係（Right Congruence）であり、$x \\sim_L y \\implies xz \\sim_L yz$ を満たす。商集合 $Q = \\Sigma^*/\\sim_L$ は、言語 $L$ を受容する最小DFAの状態空間そのものである。遷移関数は、状態空間 $Q$ に対する $\\Sigma^*$ の右作用 $[x] \\cdot z = [xz]$ によって定義される。DFAの最小化とは、状態集合を行動の不可分同値関係で商化することである。",
      history: "1950年代にスティーヴン・クリーニやジョン・マイヒル、アニル・ネローデらによって確立されました。任意の正規言語は、文字列の集合を特定の商関係で折りたたむことで、有限状態の機械として実装できることを示し、字句解析と文字列コンパイルの基礎を築きました。",
      exercises: "1. マイヒル・ネローデ関係 $\\sim_L$ が $\\Sigma^*$ 上の右合同関係であることを証明し、これによって遷移関数 $\\delta([x], a) = [xa]$ が矛盾なく定義できる理由を説明せよ。\n2. 言語 $L$ を受容する任意のDFAの状態数が、$\\sim_L$ の指数（同値類の数）以上であることを証明せよ。また、商集合 $\\Sigma^*/\\sim_L$ から最小DFAを直接構築する方法を示せ。"
    }
  },
  17: {
    id: 17,
    nameEn: "Hall XVII: Type Theory & Proof Equivalence",
    nameJa: "第XVII室：型理論と証明同値性（カリー・ハワード）",
    thesisEn: "Free terms in type systems vs. Quotienting by equivalence proof paths.",
    thesisJa: "型システムにおける自由項と、同値証明パスによる商化。",
    en: {
      narrative: "In modern computer science, types are propositions and programs are proofs. A programmer writes computer code (terms) freely under a type system. Two programs may represent different instructions but perform the same proof or logic. We quotient these programs by proof equivalence (normalization rewrites), ensuring that execution collapses syntax into identical verified logic, showing that programs are syntax structures that quotient to mathematical truth.",
      rigor: "The Curry-Howard isomorphism maps Propositions to Types, and Proofs to Terms. Under this dictionary, proof simplification corresponds to $\\beta\\eta$-reduction of terms. Category-theoretically, this is modeled by Cartesian Closed Categories (CCCs). The objects of a CCC $\\mathcal{C}$ are types (propositions), and the hom-set $\\text{Hom}_{\\mathcal{C}}(A, B)$ consists of terms of type $A \\to B$ quotiented by $\\beta\\eta$-equivalence. Quotienting is essential to make the category well-defined, satisfying identity and associativity laws of composition.",
      history: "Discovered by Haskell Curry and William Alvin Howard. It bridged the gap between logic and programming, laying the foundation for modern theorem provers like Coq, Lean, and Agda, where verification is checking quotient compatibility.",
      exercises: "1. Prove that the category of types where morphisms are terms modulo $\\beta\\eta$-equivalence satisfies the universal property of Cartesian products and exponentiation, making it a Cartesian Closed Category (CCC).\n2. Formulate the correspondence between the natural deduction rules for conjunction ($\\land$-introduction and $\\land$-elimination) and the algebraic structure of product types (pairing and projection) in the CCC."
    },
    ja: {
      narrative: "現代のコンピュータサイエンスでは、「型は命題であり、プログラムは証明である」と捉えられます（カリー・ハワード同型対応）。プログラムを記述する行為は、ある型（命題）を満たすプログラムコード（証明）の「自由生成」です。複数の異なるプログラムコードが、論理的に全く同一の証明を実行するとき、これらを「証明同値性（正規化書き換え）」で商化し、実行によって構文を検証された論理へと崩壊させます。プログラムは数学的真理へと商化される構文構造なのです。",
      rigor: "カリー・ハワード同型は、命題を型に、証明を項に対応させる。この対応下で、証明の簡素化は項の $\\beta\\eta$簡約に対応する。圏論的には、これはデカルト閉圏（Cartesian Closed Category: CCC）としてモデル化される。デカルト閉圏 $\\mathcal{C}$ の対象は型（命題）であり、射の集合 $\\text{Hom}_{\\mathcal{C}}(A, B)$ は $A \\to B$ 型の項を $\\beta\\eta$同値関係で商化したものである。商化を行うことで初めて、結合の結合法則や単位元法則が満たされる圏として矛盾なく定義される。",
      history: "ハスケル・カリーとウィリアム・アルヴィン・ハワードによって発見されました。論理とプログラムを統合し、現代の証明支援言語（Lean, Coq, Agdaなど）を誕生させる基礎となりました。証明検証とは、商関係の整合性を確認することに他なりません。",
      exercises: "1. 射を $\\beta\\eta$同値で商化した項とする型の圏が、直積（Product）および指数（Exponential）の普遍性を満たし、デカルト閉圏（CCC）を構成することを証明せよ。\n2. 連言（論理積 $\\land$）の導入規則・除去規則と、デカルト閉圏における直積型（ペアリングと射影）の代数構造との対応関係を定式化せよ。"
    }
  },
  18: {
    id: 18,
    nameEn: "Hall XVIII: Homotopy Type Theory (HoTT)",
    nameJa: "第XVIII室：ホモトピー型理論（HoTT）",
    thesisEn: "Free structural identity types vs. Quotienting by path-spaces and univalence.",
    thesisJa: "自由な構造的恒等型と、パス空間や一価性による商化。",
    en: {
      narrative: "Homotopy Type Theory (HoTT) is the modern foundation of mathematics. It defines identity not as a rigid binary logic, but as a continuous space of paths. When we want to state that two types are equal, we show a path (equivalence) between them. Through the Univalence Axiom, we quotient types by structural equivalence—declaring that isomorphic structures are identical, formalizing the math practice of treating isomorphic structures as equal.",
      rigor: "Let $\\mathcal{U}$ be the universe of types. For any types $A, B: \\mathcal{U}$, we have the identity type $A =_{\\mathcal{U}} B$ (representing the space of paths between $A$ and $B$) and the type of equivalences $A \\simeq B$. The Univalence Axiom asserts that the canonical map $\\text{idtoequiv}: (A =_{\\mathcal{U}} B) \\to (A \\simeq B)$ is itself an equivalence of types: $(A =_{\\mathcal{U}} B) \\simeq (A \\simeq B)$. This axioms quotients the universe $\\mathcal{U}$ by equivalence, ensuring that isomorphic types are identical (path-connected) in the universe.",
      history: "Developed by Fields medalist Vladimir Voevodsky in the 2000s, HoTT merged homotopy topology and computer type theory. It provides a computer-verifiable foundation where isomorphic math objects are treated as equal, unifying topology, programming, and logic.",
      exercises: "1. Formulate the path induction universal property of the identity type (the J-eliminator) and explain how it represents the contractibility of the space of paths with one free endpoint.\n2. Show how the Univalence Axiom implies that any predicate $P: \\mathcal{U} \\to \\mathcal{U}$ defined in type theory is invariant under equivalence, i.e., $A \\simeq B \\implies P(A) \\simeq P(B)$, justifying the mathematical practice of treating isomorphic objects as equal."
    },
    ja: {
      narrative: "ホモトピー型理論（HoTT）は、現代数学の新しい基礎論です。ここでは、対象の「同一性（イコール）」を単なる二値論理ではなく、対象間の「連続的なパス（経路）」の空間として定義します。2つの型が等しいと示すことは、その間の同値写像というパスを示すことです。一価性公理（Univalence Axiom）を通じて、私たちは型を同型関係によって商化し、「同型な構造は同一である」と宣言します。これは「同型なものをイコールとみなす」数学的営みの厳密な定式化です。",
      rigor: "型の宇宙を $\\mathcal{U}$ とする。任意の型 $A, B: \\mathcal{U}$ に対し、同一性型 $A =_{\\mathcal{U}} B$ （$A$ と $B$ の間のパスの空間）と、同値写像の型 $A \\simeq B$ が存在する。一価性公理（Univalence Axiom）は、正準写像 $\\text{idtoequiv}: (A =_{\\mathcal{U}} B) \\to (A \\simeq B)$ がそれ自体型の同値であること、すなわち $(A =_{\\mathcal{U}} B) \\simeq (A \\simeq B)$ を主張する。この公理は宇宙 $\\mathcal{U}$ を同値関係で商化し、同型な型同士が宇宙において同一（パス連結）であることを保証する。",
      history: "2000年代にフィールズ賞受賞者のウラジーミル・ヴォエヴォドスキーらによって開発されました。トポロジー（ホモトピー）とコンピュータの型理論を融合し、「同型ならイコール」として扱える、コンピュータが検証可能な新時代の数学の台地であり、トポロジー・論理・プログラミングを統合しました。",
      exercises: "1. 同一性型のパスインダクション（J-eliminatorの普遍性）を定式化し、これが「片方の端点を固定したパスの空間の可縮性（Contractibility）」をどのように表しているか説明せよ。\n2. 一価性公理を用いることで、型理論で定義される任意の述語 $P: \\mathcal{U} \\to \\mathcal{U}$ が同値関係に関して不変であること、すなわち $A \\simeq B \\implies P(A) \\simeq P(B)$ が成り立つことを証明し、同型な対象を同一視する数学的営みを正当化せよ。"
    }
  },
  19: {
    id: 19,
    nameEn: "Hall XIX: The Category of Sets (Set)",
    nameJa: "第XIX室：集合の圏 (Set)",
    thesisEn: "The state of nature—raw elements and functions without algebraic operations.",
    thesisJa: "代数演算を持たない、生の要素と写像（関数）からなる自然状態としての圏。",
    en: {
      narrative: "We now enter formal Category Theory. The Category of Sets (denoted as $\\mathcal{S}et$) represents the mathematical state of nature: a universe of isolated, unstructured points (generators) and simple functions (mappings) between them. Here, there are no algebraic operations, no multiplication, and no paths. It is the realm of pure, unconstrained generators—the raw input material of mathematics, representing absolute freedom before relational rules.",
      rigor: "The category $Set$ has sets as objects and functions as morphisms. It is a bicomplete, cartesian closed category with a subobject classifier $\\Omega = \\{0, 1\\}$, making it an elementary topos. Limits (such as products, pullbacks, equalizers) are constructed using subsets of Cartesian products, and colimits (such as coproducts, coequalizers) are constructed using quotients of disjoint unions. The forgetful functor $U$ from algebraic categories maps back into $Set$, stripping relational equations.",
      history: "Developed by Georg Cantor in the late 19th century, set theory was initially criticized as 'non-constructive' but later became the standard foundation of math. In category theory, it serves as the base category, representing the unstructured void.",
      exercises: "1. Prove that in the category $Set$, a morphism $f: A \\to B$ is a monomorphism if and only if it is injective, and an epimorphism if and only if it is surjective.\n2. Construct the equalizer of a parallel pair $f, g: A \\rightrightarrows B$ in $Set$, and prove that it satisfies the universal property of equalizers."
    },
    ja: {
      narrative: "ここから本格的な圏論に入ります。集合の圏（$\\mathcal{S}et$）は、数学における「自然状態（無秩序）」を表します。ここには、代数演算を持たない孤立した点（生成元）と、それらの間の単純な写像（関数）だけが存在します。掛け算も、足し算も、折り畳みもありません。これは、関係式のルールが適用される前の、純粋で制約のない「生成元（構文）」だけの世界です。",
      rigor: "圏 $Set$ は、集合を対象とし、関数を射とする。これは双完備（Bicomplete）かつデカルト閉（Cartesian Closed）であり、部分対象分類子 $\\Omega = \\{0, 1\\}$ を備えるため、初等トポス（Elementary Topos）を構成する。極限（直積、プルバック、イコライザー）はデカルト直積の部分集合として構築され、余極限（余直積、コイコライザー）は直和集合の商として構築される。代数的圏からの忘却関手 $U$ は、関係式を取り除き、この $Set$ へとマッピングする。",
      history: "19世紀末にゲオルク・カントールによって構築された集合論は、当初「直観に反する非構成的理論」として批判されましたが、後に数学全体の基礎となりました。圏論においては、代数構造を持たない「生の素材」を提供する基準の圏として位置づけられます。",
      exercises: "1. 集合の圏 $Set$ において、射 $f: A \\to B$ がモノ射（Monomorphism）であることと単射であることが同値であり、エピ射（Epimorphism）であることと全射であることが同値であることを証明せよ。\n2. $Set$ における射の並行対 $f, g: A \\rightrightarrows B$ のイコライザー（等化子）を具体的に構成し、それがイコライザーの普遍性を満たすことを証明せよ。"
    }
  },
  20: {
    id: 20,
    nameEn: "Hall XX: The Category of Monoids (Mon)",
    nameJa: "第XX室：モノイドの圏 (Mon)",
    thesisEn: "Structured algebra—sets with associative binary multiplications.",
    thesisJa: "結合的な二項演算（積）を備えた、構造化された代数対象としての圏。",
    en: {
      narrative: "In contrast to sets, we introduce algebra. A Monoid is a set equipped with a binary multiplication operation that is associative and has an identity element. In the Category of Monoids ($\\mathcal{M}on$), every object possesses internal structured relationships—elements can be multiplied together to form new elements. It is the structured destination of syntax collapse, representing the first step into formal algebraic rules.",
      rigor: "A Monoid $M = (S, \\cdot, e)$ is a set $S$ with binary operation $\\cdot: S \\times S \\to S$ satisfying associativity $(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$ and identity $e \\cdot a = a \\cdot e = a$. Morphisms in the category $Mon$ are monoid homomorphisms, functions $f: M_1 \\to M_2$ preserving multiplication $f(x \\cdot y) = f(x) \\cdot f(y)$ and identity $f(e) = e$. The category $Mon$ is bicomplete. Limits are created by the forgetful functor $U: Mon \\to Set$, whereas coproducts (free products of monoids $M_1 * M_2$) are constructed by taking the free monoid on the disjoint union $U(M_1) \\sqcup U(M_2)$ and quotienting by the monoid relations.",
      history: "Monoids capture the algebraic essence of concatenation, transformation, and sequential time. Historically, they emerged in the study of substitution groups and string systems, representing the simplest non-trivial algebraic structures with relational equations.",
      exercises: "1. Construct the coproduct (free product) $M_1 * M_2$ of two monoids $M_1$ and $M_2$ as a quotient of the free monoid $F(U(M_1) \\sqcup U(M_2))$ by a suitable congruence relation, and verify its universal property.\n2. Prove that the forgetful functor $U: Mon \\to Set$ preserves all limits, but show by counterexample that it does not preserve coproducts (sums)."
    },
    ja: {
      narrative: "単なる集合（無秩序）とは対照的に、ここで「代数（秩序）」が導入されます。モノイドとは、結合法則を満たす二項演算（掛け算）と、単位元（掛けても変化しない要素）を備えた集合です。モノイドの圏（$\\mathcal{M}on$）において、各対象は内部構造を持っており、要素同士を掛け合わせて新しい要素を作ることができます。これは構文を商化・構造化して得られる代数的な世界の出発点です。",
      rigor: "モノイド $M = (S, \\cdot, e)$ は、結合法則 $(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$ と単位元法則 $e \\cdot a = a \\cdot e = a$ を満たす二項演算 $\\cdot$ を備えた集合 $S$ である。モノイドの圏 $Mon$ の射は、積と単位元を保存する写像であるモノイド準同型写像 $f: M_1 \\to M_2$ である。$Mon$ は双完備である。極限は忘却関手 $U: Mon \\to Set$ によって創出（Create）されるが、余極限（余直積/自由積 $M_1 * M_2$）は、台集合の直和 $U(M_1) \\sqcup U(M_2)$ 上の自由モノイドを元のモノイドの関係式で割ることによって構成される。",
      history: "モノイドは、文字列の結合や時間の経過、写像の合成など、「順次適用」の代数的エッセンスを捉えています。歴史的には置換群の研究や記号列システムから派生し、関係式を持つ最もシンプルな代数構造として定着しました。",
      exercises: "1. 2つのモノイド $M_1$ と $M_2$ の余直積（自由積） $M_1 * M_2$ を、自由モノイド $F(U(M_1) \\sqcup U(M_2))$ の適切な合同関係による商モノイドとして構成し、その普遍性を検証せよ。\n2. 忘却関手 $U: Mon \\to Set$ がすべての極限を保存することを証明せよ。また、これが余直積（和）を保存しないことを反例を用いて示せ。"
    }
  }
};
