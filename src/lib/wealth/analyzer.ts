/**
 * 财运结构分析层
 * 负责：财运等级评定、格局分析、标签生成
 */

import type {
  BaziChart,
  DayMasterInfo,
  TenGodMap,
  WealthGrade,
  WealthStar,
  WealthStructure,
  WealthSummary,
} from '../types'
import { calcDayMasterStrength } from '../bazi/engine'

// ─────────────────────────────────────────
// 财运等级评定
// ─────────────────────────────────────────

function calcWealthGrade(
  wealthStars: WealthStar[],
  dayMaster: DayMasterInfo,
  tenGods: TenGodMap,
): { grade: WealthGrade; score: number } {
  let score = 50 // 基准分

  // 财星数量与强度
  const stemStars = wealthStars.filter(s => s.location === 'stem')
  const branchStars = wealthStars.filter(s => s.location === 'branch')

  score += stemStars.length * 15  // 透干财星权重高
  score += branchStars.length * 8 // 藏支财星权重较低
  score += wealthStars.reduce((acc, s) => acc + (s.strength - 50) * 0.2, 0)

  // 日主强弱修正
  const strengthModifier: Record<string, number> = {
    极强: 12,
    强: 8,
    中和: 0,
    弱: -10,
    极弱: -18,
  }
  score += strengthModifier[dayMaster.strength] ?? 0

  // 月支财星得令额外加分
  if (tenGods.monthBranch === '正财' || tenGods.monthBranch === '偏财') {
    score += 12
  }

  // 食神、伤官生财（间接财路）
  const allTg = Object.values(tenGods)
  const foodGodCount = allTg.filter(t => t === '食神' || t === '伤官').length
  score += foodGodCount * 4

  // 劫财过多消耗财星
  const robCount = allTg.filter(t => t === '劫财').length
  score -= robCount * 6

  score = Math.min(100, Math.max(10, score))

  const grade: WealthGrade =
    score >= 85 ? 'S'
    : score >= 70 ? 'A'
    : score >= 50 ? 'B'
    : 'C'

  return { grade, score }
}

// ─────────────────────────────────────────
// 财运风格标签
// ─────────────────────────────────────────

function buildStyleTags(
  dayMaster: DayMasterInfo,
  wealthStars: WealthStar[],
  tenGods: TenGodMap,
): string[] {
  const tags: string[] = []

  const directCount = wealthStars.filter(s => s.type === '正财').length
  const indirectCount = wealthStars.filter(s => s.type === '偏财').length

  if (directCount > indirectCount) tags.push('正财主导')
  else if (indirectCount > directCount) tags.push('偏财主导')
  else if (directCount + indirectCount >= 2) tags.push('财星并重')
  else tags.push('财路待开')

  const allTg = Object.values(tenGods)

  if (allTg.includes('食神')) tags.push('才华生财')
  if (allTg.includes('伤官')) tags.push('开拓创新')
  if (allTg.includes('正官') || allTg.includes('七杀')) tags.push('职场积累')

  if (dayMaster.strength === '极强' || dayMaster.strength === '强') {
    tags.push('主动型')
  } else if (dayMaster.strength === '弱' || dayMaster.strength === '极弱') {
    tags.push('借力型')
  } else {
    tags.push('均衡型')
  }

  if (indirectCount >= 2) tags.push('高波动')
  else if (directCount >= 2) tags.push('稳健积累')

  return tags.slice(0, 5) // 最多 5 个标签
}

// ─────────────────────────────────────────
// 财运摘要
// ─────────────────────────────────────────

export function buildWealthSummary(
  dayMaster: DayMasterInfo,
  wealthStars: WealthStar[],
  tenGods: TenGodMap,
): WealthSummary {
  const { grade, score } = calcWealthGrade(wealthStars, dayMaster, tenGods)
  const tags = buildStyleTags(dayMaster, wealthStars, tenGods)

  const directCount = wealthStars.filter(s => s.type === '正财').length
  const indirectCount = wealthStars.filter(s => s.type === '偏财').length
  const wealthStyleType =
    directCount > indirectCount ? '正财主导'
    : indirectCount > directCount ? '偏财主导'
    : directCount + indirectCount >= 2 ? '财星并重'
    : '财星偏弱'

  const gradeDescriptions: Record<WealthGrade, string> = {
    S: '命局财运格局极佳，财星有力且日主能承，一生财路宽广，多有贵人相助与机遇加持。',
    A: '命局财运格局良好，财星有据，日主与财星配合较为和谐，勤奋进取则财运亨通。',
    B: '命局财运中等，财路需要主动经营，借助大运流年之力，亦有较好的财富积累空间。',
    C: '命局财运偏弱或存在制约因素，建议以稳健保守为主，切忌冒进，注重资本保护。',
  }

  const keywordsMap: Record<WealthGrade, string[]> = {
    S: ['财运旺盛', '贵人扶持', '机遇丰富', '财星有力'],
    A: ['稳步积累', '正偏兼得', '努力有回报', '财路清晰'],
    B: ['细水长流', '需主动把握', '稳中有进', '流年关键'],
    C: ['谨慎为先', '固本培元', '防范风险', '待时而动'],
  }

  return {
    grade,
    gradeLabel: `${grade} 级`,
    overallDescription: gradeDescriptions[grade],
    styleTags: tags,
    keywords: keywordsMap[grade],
    wealthStyleType,
  }
}

