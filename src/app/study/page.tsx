'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Headphones, FileText, Brain, Heart, Target, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function StudyPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const studyModules = [
    {
      id: 'vocabulary',
      title: '単語学習',
      description: 'TOEIC頻出単語を効率的に学習',
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      features: ['金フレ完全収録', 'SRS復習システム', '音声付き'],
      href: '/study/vocabulary'
    },
    {
      id: 'grammar',
      title: '文法学習',
      description: 'Part 5/6対策の文法問題',
      icon: <FileText className="h-8 w-8 text-green-500" />,
      color: 'bg-green-50 border-green-200',
      features: ['基礎から応用', '例文豊富', 'Part 5形式'],
      href: '/study/grammar'
    },
    {
      id: 'listening',
      title: 'リスニング',
      description: 'Part 1-4の聞き取り練習',
      icon: <Headphones className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      features: ['音声内蔵', '先読み訓練', '実戦形式'],
      href: '/study/listening'
    },
    {
      id: 'reading',
      title: 'リーディング',
      description: 'Part 7の読解・速読練習',
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      color: 'bg-orange-50 border-orange-200',
      features: ['速読訓練', 'スキャニング', '時間管理'],
      href: '/study/reading'
    },
    {
      id: 'workingmemory',
      title: 'WMトレーニング',
      description: 'ADHD対応のワーキングメモリ強化',
      icon: <Brain className="h-8 w-8 text-indigo-500" />,
      color: 'bg-indigo-50 border-indigo-200',
      features: ['短期保持', '処理速度UP', 'chunk化'],
      href: '/working-memory'
    },
    {
      id: 'recovery',
      title: '回復モード',
      description: '低調時の軽負荷学習',
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      color: 'bg-pink-50 border-pink-200',
      features: ['耳だけ学習', '見るだけ復習', '1タップ達成'],
      href: '/recovery'
    }
  ]

  return (
    <div className="space-y-6">
      {/* ヘッダー - あなたのストーリーを反映 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">学習メニュー</h1>
        <p className="text-gray-600">
          今日の脳天気に合わせて、最適な学習を選択しましょう ☀️☁️🌧️
        </p>
        
        {/* 開発者体験談 */}
        <Card className="border-l-4 border-l-orange-500 text-left">
          <CardHeader>
            <CardTitle className="text-orange-700 text-lg">開発者の実体験から</CardTitle>
            <CardDescription>
              「英単語は翌日消える」「図書館で一人勉強」→「のうてんきょ」誕生
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">こんな経験ありませんか？</h4>
              <ul className="space-y-1 text-sm text-orange-700">
                <li>• 英単語は翌日には消える → 数学公式は本番で蒸発</li>
                <li>• 日本史は偏差値76なのに英文法は妖怪レベルで逃げる</li>
                <li>• 田舎だからファミレス勉強なし → 図書館か家でぼっち勉強</li>
                <li>• 夏休み18時間勉強 → 秋に燃え尽きて鬱モード突入</li>
                <li>• ADHD過集中で覚える日もある → でも翌日霧散</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>💡 そんな体験から生まれた「のうてんきょ」</strong><br />
                脳の天気予報があれば効率UP！低スコアスタートでも自作アプリで満点の道のりを実現中 🚀
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 今日ののうてんきょスコア */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>今日の脳天気スコア</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>体調・集中力・天気総合</span>
              <span className="text-2xl font-bold text-blue-600">78/100</span>
            </div>
            <Progress value={78} className="h-3" />
            <p className="text-sm text-gray-600">
              良好な状態です！着実に学習を進めましょう 📚
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 目標設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-yellow-600" />
            <span>あなたの目標</span>
          </CardTitle>
          <CardDescription>
            低スコアスタートから満点への道のり
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600 mb-1">450</div>
              <div className="text-sm text-gray-500">現在のスコア</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">800</div>
              <div className="text-sm text-blue-500">3ヶ月目標</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{backgroundColor: '#FFF9C4'}}>
              <div className="text-2xl font-bold mb-1" style={{color: '#B45309'}}>950+</div>
              <div className="text-sm" style={{color: '#92400E'}}>6ヶ月目標</div>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>のうてんきょ開発者の挑戦：</strong>自作アプリで低スコアから満点到達のロマンを実現中！
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 学習モジュール */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyModules.map((module) => (
          <Link key={module.id} href={module.href}>
            <Card className={`${module.color} hover:shadow-lg transition-all duration-200 cursor-pointer group h-full`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {module.icon}
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="group-hover:bg-white">
                    開始
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {module.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ADHD・うつ特化説明 */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center space-x-2">
            <Heart className="h-6 w-6" />
            <span>ADHD・うつ対応の特徴</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                ADHD特性への対応
              </h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• <strong>過集中活用：</strong>興味爆発型の集中を学習に活かす</li>
                <li>• <strong>ワーキングメモリ強化：</strong>短期保持・処理速度を改善</li>
                <li>• <strong>チャンク化：</strong>情報を扱いやすい単位に分割</li>
                <li>• <strong>外部メモ活用：</strong>記憶負荷を軽減するUI設計</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-3 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                うつ傾向への配慮
              </h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• <strong>回復モード：</strong>低調時でも続けられる軽学習</li>
                <li>• <strong>達成感重視：</strong>小さな成功を積み重ねる設計</li>
                <li>• <strong>負荷自動調整：</strong>体調に合わせた学習量提案</li>
                <li>• <strong>義務感排除：</strong>生活リズムの一部として学習</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アプリ内完結の説明 */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-purple-700">📚 参考書なし、アプリ内完結</CardTitle>
          <CardDescription>
            TOEICに必要なすべての学習をこのアプリだけで
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-purple-800">内蔵コンテンツ</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• 金フレ・Core1900相当の語彙データ</li>
                <li>• 中学〜大学基礎文法の体系的解説</li>
                <li>• Part 1-4のリスニング音声・問題</li>
                <li>• Part 5-7のリーディング問題</li>
                <li>• フル模試（時間制限・環境音付き）</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-800">学習機能</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• SRS（間隔反復）による効率的復習</li>
                <li>• 音声付き発音・例文学習</li>
                <li>• タイムアタック・速読訓練</li>
                <li>• 本番再現環境（雑音・時間制限）</li>
                <li>• 個人学習データの可視化・分析</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
