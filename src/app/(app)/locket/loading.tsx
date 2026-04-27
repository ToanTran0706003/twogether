import { SkeletonBlock } from '@/components/shared/Skeleton'

export default function LocketLoading() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <SkeletonBlock width={100} height={28} radius={6} />
        <SkeletonBlock width={60} height={20} radius={10} />
      </div>

      <SkeletonBlock width={80} height={14} style={{ marginBottom: 12 }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        marginBottom: 16,
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i}>
            <SkeletonBlock height={160} radius={16} />
            <SkeletonBlock
              width="60%"
              height={12}
              style={{ marginTop: 6 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
