// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Criminal Psychology subject-specific reasoning. Realistic
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
      "What criminal psychology is and how it thinks about crime: that offending has multiple interacting causes (personal, social, situational) rather than a single 'born evil' cause, and that the field studies behavior scientifically rather than by intuition or moral judgement.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases.",
    topicFocus:
      "Topics 1.1-1.3: what criminal psychology is; why people offend (interacting biological, psychological, and social/situational factors, opportunity, and the limits of single-cause explanations); and traits associated with psychopathy (superficial charm, manipulation, lack of remorse) and how they differ from everyday wrongdoing.",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning.",
    topicFocus:
      "Topics 1.1-1.6: causes of offending and psychopathy, PLUS offender profiling and its limits, eyewitness memory (memory is reconstructive and confident witnesses can be wrong), and interrogation and false confessions (coercive or high-pressure tactics can lead even innocent people to confess).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea.",
    topicFocus:
      "The full unit, topics 1.1-1.8: causes of offending, psychopathy, profiling, eyewitness memory, interrogation/false confessions, PLUS madness and the law (legal insanity and competence are about understanding/responsibility at the time, not merely having a diagnosis) and predicting danger (risk assessment gives probabilities, not certainties, and can err).",
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
      ? "Answer each question about criminal psychology — these reward careful reasoning about realistic cases, not memorized facts"
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
// SUBJECT — Criminal Psychology blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A reporter asks a criminal psychologist why a particular teenager shoplifted. The psychologist would most likely explain the behavior in terms of:",
    options: [
      "a mix of personal, social, and situational pressures acting on the teenager",
      "the teenager's astrological sign",
      "whether the store happened to be busy that day",
      "the reporter's personal opinion of teenagers",
    ],
    modelAnswer:
      "Criminal psychology explains offending through interacting personal, social, and situational factors, not luck, intuition, or unrelated traits.",
  },
  {
    prompt:
      "A headline claims 'most people who break the law are simply born evil.' How would a criminal psychologist most likely treat this claim?",
    options: [
      "As an oversimplification, since behavior usually has many interacting causes",
      "As obviously true and needing no evidence",
      "As something that cannot be studied at all",
      "As true only for certain personality types",
    ],
    modelAnswer:
      "It is an oversimplification; the field rejects single-cause 'born evil' explanations because offending arises from many interacting causes.",
  },
  {
    prompt:
      "Which question is most central to what criminal psychology actually studies?",
    options: [
      "Why people commit crimes and how the justice system responds to them",
      "Which lawyer charges the lowest fees",
      "How to design a more comfortable courtroom chair",
      "Which crimes make the most dramatic movies",
    ],
    modelAnswer:
      "Criminal psychology studies the causes of offending and how the justice system thinks about and responds to it.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "Over years, Dana is repeatedly charming on first meeting, lies easily to get what she wants, and shows no remorse after hurting others. These patterns are most associated with:",
    options: [
      "traits linked to psychopathy",
      "ordinary shyness",
      "a temporary bad mood",
      "simple forgetfulness",
    ],
    modelAnswer:
      "Superficial charm, manipulative lying, and lack of remorse are traits associated with psychopathy, not ordinary mood or memory.",
    skillArea: "analysis",
  },
  {
    prompt:
      "Two neighborhoods are alike except that one has far more unsupervised places for teens to gather, and it also has more youth crime. This best illustrates that offending is shaped by:",
    options: [
      "situational and social opportunity, not just individual character",
      "nothing but the weather",
      "the age of the buildings alone",
      "pure random chance",
    ],
    modelAnswer:
      "It shows offending is influenced by situational and social opportunity, not by individual character alone.",
    skillArea: "inference",
  },
  {
    prompt:
      "A student says 'people offend for exactly one reason: bad parents.' Why would a criminal psychologist push back?",
    options: [
      "Because offending typically results from several interacting causes, not a single one",
      "Because parents never influence behavior at all",
      "Because only adults can ever offend",
      "Because crime cannot be explained in any way",
    ],
    modelAnswer:
      "Single-cause explanations are too simple; offending usually results from interacting biological, psychological, and social factors.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "A witness very confidently identifies a suspect, but later evidence shows the identification was wrong. What does this best illustrate about memory?",
    options: [
      "Memory is reconstructive, so a confident witness can still be mistaken",
      "Confident witnesses are always correct",
      "Memory works like a perfect video recording",
      "Witnesses never make identification errors",
    ],
    modelAnswer:
      "Memory is reconstructive and fallible; high confidence does not guarantee accuracy, so confident witnesses can be wrong.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "An innocent, exhausted suspect is questioned for hours with repeated pressure and promises of leniency, and finally confesses. What does this scenario best demonstrate?",
    options: [
      "Coercive, high-pressure interrogation can produce false confessions even from innocent people",
      "Anyone who confesses must be guilty",
      "Long interrogations always uncover the truth",
      "Pressure has no effect on what people say",
    ],
    modelAnswer:
      "Coercive or high-pressure interrogation can lead even innocent people to confess falsely, so a confession is not proof of guilt.",
    skillArea: "inference",
  },
  {
    prompt:
      "An investigator treats an offender profile as if it names one exact guilty person. Why is that a mistake?",
    options: [
      "A profile describes likely characteristics, not a guaranteed identity",
      "Profiles are always completely accurate",
      "Profiles can only ever be wrong",
      "Profiles replace the need for any evidence",
    ],
    modelAnswer:
      "Profiling suggests probable characteristics to narrow a search; it is not a certain identification of a specific person.",
    skillArea: "analysis",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "A defendant has a diagnosed mental illness. A court is deciding a legal-insanity claim. Which consideration matters most for that legal question?",
    options: [
      "Whether, at the time of the act, the person could understand what they did or that it was wrong",
      "Only whether a diagnosis exists on paper",
      "How the public feels about the crime",
      "Whether the trial is expensive to run",
    ],
    modelAnswer:
      "Legal insanity turns on the person's understanding and responsibility at the time of the act, not merely on having a diagnosis.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A risk-assessment tool labels someone 'high risk' of reoffending. How should that result be understood?",
    options: [
      "As a probability that can be wrong, not a certainty about the future",
      "As a guarantee the person will reoffend",
      "As proof the person already committed a new crime",
      "As a fixed fact that can never change",
    ],
    modelAnswer:
      "Risk assessment gives probabilities, not certainties; a 'high risk' label can be mistaken and does not guarantee future behavior.",
    skillArea: "inference",
  },
  {
    prompt:
      "Reviewing a case, an analyst relies only on a single confident eyewitness and a 'high risk' score to declare guilt certain. Drawing on the unit, the strongest criticism is that:",
    options: [
      "Both eyewitness confidence and risk scores are fallible, so neither makes guilt certain",
      "Eyewitnesses are always reliable, so the conclusion is fine",
      "Risk scores are certainties, so the conclusion is fine",
      "Cases can never be reviewed after the fact",
    ],
    modelAnswer:
      "Eyewitness memory is reconstructive and risk scores are probabilistic; both can err, so together they cannot make guilt certain.",
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
      baseTitle: `Criminal Psychology Check — ${PHASE_LABEL[phase]}`,
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
