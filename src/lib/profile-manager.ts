// ユーザープロフィール管理システム
// 目標設定、現在スコア、学習履歴管理

import { openDB, IDBPDatabase } from 'idb'

export interface UserProfile {
  id: string
  name: string
  email?: string
  joinDate: string
  currentToeicScore?: number
  targetToeicScore?: number
  targetDate?: string
  studyGoals: StudyGoal[]
  preferences: UserPreferences
  level: 'basic' | 'intermediate' | 'advanced' | 'exp      // エラー時のフォールバック統計
    return {
      totalSessions: 0,
      totalStudyTime: 0,
      averageScore: 0,
      streak: 0,
      vocabularyLearned: 0,
      grammarMastered: 0,
      readingCompleted: 0,
      listeningCompleted: 0,
      lastUpdated: new Date().toISOString()
    }
  }
}
  achievements: Achievement[]
  totalStudyDays: number
  currentStreak: number
  totalPoints: number
  createdAt: string
  updatedAt: string
}

export interface StudyGoal {
  id: string
  type: 'toeic-score' | 'daily-study' | 'weekly-study' | 'vocabulary' | 'custom'
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline?: string
  isCompleted: boolean
  createdAt: string
}

export interface UserPreferences {
  maxDailyStudyTime: number // 分
  preferredStudyTimes: string[] // ['morning', 'afternoon', 'evening']
  focusAreas: string[] // ['vocabulary', 'grammar', 'listening', 'reading']
  adhdSupport: boolean
  weatherIntegration: boolean
  notifications: {
    studyReminders: boolean
    achievements: boolean
    weeklyReports: boolean
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  progress?: number
  target?: number
}

const DB_NAME = 'noutenkyo-profile'
const DB_VERSION = 1

let db: IDBPDatabase | null = null

async function getDB(): Promise<IDBPDatabase> {
  if (db) return db

  // ブラウザ環境かチェック
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available in this environment')
  }

  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // ユーザープロフィールストア
      if (!db.objectStoreNames.contains('profiles')) {
        const profileStore = db.createObjectStore('profiles', { keyPath: 'id' })
        profileStore.createIndex('email', 'email', { unique: true })
      }

      // 学習目標ストア
      if (!db.objectStoreNames.contains('goals')) {
        const goalStore = db.createObjectStore('goals', { keyPath: 'id' })
        goalStore.createIndex('profileId', 'profileId')
        goalStore.createIndex('type', 'type')
      }

      // 達成項目ストア
      if (!db.objectStoreNames.contains('achievements')) {
        const achievementStore = db.createObjectStore('achievements', { keyPath: 'id' })
        achievementStore.createIndex('profileId', 'profileId')
      }
    }
  })

  return db
}

// ユーザープロフィール作成
export async function createUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  const now = new Date().toISOString()
  
  const profile: UserProfile = {
    id: profileData.id || `profile_${Date.now()}`,
    name: profileData.name || 'のうてんきょユーザー',
    email: profileData.email,
    joinDate: now.split('T')[0],
    currentToeicScore: profileData.currentToeicScore,
    targetToeicScore: profileData.targetToeicScore,
    targetDate: profileData.targetDate,
    studyGoals: profileData.studyGoals || [],
    preferences: profileData.preferences || {
      maxDailyStudyTime: 60,
      preferredStudyTimes: ['evening'],
      focusAreas: ['vocabulary', 'grammar'],
      adhdSupport: false,
      weatherIntegration: false,
      notifications: {
        studyReminders: true,
        achievements: true,
        weeklyReports: true
      }
    },
    level: profileData.level || 'intermediate',
    achievements: profileData.achievements || [],
    totalStudyDays: profileData.totalStudyDays || 0,
    currentStreak: profileData.currentStreak || 0,
    totalPoints: profileData.totalPoints || 0,
    createdAt: now,
    updatedAt: now
  }

  try {
    const db = await getDB()
    await db.put('profiles', profile)
    
    // バックアップとしてローカルストレージにも保存
    try {
      localStorage.setItem('noutenkyo-profile', JSON.stringify(profile))
    } catch (localStorageError) {
      console.warn('Failed to backup profile to localStorage:', localStorageError)
    }
  } catch (error) {
    console.error('Error creating user profile in IndexedDB:', error)
    
    // フォールバック: ローカルストレージに直接保存
    try {
      localStorage.setItem('noutenkyo-profile', JSON.stringify(profile))
    } catch (localStorageError) {
      console.error('Error creating user profile in localStorage:', localStorageError)
      throw error // 元のエラーを再スロー
    }
  }
  
  return profile
}

// ユーザープロフィール取得
export async function getUserProfile(id?: string): Promise<UserProfile | null> {
  try {
    const db = await getDB()
    
    if (id) {
      return await db.get('profiles', id) || null
    }
    
    // IDが指定されていない場合は最初のプロフィールを返す
    const profiles = await db.getAll('profiles')
    return profiles[0] || null
  } catch (error) {
    console.error('Error getting user profile from IndexedDB:', error)
    
    // フォールバック: ローカルストレージから取得
    try {
      const profileJson = localStorage.getItem('noutenkyo-profile')
      if (profileJson) {
        return JSON.parse(profileJson)
      }
    } catch (localStorageError) {
      console.error('Error getting user profile from localStorage:', localStorageError)
    }
    
    return null
  }
}

