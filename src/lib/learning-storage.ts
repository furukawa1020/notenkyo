// IndexedDB を使用した学習データ永続化システム
// オフライン対応とプライバシー保護を重視

export interface LearningProgress {
  id: string
  userId: string
  date: string
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  toeicScore: number
  sessionResults: SessionResults[]
  totalStudyTime: number
  completedSections: string[]
  vocabulary: VocabularyProgress
  grammar: GrammarProgress
  reading: ReadingProgress
  listening: ListeningProgress
  createdAt: Date
  updatedAt: Date
}

export interface SessionResults {
  sessionId: string
  date: string
  duration: number
  sections: {
    vocabulary?: any
    grammar?: any
    reading?: any
    listening?: any
  }
  totalScore: number
  overallAccuracy: number
}

export interface VocabularyProgress {
  knownWords: Set<string>
  studiedWords: Set<string>
  weakWords: Set<string>
  masteredWords: Set<string>
  lastReviewDates: Map<string, Date>
  streakDays: number
}

export interface GrammarProgress {
  masteredCategories: Set<string>
  weakCategories: Set<string>
  categoryScores: Map<string, number>
  lastPracticeDate: Date
}

export interface ReadingProgress {
  averageWPM: number
  completedPassages: Set<string>
  difficultyProgress: Map<string, number>
  comprehensionScore: number
}

export interface ListeningProgress {
  completedAudios: Set<string>
  averagePlayCount: number
  accuracyByCategory: Map<string, number>
  listeningSpeed: number
}

class LearningStorageManager {
  private dbName = 'NoutenkyoLearningDB'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  constructor() {
    this.initDB()
  }

