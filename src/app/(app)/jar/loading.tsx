export default function JarLoading() {
  return (
    <div className="animate-pulse px-4 pt-16 space-y-4">
      <div className="h-28 rounded-3xl" style={{ backgroundColor: "#F0E4DF" }} />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-7 w-16 rounded-full flex-shrink-0" style={{ backgroundColor: "#F0E4DF" }} />
        ))}
      </div>
      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#F0E4DF" }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 rounded-xl" style={{ backgroundColor: "#F0E4DF" }} />
      ))}
    </div>
  )
}
