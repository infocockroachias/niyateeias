import { NextRequest } from 'next/server'
import { createHash } from 'node:crypto'
import ZAI from 'z-ai-web-dev-sdk'
import { db, parseJsonArray } from '@/lib/db'
import { jsonError, withErrorGuard, extractJson } from '@/lib/api-utils'

/**
 * POST /api/ai/mcq
 * Body: { subject: string, difficulty?: 'easy'|'medium'|'hard', count?: number (<=5) }
 * Returns: { questions: [{ id, question, options, correctIndex, explanation, subject }] }
 * Serves seeded bank questions first; generates fresh ones with AI when the bank runs dry.
 */
export async function POST(req: NextRequest) {
  return withErrorGuard(async () => {
    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return jsonError('Invalid JSON body', 400)
    }

    const subject = typeof body.subject === 'string' && body.subject.trim() ? body.subject.trim() : 'Polity'
    const difficulty = ['easy', 'medium', 'hard'].includes(String(body.difficulty))
      ? String(body.difficulty)
      : 'medium'
    const count = Math.min(Math.max(Number(body.count) || 5, 1), 5)

    // 1) Try the seeded/generated bank first
    const bank = await db.mcqQuestion.findMany({
      where: { subject, difficulty },
      orderBy: { createdAt: 'desc' },
      take: count,
    })
    if (bank.length >= count) {
      return Response.json({
        questions: bank.map((q) => ({
          id: q.id,
          question: q.question,
          options: parseJsonArray(q.optionsJson),
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          subject: q.subject,
        })),
        source: 'bank',
      })
    }

    // 2) Generate fresh questions with the AI and persist them
    const system = `You are a UPSC Prelims question-setter for Niyatee Civil Services Academy. You write MCQs exactly in the UPSC GS Paper-I style: factually precise, concept-driven, with plausible distractors.
Rules:
- Each question has exactly 4 options and exactly one correct answer (correctIndex: 0-3, vary it across questions).
- Prefer "statement-based" formats (e.g., "Consider the following statements...") for medium/hard difficulty.
- The explanation must state why the correct option is right and why key distractors are wrong, in 2-3 sentences.
- Never invent fake statistics; test well-established facts, constitutional articles, schemes, geography, conventions.
Respond with ONLY a JSON array (no markdown), each item shaped:
{ "question": "...", "options": ["...","...","...","..."], "correctIndex": 0, "explanation": "..." }`

    const user = `Generate ${count} ${difficulty}-difficulty UPSC Prelims MCQs on the subject: ${subject}.
Return only the JSON array with ${count} items.`

    try {
      const zai = await ZAI.create()
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        thinking: { type: 'disabled' },
      })
      const raw = completion.choices[0]?.message?.content ?? ''
      const parsed = extractJson(raw)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return jsonError('The question generator returned an unreadable response, please try again.', 502)
      }

      const questions: Array<{
        id: string
        question: string
        options: string[]
        correctIndex: number
        explanation: string
        subject: string
      }> = []

      for (const item of parsed.slice(0, count)) {
        const q = typeof (item as Record<string, unknown>).question === 'string' ? (item as Record<string, unknown>).question as string : ''
        const options = Array.isArray((item as Record<string, unknown>).options)
          ? ((item as Record<string, unknown>).options as unknown[]).filter((o): o is string => typeof o === 'string')
          : []
        const correctIndex = Number((item as Record<string, unknown>).correctIndex)
        const explanation = typeof (item as Record<string, unknown>).explanation === 'string' ? (item as Record<string, unknown>).explanation as string : ''
        if (!q || options.length !== 4 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3 || !explanation) {
          continue
        }
        const hash = createHash('sha256').update(q).digest('hex')
        const saved = await db.mcqQuestion.upsert({
          where: { hash },
          update: {},
          create: {
            question: q,
            optionsJson: JSON.stringify(options),
            correctIndex,
            explanation,
            subject,
            difficulty,
            hash,
          },
        })
        questions.push({
          id: saved.id,
          question: saved.question,
          options: parseJsonArray(saved.optionsJson),
          correctIndex: saved.correctIndex,
          explanation: saved.explanation,
          subject: saved.subject,
        })
        if (questions.length >= count) break
      }

      if (questions.length === 0) {
        return jsonError('Could not generate valid questions, please try a different subject.', 502)
      }
      return Response.json({ questions, source: 'generated' })
    } catch (err) {
      console.error('[ai/mcq]', err)
      return jsonError('AI question generation is busy right now, please try again in a moment.', 503)
    }
  }, 'Failed to generate MCQs')
}
