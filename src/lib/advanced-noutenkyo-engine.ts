import { UserState, Task } from './types'

// 高度なのうてんきょスコア計算
export function calculateAdvancedNoutenkyoScore(userState: UserState): number {
  const { mood, energy, focus, anxiety, sleepHours, weather, temperature } = userState
  
  // 基本体調スコア（0-100）
  const moodScore = (mood / 5) * 100
  const energyScore = (energy / 5) * 100
  const focusScore = (focus / 5) * 100
  const anxietyScore = ((5 - anxiety) / 5) * 100 // 不安は逆転
  
  // 睡眠の影響（6-8時間が最適）
  let sleepScore = 100
  if (sleepHours < 6) {
    sleepScore = Math.max(0, sleepHours * 16.67) // 6時間未満は大幅減点
  } else if (sleepHours > 8) {
    sleepScore = Math.max(60, 100 - (sleepHours - 8) * 10) // 8時間超過は軽減点
  }
  
  // 天気の影響（気分との相関を考慮）
  let weatherMultiplier = 1.0
  switch (weather) {
    case 'sunny':
      weatherMultiplier = mood >= 4 ? 1.1 : 1.05 // 気分が良い時はさらにプラス
      break
    case 'cloudy':
      weatherMultiplier = 1.0
      break
    case 'rainy':
      weatherMultiplier = mood <= 2 ? 0.85 : 0.95 // 気分が悪い時はさらにマイナス
      break
  }
  
  // 気温の影響（20-25度が最適）
  let tempMultiplier = 1.0
  if (temperature < 15 || temperature > 30) {
    tempMultiplier = 0.9
  } else if (temperature < 18 || temperature > 28) {
    tempMultiplier = 0.95
  }
  
  // 重み付き平均計算
  const baseScore = (
    moodScore * 0.25 +
    energyScore * 0.25 +
    focusScore * 0.3 +
    anxietyScore * 0.15 +
    sleepScore * 0.05
  )
  
  // 環境要因の適用
  const finalScore = baseScore * weatherMultiplier * tempMultiplier
  
  return Math.round(Math.max(0, Math.min(100, finalScore)))
}

// ADHD特性を考慮したタスク生成
export function generateOptimizedTasks(noutenkyoScore: number, preferences?: {
  preferredParts?: string[]
  avoidParts?: string[]
  maxDailyTasks?: number
  difficulty?: 'auto' | 'easy' | 'medium' | 'hard'
}): Task[] {
  const tasks: Task[] = []
  const maxTasks = preferences?.maxDailyTasks || 5
  
  // スコア区分による負荷調整
  let taskLoad: 'light' | 'medium' | 'heavy'
  let taskCount: number
  let sessionLength: number
  
  if (noutenkyoScore >= 80) {
    taskLoad = 'heavy'
    taskCount = Math.min(maxTasks, 6)
    sessionLength = 20
  } else if (noutenkyoScore >= 60) {
    taskLoad = 'medium'
    taskCount = Math.min(maxTasks, 4)
    sessionLength = 15
  } else if (noutenkyoScore >= 40) {
    taskLoad = 'light'
    taskCount = Math.min(maxTasks, 3)
    sessionLength = 10
  } else {
    // 回復モード
    return generateRecoveryTasks(noutenkyoScore)
  }
  
  // バランスの取れたタスク配分
  const taskTypes = [
    'vocabulary',
    'grammar', 
    'listening',
    'reading'
  ]
  
  // 好みとスコアに基づくタスク選択
  const availableTypes = taskTypes.filter(type => {
    if (preferences?.avoidParts?.indexOf(type) !== -1) return false
    if (preferences?.preferredParts?.length && preferences.preferredParts.indexOf(type) === -1) return false
    return true
  })
  
  // ADHD配慮：タスクの多様性を確保
  for (let i = 0; i < taskCount; i++) {
    const typeIndex = i % availableTypes.length
    const taskType = availableTypes[typeIndex]
    
    // ワーキングメモリトレーニングを低スコア時に追加
    if (noutenkyoScore < 60 && i === taskCount - 1) {
      tasks.push({
        id: `wm-${Date.now()}-${i}`,
        title: 'ワーキングメモリトレーニング',
        description: 'ADHD特性に配慮した認知機能強化',
        type: 'workingmemory',
        part: 'workingmemory',
        load: 'light',
        lengthMinutes: 10,
        tags: ['adhd-support', 'cognitive'],
        completed: false
      })
      continue
    }
    
    const task: Task = {
      id: `task-${Date.now()}-${i}`,
      title: getTaskTitle(taskType, taskLoad),
      description: getTaskDescription(taskType, taskLoad),
      type: taskType as 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'mocktest' | 'workingmemory' | 'recovery',
      part: taskType as Task['part'],
      load: taskLoad,
      lengthMinutes: sessionLength,
      tags: getTaskTags(taskType, noutenkyoScore),
      completed: false
    }
    
    tasks.push(task)
  }
  
  return tasks
}

