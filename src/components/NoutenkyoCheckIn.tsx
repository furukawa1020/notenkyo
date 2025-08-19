'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { weatherManager } from '@/lib/weather-manager'
import { 
  Heart, 
  Zap, 
  Brain, 
  Moon, 
  Sun, 
  Cloud, 
  CloudRain,
  Thermometer,
  Target,
  TrendingUp,
  CheckCircle,
  MapPin
} from 'lucide-react'

// 体調チェックインの型定義
interface HealthCheckIn {
  mood: number // 1-5 (1: very low, 5: very high)
  energy: number // 1-5
  focus: number // 1-5
  anxiety: number // 1-5 (1: very anxious, 5: very calm)
  sleepHours: number // 1-12
  note: string
  weather: 'sunny' | 'cloudy' | 'rainy'
  temperature: number
  date: string
}

interface NoutenkyoCheckInProps {
  onComplete: (checkIn: HealthCheckIn, noutenkyoScore: number) => void
  onSkip?: () => void
}

export default function NoutenkyoCheckIn({ onComplete, onSkip }: NoutenkyoCheckInProps) {
  const [mood, setMood] = useState([3])
  const [energy, setEnergy] = useState([3])
  const [focus, setFocus] = useState([3])
  const [anxiety, setAnxiety] = useState([3])
  const [sleepHours, setSleepHours] = useState([7])
  const [note, setNote] = useState('')
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'rainy'>('cloudy')
  const [temperature, setTemperature] = useState(20)
  const [weatherLocation, setWeatherLocation] = useState('現在地')
  const [weatherDescription, setWeatherDescription] = useState('')
  const [isLoadingWeather, setIsLoadingWeather] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [noutenkyoScore, setNoutenkyoScore] = useState(0)

  // 天気情報の自動取得
  useEffect(() => {
    getCurrentWeather()
  }, [])

  // のうてんきょスコア計算（リアルタイム）
  useEffect(() => {
    const score = calculateNoutenkyoScore({
      mood: mood[0],
      energy: energy[0],
      focus: focus[0],
      anxiety: anxiety[0],
      sleepHours: sleepHours[0],
      weather,
      temperature
    })
    setNoutenkyoScore(score)
  }, [mood, energy, focus, anxiety, sleepHours, weather, temperature])

  // 実際の天気情報取得
  const getCurrentWeather = async () => {
    try {
      setIsLoadingWeather(true)
      
      // 天気マネージャーから実際の天気データを取得
      const weatherData = await weatherManager.getCurrentWeather()
      
      setWeather(weatherData.weather)
      setTemperature(weatherData.temperature)
      setWeatherLocation(weatherData.location)
      setWeatherDescription(weatherData.description)
      
      // 天気データをローカルストレージに保存
      weatherManager.saveWeatherToStorage(weatherData)
      
      console.log('Weather data retrieved:', {
        weather: weatherData.weather,
        temperature: weatherData.temperature,
        location: weatherData.location,
        description: weatherData.description,
        isRealAPI: !!weatherData.timestamp
      })
      
    } catch (error) {
      console.error('Weather retrieval failed:', error)
      
      // エラー時のフォールバック
      const hour = new Date().getHours()
      const randomWeather = Math.random()
      
      let detectedWeather: 'sunny' | 'cloudy' | 'rainy'
      if (hour >= 6 && hour <= 18) {
        if (randomWeather < 0.6) detectedWeather = 'sunny'
        else if (randomWeather < 0.8) detectedWeather = 'cloudy'
        else detectedWeather = 'rainy'
      } else {
        detectedWeather = 'cloudy'
      }
      
      setWeather(detectedWeather)
      setTemperature(20)
      setWeatherDescription('推定値')
    } finally {
      setIsLoadingWeather(false)
    }
  }

  // のうてんきょスコア計算アルゴリズム（天気マネージャー統合版）
  const calculateNoutenkyoScore = (params: {
    mood: number
    energy: number
    focus: number
    anxiety: number
    sleepHours: number
    weather: string
    temperature: number
  }): number => {
    // 基本的な健康スコア (20点満点)
    const healthScore = (
      params.mood * 0.25 +
      params.energy * 0.25 +
      params.focus * 0.20 +
      params.anxiety * 0.15 +
      Math.min(params.sleepHours / 8, 1) * 5 * 0.15
    )

    // 天気マネージャーから詳細な影響度を取得
    let weatherImpact = { moodImpact: 0, energyImpact: 0, focusImpact: 0 }
    
    try {
      // 仮想的な天気データで影響度計算
      const mockWeatherData = {
        weather: params.weather as 'sunny' | 'cloudy' | 'rainy',
        temperature: params.temperature,
        humidity: 60,
        description: '',
        location: '',
        timestamp: new Date()
      }
      weatherImpact = weatherManager.calculateWeatherImpact(mockWeatherData)
    } catch (error) {
      console.error('Weather impact calculation failed:', error)
      
      // フォールバック：従来の計算
      switch (params.weather) {
        case 'sunny':
          weatherImpact = { moodImpact: 0.2, energyImpact: 0.15, focusImpact: 0.1 }
          break
        case 'cloudy':
          weatherImpact = { moodImpact: -0.05, energyImpact: -0.1, focusImpact: 0.05 }
          break
        case 'rainy':
          weatherImpact = { moodImpact: -0.15, energyImpact: -0.2, focusImpact: -0.1 }
          break
      }
    }

    // 天気による調整後の健康スコア
    const adjustedMood = Math.max(1, Math.min(5, params.mood + weatherImpact.moodImpact * 5))
    const adjustedEnergy = Math.max(1, Math.min(5, params.energy + weatherImpact.energyImpact * 5))
    const adjustedFocus = Math.max(1, Math.min(5, params.focus + weatherImpact.focusImpact * 5))

    const weatherAdjustedHealthScore = (
      adjustedMood * 0.25 +
      adjustedEnergy * 0.25 +
      adjustedFocus * 0.20 +
      params.anxiety * 0.15 +
      Math.min(params.sleepHours / 8, 1) * 5 * 0.15
    )

    // 最終スコア計算（1-100）
    const finalScore = Math.round(weatherAdjustedHealthScore * 20)
    return Math.max(1, Math.min(100, finalScore))
  }

  // スコアに基づく学習推奨レベル
  const getStudyRecommendation = (score: number) => {
    if (score >= 80) return { level: 'intense', color: 'green', label: '集中学習', description: '難しい問題にチャレンジしましょう' }
    if (score >= 60) return { level: 'normal', color: 'blue', label: '通常学習', description: 'バランスよく学習しましょう' }
    if (score >= 40) return { level: 'light', color: 'yellow', label: '軽い学習', description: '基礎的な内容から始めましょう' }
    return { level: 'recovery', color: 'red', label: '回復モード', description: '無理をせず軽めの復習にしましょう' }
  }

  // チェックイン完了
  const handleSubmit = async () => {
    setIsLoading(true)
    
    const checkInData: HealthCheckIn = {
      mood: mood[0],
      energy: energy[0],
      focus: focus[0],
      anxiety: anxiety[0],
      sleepHours: sleepHours[0],
      note,
      weather,
      temperature,
      date: new Date().toISOString().split('T')[0]
    }

    // ローカルストレージに保存
    try {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(`noutenkyo-checkin-${today}`, JSON.stringify(checkInData))
      localStorage.setItem(`noutenkyo-score-${today}`, noutenkyoScore.toString())
    } catch (error) {
      console.error('Check-in save failed:', error)
    }

    setTimeout(() => {
      setIsLoading(false)
      onComplete(checkInData, noutenkyoScore)
    }, 1000)
  }

  const recommendation = getStudyRecommendation(noutenkyoScore)

  // 天気アイコン取得
  const getWeatherIcon = (weatherType: string) => {
    switch (weatherType) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />
      default: return <Sun className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            今日の体調チェックイン
          </CardTitle>
          <p className="text-muted-foreground">
            体調と天気から最適な学習プランを提案します
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* 現在の天気情報 */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getWeatherIcon(weather)}
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    今日の天気
                    {isLoadingWeather && (
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {weather === 'sunny' ? '晴れ' : weather === 'cloudy' ? '曇り' : '雨'} / {temperature}°C
                  </div>
                  {weatherDescription && (
                    <div className="text-xs text-muted-foreground">{weatherDescription}</div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {weatherLocation}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-lg font-bold">{temperature}°C</span>
                </div>
              </div>
            </div>
            
            {/* 天気の影響説明 */}
            <div className="mt-3 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
              <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">天気による学習への影響</div>
              <div className="text-muted-foreground">
                {weather === 'sunny' && '晴れの日は気分が上がりやすく、集中力も高まる傾向があります。'}
                {weather === 'cloudy' && '曇りの日は落ち着いた環境で学習に集中しやすいかもしれません。'}
                {weather === 'rainy' && '雨の日は気分が下がりがちです。無理をせず軽めの学習から始めましょう。'}
              </div>
            </div>
          </div>

          {/* 体調スライダー */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="font-medium">気分</span>
                  <Badge variant="outline">{mood[0]}/5</Badge>
                </div>
                <Slider
                  value={mood}
                  onValueChange={setMood}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>とても悪い</span>
                  <span>とても良い</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">エネルギー</span>
                  <Badge variant="outline">{energy[0]}/5</Badge>
                </div>
                <Slider
                  value={energy}
                  onValueChange={setEnergy}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>疲れきっている</span>
                  <span>元気いっぱい</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">集中力</span>
                  <Badge variant="outline">{focus[0]}/5</Badge>
                </div>
                <Slider
                  value={focus}
                  onValueChange={setFocus}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>散漫</span>
                  <span>非常に集中</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="font-medium">不安レベル</span>
                  <Badge variant="outline">{anxiety[0]}/5</Badge>
                </div>
                <Slider
                  value={anxiety}
                  onValueChange={setAnxiety}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>とても不安</span>
                  <span>とても落ち着いている</span>
                </div>
              </div>
            </div>
          </div>

          {/* 睡眠時間 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Moon className="h-5 w-5 text-purple-500" />
              <span className="font-medium">昨夜の睡眠時間</span>
              <Badge variant="outline">{sleepHours[0]}時間</Badge>
            </div>
            <Slider
              value={sleepHours}
              onValueChange={setSleepHours}
              max={12}
              min={1}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1時間</span>
              <span>12時間</span>
            </div>
          </div>

          {/* メモ */}
          <div>
            <label className="font-medium mb-2 block">メモ（任意）</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="今日の調子や気になることを自由に記入..."
              className="h-20"
            />
          </div>

          {/* のうてんきょスコア表示 */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-semibold">のうてんきょスコア</span>
              </div>
              
              <div className="text-4xl font-bold text-blue-600">
                {noutenkyoScore}/100
              </div>
              
              <Progress value={noutenkyoScore} className="h-4" />
              
              <Alert className={`border-${recommendation.color}-200 bg-${recommendation.color}-50`}>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle className={`text-${recommendation.color}-700`}>
                  推奨学習レベル: {recommendation.label}
                </AlertTitle>
                <AlertDescription className={`text-${recommendation.color}-600`}>
                  {recommendation.description}
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            {onSkip && (
              <Button variant="outline" onClick={onSkip} className="flex-1">
                スキップ
              </Button>
            )}
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="flex-1"
              size="lg"
            >
              {isLoading ? '処理中...' : '学習を開始'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
