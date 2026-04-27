"use client"
import { useState } from 'react'
import type { DateIdea } from '@/lib/date-ideas'

interface SpinWheelProps {
  onSpinEnd: (idea: DateIdea) => void
  ideas: DateIdea[]
  isSpinning: boolean
  setIsSpinning: (v: boolean) => void
}

const SEGMENTS = [
  '#F7D6DF', '#D8EDE5', '#EDE8F5',
  '#FFF0C0', '#F5D0D0', '#C8D8E8',
  '#F0D8F0', '#D8EDE5',
]

export function SpinWheel({ onSpinEnd, ideas, isSpinning, setIsSpinning }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0)

  const size = 240
  const cx = size / 2
  const count = SEGMENTS.length

  const slicePath = (index: number, total: number) => {
    const angle = (2 * Math.PI) / total
    const start = index * angle - Math.PI / 2
    const end = start + angle
    const r = size / 2 - 4
    const x1 = cx + r * Math.cos(start)
    const y1 = cx + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cx + r * Math.sin(end)
    return `M ${cx} ${cx} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`
  }

  const spin = () => {
    if (isSpinning || ideas.length === 0) return
    setIsSpinning(true)
    const extra = 1440 + Math.random() * 360
    setRotation(prev => prev + extra)
    setTimeout(() => {
      const picked = ideas[Math.floor(Math.random() * ideas.length)]
      onSpinEnd(picked)
      setIsSpinning(false)
    }, 1400)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      {/* Pointer */}
      <div style={{
        width: 0, height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '20px solid #C0607A',
        filter: 'drop-shadow(0 2px 4px rgba(192,96,122,0.4))',
        zIndex: 2,
        marginBottom: -2,
      }} />

      {/* Wheel */}
      <div style={{
        width: size, height: size,
        borderRadius: '50%',
        position: 'relative',
        transform: `rotate(${rotation}deg)`,
        transition: isSpinning
          ? 'transform 1.4s cubic-bezier(0.17,0.67,0.12,1)'
          : 'none',
        boxShadow: '0 8px 32px rgba(232,160,176,0.3)',
      }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {SEGMENTS.map((color, i) => (
            <path
              key={i}
              d={slicePath(i, count)}
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          ))}
          <circle cx={cx} cy={cx} r={28} fill="white" />
          <text
            x={cx} y={cx + 8}
            textAnchor="middle"
            fontSize="22"
            style={{ userSelect: 'none' }}
          >🎡</text>
        </svg>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        style={{
          marginTop: 24,
          padding: '14px 40px',
          borderRadius: 50,
          background: isSpinning
            ? '#E5E7EB'
            : 'linear-gradient(135deg, #E8A0B0, #C0607A)',
          color: isSpinning ? '#9CA3AF' : 'white',
          border: 'none',
          fontSize: 16,
          fontWeight: 500,
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          boxShadow: isSpinning ? 'none' : '0 4px 20px rgba(192,96,122,0.35)',
          transition: 'all 0.3s',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{
          display: 'inline-block',
          animation: isSpinning ? 'spin 0.8s linear infinite' : 'none',
        }}>
          {isSpinning ? '⟳' : '🎲'}
        </span>
        {isSpinning ? 'Đang quay...' : 'Quay vòng!'}
      </button>
    </div>
  )
}
