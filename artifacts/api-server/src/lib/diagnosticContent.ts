// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Revenue Management & Pricing Analytics subject-specific reasoning.
//     Realistic short cases about the course material; the best-supported answer
//     is keyed first.
//   - general  — General Reasoning. Genuine reasoning items spanning analysis,
//     inference, evaluation, deduction, and induction (NOT a "docility"/agree-
//     with-authority test).
//
// Each (instrument, phase) is offered in THREE selectable answer formats that
// share the same kind of questions:
//   - mcq     — pick the single best option.
//   - hybrid  — pick the best option AND (optionally) write a short note.
//   - written — no options shown; write a short answer in your own words.
//
// These diagnostics are UNGRADED practice: takeable anytime, unlimited times,
// and they never affect the course grade. Every time a test is started, fresh
// questions are generated (see reasoning.ts) so questions never repeat. The
// items below are the structural BLUEPRINT (style + fallback) for that
// generation, grounded per phase by GEN_SPECS.
//
// All items are ORIGINAL. For every item the correct option is written FIRST;
// at seed time options are rotated so the correct answer lands at a varied
// index (see seedDiagnostics.ts). `modelAnswer` is the ideal short written
// response used to grade the written/hybrid formats.
// ---------------------------------------------------------------------------

export type SkillArea =
  | "analysis"
  | "inference"
  | "evaluation"
  | "deduction"
  | "induction";

export type Instrument = "subject" | "general";

export type Phase = "before" | "third" | "twothirds" | "after";

export type DiagFormat = "mcq" | "hybrid" | "written";

// A single unified diagnostic item. The correct option is listed FIRST and is
// rotated to a random index at seed time. `modelAnswer` is the reference answer
// for grading the written/hybrid formats.
export type DiagItem = {
  prompt: string;
  options: string[];
  modelAnswer: string;
  skillArea?: SkillArea;
};

export type DiagnosticSeed = {
  instrument: Instrument;
  phase: Phase;
  format: DiagFormat;
  title: string;
  subtitle: string;
  instructions: string;
  items: DiagItem[];
};

// ===========================================================================
// Phase metadata
// ===========================================================================

export const PHASE_ORDER: Phase[] = ["before", "third", "twothirds", "after"];

export const PHASE_LABEL: Record<Phase, string> = {
  before: "Before the course",
  third: "One-third of the way through",
  twothirds: "Two-thirds of the way through",
  after: "After the course",
};

// ===========================================================================
// Per-(instrument, phase) generation specs
// Used by reasoning.ts to generate fresh, never-repeating questions grounded in
// the right scope for the chosen time-point. `topicFocus` describes WHAT to ask
// about; `level` nudges difficulty for the time-point.
// ===========================================================================

export type GenSpec = { topicFocus: string; level: string };

const SUBJECT_SPECS: Record<Phase, GenSpec> = {
  before: {
    level:
      "Intro level: answerable by a thoughtful newcomer reasoning carefully, BEFORE any lessons. Do not assume prior course knowledge or technical terms.",
    topicFocus:
      "What revenue management and pricing is and how it thinks about a price: that a price is not one fixed true number but a flexible choice, that different buyers will pay different amounts for the very same thing, so a single fixed price is at the same time too high for some buyers and too low for others, and that smart pricing reasons about who is buying, when, and how much they'd really pay rather than stamping one price on everything.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases.",
    topicFocus:
      "Topics 1.1-1.3: what revenue management is (a price is a flexible choice, not one fixed number, so a single price is too high for some buyers and too low for others); willingness to pay (every buyer has a hidden ceiling that differs from person to person, the gap between that ceiling and the price paid is consumer surplus, and sellers can't see the ceiling so they hunt for clues); and price elasticity (how much demand bends when the price moves — stiff demand barely reacts so raising price earns more, while bendy demand drops sharply so raising price backfires).",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning.",
    topicFocus:
      "Topics 1.1-1.6: flexible pricing, willingness to pay, and elasticity, PLUS price discrimination and fences (charging different buyers different prices for the same thing only works if a fence — like advance purchase or a coupon — keeps the high payers from grabbing the low price), dynamic pricing (letting the price move in real time captures peak willingness to pay and smooths demand, but a spike that feels like gouging breeds backlash), and overbooking (selling more reservations than you have room for is a calculated gamble on predictable no-shows, balancing empty seats against costly bumps).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea.",
    topicFocus:
      "The full unit, topics 1.1-1.8: flexible pricing, willingness to pay, elasticity, fences, dynamic pricing, and overbooking, PLUS the psychology of price (prices are felt against a nearby comparison, so anchors, discounts, and bundles change how a price feels, and a fake anchor crosses into deception) and setting a pricing strategy (there is no single right price; a real strategy balances cost, customers, and competition, picks a posture like skimming or penetration, and weighs short-term money against long-term trust).",
  },
};

