import BottomNav from "@/components/shared/BottomNav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{
      minHeight: "100dvh",
      background: "#FDF8F5",
      position: "relative",
    }}>
      <main style={{
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: "calc(80px + env(safe-area-inset-bottom, 16px))",
      }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
