import type { Metadata } from "next"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={playfairDisplay.variable}>
      <head>
        <meta name="theme-color" content="#E8A0B0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TwoGether" />
      </head>
      <body className="min-h-screen flex flex-col antialiased" style={{ backgroundColor: "#FDF8F5" }}>
        {children}
        <InstallPrompt />
      </body>
    </html>
  )
}
