"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Image, Smile, Settings } from "lucide-react"

const tabs = [
  { href: "/home", icon: Home, label: "Trang chủ" },
  { href: "/locket", icon: Image, label: "Ảnh" },
  { href: "/mood", icon: Smile, label: "Mood" },
  { href: "/settings", icon: Settings, label: "Cài đặt" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: "rgba(253,248,245,0.96)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderTop: "0.5px solid #F4C0D1",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      <div style={{
        display: "flex",
        maxWidth: 480,
        margin: "0 auto",
      }}>
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link key={href} href={href} style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              padding: "10px 0",
              minHeight: 56,
              textDecoration: "none",
              color: active ? "#C0607A" : "#B8909A",
            }}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                letterSpacing: 0.2,
              }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
