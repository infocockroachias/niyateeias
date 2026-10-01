// ─────────────────────────────────────────────────────────────────────────────
// Offline answer synthesis for the Niyatee Doubt Agent (RAG-style).
// Composes structured, mentor-toned markdown answers from retrieved knowledge
// base documents — zero LLM required. Used as the chat API's fallback so the
// Doubt Agent never dead-ends (e.g. on Vercel where no LLM is available).
// ─────────────────────────────────────────────────────────────────────────────

import { KB_DOCS, type KbDoc } from './docs'
import { confidenceFor, isComparisonIntent, isGreeting, retrieve } from './engine'

export interface KbAnswer {
  reply: string
  sources: string[]
  confidence: 'high' | 'medium' | 'low'
}

const GREETING_REPLY = `Namaste! 🙏 I'm the **Niyatee Doubt Agent** — your 24×7 UPSC mentor, running on Niyatee's curated knowledge base of ${KB_DOCS.length}+ exam-grade topics.

I can help with:
- **Concepts** — Polity, Economy, History, Geography, Environment, S&T, IR, Ethics
- **Strategy** — optional choice, answer writing, Prelims/CSAT plans, time management
- **Syllabus facts** — exam pattern, eligibility, attempts, paper-wise coverage

💡 *For the sharpest answers, mention your attempt year and stage (Prelims/Mains).*`

const MISS_REPLY = (suggest: string[]) => `I couldn't find this one in my curated UPSC knowledge base yet. Here's what I suggest:

1. **Rephrase with the key term** — e.g. "President's Rule Article 356" instead of a long sentence.
2. **Browse today's current affairs** in the [News Room](#/news) — curated with Prelims points, Mains angles and keywords.
3. **Check Resources** [#/resources] for PYQs and notes on this topic.

Topics I cover well right now:
${suggest.map((s) => `• ${s}`).join('\n')}`

function nextStepFor(doc: KbDoc): string {
  switch (doc.category) {
    case 'strategy':
      return 'Turn this into action — draft your plan and get one answer evaluated in AI Mains Evaluation today.'
    case 'syllabus':
      return 'Verify against the official UPSC notification for your exam year, then map your study plan to it.'
    case 'ethics':
      return 'Write one GS4 case study on this theme and score it in AI Mains Evaluation.'
    case 'ir':
      return 'Follow this topic in today’s News Room — Prelims points and Mains questions are updated daily.'
    default:
      return 'Write a 150-word answer on this and get instant UPSC-style scoring in AI Mains Evaluation.'
  }
}

function bullets(items: string[], max = 5): string {
  return items
    .slice(0, max)
    .map((k) => `- ${k}`)
    .join('\n')
}

function docBlock(doc: KbDoc): string {
  const parts = [`**${doc.title}**`, '', doc.summary, '', '**Key points**', bullets(doc.keyPoints)]
  if (doc.prelims.length) parts.push('', '**Prelims pointers** 🎯', bullets(doc.prelims, 3))
  if (doc.mains.length) parts.push('', '**Mains pointers** ✍️', bullets(doc.mains, 3))
  return parts.join('\n')
}

function relatedLine(docs: KbDoc[]): string {
  const ids = new Set(docs.map((d) => d.id))
  const names: string[] = []
  for (const d of docs) {
    for (const r of d.related ?? []) {
      if (ids.has(r)) continue
      const rd = KB_DOCS.find((x) => x.id === r)
      if (rd && !names.includes(rd.title)) names.push(rd.title)
    }
  }
  return names.length ? names.slice(0, 3).join(' · ') : ''
}

function composeSingle(query: string, docs: KbDoc[]): string {
  const main = docs[0]
  const block = docBlock(main)
  const rel = relatedLine(docs)
  const also = docs.slice(1)
  let out = block
  if (also.length) {
    out += `\n\n**Also relevant**\n${also.map((d) => `- **${d.title}** — ${d.summary}`).join('\n')}`
  }
  if (rel) out += `\n\n**Related topics**: ${rel}`
  out += `\n\n**Next step**: ${nextStepFor(main)}`
  return out
}

function composeComparison(docs: KbDoc[]): string {
  const [a, b] = docs
  const lines: string[] = []
  lines.push(`### ${a.title} vs ${b.title}`, '')
  lines.push(`**${a.title}** — ${a.summary}`)
  lines.push(`- ${a.keyPoints[0]}`)
  lines.push(`- ${a.keyPoints[1] ?? ''}`)
  lines.push('', `**${b.title}** — ${b.summary}`)
  lines.push(`- ${b.keyPoints[0]}`)
  lines.push(`- ${b.keyPoints[1] ?? ''}`)
  lines.push('', '**Exam angle**')
  lines.push(`- Prelims: keep the defining facts of each separate — options are built on the distinction.`)
  lines.push(`- Mains: use a two-column contrast in the body and close with a synthesis line.`)
  lines.push('', `**Next step**: Write a 150-word comparison answer and evaluate it in AI Mains Evaluation.`)
  return lines.filter((l) => l !== undefined).join('\n')
}

function composeStrategy(docs: KbDoc[]): string {
  const main = docs[0]
  const steps = main.keyPoints.slice(0, 5).map((k, i) => `${i + 1}. ${k}`)
  const parts = [
    `**${main.title}**`,
    '',
    main.summary,
    '',
    '**Action plan**',
    ...steps,
  ]
  if (main.mains.length) parts.push('', '**Mentor notes**', bullets(main.mains, 2))
  parts.push('', `**Next step**: ${nextStepFor(main)}`)
  return parts.join('\n')
}

/** Compose a complete offline answer for a user question. */
export function composeKbAnswer(question: string): KbAnswer {
  const q = (question ?? '').trim()

  if (isGreeting(q)) {
    return { reply: GREETING_REPLY, sources: [], confidence: 'high' }
  }

  const { docs, bestScore } = retrieve(q, 3)

  if (docs.length === 0 || bestScore < 2.5) {
    const pick = (i: number) => KB_DOCS[(q.length * 7 + i * 13) % KB_DOCS.length].title
    return {
      reply: MISS_REPLY([pick(0), pick(1), pick(2), pick(3)]),
      sources: [],
      confidence: 'low',
    }
  }

  const confidence = confidenceFor(bestScore, docs.length)
  let reply: string
  if (docs.length >= 2 && isComparisonIntent(q)) reply = composeComparison(docs)
  else if (docs[0].category === 'strategy' || docs[0].category === 'syllabus') reply = composeStrategy(docs)
  else reply = composeSingle(q, docs)

  return { reply, sources: docs.map((d) => d.title), confidence }
}
