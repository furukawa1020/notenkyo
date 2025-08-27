// TOEIC完全文法データベース（新版）
// massive-grammar-databaseから必要な問題を提供

import {
  MASSIVE_GRAMMAR_DATABASE,
  BASIC_GRAMMAR,
  INTERMEDIATE_GRAMMAR,
  ADVANCED_GRAMMAR,
  EXPERT_GRAMMAR,
  type GrammarQuestion
} from './massive-grammar-database'

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
  frequency?: number
  tags?: string[]
}

// 型定義の再エクスポート
export type { GrammarQuestion }

// ローカル関数実装
function getGrammarByLevel(level: 'basic' | 'intermediate' | 'advanced' | 'expert'): GrammarQuestion[] {
  return MASSIVE_GRAMMAR_DATABASE.filter(q => q.level === level)
}

function getGrammarByCategory(category: string): GrammarQuestion[] {
  return MASSIVE_GRAMMAR_DATABASE.filter(q => q.category === category)
}

function getGrammarByDifficulty(difficulty: number): GrammarQuestion[] {
  return MASSIVE_GRAMMAR_DATABASE.filter(q => q.difficulty === difficulty)
}

function getRandomGrammar(count: number): GrammarQuestion[] {
  const shuffled = [...MASSIVE_GRAMMAR_DATABASE].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function getHighFrequencyGrammar(count: number = 100): GrammarQuestion[] {
  return MASSIVE_GRAMMAR_DATABASE
    .filter(q => q.frequency >= 4)
    .slice(0, count)
}

function getTOEICEssentialGrammar(count: number = 200): GrammarQuestion[] {
  return MASSIVE_GRAMMAR_DATABASE
    .filter(q => q.frequency >= 3 && q.part === 5)
    .slice(0, count)
}

function getRecommendedGrammar(level: 'basic' | 'intermediate' | 'advanced' | 'expert', count: number = 50): GrammarQuestion[] {
  return getGrammarByLevel(level).slice(0, count)
}

// Part別の問題抽出
export const PART5_QUESTIONS = MASSIVE_GRAMMAR_DATABASE
  .filter(q => q.part === 5)
  .slice(0, 200)

export const PART6_QUESTIONS = MASSIVE_GRAMMAR_DATABASE
  .filter(q => q.part === 6)
  .slice(0, 100)

// レベル別問題（massive-grammar-databaseからの再エクスポート）
export { BASIC_GRAMMAR, INTERMEDIATE_GRAMMAR, ADVANCED_GRAMMAR, EXPERT_GRAMMAR }

// 統合された全問題
export const ALL_GRAMMAR = MASSIVE_GRAMMAR_DATABASE

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
  return MASSIVE_GRAMMAR_DATABASE
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
  difficulty?: 'basic' | 'intermediate' | 'advanced' | 'expert'
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
      q.tags?.includes(filter.grammarPoint)
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
  difficulty?: 'basic' | 'intermediate' | 'advanced' | 'expert'
): GrammarQuestion[] {
  return getGrammarQuestions({ count, part, difficulty })
}

// デフォルトエクスポート
export default ALL_GRAMMAR