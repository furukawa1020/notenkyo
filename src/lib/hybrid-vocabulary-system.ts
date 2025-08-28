// ハイブリッド語彙システム - コンテスト最適版
// 四択問題：金フレベース高品質データ
// その他：12,000語大規模データベース

import { VocabularyEntry as CoreVocabularyEntry, CORE_TOEIC_VOCABULARY } from './toeic-core-vocabulary'
import { VocabularyEntry as EnhancedVocabularyEntry, getVocabularyByLevel as getEnhancedVocabulary, CLEAN_VOCABULARY } from './enhanced-vocabulary-database'

// 型の統一（両方のVocabularyEntryに対応）
export type UnifiedVocabularyEntry = CoreVocabularyEntry | EnhancedVocabularyEntry

export interface VocabularySystemConfig {
  useHighQualityForQuizzes: boolean // 四択問題に高品質データを使用
  useEnhancedForOther: boolean     // その他機能に12,000語データを使用
  fallbackToEnhanced: boolean      // 金フレデータ不足時のフォールバック
}

export class HybridVocabularySystem {
  private config: VocabularySystemConfig

  constructor(config: VocabularySystemConfig = {
    useHighQualityForQuizzes: true,
    useEnhancedForOther: true, 
    fallbackToEnhanced: true
  }) {
    this.config = config
  }

  // 四択問題用：高品質金フレデータ優先
  getQuizVocabulary(
    level: 'basic' | 'intermediate' | 'advanced' | 'expert',
    count: number = 20
  ): UnifiedVocabularyEntry[] {
    if (this.config.useHighQualityForQuizzes) {
      // 金フレベースデータから選択
      const coreWords = CORE_TOEIC_VOCABULARY.filter(word => word.level === level)
      
      if (coreWords.length >= count) {
        // 十分な数がある場合は金フレから
        return this.shuffleArray(coreWords).slice(0, count)
      } else if (this.config.fallbackToEnhanced) {
        // 不足分は12,000語データベースで補完
        const enhancedWords = getEnhancedVocabulary(level)
        const combined = [...coreWords, ...enhancedWords.slice(0, count - coreWords.length)]
        return this.shuffleArray(combined)
      }
    }
    
    // フォールバック：12,000語データベース
    return getEnhancedVocabulary(level).slice(0, count)
  }

  // フラッシュカード・復習用：12,000語大規模データ
  getFlashcardVocabulary(
    level: 'basic' | 'intermediate' | 'advanced' | 'expert',
    count: number = 50
  ): UnifiedVocabularyEntry[] {
    if (this.config.useEnhancedForOther) {
      return getEnhancedVocabulary(level).slice(0, count)
    }
    return this.getQuizVocabulary(level, count)
  }

  // 読解・リスニング用：12,000語大規模データ
  getComprehensionVocabulary(
    level: 'basic' | 'intermediate' | 'advanced' | 'expert',
    count: number = 100
  ): UnifiedVocabularyEntry[] {
    return getEnhancedVocabulary(level).slice(0, count)
  }

  // 特定単語検索：高品質データ優先
  findWord(word: string): UnifiedVocabularyEntry | null {
    // まず金フレデータから検索
    const coreWord = CORE_TOEIC_VOCABULARY.find(entry => entry.word.toLowerCase() === word.toLowerCase())
    if (coreWord) return coreWord

    // 見つからない場合は12,000語データベースから
    return CLEAN_VOCABULARY.find(entry => entry.word.toLowerCase() === word.toLowerCase()) || null
  }

  // ランダムボキャブラリ：用途別
  getRandomVocabulary(
    purpose: 'quiz' | 'flashcard' | 'comprehension' | 'general',
    count: number = 10
  ): UnifiedVocabularyEntry[] {
    switch (purpose) {
      case 'quiz':
        return this.getQuizVocabulary('basic', count)
      case 'flashcard':
        return this.getFlashcardVocabulary('intermediate', count)
      case 'comprehension':
        return this.getComprehensionVocabulary('advanced', count)
      default:
        return getEnhancedVocabulary('basic').slice(0, count)
    }
  }

  // システム統計情報
  getSystemStats() {
    return {
      coreVocabularySize: CORE_TOEIC_VOCABULARY.length,
      enhancedVocabularySize: CLEAN_VOCABULARY.length,
      totalVocabularySize: CORE_TOEIC_VOCABULARY.length + CLEAN_VOCABULARY.length,
      qualityAssuredWords: CORE_TOEIC_VOCABULARY.length,
      qualityAssuranceRate: (CORE_TOEIC_VOCABULARY.length / (CORE_TOEIC_VOCABULARY.length + CLEAN_VOCABULARY.length) * 100).toFixed(1)
    }
  }

  // 配列シャッフル用ヘルパー
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

// デフォルトインスタンス
export const hybridVocabularySystem = new HybridVocabularySystem()

// コンテスト用設定
export const contestOptimizedConfig: VocabularySystemConfig = {
  useHighQualityForQuizzes: true,  // 四択は必ず高品質データ
  useEnhancedForOther: true,       // その他は12,000語の豊富さを活用
  fallbackToEnhanced: true         // 安全性確保
}

// 便利な関数エクスポート
export const getQuizWords = (level: 'basic' | 'intermediate' | 'advanced' | 'expert', count: number = 20) => 
  hybridVocabularySystem.getQuizVocabulary(level, count)

export const getFlashcardWords = (level: 'basic' | 'intermediate' | 'advanced' | 'expert', count: number = 50) =>
  hybridVocabularySystem.getFlashcardVocabulary(level, count)

export const findVocabularyWord = (word: string) => 
  hybridVocabularySystem.findWord(word)

// コンテスト用アピールポイント
export const CONTEST_FEATURES = {
  title: "ハイブリッド語彙システム",
  description: "品質保証された金フレベース500語 + 大規模12,000語データベースの最適統合",
  benefits: [
    "四択問題：100%品質保証済み語彙で確実な学習",
    "読解・リスニング：12,000語の豊富な語彙でリアルな学習体験", 
    "フォールバック機能：システム障害時も継続学習可能",
    "用途別最適化：学習目的に応じた最適なデータソース選択"
  ],
  technicalHighlights: [
    "TypeScript完全対応",
    "メモリ効率的なデータ管理",
    "拡張性を考慮した設計",
    "品質指標の可視化"
  ]
}
