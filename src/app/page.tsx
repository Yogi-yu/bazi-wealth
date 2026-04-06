import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeatureCards from '@/components/home/FeatureCards'
import FaqSection from '@/components/home/FaqSection'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeatureCards />
        <FaqSection />

        {/* Final CTA */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <div
              className="mb-4 text-3xl font-bold text-ink-primary sm:text-4xl"
              style={{ fontFamily: 'Noto Serif SC, serif' }}
            >
              准备好洞见您的财运了吗？
            </div>
            <p className="mb-8 text-ink-secondary">
              输入出生信息，即刻获得专属八字财运分析报告
            </p>
            <Link href="/analyze" className="btn-primary px-10 py-4 text-base">
              立即开始测算 →
            </Link>
            <p className="mt-4 text-xs text-ink-muted">
              完全免费 · 无需注册 · 仅供参考娱乐
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
