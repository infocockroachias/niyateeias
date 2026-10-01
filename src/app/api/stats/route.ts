import { okCached, withErrorGuard } from '@/lib/api-utils'
import { RESOURCES, NEWS_ARTICLES, COURSES, MCQ_BANK } from '@/data/content'

/** GET /api/stats — platform stats computed from the in-memory library */
export async function GET() {
  return withErrorGuard(async () => {
    const stats = [
      { label: 'Years of PYQs with detailed solutions, on screen', value: '10', suffix: '+' },
      { label: 'Modes of coaching: offline, live online, recorded', value: '3', suffix: '' },
      { label: 'Current affairs articles in the archive', value: String(NEWS_ARTICLES.length), suffix: '+' },
      { label: 'Mentor-curated study resources', value: String(RESOURCES.length), suffix: '+' },
      { label: 'Expert-crafted programs across UPSC & OPSC', value: String(COURSES.length), suffix: '' },
      { label: 'Prelims MCQs in the practice bank', value: String(MCQ_BANK.length), suffix: '+' },
      { label: 'Working-hours response time on enquiries', value: '2', suffix: ' hrs' },
    ]
    return okCached({ stats })
  }, 'Failed to load stats')
}
