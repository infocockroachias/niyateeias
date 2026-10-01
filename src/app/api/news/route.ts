import { NextRequest } from 'next/server'
import { db, parseJsonArray } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'
import type { Prisma } from '@prisma/client'

/** GET /api/news — supports ?date=YYYY-MM-DD | ?month=1..12&year=YYYY | default: last 30 days */
export async function GET(req: NextRequest) {
  return withErrorGuard(async () => {
    const sp = req.nextUrl.searchParams
    const date = sp.get('date')
    const month = sp.get('month')
    const year = sp.get('year')

    const parseMainsQuestion = (raw: string | null): { text: string; marks: number; words: number; directive?: string } | null => {
      if (!raw) return null
      try {
        const parsed = JSON.parse(raw) as { text?: string; marks?: number; words?: number; directive?: string }
        if (!parsed?.text) return null
        return { text: String(parsed.text), marks: Number(parsed.marks) || 10, words: Number(parsed.words) || 150, directive: parsed.directive }
      } catch {
        return null
      }
    }

    const toArticle = (a: {
      id: string
      title: string
      summary: string
      content: string
      source: string
      gsTag: string
      subject: string
      date: string
      readMinutes: number
      tagsJson: string
      prelimsJson: string | null
      mainsJson: string | null
      keywordsJson: string | null
      mainsQuestionJson: string | null
    }) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      content: a.content,
      source: a.source,
      gsTag: a.gsTag,
      subject: a.subject,
      date: a.date,
      readMinutes: a.readMinutes,
      tags: parseJsonArray(a.tagsJson),
      prelims: parseJsonArray(a.prelimsJson),
      mains: parseJsonArray(a.mainsJson),
      keywords: parseJsonArray(a.keywordsJson),
      mainsQuestion: parseMainsQuestion(a.mainsQuestionJson),
    })

    let where: Prisma.NewsArticleWhereInput

    if (date) {
      where = { date }
    } else if (month && year) {
      const m = Number(month)
      const y = Number(year)
      if (!Number.isFinite(m) || !Number.isFinite(y) || m < 1 || m > 12) {
        where = {}
      } else {
        const start = `${y}-${String(m).padStart(2, '0')}-01`
        const endDate = new Date(y, m, 0)
        const end = endDate.toISOString().slice(0, 10)
        where = { date: { gte: start, lte: end } }
      }
    } else {
      const from = new Date()
      from.setDate(from.getDate() - 30)
      where = { date: { gte: from.toISOString().slice(0, 10) } }
    }

    const [articles, allInRange] = await Promise.all([
      db.newsArticle.findMany({ where, orderBy: [{ date: 'desc' }, { title: 'asc' }], take: 120 }),
      db.newsArticle.findMany({ where, select: { date: true } }),
    ])
    // note: findMany returns the full row; the selector above is intentionally
    // limited to `date` for counting, while `articles` carries every column
    // (including the structured curation JSON fields).

    const countByDate = new Map<string, number>()
    for (const row of allInRange) {
      countByDate.set(row.date, (countByDate.get(row.date) ?? 0) + 1)
    }
    const days = [...countByDate.entries()]
      .map(([d, count]) => ({ date: d, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return okCached({ days, articles: articles.map(toArticle) })
  }, 'Failed to load news')
}
