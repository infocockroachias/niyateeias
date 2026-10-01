import { db } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/rankers — successful candidates */
export async function GET() {
  return withErrorGuard(async () => {
    const rankers = await db.ranker.findMany({ orderBy: [{ year: 'desc' }, { rank: 'asc' }] })
    return okCached({ rankers })
  }, 'Failed to load rankers')
}
