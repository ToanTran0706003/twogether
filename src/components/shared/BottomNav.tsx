"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Image, Smile, Settings } from 'lucide-react'

const tabs = [
  { href: '/home', icon: Home, label: 'Trang chủ' },
  { href: '/locket', icon: Image, label: 'Ảnh' },
  { href: '/mood', icon: Smile, label: 'Mood' },
  { href: '/settings', icon: Settings, label: 'Cài đặt' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="bottom-nav">
      {tabs.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={pathname.startsWith(href) ? 'active' : ''}
        >
          <Icon size={22} strokeWidth={pathname.startsWith(href) ? 2.5 : 1.5} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
