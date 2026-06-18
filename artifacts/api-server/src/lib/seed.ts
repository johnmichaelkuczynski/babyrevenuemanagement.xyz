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
const SEED_CONTENT_VERSION = "2026-06-18-operations-supply-chain-analytics-for-children-v1";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Operations & Supply Chain Analytics for Everyone
  {
    slug: "what-operations-analytics-is",
    title: "What operations & supply chain analytics is",
    weekNumber: 1,
    blurb: "Most people picture a business as a building full of stuff — but it's really a flow, and almost everything that goes wrong is a problem with how things move.",
    lectureTitle: "1.1 What operations & supply chain analytics is (the business as a flow)",
    body: `# What operations & supply chain analytics is

Ask most people to picture a business and they imagine a place — a store, a warehouse, a factory full of stuff. That picture is comforting, and it's also why so many businesses get stuck. **Operations and supply chain analytics** starts from a different picture: a business isn't a pile of things sitting still, it's a **flow** — materials, orders, and work moving through steps from the very start until they reach a customer. Learning to see and measure that flow is the whole game.

## A business you can watch move

Think of how a pizza reaches your door: someone grows wheat and tomatoes, a mill and a cannery turn them into flour and sauce, a truck carries those to a shop, a cook assembles a pizza, an oven bakes it, and a driver delivers it. Every business is a chain of steps like that, and **operations analytics** is the skill of watching things move through those steps instead of just counting what's on the shelves. The question stops being "how much do we have?" and becomes "how smoothly is it moving, and where does it get stuck?"

## Operations vs. supply chain: inside vs. the whole chain

The two halves of the name point at two views of the same flow. **Operations** is the flow *inside* one business — how an order travels through your own kitchen, factory, or office. **Supply chain** is the flow *across* many businesses linked together — the farmers, factories, trucks, and stores that hand things off to each other until a customer gets them. Same idea at two zoom levels: one looks at the steps you control directly, the other at the long chain of companies you depend on and can only nudge.

## Flow, not a pile

Three plain measurements describe any flow. **Throughput** is how much actually comes out the far end in a given time — pizzas per hour, packages per day. **Flow time** is how long one item takes to travel the whole way through. And **inventory** is how much is sitting *inside* the system waiting at any moment. The surprising part is how tightly these are linked: a place can look busy and full of inventory yet still have low throughput, because being full is not the same as moving fast.

## The myths the flow exposes

Operations is full of confident myths. That a *busy* business is a productive one — but busy can just mean clogged. That a *full warehouse* is a safe one — but full often means cash frozen in stuff nobody's buying yet. That buying one *faster machine* makes everything faster — but if that machine wasn't the slow step, nothing speeds up. Much of this course is un-learning those myths and replacing them with a habit of asking where things actually move, wait, and pile up.

## Why this matters

This isn't only for giant factories. The same ideas decide whether a food truck can serve the lunch rush without a thirty-minute line, whether a small online shop ships on time without drowning in unsold boxes, and whether a hospital can move patients through the emergency room before they're harmed by the wait. When a flow is badly managed, people feel it as long waits, empty shelves, late deliveries, and wasted money — so reading the flow honestly is a kind of fairness to everyone who depends on it.

## In the real world

The most famous example is **Toyota.** For decades carmakers built huge piles of parts and pushed them through, assuming bigger batches meant efficiency. Toyota flipped the picture: treat the factory as a *flow*, make only what the next step actually needs, and relentlessly hunt for the places where things sit and wait. The result — often called "lean" production — let them build better cars with far less inventory and money tied up, and the rest of the world spent years trying to copy it. The lesson runs through this whole course: the win didn't come from a bigger pile, it came from seeing the business as something that moves.`,
  },
  {
    slug: "inventory-costs",
    title: "Inventory: too much and too little",
    weekNumber: 1,
    blurb: "Keeping lots in stock feels safe and keeping little feels lean — but both have real costs, and the whole skill is balancing two opposite mistakes.",
    lectureTitle: "1.2 Inventory (the cost of too much and too little)",
    body: `# Inventory: too much and too little

Inventory is just the stuff a business is holding — the boxes in the back, the parts in the bin, the food in the fridge. It feels like a simple thing to get right: keep enough so you never run out. But inventory is one of the trickiest decisions in all of business, because **both directions are expensive.** Holding too much costs you, and holding too little costs you, and the entire skill is finding the balance between two opposite mistakes.

## What inventory really is

Inventory is anything sitting and waiting to be used or sold — raw materials, half-finished goods, and finished products on the shelf. It's tempting to see a full storeroom as pure wealth, but inventory is really **money frozen in the shape of stuff.** Every item back there is cash you've already spent that hasn't come back yet, parked until a customer finally buys it. That reframe — inventory as trapped money, not safety — is the key to thinking about it clearly.

## The cost of too much

Holding too much has a stack of hidden costs people forget. There's the **cash** tied up that you can't use for anything else. There's **space** — shelves, warehouses, refrigeration — that costs rent and power. There's **spoilage and obsolescence**: food rots, fashions change, the newer model arrives and last year's becomes worth little. A warehouse stuffed to the ceiling *looks* like strength, but it can quietly be a slow bleed of money, especially when it turns out customers wanted something else.

## The cost of too little

Holding too little has the opposite danger: the **stockout.** When a customer wants something and you don't have it, you lose that sale — and sometimes you lose the customer for good, because they go to a competitor and stay there. For a factory, running out of one small part can halt an entire production line, so a missing five-cent screw stops a thousand-dollar product. Too little inventory looks lean and disciplined right up until the moment it costs you far more than the savings.

## Why "just keep lots in stock" is a trap

The instinct after a stockout is to overcorrect: never run out again, pile it high. But that just swaps one expensive mistake for another, turning lost sales into spoilage and frozen cash. The honest truth is there's **no setting that removes both risks** — more stock means less risk of running out but more holding cost, and less stock means the reverse. Good operators stop chasing a magic "enough" and instead decide which mistake is more affordable for *this* product.

## The sweet spot and safety stock

The goal is a sweet spot: enough to serve customers reliably without drowning in extra. Because demand is unpredictable, businesses keep a deliberate cushion called **safety stock** — a little extra to absorb a surprise busy day or a late delivery. How big that cushion should be depends on the item: a cheap, long-lasting, hard-to-replace part deserves a generous buffer, while an expensive item that spoils fast deserves a thin one. Sizing that cushion on purpose, instead of by panic, is the heart of inventory management.

## In the real world

Fashion retailers live this tension out loud. Order too many of a style that doesn't sell and you're stuck slashing prices on the clearance rack — those giant end-of-season markdowns are the visible cost of *too much.* Meanwhile, popular game consoles and the latest phones routinely **sell out** for months, sending buyers to resellers and rivals — the cost of *too little.* Neither company is foolish; they're both wrestling the same impossible balance, guessing an uncertain future and paying for whichever way they guessed wrong. That balancing act, repeated across every item a business stocks, is exactly what inventory analytics is for.`,
  },
  {
    slug: "bullwhip-effect",
    title: "The bullwhip effect",
    weekNumber: 1,
    blurb: "A tiny wobble in what customers buy turns into wild swings of shortage and glut by the time it reaches the factory — and it happens even when everyone is being sensible.",
    lectureTitle: "1.3 The bullwhip effect (why small ripples become big waves)",
    body: `# The bullwhip effect

Here's one of the strangest and most important patterns in all of business: a *small* change in what shoppers buy turns into a *huge* swing in orders by the time it reaches the factory and the farms. A barely-noticeable wobble at the store becomes a flood, then a drought, further up the chain. It's called the **bullwhip effect** — a flick of the wrist at the handle becomes a giant crack at the tip — and the unsettling part is that it happens even when every single person is acting reasonably.

## A ripple becomes a wave

Picture a chain: shoppers → the store → the distributor → the factory → the raw-material supplier. Suppose customer demand ticks up just a little. The store, not wanting to run out, orders a bit *extra* to be safe. The distributor sees the store's bigger order, assumes demand is climbing, and orders even *more* extra from the factory. The factory, seeing that, ramps up the most of all. A tiny ripple at the shopper end has become a towering wave at the supplier end — and the same thing happens in reverse when demand dips, swinging from too much to too little.

## Why each link over-reacts

The maddening thing is that no one is being foolish. Each link only sees the orders from the link right next to it, not the actual shoppers, so they're **guessing in the dark.** They add a safety cushion on top of a number that already had a cushion. They **order in big batches** to save on shipping, which turns a smooth trickle of demand into lumpy bursts. And when deliveries are slow, they panic-order more, then cancel when it all arrives at once. Sensible choices, stacked on top of each other, manufacture the chaos.

## The cost of the whiplash

This whiplash is wildly expensive. The far end of the chain lurches between **gluts** (warehouses overflowing, money frozen, products going stale) and **shortages** (factories idle, customers unserved). Workers get hired in a frenzy and laid off in the bust. Everyone holds extra "just in case" inventory to survive the swings, which costs money all the time. A chain rocked by the bullwhip is more expensive *and* less reliable than the steady demand underneath it ever justified.

## How to tame it

The cure is mostly about **information and steadiness.** If every link can see the *real* shopper demand — not just the order from their neighbor — they stop guessing and amplifying. Ordering **smaller amounts more often** smooths the lumps out. Steadier prices stop the artificial stockpiling that big sales and discounts trigger. The pattern can't be erased completely, but sharing honest demand information up and down the chain shrinks the wave back toward the ripple that actually started it.

## In the real world

The effect got its name at **Procter & Gamble**, who noticed that baby-diaper sales — about as steady as demand gets, since babies are wonderfully predictable — produced wildly swinging orders from stores and suppliers. Steady demand, chaotic ordering: the bullwhip in plain sight. A more recent example was the 2020 run on toilet paper: a modest, real bump in home use got amplified by panic-buying and frantic restocking into empty shelves nationwide, even though factories never actually stopped. In both cases the underlying need barely moved — the *chain's reaction* to it is what spun out of control, which is exactly what this pattern predicts.`,
  },
  {
    slug: "bottlenecks",
    title: "Bottlenecks",
    weekNumber: 1,
    blurb: "A whole system can only go as fast as its single slowest step — which means most efforts to speed things up are aimed at the wrong place and change nothing.",
    lectureTitle: "1.4 Bottlenecks (why the slowest step rules the whole system)",
    body: `# Bottlenecks

If you remember one rule about getting things done faster, make it this one: **a chain of steps can only move as fast as its slowest step.** That slowest step is called the **bottleneck**, named for the narrow neck of a bottle that controls how fast anything pours out no matter how wide the rest is. It sounds obvious, yet ignoring it is the single most common reason that expensive attempts to "speed things up" accomplish absolutely nothing.

## The slowest step sets the pace

Imagine making sandwiches with friends: one person toasts bread, one adds fillings, one wraps them up. If the toaster can only finish 10 sandwiches an hour, then no matter how lightning-fast the filler and wrapper are, **only 10 sandwiches an hour come out.** The toaster is the bottleneck, and it alone sets the speed of the whole line. Everyone else just ends up waiting on it or piling up work in front of it. The slowest step quietly rules the entire system.

## Why speeding up the wrong step is wasted

This leads to the costly mistake. If you spend money making the *filler* twice as fast, your output stays at 10 an hour — the filler was never the limit, so the upgrade does nothing but make a faster worker wait more. Improving a non-bottleneck step is **wasted effort**, every time. Only improving the bottleneck — a second toaster, a faster oven — actually raises how much the whole system produces. Knowing this saves businesses from pouring money into upgrades that look productive and change nothing.

## Finding the bottleneck

So how do you spot it? Look for where **work piles up.** Stuff stacks up *in front of* the bottleneck because that step can't keep up, while everything *after* it sits hungry and idle, waiting to be fed. The bottleneck is usually the busiest, most overwhelmed step with the longest line in front of it — the place where everyone is waiting. Once you learn to look for the pile-up and the wait, the slowest step tends to reveal itself.

## What to do about it

Once you've found the bottleneck, the moves are clear: **never let it sit idle** (every minute it's stopped is output the whole system loses and can never recover), protect it from running out of work, and offload anything from it that a non-bottleneck step could do instead. And here's the twist: when you successfully speed up one bottleneck, the **bottleneck moves** — some other step is now the slowest, and your attention has to follow it. Managing a system is really an endless game of finding and relieving whatever step is currently the limit.

## In the real world

Think of airport security. An airport can have huge parking, dozens of check-in desks, and a giant terminal, but if everyone funnels through a handful of slow screening lanes, **the whole airport moves at the speed of those lanes** — the long, snaking line forms right there, while the gates beyond sit half-empty waiting. Adding more parking or more shops does nothing for the wait; only opening more screening lanes (relieving the bottleneck) helps. The same shape shows up in a restaurant with one oven, a highway where four lanes merge into two, and a hospital with too few beds — the slowest step is where the line forms, and it's the only place worth fixing first.`,
  },
  {
    slug: "waiting-lines-queues",
    title: "Waiting lines and queues",
    weekNumber: 1,
    blurb: "Lines don't form because there isn't enough capacity on average — they form because of randomness, and the closer you run to full, the more the wait explodes.",
    lectureTitle: "1.5 Waiting lines (the hidden math of queues)",
    body: `# Waiting lines and queues

Everyone hates waiting in line, and most people assume a line means one simple thing: not enough staff. Sometimes that's true. But one of the most surprising ideas in operations is that **lines form even when there's plenty of capacity on average** — and understanding *why* explains a huge amount about why the world makes you wait, and what can actually be done about it.

## Why lines form even with enough capacity

Here's the key: the trouble isn't the average, it's the **variability.** Customers don't arrive in a tidy, evenly-spaced stream — three show up at once, then nobody for a while. And each one takes a different amount of time to serve — a quick question here, a complicated mess there. Even if a clerk could *on average* handle everyone who comes, those random clumps of arrivals and slow jobs pile up faster than the clerk can clear them, and a line forms. Randomness alone, with no shortage at all, creates the wait.

## The 100% trap

Now the counterintuitive part. You might think the goal is to keep your server (clerk, machine, doctor) busy nearly 100% of the time — that sounds maximally efficient. But as you push toward 100% busy, the **waiting time doesn't rise gently, it explodes.** A system running at 70% capacity has short, manageable lines; the same system at 95% can have lines many times longer, and at 100% the wait shoots toward infinity. The cushion of slack you "wasted" was actually what kept the line short. Running flat-out doesn't make customers move faster — it makes them wait forever.

## One line or many?

A simple, powerful fix is how you organize the line. Compare a bank with **one** line feeding several tellers against a supermarket with a **separate** line at each register. The single shared line is almost always faster on average, because no one gets stuck behind one unusually slow customer while another teller sits free — the moment any server opens up, the next person goes. Splitting into separate lines means you can be unlucky and picked the slow one. Pooling everyone into one queue smooths out the bad luck. It's the same number of servers; just a smarter shape.

## Why this matters

Waiting lines aren't only an annoyance; they're a real business cost. People abandon a too-long line and you lose the sale; a reputation for slowness drives customers away; in an emergency room or a 911 center, the wait can cause genuine harm. And because pushing for 100% efficiency *creates* the waits, managing queues is full of these honest trade-offs — a little planned slack, an extra server at the busy hour, or a single shared line can be worth far more than they cost. Even smart cues, like an accurate "your wait is about 10 minutes," make the same wait easier to bear.

## In the real world

Call centers run headfirst into the 100% trap. A center staffed so its agents are busy nearly every second sounds maximally efficient — and produces miserable, ballooning hold times, because there's no slack to absorb the random bursts of calls. Adding a few "extra" agents who are sometimes idle dramatically shortens the wait, which is why well-run centers deliberately staff *below* 100% busy. The same math is why banks switched to a single snaking line, why amusement parks post wait times and add slack on busy days, and why a hospital that fills every bed grinds to a halt. The lesson is counterintuitive but reliable: a little breathing room is what keeps the line moving.`,
  },
  {
    slug: "demand-forecasting",
    title: "Demand forecasting",
    weekNumber: 1,
    blurb: "You have to decide how much to make before you know how much sells — so forecasting is guessing the future on purpose, and the first rule is that every forecast is wrong.",
    lectureTitle: "1.6 Demand forecasting (stocking for a future you can't see)",
    body: `# Demand forecasting

Every business that makes or stocks anything faces the same impossible-sounding task: decide **how much to prepare before you know how much people will want.** The bakery has to bake before the customers arrive; the toy company has to order for the holidays months ahead. This is **demand forecasting** — making an educated guess about future demand so you can stock for it — and getting good at it starts with accepting one humbling rule.

## Guessing the future on purpose

A forecast turns clues from the past — last year's sales, the season, the weather, what's trending — into a likely number for the future, so you can act on it today. It's not fortune-telling and it's not a wild guess; it's a *disciplined* estimate built from evidence. The whole reason it matters is that the decisions can't wait: you must commit to an amount of inventory, staff, and supplies now, and the forecast is your best honest attempt to aim that commitment at a future you genuinely cannot see.

## Every forecast is wrong

Here's the rule every good forecaster lives by: **every forecast is wrong** — the only question is by how much, and in which direction. The future never matches the number exactly, so chasing a single perfect prediction is a fool's errand. Instead, smart operators forecast a **range** ("probably between 80 and 120") rather than a single point, and they plan for the miss — that's exactly what safety stock from the inventory topic is for. A forecast you treat as certain sets you up to be caught out; a forecast you treat as odds lets you prepare for being wrong.

## Patterns you can actually use

Even though the future is uncertain, it's not random — it has patterns worth leaning on. There's the **trend** (sales slowly climbing or fading over time), the **season** (umbrellas in spring, ice cream in summer, toys in December), and **known events** (a holiday, a big game, a planned sale). A good forecast blends these: take the baseline, lift it for the season, bump it for the event. Spotting the repeatable patterns is what separates a thoughtful forecast from a coin flip, even though the leftover surprise can never be fully removed.

## The danger of one number

The most dangerous forecast is a single confident number that everyone then treats as a fact. Once "we'll sell exactly 1,000" gets written down, plans harden around it, nobody prepares for selling 700 or 1,300, and the inevitable miss becomes a crisis. The cure is humility: state the uncertainty out loud, keep a cushion, and **watch the error** — track how wrong past forecasts were so the next one improves. A forecast is a starting point for planning, not a promise the world agreed to keep.

## In the real world

The car industry learned this painfully in 2020–2021. When the pandemic hit, automakers **forecast that car sales would crash**, so they slashed their orders for the computer chips that modern cars need. But demand bounced back far faster than predicted — the forecast was badly wrong — and by then the chip factories had given those slots to other buyers. The result was a worldwide shortage where finished cars sat in lots waiting for tiny chips, costing the industry enormous sums. The demand was real and the recovery was real; a single confident forecast that turned out wrong is what caused the damage — exactly the trap this topic is about.`,
  },
  {
    slug: "routing-optimization",
    title: "Routing and optimization",
    weekNumber: 1,
    blurb: "Moving things costs money, and the route you choose can change that cost dramatically — but the number of possible routes explodes so fast that finding the best one is genuinely hard.",
    lectureTitle: "1.7 Routing and optimization (moving things for less)",
    body: `# Routing and optimization

Almost everything you buy had to *travel* to reach you, and travel costs money — fuel, time, drivers, wear on the trucks. Because so much of business is moving things from where they are to where they're needed, a quiet but enormous question is: **what's the cheapest way to move it all?** This is **routing and optimization** — choosing the best path and order among a dizzying number of options — and it saves (or wastes) staggering amounts of money.

## Every trip has a cost

Start with the simple truth that movement isn't free. Every mile a truck drives burns fuel, pays a driver, and ages the vehicle; every extra stop adds time. So the way you *arrange* the moving — which truck carries what, in what order it visits its stops, which warehouse serves which customer — directly sets the cost. Two delivery plans that drop off the exact same packages can cost wildly different amounts depending only on how cleverly the trips are arranged.

## The order you visit matters

Picture a driver with twenty stops to make. The packages are fixed, but the **order** they're visited in decides the total distance — a smart order loops efficiently around the city, while a careless one zig-zags back and forth, doubling the miles for no reason. Finding the shortest order to visit a set of stops is such a classic problem it has a name (the "traveling salesman" problem). The same idea scales up: which warehouse should ship to which region, how to combine many small loads into one full truck — all of it is choosing a smart order and grouping over a wasteful one.

## The explosion of options

Here's what makes this genuinely hard, not just fiddly: the number of possible routes **explodes** as you add stops. A handful of stops has a few orderings you could check by hand; a few dozen stops has more possible routes than you could check in a lifetime, even with a fast computer trying one at a time. This is why "just try them all" fails. Real routing uses clever shortcuts — smart rules that find a *very good* route quickly without proving it's the single perfect one — because perfect is often impossible to reach, and very-good-and-fast wins.

## Trade-offs: fast, cheap, reliable

Optimization is never only about distance, because the goals fight each other. The **cheapest** route may be slow; the **fastest** may burn extra fuel or need more trucks; the **most reliable** keeps a time cushion that costs efficiency. You usually can't max out all three at once, so optimizing really means *deciding what to trade* — a delivery business promising same-day speed will happily pay for routes that a cost-first business would reject. The "best" route only has meaning once you've said which of these matters most for this job.

## In the real world

The delivery company **UPS** turned routing into famous savings with a system that, among other things, plans routes to **avoid left turns** wherever possible. It sounds trivial, but in many places a left turn means idling across oncoming traffic — wasting fuel and time and risking accidents — so routes that loop right instead save millions of gallons of fuel a year across millions of stops. No human could hand-plan that for every driver every day; it takes optimization crunching the explosion of options. It's a perfect picture of the topic: the packages don't change, but choosing a smarter *order and path* to move them quietly saves a fortune.`,
  },
  {
    slug: "resilience-capstone",
    title: "Resilience (capstone)",
    weekNumber: 1,
    blurb: "The leaner and more optimized a supply chain gets, the more fragile it becomes — and the whole course comes together in the trade-off between running efficient and not breaking.",
    lectureTitle: "1.8 Resilience: building a chain that doesn't break (Capstone)",
    body: `# Resilience (capstone)

We end on the deepest tension in the whole field. Everything in this course pushes toward **efficiency** — less inventory, less slack, smarter routes, no waste. But there's a catch that ties it all together: the leaner and more perfectly optimized a supply chain becomes, the more **fragile** it gets. A chain squeezed for every drop of efficiency can shatter the moment anything unexpected happens. **Resilience** is the skill of building a flow that bends under shock instead of breaking — and balancing it against efficiency is the highest-stakes judgment an operator makes.

## Efficient isn't the same as robust

It's tempting to think a well-run business is one with no waste — no extra inventory, no idle capacity, no backup suppliers, everything trimmed to the bone. But that bone-lean system has **nothing left to absorb a surprise.** A factory with zero spare parts stops the instant one delivery is late; a chain with one supplier collapses if that supplier does. Efficiency removes the very buffers and slack that protect you, so "perfectly efficient" and "dangerously fragile" are often the same system seen from two angles. Robustness is not the absence of waste — it's having something held in reserve.

## Single points of failure

The most dangerous fragility is the **single point of failure** — one supplier, one factory, one route, one part that the entire flow depends on. As long as nothing goes wrong, that single point looks like clean, efficient focus. But it's a hidden trap: if that one link breaks, *everything* downstream stops, and there's no plan B. Resilient operators hunt for these single points on purpose and ask the uncomfortable question the efficient plan never asks: "what happens if this one thing fails?"

## Buffers and backups (the cost of insurance)

Resilience is built from the very things efficiency wants to cut: **extra inventory** to ride out a disruption, **backup suppliers** in different places, **spare capacity** to surge when needed, and **flexible** setups that can switch products or routes. The honest part is that all of this **costs money all the time** — it's insurance, and insurance feels wasteful right up until the disaster it was for. So resilience is never "max it out"; it's deciding how much protection is worth its cost for the risks you actually face, knowing too little leaves you fragile and too much bleeds money.

## Tying the course together

Look back and one thread runs through all eight topics: **a business is a flow, and managing it means handling uncertainty and trade-offs honestly.** A flow can clog; inventory balances too-much against too-little; the bullwhip shows small surprises amplifying into big ones; bottlenecks reveal that only the slowest step matters; queues show variability creating waits and the 100% trap; forecasts are always wrong so you plan a range; routing trades fast against cheap. Resilience is where every one of those trade-offs comes due at once — because the efficient choices from every earlier topic are exactly what a shock tests.

## The biggest questions stay open

And plenty stays unsettled. How much efficiency should you give up for protection you might never need? How do you prepare for a disruption you can't predict the shape of? When does a sensible buffer become wasteful hoarding? There's no formula that answers these — they take judgment, weighing a cost you pay for sure against a disaster that only might come. The most useful habit to carry out of this course is to keep asking, whenever a flow looks beautifully efficient: "and what happens when something goes wrong?"

## In the real world

The COVID years were a global lesson in this trade-off. Decades of squeezing supply chains for maximum efficiency — minimal inventory, single low-cost suppliers far away, no slack — produced chains that worked beautifully until they suddenly didn't, leaving the world short of everything from masks to cars. A single ship, the *Ever Given*, wedged sideways in the Suez Canal and blocked a huge slice of world trade for days, because so much depended on that one route with no easy backup. None of the operators were foolish; they had optimized exactly as this course teaches — and discovered the limit this final topic is about. The hard, honest balance between running efficient and not breaking is where the whole field, and this course, has been heading.`,
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
    title: "Homework 1.1 — Flow, inventory, bullwhip, and bottlenecks",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. There's no need for any math — just explain your thinking clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-operations-analytics-is",
        prompt:
          "A friend says, 'You can tell a warehouse is well run just by walking in and seeing it packed full and everyone busy — full and busy means efficient.' Using the idea of a business as a flow, explain why 'full and busy means efficient' is a myth. (3–5 sentences.)",
        correctAnswer:
          "Operations analytics sees a business as a flow — things moving through steps to a customer — not a pile of stuff sitting still. A full warehouse can mean cash is frozen in inventory nobody has bought yet, and 'busy' can mean clogged and stuck rather than productive, because being full is not the same as moving fast. What actually matters is throughput (how much comes out the end), flow time (how long something takes to get through), and where things pile up and wait. So my friend is reading a busy, full feeling as proof of efficiency, when a smoothly moving but emptier-looking operation could easily be doing better.",
        explanation:
          "Full credit: frames the business as a flow (not a static pile), explains that 'full' can mean frozen cash and 'busy' can mean clogged, and that what matters is how smoothly things move (throughput/flow time, where things pile up), not how full or busy it looks.",
      },
      {
        topicSlug: "inventory-costs",
        prompt:
          "After running out of a popular item once, a shop owner decides to never run out again by ordering huge quantities of everything. Explain why this 'just keep lots in stock' plan can backfire. (3–5 sentences.)",
        correctAnswer:
          "Inventory is really money frozen in the shape of stuff, so holding huge quantities ties up cash, eats storage space, and risks spoilage or items going out of date before they sell. The owner has only swapped one expensive mistake (running out) for the opposite one (too much), because there's no setting that removes both risks at once — more stock cuts stockouts but raises holding costs. The honest goal is a sweet spot with a deliberate safety-stock cushion sized to each item, not 'pile everything high.' For a cheap, long-lasting item a big cushion is fine, but for an expensive or perishable item, overstocking can cost far more than the occasional stockout it prevents.",
        explanation:
          "Full credit: explains inventory as frozen cash with holding/space/spoilage costs, that overstocking just trades stockouts for the opposite costly mistake (no setting removes both risks), and that the goal is a balanced sweet spot / safety stock sized to the item.",
        hint: "Think about what holding lots of stock actually costs, and whether 'never run out' removes risk or just swaps one expensive mistake for another.",
      },
      {
        topicSlug: "bullwhip-effect",
        prompt:
          "Shoppers buy only slightly more bottled water than usual, but a few weeks later the bottling factory is scrambling with enormous orders, then suddenly drowning in cancelled ones. Using the bullwhip effect, explain how a small change at the store became a huge swing at the factory. (3–5 sentences.)",
        correctAnswer:
          "The bullwhip effect is when a small change in real customer demand gets amplified into big swings as it travels up the chain from store to distributor to factory. Each link only sees the order from the link next to it, not the actual shoppers, so they add a safety cushion on top of a number that already had one, and they order in big batches — so a slight bump at the store becomes a flood by the factory. When demand settles, the same thing happens in reverse and the over-ordering turns into cancellations and gluts. Nobody is being foolish; sensible 'order extra to be safe' choices stacked on each other manufacture the wild swing, even though the real demand barely moved.",
        explanation:
          "Full credit: defines the bullwhip effect (small demand change amplified up the chain), explains the cause (each link sees only its neighbor's orders, adds safety cushions, batches orders), and notes the swing goes both ways (glut then shortage/cancellations) even though real demand barely changed.",
      },
      {
        topicSlug: "bottlenecks",
        prompt:
          "A sandwich shop is slow at lunch, so the owner spends money to make the fast wrapping station even faster — but the line of customers doesn't get any shorter. Using the idea of a bottleneck, explain what went wrong and what the owner should have done. (3–5 sentences.)",
        correctAnswer:
          "A system can only go as fast as its slowest step, the bottleneck, so improving any other step does nothing for overall output. The wrapping station clearly wasn't the bottleneck — speeding it up just makes it wait more while the real slow step (maybe the grill or the register) still sets the pace. To spot the bottleneck the owner should look for where work piles up: stuff stacks up in front of the slow step while later steps sit idle. The fix is to relieve that slowest step — a second grill, an extra cook, offloading some of its work — and to remember that once it's fixed, the bottleneck will move to whatever is now slowest.",
        explanation:
          "Full credit: states that the slowest step (bottleneck) sets the pace so improving a non-bottleneck does nothing, explains how to find it (where work piles up / later steps sit idle), and that the fix is to relieve the actual bottleneck (and that it then moves).",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Queues, forecasting, routing, and resilience",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. No math is required — explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "waiting-lines-queues",
        prompt:
          "A manager proudly keeps every cashier busy nearly 100% of the time to be 'maximally efficient,' but customers complain the lines are enormous. Explain why running at nearly 100% busy can create huge waits, and what a small change could do. (3–5 sentences.)",
        correctAnswer:
          "Lines form mainly because of variability — customers arrive in clumps and take different amounts of time — not just because of a shortage on average. As you push a server toward 100% busy, the waiting time doesn't rise gently, it explodes, because there's no slack left to absorb the random bursts, so a system at 95–100% can have lines many times longer than one at 70%. The slack the manager 'wasted' was exactly what kept lines short. Adding a little breathing room — an extra cashier at the busy hour, or pooling everyone into one shared line instead of separate ones — can shorten the wait dramatically even though it looks less 'efficient.'",
        explanation:
          "Full credit: explains lines come from variability not just average shortage, that wait time explodes as utilization nears 100% (slack absorbs bursts), and that a small change (extra server at peak, single shared line / pooling) shortens waits despite looking less efficient.",
        hint: "Is the goal really to keep servers busy every second? Think about what happens to the wait as you approach 100%, and why some slack helps.",
      },
      {
        topicSlug: "demand-forecasting",
        prompt:
          "A toy company forecasts it will sell 'exactly 50,000 units' this holiday season, writes that number into all its plans, and treats it as a fact. Explain what's risky about this and how they should handle the forecast instead. (3–5 sentences.)",
        correctAnswer:
          "Every forecast is wrong — the only question is by how much and in which direction — so treating a single confident number as a fact is dangerous because plans harden around it and nobody prepares for selling far more or far less. A better approach is to forecast a range rather than one point, keep a safety-stock cushion for the miss, and use patterns like trend, season, and known events to inform the estimate while staying humble about the leftover uncertainty. They should also watch the error — track how wrong past forecasts were so the next one improves. The forecast should be a starting point for planning, treated as odds, not a promise the world agreed to keep.",
        explanation:
          "Full credit: states every forecast is wrong so a single confident number is risky (plans harden, no cushion for the miss), and recommends forecasting a range, keeping safety stock, using patterns (trend/season/events) and tracking error, treating the forecast as odds not fact.",
      },
      {
        topicSlug: "routing-optimization",
        prompt:
          "Two delivery drivers carry the exact same packages to the exact same houses, but one finishes using far less fuel and time than the other. Using routing and optimization, explain how that's possible and why finding the truly best route is hard. (3–5 sentences.)",
        correctAnswer:
          "Even with identical packages and stops, the order and path you visit them in decides the total distance, fuel, and time — a smart route loops efficiently while a careless one zig-zags back and forth and doubles the miles. So the difference between the two drivers is almost entirely how cleverly their trips are arranged, which is exactly what routing optimization tries to improve. Finding the truly best route is genuinely hard because the number of possible orderings explodes as you add stops — a few dozen stops have more routes than you could ever check one by one. That's why real routing uses smart shortcuts to find a very good route quickly instead of proving the single perfect one, which is often impossible to reach.",
        explanation:
          "Full credit: explains the order/path of stops sets the cost (same packages, very different miles), that this is what optimization improves, and that finding the perfect route is hard because options explode with the number of stops (so good-and-fast shortcuts beat checking them all).",
      },
      {
        topicSlug: "resilience-capstone",
        prompt:
          "A company brags that it has trimmed its supply chain to the bone — minimal inventory, one cheap supplier, no spare capacity — and calls it 'perfectly efficient.' Explain why this could be dangerous and what resilience would add. (3–5 sentences.)",
        correctAnswer:
          "A bone-lean chain has nothing left to absorb a surprise, so 'perfectly efficient' and 'dangerously fragile' are often the same system seen two ways. Relying on one cheap supplier and minimal inventory creates single points of failure — if that supplier or a key delivery is disrupted, the whole flow stops with no plan B. Resilience adds the buffers efficiency cuts: some extra inventory, backup suppliers in different places, spare capacity, and flexibility, which act like insurance against disruption. That protection costs money all the time, so the honest goal isn't to maximize it but to decide how much is worth its cost for the risks they actually face — because too little leaves them fragile and too much bleeds money.",
        explanation:
          "Full credit: explains a maximally lean chain has no slack to absorb shocks (efficient = fragile), identifies single points of failure (one supplier/minimal inventory), and that resilience adds buffers/backups/spare capacity/flexibility as costly insurance that must be balanced against efficiency.",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Operations & Supply Chain Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-operations-analytics-is",
        prompt:
          "Explain what operations and supply chain analytics is, including the difference between the 'operations' and 'supply chain' sides, and why it insists on seeing a business as a flow rather than a pile of stuff. Why does that view matter? (4–6 sentences.)",
        correctAnswer:
          "Operations and supply chain analytics is the practice of seeing a business as a flow — materials, orders, and work moving through steps to a customer — and measuring how smoothly it moves instead of just counting what's on the shelves. The 'operations' side is the flow inside one business (how an order moves through your own kitchen or factory), while the 'supply chain' side is the flow across many linked businesses (farmers, factories, trucks, stores handing things off until a customer gets them) — the same idea at two zoom levels. Seeing a business as a flow matters because the useful questions become 'how fast is it moving and where does it get stuck?' rather than 'how much do we have?' This view exposes myths like 'busy means productive' or 'a full warehouse is safe,' since busy can mean clogged and full can mean frozen cash. Measuring the flow — throughput, flow time, and where things pile up — is what reveals what's really happening instead of how it feels.",
        explanation:
          "Full credit: defines the field as seeing/measuring a business as a flow, distinguishes operations (flow inside one business) from supply chain (flow across linked businesses), and explains why the flow view matters (right questions, exposes 'busy/full = good' myths, focuses on throughput/flow time/pile-ups).",
      },
      {
        topicSlug: "inventory-costs",
        prompt:
          "Explain the cost of holding too much inventory and the cost of holding too little, why 'just keep lots in stock' is a trap, and what safety stock is for. (4–6 sentences.)",
        correctAnswer:
          "Inventory is really money frozen in the shape of stuff, so holding too much ties up cash, eats storage space, and risks spoilage or items going out of date before they sell. Holding too little risks the stockout — losing the sale, sometimes losing the customer for good, or even halting a whole production line over one missing part. 'Just keep lots in stock' is a trap because it only swaps one expensive mistake for the opposite one: there's no setting that removes both risks at once, since more stock cuts stockouts but raises holding costs and less stock does the reverse. The honest goal is a sweet spot that serves customers reliably without drowning in extra. Safety stock is a deliberate cushion of extra inventory kept to absorb surprises like a busy day or a late delivery, and it should be sized to each item — generous for a cheap, durable, hard-to-replace part, thin for an expensive or perishable one.",
        explanation:
          "Full credit: explains holding costs of too much (frozen cash, space, spoilage/obsolescence) and costs of too little (lost sales/customers, halted line), that overstocking just trades one mistake for the other (no setting removes both risks), and that safety stock is a deliberate cushion sized per item.",
      },
      {
        topicSlug: "bullwhip-effect",
        prompt:
          "Explain the bullwhip effect, why each link in the chain over-reacts even when everyone is being sensible, and how the effect can be tamed. (4–6 sentences.)",
        correctAnswer:
          "The bullwhip effect is when a small change in real customer demand gets amplified into larger and larger swings as it travels up the chain from store to distributor to factory to supplier. Each link over-reacts because it only sees the orders from the link next to it, not the actual shoppers, so it adds a safety cushion on top of a number that already had one, orders in big batches to save on shipping, and panic-orders when deliveries are slow. Those individually sensible choices, stacked on each other, manufacture wild swings — gluts of overflowing warehouses alternating with shortages of idle factories — even though the underlying demand barely moved. The whiplash is expensive because everyone holds extra 'just in case' inventory and lurches between too much and too little. It's tamed mostly by sharing real demand information up and down the chain so links stop guessing, ordering smaller amounts more often to smooth the lumps, and keeping prices steady so artificial stockpiling doesn't get triggered.",
        explanation:
          "Full credit: defines the bullwhip effect (demand change amplified up the chain), explains the causes (each link sees only its neighbor's orders, adds cushions, batches, panic-orders), notes the costly glut/shortage swings despite steady real demand, and gives cures (share real demand info, smaller/more frequent orders, steady prices).",
      },
      {
        topicSlug: "bottlenecks",
        prompt:
          "Explain why a system can only go as fast as its slowest step, why improving a non-bottleneck step is wasted, how to find the bottleneck, and what it means that the bottleneck can move. (4–6 sentences.)",
        correctAnswer:
          "A chain of steps can only move as fast as its slowest step, the bottleneck, because everything has to pass through that step and it sets the pace for the whole system. Improving a non-bottleneck step is wasted effort because output stays capped at the bottleneck's speed — a faster non-bottleneck just produces more waiting, not more output. You find the bottleneck by looking for where work piles up: stuff stacks up in front of the slow step while the steps after it sit idle and starved, waiting to be fed. To relieve it you keep it from ever sitting idle (lost time there is output the whole system can never recover), protect it from running out of work, and offload tasks a non-bottleneck could do. And once you successfully speed up that step, the bottleneck moves to whatever is now slowest, so managing a system is an endless game of finding and relieving the current limit.",
        explanation:
          "Full credit: explains the slowest step sets the pace for the whole system, that improving a non-bottleneck does nothing for output, how to find it (work piles up in front, later steps idle), and that fixing it moves the bottleneck elsewhere (keep it busy, protect/offload it).",
      },
      {
        topicSlug: "waiting-lines-queues",
        prompt:
          "Explain why waiting lines form even when there's enough capacity on average, why pushing toward 100% busy makes the wait explode, and why a single shared line often beats several separate lines. (4–6 sentences.)",
        correctAnswer:
          "Lines form mainly because of variability, not a shortage on average: customers arrive in random clumps and each takes a different amount of time to serve, so those bursts and slow jobs pile up faster than a server can clear them even when, on average, there's enough capacity. As you push a server toward 100% busy, the waiting time doesn't rise gently — it explodes — because there's no slack left to absorb the random bursts, so a system at 95–100% can have lines many times longer than one at 70%. The slack that looks 'wasted' is exactly what keeps lines short, which is why running flat-out makes customers wait longer, not move faster. A single shared line feeding several servers usually beats several separate lines because no one gets stuck behind one unusually slow customer while another server sits free — the moment any server opens, the next person goes. Pooling everyone into one queue smooths out the bad luck of picking the slow line, using the same number of servers in a smarter shape.",
        explanation:
          "Full credit: explains lines come from variability (clumped arrivals, varying service times) not just average shortage, that wait explodes as utilization nears 100% (slack absorbs bursts), and that one shared line beats separate lines by pooling/avoiding getting stuck behind a slow customer.",
      },
      {
        topicSlug: "demand-forecasting",
        prompt:
          "Explain what demand forecasting is, why 'every forecast is wrong' is the rule good forecasters live by, what patterns a forecast can use, and why a single confident number is dangerous. (4–6 sentences.)",
        correctAnswer:
          "Demand forecasting is making a disciplined, educated guess about future demand — using clues from the past like last year's sales, the season, and trends — so you can decide how much to make or stock before you know how much people will want. 'Every forecast is wrong' is the rule because the future never matches the number exactly; the only question is by how much and in which direction, so chasing a single perfect prediction is a fool's errand. A good forecast leans on real patterns — the trend (sales slowly rising or fading), the season (umbrellas in spring, toys in December), and known events (a holiday or planned sale) — while accepting the leftover surprise can't be removed. A single confident number is dangerous because once it's written down, plans harden around it and nobody prepares for selling much more or much less, so the inevitable miss becomes a crisis. The cure is to forecast a range, keep a safety-stock cushion for the miss, watch how wrong past forecasts were, and treat the forecast as odds rather than a promise.",
        explanation:
          "Full credit: defines forecasting as a disciplined estimate of future demand from past clues, explains 'every forecast is wrong' (plan a range, not a point), names usable patterns (trend/season/events), and explains why a single confident number is dangerous (plans harden, no cushion) and the cure (range, safety stock, track error).",
      },
      {
        topicSlug: "routing-optimization",
        prompt:
          "Explain why the order of stops on a route matters, why finding the truly best route is hard, and why optimization always involves trade-offs between goals like fast, cheap, and reliable. (4–6 sentences.)",
        correctAnswer:
          "The order of stops matters because, even with the exact same packages and destinations, the path you choose decides the total distance, fuel, and time — a smart order loops efficiently around an area while a careless one zig-zags back and forth and doubles the miles for no reason. Finding the truly best route is hard because the number of possible orderings explodes as you add stops: a handful can be checked by hand, but a few dozen have more routes than you could ever try one by one, even with a fast computer. That's why real routing uses clever shortcuts that find a very good route quickly instead of proving the single perfect one, because perfect is often impossible to reach and good-and-fast wins. Optimization also involves trade-offs because the goals fight each other — the cheapest route may be slow, the fastest may burn extra fuel or need more trucks, and the most reliable keeps a costly time cushion. So 'best' only has meaning once you decide which goal matters most for the job, which is really what optimizing means: choosing what to trade.",
        explanation:
          "Full credit: explains the order/path of stops sets cost (same packages, very different miles), that finding the perfect route is hard because options explode with stops (so fast shortcuts beat trying them all), and that optimization trades competing goals (fast vs cheap vs reliable) so 'best' depends on priorities.",
      },
      {
        topicSlug: "resilience-capstone",
        prompt:
          "Explain why 'efficient' and 'fragile' are often the same system seen two ways, what a single point of failure is, and why resilience is best understood as costly insurance that must be balanced against efficiency. (4–6 sentences.)",
        correctAnswer:
          "Efficiency removes waste — extra inventory, idle capacity, backup suppliers, slack — but those are exactly the buffers that absorb a surprise, so a bone-lean system has nothing left to cushion a shock and 'perfectly efficient' and 'dangerously fragile' end up being the same system seen from two angles. A single point of failure is one supplier, factory, route, or part that the entire flow depends on; it looks like clean, efficient focus while nothing goes wrong, but if it breaks, everything downstream stops with no plan B. Resilience is built from the things efficiency cuts — extra inventory, backup suppliers in different places, spare capacity, and flexibility — which act like insurance against disruption. That insurance costs money all the time and feels wasteful right up until the disaster it was for, which is why it has to be balanced, not maximized. The honest judgment is deciding how much protection is worth its cost for the risks you actually face, since too little leaves you fragile and too much bleeds money — the central trade-off the whole course builds toward.",
        explanation:
          "Full credit: explains efficiency removes the buffers that absorb shocks (so efficient = fragile), defines a single point of failure (one link the whole flow depends on), and frames resilience as costly insurance (buffers/backups/spare capacity/flexibility) that must be balanced against efficiency rather than maximized.",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Operations & Supply Chain Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "resilience-capstone",
        prompt:
          "Using ideas from across the whole course, argue that one habit of mind — 'a business is a flow, and managing it means handling uncertainty and trade-offs honestly' — runs through operations and supply chain analytics. Show how it applies to at least three different topics (for example: flow, inventory, the bullwhip effect, bottlenecks, queues, forecasting, routing, or resilience). (5–7 sentences.)",
        correctAnswer:
          "The thread running through the whole course is that a business is a flow, and managing it well means facing uncertainty and trade-offs honestly instead of chasing a single comforting number. Seeing the business as a flow rather than a pile is the starting point: a full, busy place can be clogged and frozen, so what matters is how smoothly things actually move. Inventory is a pure trade-off — too much freezes cash and risks spoilage, too little risks stockouts — with no setting that removes both risks, so you size a safety cushion on purpose. Bottlenecks show that only the slowest step matters, so honest attention goes there instead of to whatever is easy to improve, and queues show that variability creates waits and that pushing to 100% busy backfires, so a little slack is worth its cost. Forecasting accepts that every forecast is wrong and plans a range rather than a false-confident point, and routing trades fast against cheap against reliable so 'best' depends on what you choose. Resilience is where all these trade-offs come due at once, balancing efficiency against the buffers that keep a chain from breaking — and that shared habit of handling flow, uncertainty, and trade-offs honestly is what makes the field both harder than a simple story and far more likely to keep a business running.",
        explanation:
          "Full credit: states the unifying habit (business as a flow; handle uncertainty and trade-offs honestly rather than chase a single number) and applies it correctly to at least three distinct course topics with accurate detail.",
      },
      {
        topicSlug: "bullwhip-effect",
        prompt:
          "Someone insists, 'If a factory suddenly gets swamped with huge orders and then floods with cancellations, customer demand must be wildly unstable — blame the shoppers.' Using ideas from the course, argue why the chaos can come from the chain itself even when real demand is steady. Use at least one concrete example. (5–7 sentences.)",
        correctAnswer:
          "Blaming the shoppers assumes the wild swings at the factory mirror wild swings in real demand, but the bullwhip effect shows the chaos is often manufactured by the chain itself even when underlying demand is steady. Each link — store, distributor, factory — only sees the orders from the link next to it, not the actual shoppers, so it adds a safety cushion on top of a number that already had one, orders in big batches, and panic-orders when deliveries lag. Those individually sensible choices, stacked on each other, amplify a small ripple at the store into a towering wave of orders and then cancellations at the factory, swinging from glut to shortage. The classic example is Procter & Gamble's baby diapers: real demand is about as steady as it gets, since babies are predictable, yet store and supplier orders swung wildly — proof the instability lived in the chain's reaction, not the shoppers. The 2020 toilet-paper shortage was the same shape: a modest real bump got amplified by panic-buying and frantic restocking into nationwide empty shelves even though factories never stopped. So the fix isn't to blame customers but to share real demand information and order in smaller, steadier amounts, which shrinks the wave back toward the ripple that started it.",
        explanation:
          "Full credit: rejects the 'unstable demand' explanation, explains the bullwhip effect (each link sees only neighbor's orders, adds cushions, batches/panic-orders, amplifying steady demand into glut/shortage swings), and supports it with a concrete example (e.g. P&G diapers or the 2020 toilet-paper run).",
      },
      {
        topicSlug: "waiting-lines-queues",
        prompt:
          "A manager argues that the way to fix long lines is to push every server to be busy 100% of the time, since 'idle servers are wasted money.' Using the course, explain why this can make waits worse, and what would actually help. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'no idle servers' view treats slack as pure waste, but in a system with variability that slack is exactly what keeps lines short. Lines form mainly because customers arrive in random clumps and take different amounts of time, so bursts pile up faster than a server can clear them even when there's enough capacity on average. As you push toward 100% busy, waiting time doesn't rise gently — it explodes — because there's no breathing room left to absorb those bursts, so a system at 95–100% can have lines many times longer than one at 70%. So driving servers to full does the opposite of what the manager wants, making customers wait longer rather than move faster. What actually helps is deliberately keeping some slack — adding an extra server at the busy hour even if they're sometimes idle — and pooling people into a single shared line so no one is stuck behind one slow customer while another server sits free. Call centers are the classic example: staffing agents to be busy nearly every second produces miserable hold times, while adding a few sometimes-idle agents dramatically shortens the wait, which is why well-run centers deliberately staff below 100% busy.",
        explanation:
          "Full credit: explains lines come from variability and that slack absorbs bursts, that pushing toward 100% busy makes waits explode (so it backfires), and what helps (planned slack/extra server at peak, single shared line/pooling), with a concrete example (e.g. call centers, bank single line).",
      },
      {
        topicSlug: "resilience-capstone",
        prompt:
          "A company says, 'We've optimized our supply chain to the bone — minimal inventory, one cheap overseas supplier, no spare capacity — so we're in great shape.' Using the course, explain why this can be a dangerous mistake and what they should weigh. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'optimized to the bone' view confuses efficient with robust, but efficiency removes exactly the buffers — extra inventory, spare capacity, backup suppliers, slack — that absorb a shock, so a bone-lean chain has nothing left to cushion a surprise. Relying on one cheap overseas supplier and minimal inventory creates single points of failure: as long as nothing goes wrong it looks like clean, efficient focus, but if that supplier or its shipping route is disrupted, the whole flow stops with no plan B. Resilience is built from the things they've cut — buffer inventory, backup suppliers in different places, spare capacity, and flexibility — which act like insurance against disruption, and that insurance costs money all the time and feels wasteful right up until the disaster it was for. So what they should weigh is how much protection is worth its cost for the risks they actually face, since too little leaves them fragile and too much bleeds money — it's a balance, not a number to maximize. The COVID years showed this at global scale: decades of squeezing chains for efficiency — minimal inventory, single distant suppliers — produced shortages of everything from masks to cars the moment things went wrong, and a single ship wedged in the Suez Canal blocked a huge slice of world trade because so much depended on one route with no backup. None of those operators were foolish; they optimized exactly as efficiency teaches and discovered its limit, which is the trade-off this company is ignoring.",
        explanation:
          "Full credit: explains efficiency removes the buffers that absorb shocks (efficient ≠ robust), identifies single points of failure (one supplier/route, minimal inventory), frames resilience as costly insurance (buffers/backups/spare capacity/flexibility) to be balanced not maximized, and supports it with a concrete example (e.g. COVID shortages or the Suez Canal blockage).",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about operations & supply chain cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete situations about how things move and get made.",
    lectureTitle: "Primer: How to reason about operations & supply chain cases",
    body: `# How to reason about operations & supply chain cases

This short primer prepares you for the **Operations & Supply Chain Analytics** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — a warehouse that's full but slow, a shop that overstocks after one stockout, a factory swamped by swings while real demand is steady, a line that's huge even with idle-looking staff — and asks what the course's ideas tell you about it. Knowing the words "bottleneck" or "bullwhip" is not enough; the question wants you to recognize *when* you are looking at one and *why* it matters here.

## What the questions reward

- **Naming the right idea** — match the situation to the concept that fits it: why busy or full isn't the same as efficient, why too much and too little inventory both cost, how a small demand change gets amplified, why the slowest step rules the system, why lines explode near 100% busy, why every forecast is wrong, why route order changes the cost, and why efficient can mean fragile.
- **Using evidence from the scene** — point to the detail in the situation that supports your answer, rather than answering from a general impression.
- **Avoiding the flattering reading** — the course measures what's really happening; it does not assume the most comforting explanation. The best answers stay grounded in how the flow actually moves, not in how busy or full a place feels.

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

This short primer prepares you for the **General Reasoning** diagnostic — an *ungraded* check that tests five genuine reasoning skills. These are the same skills you use to decide what a set of facts really shows, so they matter directly for thinking clearly about what's happening in a business's flow.

## The five skills

- **Analysis** — break an argument into parts: find its **point** (the conclusion), the **reasons** given for it, and any hidden assumption it leans on. Ask: "What is this trying to convince me of, and what does it take for granted?"
- **Inference** — work out what *follows* from what you're told, and how strongly. Tell apart what *must* be true, what is *likely*, and what is only *possible*.
- **Evaluation** — judge how much the reasons actually support the point. Notice when evidence is beside the point, a source isn't trustworthy, or a step doesn't really connect.
- **Deduction** — reasoning where true starting facts *guarantee* the conclusion. If the starting facts are true, the conclusion can't be false. Watch for sneaky forms that only *look* airtight.
- **Induction** — reasoning from a few examples to a *probable* general rule or prediction. Strong induction uses many fair examples; weak induction over-generalizes from too few.

## A recurring trap: things that move together

Most wrong answers are statements that *sound* reasonable but are **not actually backed up by what you were told**. The discipline this check rewards is the same one careful work with operations demands: keep apart what the facts **show**, what you're **assuming**, and what only *sounds* right. Two things happening together does not prove one causes the other.

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
  // The course was migrated to the Operations & Supply Chain Analytics for
  // Children syllabus. Detect the marker topic; if present and the content
  // version matches, the content is current and we skip. This makes the seed
  // self-healing across environments: a database that still holds older content
  // (e.g. a previous curriculum) is detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-operations-analytics-is"));
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
        "Seed: stale course content detected — replacing with the Operations & Supply Chain Analytics for Children curriculum",
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
