import Header from '@/components/layout/Header'
import InputForm from '@/components/analyze/InputForm'

export const metadata = {
  title: '填写生辰 · 天机财运',
  description: '输入出生年月日时，自动生成八字命盘与财运分析报告',
}

export default function AnalyzePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
          {/* Page header */}
          <div className="mb-10 text-center">
            <div className="divider-gold mx-auto mb-5 max-w-xs text-xs tracking-widest">
              生辰录入
            </div>
            <h1
              className="mb-3 text-3xl font-bold text-ink-primary"
              style={{ fontFamily: 'Noto Serif SC, serif' }}
            >
              填写您的出生信息
            </h1>
            <p className="text-sm text-ink-secondary">
              系统将基于传统八字命理自动推算您的财运格局与趋势
            </p>
          </div>

          {/* Form card */}
          <div className="card-base p-6 sm:p-8">
            <InputForm />
          </div>

          {/* Trust note */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="text-gold">◈</span> 不存储个人信息
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-gold">◈</span> 仅供文化参考
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-gold">◈</span> 完全免费
            </span>
          </div>
        </div>
      </main>
    </>
  )
}
