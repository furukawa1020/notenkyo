'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { User, Mail, Calendar, Trophy, Target, TrendingUp, Settings, Plus, Edit } from 'lucide-react'
import { 
  UserProfile, 
  StudyGoal, 
  getUserProfile, 
  updateUserProfile, 
  addStudyGoal, 
  updateStudyGoal,
  calculateProfileStats,
  createUserProfile
} from '@/lib/profile-manager'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null)
  
  // フォーム状態
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    currentToeicScore: '',
    targetToeicScore: '',
    targetDate: '',
    level: 'intermediate' as 'basic' | 'intermediate' | 'advanced' | 'expert'
  })
  
  const [goalForm, setGoalForm] = useState({
    type: 'toeic-score' as const,
    title: '',
    description: '',
    targetValue: '',
    unit: '',
    deadline: ''
  })

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setIsLoading(true)
      
      // IndexedDBが利用可能かチェック
      if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
        console.error('IndexedDB is not available')
        setIsLoading(false)
        return
      }
      
      let userProfile = await getUserProfile()
      
      // プロフィールがない場合は初期作成
      if (!userProfile) {
        try {
          userProfile = await createUserProfile({
            name: 'のうてんきょユーザー',
            level: 'intermediate'
          })
        } catch (createError) {
          console.error('Failed to create profile:', createError)
          // フォールバックプロファイルを作成
          userProfile = {
            id: `profile_${Date.now()}`,
            name: 'のうてんきょユーザー',
            joinDate: new Date().toISOString().split('T')[0],
            studyGoals: [],
            preferences: {
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
            level: 'intermediate',
            achievements: [],
            totalStudyDays: 0,
            currentStreak: 0,
            totalPoints: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      }
      
      setProfile(userProfile)
      setProfileForm({
        name: userProfile.name,
        email: userProfile.email || '',
        currentToeicScore: userProfile.currentToeicScore?.toString() || '',
        targetToeicScore: userProfile.targetToeicScore?.toString() || '',
        targetDate: userProfile.targetDate || '',
        level: userProfile.level
      })
      
      try {
        // 統計データ取得
        const profileStats = await calculateProfileStats(userProfile.id)
        setStats(profileStats)
      } catch (statsError) {
        console.error('Failed to load stats:', statsError)
        // フォールバック統計
        setStats({
          totalStudyHours: 0,
          averageDailyStudy: 0,
          completedGoals: 0,
          longestStreak: 0,
          vocabularyLearned: 0,
          grammarPointsMastered: 0,
          readingPracticeCompleted: 0,
          listeningExercisesCompleted: 0
        })
      }
      
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!profile) return
    
    try {
      const updatedProfile = await updateUserProfile({
        id: profile.id,
        name: profileForm.name,
        email: profileForm.email || undefined,
        currentToeicScore: profileForm.currentToeicScore ? parseInt(profileForm.currentToeicScore) : undefined,
        targetToeicScore: profileForm.targetToeicScore ? parseInt(profileForm.targetToeicScore) : undefined,
        targetDate: profileForm.targetDate || undefined,
        level: profileForm.level
      })
      
      setProfile(updatedProfile)
      setShowEditProfile(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleAddGoal = async () => {
    if (!profile) return
    
    try {
      const newGoal = await addStudyGoal(profile.id, {
        type: goalForm.type,
        title: goalForm.title,
        description: goalForm.description,
        targetValue: parseInt(goalForm.targetValue),
        currentValue: 0,
        unit: goalForm.unit,
        deadline: goalForm.deadline || undefined,
        isCompleted: false
      })
      
      setProfile({
        ...profile,
        studyGoals: [...profile.studyGoals, newGoal]
      })
      
      setGoalForm({
        type: 'toeic-score',
        title: '',
        description: '',
        targetValue: '',
        unit: '',
        deadline: ''
      })
      setShowAddGoal(false)
    } catch (error) {
      console.error('Failed to add goal:', error)
    }
  }

  const handleUpdateGoal = async (goalId: string, progress: number) => {
    if (!profile) return
    
    try {
      const updatedGoal = await updateStudyGoal(goalId, {
        currentValue: progress
      })
      
      const updatedGoals = profile.studyGoals.map(goal => 
        goal.id === goalId ? updatedGoal : goal
      )
      
      setProfile({
        ...profile,
        studyGoals: updatedGoals
      })
    } catch (error) {
      console.error('Failed to update goal:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">プロフィールを読み込めませんでした</p>
      </div>
    )
  }

  const achievementData = [
    { label: "総学習時間", value: `${Math.floor(stats.totalStudyTime / 60)}時間`, icon: Calendar },
    { label: "平均スコア", value: `${stats.averageScore}%`, icon: Target },
    { label: "継続日数", value: `${stats.currentStreak}日`, icon: TrendingUp }
  ]

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">プロフィール</h1>
        <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>プロフィール編集</DialogTitle>
              <DialogDescription>
                あなたの学習情報を設定してください
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="email">メールアドレス（任意）</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="currentScore">現在のTOEICスコア</Label>
                <Input
                  id="currentScore"
                  type="number"
                  placeholder="例: 650"
                  value={profileForm.currentToeicScore}
                  onChange={(e) => setProfileForm({...profileForm, currentToeicScore: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="targetScore">目標TOEICスコア</Label>
                <Input
                  id="targetScore"
                  type="number"
                  placeholder="例: 800"
                  value={profileForm.targetToeicScore}
                  onChange={(e) => setProfileForm({...profileForm, targetToeicScore: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="targetDate">目標達成日</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={profileForm.targetDate}
                  onChange={(e) => setProfileForm({...profileForm, targetDate: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="level">現在のレベル</Label>
                <Select value={profileForm.level} onValueChange={(value: any) => setProfileForm({...profileForm, level: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">初級者</SelectItem>
                    <SelectItem value="intermediate">中級者</SelectItem>
                    <SelectItem value="advanced">上級者</SelectItem>
                    <SelectItem value="expert">エキスパート</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleUpdateProfile} className="flex-1">
                  保存
                </Button>
                <Button variant="outline" onClick={() => setShowEditProfile(false)} className="flex-1">
                  キャンセル
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* プロフィール情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{profile?.name || 'ユーザー'}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{profile?.email || 'メールアドレス未設定'}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile?.totalStudyDays || 0}</div>
              <div className="text-sm text-gray-500">総学習日数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile?.currentStreak || 0}</div>
              <div className="text-sm text-gray-500">継続日数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profile?.totalPoints || 0}</div>
              <div className="text-sm text-gray-500">総ポイント</div>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {profile?.level || 'basic'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 実績 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>実績</span>
          </CardTitle>
          <CardDescription>
            獲得した実績とバッジ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile?.achievements && profile.achievements.length > 0 ? (
              profile.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                まだ実績がありません。学習を続けて実績を獲得しましょう！
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 設定 */}
      <Card>
        <CardHeader>
          <CardTitle>設定</CardTitle>
          <CardDescription>
            アカウントと学習の設定
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">プッシュ通知</h4>
              <p className="text-sm text-gray-500">学習リマインダーを受け取る</p>
            </div>
            <Button variant="outline" size="sm">
              設定
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">データエクスポート</h4>
              <p className="text-sm text-gray-500">学習データをダウンロード</p>
            </div>
            <Button variant="outline" size="sm">
              エクスポート
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">アカウント削除</h4>
              <p className="text-sm text-gray-500">すべてのデータを削除</p>
            </div>
            <Button variant="destructive" size="sm">
              削除
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
