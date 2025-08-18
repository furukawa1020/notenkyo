'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff, 
  X,
  CheckCircle,
  Zap
} from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [showInstallCard, setShowInstallCard] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // PWAインストール可能性をチェック
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
      // または navigator.standalone (iOS Safari)
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true)
      }
    }

    // beforeinstallpromptイベントをリッスン
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('👀 beforeinstallprompt event fired')
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
      // 数秒後にインストールカードを表示
      setTimeout(() => setShowInstallCard(true), 3000)
    }

    // オンライン・オフライン状態の監視
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    checkIfInstalled()
    setIsOnline(navigator.onLine)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // インストールプロンプトを表示
      await deferredPrompt.prompt()
      
      // ユーザーの選択を待つ
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt')
        setIsInstalled(true)
        setShowInstallCard(false)
      } else {
        console.log('❌ User dismissed the install prompt')
      }
      
      // プロンプトは一度しか使えない
      setDeferredPrompt(null)
      setIsInstallable(false)
    } catch (error) {
      console.error('Error during installation:', error)
    }
  }

  // 既にインストール済みの場合は何も表示しない
  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Badge className="bg-green-600 flex items-center space-x-2 px-3 py-2">
          <CheckCircle className="h-4 w-4" />
          <span>アプリとしてインストール済み</span>
        </Badge>
      </div>
    )
  }

  // インストールカードを表示
  if (showInstallCard && isInstallable) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setShowInstallCard(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">のうてんきょをインストール</CardTitle>
              <CardDescription>
                アプリとしてインストールして、もっと便利に使いましょう！
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* メリット一覧 */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">インストールのメリット</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <WifiOff className="h-5 w-5 text-green-600" />
                  <span className="text-sm">オフラインでも学習可能</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">アプリのような高速起動</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">フルスクリーンで集中学習</span>
                </div>
              </div>
            </div>

            {/* インストールボタン */}
            <div className="space-y-2">
              <Button 
                onClick={handleInstallClick}
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                size="lg"
              >
                <Download className="h-5 w-5" />
                <span>今すぐインストール</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInstallCard(false)}
                className="w-full"
              >
                後でインストール
              </Button>
            </div>

            {/* オフライン状態の表示 */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span>オンライン</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-600" />
                  <span>オフライン（PWA機能で学習継続可能）</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 右下の小さなインストールボタン
  if (isInstallable) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowInstallCard(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center space-x-2 px-4 py-2"
          size="sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">インストール</span>
        </Button>
      </div>
    )
  }

  return null
}

// 手動インストール用のコンポーネント（設定ページなどで使用）
export function PWAInstallInstructions() {
  const [userAgent, setUserAgent] = useState('')

  useEffect(() => {
    setUserAgent(navigator.userAgent)
  }, [])

  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  const isAndroid = /Android/.test(userAgent)
  const isChrome = /Chrome/.test(userAgent)
  const isSafari = /Safari/.test(userAgent) && !isChrome

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="h-6 w-6" />
          <span>アプリとしてインストール</span>
        </CardTitle>
        <CardDescription>
          のうてんきょをアプリのように使う方法
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isIOS && isSafari && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📱 iPhoneでのインストール手順</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>画面下部の「共有」ボタン（□↑）をタップ</li>
              <li>「ホーム画面に追加」を選択</li>
              <li>「追加」をタップして完了</li>
            </ol>
          </div>
        )}

        {isAndroid && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">🤖 Androidでのインストール手順</h4>
            <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
              <li>ブラウザメニュー（⋮）をタップ</li>
              <li>「アプリをインストール」または「ホーム画面に追加」を選択</li>
              <li>「インストール」をタップして完了</li>
            </ol>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">💻 PCでのインストール手順</h4>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>アドレスバー右側のインストールアイコンをクリック</li>
            <li>「インストール」ボタンをクリック</li>
            <li>デスクトップアプリとして起動可能</li>
          </ol>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚡ インストール後のメリット</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• オフラインでも学習データにアクセス可能</li>
            <li>• アプリのような高速起動とスムーズな操作</li>
            <li>• プッシュ通知で学習リマインダー受信</li>
            <li>• フルスクリーンで集中しやすい学習環境</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}