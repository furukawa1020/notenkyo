// 大規模TOEIC学習エンジン - 12,000単語・2,000文法・1,500コンテンツ問題対応
import { MASSIVE_VOCABULARY_DATABASE } from './massive-vocabulary-database'
import { MASSIVE_GRAMMAR_DATABASE } from './massive-grammar-database'
import { COMPREHENSIVE_LISTENING, COMPREHENSIVE_READING } from './massive-content-database'
import { Task, NotenkyoScore } from './types'

export interface LearningSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  sessionType: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'mixed'
  targetScore: number
  actualScore?: number
  questionsAttempted: number
  questionsCorrect: number
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert'
  noutenkyoScore: NotenkyoScore
  adaptiveAdjustments: {
    difficultyChanged: boolean
    questionTypeChanged: boolean
    sessionLengthAdjusted: boolean
  }
}

export interface LearningProgress {
  userId: string
  totalVocabularyLearned: number
  totalGrammarMastered: number
  totalListeningCompleted: number
  totalReadingCompleted: number
  estimatedTOEICScore: number
  weakAreas: string[]
  strongAreas: string[]
  lastUpdated: Date
  studyStreak: number
  totalStudyTime: number // minutes
}

export interface AdaptiveLearningParams {
  userLevel: number // estimated TOEIC score
  noutenkyoScore: NotenkyoScore
  previousPerformance: number[] // last 10 session scores
  timeAvailable: number // minutes
  preferredDifficulty?: 'basic' | 'intermediate' | 'advanced' | 'expert'
  weakAreas?: string[]
}

export class MassiveLearningEngine {
  private static instance: MassiveLearningEngine
  
  private constructor() {}
  
  static getInstance(): MassiveLearningEngine {
    if (!MassiveLearningEngine.instance) {
      MassiveLearningEngine.instance = new MassiveLearningEngine()
    }
    return MassiveLearningEngine.instance
  }

  /**
   * のうてんきょスコアに基づいて最適な学習セッションを生成
   */
  generateAdaptiveLearningSession(params: AdaptiveLearningParams): Task[] {
    const { userLevel, noutenkyoScore, timeAvailable, previousPerformance } = params
    
    // のうてんきょスコアに基づく学習強度調整
    const learningIntensity = this.calculateLearningIntensity(noutenkyoScore)
    const sessionLength = Math.floor(timeAvailable * learningIntensity)
    
    // ユーザーレベルに基づく難易度決定
    const difficulty = this.determineDifficulty(userLevel, noutenkyoScore)
    
    // 前回のパフォーマンスに基づく学習タイプ選択
    const sessionType = this.selectOptimalSessionType(previousPerformance, params.weakAreas)
    
    // 問題数の調整（ADHDユーザー配慮）
    const questionCount = this.calculateOptimalQuestionCount(sessionLength, difficulty, noutenkyoScore)
    
    return this.createLearningTasks(sessionType, difficulty, questionCount)
  }

  /**
   * のうてんきょスコアから学習強度を計算
   */
  private calculateLearningIntensity(noutenkyoScore: NotenkyoScore): number {
    const { mood, weather, energy, focus, motivation } = noutenkyoScore
    
    // スコアが低い場合は学習強度を下げる（ADHD・うつ配慮）
    const averageScore = (mood + energy + focus + motivation) / 4
    
    if (averageScore < 3) return 0.3 // 軽負荷モード
    if (averageScore < 5) return 0.6 // 標準負荷モード
    if (averageScore < 7) return 0.8 // 中負荷モード
    return 1.0 // 高負荷モード
  }

  /**
   * ユーザーレベルとのうてんきょスコアから最適難易度を決定
   */
  private determineDifficulty(
    userLevel: number, 
    noutenkyoScore: NotenkyoScore
  ): 'basic' | 'intermediate' | 'advanced' | 'expert' {
    const { focus, energy } = noutenkyoScore
    const averageMentalState = (focus + energy) / 2
    
    // 集中力・エネルギーが低い場合は難易度を下げる
    if (averageMentalState < 4) {
      if (userLevel < 600) return 'basic'
      if (userLevel < 800) return 'intermediate'
      return 'advanced' // expertは避ける
    }
    
    // 通常の難易度決定
    if (userLevel < 500) return 'basic'
    if (userLevel < 700) return 'intermediate'
    if (userLevel < 850) return 'advanced'
    return 'expert'
  }

  /**
   * 前回のパフォーマンスから最適な学習タイプを選択
   */
  private selectOptimalSessionType(
    previousPerformance: number[], 
    weakAreas?: string[]
  ): 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'mixed' {
    if (!weakAreas || weakAreas.length === 0) {
      return 'mixed' // バランス型学習
    }
    
    // 弱点分野を優先的に選択
    if (weakAreas.includes('vocabulary')) return 'vocabulary'
    if (weakAreas.includes('grammar')) return 'grammar'
    if (weakAreas.includes('listening')) return 'listening'
    if (weakAreas.includes('reading')) return 'reading'
    
    return 'mixed'
  }

