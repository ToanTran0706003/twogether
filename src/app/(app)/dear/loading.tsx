export default function DearLoading() {
  return (
    <div className="animate-pulse px-4 pt-16 space-y-4">
      <div className="h-8 w-36 rounded-lg" style={{ backgroundColor: "#F0E4DF" }} />
      <div className="h-4 w-48 rounded" style={{ backgroundColor: "#F0E4DF" }} />
      <div className="h-10 rounded-xl" style={{ backgroundColor: "#F0E4DF" }} />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 rounded-2xl" style={{ backgroundColor: "#F0E4DF" }} />
      ))}
    </div>
  )
}
