'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { VocabularyEntry, getVocabularyByLevel, getRandomVocabulary } from '@/lib/massive-vocabulary-database'
import { speakWordWithDetails } from '@/lib/audio-manager'
import { Volume2, BookOpen, Brain, Target, CheckCircle, XCircle, Star } from 'lucide-react'

interface VocabularyLearningProps {
  userLevel: number // TOEIC推定スコア
  sessionDuration: number // 分
  onComplete: (results: VocabularySessionResults) => void
}

interface VocabularySessionResults {
  totalWords: number
  correctAnswers: number
  accuracy: number
  wordsLearned: string[]
  timeSpent: number
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
}

export default function VocabularyLearning({ 
  userLevel, 
  sessionDuration, 
  onComplete 
}: VocabularyLearningProps) {
  const [currentWord, setCurrentWord] = useState<VocabularyEntry | null>(null)
  const [sessionWords, setSessionWords] = useState<VocabularyEntry[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [wordsLearned, setWordsLearned] = useState<string[]>([])
  const [sessionActive, setSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60) // 秒

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
    const words = getRandomVocabulary(50, level) // レベルに応じて50語取得
    
    setSessionWords(words)
    setCurrentWord(words[0])
    setCurrentIndex(0)
    setScore(0)
    setWordsLearned([])
    setSessionStartTime(new Date())
    setSessionActive(true)
    setTimeRemaining(sessionDuration * 60)
  }

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
  }, [sessionActive, timeRemaining])

  // 回答処理
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
      setWordsLearned([...wordsLearned, currentWord?.id || ''])
    }
    
    setShowAnswer(true)
    
    // 1.5秒後に次の単語
    setTimeout(() => {
      nextWord()
    }, 1500)
  }

  // 次の単語
  const nextWord = () => {
    if (currentIndex < sessionWords.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentWord(sessionWords[nextIndex])
      setShowAnswer(false)
    } else {
      endSession()
    }
  }

  // セッション終了
  const endSession = () => {
    setSessionActive(false)
    const timeSpent = sessionStartTime 
      ? (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60 
      : sessionDuration

    const results: VocabularySessionResults = {
      totalWords: currentIndex + 1,
      correctAnswers: score,
      accuracy: (score / (currentIndex + 1)) * 100,
      wordsLearned,
      timeSpent,
      level: determineLevel(userLevel)
    }

    onComplete(results)
  }

  // 発音機能（実際のTTS）
  const playPronunciation = async () => {
    if (!currentWord) return
    
    try {
      await speakWordWithDetails(currentWord.word, currentWord.pronunciation, {
        rate: 0.8, // 少しゆっくり
        showPhonetics: true
      })
    } catch (error) {
      console.error('Pronunciation failed:', error)
      // フォールバック：基本のTTS
      try {
        const utterance = new SpeechSynthesisUtterance(currentWord.word)
        utterance.lang = 'en-US'
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      } catch (fallbackError) {
        console.error('Fallback pronunciation also failed:', fallbackError)
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6" />
            TOEIC語彙学習
          </CardTitle>
          <div className="flex flex-col gap-2">
            <Badge variant="outline">
              {determineLevel(userLevel).toUpperCase()}レベル
            </Badge>
            <p className="text-sm text-muted-foreground">
              TOEIC {userLevel}点レベルの語彙を学習します
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-2">
              <Brain className="h-8 w-8 mx-auto text-blue-500" />
              <p className="text-sm">12,000語から厳選</p>
            </div>
            <div className="space-y-2">
              <Target className="h-8 w-8 mx-auto text-green-500" />
              <p className="text-sm">レベル別最適化</p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-lg">
              セッション時間: <strong>{sessionDuration}分</strong>
            </p>
            <Button onClick={startSession} size="lg" className="w-full">
              語彙学習を開始
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentWord) return null

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentIndex + 1} / {sessionWords.length}
            </Badge>
            <Badge variant="secondary">
              {currentWord.level.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
        <Progress value={(currentIndex / sessionWords.length) * 100} />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 単語表示 */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">{currentWord.word}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg text-muted-foreground">
                {currentWord.pronunciation}
              </span>
              <Button variant="ghost" size="sm" onClick={playPronunciation}>
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant="outline">{currentWord.partOfSpeech}</Badge>
          </div>

          {/* 回答表示 */}
          {showAnswer && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold mb-2">意味:</h3>
                <ul className="space-y-1">
                  {currentWord.meanings.map((meaning, index) => (
                    <li key={index}>{meaning}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">例文:</h3>
                {currentWord.exampleSentences.map((sentence, index) => (
                  <div key={index} className="text-sm space-y-1">
                    <p>{sentence.english}</p>
                    <p className="text-muted-foreground">{sentence.japanese}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 回答ボタン */}
        {!showAnswer && (
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="destructive" 
              onClick={() => handleAnswer(false)}
              className="h-16"
            >
              <XCircle className="h-6 w-6 mr-2" />
              分からない
            </Button>
            <Button 
              variant="default" 
              onClick={() => handleAnswer(true)}
              className="h-16"
            >
              <CheckCircle className="h-6 w-6 mr-2" />
              知っている
            </Button>
          </div>
        )}

        {/* スコア表示 */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>正解: {score}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4 text-blue-500" />
            <span>精度: {Math.round((score / Math.max(currentIndex, 1)) * 100)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
