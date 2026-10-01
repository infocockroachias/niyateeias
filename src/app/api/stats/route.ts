import { db } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/stats — platform stats computed from real data */
export async function GET() {
  return withErrorGuard(async () => {
    const [rankerCount, resourceCount, articleCount, courseCount, mcqCount] = await Promise.all([
      db.ranker.count(),
      db.resource.count(),
      db.newsArticle.count(),
      db.course.count(),
      db.mcqQuestion.count(),
    ])

    const stats = [
      { label: 'Successful selections in IAS & allied services', value: String(Math.max(100, rankerCount)), suffix: '+' },
      { label: 'Years of PYQs with detailed solutions', value: '10', suffix: '+' },
      { label: 'Modes of coaching — offline, live online, recorded', value: '3', suffix: '' },
      { label: 'Current affairs articles in the archive', value: String(articleCount), suffix: '+' },
      { label: 'Mentor-curated study resources', value: String(resourceCount), suffix: '+' },
      { label: 'Expert-crafted programs across UPSC & OPSC', value: String(courseCount), suffix: '' },
      { label: 'Prelims MCQs in the practice bank', value: String(mcqCount), suffix: '+' },
      { label: 'Working-hours response time on enquiries', value: '2', suffix: ' hrs' },
    ]
    return okCached({ stats })
  }, 'Failed to load stats')
}
