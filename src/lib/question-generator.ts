// TOEIC問題生成エンジン
// のうてんきょ専用の問題生成ロジック

import { RealContentGenerator } from './real-content-generator'
import type { Task } from './types'

export interface QuestionBase {
  id: string
  type: 'vocabulary' | 'grammar' | 'listening' | 'reading'
  part: number // TOEIC Part 1-7
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: number // 正解のインデックス (0-3)
  explanation: string
  audio?: string // リスニング問題用の音声URL
  tags: string[]
  estimatedTime: number // 推定解答時間（秒）
}

export interface VocabularyQuestion extends QuestionBase {
  type: 'vocabulary'
  word: string
  pronunciation: string
  partOfSpeech: string
  exampleSentence: string
}

export interface GrammarQuestion extends QuestionBase {
  type: 'grammar'
  grammarPoint: string
  rule: string
}

export interface ListeningQuestion extends QuestionBase {
  type: 'listening'
  part: 1 | 2 | 3 | 4
  audio: string
  transcript?: string // スクリプト（答え合わせ用）
}

export interface ReadingQuestion extends QuestionBase {
  type: 'reading'
  part: 5 | 6 | 7
  passage?: string // Part 7用の文章
}

export class QuestionGenerator {
  // レベルをのうてんきょスコアに変換するヘルパー関数
  private static userLevelToScore(
    userLevel: 'basic' | 'intermediate' | 'advanced' | 'expert',
    baseScore: number
  ): number {
    const levelBonus = {
      basic: 0,
      intermediate: 10,
      advanced: 20,
      expert: 30
    }
    return Math.min(100, baseScore + levelBonus[userLevel])
  }

  // のうてんきょスコアに基づくタスク生成
  static async generateTasksForScore(
    noutenkyoScore: number,
    userLevel: 'basic' | 'intermediate' | 'advanced' | 'expert' = 'intermediate',
    taskCount: number = 5
  ): Promise<Task[]> {
    const tasks: Task[] = []
    
    // スコアに基づく負荷調整
    const load = noutenkyoScore >= 70 ? 'heavy' : noutenkyoScore >= 40 ? 'medium' : 'light'
    
    // タスクタイプの選択（スコアに基づく）
    const taskTypes: Array<'vocabulary' | 'grammar' | 'listening' | 'reading'> = []
    
    if (noutenkyoScore >= 30) {
      taskTypes.push('vocabulary')
    }
    if (noutenkyoScore >= 50) {
      taskTypes.push('grammar')
    }
    if (noutenkyoScore >= 60) {
      taskTypes.push('listening')
    }
    if (noutenkyoScore >= 70) {
      taskTypes.push('reading')
    }
    
    // タスクタイプが空の場合は回復モード
    if (taskTypes.length === 0) {
      // 回復モード用の軽いタスクを生成
      const recoveryTask = this.generateRecoveryTask(userLevel)
      tasks.push(recoveryTask)
      return tasks
    }
    
    // 指定された数のタスクを生成
    for (let i = 0; i < taskCount; i++) {
      const taskType = taskTypes[i % taskTypes.length]
      const adjustedScore = this.userLevelToScore(userLevel, noutenkyoScore)
      
      let task: Task
      switch (taskType) {
        case 'vocabulary':
          task = RealContentGenerator.generateVocabularyTask(adjustedScore, userLevel)
          break
        case 'grammar':
          task = RealContentGenerator.generateGrammarTask(adjustedScore)
          break
        case 'listening':
          task = RealContentGenerator.generateListeningTask(adjustedScore)
          break
        case 'reading':
          task = RealContentGenerator.generateReadingTask(adjustedScore)
          break
        default:
          task = RealContentGenerator.generateVocabularyTask(adjustedScore, userLevel)
      }
      
      tasks.push(task)
    }
    
    return tasks
  }

  // ADHD対応: 短時間集中型タスクセット
  static async generateADHDFriendlyTasks(
    noutenkyoScore: number,
    userLevel: 'basic' | 'intermediate' | 'advanced' | 'expert' = 'intermediate',
    maxTimeMinutes: number = 15
  ): Promise<Task[]> {
    const tasks: Task[] = []
    let totalTime = 0
    
    // ADHD向けには軽い負荷のタスクを中心に
    const adjustedScore = this.userLevelToScore(userLevel, Math.min(noutenkyoScore, 60)) // ADHDフレンドリーなので最大60点
    
    while (totalTime < maxTimeMinutes) {
      const remainingTime = maxTimeMinutes - totalTime
      
      let task: Task
      if (remainingTime < 5) {
        // 残り時間が短い場合は単語タスク（軽量化）
        task = RealContentGenerator.generateVocabularyTask(Math.min(adjustedScore, 40), userLevel)
      } else if (remainingTime < 10) {
        // 中程度の時間がある場合
        task = Math.random() > 0.5 
          ? RealContentGenerator.generateVocabularyTask(adjustedScore, userLevel)
          : RealContentGenerator.generateGrammarTask(Math.min(adjustedScore, 50))
      } else {
        // 十分時間がある場合はバランス良く
        const taskTypes: Array<'vocabulary' | 'grammar'> = ['vocabulary', 'grammar']
        const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)]
        
        task = taskType === 'vocabulary' 
          ? RealContentGenerator.generateVocabularyTask(adjustedScore, userLevel)
          : RealContentGenerator.generateGrammarTask(adjustedScore)
      }
      
