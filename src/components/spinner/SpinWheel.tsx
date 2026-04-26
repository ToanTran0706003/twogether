"use client"

import { useState, useEffect, useRef } from "react"

const WHEEL_COLORS = [
  "#F7D6DF",
  "#D8EDE5",
  "#EDE8F5",
  "#FFF0C0",
  "#C8D8E8",
  "#F5D0D0",
]

interface SpinWheelProps {
  segments: number
  isSpinning: boolean
  onSpin: () => void
}

export default function SpinWheel({ segments, isSpinning, onSpin }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0)
  const prevSpinning = useRef(false)

  useEffect(() => {
    if (prevSpinning.current && !isSpinning) {
      // Spin just ended
    }
    prevSpinning.current = isSpinning
  }, [isSpinning])

  function handleClick() {
    if (isSpinning) return
    const extra = 720 + Math.random() * 360
    setRotation((r) => r + extra)
    onSpin()
  }

  const effectiveSegments = Math.max(segments, 6)
  const sliceAngle = 360 / effectiveSegments

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Fixed pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ top: "-10px" }}
        >
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "16px solid #C0607A",
            }}
          />
        </div>

        {/* Wheel */}
        <div
          className="w-64 h-64 rounded-full shadow-lg overflow-hidden"
          style={{
            background: `conic-gradient(${WHEEL_COLORS.slice(0, effectiveSegments)
              .map((color, i) => `${color} ${(i / effectiveSegments) * 100}% ${((i + 1) / effectiveSegments) * 100}%`)
              .join(", ")})`,
            transition: isSpinning
              ? "transform 1.2s cubic-bezier(0.17, 0.67, 0.35, 0.97)"
              : "none",
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* Center circle */}
          <div
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-md"
              style={{ backgroundColor: "#FFFFFF", color: "#C0607A" }}
            >
              🎯
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleClick}
        disabled={isSpinning}
        className="px-8 py-3 rounded-full text-sm font-semibold shadow-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        style={{
          backgroundColor: isSpinning ? "#C0909C" : "#E8A0B0",
          color: "#FFFFFF",
        }}
      >
        {isSpinning ? "Đang quay..." : "🎰 Quay vòng!"}
      </button>
    </div>
  )
}
