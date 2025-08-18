'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Check, X, HelpCircle, BookOpen, Target } from 'lucide-react'
import Link from 'next/link'
import { recordSession, getStudyProgress, saveStudyProgress } from '@/lib/storage'

interface GrammarRule {
  id: string
  title: string
  level: 'basic' | 'intermediate' | 'advanced'
  explanation: string
  examples: { correct: string; incorrect?: string }[]
  questions: GrammarQuestion[]
}

interface GrammarQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

const grammarRules: GrammarRule[] = [
  {
    id: 'present-perfect',
    title: '現在完了形の使い方',
    level: 'intermediate',
    explanation: '現在完了形は「have/has + 過去分詞」で作られ、過去から現在まで続く状況や経験を表します。',
    examples: [
      { correct: 'I have worked here for three years.' },
      { correct: 'She has finished her report.', incorrect: 'She finished her report.' },
      { correct: 'We have been to Tokyo twice.' }
    ],
    questions: [
      {
        id: 'pf-q1',
        question: 'The company _____ significant progress in reducing costs.',
        options: ['made', 'has made', 'makes', 'making'],
        correctAnswer: 1,
        explanation: '現在完了形で「最近の結果」を表現しています。',
        category: 'present-perfect'
      },
      {
        id: 'pf-q2',
        question: 'I _____ in this department since 2020.',
        options: ['work', 'worked', 'have worked', 'am working'],
        correctAnswer: 2,
        explanation: '「since 2020」があるため現在完了形を使います。',
        category: 'present-perfect'
      }
    ]
  },
  {
    id: 'conditional',
    title: '仮定法の基本',
    level: 'advanced',
    explanation: '仮定法は現実と異なる状況や仮想的な状況を表現するために使われます。',
    examples: [
      { correct: 'If I were you, I would accept the offer.' },
      { correct: 'If she had studied harder, she would have passed the exam.' },
      { correct: 'I wish I could speak Japanese fluently.' }
    ],
    questions: [
      {
        id: 'cd-q1',
        question: 'If the meeting _____ earlier, we could catch the 6 PM train.',
        options: ['ends', 'ended', 'had ended', 'would end'],
        correctAnswer: 1,
        explanation: '仮定法過去で現在の非現実的な状況を表しています。',
        category: 'conditional'
      },
      {
        id: 'cd-q2',
        question: 'I wish I _____ more time to prepare for the presentation.',
        options: ['have', 'had', 'would have', 'will have'],
        correctAnswer: 1,
        explanation: 'I wish + 仮定法過去で現在の願望を表します。',
        category: 'conditional'
      }
    ]
  },
  {
    id: 'relative-clauses',
    title: '関係詞の使い分け',
    level: 'intermediate',
    explanation: '関係詞は2つの文を繋げて、より詳細な情報を提供するために使われます。',
    examples: [
      { correct: 'The person who called you is my manager.' },
      { correct: 'The project that we discussed yesterday is approved.' },
      { correct: 'This is the office where I work.' }
    ],
    questions: [
      {
        id: 'rc-q1',
        question: 'The employee _____ performance was outstanding received a promotion.',
        options: ['who', 'whose', 'which', 'that'],
        correctAnswer: 1,
        explanation: '所有を表す関係詞「whose」を使います。',
        category: 'relative-clauses'
      },
      {
        id: 'rc-q2',
        question: 'The contract _____ was signed yesterday takes effect next month.',
        options: ['who', 'whose', 'which', 'where'],
        correctAnswer: 2,
        explanation: '物を先行詞とする場合は「which」を使います。',
        category: 'relative-clauses'
      }
    ]
  },
  {
    id: 'passive-voice',
    title: '受動態の活用',
    level: 'basic',
    explanation: '受動態は「be動詞 + 過去分詞」で作られ、動作の受け手を主語にした表現です。',
    examples: [
      { correct: 'The report was completed yesterday.' },
      { correct: 'New employees are trained every month.' },
      { correct: 'The meeting has been postponed until next week.' }
    ],
    questions: [
      {
        id: 'pv-q1',
        question: 'The new policy _____ implemented next quarter.',
        options: ['will be', 'will', 'is being', 'has been'],
        correctAnswer: 0,
        explanation: '未来の受動態は「will be + 過去分詞」です。',
        category: 'passive-voice'
      },
      {
        id: 'pv-q2',
        question: 'All applications must _____ by the deadline.',
        options: ['submit', 'be submitted', 'submitting', 'to submit'],
        correctAnswer: 1,
        explanation: '助動詞の受動態は「must be + 過去分詞」です。',
        category: 'passive-voice'
      }
    ]
  },
  {
    id: 'modals',
    title: '助動詞の使い分け',
    level: 'intermediate',
    explanation: '助動詞は可能性、義務、許可、推測などを表現するために使われます。',
    examples: [
      { correct: 'You should submit the report by Friday.' },
      { correct: 'She might be in a meeting right now.' },
      { correct: 'Employees must wear ID badges at all times.' }
    ],
    questions: [
      {
        id: 'md-q1',
        question: 'You _____ have told me about the change in schedule.',
        options: ['should', 'must', 'could', 'might'],
        correctAnswer: 0,
        explanation: '過去の義務や助言は「should have + 過去分詞」で表します。',
        category: 'modals'
      },
      {
        id: 'md-q2',
        question: 'Visitors _____ register at the front desk before entering.',
        options: ['should', 'must', 'could', 'might'],
        correctAnswer: 1,
        explanation: '強い義務は「must」で表現します。',
        category: 'modals'
      }
    ]
  }
]

