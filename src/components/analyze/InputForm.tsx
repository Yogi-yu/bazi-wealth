'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AnalysisInput } from '@/lib/types'
import { SHICHEN_OPTIONS } from '@/lib/bazi/constants'
import LoadingState from './LoadingState'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 120 }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

export default function InputForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<{
    gender: 'male' | 'female'
    year: number
    month: number
    day: number
    hourBranchIndex: number
    city: string
    range: number
  }>({
    gender: 'male',
    year: 1990,
    month: 6,
    day: 15,
    hourBranchIndex: -1,
    city: '',
    range: 10,
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validate
    if (form.year < 1900 || form.year > currentYear) {
      setError('请输入有效的出生年份（1900–今年）')
      return
    }

    setLoading(true)

    try {
      const payload: AnalysisInput = {
        gender: form.gender,
        year: form.year,
        month: form.month,
        day: form.day,
        hourBranchIndex: form.hourBranchIndex,
        city: form.city,
        range: form.range,
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? '分析失败，请稍后重试')
      }

      const result = await res.json()
      sessionStorage.setItem('baziAnalysis', JSON.stringify(result))
      router.push('/result')
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误，请重试')
      setLoading(false)
    }
  }

  if (loading) return <LoadingState />

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Gender */}
      <div>
        <Label text="性别" required />
        <div className="mt-2 flex gap-3">
          {(['male', 'female'] as const).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => set('gender', g)}
              className={`flex-1 rounded-lg border py-3 text-sm font-medium transition-all ${
                form.gender === g
                  ? 'border-gold bg-[rgba(201,168,76,0.12)] text-gold'
                  : 'border-[rgba(255,255,255,0.08)] text-ink-secondary hover:border-[rgba(201,168,76,0.3)]'
              }`}
            >
              {g === 'male' ? '男 ♂' : '女 ♀'}
            </button>
          ))}
        </div>
      </div>

      {/* Birth date */}
      <div>
        <Label text="出生日期" required hint="请使用公历（阳历）日期" />
        <div className="mt-2 grid grid-cols-3 gap-3">
          <div>
            <div className="mb-1 text-xs text-ink-muted">年</div>
            <select
              className="input-field"
              value={form.year}
              onChange={e => set('year', Number(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>
                  {y} 年
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1 text-xs text-ink-muted">月</div>
            <select
              className="input-field"
              value={form.month}
              onChange={e => set('month', Number(e.target.value))}
            >
              {months.map(m => (
                <option key={m} value={m}>
                  {m} 月
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1 text-xs text-ink-muted">日</div>
            <select
              className="input-field"
              value={form.day}
              onChange={e => set('day', Number(e.target.value))}
            >
              {days.map(d => (
                <option key={d} value={d}>
                  {d} 日
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Birth time */}
      <div>
        <Label text="出生时辰" hint="不知道可选"时辰不详"，影响时柱推算" />
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => set('hourBranchIndex', -1)}
            className={`rounded-lg border py-2.5 text-xs transition-all ${
              form.hourBranchIndex === -1
                ? 'border-gold bg-[rgba(201,168,76,0.12)] text-gold'
                : 'border-[rgba(255,255,255,0.06)] text-ink-muted hover:border-[rgba(201,168,76,0.2)]'
            }`}
          >
            时辰不详
          </button>
          {SHICHEN_OPTIONS.map(({ label, time, branchIndex }) => (
            <button
              key={branchIndex}
              type="button"
              onClick={() => set('hourBranchIndex', branchIndex)}
              className={`rounded-lg border py-2 text-center transition-all ${
                form.hourBranchIndex === branchIndex
                  ? 'border-gold bg-[rgba(201,168,76,0.12)] text-gold'
                  : 'border-[rgba(255,255,255,0.06)] text-ink-muted hover:border-[rgba(201,168,76,0.2)]'
              }`}
            >
              <div className="text-xs font-medium">{label}</div>
              <div className="text-[10px] opacity-60">{time}</div>
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <Label text="出生城市" hint="可选，用于记录参考" />
        <input
          type="text"
          className="input-field mt-2"
          placeholder="如：北京、上海、广州..."
          value={form.city}
          onChange={e => set('city', e.target.value)}
          maxLength={30}
        />
      </div>

      {/* Range */}
      <div>
        <Label text="财运分析年限" required />
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[1, 3, 5, 10].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => set('range', r)}
              className={`rounded-lg border py-3 text-sm font-medium transition-all ${
                form.range === r
                  ? 'border-gold bg-[rgba(201,168,76,0.12)] text-gold'
                  : 'border-[rgba(255,255,255,0.06)] text-ink-secondary hover:border-[rgba(201,168,76,0.2)]'
              }`}
            >
              近{r}年
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.08)] px-4 py-3 text-sm text-[#F87171]">
          {error}
        </div>
      )}

      {/* Submit */}
      <button type="submit" className="btn-primary w-full py-4 text-base">
        <span>开始财运分析</span>
        <span className="text-lg">→</span>
      </button>

      <p className="text-center text-xs text-ink-muted">
        本分析完全免费 · 结果仅供文化参考与娱乐 · 不构成任何专业建议
      </p>
    </form>
  )
}

function Label({
  text,
  hint,
  required,
}: {
  text: string
  hint?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-sm font-medium text-ink-primary">
        {text}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </span>
      {hint && <span className="text-xs text-ink-muted">{hint}</span>}
    </div>
  )
}
