import BottomNav from "@/components/shared/BottomNav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="page">
        {children}
      </main>
      <BottomNav />
    </>
  )
}
