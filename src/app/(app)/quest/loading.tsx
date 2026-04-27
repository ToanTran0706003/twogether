import { SkeletonBlock, SkeletonCard } from '@/components/shared/Skeleton'

export default function QuestLoading() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SkeletonBlock width={120} height={28} radius={6} style={{ marginBottom: 16 }} />

      <div style={{
        background: '#EFF8F2',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
      }}>
        <SkeletonBlock width={120} height={14} style={{ marginBottom: 8 }} />
        <SkeletonBlock height={6} radius={3} />
        <SkeletonBlock width={160} height={12} style={{ marginTop: 6 }} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[80, 90, 70].map((w, i) => (
          <SkeletonBlock key={i} width={w} height={32} radius={20} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <SkeletonCard key={i} height={64}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 32,
            }}>
              <SkeletonBlock width={28} height={28} radius={14} />
              <div style={{ flex: 1 }}>
                <SkeletonBlock height={14} width="70%" />
              </div>
              <SkeletonBlock width={60} height={22} radius={20} />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  )
}
