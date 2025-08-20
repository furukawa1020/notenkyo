'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  User, 
  Bell,
  Menu,
  X,
  Brain,
  Target,
  TrendingUp,
  Heart,
  FileText
} from 'lucide-react'

const navigationItems = [
  {
    name: 'ホーム',
    href: '/',
    icon: Home,
    mobileOrder: 1
  },
  {
    name: '学習',
    href: '/study',
    icon: BookOpen,
    mobileOrder: 2
  },
  {
    name: '分析',
    href: '/analytics',
    icon: BarChart3,
    mobileOrder: 3
  },
  {
    name: '通知',
    href: '/notifications',
    icon: Bell,
    mobileOrder: 4
  },
  // プロフィール機能は一時的に無効化
  /*
  {
    name: 'プロフィール',
    href: '/profile',
    icon: User,
    mobileOrder: 5
  },
  */
  {
    name: 'ワーキングメモリ',
    href: '/working-memory',
    icon: Brain,
    mobileOrder: 0
  },
  {
    name: '統計',
    href: '/statistics',
    icon: TrendingUp,
    mobileOrder: 0
  },
  {
    name: '模擬試験',
    href: '/mock-test',
    icon: Target,
    mobileOrder: 0
  },
  {
    name: '研究',
    href: '/research',
    icon: FileText,
    mobileOrder: 0
  },
  {
    name: '回復',
    href: '/recovery',
    icon: Heart,
    mobileOrder: 0
  },
  {
    name: '進捗テスト',
    href: '/progress-test',
    icon: Target,
    mobileOrder: 0
  },
  {
    name: '問題テスト',
    href: '/question-test',
    icon: Target,
    mobileOrder: 0
  }
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const mobileItems = navigationItems.filter(item => item.mobileOrder > 0)
    .sort((a, b) => a.mobileOrder - b.mobileOrder)
  
  const desktopItems = navigationItems

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation - サイドバー */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 z-40">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">のうてんきょ</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {desktopItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Navigation - トップバー */}
      <header className="lg:hidden bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">のうてんきょ</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <nav className="px-2 py-3 space-y-1">
              {desktopItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors',
                      active
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'mr-3 h-5 w-5',
                        active ? 'text-blue-500' : 'text-gray-400'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation - Instagram/X風 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="flex items-center justify-around py-2 bg-white/95 backdrop-blur-sm">
          {mobileItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-3 px-4 min-w-0 transition-all duration-200',
                  'hover:bg-gray-50 active:bg-gray-100 active:scale-95',
                  'tap-highlight rounded-lg relative',
                  active && 'text-blue-600'
                )}
              >
                <div className="relative flex flex-col items-center">
                  <Icon 
                    className={cn(
                      'h-6 w-6 mb-1 transition-all duration-200',
                      active ? 'text-blue-600 scale-110' : 'text-gray-500'
                    )} 
                  />
                  <span className={cn(
                    'text-xs font-medium transition-all duration-200',
                    active ? 'text-blue-600 font-semibold' : 'text-gray-500'
                  )}>
                    {item.name}
                  </span>
                  {/* Instagram風のアクティブインジケーター */}
                  {active && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* メインコンテンツ */}
      <main className="lg:pl-64 pt-16 pb-20 lg:pt-0 lg:pb-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
