import { randomBytes, createHash } from 'node:crypto'

// ─────────────────────────────────────────────────────────────────────────────
// In-memory runtime store.
//
// The platform runs on Vercel serverless, where a SQLite file cannot persist
// (read-only filesystem, ephemeral /tmp). Every read-only content library is
// frozen into src/data/content.ts instead. The few write features (enquiries,
// newsletter signups, student accounts, bookmarks, AI-generated MCQs) live
// here in module-level memory: they work fully per server instance and reset
// on redeploy — no database, no external service, nothing to configure.
//
// Swap this module for a hosted store (Postgres / Upstash / Prisma Postgres)
// when real persistence is needed — the API contracts stay identical.
// ─────────────────────────────────────────────────────────────────────────────

export interface EnquiryRecord {
  id: string
  name: string
  email: string
  phone: string
  city: string | null
  courseInterest: string | null
  mode: string | null
  stage: string | null
  message: string
  createdAt: string
}

export interface UserRecord {
  id: string
  email: string
  name: string | null
  passwordHash: string // "<saltHex>:<scryptKeyHex>" (node:crypto)
  createdAt: string
}

export interface SessionRecord {
  token: string
  userId: string
  expiresAt: number // epoch ms
}

export interface BookmarkRecord {
  id: string
  userId: string
  resourceId: string
  createdAt: string
}

export interface GeneratedMcq {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  subject: string
  difficulty: string
  createdAt: number
}

export function newId(): string {
  return `mem_${randomBytes(9).toString('hex')}`
}

function hashKey(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex').slice(0, 24)
}

const globalForMem = globalThis as unknown as {
  __niyateeMem: {
    enquiries: Map<string, EnquiryRecord>
    newsletter: Map<string, { email: string; createdAt: string }>
    usersByEmail: Map<string, UserRecord>
    usersById: Map<string, UserRecord>
    sessions: Map<string, SessionRecord>
    bookmarks: Map<string, BookmarkRecord> // key: userId:resourceId
    generatedMcqs: GeneratedMcq[]
  } | undefined
}

function store() {
  if (!globalForMem.__niyateeMem) {
    globalForMem.__niyateeMem = {
      enquiries: new Map(),
      newsletter: new Map(),
      usersByEmail: new Map(),
      usersById: new Map(),
      sessions: new Map(),
      bookmarks: new Map(),
      generatedMcqs: [],
    }
  }
  return globalForMem.__niyateeMem
}

// ─── Enquiries ───────────────────────────────────────────────────────────────

export function saveEnquiry(input: Omit<EnquiryRecord, 'id' | 'createdAt'>): EnquiryRecord {
  const record: EnquiryRecord = {
    ...input,
    id: newId(),
    createdAt: new Date().toISOString(),
  }
  store().enquiries.set(record.id, record)
  // Busiest leads surface in the server logs for follow-up
  console.log(`[mem-store] enquiry #${record.id}: ${record.name} <${record.email}> (${record.phone})`)
  return record
}

// ─── Newsletter ──────────────────────────────────────────────────────────────

export function subscribeNewsletter(email: string): void {
  const key = hashKey(email)
  const s = store()
  if (!s.newsletter.has(key)) {
    s.newsletter.set(key, { email, createdAt: new Date().toISOString() })
    console.log(`[mem-store] newsletter subscriber: ${email}`)
  }
}

// ─── Users & sessions ────────────────────────────────────────────────────────

export function findUserByEmail(email: string): UserRecord | undefined {
  return store().usersByEmail.get(hashKey(email))
}

export function findUserById(id: string): UserRecord | undefined {
  return store().usersById.get(id)
}

export function createUser(email: string, name: string | null, passwordHash: string): UserRecord {
  const user: UserRecord = {
    id: newId(),
    email: email.trim().toLowerCase(),
    name,
    passwordHash,
    createdAt: new Date().toISOString(),
  }
  const s = store()
  s.usersByEmail.set(hashKey(user.email), user)
  s.usersById.set(user.id, user)
  return user
}

export function saveSession(userId: string, token: string, expiresAt: number): void {
  store().sessions.set(token, { token, userId, expiresAt })
}

export function getSession(token: string): SessionRecord | undefined {
  const session = store().sessions.get(token)
  if (!session) return undefined
  if (session.expiresAt < Date.now()) {
    store().sessions.delete(token)
    return undefined
  }
  return session
}

export function deleteSession(token: string): void {
  store().sessions.delete(token)
}

// ─── Bookmarks ───────────────────────────────────────────────────────────────

export function listBookmarks(userId: string): BookmarkRecord[] {
  return [...store().bookmarks.values()]
    .filter((b) => b.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function upsertBookmark(userId: string, resourceId: string): BookmarkRecord {
  const key = `${userId}:${resourceId}`
  const s = store()
  const existing = s.bookmarks.get(key)
  if (existing) return existing
  const record: BookmarkRecord = {
    id: newId(),
    userId,
    resourceId,
    createdAt: new Date().toISOString(),
  }
  s.bookmarks.set(key, record)
  return record
}

export function removeBookmark(userId: string, resourceId: string): boolean {
  return store().bookmarks.delete(`${userId}:${resourceId}`)
}

// ─── AI-generated MCQ bank (runtime additions) ───────────────────────────────

export function addGeneratedMcqs(questions: Omit<GeneratedMcq, 'id' | 'createdAt'>[]): void {
  const s = store()
  for (const q of questions) {
    s.generatedMcqs.unshift({ ...q, id: newId(), createdAt: Date.now() })
  }
  // keep the runtime bank bounded
  if (s.generatedMcqs.length > 500) s.generatedMcqs.length = 500
}

export function listGeneratedMcqs(subject: string, difficulty: string, count: number): GeneratedMcq[] {
  return store()
    .generatedMcqs.filter((q) => q.subject === subject && q.difficulty === difficulty)
    .slice(0, count)
}
