"use client"

import type { CostType, LocationType } from "@/lib/date-ideas"

interface FilterBarProps {
  costFilter: CostType | null
  locationFilter: LocationType | null
  durationFilter: string | null
  onCostChange: (v: CostType | null) => void
  onLocationChange: (v: LocationType | null) => void
  onDurationChange: (v: string | null) => void
}

const COST_OPTIONS: { value: CostType | null; label: string }[] = [
  { value: null, label: "Bất kỳ" },
  { value: "free", label: "Miễn phí" },
  { value: "under200k", label: "Dưới 200k" },
  { value: "under500k", label: "Dưới 500k" },
  { value: "any", label: "Bất kỳ" },
]

const LOCATION_OPTIONS: { value: LocationType | null; label: string }[] = [
  { value: null, label: "Cả hai" },
  { value: "home", label: "Ở nhà" },
  { value: "outdoor", label: "Ra ngoài" },
  { value: "both", label: "Cả hai" },
]

const DURATION_OPTIONS: { value: string | null; label: string }[] = [
  { value: null, label: "Tất cả" },
  { value: "short", label: "30 phút" },
  { value: "medium", label: "1-3 tiếng" },
  { value: "long", label: "Nửa ngày" },
]

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex-shrink-0"
      style={{
        backgroundColor: active ? "#E8A0B0" : "#FFFFFF",
        borderColor: active ? "#E8A0B0" : "#F0E4DF",
        color: active ? "#FFFFFF" : "#8A6A72",
      }}
    >
      {label}
    </button>
  )
}

export default function FilterBar({
  costFilter,
  locationFilter,
  durationFilter,
  onCostChange,
  onLocationChange,
  onDurationChange,
}: FilterBarProps) {
  return (
    <div
      className="rounded-2xl p-4 border shadow-sm space-y-3"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
    >
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "#8A6A72" }}>
          Ngân sách
        </p>
        <div className="flex gap-2 flex-wrap">
          {COST_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.label}
              active={costFilter === opt.value}
              label={opt.label}
              onClick={() => onCostChange(opt.value === costFilter ? null : opt.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "#8A6A72" }}>
          Địa điểm
        </p>
        <div className="flex gap-2 flex-wrap">
          {LOCATION_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.label}
              active={locationFilter === opt.value}
              label={opt.label}
              onClick={() => onLocationChange(opt.value === locationFilter ? null : opt.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: "#8A6A72" }}>
          Thời gian
        </p>
        <div className="flex gap-2 flex-wrap">
          {DURATION_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.label}
              active={durationFilter === opt.value}
              label={opt.label}
              onClick={() => onDurationChange(opt.value === durationFilter ? null : opt.value)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
