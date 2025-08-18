'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Bell, TrendingUp, Brain, Heart, Target, Award, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getUserState, getAllStudySessions, saveNotification } from '@/lib/storage'
import { calculateAdvancedNoutenkyoScore, AdaptiveLearningSystem } from '@/lib/advanced-noutenkyo-engine'

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
  const [adaptiveSystem] = useState(new AdaptiveLearningSystem())

  useEffect(() => {
    loadNotifications()
    generateIntelligentNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      // 実際の実装では storage から通知を読み込み
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'achievement',
          title: '7日間継続達成！',
          message: '学習を7日間継続されました。素晴らしい習慣作りです！',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high'
        },
        {
          id: '2',
          type: 'insight',
          title: '最適学習時間を発見',
          message: 'あなたの学習効果が最も高いのは午前9-11時です',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          priority: 'medium'
        },
        {
          id: '3',
          type: 'reminder',
          title: '体調チェックインの時間',
          message: '今日の体調をチェックして最適な学習プランを生成しましょう',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
          priority: 'medium'
        }
      ]
      
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateIntelligentNotifications = async () => {
    try {
      const userState = await getUserState()
      const sessions = await getAllStudySessions()
      
      if (!userState || sessions.length === 0) return

      const newNotifications: Notification[] = []
      
      // 体調スコア分析
      const currentScore = calculateAdvancedNoutenkyoScore(userState)
      
      if (currentScore < 40) {
        newNotifications.push({
          id: `warning-${Date.now()}`,
          type: 'warning',
          title: '体調が低めです',
          message: '今日は無理をせず、軽めの学習や回復モードをおすすめします',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high',
          actionUrl: '/study/recovery'
        })
      } else if (currentScore >= 80) {
        newNotifications.push({
          id: `encouragement-${Date.now()}`,
          type: 'encouragement',
          title: '絶好調です！',
          message: '今日はチャレンジングな学習に最適な状態です。模擬試験に挑戦してみませんか？',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          actionUrl: '/mock-test'
        })
      }

      // 学習パターン分析
      const recentSessions = sessions.slice(-7) // 直近7セッション
      if (recentSessions.length >= 3) {
        const averageScore = recentSessions.reduce((sum, s) => sum + (s.score || 0), 0) / recentSessions.length
        
        if (averageScore >= 85) {
          newNotifications.push({
            id: `achievement-${Date.now()}`,
            type: 'achievement',
            title: '高成績を維持中！',
            message: `直近の学習で平均${Math.round(averageScore)}%の成績を達成しています`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium'
          })
        }
      }

      // 学習時間の提案
      const hour = new Date().getHours()
      if (hour >= 9 && hour <= 11) {
        newNotifications.push({
          id: `insight-${Date.now()}`,
          type: 'insight',
          title: '最適学習時間帯です',
          message: '統計によると、この時間帯はあなたの学習効果が最も高くなります',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'low'
        })
      }

      // 新しい通知を保存
      for (const notification of newNotifications) {
        await saveNotification(notification)
      }

      setNotifications(prev => [...newNotifications, ...prev])
      setUnreadCount(prev => prev + newNotifications.length)
    } catch (error) {
      console.error('Failed to generate notifications:', error)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return <Award className="h-5 w-5 text-yellow-500" />
      case 'insight': return <TrendingUp className="h-5 w-5 text-blue-500" />
      case 'reminder': return <Bell className="h-5 w-5 text-purple-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'encouragement': return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">通知センター</h1>
          <p className="text-gray-600 mt-1">学習に関する重要な情報とインサイト</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {unreadCount} 未読
          </Badge>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              すべて既読にする
            </Button>
          )}
        </div>
      </div>

      {/* インテリジェント インサイト */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>AIインサイト</span>
          </CardTitle>
          <CardDescription>あなたの学習データから生成された個人化された洞察</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-medium">学習傾向</span>
              </div>
              <p className="text-sm text-gray-600">午前中の学習効果が平均15%高いです</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="h-4 w-4 text-red-600" />
                <span className="font-medium">体調相関</span>
              </div>
              <p className="text-sm text-gray-600">睡眠7-8時間で最高パフォーマンス</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium">成長予測</span>
              </div>
              <p className="text-sm text-gray-600">このペースで月末には15%スコア向上</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 通知リスト */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">最近の通知</h2>
        
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">新しい通知はありません</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                !notification.read ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">
                        {new Date(notification.timestamp).toLocaleString('ja-JP')}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {notification.actionUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(notification.actionUrl, '_blank')}
                          >
                            詳細を見る
                          </Button>
                        )}
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            既読にする
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 学習統計サマリー */}
      <Card>
        <CardHeader>
          <CardTitle>今週の学習活動</CardTitle>
          <CardDescription>あなたの学習パフォーマンスの概要</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-sm text-gray-600">セッション完了</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-sm text-gray-600">平均スコア</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">180</div>
              <p className="text-sm text-gray-600">学習分数</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">7</div>
              <p className="text-sm text-gray-600">継続日数</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
