import type { BaziChart, FiveElementAnalysis, TenGodMap } from '@/lib/types'
import { ELEMENT_COLORS, ELEMENT_BG_COLORS } from '@/lib/bazi/constants'

interface Props {
  chart: BaziChart
  fiveElements: FiveElementAnalysis
  tenGods: TenGodMap
}

export default function BaziChartCard({ chart, fiveElements, tenGods }: Props) {
  const pillars = [
    { pillar: chart.yearPillar, tenGodStem: tenGods.yearStem, tenGodBranch: tenGods.yearBranch },
    { pillar: chart.monthPillar, tenGodStem: tenGods.monthStem, tenGodBranch: tenGods.monthBranch },
    { pillar: chart.dayPillar, tenGodStem: undefined, tenGodBranch: undefined },
    { pillar: chart.hourPillar, tenGodStem: tenGods.hourStem, tenGodBranch: tenGods.hourBranch },
  ]

  const isDay = (index: number) => index === 2

  const elementTotal = Object.values(fiveElements.counts).reduce((a, b) => a + b, 0)

  return (
    <div className="card-base p-6">
      <SectionTitle>基础命盘</SectionTitle>

      {/* Four Pillars */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        {pillars.map(({ pillar, tenGodStem, tenGodBranch }, idx) => {
          const stemColor = ELEMENT_COLORS[pillar.stem.element]
          const branchColor = ELEMENT_COLORS[pillar.branch.element]
          return (
            <div
              key={pillar.label}
              className={`relative rounded-xl border p-3 text-center transition-all ${
                isDay(idx)
                  ? 'border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.08)]'
                  : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]'
              }`}
            >
              {isDay(idx) && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="badge-gold text-[10px]">日主</span>
                </div>
              )}

              <div className="mb-1 text-[10px] tracking-widest text-ink-muted">{pillar.label}</div>

              {/* Ten God (stem) */}
              <div className="mb-1 min-h-[18px] text-[10px] font-medium text-gold">
                {tenGodStem ?? ''}
              </div>

              {/* Stem */}
              <div
                className="mb-0.5 text-3xl font-bold leading-none"
                style={{ fontFamily: 'Noto Serif SC, serif', color: stemColor }}
              >
                {pillar.stem.char}
              </div>
              <div
                className="mb-0.5 text-[10px]"
                style={{ color: stemColor, opacity: 0.7 }}
              >
                {pillar.stem.polarity}{pillar.stem.element}
              </div>

              {/* Divider */}
              <div className="my-2 border-t border-[rgba(255,255,255,0.06)]" />

              {/* Branch */}
              <div
                className="mb-0.5 text-3xl font-bold leading-none"
                style={{ fontFamily: 'Noto Serif SC, serif', color: branchColor }}
              >
                {pillar.branch.char}
              </div>
              <div
                className="mb-1 text-[10px]"
                style={{ color: branchColor, opacity: 0.7 }}
              >
                {pillar.branch.element}
              </div>

              {/* Ten God (branch) */}
              <div className="min-h-[18px] text-[10px] font-medium text-ink-muted">
                {tenGodBranch ?? ''}
              </div>
            </div>
          )
        })}
      </div>

      {/* Five Element Distribution */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
            五行分布
          </span>
          <span className="text-xs text-ink-muted">
            财元素：
            <span className="font-medium" style={{ color: ELEMENT_COLORS[fiveElements.wealthElement] }}>
              {fiveElements.wealthElement}（{fiveElements.wealthElementCount.toFixed(1)}）
            </span>
          </span>
        </div>
        <div className="space-y-2.5">
          {(Object.entries(fiveElements.counts) as [keyof typeof fiveElements.counts, number][]).map(
            ([el, count]) => {
              const pct = elementTotal > 0 ? (count / elementTotal) * 100 : 0
              const color = ELEMENT_COLORS[el]
              const isWealth = el === fiveElements.wealthElement
              return (
                <div key={el} className="flex items-center gap-3">
                  <div
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-xs font-bold"
                    style={{ background: ELEMENT_BG_COLORS[el], color }}
                  >
                    {el}
                  </div>
                  <div className="flex-1 score-bar">
                    <div
                      className="score-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-8 text-right text-xs text-ink-secondary">
                      {count.toFixed(1)}
                    </span>
                    {isWealth && (
                      <span className="badge-gold text-[9px] px-1.5 py-0">财</span>
                    )}
                  </div>
                </div>
              )
            },
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
