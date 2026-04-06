'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(201,168,76,0.12)] bg-[rgba(10,12,20,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gold/10 group-hover:bg-gold/15 transition-colors" />
            <span className="relative text-xl font-bold text-gradient-gold" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              命
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-widest text-gold" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              天机财运
            </div>
            <div className="text-[10px] text-ink-muted tracking-wider">BAZI WEALTH INSIGHT</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <NavLink href="/" current={pathname}>首页</NavLink>
          <NavLink href="/analyze" current={pathname}>开始分析</NavLink>
        </nav>

        {/* CTA */}
        <Link
          href="/analyze"
          className="btn-primary px-5 py-2 text-sm"
        >
          免费测算
        </Link>
      </div>
    </header>
  )
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string
  current: string
  children: React.ReactNode
}) {
  const isActive = current === href
  return (
    <Link
      href={href}
      className={`text-sm transition-colors ${
        isActive ? 'text-gold' : 'text-ink-secondary hover:text-ink-primary'
      }`}
    >
      {children}
    </Link>
  )
}
