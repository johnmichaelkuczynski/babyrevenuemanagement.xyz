// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Financial & Managerial Analytics subject-specific reasoning.
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
      "What financial & managerial analytics is and how it thinks about a business: that a business's health has multiple interacting parts (how much money comes in, how much goes out, what's left over, and whether there's actually cash) rather than a single number like 'high sales', and that the field measures what's really happening rather than trusting gut feeling or how busy a business looks.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases.",
    topicFocus:
      "Topics 1.1-1.3: what financial & managerial analytics is; the three financial statements (income statement, balance sheet, and cash flow statement, and that profit is not the same as cash); and cost behavior (fixed vs variable costs, and that the cost per unit changes with volume so there is no single 'cost to make one').",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning.",
    topicFocus:
      "Topics 1.1-1.6: what the field is, the three financial statements, and cost behavior, PLUS break-even (the sales needed to cover total costs, and that a lower price shrinks each sale's contribution and raises the break-even point), budgets and variance (a budget is a plan, not a promise, and variance is the plan-vs-reality gap to learn from), and unit economics (whether each single sale actually makes money, since growth multiplies losses if it does not).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea.",
    topicFocus:
      "The full unit, topics 1.1-1.8: the field, the three statements, cost behavior, break-even, budgets/variance, and unit economics, PLUS forecasting and KPIs (a forecast is an estimate from past patterns, not a certainty, and you choose the few dials that matter over flattering vanity metrics) and from numbers to decisions (data informs a decision but does not make it, and you must separate the metrics that matter from vanity metrics).",
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
      ? "Answer each question about financial & managerial analytics — these reward careful reasoning about realistic business situations, not memorized facts"
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
// SUBJECT — Financial & Managerial Analytics blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A reporter asks a financial analyst why a particular business struggled even though it always had lots of customers and big sales. The analyst would most likely explain it in terms of:",
    options: [
      "a mix of how much money came in, how much went out, and whether cash was actually there",
      "whether the owner is a naturally lucky person",
      "the color of the company's logo",
      "the reporter's personal opinion of the products",
    ],
    modelAnswer:
      "Financial analytics explains a business's results through interacting measures — money in, money out, and actual cash — not luck or a single impression like how busy it looks.",
  },
  {
    prompt:
      "A headline claims 'a business with high sales is always a successful one.' How would a financial analyst most likely treat this claim?",
    options: [
      "As an oversimplification, since profit and cash depend on costs and timing, not just sales",
      "As obviously true and needing no evidence",
      "As something that can never be measured",
      "As true only for large companies",
    ],
    modelAnswer:
      "It is an oversimplification; a business with high sales can still lose money or run out of cash, so the field looks at costs and cash together, not just the sales number.",
  },
  {
    prompt:
      "Which question is most central to what financial & managerial analytics actually studies?",
    options: [
      "Whether a business is really making money, measured by what comes in, goes out, and what's left",
      "Which company has the friendliest-looking logo",
      "How to design the fanciest office lobby",
      "Which company would make the best movie set",
    ],
    modelAnswer:
      "Financial & managerial analytics studies whether a business is actually making money, using measurements of money in, money out, and cash rather than impressions.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "A company reports a healthy profit on its income statement but cannot pay this month's bills. Understanding how both can be true at once depends most on:",
    options: [
      "reading the cash flow statement too, because profit is not the same as cash",
      "guessing based on the owner's personal mood",
      "the day's weather",
      "the alphabetical order of the products",
    ],
    modelAnswer:
      "Profit on the income statement isn't cash in the bank; the cash flow statement can show money draining out even while profit looks good, so you read the statements together.",
    skillArea: "analysis",
  },
  {
    prompt:
      "Asked 'what did it cost to make one mug?', a manager answers 'it depends on how many we made.' This best illustrates that costs are shaped by:",
    options: [
      "cost behavior — fixed costs spread over volume, so the per-unit cost changes with how many you make",
      "nothing but luck",
      "the number of shelves alone",
      "pure random chance",
    ],
    modelAnswer:
      "Because fixed costs like rent spread over however many units are made, the cost per unit changes with volume, so there is no single 'cost to make one.'",
    skillArea: "inference",
  },
  {
    prompt:
      "A student says 'one number — total sales — tells you everything about a business.' Why would a financial analyst push back?",
    options: [
      "Because health depends on several measures together, since sales is not profit and profit is not cash",
      "Because sales never matter at all",
      "Because only large businesses have sales",
      "Because a business cannot be measured in any way",
    ],
    modelAnswer:
      "A single number is too simple; sales isn't profit and profit isn't cash, so you must read the three statements together.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "An owner slashes prices to sell more, stays busy all day, yet still loses money on every sale. What does this best illustrate about break-even?",
    options: [
      "A lower price shrinks each sale's contribution and raises the break-even point, so high volume can still lose money",
      "A lower price always guarantees a profit",
      "Break-even has nothing to do with price",
      "Selling more always means making money",
    ],
    modelAnswer:
      "Cutting the price lowers what each sale contributes toward fixed costs, raising the break-even point, so a busy business at too low a price can still lose money on every sale.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A team spent more than its budget on supplies, and the manager wants to punish whoever's responsible. What's the better way to read this?",
    options: [
      "A budget is a plan and the variance is a signal to ask why, not a rule broken to punish",
      "The budget was a promise that someone failed to keep",
      "Variances never carry any useful information",
      "Going over budget always means someone cheated",
    ],
    modelAnswer:
      "A budget is a plan you measure reality against; the variance is a signal to ask why (prices rose? more was made?), used to learn and adjust rather than to assign blame.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A startup's signups double every month, but each customer costs more to win and serve than they ever pay. What does this best demonstrate?",
    options: [
      "Unit economics — if each sale loses money, faster growth multiplies the losses",
      "That growth always fixes a money problem",
      "That signups are the only number that matters",
      "That costs can never be measured per customer",
    ],
    modelAnswer:
      "If a single sale loses money, growing only grows the losses; you can't 'make it up in volume' until each unit is profitable once all its costs are counted.",
    skillArea: "inference",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "A founder points to a chart of 'total users, all time' that keeps climbing as proof the business is thriving. Which consideration matters most?",
    options: [
      "Whether users actually stay, since a number that only ever rises can hide people quietly leaving",
      "Only whether the chart exists at all",
      "How the founder happens to feel that morning",
      "Whether the company has a nice logo",
    ],
    modelAnswer:
      "'Total users, all time' is a vanity metric that can only rise and may hide churn; a useful KPI like active users or retention can deliver the bad news it conceals.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A manager confidently forecasts a slow month and cuts inventory, but a large unexpected order arrives. How should that one result be understood?",
    options: [
      "A forecast is an estimate from past patterns and can be wrong, so it shouldn't be treated as a certainty",
      "As proof the business is failing",
      "As a guarantee forecasts are useless",
      "As a fixed fact that can never change",
    ],
    modelAnswer:
      "A forecast is a likely estimate built from past clues, not a promise; a missed factor can make even a confident forecast wrong, so it informs planning rather than dictating it.",
    skillArea: "inference",
  },
  {
    prompt:
      "Reviewing results, an analyst declares a business a clear success based only on big sales and a high social-media follower count. Drawing on the unit, the strongest criticism is that:",
    options: [
      "Both big sales and follower counts can mislead, so neither proves the business is profitable or has cash",
      "High sales always prove profit, so the conclusion is fine",
      "Follower counts are exact measures of profit, so the conclusion is fine",
      "Results can never be reviewed after the fact",
    ],
    modelAnswer:
      "High sales can still lose money and followers are a vanity metric; neither proves profitability or cash, which need the three statements read together.",
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
      baseTitle: `Financial & Managerial Analytics Check — ${PHASE_LABEL[phase]}`,
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
