'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Clock, 
  Play, 
  Pause, 
  Volume2, 
  FileText, 
  Check, 
  X,
  AlertCircle,
  Target,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { recordSession, getStudyProgress, saveStudyProgress } from '@/lib/storage'

interface MockTestSection {
  id: string
  name: string
  type: 'listening' | 'reading'
  timeLimit: number // minutes
  questions: MockQuestion[]
  instructions: string
}

interface MockQuestion {
  id: string
  type: 'photos' | 'questions-responses' | 'conversations' | 'talks' | 'sentence-completion' | 'text-completion' | 'reading-comprehension'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  audioScript?: string
  passage?: string
}

const mockTestSections: MockTestSection[] = [
  {
    id: 'listening-part1',
    name: 'リスニング Part 1 - 写真描写問題',
    type: 'listening',
    timeLimit: 10,
    instructions: '写真を見て、その写真を最もよく表している説明文を選んでください。',
    questions: [
      {
        id: 'l1-q1',
        type: 'photos',
        question: '写真に写っている状況を最もよく表しているのはどれですか？',
        options: [
          'People are sitting at a conference table',
          'Someone is presenting to an audience',
          'Workers are fixing equipment',
          'Customers are waiting in line'
        ],
        correctAnswer: 0,
        explanation: '写真では複数の人が会議テーブルに座っている様子が写っています。',
        audioScript: 'Look at the picture. You will hear four statements about the picture. Choose the statement that best describes what you see in the picture.'
      },
      {
        id: 'l1-q2',
        type: 'photos',
        question: '写真に写っている動作を最もよく表しているのはどれですか？',
        options: [
          'A woman is typing on a computer',
          'A man is making a phone call',
          'Someone is reading documents',
          'People are shaking hands'
        ],
        correctAnswer: 3,
        explanation: '写真では二人の人がハンドシェイクをしている場面が写っています。',
        audioScript: 'Listen to the four statements and choose the one that best describes the picture.'
      }
    ]
  },
  {
    id: 'listening-part2',
    name: 'リスニング Part 2 - 応答問題',
    type: 'listening',
    timeLimit: 15,
    instructions: '質問に対する最も適切な応答を選んでください。',
    questions: [
      {
        id: 'l2-q1',
        type: 'questions-responses',
        question: 'Where is the nearest post office?',
        options: [
          "It's about two blocks from here",
          "I need to mail this package",
          "The post office closes at 5 PM"
        ],
        correctAnswer: 0,
        explanation: '場所を尋ねる質問に対して、場所を答えている選択肢が正解です。',
        audioScript: 'Question: Where is the nearest post office? Choose the best response.'
      },
      {
        id: 'l2-q2',
        type: 'questions-responses',
        question: 'Who will be attending the meeting tomorrow?',
        options: [
          "The meeting room is on the third floor",
          "All department heads will be there",
          "We should prepare the agenda"
        ],
        correctAnswer: 1,
        explanation: '「誰が」という質問に対して、参加者について答えている選択肢が正解です。',
        audioScript: 'Question: Who will be attending the meeting tomorrow? Choose the best response.'
      }
    ]
  },
  {
    id: 'reading-part5',
    name: 'リーディング Part 5 - 短文穴埋め問題',
    type: 'reading',
    timeLimit: 30,
    instructions: '文章の空欄に入る最も適切な語句を選んでください。',
    questions: [
      {
        id: 'r5-q1',
        type: 'sentence-completion',
        question: 'The new product launch was _____ successful, exceeding all sales expectations.',
        options: [
          'extremely',
          'extreme',
          'extremes',
          'extremity'
        ],
        correctAnswer: 0,
        explanation: 'successfulは形容詞なので、副詞のextremelyで修飾します。',
      },
      {
        id: 'r5-q2',
        type: 'sentence-completion',
        question: 'All employees must _____ their expense reports by the end of the month.',
        options: [
          'submit',
          'submission',
          'submitting',
          'submitted'
        ],
        correctAnswer: 0,
        explanation: 'mustの後には動詞の原形が来るため、submitが正解です。',
      },
      {
        id: 'r5-q3',
        type: 'sentence-completion',
        question: 'The conference room is available _____ 2 PM to 4 PM today.',
        options: [
          'between',
          'from',
          'during',
          'within'
        ],
        correctAnswer: 1,
        explanation: 'from A to Bの構文で「AからBまで」を表します。',
      }
    ]
  },
  {
    id: 'reading-part7',
    name: 'リーディング Part 7 - 読解問題',
    type: 'reading',
    timeLimit: 45,
    instructions: '文書を読んで、設問に答えてください。',
    questions: [
      {
        id: 'r7-q1',
        type: 'reading-comprehension',
        question: 'What is the main purpose of this email?',
        passage: `From: sarah.johnson@techcorp.com
To: all-staff@techcorp.com
Subject: Important Update - Office Security Procedures

Dear Team,

Effective immediately, we are implementing new security procedures for our office building. Please note the following changes:

1. All visitors must be accompanied by an employee at all times
2. Employee ID badges must be visible when in the building
3. The main entrance will be locked after 6 PM on weekdays
4. Weekend access requires prior approval from security

These measures are being taken to ensure the safety and security of all staff members. If you have any questions, please contact the security department at ext. 4567.

Best regards,
Sarah Johnson
Human Resources Manager`,
        options: [
          'To announce new employee benefits',
          'To inform staff about security procedure changes',
          'To schedule a building maintenance',
          'To introduce new staff members'
        ],
        correctAnswer: 1,
        explanation: 'このメールの主な目的は、新しいセキュリティ手順の変更をスタッフに知らせることです。',
      },
      {
        id: 'r7-q2',
        type: 'reading-comprehension',
        question: 'According to the email, what must employees do when visitors are in the building?',
        passage: `From: sarah.johnson@techcorp.com
To: all-staff@techcorp.com
Subject: Important Update - Office Security Procedures

Dear Team,

Effective immediately, we are implementing new security procedures for our office building. Please note the following changes:

1. All visitors must be accompanied by an employee at all times
2. Employee ID badges must be visible when in the building
3. The main entrance will be locked after 6 PM on weekdays
4. Weekend access requires prior approval from security

These measures are being taken to ensure the safety and security of all staff members. If you have any questions, please contact the security department at ext. 4567.

Best regards,
Sarah Johnson
Human Resources Manager`,
        options: [
          'Register them at the front desk',
          'Accompany them at all times',
          'Give them temporary ID badges',
          'Notify the security department'
        ],
        correctAnswer: 1,
        explanation: 'メールの1番目の項目で「All visitors must be accompanied by an employee at all times」と明記されています。',
      }
    ]
  }
]

