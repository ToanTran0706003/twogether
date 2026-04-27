import BottomNav from "@/components/shared/BottomNav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FDF8F5", paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}>
      {children}
      <BottomNav />
    </div>
  )
}
