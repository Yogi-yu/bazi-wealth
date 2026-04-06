/**
 * BaZi Engine
 * 八字推算核心引擎
 *
 * 实现说明：
 * - 年柱：干支六十甲子循环推算
 * - 月柱：简化公历月份推算（未使用节气，生产版本应接入节气库）
 * - 日柱：Julian Day Number 算法（以 1900-01-01 甲戌日为基准）
 * - 时柱：五鼠遁日起时法
 * - 十神：五行生克与阴阳配对关系推导
 */

import type {
  BaziChart,
  DayMasterInfo,
  DayMasterStrength,
  Element,
  FiveElementAnalysis,
  FiveElementCount,
  Pillar,
  Stem,
  Branch,
  TenGod,
  TenGodMap,
  WealthStar,
} from '../types'
import {
  STEMS,
  BRANCHES,
  ELEMENTS,
  STEM_ELEMENT_IDX,
  STEM_POLARITY_IDX,
  BRANCH_ELEMENT_IDX,
  BRANCH_POLARITY_IDX,
  BRANCH_MAIN_QI_STEM,
  BRANCH_HIDDEN_STEMS,
  MONTH_BRANCH_BY_MONTH,
  MONTH_STEM_BASE,
  HOUR_STEM_BASE,
} from './constants'

// ─────────────────────────────────────────
// 基础构造函数
// ─────────────────────────────────────────

function buildStem(index: number): Stem {
  const i = ((index % 10) + 10) % 10
  return {
    index: i,
    char: STEMS[i],
    element: ELEMENTS[STEM_ELEMENT_IDX[i]],
    polarity: STEM_POLARITY_IDX[i] === 0 ? '阳' : '阴',
  }
}

function buildBranch(index: number): Branch {
  const i = ((index % 12) + 12) % 12
  return {
    index: i,
    char: BRANCHES[i],
    element: ELEMENTS[BRANCH_ELEMENT_IDX[i]],
    polarity: BRANCH_POLARITY_IDX[i] === 0 ? '阳' : '阴',
    mainQiStemIndex: BRANCH_MAIN_QI_STEM[i],
  }
}

// ─────────────────────────────────────────
// 年柱推算
// ─────────────────────────────────────────

/**
 * 以公元 1900 年为庚子年（天干索引6，地支索引0）
 * 年干 = (6 + year - 1900) % 10
 * 年支 = (0 + year - 1900) % 12
 */
export function calcYearPillar(year: number): Pillar {
  const stemIndex = ((6 + year - 1900) % 10 + 10) % 10
  const branchIndex = (((year - 1900) % 12) + 12) % 12
  return {
    stem: buildStem(stemIndex),
    branch: buildBranch(branchIndex),
    label: '年柱',
  }
}

// ─────────────────────────────────────────
// 月柱推算
// ─────────────────────────────────────────

/**
 * 五虎遁年起月法
 * 月支由公历月份简化推算（忽略节气分界，以整月为单位）
 * 1月→丑, 2月→寅, ..., 12月→子
 */
export function calcMonthPillar(year: number, month: number): Pillar {
  const yearStemIndex = ((6 + year - 1900) % 10 + 10) % 10
  const yearGroup = yearStemIndex % 5          // 0=甲己 1=乙庚 2=丙辛 3=丁壬 4=戊癸
  const branchIndex = MONTH_BRANCH_BY_MONTH[month - 1]  // 月支

  // 寅月(branchIndex=2)的天干起点
  const base = MONTH_STEM_BASE[yearGroup]
  // 当前月与寅月的偏移量
  const offset = (branchIndex - 2 + 12) % 12
  const stemIndex = (base + offset) % 10

  return {
    stem: buildStem(stemIndex),
    branch: buildBranch(branchIndex),
    label: '月柱',
  }
}

// ─────────────────────────────────────────
// 日柱推算（Julian Day Number）
// ─────────────────────────────────────────

/**
 * 格里历 → Julian Day Number
 */
function toJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

/**
 * 基准：公元 1900-01-01 = JDN 2415021 = 甲戌日（天干0=甲, 地支10=戌）
 */
const BASE_JDN = 2415021
const BASE_STEM_IDX = 0   // 甲
const BASE_BRANCH_IDX = 10 // 戌

