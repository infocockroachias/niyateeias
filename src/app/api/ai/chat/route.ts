import { NextRequest } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { jsonError, withErrorGuard } from '@/lib/api-utils'

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

/**
 * POST /api/ai/chat
 * Body: { messages: [{role:'user'|'assistant', content}], context?: string }
 * Returns: { reply: string }
 */
export async function POST(req: NextRequest) {
  return withErrorGuard(async () => {
    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return jsonError('Invalid JSON body', 400)
    }

    const rawMsgs = body.messages
    if (!Array.isArray(rawMsgs) || rawMsgs.length === 0) {
      return jsonError('No messages provided.', 400)
    }

    const messages: ChatMsg[] = rawMsgs
      .filter(
        (m): m is ChatMsg =>
          !!m &&
          typeof m === 'object' &&
          typeof (m as ChatMsg).content === 'string' &&
          ((m as ChatMsg).role === 'user' || (m as ChatMsg).role === 'assistant')
      )
      .slice(-12) // keep the last 12 turns for context economy

    if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
      return jsonError('The last message must be from the user.', 400)
    }
    if (messages.some((m) => m.content.length > 4000)) {
      return jsonError('Message too long (max ~1000 words per message).', 400)
    }

    const system = `You are the "Niyatee AI Mentor" — an expert UPSC Civil Services preparation mentor at Niyatee Civil Services Academy, Bhubaneswar. You help aspirants with:
- Concept explanations across the GS syllabus (Polity, Economy, History, Geography, Environment, S&T, IR, Ethics) at exactly the depth UPSC demands
- Exam strategy: study planning, answer writing, optional subject choice, time management
- Current-affairs context and how issues map to GS papers and Prelims facts
- UPSC exam facts: three stages (Prelims GS+CSAT, Mains 9 papers 1750 marks, Personality Test 275 marks, total 2025), eligibility (graduate, age 21-32 general, 6 attempts), and services (IAS/IPS/IFS/IRS etc.)

Style: precise, warm, and concise — like a mentor in a corridor conversation. Use short paragraphs and, when listing, tight bullets (max 4-5). End substantive answers with one practical next step. Never invent statistics; if unsure, say so. Keep answers under 250 words unless the user asks for depth. Do not discuss other coaching institutes. If asked something outside UPSC/civil-services preparation, briefly redirect to the exam journey.`

    const context = typeof body.context === 'string' && body.context.trim() ? `\n\n(Additional context from the page the student is viewing: ${body.context.trim().slice(0, 500)})` : ''

    try {
      const zai = await ZAI.create()
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: system + context },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        thinking: { type: 'disabled' },
      })
      const reply = completion.choices[0]?.message?.content ?? ''
      if (!reply.trim()) {
        return jsonError('The mentor could not respond right now — please try again.', 502)
      }
      return Response.json({ reply })
    } catch (err) {
      console.error('[ai/chat]', err)
      return jsonError('AI mentor service is busy right now — please try again in a moment.', 503)
    }
  }, 'Failed to process chat')
}
