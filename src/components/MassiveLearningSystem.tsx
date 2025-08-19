// 大規模TOEIC学習システム統合コンポーネント
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { massiveLearningEngine, AdaptiveLearningParams, LearningProgress } from '@/lib/massive-learning-engine'
import { Task, NotenkyoScore } from '@/lib/types'
import { BookOpen, Brain, Headphones, FileText, TrendingUp, Target, Award, Clock } from 'lucide-react'

interface MassiveLearningSystemProps {
  userLevel: number // estimated TOEIC score
  noutenkyoScore: NotenkyoScore
  timeAvailable: number // minutes
  onTaskComplete: (task: Task, score: number) => void
}

export default function MassiveLearningSystem({
  userLevel,
  noutenkyoScore,
  timeAvailable,
  onTaskComplete
}: MassiveLearningSystemProps) {
  const [learningTasks, setLearningTasks] = useState<Task[]>([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [sessionProgress, setSessionProgress] = useState(0)
  const [learningProgress, setLearningProgress] = useState<LearningProgress | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)

  // 学習セッションを開始
  const startLearningSession = async () => {
    setIsLoading(true)
    
    const adaptiveParams: AdaptiveLearningParams = {
      userLevel,
      noutenkyoScore,
      previousPerformance: [0.8, 0.7, 0.9, 0.6, 0.8], // 模擬データ
      timeAvailable,
      weakAreas: identifyWeakAreas()
    }

    try {
      const tasks = massiveLearningEngine.generateAdaptiveLearningSession(adaptiveParams)
      setLearningTasks(tasks)
      setCurrentTaskIndex(0)
      setSessionProgress(0)
      setSessionActive(true)
    } catch (error) {
      console.error('Failed to generate learning session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 弱点分野を特定（簡易版）
  const identifyWeakAreas = (): string[] => {
    const weakAreas: string[] = []
    
    // のうてんきょスコアに基づく弱点判定
    if (noutenkyoScore.focus < 5) weakAreas.push('vocabulary')
    if (noutenkyoScore.energy < 5) weakAreas.push('grammar')
    if (noutenkyoScore.mood < 5) weakAreas.push('listening')
    
    return weakAreas
  }

  // タスク完了処理
  const handleTaskComplete = (score: number) => {
    const currentTask = learningTasks[currentTaskIndex]
    if (currentTask) {
      onTaskComplete(currentTask, score)
      
      // 次のタスクに移動
      if (currentTaskIndex < learningTasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1)
        setSessionProgress(((currentTaskIndex + 1) / learningTasks.length) * 100)
      } else {
        // セッション完了
        completeSession()
      }
    }
  }

  // セッション完了処理
  const completeSession = () => {
    setSessionActive(false)
    setSessionProgress(100)
    // 学習進捗を更新
    updateLearningProgress()
  }

  // 学習進捗更新
  const updateLearningProgress = () => {
    // 実際の実装では、完了したタスクに基づいて進捗を計算
    const newProgress: LearningProgress = {
      userId: 'current-user',
      totalVocabularyLearned: (learningProgress?.totalVocabularyLearned || 0) + 
        learningTasks.filter(t => t.type === 'vocabulary').length,
      totalGrammarMastered: (learningProgress?.totalGrammarMastered || 0) + 
        learningTasks.filter(t => t.type === 'grammar').length,
      totalListeningCompleted: (learningProgress?.totalListeningCompleted || 0) + 
        learningTasks.filter(t => t.type === 'listening').length,
      totalReadingCompleted: (learningProgress?.totalReadingCompleted || 0) + 
        learningTasks.filter(t => t.type === 'reading').length,
      estimatedTOEICScore: massiveLearningEngine.calculateEstimatedTOEICScore(learningProgress || {
        userId: 'current-user',
        totalVocabularyLearned: 0,
        totalGrammarMastered: 0,
        totalListeningCompleted: 0,
        totalReadingCompleted: 0,
        estimatedTOEICScore: userLevel,
        weakAreas: [],
        strongAreas: [],
        lastUpdated: new Date(),
        studyStreak: 0,
        totalStudyTime: 0
      }),
      weakAreas: identifyWeakAreas(),
      strongAreas: ['business-vocabulary'], // 簡易実装
      lastUpdated: new Date(),
      studyStreak: (learningProgress?.studyStreak || 0) + 1,
      totalStudyTime: (learningProgress?.totalStudyTime || 0) + timeAvailable
    }
    
    setLearningProgress(newProgress)
  }

  // コンポーネント初期化
  useEffect(() => {
    // 既存の学習進捗を読み込み
    const savedProgress = localStorage.getItem('learningProgress')
    if (savedProgress) {
      setLearningProgress(JSON.parse(savedProgress))
    }
  }, [])

  // 学習進捗の保存
  useEffect(() => {
    if (learningProgress) {
      localStorage.setItem('learningProgress', JSON.stringify(learningProgress))
    }
  }, [learningProgress])

  const currentTask = learningTasks[currentTaskIndex]
  const progressPercentage = learningTasks.length > 0 ? (currentTaskIndex / learningTasks.length) * 100 : 0

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* ヘッダー情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            大規模TOEIC学習システム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userLevel}</div>
              <div className="text-sm text-gray-600">推定スコア</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{timeAvailable}分</div>
              <div className="text-sm text-gray-600">学習時間</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{noutenkyoScore.total}</div>
              <div className="text-sm text-gray-600">のうてんきょ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {learningProgress?.estimatedTOEICScore || userLevel}
              </div>
              <div className="text-sm text-gray-600">目標スコア</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 学習進捗表示 */}
      {learningProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              学習進捗
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">単語</span>
                </div>
                <div className="text-xl font-bold">{learningProgress.totalVocabularyLearned}</div>
                <Progress value={Math.min(100, (learningProgress.totalVocabularyLearned / 12000) * 100)} className="mt-1" />
                <div className="text-xs text-gray-500 mt-1">/ 12,000語</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">文法</span>
                </div>
                <div className="text-xl font-bold">{learningProgress.totalGrammarMastered}</div>
                <Progress value={Math.min(100, (learningProgress.totalGrammarMastered / 2000) * 100)} className="mt-1" />
                <div className="text-xs text-gray-500 mt-1">/ 2,000問</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Headphones className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">リスニング</span>
                </div>
                <div className="text-xl font-bold">{learningProgress.totalListeningCompleted}</div>
                <Progress value={Math.min(100, (learningProgress.totalListeningCompleted / 600) * 100)} className="mt-1" />
                <div className="text-xs text-gray-500 mt-1">/ 600問</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">リーディング</span>
                </div>
                <div className="text-xl font-bold">{learningProgress.totalReadingCompleted}</div>
                <Progress value={Math.min(100, (learningProgress.totalReadingCompleted / 900) * 100)} className="mt-1" />
                <div className="text-xs text-gray-500 mt-1">/ 900問</div>
              </div>
            </div>
            
            {/* 弱点・強化分野 */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm font-medium">弱点分野:</span>
              {learningProgress.weakAreas.map((area, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {area}
                </Badge>
              ))}
              <span className="text-sm font-medium ml-4">強化分野:</span>
              {learningProgress.strongAreas.map((area, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 学習セッション制御 */}
      {!sessionActive ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">AI適応型学習セッションを開始</h3>
              <p className="text-gray-600">
                あなたののうてんきょスコアとレベルに基づいて最適化された学習を提供します
              </p>
              <Button 
                onClick={startLearningSession} 
                disabled={isLoading}
                className="px-8 py-2"
              >
                {isLoading ? '学習セッション準備中...' : '学習開始'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>学習セッション進行中</span>
              <Badge variant="outline">
                {currentTaskIndex + 1} / {learningTasks.length}
              </Badge>
            </CardTitle>
            <Progress value={progressPercentage} className="mt-2" />
          </CardHeader>
          <CardContent>
            {currentTask && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {currentTask.type === 'vocabulary' && <BookOpen className="h-5 w-5 text-blue-500" />}
                  {currentTask.type === 'grammar' && <Brain className="h-5 w-5 text-green-500" />}
                  {currentTask.type === 'listening' && <Headphones className="h-5 w-5 text-purple-500" />}
                  {currentTask.type === 'reading' && <FileText className="h-5 w-5 text-orange-500" />}
                  <h4 className="font-semibold">{currentTask.title}</h4>
                </div>
                
                <p className="text-gray-700">{currentTask.description}</p>
                
                {/* 実際の問題表示エリア */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">
                    この領域に実際の学習コンテンツが表示されます
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">推定時間: {currentTask.lengthMinutes}分</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentTask.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleTaskComplete(0.8)} 
                    variant="outline"
                    className="flex-1"
                  >
                    完了（デモ）
                  </Button>
                  <Button 
                    onClick={() => handleTaskComplete(0.6)} 
                    variant="secondary"
                  >
                    スキップ
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* セッション完了時の表示 */}
      {sessionProgress === 100 && !sessionActive && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Award className="h-16 w-16 text-yellow-500 mx-auto" />
              <h3 className="text-xl font-semibold">学習セッション完了！</h3>
              <p className="text-gray-600">
                お疲れさまでした。今日の学習が完了しました。
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={startLearningSession} variant="outline">
                  新しいセッション
                </Button>
                <Button onClick={() => setSessionProgress(0)}>
                  結果を確認
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
