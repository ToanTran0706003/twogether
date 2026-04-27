export function LoadingSpinner({
  size = 20,
  color = '#C0607A',
}: {
  size?: number
  color?: string
}) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid ${color}22`,
      borderTopColor: color,
      animation: 'spin 0.8s linear infinite',
      flexShrink: 0,
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function LoadingOverlay({ text = 'Đang tải...' }: { text?: string }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(253,248,245,0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      zIndex: 200,
      backdropFilter: 'blur(4px)',
    }}>
      <LoadingSpinner size={40} />
      <p style={{
        fontSize: 14,
        color: '#7A5A65',
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
      }}>
        {text}
      </p>
    </div>
  )
}

export function LoadingButton({
  loading,
  children,
  onClick,
  disabled,
  style = {},
}: {
  loading: boolean
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        width: '100%',
        padding: '14px 0',
        borderRadius: 14,
        background: loading || disabled ? '#E5E7EB' : '#C0607A',
        color: loading || disabled ? '#9CA3AF' : 'white',
        border: 'none',
        fontSize: 15,
        fontWeight: 500,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...style,
      }}
    >
      {loading && <LoadingSpinner size={16} color="white" />}
      {children}
    </button>
  )
}
