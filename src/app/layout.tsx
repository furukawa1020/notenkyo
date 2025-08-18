import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavigationWrapper } from '@/components/navigation'
import { PWAInstall } from '@/components/pwa-install'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'のうてんきょ - ADHD・うつ対応TOEIC学習アプリ',
  description: '体調と天気に合わせた最適な学習を提案する、ADHD・うつ傾向のあるユーザー向けTOEIC学習PWAアプリ',
  manifest: '/manifest.json',
  themeColor: '#6B73FF',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#6B73FF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="のうてんきょ" />
      </head>
      <body className={inter.className}>
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
        <PWAInstall />
      </body>
    </html>
  )
}
