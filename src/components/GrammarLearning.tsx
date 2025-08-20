'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BookOpen, CheckCircle, XCircle, Target, Brain, Clock } from 'lucide-react'

// 文法問題の型定義
interface GrammarQuestion {
  id: string
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  category: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

interface GrammarLearningProps {
  userLevel: number
  sessionDuration: number
  onComplete: (results: GrammarSessionResults) => void
}

interface GrammarSessionResults {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  pointsEarned: number
  categoriesStudied: string[]
  timeSpent: number
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
}

// モック文法問題データ
const grammarQuestions: GrammarQuestion[] = [
  {
    id: 'grammar_basic_001',
    level: 'basic',
    category: 'Present Tense',
    question: 'She _____ to work every day.',
    options: ['go', 'goes', 'going', 'went'],
    correctAnswer: 1,
    explanation: '三人称単数現在形では動詞に -s をつけます。',
    points: 10
  },
  {
    id: 'grammar_basic_002',
    level: 'basic',
    category: 'Articles',
    question: 'I need _____ apple for the recipe.',
    options: ['a', 'an', 'the', ''],
    correctAnswer: 1,
    explanation: 'apple は母音で始まるので "an" を使います。',
    points: 10
  },
  {
    id: 'grammar_intermediate_001',
    level: 'intermediate',
    category: 'Perfect Tense',
    question: 'I _____ this book before.',
    options: ['read', 'have read', 'had read', 'was reading'],
    correctAnswer: 1,
    explanation: '現在完了形を使って経験を表します。',
    points: 15
  },
  {
    id: 'grammar_intermediate_002',
    level: 'intermediate',
    category: 'Passive Voice',
    question: 'The report _____ by the team yesterday.',
    options: ['completed', 'was completed', 'has completed', 'completes'],
    correctAnswer: 1,
    explanation: '受動態の過去形です。',
    points: 15
  },
  {
    id: 'grammar_advanced_001',
    level: 'advanced',
    category: 'Subjunctive',
    question: 'I wish I _____ more time to study.',
    options: ['have', 'had', 'will have', 'would have'],
    correctAnswer: 1,
    explanation: '仮定法過去では過去形を使います。',
    points: 20
  },
  {
    id: 'grammar_expert_001',
    level: 'expert',
    category: 'Complex Conditional',
    question: 'Had I known about the meeting, I _____ attended.',
    options: ['would', 'would have', 'will have', 'had'],
    correctAnswer: 1,
    explanation: '仮定法過去完了の帰結節では "would have + 過去分詞" を使います。',
    points: 25
  }
]

export default function GrammarLearning({
  userLevel,
  sessionDuration,
  onComplete
}: GrammarLearningProps) {
  const [currentQuestion, setCurrentQuestion] = useState<GrammarQuestion | null>(null)
  const [sessionQuestions, setSessionQuestions] = useState<GrammarQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [categoriesStudied, setCategoriesStudied] = useState<string[]>([])
  const [sessionActive, setSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60)

  // TOEIC スコアからレベルを決定
  const determineLevel = (score: number): 'basic' | 'intermediate' | 'advanced' | 'expert' => {
    if (score < 500) return 'basic'
    if (score < 700) return 'intermediate'
    if (score < 850) return 'advanced'
    return 'expert'
  }

  // セッション開始
  const startSession = () => {
    const level = determineLevel(userLevel)
    // レベルに応じた問題をフィルタリング
    const levelQuestions = grammarQuestions.filter(q => q.level === level)
    
    // 問題をシャッフルして選択
    const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5)
    const sessionQs = shuffled.slice(0, Math.min(20, shuffled.length))

    setSessionQuestions(sessionQs)
    setCurrentQuestion(sessionQs[0])
    setCurrentIndex(0)
    setScore(0)
    setPointsEarned(0)
    setCategoriesStudied([])
    setSessionStartTime(new Date())
    setSessionActive(true)
    setTimeRemaining(sessionDuration * 60)
    setSelectedAnswer('')
    setShowAnswer(false)
  }

