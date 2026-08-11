export interface InspectorTerm {
  symbol: string;
  classification: 'FREE' | 'RELATION';
  nameEn: string;
  nameJa: string;
  descEn: string;
  descJa: string;
  highlightId: string;
  backlinks: { roomNum: number; nameEn: string; nameJa: string }[];
}

export const inspectorDb: Record<string, InspectorTerm> = {
  "X": {
    symbol: "X",
    classification: "FREE",
    nameEn: "Set of Generators",
    nameJa: "生成元の集合",
    descEn: "A set of raw, unconstrained initial elements (generators) representing the pure syntax of a mathematical system.",
    descJa: "制約のない生の初期要素（生成元）の集合であり、数学的システムの純粋な構文（シンタックス）を表します。",
    highlightId: "generators",
    backlinks: [{ roomNum: 26, nameEn: "Concept I: Free Generation", nameJa: "概念I: 自由生成" }]
  },
  "F(X)": {
    symbol: "F(X)",
    classification: "FREE",
    nameEn: "Free Algebra / Free Functor",
    nameJa: "自由代数・自由関手",
    descEn: "The collection of all possible syntactic terms generated from the set of elements X under algebraic operations, without any relations applied.",
    descJa: "生の要素の集合 X から代数演算によって構成される、関係式適用前のあらゆる可能な構文上の項（ツリー）の集まり。",
    highlightId: "syntax-space",
    backlinks: [{ roomNum: 26, nameEn: "Concept I: Free Generation", nameJa: "概念I: 自由生成" }]
  },
  "R": {
    symbol: "R",
    classification: "RELATION",
    nameEn: "Quotient Relations",
    nameJa: "関係式・同一視ルール",
    descEn: "A set of equations or equivalence relations specifying which syntactically different generated terms must be declared semantically identical.",
    descJa: "構文上は異なる生成された項同士のうち、どれを意味論的に同一とみなす（接着する）かを指定する等式または同値関係の集合。",
    highlightId: "relations",
    backlinks: [{ roomNum: 28, nameEn: "Concept III: Quotients", nameJa: "概念III: 商集合" }]
  },
  "\\langle R \\rangle": {
    symbol: "\\langle R \\rangle",
    classification: "RELATION",
    nameEn: "Congruence Relation",
    nameJa: "合同関係",
    descEn: "The minimal equivalence relation containing R that is compatible with all algebraic operations, ensuring the quotient space retains algebraic structure.",
    descJa: "関係式 R を含み、すべての代数演算と両立する最小の同値関係。これにより、商空間においても代数的な構造が一貫して保たれます。",
    highlightId: "relations-congruence",
    backlinks: [{ roomNum: 28, nameEn: "Concept III: Quotients", nameJa: "概念III: 商集合" }]
  },
  "F(X)/\\langle R \\rangle": {
    symbol: "F(X)/\\langle R \\rangle",
    classification: "RELATION",
    nameEn: "Quotient Algebra",
    nameJa: "商代数",
    descEn: "The semantic algebraic structure obtained by folding the free terms F(X) along the congruence relation, collapsing syntax into meaning.",
    descJa: "自由代数 F(X) を合同関係に沿って折りたたむことで得られる意味論的代数構造。構文が意味へと崩壊・集約されます。",
    highlightId: "semantic-space",
    backlinks: [{ roomNum: 28, nameEn: "Concept III: Quotients", nameJa: "概念III: 商集合" }]
  },
  "\\pi": {
    symbol: "\\pi",
    classification: "RELATION",
    nameEn: "Canonical Quotient Projection",
    nameJa: "正準商写像",
    descEn: "The coequalizer morphism that maps each raw syntactic term in F(X) to its equivalence class in the quotient algebra, acting as a collapsing fold.",
    descJa: "F(X) の生の構文項を、商代数における同値類へとマッピングするコイコライザー（余等化子）射。折りたたみの作用を担います。",
    highlightId: "projection-fold",
    backlinks: [{ roomNum: 28, nameEn: "Concept III: Quotients", nameJa: "概念III: 商集合" }]
  },
  "\\eta": {
    symbol: "\\eta",
    classification: "FREE",
    nameEn: "Unit of Adjunction (η)",
    nameJa: "随伴の単位 (η)",
    descEn: "A natural transformation mapping generators in X to their free representatives in UF(X). It is the unconstrained injection of raw syntax into structured spaces.",
    descJa: "生成元 X を、UF(X) における自由な代表元へとマッピングする自然変換。生の構文を構造化空間へ埋め込む射。",
    highlightId: "unit-mapping",
    backlinks: [{ roomNum: 23, nameEn: "Hall XXIII: Unit & Counit", nameJa: "第23室: 単位と余単位" }, { roomNum: 30, nameEn: "Concept V: Adjunctions", nameJa: "概念V: 随伴" }]
  },
  "\\varepsilon": {
    symbol: "\\varepsilon",
    classification: "RELATION",
    nameEn: "Counit of Adjunction (ε)",
    nameJa: "随伴の余単位 (ε)",
    descEn: "A natural transformation mapping free structures back to their structured semantic values FU(Y) -> Y, acting as the ultimate quotient collapse.",
    descJa: "自由な構造を、本来の構造化された意味論的値へと書き戻す自然変換 FU(Y) -> Y。最終的な商化崩壊・評価作用を担います。",
    highlightId: "counit-mapping",
    backlinks: [{ roomNum: 23, nameEn: "Hall XXIII: Unit & Counit", nameJa: "第23室: 単位と余単位" }, { roomNum: 30, nameEn: "Concept V: Adjunctions", nameJa: "概念V: 随伴" }]
  },
  "\\gamma(s)": {
    symbol: "\\gamma(s)",
    classification: "FREE",
    nameEn: "Continuous Path Loop",
    nameJa: "連続な経路ループ",
    descEn: "A continuous parameterization of a path loop in topological space. Represents free syntactic paths before deformation rules are applied.",
    descJa: "位相空間内における経路ループの連続的なパラメータ表示。変形ルール（ホモトピー）が適用される前の自由な構文的経路を表します。",
    highlightId: "loop-path",
    backlinks: [{ roomNum: 11, nameEn: "Hall XI: Path Homotopy", nameJa: "第11室: 経路ホモトピー" }]
  },
  "\\pi_1(X, x_0)": {
    symbol: "\\pi_1(X, x_0)",
    classification: "RELATION",
    nameEn: "Fundamental Group",
    nameJa: "基本群",
    descEn: "The group of equivalence classes of loops under homotopy. It quotients all possible loops by continuous deformations around obstacles.",
    descJa: "ホモトピー（連続変形）によるループの同値類のなす群。障害物の周囲での連続変形によって、すべての可能なループを商化します。",
    highlightId: "fundamental-group",
    backlinks: [{ roomNum: 11, nameEn: "Hall XI: Path Homotopy", nameJa: "第11室: 経路ホモトピー" }, { roomNum: 28, nameEn: "Concept III: Quotients", nameJa: "概念III: 商集合" }]
  },
  "T_{\\mu\\nu}": {
    symbol: "T_{\\mu\\nu}",
    classification: "FREE",
    nameEn: "Energy-Momentum Tensor",
    nameJa: "エネルギー・運動量テンソル",
    descEn: "Represents the distribution of mass and energy. Acts as the free source warping the underlying geometry of spacetime.",
    descJa: "質量とエネルギーの分布を表します。時空の幾何学的構造を歪ませる自由なソース（生成元）として作用します。",
    highlightId: "energy-mass",
    backlinks: [{ roomNum: 12, nameEn: "Hall XII: Einstein Spacetime", nameJa: "第12室: アインシュタイン時空" }]
  },
  "g_{\\mu\\nu}": {
    symbol: "g_{\\mu\\nu}",
    classification: "RELATION",
    nameEn: "Metric Tensor",
    nameJa: "計量テンソル",
    descEn: "Determines the geometry and distances of spacetime, resulting from the relational warping under energy and mass constraints.",
    descJa: "時空の幾何学と距離を決定します。エネルギーや質量の制約の下での関係的な歪みの結果として生じます。",
    highlightId: "metric-grid",
    backlinks: [{ roomNum: 12, nameEn: "Hall XII: Einstein Spacetime", nameJa: "第12室: アインシュタイン時空" }]
  },
  "\\text{Diff}(M)": {
    symbol: "\\text{Diff}(M)",
    classification: "RELATION",
    nameEn: "Diffeomorphism Group",
    nameJa: "微分同相写像群",
    descEn: "The group of smooth coordinate transformations. General relativity quotients coordinates under Diff(M) to yield coordinate-invariant physical laws.",
    descJa: "滑らかな座標変換のなす群。一般相対性理論は座標を Diff(M) の下で商化することで、座標に依存しない物理法則を導きます。",
    highlightId: "diff-invariance",
    backlinks: [{ roomNum: 12, nameEn: "Hall XII: Einstein Spacetime", nameJa: "第12室: アインシュタイン時空" }]
  },
  "(\\lambda x. M)N": {
    symbol: "(\\lambda x. M)N",
    classification: "FREE",
    nameEn: "Beta-Redex Term",
    nameJa: "ベータ簡約可能項 (Redex)",
    descEn: "A syntactic lambda calculus term containing a function abstraction applied to an argument, representing potential computation before collapse.",
    descJa: "引数に適用された関数抽象を含むラムダ計算の構文項。評価（崩壊）される前の潜在的な計算状態を表します。",
    highlightId: "redex-node",
    backlinks: [{ roomNum: 13, nameEn: "Hall XIII: Lambda Calculus", nameJa: "第13室: ラムダ計算" }]
  },
  "M[x \\coloneqq N]": {
    symbol: "M[x \\coloneqq N]",
    classification: "RELATION",
    nameEn: "Substituted Lambda Term",
    nameJa: "代入されたラムダ項",
    descEn: "The reduced, semantic form after performing beta-reduction, folding syntax by replacing variables with their bound arguments.",
    descJa: "ベータ簡約（評価）を実行した後の縮退した意味論的形態。変数を束縛引数に置き換えることで構文を折りたたみます。",
    highlightId: "reduced-node",
    backlinks: [{ roomNum: 13, nameEn: "Hall XIII: Lambda Calculus", nameJa: "第13室: ラムダ計算" }]
  },
  "R \\bowtie S": {
    symbol: "R \\bowtie S",
    classification: "RELATION",
    nameEn: "Relational Equijoin (Pullback)",
    nameJa: "関係等結合 (プルバック)",
    descEn: "A relational database join that pairs tuples sharing equal key attributes, category-theoretically equivalent to a fibered product (pullback).",
    descJa: "共通の属性キー値を持つタプル同士をペアにするデータベース結合。圏論的にはファイバー積（プルバック）に相当します。",
    highlightId: "join-pullback",
    backlinks: [{ roomNum: 15, nameEn: "Hall XV: Relational Algebra", nameJa: "第15室: 関係代数" }]
  },
  "\\text{GROUP BY}": {
    symbol: "\\text{GROUP BY}",
    classification: "RELATION",
    nameEn: "GROUP BY Operator",
    nameJa: "グループ化操作 (GROUP BY)",
    descEn: "An operation that collapses multi-dimensional database tuples into equivalence classes determined by matching values on specified columns.",
    descJa: "指定した列の値が一致するタプル同士を、単一の同値類へと縮退・集約する操作。商集合の典型例です。",
    highlightId: "groupby-collapse",
    backlinks: [{ roomNum: 15, nameEn: "Hall XV: Relational Algebra", nameJa: "第15室: 関係代数" }]
  },
  "\\equiv_L": {
    symbol: "\\equiv_L",
    classification: "RELATION",
    nameEn: "Myhill-Nerode Congruence",
    nameJa: "マイヒル・ネローデ合同関係",
    descEn: "An equivalence relation on strings where x ~ y if they lead to identical future completions in a language. Minimizes states in automata.",
    descJa: "言語 L に対して、同じ文字列を追加したときの受理性（未来の遷移）が一致する文字列同士を同一視する同値関係。DFA状態の最小化に使用されます。",
    highlightId: "nerode-equivalence",
    backlinks: [{ roomNum: 16, nameEn: "Hall XVI: Regular Expressions", nameJa: "第16室: 正規表現とDFA" }]
  },
  "A =_{\\mathcal{U}} B": {
    symbol: "A =_{\\mathcal{U}} B",
    classification: "RELATION",
    nameEn: "Identity Type in HoTT",
    nameJa: "HoTTにおける同一性型",
    descEn: "Represents the path space of equivalence between types A and B in the universe U. Paths denote structural equivalence.",
    descJa: "宇宙 U における型 A と型 B の同値関係のなす経路空間を表します。経路は構造的な同値性を媒介します。",
    highlightId: "identity-path",
    backlinks: [{ roomNum: 18, nameEn: "Hall XVIII: Homotopy Type Theory", nameJa: "第18室: ホモトピー型理論" }]
  },
  "A \\simeq B": {
    symbol: "A \\simeq B",
    classification: "FREE",
    nameEn: "Equivalence of Types",
    nameJa: "型の同値関係",
    descEn: "A pair of functions mapping back and forth that constitute a homotopy equivalence, representing syntactic correspondence before identification.",
    descJa: "互いに逆向きにマッピングし、ホモトピー逆写像となる関数のペア。同一視される前の構文的な対応関係を表します。",
    highlightId: "equivalence-morphisms",
    backlinks: [{ roomNum: 18, nameEn: "Hall XVIII: Homotopy Type Theory", nameJa: "第18室: ホモトピー型理論" }]
  },
  "\\text{Hom}(-, A)": {
    symbol: "\\text{Hom}(-, A)",
    classification: "RELATION",
    nameEn: "Representable Functor (Yoneda)",
    nameJa: "表現可能関手 (米田)",
    descEn: "The collection of all incoming morphisms into object A. The Yoneda Lemma proves that an object is entirely defined by its incoming relations.",
    descJa: "対象 A に入ってくるすべての射（関係性）の集まり。米田の補題は、ある対象がその関係性の総和（Hom関手）として一意に決定されることを示します。",
    highlightId: "yoneda-network",
    backlinks: [{ roomNum: 25, nameEn: "Hall XXV: Yoneda Lemma", nameJa: "第25室: 米田の補題" }]
  },
  "F \\dashv U": {
    symbol: "F \\dashv U",
    classification: "RELATION",
    nameEn: "Adjunction Duality",
    nameJa: "随伴双対性",
    descEn: "The category-theoretic bridge between free syntax F and forgetful semantics U. Ensures mapping free generators uniquely determines relational behavior.",
    descJa: "自由な構文 F と、構造を忘れる意味論 U の間の圏論的な架け橋。自由な生成元へのマッピングが関係的な挙動を一意に決定することを保証します。",
    highlightId: "adjunction-loop",
    backlinks: [{ roomNum: 22, nameEn: "Hall XXII: Adjunction Duality", nameJa: "第22室: 随伴双対性" }, { roomNum: 30, nameEn: "Concept V: Adjunctions", nameJa: "概念V: 随伴" }]
  },
  "\\mu": {
    symbol: "\\mu",
    classification: "RELATION",
    nameEn: "Monad Multiplication / Flattening (μ)",
    nameJa: "モナドの乗法・平坦化 (μ)",
    descEn: "A natural transformation flattening nested computations T^2 -> T. Collapses redundant syntactic layers of syntax trees.",
    descJa: "入れ子になった計算を平坦化する自然変換 T^2 -> T。構文木の冗長な階層（構文のネスト）を平坦に折りたたみます。",
    highlightId: "monad-flatten",
    backlinks: [{ roomNum: 24, nameEn: "Hall XXIV: Monads", nameJa: "第24室: モナドと代数" }]
  },
  "X = [0,1]^2": {
    symbol: "X = [0,1]^2",
    classification: "FREE",
    nameEn: "Continuous Domain Sheet",
    nameJa: "連続ドメイン正方形シート",
    descEn: "A flat unit square representing continuous 2D Euclidean coordinate generators before edge gluing relations are applied.",
    descJa: "対向する辺を接着する境界関係式が適用される前の、連続な2次元ユークリッド座標生成元を表す平坦な単位正方形シート。",
    highlightId: "flat-square",
    backlinks: [{ roomNum: 9, nameEn: "Hall IX: Quotient Topology", nameJa: "第9室: 商位相（トーラス）" }]
  },
  "X/\\sim": {
    symbol: "X/\\sim",
    classification: "RELATION",
    nameEn: "Quotient Topological Space",
    nameJa: "商位相空間",
    descEn: "The resulting topological space formed by identifying and gluing the boundary points of the square.",
    descJa: "単位正方形の境界点同士を同値関係によって同一視し、接着することによって形成される商位相空間。",
    highlightId: "torus-surface",
    backlinks: [{ roomNum: 9, nameEn: "Hall IX: Quotient Topology", nameJa: "第9室: 商位相（トーラス）" }, { roomNum: 28, nameEn: "Concept III: Quotients", nameJa: "概念III: 商集合" }]
  },
  "S^1 \\times S^1": {
    symbol: "S^1 \\times S^1",
    classification: "RELATION",
    nameEn: "2-Torus Product Space",
    nameJa: "2次元トーラス直積空間",
    descEn: "The product space of two circles, representing the semantic shape (torus manifold) arising from quotienting the square boundaries.",
    descJa: "2つの円周の直積空間。単位正方形の境界を接着して得られる意味論的な形状（トーラス多様体）を表します。",
    highlightId: "torus-surface",
    backlinks: [{ roomNum: 9, nameEn: "Hall IX: Quotient Topology", nameJa: "第9室: 商位相（トーラス）" }]
  },
  "F_{\\Sigma}(X)": {
    symbol: "F_{\\Sigma}(X)",
    classification: "FREE",
    nameEn: "Free Term AST Algebra",
    nameJa: "自由項AST代数",
    descEn: "The set of all possible abstract syntax trees (unreduced nested operators) generated freely from variables X and operations.",
    descJa: "変数 X と演算子から構成される、簡約されていないすべての抽象構文木（AST）の集合。",
    highlightId: "unreduced-ast",
    backlinks: [{ roomNum: 14, nameEn: "Hall XIV: AST Evaluation", nameJa: "第14室: AST評価" }, { roomNum: 26, nameEn: "Concept I: Free Generation", nameJa: "概念I: 自由生成" }]
  },
  "\\mathbb{Z}": {
    symbol: "\\mathbb{Z}",
    classification: "RELATION",
    nameEn: "Integers Semantic Space",
    nameJa: "整数意味空間",
    descEn: "The algebra of integer values, representing the semantic target of numerical syntax evaluations.",
    descJa: "整数値全体の代数。数式という構文表現を評価した後の意味論的なターゲット（結果値空間）をなします。",
    highlightId: "reduced-value",
    backlinks: [{ roomNum: 14, nameEn: "Hall XIV: AST Evaluation", nameJa: "第14室: AST評価" }]
  },
  "\\text{eval}_v": {
    symbol: "\\text{eval}_v",
    classification: "RELATION",
    nameEn: "Evaluation Homomorphism",
    nameJa: "評価準同型写像",
    descEn: "The unique homomorphism collapsing syntax trees to their evaluated integer values by applying arithmetic operations recursively.",
    descJa: "算術演算を再帰的に適用して、構文木を評価後の整数値へと虚脱（同一視）させる一意な準同型写像。",
    highlightId: "eval-mapping",
    backlinks: [{ roomNum: 14, nameEn: "Hall XIV: AST Evaluation", nameJa: "第14室: AST評価" }, { roomNum: 27, nameEn: "Concept II: Mappings", nameJa: "概念II: 写像と関数" }]
  },
  "\\sim_v": {
    symbol: "\\sim_v",
    classification: "RELATION",
    nameEn: "Evaluation Congruence",
    nameJa: "評価合同関係",
    descEn: "The equivalence relation stating that two syntactic trees are equivalent if they evaluate to the same integer under valuation v.",
    descJa: "変数への値割り当て v の下で、評価値（計算結果）が一致する構文木同士を同一のものとみなす合同同値関係。",
    highlightId: "congruence-classes",
    backlinks: [{ roomNum: 14, nameEn: "Hall XIV: AST Evaluation", nameJa: "第14室: AST評価" }, { roomNum: 28, nameEn: "Concept III: Quotients", nameJa: "概念III: 商集合" }]
  }
};
