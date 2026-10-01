import { NextRequest } from 'next/server'
import { jsonError, withErrorGuard, extractJson } from '@/lib/api-utils'
import { MCQ_BANK } from '@/data/content'
import { addGeneratedMcqs, listGeneratedMcqs } from '@/lib/mem-store'

/**
 * POST /api/ai/mcq
 * Body: { subject: string, difficulty?: 'easy'|'medium'|'hard', count?: number (<=5) }
 * Returns: { questions: [{ id, question, options, correctIndex, explanation, subject }], source: 'bank' | 'generated' }
 *
 * Fully offline-safe: the seeded question bank lives in the in-memory content
 * library (src/data/content.ts) and runtime-generated questions join it via
 * the memory store. AI generation is attempted only when the bank is thin for
 * the requested subject/difficulty, and any AI failure falls back to the bank
 * — the endpoint never 503s on hosts without AI credentials.
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

    const toPublic = (q: { id: string; question: string; options: string[]; correctIndex: number; explanation: string; subject: string }) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      subject: q.subject,
    })

    // 1) Runtime-generated questions first (freshest, previously AI-validated)
    const runtime = listGeneratedMcqs(subject, difficulty, count)
    if (runtime.length >= count) {
      return Response.json({ questions: runtime.map(toPublic), source: 'bank' })
    }

    // 2) Static curated bank (exact subject/difficulty match, then relaxed)
    const pickFromBank = (subj: string, diff: string, take: number) =>
      MCQ_BANK.filter((q) => q.subject === subj && q.difficulty === diff)
        .slice(0, take)
        .map(toPublic)

    let bank = pickFromBank(subject, difficulty, count)

    if (bank.length < count) {
      // Relax difficulty, keep subject
      const relaxed = MCQ_BANK.filter((q) => q.subject === subject)
        .filter((q) => !bank.some((b) => b.id === q.id))
        .slice(0, count - bank.length)
        .map(toPublic)
      bank = [...bank, ...relaxed]
    }

    if (bank.length < count) {
      // Relax subject across the whole bank (round-robin rotation so repeats feel fresh)
      const daySeed = Math.floor(Date.now() / 86_400_000)
      const rest = MCQ_BANK.filter((q) => !bank.some((b) => b.id === q.id))
      const rotated = [...rest.slice(daySeed % Math.max(rest.length, 1)), ...rest.slice(0, daySeed % Math.max(rest.length, 1))]
      bank = [...bank, ...rotated.slice(0, count - bank.length).map(toPublic)]
    }

    if (bank.length >= count) {
      return Response.json({ questions: bank.slice(0, count), source: 'bank' })
    }

    // 3) Bank exhausted — try AI generation (optional capability, never fatal)
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
      const { default: ZAI } = await import('z-ai-web-dev-sdk')
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
        throw new Error('unparseable AI response')
      }

      const valid: Array<{ id: string; question: string; options: string[]; correctIndex: number; explanation: string; subject: string }> = []
      const toPersist: Array<{ question: string; options: string[]; correctIndex: number; explanation: string; subject: string; difficulty: string }> = []

      for (const item of parsed.slice(0, count)) {
        const q = typeof (item as Record<string, unknown>).question === 'string' ? ((item as Record<string, unknown>).question as string) : ''
        const options = Array.isArray((item as Record<string, unknown>).options)
          ? ((item as Record<string, unknown>).options as unknown[]).filter((o): o is string => typeof o === 'string')
          : []
        const correctIndex = Number((item as Record<string, unknown>).correctIndex)
        const explanation =
          typeof (item as Record<string, unknown>).explanation === 'string'
            ? ((item as Record<string, unknown>).explanation as string)
            : ''
        if (!q || options.length !== 4 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3 || !explanation) {
          continue
        }
        toPersist.push({ question: q, options, correctIndex, explanation, subject, difficulty })
        if (valid.length + bank.length < count) {
          valid.push({ id: `gen_${valid.length}_${Date.now()}`, question: q, options, correctIndex, explanation, subject })
        }
      }

      if (toPersist.length > 0) addGeneratedMcqs(toPersist)

      const questions = [...bank, ...valid].slice(0, count)
      if (questions.length === 0) {
        return jsonError('Could not generate valid questions, please try a different subject.', 502)
      }
      return Response.json({ questions, source: valid.length > 0 ? 'generated' : 'bank' })
    } catch (err) {
      console.error('[ai/mcq] AI generation unavailable:', err)
      // Absolute last resort: repeat cycle through the whole bank so practice
      // never stops, even when the requested subject has no questions.
      const daySeed = Math.floor(Date.now() / 86_400_000)
      const rotated = [...MCQ_BANK.slice(daySeed % Math.max(MCQ_BANK.length, 1)), ...MCQ_BANK.slice(0, daySeed % Math.max(MCQ_BANK.length, 1))]
      const questions = rotated.slice(0, count).map(toPublic)
      if (questions.length === 0) {
        return jsonError('The practice bank is empty, please try again later.', 503)
      }
      return Response.json({ questions, source: 'bank' })
    }
  }, 'Failed to generate MCQs')
}
