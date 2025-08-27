// クリーンな語彙データベース
export interface VocabularyEntry {
  id: string
  word: string
  pronunciation: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'interjection'
  meanings: string[]
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  frequency: number
  synonyms: string[]
  antonyms: string[]
  collocations: string[]
  exampleSentences: {
    english: string
    japanese: string
    context: string
  }[]
  categories: string[]
}

// 基本的な語彙エントリのサンプル
export const CLEAN_VOCABULARY: VocabularyEntry[] = [
  {
    id: 'vocab_basic_0001',
    word: 'schedule',
    pronunciation: '/ˈʃedjuːl/',
    partOfSpeech: 'noun',
    meanings: ["スケジュール", "予定", "計画"],
    level: 'basic',
    frequency: 8,
    synonyms: ["timetable", "agenda", "plan"],
    antonyms: ["improvisation"],
    collocations: ["busy schedule", "schedule management", "schedule conflict"],
    exampleSentences: [
      { 
        english: "I need to check my schedule for next week.", 
        japanese: "来週の予定を確認する必要があります。", 
        context: "business" 
      },
      { 
        english: "The project schedule has been delayed.", 
        japanese: "プロジェクトのスケジュールが遅れています。", 
        context: "workplace" 
      }
    ],
    categories: ["business", "general", "time"]
  },
  {
    id: 'vocab_basic_0002',
    word: 'management',
    pronunciation: '/ˈmænɪdʒmənt/',
    partOfSpeech: 'noun',
    meanings: ["管理", "経営", "マネジメント"],
    level: 'basic',
    frequency: 9,
    synonyms: ["administration", "supervision", "control"],
    antonyms: ["mismanagement"],
    collocations: ["project management", "time management", "senior management"],
    exampleSentences: [
      { 
        english: "Good management is essential for business success.", 
        japanese: "良い経営はビジネス成功に不可欠です。", 
        context: "business" 
      },
      { 
        english: "She works in management at a large corporation.", 
        japanese: "彼女は大企業で管理職として働いています。", 
        context: "career" 
      }
    ],
    categories: ["business", "leadership", "general"]
  },
  {
    id: 'vocab_basic_0003',
    word: 'meeting',
    pronunciation: '/ˈmiːtɪŋ/',
    partOfSpeech: 'noun',
    meanings: ["会議", "ミーティング", "打ち合わせ"],
    level: 'basic',
    frequency: 8,
    synonyms: ["conference", "gathering", "assembly"],
    antonyms: ["separation"],
    collocations: ["board meeting", "staff meeting", "meeting room"],
    exampleSentences: [
      { 
        english: "We have a meeting scheduled for 3 PM.", 
        japanese: "午後3時に会議の予定があります。", 
        context: "business" 
      },
      { 
        english: "The meeting was very productive.", 
        japanese: "その会議はとても生産的でした。", 
        context: "workplace" 
      }
    ],
    categories: ["business", "communication", "general"]
  }
]

// レベル別の語彙を取得する関数
export function getVocabularyByLevel(level: VocabularyEntry['level']): VocabularyEntry[] {
  return CLEAN_VOCABULARY.filter(entry => entry.level === level)
}

// ランダムな語彙を取得する関数
export function getRandomVocabulary(count: number = 10): VocabularyEntry[] {
  const shuffled = [...CLEAN_VOCABULARY].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 特定の品詞の語彙を取得する関数
export function getVocabularyByPartOfSpeech(partOfSpeech: VocabularyEntry['partOfSpeech']): VocabularyEntry[] {
  return CLEAN_VOCABULARY.filter(entry => entry.partOfSpeech === partOfSpeech)
}

export default CLEAN_VOCABULARY
