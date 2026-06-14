import { db } from "@workspace/db";
import {
  topicsTable,
  lecturesTable,
  assignmentsTable,
  problemsTable,
  seedMetaTable,
} from "@workspace/db";
import { eq, sql, and, like, notInArray } from "drizzle-orm";
import { logger } from "./logger";

// Content version of the seeded curriculum. BUMP THIS whenever the TOPICS or
// ASSIGNMENTS content below changes. On boot, seedIfEmpty compares this against
// the value stored in seed_meta; a mismatch forces a full re-seed, so content
// edits self-heal in every environment (including a republished production)
// without a manual database wipe.
const SEED_CONTENT_VERSION = "2026-06-14-criminal-psychology-for-children-v1";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Criminal Psychology for Everyone
  {
    slug: "what-criminal-psychology-is",
    title: "What criminal psychology is",
    weekNumber: 1,
    blurb: "Criminal psychology asks why people break the rules — and most of what TV taught you about it is a myth.",
    lectureTitle: "1.1 What criminal psychology is (mind, crime, and the myths)",
    body: `# What criminal psychology is

Almost everything most people "know" about criminals comes from movies and crime shows. Those stories are exciting, but they're mostly wrong. **Criminal psychology** is the real, careful study of the same question those shows pretend to answer: why do some people break the rules, and what is actually going on in their minds when they do?

## A science of why people break rules

Criminal psychology is a science, which means it doesn't run on hunches or scary music. It uses evidence — interviews, records, careful studies of many people — to ask things like: *why* did someone offend, *how* do investigators question a witness fairly, and *can* we tell who might be dangerous later? The goal isn't to excuse anyone. It's to understand what's really happening so we can be both safer and fairer.

## Crime is a label, not a feeling

Here's something surprising: a "crime" isn't one thing inside a person's head. It's a **label** that a society puts on certain actions. The exact same act can be a crime in one place or time and perfectly legal in another. So criminal psychologists separate two questions that get mixed up: what the *law* forbids, and what is going on in the *mind* of the person who broke it. Keeping those apart is the first habit of clear thinking in this field.

## The myths TV taught you

Crime shows sell us some powerful myths: that you can spot a criminal by their face, that one brilliant detective can "read" a killer in five minutes, that everyone who breaks the law is a monster or a genius. None of these hold up. Most offending is ordinary and messy, most offenders are not masterminds, and you cannot tell who has broken the law by looking at them. A big part of this course is **un-learning** those myths.

## Why this matters

Getting this right isn't just for police or lawyers. The same ideas decide whether an innocent person goes to prison, whether a witness is believed, and whether someone gets help instead of just punishment. When the public believes myths, real people get hurt — the wrong person blamed, the dangerous person missed. Clear thinking about crime is a kind of fairness everyone has a stake in.

## In the real world

Over a hundred years ago, a doctor named Cesare Lombroso claimed he could identify "born criminals" by their faces — the shape of a jaw, the size of an ear. People believed it for decades. Careful studies later showed it was completely false: there is no "criminal look." Lombroso's mistake is a perfect warning for this whole course — an idea can feel obvious, sound scientific, and still be flatly wrong until someone actually checks it.`,
  },
  {
    slug: "why-people-offend",
    title: "Why people offend",
    weekNumber: 1,
    blurb: "No single thing makes a criminal — offending grows from a tangle of biology, upbringing, situation, and choice.",
    lectureTitle: "1.2 Why people offend (nature, nurture, and choice)",
    body: `# Why people offend

When something terrible happens, everyone wants one simple reason: bad genes, bad parents, bad friends, a bad choice. The honest answer is that there is **no single cause.** Offending grows out of many things stacked together — what a person is born with, the world that shaped them, the situation they're in, and the choices they make. This section is about holding all of those at once.

## Nature: the part you're born with

People are born different. Some are naturally more impulsive, more fearless, or quicker to anger; some find it harder to feel another person's pain. These differences come partly from biology — the brain and body you inherit. But "born with a higher risk" is **not** the same as "born a criminal." Most people with a risky temperament never break a serious law. Nature loads some dice; it does not decide the roll.

## Nurture: the world that shapes you

The world a person grows up in matters enormously. Harsh or neglectful homes, violence nearby, poverty, and falling in with rule-breaking friends all push the odds up. A child copies what they see and learns what "normal" looks like. None of this forces anyone to offend, but it shapes the path that feels available to them. Change the surroundings and you often change the outcome — which is exactly why this part gives us hope.

## The situation and the choice

Even with the same person, the **situation** can tip the scales: a crowd, an opportunity, alcohol, a moment of rage, or simply believing no one is watching. On top of all of that sits a real **choice.** Criminal psychology takes both seriously — it explains the pressures pushing on a person without pretending those pressures pulled the trigger by themselves. Explaining is not the same as excusing.

## Risk is not destiny

Put it together and you get the field's most important idea: these are **risk factors**, not switches. More risk factors mean higher odds, the way more rain means a higher chance of flooding — not a guarantee. Most children who face serious hardship never become offenders, and some people with few risk factors still do. Anyone who promises a single, certain cause of crime is selling a myth.

## In the real world

Researchers have followed thousands of children for decades, tracking who did and didn't get into serious trouble. The clear result: kids facing many risk factors — harsh homes, poverty, rough neighborhoods — were *more likely* to offend, but the **majority still did not.** Many of those "high-risk" children grew into steady, law-abiding adults, often thanks to one stable adult, a school that worked, or a turn of luck. Risk raises the odds; it never writes the ending.`,
  },
  {
    slug: "inside-the-psychopath",
    title: "Inside the psychopath",
    weekNumber: 1,
    blurb: "A psychopath isn't a movie monster — it's a real pattern of charm, fearlessness, and a missing alarm for guilt.",
    lectureTitle: "1.3 Inside the psychopath (the mind without conscience)",
    body: `# Inside the psychopath

No word in this field is more misused than **psychopath.** In movies it means a wild-eyed killer. In real criminal psychology it means something far more specific — and, in some ways, far more unsettling: a person who can be calm, charming, and completely in control, while missing the inner alarm that makes the rest of us feel guilt and fear.

## What a psychopath actually is

A psychopath shows a particular **pattern**, not a single dramatic act. The pattern includes surface charm, a huge ego, smooth lying, using people without caring, and very little remorse or guilt. They often understand right and wrong perfectly well — they just don't *feel* bad about crossing the line. It's less "out of control" and more "missing a brake other people have."

## The missing alarm

Most of us carry a built-in alarm: do something cruel and we feel a jolt of guilt; face danger and we feel fear that makes us cautious. In psychopathy, that alarm is turned way down. With weak guilt, hurting someone barely registers. With weak fear, threats and punishments that would stop most people simply don't bite. That quiet alarm is why a psychopath can stay icy calm in moments that would shake anyone else.

## Not the same as 'violent'

Here's the myth-buster: psychopath does **not** mean violent, and most violent crime is *not* committed by psychopaths. Plenty of people with strong psychopathic traits never seriously break the law at all — some channel the boldness and cool nerves into high-pressure jobs. The traits raise the risk of certain harms, especially cold, planned ones, but "psychopath" and "criminal" are two different circles that only partly overlap.

## Measuring it carefully

Because the word is so loaded, professionals refuse to diagnose it from a vibe. They use a careful **checklist**, scoring specific traits only after long interviews and a review of someone's actual record. A single trait means little; it's the whole pattern, well documented, that counts. This caution is the opposite of the TV detective who "just knows" — and it's what keeps a dangerous label from being thrown around carelessly.

## In the real world

The psychologist Robert Hare spent years building exactly that kind of checklist so that "psychopath" would mean something precise instead of an insult. Using it, researchers found something the movies miss: people who score high on psychopathic traits turn up not only in prisons but in ordinary workplaces — confident, charming, and climbing the ladder. The lesson is that the real pattern is quieter, more common, and more complicated than any movie monster.`,
  },
  {
    slug: "profiling-the-offender",
    title: "Profiling: reading the crime",
    weekNumber: 1,
    blurb: "A profile is an educated guess about an unknown offender, built from clues in how a crime was carried out.",
    lectureTitle: "1.4 Profiling (reading the crime to find the person)",
    body: `# Profiling: reading the crime

This is the part everyone pictures: a brilliant expert glances at a crime scene and announces exactly who did it. The real thing — **offender profiling** — is more careful, more limited, and a lot more honest than the show. It's the art of using clues in *how* a crime was done to make educated guesses about the unknown person who did it.

## A crime scene tells a story

Every crime leaves behind more than physical evidence; it leaves behind **behavior.** Was it carefully planned or sudden and messy? Did the offender seem to know the place? Was anything taken, staged, or hidden? Those behavioral clues hint at the kind of person involved — their habits, their level of planning, maybe how familiar they were with the victim or location. Reading that story is the heart of profiling.

## From clues to a profile

A profiler turns those clues into a set of **likely** features: perhaps someone local, organized, with a job that fits the timing — a sketch of probabilities, not a name. Crucially, this works best for narrowing a long list of suspects, not conjuring one out of thin air. A good profile says "look harder at people who fit *this* shape," helping investigators spend their limited time where it's most likely to pay off.

## Educated guess, not magic

A profile is a set of **odds**, and odds are sometimes wrong. Profilers are guessing about an unknown person from limited clues, so a profile is a tool to point attention — never proof, and never a substitute for evidence. The danger comes when people forget that and treat a profile as if it were a fingerprint. Used humbly, it helps; used as certainty, it misleads.

## When profiling goes wrong

The biggest risk is **tunnel vision**: once investigators picture a certain kind of offender, they can start ignoring anyone who doesn't match — even the real culprit. A profile that's confidently wrong is worse than no profile at all, because it actively steers people away from the truth. That's why careful investigators treat a profile as one hint among many and stay ready to drop it the moment the evidence disagrees.

## In the real world

During the 2002 Washington-area sniper case, several experts predicted the offender was a lone white man — a profile that matched the usual pattern. The actual offenders were two Black men working together, one of them a teenager. The profile, stated too confidently, may have helped them slip past attention. It's a sharp reminder of this section's lesson: a profile is an educated guess, valuable as a hint and dangerous as a certainty.`,
  },
  {
    slug: "eyewitness-memory",
    title: "Eyewitnesses and memory",
    weekNumber: 1,
    blurb: "Memory isn't a video recording — it's rebuilt each time, which is why confident witnesses can still be wrong.",
    lectureTitle: "1.5 Eyewitnesses, memory, and why we get it wrong",
    body: `# Eyewitnesses and memory

"I saw it with my own eyes" sounds like the strongest evidence there is. In court, an eyewitness pointing across the room is incredibly powerful. But here is one of the most important — and most troubling — findings in all of criminal psychology: human memory is **far less reliable** than it feels, and a witness can be completely honest, completely confident, and completely wrong.

## Memory is rebuilt, not replayed

We *feel* like memory is a video recording we play back. It isn't. Each time you remember something, your brain **rebuilds** it from scraps, filling the gaps with what seems to make sense. That rebuilding usually works fine for daily life — but it means memories can quietly change, blend, or gain details that were never there, without you noticing a thing. The confident feeling stays the same even when the memory has shifted.

## How memories get bent

Memories of a crime are especially fragile because the moment is brief, fast, and frightening. Worse, the memory can be **bent afterward** by small things: a leading question, a comment from another witness, a photo seen on the news. Even the wording of a question — "how *fast* was the car going when it *smashed*?" — can nudge a witness toward remembering it differently. The memory feels like theirs, but part of it was planted later.

## Confidence is not accuracy

People naturally assume a confident witness is an accurate one. Research shows the link between **confidence and accuracy is weak**, and confidence can be pumped up after the fact — a simple "good, you got him" from an officer can turn a shaky guess into rock-solid certainty in the witness's own mind. So a witness's sureness, by itself, tells us surprisingly little about whether they're right.

## Lineups done right

The good news: knowing how memory fails tells us how to **protect** it. Show suspects one at a time rather than all together; make sure the person running the lineup doesn't know who the suspect is, so they can't nudge; record how sure the witness was *before* anyone reacts. These careful steps don't make memory perfect, but they keep us from accidentally corrupting it — turning a fragile clue into a fairer one.

## In the real world

When DNA testing began freeing people who had been wrongly convicted, investigators looked for what had gone wrong in their cases. The single most common cause, appearing in around **seven out of ten** of those wrongful convictions, was **mistaken eyewitness identification** — honest witnesses, certain they had the right person, who simply did not. Few findings show more clearly why "I saw it myself" must be handled with great care.`,
  },
  {
    slug: "interrogation-and-confession",
    title: "Interrogation and false confessions",
    weekNumber: 1,
    blurb: "It sounds impossible to confess to something you didn't do — but pressure, fear, and clever questioning make it happen.",
    lectureTitle: "1.6 Interrogation, confession, and the problem of false confessions",
    body: `# Interrogation and false confessions

A confession feels like the end of the story. Why would anyone admit to a crime they didn't commit? Surely only the guilty confess. Yet one of the most important findings in criminal psychology is that **innocent people confess** to serious crimes more often than anyone wants to believe — and understanding *why* changes how we should treat every confession.

## Why we question suspects

Questioning a suspect is a normal, necessary part of investigating a crime — investigators need to understand what happened and from whom. The trouble starts when questioning shifts from *finding out the truth* to *getting a confession.* Once an interrogator is sure they already have the right person, the goal can quietly change from learning what happened to proving what they already believe.

## How pressure builds

A long interrogation can become intensely stressful: hours in a small room, repeated accusations, claims of evidence that may not exist, and hints that confessing is the only way out. Most people picture themselves staying strong. But under enough exhaustion, fear, and pressure — especially for someone young, tired, or easily led — the short-term relief of "just making it stop" can start to outweigh the long-term danger of admitting something untrue.

## Why innocent people confess

False confessions usually come in a few flavors. Sometimes a person confesses just to **end the pressure**, planning to take it back later. Sometimes, after hours of being told there's "proof," they start to **doubt their own memory** and wonder if they could have done it. The young, the frightened, and people who struggle to understand their situation are especially at risk. The confession is real words, but it's the *pressure* talking, not the truth.

## Catching false confessions

Because confessions are so convincing, protecting against false ones matters enormously. The strongest safeguard is simple: **record the entire interrogation**, start to finish, so others can see how the confession was produced, not just hear the final words. We can also check whether the confession contains details only the real offender could know — and whether those details came from the suspect or were accidentally fed to them by the questioners.

## In the real world

When DNA evidence began overturning wrongful convictions, researchers were stunned to find that roughly **one in four** of those innocent people had **confessed or incriminated themselves.** Many of the confessions were detailed and convincing — which is exactly the problem. Their existence proves the uncomfortable lesson of this section: a confession is powerful evidence, but it is not automatic proof, and how it was obtained matters as much as what it says.`,
  },
  {
    slug: "insanity-defense",
    title: "Madness and the law",
    weekNumber: 1,
    blurb: "The law treats a person differently when illness, not free choice, drove the act — but legal 'insanity' is rarer and stricter than people think.",
    lectureTitle: "1.7 Madness and the law (the insanity defense)",
    body: `# Madness and the law

People love to argue about the **insanity defense** — usually believing it's an easy trick criminals use to "get off." Almost everything in that belief is wrong. Legal insanity is rare, hard to prove, and rarely means going free. To understand it, we have to start with a deeper question: when is a person truly *to blame* for what they did?

## Blame needs a choosing mind

Our whole idea of punishment rests on a quiet assumption: that the person **chose** to do wrong and understood what they were doing. That's why we treat a small child, or someone who acted in their sleep, differently — we sense they couldn't really choose. The insanity defense extends that same logic to severe mental illness: if an illness, not a free choice, drove the act, then ordinary blame may not fit.

## What 'insanity' means in court

"Insanity" in court is a **legal** test, not a medical one, and it's much narrower than just "having a mental illness." Typically a person must have been so affected by serious illness that they **did not understand what they were doing, or did not know it was wrong**, at the moment of the act. Most people with mental illness — even serious illness — would never meet that high bar. Being unwell is not the same as being legally insane.

## Rare, not a loophole

The "easy escape" story collapses against the numbers. The insanity defense is **raised in only a tiny fraction** of serious cases, and it **succeeds in only a fraction of those.** It's hard to prove, requires expert testimony, and is often risky for the defendant. Far from a clever shortcut, it's one of the least-used and least-successful defenses there is.

## Not guilty is not 'set free'

The biggest myth of all: that "not guilty by reason of insanity" means walking out the door. In reality, those found not guilty for this reason are usually sent to a **secure hospital**, often for a long time — sometimes longer than a prison sentence would have been — and released only when experts and a court judge they're no longer a danger. It isn't freedom; it's a different kind of confinement aimed at treatment as well as safety.

## In the real world

Studies that actually counted insanity pleas found they appear in well under **one percent** of felony cases, and succeed only a small share of the time — usually in cases of genuinely severe, well-documented illness. The public consistently guesses the number is many times higher. That huge gap between belief and reality is the heart of this section: the insanity defense people are angry about is mostly a myth, not a fact.`,
  },
  {
    slug: "predicting-danger",
    title: "Predicting danger (capstone)",
    weekNumber: 1,
    blurb: "Can we tell who will be dangerous again? Partly, carefully — and the whole course comes together in how we try.",
    lectureTitle: "1.8 Predicting danger, and what comes next (Capstone)",
    body: `# Predicting danger (capstone)

We end on the hardest, highest-stakes question in the whole field: **can we predict who will be dangerous in the future?** A parole board, a judge, a doctor deciding whether to release someone — all of them are making a prediction about something that hasn't happened yet. Everything in this course comes together here, including its deepest limits.

## The hardest question

Predicting a person's future behavior is genuinely difficult, because people are not machines and the future is not fixed. Most people who have offended will **not** offend again, so even a "risky" person is usually a story of probabilities, not certainty. Anyone who claims they can say for sure what a specific individual will do has wandered back into the TV myths we started with.

## Gut feeling vs. checklists

For a long time, experts predicted danger by **gut feeling** — and studies showed they often did little better than a coin flip, while quietly absorbing their own biases. The improvement came from **structured tools**: checklists of factors that research links to re-offending, scored carefully and consistently. These structured methods aren't perfect, but they reliably beat gut judgment — echoing the psychopath checklist, where careful measurement beat "just knowing."

## The cost of being wrong (both ways)

Every prediction can fail in two directions, and both hurt. Call a safe person dangerous (a **false alarm**) and you keep someone locked up who would have been fine. Call a dangerous person safe (a **miss**) and someone may get hurt. There is no setting that removes both risks at once, so society has to decide, openly and fairly, which mistake it's more willing to make — a values question, not just a science one.

## Tying the course together

Look back and you'll see one thread through all eight topics: **resist the simple, confident story.** There's no criminal face, no single cause, no movie-monster psychopath, no flawless profile, no perfect memory, no automatic confession, no easy insanity loophole, and no certain prediction. Criminal psychology replaces tidy myths with careful, honest, evidence-based thinking — which is harder, but it's the only kind that's actually fair.

## The biggest questions stay open

And plenty stays unsolved. How do we balance safety against second chances? How much can people truly change? How do we keep our tools from carrying old biases? Criminal psychology gives us better questions and more honest answers — not final ones. The most useful thing you can carry out of this course is a single habit: whenever someone offers a simple, certain story about crime, ask, "Is that real, or is it a myth?"`,
  },
];

