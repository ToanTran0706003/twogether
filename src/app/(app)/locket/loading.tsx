export default function LocketLoading() {
  return (
    <div className="animate-pulse px-4 pt-16">
      <div className="flex justify-between items-center mb-4">
        <div className="h-7 w-24 rounded-lg" style={{ backgroundColor: "#F0E4DF" }} />
        <div className="h-4 w-16 rounded" style={{ backgroundColor: "#F0E4DF" }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
        ))}
      </div>
    </div>
  )
}
