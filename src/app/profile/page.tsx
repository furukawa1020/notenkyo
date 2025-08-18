'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Trophy, Target, TrendingUp } from 'lucide-react'

export default function ProfilePage() {
  // モックデータ
  const userProfile = {
    name: "学習者",
    email: "learner@example.com",
    joinDate: "2024年1月",
    totalStudyDays: 45,
    currentStreak: 7,
    totalPoints: 2850,
    level: "中級者",
    achievements: [
      { name: "継続学習7日", icon: "🔥", description: "7日連続で学習を完了" },
      { name: "のうてんきょマスター", icon: "🧠", description: "体調管理を活用した学習" },
      { name: "単語マスター", icon: "📚", description: "1000語を習得" }
    ]
  }

  const stats = [
    { label: "総学習時間", value: "128時間", icon: Calendar },
    { label: "平均スコア", value: "75%", icon: Target },
    { label: "継続日数", value: `${userProfile.currentStreak}日`, icon: TrendingUp }
  ]

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">プロフィール</h1>
      </div>

      {/* プロフィール情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{userProfile.name}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{userProfile.email}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProfile.totalStudyDays}</div>
              <div className="text-sm text-gray-500">総学習日数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProfile.currentStreak}</div>
              <div className="text-sm text-gray-500">継続日数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userProfile.totalPoints}</div>
              <div className="text-sm text-gray-500">総ポイント</div>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {userProfile.level}
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
            {userProfile.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
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
