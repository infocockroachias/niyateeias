import { db } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/faq */
export async function GET() {
  return withErrorGuard(async () => {
    const faqs = await db.faq.findMany({ orderBy: { id: 'asc' } })
    return okCached({ faqs })
  }, 'Failed to load FAQs')
}
