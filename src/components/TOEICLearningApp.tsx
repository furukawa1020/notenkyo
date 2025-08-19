'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Brain, 
  BarChart3, 
  Settings, 
  Download, 
  Upload,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Zap
} from 'lucide-react'

// コンポーネントのインポート
import IntegratedLearningSystem from '@/components/IntegratedLearningSystem'
import NoutenkyoCheckIn from '@/components/NoutenkyoCheckIn'
import { learningStorage, createInitialProgress } from '@/lib/learning-storage'

interface AppState {
  userId: string
  currentToeicScore: number
  targetToeicScore: number
  studyTimePerSession: number
  isFirstTime: boolean
  learningProgress: any | null
  statistics: any | null
  todayCheckIn: any | null
  noutenkyoScore: number
  needsCheckIn: boolean
}

export default function TOEICLearningApp() {
  const [appState, setAppState] = useState<AppState>({
    userId: '',
    currentToeicScore: 500,
    targetToeicScore: 800,
    studyTimePerSession: 30,
    isFirstTime: true,
    learningProgress: null,
    statistics: null,
    todayCheckIn: null,
    noutenkyoScore: 50,
    needsCheckIn: true
  })
  
  const [currentView, setCurrentView] = useState<'setup' | 'checkin' | 'dashboard' | 'learning' | 'statistics' | 'settings'>('setup')
  const [isLoading, setIsLoading] = useState(false)

  // アプリ初期化
  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    setIsLoading(true)
    try {
      // ローカルストレージから基本設定を復元
      const savedUserId = localStorage.getItem('noutenkyoUserId')
      const savedScore = localStorage.getItem('currentToeicScore')
      
      if (savedUserId && savedScore) {
        const userId = savedUserId
        const progress = await learningStorage.getLearningProgress(userId)
        const statistics = await learningStorage.getStatistics(userId)
        
        // 今日のチェックインを確認
        const today = new Date().toISOString().split('T')[0]
        const todayCheckIn = localStorage.getItem(`noutenkyo-checkin-${today}`)
        const todayScore = localStorage.getItem(`noutenkyo-score-${today}`)
        
        setAppState(prev => ({
          ...prev,
          userId,
          currentToeicScore: parseInt(savedScore),
          isFirstTime: false,
          learningProgress: progress,
          statistics,
          todayCheckIn: todayCheckIn ? JSON.parse(todayCheckIn) : null,
          noutenkyoScore: todayScore ? parseInt(todayScore) : 50,
          needsCheckIn: !todayCheckIn
        }))
        
        // チェックインが必要な場合はチェックイン画面へ
        if (!todayCheckIn) {
          setCurrentView('checkin')
        } else {
          setCurrentView('dashboard')
        }
      }
    } catch (error) {
      console.error('App initialization failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 初期設定完了
  const completeSetup = async () => {
    setIsLoading(true)
    try {
      const userId = `user_${Date.now()}`
      const progress = await createInitialProgress(userId, appState.currentToeicScore)
      
      await learningStorage.saveLearningProgress(progress)
      
      // ローカルストレージに基本情報を保存
      localStorage.setItem('noutenkyoUserId', userId)
      localStorage.setItem('currentToeicScore', appState.currentToeicScore.toString())
      localStorage.setItem('targetToeicScore', appState.targetToeicScore.toString())
      
      setAppState(prev => ({
        ...prev,
        userId,
        isFirstTime: false,
        learningProgress: progress,
        needsCheckIn: true
      }))
      
      setCurrentView('checkin')
    } catch (error) {
      console.error('Setup completion failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 体調チェックイン完了処理
  const handleCheckInComplete = (checkInData: any, noutenkyoScore: number) => {
    setAppState(prev => ({
      ...prev,
      todayCheckIn: checkInData,
      noutenkyoScore,
      needsCheckIn: false
    }))
    
    setCurrentView('dashboard')
  }

  // 学習完了処理
  const handleLearningComplete = async (results: any) => {
    try {
      // セッション結果を保存
      const sessionResult = {
        sessionId: `session_${Date.now()}`,
        userId: appState.userId,
        date: new Date().toISOString(),
        duration: appState.studyTimePerSession,
        sections: results,
        totalScore: results.totalScore || 0,
        overallAccuracy: results.overallAccuracy || 0
      }
      
      await learningStorage.saveSessionResults(sessionResult)
      
      // 進捗を更新
      const updatedProgress = await learningStorage.getLearningProgress(appState.userId)
      const updatedStatistics = await learningStorage.getStatistics(appState.userId)
      
      setAppState(prev => ({
        ...prev,
        learningProgress: updatedProgress,
        statistics: updatedStatistics
      }))
      
      setCurrentView('dashboard')
    } catch (error) {
      console.error('Learning completion handling failed:', error)
    }
  }

  // データエクスポート
  const exportData = async () => {
    try {
      const data = await learningStorage.exportData(appState.userId)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `noutenkyo-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Data export failed:', error)
    }
  }

  // データインポート
  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      const text = await file.text()
      await learningStorage.importData(text)
      
      // データを再読み込み
      await initializeApp()
      alert('データのインポートが完了しました')
    } catch (error) {
      console.error('Data import failed:', error)
      alert('データのインポートに失敗しました')
    }
  }

  // のうてんきょスコアに基づく学習時間調整
  const getAdjustedStudyTime = (baseTime: number, noutenkyoScore: number): number => {
    if (noutenkyoScore >= 80) return Math.min(baseTime * 1.2, 60) // 最大60分
    if (noutenkyoScore >= 60) return baseTime
    if (noutenkyoScore >= 40) return Math.max(baseTime * 0.7, 15) // 最低15分
    return Math.max(baseTime * 0.5, 10) // 回復モードは最低10分
  }

  // レベル判定
  const getLevelBadge = (score: number) => {
    if (score < 500) return <Badge variant="outline" className="bg-blue-50 text-blue-700">Basic</Badge>
    if (score < 700) return <Badge variant="outline" className="bg-green-50 text-green-700">Intermediate</Badge>
    if (score < 850) return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Advanced</Badge>
    return <Badge variant="outline" className="bg-purple-50 text-purple-700">Expert</Badge>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>のうてんきょを読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 初期設定画面
  if (currentView === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Brain className="h-8 w-8 text-blue-500" />
              のうてんきょ
            </CardTitle>
            <p className="text-muted-foreground">
              ADHD・うつ対応TOEIC学習アプリ
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-score">現在のTOEICスコア（推定）</Label>
                <Input
                  id="current-score"
                  type="number"
                  min="10"
                  max="990"
                  value={appState.currentToeicScore}
                  onChange={(e) => setAppState(prev => ({
                    ...prev,
                    currentToeicScore: parseInt(e.target.value) || 500
                  }))}
                  className="text-center text-lg font-semibold"
                />
                <div className="mt-2 text-center">
                  {getLevelBadge(appState.currentToeicScore)}
                </div>
              </div>
              
              <div>
                <Label htmlFor="target-score">目標TOEICスコア</Label>
                <Input
                  id="target-score"
                  type="number"
                  min={appState.currentToeicScore}
                  max="990"
                  value={appState.targetToeicScore}
                  onChange={(e) => setAppState(prev => ({
                    ...prev,
                    targetToeicScore: parseInt(e.target.value) || 800
                  }))}
                  className="text-center text-lg font-semibold"
                />
              </div>
              
              <div>
                <Label htmlFor="session-time">1セッションの学習時間（分）</Label>
                <Input
                  id="session-time"
                  type="number"
                  min="10"
                  max="120"
                  value={appState.studyTimePerSession}
                  onChange={(e) => setAppState(prev => ({
                    ...prev,
                    studyTimePerSession: parseInt(e.target.value) || 30
                  }))}
                  className="text-center text-lg font-semibold"
                />
              </div>
            </div>
            
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertTitle>ADHD・うつ配慮設計</AlertTitle>
              <AlertDescription>
                シンプルなUI、適切な学習量調整、達成感重視の設計で、無理なく継続できます。
              </AlertDescription>
            </Alert>
            
            <Button onClick={completeSetup} className="w-full" size="lg">
              <Zap className="h-5 w-5 mr-2" />
              学習を開始
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 体調チェックイン画面
  if (currentView === 'checkin') {
    return (
      <NoutenkyoCheckIn
        onComplete={handleCheckInComplete}
        onSkip={() => {
          // スキップ時は標準スコア（50）を設定
          setAppState(prev => ({ ...prev, noutenkyoScore: 50, needsCheckIn: false }))
          setCurrentView('dashboard')
        }}
      />
    )
  }

  // メインアプリケーション
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold">のうてんきょ</h1>
                <p className="text-sm text-muted-foreground">TOEIC学習システム</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {getLevelBadge(appState.currentToeicScore)}
              <div className="text-right">
                <div className="text-sm text-muted-foreground">現在</div>
                <div className="font-semibold">{appState.currentToeicScore}点</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">目標</div>
                <div className="font-semibold">{appState.targetToeicScore}点</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'learning' && (
          <IntegratedLearningSystem
            userLevel={appState.currentToeicScore}
            sessionDuration={getAdjustedStudyTime(appState.studyTimePerSession, appState.noutenkyoScore)}
            onComplete={handleLearningComplete}
          />
        )}

        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* のうてんきょスコア表示 */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
              <CardContent className="py-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="h-6 w-6 text-blue-500" />
                    <span className="text-lg font-semibold">今日ののうてんきょスコア</span>
                  </div>
                  
                  <div className="text-4xl font-bold text-blue-600">
                    {appState.noutenkyoScore}/100
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={appState.noutenkyoScore} className="h-3" />
                    <div className="text-sm text-muted-foreground">
                      推奨学習時間: {getAdjustedStudyTime(appState.studyTimePerSession, appState.noutenkyoScore)}分
                      {appState.noutenkyoScore !== 50 && (
                        <span className="ml-2">
                          (基準: {appState.studyTimePerSession}分から調整)
                        </span>
                      )}
                    </div>
                    {appState.needsCheckIn && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentView('checkin')}
                      >
                        体調を再チェック
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 学習統計概要 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="py-6 text-center">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{appState.statistics?.totalStudyTime || 0}</div>
                  <div className="text-sm text-muted-foreground">総学習時間(分)</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="py-6 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{Math.round(appState.statistics?.averageAccuracy || 0)}%</div>
                  <div className="text-sm text-muted-foreground">平均正答率</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="py-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{Math.round(appState.statistics?.vocabularyProgress || 0)}%</div>
                  <div className="text-sm text-muted-foreground">語彙習得率</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="py-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{appState.statistics?.streakDays || 0}</div>
                  <div className="text-sm text-muted-foreground">連続学習日数</div>
                </CardContent>
              </Card>
            </div>

            {/* アクションエリア */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    今日の学習
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      体調スコア {appState.noutenkyoScore}/100 に基づいて、
                      {getAdjustedStudyTime(appState.studyTimePerSession, appState.noutenkyoScore)}分間の学習セッションを開始しましょう
                    </p>
                    <Button onClick={() => setCurrentView('learning')} size="lg" className="w-full">
                      <BookOpen className="h-5 w-5 mr-2" />
                      学習を開始
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    進捗管理
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>目標まで</span>
                      <span>{appState.targetToeicScore - appState.currentToeicScore}点</span>
                    </div>
                    <Progress 
                      value={(appState.currentToeicScore / appState.targetToeicScore) * 100} 
                      className="h-2"
                    />
                  </div>
                  <Button variant="outline" onClick={() => setCurrentView('statistics')} className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    詳細統計を見る
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'statistics' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                学習統計
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">スキル別進捗</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>語彙力</span>
                        <span>{Math.round(appState.statistics?.vocabularyProgress || 0)}%</span>
                      </div>
                      <Progress value={appState.statistics?.vocabularyProgress || 0} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>文法力</span>
                        <span>{Math.round(appState.statistics?.grammarProgress || 0)}%</span>
                      </div>
                      <Progress value={appState.statistics?.grammarProgress || 0} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>読解力</span>
                        <span>{Math.round(appState.statistics?.readingProgress || 0)}%</span>
                      </div>
                      <Progress value={appState.statistics?.readingProgress || 0} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>リスニング力</span>
                        <span>{Math.round(appState.statistics?.listeningProgress || 0)}%</span>
                      </div>
                      <Progress value={appState.statistics?.listeningProgress || 0} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">学習記録</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>総セッション数</span>
                      <span className="font-medium">{appState.statistics?.sessionsCompleted || 0}回</span>
                    </div>
                    <div className="flex justify-between">
                      <span>総学習時間</span>
                      <span className="font-medium">{Math.round((appState.statistics?.totalStudyTime || 0) / 60)}時間</span>
                    </div>
                    <div className="flex justify-between">
                      <span>最終学習日</span>
                      <span className="font-medium">
                        {appState.statistics?.lastStudyDate 
                          ? new Date(appState.statistics.lastStudyDate).toLocaleDateString('ja-JP')
                          : '未実施'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                  ダッシュボードに戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">学習設定</h3>
                  <div>
                    <Label htmlFor="session-duration">セッション時間（分）</Label>
                    <Input
                      id="session-duration"
                      type="number"
                      min="10"
                      max="120"
                      value={appState.studyTimePerSession}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 30
                        setAppState(prev => ({ ...prev, studyTimePerSession: newValue }))
                        localStorage.setItem('studyTimePerSession', newValue.toString())
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-update">目標スコア</Label>
                    <Input
                      id="target-update"
                      type="number"
                      min={appState.currentToeicScore}
                      max="990"
                      value={appState.targetToeicScore}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 800
                        setAppState(prev => ({ ...prev, targetToeicScore: newValue }))
                        localStorage.setItem('targetToeicScore', newValue.toString())
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">データ管理</h3>
                  <div className="space-y-2">
                    <Button variant="outline" onClick={exportData} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      データをエクスポート
                    </Button>
                    <div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        style={{ display: 'none' }}
                        id="import-file"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('import-file')?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        データをインポート
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t">
                <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                  ダッシュボードに戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* ナビゲーション */}
      {currentView !== 'setup' && currentView !== 'learning' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-around py-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('dashboard')}
                className="flex flex-col items-center gap-1 h-16"
              >
                <Trophy className="h-5 w-5" />
                <span className="text-xs">ホーム</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCurrentView('learning')}
                className="flex flex-col items-center gap-1 h-16"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-xs">学習</span>
              </Button>
              <Button
                variant={currentView === 'statistics' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('statistics')}
                className="flex flex-col items-center gap-1 h-16"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">統計</span>
              </Button>
              <Button
                variant={currentView === 'settings' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('settings')}
                className="flex flex-col items-center gap-1 h-16"
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs">設定</span>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
