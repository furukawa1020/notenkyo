'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, CheckCircle, XCircle, Target, Clock, FileText, Eye } from 'lucide-react'

// リーディング問題の型定義
interface ReadingPassage {
  id: string
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  category: string
  title: string
  passage: string
  wordCount: number
  questions: ReadingQuestion[]
}

interface ReadingQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

interface ReadingLearningProps {
  userLevel: number
  sessionDuration: number
  onComplete: (results: ReadingSessionResults) => void
}

interface ReadingSessionResults {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  pointsEarned: number
  readingSpeed: number // words per minute
  timeSpent: number
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  passagesRead: number
}

// モックリーディング文章データ
const readingPassages: ReadingPassage[] = [
  {
    id: 'reading_basic_001',
    level: 'basic',
    category: 'Business Email',
    title: 'Office Lunch Meeting',
    passage: `Dear Team,

I hope this email finds you well. I would like to invite you to a lunch meeting next Friday at 12:00 PM in the conference room. We will discuss our quarterly sales report and plan for the next quarter.

Please bring your laptops and any relevant documents. Lunch will be provided by the company.

If you cannot attend, please let me know by Wednesday.

Best regards,
Sarah Johnson
Sales Manager`,
    wordCount: 67,
    questions: [
      {
        id: 'rb001_q1',
        question: 'When is the lunch meeting scheduled?',
        options: ['This Friday', 'Next Friday', 'Next Wednesday', 'Next Monday'],
        correctAnswer: 1,
        explanation: '文中に "next Friday at 12:00 PM" と明記されています。',
        points: 10
      },
      {
        id: 'rb001_q2',
        question: 'What should employees bring to the meeting?',
        options: ['Lunch', 'Laptops and documents', 'Sales reports only', 'Nothing'],
        correctAnswer: 1,
        explanation: '"Please bring your laptops and any relevant documents" と書かれています。',
        points: 10
      }
    ]
  },
  {
    id: 'reading_intermediate_001',
    level: 'intermediate',
    category: 'Business Report',
    title: 'Quarterly Performance Analysis',
    passage: `The third quarter results show significant improvement across all departments. Sales revenue increased by 15% compared to the same period last year, while operational costs decreased by 8%. This positive trend can be attributed to several factors including enhanced customer service protocols, streamlined supply chain management, and successful implementation of the new CRM system.

Marketing initiatives launched in July have proven particularly effective, generating a 23% increase in lead generation. The customer retention rate has improved from 78% to 85%, indicating higher satisfaction levels. However, challenges remain in the international markets where currency fluctuations have impacted profit margins.

Moving forward, management recommends focusing on digital transformation initiatives and expanding our presence in emerging markets while maintaining our commitment to quality and customer satisfaction.`,
    wordCount: 134,
    questions: [
      {
        id: 'ri001_q1',
        question: 'What was the percentage increase in sales revenue?',
        options: ['8%', '15%', '23%', '85%'],
        correctAnswer: 1,
        explanation: '"Sales revenue increased by 15%" と記載されています。',
        points: 15
      },
      {
        id: 'ri001_q2',
        question: 'What has impacted profit margins in international markets?',
        options: ['Customer service', 'Currency fluctuations', 'Lead generation', 'CRM system'],
        correctAnswer: 1,
        explanation: '"currency fluctuations have impacted profit margins" とあります。',
        points: 15
      }
    ]
  },
  {
    id: 'reading_advanced_001',
    level: 'advanced',
    category: 'Research Article',
    title: 'Corporate Sustainability Initiatives',
    passage: `Contemporary corporate governance increasingly emphasizes environmental, social, and governance (ESG) principles as fundamental components of long-term business strategy. Organizations that integrate sustainability initiatives into their core operations demonstrate enhanced resilience and adaptability in volatile market conditions.

Research conducted across Fortune 500 companies reveals that enterprises implementing comprehensive ESG frameworks experience 18% higher profitability and 12% lower operational risks compared to traditional business models. This correlation suggests that sustainable practices not only contribute to environmental preservation but also create tangible economic value.

Furthermore, stakeholder engagement has evolved beyond traditional shareholder primacy to encompass broader constituencies including employees, customers, suppliers, and local communities. This paradigm shift necessitates sophisticated measurement systems and transparent reporting mechanisms to ensure accountability and continuous improvement.

The integration of artificial intelligence and data analytics in sustainability monitoring enables real-time assessment of environmental impact and resource optimization, facilitating more informed decision-making processes and strategic planning initiatives.`,
    wordCount: 156,
    questions: [
      {
        id: 'ra001_q1',
        question: 'According to the research, what percentage higher profitability do ESG-implementing companies show?',
        options: ['12%', '15%', '18%', '20%'],
        correctAnswer: 2,
        explanation: '"18% higher profitability" と明記されています。',
        points: 20
      },
      {
        id: 'ra001_q2',
        question: 'What enables real-time assessment of environmental impact?',
        options: ['ESG frameworks', 'Stakeholder engagement', 'AI and data analytics', 'Reporting mechanisms'],
        correctAnswer: 2,
        explanation: '"artificial intelligence and data analytics" が real-time assessment を可能にすると述べられています。',
        points: 20
      }
    ]
  }
]

