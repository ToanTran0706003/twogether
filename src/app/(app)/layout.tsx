import BottomNav from "@/components/shared/BottomNav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FDF8F5" }}>
      {children}
      <BottomNav />
    </div>
  )
}
