import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '天机财运 · 八字财运分析',
  description: '基于传统八字命理，洞见您的财运格局与未来趋势。专业结构化分析，仅供文化参考与娱乐。',
  keywords: '八字, 财运, 命理, 八字分析, 财运预测, 命盘',
  openGraph: {
    title: '天机财运 · 八字财运分析',
    description: '洞见财运，把握天机',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-primary text-ink-primary antialiased">
        {children}
      </body>
    </html>
  )
}
