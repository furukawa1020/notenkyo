import { UserState, Task, Session, SRSItem, KPI } from './types'
import { MASSIVE_VOCABULARY_DATABASE } from './massive-vocabulary-database'
import { MASSIVE_GRAMMAR_DATABASE } from './massive-grammar-database'
import { COMPREHENSIVE_LISTENING, COMPREHENSIVE_READING } from './massive-content-database'

const DB_NAME = 'noutenkyo_db'
const DB_VERSION = 1

interface NoutenkyoDB extends IDBDatabase {
  objectStoreNames: DOMStringList
}

// IndexedDB初期化
export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      // ユーザー状態ストア
      if (!db.objectStoreNames.contains('userStates')) {
        const userStore = db.createObjectStore('userStates', { keyPath: 'date' })
        userStore.createIndex('date', 'date', { unique: true })
      }
      
      // タスクストア
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' })
        taskStore.createIndex('date', 'date', { unique: false })
        taskStore.createIndex('part', 'part', { unique: false })
      }
      
      // セッションストア
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true })
        sessionStore.createIndex('taskId', 'taskId', { unique: false })
        sessionStore.createIndex('date', 'date', { unique: false })
      }
      
      // SRSアイテムストア
      if (!db.objectStoreNames.contains('srsItems')) {
        const srsStore = db.createObjectStore('srsItems', { keyPath: 'itemId' })
        srsStore.createIndex('nextReview', 'nextReview', { unique: false })
      }
      
      // KPIストア
      if (!db.objectStoreNames.contains('kpis')) {
        const kpiStore = db.createObjectStore('kpis', { keyPath: 'date' })
        kpiStore.createIndex('date', 'date', { unique: true })
      }
      
      // 通知ストア
      if (!db.objectStoreNames.contains('notifications')) {
        const notificationStore = db.createObjectStore('notifications', { keyPath: 'id' })
        notificationStore.createIndex('timestamp', 'timestamp', { unique: false })
        notificationStore.createIndex('read', 'read', { unique: false })
      }
    }
  })
}

