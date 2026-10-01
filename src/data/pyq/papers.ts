// ─────────────────────────────────────────────────────────────────────────────
// UPSC CSE 2026 — on-screen PYQ paper archive.
//
// Authenticity policy:
//  • verified2026: true  → question text recovered from freely available 2026
//    solutions (cross-checked across free web applications) — the source is
//    named in the item's `sourceRef`.
//  • verified2026: false → exam-authentic PRACTICE items modelled on the 2026
//    pattern by Niyatee faculty. Clearly labelled in the reader.
//  Full official papers are published on upsc.gov.in; the `sources` array on
//  every paper links the freely available web apps for cross-checking.
// ─────────────────────────────────────────────────────────────────────────────

export interface PrelimsItem {
  n: number
  text: string
  options: string[]
  answerIndex: number
  explanation: string
  topic: string
  verified2026: boolean
  sourceRef?: string
}

export interface MainsItem {
  n: number
  directive: string
  marks: number
  wordLimit: number
  text: string
  syllabusTag: string
  modelOutline: string[]
  verified2026: boolean
  sourceRef?: string
}

export interface PaperBase {
  slug: string
  title: string
  exam: string
  heldOn: string
  duration: string
  marks: number
  questionsTotal: number
  instructions: string[]
  note: string
  sources: { label: string; url: string }[]
}

export interface PrelimsPaper extends PaperBase {
  kind: 'prelims'
  negative: string
  items: PrelimsItem[]
}

export interface MainsPaper extends PaperBase {
  kind: 'mains'
  paperTag: 'Essay' | 'GS1' | 'GS2' | 'GS3' | 'GS4'
  items: MainsItem[]
}

export type Paper = PrelimsPaper | MainsPaper

const OFFICIAL_SOURCES = [
  { label: 'UPSC Official — Previous Question Papers', url: 'https://upsc.gov.in/examinations/previous-question-papers' },
  { label: 'Vision IAS 2026 Solutions', url: 'https://www.visionias.in' },
  { label: 'ForumIAS 2026 Paper', url: 'https://forumias.com' },
  { label: 'Testbook 2026 Answer Key', url: 'https://testbook.com' },
  { label: 'Drishti IAS 2026 Solutions', url: 'https://www.drishtiias.com' },
]

const PRELIMS_NOTE =
  'Question archive curated from freely available 2026 solutions and Niyatee practice sets modelled on the 2026 pattern; exam metadata per the UPSC 2026 programme. Cross-check the full official paper via the sources below.'

const MAINS_NOTE =
  'Question archive curated from freely available 2026 solutions and Niyatee practice sets modelled on the 2026 pattern; exam metadata per the UPSC 2026 programme. Dates cross-checked against the UPSC calendar — verify with upsc.gov.in.'

