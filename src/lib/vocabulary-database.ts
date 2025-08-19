// TOEIC完全単語データベース（新版）
// 包括的データベースから必要な語彙を提供

import { 
  COMPREHENSIVE_VOCABULARY,
  getVocabularyByLevel,
  getVocabularyByCategory,
  getVocabularyByDifficulty,
  getRandomVocabulary,
  searchVocabulary,
  getAllVocabulary as getComprehensiveVocabulary,
  getTOEICEssentialVocabulary,
  getRecommendedVocabulary,
  type VocabularyEntry
} from './comprehensive-vocabulary'

// 型定義の再エクスポート
export type { VocabularyEntry }

// 包括的データベースから必要な語彙を抽出
export const BASIC_VOCABULARY = getVocabularyByLevel('basic')
export const INTERMEDIATE_VOCABULARY = getVocabularyByLevel('intermediate') 
export const ADVANCED_VOCABULARY = getVocabularyByLevel('advanced')
export const EXPERT_VOCABULARY = getVocabularyByLevel('expert')

// 統合された全語彙
export const ALL_VOCABULARY = COMPREHENSIVE_VOCABULARY

// 統計情報
export const VOCABULARY_STATS = {
  basic: BASIC_VOCABULARY.length,
  intermediate: INTERMEDIATE_VOCABULARY.length,
  advanced: ADVANCED_VOCABULARY.length,
  expert: EXPERT_VOCABULARY.length,
  total: ALL_VOCABULARY.length
}

// エクスポート関数（既存APIとの互換性維持）
export function getAllVocabulary(): VocabularyEntry[] {
  return getComprehensiveVocabulary()
}

// 関数の再エクスポート
export { 
  getVocabularyByLevel,
  getVocabularyByCategory,
  getVocabularyByDifficulty,
  getRandomVocabulary,
  searchVocabulary,
  getTOEICEssentialVocabulary,
  getRecommendedVocabulary
}

// デフォルトエクスポート
export default ALL_VOCABULARY
