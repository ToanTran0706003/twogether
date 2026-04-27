export default function MoodLoading() {
  return (
    <div className="animate-pulse px-4 pt-16 space-y-4">
      <div className="h-7 w-28 rounded-lg" style={{ backgroundColor: "#F0E4DF" }} />
      <div className="flex gap-3">
        <div className="flex-1 h-24 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
        <div className="flex-1 h-24 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
      </div>
      <div className="flex gap-3">
        <div className="flex-1 h-28 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
        <div className="flex-1 h-28 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
      </div>
      <div className="h-40 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
    </div>
  )
}
