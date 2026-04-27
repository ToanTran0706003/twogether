"use client"

interface JarHeroProps {
  totalCount: number
  yearCount: number
  onSlideshow: () => void
}

export default function JarHero({ totalCount, yearCount, onSlideshow }: JarHeroProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div
      className="w-full rounded-2xl p-6 mb-4 text-center border shadow-sm"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
    >
      <div className="flex justify-center mb-2">
        <div className="relative">
          <span className="text-6xl animate-bounce inline-block" style={{ display: "inline-block" }}>
            🫙
          </span>
        </div>
      </div>

      <p
        className="font-serif text-3xl font-bold"
        style={{ color: "#C0607A" }}
      >
        {yearCount}
      </p>
      <p className="text-sm font-medium" style={{ color: "#8A6A72" }}>
        kỷ niệm năm {currentYear}
      </p>
      <p className="text-xs mt-1" style={{ color: "#C0909C" }}>
        {totalCount} kỷ niệm trong lọ
      </p>

      <button
        onClick={onSlideshow}
        className="mt-4 px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:opacity-80"
        style={{ borderColor: "#E8A0B0", color: "#C0607A", backgroundColor: "#FDF8F5" }}
      >
        Xem lại năm {currentYear} →
      </button>
    </div>
  )
}
