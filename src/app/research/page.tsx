'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Brain,
  FileText,
  Shield,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { 
  exportAnonymizedData, 
  getKPIHistory, 
  getStudyProgress, 
  clearAllData 
} from '@/lib/storage'

interface ResearchData {
  totalSessions: number
  averageAccuracy: number
  averageStudyTime: number
  streakDays: number
  noutenkyoScoreCorrelation: number
  improvementRate: number
  retentionRate: number
}

export default function ResearchPage() {
  const [researchData, setResearchData] = useState<ResearchData>({
    totalSessions: 0,
    averageAccuracy: 0,
    averageStudyTime: 0,
    streakDays: 0,
    noutenkyoScoreCorrelation: 0,
    improvementRate: 0,
    retentionRate: 0
  })
  const [exportData, setExportData] = useState('')
  const [showExportData, setShowExportData] = useState(false)
  const [researchConsent, setResearchConsent] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [studyProgress, setStudyProgress] = useState({
    vocabularyLevel: 0,
    grammarLevel: 0,
    listeningLevel: 0,
    readingLevel: 0,
    totalStudyTime: 0,
    streakDays: 0
  })

  useEffect(() => {
    loadResearchData()
    getStudyProgress().then(setStudyProgress)
  }, [])

  const loadResearchData = async () => {
    try {
      const kpiHistory = await getKPIHistory(30)
      const progress = await getStudyProgress()
      
      // 研究データの計算
      const totalSessions = kpiHistory.length
      const averageAccuracy = kpiHistory.length > 0 
        ? kpiHistory.reduce((sum, kpi) => sum + kpi.accuracy, 0) / kpiHistory.length 
        : 0
      
      const averageStudyTime = kpiHistory.length > 0
        ? kpiHistory.reduce((sum, kpi) => sum + kpi.studyTime, 0) / kpiHistory.length
        : 0
      
      // のうてんきょスコアと学習効果の相関（簡易計算）
      const noutenkyoScoreCorrelation = kpiHistory.length > 1
        ? calculateCorrelation(
            kpiHistory.map(kpi => kpi.noutenkyoScore),
            kpiHistory.map(kpi => kpi.accuracy)
          )
        : 0
      
      // 改善率の計算（最初の1週間vs最後の1週間）
      const firstWeek = kpiHistory.slice(0, 7)
      const lastWeek = kpiHistory.slice(-7)
      const improvementRate = firstWeek.length > 0 && lastWeek.length > 0
        ? ((lastWeek.reduce((sum, kpi) => sum + kpi.accuracy, 0) / lastWeek.length) -
           (firstWeek.reduce((sum, kpi) => sum + kpi.accuracy, 0) / firstWeek.length)) / 
          (firstWeek.reduce((sum, kpi) => sum + kpi.accuracy, 0) / firstWeek.length) * 100
        : 0
      
      // 学習継続率（連続学習日数）
      const streakDays = progress.streakDays
      const retentionRate = Math.min((streakDays / 30) * 100, 100)
      
      setResearchData({
        totalSessions,
        averageAccuracy,
        averageStudyTime,
        streakDays,
        noutenkyoScoreCorrelation,
        improvementRate,
        retentionRate
      })
    } catch (error) {
      console.error('研究データの読み込みエラー:', error)
    }
  }

  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = Math.min(x.length, y.length)
    if (n < 2) return 0
    
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0)
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0)
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0)
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0)
    
    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
    
    return denominator === 0 ? 0 : numerator / denominator
  }

  const handleExportData = async () => {
    if (!researchConsent) {
      alert('研究利用への同意が必要です')
      return
    }
    
    setIsExporting(true)
    try {
      const data = await exportAnonymizedData()
      setExportData(data)
      setShowExportData(true)
      
      // ファイルダウンロード
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `noutenkyo-research-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('データエクスポートエラー:', error)
      alert('データのエクスポートに失敗しました')
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearAllData = async () => {
    if (confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
      try {
        await clearAllData()
        alert('すべてのデータが削除されました')
        setResearchData({
          totalSessions: 0,
          averageAccuracy: 0,
          averageStudyTime: 0,
          streakDays: 0,
          noutenkyoScoreCorrelation: 0,
          improvementRate: 0,
          retentionRate: 0
        })
        setStudyProgress({
          vocabularyLevel: 0,
          grammarLevel: 0,
          listeningLevel: 0,
          readingLevel: 0,
          totalStudyTime: 0,
          streakDays: 0
        })
      } catch (error) {
        console.error('データ削除エラー:', error)
        alert('データの削除に失敗しました')
      }
    }
  }

  const getCorrelationDescription = (correlation: number): string => {
    const abs = Math.abs(correlation)
    if (abs >= 0.7) return '強い相関'
    if (abs >= 0.5) return '中程度の相関'
    if (abs >= 0.3) return '弱い相関'
    return 'ほぼ無相関'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
            研究データ分析
          </h1>
          <p className="text-gray-600">
            ADHD・うつ傾向ユーザーの学習効果に関する研究データの分析と提供
          </p>
        </div>

        {/* 研究データ同意 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              研究データ利用について
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">研究目的とプライバシー保護</h3>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• ADHD・うつ傾向のある方の学習効果を研究し、より良い学習アプリの開発に活用</li>
                    <li>• 個人を特定できる情報は一切含まれません（完全匿名化）</li>
                    <li>• 学習パフォーマンス、のうてんきょスコア、セッション時間などの統計データのみ</li>
                    <li>• データはJSON形式でエクスポートされ、いつでもダウンロード可能</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="research-consent"
                checked={researchConsent}
                onChange={(e) => setResearchConsent(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="research-consent" className="text-sm">
                研究目的でのデータ利用に同意します（匿名化済みデータのみ）
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 学習統計ダッシュボード */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総学習セッション</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-2xl font-bold">{researchData.totalSessions}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">平均正答率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-2xl font-bold">{researchData.averageAccuracy.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">平均学習時間</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-purple-600" />
                <span className="text-2xl font-bold">{researchData.averageStudyTime.toFixed(0)}分</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">連続学習日数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-2 text-orange-600" />
                <span className="text-2xl font-bold">{researchData.streakDays}日</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 詳細分析 */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>のうてんきょスコアと学習効果の相関</CardTitle>
              <CardDescription>
                体調・気分と学習パフォーマンスの関係性
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-blue-600">
                  {researchData.noutenkyoScoreCorrelation.toFixed(3)}
                </div>
                <Badge variant={Math.abs(researchData.noutenkyoScoreCorrelation) >= 0.5 ? 'default' : 'secondary'}>
                  {getCorrelationDescription(researchData.noutenkyoScoreCorrelation)}
                </Badge>
                <p className="text-sm text-gray-600">
                  相関係数が正の値の場合、体調が良いほど学習効果が高いことを示します。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>学習進捗状況</CardTitle>
              <CardDescription>
                各分野での習熟度
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>語彙</span>
                  <span>{studyProgress.vocabularyLevel}%</span>
                </div>
                <Progress value={studyProgress.vocabularyLevel} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>文法</span>
                  <span>{studyProgress.grammarLevel}%</span>
                </div>
                <Progress value={studyProgress.grammarLevel} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>リスニング</span>
                  <span>{studyProgress.listeningLevel}%</span>
                </div>
                <Progress value={studyProgress.listeningLevel} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>リーディング</span>
                  <span>{studyProgress.readingLevel}%</span>
                </div>
                <Progress value={studyProgress.readingLevel} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 改善率と継続率 */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>学習改善率</CardTitle>
              <CardDescription>
                初期1週間と最近1週間の比較
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {researchData.improvementRate > 0 ? '+' : ''}{researchData.improvementRate.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {researchData.improvementRate > 0 ? '向上' : '横ばい'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>学習継続率</CardTitle>
              <CardDescription>
                30日間での継続度合い
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-purple-600">
                  {researchData.retentionRate.toFixed(1)}%
                </div>
                <Progress value={researchData.retentionRate} />
                <p className="text-sm text-gray-600">
                  継続学習による習慣化の成功度
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* データエクスポート */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              研究データエクスポート
            </CardTitle>
            <CardDescription>
              匿名化された学習データを研究目的で提供
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleExportData}
                disabled={!researchConsent || isExporting}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'エクスポート中...' : 'データをエクスポート'}
              </Button>
              
              <Button 
                onClick={handleClearAllData}
                variant="destructive"
              >
                すべてのデータを削除
              </Button>
            </div>

            {showExportData && (
              <div className="space-y-2">
                <h4 className="font-semibold">エクスポートされたデータ（プレビュー）</h4>
                <Textarea
                  value={exportData.slice(0, 500) + '...'}
                  readOnly
                  rows={10}
                  className="font-mono text-xs"
                />
                <p className="text-sm text-gray-600">
                  ファイルがダウンロードされました。このデータは完全に匿名化されており、
                  個人を特定する情報は含まれていません。
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 研究への貢献 */}
        <Card>
          <CardHeader>
            <CardTitle>研究への貢献</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">あなたのデータが社会に貢献します</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">期待される研究成果：</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• ADHD特性に最適化された学習メソッドの開発</li>
                    <li>• 体調と学習効果の関係性の科学的解明</li>
                    <li>• より効果的な学習アプリの設計指針</li>
                    <li>• 神経多様性への理解促進</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">データの活用方法：</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 学術論文での統計分析</li>
                    <li>• 機械学習モデルの訓練データ</li>
                    <li>• アプリ改善のための分析</li>
                    <li>• 他の支援技術開発への知見提供</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
