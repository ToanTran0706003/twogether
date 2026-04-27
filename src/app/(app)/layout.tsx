import BottomNav from "@/components/shared/BottomNav"
import { ToastProvider } from "@/components/shared/Toast"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <main className="page">
        {children}
      </main>
      <BottomNav />
    </ToastProvider>
  )
}
