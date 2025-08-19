'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, TrendingUp, Brain, Heart, Target, Award, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getUserProfile } from '@/lib/profile-manager'

interface Notification {
  id: string
  type: 'achievement' | 'reminder' | 'insight' | 'warning' | 'encouragement'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generatePersonalizedNotifications()
  }, [])

  const generatePersonalizedNotifications = async () => {
    try {
      setIsLoading(true)
      const profile = await getUserProfile()
      
      const newNotifications: Notification[] = []
      const now = new Date()

      // プロフィールベースの通知生成
      if (profile) {
        // 連続学習日数の達成通知
        if (profile.currentStreak > 0) {
          const streakMilestone = getStreakMilestone(profile.currentStreak)
          if (streakMilestone) {
            newNotifications.push({
              id: `streak-${profile.currentStreak}`,
              type: 'achievement',
              title: streakMilestone.title,
              message: streakMilestone.message,
              timestamp: new Date(now.getTime() - Math.random() * 3600000).toISOString(),
              read: false,
              priority: 'high'
            })
          }
        }

        // 目標に基づく励まし通知
        if (profile.targetToeicScore) {
          const currentEstimate = Math.min(990, 400 + (profile.totalPoints * 0.1))
          const progressPercent = ((currentEstimate - 400) / (profile.targetToeicScore - 400)) * 100
          
          if (progressPercent >= 75) {
            newNotifications.push({
              id: `goal-progress-${Date.now()}`,
              type: 'encouragement',
              title: '目標まであと少し！',
              message: `目標スコア${profile.targetToeicScore}まで${Math.round(100 - progressPercent)}%です。頑張りましょう！`,
              timestamp: new Date(now.getTime() - Math.random() * 7200000).toISOString(),
              read: false,
              priority: 'medium',
              actionUrl: '/mock-test'
            })
          } else if (progressPercent >= 25) {
            newNotifications.push({
              id: `goal-progress-mid-${Date.now()}`,
              type: 'insight',
              title: '順調に進歩中',
              message: `目標に向けて${Math.round(progressPercent)}%達成しました。この調子で継続しましょう！`,
              timestamp: new Date(now.getTime() - Math.random() * 10800000).toISOString(),
              read: false,
              priority: 'low'
            })
          }
        }

        // 総学習時間ベースの通知
        if (profile.totalStudyDays >= 30) {
          newNotifications.push({
            id: `study-milestone-${profile.totalStudyDays}`,
            type: 'achievement',
            title: '学習継続の達人',
            message: `${profile.totalStudyDays}日間の学習を達成！継続は力なりです。`,
            timestamp: new Date(now.getTime() - Math.random() * 14400000).toISOString(),
            read: false,
            priority: 'medium'
          })
        }
      }

      // デモ通知（学習進捗ベース）
      const demoProgress = [
        { taskId: 'vocabulary-1', score: 85, timestamp: new Date(now.getTime() - 86400000).toISOString() },
        { taskId: 'grammar-1', score: 75, timestamp: new Date(now.getTime() - 172800000).toISOString() },
        { taskId: 'vocabulary-2', score: 90, timestamp: new Date(now.getTime() - 259200000).toISOString() }
      ]

      if (demoProgress.length > 0) {
        const averageScore = demoProgress.reduce((sum, p) => sum + p.score, 0) / demoProgress.length
        
        if (averageScore >= 80) {
          newNotifications.push({
            id: `performance-excellent-${Date.now()}`,
            type: 'achievement',
            title: '優秀な成績を維持中！',
            message: `直近の学習で平均${Math.round(averageScore)}%の成績です。素晴らしいです！`,
            timestamp: new Date(now.getTime() - Math.random() * 3600000).toISOString(),
            read: false,
            priority: 'high'
          })
        }
      }

      // 時間帯ベースの通知
      const hour = now.getHours()
      if (hour >= 8 && hour <= 10) {
        newNotifications.push({
          id: `time-optimal-${Date.now()}`,
          type: 'insight',
          title: '朝の学習時間',
          message: '朝の時間帯は集中力が高く、新しい知識の習得に最適です',
          timestamp: new Date(now.getTime() - Math.random() * 1800000).toISOString(),
          read: false,
          priority: 'low'
        })
      } else if (hour >= 19 && hour <= 21) {
        newNotifications.push({
          id: `time-review-${Date.now()}`,
          type: 'reminder',
          title: '復習の時間',
          message: '夜の時間帯は復習に最適です。今日学んだ内容を振り返りましょう',
          timestamp: new Date(now.getTime() - Math.random() * 1800000).toISOString(),
          read: false,
          priority: 'low',
          actionUrl: '/study/review'
        })
      }

      // 通知をタイムスタンプでソート
      const sortedNotifications = newNotifications.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      setNotifications(sortedNotifications)
      setUnreadCount(sortedNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Failed to generate notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStreakMilestone = (streak: number) => {
    const milestones = [
      { days: 7, title: '1週間継続達成！', message: '学習習慣の第一歩を踏み出しました。この調子で続けましょう！' },
      { days: 14, title: '2週間継続達成！', message: '習慣化への道のりを順調に歩んでいます。素晴らしいです！' },
      { days: 30, title: '1ヶ月継続達成！', message: '学習が完全に習慣化されました。この継続力は必ず結果につながります！' },
      { days: 50, title: '50日継続達成！', message: '驚異的な継続力です。あなたの努力は本当に素晴らしいです！' },
      { days: 100, title: '100日継続達成！', message: '学習の達人への道を歩んでいます。この継続力で夢を叶えましょう！' }
    ]

    return milestones.find(m => m.days === streak)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="h-5 w-5 text-yellow-600" />
      case 'reminder': return <Bell className="h-5 w-5 text-blue-600" />
      case 'insight': return <Brain className="h-5 w-5 text-purple-600" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'encouragement': return <Heart className="h-5 w-5 text-pink-600" />
      default: return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 border-yellow-300'
      case 'reminder': return 'bg-blue-100 border-blue-300'
      case 'insight': return 'bg-purple-100 border-purple-300'
      case 'warning': return 'bg-red-100 border-red-300'
      case 'encouragement': return 'bg-pink-100 border-pink-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">重要</Badge>
      case 'medium': return <Badge variant="secondary">中</Badge>
      case 'low': return <Badge variant="outline">低</Badge>
      default: return null
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'たった今'
    if (diffMins < 60) return `${diffMins}分前`
    if (diffHours < 24) return `${diffHours}時間前`
    if (diffDays < 7) return `${diffDays}日前`
    return date.toLocaleDateString('ja-JP')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto max-w-4xl pt-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">通知センター</h1>
            <p className="text-gray-600">通知を読み込んでいます...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl pt-8 space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="h-8 w-8 mr-3" />
              通知センター
            </h1>
            <p className="text-gray-600 mt-2">
              {unreadCount > 0 ? `${unreadCount}件の未読通知があります` : 'すべての通知を確認済みです'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              すべて既読にする
            </Button>
          )}
        </div>

        {/* 通知一覧 */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">通知はありません</h3>
              <p className="text-gray-500">学習を続けると、パーソナライズされた通知が表示されます。</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all ${getTypeColor(notification.type)} ${
                  !notification.read ? 'shadow-md' : 'opacity-75'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(notification.priority)}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <div className="flex items-center space-x-2">
                          {notification.actionUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={notification.actionUrl}>詳細を見る</a>
                            </Button>
                          )}
                          {!notification.read && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