      if (totalTime + task.lengthMinutes <= maxTimeMinutes) {
        tasks.push(task)
        totalTime += task.lengthMinutes
      } else {
        break
      }
    }
    
    return tasks
  }

  // 特定タイプのタスクを生成
  static async generateSpecificTask(
    type: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'workingmemory' | 'recovery',
    userLevel: 'basic' | 'intermediate' | 'advanced' | 'expert' = 'intermediate',
    load: 'light' | 'medium' | 'heavy' = 'medium'
  ): Promise<Task> {
    // loadをスコアに変換
    const baseScore = load === 'light' ? 40 : load === 'medium' ? 60 : 80
    const adjustedScore = this.userLevelToScore(userLevel, baseScore)
    
    switch (type) {
      case 'vocabulary':
        return RealContentGenerator.generateVocabularyTask(adjustedScore, userLevel)
      case 'grammar':
        return RealContentGenerator.generateGrammarTask(adjustedScore)
      case 'listening':
        return RealContentGenerator.generateListeningTask(adjustedScore)
      case 'reading':
        return RealContentGenerator.generateReadingTask(adjustedScore)
      case 'workingmemory':
        return this.generateWorkingMemoryTask(userLevel, load)
      case 'recovery':
        return this.generateRecoveryTask(userLevel)
      default:
        return RealContentGenerator.generateVocabularyTask(adjustedScore, userLevel)
    }
  }

  // ワーキングメモリトレーニングタスク
  static generateWorkingMemoryTask(
    userLevel: 'basic' | 'intermediate' | 'advanced' | 'expert',
    load: 'light' | 'medium' | 'heavy'
  ): Task {
    const levelMap = { basic: 3, intermediate: 4, advanced: 5, expert: 6 }
    const sequenceLength = levelMap[userLevel] + (load === 'light' ? -1 : load === 'heavy' ? 1 : 0)
    
    return {
      id: `wm_${Date.now()}`,
      type: 'workingmemory',
      title: 'ワーキングメモリトレーニング',
      description: `${sequenceLength}個の単語を順序通りに覚えてください`,
      part: 'workingmemory',
      load,
      lengthMinutes: load === 'light' ? 3 : load === 'medium' ? 5 : 8,
      tags: ['working-memory', 'adhd-support', `sequence-${sequenceLength}`],
      completed: false
    }
  }

  // 回復モードタスク
  static generateRecoveryTask(
    userLevel: 'basic' | 'intermediate' | 'advanced' | 'expert'
  ): Task {
    const activities = [
      '深呼吸エクササイズ',
      '英語の歌を聞く',
      '簡単な英単語を眺める',
      '好きな英語フレーズを復習する'
    ]
    
    const activity = activities[Math.floor(Math.random() * activities.length)]
    
    return {
      id: `recovery_${Date.now()}`,
      type: 'recovery',
      title: '回復モード',
      description: `今日はお疲れ様です。${activity}でリラックスしましょう`,
      part: 'recovery',
      load: 'light',
      lengthMinutes: 5,
      tags: ['recovery', 'self-care', 'relaxation'],
      completed: false
    }
  }

  // デイリータスクセット生成
  static async generateDailyTasks(
    noutenkyoScore: number,
    userLevel: 'basic' | 'intermediate' | 'advanced' | 'expert' = 'intermediate',
    userPreferences: {
      focusAreas?: Array<'vocabulary' | 'grammar' | 'listening' | 'reading'>
      maxTimeMinutes?: number
      includeWorkingMemory?: boolean
    } = {}
  ): Promise<Task[]> {
    const {
      focusAreas = ['vocabulary', 'grammar'],
      maxTimeMinutes = 30,
      includeWorkingMemory = true
    } = userPreferences
    
    const tasks: Task[] = []
    let totalTime = 0
    
    // のうてんきょスコアに基づく負荷調整
    const load: 'light' | 'medium' | 'heavy' = noutenkyoScore >= 70 ? 'heavy' : noutenkyoScore >= 40 ? 'medium' : 'light'
    
    // 低スコア時は回復モードを含める
    if (noutenkyoScore < 30) {
      const recoveryTask = this.generateRecoveryTask(userLevel)
      tasks.push(recoveryTask)
      totalTime += recoveryTask.lengthMinutes
    }
    
    // ワーキングメモリトレーニング（ADHD対応）
    if (includeWorkingMemory && noutenkyoScore >= 40) {
      const wmTask = this.generateWorkingMemoryTask(userLevel, 'light')
      if (totalTime + wmTask.lengthMinutes <= maxTimeMinutes) {
        tasks.push(wmTask)
        totalTime += wmTask.lengthMinutes
      }
    }
    
    // メイン学習タスク
    const mainTaskTypes = [...focusAreas]
    let taskIndex = 0
    
    while (totalTime < maxTimeMinutes && taskIndex < 10) { // 無限ループ防止
      const taskType = mainTaskTypes[taskIndex % mainTaskTypes.length]
      const remainingTime = maxTimeMinutes - totalTime
      
      // 残り時間に基づく負荷調整
      let adjustedLoad: 'light' | 'medium' | 'heavy' = load
      if (remainingTime < 10) {
        adjustedLoad = 'light'
      } else if (remainingTime < 20) {
        adjustedLoad = load === 'heavy' ? 'medium' : load
      }
      
      const task = await this.generateSpecificTask(taskType, userLevel, adjustedLoad)
      
      if (totalTime + task.lengthMinutes <= maxTimeMinutes) {
        tasks.push(task)
        totalTime += task.lengthMinutes
        taskIndex++
      } else {
        break
      }
    }
    
    return tasks
  }

  // Question-testページ用のシンプルなQuestion生成メソッド
  static generateVocabularyQuestion(difficulty: string): QuestionBase {
    const vocabularies = [
      {
        word: 'accomplish',
        meaning: '達成する',
        options: ['達成する', '開始する', '遅らせる', '忘れる'],
        correct: 0
      },
      {
        word: 'collaborate',
        meaning: '協力する',
        options: ['競争する', '協力する', '批判する', '無視する'],
        correct: 1
      },
      {
        word: 'implement',
        meaning: '実施する',
        options: ['計画する', '検討する', '実施する', '中止する'],
        correct: 2
      }
    ]
    
    const vocab = vocabularies[Math.floor(Math.random() * vocabularies.length)]
    
    return {
      id: `vocab_${Date.now()}`,
      type: 'vocabulary',
      difficulty: difficulty as any,
      part: 5,
      question: `Choose the best meaning for "${vocab.word}":`,
      options: vocab.options,
      correctAnswer: vocab.correct,
      explanation: `"${vocab.word}" means "${vocab.meaning}".`,
      tags: ['vocabulary', 'meaning', difficulty],
      estimatedTime: 1
    }
  }

  static generateGrammarQuestion(difficulty: string): QuestionBase {
    const grammarQuestions = [
      {
        question: 'The meeting ____ postponed until next week.',
        options: ['has been', 'have been', 'was been', 'were been'],
        correct: 0,
        explanation: 'Use "has been" for present perfect passive with singular subjects.'
      },
      {
        question: 'If you ____ any questions, please contact me.',
        options: ['will have', 'have', 'had', 'having'],
        correct: 1,
        explanation: 'Use simple present tense "have" in conditional sentences.'
      }
    ]
    
    const grammar = grammarQuestions[Math.floor(Math.random() * grammarQuestions.length)]
    
    return {
      id: `grammar_${Date.now()}`,
      type: 'grammar',
      difficulty: difficulty as any,
      part: 5,
      question: grammar.question,
      options: grammar.options,
      correctAnswer: grammar.correct,
      explanation: grammar.explanation,
      tags: ['grammar', 'structure', difficulty],
      estimatedTime: 1
    }
  }

  static generateListeningQuestion(part: string): QuestionBase {
    return {
      id: `listening_${Date.now()}`,
      type: 'listening',
      difficulty: 'medium' as any,
      part: parseInt(part.replace('part', '')) || 1,
      question: 'What is the main topic of the conversation?',
      options: ['Business meeting', 'Travel plans', 'Product launch', 'Training session'],
      correctAnswer: 0,
      explanation: 'The speakers discuss scheduling a business meeting.',
      tags: ['listening', 'conversation', 'medium'],
      estimatedTime: 2
    }
  }

  static generateADHDFriendlySet(score: number, maxTime: number): QuestionBase[] {
    const questions: QuestionBase[] = []
    const questionCount = Math.min(5, Math.floor(maxTime / 60)) // 1問あたり1分として計算
    
    for (let i = 0; i < questionCount; i++) {
      const type = i % 2 === 0 ? 'vocabulary' : 'grammar'
      const difficulty = score > 70 ? 'hard' : score > 40 ? 'medium' : 'easy'
      
      if (type === 'vocabulary') {
        questions.push(this.generateVocabularyQuestion(difficulty))
      } else {
        questions.push(this.generateGrammarQuestion(difficulty))
      }
    }
    
    return questions
  }
}