  /**
   * 最適な問題数を計算（ADHD配慮）
   */
  private calculateOptimalQuestionCount(
    sessionLength: number, 
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert',
    noutenkyoScore: NotenkyoScore
  ): number {
    const { focus, energy, motivation } = noutenkyoScore
    const mentalCapacity = (focus + energy + motivation) / 3
    
    // 基本問題数（分）
    let baseQuestions = Math.floor(sessionLength / 2) // 1問あたり2分想定
    
    // 難易度による調整
    const difficultyMultiplier = {
      'basic': 1.0,
      'intermediate': 0.8,
      'advanced': 0.6,
      'expert': 0.5
    }
    
    // メンタル状態による調整
    const mentalMultiplier = Math.max(0.3, mentalCapacity / 10)
    
    const adjustedQuestions = Math.floor(
      baseQuestions * difficultyMultiplier[difficulty] * mentalMultiplier
    )
    
    // 最小・最大制限
    return Math.max(3, Math.min(30, adjustedQuestions))
  }

  /**
   * 学習タスクを生成
   */
  private createLearningTasks(
    sessionType: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'mixed',
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert',
    questionCount: number
  ): Task[] {
    const tasks: Task[] = []
    
    switch (sessionType) {
      case 'vocabulary':
        tasks.push(...this.createVocabularyTasks(difficulty, questionCount))
        break
      case 'grammar':
        tasks.push(...this.createGrammarTasks(difficulty, questionCount))
        break
      case 'listening':
        tasks.push(...this.createListeningTasks(difficulty, questionCount))
        break
      case 'reading':
        tasks.push(...this.createReadingTasks(difficulty, questionCount))
        break
      case 'mixed':
        const vocabCount = Math.floor(questionCount * 0.3)
        const grammarCount = Math.floor(questionCount * 0.3)
        const listeningCount = Math.floor(questionCount * 0.2)
        const readingCount = questionCount - vocabCount - grammarCount - listeningCount
        
        tasks.push(...this.createVocabularyTasks(difficulty, vocabCount))
        tasks.push(...this.createGrammarTasks(difficulty, grammarCount))
        tasks.push(...this.createListeningTasks(difficulty, listeningCount))
        tasks.push(...this.createReadingTasks(difficulty, readingCount))
        break
    }
    
    return this.shuffleTasks(tasks)
  }

  /**
   * 単語学習タスクを生成
   */
  private createVocabularyTasks(
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert',
    count: number
  ): Task[] {
    const allVocab = MASSIVE_VOCABULARY_DATABASE
    const vocabularyData = allVocab.filter(word => word.level === difficulty)
    const selectedWords = vocabularyData.slice(0, count)
    
    return selectedWords.map((word, index) => ({
      id: `vocab_${difficulty}_${Date.now()}_${index}`,
      title: `単語学習: ${word.word}`,
      description: `${word.word}の意味を選択してください`,
      type: 'vocabulary' as const,
      part: 'vocabulary' as const,
      load: 'medium' as const,
      lengthMinutes: 2,
      difficulty: 'intermediate' as const,
      content: {
        word: word.word,
        options: [
          word.meanings[0], // 最初の意味を正解とする
          ...this.getRandomMeanings(word.meanings[0], 3)
        ].sort(() => Math.random() - 0.5),
        correctAnswer: word.meanings[0],
        example: word.exampleSentences[0]?.japanese || ''
      },
      estimatedMinutes: 2,
      tags: word.categories,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    }))
  }

  /**
   * 文法学習タスクを生成
   */
  private createGrammarTasks(
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert',
    count: number
  ): Task[] {
    const allGrammar = MASSIVE_GRAMMAR_DATABASE
    const grammarData = allGrammar.filter(question => question.level === difficulty)
    const selectedQuestions = grammarData.slice(0, count)
    
    return selectedQuestions.map((question, index) => ({
      id: `grammar_${difficulty}_${Date.now()}_${index}`,
      title: `文法問題: Part ${question.part}`,
      description: question.question,
      type: 'grammar' as const,
      part: 'grammar' as const,
      load: 'medium' as const,
      lengthMinutes: 3,
      difficulty: 'intermediate' as const,
      content: {
        question: question.question,
        options: question.options,
        correctAnswer: question.options[question.correctAnswer],
        explanation: question.explanation
      },
      estimatedMinutes: 3,
      tags: [question.grammarPoint],
      completed: false,
      date: new Date().toISOString().split('T')[0]
    }))
  }

