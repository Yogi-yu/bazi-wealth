/**
 * 年度流年财运预测层
 * 基于流年天干十神与日主命局的五行互动，生成结构化年度评分
 */

import type {
  BaziChart,
  DayMasterInfo,
  OpportunityLevel,
  RiskLevel,
  StageSummary,
  TenGod,
  YearForecast,
} from '../types'
import {
  getTenGodByStemIndex,
  getTenGodByBranchIndex,
  getYearPillarString,
  getYearStemBranchIndex,
} from '../bazi/engine'
import { STEM_ELEMENT_IDX, BRANCH_ELEMENT_IDX } from '../bazi/constants'

// ─────────────────────────────────────────
// 十神财运权重表
// ─────────────────────────────────────────

const TEN_GOD_WEALTH_SCORE: Record<TenGod, number> = {
  正财: 28,   // 稳健直财，评分高
  偏财: 22,   // 机遇之财，略有波动
  食神: 14,   // 生财之道，间接利好
  伤官: 8,    // 破格开拓，有利有弊
  正官: 5,    // 规矩稳健，财运一般
  比肩: -8,   // 竞争分财，略负面
  七杀: -10,  // 压力损耗，需防支出
  偏印: -5,   // 枯竭才思，财路受阻
  正印: 0,    // 保守护身，财运平淡
  劫财: -15,  // 劫财消耗，风险最高
}

// ─────────────────────────────────────────
// 财运评分转换
// ─────────────────────────────────────────

type ScoreLabel = '旺财年' | '进财年' | '平稳年' | '谨慎年' | '回避年'

function scoreToLabel(score: number): ScoreLabel {
  if (score >= 80) return '旺财年'
  if (score >= 65) return '进财年'
  if (score >= 45) return '平稳年'
  if (score >= 30) return '谨慎年'
  return '回避年'
}

function scoreToOpportunity(score: number): OpportunityLevel {
  if (score >= 70) return '高'
  if (score >= 48) return '中'
  return '低'
}

function scoreToRisk(score: number): RiskLevel {
  if (score <= 30) return '高'
  if (score <= 55) return '中'
  return '低'
}

// ─────────────────────────────────────────
// 年度说明文字生成
// ─────────────────────────────────────────

function buildYearDescription(
  yearTenGod: TenGod,
  branchTenGod: TenGod,
  score: number,
  dayMaster: DayMasterInfo,
): string {
  const label = scoreToLabel(score)
  const dmChar = dayMaster.stem.char

  const tenGodPhrases: Record<TenGod, string> = {
    正财: `正财流年，财星入命，正财有情，宜稳健布局、把握实质性收入机会`,
    偏财: `偏财流年，机遇流动，资本与横财皆有可能，需配合行动力方可变现`,
    食神: `食神流年，才华得展，生财之道畅通，适合技能变现与多元收入`,
    伤官: `伤官流年，创新破格，有开拓机遇但波动较大，需防冲动决策`,
    正官: `正官流年，规矩主导，职场稳健晋升，但财富增幅有限`,
    七杀: `七杀流年，压力倍增，竞争激烈，需防破财与资产受损`,
    比肩: `比肩流年，同类竞争，财星受制，宜守不宜攻，防止分财`,
    劫财: `劫财流年，财被劫走，破财风险较高，切忌冒险投资与合伙纠纷`,
    偏印: `偏印流年，思虑过重，财路受阻，宜沉淀积累，不宜大额出手`,
    正印: `正印流年，贵人出现，稳健守成，财运平稳但增长有限`,
  }

  const base = tenGodPhrases[yearTenGod] ?? `流年${yearTenGod}临命`

  const suffix =
    label === '旺财年' ? `，为${dayMaster.stem.char}命盘近年财运高峰期，宜主动把握。`
    : label === '进财年' ? `，财运向好，积极布局可有良好收益。`
    : label === '平稳年' ? `，财运平稳，稳健经营，防范风险为宜。`
    : label === '谨慎年' ? `，财运偏弱，以守为主，控制支出与风险敞口。`
    : `，财运低潮，建议暂缓重大财务决策，以固本培元为优先。`

  return base + suffix
}

