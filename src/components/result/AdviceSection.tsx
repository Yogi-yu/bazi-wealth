import type { Advice } from '@/lib/types'

interface Props {
  advice: Advice
}

export default function AdviceSection({ advice }: Props) {
  return (
    <div className="card-base p-6">
      <SectionTitle>财运建议</SectionTitle>

      <div className="mt-6 space-y-6">
        {/* Suitable + Unsuitable */}
        <div className="grid gap-4 sm:grid-cols-2">
          <AdviceBlock
            title="适合的财富路径"
            items={advice.suitableApproaches}
            dotColor="bg-[#4ADE80]"
            titleColor="text-[#4ADE80]"
            iconColor="rgba(74,222,128,0.15)"
            icon="✓"
          />
          <AdviceBlock
            title="不适合的方向"
            items={advice.unsuitableApproaches}
            dotColor="bg-[#F87171]"
            titleColor="text-[#F87171]"
            iconColor="rgba(248,113,113,0.15)"
            icon="✕"
          />
        </div>

        {/* Collaboration + Investment */}
        <div className="grid gap-4 sm:grid-cols-2">
          <AdviceTextBlock
            title="合作策略建议"
            icon="◈"
            text={advice.collaborationAdvice}
            accentColor="#60A5FA"
          />
          <AdviceTextBlock
            title="投资风格建议"
            icon="◆"
            text={advice.investmentStyle}
            accentColor="#C9A84C"
          />
        </div>

        {/* Risk Control */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FB923C]">
            <span className="h-3 w-3 rounded-sm bg-[rgba(251,146,60,0.2)] flex items-center justify-center text-[8px]">!</span>
            风险控制要点
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {advice.riskControlPoints.map((point, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-lg border border-[rgba(251,146,60,0.12)] bg-[rgba(251,146,60,0.04)] p-3"
              >
                <span className="mt-0.5 flex-shrink-0 text-xs font-bold text-[#FB923C]">
                  0{i + 1}
                </span>
                <p className="text-xs leading-relaxed text-ink-secondary">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdviceBlock({
  title,
  items,
  dotColor,
  titleColor,
  iconColor,
  icon,
}: {
  title: string
  items: string[]
  dotColor: string
  titleColor: string
  iconColor: string
  icon: string
}) {
  return (
    <div className="rounded-xl bg-[rgba(255,255,255,0.02)] p-4">
      <div className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${titleColor}`}>
        <span
          className="flex h-4 w-4 items-center justify-center rounded-sm text-[10px]"
          style={{ background: iconColor }}
        >
          {icon}
        </span>
        {title}
      </div>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink-secondary">
            <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotColor}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function AdviceTextBlock({
  title,
  icon,
  text,
  accentColor,
}: {
  title: string
  icon: string
  text: string
  accentColor: string
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}18` }}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: accentColor }}>
        <span>{icon}</span>
        {title}
      </div>
      <p className="text-sm leading-relaxed text-ink-secondary">{text}</p>
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
