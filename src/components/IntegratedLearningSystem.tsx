'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  BookOpen, 
  Brain, 
  FileText, 
  Headphones, 
  Target, 
  Trophy, 
  Star,
  Clock,
  TrendingUp,
  Award,
  BarChart3
} from 'lucide-react'

// 学習コンポーネントのインポート
import VocabularyLearning from './VocabularyLearning'
import GrammarLearning from './GrammarLearning'
import ReadingLearning from './ReadingLearning'
import ListeningLearning from './ListeningLearning'

// 型定義
interface IntegratedLearningSystemProps {
  userLevel: number // TOEICスコア
  sessionDuration: number // 分
  onComplete: (results: ComprehensiveResults) => void
}

interface ComprehensiveResults {
  vocabulary: VocabularySessionResults | null
  grammar: GrammarSessionResults | null
  reading: ReadingSessionResults | null
  listening: ListeningSessionResults | null
  totalScore: number
  overallAccuracy: number
  timeSpent: number
  completedSections: number
  recommendations: string[]
}

interface VocabularySessionResults {
  totalWords: number
  knownWords: number
  accuracy: number
  pointsEarned: number
  timeSpent: number
  level: string
}

interface GrammarSessionResults {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  pointsEarned: number
  categoriesStudied: string[]
  timeSpent: number
  level: string
}

interface ReadingSessionResults {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  pointsEarned: number
  readingSpeed: number
  timeSpent: number
  level: string
  passagesRead: number
}

interface ListeningSessionResults {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  pointsEarned: number
  timeSpent: number
  level: string
  audiosCompleted: number
  averagePlayCount: number
}

