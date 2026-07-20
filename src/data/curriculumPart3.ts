import type { RoomData } from './curriculumData';

export const roomsPart3: Record<number, RoomData> = {
  21: {
    id: 21,
    nameEn: "Hall XXI: Functorial Bridges (F and U)",
    nameJa: "第XXI室：関手の架け橋（FとU）",
    thesisEn: "Free Functor $F$ (creating syntax) and Forgetful Functor $U$ (stripping rules).",
    thesisJa: "構文を生成する自由関手 $F$ と、規則を取り除く忘却関手 $U$ による圏の接続。",
    en: {
      narrative: "How do sets and monoids talk to each other? We build Functors—bridges between structural universes. The Free Functor $F$ takes an unstructured set and generates the free monoid of all possible strings (Syntax). The Forgetful Functor $U$ takes a structured monoid and forgets its multiplication, stripping the algebraic rules to return a plain set. These two functors create a dynamic dialogue between syntax and semantics, showing how translation preserves structure.",
      rigor: "The Free Functor $F: Set \\to Mon$ maps a set $X$ to the free monoid $F(X) = X^*$ of strings under concatenation (with identity as empty string $\\epsilon$). On morphisms, it maps a function $f: X \\to Y$ to the monoid homomorphism $F(f): X^* \\to Y^*$ defined by $F(f)(x_1 \\dots x_n) = f(x_1) \\dots f(x_n)$ and $F(f)(\\epsilon) = \\epsilon$. The Forgetful Functor $U: Mon \\to Set$ maps a monoid $M = (S, \\cdot, e)$ to its underlying set $S$, and a monoid homomorphism $\\phi: M_1 \\to M_2$ to its underlying set function. Functoriality dictates that both satisfy identity preservation ($F(\\text{id}_X) = \\text{id}_{F(X)}$) and composition preservation ($F(g \\circ f) = F(g) \\circ F(f)$).",
      history: "The concept of free algebras and forgetting structures is central to algebraic geometry and abstract algebra. In the mid-20th century, Eilenberg and Mac Lane unified these translations through functorial mapping, showing that mathematics is the study of how structures map and translate.",
      exercises: "1. Prove that $F: Set \\to Mon$ is a functor by checking the identity preservation and composition laws.\n2. Prove that if $f: X \\to Y$ is an injection in $Set$, then $F(f): F(X) \\to F(Y)$ is a monomorphism in the category $Mon$."
    },
    ja: {
      narrative: "集合の圏（無秩序）とモノイドの圏（秩序）は、どのように対話するでしょうか？私たちは圏と圏を繋ぐ翻訳機である「関手（Functor）」という架け橋を架けます。「自由関手 $F$」は、生の集合を受け取り、すべての可能な文字列の自由モノイド（構文）を生成します。一方、「忘却関手 $U$」は、構造化されたモノイドから掛け算の規則を忘れて取り去り、単なる生の集合へと戻します。この一対の関手が、構文生成と意味忘却の動的な対話を生み出します。",
      rigor: "自由関手 $F: Set \\to Mon$ は、集合 $X$ を、空文字列 $\\epsilon$ を単位元とし文字列の結合を演算とする自由モノイド $F(X) = X^*$ にマッピングする。射に関して、関数 $f: X \\to Y$ をモノイド準同型写像 $F(f): X^* \\to Y^*$ （$F(f)(x_1 \\dots x_n) = f(x_1) \\dots f(x_n)$ および $F(f)(\\epsilon) = \\epsilon$）にマッピングする。忘却関手 $U: Mon \\to Set$ は、モノイド $M = (S, \\cdot, e)$ をその台集合 $S$ に、モノイド準同型写像 $\\phi$ を台関数にマッピングする。関手性により、両者は恒等射の保存（$F(\\text{id}_X) = \\text{id}_{F(X)}$）および射の合成の保存（$F(g \\circ f) = F(g) \\circ F(f)$）を満たす。",
      history: "自由代数の構成と代数構造の忘却は、抽象代数学や代数幾何学の核心的なアイデアです。20世紀半ばにアイレンバーグとマックレーンがこれらを「関手」として定式化し、数学の本質が対象そのものではなく「構造の翻訳と写像」にあることを明らかにしました。",
      exercises: "1. 恒等射の保存則および合成保存則を検証することにより、$F: Set \\to Mon$ が関手であることを証明せよ。\n2. 写像 $f: X \\to Y$ が $Set$ において単射であるとき、準同型写像 $F(f): F(X) \\to F(Y)$ がモノイドの圏 $Mon$ においてモノ射であることを証明せよ。"
    }
  },
  22: {
    id: 22,
    nameEn: "Hall XXII: The Adjunction Duality",
    nameJa: "第XXII室：随伴双対性（F ⊣ U）",
    thesisEn: "Natural isomorphism $\\text{hom}(F(X), M) \\cong \\text{hom}(X, U(M))$. Proof that quotient evaluation is determined at the generators.",
    thesisJa: "自然同型 $\\text{hom}(F(X), M) \\cong \\text{hom}(X, U(M))$。商の評価は生成元でのみ決定されることの証明。",
    en: {
      narrative: "The climax of our exhibition is the Adjunction Duality ($F \\dashv U$). It establishes a natural isomorphism between mapping spaces: $\\text{hom}(F(X), M) \\cong \\text{hom}(X, U(M))$. This is the formal mathematical proof of our core thesis. It states that defining a structural homomorphism (the quotient evaluation) out of a freely generated structure is identical to simply choosing where the raw generators map. Evaluating a quotient is uniquely determined at the generators.",
      rigor: "The bijection $\\Phi_{X, M}: \\text{Hom}_{Mon}(F(X), M) \\cong \\text{Hom}_{Set}(X, U(M))$ is natural in both $X \\in Set$ and $M \\in Mon$. For any monoid homomorphism $g: F(X) \\to M$, there corresponds a unique set function $f: X \\to U(M)$ given by $f = U(g) \\circ \\eta_X$, where $\\eta_X: X \\to UF(X)$ is the unit of the adjunction (the inclusion of generators). Conversely, any set function $f: X \\to U(M)$ extends uniquely to a monoid homomorphism $\\bar{f}: F(X) \\to M$ such that $U(\\bar{f}) \\circ \\eta_X = f$. Naturality means that for any $h: X' \\to X$ in $Set$ and $k: M \\to M'$ in $Mon$, the diagram commutes: $(k \\circ - \\circ F(h))$ matches $(U(k) \\circ - \\circ h)$ under $\\Phi$.",
      history: "Discovered by Daniel Kan in 1958. It stands as one of the most powerful organizing concepts in mathematics, demonstrating that syntax (represented by $F$) and semantics (represented by $U$) are not opposing forces, but rather dual projections of the same truth, proving that the behavior of any complex, quotiented semantic system is determined entirely at its generators.",
      exercises: "1. Write out the explicit algebraic equations for the naturality conditions of $\\Phi_{X, M}$ with respect to a set map $h: X' \\to X$ and a monoid homomorphism $k: M \\to M'$, and prove that these equations hold.\n2. Prove the uniqueness of left adjoints: show that if there is another functor $F': Set \\to Mon$ that is left adjoint to $U$, then there is a natural isomorphism $F \\cong F'$."
    },
    ja: {
      narrative: "本展示のクライマックスは、随伴双対性（$F \\dashv U$）です。これは写像空間の間に横たわる自然同型 $\\text{hom}(F(X), M) \\cong \\text{hom}(X, U(M))$ を樹立します。これは私たちの核心的なテーゼの数学的証明です。「自由生成された構造（構文）から、構造を保つ写像（商評価）を定義すること」は、「生の生成元がどこにマッピングされるかを決めること」と完全に同値です。商の評価は、生成元の挙動だけで一意に決定されるのです。",
      rigor: "全単射 $\\Phi_{X, M}: \\text{Hom}_{Mon}(F(X), M) \\cong \\text{Hom}_{Set}(X, U(M))$ は、集合 $X$ とモノイド $M$ の両方に関して自然（Natural）である。任意のモノイド準同型写像 $g: F(X) \\to M$ に対し、関数 $f = U(g) \\circ \\eta_X$ が一意に対応する（$\\eta_X: X \\to UF(X)$ は随伴の単位元で、生成元の包含を表す）。逆に、任意の関数 $f: X \\to U(M)$ は、準同型写像 $\\bar{f}: F(X) \\to M$ へと一意に拡張され、$U(\\bar{f}) \\circ \\eta_X = f$ を満たす。自然性とは、任意の写像 $h: X' \\to X$ および準同型写像 $k: M \\to M'$ に対し、射の引き戻し・送り出し演算が $\\Phi$ を通じて可換になることである。",
      history: "1958年にダニエル・カンによって発見されました。随伴は数学における最も強力な統一概念の1つであり、構文（F）と意味（U）が対立するものではなく、同一の真理の双対写像であることを証明しました。これにより、複雑に商化された意味体系の挙動が、生の生成元のマッピング方法だけで完全に決定されることが証明されました。",
      exercises: "1. 集合写像 $h: X' \\to X$ およびモノイド準同型写像 $k: M \\to M'$ に対する $\\Phi_{X, M}$ の自然性条件を数式で明示し、それらが成り立つことを代数的に証明せよ。\n2. 左随伴関手の一意性を証明せよ：別の関手 $F': Set \\to Mon$ もまた $U$ の左随伴であるならば、自然同型 $F \\cong F'$ が存在することを示せ。"
    }
  },
  23: {
    id: 23,
    nameEn: "Hall XXIII: The Unit (η) and Counit (ε)",
    nameJa: "第XXIII室：単位（η）と余単位（ε）",
    thesisEn: "Unit $\\eta$ (generator inclusion) and Counit $\\varepsilon$ (algebraic evaluation collapse).",
    thesisJa: "単位 $\\eta$ （生成元の包含）と、余単位 $\\varepsilon$ （代数的な評価の崩壊・商化）。",
    en: {
      narrative: "Adjunctions operate through two fundamental maps: the Unit ($\\eta$) and the Counit ($\\varepsilon$). The Unit $\\eta$ maps the raw generators into the free algebraic structure (inclusion of syntax). The Counit $\\varepsilon$ evaluates the structured terms, collapsing the free terms back into algebraic values (quotient collapse). They represent inclusion and collapse, the basic inhalation and exhalation of mathematical logic, bridging representation and evaluation.",
      rigor: "The Unit $\\eta: \\text{Id}_{Set} \\Rightarrow UF$ is a natural transformation representing generator inclusion: $\\eta_X(x) = [x]$ (the string of length 1). The Counit $\\varepsilon: FU \\Rightarrow \\text{Id}_{Mon}$ is a natural transformation representing evaluation: $\\varepsilon_M(x_1 \\dots x_n) = x_1 \\cdot x_2 \\dots \\cdot x_n$ (multiplying string elements via the monoid multiplication of $M$). They satisfy the naturality equations: $\\eta_Y \\circ f = U(F(f)) \\circ \\eta_X$ and $\\varepsilon_N \\circ F(U(g)) = g \\circ \\varepsilon_M$ for $f: X \\to Y$ and $g: M \\to N$. They satisfy the triangular identities: $U(\\varepsilon_M) \\circ \\eta_{U(M)} = \\text{id}_{U(M)}$ and $\\varepsilon_{F(X)} \\circ F(\\eta_X) = \\text{id}_{F(X)}$.",
      history: "Developed as internal components of Kan's adjunction theory. They describe how syntax is packaged (unit) and how it is unpackaged/collapsed into semantic values (counit), representing the universal mechanics of evaluation in compilers and logic.",
      exercises: "1. Prove the naturality of the unit $\\eta$ and the counit \\varepsilon for the $Free \\dashv Forgetful$ adjunction.\n2. Algebraically verify both triangular identities by tracing a generic element through the compositions: show that $(U(\\varepsilon_M) \\circ \\eta_{U(M)})(x) = x$ for any $x \\in U(M)$, and $(\\varepsilon_{F(X)} \\circ F(\\eta_X))(s) = s$ for any string $s \\in F(X)$."
    },
    ja: {
      narrative: "随伴関係は、2つの対照的な写像「単位（$\\eta$）」と「余単位（$\\varepsilon$）」を通じて機能します。単位 $\\eta$ は、生の生成元を自由代数構造の中へと挿入します（構文の包含）。余単位 $\\varepsilon$ は、構造化された項を演算に沿って評価し、元の代数対象へと崩壊させます（意味論的商化）。これらは包含と崩壊、すなわち数学的論理における吸気と呼気であり、表現と評価を仲介します。",
      rigor: "単位 $\\eta: \\text{Id}_{Set} \\Rightarrow UF$ は生成元の包含を表す自然変換である：$\\eta_X(x) = [x]$ （長さ1の文字列）。余単位 $\\varepsilon: FU \\Rightarrow \\text{Id}_{Mon}$ は評価を表す自然変換である：$\\varepsilon_M(x_1 \\dots x_n) = x_1 \\cdot x_2 \\dots \\cdot x_n$ （モノイド $M$ の乗算による文字列の評価・折り畳み）。これらは次の自然性条件を満たす：$\\eta_Y \\circ f = U(F(f)) \\circ \\eta_X$ および $\\varepsilon_N \\circ F(U(g)) = g \\circ \\varepsilon_M$。さらに、次の三角恒等式（triangular identities）を満たす：$U(\\varepsilon_M) \\circ \\eta_{U(M)} = \\text{id}_{U(M)}$ および $\\varepsilon_{F(X)} \\circ F(\\eta_X) = \\text{id}_{F(X)}$。",
      history: "カンの随伴論の内部構造として定式化されました。これらは、構文がいかにカプセル化されるか（単位）、そしてそれがいかに意味論的価値へと崩壊・商化されるか（余単位）を表しており、コンパイラや数理論理学における評価機構の万能の設計図となっています。",
      exercises: "1. 自由・忘却随伴における単位 $\\eta$ および余単位 $\\varepsilon$ の自然性を証明せよ。\n2. 三角恒等式が代数的に成り立つことを証明せよ：任意の元 $x \\in U(M)$ に対して $(U(\\varepsilon_M) \\circ \\eta_{U(M)})(x) = x$ であること、および任意の文字列 $s \\in F(X)$ に対して $(\\varepsilon_{F(X)} \\circ F(\\eta_X))(s) = s$ であることを、元の追跡によって確認せよ。"
    }
  },
  24: {
    id: 24,
    nameEn: "Hall XXIV: Monads & Eilenberg-Moore Algebras",
    nameJa: "第XXIV室：モナドとアイレンバーグ・ムーア代数",
    thesisEn: "The monad composite $T = UF$ and monadic quotient algebras.",
    thesisJa: "随伴の合成としてのモナド $T = UF$ と、モナド的商代数の構成。",
    en: {
      narrative: "When we compose the Free Functor $F$ and the Forgetful Functor $U$, we get a Monad $T = UF$ on $Set$. A Monad is an algebraic machine in the category of Sets that generates terms and flattens nested structures ($T^2 \\to T$). The Eilenberg-Moore algebras prove that any structured mathematical category is equivalent to a category of sets quotiented by monad equations, proving that all algebra is the quotienting of monadic syntax.",
      rigor: "A Monad $(T, \\eta, \\mu)$ on a category $\\mathcal{C}$ is an endofunctor $T: \\mathcal{C} \\to \\mathcal{C}$ with natural transformations $\\eta: \\text{Id}_\\mathcal{C} \\Rightarrow T$ (unit) and $\\mu: T^2 \\Rightarrow T$ (multiplication/flattening) satisfying associativity $\\mu \\circ T\\mu = \\mu \\circ \\mu T$ and unit laws $\\mu \\circ T\\eta = \\text{id}_T = \\mu \\circ \\eta T$. An algebra for $T$ (Eilenberg-Moore algebra) is a pair $(X, h)$ where $h: T(X) \\to X$ is a morphism in $\\mathcal{C}$ satisfying $h \\circ \\eta_X = \\text{id}_X$ and $h \\circ \\mu_X = h \\circ T(h)$. This map $h$ is a quotient collapse resolving monadic syntax $T(X)$ into the set $X$. Beck's Monadicity Theorem shows that the category of monoids $Mon$ is equivalent to the Eilenberg-Moore category $Set^T$ for the list monad.",
      history: "Formalized by Roger Godement (under the name 'standard construction') and expanded by Samuel Eilenberg and John Moore. In computer science, Eugenio Moggi (1989) introduced monads to model side effects, proving that computing is monadic syntax generation and quotient evaluation.",
      exercises: "1. Write down the monad structure $(T, \\eta, \\mu)$ generated by the $Free \\dashv Forgetful$ adjunction between $Set$ and $Mon$, and verify the associativity and unit laws for the list monad.\n2. State and prove Beck's Monadicity Theorem for the Category of Monoids, showing that the comparison functor $K: Mon \\to Set^T$ (mapping $M \\mapsto (U(M), U(\\varepsilon_M))$) is an equivalence of categories."
    },
    ja: {
      narrative: "自由関手 $F$ と忘却関手 $U$ を合成すると、集合の圏における「モナド $T = UF$」が得られます。モナドは、項を生成し、二重に入れ子になった構造を平坦化（Flattening: $T^2 \\to T$）する、代数的演算マシンです。アイレンバーグ・ムーア代数は、構造化されたあらゆる数学的圏が、モナド方程式で商化された集合の圏と等価であることを証明します。すべての代数はモナド的構文の商化なのです。",
      rigor: "圏 $\\mathcal{C}$ 上のモナド $(T, \\eta, \\mu)$ は、自己関手 $T: \\mathcal{C} \\to \\mathcal{C}$ と、単位元 $\\eta: \\text{Id}_\\mathcal{C} \\Rightarrow T$、乗法（平坦化） $\\mu: T^2 \\Rightarrow T$ からなり、結合則 $\\mu \\circ T\\mu = \\mu \\circ \\mu T$ および単位元則 $\\mu \\circ T\\eta = \\text{id}_T = \\mu \\circ \\eta T$ を満たす。$T$の代数（アイレンバーグ・ムーア代数）とは、ペア $(X, h)$ （$h: T(X) \\to X$ は $\\mathcal{C}$ の射）であって、$h \\circ \\eta_X = \\text{id}_X$ および $h \\circ \\mu_X = h \\circ T(h)$ を満たすものである。この写像 $h$ は、モナドが生成した構文 $T(X)$ を集合 $X$ へと解決する商写像である。ベックのモナド性定理（Beck's Monadicity Theorem）は、モノイドの圏 $Mon$ が、リストモナドの代数の圏 $Set^T$ と同値であることを示す。",
      history: "ロジェ・ゴドマンによって定式化され、サミュエル・アイレンバーグとジョン・ムーアによって発展しました。コンピュータサイエンスにおいては、オジェニオ・モッジ（1989年）が副作用をモデル化するためにモナドを導入し、プログラミングにおける計算がモナド的構文の生成と商評価そのものであることを証明しました。",
      exercises: "1. 集合の圏 $Set$ とモノイドの圏 $Mon$ の随伴が生成するリストモナド $(T, \\eta, \\mu)$ を定義し、モナドの結合法則および単位元法則が成り立つことを証明せよ。\n2. モノイドの圏 $Mon$ に定式化されたベックのモナド性定理の適用について説明し、比較関手 $K: Mon \\to Set^T$ （モノイド $M$ を $(U(M), U(\\varepsilon_M))$ に送る）が圏同値を与えることを証明せよ。"
    }
  },
  25: {
    id: 25,
    nameEn: "Hall XXV: The Yoneda Lemma",
    nameJa: "第XXV室：米田の補題（関係性の極致）",
    thesisEn: "$\\text{Nat}(h^A, P) \\cong P(A)$. An object has no internal parts; it is defined entirely as the quotient limit of its outgoing relationships.",
    thesisJa: "$\\text{Nat}(h^A, P) \\cong P(A)$。対象は内部を持たず、外部との関係性の総和（商極限）としてのみ定義される。",
    image: "/images/yoneda_network.jpg",
    imageAlt: "Yoneda morphism network showing relational mappings",
    en: {
      narrative: "We conclude with the most profound theorem in Category Theory: the Yoneda Lemma. In our core philosophy, we have seen how elements generate and relations quotient. The Yoneda Lemma takes this to the extreme: an object in a category has no intrinsic substance. Its entire identity, structure, and existence is completely and uniquely determined by observing its relationship to all other objects. Relationship is existence itself, quotienting out the need for internal essence.",
      rigor: "Let $\\mathcal{C}$ be a locally small category, and let $A$ be an object of $\\mathcal{C}$. Let $h^A = \\text{Hom}_\\mathcal{C}(-, A)$ be the contravariant representable functor (presheaf). For any presheaf functor $P: \\mathcal{C}^{\\text{op}} \\to Set$, the Yoneda Lemma asserts a natural isomorphism: $\\text{Nat}(h^A, P) \\cong P(A)$ given by $\\alpha \\mapsto \\alpha_A(\\text{id}_A)$. The Yoneda embedding $Y: \\mathcal{C} \\to [\\mathcal{C}^{\\text{op}}, Set]$ defined by $Y(A) = h^A$ is fully faithful, meaning $\\text{Hom}_\\mathcal{C}(A, B) \\cong \\text{Nat}(h^A, h^B)$, showing that $A \\cong B \\iff h^A \\cong h^B$.",
      history: "Discovered by Nobuo Yoneda in 1954 during a meeting with Saunders Mac Lane in Paris. It revolutionized algebraic geometry and algebraic topology by proving that objects can be fully replaced by their functorial representations, establishing relation as the primary building block of mathematical ontology.",
      exercises: "1. Prove the Yoneda Lemma: construct the bijection $\\Psi: \\text{Nat}(h^A, P) \\to P(A)$ and prove that it and its inverse are well-defined, mutual inverses, and natural in both $A$ and $P$.\n2. Prove that the Yoneda embedding $Y: \\mathcal{C} \\to [\\mathcal{C}^{\\text{op}}, Set]$ is fully faithful, and show how this implies that if $h^A \\cong h^B$, then $A \\cong B$."
    },
    ja: {
      narrative: "展示の最後を飾るのは、圏論において最も深遠な定理である「米田の補題」です。私たちの哲学において、要素の生成と関係式の商化を見てきました。米田の補題はこの考えを極限まで押し進めます。圏の中の対象は、それ自体の「中身」を持ちません。対象のすべての性質、構造、存在は、他のすべての対象との関係性（射）を観察することによってのみ完全に決定されます。関係性こそが存在そのものであり、内部の実体という概念は商化されて不要になります。",
      rigor: "局所的に小さな圏 $\\mathcal{C}$ とその対象 $A$ に対し、反変表現可能関手（プレシェフ） $h^A = \\text{Hom}_\\mathcal{C}(-, A): \\mathcal{C}^{\\text{op}} \\to Set$ を考える。任意のプレシェフ関手 $P: \\mathcal{C}^{\\text{op}} \\to Set$ に対し、米田の補題は自然同型 $\\text{Nat}(h^A, P) \\cong P(A)$ （写像は $\\alpha \\mapsto \\alpha_A(\\text{id}_A)$）を主張する。米田埋め込み $Y: \\mathcal{C} \\to [\\mathcal{C}^{\\text{op}}, Set]$ （$Y(A) = h^A$）は完全忠実（Fully Faithful）であり、これは $\\text{Hom}_\\mathcal{C}(A, B) \\cong \\text{Nat}(h^A, h^B)$ 、したがって $A \\cong B \\iff h^A \\cong h^B$ であることを意味する。",
      history: "1954年、米田信夫がパリの駅でソーンダース・マックレーンと出会った際に発見されました。対象を関手的な表現（関係性の総和）で完全に置き換えることができることを示し、代数幾何学や代数的位相幾何学に革命をもたらし、関係性を存在論の基礎に据えました。",
      exercises: "1. 米田の補題を証明せよ：全単射写像 $\\Psi: \\text{Nat}(h^A, P) \\to P(A)$ を構成し、それが矛盾なく定義され、逆写像を持ち、かつ $A$ と $P$ の両方に関して自然であることを示せ。\n2. 米田埋め込み $Y: \\mathcal{C} \\to [\\mathcal{C}^{\\text{op}}, Set]$ が完全忠実であることを証明し、これによって $h^A \\cong h^B$ ならば $A \\cong B$ となる（同型を除いて対象が一意に決定される）ことを証明せよ。"
    }
  },
  26: {
    id: 26,
    nameEn: "Concept I: Free Generation",
    nameJa: "概念I：自由生成（構文の構築）",
    thesisEn: "Constructing structures without constraints. Generating words, terms, and syntax tree sequences.",
    thesisJa: "制約のない構造の構築。単語、項、構文木シーケンスの生成。",
    en: {
      narrative: "Free generation is the cognitive mechanism of creation. It is the unconstrained expansion of possibilities. When we write down symbols, declare variables, or construct syntax trees without imposing any rules or equations, we are generating. It represents syntax, language potential, and absolute freedom. Every algebraic structure starts as a free structure generated by a raw set of symbols.",
      rigor: "Given a set of generators $X$ and a signature $\\Sigma$ of operations, the free algebra $F(X)$ is the term algebra of terms constructed from $X$ using operations in $\\Sigma$, quotiented by nothing. The free functor $F: Set \\to \\mathcal{C}$ is left adjoint to the forgetful functor $U: \\mathcal{C} \\to Set$. It satisfies the universal property: any map from $X$ to $U(A)$ extends uniquely to a homomorphism from $F(X)$ to $A$. Left adjoints, including the free functor, automatically preserve all colimits.",
      history: "The concept of free structures (free groups, free monoids, free vector spaces) emerged in the late 19th and early 20th centuries. It formalized the intuition of 'generating' a structure from scratch. In psychology, it corresponds to the human brain's capacity for combinatorial generation, creating infinite novel expressions from finite components.",
      exercises: "1. Provide a rigorous algebraic definition of the free group $F(\\{a, b\\})$ as the set of equivalence classes of words over $\\{a, b, a^{-1}, b^{-1}\\}$ modulo the elementary reduction relation. Write a concrete algebraic check showing that the word reduction process is confluent.\n2. Prove that any left adjoint functor preserves colimits (and thus coproducts) using the natural isomorphism of hom-sets."
    },
    ja: {
      narrative: "自由生成は、創造の認知的なメカニズムです。それは可能性の制約のない拡張を意味します。私たちが記号を書き、変数を宣言し、あるいは一切のルールや方程式を課さずに構文木を構築するとき、私たちは「生成」を行っています。それは構文、言語的ポテンシャル、および絶対的な自由を表します。あらゆる代数構造は、生の記号の集合から生成された自由構造としてその生を受けます。",
      rigor: "生成元の集合 $X$ と演算のシグネチャ $\\Sigma$ に対し、自由代数 $F(X)$ は $X$ から $\\Sigma$ の演算によって生成される項代数（term algebra）であり、いかなる関係式によっても割られていない。自由関手 $F: Set \\to \\mathcal{C}$ は忘却関手 $U: \\mathcal{C} \\to Set$ の左随伴である。これは普遍性「$X$ から $U(A)$ への任意の写像は、$F(X)$ から $A$ への準同型写像へ一意に拡張される」を満たす。自由関手を含む左随伴関手は、自動的にすべての余極限を保存する。",
      history: "自由構造（自由群、自由モノイド、自由ベクトル空間など）の概念は、19世紀末から20世紀初頭にかけて確立されました。構造を「何もないところから生成する」という直観を定式化したものです。心理学的には、有限の要素から無限の新しい表現を作り出す、脳の組合せ論的生成能力（生成文法など）に対応しています。",
      exercises: "1. アルファベット $\\{a, b, a^{-1}, b^{-1}\\}$ 上の記号列を基本簡約関係で割った同値類の集合として、自由群 $F(\\{a, b\\})$ の厳密な代数的定義を与えよ。記号列の簡約プロセスが合流的であることを示す具体的なチェック（あるいは合流性の証明）を記述せよ。\n2. 随伴の自然同型を用いて、任意の左随伴関手が余極限（したがって直和/余直積）を保存することを証明せよ。"
    }
  },
  27: {
    id: 27,
    nameEn: "Concept II: Mappings & Functions",
    nameJa: "概念II：写像と関数（対等と変換）",
    thesisEn: "Injection, Surjection, and Bijection. Defining correspondences and translations between sets.",
    thesisJa: "単射、全射、全単射。集合間の対応関係と構造の変換定義。",
    en: {
      narrative: "Before we can relate or collapse, we must connect. Mappings (functions) are the mathematical connections between sets. An injection maps distinct elements to distinct elements, preserving individuality. A surjection covers the entire target space, leaving no element behind. A bijection does both, establishing a perfect one-to-one correspondence. In our cognitive philosophy, mappings are the paths of translation, allowing the brain to match raw sensations to abstract concepts.",
      rigor: "A function $f: A \\to B$ is injective (monomorphism in $Set$) if $f(x)=f(y) \\implies x=y$. It is surjective (epimorphism in $Set$) if $\\forall y \\in B, \\exists x \\in A$ such that $f(x)=y$. It is bijective (isomorphism in $Set$) if it is both injective and surjective, meaning there exists an inverse function $f^{-1}: B \\to A$. Mappings are morphisms in the category $Set$.",
      history: "Formalized by Dirichlet and Cantor. Mappings shifted mathematics from static equations to dynamic transformations. Psychologically, human object recognition is a surjective mapping: the infinite variations of light and angle on a face are mapped (surjected) to a single identity in the brain.",
      exercises: "1. Prove that in any category $\\mathcal{C}$, the composition of two monomorphisms is a monomorphism.\n2. Prove that a morphism $f: A \\to B$ in $Set$ is an epimorphism if and only if it is surjective. Use a formal proof by contradiction using indicator maps or two-element test sets."
    },
    ja: {
      narrative: "関係づけたり崩壊させたりする前に、まず接続しなければなりません。写像（関数）は、集合と集合の間の数学的な接続通路です。「単射」は異なる要素を異なる要素に送り、個性を保存します。「全射」はターゲットとなる空間全体をくまなく覆い尽くします。「全単射」はその両方を満たし、完璧な一対一の対応を確立します。認知の観点では、写像は翻訳の経路であり、脳が生の感覚を抽象的な概念へと一致させることを可能にします。",
      rigor: "関数 $f: A \\to B$ が単射（$Set$におけるモノ射）であるとは、$f(x)=f(y) \\implies x=y$ が成り立つことである。全射（$Set$におけるエピ射）であるとは、任意の $y \\in B$ に対し $f(x)=y$ となる $x \\in A$ が存在することである。全単射（$Set$における同型射）であるとは、単射かつ全射であり、逆関数 $f^{-1}: B \\to A$ が存在することである。写像は圏 $Set$ における射（Morphism）である。",
      history: "ディリクレやカントールによって定式化されました。写像の概念は、数学を静的な方程式から動的な変換へとシフトさせました。心理学的には、人間の物体認識は全射写像です。光の当たり方や角度による顔の無限の変動（生成）が、脳内の単一のアイデンティティへと全射マッピング（商化）されるのです。",
      exercises: "1. 任意の圏 $\\mathcal{C}$ において、2つのモノ射の合成が再びモノ射になることを証明せよ。\n2. 集合の圏 $Set$ において、射 $f: A \\to B$ がエピ射であることと全射であることが同値であることを、指示関数（定義関数）または2つの要素からなるテスト集合を用いて背理法により証明せよ。"
    }
  },
  28: {
    id: 28,
    nameEn: "Concept III: Quotients & Grouping",
    nameJa: "概念III：商化と同値関係（意味論的縮退）",
    thesisEn: "Partitioning spaces under equivalence relations. Grouping raw terms into semantic concepts.",
    thesisJa: "同値関係の下での空間の分割。生の項を意味論的概念へグループ化（商化）する。",
    en: {
      narrative: "Quotienting is the cognitive organ of abstraction. It is the act of ignoring irrelevant differences to focus on shared essence. By defining an equivalence relation (declaring two different things equivalent based on a specific rule), we partition a set into mutually exclusive groups. Quotienting collapses syntax into semantics, proving that meaning is born when we choose what details to forget.",
      rigor: "An equivalence relation $\\sim$ on a set $X$ is reflexive ($x \\sim x$), symmetric ($x \\sim y \\implies y \\sim x$), and transitive ($x \\sim y \\land y \\sim z \\implies x \\sim z$). The equivalence class of $x$ is $[x] = \\{y \\in X \\mid y \\sim x\\}$. The quotient set $X/\\sim$ is the set of all equivalence classes. The canonical projection $\\pi: X \\to X/\\sim$ maps $x \\to [x]$, which is surjective. Topologically, the quotient space is equipped with the quotient topology, where $U \\subseteq X/\\sim$ is open if and only if $\\pi^{-1}(U)$ is open in $X$. The quotient $\\pi$ coequalizes the parallel projection maps $p_1, p_2: R \\rightrightarrows X$ of the relation set $R \\subseteq X \\times X$.",
      history: "Quotient structures were formalized in group theory and topology by Cauchy, Galois, and others. Anthropologically, human language is a quotienting machine: we group distinct physical objects (individual oak trees, pine trees) under the single equivalence class 'tree', allowing the brain to process information without cognitive overload.",
      exercises: "1. Let $X = \\mathbb{C}$ and define $z_1 \\sim z_2 \\iff |z_1| = |z_2|$. Sketch the proof that the quotient topological space $X/\\sim$ is homeomorphic to the half-line $[0, \\infty)$, and prove that the projection map $\\pi$ is continuous.\n2. Prove that the quotient set $X/\\sim$ satisfies the universal property of the coequalizer of the parallel pair of projection maps $p_1, p_2: R \\rightrightarrows X$ representing the equivalence relation relation $R = \\{(x, y) \\in X^2 \\mid x \\sim y\\}$."
    },
    ja: {
      narrative: "商化（Quotienting）は、抽象化を司る認知的な器官です。それは、重要でない違いを無視し、共通の本質に集中する行為です。同値関係を定義する（特定のルールに基づいて2つの異なるものを『同じ』とみなす）ことで、集合を互いに重ならないグループに分割します。商化は構文を意味論へと折りたたむ操作であり、どの詳細を「忘却する」かを選択したときに初めて意味が生まれることを示しています。",
      rigor: "集合 $X$ 上の同値関係 $\\sim$ は、反射律（$x \\sim x$）、対称律（$x \\sim y \\implies y \\sim x$）、および推移律（$x \\sim y \\land y \\sim z \\implies x \\sim z$）を満たす。要素 $x$ の同値類は $[x] = \\{y \\in X \\mid y \\sim x\\}$ である。商集合 $X/\\sim$ はすべての同値類の集合である。正準射影写像 $\\pi: X \\to X/\\sim$ は $x \\to [x]$ を割り当て、これは全射となる。トポロジー的には、商空間は商位相を備え、開集合 $U \\subseteq X/\\sim$ は $\\pi^{-1}(U)$ が $X$ で開集合であるものとして定義される。商写像 $\\pi$ は、同値関係のグラフ $R \\subseteq X \\times X$ からの射影の並行対 $p_1, p_2: R \\rightrightarrows X$ のコイコライザー（余等化子）である。",
      history: "コーシーやガロアらによって群論やトポロジーで定式化されました。人類学的には、人間の言語は商化マシンです。私たちは、無数の異なる物理的対象（一本一本のオークやマツの木）を「木」という単一の同値類へとグループ化し、脳が認知のオーバーロードを起こさずに情報を処理できるようにしています。",
      exercises: "1. $X = \\mathbb{C}$ とし、同値関係 $z_1 \\sim z_2 \\iff |z_1| = |z_2|$ を定義する。商位相空間 $X/\\sim$ が半直線 $[0, \\infty)$ と同相であることを証明し、射影写像 $\\pi$ が連続写像であることを示せ。\n2. 同値関係 $R = \\{(x, y) \\in X^2 \\mid x \\sim y\\}$ を表す射影の並行対 $p_1, p_2: R \\rightrightarrows X$ に対し、商集合 $X/\\sim$ がコイコライザーの普遍性を満たすことを証明せよ。"
    }
  },
  29: {
    id: 29,
    nameEn: "Concept IV: Categories & Functors",
    nameJa: "概念IV：圏と関手（構造的宇宙と架け橋）",
    thesisEn: "Structuring objects and morphisms. Mapping between structural universes while preserving operations.",
    thesisJa: "対象と射の構造化。構造演算を保存したまま、異なる構造的宇宙の間をマッピング（翻訳）する。",
    en: {
      narrative: "A category is a mathematical universe. It contains objects (elements or structures) and morphisms (arrows representing mappings or relationships between them). To connect different mathematical universes, we use functors. A functor maps objects of one category to objects of another, and morphisms to morphisms, while preserving the composition and identity of arrows. Functors are structural translators, showing that structure is defined by relationships.",
      rigor: "A category $\\mathcal{C}$ consists of a class of objects $\\text{Ob}(\\mathcal{C})$, hom-sets $\\text{Hom}_\\mathcal{C}(A, B)$ of morphisms, an identity morphism $\\text{id}_A \\in \\text{Hom}_\\mathcal{C}(A, A)$ for each object $A$, and a composition operation $\\circ: \\text{Hom}_\\mathcal{C}(B, C) \\times \\text{Hom}_\\mathcal{C}(A, B) \\to \\text{Hom}_\\mathcal{C}(A, C)$ which is associative: $h \\circ (g \\circ f) = (h \\circ g) \\circ f$ and satisfies unit laws $f \\circ \\text{id}_A = \\text{id}_B \\circ f = f$. A functor $F: \\mathcal{C} \\to \\mathcal{D}$ maps objects $C \\in \\mathcal{C} \\to F(C) \\in \\mathcal{D}$ and morphisms $f: A \\to B \\to F(f): F(A) \\to F(B)$ preserving identity $F(\\text{id}_A) = \\text{id}_{F(A)}$ and composition $F(g \\circ f) = F(g) \\circ F(f)$.",
      history: "Introduced by Samuel Eilenberg and Saunders Mac Lane in 1945 to formalize algebraic topology. Category Theory provides a universal language for all of mathematics, replacing concrete sets with abstract arrows and relationships, proving that structure is invariant under translation.",
      exercises: "1. Define the category $\\mathbf{B}G$ corresponding to a group $G$ (a category with a single object $*$ and morphisms corresponding to elements of $G$). Show that a functor $F: \\mathbf{B}G \\to Set$ is equivalent to a group action of $G$ on a set.\n2. Prove that the composition of two functors $F: \\mathcal{C} \\to \\mathcal{D}$ and $G: \\mathcal{D} \\to \\mathcal{E}$ is a well-defined functor, showing all associativity and identity preservation steps."
    },
    ja: {
      narrative: "圏（Category）とは、数学的な宇宙です。そこには「対象（対象物や構造）」と、それらの間の関係性・マッピングを表す「射（矢印）」が存在します。異なる数学的な宇宙同士を接続するために、私たちは「関手（Functor）」を使用します。関手は、ある圏の対象と射を別の圏の対象と射にマッピングし、矢印の合成や恒等射を完全に保存します。構造が関係性によって定義されることを示す、構造の翻訳機です。",
      rigor: "圏 $\\mathcal{C}$ は、対象のクラス $\\text{Ob}(\\mathcal{C})$、射の集合 $\\text{Hom}_\\mathcal{C}(A, B)$、各対象の恒等射 $\\text{id}_A \\in \\text{Hom}_\\mathcal{C}(A, A)$、および結合法則 $h \\circ (g \\circ f) = (h \\circ g) \\circ f$ と単位元法則 $f \\circ \\text{id}_A = \\text{id}_B \\circ f = f$ を満たす合成演算 $\\circ$ から構成される。関手 $F: \\mathcal{C} \\to \\mathcal{D}$ は、対象 $C \\to F(C)$ および射 $f: A \\to B \\to F(f): F(A) \\to F(B)$ をマッピングし、恒等射の保存 $F(\\text{id}_A) = \\text{id}_{F(A)}$ および合成の保存 $F(g \\circ f) = F(g) \\circ F(f)$ を満たす。",
      history: "1945年にサミュエル・アイレンバーグとソーンダース・マックレーンによって、代数的位相幾何学の定式化のために導入されました。圏論は、具体的な集合の代わりに抽象的な「矢印（関係性）」を基礎とすることで、全数学の共通言語を提供し、構造が翻訳において不変であることを示しました。",
      exercises: "1. 群 $G$ に対し、対象が単一の元 $*$ であり射が $G$ の元に対応する圏 $\\mathbf{B}G$ を定義せよ。このとき、関手 $F: \\mathbf{B}G \\to Set$ を与えることが、集合上への群 $G$ の作用（Group Action）を定義することと同値であることを示せ。\n2. 2つの関手 $F: \\mathcal{C} \\to \\mathcal{D}$ と $G: \\mathcal{D} \\to \\mathcal{E}$ の合成 $G \\circ F$ が再び関手となることを、結合則および恒等射の保存則をすべて検証することによって証明せよ。"
    }
  },
  30: {
    id: 30,
    nameEn: "Concept V: Adjunction & Duality",
    nameJa: "概念V：随伴と双対性（対称的均衡）",
    thesisEn: "$F \\dashv U$. The natural isomorphism between syntax (F) and semantics (U) mapping spaces.",
    thesisJa: "$F \\dashv U$。構文（F）と意味論（U）の写像空間の間に横たわる自然同型（対称的バランス）。",
    image: "/images/inca_quipu.jpg",
    imageAlt: "Quipu threads representing the balance of adjunction duality",
    en: {
      narrative: "An adjunction is the ultimate mathematical duality. It connects a free functor $F$ (which generates syntax) and a forgetful functor $U$ (which strips structure back to raw elements). The adjunction $F \\dashv U$ asserts a perfect, symmetric translation between mapping out of a free structure and mapping raw elements. It proves that the entire behavior of a complex, quotiented semantic system is completely determined by how we map its raw, unstructured generators, showing that syntax and semantics are two sides of the same coin.",
      rigor: "An adjunction between categories $\\mathcal{C}$ and $\\mathcal{D}$ consists of a pair of functors $F: \\mathcal{C} \\to \\mathcal{D}$ (left adjoint) and $U: \\mathcal{D} \\to \\mathcal{C}$ (right adjoint) and a natural isomorphism of hom-sets: \n  $$\\Phi_{X, Y}: \\text{Hom}_\\mathcal{D}(F(X), Y) \\cong \\text{Hom}_\\mathcal{C}(X, U(Y))$$\n  For every morphism $f: X \\to U(Y)$ in $\\mathcal{C}$, there is a unique morphism $\\bar{f}: F(X) \\to Y$ in $\\mathcal{D}$ such that $U(\\bar{f}) \\circ \\eta_X = f$, where $\\eta_X: X \\to U(F(X))$ is the component of the unit natural transformation $\\eta: \\text{Id}_\\mathcal{C} \\Rightarrow UF$ at $X$, given by $\\eta_X = \\Phi_{X, F(X)}(\\text{id}_{F(X)})$.",
      history: "Discovered by Daniel Kan in 1958. It stands as one of the most powerful organizing concepts in mathematics, demonstrating that syntax and semantics are not opposing forces, but rather dual projections of the same truth, establishing the mathematical foundations of representation and evaluation.",
      exercises: "1. Prove that the unit $\\eta_X$ is a natural transformation $\\text{Id}_\\mathcal{C} \\Rightarrow UF$.\n2. Show how to reconstruct the counit $\\varepsilon_Y: FU(Y) \\to Y$ using the natural isomorphism $\\Phi_{X, Y}$. Specifically, show that $\\varepsilon_Y = \\Phi^{-1}_{U(Y), Y}(\\text{id}_{U(Y)})$, and state the triangular identities that $\\eta$ and $\\varepsilon$ must satisfy."
    },
    ja: {
      narrative: "随伴（Adjunction）とは、数学における究極の双対性です。構文を自由生成する「自由関手 $F$」と、構造を取り去って生の要素に戻す「忘却関手 $U$」を接続します。随伴 $F \\dashv U$ は、「自由生成された構造からの写像」と「生の要素からの写像」の間の完璧な対称的翻訳を可能にします。これは、複雑に商化された意味体系の挙動が、生の生成元のマッピング方法だけで完全に決定されることを証明しており、構文と意味論が同一の真理の表裏であることを示しています。",
      rigor: "圏 $\\mathcal{C}$ と $\\mathcal{D}$ の間の随伴は、対となる関手 $F: \\mathcal{C} \\to \\mathcal{D}$ （左随伴）と $U: \\mathcal{D} \\to \\mathcal{C}$ （右随伴）、および次の射集合の間の自然同型から構成される：\n  $$\\Phi_{X, Y}: \\text{Hom}_\\mathcal{D}(F(X), Y) \\cong \\text{Hom}_\\mathcal{C}(X, U(Y))$$\n  $\\mathcal{C}$ における任意の射 $f: X \\to U(Y)$ に対して、$\\mathcal{D}$ における一意の射 $\\bar{f}: F(X) \\to Y$ が存在し、$U(\\bar{f}) \\circ \\eta_X = f$ を満たす。ここで $\\eta_X: X \\to U(F(X))$ は、単位自然変換 $\\eta: \\text{Id}_\\mathcal{C} \\Rightarrow UF$ の $X$ における成分であり、$\\eta_X = \\Phi_{X, F(X)}(\\text{id}_{F(X)})$ で与えられる。",
      history: "1958年にダニエル・カンによって発見されました。構文（F）と意味（U）が対立するものではなく、同一の真理の双対写像であることを証明する、数学において最も強力な統一概念の1つであり、表現と評価の数学的基礎を築きました。",
      exercises: "1. 単位元 $\\eta_X$ が自然変換 $\\text{Id}_\\mathcal{C} \\Rightarrow UF$ であることを証明せよ。\n2. 射集合の間の自然同型 $\\Phi_{X, Y}$ を用いて、余単位元（counit） $\\varepsilon_Y: FU(Y) \\to Y$ を再構成する方法を示せ。具体的には $\\varepsilon_Y = \\Phi^{-1}_{U(Y), Y}(\\text{id}_{U(Y)})$ となることを示し、$\\eta$ と $\\varepsilon$ が満たさなければならない三角恒等式を述べよ。"
    }
  }
};
