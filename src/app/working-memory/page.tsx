'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Brain, Play, RotateCcw, Timer, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import { recordSession, getStudyProgress, saveStudyProgress } from '@/lib/storage'

interface WorkingMemoryTask {
  id: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'n-back' | 'dual-task' | 'sequence' | 'spatial'
  instructions: string
  minLevel: number
}

const workingMemoryTasks: WorkingMemoryTask[] = [
  {
    id: 'n-back-audio',
    name: 'N-Back 音声課題',
    description: '聞こえた音がN回前と同じかを判断する',
    difficulty: 'medium',
    type: 'n-back',
    instructions: '音を聞いて、2回前に聞いた音と同じかどうかを判断してください。同じ場合は「一致」、違う場合は「不一致」を選択してください。',
    minLevel: 1
  },
  {
    id: 'dual-task-math',
    name: 'デュアルタスク（計算＋記憶）',
    description: '簡単な計算をしながら文字を記憶する',
    difficulty: 'hard',
    type: 'dual-task',
    instructions: '画面に表示される計算問題を解きながら、その後に出てくる文字を順番に覚えてください。',
    minLevel: 3
  },
  {
    id: 'sequence-memory',
    name: '順序記憶課題',
    description: '単語の順序を正確に記憶する',
    difficulty: 'easy',
    type: 'sequence',
    instructions: '表示される単語の順番を覚えて、正しい順序で選択してください。',
    minLevel: 0
  },
  {
    id: 'spatial-memory',
    name: '空間記憶課題',
    description: '図形の位置関係を記憶する',
    difficulty: 'medium',
    type: 'spatial',
    instructions: '表示される図形の位置を覚えて、同じ配置になるように選択してください。',
    minLevel: 2
  }
]

const audioStimuli = ['A', 'E', 'I', 'O', 'U']
const wordStimuli = ['apple', 'book', 'car', 'dog', 'eye', 'fish', 'green', 'house']
const mathProblems = [
  { question: '3 + 7 = ?', answer: 10 },
  { question: '15 - 8 = ?', answer: 7 },
  { question: '4 × 3 = ?', answer: 12 },
  { question: '16 ÷ 4 = ?', answer: 4 },
  { question: '9 + 6 = ?', answer: 15 },
  { question: '20 - 12 = ?', answer: 8 }
]

