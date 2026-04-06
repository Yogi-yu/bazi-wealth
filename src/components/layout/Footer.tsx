import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[rgba(201,168,76,0.1)] bg-bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-3 text-base font-semibold tracking-widest text-gold" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              天机财运
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">
              以传统命理为基础，以结构化分析为框架，帮助您洞见财运趋势，把握人生机遇。
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-muted">
              快速导航
            </div>
            <ul className="space-y-2">
              {[
                { href: '/', label: '首页' },
                { href: '/analyze', label: '开始分析' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ink-secondary transition-colors hover:text-gold"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-muted">
              免责声明
            </div>
            <p className="text-xs leading-relaxed text-ink-muted">
              本平台提供的八字命理分析仅供文化学习与个人参考，不构成任何投资、法律、医疗建议。
              命运终由自身把握，请理性看待命理信息。
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[rgba(255,255,255,0.05)] pt-6 text-xs text-ink-muted sm:flex-row">
          <span>© {new Date().getFullYear()} 天机财运 · 仅供娱乐与文化参考</span>
          <div className="flex gap-1 items-center">
            <span className="text-[rgba(201,168,76,0.4)]">◈</span>
            <span>本网站不对任何财务决策负责</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
