"use client"
import { useState, useEffect } from 'react'

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        background: checked ? '#C0607A' : '#E5E7EB',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.25s',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 3,
        left: checked ? 23 : 3,
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}/>
    </div>
  )
}

export function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(false)
  const [moodReminder, setMoodReminder] = useState(false)
  const [loading, setLoading] = useState(false)
  const [supported, setSupported] = useState(true)
  const [permissionState, setPermissionState] = useState<string>('default')

  useEffect(() => {
    if (!('Notification' in window)) {
      setSupported(false)
      return
    }
    setPermissionState(Notification.permission)
    setPushEnabled(Notification.permission === 'granted')
    const saved = localStorage.getItem('mood_reminder')
    setMoodReminder(saved === 'true')
  }, [])

  const handlePushToggle = async (val: boolean) => {
    if (!supported || loading) return
    setLoading(true)
    try {
      if (val) {
        const permission = await Notification.requestPermission()
        setPermissionState(permission)
        if (permission === 'granted') {
          setPushEnabled(true)
          localStorage.setItem('push_enabled', 'true')
          new Notification('TwoGether ♡', {
            body: 'Thông báo đã được bật!',
            icon: '/icon-192.png',
          })
        } else {
          setPushEnabled(false)
          localStorage.setItem('push_enabled', 'false')
        }
      } else {
        setPushEnabled(false)
        localStorage.setItem('push_enabled', 'false')
      }
    } catch (err) {
      console.error('Push toggle error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMoodReminder = (val: boolean) => {
    setMoodReminder(val)
    localStorage.setItem('mood_reminder', String(val))
  }

  const getStatusText = () => {
    if (!supported) return 'Trình duyệt không hỗ trợ'
    if (permissionState === 'denied') return 'Đã bị từ chối — vào Settings trình duyệt để bật'
    if (pushEnabled) return 'Đang bật — nhận thông báo từ người yêu ♡'
    return 'Tắt — bật để không bỏ lỡ gì ♡'
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      border: '0.5px solid #F4C0D1',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        fontSize: 11,
        fontWeight: 600,
        color: '#B8909A',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        borderBottom: '0.5px solid #F7D6DF',
        background: '#FDF8F5',
      }}>
        Thông báo
      </div>

      <div style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        borderBottom: '0.5px solid #F7D6DF',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#3A2832', marginBottom: 2 }}>
            Thông báo đẩy
          </div>
          <div style={{ fontSize: 12, color: '#B8909A', lineHeight: 1.4 }}>
            {getStatusText()}
          </div>
        </div>
        <ToggleSwitch
          checked={pushEnabled}
          onChange={(v) => void handlePushToggle(v)}
          disabled={loading || !supported || permissionState === 'denied'}
        />
      </div>

      <div style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#3A2832', marginBottom: 2 }}>
            Nhắc check-in mood
          </div>
          <div style={{ fontSize: 12, color: '#B8909A', lineHeight: 1.4 }}>
            Nhắc lúc 21:00 nếu chưa cập nhật
          </div>
        </div>
        <ToggleSwitch
          checked={moodReminder}
          onChange={handleMoodReminder}
          disabled={!pushEnabled}
        />
      </div>
    </div>
  )
}