export default function WorkingMemoryPage() {
  const [selectedTask, setSelectedTask] = useState<WorkingMemoryTask | null>(null)
  const [currentPhase, setCurrentPhase] = useState<'instructions' | 'running' | 'results'>('instructions')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [trials, setTrials] = useState(0)
  const [maxTrials] = useState(20)
  const [sessionStartTime] = useState(new Date())
  
  // N-Back用状態
  const [nBackSequence, setNBackSequence] = useState<string[]>([])
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0)
  const [isStimulPlaying, setIsStimuliPlaying] = useState(false)
  const [awaitingResponse, setAwaitingResponse] = useState(false)
  
  // Dual-Task用状態
  const [mathAnswer, setMathAnswer] = useState('')
  const [currentMathProblem, setCurrentMathProblem] = useState<{question: string, answer: number} | null>(null)
  const [lettersToRemember, setLettersToRemember] = useState<string[]>([])
  const [currentLetter, setCurrentLetter] = useState('')
  
  // Sequence用状態
  const [sequenceToRemember, setSequenceToRemember] = useState<string[]>([])
  const [userSequence, setUserSequence] = useState<string[]>([])
  const [showingSequence, setShowingSequence] = useState(false)
  
  // Spatial用状態
  const [spatialPattern, setSpatialPattern] = useState<number[]>([])
  const [userSpatialPattern, setUserSpatialPattern] = useState<number[]>([])
  const [showingSpatial, setShowingSpatial] = useState(false)
  
  const [studyProgress, setStudyProgress] = useState({
    vocabularyLevel: 0,
    grammarLevel: 0,
    listeningLevel: 0,
    readingLevel: 0,
    totalStudyTime: 0,
    streakDays: 0
  })

  useEffect(() => {
    getStudyProgress().then(setStudyProgress)
  }, [])

  const startTask = (task: WorkingMemoryTask) => {
    setSelectedTask(task)
    setCurrentPhase('instructions')
    setLevel(task.minLevel + 1)
    setScore(0)
    setTrials(0)
  }

  const beginTraining = () => {
    setCurrentPhase('running')
    if (selectedTask) {
      switch (selectedTask.type) {
        case 'n-back':
          startNBackTrial()
          break
        case 'dual-task':
          startDualTaskTrial()
          break
        case 'sequence':
          startSequenceTrial()
          break
        case 'spatial':
          startSpatialTrial()
          break
      }
    }
  }

  const completeTraining = useCallback(async () => {
    setCurrentPhase('results')
    
    if (!selectedTask) return
    
    const sessionEndTime = new Date()
    const accuracy = (score / maxTrials) * 100
    
    await recordSession({
      taskId: `wm-${selectedTask.id}`,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      score: accuracy,
      correctAnswers: score,
      totalQuestions: maxTrials,
      studyType: 'recovery' // ワーキングメモリは回復モードの一部として分類
    })
    
    // 学習進捗の更新
    const newProgress = {
      ...studyProgress,
      totalStudyTime: studyProgress.totalStudyTime + Math.floor((sessionEndTime.getTime() - sessionStartTime.getTime()) / 60000)
    }
    
    await saveStudyProgress(newProgress)
    setStudyProgress(newProgress)
  }, [selectedTask, sessionStartTime, studyProgress, maxTrials, score])

  // Sequence課題
  const startSequenceTrial = useCallback(() => {
    const sequence = Array.from({ length: level + 2 }, () => 
      wordStimuli[Math.floor(Math.random() * wordStimuli.length)]
    )
    setSequenceToRemember(sequence)
    setUserSequence([])
    setShowingSequence(true)
    
    setTimeout(() => setShowingSequence(false), sequence.length * 1500)
  }, [level])

  // Spatial課題
  const startSpatialTrial = useCallback(() => {
    const pattern = Array.from({ length: level + 3 }, () => 
      Math.floor(Math.random() * 9)
    )
    setSpatialPattern(pattern)
    setUserSpatialPattern([])
    setShowingSpatial(true)
    
    setTimeout(() => setShowingSpatial(false), pattern.length * 1000)
  }, [level])

  // Dual-Task課題
  const startDualTaskTrial = useCallback(() => {
    const problem = mathProblems[Math.floor(Math.random() * mathProblems.length)]
    setCurrentMathProblem(problem)
    setMathAnswer('')
    setLettersToRemember([])
    setCurrentLetter('')
  }, [])

  const nextTrial = useCallback(() => {
    setTrials(prev => prev + 1)
    
    if (trials + 1 >= maxTrials) {
      completeTraining()
    } else {
      // 次のトライアルを開始
      setTimeout(() => {
        if (selectedTask) {
          switch (selectedTask.type) {
            case 'n-back':
              // N-Back課題の開始（インライン化で循環参照回避）
              const sequence = Array.from({ length: level + 10 }, () => 
                audioStimuli[Math.floor(Math.random() * audioStimuli.length)]
              )
              setNBackSequence(sequence)
              setCurrentStimulusIndex(0)
              // playNextStimulusを直接呼び出さずにstateで管理
              setCurrentStimulusIndex(0)
              setIsStimuliPlaying(true)
              break
            case 'dual-task':
              startDualTaskTrial()
              break
            case 'sequence':
              startSequenceTrial()
              break
            case 'spatial':
              startSpatialTrial()
              break
          }
        }
      }, 1000)
    }
  }, [trials, maxTrials, selectedTask, completeTraining, level, startSequenceTrial, startSpatialTrial, startDualTaskTrial])

  // N-Back課題
  const playNextStimulus = useCallback((sequence: string[], index: number) => {
    if (index >= sequence.length) {
      nextTrial()
      return
    }

    setIsStimuliPlaying(true)
    setCurrentStimulusIndex(index)
    
    // 音声合成で再生
    const utterance = new SpeechSynthesisUtterance(sequence[index])
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    utterance.onend = () => {
      setIsStimuliPlaying(false)
      if (index >= level) {
        setAwaitingResponse(true)
        setTimeout(() => {
          setAwaitingResponse(false)
          playNextStimulus(sequence, index + 1)
        }, 2000)
      } else {
        setTimeout(() => playNextStimulus(sequence, index + 1), 1000)
      }
    }
    speechSynthesis.speak(utterance)
  }, [level, nextTrial])

  const startNBackTrial = useCallback(() => {
    const sequence = Array.from({ length: level + 10 }, () => 
      audioStimuli[Math.floor(Math.random() * audioStimuli.length)]
    )
    setNBackSequence(sequence)
    setCurrentStimulusIndex(0)
    playNextStimulus(sequence, 0)
  }, [level, playNextStimulus])

  const handleNBackResponse = (isMatch: boolean) => {
    if (!awaitingResponse) return
    
    const currentStimulus = nBackSequence[currentStimulusIndex]
    const targetStimulus = nBackSequence[currentStimulusIndex - level]
    const correctMatch = currentStimulus === targetStimulus
    
    if (isMatch === correctMatch) {
      setScore(prev => prev + 1)
    }
    
    setAwaitingResponse(false)
  }

  const submitMathAnswer = () => {
    if (currentMathProblem && parseInt(mathAnswer) === currentMathProblem.answer) {
      setScore(prev => prev + 1)
    }
    
    // 文字記憶フェーズに移行
    const letters = Array.from({ length: level + 2 }, () => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
    setLettersToRemember(letters)
    showLetters(letters, 0)
  }

  const showLetters = (letters: string[], index: number) => {
    if (index >= letters.length) {
      setTimeout(() => setCurrentLetter(''), 1000)
      return
    }
    
    setCurrentLetter(letters[index])
    setTimeout(() => showLetters(letters, index + 1), 1500)
  }

  const addToUserSequence = (word: string) => {
    if (showingSequence) return
    
    const newSequence = [...userSequence, word]
    setUserSequence(newSequence)
    
    if (newSequence.length === sequenceToRemember.length) {
      const correct = newSequence.every((word, index) => word === sequenceToRemember[index])
      if (correct) {
        setScore(prev => prev + 1)
      }
      nextTrial()
    }
  }

  const addToSpatialPattern = (position: number) => {
    if (showingSpatial) return
    
    const newPattern = [...userSpatialPattern, position]
    setUserSpatialPattern(newPattern)
    
    if (newPattern.length === spatialPattern.length) {
      const correct = newPattern.every((pos, index) => pos === spatialPattern[index])
      if (correct) {
        setScore(prev => prev + 1)
      }
      nextTrial()
    }
  }

  const resetTraining = () => {
    setSelectedTask(null)
    setCurrentPhase('instructions')
    setScore(0)
    setTrials(0)
    speechSynthesis.cancel()
  }

  if (selectedTask) {
    if (currentPhase === 'instructions') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setSelectedTask(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              トレーニング一覧に戻る
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-purple-600" />
                  {selectedTask.name}
                </CardTitle>
                <CardDescription>{selectedTask.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">やり方</h3>
                  <p>{selectedTask.instructions}</p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">設定</p>
                    <p className="text-sm text-gray-600">レベル: {level} | 試行回数: {maxTrials}</p>
                  </div>
                  <Badge variant={selectedTask.difficulty === 'easy' ? 'secondary' : 
                                selectedTask.difficulty === 'medium' ? 'default' : 'destructive'}>
                    {selectedTask.difficulty === 'easy' ? '簡単' :
                     selectedTask.difficulty === 'medium' ? '普通' : '難しい'}
                  </Badge>
                </div>
                
                <Button onClick={beginTraining} className="w-full" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  トレーニング開始
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (currentPhase === 'running') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <Button variant="ghost" onClick={resetTraining}>
                <RotateCcw className="w-4 h-4 mr-2" />
                リセット
              </Button>
              <div className="text-sm font-mono bg-white px-3 py-1 rounded-lg shadow">
                {trials} / {maxTrials}
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{selectedTask.name}</CardTitle>
                <Progress value={(trials / maxTrials) * 100} />
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                {selectedTask.type === 'n-back' && (
                  <div>
                    <div className="text-6xl font-bold mb-4 h-20 flex items-center justify-center">
                      {isStimulPlaying ? nBackSequence[currentStimulusIndex] : ''}
                    </div>
                    {awaitingResponse && (
                      <div className="space-y-3">
                        <p className="text-lg">2つ前と同じ音でしたか？</p>
                        <div className="flex gap-4 justify-center">
                          <Button onClick={() => handleNBackResponse(true)} variant="default">
                            一致
                          </Button>
                          <Button onClick={() => handleNBackResponse(false)} variant="outline">
                            不一致
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedTask.type === 'dual-task' && currentMathProblem && (
                  <div>
                    <div className="text-3xl font-bold mb-4">
                      {currentMathProblem.question}
                    </div>
                    <input
                      type="number"
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      className="text-2xl text-center border-2 rounded-lg p-2 w-24"
                      onKeyDown={(e) => e.key === 'Enter' && submitMathAnswer()}
                    />
                    <Button onClick={submitMathAnswer} className="ml-4">
                      確定
                    </Button>
                    {currentLetter && (
                      <div className="mt-8">
                        <div className="text-6xl font-bold text-purple-600">
                          {currentLetter}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedTask.type === 'sequence' && (
                  <div>
                    {showingSequence ? (
                      <div className="text-4xl font-bold text-blue-600">
                        {sequenceToRemember[Math.floor((Date.now() / 1500) % sequenceToRemember.length)]}
                      </div>
                    ) : (
                      <div>
                        <p className="mb-4">正しい順序で単語を選択してください</p>
                        <div className="grid grid-cols-2 gap-3">
                          {wordStimuli.map((word) => (
                            <Button
                              key={word}
                              onClick={() => addToUserSequence(word)}
                              variant="outline"
                              className="h-12"
                            >
                              {word}
                            </Button>
                          ))}
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">選択済み:</p>
                          <p className="font-mono">{userSequence.join(' → ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedTask.type === 'spatial' && (
                  <div>
                    <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
                      {Array.from({ length: 9 }, (_, i) => (
                        <Button
                          key={i}
                          onClick={() => addToSpatialPattern(i)}
                          variant="outline"
                          className={`h-16 w-16 ${
                            showingSpatial && spatialPattern.includes(i) ? 'bg-purple-500 text-white' :
                            userSpatialPattern.includes(i) ? 'bg-blue-500 text-white' : ''
                          }`}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    {!showingSpatial && (
                      <p className="mt-4 text-sm text-gray-600">
                        順番通りにマスを選択してください
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (currentPhase === 'results') {
      const accuracy = (score / maxTrials) * 100
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  トレーニング完了！
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                <div className="text-6xl font-bold text-purple-600">
                  {Math.round(accuracy)}%
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{score}</div>
                    <div className="text-sm text-gray-600">正答数</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{maxTrials}</div>
                    <div className="text-sm text-gray-600">総試行数</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button onClick={resetTraining} className="w-full">
                    もう一度チャレンジ
                  </Button>
                  <Button onClick={() => setSelectedTask(null)} variant="outline" className="w-full">
                    トレーニング一覧に戻る
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-600" />
            ワーキングメモリトレーニング
          </h1>
          <p className="text-gray-600 mb-4">
            ADHD特性に配慮したワーキングメモリ強化トレーニング
          </p>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Target className="w-5 h-5 mr-2" />
                トレーニングの効果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  集中力の向上
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-purple-500" />
                  記憶力の強化
                </div>
                <div className="flex items-center">
                  <Timer className="w-4 h-4 mr-2 text-blue-500" />
                  処理速度の向上
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2 text-green-500" />
                  注意制御の改善
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {workingMemoryTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                  <Badge variant={task.difficulty === 'easy' ? 'secondary' : 
                                task.difficulty === 'medium' ? 'default' : 'destructive'}>
                    {task.difficulty === 'easy' ? '簡単' :
                     task.difficulty === 'medium' ? '普通' : '難しい'}
                  </Badge>
                </div>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button 
                  onClick={() => startTask(task)}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  トレーニング開始
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
