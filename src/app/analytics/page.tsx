'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAllStudySessions, getAllUserStates, calculateKPIs, exportResearchData } from '@/lib/storage'
import { AdaptiveLearningSystem, predictLearningEffectiveness, generatePersonalizedPlan } from '@/lib/advanced-noutenkyo-engine'

export default function AdvancedAnalytics() {
  const [studySessions, setStudySessions] = useState<any[]>([])
  const [userStates, setUserStates] = useState<any[]>([])
  const [kpis, setKPIs] = useState<any>({})
  const [adaptiveSystem] = useState(new AdaptiveLearningSystem())
  const [personalizedPlan, setPersonalizedPlan] = useState<any>(null)
  const [learningPredictions, setLearningPredictions] = useState<any>({})

  const loadAnalyticsData = useCallback(async () => {
    try {
      const sessions = await getAllStudySessions()
      const states = await getAllUserStates()
      const calculatedKPIs = await calculateKPIs()
      
      setStudySessions(sessions)
      setUserStates(states)
      setKPIs(calculatedKPIs)

      // 学習パフォーマンスの記録
      sessions.forEach(session => {
        if (session.taskType && session.score !== undefined) {
          adaptiveSystem.recordPerformance(
            session.taskType,
            session.score,
            session.studyTime,
            session.noutenkyoScore || 50
          )
        }
      })

      // 個人化プランの生成
      if (states.length > 0) {
        const latestState = states[states.length - 1]
        const plan = generatePersonalizedPlan(
          latestState,
          sessions,
          { maxDailyTasks: 4 }
        )
        setPersonalizedPlan(plan)

        // 各タスクタイプの学習効果予測
        const predictions = {
          vocabulary: predictLearningEffectiveness(latestState.noutenkyoScore || 50, 'vocabulary'),
          grammar: predictLearningEffectiveness(latestState.noutenkyoScore || 50, 'grammar'),
          listening: predictLearningEffectiveness(latestState.noutenkyoScore || 50, 'listening'),
          reading: predictLearningEffectiveness(latestState.noutenkyoScore || 50, 'reading')
        }
        setLearningPredictions(predictions)
      }
    } catch (error) {
      console.error('Analytics data loading failed:', error)
    }
  }, [adaptiveSystem])

  useEffect(() => {
    loadAnalyticsData()
  }, [loadAnalyticsData])

  const exportData = async () => {
    try {
      const data = await exportResearchData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `noutenkyo-research-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Data export failed:', error)
    }
  }

  // 学習パターン分析
  const analyzePatterns = () => {
    if (studySessions.length === 0) return {}

    const patterns = {
      bestTimes: {} as any,
      optimalScores: {} as any,
      averageByCondition: {} as any
    }

    // 時間帯別の平均スコア
    studySessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours()
      const timeSlot = hour < 12 ? '午前' : hour < 18 ? '午後' : '夜間'
      
      if (!patterns.bestTimes[timeSlot]) {
        patterns.bestTimes[timeSlot] = []
      }
      patterns.bestTimes[timeSlot].push(session.score || 0)
    })

    // のうてんきょスコア帯別の学習効果
    studySessions.forEach(session => {
      const scoreRange = session.noutenkyoScore >= 80 ? '高調' : 
                        session.noutenkyoScore >= 60 ? '中調' : '低調'
      
      if (!patterns.optimalScores[scoreRange]) {
        patterns.optimalScores[scoreRange] = []
      }
      patterns.optimalScores[scoreRange].push(session.score || 0)
    })

    return patterns
  }

  const patterns = analyzePatterns()

  // 週間進捗の可視化
  const getWeeklyProgress = () => {
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    
    const weekSessions = studySessions.filter(session => 
      new Date(session.timestamp) >= lastWeek
    )

    const dailyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - 6 + i)
      const dayString = date.toISOString().split('T')[0]
      
      const daySessions = weekSessions.filter(session => 
        session.timestamp.split('T')[0] === dayString
      )
      
      return {
        date: dayString,
        sessions: daySessions.length,
        averageScore: daySessions.length > 0 
          ? daySessions.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / daySessions.length
          : 0,
        totalMinutes: daySessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0)
      }
    })

    return dailyProgress
  }

  const weeklyProgress = getWeeklyProgress()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">高度分析ダッシュボード</h1>
        <Button onClick={exportData}>
          研究データエクスポート
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="patterns">学習パターン</TabsTrigger>
          <TabsTrigger value="predictions">効果予測</TabsTrigger>
          <TabsTrigger value="personalized">個人化プラン</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">総学習時間</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.totalStudyMinutes || 0}分</div>
                <p className="text-sm text-muted-foreground">
                  平均 {Math.round((kpis.totalStudyMinutes || 0) / 7)}分/日
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">平均スコア</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.averageScore || 0}%</div>
                <Progress value={kpis.averageScore || 0} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">学習継続日数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.consistencyDays || 0}日</div>
                <Badge variant={kpis.consistencyDays >= 7 ? "default" : "secondary"}>
                  {kpis.consistencyDays >= 7 ? "継続中" : "要改善"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>週間進捗</CardTitle>
              <CardDescription>過去7日間の学習活動</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyProgress.map((day, index) => (
                  <div key={day.date} className="flex items-center space-x-4">
                    <div className="w-20 text-sm">
                      {new Date(day.date).toLocaleDateString('ja-JP', { weekday: 'short' })}
                    </div>
                    <div className="flex-1">
                      <Progress value={(day.sessions / 5) * 100} className="h-2" />
                    </div>
                    <div className="w-16 text-sm text-right">
                      {day.sessions}セッション
                    </div>
                    <div className="w-16 text-sm text-right">
                      {Math.round(day.averageScore)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>最適学習時間帯</CardTitle>
                <CardDescription>時間帯別平均スコア</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries((patterns as any).bestTimes || {}).map(([time, scores]) => {
                  const average = (scores as number[]).reduce((a, b) => a + b, 0) / (scores as number[]).length
                  return (
                    <div key={time} className="flex justify-between items-center">
                      <span>{time}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={average} className="w-20 h-2" />
                        <span className="text-sm">{Math.round(average)}%</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>体調別学習効果</CardTitle>
                <CardDescription>のうてんきょスコア帯別成果</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries((patterns as any).optimalScores || {}).map(([condition, scores]) => {
                  const average = (scores as number[]).reduce((a, b) => a + b, 0) / (scores as number[]).length
                  return (
                    <div key={condition} className="flex justify-between items-center">
                      <span>{condition}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={average} className="w-20 h-2" />
                        <span className="text-sm">{Math.round(average)}%</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI学習推奨</CardTitle>
              <CardDescription>各スキル別の最適学習時間帯予測</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['vocabulary', 'grammar', 'listening', 'reading'].map(skill => (
                <div key={skill} className="text-center p-3 bg-muted rounded-lg">
                  <div className="font-medium capitalize mb-1">{skill}</div>
                  <div className="text-sm text-muted-foreground">
                    {adaptiveSystem.predictOptimalTime(skill)}
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {adaptiveSystem.adjustDifficulty(skill, userStates[userStates.length - 1]?.noutenkyoScore || 50)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(learningPredictions).map(([taskType, prediction]) => (
              <Card key={taskType}>
                <CardHeader>
                  <CardTitle className="capitalize">{taskType} 学習効果予測</CardTitle>
                  <CardDescription>現在の体調での学習効果</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span>予測効果</span>
                      <span className="font-bold">{(prediction as any).effectiveness}%</span>
                    </div>
                    <Progress value={(prediction as any).effectiveness} />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">推奨事項:</p>
                    <p className="text-sm text-muted-foreground">{(prediction as any).recommendation}</p>
                  </div>
                  {(prediction as any).adjustments?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">調整提案:</p>
                      <div className="space-y-1">
                        {(prediction as any).adjustments.map((adjustment: string, index: number) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1">
                            {adjustment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personalized" className="space-y-4">
          {personalizedPlan && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>今日のモチベーションメッセージ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    {personalizedPlan.motivationalMessage}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>重点改善エリア</CardTitle>
                  <CardDescription>学習履歴に基づく弱点分析</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {personalizedPlan.focusAreas.map((area: string, index: number) => (
                      <Badge key={index} variant="destructive">
                        {area}
                      </Badge>
                    ))}
                    {personalizedPlan.focusAreas.length === 0 && (
                      <p className="text-muted-foreground">すべてのエリアでバランス良く学習できています！</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>週間学習プラン</CardTitle>
                  <CardDescription>あなたのペースに合わせた個人化プラン</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {personalizedPlan.weeklyPlan.map((day: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">
                            {index === 0 ? '今日' : `${index + 1}日後`}
                            {day.restDay && <Badge variant="secondary" className="ml-2">休息日</Badge>}
                          </h3>
                          <Badge variant="outline">
                            重点: {day.focus}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          タスク数: {day.tasks.length}個 • 
                          推定時間: {day.tasks.reduce((sum: number, task: any) => sum + task.lengthMinutes, 0)}分
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
