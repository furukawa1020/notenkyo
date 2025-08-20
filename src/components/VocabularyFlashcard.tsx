'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Search,
  Tag,
  X,
  Volume2,
  Star,
  StarHalf,
  Star as StarOff,
  BookmarkPlus,
  ArrowUpDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import {
  BASIC_VOCABULARY,
  INTERMEDIATE_VOCABULARY,
  ADVANCED_VOCABULARY,
  EXPERT_VOCABULARY,
  VocabularyEntry
} from '@/lib/enhanced-vocabulary-database'

// 閲覧履歴のための垁E
type VocabularyHistory = {
  id: string
  timestamp: number
  isFavorite: boolean
}

const VocabularyFlashcard: React.FC = () => {
  // 状態管琁E
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [sortOrder, setSortOrder] = useState<'az' | 'za'>('az')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [favorites, setFavorites] = useState<string[]>([])
  const [viewHistory, setViewHistory] = useState<VocabularyHistory[]>([])
  const [isFlashcardMode, setIsFlashcardMode] = useState(false)
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [filteredWords, setFilteredWords] = useState<VocabularyEntry[]>([])

  const router = useRouter()

  // 全単語データを結合
  const allVocabulary = [
    ...BASIC_VOCABULARY,
    ...INTERMEDIATE_VOCABULARY,
    ...ADVANCED_VOCABULARY,
    ...EXPERT_VOCABULARY
  ]

  // ローカルストレージからお気に入りと閲覧履歴を取征E
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('vocabulary_favorites')
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }

      const storedHistory = localStorage.getItem('vocabulary_history')
      if (storedHistory) {
        setViewHistory(JSON.parse(storedHistory))
      }
    } catch (error) {
      console.error('ローカルストレージからの読み込みエラー:', error)
    }
  }, [])

  // お気に入り�E保孁E
  useEffect(() => {
    try {
      localStorage.setItem('vocabulary_favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('お気に入り�E保存エラー:', error)
    }
  }, [favorites])

  // 履歴の保孁E
  useEffect(() => {
    try {
      localStorage.setItem('vocabulary_history', JSON.stringify(viewHistory))
    } catch (error) {
      console.error('履歴の保存エラー:', error)
    }
  }, [viewHistory])

  // 単語�Eフィルタリング処琁E
  useEffect(() => {
    let result = [...allVocabulary]

    // 検索フィルタリング
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(word =>
        word.word.toLowerCase().includes(lowerSearchTerm) ||
        word.meanings.some(meaning => meaning.includes(searchTerm))
      )
    }

    // タブによるフィルタリング
    if (activeTab !== 'all') {
      if (activeTab === 'favorites') {
        result = result.filter(word => favorites.includes(word.id))
      } else if (activeTab === 'history') {
        const historyIds = viewHistory.map(h => h.id)
        result = result.filter(word => historyIds.includes(word.id))
        // 履歴頁E��ソーチE
        result.sort((a, b) => {
          const aTimestamp = viewHistory.find(h => h.id === a.id)?.timestamp || 0
          const bTimestamp = viewHistory.find(h => h.id === b.id)?.timestamp || 0
          return bTimestamp - aTimestamp
        })
      } else if (['basic', 'intermediate', 'advanced', 'expert'].includes(activeTab)) {
        result = result.filter(word => word.level === activeTab)
      }
    }

    // ソート�E琁E
    if (activeTab !== 'history') {
      result.sort((a, b) => {
        return sortOrder === 'az'
          ? a.word.localeCompare(b.word)
          : b.word.localeCompare(a.word)
      })
    }

    setFilteredWords(result)
    setCurrentPage(1)
  }, [searchTerm, activeTab, sortOrder, favorites, viewHistory, allVocabulary])

  // 単語を閲覧した時�E処琁E
  const viewWord = (wordId: string) => {
    const now = Date.now()

    // 既存�E履歴から該当頁E��を削除
    const newHistory = viewHistory.filter(item => item.id !== wordId)

    // 履歴の先頭に追加
    const isFavorite = favorites.includes(wordId)
    newHistory.unshift({ id: wordId, timestamp: now, isFavorite })

    // 履歴は最大100件まで
    const limitedHistory = newHistory.slice(0, 100)
    setViewHistory(limitedHistory)
  }

  // お気に入り状態�Eり替ぁE
  const toggleFavorite = (wordId: string) => {
    if (favorites.includes(wordId)) {
      setFavorites(favorites.filter(id => id !== wordId))
    } else {
      setFavorites([...favorites, wordId])
    }

    // 履歴冁E�Eお気に入り状態も更新
    const updatedHistory = viewHistory.map(item =>
      item.id === wordId
        ? { ...item, isFavorite: !favorites.includes(wordId) }
        : item
    )
    setViewHistory(updatedHistory)
  }

  // フラチE��ュカードモード�E開姁E
  const startFlashcardMode = () => {
    if (filteredWords.length === 0) return

    setIsFlashcardMode(true)
    setCurrentFlashcardIndex(0)
    setShowMeaning(false)

    // 最初�E単語を履歴に追加
    if (filteredWords.length > 0) {
      viewWord(filteredWords[0].id)
    }
  }

  // フラチE��ュカード�E次へ
  const nextFlashcard = () => {
    if (currentFlashcardIndex < filteredWords.length - 1) {
      const nextIndex = currentFlashcardIndex + 1
      setCurrentFlashcardIndex(nextIndex)
      setShowMeaning(false)
      viewWord(filteredWords[nextIndex].id)
    }
  }

  // フラチE��ュカード�E前へ
  const prevFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      const prevIndex = currentFlashcardIndex - 1
      setCurrentFlashcardIndex(prevIndex)
      setShowMeaning(false)
      viewWord(filteredWords[prevIndex].id)
    }
  }

  // 発音機�E
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  // ペ�Eジング処琁E
  const totalPages = Math.ceil(filteredWords.length / itemsPerPage)
  const currentItems = filteredWords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // フラチE��ュカードモード�E表示
  if (isFlashcardMode && filteredWords.length > 0) {
    const currentWord = filteredWords[currentFlashcardIndex]

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsFlashcardMode(false)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              戻めE
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {currentFlashcardIndex + 1} / {filteredWords.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(currentWord.id)}
              >
                {favorites.includes(currentWord.id) ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          <CardTitle className="mt-4">�t���b�V���J�[�h</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="min-h-[300px] flex flex-col items-center justify-center space-y-4 p-6 border rounded-lg">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold">{currentWord.word}</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg text-muted-foreground">
                  {currentWord.pronunciation}
                </span>
                <Button variant="ghost" size="sm" onClick={() => speakWord(currentWord.word)}>
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="outline">{currentWord.partOfSpeech}</Badge>
              <Badge variant="secondary">{currentWord.level.toUpperCase()}</Badge>
            </div>

            {showMeaning ? (
              <div className="mt-6 text-center">
                <h3 className="font-semibold mb-2">意味:</h3>
                <ul className="space-y-1">
                  {currentWord.meanings.map((meaning, index) => (
                    <li key={index}>{meaning}</li>
                  ))}
                </ul>

                <h3 className="font-semibold mb-2 mt-4">例文:</h3>
                {currentWord.exampleSentences.map((sentence, index) => (
                  <div key={index} className="text-sm space-y-1 mt-2">
                    <p>{sentence.english}</p>
                    <p className="text-muted-foreground">{sentence.japanese}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowMeaning(true)}
                className="mt-6"
              >
                意味を表示
              </Button>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevFlashcard}
              disabled={currentFlashcardIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              前へ
            </Button>
            <Button
              variant="outline"
              onClick={nextFlashcard}
              disabled={currentFlashcardIndex === filteredWords.length - 1}
            >
              次へ
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 通常モード�E表示
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            単語帳
          </CardTitle>
          <Button variant="outline" onClick={() => router.push('/study/vocabulary')}>
            �w�K���[�h�ց�
          </Button>
        </div>
        <CardDescription>
          TOEIC対策用の12,000語から単語を検索・閲覧できまぁE
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 検索機�E */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="単語や意味で検索..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'az' ? 'za' : 'az')}
            title={sortOrder === 'az' ? 'A→Z頁E : 'Z→A頁E}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={startFlashcardMode}
            disabled={filteredWords.length === 0}
            title="フラチE��ュカードモーチE
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* タチE*/}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-6">
            <TabsTrigger value="all">全て</TabsTrigger>
            <TabsTrigger value="favorites">お気に入めE/TabsTrigger>
            <TabsTrigger value="history">履歴</TabsTrigger>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="intermediate">Inter</TabsTrigger>
            <TabsTrigger value="advanced">Adv</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {currentItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                単語が見つかりません
              </div>
            ) : (
              <div className="space-y-4">
                {currentItems.map(word => (
                  <Card key={word.id} className="overflow-hidden">
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => {
                        viewWord(word.id)
                        const wordElement = document.getElementById(`word-details-${word.id}`)
                        if (wordElement) {
                          const isVisible = wordElement.classList.contains('hidden')
                          if (isVisible) {
                            wordElement.classList.remove('hidden')
                          } else {
                            wordElement.classList.add('hidden')
                          }
                        }
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{word.word}</h3>
                          <p className="text-sm text-muted-foreground">{word.pronunciation}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{word.partOfSpeech}</Badge>
                          <Badge variant="secondary">{word.level.toUpperCase()}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              speakWord(word.word)
                            }}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(word.id)
                            }}
                          >
                            {favorites.includes(word.id) ? (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div id={`word-details-${word.id}`} className="px-4 pb-4 pt-0 hidden">
                      <div className="border-t pt-3 mt-2">
                        <h4 className="font-semibold mb-2">意味:</h4>
                        <ul className="space-y-1">
                          {word.meanings.map((meaning, index) => (
                            <li key={index}>{meaning}</li>
                          ))}
                        </ul>

                        <h4 className="font-semibold mb-2 mt-4">例文:</h4>
                        {word.exampleSentences.map((sentence, index) => (
                          <div key={index} className="text-sm space-y-1 mt-2">
                            <p>{sentence.english}</p>
                            <p className="text-muted-foreground">{sentence.japanese}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* ペ�Eジネ�Eション */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default VocabularyFlashcard
