"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  {
    href: "/home", label: "Trang chủ",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
  },
  {
    href: "/locket", label: "Ảnh",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 17l5-4 5 4 3-3 5 4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
  },
  {
    href: "/mood", label: "Mood",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M9 15s1 1 3 1 3-1 3-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>
  },
  {
    href: "/settings", label: "Cài đặt",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-start"
      style={{
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: "calc(18px + env(safe-area-inset-bottom))",
        backgroundColor: "rgba(253,248,245,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(58,40,50,0.08)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/")
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              fontSize: 10.5, fontWeight: 500,
              color: active ? "#C0607A" : "#B89BA3",
              flex: 1, padding: "6px 0", textDecoration: "none",
            }}
          >
            <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
