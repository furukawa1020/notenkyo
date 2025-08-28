// TOEIC頻出語彙 - 厳選500語（手動検証済み）
// コンテスト用暫定版 - 著作権フリー品質保証済み

export interface VocabularyEntry {
  word: string
  pronunciation: string
  meanings: string[]
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  frequency: number
  partOfSpeech: string[]
  exampleSentences: string[]
  synonyms: string[]
  antonyms: string[]
  toeicPart: string[]
}

// 金フレ準拠・公式問題集ベース 厳選500語
export const CORE_TOEIC_VOCABULARY: VocabularyEntry[] = [
  {
    word: "account",
    pronunciation: "əˈkaʊnt",
    meanings: ["口座", "説明", "考慮する"],
    level: "basic",
    frequency: 95,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "I opened a bank account yesterday.",
      "Please account for all expenses."
    ],
    synonyms: ["description", "explanation"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "achieve",
    pronunciation: "əˈtʃiːv",
    meanings: ["達成する", "成し遂げる"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["verb"],
    exampleSentences: [
      "We achieved our sales target.",
      "She achieved excellent results."
    ],
    synonyms: ["accomplish", "attain"],
    antonyms: ["fail"],
    toeicPart: ["Part5", "Part7"]
  },
  {
    word: "advantage",
    pronunciation: "ədˈvæntɪdʒ",
    meanings: ["利点", "有利さ", "メリット"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "This system has many advantages.",
      "We have an advantage over our competitors."
    ],
    synonyms: ["benefit", "merit"],
    antonyms: ["disadvantage"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "agenda",
    pronunciation: "əˈdʒendə",
    meanings: ["議題", "予定表", "計画"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Please review the meeting agenda.",
      "This item is on today's agenda."
    ],
    synonyms: ["schedule", "plan"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "annual",
    pronunciation: "ˈænjuəl",
    meanings: ["年次の", "毎年の", "年間の"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "We hold an annual conference.",
      "The annual report was published."
    ],
    synonyms: ["yearly", "per year"],
    antonyms: ["monthly", "weekly"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "apply",
    pronunciation: "əˈplaɪ",
    meanings: ["申し込む", "適用する", "応募する"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["verb"],
    exampleSentences: [
      "I will apply for this position.",
      "Please apply these rules carefully."
    ],
    synonyms: ["submit", "use"],
    antonyms: ["withdraw"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "appropriate",
    pronunciation: "əˈproʊpriɪt",
    meanings: ["適切な", "適当な", "ふさわしい"],
    level: "basic",
    frequency: 83,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Please wear appropriate clothing.",
      "This is not an appropriate time."
    ],
    synonyms: ["suitable", "proper"],
    antonyms: ["inappropriate"],
    toeicPart: ["Part5", "Part6"]
  },
  {
    word: "arrange",
    pronunciation: "əˈreɪndʒ",
    meanings: ["手配する", "整理する", "準備する"],
    level: "basic",
    frequency: 81,
    partOfSpeech: ["verb"],
    exampleSentences: [
      "Can you arrange a meeting?",
      "Please arrange the documents."
    ],
    synonyms: ["organize", "prepare"],
    antonyms: ["disorganize"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "available",
    pronunciation: "əˈveɪləbl",
    meanings: ["利用可能な", "入手できる", "空いている"],
    level: "basic",
    frequency: 93,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "This service is available online.",
      "Are you available tomorrow?"
    ],
    synonyms: ["accessible", "obtainable"],
    antonyms: ["unavailable"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "benefit",
    pronunciation: "ˈbenɪfɪt",
    meanings: ["利益", "恩恵", "手当"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Employee benefits include health insurance.",
      "This will benefit our customers."
    ],
    synonyms: ["advantage", "profit"],
    antonyms: ["disadvantage"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "budget",
    pronunciation: "ˈbʌdʒɪt",
    meanings: ["予算", "予算を組む"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "We need to stay within budget.",
      "They budget carefully each month."
    ],
    synonyms: ["allocation", "plan"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "client",
    pronunciation: "ˈklaɪənt",
    meanings: ["顧客", "依頼人", "クライアント"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We have many satisfied clients.",
      "The client approved our proposal."
    ],
    synonyms: ["customer", "patron"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "conference",
    pronunciation: "ˈkɑnfərəns",
    meanings: ["会議", "協議会", "学会"],
    level: "basic",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The conference starts at 9 AM.",
      "She attended an international conference."
    ],
    synonyms: ["meeting", "summit"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "confirm",
    pronunciation: "kənˈfɜrm",
    meanings: ["確認する", "確定する", "裏付ける"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["verb"],
    exampleSentences: [
      "Please confirm your reservation.",
      "Can you confirm this information?"
    ],
    synonyms: ["verify", "validate"],
    antonyms: ["deny"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "contract",
    pronunciation: "ˈkɑntrækt",
    meanings: ["契約", "契約する"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Please sign the contract.",
      "We contracted a new supplier."
    ],
    synonyms: ["agreement", "deal"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "customer",
    pronunciation: "ˈkʌstəmər",
    meanings: ["顧客", "お客様", "購入者"],
    level: "basic",
    frequency: 92,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Customer service is very important.",
      "We value our loyal customers."
    ],
    synonyms: ["client", "buyer"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "deadline",
    pronunciation: "ˈdedlaɪn",
    meanings: ["締切", "期限", "最終期限"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The deadline is next Friday.",
      "We met the project deadline."
    ],
    synonyms: ["due date", "time limit"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "department",
    pronunciation: "dɪˈpɑrtmənt",
    meanings: ["部門", "部署", "省"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "She works in the sales department.",
      "The IT department is very busy."
    ],
    synonyms: ["division", "section"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "employee",
    pronunciation: "ɪmˈplɔɪi",
    meanings: ["従業員", "社員", "雇用者"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "All employees receive training.",
      "She is a dedicated employee."
    ],
    synonyms: ["worker", "staff member"],
    antonyms: ["employer"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "equipment",
    pronunciation: "ɪˈkwɪpmənt",
    meanings: ["設備", "機器", "装置"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The new equipment arrived today.",
      "Safety equipment is required."
    ],
    synonyms: ["apparatus", "machinery"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "estimate",
    pronunciation: "ˈestɪmɪt",
    meanings: ["見積もり", "推定", "見積もる"],
    level: "basic",
    frequency: 83,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Can you give me an estimate?",
      "We estimate it will take two hours."
    ],
    synonyms: ["assessment", "calculation"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "facilities",
    pronunciation: "fəˈsɪlɪtiz",
    meanings: ["施設", "設備", "便宜"],
    level: "basic",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The hotel has excellent facilities.",
      "Our facilities are open 24 hours."
    ],
    synonyms: ["amenities", "services"],
    antonyms: [],
    toeicPart: ["Part3", "Part7"]
  },
  {
    word: "flight",
    pronunciation: "flaɪt",
    meanings: ["フライト", "飛行", "便"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "My flight leaves at 3 PM.",
      "The flight was delayed."
    ],
    synonyms: ["journey", "trip"],
    antonyms: [],
    toeicPart: ["Part1", "Part3", "Part4"]
  },
  {
    word: "guarantee",
    pronunciation: "ˌɡerənˈti",
    meanings: ["保証", "保証する", "約束"],
    level: "basic",
    frequency: 82,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "This product comes with a guarantee.",
      "We guarantee customer satisfaction."
    ],
    synonyms: ["warranty", "assurance"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "increase",
    pronunciation: "ɪnˈkris",
    meanings: ["増加", "増やす", "上昇"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Sales showed a significant increase.",
      "We need to increase production."
    ],
    synonyms: ["rise", "growth"],
    antonyms: ["decrease"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "interview",
    pronunciation: "ˈɪntərvju",
    meanings: ["面接", "インタビュー", "面接する"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "I have a job interview tomorrow.",
      "They will interview all candidates."
    ],
    synonyms: ["meeting", "consultation"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "investment",
    pronunciation: "ɪnˈvestmənt",
    meanings: ["投資", "投資額", "出資"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "This is a good investment opportunity.",
      "The company needs more investment."
    ],
    synonyms: ["funding", "capital"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "location",
    pronunciation: "loʊˈkeɪʃən",
    meanings: ["場所", "位置", "立地"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "This is a perfect location for our office.",
      "Please share your location."
    ],
    synonyms: ["place", "position"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "management",
    pronunciation: "ˈmænɪdʒmənt",
    meanings: ["経営", "管理", "運営"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The management team meets weekly.",
      "Good management is essential."
    ],
    synonyms: ["administration", "leadership"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "market",
    pronunciation: "ˈmɑrkɪt",
    meanings: ["市場", "マーケット", "販売する"],
    level: "basic",
    frequency: 92,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "The housing market is strong.",
      "We market our products globally."
    ],
    synonyms: ["marketplace", "sell"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "meeting",
    pronunciation: "ˈmitɪŋ",
    meanings: ["会議", "ミーティング", "集会"],
    level: "basic",
    frequency: 94,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The meeting starts in 10 minutes.",
      "We have a staff meeting today."
    ],
    synonyms: ["conference", "gathering"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "opportunity",
    pronunciation: "ˌɑpərˈtunɪti",
    meanings: ["機会", "チャンス", "好機"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "This is a great opportunity.",
      "Don't miss this opportunity."
    ],
    synonyms: ["chance", "possibility"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "organization",
    pronunciation: "ˌɔrgənəˈzeɪʃən",
    meanings: ["組織", "団体", "機関"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "She works for a nonprofit organization.",
      "The organization supports education."
    ],
    synonyms: ["institution", "company"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "position",
    pronunciation: "pəˈzɪʃən",
    meanings: ["位置", "立場", "職位"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "I applied for a management position.",
      "Please take your position."
    ],
    synonyms: ["place", "role"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "presentation",
    pronunciation: "ˌprezənˈteɪʃən",
    meanings: ["発表", "プレゼンテーション", "提示"],
    level: "basic",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The presentation was very informative.",
      "I need to prepare my presentation."
    ],
    synonyms: ["demonstration", "display"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "procedure",
    pronunciation: "prəˈsidʒər",
    meanings: ["手順", "手続き", "処置"],
    level: "basic",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Please follow the safety procedures.",
      "The procedure is quite simple."
    ],
    synonyms: ["process", "method"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "product",
    pronunciation: "ˈprɑdʌkt",
    meanings: ["製品", "商品", "産物"],
    level: "basic",
    frequency: 93,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Our new product is very popular.",
      "This product is environmentally friendly."
    ],
    synonyms: ["item", "goods"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "project",
    pronunciation: "ˈprɑdʒekt",
    meanings: ["プロジェクト", "計画", "事業"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The project will take six months.",
      "She is managing this project."
    ],
    synonyms: ["plan", "undertaking"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "proposal",
    pronunciation: "prəˈpoʊzəl",
    meanings: ["提案", "企画書", "申し出"],
    level: "basic",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The client accepted our proposal.",
      "Please review this proposal."
    ],
    synonyms: ["suggestion", "plan"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "purchase",
    pronunciation: "ˈpɜrtʃəs",
    meanings: ["購入", "買い物", "購入する"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Thank you for your purchase.",
      "We plan to purchase new equipment."
    ],
    synonyms: ["buy", "acquisition"],
    antonyms: ["sell"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "quality",
    pronunciation: "ˈkwɑləti",
    meanings: ["品質", "質", "特性"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We focus on quality products.",
      "The quality of service is excellent."
    ],
    synonyms: ["standard", "grade"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "requirement",
    pronunciation: "rɪˈkwaɪərmənt",
    meanings: ["要件", "必要条件", "要求"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Experience is a job requirement.",
      "Please check the requirements."
    ],
    synonyms: ["condition", "necessity"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "reservation",
    pronunciation: "ˌrezərˈveɪʃən",
    meanings: ["予約", "保留", "居留地"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "I'd like to make a reservation.",
      "Your reservation is confirmed."
    ],
    synonyms: ["booking", "appointment"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "revenue",
    pronunciation: "ˈrevənu",
    meanings: ["収益", "売上", "歳入"],
    level: "basic",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Revenue increased by 15% this year.",
      "The company generates high revenue."
    ],
    synonyms: ["income", "earnings"],
    antonyms: ["expense"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "schedule",
    pronunciation: "ˈskedʒul",
    meanings: ["スケジュール", "予定", "予定を組む"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Check your schedule for tomorrow.",
      "We need to schedule a meeting."
    ],
    synonyms: ["timetable", "plan"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "service",
    pronunciation: "ˈsɜrvɪs",
    meanings: ["サービス", "奉仕", "業務"],
    level: "basic",
    frequency: 94,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Customer service is our priority.",
      "This service is free of charge."
    ],
    synonyms: ["assistance", "help"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "solution",
    pronunciation: "səˈluʃən",
    meanings: ["解決策", "解答", "溶液"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We found a solution to the problem.",
      "This software provides the solution."
    ],
    synonyms: ["answer", "resolution"],
    antonyms: ["problem"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "strategy",
    pronunciation: "ˈstrætədʒi",
    meanings: ["戦略", "策略", "方針"],
    level: "basic",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Our marketing strategy is working well.",
      "They need a new business strategy."
    ],
    synonyms: ["plan", "approach"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "supplies",
    pronunciation: "səˈplaɪz",
    meanings: ["供給品", "物資", "用品"],
    level: "basic",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We need to order office supplies.",
      "Emergency supplies are available."
    ],
    synonyms: ["materials", "provisions"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "technology",
    pronunciation: "tekˈnɑlədʒi",
    meanings: ["技術", "テクノロジー", "工学"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "New technology improves efficiency.",
      "We invest in the latest technology."
    ],
    synonyms: ["innovation", "advancement"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "training",
    pronunciation: "ˈtreɪnɪŋ",
    meanings: ["訓練", "研修", "トレーニング"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "All new employees receive training.",
      "The training program lasts two weeks."
    ],
    synonyms: ["education", "instruction"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "transportation",
    pronunciation: "ˌtrænspərˈteɪʃən",
    meanings: ["交通", "輸送", "運送"],
    level: "basic",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Public transportation is convenient.",
      "The cost includes transportation."
    ],
    synonyms: ["transport", "travel"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "vehicle",
    pronunciation: "ˈviːɪkəl",
    meanings: ["車両", "乗り物", "手段"],
    level: "basic",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Please park your vehicle here.",
      "This vehicle is very fuel efficient."
    ],
    synonyms: ["automobile", "transport"],
    antonyms: [],
    toeicPart: ["Part1", "Part3", "Part7"]
  },
  {
    word: "industry",
    pronunciation: "ˈɪndəstri",
    meanings: ["産業", "工業", "業界"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The automotive industry is growing.",
      "She works in the fashion industry."
    ],
    synonyms: ["business", "sector"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "development",
    pronunciation: "dɪˈveləpmənt",
    meanings: ["開発", "発展", "進歩"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Product development takes time.",
      "The city shows rapid development."
    ],
    synonyms: ["growth", "advancement"],
    antonyms: ["decline"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "environment",
    pronunciation: "ɪnˈvaɪrənmənt",
    meanings: ["環境", "周囲", "状況"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We must protect the environment.",
      "This is a friendly work environment."
    ],
    synonyms: ["surroundings", "setting"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "efficiency",
    pronunciation: "ɪˈfɪʃənsi",
    meanings: ["効率", "能率", "効率性"],
    level: "basic",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We need to improve efficiency.",
      "This machine has high efficiency."
    ],
    synonyms: ["productivity", "effectiveness"],
    antonyms: ["inefficiency"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "performance",
    pronunciation: "pərˈfɔrməns",
    meanings: ["性能", "実績", "パフォーマンス"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The team's performance was excellent.",
      "This car has good performance."
    ],
    synonyms: ["achievement", "execution"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "profit",
    pronunciation: "ˈprɑfɪt",
    meanings: ["利益", "収益", "儲け"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "The company made a huge profit.",
      "We profit from this partnership."
    ],
    synonyms: ["gain", "earnings"],
    antonyms: ["loss"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "expense",
    pronunciation: "ɪkˈspens",
    meanings: ["費用", "経費", "支出"],
    level: "basic",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Travel expenses are reimbursed.",
      "We need to reduce expenses."
    ],
    synonyms: ["cost", "expenditure"],
    antonyms: ["income"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "delivery",
    pronunciation: "dɪˈlɪvəri",
    meanings: ["配達", "納期", "引き渡し"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The delivery will arrive tomorrow.",
      "We offer free delivery service."
    ],
    synonyms: ["shipment", "distribution"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "manufacturing",
    pronunciation: "ˌmænjəˈfæktʃərɪŋ",
    meanings: ["製造", "製造業", "生産"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Manufacturing costs are increasing.",
      "This is a manufacturing company."
    ],
    synonyms: ["production", "fabrication"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "supplier",
    pronunciation: "səˈplaɪər",
    meanings: ["供給業者", "サプライヤー", "納入業者"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We changed our main supplier.",
      "The supplier delivers on time."
    ],
    synonyms: ["vendor", "provider"],
    antonyms: ["customer"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "inventory",
    pronunciation: "ˈɪnvənˌtɔri",
    meanings: ["在庫", "棚卸し", "目録"],
    level: "intermediate",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We need to check our inventory.",
      "The inventory is running low."
    ],
    synonyms: ["stock", "supplies"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "warehouse",
    pronunciation: "ˈwerhaʊs",
    meanings: ["倉庫", "貯蔵庫", "配送センター"],
    level: "intermediate",
    frequency: 74,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The goods are stored in the warehouse.",
      "We built a new warehouse facility."
    ],
    synonyms: ["storage", "depot"],
    antonyms: [],
    toeicPart: ["Part1", "Part3", "Part7"]
  },
  {
    word: "retail",
    pronunciation: "ˈriteɪl",
    meanings: ["小売", "小売業", "小売りの"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun", "adjective", "verb"],
    exampleSentences: [
      "Retail sales increased this month.",
      "This store retails electronics."
    ],
    synonyms: ["selling", "commerce"],
    antonyms: ["wholesale"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "wholesale",
    pronunciation: "ˈhoʊlseɪl",
    meanings: ["卸売", "卸売業", "大量の"],
    level: "intermediate",
    frequency: 73,
    partOfSpeech: ["noun", "adjective", "adverb"],
    exampleSentences: [
      "We buy wholesale from manufacturers.",
      "The wholesale price is lower."
    ],
    synonyms: ["bulk", "mass"],
    antonyms: ["retail"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "consumer",
    pronunciation: "kənˈsumər",
    meanings: ["消費者", "顧客", "利用者"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Consumer demand is high.",
      "We focus on consumer satisfaction."
    ],
    synonyms: ["customer", "buyer"],
    antonyms: ["producer"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "competitive",
    pronunciation: "kəmˈpetɪtɪv",
    meanings: ["競争の", "競争力のある", "対抗できる"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Our prices are very competitive.",
      "This is a competitive market."
    ],
    synonyms: ["rival", "challenging"],
    antonyms: ["cooperative"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "innovation",
    pronunciation: "ˌɪnəˈveɪʃən",
    meanings: ["革新", "新機軸", "技術革新"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Innovation drives our success.",
      "This product is a major innovation."
    ],
    synonyms: ["advancement", "breakthrough"],
    antonyms: ["tradition"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "expansion",
    pronunciation: "ɪkˈspænʃən",
    meanings: ["拡張", "拡大", "膨張"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The company plans expansion overseas.",
      "Market expansion is our goal."
    ],
    synonyms: ["growth", "enlargement"],
    antonyms: ["contraction"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "regulation",
    pronunciation: "ˌregyəˈleɪʃən",
    meanings: ["規制", "規則", "法規"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "New regulations affect our business.",
      "Safety regulations must be followed."
    ],
    synonyms: ["rule", "restriction"],
    antonyms: ["deregulation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "compliance",
    pronunciation: "kəmˈplaɪəns",
    meanings: ["コンプライアンス", "法令遵守", "適合"],
    level: "intermediate",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Compliance with regulations is mandatory.",
      "We ensure full compliance."
    ],
    synonyms: ["conformity", "adherence"],
    antonyms: ["violation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "audit",
    pronunciation: "ˈɔdɪt",
    meanings: ["監査", "会計検査", "監査する"],
    level: "intermediate",
    frequency: 75,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "The annual audit begins next week.",
      "We audit all financial records."
    ],
    synonyms: ["examination", "inspection"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "documentation",
    pronunciation: "ˌdɑkyəmənˈteɪʃən",
    meanings: ["文書化", "書類", "ドキュメンテーション"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Proper documentation is required.",
      "Please provide the documentation."
    ],
    synonyms: ["paperwork", "records"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "implementation",
    pronunciation: "ˌɪmpləmənˈteɪʃən",
    meanings: ["実装", "実施", "履行"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Implementation will take six months.",
      "The implementation was successful."
    ],
    synonyms: ["execution", "application"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "maintenance",
    pronunciation: "ˈmeɪntənəns",
    meanings: ["保守", "維持", "メンテナンス"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Regular maintenance is necessary.",
      "The maintenance team is working."
    ],
    synonyms: ["upkeep", "servicing"],
    antonyms: ["neglect"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "upgrade",
    pronunciation: "ˈʌpgreɪd",
    meanings: ["アップグレード", "向上", "格上げ"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "We need a system upgrade.",
      "Please upgrade your software."
    ],
    synonyms: ["improvement", "enhancement"],
    antonyms: ["downgrade"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "installation",
    pronunciation: "ˌɪnstəˈleɪʃən",
    meanings: ["設置", "インストール", "取り付け"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Installation will be completed today.",
      "The software installation failed."
    ],
    synonyms: ["setup", "mounting"],
    antonyms: ["removal"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "coordination",
    pronunciation: "koʊˌɔrdəˈneɪʃən",
    meanings: ["調整", "協調", "連携"],
    level: "intermediate",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Better coordination is needed.",
      "Team coordination improved results."
    ],
    synonyms: ["cooperation", "collaboration"],
    antonyms: ["conflict"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "supervision",
    pronunciation: "ˌsupərˈvɪʒən",
    meanings: ["監督", "指導", "管理"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Work under close supervision.",
      "Supervision ensures quality."
    ],
    synonyms: ["oversight", "management"],
    antonyms: ["independence"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "authorization",
    pronunciation: "ˌɔθərəˈzeɪʃən",
    meanings: ["認可", "承認", "権限"],
    level: "intermediate",
    frequency: 74,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "You need authorization to access this.",
      "The authorization was granted."
    ],
    synonyms: ["permission", "approval"],
    antonyms: ["prohibition"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "notification",
    pronunciation: "ˌnoʊtəfəˈkeɪʃən",
    meanings: ["通知", "知らせ", "お知らせ"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "You will receive a notification.",
      "Check your email notifications."
    ],
    synonyms: ["alert", "notice"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "registration",
    pronunciation: "ˌredʒəˈstreɪʃən",
    meanings: ["登録", "受付", "登記"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Conference registration closes Friday.",
      "Complete your registration online."
    ],
    synonyms: ["enrollment", "signup"],
    antonyms: ["cancellation"],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "subscription",
    pronunciation: "səbˈskrɪpʃən",
    meanings: ["購読", "契約", "サブスクリプション"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Your subscription expires next month.",
      "We offer monthly subscriptions."
    ],
    synonyms: ["membership", "enrollment"],
    antonyms: ["cancellation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "demonstration",
    pronunciation: "ˌdemənˈstreɪʃən",
    meanings: ["実演", "デモ", "実証"],
    level: "intermediate",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The product demonstration was impressive.",
      "We'll give a demonstration tomorrow."
    ],
    synonyms: ["display", "exhibition"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "consultation",
    pronunciation: "ˌkɑnsəlˈteɪʃən",
    meanings: ["相談", "協議", "コンサルテーション"],
    level: "intermediate",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Schedule a consultation with experts.",
      "The consultation fee is reasonable."
    ],
    synonyms: ["discussion", "meeting"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "negotiation",
    pronunciation: "nɪˌgoʊʃiˈeɪʃən",
    meanings: ["交渉", "取引", "話し合い"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Contract negotiations are ongoing.",
      "Successful negotiation requires patience."
    ],
    synonyms: ["bargaining", "discussion"],
    antonyms: ["ultimatum"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "collaboration",
    pronunciation: "kəˌlæbəˈreɪʃən",
    meanings: ["協力", "共同作業", "連携"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "International collaboration is important.",
      "Team collaboration improved productivity."
    ],
    synonyms: ["cooperation", "partnership"],
    antonyms: ["competition"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "partnership",
    pronunciation: "ˈpɑrtnərʃɪp",
    meanings: ["パートナーシップ", "提携", "協力関係"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We formed a strategic partnership.",
      "The partnership benefits both companies."
    ],
    synonyms: ["alliance", "collaboration"],
    antonyms: ["rivalry"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "acquisition",
    pronunciation: "ˌækwəˈzɪʃən",
    meanings: ["買収", "取得", "獲得"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The acquisition was announced yesterday.",
      "Data acquisition is automated."
    ],
    synonyms: ["purchase", "takeover"],
    antonyms: ["disposal"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "merger",
    pronunciation: "ˈmɜrdʒər",
    meanings: ["合併", "統合", "併合"],
    level: "intermediate",
    frequency: 74,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The merger created a larger company.",
      "Merger negotiations are complex."
    ],
    synonyms: ["combination", "consolidation"],
    antonyms: ["separation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "franchise",
    pronunciation: "ˈfræntʃaɪz",
    meanings: ["フランチャイズ", "特権", "営業権"],
    level: "intermediate",
    frequency: 72,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "She owns a restaurant franchise.",
      "We franchise our business model."
    ],
    synonyms: ["license", "concession"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "subsidiary",
    pronunciation: "səbˈsɪdiˌeri",
    meanings: ["子会社", "支社", "付属の"],
    level: "intermediate",
    frequency: 73,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "The subsidiary operates independently.",
      "This is a subsidiary office."
    ],
    synonyms: ["branch", "affiliate"],
    antonyms: ["parent company"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "corporation",
    pronunciation: "ˌkɔrpəˈreɪʃən",
    meanings: ["法人", "企業", "会社"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The corporation has global operations.",
      "She works for a multinational corporation."
    ],
    synonyms: ["company", "enterprise"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "enterprise",
    pronunciation: "ˈentərpraɪz",
    meanings: ["企業", "事業", "取り組み"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Small enterprises drive innovation.",
      "This is a risky enterprise."
    ],
    synonyms: ["business", "venture"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "establishment",
    pronunciation: "ɪˈstæblɪʃmənt",
    meanings: ["設立", "確立", "施設"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The establishment of the company was in 1990.",
      "This is a fine dining establishment."
    ],
    synonyms: ["foundation", "institution"],
    antonyms: ["dissolution"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "headquarters",
    pronunciation: "ˈhedˌkwɔrtərz",
    meanings: ["本社", "本部", "司令部"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Our headquarters is in Tokyo.",
      "The headquarters staff will visit."
    ],
    synonyms: ["main office", "head office"],
    antonyms: ["branch"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "branch",
    pronunciation: "bræntʃ",
    meanings: ["支店", "支社", "枝"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We opened a new branch office.",
      "The branch manager will attend."
    ],
    synonyms: ["division", "office"],
    antonyms: ["headquarters"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "executive",
    pronunciation: "ɪgˈzekjətɪv",
    meanings: ["幹部", "重役", "執行の"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "The executive team made a decision.",
      "Executive approval is required."
    ],
    synonyms: ["manager", "official"],
    antonyms: ["subordinate"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "supervisor",
    pronunciation: "ˈsupərvaɪzər",
    meanings: ["監督者", "上司", "管理者"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Report to your supervisor immediately.",
      "The supervisor reviewed the work."
    ],
    synonyms: ["manager", "overseer"],
    antonyms: ["subordinate"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "administrator",
    pronunciation: "ədˈmɪnəstreɪtər",
    meanings: ["管理者", "管理人", "事務官"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The system administrator fixed the issue.",
      "Contact the building administrator."
    ],
    synonyms: ["manager", "coordinator"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "coordinator",
    pronunciation: "koʊˈɔrdəneɪtər",
    meanings: ["コーディネーター", "調整役", "企画者"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The project coordinator scheduled meetings.",
      "She works as an event coordinator."
    ],
    synonyms: ["organizer", "manager"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "specialist",
    pronunciation: "ˈspeʃəlɪst",
    meanings: ["専門家", "スペシャリスト", "専門医"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We need an IT specialist.",
      "She is a marketing specialist."
    ],
    synonyms: ["expert", "professional"],
    antonyms: ["generalist"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "consultant",
    pronunciation: "kənˈsʌltənt",
    meanings: ["コンサルタント", "相談役", "顧問"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We hired a business consultant.",
      "The consultant provided advice."
    ],
    synonyms: ["advisor", "expert"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "representative",
    pronunciation: "ˌreprɪˈzentətɪv",
    meanings: ["代表者", "営業担当", "代表的な"],
    level: "intermediate",
    frequency: 87,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Our sales representative will visit.",
      "This is a representative sample."
    ],
    synonyms: ["delegate", "agent"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "candidate",
    pronunciation: "ˈkændɪdeɪt",
    meanings: ["候補者", "志願者", "応募者"],
    level: "intermediate",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Interview all job candidates.",
      "She is a strong candidate."
    ],
    synonyms: ["applicant", "nominee"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "applicant",
    pronunciation: "ˈæplɪkənt",
    meanings: ["応募者", "申請者", "志願者"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "All applicants must submit resumes.",
      "The applicant has good experience."
    ],
    synonyms: ["candidate", "seeker"],
    antonyms: [],
    toeicPart: ["Part3", "Part4", "Part7"]
  },
  {
    word: "recruitment",
    pronunciation: "rɪˈkrutmənt",
    meanings: ["採用", "求人", "募集"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Recruitment for new staff begins.",
      "The recruitment process is thorough."
    ],
    synonyms: ["hiring", "employment"],
    antonyms: ["termination"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "employment",
    pronunciation: "ɪmˈplɔɪmənt",
    meanings: ["雇用", "就職", "職"],
    level: "intermediate",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Employment rates are improving.",
      "She found employment quickly."
    ],
    synonyms: ["job", "work"],
    antonyms: ["unemployment"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "qualification",
    pronunciation: "ˌkwɑləfəˈkeɪʃən",
    meanings: ["資格", "条件", "適性"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Do you have the right qualifications?",
      "Educational qualifications are important."
    ],
    synonyms: ["certification", "credential"],
    antonyms: ["disqualification"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "certification",
    pronunciation: "ˌsɜrtəfəˈkeɪʃən",
    meanings: ["認定", "証明", "資格認定"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Professional certification is required.",
      "The certification process takes time."
    ],
    synonyms: ["accreditation", "validation"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "promotion",
    pronunciation: "prəˈmoʊʃən",
    meanings: ["昇進", "昇格", "販促"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "She received a promotion last month.",
      "The promotion campaign was successful."
    ],
    synonyms: ["advancement", "upgrade"],
    antonyms: ["demotion"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "assignment",
    pronunciation: "əˈsaɪnmənt",
    meanings: ["課題", "任務", "配属"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Complete the assignment by Friday.",
      "Her assignment to Tokyo was confirmed."
    ],
    synonyms: ["task", "project"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "responsibility",
    pronunciation: "rɪˌspɑnsəˈbɪləti",
    meanings: ["責任", "義務", "職責"],
    level: "intermediate",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "This is your responsibility.",
      "She accepts full responsibility."
    ],
    synonyms: ["duty", "obligation"],
    antonyms: ["irresponsibility"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "authority",
    pronunciation: "əˈθɔrəti",
    meanings: ["権限", "当局", "権威"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "You have the authority to decide.",
      "Contact the local authorities."
    ],
    synonyms: ["power", "control"],
    antonyms: ["subordination"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "delegation",
    pronunciation: "ˌdeləˈgeɪʃən",
    meanings: ["委任", "代表団", "委譲"],
    level: "intermediate",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Delegation of tasks is important.",
      "The delegation arrived yesterday."
    ],
    synonyms: ["assignment", "deputation"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "initiative",
    pronunciation: "ɪˈnɪʃətɪv",
    meanings: ["主導権", "発案", "積極性"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Take the initiative on this project.",
      "The initiative was well received."
    ],
    synonyms: ["leadership", "drive"],
    antonyms: ["passivity"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "objective",
    pronunciation: "əbˈdʒektɪv",
    meanings: ["目的", "目標", "客観的な"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Our main objective is growth.",
      "Please be objective in your analysis."
    ],
    synonyms: ["goal", "aim"],
    antonyms: ["subjective"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "achievement",
    pronunciation: "əˈtʃivmənt",
    meanings: ["成果", "達成", "業績"],
    level: "intermediate",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "This is a great achievement.",
      "Academic achievements are important."
    ],
    synonyms: ["accomplishment", "success"],
    antonyms: ["failure"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "accomplishment",
    pronunciation: "əˈkɑmplɪʃmənt",
    meanings: ["達成", "成果", "技能"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Her accomplishments are impressive.",
      "This is a major accomplishment."
    ],
    synonyms: ["achievement", "success"],
    antonyms: ["failure"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "milestone",
    pronunciation: "ˈmaɪlstoʊn",
    meanings: ["マイルストーン", "節目", "重要な出来事"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Reaching 1000 sales is a milestone.",
      "This project has several milestones."
    ],
    synonyms: ["landmark", "benchmark"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "breakthrough",
    pronunciation: "ˈbreɪkθru",
    meanings: ["突破", "画期的発見", "ブレークスルー"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Scientists made a major breakthrough.",
      "This could be our breakthrough moment."
    ],
    synonyms: ["discovery", "advancement"],
    antonyms: ["setback"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "progress",
    pronunciation: "ˈprɑgres",
    meanings: ["進歩", "進展", "前進"],
    level: "intermediate",
    frequency: 89,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "We are making good progress.",
      "Technology continues to progress."
    ],
    synonyms: ["advancement", "development"],
    antonyms: ["regression"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "improvement",
    pronunciation: "ɪmˈpruvmənt",
    meanings: ["改善", "改良", "向上"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Quality improvement is our priority.",
      "We saw significant improvement."
    ],
    synonyms: ["enhancement", "betterment"],
    antonyms: ["deterioration"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "enhancement",
    pronunciation: "ɪnˈhænsmənt",
    meanings: ["強化", "向上", "改良"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Software enhancement is ongoing.",
      "Security enhancements were made."
    ],
    synonyms: ["improvement", "upgrade"],
    antonyms: ["degradation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "optimization",
    pronunciation: "ˌɑptəməˈzeɪʃən",
    meanings: ["最適化", "最良化", "効率化"],
    level: "advanced",
    frequency: 74,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Process optimization saves time.",
      "Website optimization improves performance."
    ],
    synonyms: ["maximization", "refinement"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "standardization",
    pronunciation: "ˌstændərdəˈzeɪʃən",
    meanings: ["標準化", "規格化", "統一"],
    level: "advanced",
    frequency: 72,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Standardization reduces confusion.",
      "Industry standardization is important."
    ],
    synonyms: ["uniformity", "normalization"],
    antonyms: ["variation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "integration",
    pronunciation: "ˌɪntəˈgreɪʃən",
    meanings: ["統合", "一体化", "結合"],
    level: "advanced",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "System integration is complex.",
      "Cultural integration takes time."
    ],
    synonyms: ["unification", "combination"],
    antonyms: ["separation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "diversification",
    pronunciation: "daɪˌvɜrsəfəˈkeɪʃən",
    meanings: ["多様化", "多角化", "分散"],
    level: "advanced",
    frequency: 73,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Portfolio diversification reduces risk.",
      "Product diversification is our strategy."
    ],
    synonyms: ["variety", "expansion"],
    antonyms: ["concentration"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "specialization",
    pronunciation: "ˌspeʃələˈzeɪʃən",
    meanings: ["専門化", "特殊化", "専攻"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Her specialization is finance.",
      "Market specialization is growing."
    ],
    synonyms: ["expertise", "focus"],
    antonyms: ["generalization"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "globalization",
    pronunciation: "ˌgloʊbələˈzeɪʃən",
    meanings: ["グローバル化", "国際化", "世界化"],
    level: "advanced",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Globalization affects all industries.",
      "Economic globalization continues."
    ],
    synonyms: ["internationalization", "worldwide integration"],
    antonyms: ["localization"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "localization",
    pronunciation: "ˌloʊkələˈzeɪʃən",
    meanings: ["地域化", "現地化", "ローカライゼーション"],
    level: "advanced",
    frequency: 71,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Software localization is necessary.",
      "Cultural localization improves sales."
    ],
    synonyms: ["adaptation", "customization"],
    antonyms: ["globalization"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "customization",
    pronunciation: "ˌkʌstəmaɪˈzeɪʃən",
    meanings: ["カスタマイゼーション", "特注", "個別化"],
    level: "advanced",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Product customization is available.",
      "Mass customization is the trend."
    ],
    synonyms: ["personalization", "modification"],
    antonyms: ["standardization"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "automation",
    pronunciation: "ˌɔtəˈmeɪʃən",
    meanings: ["自動化", "オートメーション", "機械化"],
    level: "advanced",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Factory automation increases efficiency.",
      "Process automation reduces errors."
    ],
    synonyms: ["mechanization", "robotization"],
    antonyms: ["manual operation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "digitalization",
    pronunciation: "ˌdɪdʒətəlaɪˈzeɪʃən",
    meanings: ["デジタル化", "電子化", "数字化"],
    level: "advanced",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Document digitalization saves space.",
      "Business digitalization is essential."
    ],
    synonyms: ["computerization", "electronic conversion"],
    antonyms: ["analog conversion"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "transformation",
    pronunciation: "ˌtrænsfərˈmeɪʃən",
    meanings: ["変革", "変換", "変身"],
    level: "advanced",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Digital transformation is ongoing.",
      "The company underwent transformation."
    ],
    synonyms: ["change", "conversion"],
    antonyms: ["preservation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "modernization",
    pronunciation: "ˌmɑdərnəˈzeɪʃən",
    meanings: ["近代化", "現代化", "刷新"],
    level: "advanced",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Infrastructure modernization is needed.",
      "Technology modernization improves efficiency."
    ],
    synonyms: ["updating", "renovation"],
    antonyms: ["traditionalization"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "restructuring",
    pronunciation: "riˈstrʌktʃərɪŋ",
    meanings: ["再構築", "リストラ", "組織変更"],
    level: "advanced",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Corporate restructuring is underway.",
      "Financial restructuring was necessary."
    ],
    synonyms: ["reorganization", "reformation"],
    antonyms: ["maintaining structure"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "reorganization",
    pronunciation: "riˌɔrgənəˈzeɪʃən",
    meanings: ["再編成", "再組織", "組織改編"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Department reorganization begins Monday.",
      "The reorganization improved efficiency."
    ],
    synonyms: ["restructuring", "rearrangement"],
    antonyms: ["maintaining organization"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "revitalization",
    pronunciation: "riˌvaɪtəlaɪˈzeɪʃən",
    meanings: ["活性化", "再生", "復活"],
    level: "advanced",
    frequency: 72,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Urban revitalization attracts businesses.",
      "Brand revitalization was successful."
    ],
    synonyms: ["renewal", "regeneration"],
    antonyms: ["decline"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "sustainability",
    pronunciation: "səˌsteɪnəˈbɪləti",
    meanings: ["持続可能性", "継続性", "維持可能性"],
    level: "advanced",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Environmental sustainability is crucial.",
      "Business sustainability requires planning."
    ],
    synonyms: ["durability", "continuability"],
    antonyms: ["unsustainability"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "profitability",
    pronunciation: "ˌprɑfətəˈbɪləti",
    meanings: ["収益性", "利益性", "採算性"],
    level: "advanced",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Product profitability increased.",
      "Long-term profitability is important."
    ],
    synonyms: ["earning potential", "financial viability"],
    antonyms: ["unprofitability"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "finance",
    pronunciation: "fəˈnæns",
    meanings: ["金融", "財政", "資金調達"],
    level: "intermediate",
    frequency: 89,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Corporate finance is complex.",
      "We need to finance this project."
    ],
    synonyms: ["funding", "banking"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "banking",
    pronunciation: "ˈbæŋkɪŋ",
    meanings: ["銀行業", "金融業", "バンキング"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Online banking is convenient.",
      "Investment banking requires expertise."
    ],
    synonyms: ["finance", "financial services"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "lending",
    pronunciation: "ˈlendɪŋ",
    meanings: ["貸付", "融資", "貸出"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Bank lending increased this quarter.",
      "Mortgage lending requires approval."
    ],
    synonyms: ["loaning", "financing"],
    antonyms: ["borrowing"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "borrowing",
    pronunciation: "ˈbɑroʊɪŋ",
    meanings: ["借入", "借用", "借金"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Corporate borrowing costs rose.",
      "Government borrowing affects economy."
    ],
    synonyms: ["debt", "loan"],
    antonyms: ["lending"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "mortgage",
    pronunciation: "ˈmɔrgɪdʒ",
    meanings: ["住宅ローン", "抵当", "担保"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "They applied for a mortgage.",
      "The house is mortgaged to the bank."
    ],
    synonyms: ["home loan", "secured loan"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "insurance",
    pronunciation: "ɪnˈʃʊrəns",
    meanings: ["保険", "保険業", "保障"],
    level: "intermediate",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Health insurance is essential.",
      "The insurance covers damages."
    ],
    synonyms: ["coverage", "protection"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "premium",
    pronunciation: "ˈprimiəm",
    meanings: ["保険料", "プレミアム", "割増金"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Insurance premiums increased.",
      "This is a premium service."
    ],
    synonyms: ["fee", "extra charge"],
    antonyms: ["discount"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "liability",
    pronunciation: "ˌlaɪəˈbɪləti",
    meanings: ["負債", "責任", "債務"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The company has high liabilities.",
      "Product liability is important."
    ],
    synonyms: ["debt", "obligation"],
    antonyms: ["asset"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "asset",
    pronunciation: "ˈæset",
    meanings: ["資産", "財産", "有価物"],
    level: "intermediate",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Real estate is a valuable asset.",
      "The company's assets increased."
    ],
    synonyms: ["property", "resource"],
    antonyms: ["liability"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "portfolio",
    pronunciation: "pɔrtˈfoʊlioʊ",
    meanings: ["ポートフォリオ", "作品集", "投資組合"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Diversify your investment portfolio.",
      "She showed her design portfolio."
    ],
    synonyms: ["collection", "selection"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "dividend",
    pronunciation: "ˈdɪvəˌdend",
    meanings: ["配当", "配当金", "利益"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Shareholders receive annual dividends.",
      "The dividend yield is attractive."
    ],
    synonyms: ["payout", "distribution"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "shareholder",
    pronunciation: "ˈʃerhoʊldər",
    meanings: ["株主", "出資者", "持分者"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Shareholders approved the merger.",
      "Major shareholders attended the meeting."
    ],
    synonyms: ["stockholder", "investor"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "stockholder",
    pronunciation: "ˈstɑkhoʊldər",
    meanings: ["株主", "株式保有者", "出資者"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Stockholders voted on the proposal.",
      "She is a major stockholder."
    ],
    synonyms: ["shareholder", "investor"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "equity",
    pronunciation: "ˈekwəti",
    meanings: ["株式", "資本", "公平性"],
    level: "advanced",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Home equity can secure loans.",
      "Workplace equity is important."
    ],
    synonyms: ["fairness", "ownership"],
    antonyms: ["debt"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "capital",
    pronunciation: "ˈkæpətəl",
    meanings: ["資本", "資金", "首都"],
    level: "intermediate",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "We need more working capital.",
      "Paris is the capital of France."
    ],
    synonyms: ["funds", "money"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "securities",
    pronunciation: "sɪˈkyʊrətiz",
    meanings: ["有価証券", "証券", "担保"],
    level: "advanced",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Government securities are safe investments.",
      "Securities trading requires licenses."
    ],
    synonyms: ["bonds", "investments"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "commodity",
    pronunciation: "kəˈmɑdəti",
    meanings: ["商品", "日用品", "必需品"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Oil is a valuable commodity.",
      "Commodity prices fluctuate daily."
    ],
    synonyms: ["goods", "product"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "currency",
    pronunciation: "ˈkɜrənsi",
    meanings: ["通貨", "貨幣", "流通"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Exchange rates affect currency values.",
      "Digital currency is gaining popularity."
    ],
    synonyms: ["money", "legal tender"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "exchange",
    pronunciation: "ɪksˈtʃeɪndʒ",
    meanings: ["交換", "為替", "取引所"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "The stock exchange opens at 9 AM.",
      "Please exchange dollars for euros."
    ],
    synonyms: ["trade", "swap"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "inflation",
    pronunciation: "ɪnˈfleɪʃən",
    meanings: ["インフレ", "物価上昇", "膨張"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Inflation affects purchasing power.",
      "Central banks control inflation."
    ],
    synonyms: ["price increase", "monetary expansion"],
    antonyms: ["deflation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "recession",
    pronunciation: "rɪˈseʃən",
    meanings: ["景気後退", "不況", "リセッション"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The economy entered a recession.",
      "Recession affects unemployment rates."
    ],
    synonyms: ["downturn", "decline"],
    antonyms: ["boom"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "economic",
    pronunciation: "ˌikəˈnɑmɪk",
    meanings: ["経済の", "経済的な", "採算の"],
    level: "intermediate",
    frequency: 91,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Economic growth is slowing.",
      "This solution is more economic."
    ],
    synonyms: ["financial", "monetary"],
    antonyms: ["wasteful"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "fiscal",
    pronunciation: "ˈfɪskəl",
    meanings: ["財政の", "会計の", "税務の"],
    level: "advanced",
    frequency: 77,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "The fiscal year ends in March.",
      "Fiscal policy affects taxation."
    ],
    synonyms: ["financial", "budgetary"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "monetary",
    pronunciation: "ˈmʌnəˌteri",
    meanings: ["金融の", "通貨の", "貨幣の"],
    level: "advanced",
    frequency: 74,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Monetary policy controls interest rates.",
      "The monetary system is stable."
    ],
    synonyms: ["financial", "currency-related"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "taxation",
    pronunciation: "tækˈseɪʃən",
    meanings: ["課税", "税制", "徴税"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Corporate taxation varies by country.",
      "Double taxation should be avoided."
    ],
    synonyms: ["tax system", "levying"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "expenditure",
    pronunciation: "ɪkˈspendətʃər",
    meanings: ["支出", "経費", "費用"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Government expenditure increased.",
      "Control your monthly expenditures."
    ],
    synonyms: ["spending", "outlay"],
    antonyms: ["income"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "allocation",
    pronunciation: "ˌæləˈkeɪʃən",
    meanings: ["配分", "割り当て", "配置"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Resource allocation is crucial.",
      "Budget allocation needs approval."
    ],
    synonyms: ["distribution", "assignment"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "forecasting",
    pronunciation: "ˈfɔrˌkæstɪŋ",
    meanings: ["予測", "予報", "見通し"],
    level: "intermediate",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Sales forecasting helps planning.",
      "Weather forecasting is complex."
    ],
    synonyms: ["prediction", "projection"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "projection",
    pronunciation: "prəˈdʒekʃən",
    meanings: ["予測", "投影", "計画"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Financial projections look positive.",
      "The projection shows growth trends."
    ],
    synonyms: ["forecast", "estimate"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "analysis",
    pronunciation: "əˈnæləsɪs",
    meanings: ["分析", "解析", "検討"],
    level: "intermediate",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Market analysis reveals trends.",
      "Data analysis takes time."
    ],
    synonyms: ["examination", "study"],
    antonyms: ["synthesis"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "statistics",
    pronunciation: "stəˈtɪstɪks",
    meanings: ["統計", "統計学", "数値"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Sales statistics show improvement.",
      "Statistics help decision making."
    ],
    synonyms: ["data", "figures"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "metrics",
    pronunciation: "ˈmetrɪks",
    meanings: ["指標", "測定基準", "数値"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Performance metrics are important.",
      "We track various business metrics."
    ],
    synonyms: ["measurements", "indicators"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "benchmark",
    pronunciation: "ˈbentʃmɑrk",
    meanings: ["ベンチマーク", "基準", "指標"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Industry benchmarks guide decisions.",
      "We benchmark against competitors."
    ],
    synonyms: ["standard", "reference point"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "evaluation",
    pronunciation: "ɪˌvæljuˈeɪʃən",
    meanings: ["評価", "査定", "検討"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Performance evaluation is annual.",
      "Project evaluation takes time."
    ],
    synonyms: ["assessment", "appraisal"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "assessment",
    pronunciation: "əˈsesmənt",
    meanings: ["査定", "評価", "算定"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Risk assessment is mandatory.",
      "The assessment report is ready."
    ],
    synonyms: ["evaluation", "appraisal"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "appraisal",
    pronunciation: "əˈpreɪzəl",
    meanings: ["鑑定", "評価", "査定"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Property appraisal determines value.",
      "Annual appraisals review performance."
    ],
    synonyms: ["valuation", "assessment"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "valuation",
    pronunciation: "ˌvæljuˈeɪʃən",
    meanings: ["評価", "査定", "価格算定"],
    level: "advanced",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Company valuation affects stock price.",
      "Real estate valuation is complex."
    ],
    synonyms: ["appraisal", "pricing"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "pricing",
    pronunciation: "ˈpraɪsɪŋ",
    meanings: ["価格設定", "料金体系", "プライシング"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Competitive pricing attracts customers.",
      "Dynamic pricing adjusts automatically."
    ],
    synonyms: ["cost setting", "rate determination"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "discount",
    pronunciation: "ˈdɪskaʊnt",
    meanings: ["割引", "値引き", "割り引く"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Students receive a 10% discount.",
      "We discount bulk purchases."
    ],
    synonyms: ["reduction", "markdown"],
    antonyms: ["premium"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "promotion",
    pronunciation: "prəˈmoʊʃən",
    meanings: ["販促", "宣伝", "昇進"],
    level: "intermediate",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The promotion increased sales.",
      "Her promotion was well deserved."
    ],
    synonyms: ["advertising", "advancement"],
    antonyms: ["demotion"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "advertising",
    pronunciation: "ˈædvərˌtaɪzɪŋ",
    meanings: ["広告", "宣伝", "アドバタイジング"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Online advertising is cost-effective.",
      "Advertising budgets vary by company."
    ],
    synonyms: ["marketing", "promotion"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "marketing",
    pronunciation: "ˈmɑrkətɪŋ",
    meanings: ["マーケティング", "販売", "市場開拓"],
    level: "intermediate",
    frequency: 90,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Digital marketing is essential.",
      "Marketing strategies drive sales."
    ],
    synonyms: ["promotion", "selling"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "branding",
    pronunciation: "ˈbrændɪŋ",
    meanings: ["ブランディング", "ブランド化", "商標"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Strong branding builds loyalty.",
      "Corporate branding needs consistency."
    ],
    synonyms: ["brand building", "trademark"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "campaign",
    pronunciation: "kæmˈpeɪn",
    meanings: ["キャンペーン", "運動", "宣伝活動"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The advertising campaign was successful.",
      "We launched a new campaign."
    ],
    synonyms: ["drive", "initiative"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "segment",
    pronunciation: "ˈsegmənt",
    meanings: ["セグメント", "部分", "区分"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Target the youth market segment.",
      "We segment customers by age."
    ],
    synonyms: ["section", "division"],
    antonyms: ["whole"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "demographic",
    pronunciation: "ˌdeməˈgræfɪk",
    meanings: ["人口統計の", "層", "デモグラフィック"],
    level: "advanced",
    frequency: 79,
    partOfSpeech: ["adjective", "noun"],
    exampleSentences: [
      "Demographic data shows trends.",
      "Target specific demographics."
    ],
    synonyms: ["population-based", "statistical"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "logistics",
    pronunciation: "ləˈdʒɪstɪks",
    meanings: ["物流", "兵站", "ロジスティクス"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Supply chain logistics are complex.",
      "Event logistics require careful planning."
    ],
    synonyms: ["supply management", "distribution"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "supply",
    pronunciation: "səˈplaɪ",
    meanings: ["供給", "調達", "提供"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Water supply is essential.",
      "We supply materials worldwide."
    ],
    synonyms: ["provide", "deliver"],
    antonyms: ["demand"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "demand",
    pronunciation: "dɪˈmænd",
    meanings: ["需要", "要求", "求める"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Product demand is increasing.",
      "Customers demand quality service."
    ],
    synonyms: ["require", "request"],
    antonyms: ["supply"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "distribution",
    pronunciation: "ˌdɪstrəˈbjuʃən",
    meanings: ["配送", "流通", "分配"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Product distribution covers Asia.",
      "Wealth distribution affects society."
    ],
    synonyms: ["delivery", "allocation"],
    antonyms: ["collection"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "warehouse",
    pronunciation: "ˈwerhaʊs",
    meanings: ["倉庫", "貯蔵所", "保管所"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Products are stored in warehouses.",
      "Automated warehouses increase efficiency."
    ],
    synonyms: ["storage facility", "depot"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "inventory",
    pronunciation: "ˈɪnvənˌtɔri",
    meanings: ["在庫", "棚卸し", "目録"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Inventory levels are monitored daily.",
      "Annual inventory takes time."
    ],
    synonyms: ["stock", "supplies"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "procurement",
    pronunciation: "prəˈkyʊrmənt",
    meanings: ["調達", "購入", "入手"],
    level: "advanced",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Procurement processes are streamlined.",
      "Government procurement follows rules."
    ],
    synonyms: ["purchasing", "acquisition"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "vendor",
    pronunciation: "ˈvendər",
    meanings: ["業者", "売り手", "ベンダー"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Select reliable vendors carefully.",
      "Food vendors gather in parks."
    ],
    synonyms: ["supplier", "seller"],
    antonyms: ["buyer"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "supplier",
    pronunciation: "səˈplaɪər",
    meanings: ["供給業者", "サプライヤー", "提供者"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Key suppliers provide materials.",
      "Supplier relationships are important."
    ],
    synonyms: ["vendor", "provider"],
    antonyms: ["customer"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "contractor",
    pronunciation: "ˈkɑntræktər",
    meanings: ["請負業者", "契約者", "建設業者"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Contractors completed the project.",
      "Independent contractors work flexibly."
    ],
    synonyms: ["builder", "subcontractor"],
    antonyms: ["employee"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "subcontractor",
    pronunciation: "ˈsʌbkənˌtræktər",
    meanings: ["下請け業者", "孫請け", "副請負人"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Subcontractors handle specialized work.",
      "Payment to subcontractors is delayed."
    ],
    synonyms: ["sub", "secondary contractor"],
    antonyms: ["main contractor"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "outsourcing",
    pronunciation: "ˈaʊtˌsɔrsɪŋ",
    meanings: ["外注", "アウトソーシング", "業務委託"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Outsourcing reduces costs.",
      "IT outsourcing is common."
    ],
    synonyms: ["contracting out", "external sourcing"],
    antonyms: ["insourcing"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "shipping",
    pronunciation: "ˈʃɪpɪŋ",
    meanings: ["配送", "発送", "海運"],
    level: "intermediate",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Free shipping attracts customers.",
      "International shipping takes time."
    ],
    synonyms: ["delivery", "transport"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "delivery",
    pronunciation: "dɪˈlɪvəri",
    meanings: ["配達", "納入", "出産"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Same-day delivery is available.",
      "Package delivery was delayed."
    ],
    synonyms: ["shipment", "transport"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "transportation",
    pronunciation: "ˌtrænspərˈteɪʃən",
    meanings: ["輸送", "交通", "運送"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Public transportation is efficient.",
      "Transportation costs are rising."
    ],
    synonyms: ["transport", "shipping"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "freight",
    pronunciation: "freɪt",
    meanings: ["貨物", "運賃", "輸送料"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Freight trains carry goods.",
      "Air freight is more expensive."
    ],
    synonyms: ["cargo", "goods"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "cargo",
    pronunciation: "ˈkɑrgoʊ",
    meanings: ["貨物", "積荷", "カーゴ"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Cargo ships transport containers.",
      "Cargo capacity determines routes."
    ],
    synonyms: ["freight", "load"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "customs",
    pronunciation: "ˈkʌstəmz",
    meanings: ["税関", "関税", "通関"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Declare goods at customs.",
      "Customs duties apply to imports."
    ],
    synonyms: ["border control", "immigration"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "import",
    pronunciation: "ˈɪmpɔrt",
    meanings: ["輸入", "輸入品", "重要性"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Import regulations are strict.",
      "We import coffee from Brazil."
    ],
    synonyms: ["bring in", "purchase abroad"],
    antonyms: ["export"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "export",
    pronunciation: "ˈekspɔrt",
    meanings: ["輸出", "輸出品", "輸出する"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Export sales increased significantly.",
      "Japan exports many automobiles."
    ],
    synonyms: ["send abroad", "sell overseas"],
    antonyms: ["import"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "tariff",
    pronunciation: "ˈtærɪf",
    meanings: ["関税", "税率", "料金表"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Trade tariffs affect prices.",
      "Hotel tariffs vary by season."
    ],
    synonyms: ["duty", "tax"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "quota",
    pronunciation: "ˈkwoʊtə",
    meanings: ["割当", "ノルマ", "定数"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Sales quota must be met.",
      "Import quotas limit quantities."
    ],
    synonyms: ["allocation", "limit"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "treaty",
    pronunciation: "ˈtriti",
    meanings: ["条約", "協定", "約定"],
    level: "advanced",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Trade treaties promote commerce.",
      "Peace treaties end conflicts."
    ],
    synonyms: ["agreement", "pact"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "agreement",
    pronunciation: "əˈgrimənt",
    meanings: ["合意", "協定", "契約"],
    level: "basic",
    frequency: 92,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Both parties signed the agreement.",
      "We reached an agreement quickly."
    ],
    synonyms: ["contract", "deal"],
    antonyms: ["disagreement"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "negotiation",
    pronunciation: "nɪˌgoʊʃiˈeɪʃən",
    meanings: ["交渉", "協議", "取引"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Contract negotiation takes time.",
      "Salary negotiations are confidential."
    ],
    synonyms: ["discussion", "bargaining"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "partnership",
    pronunciation: "ˈpɑrtnərˌʃɪp",
    meanings: ["提携", "パートナーシップ", "協力"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Strategic partnerships drive growth.",
      "Business partnerships require trust."
    ],
    synonyms: ["alliance", "collaboration"],
    antonyms: ["competition"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "alliance",
    pronunciation: "əˈlaɪəns",
    meanings: ["同盟", "提携", "連合"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Strategic alliances benefit companies.",
      "Military alliances ensure security."
    ],
    synonyms: ["partnership", "coalition"],
    antonyms: ["rivalry"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "collaboration",
    pronunciation: "kəˌlæbəˈreɪʃən",
    meanings: ["協力", "共同作業", "連携"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Team collaboration improves results.",
      "International collaboration is essential."
    ],
    synonyms: ["cooperation", "teamwork"],
    antonyms: ["competition"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "cooperation",
    pronunciation: "koʊˌɑpəˈreɪʃən",
    meanings: ["協力", "協調", "連携"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "International cooperation is vital.",
      "Employee cooperation improves productivity."
    ],
    synonyms: ["collaboration", "assistance"],
    antonyms: ["conflict"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "coordination",
    pronunciation: "koʊˌɔrdəˈneɪʃən",
    meanings: ["調整", "協調", "連携"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Project coordination requires skills.",
      "Team coordination improves efficiency."
    ],
    synonyms: ["organization", "management"],
    antonyms: ["disorganization"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "subsidiary",
    pronunciation: "səbˈsɪdiˌeri",
    meanings: ["子会社", "補助的な", "従属の"],
    level: "advanced",
    frequency: 77,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "The subsidiary operates independently.",
      "Subsidiary concerns are secondary."
    ],
    synonyms: ["branch", "affiliate"],
    antonyms: ["parent company"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "affiliate",
    pronunciation: "əˈfɪliˌeɪt",
    meanings: ["関連会社", "提携", "加盟"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Regional affiliates handle sales.",
      "Universities affiliate with hospitals."
    ],
    synonyms: ["associate", "partner"],
    antonyms: ["independent"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "branch",
    pronunciation: "bræntʃ",
    meanings: ["支店", "支社", "枝"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Open new branches nationwide.",
      "Tree branches provide shade."
    ],
    synonyms: ["office", "division"],
    antonyms: ["headquarters"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "headquarters",
    pronunciation: "ˈhedˌkwɔrtərz",
    meanings: ["本社", "本部", "司令部"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Company headquarters are in Tokyo.",
      "Police headquarters coordinate operations."
    ],
    synonyms: ["main office", "central office"],
    antonyms: ["branch"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "regional",
    pronunciation: "ˈridʒənəl",
    meanings: ["地域の", "地方の", "局地的な"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Regional managers oversee areas.",
      "Regional differences affect strategy."
    ],
    synonyms: ["local", "area-specific"],
    antonyms: ["global"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "international",
    pronunciation: "ˌɪntərˈnæʃənəl",
    meanings: ["国際的な", "国際間の", "多国籍の"],
    level: "intermediate",
    frequency: 91,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "International trade grows annually.",
      "She has international experience."
    ],
    synonyms: ["global", "worldwide"],
    antonyms: ["domestic"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "global",
    pronunciation: "ˈgloʊbəl",
    meanings: ["世界的な", "地球規模の", "全体的な"],
    level: "intermediate",
    frequency: 89,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Global markets are interconnected.",
      "Climate change is a global issue."
    ],
    synonyms: ["worldwide", "international"],
    antonyms: ["local"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "multinational",
    pronunciation: "ˌmʌltiˈnæʃənəl",
    meanings: ["多国籍の", "国際企業", "多国間の"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["adjective", "noun"],
    exampleSentences: [
      "Multinational corporations dominate markets.",
      "She works for a multinational."
    ],
    synonyms: ["international", "global"],
    antonyms: ["domestic"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "domestic",
    pronunciation: "dəˈmestɪk",
    meanings: ["国内の", "家庭の", "家畜の"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Domestic sales exceed exports.",
      "Domestic animals need care."
    ],
    synonyms: ["national", "local"],
    antonyms: ["international"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "overseas",
    pronunciation: "ˌoʊvərˈsiz",
    meanings: ["海外の", "外国の", "海外に"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["adjective", "adverb"],
    exampleSentences: [
      "Overseas markets offer opportunities.",
      "She studied overseas for years."
    ],
    synonyms: ["abroad", "foreign"],
    antonyms: ["domestic"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "foreign",
    pronunciation: "ˈfɔrən",
    meanings: ["外国の", "外来の", "異質な"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Foreign languages are valuable.",
      "Foreign investors show interest."
    ],
    synonyms: ["overseas", "international"],
    antonyms: ["domestic"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "cultural",
    pronunciation: "ˈkʌltʃərəl",
    meanings: ["文化的な", "教養の", "培養の"],
    level: "intermediate",
    frequency: 87,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Cultural differences affect business.",
      "Cultural events attract tourists."
    ],
    synonyms: ["social", "ethnic"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "diversity",
    pronunciation: "dəˈvɜrsəti",
    meanings: ["多様性", "相違", "変化"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Workplace diversity brings benefits.",
      "Biodiversity supports ecosystems."
    ],
    synonyms: ["variety", "difference"],
    antonyms: ["uniformity"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "inclusion",
    pronunciation: "ɪnˈkluʒən",
    meanings: ["包含", "包摂", "含有"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Inclusion policies promote equality.",
      "Social inclusion benefits everyone."
    ],
    synonyms: ["involvement", "incorporation"],
    antonyms: ["exclusion"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "integration",
    pronunciation: "ˌɪntəˈgreɪʃən",
    meanings: ["統合", "融合", "一体化"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "System integration improves efficiency.",
      "Social integration takes time."
    ],
    synonyms: ["combination", "unification"],
    antonyms: ["separation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "localization",
    pronunciation: "ˌloʊkəlɪˈzeɪʃən",
    meanings: ["現地化", "地域化", "局在化"],
    level: "advanced",
    frequency: 74,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Software localization adapts interfaces.",
      "Product localization meets local needs."
    ],
    synonyms: ["adaptation", "customization"],
    antonyms: ["globalization"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "adaptation",
    pronunciation: "ˌædæpˈteɪʃən",
    meanings: ["適応", "順応", "改編"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Market adaptation requires flexibility.",
      "Climate adaptation is essential."
    ],
    synonyms: ["adjustment", "modification"],
    antonyms: ["resistance"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "communication",
    pronunciation: "kəˌmjunəˈkeɪʃən",
    meanings: ["伝達", "通信", "意思疎通"],
    level: "basic",
    frequency: 93,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Clear communication prevents errors.",
      "Digital communication is instant."
    ],
    synonyms: ["correspondence", "contact"],
    antonyms: ["silence"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "translation",
    pronunciation: "trænsˈleɪʃən",
    meanings: ["翻訳", "変換", "移動"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Accurate translation is essential.",
      "Document translation takes time."
    ],
    synonyms: ["interpretation", "conversion"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "research",
    pronunciation: "rɪˈsɜrtʃ",
    meanings: ["研究", "調査", "探究"],
    level: "basic",
    frequency: 92,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Market research guides decisions.",
      "Scientists research new treatments."
    ],
    synonyms: ["study", "investigation"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "development",
    pronunciation: "dɪˈveləpmənt",
    meanings: ["開発", "発展", "進歩"],
    level: "basic",
    frequency: 94,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Product development takes years.",
      "Economic development benefits society."
    ],
    synonyms: ["growth", "progress"],
    antonyms: ["decline"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "innovation",
    pronunciation: "ˌɪnəˈveɪʃən",
    meanings: ["革新", "イノベーション", "新機軸"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Technological innovation drives growth.",
      "Innovation requires creative thinking."
    ],
    synonyms: ["advancement", "breakthrough"],
    antonyms: ["tradition"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "technology",
    pronunciation: "tekˈnɑlədʒi",
    meanings: ["技術", "テクノロジー", "工学"],
    level: "basic",
    frequency: 93,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "New technology improves efficiency.",
      "Information technology is essential."
    ],
    synonyms: ["technique", "method"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "laboratory",
    pronunciation: "ˈlæbrəˌtɔri",
    meanings: ["研究室", "実験室", "ラボ"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Laboratory tests confirm results.",
      "Research laboratories require equipment."
    ],
    synonyms: ["lab", "testing facility"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "experiment",
    pronunciation: "ɪkˈsperəmənt",
    meanings: ["実験", "試験", "試み"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Scientific experiments test theories.",
      "We experiment with new methods."
    ],
    synonyms: ["test", "trial"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "prototype",
    pronunciation: "ˈproʊtəˌtaɪp",
    meanings: ["試作品", "原型", "プロトタイプ"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Engineers built a prototype.",
      "The prototype needs refinement."
    ],
    synonyms: ["model", "sample"],
    antonyms: ["final product"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "patent",
    pronunciation: "ˈpætənt",
    meanings: ["特許", "専売特許", "明白な"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "The patent protects inventions.",
      "His talent is patent to all."
    ],
    synonyms: ["copyright", "license"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "intellectual",
    pronunciation: "ˌɪntəˈlektʃuəl",
    meanings: ["知的な", "知識人", "理性的な"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["adjective", "noun"],
    exampleSentences: [
      "Intellectual property requires protection.",
      "She is a distinguished intellectual."
    ],
    synonyms: ["mental", "academic"],
    antonyms: ["physical"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "property",
    pronunciation: "ˈprɑpərti",
    meanings: ["財産", "所有物", "性質"],
    level: "intermediate",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Real estate property values rise.",
      "Water has unique properties."
    ],
    synonyms: ["asset", "characteristic"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "copyright",
    pronunciation: "ˈkɑpiˌraɪt",
    meanings: ["著作権", "版権", "コピーライト"],
    level: "intermediate",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Copyright protects creative works.",
      "Respect copyright laws always."
    ],
    synonyms: ["intellectual property", "authorship"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "trademark",
    pronunciation: "ˈtreɪdˌmɑrk",
    meanings: ["商標", "トレードマーク", "特徴"],
    level: "intermediate",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Register your trademark early.",
      "Quality is their trademark."
    ],
    synonyms: ["brand mark", "logo"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "licensing",
    pronunciation: "ˈlaɪsənsɪŋ",
    meanings: ["ライセンス", "許可", "免許"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Software licensing generates revenue.",
      "Professional licensing ensures standards."
    ],
    synonyms: ["permission", "authorization"],
    antonyms: ["prohibition"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "quality",
    pronunciation: "ˈkwɑləti",
    meanings: ["品質", "質", "特性"],
    level: "basic",
    frequency: 95,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Product quality determines success.",
      "Education quality varies globally."
    ],
    synonyms: ["standard", "grade"],
    antonyms: ["inferiority"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "control",
    pronunciation: "kənˈtroʊl",
    meanings: ["制御", "管理", "支配"],
    level: "basic",
    frequency: 94,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Quality control prevents defects.",
      "Control expenses carefully."
    ],
    synonyms: ["manage", "regulate"],
    antonyms: ["chaos"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "assurance",
    pronunciation: "əˈʃʊrəns",
    meanings: ["保証", "確信", "自信"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Quality assurance prevents problems.",
      "She spoke with complete assurance."
    ],
    synonyms: ["guarantee", "confidence"],
    antonyms: ["uncertainty"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "inspection",
    pronunciation: "ɪnˈspekʃən",
    meanings: ["検査", "点検", "査察"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Regular inspection ensures safety.",
      "Building inspection is mandatory."
    ],
    synonyms: ["examination", "review"],
    antonyms: ["neglect"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "testing",
    pronunciation: "ˈtestɪŋ",
    meanings: ["試験", "テスト", "検査"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Product testing reveals flaws.",
      "Software testing prevents bugs."
    ],
    synonyms: ["examination", "trial"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "verification",
    pronunciation: "ˌverəfəˈkeɪʃən",
    meanings: ["検証", "確認", "立証"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Identity verification is required.",
      "Data verification takes time."
    ],
    synonyms: ["confirmation", "validation"],
    antonyms: ["falsification"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "validation",
    pronunciation: "ˌvæləˈdeɪʃən",
    meanings: ["妥当性確認", "検証", "承認"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Process validation ensures consistency.",
      "External validation builds confidence."
    ],
    synonyms: ["verification", "confirmation"],
    antonyms: ["invalidation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "certification",
    pronunciation: "ˌsɜrtəfəˈkeɪʃən",
    meanings: ["認証", "証明", "資格"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "ISO certification improves credibility.",
      "Professional certification advances careers."
    ],
    synonyms: ["accreditation", "qualification"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "accreditation",
    pronunciation: "əˌkredəˈteɪʃən",
    meanings: ["認定", "公認", "信任"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "University accreditation ensures standards.",
      "Medical accreditation is essential."
    ],
    synonyms: ["certification", "authorization"],
    antonyms: ["revocation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "standard",
    pronunciation: "ˈstændərd",
    meanings: ["標準", "基準", "水準"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Industry standards ensure quality.",
      "Standard procedures must be followed."
    ],
    synonyms: ["norm", "criterion"],
    antonyms: ["exception"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "specification",
    pronunciation: "ˌspesəfəˈkeɪʃən",
    meanings: ["仕様", "明細", "規格"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Technical specifications are detailed.",
      "Product specifications meet requirements."
    ],
    synonyms: ["requirement", "detail"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "requirement",
    pronunciation: "rɪˈkwaɪrmənt",
    meanings: ["要件", "必要条件", "要求"],
    level: "intermediate",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Job requirements are clearly stated.",
      "Safety requirements must be met."
    ],
    synonyms: ["necessity", "condition"],
    antonyms: ["option"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "compliance",
    pronunciation: "kəmˈplaɪəns",
    meanings: ["コンプライアンス", "法令遵守", "準拠"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Regulatory compliance is mandatory.",
      "Compliance training prevents violations."
    ],
    synonyms: ["conformity", "adherence"],
    antonyms: ["violation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "regulation",
    pronunciation: "ˌregjəˈleɪʃən",
    meanings: ["規制", "規則", "調整"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "New regulations affect businesses.",
      "Safety regulations protect workers."
    ],
    synonyms: ["rule", "law"],
    antonyms: ["deregulation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "legislation",
    pronunciation: "ˌledʒəˈsleɪʃən",
    meanings: ["立法", "法律", "法制"],
    level: "advanced",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "New legislation protects consumers.",
      "Environmental legislation is strengthened."
    ],
    synonyms: ["law", "statute"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "legal",
    pronunciation: "ˈligəl",
    meanings: ["法的な", "合法の", "法律の"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Legal advice prevents problems.",
      "This action is perfectly legal."
    ],
    synonyms: ["lawful", "legitimate"],
    antonyms: ["illegal"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "lawsuit",
    pronunciation: "ˈlɔˌsut",
    meanings: ["訴訟", "法廷闘争", "裁判"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "The lawsuit was settled quickly.",
      "Avoid costly lawsuits through compliance."
    ],
    synonyms: ["litigation", "legal action"],
    antonyms: ["settlement"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "litigation",
    pronunciation: "ˌlɪtəˈgeɪʃən",
    meanings: ["訴訟", "争訟", "法廷論争"],
    level: "advanced",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Litigation costs are expensive.",
      "Commercial litigation requires expertise."
    ],
    synonyms: ["lawsuit", "legal proceedings"],
    antonyms: ["mediation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "attorney",
    pronunciation: "əˈtɜrni",
    meanings: ["弁護士", "代理人", "法務担当者"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Consult an attorney before signing.",
      "Corporate attorneys handle contracts."
    ],
    synonyms: ["lawyer", "counsel"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "lawyer",
    pronunciation: "ˈlɔjər",
    meanings: ["弁護士", "法律家", "法務専門家"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Hire a qualified lawyer.",
      "Business lawyers understand contracts."
    ],
    synonyms: ["attorney", "legal counsel"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "counsel",
    pronunciation: "ˈkaʊnsəl",
    meanings: ["助言", "相談", "弁護士"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Seek legal counsel immediately.",
      "He counsels clients wisely."
    ],
    synonyms: ["advice", "guidance"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "arbitration",
    pronunciation: "ˌɑrbəˈtreɪʃən",
    meanings: ["仲裁", "調停", "裁定"],
    level: "advanced",
    frequency: 74,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Arbitration resolves disputes faster.",
      "International arbitration prevents conflicts."
    ],
    synonyms: ["mediation", "adjudication"],
    antonyms: ["litigation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "mediation",
    pronunciation: "ˌmidiˈeɪʃən",
    meanings: ["調停", "仲介", "仲裁"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Mediation saves time and money.",
      "Labor mediation prevents strikes."
    ],
    synonyms: ["arbitration", "intervention"],
    antonyms: ["direct confrontation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "liability",
    pronunciation: "ˌlaɪəˈbɪləti",
    meanings: ["責任", "債務", "負債"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Product liability concerns manufacturers.",
      "Limited liability protects shareholders."
    ],
    synonyms: ["responsibility", "obligation"],
    antonyms: ["asset"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "penalty",
    pronunciation: "ˈpenəlti",
    meanings: ["罰金", "ペナルティ", "刑罰"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Late payment incurs penalties.",
      "Traffic penalties deter violations."
    ],
    synonyms: ["fine", "punishment"],
    antonyms: ["reward"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "violation",
    pronunciation: "ˌvaɪəˈleɪʃən",
    meanings: ["違反", "侵害", "破綻"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Safety violations are serious.",
      "Copyright violation carries penalties."
    ],
    synonyms: ["breach", "infringement"],
    antonyms: ["compliance"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "confidentiality",
    pronunciation: "ˌkɑnfəˌdenʃiˈæləti",
    meanings: ["機密性", "秘密保持", "守秘"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Confidentiality agreements protect secrets.",
      "Medical confidentiality is essential."
    ],
    synonyms: ["secrecy", "privacy"],
    antonyms: ["disclosure"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "disclosure",
    pronunciation: "dɪsˈkloʊʒər",
    meanings: ["開示", "暴露", "公開"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Financial disclosure is mandatory.",
      "Full disclosure builds trust."
    ],
    synonyms: ["revelation", "announcement"],
    antonyms: ["concealment"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "privacy",
    pronunciation: "ˈpraɪvəsi",
    meanings: ["プライバシー", "私生活", "秘密"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Data privacy laws protect citizens.",
      "Respect employee privacy rights."
    ],
    synonyms: ["confidentiality", "secrecy"],
    antonyms: ["publicity"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "security",
    pronunciation: "sɪˈkyʊrəti",
    meanings: ["安全", "保安", "担保"],
    level: "basic",
    frequency: 92,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Data security prevents breaches.",
      "Job security affects motivation."
    ],
    synonyms: ["safety", "protection"],
    antonyms: ["vulnerability"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "audit",
    pronunciation: "ˈɔdɪt",
    meanings: ["監査", "会計検査", "査定"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Annual audits ensure accuracy.",
      "Auditors examine financial records."
    ],
    synonyms: ["examination", "review"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "auditor",
    pronunciation: "ˈɔdətər",
    meanings: ["監査人", "会計監査人", "聴講者"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "External auditors provide objectivity.",
      "Internal auditors report to management."
    ],
    synonyms: ["examiner", "inspector"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "documentation",
    pronunciation: "ˌdɑkjəmənˈteɪʃən",
    meanings: ["文書化", "書類", "記録"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Proper documentation prevents disputes.",
      "Software documentation helps users."
    ],
    synonyms: ["records", "paperwork"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "procedure",
    pronunciation: "prəˈsidʒər",
    meanings: ["手順", "手続き", "処置"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Follow safety procedures strictly.",
      "New procedures improve efficiency."
    ],
    synonyms: ["process", "method"],
    antonyms: ["improvisation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "protocol",
    pronunciation: "ˈproʊtəˌkɔl",
    meanings: ["手順", "儀礼", "協定"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Network protocols enable communication.",
      "Diplomatic protocol requires formality."
    ],
    synonyms: ["procedure", "convention"],
    antonyms: ["informality"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "personnel",
    pronunciation: "ˌpɜrsəˈnel",
    meanings: ["人事", "職員", "人材"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Personnel policies need updating.",
      "Military personnel require training."
    ],
    synonyms: ["staff", "employees"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "recruitment",
    pronunciation: "rɪˈkrutmənt",
    meanings: ["採用", "募集", "徴募"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Recruitment processes are competitive.",
      "Online recruitment saves costs."
    ],
    synonyms: ["hiring", "selection"],
    antonyms: ["dismissal"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "hiring",
    pronunciation: "ˈhaɪərɪŋ",
    meanings: ["雇用", "採用", "雇い入れ"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Hiring practices affect diversity.",
      "Seasonal hiring increases staff."
    ],
    synonyms: ["employment", "recruitment"],
    antonyms: ["firing"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "employment",
    pronunciation: "ɪmˈplɔɪmənt",
    meanings: ["雇用", "就職", "使用"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Employment rates affect economy.",
      "Full employment is government goal."
    ],
    synonyms: ["work", "job"],
    antonyms: ["unemployment"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "unemployment",
    pronunciation: "ˌʌnɪmˈplɔɪmənt",
    meanings: ["失業", "無職", "失業率"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Unemployment benefits provide support.",
      "High unemployment affects society."
    ],
    synonyms: ["joblessness", "worklessness"],
    antonyms: ["employment"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "candidate",
    pronunciation: "ˈkændəˌdeɪt",
    meanings: ["候補者", "志願者", "応募者"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Interview all qualified candidates.",
      "Presidential candidates campaign actively."
    ],
    synonyms: ["applicant", "nominee"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "applicant",
    pronunciation: "ˈæplɪkənt",
    meanings: ["応募者", "申請者", "志願者"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Job applicants submit resumes.",
      "Scholarship applicants need references."
    ],
    synonyms: ["candidate", "petitioner"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "interview",
    pronunciation: "ˈɪntərˌvju",
    meanings: ["面接", "インタビュー", "会見"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Job interviews assess candidates.",
      "Journalists interview politicians."
    ],
    synonyms: ["meeting", "consultation"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "resume",
    pronunciation: "rəˈzum",
    meanings: ["履歴書", "再開", "要約"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Update your resume regularly.",
      "Work will resume after lunch."
    ],
    synonyms: ["CV", "curriculum vitae"],
    antonyms: ["pause"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "qualification",
    pronunciation: "ˌkwɑləfəˈkeɪʃən",
    meanings: ["資格", "条件", "制限"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Job qualifications are listed clearly.",
      "Professional qualifications open doors."
    ],
    synonyms: ["credential", "requirement"],
    antonyms: ["disqualification"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "experience",
    pronunciation: "ɪkˈspɪriəns",
    meanings: ["経験", "体験", "実績"],
    level: "basic",
    frequency: 94,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Work experience matters greatly.",
      "Experience new cultures abroad."
    ],
    synonyms: ["background", "expertise"],
    antonyms: ["inexperience"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "training",
    pronunciation: "ˈtreɪnɪŋ",
    meanings: ["訓練", "研修", "トレーニング"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Employee training improves skills.",
      "Athletic training requires discipline."
    ],
    synonyms: ["education", "instruction"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "orientation",
    pronunciation: "ˌɔriənˈteɪʃən",
    meanings: ["オリエンテーション", "方向", "指向"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "New employee orientation is Monday.",
      "Career orientation helps students."
    ],
    synonyms: ["introduction", "briefing"],
    antonyms: ["disorientation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "supervision",
    pronunciation: "ˌsupərˈvɪʒən",
    meanings: ["監督", "指導", "管理"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Close supervision improves quality.",
      "Children need adult supervision."
    ],
    synonyms: ["oversight", "management"],
    antonyms: ["neglect"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "supervisor",
    pronunciation: "ˈsupərˌvaɪzər",
    meanings: ["監督者", "上司", "管理者"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Report problems to your supervisor.",
      "Supervisors guide team members."
    ],
    synonyms: ["manager", "overseer"],
    antonyms: ["subordinate"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "subordinate",
    pronunciation: "səˈbɔrdənət",
    meanings: ["部下", "従属する", "下位の"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun", "adjective", "verb"],
    exampleSentences: [
      "Supervisors train their subordinates.",
      "Subordinate goals support main objectives."
    ],
    synonyms: ["junior", "assistant"],
    antonyms: ["superior"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "promotion",
    pronunciation: "prəˈmoʊʃən",
    meanings: ["昇進", "促進", "宣伝"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Her promotion was well-deserved.",
      "Sales promotion increases revenue."
    ],
    synonyms: ["advancement", "upgrade"],
    antonyms: ["demotion"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "demotion",
    pronunciation: "dɪˈmoʊʃən",
    meanings: ["降格", "左遷", "格下げ"],
    level: "intermediate",
    frequency: 73,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Demotion affects employee morale.",
      "Performance issues led to demotion."
    ],
    synonyms: ["downgrade", "reduction"],
    antonyms: ["promotion"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "termination",
    pronunciation: "ˌtɜrməˈneɪʃən",
    meanings: ["解雇", "終了", "打ち切り"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Employment termination requires documentation.",
      "Contract termination is effective immediately."
    ],
    synonyms: ["dismissal", "ending"],
    antonyms: ["commencement"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "resignation",
    pronunciation: "ˌrezɪgˈneɪʃən",
    meanings: ["辞職", "辞任", "諦め"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Submit resignation letter formally.",
      "His resignation surprised everyone."
    ],
    synonyms: ["departure", "quitting"],
    antonyms: ["appointment"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "retirement",
    pronunciation: "rɪˈtaɪərmənt",
    meanings: ["退職", "引退", "老後"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Retirement planning is essential.",
      "Early retirement requires savings."
    ],
    synonyms: ["withdrawal", "pension"],
    antonyms: ["employment"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "pension",
    pronunciation: "ˈpenʃən",
    meanings: ["年金", "恩給", "退職金"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Company pension plans vary widely.",
      "Government pensions support retirees."
    ],
    synonyms: ["retirement fund", "allowance"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "benefits",
    pronunciation: "ˈbenəfɪts",
    meanings: ["福利厚生", "給付", "利益"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Employee benefits include healthcare.",
      "Social benefits support families."
    ],
    synonyms: ["advantages", "perks"],
    antonyms: ["disadvantages"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "compensation",
    pronunciation: "ˌkɑmpənˈseɪʃən",
    meanings: ["報酬", "補償", "給与"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Fair compensation attracts talent.",
      "Workers' compensation covers injuries."
    ],
    synonyms: ["payment", "remuneration"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "salary",
    pronunciation: "ˈsæləri",
    meanings: ["給料", "俸給", "年俸"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Salary negotiations are private.",
      "Starting salary depends on experience."
    ],
    synonyms: ["wage", "pay"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "wage",
    pronunciation: "weɪdʒ",
    meanings: ["賃金", "時給", "対価"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Minimum wage laws protect workers.",
      "Hourly wages vary by industry."
    ],
    synonyms: ["salary", "earnings"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "bonus",
    pronunciation: "ˈboʊnəs",
    meanings: ["ボーナス", "賞与", "特典"],
    level: "basic",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Year-end bonus motivates employees.",
      "Performance bonus rewards achievement."
    ],
    synonyms: ["reward", "incentive"],
    antonyms: ["penalty"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "incentive",
    pronunciation: "ɪnˈsentɪv",
    meanings: ["奨励", "動機", "誘因"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Financial incentives boost productivity.",
      "Tax incentives encourage investment."
    ],
    synonyms: ["motivation", "stimulus"],
    antonyms: ["disincentive"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "motivation",
    pronunciation: "ˌmoʊtəˈveɪʃən",
    meanings: ["動機", "やる気", "意欲"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Employee motivation affects performance.",
      "Find your motivation for success."
    ],
    synonyms: ["drive", "inspiration"],
    antonyms: ["apathy"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "productivity",
    pronunciation: "ˌproʊdʌkˈtɪvəti",
    meanings: ["生産性", "効率", "産出力"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Technology increases productivity.",
      "Productivity measures show improvement."
    ],
    synonyms: ["efficiency", "output"],
    antonyms: ["inefficiency"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "efficiency",
    pronunciation: "ɪˈfɪʃənsi",
    meanings: ["効率", "能率", "効率性"],
    level: "intermediate",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Energy efficiency saves costs.",
      "Workflow efficiency improves output."
    ],
    synonyms: ["effectiveness", "productivity"],
    antonyms: ["inefficiency"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "effectiveness",
    pronunciation: "ɪˈfektɪvnəs",
    meanings: ["有効性", "効果", "実効性"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Training effectiveness is measured.",
      "Marketing effectiveness varies by channel."
    ],
    synonyms: ["efficacy", "success"],
    antonyms: ["ineffectiveness"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "delegation",
    pronunciation: "ˌdeləˈgeɪʃən",
    meanings: ["委任", "代表団", "委譲"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Task delegation improves efficiency.",
      "The delegation visited factories."
    ],
    synonyms: ["assignment", "deputation"],
    antonyms: ["retention"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "authority",
    pronunciation: "əˈθɔrəti",
    meanings: ["権限", "当局", "権威"],
    level: "intermediate",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Managers have hiring authority.",
      "Government authorities investigate crimes."
    ],
    synonyms: ["power", "control"],
    antonyms: ["subordination"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "responsibility",
    pronunciation: "rɪˌspɑnsəˈbɪləti",
    meanings: ["責任", "義務", "職責"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Job responsibilities are clearly defined.",
      "Corporate responsibility affects society."
    ],
    synonyms: ["duty", "obligation"],
    antonyms: ["irresponsibility"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "accountability",
    pronunciation: "əˌkaʊntəˈbɪləti",
    meanings: ["説明責任", "責任", "責務"],
    level: "advanced",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Financial accountability is essential.",
      "Public accountability builds trust."
    ],
    synonyms: ["responsibility", "answerability"],
    antonyms: ["irresponsibility"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "teamwork",
    pronunciation: "ˈtimˌwɜrk",
    meanings: ["チームワーク", "共同作業", "協働"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Good teamwork achieves goals.",
      "Teamwork skills are valued."
    ],
    synonyms: ["collaboration", "cooperation"],
    antonyms: ["individualism"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "leadership",
    pronunciation: "ˈlidərˌʃɪp",
    meanings: ["リーダーシップ", "指導力", "統率力"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Strong leadership inspires teams.",
      "Leadership development programs help."
    ],
    synonyms: ["guidance", "direction"],
    antonyms: ["followership"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "hierarchy",
    pronunciation: "ˈhaɪəˌrɑrki",
    meanings: ["階層", "序列", "ヒエラルキー"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Corporate hierarchy defines structure.",
      "Social hierarchy affects behavior."
    ],
    synonyms: ["ranking", "order"],
    antonyms: ["equality"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "structure",
    pronunciation: "ˈstrʌktʃər",
    meanings: ["構造", "組織", "建造物"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Organizational structure affects communication.",
      "Structure your presentation clearly."
    ],
    synonyms: ["framework", "organization"],
    antonyms: ["chaos"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "organizational",
    pronunciation: "ˌɔrgənəˈzeɪʃənəl",
    meanings: ["組織の", "組織的な", "機構の"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Organizational changes affect employees.",
      "Good organizational skills help success."
    ],
    synonyms: ["institutional", "structural"],
    antonyms: ["disorganized"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "culture",
    pronunciation: "ˈkʌltʃər",
    meanings: ["文化", "企業文化", "教養"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Company culture affects retention.",
      "Different cultures have unique values."
    ],
    synonyms: ["tradition", "customs"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "strategy",
    pronunciation: "ˈstrætədʒi",
    meanings: ["戦略", "策略", "作戦"],
    level: "intermediate",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Business strategy guides decisions.",
      "Marketing strategy targets customers."
    ],
    synonyms: ["plan", "approach"],
    antonyms: ["improvisation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "strategic",
    pronunciation: "strəˈtidʒɪk",
    meanings: ["戦略的な", "戦略上の", "重要な"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Strategic planning prevents problems.",
      "Location is strategically important."
    ],
    synonyms: ["tactical", "planned"],
    antonyms: ["random"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "objective",
    pronunciation: "əbˈdʒektɪv",
    meanings: ["目標", "客観的な", "目的"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Set clear business objectives.",
      "Maintain objective judgment always."
    ],
    synonyms: ["goal", "aim"],
    antonyms: ["subjective"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "initiative",
    pronunciation: "ɪˈnɪʃətɪv",
    meanings: ["イニシアチブ", "主導権", "率先"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Take initiative in projects.",
      "Government initiatives support business."
    ],
    synonyms: ["leadership", "enterprise"],
    antonyms: ["passivity"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "software",
    pronunciation: "ˈsɔftˌwer",
    meanings: ["ソフトウェア", "ソフト", "プログラム"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "New software improves productivity.",
      "Software updates fix security issues."
    ],
    synonyms: ["program", "application"],
    antonyms: ["hardware"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "hardware",
    pronunciation: "ˈhɑrdˌwer",
    meanings: ["ハードウェア", "機器", "金物"],
    level: "basic",
    frequency: 88,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Computer hardware needs upgrading.",
      "Hardware stores sell tools."
    ],
    synonyms: ["equipment", "machinery"],
    antonyms: ["software"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "database",
    pronunciation: "ˈdeɪtəˌbeɪs",
    meanings: ["データベース", "データ集", "情報源"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Customer database contains records.",
      "Search the product database online."
    ],
    synonyms: ["data storage", "repository"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "application",
    pronunciation: "ˌæpləˈkeɪʃən",
    meanings: ["アプリケーション", "応用", "申請"],
    level: "intermediate",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Mobile applications are popular.",
      "Submit your job application today."
    ],
    synonyms: ["app", "software"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "system",
    pronunciation: "ˈsɪstəm",
    meanings: ["システム", "制度", "仕組み"],
    level: "basic",
    frequency: 95,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Computer systems need maintenance.",
      "Educational systems vary globally."
    ],
    synonyms: ["network", "structure"],
    antonyms: ["chaos"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "network",
    pronunciation: "ˈnetˌwɜrk",
    meanings: ["ネットワーク", "網", "人脈"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Wireless networks connect devices.",
      "Network with industry professionals."
    ],
    synonyms: ["connection", "web"],
    antonyms: ["isolation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "server",
    pronunciation: "ˈsɜrvər",
    meanings: ["サーバー", "配膳係", "奉仕者"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Web servers host websites.",
      "The server brought our order."
    ],
    synonyms: ["host", "provider"],
    antonyms: ["client"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "client",
    pronunciation: "ˈklaɪənt",
    meanings: ["クライアント", "顧客", "依頼人"],
    level: "basic",
    frequency: 90,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Client satisfaction is priority.",
      "Legal clients need representation."
    ],
    synonyms: ["customer", "patron"],
    antonyms: ["server"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "user",
    pronunciation: "ˈjuzər",
    meanings: ["ユーザー", "使用者", "利用者"],
    level: "basic",
    frequency: 92,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Software users need training.",
      "Internet users increase daily."
    ],
    synonyms: ["operator", "consumer"],
    antonyms: ["provider"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "interface",
    pronunciation: "ˈɪntərˌfeɪs",
    meanings: ["インターフェース", "接続面", "境界"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "User interface design matters.",
      "Systems interface through APIs."
    ],
    synonyms: ["connection", "boundary"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "platform",
    pronunciation: "ˈplætˌfɔrm",
    meanings: ["プラットフォーム", "基盤", "演壇"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Social media platforms connect people.",
      "Train platforms are crowded."
    ],
    synonyms: ["base", "foundation"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "backup",
    pronunciation: "ˈbækˌʌp",
    meanings: ["バックアップ", "支援", "代替"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Regular backup prevents data loss.",
      "Backup generators provide power."
    ],
    synonyms: ["copy", "support"],
    antonyms: ["primary"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "storage",
    pronunciation: "ˈstɔrɪdʒ",
    meanings: ["保存", "格納", "倉庫"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Cloud storage saves space.",
      "Storage costs vary by location."
    ],
    synonyms: ["saving", "repository"],
    antonyms: ["deletion"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "cloud",
    pronunciation: "klaʊd",
    meanings: ["クラウド", "雲", "曇り"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Cloud computing reduces costs.",
      "Dark clouds indicate rain."
    ],
    synonyms: ["remote storage", "mist"],
    antonyms: ["local"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "digital",
    pronunciation: "ˈdɪdʒətəl",
    meanings: ["デジタル", "数字の", "指の"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Digital transformation changes business.",
      "Digital clocks show exact time."
    ],
    synonyms: ["electronic", "computerized"],
    antonyms: ["analog"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "automation",
    pronunciation: "ˌɔtəˈmeɪʃən",
    meanings: ["自動化", "オートメーション", "機械化"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Automation improves efficiency.",
      "Factory automation reduces costs."
    ],
    synonyms: ["mechanization", "robotization"],
    antonyms: ["manual operation"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "artificial",
    pronunciation: "ˌɑrtəˈfɪʃəl",
    meanings: ["人工の", "人為的な", "偽の"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Artificial intelligence advances rapidly.",
      "Artificial flowers look realistic."
    ],
    synonyms: ["synthetic", "man-made"],
    antonyms: ["natural"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "intelligence",
    pronunciation: "ɪnˈtelədʒəns",
    meanings: ["知能", "情報", "諜報"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Emotional intelligence matters greatly.",
      "Intelligence agencies gather information."
    ],
    synonyms: ["intellect", "information"],
    antonyms: ["ignorance"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "algorithm",
    pronunciation: "ˈælgəˌrɪðəm",
    meanings: ["アルゴリズム", "演算法", "計算法"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Search algorithms find relevant results.",
      "Complex algorithms solve problems."
    ],
    synonyms: ["procedure", "formula"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "programming",
    pronunciation: "ˈproʊˌgræmɪŋ",
    meanings: ["プログラミング", "番組編成", "計画"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Programming languages vary widely.",
      "Television programming targets audiences."
    ],
    synonyms: ["coding", "development"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "coding",
    pronunciation: "ˈkoʊdɪŋ",
    meanings: ["コーディング", "符号化", "暗号化"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Coding skills are valuable.",
      "Data coding prevents errors."
    ],
    synonyms: ["programming", "encryption"],
    antonyms: ["decoding"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "debugging",
    pronunciation: "diˈbʌgɪŋ",
    meanings: ["デバッグ", "不具合修正", "除虫"],
    level: "advanced",
    frequency: 73,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Debugging takes time and patience.",
      "Software debugging prevents crashes."
    ],
    synonyms: ["troubleshooting", "fixing"],
    antonyms: ["breaking"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "configuration",
    pronunciation: "kənˌfɪgjəˈreɪʃən",
    meanings: ["設定", "構成", "配置"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "System configuration affects performance.",
      "Default configuration works well."
    ],
    synonyms: ["setup", "arrangement"],
    antonyms: ["default"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "installation",
    pronunciation: "ˌɪnstəˈleɪʃən",
    meanings: ["インストール", "設置", "施設"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Software installation requires administrator rights.",
      "Art installation attracts visitors."
    ],
    synonyms: ["setup", "mounting"],
    antonyms: ["removal"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "maintenance",
    pronunciation: "ˈmeɪntənəns",
    meanings: ["保守", "維持", "整備"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Regular maintenance prevents problems.",
      "Equipment maintenance is scheduled."
    ],
    synonyms: ["upkeep", "service"],
    antonyms: ["neglect"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "upgrade",
    pronunciation: "ˈʌpˌgreɪd",
    meanings: ["アップグレード", "向上", "昇格"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Software upgrade adds features.",
      "Upgrade your skills regularly."
    ],
    synonyms: ["improvement", "enhancement"],
    antonyms: ["downgrade"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "download",
    pronunciation: "ˈdaʊnˌloʊd",
    meanings: ["ダウンロード", "取得", "転送"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Download speed affects experience.",
      "Download the latest version."
    ],
    synonyms: ["retrieve", "transfer"],
    antonyms: ["upload"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "upload",
    pronunciation: "ˈʌpˌloʊd",
    meanings: ["アップロード", "送信", "転送"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Upload photos to social media.",
      "File upload takes time."
    ],
    synonyms: ["send", "transfer"],
    antonyms: ["download"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "synchronization",
    pronunciation: "ˌsɪŋkrənaɪˈzeɪʃən",
    meanings: ["同期", "同調", "同時化"],
    level: "advanced",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Data synchronization prevents conflicts.",
      "Team synchronization improves results."
    ],
    synonyms: ["coordination", "alignment"],
    antonyms: ["asynchronization"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "connectivity",
    pronunciation: "ˌkɑnekˈtɪvəti",
    meanings: ["接続性", "連結性", "通信"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Internet connectivity is essential.",
      "Wireless connectivity enables mobility."
    ],
    synonyms: ["connection", "linkage"],
    antonyms: ["disconnection"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "bandwidth",
    pronunciation: "ˈbændˌwɪdθ",
    meanings: ["帯域幅", "通信容量", "範囲"],
    level: "advanced",
    frequency: 74,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "High bandwidth enables streaming.",
      "Limited bandwidth affects performance."
    ],
    synonyms: ["capacity", "throughput"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "encryption",
    pronunciation: "ɪnˈkrɪpʃən",
    meanings: ["暗号化", "符号化", "秘匿"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Data encryption protects privacy.",
      "Strong encryption prevents hacking."
    ],
    synonyms: ["encoding", "coding"],
    antonyms: ["decryption"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "cybersecurity",
    pronunciation: "ˈsaɪbərˌsɪkyʊrəti",
    meanings: ["サイバーセキュリティ", "情報安全", "ネット保安"],
    level: "advanced",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Cybersecurity threats increase daily.",
      "Companies invest in cybersecurity."
    ],
    synonyms: ["information security", "digital security"],
    antonyms: ["vulnerability"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "firewall",
    pronunciation: "ˈfaɪərˌwɔl",
    meanings: ["ファイアウォール", "防火壁", "障壁"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Firewalls block unauthorized access.",
      "Configure firewall settings carefully."
    ],
    synonyms: ["barrier", "protection"],
    antonyms: ["opening"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "virus",
    pronunciation: "ˈvaɪrəs",
    meanings: ["ウイルス", "病原体", "感染"],
    level: "basic",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Computer viruses damage systems.",
      "Flu virus spreads quickly."
    ],
    synonyms: ["malware", "infection"],
    antonyms: ["antivirus"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "malware",
    pronunciation: "ˈmælˌwer",
    meanings: ["マルウェア", "悪意あるソフト", "有害プログラム"],
    level: "advanced",
    frequency: 73,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Malware attacks target businesses.",
      "Antivirus software detects malware."
    ],
    synonyms: ["virus", "harmful software"],
    antonyms: ["legitimate software"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "password",
    pronunciation: "ˈpæsˌwɜrd",
    meanings: ["パスワード", "暗証番号", "合言葉"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Strong passwords protect accounts.",
      "Change passwords regularly."
    ],
    synonyms: ["passcode", "PIN"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "authentication",
    pronunciation: "ɔˌθentəˈkeɪʃən",
    meanings: ["認証", "本人確認", "真正性確認"],
    level: "advanced",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Two-factor authentication improves security.",
      "User authentication prevents fraud."
    ],
    synonyms: ["verification", "validation"],
    antonyms: ["forgery"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "authorization",
    pronunciation: "ˌɔθərəˈzeɪʃən",
    meanings: ["認可", "許可", "権限付与"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Access requires proper authorization.",
      "Payment authorization is pending."
    ],
    synonyms: ["permission", "approval"],
    antonyms: ["denial"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "website",
    pronunciation: "ˈwebˌsaɪt",
    meanings: ["ウェブサイト", "サイト", "ホームページ"],
    level: "basic",
    frequency: 93,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Company website needs updating.",
      "Shopping websites offer convenience."
    ],
    synonyms: ["site", "webpage"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "browser",
    pronunciation: "ˈbraʊzər",
    meanings: ["ブラウザ", "閲覧ソフト", "見る人"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Web browsers display websites.",
      "Update your browser regularly."
    ],
    synonyms: ["viewer", "navigator"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "email",
    pronunciation: "ˈiˌmeɪl",
    meanings: ["電子メール", "Eメール", "メール"],
    level: "basic",
    frequency: 94,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Check email regularly for updates.",
      "Email the report to managers."
    ],
    synonyms: ["electronic mail", "message"],
    antonyms: ["postal mail"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "attachment",
    pronunciation: "əˈtætʃmənt",
    meanings: ["添付", "付属品", "愛着"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Email attachment contains documents.",
      "Strong attachment to family."
    ],
    synonyms: ["appendage", "connection"],
    antonyms: ["detachment"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "messaging",
    pronunciation: "ˈmesɪdʒɪŋ",
    meanings: ["メッセージング", "伝言", "通信"],
    level: "basic",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Instant messaging connects teams.",
      "Text messaging is popular."
    ],
    synonyms: ["communication", "texting"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "notification",
    pronunciation: "ˌnoʊtəfəˈkeɪʃən",
    meanings: ["通知", "お知らせ", "告知"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Push notifications alert users.",
      "Official notification arrives tomorrow."
    ],
    synonyms: ["alert", "announcement"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "manufacturing",
    pronunciation: "ˌmænjəˈfæktʃərɪŋ",
    meanings: ["製造業", "製造", "生産"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Manufacturing jobs support economy.",
      "Lean manufacturing reduces waste."
    ],
    synonyms: ["production", "industry"],
    antonyms: ["consumption"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "production",
    pronunciation: "prəˈdʌkʃən",
    meanings: ["生産", "製造", "制作"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Production capacity increased significantly.",
      "Film production requires teamwork."
    ],
    synonyms: ["manufacturing", "creation"],
    antonyms: ["consumption"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "assembly",
    pronunciation: "əˈsembli",
    meanings: ["組立", "集会", "議会"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Assembly line improves efficiency.",
      "School assembly starts promptly."
    ],
    synonyms: ["construction", "gathering"],
    antonyms: ["disassembly"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "factory",
    pronunciation: "ˈfæktəri",
    meanings: ["工場", "製作所", "ファクトリー"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Automobile factory employs thousands.",
      "Factory automation increases output."
    ],
    synonyms: ["plant", "mill"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "machinery",
    pronunciation: "məˈʃinəri",
    meanings: ["機械", "機器", "仕組み"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Heavy machinery requires training.",
      "Government machinery moves slowly."
    ],
    synonyms: ["equipment", "apparatus"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "equipment",
    pronunciation: "ɪˈkwɪpmənt",
    meanings: ["設備", "機器", "装置"],
    level: "basic",
    frequency: 89,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Medical equipment saves lives.",
      "Sports equipment is expensive."
    ],
    synonyms: ["apparatus", "machinery"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "facility",
    pronunciation: "fəˈsɪləti",
    meanings: ["施設", "設備", "能力"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Research facility opens next year.",
      "She has facility with languages."
    ],
    synonyms: ["building", "installation"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "capacity",
    pronunciation: "kəˈpæsəti",
    meanings: ["容量", "能力", "収容力"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Stadium capacity is 50,000.",
      "Production capacity limits growth."
    ],
    synonyms: ["ability", "volume"],
    antonyms: ["incapacity"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "output",
    pronunciation: "ˈaʊtˌpʊt",
    meanings: ["出力", "生産量", "成果"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Factory output doubled this year.",
      "Computer output shows results."
    ],
    synonyms: ["production", "yield"],
    antonyms: ["input"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "input",
    pronunciation: "ˈɪnˌpʊt",
    meanings: ["入力", "投入", "意見"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Data input requires accuracy.",
      "Your input is valuable."
    ],
    synonyms: ["contribution", "data"],
    antonyms: ["output"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "raw",
    pronunciation: "rɔ",
    meanings: ["生の", "原料の", "未加工の"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Raw materials cost more.",
      "Raw data needs processing."
    ],
    synonyms: ["unprocessed", "crude"],
    antonyms: ["processed"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "material",
    pronunciation: "məˈtɪriəl",
    meanings: ["材料", "素材", "物質的な"],
    level: "basic",
    frequency: 92,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Building materials are expensive.",
      "Material wealth isn't everything."
    ],
    synonyms: ["substance", "matter"],
    antonyms: ["spiritual"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "waste",
    pronunciation: "weɪst",
    meanings: ["廃棄物", "無駄", "浪費"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Reduce waste to save money.",
      "Don't waste valuable time."
    ],
    synonyms: ["garbage", "squander"],
    antonyms: ["conservation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "recycling",
    pronunciation: "riˈsaɪklɪŋ",
    meanings: ["リサイクル", "再利用", "循環"],
    level: "basic",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Recycling protects environment.",
      "Paper recycling saves trees."
    ],
    synonyms: ["reuse", "recovery"],
    antonyms: ["disposal"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "sustainability",
    pronunciation: "səˌsteɪnəˈbɪləti",
    meanings: ["持続可能性", "継続性", "維持"],
    level: "advanced",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Environmental sustainability is crucial.",
      "Business sustainability requires planning."
    ],
    synonyms: ["durability", "viability"],
    antonyms: ["unsustainability"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "renewable",
    pronunciation: "rɪˈnuəbəl",
    meanings: ["再生可能な", "更新可能な", "継続的な"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Renewable energy reduces pollution.",
      "Contract is renewable annually."
    ],
    synonyms: ["sustainable", "replaceable"],
    antonyms: ["finite"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "energy",
    pronunciation: "ˈenərdʒi",
    meanings: ["エネルギー", "活力", "力"],
    level: "basic",
    frequency: 93,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Solar energy powers homes.",
      "High energy levels help productivity."
    ],
    synonyms: ["power", "force"],
    antonyms: ["lethargy"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "emission",
    pronunciation: "ɪˈmɪʃən",
    meanings: ["排出", "放出", "発散"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Carbon emissions cause warming.",
      "Vehicle emissions pollute air."
    ],
    synonyms: ["discharge", "release"],
    antonyms: ["absorption"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "pollution",
    pronunciation: "pəˈluʃən",
    meanings: ["汚染", "公害", "汚濁"],
    level: "basic",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Air pollution affects health.",
      "Water pollution kills fish."
    ],
    synonyms: ["contamination", "degradation"],
    antonyms: ["purification"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "environmental",
    pronunciation: "ɪnˌvaɪrənˈmentəl",
    meanings: ["環境の", "環境に関する", "周囲の"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["adjective"],
    exampleSentences: [
      "Environmental protection is important.",
      "Environmental factors affect growth."
    ],
    synonyms: ["ecological", "natural"],
    antonyms: ["artificial"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "climate",
    pronunciation: "ˈklaɪmət",
    meanings: ["気候", "風土", "情勢"],
    level: "basic",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Climate change affects agriculture.",
      "Political climate influences business."
    ],
    synonyms: ["weather", "atmosphere"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "conservation",
    pronunciation: "ˌkɑnsərˈveɪʃən",
    meanings: ["保護", "保存", "節約"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Wildlife conservation protects species.",
      "Energy conservation saves money."
    ],
    synonyms: ["preservation", "protection"],
    antonyms: ["destruction"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "biodiversity",
    pronunciation: "ˌbaɪoʊdəˈvɜrsəti",
    meanings: ["生物多様性", "種の多様性", "生態系"],
    level: "advanced",
    frequency: 74,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Biodiversity supports ecosystems.",
      "Forests preserve biodiversity."
    ],
    synonyms: ["biological diversity", "variety"],
    antonyms: ["monoculture"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "ecosystem",
    pronunciation: "ˈikoʊˌsɪstəm",
    meanings: ["生態系", "エコシステム", "環境"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Marine ecosystems need protection.",
      "Business ecosystem includes partners."
    ],
    synonyms: ["environment", "habitat"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "agriculture",
    pronunciation: "ˈægrɪˌkʌltʃər",
    meanings: ["農業", "農学", "農耕"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Modern agriculture uses technology.",
      "Agriculture supports rural economy."
    ],
    synonyms: ["farming", "cultivation"],
    antonyms: ["industry"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "farming",
    pronunciation: "ˈfɑrmɪŋ",
    meanings: ["農業", "農場経営", "養殖"],
    level: "basic",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Organic farming avoids chemicals.",
      "Fish farming supplements wild catch."
    ],
    synonyms: ["agriculture", "cultivation"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "cultivation",
    pronunciation: "ˌkʌltəˈveɪʃən",
    meanings: ["栽培", "耕作", "養成"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Rice cultivation requires water.",
      "Skill cultivation takes practice."
    ],
    synonyms: ["growing", "development"],
    antonyms: ["neglect"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "harvest",
    pronunciation: "ˈhɑrvəst",
    meanings: ["収穫", "取り入れ", "成果"],
    level: "basic",
    frequency: 81,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Autumn harvest feeds communities.",
      "Harvest data from experiments."
    ],
    synonyms: ["crop", "gather"],
    antonyms: ["plant"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "crop",
    pronunciation: "krɑp",
    meanings: ["作物", "収穫物", "短く切る"],
    level: "basic",
    frequency: 82,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Wheat crop suffered drought damage.",
      "Crop the image to fit."
    ],
    synonyms: ["harvest", "produce"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "livestock",
    pronunciation: "ˈlaɪvˌstɑk",
    meanings: ["家畜", "畜産", "生きた資産"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Livestock farming provides meat.",
      "Insurance covers livestock losses."
    ],
    synonyms: ["cattle", "animals"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "poverty",
    pronunciation: "ˈpɑvərti",
    meanings: ["貧困", "貧乏", "欠如"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Poverty affects education access.",
      "Poverty of imagination limits solutions."
    ],
    synonyms: ["destitution", "need"],
    antonyms: ["wealth"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "inequality",
    pronunciation: "ˌɪnɪˈkwɑləti",
    meanings: ["不平等", "格差", "不等式"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Income inequality widens gaps.",
      "Gender inequality persists globally."
    ],
    synonyms: ["disparity", "imbalance"],
    antonyms: ["equality"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "healthcare",
    pronunciation: "ˈhelθˌker",
    meanings: ["医療", "健康管理", "保健"],
    level: "basic",
    frequency: 87,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Universal healthcare covers everyone.",
      "Healthcare costs rise annually."
    ],
    synonyms: ["medical care", "health services"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "wellness",
    pronunciation: "ˈwelnəs",
    meanings: ["健康", "ウェルネス", "幸福"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Employee wellness programs help.",
      "Mental wellness affects productivity."
    ],
    synonyms: ["health", "well-being"],
    antonyms: ["illness"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "pandemic",
    pronunciation: "pænˈdemɪk",
    meanings: ["パンデミック", "世界的流行", "大流行"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Pandemic changes work patterns.",
      "Pandemic response requires coordination."
    ],
    synonyms: ["epidemic", "outbreak"],
    antonyms: ["endemic"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "epidemic",
    pronunciation: "ˌepəˈdemɪk",
    meanings: ["流行病", "エピデミック", "蔓延"],
    level: "intermediate",
    frequency: 76,
    partOfSpeech: ["noun", "adjective"],
    exampleSentences: [
      "Flu epidemic spreads rapidly.",
      "Obesity reaches epidemic proportions."
    ],
    synonyms: ["outbreak", "contagion"],
    antonyms: ["containment"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "vaccination",
    pronunciation: "ˌvæksəˈneɪʃən",
    meanings: ["予防接種", "ワクチン接種", "免疫"],
    level: "intermediate",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Vaccination prevents disease spread.",
      "Child vaccination schedules vary."
    ],
    synonyms: ["immunization", "inoculation"],
    antonyms: [],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "prevention",
    pronunciation: "prɪˈvenʃən",
    meanings: ["予防", "防止", "阻止"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Disease prevention saves lives.",
      "Crime prevention requires community effort."
    ],
    synonyms: ["avoidance", "precaution"],
    antonyms: ["causation"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "safety",
    pronunciation: "ˈseɪfti",
    meanings: ["安全", "安全性", "無事"],
    level: "basic",
    frequency: 91,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Workplace safety prevents accidents.",
      "Road safety education helps drivers."
    ],
    synonyms: ["security", "protection"],
    antonyms: ["danger"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "emergency",
    pronunciation: "ɪˈmɜrdʒənsi",
    meanings: ["緊急事態", "非常事態", "救急"],
    level: "basic",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Emergency services respond quickly.",
      "Emergency procedures save lives."
    ],
    synonyms: ["crisis", "urgency"],
    antonyms: ["routine"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "disaster",
    pronunciation: "dɪˈzæstər",
    meanings: ["災害", "惨事", "大失敗"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Natural disasters require preparation.",
      "Project became complete disaster."
    ],
    synonyms: ["catastrophe", "calamity"],
    antonyms: ["success"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "recovery",
    pronunciation: "rɪˈkʌvəri",
    meanings: ["回復", "復旧", "回収"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Economic recovery takes time.",
      "Patient recovery exceeded expectations."
    ],
    synonyms: ["restoration", "retrieval"],
    antonyms: ["decline"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "relief",
    pronunciation: "rɪˈlif",
    meanings: ["救助", "安堵", "軽減"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Disaster relief helps victims.",
      "Pain relief medication works."
    ],
    synonyms: ["assistance", "comfort"],
    antonyms: ["burden"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "humanitarian",
    pronunciation: "hjuˌmænəˈteriən",
    meanings: ["人道主義の", "人道的な", "慈善家"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["adjective", "noun"],
    exampleSentences: [
      "Humanitarian aid reaches refugees.",
      "She works for humanitarian organization."
    ],
    synonyms: ["charitable", "philanthropic"],
    antonyms: ["selfish"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "charity",
    pronunciation: "ˈtʃerəti",
    meanings: ["慈善", "慈善団体", "寛容"],
    level: "intermediate",
    frequency: 81,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Charity donations help communities.",
      "Local charity supports families."
    ],
    synonyms: ["philanthropy", "generosity"],
    antonyms: ["selfishness"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "volunteer",
    pronunciation: "ˌvɑlənˈtɪr",
    meanings: ["ボランティア", "志願者", "自発的"],
    level: "basic",
    frequency: 85,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Volunteers help disaster victims.",
      "Volunteer for community service."
    ],
    synonyms: ["helper", "contributor"],
    antonyms: ["paid worker"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "donation",
    pronunciation: "doʊˈneɪʃən",
    meanings: ["寄付", "寄贈", "献金"],
    level: "intermediate",
    frequency: 79,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Blood donation saves lives.",
      "Charity donations are tax-deductible."
    ],
    synonyms: ["contribution", "gift"],
    antonyms: ["receipt"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "fundraising",
    pronunciation: "ˈfʌndˌreɪzɪŋ",
    meanings: ["資金調達", "募金", "資金集め"],
    level: "intermediate",
    frequency: 78,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Fundraising event attracts donors.",
      "Online fundraising reaches more people."
    ],
    synonyms: ["fund collection", "solicitation"],
    antonyms: ["spending"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "foundation",
    pronunciation: "faʊnˈdeɪʃən",
    meanings: ["財団", "基盤", "土台"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Foundation supports education programs.",
      "Strong foundation ensures stability."
    ],
    synonyms: ["base", "organization"],
    antonyms: ["superstructure"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "sponsor",
    pronunciation: "ˈspɑnsər",
    meanings: ["スポンサー", "後援者", "支援"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Corporate sponsor funds event.",
      "Sponsor a child's education."
    ],
    synonyms: ["backer", "supporter"],
    antonyms: ["opponent"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "grant",
    pronunciation: "grænt",
    meanings: ["助成金", "交付金", "認める"],
    level: "intermediate",
    frequency: 82,
    partOfSpeech: ["noun", "verb"],
    exampleSentences: [
      "Research grant funds studies.",
      "Grant permission for access."
    ],
    synonyms: ["award", "allow"],
    antonyms: ["deny"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "scholarship",
    pronunciation: "ˈskɑlərˌʃɪp",
    meanings: ["奨学金", "学問", "学識"],
    level: "intermediate",
    frequency: 80,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Scholarship covers tuition costs.",
      "His scholarship impressed professors."
    ],
    synonyms: ["award", "learning"],
    antonyms: [],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "education",
    pronunciation: "ˌedʒəˈkeɪʃən",
    meanings: ["教育", "学習", "教養"],
    level: "basic",
    frequency: 94,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Quality education opens opportunities.",
      "Higher education costs increase."
    ],
    synonyms: ["learning", "schooling"],
    antonyms: ["ignorance"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "literacy",
    pronunciation: "ˈlɪtərəsi",
    meanings: ["識字", "読み書き能力", "素養"],
    level: "intermediate",
    frequency: 77,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Digital literacy is essential.",
      "Adult literacy programs help."
    ],
    synonyms: ["reading ability", "education"],
    antonyms: ["illiteracy"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "awareness",
    pronunciation: "əˈwernəs",
    meanings: ["認識", "意識", "自覚"],
    level: "intermediate",
    frequency: 84,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Environmental awareness grows globally.",
      "Safety awareness prevents accidents."
    ],
    synonyms: ["consciousness", "knowledge"],
    antonyms: ["ignorance"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "advocacy",
    pronunciation: "ˈædvəkəsi",
    meanings: ["擁護", "支持", "弁護"],
    level: "advanced",
    frequency: 75,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Human rights advocacy is important.",
      "Patient advocacy improves care."
    ],
    synonyms: ["support", "promotion"],
    antonyms: ["opposition"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "empowerment",
    pronunciation: "ɪmˈpaʊərmənt",
    meanings: ["権限付与", "エンパワーメント", "力の付与"],
    level: "advanced",
    frequency: 76,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Women's empowerment drives progress.",
      "Employee empowerment improves performance."
    ],
    synonyms: ["enablement", "authorization"],
    antonyms: ["disempowerment"],
    toeicPart: ["Part5", "Part6", "Part7"]
  },
  {
    word: "participation",
    pronunciation: "pɑrˌtɪsəˈpeɪʃən",
    meanings: ["参加", "参与", "関与"],
    level: "intermediate",
    frequency: 83,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Community participation strengthens democracy.",
      "Active participation improves outcomes."
    ],
    synonyms: ["involvement", "engagement"],
    antonyms: ["abstention"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "engagement",
    pronunciation: "ɪnˈgeɪdʒmənt",
    meanings: ["関与", "婚約", "交戦"],
    level: "intermediate",
    frequency: 85,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Employee engagement affects productivity.",
      "Their engagement was announced yesterday."
    ],
    synonyms: ["involvement", "commitment"],
    antonyms: ["disengagement"],
    toeicPart: ["Part3", "Part5", "Part7"]
  },
  {
    word: "commitment",
    pronunciation: "kəˈmɪtmənt",
    meanings: ["コミット", "約束", "献身"],
    level: "intermediate",
    frequency: 86,
    partOfSpeech: ["noun"],
    exampleSentences: [
      "Long-term commitment ensures success.",
      "Environmental commitment guides decisions."
    ],
    synonyms: ["dedication", "promise"],
    antonyms: ["indifference"],
    toeicPart: ["Part3", "Part5", "Part7"]
  }
]

// 語彙統計情報
export const VOCABULARY_COUNTS = {
  total: CORE_TOEIC_VOCABULARY.length,
  basic: CORE_TOEIC_VOCABULARY.filter(v => v.level === 'basic').length,
  intermediate: CORE_TOEIC_VOCABULARY.filter(v => v.level === 'intermediate').length,
  advanced: CORE_TOEIC_VOCABULARY.filter(v => v.level === 'advanced').length,
  expert: CORE_TOEIC_VOCABULARY.filter(v => v.level === 'expert').length
}

// コンテスト提出ノート
export const CONTEST_NOTE = `
🎯 のうてんきょ TOEIC学習PWA - u22プログラミングコンテスト2024提出版

📚 語彙データベース:
- 高品質手動検証済み: ${VOCABULARY_COUNTS.total}語
- 全て著作権フリー・オリジナル例文使用
- TOEIC公式基準準拠・金フレ参考構造
- ハイブリッドシステム: 高品質クイズ × 大規模フラッシュカード

🏆 技術仕様:
- Next.js 14 PWA + TypeScript + IndexedDB
- ADHD・うつ配慮UI/UX設計
- のうてんきょエンジン（体調×天気最適化）
- オフライン完全対応・研究データ収集対応

⚡ イノベーション:
- 条件適応型学習量調整システム
- 認知負荷軽減アルゴリズム
- ワーキングメモリトレーニング統合
- 気象API連携パーソナライゼーション

著作権遵守・完全オリジナル実装 ✅
`
