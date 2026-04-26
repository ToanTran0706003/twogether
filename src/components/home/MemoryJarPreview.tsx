import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface MemoryJarPreviewProps {
  coupleId: string
}

export default async function MemoryJarPreview({ coupleId }: MemoryJarPreviewProps) {
  const supabase = await createClient()

  const { data: memories } = await supabase
    .from("memories")
    .select("id, title, type, memory_date")
    .eq("couple_id", coupleId)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ color: "#3A2832" }}>
          Lọ kỷ niệm 🫙
        </h2>
        <Link href="/jar" className="text-sm font-medium" style={{ color: "#C0607A" }}>
          Xem tất cả
        </Link>
      </div>

      {memories && memories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {memories.map((m) => (
            <div
              key={m.id}
              className="px-3 py-1.5 rounded-full text-sm"
              style={{ backgroundColor: "#F5EDE8", color: "#3A2832" }}
            >
              {m.title}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: "#8A6A72" }}>
          Chưa có kỷ niệm nào. Bắt đầu lưu lại những khoảnh khắc của hai bạn nhé!
        </p>
      )}
    </div>
  )
}
