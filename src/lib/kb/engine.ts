// ─────────────────────────────────────────────────────────────────────────────
// Retrieval engine for the Niyatee Doubt Agent — deterministic, dependency-free
// keyword retrieval over the curated knowledge base (src/lib/kb/docs.ts).
// Used by the chat API as (a) context-booster for the LLM and (b) the complete
// offline answer path on hosts where no LLM is available (e.g. Vercel).
// ─────────────────────────────────────────────────────────────────────────────

import { KB_DOCS, type KbDoc } from './docs'

/* ─────────────────────────────── Tokenisation ─────────────────────────────── */

const STOPWORDS = new Set([
  // general english
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'of', 'at', 'by', 'for', 'with', 'about', 'into', 'to', 'from', 'in', 'on', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am', 'do', 'does', 'did', 'can', 'could', 'would', 'will', 'shall', 'may', 'might', 'must', 'have', 'has', 'had', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'there', 'here', 'what', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'not', 'no', 'yes',
  // chat filler
  'please', 'tell', 'explain', 'describe', 'give', 'some', 'any', 'need', 'want', 'know', 'let', 'also', 'just', 'very', 'much', 'many', 'more', 'most', 'should', 'best', 'good', 'great', 'kind', 'type', 'types', 'ways', 'way', 'tips', 'note', 'notes', 'short', 'brief', 'detailed', 'detail', 'meaning', 'mean', 'define', 'definition', 'write', 'answer', 'ask', 'question', 'questions', 'help', 'hai', 'kya', 'kaise', 'batao', 'details', 'explainkaro',
  // exam filler that appears in almost every query
  'upsc', 'ias', 'civil', 'services', 'exam', 'examination', 'syllabus-wise', 'prepare', 'preparation', 'aspirant', 'attempt',
])

/** Keep these even though they are common — they are the actual query meat. */
const PROTECTED_TERMS = new Set([
  'difference', 'between', 'compare', 'versus', 'vs', 'monsoon', 'budget', 'governor', 'president', 'election',
])

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

export function contentTokens(text: string): string[] {
  return tokenize(text).filter(
    (t) => t.length > 2 && (PROTECTED_TERMS.has(t) || (!STOPWORDS.has(t) && !/^\d+$/.test(t)))
  )
}

/* ─────────────────────────────── Synonym map ──────────────────────────────── */

