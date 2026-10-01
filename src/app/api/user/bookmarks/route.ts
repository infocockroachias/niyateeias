import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { jsonError, withErrorGuard } from '@/lib/api-utils'

/** GET /api/user/bookmarks — list the signed-in user's saved resources */
export async function GET() {
  return withErrorGuard(async () => {
    const user = await getSessionUser()
    if (!user) return jsonError('Please log in to view your bookmarks.', 401)

    const bookmarks = await db.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, resourceId: true, createdAt: true },
    })
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

    const resource = await db.resource.findUnique({ where: { id: resourceId } })
    if (!resource) return jsonError('Resource not found.', 404)

    const bookmark = await db.bookmark.upsert({
      where: { userId_resourceId: { userId: user.id, resourceId } },
      update: {},
      create: { userId: user.id, resourceId },
      select: { id: true, resourceId: true, createdAt: true },
    })
    return Response.json({ bookmark }, { status: 201 })
  }, 'Failed to save bookmark')
}