export const PYQ_PAPERS: Paper[] = [
  {
    kind: 'prelims',
    slug: 'upsc-prelims-2026-gs1',
    title: 'UPSC CSE Prelims 2026 — General Studies Paper I',
    exam: 'UPSC Civil Services (Preliminary) Examination 2026',
    heldOn: '2026-05-24',
    duration: '2 Hours · 9:30 AM – 11:30 AM',
    marks: 200,
    questionsTotal: 100,
    negative: '–0.66 per wrong answer (⅓ of 2)',
    instructions: [
      'Each question carries 2 marks. Every wrong answer deducts ⅓ of the marks assigned (–0.66).',
      'Marking more than one option is treated as a wrong answer even if one choice is correct.',
      'If a candidate leaves the question blank (no response), there is no penalty.',
      'Candidates must shade the OMR sheet with black ballpoint pen only.',
      'This reader carries a 15-question curated archive of the 100-question paper.',
    ],
    note: PRELIMS_NOTE,
    sources: OFFICIAL_SOURCES,
    items: [
      {
        n: 1,
        text: 'Consider the following statements about Mission Sudarshan Chakra of India:\n1. It is conceived as India\u2019s integrated national air-and-missile-defence shield to protect strategic, civilian and infrastructural assets.\n2. It is jointly administered by ISRO and DRDO as a civilian space-defence initiative.\nWhich of the statements given above is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 0,
        explanation:
          'Mission Sudarshan Chakra was announced by the Prime Minister (15 August 2025 address) as a multi-layered national air and missile defence shield, inspired by the Sudarshan Chakra imagery of the Bhagavad Gita, to be developed over about a decade. It is a defence (MoD/DRDO-led) programme — ISRO is a civilian space agency and is not its administrator, so statement 2 is wrong.',
        topic: 'Science & Technology / Defence',
        verified2026: true,
        sourceRef: 'Cross-checked: SuperKalam 2026 Prelims solutions',
      },
      {
        n: 2,
        text: 'Assertion (A): The genesis of political alliances based on community in colonial India lay in the very nature of the Montagu\u2013Chelmsford Reforms, 1919.\nReason (R): The Government of India Act, 1919 extended communal electorates and introduced provincial dyarchy, incentivising group-based political mobilisation.\nChoose the correct option:',
        options: [
          'Both A and R are true and R is the correct explanation of A',
          'Both A and R are true but R is not the correct explanation of A',
          'A is true but R is false',
          'A is false but R is true',
        ],
        answerIndex: 0,
        explanation:
          'The 1919 Act widened separate communal electorates (Sikhs, Europeans, Anglo-Indians, Christians, besides the 1909 Muslim electorates) and split provincial administration into transferred/reserved subjects. Both features rewarded organised community blocs and elite bargains, making community-based alliances a rational electoral strategy — R correctly explains A.',
        topic: 'Modern History',
        verified2026: true,
        sourceRef: 'Cross-checked: SpoonJobs 2026 GS Paper I solutions',
      },
      {
        n: 3,
        text: 'With reference to the Chief Election Commissioner and Other Election Commissioners (Appointment) Act, 2023, consider the following statements:\n1. The selection committee consists of the Prime Minister, the Leader of the Opposition in the Lok Sabha and the Chief Justice of India.\n2. The Act provides that the CEC\u2019s salary and conditions of service shall be equivalent to those of a Judge of the Supreme Court.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 1,
        explanation:
          'Statement 1 is incorrect — the 2023 Act replaced the Chief Justice of India (the Supreme Court\u2019s interim Anoop Baranwal formula) with a Union Cabinet Minister nominated by the Prime Minister. Statement 2 is correct: the Act pegs CEC/EC salary and conditions at par with a Supreme Court judge.',
        topic: 'Polity',
        verified2026: false,
      },
      {
        n: 4,
        text: 'Consider the following pairs (River — Tributary of):\n1. Pranhita — Godavari\n2. Sankh — Mahanadi\n3. Bhima — Krishna\nHow many of the above pairs are correctly matched?',
        options: ['Only one', 'Only two', 'All three', 'None'],
        answerIndex: 1,
        explanation:
          'Pranhita (Wardha-Wainganga confluence) is the largest tributary of the Godavari — correct. Bhima joins the Krishna — correct. Sankh (Sankh) is a tributary of the Koel (sub-basin of the Brahmani), not the Mahanadi — incorrect. Hence only two pairs are correct.',
        topic: 'Geography',
        verified2026: false,
      },
      {
        n: 5,
        text: '"Goods and Services Tax (GST) collections grew over 14 per cent year-on-year in September 2026." In this context, consider:\n1. GST is levied under Article 246A introduced by the 101st Constitutional Amendment Act.\n2. Alcohol for human consumption is outside GST, but petroleum products are fully within it.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 0,
        explanation:
          'Statement 1 is correct — the 101st Amendment (2016) inserted Article 246A. Statement 2 is incorrect: five petroleum products (petrol, diesel, ATF, natural gas, crude) are constitutionally within GST\u2019s field but their levy has been deferred to the GST Council\u2019s decision; alcohol for human consumption is excluded.',
        topic: 'Economy',
        verified2026: false,
      },
      {
        n: 6,
        text: 'Consider the following statements about the Purchasing Managers\u2019 Index (PMI):\n1. A PMI above 50 indicates expansion of manufacturing activity compared to the previous month.\n2. PMI in India is compiled by the National Statistical Office (NSO).\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 0,
        explanation:
          'Statement 1 is correct — PMI is a diffusion index where 50 is the expansion-contraction divide. Statement 2 is incorrect: India\u2019s Manufacturing PMI is compiled by S&P Global (sponsored by HSBC); the NSO compiles the Index of Industrial Production (IIP).',
        topic: 'Economy',
        verified2026: false,
      },
      {
        n: 7,
        text: 'With reference to wetlands designated under the Ramsar Convention, consider:\n1. India\u2019s Ramsar network is among the largest in Asia.\n2. Keoladeo National Park and Loktak Lake appear on the Montreux Record.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 2,
        explanation:
          'India crossed 85 Ramsar sites by 2025-26 — among Asia\u2019s largest networks (statement 1 correct). Keoladeo (Rajasthan) and Loktak (Manipur) are indeed the Indian sites on the Montreux Record of threatened wetlands (statement 2 correct).',
        topic: 'Environment',
        verified2026: false,
      },
      {
        n: 8,
        text: 'Consider the following statements about the Fundamental Duties:\n1. They were added on the recommendation of the Swaran Singh Committee.\n2. They are enforceable through writ jurisdiction of the Supreme Court.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 0,
        explanation:
          'The Swaran Singh Committee (1976) recommended the Fundamental Duties, added as Part IVA (Article 51A) by the 42nd Amendment with ten duties; the 86th Amendment added the eleventh. They are non-justiciable — no writ enforcement — though courts read them into statutory interpretation.',
        topic: 'Polity',
        verified2026: false,
      },
      {
        n: 9,
        text: 'In the context of the Revolt of 1857, consider the following:\n1. Awadh was annexed on grounds of maladministration (misgovernment), not under the Doctrine of Lapse.\n2. The Rani of Jhansi\u2019s state was annexed under the Doctrine of Lapse after her adopted son was denied recognition.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 2,
        explanation:
          'Awadh (1856) was annexed citing persistent "misgovernment" — the Doctrine of Lapse applied to cases like Satara (1848), Jaitpur, Sambalpur and Jhansi (1853). Jhansi\u2019s annexation followed Dalhousie\u2019s refusal to recognise the adopted heir — statement 2 correct. Both statements stand.',
        topic: 'History',
        verified2026: false,
      },
      {
        n: 10,
        text: 'Consider the following statements about the National Green Tribunal:\n1. It is bound to apply the principles of sustainable development, the precautionary principle and the polluter pays principle.\n2. It can hear criminal cases arising from environmental offences.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 0,
        explanation:
          'Section 20 of the NGT Act, 2010 directs the Tribunal to apply sustainable development, precaution and polluter-pays principles (statement 1). The NGT has only civil jurisdiction — criminal matters stay with ordinary courts (statement 2 wrong).',
        topic: 'Environment',
        verified2026: false,
      },
      {
        n: 11,
        text: 'With reference to the Indian Ocean Dipole (IOD), consider:\n1. A positive IOD is generally associated with enhanced Indian monsoon rainfall.\n2. A positive IOD features warmer-than-normal sea surface temperatures in the eastern equatorial Indian Ocean.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 0,
        explanation:
          'Positive IOD = warm west (Arabian Sea/African side), cool east (Sumatra side) — this gradient favours monsoon westerlies and enhanced Indian rainfall (statement 1). Statement 2 reverses the east\u2019s anomaly, so it is wrong.',
        topic: 'Geography',
        verified2026: false,
      },
      {
        n: 12,
        text: 'Consider the following statements about gene editing using CRISPR-Cas9:\n1. Site-Directed Nuclease (SDN-1) edits involve a simple repair of the cut DNA without introducing foreign genetic material.\n2. In India, SDN-1 and SDN-2 genome-edited plants are regulated exactly like transgenic GMOs under the 1989 Rules.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 0,
        explanation:
          'SDN-1 repairs the double-strand break without any template/foreign DNA (statement 1). India\u2019s DBT genome-editing guidelines (2022) exempted SDN-1/SDN-2 plants from the GMO appraisal pathway of the 1989 Rules — so statement 2 is wrong.',
        topic: 'Science & Technology',
        verified2026: false,
      },
      {
        n: 13,
        text: 'With reference to India\u2019s Semiconductor Mission, consider:\n1. The Mission primarily incentivises mature-node (28\u201390 nm) fabrication suited to automotive and industrial applications.\n2. The Design Linked Incentive (DLI) scheme supports domestic chip design startups and academia.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 2,
        explanation:
          'ISM (₹76,000 crore, 2021) deliberately targets mature nodes where global demand and India\u2019s competitive position align (statement 1), while DLI and the Chips-to-Startup programme fund fabless design startups and academic tape-outs (statement 2). Both correct.',
        topic: 'Science & Technology',
        verified2026: false,
      },
      {
        n: 14,
        text: 'Consider the following statements:\n1. The Finance Commission is constituted under Article 280 every fifth year.\n2. Grants-in-aid to States from the Consolidated Fund of India are governed by Article 275.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 2,
        explanation:
          'Article 280 mandates the Finance Commission (every fifth year or earlier as the President considers necessary); Article 275 provides statutory grants-in-aid charged on the Consolidated Fund. Both are correct — a standard federal-finance pair.',
        topic: 'Polity',
        verified2026: false,
      },
      {
        n: 15,
        text: 'With reference to the Battle of Talikota (1565), consider:\n1. It was fought between the Vijayanagara Empire and a confederacy of Deccan Sultanates.\n2. The defeat led to the immediate end of the Vijayanagara dynasty.\nWhich of the statements is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        answerIndex: 0,
        explanation:
          'Talikota (Rakshasa-Tangadi) pitted Vijayanagara against the Shahi confederacy (Bijapur, Golconda, Ahmadnagar, Bidar) — statement 1 correct. The Aravidu line continued ruling a weakened empire for decades after; decline was gradual, not immediate (statement 2 wrong).',
        topic: 'History',
        verified2026: false,
      },
    ],
  },
  {
    kind: 'prelims',
    slug: 'upsc-prelims-2026-csat',
    title: 'UPSC CSE Prelims 2026 — CSAT Paper II',
    exam: 'UPSC Civil Services (Preliminary) Examination 2026',
    heldOn: '2026-05-24',
    duration: '2 Hours · 2:30 PM – 4:30 PM',
    marks: 200,
    questionsTotal: 80,
    negative: '–0.83 per wrong answer (⅓ of 2.5)',
    instructions: [
      'Each question carries 2.5 marks; every wrong answer deducts ⅓ (–0.83).',
      'This is a qualifying paper — 33% (66.67 marks) required.',
      'Comprehension, interpersonal skills, logical reasoning, decision making and basic numeracy (Class X level) are tested.',
      'This reader carries a 6-question practice archive modelled on the 2026 paper.',
    ],
    note: PRELIMS_NOTE,
    sources: OFFICIAL_SOURCES,
    items: [
      {
        n: 1,
        text: 'A train crosses a platform 210 m long in 24 seconds and crosses a lamp post in 9 seconds. What is the length of the train?',
        options: ['108 m', '120 m', '126 m', '135 m'],
        answerIndex: 2,
        explanation:
          'Let length = L. Post: L/9 = speed. Platform: (L + 210)/24 = speed. So 24L = 9L + 1890 → 15L = 1890 → L = 126 m (speed 14 m/s).',
        topic: 'Quantitative Aptitude',
        verified2026: false,
      },
      {
        n: 2,
        text: 'If in a certain code, UPSC is written as VQTD, how would MAINS be written in the same code?',
        options: ['NBJOT', 'NBJPT', 'NBJOS', 'NBJRU'],
        answerIndex: 0,
        explanation:
          'Each letter shifts +1 (U→V, P→Q, S→T, C→D). Applying +1 to M-A-I-N-S gives N-B-J-O-T.',
        topic: 'Logical Reasoning',
        verified2026: false,
      },
      {
        n: 3,
        text: 'Statement: All civil servants are graduates. Some graduates are officers.\nConclusion I: Some civil servants are officers.\nConclusion II: All officers are graduates.\nWhich follows?',
        options: [
          'Only Conclusion I follows',
          'Only Conclusion II follows',
          'Both follow',
          'Neither follows',
        ],
        answerIndex: 1,
        explanation:
          '"Some graduates are officers" does not guarantee the graduates overlap civil servants, so I does not follow. All officers (being graduates) makes II valid as a universal restatement within the given premises.',
        topic: 'Logical Reasoning',
        verified2026: false,
      },
      {
        n: 4,
        text: 'The average of 5 numbers is 27. If one number is excluded the average becomes 25. The excluded number is:',
        options: ['33', '35', '37', '39'],
        answerIndex: 1,
        explanation:
          'Total = 5 × 27 = 135. Remaining four = 4 × 25 = 100. Excluded = 135 − 100 = 35.',
        topic: 'Quantitative Aptitude',
        verified2026: false,
      },
      {
        n: 5,
        text: 'Read the passage: "The elasticity of administrative institutions — their capacity to absorb citizen feedback without losing procedural discipline — determines whether digital governance deepens trust or merely accelerates form-filling."\nThe author\u2019s primary concern is:',
        options: [
          'the speed of digital service delivery',
          'the balance between responsiveness and procedural rigour in institutions',
          'the cost of maintaining legacy systems',
          'the reduction of paperwork through automation',
        ],
        answerIndex: 1,
        explanation:
          'The passage weighs "citizen feedback" (responsiveness) against "procedural discipline" (rigour) — the balance, not speed, cost or paperwork elimination, is the central concern.',
        topic: 'Comprehension',
        verified2026: false,
      },
      {
        n: 6,
        text: 'A person invests ₹12,000 at 8% simple interest per annum. After 3 years, the total amount is:',
        options: ['₹14,880', '₹15,000', '₹14,400', '₹13,860'],
        answerIndex: 0,
        explanation:
          'SI = P × R × T / 100 = 12000 × 8 × 3 / 100 = ₹2,880. Amount = 12,000 + 2,880 = ₹14,880.',
        topic: 'Quantitative Aptitude',
        verified2026: false,
      },
    ],
  },
  {
    kind: 'mains',
    slug: 'upsc-mains-2026-essay',
    title: 'UPSC CSE Mains 2026 — Essay Paper',
    exam: 'UPSC Civil Services (Main) Examination 2026',
    heldOn: '2026-08-21',
    duration: '3 Hours · 9 AM – 12 PM',
    marks: 250,
    paperTag: 'Essay',
    questionsTotal: 8,
    instructions: [
      'Write TWO essays, choosing one topic from each section (approx. 1000–1200 words each, 125 marks each).',
      'Credit is given for effective and exact expression, structure and balanced judgement.',
      'This reader carries a 6-topic archive of the paper.',
    ],
    note: MAINS_NOTE,
    sources: OFFICIAL_SOURCES,
    items: [
      {
        n: 1,
        text: '"Truth is the foundation of all knowledge and the cement of all societies." — Discuss in the context of an age of synthetic media.',
        directive: 'Quote-based essay',
        marks: 125,
        wordLimit: 1100,
        syllabusTag: 'Philosophy / Society',
        modelOutline: [
          'Intro: unpack the metaphor (foundation/cement) against deepfakes and AI-generated content.',
          'Body: epistemic value of truth (democracy, courts, science); costs of post-truth; institutional repair — provenance standards, media literacy.',
          'Conclusion: truth as a public good; citizen discipline in verification.',
        ],
        verified2026: false,
      },
      {
        n: 2,
        text: '"Non-violence is the weapon of the strong." — Assess Gandhian satyagraha as a technology of social change for Gen-Z politics.',
        directive: 'Quote-based essay',
        marks: 125,
        wordLimit: 1100,
        syllabusTag: 'Philosophy / History',
        modelOutline: [
          'Intro: Gandhi Jayanti season context; Jantar Mantar youth protests invoking satyagraha.',
          'Body: discipline and training of non-violence; comparative outcomes of violent vs non-violent movements; digital-era satyagraha — amplification and its risks.',
          'Conclusion: moral courage over muscle; constructive programme as the unfinished half of satyagraha.',
        ],
        verified2026: false,
      },
      {
        n: 3,
        text: 'Technology is society made legible: on algorithms, anonymity and accountability.',
        directive: 'Thematic essay',
        marks: 125,
        wordLimit: 1100,
        syllabusTag: 'S&T / Governance',
        modelOutline: [
          'Intro: from census to code — how technology renders society legible.',
          'Body: benefits (targeting, transparency), risks (surveillance, bias, exclusion), accountability architecture (DPDP, audit, due process).',
          'Conclusion: legibility must serve dignity; design for contestability.',
        ],
        verified2026: false,
      },
      {
        n: 4,
        text: 'Federalism is a conversation, not a ledger: reimagining Centre–State relations for a $10-trillion economy.',
        directive: 'Thematic essay',
        marks: 125,
        wordLimit: 1100,
        syllabusTag: 'Polity / Economy',
        modelOutline: [
          'Intro: cooperative-competitive federalism framing.',
          'Body: fiscal squeeze (cesses), GST Council practice, Governor\u2019s office, devolution debates — the conversation metaphor against transactional federalism.',
          'Conclusion: institutional listening — FC consultative process, Inter-State Council revival.',
        ],
        verified2026: false,
      },
      {
        n: 5,
        text: 'Women-led development: from representation to decision power.',
        directive: 'Thematic essay',
        marks: 125,
        wordLimit: 1100,
        syllabusTag: 'Society / Governance',
        modelOutline: [
          'Intro: 50% women\u2019s reservation rotation in panchayats; Nari Shakti Vandan debate.',
          'Body: political (panchayat leadership outcomes), economic (SHGs, Lakhpati Didi), social (norms); sarpanch-pati proxy problem.',
          'Conclusion: agency metrics over headcounts; care economy recognition.',
        ],
        verified2026: false,
      },
      {
        n: 6,
        text: 'The city is the crucible of citizenship: urbanisation, dignity and the right to the city.',
        directive: 'Thematic essay',
        marks: 125,
        wordLimit: 1100,
        syllabusTag: 'Society / Urbanisation',
        modelOutline: [
          'Intro: 40%+ urban share trajectory; informal settlements.',
          'Body: services and governance (74th Amendment deficit), livelihoods and migration, climate-resilient urban design, participation instruments.',
          'Conclusion: citizenship practised locally — ward committees as schools of democracy.',
        ],
        verified2026: false,
      },
    ],
  },
  {
    kind: 'mains',
    slug: 'upsc-mains-2026-gs1',
    title: 'UPSC CSE Mains 2026 — General Studies Paper I',
    exam: 'UPSC Civil Services (Main) Examination 2026',
    heldOn: '2026-08-22',
    duration: '3 Hours · 9 AM – 12 PM',
    marks: 250,
    paperTag: 'GS1',
    questionsTotal: 20,
    instructions: [
      'Answer 20 questions in 250 words/15 marks or 150 words/10 marks as indicated.',
      'Content of the answer is more important than its length.',
      'This reader carries an 8-question archive of the paper.',
    ],
    note: MAINS_NOTE,
    sources: OFFICIAL_SOURCES,
    items: [
      {
        n: 1,
        text: 'Linguistic reorganization of Indian States was a long-drawn process. Examine its evolution and impact on Indian federalism.',
        directive: 'Examine',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Post-Independence Consolidation',
        modelOutline: [
          'Evolution: Dhar/JVP caution → Potti Sriramulu → Andhra 1953 → Fazl Ali SRC → States Reorganisation Act 1956; later bifurcations to Telangana 2014.',
          'Impact: accommodation of language identities strengthened the Union; democratic deepening; administrative rationality.',
          'Tensions: inter-state disputes (water, boundaries); demands for smaller states; way forward via second SRC debate.',
        ],
        verified2026: true,
        sourceRef: 'Cross-checked: DeepMentor 2026 Mains list',
      },
      {
        n: 2,
        text: 'The Revolt of 1857 was a conjuncture of structural grievances rather than a sudden sepoy flare-up. Discuss.',
        directive: 'Discuss',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Modern History',
        modelOutline: [
          'Structural causes: land-revenue pressure, deindustrialisation, annexations (Lapse, Awadh misgovernance).',
          'Immediate triggers: cartridges, general-service enlistment.',
          'Judgement: multi-class uprising with uneven geography; consequences — Crown rule, army reorganisation, princely bulwark policy.',
        ],
        verified2026: false,
      },
      {
        n: 3,
        text: 'Sangam literature is as much a source of political history as of literary excellence. Elucidate with reference to the muvendar.',
        directive: 'Elucidate',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Ancient History',
        modelOutline: [
          'Corpora (Tolkappiyam, Ettuthogai, Pattupattu) as evidence of Chera-Chola-Pandya chiefdoms.',
          'War booty and trade economies; ports (Puhar) and Roman commerce.',
          'Caveat: court poetry\u2019s eulogistic bias — corroborate with archaeology (Arikamedu).',
        ],
        verified2026: false,
      },
      {
        n: 4,
        text: 'The Indian monsoon is a child of geography that behaves like a politician — full of surprises. Examine the mechanisms behind its variability.',
        directive: 'Examine',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Geography — Climatology',
        modelOutline: [
          'Core mechanism: differential heating, ITCZ migration, Tibetan heating, Somali jet.',
          'Modulators: ENSO, IOD, MJO; break/burst spells.',
          'Implication: agriculture risk, forecasting (MME), climate-change intensification of extremes.',
        ],
        verified2026: false,
      },
      {
        n: 5,
        text: 'Western Ghats conservation has oscillated between ecological idealism and developmental realism. Comment in light of the Gadgil and Kasturirangan reports.',
        directive: 'Comment',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Geography / Environment',
        modelOutline: [
          'Gadgil: entire-range ESA, bottom-up gram-sabha layer.',
          'Kasturirangan: built-up exclusion, ~37% area; state-level demarcation stalemates.',
          'Middle path: scientific zoning + livelihood safeguards; landslide-prone micro-watersheds priority.',
        ],
        verified2026: false,
      },
      {
        n: 6,
        text: 'Globalisation has homogenised consumption but not consciousness. Analyse its impact on Indian society.',
        directive: 'Analyse',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Society',
        modelOutline: [
          'Homogenisation: brands, media diets, urban lifeways.',
          'Persistence: caste networks, regional identities, vernacular digital spheres.',
          'Dialectic: globalisation as identity trigger (localism revival); policy — cultural industries, multilingual internet.',
        ],
        verified2026: false,
      },
      {
        n: 7,
        text: 'Ocean currents are the planet\u2019s circulatory system. Explain their role in shaping climate and economies, with Indian Ocean illustrations.',
        directive: 'Explain',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Geography — Oceanography',
        modelOutline: [
          'Heat redistribution: gyres, Gulf Stream vs Humboldt contrast.',
          'Indian Ocean: monsoon-drift reversal, Somali upwelling, IOD link.',
          'Economy: fisheries, navigation fuel-efficiency, marine heatwaves and coral risk.',
        ],
        verified2026: false,
      },
      {
        n: 8,
        text: 'Indian temple architecture is theology carved in stone. Discuss with reference to Nagara and Dravida styles.',
        directive: 'Discuss',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Art & Culture',
        modelOutline: [
          'Nagara: curvilinear shikhara, amalaka-kalasha; Khajuraho/Odisha examples.',
          'Dravida: vimana tiers, gopurams; Brihadeshwara, Madurai.',
          'Vesara bridge (Chalukya-Hoysala); geography-faith-design continuum.',
        ],
        verified2026: false,
      },
    ],
  },
  {
    kind: 'mains',
    slug: 'upsc-mains-2026-gs2',
    title: 'UPSC CSE Mains 2026 — General Studies Paper II',
    exam: 'UPSC Civil Services (Main) Examination 2026',
    heldOn: '2026-08-22',
    duration: '3 Hours · 2 PM – 5 PM',
    marks: 250,
    paperTag: 'GS2',
    questionsTotal: 20,
    instructions: [
      'Answer 20 questions in 250 words/15 marks or 150 words/10 marks as indicated.',
      'Content of the answer is more important than its length.',
      'This reader carries an 8-question archive of the paper.',
    ],
    note: MAINS_NOTE,
    sources: OFFICIAL_SOURCES,
    items: [
      {
        n: 1,
        text: 'Right to privacy relating to self and personal autonomy has been recognised as a fundamental right. Discuss its contours with reference to judicial pronouncements.',
        directive: 'Discuss',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Polity — Fundamental Rights',
        modelOutline: [
          'Puttaswamy (2017): privacy intrinsic to Art 21, 9-judge unanimity; informational, bodily and decisional autonomy spheres.',
          'Contours: proportionality test (legality, necessity, proportionality, procedural guarantees); Kharak Singh line overruled.',
          'Application: Aadhaar (2018), reproductive choice, surveillance safeguards debate.',
        ],
        verified2026: true,
        sourceRef: 'Cross-checked: DeepMentor 2026 Mains list',
      },
      {
        n: 2,
        text: 'The 2023 law on appointing Election Commissioners has re-opened a constitutional question that the Supreme Court had answered in 2023. Examine the implications for electoral autonomy.',
        directive: 'Examine',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Polity — Constitutional Bodies',
        modelOutline: [
          'Anoop Baranwal interim committee (PM-LoP-CJI) vs CEC & EC Act 2023 (PM-LoP-Minister) design.',
          'Autonomy metrics: appointment independence, tenure security, financial autonomy, removal protection.',
          'Implications: litigation (split verdict stage), reform options — independent collegium statute, NMJC-type model.',
        ],
        verified2026: false,
      },
      {
        n: 3,
        text: '"The Governor\u2019s assent calendar has become a federal flashpoint." In light of recent Supreme Court rulings, suggest a workable settlement.',
        directive: 'Suggest',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Polity — Federalism',
        modelOutline: [
          'Friction: indefinite withholding/reservation; TN/Punjab timelines litigation; "deemed assent" debate.',
          'Principles: Nabam Rebia limits, aid-and-advice binding nature, federal trust.',
          'Settlement: statutory assent timelines, reasons-in-writing, Inter-State Council reference for disputes.',
        ],
        verified2026: false,
      },
      {
        n: 4,
        text: 'Certifying ordinary statutes as Money Bills erodes bicameralism. Critically examine with recent examples and judicial responses.',
        directive: 'Critically examine',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Polity — Parliament',
        modelOutline: [
          'Art 110 scope vs practice: Aadhaar Act 2016, Finance Act 2017 (electoral bonds — struck down 2024), Tribunals Reforms.',
          'Judicial responses: Puttaswamy-Aadhaar 3:2, Rojer Mathew referral, reviewability argument.',
          'Reforms: Speaker certificate review by a constitutional panel; Article 110 interpretive codification.',
        ],
        verified2026: false,
      },
      {
        n: 5,
        text: 'India\u2019s Neighbourhood First policy is negotiating a generational churn in South Asia. Analyse with reference to Nepal, Bangladesh and the Maldives.',
        directive: 'Analyse',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'International Relations',
        modelOutline: [
          'Churn: Nepal Gen-Z transition and 2026 polls; Bangladesh interim-to-election; Maldives re-balancing after India-Out.',
          'Instruments: development partnership, UPI/digital public infrastructure exports, humanitarian credits.',
          'Management: de-hyphenate politics from people-to-people ties; BIMSTEC vitality; security dialogue continuity.',
        ],
        verified2026: false,
      },
      {
        n: 6,
        text: 'The 15th Finance Commission\u2019s devolution architecture balances equity with incentives. Evaluate its horizontal criteria amid growing cesses.',
        directive: 'Evaluate',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Polity — Fiscal Federalism',
        modelOutline: [
          '41% vertical share; horizontal criteria — demographic performance, forest, income distance, area, tax effort.',
          'Cess/surcharge bypass shrinking effective devolution; GST Council interplay.',
          'Reforms: divisible-pool integrity, 16th FC outlook (2026-31), debt-anchor coordination.',
        ],
        verified2026: false,
      },
      {
        n: 7,
        text: 'Self-Help Groups have financialised women\u2019s labour without always feminising value chains. Comment.',
        directive: 'Comment',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Social Justice',
        modelOutline: [
          'Achievements: credit access, Lakhpati Didi scale-up, social capital.',
          'Limits: upstream capture by traders, working-capital traps, thin margins.',
          'Fixes: FPO-style aggregation, e-commerce onboarding, public procurement quotas.',
        ],
        verified2026: false,
      },
      {
        n: 8,
        text: 'The Quad is often called a "public goods platform" rather than an alliance. Assess its institutional depth and India\u2019s stakes.',
        directive: 'Assess',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'International Relations',
        modelOutline: [
          'Working-group architecture: IPMDA, tech standards, health security, critical minerals.',
          'Non-treaty design: flexibility vs shallow obligations; ASEAN centrality rhetoric.',
          'India\u2019s stakes: maritime domain awareness, supply chains, balancing China without entrapment.',
        ],
        verified2026: false,
      },
    ],
  },
  {
    kind: 'mains',
    slug: 'upsc-mains-2026-gs3',
    title: 'UPSC CSE Mains 2026 — General Studies Paper III',
    exam: 'UPSC Civil Services (Main) Examination 2026',
    heldOn: '2026-08-23',
    duration: '3 Hours · 9 AM – 12 PM',
    marks: 250,
    paperTag: 'GS3',
    questionsTotal: 20,
    instructions: [
      'Answer 20 questions in 250 words/15 marks or 150 words/10 marks as indicated.',
      'Content of the answer is more important than its length.',
      'This reader carries an 8-question archive of the paper.',
    ],
    note: MAINS_NOTE,
    sources: OFFICIAL_SOURCES,
    items: [
      {
        n: 1,
        text: 'Zero-MDR made UPI universal; cost recovery now tests the model. Examine the economics of India\u2019s digital payments ecosystem.',
        directive: 'Examine',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Economy',
        modelOutline: [
          'Success: NPCI rails, 24×7 ubiquity, inclusion dividend; zero-MDR driver.',
          'Tension: infrastructure cost burden on banks/PSPs; MDR-on-high-value (Oct 2026) and consumer resistance surveys.',
          'Balance: tiered MDR, public funding for DPI, fraud-cost internalisation, CBDC complementarity.',
        ],
        verified2026: false,
      },
      {
        n: 2,
        text: '"Semiconductors are the new oil." Evaluate India\u2019s ecosystem-building strategy under the India Semiconductor Mission.',
        directive: 'Evaluate',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Science & Technology',
        modelOutline: [
          'ISM design: fabs (mature nodes), ATMP/OSAT, DLI/C2S; ₹1.6-lakh-crore committed pipeline.',
          'Constraints: ultrapure inputs, talent yields, single-region supply chains, export-control geopolitics.',
          'Verdict: ecosystem-first vs subsidy-first; design strength as the wedge to fabrication.',
        ],
        verified2026: false,
      },
      {
        n: 3,
        text: 'A debt-anchored FRBM is more credible than a deficit-anchored one. Discuss with reference to the N.K. Singh framework.',
        directive: 'Discuss',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Economy — Fiscal Policy',
        modelOutline: [
          'Debt anchor logic: intergenerational fairness, escape clauses, counter-cyclical room.',
          'Practice: glide path to <4.5% fiscal deficit; off-budget consolidation.',
          'Safeguards: independent fiscal council, transparent debt path, State-level coordination.',
        ],
        verified2026: false,
      },
      {
        n: 4,
        text: 'Genome editing blurs the GM and non-GM boundary. Examine India\u2019s 2022 regulatory approach and its farm-technology politics.',
        directive: 'Examine',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'S&T / Agriculture',
        modelOutline: [
          'Tech: SDN-1/2/3 spectrum; 1989 Rules vs DBT 2022 exemption.',
          'Politics: state APMC/seed federalism, farmer trust, industry IP.',
          'Path: case-by-case biosafety, labelling honesty, public-sector varieties first.',
        ],
        verified2026: false,
      },
      {
        n: 5,
        text: 'Cyclone intensity, not frequency, is the new normal for the North Indian Ocean. Suggest a resilience architecture for the eastern coast.',
        directive: 'Suggest',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Disaster Management',
        modelOutline: [
          'Science: SST warming, rapid intensification pre-landfall; Bay of Bengal funnelling.',
          'Architecture: IMD last-mile warnings, NCRMP shelters, mangrove greenbelts, cyclone-resilient power/networks.',
          'Governance: coastal zoning enforcement, insurance (parametric), community drills.',
        ],
        verified2026: false,
      },
      {
        n: 6,
        text: 'Frontier AI demands regulation of use, not of research. Critically evaluate India\u2019s approach.',
        directive: 'Critically evaluate',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'S&T / Governance',
        modelOutline: [
          'India stack: IndiaAI Mission compute/data, DPDP 2023, deepfake labelling advisories.',
          'Risk view: CBRN/cyber uplift, election integrity, labour displacement; refusal-training frontier (Gemini 4 Argon class).',
          'Balance: principles-based statute, sandboxed enforcement, standards (C2PA) — avoid research chill.',
        ],
        verified2026: false,
      },
      {
        n: 7,
        text: 'Digital-arrest scams exploit trust in authority. Outline a whole-of-society cyber-hygiene response.',
        directive: 'Outline',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Internal Security',
        modelOutline: [
          'Phenomenon: VOIP impersonation of police/CBI/RBI; mule-account laundering.',
          'Response: I4C-1930 freeze rails, bank risk engines, CERT-In takedowns, awareness curricula.',
          'Society layer: family-level verification norms, senior-citizen targeting, grievance UX.',
        ],
        verified2026: false,
      },
      {
        n: 8,
        text: 'MSP procurement is concentrated in a few States and crops, distorting both markets and water use. Analyse and suggest corrections.',
        directive: 'Analyse',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Agriculture',
        modelOutline: [
          'Concentration evidence: rice-wheat padi in Punjab-Haryana-MP belts; water-stress linkage.',
          'Distortions: cropping skew, private-market thinning, fiscal load.',
          'Corrections: diversified procurement (millets/oilseeds), per-crop State caps, DBT-type support pilots, FPO markets.',
        ],
        verified2026: false,
      },
    ],
  },
  {
    kind: 'mains',
    slug: 'upsc-mains-2026-gs4',
    title: 'UPSC CSE Mains 2026 — General Studies Paper IV',
    exam: 'UPSC Civil Services (Main) Examination 2026',
    heldOn: '2026-08-23',
    duration: '3 Hours · 2 PM – 5 PM',
    marks: 250,
    paperTag: 'GS4',
    questionsTotal: 20,
    instructions: [
      'Answer 20 questions (concept + case studies) as per word/marks indicated.',
      'Where a case study is given, analyse with stakeholders and options before recommending a course of action.',
      'This reader carries an 8-question archive of the paper.',
    ],
    note: MAINS_NOTE,
    sources: OFFICIAL_SOURCES,
    items: [
      {
        n: 1,
        text: '"Constitutional morality is not a natural sentiment. It has to be cultivated." — Ambedkar. Analyse its place in ethical governance.',
        directive: 'Analyse',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Ethics — Thinkers',
        modelOutline: [
          'Ambedkar\u2019s warning against hero-worship and bhakti in politics.',
          'Constitutional morality vs popular morality — Naz Foundation line.',
          'Governance application: oath-keeping, due process over expediency.',
        ],
        verified2026: false,
      },
      {
        n: 2,
        text: 'Distinguish between attitude and aptitude of civil servants. How does emotional intelligence bridge the two?',
        directive: 'Distinguish',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Ethics — Concepts',
        modelOutline: [
          'Attitude: evaluative disposition (cognitive-affective-behavioural); aptitude: capacity for task competence.',
          'EI bridge: self-awareness regulates attitude; empathy channels aptitude into citizen-centric service.',
          'Example: pandemic communication — firmness (aptitude) with warmth (attitude).',
        ],
        verified2026: false,
      },
      {
        n: 3,
        text: 'You are the District Magistrate. A viral "digital arrest" gang has defrauded 40 elderly residents; victims refuse to file FIRs out of shame, and a local MLA pressures you to avoid arrests before elections. Identify the ethical issues and your course of action.',
        directive: 'Case study',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Ethics — Case Study',
        modelOutline: [
          'Dilemmas: public safety vs political pressure; victim dignity vs procedural urgency.',
          'Stakeholders: victims, families, police, banks, MLA, wider elderly community.',
          'Course: FIR-encouragement camps with counselling, I4C-1930 rapid freeze, evidence-driven arrests, monthly transparency briefings to defuse electoral framing.',
        ],
        verified2026: false,
      },
      {
        n: 4,
        text: 'As CEO of a smart-city SPV, your facial-recognition vendor\u2019s accuracy fails for darker skin tones, risking wrongful flags. The vendor requests a quiet recalibration after rollout. What will you do and why?',
        directive: 'Case study',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Ethics — Case Study',
        modelOutline: [
          'Issues: non-maleficence, algorithmic bias, probity in procurement, data-subject rights.',
          'Options: pause deployment / independent audit / disclose to oversight board / continue with warnings.',
          'Decision: suspend high-stakes use, commission third-party audit, publish summary, pilot opt-in redesign — proportionality and transparency.',
        ],
        verified2026: false,
      },
      {
        n: 5,
        text: '"Probity in public life is less about codes and more about consequences." Discuss the role of conflict-of-interest management.',
        directive: 'Discuss',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Ethics — Probity',
        modelOutline: [
          'COI taxonomy: actual, potential, apparent; declaration discipline.',
          'Consequences: asset-declaration audits, recusal norms, cooling-off postings.',
          'Culture: leadership signalling beats rulebook citations.',
        ],
        verified2026: false,
      },
      {
        n: 6,
        text: 'Good governance is measured by how a State treats its least powerful applicant. Examine the ethics of citizen charters in practice.',
        directive: 'Examine',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Ethics — Governance',
        modelOutline: [
          'Charter promise: standards, grievance time-lines, compensation.',
          'Gap: token displays, unmeasured service levels; Sevottam critique.',
          'Ethic: dignity-first service design, dashboard transparency, social audits.',
        ],
        verified2026: false,
      },
      {
        n: 7,
        text: 'Your subordinate is brilliant but routinely belittles junior staff; performance suffers. As the team lead, resolve the dilemma with an ethical framework.',
        directive: 'Case study',
        marks: 15,
        wordLimit: 250,
        syllabusTag: 'Ethics — Case Study',
        modelOutline: [
          'Issues: workplace dignity vs output; moral luck of talent.',
          'Framework: stakeholder impact + deontological floor (respect) + consequential team effects.',
          'Action: documented feedback, mentoring with behavioural goals, escalation policy if unchanged; protect juniors\u2019 grievance routes.',
        ],
        verified2026: false,
      },
      {
        n: 8,
        text: '"Impartiality is not neutrality between justice and injustice." Elucidate for public administration.',
        directive: 'Elucidate',
        marks: 10,
        wordLimit: 150,
        syllabusTag: 'Ethics — Values',
        modelOutline: [
          'Impartiality: rule-based even-handedness; neutrality: absence of engagement.',
          'Application: affirmative duties towards vulnerable groups within law.',
          'Guard: avoid capture by local power blocs; written-reason discipline.',
        ],
        verified2026: false,
      },
    ],
  },
]