type SeedAssignment = {
  kind: "homework" | "test" | "midterm" | "final";
  title: string;
  weekNumber: number;
  isTimed: boolean;
  timeLimitMinutes: number | null;
  instructions: string;
  problems: Array<{
    topicSlug: string;
    prompt: string;
    correctAnswer: string;
    explanation: string;
    hint?: string;
  }>;
};

const ASSIGNMENTS: SeedAssignment[] = [
  {
    kind: "homework",
    title: "Homework 1.1 — Myths, causes, psychopathy, and profiling",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. There's no need for any math — just explain your thinking clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-criminal-psychology-is",
        prompt:
          "A friend says, 'You can tell who's a criminal just by looking at their face — some people just have that look.' Use what criminal psychology actually shows to explain why this is a myth. (3–5 sentences.)",
        correctAnswer:
          "There is no 'criminal look,' and the idea that you can spot an offender by their face is one of the oldest debunked myths in the field. Over a hundred years ago Cesare Lombroso claimed he could identify 'born criminals' by features like jaw shape or ear size, and people believed it for decades. Careful studies later showed it was completely false — appearance simply doesn't predict who breaks the law. So my friend is repeating an idea that feels obvious but has actually been checked and disproven.",
        explanation:
          "Full credit: states there is no 'criminal look,' identifies the belief as a myth (e.g. Lombroso's 'born criminal'), and notes that careful study disproved it — appearance doesn't predict offending.",
      },
      {
        topicSlug: "why-people-offend",
        prompt:
          "Two children grow up in the same rough, high-crime neighborhood. One becomes an offender as an adult; the other becomes a steady, law-abiding worker. Use the idea of 'risk factors, not switches' to explain how that's possible. (3–5 sentences.)",
        correctAnswer:
          "A tough neighborhood is a risk factor, which raises the odds of offending but does not guarantee it — it's like more rain raising the chance of a flood, not causing one for certain. Offending grows out of many things stacked together: temperament, home life, friends, the situation, and real choices, not one single cause. So two children in the same place can end up very differently because the rest of their stacks differ — perhaps one had a stable adult, a school that worked, or a lucky turn. In fact, most children who face serious hardship never become offenders at all.",
        explanation:
          "Full credit: explains risk factors raise odds rather than determine outcomes, notes offending has multiple stacked causes (not one), and recognizes that most high-risk children do not offend.",
        hint: "Think about whether a single risk factor is a 'switch' that decides the outcome, or just one thing that changes the odds.",
      },
      {
        topicSlug: "inside-the-psychopath",
        prompt:
          "Someone says, 'A psychopath is basically just a violent killer — they're out of control.' Using the real meaning of psychopathy, explain two things this gets wrong. (3–5 sentences.)",
        correctAnswer:
          "First, psychopathy is not the same as being violent: most violent crime is not committed by psychopaths, and many people with strong psychopathic traits never seriously break the law at all. Second, 'out of control' is backwards — psychopathy is marked by being calm, charming, and in control while missing the inner alarm that produces guilt and fear. The real pattern is surface charm, smooth lying, using people, and very little remorse, not wild rage. So the movie image of an out-of-control monster misses both what psychopathy is and how common and quiet it can be.",
        explanation:
          "Full credit: corrects (1) psychopath ≠ violent (most violence isn't psychopaths; many never offend) and (2) it's a cold, controlled pattern with a missing guilt/fear 'alarm,' not being out of control.",
      },
      {
        topicSlug: "profiling-the-offender",
        prompt:
          "On TV, an expert glances at a crime scene and instantly names the culprit. Explain what real offender profiling actually does, and why treating a profile as certainty is dangerous. (3–5 sentences.)",
        correctAnswer:
          "Real profiling doesn't name a culprit; it uses clues in how a crime was carried out — how planned or messy it was, whether the offender knew the place — to make educated guesses about the likely kind of person. A profile is a set of odds meant to narrow a list of suspects, not proof and never a substitute for evidence. Treating it as certainty is dangerous because it can cause tunnel vision, where investigators ignore anyone who doesn't fit the picture — even the real offender. A confidently wrong profile is worse than none, because it actively steers people away from the truth.",
        explanation:
          "Full credit: describes profiling as educated guesses from behavioral clues that narrow suspects (not a name/proof), and explains the danger of certainty/tunnel vision steering investigators wrong.",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Memory, confessions, the law, and prediction",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. No math is required — explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "eyewitness-memory",
        prompt:
          "A witness points across the courtroom and says, 'I'm absolutely certain that's the man — I'll never forget that face.' Explain why this confident statement is weaker evidence than it sounds. (3–5 sentences.)",
        correctAnswer:
          "Memory isn't a video recording that plays back perfectly; the brain rebuilds a memory each time, filling gaps with what seems to make sense, so memories can quietly change without the person noticing. That's why a witness can be completely honest and completely confident yet still be wrong. The link between confidence and accuracy is actually weak, and confidence can be pumped up afterward — even a simple 'good, you got him' can turn a shaky guess into rock-solid certainty. So the witness's sureness, by itself, tells us surprisingly little about whether they're right.",
        explanation:
          "Full credit: explains memory is reconstructed (not replayed) and can change, that confident witnesses can be honestly wrong, and that confidence is weakly linked to accuracy / can be inflated after the fact.",
      },
      {
        topicSlug: "interrogation-and-confession",
        prompt:
          "Many people say, 'I would never confess to something I didn't do.' Explain why innocent people sometimes do confess during interrogations. (3–5 sentences.)",
        correctAnswer:
          "A long interrogation can become intensely stressful — hours in a small room, repeated accusations, claims of evidence that may not exist, and hints that confessing is the only way out. Under enough exhaustion, fear, and pressure, the short-term relief of just making it stop can start to outweigh the long-term danger of admitting something untrue. Some people confess to end the pressure, planning to take it back later; others, told over and over there's 'proof,' begin to doubt their own memory. The young, the frightened, and the easily led are especially at risk, which is why a confession is real words but can be the pressure talking, not the truth.",
        explanation:
          "Full credit: explains interrogation pressure/exhaustion, the pull to 'make it stop,' and self-doubt about memory, and notes vulnerable people (young, frightened, suggestible) are most at risk.",
        hint: "Think about what hours of intense pressure can make someone want in the short term, even at a long-term cost.",
      },
      {
        topicSlug: "insanity-defense",
        prompt:
          "A news comment claims, 'The insanity defense is just an easy loophole — criminals use it all the time to walk free.' Explain two ways this is wrong. (3–5 sentences.)",
        correctAnswer:
          "First, it isn't common or easy: the insanity defense is raised in well under one percent of serious cases and succeeds in only a fraction of those, because it's hard to prove and requires expert testimony. Legal 'insanity' is also a narrow test — usually the person must have been so affected by severe illness that they didn't understand what they were doing or didn't know it was wrong — so simply having a mental illness doesn't qualify. Second, 'walk free' is a myth: people found not guilty by reason of insanity are usually sent to a secure hospital, often for a long time, sometimes longer than a prison term. So it's neither an easy loophole nor a ticket out the door.",
        explanation:
          "Full credit: corrects (1) it's rare/hard to prove and narrowly defined (not 'all the time'), and (2) success usually means secure hospital confinement, not freedom.",
      },
      {
        topicSlug: "predicting-danger",
        prompt:
          "A parole board must decide whether someone is likely to offend again. Explain why structured checklists tend to beat 'gut feeling,' and why even a good prediction can never be a guarantee. (3–5 sentences.)",
        correctAnswer:
          "For a long time experts predicted danger by gut feeling and often did little better than a coin flip, while quietly absorbing their own biases. Structured tools — checklists of factors that research links to re-offending, scored carefully and consistently — reliably do better, much like the psychopathy checklist where careful measurement beat 'just knowing.' But even a good prediction is only about odds, because people aren't machines and the future isn't fixed; in fact most people who have offended don't offend again. So a structured tool can sharpen the estimate, but it can never turn a probability into a certainty about one specific person.",
        explanation:
          "Full credit: explains structured tools beat biased gut judgment, and that prediction deals in probabilities (people aren't machines; most don't reoffend), so no method guarantees an individual outcome.",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Criminal Psychology for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-criminal-psychology-is",
        prompt:
          "Explain what criminal psychology is as a science, and why it insists that 'crime is a label, not a feeling.' Why does keeping that distinction matter? (4–6 sentences.)",
        correctAnswer:
          "Criminal psychology is the careful, evidence-based study of why people break rules and what's going on in their minds when they do — it relies on interviews, records, and studies of many people rather than hunches. Saying 'crime is a label, not a feeling' means a crime isn't one single thing inside a person's head; it's a label a society puts on certain actions, and the same act can be a crime in one place or time and legal in another. So the field keeps two questions apart: what the law forbids, and what's going on in the mind of the person who broke it. That distinction matters because it keeps us from assuming that breaking a law reveals one fixed kind of mind, which is the first habit of clear, fair thinking about crime.",
        explanation:
          "Full credit: defines criminal psychology as the evidence-based study of offending/minds, explains 'crime as a societal label' (varies by place/time), and why separating law from mind supports clear, fair reasoning.",
      },
      {
        topicSlug: "why-people-offend",
        prompt:
          "Explain why criminal psychology rejects any single cause of crime, using the ideas of nature, nurture, situation, and choice. Why is 'risk is not destiny' the key takeaway? (4–6 sentences.)",
        correctAnswer:
          "Offending grows out of many things stacked together, not one cause. Nature is the part you're born with — a more impulsive or fearless temperament can raise risk, but never decides the outcome. Nurture is the world that shapes you, where harsh homes, poverty, or rule-breaking friends push the odds up. On top of that, the situation can tip the scales in a moment, and a real choice still sits at the center. 'Risk is not destiny' is the key takeaway because these are risk factors, not switches: more of them means higher odds, the way more rain means a higher flood chance, yet most people facing serious hardship never offend.",
        explanation:
          "Full credit: explains nature, nurture, situation, and choice as stacked contributors (no single cause) and frames them as odds-raising risk factors, concluding most high-risk people don't offend.",
      },
      {
        topicSlug: "inside-the-psychopath",
        prompt:
          "Describe what psychopathy actually is, including the idea of a 'missing alarm,' and explain why professionals measure it with a careful checklist instead of a gut feeling. (4–6 sentences.)",
        correctAnswer:
          "Psychopathy is a specific pattern, not a single dramatic act: surface charm, a large ego, smooth lying, using people without caring, and very little remorse or guilt. The 'missing alarm' is the core: most people feel a jolt of guilt after cruelty and fear in the face of danger, but in psychopathy that alarm is turned way down, so cruelty barely registers and threats or punishments don't bite. That's why such a person can stay icy calm in moments that would shake anyone else. Professionals refuse to diagnose it from a vibe because the word is so loaded; they use a careful checklist, scoring specific traits only after long interviews and a review of the person's real record. A single trait means little — it's the whole, well-documented pattern that counts, which keeps a dangerous label from being thrown around carelessly.",
        explanation:
          "Full credit: describes the psychopathy pattern (charm, manipulation, low remorse), explains the weak guilt/fear 'alarm,' and justifies careful checklist measurement over gut judgment for a loaded label.",
      },
      {
        topicSlug: "profiling-the-offender",
        prompt:
          "Explain how offender profiling works — from crime-scene behavior to a profile — and explain the biggest risk that comes from trusting a profile too much. (4–6 sentences.)",
        correctAnswer:
          "Profiling starts from the fact that a crime leaves behind behavior, not just physical evidence: whether it was planned or messy, whether the offender seemed to know the place, what was taken or staged. A profiler turns those clues into a set of likely features — perhaps someone local and organized — producing a sketch of probabilities rather than a name. Used well, this narrows a long suspect list and helps investigators spend limited time where it's most likely to pay off. The biggest risk is tunnel vision: once people picture a certain kind of offender, they can start ignoring anyone who doesn't match, even the real culprit. A confidently wrong profile is worse than none, so careful investigators treat it as one hint among many and drop it the moment evidence disagrees.",
        explanation:
          "Full credit: explains profiling as reading behavioral clues into probable offender features that narrow suspects, and identifies tunnel vision/overconfidence as the central danger.",
      },
      {
        topicSlug: "eyewitness-memory",
        prompt:
          "Explain why eyewitness memory is less reliable than it feels, and describe two ways a lineup can be run to protect a witness's memory. (4–6 sentences.)",
        correctAnswer:
          "Memory feels like a video recording, but it's actually rebuilt each time we remember, with the brain filling gaps using what seems to make sense — so memories can change, blend, or gain details that were never there. This makes memories of a crime fragile, and they can be bent afterward by a leading question, another witness's comment, or a photo in the news. Because of this, an honest, confident witness can simply be wrong, and confidence is only weakly tied to accuracy. To protect memory, a lineup can show suspects one at a time rather than all together, and it can be run by someone who doesn't know who the suspect is, so they can't nudge the witness. Recording how sure the witness was before anyone reacts also keeps a fragile clue from being accidentally corrupted.",
        explanation:
          "Full credit: explains memory as reconstructed/suggestible and confidence as weakly linked to accuracy, and gives valid safeguards (sequential lineup, blind administrator, record initial confidence).",
      },
      {
        topicSlug: "interrogation-and-confession",
        prompt:
          "Explain why innocent people sometimes give false confessions, and describe the strongest safeguard against false confessions and why it helps. (4–6 sentences.)",
        correctAnswer:
          "Questioning becomes dangerous when its goal shifts from finding the truth to getting a confession, especially once an interrogator is sure they already have the right person. A long, intensely stressful interrogation — repeated accusations, claims of evidence, hints that confessing is the only way out — can make the short-term relief of 'making it stop' outweigh the long-term danger of admitting something untrue. Some innocent people confess just to end the pressure; others, told there's 'proof,' begin to doubt their own memory, and the young or easily led are especially at risk. The strongest safeguard is to record the entire interrogation from start to finish, so others can see how the confession was produced, not just hear the final words. That also lets investigators check whether key details came from the suspect or were accidentally fed to them.",
        explanation:
          "Full credit: explains pressure/exhaustion and self-doubt driving false confessions (and vulnerable groups), and identifies full recording of the interrogation as the key safeguard, with why it helps.",
      },
      {
        topicSlug: "insanity-defense",
        prompt:
          "Explain the reasoning behind the insanity defense (why blame depends on a 'choosing mind'), and correct the common myth that it's an easy loophole that lets people go free. (4–6 sentences.)",
        correctAnswer:
          "Our whole idea of punishment rests on the assumption that a person chose to do wrong and understood what they were doing, which is why we treat a small child or someone acting in their sleep differently. The insanity defense extends that logic: if a severe illness, not a free choice, drove the act, then ordinary blame may not fit. But legal 'insanity' is a narrow test, not just 'having a mental illness' — usually the person must have been so affected that they didn't understand what they were doing or didn't know it was wrong. It's also rare and hard to prove, raised in well under one percent of serious cases and succeeding in only a fraction of those. And it isn't 'going free': those found not guilty by reason of insanity are usually sent to a secure hospital, often for a long time.",
        explanation:
          "Full credit: explains blame requires a choosing/understanding mind, defines legal insanity narrowly, and corrects the loophole myth (rare, hard to prove, leads to confinement not freedom).",
      },
      {
        topicSlug: "predicting-danger",
        prompt:
          "Explain why predicting future dangerousness is so hard, why structured tools beat gut feeling, and what it means that a wrong prediction can fail in two different directions. (4–6 sentences.)",
        correctAnswer:
          "Predicting future behavior is hard because people aren't machines and the future isn't fixed; in fact most people who have offended will not offend again, so even a 'risky' person is a story of probabilities, not certainty. For years experts relied on gut feeling and often did little better than a coin flip while absorbing their own biases. Structured tools — checklists of research-backed factors, scored carefully and consistently — reliably do better, echoing how the psychopathy checklist beat 'just knowing.' But every prediction can fail two ways: a false alarm keeps a safe person locked up, while a miss lets a dangerous person harm someone. No setting removes both risks at once, so society has to decide openly which mistake it's more willing to make — a values question as much as a science one.",
        explanation:
          "Full credit: explains prediction as probabilistic (most don't reoffend), that structured tools beat biased gut judgment, and that errors split into false alarms vs. misses — a trade-off/values question.",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Criminal Psychology for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "predicting-danger",
        prompt:
          "Using ideas from across the whole course, argue that one habit of mind — 'resist the simple, confident story' — runs through criminal psychology. Show how it applies to at least three different topics (for example: the 'criminal look,' a single cause of crime, the movie psychopath, a flawless profile, perfect memory, an automatic confession, an easy insanity loophole, or a certain prediction). (5–7 sentences.)",
        correctAnswer:
          "The thread running through the whole course is to resist the simple, confident story and replace it with careful, evidence-based thinking. There is no 'criminal look': Lombroso's confident claim that faces reveal criminals was checked and proven false. There is no single cause of crime either — offending stacks nature, nurture, situation, and choice, so 'risk is not destiny.' Memory isn't a perfect recording, which is why an honest, confident eyewitness can still be wrong and was the leading cause in most DNA-overturned wrongful convictions. The same caution undoes the movie psychopath, the flawless profile, the automatic confession, the easy insanity loophole, and the certain prediction — each is a tidy myth that collapses on inspection. That shared habit, harder than believing a neat story, is what makes criminal psychology both more honest and more fair.",
        explanation:
          "Full credit: states the unifying habit (reject simple/confident stories for evidence) and applies it correctly to at least three distinct course topics with accurate detail.",
      },
      {
        topicSlug: "why-people-offend",
        prompt:
          "Someone insists, 'Criminals are just born bad — it's in their nature.' Using evidence and ideas from the course, argue why offending is better understood as risk, not destiny. Use at least one concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'born bad' view assumes a single inborn cause, but the evidence shows offending grows from many things stacked together — temperament you're born with, the world that shapes you, the situation, and real choices. Being born more impulsive or fearless can raise risk, yet that's a loaded die, not a decision; most people with a risky temperament never seriously break the law. Researchers who followed thousands of children for decades found that kids facing many risk factors — harsh homes, poverty, rough neighborhoods — were more likely to offend, but the majority still did not. Many 'high-risk' children grew into steady, law-abiding adults, often because of one stable adult, a school that worked, or a turn of luck. That's why the field treats these as risk factors, not switches: more of them raises the odds the way more rain raises the chance of a flood, without guaranteeing it. So 'born bad' mistakes higher odds for a fixed fate.",
        explanation:
          "Full credit: rejects single-cause 'born bad,' explains multiple stacked risk factors and odds-not-destiny, and supports it with a concrete example (e.g. longitudinal studies showing most high-risk kids don't offend).",
      },
      {
        topicSlug: "eyewitness-memory",
        prompt:
          "Explain why a confident eyewitness can be honestly mistaken, why this is one of the most important findings in criminal psychology, and how careful procedures can reduce the harm. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "A confident eyewitness can be honestly mistaken because memory isn't replayed like a video; it's rebuilt each time, with the brain filling gaps using what seems to make sense, so it can change without the person noticing. Memories of a crime are especially fragile and can be bent afterward by a leading question, another witness, or a news photo, and confidence is only weakly tied to accuracy — it can even be inflated by an officer's 'good, you got him.' This matters enormously because eyewitness testimony is so persuasive in court yet can send an innocent person to prison: when DNA testing began freeing the wrongly convicted, mistaken identification was a factor in around seven out of ten of those cases. Knowing how memory fails tells us how to protect it: show suspects one at a time, have the lineup run by someone who doesn't know the suspect, and record the witness's confidence before anyone reacts. These steps don't make memory perfect, but they keep a fragile clue from being accidentally corrupted into a wrongful conviction.",
        explanation:
          "Full credit: explains reconstructive/suggestible memory and weak confidence–accuracy link, ties it to wrongful convictions (e.g. ~70% of DNA exonerations), and gives valid safeguards (sequential, blind, record confidence).",
      },
      {
        topicSlug: "interrogation-and-confession",
        prompt:
          "A juror says, 'He confessed, so he must be guilty — case closed.' Using the course, explain why a confession is not automatic proof, and what should be checked before trusting one. Use a concrete example or figure. (5–7 sentences.)",
        correctAnswer:
          "A confession feels like the end of the story, but innocent people confess to serious crimes more often than most people believe. Interrogation can become intensely stressful — hours of accusations, claims of evidence that may not exist, and hints that confessing is the only way out — so the short-term relief of making it stop can outweigh the long-term danger of admitting something untrue. Some confess just to end the pressure; others, told repeatedly there's 'proof,' start to doubt their own memory, and the young, frightened, or easily led are especially at risk. We know this isn't rare: when DNA evidence overturned wrongful convictions, roughly one in four of those innocent people had confessed or incriminated themselves, often in detailed, convincing statements. So before trusting a confession a juror should ask how it was produced — ideally by watching a full recording of the interrogation — and whether the key details came from the suspect or were accidentally fed to them. That makes how a confession was obtained matter as much as what it says.",
        explanation:
          "Full credit: explains why innocent people falsely confess (pressure, self-doubt, vulnerable groups), cites evidence it's real (e.g. ~25% of DNA exonerations involved false confessions), and names safeguards (full recording, source of details).",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about criminal psychology cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete criminal-psychology situations.",
    lectureTitle: "Primer: How to reason about criminal psychology cases",
    body: `# How to reason about criminal psychology cases

This short primer prepares you for the **Criminal Psychology** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — an investigator, a witness, a defendant, a jury — and asks what the course's ideas tell you about it. Knowing the word "false confession" is not enough; the question wants you to recognize *when* you are looking at one and *why* it matters here.

## What the questions reward

- **Naming the right idea** — match the situation to the concept that fits it: why someone offended, what a profile can and can't tell you, when memory is unreliable, when a confession is suspect, how the law treats responsibility, how dangerousness is judged.
- **Using evidence from the scene** — point to the detail in the situation that supports your answer, rather than answering from a general impression.
- **Avoiding the sensational reading** — the course explains behavior; it does not assume the scariest explanation. The best answers stay measured and grounded in the science.

## How to do this activity well

1. **Read the situation first**, then ask which topic it belongs to.
2. **Find the detail that decides it** — what in the scene makes one answer better than another.
3. For written items, **give the core idea in a sentence or two** — clear and correct beats long and padded.

Take it as often as you like; the questions are freshly generated every time, and there is no penalty for any answer.`,
  },
  {
    slug: "reasoning-primer-general",
    title: "Core reasoning skills",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: analysis, inference, evaluation, deduction, and induction.",
    lectureTitle: "Primer: Core reasoning skills",
    body: `# Core reasoning skills

This short primer prepares you for the **General Reasoning** diagnostic — an *ungraded* check that tests five genuine reasoning skills. These are the same skills you use to decide what a set of facts really shows, so they matter directly for thinking clearly about why people act the way they do.

## The five skills

- **Analysis** — break an argument into parts: find its **point** (the conclusion), the **reasons** given for it, and any hidden assumption it leans on. Ask: "What is this trying to convince me of, and what does it take for granted?"
- **Inference** — work out what *follows* from what you're told, and how strongly. Tell apart what *must* be true, what is *likely*, and what is only *possible*.
- **Evaluation** — judge how much the reasons actually support the point. Notice when evidence is beside the point, a source isn't trustworthy, or a step doesn't really connect.
- **Deduction** — reasoning where true starting facts *guarantee* the conclusion. If the starting facts are true, the conclusion can't be false. Watch for sneaky forms that only *look* airtight.
- **Induction** — reasoning from a few examples to a *probable* general rule or prediction. Strong induction uses many fair examples; weak induction over-generalizes from too few.

## A recurring trap: things that move together

Most wrong answers are statements that *sound* reasonable but are **not actually backed up by what you were told**. The discipline this check rewards is the same one careful thinking about human behavior demands: keep apart what the facts **show**, what you're **assuming**, and what only *sounds* right. Two things happening together does not prove one causes the other.

## How to do this activity well

1. Find the **point** (conclusion) first, then the reasons.
2. Ask which of the five skills the question is testing (a hidden-assumption question is analysis; a "what follows" question is inference or deduction; a "how good is this reasoning" question is evaluation).
3. Pick the option that follows **only** from what you were given — not the one that merely sounds true or appealing.

Take it as often as you like; the questions are freshly generated every time, and it never affects your grade.`,
  },
];

