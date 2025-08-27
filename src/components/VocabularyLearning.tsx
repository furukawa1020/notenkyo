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
    
    // 現在の単語の品詞を取得
    const currentPartOfSpeech = currentWord?.partOfSpeech
    
    // 不適切な選択肢をフィルタリングする関数
    const isValidChoice = (meaning: string): boolean => {
      // 基本的な除外条件
      if (!meaning || meaning.length <= 1 || meaning === correctMeaning) return false
      
      // 一般的すぎる単語やひらがなのみの単語を除外
      const invalidPatterns = [
        'ない', 'いる', 'ある', 'する', 'なる', 'くる', 'いく', 'みる', 'きく', 'いう',
        'もの', 'こと', 'とき', 'ばあい', 'ところ', 'ひと', 'てき', 'かん', 'せい',
        '豊富な', 'できる', '〜', '化す', '的な', '性', '感', '間', '関', '官', '館'
      ]
      
      // ひらがなのみの短い単語を除外
      if (/^[ひらがな]+$/.test(meaning) && meaning.length <= 3) return false
      
      // 無効なパターンをチェック
      for (const pattern of invalidPatterns) {
        if (meaning.includes(pattern)) return false
      }
      
      // 助詞や助動詞的な表現を除外
      if (/^(を|に|で|から|まで|と|や|の|が|は|も|て|で|だ|である)/.test(meaning)) return false
      
      return true
    }
    
    // 同じ品詞の単語を優先的に選択
    const samePartWords = levelWords.filter(word => 
      word.partOfSpeech === currentPartOfSpeech && word.id !== currentWord?.id
    )
    
    // 適切な意味を収集
    const allValidMeanings: string[] = []
    const processWords = (words: any[], limit: number = 100) => {
      const shuffledWords = shuffleArray(words).slice(0, limit)
      shuffledWords.forEach(word => {
        word.meanings.forEach((meaning: string) => {
          if (isValidChoice(meaning) && !allValidMeanings.includes(meaning)) {
            allValidMeanings.push(meaning)
          }
        })
      })
    }
    
    // まず同じ品詞から選択を試行
    if (samePartWords.length > 0) {
      processWords(samePartWords, 50)
    }
    
    // 不足している場合は他の品詞からも選択
    if (allValidMeanings.length < 10) {
      const otherWords = levelWords.filter(word => 
        word.partOfSpeech !== currentPartOfSpeech && word.id !== currentWord?.id
      )
      processWords(otherWords, 100)
    }
    
    // さらに不足している場合は他のレベルからも選択
    if (allValidMeanings.length < 10) {
      const allLevels = ['basic', 'intermediate', 'advanced', 'expert'] as const
      for (const otherLevel of allLevels) {
        if (otherLevel !== level) {
          const otherLevelWords = getVocabularyByLevel(otherLevel)
          processWords(otherLevelWords, 50)
          if (allValidMeanings.length >= 15) break
        }
      }
    }
    
    // 選択肢を選択
    const shuffledMeanings = shuffleArray(allValidMeanings)
    const wrongOptions = shuffledMeanings.slice(0, 3).map(meaning => ({
      meaning,
      isCorrect: false
    }))
    
    // 十分な選択肢がない場合の高品質バックアップ選択肢
    const getBackupChoices = (partOfSpeech: string, wordLevel: string): string[] => {
      if (partOfSpeech === 'adverb') {
        return [
          "効果的に", "効率的に", "適切に", "正確に", "明確に", "完全に", "部分的に",
          "直接的に", "間接的に", "具体的に", "抽象的に", "最終的に", "最初に",
          "特に", "主に", "一般的に", "通常", "常に", "時々", "頻繁に"
        ]
      } else if (partOfSpeech === 'verb') {
        return [
          "実施する", "実行する", "管理する", "運営する", "監督する", "支援する",
          "開発する", "改善する", "向上させる", "維持する", "保持する", "確保する",
          "分析する", "評価する", "検討する", "調査する", "研究する", "確認する",
          "承認する", "決定する", "提案する", "推奨する", "要求する", "依頼する"
        ]
      } else if (partOfSpeech === 'adjective') {
        return [
          "効果的な", "効率的な", "重要な", "必要な", "適切な", "不適切な",
          "具体的な", "抽象的な", "詳細な", "複雑な", "単純な", "明確な",
          "正確な", "不正確な", "完全な", "不完全な", "十分な", "不十分な",
          "一般的な", "特別な", "基本的な", "高度な", "専門的な", "技術的な"
        ]
      } else { // noun や other
        switch (wordLevel) {
          case 'basic':
            return [
              "会社", "企業", "組織", "部門", "部署", "チーム", "従業員", "職員",
              "会議", "打ち合わせ", "議論", "相談", "計画", "予定", "目標", "目的",
              "方法", "手段", "方式", "システム", "プロセス", "手順", "作業"
            ]
          case 'intermediate':
            return [
              "戦略", "方針", "政策", "制度", "規則", "基準", "標準", "品質",
              "管理", "運営", "経営", "業務", "事業", "活動", "取り組み",
              "分析", "評価", "検討", "研究", "調査", "報告", "結果", "成果"
            ]
          case 'advanced':
            return [
              "最適化", "効率化", "合理化", "標準化", "体系化", "統合", "連携",
              "持続可能性", "競争力", "生産性", "収益性", "信頼性", "透明性",
              "革新", "改革", "変革", "発展", "進歩", "成長", "拡大", "展開"
            ]
          default:
            return [
              "グローバル化", "デジタル化", "自動化", "国際化", "多様化", "専門化",
              "個別化", "カスタマイズ", "パーソナライゼーション", "イノベーション",
              "トランスフォーメーション", "オプティマイゼーション", "シナジー",
              "パラダイム", "フレームワーク", "メソドロジー", "アプローチ"
            ]
        }
      }
    }
    
    // バックアップ選択肢から必要な数を補完
    if (wrongOptions.length < 3) {
      const backupChoices = getBackupChoices(currentPartOfSpeech || 'noun', level)
      const usedMeanings = new Set([correctMeaning, ...wrongOptions.map(opt => opt.meaning)])
      
      const availableBackups = backupChoices.filter(choice => 
        !usedMeanings.has(choice) && isValidChoice(choice)
      )
      
      const shuffledBackups = shuffleArray(availableBackups)
      const neededChoices = 3 - wrongOptions.length
      
      for (let i = 0; i < Math.min(neededChoices, shuffledBackups.length); i++) {
        wrongOptions.push({
          meaning: shuffledBackups[i],
          isCorrect: false
        })
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
    const words = getRandomVocabulary(50) // 50語取得
    
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
              
              {/* 次へボタン */}
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={nextWord}
                  className="px-8 py-2"
                  size="lg"
                >
                  次の問題へ
                </Button>
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
