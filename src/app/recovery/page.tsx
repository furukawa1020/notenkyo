'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Sun, 
  Moon, 
  Cloud, 
  Smile, 
  Meh, 
  Frown,
  Coffee,
  Music,
  Book,
  Sparkles,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface RecoveryActivity {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  duration: number // 分
  difficulty: 'ultra-light' | 'light' | 'gentle'
  benefits: string[]
  type: 'breathing' | 'vocabulary' | 'mindfulness' | 'listening' | 'reading'
}

const recoveryActivities: RecoveryActivity[] = [
  {
    id: 'breathing',
    name: '深呼吸エクササイズ',
    description: 'ゆったりとした呼吸で心を落ち着けます',
    icon: Heart,
    duration: 3,
    difficulty: 'ultra-light',
    benefits: ['リラックス', '集中力向上', 'ストレス軽減'],
    type: 'breathing'
  },
  {
    id: 'gentle-vocab',
    name: 'やさしい単語復習',
    description: '覚えた単語をゆっくり見直します',
    icon: Book,
    duration: 5,
    difficulty: 'light',
    benefits: ['記憶定着', '達成感', '自信回復'],
    type: 'vocabulary'
  },
  {
    id: 'mindful-moment',
    name: 'マインドフル瞬間',
    description: '今この瞬間に意識を向けます',
    icon: Sparkles,
    duration: 2,
    difficulty: 'ultra-light',
    benefits: ['マインドフルネス', '不安軽減', '現在集中'],
    type: 'mindfulness'
  },
  {
    id: 'easy-listening',
    name: 'やさしいリスニング',
    description: '短い英語音声をリラックスして聞きます',
    icon: Music,
    duration: 4,
    difficulty: 'gentle',
    benefits: ['リスニング慣れ', 'リラックス', '語感向上'],
    type: 'listening'
  },
  {
    id: 'comfort-reading',
    name: 'コンフォート読書',
    description: '簡単な英文をゆっくり読みます',
    icon: Coffee,
    duration: 6,
    difficulty: 'gentle',
    benefits: ['読解慣れ', '達成感', 'ペース回復'],
    type: 'reading'
  }
]

export default function RecoveryPage() {
  const [currentMood, setCurrentMood] = useState<number>(5)
  const [selectedActivity, setSelectedActivity] = useState<RecoveryActivity | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [completedActivities, setCompletedActivities] = useState<string[]>([])

  // 気分に基づいて推奨アクティビティをフィルタリング
  const getRecommendedActivities = (mood: number): RecoveryActivity[] => {
    if (mood <= 3) {
      return recoveryActivities.filter(a => a.difficulty === 'ultra-light')
    } else if (mood <= 6) {
      return recoveryActivities.filter(a => a.difficulty !== 'gentle')
    } else {
      return recoveryActivities
    }
  }

  const recommendedActivities = getRecommendedActivities(currentMood)

  // 活動完了ハンドラー（useCallbackで定義）
  const handleActivityComplete = useCallback(() => {
    if (selectedActivity) {
      setCompletedActivities([...completedActivities, selectedActivity.id])
      setIsActive(false)
      setSelectedActivity(null)
      // 完了通知やポジティブフィードバックを表示
    }
  }, [selectedActivity, completedActivities])

  // タイマー機能
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && isActive) {
      handleActivityComplete()
    }
  }, [isActive, timeRemaining, handleActivityComplete])

  const startActivity = (activity: RecoveryActivity) => {
    setSelectedActivity(activity)
    setTimeRemaining(activity.duration * 60)
    setIsActive(true)
  }

  const pauseActivity = () => {
    setIsActive(false)
  }

  const resumeActivity = () => {
    setIsActive(true)
  }

  const resetActivity = () => {
    setIsActive(false)
    setTimeRemaining(selectedActivity?.duration ? selectedActivity.duration * 60 : 0)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getMoodIcon = (mood: number) => {
    if (mood <= 3) return <Frown className="w-6 h-6 text-red-500" />
    if (mood <= 6) return <Meh className="w-6 h-6 text-yellow-500" />
    return <Smile className="w-6 h-6 text-green-500" />
  }

  const getMoodLabel = (mood: number) => {
    if (mood <= 3) return "今日は無理をしない日"
    if (mood <= 6) return "ゆっくりペースで進む日"
    return "少し元気がある日"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'ultra-light': return 'bg-green-100 text-green-800'
      case 'light': return 'bg-blue-100 text-blue-800'
      case 'gentle': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Heart className="w-8 h-8 text-red-500" />
            回復モード
          </h1>
          <p className="text-gray-600">今日の自分に優しく、無理をしない学習を</p>
        </div>

        {/* 気分チェック */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getMoodIcon(currentMood)}
              今の気分はいかがですか？
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>調子が悪い</span>
                <span>普通</span>
                <span>元気</span>
              </div>
              <Slider
                value={[currentMood]}
                onValueChange={(value) => setCurrentMood(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {getMoodLabel(currentMood)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* アクティブセッション */}
        {selectedActivity && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <selectedActivity.icon className="w-6 h-6" />
                {selectedActivity.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-mono font-bold text-blue-600">
                  {formatTime(timeRemaining)}
                </div>
                <Progress 
                  value={((selectedActivity.duration * 60 - timeRemaining) / (selectedActivity.duration * 60)) * 100}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-center gap-2">
                {!isActive ? (
                  <Button onClick={resumeActivity} className="gap-2">
                    <Play className="w-4 h-4" />
                    {timeRemaining === selectedActivity.duration * 60 ? '開始' : '再開'}
                  </Button>
                ) : (
                  <Button onClick={pauseActivity} variant="outline" className="gap-2">
                    <Pause className="w-4 h-4" />
                    一時停止
                  </Button>
                )}
                <Button onClick={resetActivity} variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  リセット
                </Button>
              </div>
              
              <div className="text-center text-gray-600">
                <p className="italic">&ldquo;{selectedActivity.description}&rdquo;</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 推奨アクティビティ */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            今日のあなたにおすすめ
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedActivities.map((activity) => {
              const IconComponent = activity.icon
              const isCompleted = completedActivities.includes(activity.id)
              
              return (
                <Card 
                  key={activity.id} 
                  className={`transition-all hover:shadow-md ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <IconComponent className="w-5 h-5" />
                        {activity.name}
                      </CardTitle>
                      <Badge className={getDifficultyColor(activity.difficulty)}>
                        {activity.duration}分
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      {activity.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {activity.benefits.map((benefit) => (
                        <Badge key={benefit} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => startActivity(activity)}
                      disabled={isActive || isCompleted}
                      className="w-full"
                      variant={isCompleted ? "outline" : "default"}
                    >
                      {isCompleted ? '✓ 完了済み' : '始める'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 今日の成果 */}
        {completedActivities.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Sparkles className="w-6 h-6" />
                今日のあなたは素晴らしい！
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                {completedActivities.length}個のアクティビティを完了しました。
                小さな一歩も大切な前進です。
              </p>
            </CardContent>
          </Card>
        )}

        {/* エンカレッジメント */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-blue-800">覚えておいてください</h3>
              <p className="text-blue-700">
                今日できることを、今日のペースで。<br />
                無理をしないことも、大切な選択です。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
