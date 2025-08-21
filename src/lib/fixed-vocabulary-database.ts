interface VocabularyEntry {
  word: string
  phonetic: string
  meanings: string[]
  level: number
  category: string
  example: string
}

export const vocabularyDatabase: VocabularyEntry[] = [
  // Level 1: Basic Business Terms
  {
    word: "meeting",
    phonetic: "/ˈmiːtɪŋ/",
    meanings: ["会議", "打ち合わせ", "集会"],
    level: 1,
    category: "Business",
    example: "We have a meeting at 3 PM."
  },
  {
    word: "company",
    phonetic: "/ˈkʌmpəni/",
    meanings: ["会社", "企業", "法人"],
    level: 1,
    category: "Business",
    example: "The company is growing rapidly."
  },
  {
    word: "schedule",
    phonetic: "/ˈskedʒuːl/",
    meanings: ["予定", "スケジュール", "時間割"],
    level: 1,
    category: "Business",
    example: "Please check your schedule for tomorrow."
  },
  {
    word: "employee",
    phonetic: "/ɪmˈplɔɪiː/",
    meanings: ["従業員", "社員", "職員"],
    level: 1,
    category: "Business",
    example: "The employee works hard every day."
  },
  {
    word: "manager",
    phonetic: "/ˈmænɪdʒər/",
    meanings: ["管理者", "マネージャー", "責任者"],
    level: 1,
    category: "Business",
    example: "The manager approved the project."
  },
  {
    word: "office",
    phonetic: "/ˈɔːfɪs/",
    meanings: ["事務所", "オフィス", "事業所"],
    level: 1,
    category: "Business",
    example: "I work in a modern office building."
  },
  {
    word: "customer",
    phonetic: "/ˈkʌstəmər/",
    meanings: ["顧客", "お客様", "得意先"],
    level: 1,
    category: "Business",
    example: "The customer was satisfied with the service."
  },
  {
    word: "product",
    phonetic: "/ˈprɒdʌkt/",
    meanings: ["製品", "商品", "産物"],
    level: 1,
    category: "Business",
    example: "This product is very popular."
  },
  {
    word: "service",
    phonetic: "/ˈsɜːrvɪs/",
    meanings: ["サービス", "業務", "奉仕"],
    level: 1,
    category: "Business",
    example: "We provide excellent customer service."
  },
  {
    word: "project",
    phonetic: "/ˈprɒdʒekt/",
    meanings: ["プロジェクト", "企画", "計画"],
    level: 1,
    category: "Business",
    example: "The project will finish next month."
  },
  {
    word: "report",
    phonetic: "/rɪˈpɔːrt/",
    meanings: ["報告書", "レポート", "報告"],
    level: 1,
    category: "Business",
    example: "Please submit your report by Friday."
  },
  {
    word: "department",
    phonetic: "/dɪˈpɑːrtmənt/",
    meanings: ["部門", "部署", "課"],
    level: 1,
    category: "Business",
    example: "She works in the marketing department."
  },
  {
    word: "budget",
    phonetic: "/ˈbʌdʒɪt/",
    meanings: ["予算", "経費", "費用"],
    level: 1,
    category: "Finance",
    example: "We need to review the budget for next year."
  },
  {
    word: "salary",
    phonetic: "/ˈsæləri/",
    meanings: ["給料", "賃金", "俸給"],
    level: 1,
    category: "Finance",
    example: "His salary was increased this year."
  },
  {
    word: "contract",
    phonetic: "/ˈkɒntrækt/",
    meanings: ["契約", "約定", "取り決め"],
    level: 1,
    category: "Legal",
    example: "We signed a contract with the supplier."
  },
  {
    word: "deadline",
    phonetic: "/ˈdedlaɪn/",
    meanings: ["締切", "期限", "最終期限"],
    level: 1,
    category: "Business",
    example: "The deadline for this project is next week."
  },
  {
    word: "presentation",
    phonetic: "/ˌprezənˈteɪʃn/",
    meanings: ["発表", "プレゼンテーション", "提示"],
    level: 1,
    category: "Business",
    example: "She gave an excellent presentation."
  },
  {
    word: "document",
    phonetic: "/ˈdɒkjʊmənt/",
    meanings: ["文書", "書類", "資料"],
    level: 1,
    category: "Business",
    example: "Please sign this document."
  },
  {
    word: "invoice",
    phonetic: "/ˈɪnvɔɪs/",
    meanings: ["請求書", "送り状", "納品書"],
    level: 1,
    category: "Finance",
    example: "The invoice was sent yesterday."
  },
  {
    word: "client",
    phonetic: "/ˈklaɪənt/",
    meanings: ["顧客", "依頼人", "クライアント"],
    level: 1,
    category: "Business",
    example: "We have a meeting with an important client."
  },

  // Level 2: Intermediate Business Terms
  {
    word: "negotiate",
    phonetic: "/nɪˈɡoʊʃieɪt/",
    meanings: ["交渉する", "折衝する", "話し合う"],
    level: 2,
    category: "Business",
    example: "We need to negotiate the terms of the contract."
  },
  {
    word: "strategy",
    phonetic: "/ˈstrætədʒi/",
    meanings: ["戦略", "戦術", "方策"],
    level: 2,
    category: "Business",
    example: "The company's marketing strategy is very effective."
  },
  {
    word: "revenue",
    phonetic: "/ˈrevənjuː/",
    meanings: ["収益", "売上", "歳入"],
    level: 2,
    category: "Finance",
    example: "The company's revenue increased by 20%."
  },
  {
    word: "profit",
    phonetic: "/ˈprɒfɪt/",
    meanings: ["利益", "利潤", "収益"],
    level: 2,
    category: "Finance",
    example: "The profit margin is higher than expected."
  },
  {
    word: "analyze",
    phonetic: "/ˈænəlaɪz/",
    meanings: ["分析する", "解析する", "検討する"],
    level: 2,
    category: "Business",
    example: "We need to analyze the market trends."
  },
  {
    word: "implement",
    phonetic: "/ˈɪmplɪment/",
    meanings: ["実施する", "実行する", "導入する"],
    level: 2,
    category: "Business",
    example: "We will implement the new system next month."
  },
  {
    word: "efficient",
    phonetic: "/ɪˈfɪʃnt/",
    meanings: ["効率的な", "能率的な", "有能な"],
    level: 2,
    category: "Business",
    example: "This is a very efficient way to work."
  },
  {
    word: "productivity",
    phonetic: "/ˌprɒdʌkˈtɪvəti/",
    meanings: ["生産性", "能率", "効率"],
    level: 2,
    category: "Business",
    example: "The new software improved our productivity."
  },
  {
    word: "assessment",
    phonetic: "/əˈsesmənt/",
    meanings: ["評価", "査定", "判定"],
    level: 2,
    category: "Business",
    example: "The performance assessment was very thorough."
  },
  {
    word: "optimize",
    phonetic: "/ˈɒptɪmaɪz/",
    meanings: ["最適化する", "改善する", "向上させる"],
    level: 2,
    category: "Business",
    example: "We need to optimize our workflow."
  },
  {
    word: "collaborate",
    phonetic: "/kəˈlæbəreɪt/",
    meanings: ["協力する", "共同で作業する", "連携する"],
    level: 2,
    category: "Business",
    example: "We collaborated with another department on this project."
  },
  {
    word: "coordinate",
    phonetic: "/koʊˈɔːrdɪneɪt/",
    meanings: ["調整する", "統合する", "連携させる"],
    level: 2,
    category: "Business",
    example: "Please coordinate with the other teams."
  },
  {
    word: "proposal",
    phonetic: "/prəˈpoʊzl/",
    meanings: ["提案", "企画書", "計画案"],
    level: 2,
    category: "Business",
    example: "The proposal was accepted by the board."
  },
  {
    word: "conference",
    phonetic: "/ˈkɒnfərəns/",
    meanings: ["会議", "協議会", "学会"],
    level: 2,
    category: "Business",
    example: "I'm attending a conference next week."
  },
  {
    word: "acquisition",
    phonetic: "/ˌækwɪˈzɪʃn/",
    meanings: ["取得", "買収", "獲得"],
    level: 2,
    category: "Business",
    example: "The acquisition was completed successfully."
  },
  {
    word: "stakeholder",
    phonetic: "/ˈsteɪkhoʊldər/",
    meanings: ["利害関係者", "株主", "関係者"],
    level: 2,
    category: "Business",
    example: "All stakeholders agreed to the plan."
  },
  {
    word: "agenda",
    phonetic: "/əˈdʒendə/",
    meanings: ["議題", "予定表", "課題"],
    level: 2,
    category: "Business",
    example: "Please review the agenda before the meeting."
  },
  {
    word: "milestone",
    phonetic: "/ˈmaɪlstoʊn/",
    meanings: ["節目", "重要な段階", "里程標"],
    level: 2,
    category: "Business",
    example: "Reaching this milestone is a great achievement."
  },
  {
    word: "vendor",
    phonetic: "/ˈvendər/",
    meanings: ["販売業者", "供給業者", "ベンダー"],
    level: 2,
    category: "Business",
    example: "We need to find a reliable vendor."
  },
  {
    word: "franchise",
    phonetic: "/ˈfræntʃaɪz/",
    meanings: ["フランチャイズ", "特権", "営業権"],
    level: 2,
    category: "Business",
    example: "They opened a franchise in the city center."
  },

  // Level 3: Advanced Business Terms
  {
    word: "consolidate",
    phonetic: "/kənˈsɒlɪdeɪt/",
    meanings: ["統合する", "強化する", "まとめる"],
    level: 3,
    category: "Business",
    example: "We plan to consolidate our operations."
  },
  {
    word: "innovative",
    phonetic: "/ˈɪnəveɪtɪv/",
    meanings: ["革新的な", "斬新な", "創造的な"],
    level: 3,
    category: "Business",
    example: "This is an innovative solution to the problem."
  },
  {
    word: "substantial",
    phonetic: "/səbˈstænʃl/",
    meanings: ["相当な", "実質的な", "重要な"],
    level: 3,
    category: "Business",
    example: "There was a substantial increase in sales."
  },
  {
    word: "leverage",
    phonetic: "/ˈlevərɪdʒ/",
    meanings: ["活用する", "てこ入れ", "影響力"],
    level: 3,
    category: "Business",
    example: "We can leverage our experience in this market."
  },
  {
    word: "compliance",
    phonetic: "/kəmˈplaɪəns/",
    meanings: ["遵守", "適合", "準拠"],
    level: 3,
    category: "Legal",
    example: "Compliance with regulations is mandatory."
  },
  {
    word: "feasibility",
    phonetic: "/ˌfiːzəˈbɪləti/",
    meanings: ["実現可能性", "実行可能性", "妥当性"],
    level: 3,
    category: "Business",
    example: "We need to study the feasibility of this project."
  },
  {
    word: "infrastructure",
    phonetic: "/ˈɪnfrəstrʌktʃər/",
    meanings: ["インフラ", "基盤", "下部構造"],
    level: 3,
    category: "Business",
    example: "The company invested in IT infrastructure."
  },
  {
    word: "diversification",
    phonetic: "/daɪˌvɜːrsɪfɪˈkeɪʃn/",
    meanings: ["多様化", "分散化", "多角化"],
    level: 3,
    category: "Business",
    example: "Diversification reduces business risk."
  },
  {
    word: "paradigm",
    phonetic: "/ˈpærədaɪm/",
    meanings: ["枠組み", "概念", "パラダイム"],
    level: 3,
    category: "Business",
    example: "We need a new paradigm for business."
  },
  {
    word: "synthesis",
    phonetic: "/ˈsɪnθəsɪs/",
    meanings: ["統合", "合成", "総合"],
    level: 3,
    category: "Business",
    example: "The synthesis of these ideas is impressive."
  },
  {
    word: "arbitration",
    phonetic: "/ˌɑːrbɪˈtreɪʃn/",
    meanings: ["仲裁", "調停", "裁定"],
    level: 3,
    category: "Legal",
    example: "The dispute was resolved through arbitration."
  },
  {
    word: "subsidiary",
    phonetic: "/səbˈsɪdiəri/",
    meanings: ["子会社", "従属会社", "支社"],
    level: 3,
    category: "Business",
    example: "The subsidiary operates independently."
  },
  {
    word: "entrepreneur",
    phonetic: "/ˌɒntrəprəˈnɜːr/",
    meanings: ["起業家", "企業家", "事業家"],
    level: 3,
    category: "Business",
    example: "The entrepreneur started three companies."
  },
  {
    word: "meticulous",
    phonetic: "/məˈtɪkjələs/",
    meanings: ["細心な", "綿密な", "丁寧な"],
    level: 3,
    category: "Business",
    example: "She is meticulous in her work."
  },
  {
    word: "contingency",
    phonetic: "/kənˈtɪndʒənsi/",
    meanings: ["偶発事態", "緊急事態", "不測の事態"],
    level: 3,
    category: "Business",
    example: "We have a contingency plan ready."
  },
  {
    word: "depreciation",
    phonetic: "/dɪˌpriːʃiˈeɪʃn/",
    meanings: ["減価償却", "価値の減少", "下落"],
    level: 3,
    category: "Finance",
    example: "Depreciation affects the asset value."
  },
  {
    word: "litigation",
    phonetic: "/ˌlɪtɪˈɡeɪʃn/",
    meanings: ["訴訟", "法的手続き", "争訟"],
    level: 3,
    category: "Legal",
    example: "The litigation lasted for two years."
  },
  {
    word: "procurement",
    phonetic: "/prəˈkjʊərmənt/",
    meanings: ["調達", "購買", "獲得"],
    level: 3,
    category: "Business",
    example: "The procurement process is very strict."
  },
  {
    word: "jurisdiction",
    phonetic: "/ˌdʒʊrɪsˈdɪkʃn/",
    meanings: ["管轄権", "司法権", "権限"],
    level: 3,
    category: "Legal",
    example: "This falls under our jurisdiction."
  },
  {
    word: "amortization",
    phonetic: "/əˌmɔːrtɪˈzeɪʃn/",
    meanings: ["償却", "分割払い", "元金返済"],
    level: 3,
    category: "Finance",
    example: "The loan amortization schedule is 10 years."
  },

  // Level 4: Expert Business Terms
  {
    word: "perpetuity",
    phonetic: "/pərpəˈtuːəti/",
    meanings: ["永続性", "永久", "無期限"],
    level: 4,
    category: "Finance",
    example: "The bond pays interest in perpetuity."
  },
  {
    word: "exacerbate",
    phonetic: "/ɪɡˈzæsərbeɪt/",
    meanings: ["悪化させる", "激化させる", "増悪させる"],
    level: 4,
    category: "Business",
    example: "The delay will exacerbate the problem."
  },
  {
    word: "conglomerate",
    phonetic: "/kənˈɡlɒmərət/",
    meanings: ["複合企業", "コングロマリット", "集合体"],
    level: 4,
    category: "Business",
    example: "The conglomerate owns many companies."
  },
  {
    word: "fiduciary",
    phonetic: "/fɪˈduːʃəri/",
    meanings: ["受託者", "信託の", "信用に基づく"],
    level: 4,
    category: "Legal",
    example: "Directors have fiduciary duties to shareholders."
  },
  {
    word: "ubiquitous",
    phonetic: "/juːˈbɪkwətəs/",
    meanings: ["遍在する", "至る所にある", "普遍的な"],
    level: 4,
    category: "Business",
    example: "Smartphones are ubiquitous in modern society."
  },
  {
    word: "quintessential",
    phonetic: "/ˌkwɪntɪˈsenʃl/",
    meanings: ["典型的な", "本質的な", "純粋な"],
    level: 4,
    category: "Business",
    example: "He is the quintessential businessman."
  },
  {
    word: "indefatigable",
    phonetic: "/ˌɪndɪˈfætɪɡəbl/",
    meanings: ["不屈の", "疲れ知らずの", "精力的な"],
    level: 4,
    category: "Business",
    example: "Her indefatigable efforts led to success."
  },
  {
    word: "surreptitious",
    phonetic: "/ˌsʌrəpˈtɪʃəs/",
    meanings: ["秘密の", "隠密の", "こっそりの"],
    level: 4,
    category: "Business",
    example: "The surreptitious meeting was discovered."
  },
  {
    word: "perspicacious",
    phonetic: "/ˌpɜːrspɪˈkeɪʃəs/",
    meanings: ["洞察力のある", "鋭い", "明敏な"],
    level: 4,
    category: "Business",
    example: "His perspicacious analysis impressed everyone."
  },
  {
    word: "propitious",
    phonetic: "/prəˈpɪʃəs/",
    meanings: ["好都合な", "幸先の良い", "有利な"],
    level: 4,
    category: "Business",
    example: "The timing is propitious for expansion."
  },
  {
    word: "recalcitrant",
    phonetic: "/rɪˈkælsɪtrənt/",
    meanings: ["頑固な", "反抗的な", "従わない"],
    level: 4,
    category: "Business",
    example: "The recalcitrant employee refused to follow new procedures."
  },
  {
    word: "juxtaposition",
    phonetic: "/ˌdʒʌkstəpəˈzɪʃn/",
    meanings: ["並置", "並列", "対比"],
    level: 4,
    category: "Business",
    example: "The juxtaposition of old and new methods was striking."
  },
  {
    word: "ephemeral",
    phonetic: "/ɪˈfemərəl/",
    meanings: ["短命な", "一時的な", "はかない"],
    level: 4,
    category: "Business",
    example: "Market trends can be ephemeral."
  },
  {
    word: "ameliorate",
    phonetic: "/əˈmiːljəreɪt/",
    meanings: ["改善する", "向上させる", "緩和する"],
    level: 4,
    category: "Business",
    example: "New policies will ameliorate working conditions."
  },
  {
    word: "ecclesiastical",
    phonetic: "/ɪˌkliːziˈæstɪkl/",
    meanings: ["教会の", "聖職の", "宗教的な"],
    level: 4,
    category: "General",
    example: "The ecclesiastical hierarchy was restructured."
  },
  {
    word: "vicissitude",
    phonetic: "/vɪˈsɪsɪtuːd/",
    meanings: ["変遷", "浮き沈み", "変化"],
    level: 4,
    category: "Business",
    example: "Business faces many vicissitudes."
  },
  {
    word: "magnanimous",
    phonetic: "/mæɡˈnænəməs/",
    meanings: ["寛大な", "高潔な", "心の広い"],
    level: 4,
    category: "Business",
    example: "The CEO made a magnanimous gesture."
  },
  {
    word: "punctilious",
    phonetic: "/pʌŋkˈtɪljəs/",
    meanings: ["几帳面な", "細かい", "正確な"],
    level: 4,
    category: "Business",
    example: "She is punctilious about deadlines."
  },
  {
    word: "sagacious",
    phonetic: "/səˈɡeɪʃəs/",
    meanings: ["賢明な", "洞察力のある", "賢い"],
    level: 4,
    category: "Business",
    example: "The sagacious investor avoided the crash."
  },
  {
    word: "tenacious",
    phonetic: "/təˈneɪʃəs/",
    meanings: ["粘り強い", "執拗な", "しつこい"],
    level: 4,
    category: "Business",
    example: "Her tenacious efforts paid off."
  }
];

export default vocabularyDatabase;
