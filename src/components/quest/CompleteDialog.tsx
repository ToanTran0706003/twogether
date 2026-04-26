"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CompleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  questTitle: string
  onConfirm: (photoUrl?: string) => void
  isLoading: boolean
}

export default function CompleteDialog({
  open,
  onOpenChange,
  questTitle,
  onConfirm,
  isLoading,
}: CompleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ backgroundColor: "#FFFFFF" }}>
        <DialogHeader>
          <DialogTitle className="font-serif" style={{ color: "#C0607A" }}>
            🎉 Hoàn thành quest!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm" style={{ color: "#3A2832" }}>
            Bạn đã hoàn thành <strong>&ldquo;{questTitle}&rdquo;</strong>!
          </p>

          <p className="text-sm" style={{ color: "#8A6A72" }}>
            Thêm ảnh kỷ niệm cho quest này?
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => onConfirm()}
              disabled={isLoading}
              className="flex-1 h-11"
            >
              {isLoading ? "Đang lưu..." : "Hoàn thành!"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
              style={{ borderColor: "#E8A0B0", color: "#C0607A" }}
            >
              Bỏ qua
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
