const features = [
  {
    icon: '◈',
    title: '八字命盘自动生成',
    description:
      '输入出生年月日时，系统自动推算四柱天干地支，精确识别日主、五行分布与十神关系，无需命理基础即可获得完整命盘。',
    tags: ['年柱', '月柱', '日柱', '时柱'],
    color: '#C9A84C',
  },
  {
    icon: '◆',
    title: '财运格局深度解析',
    description:
      '识别命局中的正财星与偏财星，分析财星得用与否，判断日主与财元素的配合关系，给出财运格局等级评定（S/A/B/C）。',
    tags: ['正财星', '偏财星', '格局评级', '五行互动'],
    color: '#E8C96B',
  },
  {
    icon: '▸',
    title: '十年年度趋势预测',
    description:
      '以流年天干十神与命局五行互动为基础，生成未来十年逐年财运评分、机遇等级与风险提示，让财运走势一目了然。',
    tags: ['年度评分', '机遇等级', '风险提示', '峰谷识别'],
    color: '#4ADE80',
  },
  {
    icon: '◉',
    title: '个性化财富建议',
    description:
      '基于命局分析，给出适合与不适合的财富路径、投资风格建议、合作策略要点与风险控制提示，落地实用。',
    tags: ['适合路径', '风险控制', '投资风格', '合作建议'],
    color: '#60A5FA',
  },
]

const steps = [
  {
    number: '01',
    title: '输入生辰信息',
    desc: '填写性别、出生年月日及时辰，选择分析年限范围。',
  },
  {
    number: '02',
    title: '系统智能推算',
    desc: '引擎自动生成八字命盘，分析五行与十神关系。',
  },
  {
    number: '03',
    title: '获取专属报告',
    desc: '阅读结构化财运报告，参考建议规划财富路径。',
  },
]

export default function FeatureCards() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <div className="divider-gold mx-auto mb-6 max-w-xs text-xs tracking-widest">
            四大核心功能
          </div>
          <h2
            className="text-3xl font-bold text-ink-primary sm:text-4xl"
            style={{ fontFamily: 'Noto Serif SC, serif' }}
          >
            一份报告，看清财运全局
          </h2>
          <p className="mt-4 text-ink-secondary">
            从命盘生成到年度预测，七大维度全面解析您的财运格局
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map(({ icon, title, description, tags, color }) => (
            <div key={title} className="card-base p-6 transition-all hover:border-[rgba(201,168,76,0.25)]">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold"
                  style={{ background: `${color}15`, color }}
                >
                  {icon}
                </div>
                <h3 className="font-semibold text-ink-primary">{title}</h3>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-ink-secondary">{description}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ background: `${color}12`, color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-20">
          <div className="mb-10 text-center">
            <div className="divider-gold mx-auto mb-6 max-w-xs text-xs tracking-widest">
              三步完成分析
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map(({ number, title, desc }, i) => (
              <div key={number} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+60px)] top-7 hidden w-[calc(100%-120px)] border-t border-dashed border-[rgba(201,168,76,0.2)] sm:block" />
                )}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.08)]">
                  <span className="text-lg font-bold text-gold">{number}</span>
                </div>
                <h4 className="mb-2 font-semibold text-ink-primary">{title}</h4>
                <p className="text-sm text-ink-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
