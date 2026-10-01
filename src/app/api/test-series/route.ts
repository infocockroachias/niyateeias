import { db, parseJsonArray } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/test-series */
export async function GET() {
  return withErrorGuard(async () => {
    const rows = await db.testSeries.findMany({ orderBy: { priceInr: 'desc' } })
    return okCached({
      series: rows.map((s) => ({ ...s, features: parseJsonArray(s.featuresJson) })),
    })
  }, 'Failed to load test series')
}