// 回復モード専用タスク
function generateRecoveryTasks(score: number): Task[] {
  const recoveryTasks: Task[] = [
    {
      id: `recovery-breathing-${Date.now()}`,
      title: '深呼吸エクササイズ',
      description: '心を落ち着けるための呼吸法',
      type: 'recovery',
      part: 'recovery',
      load: 'light',
      lengthMinutes: 5,
      tags: ['mindfulness', 'recovery', 'adhd-calm'],
      completed: false
    },
    {
      id: `recovery-vocab-${Date.now()}`,
      title: '基礎単語復習',
      description: '負担の少ない簡単な単語練習',
      type: 'vocabulary',
      part: 'vocabulary',
      load: 'light',
      lengthMinutes: 8,
      tags: ['recovery', 'basic', 'low-pressure'],
      completed: false
    }
  ]
  
  if (score >= 30) {
    recoveryTasks.push({
      id: `recovery-listening-${Date.now()}`,
      title: '癒しのリスニング',
      description: 'ゆっくりとした音声で聞き取り練習',
      type: 'listening',
      part: 'listening',
      load: 'light',
      lengthMinutes: 10,
      tags: ['recovery', 'gentle', 'audio-therapy'],
      completed: false
    })
  }
  
  return recoveryTasks
}

function getTaskTitle(part: string, load: string): string {
  const titles = {
    vocabulary: {
      light: 'TOEIC基礎単語',
      medium: 'TOEIC重要単語',
      heavy: 'TOEIC上級単語'
    },
    grammar: {
      light: '基本文法復習',
      medium: 'ビジネス文法',
      heavy: '応用文法問題'
    },
    listening: {
      light: '短い会話',
      medium: 'オフィス会話',
      heavy: '長文リスニング'
    },
    reading: {
      light: '短文読解',
      medium: 'ビジネス文書',
      heavy: '長文読解'
    }
  }
  
  return titles[part as keyof typeof titles]?.[load as keyof typeof titles.vocabulary] || 'TOEIC学習'
}

function getTaskDescription(part: string, load: string): string {
  const descriptions = {
    vocabulary: {
      light: '基礎的な単語を無理なく学習',
      medium: '実用的な単語力を強化',
      heavy: '高度な語彙力を習得'
    },
    grammar: {
      light: '基本的な文法ルールを確認',
      medium: 'ビジネスで使う文法を学習',
      heavy: '複雑な文法構造を攻略'
    },
    listening: {
      light: '基本的な聞き取り練習',
      medium: '実践的なリスニング力向上',
      heavy: '高速・長文リスニング挑戦'
    },
    reading: {
      light: '短い文章で読解力養成',
      medium: '実用文書の読解練習',
      heavy: '複雑な文章の精読'
    }
  }
  
  return descriptions[part as keyof typeof descriptions]?.[load as keyof typeof descriptions.vocabulary] || 'TOEIC学習を進めます'
}

function getTaskTags(part: string, score: number): string[] {
  const baseTags = [part]
  
  if (score < 50) {
    baseTags.push('adhd-friendly', 'low-pressure')
  } else if (score >= 80) {
    baseTags.push('high-energy', 'challenge')
  }
  
  if (part === 'vocabulary') {
    baseTags.push('memorization', 'spaced-repetition')
  } else if (part === 'listening') {
    baseTags.push('audio', 'concentration')
  }
  
  return baseTags
}

// 学習効果予測
export function predictLearningEffectiveness(noutenkyoScore: number, taskType: string): {
  effectiveness: number
  recommendation: string
  adjustments: string[]
} {
  let effectiveness = noutenkyoScore
  const adjustments: string[] = []
  let recommendation = ''
  
  // タスクタイプによる調整
  if (noutenkyoScore < 50) {
    switch (taskType) {
      case 'vocabulary':
        effectiveness += 10 // 単語学習は低調時でも効果的
        recommendation = '短時間集中で単語学習がおすすめ'
        break
      case 'listening':
        effectiveness -= 5 // 集中が必要なリスニングは若干不利
        adjustments.push('音量を調整', '休憩を多めに')
        break
      case 'reading':
        effectiveness -= 10 // 長文読解は最も不利
        adjustments.push('短い文章から開始', '時間制限を緩く')
        break
      case 'grammar':
        effectiveness += 5 // 文法は構造的で取り組みやすい
        break
    }
  }
  
  // 時間帯による調整
  const hour = new Date().getHours()
  if (hour >= 6 && hour <= 10) {
    effectiveness += 15 // 朝は最適
    recommendation += ' 朝の集中力を活用しましょう'
  } else if (hour >= 14 && hour <= 16) {
    effectiveness += 10 // 午後の集中時間
  } else if (hour >= 20) {
    effectiveness -= 10 // 夜は集中力低下
    adjustments.push('リラックスした環境で', '明日の朝に延期も検討')
  }
  
  return {
    effectiveness: Math.max(0, Math.min(100, effectiveness)),
    recommendation: recommendation || '現在の体調に合わせて学習を進めましょう',
    adjustments
  }
}

