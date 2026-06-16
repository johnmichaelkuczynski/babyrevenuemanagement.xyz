// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Hospitality Analytics subject-specific reasoning. Realistic
//     short cases about the course material; the best-supported answer is keyed
//     first.
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
      "What hospitality analytics is and how it thinks about a restaurant: that a restaurant's health has multiple interacting drivers (how many guests come, how much each spends, and what it all costs) rather than a single number like 'a full room', and that the field measures what's really happening rather than trusting gut feeling or how a night looks.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases.",
    topicFocus:
      "Topics 1.1-1.3: what hospitality analytics is; the metrics that matter (covers, table turns, the average check, and that revenue is not the same as profit); and menu engineering (judging dishes on BOTH popularity and profit, so a best-seller is not always the most valuable dish).",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning.",
    topicFocus:
      "Topics 1.1-1.6: measuring a restaurant, the key metrics, and menu engineering, PLUS demand forecasting and its limits (a forecast is an estimate from past patterns, not a certainty), pricing and yield (price is a signal and the same seat is worth more at peak demand), and guests as data (repeat guests and lifetime value often matter more than chasing only new faces).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea.",
    topicFocus:
      "The full unit, topics 1.1-1.8: measuring a restaurant, key metrics, menu engineering, forecasting, pricing/yield, and guests/loyalty, PLUS reviews and sentiment (read reviews as data at scale rather than reacting to a single opinion or one bad review) and from dashboard to decision (data informs a decision but does not make it, and you must separate the metrics that matter from flattering vanity metrics).",
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
      ? "Answer each question about hospitality analytics — these reward careful reasoning about realistic restaurant situations, not memorized facts"
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
// SUBJECT — Hospitality Analytics blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A reporter asks a hospitality analyst why a particular restaurant struggled even though it always looked busy. The analyst would most likely explain it in terms of:",
    options: [
      "a mix of how many guests came, how much each spent, and what it all cost",
      "whether the owner is a naturally lucky person",
      "the color of the restaurant's sign",
      "the reporter's personal opinion of the food",
    ],
    modelAnswer:
      "Hospitality analytics explains a restaurant's results through interacting measures — guest counts, spending per guest, and costs — not luck or a single impression like how full the room looks.",
  },
  {
    prompt:
      "A headline claims 'a packed restaurant is always a successful one.' How would a hospitality analyst most likely treat this claim?",
    options: [
      "As an oversimplification, since profit depends on spending and costs, not just a full room",
      "As obviously true and needing no evidence",
      "As something that can never be measured",
      "As true only for expensive restaurants",
    ],
    modelAnswer:
      "It is an oversimplification; a full room can still lose money, so the field looks at spending and costs together, not just how busy a place looks.",
  },
  {
    prompt:
      "Which question is most central to what hospitality analytics actually studies?",
    options: [
      "Whether a restaurant is really working, measured by its guests, spending, and costs",
      "Which restaurant has the friendliest-looking logo",
      "How to fold a dinner napkin most elegantly",
      "Which restaurant would make the best movie set",
    ],
    modelAnswer:
      "Hospitality analytics studies whether a restaurant is actually working, using measurements of guests, spending, and costs rather than impressions.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "Over several months one dish sells constantly but earns almost nothing after its ingredient costs, while a quieter dish earns a lot per plate. Looking at dishes this way is most associated with:",
    options: [
      "menu engineering, which judges dishes on both popularity and profit",
      "guessing based on the owner's personal favorite",
      "the day's weather",
      "the alphabetical order of the menu",
    ],
    modelAnswer:
      "Judging dishes by both how often they sell and how much they earn is menu engineering, which shows popularity is not the same as profit.",
    skillArea: "analysis",
  },
  {
    prompt:
      "Two restaurants serve the same number of guests, but one sells drinks and dessert while the other sells only entrées, and it earns far more. This best illustrates that results are shaped by:",
    options: [
      "how much each guest spends (the average check), not just how many guests come",
      "nothing but luck",
      "the number of chairs alone",
      "pure random chance",
    ],
    modelAnswer:
      "It shows results depend on spending per guest (the average check), not only on how many guests come.",
    skillArea: "inference",
  },
  {
    prompt:
      "A student says 'one number — total revenue — tells you everything about a restaurant.' Why would a hospitality analyst push back?",
    options: [
      "Because health depends on several metrics together, since revenue is not the same as profit",
      "Because revenue never matters at all",
      "Because only large restaurants have revenue",
      "Because a restaurant cannot be measured in any way",
    ],
    modelAnswer:
      "A single number is too simple; revenue is not profit, so you must read covers, spending, and costs together.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "A manager very confidently forecasts that tonight will be slow and staffs light, but a nearby concert fills the restaurant. What does this best illustrate about forecasting?",
    options: [
      "A forecast is an estimate from past patterns and can be wrong, especially if a factor is missed",
      "A confident forecast is always correct",
      "Forecasts predict the future perfectly",
      "Demand can never be estimated at all",
    ],
    modelAnswer:
      "Forecasts are probabilistic estimates built from past clues; missing a factor like a nearby event can make even a confident forecast wrong.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A restaurant gives the same menu to two groups — one with dollar signs, one without — and the group reading it without dollar signs spends more. What does this best demonstrate?",
    options: [
      "How a price is presented can change spending, so our pricing instincts are unreliable",
      "The food was actually different for each group",
      "Price presentation never affects behavior",
      "Guests always ignore the menu entirely",
    ],
    modelAnswer:
      "Presentation, like dropping the dollar sign, changes spending even when the prices are identical, showing pricing instincts mislead us.",
    skillArea: "inference",
  },
  {
    prompt:
      "An owner treats a loyalty program as just a giveaway and ignores what it reveals about who comes back. Why is that a mistake?",
    options: [
      "A loyalty program is data showing frequency, recency, and lifetime value, not just a discount",
      "Loyalty programs always lose money",
      "Repeat guests never matter",
      "Loyalty can never be measured at all",
    ],
    modelAnswer:
      "A loyalty program reveals how often and how recently guests return and their lifetime value; ignoring that wastes its real purpose.",
    skillArea: "analysis",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "A restaurant gets one angry one-star review. A manager is deciding how seriously to treat it. Which consideration matters most?",
    options: [
      "Whether the complaint is a recurring theme across many reviews or just a single outlier",
      "Only whether the review exists at all",
      "How the manager happens to feel that morning",
      "Whether the restaurant is expensive",
    ],
    modelAnswer:
      "What matters is whether the issue recurs across many reviews (a real pattern) versus a lone outlier; one bad review is not a catastrophe.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A dashboard flags a single slow week as a 'problem.' How should that one result be understood?",
    options: [
      "As possible noise that may not need action, not automatic proof something is wrong",
      "As a guarantee the restaurant is failing",
      "As proof the menu must be replaced immediately",
      "As a fixed fact that can never change",
    ],
    modelAnswer:
      "One slow week may be noise; data informs but does not decide, so it is not automatic proof of a real problem.",
    skillArea: "inference",
  },
  {
    prompt:
      "Reviewing results, an analyst declares a restaurant a clear success based only on a packed room and a high social-media follower count. Drawing on the unit, the strongest criticism is that:",
    options: [
      "Both a full room and follower counts can mislead, so neither proves the restaurant is profitable",
      "A packed room always proves profit, so the conclusion is fine",
      "Follower counts are exact measures of profit, so the conclusion is fine",
      "Results can never be reviewed after the fact",
    ],
    modelAnswer:
      "A full room can still lose money and followers are a vanity metric; neither proves profitability, which needs covers, spending, and costs read together.",
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
      baseTitle: `Hospitality Analytics Check — ${PHASE_LABEL[phase]}`,
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