// ユーザープロフィール更新
export async function updateUserProfile(profileData: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
  try {
    const db = await getDB()
    const existing = await db.get('profiles', profileData.id)
    
    if (!existing) {
      throw new Error('Profile not found')
    }

    const updated: UserProfile = {
      ...existing,
      ...profileData,
      updatedAt: new Date().toISOString()
    }
    
    await db.put('profiles', updated)
    
    // バックアップとしてローカルストレージにも保存
    try {
      localStorage.setItem('noutenkyo-profile', JSON.stringify(updated))
    } catch (localStorageError) {
      console.warn('Failed to backup profile to localStorage:', localStorageError)
    }
    
    return updated
  } catch (error) {
    console.error('Error updating user profile in IndexedDB:', error)
    
    // フォールバック: ローカルストレージに直接保存
    try {
      const profileJson = localStorage.getItem('noutenkyo-profile')
      let existing = profileJson ? JSON.parse(profileJson) : null
      
      if (!existing) {
        throw new Error('Profile not found in localStorage')
      }
      
      const updated: UserProfile = {
        ...existing,
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem('noutenkyo-profile', JSON.stringify(updated))
      return updated
    } catch (localStorageError) {
      console.error('Error updating user profile in localStorage:', localStorageError)
      throw error // 元のエラーを再スロー
    }
  }
  
  await db.put('profiles', updated)
  return updated
}

// 学習目標追加
export async function addStudyGoal(profileId: string, goalData: Omit<StudyGoal, 'id' | 'createdAt'>): Promise<StudyGoal> {
  const db = await getDB()
  
  const goal: StudyGoal = {
    ...goalData,
    id: `goal_${Date.now()}`,
    createdAt: new Date().toISOString()
  }

  await db.put('goals', { ...goal, profileId })
  
  // プロフィールの目標リストも更新
  const profile = await getUserProfile(profileId)
  if (profile) {
    profile.studyGoals.push(goal)
    await updateUserProfile(profile)
  }

  return goal
}

// 学習目標更新
export async function updateStudyGoal(goalId: string, updates: Partial<StudyGoal>): Promise<StudyGoal> {
  const db = await getDB()
  const existing = await db.get('goals', goalId)
  
  if (!existing) {
    throw new Error('Goal not found')
  }

  const updated = { ...existing, ...updates }
  await db.put('goals', updated)
  return updated
}

// 学習目標取得
export async function getStudyGoals(profileId: string): Promise<StudyGoal[]> {
  const db = await getDB()
  const goals = await db.getAllFromIndex('goals', 'profileId', profileId)
  return goals.map(goal => {
    const { profileId, ...goalData } = goal
    return goalData as StudyGoal
  })
}

// 達成項目追加
export async function unlockAchievement(profileId: string, achievementId: string): Promise<void> {
  const profile = await getUserProfile(profileId)
  if (!profile) return

  const achievement = profile.achievements.find(a => a.id === achievementId)
  if (achievement && !achievement.unlockedAt) {
    achievement.unlockedAt = new Date().toISOString()
    await updateUserProfile(profile)
  }
}

// 目標進捗更新
export async function updateGoalProgress(goalId: string, currentValue: number): Promise<void> {
  const goal = await updateStudyGoal(goalId, { 
    currentValue,
    isCompleted: currentValue >= (await getGoalById(goalId))?.targetValue || false
  })

  // 目標達成時の処理
  if (goal.isCompleted) {
    // 達成項目をアンロック
    // TODO: 適切な達成項目ロジックを実装
  }
}

async function getGoalById(goalId: string): Promise<StudyGoal | null> {
  const db = await getDB()
  const goalData = await db.get('goals', goalId)
  if (!goalData) return null
  
  const { profileId, ...goal } = goalData
  return goal as StudyGoal
}

// 統計計算
export async function calculateProfileStats(profileId: string) {
  try {
    // storage.tsから学習セッションを取得
    const { getAllStudySessions, getAllUserStates } = await import('./storage')
    
    let sessions = []
    let states = []
    
    try {
      sessions = await getAllStudySessions()
      states = await getAllUserStates()
    } catch (error) {
      console.warn('Failed to load sessions or states:', error)
      // 空の配列で続行
    }
    
    const totalSessions = sessions.length
    const totalStudyTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0)
    const averageScore = sessions.length > 0 
      ? sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length 
      : 0
    
    // 継続日数計算
    const uniqueDates = [...new Set(sessions.map(s => s.timestamp.split('T')[0]))]
    const sortedDates = uniqueDates.sort()
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
  
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const date = sortedDates[i]
      const daysDiff = Math.floor((new Date(today).getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else {
        break
      }
    }

    // 様々な学習データ集計
    const vocabularyLearned = states.filter(s => s.type === 'vocabulary' && s.completed).length
    const grammarMastered = states.filter(s => s.type === 'grammar' && s.completed).length
    const readingCompleted = states.filter(s => s.type === 'reading' && s.completed).length
    const listeningCompleted = states.filter(s => s.type === 'listening' && s.completed).length

    return {
      totalSessions,
      totalStudyTime,
      averageScore: Math.round(averageScore),
      streak,
      vocabularyLearned,
      grammarMastered,
      readingCompleted,
      listeningCompleted,
      // クライアント側の計算で有用な値を追加
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error calculating profile stats:', error)
    
    // エラー時のフォールバック統計
    return {
      totalSessions: 0,
      totalStudyTime: 0,
      averageScore: 0,
      streak: 0,
      vocabularyLearned: 0,
      grammarMastered: 0,
      readingCompleted: 0,
      listeningCompleted: 0,
      lastUpdated: new Date().toISOString()
    }
  }
}
