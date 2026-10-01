import { db, parseJsonArray } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/plans — AI subscription plans */
export async function GET() {
  return withErrorGuard(async () => {
    const rows = await db.plan.findMany({ orderBy: { priceInr: 'asc' } })
    return okCached({ plans: rows.map((p) => ({ ...p, features: parseJsonArray(p.featuresJson) })) })
  }, 'Failed to load plans')
}
