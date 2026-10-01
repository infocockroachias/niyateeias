import { destroyCurrentSession } from '@/lib/auth'
import { withErrorGuard } from '@/lib/api-utils'

/** POST /api/auth/logout — clear session */
export async function POST() {
  return withErrorGuard(async () => {
    await destroyCurrentSession()
    return Response.json({ ok: true })
  }, 'Logout failed')
}