  // セッション終了
  const endSession = useCallback(() => {
    setSessionActive(false)
    const timeSpent = sessionStartTime 
      ? (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60 
      : sessionDuration

    const results: GrammarSessionResults = {
      totalQuestions: currentIndex + 1,
      correctAnswers: score,
      accuracy: (score / Math.max(currentIndex + 1, 1)) * 100,
      pointsEarned,
      categoriesStudied,
      timeSpent,
      level: determineLevel(userLevel)
    }

    onComplete(results)
  }, [sessionStartTime, sessionDuration, currentIndex, score, pointsEarned, categoriesStudied, userLevel, onComplete])

  // タイマー
  useEffect(() => {
    if (sessionActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining <= 0 && sessionActive) {
      endSession()
    }
  }, [sessionActive, timeRemaining, endSession])

  // 回答送信
  const submitAnswer = () => {
    if (!currentQuestion || selectedAnswer === '') return

    const isCorrect = parseInt(selectedAnswer) === currentQuestion.correctAnswer
    
    if (isCorrect) {
      setScore(score + 1)
      setPointsEarned(pointsEarned + currentQuestion.points)
    }

    // カテゴリーを追加
    if (!categoriesStudied.includes(currentQuestion.category)) {
      setCategoriesStudied([...categoriesStudied, currentQuestion.category])
    }

    setShowAnswer(true)
  }

  // 次の問題
  const nextQuestion = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentQuestion(sessionQuestions[nextIndex])
      setSelectedAnswer('')
      setShowAnswer(false)
    } else {
      endSession()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!sessionActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6" />
            TOEIC文法学習
          </CardTitle>
          <div className="flex flex-col gap-2">
            <Badge variant="outline">
              {determineLevel(userLevel).toUpperCase()}レベル
            </Badge>
            <p className="text-sm text-muted-foreground">
              TOEIC {userLevel}点レベルの文法を学習します
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-2">
              <Brain className="h-8 w-8 mx-auto text-blue-500" />
              <p className="text-sm">段階別文法</p>
            </div>
            <div className="space-y-2">
              <Target className="h-8 w-8 mx-auto text-green-500" />
              <p className="text-sm">実戦形式</p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-lg">
              セッション時間: <strong>{sessionDuration}分</strong>
            </p>
            <Button onClick={startSession} size="lg" className="w-full">
              文法学習を開始
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentQuestion) return null

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentIndex + 1} / {sessionQuestions.length}
            </Badge>
            <Badge variant="secondary">
              {currentQuestion.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        <Progress value={(currentIndex / sessionQuestions.length) * 100} />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 問題表示 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {currentQuestion.question}
          </h2>

          {/* 選択肢 */}
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={setSelectedAnswer}
            disabled={showAnswer}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`option-${index}`}
                  className={showAnswer ? (
                    index === currentQuestion.correctAnswer 
                      ? 'border-green-500 text-green-500' 
                      : index === parseInt(selectedAnswer) && index !== currentQuestion.correctAnswer
                        ? 'border-red-500 text-red-500'
                        : ''
                  ) : ''}
                />
                <Label 
                  htmlFor={`option-${index}`}
                  className={`cursor-pointer ${showAnswer ? (
                    index === currentQuestion.correctAnswer 
                      ? 'text-green-600 font-semibold' 
                      : index === parseInt(selectedAnswer) && index !== currentQuestion.correctAnswer
                        ? 'text-red-600'
                        : ''
                  ) : ''}`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* 解説表示 */}
          {showAnswer && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                {parseInt(selectedAnswer) === currentQuestion.correctAnswer ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-semibold">
                  {parseInt(selectedAnswer) === currentQuestion.correctAnswer ? '正解！' : '不正解'}
                </span>
              </div>
              <p className="text-sm">{currentQuestion.explanation}</p>
              <div className="text-xs text-muted-foreground">
                獲得ポイント: {parseInt(selectedAnswer) === currentQuestion.correctAnswer ? currentQuestion.points : 0}
              </div>
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="flex gap-4">
          {!showAnswer ? (
            <Button 
              onClick={submitAnswer} 
              disabled={selectedAnswer === ''}
              className="w-full"
            >
              回答する
            </Button>
          ) : (
            <Button onClick={nextQuestion} className="w-full">
              {currentIndex < sessionQuestions.length - 1 ? '次の問題' : '完了'}
            </Button>
          )}
        </div>

        {/* スコア表示 */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>正解: {score}/{currentIndex + (showAnswer ? 1 : 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4 text-blue-500" />
            <span>ポイント: {pointsEarned}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
