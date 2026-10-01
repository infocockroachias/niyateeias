import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth'
import { jsonError, withErrorGuard, isEmail } from '@/lib/api-utils'

/** POST /api/auth/register — create account + session */
export async function POST(req: NextRequest) {
  return withErrorGuard(async () => {
    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return jsonError('Invalid JSON body', 400)
    }

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (name.length < 2) return jsonError('Please enter your full name.', 400)
    if (!isEmail(email)) return jsonError('Please enter a valid email address.', 400)
    if (password.length < 8) return jsonError('Password must be at least 8 characters.', 400)

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) return jsonError('An account with this email already exists — please log in.', 409)

    const user = await db.user.create({
      data: { name, email, passwordHash: hashPassword(password) },
    })
    const token = await createSession(user.id)
    await setSessionCookie(token)

    return Response.json({ user: { id: user.id, name: user.name ?? '', email: user.email } }, { status: 201 })
  }, 'Registration failed')
}
