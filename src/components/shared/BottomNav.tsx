"use client"

import Link from "next/link"

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: "🏠" },
  { href: "/mood", label: "Mood", icon: "💭" },
  { href: "/dear", label: "Thư", icon: "💌" },
  { href: "/spinner", label: "Date", icon: "🎯" },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-[72px] border-t shadow-sm"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#F0E4DF",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors"
          style={{ color: "#8A6A72" }}
        >
          <span className="text-xl leading-none">{icon}</span>
          <span className="font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  )
}