export default function IntegratedLearningSystem({
  userLevel,
  sessionDuration,
  onComplete
}: IntegratedLearningSystemProps) {
  const [currentSection, setCurrentSection] = useState<'overview' | 'vocabulary' | 'grammar' | 'reading' | 'listening'>('overview')
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [results, setResults] = useState<Partial<ComprehensiveResults>>({})
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)

  // レベル判定
  const determineLevel = (score: number): string => {
    if (score < 500) return 'Basic'
    if (score < 700) return 'Intermediate'
    if (score < 850) return 'Advanced'
    return 'Expert'
  }

  // セクション完了処理
  const handleSectionComplete = (section: string, sectionResults: any) => {
    setCompletedSections(prev => new Set(prev).add(section))
    setResults(prev => ({
      ...prev,
      [section]: sectionResults
    }))

    // 全セクション完了チェック
    const newCompletedSections = new Set(completedSections).add(section)
    if (newCompletedSections.size >= 4) {
      completeAllSections()
    } else {
      // 次のセクションを提案
      suggestNextSection(newCompletedSections)
    }
  }

  // 全セクション完了
  const completeAllSections = () => {
    const endTime = new Date()
    const totalTime = sessionStartTime ? (endTime.getTime() - sessionStartTime.getTime()) / 1000 / 60 : 0

    const comprehensiveResults: ComprehensiveResults = {
      vocabulary: results.vocabulary || null,
      grammar: results.grammar || null,
      reading: results.reading || null,
      listening: results.listening || null,
      totalScore: calculateTotalScore(),
      overallAccuracy: calculateOverallAccuracy(),
      timeSpent: totalTime,
      completedSections: completedSections.size,
      recommendations: generateRecommendations()
    }

    onComplete(comprehensiveResults)
  }

  // 総合スコア計算
  const calculateTotalScore = (): number => {
    let totalPoints = 0
    if (results.vocabulary) totalPoints += results.vocabulary.pointsEarned
    if (results.grammar) totalPoints += results.grammar.pointsEarned
    if (results.reading) totalPoints += results.reading.pointsEarned
    if (results.listening) totalPoints += results.listening.pointsEarned
    return totalPoints
  }

  // 総合正答率計算
  const calculateOverallAccuracy = (): number => {
    const accuracies: number[] = []
    if (results.vocabulary && results.vocabulary.accuracy > 0) accuracies.push(results.vocabulary.accuracy)
    if (results.grammar && results.grammar.accuracy > 0) accuracies.push(results.grammar.accuracy)
    if (results.reading && results.reading.accuracy > 0) accuracies.push(results.reading.accuracy)
    if (results.listening && results.listening.accuracy > 0) accuracies.push(results.listening.accuracy)
    
    return accuracies.length > 0 ? accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length : 0
  }

  // 推奨事項生成
  const generateRecommendations = (): string[] => {
    const recommendations: string[] = []
    
    if (results.vocabulary && results.vocabulary.accuracy < 70) {
      recommendations.push('語彙力の強化が必要です。毎日30分の単語学習を継続しましょう。')
    }
    
    if (results.grammar && results.grammar.accuracy < 70) {
      recommendations.push('文法の基礎を復習しましょう。特に時制と受動態に重点を置いてください。')
    }
    
    if (results.reading && results.reading.readingSpeed < 200) {
      recommendations.push('読解速度の向上が必要です。毎日英文記事を読む習慣をつけましょう。')
    }
    
    if (results.listening && results.listening.averagePlayCount > 3) {
      recommendations.push('リスニング力向上のため、英語音声に慣れる練習を増やしましょう。')
    }
    
    const overallAccuracy = calculateOverallAccuracy()
    if (overallAccuracy >= 85) {
      recommendations.push('素晴らしい成績です！この調子で学習を継続してください。')
    } else if (overallAccuracy >= 70) {
      recommendations.push('良い成績です。苦手分野を重点的に学習してさらなる向上を目指しましょう。')
    }
    
    return recommendations
  }

  // 次のセクション提案
  const suggestNextSection = (completed: Set<string>) => {
    const sections = ['vocabulary', 'grammar', 'reading', 'listening']
    const remaining = sections.filter(section => !completed.has(section))
    if (remaining.length > 0) {
      // 最初の未完了セクションを提案（実際にはユーザーの弱点に基づいて選択）
      setCurrentSection(remaining[0] as any)
    }
  }

  // セッション開始
  const startSession = () => {
    setSessionStartTime(new Date())
    setCurrentSection('vocabulary') // 語彙から開始
  }

  // 概要画面
  if (currentSection === 'overview') {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Trophy className="h-8 w-8 text-yellow-500" />
            TOEIC総合学習システム
          </CardTitle>
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              現在のレベル: {determineLevel(userLevel)} ({userLevel}点)
            </Badge>
            <p className="text-muted-foreground">
              4つの技能を統合的に学習して、TOEICスコアを向上させましょう
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* 学習セクション紹介 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-4 text-center hover:shadow-lg transition-shadow">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">語彙学習</h3>
              <p className="text-sm text-muted-foreground">
                12,000語の完全データベースで語彙力を強化
              </p>
            </Card>
            
            <Card className="p-4 text-center hover:shadow-lg transition-shadow">
              <Brain className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">文法学習</h3>
              <p className="text-sm text-muted-foreground">
                基礎から応用まで段階的な文法トレーニング
              </p>
            </Card>
            
            <Card className="p-4 text-center hover:shadow-lg transition-shadow">
              <FileText className="h-12 w-12 mx-auto mb-3 text-purple-500" />
              <h3 className="font-semibold mb-2">読解学習</h3>
              <p className="text-sm text-muted-foreground">
                実戦的な長文読解で理解力と速度を向上
              </p>
            </Card>
            
            <Card className="p-4 text-center hover:shadow-lg transition-shadow">
              <Headphones className="h-12 w-12 mx-auto mb-3 text-red-500" />
              <h3 className="font-semibold mb-2">リスニング学習</h3>
              <p className="text-sm text-muted-foreground">
                実際の音声でリスニング力を強化
              </p>
            </Card>
          </div>

          {/* 学習統計（完了したセクションがある場合） */}
          {completedSections.size > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                学習進捗
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {completedSections.size}/4
                  </div>
                  <div className="text-sm text-muted-foreground">完了セクション</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {calculateTotalScore()}
                  </div>
                  <div className="text-sm text-muted-foreground">総獲得ポイント</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(calculateOverallAccuracy())}%
                  </div>
                  <div className="text-sm text-muted-foreground">総合正答率</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(totalTimeSpent)}
                  </div>
                  <div className="text-sm text-muted-foreground">学習時間(分)</div>
                </div>
              </div>
              <Progress value={(completedSections.size / 4) * 100} className="h-3" />
            </div>
          )}

          {/* 学習開始/継続ボタン */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              <span>推奨学習時間: <strong>{sessionDuration}分</strong></span>
            </div>
            
            {completedSections.size === 0 ? (
              <Button onClick={startSession} size="lg" className="w-full max-w-md">
                <Star className="h-5 w-5 mr-2" />
                総合学習を開始
              </Button>
            ) : completedSections.size < 4 ? (
              <div className="space-y-2">
                <Button 
                  onClick={() => suggestNextSection(completedSections)} 
                  size="lg" 
                  className="w-full max-w-md"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  学習を継続
                </Button>
                <p className="text-sm text-muted-foreground">
                  残り{4 - completedSections.size}セクション
                </p>
              </div>
            ) : (
              <Alert>
                <Award className="h-4 w-4" />
                <AlertTitle>全セクション完了！</AlertTitle>
                <AlertDescription>
                  素晴らしい！全ての学習セクションを完了しました。詳細な結果を確認しましょう。
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* セクション個別選択 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-center">個別セクション選択</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentSection('vocabulary')}
                className="h-16 flex flex-col gap-1"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">語彙</span>
                {completedSections.has('vocabulary') && <Badge variant="secondary" className="text-xs">完了</Badge>}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentSection('grammar')}
                className="h-16 flex flex-col gap-1"
              >
                <Brain className="h-5 w-5" />
                <span className="text-sm">文法</span>
                {completedSections.has('grammar') && <Badge variant="secondary" className="text-xs">完了</Badge>}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentSection('reading')}
                className="h-16 flex flex-col gap-1"
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm">読解</span>
                {completedSections.has('reading') && <Badge variant="secondary" className="text-xs">完了</Badge>}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentSection('listening')}
                className="h-16 flex flex-col gap-1"
              >
                <Headphones className="h-5 w-5" />
                <span className="text-sm">リスニング</span>
                {completedSections.has('listening') && <Badge variant="secondary" className="text-xs">完了</Badge>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 各学習セクション
  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* 進捗ヘッダー */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentSection('overview')}
                size="sm"
              >
                ← 戻る
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {completedSections.size}/4 完了
                </Badge>
                <Progress value={(completedSections.size / 4) * 100} className="w-32" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {determineLevel(userLevel)}レベル | {userLevel}点
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 現在のセクション */}
      {currentSection === 'vocabulary' && (
        <VocabularyLearning
          userLevel={userLevel}
          sessionDuration={sessionDuration}
          onComplete={(results) => handleSectionComplete('vocabulary', results)}
        />
      )}
      
      {currentSection === 'grammar' && (
        <GrammarLearning
          userLevel={userLevel}
          sessionDuration={sessionDuration}
          onComplete={(results) => handleSectionComplete('grammar', results)}
        />
      )}
      
      {currentSection === 'reading' && (
        <ReadingLearning
          userLevel={userLevel}
          sessionDuration={sessionDuration}
          onComplete={(results) => handleSectionComplete('reading', results)}
        />
      )}
      
      {currentSection === 'listening' && (
        <ListeningLearning
          userLevel={userLevel}
          sessionDuration={sessionDuration}
          onComplete={(results) => handleSectionComplete('listening', results)}
        />
      )}
    </div>
  )
}