export function calcDayPillar(year: number, month: number, day: number): Pillar {
  const jdn = toJDN(year, month, day)
  const diff = jdn - BASE_JDN
  const stemIndex = ((BASE_STEM_IDX + diff) % 10 + 10) % 10
  const branchIndex = ((BASE_BRANCH_IDX + diff) % 12 + 12) % 12
  return {
    stem: buildStem(stemIndex),
    branch: buildBranch(branchIndex),
    label: '日柱',
  }
}

// ─────────────────────────────────────────
// 时柱推算（五鼠遁日起时法）
// ─────────────────────────────────────────

/**
 * hourBranchIndex: 0=子 1=丑 ... 11=亥
 * 时干 = (HOUR_STEM_BASE[dayStemIndex % 5] + hourBranchIndex) % 10
 */
export function calcHourPillar(dayStemIndex: number, hourBranchIndex: number): Pillar {
  const base = HOUR_STEM_BASE[dayStemIndex % 5]
  const stemIndex = (base + hourBranchIndex) % 10
  return {
    stem: buildStem(stemIndex),
    branch: buildBranch(hourBranchIndex),
    label: '时柱',
  }
}

// ─────────────────────────────────────────
// 完整八字命盘
// ─────────────────────────────────────────

export function generateBaziChart(
  year: number,
  month: number,
  day: number,
  hourBranchIndex: number,
): BaziChart {
  const yearPillar = calcYearPillar(year)
  const monthPillar = calcMonthPillar(year, month)
  const dayPillar = calcDayPillar(year, month, day)
  // 时辰不明时默认午时（branchIndex=6）
  const effectiveHour = hourBranchIndex < 0 ? 6 : hourBranchIndex
  const hourPillar = calcHourPillar(dayPillar.stem.index, effectiveHour)

  return { yearPillar, monthPillar, dayPillar, hourPillar }
}

// ─────────────────────────────────────────
// 十神推算
// ─────────────────────────────────────────

/**
 * 五行生克规律：
 * 生：E → (E+1)%5
 * 克：E → (E+2)%5
 */
export function getTenGodByStemIndex(
  dayMasterStemIdx: number,
  otherStemIdx: number,
): TenGod {
  const dmEl = STEM_ELEMENT_IDX[dayMasterStemIdx]
  const dmPol = STEM_POLARITY_IDX[dayMasterStemIdx]
  const otherEl = STEM_ELEMENT_IDX[otherStemIdx]
  const otherPol = STEM_POLARITY_IDX[otherStemIdx]
  const samePol = dmPol === otherPol

  if (otherEl === dmEl) return samePol ? '比肩' : '劫财'
  if ((dmEl + 1) % 5 === otherEl) return samePol ? '食神' : '伤官'
  if ((dmEl + 2) % 5 === otherEl) return samePol ? '偏财' : '正财'
  if ((otherEl + 2) % 5 === dmEl) return samePol ? '七杀' : '正官'
  if ((otherEl + 1) % 5 === dmEl) return samePol ? '偏印' : '正印'

  // 理论上不会到达（五行关系穷举完毕）
  return '比肩'
}

/**
 * 根据地支（使用主气藏干）推算十神
 */
export function getTenGodByBranchIndex(
  dayMasterStemIdx: number,
  branchIndex: number,
): TenGod {
  const mainQiStem = BRANCH_MAIN_QI_STEM[branchIndex]
  return getTenGodByStemIndex(dayMasterStemIdx, mainQiStem)
}

export function calcTenGods(chart: BaziChart): TenGodMap {
  const dmIdx = chart.dayPillar.stem.index
  return {
    yearStem: getTenGodByStemIndex(dmIdx, chart.yearPillar.stem.index),
    yearBranch: getTenGodByBranchIndex(dmIdx, chart.yearPillar.branch.index),
    monthStem: getTenGodByStemIndex(dmIdx, chart.monthPillar.stem.index),
    monthBranch: getTenGodByBranchIndex(dmIdx, chart.monthPillar.branch.index),
    hourStem: getTenGodByStemIndex(dmIdx, chart.hourPillar.stem.index),
    hourBranch: getTenGodByBranchIndex(dmIdx, chart.hourPillar.branch.index),
  }
}

// ─────────────────────────────────────────
// 五行分析
// ─────────────────────────────────────────

