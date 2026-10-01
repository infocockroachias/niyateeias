import { db } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/resources — PYQs, notes, booklists, answer keys, e-books, current affairs */
export async function GET() {
  return withErrorGuard(async () => {
    const resources = await db.resource.findMany({ orderBy: [{ category: 'asc' }, { title: 'asc' }] })
    return okCached({ resources })
  }, 'Failed to load resources')
}
