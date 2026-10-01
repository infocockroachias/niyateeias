import { NextRequest } from 'next/server'
import { jsonError, withErrorGuard, extractJson, clampNumber } from '@/lib/api-utils'
import { evaluateOffline } from '@/lib/kb/evaluate'

/**
 * POST /api/ai/evaluate
 * Body: { question: string, answer: string, paperType?: string }
 * Returns: { evaluation: { scoreInr0to10, breakdown, strengths, improvements, modelOutline, verdict }, source: 'ai' | 'rubric' }
 *
 * Resilience contract: evaluation NEVER dead-ends. When the LLM service is
 * unreachable (e.g. serverless hosts without AI credentials) a deterministic
 * GS-rubric evaluator scores the answer from measurable features (structure,
 * evidence, directive linkage, word discipline) — see src/lib/kb/evaluate.ts.
 */
export async function POST(req: NextRequest) {
  return withErrorGuard(async () => {
    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return jsonError('Invalid JSON body', 400)
    }

    const question = typeof body.question === 'string' ? body.question.trim() : ''
    const answer = typeof body.answer === 'string' ? body.answer.trim() : ''
    const paperType = typeof body.paperType === 'string' ? body.paperType : 'GS'

    if (question.length < 10) return jsonError('Please provide the question you are answering.', 400)
    if (answer.length < 40) return jsonError('Your answer is too short to evaluate, write at least a few sentences.', 400)
    if (answer.length > 8000) return jsonError('Answer exceeds the evaluation limit (approximately 1000 words).', 400)

    const system = `You are a senior UPSC Civil Services Mains examiner and evaluator for Niyatee Civil Services Academy. You evaluate answers strictly the way UPSC evaluators do, against the official GS rubric.
Evaluation criteria (each scored 0-10):
- content: factual accuracy, conceptual clarity, coverage of dimensions (political, social, economic, environmental, ethical), use of data/examples/reports/committee recommendations
- structure: clear intro-body-conclusion, logical flow, effective use of headings/bullet-style organisation appropriate for a 15-mark answer
- analysis: critical reasoning, multi-perspective treatment, linkage to the directive word (discuss/analyse/evaluate/critically examine), balanced judgement
- examples: relevant case studies, constitutional articles, Supreme Court judgments, schemes, statistics, current-affairs linkage
- presentation: concision, value-addition (diagrams/flowcharts described), adherence to word limit (~250 words), formal register

Respond with ONLY a JSON object (no markdown, no prose) in exactly this shape:
{
  "scoreInr0to10": <number 0-10, one decimal, overall weighted score>,
  "breakdown": { "content": <0-10>, "structure": <0-10>, "analysis": <0-10>, "examples": <0-10>, "presentation": <0-10> },
  "strengths": [<2-4 short strings citing specific parts of the answer>],
  "improvements": [<2-4 short, actionable strings>],
  "modelOutline": [<5-7 bullet strings outlining an ideal answer skeleton>],
  "verdict": "<one-sentence examiner verdict>"
}`

    const user = `Paper: ${paperType}
Question: ${question}
Answer to evaluate:
"""
${answer}
"""`

    try {
      // Dynamic import: stays safe on hosts without AI credentials — the catch
      // below serves the deterministic rubric evaluation instead.
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
      const parsed = extractJson(raw) as Record<string, unknown> | null
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('unparseable evaluator response')
      }

      const bd = (parsed.breakdown ?? {}) as Record<string, unknown>
      const clamp10 = (v: unknown) => clampNumber(v, 0, 10, 5)
      const strArr = (v: unknown): string[] =>
        Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.length > 0).slice(0, 8) : []

      const evaluation = {
        scoreInr0to10: clampNumber(parsed.scoreInr0to10, 0, 10, 5),
        breakdown: {
          content: clamp10(bd.content),
          structure: clamp10(bd.structure),
          analysis: clamp10(bd.analysis),
          examples: clamp10(bd.examples),
          presentation: clamp10(bd.presentation),
        },
        strengths: strArr(parsed.strengths),
        improvements: strArr(parsed.improvements),
        modelOutline: strArr(parsed.modelOutline),
        verdict: typeof parsed.verdict === 'string' ? parsed.verdict : '',
      }
      return Response.json({ evaluation, source: 'ai' })
    } catch (err) {
      console.error('[ai/evaluate] LLM unavailable, using deterministic rubric evaluation:', err)
      return Response.json({ evaluation: evaluateOffline(question, answer), source: 'rubric' })
    }
  }, 'Failed to evaluate answer')
}
