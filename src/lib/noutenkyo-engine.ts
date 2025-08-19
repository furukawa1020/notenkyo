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

// 負荷レベルに基づく推奨学習時間
export function getRecommendedStudyTime(noutenkyoScore: number): number {
  if (noutenkyoScore >= 80) return 60 // 1時間
  if (noutenkyoScore >= 60) return 45 // 45分
  if (noutenkyoScore >= 40) return 30 // 30分
  if (noutenkyoScore >= 20) return 15 // 15分
  return 10 // 10分（回復モード）
}

// のうてんきょスコアに基づく学習戦略提案
export function getStudyStrategy(noutenkyoScore: number): {
  strategy: string
  focus: string
  tips: string[]
} {
  if (noutenkyoScore >= 80) {
    return {
      strategy: '集中強化モード',
      focus: '苦手分野の集中学習と新しい挑戦',
      tips: [
        '難易度の高い問題にチャレンジしましょう',
        'まとめて長時間の学習が効果的です',
        'リーディング長文問題にも取り組めます'
      ]
    }
  } else if (noutenkyoScore >= 60) {
    return {
      strategy: '安定学習モード',
      focus: 'バランスの取れた総合学習',
      tips: [
        'バランス良く各分野を学習しましょう',
        '45分程度の学習が適しています',
        'リスニング問題を積極的に取り組めます'
      ]
    }
  } else if (noutenkyoScore >= 40) {
    return {
      strategy: '基礎固めモード',
      focus: '基本の復習と着実な進歩',
      tips: [
        '基本的な単語と文法に集中しましょう',
        '30分程度の短時間学習がおすすめです',
        'ワーキングメモリトレーニングも有効です'
      ]
    }
  } else if (noutenkyoScore >= 20) {
    return {
      strategy: '軽量学習モード',
      focus: '無理のない軽い学習',
      tips: [
        '簡単な単語学習から始めましょう',
        '15分程度の短時間で区切りましょう',
        '好きな分野から手をつけてください'
      ]
    }
  } else {
    return {
      strategy: '回復モード',
      focus: 'リラックスと体調回復',
      tips: [
        '今日は無理をせず休息を優先しましょう',
        '軽い音楽を聞いたり深呼吸をしてください',
        '明日の体調が良くなるよう自分をいたわりましょう'
      ]
    }
  }
}