const SYNONYMS: Record<string, string[]> = {
  rbi: ['monetary', 'inflation', 'repo'],
  mpc: ['monetary', 'repo', 'inflation'],
  repo: ['monetary', 'inflation'],
  inflation: ['cpi', 'monetary'],
  cpi: ['inflation', 'wpi'],
  wpi: ['inflation', 'cpi'],
  upi: ['digital', 'payments', 'npci', 'mdr'],
  payment: ['digital', 'upi', 'payments'],
  payments: ['digital', 'upi', 'mdr'],
  mdr: ['upi', 'payments', 'digital'],
  npci: ['upi', 'payments'],
  cbdc: ['digital', 'rupee', 'payments'],
  gst: ['gst', 'council', 'tax'],
  tax: ['gst', 'fiscal'],
  fiscal: ['frbm', 'deficit', 'budget'],
  deficit: ['fiscal', 'frbm'],
  frbm: ['fiscal', 'deficit'],
  budget: ['fiscal', 'frbm'],
  pmi: ['pmi', 'iip', 'industrial'],
  iip: ['pmi', 'industrial'],
  industry: ['pmi', 'manufacturing', 'industrial'],
  manufacturing: ['pmi', 'industrial', 'pli'],
  pli: ['manufacturing', 'incentive'],
  msp: ['msp', 'apmc', 'agriculture'],
  farmer: ['msp', 'apmc', 'agriculture'],
  agriculture: ['msp', 'apmc'],
  apmc: ['msp', 'agriculture'],
  optional: ['optional', 'subject', 'strategy'],
  subjects: ['optional', 'syllabus'],
  ethics: ['ethics', 'integrity', 'gs4'],
  integrity: ['ethics', 'probity'],
  probity: ['ethics', 'integrity'],
  gs4: ['ethics'],
  essay: ['essay', 'strategy'],
  csat: ['csat', 'quant'],
  prelims: ['prelims'],
  mains: ['mains'],
  strategy: ['strategy', 'plan'],
  monsoon: ['monsoon', 'itcz', 'rain'],
  rain: ['monsoon'],
  cyclone: ['cyclone', 'imd'],
  imd: ['cyclone', 'monsoon'],
  river: ['rivers', 'himalayan', 'peninsular'],
  rivers: ['rivers', 'himalayan', 'peninsular'],
  ghats: ['western', 'ghats', 'biodiversity'],
  tiger: ['tiger', 'ntca'],
  wetland: ['ramsar', 'wetlands'],
  wetlands: ['ramsar'],
  ramsar: ['ramsar', 'wetlands'],
  ngt: ['ngt', 'tribunal', 'environment'],
  eia: ['eia', 'clearance', 'environment'],
  environment: ['environment', 'ecology'],
  renewable: ['renewable', 'solar', 'energy', 'hydrogen'],
  solar: ['renewable', 'solar', 'energy'],
  hydrogen: ['hydrogen', 'renewable', 'energy'],
  climate: ['environment', 'renewable'],
  semiconductor: ['semiconductor', 'chip', 'ism', 'fab'],
  chip: ['semiconductor', 'ism'],
  chips: ['semiconductor', 'ism'],
  isro: ['isro', 'space', 'chandrayaan', 'gaganyaan'],
  chandrayaan: ['isro', 'space'],
  gaganyaan: ['isro', 'space'],
  space: ['isro'],
  ai: ['generative', 'ai', 'regulation', 'deepfake'],
  deepfake: ['ai', 'generative', 'deepfake'],
  crispr: ['crispr', 'gene', 'editing'],
  gene: ['crispr', 'genome', 'editing'],
  privacy: ['fundamental', 'rights', 'puttaswamy'],
  writ: ['fundamental', 'rights', 'writs'],
  rights: ['fundamental', 'rights'],
  constitution: ['polity', 'fundamental', 'rights'],
  governor: ['governor', 'discretion'],
  president: ['president', 'emergency', 'rule'],
  emergency: ['president', 'rule', 'emergency', '356'],
  '356': ['president', 'rule', 'emergency'],
  '370': ['article', '370', 'kashmir'],
  kashmir: ['article', '370', 'jammu'],
  jammu: ['kashmir', 'article', '370'],
  eci: ['election', 'commission', 'cec'],
  cec: ['election', 'commission', 'eci'],
  election: ['election', 'commission', 'eci'],
  defection: ['defection', 'tenth', 'schedule'],
  whip: ['defection', 'whip', 'schedule'],
  money: ['money', 'bill', 'finance'],
  rajya: ['money', 'bill', 'rajya', 'sabha'],
  sabha: ['money', 'bill', 'parliament', 'rajya'],
  kesavananda: ['basic', 'structure', 'kesavananda'],
  'basic': ['basic', 'structure'],
  dpsp: ['dpsp', 'directive', 'principles'],
  panchayat: ['panchayati', 'panchayat', 'local'],
  panchayati: ['panchayat', 'local', 'raj'],
  municipality: ['municipality', 'urban', 'local'],
  finance: ['finance', 'commission', 'fiscal', 'money'],
  devolution: ['finance', 'commission', 'devolution', 'fiscal'],
  gandhi: ['gandhi', 'satyagraha', 'non-violence'],
  satyagraha: ['gandhi', 'satyagraha'],
  '1919': ['montagu', 'chelmsford', '1919'],
  montagu: ['montagu', 'chelmsford', 'dyarchy'],
  montford: ['montagu', 'chelmsford', '1919'],
  dyarchy: ['montagu', 'chelmsford', 'dyarchy'],
  linguistic: ['linguistic', 'states', 'reorganisation'],
  '1857': ['revolt', '1857', 'mutiny'],
  mutiny: ['revolt', '1857'],
  revolt: ['revolt', '1857'],
  sangam: ['sangam'],
  tamil: ['sangam', 'sri', 'lanka'],
  hampi: ['vijayanagara', 'hampi'],
  vijayanagara: ['vijayanagara', 'hampi', 'krishnadevaraya'],
  krishnadevaraya: ['vijayanagara', 'hampi'],
  currents: ['ocean', 'currents'],
  ocean: ['ocean', 'currents'],
  'sri': ['sri', 'lanka', 'neighbourhood'],
  lanka: ['sri', 'lanka', 'neighbourhood'],
  us: ['india', 'us', 'trade', 'ustr'],
  usa: ['india', 'us', 'trade'],
  america: ['india', 'us', 'trade'],
  ustr: ['india', 'us', 'trade'],
  quad: ['quad', 'indo', 'pacific'],
  neighbourhood: ['neighbourhood', 'first', 'south', 'asia'],
  bimstec: ['neighbourhood', 'bimstec'],
  maldives: ['neighbourhood', 'maldives'],
  nepal: ['neighbourhood', 'nepal'],
  bangladesh: ['neighbourhood', 'bangladesh'],
  uapa: ['uapa', 'banned', 'terror', 'organisations'],
  terror: ['uapa', 'terror', 'banned', 'security'],
  terrorism: ['uapa', 'terror', 'security'],
  hut: ['uapa', 'hizb', 'banned'],
  cyber: ['cyber', 'security', 'fraud', 'cert-in'],
  cybersecurity: ['cyber', 'security', 'fraud'],
  fraud: ['cyber', 'fraud', 'security'],
  scam: ['cyber', 'fraud', 'security'],
  rti: ['rti', 'transparency', 'information'],
  transparency: ['rti', 'transparency'],
  interview: ['interview', 'personality', 'strategy'],
  eligibility: ['eligibility', 'attempts', 'age'],
  age: ['eligibility', 'age', 'attempts'],
  attempts: ['eligibility', 'attempts'],
  syllabus: ['syllabus', 'mains', 'pattern'],
  pattern: ['pattern', 'exam', 'stages', 'syllabus'],
  marks: ['marks', 'pattern', 'mains'],
  negative: ['negative', 'marking', 'prelims'],
  history: ['history'],
  geography: ['geography'],
  polity: ['polity'],
  economy: ['economy'],
}

