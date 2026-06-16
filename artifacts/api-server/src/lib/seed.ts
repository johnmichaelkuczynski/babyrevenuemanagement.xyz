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
const SEED_CONTENT_VERSION = "2026-06-16-restaurant-hospitality-analytics-for-children-v1";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Restaurant & Hospitality Analytics for Everyone
  {
    slug: "what-hospitality-analytics-is",
    title: "What hospitality analytics is",
    weekNumber: 1,
    blurb: "Hospitality analytics asks whether a restaurant is really working — and most of what gut instinct tells you about that is a myth.",
    lectureTitle: "1.1 What hospitality analytics is (turning a restaurant into numbers)",
    body: `# What hospitality analytics is

Almost everything most people "know" about running a restaurant comes from gut feeling and a packed Friday night. Those feelings are powerful, but they're often wrong. **Hospitality analytics** is the careful study of the question those instincts only pretend to answer: is this restaurant actually working, and how would we know — not by how it feels, but by what the numbers show?

## A business you can actually measure

Hospitality analytics is a way of running a restaurant on evidence instead of hunches. It turns a fuzzy place full of smells, noise, and busy nights into things you can count: how many guests came, how long they stayed, what they spent, what each dish cost, which night truly made money. The goal isn't to drain the charm out of hospitality. It's to see clearly what's really happening so you can make the place both more welcoming *and* more profitable.

## A number is a measurement, not the meal

Here's something easy to forget: a "metric" isn't the same as the experience. It's a **measurement** we choose to take. The number of covers, the average check, the food cost — each is one snapshot, not the whole night. So good analysts keep two things apart: the *experience* a guest has, and the *measurements* we use to understand it. Confusing the measurement for the meal — or ignoring it entirely — is the first mistake clear thinking avoids.

## The myths the industry tells you

Restaurant lore is full of confident myths: that a busy room always means a healthy business, that a famous chef can "feel" what's working, that the best-selling dish must be the most valuable one, that more choices on the menu always sell more food. None of these hold up. A packed restaurant can quietly lose money, instinct misses what only counting reveals, and best-sellers are sometimes the least profitable items on the menu. A big part of this course is **un-learning** those myths.

## Why this matters

Getting this right isn't just for big chains with data teams. The same ideas decide whether a small family restaurant survives its first three years, whether a hard-working owner is exhausting themselves on the wrong nights, and whether a great meal is also a sustainable business. When people run on myth instead of measurement, real harm follows — the owner burns out, the staff get cut, the doors close. Reading a restaurant honestly is a kind of fairness to everyone who depends on it.

## In the real world

A restaurant can be *slammed* every weekend and still go under. Owners often point to a full dining room as proof they're thriving — yet many of those packed places are turning tables too slowly, discounting too hard, or busy mainly at their lowest-margin hours. Only when someone finally turns the room into numbers — covers, check averages, food and labor costs — does the truth show up: "busy" felt like success but never was. That gap between how a night *feels* and what it actually *earns* is the warning that runs through this whole course.`,
  },
  {
    slug: "metrics-that-matter",
    title: "The metrics that matter",
    weekNumber: 1,
    blurb: "No single number tells you if a restaurant is healthy — profit grows from covers, turns, check average, and costs read together.",
    lectureTitle: "1.2 The metrics that matter (covers, turns, and the bottom line)",
    body: `# The metrics that matter

When someone asks "how's the restaurant doing?", everyone wants one simple number: revenue, or seats filled, or a great review. The honest answer is that there is **no single number** that tells the story. A restaurant's health grows out of several measurements stacked together — how many guests, how often the tables turn, how much each guest spends, and what it all costs. This section is about reading them at once.

## Covers and turns: counting the guests

The most basic numbers are **covers** (the number of guests actually served) and **turns** (how many times a single table is used in a service). A four-top that seats one party all night is one turn; the same table seating three parties is three. Covers tell you how many people you fed; turns tell you how hard your seats worked. A half-empty room and a fully booked room that never turns can serve the same number of people — the counts make the difference visible.

## The check average: what each guest spends

Counting heads isn't enough, because not every guest is worth the same. The **average check** — total sales divided by covers — shows how much a typical guest spends. Two restaurants can serve the same number of covers and earn very different amounts because one sells appetizers, drinks, and dessert while the other sells just an entrée. Raising the average check, even a little, can matter as much as filling more seats.

## The bottom line: revenue isn't profit

Here's the number that fools people most: **revenue is not profit.** Money coming in isn't money kept. Out of every sale comes the cost of the food and the cost of the labor — together often called **prime cost** — plus rent, utilities, and the rest. A restaurant can post record sales and still lose money if those costs climbed faster. The bottom line is what's left *after* the costs, and it's the only number that tells you whether the business actually works.

## One number lies; the dashboard tells the truth

Put it together and you get the field's most important idea: **no single metric is destiny.** Revenue alone, covers alone, or one glowing review alone can each point the wrong way. You read them *together* — covers and turns and check average and costs — the way a doctor reads several vital signs at once instead of trusting your pulse alone. Anyone who promises that one magic number proves a restaurant is healthy is selling a myth.

## In the real world

A restaurant once celebrated its best sales month ever — and the owner still couldn't make payroll. Revenue was up, so the team assumed everything was fine. But food prices had crept up and they'd added staff, pushing prime cost from a manageable share of sales to well over the rule-of-thumb ceiling many operators watch (roughly two-thirds of every dollar). The record revenue was real; so were the losses hiding underneath it. Only when they tracked the metrics *together* did the problem — and the fix — finally come into focus.`,
  },
  {
    slug: "menu-engineering",
    title: "Menu engineering",
    weekNumber: 1,
    blurb: "A menu isn't just a list of food — it's a profit machine, and the best-selling dish is not always the one you should be pushing.",
    lectureTitle: "1.3 Menu engineering (why the menu is a profit machine)",
    body: `# Menu engineering

No object in a restaurant is more underestimated than the **menu.** Most people see a list of food and prices. In hospitality analytics, the menu is something far more powerful — and, in some ways, far more surprising: a carefully engineered machine that quietly steers what guests order and how much money the restaurant keeps.

## What menu engineering actually is

Menu engineering means looking at every dish through **two numbers at once**: how *popular* it is (how often it sells) and how *profitable* it is (how much it earns after its ingredients). Sort dishes by those two and you get four groups — the **stars** (popular and profitable), the **plowhorses** (popular but low-margin), the **puzzles** (profitable but rarely ordered), and the **dogs** (neither). The menu stops being a list and becomes a map of where your money is really made.

## Popularity isn't profit

Here's the part that trips everyone up: a best-seller can be one of your *least* profitable dishes. A popular plowhorse — say a big cheap pasta everyone loves — fills the room but barely earns. Pushing it harder can actually shrink profit, while a quiet "puzzle" dish with a great margin goes unnoticed. The missing piece in most people's thinking is profit per dish; without it, "what sells most" and "what earns most" get treated as the same thing when they often aren't.

## Not just about the priciest dish

The opposite mistake is just as common: assuming the most *expensive* dish is the most profitable. It isn't necessarily. A $40 steak with costly beef can earn less per plate than a $16 pasta made of cheap, simple ingredients. What matters is the **margin** — price minus what the dish costs to make — not the price tag alone. High price and high profit are two different things that only sometimes line up.

## Measuring it carefully

Because favorites and hunches mislead, good operators don't engineer a menu by taste. They use **real numbers**: actual sales counts from the register and the real food cost of each recipe, calculated carefully. A single gut feeling about a dish means little; it's the documented pattern across the whole menu that tells you what to promote, reprice, redesign, or cut. This discipline is the opposite of "the owner just knows what's working."

## In the real world

In a famous study, shoppers were offered free jam to taste. One table displayed **24** jams; another displayed just **6**. The big display drew far more curious crowds — it *looked* like the winner. But when researchers counted actual purchases, the small display sold roughly **ten times** as much. More choices pulled people in and then overwhelmed them into buying nothing. It's a perfect menu-engineering lesson: "more options must mean more sales" feels obvious, sounds smart, and is simply wrong until someone counts what actually sells.`,
  },
  {
    slug: "forecasting-demand",
    title: "Forecasting demand",
    weekNumber: 1,
    blurb: "A forecast is an educated guess about a crowd that hasn't arrived yet, built from clues in past patterns — useful as a guide, dangerous as a certainty.",
    lectureTitle: "1.4 Forecasting demand (knowing the crowd before it arrives)",
    body: `# Forecasting demand

This is the part that looks like magic: a seasoned manager glances at the calendar and "just knows" how busy tonight will be. The real thing — **demand forecasting** — is more careful, more limited, and a lot more honest than the legend. It's the craft of using clues from the past to make educated guesses about a crowd that hasn't shown up yet.

## The past leaves a pattern

A restaurant's history is full of signal. Fridays beat Tuesdays; summer differs from winter; a sunny patio day differs from a downpour; a big game or concert nearby changes everything. None of these are random — they're **patterns** that repeat. Forecasting starts by noticing them: pulling up what really happened on similar days before, instead of trusting a vague sense that "it'll probably be busy."

## From patterns to a forecast

A forecaster turns those clues into a **likely number** of guests — not a promise, an estimate. That number then drives real decisions: how many cooks and servers to schedule, how much food to order, whether to take the big reservation. A good forecast isn't about predicting the future perfectly; it's about getting close enough to staff and stock the place sensibly, so you're neither drowning nor standing around.

## Educated guess, not a crystal ball

A forecast is a set of **odds**, and odds are sometimes wrong. You're guessing about people who haven't decided to come yet, from limited clues, so a forecast is a tool to *prepare* — never a guarantee. The danger comes when someone treats it as certain and locks in staffing and orders as if the number were fact. Used humbly, a forecast smooths the night; used as gospel, it sets you up to be caught out.

## When forecasting goes wrong

The biggest risk is **tunnel vision on one factor**: staffing only by the day of the week while ignoring the marathon downtown, or trusting last year's numbers through a heat wave. A confidently wrong forecast is worse than none, because the whole night — schedules, food orders, prep — gets built on it before anyone notices it's off. Careful operators treat a forecast as one input among many and stay ready to adjust the moment reality disagrees.

## In the real world

A neighborhood restaurant knew its rhythm cold: Tuesdays were slow, so they staffed light. One Tuesday they were buried — a sold-out concert had let out two blocks away, and they'd never checked the local calendar. Guests waited too long, food ran short, reviews soured, all because a reliable pattern was trusted too confidently and one powerful clue (a nearby event) was missed. Weather and local events are among the strongest things that move a crowd, which is exactly why a forecast is valuable as a guide and dangerous as a certainty.`,
  },
  {
    slug: "pricing-and-yield",
    title: "Pricing and yield",
    weekNumber: 1,
    blurb: "The 'right price' isn't fixed, and our instincts about it are surprisingly unreliable — the same seat can be worth very different amounts.",
    lectureTitle: "1.5 Pricing and yield (charging the right amount at the right time)",
    body: `# Pricing and yield

"Just charge what it costs, plus a little" sounds like the obvious way to price a menu. But here is one of the most surprising — and most useful — findings in hospitality analytics: the "right price" is **not a fixed number**, and our gut instincts about pricing are far less reliable than they feel. The same dish, the same seat, can be worth very different amounts depending on how and when it's sold.

## Price is a signal, not just a number

A price doesn't only collect money; it **tells the guest something.** Too cheap and people quietly assume the food is low quality; too expensive and they feel cheated. The exact same dish can sell better at a slightly higher price because the price signals "this is good." So price isn't just cost-plus arithmetic — it's part of how guests decide what something is worth before they've even tasted it.

## The same seat is worth more at peak

A table at 8 p.m. on Saturday is simply more valuable than the same table at 3 p.m. on Tuesday — demand is higher, and someone will gladly take it. This is the heart of **yield** (or revenue) thinking: match the price and the rules to the demand. That's why peak times might carry a small premium, a minimum spend, or a tighter reservation policy, while slow times get specials to pull people in. The seat never changed; its *value* did.

## Our pricing instincts mislead us

People assume they can feel the right price — round it off, add a standard markup, copy the place next door. Research keeps showing that **gut pricing leaves money on the table** or scares guests away, and that small, almost invisible changes move behavior a lot. The confident feeling that "this just feels like the right price" tells us surprisingly little about what guests will actually do. Pricing is one of those places where intuition is loud and often wrong.

## Pricing done right

The good news: knowing our instincts mislead us tells us how to price more carefully. **Test** changes and watch what actually sells. Use what's known about how people read menus — charm prices, dropping the dollar sign, placing a high "anchor" dish nearby to make others look reasonable. And adjust by **demand**, charging a bit more when seats are scarce and less when they're empty. None of this is trickery; it's pricing on evidence instead of on a hunch.

## In the real world

At a well-known hospitality school, researchers gave guests the *same* menu in different formats. One listed prices with dollar signs ("$20.00"); another simply wrote the number ("20"). Guests reading the menu **without** dollar signs spent noticeably more — the currency symbol quietly reminded them they were spending money. Nothing about the food or the actual prices changed; only the presentation did. It's a sharp reminder of this section's lesson: our instincts about price are unreliable, and only careful testing shows what really moves a guest.`,
  },
  {
    slug: "guests-as-data",
    title: "Guests as data",
    weekNumber: 1,
    blurb: "It feels like success means a flood of new faces — but the real money is in the guests who come back, and chasing only new ones is a costly trap.",
    lectureTitle: "1.6 Guests as data (loyalty, lifetime value, and coming back)",
    body: `# Guests as data

A line out the door of brand-new customers feels like the very picture of success. Why fuss over the regulars when there's a whole world of new guests to win? Yet one of the most important findings in hospitality analytics is that **the guests who come back are worth far more** than a constant churn of first-timers — and understanding *why* changes where a restaurant spends its energy.

## Why repeat guests matter

Winning a brand-new guest is expensive: advertising, discounts, the effort of a first impression. A returning guest costs almost nothing to bring back, already knows the menu, and tends to spend more and bring friends. So a restaurant full of regulars is usually healthier than one constantly burning money to refill the room with strangers. The repeat guest is the quiet engine of a stable business.

## Lifetime value: the long view

The key idea is **lifetime value** — looking at a guest not as one check, but as *all* the visits they might make over months and years. A regular who comes in twice a month for a year is worth far more than a one-time big spender, even if tonight's bill is smaller. Thinking in lifetime value flips the question from "how much did this guest spend today?" to "how much is keeping this guest worth?" — and the second number is usually much bigger.

## The trap of chasing only new faces

Here's the costly trap: pouring everything into attracting first-timers while ignoring the people who already love the place. Deep discounts and giveaways can pull in a crowd of one-time deal-seekers who never return and may even **lose money** on each visit. Meanwhile the loyal guests, taken for granted, drift away. The flood of new faces feels like growth, but it can quietly hollow out the very base that keeps the lights on.

## Measuring loyalty carefully

Because loyalty is easy to assume and hard to see, good operators **measure** it: how often guests return (frequency), how recently they last came (recency), and how much they're worth over time (lifetime value). A loyalty program isn't just a punch card — it's a way to *see* these patterns, spot regulars slipping away, and welcome them back before they're gone. The documented pattern, not a warm feeling about "our regulars," is what guides the decisions.

## In the real world

In a widely cited business study, researchers found that increasing customer **retention** by just **5%** could raise profits anywhere from **25% to 95%**, depending on the business. The reason is exactly this section's lesson: loyal customers cost less to serve, spend more over time, and refer others, so even a small improvement in keeping them compounds into a large gain. It's the clearest evidence that the guests already coming back are often worth more than the next crowd of strangers.`,
  },
  {
    slug: "reviews-and-sentiment",
    title: "Reviews, sentiment, and reputation",
    weekNumber: 1,
    blurb: "Reviews are data, not just opinions — and the obvious way to read them (the star average, that one angry review) is usually the wrong way.",
    lectureTitle: "1.7 Listening at scale (reviews, sentiment, and reputation)",
    body: `# Reviews, sentiment, and reputation

Everybody reads reviews — and almost everybody misreads them. A restaurant's online reputation can feel like a single scary number or one furious paragraph that ruins your week. But treated carefully, reviews at scale are **data**, and the obvious way to read them is usually the wrong way. Learning to listen to thousands of voices at once is its own skill.

## Reviews are data, not just opinions

A single review is one person's opinion. A *thousand* reviews, read together, become a **pattern** you can measure. This is the idea behind **sentiment analysis**: turning piles of written words into a signal — what guests mention most, what they praise, what they complain about again and again. The point isn't to obsess over any one comment; it's to hear the whole room at once and find the themes that actually repeat.

## What the star average hides

The headline star rating is the number everyone stares at — and it hides a lot. A 4.2 built from steady, recent praise is very different from a 4.2 propped up by glowing reviews from three years ago and a string of recent complaints. The **distribution** (how many fives versus ones), the **recency** (are things getting better or worse?), and the **volume** (10 reviews or 10,000?) often matter more than the single average. The one number is a starting point, not the story.

## One bad review is not a catastrophe

The most common overreaction is panic over a single one-star review. But one angry outlier is **not a pattern** — every good restaurant has a few. The mistake is letting one loud voice drive a frantic overhaul while the real, repeating signals go ignored. What deserves attention is a theme that shows up over and over ("slow service," "tiny portions"), not a lone complaint from an unusually bad night. Outliers are noise; patterns are signal.

## Reading reviews carefully

Listening well means separating that **signal from noise**: looking for recurring themes instead of reacting to individual reviews, watching the trend over time, and weighing volume. It also means **responding** thoughtfully — a calm, fair reply to a complaint is read by everyone who comes after. Used this way, reviews become a free, constant stream of honest feedback, instead of a source of dread ruled by whoever shouted loudest today.

## In the real world

A study from a leading business school examined thousands of restaurants and their online ratings. The finding was striking: a **one-star increase** in a restaurant's rating was linked to roughly a **5% to 9% increase in revenue** — and the effect was strongest for independent places without a famous brand name to fall back on. Reputation, measured at scale, translated directly into money through the door. It shows why reviews deserve to be read like data, carefully and in aggregate, rather than feared one comment at a time.`,
  },
  {
    slug: "dashboard-to-decision",
    title: "From dashboard to decision (capstone)",
    weekNumber: 1,
    blurb: "Can a dashboard full of numbers actually run a restaurant? Only with judgment — and the whole course comes together in how data turns into a decision.",
    lectureTitle: "1.8 From dashboard to decision, and what comes next (Capstone)",
    body: `# From dashboard to decision (capstone)

We end on the hardest, highest-stakes skill in the whole field: **turning numbers into an actual decision.** A manager staring at a dashboard, an owner deciding what to cut, a chef choosing what to take off the menu — all of them have to move from *measuring* to *acting*. Everything in this course comes together here, including its deepest limits.

## The hardest step: numbers to action

A dashboard doesn't decide anything; **people do.** It's tempting to think that once you have the data, the answer is automatic — but two managers can read the same numbers and choose opposite things. The real skill isn't collecting metrics; it's asking the right question of them: *what is this number telling me to do, and how sure am I?* Data informs the decision; it never makes it for you.

## Vanity metrics vs. metrics that matter

For a long time, restaurants chased whatever number felt flattering — total followers, total revenue, a packed room — and quietly mistook those for health. The improvement comes from separating **vanity metrics** (numbers that look good but don't change a decision) from the **metrics that matter** (the ones that actually tell you to staff up, reprice a dish, or fix the slow night). Picking the right few numbers to watch beats drowning in a dashboard of pretty ones — just as a careful checklist beats a flattering gut feeling.

## The cost of acting wrong (both ways)

Every decision from data can fail in two directions, and both hurt. **Overreact** to a number that was just noise — one bad review, one slow week — and you tear up a menu or cut staff you needed. **Ignore** a number that was a real signal — costs creeping up, regulars slipping away — and the problem grows until it's serious. There's no setting that removes both risks at once, so an operator has to judge, openly and honestly, which mistake is more dangerous right now.

## Tying the course together

Look back and you'll see one thread through all eight topics: **resist the simple, flattering story.** A busy room isn't automatically profit, no single metric proves health, the best-seller isn't always the moneymaker, a forecast isn't a fact, your pricing instinct isn't trustworthy, new faces aren't worth more than loyal ones, and one angry review isn't the truth. Hospitality analytics replaces tidy assumptions with careful, honest, measured thinking — which is harder, but it's the only kind that actually keeps a restaurant alive.

## The biggest questions stay open

And plenty stays unsettled. How do you balance what the numbers say against the warmth and judgment that make hospitality *hospitality*? How much should a great host trust a spreadsheet over their read of the room? How do you keep your metrics from quietly steering you toward a colder, worse experience? Analytics gives a restaurant better questions and more honest answers — not final ones. The most useful habit to carry out of this course is simple: whenever a number tells a clean, comforting story, ask, "Is that real, or is it a myth?"

## In the real world

When a struggling hospitality company brought in a leader who believed in measurement, he reportedly asked his team a pointed question: *"Do we believe in luck, or do we believe in data?"* Instead of running on the industry's gut traditions, they tracked their guests carefully — who came, how often, what they valued — and made decisions from that. The turnaround was dramatic. But the lesson cuts both ways: the data only helped because *people* asked the right questions of it and still cared about the guest. That marriage of honest numbers and human judgment is where this whole course has been heading.`,
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
    title: "Homework 1.1 — Measuring, metrics, menus, and forecasting",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. There's no need for any math — just explain your thinking clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-hospitality-analytics-is",
        prompt:
          "A friend says, 'You can tell a restaurant is doing great just by walking in and seeing it packed — a full room means it's winning.' Use what hospitality analytics actually shows to explain why 'busy means successful' is a myth. (3–5 sentences.)",
        correctAnswer:
          "A packed room only tells you how it feels, not whether the business is healthy. A restaurant can be slammed and still lose money — it might be busy mainly at low-margin hours, turning tables too slowly, or discounting so heavily that each guest barely earns anything. Whether 'busy' is actually good only shows up in the numbers: covers, how often tables turn, the average check, and the food and labor costs underneath it all. So my friend is mistaking how a night feels for what it actually earns, which is exactly the trap analytics is meant to catch.",
        explanation:
          "Full credit: explains that a full room is a feeling, not proof of profit, gives a reason busy can lose money (slow turns, discounts, low-margin times), and notes only the measured numbers (covers, turns, check average, costs) reveal real health.",
      },
      {
        topicSlug: "metrics-that-matter",
        prompt:
          "A restaurant brags that it just had its best sales month ever, but the owner is quietly stressed about making payroll. Use the idea that 'revenue isn't profit' and 'read the metrics together' to explain how both things can be true at once. (3–5 sentences.)",
        correctAnswer:
          "Record revenue means a lot of money came in, but revenue isn't profit — what matters is what's left after the costs. If food prices crept up and the restaurant added staff, its prime cost (food plus labor) could have climbed faster than sales, so more money came in and even more went out. That's why no single number tells the story: you have to read revenue alongside covers, check average, and costs to see what's really happening. The 'best month ever' and 'can't make payroll' are both true because revenue was high while the bottom line underneath it shrank.",
        explanation:
          "Full credit: distinguishes revenue from profit, explains rising costs (e.g. prime cost) can erase a sales record, and notes metrics must be read together rather than trusting one number.",
        hint: "Think about whether money coming in is the same as money kept, and what costs sit between the two.",
      },
      {
        topicSlug: "menu-engineering",
        prompt:
          "Someone says, 'Our best-selling dish is obviously our most important one — we should promote it even harder.' Using menu engineering, explain two things this might get wrong. (3–5 sentences.)",
        correctAnswer:
          "First, popularity isn't profit: a best-seller can be a 'plowhorse' that everyone orders but that earns very little per plate, so pushing it harder can actually shrink profit rather than grow it. Menu engineering judges every dish on two numbers at once — how often it sells and how much it earns after its ingredients — not popularity alone. Second, this thinking can ignore the quiet 'puzzle' dishes that are highly profitable but rarely ordered, which are often exactly the ones worth promoting. So the most important dish is the one that's both popular and profitable (a 'star'), which the best-seller may or may not be.",
        explanation:
          "Full credit: explains popularity ≠ profit (a popular dish can be low-margin), that dishes must be judged on both sales and margin, and that promoting a low-profit best-seller can hurt while profitable 'puzzle' dishes get missed.",
      },
      {
        topicSlug: "forecasting-demand",
        prompt:
          "A manager claims they can just 'feel' how busy tonight will be and staff accordingly. Explain what real demand forecasting actually does, and why treating any forecast as a certainty is dangerous. (3–5 sentences.)",
        correctAnswer:
          "Real forecasting doesn't rely on a feeling; it uses clues from the past — the day of the week, the season, the weather, nearby events — to estimate a likely number of guests so you can staff and order sensibly. That estimate is a set of odds, not a promise, because you're guessing about people who haven't decided to come yet. Treating it as certain is dangerous because the whole night — schedules, food orders, prep — gets locked in around one number, so a confidently wrong forecast leaves you badly over- or understaffed. A careful manager treats the forecast as one input and stays ready to adjust the moment reality disagrees.",
        explanation:
          "Full credit: describes forecasting as using past patterns/clues to estimate likely demand for staffing and ordering, frames it as probabilistic, and explains the danger of over-trusting it (locked-in plans, over/understaffing).",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Pricing, loyalty, reviews, and decisions",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. No math is required — explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "pricing-and-yield",
        prompt:
          "A guest grumbles, 'Writing 12 instead of $12.00 on the menu is silly — it's the exact same price.' Explain why how a price is presented, and when it's charged, can matter even when the cost itself doesn't change. (3–5 sentences.)",
        correctAnswer:
          "A price isn't just a number; it's a signal, and small changes in how it's presented quietly change behavior — dropping the dollar sign, for instance, can make guests spend more because it stops reminding them they're spending money. Our instincts about pricing are unreliable, so these almost invisible details matter more than they seem. On top of that, the same seat or dish is worth different amounts at different times: a table at 8 p.m. Saturday is in higher demand than at 3 p.m. Tuesday, so the smart price can shift with demand (yield). So even when the underlying cost is identical, presentation and timing can change what a guest is willing to pay.",
        explanation:
          "Full credit: explains price as a signal whose presentation changes behavior (e.g. dropping the dollar sign), notes our pricing instincts are unreliable, and/or that the same seat is worth more at peak demand (yield).",
      },
      {
        topicSlug: "guests-as-data",
        prompt:
          "Many owners say, 'Growth just means getting as many brand-new customers as possible.' Explain why focusing only on new guests can actually be a costly mistake. (3–5 sentences.)",
        correctAnswer:
          "Winning a brand-new guest is expensive — advertising, discounts, the work of a first impression — while a returning guest costs almost nothing to bring back, already knows the menu, spends more over time, and refers friends. That's why lifetime value matters: a regular who visits often for years is worth far more than a one-time big spender. Chasing only new faces with deep discounts can pull in deal-seekers who never return and sometimes lose money on each visit, while the loyal guests get taken for granted and drift away. So pouring everything into new customers can quietly hollow out the repeat base that actually keeps the restaurant healthy.",
        explanation:
          "Full credit: explains new guests are costly to win while repeat guests are cheaper and worth more over time (lifetime value), and that chasing only new faces with discounts can lose money and neglect loyal regulars.",
        hint: "Think about what it costs to win a stranger versus bring back a regular, and how much a loyal guest is worth over years rather than one visit.",
      },
      {
        topicSlug: "reviews-and-sentiment",
        prompt:
          "A manager sees one new one-star review and wants to overhaul the whole menu and retrain every server immediately. Explain two ways this overreaction misreads the data. (3–5 sentences.)",
        correctAnswer:
          "First, a single review is one opinion, not a pattern — every good restaurant gets the occasional angry outlier, so one one-star review shouldn't drive a frantic overhaul. What actually deserves attention is a theme that repeats across many reviews ('slow service,' 'tiny portions'), which is the real signal; one bad night is just noise. Second, the manager is ignoring the bigger picture the data offers: the distribution of ratings, whether things are trending up or down over time, and the volume of reviews all matter more than a single comment. Reading reviews well means listening at scale and separating recurring signal from one-off noise, not reacting to whoever shouted loudest today.",
        explanation:
          "Full credit: explains that one review is an outlier, not a pattern (signal vs. noise), and that real reading looks at recurring themes, distribution, trend over time, and volume rather than a single comment.",
      },
      {
        topicSlug: "dashboard-to-decision",
        prompt:
          "A new manager is proud that the restaurant now has a dashboard showing dozens of numbers. Explain why having all that data isn't the same as making a good decision, and what separates a 'metric that matters' from a 'vanity metric.' (3–5 sentences.)",
        correctAnswer:
          "A dashboard measures things, but it doesn't decide anything — people do, and two managers can read the same numbers and choose opposite actions. The real skill is asking the right question of the data: what is this number telling me to do, and how sure am I? A 'metric that matters' is one that actually changes a decision — staff up tonight, reprice a dish, fix the slow night — while a 'vanity metric' just looks flattering (big follower counts, total revenue) without telling you to act. So watching a few decision-driving numbers beats drowning in a dashboard of pretty ones, and the data still needs human judgment to become a good decision.",
        explanation:
          "Full credit: explains that data informs but doesn't make decisions (people do), and distinguishes metrics that drive action from flattering vanity metrics that don't change what you do.",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Restaurant & Hospitality Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-hospitality-analytics-is",
        prompt:
          "Explain what hospitality analytics is, and why it insists that 'a number is a measurement, not the meal.' Why does keeping that distinction matter? (4–6 sentences.)",
        correctAnswer:
          "Hospitality analytics is the practice of running a restaurant on evidence instead of hunches — turning a fuzzy, busy place into things you can count, like covers, turn times, check averages, and costs. Saying 'a number is a measurement, not the meal' means a metric isn't the actual guest experience; it's one snapshot we choose to take of it. So a good analyst keeps two things apart: the experience a guest has, and the measurements used to understand it. That distinction matters because confusing the measurement for the meal — or ignoring measurement entirely — leads to bad calls: you either chase a number while wrecking the experience, or you run on gut feeling and miss what's really happening. Holding both together is the first habit of clear thinking about a restaurant.",
        explanation:
          "Full credit: defines hospitality analytics as evidence-based measurement of a restaurant, explains a metric as a chosen snapshot (not the experience itself), and why separating measurement from experience supports clear, balanced decisions.",
      },
      {
        topicSlug: "metrics-that-matter",
        prompt:
          "Explain why hospitality analytics rejects any single 'magic number' for a restaurant's health, using covers, turns, check average, and costs. Why is 'no single metric is destiny' the key takeaway? (4–6 sentences.)",
        correctAnswer:
          "A restaurant's health grows out of several measurements stacked together, not one. Covers count the guests served and turns count how hard each table works, so two restaurants can serve the same people very differently. The average check shows how much each guest spends, which can make equally busy restaurants earn very different amounts. And costs matter most of all, because revenue isn't profit — food and labor (prime cost) plus rent eat into every sale, so a record-revenue month can still lose money. 'No single metric is destiny' is the key takeaway because any one number — revenue, covers, a great review — can point the wrong way; you have to read them together, like several vital signs at once, to see the truth.",
        explanation:
          "Full credit: explains covers, turns, check average, and costs as stacked metrics (revenue ≠ profit), and frames health as requiring all of them read together rather than one magic number.",
      },
      {
        topicSlug: "menu-engineering",
        prompt:
          "Describe what menu engineering actually is, including the idea that 'popularity isn't profit,' and explain why operators classify dishes using real numbers instead of favorites. (4–6 sentences.)",
        correctAnswer:
          "Menu engineering judges every dish on two numbers at once: how popular it is (how often it sells) and how profitable it is (what it earns after its ingredients). Sorting on both gives four groups — stars (popular and profitable), plowhorses (popular but low-margin), puzzles (profitable but rarely ordered), and dogs (neither). 'Popularity isn't profit' is the core insight: a best-seller can be a plowhorse that fills the room but barely earns, so pushing it harder can shrink profit while a quiet, high-margin puzzle goes unnoticed. It's also a mistake to assume the priciest dish is the most profitable, because margin — price minus cost — is what counts, not the price tag. Operators classify dishes using real sales counts and real food costs rather than favorites, because gut feelings about a dish mislead and only the documented pattern across the whole menu shows what to promote, reprice, or cut.",
        explanation:
          "Full credit: describes the two-axis (popularity × profit) classification and its categories, explains popularity ≠ profit (and price ≠ margin), and justifies using real sales/cost data over favorites.",
      },
      {
        topicSlug: "forecasting-demand",
        prompt:
          "Explain how demand forecasting works — from past patterns to a forecast — and explain the biggest risk that comes from trusting a forecast too much. (4–6 sentences.)",
        correctAnswer:
          "Forecasting starts from the fact that a restaurant's past is full of repeating patterns: Fridays beat Tuesdays, seasons differ, weather matters, and nearby events change everything. A forecaster pulls those clues together to estimate a likely number of guests — an estimate, not a promise — which then drives staffing, food orders, and reservation decisions. Used well, this gets the restaurant close enough to be neither drowning nor standing around. The biggest risk is treating the forecast as certain and locking the whole night around it, especially with tunnel vision on a single factor like the day of the week while ignoring a marathon or a heat wave. A confidently wrong forecast is worse than none, so careful operators treat it as one input and adjust the moment reality disagrees.",
        explanation:
          "Full credit: explains forecasting as turning past patterns/clues into a likely demand estimate for staffing/ordering, and identifies over-trusting it (tunnel vision, locked-in plans) as the central danger.",
      },
      {
        topicSlug: "pricing-and-yield",
        prompt:
          "Explain why the 'right price' is less fixed than it feels and why our pricing instincts mislead us, and describe two ways to price more carefully. (4–6 sentences.)",
        correctAnswer:
          "A price isn't just cost-plus arithmetic; it's a signal that shapes how guests judge quality — too cheap reads as low quality, too expensive feels like a rip-off — so the 'right price' depends on perception, not just cost. It also depends on demand: the same seat is worth more at a packed 8 p.m. Saturday than an empty Tuesday afternoon, which is the heart of yield thinking. Our instincts mislead us because gut pricing (round numbers, a standard markup, copying the place next door) often leaves money on the table or scares guests, and tiny invisible changes move behavior a lot. To price more carefully you can test changes and watch what actually sells, and use what's known about how people read menus — charm prices, dropping the dollar sign, or placing a high anchor dish nearby. Adjusting prices by demand, higher when seats are scarce and lower when empty, is another evidence-based move rather than a hunch.",
        explanation:
          "Full credit: explains price as a perception signal and as demand-dependent (yield), that gut pricing is unreliable, and gives valid careful methods (testing, menu psychology like dropping dollar signs/charm pricing/anchoring, demand-based adjustment).",
      },
      {
        topicSlug: "guests-as-data",
        prompt:
          "Explain why repeat guests are often worth more than a constant churn of new ones, what 'lifetime value' means, and the trap of chasing only new faces. (4–6 sentences.)",
        correctAnswer:
          "Winning a brand-new guest is expensive — advertising, discounts, the effort of a first impression — while a returning guest costs almost nothing to bring back, already knows the menu, spends more, and brings friends, so a base of regulars is usually healthier than a room constantly refilled with strangers. 'Lifetime value' means looking at a guest not as one check but as all the visits they might make over months and years, so a twice-a-month regular can be worth far more than a one-time big spender. The trap is pouring everything into first-timers with deep discounts that attract deal-seekers who never return and sometimes lose money per visit, while loyal guests are taken for granted and drift away. That flood of new faces feels like growth but can hollow out the repeat base that keeps the restaurant alive. That's why operators measure loyalty — frequency, recency, and lifetime value — instead of just trusting a warm feeling about 'our regulars.'",
        explanation:
          "Full credit: explains repeat guests are cheaper and worth more than churn, defines lifetime value as total visits over time, and identifies the trap of discount-chasing new faces while neglecting loyal regulars.",
      },
      {
        topicSlug: "reviews-and-sentiment",
        prompt:
          "Explain why reviews at scale should be treated as data rather than single opinions, what the star average can hide, and why one bad review is not a catastrophe. (4–6 sentences.)",
        correctAnswer:
          "A single review is one person's opinion, but a thousand read together become a measurable pattern — which is the idea behind sentiment analysis, turning piles of written words into a signal of what guests praise and complain about repeatedly. So reviews at scale are data: the goal is to hear the whole room and find themes that recur, not to obsess over any one comment. The star average can hide a lot, because a 4.2 built on steady recent praise is very different from a 4.2 propped up by old glowing reviews and recent complaints; the distribution, the recency, and the volume often matter more than the single number. One bad review is not a catastrophe because an angry outlier isn't a pattern — every good restaurant gets a few — and reacting to it while ignoring repeating signals is the real mistake. Reading reviews well means separating recurring signal from one-off noise and watching the trend over time.",
        explanation:
          "Full credit: explains reviews-as-data/sentiment at scale (patterns over single opinions), what the star average hides (distribution, recency, volume), and that a single bad review is an outlier, not a pattern.",
      },
      {
        topicSlug: "dashboard-to-decision",
        prompt:
          "Explain why turning a dashboard into a decision is hard, why 'metrics that matter' beat 'vanity metrics,' and what it means that acting on data can fail in two different directions. (4–6 sentences.)",
        correctAnswer:
          "Turning a dashboard into a decision is hard because a dashboard only measures; it doesn't decide, and two managers can read the same numbers and choose opposite actions. The real skill is asking the right question of the data — what is this telling me to do, and how sure am I — because data informs a decision but never makes it for you. 'Metrics that matter' beat 'vanity metrics' because some numbers look flattering (followers, total revenue, a full room) without changing any decision, while the ones worth watching actually tell you to staff up, reprice a dish, or fix a slow night; picking a few decision-driving numbers beats drowning in pretty ones. Acting on data can fail two ways: overreacting to noise (one bad review, one slow week) tears up things you needed, while ignoring a real signal (creeping costs, regulars slipping away) lets a problem grow. No setting removes both risks at once, so an operator has to judge honestly which mistake is more dangerous right now.",
        explanation:
          "Full credit: explains data informs but people decide, distinguishes decision-driving metrics from flattering vanity metrics, and that errors split into overreacting to noise vs. ignoring real signal — a judgment trade-off.",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Restaurant & Hospitality Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "dashboard-to-decision",
        prompt:
          "Using ideas from across the whole course, argue that one habit of mind — 'resist the simple, flattering story' — runs through hospitality analytics. Show how it applies to at least three different topics (for example: a packed room, a single magic metric, the best-selling dish, a confident forecast, a gut sense of the 'right price,' chasing only new customers, or one angry review). (5–7 sentences.)",
        correctAnswer:
          "The thread running through the whole course is to resist the simple, flattering story and replace it with careful, measured thinking. A packed room feels like success, but a busy restaurant can quietly lose money, so 'busy' has to be checked against covers, turns, check average, and costs. There's no single magic metric either — revenue isn't profit, and you read the numbers together rather than trusting one. The best-selling dish isn't automatically the moneymaker, because popularity isn't profit and a popular plowhorse can earn very little. The same caution undoes the confident forecast (it's odds, not a fact), the gut sense of the 'right price' (our pricing instincts mislead us), the rush to chase only new faces (loyal guests are usually worth more), and the panic over one angry review (an outlier isn't a pattern). That shared habit — harder than believing a neat, comforting story — is what makes hospitality analytics both more honest and more likely to keep a restaurant alive.",
        explanation:
          "Full credit: states the unifying habit (reject simple/flattering stories for measured thinking) and applies it correctly to at least three distinct course topics with accurate detail.",
      },
      {
        topicSlug: "metrics-that-matter",
        prompt:
          "Someone insists, 'A packed restaurant is automatically a successful one — full seats mean it's making money.' Using ideas from the course, argue why a restaurant's success is better understood through several metrics read together. Use at least one concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'packed equals successful' view assumes a single signal — a full room — proves health, but a restaurant's health actually grows from several measurements stacked together. Covers count the guests and turns show how hard each table works, so a packed room that never turns can serve the same people as a calmer one that turns several times. The average check matters too, because two equally busy restaurants earn very differently if one sells drinks and dessert and the other just entrées. Most important, revenue isn't profit: food and labor (prime cost) plus rent come out of every sale, so a record-revenue, packed month can still lose money. For example, a restaurant once had its best sales month ever yet couldn't make payroll, because rising food prices and added staff pushed prime cost past the rough two-thirds-of-sales ceiling operators watch. So 'packed' mistakes a feeling for the bottom line, which only shows up when the metrics are read together.",
        explanation:
          "Full credit: rejects the single-signal 'packed = success' view, explains multiple stacked metrics (covers, turns, check average, costs) and that revenue ≠ profit, and supports it with a concrete example (e.g. record revenue undone by rising prime cost).",
      },
      {
        topicSlug: "pricing-and-yield",
        prompt:
          "Explain why our instincts about pricing are unreliable, why this matters for a restaurant, and how careful, evidence-based pricing can help. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "Our pricing instincts are unreliable because a price is a signal, not just cost-plus arithmetic, and tiny, almost invisible changes move guest behavior far more than gut feeling expects. A price too low quietly reads as low quality and one too high feels like a rip-off, so the 'right price' depends on perception, not just cost — and it also depends on demand, since the same seat is worth more at a packed Saturday night than an empty Tuesday afternoon. This matters because gut pricing — round numbers, a standard markup, copying the place next door — routinely leaves money on the table or scares guests away. Careful pricing helps by replacing the hunch with evidence: test changes and watch what actually sells, use what's known about how people read menus, and adjust prices by demand. For example, a hospitality study gave guests the same menu with prices written as '$20.00' or simply '20,' and the guests reading it without the dollar sign spent noticeably more, even though the food and prices were identical. That shows only careful testing, not instinct, reveals what truly moves a guest.",
        explanation:
          "Full credit: explains price as a perception signal and demand-dependent (yield), that gut pricing is unreliable and costly, names evidence-based methods, and supports it with a concrete example (e.g. the dropped-dollar-sign menu study).",
      },
      {
        topicSlug: "guests-as-data",
        prompt:
          "An owner says, 'I should spend almost everything on attracting brand-new customers — that's how you grow.' Using the course, explain why repeat guests and lifetime value matter so much, and what an owner should check before pouring money into new faces. Use a concrete example or figure. (5–7 sentences.)",
        correctAnswer:
          "The 'all-in on new customers' view ignores how expensive new guests are to win — advertising, discounts, the effort of a first impression — compared with a returning guest who costs almost nothing to bring back, already knows the menu, spends more, and refers friends. That's why lifetime value matters: a guest isn't one check but all the visits they might make over months and years, so a twice-a-month regular can be worth far more than a one-time big spender. Chasing only new faces with deep discounts tends to attract deal-seekers who never return and can lose money on each visit, while loyal guests, taken for granted, quietly drift away. We know retention is powerful: a widely cited study found that improving customer retention by just 5% could raise profits by roughly 25% to 95%, because loyal customers cost less, spend more over time, and refer others. Before pouring money into new faces, an owner should check loyalty metrics — how often guests return (frequency), how recently they last came (recency), and their lifetime value — to see whether the existing base is being kept or lost. Otherwise the flood of new customers can hollow out the very base that keeps the restaurant alive.",
        explanation:
          "Full credit: explains repeat guests are cheaper and worth more (lifetime value), warns the discount-chasing trap can lose money and neglect regulars, cites evidence retention is valuable (e.g. ~5% retention → large profit gains), and names what to check (frequency, recency, LTV).",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about hospitality analytics cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete restaurant and hospitality situations.",
    lectureTitle: "Primer: How to reason about hospitality analytics cases",
    body: `# How to reason about hospitality analytics cases

This short primer prepares you for the **Hospitality Analytics** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — a packed dining room, a best-selling dish, a slow Tuesday, a one-star review — and asks what the course's ideas tell you about it. Knowing the words "lifetime value" or "prime cost" is not enough; the question wants you to recognize *when* you are looking at one and *why* it matters here.

## What the questions reward

- **Naming the right idea** — match the situation to the concept that fits it: why busy isn't always profitable, what a menu's popularity does and doesn't tell you, why a forecast is only an estimate, when a price signal matters, why a regular can be worth more than a stranger, how to read a review at scale.
- **Using evidence from the scene** — point to the detail in the situation that supports your answer, rather than answering from a general impression.
- **Avoiding the flattering reading** — the course measures what's really happening; it does not assume the most comforting explanation. The best answers stay grounded in the numbers, not in how a night feels.

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

This short primer prepares you for the **General Reasoning** diagnostic — an *ungraded* check that tests five genuine reasoning skills. These are the same skills you use to decide what a set of facts really shows, so they matter directly for thinking clearly about what the numbers are telling you.

## The five skills

- **Analysis** — break an argument into parts: find its **point** (the conclusion), the **reasons** given for it, and any hidden assumption it leans on. Ask: "What is this trying to convince me of, and what does it take for granted?"
- **Inference** — work out what *follows* from what you're told, and how strongly. Tell apart what *must* be true, what is *likely*, and what is only *possible*.
- **Evaluation** — judge how much the reasons actually support the point. Notice when evidence is beside the point, a source isn't trustworthy, or a step doesn't really connect.
- **Deduction** — reasoning where true starting facts *guarantee* the conclusion. If the starting facts are true, the conclusion can't be false. Watch for sneaky forms that only *look* airtight.
- **Induction** — reasoning from a few examples to a *probable* general rule or prediction. Strong induction uses many fair examples; weak induction over-generalizes from too few.

## A recurring trap: things that move together

Most wrong answers are statements that *sound* reasonable but are **not actually backed up by what you were told**. The discipline this check rewards is the same one careful work with data demands: keep apart what the facts **show**, what you're **assuming**, and what only *sounds* right. Two things happening together does not prove one causes the other.

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
  // The course was migrated to the Restaurant & Hospitality Analytics for
  // Children syllabus. Detect the marker topic; if present and the content
  // version matches, the content is current and we skip. This makes the seed
  // self-healing across environments: a database that still holds older content
  // (e.g. a previous curriculum) is detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-hospitality-analytics-is"));
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
        "Seed: stale course content detected — replacing with the Restaurant & Hospitality Analytics for Children curriculum",
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
