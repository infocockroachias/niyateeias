import { db } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/testimonials — student voices */
export async function GET() {
  return withErrorGuard(async () => {
    const testimonials = await db.testimonial.findMany({ orderBy: { name: 'asc' } })
    return okCached({ testimonials })
  }, 'Failed to load testimonials')
}
