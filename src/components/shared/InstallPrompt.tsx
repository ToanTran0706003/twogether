"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "twogether-install-dismissed"

export default function InstallPrompt() {
  const [showAndroid, setShowAndroid] = useState(false)
  const [showIOS, setShowIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (localStorage.getItem(STORAGE_KEY)) {
      setDismissed(true)
      return
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches

    if (isStandalone) return

    if (isAndroid && !isIOS) {
      const timer = setTimeout(() => setShowAndroid(true), 10_000)
      return () => clearTimeout(timer)
    }

    if (isIOS && !isAndroid) {
      const timer = setTimeout(() => setShowIOS(true), 10_000)
      return () => clearTimeout(timer)
    }
  }, [])

  function dismiss() {
    setDismissed(true)
    setShowAndroid(false)
    setShowIOS(false)
    localStorage.setItem(STORAGE_KEY, "true")
  }

  if (dismissed || (!showAndroid && !showIOS)) return null

  if (showIOS) {
    return (
      <div
        className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl p-4 border shadow-lg"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">📱</span>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: "#3A2832" }}>
              Cài TwoGether lên màn hình chính ♡
            </p>
            <ol className="text-xs space-y-0.5" style={{ color: "#8A6A72" }}>
              <li>1. Bấm nút Share <strong>□↗</strong> ở thanh dưới Safari</li>
              <li>2. Chọn <strong>&quot;Add to Home Screen&quot;</strong></li>
              <li>3. Bấm <strong>&quot;Add&quot;</strong> ở góc trên</li>
            </ol>
          </div>
          <button
            onClick={dismiss}
            className="text-lg leading-none flex-shrink-0"
            style={{ color: "#C0909C" }}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl p-4 border shadow-lg flex items-center gap-3"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
    >
      <span className="text-2xl flex-shrink-0">💕</span>
      <p className="flex-1 text-sm font-medium" style={{ color: "#3A2832" }}>
        Cài TwoGether lên màn hình chính ♡
      </p>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={dismiss}
          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:opacity-80"
          style={{ borderColor: "#F0E4DF", color: "#8A6A72" }}
        >
          ×
        </button>
        <button
          onClick={dismiss}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "#E8A0B0" }}
        >
          Đã hiểu
        </button>
      </div>
    </div>
  )
}
