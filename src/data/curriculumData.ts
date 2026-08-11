import { roomsPart1 } from './curriculumPart1';
import { roomsPart2 } from './curriculumPart2';
import { roomsPart3 } from './curriculumPart3';

export interface PlacardContent {
  narrative: string;
  rigor: string;
  history: string;
  exercises: string;
}

export interface RosettaRow {
  lens: string;
  lego: string;
  tech: string;
  theory: string;
}

export interface RosettaStone {
  generators: RosettaRow;
  relations: RosettaRow;
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
  glossaryKeys?: string[];
  rosettaStone?: {
    en: RosettaStone;
    ja: RosettaStone;
  };
}

const glossaryKeysMap: Record<number, string[]> = {
  1: ["free-functor", "signature", "arity", "finite", "operation", "term-algebra", "congruence-relation", "quotient", "coequalizer"],
  2: ["skeleton", "quotient"],
  3: ["free-functor", "congruence-relation", "quotient"],
  4: ["free-functor", "congruence-relation", "quotient"],
  5: ["free-functor", "congruence-relation", "quotient"],
  6: ["free-functor", "congruence-relation", "quotient"],
  7: ["quotient"],
  8: ["piecewise-isometry", "quotient"],
  9: ["quotient", "universal-property"],
  10: ["diffeomorphism", "quotient"],
  11: ["homotopy-equivalence", "quotient"],
  12: ["diffeomorphism", "quotient"],
  13: ["arity", "operation", "term-algebra", "congruence-relation", "quotient"],
  14: ["free-functor", "signature", "arity", "operation", "term-algebra", "congruence-relation", "quotient"],
  15: ["pullback", "quotient"],
  16: ["congruence-relation", "quotient"],
  17: ["isomorphism", "quotient"],
  18: ["yoneda-lemma", "quotient"],
  19: ["free-functor", "forgetful-functor"],
  20: ["free-functor", "forgetful-functor", "quotient"],
  21: ["free-functor", "forgetful-functor"],
  22: ["adjunction", "unit-adjunction", "forgetful-functor"],
  23: ["unit-adjunction", "counit-adjunction"],
  24: ["monad", "eilenberg-moore"],
  25: ["yoneda-lemma", "isomorphism"],
  26: ["free-functor", "universal-property"],
  27: ["isomorphism"],
  28: ["quotient", "coequalizer"],
  29: ["isomorphism"],
  30: ["adjunction", "unit-adjunction", "counit-adjunction", "universal-property"]
};

