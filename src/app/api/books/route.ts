import { db } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/books — UPSC book shop */
export async function GET() {
  return withErrorGuard(async () => {
    const books = await db.book.findMany({ orderBy: { title: 'asc' } })
    return okCached({ books })
  }, 'Failed to load books')
}
