import { NextRequest } from 'next/server'
import { withErrorGuard } from '@/lib/api-utils'
import { NEWS_ARTICLES, LATEST_NEWS_DATE } from '@/data/content'
import { getLiveWire, type LiveWire } from '@/lib/news-live'

/**
 * GET /api/news/today — Today's Current Affairs (edition-based).
 * Returns: { date, brief: StructuredNewsArticle[], live: LiveWire | null, sources: string[] }
 * `date`  = the current brief edition (latest curated article date in the archive)
 * `brief` = exam-structured curated articles for that edition, served from the
 *           in-memory editorial library (zero database dependency)
 * `live`  = raw headlines fetched live from The Hindu RSS wires (best-effort)
 */
export async function GET(_req: NextRequest) {
  return withErrorGuard(async () => {
    const date = LATEST_NEWS_DATE ?? ''

    const brief = NEWS_ARTICLES.filter((a) => a.date === date && (a.prelims.length > 0 || a.mains.length > 0))
      .slice(0, 30)
      .map((a) => ({
        id: a.id,
        title: a.title,
        summary: a.summary,
        content: a.content,
        source: a.source,
        gsTag: a.gsTag,
        subject: a.subject,
        date: a.date,
        readMinutes: a.readMinutes,
        tags: a.tags,
        prelims: a.prelims,
        mains: a.mains,
        keywords: a.keywords,
        mainsQuestion: a.mainsQuestion,
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
        sources: ['The Hindu, National / World / Business / Editorial', 'Indian Express', 'PIB', 'Yojana'],
      },
      { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' } }
    )
  }, "Failed to load today's current affairs")
}
