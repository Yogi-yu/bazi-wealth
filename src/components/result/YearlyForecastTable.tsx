'use client'

import { useState } from 'react'
import type { YearForecast } from '@/lib/types'

interface Props {
  forecasts: YearForecast[]
}

const scoreLabelConfig = {
  旺财年: { bg: 'bg-[rgba(74,222,128,0.12)]', text: 'text-[#4ADE80]', border: 'border-[rgba(74,222,128,0.3)]' },
  进财年: { bg: 'bg-[rgba(134,239,172,0.08)]', text: 'text-[#86EFAC]', border: 'border-[rgba(134,239,172,0.2)]' },
  平稳年: { bg: 'bg-[rgba(250,204,21,0.08)]', text: 'text-[#FACC15]', border: 'border-[rgba(250,204,21,0.2)]' },
  谨慎年: { bg: 'bg-[rgba(251,146,60,0.08)]', text: 'text-[#FB923C]', border: 'border-[rgba(251,146,60,0.2)]' },
  回避年: { bg: 'bg-[rgba(248,113,113,0.08)]', text: 'text-[#F87171]', border: 'border-[rgba(248,113,113,0.2)]' },
}

function scoreColor(score: number): string {
  if (score >= 80) return '#4ADE80'
  if (score >= 65) return '#86EFAC'
  if (score >= 45) return '#FACC15'
  if (score >= 30) return '#FB923C'
  return '#F87171'
}

export default function YearlyForecastTable({ forecasts }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="card-base p-6">
      <SectionTitle>年度财运预测</SectionTitle>
      <p className="mt-2 text-xs text-ink-muted">
        基于流年天干十神与命局五行互动推算，评分仅为参考趋势，非精确预言。
      </p>

      <div className="mt-6 space-y-2">
        {forecasts.map((f, i) => {
          const lc = scoreLabelConfig[f.scoreLabel]
          const isExpanded = expanded === i
          const color = scoreColor(f.wealthScore)
          return (
            <div
              key={f.year}
              className={`overflow-hidden rounded-xl border transition-all ${
                isExpanded
                  ? 'border-[rgba(201,168,76,0.3)]'
                  : 'border-[rgba(255,255,255,0.06)]'
              }`}
            >
              {/* Row */}
              <button
                onClick={() => setExpanded(isExpanded ? null : i)}
                className="flex w-full items-center gap-4 p-4 text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
              >
                {/* Year */}
                <div className="w-20 flex-shrink-0">
                  <div className="text-sm font-semibold text-ink-primary">{f.year}</div>
                  <div className="text-xs text-ink-muted" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                    {f.yearPillarStr}年
                  </div>
                </div>

                {/* Ten God */}
                <div className="w-12 flex-shrink-0 text-center">
                  <span className="rounded-full bg-[rgba(201,168,76,0.08)] px-2 py-0.5 text-xs text-gold">
                    {f.yearTenGod}
                  </span>
                </div>

                {/* Score bar */}
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex-1 score-bar">
                    <div
                      className="score-fill transition-all"
                      style={{ width: `${f.wealthScore}%`, background: color }}
                    />
                  </div>
                  <span className="w-8 flex-shrink-0 text-right text-sm font-bold" style={{ color }}>
                    {f.wealthScore}
                  </span>
                </div>

                {/* Label */}
                <div className={`w-16 flex-shrink-0 rounded-full border px-2 py-0.5 text-center text-xs font-medium ${lc.bg} ${lc.text} ${lc.border}`}>
                  {f.scoreLabel}
                </div>

                {/* Levels */}
                <div className="hidden flex-shrink-0 gap-1.5 sm:flex">
                  <LevelBadge label="机遇" level={f.opportunityLevel} type="opportunity" />
                  <LevelBadge label="风险" level={f.riskLevel} type="risk" />
                </div>

                {/* Expand indicator */}
                <span className={`ml-1 flex-shrink-0 text-ink-muted text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 pb-4 pt-3">
                  {/* Mobile levels */}
                  <div className="mb-3 flex gap-2 sm:hidden">
                    <LevelBadge label="机遇" level={f.opportunityLevel} type="opportunity" />
                    <LevelBadge label="风险" level={f.riskLevel} type="risk" />
                  </div>
                  <p className="text-sm leading-relaxed text-ink-secondary">{f.description}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-3 border-t border-[rgba(255,255,255,0.05)] pt-4">
        <span className="text-xs text-ink-muted">财运评分说明：</span>
        {Object.entries(scoreLabelConfig).map(([label, { text }]) => (
          <span key={label} className={`text-xs ${text}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function LevelBadge({
  label,
  level,
  type,
}: {
  label: string
  level: '高' | '中' | '低'
  type: 'opportunity' | 'risk'
}) {
  const opportunityColors = { 高: '#4ADE80', 中: '#FACC15', 低: '#A8A49C' }
  const riskColors = { 高: '#F87171', 中: '#FB923C', 低: '#4ADE80' }
  const color = type === 'opportunity' ? opportunityColors[level] : riskColors[level]

  return (
    <span
      className="rounded px-2 py-0.5 text-[10px] font-medium"
      style={{ background: `${color}18`, color }}
    >
      {label}:{level}
    </span>
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
