import { okCached, withErrorGuard } from '@/lib/api-utils'
import { BOOKS } from '@/data/content'

/** GET /api/books — UPSC book shop */
export async function GET() {
  return withErrorGuard(async () => {
    return okCached({ books: BOOKS })
  }, 'Failed to load books')
}
