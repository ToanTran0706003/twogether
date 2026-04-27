import { SkeletonBlock, SkeletonCard, SkeletonAvatar } from '@/components/shared/Skeleton'

export default function JarLoading() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
        <SkeletonBlock width={80} height={80} radius={40} style={{ margin: '0 auto 12px' }} />
        <SkeletonBlock width={120} height={16} style={{ margin: '0 auto' }} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
        {[60, 50, 40, 80, 70].map((w, i) => (
          <SkeletonBlock key={i} width={w} height={30} radius={20} style={{ flexShrink: 0 }} />
        ))}
      </div>

      <SkeletonBlock width={120} height={14} style={{ marginBottom: 12 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3, 4].map(i => (
          <SkeletonCard key={i}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <SkeletonAvatar size={40} />
              <div style={{ flex: 1 }}>
                <SkeletonBlock height={14} width="70%" style={{ marginBottom: 6 }} />
                <SkeletonBlock height={12} width="40%" />
              </div>
              <SkeletonBlock width={60} height={60} radius={8} />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  )
}
