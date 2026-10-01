import { NextRequest } from 'next/server'
import { okCached, withErrorGuard } from '@/lib/api-utils'
import { NEWS_ARTICLES, LATEST_NEWS_DATE } from '@/data/content'

/** GET /api/news — supports ?date=YYYY-MM-DD | ?month=1..12&year=YYYY | default: latest 30 days of the archive */
export async function GET(req: NextRequest) {
  return withErrorGuard(async () => {
    const sp = req.nextUrl.searchParams
    const date = sp.get('date')
    const month = sp.get('month')
    const year = sp.get('year')

    let from: string | null = null
    let to: string | null = null

    if (date) {
      from = date
      to = date
    } else if (month && year) {
      const m = Number(month)
      const y = Number(year)
      if (Number.isFinite(m) && Number.isFinite(y) && m >= 1 && m <= 12) {
        from = `${y}-${String(m).padStart(2, '0')}-01`
        to = new Date(y, m, 0).toISOString().slice(0, 10)
      }
    } else {
      // The archive is a frozen editorial library, so "recent" is anchored to
      // the latest edition date rather than the server wall clock. This keeps
      // the default view (and the archive calendar) fully populated on any
      // host, including serverless deployments.
      if (LATEST_NEWS_DATE) {
        const d = new Date(`${LATEST_NEWS_DATE}T00:00:00Z`)
        d.setUTCDate(d.getUTCDate() - 30)
        from = d.toISOString().slice(0, 10)
      }
    }

    const inRange = NEWS_ARTICLES.filter((a) => {
      if (from && a.date < from) return false
      if (to && a.date > to) return false
      return true
    })

    const articles = [...inRange]
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
      .slice(0, 120)

    const countByDate = new Map<string, number>()
    for (const row of inRange) {
      countByDate.set(row.date, (countByDate.get(row.date) ?? 0) + 1)
    }
    const days = [...countByDate.entries()]
      .map(([d, count]) => ({ date: d, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return okCached({ days, articles })
  }, 'Failed to load news')
}
