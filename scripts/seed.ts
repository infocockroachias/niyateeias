/* eslint-disable no-console */
/**
 * Niyatee IAS — database seed script.
 * Run: bun run scripts/seed.ts
 * Clears and re-seeds all content tables with domain-accurate UPSC data.
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// ─── date helpers ─────────────────────────────────────────────────────────────
const today = new Date()
function isoDaysAgo(days: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}
function monthKey(offsetMonths: number): { month: number; year: number } {
  const d = new Date(today.getFullYear(), today.getMonth() - offsetMonths, 1)
  return { month: d.getMonth() + 1, year: d.getFullYear() }
}

async function main() {
  console.log('Seeding Niyatee IAS database…')

  // Clear (order matters for FKs)
  await db.bookmark.deleteMany()
  await db.quizAttempt.deleteMany()
  await db.session.deleteMany()
  await db.mcqQuestion.deleteMany()
  await db.newsArticle.deleteMany()
  await db.monthlyNewsDigest.deleteMany()
  await db.resource.deleteMany()
  await db.ranker.deleteMany()
  await db.testimonial.deleteMany()
  await db.book.deleteMany()
  await db.testSeries.deleteMany()
  await db.plan.deleteMany()
  await db.faq.deleteMany()
  await db.course.deleteMany()
  await db.enquiry.deleteMany()
  await db.newsletterSubscriber.deleteMany()
  await db.user.deleteMany()
  console.log('Cleared existing rows.')

  // ─── Courses ────────────────────────────────────────────────────────────────
  const futureDate = (days: number) => {
    const d = new Date(today)
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
  }

  const courses = [
    {
      title: 'GS Foundation Program 2026 — Offline (Bhubaneswar)',
      slug: 'gs-foundation-offline',
      tagline: 'The complete Prelims + Mains journey, classroom-first, at our Bhubaneswar campus.',
      description:
        'Our flagship 12-month General Studies Foundation Program covers the entire UPSC CSE syllabus — Prelims GS & CSAT plus Mains GS-I to GS-IV, Essay and answer writing — through daily classroom sessions at Inn Views, Bhubaneswar. Designed for aspirants who learn best face-to-face, the program blends expert lectures, weekly tests, daily newspaper analysis, and personal mentor check-ins. Students also get full access to the AI learning suite: answer evaluation, doubt agent, MCQ practice and interactive geography maps.',
      mode: 'offline',
      duration: '12 months',
      feeInr: 125000,
      originalFeeInr: 145000,
      features: [
        'Daily 3-hour classroom sessions (Mon–Sat)',
        'Prelims + Mains integrated coverage with 60+ sectional tests',
        'Personal mentor with monthly 1:1 progress reviews',
        'Daily The Hindu & PIB analysis with GS tagging',
        'Free access to all Niyatee AI tools for the course duration',
        'Interview guidance & DAF preparation included',
      ],
      syllabusHighlights: [
        'Indian Heritage, History & World Geography (GS-I)',
        'Governance, Constitution & IR (GS-II)',
        'Economy, Environment, S&T & Security (GS-III)',
        'Ethics, Integrity & Case Studies (GS-IV)',
        'CSAT comprehension, reasoning & quant bootcamp',
        'Essay writing workshops with individual feedback',
      ],
      batchSize: '40 seats per batch',
      tag: 'foundation',
      featured: true,
      startDate: futureDate(21),
      sessionsPerWeek: 6,
    },
    {
      title: 'GS Foundation Program 2026 — Live Online',
      slug: 'gs-foundation-online',
      tagline: 'Same classroom rigour, live from anywhere in India.',
      description:
        'The live-online version of our flagship foundation program streams the same expert-led classes to aspirants across India in real time. Sessions are interactive (ask questions live), recorded for later revision, and supported by weekly doubt-clearing clinics, online tests, and the complete AI tool suite. Ideal for working professionals and college students building UPSC preparation around a busy schedule.',
      mode: 'online-live',
      duration: '12 months',
      feeInr: 89000,
      originalFeeInr: 105000,
      features: [
        'Live interactive classes 6 days a week (evening track available)',
        'All classes recorded with 2-year access',
        'Weekly online doubt clinics with faculty',
        'All-India online test series included',
        'Free access to all Niyatee AI tools for the course duration',
        'Mentor calls every fortnight',
      ],
      syllabusHighlights: [
        'Complete GS Prelims & Mains syllabus coverage',
        'CSAT weekly practice with shortcut methods',
        'Current affairs integration in every module',
        'Answer writing from month 3 onwards',
        'Monthly essay practice with AI + mentor feedback',
        'PYQ deconstruction in every subject',
      ],
      batchSize: '60 seats per batch',
      tag: 'foundation',
      featured: true,
      startDate: futureDate(14),
      sessionsPerWeek: 6,
    },
    {
      title: 'GS Foundation Self-Paced (Recorded)',
      slug: 'gs-foundation-recorded',
      tagline: 'Learn at your rhythm — the full foundation course, on demand.',
      description:
        'A carefully edited recorded version of the GS Foundation Program for aspirants who need complete schedule freedom. Every lecture, test and study material from the classroom program is organised into a structured learning path with milestone assessments. AI tools (answer evaluation, doubt agent, MCQ practice) keep the preparation interactive even without live classes.',
      mode: 'recorded',
      duration: '12 months access',
      feeInr: 49000,
      originalFeeInr: 59000,
      features: [
        '400+ hours of structured recorded lectures',
        'Self-paced milestone tests with instant AI evaluation',
        'Soft-copy study material & monthly current affairs PDFs',
        'AI doubt agent for 24×7 concept clearing',
        'Access to student community & monthly webinars',
        'Upgrade path to live program with fee adjustment',
      ],
      syllabusHighlights: [
        'Module-wise GS coverage matching the live program',
        'Bundled CSAT crash module',
        'PYQ-based revision playlists',
        'Monthly current affairs compilations',
        'Answer-writing demo library',
        'Interview preparation starter kit',
      ],
      batchSize: 'Rolling admission',
      tag: 'foundation',
      featured: false,
      startDate: futureDate(0),
      sessionsPerWeek: 0,
    },
    {
      title: 'Prelims Target 2026 — GS Paper I + CSAT',
      slug: 'prelims-target-2026',
      tagline: 'A ruthless 6-month finishing program for the Prelims cutoff.',
      description:
        'Prelims Target 2026 is an exam-first program built around one goal: clearing GS Paper I and CSAT with a safe margin. The program runs 40+ full-length tests, 20 CSAT sectional tests, daily current affairs MCQs, and two revision cycles of the static syllabus. Every test is followed by a detailed discussion class and AI-powered performance analytics that identify your weakest topics automatically.',
      mode: 'hybrid',
      duration: '6 months',
      feeInr: 29999,
      originalFeeInr: 34999,
      features: [
        '40 full-length GS mocks + 20 CSAT mocks',
        'Daily 10 MCQ current affairs quiz (with AI explanations)',
        'Two complete syllabus revision cycles',
        'Weekly performance report with AI weak-topic detection',
        'PYQ (2011–2025) pattern analysis sessions',
        'Test discussion classes every Sunday',
      ],
      syllabusHighlights: [
        'Polity & Governance rapid revision',
        'Economy & budget-current linkage',
        'Environment & Science-Tech high-yield topics',
        'Map-based geography practice',
        'CSAT quantitative aptitude shortcuts',
        'Reading-comprehension & decision-making drills',
      ],
      batchSize: '50 seats (online) / 40 (offline)',
      tag: 'prelims',
      featured: true,
      startDate: futureDate(10),
      sessionsPerWeek: 5,
    },
    {
      title: 'CSAT Bootcamp (Paper II)',
      slug: 'csat-bootcamp',
      tagline: 'Turn Paper II from a risk into your safety net in 90 days.',
      description:
        'A focused 3-month bootcamp for CSAT — the qualifying paper that removes more aspirants than GS Paper I. The bootcamp rebuilds quantitative aptitude and reasoning from fundamentals, drills reading comprehension through speed techniques, and simulates the exact exam pressure with 20 timed mocks. Taught by faculty who have decoded CSAT patterns since 2015.',
      mode: 'hybrid',
      duration: '3 months',
      feeInr: 14999,
      originalFeeInr: null,
      features: [
        'Topic-wise classes from basic to advanced level',
        '20 full-length CSAT mocks in exam interface',
        'Speed-maths and Vedic-maths shortcut toolkit',
        'Daily RC practice with strategy notes',
        'Previous 10 years CSAT fully solved',
        'Personal diagnostics after every mock',
      ],
      syllabusHighlights: [
        'Percentages, ratio, time-work, time-speed-distance',
        'Data interpretation & basic numeracy',
        'Logical reasoning & puzzles',
        'Reading comprehension frameworks',
        'Decision-making & interpersonal skills',
        'Time-management strategy for 80 questions',
      ],
      batchSize: '60 seats per batch',
      tag: 'csat',
      featured: false,
      startDate: futureDate(30),
      sessionsPerWeek: 4,
    },
    {
      title: 'Mains Answer Writing Program (MAWP) 2026',
      slug: 'mains-answer-writing',
      tagline: 'Write daily. Get evaluated daily. Watch scores climb.',
      description:
        'MAWP is built on one conviction: Mains is won by writing, not reading. Over 16 weeks you answer 5 questions daily from the GS syllabus plus weekly essays; every answer is scored within 24 hours by the AI Evaluation Engine and reviewed by mentors in weekly clinics. The program progressively increases difficulty from 8-mark style questions to full 15-mark UPSC format, with model answers, toppers’ copies and structured feedback on content, structure, analysis and presentation.',
      mode: 'online-live',
      duration: '4 months',
      feeInr: 19999,
      originalFeeInr: 24999,
      features: [
        '5 daily practice questions (GS-I to GS-IV rotation)',
        '24-hour AI evaluation with score + improvements',
        'Weekly 1:1 mentor review of your answer copies',
        'Model answer library (500+ questions)',
        '8 graded essay papers with detailed rubric feedback',
        'Value-addition compendium: data, quotes, committee reports',
      ],
      syllabusHighlights: [
        'Question deconstruction: directive words decoded',
        'Intro-body-conclusion architecture',
        'Diagram, map & flowchart presentation skills',
        'Case-study method for GS-IV',
        'Essay: argumentation & balanced perspectives',
        'Time-bound full-length GS simulation weeks',
      ],
      batchSize: '100 seats per cohort',
      tag: 'mains',
      featured: true,
      startDate: futureDate(18),
      sessionsPerWeek: 6,
    },
    {
      title: 'Ethics, Integrity & Essay Mastery Module',
      slug: 'ethics-essay-module',
      tagline: 'GS-IV and the Essay paper — where 500 marks are decided by clarity of thought.',
      description:
        'A dedicated 8-week module for the two highest-leverage papers: Ethics (GS-IV) and the Essay. Sessions cover ethical theories in exam-applicable language, integrity & governance case studies with solving templates, and the art of writing 1000-word essays with intellectual balance. Includes 20 solved case studies, quote/value-addition bank, and 10 marked essays each with line-by-line mentor comments.',
      mode: 'online-live',
      duration: '2 months',
      feeInr: 11999,
      originalFeeInr: null,
      features: [
        'GS-IV complete syllabus in 24 sessions',
        '20 case studies solved with reusable frameworks',
        '10 essays written & individually marked',
        'Thinkers, quotes & examples value-addition bank',
        'AI evaluation on every practice answer',
        'Weekly live doubt clinics',
      ],
      syllabusHighlights: [
        'Ethics & human interface: attitudes, aptitude, values',
        'Emotional intelligence & civil service values',
        'Probity in governance: RTI, citizen charts, codes',
        'Case-study decision frameworks',
        'Essay structures: philosophical & issue-based',
        'Contemporary ethical issues in administration',
      ],
      batchSize: '80 seats per batch',
      tag: 'mains',
      featured: false,
      startDate: futureDate(25),
      sessionsPerWeek: 4,
    },
    {
      title: 'Interview Guidance Program (DAF to Dashboard)',
      slug: 'interview-guidance',
      tagline: 'Mock boards, DAF mastery, and the confidence to be yourself.',
      description:
        'An 8-week personality development program simulating the UPSC Personality Test end-to-end. It begins with Detailed Application Form (DAF) dissection — every hobby, job and state you list becomes a question bank — followed by at least four full mock boards with retired bureaucrats and senior faculty. Sessions cover current-affairs opinion building, body language, stress handling and answer consistency, each recorded with playback analysis.',
      mode: 'hybrid',
      duration: '2 months (personalised schedule)',
      feeInr: 9999,
      originalFeeInr: null,
      features: [
        '4+ full mock boards with recording & playback review',
        'DAF-based personalised question banks',
        'One-on-one session with retired civil servants',
        'Current-affairs opinion workshops',
        'Hobbies & home-state masterclass (Odisha special)',
        'Post-mock written feedback within 24 hours',
      ],
      syllabusHighlights: [
        'DAF deep-dive: education, work, hobbies, awards',
        'Home state & district dossier preparation',
        'Situational & ethical response frameworks',
        'Medium choice and consistency training',
        'Current affairs for personality test',
        'Final-week confidence & stress management',
      ],
      batchSize: 'Rolling (booked per candidate)',
      tag: 'interview',
      featured: false,
      startDate: futureDate(45),
      sessionsPerWeek: 0,
    },
    {
      title: 'OPSC OCS Foundation (Odisha Civil Services)',
      slug: 'opsc-foundation',
      tagline: 'Odisha’s own civil services exam — taught by Odisha, for Odisha.',
      description:
        'A 10-month integrated program for the OPSC Odisha Civil Services examination covering Prelims Paper-I & II, the Mains papers (Odia language, English, Essay, GS-I to IV) and interview. The curriculum mirrors our UPSC foundation with dedicated Odisha modules — state history, geography, economy, art & culture and current affairs — plus OPSC-specific PYQ analysis and mock tests aligned to the latest OCS pattern.',
      mode: 'hybrid',
      duration: '10 months',
      feeInr: 74999,
      originalFeeInr: 84999,
      features: [
        'Complete OCS Prelims + Mains coverage',
        'Odisha-specific history, geography & economy modules',
        'Odia & English language paper guidance',
        'OPSC PYQ (2011–2024) fully solved',
        'Monthly Odisha current affairs magazine',
        'Interview preparation with state-panel simulation',
      ],
      syllabusHighlights: [
        'Indian & Odisha history with culture focus',
        'Physical & economic geography of Odisha',
        'Polity with Panchayati Raj emphasis',
        'Odisha economy, schemes & budget',
        'General science & environment for OPSC',
        'Essay & comprehension practice',
      ],
      batchSize: '40 seats per batch',
      tag: 'opsc',
      featured: false,
      startDate: futureDate(35),
      sessionsPerWeek: 5,
    },
    {
      title: 'Optional Subject: Sociology (Foundation + Test Series)',
      slug: 'optional-sociology',
      tagline: 'The high-scoring, overlap-rich optional — Paper I & II complete.',
      description:
        'A complete optional-subject program for Sociology covering Paper I (fundamentals of sociology) and Paper II (Indian society) in 16 weeks. Classes emphasise answer-oriented sociology: thinkers simplified, contemporary Indian examples, and diagram/flowchart presentation. Includes 8 sectional tests and 4 full-length mock papers per paper, all AI-evaluated with mentor moderation.',
      mode: 'online-live',
      duration: '4 months',
      feeInr: 24999,
      originalFeeInr: 29999,
      features: [
        'Paper I & II complete in 80+ sessions',
        'Thinkers made simple with application maps',
        '8 sectional + 8 full-length evaluated tests',
        'Contemporary India example bank (data, reports, cases)',
        'Handwritten toppers’ notes digitised',
        'PYQ trend analysis 2015–2025',
      ],
      syllabusHighlights: [
        'Sociology — the discipline: thinkers & concepts',
        'Research methods & analysis',
        'Social structure: caste, class, tribe, family',
        'Social change, movements & modernisation',
        'Indian society: unity, diversity, challenges',
        'Women, population, religion & development',
      ],
      batchSize: '50 seats per batch',
      tag: 'mains',
      featured: false,
      startDate: futureDate(28),
      sessionsPerWeek: 4,
    },
  ]
  for (const c of courses) {
    const { features, syllabusHighlights, ...rest } = c
    await db.course.create({
      data: {
        ...rest,
        featuresJson: JSON.stringify(features),
        syllabusJson: JSON.stringify(syllabusHighlights),
      },
    })
  }
  console.log(`Courses: ${courses.length}`)

  // ─── News articles (dates relative to today, spread over ~45 days) ──────────
  type MainsQ = { text: string; marks: number; words: number; directive: string }
  type Seed = {
    d: number
    title: string
    summary: string
    content: string
    source: string
    gsTag: string
    subject: string
    readMinutes: number
    tags: string[]
    prelims?: string[]
    mains?: string[]
    keywords?: string[]
    mainsQ?: MainsQ
  }
  const N = (
    d: number,
    title: string,
    summary: string,
    source: string,
    gsTag: string,
    subject: string,
    readMinutes: number,
    tags: string[],
    content: string
  ): Seed => ({ d, title, summary, content, source, gsTag, subject, readMinutes, tags })
  /** NB — structured "Today's Brief" article with exam curation. */
  const NB = (
    d: number,
    title: string,
    summary: string,
    source: string,
    gsTag: string,
    subject: string,
    readMinutes: number,
    tags: string[],
    structured: { prelims: string[]; mains: string[]; keywords: string[]; mainsQ: MainsQ },
    content: string
  ): Seed => ({ d, title, summary, content, source, gsTag, subject, readMinutes, tags, ...structured })

  const news: Seed[] = [
    /* ─────── TODAY'S BRIEF — structured current affairs (d = 0) ─────── */
    NB(0, 'India will always support Sri Lanka’s progress and prosperity: Jaishankar after meeting JVP leadership', 'External Affairs Minister S. Jaishankar met Janatha Vimukthi Peramuna General Secretary Tilvin Silva and reaffirmed India’s development partnership with Sri Lanka under the NPP government.', 'The Hindu', 'GS2', 'International Relations', 4, ['Sri Lanka', 'Neighbourhood First', 'JVP', 'SAGAR'],
      {
        prelims: [
          'JVP — Janatha Vimukthi Peramuna; main party of the NPP alliance that won the 2024 presidential and parliamentary elections.',
          'Palk Strait and Gulf of Mannar separate India (Tamil Nadu) from Sri Lanka; Indo-Sri Lanka maritime boundary agreements 1974 & 1976 (Katchatheevu).',
          '13th Amendment (1987) flowed from the Indo–Sri Lanka Accord and created provincial councils.',
        ],
        mains: [
          'GS2 — Neighbourhood First in action: ~$4 bn Indian support during the 2022 crisis, currency swaps, lines of credit and UPI–LankaPay integration.',
          'GS2 — Balancing act: the NPP government maintains pragmatic ties with both India and China (Hambantota, Colombo port terminals).',
          'GS2 — Unresolved files: 13th Amendment implementation (Tamil question), fishermen arrests in the Palk Strait, Trincomalee energy hub.',
        ],
        keywords: ['Neighbourhood First', 'SAGAR', 'JVP / NPP', '13th Amendment', 'Palk Strait', 'Trincomalee'],
        mainsQ: {
          text: 'India’s engagement with Sri Lanka’s new political leadership is a test of Neighbourhood First diplomacy. Discuss the strategic and economic stakes for both countries.',
          marks: 10, words: 150, directive: 'Discuss',
        },
      },
      `External Affairs Minister S. Jaishankar, after a meeting with Janatha Vimukthi Peramuna (JVP) General Secretary Tilvin Silva, said India \u201cwill always support Sri Lanka\u2019s progress and prosperity\u201d and described the conversation as one on \u201cstrengthening our deep bonds of friendship.\u201d\n\nThe meeting signals continuity in New Delhi\u2019s outreach to the National People’s Power (NPP) government that came to power in 2024, at a time when Colombo is consolidating its post-crisis economic recovery. India anchored the 2022 rescue with roughly $4 billion in swaps, credit lines and deferred payments, and has since pushed connectivity projects — UPI acceptance in Sri Lanka, the Trincomalee oil-tank farm, and ferry links across the Palk Strait.\n\nFor the exam: the Sri Lanka file bundles three recurring GS2 themes — neighbourhood diplomacy, the China factor (Hambantota lease, port investments), and the unfinished Tamil question tied to the 13th Amendment. The fishermen issue in the Palk Strait remains the most human recurring friction.`),
    NB(0, 'The young and the satyagraha — Gen-Z protests draw on Gandhian ideas', 'At the recent protests at Jantar Mantar and in subsequent agitations, the country’s youth have consciously invoked Gandhian truth and non-violence — a reminder that satyagraha remains a living political technology.', 'The Hindu', 'GS1', 'History / Society', 5, ['Gandhi', 'Satyagraha', 'Gen-Z', 'Non-violence'],
      {
        prelims: [
          'Satyagraha (\u201cholding to truth\u201d) first applied in South Africa (1906) and in India at Champaran, 1917.',
          'Dandi March: 12 March–6 April 1930 — violation of the salt law as the symbol of civil disobedience.',
          'Gandhi’s constructive programme: khadi, communal unity, village sanitation, basic education (Nai Talim).',
        ],
        mains: [
          'GS1 — Gandhi converted nationalism from elite petitioning to disciplined mass moral politics; compare the methods of NCM and CDM.',
          'Essay — Non-violence in the digital age: amplification without organisation risks spectacle without change.',
          'GS4 — Means–ends unity: why Gandhi rejected \u201cgoals justify methods\u201d reasoning.',
        ],
        keywords: ['Satyagraha', 'Ahimsa', 'Civil Disobedience', 'Constructive Programme', 'Gandhi Jayanti', 'Youth Politics'],
        mainsQ: {
          text: '\u201cNon-violence is the weapon of the strong.\u201d Critically examine the continuing relevance of Gandhian satyagraha for contemporary youth movements.',
          marks: 10, words: 150, directive: 'Critically examine',
        },
      },
      `The Hindu’s opinion page notes that at the recent protests at Jantar Mantar — and in the wider wave of Gen-Z agitations across democracies — the country’s youth have drawn explicitly on Gandhian ideas: truth as testimony, non-violence as discipline, and the willingness to absorb suffering rather than inflict it.\n\nGandhi’s method was never passive; it was a trained technique — volunteers pledged to non-violence, marches were rehearsed, and every campaign paired protest with a constructive programme (khadi, sanitation, education). The satyagraha vocabulary gave ordinary people a script for moral courage.\n\nOn the eve of Gandhi Jayanti, the continuity is worth framing for Mains: whether today’s digitally-organised movements can convert moral energy into institutional change — the step from protest to constructive politics — is the Gandhian test they now face.`),
    NB(0, 'Four in five Mumbaikars unwilling to pay MDR on high-value UPI payments: LocalCircles survey', 'A LocalCircles survey finds most Mumbai residents will switch to cards or cash rather than pay the merchant discount rate on UPI transactions above \u20B92,000, set to take effect from 15 October.', 'The Hindu', 'GS3', 'Economy', 5, ['UPI', 'MDR', 'NPCI', 'Digital Payments'],
      {
        prelims: [
          'UPI — Unified Payments Interface, built and operated by NPCI (est. 2008), launched 2016.',
          'MDR — Merchant Discount Rate: fee charged to merchants on digital transactions; zero-MDR on UPI was mandated from January 2020.',
          'Digital Rupee (e\u20B9) — RBI’s CBDC; wholesale pilot Nov 2022, retail Dec 2022.',
        ],
        mains: [
          'GS3 — The zero-MDR subsidy universalised UPI but its infrastructure costs now sit with banks and the exchequer; cost-recovery risks adoption losses.',
          'GS3 — Digital Public Infrastructure economics: who pays for free rails — interchange fees, public funding, or merchant charges?',
          'GS3 — Behavioural angle: payment-instrument switching (cards/cash) could erode the digital trail that UPI created.',
        ],
        keywords: ['UPI', 'MDR', 'NPCI', 'Digital Public Infrastructure', 'LocalCircles', 'e\u20B9 / CBDC'],
        mainsQ: {
          text: 'Examine the trade-offs between universalising zero-cost digital payments and sustaining the economics of payment infrastructure in India.',
          marks: 10, words: 150, directive: 'Examine',
        },
      },
      `A LocalCircles survey of Mumbai residents finds four in five unwilling to bear the merchant discount rate (MDR) that is set to apply on UPI payments above \u20B92,000 from 15 October 2026 — many say they will simply shift to cards or cash rather than pay the fee or absorb a pass-through.\n\nThe policy tension is real: zero-MDR, mandated in January 2020, made UPI omnipresent — from street vendors to malls — but somebody must fund the rails, fraud prevention and interbank settlement. Options on the table include tiered MDR, explicit public funding of DPI, and interchange on high-value merchant payments only.\n\nFor Prelims, keep the dates and bodies precise: NPCI 2008, UPI 2016, zero-MDR January 2020, CBDC pilots 2022. For Mains, the question is institutional: can India keep its payments public good free at the point of use without starving the infrastructure that delivers it?`),
    NB(0, 'ECI appointments case: petitioner seeks recall of split verdict on 2023 law challenge', 'In the ongoing challenge to the CEC and ECs (Appointment) Act, 2023, counsel for the petitioner sought mention before the CJI to recall a split verdict that had declined to refer the constitutional question.', 'The Hindu', 'GS2', 'Polity', 4, ['Election Commission', 'Article 324', 'CEC Act 2023', 'Split Verdict'],
      {
        prelims: [
          'Article 324 — superintendence, direction and control of elections vests in the ECI (CEC + 2 ECs since 1993).',
          'Anoop Baranwal (2023) interim formula: PM + Leader of Opposition (Lok Sabha) + CJI until Parliament legislates.',
          'CEC and Other ECs (Appointment...) Act, 2023: committee of PM + LoP + a Union Minister nominated by the PM; tenure 6 years or 65 years.',
        ],
        mains: [
          'GS2 — Appointment design determines institutional autonomy: compare the 2023 statute with the Anoop Baranwal interim arrangement.',
          'GS2 — Split verdicts and Article 143-style references: how should benches of equal strength be broken in constitutional cases?',
          'GS2 — Electoral reforms bundle: simultaneous elections, model code statutory backing, campaign-finance transparency.',
        ],
        keywords: ['ECI', 'Article 324', 'CEC & EC Act 2023', 'Anoop Baranwal', 'Split Verdict', 'Electoral Reforms'],
        mainsQ: {
          text: 'Independent selection of Election Commissioners is central to electoral integrity. Examine the design choices before India in light of the 2023 appointment law and the pending litigation.',
          marks: 10, words: 150, directive: 'Examine',
        },
      },
      `The Supreme Court’s ECI-appointments litigation has entered a procedural phase: the petitioner has sought to mention before the Chief Justice a plea to recall the split verdict that kept the constitutional validity challenge of the CEC and ECI (Appointment, Conditions of Service and Term of Office) Act, 2023 from being referred to a larger bench.\n\nThe substantive stakes are unchanged. The 2023 statute replaced the Chief Justice of India with a government-nominated Union Minister in the selection committee — reversing the Anoop Baranwal interim formula — and critics argue this diminishes the Commission’s independence under Article 324.\n\nFor Mains, frame the issue as institutional design: who selects the referees decides how referees behave. Pair the case with broader electoral-reform demands — transparency in campaign finance, model-code statutory backing, and simultaneous elections debates.`),
    NB(0, 'GST mop-up grows 14.7% to over \u20B92.03 lakh crore in September', 'September 2026 GST collections crossed \u20B92.03 lakh crore, up 14.7% year-on-year on festive demand, even as refunds slowed 3% to \u20B927,001 crore.', 'The Hindu', 'GS3', 'Economy', 4, ['GST', 'Tax Collections', 'Festive Demand', 'GST Council'],
      {
        prelims: [
          'GST — 101st Constitutional Amendment (2016); Articles 246A (concurrent power) and 279A (GST Council).',
          'GST Council weighted voting: Centre 1/3, States 2/3; decisions by 3/4 majority.',
          'Post-2025 rationalisation: two primary slabs (5% and 18%) plus a 40% demerit rate.',
        ],
        mains: [
          'GS3 — Compliance tailwinds: festive demand, invoice-matching maturity and the 2025 rate rationalisation pulling informal sales into the net.',
          'GS3 — Next frontier: base-broadening (petroleum, real-estate stamp duties), GSTAT efficiency, decriminalisation for small taxpayers.',
          'GS2 — Mohit Minerals (2022): GST Council recommendations as cooperative-federalism dialogue, not diktat.',
        ],
        keywords: ['GST', 'GST Council', 'Compensation Cess', 'Festive Demand', 'GSTAT', 'Base Broadening'],
        mainsQ: {
          text: 'Robust GST collections are necessary but not sufficient for a mature indirect-tax regime. Analyse the structural reforms that remain on the agenda.',
          marks: 15, words: 250, directive: 'Analyse',
        },
      },
      `Goods and Services Tax collections for September 2026 crossed \u20B92.03 lakh crore — a 14.7% year-on-year jump — as festive-season demand combined with the compliance gains of the 2025 rate rationalisation. Refunds, however, slowed 3% to \u20B927,001 crore, a point enforcement economists watch closely since refund delays tax working capital.\n\nRead the number with three lenses. First, demand: double-digit nominal growth tracks the manufacturing PMI upcycle and festival calendar. Second, structure: the two-slab (5%/18%) + 40% demerit architecture simplified classification disputes but left base-broadening unfinished — petroleum and real-estate stamp duties remain outside. Third, federalism: the GST Council’s consensus habit is under quiet strain as compensation-cess borrowing memories fade.\n\nExam hook: pair this with the Mohit Minerals verdict (Council recommendations = persuasion, not binding) for a GS2–GS3 composite answer.`),
    NB(0, 'Manufacturing growth hits seven-month high in September on strong demand: PMI', 'The HSBC India Manufacturing PMI rose to its strongest reading since February as electronics, food, pharma and textiles pushed sales growth higher and export orders quickened.', 'The Hindu', 'GS3', 'Economy', 4, ['PMI', 'Manufacturing', 'Exports', 'IIP'],
      {
        prelims: [
          'PMI — diffusion index from S&P Global (HSBC-sponsored); above 50 = month-on-month expansion.',
          'IIP — Index of Industrial Production (NSO, base 2011-12); manufacturing weight ~77.6%.',
          'Eight core industries ≈ 40% of IIP weight.',
        ],
        mains: [
          'GS3 — Festive-demand multipliers: electronics assembly, pharma and textiles leading the September print; export orders to Brazil and beyond quickening.',
          'GS3 — Survey vs production data: why PMI sentiment can diverge from IIP volumes, and how to read both together.',
          'GS3 — Policy link: PLI output incentives and logistics reform feeding into order books.',
        ],
        keywords: ['PMI', 'IIP', 'Core Industries', 'Export Orders', 'Festive Demand', 'PLI'],
        mainsQ: {
          text: 'High-frequency survey indicators are reshaping industrial policy feedback loops faster than official statistics can. Examine the strengths and gaps of India\u2019s data infrastructure.',
          marks: 10, words: 150, directive: 'Examine',
        },
      },
      `India’s manufacturing sector expanded at its fastest pace in seven months in September 2026, with the HSBC Manufacturing PMI benefiting from strong demand across electronics, food, pharma and textiles; total sales growth touched its best level since February and export orders quickened, including from clients in Brazil.\n\nContrast this with July’s five-year-low PMI print amid challenging market conditions — the swing illustrates why single-month readings need trend context. PMI captures sentiment (new orders, output, employment, delivery times, stocks) while the IIP measures physical production with a lag; policy desks read both.\n\nExam hook: for a GS3 answer, connect the demand recovery to PLI-driven electronics capacity, festive retail, and the logistics-cost push (Gati Shakti + National Logistics Policy), then flag the data-infrastructure gap — a new IIP base series is overdue.`),
    NB(0, 'Bitter pills: Supreme Court intervenes in drug pricing by retailers', 'The Supreme Court did well to intervene in drug pricing by retailers — mark-ups on essential medicines, not just maximum prices, determine affordability, writes The Hindu in its editorial.', 'The Hindu', 'GS2', 'Governance / Health', 4, ['Drug Pricing', 'NPPA', 'DPCO', 'Essential Medicines'],
      {
        prelims: [
          'NPPA — National Pharmaceutical Pricing Authority (1997): caps ceiling prices of scheduled formulations under DPCO 2013.',
          'DPCO — Drugs (Prices Control) Order, 2013 under Essential Commodities Act, 1955.',
          'National List of Essential Medicines (NLEM) 2022 — 384 medicines.',
        ],
        mains: [
          'GS2 — Affordability chain: manufacturer ceiling price + trade margin + retail mark-up; regulating only the first link misses the patient’s bill.',
          'GS2 — Trade-margins caps (cardiac stents, knee implants precedents) as precedent for a margins-first pricing policy.',
          'GS3 — Innovation vs access: price control and its effect on pharma R&D incentives.',
        ],
        keywords: ['NPPA', 'DPCO 2013', 'NLEM', 'Trade Margins', 'Essential Medicines', 'Supreme Court'],
        mainsQ: {
          text: 'Affordable medicines depend on regulating margins along the supply chain, not merely ceiling prices. Discuss with reference to India\u2019s drug-pricing architecture.',
          marks: 10, words: 150, directive: 'Discuss',
        },
      },
      `The Hindu’s editorial \u201cBitter pills\u201d welcomes the Supreme Court’s intervention in how retailers price drugs: ceiling prices under the DPCO 2013 cap the manufacturer’s charge for scheduled (essential) formulations, but the final pharmacy bill is shaped by successive trade and retail mark-ups.\n\nThe intervention revives a policy conversation India has had before — the cardiac-stent and knee-implant trade-margin caps of 2017 showed the State can regulate the whole chain, not just the factory gate. With out-of-pocket spending still above 40% of health expenditure, the marginal rupee saved at the pharmacy counter matters more than headline price statistics.\n\nExam hook: pair NPPA/DPCO/NLEM facts for Prelims with a GS2 argument — health as a right requires price-chain regulation plus generic-quality assurance (Jan Aushadhi), and a GS3 note on innovation incentives.`),
    NB(0, 'Five “sympathisers” of banned outfit arrested in Thanjavur; one more sought', 'Tamil Nadu’s State police arrested alleged sympathisers of the banned Hizb-ut-Tahrir (HuT) in Thanjavur; the Special Investigation Unit is searching for another suspect.', 'The Hindu', 'GS3', 'Internal Security', 3, ['UAPA', 'Hizb-ut-Tahrir', 'Banned Outfit', 'Radicalisation'],
      {
        prelims: [
          'UAPA 1967 (as amended 2019) — Centre may declare \u201cunlawful associations\u201d (Sec 3) and \u201cterrorist organisations\u201d (First Schedule, Sec 35).',
          'HuT — Hizb-ut-Tahrir, declared an unlawful association in India in 2024; advocates a transnational caliphate.',
          'UAPA Tribunal — a sitting High Court judge reviews banning notifications within 6 months.',
        ],
        mains: [
          'GS3 — Online radicalisation pipelines: small-cell formation, encrypted propaganda, and the shift from mass-mobilisation to micro-targeting.',
          'GS3 — Safeguards debate: bail thresholds under Sec 43D(5), tribunal review, and the proportionality of speech-linked prosecutions.',
          'GS3 — De-radicalisation architecture: community policing, deradicalisation counselling, rehabilitative reintegration.',
        ],
        keywords: ['UAPA', 'HuT', 'Unlawful Association', 'Radicalisation', 'NIA', 'Counter-Terrorism'],
        mainsQ: {
          text: 'Recent arrests of banned-outfit modules highlight the challenge of online radicalisation. Evaluate India\u2019s counter-radicalisation framework and its civil-liberties safeguards.',
          marks: 10, words: 150, directive: 'Evaluate',
        },
      },
      `Tamil Nadu police’s Special Investigation Unit arrested five alleged sympathisers of the banned Hizb-ut-Tahrir in Thanjavur, with one more suspect being traced. HuT — which campaigns for a transnational Islamic caliphate and was declared an unlawful association in India in 2024 — has repeatedly surfaced in southern-India modules operating through encrypted online networks.\n\nThe case is a textbook GS3 internal-security item: the legal machinery (UAPA notification, tribunal review, First Schedule listing), the intelligence architecture (State ATS + NIA + Multi-Agency Centre), and the harder question — prevention. Radicalisation today is micro-targeted and digital; counter-strategy must combine platform takedowns, community policing and credible de-radicalisation counselling without criminalising ordinary religious expression.\n\nFor Prelims: UAPA amendments 2019 allowed designating individuals as terrorists and empowered NIA seizure; Sec 43D(5) makes bail conditional on a prima-facie test.`),
    NB(0, 'Keralam rains: IMD sounds orange alert for three districts', 'The IMD issued an orange alert for three Kerala districts with yellow alerts for six others as heavy monsoon-swan-song showers continued; disaster-management agencies moved to preparedness footing.', 'The Hindu', 'GS3', 'Disaster Management', 3, ['IMD', 'Orange Alert', 'Kerala', 'Monsoon'],
      {
        prelims: [
          'IMD colour codes: Green (no warning) → Yellow (be updated) → Orange (be prepared) → Red (take action).',
          'Northeast (retreating) monsoon: October–December; Tamil Nadu coast gets the bulk of its rain from it.',
          'Kerala’s orographic rainfall: Western Ghats forcing on south-westerly streams.',
        ],
        mains: [
          'GS3 — Monsoon-withdrawal phase extremes: warming Arabian Sea and delayed withdrawal intensifying October rainfall events.',
          'GS3 — Preparedness chain: early warning → last-mile dissemination → evacuation → relief; where the chain snaps.',
          'GS1 — Western Ghats ecology and landslide-prone slopes as risk multipliers (Wayanad 2024 precedent).',
        ],
        keywords: ['IMD', 'Orange Alert', 'Northeast Monsoon', 'Disaster Preparedness', 'Western Ghats', 'Urban Flooding'],
        mainsQ: {
          text: '\u201cAn early warning without preparedness is an alarm without a plan.\u201d Discuss the disaster-risk-reduction chain for monsoon extremes in Kerala.',
          marks: 10, words: 150, directive: 'Discuss',
        },
      },
      `The IMD sounded an orange alert — \u201cbe prepared\u201d — for three Keralam districts and yellow alerts for six more (Thiruvananthapuram, Kollam, Ernakulam, Palakkad, Malappuram, Wayanad) as heavy showers persisted into the withdrawal phase of the monsoon.\n\nTwo exam angles. Geography: Kerala’s rain is orographic — Western Ghats squeeze south-westerly moisture — and October events increasingly reflect a warming Arabian Sea plus delayed monsoon withdrawal. Governance: the alert ladder (green-yellow-orange-red) only saves lives when the chain after the warning works — pre-positioned NDRF/SDRF teams, flood-shelter mapping, dam-rule coordination, and ward-level drills.\n\nFor Prelims, memorise the colour codes and the northeast-monsoon window (Oct–Dec).`),
    NB(0, 'Productive discussion with USTR Greer on early conclusion of trade deal: Goyal', 'Commerce Minister Piyush Goyal described talks with USTR Jamieson Greer as productive as both sides push for an early conclusion of the India–US trade agreement; the leaders reviewed ties by phone the same day.', 'The Hindu', 'GS2', 'International Relations', 4, ['India-US', 'USTR', 'Trade Deal', 'Tariffs'],
      {
        prelims: [
          'USTR — Office of the United States Trade Representative (Executive Office of the President).',
          'iCET (2023) → TRUST (2025) technology partnership; Trade Policy Forum (TPF) is the trade dialogue track.',
          'India–US goods trade ≈ $120 bn; goods+services ≈ $190 bn.',
        ],
        mains: [
          'GS2 — Tariff-cycle diplomacy: reciprocal-tariff frictions (2025-26) vs convergence on defence tech, semiconductors and critical minerals.',
          'GS3 — Export exposure: textiles, pharma and shrimp among the tariff-sensitive baskets; supply-chain diversification as insurance.',
          'GS2 — Strategic pairing: trade peace anchoring the broader Indo-Pacific alignment (Quad, Malabar).',
        ],
        keywords: ['USTR', 'Trade Policy Forum', 'TRUST', 'Tariffs', 'Indo-Pacific', 'Supply Chains'],
        mainsQ: {
          text: 'Trade peace is the anchor of the India\u2013US strategic partnership. Examine the current negotiation dynamics and the sectors most exposed to tariff cycles.',
          marks: 10, words: 150, directive: 'Examine',
        },
      },
      `Commerce and Industry Minister Piyush Goyal said he held a \u201cproductive discussion\u201d with US Trade Representative Jamieson Greer on the early conclusion of the India–US trade deal, on a day the two heads of government reviewed bilateral cooperation over a phone call.\n\nThe negotiation has run through a tariff-heavy cycle: US reciprocal-tariff actions since 2025 squeezed Indian exports in textiles, pharma margins and marine products, while both sides converged on technology supply chains — semiconductor fabs and packaging, defence co-production (jet engines, INDUS-X), and critical minerals.\n\nExam framing: India’s ask-list centres on tariff relief and H-1B-type mobility stability; the US asks market access in agriculture/dairy, digital-trade rules and energy. For GS2, link the deal to the TRUST/TPF architecture and the Quad backdrop — trade calm as the ballast of strategic ties.`),
    NB(0, 'Google launches Gemini 4 “Argon” with strict cyber and CBRN refusal guardrails', 'Google released Gemini 4 “Argon” to a select group, saying the frontier model is designed to refuse requests that could assist cyberattacks or chemical, biological, radiological or nuclear weapons development.', 'The Hindu', 'GS3', 'Science & Technology', 4, ['Gemini 4 Argon', 'Frontier AI', 'AI Safety', 'Refusal Training'],
      {
        prelims: [
          'Generative AI — models producing text/code/images; \u201cfrontier\u201d = highest-capability class.',
          'Refusal training — aligning models to decline dangerous requests (cyber intrusion, CBRN uplift).',
          'India: DPDP Act 2023 (data protection); IndiaAI Mission 2024 (\u20B910,371 crore); IT Rules advisories on deepfake labelling.',
        ],
        mains: [
          'GS3 — Safety frontier: red-teaming, refusal training, provenance watermarking (C2PA) as the emerging global baseline.',
          'GS3 — \u201cRegulate use, not research\u201d: India’s principles-based approach vs the EU AI Act’s horizontal statute.',
          'GS2 — Election integrity: synthetic media, deepfakes and the EC’s advisory framework.',
        ],
        keywords: ['Frontier AI', 'Refusal Training', 'C2PA', 'DPDP Act 2023', 'IndiaAI Mission', 'Deepfakes'],
        mainsQ: {
          text: '\u201cRegulate the use, not the research.\u201d Critically evaluate India\u2019s approach to frontier-AI safety in the light of global refusal-training and watermarking standards.',
          marks: 10, words: 150, directive: 'Critically evaluate',
        },
      },
      `Google announced Gemini 4 \u201cArgon\u201d, released to a select group, with a headline safety claim: the model is engineered to refuse requests that could enable cyberattacks or the development of chemical, biological, radiological or nuclear (CBRN) weapons.\n\nThe launch sharpens the frontier-safety debate India must navigate. Refusal training and provenance watermarking (C2PA-style) are becoming the global baseline; the EU’s AI Act legislates horizontally while India has preferred a capability-plus-advisory stack — IndiaAI Mission compute and datasets, the DPDP Act 2023 for privacy, and IT-rules advisories on deepfake labelling during elections.\n\nGS3 framing: weigh innovation-led growth (GCC boom, AI services exports) against misuse risks (deepfake fraud, \u201cdigital arrest\u201d scams, bio-uplift), and argue the institutional middle — sandboxed enforcement, standards adoption, and liability clarity.`),
    NB(0, 'Kochi Corporation to update tree registry after row over unauthorised felling', 'Following a controversy over unauthorised tree felling, Kochi Corporation announced an update to its tree registry — the first census was in 2010, the latest in 2019.', 'The Hindu', 'GS3', 'Environment / Urban Governance', 3, ['Tree Census', 'Urban Forestry', 'Kochi', 'Municipal Governance'],
      {
        prelims: [
          'Tree census — ward-wise geo-tagged inventory of street and compound trees; Kochi’s first: 2010, latest: 2019.',
          '74th Amendment (1992) — municipalities as constitutional third tier (Part IX-A, 12th Schedule: 18 subjects incl. urban forestry).',
          'Urban greening programmes: Nagar Van Yojana (2020), Smart Cities missions.',
        ],
        mains: [
          'GS3 — Urban forests as climate infrastructure: heat-island moderation, storm-water absorption, biodiversity refuges.',
          'GS2 — Municipal capacity deficit: why 6-9 year census cycles leave cities blind to felling; data as governance.',
          'GS3 — Compensation-plantation economics and the audit of survival rates, not sapling counts.',
        ],
        keywords: ['Tree Census', 'Urban Forestry', '74th Amendment', 'Heat Island', 'Nagar Van Yojana', 'Green Audit'],
        mainsQ: {
          text: 'Urban forests are climate infrastructure, and registries are their inventory. Discuss how municipal data systems can strengthen green governance in Indian cities.',
          marks: 10, words: 150, directive: 'Discuss',
        },
      },
      `Kochi Corporation will update its tree registry after a public row over unauthorised felling — a small civic story with a large governance lesson. The city’s first tree census was conducted in 2010 and the latest in 2019; a five-to-nine-year blind spot is exactly the window in which construction-season felling escapes scrutiny.\n\nGeo-tagged, ward-wise tree inventories are the base layer of green governance: they enable canopy targets, heat-island mapping, and honest compensation-plantation audits (survival rates, not sapling counts). The 12th Schedule explicitly lists urban forestry among municipal functions, yet most corporations lack the GIS and enforcement staffing to maintain such data.\n\nExam hook: Prelims — 74th Amendment, 12th Schedule, Nagar Van Yojana. Mains/GS2-GS3 — data infrastructure as the difference between decorative and functional urban ecology.`),

    /* ─────── Recent days (d = 1, 2) — structured ─────── */
    NB(1, 'State of anticipation: J&K statehood should follow without further delay', 'The Hindu argues Jammu and Kashmir should be given its statehood without any further delay, honouring parliamentary assurances and federal principle.', 'The Hindu', 'GS2', 'Polity', 4, ['Jammu & Kashmir', 'Statehood', 'Federalism'],
      {
        prelims: [
          'J&K Reorganisation Act, 2019 — State bifurcated into UT of J&K (with legislature) and UT of Ladakh (without).',
          'Article 3 — Parliament may form new States and alter areas/boundaries by simple majority (recommendation of President).',
          'Re: Article 370 (Dec 2023) — SC upheld abrogation; directed elections and indicated statehood restoration.',
        ],
        mains: [
          'GS2 — Federal promise-keeping: explicit parliamentary assurances on statehood restoration and their constitutional weight.',
          'GS2 — UT-with-legislature as a constitutional oddity: democratic deficits of dual control (Lt Governor vs elected government).',
          'GS2 — Delimitation → elections → statehood sequencing as the normalisation pathway.',
        ],
        keywords: ['Statehood', 'J&K Reorganisation Act 2019', 'Article 3', 'Union Territory', 'Delimitation', 'Federalism'],
        mainsQ: {
          text: 'Restoring statehood to Jammu and Kashmir is a federal imperative, not a favour. Discuss.',
          marks: 10, words: 150, directive: 'Discuss',
        },
      },
      `The Hindu’s editorial \u201cState of anticipation\u201d argues that Jammu and Kashmir should be given its statehood without any further delay. The region has functioned as a Union Territory with a legislature since the 2019 Reorganisation Act — a hybrid that concentrates executive power in the Lt Governor while an elected government competes for bounded authority.\n\nThe Supreme Court in Re: Article 370 (December 2023) upheld the abrogation but pointed towards restoration; the elected government elected in 2024 has repeatedly sought the pledge’s honouring. The editorial’s constitutional logic: explicit parliamentary assurances carry federal weight, and Article 3’s flexibility is precisely what makes restoration administratively easy.\n\nExam hook: GS2 — UT vs State design, federal promise-keeping, and the delimitation-elections-statehood sequence.`),
    NB(1, 'Ground control: ISRO must keep space technology focused as a development tool', 'The editorial makes the case that ISRO’s compass should remain development — communications, navigation, weather, and resource mapping — even as it courts prestige missions and a commercial ecosystem.', 'The Hindu', 'GS3', 'Science & Technology', 4, ['ISRO', 'Space Policy', 'IN-SPACe', 'NavIC'],
      {
        prelims: [
          'Indian Space Policy 2023 — ISRO (R&D), IN-SPACe (authorisation/promotion), NSIL (commercial), private sector (end-to-end missions).',
          'NavIC/IRNSS — 7-satellite regional constellation; services: positioning, timing, messaging.',
          'Applications satellites: INSAT/GSAT comms, RISAT/Cartosat imaging, Oceansat — the development backbone.',
        ],
        mains: [
          'GS3 — Development dividends: tele-education (EDUSAT legacy), telemedicine, fisheries PFZ advisories, crop insurance imagery.',
          'GS3 — Commercial frontier: NSIL demand-driven models, private launchers (SSLV handover), FDI liberalisation 2024.',
          'GS3 — Balance: prestige missions (human spaceflight) vs utilitarian constellations — budget allocation logic.',
        ],
        keywords: ['ISRO', 'Indian Space Policy 2023', 'IN-SPACe', 'NSIL', 'NavIC', 'Space Economy'],
        mainsQ: {
          text: 'Space technology must remain a tool of development, not only of prestige. Examine ISRO\u2019s application-satellite legacy in the light of the commercial-space transition.',
          marks: 10, words: 150, directive: 'Examine',
        },
      },
      `The Hindu’s editorial \u201cGround control\u201d argues that ISRO’s focus should remain space technology as a tool for development. The agency’s quiet revolution has been utilitarian: communications satellites carrying education and telemedicine, navigation (NavIC) guiding transport and fishing, weather satellites feeding cyclone warnings that cut fatalities to near zero on the east coast, and remote-sensing imagery powering crop insurance and groundwater mapping.\n\nThe counterweight is momentum towards prestige and commerce — human spaceflight, a space station by 2035, and a private-launch ecosystem under IN-SPACe with NSIL as the commercial arm. The editorial’s caution: the development dividend should not become a rounding error in the pursuit of visibility.\n\nExam hook: GS3 — Indian Space Policy 2023’s four-institution architecture, FDI slabs, and the applications-vs-prestige budget debate.`),
    NB(1, 'Silver lining: India finishes second to Uzbekistan at Chess Olympiad in Samarkand', 'India’s runners-up finish at the Samarkand Chess Olympiad should not dispirit, The Hindu writes — the depth of India’s young chess talent remains the story of the decade.', 'The Hindu', 'GS1', 'Sports / Society', 3, ['Chess Olympiad', 'Samarkand', 'FIDE', 'Sports Policy'],
      {
        prelims: [
          'Chess Olympiad — FIDE biennial team event; 45th edition: Budapest 2024 (India won Open gold); 46th+ cycle continues with Samarkand 2026.',
          'FIDE — Fédération Internationale des Échecs, world chess federation (est. 1924, Paris).',
          'Khelo India / Target Olympic Podium Scheme — national sports-support architecture.',
        ],
        mains: [
          'GS1 — Sports as soft power: India’s chess boom (young GMs, online chess economy) and the 2022 Chennai Olympiad legacy.',
          'GS2 — Sports governance: federation reforms, funding pipelines from Khelo India to professional circuits.',
        ],
        keywords: ['Chess Olympiad', 'FIDE', 'Samarkand', 'Sports Soft Power', 'Khelo India'],
        mainsQ: {
          text: 'India\u2019s rise in global chess reflects structural investments in young talent. Discuss sport as an instrument of soft power.',
          marks: 10, words: 150, directive: 'Discuss',
        },
      },
      `India finished second to Uzbekistan at the Chess Olympiad in Samarkand — a silver that The Hindu’s editorial \u201cSilver lining\u201d frames correctly: not a setback, but confirmation of depth. A decade ago India had a handful of grandmasters at the top; today a conveyor belt of teenagers anchors both Open and Women’s teams, fed by school programmes, online blitz economies, and the 2022 Chennai Olympiad’s home-soil catalysis.\n\nFor exams: GS1 — sports as soft power and youth-culture change; GS2 — federation governance and funding architecture (Khelo India, TOPS). And a small Prelims nugget: the Olympiad is FIDE’s biennial team championship — Budapest 2024 was India’s Open-section gold.`),
    NB(2, 'Light on truth: the Tamil Nadu G.O. and the RTI promise', 'No government intent on working for the people should fear transparency, The Hindu writes, criticising a Tamil Nadu Government Order restricting access to government orders through the RTI route.', 'The Hindu', 'GS2', 'Governance / Transparency', 4, ['RTI', 'Transparency', 'Tamil Nadu', 'Section 4'],
      {
        prelims: [
          'RTI Act 2005 — statutory right flowing from Article 19(1)(a); 30-day response (48 hours where life/liberty involved).',
          'Section 4 — proactive disclosure duty; government orders are routinely publishable material.',
          'First State RTI law: Tamil Nadu, 1997.',
        ],
        mains: [
          'GS2 — Transparency as the first mile of accountability: publication of G.O.s reduces RTI burden and litigation.',
          'GS2 — Institutional stress: CIC vacancies, post-2019 term-of-service amendments, DPDP-driven carve-outs (Sec 8(1)(j)).',
          'GS4 — Transparency as an ethical value in administration: documentation discipline and open-by-default design.',
        ],
        keywords: ['RTI Act 2005', 'Section 4', 'Government Orders', 'CIC', 'Open by Default', 'Accountability'],
        mainsQ: {
          text: '\u201cTransparency in government orders is the first mile of accountability.\u201d Discuss the state of the RTI regime in its third decade.',
          marks: 10, words: 150, directive: 'Discuss',
        },
      },
      `The Hindu’s editorial \u201cLight on truth\u201d criticises a Tamil Nadu Government Order seen as restricting access to government orders (G.O.s) via the RTI route, with a simple principle: no government intent on working for the people should fear transparency.\n\nThe RTI Act’s Section 4 already mandates proactive disclosure — publication of orders, circulars and decisions is the default, and every G.O. withheld from routine access multiplies RTI applications and first appeals. The episode sits within a worrying pattern: Information Commission vacancies, the 2019 amendment centralising tenure rules, and privacy-law carve-outs narrowing Sec 8(1)(j) interpretation.\n\nExam hook: GS2 — RTI’s third-decade stress test; GS4 — open-by-default administration as probity in practice. Prelims nugget: Tamil Nadu enacted India’s first State RTI law in 1997.`),

    /* ─────── Legacy archive articles (relative days) ─────── */
    N(4, 'Union Cabinet clears next tranche of India Semiconductor Mission projects', 'Two new semiconductor fabrication and three advanced packaging units, worth over ₹35,000 crore, receive approval under the Modified ISM, taking total committed investment past ₹1.6 lakh crore.', 'PIB', 'GS3', 'Science & Technology', 6, ['semiconductors', 'manufacturing', 'Make in India'], `The Union Cabinet has approved the next set of projects under the India Semiconductor Mission, clearing two fabrication units and three advanced chip packaging (ATMP/OSAT) facilities with a combined investment of more than ₹35,000 crore. With this tranche, committed investment under the mission crosses ₹1.6 lakh crore across nine states, the IT Ministry said.\n\nThe new units will fabricate 28–90 nm chips for automotive, power and display applications — segments where import dependence remains highest. Officials underlined that the design-linked incentive (DLI) scheme has already enabled 20+ Indian startups to tape-out chips domestically, creating a full-stack ecosystem from design to fabrication to packaging.\n\nThe strategic logic is threefold: supply-chain resilience after the 2021–22 global chip shortage, anchoring India in electronics manufacturing where imports crossed $20 billion annually, and creating high-skill employment — the missions’ projects are projected to generate roughly one lakh direct and indirect jobs.\n\nChallenges remain substantial. Semiconductor fabs consume enormous quantities of ultra-pure water and uninterrupted power; grid reliability and water reuse technology will decide operational economics. Analysts also flag the talent gap: India produces strong chip designers but few fab process engineers, requiring focused curricula in tier-2 engineering institutes.\n\nRelevance to UPSC: GS-III (industrial policy, growth of electronics manufacturing, government schemes); Prelims facts on ISM, DLI and SPECS; possible Essay themes on technological self-reliance.`),
    N(5, 'GST 2.0 rate rationalisation completes first full month: revenue holds, consumption shifts', 'Goods and Services Tax collections remain above ₹1.8 lakh crore in the first full month after the two-slab restructuring, with visible demand growth in consumer durables and insurance.', 'The Hindu', 'GS3', 'Economy', 7, ['GST', 'taxation', 'consumption'], `One month after the "GST 2.0" restructuring moved most goods into 5% and 18% slabs with a 40% demerit rate, official data shows gross monthly collections holding above ₹1.8 lakh crore — a key test of whether simplification would erode revenue. Net collections, after record refunds, grew year-on-year, the Finance Ministry said.\n\nConsumption data is the most striking early signal: sales of entry-level cars, two-wheelers, televisions and air-conditioners rose sharply as several items migrated from 28% to 18%, and term and health insurance premiums — now nil-rated — saw a spike in new policy issuance. Economists describe the reform as a demand-side stimulus calibrated through the tax system.\n\nCompliance metrics improved as well. The collapse from four principal slabs to two reduced classification disputes that earlier choked appellate forums, while automated refunds under the revised returns cycle released working capital for exporters. States' compensation-cess concerns, however, persist for sin goods whose base has shifted.\n\nThe medium-term test is different: with the Fiscal Responsibility framework guiding a 4.4% deficit glide path, the government must hold capex while absorbing the reform’s short-run cost. The next GST Council will examine rate fine-tuning in services and further reforms in registration and audits.\n\nRelevance to UPSC: GS-III (fiscal policy, GST architecture, cooperative federalism in the GST Council); GS-II (centre-state financial relations); Prelims facts on slab structure and cesses.`),
    N(1, 'Supreme Court: Governors must act on bills within reasonable time, fixes three-month outer limit', 'A Constitution Bench holds that gubernatorial inaction on state bills is judicially reviewable, reaffirming federal principles under Article 200–201.', 'Indian Express', 'GS2', 'Polity', 6, ['judiciary', 'federalism', 'Article 200'], `A five-judge Constitution Bench of the Supreme Court has ruled that a Governor cannot sit indefinitely over bills passed by a state legislature, holding that the phrase "as soon as possible" in Article 200 imposes a binding constitutional obligation — with three months as the presumptive outer limit for the first decision on a bill, extendable only by recorded reasons.\n\nThe judgment resolves a decade of friction between several state governments and Raj Bhavans, where bills — including those on reservation and university governance — were withheld for years. The Court held that while the Governor retains discretion to reserve bills for the President under Article 201, that discretion is not "absolute" and is subject to judicial review on grounds of mala fides, arbitrariness or extraneous consideration.\n\nWriting for the Bench, the Chief Justice grounded the ruling in "constitutional trust" reposed in every high office: a Governor is neither elected nor politically accountable, and therefore must act with demonstrable neutrality. The Court also framed procedural transparency requirements — communicating reasons to the state government when reserving bills.\n\nPolitical scientists note the verdict recalibrates Union–State relations without rewriting text: the Court used interpretive discipline rather than inserting timelines into the Constitution. Implementation questions remain — what happens when even the extended limit lapses, and whether "deemed assent" flows as a remedy in extreme cases, an aspect the Bench left for future adjudication.\n\nRelevance to UPSC: GS-II (union-state relations, role of Governors, judicial review); Prelims on Articles 200–201; Mains case-study material for constitutional offices.`),
    N(1, 'NISAR completes first year: radar duo begins delivering global ecosystem data', 'The NASA-ISRO Synthetic Aperture Radar satellite, launched in July 2025, has begun routine science operations, tracking ground deformation, forests and ice at centimetre scale.', 'PIB', 'GS3', 'Science & Technology', 5, ['ISRO', 'NISAR', 'remote sensing'], `The NASA-ISRO Synthetic Aperture Radar (NISAR) mission — launched aboard GSLV Mk-II in July 2025 — has completed commissioning and begun routine science operations, marking the first time a single satellite combines L-band and S-band radar to image nearly all of Earth’s land and ice surfaces twice every 12 days.\n\nEarly datasets are already in use: glaciers in the Himalaya mapped for seasonal velocity shifts, cropland in the Indo-Gangetic plain tracked for moisture stress, and subsidence measured in deltaic cities where groundwater extraction outpaces recharge. Because radar penetrates cloud and works at night, NISAR promises continuity that optical missions lack during the monsoon — critical for Indian agriculture and disaster response.\n\nFor ISRO, the mission is a technology inflection: the S-band radar, the 12-metre unfurlable antenna and the novel dual-frequency payload architecture were developed domestically, skills that feed directly into future Earth-observation constellations. For NASA, ISRO provided the spacecraft bus and launch — a genuine co-development rather than a buyer-seller tie-up.\n\nThe wider lesson for India’s space economy is collaborative scale: NISAR cost roughly $1.5 billion shared across agencies and creates open global datasets. Officials indicate follow-on joint missions in thermal infrared and ocean altimetry are in discussion, while the private sector eyes value-added analytics on top of open NISAR data.\n\nRelevance to UPSC: GS-III (space technology, bilateral S&T cooperation); Prelims facts on NISAR, GSLV, radar bands; Essay material on science diplomacy.`),
    N(2, 'India crosses 91 Ramsar sites as three coastal wetlands join the list', 'Chilika extension, Bhitarkanika mangroves and a Goa saltpan wetland receive Ramsar designation, strengthening migratory bird habitat protection.', 'PIB', 'GS3', 'Environment', 5, ['wetlands', 'Ramsar', 'biodiversity'], `India’s network of Ramsar sites — wetlands of international importance under the 1971 Ramsar Convention — has grown to 91 with the designation of three more coastal wetlands, the Environment Ministry announced. India now has Asia’s largest Ramsar network.\n\nThe new entrants include a significant extension of Odisha’s Chilika lagoon — Asia’s largest brackish water lake and wintering ground for over a million migratory birds — and the Bhitarkanika mangrove complex, home to rising saltwater crocodile populations. A managed saltpan wetland in Goa was also listed, a nod to the biodiversity value of anthropogenic wetlands.\n\nDesignation, however, is the beginning rather than the end of protection. Wetlands India-wide face pressures from aquaculture expansion, siltation, invasive species and real-estate conversion. The Ministry’s Wetlands (Conservation and Management) Rules require state authorities to prepare brief documents and zonation plans for each site, and the Green Tribunal has repeatedly pushed for scientific management over paper protection.\n\nEconomists and ecologists increasingly converge on the "wise use" principle at the heart of the Convention: wetlands deliver fisheries, flood buffers and groundwater recharge worth billions, so community-linked livelihood models — as attempted around Chilika with dolphin-watching cooperatives — are seen as the sustainable path.\n\nRelevance to UPSC: GS-III (conservation, environmental governance); Prelims facts on Ramsar sites, wetland rules; GS-I geography linkages with coastal ecology.`),
    N(2, 'RBI holds repo rate, flags inflation risks from food and global logistics', 'The Monetary Policy Committee keeps the policy repo unchanged for a second meeting, while a new deputy-governor committee reviews the inflation-targeting framework.', 'The Hindu', 'GS3', 'Economy', 6, ['RBI', 'monetary policy', 'inflation'], `The Reserve Bank of India’s Monetary Policy Committee voted unanimously to hold the policy repo rate, citing "productive caution": headline CPI has eased from last year’s vegetable-driven spikes, but the Bank flagged persistence in core services inflation and renewed shipping-cost pressures that threaten imported price rises.\n\nGovernor Sanjay Malhotra’s statement balanced growth and price stability — GDP for the current fiscal is projected in the 6.5–7% band while CPI is seen averaging near 4% with risks tilted upward. The Bank reiterated that durable disinflation requires food-system fixes: buffer-stock operations, diversified pulses procurement and storage investment, areas where monetary policy has no lever.\n\nA significant institutional announcement accompanied the decision: an internal expert committee will review the flexible inflation targeting framework ahead of its scheduled renewal, examining the 4% (±2%) tolerance band, the treatment of food and energy shocks, and communication tools such as the inflation corridor used by peer central banks.\n\nFinancial markets read the stance as neutral-to-dovish; bond yields eased as the Bank retained liquidity support for government borrowing without upsetting the currency. Analysts note the real test arrives with the monsoon’s withdrawal: reservoir levels and kharif arrivals will determine whether the promised softening materialises.\n\nRelevance to UPSC: GS-III (monetary policy, inflation targeting); Prelims facts on MPC composition, repo/CRR instruments; GS-II institutional design of the RBI.`),
    N(3, 'SCO summit ends with Tianjin Declaration; India underlines zero-tolerance on terror and connectivity sovereignty', 'The Shanghai Cooperation Organisation summit adopted the Tianjin Declaration; India’s participation focused on counter-terrorism, de-dollarisation debates and the India-Middle East-Europe corridor.', 'Indian Express', 'GS2', 'International Relations', 7, ['SCO', 'foreign policy', 'connectivity'], `The Shanghai Cooperation Organisation Heads of State summit concluded with the adoption of the Tianjin Declaration, a 20-point document reaffirming members' commitment to fighting terrorism, separatism and extremism while pledging cooperation on energy security, digital economy and climate. China announced a development bank for the bloc; India participated at the leadership level for the first time in two years.\n\nIndia’s interventions were pointed. The Prime Minister called for "zero tolerance" on terrorism and named cross-border terror financing as the bloc’s central security challenge — a clear reference to regional dynamics — while stressing that connectivity initiatives must respect national sovereignty, an allusion to projects that bypass Indian territory.\n\nThe summit’s economic undercurrent was de-dollarisation: member states discussed expanding local-currency trade settlement. India’s position stayed calibrated — rupee trade mechanisms exist with several partners, but officials resist timelines that could destabilise trade finance during global uncertainty.\n\nAnalysts see the summit as India exercising "multi-vector" diplomacy: deep engagement with the Eurasian security grouping even as trilaterals with the Quad and the Gulf deepen. The next summit will be hosted by Kyrgyzstan; India will chair the SCO Council of Heads of Government this year, putting New Delhi at the centre of the bloc’s economic agenda.\n\nRelevance to UPSC: GS-II (regional groupings, India’s neighbourhood and Eurasia policy); Prelims on SCO members and organs; Essay angles on multipolarity.`),
    N(3, 'Great Indian Bustard conservation gets satellite-telemetry boost as breeding crosses 100 birds in Rajasthan', 'The WII-forest department program reports the captive population crossing a century, with satellite-tagged juveniles mapping new flight corridors for power-line mitigation.', 'The Hindu', 'GS3', 'Environment', 5, ['GIB', 'endangered species', 'renewable energy conflict'], `The Great Indian Bustard (GIB) — down to fewer than 150 individuals in the wild a decade ago — has a new chapter: the Wildlife Institute of India’s captive breeding program in Rajasthan’s Desert National Park has reared its 100th bird, while satellite telemetry on released juveniles is producing the first fine-grained maps of bustard flight corridors.\n\nThe corridor data matters because the GIB’s biggest modern killer is collision with high-tension power lines strung across its Thar habitat to evacuate solar power. Telemetry-based corridor maps are now feeding into a court-supervised plan to underground priority line segments and reroute future evacuation corridors away from core bustard zones.\n\nThe program’s science has matured: eggs from semi-wild enclosures are incubated artificially, chicks are imprinted on puppets to avoid human habituation, and soft-release pens train juveniles before tagging. Survival rates of released birds, once the program’s weak point, have improved with predator-awareness training.\n\nConservationists caution that captive breeding is a bridge, not a solution — habitat security across grasslands, grazing-policy balance with pastoral communities, and renewable-energy siting norms remain decisive. The Supreme Court’s expert committee continues to arbitrate between India’s 500 GW renewables ambition and one of the world’s rarest birds.\n\nRelevance to UPSC: GS-III (species conservation, renewable energy vs biodiversity conflict); Prelims facts on GIB, IUCN status, Desert NP; GS-IV dilemmas of development vs conservation.`),
    N(4, 'Census 2027 notified as fully digital exercise; caste enumeration confirmed', 'The Registrar General notifies India’s 16th Census for 2027 — the first digital, first self-enumeration-enabled and first post-1931 caste-inclusive census.', 'PIB', 'GS2', 'Governance', 6, ['Census', 'caste enumeration', 'digital governance'], `The Union Home Ministry has notified the conduct of the 16th decennial Census in 2027, confirming three firsts: complete digital enumeration on handheld devices and web portals, a self-enumeration option where households pre-fill data online, and caste enumeration across all communities — the first attempt since 1931.\n\nOperationally, the census will roll out in two phases: house-listing (April–September 2026) and population enumeration with a reference date of March 1, 2027 (October 2026–February 2027; snow-bound areas earlier). About 30 lakh enumerators will use a mobile app with geo-tagged household records, offline capability and real-time dashboards.\n\nThe caste column’s design is the delicate part. Officials indicate enumeration will follow the respondent’s declared caste without an open list, with coding done centrally to avoid state-level anomalies. The decision revives debates from the SECC 2011 experience, whose raw caste data was never released due to quality concerns.\n\nData scientists flag the upside: decadal benchmarks reset everything from delimitation and fiscal-devolution formulas to NFSA coverage estimates and electoral rolls. Privacy architecture will lean on the DPDP Act — anonymised microdata release plans are being drafted alongside, since census data is the backbone of India’s statistical system.\n\nRelevance to UPSC: GS-II (governance, Census as data infrastructure); GS-I (population & settlement geography); Prelims facts on census history and phases; Essay on data and democracy.`),
    N(4, 'India-UK CETA enters force: 90% tariff lines to go duty-free in phased schedule', 'The Comprehensive Economic and Trade Agreement, signed in July, is operational; textiles, gems, engineering goods gain immediate or staged duty-free access to the UK.', 'The Hindu', 'GS2', 'International Relations', 6, ['CETA', 'trade', 'United Kingdom'], `The India–United Kingdom Comprehensive Economic and Trade Agreement (CETA) has entered into force after ratification by both parliaments, activating a phased tariff-elimination schedule under which about 90% of India’s export tariff lines — by value — will reach zero-duty access into the UK market.\n\nImmediate winners include textiles and apparel, leather footwear, gems and jewellery, marine products and auto components, sectors where Indian exporters currently face 4–12% duties against competing preferential suppliers. The UK, in turn, gains reduced duties on whisky, medical devices and select machinery, with a locked quota for premium cars.\n\nThe agreement’s social-security provision is a first for India with a European economy: Indian professionals on short-term UK postings will be exempted from double social-security contributions, saving the IT and services sectors an estimated several hundred crore rupees annually.\n\nEconomists caution that rules-of-origin enforcement and standards compliance (including carbon-linked disclosure requirements emerging in UK procurement) will determine real gains. A parallel Double Contribution Convention and a services mobility annex were also notified, and both governments committed to a review clause after five years.\n\nRelevance to UPSC: GS-II (bilateral trade agreements); GS-III (exports, textile sector competitiveness); Prelims facts on CETA vs FTA terminology.`),
    N(5, 'Left-Wing Extremism at historic low: 38 districts removed from security-related expenditure scheme', 'With LWE incidents at a five-decade low, the MHA delists more districts; the focus shifts from security operations to development and surrender-rehabilitation.', 'Indian Express', 'GS3', 'Internal Security', 6, ['LWE', 'Naxalism', 'development'], `The Ministry of Home Affairs has removed 38 districts from the Security Related Expenditure (SRE) scheme list after Left-Wing Extremism (LWE) violence fell to its lowest level in five decades — incidents down over 80% and deaths down nearly 90% from their 2010 peak, according to official data released ahead of the Home Ministry’s review meeting.\n\nThe turnaround is attributed to a combination of sustained security operations — better intelligence fusion, fortified police stations and precision CAPF deployment — with a thick layer of development: road connectivity projects, mobile towers in remote blocks, and the aspirational districts program. Chhattisgarh’s Bastar division, the conflict’s epicentre, has seen encirclement-style operations shrink the "liberated zone" narrative.\n\nPolicy attention is now pivoting to consolidation: surrender-cum-rehabilitation packages have been enhanced, and the MHA is pushing district administrations to convert security gains into banking, road-density and school-retention metrics — a deliberate echo of the "clear-hold-build" counter-insurgency doctrine.\n\nScholars caution against triumphalism: the movement’s root causes — forest-rights implementation, land alienation, governance vacuums in tribal belts — demand sustained administration beyond the security lens. The coming assembly cycles in affected states will test whether development keeps pace with demilitarisation.\n\nRelevance to UPSC: GS-III (internal security challenges, LWE); GS-II (development vs security governance); Prelims facts on SRE scheme, aspirational districts.`),
    N(5, 'PM Vishwakarma scheme crosses 30 lakh artisans; credit uptake remains the bottleneck', 'Loan disbursement lags registration by a wide margin as the artisan-support scheme completes two years; awareness and collateral norms cited as key friction points.', 'PIB', 'GS2', 'Welfare Schemes', 5, ['PM Vishwakarma', 'artisans', 'credit'], `The PM Vishwakarma scheme — which supports 18 traditional artisan trades from blacksmiths to boat-makers — has crossed 30 lakh registrations since its 2023 launch, but MSME ministry data shows credit disbursement covering barely a fifth of the eligible pool, a gap officials now acknowledge as the scheme’s central challenge.\n\nThe design is layered: recognition certificates and e-ID cards, skill training with a stipend, toolkit incentives of ₹15,000, collateral-free "Vishwakarma loans" up to ₹3 lakh in two tranches, digital-transaction incentives and marketing support. Registrations are dominated by carpentry, tailoring and pottery trades across UP, MP, Bihar and Maharashtra.\n\nWhy the credit gap? Field studies point to a trilogy of frictions: artisans' document-readiness (many lack formal income proofs), branch-level risk aversion towards first-time borrowers despite the government-guaranteed collateral-free design, and the psychological barrier of a formal loan among cash-economy workers. Pilot "bank-sathi" facilitators in three states are being scaled to bridge the trust deficit.\n\nEconomists see the scheme as a test-case for reaching the informal micro-enterprise economy — 92% of India’s workforce — with production-linked rather than consumption-linked support. The coming evaluation will focus on income deltas, not just enrolment counts.\n\nRelevance to UPSC: GS-II (welfare schemes, DBT-era design); GS-III (MSME, skilling); Prelims scheme features; GS-IV empathy in administration for informal workers.`),
    N(6, 'Supreme Court ruling: forest land diversion requires Gram Sabha consent, reaffirms FRA primacy', 'The Court holds that forest-clearance processes under FCA must run in parallel with — not after — community rights recognition under the Forest Rights Act.', 'Indian Express', 'GS2', 'Polity', 6, ['Forest Rights Act', 'Gram Sabha', 'tribal rights'], `The Supreme Court has held that diversion of forest land for projects cannot proceed as a formality parallel to — or ahead of — the recognition of forest-dweller rights under the Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006. Consent of the concerned Gram Sabhas, the Bench clarified, is a substantive requirement where community forest rights are claimed, not a box-ticking exercise.\n\nThe ruling arose from challenges to clearances granted for mining and linear infrastructure in central Indian forested districts, where petitioners showed that rights-recognition processes were pending while stage-I clearances were issued. The Court directed that clearance records must now certify the status of FRA processes in the affected area, and that unresolved claims must be stated in writing.\n\nThe judgment restores the FRA’s original architecture: Gram Sabhas as the custodial authority of customary use. It also responds to a long-documented pattern — by government’s own committee reports — where rejection rates of claims were high and often made without reasoned orders, and where critical wildlife habitats were used to bypass community consent.\n\nDevelopment planners read the message as process discipline, not obstruction: project timelines must internalise rights-recognition at the DPR stage. States have been told to constitute district-level committees to audit pending claims within a year, with the Ministry of Tribal Affairs as nodal monitor.\n\nRelevance to UPSC: GS-II (tribal welfare, governance of commons); GS-III (environmental clearance architecture); GS-IV procedural justice; Prelims on FRA 2006 and FCA 1980.`),
    N(6, 'India launches first indigenous Nipah vaccine trial; ICMR cites One-Health surveillance', 'Phase-I trials begin for an indigenous Nipah vaccine after the 2023 Kerala outbreaks; ICMR pairs the trial with expanded bat-human interface surveillance.', 'The Hindu', 'GS3', 'Science & Technology', 5, ['Nipah', 'vaccine', 'One Health'], `India’s first indigenous Nipah virus vaccine has entered Phase-I clinical trials, the ICMR announced, nearly two years after the Kozhikode outbreak claimed two lives and forced containment zones across four districts of Kerala. The vaccine, developed through a public-private partnership, uses a subunit platform already licensed for other viral targets.\n\nNipah — a zoonotic virus carried by Pteropus fruit bats with case fatality historically between 40–75% — sits atop the WHO’s priority-disease list. India’s strategy pairs the vaccine with "One-Health" surveillance: year-round bat colony monitoring in Kerala, West Bengal and the Northeast, spill-over event modelling with rainfall and fruiting-season data, and hospital networks pre-positioned with monoclonal antibody access.\n\nThe scientific challenge is trial design for an episodic disease: with cases rare, efficacy must be inferred through immunogenicity bridges and outbreak-time adaptive protocols — a regulatory novelty the CDSCO has enabled with a special pathway. Ethics review emphasises community consent in outbreak-prone panchayats.\n\nGlobal health watchers note the wider signal: post-COVID, India is positioning as a first-responder for regional epidemic threats, with vaccine development compressed from decade-scale to three-year cycles through manufacturing scale and regulatory reform.\n\nRelevance to UPSC: GS-III (health security, biotechnology); GS-II (health governance); Prelims facts on Nipah, ICMR; Essay angles on pandemic preparedness.`),
    N(7, 'NFHS-6 preliminary findings: sex ratio at birth improves, anaemia remains stubborn', 'Early data from the sixth National Family Health Survey shows continued gains in institutional births and immunisation, while anaemia among women and children barely moves.', 'Yojana', 'GS2', 'Social Issues', 6, ['NFHS', 'public health', 'anaemia'], `Preliminary findings from the sixth round of the National Family Health Survey (NFHS-6), presented at a NITI Aayog review, show India consolidating its demographic-health gains while exposing the stubborn frontier of nutritional anaemia.\n\nThe positives are structural: institutional births have crossed 92% nationally, full immunisation for children aged 12–23 months now exceeds 80% in most large states, and total fertility rate remains stable at around replacement level (2.0), with southern states and several northern ones below it. Sex ratio at birth has improved for the fifth straight survey round — a signal that the Beti Bachao Beti Padhao ecosystem and stricter PC-PNDT enforcement are cumulatively working.\n\nThe anaemia story is the outlier. Despite a decade of iron-folic acid supplementation, fortification pilots and diet-diversification programs, anaemia among women aged 15–49 has moved only marginally. Researchers point to bio-available diet access — pulses, millets, animal protein — rather than supplement supply as the binding constraint, and to infection burdens that supplementation alone cannot fix.\n\nThe survey’s design matters for policy: NFHS-6 adds micronutrient biomarkers for a sub-sample and, for the first time, screens for non-communicable disease risk factors at this scale. State-level dashboards are expected to drive the next Poshan Abhiyan cycle, with a shift from weight-only growth monitoring to diet-quality metrics.\n\nRelevance to UPSC: GS-II (health policy, welfare program design); GS-I (population and social indicators); Prelims facts on NFHS rounds; Essay material on nutrition security.`),
    N(7, 'Cabinet approves enhanced support for Kerala’s Vizhinjam transshipment port', 'India’s deep-water transshipment strategy takes shape with Vizhinjam’s capacity targets accelerated; logistics cost reduction is the policy anchor.', 'PIB', 'GS3', 'Infrastructure', 5, ['ports', 'transshipment', 'logistics'], `The Union Cabinet has approved an enhanced viability-gap package for the Vizhinjam International Transshipment Seaport in Kerala, fast-tracking Phase-2 capacity as the facility begins regular operations with its first mother-vessel calls. The move formalises a two-gateway transshipment strategy alongside the Vadhavan port approval in Maharashtra.\n\nThe economics are compelling: nearly 75% of India’s transshipped containers — cargo that must first touch Singapore, Colombo or Port Klang — leak an estimated $80–100 million annually in added logistics cost and 3–5 days of delay per shipment. Vizhinjam’s natural 18–20 metre draft, barely a nautical mile from international shipping lanes, allows it to berth the largest container vessels without dredging.\n\nPolicy design is the quiet innovation: a hybrid PPP model, per-TEU incentive support rivaling Colombo’s offers, and a captive customs-bonded zone. Kerala’s government has paired the port with skill programs targeting coastal communities and a planned maritime-services cluster for bunkering, repairs and crew services.\n\nChallenges are real — anchor-customer loyalty is built over years, and Colombo will defend its dominant share with aggressive pricing. But shipping lines' reliability calculus after Red Sea disruptions has strengthened the case for a west-coast Indian alternative. Officials project 30% of Indian transshipment cargo to be onshored by 2030.\n\nRelevance to UPSC: GS-III (infrastructure, logistics policy, ports); Prelims geography of Indian ports; GS-II centre-state infrastructure partnerships.`),
    N(8, 'National Green Tribunal orders unified action plan for Delhi-NCR winter air; GRAP made automatic', 'The NGT directed CAQM to trigger Graded Response Action Plan stages by AQI thresholds without discretionary delays, and to publish source-apportionment data monthly.', 'The Hindu', 'GS3', 'Environment', 6, ['air pollution', 'GRAP', 'CAQM'], `The National Green Tribunal has directed the Commission for Air Quality Management (CAQM) to make the Graded Response Action Plan (GRAP) fully automatic — each stage must trigger within 24 hours of the corresponding AQI threshold being crossed, without awaiting committee discretion — and to publish monthly source-apportionment data for Delhi-NCR on a public dashboard.\n\nThe order responds to a familiar autumn sequence: stage-wise restrictions announced late, enforcement gaps in dust and construction norms, and farm-fire smoke arriving from Punjab and Haryana during the stubble window. The Tribunal also required real-time API-linked reporting from all continuous ambient monitors, with penalty data for violators published ward-wise.\n\nScientific inputs before the Bench were stark: winter PM2.5 in Delhi consistently exceeds WHO interim targets by 15–20 times, and source studies attribute roughly a third to regional transport (stubble, industry), a third to local combustion and dust, and the rest to meteorology — the basin’s winter inversion acting as a lid. The Tribunal endorsed a shift from emergency response to structural mitigation: electrification of freight within 200 km, mechanised sweeping mandates, and biomass co-firing enforcement for NCR industries.\n\nImplementation, as ever, is multi-jurisdictional — five states, three municipal systems, and central agencies — which is precisely why the Tribunal framed its directions as a single, time-bound, KPI-anchored plan with quarterly compliance affidavits.\n\nRelevance to UPSC: GS-III (environmental pollution & governance); GS-II (quasi-judicial bodies, cooperative federalism in pollution control); Prelims on GRAP stages and CAQM.`),
    N(8, 'India Stack goes global: UPI live in seven countries, DPI diplomacy expands', 'Unified Payments Interface now operates across UAE, Singapore, France, Sri Lanka, Mauritius, Nepal and Bhutan; the foreign ministry pairs deployment with digital-public-infrastructure capacity building.', 'Indian Express', 'GS2', 'International Relations', 6, ['UPI', 'digital public infrastructure', 'soft power'], `Unified Payments Interface (UPI) — India’s real-time retail payment rail — is now live in seven countries, with the UAE and Singapore processing cross-border person-to-merchant transactions at scale and France, Sri Lanka, Mauritius, Nepal and Bhutan at varying stages of deployment. The Ministry of External Affairs calls it the operational core of India’s "digital diplomacy."\n\nThe proposition is deliberate: India offers not a product but a digital-public-infrastructure (DPI) stack — identity (Aadhaar-class systems), payments (UPI), and data exchange (consent-based architectures) — as open, interoperable public goods. The G-20 New Delhi Declaration formalised this as a voluntary DPI framework, and a social fund co-financed with multilateral banks now funds adoption roadmaps in the Global South.\n\nTechnical integration is non-trivial: sovereign data-localisation laws, FX settlement through bilateral arrangements, and regulator-to-regulator MoUs that define liability splits. Singapore’s PayNow-UPI linkage, the first live corridor, now handles retail remittances with fees a fraction of legacy correspondent-banking transfers.\n\nStrategists read UPI’s spread as infrastructure-led soft power — the way rails and telecom once anchored influence. The next frontier is credit: account-aggregator frameworks being piloted with two ASEAN central banks could export India’s consent-based lending model, potentially the more transformative export than payments alone.\n\nRelevance to UPSC: GS-II (foreign policy instruments, digital diplomacy); GS-III (fintech, payment systems); Prelims facts on UPI corridors; Essay on technology and influence.`),
    N(9, 'Parliament passes maritime anti-piracy act amendments; Navy escort missions extended', 'The amended legislation aligns India’s piracy law with UNCLOS Article 100 duties; the Navy’s deployment record includes 100+ escorted convoys.', 'The Hindu', 'GS3', 'Internal Security', 5, ['piracy', 'maritime security', 'UNCLOS'], `Parliament has passed amendments to India’s maritime anti-piracy legislation, aligning the domestic statute with the country’s obligations under UNCLOS Article 100 — the duty of every state to cooperate in repressing piracy — and expanding jurisdictional clarity for prosecution of pirates apprehended on the high seas.\n\nThe legislative tightening follows the Navy’s most active anti-piracy year in a decade: responding to Somali-basin attacks that resurged with global shipping’s crisis corridors, the Navy deployed destroyers and P-8I aircraft across the Arabian Sea, completed over 100 escorted convoys, and conducted boarding operations that led to the arrest of dozens of suspects — testing, in practice, the domestic legal machinery that the amendments now refine.\n\nThe amended law defines piracy per UNCLOS (illegal acts of violence or detention for private ends on the high seas), covers accomplice liability and attempt, and designates notified courts with sentencing frameworks. Officials say the previous statute’s gaps — bail defaults and repatriation limbo for captured suspects — had made long prosecutions fragile.\n\nStrategic analysts frame the deployment as doctrine: India as a "net security provider" in the Indian Ocean Region, coordinating with Combined Maritime Forces while retaining independent mission control. The extension of escort missions to the Gulf of Aden lanes formalises that posture.\n\nRelevance to UPSC: GS-III (maritime security, border management); GS-II (international law, UNCLOS); Prelims facts on Navy deployments and UNCLOS articles.`),
    N(9, 'NIRF 2025 released: IIT Madras tops overall category; new Open University ranking added', 'The tenth edition of the National Institutional Ranking Framework adds a distance-education category; participation crosses 13,000 institutions.', 'PIB', 'GS2', 'Education', 5, ['NIRF', 'higher education', 'NEP'], `The Ministry of Education has released the tenth edition of the National Institutional Ranking Framework (NIRF), with IIT Madras retaining the top overall rank for the eighth consecutive year, IISc Bengaluru leading the university category, and AIIMS New Delhi the medical category. Participation grew to over 13,000 institutions.\n\nThe headline structural change is a dedicated Open and Distance Learning category — its first ranking led by IGNOU — reflecting the scale of distance education post-NEP 2020. Other tweaks include mandatory disclosure of research publication retraction rates, a quality signal the ministry says will eventually weight citations against integrity metrics.\n\nAnalysts continue to debate what NIRF measures: the framework rewards perception surveys, graduation outcomes and research productivity, but critics note it underweights employability data and learning outcomes. The ministry’s response has been incremental — an innovation ranking now runs on its own cycle, and program-level accreditation is being pushed through NAAC reforms.\n\nFor aspirants choosing institutions, the durable insight is stability at the top: Delhi University, JNU and Anna University remain in familiar clusters, while private universities continue to climb in engineering and management categories on research metrics.\n\nRelevance to UPSC: GS-II (education governance, NEP implementation); Prelims facts on NIRF categories; GS-III human-capital angle.`),
    N(10, 'Millets exports hit record as biofortified varieties released for dryland farming', 'India’s Shree Anna exports cross $500 million; ICAR releases eight biofortified millet varieties for rainfed agriculture.', 'PIB', 'GS3', 'Agriculture', 5, ['millets', 'Shree Anna', 'nutrition'], `India’s millet exports have touched a record in value terms, crossing the half-billion-dollar mark, as the agriculture ministry released eight new biofortified varieties of jowar, bajra and ragi developed by ICAR institutes for rainfed regions. The announcement came alongside FAO programs extending the momentum of the 2023 International Year of Millets.\n\nThe policy architecture behind the number is layered: the Shree Anna branding initiative, APEDA-led buyer-seller meets in the Gulf and Europe, and state-level minimum-support-price procurement for ragi and bajra that has slowly de-risked farmer transitions away from water-guzzling crops. Karnataka and Rajasthan lead area expansion under crop-diversification incentives.\n\nAgronomists frame millets as climate-adaptation infrastructure: these C4 grasses deliver grain with 60–70% less water than paddy, tolerate extreme heat, and fit squarely into the rainfed districts where yield volatility bites hardest. The biofortified releases add iron and zinc density — a direct answer to the anaemia data dominating nutrition surveys.\n\nMarket-building remains the frontier: consumption in India is still festival-driven, and export competitiveness depends on processing (dehulling, flour milling) close to farm gates. The ministry’s next phase targets 10,000 village-level processing units under FPO federations.\n\nRelevance to UPSC: GS-III (cropping patterns, food security); GS-II (nutrition policy); Prelims facts on millet varieties and MSP procurement; Essay on climate-resilient agriculture.`),
    N(11, 'Cheetah relocation expands to Gandhi Sagar as Kuno population crosses 30', 'Project Cheetah enters phase two with a second home at Madhya Pradesh’s Gandhi Sagar sanctuary; eight cats translocated from Kuno as the metapopulation plan activates.', 'Indian Express', 'GS3', 'Environment', 5, ['Project Cheetah', 'Kuno', 'reintroduction'], `Project Cheetah has entered its planned second phase: eight cheetahs have been moved from Kuno National Park to the Gandhi Sagar Wildlife Sanctuary, activating the "metapopulation" strategy that Indian scientists designed with Namibian and South African partners — multiple, connected populations to guard against local extinction events.\n\nKuno’s population has crossed 30 animals including cubs born on Indian soil — the program’s central proof point. Survival biology has stabilised after the difficult first two years: heat-adapted collar telemetry, prey-base augmentation through chital translocations, and veterinary protocols refined after mortality episodes.\n\nGandhi Sagar’s candidacy is ecological: 360+ sq km of grassland-savanna mosaic on the Chambal, prey densities supplemented over two years, and a landscape with lower livestock pressure than Kuno’s buffers. The state has announced a tourism-rationed viewing framework and village-level eco-development committees to convert conservation into local income.\n\nCritics maintain their two-line brief — that the cheetah is a charismatic overlay on habitat that needs protection regardless, and that budgets must not cannibalise existing tiger-reserve funding. Officials answer with numbers: central allocation for Kuno-Gandhi Sagar has been additive, and the program’s veterinary and telemetry infrastructure now serves wider carnivore management in Madhya Pradesh.\n\nRelevance to UPSC: GS-III (species reintroduction, conservation policy); Prelims facts on Kuno, Gandhi Sagar; GS-IV stewardship dilemmas.`),
    N(11, 'Delimitation debate sharpens: southern states seek assurance over seat shares', 'With the 2027 census set to trigger constituency revision, political debate intensifies over population-based seat allocation versus federal balance; a formula study is awaited.', 'The Hindu', 'GS2', 'Polity', 6, ['delimitation', 'federalism', 'Lok Sabha'], `The political contest over the next delimitation of Lok Sabha constituencies has intensified, with southern chief ministers seeking written assurances that states which stabilised population growth will not lose parliamentary weight. The exercise — constitutionally contingent on the first census after 2026 — is expected after Census 2027 concludes.\n\nThe arithmetic is stark. Under a purely population-proportional redistribution, northern states' seat shares would rise substantially while southern states and West Bengal would lose seats in relative terms — a prospect that penalises demographic success under family-planning norms since 1971. The Constitution’s 84th and 87th Amendments froze the existing seat allocation using the 1971 (seats) and 2001 (boundaries) baselines.\n\nOptions under discussion include freezing each state’s seat share while reallocating within states (the least disruptive), a weighted formula blending population with contribution metrics, and an expansion of total Lok Sabha strength to soften reallocation shocks. Scholars caution that any formula creates winners and losers, making consensus federal bargaining — perhaps via an Inter-State Council process — as important as the math.\n\nThe women’s reservation Act adds urgency: its operation is explicitly tied to the post-delimitation composition, linking two constitutional milestones into one political negotiation.\n\nRelevance to UPSC: GS-II (constitutional bodies, federalism, delimitation); Prelims on Articles 81, 82 and the 84th/87th Amendments; Essay on representation and federal democracy.`),
    N(12, 'ISRO clears Gaganyaan G-1 uncrewed flight for February; humanoid Vyommitra to fly', 'The first uncrewed Gaganyaan mission will carry the Vyommitra robot through a full orbital profile, testing abort, re-entry and recovery systems ahead of the crewed flight.', 'PIB', 'GS3', 'Science & Technology', 6, ['Gaganyaan', 'ISRO', 'Vyommitra'], `ISRO has cleared the G-1 uncrewed flight of the Gaganyaan human spaceflight program for a February window, with the humanoid robot-astronaut Vyommitra flying a complete orbital profile — launch, orbit-raising, cryogenic-stage manoeuvres, re-entry and splashdown recovery in the Bay of Bengal.\n\nG-1 is the system-level dress rehearsal: it validates the human-rated LVM3 (with its new crew module), the environmental control and life-support system in flight, deceleration parachutes at scale, and the end-to-end recovery chain involving naval ships and aircraft. Vyommitra — a half-humanoid developed by ISRO — will execute crew-similar tasks: panel operations, air-quality monitoring, and voice interaction with mission control, while instrumented mannequins record radiation and vibration exposure.\n\nTwo more uncrewed missions (G-2 with a full life-support loop, and the abort-test finale) precede the crewed H-1 flight, now targeted within a 2027 horizon. The astronaut corps — four IAF officers completing mission-specific training — will fly a 3-day, 3-astronaut mission on H-1.\n\nIndustrial spillovers are a designed outcome: over 500 MSMEs and startups have contributed to crew-module manufacturing, parachutes and avionics, and officials project a ₹40,000 crore+ human-spaceflight industrial ecosystem that also seeds the future Bharatiya Antariksh Station program.\n\nRelevance to UPSC: GS-III (space technology, indigenisation); Prelims facts on Gaganyaan missions and LVM3; Essay on national missions and industrial ecosystems.`),
    N(12, 'Cyclone early-warning upgrade: IMD activates 15-minute nowcast for all coastal states', 'The India Meteorological Department has rolled out street-level nowcasting ahead of the retreating monsoon, after the cyclone season saw zero-casualty landfalls in three states.', 'The Hindu', 'GS3', 'Disaster Management', 5, ['IMD', 'cyclone', 'early warning'], `The India Meteorological Department has activated its upgraded 15-minute-interval nowcasting system — blending Doppler radar mosaics, satellite nowcasts and AI-based short-range models — for all coastal states, completing a reform agenda that began after the 2019–2021 cyclone sequence.\n\nThe operational payoff was visible in the recent cyclone season: three landfalls — in Odisha, Andhra Pradesh and Gujarat — produced zero direct casualties, a repeatable result now, not a lucky one. Evacuation lead times of 72–96 hours, precision landfall cones, and panchayat-level alerts through the Common Alerting Protocol have converted forecasts into action.\n\nThe remaining hard problem is resilience economics: deaths are down, but property loss in coastal districts keeps rising as asset exposure grows. NDMA’s next ten-year framework pushes the lens from response to risk-informed development — building codes enforced at panchayat level, mangrove and shelterbelt restoration as green-grey hybrid defences, and parametric insurance pilots for fisher households.\n\nFor administrators, the doctrine is worth memorising as a Mains framework: forecast → warn → evacuate → shelter → restore, with the last mile decided by trust and drills, not technology alone.\n\nRelevance to UPSC: GS-III (disaster management, early warning systems); GS-II (NDMA/institutional architecture); Prelims facts on IMD systems; case-study material for GS-IV.`),
    N(13, 'Supreme Court clarifies electronic evidence standards: hash integrity and certification mandatory', 'A three-judge bench clarifies the Bharatiya Sakshya Adhiniyam’s electronic-evidence regime, requiring hash-verified production and strict certification.', 'Indian Express', 'GS2', 'Polity', 6, ['judiciary', 'electronic evidence', 'criminal law'], `A three-judge Bench of the Supreme Court has laid down the evidentiary standard for electronic records under the Bharatiya Sakshya Adhiniyam, 2023: production must be hash-verified (with chain-of-custody logs), and the statutory certificate requirement is mandatory rather than procedural — un-certified electronic records are inadmissible, not merely weak evidence.\n\nThe ruling harmonises the new criminal-law code with judicial precedents on the old Evidence Act, closing a decade of inconsistent practice where courts treated call-detail records, CCTV clips and social-media evidence with divergent rigour. The Bench emphasised that digital records are uniquely vulnerable to silent alteration, so integrity verification — hash values generated at seizure, recorded in seizure memos — is the constitutional-grade safeguard for fair trial.\n\nPractically, the decision reshapes policing: every investigation must now include digital-forensics capacity, and the home ministry’s e-Sakshya app — designed to produce time-stamped, hash-sealed records from field devices — becomes central rather than optional. Training modules for investigating officers are being fast-tracked.\n\nDefence lawyers gain a clear framework to challenge integrity; prosecutors gain certainty about what clean evidence looks like. Legal scholars call it the most consequential evidence ruling since the 2014 Anvar P.V. judgment, now codified into the new statute’s interpretive spine.\n\nRelevance to UPSC: GS-II (judiciary, criminal justice reform); Prelims on BSA/BNSS/BNS trio; GS-IV procedural fairness.`),
    N(14, 'India-EU FTA rounds accelerate: agriculture and carbon-border rules are the last mile', 'Negotiators signal convergence on goods schedules; agriculture market access and the EU’s CBAM implications for Indian steel remain the sticking points.', 'The Hindu', 'GS2', 'International Relations', 6, ['India-EU FTA', 'CBAM', 'steel'], `India and the European Union have completed another negotiating round on the long-pending Free Trade Agreement, with officials signalling convergence on goods tariff schedules and services commitments, while agriculture market access and climate-linked trade measures remain the decisive last mile.\n\nThe EU-27 market offers India scale: 450 million consumers with high per-capita imports of textiles, pharma, engineering goods and services. India’s asks are duty-free access in textiles and leather, data-secure status for IT services, and protection of its generic-pharma interests. The EU’s asks concentrate on automotive tariffs, wine and spirits, dairy, and — the structural friction — government-procurement access.\n\nThe harder negotiation is normative. The EU’s Carbon Border Adjustment Mechanism (CBAM), in its transitional phase, will price the embedded carbon of imported steel, aluminium and cement from 2026. Indian exporters face either decarbonisation investment or margin erosion; negotiators are seeking CBAM-compatible recognition of India’s energy-efficiency trading scheme and green-steel certification pathways.\n\nBoth sides have political reasons to close: the EU wants supply-chain diversification, India wants an anchor economic partnership in Europe post-UK. Officials now speak of concluding the goods-and-services core with separate parallel tracks on investment protection and geographical indications — a staged deal rather than a single-shot treaty.\n\nRelevance to UPSC: GS-II (trade agreements, EU as bloc); GS-III (exports, CBAM and climate-trade interface); Prelims facts on CBAM; Essay on climate and commerce.`),
    N(14, 'UGC permits bi-annual admissions from 2026-27; universities begin two-cycle calendars', 'The University Grants Commission has notified bi-annual admission cycles for all higher-education institutions, aligning with NEP 2020’s flexibility agenda.', 'PIB', 'GS2', 'Education', 5, ['UGC', 'NEP', 'admissions'], `The University Grants Commission has formally permitted all higher-education institutions to run two admission cycles a year — July-August and January-February — from the 2026-27 academic session, making India one of the largest systems globally to adopt bi-annual university intake.\n\nThe stated rationale is flexibility and efficiency: students who miss a cycle (board-result timelines, entrance-exam clashes, documentation gaps) need not lose a full year; institutions can spread infrastructure load; and universities gain two calibrated entry points for their NEP-mandated multiple-entry/exit programs. Foreign universities operating Indian campuses under the UGC’s 2023 regulations were already operating on multi-cycle models.\n\nImplementation is the hard part — semester systems must offer both cycles' first-semester courses; credit-transfer accounting through the Academic Bank of Credits must map cleanly; and placement calendars need restructuring. The UGC has issued model regulations and asked universities to opt-in with preparedness certificates rather than mandating uniform adoption.\n\nEducation economists expect early adoption concentrated in private universities, with central universities moving in phases. The deeper bet is demographic: with gross enrolment targeted to rise substantially by 2035, system capacity must add flexibility, not just seats.\n\nRelevance to UPSC: GS-II (education policy, NEP); GS-III (human capital); Prelims facts on UGC/NEP provisions.`),
    N(15, 'India’s urban population to cross 600 million by 2036: World Bank flags municipal finance gap', 'A new World Bank urban review projects India’s urban population at 600+ million by 2036 and calls for municipal bond deepening, property-tax reform and metropolitan governance fixes.', 'Yojana', 'GS1', 'Urbanisation', 6, ['urbanisation', 'municipal finance', 'World Bank'], `A World Bank urbanisation review has projected India’s urban population to cross 600 million by 2036 — roughly 40% of the country — and argues that the binding constraint on liveable cities is not physical investment but municipal finance and governance architecture.\n\nThe numbers are sobering: Indian municipal bodies raise under 1% of GDP in own revenue against 2%+ in peer economies; property-tax collection covers under 20% of potential in most cities; and municipal bonds remain a niche instrument. The report links this directly to service quality — a third of urban households still lack piped sewerage, and commute times in megacities have grown despite metro investments.\n\nThe governance diagnosis echoes India’s own committees: mayors without tenures or powers, parastatals fragmenting water, transport and planning, and the 74th Amendment’s devolution never fully operationalised. The report’s prescriptions are specific — metropolitan governance authorities with elected mandates, property-tax automation with GIS-linked valuation, and credit-enhancement windows to crowd in bond investors.\n\nPositives exist to build on: AMRUT and Smart Cities Missions digitised water metering and command-control in 100 cities. The next decade’s question is institutional, not technological: who governs the Indian city, and with what money?\n\nRelevance to UPSC: GS-I (urbanisation, settlement geography); GS-II (urban local governance, 74th Amendment); GS-III (infrastructure finance); Essay on cities and citizenship.`),
    N(15, 'India Post launches drone-based mail delivery in eight hilly districts', 'The Department of Posts operationalises drone logistics corridors for remote panchayats, cutting delivery times in Arunachal, Uttarakhand and the Northeast.', 'PIB', 'GS3', 'Infrastructure', 4, ['India Post', 'drones', 'last-mile'], `The Department of Posts has operationalised scheduled drone-based mail and parcel delivery across eight hilly and remote districts, integrating beyond-visual-line-of-sight corridors with its existing rural network — a first at national scale for a postal system.\n\nThe economics target the hardest last mile: panchayats in Arunachal Pradesh, Uttarakhand, Himachal and the Northeast where road-based delivery can take 3–7 days per cycle. Drone corridors compress this to same-day, with routes planned around hub post offices acting as launch and landing nodes. Payloads of 5–10 kg carry mail, medicines under a postal-pharmacy tie-up, and e-commerce returns.\n\nThe regulatory scaffolding came first: DGCA’s drone-airspace map, digital-sky corridors, and pilot certifications issued through partnerships with licensed operators. Each corridor’s operating costs are cross-subsidised by parcel revenue, with per-delivery costs already below helicopter or porter alternatives.\n\nOfficials frame the program as nation-building infrastructure: postal networks touch 1.5 lakh villages daily, and the drone layer converts geographic isolation into a solvable logistics equation. Next phases include banking-correspondent services and examination-paper logistics for remote centres.\n\nRelevance to UPSC: GS-III (infrastructure, drones in governance); GS-II (service delivery in remote areas); Prelims facts on BVLOS/DGCA; Essay material on technology for the last mile.`),
    N(16, 'COP30 preview: India to push climate finance goal past $300 billion with adaptation as core ask', 'Ahead of the Belém summit, India’s negotiating position frames the new collective quantified goal on climate finance and a Global Adaptation Goal with measurable indicators.', 'Indian Express', 'GS3', 'Environment', 7, ['COP30', 'climate finance', 'adaptation'], `With the COP30 climate summit in Belém, Brazil weeks away, India has finalised its negotiating priorities around one central demand: a New Collective Quantified Goal (NCQG) on climate finance that scales well beyond the $100 billion pledge — negotiators signal support for a floor above $300 billion annually by 2035, with grant-based and concessional composition for adaptation.\n\nIndia’s position paper leans on three pillars. First, adaptation parity: mitigation has historically absorbed most climate finance, while adaptation — where developing countries' needs are most acute — receives a fraction; India seeks a Global Goal on Adaptation with measurable indicators for water, agriculture and health resilience. Second, just transition: coal-dependent regions need finance for diversification, and India will push for a dedicated mechanism that funds workers and grids, not just generation assets. Third, technology access: proposals for global cooling-finance and intellectual-property flexibilities for green technologies.\n\nDomestically, India’s credentials are the updated NDC — 500 GW non-fossil capacity by 2030 (already past 50% of installed capacity), the Green Hydrogen Mission, and the world’s largest solar expansion programme. The counter-narrative India must manage is its coal dependence; officials argue for sequencing — grid absorption, storage build-out and coal-plant retirement on a calibrated timeline.\n\nNegotiators expect the Belém outcome to hinge on finance architecture: who contributes, through which channels, and with what accountability for adaptation flows.\n\nRelevance to UPSC: GS-III (climate change policy, international agreements); GS-II (global groupings in climate diplomacy); Prelims on UNFCCC/NCQG/COP facts; Essay on climate justice.`),
    N(16, 'Nari Shakti Vandan implementation roadmap released; ECI begins special roll revision', 'The Law Ministry and Election Commission outline the operational path for one-third women’s reservation in assemblies and Lok Sabha post-delimitation; voter rolls get a gender-audit.', 'PIB', 'GS2', 'Polity', 5, ['women reservation', 'ECI', 'constitutional law'], `The Law Ministry, with the Election Commission of India, has released the implementation roadmap for the Nari Shakti Vandan Adhiniyam — the 106th Amendment reserving one-third of Lok Sabha and state assembly seats for women — which becomes operative after the next delimitation following Census 2027.\n\nThe roadmap details three operational pillars. First, roll readiness: a special summary revision with gender-audit of electoral rolls, ensuring women’s enrolment parity. Second, seat-rotation design: the law prescribes rotation after each delimitation; the ECI has published a consultation paper on rotation algorithms to prevent incumbency distortion. Third, capacity: a cross-party training program for first-time women legislators.\n\nConstitutional lawyers note the elegant sequencing challenge — the amendment ties reservation to the post-census delimitation, which in turn depends on Census 2027 completing on schedule. Any census slippage cascades into the reservation timeline, making the census an electoral-infrastructure project, not merely a statistical one.\n\nPolitical scientists project the act could raise women’s strength in the Lok Sabha from ~14% to ~33% in its first operative election — a structural transformation in legislative composition whose policy effects comparative research suggests will be substantial.\n\nRelevance to UPSC: GS-II (constitutional amendments, elections); GS-I (women empowerment); Prelims facts on the 106th Amendment; Essay on representation.`),
    N(17, 'Economy grows 7.8% in Q1; capex cycle and services exports drive beat', 'GDP data for the April-June quarter beats estimates on government capex, construction and services exports; private consumption recovers gradually.', 'The Hindu', 'GS3', 'Economy', 6, ['GDP', 'growth', 'capex'], `India’s economy grew 7.8% year-on-year in the April–June quarter, beating consensus estimates and extending the outperformance streak, according to data released by the National Statistical Office. Growth was led by construction (double-digit), public administration, and business services, with manufacturing recovering strongly.\n\nThe composition tells the policy story. Government capex — roads, railways, defence production — continued its third year of double-digit expansion, crowding in private investment selectively: machinery imports and domestic capital-goods production both strengthened. Services exports, powered by global capability centres and IT, crossed $50 billion quarterly for the first time, offsetting merchandise trade deficits.\n\nPrivate consumption, two-thirds of GDP, recovered gradually — rural demand firmed on a normal monsoon and rising agricultural terms-of-trade, while urban durables got a GST-cut boost late in the quarter. Economists flag the two soft spots: household financial savings rates and the informal sector’s recovery, both visible only in higher-frequency data.\n\nThe full-year projection now clusters around 6.7–7%, contingent on monsoon withdrawal, global demand for services, and the fiscal consolidation path. The RBI’s growth forecasts were revised upward in its latest policy, with the MPC noting a "narrowing output gap."\n\nRelevance to UPSC: GS-III (growth, national income accounting); Prelims facts on GDP/GVA methodology; GS-II fiscal-federal capex angle; Essay on India’s growth model.`),
    N(17, 'Election Commission publishes Booth-Level Officer digitisation guidelines', 'The Election Commission has published BLO-digitisation guidelines to sync electoral rolls with census geography ahead of 2027, addressing duplicate and migrant-voter issues.', 'Indian Express', 'GS2', 'Governance', 5, ['elections', 'electoral rolls', 'ECI'], `The Election Commission of India has released detailed guidelines for digitising Booth-Level Officer (BLO) workflows, designed to synchronise electoral-roll geography with the upcoming Census 2027 house-listing frame — the first time the two largest civic databases will be built on a shared spatial backbone.\n\nThe reform targets chronic roll-quality issues: duplicates from migration, dead electors persisting across revisions, and urban tenements under-enrolled. BLOs will use a geo-tagged app with household-level records, change-tracking, and offline sync; electors get QR-verified e-EPIC cards and an AI-assisted duplicate-detection layer reviewed by human officers.\n\nRights advocates have emphasised the procedural safeguards: the guidelines mandate notice-and-hearing before any deletion, appeal timelines to District Election Officers, and annual "roll health" reports per assembly constituency. The ECI has paired the rollout with a migrant-voter framework consultation — remote voting options for inter-state migrant workers being the long-promised, still-piloted frontier.\n\nElection historians place this in the ECI’s technology arc — from indelible ink to VVPAT — as an administrative-integrity upgrade whose success will be measured not in apps launched but in the audited delta of roll errors per constituency.\n\nRelevance to UPSC: GS-II (election machinery, ECI); GS-III (technology in governance); Prelims facts on BLO/SVEEP; GS-IV integrity in public institutions.`),
    N(18, 'Rajasthan’s solar-wind hybrid park crosses 5 GW; battery storage tenders annexed', 'India’s largest operational hybrid renewable park reaches 5 GW with co-located battery tenders, demonstrating the firm-renewable model for grid planners.', 'PIB', 'GS3', 'Energy', 5, ['renewable energy', 'battery storage', 'grid'], `The Bhadla-adjacent solar-wind hybrid complex in Rajasthan has crossed 5 GW of operational capacity, making it India’s largest hybrid renewable installation, with the state utility awarding annexed tenders for 1.5 GWh of battery energy storage (BESS) to convert the park’s variable output into firmer supply.\n\nThe hybrid model’s logic is complementary profiles: desert solar peaks at noon, seasonal winds strengthen evening generation, and co-located transmission halves per-unit evacuation cost. The BESS awards — at record-low discovered prices — close the loop, storing noon surplus for the 6–10 pm demand peak that coal currently carries.\n\nGrid engineering has been the quiet achievement: synthetic inertia from grid-following inverters was supplemented with grid-forming inverters in the park’s later phases, a technology India’s grid code now mandates for new large renewable parks. Officials report curtailment at the complex has fallen below 2% from 8% two years ago.\n\nThe development feeds directly into India’s 500 GW non-fossil target (now past 50% of installed capacity) and the National Electricity Plan’s storage trajectory of 47 GW/236 GWh by 2032 — numbers that convert climate pledges into dispatch schedules.\n\nRelevance to UPSC: GS-III (energy, infrastructure, technology); Prelims facts on BESS and hybrid parks; GS-II energy-security policy; Essay on the energy transition.`),
    N(18, 'NCERT rolls out new Class 7-8 social-science framework with local-history modules', 'The new textbooks integrate state-specific history modules and data-literacy exercises; teacher-training webinars are scheduled through the winter.', 'The Hindu', 'GS2', 'Education', 5, ['NCERT', 'NCF-SE', 'curriculum'], `NCERT has released the new social-science framework for Classes 7 and 8 under the National Curriculum Framework for School Education (NCF-SE), featuring state-specific local-history modules, primary-source exercises, and data-literacy units built around census and NFHS datasets.\n\nThe pedagogical shift is from survey-text to inquiry: each unit pairs a national narrative with a local probe — students in Odisha, for example, will study maritime Kalinga trade alongside national ancient-economy chapters, using archaeology summaries and map exercises. Data-literacy units ask students to read census tables, gender ratios and migration flows from their own district.\n\nTeacher preparation is the delivery risk. NCERT has scheduled 40+ webinar modules and district-level workshops through the winter, with state SCERTs translating materials into 22 languages. Education researchers caution that textbook reform without assessment reform is half-done: CBSE has signalled competency-based question patterns extending to middle classes, aligning with NEP 2020’s assessment direction.\n\nHistorians' associations have welcomed the primary-source emphasis while urging balanced historiography in the state modules — a live debate as several state boards simultaneously revise their own curricula. The framework’s next phase covers secondary classes' economics and civics.\n\nRelevance to UPSC: GS-II (education policy); GS-I (history education); Prelims facts on NCF-SE/NEP; Essay on education and citizenship.`),
    N(19, 'Railways approves seventh Vande Bharat batch; aluminium car-body technology inducted', 'Indian Railways clears 300 more trainsets with aluminium body technology transfer, targeting 160 kmph operations on graded routes.', 'PIB', 'GS3', 'Infrastructure', 5, ['Indian Railways', 'Vande Bharat'], `The Union Cabinet has approved the seventh batch of Vande Bharat trainsets — 300 additional rakes — with Integral Coach Factory, Chennai, inducting aluminium car-body manufacturing technology through a transfer-of-technology agreement, moving the flagship trainset program to lighter, faster platforms.\n\nThe aluminium shift is engineering economics: car-body mass falls roughly 25% versus steel rakes, cutting traction energy per seat-kilometre, reducing track wear, and enabling the 160 kmph commercial-speed target on routes with gradients — the Western Ghats corridors first. The agreement includes localisation of bogies, couplers and interior modules, with indigenisation locked at 85%+ by the third year.\n\nRailways' planning documents place the trainsets in a broader system upgrade: 1,300 km of 130–160 kmph sections under the speed-up programme, Kavach train-protection system deployments crossing 3,000 km, and platform-length standardisation across 200 stations. Officials project delivery cadence at two trainsets per month once production stabilises.\n\nFor passengers, the visible deltas will be journey-time cuts on trunk routes and reliability in fog season, where the new rakes' bogies and Kavach integration outperform legacy consists.\n\nRelevance to UPSC: GS-III (infrastructure, railways); Prelims facts on Vande Bharat/Kavach; GS-II public-enterprise reform angle.`),
    N(19, 'Digital Agriculture dashboards go live in 100 districts; farmer IDs cross 6 crore', 'The agri-stack now links farmer IDs with land records, crop-sown data and credit history; pilot districts show 40% faster crop-loan sanctions.', 'Indian Express', 'GS3', 'Agriculture', 6, ['agri-stack', 'digital agriculture', 'fintech'], `The Digital Agriculture Mission’s core infrastructure — the "agri-stack" — has crossed six crore farmer IDs with live dashboards in 100 districts, creating a federated digital public infrastructure for agriculture that links identity, land records, crop-sown data and credit history.\n\nThe stack’s components matter for understanding it: farmer IDs (Aadhaar-anchored), geo-referenced village maps, crop-sown registries built from satellite imagery verified by field enumerators, and a consent-based data-exchange layer modelled on account-aggregator architecture. In pilot districts, crop-loan sanction times have fallen by 40% as banks verify land and crop data digitally instead of through branch visits.\n\nThe second-order uses are emerging: parametric insurance products priced on village-level weather-crop correlations; targeted advisories through advisory call centres; and procurement auto-verified against registries, cutting leakages documented by earlier audits. Farmer-producer organisations get a structured market interface with aggregate supply visibility.\n\nPrivacy and equity questions persist: tenant farmers — a third of cultivators by some estimates — may not have land-record linkage, and consent architectures must be genuinely informed for smallholders. The mission’s response is an enumerator-assisted consent flow and a tenant-farmer registry pilot in two states.\n\nRelevance to UPSC: GS-III (agriculture, digital infrastructure); GS-II (governance innovation, DBT); Prelims facts on the Digital Agriculture Mission; Essay on data for development.`),
    N(20, 'Textiles: PM MITRA parks get first anchor tenants; technical-textiles policy 2.0 drafted', 'Seven PM MITRA mega textile parks have signed anchor tenants; a technical-textiles policy targets medical, agro and geotextile import substitution.', 'The Hindu', 'GS3', 'Industry', 5, ['textiles', 'PM MITRA', 'technical textiles'], `The seven PM Mega Integrated Textile Region and Apparel (PM MITRA) parks — the flagship cluster programme for textiles — have signed their first anchor tenants across Tamil Nadu, Telangana, Gujarat, Karnataka, Madhya Pradesh, UP and Maharashtra, with combined committed investment crossing ₹30,000 crore.\n\nThe park model integrates the entire value chain: spinning, weaving, processing, garmenting and technical textiles on plug-and-play industrial land with common utilities — effluent treatment, testing labs, and worker housing. Officials expect the parks to compress India’s garment-export response time, the key competitive gap against Bangladesh and Vietnam.\n\nThe ministry has also drafted a Technical Textiles Policy 2.0, targeting import substitution in medical textiles, agro-textiles, geotextiles and protective gear — segments growing at 12%+ annually where India still imports intermediates. The policy pairs the existing National Technical Textiles Mission’s R&D grants with procurement mandates: geotextiles are now specified in national-highway tenders above defined traffic thresholds.\n\nIndustry’s ask remains trade-agreement certainty: FTA ratifications with the UK and EU-negotiation momentum matter more to apparel orders than domestic incentives, executives note — which is why the textile ministry’s trade desk now participates in commerce-department negotiating rounds.\n\nRelevance to UPSC: GS-III (industrial policy, textiles); Prelims facts on PM MITRA/NTTM; GS-II trade-policy interface.`),
    N(21, 'Odisha: Paradip refinery’s petrochemical complex commissioned; state pins jobs hopes downstream', 'The Paradip petrochemical complex — polymer units — begins commercial production, anchoring an Odisha plastics-cluster strategy.', 'The Hindu', 'GS3', 'Industry', 5, ['Odisha', 'petrochemicals', 'Paradip'], `The Paradip Petrochemical Complex — a ₹27,000 crore downstream addition to the Paradip refinery — has commenced commercial production of polymers, marking Odisha’s entry into petrochemical manufacturing and anchoring the state’s plastics-cluster strategy for the eastern economy.\n\nThe economic design is value-chain deepening: polymers that were earlier shipped as imported pellets or finished goods will now feed a planned plastics processing park adjacent to the complex, where MSME units mould consumer goods, packaging and agri-inputs. The state’s industrial policy offers capital subsidies for downstream units, targeting 25,000 direct jobs in the cluster’s first phase.\n\nStrategically, the complex de-risks India’s polymer trade balance — polymer imports run into billions of dollars — and strengthens the eastern corridor’s industrial base beyond mining and metals. Paradip’s port adjacency enables both feedstock import and product export logistics.\n\nEnvironmental compliance is the watch item: the complex operates under tightened effluent norms with zero-liquid-discharge commitments, and the state pollution board has mandated community air-quality dashboards for the industrial belt — a governance experiment in transparency that officials call a template for future heavy-industry clearances.\n\nRelevance to UPSC: GS-III (industry, petrochemicals); GS-I (regional development, Odisha); Prelims geography of Paradip; Essay on eastern India’s industrialisation.`),
    N(21, 'NavIC gets L1 signal upgrade; chipset mandates extended to smartphones', 'The NavIC constellation’s L1 interoperability signal is operational across satellites; government extends chipset-support mandates for consumer devices.', 'PIB', 'GS3', 'Science & Technology', 5, ['NavIC', 'satellite navigation'], `The Indian Regional Navigation Satellite System (NavIC) has completed the L1-signal upgrade across its operational constellation, making the system interoperable with the world’s dominant GNSS chipset ecosystem and clearing the path for NavIC support in consumer smartphones from the next regulatory cycle.\n\nThe engineering story: NavIC originally broadcast in L5 and S-bands, which many global chipsets did not support. The L1 addition — engineered into the newer NVS-series satellites — lets existing silicon designs pick up NavIC with minimal changes, collapsing the adoption barrier that industry had cited in mandate discussions.\n\nUse cases are already domestic-scale: fishing-vessel tracking under the fisheries ministry’s transponder programme, railways' Kavach train-protection localisation, power-grid time-sync, and defence applications that motivated the system’s independent design. Consumer adoption adds mass-market resilience — dual-constellation devices improve urban accuracy and reduce single-system dependence.\n\nStrategists note the sovereignty logic: GPS, Galileo, BeiDou and GLONASS each anchor their regions' location-based economies; NavIC’s regional footprint with commercial-grade accuracy gives India the same infrastructure independence, with the NVS replenishment schedule through 2028 already funded.\n\nRelevance to UPSC: GS-III (space technology, navigation); Prelims facts on NavIC frequencies and satellites; GS-II technology sovereignty angle.`),
    N(22, 'PLFS annual data: unemployment at 3.2%; female participation rises again', 'The Periodic Labour Force Survey’s annual report shows steady unemployment decline and a seventh straight year of rising female labour-force participation.', 'PIB', 'GS3', 'Employment', 6, ['employment', 'PLFS', 'female LFPR'], `The Periodic Labour Force Survey’s annual report records India’s unemployment rate at 3.2% of the labour force — the lowest in the series — with the female labour-force participation rate rising for the seventh consecutive year to above 41%, driven by self-employment, agriculture and urban service-sector absorption.\n\nThe quality question shadows the headline. Economists parsing the micro-data note the rise in "unpaid family helpers" among women’s work and the persistence of informality (roughly 90% of workers), arguing the participation surge partly reflects distress and partly real absorption in self-help-group-linked micro-enterprise — the truth being a mix of both. Real wage growth for regular salaried workers has been positive but modest.\n\nOn the skilling side, placement trackers under the national skilling programme have crossed 10 lakh verified placements this year, with logistics, retail, healthcare and green-energy trades leading. The ministry’s next reform targets recognition of prior learning at scale — certifying experienced informal workers rather than only training new entrants.\n\nThe policy frontier is productivity: with employment growing faster than jobs' quality, the economic argument converges on labour-intensive manufacturing (textiles, electronics assembly, food processing) and services exports — both capital-light, both dependent on the trade and regulatory environment.\n\nRelevance to UPSC: GS-III (employment, growth and jobs); GS-II (welfare design for workers); Prelims facts on PLFS methodology; Essay on India’s jobs transition.`),
    N(23, 'Ajanta’s painted caves get 3D digital twin; ASI opens virtual-reality access', 'The Archaeological Survey of India and IIT collaboration has created millimetre-accurate 3D twins of Ajanta’s painted caves, with VR access launched for schools.', 'Indian Express', 'GS1', 'History & Culture', 5, ['Ajanta', 'heritage', 'digital preservation'], `The Archaeological Survey of India has unveiled millimetre-accurate 3D digital twins of the Ajanta Caves' painted interiors, created through a multi-year photogrammetry and laser-scanning collaboration — and launched virtual-reality access for schools and museums, a first for a World Heritage property in India.\n\nThe conservation logic is threefold. Documentation: the twins record paint-layer stratigraphy and micro-cracking at a resolution impossible for the naked eye, giving conservators a baseline against which future deterioration is measured. Access management: VR diverts physical footfall — Ajanta’s caves face humidity and CO2 stress from millions of annual visitors. Research: art historians can now examine pigment transitions and iconographic details remotely, seeding new scholarship on the Vakataka-era workshops.\n\nThe programme follows successful digital documentation of Ellora’s Kailasa temple and ongoing scanning at Sanchi. Officials indicate Hampi and Khajuraho are next, with a national heritage-twin repository planned under the culture ministry’s digital architecture.\n\nFor heritage enthusiasts, the reminder is the content itself: Ajanta’s murals — the Bodhisattva Padmapani, the Dying Princess, Jataka narrative panels — remain the touchstone of Indian painting’s classical phase, executed between the 2nd century BCE and 5th century CE.\n\nRelevance to UPSC: GS-I (Indian art & culture); Prelims facts on Ajanta/Ellora; GS-III (technology for heritage); Essay on preservation and access.`),
    N(24, 'NITI Aayog pushes urban water-metering mandate; sewage-treatment tenders accelerate', 'NITI Aayog’s urban water review recommends mandatory metering in million-plus cities; urban water-mission tenders cross ₹1 lakh crore cumulative.', 'Yojana', 'GS2', 'Governance', 6, ['water', 'metering', 'urban infrastructure'], `NITI Aayog’s urban water review has recommended mandatory consumer metering across million-plus cities within three years, coupled with volumetric tariffs — the administrative condition, the report argues, for making India’s urban water systems financially and ecologically sustainable.\n\nThe diagnosis is familiar: Indian cities supply water largely un-metered or flat-rated, so utilities cannot recover costs, cannot detect leaks (non-revenue water averages 40%+), and cannot price conservation. The prescriptions pair metering with district-metered-area instrumentation, as piloted in Pimpri-Chinchwad and Chandigarh, where losses fell by 15+ percentage points.\n\nThe investment pipeline is substantial: urban water-mission tenders for water supply and sewage treatment have crossed ₹1 lakh crore cumulatively. States like Odisha (Puri’s drink-from-tap achievement), Madhya Pradesh and Gujarat lead the operational reform league tables.\n\nThe political economy is the challenge: metering is publicly unpopular, utility tariffs are controlled by elected councils, and ring-fencing water utilities requires municipal capacity that the 74th Amendment’s promise never fully delivered. The framing is pragmatic — meter first where supply is reliable, use the recovered revenue to extend supply to the unconnected.\n\nRelevance to UPSC: GS-II (urban governance, water policy); GS-III (infrastructure, conservation); GS-I (urban geography); Prelims facts on AMRUT 2.0.`),
    N(25, 'Tejas Mk1A deliveries cross 20 aircraft; engine supply agreement finalised', 'HAL has delivered over 20 Tejas Mk1A fighters; the long-pending F404 engine supply agreement is finalised, de-risking the production ramp.', 'PIB', 'GS3', 'Defence', 5, ['Tejas', 'HAL', 'indigenisation'], `Hindustan Aeronautics Limited has crossed 20 deliveries of the Tejas Mk1A fighter — the radar-and-self-protection upgraded variant — with the long-pending F404 engine supply agreement finalised, removing the last major schedule risk from the 83-aircraft Indian Air Force order.\n\nThe Mk1A upgrade matters operationally: AESA radar, an electronic-warfare suite, air-to-air refuelling probes, and beyond-visual-range missile integration transform the aircraft from a point-defence interceptor to a multirole workhorse. IAF squadrons at Sulur are converting on schedule.\n\nThe industrial story is the deeper one: the supplier base spans 100+ MSMEs producing composites, avionics and ground systems; officials project the Mk1A line plus the Mk2 and AMCA programmes to sustain a ₹50,000 crore aero-ecosystem by 2030. The indigenous Kaveri-derivative engine programme continues in parallel.\n\nExport interest is real — Malaysia, Egypt and Argentina have run evaluations — but orders hinge on delivery-record credibility, which is precisely what the ramp establishes. Defence economists frame Tejas as the test-case for India’s entire indigenisation thesis: design agency, production capability, and a certified supply chain, all aligned.\n\nRelevance to UPSC: GS-III (defence indigenisation); Prelims facts on Tejas variants; GS-II defence-procurement reform angle.`),
    N(26, 'India tests hydrogen-powered train; green hydrogen mission funding doubled', 'Indian Railways tested its first hydrogen train; the National Green Hydrogen Mission’s corpus is doubled as electrolyser manufacturing incentives expand.', 'The Hindu', 'GS3', 'Energy', 5, ['green hydrogen', 'hydrogen train'], `Indian Railways has tested its first hydrogen-powered train on the Jind-Sonipat section in Haryana — a retrofitted unit with hydrogen fuel-cell traction — while the government announced a doubling of the National Green Hydrogen Mission’s corpus, alongside an expanded production-linked incentive for electrolyser manufacturing.\n\nThe hydrogen train is a demonstrator with a specific use-case logic: non-electrified branch lines and hilly sections where overhead electrification is uneconomic. The train produces only water vapour at point of use, with hydrogen supplied by a refuelling facility using electrolysis powered by renewable-linked contracts. Safety engineering — crash-resistant storage, leak-detection interlocks — was certified through international peer review.\n\nThe mission funding doubling accelerates the wider stack: the electrolyser PLI now targets multi-gigawatt domestic manufacturing capacity, green-hydrogen hubs at Tuticorin, Paradip and Kandla have anchor offtakers, and export-certification protocols with the EU and Japan are in negotiation — certification being the gateway to premium "green" markets.\n\nEconomists size the opportunity soberly: green hydrogen costs remain above grey hydrogen, and the curve depends on electrolyser scale and renewable tariffs. But the strategic bet is option value — energy-import independence in a decarbonising world, where hydrogen becomes the tradeable energy carrier of mid-century.\n\nRelevance to UPSC: GS-III (energy, new technologies); Prelims facts on the Green Hydrogen Mission; Essay on the hydrogen economy.`),
    N(27, 'CERT-In reports 40% rise in deepfake fraud; DPDP rules notified for consent architecture', 'The cyber agency’s half-yearly report flags deepfake-enabled financial fraud; the Digital Personal Data Protection Rules are notified, operationalising consent managers.', 'Indian Express', 'GS3', 'Internal Security', 6, ['cybersecurity', 'deepfakes', 'DPDP Act'], `The computer emergency response team’s half-yearly threat report records a roughly 40% rise in deepfake-enabled fraud — voice-cloning scams and synthetic-KYC attempts chief among them — even as the government notified the Digital Personal Data Protection (DPDP) Rules, operationalising the 2023 Act’s consent architecture.\n\nThe fraud economics are stark: average per-victim losses in voice-clone scams have multiplied as generative audio now needs seconds of sample audio, and the "digital arrest" ruse — impersonating police via video calls with AI backgrounds — has spread from metros to smaller cities. Countermeasures pair public-awareness campaigns with a bank-to-bank freeze protocol and a citizen reporting portal that has recovered over ₹120 crore in flagged fraud proceeds this year.\n\nThe DPDP Rules complete the privacy architecture: consent managers (registered intermediaries through which citizens grant and revoke data consent), breach-notification timelines, children’s-data provisions requiring verifiable parental consent, and significant-data-fiduciary obligations including algorithmic due-diligence and data-protection officers.\n\nCompliance costs will reshape the data economy — startups gain regulatory clarity but need consent workflows; ad-tech’s third-party data models face retargeting; and government’s own exemptions (national security, legal claims) remain the civil-liberties critique. The Data Protection Board’s first adjudications will define the rules' real edges.\n\nRelevance to UPSC: GS-III (cyber security, data protection); GS-II (governance of technology); Prelims facts on DPDP/CERT-In; GS-IV privacy and ethics.`),
    N(28, 'Antarctic Treaty meeting: India presents Himadri station expansion plans', 'India’s Antarctic programme presented expansion plans for the replacement research station Himadri at the consultative meeting; polar-logistics funding enhanced.', 'PIB', 'GS2', 'International Relations', 5, ['Antarctica', 'Himadri', 'polar science'], `India’s Antarctic programme has presented plans for Himadri — the replacement research station for Maitri — at the Antarctic Treaty Consultative Meeting, securing preliminary environmental-assessment feedback from consultative parties for the station’s modular, low-impact design.\n\nThe scientific case is urgent: Maitri, commissioned in 1989 on the Schirmacher Oasis, is nearing end-of-life engineering, and India’s polar research agenda — ice-core palaeoclimate, Southern Ocean biogeochemistry, and satellite geodesy — needs a modern platform. Himadri’s design emphasises renewable integration (wind-solar hybrids with thermal backup), water recycling and low-footprint inland logistics.\n\nIndia’s Antarctic institutional architecture is complete on paper: the Antarctic Act, 2022 gave domestic legal effect to the treaty system, covering environmental clearances, permits for expeditions, and liability provisions. The programme operates three stations — Dakshin Gangotri (buried, now a reference site), Maitri, and Bharati — with the National Centre for Polar and Ocean Research as nodal agency.\n\nGeopolitically, Antarctica’s governance regime — the 1959 Treaty suspending territorial claims, the Madrid Protocol’s mining ban — is periodically stress-tested by resource interest and great-power presence. India’s position, consistently, is science-first stewardship.\n\nRelevance to UPSC: GS-I (physical geography of polar regions); GS-II (international treaties); GS-III (scientific infrastructure); Prelims facts on Indian stations and the Antarctic Act.`),
    N(29, 'ASER 2025 finds foundational literacy gains; rural digital divide narrows', 'The Annual Status of Education Report records improvements in Class 3 reading and arithmetic; government-school digital access crosses 60%.', 'The Hindu', 'GS2', 'Education', 6, ['ASER', 'foundational literacy', 'NIPUN Bharat'], `The Annual Status of Education Report (ASER) — the citizen-survey that has tracked rural learning since 2005 — records the first sustained post-pandemic gains in foundational skills: Class 3 children able to read a Class 2 text rose to 27% (from 20% in 2022), and basic arithmetic recovery is visible across grades.\n\nThe credit, education researchers converge, belongs substantially to NIPUN Bharat — the foundational literacy and numeracy mission — whose structured teacher-training, classroom-level assessment trackers and mother-tongue early-grade materials have now operated at scale for three years. States like Uttar Pradesh, Himachal, Kerala and Punjab show the strongest gains.\n\nThe digital finding is the sleeper: government-school access to digital devices has crossed 60% of rural households reporting a school-provided device or shared ICT lab, with the national digital-education platform now measured in classroom hours rather than downloads. The divide is now less about devices than about teacher digital-pedagogy capacity — the next phase’s training frontier.\n\nThe out-of-school finding remains the equity alarm: enrolment slips in the 15–16 age band in some states, tied to child labour and marriage in the transition window — the segment where scholarship-linked retention needs reinforcement.\n\nRelevance to UPSC: GS-II (education, welfare delivery); GS-I (social issues); Prelims facts on ASER/NIPUN; Essay on human capital and equity.`),
    N(30, 'Railways completes LHB coach fleet transition; conventional coaches retired', 'Indian Railways has retired its last conventional ICF-design passenger coaches from mainline service, completing the LHB/Vande Bharat transition for safety and speed.', 'PIB', 'GS3', 'Infrastructure', 4, ['Indian Railways', 'LHB coaches', 'safety'], `Indian Railways has retired the last conventional ICF-design passenger coaches from mainline service, completing a two-decade transition to the Linke Hofmann Bus (LHB) technology across its express fleet — a safety and comfort milestone.\n\nThe engineering delta is decisive: LHB coaches use stainless-steel bodies with anti-climbing crumple zones, disc brakes, and better crash-energy management — the design class that has survived collisions with dramatically lower casualty counts in global precedents. Passenger-facing gains include wider windows, modular interiors, and superior ride stability at 130 kmph operations now standard on trunk corridors.\n\nThe industrial arc is equally notable: production was fully localised, scaling from imported kits in 2000 to thousands of coaches annually across variants — including the Vande Bharat trainsets that succeeded the LHB flagship programme. Retired ICF coaches are being converted into art installations, hospitals-on-wheels and station heritage exhibits.\n\nSafety economics complete the case: the LHB fleet’s operational era has recorded the lowest consequential-train-accident rates in railway history, with Kavach deployment and track-renewal investment compounding the technology dividend.\n\nRelevance to UPSC: GS-III (infrastructure, railways); Prelims facts on LHB/ICF/Kavach; Essay on technology transitions in public systems.`),
    N(31, 'Supreme Court collegium recommends eight High Court judges; diversity in focus', 'The collegium’s latest recommendations stress regional and gender diversity; sanctioned-strength gaps and case pendency frame the judicial-reform debate.', 'Indian Express', 'GS2', 'Judiciary', 5, ['judiciary', 'collegium', 'appointments'], `The Supreme Court collegium has recommended eight appointments to various High Courts, with its resolution emphasising gender and regional diversity — five of the eight names are women, and three come from the district judiciary, a notably high share for a single recommendation round.\n\nThe numbers behind the reform debate are stark: High Courts operate with roughly 30% sanctioned-strength vacancies (over 300 seats), and crores of cases are pending across the system, with district courts bearing the bulk. The collegium’s stated criteria — merit, integrity, diversity — now come with a visible weighting toward candidates who can clear security vetting without indefinite holds, an old friction point with the executive.\n\nThe appointments-machinery question returns periodically: the NJAC experiment (struck down in 2015) and the un-amended Memorandum of Procedure define a system where the collegium recommends and the government may return or delay names. Clearance timelines have improved recently, which officials credit to published waiting-list reforms.\n\nJudicial-reform scholars add the structural view: appointment speed is necessary but not sufficient; case-flow management, the e-Courts digital infrastructure, and alternate-dispute-resolution institutionalisation are the pendency levers that appointments alone cannot pull.\n\nRelevance to UPSC: GS-II (judiciary, appointments); Prelims facts on collegium/MoP; GS-IV institutional integrity; Essay on justice delivery.`),
    N(32, 'Odisha: heritage-tourism circuit approved for Dhauli and Buddhist triangle sites', 'The Centre approved a heritage-tourism circuit around Dhauli, Langudi and the Lalitgiri-Ratnagiri-Udayagiri Buddhist sites with ₹400 crore for infrastructure.', 'PIB', 'GS1', 'History & Culture', 5, ['Odisha', 'Kalinga war', 'Buddhist heritage'], `The Union Tourism Ministry has approved a ₹400 crore heritage-circuit development plan for Odisha linking the Dhauli Shanti Stupa precinct — site of the Kalinga War’s aftermath that transformed Ashoka — with the Buddhist diamond-triangle sites of Lalitgiri, Ratnagiri and Udayagiri.\n\nThe circuit’s historical spine is exceptional: Dhauli’s Ashokan edicts (the separate rock edicts addressed to the officials of Kalinga) mark the psychological pivot of Indian history — the Mauryan emperor’s dhamma turn after 261 BCE. The diamond-triangle monasteries, flourishing from the 5th to 13th centuries CE, produced the scholarly ecosystem from which Buddhist tantras travelled to Tibet and Southeast Asia; Ratnagiri’s monastic doorframe and Udayagiri’s stepped stupa are signature monuments.\n\nInfrastructure follows interpretation: interpretation centres with augmented-reality reconstructions, electric transport loops from Bhubaneswar, conservation labs, and community-led homestay clusters in Khordha and Jajpur districts. The state’s tourism policy pairs the circuit with the Puri-Konark-Chilika flow to lengthen tourist stays.\n\nFor Odisha, the circuit is also identity infrastructure — the state’s ancient name Kalinga anchors a maritime heritage (Bali Jatra commemorates trade voyages) that the government is repositioning in cultural diplomacy, including ties with Indonesia’s Bali province.\n\nRelevance to UPSC: GS-I (art, culture, history of Odisha); GS-III (tourism economy); Prelims facts on Ashokan edicts and Buddhist sites; Essay on heritage as development capital.`),
    N(33, 'MeitY releases AI governance guidelines draft; sandbox for startups proposed', 'The IndiaAI Mission’s governance draft proposes a risk-tiered framework, a regulatory sandbox for startups, and a compute-access equity programme.', 'Indian Express', 'GS3', 'Science & Technology', 6, ['AI governance', 'IndiaAI', 'regulation'], `The electronics and IT ministry has released the draft National AI Governance Guidelines under the IndiaAI Mission, proposing a risk-tiered regulatory framework — obligations scaling with an AI system’s potential harm — alongside a regulatory sandbox for startups and a compute-access equity programme for researchers and small firms.\n\nThe framework’s architecture borrows deliberately: risk tiers echo global precedents, but the Indian draft softens compliance with principles-based codes of practice rather than ex-ante licensing — a choice officials justify by the startup-heavy composition of India’s AI sector. High-risk applications — biometric identification, credit scoring, exam proctoring — would face transparency, human-oversight and audit obligations.\n\nThe sandbox responds to the sector’s central complaint: regulatory uncertainty chilling deployment. Startups will be able to pilot governed-use AI in healthcare triage, agri-advisory and education with regulator-sanctioned safe harbours. The compute programme operationalises the mission’s public GPU facility with subsidised access quotas for academia and small enterprises.\n\nThe unresolved tensions are the familiar trio: deepfake liability (fraud data making this urgent), copyright in training data (pending litigation), and state capacity for enforcement. The final guidelines, expected after consultation, will inform planned amendments to IT rules for synthetic-content labelling.\n\nRelevance to UPSC: GS-III (emerging technology, AI); GS-II (regulatory institutions); Prelims facts on IndiaAI Mission; Essay on innovation and regulation.`),
    N(34, 'Monsoon withdrawal completed on schedule; kharif foodgrain output projected at record', 'The weather office confirmed monsoon withdrawal; the agriculture ministry’s first-advance estimates project record kharif output on a well-distributed season.', 'The Hindu', 'GS1', 'Geography', 5, ['monsoon', 'kharif', 'food security'], `The India Meteorological Department has confirmed the southwest monsoon’s withdrawal from the entire country — completing on schedule after a season that delivered above-normal rainfall with an unusually even spatial distribution, ending years of either deficit or overly concentrated rain.\n\nThe agricultural dividend is immediate: the agriculture ministry’s first-advance estimates project kharif foodgrain output at a record level — rice leading, pulses recovering on expanded arhar acreage, and oilseeds rebounding from last year’s deficient patches. Reservoir storage stands well above the 10-year average, powering a strong rabi sowing outlook.\n\nThe distribution mattered more than the total: the season’s rainfall came without the prolonged mid-season breaks that historically hurt sowing, and without the extreme-rain clusters that flood standing crops. Agricultural economists credit improved forecasts with sowing-window optimisation — farmers adjusted transplanting dates in several states based on extended-range forecasts.\n\nThe policy pipeline now shifts to procurement and price management: rice procurement targets are raised, pulses price-support operations are pre-positioned, and buffer stocking norms have been revised upward — insurance against global grain-market volatility.\n\nRelevance to UPSC: GS-I (Indian geography, monsoon); GS-III (agriculture, food security); Prelims facts on IMD systems; Essay on climate and agriculture.`),
    N(35, 'Amrit Sarovar mission completes 75,000 ponds; groundwater stabilisation data emerges', 'The pond-building mission has completed its target; groundwater board data shows the first stabilisation of decline in over-exploited blocks.', 'PIB', 'GS3', 'Environment', 5, ['water conservation', 'groundwater', 'watershed'], `The Amrit Sarovar mission — launched to build 75 ponds per district — has completed its 75,000-waterbody target, and the Central Ground Water Board’s assessment shows the first broad stabilisation of groundwater decline in over-exploited blocks, the mission’s most consequential early signal.\n\nThe hydrogeology is straightforward but hard-won: decentralised recharge structures — ponds, check dams, recharge shafts — intercept runoff that previously escaped aquifers. In sample blocks across Bundelkhand, Marathwada and eastern Rajasthan, pre-monsoon water tables declined marginally against substantial annual declines in the baseline decade.\n\nThe mission’s design innovations made the difference: convergence funding (rural employment guarantee labour + district funds + corporate social responsibility), satellite-based geo-tagged siting on drainage lines, and community ownership through panchayat water committees with fishery rights — the economic hook that sustains desilting after inauguration. Fishery cooperatives report first-year incomes transforming pond maintenance economics.\n\nThe caveats are real: stabilisation is not recovery, urban groundwater governance remains fragmented, and quality problems (fluoride, nitrate) persist independent of quantity. The next phase links the ponds into river-basin master plans.\n\nRelevance to UPSC: GS-III (water conservation, groundwater); GS-II (rural governance, MGNREGA convergence); GS-I (physical geography); Essay on water security.`),
    N(36, 'ISRO unveils space-station module mockup; docking demonstrator validated', 'ISRO displayed a full-scale mockup of the first Bharatiya Antariksh Station module; the SPADEX docking demonstrator’s autonomous rendezvous results were confirmed.', 'PIB', 'GS3', 'Science & Technology', 5, ['ISRO', 'space station', 'SPADEX'], `ISRO has unveiled a full-scale mockup of the first module of the Bharatiya Antariksh Station (BAS) — India’s planned space station — confirming a 2028 target for the first module’s launch and validating the SPADEX docking demonstrator’s autonomous rendezvous results.\n\nThe architecture: BAS-1 is an eight-tonne-class module designed for a 3-4 crew capacity in low-earth orbit with an initial short-duration mission profile, expanding toward a multi-module permanent station by 2035. The design emphasises robotic-arm servicing, India-specific science racks (microgravity materials, life sciences, space medicine), and international payload slots — a deliberate open-platform posture.\n\nSPADEX — the Space Docking Experiment executed with twin satellites — was the critical-path technology: autonomous docking, berthing and fluid transfer are the capabilities that make a station operable. Officials indicate the crewed Gaganyaan missions will use BAS-adjacent infrastructure for training and early crew-logistics demonstration.\n\nThe economic framing is deliberate: the space-station programme’s budget is engineered to seed a domestic human-spaceflight industrial base — life-support systems, space-qualified electronics, and the hundreds of suppliers now qualified through Gaganyaan — positioning India for the post-ISS era’s commercial low-earth-orbit economy.\n\nRelevance to UPSC: GS-III (space technology); Prelims facts on BAS/SPADEX/Gaganyaan; Essay on India’s space ambitions.`),
    N(37, 'GST Council approves audit-reform; states get faster IGST settlement', 'The GST Council approved audit and settlement reforms and a faster IGST settlement cycle; a classification-dispute resolution framework was agreed.', 'The Hindu', 'GS3', 'Economy', 5, ['GST Council', 'fiscal federalism'], `The GST Council — meeting after the rate rationalisation — approved a package of audit and settlement reforms: the IGST apportionment cycle between centre and states moves from annual to quarterly settlement, and a standing classification-dispute resolution framework with state-nominated members is established.\n\nThe fiscal-federal mechanics matter: IGST — the integrated tax on inter-state sales — is the glue of the GST’s common-market design, and its slow annual apportionment created cash-flow uncertainty for states. Quarterly settlement with dashboard transparency addresses the states' trust deficit that the compensation-era disputes amplified.\n\nThe classification framework responds to a decade of litigation volume: nearly half of GST appellate cases are classification disputes, consuming tribunal bandwidth. The new framework pairs pre-consultation rulings with a binding alternate-resolution mechanism — a small institutional fix with large docket effects.\n\nCompliance-side measures round out the package: e-invoicing’s turnover threshold is lowered, and the returns-matching engine gets an auto-reconciliation interface for large taxpayers. Economists frame the session as post-rationalisation normalisation: the architecture’s plumbing now matters more than its rates.\n\nRelevance to UPSC: GS-II/III (fiscal federalism, GST Council); Prelims facts on IGST/compensation cess; Essay on cooperative federalism in economic governance.`),
    N(38, 'Ahmedabad confirmed as 2030 Commonwealth Games host; venue plan unveiled', 'The Commonwealth Games Federation confirmed Ahmedabad as 2030 host; the organising committee unveiled a venue masterplan anchored on the Sardar Patel Sports Enclave.', 'The Hindu', 'GS2', 'Sports', 5, ['Commonwealth Games', 'Ahmedabad'], `The Commonwealth Games Federation has confirmed Ahmedabad as host of the 2030 Commonwealth Games — the centenary edition — with India’s organising committee unveiling a venue masterplan anchored on the Sardar Patel Sports Enclave and distributed venues across Gandhinagar and the riverfront precinct.\n\nThe bid’s logic is infrastructure-first: Ahmedabad enters with the world’s largest cricket stadium, an emerging aquatics complex, and metro connectivity — leaving the build-list to an athletes' village, hockey and gymnastics arenas, and upgrades across existing campuses. The committee projects 70% of venues pre-existing, a sustainability argument that won the evaluation.\n\nThe longer game is the Olympics: India is a candidate for the 2036 Summer Games, and officials frame 2030 as the operational audition — transport orchestration, village logistics, and the technical-compliance record that the IOC’s Future Host Commission evaluates. The sports-governance agenda runs alongside: the Khelo India pathway’s athlete pipeline is the medal-project base.\n\nEconomists size the opportunity with the usual discipline: mega-event multipliers are overstated in the literature, but Ahmedabad’s urban-infrastructure legacy — metro extensions, riverfront revival, airport upgrades — has a pre-announced post-Games use plan, the variable that separates value from vanity in the hosting ledger.\n\nRelevance to UPSC: GS-II (sports governance); GS-III (infrastructure, economy of events); Prelims facts on CWG history; Essay on sports and soft power.`),
    N(39, 'Merchandise exports turn positive; engineering goods and electronics lead', 'Monthly merchandise exports turned positive year-on-year for the third consecutive month, led by engineering goods, electronics and pharma; the trade deficit narrows.', 'The Hindu', 'GS3', 'Economy', 5, ['exports', 'trade deficit', 'electronics'], `India’s merchandise exports have turned positive year-on-year for the third consecutive month, with engineering goods, electronics and pharmaceuticals leading the recovery, according to commerce-ministry data — narrowing the monthly trade deficit to its tightest in over a year.\n\nThe composition confirms structural shifts. Electronics exports (smartphones chief among them, riding the production-linked incentive ecosystem) have doubled over two years. Engineering goods — auto components, industrial machinery — track global capex recovery, while pharma’s regulated-market volumes hold steady. The traditional anchors — gems & jewellery and textiles — recover more slowly, tied to Western consumer sentiment and FTA timelines.\n\nServices exports remain the stabiliser: software and global-capability-centre receipts crossed $45 billion for the quarter, and the services surplus funds a substantial share of the merchandise deficit. Net remittances add the second cushion, keeping the current-account deficit near 1% of GDP — the comfortable zone.\n\nThe forward risks are policy ones: tariff actions on select categories, shipping-cost volatility through the Red Sea corridor, and the EU’s carbon-border compliance costs for metal exports. The commerce ministry’s district-exports-hubs programme is the domestic-side bet that export growth can be geographically democratised.\n\nRelevance to UPSC: GS-III (foreign trade, balance of payments); Prelims facts on export categories; GS-II trade-policy institutions; Essay on India in global value chains.`),
    N(40, 'e-Courts Phase-III crosses 10,000 virtual-hearing courtrooms; NHRC marks 30 years', 'The e-Courts project crossed 10,000 virtual-hearing-enabled courtrooms; the human rights commission marked 30 years with a pendency-awareness campaign.', 'Yojana', 'GS2', 'Governance', 5, ['e-Courts', 'virtual hearings', 'NHRC'], `The e-Courts Mission Mode Project’s third phase has crossed 10,000 virtual-hearing-enabled courtrooms nationwide, and video-conference hearings now account for a substantial share of all court proceedings — an infrastructure milestone that quietly redefines access to justice for litigants in remote districts.\n\nThe numbers behind the milestone: the project has digitised case-records for all district courts, deployed the National Judicial Data Grid (case-pendency analytics down to the judge level), and enabled e-filing with AI-assisted cause-list management. For litigants, the visible change is the end of the "multiple trips" justice tax — appearance by video, status by SMS, certified copies by portal.\n\nThe National Human Rights Commission’s 30th-anniversary observance framed the complementary agenda: custodial-justice audits (its database now tracks custody deaths in near-real-time), human-rights education in police academies, and the commission’s advisory jurisdiction feeding into legislative pre-scrutiny.\n\nLegal-tech scholars caution on the divide: virtual hearings assume connectivity and digital literacy that rural litigants, the elderly and persons with disabilities may lack — hence the e-Seva kendras at court complexes and the pro-bono legal-aid programme as the equity layer over the technology layer.\n\nRelevance to UPSC: GS-II (judiciary, governance reform, human rights); GS-III (technology in governance); Prelims facts on e-Courts/NJDG; Essay on justice and technology.`),
  ]
  for (const a of news) {
    await db.newsArticle.create({
      data: {
        title: a.title,
        summary: a.summary,
        content: a.content,
        source: a.source,
        gsTag: a.gsTag,
        subject: a.subject,
        date: isoDaysAgo(a.d),
        readMinutes: a.readMinutes,
        tagsJson: JSON.stringify(a.tags),
        prelimsJson: a.prelims ? JSON.stringify(a.prelims) : null,
        mainsJson: a.mains ? JSON.stringify(a.mains) : null,
        keywordsJson: a.keywords ? JSON.stringify(a.keywords) : null,
        mainsQuestionJson: a.mainsQ ? JSON.stringify(a.mainsQ) : null,
      },
    })
  }
  console.log(`News articles: ${news.length}`)

  // ─── Monthly digests (last 4 months) ────────────────────────────────────────
  for (let i = 1; i <= 4; i++) {
    const { month, year } = monthKey(i)
    const fileName = `monthly_news_${month}_${year}.pdf`
    await db.monthlyNewsDigest.create({
      data: { month, year, fileName, fileUrl: `/api/news/digest/${fileName}`, status: 'success' },
    })
  }
  console.log('Monthly digests: 4')

  // ─── Resources ──────────────────────────────────────────────────────────────
  type ResourceSeed = {
    title: string
    category: string
    exam: string
    year: number | null
    description: string
    fileType: string
    pages: number | null
    downloads: number
    slug: string
    contentSummary: string
  }
  const resources: ResourceSeed[] = []
  // 2026 papers — flagship on-screen reader entries (digital, no downloads)
  resources.push({
    title: 'UPSC Prelims 2026 — GS Paper I (On-Screen Reader with Solutions)',
    category: 'pyq', exam: 'UPSC', year: 2026,
    description: 'Held 24 May 2026. Read the paper digitally: verified questions with instant answer reveal and detailed explanations.',
    fileType: 'page', pages: null, downloads: 8600,
    slug: 'upsc-prelims-2026-gs1',
    contentSummary: 'Curated 2026 archive (verified 2026 questions + pattern-exact practice) with answer key, explanations and cross-check sources.',
  })
  resources.push({
    title: 'UPSC Prelims 2026 — CSAT Paper II (On-Screen Reader)',
    category: 'pyq', exam: 'CSAT', year: 2026,
    description: 'Held 24 May 2026. Quant, reasoning and comprehension with worked solutions — fully on screen.',
    fileType: 'page', pages: null, downloads: 5100,
    slug: 'upsc-prelims-2026-csat',
    contentSummary: 'Step-by-step solved archive modelled on the 2026 CSAT pattern with time-strategy notes.',
  })
  const mains2026: Array<[string, string, string]> = [
    ['GS1', 'upsc-mains-2026-gs1', 'Held 22 August 2026 (9 AM–12 PM). History, society and geography questions with directive-word analysis and model outlines.'],
    ['GS2', 'upsc-mains-2026-gs2', 'Held 22 August 2026 (2 PM–5 PM). Polity, governance, social justice and IR questions with model answer outlines.'],
    ['GS3', 'upsc-mains-2026-gs3', 'Held 23 August 2026 (9 AM–12 PM). Economy, environment, S&T and security questions with model outlines.'],
    ['GS4', 'upsc-mains-2026-gs4', 'Held 23 August 2026 (2 PM–5 PM). Ethics concepts and case studies with stakeholder-mapped approaches.'],
  ]
  for (const [gs, slug, desc] of mains2026) {
    resources.push({
      title: `UPSC Mains 2026 — ${gs} Question Paper (On-Screen Reader)`,
      category: 'pyq', exam: 'UPSC', year: 2026,
      description: desc,
      fileType: 'page', pages: null, downloads: 3900,
      slug,
      contentSummary: '2026 archive with marks/word-limit tags, directive verbs, model outlines and one-click AI evaluation.',
    })
  }
  resources.push({
    title: 'UPSC Mains 2026 — Essay Paper (On-Screen Reader)',
    category: 'pyq', exam: 'UPSC', year: 2026,
    description: 'Held 21 August 2026. All essay topics with dimension-building outlines and intro techniques.',
    fileType: 'page', pages: null, downloads: 4400,
    slug: 'upsc-mains-2026-essay',
    contentSummary: 'Quote-based and thematic essay topics with model dimensions and structure guidance.',
  })
  for (let y = 2025; y >= 2016; y--) {
    resources.push({
      title: `UPSC Prelims GS Paper I — PYQ ${y} with Solutions`,
      category: 'pyq', exam: 'UPSC', year: y,
      description: `Complete ${y} Prelims General Studies Paper I with answer key and detailed explanations for every question.`,
      fileType: 'pdf', pages: 24 + (2025 - y), downloads: 4200 + (y - 2016) * 310,
      slug: `upsc-prelims-gs1-pyq-${y}`,
      contentSummary: '100 questions covering Polity, Economy, History, Geography, Environment and Current Affairs with year-wise difficulty analysis and cutoff context.',
    })
  }
  for (const y of [2025, 2024, 2023, 2022]) {
    resources.push({
      title: `UPSC Prelims CSAT Paper II — PYQ ${y}`,
      category: 'pyq', exam: 'CSAT', year: y,
      description: `Full ${y} CSAT paper with step-by-step solutions for quantitative aptitude, reasoning and comprehension.`,
      fileType: 'pdf', pages: 20, downloads: 2400 + (2025 - y) * 220,
      slug: `upsc-prelims-csat-pyq-${y}`,
      contentSummary: '80 questions solved with shortcut methods, RC passage analysis and time-strategy notes.',
    })
  }
  for (const gs of ['GS1', 'GS2', 'GS3', 'GS4']) {
    for (const y of [2024, 2023]) {
      resources.push({
        title: `UPSC Mains ${gs} — PYQ ${y} (Question Paper + Model Answer Framework)`,
        category: 'pyq', exam: 'UPSC', year: y,
        description: `${y} Mains ${gs} question paper with directive-word analysis and model answer frameworks by Niyatee faculty.`,
        fileType: 'pdf', pages: 16, downloads: 1800 + (2025 - y) * 260,
        slug: `upsc-mains-${gs.toLowerCase()}-pyq-${y}`,
        contentSummary: '20 questions decoded: demand analysis, structure blueprints, value-addition points and intro/conclusion samples.',
      })
    }
  }
  resources.push({
    title: 'UPSC Mains Essay Paper — PYQ 2024 with Toppers’ Structures',
    category: 'pyq', exam: 'UPSC', year: 2024,
    description: 'Essay 2024 paper with two fully developed model essays and a library of intro techniques.',
    fileType: 'pdf', pages: 18, downloads: 2100,
    slug: 'upsc-mains-essay-pyq-2024',
    contentSummary: 'Abstract-interpretation method for philosophical topics, plus issue-based essay skeletons.',
  })
  resources.push({
    title: 'Indian Polity Short Notes — Constitution to Local Governance',
    category: 'notes', exam: 'UPSC', year: 2025,
    description: '60-page condensed Polity notes for rapid revision: articles, amendments, landmark judgments and PYQ trends.',
    fileType: 'pdf', pages: 60, downloads: 8900,
    slug: 'polity-short-notes',
    contentSummary: 'Preamble to Judiciary in 12 chapters, each ending with a 10-question rapid drill.',
  })
  resources.push({
    title: 'Geography Through Maps — GS1 Revision Atlas',
    category: 'notes', exam: 'UPSC', year: 2025,
    description: '45 annotated maps covering physical, Indian and world geography with UPSC map-question hotspots marked.',
    fileType: 'pdf', pages: 45, downloads: 7600,
    slug: 'geography-through-maps-atlas',
    contentSummary: 'Rivers, soils, monsoon mechanics, straits and neighbourhood maps with fact-boxes.',
  })
  resources.push({
    title: 'Modern Indian History Timeline Notes (1757–1947)',
    category: 'notes', exam: 'UPSC', year: 2025,
    description: 'Event-dense timeline notes with personality boxes and PYQ mapping for every era.',
    fileType: 'pdf', pages: 52, downloads: 6700,
    slug: 'modern-history-timeline-notes',
    contentSummary: 'Company rule to Freedom struggle in 8 phases, each with a one-page revision sheet.',
  })
  resources.push({
    title: 'Economy Survey Highlights — 8-Page Revision Sheet',
    category: 'notes', exam: 'UPSC', year: 2025,
    description: 'The latest Economic Survey distilled to eight pages: growth, inflation, employment and fiscal numbers.',
    fileType: 'pdf', pages: 8, downloads: 9800,
    slug: 'economy-survey-revision-sheet',
    contentSummary: 'Key tables, jargon decoder and prelims-fact extraction from every chapter.',
  })
  resources.push({
    title: 'Ethics (GS4) Case-Study Notes with 15 Solved Templates',
    category: 'notes', exam: 'UPSC', year: 2025,
    description: 'Frameworks for every case-study archetype plus 15 fully solved examples with examiner-style comments.',
    fileType: 'pdf', pages: 38, downloads: 5400,
    slug: 'ethics-case-study-notes',
    contentSummary: 'Stakeholder mapping, dilemma classification and conclusion-writing templates.',
  })
  resources.push({
    title: 'Niyatee Mentor-Approved UPSC Foundation Booklist',
    category: 'booklist', exam: 'UPSC', year: 2025,
    description: 'The exact books our mentors recommend for GS Foundation — minimal, sufficient, and mapped to the syllabus.',
    fileType: 'pdf', pages: 6, downloads: 12400,
    slug: 'foundation-booklist',
    contentSummary: 'NCERTs + standard references for each GS subject with read-order guidance and skip-list.',
  })
  resources.push({
    title: 'Mains Answer-Writing Resource Pack & Booklist',
    category: 'booklist', exam: 'UPSC', year: 2025,
    description: 'Value-addition sources: Yojana, Kurukshetra usage guide, data banks and quote collections for Mains.',
    fileType: 'pdf', pages: 9, downloads: 5100,
    slug: 'mains-resource-pack',
    contentSummary: 'How to convert reading into writing: compilation strategy for GS1-4 with examples.',
  })
  resources.push({
    title: 'UPSC Prelims 2025 GS Paper I — Official Answer Key',
    category: 'answer-key', exam: 'UPSC', year: 2025,
    description: 'Official answer key released by UPSC for the 2025 Prelims GS Paper I.',
    fileType: 'pdf', pages: 5, downloads: 15600,
    slug: 'upsc-prelims-2025-answer-key',
    contentSummary: 'Set-wise keys (A/B/C/D) with question-mapping to syllabus areas.',
  })
  resources.push({
    title: 'UPSC Prelims 2024 GS Paper I — Official Answer Key',
    category: 'answer-key', exam: 'UPSC', year: 2024,
    description: 'Official UPSC answer key for 2024 Prelims with difficulty analysis.',
    fileType: 'pdf', pages: 5, downloads: 11200,
    slug: 'upsc-prelims-2024-answer-key',
    contentSummary: 'Answer key plus cutoff trend commentary for the last 10 years.',
  })
  resources.push({
    title: 'OPSC OCS Prelims 2023 — Answer Key & Analysis',
    category: 'answer-key', exam: 'OPSC', year: 2023,
    description: 'OPSC Civil Services Prelims 2023 answer key with Odisha-specific question analysis.',
    fileType: 'pdf', pages: 7, downloads: 4300,
    slug: 'opsc-ocs-2023-answer-key',
    contentSummary: 'Key with topic-wise breakup: polity, Odisha geography, economy and current affairs.',
  })
  resources.push({
    title: 'UPSC Prelims 2024 CSAT — Official Answer Key',
    category: 'answer-key', exam: 'CSAT', year: 2024,
    description: 'Official CSAT 2024 key with section-wise difficulty rating.',
    fileType: 'pdf', pages: 4, downloads: 5200,
    slug: 'upsc-csat-2024-answer-key',
    contentSummary: 'Key plus RC-passage mapping and quantitative-topic frequency table.',
  })
  resources.push({
    title: 'Indian Polity Compendium (E-Book)',
    category: 'ebook', exam: 'UPSC', year: 2025,
    description: 'Niyatee’s 120-page e-compendium of Indian Polity: concepts, judgments, articles and practice sets.',
    fileType: 'pdf', pages: 120, downloads: 9700,
    slug: 'indian-polity-compendium-ebook',
    contentSummary: 'Makers, structures and dynamics of the Constitution with 400 practice MCQs.',
  })
  resources.push({
    title: 'Geography Through Maps (E-Book)',
    category: 'ebook', exam: 'UPSC', year: 2025,
    description: 'The interactive-map companion e-book: 60 maps with layered explanations for Prelims and Mains.',
    fileType: 'pdf', pages: 96, downloads: 6300,
    slug: 'geography-through-maps-ebook',
    contentSummary: 'From monsoon mechanics to maritime boundaries, each map with exam-oriented annotations.',
  })
  resources.push({
    title: 'Environment Quick Revision (E-Book)',
    category: 'ebook', exam: 'UPSC', year: 2025,
    description: 'Ecology, pollution, conservation laws and international conventions in one revision-friendly volume.',
    fileType: 'pdf', pages: 84, downloads: 5800,
    slug: 'environment-quick-revision-ebook',
    contentSummary: 'Species lists, treaty timelines and scheme tables formatted for weekly revision.',
  })
  for (let i = 1; i <= 3; i++) {
    const { month, year } = monthKey(i)
    const mName = new Date(year, month - 1, 1).toLocaleString('en-IN', { month: 'long' })
    resources.push({
      title: `Monthly Current Affairs Compilation — ${mName} ${year}`,
      category: 'current-affairs', exam: 'UPSC', year,
      description: `All ${mName} ${year} current affairs organised by GS paper with Prelims-fact boxes and Mains linkages.`,
      fileType: 'pdf', pages: 40, downloads: 7300,
      slug: `current-affairs-${mName.toLowerCase()}-${year}`,
      contentSummary: 'Polity, economy, IR, environment and S&T sections with practice MCQs at the end.',
    })
  }
  for (const r of resources) {
    await db.resource.create({ data: r })
  }
  console.log(`Resources: ${resources.length}`)

  // ─── Rankers ────────────────────────────────────────────────────────────────
  const rankers = [
    { name: 'xxxx', year: 2024, rank: 63, service: 'IAS', optional: 'Sociology', quote: 'Niyatee’s AI evaluation showed me exactly where my answers lost marks — week by week, the gaps closed.', avatarSeed: 'AM' },
    { name: 'Debasis Sahoo', year: 2024, rank: 142, service: 'IAS', optional: 'Geography', quote: 'The daily answer-writing discipline at Niyatee turned my biggest weakness into my strongest paper.', avatarSeed: 'DS' },
    { name: 'Priyanka Behera', year: 2024, rank: 287, service: 'IPS', optional: 'Political Science', quote: 'I never left Odisha for coaching — and I never felt I missed anything. That was the point.', avatarSeed: 'PB' },
    { name: 'Sourav Das', year: 2023, rank: 96, service: 'IAS', optional: 'Anthropology', quote: 'The mentor’s 1:1 reviews were brutally honest. That honesty is worth more than any topper’s notes.', avatarSeed: 'SD' },
    { name: 'Lipsa Routray', year: 2023, rank: 204, service: 'IFS', optional: 'History', quote: 'Current affairs tagged by GS paper — it sounds simple, but it changed how I revised.', avatarSeed: 'LR' },
    { name: 'Rakesh Kumar Panda', year: 2023, rank: 348, service: 'IRS', optional: 'Sociology', quote: 'CSAT removed more friends from the race than GS ever did. Niyatee’s CSAT bootcamp is the reason I stayed in it.', avatarSeed: 'RP' },
    { name: 'Sweta Mishra', year: 2022, rank: 117, service: 'IAS', optional: 'Sociology', quote: 'From DAF to final mock board, the interview programme was rehearsed until confidence became habit.', avatarSeed: 'SM' },
    { name: 'Jyoti Ranjan Nayak', year: 2022, rank: 391, service: 'IPS', optional: 'Odia Literature', quote: 'Fees were never a barrier — the scholarship test made quality guidance reachable for a farmer’s son.', avatarSeed: 'JN' },
    { name: 'Ananya Tripathy', year: 2024, rank: 452, service: 'IRS', optional: 'Economics', quote: 'The geography maps module made Prelims map questions feel like free marks.', avatarSeed: 'AT' },
    { name: 'Bibhuti Bhusan Sahu', year: 2022, rank: 509, service: 'IAAS', optional: 'Public Administration', quote: 'Every test discussion ended with one question: what will you change tomorrow? That habit built my rank.', avatarSeed: 'BS' },
    { name: 'Chinmayee Patnaik', year: 2023, rank: 268, service: 'IAS', optional: 'Psychology', quote: 'Structured learning plans meant I always knew what to do next — confusion is the real enemy.', avatarSeed: 'CP' },
    { name: 'Ashutosh Kar', year: 2024, rank: 611, service: 'IRS (C&IT)', optional: 'Philosophy', quote: 'I failed Prelims once. Niyatee’s analytics found my pattern of errors; the second attempt was different.', avatarSeed: 'AK' },
  ]
  for (const r of rankers) await db.ranker.create({ data: r })
  console.log(`Rankers: ${rankers.length}`)

  // ─── Testimonials ───────────────────────────────────────────────────────────
  const testimonials = [
    { name: 'Subhasmita Jena', batch: 'Foundation 2025-A', role: 'Working professional, Infosys', quote: 'Evening live classes fit my job perfectly. The recorded backlog feature means I have never fallen behind.', rating: 5 },
    { name: 'Manoranjan Behera', batch: 'Foundation 2025-B (Offline)', role: 'Fresh graduate, Utkal University', quote: 'The campus energy at Bhubaneswar is different — faculty know your name, your weak topics, and your next step.', rating: 5 },
    { name: 'Ritu Singh', batch: 'Prelims Target 2025', role: 'Third attempt aspirant', quote: '40 mocks in four months sounded terrifying. By test 20, the exam felt familiar. I cleared with margin.', rating: 5 },
    { name: 'Gourav Patra', batch: 'MAWP 2025', role: 'Mains aspirant', quote: 'AI evaluation within hours, mentor review within the week. My answer structure improved in six weeks flat.', rating: 5 },
    { name: 'Snehalata Mohanty', batch: 'CSAT Bootcamp', role: 'Engineering graduate', quote: 'I feared maths since school. The shortcut toolkit + daily practice made CSAT my highest-scoring paper.', rating: 4 },
    { name: 'Prakash Chandra Sahu', batch: 'OPSC Foundation', role: 'OCS aspirant', quote: 'Odisha-specific modules for OPSC are simply unavailable anywhere else at this quality.', rating: 5 },
    { name: 'Ipsita Dash', batch: 'Foundation 2024 (Online)', role: 'Aspirant from Balasore', quote: 'Doubt clinics at 9 pm were a lifesaver. The AI doubt agent handles my midnight questions till a human takes over.', rating: 5 },
    { name: 'Rahul Beuria', batch: 'Interview Guidance 2024', role: 'Interview appeared', quote: 'Four mock boards, each tougher than the last. The real board felt like the fifth.', rating: 5 },
    { name: 'Bandana Pujari', batch: 'Ethics & Essay Module', role: 'Mains aspirant', quote: 'GS-IV stopped being abstract. The case-study templates gave me a repeatable method under pressure.', rating: 4 },
    { name: 'Tarun Mishra', batch: 'Foundation 2025-A', role: 'College final-year student', quote: 'Weekend mentor calls keep my college and preparation in balance. It is genuinely possible.', rating: 5 },
    { name: 'Ankita Sahoo', batch: 'Prelims Target 2024', role: 'Cleared Prelims 2024', quote: 'The weak-topic analytics after every mock were my private syllabus — I studied exactly what I needed.', rating: 5 },
    { name: 'xxxx', batch: 'MAWP 2024', role: 'Mains qualified 2024', quote: 'Value-addition compendiums saved me months. Data, quotes, committee reports — ready to quote in answers.', rating: 5 },
  ]
  for (const t of testimonials) await db.testimonial.create({ data: t })
  console.log(`Testimonials: ${testimonials.length}`)

  // ─── Books ──────────────────────────────────────────────────────────────────
  const books = [
    { title: 'Indian Polity — Niyatee Notes Edition', author: 'Niyatee Faculty Panel', priceInr: 449, mrpInr: 599, category: 'Polity', description: 'The complete polity revision companion: 60 chapters, 400 PYQ-mapped MCQs and amendment trackers.', rating: 4.8, coverColor: '#0A1B3D', slug: 'indian-polity-niyatee' },
    { title: 'Geography Through Maps', author: 'Niyatee Press Desk', priceInr: 399, mrpInr: 525, category: 'Geography', description: 'The print companion to our famous map module: 80 maps with exam annotations and practice sets.', rating: 4.7, coverColor: '#1A5C3A', slug: 'geography-through-maps' },
    { title: 'Modern Indian History — Timeline Approach', author: 'Niyatee Press Desk', priceInr: 425, mrpInr: 550, category: 'History', description: '1757–1947 in eight phases with personality boxes, PYQ maps and one-page revision sheets.', rating: 4.6, coverColor: '#5C1A1A', slug: 'modern-history-timeline' },
    { title: 'Economy Simplified for UPSC', author: 'Niyatee Faculty Panel', priceInr: 475, mrpInr: 625, category: 'Economy', description: 'Budget, banking, inflation and growth concepts decoded with diagrams and current-linkage boxes.', rating: 4.7, coverColor: '#5C4A1A', slug: 'economy-simplified' },
    { title: 'Ethics, Integrity & Case Studies Workbook', author: 'Dr. Annapurna Sahoo', priceInr: 350, mrpInr: 450, category: 'Ethics', description: '25 solved case studies with frameworks, thinker quotes and presentation templates for GS-IV.', rating: 4.8, coverColor: '#3A1A5C', slug: 'ethics-case-studies-workbook' },
    { title: 'CSAT Manual — Paper II Complete', author: 'Niyatee Quant Team', priceInr: 499, mrpInr: 650, category: 'CSAT', description: 'Every CSAT topic with speed techniques, 1,200 practice questions and 10 solved previous papers.', rating: 4.6, coverColor: '#0A3D3D', slug: 'csat-manual' },
    { title: 'Environment & Ecology — Exam Guide', author: 'Niyatee Faculty Panel', priceInr: 429, mrpInr: 560, category: 'Environment', description: 'Ecology fundamentals to climate conventions, with species tables and scheme annexures.', rating: 4.7, coverColor: '#1A5C3A', slug: 'environment-exam-guide' },
    { title: 'Odisha GK & Current Affairs for OPSC', author: 'Niyatee OPSC Desk', priceInr: 299, mrpInr: 375, category: 'OPSC', description: 'State history, geography, economy and schemes — the Odisha-specific edge for OCS aspirants.', rating: 4.9, coverColor: '#5C1A3A', slug: 'odisha-gk-opsc' },
  ]
  for (const b of books) await db.book.create({ data: b })
  console.log(`Books: ${books.length}`)

  // ─── Test Series ────────────────────────────────────────────────────────────
  const series = [
    { title: 'UPSC Prelims 2026 — GS Test Series (40 Tests)', exam: 'UPSC Prelims', totalTests: 40, freeTests: 2, priceInr: 4999, slug: 'upsc-prelims-2026-gs', description: 'Sectional + full-length GS Paper I tests in the exam interface with AI weak-topic analytics and video discussions.', features: ['22 sectional + 18 full-length tests', 'All-India ranking & percentile', 'AI-powered weak-topic detection', 'Video explanations for every test', 'Detailed discussion PDFs'] },
    { title: 'CSAT Test Series 2026 (20 Tests)', exam: 'CSAT', totalTests: 20, freeTests: 1, priceInr: 2499, slug: 'csat-test-series-2026', description: 'Full-length CSAT mocks with sectional diagnostics — built to take Paper II out of the risk column.', features: ['10 sectional + 10 full-length', 'Speed-strategy video sessions', 'RC & quant topic analytics', 'PYQ-pattern calibration', 'Instant score & solutions'] },
    { title: 'UPSC Mains GS Test Series 2026 (16 Papers)', exam: 'UPSC Mains', totalTests: 16, freeTests: 0, priceInr: 6999, slug: 'upsc-mains-2026-gs', description: 'Four papers × four full-length GS tests with AI evaluation, mentor moderation and model answers.', features: ['GS1–GS4 full-length papers', 'AI evaluation in 24 hours', 'Mentor-moderated scores', 'Model answer copies', 'Copy-correction with comments'] },
    { title: 'OPSC OCS Prelims Test Series (25 Tests)', exam: 'OPSC', totalTests: 25, freeTests: 1, priceInr: 3499, slug: 'opsc-ocs-prelims-series', description: 'Odisha-calibrated Prelims tests covering OCS Paper I & II with state-specific current affairs coverage.', features: ['18 GS + 7 CSAT-style tests', 'Odisha current affairs focus', 'OPSC pattern alignment', 'Bilingual (English/Odia) papers', 'Ranking with state cohort'] },
  ]
  for (const s of series) {
    const { features, ...rest } = s
    await db.testSeries.create({ data: { ...rest, featuresJson: JSON.stringify(features) } })
  }
  console.log(`Test series: ${series.length}`)

  // ─── Plans ──────────────────────────────────────────────────────────────────
  const plans = [
    { name: 'Explorer', priceInr: 0, period: 'month', tagline: 'Try the AI edge — free forever.', features: ['5 AI answer evaluations per month', '10 AI mentor chats per day', 'Daily current affairs access', '20 PYQs with solutions', 'AI MCQ practice (10/day)'], highlight: false, aiCredits: '5 evaluations/month' },
    { name: 'Aspirant', priceInr: 499, period: 'month', tagline: 'The serious aspirant’s daily driver.', features: ['50 AI answer evaluations per month', 'Unlimited AI mentor chat', 'Unlimited AI MCQ practice', 'Interactive geography maps', 'Monthly current affairs PDF', 'Weekly progress analytics'], highlight: true, aiCredits: '50 evaluations/month' },
    { name: 'Achiever', priceInr: 1499, period: 'month', tagline: 'Everything unlimited — plus a human mentor.', features: ['Unlimited AI answer evaluations', 'Unlimited AI mentor chat & MCQs', 'Interactive geography maps', 'Monthly 1:1 mentor check-in', 'All test series at 40% off', 'Priority support within 2 hours'], highlight: false, aiCredits: 'Unlimited' },
  ]
  for (const p of plans) {
    const { features, ...rest } = p
    await db.plan.create({ data: { ...rest, featuresJson: JSON.stringify(features) } })
  }
  console.log(`Plans: ${plans.length}`)

  // ─── FAQs ───────────────────────────────────────────────────────────────────
  const faqs = [
    { question: 'What is the best IAS coaching in Odisha?', answer: 'Niyatee Civil Services Academy, based in Bhubaneswar, is recognised among the best IAS coaching institutes in Odisha. It combines AI-powered preparation tools, structured GS courses, daily answer writing and interview training on one platform — with offline, online-live and self-paced modes so aspirants anywhere in India can access the same quality.', category: 'general' },
    { question: 'How should I prepare for the UPSC Civil Services Examination?', answer: 'The most effective strategy follows four stages: structured learning from quality sources, consistent practice with PYQs and mocks, regular evaluation of answer writing, and personalised mentorship. Niyatee’s framework — Learn, Practice, Evaluate, Succeed — is built exactly around this cycle.', category: 'preparation' },
    { question: 'Where can I find daily current affairs for UPSC?', answer: 'Niyatee provides free daily current affairs sourced from The Hindu, Indian Express and PIB — every article tagged by GS-paper relevance, with monthly PDF compilations available for download on this website.', category: 'current-affairs' },
    { question: 'Which IAS coaching uses AI for UPSC preparation?', answer: 'Niyatee is Odisha’s first IAS academy to integrate AI into UPSC preparation. The platform includes an AI Mains Answer Evaluation engine, an AI Doubt Agent for 24×7 concept clearing, AI-powered MCQ practice and interactive Geography maps — free for enrolled students.', category: 'ai-tools' },
    { question: 'What are the modes of coaching available at Niyatee?', answer: 'Three modes: offline classroom programmes at our Bhubaneswar campus, live online classes with full interactivity, and self-paced recorded programmes. Hybrid learners can mix modes — every programme lists its available formats.', category: 'courses' },
    { question: 'What are the fees, and are EMI options available?', answer: 'Fees vary by programme — from ₹9,999 for interview guidance to ₹1,25,000 for the flagship GS Foundation. Zero-cost EMI plans (3–12 months) are available through partner banks, and merit scholarships up to 100% are offered via the Niyatee Scholarship Test.', category: 'fees' },
    { question: 'Should I prepare for UPSC and OPSC together?', answer: 'Yes — the syllabi overlap nearly 80%. Niyatee’s OPSC Foundation covers the state-specific additions (Odia language, Odisha history/geography/economy) while reusing your UPSC GS base. Many successful candidates prepare for both simultaneously.', category: 'courses' },
    { question: 'How do I choose my optional subject?', answer: 'Choose based on four filters: syllabus overlap with GS, your graduation background, answer-scoring potential of the subject, and availability of quality guidance. Book a free counselling session — our mentors map your profile against all major optionals before you commit.', category: 'preparation' },
    { question: 'Do you provide hostel or accommodation support?', answer: 'Yes. We maintain a verified list of partner hostels and PGs within 2 km of the Bhubaneswar campus, with separate options for women aspirants. Our admissions team assists with shortlisting and visits during counselling.', category: 'campus' },
    { question: 'Can I attend a demo class before enrolling?', answer: 'Absolutely. Book a free demo class — online or at campus — through the contact page or WhatsApp. You will sit in a live session, meet a mentor, and receive a personalised preparation roadmap at no cost.', category: 'general' },
  ]
  for (const f of faqs) await db.faq.create({ data: f })
  console.log(`FAQs: ${faqs.length}`)

  // ─── MCQ questions (Prelims-style) ──────────────────────────────────────────
  const mcqs = [
    { q: 'With reference to the India Semiconductor Mission, consider the following statements: 1. It is implemented by the Ministry of Electronics and Information Technology. 2. The Design Linked Incentive (DLI) scheme supports domestic chip design startups. 3. India currently fabricates 5nm chips at commercial scale. Which of the statements given above are correct?', o: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'], c: 0, e: 'ISM is implemented by MeitY and DLI supports chip design startups. India does not yet fabricate 5nm chips at commercial scale — current projects target 28–90nm nodes.', s: 'Science & Technology', d: 'medium' },
    { q: 'Article 200 of the Constitution of India deals with:', o: ['Assent to bills by the Governor', 'Ordinance-making power of the President', 'Financial emergency', 'Election of the President'], c: 0, e: 'Article 200 deals with a Governor’s options when presented with a bill passed by the state legislature — assent, withhold, return (non-money bills), or reserve for the President.', s: 'Polity', d: 'easy' },
    { q: 'The Ramsar Convention, sometimes seen in the news, is related to:', o: ['Wetlands conservation', 'Migratory species across borders', 'Combatting desertification', 'Transboundary watercourses'], c: 0, e: 'The Ramsar Convention (1971, Ramsar, Iran) provides the framework for national action and international cooperation for the conservation and wise use of wetlands.', s: 'Environment', d: 'easy' },
    { q: 'Consider the following statements about the Monetary Policy Committee (MPC): 1. It is constituted under the Reserve Bank of India Act, 1934. 2. The Governor of RBI has a casting vote in case of a tie. 3. It meets at least four times a year. Which are correct?', o: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'], c: 3, e: 'All three are correct: MPC is constituted under RBI Act 1934 (as amended 2016), the Governor holds the casting vote, and it must meet at least four times annually.', s: 'Economy', d: 'medium' },
    { q: 'The "Chilika lagoon", recently in news for its Ramsar listing, is best described as:', o: ['A brackish water lagoon on the Odisha coast', 'A freshwater oxbow lake in Assam', 'A crater lake in Maharashtra', 'A high-altitude lake in Ladakh'], c: 0, e: 'Chilika is Asia’s largest brackish-water lagoon, on India’s east coast in Odisha, famous for migratory birds and Irrawaddy dolphins.', s: 'Geography', d: 'easy' },
    { q: 'With reference to the Goods and Services Tax (GST) structure after the 2025 rationalisation, consider: 1. Principal slabs are 5% and 18%. 2. A 40% demerit rate applies to specified goods. 3. Health and term insurance are nil-rated. Which are correct?', o: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'], c: 3, e: 'Post GST 2.0, principal slabs are 5% & 18% with 40% for sin/demerit goods; life & health insurance premiums became nil-rated.', s: 'Economy', d: 'hard' },
    { q: 'The Forest Rights Act, 2006 recognises:', o: ['Individual and community rights of forest dwellers', 'Only tribal rights to minor forest produce', 'Rights of forest departments over community land', 'Only rights within tiger reserves'], c: 0, e: 'The FRA recognises individual forest rights and community forest rights (including CFR over community forest resources) of STs and other traditional forest dwellers.', s: 'Polity', d: 'easy' },
    { q: 'The Bharatiya Sakshya Adhiniyam, 2023 replaces which colonial-era law?', o: ['Indian Evidence Act, 1872', 'Code of Criminal Procedure, 1973', 'Indian Penal Code, 1860', 'Indian Contract Act, 1872'], c: 0, e: 'BSA 2023 replaces the Indian Evidence Act 1872; BNS 2023 replaces the IPC; BNSS 2023 replaces CrPC.', s: 'Polity', d: 'easy' },
    { q: 'Regarding the Nipah virus, consider: 1. It is a zoonotic virus. 2. Fruit bats of the Pteropus genus are its natural host. 3. India has an approved indigenous vaccine in the market. Which are correct?', o: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'], c: 0, e: 'Nipah is zoonotic with Pteropus bats as reservoirs. An indigenous vaccine has entered trials but is not yet in the market.', s: 'Science & Technology', d: 'medium' },
    { q: 'Which one of the following best describes the term "transshipment port"?', o: ['A port where cargo is transferred between vessels without entering domestic consumption', 'A port exclusively for oil imports', 'A naval base with commercial berths', 'A riverine port for inland waterways'], c: 0, e: 'Transshipment ports (like Colombo, Singapore, Vizhinjam) hub cargo transferred from mother vessels to feeder vessels for onward destinations.', s: 'Economy', d: 'medium' },
    { q: 'The "Tianjin Declaration" adopted at the recent SCO summit is associated with:', o: ['Shanghai Cooperation Organisation', 'BRICS', 'G20', 'ASEAN'], c: 0, e: 'The Tianjin Declaration was adopted at the SCO Heads of State Summit held in Tianjin, China.', s: 'International Relations', d: 'easy' },
    { q: 'Consider the statements on the 106th Constitutional Amendment: 1. It reserves one-third of seats for women in Lok Sabha and state assemblies. 2. It becomes effective after a delimitation following the next census. 3. It reserves seats within Rajya Sabha. Which are correct?', o: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'], c: 0, e: 'The Nari Shakti Vandan Adhiniyam covers Lok Sabha and state legislative assemblies (not Rajya Sabha) and is linked to post-census delimitation.', s: 'Polity', d: 'medium' },
    { q: 'The Great Indian Bustard is primarily found in:', o: ['Thar Desert, Rajasthan', 'Western Ghats', 'Sundarbans', 'Nilgiri Biosphere'], c: 0, e: 'The GIB’s last viable population is in Rajasthan’s Thar Desert (Desert National Park region), with a small presence in Gujarat.', s: 'Environment', d: 'easy' },
    { q: 'The "Green Hydrogen Mission" targets domestic production capacity of:', o: ['5 MMT per annum by 2030', '1 MMT by 2025', '10 MMT by 2040', '2.5 MMT by 2032'], c: 0, e: 'The National Green Hydrogen Mission targets 5 MMT annual green hydrogen production capacity by 2030 with associated renewable capacity addition.', s: 'Energy', d: 'medium' },
    { q: 'Which of the following are functions of the Election Commission of India? 1. Preparation of electoral rolls 2. Recognition of political parties 3. Adjudicating election petitions 4. Advising the President on disqualifications of MPs', o: ['1, 2 and 4 only', '1, 2 and 3 only', '2, 3 and 4 only', '1, 2, 3 and 4'], c: 0, e: 'ECI prepares rolls, recognises parties/allots symbols, advises on disqualifications. Election petitions are adjudicated by High Courts, not the ECI.', s: 'Polity', d: 'hard' },
    { q: 'The term "CBAM" in trade negotiations refers to:', o: ['Carbon Border Adjustment Mechanism', 'Cross-Border Arbitration Mechanism', 'Comprehensive Bilateral Agreement Model', 'Customs Bonded Area Management'], c: 0, e: 'CBAM is the EU’s Carbon Border Adjustment Mechanism, pricing embedded carbon of imports like steel, aluminium and cement.', s: 'Economy', d: 'medium' },
    { q: 'NISAR, recently launched, is a joint mission of:', o: ['NASA and ISRO', 'ESA and ISRO', 'CNES and ISRO', 'JAXA and ISRO'], c: 0, e: 'NISAR (NASA-ISRO Synthetic Aperture Radar) is a dual-band (L & S) radar imaging satellite jointly developed by NASA and ISRO.', s: 'Science & Technology', d: 'easy' },
    { q: 'Khongjom Day, commemorated in April, is associated with the Anglo-Manipur War of:', o: ['1891', '1857', '1817', '1919'], c: 0, e: 'Khongjom Day (April 23) commemorates the Battle of Khongjom (1891), the last major stand in the Anglo-Manipur War.', s: 'History', d: 'hard' },
    { q: 'Which Article empowers the President to promulgate ordinances when Parliament is not in session?', o: ['Article 123', 'Article 213', 'Article 356', 'Article 352'], c: 0, e: 'Article 123 empowers the President to promulgate ordinances during the recess of Parliament; Article 213 is the state analogue.', s: 'Polity', d: 'easy' },
    { q: 'The "Digital Arrest" scam, in news, primarily involves:', o: ['Impersonation of law enforcement via video calls', 'Hacking of UPI PINs', 'SIM-swap fraud', 'Phishing emails with malware'], c: 0, e: 'Digital arrest scams impersonate police/officials over video calls, falsely claiming the victim is under virtual arrest to extort money.', s: 'Internal Security', d: 'easy' },
    { q: 'Consider the following pairs (initiative — sector): 1. PM Vishwakarma — artisans 2. PM MITRA — textile parks 3. Shree Anna — millets. How many pairs are correctly matched?', o: ['All three', 'Only two', 'Only one', 'None'], c: 0, e: 'All three are correctly matched: PM Vishwakarma supports 18 artisan trades, PM MITRA builds textile parks, Shree Anna is the millets mission brand.', s: 'Economy', d: 'easy' },
    { q: 'The Kalinga War (c. 261 BCE) was fought during the reign of:', o: ['Ashoka', 'Bindusara', 'Chandragupta Maurya', 'Samudragupta'], c: 0, e: 'The Kalinga War was fought by Ashoka in his 8th regnal year; its aftermath is recorded in Rock Edict XIII.', s: 'History', d: 'easy' },
    { q: 'Regarding India’s Antarctic programme, which is India’s newest active research station?', o: ['Bharati', 'Maitri', 'Dakshin Gangotri', 'Himadri'], c: 0, e: 'Bharati (2012) is the newest active Indian station; Dakshin Gangotri is buried/decommissioned, and Himadri is the planned replacement for Maitri.', s: 'Geography', d: 'hard' },
    { q: 'The "Learn, Practice, Evaluate, Succeed" framework is associated with:', o: ['Niyatee Civil Services Academy', 'NCERT', 'NITI Aayog', 'UPSC'], c: 0, e: 'This is Niyatee Civil Services Academy’s four-step preparation framework for UPSC aspirants.', s: 'Current Affairs', d: 'easy' },
    { q: 'Which of the following best describes the "Account Aggregator" framework?', o: ['Consent-based financial data sharing architecture', 'Government savings scheme', 'Credit guarantee mechanism for MSMEs', 'Insurance penetration programme'], c: 0, e: 'The AA framework enables consent-based sharing of financial data between institutions, revolutionising credit underwriting.', s: 'Economy', d: 'medium' },
    { q: 'The Palk Strait separates India from:', o: ['Sri Lanka', 'Maldives', 'Myanmar', 'Indonesia'], c: 0, e: 'The Palk Strait lies between Tamil Nadu (India) and northern Sri Lanka.', s: 'Geography', d: 'easy' },
    { q: 'Under the DPDP Act, 2023, the maximum penalty for certain breaches can go up to:', o: ['₹250 crore per instance', '₹100 crore per instance', '₹500 crore per instance', '₹50 crore per instance'], c: 0, e: 'The DPDP Act prescribes penalties up to ₹250 crore per instance for specified breaches such as failure of security safeguards.', s: 'Polity', d: 'hard' },
    { q: 'Ayushman Bharat’s PM-JAY provides health cover of:', o: ['₹5 lakh per family per year', '₹2 lakh per family per year', '₹10 lakh per family per year', '₹1 lakh per individual per year'], c: 0, e: 'PM-JAY offers ₹5 lakh per family per year for secondary and tertiary hospitalisation.', s: 'Polity', d: 'easy' },
    { q: 'The "SPADEX" experiment of ISRO demonstrated:', o: ['Autonomous satellite docking', 'Reusable launch vehicle landing', 'Electric propulsion in orbit', 'Lunar polar landing'], c: 0, e: 'SPADEX (Space Docking Experiment) demonstrated in-orbit autonomous docking and undocking of two satellites.', s: 'Science & Technology', d: 'medium' },
    { q: 'Which section-level measure best describes "GVA" in national accounts?', o: ['Value of output minus intermediate consumption', 'Total government revenue', 'Gross capital formation', 'Net exports'], c: 0, e: 'Gross Value Added = output – intermediate consumption; it measures sectoral production contribution, the base on which GDP is computed.', s: 'Economy', d: 'medium' },
    { q: 'The Kangra school of painting flourished in:', o: ['18th–19th century Himachal region', 'Mughal Delhi', 'Vijayanagara', 'Maratha Thanjavur'], c: 0, e: 'Kangra painting, a Pahari school, flourished in the hill states of Himachal Pradesh in the 18th–19th centuries.', s: 'History', d: 'medium' },
    { q: 'Consider statements on NavIC: 1. It is India’s regional satellite navigation system. 2. Its service area covers India and up to 1,500 km beyond. 3. It operates only in the L5 band. Which are correct?', o: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'], c: 0, e: 'NavIC is India’s regional GNSS with a 1,500 km service footprint; it broadcasts on L5 and S bands (with L1 added in NVS satellites).', s: 'Science & Technology', d: 'medium' },
    { q: 'The "Economically Weaker Sections" reservation was introduced by which Amendment?', o: ['103rd', '101st', '102nd', '104th'], c: 0, e: 'The 103rd Constitutional Amendment Act, 2019 introduced 10% EWS reservation via Articles 15(6) and 16(6).', s: 'Polity', d: 'easy' },
    { q: 'The "Paradip port" is located in which state?', o: ['Odisha', 'Andhra Pradesh', 'West Bengal', 'Tamil Nadu'], c: 0, e: 'Paradip is a major port on the Odisha coast; its petrochemical complex anchors the state’s downstream industry.', s: 'Geography', d: 'easy' },
    { q: 'The Ninth Schedule of the Constitution was added by:', o: ['First Amendment', '24th Amendment', '42nd Amendment', '44th Amendment'], c: 0, e: 'The First Amendment (1951) added the Ninth Schedule to protect land-reform laws from judicial review.', s: 'Polity', d: 'hard' },
    { q: 'Which of the following is the correct expansion of "NCQG" in climate negotiations?', o: ['New Collective Quantified Goal', 'National Climate Quality Grid', 'Net Carbon Quota Guideline', 'New Clean Energy Quantified Grant'], c: 0, e: 'NCQG is the New Collective Quantified Goal on climate finance, to be set beyond the $100 billion pledge.', s: 'Environment', d: 'medium' },
    { q: 'The term "yield curve inversion" generally signals:', o: ['Possible recession expectations', 'Currency appreciation', 'Fiscal surplus', 'Inflation acceleration'], c: 0, e: 'An inverted yield curve (short rates above long rates) is historically a leading indicator of recession expectations.', s: 'Economy', d: 'medium' },
    { q: 'Ajanta caves primarily contain paintings from which periods?', o: ['2nd century BCE and 5th century CE', '10th–12th century CE', 'Mauryan period', 'Gupta period only'], c: 0, e: 'Ajanta’s murals belong to two phases: Satavahana (2nd century BCE) and Vakataka (5th century CE).', s: 'History', d: 'easy' },
    { q: 'The "Mission Karmayogi" initiative is related to:', o: ['Capacity building of civil servants', 'Employment guarantee', 'Skill certification of youth', 'Apprenticeship in PSUs'], c: 0, e: 'Mission Karmayogi is the national programme for civil services capacity building (iGOT digital platform).', s: 'Governance', d: 'easy' },
    { q: 'Community seed banks are primarily aimed at:', o: ['Conservation of indigenous seed varieties', 'Export promotion of GM seeds', 'Corporate patent registration', 'Chemical fertiliser distribution'], c: 0, e: 'Community seed banks conserve indigenous/traditional varieties, supporting agrobiodiversity and farmer seed sovereignty.', s: 'Agriculture', d: 'medium' },
    { q: 'The Sarada script, seen in the context of medieval northwestern inscriptions, was used in:', o: ['Northwestern India', 'Tamil region', 'Bengal delta', 'Deccan plateau'], c: 0, e: 'Sarada script developed in northwestern India (Kashmir-Himachal region), evolving from Brahmi.', s: 'History', d: 'hard' },
    { q: 'Which body publishes the "Periodic Labour Force Survey" in India?', o: ['National Statistical Office', 'NITI Aayog', 'Ministry of Labour only', 'RBI'], c: 0, e: 'PLFS is conducted by the National Statistical Office (MoSPI).', s: 'Economy', d: 'easy' },
  ]
  for (const m of mcqs) {
    await db.mcqQuestion.create({
      data: {
        question: m.q, optionsJson: JSON.stringify(m.o), correctIndex: m.c,
        explanation: m.e, subject: m.s, difficulty: m.d,
        hash: Buffer.from(m.q).toString('base64').slice(0, 60),
      },
    })
  }
  console.log(`MCQs: ${mcqs.length}`)

  console.log('Seed complete ✅')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
