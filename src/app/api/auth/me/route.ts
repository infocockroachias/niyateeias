import { getSessionUser } from '@/lib/auth'
import { withErrorGuard } from '@/lib/api-utils'

/** GET /api/auth/me — resolve the current session user (200 with {user:null} when logged out) */
export async function GET() {
  return withErrorGuard(async () => {
    const user = await getSessionUser()
    return Response.json({ user })
  }, 'Session lookup failed')
}
