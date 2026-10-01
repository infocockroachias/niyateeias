import { NextRequest } from 'next/server'
import { subscribeNewsletter } from '@/lib/mem-store'
import { jsonError, withErrorGuard, isEmail } from '@/lib/api-utils'

/** POST /api/newsletter — weekly newsletter subscription (stored in memory) */
export async function POST(req: NextRequest) {
  return withErrorGuard(async () => {
    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return jsonError('Invalid JSON body', 400)
    }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!isEmail(email)) return jsonError('Please enter a valid email address.', 400)

    subscribeNewsletter(email)
    return Response.json({ ok: true }, { status: 201 })
  }, 'Failed to subscribe')
}
