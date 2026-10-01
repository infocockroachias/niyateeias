"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Info, MapPin, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/blocks";

/* ----------------------------- Topic dataset ------------------------------- */

interface GeoMarker {
  x: number;
  y: number;
  label: string;
  fact: string;
}

interface GeoTopic {
  key: string;
  title: string;
  blurb: string;
  markers: GeoMarker[];
}

const TOPICS: GeoTopic[] = [
  {
    key: "monsoon",
    title: "Monsoon Winds",
    blurb: "The seasonal reversal that powers Indian agriculture — and half the GS-I syllabus.",
    markers: [
      { x: 150, y: 300, label: "Arabian Sea branch", fact: "The SW monsoon hits the Western Ghats by early June; windward Kerala & Konkan get 200–300+ cm rain, while leeward Deccan stays drier (rain-shadow effect)." },
      { x: 280, y: 290, label: "Bay of Bengal branch", fact: "Deflected by the Himalayas, this branch swings west over the plains — bringing the June–September rain belt across Bihar, UP and Punjab in a stepwise 'burst'." },
      { x: 255, y: 385, label: "Retreating (NE) monsoon", fact: "In October–November winds reverse; they pick moisture over the Bay of Bengal and give Tamil Nadu its main rainy season — Chennai's wettest months." },
      { x: 175, y: 85, label: "Western disturbances", fact: "Mediterranean storms travelling east bring crucial winter rain and snow to NW India — the basis of the rabi wheat crop." },
    ],
  },
  {
    key: "rivers",
    title: "Rivers of India",
    blurb: "Himalayan snow-fed systems vs Peninsular rain-fed rivers — flood behavior and interlinking debates.",
    markers: [
      { x: 245, y: 150, label: "Ganga", fact: "Rises from Gangotri glacier (Bhagirathi), flows ~2,525 km to the Bay of Bengal; drains 11 states and carries the largest sediment load of any Indian river." },
      { x: 222, y: 162, label: "Yamuna", fact: "Longest tributary of the Ganga; joins it at Prayagraj (Triveni Sangam). Delhi, Agra and Mathura draw heavily from it — central to the Cauvery-style water-sharing debates." },
      { x: 342, y: 178, label: "Brahmaputra", fact: "Called Tsangpo in Tibet, Siang/Dihang in Arunachal; carries more water than the Ganga and is prone to massive Brahmaputra floods in Assam each monsoon." },
      { x: 272, y: 318, label: "Godavari", fact: "The largest Peninsular river (~1,465 km), called 'Dakshina Ganga'; rises in Trimbakeshwar (Nashik) and empties into the Bay near Rajahmundry." },
      { x: 238, y: 362, label: "Krishna", fact: "Rises at Mahabaleshwar (Western Ghats); the Nagarjuna Sagar and Almatti dams anchor its basin — frequent Krishna Water Disputes Tribunal references." },
      { x: 246, y: 402, label: "Kaveri", fact: "Rises at Talakaveri (Brahmagiri hills); the Kaveri delta is the 'rice bowl of the South'. The Kaveri dispute between Karnataka & TN is a classic polity-geography crossover." },
      { x: 148, y: 268, label: "Narmada", fact: "Flows west through the rift valley between Vindhya & Satpura ranges — one of only three major west-flowing rift rivers (with Tapi and Mahi)." },
    ],
  },
  {
    key: "soils",
    title: "Soil Types",
    blurb: "ICAR's eight-fold classification — crop suitability and conservation issues follow the map.",
    markers: [
      { x: 245, y: 205, label: "Alluvial", fact: "Covers ~40% of India across the northern plains; the most fertile and widespread soil — ideal for wheat, rice, sugarcane. Khadar (new) vs Bhangar (old) terraces." },
      { x: 172, y: 322, label: "Black (Regur)", fact: "Formed from Deccan basalt; retains moisture — perfect for cotton. prone to cracking in summer; also called 'self-ploughing' soil." },
      { x: 285, y: 335, label: "Red soil", fact: "Formed from crystalline igneous rocks; reddish from iron oxides. Covers eastern Andhra, Odisha interior, Tamil Nadu — needs fertilizer supplementation." },
      { x: 215, y: 415, label: "Laterite", fact: "Formed in alternating wet-dry tropical climates; leached and acidic — good for tea, coffee, cashew once limed. Common in Western Ghats, Odisha hills, parts of West Bengal." },
      { x: 132, y: 172, label: "Desert (Arid)", fact: "Western Rajasthan's sandy soils: high calcium, low organic matter, high wind-erosion risk — the Indira Gandhi Canal transformed pockets of it." },
      { x: 205, y: 60, label: "Mountain soil", fact: "Thin, immature soils of the Himalayan slopes — rich in humus in forested zones; terracing is essential to check erosion." },
    ],
  },
  {
    key: "parks",
    title: "National Parks",
    blurb: "Map-based memory hooks for Environment & Biodiversity questions.",
    markers: [
      { x: 252, y: 122, label: "Jim Corbett NP", fact: "India's first national park (1936, Uttarakhand), anchor of Project Tiger (1973) — densest tiger population per unit area." },
      { x: 352, y: 186, label: "Kaziranga NP", fact: "Assam floodplain UNESCO site — home of ~two-thirds of the world's one-horned rhinos; Brahmaputra floods annually renew its grasslands." },
      { x: 98, y: 228, label: "Gir NP", fact: "Saurashtra, Gujarat — the only natural habitat of the Asiatic Lion; the nucleus of Project Lion." },
      { x: 300, y: 238, label: "Sundarbans NP", fact: "Largest mangrove forest on Earth (with Bangladesh); Royal Bengal tiger, swimming-adapted; core of India's first Biosphere Reserve." },
      { x: 248, y: 262, label: "Kanha NP", fact: "Madhya Pradesh sal-and-bamboo forest that saved the hard-ground barasingha (swamp deer) from extinction." },
      { x: 212, y: 402, label: "Periyar NP", fact: "Kerala's elephant reserve around Periyar lake — also a Project Elephant site; evergreen Western Ghats biodiversity hotspot." },
      { x: 182, y: 172, label: "Ranthambore NP", fact: "Rajasthan's dry-deciduous tiger park on a former royal hunting ground — famous 'tigers in fort ruins' imagery." },
    ],
  },
  {
    key: "minerals",
    title: "Minerals Belt",
    blurb: "Where India's industry is anchored — and the mining-vs-tribal-rights debates it creates.",
    markers: [
      { x: 295, y: 262, label: "Iron ore — Odisha", fact: "Odisha + Jharkhand + Chhattisgarh hold ~75% of India's hematite reserves; Keonjhar & Sundargarh districts feed the Paradip/Vizag steel corridors." },
      { x: 300, y: 218, label: "Coal — Jharkhand", fact: "Jharia & Bokaro coalfields (Gondwana coal); India is the world's 2nd-largest coal consumer — anchor of the just-transition debate." },
      { x: 258, y: 335, label: "Bauxite — East coast", fact: "Bauxite caps the Eastern Ghats plateaus (Koraput, Vishakhapatnam, Kalahandi); the Niyamgiri hills case is a landmark in tribal consent (FRA)." },
      { x: 190, y: 330, label: "Manganese — Central", fact: "Maharashtra–MP belt (Nagpur, Bhandara, Balaghat) — key ferro-alloy for steel; India holds among the largest reserves globally." },
      { x: 120, y: 292, label: "Oil — Mumbai High", fact: "Offshore field discovered 1974 on the continental shelf; ONGC's platform network still supplies a major share of domestic crude." },
      { x: 330, y: 212, label: "Uranium — Jaduguda", fact: "Jharkhand's Jaduguda is India's oldest uranium mine; monazite sands of Kerala coast add thorium — basis of India's three-stage nuclear programme." },
    ],
  },
  {
    key: "currents",
    title: "Ocean Currents",
    blurb: "The Indian Ocean's seasonal heartbeat — monsoon-driven currents unique to our latitudes.",
    markers: [
      { x: 100, y: 315, label: "Somali Current", fact: "The only major current on Earth that reverses seasonally with the wind: flows southwest in winter, powerful northeastward 'Somali jet' in summer monsoon." },
      { x: 150, y: 345, label: "SW Monsoon drift", fact: "June–September winds drive the East Arabian Sea current — historically the highway of Indian Ocean trade to the Malabar coast." },
      { x: 300, y: 315, label: "Bay of Bengal gyre", fact: "A seasonal clockwise (winter) / anticlockwise (summer) gyre spreads Ganga–Brahmaputra freshwater; low salinity fuels cyclone intensification." },
      { x: 210, y: 445, label: "Indian Ocean gyre", fact: "South of the equator the gyre couples with trade winds; its warmth makes the Indian Ocean Dipole (IOD) possible — a key El Niño partner in monsoon forecasts." },
    ],
  },
  {
    key: "borders",
    title: "India–Neighbours Borders",
    blurb: "Seven land neighbours, one maritime one — lengths, lines and disputes in one frame.",
    markers: [
      { x: 122, y: 148, label: "Pakistan", fact: "Border ~3,323 km incl. the Radcliffe-drawn Punjab line and the 1972 Line of Control in J&K; Sir Creek marsh dispute remains in the Rann of Kutch." },
      { x: 228, y: 62, label: "China", fact: "Longest border (~3,488 km) across 5 states; contested sectors — Aksai Chin (western) and Arunachal 'MacMahon Line' (eastern); the LAC patrolling framework was agreed in 2005 protocols." },
      { x: 258, y: 118, label: "Nepal", fact: "~1,751 km open 'Roti-Beti' border; the Kalapani–Lipulekh–Limpiyadhura trijunction dispute flares periodically; 1950 Peace & Friendship Treaty anchors ties." },
      { x: 302, y: 142, label: "Bhutan", fact: "~699 km border; the 2006–07 updated Friendship Treaty guides security ties — Doklam (2017) showed its strategic depth." },
      { x: 318, y: 216, label: "Bangladesh", fact: "Longest border (~4,096 km); the 2015 Land Boundary Agreement settled 162 enclaves — a model of negotiated settlement. Tin Bigha corridor and Muhurichar river island remain watchpoints." },
      { x: 362, y: 198, label: "Myanmar", fact: "~1,643 km border through the 'chicken's neck' sensitive NE states; Free Movement Regime (16 km) is being re-examined for security." },
      { x: 238, y: 452, label: "Sri Lanka", fact: "No land border — separated by the Palk Strait (~30 km at narrowest); Katchatheevu island and the fisheries dispute dominate maritime talks." },
    ],
  },
  {
    key: "physiography",
    title: "Physiographic Divisions",
    blurb: "The five classic divisions every GS-I answer is built on.",
    markers: [
      { x: 215, y: 72, label: "The Himalayas", fact: "Young fold mountains in three ranges (Himadri, Himachal, Shiwalik); five states touch the main Himalaya arc — the 'water tower' of South Asia." },
      { x: 240, y: 178, label: "Northern Plains", fact: "Formed by Ganga–Indus alluvium over ~2,000 km and 7 lakh sq km — the world's most extensive alluvial tract and India's demographic core." },
      { x: 205, y: 315, label: "Peninsular Plateau", fact: "The oldest landmass (Archean gneiss) tilted east; Deccan Trap lavas cover ~5 lakh sq km — black soil's parent." },
      { x: 132, y: 178, label: "Thar Desert", fact: "India's only hot desert (~2.3 lakh sq km); Aravalli range stops its eastward spread — the range is dying from illegal mining." },
      { x: 178, y: 372, label: "Coastal Plains", fact: "West coast: narrow, jagged, estuaries (Konkan–Malabar). East coast: broad, deltaic (Mahanadi–Kaveri). Contrast is a favourite 10-marker." },
      { x: 340, y: 420, label: "Island Groups", fact: "Andaman & Nicobar (570 islands, Barren Island hosts South Asia's only active volcano) and Lakshadweep (36 coral atolls) — volcanic vs coral origins." },
    ],
  },
];

