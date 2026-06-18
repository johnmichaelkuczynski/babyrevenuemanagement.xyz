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
const SEED_CONTENT_VERSION = "2026-06-18-revenue-management-pricing-analytics-for-children-v1";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Revenue Management & Pricing Analytics for Everyone
  {
    slug: "what-revenue-management-is",
    title: "What revenue management is",
    weekNumber: 1,
    blurb: "Two people in identical seats on the same flight usually paid wildly different prices — and that's not a mistake or a rip-off, it's a whole craft called revenue management.",
    lectureTitle: "1.1 What revenue management is (why two seats cost different prices)",
    body: `# What revenue management is

Ask most people what something "costs" and they'll give you a single number, as if every product has one true price stamped on it forever. But sit on an airplane and quietly ask the travelers around you what they paid, and you'll hear a dozen different numbers for the very same seat on the very same flight. That isn't a glitch or a rip-off — it's **revenue management**, the craft of deciding what to charge, for what, to whom, and when, so a business earns the most it possibly can from what it has to sell. Learning to see those different prices as a deliberate skill instead of an accident is the whole game.

## The same seat, many prices

The traveler in 14C might have paid $120 because they booked three months early; the one in 14D paid $450 because they booked last night for a work trip; the one in 14E grabbed a $90 deal in a weekend sale. Same flight, same legroom, same little bag of pretzels — three very different prices. Revenue management is the reason. Instead of asking "what is the right price for a seat?", it asks "what is the right price for *this* seat, sold to *this* kind of buyer, at *this* moment?" The single price most people imagine gets replaced by a moving set of prices aimed at different people and different times.

## Why one fixed price leaves money behind

Imagine the airline picked one price for everyone — say $250. The business traveler who would happily have paid $450 now pays only $250, so the airline *loses* $200 it could have had. Meanwhile the budget traveler who could only afford $120 doesn't fly at all, so the airline loses that sale completely *and* sends the plane up with an empty seat. A single fixed price is almost always too high for some customers and too low for others at the same time. Revenue management exists because that one-price-fits-all approach quietly leaves money on the table at both ends.

## What revenue management actually decides

At heart, revenue management juggles a few linked decisions: *what price* to set, *how many* to sell at each price, and *when* to change those prices as the selling window runs out. It decides how many cheap early-bird seats to release before holding the rest back for late, higher-paying buyers. It decides when to drop the price to fill seats that would otherwise fly empty, and when to *raise* it because demand is strong. None of these is a one-time choice — they're constantly re-decided as information arrives about who's actually buying.

## Why it works best on perishable things

Revenue management shines for a special kind of product: one with a **fixed supply** that **expires.** An airplane has a set number of seats, and the moment the doors close, every empty seat is worth exactly zero forever — you can't sell tonight's empty seat tomorrow. Hotel rooms, concert tickets, cruise cabins, and rental cars are all like this: limited, and worthless once the date passes. That mix — you can't make more, and the unsold ones vanish — is exactly why squeezing the most money out of each one before it expires becomes a serious, dedicated craft.

## Is it fair?

It can feel unfair that your neighbor paid less, but look closer and there's a logic. The flexible price lets the airline sell cheap seats to people who'd otherwise be priced out *and* fill the plane, which keeps flights running and average fares lower than a single high price would be. The business traveler who paid more values the last-minute flexibility and can afford it; the student who planned ahead got rewarded for it. Revenue management isn't about tricking anyone — it's about matching different prices to different needs so more of the plane gets sold to more kinds of people.

## In the real world

The whole field was born at the airlines. In the 1980s, after U.S. airlines were deregulated, low-cost newcomers like PeopleExpress undercut the big carriers with rock-bottom fares. American Airlines fought back not by matching every fare, but by inventing what it called "yield management" — selling a *limited* number of cheap advance seats to win price-sensitive travelers, while protecting the rest for late-booking business flyers who'd pay full fare. It let one airline compete at both the low end and the high end of the same plane at once, and it worked so well it's credited with driving those rivals out of business. Every time you see an early-bird discount, a "prices may rise" warning, or a last-minute surcharge, you're looking at the descendants of that idea — the simple, powerful realization that the smartest price is rarely a single number.`,
  },
  {
    slug: "willingness-to-pay",
    title: "Willingness to pay",
    weekNumber: 1,
    blurb: "Every buyer carries a secret number in their head — the most they'd pay before walking away — and almost the entire art of pricing is trying to guess that hidden number.",
    lectureTitle: "1.2 Willingness to pay (the hidden number behind every sale)",
    body: `# Willingness to pay

Behind every single sale there's a hidden number the seller almost never gets to see: the most that particular buyer would have been willing to pay before deciding to walk away. Economists call it **willingness to pay**, and it's the invisible foundation under every price tag in the world. You carry one in your head for everything you buy — a number where, one cent higher, you'd say "no thanks." Understanding that this number exists, that it's different for every person, and that sellers are constantly trying to guess it, is the key that unlocks the rest of pricing.

## The number in your head

Picture yourself eyeing a hoodie. There's some price — maybe $40 — where you'd happily buy it, and some price — maybe $80 — where you'd shrug and leave. Somewhere between sits your personal ceiling, the most you'd part with. That ceiling is your willingness to pay. The important thing is that it's *yours*: the person next to you might have a ceiling of $120 because they love the brand, and someone else's might be $25. The same hoodie meets a different hidden number in every shopper's head.

## The gap that creates a happy customer

Here's a lovely consequence. If your ceiling is $80 and the hoodie is priced at $40, you don't just buy it — you feel like you *won*. That gap between what you would have paid and what you actually paid is called **consumer surplus**, and it's the warm feeling of a good deal. But notice what it means for the seller: every dollar of your happy surplus is a dollar they *could* have charged you and didn't. Pricing is a quiet tug-of-war over that gap — buyers want it big, sellers want it small.

## Why sellers are guessing in the dark

The seller's whole problem is that willingness to pay is **invisible.** No customer walks in announcing "I'd pay up to $80." If the seller sets the price too high, above your ceiling, they lose the sale entirely. If they set it too low, far below your ceiling, they make the sale but leave money on the table. They're trying to hit a target they can't see, person after person, each with a different number. Almost every pricing tactic in this course is really a clever attempt to *uncover* or *get closer to* that hidden ceiling.

## Reading the clues

Since they can't see the number directly, sellers hunt for clues that hint at it. *Who* is buying — a rushed business traveler usually has a higher ceiling than a flexible tourist. *When* they're buying — someone shopping for a gift the night before a birthday will pay more than someone idly browsing weeks ahead. *What else they buy*, how they react to a discount, whether they bother to clip a coupon — all of it whispers something about their ceiling. A skilled pricer is part detective, reading behavior to estimate a number nobody will say out loud.

## Many ceilings, not one

The reason a single price can never be perfect comes straight from this idea: a room full of buyers holds a whole *range* of willingness-to-pay numbers, not one shared value. Set one price and you simultaneously lose everyone below it while under-charging everyone above it. This is why the later topics exist — elasticity, fences, discounts, and dynamic pricing are all tools for dealing with the awkward, wonderful fact that every buyer's ceiling is different and hidden.

## In the real world

Think about how a car dealership works, which is practically a machine for discovering willingness to pay. The sticker price is just a starting flag; the real price emerges through haggling, where the salesperson probes — "what monthly payment works for you?", "are you trading in?", "is this your dream color?" — each question quietly measuring how high your ceiling sits. Two buyers can drive off the same lot in identical cars having paid thousands of dollars apart, because the dealer successfully read one buyer's ceiling as higher than the other's. Many people hate the haggle precisely because they sense their hidden number is being hunted — which is exactly what's happening. Online sellers do something gentler but similar, watching your clicks and history to estimate the same secret number a dealer tries to talk out of you.`,
  },
  {
    slug: "price-elasticity",
    title: "Price elasticity",
    weekNumber: 1,
    blurb: "When you raise a price, some customers shrug and some flee — and how strongly your buyers react decides whether raising prices makes you more money or less.",
    lectureTitle: "1.3 Price elasticity (how demand bends when prices move)",
    body: `# Price elasticity

Raise the price of something and you'll sell fewer of it — that much everyone knows. But the crucial question, the one that decides whether raising prices is brilliant or disastrous, is *how many* fewer. For some products a price hike barely dents sales; for others it sends customers running. This sensitivity — how much demand bends when the price moves — is called **price elasticity**, and it's one of the most useful ideas in all of pricing, because it tells you which way to push a price to make more money.

## Bendy demand and stiff demand

Some products have **elastic** ("bendy") demand: when the price goes up a little, a lot of customers walk away, and when it drops a little, lots more pile in. Other products have **inelastic** ("stiff") demand: the price can move quite a bit and people keep buying about the same amount. A fancy brand of soda is bendy — raise it and shoppers grab a different bottle. Life-saving medicine is stiff — its price can climb steeply and patients still buy, because they have no real choice. Most things sit somewhere between these two extremes.

## What makes demand bendy

Whether a product is elastic or stiff comes down to a few honest questions. *Are there easy substitutes?* If a near-identical option sits on the next shelf, demand is bendy, because buyers can switch in a heartbeat. *Is it a necessity or a luxury?* Necessities stay stiff; nice-to-haves bend. *Does it eat a big chunk of someone's budget?* People barely notice a price change on a pack of gum but agonize over one on a car. *Is there time to react?* Given a week, customers find alternatives they couldn't find in a minute. The fewer escape routes a buyer has, the stiffer their demand.

## Why this decides which way to push price

Here's the payoff. If demand is **stiff**, *raising* the price makes more money: you lose only a few sales but earn more on every remaining one, so the total grows. If demand is **bendy**, raising the price *backfires* — you lose so many customers that the higher price on the few who stay can't make up for it, and your total shrinks. The same move, a price increase, helps one business and wrecks another, purely because of elasticity. Knowing whether your product is bendy or stiff tells you whether your prices should go up or down.

## The same product can bend differently

Elasticity isn't even fixed for one product — it changes by customer and by moment. Coffee is stiff for the half-asleep commuter who *needs* it now and bendy for the leisurely weekend shopper comparing brands. Umbrellas are bendy on a sunny day and remarkably stiff in a sudden downpour. This is the bridge to the rest of the course: because the same thing is bendy for some buyers and stiff for others, a smart seller tries to charge the stiff-demand customers more and offer the bendy ones a deal — without letting them trade places.

## The trap of guessing wrong

The danger is assuming you know your elasticity without checking. A store owner *certain* that customers will tolerate a price hike can quietly bleed sales if demand turns out bendier than they thought, and a manager *afraid* to ever raise prices can leave a fortune uncollected on a stiff-demand product. Because elasticity is invisible until tested, good pricers treat it as something to *measure* — nudge a price, watch what happens to sales, and learn — rather than a fact they already know. Acting confidently on the wrong guess about elasticity is one of the most expensive mistakes in pricing.

## In the real world

Streaming services are a live laboratory for elasticity. For years Netflix raised prices cautiously, watching nervously for "churn" — the customers who cancel — to learn just how bendy their demand really was. Each increase was a test: if only a few subscribers left, demand was stiffer than feared and the higher price won; if many fled, they'd pushed too far. They discovered demand was stiffer than skeptics predicted — most people grumbled but kept paying, because the substitutes weren't quite as good and canceling felt like a hassle — which is why prices kept creeping up. Compare that to a small coffee shop next door to three rivals, where nudging the price of a latte up by a dollar can send regulars across the street overnight. Same action, opposite outcome, all because one faces stiff demand and the other faces bendy demand.`,
  },
  {
    slug: "price-discrimination-fences",
    title: "Price discrimination and fences",
    weekNumber: 1,
    blurb: "The dream of pricing is to charge each buyer exactly their own ceiling — and the trick that makes it possible is building clever 'fences' that sort big spenders from bargain hunters.",
    lectureTitle: "1.4 Price discrimination and fences (charging each buyer their price)",
    body: `# Price discrimination and fences

If every buyer has a different hidden ceiling, the seller's dream is obvious: charge each person exactly *their* ceiling — high prices to those who'll pay them, low prices to those who won't. Charging different customers different prices for essentially the same thing is called **price discrimination**, and despite the harsh-sounding name it's completely legal and absolutely everywhere. The genius isn't the wish to do it — that's easy — it's the practical trick that makes it work: building **fences** that sort the big spenders from the bargain hunters without either one jumping the fence.

## The dream and its obvious problem

Suppose you could somehow charge the business traveler $450 and the student $90 for the same seat. Wonderful — except the moment you offer a $90 price, what stops the business traveler from simply *also* buying the $90 ticket? If everyone can grab the lowest price, your different prices collapse into one low price and the dream dies. So price discrimination only works if you can make the cheap option *unattractive or unavailable* to the people who'd happily pay more. That barrier is the whole secret.

## Fences: barriers only some will cross

A **fence** is a condition attached to a low price that the high-paying customers won't or can't meet, even though the bargain hunters happily will. The cheap airfare requires booking weeks ahead and staying over a Saturday night — easy for a flexible tourist, impossible for a Monday-morning meeting. The discount requires clipping a coupon, waiting for a sale, or buying a giant warehouse-sized box. None of these change the product much; they're hoops, and the willingness to jump through a hoop neatly sorts the price-sensitive from the price-blind. Good fences let the same product reach both crowds at two prices.

## The flavors of price discrimination

It shows up in a few recognizable shapes. There's pricing by *group* — student, senior, and child discounts, where an easy-to-check label stands in for a lower ceiling. There's pricing by *quantity* — the bulk discount, where eager buyers self-select into a cheaper per-unit price. And there's pricing by *version* — offering a basic and a premium edition so customers sort themselves by which one they choose. All three are the same move underneath: create options so buyers reveal their own ceiling by which one they pick.

## Why good fences are hard to build

The art is choosing a fence that lines up with willingness to pay *and* feels acceptable. A leaky fence — one the high payers can easily slip through — destroys your high price. But a fence that's too annoying drives away customers you wanted to keep, and a fence that feels *unfair* can spark real anger, like charging someone more for the identical item just because of who they are. The best fences feel like the customer made a choice — "I chose the cheaper, less convenient option" — rather than like they were singled out and punished. That sense of choice is what keeps price discrimination from feeling like a con.

## Versioning: fences you build on purpose

One of the cleverest fences is deliberately making a slightly worse version of your product. Software companies sell a stripped-down "basic" tier and a full "pro" tier; airlines sell a cramped basic-economy fare beside a roomier one. Sometimes the cheaper version literally costs *more* to create — the company adds restrictions on purpose — which seems crazy until you see the point: the worse option exists to *fence in* the bargain hunters so the premium one can keep its high price for everyone else. The damaged-on-purpose product is a fence wearing a disguise.

## In the real world

Movie theaters are a tidy example of fences everywhere. The same film, same seat, costs less for a child, less for a senior, less at a Tuesday matinee, and more on Friday night — each a fence sorting buyers by their ceiling. The matinee fence is especially clever: a retiree or a student with a free afternoon happily comes at 2 p.m. for the cheaper ticket, while the working adult who can only come at 8 p.m. pays full price, and neither feels cheated because each "chose" their showtime. Coffee shops, theme parks, and software all run the same playbook — student IDs, off-peak rates, basic-versus-premium tiers — quietly charging each crowd closer to its own hidden ceiling while letting everyone feel they picked their own deal.`,
  },
  {
    slug: "dynamic-pricing",
    title: "Dynamic pricing",
    weekNumber: 1,
    blurb: "Some prices never sit still — they rise and fall by the hour as demand shifts, turning the price tag from a fixed label into a living thing that reacts to the world in real time.",
    lectureTitle: "1.5 Dynamic pricing (prices that move in real time)",
    body: `# Dynamic pricing

For most of history a price was a label — printed on a tag, painted on a menu, fixed until someone bothered to change it. But a growing share of prices today never sit still: they rise and fall by the hour, sometimes by the minute, reacting to how many people want the thing right now. This is **dynamic pricing** — letting the price move in real time as demand and supply shift — and it turns a price tag from a frozen number into something alive, constantly re-aiming itself at the moment.

## A price that breathes

Think of a rideshare fare on a rainy Friday night versus a quiet Tuesday afternoon: same trip, very different price, because the app is watching demand and adjusting on the spot. When lots of people want rides and few drivers are out, the price climbs; when demand fades, it falls. The price has become a kind of dial the business turns up and down automatically as the world changes. Instead of guessing one good price in advance and living with it, dynamic pricing keeps re-deciding the price as fresh information arrives.

## Why move the price at all

The reason to bother is that demand is never steady — it surges and slumps by time of day, day of week, weather, and events. A fixed price that's perfect on a calm Tuesday is far too low when a sudden crowd shows up wanting the same limited supply, so you sell out instantly and miss all the money those eager buyers would have paid. The same fixed price is too high on a dead afternoon, leaving you with empty seats and no sales. A price that moves can capture the high willingness to pay of the rush *and* tempt buyers during the lull — squeezing more out of both extremes than any single number could.

## Two jobs at once: earn more and balance the load

Dynamic pricing does something sneaky and useful beyond just earning more: it *shapes demand.* A high price during a surge doesn't only collect more money — it also nudges some flexible customers to wait, shift to a quieter time, or go elsewhere, which relieves the crush. A low off-peak price pulls demand *into* the slow times that would otherwise be wasted. So a moving price acts like a traffic signal for demand, smoothing the peaks and filling the valleys, which is especially valuable when supply is fixed and can't simply be expanded for the rush.

## The backlash problem

But moving prices make people uneasy, and ignoring that is a costly mistake. Customers accept a price that *rises* in obvious step with cost or scarcity, but a price that spikes during an emergency — say, ride fares soaring during a disaster — feels like **gouging** and breeds real anger and lasting distrust. People also hate feeling the price changed *because the system somehow knows them*, which crosses from "fair market" into "creepy." The lesson is that the technically optimal price can be the wrong price if it shatters customers' sense of fairness — a dynamic pricer has to weigh goodwill against the extra dollar.

## What makes it possible now

Dynamic pricing isn't new in spirit — markets and street vendors have always haggled prices to the moment — but technology turned it from rare to routine. Online prices can be changed instantly and invisibly, sensors and apps report demand second by second, and software can adjust millions of prices faster than any human could. That's why it has spread from its airline-and-hotel home into rideshares, online stores, sports tickets, even electricity and parking. The idea is old; the ability to do it constantly, automatically, and everywhere is what's genuinely new.

## In the real world

Ride-hailing's "surge pricing" is the example everyone has felt. When a concert lets out or rain hits at rush hour, demand for rides spikes against a limited pool of drivers, and the app raises fares — which both rations the scarce rides toward those who need them most *and* lures more drivers onto the road to meet the crush, so the surge tends to cool itself. It's textbook dynamic pricing: the price moves in real time to match supply and demand and to shape behavior on both sides. It's also a textbook lesson in backlash — riders have erupted at surge fares during snowstorms and emergencies, forcing companies to cap prices in crises, a direct admission that the "optimal" price and the *acceptable* price aren't always the same. The same tension plays out quietly every day in airline fares, hotel rates, and the shifting prices on your favorite shopping site.`,
  },
  {
    slug: "overbooking-capacity",
    title: "Overbooking and capacity",
    weekNumber: 1,
    blurb: "Airlines deliberately sell more seats than the plane holds — and far from being a scam, it's a careful gamble that fills planes that would otherwise fly with empty seats.",
    lectureTitle: "1.6 Overbooking and capacity (selling what you might not have)",
    body: `# Overbooking and capacity

Here's a practice that sounds outrageous until you understand it: airlines, hotels, and restaurants routinely sell *more* reservations than they actually have room for. A 180-seat plane might sell 190 tickets on purpose. It seems like a recipe for disaster — and occasionally it is — but **overbooking** is actually a careful, calculated gamble built on a simple, reliable fact: some people who book never show up. Managing that gap between bookings and bodies is one of the sharpest balancing acts in revenue management.

## The empty-seat problem

Start with the pain overbooking solves. On any flight, a predictable slice of ticket-holders simply don't appear — they miss connections, change plans, or no-show — and a missed reservation means a seat flies empty. An empty seat is pure loss: it can never be sold again once the doors close, and the airline already turned away other customers to "save" it. If, say, 10% of bookings typically vanish, then selling exactly 180 tickets reliably flies the plane with empty seats and lost money. Overbooking is the attempt to fill those phantom no-shows in advance.

## Selling the gamble

So the airline sells extra tickets, betting that the usual no-shows will make room. If history says about 10 of 180 booked passengers won't show, selling 190 means the plane likely departs comfortably full — every seat earning money instead of flying empty. It's a bet on a pattern: no-shows are surprisingly steady and predictable in the aggregate, even though you can't know *which* individuals will vanish. Done right, overbooking quietly converts wasted empty seats into real revenue, flight after flight.

## When the gamble loses

But a bet can lose, and overbooking's failure is dramatic: sometimes *everyone* shows up, and now there are more passengers than seats. The airline must "bump" someone — and that means real cost, from cash vouchers and hotel rooms to furious customers and bad headlines. So overbooking is a trade-off between two opposite mistakes, exactly like inventory's too-much-versus-too-little: book too *few* extra and you fly with empty seats (lost money), book too *many* extra and you face expensive, reputation-damaging bumps. The skill is sizing the overbooking to balance those two costs.

## Finding the right amount

How far to overbook depends on weighing the two harms. If an empty seat is cheap to eat but a bump is catastrophic — say, customers who'd never forgive you — you overbook timidly. If empty seats are very costly and a bump is cheaply smoothed over with a voucher, you overbook boldly. The no-show rate matters too: a route full of flexible leisure travelers with many no-shows can be overbooked more aggressively than one packed with committed travelers who always appear. It's the same balancing-two-mistakes logic that runs through pricing, applied to bodies in seats.

## Softening a lost bet

Smart operators also blunt the downside so a lost gamble hurts less. Rather than forcing unlucky passengers off, airlines now *auction* the inconvenience — offering rising vouchers until enough volunteers happily give up their seats — which turns an angry bump into a willing trade. That's revenue-management thinking again: find the customer with the lowest "willingness to stay" and pay them to flex, instead of punishing someone at random. Overbooking paired with a graceful way to handle the overflow is far better than either flying empty or bumping people brutally.

## In the real world

Overbooking became infamous in 2017 when United Airlines, having overbooked a full flight, had a paying passenger forcibly dragged off the plane to make room for crew — a video that went viral and cost the airline a fortune in outrage and apologies. It's the perfect cautionary tale: overbooking is a sound, money-making practice, but the moment a lost gamble is handled badly, the reputational cost can dwarf the empty-seat money it was meant to save. The industry's response proved the better path — airlines leaned harder into voluntary, rising-cash buyouts so that when too many people show up, someone *chooses* to take the deal. Hotels and restaurants run the same playbook, quietly overbooking against predictable no-shows and keeping a plan ready for the night everyone actually arrives.`,
  },
  {
    slug: "discounts-bundles-anchors",
    title: "Discounts, bundles, and anchors",
    weekNumber: 1,
    blurb: "A price isn't just a number — it's a feeling, and clever sellers use discounts, bundles, and reference points to change what a price feels like without changing what you actually get.",
    lectureTitle: "1.7 Discounts, bundles, and anchors (the psychology of price)",
    body: `# Discounts, bundles, and anchors

So far we've treated pricing as a fairly rational hunt for hidden ceilings. But there's a twist: people don't judge prices with cool logic — they judge them with *feelings*, against whatever comparison happens to be nearby. The very same price can feel like a steal or a rip-off depending on how it's presented. This topic is about the **psychology of price**: how discounts, bundles, and anchors change what a price *feels* like, often without changing what the customer actually gets.

## Prices are felt, not calculated

A price has no meaning on its own — $50 is only "expensive" or "cheap" compared to something. Our brains grab whatever reference point is handy and judge from there, which means the *context* around a price shapes how it lands as much as the number itself. A clever seller doesn't just pick a number; they pick the comparison the customer will measure it against. Get the comparison right and a price feels generous; get it wrong and the identical price feels like a gouge.

## Anchors: the power of the first number

An **anchor** is the first or most prominent number you see, and it quietly sets the bar for everything after. Show a $1,200 watch beside a $400 one and the $400 suddenly feels reasonable — the $1,200 anchor did the work. That's why a "was $80, now $50" tag is so powerful: the crossed-out $80 is an anchor that makes $50 feel like a win, even if the thing was always worth about $50. Anchors explain why menus put one wildly expensive dish at the top (to make the rest look moderate) and why a "suggested retail price" exists at all — to give your discount something to shine against.

## Discounts: selling the feeling of winning

A discount sells more than a lower price — it sells the *thrill of a deal.* "50% off" lights up a buyer in a way a quietly low price never does, because the discount hands them a number to feel triumphant about. This is also a fence in disguise (the bargain hunter clips the coupon, the busy shopper doesn't) and an anchor in disguise (the original price props up the sale price). But there's a danger: lean on discounts too hard and you *train* customers to wait, until nobody will buy at full price and the "sale" price quietly becomes the only real price you can charge.

## Bundles: hiding the price of each piece

A **bundle** wraps several items into one combined price — the value meal, the cable package, the software suite. Bundling works partly because it's convenient, but mostly because it *blurs* the price of any single piece, so customers can't easily judge whether each part is a good deal. It also smooths over different ceilings: someone who'd never pay full price for the fries on their own happily accepts them folded into a meal deal. And it can move products that would struggle alone by pairing them with a star item everyone wants — the bundle carries the weak piece along.

## The honesty line

All of this skates near a line, and crossing it is costly. Presenting a price well — a fair anchor, a real discount, a sensible bundle — is legitimate salesmanship. But a *fake* anchor (a "was" price the item never actually sold at), a discount off an inflated number, or a bundle designed to sneak in something worthless tips into deception, and customers increasingly see through it. The psychology of price is powerful precisely because it works on feelings, which is exactly why it has to be used with some restraint: a trick that wins today's sale but leaves the buyer feeling fooled poisons every future one.

## In the real world

The "anchor" is on full display in any furniture or mattress store, where almost nothing ever sells at the sticker price — there's a permanent "sale," and the high original price exists mainly to be crossed out so the real price feels like a rescue. Restaurant menus play the same game: a $90 steak nobody orders sits near the top so the $40 dishes feel sensible by comparison, and combo meals bundle a drink and fries so you stop tallying each item's worth. Stores like JCPenney even learned this the hard way — when it once scrapped fake "sale" prices for honest everyday-low pricing, shoppers *hated* it, because they missed the thrill of the discount even though they were often paying the same or less. It was a stark proof of this topic's core lesson: a price isn't just what you pay, it's how the sale is made to *feel.*`,
  },
  {
    slug: "pricing-strategy-capstone",
    title: "Setting a pricing strategy (capstone)",
    weekNumber: 1,
    blurb: "Every idea in the course comes together in one decision: choosing a pricing strategy — and the deepest lesson is that the 'right' price is never a single number, but a set of honest trade-offs.",
    lectureTitle: "1.8 Setting a pricing strategy (Capstone)",
    body: `# Setting a pricing strategy (capstone)

We end where every business actually has to land: deciding, all things considered, how to price. Each earlier topic gave you one lens — hidden ceilings, elasticity, fences, dynamic prices, overbooking, psychology — but a real pricing strategy has to weave them into a single, coherent plan and live with the trade-offs between them. **Setting a pricing strategy** is the capstone skill: choosing not a number but an *approach* that fits your product, your customers, and your goals — and accepting that there is no perfect answer, only well-reasoned ones.

## There is no single right price

The first hard truth is that "the right price" doesn't exist as a fact waiting to be discovered. Buyers have a whole range of hidden ceilings, demand bends differently for different people, and your costs, rivals, and goals all pull in different directions. So pricing is never solving for one true number — it's *choosing* among reasonable options, each with different winners and losers. A strategy is the set of principles you'll use to keep choosing well as the world shifts, not a price you set once and forget.

## Three forces every price must answer to

A sound price has to reckon with three things at once. First, **cost** — you generally can't sell below what it takes to make and deliver, or you bleed money. Second, **customers** — their willingness to pay and elasticity set the ceiling and how much room you have to move. Third, **competition** — what rivals charge frames what your price will feel like to buyers. Lean only on cost and you ignore what people will actually pay; chase only competitors and you race to the bottom; obsess only over customers and you might price past what the market allows. A real strategy holds all three in view.

## Choosing a posture

Strategies tend to start from a posture toward those forces. A business can pursue **skimming** — set a high price to harvest the high-ceiling customers first, then lower it over time — or **penetration** — set a low price to grab lots of customers fast and worry about profit later. It can aim to be the **premium** option that signals quality through a high price, or the **value** option that wins on being cheapest. None is universally right: skimming suits a hot new gadget, penetration suits a service that gets more valuable as more people join, premium suits a luxury good, value suits a commodity. The posture should follow from the product and the goal.

## Weaving the tools together

Once the posture is set, the earlier tools become the instruments that execute it. Elasticity tells you which way to nudge prices; fences and versioning let you serve high and low ceilings at once; dynamic pricing matches the price to the moment; overbooking squeezes value from perishable capacity; anchors and bundles shape how the whole thing *feels.* The capstone insight is that these aren't separate tricks but parts of one system — a discount is also a fence is also an anchor — and a coherent strategy uses them in concert rather than reaching for whichever is fashionable.

## Trade-offs and the long game

Every pricing choice trades something off, and the sharpest trade-off is short-term money against long-term trust. You can almost always squeeze more from customers today — a surge fee, a sneaky add-on, a fake discount — but each squeeze spends down goodwill, and goodwill is what brings customers back. The best strategies treat fairness not as charity but as an investment: a price that feels honest earns repeat business that a cleverer, greedier price would destroy. Knowing *when not to* charge the maximum is as much a part of strategy as knowing how to charge more.

## The biggest questions stay open

And much stays genuinely unsettled. How much of a customer's surplus *should* you take before fairness tips into exploitation? When does a clever fence become a cynical trap? How do you price something brand-new, with no history to learn from? There's no formula — these take judgment, weighing money you can grab now against trust you'll need later, and reading customers who can't or won't tell you their real ceiling. The most useful habit to carry out of this course is to ask, whenever you set a price: "what is this price really doing — to my revenue, to my different customers, and to whether they'll come back?"

## In the real world

Watch how a company like Apple sets prices and you see a whole strategy, not a number. It chooses a deliberately **premium** posture — high prices that signal quality and protect a luxury image it would never discount its way out of — then **skims** with each new model, launching high to capture eager early adopters before nudging older models down to reach value buyers. It **versions** ruthlessly (storage tiers, "Pro" models) to fence high ceilings from low ones, **anchors** with an ultra-premium option that makes the mid-tier feel reasonable, and **bundles** services to blur and smooth its prices. Every tool from this course is visible, working together toward one coherent goal — and crucially, it almost never slashes prices in a panic, because it's playing the long game of trust and brand that a short-term squeeze would wreck. That's what a pricing *strategy* looks like: not a perfect price, but a consistent, deliberate set of choices about what kind of seller you intend to be.`,
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
    title: "Homework 1.1 — Revenue management, willingness to pay, elasticity, and fences",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. There's no need for any math — just explain your thinking clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-revenue-management-is",
        prompt:
          "A friend says, 'It's obviously unfair and a rip-off that the person next to me on the plane paid half what I did for the same seat — the airline should just charge everyone one honest price.' Using the idea of revenue management, explain why a single fixed price would actually leave the airline worse off and isn't simply 'more fair.' (3–5 sentences.)",
        correctAnswer:
          "Revenue management exists because buyers have different hidden ceilings, so a single fixed price is too high for some customers and too low for others at the same time. If the airline charged everyone one price, it would lose the budget travelers who can only afford a low fare (flying with empty seats) and undercharge the business travelers who'd happily pay much more — leaving money on the table at both ends. A seat is also perishable and fixed in supply: once the doors close an empty seat is worth zero forever, so filling it cheaply beats flying it empty. The different prices actually let more kinds of people fly and keep average fares lower than one high single price would, so it isn't simply unfair — it's matching different prices to different needs.",
        explanation:
          "Full credit: explains buyers have different hidden ceilings so one fixed price is simultaneously too high for some and too low for others (lost money at both ends), notes seats are perishable/fixed supply (empty seat worth zero), and that varied prices fill the plane and serve more buyers rather than being a simple rip-off.",
      },
      {
        topicSlug: "willingness-to-pay",
        prompt:
          "A shop owner sets one price for a hoodie and is thrilled when it sells quickly to almost everyone who looks at it. A pricing consultant warns this might actually be a problem. Using the idea of willingness to pay, explain what the consultant is worried about. (3–5 sentences.)",
        correctAnswer:
          "Willingness to pay is the hidden ceiling — the most each buyer would pay before walking away — and it's different for every customer. If nearly everyone buys instantly and happily, that's a sign the price is sitting well below many shoppers' ceilings, so each of those buyers is enjoying a big consumer surplus (the gap between what they'd have paid and what they did). Every dollar of that happy surplus is a dollar the owner could have charged and didn't, so a price that sells too easily is leaving money on the table. The consultant isn't saying to gouge people, but that a price this comfortable suggests room to raise it — or to offer a higher-priced version — closer to those higher hidden ceilings.",
        explanation:
          "Full credit: defines willingness to pay as the hidden per-buyer ceiling, explains that instant easy sales signal the price is far below many ceilings (large consumer surplus = money the seller could have captured), and concludes there's likely room to raise the price or add a higher option toward those ceilings.",
        hint: "Think about what it means if a price is well below most buyers' hidden ceilings — who is capturing the gap, the buyer or the seller?",
      },
      {
        topicSlug: "price-elasticity",
        prompt:
          "Two shops both decide to raise prices by 10%. The pharmacy's sales barely change, while the coffee shop next to three rivals loses a third of its customers. Using price elasticity, explain why the same 10% increase helped one business and hurt the other. (3–5 sentences.)",
        correctAnswer:
          "Price elasticity is how much demand bends when the price moves: stiff (inelastic) demand barely reacts, while bendy (elastic) demand drops sharply. The pharmacy sells near-necessities with few easy substitutes, so demand is stiff — a 10% rise loses only a few sales but earns more on every remaining one, so total revenue grows. The coffee shop faces bendy demand because three rivals next door make switching effortless, so a 10% rise sends many customers across the street and the higher price on the few who stay can't make up for it. The same action helps the stiff-demand business and hurts the bendy-demand one, which is exactly why knowing your elasticity tells you which way to push price.",
        explanation:
          "Full credit: defines elasticity (stiff vs bendy demand), explains the pharmacy has stiff demand (necessity, few substitutes) so a raise earns more, the coffee shop has bendy demand (easy substitutes/rivals) so a raise loses too many customers, and that elasticity determines whether raising price helps or hurts.",
      },
      {
        topicSlug: "price-discrimination-fences",
        prompt:
          "An airline wants to charge tourists a low fare and business travelers a high fare for the same route, but worries the business travelers will simply buy the cheap tourist tickets. Using price discrimination and fences, explain how the airline can pull this off. (3–5 sentences.)",
        correctAnswer:
          "Price discrimination means charging different buyers different prices for essentially the same thing, and it only works if the high-paying customers can't easily grab the low price — that's the job of a fence. A fence is a condition attached to the cheap fare that price-sensitive tourists will happily meet but business travelers won't, such as requiring booking weeks ahead or staying over a Saturday night. A flexible tourist can plan around those rules, while a Monday-morning meeting makes them impossible, so the fence sorts the two groups without anyone being singled out. The best fences feel like the customer chose the cheaper, less convenient option rather than being punished, which keeps the lower fare from leaking to the people who'd pay full price.",
        explanation:
          "Full credit: defines price discrimination and explains it needs fences so high payers can't grab the low price, gives a valid fence that tourists meet but business travelers can't (advance purchase / Saturday-night stay), and notes good fences feel like a customer choice rather than unfair singling-out.",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Dynamic pricing, overbooking, psychology, and strategy",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. No math is required — explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "dynamic-pricing",
        prompt:
          "A parking garage charges the same price 24 hours a day. It's jammed and turning cars away at rush hour but nearly empty at midday. Using dynamic pricing, explain how letting the price move could help, and one risk the garage should watch for. (3–5 sentences.)",
        correctAnswer:
          "Dynamic pricing lets the price rise and fall in real time as demand shifts instead of staying frozen. A single fixed price is too low at rush hour — the garage sells out and misses the money those eager drivers would have paid — and too high at midday, leaving spaces empty. Raising the price during the rush captures the high willingness to pay and also nudges some flexible drivers to come at a quieter time, while a lower midday price pulls demand into the empty hours, so a moving price both earns more and smooths the load. The risk to watch is backlash: if prices spike in a way that feels like gouging (say during an emergency), customers feel cheated and trust is damaged, so the technically optimal price isn't always the acceptable one.",
        explanation:
          "Full credit: explains dynamic pricing moves the price with demand, that a fixed price is too low at peak (sellouts/lost money) and too high off-peak (empty spaces), that a moving price captures peak willingness to pay and shifts/smooths demand, and names the backlash/fairness (gouging) risk.",
        hint: "Think about why one price is wrong at both the busy and the empty hours — and how customers might react if the price jumps too far.",
      },
      {
        topicSlug: "overbooking-capacity",
        prompt:
          "A hotel manager refuses to ever take more reservations than rooms, proud of never overbooking — yet most nights a few rooms sit empty because some guests no-show. Using overbooking and capacity, explain the cost of this policy and the trade-off the manager is ignoring. (3–5 sentences.)",
        correctAnswer:
          "A room, like a seat, is perishable and fixed in supply: once the night passes an empty room earns zero forever, and some booked guests predictably no-show, so booking exactly to capacity reliably leaves rooms empty and money lost. Overbooking deliberately sells a few extra reservations, betting on the steady, predictable no-show rate so the hotel fills the rooms that would otherwise go empty. The trade-off the manager is ignoring is between two opposite mistakes: book too few extra and you eat empty rooms (lost money), book too many and occasionally everyone shows up and you must turn guests away (a costly, reputation-damaging bump). The skill is sizing the overbooking to balance those two costs — and softening a lost bet, for example by offering volunteers a deal to give up their room rather than bumping someone at random.",
        explanation:
          "Full credit: explains rooms are perishable/fixed and no-shows are predictable so booking to capacity wastes empty rooms, that overbooking bets on the steady no-show rate, names the trade-off (too few extra = empty rooms vs too many = costly bumps), and ideally that the right amount balances those costs / soften the downside with voluntary buyouts.",
      },
      {
        topicSlug: "discounts-bundles-anchors",
        prompt:
          "A mattress store keeps a permanent '$1,500, now $799!' sign on a mattress that has basically always sold for around $799. Using anchors and the psychology of price, explain why this works on shoppers — and where it could cross a line. (3–5 sentences.)",
        correctAnswer:
          "A price has no meaning on its own; people judge it against whatever comparison is nearby, and an anchor is the first or most prominent number that sets that bar. The crossed-out $1,500 is an anchor that makes $799 feel like a rescue, so shoppers feel the thrill of winning a deal even though the mattress was always worth about $799 — the discount is selling a feeling, not just a lower price. It works because prices are felt, not calculated, and the high 'original' props up the sale price. It crosses a line when the anchor is fake — a 'was' price the item never actually sold at — because that tips legitimate presentation into deception, and customers who feel fooled won't come back, which costs more than the sale was worth.",
        explanation:
          "Full credit: explains prices are judged against a nearby comparison and an anchor sets that reference, that the crossed-out high price makes $799 feel like a deal (selling the feeling of winning), and that it crosses into deception when the original price is fake/never-charged, damaging trust.",
      },
      {
        topicSlug: "pricing-strategy-capstone",
        prompt:
          "A new company asks, 'Just tell us the one correct price for our product.' Using the idea of a pricing strategy, explain why there's no single right price and what the company should think about instead. (3–5 sentences.)",
        correctAnswer:
          "There's no single right price because buyers have a whole range of hidden ceilings, demand bends differently for different people, and cost, competitors, and goals all pull in different directions — so pricing is choosing among reasonable options, not discovering one true number. The company should weigh three forces at once: cost (the floor below which they lose money), customers (their willingness to pay and elasticity), and competition (what rivals charge frames how their price feels). They should also choose a posture that fits their product and goal — skimming high then lowering, penetrating low to grab share, premium, or value — and then use the course's tools (fences, dynamic pricing, anchors, bundles) to execute it. And they should weigh short-term money against long-term trust, since a price that feels fair earns the repeat business a greedier price would destroy.",
        explanation:
          "Full credit: explains there's no single right price (range of ceilings, competing forces, so it's a choice not a fact), names the three forces (cost, customers, competition), mentions choosing a posture/strategy (skimming/penetration/premium/value) that fits the product, and ideally the short-term-money vs long-term-trust trade-off.",
        hint: "Think about why one number can't be 'correct' when every buyer has a different ceiling — and the different forces (cost, customers, competitors) a price has to answer to.",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Revenue Management & Pricing Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-revenue-management-is",
        prompt:
          "Explain what revenue management is, why a single fixed price leaves money on the table, and what special kind of product (fixed, perishable supply) it works best for. Why does that view matter? (4–6 sentences.)",
        correctAnswer:
          "Revenue management is the craft of deciding what to charge, for what, to whom, and when, so a business earns the most possible from what it has to sell — replacing the idea of one true price with a moving set of prices aimed at different buyers and moments. A single fixed price leaves money on the table because buyers have different hidden ceilings: one price is simultaneously too high for budget customers (who don't buy, leaving empty capacity) and too low for high-ceiling customers (who'd happily have paid more). It works best for products with fixed supply that expires — airline seats, hotel rooms, concert tickets — because you can't make more and an unsold one is worth zero once its date passes, so squeezing the most from each before it expires really matters. Seeing price as a flexible tool rather than a fixed label matters because it lets a business serve both the bargain hunter and the big spender, filling capacity that would otherwise be wasted. The result is often more sales to more kinds of people and lower average prices than a single high price would allow.",
        explanation:
          "Full credit: defines revenue management (what/whom/when to charge to maximize revenue; price as flexible not fixed), explains a single price is too high for some and too low for others (lost money at both ends + unfilled capacity), identifies the fixed/perishable product type it suits, and why the flexible-price view matters.",
      },
      {
        topicSlug: "willingness-to-pay",
        prompt:
          "Explain what willingness to pay is, what consumer surplus is, and why willingness to pay being hidden is the core problem a seller faces. (4–6 sentences.)",
        correctAnswer:
          "Willingness to pay is the most a particular buyer would pay for something before walking away — a hidden ceiling that is different for every person and exists for everything they buy. Consumer surplus is the gap between that ceiling and the price they actually pay: if your ceiling is $80 and you pay $40, you enjoy $40 of surplus, the warm feeling of a good deal. That same gap is money the seller could have charged and didn't, so pricing is a tug-of-war over the surplus — buyers want it large, sellers want it small. The core problem is that willingness to pay is invisible: no customer announces their ceiling, so set the price too high (above the ceiling) and you lose the sale, set it too low and you leave money on the table. Because the seller is aiming at a target they can't see, person after person with a different number, almost every pricing tactic is really a clever attempt to uncover or get closer to that hidden ceiling — by reading clues like who is buying, when, and how they react to discounts.",
        explanation:
          "Full credit: defines willingness to pay (hidden per-buyer ceiling), defines consumer surplus (gap between ceiling and price paid = money the seller forgoes), and explains the hidden nature is the core problem (too high loses the sale, too low leaves money; tactics try to uncover it via clues).",
      },
      {
        topicSlug: "price-elasticity",
        prompt:
          "Explain price elasticity, what makes a product's demand bendy versus stiff, and why elasticity decides whether raising a price earns more money or less. (4–6 sentences.)",
        correctAnswer:
          "Price elasticity is how much demand bends when the price changes: elastic ('bendy') demand drops sharply when the price rises, while inelastic ('stiff') demand barely moves. What makes demand bendy comes down to escape routes — whether there are easy substitutes, whether it's a luxury rather than a necessity, whether it eats a big chunk of the budget, and whether buyers have time to react; the fewer escape routes, the stiffer the demand. Elasticity decides which way to push price because the two cases pull opposite ways: with stiff demand, raising the price earns more (you lose only a few sales but make more on every remaining one), while with bendy demand, raising the price backfires (you lose so many customers the higher price can't make up for it). So the very same action — a price increase — helps a stiff-demand business and wrecks a bendy-demand one. That's why elasticity isn't something to assume but something to measure: nudge a price, watch what happens to sales, and learn, because acting confidently on the wrong guess is one of the most expensive mistakes in pricing.",
        explanation:
          "Full credit: defines elasticity (bendy vs stiff demand reaction), lists what drives it (substitutes, necessity vs luxury, share of budget, time to react), and explains it decides price direction (raise price on stiff demand to earn more, raising on bendy demand backfires), ideally noting it should be measured not assumed.",
      },
      {
        topicSlug: "price-discrimination-fences",
        prompt:
          "Explain price discrimination, why fences are necessary for it to work, and what makes a good fence versus a bad one. (4–6 sentences.)",
        correctAnswer:
          "Price discrimination is charging different customers different prices for essentially the same thing — the seller's attempt to charge each buyer closer to their own hidden ceiling. It can't work on its own because the moment a low price exists, the high-paying customers would simply grab it too, collapsing every price into one low price; so you need a fence — a condition on the cheap price that the high payers won't or can't meet but bargain hunters happily will. Good examples are advance-purchase or Saturday-night-stay rules on cheap fares, coupons, bulk sizes, off-peak times, and basic-versus-premium versions; each is a hoop that sorts the price-sensitive from the price-blind without changing the product much. A good fence lines up with willingness to pay and feels like the customer chose the cheaper, less convenient option, so it doesn't breed resentment. A bad fence either leaks (the high payers slip through easily, destroying the high price) or feels unfair — singling someone out and charging them more for an identical item — which sparks anger and distrust.",
        explanation:
          "Full credit: defines price discrimination (different prices, same thing, to approach each ceiling), explains fences are needed so high payers can't grab the low price, gives valid fence types, and distinguishes good fences (align with WTP, feel like a customer choice) from bad ones (leaky or feel unfair/singling out).",
      },
      {
        topicSlug: "dynamic-pricing",
        prompt:
          "Explain what dynamic pricing is, why moving a price can earn more than a fixed one, how it also shapes demand, and the main risk it carries. (4–6 sentences.)",
        correctAnswer:
          "Dynamic pricing is letting the price rise and fall in real time as demand and supply shift, instead of fixing one number in advance. Moving the price earns more because demand surges and slumps — a fixed price perfect on a calm day is too low during a rush (you sell out and miss the money eager buyers would have paid) and too high during a lull (empty, unsold capacity), while a moving price captures the high willingness to pay of the peak and tempts buyers in the valley. It also shapes demand like a traffic signal: a high peak price nudges flexible customers to wait or shift to a quieter time, relieving the crush, while a low off-peak price pulls demand into the slow hours that would otherwise be wasted. The main risk is backlash over fairness — customers accept a price rising with genuine scarcity, but a spike during an emergency feels like gouging and breeds lasting distrust, and a price that seems to change because the system 'knows them' feels creepy. So the lesson is that the technically optimal price can be the wrong price if it shatters customers' sense of fairness.",
        explanation:
          "Full credit: defines dynamic pricing (price moves in real time with demand/supply), explains it earns more than a fixed price (too low at peak, too high off-peak), explains it also shapes/smooths demand (peak price defers demand, off-peak price fills valleys), and names the fairness/backlash (gouging) risk.",
      },
      {
        topicSlug: "overbooking-capacity",
        prompt:
          "Explain why businesses overbook, why it's a gamble rather than a scam, the trade-off between its two opposite mistakes, and how a lost bet can be softened. (4–6 sentences.)",
        correctAnswer:
          "Businesses overbook — selling more reservations than they have room for — because capacity is perishable and a predictable slice of bookings no-show, so booking exactly to capacity reliably flies with empty seats (or empty rooms) that are worth zero once the date passes. It's a calculated gamble, not a scam, because no-shows are surprisingly steady in the aggregate: if about 10 of 180 booked passengers usually don't appear, selling 190 likely fills the plane, even though you can't know which individuals will vanish. The trade-off is between two opposite mistakes, just like inventory: book too few extra and you eat empty seats (lost money), book too many and occasionally everyone shows up and you must bump someone (cash vouchers, hotels, furious customers, bad press). The right amount of overbooking balances those two costs and depends on the no-show rate and how expensive a bump is versus an empty seat. A lost bet can be softened by auctioning the inconvenience — offering rising vouchers until volunteers willingly give up their seats — which turns an angry forced bump into a trade someone chooses to take.",
        explanation:
          "Full credit: explains overbooking fights perishable empty capacity given predictable no-shows, that it's a gamble on a steady aggregate no-show pattern (not a scam), names the trade-off (too few extra = empty seats vs too many = costly bumps) and that the right amount balances them, and how to soften a lost bet (voluntary rising-voucher buyouts).",
      },
      {
        topicSlug: "discounts-bundles-anchors",
        prompt:
          "Explain why prices are 'felt, not calculated,' what an anchor does, how discounts and bundles work on buyers, and where this psychology crosses into deception. (4–6 sentences.)",
        correctAnswer:
          "Prices are felt, not calculated, because a number has no meaning on its own — our brains judge it against whatever comparison is nearby, so the context around a price shapes how it lands as much as the number itself. An anchor is the first or most prominent number you see, which sets the bar for everything after: show a $1,200 watch beside a $400 one and the $400 feels reasonable, and a crossed-out 'was $80, now $50' tag uses the $80 as an anchor to make $50 feel like a win. Discounts work by selling the thrill of a deal — a number to feel triumphant about — and double as a fence (the bargain hunter clips the coupon) and an anchor (the original props up the sale price). Bundles work by blurring the price of each piece so customers can't easily judge any single part, smoothing over different ceilings and carrying weak products along with a star item. It crosses into deception with a fake anchor (a 'was' price the item never sold at), a discount off an inflated number, or a bundle hiding something worthless — and customers who feel fooled won't come back, which costs more than the sale was worth.",
        explanation:
          "Full credit: explains prices are judged against nearby comparisons (felt not calculated), defines an anchor (prominent first number sets the bar; crossed-out original), explains discounts (sell the feeling of winning; also fence/anchor) and bundles (blur per-item price, smooth ceilings), and where it becomes deceptive (fake anchors/inflated originals) and why that backfires.",
      },
      {
        topicSlug: "pricing-strategy-capstone",
        prompt:
          "Explain why there is no single 'right' price, the three forces every price must answer to, and what it means to choose a pricing strategy rather than just a number. (4–6 sentences.)",
        correctAnswer:
          "There's no single right price because buyers hold a whole range of hidden ceilings, demand bends differently for different people, and cost, competitors, and goals all pull in different directions — so pricing is choosing among reasonable options with different winners and losers, not discovering one true number. Every price must answer to three forces at once: cost (the floor below which you lose money), customers (their willingness to pay and elasticity, which set the ceiling and your room to move), and competition (what rivals charge frames how your price feels). Leaning on only one — pricing purely off cost, or only chasing competitors, or only obsessing over customers — gives a lopsided price, so a real strategy holds all three in view. Choosing a strategy means picking a posture that fits your product and goal (skimming high then lowering, penetrating low to grab share, premium, or value) and then using the course's tools — fences, dynamic pricing, anchors, bundles — in concert to execute it. It also means weighing short-term money against long-term trust, since a price that feels fair earns repeat business a greedier price would destroy, so knowing when not to charge the maximum is part of the strategy.",
        explanation:
          "Full credit: explains there's no single right price (range of ceilings + competing forces = a choice not a fact), names the three forces (cost, customers, competition) and that all must be held in view, and explains choosing a strategy = a posture (skimming/penetration/premium/value) plus using the tools in concert, ideally noting the short-term-money vs long-term-trust trade-off.",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Revenue Management & Pricing Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "pricing-strategy-capstone",
        prompt:
          "Using ideas from across the whole course, argue that one habit of mind — 'the right price is never a single number, but a set of honest trade-offs between different buyers, the moment, and the long game' — runs through revenue management and pricing analytics. Show how it applies to at least three different topics (for example: revenue management, willingness to pay, elasticity, fences, dynamic pricing, overbooking, the psychology of price, or strategy). (5–7 sentences.)",
        correctAnswer:
          "The thread running through the whole course is that the right price is never one true number but a set of honest trade-offs — between buyers with different hidden ceilings, the shifting moment, and short-term money versus long-term trust. It starts with revenue management's core idea that a single fixed price is simultaneously too high for some buyers and too low for others, so a flexible set of prices serves more people and fills perishable capacity. Willingness to pay explains why: every buyer carries a different invisible ceiling, so the seller is always estimating a hidden number rather than reading a fixed one, and elasticity tells you which way to push — raise on stiff demand, never on bendy. Price discrimination and fences turn that into action by sorting high and low ceilings without letting them trade places, while dynamic pricing matches the price to the moment and overbooking squeezes value from capacity that expires. The psychology of price reminds us a number is felt against an anchor, so presentation matters as much as the figure, and the capstone weaves it all into a strategy that balances cost, customers, and competition. Underneath every one of these is the same honest acceptance of trade-offs and hidden, varied buyers — which is what makes pricing harder than a single number and far more powerful than one.",
        explanation:
          "Full credit: states the unifying habit (no single right price; honest trade-offs across varied/hidden buyers, the moment, and short vs long term) and applies it correctly to at least three distinct course topics with accurate detail.",
      },
      {
        topicSlug: "price-elasticity",
        prompt:
          "Someone insists, 'Raising prices always makes a business more money — if sales drop, just raise prices again until profits are huge.' Using ideas from the course, argue why this is wrong and when raising prices actually backfires. Use at least one concrete example. (5–7 sentences.)",
        correctAnswer:
          "The claim ignores price elasticity — how much demand bends when the price moves — which decides whether a price increase helps or hurts. With stiff (inelastic) demand, raising the price does earn more, because you lose only a few sales and make more on every remaining one; but with bendy (elastic) demand, raising the price backfires, because so many customers leave that the higher price on the few who stay can't make up for it, and total revenue falls. So 'always' is exactly wrong: the same action helps a stiff-demand business and wrecks a bendy-demand one. What makes demand bendy is escape routes — easy substitutes, being a luxury rather than a necessity, eating a big share of the budget, and time to react. A coffee shop with three rivals next door faces bendy demand, so a price hike sends regulars across the street and revenue drops, while a pharmacy selling a near-necessity with no substitute faces stiff demand, so a similar hike earns more. Because elasticity is invisible until tested, the smart move is to measure it — nudge a price and watch sales — not to assume prices can rise forever, which is one of the most expensive mistakes in pricing.",
        explanation:
          "Full credit: rejects 'raising prices always earns more,' explains elasticity (raising helps stiff demand but backfires on bendy demand because too many customers leave), names what makes demand bendy (substitutes/luxury/budget share/time), and supports it with a concrete example (e.g. coffee shop with rivals vs pharmacy), ideally noting elasticity must be measured.",
      },
      {
        topicSlug: "price-discrimination-fences",
        prompt:
          "A shopper fumes, 'Charging a student less than me for the exact same movie ticket is just unfair price-gouging — everyone should pay one identical price.' Using ideas from the course, argue why charging different buyers different prices can be reasonable rather than a rip-off. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'one identical price' demand assumes a single price would be fairer, but a single price is actually too high for some buyers and too low for others, because every buyer has a different hidden willingness to pay. Charging different prices for essentially the same thing is price discrimination, and it works through fences — conditions on the low price that some buyers meet and others won't — which lets a seller serve the low-ceiling customers and the high-ceiling ones instead of pricing one group out. The student discount is a fence using an easy-to-check label for a lower ceiling, and the Tuesday matinee is a fence too: a retiree or student with a free afternoon happily comes cheap at 2 p.m. while the working adult who can only come at 8 p.m. pays full price, and neither feels singled out because each 'chose' their showtime. Far from a rip-off, this fills seats that would otherwise be empty and lets more people see the film, often keeping average prices lower than one high single price would. It does cross a line when a fence feels like unfair singling-out or leaks so the high payers slip through, but a well-built fence the customer effectively chooses is reasonable, not gouging.",
        explanation:
          "Full credit: rejects 'one price is fairer,' explains buyers have different hidden ceilings so a single price is too high/low for different groups, defines price discrimination + fences (e.g. student discount, matinee) that sort buyers by a choice rather than singling out, and notes it serves more buyers/fills capacity, with the caveat about unfair or leaky fences.",
      },
      {
        topicSlug: "pricing-strategy-capstone",
        prompt:
          "A company boasts, 'We squeeze the maximum possible price out of every customer on every sale — surge fees, sneaky add-ons, fake discounts — so our strategy is perfect.' Using the course, explain why always charging the maximum can be a mistake and what a real pricing strategy should weigh. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "Squeezing the maximum from every sale confuses today's revenue with a real strategy, but pricing always trades short-term money against long-term trust, and goodwill is what brings customers back. You can almost always grab more right now — a surge fee, a hidden add-on, a fake 'was' price — but each squeeze spends down goodwill, and a buyer who feels fooled or gouged won't return, which costs more than the extra dollar was worth. A real strategy weighs three forces at once — cost (the floor), customers (their willingness to pay and elasticity), and competition (what rivals charge) — and then picks a coherent posture (skimming, penetration, premium, or value) rather than reaching for whatever extracts the most today. It also treats fairness as an investment, not charity, because a price that feels honest earns repeat business a greedier price destroys. Surge pricing during an emergency is the classic warning: ride-hailing fares that spiked in storms felt like gouging and triggered such backlash that companies had to cap them — proof the technically optimal price can be the wrong price. The deepest lesson of the course is that knowing when not to charge the maximum is as much a part of strategy as knowing how to charge more.",
        explanation:
          "Full credit: rejects 'always charge the maximum,' explains the short-term-money vs long-term-trust trade-off (each squeeze spends goodwill; fooled customers don't return), describes what a real strategy weighs (cost/customers/competition + a coherent posture, fairness as investment), and supports it with a concrete example (e.g. surge-pricing backlash forcing price caps).",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about revenue management and pricing cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete situations about how prices are set and why.",
    lectureTitle: "Primer: How to reason about revenue management and pricing cases",
    body: `# How to reason about revenue management and pricing cases

This short primer prepares you for the **Revenue Management & Pricing Analytics** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — two travelers who paid different fares for the same seat, a product that sells too easily, a price hike that helps one shop and wrecks another, a parking garage jammed at rush hour and empty at noon — and asks what the course's ideas tell you about it. Knowing the words "elasticity" or "fence" is not enough; the question wants you to recognize *when* you are looking at one and *why* it matters here.

## What the questions reward

- **Naming the right idea** — match the situation to the concept that fits it: why one fixed price leaves money on the table, why every buyer has a different hidden ceiling, whether demand is bendy or stiff, how a fence sorts buyers, why a moving price beats a frozen one, why overbooking is a gamble not a scam, how an anchor makes a price feel like a deal, and why there's no single right price.
- **Using evidence from the scene** — point to the detail in the situation that supports your answer, rather than answering from a general impression.
- **Avoiding the flattering reading** — the course looks at what's really happening; it does not assume the most comforting story. The best answers stay grounded in how buyers and prices actually behave, not in how fair or unfair a price first feels.

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

This short primer prepares you for the **General Reasoning** diagnostic — an *ungraded* check that tests five genuine reasoning skills. These are the same skills you use to decide what a set of facts really shows, so they matter directly for thinking clearly about why a price works the way it does.

## The five skills

- **Analysis** — break an argument into parts: find its **point** (the conclusion), the **reasons** given for it, and any hidden assumption it leans on. Ask: "What is this trying to convince me of, and what does it take for granted?"
- **Inference** — work out what *follows* from what you're told, and how strongly. Tell apart what *must* be true, what is *likely*, and what is only *possible*.
- **Evaluation** — judge how much the reasons actually support the point. Notice when evidence is beside the point, a source isn't trustworthy, or a step doesn't really connect.
- **Deduction** — reasoning where true starting facts *guarantee* the conclusion. If the starting facts are true, the conclusion can't be false. Watch for sneaky forms that only *look* airtight.
- **Induction** — reasoning from a few examples to a *probable* general rule or prediction. Strong induction uses many fair examples; weak induction over-generalizes from too few.

## A recurring trap: things that move together

Most wrong answers are statements that *sound* reasonable but are **not actually backed up by what you were told**. The discipline this check rewards is the same one careful pricing demands: keep apart what the facts **show**, what you're **assuming**, and what only *sounds* right. Two things happening together does not prove one causes the other.

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
  // The course was migrated to the Revenue Management & Pricing Analytics for
  // Children syllabus. Detect the marker topic; if present and the content
  // version matches, the content is current and we skip. This makes the seed
  // self-healing across environments: a database that still holds older content
  // (e.g. a previous curriculum) is detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-revenue-management-is"));
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
        "Seed: stale course content detected — replacing with the Revenue Management & Pricing Analytics for Children curriculum",
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