export default function MockTestPage() {
  const [selectedSection, setSelectedSection] = useState<MockTestSection | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [sessionStartTime] = useState(new Date())
  const [studyProgress, setStudyProgress] = useState({
    vocabularyLevel: 0,
    grammarLevel: 0,
    listeningLevel: 0,
    readingLevel: 0,
    totalStudyTime: 0,
    streakDays: 0
  })

  useEffect(() => {
    getStudyProgress().then(setStudyProgress)
  }, [])

  const completeSection = useCallback(async () => {
    if (!selectedSection) return
    
    setIsTimerActive(false)
    
    // 結果計算
    let correctCount = 0
    selectedSection.questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id]
      if (userAnswer === question.correctAnswer) {
        correctCount++
      }
    })
    
    const accuracy = (correctCount / selectedSection.questions.length) * 100
    const sessionEndTime = new Date()
    
    // セッション記録
    await recordSession({
      taskId: `mocktest-${selectedSection.id}`,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      score: accuracy,
      correctAnswers: correctCount,
      totalQuestions: selectedSection.questions.length,
      studyType: selectedSection.type === 'listening' ? 'listening' : 'reading'
    })
    
    // 進捗更新
    const progressKey = selectedSection.type === 'listening' ? 'listeningLevel' : 'readingLevel'
    const newProgress = {
      ...studyProgress,
      [progressKey]: Math.min(studyProgress[progressKey] + Math.floor(accuracy / 10), 100),
      totalStudyTime: studyProgress.totalStudyTime + Math.floor((sessionEndTime.getTime() - sessionStartTime.getTime()) / 60000)
    }
    
    await saveStudyProgress(newProgress)
    setStudyProgress(newProgress)
    setShowResults(true)
  }, [selectedSection, selectedAnswers, sessionStartTime, studyProgress])

  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false)
    completeSection()
  }, [completeSection])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimeUp()
    }
    return () => clearInterval(timer)
  }, [isTimerActive, timeLeft, handleTimeUp])

  const startSection = (section: MockTestSection) => {
    setSelectedSection(section)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResults(false)
    setTimeLeft(section.timeLimit * 60)
    setIsTimerActive(true)
  }

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const nextQuestion = () => {
    if (!selectedSection) return
    
    if (currentQuestionIndex < selectedSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      completeSection()
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  if (selectedSection && showResults) {
    let correctCount = 0
    selectedSection.questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id]
      if (userAnswer === question.correctAnswer) {
        correctCount++
      }
    })
    const accuracy = Math.round((correctCount / selectedSection.questions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">
                <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                テスト結果
              </CardTitle>
              <div className={`text-6xl font-bold ${getScoreColor(accuracy)}`}>
                {accuracy}%
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                  <div className="text-sm text-gray-600">正答数</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedSection.questions.length}</div>
                  <div className="text-sm text-gray-600">総問題数</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">問題別結果</h3>
                {selectedSection.questions.map((question, index) => {
                  const userAnswer = selectedAnswers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <Card key={question.id} className={isCorrect ? 'border-green-200' : 'border-red-200'}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="font-semibold mr-2">問題 {index + 1}</span>
                              {isCorrect ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <p className="text-sm mb-2">{question.question}</p>
                            <div className="text-xs space-y-1">
                              <p>あなたの回答: {question.options[userAnswer] || '未回答'}</p>
                              <p>正解: {question.options[question.correctAnswer]}</p>
                              <p className="text-gray-600">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="flex gap-4">
                <Button onClick={() => {
                  setSelectedSection(null)
                  setShowResults(false)
                }} className="flex-1">
                  テスト一覧に戻る
                </Button>
                <Button onClick={() => startSection(selectedSection)} variant="outline" className="flex-1">
                  もう一度チャレンジ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (selectedSection) {
    const currentQuestion = selectedSection.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / selectedSection.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => setSelectedSection(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              テスト一覧に戻る
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm font-mono bg-orange-100 px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(timeLeft)}
              </div>
              <Button onClick={completeSection} variant="outline" size="sm">
                テスト終了
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedSection.name}</CardTitle>
                <Badge variant="outline">
                  {currentQuestionIndex + 1} / {selectedSection.questions.length}
                </Badge>
              </div>
              <Progress value={progress} />
            </CardHeader>
            
            <CardContent className="space-y-6">
              {selectedSection.type === 'listening' && currentQuestion.audioScript && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center">
                      <Volume2 className="w-4 h-4 mr-2" />
                      音声
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => playAudio(currentQuestion.audioScript!)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      再生
                    </Button>
                  </div>
                </div>
              )}

              {currentQuestion.passage && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    文書
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {currentQuestion.passage}
                    </pre>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">問題</h3>
                <p className="text-lg">{currentQuestion.question}</p>
              </div>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion.id] === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  >
                    <span className="mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                >
                  前の問題
                </Button>
                
                <Button onClick={nextQuestion}>
                  {currentQuestionIndex < selectedSection.questions.length - 1 ? 
                    '次の問題' : 'テスト完了'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
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
            <Target className="w-8 h-8 mr-3 text-blue-600" />
            TOEIC 模擬試験
          </h1>
          <p className="text-gray-600">
            本番形式の問題で実力を測定し、弱点を把握しましょう
          </p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                受験上の注意
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• 各セクションには制限時間があります</li>
                <li>• 一度選択した答えは変更できます</li>
                <li>• リスニング問題では音声の再生回数に制限はありません</li>
                <li>• 時間内に全問題に回答することを心がけてください</li>
                <li>• 結果は詳細な解説付きで表示されます</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mockTestSections.map((section) => (
            <Card key={section.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{section.name}</CardTitle>
                  <Badge variant={section.type === 'listening' ? 'default' : 'secondary'}>
                    {section.type === 'listening' ? 'リスニング' : 'リーディング'}
                  </Badge>
                </div>
                <CardDescription>
                  制限時間: {section.timeLimit}分 • {section.questions.length}問
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{section.instructions}</p>
                </div>
                
                <Button 
                  onClick={() => startSection(section)}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  テスト開始
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>学習進捗</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>リスニング力</span>
                    <span>{studyProgress.listeningLevel}%</span>
                  </div>
                  <Progress value={studyProgress.listeningLevel} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>リーディング力</span>
                    <span>{studyProgress.readingLevel}%</span>
                  </div>
                  <Progress value={studyProgress.readingLevel} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
