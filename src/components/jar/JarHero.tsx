"use client"

interface JarHeroProps {
  totalCount: number
}

export default function JarHero({ totalCount }: JarHeroProps) {
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
        {totalCount}
      </p>
      <p className="text-sm font-medium" style={{ color: "#8A6A72" }}>
        kỷ niệm trong lọ
      </p>
      <p className="text-xs mt-1" style={{ color: "#C0909C" }}>
        {currentYear}
      </p>
    </div>
  )
}
