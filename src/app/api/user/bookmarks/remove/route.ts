import { NextRequest } from 'next/server'
import { removeBookmark } from '@/lib/mem-store'
import { getSessionUser } from '@/lib/auth'
import { jsonError, withErrorGuard } from '@/lib/api-utils'

/** POST /api/user/bookmarks/remove — unsave a resource */
export async function POST(req: NextRequest) {
  return withErrorGuard(async () => {
    const user = await getSessionUser()
    if (!user) return jsonError('Please log in to manage bookmarks.', 401)

    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return jsonError('Invalid JSON body', 400)
    }
    const resourceId = typeof body.resourceId === 'string' ? body.resourceId.trim() : ''
    if (!resourceId) return jsonError('resourceId is required.', 400)

    removeBookmark(user.id, resourceId)
    return Response.json({ ok: true })
  }, 'Failed to remove bookmark')
}