  // データベース初期化
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve()
        return
      }

      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 学習進捗ストア
        if (!db.objectStoreNames.contains('learningProgress')) {
          const progressStore = db.createObjectStore('learningProgress', { keyPath: 'id' })
          progressStore.createIndex('userId', 'userId', { unique: false })
          progressStore.createIndex('date', 'date', { unique: false })
          progressStore.createIndex('toeicScore', 'toeicScore', { unique: false })
        }

        // セッション結果ストア
        if (!db.objectStoreNames.contains('sessionResults')) {
          const sessionStore = db.createObjectStore('sessionResults', { keyPath: 'sessionId' })
          sessionStore.createIndex('userId', 'userId', { unique: false })
          sessionStore.createIndex('date', 'date', { unique: false })
        }

        // 語彙習得データストア
        if (!db.objectStoreNames.contains('vocabularyData')) {
          const vocabStore = db.createObjectStore('vocabularyData', { keyPath: 'wordId' })
          vocabStore.createIndex('userId', 'userId', { unique: false })
          vocabStore.createIndex('level', 'level', { unique: false })
          vocabStore.createIndex('masteryLevel', 'masteryLevel', { unique: false })
        }

        // ユーザー設定ストア
        if (!db.objectStoreNames.contains('userSettings')) {
          const settingsStore = db.createObjectStore('userSettings', { keyPath: 'userId' })
        }
      }
    })
  }

  // 学習進捗の保存
  async saveLearningProgress(progress: LearningProgress): Promise<void> {
    if (!this.db) await this.initDB()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['learningProgress'], 'readwrite')
      const store = transaction.objectStore('learningProgress')
      
      // Set や Map を JSON シリアライズ可能な形式に変換
      const serializedProgress = this.serializeProgress(progress)
      const request = store.put(serializedProgress)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 学習進捗の取得
  async getLearningProgress(userId: string): Promise<LearningProgress | null> {
    if (!this.db) await this.initDB()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['learningProgress'], 'readonly')
      const store = transaction.objectStore('learningProgress')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => {
        const results = request.result
        if (results.length === 0) {
          resolve(null)
          return
        }

        // 最新の進捗を取得
        const latest = results.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0]

        resolve(this.deserializeProgress(latest))
      }
      request.onerror = () => reject(request.error)
    })
  }

  // セッション結果の保存
  async saveSessionResults(results: SessionResults): Promise<void> {
    if (!this.db) await this.initDB()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessionResults'], 'readwrite')
      const store = transaction.objectStore('sessionResults')
      const request = store.put(results)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // セッション履歴の取得
  async getSessionHistory(userId: string, limit: number = 30): Promise<SessionResults[]> {
    if (!this.db) await this.initDB()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessionResults'], 'readonly')
      const store = transaction.objectStore('sessionResults')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => {
        const results = request.result
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit)
        resolve(results)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 語彙習得データの保存
  async saveVocabularyData(wordId: string, userId: string, data: {
    masteryLevel: number // 0-5
    correctCount: number
    incorrectCount: number
    lastReviewed: Date
    nextReview: Date
  }): Promise<void> {
    if (!this.db) await this.initDB()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['vocabularyData'], 'readwrite')
      const store = transaction.objectStore('vocabularyData')
      
      const vocabData = {
        wordId,
        userId,
        ...data,
        updatedAt: new Date()
      }
      
      const request = store.put(vocabData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // 語彙習得データの取得
  async getVocabularyData(userId: string): Promise<Map<string, any>> {
    if (!this.db) await this.initDB()
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['vocabularyData'], 'readonly')
      const store = transaction.objectStore('vocabularyData')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => {
        const results = request.result
        const vocabMap = new Map()
        
        results.forEach(item => {
          vocabMap.set(item.wordId, item)
        })
        
        resolve(vocabMap)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 統計データの取得
  async getStatistics(userId: string): Promise<{
    totalStudyTime: number
    sessionsCompleted: number
    averageAccuracy: number
    vocabularyProgress: number
    grammarProgress: number
    readingProgress: number
    listeningProgress: number
    streakDays: number
    lastStudyDate: Date | null
  }> {
    const progress = await this.getLearningProgress(userId)
    const sessions = await this.getSessionHistory(userId)

    if (!progress) {
      return {
        totalStudyTime: 0,
        sessionsCompleted: 0,
        averageAccuracy: 0,
        vocabularyProgress: 0,
        grammarProgress: 0,
        readingProgress: 0,
        listeningProgress: 0,
        streakDays: 0,
        lastStudyDate: null
      }
    }

    const totalAccuracy = sessions.length > 0 
      ? sessions.reduce((sum, session) => sum + session.overallAccuracy, 0) / sessions.length
      : 0

    return {
      totalStudyTime: progress.totalStudyTime,
      sessionsCompleted: sessions.length,
      averageAccuracy: totalAccuracy,
      vocabularyProgress: (progress.vocabulary.masteredWords.size / 12000) * 100,
      grammarProgress: (progress.grammar.masteredCategories.size / 20) * 100,
      readingProgress: Math.min(progress.reading.averageWPM / 250 * 100, 100),
      listeningProgress: Math.max(100 - (progress.listening.averagePlayCount - 1) * 20, 0),
      streakDays: progress.vocabulary.streakDays,
      lastStudyDate: sessions.length > 0 ? new Date(sessions[0].date) : null
    }
  }

  // データのシリアライズ（Set, Map を配列に変換）
  private serializeProgress(progress: LearningProgress): any {
    return {
      ...progress,
      vocabulary: {
        ...progress.vocabulary,
        knownWords: Array.from(progress.vocabulary.knownWords),
        studiedWords: Array.from(progress.vocabulary.studiedWords),
        weakWords: Array.from(progress.vocabulary.weakWords),
        masteredWords: Array.from(progress.vocabulary.masteredWords),
        lastReviewDates: Array.from(progress.vocabulary.lastReviewDates.entries())
      },
      grammar: {
        ...progress.grammar,
        masteredCategories: Array.from(progress.grammar.masteredCategories),
        weakCategories: Array.from(progress.grammar.weakCategories),
        categoryScores: Array.from(progress.grammar.categoryScores.entries())
      },
      reading: {
        ...progress.reading,
        completedPassages: Array.from(progress.reading.completedPassages),
        difficultyProgress: Array.from(progress.reading.difficultyProgress.entries())
      },
      listening: {
        ...progress.listening,
        completedAudios: Array.from(progress.listening.completedAudios),
        accuracyByCategory: Array.from(progress.listening.accuracyByCategory.entries())
      }
    }
  }

  // データのデシリアライズ（配列を Set, Map に変換）
  private deserializeProgress(data: any): LearningProgress {
    return {
      ...data,
      vocabulary: {
        ...data.vocabulary,
        knownWords: new Set(data.vocabulary.knownWords),
        studiedWords: new Set(data.vocabulary.studiedWords),
        weakWords: new Set(data.vocabulary.weakWords),
        masteredWords: new Set(data.vocabulary.masteredWords),
        lastReviewDates: new Map(data.vocabulary.lastReviewDates)
      },
      grammar: {
        ...data.grammar,
        masteredCategories: new Set(data.grammar.masteredCategories),
        weakCategories: new Set(data.grammar.weakCategories),
        categoryScores: new Map(data.grammar.categoryScores)
      },
      reading: {
        ...data.reading,
        completedPassages: new Set(data.reading.completedPassages),
        difficultyProgress: new Map(data.reading.difficultyProgress)
      },
      listening: {
        ...data.listening,
        completedAudios: new Set(data.listening.completedAudios),
        accuracyByCategory: new Map(data.listening.accuracyByCategory)
      }
    }
  }

  // データベースのクリーンアップ
  async cleanup(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  // データのエクスポート（バックアップ用）
  async exportData(userId: string): Promise<string> {
    const progress = await this.getLearningProgress(userId)
    const sessions = await this.getSessionHistory(userId, 1000)
    const vocabularyData = await this.getVocabularyData(userId)

    const exportData = {
      progress,
      sessions,
      vocabularyData: Array.from(vocabularyData.entries()),
      exportDate: new Date(),
      version: this.dbVersion
    }

    return JSON.stringify(exportData, null, 2)
  }

  // データのインポート（復元用）
  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.progress) {
        await this.saveLearningProgress(data.progress)
      }
      
      if (data.sessions) {
        for (const session of data.sessions) {
          await this.saveSessionResults(session)
        }
      }
      
      if (data.vocabularyData) {
        for (const [wordId, vocabData] of data.vocabularyData) {
          await this.saveVocabularyData(wordId, data.progress?.userId || 'imported', vocabData)
        }
      }
    } catch (error) {
      throw new Error('Invalid import data format')
    }
  }
}

// グローバルインスタンス
export const learningStorage = new LearningStorageManager()

// ユーティリティ関数
export async function createInitialProgress(userId: string, toeicScore: number): Promise<LearningProgress> {
  const now = new Date()
  
  return {
    id: `progress_${userId}_${now.getTime()}`,
    userId,
    date: now.toISOString().split('T')[0],
    level: toeicScore < 500 ? 'basic' : toeicScore < 700 ? 'intermediate' : toeicScore < 850 ? 'advanced' : 'expert',
    toeicScore,
    sessionResults: [],
    totalStudyTime: 0,
    completedSections: [],
    vocabulary: {
      knownWords: new Set(),
      studiedWords: new Set(),
      weakWords: new Set(),
      masteredWords: new Set(),
      lastReviewDates: new Map(),
      streakDays: 0
    },
    grammar: {
      masteredCategories: new Set(),
      weakCategories: new Set(),
      categoryScores: new Map(),
      lastPracticeDate: now
    },
    reading: {
      averageWPM: 0,
      completedPassages: new Set(),
      difficultyProgress: new Map(),
      comprehensionScore: 0
    },
    listening: {
      completedAudios: new Set(),
      averagePlayCount: 0,
      accuracyByCategory: new Map(),
      listeningSpeed: 0
    },
    createdAt: now,
    updatedAt: now
  }
}
