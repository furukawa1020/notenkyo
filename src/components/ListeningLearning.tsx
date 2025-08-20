'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Headphones, Play, Pause, RotateCcw, CheckCircle, XCircle, Target, Clock, Volume2 } from 'lucide-react'
import { generateRealisticListeningAudio, globalAudioManager } from '@/lib/audio-manager'

// リスニング問題の型定義
interface ListeningAudio {
  id: string
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  category: string
  title: string
  transcript: string
  audioElement: HTMLAudioElement | null // 実際の音声要素
  duration: number // 秒
  questions: ListeningQuestion[]
}

interface ListeningQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

interface ListeningLearningProps {
  userLevel: number
  sessionDuration: number
  onComplete: (results: ListeningSessionResults) => void
}

interface ListeningSessionResults {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  pointsEarned: number
  timeSpent: number
  level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  audiosCompleted: number
  averagePlayCount: number
}

// モックリスニング音声データ
const listeningAudios: Omit<ListeningAudio, 'audioElement'>[] = [
  {
    id: 'listening_basic_001',
    level: 'basic',
    category: 'Daily Conversation',
    title: 'Restaurant Order',
    transcript: `Customer: Good evening. I'd like to make a reservation for two people.
Host: Certainly. What time would you prefer?
Customer: Around 7 PM, please.
Host: I'm sorry, but we're fully booked at 7. How about 6:30 or 8:00?
Customer: 8:00 would be perfect.
Host: Great! May I have your name and phone number?
Customer: It's John Smith, and my number is 555-0123.
Host: Thank you, Mr. Smith. We'll see you at 8:00.`,
    duration: 45,
    questions: [
      {
        id: 'lb001_q1',
        question: 'How many people is the reservation for?',
        options: ['One person', 'Two people', 'Three people', 'Four people'],
        correctAnswer: 1,
        explanation: 'Customer が "for two people" と言っています。',
        points: 10
      },
      {
        id: 'lb001_q2',
        question: 'What time did the customer finally book?',
        options: ['6:30 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
        correctAnswer: 2,
        explanation: 'Customer が "8:00 would be perfect" と答えています。',
        points: 10
      }
    ]
  },
  {
    id: 'listening_intermediate_001',
    level: 'intermediate',
    category: 'Business Meeting',
    title: 'Project Status Update',
    transcript: `Manager: Good morning, everyone. Let's start with the quarterly project review. Sarah, could you give us an update on the marketing campaign?
Sarah: Of course. We've completed the research phase and are now 60% through the design process. The launch is still scheduled for next month, but we might need an additional week for final testing.
Manager: I see. What about the budget situation?
Sarah: We're currently 5% under budget, which gives us some flexibility. However, if we extend the timeline, we'll need to allocate additional resources for overtime.
Manager: That sounds reasonable. Mark, how is the technical implementation progressing?
Mark: The backend development is finished, and we're now focusing on user interface optimization. I estimate we'll be ready for integration testing by Friday.`,
    duration: 75,
    questions: [
      {
        id: 'li001_q1',
        question: 'What percentage of the design process is completed?',
        options: ['40%', '50%', '60%', '70%'],
        correctAnswer: 2,
        explanation: 'Sarah が "60% through the design process" と言っています。',
        points: 15
      },
      {
        id: 'li001_q2',
        question: 'When will the integration testing be ready?',
        options: ['Next Monday', 'Wednesday', 'Friday', 'Next month'],
        correctAnswer: 2,
        explanation: 'Mark が "ready for integration testing by Friday" と答えています。',
        points: 15
      }
    ]
  },
  {
    id: 'listening_advanced_001',
    level: 'advanced',
    category: 'Academic Lecture',
    title: 'Economic Policy Analysis',
    transcript: `Professor: Today we'll examine the correlation between monetary policy and inflation rates in developed economies. Recent data suggests that quantitative easing measures implemented during the 2008 financial crisis had varying degrees of effectiveness across different markets.

The Federal Reserve's approach differed significantly from the European Central Bank's strategy. While the Fed focused primarily on asset purchases and lowering interest rates, the ECB emphasized direct lending to financial institutions. These divergent methodologies resulted in contrasting recovery patterns.

Furthermore, the long-term implications of these policies continue to influence current economic conditions. Inflation targeting, once considered the gold standard of monetary policy, now faces scrutiny as central banks grapple with persistently low inflation rates despite expansionary measures.`,
    duration: 90,
    questions: [
      {
        id: 'la001_q1',
        question: 'What did the Federal Reserve focus primarily on?',
        options: ['Direct lending', 'Asset purchases and lowering rates', 'Inflation targeting', 'Institution supervision'],
        correctAnswer: 1,
        explanation: 'Fed は "asset purchases and lowering interest rates" に focus したと述べられています。',
        points: 20
      },
      {
        id: 'la001_q2',
        question: 'What challenge do central banks currently face?',
        options: ['High inflation', 'Persistently low inflation', 'Asset bubbles', 'Currency instability'],
        correctAnswer: 1,
        explanation: '"persistently low inflation rates" が現在の課題として言及されています。',
        points: 20
      }
    ]
  }
]

export default function ListeningLearning({
  userLevel,
  sessionDuration,
  onComplete
}: ListeningLearningProps) {
  const [currentAudio, setCurrentAudio] = useState<ListeningAudio | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [sessionAudios, setSessionAudios] = useState<ListeningAudio[]>([])
  const [audioIndex, setAudioIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [sessionActive, setSessionActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60)
  
  // 音声再生関連
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playCount, setPlayCount] = useState(0)
  const [totalPlayCounts, setTotalPlayCounts] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const [volume, setVolume] = useState([80])
  const [audioReady, setAudioReady] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  
  // 音声要素の参照
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // TOEIC スコアからレベルを決定
  const determineLevel = (score: number): 'basic' | 'intermediate' | 'advanced' | 'expert' => {
    if (score < 500) return 'basic'
    if (score < 700) return 'intermediate'
    if (score < 850) return 'advanced'
    return 'expert'
  }

  // セッション開始
  const startSession = async () => {
    const level = determineLevel(userLevel)
    const levelAudios = listeningAudios.filter(a => a.level === level)
    
    const shuffled = [...levelAudios].sort(() => Math.random() - 0.5)
    const sessionAs = shuffled.slice(0, Math.min(3, shuffled.length))

    // 音声を生成
    setAudioLoading(true)
    const audiosWithAudio: ListeningAudio[] = []
    
    for (const audioData of sessionAs) {
      try {
        const audioElement = await globalAudioManager.playListeningAudio('')
        
        // TTS音声を生成
        const utterance = new SpeechSynthesisUtterance(audioData.transcript)
        
        // 音声設定
        const voices = speechSynthesis.getVoices()
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en-') && 
          !voice.name.includes('Google')
        ) || voices.find(voice => voice.lang.startsWith('en-'))

        if (englishVoice) {
          utterance.voice = englishVoice
        }

        utterance.rate = 0.85 // TOEICリスニング相当
        utterance.pitch = 1.0
        utterance.volume = 1.0
        utterance.lang = 'en-US'

        audiosWithAudio.push({
          ...audioData,
          audioElement
        })
      } catch (error) {
        console.error('Audio generation failed:', error)
        // フォールバック
        audiosWithAudio.push({
          ...audioData,
          audioElement: null
        })
      }
    }

    setSessionAudios(audiosWithAudio)
    setCurrentAudio(audiosWithAudio[0])
    setAudioIndex(0)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTotalQuestions(audiosWithAudio.reduce((sum, a) => sum + a.questions.length, 0))
    setQuestionsAnswered(0)
    setPointsEarned(0)
    setSessionStartTime(new Date())
    setSessionActive(true)
    setTimeRemaining(sessionDuration * 60)
    setSelectedAnswer('')
    setShowAnswer(false)
    setShowTranscript(false)
    setPlayCount(0)
    setTotalPlayCounts(0)
    setCurrentTime(0)
    setAudioReady(true)
    setAudioLoading(false)
    
    // 最初の音声の準備
    if (audiosWithAudio[0]?.audioElement) {
      currentAudioRef.current = audiosWithAudio[0].audioElement
      setupAudioEventListeners(audiosWithAudio[0].audioElement)
    }
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
  }, [sessionActive, timeRemaining, endSession])

  // 音声イベントリスナー設定
  const setupAudioEventListeners = (audio: HTMLAudioElement) => {
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })
    
    audio.addEventListener('loadedmetadata', () => {
      setAudioReady(true)
    })
  }

  // 音声再生（実際のHTML5 Audio + TTS）
  const playAudio = () => {
    if (!currentAudio) return
    
    if (currentAudioRef.current) {
      // HTML5 Audio要素がある場合
      currentAudioRef.current.volume = volume[0] / 100
      currentAudioRef.current.play()
      setIsPlaying(true)
    } else {
      // TTS使用
      const utterance = new SpeechSynthesisUtterance(currentAudio.transcript)
      
      const voices = speechSynthesis.getVoices()
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en-') && 
        !voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en-'))

      if (englishVoice) {
        utterance.voice = englishVoice
      }

      utterance.rate = 0.85
      utterance.pitch = 1.0
      utterance.volume = volume[0] / 100
      utterance.lang = 'en-US'

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentTime(0)
      }

      speechSynthesis.speak(utterance)
    }
    
    setPlayCount(playCount + 1)
    setTotalPlayCounts(totalPlayCounts + 1)
  }

  const pauseAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
    } else {
      speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }

  const resetAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
    } else {
      speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setCurrentTime(0)
  }

  // 回答送信
  const submitAnswer = () => {
    if (!currentAudio || selectedAnswer === '') return

    const currentQuestion = currentAudio.questions[currentQuestionIndex]
    const isCorrect = parseInt(selectedAnswer) === currentQuestion.correctAnswer
    
    if (isCorrect) {
      setScore(score + 1)
      setPointsEarned(pointsEarned + currentQuestion.points)
    }

    setQuestionsAnswered(questionsAnswered + 1)
    setShowAnswer(true)
  }

  // 次の問題
  const nextQuestion = async () => {
    if (!currentAudio) return

    if (currentQuestionIndex < currentAudio.questions.length - 1) {
      // 同じ音声の次の問題
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowAnswer(false)
    } else {
      // 次の音声へ
      if (audioIndex < sessionAudios.length - 1) {
        const nextIndex = audioIndex + 1
        setAudioIndex(nextIndex)
        setCurrentAudio(sessionAudios[nextIndex])
        setCurrentQuestionIndex(0)
        setSelectedAnswer('')
        setShowAnswer(false)
        setShowTranscript(false)
        setPlayCount(0)
        resetAudio()
        
        // 次の音声の準備
        if (sessionAudios[nextIndex]?.audioElement) {
          currentAudioRef.current = sessionAudios[nextIndex].audioElement
          setupAudioEventListeners(sessionAudios[nextIndex].audioElement!)
        }
      } else {
        endSession()
      }
    }
  }

  // セッション終了
  const endSession = () => {
    pauseAudio()
    setSessionActive(false)
    const timeSpent = sessionStartTime 
      ? (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60 
      : sessionDuration

    const averagePlayCount = sessionAudios.length > 0 ? totalPlayCounts / sessionAudios.length : 0

    const results: ListeningSessionResults = {
      totalQuestions: totalQuestions,
      correctAnswers: score,
      accuracy: totalQuestions > 0 ? (score / totalQuestions) * 100 : 0,
      pointsEarned,
      timeSpent,
      level: determineLevel(userLevel),
      audiosCompleted: audioIndex + 1,
      averagePlayCount
    }

    onComplete(results)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!sessionActive) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Headphones className="h-6 w-6" />
            TOEICリスニング学習
          </CardTitle>
          <div className="flex flex-col gap-2">
            <Badge variant="outline">
              {determineLevel(userLevel).toUpperCase()}レベル
            </Badge>
            <p className="text-sm text-muted-foreground">
              TOEIC {userLevel}点レベルのリスニングを学習します
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Headphones className="h-8 w-8 mx-auto text-blue-500" />
              <p className="text-sm">聞き取り力</p>
            </div>
            <div className="space-y-2">
              <Target className="h-8 w-8 mx-auto text-green-500" />
              <p className="text-sm">実戦形式</p>
            </div>
            <div className="space-y-2">
              <Volume2 className="h-8 w-8 mx-auto text-purple-500" />
              <p className="text-sm">音声調整可</p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-lg">
              セッション時間: <strong>{sessionDuration}分</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              ヘッドフォンまたはスピーカーをご準備ください
            </p>
            {audioLoading && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">音声を準備中...</div>
                <Progress value={undefined} className="mt-2" />
              </div>
            )}
            <Button onClick={startSession} size="lg" className="w-full" disabled={audioLoading}>
              {audioLoading ? '準備中...' : 'リスニング学習を開始'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentAudio) return null

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              音声 {audioIndex + 1} / {sessionAudios.length}
            </Badge>
            <Badge variant="secondary">
              {currentAudio.category}
            </Badge>
            <Badge variant="default">
              問題 {currentQuestionIndex + 1} / {currentAudio.questions.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        <Progress value={(questionsAnswered / totalQuestions) * 100} />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 音声コントロール */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{currentAudio.title}</h2>
            <Badge variant="outline">
              再生回数: {playCount}
            </Badge>
          </div>
          
          {/* 音声プレイヤー */}
          <div className="p-4 bg-muted rounded-lg space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={isPlaying ? pauseAudio : playAudio}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAudio}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-sm">
                  {formatTime(currentTime)} / {formatTime(currentAudio.duration)}
                </div>
                <Progress value={(currentTime / currentAudio.duration) * 100} className="mt-1" />
              </div>
            </div>
            
            {/* 音量調整 */}
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm w-8">{volume[0]}</span>
            </div>
          </div>

          {/* トランスクリプト表示 */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowTranscript(!showTranscript)}
              size="sm"
            >
              {showTranscript ? 'スクリプトを隠す' : 'スクリプトを表示'}
            </Button>
          </div>

          {showTranscript && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold mb-2">トランスクリプト:</h4>
              <div className="text-sm whitespace-pre-line">
                {currentAudio.transcript}
              </div>
            </div>
          )}
        </div>

        {/* 問題表示 */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold">
            {currentAudio.questions[currentQuestionIndex].question}
          </h3>

          {/* 選択肢 */}
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={setSelectedAnswer}
            disabled={showAnswer}
          >
            {currentAudio.questions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`option-${index}`}
                  className={showAnswer ? (
                    index === currentAudio.questions[currentQuestionIndex].correctAnswer 
                      ? 'border-green-500 text-green-500' 
                      : index === parseInt(selectedAnswer) && index !== currentAudio.questions[currentQuestionIndex].correctAnswer
                        ? 'border-red-500 text-red-500'
                        : ''
                  ) : ''}
                />
                <Label 
                  htmlFor={`option-${index}`}
                  className={`cursor-pointer ${showAnswer ? (
                    index === currentAudio.questions[currentQuestionIndex].correctAnswer 
                      ? 'text-green-600 font-semibold' 
                      : index === parseInt(selectedAnswer) && index !== currentAudio.questions[currentQuestionIndex].correctAnswer
                        ? 'text-red-600'
                        : ''
                  ) : ''}`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* 解説表示 */}
          {showAnswer && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                {parseInt(selectedAnswer) === currentAudio.questions[currentQuestionIndex].correctAnswer ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-semibold">
                  {parseInt(selectedAnswer) === currentAudio.questions[currentQuestionIndex].correctAnswer ? '正解！' : '不正解'}
                </span>
              </div>
              <p className="text-sm">{currentAudio.questions[currentQuestionIndex].explanation}</p>
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="flex gap-4">
          {!showAnswer ? (
            <Button 
              onClick={submitAnswer} 
              disabled={selectedAnswer === ''}
              className="w-full"
            >
              回答する
            </Button>
          ) : (
            <Button onClick={nextQuestion} className="w-full">
              {currentQuestionIndex < currentAudio.questions.length - 1 
                ? '次の問題' 
                : audioIndex < sessionAudios.length - 1 
                  ? '次の音声' 
                  : '完了'}
            </Button>
          )}
        </div>

        {/* スコア表示 */}
        <div className="flex justify-center gap-6 text-sm border-t pt-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>正解: {score}/{questionsAnswered}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4 text-blue-500" />
            <span>ポイント: {pointsEarned}</span>
          </div>
          <div className="flex items-center gap-1">
            <Headphones className="h-4 w-4 text-purple-500" />
            <span>総再生: {totalPlayCounts}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
