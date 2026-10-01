import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import {
  saveSession,
  getSession,
  deleteSession,
  findUserById,
} from '@/lib/mem-store'

// ─────────────────────────────────────────────────────────────────────────────
// Auth utilities — scrypt password hashing + memory-backed cookie sessions.
// Cookie contract:
//   name: "niyatee_session", httpOnly, sameSite=lax, secure in production,
//   30-day expiry. Sessions live in the in-memory store (src/lib/mem-store.ts)
//   because the platform runs on serverless hosts where a database file
//   cannot persist. Swapping mem-store for a hosted store keeps this file's
//   public API unchanged.
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

/** Persist a new session in the in-memory store. Returns the raw token. */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  saveSession(userId, token, expiresAt)
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

    const session = getSession(token)
    if (!session) return null

    const user = findUserById(session.userId)
    if (!user) return null

    return {
      id: user.id,
      name: user.name ?? '',
      email: user.email,
    }
  } catch {
    return null
  }
}

/** Delete the session backing the current cookie (if any) and clear the cookie. */
export async function destroyCurrentSession(): Promise<void> {
  try {
    const store = await cookies()
    const token = store.get(SESSION_COOKIE_NAME)?.value
    if (token) {
      deleteSession(token)
    }
  } catch {
    // ignore
  }
  await clearSessionCookie()
}
