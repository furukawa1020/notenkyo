'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Volume2, Check, X, RotateCcw, BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface VocabularyItem {
  id: string
  word: string
  pronunciation: string
  meaning: string
  partOfSpeech: string
  exampleSentence: string
  level: number
  frequency: number
}

// サンプルTOEIC頻出単語データ
const sampleVocabulary: VocabularyItem[] = [
  {
    id: '1',
    word: 'accomplish',
    pronunciation: '/əˈkʌmplɪʃ/',
    meaning: '達成する、成し遂げる',
    partOfSpeech: '動詞',
    exampleSentence: 'We accomplished our goal ahead of schedule.',
    level: 1,
    frequency: 85
  },
  {
    id: '2',
    word: 'adequate',
    pronunciation: '/ˈædɪkwət/',
    meaning: '十分な、適切な',
    partOfSpeech: '形容詞',
    exampleSentence: 'The budget is adequate for this project.',
    level: 2,
    frequency: 78
  },
  {
    id: '3',
    word: 'anticipate',
    pronunciation: '/ænˈtɪsɪpeɪt/',
    meaning: '予期する、期待する',
    partOfSpeech: '動詞',
    exampleSentence: 'We anticipate good results from this campaign.',
    level: 2,
    frequency: 72
  },
  {
    id: '4',
    word: 'accommodate',
    pronunciation: '/əˈkɒmədeɪt/',
    meaning: '収容する、適応させる',
    partOfSpeech: '動詞',
    exampleSentence: 'This hotel can accommodate 200 guests.',
    level: 3,
    frequency: 68
  },
  {
    id: '5',
    word: 'acquisition',
    pronunciation: '/ˌækwɪˈzɪʃən/',
    meaning: '取得、買収',
    partOfSpeech: '名詞',
    exampleSentence: 'The acquisition was completed last month.',
    level: 3,
    frequency: 65
  }
]

export default function VocabularyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [userAnswer, setUserAnswer] = useState<'correct' | 'incorrect' | null>(null)
  const [studyMode, setStudyMode] = useState<'flashcard' | 'quiz'>('flashcard')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(sampleVocabulary)

  const currentWord = vocabulary[currentIndex]

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowMeaning(false)
      setUserAnswer(null)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowMeaning(false)
      setUserAnswer(null)
    }
  }

  const handleAnswer = (answer: 'correct' | 'incorrect') => {
    setUserAnswer(answer)
    setScore(prev => ({
      correct: prev.correct + (answer === 'correct' ? 1 : 0),
      total: prev.total + 1
    }))
    setShowMeaning(true)
  }

  const playAudio = () => {
    // 実際の実装では音声合成APIを使用
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const resetSession = () => {
    setCurrentIndex(0)
    setShowMeaning(false)
    setUserAnswer(null)
    setScore({ correct: 0, total: 0 })
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelName = (level: number) => {
    switch (level) {
      case 1: return '基本'
      case 2: return '重要'
      case 3: return '上級'
      default: return '不明'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              TOEIC単語学習
            </h1>
            <p className="text-gray-600">
              {currentIndex + 1} / {vocabulary.length} 
              {score.total > 0 && (
                <span className="ml-4">正答率: {Math.round((score.correct / score.total) * 100)}%</span>
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetSession}>
            <RotateCcw className="h-4 w-4 mr-1" />
            リセット
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / vocabulary.length) * 100}%` }}
          ></div>
        </div>

        {/* Word Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={playAudio}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-800">
                    {currentWord.word}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    {currentWord.pronunciation}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={getLevelColor(currentWord.level)}>
                  {getLevelName(currentWord.level)}
                </Badge>
                <Badge variant="outline">
                  {currentWord.partOfSpeech}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          {showMeaning && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">意味</h4>
                  <p className="text-lg text-gray-700">{currentWord.meaning}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">例文</h4>
                  <p className="text-gray-700 italic">"{currentWord.exampleSentence}"</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>頻出度: {currentWord.frequency}%</span>
                  {userAnswer && (
                    <Badge 
                      variant={userAnswer === 'correct' ? 'default' : 'destructive'}
                    >
                      {userAnswer === 'correct' ? '正解' : '不正解'}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!showMeaning ? (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-16"
                onClick={() => setShowMeaning(true)}
              >
                意味を見る
              </Button>
              <Button 
                variant="outline" 
                className="h-16"
                onClick={playAudio}
              >
                <Volume2 className="h-5 w-5 mr-2" />
                音声再生
              </Button>
            </div>
          ) : (
            <>
              {userAnswer === null && (
                <div className="space-y-3">
                  <p className="text-center text-gray-700 font-medium">
                    この単語を知っていましたか？
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => handleAnswer('correct')}
                      className="h-16 bg-green-500 hover:bg-green-600"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      知ってた
                    </Button>
                    <Button 
                      onClick={() => handleAnswer('incorrect')}
                      variant="outline"
                      className="h-16 border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <X className="h-5 w-5 mr-2" />
                      知らなかった
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex-1"
                >
                  前の単語
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={currentIndex === vocabulary.length - 1}
                  className="flex-1"
                >
                  次の単語
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Study Tips */}
        {currentIndex === 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">学習のコツ</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>• 音声ボタンで正しい発音を確認しましょう</p>
              <p>• 例文で単語の使われ方を理解しましょう</p>
              <p>• 知らなかった単語は後で復習されます</p>
              <p>• 無理をせず、自分のペースで進めましょう</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
