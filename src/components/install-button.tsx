'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // PWAインストール状態をチェック
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true)
      }
    }

    // beforeinstallpromptイベントをリッスン
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // アプリインストール完了イベント
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    checkIfInstalled()
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Install prompt error:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  // インストール済みまたはインストールできない場合は表示しない
  if (isInstalled || !deferredPrompt) {
    return null
  }

  return (
    <Button
      onClick={handleInstallClick}
      disabled={isInstalling}
      variant="default"
      size="sm"
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isInstalling ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          インストール中...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          アプリをインストール
        </>
      )}
    </Button>
  )
}
