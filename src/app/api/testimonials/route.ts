import { okCached, withErrorGuard } from '@/lib/api-utils'
import { TESTIMONIALS } from '@/data/content'

/** GET /api/testimonials — student voices */
export async function GET() {
  return withErrorGuard(async () => {
    return okCached({ testimonials: TESTIMONIALS })
  }, 'Failed to load testimonials')
}
