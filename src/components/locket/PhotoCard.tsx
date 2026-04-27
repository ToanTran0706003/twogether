"use client"
import { useState, useRef } from 'react'
import type { LocketPhoto } from '@/types'
import { ReactionBurst } from './ReactionBurst'

export function PhotoCard({
  photo,
  isMyPhoto,
  onDelete,
  onReact,
}: {
  photo: LocketPhoto
  isMyPhoto: boolean
  onDelete: (id: string) => void
  onReact: (id: string, emoji: string) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const [burst, setBurst] = useState<string | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleLongPressStart = () => {
    longPressTimer.current = setTimeout(() => setShowMenu(true), 500)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  const handleSave = () => {
    const a = document.createElement('a')
    a.href = photo.photo_url
    a.download = `locket-${photo.id}.jpg`
    a.target = '_blank'
    a.click()
    setShowMenu(false)
  }

  const handleDelete = () => {
    if (!confirm('Xóa ảnh này?')) return
    onDelete(photo.id)
    setShowMenu(false)
  }

  const reactions = ['❤️', '😍', '🥹', '😘', '🤗']

  return (
    <div style={{ position: 'relative' }}>
      <div
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onClick={() => setShowReactions(!showReactions)}
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          aspectRatio: '1',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <img
          src={photo.photo_url}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 7, left: 8, right: 8,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          pointerEvents: 'none',
        }}>
          <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>
            {isMyPhoto ? 'Bạn' : 'Người ấy'}
          </span>
          {photo.reaction && (
            <span style={{ fontSize: 16, lineHeight: 1 }}>{photo.reaction}</span>
          )}
        </div>
        {burst && <ReactionBurst emoji={burst} onDone={() => setBurst(null)} />}
      </div>

      {/* Reaction picker */}
      {showReactions && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          borderRadius: 30,
          padding: '6px 10px',
          display: 'flex',
          gap: 4,
          boxShadow: '0 4px 20px rgba(192,96,122,0.2)',
          border: '0.5px solid #F4C0D1',
          zIndex: 20,
          marginBottom: 6,
          animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
          whiteSpace: 'nowrap',
        }}>
          {reactions.map(emoji => (
            <button
              key={emoji}
              onClick={(e) => {
                e.stopPropagation()
                onReact(photo.id, emoji)
                setBurst(emoji)
                setShowReactions(false)
              }}
              style={{
                fontSize: 22,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 3px',
                borderRadius: 8,
                minHeight: 'unset',
                lineHeight: 1,
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Long press menu */}
      {showMenu && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 30 }}
            onClick={() => setShowMenu(false)}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            borderRadius: 16,
            border: '0.5px solid #F4C0D1',
            boxShadow: '0 8px 32px rgba(192,96,122,0.2)',
            zIndex: 40,
            minWidth: 140,
            overflow: 'hidden',
            animation: 'scaleIn 0.2s ease both',
          }}>
            <button
              onClick={handleSave}
              style={{
                width: '100%',
                padding: '13px 16px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                fontSize: 14,
                color: '#3A2832',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                borderBottom: '0.5px solid #F7D6DF',
                minHeight: 'unset',
              }}
            >
              <span style={{ fontSize: 18 }}>⬇️</span> Lưu ảnh
            </button>
            {isMyPhoto && (
              <button
                onClick={handleDelete}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  fontSize: 14,
                  color: '#DC2626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  minHeight: 'unset',
                }}
              >
                <span style={{ fontSize: 18 }}>🗑️</span> Xóa ảnh
              </button>
            )}
          </div>
        </>
      )}

      {photo.caption && (
        <p style={{ fontSize: 10, color: '#B8909A', marginTop: 4, textAlign: 'center' }}>
          {photo.caption}
        </p>
      )}
    </div>
  )
}
