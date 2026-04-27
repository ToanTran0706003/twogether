import { SkeletonBlock } from '@/components/shared/Skeleton'

export default function MoodLoading() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SkeletonBlock width={120} height={28} radius={6} style={{ marginBottom: 20 }} />

      <SkeletonBlock width={160} height={16} style={{ marginBottom: 12 }} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
        marginBottom: 24,
      }}>
        {[1,2,3,4,5,6,7,8].map(i => (
          <SkeletonBlock key={i} height={64} radius={12} />
        ))}
      </div>

      <SkeletonBlock width={140} height={16} style={{ marginBottom: 12 }} />
      <div style={{
        background: 'white',
        borderRadius: 16,
        border: '0.5px solid #F7D6DF',
        padding: 12,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
        }}>
          {[...Array(14)].map((_, i) => (
            <SkeletonBlock key={i} height={48} radius={8} />
          ))}
        </div>
      </div>
    </div>
  )
}
