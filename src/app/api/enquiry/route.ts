import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { jsonError, withErrorGuard, isEmail } from '@/lib/api-utils'

/** POST /api/enquiry — admissions enquiry */
export async function POST(req: NextRequest) {
  return withErrorGuard(async () => {
    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return jsonError('Invalid JSON body', 400)
    }

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const city = typeof body.city === 'string' ? body.city.trim() : null
    const courseInterest = typeof body.courseInterest === 'string' ? body.courseInterest.trim() : null
    const mode = typeof body.mode === 'string' ? body.mode.trim() : null
    const stage = typeof body.stage === 'string' ? body.stage.trim() : null

    if (name.length < 2) return jsonError('Please enter your full name.', 400)
    if (!isEmail(email)) return jsonError('Please enter a valid email address.', 400)
    if (!/^[0-9+\-\s]{10,15}$/.test(phone)) return jsonError('Please enter a valid 10-digit mobile number.', 400)
    if (message.length < 5) return jsonError('Please tell us briefly what you need help with.', 400)
    if (message.length > 600) return jsonError('Message is too long (max 50 words).', 400)

    const enquiry = await db.enquiry.create({
      data: { name, email, phone, city, courseInterest, mode, stage, message },
    })
    return Response.json({ ok: true, id: enquiry.id }, { status: 201 })
  }, 'Failed to submit enquiry')
}
