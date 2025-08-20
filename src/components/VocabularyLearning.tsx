'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { VocabularyEntry, getVocabularyByLevel, getRandomVocabulary } from '@/lib/enhanced-vocabulary-database'
import { speakWordWithDetails } from '@/lib/audio-manager'
import { Volume2, BookOpen, Brain, Target, CheckCircle, XCircle, Star, HelpCircle } from 'lucide-react'

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

interface ChoiceOption {
  meaning: string
  isCorrect: boolean
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
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [options, setOptions] = useState<ChoiceOption[]>([])

  // TOEIC スコアからレベルを決定
  const determineLevel = (score: number): 'basic' | 'intermediate' | 'advanced' | 'expert' => {
    if (score < 500) return 'basic'
    if (score < 700) return 'intermediate' 
    if (score < 850) return 'advanced'
    return 'expert'
  }

  // 選択肢をシャッフルする関数
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // 不正解の選択肢を生成する関数
  const generateWrongChoices = (correctMeaning: string, level: string): ChoiceOption[] => {
    // 同じレベルの単語からランダムに選択
    const levelWords = getVocabularyByLevel(level as 'basic' | 'intermediate' | 'advanced' | 'expert')
    
    // ランダムに選択された単語からの意味を取得
    const randomWords = shuffleArray(levelWords)
      .filter(word => word.id !== currentWord?.id) // 現在の単語を除外
      .slice(0, 10)
    
    // 各単語から最初の意味を取得
    const wrongOptions = randomWords
      .map(word => ({ 
        meaning: word.meanings[0], 
        isCorrect: false 
      }))
      .filter(option => option.meaning !== correctMeaning) // 正解と同じ意味を除外
      .slice(0, 3) // 3つだけ取得
    
    // 十分な数の選択肢がない場合のバックアップ選択肢
    const backupChoices = [
      "計画", "戦略", "プロセス", "分析", "評価", "開発", "実装", "調査", 
      "報告", "構造", "管理", "設計", "技術", "成果", "作業", "支援"
    ]
    
    // 必要な数の選択肢を確保
    while (wrongOptions.length < 3) {
      const randomBackup = backupChoices[Math.floor(Math.random() * backupChoices.length)]
      if (!wrongOptions.some(opt => opt.meaning === randomBackup) && randomBackup !== correctMeaning) {
        wrongOptions.push({ meaning: randomBackup, isCorrect: false })
      }
    }
    
    return wrongOptions
  }

  // 4つの選択肢を生成
  const generateOptions = (word: VocabularyEntry): ChoiceOption[] => {
    if (!word) return []
    
    // 正解の選択肢（最初の意味を使用）
    const correctOption: ChoiceOption = { 
      meaning: word.meanings[0], 
      isCorrect: true 
    }
    
    // 不正解の選択肢を生成
    const wrongOptions = generateWrongChoices(correctOption.meaning, word.level)
    
    // 選択肢をまとめる
    const allOptions = [
      correctOption,
      ...wrongOptions
    ]
    
    // 選択肢をシャッフル
    return shuffleArray(allOptions)
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
    
    // 最初の単語の選択肢を生成
    setOptions(generateOptions(words[0]))
  }

  // セッション終了
  const endSession = useCallback(() => {
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
  }, [sessionStartTime, sessionDuration, currentIndex, score, wordsLearned, userLevel, onComplete])

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

  // 回答処理
  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null || showAnswer) return // 既に回答済みの場合は何もしない
    
    setSelectedOption(optionIndex)
    const isCorrect = options[optionIndex]?.isCorrect || false
    
    if (isCorrect) {
      setScore(score + 1)
      if (currentWord?.id) {
        setWordsLearned([...wordsLearned, currentWord.id])
      }
    }
    
    // 回答表示
    setShowAnswer(true)
    
    // 2.5秒後に次の単語
    setTimeout(() => {
      nextWord()
    }, 2500)
  }

  // 次の単語
  const nextWord = () => {
    if (currentIndex < sessionWords.length - 1) {
      const nextIndex = currentIndex + 1
      const nextWord = sessionWords[nextIndex]
      
      setCurrentIndex(nextIndex)
      setCurrentWord(nextWord)
      setShowAnswer(false)
      setSelectedOption(null)
      
      // 新しい単語の選択肢を生成
      setOptions(generateOptions(nextWord))
    } else {
      endSession()
    }
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

          {/* 問題 */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">この単語の意味として最も適切なものを選んでください:</h3>
            
            {/* 4択選択肢 */}
            <div className="grid grid-cols-1 gap-3 mt-4">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    showAnswer
                      ? option.isCorrect
                        ? "default"
                        : selectedOption === index
                        ? "destructive"
                        : "outline"
                      : "outline"
                  }
                  className={`
                    h-auto py-3 justify-start text-left
                    ${showAnswer && option.isCorrect ? "ring-2 ring-green-500" : ""}
                    ${selectedOption === index && !showAnswer ? "bg-secondary" : ""}
                  `}
                  disabled={showAnswer || selectedOption !== null}
                  onClick={() => handleAnswer(index)}
                >
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-3">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option.meaning}</span>
                    {showAnswer && option.isCorrect && (
                      <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                    )}
                    {showAnswer && !option.isCorrect && selectedOption === index && (
                      <XCircle className="ml-auto h-5 w-5 text-red-500" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* 回答表示 */}
          {showAnswer && (
            <div className="space-y-4 p-4 bg-muted rounded-lg mt-4">
              <div>
                <h3 className="font-semibold mb-2">他の意味:</h3>
                <ul className="space-y-1">
                  {currentWord.meanings.slice(1).map((meaning, index) => (
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
