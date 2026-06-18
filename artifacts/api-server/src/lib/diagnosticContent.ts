// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Operations & Supply Chain Analytics subject-specific reasoning.
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
      "What operations & supply chain analytics is and how it thinks about a business: that a business is a flow of things moving through steps to a customer (not a static pile of stuff), so what matters is how smoothly things move rather than how full or busy a place looks, and that the field measures what's really happening (where things move, wait, and pile up) rather than trusting gut feeling.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases.",
    topicFocus:
      "Topics 1.1-1.3: what operations & supply chain analytics is (a business as a flow, not a pile, so busy/full is not the same as efficient); inventory (holding too much freezes cash and risks spoilage while too little risks stockouts, so there's a balance and safety stock); and the bullwhip effect (a small change in real demand gets amplified into big swings up the chain because each link only sees its neighbor's orders).",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning.",
    topicFocus:
      "Topics 1.1-1.6: a business as a flow, inventory, and the bullwhip effect, PLUS bottlenecks (a system can only go as fast as its slowest step, so improving a non-bottleneck does nothing and the bottleneck is where work piles up), waiting lines (lines form from variability and the wait explodes as you push toward 100% busy, so a little slack and a single shared line help), and demand forecasting (every forecast is wrong so you plan a range and keep a cushion rather than trusting one confident number).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea.",
    topicFocus:
      "The full unit, topics 1.1-1.8: flow, inventory, the bullwhip effect, bottlenecks, queues, and forecasting, PLUS routing and optimization (the order of stops sets the cost, finding the perfect route is hard because options explode, and optimization trades fast vs cheap vs reliable) and resilience (efficiency removes the buffers that absorb shocks, so a bone-lean chain with single points of failure is fragile, and resilience is costly insurance to be balanced not maximized).",
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
      ? "Answer each question about operations & supply chain analytics — these reward careful reasoning about realistic business situations, not memorized facts"
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
// SUBJECT — Operations & Supply Chain Analytics blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A reporter asks an operations analyst why a particular warehouse struggled even though it was always packed full and everyone looked busy. The analyst would most likely explain it in terms of:",
    options: [
      "how smoothly things actually moved through the steps, not how full or busy it looked",
      "whether the manager is a naturally lucky person",
      "the color of the company's logo",
      "the reporter's personal opinion of the products",
    ],
    modelAnswer:
      "Operations analytics explains results by how smoothly things flow through the steps — where they move, wait, and pile up — not by luck or a single impression like how full or busy a place looks.",
  },
  {
    prompt:
      "A headline claims 'a warehouse that is full and busy is always an efficient one.' How would an operations analyst most likely treat this claim?",
    options: [
      "As an oversimplification, since 'full' can mean frozen cash and 'busy' can mean clogged, not moving fast",
      "As obviously true and needing no evidence",
      "As something that can never be measured",
      "As true only for large companies",
    ],
    modelAnswer:
      "It is an oversimplification; a full warehouse can mean cash frozen in unsold stock and 'busy' can mean clogged, so what matters is how smoothly things actually move, not how full or busy it looks.",
  },
  {
    prompt:
      "Which question is most central to what operations & supply chain analytics actually studies?",
    options: [
      "Whether things move smoothly through the steps to the customer, and where they get stuck",
      "Which company has the friendliest-looking logo",
      "How to design the fanciest office lobby",
      "Which company would make the best movie set",
    ],
    modelAnswer:
      "Operations & supply chain analytics studies how a business flows — how smoothly things move through the steps to a customer and where they get stuck — rather than impressions of how full or busy it looks.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "After running out of a popular item once, a shop owner starts ordering huge quantities of everything. Understanding why this can backfire depends most on:",
    options: [
      "seeing that inventory is frozen cash, so too much costs nearly as much as too little",
      "guessing based on the owner's personal mood",
      "the day's weather",
      "the alphabetical order of the products",
    ],
    modelAnswer:
      "Inventory is money frozen in stuff, so overstocking ties up cash, space, and risks spoilage; the owner only swapped stockouts for the opposite costly mistake, since no setting removes both risks.",
    skillArea: "analysis",
  },
  {
    prompt:
      "Asked 'how full should we keep the stockroom?', a manager answers 'it depends — too much and too little both cost us.' This best illustrates that inventory is about:",
    options: [
      "a balance, since holding too much freezes cash and risks spoilage while too little risks stockouts",
      "nothing but luck",
      "the number of shelves alone",
      "pure random chance",
    ],
    modelAnswer:
      "There is no magic 'enough'; more stock cuts stockouts but raises holding costs and spoilage, so the goal is a balanced sweet spot with a safety-stock cushion sized to the item.",
    skillArea: "inference",
  },
  {
    prompt:
      "Shoppers buy only slightly more of an item, but weeks later the factory swings between huge orders and cancellations. Why would an operations analyst say the chaos came from the chain, not the shoppers?",
    options: [
      "Because the bullwhip effect amplifies a small demand change as each link, seeing only its neighbor's orders, adds cushions and batches",
      "Because shoppers are always unpredictable",
      "Because only large factories have orders",
      "Because demand cannot be measured in any way",
    ],
    modelAnswer:
      "The bullwhip effect: each link sees only its neighbor's orders, adds a safety cushion on a number that already had one, and batches, so a small real change becomes wild swings even though demand barely moved.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "A sandwich shop is slow at lunch, so the owner speeds up the already-fast wrapping station, but the customer line doesn't shrink. What does this best illustrate about bottlenecks?",
    options: [
      "A system can only go as fast as its slowest step, so improving a non-bottleneck does nothing for output",
      "Speeding up any step always speeds up the whole system",
      "Bottlenecks have nothing to do with where the line forms",
      "Making one worker faster always means more output",
    ],
    modelAnswer:
      "The slowest step (the bottleneck) sets the pace; wrapping wasn't it, so the upgrade just makes it wait more. The fix is to relieve the actual slow step where work piles up.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A manager keeps every cashier busy nearly 100% of the time to be 'maximally efficient,' yet the lines are enormous. What's the better way to read this?",
    options: [
      "Pushing toward 100% busy makes the wait explode, so a little slack is what keeps lines short",
      "Lines are always caused by too few cashiers on average",
      "Keeping servers fully busy always shortens lines",
      "Waiting time has nothing to do with how busy servers are",
    ],
    modelAnswer:
      "Lines come from variability, and as utilization nears 100% the wait explodes because there's no slack to absorb bursts; an extra server at peak or a single shared line helps despite looking less efficient.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A toy company writes 'we'll sell exactly 50,000 units' into all its holiday plans and treats it as a fact. What does this best demonstrate about forecasting?",
    options: [
      "Every forecast is wrong, so a single confident number is dangerous — you plan a range and keep a cushion",
      "A confident forecast guarantees the outcome",
      "Forecasts should always be a single exact number",
      "Demand can never be estimated at all",
    ],
    modelAnswer:
      "Every forecast is wrong; once one number hardens into plans, nobody prepares for the miss, so you forecast a range, keep safety stock, and track the error rather than trusting a single figure.",
    skillArea: "inference",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "Two drivers carry the exact same packages to the same houses, but one uses far less fuel and time. Which consideration matters most?",
    options: [
      "The order and path of the stops, since the same packages can mean very different miles",
      "Only whether the trucks are the same color",
      "How the driver happens to feel that morning",
      "Whether the company has a nice logo",
    ],
    modelAnswer:
      "Routing: even with identical packages, the order and path of stops sets the distance, fuel, and time, so a smart route loops efficiently while a careless one zig-zags and doubles the miles.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A company brags it has trimmed its chain to the bone — minimal inventory, one cheap supplier, no spare capacity — and calls it 'perfectly efficient.' How should that be understood?",
    options: [
      "As fragile, since efficiency removes the buffers that absorb shocks and creates single points of failure",
      "As proof the company is perfectly safe",
      "As a guarantee nothing can ever disrupt it",
      "As something that can never be evaluated",
    ],
    modelAnswer:
      "Efficiency cuts the very buffers that absorb a shock, so 'perfectly efficient' and 'dangerously fragile' are the same system; one cheap supplier and minimal inventory are single points of failure with no plan B.",
    skillArea: "inference",
  },
  {
    prompt:
      "Reviewing the chain, an analyst declares it excellent based only on its low costs and full trucks. Drawing on the unit, the strongest criticism is that:",
    options: [
      "Low cost and full trucks can hide fragility, so neither proves the chain can survive a disruption",
      "Low costs always prove a chain is robust, so the conclusion is fine",
      "Full trucks are an exact measure of resilience, so the conclusion is fine",
      "A chain can never be reviewed after the fact",
    ],
    modelAnswer:
      "Squeezing for low cost and full trucks removes the buffers that absorb shocks, so neither proves resilience; surviving disruption needs slack, backups, and no single points of failure, which efficiency hides.",
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
      baseTitle: `Operations & Supply Chain Analytics Check — ${PHASE_LABEL[phase]}`,
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
