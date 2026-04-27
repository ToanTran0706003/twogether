"use client"

import { useEffect, useRef } from "react"
import { floatPetals, injectKeyframes } from "@/lib/animations"

interface PetalEffectProps {
  anniversary: string | null
}

export default function PetalEffect({ anniversary }: PetalEffectProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!anniversary || !ref.current) return
    const today = new Date()
    const ann = new Date(anniversary)
    const isAnniversary =
      today.getDate() === ann.getDate() &&
      today.getMonth() === ann.getMonth()
    if (!isAnniversary) return

    injectKeyframes()
    floatPetals(ref.current, 12)
    const interval = setInterval(() => {
      if (ref.current) floatPetals(ref.current, 8)
    }, 3000)
    return () => clearInterval(interval)
  }, [anniversary])

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        borderRadius: 24,
      }}
    />
  )
}
