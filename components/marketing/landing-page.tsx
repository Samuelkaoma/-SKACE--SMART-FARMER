import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  LineChart,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ctaLinks,
  landingFeatures,
  landingMetrics,
  operatingPrinciples,
  trustPoints,
} from '@/lib/content/landing'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.15),transparent_34%),linear-gradient(180deg,#f8fff8_0%,#fffdf5_52%,#f4fbf7_100%)] text-slate-950">
      <SiteHeader />

      <main>
        <section className="px-6 pb-16 pt-32 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] lg:items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                Farm operating system for Zambia
              </span>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl">
                  Help every farmer see the next best move.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  SmartFarmer SKACE brings crop records, livestock care, storage oversight, weather context, and market timing into one guided platform built for both novice and growing farm operations.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-emerald-700 px-6 text-white hover:bg-emerald-800"
                  size="lg"
                >
                  <Link href={ctaLinks.primary}>
                    Create an account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-full border border-slate-200 bg-white px-6 text-slate-900 hover:bg-slate-50"
                  size="lg"
                  variant="outline"
                >
                  <Link href={ctaLinks.story}>View product story</Link>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {landingMetrics.map((metric) => (
                  <Card
                    key={metric.label}
                    className="border-white/70 bg-white/80 shadow-sm shadow-emerald-100"
                  >
                    <CardContent className="space-y-2 pt-6">
                      <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-semibold text-slate-950">{metric.value}</p>
                      <p className="text-sm leading-6 text-slate-600">{metric.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <aside className="relative">
              <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_right,_rgba(13,148,136,0.26),transparent_44%),linear-gradient(180deg,rgba(22,163,74,0.16),rgba(15,23,42,0.04))]" />
              <div className="relative rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-emerald-100 sm:p-8">
                <div className="space-y-5">
                  <div className="flex items-center justify-between rounded-3xl bg-slate-950 px-5 py-4 text-white">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">
                        Product promise
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        From scattered farm notes to one guided operating view
                      </p>
                    </div>
                    <LineChart className="h-10 w-10 text-emerald-300" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InsightCard
                      eyebrow="Inputs"
                      title="Richer records"
                      description="Farmers can now capture field size, health, disease, storage quality, vaccinations, and logbook detail with much better structure."
                    />
                    <InsightCard
                      eyebrow="Guidance"
                      title="Dashboard coaching"
                      description="Recommendations, field guide cards, market pulse, and starter playbooks point farmers toward practical next actions."
                    />
                    <InsightCard
                      eyebrow="History"
                      title="Logbook patterns"
                      description="Operational logs now connect weather, activities, costs, harvest, and observations so the product can grow into better pattern analysis."
                    />
                    <InsightCard
                      eyebrow="Scale"
                      title="Modular foundation"
                      description="Shared services, validation helpers, and protected routes make the platform more credible for demos today and safer to extend tomorrow."
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
                Core capabilities
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Everything needed to move from record keeping toward real decision support.
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {landingFeatures.map((feature) => {
                const Icon = feature.icon

                return (
                  <Card
                    key={feature.title}
                    className="border-emerald-100 bg-white/85 shadow-sm shadow-emerald-100 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
                        <p className="text-sm leading-6 text-slate-600">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 rounded-[2.5rem] border border-emerald-100 bg-white/85 p-8 shadow-sm shadow-emerald-100 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:p-10">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
                Product principles
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Built for farmers to feel simple and for teams to keep maintainable.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                The strongest agritech products combine trust, clarity, and structured data. This version pushes the app in that direction with better capture flows, clearer UX, and stronger architecture underneath.
              </p>
            </div>
            <div className="space-y-4">
              {operatingPrinciples.map((principle) => (
                <div
                  key={principle.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-950">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
                Why it is pitchable now
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                A credible agritech story needs both product value and delivery discipline.
              </h2>
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                SmartFarmer SKACE now reads as a real farm operations platform: clear workflows for farmers, a coherent dashboard story for demos, and a codebase that is much easier to evolve.
              </p>
            </div>
            <div className="grid gap-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white/85 px-4 py-4 shadow-sm shadow-emerald-100"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
                  <p className="text-sm leading-6 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 pt-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-[linear-gradient(135deg,#052e2b_0%,#0f766e_52%,#16a34a_100%)] px-8 py-10 text-white shadow-xl shadow-emerald-200 sm:px-10 sm:py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-100">
                  Built to demo, ready to grow
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  A stronger farm product today. A bigger intelligence layer tomorrow.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base">
                  Use the current platform to capture operational truth, guide daily decisions, and tell a compelling story about where the product goes next.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-white px-6 text-emerald-900 hover:bg-emerald-50"
                  size="lg"
                >
                  <Link href={ctaLinks.primary}>Start with sign up</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-full border border-white/30 bg-white/10 px-6 text-white hover:bg-white/20"
                  size="lg"
                  variant="outline"
                >
                  <Link href={ctaLinks.signin}>
                    Open sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-100/80 bg-white/80 px-6 py-8 backdrop-blur sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-950">SmartFarmer SKACE</p>
              <p className="text-sm text-slate-600">
                Farm operations software for Zambian growers and livestock keepers.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Designed to evolve from a guided operations hub into a deeper farmer intelligence platform.
          </p>
        </div>
      </footer>
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm shadow-emerald-200">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-slate-950">SmartFarmer SKACE</p>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
              Samuel Kaoma
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Button asChild className="rounded-full" variant="ghost">
            <Link href={ctaLinks.story}>About</Link>
          </Button>
          <Button asChild className="rounded-full" variant="ghost">
            <Link href={ctaLinks.signin}>Sign in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <Link href={ctaLinks.primary}>Get started</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

function InsightCard({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}
