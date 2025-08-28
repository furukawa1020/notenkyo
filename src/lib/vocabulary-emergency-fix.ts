// 緊急修正：問題のある語彙エントリを無効化
// コンテスト用の暫定措置

import { VocabularyEntry } from './enhanced-vocabulary-database'

// 問題のあるエントリを特定
const PROBLEMATIC_PATTERNS = [
  /meanings.*〜する/,
  /meanings.*〜を行う/,
  /meanings.*です$/,
  /meanings.*に関する/,
  /meanings.*について/
]

// 最低限の修正マップ
const EMERGENCY_FIXES: Record<string, string[]> = {
  'search': ['探す', '検索する', '捜査'],
  'work': ['働く', '仕事', '機能する'],
  'study': ['勉強する', '研究', '学習'],
  'help': ['助ける', '手伝う', '援助'],
  'make': ['作る', '製造する', '〜させる'],
  'take': ['取る', '持参する', '時間がかかる'],
  'give': ['与える', '贈る', 'あげる'],
  'get': ['得る', '取得する', '到着する'],
  'come': ['来る', '到着する', '起こる'],
  'go': ['行く', '進む', '出発する'],
  'see': ['見る', '会う', '理解する'],
  'know': ['知る', '分かる', '理解する'],
  'think': ['考える', '思う', '意見する'],
  'say': ['言う', '述べる', '話す'],
  'tell': ['伝える', '教える', '話す'],
  'ask': ['尋ねる', '質問する', '頼む'],
  'try': ['試す', '挑戦する', '努力する'],
  'use': ['使う', '利用する', '使用する'],
  'find': ['見つける', '発見する', '判明する'],
  'want': ['欲しい', '望む', '必要とする']
}

// 語彙データベースの品質チェック関数
export function validateVocabularyEntry(entry: VocabularyEntry): boolean {
  // 問題パターンをチェック
  const meaningText = entry.meanings.join(' ')
  return !PROBLEMATIC_PATTERNS.some(pattern => pattern.test(meaningText))
}

// 緊急修正を適用
export function applyEmergencyFix(entry: VocabularyEntry): VocabularyEntry {
  const word = entry.word.toLowerCase()
  
  if (EMERGENCY_FIXES[word]) {
    return {
      ...entry,
      meanings: EMERGENCY_FIXES[word]
    }
  }
  
  // 問題のあるエントリは無効化
  if (!validateVocabularyEntry(entry)) {
    console.warn(`Invalid entry detected: ${entry.word}`)
    return {
      ...entry,
      meanings: ['定義を確認中']
    }
  }
  
  return entry
}

// 安全な語彙取得関数
export function getSafeVocabularyEntries(entries: VocabularyEntry[]): VocabularyEntry[] {
  return entries
    .map(applyEmergencyFix)
    .filter(entry => entry.meanings[0] !== '定義を確認中')
    .slice(0, 1000) // コンテスト用に1000語まで制限
}

// コンテスト用のメッセージ
export const CONTEST_DISCLAIMER = `
🚨 データベース状況
・現在の語彙データベースに品質問題を確認
・コンテスト用に緊急修正版を使用
・正式版では全データの手動検証を実施予定
・機能デモには十分な品質を確保
`

// 統計情報
export function getDatabaseStats(entries: VocabularyEntry[]) {
  const total = entries.length
  const valid = entries.filter(validateVocabularyEntry).length
  const fixed = Object.keys(EMERGENCY_FIXES).length
  
  return {
    total,
    valid,
    problematic: total - valid,
    fixedCount: fixed,
    qualityRate: Math.round((valid / total) * 100)
  }
}
