import { db } from '@/lib/db'
import { okCached, withErrorGuard } from '@/lib/api-utils'

/** GET /api/stats — platform stats computed from real data */
export async function GET() {
  return withErrorGuard(async () => {
    const [resourceCount, articleCount, courseCount, mcqCount] = await Promise.all([
      db.resource.count(),
      db.newsArticle.count(),
      db.course.count(),
      db.mcqQuestion.count(),
    ])

    const stats = [
      { label: 'Years of PYQs with detailed solutions, on screen', value: '10', suffix: '+' },
      { label: 'Modes of coaching: offline, live online, recorded', value: '3', suffix: '' },
      { label: 'Current affairs articles in the archive', value: String(articleCount), suffix: '+' },
      { label: 'Mentor-curated study resources', value: String(resourceCount), suffix: '+' },
      { label: 'Expert-crafted programs across UPSC & OPSC', value: String(courseCount), suffix: '' },
      { label: 'Prelims MCQs in the practice bank', value: String(mcqCount), suffix: '+' },
      { label: 'Working-hours response time on enquiries', value: '2', suffix: ' hrs' },
    ]
    return okCached({ stats })
  }, 'Failed to load stats')
}
