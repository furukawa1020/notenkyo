'use client'

import { useState } from 'react'
import { Clock, BookOpen, Headphones, FileText, Brain, Heart, CheckCircle, Play } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Task } from '@/lib/types'
import { updateTask } from '@/lib/storage'

interface TaskCardProps {
  task: Task
  onTaskUpdate?: (task: Task) => void
  noutenkyoScore?: number
}

export function TaskCard({ task, onTaskUpdate, noutenkyoScore }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const getTaskIcon = (part: Task['part']) => {
    switch (part) {
      case 'vocabulary': return <BookOpen className="h-5 w-5 text-blue-500" />
      case 'grammar': return <FileText className="h-5 w-5 text-green-500" />
      case 'listening': return <Headphones className="h-5 w-5 text-purple-500" />
      case 'reading': return <FileText className="h-5 w-5 text-orange-500" />
      case 'mocktest': return <CheckCircle className="h-5 w-5 text-red-500" />
      case 'workingmemory': return <Brain className="h-5 w-5 text-indigo-500" />
      case 'recovery': return <Heart className="h-5 w-5 text-pink-500" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getPartName = (part: Task['part']) => {
    switch (part) {
      case 'vocabulary': return '単語'
      case 'grammar': return '文法'
      case 'listening': return 'リスニング'
      case 'reading': return 'リーディング'
      case 'mocktest': return '模試'
      case 'workingmemory': return 'WMトレーニング'
      case 'recovery': return '回復モード'
      default: return 'その他'
    }
  }

  const getLoadColor = (load: Task['load']) => {
    switch (load) {
      case 'light': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'heavy': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLoadName = (load: Task['load']) => {
    switch (load) {
      case 'light': return '軽負荷'
      case 'medium': return '中負荷'
      case 'heavy': return '高負荷'
      default: return '不明'
    }
  }

  const handleStart = () => {
    // 学習開始のロジック
    console.log('Starting task:', task.title)
    
    // パートに応じて適切なページに遷移
    switch (task.part) {
      case 'vocabulary':
        window.location.href = '/study/vocabulary'
        break
      case 'grammar':
      case 'listening':
      case 'reading':
      case 'mocktest':
      case 'workingmemory':
        window.location.href = '/study'
        break
      case 'recovery':
        window.location.href = '/recovery'
        break
      default:
        window.location.href = '/study'
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await updateTask(task.id, { completed: true })
      const updatedTask = { ...task, completed: true }
      onTaskUpdate?.(updatedTask)
    } catch (error) {
      console.error('Failed to complete task:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <Card className={`card-hover ${task.completed ? 'opacity-75 bg-gray-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTaskIcon(task.part)}
            <div>
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <CardDescription className="text-sm">
                {getPartName(task.part)} • {task.lengthMinutes}分
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getLoadColor(task.load)} variant="secondary">
              {getLoadName(task.load)}
            </Badge>
            {task.completed && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            推定時間: {task.lengthMinutes}分
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {task.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {!task.completed ? (
          <div className="flex gap-2">
            <Button 
              onClick={handleStart}
              className="flex-1"
              variant="default"
            >
              <Play className="h-4 w-4 mr-2" />
              開始
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={isCompleting}
              variant="outline"
            >
              {isCompleting ? '完了中...' : '完了'}
            </Button>
          </div>
        ) : (
          <div className="text-center py-2 text-green-600 font-medium">
            ✓ 完了済み
          </div>
        )}
      </CardContent>
    </Card>
  )
}
