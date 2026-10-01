import { okCached, withErrorGuard } from '@/lib/api-utils'
import { RESOURCES } from '@/data/content'

/** GET /api/resources — PYQs, notes, booklists, answer keys, e-books, current affairs */
export async function GET() {
  return withErrorGuard(async () => {
    return okCached({ resources: RESOURCES })
  }, 'Failed to load resources')
}
