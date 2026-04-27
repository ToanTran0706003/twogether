"use client"
import { useState, useEffect } from 'react'
import { useMood } from '@/hooks/useMood'
import { MOOD_OPTIONS, getMoodByEmoji } from '@/lib/mood-config'
import type { MoodEntry } from '@/types'

interface Props {
  coupleId: string
  currentUserId: string
  partnerName: string
  initialEntries: MoodEntry[]
}

export function MoodClient({
  coupleId, currentUserId, partnerName, initialEntries,
}: Props) {
  const { myMood, partnerMood, isSaving: saving, saveError, updateMood, today } = useMood({
    coupleId,
    userId: currentUserId,
  })

  // Weekly grid entries: seeded from server, kept in sync via hook-derived myMood/partnerMood
  const [weeklyEntries, setWeeklyEntries] = useState<MoodEntry[]>(initialEntries)
  const [showPicker, setShowPicker] = useState(false)

  // Sync today's moods into the weekly grid when the hook updates them
  useEffect(() => {
    if (myMood) {
      setWeeklyEntries(prev => [
        myMood,
        ...prev.filter(e => !(e.user_id === currentUserId && e.entry_date === myMood.entry_date)),
      ])
    }
  }, [myMood, currentUserId])

  useEffect(() => {
    if (partnerMood) {
      setWeeklyEntries(prev => [
        partnerMood,
        ...prev.filter(e => !(e.user_id === partnerMood.user_id && e.entry_date === partnerMood.entry_date)),
      ])
    }
  }, [partnerMood])

  const myMoodInfo = myMood ? getMoodByEmoji(myMood.emoji) : null
  const partnerMoodInfo = partnerMood ? getMoodByEmoji(partnerMood.emoji) : null

  const handleSelectMood = async (emoji: string, color: string) => {
    const result = await updateMood(emoji, color)
    if (result) setShowPicker(false)
  }

  // Streak count
  const streakDays = (() => {
    let count = 0
    const d = new Date()
    while (true) {
      const dateStr = d.toISOString().split('T')[0]
      const hasEntry = weeklyEntries.some(e => e.user_id === currentUserId && e.entry_date === dateStr)
      if (!hasEntry) break
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  })()

  // Most common mood this week
  const myWeekEntries = weeklyEntries.filter(e => e.user_id === currentUserId)
  const moodCount: Record<string, number> = {}
  myWeekEntries.forEach(e => { moodCount[e.emoji] = (moodCount[e.emoji] || 0) + 1 })
  const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0]

  // Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const dayLabels = ['T2','T3','T4','T5','T6','T7','CN']
  const getDayLabel = (dateStr: string) => {
    const day = new Date(dateStr).getDay()
    return dayLabels[day === 0 ? 6 : day - 1]
  }

  const isToday = (dateStr: string) => dateStr === today

  const bothCheckedIn = myMood && partnerMood
  const neitherCheckedIn = !myMood && !partnerMood

  const sweetMessages = [
    '"Hôm nay cả hai đều online ♡"',
    '"Tuyệt vời khi cùng cảm nhận nhau ♡"',
    '"Nhịp tim hai mình đang đồng điệu ♡"',
  ]
  const sweetMsg = sweetMessages[Math.floor(Math.random() * sweetMessages.length)]

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#FDF8F5',
      paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
    }}>
      {/* Gradient bar top */}
      <div style={{
        height: 4,
        background: 'linear-gradient(90deg, #F7D6DF, #E8A0B0, #C4B5D8)',
      }} />

      <div style={{ padding: '18px 16px 0' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 4,
        }}>
          <div>
            <h1 style={{
              fontSize: 24,
              fontWeight: 400,
              color: '#3A2832',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              lineHeight: 1.2,
            }}>
              Moodboard
            </h1>
            <p style={{ fontSize: 11, color: '#B8909A', marginTop: 2 }}>
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long', day: 'numeric', month: 'long'
              })} ♡
            </p>
          </div>
          <span style={{
            fontSize: 28,
            animation: 'float 3s ease-in-out infinite',
          }}>🌸</span>
        </div>

        {/* Stats pills */}
        <div style={{
          display: 'flex',
          gap: 8,
          margin: '12px 0 16px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: '#FBEAF0',
            border: '0.5px solid #F4C0D1',
            borderRadius: 20,
            padding: '5px 12px',
          }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#C0607A' }}>
              {streakDays} ngày streak
            </span>
          </div>
          {topMood && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#FBEAF0',
              border: '0.5px solid #F4C0D1',
              borderRadius: 20,
              padding: '5px 12px',
            }}>
              <span style={{ fontSize: 14 }}>{topMood}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: '#C0607A' }}>
                mood nổi bật
              </span>
            </div>
          )}
        </div>

        {/* MAIN MOOD CARD */}
        <div style={{
          background: 'white',
          borderRadius: 24,
          border: '0.5px solid #F4C0D1',
          overflow: 'hidden',
          marginBottom: 12,
        }}>
          {/* Card header */}
          <div style={{
            background: '#FDF0F5',
            padding: '10px 16px',
            borderBottom: '0.5px solid #FCE4EC',
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#C0607A',
              letterSpacing: '0.04em',
            }}>
              Cảm xúc hôm nay của hai mình
            </p>
          </div>

          {/* Two cards side by side */}
          <div style={{
            display: 'flex',
            padding: '16px 12px',
            gap: 8,
          }}>
            {/* Me */}
            <div style={{
              flex: 1,
              background: myMoodInfo?.color ? myMoodInfo.color + '88' : '#FFF5F8',
              borderRadius: 18,
              padding: '14px 8px',
              textAlign: 'center',
              border: '1px solid #FCE4EC',
              transition: 'background 0.4s ease',
            }}>
              <p style={{
                fontSize: 9,
                fontWeight: 500,
                color: '#E8A0B0',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                Mình
              </p>
              <div style={{
                fontSize: 40,
                lineHeight: 1,
                marginBottom: 6,
                animation: myMood ? 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
              }}>
                {myMood?.emoji ?? '🌙'}
              </div>
              <p style={{
                fontSize: 12,
                fontWeight: 500,
                color: myMoodInfo?.textColor ?? '#B8909A',
                marginBottom: 10,
              }}>
                {myMoodInfo?.label ?? 'Chưa cập nhật'}
              </p>
              <button
                onClick={() => setShowPicker(!showPicker)}
                disabled={saving}
                style={{
                  fontSize: 11,
                  padding: '6px 0',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.8)',
                  border: '0.5px solid #F4C0D1',
                  color: '#C0607A',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                {myMood ? '✏️ Thay đổi' : '+ Cập nhật'}
              </button>
            </div>

            {/* Heart divider */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '0 2px',
            }}>
              <div style={{ width: 1, height: 20, background: '#FCE4EC' }} />
              <span style={{
                fontSize: 16,
                color: '#E8A0B0',
                animation: 'pulse 2s ease-in-out infinite',
              }}>♡</span>
              <div style={{ width: 1, height: 20, background: '#FCE4EC' }} />
            </div>

            {/* Partner */}
            <div style={{
              flex: 1,
              background: partnerMoodInfo?.color ? partnerMoodInfo.color + '88' : '#F5FBF8',
              borderRadius: 18,
              padding: '14px 8px',
              textAlign: 'center',
              border: '1px solid #D8EDE5',
              transition: 'background 0.4s ease',
            }}>
              <p style={{
                fontSize: 9,
                fontWeight: 500,
                color: '#A8C5B5',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                {partnerName.split(' ').slice(-1)[0]}
              </p>
              <div style={{
                fontSize: 40,
                lineHeight: 1,
                marginBottom: 6,
                animation: partnerMood ? 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
              }}>
                {partnerMood?.emoji ?? '🌙'}
              </div>
              <p style={{
                fontSize: 12,
                fontWeight: 500,
                color: partnerMoodInfo?.textColor ?? '#A8C5B5',
                marginBottom: 10,
              }}>
                {partnerMoodInfo?.label ?? 'Chưa cập nhật'}
              </p>
              <div style={{
                fontSize: 11,
                padding: '6px 0',
                borderRadius: 20,
                background: partnerMood
                  ? 'rgba(168,197,181,0.3)'
                  : 'rgba(255,255,255,0.6)',
                border: `0.5px solid ${partnerMood ? '#B8DEC8' : '#D8EDE5'}`,
                color: partnerMood ? '#2A6A55' : '#A8C5B5',
                textAlign: 'center',
              }}>
                {partnerMood ? '✓ Đã cập nhật' : 'Đang chờ...'}
              </div>
            </div>
          </div>

          {/* Sweet message khi cả 2 check in */}
          {bothCheckedIn && (
            <div style={{
              margin: '0 12px 14px',
              background: '#FFFBF5',
              borderRadius: 12,
              padding: '8px 12px',
              border: '0.5px solid #F9E4C8',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              animation: 'fadeUp 0.4s ease both',
            }}>
              <span style={{ fontSize: 14 }}>✨</span>
              <span style={{
                fontSize: 11,
                color: '#C0607A',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
              }}>
                {sweetMsg}
              </span>
            </div>
          )}

          {/* Encourage khi chưa ai check in */}
          {neitherCheckedIn && (
            <div style={{
              margin: '0 12px 14px',
              background: '#FBEAF0',
              borderRadius: 12,
              padding: '8px 12px',
              border: '0.5px solid #F4C0D1',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: 11,
                color: '#C0607A',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
              }}>
                &quot;Hôm nay bạn đang cảm thấy thế nào? ♡&quot;
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {saveError && (
          <div style={{
            background: '#FFF0F0',
            border: '0.5px solid #F4C0C0',
            borderRadius: 12,
            padding: '8px 14px',
            marginBottom: 12,
            fontSize: 12,
            color: '#A32D2D',
            textAlign: 'center',
          }}>
            {saveError}
          </div>
        )}

        {/* MOOD PICKER */}
        {showPicker && (
          <div style={{
            background: 'white',
            borderRadius: 20,
            border: '0.5px solid #F4C0D1',
            padding: '14px 14px 10px',
            marginBottom: 12,
            animation: 'fadeUp 0.3s ease both',
          }}>
            <p style={{
              fontSize: 11,
              color: '#B8909A',
              fontWeight: 500,
              textAlign: 'center',
              marginBottom: 12,
            }}>
              Hôm nay bạn thế nào? 🌸
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 6,
              marginBottom: 10,
            }}>
              {MOOD_OPTIONS.map(mood => (
                <button
                  key={mood.emoji}
                  onClick={() => void handleSelectMood(mood.emoji, mood.color)}
                  disabled={saving}
                  style={{
                    background: mood.color,
                    border: myMood?.emoji === mood.emoji
                      ? `2px solid ${mood.textColor}`
                      : '2px solid transparent',
                    borderRadius: 14,
                    padding: '10px 4px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    opacity: saving ? 0.6 : 1,
                    transition: 'transform 0.15s',
                  }}
                >
                  <span style={{ fontSize: 26, display: 'block' }}>{mood.emoji}</span>
                  <span style={{
                    fontSize: 9,
                    color: mood.textColor,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    textAlign: 'center',
                  }}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPicker(false)}
              style={{
                width: '100%',
                padding: '8px 0',
                borderRadius: 20,
                background: 'transparent',
                border: '0.5px solid #F4C0D1',
                color: '#B8909A',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              Đóng
            </button>
          </div>
        )}

        {/* WEEKLY GRID */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          border: '0.5px solid #F4C0D1',
          padding: '14px 12px',
          marginBottom: 12,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#3A2832' }}>
              7 ngày gần nhất
            </p>
            <p style={{ fontSize: 10, color: '#B8909A' }}>tuần này</p>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '24px repeat(7, 1fr)',
            gap: 3,
            alignItems: 'center',
          }}>
            {/* Header row */}
            <div />
            {last7Days.map(d => (
              <div key={d} style={{
                fontSize: 8,
                color: isToday(d) ? '#C0607A' : '#B8909A',
                fontWeight: isToday(d) ? 600 : 400,
                textAlign: 'center',
                background: isToday(d) ? '#FBEAF0' : 'transparent',
                borderRadius: 4,
                padding: '2px 0',
              }}>
                {getDayLabel(d)}
              </div>
            ))}

            {/* My row */}
            <div style={{
              width: 22, height: 22,
              borderRadius: '50%',
              background: '#F7D6DF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 600,
              color: '#C0607A',
            }}>M</div>
            {last7Days.map(d => {
              const entry = weeklyEntries.find(e => e.user_id === currentUserId && e.entry_date === d)
              return (
                <div key={d} style={{
                  height: 30,
                  borderRadius: 8,
                  background: entry?.color ?? '#F0EEF5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: entry ? 16 : 0,
                  transition: 'all 0.3s',
                  animation: entry && isToday(d)
                    ? 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both'
                    : 'none',
                }}>
                  {entry?.emoji}
                </div>
              )
            })}

            {/* Partner row */}
            <div style={{
              width: 22, height: 22,
              borderRadius: '50%',
              background: '#D8EDE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 600,
              color: '#2A6A55',
            }}>
              {partnerName.charAt(0).toUpperCase()}
            </div>
            {last7Days.map(d => {
              const entry = weeklyEntries.find(e => e.user_id !== currentUserId && e.entry_date === d)
              return (
                <div key={d} style={{
                  height: 30,
                  borderRadius: 8,
                  background: entry?.color ?? '#F0EEF5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: entry ? 16 : 0,
                  transition: 'all 0.3s',
                  animation: entry && isToday(d)
                    ? 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.4s both'
                    : 'none',
                }}>
                  {entry?.emoji}
                </div>
              )
            })}
          </div>

          {/* Sweet message khi cả 2 check in */}
          {bothCheckedIn && (
            <div style={{
              marginTop: 10,
              background: '#FFF5F8',
              borderRadius: 10,
              padding: '7px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ fontSize: 13 }}>✨</span>
              <span style={{
                fontSize: 10,
                color: '#C0607A',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
              }}>
                {sweetMsg}
              </span>
            </div>
          )}
        </div>

        {/* LEGEND — 4 cột cố định */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 5,
          paddingBottom: 8,
        }}>
          {MOOD_OPTIONS.map(mood => (
            <div key={mood.emoji} style={{
              background: mood.color,
              borderRadius: 20,
              padding: '5px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}>
              <span style={{ fontSize: 12 }}>{mood.emoji}</span>
              <span style={{
                fontSize: 9,
                color: mood.textColor,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>
                {mood.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes popIn {
          0%  { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); }
          100%{ transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.88); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        button:active { transform: scale(0.95); }
      `}</style>
    </div>
  )
}
