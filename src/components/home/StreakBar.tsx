"use client"
import { useMemo } from 'react'

interface StreakBarProps {
  streakCount: number
  entries: { entry_date: string; user_id: string }[]
  currentUserId: string
}

export function StreakBar({ streakCount, entries, currentUserId }: StreakBarProps) {
  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toISOString().split('T')[0]
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
      const dayName = dayNames[d.getDay()]
      const hasEntry = entries.some(
        e => e.user_id === currentUserId && e.entry_date === dateStr
      )
      const isToday = i === 6
      return { dateStr, dayName, hasEntry, isToday }
    })
  }, [entries, currentUserId])

  return (
    <div style={{
      margin: '0 16px 16px',
      background: 'white',
      borderRadius: 20,
      border: '0.5px solid #F4C0D1',
      padding: '14px 16px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <div>
            <span style={{ fontSize: 15, fontWeight: 500, color: '#3A2832' }}>
              {streakCount} ngày
            </span>
            <span style={{ fontSize: 12, color: '#B8909A', marginLeft: 4 }}>streak</span>
          </div>
        </div>
        <span style={{
          fontSize: 11,
          color: '#C0607A',
          background: '#FBEAF0',
          padding: '3px 10px',
          borderRadius: 20,
          border: '0.5px solid #F4C0D1',
        }}>
          Check-in hàng ngày
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 4,
      }}>
        {last7.map(({ dayName, hasEntry, isToday }, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: hasEntry
                ? (isToday ? '#C0607A' : '#F7D6DF')
                : (isToday ? '#FBEAF0' : '#F0EEF5'),
              border: isToday
                ? `2px solid ${hasEntry ? '#C0607A' : '#F4C0D1'}`
                : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: hasEntry ? 16 : 12,
              transition: 'all 0.3s',
              animation: hasEntry && isToday
                ? 'streakPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both'
                : 'none',
            }}>
              {hasEntry ? '🔥' : (isToday ? '○' : '')}
            </div>
            <span style={{
              fontSize: 9,
              color: isToday ? '#C0607A' : '#B8909A',
              fontWeight: isToday ? 600 : 400,
            }}>
              {dayName}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 10,
        textAlign: 'center',
        fontSize: 11,
        color: '#B8909A',
        fontStyle: 'italic',
      }}>
        {streakCount === 0
          ? 'Bắt đầu streak hôm nay nhé ♡'
          : streakCount < 3
          ? 'Đang tốt lắm, tiếp tục nhé! ✨'
          : streakCount < 7
          ? `Tuyệt vời! ${streakCount} ngày liên tiếp 🎉`
          : `Wow ${streakCount} ngày rồi! Không thể dừng ♡`}
      </div>
    </div>
  )
}
