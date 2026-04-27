"use client"

import React from "react"

const skeletonStyle = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton {
    background: linear-gradient(
      90deg,
      #F7D6DF 25%,
      #FBEAF0 50%,
      #F7D6DF 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }
`

export function SkeletonBlock({
  width = '100%',
  height = 16,
  radius = 8,
  style = {},
}: {
  width?: string | number
  height?: number
  radius?: number
  style?: React.CSSProperties
}) {
  return (
    <>
      <style>{skeletonStyle}</style>
      <div
        className="skeleton"
        style={{
          width,
          height,
          borderRadius: radius,
          flexShrink: 0,
          ...style,
        }}
      />
    </>
  )
}

export function SkeletonText({
  width = '100%',
  lines = 1,
}: {
  width?: string | number
  lines?: number
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          height={14}
          width={i === lines - 1 && lines > 1 ? '60%' : width}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return <SkeletonBlock width={size} height={size} radius={size / 2} style={style} />
}

export function SkeletonCard({
  height = 80,
  children,
  style = {},
}: {
  height?: number
  children?: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      border: '0.5px solid #F7D6DF',
      padding: 16,
      height: children ? undefined : height,
      ...style,
    }}>
      {children || <SkeletonBlock height={height - 32} />}
    </div>
  )
}