const GENERAL_SPECS: Record<Phase, GenSpec> = {
  before: {
    level: "Everyday, accessible reasoning. One step of inference per item.",
    topicFocus:
      "General reasoning on everyday, neutral topics: identifying assumptions and conclusions, what evidence does and does not support, judging the strength of sources, valid vs. invalid deduction, and the strength of generalizations.",
  },
  third: {
    level: "Everyday reasoning, slightly more demanding than the baseline.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  twothirds: {
    level: "Moderately demanding reasoning, sometimes two steps.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  after: {
    level: "More demanding, multi-step reasoning where appropriate.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
};

export function genSpecFor(instrument: Instrument, phase: Phase): GenSpec {
  return instrument === "subject"
    ? SUBJECT_SPECS[phase]
    : GENERAL_SPECS[phase];
}

// ===========================================================================
// Format-specific instructions
// ===========================================================================

const FORMAT_LABEL: Record<DiagFormat, string> = {
  mcq: "Multiple Choice",
  hybrid: "Hybrid",
  written: "Written",
};

function instructionsFor(instrument: Instrument, format: DiagFormat): string {
  const subject =
    instrument === "subject"
      ? "Answer each question about revenue management & pricing analytics — these reward careful reasoning about realistic business situations, not memorized facts"
      : "Answer each reasoning question — these measure how you think, not what you recall";
  const body =
    format === "mcq"
      ? `${subject} by selecting the single best option.`
      : format === "hybrid"
        ? `${subject} by selecting the best option. You can add a quick note on your reasoning if you like — it's optional and a few words is plenty.`
        : `${subject}. No answer options are shown — just jot a brief answer in your own words. One or two sentences is plenty; there's no need to write a lot.`;
  return `${body} This is ungraded practice — take it anytime, as many times as you like; it never affects your course grade. Submitting shows your results with written feedback.`;
}

// ===========================================================================
// SUBJECT — Revenue Management & Pricing Analytics blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A reporter asks a pricing analyst why two travelers in identical seats on the same flight paid very different prices. The analyst would most likely explain it in terms of:",
    options: [
      "different buyers will pay different amounts, so the airline charges each closer to what they'll pay instead of one fixed price",
      "whether the airline's manager is a naturally lucky person",
      "the color of the airline's logo",
      "the reporter's personal opinion of airplanes",
    ],
    modelAnswer:
      "Pricing treats a price as a flexible choice, not one fixed number: different buyers will pay different amounts, so charging each closer to what they'll pay fills more seats and earns more than a single price would.",
  },
  {
    prompt:
      "A headline claims 'the only fair thing is to charge every customer one single identical price.' How would a pricing analyst most likely treat this claim?",
    options: [
      "As an oversimplification, since one price is at the same time too high for some buyers and too low for others",
      "As obviously true and needing no evidence",
      "As something that can never be measured",
      "As true only for large companies",
    ],
    modelAnswer:
      "It is an oversimplification; because buyers have different hidden ceilings, a single price is simultaneously too high for some (who don't buy) and too low for others (who'd happily pay more), losing money at both ends.",
  },
  {
    prompt:
      "Which question is most central to what revenue management & pricing analytics actually studies?",
    options: [
      "What to charge, to whom, and when, so a business earns the most from what it has to sell",
      "Which company has the friendliest-looking logo",
      "How to design the fanciest office lobby",
      "Which company would make the best movie set",
    ],
    modelAnswer:
      "Revenue management studies what price to set, for whom, and when — treating price as a flexible tool aimed at different buyers and moments rather than one fixed number stamped on everything.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "A shop owner sets one price for a hoodie and is thrilled that almost everyone who looks at it buys instantly. Understanding why this can be a problem depends most on:",
    options: [
      "seeing that easy, instant sales signal the price sits below many buyers' hidden ceilings, leaving money on the table",
      "guessing based on the owner's personal mood",
      "the day's weather",
      "the alphabetical order of the products",
    ],
    modelAnswer:
      "Willingness to pay is the hidden ceiling each buyer has; if nearly everyone buys instantly, the price is well below many ceilings, so buyers keep a big consumer surplus that the owner could have captured — there's room to raise it.",
    skillArea: "analysis",
  },
  {
    prompt:
      "Asked 'what's the right price for our product?', a manager answers 'it depends — every buyer would pay a different amount.' This best illustrates that pricing is about:",
    options: [
      "a hidden, per-buyer ceiling, since each customer has a different willingness to pay that the seller can't directly see",
      "nothing but luck",
      "the number of shelves alone",
      "pure random chance",
    ],
    modelAnswer:
      "There is no single right price; each buyer carries a different hidden willingness to pay, so the seller is always estimating an invisible ceiling and trying to charge each customer closer to it.",
    skillArea: "inference",
  },
  {
    prompt:
      "A pharmacy and a coffee shop next to three rivals both raise prices 10%. The pharmacy's sales barely move; the coffee shop loses a third of its customers. Why would a pricing analyst say the same move helped one and hurt the other?",
    options: [
      "Because elasticity differs: the pharmacy faces stiff demand (few substitutes) so a raise earns more, while the coffee shop faces bendy demand (easy substitutes) so a raise backfires",
      "Because coffee drinkers are always unpredictable",
      "Because only large stores can change prices",
      "Because demand cannot be measured in any way",
    ],
    modelAnswer:
      "Price elasticity: stiff (inelastic) demand barely reacts so raising price earns more, while bendy (elastic) demand drops sharply so the same raise loses too many customers — the rivals next door make the coffee shop's demand bendy.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "An airline wants to charge tourists a low fare and business travelers a high fare for the same route, but fears business travelers will just buy the cheap tickets. What does the solution best illustrate about fences?",
    options: [
      "A condition on the low price (like advance purchase or a Saturday-night stay) that tourists meet but business travelers can't keeps the high payers from grabbing the cheap fare",
      "Charging two prices for the same thing is impossible",
      "Fences have nothing to do with who pays which price",
      "Lowering one fare always lowers every fare",
    ],
    modelAnswer:
      "Price discrimination needs a fence — a condition on the cheap fare that bargain-sensitive tourists happily meet but business travelers won't (advance purchase, Saturday-night stay) — so the low price doesn't leak to the people who'd pay full fare.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A parking garage charges one price all day; it's jammed and turning cars away at rush hour but nearly empty at midday. What's the better way to read this?",
    options: [
      "One fixed price is too low at the rush (sellouts, lost money) and too high at midday (empty spaces), so a price that moves earns more and smooths the load",
      "Lines at rush hour are always caused by too few entrances",
      "Keeping one price always fills a garage best",
      "How busy the garage is has nothing to do with price",
    ],
    modelAnswer:
      "Dynamic pricing: a fixed price is too low at peak (you sell out and miss eager buyers' money) and too high off-peak (empty spaces); a moving price captures peak willingness to pay and shifts some demand into the empty hours — while watching for gouging backlash.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A hotel proudly never takes more reservations than rooms, yet most nights a few rooms sit empty from no-shows. What does this best demonstrate about overbooking?",
    options: [
      "Because no-shows are predictable, booking exactly to capacity wastes perishable rooms; selling a few extra is a calculated gamble that balances empty rooms against costly bumps",
      "Overbooking is always a scam that should never be done",
      "A room left empty tonight can simply be sold tomorrow",
      "No-shows happen completely at random and can't be planned for",
    ],
    modelAnswer:
      "A room is perishable and no-shows are steady in the aggregate, so booking to capacity reliably leaves empty rooms; overbooking bets on that predictable no-show rate, balancing the two opposite mistakes — empty rooms versus costly bumps — and can soften a lost bet with voluntary buyouts.",
    skillArea: "inference",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "A mattress store keeps a permanent '$1,500, now $799!' sign on a mattress that has basically always sold for about $799. Which consideration matters most in explaining why this works on shoppers?",
    options: [
      "The crossed-out $1,500 acts as an anchor that makes $799 feel like a deal, because prices are felt against a nearby comparison",
      "Only whether the mattress is the same color as the sign",
      "How the shopper happens to feel that morning",
      "Whether the store has a nice logo",
    ],
    modelAnswer:
      "The psychology of price: a price has no meaning alone, so the high crossed-out 'original' is an anchor that makes $799 feel like a win — and it tips into deception when the anchor is a price the item never actually sold at.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A company brags that it squeezes the maximum possible price from every customer on every sale — surge fees, sneaky add-ons, fake discounts — and calls its strategy 'perfect.' How should that be understood?",
    options: [
      "As short-sighted, since each squeeze spends down goodwill and customers who feel fooled won't return, which costs more than the extra dollar",
      "As proof the company's strategy is flawless",
      "As a guarantee customers will stay loyal forever",
      "As something that can never be evaluated",
    ],
    modelAnswer:
      "Pricing trades short-term money against long-term trust; always charging the maximum spends down goodwill, and fooled or gouged customers don't come back, so knowing when not to charge the most is part of a real strategy.",
    skillArea: "inference",
  },
  {
    prompt:
      "Asked to name 'the one correct price' for a product, an analyst refuses and instead lists several things to weigh. Drawing on the unit, the strongest reason is that:",
    options: [
      "There is no single right price, so a price must balance cost, customers (their willingness to pay and elasticity), and competition rather than be one true number",
      "Cost alone always sets the one correct price, so the question is fine",
      "Whatever rivals charge is always exactly right, so just copy them",
      "A price can never be reasoned about at all",
    ],
    modelAnswer:
      "There's no single right price because buyers have a range of hidden ceilings and cost, customers, and competition pull in different directions; a real strategy holds all three in view, picks a posture (skimming, penetration, premium, value), and weighs short-term money against long-term trust.",
    skillArea: "evaluation",
  },
];

