// ─────────────────────────────────────────────────────────────────────────────
// Live news wire — server-side RSS ingestion from today's editions.
//
// The user-facing requirement: daily current affairs must refer to TODAY's
// sources only. The curated, exam-structured "Today's Brief" lives in the
// in-memory editorial library (src/data/content.ts), but the raw news wire
// below is fetched LIVE from The Hindu's public RSS feeds at request time
// (works on Vercel — plain outbound HTTPS, no SDK required) with a short
// in-memory cache.
// ─────────────────────────────────────────────────────────────────────────────

export interface LiveWireItem {
  title: string
  link: string
  publishedAt: string // ISO
  source: string // "The Hindu · National" etc.
  gsGuess: string // heuristic GS-paper guess for the tag chip
}

export interface LiveWire {
  fetchedAt: string
  items: LiveWireItem[]
}

const FEEDS: { url: string; label: string }[] = [
  { url: 'https://www.thehindu.com/news/national/feeder/default.rss', label: 'The Hindu · National' },
  { url: 'https://www.thehindu.com/news/international/feeder/default.rss', label: 'The Hindu · World' },
  { url: 'https://www.thehindu.com/business/feeder/default.rss', label: 'The Hindu · Business' },
  { url: 'https://www.thehindu.com/opinion/editorial/feeder/default.rss', label: 'The Hindu · Editorial' },
]

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes
const FETCH_TIMEOUT_MS = 7000

const globalCache = globalThis as unknown as {
  __niyateeLiveWire?: { at: number; data: LiveWire }
}

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function tagValue(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
  return m ? decodeEntities(m[1]) : ''
}

/** Heuristic GS-paper guess from headline keywords — for the wire tag chip only. */
function guessGs(title: string): string {
  const t = title.toLowerCase()
  const has = (...ws: string[]) => ws.some((w) => t.includes(w))
  if (has('rbi', 'gst', 'inflation', 'pmi', 'rupee', 'gdp', 'fiscal', 'trade deal', 'tariff', 'bank', 'upi', 'export', 'manufactur', 'price', 'market', ' economy')) return 'GS3 · Economy'
  if (has('supreme court', 'high court', 'bill', 'parliament', 'minister', 'election', 'commission', 'statehood', 'amendment', 'ordinance', 'governor', 'president of india', 'cabinet', 'policy')) return 'GS2 · Polity'
  if (has('isro', 'nasa', 'ai ', 'artificial intelligence', 'quantum', 'semiconductor', 'space', 'satellite', 'vaccine', 'technology', 'launch')) return 'GS3 · S&T'
  if (has('monsoon', 'flood', 'cyclone', 'rain', 'forest', 'wildlife', 'climate', 'pollution', 'imd', 'drought', 'alert')) return 'GS3 · Environment'
  if (has('terror', 'defence', 'army', 'border', 'security', 'police', 'arrest', 'attack', 'banned', 'naxal', 'missile')) return 'GS3 · Security'
  if (has('pakistan', 'china', 'us ', 'u.s.', 'russia', 'summit', 'embassy', 'foreign', 'sri lanka', 'nepal', 'bangladesh', 'unsco', 'united nations', 'treaty', 'bilateral')) return 'GS2 · IR'
  if (has('temple', 'heritage', 'unesc', 'museum', 'centenary', 'history', 'freedom', 'gandhi', 'anniversary')) return 'GS1 · Culture'
  return 'Prelims'
}

function parseFeed(xml: string, label: string): LiveWireItem[] {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1])
  const out: LiveWireItem[] = []
  for (const block of items) {
    const title = tagValue(block, 'title')
    const link = tagValue(block, 'link')
    const pub = tagValue(block, 'pubDate')
    if (!title || !link) continue
    const ts = pub ? new Date(pub).getTime() : NaN
    out.push({
      title,
      link,
      publishedAt: Number.isFinite(ts) ? new Date(ts).toISOString() : new Date().toISOString(),
      source: label,
      gsGuess: guessGs(title),
    })
  }
  return out
}

async function fetchOne(url: string): Promise<string | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NiyateeIAS/1.0; +https://niyateeias.com)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

/** Fetch all wires in parallel; returns null when every feed failed. */
export async function getLiveWire(): Promise<LiveWire | null> {
  const cached = globalCache.__niyateeLiveWire
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.data

  const results = await Promise.all(
    FEEDS.map(async (f) => {
      const xml = await fetchOne(f.url)
      return xml ? parseFeed(xml, f.label) : []
    })
  )
  const merged = results.flat().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  // Keep only genuinely fresh items (last 24h) and cap the wire.
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000
  const fresh = merged.filter((i) => new Date(i.publishedAt).getTime() >= dayAgo).slice(0, 30)

  if (fresh.length === 0) return null
  const data: LiveWire = { fetchedAt: new Date().toISOString(), items: fresh }
  globalCache.__niyateeLiveWire = { at: Date.now(), data }
  return data
}

/** Today's date in IST (the UPSC aspirant's day), independent of server TZ. */
export function istTodayIso(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)
}