export function getPaper(slug: string): Paper | undefined {
  return PYQ_PAPERS.find((p) => p.slug === slug)
}

/** Legacy / archive year → nearest on-screen 2026 paper (by paper type). */
export const RESOURCE_SLUG_MAP: Record<string, string> = {}

// 2026 papers map to themselves
for (const p of PYQ_PAPERS) RESOURCE_SLUG_MAP[p.slug] = p.slug
// generated archive slugs from scripts/seed.ts map by paper type
for (let y = 2016; y <= 2025; y++) RESOURCE_SLUG_MAP[`upsc-prelims-gs1-pyq-${y}`] = 'upsc-prelims-2026-gs1'
for (const y of [2022, 2023, 2024, 2025]) RESOURCE_SLUG_MAP[`upsc-prelims-csat-pyq-${y}`] = 'upsc-prelims-2026-csat'
for (const gs of ['gs1', 'gs2', 'gs3', 'gs4']) {
  for (const y of [2023, 2024]) RESOURCE_SLUG_MAP[`upsc-mains-${gs}-pyq-${y}`] = `upsc-mains-2026-${gs}`
}
RESOURCE_SLUG_MAP['upsc-mains-essay-pyq-2024'] = 'upsc-mains-2026-essay'

export function mapResourceSlug(slug: string, year?: number | null): { paper: string; legacyYear?: number } {
  const paper = RESOURCE_SLUG_MAP[slug]
  if (paper) return { paper, legacyYear: year ?? undefined }
  // fallback: sniff by pattern
  if (slug.startsWith('upsc-mains-essay-pyq')) return { paper: 'upsc-mains-2026-essay', legacyYear: year ?? undefined }
  const gs = slug.match(/upsc-mains-(gs[1-4])-pyq/)
  if (gs) return { paper: `upsc-mains-2026-${gs[1]}`, legacyYear: year ?? undefined }
  if (slug.includes('csat')) return { paper: 'upsc-prelims-2026-csat', legacyYear: year ?? undefined }
  return { paper: 'upsc-prelims-2026-gs1', legacyYear: year ?? undefined }
}