// ─────────────────────────────────────────
// 年度预测生成（主函数）
// ─────────────────────────────────────────

export function generateYearlyForecast(
  chart: BaziChart,
  dayMaster: DayMasterInfo,
  startYear: number,
  years: number,
): YearForecast[] {
  const forecasts: YearForecast[] = []
  const dmIdx = chart.dayPillar.stem.index

  // 日主强弱基础修正
  const strengthOffset =
    dayMaster.strength === '极强' ? 5
    : dayMaster.strength === '强' ? 3
    : dayMaster.strength === '中和' ? 0
    : dayMaster.strength === '弱' ? -5
    : -10

  for (let i = 0; i < years; i++) {
    const year = startYear + i
    const { stemIndex, branchIndex } = getYearStemBranchIndex(year)

    const yearStemTg = getTenGodByStemIndex(dmIdx, stemIndex)
    const yearBranchTg = getTenGodByBranchIndex(dmIdx, branchIndex)

    // 综合评分：天干权重 0.6，地支权重 0.4
    const stemScore = TEN_GOD_WEALTH_SCORE[yearStemTg] ?? 0
    const branchScore = TEN_GOD_WEALTH_SCORE[yearBranchTg] ?? 0
    const rawScore = 50 + stemScore * 0.6 + branchScore * 0.4 + strengthOffset

    // 加入轻微随机扰动，模拟流年个性（±5，但基于确定性 seed）
    const pseudoRandom = ((year * 13 + dmIdx * 7) % 10) - 5
    const finalScore = Math.min(100, Math.max(8, Math.round(rawScore + pseudoRandom)))

    forecasts.push({
      year,
      yearPillarStr: getYearPillarString(year),
      yearTenGod: yearStemTg,
      wealthScore: finalScore,
      opportunityLevel: scoreToOpportunity(finalScore),
      riskLevel: scoreToRisk(finalScore),
      scoreLabel: scoreToLabel(finalScore),
      description: buildYearDescription(yearStemTg, yearBranchTg, finalScore, dayMaster),
    })
  }

  return forecasts
}

// ─────────────────────────────────────────
// 阶段总结（1 / 3 / 5 年）
// ─────────────────────────────────────────

export function buildStagesSummary(
  forecasts: YearForecast[],
  startYear: number,
  dayMaster: DayMasterInfo,
): StageSummary[] {
  const stages: StageSummary[] = []

  const stageDefs = [
    { label: '近1年', years: 1 },
    { label: '近3年', years: 3 },
    { label: '近5年', years: 5 },
  ]

  for (const { label, years } of stageDefs) {
    const slice = forecasts.slice(0, years)
    if (slice.length === 0) continue

    const avgScore = slice.reduce((a, b) => a + b.wealthScore, 0) / slice.length
    const maxScore = Math.max(...slice.map(f => f.wealthScore))
    const minScore = Math.min(...slice.map(f => f.wealthScore))

    const peakYear = slice.find(f => f.wealthScore === maxScore)
    const lowYear = slice.find(f => f.wealthScore === minScore)

    const trendStr =
      avgScore >= 70 ? '整体财运偏强，机遇大于挑战'
      : avgScore >= 50 ? '财运平稳，有高有低，需主动把握'
      : '整体财运偏弱，以守为主，蓄势待发'

    const focusStr =
      avgScore >= 70
        ? `${peakYear?.year ?? startYear}年前后财运最旺，建议重点布局扩张性财富机会。`
        : `财运随流年波动，建议每年年初重新评估策略，灵活调整布局。`

    const cautionStr =
      lowYear && lowYear.wealthScore < 45
        ? `${lowYear.year}年（${lowYear.yearPillarStr}年）财运偏弱（${lowYear.scoreLabel}），建议减少高风险操作，优先保全资本。`
        : `本阶段整体风险可控，维持稳健操作，避免过度集中风险。`

    stages.push({
      label,
      years: `${startYear}–${startYear + years - 1}`,
      trend: trendStr,
      focus: focusStr,
      caution: cautionStr,
    })
  }

  return stages
}
