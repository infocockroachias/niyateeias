import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth'
import { jsonError, withErrorGuard } from '@/lib/api-utils'

/** POST /api/auth/login */
export async function POST(req: NextRequest) {
  return withErrorGuard(async () => {
    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return jsonError('Invalid JSON body', 400)
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!email || !password) return jsonError('Email and password are required.', 400)

    const user = await db.user.findUnique({ where: { email } })
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return jsonError('Incorrect email or password.', 401)
    }

    const token = await createSession(user.id)
    await setSessionCookie(token)
    return Response.json({ user: { id: user.id, name: user.name ?? '', email: user.email } })
  }, 'Login failed')
}
