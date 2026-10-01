import { NextRequest } from 'next/server'
import { db, parseJsonArray } from '@/lib/db'
import { okCached, jsonError, withErrorGuard } from '@/lib/api-utils'

export async function GET(req: NextRequest) {
  return withErrorGuard(async () => {
    const slug = req.nextUrl.searchParams.get('slug')

    const shape = (c: { featuresJson: string; syllabusJson: string } & Record<string, unknown>) => ({
      ...c,
      features: parseJsonArray(c.featuresJson as string),
      syllabusHighlights: parseJsonArray(c.syllabusJson as string),
    })

    if (slug) {
      const course = await db.course.findUnique({ where: { slug } })
      if (!course) return jsonError('Course not found', 404)
      return okCached({ course: shape(course) })
    }

    const courses = await db.course.findMany({ orderBy: [{ featured: 'desc' }, { feeInr: 'asc' }] })
    return okCached({ courses: courses.map(shape) })
  }, 'Failed to load courses')
}
