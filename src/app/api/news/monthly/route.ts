import { db } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/news/monthly — monthly digest list */
export async function GET() {
  return withErrorGuard(async () => {
    const rows = await db.monthlyNewsDigest.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    })
    return okCached({ months: rows })
  }, 'Failed to load monthly digests')
}
