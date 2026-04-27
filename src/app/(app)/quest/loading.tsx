export default function QuestLoading() {
  return (
    <div className="animate-pulse px-4 pt-16 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-7 w-32 rounded-lg mb-1" style={{ backgroundColor: "#F0E4DF" }} />
          <div className="h-4 w-20 rounded" style={{ backgroundColor: "#F0E4DF" }} />
        </div>
        <div className="w-10 h-10 rounded-full" style={{ backgroundColor: "#F0E4DF" }} />
      </div>
      <div className="h-2 rounded-full" style={{ backgroundColor: "#F0E4DF" }} />
      <div className="h-10 rounded-xl" style={{ backgroundColor: "#F0E4DF" }} />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 rounded-xl" style={{ backgroundColor: "#F0E4DF" }} />
      ))}
    </div>
  )
}
