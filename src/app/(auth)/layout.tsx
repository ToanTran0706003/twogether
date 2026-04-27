export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="page-auth">
      {children}
    </main>
  )
}