// ===========================================================================
// GENERAL — reasoning blueprint (analysis / inference / evaluation /
// deduction / induction). Shared across phases; difficulty is nudged per phase
// at generation time (see GEN_SPECS.level).
// ===========================================================================

const GENERAL_BLUEPRINT: DiagItem[] = [
  {
    prompt:
      "Consider: 'All students who studied passed the exam. Maria studied. So Maria passed.' Which unstated assumption does the argument rely on?",
    options: [
      "Maria is among the students the first statement describes.",
      "Studying is the only way to pass the exam.",
      "Maria always studies for her exams.",
      "The exam was unusually difficult.",
    ],
    modelAnswer:
      "It assumes Maria is one of the students covered by 'all students who studied' — that her studying puts her in the group described.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A survey finds 70% of people who exercise daily report good sleep, versus 30% of those who never exercise. Which conclusion is best supported?",
    options: [
      "People who exercise daily are more likely to report good sleep than those who never exercise.",
      "Exercise guarantees good sleep for everyone.",
      "Poor sleep is what causes people to stop exercising.",
      "Anyone who wants good sleep must exercise daily.",
    ],
    modelAnswer:
      "Only that daily exercisers are more likely to report good sleep — an association, not a guarantee or a proven cause.",
    skillArea: "inference",
  },
  {
    prompt: "Which source would most strengthen the claim 'this medication is safe'?",
    options: [
      "A large, peer-reviewed clinical trial.",
      "A testimonial from one satisfied customer.",
      "An advertisement produced by the manufacturer.",
      "A popular wellness blog post.",
    ],
    modelAnswer:
      "A large, peer-reviewed clinical trial — independent, systematic evidence is far stronger than a testimonial, an ad, or a blog.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "'If it rained, the streets are wet. The streets are not wet.' What necessarily follows?",
    options: [
      "It did not rain.",
      "It rained.",
      "The streets are dry for some other reason.",
      "Nothing at all follows.",
    ],
    modelAnswer:
      "It did not rain — if rain would have made the streets wet and they are not wet, then it cannot have rained.",
    skillArea: "deduction",
  },
  {
    prompt:
      "Plants given a new fertilizer grew taller than otherwise identical plants without it, all else held equal. The best-supported conclusion is:",
    options: [
      "The fertilizer probably caused the extra growth.",
      "Taller plants attract more fertilizer.",
      "Fertilizer is required for any plant growth at all.",
      "The result was pure coincidence.",
    ],
    modelAnswer:
      "Because everything else was held equal, the fertilizer probably caused the extra growth.",
    skillArea: "induction",
  },
  {
    prompt:
      "A report notes that ice-cream sales and drowning deaths rise in the same months. A careful reader should infer that:",
    options: [
      "Both may be linked to a third factor, such as hot weather.",
      "Eating ice cream causes drowning.",
      "Drowning incidents cause ice-cream sales.",
      "The data must simply be mistaken.",
    ],
    modelAnswer:
      "That both probably rise because of a shared third factor such as hot weather — correlation doesn't mean one causes the other.",
    skillArea: "inference",
  },
];

