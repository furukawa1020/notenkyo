'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Check, X, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { recordSession, getStudyProgress, saveStudyProgress } from '@/lib/storage'

interface ListeningExercise {
  id: string
  title: string
  level: 'basic' | 'intermediate' | 'advanced'
  type: 'conversation' | 'announcement' | 'presentation' | 'phone-call'
  audioText: string
  questions: ListeningQuestion[]
  transcript: string
}

interface ListeningQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const listeningExercises: ListeningExercise[] = [
  {
    id: 'office-conversation',
    title: 'オフィスでの会話',
    level: 'basic',
    type: 'conversation',
    audioText: `A: Good morning, Sarah. Do you have a minute to discuss the quarterly report?
B: Of course, Mark. I've been working on it since Monday. The data looks quite promising.
A: That's great to hear. When do you think it will be ready for review?
B: I should have the draft completed by Wednesday afternoon. Would Thursday morning work for a meeting?
A: Perfect. Let me check my calendar and send you a meeting invitation.`,
    transcript: `A: Good morning, Sarah. Do you have a minute to discuss the quarterly report?
B: Of course, Mark. I've been working on it since Monday. The data looks quite promising.
A: That's great to hear. When do you think it will be ready for review?
B: I should have the draft completed by Wednesday afternoon. Would Thursday morning work for a meeting?
A: Perfect. Let me check my calendar and send you a meeting invitation.`,
    questions: [
      {
        id: 'oc-q1',
        question: 'What are Mark and Sarah discussing?',
        options: [
          'A monthly meeting',
          'The quarterly report',
          'Sarah\'s calendar',
          'Data analysis'
        ],
        correctAnswer: 1,
        explanation: 'Mark asks Sarah about discussing the quarterly report.'
      },
      {
        id: 'oc-q2',
        question: 'When will Sarah complete the draft?',
        options: [
          'Monday',
          'Tuesday',
          'Wednesday afternoon',
          'Thursday morning'
        ],
        correctAnswer: 2,
        explanation: 'Sarah says she should have the draft completed by Wednesday afternoon.'
      }
    ]
  },
  {
    id: 'company-announcement',
    title: '会社のアナウンス',
    level: 'intermediate',
    type: 'announcement',
    audioText: `Attention all employees. This is an important announcement regarding our upcoming office relocation. The company will be moving to our new headquarters at 150 Business Park Drive on September 15th. All departments will be relocated over the weekend, and normal operations will resume on Monday, September 18th. Please ensure that all personal items are packed in the boxes provided by the facilities team. IT support will be available throughout the move to assist with computer setup. If you have any questions, please contact the HR department.`,
    transcript: `Attention all employees. This is an important announcement regarding our upcoming office relocation. The company will be moving to our new headquarters at 150 Business Park Drive on September 15th. All departments will be relocated over the weekend, and normal operations will resume on Monday, September 18th. Please ensure that all personal items are packed in the boxes provided by the facilities team. IT support will be available throughout the move to assist with computer setup. If you have any questions, please contact the HR department.`,
    questions: [
      {
        id: 'ca-q1',
        question: 'When will the company move to the new location?',
        options: [
          'September 15th',
          'September 18th',
          'Over the weekend',
          'Monday morning'
        ],
        correctAnswer: 0,
        explanation: 'The company will be moving on September 15th.'
      },
      {
        id: 'ca-q2',
        question: 'Who should employees contact for questions?',
        options: [
          'IT support',
          'Facilities team',
          'HR department',
          'Their manager'
        ],
        correctAnswer: 2,
        explanation: 'Employees should contact the HR department if they have questions.'
      }
    ]
  },
  {
    id: 'sales-presentation',
    title: '営業プレゼンテーション',
    level: 'advanced',
    type: 'presentation',
    audioText: `Good afternoon, everyone. Today I'd like to present our Q3 sales performance and outline our strategy for the final quarter. As you can see from the chart, we've exceeded our targets by 15% this quarter, with particularly strong growth in the Asia-Pacific region. Our new product line has been well-received, contributing to a 22% increase in revenue compared to the same period last year. Looking ahead to Q4, we plan to expand our marketing efforts in emerging markets and launch our enhanced customer service program. With these initiatives, we're confident about achieving our annual goals.`,
    transcript: `Good afternoon, everyone. Today I'd like to present our Q3 sales performance and outline our strategy for the final quarter. As you can see from the chart, we've exceeded our targets by 15% this quarter, with particularly strong growth in the Asia-Pacific region. Our new product line has been well-received, contributing to a 22% increase in revenue compared to the same period last year. Looking ahead to Q4, we plan to expand our marketing efforts in emerging markets and launch our enhanced customer service program. With these initiatives, we're confident about achieving our annual goals.`,
    questions: [
      {
        id: 'sp-q1',
        question: 'By how much did the company exceed Q3 targets?',
        options: ['12%', '15%', '18%', '22%'],
        correctAnswer: 1,
        explanation: 'The company exceeded targets by 15% this quarter.'
      },
      {
        id: 'sp-q2',
        question: 'What was the revenue increase compared to last year?',
        options: ['15%', '18%', '22%', '25%'],
        correctAnswer: 2,
        explanation: 'There was a 22% increase in revenue compared to the same period last year.'
      },
      {
        id: 'sp-q3',
        question: 'What will the company launch in Q4?',
        options: [
          'A new product line',
          'Marketing campaigns',
          'Enhanced customer service program',
          'Asia-Pacific expansion'
        ],
        correctAnswer: 2,
        explanation: 'The company plans to launch an enhanced customer service program in Q4.'
      }
    ]
  }
]

