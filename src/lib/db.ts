import { PrismaClient } from '@prisma/client'

// ─────────────────────────────────────────────────────────────────────────────
// Vercel compatibility note:
// The SQLite file DB (db/custom.db) is ephemeral on serverless platforms like
// Vercel — Prisma must be cached across hot reloads in development and reused
// across invocations to avoid exhausting connections. This singleton pattern
// (globalThis cache) is the recommended approach for serverless/edge deploys.
// On Vercel, the database should be swapped for a hosted provider (Postgres via
// Prisma Accelerate or similar); only this file needs to change.
// ─────────────────────────────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// ─── JSON field helpers (SQLite stores lists as JSON strings) ────────────────

/** Parse a JSON string[] column, tolerating null/undefined and bad JSON. */
export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

/** Serialize a string[] into the JSON string format used by list columns. */
export function stringifyJsonArray(value: string[]): string {
  return JSON.stringify(value ?? [])
}