  /**
   * リスニング学習タスクを生成
   */
  private createListeningTasks(
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert',
    count: number
  ): Task[] {
    const listeningData = COMPREHENSIVE_LISTENING.filter(q => q.level === difficulty)
    const selectedQuestions = listeningData.slice(0, count)
    
    return selectedQuestions.map((question, index) => ({
      id: `listening_${difficulty}_${Date.now()}_${index}`,
      title: `リスニング問題: Part ${question.part}`,
      description: question.question,
      type: 'listening' as const,
      part: 'listening' as const,
      load: 'medium' as const,
      lengthMinutes: Math.max(1, Math.floor((question.duration || 30) / 60)),
      difficulty: 'intermediate' as const,
      content: {
        audioScript: question.audioScript,
        question: question.question,
        options: question.options,
        correctAnswer: question.options[question.correctAnswer],
        explanation: question.explanation
      },
      estimatedMinutes: Math.max(1, Math.floor((question.duration || 30) / 60)),
      tags: question.tags || [],
      completed: false,
      date: new Date().toISOString().split('T')[0]
    }))
  }

  /**
   * リーディング学習タスクを生成
   */
  private createReadingTasks(
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert',
    count: number
  ): Task[] {
    const readingData = COMPREHENSIVE_READING.filter(p => p.level === difficulty)
    const selectedPassages = readingData.slice(0, count)
    
    const tasks: Task[] = []
    selectedPassages.forEach((passage, passageIndex) => {
      passage.questions.forEach((question, questionIndex) => {
        if (tasks.length < count) {
          tasks.push({
            id: `reading_${difficulty}_${Date.now()}_${passageIndex}_${questionIndex}`,
            title: `リーディング問題: Part ${passage.part}`,
            description: question.question,
            type: 'reading' as const,
            part: 'reading' as const,
            load: 'medium' as const,
            lengthMinutes: Math.max(1, Math.floor(passage.wordCount / 150)),
            difficulty: 'intermediate' as const,
            content: {
              passage: passage.passage,
              question: question.question,
              options: question.options,
              correctAnswer: question.options[question.correctAnswer],
              explanation: question.explanation
            },
            estimatedMinutes: Math.max(1, Math.floor(passage.wordCount / 150)),
            tags: passage.tags || [],
            completed: false,
            date: new Date().toISOString().split('T')[0]
          })
        }
      })
    })
    
    return tasks.slice(0, count)
  }

  /**
   * ヘルパーメソッド群
   */
  private mapDifficultyToNumber(difficulty: string): number {
    const mapping = { 'basic': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }
    return mapping[difficulty as keyof typeof mapping] || 2
  }

  private calculatePoints(difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert'): number {
    const pointMapping = { 'basic': 10, 'intermediate': 20, 'advanced': 30, 'expert': 50 }
    return pointMapping[difficulty]
  }

  private getRandomMeanings(correctMeaning: string, count: number): string[] {
    // 実装では他の単語の意味をランダムに選択
    const dummyMeanings = [
      '会議', '報告書', '売上', '顧客', '製品', 'サービス', '品質', '効率',
      '成長', '利益', '投資', '戦略', '分析', '改善', '開発', '管理'
    ]
    return dummyMeanings
      .filter(meaning => meaning !== correctMeaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
  }

  private shuffleTasks(tasks: Task[]): Task[] {
    const shuffled = [...tasks]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * 学習進捗の分析と推定TOEICスコア計算
   */
  calculateEstimatedTOEICScore(progress: LearningProgress): number {
    const {
      totalVocabularyLearned,
      totalGrammarMastered,
      totalListeningCompleted,
      totalReadingCompleted
    } = progress

    // 基礎スコア計算（各スキルの貢献度）
    const vocabularyScore = Math.min(200, totalVocabularyLearned * 0.1) // 2000語で200点
    const grammarScore = Math.min(200, totalGrammarMastered * 0.2) // 1000問で200点
    const listeningScore = Math.min(300, totalListeningCompleted * 0.3) // 1000問で300点
    const readingScore = Math.min(290, totalReadingCompleted * 0.35) // 830問で290点

    const estimatedScore = vocabularyScore + grammarScore + listeningScore + readingScore
    return Math.round(Math.min(990, Math.max(300, estimatedScore)))
  }

  /**
   * 弱点分野の特定
   */
  identifyWeakAreas(recentSessions: LearningSession[]): string[] {
    const areaPerformance: Record<string, number[]> = {
      vocabulary: [],
      grammar: [],
      listening: [],
      reading: []
    }

    recentSessions.forEach(session => {
      if (session.actualScore !== undefined) {
        areaPerformance[session.sessionType].push(session.actualScore)
      }
    })

    const weakAreas: string[] = []
    Object.entries(areaPerformance).forEach(([area, scores]) => {
      if (scores.length > 0) {
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
        if (averageScore < 0.7) { // 70%未満を弱点とする
          weakAreas.push(area)
        }
      }
    })

    return weakAreas
  }
}

// シングルトンインスタンスのエクスポート
export const massiveLearningEngine = MassiveLearningEngine.getInstance()
