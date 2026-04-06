import type { DayMasterInfo, WealthStar, WealthSummary } from '@/lib/types'

interface Props {
  summary: WealthSummary
  dayMaster: DayMasterInfo
  wealthStars: WealthStar[]
}

const gradeConfig = {
  S: { cls: 'grade-s', label: 'S 级', desc: '财运格局极佳' },
  A: { cls: 'grade-a', label: 'A 级', desc: '财运格局良好' },
  B: { cls: 'grade-b', label: 'B 级', desc: '财运格局中等' },
  C: { cls: 'grade-c', label: 'C 级', desc: '财运需要经营' },
}

const strengthColors: Record<string, string> = {
  极强: '#E8C96B',
  强: '#4ADE80',
  中和: '#60A5FA',
  弱: '#FB923C',
  极弱: '#F87171',
}

export default function WealthSummaryCard({ summary, dayMaster, wealthStars }: Props) {
  const gc = gradeConfig[summary.grade]

  return (
    <div className="card-base p-6">
      <SectionTitle>财运总览</SectionTitle>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto]">
        {/* Left: summary text */}
        <div>
          <p className="mb-4 leading-relaxed text-ink-secondary">
            {summary.overallDescription}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mb-4">
            {summary.keywords.map(kw => (
              <span key={kw} className="badge-gold text-xs">
                {kw}
              </span>
            ))}
          </div>

          {/* Style tags */}
          <div className="flex flex-wrap gap-2">
            {summary.styleTags.map(tag => (
              <span
                key={tag}
                className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs text-ink-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: grade badge */}
        <div className="flex flex-col items-center justify-start gap-3 sm:items-end">
          <div
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 text-center ${gc.cls}`}
          >
            <span className="text-3xl font-bold">{summary.grade}</span>
            <span className="text-[10px] opacity-80">财运等级</span>
          </div>
          <span className="text-xs text-ink-muted">{gc.desc}</span>
        </div>
      </div>

      {/* Day Master + Wealth Stars */}
      <div className="mt-6 grid gap-4 border-t border-[rgba(255,255,255,0.06)] pt-5 sm:grid-cols-2">
        {/* Day Master */}
        <div className="rounded-lg bg-[rgba(255,255,255,0.03)] p-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            日主信息
          </div>
          <div className="mb-1 flex items-center gap-3">
            <span
              className="text-4xl font-bold"
              style={{ fontFamily: 'Noto Serif SC, serif', color: '#C9A84C' }}
            >
              {dayMaster.stem.char}
            </span>
            <div>
              <div className="text-sm font-medium text-ink-primary">
                {dayMaster.stem.polarity}{dayMaster.stem.element} · 日主
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-ink-muted">强弱：</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: strengthColors[dayMaster.strength] ?? '#E8E6E0' }}
                >
                  {dayMaster.strength}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-ink-muted">{dayMaster.strengthDescription}</p>
        </div>

        {/* Wealth Stars */}
        <div className="rounded-lg bg-[rgba(255,255,255,0.03)] p-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            财星分布
          </div>
          {wealthStars.length === 0 ? (
            <div className="flex h-full items-center">
              <p className="text-sm text-ink-muted">
                命局中财星未明显透干，财运随大运流年引动显现。
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wealthStars.map((star, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className={`flex-shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${
                      star.type === '正财'
                        ? 'bg-[rgba(74,222,128,0.12)] text-[#4ADE80]'
                        : 'bg-[rgba(232,201,107,0.12)] text-gold'
                    }`}
                  >
                    {star.type}
                  </span>
                  <span className="text-xs text-ink-secondary">{star.pillar}</span>
                  <span className="text-xs text-ink-muted">
                    ({star.location === 'stem' ? '透干' : '藏支'})
                  </span>
                  <div className="ml-auto w-20">
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{
                          width: `${star.strength}%`,
                          background:
                            star.type === '正财' ? '#4ADE80' : '#C9A84C',
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-xs text-ink-muted">{star.strength}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-title text-xs">
      <span>◈</span>
      {children}
      <span>◈</span>
    </div>
  )
}
