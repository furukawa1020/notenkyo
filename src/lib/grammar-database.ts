// TOEIC完全文法データベース（新版）
// 包括的文法データベースから必要な問題を提供

import {
  COMPREHENSIVE_GRAMMAR,
  getGrammarByLevel,
  getGrammarByCategory,
  getGrammarByDifficulty,
  getRandomGrammar,
  getHighFrequencyGrammar,
  getAllGrammar as getComprehensiveGrammar,
  getTOEICEssentialGrammar,
  getRecommendedGrammar,
  type GrammarQuestion
} from './comprehensive-grammar'

// 型定義の互換性維持
export interface GrammarQuestionData {
  id: string
  part?: 5 | 6
  type?: 'single' | 'text-completion' | 'fill-blank' | 'choose-correct' | 'error-correction'
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  category: string
  subcategory?: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  grammarPoint?: string
  passage?: string
  japaneseTranslation?: string
  businessContext?: string
  difficulty?: number
  frequency?: number
  tags?: string[]
}

// 型定義の再エクスポート
export type { GrammarQuestion }

// 包括的データベースから必要な問題を抽出
export const PART5_QUESTIONS = getGrammarByCategory('parts-of-speech').concat(
  getGrammarByCategory('tenses'),
  getGrammarByCategory('prepositions'),
  getGrammarByCategory('conjunctions')
).slice(0, 200) // Part 5形式の問題

export const PART6_QUESTIONS = getGrammarByCategory('text-completion').concat(
  getGrammarByCategory('context-clues'),
  getGrammarByCategory('discourse-markers')
).slice(0, 100) // Part 6形式の問題

export const BASIC_GRAMMAR = getGrammarByLevel('basic')
export const INTERMEDIATE_GRAMMAR = getGrammarByLevel('intermediate') 
export const ADVANCED_GRAMMAR = getGrammarByLevel('advanced')
export const EXPERT_GRAMMAR = getGrammarByLevel('expert')

// 統合された全問題
export const ALL_GRAMMAR = COMPREHENSIVE_GRAMMAR

// 旧形式との互換性
export const ALL_GRAMMAR_QUESTIONS = ALL_GRAMMAR

// 統計情報
export const GRAMMAR_STATS = {
  basic: BASIC_GRAMMAR.length,
  intermediate: INTERMEDIATE_GRAMMAR.length,
  advanced: ADVANCED_GRAMMAR.length,
  expert: EXPERT_GRAMMAR.length,
  part5: PART5_QUESTIONS.length,
  part6: PART6_QUESTIONS.length,
  total: ALL_GRAMMAR.length
}

// エクスポート関数（既存APIとの互換性維持）
export function getAllGrammar(): GrammarQuestion[] {
  return getComprehensiveGrammar()
}

// 関数の再エクスポート
export {
  getGrammarByLevel,
  getGrammarByCategory,
  getGrammarByDifficulty,
  getRandomGrammar,
  getHighFrequencyGrammar,
  getTOEICEssentialGrammar,
  getRecommendedGrammar
}

// 旧API互換性関数
export function getGrammarQuestions(filter?: {
  part?: 5 | 6
  difficulty?: 'basic' | 'intermediate' | 'advanced'
  grammarPoint?: string
  count?: number
}): GrammarQuestion[] {
  let questions = ALL_GRAMMAR

  if (filter?.difficulty) {
    questions = getGrammarByLevel(filter.difficulty)
  }

  if (filter?.grammarPoint) {
    questions = questions.filter(q => 
      q.category === filter.grammarPoint || 
      q.subcategory === filter.grammarPoint ||
      q.tags.includes(filter.grammarPoint)
    )
  }

  if (filter?.part === 5) {
    questions = PART5_QUESTIONS
  } else if (filter?.part === 6) {
    questions = PART6_QUESTIONS
  }

  if (filter?.count) {
    return questions.slice(0, filter.count)
  }

  return questions
}

// 旧形式API互換性
export function getRandomGrammarQuestions(
  count: number, 
  part?: 5 | 6, 
  difficulty?: 'basic' | 'intermediate' | 'advanced'
): GrammarQuestion[] {
  return getGrammarQuestions({ count, part, difficulty })
}

// デフォルトエクスポート
export default ALL_GRAMMAR
