export interface PlacardContent {
  narrative: string;
  rigor: string;
  history: string;
  exercises: string;
}

export interface RoomData {
  id: number;
  nameEn: string;
  nameJa: string;
  thesisEn: string;
  thesisJa: string;
  image?: string;
  imageAlt?: string;
  en: PlacardContent;
  ja: PlacardContent;
}

export const roomsData: Record<number, RoomData> = {
  1: {
    id: 1,
    nameEn: "Hall I: The Ontological Cycle",
    nameJa: "第I室：存在論的サイクル",
    thesisEn: "Introduction to the dual cycle of Syntax (Generators) vs. Semantics (Relations).",
    thesisJa: "構文（生成元）と意味論（関係式）の双対的サイクルの導入。",
    en: {
      narrative: "Welcome to the Ontological Cycle. At its ultimate bedrock, mathematics is not the static study of numbers or shapes, but a dynamic, cyclical dialogue between two fundamental cognitive operations: Free Generation and Quotienting. The human mind first projects raw symbols, variables, and syntax trees into the void without constraint—a process of pure syntax creation (Free Generation). It then folds, identifies, and collapses these terms under equations (relations) to resolve their semantics, mapping them to real-world experience (Quotienting). Every mathematical structure is born of this simple cognitive loop, demonstrating how infinite structural potential is bound into functional meaning.",
      rigor: "In formal algebraic terms, this cycle is modeled as a presentation by Generators and Relations. Given a set of raw elements $X$ (generators), we construct a free algebra $F(X)$ containing all possible syntactic terms. We then define a set of relations $R \\subseteq F(X) \\times F(X)$ representing equations we wish to force. The quotient structure $F(X)/\\sim$ is the finest algebraic structure where these relations hold, formalized category-theoretically as a Coequalizer of the parallel pair representing the relations. The quotient map $\\pi: F(X) \\to F(X)/\\sim$ is the coequalizer morphism, collapsing the infinite free syntax into the minimal structure satisfying the relations.",
      history: "\"The limits of my language mean the limits of my world.\" — Ludwig Wittgenstein, *Tractatus Logico-Philosophicus*. This exhibition draws connections between Wittgenstein's logical syntax, Immanuel Kant's schemata of pure understanding—where the mind generates raw sensory syntax and quotients it under cognitive concepts—and F. William Lawvere's category-theoretic foundations of physics and logic, demonstrating that the foundations of logic and physics are built upon algebraic presentations and adjunctions.",
      exercises: "1. If syntax is represented as the set of all possible keystrokes on a typewriter, what mathematical tool represents the semantic execution of the written sentences?\n2. Prove that the quotient map $\\pi: F(X) \\to F(X)/\\sim$ satisfies the universal property of the coequalizer."
    },
    ja: {
      narrative: "存在論的サイクルへようこそ。数学はその最も深い存在論的土台において、静的な数や図形の学問ではなく、二つの根源的な認知操作、すなわち「自由生成（Free Generation）」と「商化（Quotienting）」の間の動的で周期的な対話です。人間はまず、一切の制約なしに生の記号や項、構文木を空間に投影します。これが純粋な構文の創造である「自由生成」です。次に、これらの項を方程式（関係式）のもとに折りたたみ、同一視し、崩壊させることで意味論を与え、現実の経験へとマッピングします。これが「商化」です。このループは構文と意味論の基本サイクルであり、いかにして無限の構造的ポテンシャルが機能的な意味へと束ねられるかを示しています。",
      rigor: "形式的には、このサイクルは「生成元と関係式（Generators and Relations）」による表示としてモデル化されます。生の要素の集合 $X$ から自由代数 $F(X)$ を生成し、同値関係 $\\sim$ を定める関係式 $R$ によって商構造 $F(X)/\\sim$ を構成します。これは圏論におけるコイコライザー（余等化子）の構成に対応します。商写像 $\\pi: F(X) \\to F(X)/\\sim$ は、関係式を満たす最小の代数構造へと無限の自由構文を折りたたむコイコライザー射として機能します。",
      history: "「私の言語の限界は、私の世界の限界を意味する」 — ルートヴィヒ・ウィトゲンシュタイン『論理哲学論考』。本展示は、ウィトゲンシュタインの論理的構文論、イマヌエル・カントの純粋悟性概念（脳が生の感覚的構文を生成し、悟性概念の下で商化する図式論）、そしてウィリアム・ローヴェアによる物理と論理の圏論的基礎づけを結びつけ、数学の基礎が代数的表示と随伴の上に築かれていることを示します。",
      exercises: "1. タイプライターの打鍵の集合を「構文」とするとき、書かれた文章の「意味」を数学的に表す操作は何ですか？\n2. 射影写像 $\\pi: F(X) \\to F(X)/\\sim$ がコイコライザーの普遍性を満たすことを証明しなさい。"
    }
  },
  2: {
    id: 2,
    nameEn: "Hall II: Notches & Cardinality (Lebombo Bone)",
    nameJa: "第II室：ノッチと基数（レボンボ骨）",
    thesisEn: "Free generation of tally marks vs. Quotienting by bijection equivalence classes to form Cardinal Numbers.",
    thesisJa: "刻み目（タリカウンター）の自由生成と、基数を形成するための全単射同値類による商化。",
    image: "/images/lebombo_bone.jpg",
    imageAlt: "Lebombo Bone notches with lunar alignments",
    en: {
      narrative: "A million years ago, our ancestors carved notches on the Lebombo bone. The act of cutting tally marks I, II, III freely is the free generation of syntax, representing absolute freedom and structural potential. But raw marks are useless without a contract. By grouping these notches into equivalent packets (establishing a bijection to a herd of sheep or cycles of the moon) and quotienting by the relation of equipotence, humanity discovered cardinality. The number '5' is not a physical object; it is the quotient class of all tally marks that can be put in one-to-one correspondence.",
      rigor: "Let $Set$ be the category of sets. The free generation step is the construction of finite ordinal sets. The quotienting step is the partition of the class of all sets under the equivalence relation of equipotence (bijection): $A \\sim B \\iff \\exists f: A \\to B$ which is bijective. The isomorphism class $[A]_\\sim$ defines the cardinal number. In category theory, cardinality is the quotient of the category of finite sets by the equivalence relation of isomorphism.",
      history: "The Lebombo Bone (c. 35,000 BCE), discovered in eSwatini, contains 29 distinct notches carved into a baboon's fibula. While each individual notch is a free generator (syntax), mapping the 29-notch sequence to the lunar cycle represents a quotient relation (semantics), folding raw notches into a functional base-29 calendar register. This represents one of humanity's earliest cognitive steps from free symbol generation to relational meaning.",
      exercises: "1. Explain how the Lebombo bone represents both free generation and quotienting.\n2. Show that equipotence ($\\sim$) is an equivalence relation on sets."
    },
    ja: {
      narrative: "数万年前、人類の祖先はレボンボ骨に刻み目を刻みました。ルールなしに刻み目 I, II, III を無数に刻む行為は、純粋な記号構文の「自由生成」であり、無限の表現可能性を意味します。しかし、ただの刻み目だけでは意味をなしません。刻み目を特定の束に対応させ、羊の群れや月の周期と「一対一の対応（写像）」を作り、対等（全単射の存在）という関係式で「商化」することで、人類は基数（カルディナリティ）を発見しました。数「5」とは物理的な実体ではなく、一対一対応するすべてのノッチの「商集合（同値類）」なのです。",
      rigor: "集合の圏 $Set$ において、自由生成ステップは有限順序数の構成です。商化ステップは、対等（全単射の存在）という同値関係 $A \\sim B \\iff \\exists f: A \\to B$ による集合全体のクラスの分割です。同値類 $[A]_\\sim$ が基数を定義します。圏論的には、基数とは有限集合の圏を同型写像という関係式で割った商構造です。",
      history: "エスワティニで発見されたレボンボ骨（紀元前約35,000年）には、ヒヒの腓骨に29個の個別の刻み目が刻まれています。個々の刻み目は単なる「自由生成（構文）」ですが、29個の刻み目を「月の満ち欠け（太陰周期）」にマッピングする行為は「商関係（意味論）」であり、生の刻み目をカレンダー登録という機能的な構造へと折りたたんでいます。これは人類最初の認知的な記号商化プロセスです。",
      exercises: "1. レボンボ骨がどのように「自由生成」と「商化」の両方を表現しているか説明しなさい。\n2. 集合間の対等関係（$\\sim$）が同値関係であることを示しなさい。"
    }
  },
  3: {
    id: 3,
    nameEn: "Hall III: Clay Tokens & Accounting (Ancient Sumeria)",
    nameJa: "第III室：粘土トークンと会計（古代シュメール）",
    thesisEn: "Free generation of clay tokens vs. Quotienting by contract agreements to define asset ownership.",
    thesisJa: "粘土トークンの自由生成と、資産所有権を定義するための契約合意による商化。",
    image: "/images/sumerian_tokens.jpg",
    imageAlt: "Sumerian clay tokens and clay bullae envelopes",
    en: {
      narrative: "In ancient Mesopotamia, trade required trust. Merchants created clay tokens shaped as spheres, cones, and cylinders to represent sheep, grain, or oil. Generating these physical tokens is free syntax. But tokens are easily counterfeited, stolen, or lost. To secure the contract, the Sumerians sealed the tokens inside hollow clay envelopes called 'bullae'. This sealed envelope established a physical quotient contract, locking raw elements into transaction equivalence. By stamping token shapes onto the outside of the bulla, humanity invented writing as a quotient projection.",
      rigor: "Let $T$ be the set of physical tokens. The free algebra $F(T)$ is the free commutative monoid representing bundles of tokens. A transaction contract defines a congruence relation $\\sim$ where two token bundles are equivalent if they satisfy the same exchange value or debt settlement: $A \\sim B \\iff A \\oplus D = B \\oplus D$ for debt clearing. The bulla physically enforces this quotient map $\\pi: F(T) \\to F(T)/\\sim$.",
      history: "Sumerian clay bullae (c. 8000–3000 BCE) represent the first physical quotient contract. By sealing tokens inside, merchants ensured that neither party could alter the tokens without breaking the seal. The markings pressed onto the outer surface of the bulla eventually evolved into cuneiform writing, showing how quotient contracts generated the first formal written syntax, proving that writing was born to record quotient relations.",
      exercises: "1. Why was a hollow clay envelope (bulla) required to mathematically quotient the clay tokens?\n2. Prove that if $\\sim$ is a congruence relation, the quotient space inherits a monoid structure."
    },
    ja: {
      narrative: "古代メソポタミアにおいて、交易には信頼が必要でした。商人は羊や穀物、油を表すために球体や円錐、円柱の形をした粘土のトークンを作りました。これらの物理的トークンを作る行為は「自由構文（自由生成）」です。しかし、トークンは偽造されたり紛失したりしやすいものでした。取引を保証するために、シュメール人は「ブッラ（Bullae）」と呼ばれる中空の粘土の封筒にトークンを封入しました。この封筒こそが最初の物理的「商契約」であり、生の要素を取引同値性へとロックしたのです。さらに、ブッラの表面に中のトークンの形を押し付けることで、人類は「文字」という商化された投影を発明しました。",
      rigor: "トークンの集合を $T$ とします。自由代数 $F(T)$ はトークンの束を表す自由可換モノイドです。取引契約は合同関係 $\\sim$ を定義し、同一の交換価値や債務決済を満たすトークンの束を同値と見なします。ブッラはこの商写像 $\\pi: F(T) \\to F(T)/\\sim$ を物理的に強制するデバイスです。",
      history: "シュメールの粘土製ブッラ（紀元前8000年〜3000年頃）は、人類最初の物理的な商化契約です。トークンを内部に密封することで、商人は封印を破ることなくトークンを変更できないようにしました。ブッラの外側にトークンを押し付けてつけたマークが、後の楔形文字へと進化し、商契約がいかにして文字構文を生み出したかを示しています。文字は商関係を記録するために誕生したのです。",
      exercises: "1. 粘土トークンを数学的に商化するために、なぜ中空の粘土の封筒（ブッラ）が必要だったのですか？\n2. 同値関係 $\\sim$ が合同関係であるとき、商空間がモノイド構造を継承することを示しなさい。"
    }
  },
  4: {
    id: 4,
    nameEn: "Hall IV: Knotted Cord Paths (Inca Quipus)",
    nameJa: "第IV室：結縄（キープ）の経路（インカ帝国）",
    thesisEn: "Free loops of string vs. Quotienting by positional base-10 slots to store decimal values.",
    thesisJa: "紐（ストリング）の自由ループと、10進数値を格納するための位置的な10進法スロットによる商化。",
    image: "/images/inca_quipu.jpg",
    imageAlt: "Inca Quipu cords showing positional knots",
    en: {
      narrative: "Without a written alphabet, the Inca Empire managed vast agricultural registries and populations using the Quipu—a system of knotted cords. A main horizontal string holds dozens of hanging pendant cords. While a cord can support any number of knots in arbitrary arrangements (free loops of string), the Inca quotiented this free space by dividing each cord into strict positional tiers: units, tens, hundreds, and thousands. Position quotiented free loops into a base-10 relational register, proving that complex mathematics does not require paper or written symbols.",
      rigor: "Let $C$ be the space of all possible knot configurations on a cord. We define a quotient mapping $\\pi: C \\to \\mathbb{N}$ by dividing the cord length into intervals $L_k$ corresponding to powers of ten $10^k$. The knots within each interval $L_k$ are evaluated as a digit $d_k \\in \\{0..9\\}$ depending on knot type (single, long, figure-eight). The final decimal number is the quotient representation $\\sum d_k 10^k$. This divides the infinite geometric freedom of cord knotting into discrete decimal registers.",
      history: "Inca Quipus (c. 1400–1532 CE) served as the primary administrative and mathematical register of the Tawantinsuyu empire. Knotted string loops were freely generated and then quotiented by decimal position to store census, crop, and military data, proving that the human brain naturalized quotient spacing as a primary data structure before digital memory existed.",
      exercises: "1. How does a positional system (like decimal slots) mathematically function as a quotient relation?\n2. Show that mapping a set of cords to numbers is a surjective quotient map."
    },
    ja: {
      narrative: "文字を持たなかったインカ帝国は、結縄（キープ）と呼ばれる結び目のついたコードのシステムを使って、広大な農地や人口のデータを管理していました。主要な太い紐から、色とりどりの細い紐が数十本も垂れ下がっています。紐には任意の数や配置で自由に結び目（自由ループ）を作ることができますが、インカ人は各紐を「一、十、百、千」という厳格な「位置スロット」に分割することで商化しました。位置関係が自由な結び目を十進法の関係レジスタへと変えたのです。高度な数学に紙や記号が必須ではないことを証明しています。",
      rigor: "紐の上のすべての結び目構成の空間を $C$ とします。紐の長さを10のべき乗 $10^k$ に対応する区間 $L_k$ に分割し、商写像 $\\pi: C \\to \\mathbb{N}$ を定義します。各区間の結び目の数と種類（一重、ロング、8の字）から数字 $d_k \\in \\{0..9\\}$ を判定し、数値 $\\sum d_k 10^k$ として商化します。これにより、紐の幾何学的な自由度が離散的な十進レジスタへと折りたたまれます。",
      history: "インカのキープ（西暦1400年〜1532年頃）は、タワンティンスーユ（インカ帝国）の主要な行政・数学レジスタでした。自由に結ばれた紐のループが、十進法の位置による商化契約によって人口調査、収穫量、軍事データを記録する手段となり、人類がデジタルメモリ以前に位置的商化を自然なデータ構造として用いていたことを物語っています。",
      exercises: "1. 位置表記法（十進法スロットなど）が、どのように数学的に「商関係」として機能するか説明しなさい。\n2. 紐の集合から数値へのマッピングが全射的な商写像であることを示しなさい。"
    }
  },
  5: {
    id: 5,
    nameEn: "Hall V: Language Alphabet & Synonymy",
    nameJa: "第V室：言語の文字と同義性（フレーゲの意義と意味）",
    thesisEn: "Free monoid of string characters vs. Quotienting by synonymy equivalence classes to extract meaning.",
    thesisJa: "アルファベット文字列の自由モノイドと、意味を抽出するための同義語同値類による商化。",
    en: {
      narrative: "With the alphabet, humanity unlocked infinite expression. Arranging letters freely to generate strings of text is the free generation of syntax. But stringing symbols together does not automatically create communication. Language requires a semantic quotient. When we group different strings under equivalence classes of synonyms or definitions (e.g., 'automobile' \\equiv 'car'), we partition the free syntactic monoid into semantic meaning, showing how language uses synonymy to collapse syntax into conceptual clarity.",
      rigor: "Let $\\Sigma$ be a finite alphabet. The free monoid $\\Sigma^*$ consists of all finite strings under concatenation. A grammar or semantic schema defines a congruence relation $\\sim$ on $\\Sigma^*$ where $u \\sim v$ if they represent the same meaning or semantic evaluation. The quotient monoid $\\Sigma^*/\\sim$ represents the semantic algebra of the language, where each equivalence class is a concept.",
      history: "This matches Gottlob Frege's distinction between *Sinn* (Sense/Syntax) and *Bedeutung* (Reference/Meaning) in his 1892 paper *Über Sinn und Bedeutung*. Frege argued that language freely generates infinite senses, but we quotient them by their real-world references to evaluate truth values, a foundational insight for analytical philosophy and compiler design.",
      exercises: "1. If two distinct program code strings compile to the exact same binary output, are they equivalent in the syntactic free monoid or the semantic quotient?\n2. Show that if $\\sim$ is a congruence relation on a monoid $M$, then the quotient $M/\\sim$ inherits the monoid structure."
    },
    ja: {
      narrative: "文字と言葉を手に入れることで、人類は無限の表現力を獲得しました。アルファベットを自由に並べて文字列を生成する行為は、構文の「自由生成」です。しかし、文字列をただ並べるだけではコミュニケーションは生まれません。言語には意味論的な「商化」が必要です。異なる文字列を「同義語（シンタックスが違ってもセマンティクスが同じ）」として同じグループ（例：'自動車' ≡ '車'）に分類するとき、私たちは自由な文字列のモノイドを意味の世界へと商化しているのです。",
      rigor: "有限アルファベット $\\Sigma$ に対し、すべての文字列からなる自由モノイドを $\\Sigma^*$ とします（結合演算は文字列の結合）。文法や意味論は $\\Sigma^*$ 上の合同関係（Congruence Relation） $\\sim$ を定義し、同一の意味を表す文字列同士を結びつけます。商モノイド $\\Sigma^*/\\sim$ が、言語の意味代数を表し、各同値類が概念に対応します。",
      history: "これはゴットロープ・フレーゲの1892年の論文『意義と意味について』における「意義（Sinn/構文）」と「意味（Bedeutung/意味論）」の区部に一致します。フレーゲは、言語が無限の意義を自由生成し、それを現実の指示対象（リファレンス）によって商化することで真理値を評価すると主張しました。",
      exercises: "1. 異なる2つのプログラムコードが全く同じバイナリを出力するとき、それらは「自由モノイド」と「商モノイド」のどちらにおいて同値ですか？\n2. モノイド $M$ 上の合同関係 $\\sim$ に対し、商集合 $M/\\sim$ がモノイドの構造を継承することを示しなさい。"
    }
  },
  6: {
    id: 6,
    nameEn: "Hall VI: Deductive Reason & Classical Logic",
    nameJa: "第VI室：演繹的推論と古典論理（リンデンバウム・タルスキ）",
    thesisEn: "Free tree algebra of logic formulas vs. Quotienting by provable equivalence to form Heyting/Boolean algebras.",
    thesisJa: "論理式の自由木代数と、ヘイティング/ブール代数を形成するための証明可能な同値性による商化。",
    en: {
      narrative: "In logic, we build deductions. We generate sentences using atomic propositions and operators like AND, OR, NOT. This creates an infinite, free tree structure of syntactically valid propositions. However, many different sentences express the same logical truth. To build a mathematical algebra of logic, we must quotient these syntax trees by provable logical equivalence. Through this collapse, logic is transformed from raw syntax trees into algebraic lattices where we calculate truth.",
      rigor: "Let $F(X)$ be the free algebra generated by a set of propositions $X$ under logical connectors. We define the relation $\\phi \\sim \\psi \\iff \\vdash \\phi \\leftrightarrow \\psi$ (they are mutually provable). The quotient algebra $F(X)/\\sim$ is the Lindenbaum-Tarski algebra. For classical propositional logic, this quotient is a Boolean algebra; for intuitionistic logic, it is a Heyting algebra.",
      history: "Developed by Alfred Tarski and Adolf Lindenbaum in the 1930s, this quotient proved that logical deduction is equivalent to algebraic calculation in the quotient space. It represents the ultimate synthesis of syntactic proof and semantic truth, showing that reasoning is the quotient collapse of syntax.",
      exercises: "1. Show that logical equivalence ($\\sim$) is a congruence relation with respect to the conjunction operator ($\\land$).\n2. Explain why the Lindenbaum-Tarski algebra of a consistent theory has more than one equivalence class."
    },
    ja: {
      narrative: "論理学において、私たちは推論を組み立てます。命題変数と「かつ」「または」「ならば」といった論理演算子を使って論理式を組み立てる行為は、論理構文の「自由生成」であり、無限の論理式の木構造を生成します。しかし、一見異なる論理式でも、全く同じ論理的帰結を表すものが無数にあります。論理の代数学を構築するためには、これらの論理式を「証明可能な論理的同値性」によって商化し、折りたたまなければなりません。この崩壊によって、論理は代数的な構造へと変貌するのです。",
      rigor: "命題の集合 $X$ から論理演算によって生成される自由代数を $F(X)$ とします。関係式 $\\phi \\sim \\psi \\iff \\vdash \\phi \\leftrightarrow \\psi$ （互いに証明可能）を定義します。商代数 $F(X)/\\sim$ はリンデンバウム・タルスキ代数（Lindenbaum-Tarski algebra）と呼ばれ、古典論理ではブール代数を、直観主義論理ではヘイティング代数を構成します。",
      history: "1930年代にアルフレト・タルスキとアドルフ・リンデンバウムによって開発されたこの構成は、論理的な演繹が商空間における代数的な計算と同値であることを証明しました。構文的な「証明」と意味論的な「真理」を完璧に融合した金字塔です。",
      exercises: "1. 論理的同値関係（$\\sim$）が、論理積（$\\land$）に関して合同関係であることを示しなさい。\n2. 矛盾のない理論のリンデンバウム・タルスキ代数が、2つ以上の同値類を持つ理由を説明しなさい。"
    }
  },
  7: {
    id: 7,
    nameEn: "Hall VII: Textile Weaving & Patterns",
    nameJa: "第VII室：織物とパターン",
    thesisEn: "Free generation of warp and weft threads vs. Quotienting by weave intersection patterns to form fabric.",
    thesisJa: "経糸と緯糸の自由生成と、織布を形成するための交差パターンによる商化。",
    image: "/images/weaving_grid.jpg",
    imageAlt: "Weaving grid intersections showing thread quotients",
    en: {
      narrative: "Long before modern computers or algebra, textile weavers practiced topological gluing. A loom holds vertical warp threads and horizontal weft threads, which are initially independent (freely generated lines). But by interlacing them under a specific pattern (over-under-over), we force the threads to bind at grid intersections, quotienting independent threads into a single, continuous sheet of fabric. This shows how structural gluing quotients discrete dimensions into continuous manifolds.",
      rigor: "Let $X = \\bigsqcup_{i} I_i$ and $Y = \\bigsqcup_{j} J_j$ be disjoint unions of intervals representing warp and weft threads in $\\mathbb{R}^3$. The weaving grid is a quotient map $\\pi: X \\sqcup Y \\to M$ where overlapping coordinates $(x_i, y_j)$ are identified according to the weaving matrix $W_{ij} \\in \\{0, 1\\}$ (where 1 indicates warp over weft, and 0 indicates weft over warp), defining the topological manifold of the fabric sheet.",
      history: "Textile weaving is the oldest technology of continuous quotients. The punch-card system of the Jacquard Loom (1804) directly inspired Charles Babbage's Analytical Engine and Herman Hollerith's tabulating machines, proving that continuous topological quotients laid the path for binary computation and binary software.",
      exercises: "1. Explain how a plain weave (alternating over-under) functions as a periodic topological relation.\n2. Prove that the resulting fabric sheet has the topology of a bounded 2D manifold."
    },
    ja: {
      narrative: "現代のコンピュータや代数学が登場するはるか昔、織物職人たちはトポロジー的な接着を実践していました。織機には垂直な「経糸（たていと）」と水平な「緯糸（よこいと）」が張られており、最初は別々に存在しています（自由生成された直線）。しかし、これらを特定のパターン（上・下・上）で交互に交差させることで、格子状の交点で糸同士を結びつけ、独立した糸を1枚の連続した「布（ファブリック）」へと商化します。これは、離散的な次元が接着によって連続的な多様体へと商化されるプロセスです。",
      rigor: "経糸と緯糸を表す独立した線束の集合を $X, Y \\subset \\mathbb{R}^3$ とします。織り行列 $W_{ij} \\in \\{0, 1\\}$ （経糸が上か緯糸が上かを示す）に従い、交点を同一視する商写像 $\\pi: X \\sqcup Y \\to M$ によって、布の境界付き2次元多様体 $M$ が定義されます。",
      history: "織物は、連続的な商構造を作る人類最古の技術です。ジャカード織機（1804年）のパンチカードシステムは、チャールズ・バベッジの解析機関やホレリスの集計機に直接的なインスピレーションを与え、連続的なトポロジーの商化がデジタル計算への道を切り拓いたことを示しています。",
      exercises: "1. 平織り（交互の上・下）が、どのように周期的なトポロジーの関係式として機能するか説明しなさい。\n2. 織られた布のシートが、境界を持つ2次元多様体のトポロジーを持つことを証明しなさい。"
    }
  },
  8: {
    id: 8,
    nameEn: "Hall VIII: Origami Crease Patterns",
    nameJa: "第VIII室：折り紙の折れ線パターン",
    thesisEn: "Free flat paper surface vs. Quotienting by crease pattern fold-identifications to form 3D origami structures.",
    thesisJa: "平らな紙の自由表面と、3D折り紙構造を形成するための折れ線パターンによる商化。",
    en: {
      narrative: "Origami transforms flat paper into complex 3D shapes. We start with a flat sheet of paper, which has a simple 2D Euclidean topology (free space). By introducing a crease pattern (valleys and mountains) and folding along these lines, we identify separate points and segments of the paper, quotienting the flat space into a structured 3D object without stretching, tearing, or changing the local metric properties of the paper. This represents spatial quotienting through folding.",
      rigor: "Let $P = [0,1]^2$ be the flat unit square in $\\mathbb{R}^2$ with Euclidean metric. A crease pattern is a graph $G$ on $P$. A fold map is a signature $f: P \\to \\mathbb{R}^3$ that maps regions of the paper to 3D space, preserving geodesic distances along paths on the paper. The quotient relation is $x \\sim y \\iff f(x) = f(y)$ where paper segments touch or overlap in 3D, defining the folded shape $P/\\sim$.",
      history: "Folded geometry is found across nature, from leaf buds to insect wings. Modern origami mathematics, formalized by Toshikazu Kawasaki and Koryo Miura (the Miura fold), is used in space engineering to fold solar panels, and in biology to model how proteins fold, proving that flat syntactic sheets fold into complex semantic 3D functions.",
      exercises: "1. Why does folding paper without cutting or stretching preserve the metric properties of the paper?\n2. Show that a folded origami crane is a quotient space of the flat square."
    },
    ja: {
      narrative: "折り紙は平らな紙を複雑な3D形状へと変容させます。平らな正方形の紙は、シンプルな2次元ユークリッド空間（自由な空間）です。そこに折り目（山折りと谷折り）を刻み、線に沿って折ることで、紙の異なる点や辺同士を重ね合わせ、切ったり伸ばしたりすることなく、平らな空間を構造化された3Dオブジェクトへと商化します。これは折り畳みによる空間の商化を表現しています。",
      rigor: "単位正方形 $P = [0,1]^2$ を平らな紙とします。折り線パターンをグラフ $G$ とし、紙の領域を3D空間にマッピングする区分的等長写像 $f: P \\to \\mathbb{R}^3$ を定義します。紙の異なる部分が重なり合う関係式 $x \\sim y \\iff f(x) = f(y)$ による商空間として、折り紙の構造 $P/\\sim$ が定式化されます。",
      history: "折られた幾何学は、植物の木の葉の芽から昆虫の羽の収納まで、自然界の至る所に見られます。川崎敏和や三浦公亮（ミウラ折り）らによって定式化された現代の折り紙数学は、宇宙工学における太陽電池パネルの展開や、バイオロジーにおけるタンパク質の折り畳みモデルに応用されています。平坦な構文シートが、折り畳みによって複雑な3次元意味論的機能へと昇華することを示しています。",
      exercises: "1. 切ったり伸ばしたりせずに紙を折る行為が、なぜ紙の計量的性質（距離など）を保存するのか説明しなさい。\n2. 折られた折り鶴が、元の正方形の商空間であることを示しなさい。"
    }
  },
  9: {
    id: 9,
    nameEn: "Hall IX: Quotient Topology (The Torus)",
    nameJa: "第IX室：商位相（トーラス境界接着）",
    thesisEn: "Free 2D coordinate square $[0,1]^2$ vs. Quotienting boundaries ($x \\sim x+1$, $y \\sim y+1$) to glue opposite edges and form a torus.",
    thesisJa: "自由な2次元座標正方形と、対向する辺を接着してトーラスを形成するための境界同値関係による商化。",
    en: {
      narrative: "In geometry, we transition from discrete dots to continuous space. We begin with a flat 2D sheet containing infinite points (free generation). By identifying its boundary points—gluing the top edge to the bottom edge, and then the left edge to the right edge—we fold the sheet into a cylinder, and ultimately a torus (quotienting). Shape is the semantic result of quotienting continuous coordinates, proving that space is structured by identifying boundaries.",
      rigor: "Let $X = [0,1] \\times [0,1]$ be the unit square in $\\mathbb{R}^2$ (equipped with the subspace topology). We define the equivalence relation $\\sim$ on $X$ by: $(x, 0) \\sim (x, 1)$ for all $x \\in [0,1]$, and $(0, y) \\sim (1, y)$ for all $y \\in [0,1]$. The quotient space $X/\\sim$ equipped with the quotient topology is homeomorphic to the 2-torus $\\mathbb{T}^2 = S^1 \\times S^1$, where open sets in the quotient are sets whose preimages are open in $X$.",
      history: "Glued spaces appear historically in human weaving, basketry, and origami. In modern physics, general relativity and cosmic topology model the universe itself as a quotient space—where the syntax of flat spacetime is bent, glued, and curved by the distribution of mass-energy, converting coordinate syntax into physical shape.",
      exercises: "1. If we identify opposite edges of a square but reverse the orientation of one glue line, what non-orientable quotient manifold is generated?\n2. Prove that the quotient map from the square to the torus is continuous under the quotient topology."
    },
    ja: {
      narrative: "幾何学において、私たちは離散的な点から連続的な空間へと移行します。まず、無限の点を含む平らな2次元の正方形シートを用意します（自由生成）。そのシートの境界点同士を接着（上部と下部、次に左側と右側を同一視）することにより、円柱、そして最終的にはトーラス（ドーナツ型）へと折りたたみます（商化）。幾何学的な「図形」とは、連続的な座標を商化することによって生まれる意味論的結果なのです。",
      rigor: "単位正方形 $X = [0,1] \\times [0,1] \\subset \\mathbb{R}^2$ に対し、同値関係 $(x, 0) \\sim (x, 1)$ および $(0, y) \\sim (1, y)$ を定義します。この同値関係から得られる商位相空間 $X/\\sim$ は、2次元トーラス $\\mathbb{T}^2 = S^1 \\times S^1$ と同相（Homeomorphic）になります。商空間における開集合は、その引き戻し（原像）が $X$ で開集合となるものです。",
      history: "接着された空間は、歴史的に機織り、籠編み、および折り紙などの技術に現れます。現代の一般相対性理論や宇宙トポロジーは、宇宙そのものを商空間としてモデル化します。質量分布という関係式によって、平坦な時空座標の構文が曲げられ、接着され、物理的な「形」へと変換されているのです。",
      exercises: "1. 正方形の対向する辺を、片方の向きを反転させて接着したときに生成される向き付け不可能な商多様体は何ですか？\n2. 正方形からトーラスへの商写像が、商位相の定義のもとで連続写像であることを証明しなさい。"
    }
  },
  10: {
    id: 10,
    nameEn: "Hall X: Projective Geometry",
    nameJa: "第X室：射影幾何学（実射影平面）",
    thesisEn: "Free points on a sphere $S^n$ vs. Quotienting by antipodal identification ($x \\sim -x$) to create the projective plane $\\mathbb{RP}^n$.",
    thesisJa: "球面上の自由点と、実射影平面を生成するための対蹠点同一視（$x \\sim -x$）による商化。",
    en: {
      narrative: "Projective geometry is the geometry of sight and perspective. Consider a sphere in 3D space, representing all possible directions of rays of light. If we declare that opposite points (antipodal points) are mathematically identical, we project the sphere into a new non-orientable topological space: the Real Projective Plane. By quotienting out the direction of lines through the origin, we construct the foundation of perspective, showing that human vision naturally quotients depth to construct flat image semantics.",
      rigor: "Let $S^n = \\{x \\in \\mathbb{R}^{n+1} \\mid \\|x\\| = 1\\}$ be the $n$-sphere. We define the equivalence relation $\\sim$ by $x \\sim y \\iff x = y$ or $x = -y$ (antipodal identification). The quotient space $\\mathbb{RP}^n = S^n / \\sim$ is the real projective space. Geometrically, it is the space of all lines passing through the origin in $\\mathbb{R}^{n+1}$, quotienting out scale factor: $[x] = \\{\\lambda x \\mid \\lambda \\in \\mathbb{R} \\setminus \\{0\\}\\}$.",
      history: "Born in the Renaissance when artists like Filippo Brunelleschi and Leon Battista Alberti formalized perspective drawing. Projective space proved that parallel lines 'meet' at infinity by quotienting out Euclidean parallel constraints, showing how the constraints of perspective generate a new coordinate syntax.",
      exercises: "1. Why is the Möbius strip a subspace of the real projective plane $\\mathbb{RP}^2$?\n2. Prove that the antipodal quotient map $q: S^n \\to \\mathbb{RP}^n$ is a two-to-one local diffeomorphism."
    },
    ja: {
      narrative: "射影幾何学は、遠近法と視野の幾何学です。すべての光線の方向を表す3次元空間の球面を考えます。球面上にある、互いに正反対の位置にある点（対蹠点）同士を「完全に同じ点」として接着すると、実射影平面という新しいトポロジー空間が生まれます。原点を通る直線の方向性を「商化」して抽出することで、射影幾何学の基礎が構築されます。これは人間の視覚システムが奥行きを商化し、平坦な画像のセマンティクスを構築する仕組みそのものです。",
      rigor: "$n$次元球面 $S^n \\subset \\mathbb{R}^{n+1}$ に対し、同値関係 $x \\sim y \\iff x = y$ または $x = -y$ を定義します。商空間 $\\mathbb{RP}^n = S^n / \\sim$ が実射影空間であり、これは $\\mathbb{R}^{n+1}$ の原点を通るすべての直線からなる空間と同値です（スケール因子の商化：$[x] = \\{\\lambda x \\mid \\lambda \\in \\mathbb{R} \\setminus \\{0\\}\\}$）。",
      history: "ルネサンス期にフィリッポ・ブルネレスキやレオン・バティスタ・アルベルティが透視図法を定式化したことに始まります。射影空間は、並行な直線が無限遠点で交わることを示し、ユークリッドの平行線公理の制約を商化によって乗り越え、透視投影の制約が新しい座標構文を生み出すことを示しました。",
      exercises: "1. メビウスの帯がなぜ実射影平面 $\\mathbb{RP}^2$ の部分空間となるのか説明しなさい。\n2. 対蹠点商写像 $q: S^n \\to \\mathbb{RP}^n$ が2対1の局所微分同相写像であることを示しなさい。"
    }
  },
  11: {
    id: 11,
    nameEn: "Hall XI: Path Homotopy & Fundamental Groups",
    nameJa: "第XI室：経路ホモトピー（基本群）",
    thesisEn: "Free space of all continuous loops vs. Quotienting by continuous deformation (homotopy equivalence) to form fundamental groups $\\pi_1(X)$.",
    thesisJa: "すべての連続ループの自由空間と、基本群を形成するための連続変形（ホモトピー同値）による商化。",
    en: {
      narrative: "How do we measure holes in spaces? We draw loops. On a space, we can trace infinitely many different closed loops starting and ending at a basepoint (free loop generation). If we quotient these loops by continuous deformation (declaring two loops equivalent if they can be warped into each other without crossing a hole), we obtain a discrete group that measures the space's topology: the Fundamental Group. This quotients continuous infinity into discrete algebraic invariants.",
      rigor: "Let $X$ be a topological space and $x_0 \\in X$ a basepoint. Let $\\Omega(X, x_0)$ be the set of continuous loops $\\gamma: [0,1] \\to X$ with $\\gamma(0)=\\gamma(1)=x_0$. We define $\\gamma_0 \\sim \\gamma_1$ if there exists a continuous homotopy $H: [0,1]\\times[0,1] \\to X$ between them keeping endpoints fixed. The quotient set $\\pi_1(X, x_0) = \\Omega(X, x_0)/\\sim$ under path concatenation forms the Fundamental Group.",
      history: "Henri Poincaré introduced path homotopy in his groundbreaking paper *Analysis Situs* (1895), creating algebraic topology. It showed that we can understand continuous shapes through discrete algebraic quotient structures, converting continuous paths into discrete numbers of holes (like the winding number).",
      exercises: "1. Why is the fundamental group of a simple disk trivial (consisting of only one element)?\n2. Show that path concatenation is compatible with homotopy equivalence, making group multiplication well-defined."
    },
    ja: {
      narrative: "空間に開いた「穴」をどうやって測定するでしょうか？私たちはループを描きます。ある空間の上で、基準点から出発して戻ってくるループは無限に描くことができます。これはループの「自由生成」です。これらのループを「連続的な変形（穴をまたぐことなく一方を他方に変形できるなら同値）」によって商化すると、空間の穴をカウントする離散的な群「基本群」が得られます。これにより、連続的な無限大が離散的な代数的不変量へと商化されます。",
      rigor: "位相空間 $X$ と基準点 $x_0 \\in X$ に対し、連続ループ全体の集合を $\\Omega(X, x_0)$ とします。端点を固定した連続変形ホモトピーの存在による同値関係 $\\gamma_0 \\sim \\gamma_1$ を定義します。商集合 $\\pi_1(X, x_0) = \\Omega(X, x_0)/\\sim$ は、パスの結合演算に関して基本群（Fundamental Group）を構成します。",
      history: "アンリ・ポアンカレが1895年の記念碑的論文『位置の解析（Analysis Situs）』で導入し、代数的位相幾何学を創始しました。連続的な幾何学図形を、離散的な代数の商構造によって記述できることを示し、連続的な経路を巻き数などの離散的な整数（商）へと変換する道を開きました。",
      exercises: "1. なぜ円板の基本群は自明（元が1つだけ）なのですか？\n2. パスの結合演算がホモトピー同値関係と両立し、群の乗法が矛盾なく定義できることを示しなさい。"
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
      rigor: "Spacetime is modeled as a smooth 4D Lorentzian manifold $M$. The metric tensor $g_{\\mu\\nu}$ is determined dynamically by the Einstein Field Equations: $R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$. The physical space of solutions quotients the space of metric tensors by the action of the diffeomorphism group $\\text{Diff}(M)$ representing coordinate invariance: $g \\sim \\phi^* g$ for $\\phi \\in \\text{Diff}(M)$.",
      history: "Albert Einstein presented General Relativity in 1915. It unified space, time, and gravity, proving that gravity is not an attractive force, but the natural curved geodesic path in a quotiented, coordinate-free spacetime manifold, showing that coordinate systems are gauge syntax that must be quotiented out.",
      exercises: "1. Explain the phrase: 'Matter tells spacetime how to curve; spacetime tells matter how to move' in terms of generators and relations.\n2. Why are coordinate systems in general relativity regarded as gauge syntax that must be quotiented out by diffeomorphism?"
    },
    ja: {
      narrative: "アインシュタインは幾何学によって重力に革命を起こしました。特殊相対論は、平坦で硬いミンコフスキー時空座標を定義します。しかし一般相対論は、物質とエネルギーの存在がこの座標グリッドを歪めると主張します。座標系は単なるラベル（構文）であり、物理的な宇宙は、微分同相写像同値の下で座標空間を商化することで形成されます。物理的現実は座標に依存しないのです。",
      rigor: "時空は4次元の滑らかなローレンツ多様体 $M$ としてモデル化されます。計量テンソル $g_{\\mu\\nu}$ はアインシュタイン方程式 $R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$ によって決定されます。物理的な解の空間は、座標変換不変性を表す微分同相写像群 $\\text{Diff}(M)$ の作用によって、計量テンソルの空間を商化したものです：$g \\sim \\phi^* g$（$\\phi \\in \\text{Diff}(M)$）。",
      history: "1915年にアルベルト・アインシュタインによって発表されました。重力とは引っ張る力ではなく、質量とエネルギーの関係式によって商化され、歪んだ時空を物体がまっすぐ進もうとする測地線経路そのものであると証明しました。座標系は商化によって取り除かれるべき「ゲージ構文」であることを示しています。",
      exercises: "1. 「物質は時空に曲がり方を教え、時空は物質に動き方を教える」というフレーズを、生成元と関係式の観点から説明しなさい。\n2. なぜ一般相対性理論において座標系は「微分同相写像によって商化されなければならない構文のラベル」とみなされるのですか？"
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
      rigor: "Let $\\Lambda$ be the set of lambda terms generated by variables, abstractions ($\\lambda x. M$), and applications ($M N$). We define the equivalence relation $\\sim_{\\beta\\eta}$ generated by $\\beta$-reduction ($(\\lambda x. M)N \\to M[x \\coloneqq N]$) and $\\eta$-conversion. The quotient algebra $\\Lambda/\\sim_{\\beta\\eta}$ represents the space of computed values. Normal forms represent the canonical representatives of these quotient classes.",
      history: "Invented by Alonzo Church in the 1930s to study the limits of mathematics. It became the theoretical bedrock of functional programming languages like Lisp, Haskell, and Scheme, proving that execution is formal syntax reduction and that programs are evaluated by quotienting.",
      exercises: "1. Evaluate the lambda term $(\\lambda x. x \\ x) (\\lambda y. y)$ and find its normal form.\n2. Prove that beta-equivalence satisfies the properties of an equivalence relation."
    },
    ja: {
      narrative: "ラムダ計算は、計算の基礎となる最もシンプルな構文体系です。私たちは関数と変数からなる文字列の式を書きます（自由構文木）。しかし、関数は「実行」されるためにあります。関数に変数を代入し、式を「β簡約」によって縮小（Collapse）していくプロセスこそが、生の構文項を計算結果という同値類へ「商化」する行為なのです。実行とは商関係の適用そのものです。",
      rigor: "変数、ラムダ抽象（$\\lambda x. M$）、および関数適用（$M N$）から生成される項 of Lambda の集合を $\\Lambda$ とします。$\\beta$簡約の規則 $(\\lambda x. M)N \\to M[x \\coloneqq N]$ に基づく同値関係 $\\sim$ を定義します。商集合 $\\Lambda/\\sim$ が、評価された「計算結果」の空間を表し、正規形（Normal Form）が同値類の代表元となります。",
      history: "1930年代にアロンゾ・チャーチによって数学の決定不可能性を証明するために考案されました。後にLispやHaskellなどの関数型プログラミング言語の論理的基礎となり、プログラムの実行が文字通り「構文の簡約（商化）」であることを示しました。",
      exercises: "1. ラムダ項 $(\\lambda x. x \\ x) (\\lambda y. y)$ を評価し、その正規形を求めなさい。\n2. ベータ同値関係が、同値関係の3つの公理（反射律、対称律、推移律）を満たすことを証明しなさい。"
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
      rigor: "Let $T$ be the algebraic theory of arithmetic. The free algebra $F(X)$ represents all arithmetic syntax trees. The evaluation is a homomorphism $eval: F(X) \\to \\mathbb{Z}$ that quotients the terms by the computational rewrite relations (e.g., $x + y \\sim z$ for addition evaluation). The final value is the equivalence class of the tree under computational equivalence.",
      history: "This is the practical execution model of modern programming languages. Syntactic compiler representations are parsed freely and then quotiented by execution, showing that software execution is literally the mathematical quotienting of syntax.",
      exercises: "1. Walk through the AST evaluation steps of $(2 * 3) + (10 / 2)$ and identify the relations applied at each collapse.\n2. Prove that evaluation is a homomorphic mapping from the tree algebra to the integer algebra."
    },
    ja: {
      narrative: "コンピュータサイエンスにおいて、プログラムを書くことは「抽象構文木（AST）」を自由生成することです。コンパイラは生のテキストを、実行することなく、入れ子状の演算子とリテラルへと構造化します。コードを実行することは、この構文木を折りたたむ（Collapse）ことに他なりません。CPUは二項演算を再帰的に適用し、$3 + 5$ を $8$ へと折りたたみ、最終的に木全体を１つの値へと商化させます。計算とは、構文の代数的な崩壊そのものなのです。",
      rigor: "算術の代数理論を $T$ とします。自由代数 $F(X)$ はすべての算術構文木を表します。評価（Evaluation）は、計算の書き換え規則（例：$x + y \\sim z$）によって項を商化する準同型写像 $eval: F(X) \\to \\mathbb{Z}$ です。最終的な出力値は、計算関係の下での構文木の同値類です。",
      history: "これは現代のプログラミング言語の実用的な実行モデルです。コンパイラ内の構文的表現が自由にパースされ、実行によって商化される様子は、ソフトウェアの実行が数学的な構文商化そのものであることを裏付けています。",
      exercises: "1. 式 $(2 * 3) + (10 / 2)$ のAST評価ステップをたどり、各崩壊ステップで適用される「関係式」を特定しなさい。\n2. 評価写像が構文木の代数から整数の代数への準同型写像であることを証明しなさい。"
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
      rigor: "Let $R$ and $S$ be tables (sets of tuples). The Cartesian product $R \\times S$ is the free combination of all records. A join query imposing a relation $R.id = S.id$ constructs a quotient subset, filtering and grouping records under key equivalence classes. In terms of relational algebra, query filters are quotient operations that identify tuples by attribute constraints.",
      history: "Edgar F. Codd introduced the Relational Model in 1970. It structured data using mathematical relation theory instead of nested pointer loops, proving that querying is the algebraic reduction (quotienting) of sets and revolutionizing data retrieval.",
      exercises: "1. Explain how a GROUP BY query acts as a quotient relation on database records.\n2. Prove that the relational selection operator commutes with projection under suitable conditions."
    },
    ja: {
      narrative: "データベースは情報を管理・抽出する仕組みです。SQLクエリは、SELECTやJOINなどのキーワードを並べた「自由な構文（文字列）」です。クエリを実行することは、複数のテーブルの「直積（すべての組み合わせ）」を計算し、JOIN条件やフィルタ条件という「関係式」によって縮小させ、必要な結果テーブルへと「商化」することです。関係スキーマは無構造な直積を情報へと商化します。",
      rigor: "テーブル $R$ と $S$ に対し、すべてのレコードの組み合わせである直積 $R \\times S$ を作成します。結合条件 $R.id = S.id$ は、主キーと同値なレコードのみを選択・統合する関係式であり、結果を同値類へと商化する操作です。関係代数の観点から、クエリフィルタは属性制約によってタプルを同一視する商操作です。",
      history: "エドガー・F・コッドが1970年に関係モデル（Relational Model）を発表しました。複雑なポインタ構造を排し、純粋な関係代数（商構造の応用）としてデータベースを再構築したことで、情報検索技術に革命をもたらし、現代の情報インフラが完成しました。",
      exercises: "1. SQLの `GROUP BY` クエリが、レコードの集合に対する「商関係」としてどのように機能しているか説明しなさい。\n2. 関係代数の選択（Selection）演算が、特定の条件下で射影（Projection）演算と可換であることを示しなさい。"
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
      rigor: "Given a regular language $L \\subseteq \\Sigma^*$, the Myhill-Nerode theorem defines the equivalence relation $\\sim_L$ on strings by: $x \\sim_L y \\iff \\forall z \\in \\Sigma^*, (xz \\in L \\iff yz \\in L)$. The minimal DFA state space is the quotient monoid $\\Sigma^*/\\sim_L$. Minimization of a DFA is the quotienting of its state set by the equivalence relation of behavior indistinguishability.",
      history: "Developed by Stephen Kleene and formalized by John Myhill and Anil Nerode in the 1950s, this quotient proved that regular languages are defined by finite quotient spaces of strings, establishing the foundation of lexical analysis and string compilation.",
      exercises: "1. How does DFA minimization represent quotienting of states?\n2. Compute the equivalence classes of the language of strings containing an even number of '1's."
    },
    ja: {
      narrative: "正規表現は文字列のパターンを判定します。私たちは記号やワイルドカード、スターを使って正規表現を自由に生成します。これを判定する際、コンピュータはそれを有限オートマトン（DFA）へと変換します。文字列の照合経路を、遷移状態という有限個の「状態同値類」へと折りたたむ（商化する）のです。正規言語とは、無限の文字列集合を有限の状態同値類に商化したものと言えます。",
      rigor: "正規言語 $L \\subseteq \\Sigma^*$ に対し、マイヒル・ネローデの同値関係 $x \\sim_L y \\iff \\forall z \\in \\Sigma^*, (xz \\in L \\iff yz \\in L)$ を定義します。この関係式による商モノイド $\\Sigma^*/\\sim_L$ の元が、最小化DFAの状態そのものになります。DFAの最小化とは、状態の集合を行動の不可分性（同値関係）で商化することに対応します。",
      history: "1950年代にスティーヴン・クリーニやジョン・マイヒル、アニル・ネローデらによって確立されました。任意の正規言語は、文字列の集合を特定の商関係で折りたたむことで、有限状態の機械として実装できることを示し、字句解析と文字列コンパイルの基礎を築きました。",
      exercises: "1. DFA（決定性有限オートマトン）の最小化が、状態集合の「商化」であることを説明しなさい。\n2. 「1」が偶数個含まれる文字列の言語におけるマイヒル・ネローデ同値類を求めなさい。"
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
      rigor: "The Curry-Howard isomorphism establishes a dictionary between Logic and Type Theory. Propositions correspond to Types, and Proofs correspond to Terms. Proof normalization (beta/eta reduction) defines an equivalence relation $\\sim$ on terms. The quotient is the set of equivalence proofs of a theorem. For instance, any two proofs of $A \\land B \\to B \\land A$ are quotiented to their normal form.",
      history: "Discovered by Haskell Curry and William Alvin Howard. It bridged the gap between logic and programming, laying the foundation for modern theorem provers like Coq, Lean, and Agda, where verification is checking quotient compatibility.",
      exercises: "1. If a type represents a logical proposition, what does a program of that type represent?\n2. Show how beta-reduction on lambda terms corresponds to proof simplification."
    },
    ja: {
      narrative: "現代のコンピュータサイエンスでは、「型は命題であり、プログラムは証明である」と捉えられます（カリー・ハワード同型対応）。プログラムを記述する行為は、ある型（命題）を満たすプログラムコード（証明）の「自由生成」です。複数の異なるプログラムコードが、論理的に全く同一の証明を実行するとき、これらを「証明同値性（正規化書き換え）」で商化し、実行によって構文を検証された論理へと崩壊させます。プログラムは数学的真理へと商化される構文構造なのです。",
      rigor: "カリー・ハワード同型（Curry-Howard isomorphism）は論理学と型理論の対応を定義します。証明項の簡約（β/η変換）による項の同値関係 $\\sim$ を導入し、商集合 $T/\\sim$ はある命題の「正規化された証明」を表します。たとえば、$A \\land B \\to B \\land A$ のすべての証明は、正規形同値類へと商化されます。",
      history: "ハスケル・カリーとウィリアム・アルヴィン・ハワードによって発見されました。論理とプログラムを統合し、現代の証明支援言語（Lean, Coq, Agdaなど）を誕生させる基礎となりました。証明検証とは、商関係の整合性を確認することに他なりません。",
      exercises: "1. ある型が「論理的命題」を表すとすれば、その型を持つ具体的なプログラム（項）は何を表しますか？\n2. ラムダ項のベータ簡約が、論理学における「証明の簡素化（正規化）」にどう対応するか説明しなさい。"
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
      rigor: "Let $A, B$ be types. The identity type $\\text{Id}(A, B)$ is the space of equivalences $A \\simeq B$. The Univalence Axiom asserts that the natural map $\\text{Id}(A, B) \\to (A \\simeq B)$ is itself an equivalence of types, effectively quotienting the universe of types by equivalence classes. Thus, structural identity is homological path-connectedness.",
      history: "Developed by Fields medalist Vladimir Voevodsky in the 2000s, HoTT merged homotopy topology and computer type theory. It provides a computer-verifiable foundation where isomorphic math objects are treated as equal, unifying topology, programming, and logic.",
      exercises: "1. What is the difference between judgmental equality and identity types in HoTT?\n2. Explain why the Univalence Axiom justifies the informal mathematical practice of saying 'isomorphic groups are equal'."
    },
    ja: {
      narrative: "ホモトピー型理論（HoTT）は、現代数学の新しい基礎論です。ここでは、対象の「同一性（イコール）」を単なる二値論理ではなく、対象間の「連続的なパス（経路）」の空間として定義します。2つの型が等しいと示すことは、その間の同値写像というパスを示すことです。一価性公理（Univalence Axiom）を通じて、私たちは型を同型関係によって商化し、「同型な構造は同一である」と宣言します。これは「同型なものをイコールとみなす」数学的営みの厳密な定式化です。",
      rigor: "型 $A, B$ に対し、同一性型 $\\text{Id}(A, B)$ は同値写像の空間 $A \\simeq B$ と同値になります（一価性公理）。これにより、すべての型の宇宙を「同型同値関係」で商化し、同じ構造を持つ数学的対象を完全に同一視できます。構造的同一性とは、ホモトピー的なパス連結性そのものになります。",
      history: "2000年代にフィールズ賞受賞者のウラジーミル・ヴォエヴォドスキーらによって開発されました。トポロジー（ホモトピー）とコンピュータの型理論を融合し、「同型ならイコール」として扱える、コンピュータが検証可能な新時代の数学の台地であり、トポロジー・論理・プログラミングを統合しました。",
      exercises: "1. HoTTにおいて、「判断の等価性（Judgmental Equality）」と「同一性型（Identity Types）」の違いは何ですか？\n2. 一価性公理が、数学者が普段「同型な群は等しいとみなす」とカジュアルに言っている行為をどのように数学的に正当化するか説明しなさい。"
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
      rigor: "The category $Set$ has sets as objects and functions as morphisms. Composition of morphisms is the standard composition of functions, which is associative, and for every set $X$ there exists an identity function $id_X$. $Set$ represents the primordial category from which we forget algebraic structure, serving as the domain of forgetful functors.",
      history: "Developed by Georg Cantor in the late 19th century, set theory was initially criticized as 'non-constructive' but later became the standard foundation of math. In category theory, it serves as the base category, representing the unstructured void.",
      exercises: "1. Explain why the category $Set$ has no algebraic structures associated with its objects.\n2. Prove that the composition of functions in $Set$ is associative."
    },
    ja: {
      narrative: "ここから本格的な圏論に入ります。集合 of sets の圏（$\\mathcal{S}et$）は、数学における「自然状態（無秩序）」を表します。ここには、代数演算を持たない孤立した点（生成元）と、それらの間の単純な写像（関数）だけが存在します。掛け算も、足し算も、折り畳みもありません。これは、関係式のルールが適用される前の、純粋で制約のない「生成元（構文）」だけの世界です。",
      rigor: "圏 $Set$ は、集合を対象とし、関数を射とします。射の合成は通常の関数の合成であり、これは結合的です。また、すべての集合 $X$ に対して恒等関数 $id_X$ が存在します。$Set$ は、代数構造を忘却したあとに残る最も根源的な圏であり、忘却関手の終着点となります。",
      history: "19世紀末にゲオルク・カントールによって構築された集合論は、当初「直観に反する非構成的理論」として批判されましたが、後に数学全体の基礎となりました。圏論においては、代数構造を持たない「生の素材」を提供する基準の圏として位置づけられます。",
      exercises: "1. 集合の圏 $Set$ において、対象自体に代数的な演算が一切紐づいていない理由を説明しなさい。\n2. $Set$ における射の合成（写像の合成）が結合法則を満たすことを証明しなさい。"
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
      rigor: "A Monoid $M = (S, \\cdot, e)$ is a set $S$ with binary operation $\\cdot: S \\times S \\to S$ satisfying $(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$ and $e \\cdot a = a \\cdot e = a$. Category $Mon$ has monoids as objects and monoid homomorphisms (functions preserving multiplication and identity: $f(x \\cdot y) = f(x) \\cdot f(y)$ and $f(e) = e$) as morphisms.",
      history: "Monoids capture the algebraic essence of concatenation, transformation, and sequential time. Historically, they emerged in the study of substitution groups and string systems, representing the simplest non-trivial algebraic structures with relational equations.",
      exercises: "1. Provide an example of a set with a binary operation that is NOT a monoid, and explain why.\n2. Prove that the composition of two monoid homomorphisms is also a monoid homomorphism."
    },
    ja: {
      narrative: "単なる集合（無秩序）とは対照的に、ここで「代数（秩序）」が導入されます。モノイドとは、結合法則を満たす二項演算（掛け算）と、単位元（掛けても変化しない要素）を備えた集合です。モノイドの圏（$\\mathcal{M}on$）において、各対象は内部構造を持っており、要素同士を掛け合わせて新しい要素を作ることができます。これは構文を商化・構造化して得られる代数的な世界の出発点です。",
      rigor: "モノイド $M = (S, \\cdot, e)$ は、集合 $S$ と結合的な二項演算 $\\cdot$、および単位元 $e$ の組です。モノイドの圏 $Mon$ は、モノイドを対象とし、積と単位元を保存する写像であるモノイド準同型写像（$f(x \\cdot y) = f(x) \\cdot f(y)$ かつ $f(e) = e$）を射とします。",
      history: "モノイドは、文字列の結合や時間の経過、写像の合成など、「順次適用」の代動作的エッセンスを捉えています。歴史的には置換群の研究や記号列システムから派生し、関係式を持つ最もシンプルな代数構造として定着しました。",
      exercises: "1. 二項演算を持つがモノイドではない集合の例を一つ挙げ、その理由を説明しなさい。\n2. 2つのモノイド準同型写像の合成が、再びモノイド準同型写像になることを証明しなさい。"
    }
  },
  21: {
    id: 21,
    nameEn: "Hall XXI: Functorial Bridges (F and U)",
    nameJa: "第XXI室：関手の架け橋（FとU）",
    thesisEn: "Free Functor $F$ (creating syntax) and Forgetful Functor $U$ (stripping rules).",
    thesisJa: "構文を生成する自由関手 $F$ と、規則を取り除く忘却関手 $U$ による圏の接続。",
    en: {
      narrative: "How do sets and monoids talk to each other? We build Functors—bridges between structural universes. The Free Functor $F$ takes an unstructured set and generates the free monoid of all possible strings (Syntax). The Forgetful Functor $U$ takes a structured monoid and forgets its multiplication, stripping the algebraic rules to return a plain set. These two functors create a dynamic dialogue between syntax and semantics, showing how translation preserves structure.",
      rigor: "The Free Functor $F: Set \\to Mon$ maps a set $X$ to the free monoid $F(X) = X^*$ of strings (under concatenation). The Forgetful Functor $U: Mon \\to Set$ maps a monoid $M=(S, \\cdot, e)$ to its underlying set $S$. On morphisms, $F$ maps functions to string substitutions, and $U$ maps homomorphisms to their underlying set functions, satisfying functoriality laws ($F(g \\circ f) = F(g) \\circ F(f)$).",
      history: "The concept of free algebras and forgetting structures is central to algebraic geometry and abstract algebra. In the mid-20th century, Eilenberg and Mac Lane unified these translations through functorial mapping, showing that mathematics is the study of how structures map and translate.",
      exercises: "1. Describe the elements of $F(\\{a, b\\})$ and explain its identity element.\n2. Explain why the forgetful functor $U$ is not a bijection on objects or morphisms."
    },
    ja: {
      narrative: "集合の圏（無秩序）とモノイドの圏（秩序）は、どのように対話するでしょうか？私たちは圏と圏を繋ぐ翻訳機である「関手（Functor）」という架け橋を架けます。「自由関手 $F$」は、生の集合を受け取り、すべての可能な文字列の自由モノイド（構文）を生成します。一方、「忘却関手 $U$」は、構造化されたモノイドから掛け算の規則を忘れて取り去り、単なる生の集合へと戻します。この一対の関手が、構文生成と意味忘却の動的な対話を生み出します。",
      rigor: "自由関手 $F: Set \\to Mon$ は、集合 $X$ を文字列の結合を演算とする自由モノイド $F(X) = X^*$ にマッピングします。忘却関手 $U: Mon \\to Set$ は、モノイド $M=(S, \\cdot, e)$ をその台集合 $S$ にマッピングします。射に関して、$F$ は写像を文字列置換にマッピングし、$U$ は準同型写像をその台関数にマッピングし、関手の合成・恒等保存則を満たします。",
      history: "自由代数の構成と代数構造の忘却は、抽象代数学や代数幾何学の核心的なアイデアです。20世紀半ばにアイレンバーグとマックレーンがこれらを「関手」として定式化し、数学の本質が対象そのものではなく「構造の翻訳と写像」にあることを明らかにしました。",
      exercises: "1. 集合 $X = \\{a, b\\}$ から自由関手によって生成される $F(X)$ の元を具体的に列挙し、その単位元を答えなさい。\n2. 忘却関手 $U$ が、対象の集合や射の集合において全単射（一対一対応）ではない理由を説明しなさい。"
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
      rigor: "The bijection $\\Phi_{X, M}: \\text{hom}_{Mon}(F(X), M) \\cong \\text{hom}_{Set}(X, U(M))$ is natural in both $X$ and $M$. For any monoid homomorphism $g: F(X) \\to M$, there corresponds a unique set function $f: X \\to U(M)$ given by $f = U(g) \\circ \\eta_X$. Conversely, any set function $f: X \\to U(M)$ extends uniquely to a monoid homomorphism $\\bar{f}: F(X) \\to M$ such that $U(\\bar{f}) \\circ \\eta_X = f$, where $\\eta_X$ is the unit of the adjunction.",
      history: "Discovered by Daniel Kan in 1958. It stands as one of the most powerful organizing concepts in mathematics, demonstrating that syntax (represented by $F$) and semantics (represented by $U$) are not opposing forces, but rather dual projections of the same truth, proving that the behavior of any complex, quotiented semantic system is determined entirely at its generators.",
      exercises: "1. Show that the mapping $\\Phi_{X, M}$ is natural, i.e., it commutes with morphisms in $Set$ and $Mon$.\n2. Use the adjunction to show that the free monoid $F(X)$ is unique up to isomorphism."
    },
    ja: {
      narrative: "本展示のクライマックスは、随伴双対性（$F \\dashv U$）です。これは写像空間の間に横たわる自然同型 $\\text{hom}(F(X), M) \\cong \\text{hom}(X, U(M))$ を樹立します。これは私たちの核心的なテーゼの数学的証明です。「自由生成された構造（構文）から、構造を保つ写像（商評価）を定義すること」は、「生の生成元がどこにマッピングされるかを決めること」と完全に同値です。商の評価は、生成元の挙動だけで一意に決定されるのです。",
      rigor: "バイジェクション（全単射） $\\Phi_{X, M}: \\text{hom}_{Mon}(F(X), M) \\cong \\text{hom}_{Set}(X, U(M))$ は、$X$ と $M$ の両方に関して自然（Natural）です。任意の準同型写像 $g: F(X) \\to M$ に対し、関数 $f = U(g) \\circ \\eta_X$ が一意に対応します。逆に、任意の関数 $f: X \\to U(M)$ は、準同型写像 $\\bar{f}: F(X) \\to M$ へと一意に拡張され、$U(\\bar{f}) \\circ \\eta_X = f$ を満たします（$\\eta$ は単位元）。",
      history: "1958年にダニエル・カンによって発見されました。随伴は数学における最も強力な統一概念の1つであり、構文（F）と意味（U）が対立するものではなく、同一の真理の双対写像であることを証明しました。これにより、複雑に商化された意味体系の挙動が、生の生成元のマッピング方法だけで完全に決定されることが証明されました。",
      exercises: "1. 写像 $\\Phi_{X, M}$ が自然であること、すなわち $Set$ と $Mon$ の射と可換であることを示しなさい。\n2. 随伴を用いて、自由モノイド $F(X)$ が同型を除いて一意に決定されることを示しなさい。"
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
      rigor: "The Unit $\\eta: I_{Set} \\Rightarrow UF$ is a natural transformation representing the inclusion of generators: $\\eta_X(x) = [x]$ (the string of length 1). The Counit $\\varepsilon: FU \\Rightarrow I_{Mon}$ is a natural transformation representing evaluation: $\\varepsilon_M(w)$ multiplies the letters of the string $w$ using the monoid operation of $M$. They satisfy the triangular identities: $U(\\varepsilon_M) \\circ \\eta_{U(M)} = id_{U(M)}$ and $\\varepsilon_{F(X)} \\circ F(\\eta_X) = id_{F(X)}$.",
      history: "Developed as internal components of Kan's adjunction theory. They describe how syntax is packaged (unit) and how it is unpackaged/collapsed into semantic values (counit), representing the universal mechanics of evaluation in compilers and logic.",
      exercises: "1. Verify the triangular identities for the case of sets and monoids.\n2. Explain why the counit $\\varepsilon_M$ is a surjective quotient map."
    },
    ja: {
      narrative: "随伴関係は、2つの対照的な写像「単位（$\\eta$）」と「余単位（$\\varepsilon$）」を通じて機能します。単位 $\\eta$ は、生の生成元を自由代数構造の中へと挿入します（構文の包含）。余単位 $\\varepsilon$ は、構造化された項を演算に沿って評価し、元の代数対象へと崩壊させます（意味論的商化）。これらは包含と崩壊、すなわち数学的論理における吸気と呼気であり、表現と評価を仲介します。",
      rigor: "単位 $\\eta: I_{Set} \\Rightarrow UF$ は生成元の包含を表す自然変換です（$\\eta_X(x) = [x]$）。余単位 $\\varepsilon: FU \\Rightarrow I_{Mon}$ は代数的評価を表す自然変換です（$\\varepsilon_M(w)$ は文字列 $w$ の文字をモノイド $M$ の演算で掛け合わせる写像）。これらは次の三角恒等式を満たします：$U(\\varepsilon_M) \\circ \\eta_{U(M)} = id_{U(M)}$ および $\\varepsilon_{F(X)} \\circ F(\\eta_X) = id_{F(X)}$。",
      history: "カンの随伴論の内部構造として定式化されました。これらは、構文がいかにカプセル化されるか（単位）、そしてそれがいかに意味論的価値へと崩壊・商化されるか（余単位）を表しており、コンパイラや数理論理学における評価機構の万能の設計図となっています。",
      exercises: "1. 集合とモノイドの圏において、三角恒等式が成り立つことを確認しなさい。\n2. なぜ余単位 $\\varepsilon_M$ が全射的な商写像になるのか説明しなさい。"
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
      rigor: "A Monad $(T, \\eta, \\mu)$ on Category $\\mathcal{C}$ is an endofunctor $T: \\mathcal{C} \\to \\mathcal{C}$ with natural transformations $\\eta: I \\Rightarrow T$ (unit) and $\\mu: T^2 \\Rightarrow T$ (multiplication/flattening) satisfying associativity and unit laws. An algebra for $T$ (Eilenberg-Moore algebra) is a map $h: T(X) \\to X$ satisfying $h \\circ \\eta_X = id_X$ and $h \\circ \\mu_X = h \\circ T(h)$. This map $h$ is a quotient collapse that resolves the monadic syntax $T(X)$ into the set $X$.",
      history: "Formalized by Roger Godement (under the name 'standard construction') and expanded by Samuel Eilenberg and John Moore. In computer science, Eugenio Moggi (1989) introduced monads to model side effects, proving that computing is monadic syntax generation and quotient evaluation.",
      exercises: "1. Show that the free-forgetful adjunction between $Set$ and $Mon$ generates a monad on $Set$. What does its multiplication $\\mu$ do to nested lists?\n2. Prove that the Eilenberg-Moore algebra $h: T(X) \\to X$ is a quotient map."
    },
    ja: {
      narrative: "自由関手 $F$ と忘却関手 $U$ を合成すると、集合の圏における「モナド $T = UF$」が得られます。モナドは、項を生成し、二重に入れ子になった構造を平坦化（Flattening: $T^2 \\to T$）する、代数的演算マシンです。アイレンバーグ・ムーア代数は、構造化されたあらゆる数学的圏が、モナド方程式で商化された集合の圏と等価であることを証明します。すべての代数はモナド的構文の商化なのです。",
      rigor: "圏 $\\mathcal{C}$ 上のモナド $(T, \\eta, \\mu)$ は、自己関手 $T: \\mathcal{C} \\to \\mathcal{C}$ と、単位元 $\\eta: I \\Rightarrow T$、乗法（平坦化） $\\mu: T^2 \\Rightarrow T$ からなる組です。$T$の代数（アイレンバーグ・ムーア代数）とは、写像 $h: T(X) \\to X$ であって、$h \\circ \\eta_X = id_X$ および $h \\circ \\mu_X = h \\circ T(h)$ を満たすものです。この写像 $h$ は、モナドが生成した構文 $T(X)$ を集合 $X$ へと解決する商写像です。",
      history: "ロジェ・ゴドマンによって定式化され、サミュエル・アイレンバーグとジョン・ムーアによって発展しました。コンピュータサイエンスにおいては、オジェニオ・モッジ（1989年）が副作用をモデル化するためにモナドを導入し、プログラミングにおける計算がモナド的構文の生成と商評価そのものであることを証明しました。",
      exercises: "1. 集合とモノイドの随伴が生成するモナドを考えなさい。このモナドの乗法 $\\mu$ は、二重リストに対してどのような操作を行いますか？\n2. アイレンバーグ・ムーア代数 $h: T(X) \\to X$ が商写像であることを証明しなさい。"
    }
  },
  25: {
    id: 25,
    nameEn: "Hall XXV: The Yoneda Lemma",
    nameJa: "第XXV室：米田の補題（関係性の極致）",
    thesisEn: "$\\text{Nat}(h_A, X) \\cong X(A)$. An object has no internal parts; it is defined entirely as the quotient limit of its outgoing relationships.",
    thesisJa: "$\\text{Nat}(h_A, X) \\cong X(A)$。対象は内部を持たず、外部との関係性の総和（商極限）としてのみ定義される。",
    image: "/images/yoneda_network.jpg",
    imageAlt: "Yoneda morphism network showing relational mappings",
    en: {
      narrative: "We conclude with the most profound theorem in Category Theory: the Yoneda Lemma. In our core philosophy, we have seen how elements generate and relations quotient. The Yoneda Lemma takes this to the extreme: an object in a category has no intrinsic substance. Its entire identity, structure, and existence is completely and uniquely determined by observing its relationship to all other objects. Relationship is existence itself, quotienting out the need for internal essence.",
      rigor: "Let $\\mathcal{C}$ be a locally small category, and let $A$ be an object of $\\mathcal{C}$. Let $h_A = \\text{Hom}_\\mathcal{C}(A, -)$ be the representable functor. For any functor $X: \\mathcal{C} \\to Set$, the Yoneda Lemma asserts a natural isomorphism: $\\text{Nat}(h_A, X) \\cong X(A)$ which is natural in both $A$ and $X$. The Yoneda embedding $Y: \\mathcal{C} \\to [\\mathcal{C}^{op}, Set]$ is fully faithful, meaning $A \\cong B \\iff h_A \\cong h_B$.",
      history: "Discovered by Nobuo Yoneda in 1954 during a meeting with Saunders Mac Lane in Paris. It revolutionized algebraic geometry and algebraic topology by proving that objects can be fully replaced by their functorial representations, establishing relation as the primary building block of mathematical ontology.",
      exercises: "1. Explain the statement: 'An object is defined by the network of its relationships' using the Yoneda embedding.\n2. Prove that if $\\text{Hom}(A, C) \\cong \\text{Hom}(B, C)$ naturally for all objects $C$, then $A \\cong B$."
    },
    ja: {
      narrative: "展示の最後を飾るのは、圏論において最も深遠な定理である「米田の補題」です。私たちの哲学において、要素の生成と関係式の商化を見てきました。米田の補題はこの考えを極限まで押し進めます。圏の中の対象は、それ自体の「中身」を持ちません。対象のすべての性質、構造、存在は、他のすべての対象との関係性（射）を観察することによってのみ完全に決定されます。関係性こそが存在そのものであり、内部の実体という概念は商化されて不要になります。",
      rigor: "局所的に小さな圏 $\\mathcal{C}$ とその対象 $A$ に対し、表現可能関手 $h_A = \\text{Hom}_\\mathcal{C}(A, -)$ を考えます。任意の関手 $X: \\mathcal{C} \\to Set$ に対し、自然同型 $\\text{Nat}(h_A, X) \\cong X(A)$ が成り立ち、これは $A$ と $X$ に関して自然です。米田埋め込み $Y: \\mathcal{C} \\to [\\mathcal{C}^{op}, Set]$ は完全忠実（Fully Faithful）であり、これは $A \\cong B \\iff h_A \\cong h_B$ を意味します。",
      history: "1954年、米田信夫がパリの駅でソーンダース・マックレーンと出会った際に発見されました。対象を関手的な表現（関係性の総和）で完全に置き換えることができることを示し、代数幾何学や代数的位相幾何学に革命をもたらし、関係性を存在論の基礎に据えました。",
      exercises: "1. 「対象はその関係性のネットワークによって定義される」という主張を、米田埋め込みを用いて説明しなさい。\n2. すべての対象 $C$ に対して $\\text{Hom}(A, C) \\cong \\text{Hom}(B, C)$ が自然に成り立つとき、$A \\cong B$ であることを証明しなさい。"
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
      rigor: "Given a set of generators $X$ and a signature $\\Sigma$ of operations, the free algebra $F(X)$ is the set of all terms constructed from $X$ using operations in $\\Sigma$, quotiented by nothing. The free functor $F: Set \\to \\mathcal{C}$ is left adjoint to the forgetful functor $U: \\mathcal{C} \\to Set$. It satisfies the universal property: any map from $X$ to $U(A)$ extends uniquely to a homomorphism from $F(X)$ to $A$.",
      history: "The concept of free structures (free groups, free monoids, free vector spaces) emerged in the late 19th and early 20th centuries. It formalized the intuition of 'generating' a structure from scratch. In psychology, it corresponds to the human brain's capacity for combinatorial generation, creating infinite novel expressions from finite components.",
      exercises: "1. Construct the free group on a set of two elements $\\{a, b\\}$ and describe how elements are multiplied.\n2. Prove that the free functor $F$ preserves coproducts (sums)."
    },
    ja: {
      narrative: "自由生成は、創造の認認知的なメカニズムです。それは可能性の制約のない拡張を意味します。私たちが記号を書き、変数を宣言し、あるいは一切のルールや方程式を課さずに構文木を構築するとき、私たちは「生成」を行っています。それは構文、言語的ポテンシャル、および絶対的な自由を表します。あらゆる代数構造は、生の記記号の集合から生成された自由構造としてその生を受けます。",
      rigor: "生成元の集合 $X$ と演算のシグネチャ $\\Sigma$ に対し、自由代数 $F(X)$ は $X$ から $\\Sigma$ の演算を用いて構築されるすべての項の集合であり、何の関係式によっても割られていません。自由関手 $F: Set \\to \\mathcal{C}$ は忘却関手 $U: \\mathcal{C} \\to Set$ の左随伴です。普遍性「$X$ から $U(A)$ への任意の写像は、$F(X)$ から $A$ への準同型写像へ一意に拡張される」を満たします。",
      history: "自由構造（自由群、自由モノイド、自由ベクトル空間など）の概念は、19世紀末から20世紀初頭にかけて確立されました。構造を「何もないところから生成する」という直観を定式化したものです。心理学的には、有限の要素から無限の新しい表現を作り出す、脳の組合せ論的生成能力（生成文法など）に対応しています。",
      exercises: "1. 2つの要素 $\\{a, b\\}$ からなる集合上の自由群を構成し、その積の演算を説明しなさい。\n2. 自由関手 $F$ がコプロダクト（余直積/直和）を保存することを示しなさい。"
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
      exercises: "1. Provide an example of a function that is surjective but not injective, and explain its cognitive equivalent.\n2. Prove that a function is bijective if and only if it has a unique left and right inverse."
    },
    ja: {
      narrative: "関係づけたり崩壊させたりする前に、まず接続しなければなりません。写像（関数）は、集合と集合の間の数学的な接続通路です。「単射」は異なる要素を異なる要素に送り、個性を保存します。「全射」はターゲットとなる空間全体をくまなく覆い尽くします。「全単射」はその両方を満たし、完璧な一対一の対応を確立します。認知の観点では、写像は翻訳の経路であり、脳が生の感覚を抽象的な概念へと一致させることを可能にします。",
      rigor: "関数 $f: A \\to B$ が単射（$Set$における単射/モノ射）であるとは、$f(x)=f(y) \\implies x=y$ が成り立つことです。全射（$Set$における全射/エピ射）であるとは、$\\forall y \\in B, \\exists x \\in A$ であって $f(x)=y$ となるものが存在することです。双方向の全単射（$Set$における同型射）であるとは、単射かつ全射であり、逆関数 $f^{-1}: B \\to A$ が存在することです。写像は圏 $Set$ における射（Morphism）です。",
      history: "ディリクレやカントールによって定式化されました。写像の概念は、数学を静的な方程式から動的な変換へとシフトさせました。心理学的には、人間の物体認識は全射写像です。光の当たり方や角度による顔の無限の変動（生成）が、脳内の単一のアイデンティティへと全射マッピング（商化）されるのです。",
      exercises: "1. 全射であるが単射ではない関数の例を挙げ、それに対応する認知的な事象を説明しなさい。\n2. 関数が全単射であることと、一意な左右の逆関数を持つことが同値であることを証明しなさい。"
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
      rigor: "An equivalence relation $\\sim$ on a set $X$ is reflexive ($x \\sim x$), symmetric ($x \\sim y \\implies y \\sim x$), and transitive ($x \\sim y \\land y \\sim z \\implies x \\sim z$). The equivalence class of $x$ is $[x] = \\{y \\in X \\mid y \\sim x\\}$. The quotient set $X/\\sim$ is the set of all equivalence classes. The canonical projection $\\pi: X \\to X/\\sim$ maps $x \\to [x]$, which is surjective.",
      history: "Quotient structures were formalized in group theory and topology by Cauchy, Galois, and others. Anthropologically, human language is a quotienting machine: we group distinct physical objects (individual oak trees, pine trees) under the single equivalence class 'tree', allowing the brain to process information without cognitive overload.",
      exercises: "1. Define an equivalence relation on the integers $\\mathbb{Z}$ that partition them into exactly three equivalence classes.\n2. Prove that the equivalence classes of an equivalence relation on $X$ partition the set $X$ into disjoint subsets."
    },
    ja: {
      narrative: "商化（Quotienting）は、抽象化を司る認知的な器官です。それは、重要でない違いを無視し、共通の本質に集中する行為です。同値関係を定義する（特定のルールに基づいて2つの異なるものを『同じ』とみなす）ことで、集合を互いに重ならないグループに分割します。商化は構文を意味論へと折りたたむ操作であり、どの詳細を「忘却する」かを選択したときに初めて意味が生まれることを示しています。",
      rigor: "集合 $X$ 上の同値関係 $\\sim$ は、反射律（$x \\sim x$）、対称律（$x \\sim y \\implies y \\sim x$）、および推移律（$x \\sim y \\land y \\sim z \\implies x \\sim z$）を満たします。要素 $x$ の同値類は $[x] = \\{y \\in X \\mid y \\sim x\\}$ です。商集合 $X/\\sim$ はすべての同値類の集合です。正準射影写像 $\\pi: X \\to X/\\sim$ は $x \\to [x]$ を割り当て、これは全射となります。",
      history: "コーシーやガロアらによって群論やトポロジーで定式化されました。人類学的には、人間の言語は商化マシンです。私たちは、無数の異なる物理的対象（一本一本のオークやマツの木）を「木」という単一の同値類へとグループ化し、脳が認知のオーバーロードを起こさずに情報を処理できるようにしています。",
      exercises: "1. 整数全体の集合 $\\mathbb{Z}$ 上に、ちょうど3つの同値類を生成する同値関係を定義しなさい。\n2. 同値関係 $\\sim$ の同値類が、集合 $X$ を互いに素な部分集合へと分割（直和分割）することを示しなさい。"
    }
  },
  29: {
    id: 29,
    nameEn: "Concept IV: Categories & Functors",
    nameJa: "概念IV：圏と関手（構造的宇宙と架け橋）",
    thesisEn: "Structuring objects and morphisms. Mapping between structural universes while preserving operations.",
    thesisJa: "対象と射の構造化。構造演算を保存したまま、異なる構造的宇宙の間をマッピング（翻訳）する。",
    image: "/images/yoneda_network.jpg",
    imageAlt: "Category network showing maps and functors",
    en: {
      narrative: "A category is a mathematical universe. It contains objects (elements or structures) and morphisms (arrows representing mappings or relationships between them). To connect different mathematical universes, we use functors. A functor maps objects of one category to objects of another, and morphisms to morphisms, while preserving the composition and identity of arrows. Functors are structural translators, showing that structure is defined by relationships.",
      rigor: "A category $\\mathcal{C}$ consists of a class of objects $\\text{Ob}(\\mathcal{C})$, hom-sets $\\text{Hom}(A, B)$ of morphisms, an identity morphism $id_A$ for each object, and an associative composition operation. A functor $F: \\mathcal{C} \\to \\mathcal{D}$ maps objects $C \\in \\mathcal{C} \\to F(C) \\in \\mathcal{D}$ and morphisms $f: A \\to B \\to F(f): F(A) \\to F(B)$ such that $F(id_A) = id_{F(A)}$ and $F(g \\circ f) = F(g) \\circ F(f)$.",
      history: "Introduced by Samuel Eilenberg and Saunders Mac Lane in 1945 to formalize algebraic topology. Category Theory provides a universal language for all of mathematics, replacing concrete sets with abstract arrows and relationships, proving that structure is invariant under translation.",
      exercises: "1. Explain why a functor must preserve identity morphisms.\n2. Is the identity mapping on any category a functor? Prove your answer."
    },
    ja: {
      narrative: "圏（Category）とは、数学的な宇宙です。そこには「対象（対象物や構造）」と、それらの間の関係性・マッピングを表す「射（矢印）」が存在します。異なる数学的な宇宙同士を接続するために、私たちは「関手（Functor）」を使用します。関手は、ある圏の対象と射を別の圏の対象と射にマッピングし、矢印の合成や恒等射を完全に保存します。構造が関係性によって定義されることを示す、構造の翻訳機です。",
      rigor: "圏 $\\mathcal{C}$ は対象のクラス $\\text{Ob}(\\mathcal{C})$、射の集合 $\\text{Hom}(A, B)$、各対象の恒等射 $id_A$、および結合的な射の合成演算から構成されます。関手 $F: \\mathcal{C} \\to \\mathcal{D}$ は、対象 $C \\to F(C)$ および射 $f: A \\to B \\to F(f): F(A) \\to F(B)$ をマッピングし、$F(id_A) = id_{F(A)}$ および $F(g \\circ f) = F(g) \\circ F(f)$ を満たします。",
      history: "1945年にサミュエル・アイレンベルグとソーンダース・マックレーンによって、代数的位相幾何学の定式化のために導入されました。圏論は、具体的な集合の代わりに抽象的な「矢印（関係性）」を基礎とすることで、全数学の共通言語を提供し、構造が翻訳において不変であることを示しました。",
      exercises: "1. 関手が恒等射を保存しなければならない理由を説明しなさい。\n2. 任意の圏における恒等写像は関手ですか？その答えを証明しなさい。"
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
      rigor: "An adjunction between categories $\\mathcal{C}$ and $\\mathcal{D}$ consists of a pair of functors $F: \\mathcal{C} \\to \\mathcal{D}$ and $U: \\mathcal{D} \\to \\mathcal{C}$ and a natural isomorphism: \n  $$\\Phi_{X, Y}: \\text{Hom}_\\mathcal{D}(F(X), Y) \\cong \\text{Hom}_\\mathcal{C}(X, U(Y))$$\n  For every morphism $f: X \\to U(Y)$ in $\\mathcal{C}$, there is a unique morphism $\\bar{f}: F(X) \\to Y$ in $\\mathcal{D}$ such that $U(\\bar{f}) \\circ \\eta_X = f$, where $\\eta_X: X \\to U(F(X))$ is the unit natural transformation.",
      history: "Discovered by Daniel Kan in 1958. It stands as one of the most powerful organizing concepts in mathematics, demonstrating that syntax and semantics are not opposing forces, but rather dual projections of the same truth, establishing the mathematical foundations of representation and evaluation.",
      exercises: "1. Explain how the unit $\\eta_X$ behaves as the inclusion of generators.\n2. State the triangular identities that any unit and counit of an adjunction must satisfy."
    },
    ja: {
      narrative: "随伴（Adjunction）とは、数学における究極の双対性です。構文を自由生成する「自由関手 $F$」と、構造を取り去って生の要素に戻す「忘却関手 $U$」を接続します。随伴 $F \\dashv U$ は、「自由生成された構造からの写像」と「生の要素からの写像」の間の完璧な対称的翻訳を可能にします。これは、複雑に商化された意味体系の挙動が、生の生成元のマッピング方法だけで完全に決定されることを証明しており、構文と意味論が同一の真理の表裏であることを示しています。",
      rigor: "圏 $\\mathcal{C}$ と $\\mathcal{D}$ の間の随伴は、対となる関手 $F: \\mathcal{C} \\to \\mathcal{D}$、 $U: \\mathcal{D} \\to \\mathcal{C}$、および次の自然同型から構成されます：\n  $$\\Phi_{X, Y}: \\text{Hom}_\\mathcal{D}(F(X), Y) \\cong \\text{Hom}_\\mathcal{C}(X, U(Y))$$\n  $\\mathcal{C}$ における任意の射 $f: X \\to U(Y)$ に対して、$\\mathcal{D}$ における一意の射 $\\bar{f}: F(X) \\to Y$ が存在し、$U(\\bar{f}) \\circ \\eta_X = f$ を満たします（$\\eta_X$ は単位自然変換です）。",
      history: "1958年にダニエル・カンによって発見されました。構文（F）と意味（U）が対立するものではなく、同一の真理の双対写像であることを証明する、数学において最も強力な統一概念の1つであり、表現と評価の数学的基礎を築きました。",
      exercises: "1. 単位元 $\\eta_X$ が「生成元の包含」としてどのように機能するか説明しなさい。\n2. 随伴の単位元と余単位元が満たさなければならない三角恒等式を述べなさい。"
    }
  }
};
