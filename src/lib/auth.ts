import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

// ─────────────────────────────────────────────────────────────────────────────
// Auth utilities — scrypt password hashing + DB-backed cookie sessions.
// Cookie contract (worklog API CONTRACT):
//   name: "niyatee_session", httpOnly, sameSite=lax, secure in production,
//   30-day expiry. Sessions are persisted in the Session table.
// ─────────────────────────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = 'niyatee_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

// ─── Password hashing (node:crypto scrypt) ───────────────────────────────────

const SCRYPT_KEYLEN = 64

/** Hash a plaintext password with scrypt. Returns "<saltHex>:<keyHex>". */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex')
  return `${salt}:${derived}`
}

/** Constant-time verification of a plaintext password against a stored hash. */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [saltHex, keyHex] = stored.split(':')
    if (!saltHex || !keyHex) return false
    const derived = scryptSync(password, saltHex, SCRYPT_KEYLEN)
    const storedKey = Buffer.from(keyHex, 'hex')
    if (storedKey.length !== derived.length) return false
    return timingSafeEqual(derived, storedKey)
  } catch {
    return false
  }
}

// ─── Session tokens ──────────────────────────────────────────────────────────

/** Generate a cryptographically random session token (64 hex chars). */
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

/** Persist a new session row for the user. Returns the raw token. */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)
  await db.session.create({ data: { token, userId, expiresAt } })
  return token
}

// ─── Cookie helpers (next/headers cookies()) ─────────────────────────────────

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  })
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  })
}

// ─── Session resolution ──────────────────────────────────────────────────────

export interface SessionUser {
  id: string
  name: string
  email: string
}

/**
 * Resolve the current logged-in user from the session cookie.
 * Returns null when no/invalid/expired session. Safe to call in Route Handlers.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const store = await cookies()
    const token = store.get(SESSION_COOKIE_NAME)?.value
    if (!token) return null

    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    })
    if (!session) return null
    if (session.expiresAt.getTime() < Date.now()) {
      // Expired — best-effort cleanup so the table stays tidy.
      await db.session.delete({ where: { id: session.id } }).catch(() => undefined)
      return null
    }

    return {
      id: session.user.id,
      name: session.user.name ?? '',
      email: session.user.email,
    }
  } catch {
    return null
  }
}

/** Delete the session row backing the current cookie (if any) and clear the cookie. */
export async function destroyCurrentSession(): Promise<void> {
  try {
    const store = await cookies()
    const token = store.get(SESSION_COOKIE_NAME)?.value
    if (token) {
      await db.session.deleteMany({ where: { token } }).catch(() => undefined)
    }
  } catch {
    // ignore
  }
  await clearSessionCookie()
}