// ユーザー状態の保存・取得
export async function saveUserState(userState: UserState): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction(['userStates'], 'readwrite')
  const store = transaction.objectStore('userStates')
  
  await new Promise((resolve, reject) => {
    const request = store.put(userState)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getUserState(date?: string): Promise<UserState | null> {
  const db = await initDB()
  const transaction = db.transaction(['userStates'], 'readonly')
  const store = transaction.objectStore('userStates')
  
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  return new Promise((resolve, reject) => {
    const request = store.get(targetDate)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

// タスクの保存・取得
export async function saveTasks(tasks: Task[], date?: string): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction(['tasks'], 'readwrite')
  const store = transaction.objectStore('tasks')
  
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  for (const task of tasks) {
    const taskWithDate = { ...task, date: targetDate }
    await new Promise((resolve, reject) => {
      const request = store.put(taskWithDate)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export async function getTodayTasks(): Promise<Task[]> {
  const db = await initDB()
  const transaction = db.transaction(['tasks'], 'readonly')
  const store = transaction.objectStore('tasks')
  const index = store.index('date')
  
  const today = new Date().toISOString().split('T')[0]
  
  return new Promise((resolve, reject) => {
    const request = index.getAll(today)
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction(['tasks'], 'readwrite')
  const store = transaction.objectStore('tasks')
  
  return new Promise((resolve, reject) => {
    const getRequest = store.get(taskId)
    getRequest.onsuccess = () => {
      const task = getRequest.result
      if (task) {
        const updatedTask = { ...task, ...updates }
        const putRequest = store.put(updatedTask)
        putRequest.onsuccess = () => resolve()
        putRequest.onerror = () => reject(putRequest.error)
      } else {
        reject(new Error('Task not found'))
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}

// セッションの保存・取得
export async function saveSession(session: Session): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction(['sessions'], 'readwrite')
  const store = transaction.objectStore('sessions')
  
  const sessionWithDate = { 
    ...session, 
    date: new Date().toISOString().split('T')[0] 
  }
  
  await new Promise((resolve, reject) => {
    const request = store.add(sessionWithDate)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// SRSアイテムの保存・取得
export async function saveSRSItem(item: SRSItem): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction(['srsItems'], 'readwrite')
  const store = transaction.objectStore('srsItems')
  
  await new Promise((resolve, reject) => {
    const request = store.put(item)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getDueReviews(): Promise<SRSItem[]> {
  const db = await initDB()
  const transaction = db.transaction(['srsItems'], 'readonly')
  const store = transaction.objectStore('srsItems')
  const index = store.index('nextReview')
  
  const now = new Date()
  
  return new Promise((resolve, reject) => {
    const request = index.getAll(IDBKeyRange.upperBound(now))
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

// KPIの保存・取得
export async function saveKPI(kpi: KPI): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction(['kpis'], 'readwrite')
  const store = transaction.objectStore('kpis')
  
  await new Promise((resolve, reject) => {
    const request = store.put(kpi)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getKPIHistory(days: number = 30): Promise<KPI[]> {
  const db = await initDB()
  const transaction = db.transaction(['kpis'], 'readonly')
  const store = transaction.objectStore('kpis')
  
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => {
      const allKPIs = request.result || []
      const recent = allKPIs
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, days)
      resolve(recent)
    }
    request.onerror = () => reject(request.error)
  })
}

// 模擬天気データ（体調・気分ベース）
export async function getCurrentWeather(): Promise<{ weather: 'sunny' | 'cloudy' | 'rainy', temperature: number }> {
  // 体調と時間帯に基づく天気シミュレーション
  const hour = new Date().getHours()
  const random = Math.random()
  
  let weather: 'sunny' | 'cloudy' | 'rainy'
  
  // 時間帯による天気傾向
  if (hour >= 6 && hour < 18) {
    // 日中（学習に適した明るい時間）
    if (random < 0.6) weather = 'sunny'
    else if (random < 0.8) weather = 'cloudy'
    else weather = 'rainy'
  } else {
    // 夜間（落ち着いた時間）
    if (random < 0.4) weather = 'sunny'
    else if (random < 0.7) weather = 'cloudy'
    else weather = 'rainy'
  }
  
  // 8月の気温設定
  const baseTemp = 28
  const variation = Math.random() * 10 - 5
  const temperature = Math.round(baseTemp + variation)
  
  return { weather, temperature }
}

// 学習進捗の保存・取得
export async function saveStudyProgress(progress: {
  vocabularyLevel: number
  grammarLevel: number
  listeningLevel: number
  readingLevel: number
  totalStudyTime: number
  streakDays: number
}): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction(['srsItems'], 'readwrite')
  const store = transaction.objectStore('srsItems')
  
  await new Promise((resolve, reject) => {
    const request = store.put({ ...progress, itemId: 'study_progress' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getStudyProgress(): Promise<{
  vocabularyLevel: number
  grammarLevel: number
  listeningLevel: number
  readingLevel: number
  totalStudyTime: number
  streakDays: number
}> {
  const db = await initDB()
  const transaction = db.transaction(['srsItems'], 'readonly')
  const store = transaction.objectStore('srsItems')
  
  return new Promise((resolve, reject) => {
    const request = store.get('study_progress')
    request.onsuccess = () => {
      const result = request.result
      if (result) {
        resolve(result)
      } else {
        // デフォルト値
        resolve({
          vocabularyLevel: 0,
          grammarLevel: 0,
          listeningLevel: 0,
          readingLevel: 0,
          totalStudyTime: 0,
          streakDays: 0
        })
      }
    }
    request.onerror = () => reject(request.error)
  })
}

// セッション記録
export async function recordSession(session: {
  taskId: string
  startTime: Date
  endTime: Date
  score?: number
  correctAnswers?: number
  totalQuestions?: number
  studyType: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'recovery'
}): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction(['sessions'], 'readwrite')
  const store = transaction.objectStore('sessions')
  
  await new Promise((resolve, reject) => {
    const request = store.add({
      ...session,
      date: new Date().toISOString().split('T')[0]
    })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// データクリア（プライバシー配慮）
export async function clearAllData(): Promise<void> {
  const db = await initDB()
  const storeNames = ['userStates', 'tasks', 'sessions', 'srsItems', 'kpis']
  
  for (const storeName of storeNames) {
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    await new Promise<void>((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

// 研究用データエクスポート（匿名化）
export async function exportAnonymizedData(): Promise<string> {
  const db = await initDB()
  const data: any = {}
  
  // セッションデータ（学習効果分析用）
  const sessionTransaction = db.transaction(['sessions'], 'readonly')
  const sessionStore = sessionTransaction.objectStore('sessions')
  
  const sessions = await new Promise<any[]>((resolve, reject) => {
    const request = sessionStore.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
  
  // KPIデータ（匿名化）
  const kpiTransaction = db.transaction(['kpis'], 'readonly')
  const kpiStore = kpiTransaction.objectStore('kpis')
  
  const kpis = await new Promise<any[]>((resolve, reject) => {
    const request = kpiStore.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
  
  // 匿名化処理
  data.sessions = sessions.map(session => ({
    studyType: session.studyType,
    duration: session.endTime - session.startTime,
    score: session.score,
    correctAnswers: session.correctAnswers,
    totalQuestions: session.totalQuestions,
    date: session.date
  }))
  
  data.kpis = kpis.map(kpi => ({
    noutenkyoScore: kpi.noutenkyoScore,
    tasksCompleted: kpi.tasksCompleted,
    studyTime: kpi.studyTime,
    accuracy: kpi.accuracy,
    date: kpi.date
  }))
  
  return JSON.stringify(data, null, 2)
}

// 不足している関数群を追加
export async function getAllStudySessions(): Promise<any[]> {
  const db = await initDB()
  const transaction = db.transaction('sessions', 'readonly')
  const store = transaction.objectStore('sessions')
  
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export async function getAllUserStates(): Promise<any[]> {
  const db = await initDB()
  const transaction = db.transaction('userStates', 'readonly')
  const store = transaction.objectStore('userStates')
  
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export async function calculateKPIs(): Promise<any> {
  const sessions = await getAllStudySessions()
  const userStates = await getAllUserStates()
  
  if (sessions.length === 0) {
    return {
      totalStudyMinutes: 0,
      averageScore: 0,
      consistencyDays: 0,
      sessionsCompleted: 0
    }
  }
  
  const totalMinutes = sessions.reduce((sum: number, session: any) => 
    sum + (session.duration || 0), 0)
  
  const totalScore = sessions.reduce((sum: number, session: any) => 
    sum + (session.score || 0), 0)
  
  const averageScore = Math.round(totalScore / sessions.length)
  
  // 継続日数計算（簡単な実装）
  const uniqueDates = new Set(sessions.map((s: any) => s.date))
  const consistencyDays = uniqueDates.size
  
  return {
    totalStudyMinutes: totalMinutes,
    averageScore: averageScore,
    consistencyDays: consistencyDays,
    sessionsCompleted: sessions.length
  }
}

export async function exportResearchData(): Promise<any> {
  return exportAnonymizedData()
}

// 通知機能
export async function saveNotification(notification: any): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction('notifications', 'readwrite')
  const store = transaction.objectStore('notifications')
  await store.add(notification)
}

export async function getAllNotifications(): Promise<any[]> {
  const db = await initDB()
  const transaction = db.transaction('notifications', 'readonly')
  const store = transaction.objectStore('notifications')
  const index = store.index('timestamp')
  
  return new Promise((resolve, reject) => {
    const request = index.openCursor(null, 'prev') // 新しい順
    const notifications: any[] = []
    
    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        notifications.push(cursor.value)
        cursor.continue()
      } else {
        resolve(notifications)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const db = await initDB()
  const transaction = db.transaction('notifications', 'readwrite')
  const store = transaction.objectStore('notifications')
  
  return new Promise((resolve, reject) => {
    const getRequest = store.get(id)
    getRequest.onsuccess = () => {
      const notification = getRequest.result
      if (notification) {
        notification.read = true
        const putRequest = store.put(notification)
        putRequest.onsuccess = () => resolve()
        putRequest.onerror = () => reject(putRequest.error)
      } else {
        resolve()
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}
