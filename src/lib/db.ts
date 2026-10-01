import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

// ─────────────────────────────────────────────────────────────────────────────
// Database singleton with Vercel support.
//
// Local/dev: SQLite file at DATABASE_URL (see .env → file:../db/custom.db).
//
// Vercel: the serverless filesystem is READ-ONLY except /tmp, and only files
// traced into the lambda bundle exist. next.config.ts includes ./db/custom.db
// via `outputFileTracingIncludes`, so on cold start we copy the bundled SQLite
// file to /tmp and point DATABASE_URL there. Reads AND writes then work for
// the demo deployment (data is per-lambda-instance and resets on redeploy).
// For production persistence, swap this file for a hosted Postgres provider
// (Prisma Accelerate / Neon / Supabase) — only db.ts + schema.prisma change.
// ─────────────────────────────────────────────────────────────────────────────

function ensureSqliteUrl(): void {
  if (process.env.DATABASE_URL) return
  if (process.env.VERCEL) {
    const bundled = path.join(process.cwd(), 'db', 'custom.db')
    const target = '/tmp/custom.db'
    try {
      if (fs.existsSync(bundled) && !fs.existsSync(target)) {
        fs.copyFileSync(bundled, target)
      }
    } catch {
      // copy failure is non-fatal — Prisma will surface a clearer error
    }
    process.env.DATABASE_URL = `file:${target}`
    return
  }
  // Local fallback mirrors .env so the app also boots without dotenv files
  process.env.DATABASE_URL = 'file:../db/custom.db'
}

ensureSqliteUrl()

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
