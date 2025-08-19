// グローバル型定義
declare global {
  interface Window {
    workbox?: any;
    __PWA_SW__?: ServiceWorker;
  }
}

// PWA関連の型定義
declare module 'next-pwa' {
  interface PWAConfig {
    dest: string;
    sw?: string;
    register?: boolean;
    skipWaiting?: boolean;
    clientsClaim?: boolean;
    runtimeCaching?: any[];
  }

  function withPWA(config: PWAConfig): (nextConfig: any) => any;
  export = withPWA;
}

export {};