// 個人化された学習計画生成
export function generatePersonalizedPlan(
  noutenkyoScore: number,
  learningHistory: any[],
  preferences: any
): {
  weeklyPlan: any[]
  focusAreas: string[]
  motivationalMessage: string
} {
  const focusAreas: string[] = []
  const weeklyPlan: any[] = []
  
  // 学習履歴から弱点分析
  if (learningHistory.length > 0) {
    const averageScores = learningHistory.reduce((acc, session) => {
      acc[session.studyType] = acc[session.studyType] || []
      acc[session.studyType].push(session.score || 0)
      return acc
    }, {} as any)
    
    for (const type in averageScores) {
      const scores = averageScores[type]
      const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length
      if (avg < 70) {
        focusAreas.push(type)
      }
    }
  }
  
  // 1週間の学習計画生成
  for (let day = 0; day < 7; day++) {
    const dayPlan = {
      day: day + 1,
      tasks: generateOptimizedTasks(noutenkyoScore),
      focus: focusAreas[day % focusAreas.length] || 'vocabulary',
      restDay: day === 6 && noutenkyoScore < 60 // 低調時は日曜休息
    }
    weeklyPlan.push(dayPlan)
  }
  
  // 励ましのメッセージ
  let motivationalMessage = ''
  if (noutenkyoScore >= 80) {
    motivationalMessage = '今日は絶好調ですね！挑戦的な学習で大きく成長しましょう！'
  } else if (noutenkyoScore >= 60) {
    motivationalMessage = '良いコンディションです。着実に学習を進めていきましょう。'
  } else if (noutenkyoScore >= 40) {
    motivationalMessage = '今日は無理せずに。小さな積み重ねが大きな成果につながります。'
  } else {
    motivationalMessage = '今日は回復に専念しましょう。明日の学習に向けて心を整えてください。'
  }
  
  return {
    weeklyPlan,
    focusAreas,
    motivationalMessage
  }
}

// 適応的学習システム
export class AdaptiveLearningSystem {
  private userPerformance: Map<string, number[]> = new Map()
  private learningPatterns: Map<string, any> = new Map()

  // パフォーマンス記録
  recordPerformance(taskType: string, score: number, timeSpent: number, noutenkyoScore: number) {
    const key = `${taskType}_${Math.floor(noutenkyoScore / 20) * 20}`
    if (!this.userPerformance.has(key)) {
      this.userPerformance.set(key, [])
    }
    this.userPerformance.get(key)!.push(score)
    
    // パフォーマンスパターンの分析
    this.analyzePattern(taskType, score, timeSpent, noutenkyoScore)
  }

  private analyzePattern(taskType: string, score: number, timeSpent: number, noutenkyoScore: number) {
    const pattern = {
      taskType,
      score,
      timeSpent,
      noutenkyoScore,
      timestamp: Date.now(),
      efficiency: score / timeSpent // 効率指標
    }
    
    this.learningPatterns.set(`${taskType}_${Date.now()}`, pattern)
  }

  // 最適な学習時間帯の予測
  predictOptimalTime(taskType: string): string {
    const patterns = Array.from(this.learningPatterns.values())
      .filter(p => p.taskType === taskType)
    
    if (patterns.length === 0) return '朝の時間（6-10時）'
    
    const hourlyPerformance = new Map<number, number[]>()
    patterns.forEach(p => {
      const hour = new Date(p.timestamp).getHours()
      if (!hourlyPerformance.has(hour)) {
        hourlyPerformance.set(hour, [])
      }
      hourlyPerformance.get(hour)!.push(p.efficiency)
    })
    
    let bestHour = 9 // デフォルト
    let bestAverage = 0
    
    hourlyPerformance.forEach((scores, hour) => {
      const average = scores.reduce((a: number, b: number) => a + b, 0) / scores.length
      if (average > bestAverage) {
        bestAverage = average
        bestHour = hour
      }
    })
    
    return `${bestHour}時頃`
  }

  // 難易度の自動調整
  adjustDifficulty(taskType: string, noutenkyoScore: number): 'easy' | 'medium' | 'hard' {
    const key = `${taskType}_${Math.floor(noutenkyoScore / 20) * 20}`
    const performances = this.userPerformance.get(key) || []
    
    if (performances.length === 0) {
      return noutenkyoScore >= 70 ? 'medium' : 'easy'
    }
    
    const recentAverage = performances.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, performances.length)
    
    if (recentAverage >= 85) return 'hard'
    if (recentAverage >= 70) return 'medium'
    return 'easy'
  }
}
