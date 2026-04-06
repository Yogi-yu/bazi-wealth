import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 hex-bg" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Decorative ring */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[600px] rounded-full border border-[rgba(201,168,76,0.06)]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3">
        <div className="h-[900px] w-[900px] rounded-full border border-[rgba(201,168,76,0.03)]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.06)] px-4 py-1.5 text-xs font-medium tracking-widest text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          八字命理 · 财运洞察
        </div>

        {/* Headline */}
        <h1
          className="mb-6 text-5xl font-bold leading-tight sm:text-6xl md:text-7xl"
          style={{ fontFamily: 'Noto Serif SC, serif' }}
        >
          <span className="text-gradient-gold">洞见财运</span>
          <br />
          <span className="text-ink-primary">把握天机</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-ink-secondary sm:text-xl">
          基于传统八字命理，为您生成专属财运分析报告
        </p>
        <p className="mx-auto mb-12 max-w-xl text-sm leading-relaxed text-ink-muted">
          命盘自动解析 · 财星精准识别 · 十年趋势预测 · 结构化财富建议
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/analyze" className="btn-primary text-base px-8 py-4 min-w-[200px]">
            立即免费测算
            <span className="text-lg">→</span>
          </Link>
          <span className="text-xs text-ink-muted">
            输入生辰 · 即刻生成 · 完全免费
          </span>
        </div>

        {/* Divider */}
        <div className="divider-gold mx-auto mt-20 max-w-sm text-xs tracking-widest">
          三才合参，五行互鉴
        </div>

        {/* Pillars preview */}
        <div className="mt-12 flex items-end justify-center gap-3 sm:gap-6">
          {[
            { pillar: '年', stem: '甲', branch: '子', element: '水', color: '#60A5FA' },
            { pillar: '月', stem: '丁', branch: '卯', element: '木', color: '#4ADE80' },
            { pillar: '日', stem: '壬', branch: '午', element: '火', color: '#F87171', highlight: true },
            { pillar: '时', stem: '庚', branch: '申', element: '金', color: '#E8C96B' },
          ].map(({ pillar, stem, branch, element, color, highlight }) => (
            <div
              key={pillar}
              className={`relative rounded-xl border px-4 py-5 text-center transition-all ${
                highlight
                  ? 'border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.08)] shadow-[0_0_30px_rgba(201,168,76,0.12)]'
                  : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]'
              }`}
              style={{ minWidth: 72 }}
            >
              {highlight && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="badge-gold text-[10px]">日主</span>
                </div>
              )}
              <div className="mb-1 text-[10px] font-medium tracking-widest text-ink-muted">
                {pillar}柱
              </div>
              <div
                className="mb-1 text-3xl font-bold"
                style={{ fontFamily: 'Noto Serif SC, serif', color }}
              >
                {stem}
              </div>
              <div className="mb-2 text-3xl font-bold text-ink-secondary" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                {branch}
              </div>
              <div
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: `${color}18`, color }}
              >
                {element}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-ink-muted">↑ 示例命盘，仅作演示展示</p>
      </div>
    </section>
  )
}
