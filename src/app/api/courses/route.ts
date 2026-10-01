import { NextRequest } from 'next/server'
import { okCached, jsonError, withErrorGuard } from '@/lib/api-utils'
import { COURSES } from '@/data/content'

/** GET /api/courses — programs list, or ?slug= for a single course */
export async function GET(req: NextRequest) {
  return withErrorGuard(async () => {
    const slug = req.nextUrl.searchParams.get('slug')

    if (slug) {
      const course = COURSES.find((c) => c.slug === slug)
      if (!course) return jsonError('Course not found', 404)
      return okCached({ course })
    }

    return okCached({ courses: COURSES })
  }, 'Failed to load courses')
}