export default function ReadingLearning({
  userLevel,
  sessionDuration,
  onComplete
}: ReadingLearningProps) {
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [sessionPassages, setSessionPassages] = useState<ReadingPassage[]>([])
  const [passageIndex, setPassageIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [readingStartTime, setReadingStartTime] = useState<Date | null>(null)
  const [sessionActive, setSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60)
  const [readingPhase, setReadingPhase] = useState(true) // true: reading, false: questions
  const [wordsRead, setWordsRead] = useState(0)

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
    const levelPassages = readingPassages.filter(p => p.level === level)
    
    const shuffled = [...levelPassages].sort(() => Math.random() - 0.5)
    const sessionPs = shuffled.slice(0, Math.min(3, shuffled.length))

    setSessionPassages(sessionPs)
    setCurrentPassage(sessionPs[0])
    setPassageIndex(0)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTotalQuestions(sessionPs.reduce((sum, p) => sum + p.questions.length, 0))
    setQuestionsAnswered(0)
    setPointsEarned(0)
    setSessionStartTime(new Date())
    setReadingStartTime(new Date())
    setSessionActive(true)
    setTimeRemaining(sessionDuration * 60)
    setSelectedAnswer('')
    setShowAnswer(false)
    setReadingPhase(true)
    setWordsRead(0)
  }

  // セッション終了
  const endSession = useCallback(() => {
    setSessionActive(false)
    const timeSpent = sessionStartTime 
      ? (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60 
      : sessionDuration

    const results: ReadingSessionResults = {
      totalQuestions: totalQuestions,
      correctAnswers: score,
      accuracy: totalQuestions > 0 ? (score / totalQuestions) * 100 : 0,
      pointsEarned,
      readingSpeed: sessionStartTime ? Math.round(wordsRead / ((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60)) : 0,
      timeSpent,
      level: determineLevel(userLevel),
      passagesRead: passageIndex + 1
    }

    onComplete(results)
  }, [sessionStartTime, sessionDuration, totalQuestions, score, pointsEarned, passageIndex, wordsRead, userLevel, onComplete])

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

  // 文章読了
  const finishReading = () => {
    if (currentPassage) {
      setWordsRead(wordsRead + currentPassage.wordCount)
    }
    setReadingPhase(false)
  }

  // 回答送信
  const submitAnswer = () => {
    if (!currentPassage || selectedAnswer === '') return

    const currentQuestion = currentPassage.questions[currentQuestionIndex]
    const isCorrect = parseInt(selectedAnswer) === currentQuestion.correctAnswer
    
    if (isCorrect) {
      setScore(score + 1)
      setPointsEarned(pointsEarned + currentQuestion.points)
    }

    setQuestionsAnswered(questionsAnswered + 1)
    setShowAnswer(true)
  }

  // 次の問題
  const nextQuestion = () => {
    if (!currentPassage) return

    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      // 同じ文章の次の問題
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowAnswer(false)
    } else {
      // 次の文章へ
      if (passageIndex < sessionPassages.length - 1) {
        const nextIndex = passageIndex + 1
        setPassageIndex(nextIndex)
        setCurrentPassage(sessionPassages[nextIndex])
        setCurrentQuestionIndex(0)
        setSelectedAnswer('')
        setShowAnswer(false)
        setReadingPhase(true)
        setReadingStartTime(new Date())
      } else {
        endSession()
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!sessionActive) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <FileText className="h-6 w-6" />
            TOEICリーディング学習
          </CardTitle>
          <div className="flex flex-col gap-2">
            <Badge variant="outline">
              {determineLevel(userLevel).toUpperCase()}レベル
            </Badge>
            <p className="text-sm text-muted-foreground">
              TOEIC {userLevel}点レベルの長文読解を学習します
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Eye className="h-8 w-8 mx-auto text-blue-500" />
              <p className="text-sm">読解力向上</p>
            </div>
            <div className="space-y-2">
              <Target className="h-8 w-8 mx-auto text-green-500" />
              <p className="text-sm">実戦形式</p>
            </div>
            <div className="space-y-2">
              <Clock className="h-8 w-8 mx-auto text-purple-500" />
              <p className="text-sm">時間管理</p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-lg">
              セッション時間: <strong>{sessionDuration}分</strong>
            </p>
            <Button onClick={startSession} size="lg" className="w-full">
              リーディング学習を開始
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentPassage) return null

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              文章 {passageIndex + 1} / {sessionPassages.length}
            </Badge>
            <Badge variant="secondary">
              {currentPassage.category}
            </Badge>
            {!readingPhase && (
              <Badge variant="default">
                問題 {currentQuestionIndex + 1} / {currentPassage.questions.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        <Progress value={(questionsAnswered / totalQuestions) * 100} />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {readingPhase ? (
          // 文章読解フェーズ
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{currentPassage.title}</h2>
              <Badge variant="outline">
                {currentPassage.wordCount} words
              </Badge>
            </div>
            
            <div className="p-6 bg-muted rounded-lg">
              <div className="whitespace-pre-line text-base leading-relaxed">
                {currentPassage.passage}
              </div>
            </div>

            <div className="text-center">
              <Button onClick={finishReading} size="lg">
                読了 - 問題に進む
              </Button>
            </div>
          </div>
        ) : (
          // 問題解答フェーズ
          <div className="space-y-6">
            {/* 問題表示 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {currentPassage.questions[currentQuestionIndex].question}
              </h3>

              {/* 選択肢 */}
              <RadioGroup 
                value={selectedAnswer} 
                onValueChange={setSelectedAnswer}
                disabled={showAnswer}
              >
                {currentPassage.questions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`}
                      className={showAnswer ? (
                        index === currentPassage.questions[currentQuestionIndex].correctAnswer 
                          ? 'border-green-500 text-green-500' 
                          : index === parseInt(selectedAnswer) && index !== currentPassage.questions[currentQuestionIndex].correctAnswer
                            ? 'border-red-500 text-red-500'
                            : ''
                      ) : ''}
                    />
                    <Label 
                      htmlFor={`option-${index}`}
                      className={`cursor-pointer ${showAnswer ? (
                        index === currentPassage.questions[currentQuestionIndex].correctAnswer 
                          ? 'text-green-600 font-semibold' 
                          : index === parseInt(selectedAnswer) && index !== currentPassage.questions[currentQuestionIndex].correctAnswer
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
                    {parseInt(selectedAnswer) === currentPassage.questions[currentQuestionIndex].correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-semibold">
                      {parseInt(selectedAnswer) === currentPassage.questions[currentQuestionIndex].correctAnswer ? '正解！' : '不正解'}
                    </span>
                  </div>
                  <p className="text-sm">{currentPassage.questions[currentQuestionIndex].explanation}</p>
                </div>
              )}
            </div>

            {/* 文章参照エリア */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">文章を確認:</h4>
              <div className="max-h-40 overflow-y-auto p-3 bg-gray-50 rounded text-sm">
                {currentPassage.passage}
              </div>
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
                  {currentQuestionIndex < currentPassage.questions.length - 1 
                    ? '次の問題' 
                    : passageIndex < sessionPassages.length - 1 
                      ? '次の文章' 
                      : '完了'}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* スコア表示 */}
        <div className="flex justify-center gap-6 text-sm border-t pt-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>正解: {score}/{questionsAnswered}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4 text-blue-500" />
            <span>ポイント: {pointsEarned}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-purple-500" />
            <span>読了語数: {wordsRead}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
