"use client"

import { useState } from "react"
import { signInWithEmail, signUpWithEmail } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function EmailLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignIn(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await signInWithEmail(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  async function handleSignUp(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await signUpWithEmail(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.")
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <Link href="/login">
            <h1
              className="text-4xl font-serif font-bold"
              style={{ color: "#C0607A" }}
            >
              TwoGether ♡
            </h1>
          </Link>
          <p className="text-sm" style={{ color: "#8A6A72" }}>
            Đăng nhập hoặc đăng ký tài khoản
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-11">
            <TabsTrigger value="login" className="text-sm font-medium">
              Đăng nhập
            </TabsTrigger>
            <TabsTrigger value="register" className="text-sm font-medium">
              Đăng ký
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6 space-y-4">
            <form action={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="signin-email"
                  className="text-sm font-medium"
                  style={{ color: "#3A2832" }}
                >
                  Email
                </label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="signin-password"
                  className="text-sm font-medium"
                  style={{ color: "#3A2832" }}
                >
                  Mật khẩu
                </label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-11"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-6 space-y-4">
            <form action={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="register-name"
                  className="text-sm font-medium"
                  style={{ color: "#3A2832" }}
                >
                  Tên của bạn
                </label>
                <Input
                  id="register-name"
                  name="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                  autoComplete="name"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="register-email"
                  className="text-sm font-medium"
                  style={{ color: "#3A2832" }}
                >
                  Email
                </label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="register-password"
                  className="text-sm font-medium"
                  style={{ color: "#3A2832" }}
                >
                  Mật khẩu
                </label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-11"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-600">{success}</p>
              )}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
