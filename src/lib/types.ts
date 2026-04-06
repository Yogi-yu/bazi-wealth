// ─────────────────────────────────────────
// 基础类型
// ─────────────────────────────────────────

export type Element = '木' | '火' | '土' | '金' | '水'
export type Polarity = '阳' | '阴'
export type TenGod =
  | '比肩'
  | '劫财'
  | '食神'
  | '伤官'
  | '偏财'
  | '正财'
  | '七杀'
  | '正官'
  | '偏印'
  | '正印'
export type DayMasterStrength = '极强' | '强' | '中和' | '弱' | '极弱'
export type WealthGrade = 'S' | 'A' | 'B' | 'C'
export type OpportunityLevel = '高' | '中' | '低'
export type RiskLevel = '高' | '中' | '低'

// ─────────────────────────────────────────
// 天干地支
// ─────────────────────────────────────────

export interface Stem {
  index: number     // 0–9
  char: string      // 甲乙丙...
  element: Element
  polarity: Polarity
}

export interface Branch {
  index: number     // 0–11
  char: string      // 子丑寅...
  element: Element
  polarity: Polarity
  mainQiStemIndex: number  // 藏干主气
}

export interface Pillar {
  stem: Stem
  branch: Branch
  label: string   // 年柱 / 月柱 / 日柱 / 时柱
  tenGod?: TenGod // 相对于日主的十神（日柱本身为空）
}

// ─────────────────────────────────────────
// 命盘结构
// ─────────────────────────────────────────

export interface BaziChart {
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar
}

export interface FiveElementCount {
  木: number
  火: number
  土: number
  金: number
  水: number
}

export interface FiveElementAnalysis {
  counts: FiveElementCount
  dominant: Element
  lacking: Element | null
  wealthElement: Element
  wealthElementCount: number
}

export interface DayMasterInfo {
  stem: Stem
  strength: DayMasterStrength
  strengthScore: number  // 内部评分，用于判断强弱
  wealthElement: Element
  strengthDescription: string
}

export interface TenGodMap {
  yearStem: TenGod
  yearBranch: TenGod
  monthStem: TenGod
  monthBranch: TenGod
  hourStem: TenGod
  hourBranch: TenGod
}

// ─────────────────────────────────────────
// 财星分析
// ─────────────────────────────────────────

export interface WealthStar {
  type: '正财' | '偏财'
  location: 'stem' | 'branch'
  pillar: string
  strength: number  // 0–100
}

// ─────────────────────────────────────────
// 财运结构
// ─────────────────────────────────────────

export interface WealthSummary {
  grade: WealthGrade
  gradeLabel: string
  overallDescription: string
  styleTags: string[]
  keywords: string[]
  wealthStyleType: '正财主导' | '偏财主导' | '财星并重' | '财星偏弱'
}

export interface WealthStructure {
  directWealthScore: number       // 0–100，正财倾向
  indirectWealthScore: number     // 0–100，偏财倾向
  wealthStarFavorable: boolean    // 财星是否得用
  dayMasterVsWealth: string       // 身财关系描述
  suitedWealthPaths: string[]
  unsuitedWealthPaths: string[]
  structureAnalysis: string       // 完整分析段落
}

// ─────────────────────────────────────────
// 年度预测
// ─────────────────────────────────────────

export interface YearForecast {
  year: number
  yearPillarStr: string         // 如 "甲子"
  yearTenGod: TenGod
  wealthScore: number           // 0–100
  opportunityLevel: OpportunityLevel
  riskLevel: RiskLevel
  scoreLabel: '旺财年' | '进财年' | '平稳年' | '谨慎年' | '回避年'
  description: string
}

// ─────────────────────────────────────────
// 阶段总结
// ─────────────────────────────────────────

export interface StageSummary {
  label: string      // 近1年 / 近3年 / 近5年
  years: string
  trend: string
  focus: string
  caution: string
}

// ─────────────────────────────────────────
// 建议
// ─────────────────────────────────────────

export interface Advice {
  suitableApproaches: string[]
  unsuitableApproaches: string[]
  collaborationAdvice: string
  investmentStyle: string
  riskControlPoints: string[]
}

// ─────────────────────────────────────────
// 完整分析结果
// ─────────────────────────────────────────

export interface AnalysisResult {
  basicInfo: {
    gender: string
    birthDate: string
    birthTime: string
    city: string
    analysisRange: number
    currentYear: number
  }
  baziChart: BaziChart
  fiveElements: FiveElementAnalysis
  dayMaster: DayMasterInfo
  tenGods: TenGodMap
  wealthStars: WealthStar[]
  wealthSummary: WealthSummary
  wealthStructure: WealthStructure
  yearlyForecast: YearForecast[]
  stagesSummary: StageSummary[]
  advice: Advice
  disclaimer: string
  generatedAt: string
}

// ─────────────────────────────────────────
// API 输入
// ─────────────────────────────────────────

export interface AnalysisInput {
  gender: 'male' | 'female'
  year: number
  month: number
  day: number
  hourBranchIndex: number   // 0–11 对应子丑寅卯辰巳午未申酉戌亥，-1 表示不知道
  city: string
  range: number             // 分析年数：1 / 3 / 5 / 10
}
