import { NextRequest, NextResponse } from 'next/server'
import { jsonError, withErrorGuard, extractJson } from '@/lib/api-utils'
import { GEO_ITEMS, getCategory, type GeoItem } from '@/lib/geo-data'

/**
 * POST /api/ai/geo-quiz
 * Body: { count?: number (<=8), categories?: string[] }
 * Returns: { questions: [{ id, question, options[4], correctIndex, explanation, locationId, source }] }
 *
 * Strategy: try AI-generated UPSC-style map MCQs seeded with a compact subset of
 * the AI Geo Maps dataset; fall back to a deterministic locally-generated quiz
 * (region-recognition + category-recognition) when the LLM is unavailable.
 */

export interface GeoQuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  locationId?: string
  source: 'ai' | 'local'
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ------------------------------ local fallback ----------------------------- */

function localQuiz(count: number, pool: GeoItem[]): GeoQuizQuestion[] {
  const points = pool.filter((i) => i.kind === 'point')
  if (points.length < 8) points.push(...GEO_ITEMS.filter((i) => i.kind === 'point').slice(0, 20))

  const picks = shuffle(points).slice(0, count)
  const questions: GeoQuizQuestion[] = []

  picks.forEach((item, idx) => {
    const mode = idx % 2 === 0 ? 'region' : 'category'
    if (mode === 'region' && item.region) {
      const distractors = shuffle(GEO_ITEMS.filter((i) => i.region && i.id !== item.id && i.region !== item.region))
        .slice(0, 3)
        .map((i) => i.region as string)
      if (distractors.length < 3) return
      const options = shuffle([item.region, ...distractors])
      questions.push({
        id: `gq-${item.id}-r`,
        question: `Which country / region is most closely associated with "${item.name}"?`,
        options,
        correctIndex: options.indexOf(item.region),
        explanation: `${item.name}, ${item.facts[0]}`,
        locationId: item.id,
        source: 'local',
      })
    } else {
      const cat = getCategory(item.category)
      const otherCats = shuffle(
        (['news', 'river', 'range', 'strait', 'port', 'project', 'heritage', 'eco'] as const).filter(
          (k) => k !== item.category
        )
      ).slice(0, 3)
      const options = shuffle([
        cat.label,
        ...otherCats.map((k) => getCategory(k).label),
      ])
      questions.push({
        id: `gq-${item.id}-c`,
        question: `On the AI Geo Map, "${item.name}" is best classified under which layer?`,
        options,
        correctIndex: options.indexOf(cat.label),
        explanation: `${item.name} is a ${cat.label.toLowerCase()} entry. ${item.facts[0]}`,
        locationId: item.id,
        source: 'local',
      })
    }
  })

  return questions
}

/* ---------------------------------- route ---------------------------------- */

export async function POST(req: NextRequest): Promise<Response> {
  return withErrorGuard(async (): Promise<Response> => {
    let body: Record<string, unknown> = {}
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      /* empty body is fine */
    }
    const count = Math.min(Math.max(Number(body.count) || 6, 3), 8)
    const categories = Array.isArray(body.categories)
      ? (body.categories as string[]).filter((c) => typeof c === 'string')
      : []

    const pool = categories.length
      ? GEO_ITEMS.filter((i) => categories.includes(i.category))
      : GEO_ITEMS

    if (pool.length < 8) return jsonError('Not enough locations for those categories', 400)

    // Compact dataset digest for the prompt (keeps tokens bounded)
    const digest = pool
      .slice(0, 90)
      .map(
        (i) =>
          `- ${i.name} | ${getCategory(i.category).label} | ${i.region ?? '—'} | ${i.facts[0]?.slice(0, 110) ?? ''}`
      )
      .join('\n')

    const system = `You are a UPSC Geography map-quiz setter for Niyatee Civil Services Academy's "AI Geo Maps".
You write Prelims-style location MCQs that are factually precise.
Rules:
- Exactly 4 options and exactly one correct answer (correctIndex 0-3, vary positions).
- Question types: locate a place on the world map (which country/region/sea), match chokepoint-strait to water bodies, river-tributary pairs, "which of the following is TRUE about X" statement-style, UNESCO/national-park pairings.
- Use ONLY the provided dataset plus universally accepted atlas facts. Never invent statistics.
- Explanations: 1-2 crisp sentences.
Respond with ONLY a JSON array (no markdown), each item shaped:
{ "question": "...", "options": ["...","...","...","..."], "correctIndex": 0, "explanation": "...", "locationId": "<id from dataset or empty>" }`

    const user = `Dataset (name | layer | region | key fact):
${digest}

Generate ${count} UPSC Prelims-style geography MCQs based on this dataset. Return only the JSON array.`

    try {
      // Dynamic import: stays safe on hosts without AI credentials — the catch
      // below serves the deterministic local quiz instead.
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
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('unparseable AI response')

      const questions: GeoQuizQuestion[] = (parsed as Array<Record<string, unknown>>)
        .slice(0, count)
        .map((q, idx): GeoQuizQuestion | null => {
          const options = Array.isArray(q.options) ? (q.options as string[]).map(String).slice(0, 4) : []
          if (options.length !== 4) return null
          const question = String(q.question ?? '')
          if (question.length === 0) return null
          const correctIndex = Math.min(Math.max(Number(q.correctIndex) || 0, 0), 3)
          return {
            id: `gq-ai-${idx}-${Date.now()}`,
            question,
            options,
            correctIndex,
            explanation: String(q.explanation ?? ''),
            locationId: q.locationId ? String(q.locationId) : undefined,
            source: 'ai' as const,
          }
        })
        .filter((q): q is GeoQuizQuestion => q !== null)

      if (questions.length === 0) throw new Error('no valid questions')
      return NextResponse.json({ questions, source: 'ai' })
    } catch {
      // Graceful fallback — the quiz must always work
      return NextResponse.json({ questions: localQuiz(count, pool), source: 'local' })
    }
  })
}
