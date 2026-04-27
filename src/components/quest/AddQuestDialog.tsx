"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { QuestItem } from '@/types'

interface AddQuestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupleId: string
  onAdded: (quest: QuestItem) => void
}

const CATEGORIES = [
  { value: "food", label: "Ăn uống" },
  { value: "travel", label: "Du lịch" },
  { value: "home", label: "Ở nhà" },
  { value: "adventure", label: "Phiêu lưu" },
  { value: "creative", label: "Sáng tạo" },
]

export default function AddQuestDialog({ open, onOpenChange, coupleId, onAdded }: AddQuestDialogProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), category: category || null, couple_id: coupleId }),
      })
      const data = await res.json() as QuestItem
      if (!res.ok) throw new Error((data as unknown as { error: string }).error)
      onAdded(data)
      setTitle("")
      setCategory("")
      onOpenChange(false)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ backgroundColor: "#FFFFFF" }}>
        <DialogHeader>
          <DialogTitle className="font-serif" style={{ color: "#C0607A" }}>
            Thêm quest mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: "#3A2832" }}>
              Tên quest
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Đi xem phim..."
              className="h-11"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: "#3A2832" }}>
              Danh mục
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(category === c.value ? "" : c.value)}
                  className="px-3 py-1.5 rounded-full text-sm transition-all"
                  style={{
                    backgroundColor: category === c.value ? "#E8A0B0" : "#F5EDE8",
                    color: category === c.value ? "#FFFFFF" : "#3A2832",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full h-11"
            disabled={isLoading || !title.trim()}
          >
            <>
              {isLoading && <LoadingSpinner size={16} color="white" />}
              {isLoading ? "Đang thêm..." : "Thêm quest"}
            </>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
