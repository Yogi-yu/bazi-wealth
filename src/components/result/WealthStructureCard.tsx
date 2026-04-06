import type { WealthStructure } from '@/lib/types'

interface Props {
  structure: WealthStructure
}

export default function WealthStructureCard({ structure }: Props) {
  return (
    <div className="card-base p-6">
      <SectionTitle>财运结构分析</SectionTitle>

      {/* Analysis paragraph */}
      <div className="mt-6 rounded-lg border border-[rgba(201,168,76,0.12)] bg-[rgba(201,168,76,0.04)] p-4">
        <p className="text-sm leading-relaxed text-ink-secondary">{structure.structureAnalysis}</p>
      </div>

      {/* Direct vs Indirect */}
      <div className="mt-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-muted">
          正财 vs 偏财 倾向
        </div>
        <div className="flex items-center gap-3">
          <span className="w-12 text-right text-xs text-[#4ADE80]">
            正财 {structure.directWealthScore}%
          </span>
          <div className="relative flex-1 h-5 rounded-full overflow-hidden bg-[rgba(255,255,255,0.05)]">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#4ADE80]"
              style={{ width: `${structure.directWealthScore}%`, opacity: 0.7 }}
            />
            <div
              className="absolute right-0 top-0 h-full rounded-full bg-gold"
              style={{ width: `${structure.indirectWealthScore}%`, opacity: 0.7 }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/60">
              {structure.directWealthScore > structure.indirectWealthScore ? '正财主导' : '偏财主导'}
            </div>
          </div>
          <span className="w-12 text-xs text-gold">
            偏财 {structure.indirectWealthScore}%
          </span>
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
          <span>稳健 · 规律 · 职场 · 实业</span>
          <span>机遇 · 灵活 · 投资 · 横财</span>
        </div>
      </div>

      {/* Wealth star favorable */}
      <div className="mt-5 flex items-center gap-3 rounded-lg bg-[rgba(255,255,255,0.03)] p-3">
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
            structure.wealthStarFavorable
              ? 'bg-[rgba(74,222,128,0.15)] text-[#4ADE80]'
              : 'bg-[rgba(248,113,113,0.15)] text-[#F87171]'
          }`}
        >
          {structure.wealthStarFavorable ? '✓' : '!'}
        </div>
        <div>
          <div className="text-sm font-medium text-ink-primary">
            财星{structure.wealthStarFavorable ? '得用' : '受制'}
          </div>
          <div className="text-xs text-ink-muted">
            {structure.wealthStarFavorable
              ? '日主与财星配合良好，具备承接财富的能力'
              : '身弱财重或财星受制，宜谨慎把握财富机会的节奏'}
          </div>
        </div>
      </div>

      {/* Paths */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <PathList
          title="适合的财富路径"
          items={structure.suitedWealthPaths}
          color="text-[#4ADE80]"
          dotColor="bg-[#4ADE80]"
        />
        <PathList
          title="不适合的路径"
          items={structure.unsuitedWealthPaths}
          color="text-[#F87171]"
          dotColor="bg-[#F87171]"
        />
      </div>
    </div>
  )
}

function PathList({
  title,
  items,
  color,
  dotColor,
}: {
  title: string
  items: string[]
  color: string
  dotColor: string
}) {
  return (
    <div>
      <div className={`mb-2 text-xs font-semibold uppercase tracking-widest ${color}`}>
        {title}
      </div>
      <ul className="space-y-1.5">
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-title text-xs">
      <span>◈</span>
      {children}
      <span>◈</span>
    </div>
  )
}
