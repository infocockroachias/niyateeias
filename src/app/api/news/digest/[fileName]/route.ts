import { NextRequest } from 'next/server'

/**
 * GET /api/news/digest/[fileName] — placeholder for monthly digest PDFs.
 * In production this would stream a real PDF from storage; here we return a
 * graceful JSON 404 so the UI can show a helpful toast.
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ fileName: string }> }) {
  const { fileName } = await ctx.params
  return Response.json(
    {
      error: `The digest "${fileName}" is being finalised by our editorial desk and will be available shortly.`,
    },
    { status: 404 }
  )
}