// Insert any teaching-to-the-test primer lectures whose slug is not yet present.
// Safe to run on every boot: it only adds what is missing.
export async function seedReasoningPrimersIfMissing(): Promise<void> {
  const currentSlugs = REASONING_PRIMERS.map((p) => p.slug);
  // Remove any obsolete primer topics from earlier diagnostic models (their
  // lectures cascade-delete), so renamed/retired primers self-heal instead of
  // stranding stale content in existing or republished databases.
  const stale = await db
    .delete(topicsTable)
    .where(
      and(
        like(topicsTable.slug, "reasoning-primer-%"),
        notInArray(topicsTable.slug, currentSlugs),
      ),
    )
    .returning({ slug: topicsTable.slug });
  if (stale.length > 0) {
    logger.info(
      { removed: stale.map((s) => s.slug) },
      "Reasoning primers: removed obsolete primers",
    );
  }
  let added = 0;
  for (let i = 0; i < REASONING_PRIMERS.length; i++) {
    const t = REASONING_PRIMERS[i]!;
    const existing = await db
      .select({ id: topicsTable.id })
      .from(topicsTable)
      .where(eq(topicsTable.slug, t.slug));
    if (existing.length > 0) continue;
    const [inserted] = await db
      .insert(topicsTable)
      .values({
        slug: t.slug,
        title: t.title,
        weekNumber: t.weekNumber,
        blurb: t.blurb,
        position: 900 + i,
      })
      .returning();
    if (!inserted) throw new Error(`Failed to insert primer ${t.slug}`);
    await db.insert(lecturesTable).values({
      topicId: inserted.id,
      weekNumber: t.weekNumber,
      title: t.lectureTitle,
      body: t.body,
    });
    added += 1;
  }
  if (added > 0) {
    logger.info({ added }, "Reasoning primers seeded");
  } else {
    logger.info("Reasoning primers: already present, skipping");
  }
}

