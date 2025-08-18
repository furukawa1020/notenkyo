'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Clock, FileText, Check, X, HelpCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { recordSession, getStudyProgress, saveStudyProgress } from '@/lib/storage'

interface ReadingPassage {
  id: string
  title: string
  level: 'basic' | 'intermediate' | 'advanced'
  type: 'email' | 'article' | 'memo' | 'advertisement' | 'report'
  timeLimit: number // minutes
  passage: string
  questions: ReadingQuestion[]
}

interface ReadingQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  type: 'main-idea' | 'detail' | 'inference' | 'vocabulary'
}

const readingPassages: ReadingPassage[] = [
  {
    id: 'company-email',
    title: '会社からのメール',
    level: 'basic',
    type: 'email',
    timeLimit: 5,
    passage: `From: hr@techcorp.com
To: all-staff@techcorp.com
Subject: New Health Insurance Benefits

Dear Team,

We are pleased to announce that starting January 1st, TechCorp will be offering enhanced health insurance benefits to all full-time employees. The new plan includes:

• Comprehensive medical coverage with lower co-pays
• Dental and vision insurance at no additional cost
• Mental health support services
• Prescription drug coverage with generic alternatives

All current employees will be automatically enrolled in the new plan. New employees will be eligible after a 90-day waiting period. If you have any questions about the new benefits, please contact the HR department at hr@techcorp.com or call extension 3456.

We believe these improvements will better support the health and well-being of our valued team members.

Best regards,
Human Resources Department`,
    questions: [
      {
        id: 'ce-q1',
        question: 'When will the new health insurance benefits start?',
        options: ['Immediately', 'January 1st', 'After 90 days', 'Next month'],
        correctAnswer: 1,
        explanation: 'The email states that the new benefits will start on January 1st.',
        type: 'detail'
      },
      {
        id: 'ce-q2',
        question: 'What is NOT included in the new health insurance plan?',
        options: ['Dental insurance', 'Vision insurance', 'Life insurance', 'Mental health support'],
        correctAnswer: 2,
        explanation: 'Life insurance is not mentioned in the list of new benefits.',
        type: 'detail'
      },
      {
        id: 'ce-q3',
        question: 'Who should employees contact for questions?',
        options: ['Their manager', 'HR department', 'The insurance company', 'TechCorp customer service'],
        correctAnswer: 1,
        explanation: 'The email instructs employees to contact the HR department for questions.',
        type: 'detail'
      }
    ]
  },
  {
    id: 'business-article',
    title: 'ビジネス記事',
    level: 'intermediate',
    type: 'article',
    timeLimit: 8,
    passage: `The Rise of Remote Work: Transforming Modern Business

The COVID-19 pandemic has fundamentally altered the landscape of modern business, with remote work emerging as one of the most significant and lasting changes. What began as an emergency response has evolved into a permanent feature of the corporate world, with many companies reporting increased productivity and employee satisfaction.

According to a recent survey by the Global Workplace Institute, 78% of companies that implemented remote work policies during the pandemic plan to maintain some form of flexible work arrangements permanently. This shift represents a dramatic departure from traditional office-based work culture that dominated the business world for decades.

The benefits of remote work extend beyond employee convenience. Companies have reported reduced overhead costs, with office space requirements decreasing by an average of 35%. Additionally, businesses can now access a global talent pool, no longer limited by geographical constraints when hiring. This has led to increased diversity in the workplace and access to specialized skills that may not be available locally.

However, remote work is not without its challenges. Communication barriers, team cohesion issues, and the difficulty of maintaining company culture in a virtual environment are among the primary concerns cited by business leaders. Many organizations are investing heavily in digital collaboration tools and virtual team-building activities to address these issues.

As we move forward, the hybrid work model appears to be gaining traction as the optimal solution. This approach combines the flexibility of remote work with the collaboration benefits of in-person interaction, offering employees the best of both worlds while maintaining organizational effectiveness.`,
    questions: [
      {
        id: 'ba-q1',
        question: 'What percentage of companies plan to maintain flexible work arrangements?',
        options: ['65%', '72%', '78%', '84%'],
        correctAnswer: 2,
        explanation: 'The article states that 78% of companies plan to maintain flexible work arrangements.',
        type: 'detail'
      },
      {
        id: 'ba-q2',
        question: 'What is the main idea of this article?',
        options: [
          'Remote work is only temporary',
          'Companies are struggling with remote work',
          'Remote work has become a permanent business transformation',
          'Traditional offices are becoming obsolete'
        ],
        correctAnswer: 2,
        explanation: 'The article discusses how remote work has transformed from an emergency response to a permanent feature of business.',
        type: 'main-idea'
      },
      {
        id: 'ba-q3',
        question: 'According to the article, office space requirements have decreased by:',
        options: ['25%', '30%', '35%', '40%'],
        correctAnswer: 2,
        explanation: 'The article mentions that office space requirements have decreased by an average of 35%.',
        type: 'detail'
      },
      {
        id: 'ba-q4',
        question: 'What can be inferred about the hybrid work model?',
        options: [
          'It is less effective than remote work',
          'It combines benefits of both remote and office work',
          'It is only suitable for large companies',
          'It will replace remote work completely'
        ],
        correctAnswer: 1,
        explanation: 'The article suggests that hybrid work combines the flexibility of remote work with collaboration benefits of in-person interaction.',
        type: 'inference'
      }
    ]
  },
  {
    id: 'financial-report',
    title: '財務報告書',
    level: 'advanced',
    type: 'report',
    timeLimit: 12,
    passage: `QUARTERLY FINANCIAL REPORT - Q3 2024
INNOVATE SOLUTIONS INC.

EXECUTIVE SUMMARY

Innovate Solutions Inc. is pleased to report strong financial performance for the third quarter of 2024. Revenue increased 18% year-over-year to $45.2 million, driven primarily by robust demand for our cloud-based enterprise solutions and the successful launch of our AI-powered analytics platform.

REVENUE BREAKDOWN
• Enterprise Solutions: $28.7 million (63% of total revenue, +22% YoY)
• Consumer Products: $11.3 million (25% of total revenue, +8% YoY)
• Professional Services: $5.2 million (12% of total revenue, +15% YoY)

PROFITABILITY
Gross profit margin improved to 68%, up from 64% in Q3 2023, reflecting operational efficiency gains and favorable product mix. Operating expenses increased by 12% to $23.1 million, primarily due to expanded research and development activities and strategic marketing investments.

Net income reached $8.4 million, representing a 28% increase compared to the same quarter last year. Earnings per share (EPS) grew to $1.12, exceeding analyst expectations of $1.05.

CASH FLOW AND BALANCE SHEET
Operating cash flow was strong at $12.1 million, providing ample liquidity for ongoing operations and strategic initiatives. The company maintains a healthy balance sheet with $34.5 million in cash and cash equivalents and minimal debt.

OUTLOOK
Looking ahead to Q4 2024, we anticipate continued revenue growth driven by enterprise customer expansion and the upcoming launch of our mobile application suite. Full-year revenue is projected to reach $175-180 million, representing 20-25% growth over 2023.

The company remains well-positioned to capitalize on the growing demand for integrated business solutions and maintains its commitment to innovation and customer satisfaction.`,
    questions: [
      {
        id: 'fr-q1',
        question: 'What was the company\'s total revenue for Q3 2024?',
        options: ['$42.3 million', '$45.2 million', '$48.1 million', '$51.7 million'],
        correctAnswer: 1,
        explanation: 'The report states that revenue was $45.2 million in Q3 2024.',
        type: 'detail'
      },
      {
        id: 'fr-q2',
        question: 'Which business segment contributed the most to revenue?',
        options: ['Consumer Products', 'Professional Services', 'Enterprise Solutions', 'Mobile Applications'],
        correctAnswer: 2,
        explanation: 'Enterprise Solutions generated $28.7 million, which is 63% of total revenue.',
        type: 'detail'
      },
      {
        id: 'fr-q3',
        question: 'What does "YoY" most likely mean in this context?',
        options: ['Year-over-year', 'Yield on yield', 'Year of year', 'Yes or yes'],
        correctAnswer: 0,
        explanation: 'In financial contexts, YoY typically stands for "year-over-year," comparing to the same period in the previous year.',
        type: 'vocabulary'
      },
      {
        id: 'fr-q4',
        question: 'What can be inferred about the company\'s future prospects?',
        options: [
          'The company expects declining revenues',
          'The company is planning to reduce operations',
          'The company is optimistic about continued growth',
          'The company is considering selling its assets'
        ],
        correctAnswer: 2,
        explanation: 'The outlook section mentions anticipated revenue growth and positioning to capitalize on demand, indicating optimism.',
        type: 'inference'
      },
      {
        id: 'fr-q5',
        question: 'How did the actual EPS compare to analyst expectations?',
        options: [
          'It was lower than expected',
          'It met expectations exactly',
          'It exceeded expectations',
          'It was not compared to expectations'
        ],
        correctAnswer: 2,
        explanation: 'The EPS of $1.12 exceeded analyst expectations of $1.05.',
        type: 'detail'
      }
    ]
  }
]

