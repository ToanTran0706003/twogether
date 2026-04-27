import type { Metadata, Viewport } from "next"
import { Playfair_Display } from "next/font/google"
import "./globals.css"
import InstallPrompt from "@/components/shared/InstallPrompt"

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "TwoGether ♡",
  description: "Không gian riêng của hai người",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TwoGether",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
  themeColor: "#E8A0B0",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={playfairDisplay.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="antialiased">
        <div className="app-wrapper">
          {children}
          <InstallPrompt />
        </div>
      </body>
    </html>
  )
}
