'use client'

import { useState } from 'react'

const faqs = [
  {
    q: '八字财运分析准确吗？',
    a: '八字命理是中国传统文化的重要组成部分，有数千年历史。本平台基于传统规则进行系统化推演，提供一种结构化参考视角。命理分析不是精确预测，而是趋势与概率的参考。我们建议将其视为文化工具，结合自身实际做出理性决策。',
  },
  {
    q: '时辰不知道怎么办？',
    a: '若不清楚出生时辰，系统将以"时辰不详"处理，日柱信息仍然完整，年柱、月柱分析照常进行。时辰主要影响时柱推算，核心财运格局分析影响不大，建议尽量填写以获得更完整的结果。',
  },
  {
    q: '正财和偏财有什么区别？',
    a: '正财代表稳健、规律的财富来源，如薪资、实体经营收入；偏财代表流动性更强的机遇型财富，如投资收益、横财或商业分成。命局中哪类财星更旺，往往反映一个人更自然的财富积累倾向。',
  },
  {
    q: '财运等级 S/A/B/C 是怎么评定的？',
    a: '财运等级综合考量命局中财星数量与质量、财星透干还是藏支、日主强弱与财星的配合关系，以及月支令星影响等多维因素，通过量化评分模型得出。等级是命局财运格局的综合评价，并非绝对预测。',
  },
  {
    q: '年度财运评分是如何计算的？',
    a: '流年评分以当年天干相对于日主的十神关系为主要依据（如正财、偏财、食神等加分，劫财、七杀等减分），结合地支关系与日主强弱修正因子，最终得出 0–100 的综合分值。',
  },
  {
    q: '这份报告可以作为投资或财务决策的依据吗？',
    a: '不可以。本报告仅供文化参考与个人探索之用，不构成任何投资、法律或财务建议。重大财务决策请结合自身实际情况并咨询专业人士。天机财运对任何基于本报告的决策不承担责任。',
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-16 sm:py-24 bg-bg-secondary">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <div className="divider-gold mx-auto mb-6 max-w-xs text-xs tracking-widest">
            常见问题
          </div>
          <h2
            className="text-3xl font-bold text-ink-primary"
            style={{ fontFamily: 'Noto Serif SC, serif' }}
          >
            解答您的疑惑
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="card-base overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium text-ink-primary pr-4">{q}</span>
                <span
                  className={`flex-shrink-0 text-gold text-lg transition-transform duration-200 ${
                    open === i ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="border-t border-[rgba(201,168,76,0.1)] px-6 pb-5 pt-4">
                  <p className="text-sm leading-relaxed text-ink-secondary">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
