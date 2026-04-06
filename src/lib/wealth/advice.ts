/**
 * 财运建议生成层
 * 基于财运结构与日主信息，输出结构化财富建议
 */

import type { Advice, DayMasterInfo, TenGodMap, WealthStar, WealthStructure } from '../types'

export function buildAdvice(
  dayMaster: DayMasterInfo,
  wealthStars: WealthStar[],
  structure: WealthStructure,
  tenGods: TenGodMap,
): Advice {
  const allTg = Object.values(tenGods)
  const hasDirectWealth = wealthStars.some(s => s.type === '正财')
  const hasIndirectWealth = wealthStars.some(s => s.type === '偏财')
  const isStrong = dayMaster.strength === '强' || dayMaster.strength === '极强'
  const isWeak = dayMaster.strength === '弱' || dayMaster.strength === '极弱'
  const hasShiShen = allTg.includes('食神')
  const hasShangGuan = allTg.includes('伤官')
  const hasZhengGuan = allTg.includes('正官')
  const hasQiSha = allTg.includes('七杀')
  const hasJieCai = allTg.includes('劫财')

  // ── 适合的财富路径 ──────────────────────────

  const suitableApproaches: string[] = []

  if (hasDirectWealth && isStrong) {
    suitableApproaches.push('以主业为核心，稳定持续积累薪资与经营利润')
  }
  if (hasIndirectWealth) {
    suitableApproaches.push('关注多元收入来源，如投资组合、兼职项目或商业分成')
  }
  if (hasShiShen) {
    suitableApproaches.push('将技能与知识变现，内容创作、技艺授课或专业咨询均适合')
  }
  if (hasShangGuan) {
    suitableApproaches.push('发挥创新开拓精神，适合自主创业或颠覆性商业模式')
  }
  if (hasZhengGuan && !isWeak) {
    suitableApproaches.push('职场路线稳健可行，专注晋升与薪资增长，内部资源整合')
  }
  if (isWeak) {
    suitableApproaches.push('借助外部资源与合作伙伴，以小博大，整合型财富路径更适合')
  }
  if (isStrong && hasIndirectWealth) {
    suitableApproaches.push('具备驾驭风险资产的能力，可适度配置成长型投资或股权类资产')
  }

  if (suitableApproaches.length === 0) {
    suitableApproaches.push('稳健储蓄与低风险理财，逐步积累原始资本')
  }

  // ── 不适合的路径 ──────────────────────────

  const unsuitableApproaches: string[] = []

  if (isWeak && wealthStars.length > 0) {
    unsuitableApproaches.push('避免财多身弱之局：切忌一次性大额投资或承担超出能力的资产负债')
  }
  if (hasJieCai) {
    unsuitableApproaches.push('合伙需谨慎，劫财见形，资金被侵蚀风险较高，建议书面协议明确')
  }
  if (!hasDirectWealth && !hasIndirectWealth) {
    unsuitableApproaches.push('命局财星未现，短期内不宜盲目跟风投机，待财运引动再扩张')
  }
  if (hasQiSha && isWeak) {
    unsuitableApproaches.push('七杀重而身弱，不宜进入强对抗性竞争领域，压力损耗过大')
  }
  if (!hasShiShen && !hasShangGuan) {
    unsuitableApproaches.push('创意型或艺术型变现路径匹配度较低，不必勉强跨界')
  }

  if (unsuitableApproaches.length === 0) {
    unsuitableApproaches.push('高频短线交易与衍生品杠杆操作，与命局财运节奏不符')
  }

  // ── 合作建议 ──────────────────────────

  let collaborationAdvice: string

  if (isStrong && hasDirectWealth) {
    collaborationAdvice =
      '日主身强，适合在合作中担任主导方或控股角色，选择执行力强的伙伴配合，避免能力相近者形成制衡。'
  } else if (isWeak) {
    collaborationAdvice =
      '日主偏弱，借力为上策，选择能量互补的合作伙伴，如擅长执行、资源丰富或人脉广泛者，以合作弥补个人局限。'
  } else if (hasJieCai) {
    collaborationAdvice =
      '命局劫财旺，与人合作需立规矩，书面协议必不可少，优先选择独立清晰的利益分配机制，避免利益模糊化。'
  } else {
    collaborationAdvice =
      '命局格局均衡，合作关系宜选择价值观契合、长期导向的伙伴，短期利益型合作风险较高。'
  }

  // ── 投资风格建议 ──────────────────────────

  let investmentStyle: string

  const directScore = structure.directWealthScore
  const indirectScore = structure.indirectWealthScore

  if (directScore >= 65) {
    investmentStyle =
      '以正财为主：适合稳健型资产配置，如指数基金定投、稳健债券、实体资产。收益预期合理，复利积累为核心策略。'
  } else if (indirectScore >= 65) {
    investmentStyle =
      '以偏财为主：具备机遇感知力，可适度配置成长型股票、创业项目或另类资产，但需严格控制单笔风险比例（建议不超过总资产15%）。'
  } else {
    investmentStyle =
      '正偏财并重：建议构建核心 + 卫星组合，核心部分（60-70%）保持稳健配置，卫星部分（30-40%）探索高潜力机会。'
  }

  // ── 风险控制要点 ──────────────────────────

  const riskControlPoints: string[] = [
    isWeak
      ? '切忌"财多身弱"陷阱：当财富机会涌现时，优先评估自身承接能力，量力而为'
      : '强日主需防过刚易折，大力扩张时注意留有余力，保持流动性',

    hasJieCai
      ? '劫财临命，合伙与信用风险较高，与他人资金往来务必留有书面凭证'
      : '注意流年财运低谷期（详见年度预测），此时应减少高风险决策',

    '建立"财富缓冲区"：无论财运高低，保持3–6个月生活支出的现金储备',

    hasQiSha
      ? '七杀见形，面临高压决策时易冲动，建议重要财务决策留出72小时冷静期'
      : '制定明确的止损规则，投资亏损超过预设比例时及时离场，不恋战',
  ]

  return {
    suitableApproaches,
    unsuitableApproaches,
    collaborationAdvice,
    investmentStyle,
    riskControlPoints,
  }
}

export const DISCLAIMER =
  '本报告依据传统八字命理规则自动生成，仅供文化学习、娱乐参考与个人探索之用。' +
  '命理分析不构成任何投资、法律、医疗或人生重大决策建议。' +
  '命运终究由人自主把握，任何财务决策请结合自身实际情况，必要时咨询专业人士。' +
  '天机财运不对本报告内容承担任何法律责任。'
