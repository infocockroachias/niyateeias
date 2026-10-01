import { NextRequest } from 'next/server'
import { db, parseJsonArray } from '@/lib/db'
import { withErrorGuard } from '@/lib/api-utils'
import { getLiveWire, istTodayIso, type LiveWire } from '@/lib/news-live'

function parseMainsQuestion(raw: string | null): { text: string; marks: number; words: number; directive?: string } | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { text?: string; marks?: number; words?: number; directive?: string }
    if (!parsed?.text) return null
    return { text: String(parsed.text), marks: Number(parsed.marks) || 10, words: Number(parsed.words) || 150, directive: parsed.directive }
  } catch {
    return null
  }
}

/**
 * GET /api/news/today — Today's Current Affairs (IST date).
 * Returns: { date, brief: StructuredNewsArticle[], live: LiveWire | null, sources: string[] }
 * `brief` = exam-structured curated articles dated today (from the DB).
 * `live`  = raw headlines fetched live from The Hindu RSS wires (best-effort).
 */
export async function GET(_req: NextRequest) {
  return withErrorGuard(async () => {
    const date = istTodayIso()

    const rows = await db.newsArticle.findMany({
      where: { date },
      orderBy: [{ gsTag: 'asc' }, { createdAt: 'asc' }],
      take: 30,
    })

    const brief = rows.map((a) => ({
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
    }))

    let live: LiveWire | null = null
    try {
      live = await getLiveWire()
    } catch {
      live = null
    }

    return Response.json(
      {
        date,
        brief,
        live,
        sources: ['The Hindu — National / World / Business / Editorial', 'Indian Express', 'PIB', 'Yojana'],
      },
      { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' } }
    )
  }, "Failed to load today's current affairs")
}
