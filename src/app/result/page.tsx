'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { AnalysisResult } from '@/lib/types'
import Header from '@/components/layout/Header'
import BaziChartCard from '@/components/result/BaziChartCard'
import WealthSummaryCard from '@/components/result/WealthSummaryCard'
import WealthStructureCard from '@/components/result/WealthStructureCard'
import YearlyForecastTable from '@/components/result/YearlyForecastTable'
import StagesSummaryCard from '@/components/result/StagesSummaryCard'
import AdviceSection from '@/components/result/AdviceSection'
import DisclaimerBlock from '@/components/result/DisclaimerBlock'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('baziAnalysis')
      if (raw) {
        setResult(JSON.parse(raw))
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    )
  }

  if (!result) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="text-4xl text-ink-muted">◈</div>
          <h2 className="text-xl font-bold text-ink-primary">未找到分析结果</h2>
          <p className="text-sm text-ink-secondary">请先完成生辰信息填写</p>
          <Link href="/analyze" className="btn-primary mt-4">
            返回填写信息
          </Link>
        </div>
      </>
    )
  }

  const { basicInfo, baziChart, fiveElements, dayMaster, tenGods, wealthStars,
    wealthSummary, wealthStructure, yearlyForecast, stagesSummary, advice, disclaimer } = result

  return (
    <>
      <Header />
      <main className="min-h-screen pb-24">
        {/* Result Hero */}
        <div className="relative overflow-hidden border-b border-[rgba(201,168,76,0.1)] bg-bg-secondary py-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 80% at 50% -20%, rgba(201,168,76,0.08) 0%, transparent 70%)',
            }}
          />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-2 text-center">
              <div className="divider-gold mx-auto mb-4 max-w-xs text-xs tracking-widest">
                财运分析报告
              </div>
              <h1
                className="mb-2 text-3xl font-bold text-ink-primary sm:text-4xl"
                style={{ fontFamily: 'Noto Serif SC, serif' }}
              >
                您的
                <span className="text-gradient-gold">专属财运报告</span>
              </h1>
              <p className="text-sm text-ink-secondary">
                {basicInfo.gender}命 · {basicInfo.birthDate} · {basicInfo.birthTime}
                {basicInfo.city && ` · ${basicInfo.city}`}
              </p>
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickStat label="财运等级" value={wealthSummary.grade} highlight />
              <QuickStat label="日主" value={`${dayMaster.stem.char}（${dayMaster.strength}）`} />
              <QuickStat label="财元素" value={dayMaster.wealthElement} />
              <QuickStat label="财运类型" value={wealthSummary.wealthStyleType} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl space-y-6 px-4 pt-8 sm:px-6">
          {/* 1. BaZi Chart */}
          <BaziChartCard chart={baziChart} fiveElements={fiveElements} tenGods={tenGods} />

          {/* 2. Wealth Summary */}
          <WealthSummaryCard
            summary={wealthSummary}
            dayMaster={dayMaster}
            wealthStars={wealthStars}
          />

          {/* 3. Wealth Structure */}
          <WealthStructureCard structure={wealthStructure} />

          {/* 4. Yearly Forecast */}
          <YearlyForecastTable forecasts={yearlyForecast} />

          {/* 5. Stages Summary */}
          <StagesSummaryCard stages={stagesSummary} />

          {/* 6. Advice */}
          <AdviceSection advice={advice} />

          {/* 7. Disclaimer */}
          <DisclaimerBlock text={disclaimer} />

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/analyze" className="btn-outline text-center">
              重新测算
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-outline text-center"
            >
              打印报告
            </button>
          </div>

          <p className="pb-8 text-center text-xs text-ink-muted">
            报告生成时间：{new Date(result.generatedAt).toLocaleString('zh-CN')}
          </p>
        </div>
      </main>
    </>
  )
}

function QuickStat({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        highlight
          ? 'border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.08)]'
          : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]'
      }`}
    >
      <div className="mb-0.5 text-[10px] text-ink-muted">{label}</div>
      <div
        className={`text-base font-bold ${highlight ? 'text-gradient-gold' : 'text-ink-primary'}`}
        style={{ fontFamily: 'Noto Serif SC, serif' }}
      >
        {value}
      </div>
    </div>
  )
}
