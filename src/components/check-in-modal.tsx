'use client'

import { useState, useEffect } from 'react'
import { Heart, Zap, Target, Brain, Moon, MessageSquare, Sun, Cloud, CloudRain } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { UserState } from '@/lib/types'
import { saveUserState, saveTasks, getCurrentWeather } from '@/lib/storage'
import { generateDailyTasks, calculateNoutenkyoScore } from '@/lib/noutenkyo-engine'

interface CheckInModalProps {
  onComplete: (userState: UserState) => void
  onClose?: () => void
}

export function CheckInModal({ onComplete, onClose }: CheckInModalProps) {
  const [mood, setMood] = useState([3])
  const [energy, setEnergy] = useState([3])
  const [focus, setFocus] = useState([3])
  const [anxiety, setAnxiety] = useState([3])
  const [sleepHours, setSleepHours] = useState([7])
  const [note, setNote] = useState('')
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy'>('sunny')
  const [temperature, setTemperature] = useState(20)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 天気情報を取得
    getCurrentWeather().then(({ weather, temperature }) => {
      setWeather(weather)
      setTemperature(temperature)
    })
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true)
    
    const userState: UserState = {
      date: new Date().toISOString().split('T')[0],
      mood: mood[0],
      energy: energy[0],
      focus: focus[0],
      anxiety: anxiety[0],
      sleepHours: sleepHours[0],
      weather,
      temperature,
      note
    }

    try {
      // ユーザー状態を保存
      await saveUserState(userState)
      
      // スコア計算してタスク生成
      const score = calculateNoutenkyoScore(userState)
      const tasks = generateDailyTasks(score)
      
      // タスクを保存
      await saveTasks(tasks)
      
      onComplete(userState)
    } catch (error) {
      console.error('Failed to save user state:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getWeatherIcon = (weatherType: string) => {
    switch (weatherType) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />
      default: return <Sun className="h-6 w-6" />
    }
  }

  const getSliderColor = (value: number, isAnxiety = false) => {
    if (isAnxiety) {
      if (value >= 4) return 'bg-red-500'
      if (value >= 3) return 'bg-yellow-500'
      return 'bg-green-500'
    } else {
      if (value >= 4) return 'bg-green-500'
      if (value >= 3) return 'bg-yellow-500'
      return 'bg-red-500'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center">今日の体調チェックイン</CardTitle>
          <CardDescription className="text-center">
            あなたの今の状態を教えてください。最適な学習プランを提案します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 天気情報 */}
          <div className="flex items-center justify-center gap-4 p-4 bg-blue-50 rounded-lg">
            {getWeatherIcon(weather)}
            <span className="text-lg font-medium">
              今日の天気: {weather === 'sunny' ? '晴れ' : weather === 'cloudy' ? '曇り' : '雨'} ({temperature}°C)
            </span>
          </div>

          {/* 気分 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <label className="text-sm font-medium">気分 ({mood[0]}/5)</label>
            </div>
            <Slider
              value={mood}
              onValueChange={setMood}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>とても悪い</span>
              <span>普通</span>
              <span>とても良い</span>
            </div>
          </div>

          {/* エネルギー */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <label className="text-sm font-medium">エネルギー ({energy[0]}/5)</label>
            </div>
            <Slider
              value={energy}
              onValueChange={setEnergy}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>とても疲れた</span>
              <span>普通</span>
              <span>とても元気</span>
            </div>
          </div>

          {/* 集中力 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <label className="text-sm font-medium">集中力 ({focus[0]}/5)</label>
            </div>
            <Slider
              value={focus}
              onValueChange={setFocus}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>全く集中できない</span>
              <span>普通</span>
              <span>とても集中できる</span>
            </div>
          </div>

          {/* 不安度 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <label className="text-sm font-medium">不安度 ({anxiety[0]}/5)</label>
            </div>
            <Slider
              value={anxiety}
              onValueChange={setAnxiety}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>全く不安ない</span>
              <span>普通</span>
              <span>とても不安</span>
            </div>
          </div>

          {/* 睡眠時間 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-indigo-500" />
              <label className="text-sm font-medium">昨夜の睡眠時間 ({sleepHours[0]}時間)</label>
            </div>
            <Slider
              value={sleepHours}
              onValueChange={setSleepHours}
              max={12}
              min={3}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>3時間</span>
              <span>7.5時間</span>
              <span>12時間</span>
            </div>
          </div>

          {/* メモ */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <label className="text-sm font-medium">今日の調子についてメモ（任意）</label>
            </div>
            <Textarea
              value={note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              placeholder="今日の体調や気分について、気になることがあれば書いてください..."
              className="min-h-[80px]"
            />
          </div>

          {/* 送信ボタン */}
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="w-full h-12"
          >
            {isLoading ? '処理中...' : '今日の学習プランを作成'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
