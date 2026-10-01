import { okCached, withErrorGuard } from '@/lib/api-utils'
import { FAQS } from '@/data/content'

/** GET /api/faq */
export async function GET() {
  return withErrorGuard(async () => {
    return okCached({ faqs: FAQS })
  }, 'Failed to load FAQs')
}
