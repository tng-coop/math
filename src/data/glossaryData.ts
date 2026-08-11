export interface GlossaryEntry {
  id: string;
  termEn: string;
  termJa: string;
  rigorEn: string;
  rigorJa: string;
  analogyEn: string;
  analogyJa: string;
}

export const glossaryDb: Record<string, GlossaryEntry> = {
  "free-functor": {
    id: "free-functor",
    termEn: "Free Functor / Free Algebra ($F$)",
    termJa: "自由関手・自由代数 ($F$)",
    rigorEn: "A functor $F: \\mathbf{Set} \\to \\mathbf{Alg}(\\Sigma)$ that is left adjoint to the forgetful functor $U: \\mathbf{Alg}(\\Sigma) \\to \\mathbf{Set}$. It maps a set of generators $X$ to the free algebra $F(X)$ containing all possible syntactic terms constructed under the operations of a signature, satisfying no equations other than the basic laws of the algebraic structure.",
    rigorJa: "忘却関手 $U: \\mathbf{Alg}(\\Sigma) \\to \\mathbf{Set}$ の左随伴となる関手 $F: \\mathbf{Set} \\to \\mathbf{Alg}(\\Sigma)$。生の生成元の集合 $X$ を、演算子の規則にのみ従って構築されるすべての可能な構文項を含む自由代数 $F(X)$ へとマッピングする。この段階では、代数構造の基本規則以外の追加の関係式（等式）は一切課されていない。",
    analogyEn: "Imagine a 'Box of Raw Toys' (a set $X$ of blocks, toy cars, and dinosaurs) with absolutely no rules or connections yet. The Free Functor $F$ is the process that unlocks absolute creative freedom, allowing you to combine these toys in every possible grammatically correct way without any restrictions. It represents the transition from raw materials to infinite syntactical possibilities.",
    analogyJa: "何の接続もルールも適用されていない「生の玩具箱」（ブロック、ミニカー、恐竜などの集合 $X$）を想像してください。自由関手 $F$ は、これらの玩具を一切のルール制限なしに、文法的に正しいあらゆる方法で自由に組み合わせて遊ぶことを可能にするプロセスです。生の素材から無限の『構文的』可能性を生成する第一歩を意味します。"
  },
  "forgetful-functor": {
    id: "forgetful-functor",
    termEn: "Forgetful Functor ($U$)",
    termJa: "忘却関手 ($U$)",
    rigorEn: "A functor $U: \\mathcal{C} \\to \\mathbf{Set}$ that discards the algebraic or topological structure of its domain category, mapping objects to their underlying sets and homomorphisms to their underlying functions.",
    rigorJa: "代数構造やトポロジー構造を忘れて、対象を単なる台集合（要素の集まり）へ、準同型写像を単なる関数へとマッピングする関手 $U: \\mathcal{C} \\to \\mathbf{Set}$。",
    analogyEn: "Think of this as 'structure-blindness.' It means looking at a highly organized system (like a book or a completed building) and stripping away the sentences or engineering rules, treating it simply as a raw collection of letters or bricks. It represents the step of returning structured concepts back to their unstructured elements.",
    analogyJa: "「構造に対する盲目化」と考えてください。物語として書かれた本や、完成した建物を観察するとき、文脈や建築規則をすべて忘れて、それを「ただのアルファベットの山」や「レンガの塊」として見なす行為です。構造化された概念からルールを剥ぎ取り、生の要素に戻すステップを表します。"
  },
  "congruence-relation": {
    id: "congruence-relation",
    termEn: "Congruence Relation ($\\langle R \\rangle$)",
    termJa: "合同関係 ($\\langle R \\rangle$)",
    rigorEn: "An equivalence relation $\\sim$ on an algebraic structure that is compatible with all algebraic operations in the signature. That is, if $x_i \\sim y_i$ for all $i$, then $f(x_1, \\dots, x_n) \\sim f(y_1, \\dots, y_n)$ for any $n$-ary operation $f$.",
    rigorJa: "代数構造の上で定義される同値関係のうち、その代数のすべての演算と両立するもの。すなわち、各成分において $x_i \\sim y_i$ が成り立つとき、それらを演算子で結合した結果もまた $f(x_1, \\dots, x_n) \\sim f(y_1, \\dots, y_n)$ として同値となる関係。",
    analogyEn: "A 'consistent make-believe rule.' If you decide that 'plugging a block and a dinosaur together' is equivalent to a 'spaceship', this rule must be consistent (a congruence): if you plug this spaceship into a toy car, it must behave exactly the same way as if you plugged a block and a dinosaur into the toy car. The equivalence must not break when you build larger models.",
    analogyJa: "「ごっこ遊びの一貫した同一視ルール」です。例えば『ブロックと恐竜を繋いだもの』と『宇宙船』を同じとみなすルールを決めたとき、その宇宙船をさらにミニカーに繋ぎ合わせた結果も、ブロックと恐竜を繋ぎ合わせたものをミニカーに繋げた結果と『同じ』でなければなりません。大きな構造を組み立ててもルールが壊れない性質を指します。"
  },
  "quotient": {
    id: "quotient",
    termEn: "Quotient / Quotienting",
    termJa: "商集合・商化 (Quotient)",
    rigorEn: "The partitioning of a set or topological space under an equivalence relation $\\sim$. The resulting quotient structure collapses all equivalent elements into single equivalence classes $[x]$, forming a new space where those elements are declared identical.",
    rigorJa: "同値関係 $\\sim$ の下で集合や位相空間を分割（パーティション）すること。得られる商構造は、同値な要素同士をすべて重ね合わせて単一の同値類 $[x]$ へと崩壊させ、それらを完全に同一のものとして扱う新しい空間を形成する。",
    analogyEn: "The action of a 'Magical Fusing Box.' You throw any compound toy structures you have built into this box, and it instantly fuses together any shapes that are equivalent under your make-believe spaceship rules, returning only the unique types of make-believe toys. It collapses infinite raw possibilities into structured meaning.",
    analogyJa: "「魔法の融合箱」です。組み立てた様々なおもちゃをこの箱に入れると、決めた「ごっこ遊びのルール」に従って同じとみなされるおもちゃ同士が瞬時にくっついて一体化し、ユニークな種類の玩具だけが取り出されます。無秩序に生成された無限の構文を、整理された意味論の形へと折りたたむ操作です。"
  },
  "universal-property": {
    id: "universal-property",
    termEn: "Universal Property",
    termJa: "普遍性 (Universal Property)",
    rigorEn: "A property that uniquely characterizes a mathematical object up to isomorphism, stating that any morphism from/to another object that respects certain constraints factors uniquely through a canonical morphism.",
    rigorJa: "ある数学的対象が、特定の関係性のなかで「同型を除いて一意」に決定される性質。制約を満たす任意の写像が、正準写像を経由して唯一つの写像として一意に分解（因子化）されることを主張する。",
    analogyEn: "Defining an object by its 'unique job description' rather than what it is made of. Instead of saying what a coequalizer is internally, the universal property describes how any other system that attempts to perform the same collapse must factor through it. It defines objects by their relations.",
    analogyJa: "あるモノを「それが何でできているか」ではなく、「それがどのような役割を果たすか（ユニークな接続関係）」によって定義することです。例えば、商空間を定義するとき、要素の中身を説明する代わりに、「同じ接着作業を行うすべての写像は、この商空間の写像を経由して一意に表現される」という関係性のルールで定義します。"
  },
  "coequalizer": {
    id: "coequalizer",
    termEn: "Coequalizer",
    termJa: "コイコライザー / 余等化子",
    rigorEn: "The colimit of a parallel pair of morphisms $f, g: A \\rightrightarrows B$ in a category. It is a morphism $q: B \\to Q$ such that $q \\circ f = q \\circ g$, satisfying the universal property that any $h: B \\to Z$ with $h \\circ f = h \\circ g$ factors uniquely through $q$.",
    rigorJa: "圏における射の並行対 $f, g: A \\rightrightarrows B$ の余極限（Colimit）。等式 $q \\circ f = q \\circ g$ を満たす射 $q: B \\to Q$ であり、かつ $h \\circ f = h \\circ g$ を満たす任意の射 $h: B \\to Z$ が $q$ を経由して一意に分解されるという普遍性を満たすもの。",
    analogyEn: "The 'Universal Fusing Machine.' It takes two different construction paths or shapes and performs the absolute minimum necessary collapse to glue their boundaries together according to your relations, without crushing or destroying other independent parts of your toy models.",
    analogyJa: "「宇宙共通の合体接着装置」です。2つの異なる組み立て方や形状を、決めたルールに従って重ね合わせる際、余計なところまで押し潰して壊すことなく、必要な境界だけをピッタリと接着する「最も無駄のない接着・融合」を行うデバイスです。"
  },
  "adjunction": {
    id: "adjunction",
    termEn: "Adjunction Duality ($F \\dashv U$)",
    termJa: "随伴双対性 ($F \\dashv U$)",
    rigorEn: "A relationship between functors $F: \\mathcal{C} \\to \\mathcal{D}$ and $U: \\mathcal{D} \\to \\mathcal{C}$ establishing a natural isomorphism between hom-sets: $\\text{Hom}_\\mathcal{D}(F(X), Y) \\cong \\text{Hom}_\\mathcal{C}(X, U(Y))$, mapping syntax maps to semantic maps.",
    rigorJa: "関手 $F: \\mathcal{C} \\to \\mathcal{D}$ と $U: \\mathcal{D} \\to \\mathcal{C}$ の間の関係であり、射の集合の間に自然同型 $\\text{Hom}_\\mathcal{D}(F(X), Y) \\cong \\text{Hom}_\\mathcal{C}(X, U(Y))$ を与えるもの。構文の写像を意味論の写像へと1対1で翻訳する。",
    analogyEn: "The 'cosmic translation balance.' It proves that resolving a complex, quotiented semantic system ($Y$) is completely determined by how you map its raw, unconstrained generators ($X$). It shows syntax ($F$) and semantics ($U$) are dual projections of the same underlying truth.",
    analogyJa: "「構文と意味の完璧な通訳関係」です。「ルールに縛られた複雑な意味システム（$Y$）」に対して何か操作を行うことは、その元となる「自由でルールを持たない生の生成元（$X$）」をどうマッピングするかを決めることと完全に一致します。構文（F）と意味（U）は、同じ真理の裏表であることを示しています。"
  },
  "unit-adjunction": {
    id: "unit-adjunction",
    termEn: "Unit of Adjunction ($\\eta$)",
    termJa: "随伴の単位 ($\\eta$)",
    rigorEn: "A natural transformation $\\eta: \\text{Id}_{\\mathcal{C}} \\Rightarrow UF$ representing the canonical insertion of raw objects into the free algebraic structure: $\\eta_X(x) = [x]$ (inclusion of generators).",
    rigorJa: "自然変換 $\\eta: \\text{Id}_{\\mathcal{C}} \\Rightarrow UF$。生の対象を、自由生成された代数構造の中へと埋め込む正準写像を表す：$\\eta_X(x) = [x]$ （生成元の包含射）。",
    analogyEn: "The act of 'packaging' or 'quoting.' It takes a raw element (like the character 'a') and wraps it into the syntax format (like the word string \"a\"). It represents the starting injection of syntax.",
    analogyJa: "「箱詰め」または「引用符で囲む」行為です。生の記号（例：文字 'a'）を受け取り、それをシステムが認識できる構文形式（例：文字列 \"a\"）へとラップする最初のステップです。構文入力の開始を意味します。"
  },
  "counit-adjunction": {
    id: "counit-adjunction",
    termEn: "Counit of Adjunction ($\\varepsilon$)",
    termJa: "随伴の余単位 ($\\varepsilon$)",
    rigorEn: "A natural transformation $\\varepsilon: FU \\Rightarrow \\text{Id}_{\\mathcal{D}}$ representing the evaluation collapse of free structures: $\\varepsilon_M(x_1 \\dots x_n) = x_1 \\cdot x_2 \\dots \\cdot x_n$ (monoid evaluation).",
    rigorJa: "自然変換 $\\varepsilon: FU \\Rightarrow \\text{Id}_{\\mathcal{D}}$。自由生成された代数項を、その代数自体の演算ルールに従って評価し、元の対象へと折りたたむ正準写像：$\\varepsilon_M(x_1 \\dots x_n) = x_1 \\cdot x_2 \\dots \\cdot x_n$ （モノイド評価射）。",
    analogyEn: "The act of 'unpacking' or 'executing.' It takes a list of terms or a syntax tree and runs the operations (e.g., multiplying or adding them) to collapse them into a single resolved value. It represents the final quotient evaluation.",
    analogyJa: "「開梱」または「プログラムの実行」です。文字列や木構造の数式を受け取り、その中の掛け算や足し算を実際に計算して、一つの「答え」という値へと折りたたむプロセスです。商化による評価の完了を意味します。"
  },
  "monad": {
    id: "monad",
    termEn: "Monad ($T = UF$)",
    termJa: "モナド ($T = UF$)",
    rigorEn: "An endofunctor $T: \\mathcal{C} \\to \\mathcal{C}$ equipped with natural transformations $\\eta: \\text{Id} \\Rightarrow T$ (unit) and $\\mu: T^2 \\Rightarrow T$ (multiplication/flattening) satisfying associativity and unit coherence laws.",
    rigorJa: "自己関手 $T: \\mathcal{C} \\to \\mathcal{C}$ と、自然変換である単位 $\\eta: \\text{Id} \\Rightarrow T$ および乗法 $\\mu: T^2 \\Rightarrow T$ （平坦化）の組であり、結合則と単位元則を満たすもの。",
    analogyEn: "A 'computational sandbox.' It is a machine that takes raw values, wraps them into a structure where they can be manipulated (like strings or lists of terms), and provides a way to flatten nested structures (e.g., turning a list of lists into a single flat list).",
    analogyJa: "「計算用のカプセル（サンドボックス）」です。値を受け取り、それを安全に操作できる構造（文字列やリストなど）に包み込み、さらに入れ子になった構造（リストのリストなど）を平坦な一つの構造に潰す機能を提供する一連の仕組みです。"
  },
  "eilenberg-moore": {
    id: "eilenberg-moore",
    termEn: "Eilenberg-Moore Algebra $(X, h)$",
    termJa: "アイレンバーグ・ムーア代数 $(X, h)$",
    rigorEn: "A pair $(X, h)$ of an object $X$ and a monadic evaluation map $h: T(X) \\to X$ compatible with the monad's unit $\\eta$ and multiplication $\\mu$, satisfying $h \\circ \\eta_X = \\text{id}_X$ and $h \\circ \\mu_X = h \\circ T(h)$.",
    rigorJa: "対象 $X$ とモナド的評価写像 $h: T(X) \\to X$ のペア $(X, h)$。モナドの単位元 $\\eta$ および乗法 $\\mu$ と両立し、コヒーレンス関係 $h \\circ \\eta_X = \\text{id}_X$ および $h \\circ \\mu_X = h \\circ T(h)$ を満たすもの。",
    analogyEn: "A 'consistent solver.' It is a set equipped with a rule ($h$) that consistently resolves monadic syntax (like nested expressions or strings) back into a single element of that set, ensuring the evaluation maps are stable and well-behaved.",
    analogyJa: "「一貫した解答ルール」です。モナドによって生成された構文の式を受け取り、それを一貫したルールに従って集合 $X$ の要素へと計算（解決）する評価写像 $h$ を備えた構造であり、計算が途中で矛盾を起こさないことを保証します。"
  },
  "yoneda-lemma": {
    id: "yoneda-lemma",
    termEn: "Yoneda Lemma",
    termJa: "米田の補題 (Yoneda Lemma)",
    rigorEn: "A natural isomorphism $\\text{Nat}(h^A, P) \\cong P(A)$ for any contravariant representable functor $h^A = \\text{Hom}(-, A)$ and presheaf $P$, proving that the Yoneda embedding $Y: \\mathcal{C} \\to [\\mathcal{C}^{\\text{op}}, \\mathbf{Set}]$ is fully faithful.",
    rigorJa: "任意の表現可能反変関手 $h^A = \\text{Hom}(-, A)$ とプレシェフ $P$ に対する自然同型 $\\text{Nat}(h^A, P) \\cong P(A)$。これによって米田埋め込み $Y: \\mathcal{C} \\to [\\mathcal{C}^{\\text{op}}, \\mathbf{Set}]$ が完全忠実であることが証明される。",
    analogyEn: "The ultimate principle of 'relational identity.' It states that an object has no internal structure or substance that you need to peek at; rather, its entire identity and properties are completely and uniquely defined by the network of its relationships with all other objects.",
    analogyJa: "「関係性こそが存在のすべてである」という哲学の証明です。対象を定義するとき、その内部をのぞき込む必要はありません。その対象が、他のすべての対象とどのような関係（射）を結んでいるかというネットワークの総和こそが、その対象の個性を一意に決定することを示しています。"
  },
  "skeleton": {
    id: "skeleton",
    termEn: "Skeleton of a Category",
    termJa: "圏の骨格 (Skeleton)",
    rigorEn: "A subcategory $\\text{sk}(\\mathcal{C})$ that is equivalent to $\\mathcal{C}$ and in which no two distinct objects are isomorphic. It strips redundant isomorphic copies, leaving one canonical representative per isomorphism class.",
    rigorJa: "元の圏 $\\mathcal{C}$ と圏同値であり、かつ任意の異なる2つの対象が同型にならないような部分圏 $\\text{sk}(\\mathcal{C})$。同型な冗長オブジェクトを排除し、各同型類から代表的な1つの対象だけを残した構造。",
    analogyEn: "A 'minimal catalog.' Imagine a store that sells t-shirts. Instead of displaying thousands of identical medium red shirts, the catalog displays just one representative shirt for that specific size and color. It simplifies the syntax without losing any structural information.",
    analogyJa: "「代表サンプルの見本市」です。同じ形や色のTシャツが何千枚も倉庫にあっても、カタログには代表的な1枚だけを掲載するようなものです。構造的な情報を一切失うことなく、重複する同型オブジェクトを排除してシステムを極限までシンプルにします。"
  },
  "diffeomorphism": {
    id: "diffeomorphism",
    termEn: "Diffeomorphism",
    termJa: "微分同相写像 (Diffeomorphism)",
    rigorEn: "An isomorphism in the category of smooth manifolds: a smooth bijective function between manifolds whose inverse function is also smooth.",
    rigorJa: "滑らかな多様体の圏における同型射。多様体間の滑らかな全単射であり、かつその逆関数もまた滑らかであるもの。",
    analogyEn: "A 'perfectly smooth warping.' Imagine taking a rubber sheet and stretching, bending, or curving it smoothly without tearing it, cutting holes, or gluing edges. It maps coordinates smoothly, representing coordinate-invariant shapes.",
    analogyJa: "「破れのない滑らかなゴムの変形」です。ゴムシートを引き伸ばしたり曲げたりするように、シートを引き裂いたり、穴を開けたり、端を接着したりすることなく、すべての点を滑らかにマッピングする座標変換です。空間の幾何的性質を保ちます。"
  },
  "homotopy-equivalence": {
    id: "homotopy-equivalence",
    termEn: "Homotopy Equivalence",
    termJa: "ホモトピー同値 (Homotopy Equivalence)",
    rigorEn: "A relation between continuous maps representing continuous deformation. Two spaces $X$ and $Y$ are homotopy equivalent if there exist maps $f: X \\to Y$ and $g: Y \\to X$ such that $g \\circ f \\sim \\text{id}_X$ and $f \\circ g \\sim \\text{id}_Y$.",
    rigorJa: "連続写像の間の連続変形（ホモトピー）による同値関係。2つの空間 $X$ と $Y$ の間に連続写像 $f: X \\to Y$ と $g: Y \\to X$ が存在し、それらの合成がそれぞれの恒等写像にホモトピー変形可能である状態。",
    analogyEn: "A 'topological warping of holes.' It is a rule that says two shapes are equivalent if you can deform one into the other smoothly (stretching or contracting) without closing existing holes or punching new holes (e.g. a coffee cup is equivalent to a donut).",
    analogyJa: "「穴を増やしたり潰したりしないトポロジー的な変形」です。引き伸ばしたり縮めたりする変形を行っても、空間に新しく穴を開けたり、すでにある穴を塞いだりしない限り、2つの形を「同じ」とみなすルールです（例：マグカップとドーナツは同じ形）。"
  },
  "piecewise-isometry": {
    id: "piecewise-isometry",
    termEn: "Piecewise Isometry",
    termJa: "区分的等長写像 (Piecewise Isometry)",
    rigorEn: "A continuous mapping $f: P \\to \\mathbb{R}^3$ from a partitioned domain $P$ that preserves geodesic distances along paths strictly within each individual partitioned region (face).",
    rigorJa: "分割された領域 $P$ からの連続写像 $f: P \\to \\mathbb{R}^3$ であり、分割された各小領域（面）の内部において、パスに沿った距離（測地線距離）を完全に保存するもの。",
    analogyEn: "Folding a flat piece of paper without stretching or cutting. The paper can bend along the crease lines, but the flat shapes of the paper's faces are preserved completely (no distortion within the faces).",
    analogyJa: "「紙を切ったり引き伸ばしたりせずに折る」写像です。折り線に沿って紙を曲げることはできますが、紙のそれぞれの平面部分（面）自体は一切伸び縮みせず、そのままの平らな距離関係を保っている状態を指します。"
  },
  "isomorphism": {
    id: "isomorphism",
    termEn: "Isomorphism ($\\cong$)",
    termJa: "同型射 (Isomorphism)",
    rigorEn: "A morphism $f: A \\to B$ in a category is an isomorphism if there exists a morphism $g: B \\to A$ such that $f \\circ g = \\text{id}_B$ and $g \\circ f = \\text{id}_A$. It represents a invertible structural equivalence.",
    rigorJa: "圏における射 $f: A \\to B$ であり、ある射 $g: B \\to A$ が存在して $f \\circ g = \\text{id}_B$ および $g \\circ f = \\text{id}_A$ を満たすもの。逆射を持つ構造的な等価性を表す。",
    analogyEn: "A 'perfect structural match.' Two systems that might look different on the surface (like Roman numerals and Arabic numerals) but behave exactly the same way under all operations, meaning they are structurally identical.",
    analogyJa: "「完璧な構造の対称性」です。表面的な表記が異なっていても（例：ローマ数字とアラビア数字）、すべての操作において全く同じように機能するため、構造としては「同じ」とみなせる状態を指します。"
  },
  "pullback": {
    id: "pullback",
    termEn: "Pullback / Equalizer",
    termJa: "プルバック・等化子",
    rigorEn: "A pullback is the limit of a diagram of two morphisms sharing a codomain. In Set, it represents the subset of the Cartesian product satisfying a matching equation, acting as the universal intersection.",
    rigorJa: "共通の終域を持つ2つの射の図式に対する極限（Limit）。集合の圏 Set においては、条件をみたす直積集合の部分集合を構成し、普遍的な交わり（フィルタリング）として機能する。",
    analogyEn: "A 'matching filter' or 'intersection.' Like an SQL JOIN operation that combines two tables by matching a shared key, pulling back coordinates to a common denominator.",
    analogyJa: "「条件の合致によるフィルタリング」です。データベースの JOIN 操作のように、共通のキーを基準にして2つのテーブルを結合し、条件に一致するデータだけを抽出する仕組みに相当します。"
  },
  "signature": {
    id: "signature",
    termEn: "Signature ($\\Sigma$)",
    termJa: "シグネチャ ($\\Sigma$)",
    rigorEn: "A set of operation symbols $\\Sigma$, where each symbol $f \\in \\Sigma$ is assigned a non-negative integer $n \\in \\mathbb{N}_0$ representing its arity, defining the vocabulary of an algebraic structure.",
    rigorJa: "代数的構造の語彙を定義する演算記号の集合 $\\Sigma$。各演算記号 $f \\in \\Sigma$ には、その引数の個数を表す非負整数 $n \\in \\mathbb{N}_0$ （アリティ）が割り当てられている。",
    analogyEn: "The 'Lego Connectors and Plugs' available in your toy box. It lists all the combining tools (operations) you are allowed to use to connect your raw toys together, defining the exact ways you can build larger structures.",
    analogyJa: "おもちゃ箱に入っている「レゴのコネクタパーツ」のセットです。バラバラのおもちゃ同士を繋ぎ合わせるために使うことができる合体ツールのリストであり、どのような繋ぎ方が可能であるかの基本ルール（語彙）を定めます。"
  },
  "arity": {
    id: "arity",
    termEn: "Arity",
    termJa: "アリティ（引数の数）",
    rigorEn: "The number of arguments or operands that an operation takes. An operation with arity $n$ is called an $n$-ary operation (unary for $n=1$, binary for $n=2$, nullary for $n=0$).",
    rigorJa: "一つの演算が受け取る引数（被演算子）の個数のこと。引数が $n$ 個の演算を $n$項演算と呼ぶ（$n=1$ は単項演算、$n=2$ は二項演算、$n=0$ は定数演算）。",
    analogyEn: "The 'number of plug holes' on a Lego connector block. A binary connector (arity 2) joins two toys together. A unary connector (arity 1) has one plug to turn a single toy upside down. A nullary connector (arity 0) has no plug holes and acts like a fixed sticker.",
    analogyJa: "レゴのコネクタブロックにある「プラグの穴の数」です。2つの穴を持つコネクタ（アリティ2）は、2つのおもちゃを繋ぎます。1つの穴のコネクタ（アリティ1）はおもちゃを1つひっくり返します。0個の穴（アリティ0）はおもちゃに貼り付けるだけのステッカーです。"
  },
  "finite": {
    id: "finite",
    termEn: "Finite / Finitary",
    termJa: "有限・有限項 (Finitary)",
    rigorEn: "Restricting operations to accept only a finite number of arguments (finite arity $n < \\infty$). This ensures that all algebraic terms are constructed in a finite number of steps.",
    rigorJa: "演算子が受け取る引数の数を有限（有限アリティ $n < \\infty$）に制限すること。これにより、すべての代数的な項が有限回のステップで構築されることが保証される。",
    analogyEn: "Having a limited, countable number of inputs. It means we cannot perform a single computational operation that requires combining infinitely many variables all at once.",
    analogyJa: "引数の数が有限で、数え切れることを意味します。無限個の変数を一瞬でまとめて計算するような、実現不可能な「無限入力演算」を排除するためにこの制限を設けます。"
  },
  "operation": {
    id: "operation",
    termEn: "Operation",
    termJa: "代数演算 (Operation)",
    rigorEn: "An $n$-ary operation on a set $A$ is a function $f: A^n \\to A$ that maps $n$-tuples of elements in $A$ to a single element in $A$.",
    rigorJa: "集合 $A$ 上の $n$項演算とは、集合の直積 $A^n$ から $A$ への関数 $f: A^n \\to A$ であり、$n$個の要素の組み合わせを一意な $A$ の要素に送り出すものを指す。",
    analogyEn: "A 'combining machine.' It takes a set number of inputs (like numbers or terms) and processes them according to a rule to output a single combined result.",
    analogyJa: "「合体マシン」です。指定された数の入力（数値や記号）を回収し、特定の合成ルールに従って処理して、一つの合体した出力結果を送り出します。"
  },
  "term-algebra": {
    id: "term-algebra",
    termEn: "Term / Term Algebra ($F(X)$)",
    termJa: "項・項代数 ($F(X)$)",
    rigorEn: "The free $\\Sigma$-algebra $F(X)$ recursively generated on a set $X$ containing all variables in $X$ and all composite expressions $f(t_1, \\dots, t_n)$ for any operation $f \\in \\Sigma$ and terms $t_i$.",
    rigorJa: "集合 $X$ 上で再帰的に生成される自由 $\\Sigma$-代数 $F(X)$。$X$ のすべての変数を含み、かつ任意の演算子 $f \\in \\Sigma$ とすでに構築された項 $t_i$ からなるすべての合成式 $f(t_1, \\dots, t_n)$ を含む構造。",
    analogyEn: "The set of all 'Grammar-Correct Toy Models' you can construct. Any shape you build by plugging raw toys together using the connectors (e.g. plugging a block to a dinosaur, and then plugging that to a toy car) is a valid 'term' in this algebra.",
    analogyJa: "ルールに従って正しく組み立てられた「すべての玩具モデルの完成形」の集まりです。生の玩具（ブロックや恐竜など）をコネクタを使って繋ぎ合わせてできる、どのような複雑な組み立て構造物も、この代数における有効な「項（式）」になります。"
  }
};
