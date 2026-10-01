import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { jsonError, withErrorGuard, isEmail } from '@/lib/api-utils'

/** POST /api/newsletter — weekly newsletter subscription */
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

    await db.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })
    return Response.json({ ok: true }, { status: 201 })
  }, 'Failed to subscribe')
}
