'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Target, Clock, Award, Brain, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { KPI, StudyProgress } from '@/lib/types'
import { getKPIHistory } from '@/lib/storage'

export default function StatsPage() {
  const [kpiData, setKpiData] = useState<KPI[]>([])
  const [studyProgress, setStudyProgress] = useState<StudyProgress>({
    vocabularyLevel: 65,
    grammarLevel: 72,
    listeningLevel: 58,
    readingLevel: 61,
    totalStudyTime: 89.5,
    streakDays: 7
  })

  useEffect(() => {
    loadKPIData()
  }, [])

  const loadKPIData = async () => {
    try {
      const data = await getKPIHistory(30)
      setKpiData(data)
    } catch (error) {
      console.error('Failed to load KPI data:', error)
    }
  }

  const getCurrentTOEICEstimate = () => {
    const { vocabularyLevel, grammarLevel, listeningLevel, readingLevel } = studyProgress
    const average = (vocabularyLevel + grammarLevel + listeningLevel + readingLevel) / 4
    return Math.round(300 + (average / 100) * 600) // 300-900点スケール
  }

  const achievements = [
    { id: 1, title: '7日連続学習', description: '継続は力なり！', icon: '🔥', earned: true },
    { id: 2, title: '単語マスター', description: '100個の単語を習得', icon: '📚', earned: true },
    { id: 3, title: 'のうきょマスター', description: 'スコア90達成', icon: '🌟', earned: false },
    { id: 4, title: '早起き学習', description: '朝6時前に学習開始', icon: '🌅', earned: true },
  ]

  const todayStats = {
    noutenkyoScore: 78,
    tasksCompleted: 3,
    studyTime: 45,
    accuracy: 87
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">学習統計</h1>
            <p className="text-gray-600">あなたの成長を確認しましょう</p>
          </div>
        </div>

        {/* Today's Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-noutenkyo-blue" />
              今日の成果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-noutenkyo-blue">{todayStats.noutenkyoScore}</div>
                <div className="text-sm text-gray-600">のうきょスコア</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{todayStats.tasksCompleted}</div>
                <div className="text-sm text-gray-600">完了タスク</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{todayStats.studyTime}分</div>
                <div className="text-sm text-gray-600">学習時間</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{todayStats.accuracy}%</div>
                <div className="text-sm text-gray-600">正答率</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TOEIC Estimate & Progress */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-500" />
                TOEIC推定スコア
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {getCurrentTOEICEstimate()}
                </div>
                <div className="text-sm text-gray-600 mb-4">点 (推定)</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>目標まで</span>
                    <span className="font-medium">
                      {Math.max(0, 800 - getCurrentTOEICEstimate())}点
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (getCurrentTOEICEstimate() / 800) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                学習進捗
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>単語</span>
                    <span>{studyProgress.vocabularyLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${studyProgress.vocabularyLevel}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>文法</span>
                    <span>{studyProgress.grammarLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${studyProgress.grammarLevel}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>リスニング</span>
                    <span>{studyProgress.listeningLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${studyProgress.listeningLevel}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>リーディング</span>
                    <span>{studyProgress.readingLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${studyProgress.readingLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                学習時間
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {studyProgress.totalStudyTime}h
                </div>
                <div className="text-sm text-gray-600">累計学習時間</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                継続日数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">
                  {studyProgress.streakDays}日
                </div>
                <div className="text-sm text-gray-600">連続学習</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                達成度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {achievements.filter(a => a.earned).length}/{achievements.length}
                </div>
                <div className="text-sm text-gray-600">バッジ獲得</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              できるようになったことカード
            </CardTitle>
            <CardDescription>
              あなたの成長を記録しています
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Badge variant="secondary" className="ml-auto">
                        達成
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
