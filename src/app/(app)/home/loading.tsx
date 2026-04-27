import { SkeletonBlock, SkeletonAvatar, SkeletonCard } from '@/components/shared/Skeleton'

export default function HomeLoading() {
  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* TopNav skeleton */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '16px 16px 12px',
      }}>
        <SkeletonBlock width={120} height={24} radius={6} />
        <SkeletonAvatar size={32} />
      </div>

      {/* Hero card skeleton */}
      <div style={{ margin: '0 16px 16px' }}>
        <div style={{
          background: '#2A1820',
          borderRadius: 24,
          padding: 20,
          height: 160,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <SkeletonBlock width={140} height={14} style={{ opacity: 0.3 }} />
          <SkeletonBlock width={80} height={56} style={{ opacity: 0.3 }} />
          <div style={{
            borderTop: '0.5px solid rgba(255,255,255,0.1)',
            paddingTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <SkeletonBlock width={160} height={14} style={{ opacity: 0.3 }} />
            <SkeletonBlock width={80} height={24} radius={20} style={{ opacity: 0.3 }} />
          </div>
        </div>
      </div>

      {/* Mood row skeleton */}
      <div style={{
        display: 'flex', gap: 8,
        padding: '0 16px 16px',
      }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1 }}>
            <SkeletonCard height={80} />
          </div>
        ))}
      </div>

      {/* Module grid skeleton */}
      <div style={{ padding: '0 16px 16px' }}>
        <SkeletonBlock width={80} height={18} style={{ marginBottom: 12 }} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
        }}>
          {[1, 2, 3, 4].map(i => (
            <SkeletonCard key={i} height={90} />
          ))}
        </div>
      </div>

      {/* Memory jar skeleton */}
      <div style={{ padding: '0 16px 16px' }}>
        <SkeletonBlock width={100} height={18} style={{ marginBottom: 12 }} />
        <SkeletonCard height={80}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SkeletonBlock height={14} width="70%" />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[1, 2, 3].map(i => (
                <SkeletonBlock key={i} width={100} height={28} radius={20} />
              ))}
            </div>
          </div>
        </SkeletonCard>
      </div>

      {/* Streak skeleton */}
      <div style={{ padding: '0 16px' }}>
        <SkeletonCard height={60}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            height: 28,
          }}>
            <SkeletonBlock width={28} height={28} radius={14} />
            <div style={{ flex: 1 }}>
              <SkeletonBlock width={100} height={14} />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <SkeletonBlock key={i} width={24} height={24} radius={12} />
              ))}
            </div>
          </div>
        </SkeletonCard>
      </div>
    </div>
  )
}