export function analyzeFiveElements(chart: BaziChart): FiveElementAnalysis {
  const counts: FiveElementCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }

  // 四天干（各计 1 分）
  const stems = [
    chart.yearPillar.stem,
    chart.monthPillar.stem,
    chart.dayPillar.stem,
    chart.hourPillar.stem,
  ]
  for (const s of stems) {
    counts[s.element] += 1
  }

  // 四地支藏干（主气计 1 分，中气 0.5，余气 0.3）
  const branches = [
    chart.yearPillar.branch.index,
    chart.monthPillar.branch.index,
    chart.dayPillar.branch.index,
    chart.hourPillar.branch.index,
  ]
  const weights = [1, 0.5, 0.3]
  for (const bi of branches) {
    const hiddenStems = BRANCH_HIDDEN_STEMS[bi]
    hiddenStems.forEach((stemIdx, order) => {
      const el = ELEMENTS[STEM_ELEMENT_IDX[stemIdx]]
      counts[el] += weights[order] ?? 0
    })
  }

  // 四舍五入到 1 位小数
  for (const k of Object.keys(counts) as Element[]) {
    counts[k] = Math.round(counts[k] * 10) / 10
  }

  // 日主控制的五行 = 财元素
  const dmEl = STEM_ELEMENT_IDX[chart.dayPillar.stem.index]
  const wealthElementIdx = (dmEl + 2) % 5
  const wealthElement = ELEMENTS[wealthElementIdx]

  const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const dominant = sortedEntries[0][0] as Element
  const lacking = sortedEntries[4][1] < 0.5 ? (sortedEntries[4][0] as Element) : null

  return {
    counts,
    dominant,
    lacking,
    wealthElement,
    wealthElementCount: counts[wealthElement],
  }
}

// ─────────────────────────────────────────
// 日主强弱
// ─────────────────────────────────────────

/**
 * 简化评分体系：
 * 同气比肩劫财 → +2，印星生我 → +1.5，食伤我生 → -0.8，
 * 财星我克 → -1，官杀克我 → -1.5
 * 月支得令额外 +3（旺） / +2（相） / -1（休） / -2（囚） / -3（死）
 */
export function calcDayMasterStrength(chart: BaziChart): {
  strength: DayMasterStrength
  score: number
} {
  const dmIdx = chart.dayPillar.stem.index
  const dmEl = STEM_ELEMENT_IDX[dmIdx]

  let score = 0

  // 年月时天干（跳过日干本身）
  const otherStems = [
    chart.yearPillar.stem.index,
    chart.monthPillar.stem.index,
    chart.hourPillar.stem.index,
  ]

  for (const si of otherStems) {
    const tg = getTenGodByStemIndex(dmIdx, si)
    if (tg === '比肩' || tg === '劫财') score += 2
    else if (tg === '正印' || tg === '偏印') score += 1.5
    else if (tg === '食神' || tg === '伤官') score -= 0.8
    else if (tg === '正财' || tg === '偏财') score -= 1
    else if (tg === '正官' || tg === '七杀') score -= 1.5
  }

  // 四地支（以主气推算）
  const allBranches = [
    chart.yearPillar.branch.index,
    chart.monthPillar.branch.index,
    chart.dayPillar.branch.index,
    chart.hourPillar.branch.index,
  ]
  for (const bi of allBranches) {
    const tg = getTenGodByBranchIndex(dmIdx, bi)
    if (tg === '比肩' || tg === '劫财') score += 1.5
    else if (tg === '正印' || tg === '偏印') score += 1
    else if (tg === '食神' || tg === '伤官') score -= 0.5
    else if (tg === '正财' || tg === '偏财') score -= 0.8
    else if (tg === '正官' || tg === '七杀') score -= 1
  }

  // 月支旺相休囚死（令星加权）
  const monthBranchEl = BRANCH_ELEMENT_IDX[chart.monthPillar.branch.index]
  if (monthBranchEl === dmEl) score += 3                          // 旺
  else if ((monthBranchEl + 1) % 5 === dmEl) score += 2          // 相（月支生日主）
  else if ((dmEl + 1) % 5 === monthBranchEl) score -= 1          // 休
  else if ((dmEl + 2) % 5 === monthBranchEl) score -= 2          // 囚
  else if ((monthBranchEl + 2) % 5 === dmEl) score -= 3          // 死

  const strength: DayMasterStrength =
    score >= 8 ? '极强'
    : score >= 3 ? '强'
    : score >= -2 ? '中和'
    : score >= -6 ? '弱'
    : '极弱'

  return { strength, score }
}

