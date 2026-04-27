import { SkeletonBlock } from '@/components/shared/Skeleton'

export default function SpinnerLoading() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SkeletonBlock width={120} height={28} radius={6} style={{ marginBottom: 20 }} />

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {[70, 80, 90, 70, 60].map((w, i) => (
          <SkeletonBlock key={i} width={w} height={32} radius={20} />
        ))}
      </div>

      {/* Spin wheel */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <SkeletonBlock width={220} height={220} radius={110} />
      </div>

      {/* Spin button */}
      <SkeletonBlock height={48} radius={24} style={{ margin: '0 40px 20px' }} />

      {/* Result card */}
      <div style={{
        background: '#FBEAF0',
        borderRadius: 16,
        padding: 16,
      }}>
        <SkeletonBlock width={60} height={40} radius={8} style={{ margin: '0 auto 12px' }} />
        <SkeletonBlock width="60%" height={18} style={{ margin: '0 auto 8px' }} />
        <SkeletonBlock width="80%" height={14} style={{ margin: '0 auto' }} />
      </div>
    </div>
  )
}
