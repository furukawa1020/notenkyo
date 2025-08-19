'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Volume2, Check, X, RotateCcw, BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAllVocabulary, getVocabularyByLevel, VocabularyEntry } from '@/lib/vocabulary-database'
import { saveTaskProgress } from '@/lib/storage'

interface VocabularyItem {
  id: string
  word: string
  pronunciation: string
  meanings: string[]
  partOfSpeech: string
  exampleSentences: Array<{ english: string; japanese: string; context: string }>
  level: number // レベルを数値に変換（1-4）
  frequency: number
  synonyms: string[]
  antonyms: string[]
  collocations: string[]
  categories: string[]
  audioUrl?: string
  
  // UI用の追加プロパティ
  meaning: string // meanings配列を文字列に変換
  exampleSentence: string // 最初の例文を選択
}

// VocabularyEntryをVocabularyItemに変換
function convertVocabularyEntry(entry: VocabularyEntry): VocabularyItem {
  return {
    id: entry.id,
    word: entry.word,
    pronunciation: entry.pronunciation,
    meanings: entry.meanings,
    partOfSpeech: entry.partOfSpeech,
    exampleSentences: entry.exampleSentences,
    level: entry.level === 'basic' ? 1 : 
           entry.level === 'intermediate' ? 2 : 
           entry.level === 'advanced' ? 3 : 4,
    frequency: entry.frequency,
    synonyms: entry.synonyms,
    antonyms: entry.antonyms,
    collocations: entry.collocations,
    categories: entry.categories,
    audioUrl: entry.audioUrl,
    
    // UI用変換プロパティ
    meaning: entry.meanings.join(', '),
    exampleSentence: entry.exampleSentences[0]?.english || `Example with ${entry.word}`
  }
}

export default function VocabularyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [userAnswer, setUserAnswer] = useState<'correct' | 'incorrect' | null>(null)
  const [studyMode, setStudyMode] = useState<'flashcard' | 'quiz'>('flashcard')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const currentWord = vocabulary[currentIndex]

  // 実際のデータベースから単語を読み込み
  useEffect(() => {
    const loadVocabulary = async () => {
      setIsLoading(true)
      try {
        const allVocab = getAllVocabulary()
        const convertedVocab = allVocab
          .slice(0, 50) // 最初の50単語を表示
          .map(convertVocabularyEntry)
        setVocabulary(convertedVocab)
      } catch (error) {
        console.error('Failed to load vocabulary:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadVocabulary()
  }, [selectedLevel])

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowMeaning(false)
      setUserAnswer(null)
    } else {
      setCurrentIndex(0)
      setShowMeaning(false)
      setUserAnswer(null)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowMeaning(false)
      setUserAnswer(null)
    } else {
      setCurrentIndex(vocabulary.length - 1)
      setShowMeaning(false)
      setUserAnswer(null)
    }
  }

  const handleAnswer = (isCorrect: boolean) => {
    setUserAnswer(isCorrect ? 'correct' : 'incorrect')
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))
    
    // 学習進捗を保存
    saveTaskProgress(`vocabulary-${currentWord.id}`, {
      completed: true,
      correctAnswers: isCorrect ? 1 : 0,
      totalQuestions: 1,
      score: isCorrect ? 100 : 0
    })
  }

  const toggleMeaning = () => {
    setShowMeaning(!showMeaning)
  }

  const resetProgress = () => {
    setCurrentIndex(0)
    setScore({ correct: 0, total: 0 })
    setShowMeaning(false)
    setUserAnswer(null)
  }

  const getLevelBadgeColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelText = (level: number) => {
    switch (level) {
      case 1: return '初級'
      case 2: return '中級'
      case 3: return '上級'
      default: return '不明'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto max-w-4xl pt-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">単語学習</h1>
            <p className="text-gray-600">単語データを読み込んでいます...</p>
          </div>
        </div>
      </div>
    )
  }

  if (vocabulary.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto max-w-4xl pt-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">単語学習</h1>
            <p className="text-gray-600">単語データが見つかりませんでした。</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl pt-8 space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TOEIC頻出単語</h1>
              <p className="text-gray-600">実際の試験に出る重要単語を学習</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              {currentIndex + 1} / {vocabulary.length}
            </span>
          </div>
        </div>

        {/* 進捗表示 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{score.correct}</div>
                  <div className="text-sm text-gray-500">正解</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{score.total}</div>
                  <div className="text-sm text-gray-500">総回答</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-500">正答率</div>
                </div>
              </div>
              <Button onClick={resetProgress} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                リセット
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 単語カード */}
        <Card className="min-h-[400px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={getLevelBadgeColor(currentWord.level)}>
                  {getLevelText(currentWord.level)}
                </Badge>
                <Badge variant="outline">
                  頻度: {currentWord.frequency}%
                </Badge>
                <Badge variant="outline">
                  {currentWord.partOfSpeech}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // 音声再生機能（実装時）
                  console.log('Playing pronunciation for:', currentWord.word)
                }}
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {currentWord.word}
                </h2>
                <p className="text-lg text-gray-600">
                  {currentWord.pronunciation}
                </p>
              </div>

              <div className="min-h-[120px] flex items-center justify-center">
                {showMeaning ? (
                  <div className="space-y-4">
                    <p className="text-2xl font-semibold text-blue-600">
                      {currentWord.meaning}
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 italic">
                        &ldquo;{currentWord.exampleSentence}&rdquo;
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">意味を思い出してからクリック</p>
                    <Button onClick={toggleMeaning} size="lg">
                      意味を表示
                    </Button>
                  </div>
                )}
              </div>

              {showMeaning && userAnswer === null && (
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    知っていた
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant="destructive"
                    size="lg"
                  >
                    <X className="h-5 w-5 mr-2" />
                    知らなかった
                  </Button>
                </div>
              )}

              {userAnswer && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    userAnswer === 'correct' 
                      ? 'bg-green-100 border border-green-300' 
                      : 'bg-red-100 border border-red-300'
                  }`}>
                    <p className={`font-semibold ${
                      userAnswer === 'correct' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {userAnswer === 'correct' ? '素晴らしい！' : '次回頑張りましょう！'}
                    </p>
                  </div>
                  <Button onClick={handleNext} size="lg" className="w-full">
                    次の単語
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ナビゲーション */}
        <div className="flex justify-between">
          <Button onClick={handlePrevious} variant="outline">
            前の単語
          </Button>
          <Button onClick={handleNext} variant="outline">
            次の単語
          </Button>
        </div>
      </div>
    </div>
  )
}
