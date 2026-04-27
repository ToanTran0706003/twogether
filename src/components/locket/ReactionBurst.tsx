"use client"
import { useEffect, useState } from 'react'

interface FloatingEmoji {
  id: number
  emoji: string
  x: number
  y: number
  duration: number
}

export function ReactionBurst({ emoji, onDone }: { emoji: string; onDone: () => void }) {
  const [particles, setParticles] = useState<FloatingEmoji[]>([])

  useEffect(() => {
    const items = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      emoji,
      x: -20 + Math.random() * 40,
      y: -(30 + Math.random() * 60),
      duration: 0.8 + Math.random() * 0.4,
    }))
    setParticles(items)
    const timer = setTimeout(onDone, 1200)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emoji])

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      pointerEvents: 'none',
      zIndex: 50,
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            fontSize: 20,
            left: p.x,
            animation: `reactionFly ${p.duration}s ease forwards`,
            '--tx': `${p.x * 2}px`,
            '--ty': `${p.y}px`,
          } as React.CSSProperties & { '--tx': string; '--ty': string }}
        >
          {p.emoji}
        </div>
      ))}
      <style>{`
        @keyframes reactionFly {
          0%   { transform: translate(0,0) scale(0); opacity: 1; }
          50%  { transform: translate(var(--tx), var(--ty)) scale(1.3); opacity: 1; }
          100% { transform: translate(calc(var(--tx)*1.5), calc(var(--ty)*2)) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