export async function seedIfEmpty(): Promise<void> {
  // The course was migrated to the Criminal Psychology for Children
  // syllabus. Detect the marker topic; if present and the content version
  // matches, the content is current and we skip. This makes the seed
  // self-healing across environments: a database that still holds older content
  // (e.g. a previous curriculum) is detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-criminal-psychology-is"));
  // Read the stored content version. Tolerate the seed_meta table not yet
  // existing (e.g. a boot that races ahead of schema migration): treat that as
  // "no version recorded", which forces a reseed once the table is present.
  let currentVersion: string | null = null;
  try {
    const storedVersion = await db
      .select({ value: seedMetaTable.value })
      .from(seedMetaTable)
      .where(eq(seedMetaTable.key, "content_version"));
    currentVersion = storedVersion[0]?.value ?? null;
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Seed: seed_meta unavailable, treating version as unset");
    currentVersion = null;
  }
  if (markerTopic.length > 0 && currentVersion === SEED_CONTENT_VERSION) {
    logger.info("Seed: course content present and current, skipping");
    return;
  }
  if (markerTopic.length > 0) {
    logger.warn(
      { storedVersion: currentVersion, expected: SEED_CONTENT_VERSION },
      "Seed: course content present but out of date — re-seeding with the current curriculum",
    );
  }

  // No current content. Either the database is empty (fresh) or it still holds
  // an older curriculum. Do the (optional) wipe and the full reseed in a SINGLE
  // transaction so the marker topic only ever becomes visible once the entire
  // curriculum has committed. A crash mid-seed rolls back, so the next boot
  // retries instead of leaving partial content that the marker check would
  // wrongly treat as healthy. TRUNCATE also takes an ACCESS EXCLUSIVE lock, so
  // concurrent readers never observe a half-empty course during the replace
  // window. The diagnostic tables are truncated here too so the (non
  // version-gated) diagnostic seed repopulates them with the current content on
  // the same boot.
  await db.transaction(async (tx) => {
    const existing = await tx.execute(sql`select count(*)::int as n from topics`);
    const row = (existing.rows[0] ?? {}) as { n?: number };
    if ((row.n ?? 0) > 0) {
      logger.warn(
        "Seed: stale course content detected — replacing with the Criminal Psychology for Children curriculum",
      );
      await tx.execute(
        sql`TRUNCATE TABLE answers, attempts, practice_attempts, practice_problems, practice_sessions, problems, assignments, lectures, topics, diagnostic_responses, diagnostic_attempts, diagnostic_items, diagnostic_assessments RESTART IDENTITY CASCADE`,
      );
    } else {
      logger.info("Seed: populating course content");
    }

    // Topics + lectures
    const slugToTopicId = new Map<string, number>();
    for (let i = 0; i < TOPICS.length; i++) {
      const t = TOPICS[i]!;
      const [inserted] = await tx
        .insert(topicsTable)
        .values({
          slug: t.slug,
          title: t.title,
          weekNumber: t.weekNumber,
          blurb: t.blurb,
          position: i,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert topic ${t.slug}`);
      slugToTopicId.set(t.slug, inserted.id);
      await tx.insert(lecturesTable).values({
        topicId: inserted.id,
        weekNumber: t.weekNumber,
        title: t.lectureTitle,
        body: t.body,
      });
    }

    // Assignments + problems
    for (let i = 0; i < ASSIGNMENTS.length; i++) {
      const a = ASSIGNMENTS[i]!;
      const [inserted] = await tx
        .insert(assignmentsTable)
        .values({
          kind: a.kind,
          title: a.title,
          weekNumber: a.weekNumber,
          position: i,
          isTimed: a.isTimed,
          timeLimitMinutes: a.timeLimitMinutes,
          instructions: a.instructions,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert assignment ${a.title}`);
      for (let p = 0; p < a.problems.length; p++) {
        const prob = a.problems[p]!;
        const topicId = slugToTopicId.get(prob.topicSlug);
        if (!topicId) throw new Error(`Unknown topic slug ${prob.topicSlug}`);
        await tx.insert(problemsTable).values({
          assignmentId: inserted.id,
          topicId,
          position: p,
          prompt: prob.prompt,
          correctAnswer: prob.correctAnswer,
          explanation: prob.explanation,
          hint: prob.hint ?? null,
        });
      }
    }

    // Stamp the content version last, inside the same transaction, so the
    // marker check on the next boot only treats the course as "current" once
    // the entire curriculum has committed.
    await tx
      .insert(seedMetaTable)
      .values({ key: "content_version", value: SEED_CONTENT_VERSION })
      .onConflictDoUpdate({
        target: seedMetaTable.key,
        set: { value: SEED_CONTENT_VERSION, updatedAt: new Date() },
      });
  });

  logger.info(
    { topics: TOPICS.length, assignments: ASSIGNMENTS.length, version: SEED_CONTENT_VERSION },
    "Seed complete",
  );
}
