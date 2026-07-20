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
      narrative: "Welcome to the Ontology Museum. At its ultimate foundation, mathematics is not the study of numbers or shapes, but the dialogical cycle of Free Generation and Quotienting. We begin by writing down raw symbols without constraint—this is the creation of pure Syntax (Generators). We then fold, identify, and group these symbols under equations to resolve their meaning—this is Semantics (Relations). Every mathematical structure is born of this simple cognitive loop.",
      rigor: "In formal terms, this cycle is modeled as a presentation by Generators and Relations. Given a set of raw elements $X$ (generators), we construct a free algebra $F(X)$ containing all possible syntactic terms. We then define a set of relations $R \\subseteq F(X) \\times F(X)$ representing equations we wish to force. The quotient structure $F(X)/\\sim$ is the finest algebraic structure where these relations hold, formalized category-theoretically as a Coequalizer.",
      history: "\"The limits of my language mean the limits of my world.\" — Ludwig Wittgenstein, *Tractatus Logico-Philosophicus*. This exhibition draws connections between Wittgenstein's logical syntax, Immanuel Kant's schemata of pure understanding, and F. William Lawvere's category-theoretic foundations of physics and logic.",
      exercises: "1. If syntax is represented as the set of all possible keystrokes on a typewriter, what mathematical tool represents the meaning of the written sentences?\n2. Prove that the quotient map $\\pi: F(X) \\to F(X)/\\sim$ is a homomorphism."
    },
    ja: {
      narrative: "随伴存在論ツアーへようこそ。数学はその最も根源的な土台において、数や図形の研究ではなく、自由生成と商化（関係性の構築）という２つの認知の対話的サイクルそのものです。私たちは最初に一切の制約なしに生の記号を並べて「構文（Syntax）」を作り出し、次にそれらを方程式によって結びつけて折りたたむことで「意味論（Semantics）」を与えます。",
      rigor: "形式的には、このサイクルは「生成元と関係式（Generators and Relations）」による表示としてモデル化されます。生の要素の集合 $X$ から自由代数 $F(X)$ を生成し、同値関係 $\\sim$ を定める関係式 $R$ によって商構造 $F(X)/\\sim$ を構成します。これは圏論におけるコイコライザー（余等化子）の構成に対応します。",
      history: "「私の言語の限界は、私の世界の限界を意味する」 — ルートヴィヒ・ウィトゲンシュタイン『論理哲学論考』。本展示は、ウィトゲンシュタインの論理的構文論、イマヌエル・カントの純粋悟性概念、そしてウィリアム・ローヴェアによる物理と論理の圏論的基礎づけを結びつけます。",
      exercises: "1. タイプライターの打鍵の集合を「構文」とするとき、書かれた文章の「意味」を数学的に表す操作は何ですか？\n2. 射影写像 $\\pi: F(X) \\to F(X)/\\sim$ が準同型写像であることを証明しなさい。"
    }
  },
  2: {
    id: 2,
    nameEn: "Hall II: Notches & Cardinality (Lebombo Bone)",
    nameJa: "第II室：ノッチと基数（レボンボ骨）",
    thesisEn: "Free generation of tally marks vs. Quotienting by bijection equivalence classes to form Cardinal Numbers.",
    thesisJa: "タリカウンターの自由生成と、基数を形成するための全単射同値類による商化。",
    image: "/images/lebombo_bone.jpg",
    imageAlt: "Lebombo Bone notches with lunar alignments",
    en: {
      narrative: "A million years ago, our ancestors carved notches on the Lebombo bone. The act of cutting tally marks I, II, III freely is the free generation of syntax. But raw marks are useless without a contract. By grouping these notches into equivalent packets (like five-notch bundles) and establishing a bijection to a herd of sheep, humanity discovered cardinality. The number '5' is not a physical object; it is the quotient class of all tally marks that can be put in one-to-one correspondence.",
      rigor: "Let $Set$ be the category of sets. The free generation step is the construction of finite ordinal sets. The quotienting step is the partition of the class of all sets under the equivalence relation of equipotence (bijection): $A \\sim B \\iff \\exists f: A \\to B$ which is bijective. The isomorphism class $[A]_\\sim$ defines the cardinal number.",
      history: "The Lebombo Bone (c. 35,000 BCE), discovered in eSwatini, contains 29 distinct notches carved into a baboon's fibula. While each individual notch is a free generator (syntax), mapping the 29-notch sequence to the lunar cycle represents a quotient relation (semantics), folding raw notches into a functional base-29 calendar register.",
      exercises: "1. Explain how the Lebombo bone represents both free generation and quotienting.\n2. Show that equipotence ($\\sim$) is an equivalence relation on sets."
    },
    ja: {
      narrative: "数万年前、人類の祖先はレボンボ骨に刻み目を刻みました。ルールなしに刻み目 I, II, III を無数に刻む行為は、純粋な記号構文の「自由生成」です。しかし、ただの刻み目だけでは意味をなしません。刻み目を特定の束（5本括りなど）に対応させ、羊の群れと「一対一の対応（写像）」を作ることで、人類は個数（基数）を発見しました。数「5」とは物理的な実体ではなく、一対一対応するすべてのノッチの「商集合（同値類）」なのです。",
      rigor: "集合の圏 $Set$ において、自由生成ステップは有限順序数の構成です。商化ステップは、対等（全単射の存在）という同値関係 $A \\sim B \\iff \\exists f: A \\to B$ による集合全体のクラスの分割です。同値類 $[A]_\\sim$ が基数（カルディナリティ）を定義します。",
      history: "エスワティニで発見されたレボンボ骨（紀元前約35,000年）には、ヒヒの腓骨に29個の刻み目が刻まれています。個々の刻み目は単なる「自由生成（構文）」ですが、29個の刻み目を「月の満ち欠け（太陰周期）」にマッピングする行為は「商関係（意味論）」であり、生の刻み目をカレンダー登録という機能的な構造へと折りたたんでいます。",
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
      narrative: "In ancient Mesopotamia, trade required trust. Merchants created clay tokens shaped as spheres, cones, and cylinders to represent sheep, grain, or oil. Generating these physical tokens is free syntax. But tokens are easily counterfeited or lost. To secure the contract, the Sumerians sealed the tokens inside hollow clay envelopes called 'bullae'. This sealed envelope established a physical quotient contract, locking raw elements into transaction equivalence.",
      rigor: "Let $T$ be the set of physical tokens. The free algebra $F(T)$ is the free commutative monoid representing bundles of tokens. A transaction contract defines a congruence relation $\\sim$ where two token bundles are equivalent if they satisfy the same exchange value or debt settlement: $A \\sim B \\iff A \\oplus D = B \\oplus D$ for debt clearing. The bulla physically enforces this quotient map $\\pi: F(T) \\to F(T)/\\sim$.",
      history: "Sumerian clay bullae (c. 8000–3000 BCE) represent the first physical quotient contract. By sealing tokens inside, merchants ensured that neither party could alter the tokens without breaking the seal. The markings pressed onto the outer surface of the bulla eventually evolved into cuneiform writing, showing how quotient contracts generated the first formal written syntax.",
      exercises: "1. Why was a hollow clay envelope (bulla) required to mathematically quotient the clay tokens?\n2. Prove that if $\\sim$ is a congruence relation, the quotient space inherits a monoid structure."
    },
    ja: {
      narrative: "古代メソポタミアにおいて、交易には信頼が必要でした。商人は羊や穀物、油を表すために球体や円錐、円柱の形をした粘土のトークンを作りました。これらの物理的トークンを作る行為は「自由構文（自由生成）」です。しかし、トークンは偽造されたり紛失したりしやすいものでした。取引を保証するために、シュメール人は「ブッラ（Bullae）」と呼ばれる中空の粘土の封筒にトークンを封入しました。この封筒こそが最初の物理的「商契約」であり、生の要素を取引同値性へとロックしたのです。",
      rigor: "トークンの集合を $T$ とします。自由代数 $F(T)$ はトークンの束を表す自由可換モノイドです。取引契約は合同関係 $\\sim$ を定義し、同一の交換価値や債務決済を満たすトークンの束を同値と見なします。ブッラはこの商写像 $\\pi: F(T) \\to F(T)/\\sim$ を物理的に強制するデバイスです。",
      history: "シュメールの粘土製ブッラ（紀元前8000年〜3000年頃）は、人類最初の物理的な商化契約です。トークンを内部に密封することで、商人は封印を破ることなくトークンを変更できないようにしました。ブッラの外側にトークンを押し付けてつけたマークが、後の楔形文字へと進化し、商契約がいかにして文字構文を生み出したかを示しています。",
      exercises: "1. 粘土トークンを数学的に商化するために、なぜ中空の粘土の封筒（ブッラ）が必要だったのですか？\n2. 同値関係 $\\sim$ が合同関係であるとき、商空間がモノイド構造を継承することを示しなさい。"
    }
  },
  4: {
    id: 4,
    nameEn: "Hall IV: Knotted Cord Paths (Inca Quipus)",
    nameJa: "第IV室：結縄（キープ）の経路（インカ帝国）",
    thesisEn: "Free loops of string vs. Quotienting by positional base-10 slots to store decimal values.",
    thesisJa: "紐の自由ループと、10進数値を格納するための位置的な10進法スロットによる商化。",
    image: "/images/inca_quipu.jpg",
    imageAlt: "Inca Quipu cords showing positional knots",
    en: {
      narrative: "Without a written alphabet, the Inca Empire managed vast agricultural registries and populations using the Quipu—a system of knotted cords. A main horizontal string holds dozens of hanging pendant cords. While a cord can support any number of knots in arbitrary arrangements (free loops of string), the Inca quotiented this free space by dividing each cord into strict positional tiers: units, tens, hundreds, and thousands. Position quotiented free loops into a base-10 relational register.",
      rigor: "Let $C$ be the space of all possible knot configurations on a cord. We define a quotient mapping $\\pi: C \\to \\mathbb{N}$ by dividing the cord length into intervals $L_k$ corresponding to powers of ten $10^k$. The knots within each interval $L_k$ are evaluated as a digit $d_k \\in \\{0..9\\}$ depending on knot type (single, long, figure-eight). The final decimal number is the quotient representation $\\sum d_k 10^k$.",
      history: "Inca Quipus (c. 1400–1532 CE) served as the primary administrative and mathematical register of the Tawantinsuyu empire. Knotted string loops were freely generated and then quotiented by decimal position to store census, crop, and military data, proving that complex mathematics does not require paper or symbols.",
      exercises: "1. How does a positional system (like decimal slots) mathematically function as a quotient relation?\n2. Show that mapping a set of cords to numbers is a surjective quotient map."
    },
    ja: {
      narrative: "文字を持たなかったインカ帝国は、結縄（キープ）と呼ばれる結び目のついたコードのシステムを使って、広大な農地や人口のデータを管理していました。主要な太い紐から、色とりどりの細い紐が数十本も垂れ下がっています。紐には任意の数や配置で自由に結び目（自由ループ）を作ることができますが、インカ人は各紐を「一、十、百、千」という厳格な「位置スロット」に分割することで商化しました。位置関係が自由な結び目を十進法の関係レジスタへと変えたのです。",
      rigor: "紐の上のすべての結び目構成の空間を $C$ とします。紐の長さを10のべき乗 $10^k$ に対応する区間 $L_k$ に分割し、商写像 $\\pi: C \\to \\mathbb{N}$ を定義します。各区間の結び目の数と種類（一重、ロング、8の字）から数字 $d_k \\in \\{0..9\\}$ を判定し、数値 $\\sum d_k 10^k$ として商化します。",
      history: "インカのキープ（西暦1400年〜1532年頃）は、タワンティンスーユ（インカ帝国）の主要な行政・数学レジスタでした。自由に結ばれた紐のループが、十進法の位置による商化契約によって人口調査、収穫量、軍事データを記録する手段となり、高度な数学に紙や記号が必須ではないことを証明しました。",
      exercises: "1. 位置表記法（十進法スロットなど）が、どのように数学的に「商関係」として機能するか説明しなさい。\n2. 紐の集合から数値へのマッピングが全射的な商写像であることを示しなさい。"
    }
  },
  5: {
    id: 5,
    nameEn: "Hall V: Language Alphabet & Synonymy",
    nameJa: "第V室：言語の文字と同義性（フレーゲの意義と意味）",
    thesisEn: "Free monoid of string characters vs. Quotienting by synonymy equivalence classes to extract meaning.",
    thesisJa: "文字列文字の自由モノイドと、意味を抽出するための同義語同値類による商化。",
    en: {
      narrative: "With the alphabet, humanity unlocked infinite expression. Arranging letters freely to generate strings of text is the free generation of syntax. But stringing symbols together does not create communication. Language requires a semantic quotient. When we group different strings under equivalence classes of synonyms or definitions (e.g., 'automobile' ≡ 'car'), we partition the free syntactic monoid into semantic meaning.",
      rigor: "Let $\\Sigma$ be a finite alphabet. The free monoid $\\Sigma^*$ consists of all finite strings. A grammar defines a congruence relation $\\sim$ on $\\Sigma^*$ where $u \\sim v$ if they represent the same meaning or semantic evaluation. The quotient monoid $\\Sigma^*/\\sim$ represents the semantic algebra of the language.",
      history: "This matches Gottlob Frege's distinction between *Sinn* (Sense/Syntax) and *Bedeutung* (Reference/Meaning). Frege argued that language freely generates infinite senses, but we quotient them by their real-world references to evaluate truth values.",
      exercises: "1. If two distinct program code strings compile to the exact same binary output, are they equivalent in the syntactic free monoid or the semantic quotient?\n2. Show that if $\\sim$ is a congruence relation on a monoid $M$, then the quotient $M/\\sim$ inherits the monoid structure."
    },
    ja: {
      narrative: "文字と言葉を手に入れることで、人類は無限の表現力を獲得しました。アルファベットを自由に並べて文字列を生成する行為は、構文の「自由生成」です。しかし、文字列をただ並べるだけではコミュニケーションは生まれません。言語には意味論的な「商化」が必要です。異なる文字列を「同義語（シンタックスが違ってもセマンティクスが同じ）」として同じグループに分類するとき、私たちは自由な文字列のモノイドを意味の世界へと商化しているのです。",
      rigor: "有限アルファベット $\\Sigma$ に対し、すべての文字列からなる自由モノイドを $\\Sigma^*$ とします。文法や意味論は $\\Sigma^*$ 上の合同関係（Congruence Relation） $\\sim$ を定義し、同一の意味を表す文字列同士を結びつけます。商モノイド $\\Sigma^*/\\sim$ が、言語の意味代数を表します。",
      history: "これはゴットロープ・フレーゲの「意義（Sinn/構文）」と「意味（Bedeutung/意味論）」の区別に一致します。フレーゲは、言語が無限の意義を自由生成し、それを現実の指示対象によって商化することで真理値を評価すると主張しました。",
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
      narrative: "In logic, we build deductions. We generate sentences using atomic propositions and operators like AND, OR, NOT. This creates an infinite, free tree structure of syntactically valid propositions. However, many different sentences express the same logical truth. To build a mathematical algebra of logic, we must quotient these syntax trees by provable logical equivalence. Through this collapse, logic is transformed into a algebraic structure.",
      rigor: "Let $F(X)$ be the free algebra generated by a set of propositions $X$ under logical connectors. We define the relation $\\phi \\sim \\psi \\iff \\vdash \\phi \\leftrightarrow \\psi$. The quotient algebra $F(X)/\\sim$ is the Lindenbaum-Tarski algebra. For classical logic, this quotient is a Boolean algebra; for intuitionistic logic, it is a Heyting algebra.",
      history: "Developed by Alfred Tarski and Adolf Lindenbaum in the 1930s, this quotient proved that logical deduction is equivalent to algebraic calculation in the quotient space. It represents the ultimate synthesis of syntactic proof and semantic truth.",
      exercises: "1. Show that logical equivalence ($\\sim$) is a congruence relation with respect to the conjunction operator ($\\land$).\n2. Explain why the Lindenbaum-Tarski algebra of a consistent theory has more than one equivalence class."
    },
    ja: {
      narrative: "論理学において、私たちは推論を組み立てます。命題変数と「かつ」「または」「ならば」といった論理演算子を使って論理式を組み立てる行為は、論理構文の「自由生成」です。しかし、一見異なる論理式でも、全く同じ論理的帰結を表すものが無数にあります。論理の代数学を構築するためには、これらの論理式を「証明可能な論理的同値性」によって商化し、折りたたまなければなりません。この崩壊によって、論理は代数的な構造へと変貌するのです。",
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
      narrative: "Long before modern computers or algebra, textile weavers practiced topological gluing. A loom holds vertical warp threads and horizontal weft threads, which are initially independent. But by interlacing them under a specific pattern (over-under-over), we force the threads to bind at grid intersections, quotienting independent threads into a single, continuous sheet of fabric.",
      rigor: "Let $X$ and $Y$ be independent line bundles representing warp and weft threads in $\\mathbb{R}^3$. The grid intersection is a quotient map $\\pi: X \\sqcup Y \\to M$ where overlapping points are identified according to the weaving matrix $W_{ij} \\in \\{0, 1\\}$ (representing warp over weft or vice versa), defining the topological manifold of the fabric sheet.",
      history: "Textile weaving is the oldest technology of continuous quotients. The punch-card system of the Jacquard Loom (1804) directly inspired Charles Babbage's Analytical Engine and Herman Hollerith's tabulating machines, proving that continuous topological quotients laid the path for binary computation.",
      exercises: "1. Explain how a plain weave (alternating over-under) functions as a periodic topological relation.\n2. Prove that the resulting fabric sheet has the topology of a bounded 2D manifold."
    },
    ja: {
      narrative: "現代のコンピュータや代数学が登場するはるか昔、織物職人たちはトポロジー的な接着を実践していました。織機には垂直な「経糸（たていと）」と水平な「緯糸（よこいと）」が張られており、最初は別々に存在しています。しかし、これらを特定のパターン（上・下・上）で交互に交差させることで、格子状の交点で糸同士を結びつけ、独立した糸を1枚の連続した「布（ファブリック）」へと商化します。",
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
      narrative: " Origami transforms flat paper into complex 3D shapes. We start with a flat sheet of paper, which has a simple 2D Euclidean topology. By introducing a crease pattern (valleys and mountains) and folding along these lines, we identify separate points and segments of the paper, quotienting the flat space into a structured 3D object without stretching or tearing.",
      rigor: "Let $P = [0,1]^2$ be the flat unit square in $\\mathbb{R}^2$. A crease pattern is a graph $G$ on $P$. A fold map is a piecewise isometric signature $f: P \\to \\mathbb{R}^3$ that maps regions of the paper to 3D space, imposing the quotient relation $x \\sim y \\iff f(x) = f(y)$ where paper segments touch or overlap in 3D.",
      history: "Folded geometry is found across nature, from leaf buds to insect wings. Modern origami mathematics is used in space engineering to fold solar panels, and in biology to model how proteins fold, showing how flat syntax creates folded 3D semantics.",
      exercises: "1. Why does folding paper without cutting or stretching preserve the metric properties of the paper?\n2. Show that a folded origami crane is a quotient space of the flat square."
    },
    ja: {
      narrative: "折り紙は平らな紙を複雑な3D形状へと変容させます。平らな正方形の紙は、シンプルな2次元ユークリッド空間です。そこに折り目（山折りと谷折り）を刻み、線に沿って折ることで、紙の異なる点や辺同士を重ね合わせ、切ったり伸ばしたりすることなく、平らな空間を構造化された3Dオブジェクトへと商化します。",
      rigor: "単位正方形 $P = [0,1]^2$ を平らな紙とします。折り線パターンをグラフ $G$ とし、紙の領域を3D空間にマッピングする区分的等長写像 $f: P \\to \\mathbb{R}^3$ を定義します。紙の異なる部分が重なり合う関係式 $x \\sim y \\iff f(x) = f(y)$ による商空間として、折り紙の構造が定式化されます。",
      history: "折られた幾何学は、植物の木の葉の芽から昆虫の羽の収納まで、自然界の至る所に見られます。現代の折り紙数学は、宇宙工学における太陽電池パネルの展開や、バイオロジーにおけるタンパク質の折り畳みモデルに応用されています。",
      exercises: "1. 切ったり伸ばしたりせずに紙を折る行為が、なぜ紙の計量的性質（距離など）を保存するのか説明しなさい。\n2. 折られた折り鶴が、元の正方形の商空間であることを示しなさい。"
    }
  },
  9: {
    id: 9,
    nameEn: "Hall IX: Quotient Topology (The Torus)",
    nameJa: "第IX室：商位相（トーラス境界接着）",
    thesisEn: "Free 2D coordinate square $[0,1]^2$ vs. Quotienting boundaries ($x \\sim x+1$, $y \sim y+1$) to glue opposite edges and form a torus.",
    thesisJa: "自由な2次元座標正方形と、対向する辺を接着してトーラスを形成するための境界同値関係による商化。",
    en: {
      narrative: "In geometry, we transition from discrete dots to continuous space. We begin with a flat 2D sheet containing infinite points (free generation). By identifying its boundary points—gluing the top edge to the bottom edge, and then the left edge to the right edge—we fold the sheet into a cylinder, and ultimately a torus (quotienting). Shape is the semantic result of quotienting continuous coordinates.",
      rigor: "Let $X = [0,1] \\times [0,1]$ be the unit square in $\\mathbb{R}^2$ (equipped with the subspace topology). We define the equivalence relation $\\sim$ on $X$ by: $(x, 0) \\sim (x, 1)$ for all $x \\in [0,1]$, and $(0, y) \\sim (1, y)$ for all $y \\in [0,1]$. The quotient space $X/\\sim$ equipped with the quotient topology is homeomorphic to the 2-torus $\\mathbb{T}^2 = S^1 \\times S^1$.",
      history: "Glued spaces appear historically in human weaving, basketry, and origami. Modern general relativity models the universe itself as a quotient space—where the syntax of flat Minkowski spacetime is bent, glued, and curved by the distribution of mass-energy.",
      exercises: "1. If we identify opposite edges of a square but reverse the orientation of one glue line, what non-orientable quotient manifold is generated? (Answer: Klein Bottle or Möbius Strip).\n2. Prove that the quotient map from the square to the torus is continuous."
    },
    ja: {
      narrative: "幾何学において、私たちは離散的な点から連続的な空間へと移行します。まず、無限の点を含む平らな2次元の正方形シートを用意します（自由生成）。そのシートの境界点同士を接着（上部と下部、次に左側と右側を同一視）することにより、円柱、そして最終的にはトーラス（ドーナツ型）へと折りたたみます（商化）。幾何学的な「図形」とは、連続的な座標を商化することによって生まれる意味論的結果なのです。",
      rigor: "単位正方形 $X = [0,1] \\times [0,1] \\subset \\mathbb{R}^2$ に対し、同値関係 $(x, 0) \\sim (x, 1)$ および $(0, y) \\sim (1, y)$ を定義します。この同値関係から得られる商位相空間 $X/\\sim$ は、2次元トーラス $\\mathbb{T}^2 = S^1 \\times S^1$ と同相（Homeomorphic）になります。",
      history: "接着された空間は、歴史的に機織り、籠編み、そして折り紙などの技術に現れます。現代の一般相対性理論は、宇宙そのものを商空間としてモデル化します。質量分布の「関係式」によって、平坦な時空の構文が曲げられ、接着されているのです。",
      exercises: "1. 正方形の対向する辺を、片方の向きを反転させて接着したときに生成される向き付け不可能な商多様体は何ですか？（答え：クラインの壺、またはメビウスの帯）\n2. 正方形からトーラスへの商写像が連続写像であることを証明しなさい。"
    }
  },
  10: {
    id: 10,
    nameEn: "Hall X: Projective Geometry",
    nameJa: "第X室：射影幾何学（実射影平面）",
    thesisEn: "Free points on a sphere $S^n$ vs. Quotienting by antipodal identification ($x \sim -x$) to create the projective plane $\mathbb{RP}^n$.",
    thesisJa: "球面上の自由点と、実射影平面を生成するための対蹠点同一視（$x \\sim -x$）による商化。",
    en: {
      narrative: "Projective geometry is the geometry of sight and perspective. Consider a sphere in 3D space. If we declare that opposite points (antipodal points) are mathematically identical, we project the sphere into a new non-orientable topological space: the Real Projective Plane. By quotienting out the direction of lines through the origin, we construct the foundation of projective space.",
      rigor: "Let $S^n = \\{x \\in \\mathbb{R}^{n+1} \\mid \\|x\\| = 1\\}$ be the $n$-sphere. We define the equivalence relation $\\sim$ by $x \\sim y \\iff x = y$ or $x = -y$ (antipodal identification). The quotient space $\\mathbb{RP}^n = S^n / \\sim$ is the real projective space, which is a compact, smooth manifold of dimension $n$.",
      history: "Born in the Renaissance when artists like Brunelleschi and Alberti formalized perspective drawing. Projective space proved that parallel lines 'meet' at infinity by quotienting out Euclidean parallel constraints.",
      exercises: "1. Why is the Mobius strip a subspace of the real projective plane $\\mathbb{RP}^2$?\n2. Prove that the antipodal quotient map $q: S^n \\to \\mathbb{RP}^n$ is a two-to-one local diffeomorphism."
    },
    ja: {
      narrative: "射影幾何学は、遠近法と視野の幾何学です。3次元空間の球面を考えます。球面上にある、互いに正反対の位置にある点（対蹠点）同士を「完全に同じ点」として接着すると、実射影平面という新しいトポロジー空間が生まれます。原点を通る直線の方向性を「商化」して抽出することで、射影幾何学の基礎が構築されます。",
      rigor: "$n$次元球面 $S^n \\subset \\mathbb{R}^{n+1}$ に対し、同値関係 $x \\sim y \\iff x = y$ または $x = -y$ を定義します。商空間 $\\mathbb{RP}^n = S^n / \\sim$ が実射影空間であり、これはコンパクトな $n$次元滑らかな多様体です。",
      history: "ルネサンス期にブルネレスキやアルベルティが透視図法を定式化したことに始まります。射影空間は、並行な直線が無限遠点で交わることを示し、ユークリッドの平行線公理の制約を商化によって乗り越えました。",
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
      narrative: "How do we measure holes in spaces? We draw loops. On a space, we can trace infinitely many different closed loops starting and ending at a basepoint. This is the free generation of loops. If we quotient these loops by continuous deformation (declaring two loops equivalent if they can be warped into each other without crossing a hole), we obtain a discrete group that measures the space's topology: the Fundamental Group.",
      rigor: "Let $X$ be a topological space and $x_0 \\in X$ a basepoint. Let $\\Omega(X, x_0)$ be the set of continuous loops $\\gamma: [0,1] \\to X$ with $\\gamma(0)=\\gamma(1)=x_0$. We define $\\gamma_0 \\sim \\gamma_1$ if there exists a continuous homotopy $H: [0,1]\\times[0,1] \\to X$ between them. The quotient set $\\pi_1(X, x_0) = \\Omega(X, x_0)/\\sim$ with path concatenation forms the Fundamental Group.",
      history: "Henri Poincaré introduced path homotopy in his groundbreaking paper *Analysis Situs* (1895), creating algebraic topology. It showed that we can understand continuous shapes through discrete algebraic quotient structures.",
      exercises: "1. Why is the fundamental group of a simple disk trivial (consisting of only one element)?\n2. Show that path concatenation is compatible with homotopy equivalence, making group multiplication well-defined."
    },
    ja: {
      narrative: "空間に開いた「穴」をどうやって測定するでしょうか？私たちはループを描きます。ある空間の上で、基準点から出発して戻ってくるループは無限に描くことができます。これはループの「自由生成」です。これらのループを「連続的な変形（穴をまたぐことなく一方を他方に変形できるなら同値）」によって商化すると、空間の穴をカウントする離散的な群「基本群」が得られます。",
      rigor: "位相空間 $X$ と基準点 $x_0 \\in X$ に対し、連続ループ全体の集合を $\\Omega(X, x_0)$ とします。連続変形ホモトピーの存在による同値関係 $\\gamma_0 \\sim \\gamma_1$ を定義します。商集合 $\\pi_1(X, x_0) = \\Omega(X, x_0)/\\sim$ は、パスの結合演算に関して基本群（Fundamental Group）を構成します。",
      history: "アンリ・ポアンカレが1895年の記念碑的論文『位置の解析（Analysis Situs）』で導入し、代数的位相幾何学を創始しました。連続的な幾何学図形を、離散的な代数の商構造によって記述できることを示しました。",
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
      narrative: "Einstein revolutionized gravity by geometry. Initially, special relativity defines a flat, rigid Minkowski spacetime coordinate system (free coordinates). General relativity asserts that the presence of matter and energy curves this coordinate grid. The physical universe is formed by quotienting the coordinate space, gluing and warping sheets of spacetime according to mass-energy equations.",
      rigor: "Spacetime is modeled as a smooth 4D Lorentzian manifold $M$. The metric tensor $g_{\\mu\\nu}$ is determined dynamically by the Einstein Field Equations: $R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$, quotienting the space of possible metrics by diffeomorphism equivalence under coordinate charts.",
      history: "Albert Einstein presented General Relativity in 1915. It unified space, time, and gravity, proving that gravity is not a pull force, but the natural curved geodesic path in a quotiented, glued spacetime manifold.",
      exercises: "1. Explain the phrase: 'Matter tells spacetime how to curve; spacetime tells matter how to move' in terms of generators and relations.\n2. Why are coordinate systems in general relativity regarded as gauge syntax that must be quotiented out by diffeomorphism?"
    },
    ja: {
      narrative: "アインシュタインは幾何学によって重力に革命を起こしました。特殊相対論は、平坦で硬いミンコフスキー時空座標を定義します。しかし一般相対論は、物質とエネルギーの存在がこの座標グリッドを歪めると主張します。質量やエネルギーの方程式（関係式）によって、時空のシートが曲げられ、接着されることで、私たちが観測する物理的な宇宙（商空間）が形作られているのです。",
      rigor: "時空は4次元の滑らかなローレンツ多様体 $M$ としてモデル化されます。計量テンソル $g_{\\mu\\nu}$ はアインシュタイン方程式 $R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$ によって決定され、可能な計量の空間を座標近傍間の微分同相写像同値によって商化します。",
      history: "1915年にアルベルト・アインシュタインによって発表されました。重力とは引っ張る力ではなく、質量とエネルギーの関係式によって商化され、歪んだ時空を物体がまっすぐ進もうとする測地線経路そのものであると証明しました。",
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
      narrative: "Lambda calculus is the foundational syntax of computation. We write functions and variables as raw text terms (free syntax). But functions are meant to be executed. To run a program, we substitute arguments into function variables—applying beta-reduction. Computation is the quotient process that collapses raw lambda terms into equivalent evaluated values.",
      rigor: "Let $\\Lambda$ be the set of lambda terms generated by variables, abstractions ($\\lambda x. M$), and applications ($M N$). We define the equivalence relation $\\sim_{\\beta\\eta}$ generated by $\\beta$-reduction ($(\\lambda x. M)N \\to M[x \\coloneqq N]$) and $\\eta$-conversion. The quotient algebra $\\Lambda/\\sim_{\\beta\\eta}$ represents the space of computed values.",
      history: "Invented by Alonzo Church in the 1930s to study the limits of mathematics. It became the theoretical bedrock of functional programming languages like Lisp, Haskell, and Scheme, where execution is formal syntax reduction.",
      exercises: "1. Evaluate the lambda term $(\\lambda x. x \\ x) (\\lambda y. y)$ and find its normal form.\n2. Prove that beta-equivalence satisfies the properties of an equivalence relation."
    },
    ja: {
      narrative: "ラムダ計算は、計算の基礎となる最もシンプルな構文体系です。私たちは関数と変数からなる文字列の式を書きます（自由構文）。しかし、関数は「実行」されるためにあります。関数に変数を代入し、式を「β簡約」によって縮小（Collapse）していくプロセスこそが、生の構文項を計算結果という同値類へ「商化」する行為なのです。",
      rigor: "変数、ラムダ抽象（$\\lambda x. M$）、および関数適用（$M N$）から生成される項の集合を $\\Lambda$ とします。$\\beta$簡約の規則 $(\\lambda x. M)N \\to M[x \\coloneqq N]$ に基づく同値関係 $\\sim$ を定義します。商集合 $\\Lambda/\\sim$ が、評価された「計算結果」の空間を表します。",
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
      rigor: "Let $T$ be the algebraic theory of arithmetic. The free algebra $F(X)$ represents all arithmetic syntax trees. The evaluation is a homomorphism $eval: F(X) \\to \\mathbb{Z}$ that quotients the terms by the computational rewrite relations (e.g., $x + y \\sim z$). The final value is the equivalence class of the tree under computation.",
      history: "This is the foundation of Alonzo Church's $\\lambda$-calculus, where terms are freely generated and then quotiented by $\\beta$-reduction equivalence. It proves that software execution is literally the mathematical quotienting of syntax.",
      exercises: "1. Walk through the AST evaluation steps of $(2 * 3) + (10 / 2)$ and identify the relations applied at each collapse.\n2. Prove that evaluation is a homomorphic mapping from the tree algebra to the integer algebra."
    },
    ja: {
      narrative: "コンピュータサイエンスにおいて、プログラムを書くことは「抽象構文木（AST）」を自由生成することです。コンパイラは生のテキストを、実行することなく、入れ子状の演算子とリテラルへと構造化します。コードを実行することは、この構文木を折りたたむ（Collapse）ことに他なりません。CPUは二項演算を再帰的に適用し、$3 + 5$ を $8$ へと折りたたみ、最終的に木全体を１つの値へと商化させます。計算とは、構文の代数的な崩壊そのものなのです。",
      rigor: "算術の代数理論を $T$ とします。自由代数 $F(X)$ はすべての算術構文木を表します。評価（Evaluation）は、計算の書き換え規則（例：$x + y \\sim z$）によって項を商化する準同型写像 $eval: F(X) \\to \\mathbb{Z}$ です。最終的な出力値は、計算関係の下での構文木の同値類です。",
      history: "これはアロンゾ・チャーチの $\\lambda$ 算術の基礎であり、項は自由生成された後、$\\beta$ 簡約の同値関係によって商化されます。ソフトウェアの実行とは、文字通り構文を数学的に商化することであると証明されています。",
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
      narrative: "Databases manage structured information. An SQL query is a text string generated freely from keywords (SELECT, JOIN, WHERE). Running a query means collapsing the Cartesian product of tables. By applying join conditions and filter relations, we collapse huge multi-dimensional spaces of raw tuples into a specific quotient table.",
      rigor: "Let $R$ and $S$ be tables (sets of tuples). The Cartesian product $R \\times S$ is the free combination of all records. A join query imposing a relation $R.id = S.id$ constructs a quotient subset, filtering and grouping records under key equivalence classes.",
      history: "Edgar F. Codd introduced the Relational Model in 1970. It structured data using mathematical relation theory instead of nested pointer loops, proving that querying is the algebraic reduction of sets.",
      exercises: "1. Explain how a GROUP BY query acts as a quotient relation on database records.\n2. Prove that the relational selection operator commutes with projection under suitable conditions."
    },
    ja: {
      narrative: "データベースは情報を管理・抽出する仕組みです。SQLクエリは、SELECTやJOINなどのキーワードを並べた「自由な構文（文字列）」です。クエリを実行することは、複数のテーブルの「直積（すべての組み合わせ）」を計算し、JOIN条件やフィルタ条件という「関係式」によって縮小させ、必要な結果テーブルへと「商化」することです。",
      rigor: "テーブル $R$ と $S$ に対し、すべてのレコードの組み合わせである直積 $R \\times S$ を作成します。結合条件 $R.id = S.id$ は、主キーと同値なレコードのみを選択・統合する関係式であり、結果を同値類へと商化する操作です。",
      history: "エドガー・F・コッドが1970年に関係モデル（Relational Model）を発表しました。複雑なポインタ構造を排し、純粋な関係代数（商構造の応用）としてデータベースを再構築したことで、現代の情報インフラが完成しました。",
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
      narrative: "Regular expressions match string patterns. We generate regular expressions freely using characters, wildcards, and stars. To execute them efficiently, compilers translate them into State Machines (DFAs). The infinite space of matching string paths is quotiented into a finite set of equivalence states.",
      rigor: "Given a regular language $L \\subseteq \\Sigma^*$, the Myhill-Nerode theorem defines the equivalence relation $\\sim_L$ on strings by: $x \\sim_L y \\iff \\forall z \\in \\Sigma^*, (xz \\in L \\iff yz \\in L)$. The minimal DFA state space is the quotient monoid $\\Sigma^*/\\sim_L$.",
      history: "Developed by Stephen Kleene and formalized by John Myhill and Anil Nerode in the 1950s, this quotient proved that regular languages are defined by finite quotient spaces of strings.",
      exercises: "1. How does DFA minimization represent quotienting of states?\n2. Compute the equivalence classes of the language of strings containing an even number of '1's."
    },
    ja: {
      narrative: "正規表現は文字列のパターンを判定します。私たちは記号やワイルドカード、スターを使って正規表現を自由に生成します。これを判定する際、コンピュータはそれを有限オートマトン（DFA）へと変換します。文字列の照合経路を、遷移状態という有限個の「状態同値類」へと折りたたむ（商化する）のです。",
      rigor: "正規言語 $L \\subseteq \\Sigma^*$ に対し、マイヒル・ネローデの同値関係 $x \\sim_L y \\iff \\forall z \\in \\Sigma^*, (xz \\in L \\iff yz \\in L)$ を定義します。この関係式による商モノイド $\\Sigma^*/\\sim_L$ の元が、最小化DFAの状態そのものになります。",
      history: "1950年代にスティーヴン・クリーニやジョン・マイヒル、アニル・ネローデらによって確立されました。任意の正規言語は、文字列の集合を特定の商関係で折りたたむことで、有限状態の機械として実装できることを示しました。",
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
      narrative: "In modern computer science, types are propositions and programs are proofs. A programmer writes computer code (terms) freely under a type system. Two programs may represent different instructions but perform the same proof or logic. We quotient these programs by proof equivalence, ensuring that execution collapses syntax into identical verified logic.",
      rigor: "The Curry-Howard isomorphism establishes a dictionary between Logic and Type Theory. Propositions correspond to Types, and Proofs correspond to Terms. Proof normalization (beta/eta reduction) defines an equivalence relation $\\sim$ on terms. The quotient is the set of equivalence proofs of a theorem.",
      history: "Discovered by Haskell Curry and William Alvin Howard. It bridged the gap between logic and programming, laying the foundation for modern theorem provers like Coq, Lean, and Agda.",
      exercises: "1. If a type represents a logical proposition, what does a program of that type represent?\n2. Show how beta-reduction on lambda terms corresponds to proof simplification."
    },
    ja: {
      narrative: "現代のコンピュータサイエンスでは、「型は命題であり、プログラムは証明である」と捉えられます（カリー・ハワード同型対応）。プログラムを記述する行為は、ある型（命題）を満たすプログラムコード（証明）の「自由生成」です。複数の異なるプログラムコードが、論理的に全く同一の証明を実行するとき、これらを「証明同値性」で商化します。",
      rigor: "カリー・ハワード同型（Curry-Howard isomorphism）は論理学と型理論の対応を定義します。証明項の簡約（β/η変換）による項の同値関係 $\\sim$ を導入し、商集合 $T/\\sim$ はある命題の「正規化された証明」を表します。",
      history: "ハスケル・カリーとウィリアム・アルヴィン・ハワードによって発見されました。論理とプログラムを統合し、現代の証明支援言語（Lean, Coq, Agdaなど）を誕生させる基礎となりました。",
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
      narrative: "Homotopy Type Theory (HoTT) is the modern cutting-edge foundation of mathematics. It defines identity not as a rigid binary logic, but as a continuous space of paths. When we want to state that two types are equal, we show a path (equivalence) between them. Through the Univalence Axiom, we quotient types by structural equivalence—declaring that isomorphic structures are identical.",
      rigor: "Let $A, B$ be types. The identity type $\\text{Id}(A, B)$ is the space of equivalences $A \\simeq B$. The Univalence Axiom asserts that the natural map $\\text{Id}(A, B) \\to (A \\simeq B)$ is itself an equivalence of types, effectively quotienting the universe of types by equivalence classes.",
      history: "Developed by Vladimir Voevodsky in the 2000s, HoTT merged homotopy topology and computer type theory. It provides a computer-verifiable foundation where isomorphic math objects are treated as equal.",
      exercises: "1. What is the difference between judgmental equality and identity types in HoTT?\n2. Explain why the Univalence Axiom justifies the informal mathematical practice of saying 'isomorphic groups are equal'."
    },
    ja: {
      narrative: "ホモトピー型理論（HoTT）は、現代数学の最先端の基礎論です。ここでは、対象の「同一性（イコール）」を単なる二値論理ではなく、対象間の「連続的なパス（経路）」の空間として定義します。2つの型が等しいと示すことは、その間の同値写像というパスを示すことです。一価性公理（Univalence Axiom）を通じて、私たちは型を同型関係によって商化し、「同型な構造は同一である」と宣言します。",
      rigor: "型 $A, B$ に対し、同一性型 $\\text{Id}(A, B)$ は同値写像の空間 $A \\simeq B$ と同値になります（一価性公理）。これにより、すべての型の宇宙を「同型同値関係」で商化し、同じ構造を持つ数学的対象を完全に同一視できます。",
      history: "2000年代にフィールズ賞受賞者のウラジーミル・ヴォエヴォドスキーらによって開発されました。トポロジー（ホモトピー）とコンピュータの型理論を融合し、「同型ならイコール」として扱える、コンピュータが検証可能な新時代の数学の土台です。",
      exercises: "1. HoTTにおいて、「判断の等価性（Judgmental Equality）」と「同一性型（Identity Types）」の違いは何ですか？\n2. 一価性公理が、数学者が普段「同型な群は等しいとみなす」とカジュアルに言っている行為をどのように数学的に正当化するか説明しなさい。"
    }
  },
  19: {
    id: 19,
    nameEn: "Hall XIX: The Category of Sets (Set)",
    nameJa: "第XIX室：集合の圏",
    thesisEn: "The state of nature—raw elements and functions without algebraic operations.",
    thesisJa: "代数演算を持たない、生の要素と写像（関数）からなる自然状態としての圏。",
    en: {
      narrative: "We now enter formal Category Theory. The Category of Sets (denoted as $\\mathcal{S}et$) represents the mathematical state of nature: a universe of isolated, unstructured points and simple functions (mappings) between them. Here, there are no algebraic operations, no multiplication, and no paths. It is the realm of pure, unconstrained generators—the raw input material of mathematics.",
      rigor: "The category $Set$ has sets as objects and functions as morphisms. Composition of morphisms is the standard composition of functions, which is associative, and for every set $X$ there exists an identity function $id_X$. Set represents the primordial category from which we forget algebraic structure.",
      history: "Developed by Georg Cantor in the late 19th century, Set Theory was designed to formalize the absolute foundation of all mathematical objects. Category theory frames it as the base category $\\mathcal{C}$ before any structured universal functors are applied.",
      exercises: "1. Why do we say Set has no algebraic structure?\n2. Show that function composition in Set is associative."
    },
    ja: {
      narrative: "ここから本格的な圏論に入ります。集合の圏（$\\mathcal{S}et$）は、数学における「自然状態」を表しています。そこにあるのは、互いにつながりのない、構造を持たない個々の「点（要素）」と、それらの間の単純な写像（関数）だけです。代数演算も、掛け算も、経路も存在しません。純粋な『生の生成元』が集まる、数学における最も自由で制約のない空間です。",
      rigor: "圏 $Set$ は集合を対象（Objects）とし、写像を射（Morphisms）とする、代数的構造を取り去った「原初」の圏です。射の合成は写像の通常の合成であり、結合法則を満たし、すべての集合 $X$ に対して恒等写像 $id_X$ が存在します。",
      history: "19世紀後半にゲオルク・カントールによって開発された集合論は、すべての数学的対象の基礎を定式化するために設計されました。圏論では、これを構造化関手が適用される前の基本の圏として位置づけます。",
      exercises: "1. なぜ「集合の圏には代数的構造がない」と言われるのですか？\n2. 集合の圏における関数の合成が結合法則を満たすことを示しなさい。"
    }
  },
  20: {
    id: 20,
    nameEn: "Hall XX: The Category of Monoids (Mon)",
    nameJa: "第XX室：モノイドの圏",
    thesisEn: "Structured algebra—sets with associative binary multiplications.",
    thesisJa: "結合的な二項演算（積）を備えた、構造化された代数対象としての圏。",
    en: {
      narrative: "In contrast to sets, we introduce algebra. A Monoid is a set equipped with a binary multiplication operation that is associative and has an identity element. In the Category of Monoids ($Mon$), every object possesses internal structured relationships—elements can be multiplied together to form new elements. It is the structured destination of syntax collapse.",
      rigor: "A Monoid $M = (S, \\cdot, e)$ is a set $S$ with binary operation $\\cdot: S \\times S \\to S$ satisfying $(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$ and $e \\cdot a = a \\cdot e = a$. Category $Mon$ has monoids as objects and monoid homomorphisms (functions preserving multiplication and identity) as morphisms.",
      history: "Monoids capture the algebraic structure of strings, transformations, and paths. They represent the simplest category where elements are bound by relations, serving as the archetype of structured mathematical spaces.",
      exercises: "1. Why is the set of strings $\\Sigma^*$ under concatenation a monoid? What is the identity?\n2. Prove that the composition of two monoid homomorphisms is also a monoid homomorphism."
    },
    ja: {
      narrative: "何もない集合に対し、代数構造を導入します。「モノイド」とは、結合法則を満たし、単位元を持つ二項演算を備えた集合です。モノイドの圏（$Mon$）では、すべての対象が内部的な掛け算の「関係式」を持っており、要素同士を掛け合わせて新しい要素を作ることができます。これが、構文が折りたたまれる「構造化された代数」の世界です。",
      rigor: "モノイド $M = (S, \\cdot, e)$ は、結合律 $(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$ と単位元律 $e \\cdot a = a \\cdot e = a$ を満たす演算を持つ集合です。圏 $Mon$ はモノイドを対象とし、モノイドの演算と単位元を保存する写像（モノイド準同型）を射とします。",
      history: "モノイドは、文字列の結合、状態の変換、経路の合成など、代数構造の最小ユニットです。関係式によって要素が結びついている最もシンプルな代数系のモデルです。",
      exercises: "1. 文字列全体の集合が、結合演算（Concatenation）に関してモノイドを構成することを示しなさい。その単位元は何ですか？\n2. 2つのモノイド準同型写像の合成もまたモノイド準同型写像になることを証明しなさい。"
    }
  },
  21: {
    id: 21,
    nameEn: "Hall XXI: Functorial Bridges (F and U)",
    nameJa: "第XXI室：関手の架け橋（FとU）",
    thesisEn: "Free Functor $F$ (creating syntax) and Forgetful Functor $U$ (stripping rules).",
    thesisJa: "構文を生成する自由関手 $F$ と、規則を取り除く忘却関手 $U$ による圏の接続。",
    en: {
      narrative: "How do sets and monoids talk to each other? We build Functors—bridges between categories. The Free Functor $F$ takes a unstructured set and generates the free monoid of all possible strings (Syntax). The Forgetful Functor $U$ takes a structured monoid and forgets its multiplication, stripping the rules to return a plain set. These two functors create a dynamic dialogue between syntax and semantics.",
      rigor: "The Free Functor $F: Set \\to Mon$ maps a set $X$ to the free monoid $F(X) = X^*$ of strings. The Forgetful Functor $U: Mon \\to Set$ maps a monoid $M=(S, \\cdot, e)$ to its underlying set $S$. Functors must preserve identity morphisms and morphism composition: $F(id_X) = id_{F(X)}$ and $F(g \\circ f) = F(g) \\circ F(f)$.",
      history: "Universal algebra and functor theory were formalizations of the 20th century. Saunders Mac Lane and Samuel Eilenberg defined Functors in 1945 to study transitions between mathematical universes, showing that structures are connected by formal functors.",
      exercises: "1. What is the image of a 2-element set $X = \\{a, b\\}$ under the free functor $F$?\n2. Why is the forgetful functor $U$ not an isomorphism of categories?"
    },
    ja: {
      narrative: "集合の世界とモノイドの世界はどうやって対話するでしょうか？私たちは圏と圏を結ぶ架け橋「関手（Functor）」を定義します。「自由関手 $F$」は、構造のない生の集合を受け取り、すべての文字列の自由モノイド（構文）を生成します。「忘却関手 $U$」は、演算を持つモノイドを受け取り、掛け算の規則を忘れて生の集合に戻します。この2つの関手が、構文と意味論のダイアログを生み出すのです。",
      rigor: "自由関手 $F: Set \\to Mon$ は集合 $X$ を自由モノイド $F(X) = X^*$ （文字列）へ送ります。忘却関手 $U: Mon \\to Set$ はモノイド $M=(S, \\cdot, e)$ をその台集合 $S$ へと送ります。関手は恒等射および射の合成を保存しなければなりません：$F(id) = id$, $F(g \\circ f) = F(g) \\circ F(f)$。",
      history: "普遍代数と関手理論は、20世紀に定式化されました。1945年にサウンダーズ・マックレーンとサミュエル・アイレンバーグが、異なる数学の世界の間の移行を研究するために関手を定義し、数学的体系の接続性を明示しました。",
      exercises: "1. 2つの要素の集合 $X = \\{a, b\\}$ を自由関手 $F$ で送ったときに得られるモノイドの元をいくつか書き出しなさい。\n2. なぜ忘却関手 $U$ は「圏の同型」を与えないのですか？"
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
      rigor: "The bijection $\\Phi: \\text{hom}_{Mon}(F(X), M) \\cong \\text{hom}_{Set}(X, U(M))$ is natural in both $X$ and $M$. For any set map $f: X \\to U(M)$, there exists a unique monoid homomorphism $\\bar{f}: F(X) \\to M$ such that $\\bar{f} \\circ \\eta_X = f$, where $\\eta_X: X \\to U(F(X))$ is the unit of the adjunction (the inclusion of generators).",
      history: "Adjunctions were discovered by Daniel Kan in 1958. Saunders Mac Lane famously summarized the unity of mathematics under this duality: \"Adjoint functors arise everywhere.\" It proves that the tension between syntax (F) and semantics (U) is in perfect, symmetric balance.",
      exercises: "1. Explain the role of the unit $\\eta_X$ in the adjunction.\n2. Prove that if $\\bar{f}$ and $\\bar{g}$ are monoid homomorphisms out of a free monoid $F(X)$ that agree on the generators $X$, then $\\bar{f} = \\bar{g}$."
    },
    ja: {
      narrative: "本展示のクライマックスは、随伴双対性（$F \\dashv U$）です。これは写像空間の間の自然同型 $\\text{hom}(F(X), M) \\cong \\text{hom}(X, U(M))$ を確立します。これは私たちの核心的テーゼの数学的証明です。「自由生成された構造からの準同型写像（商の評価）」を定義することは、単に「生の生成元をどこに送るかを選ぶこと」と完全に同一であると述べています。商の評価は、生成元の挙動だけで一意に決定されるのです。",
      rigor: "全単射 $\\Phi: \\text{hom}_{Mon}(F(X), M) \\cong \\text{hom}_{Set}(X, U(M))$ は $X$ と $M$ に関して自然（Natural）です。任意の写像 $f: X \\to U(M)$ に対し、$\\bar{f} \\circ \\eta_X = f$ を満たす一意のモノイド準同型写像 $\\bar{f}: F(X) \\to M$ が存在します（$\\eta_X: X \\to U(F(X))$ は随伴の単位元、すなわち生成元の埋め込みです）。",
      history: "随伴は1958年にダニエル・カンによって発見されました。ソーンダース・マックレーンは、この双対性の下での数学の統一性を「随伴関手は至る所に現れる」という有名な言葉でまとめました。構文（F）と意味論（U）の間の緊張関係が、完璧に対称的なバランスにあることを証明しています。",
      exercises: "1. 随伴における単位元 $\\eta_X$ の役割を説明しなさい。\n2. 自由モノイド $F(X)$ からのモノイド準同型 $\\bar{f}, \\bar{g}$ が、生成元 $X$ 上で一致するならば、$\\bar{f} = \\bar{g}$ であることを証明しなさい。"
    }
  },
  23: {
    id: 23,
    nameEn: "Hall XXIII: The Unit (η) and Counit (ε)",
    nameJa: "第XXIII室：単位（η）と余単位（ε）",
    thesisEn: "Unit $\\eta$ (generator inclusion) and Counit $\\varepsilon$ (algebraic evaluation collapse).",
    thesisJa: "単位 $\\eta$ （生成元の包含）と、余単位 $\\varepsilon$ （代数的な評価の崩壊・商化）。",
    en: {
      narrative: "Adjunctions operate through two fundamental maps: the Unit ($\\eta$) and the Counit ($\\varepsilon$). The Unit $\\eta$ maps the raw generators into the free algebraic structure (inclusion of syntax). The Counit $\\varepsilon$ evaluates the structured terms, collapsing the free terms back into algebraic values (quotient collapse). They represent inclusion and collapse, the basic inhalation and exhalation of mathematical logic.",
      rigor: "The Unit $\\eta: I_{Set} \\Rightarrow UF$ is a natural transformation representing the inclusion of generators. The Counit $\\varepsilon: FU \\Rightarrow I_{Mon}$ is a natural transformation representing the evaluation map. They satisfy the triangle identities: $U(\\varepsilon_M) \\circ \\eta_{U(M)} = id_{U(M)}$ and $\\varepsilon_{F(X)} \\circ F(\\eta_X) = id_{F(X)}$.",
      history: "The unit and counit define the bidirectional flow of adjunctions. Triangle identities prove that if you generate structure and then collapse it immediately, or vice versa, you can return to the starting object, showing a perfect loop of algebraic syntax.",
      exercises: "1. Show how the Counit $\\varepsilon$ acts as the evaluation map on a free monoid $F(U(M))$.\n2. Write down the triangle identities diagrammatically."
    },
    ja: {
      narrative: "随伴は、「単位（$\\eta$）」と「余単位（$\\varepsilon$）」という2つの射を通じて機能します。単位 $\\eta$ は、生の生成元を自由代数構造の中へと埋め込みます（構文の包摂）。余単位 $\\varepsilon$ は、構造化された項を評価し、自由な項を元の代数値へと折りたたみます（代数的な商化・崩壊）。これらは包摂と崩壊であり、数学の吸気と呼気です。",
      rigor: "単位 $\\eta: I_{Set} \\Rightarrow UF$ は生成元の包含を表す自然変換です。余単位 $\\varepsilon: FU \\Rightarrow I_{Mon}$ は代数的な評価（準同型拡張の適用）を表す自然変換です。これらは三角恒等式（Triangle identities） $U(\\varepsilon) \\circ \\eta_U = id$ および $\\varepsilon_F \\circ F(\\eta) = id$ を満たします。",
      history: "随伴の双方向の情報の流れを記述します。三角恒等式は、「自由生成した直後に評価崩壊させる」あるいは「台集合に落とした直後に包含させる」という操作が、完全に整合して元の対象に戻る美しい論理のループを証明しています。",
      exercises: "1. 余単位 $\\varepsilon$ が、自由モノイド $F(U(M))$ 上の評価写像（積の計算）としてどのように機能するか説明しなさい。\n2. 三角恒等式を可換図式として描きなさい。"
    }
  },
  24: {
    id: 24,
    nameEn: "Hall XXIV: Monads & Eilenberg-Moore Algebras",
    nameJa: "第XXIV室：モナドとアイレンバーグ・ムーア代数",
    thesisEn: "The monad composite $T = UF$ and monadic quotient algebras.",
    thesisJa: "随伴の合成としてのモナド $T = UF$ と、モナド的商代数の構成。",
    en: {
      narrative: "When we compose the Free Functor $F$ and the Forgetful Functor $U$, we get a Monad $T = UF$. A Monad is an algebraic machine in the category of Sets that generates terms and flattens nested structures ($T^2 \\to T$). The Eilenberg-Moore algebras prove that any structured mathematical category is equivalent to a category of sets quotiented by monad equations.",
      rigor: "A Monad $(T, \\eta, \\mu)$ on Category $\\mathcal{C}$ is an endofunctor $T: \\mathcal{C} \\to \\mathcal{C}$ with natural transformations $\\eta: I \\Rightarrow T$ (unit) and $\\mu: T^2 \\Rightarrow T$ (multiplication/flattening) satisfying associativity and unit laws. An algebra for $T$ is a map $h: T(X) \\to X$ representing a quotient collapse compatible with $\\mu$.",
      history: "Monads were defined by Roger Godement in 1958. In computer science, Eugenio Moggi (1991) introduced monads to model computational effects, transforming input syntax into state, input/output, or exceptions, which is now a staple of functional languages like Haskell.",
      exercises: "1. Explain how the list monad in Haskell represents free generation (lists of lists) and flattening (concat).\n2. Show that any adjunction $F \\dashv U$ induces a monad $T = UF$."
    },
    ja: {
      narrative: "自由関手 $F$ と忘却関手 $U$ を合成すると、「モナド $T = UF$」が得られます。モナドとは、集合の圏において、構文を生成し、二重に入れ子になった構造を平坦化（Flattening: $T^2 \\to T$）する代数機械です。アイレンバーグ・ムーア代数は、すべての構造化された代数圏が、モナドによる「商化」によって完全に再現できることを証明します。",
      rigor: "圏 $\\mathcal{C}$ 上のモナド $(T, \\eta, \\mu)$ は、自己関手 $T: \\mathcal{C} \\to \\mathcal{C}$ と、単位元 $\\eta$、および平坦化を担う結合律を満たす自然変換 $\\mu: T^2 \\Rightarrow T$ の組です。モナドの代数とは、評価崩壊を表す射 $h: T(X) \\to X$ のことです。",
      history: "1958年にロジェ・ゴデマンによって定義されました。コンピュータサイエンスでは、オイゲニオ・モッジ（1991年）が計算の副作用（状態遷移、入出力、例外など）をモデル化するために導入し、現在ではHaskellなどの言語で不可欠な記述スタイルとなっています。",
      exercises: "1. Haskellにおけるリストモナドが、どのように自由生成（リストのリスト）と平坦化（`concat`）を表現しているか説明しなさい。\n2. 任意の随伴 $F \\dashv U$ がモナド $T = UF$ を誘起することを証明しなさい。"
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
      narrative: "We conclude with the most profound theorem in Category Theory: the Yoneda Lemma. In our core philosophy, we have seen how elements generate and relations quotient. The Yoneda Lemma takes this to the extreme: an object in a category has no intrinsic substance. Its entire identity, structure, and existence is completely and uniquely determined by observing its relationship to all other objects. Relationship is existence itself.",
      rigor: "Let $\\mathcal{C}$ be a locally small category, and let $A$ be an object in $\\mathcal{C}$. The representable functor $h_A = \\text{Hom}(A, -): \\mathcal{C} \\to Set$ maps each object $Y$ to the set of morphisms $\\text{Hom}(A, Y)$. The Yoneda Lemma asserts that for any functor $X: \\mathcal{C} \\to Set$, there is a natural bijection:\n  $$\\text{Nat}(h_A, X) \\cong X(A)$$\n  This isomorphism maps a natural transformation $\\alpha: h_A \\Rightarrow X$ to the element $\\alpha_A(1_A) \\in X(A)$. The Yoneda Embedding $A \\mapsto h_A$ is fully faithful.",
      history: "Named after Nobuo Yoneda, who explained it to Saunders Mac Lane at a Paris train station in 1954. Philosophically, it echoes structuralism: nothing exists in isolation. An entity is defined entirely by the network of arrows connecting it to the universe.",
      exercises: "1. If two objects $A$ and $B$ have isomorphic representable functors $h_A \\cong h_B$, prove that $A$ and $B$ are isomorphic objects in the category.\n2. Explain the physical/philosophical meaning of the equation $\\text{Nat}(h_A, X) \\cong X(A)$."
    },
    ja: {
      narrative: "ツアーの終着点として、圏論で最も深遠な定理「米田の補題」を提示します。存在とは孤立した実体ではなく、関係性の総和である。米田の補題はこの存在論を極限まで押し進めます。圏の中の対象は、それ自身の内部構造を直接覗かなくても、他のすべての対象との関係性（射の集まり）を観察するだけで完全に、かつ一意に決定されます。関係性こそが存在そのものなのです。",
      rigor: "局所的に小さな圏 $\\mathcal{C}$ とその対象 $A$ に対し、表現可能関手 $h_A = \\text{Hom}(A, -): \\mathcal{C} \\to Set$ を定義します。米田の補題は、任意の共変関手 $X: \\mathcal{C} \\to Set$ に対して、以下の自然な全単射が存在することを示します：\n  $$\\text{Nat}(h_A, X) \\cong X(A)$$\n  この同型は、自然変換 $\\alpha: h_A \\Rightarrow X$ を要素 $\\alpha_A(1_A) \\in X(A)$ へとマッピングします。また、米田埋め込み $A \\mapsto h_A$ は充満忠実です。",
      history: "1954年に米田信夫がパリの駅でソーンダース・マックレーンに説明したことに由来します。哲学的には、構造主義の主張と共鳴します。孤立して存在するものはなく、あらゆる実体は宇宙と自身を結ぶ「矢印のネットワーク」によって定義されるのです。",
      exercises: "1. 2つの対象 $A, B$ の表現可能関手が同型 $h_A \\cong h_B$ であるならば、対象 $A$ と $B$ は圏内で同型であることを証明しなさい。（ヒント：米田埋め込みが充満忠実であること）\n2. 数式 $\\text{Nat}(h_A, X) \\cong X(A)$ の物理的・哲学的な意味を説明しなさい。"
    }
  }
};