export default function ReadingPage() {
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState(0)
  const [studyProgress, setStudyProgress] = useState({
    vocabularyLevel: 0,
    grammarLevel: 0,
    listeningLevel: 0,
    readingLevel: 0,
    totalStudyTime: 0,
    streakDays: 0
  })
  const [sessionStartTime] = useState(new Date())

  useEffect(() => {
    getStudyProgress().then(setStudyProgress)
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false)
      // 時間切れの処理
    }
    return () => clearInterval(timer)
  }, [isTimerActive, timeLeft])

  const startPassage = (passage: ReadingPassage) => {
    setCurrentPassage(passage)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setTimeLeft(passage.timeLimit * 60)
    setIsTimerActive(true)
    setCorrectAnswers(0)
    setCompletedQuestions(0)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    setCompletedQuestions(prev => prev + 1)
    
    if (answerIndex === currentPassage?.questions[currentQuestionIndex].correctAnswer) {
      setCorrectAnswers(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (!currentPassage) return
    
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      completeSession()
    }
  }

  const completeSession = async () => {
    if (!currentPassage) return
    
    setIsTimerActive(false)
    const sessionEndTime = new Date()
    const accuracy = (correctAnswers / completedQuestions) * 100
    
    await recordSession({
      taskId: `reading-${currentPassage.id}`,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      score: accuracy,
      correctAnswers,
      totalQuestions: completedQuestions,
      studyType: 'reading'
    })
    
    const newProgress = {
      ...studyProgress,
      readingLevel: Math.min(studyProgress.readingLevel + Math.floor(accuracy / 20), 100),
      totalStudyTime: studyProgress.totalStudyTime + Math.floor((sessionEndTime.getTime() - sessionStartTime.getTime()) / 60000)
    }
    
    await saveStudyProgress(newProgress)
    setStudyProgress(newProgress)
    setCurrentPassage(null)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgressForLevel = (level: 'basic' | 'intermediate' | 'advanced') => {
    const reading = studyProgress.readingLevel
    if (level === 'basic') return Math.min(reading, 100)
    if (level === 'intermediate') return Math.max(0, Math.min(reading - 25, 100))
    return Math.max(0, Math.min(reading - 50, 100))
  }

  if (currentPassage) {
    const currentQuestion = currentPassage.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentPassage.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentPassage(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              リーディング練習に戻る
            </Button>
            
            <div className="grid gap-6 lg:grid-cols-2">
              {/* 読解文 */}
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{currentPassage.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={currentPassage.level === 'basic' ? 'secondary' : 
                                    currentPassage.level === 'intermediate' ? 'default' : 'destructive'}>
                        {currentPassage.level === 'basic' ? '基本' :
                         currentPassage.level === 'intermediate' ? '中級' : '上級'}
                      </Badge>
                      <div className="flex items-center text-sm font-mono bg-orange-100 px-2 py-1 rounded">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(timeLeft)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {currentPassage.passage}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* 問題 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">問題</CardTitle>
                    <Progress value={progress} className="w-32" />
                  </div>
                  <CardDescription>
                    問題 {currentQuestionIndex + 1} / {currentPassage.questions.length}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      {currentQuestion.type === 'main-idea' ? '主旨' :
                       currentQuestion.type === 'detail' ? '詳細' :
                       currentQuestion.type === 'inference' ? '推論' : '語彙'}
                    </h3>
                    <p className="text-lg">{currentQuestion.question}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === null ? "outline" :
                                index === currentQuestion.correctAnswer ? "default" :
                                selectedAnswer === index ? "destructive" : "outline"}
                        className="w-full text-left justify-start h-auto p-4"
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <span className="mr-3 font-semibold">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                        {selectedAnswer !== null && index === currentQuestion.correctAnswer && (
                          <Check className="w-4 h-4 ml-auto text-green-600" />
                        )}
                        {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                          <X className="w-4 h-4 ml-auto text-red-600" />
                        )}
                      </Button>
                    ))}
                  </div>
                  
                  {showExplanation && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">解説</h4>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                  )}
                  
                  {showExplanation && (
                    <Button onClick={nextQuestion} className="w-full">
                      {currentQuestionIndex < currentPassage.questions.length - 1 ? 
                        '次の問題' : 'セッション完了'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
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
            <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
            TOEIC リーディング練習
          </h1>
          <p className="text-gray-600">
            ビジネス文書や記事を読んで理解力と読解速度を向上させます
          </p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>学習進捗</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>基本レベル</span>
                    <span>{getProgressForLevel('basic')}%</span>
                  </div>
                  <Progress value={getProgressForLevel('basic')} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>中級レベル</span>
                    <span>{getProgressForLevel('intermediate')}%</span>
                  </div>
                  <Progress value={getProgressForLevel('intermediate')} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>上級レベル</span>
                    <span>{getProgressForLevel('advanced')}%</span>
                  </div>
                  <Progress value={getProgressForLevel('advanced')} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {readingPassages.map((passage) => (
            <Card key={passage.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{passage.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={passage.level === 'basic' ? 'secondary' : 
                                  passage.level === 'intermediate' ? 'default' : 'destructive'}>
                      {passage.level === 'basic' ? '基本' :
                       passage.level === 'intermediate' ? '中級' : '上級'}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  {passage.type === 'email' ? 'メール' :
                   passage.type === 'article' ? '記事' :
                   passage.type === 'memo' ? 'メモ' :
                   passage.type === 'advertisement' ? '広告' : 'レポート'}
                  • {passage.timeLimit}分 • {passage.questions.length}問
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button 
                  onClick={() => startPassage(passage)}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  学習開始
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
