import { Head } from 'vite-react-ssg'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel'

export default function DocsPage() {
  return (
    <>
      <Head>
        <title>Documentation: Fundamental Framework - Aussie Penny Stocks</title>
        <meta name="description" content="How I look at ASX small caps before they enter the weekly list. A simple, fundamentals-first framework." />
      </Head>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="grid text-center gap-6 mx-auto max-w-5xl">
          <h1 className="gradient-text mb-4 text-4xl md:text-5xl font-bold">Documentation: Fundamental Framework</h1>
          <h3 className="text-xl font-semibold">How I look at ASX small caps before they enter the weekly list.</h3>
          <p className="text-lg text-muted-foreground">
            This page explains the simple, fundamentals-first framework I use when reviewing ASX small cap companies. The focus is on the business: financial statements, competitive strength, industry dynamics and the path to sustainable profit — not on short-term price moves.
          </p>
        </div>
      </section>

      {/* Why Start With Fundamentals? */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Start With Fundamentals?</h2>
          <div className="space-y-3 text-sm md:text-base text-muted-foreground">
            <p>Small cap share prices can move sharply on hype, rumours and short-term news. That noise is hard to predict and even harder to rely on.</p>
            <p>Instead of chasing every spike, I start with the basics: how the company makes money, what shape its financial statements are in, how strong its position is against competitors and whether there is a credible way to turn growth into lasting profit and cash flow.</p>
            <p>If the underlying business does not make sense, the share price story usually does not last. That is why every company that appears on the weekly watchlist has first passed a simple fundamentals check like the one described on this page.</p>
          </div>
        </div>
      </section>

      {/* Four Fundamental Lenses */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Four Fundamental Lenses</h2>
            <p className="text-sm md:text-base text-muted-foreground">When I review an ASX small cap, I cycle through these four lenses before it can even qualify for the weekly list.</p>
          </div>

          <div className="relative px-12">
            <Carousel className="w-full">
              <CarouselContent>
                {/* Card 1 */}
                <CarouselItem>
                  <div className="bg-card text-card-foreground flex flex-col gap-8 rounded-lg py-8 shadow-sm border h-full">
                    <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-8 pb-3 border-b">
                      <div className="leading-none pb-1 text-xl font-semibold">1. Financial Statements</div>
                      <div className="text-muted-foreground text-sm">Income, cash flow and the balance sheet.</div>
                    </div>
                    <div className="px-8">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Look at revenue over several periods: is it growing, flat or shrinking?</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Check gross margins and operating costs to see whether scale could improve profitability.</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Compare reported profit to operating cash flow – is the business generating real cash?</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Review cash balance, debt and burn rate to understand how much time the company has.</span></li>
                      </ul>
                    </div>
                  </div>
                </CarouselItem>

                {/* Card 2 */}
                <CarouselItem>
                  <div className="bg-card text-card-foreground flex flex-col gap-8 rounded-lg py-8 shadow-sm border h-full">
                    <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-8 pb-3 border-b">
                      <div className="leading-none pb-1 text-xl font-semibold">2. Competitive Strength</div>
                      <div className="text-muted-foreground text-sm">Why this business, not its competitors?</div>
                    </div>
                    <div className="px-8">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Clarify who the real customers are and how concentrated they might be.</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Ask what problem the company solves and whether the value proposition is concrete or vague.</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Look for switching costs, integration effort or regulation that makes customers sticky.</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Consider whether the company can defend its pricing or if it is stuck in a race to the bottom.</span></li>
                      </ul>
                    </div>
                  </div>
                </CarouselItem>

                {/* Card 3 */}
                <CarouselItem>
                  <div className="bg-card text-card-foreground flex flex-col gap-8 rounded-lg py-8 shadow-sm border h-full">
                    <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-8 pb-3 border-b">
                      <div className="leading-none pb-1 text-xl font-semibold">3. Industry and Market</div>
                      <div className="text-muted-foreground text-sm">The environment around the company.</div>
                    </div>
                    <div className="px-8">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Check whether the market is expanding, stable or shrinking over the next 5–10 years.</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Think about cyclicality: how sensitive is the business to rates, sentiment or commodity prices?</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Watch for regulatory changes or new technologies that could reshape the playing field.</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Ask if the company is likely to gain, keep or lose share as the industry evolves.</span></li>
                      </ul>
                    </div>
                  </div>
                </CarouselItem>

                {/* Card 4 */}
                <CarouselItem>
                  <div className="bg-card text-card-foreground flex flex-col gap-8 rounded-lg py-8 shadow-sm border h-full">
                    <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-8 pb-3 border-b">
                      <div className="leading-none pb-1 text-xl font-semibold">4. Profit & Cash Flow Path</div>
                      <div className="text-muted-foreground text-sm">From growth story to real returns.</div>
                    </div>
                    <div className="px-8">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>For early-stage names, accept that profits may be small or negative today.</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Look at unit economics where available: customer acquisition cost, margins and retention.</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Ask how much extra capital is required before the business could fund itself.</span></li>
                        <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"></span><span>Sketch a simple picture of what sustainable free cash flow could look like at maturity.</span></li>
                      </ul>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Putting It Together */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Putting It Together: A Simple Flow</h2>
          <ol className="space-y-3 text-sm md:text-base">
            <li className="flex gap-3"><span className="font-semibold text-primary shrink-0">1.</span><span>Read the latest annual and half-year reports, investor presentations and key announcements.</span></li>
            <li className="flex gap-3"><span className="font-semibold text-primary shrink-0">2.</span><span>Write down in plain language how the business makes money and who pays the bills.</span></li>
            <li className="flex gap-3"><span className="font-semibold text-primary shrink-0">3.</span><span>Review the financial statements with an eye on cash, debt, dilution and basic unit economics.</span></li>
            <li className="flex gap-3"><span className="font-semibold text-primary shrink-0">4.</span><span>Think about competition and industry structure: is there any real edge or tailwind.</span></li>
            <li className="flex gap-3"><span className="font-semibold text-primary shrink-0">5.</span><span>Only then decide whether the company is interesting enough to appear on the weekly watchlist.</span></li>
          </ol>
        </div>
      </section>
    </>
  )
}

