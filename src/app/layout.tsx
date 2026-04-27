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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={playfairDisplay.variable}>
      <body className="min-h-screen flex flex-col antialiased" style={{ backgroundColor: "#FDF8F5" }}>
        {children}
        <InstallPrompt />
      </body>
    </html>
  )
}
