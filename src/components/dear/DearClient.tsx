"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import LetterCard from "./LetterCard"
import WriteLetterDialog from "./WriteLetterDialog"
import LetterViewer from "./LetterViewer"
import type { Letter } from "@/types"

interface DearClientProps {
  myLetters: Letter[]
  receivedLetters: Letter[]
  coupleId: string
}

export default function DearClient({
  myLetters,
  receivedLetters,
  coupleId,
}: DearClientProps) {
  const [isWriteOpen, setIsWriteOpen] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  function handleLetterSent(newLetter: Letter) {
    myLetters = [newLetter, ...myLetters]
  }

  function handleSaved() {
    setSelectedLetter(null)
  }

  return (
    <div className="px-4">
      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="scheduled" className="flex-1">
            Thư đang hẹn ({myLetters.length})
          </TabsTrigger>
          <TabsTrigger value="received" className="flex-1">
            Thư đã nhận ({receivedLetters.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          {myLetters.length === 0 ? (
            <EmptyState
              emoji="📬"
              message="Chưa có thư nào đang hẹn"
              sub="Gửi ngay một lá thư tình cho nửa kia"
            />
          ) : (
            <div className="space-y-3">
              {myLetters.map((letter) => (
                <LetterCard
                  key={letter.id}
                  letter={letter}
                  variant="scheduled"
                  onOpen={setSelectedLetter}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="received">
          {receivedLetters.length === 0 ? (
            <EmptyState
              emoji="💌"
              message="Chưa có thư nào được nhận"
              sub="Hãy đợi nửa kia gửi thư cho bạn"
            />
          ) : (
            <div className="space-y-3">
              {receivedLetters.map((letter) => (
                <LetterCard
                  key={letter.id}
                  letter={letter}
                  variant="received"
                  onOpen={setSelectedLetter}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <button
        onClick={() => setIsWriteOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg z-40 transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#C0607A", color: "#FFFFFF" }}
        aria-label="Viết thư mới"
      >
        ✏️
      </button>

      <WriteLetterDialog
        open={isWriteOpen}
        onOpenChange={setIsWriteOpen}
        coupleId={coupleId}
        onSent={handleLetterSent}
      />

      {selectedLetter && (
        <LetterViewer
          letter={selectedLetter}
          onClose={() => setSelectedLetter(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

function EmptyState({
  emoji,
  message,
  sub,
}: {
  emoji: string
  message: string
  sub: string
}) {
  return (
    <div className="flex flex-col items-center py-16 gap-3">
      <span className="text-5xl">{emoji}</span>
      <p className="text-sm font-medium" style={{ color: "#3A2832" }}>
        {message}
      </p>
      <p className="text-xs" style={{ color: "#8A6A72" }}>
        {sub}
      </p>
    </div>
  )
}
