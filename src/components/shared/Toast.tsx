"use client"
import { createContext, useContext, useState, useCallback, useRef } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export const useToast = () => useContext(ToastContext)

const COLORS = {
  success: { bg: '#EAF3DE', border: '#B8DEC8', text: '#3B6D11', icon: '✓' },
  error:   { bg: '#FCEBEB', border: '#F7C1C1', text: '#A32D2D', icon: '✕' },
  info:    { bg: '#FBEAF0', border: '#F4C0D1', text: '#993556', icon: '♡' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counter.current
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: 'calc(16px + env(safe-area-inset-top))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: 'calc(100% - 32px)',
        maxWidth: 400,
        pointerEvents: 'none',
      }}>
        {toasts.map(toast => {
          const c = COLORS[toast.type]
          return (
            <div key={toast.id} style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: 'toastSlideDown 0.3s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: c.border, color: c.text,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {c.icon}
              </span>
              <span style={{ fontSize: 13, color: c.text, fontWeight: 500, flex: 1 }}>
                {toast.message}
              </span>
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes toastSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