const rosettaStoneMap: Record<number, { en: RosettaStone; ja: RosettaStone }> = {
  1: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Box of Toys: Raw toys with no connections or rules.",
        tech: "Raw notches carved on bone / individual clay tokens / unknotted cords.",
        theory: "Set of raw elements $X$, signature $\\Sigma$, free algebra $F(X)$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Spaceship Rules & Fusing Box: Fusing block + dinosaur into one spaceship.",
        tech: "Grouping notches under a contract / sealing tokens in bulla / knotting cords.",
        theory: "Equivalence relation $R$, congruence $\\langle R \\rangle$, coequalizer $\\pi: F(X) \\to F(X)/R$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "おもちゃ箱：接続もルールもない生の玩具。",
        tech: "骨に刻まれた生の刻み目／個々の粘土トークン／結んでいない紐。",
        theory: "生の要素の集合 $X$, シグネチャ $\\Sigma$, 自由代数 $F(X)$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "宇宙船ルールと融合箱：ブロック＋恐竜を1つの宇宙船に融合。",
        tech: "契約に基づく刻み目のグループ化／ブッラへのトークン封入／紐の結び目。",
        theory: "同値関係 $R$, 合同関係 $\\langle R \\rangle$, コイコライザー $\\pi: F(X) \\to F(X)/R$。"
      }
    }
  },
  2: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Separate tally mark blocks representing counts.",
        tech: "Raw tally marks carved on baboon fibula bone.",
        theory: "Finite set objects $A, B \\in \\mathcal{S}et_{\\text{fin}}$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Matching blocks to toys via one-to-one correspondence.",
        tech: "Establishing bijection equivalence classes of notches.",
        theory: "Isomorphism class $[n]$ in skeleton category $\\text{sk}(\\mathcal{S}et_{\\text{fin}}) \\cong \\mathbb{N}_0$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "数を表す個別のカウントブロック。",
        tech: "ヒヒの腓骨に刻まれた生の刻み目（タリカウンター）。",
        theory: "有限集合の対象 $A, B \\in \\mathcal{S}et_{\\text{fin}}$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "一対一対応によるブロックとおもちゃの照合。",
        tech: "刻み目の全単射同値類の確立による計数契約。",
        theory: "骨格圏 $\\text{sk}(\\mathcal{S}et_{\\text{fin}}) \\cong \\mathbb{N}_0$ における同型類 $[n]$。"
      }
    }
  },
  3: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Pile of distinct toy tokens (cones, spheres).",
        tech: "Sumerian clay tokens representing commodities.",
        theory: "Free commutative monoid $F(T) = \\bigoplus_{T} \\mathbb{N}$ of tokens."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Trading rule: 10 blocks equals 1 dinosaur.",
        tech: "Sealing tokens inside a clay bulla envelope.",
        theory: "Congruence relation $\\sim_v$ (kernel of valuation $v: F(T) \\to M$)."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "個別の玩具トークン（円錐、球）の山。",
        tech: "物資を表す個々のシュメールの粘土トークン。",
        theory: "トークンの自由可換モノイド $F(T) = \\bigoplus_{T} \\mathbb{N}$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "取引ルール：ブロック10個は恐竜1個に等しい。",
        tech: "粘土製の封筒（ブッラ）へのトークンの封入と密封。",
        theory: "合同関係 $\\sim_v$（価値評価準同型写像 $v: F(T) \\to M$ の核）。"
      }
    }
  },
  4: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Cords with arbitrary count of raw knots.",
        tech: "Raw string loops of hanging cords on a main rope.",
        theory: "Digit configuration sequence space $C = \\bigoplus_{k} \\{0..9\\}$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Aligning knots in tens/hundreds columns.",
        tech: "Knot positioning tiers on hanging cords.",
        theory: "Kernel equivalence classes of evaluation map $\\text{eval}: C \\to \\mathbb{N}_0$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "生の結び目が任意に並んだコード。",
        tech: "主縄から垂れ下がる生の吊りコードの縄ループ。",
        theory: "数値配置の配列空間 $C = \\bigoplus_{k} \\{0..9\\}$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "結び目を十の位、百の位の列に揃える配置ルール。",
        tech: "吊りコード上の十進法の位置的階層スロット。",
        theory: "十進法評価写像 $\\text{eval}: C \\to \\mathbb{N}_0$ の核による同値類。"
      }
    }
  },
  5: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Individual alphabet letter blocks.",
        tech: "Raw written phonetic symbols and characters.",
        theory: "Free monoid $\\Sigma^*$ of finite strings."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Equating 'automobile' block with 'car' block.",
        tech: "Synonymy equivalence classes and dictionary definitions.",
        theory: "Syntactic congruence $\\sim_L$ and quotient monoid $\\Sigma^*/\u007e_L$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "アルファベットの個別の文字ブロック。",
        tech: "生の表記用の音素記号および文字。",
        theory: "有限文字列の自由モノイド $\\Sigma^*$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "「自動車」のブロックと「車」のブロックを同一視。",
        tech: "同義語の同値関係および辞書的な意味定義。",
        theory: "構文合同関係 $\\sim_L$ および構文モノイド $\\Sigma^*/\u007e_L$。"
      }
    }
  },
  6: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Raw propositional logical puzzle pieces.",
        tech: "Syntactic logical sentences generated by rules.",
        theory: "Free algebra of formulas $F(X)$ under connective signature $\\Sigma$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Simplifying redundant logic blocks (A and A = A).",
        tech: "Deductive rules collapsing equivalent derivations.",
        theory: "Provable equivalence relation $\\sim_T$, Lindenbaum-Tarski Boolean quotient."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "命題記号と論理演算子を表す生のパズル片。",
        tech: "論理的な規則に従って生成された生の構文文論理式。",
        theory: "結合記号シグネチャ $\\Sigma$ のもとでの論理式自由代数 $F(X)$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "冗長な論理ブロックの簡素化ルール（A かつ A ＝ A）。",
        tech: "同値な推論ルートを同一視する演繹規則。",
        theory: "証明可能同値関係 $\\sim_T$ およびリンデンバウム・タルスキのブール商代数。"
      }
    }
  },
  7: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Vertical and horizontal peg threads.",
        tech: "Unwoven warp threads aligned on a loom frame.",
        theory: "Free grid coordinate generator group $\\mathbb{Z}^2$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Over/under interlocking grid pattern rules.",
        tech: "Alternating warp-weft binding constraints.",
        theory: "Topological quotient of $\\mathbb{R}^2$ by $\\mathbb{Z}^2$ translations."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "垂直と水平の格子状のペグ糸。",
        tech: "織機フレーム上に整列した未織の経糸（たていと）。",
        theory: "自由格子座標生成元群 $\\mathbb{Z}^2$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "縦糸と横糸を交互に交差させる織りルール。",
        tech: "経糸と緯糸の交互の絡み合い制約。",
        theory: "並進対称性 $\\mathbb{Z}^2$ によるユークリッド平面 $\\mathbb{R}^2$ の商。"
      }
    }
  },
  8: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Unfolded flat square toy paper sheets.",
        tech: "Flat, uncreased sheets of cellulose paper.",
        theory: "Continuous coordinate plane domain $X = [0,1]^2$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Mountain and valley fold lines matching edges.",
        tech: "Folding paper along crease line equations.",
        theory: "Piecewise-isometry quotient space $p: X \\to Y$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "折る前の平らな正方形の紙シート。",
        tech: "折り目のない真っ平らな紙シート。",
        theory: "連続平面的座標ドメイン $X = [0,1]^2$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "端と端を合わせる山折り・谷折りの折り線。",
        tech: "折り目方程式（山折り・谷折り）に沿った紙の折り曲げ。",
        theory: "区分的等長写像の商空間 $p: X \\to Y$。"
      }
    }
  },
  9: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Flat 2D square toy board.",
        tech: "Flat sheet of flexible rubber or fabric.",
        theory: "Unit topological square $I^2 = [0,1] \\times [0,1]$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Gluing top-bottom and left-right edges.",
        tech: "Sewing boundary lines of a sheet together.",
        theory: "Topological quotient $I^2 / \\sim$ isomorphic to torus $T^2$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "平らな2次元の正方形の玩具ボード。",
        tech: "伸縮性のある平らなゴム製シートまたは布。",
        theory: "単位位相正方形 $I^2 = [0,1] \\times [0,1]$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "正方形の上下の辺と左右の辺をそれぞれテープで貼り合せる。",
        tech: "シートの境界線を縫い合わせて閉じた曲面を作る。",
        theory: "トーラス $T^2$ に同相な位相空間商 $I^2 / \\sim$。"
      }
    }
  },
  10: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Raw lasers pointing outward in 3D.",
        tech: "Vision light rays passing through camera aperture.",
        theory: "Vector space without origin $\\mathbb{R}^3 \\setminus \\{(0,0,0)\\}$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Aligning toy telescope along collinear paths.",
        tech: "Projecting 3D points onto a flat lens/screen.",
        theory: "Quotient space $\\mathbf{RP}^2 = (\\mathbb{R}^3 \\setminus \\{0\\})/\\mathbb{R}^*$ under scaling."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "3次元で外側を指す生のレーザー光線。",
        tech: "カメラの絞りレンズを通過する視線光線。",
        theory: "原点を除く3次元実ベクトル空間 $\\mathbb{R}^3 \\setminus \\{(0,0,0)\\}$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "共線的な経路に沿っておもちゃの望遠鏡を整列させる。",
        tech: "3D空間の点をフラットなスクリーン投影にマッピング。",
        theory: "スカラー倍の作用による射影商空間 $\\mathbf{RP}^2 = (\\mathbb{R}^3 \\setminus \\{0\\})/\\mathbb{R}^*$。"
      }
    }
  },
  11: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Flexible lengths of colored elastic string.",
        tech: "Unconstrained rope paths wrapped around obstacles.",
        theory: "Continuous loops $\\gamma: [0,1] \\to X$ at basepoint $x_0$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Sliding and shrinking string loops without lifting.",
        tech: "Deforming loops continuously without cutting.",
        theory: "Path homotopy equivalence classes, forming group $\\pi_1(X, x_0)$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "色付きの伸縮性のあるゴム紐。",
        tech: "障害物の周囲に自由に這わせたロープの経路。",
        theory: "基点 $x_0$ における連続ループ写像 $\\gamma: [0,1] \\to X$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "紐を持ち上げたり切ったりせずにスライドして縮める。",
        tech: "ロープを切断せずに連続的に引っ張って変形・同一視する。",
        theory: "基本群 $\\pi_1(X, x_0)$ を構成するホモトピー同値類。"
      }
    }
  },
  12: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Flat cardboard grid maps.",
        tech: "Local coordinate patches describing space patches.",
        theory: "Local coordinate charts of smooth manifold $M$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Bending and stretching maps under gravity.",
        tech: "Coordinate invariance under diffeomorphism group.",
        theory: "Superspace quotient $M/\\text{Diff}(M)$ of metric tensors."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "平らな段ボールのグリッドマップ。",
        tech: "空間の局所領域を表す座標パッチ。",
        theory: "滑らかな多様体 $M$ の局所座標チャート。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "重力のもとでマップを曲げたり伸ばしたりするルール。",
        tech: "微分同相写像（ディフェオモルフィズム）群による座標不変性。",
        theory: "微分同相群作用による計量テンソル空間の商 $M/\\text{Diff}(M)$。"
      }
    }
  },
  13: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Function plugs and variable sockets.",
        tech: "Text-based variable symbols and function scopes.",
        theory: "Syntax tree set $\\Lambda$ of unreduced lambda terms."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Plugging inputs in and evaluating values.",
        tech: "Beta-reduction and substitution computation.",
        theory: "Equivalence class quotient under beta-conversion $\\sim_\\beta$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "関数のプラグと変数ソケット。",
        tech: "テキストベースの変数記号およびラムダ関数のスコープ。",
        theory: "未縮退のラムダ項 of 構文木集合 $\\Lambda$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "入力をプラグインして値を評価するルール。",
        tech: "β簡約および置換による計算の評価（縮退）。",
        theory: "β変換同値関係 $\\sim_\\beta$ による同値類の商。"
      }
    }
  },
  14: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Operations and numbers on toy calculator blocks.",
        tech: "Unresolved mathematical formulas and syntax trees.",
        theory: "Free term algebra $T_{\\Sigma}(X)$ over signature."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Merging '1+2' block into a '3' block.",
        tech: "Recursive calculation steps of compiler.",
        theory: "Initial algebra evaluation homomorphism $\\text{eval}: T_{\\Sigma}(X) \\to \\mathbb{Z}$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "電卓ブロック上の演算子と数値。",
        tech: "未評価の数式および構文木（AST）。",
        theory: "シグネチャ上の自由項代数 $T_{\\Sigma}(X)$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "「1+2」ブロックを「3」のブロックに融合。",
        tech: "コンパイラによる数式の再帰的評価と数値への縮退。",
        theory: "初期代数評価準同型写像 $\\text{eval}: T_{\\Sigma}(X) \\to \\mathbb{Z}$ の商。"
      }
    }
  },
  15: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Cards containing raw field values.",
        tech: "Flat CSV files filled with raw unorganized rows.",
        theory: "Cartesian product space of schema domains."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Stacking cards by matching values (`GROUP BY`).",
        tech: "SQL database queries joining fields and tables.",
        theory: "Pullback equivalence classes and table quotients."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "生のフィールドデータが含まれるカード。",
        tech: "生の行データが格納されたフラットなCSVファイル。",
        theory: "スキーマドメインの直積（デカルト積）空間。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "値が一致するカードを重ねて統合する（`GROUP BY`）。",
        tech: "SQL結合クエリによるテーブル間の結合（プルバック）。",
        theory: "プルバック同値類によるテーブル間の関連性商。"
      }
    }
  },
  16: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Train tracks with various route switches.",
        tech: "Raw pathways and route transitions in flowcharts.",
        theory: "Free monoid of path words $\\Sigma^*$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Grouping routes that lead to the same destination.",
        tech: "State equivalence and DFA minimization.",
        theory: "Syntactic congruence equivalence classes $S = \\Sigma^*/\\sim_L$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "分岐スイッチがある電車の線路。",
        tech: "フローチャート上の生の遷移経路。",
        theory: "遷移パス記号の自由モノイド $\\Sigma^*$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "同じ目的地につながる線路をまとめるルール。",
        tech: "状態の等価性（マイヒル・ネローデ）およびDFAの最小化商。",
        theory: "言語 $L$ の構文合同同値類 $S = \\Sigma^*/\\sim_L$。"
      }
    }
  },
  17: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Proof blocks constructed in towers.",
        tech: "Logical assertion trees and syntactical deductions.",
        theory: "Syntax terms in intuitionistic type theory."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Equating different proof styles that show same result.",
        tech: "Definitional equivalence and computation reduction.",
        theory: "Judgmental equality relation $a \\equiv b : A$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "タワーとして組み立てられた証明ブロック。",
        tech: "論理的な記述の木および構文的証明演繹。",
        theory: "直観主義型理論における証明項の文法。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "同じ結果を示す異なる証明を同一視するルール。",
        tech: "定義的等価性および計算による正規化（ベータ・イータ変換）。",
        theory: "判断的等価関係 $a \\equiv b : A$ による商化。"
      }
    }
  },
  18: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Paths connecting toy houses on a map.",
        tech: "Logical arguments bridging statements.",
        theory: "Identity types $\\text{Id}_A(x, y)$ of terms."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Folding path lines continuously to test length.",
        tech: "Equivalence of proofs under higher homotopy deformation.",
        theory: "Homotopy equivalence classes of identity path proofs."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "マップ上の家を結ぶ経路。",
        tech: "文と文を繋ぐ論理的ブリッジ。",
        theory: "項の同一性型 $\\text{Id}_A(x, y)$ の証明パス。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "経路を連続的に変形して同一のクラスと見なす。",
        tech: "高次ホモトピー変形のもとでの証明の同値性。",
        theory: "同一性パス証明のホモトピー同値類。"
      }
    }
  },
  19: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Single dots and directed connector arrows.",
        tech: "Collections of objects and raw connections.",
        theory: "Set objects $X$ and functions $f \\in \\text{Hom}(X, Y)$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Snapping arrows head-to-tail in order.",
        tech: "Chaining functions sequentially to form a path.",
        theory: "Associativity and identity equations of composition."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "点とそれらを繋ぐ有向矢印。",
        tech: "オブジェクトの集まりと生の結びつき。",
        theory: "集合対象 $X$ および写像 $f \\in \\text{Hom}(X, Y)$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "矢印を頭と尾で一列に繋ぐ規則。",
        tech: "写像を順次合成して経路を作る。",
        theory: "合成の結合律および単位律の方程式。"
      }
    }
  },
  20: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Combining bricks with sum rules.",
        tech: "Monoid set operations and raw units.",
        theory: "Set with binary operator $(M, \\cdot, e)$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Rules preserving composition during scaling.",
        tech: "Homomorphism rules preserving product structure.",
        theory: "Homomorphism constraints: $\\phi(x \\cdot y) = \\phi(x) \\cdot \\phi(y)$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "加算ルールに従っておもちゃブロックを合体する。",
        tech: "モノイド集合の演算および単位元。",
        theory: "二項演算を持つ集合 $(M, \\cdot, e)$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "大きさを変えても合体比率が変わらないというルール。",
        tech: "積の構造を保存する準同型写像の関係式。",
        theory: "準同型関係式: $\\phi(x \\cdot y) = \\phi(x) \\cdot \\phi(y)$。"
      }
    }
  },
  21: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Creating structured toys from raw clay blocks.",
        tech: "Synthesizing catalogs from raw inventory listings.",
        theory: "Left adjoint free functor $F: \\mathcal{C} \\to \\mathcal{D}$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Ignoring shapes to count raw clay parts.",
        tech: "Discarding catalog layout to return to raw text list.",
        theory: "Right adjoint forgetful functor $U: \\mathcal{D} \\to \\mathcal{C}$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "生の粘土ブロックから形のある玩具を作る。",
        tech: "生の在庫リストからカタログを作成（自由生成）。",
        theory: "左随伴自由関手 $F: \\mathcal{C} \\to \\mathcal{D}$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "形状を無視して生の粘土パーツの個数を数える。",
        tech: "カタログのレイアウトを破棄して生のテキストリストに戻す。",
        theory: "右随伴忘却関手 $U: \\mathcal{D} \\to \\mathcal{C}$。"
      }
    }
  },
  22: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Choosing the target position for each raw block.",
        tech: "Specifying assignments for initial raw inputs.",
        theory: "Hom-set of raw mappings $\\text{Hom}_{\\mathcal{C}}(X, U(Y))$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Extending choices to obey structured toy rules.",
        tech: "Extending local maps to unique algebraic homomorphisms.",
        theory: "Natural bijection $\\text{Hom}_{\\mathcal{D}}(F(X), Y) \\cong \\text{Hom}_{\\mathcal{C}}(X, U(Y))$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "生の各ブロックを配置する目標位置を選択。",
        tech: "初期の生入力に対するマッピングの指定。",
        theory: "生のマッピング空間 $\\text{Hom}_{\\mathcal{C}}(X, U(Y))$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "構造化された玩具のルールに従うように全体を拡張。",
        tech: "局所写像を一意の代数的準同型写像へ拡張（商化）。",
        theory: "自然な全単射 $\\text{Hom}_{\\mathcal{D}}(F(X), Y) \\cong \\text{Hom}_{\\mathcal{C}}(X, U(Y))$。"
      }
    }
  },
  23: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Adding a tag mark on raw blocks to log them.",
        tech: "Inserting raw data into database catalog fields.",
        theory: "Unit natural transformation $\\eta: \\text{Id}_{\\mathcal{C}} \\to UF$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Fusing compound toy assemblies in Fusing Box.",
        tech: "Evaluating transaction registers to find net worth.",
        theory: "Counit natural transformation $\\varepsilon: FU \\to \\text{Id}_{\\mathcal{D}}$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "生のブロックを記録するためにタグマークを貼る。",
        tech: "データベースのフィールドに生のデータを登録。",
        theory: "単位自然変換 $\\eta: \\text{Id}_{\\mathcal{C}} \\to UF$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "組み立てられた玩具全体を融合箱に入れて一体化する。",
        tech: "取引レジスタを計算して純資産額を算出（縮退）。",
        theory: "余単位自然変換 $\\varepsilon: FU \\to \\text{Id}_{\\mathcal{D}}$。"
      }
    }
  },
  24: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Placing toys inside a nested boxing kit.",
        tech: "Nesting boxes within folders in filesystem.",
        theory: "Endofunctor $T: \\mathcal{C} \\to \\mathcal{C}$ generating terms."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Opening nested boxes to flatten layers.",
        tech: "Flattening nested folders into a single folder.",
        theory: "Monad multiplication $\\mu: T^2 \\to T$ and algebra structural equations."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "おもちゃを入れ子状の箱キットに収納する。",
        tech: "ファイルシステム内のフォルダに入れ子状にフォルダを配置。",
        theory: "項を生成する自己関手 $T: \\mathcal{C} \\to \\mathcal{C}$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "入れ子状の箱を開けて平らに平滑化する。",
        tech: "入れ子のフォルダを単一のフォルダに平坦化する。",
        theory: "モナド積 $\\mu: T^2 \\to T$ および代数構造方程式。"
      }
    }
  },
  25: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Measuring pointer sticking out from a toy.",
        tech: "Probing a test object with diagnostic signals.",
        theory: "Representable presheaf functor $h^X = \\text{Hom}(-, X)$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Matching toys that trigger identical pointer reactions.",
        tech: "Analyzing response tables to identify the object.",
        theory: "Natural isomorphism $\\text{Nat}(h^X, P) \\cong P(X)$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "おもちゃから外に飛び出している測定用ポインター。",
        tech: "診断信号（プローブ）を用いてテスト対象オブジェクトを探る。",
        theory: "表現可能プレシェーヴ関手 $h^X = \\text{Hom}(-, X)$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "ポインターの反応が完全に一致するおもちゃを同一視。",
        tech: "プローブ反応表を照合してオブジェクトを一意に決定。",
        theory: "自然同型 $\\text{Nat}(h^X, P) \\cong P(X)$。"
      }
    }
  },
  26: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Separate colored Lego bricks before any assembly.",
        tech: "Raw lists of character symbols and alphabets.",
        theory: "Set of raw generators $X$ in Category $\\mathbf{Set}$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Connecting blocks freely to form syntax trees.",
        tech: "Constructing arbitrary sentences of character lists.",
        theory: "Free algebra $F(X)$ representing grammar-correct syntax."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "組み立て前のバラバラの色のレゴブロック。",
        tech: "文字記号およびアルファベットの生のリスト。",
        theory: "圏 $\\mathbf{Set}$ における生の生成元集合 $X$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "ブロックを自由に繋げて構文木を形成。",
        tech: "文字リストから任意の文法的な文を構築。",
        theory: "文法的に正しい構文を表す自由代数 $F(X)$。"
      }
    }
  },
  27: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Elastic wire bands stretching between pegs.",
        tech: "Wiring input ports to output ports.",
        theory: "Domain, codomain, and arrow mapping function $f: A \\to B$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Snapping wires head-to-tail to make paths.",
        tech: "Cascading signal flows through sequential circuits.",
        theory: "Identity map, composition associativity naturality equations."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "ペグ間に伸ばされた伸縮性のあるゴム紐。",
        tech: "入力ポートと出力ポートの間の物理的配線。",
        theory: "ドメイン、コドメイン、および写像の矢印 $f: A \\to B$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "ゴム紐の端と端を繋いで一本の経路を作る。",
        tech: "順序回路における信号の流れの直列結合。",
        theory: "恒等写像、合成の結合律および自然性方程式。"
      }
    }
  },
  28: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Placing dividers into a toy sorting tray.",
        tech: "Sorting list cards into separate piles.",
        theory: "Equivalence relation $R$ or parallel homomorphism pair $f, g$."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Fusing all elements within the same dividers.",
        tech: "Collapsing rows based on matching key values.",
        theory: "Quotient projection $\\pi$ and coequalizer in category."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "仕切り板をおもちゃの整理トレイに配置。",
        tech: "カードリストを個別の束に分類。",
        theory: "同値関係 $R$ または並行準同型写像対 $f, g$。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "同じ仕切りの中にあるすべての玩具を融合する。",
        tech: "一致するキー値に基づいて行データを縮退・同一視。",
        theory: "商写像射影 $\\pi$ および圏におけるコイコライザー。"
      }
    }
  },
  29: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Structure blueprints of toy models.",
        tech: "Flowcharts of nodes and directional pathways.",
        theory: "Collection of objects and Hom-sets."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Translating blueprint parts to real toy colors.",
        tech: "Topological maps matching land coordinates.",
        theory: "Functor map equations: $F(g \\circ f) = F(g) \\circ F(f)$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "玩具モデルの構造設計図。",
        tech: "ノードと有向パスで構成されたフローチャート。",
        theory: "対象の集まりおよびHomセットの構成。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "設計図のパーツを実際の玩具の色に変換。",
        tech: "地形座標に一致するように位相マップを適合。",
        theory: "関手の写像関係式: $F(g \\circ f) = F(g) \\circ F(f)$。"
      }
    }
  },
  30: {
    en: {
      generators: {
        lens: "Generators (Syntax / Freedom)",
        lego: "Clay molding tools and sorting bins.",
        tech: "Encoding data fields and parsing outputs.",
        theory: "Free functor $F$ and forgetful functor $U$ setup."
      },
      relations: {
        lens: "Relations (Quotient / Collapse)",
        lego: "Matching molding actions to sorting rules.",
        tech: "Rosetta stone grid mapping input to outputs.",
        theory: "Natural Hom-set bijection $\\theta_{X,Y}: \\text{Hom}(F(X), Y) \\cong \\text{Hom}(X, U(Y))$."
      }
    },
    ja: {
      generators: {
        lens: "生成元 (構文 / 自由)",
        lego: "粘土の金型ツールと整理用のゴミ箱。",
        tech: "データフィールドのエンコードおよび出力のパース。",
        theory: "自由関手 $F$ と忘却関手 $U$ の随伴設定。"
      },
      relations: {
        lens: "関係式 (商 / 崩壊)",
        lego: "金型のアクションと整理ルールを対応させる関係。",
        tech: "入力と出力をマッピングするロゼッタストーン関係。",
        theory: "自然なHomセット全単射 $\\theta_{X,Y}: \\text{Hom}(F(X), Y) \\cong \\text{Hom}(X, U(Y))$。"
      }
    }
  }
};

export const roomsData: Record<number, RoomData> = {};

const combinedRooms = {
  ...roomsPart1,
  ...roomsPart2,
  ...roomsPart3
};

Object.keys(combinedRooms).forEach((keyStr) => {
  const key = parseInt(keyStr);
  const room = combinedRooms[key];
  if (room) {
    roomsData[key] = {
      ...room,
      glossaryKeys: glossaryKeysMap[key] || [],
      rosettaStone: rosettaStoneMap[key]
    };
  }
});