// ─────────────────────────────────────────
// 日主信息
// ─────────────────────────────────────────

export function buildDayMasterInfo(chart: BaziChart): DayMasterInfo {
  const stem = chart.dayPillar.stem
  const dmEl = STEM_ELEMENT_IDX[stem.index]
  const wealthElementIdx = (dmEl + 2) % 5
  const wealthElement = ELEMENTS[wealthElementIdx]
  const { strength, score } = calcDayMasterStrength(chart)

  const descriptionMap: Record<DayMasterStrength, string> = {
    极强: `日主${stem.char}极旺，自身能量充沛，适合主动出击、广开财路，但需防过刚易折，建议保留一定合作与化泄之道。`,
    强: `日主${stem.char}身强，财星得驭，具备承接财富的能力，事业心旺，适合主动型财富路径。`,
    中和: `日主${stem.char}强弱均衡，格局平稳，财运随大运流年起伏，宜稳中求进，兼顾机遇与风险。`,
    弱: `日主${stem.char}偏弱，财星较重时需注意身弱财多之象，建议先积累资源与贵人支持，再徐图财富扩张。`,
    极弱: `日主${stem.char}极弱，命局财旺身衰，财富反为压力，需谨慎保守，切忌冒进，以固本培元为先。`,
  }

  return {
    stem,
    strength,
    strengthScore: score,
    wealthElement,
    strengthDescription: descriptionMap[strength],
  }
}

// ─────────────────────────────────────────
// 财星提取
// ─────────────────────────────────────────

export function extractWealthStars(
  chart: BaziChart,
  tenGods: TenGodMap,
): WealthStar[] {
  const stars: WealthStar[] = []
  const dmIdx = chart.dayPillar.stem.index

  const stemPositions: Array<{ tg: TenGod; pillar: string }> = [
    { tg: tenGods.yearStem, pillar: '年干' },
    { tg: tenGods.monthStem, pillar: '月干' },
    { tg: tenGods.hourStem, pillar: '时干' },
  ]

  const branchPositions: Array<{ tg: TenGod; pillar: string }> = [
    { tg: tenGods.yearBranch, pillar: '年支' },
    { tg: tenGods.monthBranch, pillar: '月支' },
    { tg: tenGods.hourBranch, pillar: '时支' },
  ]

  for (const { tg, pillar } of stemPositions) {
    if (tg === '正财' || tg === '偏财') {
      // 透干财星强度较高
      const dmStr = calcDayMasterStrength(chart)
      const baseStrength = tg === '正财' ? 70 : 65
      const strengthAdj = dmStr.strength === '强' || dmStr.strength === '极强' ? 15 : -10
      stars.push({
        type: tg,
        location: 'stem',
        pillar,
        strength: Math.min(100, Math.max(20, baseStrength + strengthAdj)),
      })
    }
  }

  for (const { tg, pillar } of branchPositions) {
    if (tg === '正财' || tg === '偏财') {
      const dmStr = calcDayMasterStrength(chart)
      const baseStrength = tg === '正财' ? 55 : 50
      const strengthAdj = dmStr.strength === '强' || dmStr.strength === '极强' ? 10 : -5
      stars.push({
        type: tg,
        location: 'branch',
        pillar,
        strength: Math.min(100, Math.max(15, baseStrength + strengthAdj)),
      })
    }
  }

  return stars
}

// ─────────────────────────────────────────
// 年度年柱推算（用于流年预测）
// ─────────────────────────────────────────

export function getYearPillarString(year: number): string {
  const stemIndex = ((6 + year - 1900) % 10 + 10) % 10
  const branchIndex = (((year - 1900) % 12) + 12) % 12
  return STEMS[stemIndex] + BRANCHES[branchIndex]
}

export function getYearStemBranchIndex(year: number): {
  stemIndex: number
  branchIndex: number
} {
  return {
    stemIndex: ((6 + year - 1900) % 10 + 10) % 10,
    branchIndex: (((year - 1900) % 12) + 12) % 12,
  }
}
