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
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
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
  const db = await getDB()
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

  await db.put('profiles', profile)
  return profile
}

// ユーザープロフィール取得
export async function getUserProfile(id?: string): Promise<UserProfile | null> {
  const db = await getDB()
  
  if (id) {
    return await db.get('profiles', id) || null
  }
  
  // IDが指定されていない場合は最初のプロフィールを返す
  const profiles = await db.getAll('profiles')
  return profiles[0] || null
}

// ユーザープロフィール更新
export async function updateUserProfile(profileData: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
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
  // storage.tsから学習セッションを取得
  const { getAllStudySessions, getAllUserStates } = await import('./storage')
  
  const sessions = await getAllStudySessions()
  const states = await getAllUserStates()
  
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

  return {
    totalSessions,
    totalStudyTime,
    averageScore: Math.round(averageScore),
    currentStreak: streak,
    totalStudyDays: uniqueDates.length,
    averageSessionTime: totalSessions > 0 ? Math.round(totalStudyTime / totalSessions) : 0
  }
}
