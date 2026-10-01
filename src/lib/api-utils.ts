import { NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// Shared API route utilities: consistent JSON shapes, cache headers, robust
// parsing of LLM output (strict-JSON extraction with markdown-fence stripping).
// ─────────────────────────────────────────────────────────────────────────────

/** Cache-friendly headers for public GET list endpoints. */
export const CACHE_HEADERS: Record<string, string> = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export function okCached<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: CACHE_HEADERS })
}

export function jsonError(message: string, status = 500): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

/** Wrap a handler so unexpected throws become a 500 {error} response. */
export async function withErrorGuard<T>(
  handler: () => Promise<Response>,
  fallbackMessage = 'Internal server error'
): Promise<Response> {
  try {
    return await handler()
  } catch (err) {
    console.error('[api]', fallbackMessage, err)
    return jsonError(fallbackMessage, 500)
  }
}

// ─── LLM output parsing ──────────────────────────────────────────────────────

/**
 * Robustly extract the first JSON object/array from raw LLM text.
 * Strips markdown code fences, prose before/after, and trailing commas.
 * Returns null when no valid JSON can be recovered.
 */
export function extractJson(raw: string): unknown | null {
  if (!raw) return null
  let text = raw.trim()

  // Strip ```json ... ``` / ``` ... ``` fences (take the largest block if several)
  const fenceMatches = [...text.matchAll(/```(?:json|JSON)?\s*([\s\S]*?)```/g)]
  if (fenceMatches.length > 0) {
    text = fenceMatches
      .map((m) => m[1])
      .sort((a, b) => b.length - a.length)[0]
      .trim()
  }

  // Direct parse first
  try {
    return JSON.parse(text)
  } catch {
    // fall through to bracket slicing
  }

  // Slice from the first opening bracket to the last matching close
  const objStart = text.indexOf('{')
  const arrStart = text.indexOf('[')
  let start = -1
  let open = '{'
  let close = '}'
  if (objStart !== -1 && (arrStart === -1 || objStart < arrStart)) {
    start = objStart
  } else if (arrStart !== -1) {
    start = arrStart
    open = '['
    close = ']'
  }
  if (start === -1) return null

  const end = text.lastIndexOf(close)
  if (end <= start) return null
  let candidate = text.slice(start, end + 1)

  // Remove trailing commas before } or ]
  candidate = candidate.replace(/,\s*([}\]])/g, '$1')

  try {
    return JSON.parse(candidate)
  } catch {
    return null
  }
}

/** Clamp a number into [min, max] with a default on non-finite input. */
export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

/** Validate an email address (simple RFC-ish check). */
export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}