export default function GrammarPage() {
  const [currentRule, setCurrentRule] = useState<GrammarRule | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
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

  const startRule = (rule: GrammarRule) => {
    setCurrentRule(rule)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCorrectAnswers(0)
    setCompletedQuestions(0)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    setCompletedQuestions(prev => prev + 1)
    
    if (answerIndex === currentRule?.questions[currentQuestionIndex].correctAnswer) {
      setCorrectAnswers(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (!currentRule) return
    
    if (currentQuestionIndex < currentRule.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // 学習セッション完了
      completeSession()
    }
  }

  const completeSession = async () => {
    if (!currentRule) return
    
    const sessionEndTime = new Date()
    const accuracy = (correctAnswers / completedQuestions) * 100
    
    // セッション記録
    await recordSession({
      taskId: `grammar-${currentRule.id}`,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      score: accuracy,
      correctAnswers,
      totalQuestions: completedQuestions,
      studyType: 'grammar'
    })
    
    // 進捗更新
    const newProgress = {
      ...studyProgress,
      grammarLevel: Math.min(studyProgress.grammarLevel + Math.floor(accuracy / 20), 100),
      totalStudyTime: studyProgress.totalStudyTime + Math.floor((sessionEndTime.getTime() - sessionStartTime.getTime()) / 60000)
    }
    
    await saveStudyProgress(newProgress)
    setStudyProgress(newProgress)
    setCurrentRule(null)
  }

  const getProgressForLevel = (level: 'basic' | 'intermediate' | 'advanced') => {
    const basic = studyProgress.grammarLevel
    if (level === 'basic') return Math.min(basic, 100)
    if (level === 'intermediate') return Math.max(0, Math.min(basic - 25, 100))
    return Math.max(0, Math.min(basic - 50, 100))
  }

  if (currentRule) {
    const currentQuestion = currentRule.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentRule.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentRule(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              文法ルール一覧に戻る
            </Button>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{currentRule.title}</CardTitle>
                  <Badge variant={currentRule.level === 'basic' ? 'secondary' : 
                                currentRule.level === 'intermediate' ? 'default' : 'destructive'}>
                    {currentRule.level === 'basic' ? '基本' :
                     currentRule.level === 'intermediate' ? '中級' : '上級'}
                  </Badge>
                </div>
                <Progress value={progress} className="mt-2" />
                <CardDescription>
                  問題 {currentQuestionIndex + 1} / {currentRule.questions.length}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
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
                    {currentQuestionIndex < currentRule.questions.length - 1 ? 
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
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
            <BookOpen className="w-8 h-8 mr-3 text-green-600" />
            TOEIC文法学習
          </h1>
          <p className="text-gray-600">
            ビジネス英語で重要な文法項目を体系的に学習します
          </p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                学習進捗
              </CardTitle>
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
          {grammarRules.map((rule) => (
            <Card key={rule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{rule.title}</CardTitle>
                  <Badge variant={rule.level === 'basic' ? 'secondary' : 
                                rule.level === 'intermediate' ? 'default' : 'destructive'}>
                    {rule.level === 'basic' ? '基本' :
                     rule.level === 'intermediate' ? '中級' : '上級'}
                  </Badge>
                </div>
                <CardDescription>{rule.explanation}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">例文</h4>
                    <div className="space-y-1">
                      {rule.examples.slice(0, 2).map((example, index) => (
                        <p key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {example.correct}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      onClick={() => startRule(rule)}
                      className="w-full"
                    >
                      学習開始 ({rule.questions.length}問)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
