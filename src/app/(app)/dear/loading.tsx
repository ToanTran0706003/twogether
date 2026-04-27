import { SkeletonBlock, SkeletonCard } from '@/components/shared/Skeleton'

export default function DearLoading() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SkeletonBlock width={100} height={28} radius={6} style={{ marginBottom: 16 }} />

      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        <SkeletonBlock width="50%" height={40} radius={20} />
        <SkeletonBlock width="50%" height={40} radius={20} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3].map(i => (
          <SkeletonCard key={i}>
            <SkeletonBlock width={80} height={12} style={{ marginBottom: 8 }} />
            <SkeletonBlock height={14} style={{ marginBottom: 6 }} />
            <SkeletonBlock width="80%" height={14} style={{ marginBottom: 12 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <SkeletonBlock width={100} height={12} />
              <SkeletonBlock width={80} height={24} radius={20} />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  )
}
