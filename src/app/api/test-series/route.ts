import { okCached, withErrorGuard } from '@/lib/api-utils'
import { TEST_SERIES } from '@/data/content'

/** GET /api/test-series */
export async function GET() {
  return withErrorGuard(async () => {
    return okCached({ series: TEST_SERIES })
  }, 'Failed to load test series')
}
