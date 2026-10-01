import { okCached, withErrorGuard } from '@/lib/api-utils'
import { RANKERS } from '@/data/content'

/** GET /api/rankers — successful candidates */
export async function GET() {
  return withErrorGuard(async () => {
    return okCached({ rankers: RANKERS })
  }, 'Failed to load rankers')
}
