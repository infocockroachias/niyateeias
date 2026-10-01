import { NextRequest } from 'next/server'
import { upsertBookmark, listBookmarks } from '@/lib/mem-store'
import { getSessionUser } from '@/lib/auth'
import { jsonError, withErrorGuard } from '@/lib/api-utils'
import { RESOURCES } from '@/data/content'

/** GET /api/user/bookmarks — list the signed-in user's saved resources */
export async function GET() {
  return withErrorGuard(async () => {
    const user = await getSessionUser()
    if (!user) return jsonError('Please log in to view your bookmarks.', 401)

    const bookmarks = listBookmarks(user.id).map((b) => ({
      id: b.id,
      resourceId: b.resourceId,
      createdAt: b.createdAt,
    }))
    return Response.json({ bookmarks })
  }, 'Failed to load bookmarks')
}

/** POST /api/user/bookmarks — save a resource */
export async function POST(req: NextRequest) {
  return withErrorGuard(async () => {
    const user = await getSessionUser()
    if (!user) return jsonError('Please log in to save resources.', 401)

    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return jsonError('Invalid JSON body', 400)
    }
    const resourceId = typeof body.resourceId === 'string' ? body.resourceId.trim() : ''
    if (!resourceId) return jsonError('resourceId is required.', 400)

    // Accept both an id and a slug: the library is in-memory, so resolve the
    // resource against the static dataset (slug match keeps old links working).
    const exists =
      RESOURCES.some((r) => r.id === resourceId) || RESOURCES.some((r) => r.slug === resourceId)
    if (!exists) return jsonError('Resource not found.', 404)

    const bookmark = upsertBookmark(user.id, resourceId)
    return Response.json(
      { bookmark: { id: bookmark.id, resourceId: bookmark.resourceId, createdAt: bookmark.createdAt } },
      { status: 201 }
    )
  }, 'Failed to save bookmark')
}

