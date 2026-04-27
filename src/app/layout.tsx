import type { Metadata, Viewport } from 'next'
import './globals.css'
import InstallPrompt from '@/components/shared/InstallPrompt'

export const metadata: Metadata = {
  title: 'TwoGether ♡',
  description: 'Không gian riêng của hai người',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TwoGether',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#E8A0B0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <div className="app-wrapper">
          {children}
          <InstallPrompt />
        </div>
      </body>
    </html>
  )
}