/* -------------------------------- SVG map ---------------------------------- */

const INDIA_OUTLINE =
  "M 205 14 Q 235 30 232 52 Q 252 58 262 84 Q 274 100 300 112 Q 306 140 290 158 Q 316 168 352 158 Q 382 166 388 184 Q 368 196 344 200 Q 322 206 306 224 Q 292 244 300 262 Q 278 296 258 330 Q 240 372 226 434 Q 214 442 206 434 Q 196 372 184 318 Q 170 262 148 242 Q 128 232 112 240 Q 84 232 82 214 Q 104 200 130 178 Q 152 148 168 116 Q 182 88 196 76 Q 200 40 205 14 Z";

function IndiaMap({
  topic,
  activeMarker,
  onSelectMarker,
}: {
  topic: GeoTopic;
  activeMarker: number | null;
  onSelectMarker: (i: number) => void;
}) {
  return (
    <svg
      viewBox="0 0 420 470"
      className="h-auto w-full"
      role="img"
      aria-label={`Stylized map of India showing ${topic.title}`}
    >
      {/* Ocean backdrop */}
      <rect x="0" y="0" width="420" height="470" rx="12" fill="#faf8f2" />
      {/* Sri Lanka hint */}
      <path d="M 244 448 q 8 4 6 14 q -2 8 -10 6 q -7 -3 -5 -12 q 2 -8 9 -8 Z" fill="#0a1b3d" opacity="0.25" />
      {/* India outline */}
      <path d={INDIA_OUTLINE} fill="#0a1b3d" stroke="#c9a24b" strokeWidth="2.5" />
      {/* Texture dots inside map: subtle */}
      <path d={INDIA_OUTLINE} fill="url(#mapDots)" opacity="0.5" />
      <defs>
        <pattern id="mapDots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="#c9a24b" opacity="0.35" />
        </pattern>
      </defs>

      {/* Markers */}
      {topic.markers.map((m, i) => {
        const active = activeMarker === i;
        return (
          <g
            key={`${topic.key}-${i}`}
            onClick={() => onSelectMarker(i)}
            className="cursor-pointer"
            role="button"
            aria-label={m.label}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectMarker(i);
            }}
          >
            {active ? (
              <circle cx={m.x} cy={m.y} r="16" fill="#c9a24b" opacity="0.25">
                <animate attributeName="r" values="12;18;12" dur="1.6s" repeatCount="indefinite" />
              </circle>
            ) : null}
            <circle
              cx={m.x}
              cy={m.y}
              r={active ? 9 : 7}
              fill={active ? "#c9a24b" : "#faf8f2"}
              stroke={active ? "#060f26" : "#c9a24b"}
              strokeWidth="2"
            />
            <text
              x={m.x}
              y={m.y + 3.5}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill={active ? "#060f26" : "#0a1b3d"}
              style={{ pointerEvents: "none" }}
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Compass */}
      <g transform="translate(378,30)" aria-hidden>
        <circle r="14" fill="#ffffff" stroke="#0a1b3d" strokeWidth="1.5" />
        <path d="M 0 -10 L 4 4 L 0 1 L -4 4 Z" fill="#c9a24b" />
        <text y="-18" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0a1b3d">N</text>
      </g>
    </svg>
  );
}

/* ---------------------------------- View ----------------------------------- */

export function AIGeoView() {
  const [topicKey, setTopicKey] = useState(TOPICS[0].key);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  const topic = TOPICS.find((t) => t.key === topicKey) ?? TOPICS[0];

  const selectTopic = (key: string) => {
    setTopicKey(key);
    setActiveMarker(null);
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="AI Tool 04"
          title="Interactive Geography Maps"
          description="Map-work is free marks in both Prelims and Mains — click a topic, then tap the numbered markers to learn each location's story."
        />

        {/* Topic chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Map topics">
          {TOPICS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={t.key === topicKey}
              onClick={() => selectTopic(t.key)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                t.key === topicKey
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/70 hover:border-secondary hover:text-primary"
              )}
            >
              {t.title}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Map card */}
          <Card className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={topic.key}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <IndiaMap
                    topic={topic}
                    activeMarker={activeMarker}
                    onSelectMarker={(i) => setActiveMarker(activeMarker === i ? null : i)}
                  />
                </motion.div>
              </AnimatePresence>
              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden />
                Stylised map for learning — boundaries are indicative and not to scale. For definitive
                maps always refer to the Survey of India / NCERT Atlas.
              </p>
            </CardContent>
          </Card>

          {/* Facts panel */}
          <div>
            <Card className="border-secondary/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
                    <MapPin className="h-5 w-5 text-gold" aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-primary">{topic.title}</h2>
                    <p className="text-sm text-muted-foreground">{topic.blurb}</p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {topic.markers.map((m, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setActiveMarker(activeMarker === i ? null : i)}
                        className={cn(
                          "flex w-full gap-3 rounded-xl border p-4 text-left transition-all",
                          activeMarker === i
                            ? "border-secondary bg-secondary/10 shadow-sm"
                            : "border-border bg-card hover:border-secondary/50"
                        )}
                        aria-pressed={activeMarker === i}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                            activeMarker === i ? "bg-secondary text-primary" : "bg-primary text-gold"
                          )}
                          aria-hidden
                        >
                          {i + 1}
                        </span>
                        <span>
                          <span className="block font-semibold text-primary">{m.label}</span>
                          {activeMarker === i ? (
                            <motion.span
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-1 block text-sm leading-relaxed text-foreground/80"
                            >
                              {m.fact}
                            </motion.span>
                          ) : (
                            <span className="mt-0.5 block text-xs text-muted-foreground">Tap to reveal the exam fact</span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-navy p-5 text-ivory">
              <GraduationCap className="h-8 w-8 shrink-0 text-gold" aria-hidden />
              <p className="text-sm leading-relaxed text-ivory/80">
                Map questions appear in nearly every Prelims paper. Enrolled students practice these
                with mentor-curated atlases in the classroom programme.
              </p>
              <Compass className="h-5 w-5 shrink-0 text-gold/60" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
