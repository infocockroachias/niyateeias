import { okCached, withErrorGuard } from '@/lib/api-utils'
import { MONTHLY_DIGESTS } from '@/data/content'

/** GET /api/news/monthly — monthly digest list */
export async function GET() {
  return withErrorGuard(async () => {
    return okCached({ months: MONTHLY_DIGESTS })
  }, 'Failed to load monthly digests')
}
