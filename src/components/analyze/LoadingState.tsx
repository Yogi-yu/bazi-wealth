'use client'

import { useEffect, useState } from 'react'

const steps = [
  { text: '正在解析出生信息...', duration: 800 },
  { text: '构建八字四柱命盘...', duration: 900 },
  { text: '分析五行格局分布...', duration: 700 },
  { text: '识别财星与十神关系...', duration: 1000 },
  { text: '推演年度财运走势...', duration: 900 },
  { text: '生成结构化财运建议...', duration: 700 },
]

export default function LoadingState() {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let current = 0
    let elapsed = 0
    const total = steps.reduce((a, s) => a + s.duration, 0)

    const tick = () => {
      if (current >= steps.length) return
      const dur = steps[current].duration
      elapsed += dur
      setProgress(Math.round((elapsed / total) * 100))
      setStep(current)
      current++
      if (current < steps.length) {
        setTimeout(tick, dur)
      }
    }

    const t = setTimeout(tick, 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center py-12">
      {/* Outer ring */}
      <div className="relative mb-10">
        <div className="h-28 w-28 animate-spin-slow rounded-full border border-[rgba(201,168,76,0.15)]" />
        <div
          className="absolute inset-2 animate-spin rounded-full border-b-2 border-r-2 border-gold"
          style={{ animationDuration: '1.5s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-4xl text-gradient-gold"
            style={{ fontFamily: 'Noto Serif SC, serif' }}
          >
            命
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-8 h-6 text-center">
        <p className="animate-fade-in text-sm font-medium text-gold" key={step}>
          {steps[step]?.text ?? '报告生成完毕...'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div className="mb-2 flex justify-between text-xs text-ink-muted">
          <span>推算进度</span>
          <span>{progress}%</span>
        </div>
        <div className="score-bar">
          <div
            className="score-fill bg-gradient-to-r from-gold-dark via-gold to-gold-light"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="mt-8 flex gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
              i <= step ? 'bg-gold' : 'bg-[rgba(255,255,255,0.1)]'
            }`}
          />
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-muted">天机不可轻泄，正在为您精心推算...</p>
    </div>
  )
}
