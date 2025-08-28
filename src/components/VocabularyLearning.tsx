'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { VocabularyEntry, getVocabularyByLevel, getRandomVocabulary } from '@/lib/enhanced-vocabulary-database'
import { getQuizWords, hybridVocabularySystem, UnifiedVocabularyEntry } from '@/lib/hybrid-vocabulary-system'
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
  const [currentWord, setCurrentWord] = useState<UnifiedVocabularyEntry | null>(null)
  const [sessionWords, setSessionWords] = useState<UnifiedVocabularyEntry[]>([])
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

  // 不正解の選択肢を生成する関数（確実版）
  const generateWrongChoices = (correctMeaning: string, currentWord: UnifiedVocabularyEntry): ChoiceOption[] => {
    // 確実にクリーンな意味のプール
    const cleanMeanings = [
      "管理する", "実施する", "確認する", "提供する", "支援する",
      "達成する", "成し遂げる", "受け入れる", "承諾する", "加える", "追加する",
      "同意する", "合意する", "許可する", "可能にする", "答える", "応答する",
      "現れる", "見える", "申し込む", "適用する", "到着する", "着く",
      "尋ねる", "頼む", "能力", "才能", "について", "およそ",
      "の上に", "以上", "横切って", "全体に", "後に", "後で",
      "に対して", "に反対して", "に沿って", "と一緒に", "の間で", "の中で",
      "周りに", "前に", "以前に", "建物", "構造", "事業", "会社",
      "変更", "変化", "選択", "選ぶ", "市民", "都市", "清潔", "きれい",
      "閉じる", "近い", "色", "来る", "共通", "一般的", "完全", "全部",
      "考える", "思う", "続ける", "継続", "作る", "創造", "切る", "日", "決める",
      "発展", "開発", "違い", "異なる", "行う", "教育", "効果", "終わり",
      "環境", "等しい", "特に", "例", "経験", "説明", "事実", "家族",
      "感じる", "分野", "見つける", "従う", "食べ物", "力", "忘れる", "形",
      "友達", "完全", "与える", "政府", "グループ", "成長", "手", "起こる",
      "健康", "助ける", "歴史", "家", "重要", "含む", "増加", "情報",
      "代わりに", "関心", "国際", "仕事", "加わる", "保つ", "種類", "知識",
      "土地", "言語", "大きい", "学ぶ", "去る", "レベル", "生活", "線",
      "リスト", "住む", "地方", "見る", "作る", "管理", "市場", "意味",
      "会う", "メンバー", "方法", "お金", "動く", "音楽", "名前", "国",
      "必要", "新しい", "ニュース", "次", "数", "提供", "注文", "組織",
      "その他", "ページ", "部分", "特に", "人", "場所", "計画", "遊ぶ",
      "点", "政策", "可能", "力", "現在", "問題", "プログラム", "提供",
      "公共", "目的", "質問", "理由", "受ける", "関係", "記憶", "報告",
      "結果", "右", "部屋", "実行", "学校", "科学", "見る", "服務",
      "設定", "示す", "社会", "何か", "話す", "特別", "状態", "物語",
      "研究", "システム", "取る", "話", "税", "教える", "技術", "考える",
      "時間", "今日", "一緒", "トップ", "貿易", "訓練", "旅行", "試す",
      "タイプ", "理解", "使う", "価値", "様々", "見る", "方法", "働く",
      "世界", "書く", "年", "若い"
    ]
    
    // 正解の意味と重複しないものをランダムに選択
    const availableMeanings = cleanMeanings.filter(meaning => meaning !== correctMeaning)
    
    const wrongMeanings: string[] = []
    const shuffled = [...availableMeanings].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < Math.min(3, shuffled.length); i++) {
      wrongMeanings.push(shuffled[i])
    }
    
    return wrongMeanings.slice(0, 3).map(meaning => ({
      meaning,
      isCorrect: false
    }))
  }

  // 4つの選択肢を生成
  const generateOptions = (word: UnifiedVocabularyEntry): ChoiceOption[] => {
    if (!word) return []
    
    // 重要単語の正しい意味辞書
    const correctMeaningsDict: { [key: string]: string } = {
      'today': '今日',
      'copy': 'コピー',
      'follow': '従う',
      'community': 'コミュニティ',
      'company': '会社',
      'people': '人々',
      'time': '時間',
      'work': '仕事',
      'way': '方法',
      'day': '日',
      'make': '作る',
      'get': '得る',
      'take': '取る',
      'come': '来る',
      'give': '与える',
      'use': '使う',
      'find': '見つける',
      'tell': '伝える',
      'ask': '尋ねる',
      'seem': '思われる',
      'feel': '感じる',
      'try': '試す',
      'leave': '去る',
      'call': '呼ぶ',
      'keep': '保つ',
      'let': 'させる',
      'begin': '始める',
      'help': '助ける',
      'show': '示す',
      'hear': '聞く',
      'play': '遊ぶ',
      'run': '走る',
      'move': '動く',
      'live': '住む',
      'bring': '持ってくる',
      'happen': '起こる',
      'write': '書く',
      'provide': '提供する',
      'sit': '座る',
      'stand': '立つ',
      'lose': '失う',
      'pay': '支払う',
      'meet': '会う',
      'include': '含む',
      'continue': '続ける',
      'set': '設定する',
      'learn': '学ぶ',
      'change': '変える',
      'lead': '導く',
      'understand': '理解する',
      'watch': '見る',
      'stop': '止める',
      'create': '創造する',
      'speak': '話す',
      'read': '読む',
      'allow': '許可する',
      'add': '加える',
      'spend': '費やす',
      'grow': '成長する',
      'open': '開く',
      'walk': '歩く',
      'win': '勝つ',
      'offer': '提供する',
      'remember': '覚える',
      'love': '愛する',
      'consider': '考慮する',
      'appear': '現れる',
      'buy': '買う',
      'wait': '待つ',
      'serve': '仕える',
      'die': '死ぬ',
      'send': '送る',
      'expect': '期待する',
      'build': '建てる',
      'stay': '滞在する',
      'fall': '落ちる',
      'cut': '切る',
      'reach': '到達する',
      'kill': '殺す',
      'remain': '残る',
      // 問題のある基本名詞を追加
      'case': '場合',
      'cat': '猫',
      'chair': '椅子',
      'child': '子供',
      'city': '都市',
      'class': 'クラス',
      'club': 'クラブ',
      'code': 'コード',
      'color': '色',
      'cost': '費用',
      'data': 'データ',
      'deal': '取引',
      'desk': '机',
      'door': 'ドア',
      'drug': '薬',
      'eye': '目',
      'face': '顔',
      'fact': '事実',
      'family': '家族',
      'file': 'ファイル',
      'fire': '火',
      'food': '食べ物',
      'form': '形',
      'game': 'ゲーム',
      'goal': '目標',
      'group': 'グループ',
      'hand': '手',
      'head': '頭',
      'health': '健康',
      'heart': '心',
      'home': '家',
      'hour': '時間',
      'house': '家',
      'idea': 'アイデア',
      'image': '画像',
      'information': '情報',
      'issue': '問題',
      'item': 'アイテム',
      'job': '仕事',
      'kind': '種類',
      'law': '法律',
      'level': 'レベル',
      'life': '人生',
      'line': '線',
      'list': 'リスト',
      'man': '男性',
      'market': '市場',
      'member': 'メンバー',
      'method': '方法',
      'mind': '心',
      'minute': '分',
      'model': 'モデル',
      'money': 'お金',
      'month': '月',
      'name': '名前',
      'nature': '自然',
      'news': 'ニュース',
      'night': '夜',
      'number': '数',
      'office': 'オフィス',
      'order': '注文',
      'page': 'ページ',
      'part': '部分',
      'party': 'パーティー',
      'person': '人',
      'place': '場所',
      'plan': '計画',
      'point': 'ポイント',
      'policy': '政策',
      'power': '力',
      'price': '価格',
      'problem': '問題',
      'process': 'プロセス',
      'product': '商品',
      'program': 'プログラム',
      'project': 'プロジェクト',
      'question': '質問',
      'reason': '理由',
      'result': '結果',
      'right': '権利',
      'room': '部屋',
      'school': '学校',
      'service': 'サービス',
      'side': '側',
      'size': 'サイズ',
      'state': '状態',
      'story': '物語',
      'student': '学生',
      'study': '研究',
      'system': 'システム',
      'table': 'テーブル',
      'team': 'チーム',
      'technology': '技術',
      'term': '用語',
      'thing': '物',
      'type': 'タイプ',
      'value': '価値',
      'war': '戦争',
      'water': '水',
      'week': '週',
      'woman': '女性',
      'word': '単語',
      'world': '世界',
      'year': '年',
      // 追加の重要TOEIC単語（重複除去済み）
      'farm': '農場',
      'field': '分野',
      'film': '映画',
      'fish': '魚',
      'foot': '足',
      'girl': '女の子',
      'gold': '金',
      'hair': '髪',
      'heat': '熱',
      'hill': '丘',
      'hope': '希望',
      'king': '王',
      'land': '土地',
      'leg': '足',
      'letter': '手紙',
      'light': '光',
      'link': 'リンク',
      'mail': 'メール',
      'map': '地図',
      'mark': 'マーク',
      'mass': '大量',
      'match': '試合',
      'meal': '食事',
      'meat': '肉',
      'milk': '牛乳',
      'moon': '月',
      'music': '音楽',
      'need': '必要',
      'note': 'ノート',
      'oil': '石油',
      'owner': '所有者',
      'pain': '痛み',
      'paper': '紙',
      'park': '公園',
      'path': '道',
      'peace': '平和',
      'phone': '電話',
      'photo': '写真',
      'piece': '部分',
      'plant': '植物',
      'plate': '皿',
      'player': '選手',
      'police': '警察',
      'pool': 'プール',
      'post': '投稿',
      'pound': 'ポンド',
      'press': '押す',
      'radio': 'ラジオ',
      'rain': '雨',
      'range': '範囲',
      'rate': '料金',
      'record': '記録',
      'region': '地域',
      'report': '報告',
      'rest': '休息',
      'review': 'レビュー',
      'risk': 'リスク',
      'river': '川',
      'road': '道路',
      'rock': '岩',
      'role': '役割',
      'rule': 'ルール',
      'safe': '安全',
      'sale': '販売',
      'scene': '場面',
      'score': 'スコア',
      'sea': '海',
      'seat': '座席',
      'section': 'セクション',
      'sense': '感覚',
      'series': 'シリーズ',
      'shape': '形',
      'share': '共有',
      'sheet': 'シート',
      'shop': '店',
      'shot': '撃つ',
      'site': 'サイト',
      'skill': 'スキル',
      'skin': '肌',
      'sky': '空',
      'snow': '雪',
      'soil': '土',
      'son': '息子',
      'song': '歌',
      'sound': '音',
      'space': '空間',
      'speed': 'スピード',
      'sport': 'スポーツ',
      'staff': 'スタッフ',
      'stage': 'ステージ',
      'star': '星',
      'step': 'ステップ',
      'stock': '株',
      'stone': '石',
      'store': '店',
      'style': 'スタイル',
      'sun': '太陽',
      'task': 'タスク',
      'tax': '税金',
      'teacher': '先生',
      'test': 'テスト',
      'text': 'テキスト',
      'theme': 'テーマ',
      'theory': '理論',
      'thought': '考え',
      'thread': 'スレッド',
      'title': 'タイトル',
      'tool': '道具',
      'topic': 'トピック',
      'town': '町',
      'track': 'トラック',
      'trade': '貿易',
      'tree': '木',
      'trip': '旅行',
      'truck': 'トラック',
      'truth': '真実',
      'unit': '単位',
      'user': 'ユーザー',
      'view': '見解',
      'voice': '声',
      'vote': '投票',
      'wall': '壁',
      'wave': '波',
      'weight': '重さ',
      'wife': '妻',
      'wind': '風',
      'wine': 'ワイン',
      'wood': '木',
      'yard': '庭',
      // searchの正しい意味を追加
      'search': '探す'
    }
    
    // 適切な正解の意味を選択する関数
    const getCleanCorrectMeaning = (word: UnifiedVocabularyEntry): string => {
      // まず辞書から正しい意味を確認
      const dictMeaning = correctMeaningsDict[word.word.toLowerCase()]
      if (dictMeaning) {
        return dictMeaning
      }
      
      // 不適切な意味をフィルタリング
      const isValidMeaning = (meaning: string): boolean => {
        if (!meaning || meaning.trim().length === 0) return false
        if (meaning === "〜" || meaning === "物事") return false
        
        const lowerMeaning = meaning.toLowerCase()
        const wordName = word.word.toLowerCase()
        
        // 単語名を含む説明的文言を除外
        if (lowerMeaning.includes(wordName)) return false
        if (lowerMeaning.includes("の意味") || lowerMeaning.includes("における")) return false
        if (lowerMeaning.includes("上級") || lowerMeaning.includes("専門")) return false
        if (lowerMeaning.includes("高度な") || lowerMeaning.includes("advanced")) return false
        
        return true
      }
      
      // 単語の意味から適切なものを探す
      for (const meaning of word.meanings) {
        if (isValidMeaning(meaning)) {
          return meaning
        }
      }
      
      // 適切な意味が見つからない場合のフォールバック
      // 品詞別の一般的な説明ではなく、基本的な意味を提供
      const fallbackMeanings: { [key: string]: string } = {
        'noun': '名詞',
        'verb': '動詞', 
        'adjective': '形容詞',
        'adverb': '副詞',
        'preposition': '前置詞',
        'pronoun': '代名詞',
        'conjunction': '接続詞'
      }
      
      // partOfSpeechが配列の場合は最初の要素を使用
      const partOfSpeech = Array.isArray(word.partOfSpeech) ? word.partOfSpeech[0] : word.partOfSpeech
      return fallbackMeanings[partOfSpeech] || 'TOEIC重要単語'
    }
    
    // 正解の選択肢（適切な意味を選択）
    const correctMeaning = getCleanCorrectMeaning(word)
    const correctOption: ChoiceOption = { 
      meaning: correctMeaning, 
      isCorrect: true 
    }
    
    // 不正解の選択肢を生成（対象単語の情報を渡す）
    const wrongOptions = generateWrongChoices(correctOption.meaning, word)
    
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
    // 🎯 四択問題用：高品質金フレデータを使用
    const words = getQuizWords(level, 50) 
    
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
      if (currentWord?.word) {
        setWordsLearned([...wordsLearned, currentWord.word])
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
