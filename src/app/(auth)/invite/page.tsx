"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function InvitePage() {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create")
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleCreateCouple() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/couple", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInviteCode(data.invite_code)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleJoinCouple() {
    if (!joinCode.trim()) {
      setError("Vui lòng nhập mã mời")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/couple", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_code: joinCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = "/home"
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    if (!inviteCode) return
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-serif font-bold" style={{ color: "#C0607A" }}>
            TwoGether ♡
          </h1>
          <p className="text-base" style={{ color: "#8A6A72" }}>
            Kết nối với người bạn yêu thương
          </p>
        </div>

        <div
          className="rounded-2xl p-6 shadow-sm border"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#F0E4DF" }}
        >
          <div
            className="grid grid-cols-2 gap-1 p-1 rounded-lg mb-5"
            style={{ backgroundColor: "#F5EDE8" }}
          >
            <button
              onClick={() => setActiveTab("create")}
              className="px-4 py-2 rounded-md text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === "create" ? "#FFFFFF" : "transparent",
                color: activeTab === "create" ? "#3A2832" : "#8A6A72",
                boxShadow: activeTab === "create" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              }}
            >
              Tạo couple mới
            </button>
            <button
              onClick={() => setActiveTab("join")}
              className="px-4 py-2 rounded-md text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === "join" ? "#FFFFFF" : "transparent",
                color: activeTab === "join" ? "#3A2832" : "#8A6A72",
                boxShadow: activeTab === "join" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              }}
            >
              Nhập mã mời
            </button>
          </div>

          {activeTab === "create" && (
            <div>
              {!inviteCode ? (
                <div className="space-y-4">
                  <p className="text-sm text-center" style={{ color: "#8A6A72" }}>
                    Tạo một couple mới và chia sẻ mã mời với người ấy
                  </p>
                  <Button
                    onClick={handleCreateCouple}
                    className="w-full h-11 text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang tạo..." : "Tạo couple mới"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-center" style={{ color: "#8A6A72" }}>
                    Chia sẻ mã mời này với người ấy để kết nối
                  </p>
                  <div className="flex gap-2">
                    <div
                      className="flex-1 flex items-center justify-center h-12 rounded-lg font-mono text-2xl font-bold tracking-widest"
                      style={{ backgroundColor: "#FDF8F5", color: "#C0607A", border: "1px solid #F0E4DF" }}
                    >
                      {inviteCode}
                    </div>
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="h-12 px-4"
                      style={{ borderColor: "#E8A0B0", color: "#C0607A" }}
                    >
                      {copied ? "Đã copy!" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "join" && (
            <div className="space-y-4">
              <p className="text-sm text-center" style={{ color: "#8A6A72" }}>
                Nhập mã mời từ người ấy để tham gia couple
              </p>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã mời..."
                className="h-12 text-center font-mono tracking-widest text-lg"
                maxLength={8}
              />
              <Button
                onClick={handleJoinCouple}
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Đang tham gia..." : "Tham gia"}
              </Button>
            </div>
          )}

          {error && (
            <p className="text-sm text-center text-red-500 mt-3">{error}</p>
          )}
        </div>
      </div>
    </main>
  )
}
