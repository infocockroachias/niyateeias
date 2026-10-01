import { okCached, withErrorGuard } from '@/lib/api-utils'
import { PLANS } from '@/data/content'

/** GET /api/plans — AI subscription plans */
export async function GET() {
  return withErrorGuard(async () => {
    return okCached({ plans: PLANS })
  }, 'Failed to load plans')
}
