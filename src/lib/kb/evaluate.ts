// ─────────────────────────────────────────────────────────────────────────────
// Deterministic answer evaluator — offline rubric scoring for Mains answers.
//
// Used as the fallback when the LLM evaluation service is unreachable (e.g.
// serverless deployments without AI credentials). It applies the same GS
// rubric the mentor desk uses: content, structure, analysis, examples,
// presentation — scored purely from measurable features of the answer text.
// ─────────────────────────────────────────────────────────────────────────────

const STRUCTURE_MARKERS = [
  'introduction', 'conclusion', 'however', 'moreover', 'further', 'therefore',
  'in addition', 'on the other hand', 'firstly', 'secondly', 'finally',
  'way forward', 'measures', 'steps', 'challenges', 'way ahead',
]

const EXAMPLE_MARKERS = [
  'for example', 'for instance', 'e.g.', 'such as', 'case study',
  'supreme court', 'article', 'amendment', 'committee', 'commission',
  'report', 'index', 'survey', 'scheme', 'mission', 'yojana', 'act',
]

const DIRECTIVES = [
  'discuss', 'examine', 'analyse', 'analyze', 'evaluate', 'critically',
  'comment', 'elucidate', 'describe', 'highlight', 'enumerate',
]

const DATA_MARKER = /\b(19|20)\d{2}\b|\b\d+(\.\d+)?\s?(%|per cent|percent|crore|lakh|billion|million)\b/i

function countSentences(text: string): number {
  return text.split(/[.!?।]+\s/).filter((s) => s.trim().length > 3).length
}

function countMatches(haystack: string, needles: string[]): number {
  const lower = haystack.toLowerCase()
  return needles.filter((n) => lower.includes(n)).length
}

export interface OfflineEvaluation {
  scoreInr0to10: number
  breakdown: {
    content: number
    structure: number
    analysis: number
    examples: number
    presentation: number
  }
  strengths: string[]
  improvements: string[]
  modelOutline: string[]
  verdict: string
}

/** Clamp helper local to this module (0-10, one decimal). */
const clamp = (n: number): number => Math.round(Math.min(10, Math.max(0, n)) * 10) / 10

export function evaluateOffline(question: string, answer: string): OfflineEvaluation {
  const words = answer.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const paragraphs = answer.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const sentences = countSentences(answer)

  // content — length vs the ~250-word target plus richness (unique word ratio)
  const uniqueRatio = wordCount > 0 ? new Set(words.map((w) => w.toLowerCase())).size / wordCount : 0
  const lengthScore = wordCount >= 180 && wordCount <= 320 ? 8 : wordCount >= 120 ? 6 : wordCount >= 60 ? 4 : 2
  const richnessBonus = uniqueRatio > 0.55 ? 1.5 : uniqueRatio > 0.45 ? 0.75 : 0
  const content = clamp(lengthScore * 0.75 + richnessBonus * 2)

  // structure — paragraph discipline + discourse markers
  const paraScore = paragraphs.length >= 3 ? 7.5 : paragraphs.length === 2 ? 6 : paragraphs.length === 1 && wordCount > 150 ? 4.5 : 5
  const markerCount = countMatches(answer, STRUCTURE_MARKERS)
  const structure = clamp(paraScore + Math.min(2.5, markerCount * 0.5))

  // analysis — directive linkage + comparative/critical language
  const directiveHit = DIRECTIVES.some((d) => question.toLowerCase().includes(d))
  const criticalCount = countMatches(answer, ['however', 'critically', 'on the other hand', 'nevertheless', 'at the same time', 'balance', 'perspective', 'stakeholder', 'implication', 'dimension'])
  const analysis = clamp(4 + (directiveHit ? 1.5 : 0) + Math.min(4, criticalCount * 1.2) + (sentences > 8 ? 0.5 : 0))

  // examples — concrete anchors: data, articles, schemes, cases
  const exampleCount = countMatches(answer, EXAMPLE_MARKERS)
  const hasData = DATA_MARKER.test(answer)
  const examples = clamp(3 + Math.min(4.5, exampleCount * 1.1) + (hasData ? 2 : 0))

  // presentation — concision + value-addition signals
  const overLimit = wordCount > 320
  const valueAdd = countMatches(answer, ['diagram', 'flowchart', 'map', 'table', 'quoting', 'quote'])
  const presentation = clamp(7.5 + Math.min(1.5, valueAdd * 0.75) - (overLimit ? 2 : 0) + (wordCount >= 140 && wordCount <= 300 ? 1 : 0))

  const breakdown = { content, structure, analysis, examples, presentation }
  const scoreInr0to10 = clamp(
    content * 0.3 + structure * 0.2 + analysis * 0.2 + examples * 0.2 + presentation * 0.1
  )

  const strengths: string[] = []
  if (wordCount >= 180 && wordCount <= 320) strengths.push('Answer stays close to the expected word limit, which examiners reward.')
  if (paragraphs.length >= 3) strengths.push('Clear paragraph discipline: the answer reads as intro, body and conclusion.')
  if (hasData) strengths.push('Concrete data points anchor the argument and lift the content score.')
  if (exampleCount >= 3) strengths.push('Good use of examples: schemes, articles and reports ground the claims.')
  if (criticalCount >= 2) strengths.push('Multi-perspective treatment shows critical engagement, not just description.')
  if (strengths.length === 0) strengths.push('The core theme of the question is addressed in your own words.')

  const improvements: string[] = []
  if (wordCount < 140) improvements.push('Expand the body: aim for 200-250 words with at least two dimensions (social, economic, political, environmental).')
  if (wordCount > 320) improvements.push('Trim to the word limit; examiners penalise padding more than brevity.')
  if (paragraphs.length < 3) improvements.push('Structure explicitly: a short intro, a two- to three-paragraph body, and a forward-looking conclusion.')
  if (!hasData) improvements.push('Add one report, index or statistic (e.g. NFHS-5, Economic Survey) as evidence.')
  if (exampleCount < 2) improvements.push('Cite a constitutional article, Supreme Court judgment or flagship scheme where relevant.')
  if (!directiveHit || criticalCount < 2) improvements.push('Address the directive verb: if the question says "critically examine", weigh both sides before concluding.')
  if (improvements.length === 0) improvements.push('Sharpen the introduction with a definition or a current-affairs hook.')

  const modelOutline = [
    'Introduction: define the core term of the question in one or two lines.',
    'Context: one current-affairs anchor (report, policy or judgment).',
    'Body 1: the primary dimension with one example or data point.',
    'Body 2: the counter-dimension or challenge, weighed against Body 1.',
    'Way forward: two actionable, specific recommendations.',
    'Conclusion: link back to the directive verb with a balanced closing line.',
  ]

  const verdict =
    scoreInr0to10 >= 7.5
      ? 'Strong answer. With tighter examples and crisper structure this reaches a top-band response.'
      : scoreInr0to10 >= 5.5
        ? 'Solid foundation. Strengthen evidence (data, articles, schemes) and address the directive more directly.'
        : 'Developing answer. Focus on structure first: intro-body-conclusion with one example per body paragraph.'

  return { scoreInr0to10, breakdown, strengths: strengths.slice(0, 4), improvements: improvements.slice(0, 4), modelOutline, verdict }
}
