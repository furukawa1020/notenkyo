'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Volume2, Check, X, RotateCcw, BookOpen, Star, Search, Filter, SortAsc, 
  Bookmark, BookMarked, Heart, HeartOff, FlaskConical, List, Layers } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getAllVocabulary, getVocabularyByLevel, VocabularyEntry } from '@/lib/vocabulary-database'
import { saveTaskProgress } from '@/lib/storage'
import { getUserProfile } from '@/lib/profile-manager'
import VocabularyLearning from '@/components/VocabularyLearning'

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

// 単語の学習状態の型定義
interface VocabLearningState {
  id: string;
  knownStatus: 'known' | 'learning' | 'unknown';
  lastReviewed: string; // ISO日付文字列
  reviewCount: number;
  favorite: boolean;
}

export default function VocabularyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [userAnswer, setUserAnswer] = useState<'correct' | 'incorrect' | null>(null)
  const [studyMode, setStudyMode] = useState<'flashcard' | 'quiz' | 'vocabulary-book'>('flashcard')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  
  // 単語帳モードの追加ステート
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [vocabLearningStates, setVocabLearningStates] = useState<VocabLearningState[]>([])
  const [filterMode, setFilterMode] = useState<'all' | 'favorites' | 'known' | 'unknown'>('all')
  const [showSortOptions, setShowSortOptions] = useState(false)
  const [sortOrder, setSortOrder] = useState<'alphabetical' | 'level' | 'frequency'>('level')
  // ユーザーTOEICスコア
  const [userToeicScore, setUserToeicScore] = useState(600)
  // VocabularyLearningコンポーネントの結果保存用
  const [quizResults, setQuizResults] = useState<{
    totalWords: number;
    correctAnswers: number;
    accuracy: number;
    wordsLearned: string[];
    timeSpent: number;
    level: string;
  } | null>(null)

  const currentWord = vocabulary[currentIndex]

  // 単語帳の学習状態を保存/読み込みする関数
  const saveVocabLearningStates = (states: VocabLearningState[]) => {
    localStorage.setItem('vocabulary-learning-states', JSON.stringify(states))
  }

  const loadVocabLearningStates = (): VocabLearningState[] => {
    const saved = localStorage.getItem('vocabulary-learning-states')
    return saved ? JSON.parse(saved) : []
  }

  // お気に入り状態を切り替える
  const toggleFavorite = (wordId: string) => {
    const updatedStates = [...vocabLearningStates]
    const stateIndex = updatedStates.findIndex(state => state.id === wordId)
    
    if (stateIndex >= 0) {
      // 既存のステートを更新
      updatedStates[stateIndex].favorite = !updatedStates[stateIndex].favorite
    } else {
      // 新しいステートを作成
      updatedStates.push({
        id: wordId,
        knownStatus: 'unknown',
        lastReviewed: new Date().toISOString(),
        reviewCount: 0,
        favorite: true
      })
    }
    
    setVocabLearningStates(updatedStates)
    saveVocabLearningStates(updatedStates)
    
    // お気に入りリストを更新
    const updatedFavorites = updatedStates
      .filter(state => state.favorite)
      .map(state => state.id)
    setFavorites(updatedFavorites)
  }

  // 単語の知識状態を更新
  const updateKnownStatus = (wordId: string, status: 'known' | 'learning' | 'unknown') => {
    const updatedStates = [...vocabLearningStates]
    const stateIndex = updatedStates.findIndex(state => state.id === wordId)
    
    if (stateIndex >= 0) {
      // 既存のステートを更新
      updatedStates[stateIndex].knownStatus = status
      updatedStates[stateIndex].lastReviewed = new Date().toISOString()
      updatedStates[stateIndex].reviewCount += 1
    } else {
      // 新しいステートを作成
      updatedStates.push({
        id: wordId,
        knownStatus: status,
        lastReviewed: new Date().toISOString(),
        reviewCount: 1,
        favorite: false
      })
    }
    
    setVocabLearningStates(updatedStates)
    saveVocabLearningStates(updatedStates)
  }

  // 単語の学習状態を取得
  const getWordLearningState = (wordId: string): VocabLearningState | undefined => {
    return vocabLearningStates.find(state => state.id === wordId)
  }

  // 実際のデータベースから単語を読み込み
  useEffect(() => {
    const loadVocabulary = async () => {
      setIsLoading(true)
      try {
        // ユーザープロファイルの取得
        try {
          const profile = await getUserProfile()
          if (profile && profile.currentToeicScore) {
            setUserToeicScore(profile.currentToeicScore)
          } else {
            // プロファイルが見つからない場合はデフォルト値を使用
            setUserToeicScore(600)
          }
        } catch (error) {
          console.error('Failed to load user profile:', error)
          // エラー時もデフォルト値を使用
          setUserToeicScore(600)
        }
        
        const allVocab = getAllVocabulary()
        const convertedVocab = allVocab
          .map(convertVocabularyEntry)
        setVocabulary(convertedVocab)
        
        // 学習状態を読み込み
        const savedStates = loadVocabLearningStates()
        setVocabLearningStates(savedStates)
        
        // お気に入りリストを更新
        const savedFavorites = savedStates
          .filter(state => state.favorite)
          .map(state => state.id)
        setFavorites(savedFavorites)
      } catch (error) {
        console.error('Failed to load vocabulary:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadVocabulary()
  }, [selectedLevel])

  // 高機能音声再生機能
  const playPronunciation = async (word: string) => {
    try {
      // Web Speech API を使用
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      utterance.rate = 0.8 // ゆっくり
      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Failed to play pronunciation:', error)
    }
  }

  // 単語の検索とフィルタリング
  const getFilteredVocabulary = () => {
    let filteredWords = [...vocabulary]
    
    // 検索語でフィルタリング
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filteredWords = filteredWords.filter(word => 
        word.word.toLowerCase().includes(searchLower) || 
        word.meaning.toLowerCase().includes(searchLower)
      )
    }
    
    // フィルターモードでフィルタリング
    if (filterMode !== 'all') {
      filteredWords = filteredWords.filter(word => {
        const state = getWordLearningState(word.id)
        
        if (filterMode === 'favorites') {
          return state?.favorite === true
        } else if (filterMode === 'known') {
          return state?.knownStatus === 'known'
        } else if (filterMode === 'unknown') {
          return !state || state.knownStatus === 'unknown'
        }
        
        return true
      })
    }
    
    // ソート順に従ってソート
    filteredWords.sort((a, b) => {
      if (sortOrder === 'alphabetical') {
        return a.word.localeCompare(b.word)
      } else if (sortOrder === 'level') {
        return a.level - b.level
      } else if (sortOrder === 'frequency') {
        return b.frequency - a.frequency
      }
      return 0
    })
    
    return filteredWords
  }

  // フィルタリング後の単語リスト
  const filteredVocabulary = getFilteredVocabulary()
  
  // 表示モード切り替え
  const toggleStudyMode = (mode: 'flashcard' | 'quiz' | 'vocabulary-book') => {
    setStudyMode(mode)
    // モード切り替え時にリセット
    setCurrentIndex(0)
    setShowMeaning(false)
    setUserAnswer(null)
  }

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
              {filteredVocabulary.length}語
            </span>
          </div>
        </div>

        {/* 学習モード選択タブ */}
        <Tabs 
          defaultValue="flashcard" 
          value={studyMode}
          onValueChange={(value) => toggleStudyMode(value as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flashcard" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>フラッシュカード</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              <span>4択クイズ</span>
            </TabsTrigger>
            <TabsTrigger value="vocabulary-book" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              <span>単語帳</span>
            </TabsTrigger>
          </TabsList>

          {/* フラッシュカードモード */}
          <TabsContent value="flashcard" className="space-y-6">
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
                    <Badge variant={currentWord.level === 1 ? "default" : 
                               currentWord.level === 2 ? "secondary" : 
                               currentWord.level === 3 ? "destructive" : "outline"}>
                      {getLevelText(currentWord.level)}
                    </Badge>
                    <Badge variant="outline">
                      頻度: {currentWord.frequency}%
                    </Badge>
                    <Badge variant="outline">
                      {currentWord.partOfSpeech}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(currentWord.id)}
                    >
                      {getWordLearningState(currentWord.id)?.favorite ? (
                        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                      ) : (
                        <Heart className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => playPronunciation(currentWord.word)}
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </div>
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
                        onClick={() => {
                          handleAnswer(true);
                          updateKnownStatus(currentWord.id, 'known');
                        }}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <Check className="h-5 w-5 mr-2" />
                        知っていた
                      </Button>
                      <Button
                        onClick={() => {
                          handleAnswer(false);
                          updateKnownStatus(currentWord.id, 'unknown');
                        }}
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
          </TabsContent>

          {/* 4択クイズモード */}
          <TabsContent value="quiz" className="space-y-6">
            {quizResults ? (
              // 結果表示
              <Card>
                <CardHeader>
                  <CardTitle>学習結果</CardTitle>
                  <CardDescription>
                    お疲れさまでした！結果は以下の通りです
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{quizResults.totalWords}</p>
                      <p className="text-sm text-muted-foreground">学習単語数</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{quizResults.correctAnswers}</p>
                      <p className="text-sm text-muted-foreground">正解数</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{Math.round(quizResults.accuracy)}%</p>
                      <p className="text-sm text-muted-foreground">正答率</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{Math.round(quizResults.timeSpent)}分</p>
                      <p className="text-sm text-muted-foreground">学習時間</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setQuizResults(null)} className="w-full">
                    再チャレンジ
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              // VocabularyLearningコンポーネントで4択問題を実装
              <VocabularyLearning
                userLevel={userToeicScore} // ユーザーの実際のTOEICスコアを使用
                sessionDuration={10} // 10分のセッション
                onComplete={(results) => {
                  setQuizResults(results);
                  // 学習進捗も保存
                  saveTaskProgress('vocabulary', {
                    score: results.correctAnswers,
                    totalQuestions: results.totalWords,
                    timeSpent: results.timeSpent,
                    completed: true
                  });
                }}
              />
            )}
          </TabsContent>

          {/* 単語帳モード */}
          <TabsContent value="vocabulary-book" className="space-y-6">
            {/* 検索・フィルター機能 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="単語を検索..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>フィルターとソート</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">表示する単語</h3>
                            <RadioGroup 
                              value={filterMode} 
                              onValueChange={(value) => setFilterMode(value as any)}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="all" />
                                <Label htmlFor="all">すべての単語</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="favorites" id="favorites" />
                                <Label htmlFor="favorites">お気に入りのみ</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="known" id="known" />
                                <Label htmlFor="known">覚えた単語のみ</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="unknown" id="unknown" />
                                <Label htmlFor="unknown">未習得の単語のみ</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">並び順</h3>
                            <RadioGroup 
                              value={sortOrder} 
                              onValueChange={(value) => setSortOrder(value as any)}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="alphabetical" id="alphabetical" />
                                <Label htmlFor="alphabetical">アルファベット順</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="level" id="level" />
                                <Label htmlFor="level">難易度順</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="frequency" id="frequency" />
                                <Label htmlFor="frequency">出現頻度順</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {filteredVocabulary.length}語が見つかりました
                    </div>
                    <Select 
                      value={selectedLevel}
                      onValueChange={(value) => setSelectedLevel(value as any)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="レベルを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべてのレベル</SelectItem>
                        <SelectItem value="beginner">初級 (400-500点)</SelectItem>
                        <SelectItem value="intermediate">中級 (500-700点)</SelectItem>
                        <SelectItem value="advanced">上級 (700点以上)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 単語リスト */}
            <div className="space-y-3">
              {filteredVocabulary.length > 0 ? (
                filteredVocabulary.map((word, index) => {
                  const learningState = getWordLearningState(word.id)
                  return (
                    <Card key={word.id} className="hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold">{word.word}</h3>
                              <Badge variant="outline">{word.partOfSpeech}</Badge>
                              {learningState?.knownStatus === 'known' && (
                                <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">覚えた</div>
                              )}
                            </div>
                            <p className="text-gray-600">{word.pronunciation}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(word.id)}
                            >
                              {learningState?.favorite ? (
                                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                              ) : (
                                <Heart className="h-5 w-5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => playPronunciation(word.word)}
                            >
                              <Volume2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="font-medium text-blue-600">{word.meaning}</p>
                          {word.exampleSentences.length > 0 && (
                            <p className="text-sm text-gray-700 mt-2 italic">
                              "{word.exampleSentences[0].english}"
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateKnownStatus(word.id, 'known')}
                              className={`${learningState?.knownStatus === 'known' ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              覚えた
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateKnownStatus(word.id, 'learning')}
                              className={`${learningState?.knownStatus === 'learning' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : ''}`}
                            >
                              <BookOpen className="h-4 w-4 mr-1" />
                              学習中
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateKnownStatus(word.id, 'unknown')}
                              className={`${learningState?.knownStatus === 'unknown' || !learningState ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                            >
                              <X className="h-4 w-4 mr-1" />
                              未習得
                            </Button>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                詳細を見る
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <span className="text-2xl">{word.word}</span>
                                  <Badge variant="outline">{word.partOfSpeech}</Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => playPronunciation(word.word)}
                                  >
                                    <Volume2 className="h-4 w-4" />
                                  </Button>
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-sm font-medium mb-1">発音</h3>
                                  <p>{word.pronunciation}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium mb-1">意味</h3>
                                  <ul className="list-disc pl-5">
                                    {word.meanings.map((meaning, idx) => (
                                      <li key={idx}>{meaning}</li>
                                    ))}
                                  </ul>
                                </div>
                                {word.exampleSentences.length > 0 && (
                                  <div>
                                    <h3 className="text-sm font-medium mb-1">例文</h3>
                                    <div className="space-y-2">
                                      {word.exampleSentences.map((sentence, idx) => (
                                        <div key={idx} className="p-2 bg-gray-50 rounded">
                                          <p className="italic">{sentence.english}</p>
                                          <p className="text-gray-600">{sentence.japanese}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {word.synonyms.length > 0 && (
                                  <div>
                                    <h3 className="text-sm font-medium mb-1">類義語</h3>
                                    <div className="flex flex-wrap gap-1">
                                      {word.synonyms.map((syn, idx) => (
                                        <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">{syn}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {word.antonyms.length > 0 && (
                                  <div>
                                    <h3 className="text-sm font-medium mb-1">反意語</h3>
                                    <div className="flex flex-wrap gap-1">
                                      {word.antonyms.map((ant, idx) => (
                                        <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">{ant}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="flex justify-between items-center pt-4">
                                  <div>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      word.level === 1 ? "bg-green-100 text-green-800" : 
                                      word.level === 2 ? "bg-yellow-100 text-yellow-800" : 
                                      word.level === 3 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                                    }`}>
                                      {getLevelText(word.level)}
                                    </span>
                                    <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium ml-2">
                                      頻度: {word.frequency}%
                                    </span>
                                  </div>
                                  <Button 
                                    variant={learningState?.favorite ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleFavorite(word.id)}
                                  >
                                    {learningState?.favorite ? (
                                      <>
                                        <Heart className="h-4 w-4 mr-2 fill-current" />
                                        お気に入り登録済み
                                      </>
                                    ) : (
                                      <>
                                        <Heart className="h-4 w-4 mr-2" />
                                        お気に入りに追加
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">該当する単語がありません</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
