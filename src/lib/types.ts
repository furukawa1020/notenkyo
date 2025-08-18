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

export interface Task {
  id: string
  title: string
  description: string
  part: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'mocktest' | 'workingmemory' | 'recovery'
  load: 'light' | 'medium' | 'heavy'
  lengthMinutes: number
  tags: string[]
  completed: boolean
  score?: number
  date?: string
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
