'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { QuestionGenerator, QuestionBase } from '@/lib/question-generator'
import { getUserState } from '@/lib/storage'
import { calculateNoutenkyoScore } from '@/lib/noutenkyo-engine'

export default function QuestionTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionBase | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [noutenkyoScore, setNoutenkyoScore] = useState(50)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const userState = await getUserState()
      if (userState) {
        const score = calculateNoutenkyoScore(userState)
        setNoutenkyoScore(score)
      }
      generateNewQuestion()
    }
    loadData()
  }, [])

  const generateNewQuestion = async () => {
    try {
      setIsGenerating(true)
      setSelectedAnswer('')
      setShowResult(false)

      let question: QuestionBase | null = null

      const questionTypes = ['vocabulary', 'grammar', 'listening', 'reading'] as const
      const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)]

      switch (randomType) {
        case 'vocabulary':
          question = QuestionGenerator.generateVocabularyQuestion(
            noutenkyoScore > 70 ? 'hard' : noutenkyoScore > 40 ? 'medium' : 'easy'
          )
          break
        case 'grammar':
          question = QuestionGenerator.generateGrammarQuestion(
            noutenkyoScore > 70 ? 'advanced' : noutenkyoScore > 40 ? 'intermediate' : 'beginner'
          )
          break
        case 'listening':
          question = QuestionGenerator.generateListeningQuestion(
            noutenkyoScore > 70 ? 'part4' : noutenkyoScore > 40 ? 'part3' : 'part1'
          )
          break
        default:
          question = QuestionGenerator.generateVocabularyQuestion('medium')
      }

      if (question) {
        setCurrentQuestion(question)
      }
    } catch (error) {
      console.error('問題生成エラー:', error)
      const fallbackQuestion = QuestionGenerator.generateVocabularyQuestion('easy')
      setCurrentQuestion(fallbackQuestion)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswer = () => {
    setShowResult(true)
    setTotalQuestions(prev => prev + 1)
    
    if (currentQuestion && parseInt(selectedAnswer) === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    generateNewQuestion()
  }

  const generateQuestionSet = async () => {
    try {
      const questionSet = QuestionGenerator.generateADHDFriendlySet(noutenkyoScore, 300)
      console.log('生成された問題セット:', questionSet)
      alert(`${questionSet.length}問の問題セットを生成しました。コンソールを確認してください。`)
    } catch (error) {
      console.error('問題セット生成エラー:', error)
      alert('問題セット生成に失敗しました')
    }
  }

  if (isGenerating) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg">問題を生成中...</p>
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

  const isCorrect = showResult && parseInt(selectedAnswer) === currentQuestion.correctAnswer
  const isIncorrect = showResult && parseInt(selectedAnswer) !== currentQuestion.correctAnswer

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">問題生成テスト</h1>
        <p className="text-gray-600">のうてんきょ問題生成エンジンのテスト</p>
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
            <div className="text-sm text-gray-500">正答数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalQuestions}</div>
            <div className="text-sm text-gray-500">総問題数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500">正答率</div>
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
            <div className="flex items-center space-x-2">
              <span>目安: {currentQuestion.estimatedTime}分</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 問題文 */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
            {(currentQuestion as any).context && (
              <p className="text-gray-600 bg-gray-50 p-3 rounded">{(currentQuestion as any).context}</p>
            )}
          </div>

          {/* 選択肢 */}
          <div className="space-y-3">
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              disabled={showResult}
            >
              {currentQuestion.options.map((option, index) => {
                const optionLabel = String.fromCharCode(65 + index) // A, B, C, D
                const isSelected = selectedAnswer === optionLabel
                const isCorrectOption = currentQuestion.correctAnswer === index
                
                return (
                  <div key={optionLabel} className={`flex items-center space-x-2 p-3 rounded border ${
                    showResult && isCorrectOption ? 'bg-green-100 border-green-300' :
                    showResult && isSelected && !isCorrectOption ? 'bg-red-100 border-red-300' :
                    'bg-white border-gray-200'
                  }`}>
                    <RadioGroupItem value={optionLabel} id={optionLabel} />
                    <Label htmlFor={optionLabel} className="flex-1 cursor-pointer">
                      <span className="font-medium">{optionLabel}. </span>
                      {option}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {/* 解説 */}
          {showResult && currentQuestion.explanation && (
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">解説</h3>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex justify-between">
            {!showResult ? (
              <Button 
                onClick={handleAnswer} 
                disabled={!selectedAnswer}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <span>解答する</span>
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="bg-green-600 hover:bg-green-700">
                <span>次の問題</span>
              </Button>
            )}
            
            <Button onClick={generateNewQuestion} variant="outline">
              新しい問題
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 問題セット生成テスト */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <span>ADHD対応機能テスト</span>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={generateQuestionSet} variant="outline">
            問題セット生成テスト
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
