export default function HomeSkeleton() {
  return (
    <div className="animate-pulse space-y-4 px-4 pt-4">
      <div className="h-8 w-32 rounded-md" style={{ backgroundColor: "#F0E4DF" }} />
      <div className="h-48 rounded-3xl" style={{ backgroundColor: "#F0E4DF" }} />
      <div className="h-28 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
        ))}
      </div>
      <div className="h-20 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
      <div className="h-16 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
    </div>
  )
}
