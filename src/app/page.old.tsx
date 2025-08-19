'use client'

import { useState, useEffect } from 'react'
import { Sun, Cloud, CloudRain, Thermometer, Brain, Heart, Zap, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckInModal } from '@/components/check-in-modal'
import { TaskCard } from '@/components/task-card'
import { UserState, Task } from '@/lib/types'
import { calculateNoutenkyoScore, generateDailyTasks } from '@/lib/noutenkyo-engine'
import { getUserState, getTodayTasks } from '@/lib/storage'

export default function HomePage() {
  const [userState, setUserState] = useState<UserState | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [noutenkyoScore, setNoutenkyoScore] = useState(0)

  useEffect(() => {
    const loadUserData = async () => {
      const state = await getUserState()
      const todayTasks = await getTodayTasks()
      
      if (state) {
        setUserState(state)
        const score = calculateNoutenkyoScore(state)
        setNoutenkyoScore(score)
        
        if (todayTasks.length === 0) {
          const newTasks = await generateDailyTasks(score)
          setTasks(newTasks)
        } else {
          setTasks(todayTasks)
        }
      } else {
        setShowCheckIn(true)
      }
    }
    
    loadUserData()
  }, [])

  const handleCheckInComplete = async (newState: UserState) => {
    setUserState(newState)
    const score = calculateNoutenkyoScore(newState)
    setNoutenkyoScore(score)
    const newTasks = await generateDailyTasks(score)
    setTasks(newTasks)
    setShowCheckIn(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return '絶好調！今日はがっつり学習しましょう'
    if (score >= 60) return 'まずまずの調子です。無理せず進めましょう'
    return '今日はゆっくりペースで。回復モードもあります'
  }

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />
      default: return <Sun className="h-6 w-6" />
    }
  }

  if (showCheckIn) {
    return <CheckInModal onComplete={handleCheckInComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">のうてんきょ</h1>
          <p className="text-gray-600">あなたの心と空に合わせた学習</p>
        </div>

        {/* Today's Status */}
        {userState && (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-noutenkyo-blue" />
                今日ののうてんきスコア
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(noutenkyoScore)}`}>
                    {noutenkyoScore}
                  </div>
                  <div className="text-sm text-gray-600">/ 100</div>
                </div>
                <div className="flex items-center gap-4">
                  {getWeatherIcon(userState.weather)}
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-sm">{userState.temperature}°C</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{getScoreMessage(noutenkyoScore)}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                  <div className="text-sm font-medium">気分</div>
                  <div className="text-lg">{userState.mood}/5</div>
                </div>
                <div className="text-center">
                  <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                  <div className="text-sm font-medium">エネルギー</div>
                  <div className="text-lg">{userState.energy}/5</div>
                </div>
                <div className="text-center">
                  <Target className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <div className="text-sm font-medium">集中力</div>
                  <div className="text-lg">{userState.focus}/5</div>
                </div>
                <div className="text-center">
                  <Brain className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                  <div className="text-sm font-medium">不安度</div>
                  <div className="text-lg">{userState.anxiety}/5</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>今日の学習メニュー</CardTitle>
            <CardDescription>
              あなたの状態に合わせて最適化されたタスクです
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {tasks.map((task, index) => (
                <TaskCard key={index} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-16"
            onClick={() => setShowCheckIn(true)}
          >
            体調チェックイン
          </Button>
          <Button 
            variant="outline" 
            className="h-16"
            onClick={() => window.location.href = '/recovery'}
          >
            回復モード
          </Button>
        </div>
      </div>
    </div>
  )
}