export function expandTokens(tokens: string[]): Set<string> {
  const out = new Set<string>(tokens)
  for (const t of tokens) {
    const syn = SYNONYMS[t]
    if (syn) for (const s of syn) out.add(s)
  }
  return out
}

/* ──────────────────────────────── Scoring ─────────────────────────────────── */

interface ScoredDoc {
  doc: KbDoc
  score: number
}

function lower(arr?: string[]): string {
  return arr ? arr.join(' ').toLowerCase() : ''
}

function phraseBonus(qTokens: string[], haystacks: string[]): number {
  // a 2-word exact phrase from the query appearing in title/aliases/keywords
  let bonus = 0
  for (let i = 0; i < qTokens.length - 1; i++) {
    const phrase = `${qTokens[i]} ${qTokens[i + 1]}`
    for (const h of haystacks) {
      if (h.includes(phrase)) {
        bonus += 3
        break
      }
    }
  }
  return bonus
}

export function scoreDoc(qTokens: string[], doc: KbDoc): number {
  const q = expandTokens(qTokens)
  const title = doc.title.toLowerCase()
  const aliases = lower(doc.aliases)
  const keywords = lower(doc.keywords)
  const summary = doc.summary.toLowerCase()
  const keyPoints = lower(doc.keyPoints)
  const facts = lower(doc.facts)

  let score = 0
  for (const t of q) {
    if (!t) continue
    if (doc.keywords.some((k) => k.toLowerCase().includes(t) || t.includes(k.toLowerCase()))) score += 3
    if (aliases.includes(t)) score += 2.5
    if (title.includes(t)) score += 2
    if (summary.includes(t)) score += 1
    if (keyPoints.includes(t)) score += 1
    if (facts.includes(t)) score += 1.5
  }
  score += phraseBonus(qTokens, [title, aliases, keywords])
  return score
}

/* ──────────────────────────────── Retrieval ───────────────────────────────── */

export interface RetrievalResult {
  docs: KbDoc[]
  scores: number[]
  bestScore: number
}

const MIN_SCORE = 2.5

export function retrieve(query: string, limit = 3): RetrievalResult {
  const qTokens = contentTokens(query)
  if (qTokens.length === 0) return { docs: [], scores: [], bestScore: 0 }

  const scored: ScoredDoc[] = []
  for (const doc of KB_DOCS) {
    const s = scoreDoc(qTokens, doc)
    if (s >= MIN_SCORE) scored.push({ doc, score: s })
  }
  scored.sort((a, b) => b.score - a.score)
  const top = scored.slice(0, limit)
  return {
    docs: top.map((t) => t.doc),
    scores: top.map((t) => t.score),
    bestScore: top[0]?.score ?? 0,
  }
}

export function isGreeting(query: string): boolean {
  return /^(hi+|hello+|hey+|namaste|namaskar|greetings|good\s*(morning|afternoon|evening|day)|thanks?( you)?|thank\s*you|ok|okay)\b[\s!.]*$/i.test(
    query.trim()
  )
}

export function isComparisonIntent(query: string): boolean {
  return /\b(difference|differences|compare|comparison|versus|vs\.?|distinguish)\b/i.test(query)
}

/** Confidence heuristic for the composed KB answer. */
export function confidenceFor(bestScore: number, docCount: number): 'high' | 'medium' | 'low' {
  if (docCount === 0 || bestScore < MIN_SCORE) return 'low'
  if (bestScore >= 8) return 'high'
  return 'medium'
}
