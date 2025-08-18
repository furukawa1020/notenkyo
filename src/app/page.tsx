'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckInModal } from '@/components/check-in-modal'
import { TaskCard } from '@/components/task-card'
import { InstallButton } from '@/components/install-button'
import { Smartphone, Monitor, Download } from 'lucide-react'
import { 
  getUserState, 
  getTodayTasks, 
  calculateKPIs,
  getAllStudySessions,
  getAllUserStates 
} from '@/lib/storage'
import { 
  calculateNoutenkyoScore, 
  generateDailyTasks 
} from '@/lib/noutenkyo-engine'
import { 
  calculateAdvancedNoutenkyoScore,
  generateOptimizedTasks
} from '@/lib/advanced-noutenkyo-engine'
import { UserState, Task } from '@/lib/types'
import Link from 'next/link'

export default function HomePage() {
  const [userState, setUserState] = useState<UserState | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [kpis, setKPIs] = useState<any>({})
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [noutenkyoScore, setNoutenkyoScore] = useState(0)
  const [basicScore, setBasicScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      
      const state = await getUserState()
      const todayTasks = await getTodayTasks()
      const calculatedKPIs = await calculateKPIs()
      
      setUserState(state)
      setTasks(todayTasks)
      setKPIs(calculatedKPIs)

      if (state) {
        const basic = calculateNoutenkyoScore(state)
        const advanced = calculateAdvancedNoutenkyoScore(state)
        setBasicScore(basic)
        setNoutenkyoScore(advanced)

        if (todayTasks.length === 0) {
          const newTasks = generateOptimizedTasks(advanced, {
            maxDailyTasks: 4,
            difficulty: 'auto'
          })
          setTasks(newTasks)
        }
      } else {
        setShowCheckIn(true)
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckInComplete = async (newState: UserState) => {
    setUserState(newState)
    setShowCheckIn(false)
    
    const basic = calculateNoutenkyoScore(newState)
    const advanced = calculateAdvancedNoutenkyoScore(newState)
    setBasicScore(basic)
    setNoutenkyoScore(advanced)
    
    const newTasks = generateOptimizedTasks(advanced, {
      maxDailyTasks: 4,
      difficulty: 'auto'
    })
    setTasks(newTasks)
    
    await loadUserData()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return '絶好調！チャレンジングな学習に最適です'
    if (score >= 60) return '良好な状態です。着実に学習を進めましょう'
    if (score >= 40) return '軽めの学習がおすすめです'
    return '今日は回復に専念しましょう'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">のうてんきょ</h1>
          <p className="text-gray-600 mt-1">ADHD・うつ対応TOEIC学習システム</p>
        </div>
        <div className="flex flex-col space-y-2">
          <InstallButton />
          <Button 
            variant="outline" 
            onClick={() => setShowCheckIn(true)}
            className="mt-2"
          >
            体調チェックイン
          </Button>
        </div>
      </div>

      {/* のうてんきょスコア表示 */}
      {userState && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>今日ののうてんきょスコア</span>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  基本: {basicScore}
                </Badge>
                <Badge variant="default">
                  高度: {noutenkyoScore}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">高度スコア</span>
                  <span className={`text-2xl font-bold ${getScoreColor(noutenkyoScore)}`}>
                    {noutenkyoScore}/100
                  </span>
                </div>
                <Progress value={noutenkyoScore} className="h-3" />
                <p className="text-sm text-gray-600 mt-2">
                  {getScoreMessage(noutenkyoScore)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 統計表示 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">総学習時間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalStudyMinutes || 0}分</div>
            <p className="text-sm text-gray-500">累計学習時間</p>
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
            <CardTitle className="text-lg">継続日数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.consistencyDays || 0}日</div>
            <Badge variant={kpis.consistencyDays >= 7 ? "default" : "secondary"}>
              {kpis.consistencyDays >= 7 ? "継続中" : "要改善"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* 今日のタスク */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>今日のタスク</CardTitle>
            <Badge variant="outline">
              {tasks.filter(t => t.completed).length}/{tasks.length} 完了
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  noutenkyoScore={noutenkyoScore}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">今日のタスクはまだありません</p>
                <Button onClick={() => setShowCheckIn(true)}>
                  体調チェックインでタスクを生成
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 学習メニュー */}
      <Card>
        <CardHeader>
          <CardTitle>学習メニュー</CardTitle>
          <CardDescription>TOEIC学習をスタートしましょう</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: '単語学習', path: '/study/vocabulary', color: 'bg-blue-500' },
              { name: '文法', path: '/study/grammar', color: 'bg-green-500' },
              { name: 'リスニング', path: '/study/listening', color: 'bg-purple-500' },
              { name: 'リーディング', path: '/study/reading', color: 'bg-orange-500' },
              { name: 'ワーキングメモリ', path: '/study/working-memory', color: 'bg-pink-500' },
              { name: '模擬試験', path: '/mock-test', color: 'bg-red-500' },
              { name: '高度分析', path: '/analytics', color: 'bg-indigo-500' },
              { name: '通知', path: '/notifications', color: 'bg-yellow-500' }
            ].map((item) => (
              <Link key={item.name} href={item.path}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PWAインストール推奨 */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">アプリとしてインストール</CardTitle>
              <CardDescription className="text-blue-700">
                より快適な学習体験をお楽しみください
              </CardDescription>
            </div>
            <InstallButton />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">オフライン対応</p>
                <p className="text-sm text-blue-700">ネット環境がなくても学習可能</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Monitor className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">ネイティブ体験</p>
                <p className="text-sm text-blue-700">アプリのような操作性</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Download className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">簡単アクセス</p>
                <p className="text-sm text-blue-700">ホーム画面から直接起動</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* チェックインモーダル */}
      {showCheckIn && (
        <CheckInModal
          onComplete={handleCheckInComplete}
          onClose={() => setShowCheckIn(false)}
        />
      )}
    </div>
  )
}
