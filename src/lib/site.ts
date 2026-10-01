/** Brand constants — single source of truth for contact/social info */
export const SITE = {
  name: "Niyatee Civil Services Academy",
  shortName: "Niyatee IAS",
  hindi: "नियती",
  tagline: "From Aspirations to Achievements",
  positioning: "Odisha's first AI-integrated IAS coaching institute",
  phone: "+91 97776 43159",
  phoneHref: "tel:+919777643159",
  whatsapp: "https://wa.me/919777643159",
  email: "info@niyateeias.com",
  emailHref: "mailto:info@niyateeias.com",
  admissionsEmail: "admissions@niyateeias.com",
  address: "Inn Views, Off Infovalley, Bhubaneswar – 752054",
  hours: "Mon–Sat 9AM–7PM · Sun 10AM–2PM",
  youtube: "https://www.youtube.com/@NiyateeIASAcademy",
  instagram: "https://instagram.com/niyateeiasacademy",
  x: "https://x.com/niyateeias",
  telegram: "https://t.me/niyateeias",
  mapsDirections:
    "https://www.google.com/maps/search/?api=1&query=Niyatee+Civil+Services+Academy+Infovalley+Bhubaneswar",
} as const;

export const AI_TOOLS = [
  {
    view: "ai-evaluate" as const,
    title: "AI Mains Answer Evaluation",
    icon: "PenLine",
    blurb:
      "Upload your Mains answer and get UPSC-style scoring out of 10 with a breakdown of content, structure, analysis, examples & presentation.",
  },
  {
    view: "ai-chat" as const,
    title: "AI Doubt Agent",
    icon: "MessagesSquare",
    blurb:
      "A 24×7 mentor persona that answers polity, economy, strategy and syllabus doubts with UPSC-precise, cited explanations.",
  },
  {
    view: "ai-mcq" as const,
    title: "AI MCQ Practice",
    icon: "ListChecks",
    blurb:
      "Generate fresh Prelims-style MCQs by subject and difficulty — instant feedback, explanations and score tracking.",
  },
  {
    view: "ai-geo" as const,
    title: "AI Geography Maps",
    icon: "Map",
    blurb:
      "A 3D world atlas of 130+ UPSC-curated locations — rivers, straits, ports, places in news, heritage & ecology hotspots — with layers, search, fly-to and an AI map quiz.",
  },
] as const;
