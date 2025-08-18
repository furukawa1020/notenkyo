'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Volume2,
  RotateCcw,
  ArrowRight,
  Target,
  Zap
} from 'lucide-react'
import { TOEICQuestionGenerator, QuestionBase } from '@/lib/question-generator'

export default function QuestionTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionBase | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  // のうてんきょスコア（デモ用）
  const noutenkyoScore = 75

  useEffect(() => {
    generateNewQuestion()
  }, [])

  useEffect(() => {
    let interval: any
    if (startTime && !showResult) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [startTime, showResult])

  const generateNewQuestion = () => {
    setIsLoading(true)
    try {
      // ランダムで問題タイプを選択
      const types: ('vocabulary' | 'grammar' | 'listening')[] = ['vocabulary', 'grammar', 'listening']
      const randomType = types[Math.floor(Math.random() * types.length)]
      
      let question: QuestionBase
      
      switch (randomType) {
        case 'vocabulary':
          question = TOEICQuestionGenerator.generateVocabularyQuestion(
            noutenkyoScore >= 80 ? 'hard' : noutenkyoScore >= 50 ? 'medium' : 'easy'
          )
          break
        case 'grammar':
          question = TOEICQuestionGenerator.generateGrammarQuestion(
            noutenkyoScore >= 80 ? 'hard' : noutenkyoScore >= 50 ? 'medium' : 'easy'
          )
          break
        case 'listening':
          const part = Math.floor(Math.random() * 2) + 1 as 1 | 2
          question = TOEICQuestionGenerator.generateListeningQuestion(
            part,
            noutenkyoScore >= 80 ? 'hard' : noutenkyoScore >= 50 ? 'medium' : 'easy'
          )
          break
        default:
          question = TOEICQuestionGenerator.generateVocabularyQuestion('medium')
      }
      
      setCurrentQuestion(question)
      setSelectedAnswer(null)
      setShowResult(false)
      setStartTime(Date.now())
      setTimeSpent(0)
    } catch (error) {
      console.error('Error generating question:', error)
      // フォールバック：簡単な単語問題
      const fallbackQuestion = TOEICQuestionGenerator.generateVocabularyQuestion('easy')
      setCurrentQuestion(fallbackQuestion)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return
    
    setShowResult(true)
    setQuestionCount(prev => prev + 1)
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    generateNewQuestion()
  }

  const generateADHDSet = () => {
    try {
      const questionSet = TOEICQuestionGenerator.generateADHDFriendlySet(noutenkyoScore, 300)
      console.log('Generated ADHD-friendly question set:', questionSet)
      alert(`Generated ${questionSet.questions.length} questions for ${questionSet.metadata.totalTime} seconds!`)
    } catch (error) {
      console.error('Error generating ADHD set:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">問題を生成中...</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600">問題の読み込みに失敗しました</p>
        <Button onClick={generateNewQuestion}>再試行</Button>
      </div>
    )
  }

  const isCorrect = showResult && selectedAnswer === currentQuestion.correctAnswer
  const isIncorrect = showResult && selectedAnswer !== currentQuestion.correctAnswer

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">問題生成テスト</h1>
        <p className="text-gray-600">のうてんきょ問題生成エンジンのデモ</p>
      </div>

      {/* スコア表示 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{noutenkyoScore}</div>
            <div className="text-sm text-gray-500">のうてんきょスコア</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-500">正解数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{questionCount}</div>
            <div className="text-sm text-gray-500">総問題数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{timeSpent}s</div>
            <div className="text-sm text-gray-500">経過時間</div>
          </CardContent>
        </Card>
      </div>

      {/* 問題表示 */}
      <Card className={`${isCorrect ? 'border-green-500 bg-green-50' : isIncorrect ? 'border-red-500 bg-red-50' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {currentQuestion.type === 'vocabulary' ? '単語' : 
                 currentQuestion.type === 'grammar' ? '文法' : 
                 currentQuestion.type === 'listening' ? 'リスニング' : 'リーディング'}
              </Badge>
              <Badge variant="outline">Part {currentQuestion.part}</Badge>
              <Badge variant="outline" className={
                currentQuestion.difficulty === 'easy' ? 'text-green-600 border-green-600' :
                currentQuestion.difficulty === 'medium' ? 'text-yellow-600 border-yellow-600' :
                'text-red-600 border-red-600'
              }>
                {currentQuestion.difficulty === 'easy' ? '易' : 
                 currentQuestion.difficulty === 'medium' ? '中' : '難'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>目安: {currentQuestion.estimatedTime}秒</span>
            </div>
          </div>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          
          {/* リスニング問題の場合は音声ボタン */}
          {currentQuestion.type === 'listening' && (
            <Button variant="outline" size="sm" className="w-fit">
              <Volume2 className="h-4 w-4 mr-2" />
              音声を再生
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 選択肢 */}
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedAnswer === index
                    ? showResult
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-red-500 bg-red-100 text-red-800'
                      : 'border-blue-500 bg-blue-100'
                    : showResult && index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {showResult && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                  )}
                  {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* 解説 */}
          {showResult && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">解説</h4>
                <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
                
                {/* 語彙問題の場合は追加情報 */}
                {currentQuestion.type === 'vocabulary' && (
                  <div className="mt-3 space-y-1">
                    <p className="text-sm"><strong>単語:</strong> {(currentQuestion as any).word}</p>
                    <p className="text-sm"><strong>発音:</strong> {(currentQuestion as any).pronunciation}</p>
                    <p className="text-sm"><strong>品詞:</strong> {(currentQuestion as any).partOfSpeech}</p>
                    <p className="text-sm"><strong>例文:</strong> {(currentQuestion as any).exampleSentence}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ボタン */}
          <div className="flex items-center space-x-4">
            {!showResult ? (
              <Button 
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="flex items-center space-x-2"
              >
                <span>解答する</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                className="flex items-center space-x-2"
              >
                <span>次の問題</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            
            <Button variant="outline" onClick={generateNewQuestion}>
              <RotateCcw className="h-4 w-4 mr-2" />
              新しい問題
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ADHD対応機能のテスト */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-700 flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <span>ADHD対応機能テスト</span>
          </CardTitle>
          <CardDescription>
            時間制限付きの短時間集中型問題セットを生成
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateADHDSet} variant="outline">
            5分間問題セットを生成
          </Button>
        </CardContent>
      </Card>

      {/* 問題の詳細情報 */}
      <Card>
        <CardHeader>
          <CardTitle>問題詳細情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>問題ID:</strong> {currentQuestion.id}
            </div>
            <div>
              <strong>タグ:</strong> {currentQuestion.tags.join(', ')}
            </div>
            <div>
              <strong>推定解答時間:</strong> {currentQuestion.estimatedTime}秒
            </div>
            <div>
              <strong>TOEIC Part:</strong> Part {currentQuestion.part}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
