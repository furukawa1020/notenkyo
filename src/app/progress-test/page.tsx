'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Brain, 
  BookOpen,
  Headphones,
  FileText,
  BarChart3,
  RefreshCw,
  Database
} from 'lucide-react'
import { 
  getStudyProgress, 
  getAllStudySessions, 
  calculateKPIs,
  recordSession,
  saveStudyProgress 
} from '@/lib/storage'

export default function ProgressTestPage() {
  const [studyProgress, setStudyProgress] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [kpis, setKpis] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [testRecordSaved, setTestRecordSaved] = useState(false)

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      setIsLoading(true)
      
      // 学習進捗の取得
      const progress = await getStudyProgress()
      setStudyProgress(progress)
      
      // セッションデータの取得
      const allSessions = await getAllStudySessions()
      setSessions(allSessions || [])
      
      // KPIの計算
      const calculatedKPIs = await calculateKPIs()
      setKpis(calculatedKPIs)
      
      console.log('進捗データ:', { progress, sessions: allSessions, kpis: calculatedKPIs })
    } catch (error) {
      console.error('進捗データの読み込みエラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTestRecord = async () => {
    try {
      // テスト用のセッションデータを保存
      await recordSession({
        taskId: `test-session-${Date.now()}`,
        startTime: new Date(Date.now() - 600000), // 10分前
        endTime: new Date(),
        score: 85,
        correctAnswers: 17,
        totalQuestions: 20,
        studyType: 'vocabulary'
      })

      // テスト用の進捗データを保存
      const currentProgress = await getStudyProgress()
      await saveStudyProgress({
        ...currentProgress,
        vocabularyLevel: Math.min(currentProgress.vocabularyLevel + 5, 100),
        totalStudyTime: currentProgress.totalStudyTime + 10,
        streakDays: currentProgress.streakDays + (Math.random() > 0.5 ? 1 : 0)
      })

      setTestRecordSaved(true)
      await loadProgressData() // データを再読み込み
    } catch (error) {
      console.error('テストデータの保存エラー:', error)
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
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">進捗テストページ</h1>
          <p className="text-gray-600 mt-1">実際の進捗データの確認と動作テスト</p>
        </div>
        <div className="space-x-2">
          <Button onClick={loadProgressData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            データ再読み込み
          </Button>
          <Button onClick={saveTestRecord} className="bg-green-600 hover:bg-green-700">
            <Database className="h-4 w-4 mr-2" />
            テストデータ保存
          </Button>
        </div>
      </div>

      {testRecordSaved && (
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-green-700 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              テストデータが正常に保存されました！
            </p>
          </CardContent>
        </Card>
      )}

      {/* 現在の学習進捗 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span>現在の学習進捗</span>
          </CardTitle>
          <CardDescription>
            IndexedDBから取得した実際の進捗データ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studyProgress ? (
            <div className="space-y-6">
              {/* 各分野の進捗 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                      単語学習
                    </span>
                    <span className="font-medium">{studyProgress.vocabularyLevel}%</span>
                  </div>
                  <Progress value={studyProgress.vocabularyLevel} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-green-600" />
                      文法学習
                    </span>
                    <span className="font-medium">{studyProgress.grammarLevel}%</span>
                  </div>
                  <Progress value={studyProgress.grammarLevel} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Headphones className="h-4 w-4 mr-2 text-purple-600" />
                      リスニング
                    </span>
                    <span className="font-medium">{studyProgress.listeningLevel}%</span>
                  </div>
                  <Progress value={studyProgress.listeningLevel} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-orange-600" />
                      リーディング
                    </span>
                    <span className="font-medium">{studyProgress.readingLevel}%</span>
                  </div>
                  <Progress value={studyProgress.readingLevel} className="h-2" />
                </div>
              </div>

              {/* 総合統計 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{studyProgress.totalStudyTime}</div>
                  <div className="text-sm text-gray-500">総学習時間（分）</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{studyProgress.streakDays}</div>
                  <div className="text-sm text-gray-500">継続日数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((studyProgress.vocabularyLevel + studyProgress.grammarLevel + studyProgress.listeningLevel + studyProgress.readingLevel) / 4)}
                  </div>
                  <div className="text-sm text-gray-500">平均進捗率（%）</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">進捗データがありません</p>
          )}
        </CardContent>
      </Card>

      {/* 学習セッション履歴 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-green-600" />
            <span>学習セッション履歴</span>
          </CardTitle>
          <CardDescription>
            保存された学習セッションデータ（最新10件）
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(-10).reverse().map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{session.studyType}</Badge>
                    <span className="text-sm font-medium">{session.taskId}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {session.score && (
                      <span>スコア: {Math.round(session.score)}%</span>
                    )}
                    {session.correctAnswers && session.totalQuestions && (
                      <span>正答: {session.correctAnswers}/{session.totalQuestions}</span>
                    )}
                    <span>{session.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">学習セッションデータがありません</p>
          )}
        </CardContent>
      </Card>

      {/* KPI データ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-purple-600" />
            <span>KPI データ</span>
          </CardTitle>
          <CardDescription>
            計算されたパフォーマンス指標
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(kpis).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(kpis).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-800">
                    {typeof value === 'number' ? value.toFixed(1) : String(value)}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">KPIデータがありません</p>
          )}
        </CardContent>
      </Card>

      {/* デバッグ情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-gray-600" />
            <span>デバッグ情報</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>セッション数: {sessions.length}</div>
            <div>進捗データ有無: {studyProgress ? '✅ あり' : '❌ なし'}</div>
            <div>IndexedDB接続: {typeof indexedDB !== 'undefined' ? '✅ 利用可能' : '❌ 利用不可'}</div>
            <div>現在時刻: {new Date().toLocaleString('ja-JP')}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
