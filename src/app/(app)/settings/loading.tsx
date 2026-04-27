import { SkeletonBlock, SkeletonCard, SkeletonAvatar } from '@/components/shared/Skeleton'

export default function SettingsLoading() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SkeletonBlock width={80} height={28} radius={6} style={{ marginBottom: 20 }} />

      {/* Couple section */}
      <SkeletonCard style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            <SkeletonAvatar size={48} />
            <SkeletonAvatar size={48} style={{ marginLeft: -12 }} />
          </div>
          <div style={{ flex: 1 }}>
            <SkeletonBlock width={120} height={16} style={{ marginBottom: 6 }} />
            <SkeletonBlock width={80} height={12} />
          </div>
        </div>
      </SkeletonCard>

      {/* Profile section */}
      <SkeletonCard style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <SkeletonAvatar size={56} />
          <div style={{ flex: 1 }}>
            <SkeletonBlock width={100} height={16} style={{ marginBottom: 6 }} />
            <SkeletonBlock width={160} height={12} />
          </div>
        </div>
      </SkeletonCard>

      {/* Settings items */}
      {[1, 2, 3, 4].map(i => (
        <SkeletonCard key={i} style={{ marginBottom: 10 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 24,
          }}>
            <SkeletonBlock width={120} height={14} />
            <SkeletonBlock width={48} height={28} radius={14} />
          </div>
        </SkeletonCard>
      ))}
    </div>
  )
}
