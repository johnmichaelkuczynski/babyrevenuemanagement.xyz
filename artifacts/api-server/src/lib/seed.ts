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
const SEED_CONTENT_VERSION = "2026-06-16-financial-managerial-analytics-for-children-v1";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Financial & Managerial Analytics for Everyone
  {
    slug: "what-financial-analytics-is",
    title: "What financial & managerial analytics is",
    weekNumber: 1,
    blurb: "Financial analytics asks whether a business is really making money — and most of what gut instinct tells you about that is a myth.",
    lectureTitle: "1.1 What financial & managerial analytics is (the business as a story in numbers)",
    body: `# What financial & managerial analytics is

Almost everything most people "know" about whether a business is doing well comes from gut feeling and a busy storefront. Those feelings are powerful, but they're often wrong. **Financial and managerial analytics** is the careful study of the question those instincts only pretend to answer: is this business actually making money, and how would we know — not by how it feels, but by what the numbers show?

## A business you can actually read

Every business — a lemonade stand, a bakery, a giant company — tells a **story in numbers.** Financial and managerial analytics is the skill of reading that story instead of guessing at it. It turns a busy, confusing place full of sales, bills, and effort into things you can follow: how much money came in, how much went out, what's left over, and whether each thing the business does actually pays for itself. The goal isn't to make business cold; it's to see clearly what's really happening so you can keep the doors open.

## Two readers of the same story

There are really two audiences for this story, and that's the "financial *and* managerial" part. **Financial analytics** is the version told to outsiders — owners, lenders, the tax office — like an official scoreboard reporting how the team did. **Managerial analytics** is the version used inside the business by the people making decisions, like a dashboard a driver watches *while* steering. Same business, same numbers underneath, but one looks back to report and the other looks ahead to decide.

## A number is a measurement, not the money

Here's something easy to forget: a "metric" isn't the same as the business itself. It's a **measurement** we choose to take. Profit, sales, cash on hand — each is one snapshot, not the whole story. There's even a saying that captures the biggest trap here: **profit is an opinion, but cash is a fact.** Profit depends on choices about *when* to count things; the actual cash in the drawer does not. Good analysts keep that difference in mind instead of trusting a single comforting number.

## The myths the numbers tell you

Business lore is full of confident myths: that high sales mean a healthy company, that "profit on paper" means money in the bank, that a low price always wins more customers, that growing fast is the same as doing well. None of these hold up on their own. A company can post record sales and quietly run out of cash; a fast-growing business can lose a little more on every single sale. A big part of this course is **un-learning** those myths and replacing them with a few honest numbers read together.

## Why this matters

Getting this right isn't just for big companies with finance teams. The same ideas decide whether a small shop survives its first three years, whether a family can tell if a side business is worth the effort, and whether a good idea is also a workable one. When people run on myth instead of measurement, real harm follows — savings vanish, jobs are lost, the doors close. Reading a business honestly is a kind of fairness to everyone who depends on it.

## In the real world

One of the most surprising facts in business is that **profitable companies go broke all the time.** A growing business can show a healthy profit on its reports and still fail, because it ran out of *cash* — its money was tied up in unsold inventory or in customers who hadn't paid yet, while the rent and payroll came due now. Studies of why small businesses fail keep pointing to running out of cash, not lack of profit, as a leading cause. That gap between looking profitable and actually having money is exactly the kind of thing analytics is meant to catch — and it's the warning that runs through this whole course.`,
  },
  {
    slug: "three-financial-statements",
    title: "The three financial statements",
    weekNumber: 1,
    blurb: "No single report tells you if a business is healthy — the income statement, balance sheet, and cash flow statement only make sense read together.",
    lectureTitle: "1.2 Reading the score (the three financial statements at a glance)",
    body: `# The three financial statements

When someone asks "how's the business doing?", everyone wants one simple report. The honest answer is that the story is told by **three different reports**, and any one of them alone can mislead you. Together they're like reading several vital signs at once instead of trusting your pulse alone. This section is about what each one shows — and why you need all three.

## The income statement: did we make a profit?

The **income statement** answers one question over a stretch of time: did we earn more than we spent? It starts with the money the business made from selling things (**revenue**), subtracts the costs of running the business, and ends with what's left over (**profit**, sometimes called the "bottom line" because it's literally the last line). It's the report people quote most. But it covers only *profit over a period* — it doesn't tell you what the business owns, owes, or whether it actually has cash right now.

## The balance sheet: a snapshot of what we own and owe

The **balance sheet** is a photograph taken on a single day. It lists what the business **owns** (its *assets* — cash, equipment, inventory) and what it **owes** (its *liabilities* — loans, unpaid bills), and the difference between them is the owner's stake. It always "balances" because everything the business has was paid for either by borrowing or by the owners. Where the income statement is a movie of a whole period, the balance sheet is a still frame of one moment.

## The cash flow statement: where the money actually went

The **cash flow statement** tracks the one thing that keeps the lights on: actual cash moving in and out. This matters because of that earlier saying — **profit is an opinion, cash is a fact.** A sale can count as profit the moment it's made, even if the customer won't pay for sixty days, so a business can show a profit while its bank account drains. The cash flow statement strips away the timing tricks and shows the plain truth of whether more money came in than went out.

## Why you read all three together

Here's the key idea: **no single statement is the whole story.** The income statement can show a profit while the cash flow statement shows the business is bleeding money. The balance sheet can look strong while profits are sliding. Each report answers a different question — *Did we earn?*, *What do we have?*, *Did cash come in?* — and only by reading them side by side do you see whether a business is genuinely healthy or just looks that way from one angle.

## In the real world

Plenty of companies have reported glowing profits right up until they collapsed, because the profit was on paper while the cash quietly ran out. It happens so often that the cash flow statement — now considered essential — wasn't even *required* of U.S. companies until 1987, after too many "profitable" businesses surprised everyone by failing. The lesson investors learned the hard way is this section's whole point: a single shiny report is a starting point, not the truth. You only see what's really happening when you read the score, the snapshot, and the cash all at once.`,
  },
  {
    slug: "cost-behavior",
    title: "Cost behavior: fixed and variable",
    weekNumber: 1,
    blurb: "\"What did it cost to make?\" has no single answer — costs behave differently, and the same item can cost very different amounts depending on how many you make.",
    lectureTitle: "1.3 Where the money goes (fixed, variable, and the cost behavior trick)",
    body: `# Cost behavior: fixed and variable

Ask "how much does it cost to make one of these?" and most people expect a single, fixed number. One of the most useful — and most surprising — ideas in managerial analytics is that there often *isn't* one. Costs **behave** in different ways, and once you see how, a "trick" appears that explains why making more of something can quietly make each one cheaper.

## Two kinds of cost

Costs split into two families. **Fixed costs** stay roughly the same no matter how much you sell: the rent on the shop, the manager's salary, the insurance. Whether you serve one customer or a thousand, the rent is the rent. **Variable costs** rise and fall with how much you make: the flour in each loaf of bread, the box each order ships in, the electricity to run a machine longer. Sorting every cost into "stays the same" or "grows with each unit" is the first move of cost analysis.

## The cost behavior trick

Here's the trick that trips people up: because fixed costs stay put, the cost *per item* changes as you make more. Imagine rent is the only fixed cost. Make ten loaves and each loaf carries one-tenth of the rent; make a thousand and each carries one-thousandth. The fixed cost gets **spread thinner** over more units, so the average cost per loaf falls — even though nothing about the recipe changed. This is why bigger producers can often charge less: they're not magic, they're just spreading their fixed costs over more sales.

## Why "what did it cost?" is a trap

This is why "what did this product cost us to make?" is a trap question. The honest answer is "it depends on how many we made." If you treat a cost as one fixed number, you'll misprice things, misjudge which products are worth selling, and panic over the wrong numbers. Good managers always ask *which kind* of cost they're looking at and *at what volume*, instead of trusting a single cost tag.

## The most important cost is the next one

For decisions, the cost that matters most is the **marginal cost** — what it costs to make just *one more.* Once the rent is paid and the machine is on, one extra unit might cost almost nothing. That's why a business will sometimes happily sell something cheaply that "cost a lot to make": the fixed part is already spent, so any price above the tiny extra cost adds money. Confusing the average cost with the cost of the next one leads to turning away good sales.

## In the real world

Think of an airplane about to take off with ten empty seats. The flight's big costs — the plane, the crew, the fuel — are **fixed**: they're the same whether those seats are full or empty. The cost of letting one more passenger board an already-departing flight is tiny: a bit more fuel and a snack. That's why airlines sell last-minute empty seats cheap; almost any price beats flying them empty. It's a perfect picture of cost behavior: the seat didn't get cheaper to provide overall — but the cost of *one more* passenger was nearly nothing, and that's the number the decision turns on.`,
  },
  {
    slug: "break-even",
    title: "Break-even",
    weekNumber: 1,
    blurb: "Before you can know if a price or a plan works, you need one number: how much you must sell just to stop losing money.",
    lectureTitle: "1.4 Break-even (the single most useful number in business)",
    body: `# Break-even

If you could keep only one number about a business, many experts would keep this one: the **break-even point** — how much you have to sell before you stop losing money and start making it. It's the line between "this is draining money" and "this is finally paying for itself," and a shocking number of business decisions go wrong simply because nobody worked it out.

## What break-even means

The break-even point is the amount of sales where **total money in exactly equals total money out** — no profit, no loss. Below it, every day you're a little in the hole; above it, you're finally ahead. It quietly answers the most important question before you start: *how much do we need to sell just to survive?* If that number is wildly higher than what you could realistically sell, the plan is broken before it begins, and break-even tells you that early.

## Contribution: what each sale chips in

To find break-even you need one idea: each sale doesn't have to cover *everything*, just its own variable cost — and whatever is left over **contributes** to paying the fixed costs. If a drink sells for $3 and the cup, lid, and liquid cost $1, that drink contributes $2 toward the rent. Keep selling, and those $2 chunks stack up until the fixed costs are fully covered. The moment they are, you've broken even, and every sale after that is profit.

## Why it's the most useful number

Break-even is so useful because it turns vague hopes into a concrete target. Instead of "I hope this does well," you get "we need to sell 200 of these a month to cover our costs." That single number lets you sanity-check a price, a rent, or a whole business idea in minutes. It also reframes decisions: raising the price or trimming a fixed cost lowers the number you must hit, while a cheap price can push break-even so high you could never reach it.

## The low-price trap

This is where a common myth falls apart: "just lower the price and we'll sell enough to make it up." Cutting the price shrinks how much each sale contributes, which *raises* the number you must sell to break even — sometimes to impossible heights. A business can be busy, selling tons, and still lose money on every transaction because the price never covered the costs. Knowing your break-even point is what protects you from cheerfully selling your way into bankruptcy.

## In the real world

Hollywood lives and dies by break-even. A movie doesn't break even at its production budget — a film that cost $100 million to make usually has to earn roughly **twice** that at the box office just to break even, because theaters keep about half the ticket money and marketing can cost nearly as much as the film itself. That's why a movie can gross "over $150 million" and still be called a flop: it never crossed its real break-even line. The number that decides a hit isn't the splashy gross — it's the quiet break-even point underneath it.`,
  },
  {
    slug: "budgets-and-variance",
    title: "Budgets and variance",
    weekNumber: 1,
    blurb: "A budget isn't a prediction that's right or wrong — it's a plan, and the gap between plan and reality is where the real lessons hide.",
    lectureTitle: "1.5 Budgets and variance (plan vs. reality)",
    body: `# Budgets and variance

People treat a **budget** like a fortune-teller's prediction — something that's either right or wrong by year's end. That's the wrong way to think about it. A budget is a **plan written in numbers**, and its real value shows up later, when you compare it against what actually happened. That gap between plan and reality has a name — **variance** — and learning to read it is one of the most practical skills in managerial analytics.

## A budget is a plan, not a promise

A budget says, in advance, "here's what we expect to bring in and spend." It's how a business turns goals into something checkable: how much to sell, how much to spend on supplies, how many people to hire. It will never be exactly right — the future never is — and that's fine. A budget isn't a promise to hit every number; it's a baseline you can measure reality against so you notice, quickly, when things drift off course.

## Variance: the gap that teaches you

**Variance** is simply the difference between what you planned and what actually happened. Planned to spend $1,000 on supplies but spent $1,300? That's a $300 variance. The point of measuring it isn't to assign blame — it's to ask *why.* A big surprise, good or bad, is a signal that the world didn't behave the way you assumed, and chasing down the reason is where the real understanding comes from.

## Favorable isn't always good news

Here's the subtle part: variances come in two flavors, and the labels can fool you. A **favorable** variance helped profit (you spent less, or earned more); an **unfavorable** one hurt it. But "favorable" doesn't always mean "good." Spending far less than budgeted on training looks favorable on paper yet might be quietly starving the business. And hitting your sales target can hide an ugly truth — like reaching it only by slashing prices, which is a favorable volume but an unfavorable price. The labels tell you the direction, not the wisdom.

## Plans should bend, not break

Because reality always differs from the plan, good managers treat a budget as a living guide, not a cage. When a big variance shows up, the question isn't "who broke the rule?" but "what changed, and should the plan change too?" A budget held too rigidly makes people hit numbers that no longer make sense; a budget ignored entirely leaves you flying blind. The skill is using the gaps to learn and adjust, not to punish or to panic.

## In the real world

Big public projects are famous for enormous unfavorable variances: study after study finds that most large infrastructure projects — bridges, tunnels, rail lines — come in **over budget**, often dramatically so. Researchers who collected hundreds of these found cost overruns were the rule, not the exception. The valuable part isn't shaming the planners; it's what the variances *teach* — that early estimates are systematically too rosy, so future budgets should plan for the surprises that history says are coming. That's variance doing its real job: turning the gap between plan and reality into a lesson for next time.`,
  },
  {
    slug: "unit-economics",
    title: "Unit economics",
    weekNumber: 1,
    blurb: "Growing sales feels like winning — but if each individual sale loses money, growing only digs the hole faster.",
    lectureTitle: "1.6 Unit economics (does each sale actually make money?)",
    body: `# Unit economics

A chart of sales climbing up and to the right feels like the very picture of success. But one of the most important questions in business is hiding underneath that chart, and it's almost embarrassingly simple: **does each single sale actually make money?** This is **unit economics** — zooming all the way in from the whole company to one transaction — and it's where a lot of impressive-looking businesses fall apart.

## One sale at a time

Unit economics asks you to look at a single "unit" — one product sold, one customer served, one subscription — and check whether it earns more than it costs. If selling one item brings in more than that item's own costs, the business has a chance; if each one loses money, no amount of selling will save it. It's the same idea as break-even, pointed at the smallest possible piece: get the single sale right, and the whole can work; get it wrong, and scale only makes it worse.

## The "make it up in volume" trap

There's an old joke: "we lose a little on every sale, but we make it up in volume." It's a joke because it's impossible — if every sale loses money, more sales mean *bigger* losses, not profit. Yet businesses fall for a fancier version of it all the time, especially fast-growing ones, telling themselves that growth now will somehow turn into profit later even though each customer costs more to serve than they bring in. Volume can only rescue you if the underlying unit already makes money.

## What it really costs to win a customer

A fair unit-economics check counts *all* the costs of a sale, including the often-forgotten one: what you spent to win that customer in the first place — the ads, the discounts, the free trial. Smart operators compare what a customer is worth over their whole relationship (their **lifetime value**) against what it cost to acquire them. If you spend more to land a customer than they'll ever spend with you, every new customer quietly makes the hole deeper, no matter how exciting the growth chart looks.

## Why this discipline is hard

Unit economics is unglamorous, and that's exactly why it gets skipped. Total revenue and user counts make for thrilling headlines and happy investors; "we lose $4 every time someone buys" does not. So the comforting big numbers get celebrated while the painful per-sale number goes unexamined. The discipline is to keep asking the small, honest question even when the big numbers are flattering — because the single sale, not the grand total, decides whether the business can ever stand on its own.

## In the real world

A famous example is the movie-ticket subscription that, for a while, let people see almost unlimited movies for about ten dollars a month. Customers loved it and signups exploded — the growth chart was spectacular. But the company *paid theaters close to full price* for each ticket, so a single heavy user could cost far more than ten dollars in a single month. Every enthusiastic new subscriber made the losses worse, and the business burned through its money and collapsed. The sales were real and the growth was real; the unit economics never worked, and that's what decided it.`,
  },
  {
    slug: "forecasting-and-kpis",
    title: "Forecasting and KPIs",
    weekNumber: 1,
    blurb: "A forecast is an educated guess about a future that hasn't happened, and the dials you choose to watch quietly decide what you'll do about it.",
    lectureTitle: "1.7 Forecasting and KPIs (steering by the right dials)",
    body: `# Forecasting and KPIs

Running a business by looking only at last month's reports is like driving while staring in the rear-view mirror. The forward-looking half of managerial analytics has two parts: **forecasting** (an educated guess about what's coming) and **KPIs** (the handful of dials you watch to steer). Both are powerful, and both are easy to get dangerously wrong.

## Forecasting: an educated guess, not a crystal ball

A **forecast** turns clues from the past — last year's sales, the season, the trend — into a likely number for the future, so you can plan: how much to order, how many people to hire, whether you can afford something. The crucial word is *likely.* A forecast is a set of odds, not a promise, because it's about a future that hasn't decided to happen yet. Used humbly, it helps you prepare; treated as fact, it sets you up to be caught out when reality disagrees.

## KPIs: the few dials that matter

A business can measure thousands of things, but a driver doesn't watch a hundred gauges. **KPIs** — Key Performance Indicators — are the few numbers a business decides are most important to watch, the ones that actually tell you whether you're on course. The skill isn't collecting more numbers; it's choosing the *right* few. Pick the dials that genuinely signal health, and a quick glance tells you what to do; drown in dials, and the important warning light gets lost in the clutter.

## Leading vs. lagging dials

Not all dials are equal. A **lagging** indicator tells you what already happened — last month's profit, like a final score you can't change. A **leading** indicator hints at what's coming — like how many people asked for a quote this week, which signals next month's sales. Both matter, but leading indicators are what let you steer *before* you hit trouble, instead of just reading about it afterward. A good dashboard mixes the two so you can both keep score and see around the corner.

## The vanity-metric trap

The biggest danger is choosing flattering dials instead of useful ones. A **vanity metric** is a number that looks great and feels good — total followers, total signups, all-time sales — but doesn't actually tell you what to do. It only ever goes up, so it always seems like good news, even while the business quietly struggles. The cure is to ask of every dial: *if this number moved, would I do anything differently?* If the answer is no, it's decoration, not a KPI.

## In the real world

Many fast-growing apps have proudly watched their **total registered users** climb — a number that can only rise — while a deadlier dial went ignored: how many of those users actually *stayed.* If new people sign up but quietly leave just as fast, the impressive "total users" hides a leaking bucket, and the company is shocked when growth suddenly stalls. The fix is choosing a KPI that can deliver bad news, like active users or the rate people leave, instead of a vanity metric that only ever flatters you. Steering by the right dial is the whole point.`,
  },
  {
    slug: "numbers-to-decisions",
    title: "From numbers to decisions (capstone)",
    weekNumber: 1,
    blurb: "Can a page full of numbers actually run a business? Only with judgment — and the whole course comes together in how data turns into a decision.",
    lectureTitle: "1.8 From numbers to decisions, and what comes next (Capstone)",
    body: `# From numbers to decisions (capstone)

We end on the hardest, highest-stakes skill in the whole field: **turning numbers into an actual decision.** An owner deciding whether to raise prices, a manager choosing what to cut, a founder deciding whether the business can survive — all of them have to move from *measuring* to *acting.* Everything in this course comes together here, including its deepest limits.

## The hardest step: numbers to action

A spreadsheet doesn't decide anything; **people do.** It's tempting to think that once you have the data, the answer is automatic — but two managers can read the same numbers and choose opposite things. The real skill isn't collecting figures; it's asking the right question of them: *what is this number telling me to do, and how sure am I?* Data informs the decision; it never makes it for you.

## Vanity metrics vs. metrics that matter

For a long time, businesses chased whatever number felt flattering — total sales, total followers, a busy storefront — and quietly mistook those for health. The improvement comes from separating **vanity metrics** (numbers that look good but don't change a decision) from the **metrics that matter** (the ones that actually tell you to raise a price, cut a product, or fix the cash problem). Picking the right few numbers to watch beats drowning in a dashboard of pretty ones — just as a careful checklist beats a flattering gut feeling.

## The cost of acting wrong (both ways)

Every decision from data can fail in two directions, and both hurt. **Overreact** to a number that was just noise — one slow week, one scary-looking variance — and you cut staff or kill a product you needed. **Ignore** a number that was a real signal — cash quietly draining, each sale losing money — and the problem grows until it's fatal. There's no setting that removes both risks at once, so an operator has to judge, openly and honestly, which mistake is more dangerous right now.

## Tying the course together

Look back and you'll see one thread through all eight topics: **resist the simple, flattering story.** Profit on paper isn't cash in the bank, one report isn't the whole picture, a single cost tag hides how costs really behave, a low price can sell you into bankruptcy, a budget isn't a promise, growing sales can lose money on every unit, and a flattering dial isn't a useful one. Financial and managerial analytics replaces tidy assumptions with careful, honest, measured thinking — which is harder, but it's the only kind that actually keeps a business alive.

## The biggest questions stay open

And plenty stays unsettled. How do you weigh what the numbers say against the vision and judgment that build great companies? How much should a leader trust a spreadsheet over their read of the situation? How do you keep your metrics from quietly steering you toward short-term tricks that look good on a report but hurt the business? Analytics gives a business better questions and more honest answers — not final ones. The most useful habit to carry out of this course is simple: whenever a number tells a clean, comforting story, ask, "Is that real, or is it a myth?"

## In the real world

When struggling companies are turned around, the story is rarely a single magic number — it's someone finally reading the numbers honestly *and* having the judgment to act. A classic turnaround move is discovering, through unit economics, that a beloved product or customer actually loses money on every sale, and making the painful decision to cut it — which feels like shrinking but restores the company to health. The numbers revealed the truth, but a person still had to choose to believe them and act. That marriage of honest numbers and human judgment is where this whole course has been heading.`,
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
    title: "Homework 1.1 — Statements, costs, and break-even",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. There's no need for any math — just explain your thinking clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-financial-analytics-is",
        prompt:
          "A friend says, 'You can tell a business is doing great just by seeing lots of customers and big sales — high sales means it's winning.' Use what financial analytics actually shows to explain why 'big sales means healthy' is a myth. (3–5 sentences.)",
        correctAnswer:
          "Big sales only tell you money is coming in, not whether the business is actually healthy. A company can post record sales and still run out of cash or even lose money on each sale, because what matters is what's left after costs and whether real cash is in the bank — not the size of the sales number. There's a reason people say profit is an opinion but cash is a fact: a sale can be counted before the customer has actually paid. So my friend is mistaking a busy, high-sales feeling for proof of health, which is exactly the trap analytics is meant to catch.",
        explanation:
          "Full credit: explains that high sales is money in, not proof of health/profit; notes costs and cash matter (a busy business can still lose money or run out of cash); and that real health shows up in measured numbers read together, not a single flattering figure.",
      },
      {
        topicSlug: "three-financial-statements",
        prompt:
          "A bakery shows a healthy profit on its income statement, but the owner can't make this month's rent. Using the idea that you must read the three statements together, explain how both things can be true at once. (3–5 sentences.)",
        correctAnswer:
          "The income statement shows profit over a period, but profit isn't the same as cash in the bank — that's the saying 'profit is an opinion, cash is a fact.' The bakery may have counted sales as profit even though customers haven't paid yet, or tied its cash up in unsold inventory, so the cash flow statement would reveal money draining out even while the income statement looks good. That's why no single report tells the story: each one answers a different question (did we earn? what do we have? did cash come in?). Reading them together shows a profitable-looking bakery can still be unable to pay the rent right now.",
        explanation:
          "Full credit: distinguishes profit (income statement) from cash (cash flow statement), gives a reason profit can outrun cash (unpaid customers, inventory, timing), and explains the statements must be read together because each answers a different question.",
        hint: "Think about whether a profit on paper is the same as money in the bank, and which statement would reveal the difference.",
      },
      {
        topicSlug: "cost-behavior",
        prompt:
          "Someone asks, 'What does it cost us to make one of these mugs?' and expects a single fixed number. Using cost behavior, explain two things this question gets wrong. (3–5 sentences.)",
        correctAnswer:
          "First, costs come in two kinds — fixed costs like rent that stay the same no matter how many mugs you make, and variable costs like clay that grow with each mug — so there isn't one single 'cost to make a mug.' Second, because fixed costs get spread over however many mugs you produce, the cost per mug actually changes with volume: make ten and each carries a tenth of the rent, make a thousand and each carries far less. So the honest answer is 'it depends on how many we make.' For most decisions, what matters is the marginal cost — what it costs to make just one more — which can be much smaller than the average cost once the fixed costs are already paid.",
        explanation:
          "Full credit: distinguishes fixed vs variable costs, explains that fixed costs spread over volume so per-unit cost changes with how many are made (no single fixed number), and/or notes marginal cost (the next unit) is what matters for decisions.",
      },
      {
        topicSlug: "break-even",
        prompt:
          "A new juice stand owner says, 'I'll just lower my prices way down — that way I'll sell tons and definitely make money.' Explain what break-even is and why this plan could backfire. (3–5 sentences.)",
        correctAnswer:
          "The break-even point is how much you have to sell before total money in equals total money out — the line where you stop losing money and start making it. Each sale only contributes what's left after its own variable cost toward covering the fixed costs like rent, so a much lower price shrinks that contribution and actually raises the number of sales you need to break even, sometimes to an impossible level. That means the owner could be busy, selling tons of juice, and still lose money on every cup because the price never covered the costs. Lowering the price doesn't 'definitely make money' unless they first check whether they could ever realistically sell enough to reach the new, higher break-even point.",
        explanation:
          "Full credit: defines break-even as the sales level where revenue equals total cost, explains a lower price shrinks each sale's contribution and raises the break-even point, and warns that high volume at too low a price can still lose money on every sale.",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Budgets, unit economics, KPIs, and decisions",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. No math is required — explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "budgets-and-variance",
        prompt:
          "A manager is furious that the team spent $300 more on supplies than the budget said, and wants to punish whoever's responsible. Explain a better way to think about a budget and this variance. (3–5 sentences.)",
        correctAnswer:
          "A budget isn't a promise that must be hit exactly; it's a plan written in numbers that you compare against reality so you can spot when things drift. The $300 gap is a variance, and the useful response is to ask why it happened rather than to assign blame — maybe supply prices rose, or the team made more product than planned, which would actually be good news. Variances are signals that the world didn't behave as assumed, and chasing the reason is where the learning is. A budget held too rigidly forces people to hit numbers that may no longer make sense, so the manager should use the gap to understand and adjust, not to punish.",
        explanation:
          "Full credit: explains a budget is a plan/baseline not a promise, that variance is the plan-vs-actual gap whose value is asking 'why' (not blame), and that some variances reflect changed circumstances and should inform adjusting the plan.",
        hint: "Is a budget a prediction that's right or wrong, or a plan you measure reality against? What is the gap actually telling you?",
      },
      {
        topicSlug: "unit-economics",
        prompt:
          "A startup brags that it's growing fast — signups are doubling every month — but it spends more to win and serve each customer than that customer ever pays. Explain why fast growth here is a problem, not a victory. (3–5 sentences.)",
        correctAnswer:
          "Unit economics asks whether a single sale or customer actually makes money, and here each customer costs more than they bring in, so every one is sold at a loss. When the unit loses money, growth makes things worse, not better — doubling signups doubles the losses, which is the real version of the old joke about 'losing money on every sale but making it up in volume.' Volume can only help if the underlying customer is already profitable once you count everything, including what was spent to acquire them. So the exciting growth chart is actually digging the hole faster, and the startup needs to fix the per-customer math before scaling.",
        explanation:
          "Full credit: explains unit economics (does one sale/customer make money), that growth multiplies losses when each unit loses money, and that acquisition/serving costs must be counted; volume only helps if the unit is already profitable.",
      },
      {
        topicSlug: "forecasting-and-kpis",
        prompt:
          "A founder proudly points to a chart of 'total users, all time' that keeps climbing as proof the app is thriving. Explain why this might be a vanity metric and what dial would be more useful. (3–5 sentences.)",
        correctAnswer:
          "A 'total users, all time' count can only ever go up, so it always looks like good news and never tells the founder to do anything — that's what makes it a vanity metric. It can hide a leaking bucket: lots of people sign up while just as many quietly leave, so the business looks healthy right until growth stalls. A more useful KPI is one that can deliver bad news, like active users, how many people stay (retention), or the rate at which they leave (churn). The test for any dial is simple: if this number moved, would I do anything differently? If not, it's decoration, not a real KPI.",
        explanation:
          "Full credit: explains a vanity metric looks good but doesn't change a decision (a number that only rises), that 'total users' can hide churn, and names a more actionable KPI (active users, retention, churn); may cite the 'would I act differently?' test.",
      },
      {
        topicSlug: "numbers-to-decisions",
        prompt:
          "A new manager is proud that the business now has a dashboard showing dozens of numbers. Explain why having all that data isn't the same as making a good decision, and what separates a 'metric that matters' from a 'vanity metric.' (3–5 sentences.)",
        correctAnswer:
          "A dashboard measures things, but it doesn't decide anything — people do, and two managers can read the same numbers and choose opposite actions. The real skill is asking the right question of the data: what is this number telling me to do, and how sure am I? A 'metric that matters' is one that actually changes a decision — raise a price, cut a product, fix the cash problem — while a 'vanity metric' just looks flattering (total sales, follower counts) without telling you to act. So watching a few decision-driving numbers beats drowning in a dashboard of pretty ones, and the data still needs human judgment to become a good decision.",
        explanation:
          "Full credit: explains that data informs but doesn't make decisions (people do), and distinguishes metrics that drive action from flattering vanity metrics that don't change what you do.",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Financial & Managerial Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-financial-analytics-is",
        prompt:
          "Explain what financial and managerial analytics is, including the difference between the 'financial' and 'managerial' sides, and why it insists that 'a number is a measurement, not the money.' Why does keeping that distinction matter? (4–6 sentences.)",
        correctAnswer:
          "Financial and managerial analytics is the practice of reading a business through its numbers instead of guessing — turning sales, bills, and effort into things you can follow to tell whether it's really making money. The 'financial' side reports the story to outsiders like owners and lenders, a kind of official scoreboard looking back; the 'managerial' side is used inside the business to make decisions, like a dashboard you watch while steering ahead. Saying 'a number is a measurement, not the money' means a metric like profit is just one chosen snapshot, not the actual cash or the whole business — captured by the saying 'profit is an opinion, cash is a fact.' That distinction matters because confusing a flattering measurement for reality leads to bad calls: you might celebrate a profit while the cash runs out, or trust one number while the real story hides behind it. Keeping measurement and reality apart is the first habit of clear thinking about a business.",
        explanation:
          "Full credit: defines the field as evidence-based reading of a business, distinguishes financial (outward report) from managerial (internal decisions), explains a metric as a chosen snapshot (profit is an opinion, cash is a fact), and why separating measurement from reality supports clear decisions.",
      },
      {
        topicSlug: "three-financial-statements",
        prompt:
          "Describe the three financial statements and the different question each one answers, and explain why a business's health can only be read by looking at all three together. (4–6 sentences.)",
        correctAnswer:
          "The income statement answers 'did we make a profit?' over a period — revenue minus costs down to the bottom line. The balance sheet is a snapshot on one day answering 'what do we own and owe?' — assets versus liabilities, with the difference being the owner's stake. The cash flow statement answers 'did cash actually come in?' by tracking real money moving in and out, which matters because profit is an opinion while cash is a fact. You need all three because each can mislead alone: the income statement can show a profit while the cash flow statement shows the business bleeding money, or the balance sheet can look strong while profits slide. Only reading them side by side — earnings, what's owned, and actual cash — reveals whether a business is genuinely healthy or just looks that way from one angle.",
        explanation:
          "Full credit: names the three statements and the distinct question each answers (profit over a period; owns/owes snapshot; actual cash flow), and explains health requires all three together because any one alone (e.g. profit without cash) can mislead.",
      },
      {
        topicSlug: "cost-behavior",
        prompt:
          "Explain the difference between fixed and variable costs, the 'cost behavior trick' that makes per-unit cost change with volume, and why marginal cost is what matters for many decisions. (4–6 sentences.)",
        correctAnswer:
          "Fixed costs stay roughly the same no matter how much you make — rent, salaries, insurance — while variable costs rise and fall with each unit, like the materials in each item. The 'cost behavior trick' is that because fixed costs stay put, the cost per unit changes with volume: make ten items and each carries a tenth of the rent, make a thousand and each carries far less, so the average cost per unit falls as you spread fixed costs thinner. That's why 'what did it cost to make one?' is a trap question — the honest answer is 'it depends how many we made.' For decisions, the most useful figure is often the marginal cost, what it costs to make just one more, which can be tiny once the fixed costs are already paid. That's why a business will sometimes sell something cheaply that seemed expensive to make: any price above the small extra cost still adds money.",
        explanation:
          "Full credit: distinguishes fixed vs variable costs, explains fixed costs spread over volume so per-unit cost drops as output rises (no single cost), and explains marginal cost (the next unit) drives decisions and can be far below average cost.",
      },
      {
        topicSlug: "break-even",
        prompt:
          "Explain what the break-even point is, how 'contribution' from each sale builds toward it, and why a lower price doesn't automatically make a plan work. (4–6 sentences.)",
        correctAnswer:
          "The break-even point is the level of sales where total money in exactly equals total money out — no profit, no loss — and below it the business loses money while above it every sale is profit. Each sale doesn't have to cover everything, only its own variable cost; what's left over contributes toward the fixed costs, and those contributions stack up until the fixed costs are fully covered, which is the break-even point. This makes break-even the most useful single number because it turns 'I hope this works' into a concrete target, like 'we must sell 200 a month.' A lower price doesn't automatically help because cutting the price shrinks each sale's contribution, which raises the number you must sell to break even, sometimes to impossible heights. So a busy business selling at too low a price can still lose money on every transaction, which is why you check break-even before assuming volume will save you.",
        explanation:
          "Full credit: defines break-even (revenue = total cost), explains contribution (price minus variable cost) accumulating to cover fixed costs, frames it as a concrete target, and explains a lower price raises break-even so high volume at a low price can still lose money.",
      },
      {
        topicSlug: "budgets-and-variance",
        prompt:
          "Explain why a budget is better understood as a plan than a prediction, what variance is, and why a 'favorable' variance isn't always good news. (4–6 sentences.)",
        correctAnswer:
          "A budget is a plan written in numbers — what you expect to bring in and spend — not a fortune-teller's prediction that's simply right or wrong; its value is as a baseline you measure reality against so you notice when things drift. Variance is the gap between what you planned and what actually happened, and the point of measuring it isn't blame but asking why, since a surprise signals the world didn't behave as assumed. Variances are labeled favorable (helped profit) or unfavorable (hurt it), but the labels show direction, not wisdom. A favorable variance isn't always good: spending far less than budgeted on training looks favorable yet might be starving the business, and hitting a sales target can hide that you only reached it by slashing prices (favorable volume but unfavorable price). So good managers treat the budget as a living guide and use variances to learn and adjust rather than to punish or panic.",
        explanation:
          "Full credit: explains a budget is a plan/baseline not a prediction, defines variance as plan-vs-actual whose purpose is asking 'why', and explains a favorable variance can still be bad (e.g. under-spending on something needed, hitting sales only via discounts).",
      },
      {
        topicSlug: "unit-economics",
        prompt:
          "Explain what unit economics is, why 'we'll make it up in volume' fails when each sale loses money, and what costs an honest unit-economics check must include. (4–6 sentences.)",
        correctAnswer:
          "Unit economics zooms in from the whole company to a single unit — one product sold, one customer — and checks whether that one sale earns more than it costs. If each unit makes money the business has a chance, but if each one loses money, selling more only grows the losses, which is why 'we lose a little on every sale but make it up in volume' is impossible — more volume means bigger losses. An honest check counts all the costs of a sale, including the easily forgotten one: what you spent to win that customer (ads, discounts, free trials), compared against what the customer is worth over their whole relationship (lifetime value). If acquiring a customer costs more than they'll ever spend, every new customer deepens the hole no matter how exciting the growth chart looks. The discipline is to keep asking the small per-sale question even when total revenue and signups look flattering, because the single sale, not the grand total, decides whether the business can stand on its own.",
        explanation:
          "Full credit: defines unit economics (does one sale/customer make money), explains volume multiplies losses when the unit is unprofitable, and that all costs including customer acquisition must be counted (CAC vs lifetime value); notes the discipline is unglamorous but decisive.",
      },
      {
        topicSlug: "forecasting-and-kpis",
        prompt:
          "Explain what a forecast is and why it should be treated as odds rather than a fact, what makes a good KPI, and the difference between a leading and a lagging indicator. (4–6 sentences.)",
        correctAnswer:
          "A forecast turns clues from the past — last year's sales, the season, the trend — into a likely number for the future so you can plan ordering, hiring, and spending; the key word is 'likely,' so it's a set of odds, not a promise, because it's about a future that hasn't happened yet. Treating it as fact is dangerous because plans get locked around one number and a confidently wrong forecast catches you out, so it should be used humbly and adjusted as reality disagrees. A good KPI is one of the few dials that genuinely signals health and tells you what to do — the test is 'if this number moved, would I act differently?' A lagging indicator reports what already happened, like last month's profit (a final score you can't change), while a leading indicator hints at what's coming, like how many people asked for a quote this week. Leading indicators let you steer before you hit trouble, so a good dashboard mixes both to keep score and see around the corner.",
        explanation:
          "Full credit: explains a forecast as a probabilistic estimate from past patterns (odds not certainty) and the danger of over-trusting it, defines a good KPI as a few action-driving dials (vs vanity), and distinguishes leading (predictive) from lagging (after-the-fact) indicators.",
      },
      {
        topicSlug: "numbers-to-decisions",
        prompt:
          "Explain why turning a dashboard into a decision is hard, why 'metrics that matter' beat 'vanity metrics,' and what it means that acting on data can fail in two different directions. (4–6 sentences.)",
        correctAnswer:
          "Turning a dashboard into a decision is hard because a dashboard only measures; it doesn't decide, and two managers can read the same numbers and choose opposite actions. The real skill is asking the right question of the data — what is this telling me to do, and how sure am I — because data informs a decision but never makes it for you. 'Metrics that matter' beat 'vanity metrics' because some numbers look flattering (total sales, followers) without changing any decision, while the ones worth watching actually tell you to raise a price, cut a product, or fix a cash problem; picking a few decision-driving numbers beats drowning in pretty ones. Acting on data can fail two ways: overreacting to noise (one slow week, one scary variance) tears up things you needed, while ignoring a real signal (cash draining, each sale losing money) lets a problem grow until it's fatal. No setting removes both risks at once, so an operator has to judge honestly which mistake is more dangerous right now.",
        explanation:
          "Full credit: explains data informs but people decide, distinguishes decision-driving metrics from flattering vanity metrics, and that errors split into overreacting to noise vs. ignoring real signal — a judgment trade-off.",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Financial & Managerial Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "numbers-to-decisions",
        prompt:
          "Using ideas from across the whole course, argue that one habit of mind — 'resist the simple, flattering story' — runs through financial and managerial analytics. Show how it applies to at least three different topics (for example: high sales, profit on paper, a single cost tag, a low price, a budget, growing sales, or a flattering dial). (5–7 sentences.)",
        correctAnswer:
          "The thread running through the whole course is to resist the simple, flattering story and replace it with careful, measured thinking. High sales feel like success, but a business with record sales can still run out of cash, so 'big sales' has to be checked against profit and actual cash. Profit on paper isn't money in the bank either — profit is an opinion while cash is a fact — so you read the income statement, balance sheet, and cash flow together rather than trusting one. A single cost tag is misleading too, because costs behave differently and the per-unit cost depends on volume, so 'what did it cost?' really means 'it depends how many we made.' The same caution undoes the low price that quietly raises break-even past what you could ever sell, the budget mistaken for a promise, the fast growth that loses money on every unit, and the flattering dial like 'total users' that hides who actually stayed. That shared habit — harder than believing a neat, comforting story — is what makes financial and managerial analytics both more honest and more likely to keep a business alive.",
        explanation:
          "Full credit: states the unifying habit (reject simple/flattering stories for measured thinking) and applies it correctly to at least three distinct course topics with accurate detail.",
      },
      {
        topicSlug: "three-financial-statements",
        prompt:
          "Someone insists, 'If a company reports a big profit, it's obviously doing fine — profit is all that matters.' Using ideas from the course, argue why a business's health is better understood by reading the three statements together. Use at least one concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'profit is all that matters' view assumes one number proves health, but a business's health actually shows up across three reports that each answer a different question. The income statement shows profit over a period, the balance sheet shows what's owned and owed on a given day, and the cash flow statement shows whether real cash came in — and that last one matters because profit is an opinion while cash is a fact. A company can count a sale as profit before the customer has paid, so its income statement glows while the cash flow statement reveals money draining out and bills it can't cover. For example, profitable companies have collapsed because their cash was tied up in unsold inventory or unpaid invoices — a problem that's invisible on the income statement but obvious on the cash flow statement. So a big reported profit is a starting point, not proof of fine; only reading the three together — earnings, what's owned and owed, and actual cash — reveals whether a business is genuinely healthy.",
        explanation:
          "Full credit: rejects the single-number 'profit = fine' view, explains the three statements answer different questions and that profit isn't cash, and supports it with a concrete example (e.g. a profitable company failing from a cash crunch / unpaid customers).",
      },
      {
        topicSlug: "break-even",
        prompt:
          "Explain why break-even is often called the single most useful number in business, why a lower price can make a plan harder rather than easier, and how an owner should use break-even before launching. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "Break-even is the level of sales where total money in equals total money out, the line between losing money and making it, and it's so useful because it turns a vague hope into a concrete survival target. It works through contribution: each sale only needs to cover its own variable cost, and what's left over stacks up to pay the fixed costs until they're covered, after which every sale is profit. A lower price can make a plan harder because cutting the price shrinks each sale's contribution, which raises the number you must sell to break even — sometimes so high you could never realistically reach it, so a busy business can still lose money on every sale. Before launching, an owner should work out the break-even point and ask honestly whether that many sales is achievable; if not, the idea, the price, or the costs need to change first. For example, a movie that cost $100 million usually has to earn roughly twice that to break even, because theaters keep about half the ticket money and marketing adds huge costs — which is why a film can gross over $150 million and still be a flop. That quiet break-even line, not the splashy sales figure, is what decides whether the plan actually works.",
        explanation:
          "Full credit: defines break-even and contribution, explains a lower price raises the break-even point (so volume at a low price can still lose money), says an owner should check whether break-even sales are achievable before launching, and supports it with a concrete example (e.g. a film needing ~2x its budget).",
      },
      {
        topicSlug: "unit-economics",
        prompt:
          "A founder says, 'We're losing money now, but we're growing so fast that scale will fix everything.' Using the course, explain why this can be a dangerous mistake and what the founder should check first. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'scale will fix everything' view ignores unit economics — whether a single sale or customer actually makes money once you count all its costs. If each customer costs more to win and serve than they ever pay, then growth multiplies the losses instead of curing them, which is the real version of the joke about losing money on every sale but making it up in volume. So before scaling, the founder should check the per-unit math: does one customer bring in more than their full cost, including what was spent to acquire them (their lifetime value versus their acquisition cost)? Only if that single unit is already profitable can volume turn into profit; if it isn't, every exciting new signup digs the hole deeper. A famous example is the movie-ticket subscription that charged about ten dollars a month for nearly unlimited movies while paying theaters close to full price per ticket, so heavy users cost far more than they paid; signups exploded, the losses grew with them, and the company collapsed. The growth and the sales were real, but the unit economics never worked, and that's what decided it.",
        explanation:
          "Full credit: explains unit economics (does one sale make money), that growth multiplies losses when the unit is unprofitable, what to check first (per-unit profit including acquisition cost vs lifetime value), and supports it with a concrete example (e.g. the unlimited-movie subscription).",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about financial & managerial analytics cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete business and money situations.",
    lectureTitle: "Primer: How to reason about financial & managerial analytics cases",
    body: `# How to reason about financial & managerial analytics cases

This short primer prepares you for the **Financial & Managerial Analytics** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — a profitable business short on cash, a low price that won't break even, a product that loses money on every sale, a flattering "total users" chart — and asks what the course's ideas tell you about it. Knowing the words "break-even" or "unit economics" is not enough; the question wants you to recognize *when* you are looking at one and *why* it matters here.

## What the questions reward

- **Naming the right idea** — match the situation to the concept that fits it: why high sales isn't proof of health, why profit isn't cash, how costs behave with volume, what break-even really demands, why a budget is a plan not a promise, whether a single sale makes money, and which dial is worth watching.
- **Using evidence from the scene** — point to the detail in the situation that supports your answer, rather than answering from a general impression.
- **Avoiding the flattering reading** — the course measures what's really happening; it does not assume the most comforting explanation. The best answers stay grounded in the numbers, not in how a business feels.

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
  // The course was migrated to the Financial & Managerial Analytics for
  // Children syllabus. Detect the marker topic; if present and the content
  // version matches, the content is current and we skip. This makes the seed
  // self-healing across environments: a database that still holds older content
  // (e.g. a previous curriculum) is detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-financial-analytics-is"));
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
        "Seed: stale course content detected — replacing with the Financial & Managerial Analytics for Children curriculum",
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
