"use client"
import { useState } from 'react'
import type { QuestItem } from '@/types'
import CompleteDialog from './CompleteDialog'
import { injectKeyframes } from '@/lib/animations'

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Ăn uống',
  travel: 'Du lịch',
  home: 'Ở nhà',
  adventure: 'Phiêu lưu',
  creative: 'Sáng tạo',
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  food:      { bg: '#FFF0C0', text: '#854F0B' },
  travel:    { bg: '#D8EDE5', text: '#2A6A55' },
  home:      { bg: '#EDE8F5', text: '#534AB7' },
  adventure: { bg: '#FBEAF0', text: '#993556' },
  creative:  { bg: '#E6F1FB', text: '#185FA5' },
}

interface QuestCardProps {
  item: QuestItem
  onComplete: (id: string, photoUrl?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onEdit: (id: string, title: string) => Promise<void>
}

export function QuestCard({ item, onComplete, onDelete, onEdit }: QuestCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const [ticking, setTicking] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  const catColor = CATEGORY_COLORS[item.category ?? ''] ?? { bg: '#F0EEF5', text: '#7A5A65' }
  const catLabel = CATEGORY_LABELS[item.category ?? ''] ?? item.category

  const handleTick = () => {
    if (item.completed || ticking) return
    injectKeyframes()
    setTicking(true)
    setTimeout(() => setTicking(false), 400)
    setShowComplete(true)
  }

  const handleConfirmComplete = async (photoUrl?: string) => {
    setShowComplete(false)
    await onComplete(item.id, photoUrl)
  }

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return
    await onEdit(item.id, editTitle.trim())
    setEditing(false)
    setShowMenu(false)
  }

  const handleDelete = async () => {
    if (!confirm('Xóa quest này?')) return
    await onDelete(item.id)
    setShowMenu(false)
  }

  return (
    <>
      <div style={{
        background: 'white',
        borderRadius: 16,
        border: `0.5px solid ${item.completed ? '#B8DEC8' : '#F4C0D1'}`,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'relative',
        opacity: item.completed ? 0.85 : 1,
        transition: 'all 0.2s',
      }}>
        {/* Tick — perfectly round */}
        <button
          onClick={handleTick}
          disabled={item.completed}
          style={{
            width: 32,
            height: 32,
            minWidth: 32,
            borderRadius: '50%',
            border: `2px solid ${item.completed ? '#3B6D11' : '#F4C0D1'}`,
            background: item.completed ? '#3B6D11' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: item.completed ? 'default' : 'pointer',
            flexShrink: 0,
            transition: 'all 0.3s',
            animation: ticking ? 'tickFill 0.4s ease forwards' : 'none',
            padding: 0,
            outline: 'none',
            minHeight: 'unset',
          }}
        >
          {item.completed && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2.5 7L5.5 10L11.5 4"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 14,
                  strokeDashoffset: 0,
                  animation: 'checkDraw 0.3s ease 0.1s both',
                }}
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && void handleSaveEdit()}
                autoFocus
                style={{
                  flex: 1,
                  fontSize: 14,
                  border: '1px solid #F4C0D1',
                  borderRadius: 8,
                  padding: '4px 8px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => void handleSaveEdit()}
                style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 8,
                  background: '#C0607A', color: 'white', border: 'none',
                  cursor: 'pointer', minHeight: 'unset',
                }}
              >Lưu</button>
              <button
                onClick={() => { setEditing(false); setEditTitle(item.title) }}
                style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 8,
                  background: '#F0EEF5', color: '#7A5A65', border: 'none',
                  cursor: 'pointer', minHeight: 'unset',
                }}
              >Huỷ</button>
            </div>
          ) : (
            <>
              <p style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#3A2832',
                textDecoration: item.completed ? 'line-through' : 'none',
                textDecorationColor: '#B8DEC8',
                marginBottom: item.category ? 4 : 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.title}
              </p>
              {item.category && (
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20,
                  background: catColor.bg, color: catColor.text, fontWeight: 500,
                }}>
                  {catLabel}
                </span>
              )}
              {item.completed && item.completed_at && (
                <p style={{ fontSize: 11, color: '#8A9A8A', marginTop: 3 }}>
                  Hoàn thành {new Date(item.completed_at).toLocaleDateString('vi-VN')}
                </p>
              )}
            </>
          )}
        </div>

        {/* 3-dot menu */}
        {!item.completed && !editing && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                border: 'none',
                background: showMenu ? '#F7D6DF' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 16, color: '#B8909A',
                flexShrink: 0, minHeight: 'unset',
              }}
            >⋯</button>

            {showMenu && (
              <div style={{
                position: 'absolute', right: 0, top: 32,
                background: 'white', borderRadius: 12,
                border: '0.5px solid #F4C0D1',
                boxShadow: '0 4px 20px rgba(192,96,122,0.15)',
                zIndex: 10, minWidth: 120, overflow: 'hidden',
                animation: 'fadeUp 0.2s ease both',
              }}>
                <button
                  onClick={() => { setEditing(true); setShowMenu(false) }}
                  style={{
                    width: '100%', padding: '10px 14px', border: 'none',
                    background: 'transparent', textAlign: 'left',
                    fontSize: 13, color: '#3A2832', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderBottom: '0.5px solid #F7D6DF', minHeight: 'unset',
                  }}
                >✏️ Chỉnh sửa</button>
                <button
                  onClick={() => void handleDelete()}
                  style={{
                    width: '100%', padding: '10px 14px', border: 'none',
                    background: 'transparent', textAlign: 'left',
                    fontSize: 13, color: '#DC2626', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    minHeight: 'unset',
                  }}
                >🗑️ Xóa</button>
              </div>
            )}
          </div>
        )}
      </div>

      <CompleteDialog
        open={showComplete}
        onOpenChange={setShowComplete}
        questTitle={item.title}
        onConfirm={handleConfirmComplete}
        isLoading={false}
      />
    </>
  )
}