export default function ListeningPage() {
  const [currentExercise, setCurrentExercise] = useState<ListeningExercise | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
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
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    getStudyProgress().then(setStudyProgress)
  }, [])

  const startExercise = (exercise: ListeningExercise) => {
    setCurrentExercise(exercise)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setShowTranscript(false)
    setCorrectAnswers(0)
    setCompletedQuestions(0)
    playAudio(exercise.audioText)
  }

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  const replayAudio = () => {
    if (currentExercise) {
      stopAudio()
      playAudio(currentExercise.audioText)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    setCompletedQuestions(prev => prev + 1)
    
    if (answerIndex === currentExercise?.questions[currentQuestionIndex].correctAnswer) {
      setCorrectAnswers(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (!currentExercise) return
    
    if (currentQuestionIndex < currentExercise.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      completeSession()
    }
  }

  const completeSession = async () => {
    if (!currentExercise) return
    
    const sessionEndTime = new Date()
    const accuracy = (correctAnswers / completedQuestions) * 100
    
    await recordSession({
      taskId: `listening-${currentExercise.id}`,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      score: accuracy,
      correctAnswers,
      totalQuestions: completedQuestions,
      studyType: 'listening'
    })
    
    const newProgress = {
      ...studyProgress,
      listeningLevel: Math.min(studyProgress.listeningLevel + Math.floor(accuracy / 20), 100),
      totalStudyTime: studyProgress.totalStudyTime + Math.floor((sessionEndTime.getTime() - sessionStartTime.getTime()) / 60000)
    }
    
    await saveStudyProgress(newProgress)
    setStudyProgress(newProgress)
    setCurrentExercise(null)
  }

  const getProgressForLevel = (level: 'basic' | 'intermediate' | 'advanced') => {
    const listening = studyProgress.listeningLevel
    if (level === 'basic') return Math.min(listening, 100)
    if (level === 'intermediate') return Math.max(0, Math.min(listening - 25, 100))
    return Math.max(0, Math.min(listening - 50, 100))
  }

  if (currentExercise) {
    const currentQuestion = currentExercise.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentExercise.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentExercise(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              リスニング練習に戻る
            </Button>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{currentExercise.title}</CardTitle>
                  <Badge variant={currentExercise.level === 'basic' ? 'secondary' : 
                                currentExercise.level === 'intermediate' ? 'default' : 'destructive'}>
                    {currentExercise.level === 'basic' ? '基本' :
                     currentExercise.level === 'intermediate' ? '中級' : '上級'}
                  </Badge>
                </div>
                <Progress value={progress} className="mt-2" />
                <CardDescription>
                  問題 {currentQuestionIndex + 1} / {currentExercise.questions.length}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center">
                      <Volume2 className="w-4 h-4 mr-2" />
                      音声
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={replayAudio}
                        disabled={isPlaying}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        再生
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowTranscript(!showTranscript)}
                      >
                        スクリプト
                      </Button>
                    </div>
                  </div>
                  
                  {showTranscript && (
                    <div className="bg-white p-3 rounded border text-sm">
                      {currentExercise.transcript}
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    問題
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
                    {currentQuestionIndex < currentExercise.questions.length - 1 ? 
                      '次の問題' : 'セッション完了'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
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
            <Volume2 className="w-8 h-8 mr-3 text-purple-600" />
            TOEIC リスニング練習
          </h1>
          <p className="text-gray-600">
            ビジネスシーンの様々な音声を聞いて理解力を向上させます
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
          {listeningExercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{exercise.title}</CardTitle>
                  <Badge variant={exercise.level === 'basic' ? 'secondary' : 
                                exercise.level === 'intermediate' ? 'default' : 'destructive'}>
                    {exercise.level === 'basic' ? '基本' :
                     exercise.level === 'intermediate' ? '中級' : '上級'}
                  </Badge>
                </div>
                <CardDescription>
                  {exercise.type === 'conversation' ? '会話' :
                   exercise.type === 'announcement' ? 'アナウンス' :
                   exercise.type === 'presentation' ? 'プレゼンテーション' : '電話'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button 
                  onClick={() => startExercise(exercise)}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  学習開始 ({exercise.questions.length}問)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