// ─────────────────────────────────────────
// 财运结构分析
// ─────────────────────────────────────────

export function buildWealthStructure(
  chart: BaziChart,
  dayMaster: DayMasterInfo,
  wealthStars: WealthStar[],
  tenGods: TenGodMap,
): WealthStructure {
  const directStars = wealthStars.filter(s => s.type === '正财')
  const indirectStars = wealthStars.filter(s => s.type === '偏财')

  // 正财 vs 偏财倾向分（0–100）
  const totalStars = wealthStars.length
  let directScore = 50
  let indirectScore = 50
  if (totalStars > 0) {
    const directWeight = directStars.reduce((a, s) => a + s.strength, 0)
    const indirectWeight = indirectStars.reduce((a, s) => a + s.strength, 0)
    const total = directWeight + indirectWeight || 1
    directScore = Math.round((directWeight / total) * 100)
    indirectScore = 100 - directScore
  }

  // 财星是否得用
  const isStrong = dayMaster.strength === '强' || dayMaster.strength === '极强'
  const isWeak = dayMaster.strength === '弱' || dayMaster.strength === '极弱'
  const hasWealthStar = wealthStars.length > 0
  const wealthStarFavorable = hasWealthStar && !isWeak

  // 适合的财富路径
  const allTg = Object.values(tenGods)
  const suitedPaths: string[] = []
  const unsuitedPaths: string[] = []

  if (directScore > 60) {
    suitedPaths.push('薪资储蓄', '稳健投资', '实体经营')
    unsuitedPaths.push('高频投机', '期货杠杆')
  } else {
    suitedPaths.push('商业合作', '项目分成', '灵活经营')
    unsuitedPaths.push('固定薪资依赖', '墨守成规')
  }

  if (allTg.includes('食神')) suitedPaths.push('技艺变现', '内容创作')
  if (allTg.includes('伤官')) suitedPaths.push('咨询顾问', '创业开拓')
  if (allTg.includes('正官')) suitedPaths.push('体制内晋升', '稳健职场')
  if (allTg.includes('七杀')) suitedPaths.push('竞争性行业', '高压管理岗')

  if (isWeak) {
    suitedPaths.push('借力合作', '整合资源')
    unsuitedPaths.push('单打独斗', '重资产扩张')
  }

  if (isStrong) {
    suitedPaths.push('主导型角色', '自主创业')
    unsuitedPaths.push('纯辅助型职位')
  }

  // 去重
  const uniqueSuited = Array.from(new Set(suitedPaths)).slice(0, 5)
  const uniqueUnsuited = Array.from(new Set(unsuitedPaths)).slice(0, 4)

  // 综合分析文字
  const dmStr = dayMaster.strength
  const wealthEl = dayMaster.wealthElement
  const dmChar = dayMaster.stem.char

  let structureAnalysis = `日主${dmChar}，${dmStr}，命局以${wealthEl}为财元素。`

  if (directStars.length > 0) {
    structureAnalysis += `正财星现于${directStars.map(s => s.pillar).join('、')}，正财有据，适合稳健积累之道。`
  }
  if (indirectStars.length > 0) {
    structureAnalysis += `偏财星见于${indirectStars.map(s => s.pillar).join('、')}，偏财灵动，机会型收入与资本运作潜力较强。`
  }
  if (wealthStars.length === 0) {
    structureAnalysis += `命局财星藏匿未现，财富积累需借流年大运引动，主动经营尤为关键。`
  }

  if (isStrong) {
    structureAnalysis += `身强能克财，具备驾驭财富的能力，可适当进取，扩大财富边界。`
  } else if (isWeak) {
    structureAnalysis += `身弱财重时，易感财富压力，建议借助合作伙伴与贵人之力，共同推进。`
  } else {
    structureAnalysis += `身财平衡，稳中有进，大运流年顺遂时可有较好的财运表现。`
  }

  return {
    directWealthScore: directScore,
    indirectWealthScore: indirectScore,
    wealthStarFavorable,
    dayMasterVsWealth: `日主${dmChar}（${dmStr}）+ 财元素${wealthEl}`,
    suitedWealthPaths: uniqueSuited,
    unsuitedWealthPaths: uniqueUnsuited,
    structureAnalysis,
  }
}