// ===========================================================================
// Seed expansion — each (instrument, phase) in all three formats
// ===========================================================================

type BaseContent = {
  instrument: Instrument;
  phase: Phase;
  baseTitle: string;
  items: DiagItem[];
};

const BASE_CONTENT: BaseContent[] = PHASE_ORDER.flatMap((phase) => {
  const subjectItems: Record<Phase, DiagItem[]> = {
    before: SUBJECT_BEFORE,
    third: SUBJECT_THIRD,
    twothirds: SUBJECT_TWOTHIRDS,
    after: SUBJECT_AFTER,
  };
  return [
    {
      instrument: "subject" as const,
      phase,
      baseTitle: `Revenue Management & Pricing Analytics Check — ${PHASE_LABEL[phase]}`,
      items: subjectItems[phase],
    },
    {
      instrument: "general" as const,
      phase,
      baseTitle: `General Reasoning Check — ${PHASE_LABEL[phase]}`,
      items: GENERAL_BLUEPRINT,
    },
  ];
});

const FORMATS: DiagFormat[] = ["mcq", "hybrid", "written"];

export const DIAGNOSTIC_SEED: DiagnosticSeed[] = BASE_CONTENT.flatMap((base) =>
  FORMATS.map((format) => ({
    instrument: base.instrument,
    phase: base.phase,
    format,
    title: `${base.baseTitle} · ${FORMAT_LABEL[format]}`,
    subtitle: PHASE_LABEL[base.phase],
    instructions: instructionsFor(base.instrument, format),
    items: base.items,
  })),
);
