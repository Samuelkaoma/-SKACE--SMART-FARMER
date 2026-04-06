import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CloudSun,
  LineChart,
  ShieldCheck,
  Sprout,
  Tractor,
  Warehouse,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  aboutModules,
  aboutPillars,
  aboutPrinciples,
  aboutRoadmap,
} from '@/lib/content/about'

export const metadata: Metadata = {
  title: 'About',
  description:
    'See the product vision, current capabilities, and production roadmap behind SmartFarmer SKACE.',
}

const moduleIcons = [LineChart, Sprout, BookOpen, ShieldCheck]
const principleIcons = [CloudSun, Tractor, Warehouse]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.14),transparent_35%),linear-gradient(180deg,#f7fff8_0%,#fffdf7_45%,#f3fbf6_100%)]">
      <main className="px-6 pb-20 pt-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-16">
          <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white/85 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
                Product story
              </span>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  SmartFarmer SKACE is building the operating system a modern farmer can actually use.
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  The platform is designed to help farmers move from scattered notes and reactive decisions toward one structured workflow for crops, livestock, storage, weather-aware logging, and guided action.
                </p>
                <p className="max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
                  Created by Samuel Kaoma, SmartFarmer SKACE is strongest today as a production-minded MVP and is now positioned to grow into a deeper farm intelligence product.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-emerald-700 px-6 text-white hover:bg-emerald-800"
                  size="lg"
                >
                  <Link href="/auth/sign-up">
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
                  <Link href="/auth/login">Open the product</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-xl shadow-emerald-100 sm:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
                The pitch in one line
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                A farm command center that helps farmers record better data, spot risk earlier, and act with more confidence.
              </h2>
              <div className="mt-6 grid gap-3">
                {aboutPillars.map((pillar) => (
                  <div key={pillar.title} className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <h3 className="font-semibold text-slate-900">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
                What exists today
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                The product already demonstrates a coherent farm workflow.
              </h2>
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                This is no longer just a dashboard concept. The current build already supports key farmer records, beginner-friendly guidance, and a much stronger operational backbone.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {aboutModules.map((module, index) => {
                const Icon = moduleIcons[index]

                return (
                  <Card
                    key={module.title}
                    className="border-white/80 bg-white/90 shadow-sm shadow-emerald-100"
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-950">{module.title}</CardTitle>
                        <CardDescription className="mt-2 text-sm leading-6 text-slate-600">
                          {module.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Card className="border-white/80 bg-white/90 shadow-sm shadow-emerald-100">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-950">Why it makes sense</CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Farmers need fewer disconnected tools and clearer direction on what to do next.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  Many smallholder operations still rely on memory, notebooks, or fragmented spreadsheets. That makes it hard to learn from past seasons, respond early to disease or weather stress, or time sales with confidence.
                </p>
                <p>
                  SmartFarmer SKACE addresses that with one place to capture what is happening on the farm and one dashboard to surface what deserves attention. That combination is valuable now, even before the product reaches full predictive intelligence.
                </p>
                <p>
                  The current experience is especially strong as a guided operations hub and a solid base for the more advanced farmer-coaching features the vision calls for.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/80 bg-white/90 shadow-sm shadow-emerald-100">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-950">How it becomes a full farmer coach</CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  The roadmap is clear because the current app now captures the right categories of operational data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {aboutRoadmap.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
                Production principles
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Better agritech products need more than beautiful screens.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {aboutPrinciples.map((principle, index) => {
                const Icon = principleIcons[index]

                return (
                  <Card
                    key={principle.title}
                    className="border-white/80 bg-white/90 shadow-sm shadow-emerald-100"
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-950">{principle.title}</CardTitle>
                        <CardDescription className="mt-2 text-sm leading-6 text-slate-600">
                          {principle.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </section>

          <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,#052e2b_0%,#0f766e_55%,#16a34a_100%)] px-8 py-10 text-white shadow-xl shadow-emerald-200 sm:px-10 sm:py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-100">
                  Where it stands today
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Pitchable now, not yet the finished vision.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base">
                  The current product is credible as a farm operations MVP with guided insights and production-minded architecture. The next stage is turning that foundation into deeper, more localized farmer intelligence.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-white px-6 text-emerald-900 hover:bg-emerald-50"
                  size="lg"
                >
                  <Link href="/auth/sign-up">Start with sign up</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-full border border-white/30 bg-white/10 px-6 text-white hover:bg-white/20"
                  size="lg"
                  variant="outline"
                >
                  <Link href="/">Back to homepage</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
