export interface UserState {
  date: string
  mood: number // 1-5
  energy: number // 1-5
  focus: number // 1-5
  anxiety: number // 1-5
  sleepHours: number
  weather: 'sunny' | 'cloudy' | 'rainy'
  temperature: number
  note: string
}

export interface NotenkyoScore {
  mood: number // 1-10
  energy: number // 1-10
  focus: number // 1-10
  motivation: number // 1-10
  weather: number // 1-10
  total: number // 計算された総合スコア
}

export interface Task {
  id: string
  title: string
  description: string
  type: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'mocktest' | 'workingmemory' | 'recovery'
  part: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'mocktest' | 'workingmemory' | 'recovery'
  load: 'light' | 'medium' | 'heavy'
  lengthMinutes: number
  tags: string[]
  completed: boolean
  score?: number | null
  date?: string
  
  // 実際のコンテンツ生成用の追加プロパティ
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimatedMinutes?: number
  cognitiveLoad?: number
  adaptiveFeatures?: string[]
  generatedAt?: string
  content?: any // 実際の学習コンテンツデータ
  timeSpent?: number
}

export interface Session {
  id?: number
  taskId: string
  startTime: Date
  endTime?: Date
  correct?: number
  total?: number
  score?: number
  correctAnswers?: number
  totalQuestions?: number
  studyType: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'recovery'
  avgTimePerQuestion?: number
  notes?: string
  date?: string
}

export interface SRSItem {
  itemId: string
  nextReview: Date
  easeFactor: number
  interval: number
  lapses: number
  lastReview?: Date
}

export interface KPI {
  date: string
  accuracy: number
  wordsPerMinute?: number
  tasksCompleted: number
  reviewAdherence?: number
  noutenkyoScore: number
  studyTime: number
}

export interface StudyProgress {
  id?: string
  vocabularyLevel: number
  grammarLevel: number
  listeningLevel: number
  readingLevel: number
  totalStudyTime: number
  streakDays: number
}

export interface StudyProgress {
  vocabularyLevel: number
  grammarLevel: number
  listeningLevel: number
  readingLevel: number
  totalStudyTime: number
  streakDays: number
}
