import { NextRequest, NextResponse } from 'next/server'
import type { AnalysisInput, AnalysisResult } from '@/lib/types'
import {
  generateBaziChart,
  analyzeFiveElements,
  buildDayMasterInfo,
  calcTenGods,
  extractWealthStars,
} from '@/lib/bazi/engine'
import { buildWealthSummary, buildWealthStructure } from '@/lib/wealth/analyzer'
import { generateYearlyForecast, buildStagesSummary } from '@/lib/wealth/forecast'
import { buildAdvice, DISCLAIMER } from '@/lib/wealth/advice'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as AnalysisInput

    // ── 输入验证 ────────────────────────────
    const { gender, year, month, day, hourBranchIndex, city, range } = body

    if (!year || !month || !day) {
      return NextResponse.json({ error: '缺少必要的出生日期信息' }, { status: 400 })
    }
    if (year < 1900 || year > 2100) {
      return NextResponse.json({ error: '年份范围应在 1900–2100 之间' }, { status: 400 })
    }
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: '月份格式错误' }, { status: 400 })
    }
    if (day < 1 || day > 31) {
      return NextResponse.json({ error: '日期格式错误' }, { status: 400 })
    }

    const analysisRange = range ?? 10
    const currentYear = new Date().getFullYear()

    // ── 核心计算 ─────────────────────────────

    // 1. 生成八字命盘
    const baziChart = generateBaziChart(year, month, day, hourBranchIndex ?? -1)

    // 2. 五行分析
    const fiveElements = analyzeFiveElements(baziChart)

    // 3. 日主信息
    const dayMaster = buildDayMasterInfo(baziChart)

    // 4. 十神关系
    const tenGods = calcTenGods(baziChart)

    // 5. 财星提取
    const wealthStars = extractWealthStars(baziChart, tenGods)

    // 6. 财运摘要
    const wealthSummary = buildWealthSummary(dayMaster, wealthStars, tenGods)

    // 7. 财运结构
    const wealthStructure = buildWealthStructure(baziChart, dayMaster, wealthStars, tenGods)

    // 8. 年度预测
    const yearlyForecast = generateYearlyForecast(
      baziChart,
      dayMaster,
      currentYear,
      Math.max(10, analysisRange),
    )

    // 9. 阶段总结
    const stagesSummary = buildStagesSummary(yearlyForecast, currentYear, dayMaster)

    // 10. 建议
    const advice = buildAdvice(dayMaster, wealthStars, wealthStructure, tenGods)

    // ── 格式化出生时辰 ──────────────────────
    const shichenNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    const birthTimeLabel =
      hourBranchIndex >= 0 && hourBranchIndex < 12
        ? `${shichenNames[hourBranchIndex]}时`
        : '时辰不详'

    // ── 组装结果 ─────────────────────────────
    const result: AnalysisResult = {
      basicInfo: {
        gender: gender === 'male' ? '男' : '女',
        birthDate: `${year}年${month}月${day}日`,
        birthTime: birthTimeLabel,
        city: city || '未填写',
        analysisRange,
        currentYear,
      },
      baziChart,
      fiveElements,
      dayMaster,
      tenGods,
      wealthStars,
      wealthSummary,
      wealthStructure,
      yearlyForecast,
      stagesSummary,
      advice,
      disclaimer: DISCLAIMER,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[analyze] error:', err)
    return NextResponse.json({ error: '分析过程中发生错误，请稍后重试' }, { status: 500 })
  }
}
