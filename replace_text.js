const fs = require('fs');
const file = '/home/yasu/co/math/src/components/AdjunctionVisualizer.tsx';
let code = fs.readFileSync(file, 'utf8');

const newTourStops = `// Tour stops definitions (Gradual, rigorous buildup of Free Generation & Quotients)
  const tourStops: TourStop[] = language === 'ja' ? [
    {
      id: 1,
      title: "I. 美術館入口：存在論的サイクル",
      subtitle: "人類が記法と意味論を通じて存在を発見した物語。",
      text: "随伴存在論ツアーへようこそ。数学はその究極の基盤において、自由生成と商化という２つの認知の対話的サイクルそのものです。私たちは最初に文字や記号を一切の制約なしに並べて「構文（Syntax）」を作り出し、次にそれらを方程式によって特定の価値へと折りたたむことで「意味論（Semantics）」を与えます。この一見単純なプロセスこそがすべての数学的構造の起源です。本ツアーでは、骨の刻み目から言語の文法、そして圏論へとこの二重性を段階的に追っていきます。"
    },
    {
      id: 2,
      title: "II. 数え上げの黎明：石ころと刻み目 (百万年前)",
      subtitle: "無制限に刻み目を打つ「自由生成」と、個数へ折りたたむ「商化」。",
      text: "百万年前、私たちの祖先は骨に刻み目（ノッチ）を刻み始めました。追加のルールを持たずに、刻み目 I を I, II, III と無数に刻み続ける行為は、純粋な記号構文の「自由生成」です。しかし、バラバラの刻み目そのものは役に立ちません。これを「5頭の獲物」という単一の数概念へと折りたたむ行為、これこそが「商化」です。バラバラな表記を同値関係でまとめ上げることで、私たちは数を把握したのです。"
    },
    {
      id: 3,
      title: "III. 言語の誕生：アルファベットと意味論 (古代)",
      subtitle: "アルファベットから無限の文を生成し、共通概念へと商化させる。",
      text: "文字を手に入れた人類は、少数の記号から無限の言葉や文を紡ぎ出す能力を獲得しました。ルールを無視してアルファベットを自由に並べる行為は、無制限な記号空間の「自由生成」です。しかし、綴りや言い回しが異なっていても、伝わる核心的なイメージは一つに収縮します。私たちは異なる表現を「同義」としてグループ化（商化）することで、言語に共通の意味論を与えたのです。"
    },
    {
      id: 4,
      title: "IV. アルゴリズムの時代：構文木とコンパイル (現代)",
      subtitle: "コード構文を生成し、コンピューターで評価して値へ崩壊させる。",
      text: "現代のコンピューターサイエンスも、このサイクルを共有しています。コードを書く際、私たちは変数や演算子を自由に並べて「抽象構文木（AST）」を生成します。そしてコンパイラやCPUが二項演算に従って式を再帰的に評価し、最終的な出力値へと「崩壊（Quotient Collapse）」させます。コードの記述が自由生成であり、その実行が商化による値の導出に他なりません。"
    },
    {
      id: 5,
      title: "V. 定式化：集合とモノイドの圏",
      subtitle: "認知の往復を、数学的なオブジェクトの接続として記述する。",
      text: "この知性の往復を、圏論を用いて正式に定義します。構造を持たない生の記号の世界を「集合の圏C」とし、結合ルールを持つ体系を「モノイドの圏D」と呼びます。集合から自由な文字列を作る操作は「自由関手F」であり、モノイドから演算構造を無視して生の文字列に戻す操作は「忘却関手U」です。これらは２つの世界の架け橋です。"
    },
    {
      id: 6,
      title: "VI. 定式化：随伴 duality (F ⊣ U)",
      subtitle: "自由生成と商化崩壊を完璧に統合する自然同型。",
      text: "自由生成と商化のループは、圏論において「随伴（F ⊣ U）」として統合されます。これは、自由モノイド上のすべての準同型写像（崩壊のルール）が、元の生の要素をどこに送るかという最初の写像だけで一意に決定されることを意味します。百万年前に小石を数え始めた人類の思考の必然が、数学の最も美しい随伴の橋によって証明されるのです。"
    }
  ] : [
    {
      id: 1,
      title: "I. Gallery Entrance: The Ontological Cycle",
      subtitle: "The absolute nature of mathematical existence.",
      text: "Welcome to the Ontology Museum Tour. At its ultimate foundation, mathematics is the dialogical cycle of Free Generation and Quotienting. Every mathematical system is constructed by first freely generating a syntax or space of elements, and then collapsing it by imposing relations and equations to resolve semantics. In this tour, we will explore this duality step-by-step, starting from bone notches and language grammar, to formal Category Theory."
    },
    {
      id: 2,
      title: "II. The Dawn of Counting: Pebbles and Notches (1M Years Ago)",
      subtitle: "Generating notches freely and collapsing them into numeric quantities.",
      text: "A million years ago, our ancestors carved notches on bones to record quantity. Carving notches I, II, III freely with no rules is the free generation of pure syntax. However, raw notches are useless on their own. Folding those discrete marks into a single numeric concept, such as 5, to trade, compare, or share is the quotient collapse. By grouping syntactic marks under bijection, we discovered numbers."
    },
    {
      id: 3,
      title: "III. The Birth of Language: Alphabet & Semantics (Ancient Eras)",
      subtitle: "Generating infinite strings of text and collapsing them into shared meaning.",
      text: "With alphabets, humanity gained the ability to generate infinite sentences. Arranging letters freely to write down expressions represents the free generation of syntax. Quotienting is the mechanism of semantics, where multiple different syntactic formulations or synonyms collapse under a single equivalence class representing a shared definition or meaning."
    },
    {
      id: 4,
      title: "IV. The Algorithmic Era: Syntax Trees & Evaluation (Modern)",
      subtitle: "Generating abstract syntax trees and collapsing them into values.",
      text: "Modern computer science follows the exact same cognitive cycle. We freely assemble variables and operators into nested Abstract Syntax Trees (Syntax). The CPU or compiler then collapses this tree using binary operations, reducing it into a single computed output value (Evaluation). Writing code is free generation, while executing it is quotient collapse."
    },
    {
      id: 5,
      title: "V. Formalization: Categories of Sets & Monoids",
      subtitle: "Representing our cognitive cycle with objects and structured categories.",
      text: "We now introduce Category Theory to formalize this cognitive loop mathematically. Category C of Sets represents the world of raw elements (notches, variables) without structure. Category D of Monoids represents structured objects with associative multiplication. Free generation is represented as the Free Functor F, and collapse is represented as the Forgetful Functor U."
    },
    {
      id: 6,
      title: "VI. Formalization: The Adjunction Duality (F ⊣ U)",
      subtitle: "The natural isomorphism uniting notation and meaning.",
      text: "The ultimate mathematical formalization of our ontology is the Adjunction. It establishes a natural isomorphism between hom-sets. This states that specifying a collapsed evaluation map out of a free structure is identical to choosing where the raw generators map. The cognitive circle that began with notch-carving a million years ago is mathematically unified."
    }
  ];`;

const startIdx = code.indexOf('// Tour stops definitions');
const endIdx = code.indexOf('  const currentTourStop = tourStops[currentStop - 1];');

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + newTourStops + '\n\n' + code.substring(endIdx);
  fs.writeFileSync(file, code, 'utf8');
  console.log("Successfully replaced tourStops array via JS script.");
} else {
  console.log("Could not find start or end index.");
}
