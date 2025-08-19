import { UserState, Task } from './types'
import { QuestionGenerator } from './question-generator'

export function calculateNoutenkyoScore(userState: UserState): number {
  const { mood, energy, focus, anxiety, weather, sleepHours } = userState

  // 基本スコア計算（0-100）
  let score = 0
  
  // 体調要素 (60%)
  score += energy * 12 // エネルギー（0-60）
  score += focus * 8   // 集中力（0-40）
  score += mood * 6    // 気分（0-30）
  score -= anxiety * 4 // 不安度（マイナス要素、0-20）
  
  // 睡眠調整 (15%)
  if (sleepHours >= 7 && sleepHours <= 9) {
    score += 15
  } else if (sleepHours >= 6 && sleepHours <= 10) {
    score += 10
  } else if (sleepHours >= 5 && sleepHours <= 11) {
    score += 5
  }
  
  // 天気調整 (25%)
  switch (weather) {
    case 'sunny':
      score += 25
      break
    case 'cloudy':
      score += 15
      break
    case 'rainy':
      score += 10 // 雨の日は集中しやすい人もいる
      break
  }
  
  // 0-100の範囲に正規化
  return Math.max(0, Math.min(100, Math.round(score)))
}

// 実際のコンテンツジェネレーターを使用したタスク生成
export async function generateDailyTasks(
  noutenkyoScore: number,
  userLevel: 'basic' | 'intermediate' | 'advanced' | 'expert' = 'intermediate'
): Promise<Task[]> {
  return await QuestionGenerator.generateDailyTasks(noutenkyoScore, userLevel, {
    focusAreas: ['vocabulary', 'grammar', 'listening', 'reading'],
    maxTimeMinutes: 45,
    includeWorkingMemory: true
  })
}

// ADHD対応のタスク生成
export async function generateADHDFriendlyTasks(
  noutenkyoScore: number,
  userLevel: 'basic' | 'intermediate' | 'advanced' | 'expert' = 'intermediate'
): Promise<Task[]> {
  return await QuestionGenerator.generateADHDFriendlyTasks(noutenkyoScore, userLevel, 15)
}

// 負荷レベルに基づく推奨学習時間（拡大レンジ: 5分-180分）
export function getRecommendedStudyTime(noutenkyoScore: number): number {
  if (noutenkyoScore >= 90) return 180 // 3時間（超集中モード）
  if (noutenkyoScore >= 80) return 120 // 2時間（集中モード）
  if (noutenkyoScore >= 70) return 90  // 1.5時間（充実モード）
  if (noutenkyoScore >= 60) return 60  // 1時間（通常モード）
  if (noutenkyoScore >= 50) return 45  // 45分（軽負荷モード）
  if (noutenkyoScore >= 40) return 30  // 30分（基礎モード）
  if (noutenkyoScore >= 30) return 20  // 20分（軽量モード）
  if (noutenkyoScore >= 20) return 15  // 15分（最小モード）
  return 10 // 10分（回復モード）
}

// 学習強度に基づく詳細レンジ設定
export function getStudyTimeRange(noutenkyoScore: number): { min: number, max: number, recommended: number } {
  const recommended = getRecommendedStudyTime(noutenkyoScore)
  
  if (noutenkyoScore >= 85) {
    return { min: 60, max: 240, recommended } // 1-4時間
  } else if (noutenkyoScore >= 70) {
    return { min: 45, max: 180, recommended } // 45分-3時間
  } else if (noutenkyoScore >= 55) {
    return { min: 30, max: 120, recommended } // 30分-2時間
  } else if (noutenkyoScore >= 40) {
    return { min: 20, max: 90, recommended }  // 20分-1.5時間
  } else if (noutenkyoScore >= 25) {
    return { min: 15, max: 60, recommended }  // 15分-1時間
  } else {
    return { min: 5, max: 30, recommended }   // 5分-30分
  }
}

// のうてんきょスコアに基づく学習戦略提案（拡大レンジ対応）
export function getStudyStrategy(noutenkyoScore: number): {
  strategy: string
  focus: string
  tips: string[]
} {
  if (noutenkyoScore >= 90) {
    return {
      strategy: '超集中マラソンモード',
      focus: '3時間集中：模擬試験 + 弱点克服 + 上級コンテンツ',
      tips: [
        '3時間以上の集中学習が可能です',
        'TOEIC模擬試験2回分を連続実施',
        '990点レベルの高難度問題にチャレンジ',
        '英語ニュース・ビジネス文書の多読',
        '集中力が最高なので苦手分野の徹底攻略'
      ]
    }
  } else if (noutenkyoScore >= 80) {
    return {
      strategy: '集中強化モード',
      focus: '2時間集中：苦手分野の集中学習と新しい挑戦',
      tips: [
        '2時間程度の長時間学習が効果的',
        '難易度の高い問題にチャレンジしましょう',
        'Part7長文問題を複数セット実施',
        'リスニング速度を1.2倍に上げて練習',
        '模擬試験1回分（2時間）の実施も可能'
      ]
    }
  } else if (noutenkyoScore >= 70) {
    return {
      strategy: '充実学習モード',
      focus: '1.5時間：バランス良く4技能を強化',
      tips: [
        '90分間のバランス学習が最適',
        '4技能を均等に15-20分ずつ',
        'まとまった時間での集中学習',
        '新しい語彙・表現の積極的学習',
        '中〜高難度問題への挑戦'
      ]
    }
  } else if (noutenkyoScore >= 60) {
    return {
      strategy: '通常学習モード',
      focus: '1時間：基礎固めと応用練習',
      tips: [
        '1時間の標準的な学習時間',
        '基礎から応用まで段階的に学習',
        '苦手分野に重点を置いた学習',
        '復習と新規学習のバランスを取る'
      ]
    }
  } else if (noutenkyoScore >= 50) {
    return {
      strategy: '軽負荷モード',
      focus: '45分：基礎中心の無理のない学習',
      tips: [
        '45分程度の軽めの学習',
        '基礎的な内容を中心に',
        '復習メインで新規学習は控えめに',
        '得意分野で自信をつける'
      ]
    }
  } else if (noutenkyoScore >= 40) {
    return {
      strategy: '基礎固めモード',
      focus: '30分：基礎的な内容の確実な習得',
      tips: [
        '30分の基礎学習に集中',
        '既習内容の復習中心',
        '簡単な問題で成功体験を積む',
        '無理をせず継続を重視'
      ]
    }
  } else if (noutenkyoScore >= 25) {
    return {
      strategy: '軽量モード',
      focus: '15-20分：簡単な復習と軽い学習',
      tips: [
        '短時間で負担の少ない学習',
        '復習メインで新規学習は最小限',
        '音楽や動画などを活用',
        '楽しみながら学習継続'
      ]
    }
  } else {
    return {
      strategy: '回復モード',
      focus: '5-15分：軽い復習で学習習慣を維持',
      tips: [
        '体調第一、無理は禁物',
        '5-10分の軽い復習のみ',
        '音楽を聞きながらの語彙復習',
        '学習アプリでゲーム感覚',
        '明日への英気を養う'
      ]
    }
  }
}
