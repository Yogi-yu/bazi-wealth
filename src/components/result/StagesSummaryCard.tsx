import type { StageSummary } from '@/lib/types'

interface Props {
  stages: StageSummary[]
}

export default function StagesSummaryCard({ stages }: Props) {
  return (
    <div className="card-base p-6">
      <SectionTitle>阶段财运总结</SectionTitle>
      <p className="mt-2 text-xs text-ink-muted">
        按时间维度划分阶段性财运趋势，辅助中长期规划参考。
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stages.map(({ label, years, trend, focus, caution }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-xl border border-[rgba(201,168,76,0.12)] bg-[rgba(201,168,76,0.04)] p-5"
          >
            {/* Top bar */}
            <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />

            {/* Label */}
            <div className="mb-1 flex items-center justify-between">
              <span
                className="text-lg font-bold text-gradient-gold"
                style={{ fontFamily: 'Noto Serif SC, serif' }}
              >
                {label}
              </span>
              <span className="badge-gold text-[10px]">{years}</span>
            </div>

            {/* Trend */}
            <p className="mb-4 text-xs leading-relaxed text-ink-secondary">{trend}</p>

            {/* Focus */}
            <div className="mb-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#4ADE80]">
                <span className="h-1 w-3 rounded-full bg-[#4ADE80]" />
                重点机遇
              </div>
              <p className="text-xs leading-relaxed text-ink-secondary">{focus}</p>
            </div>

            {/* Caution */}
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#FB923C]">
                <span className="h-1 w-3 rounded-full bg-[#FB923C]" />
                注意事项
              </div>
              <p className="text-xs leading-relaxed text-ink-secondary">{caution}</p>
            </div>
          </div>
        ))}
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
