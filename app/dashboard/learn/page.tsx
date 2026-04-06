import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, CloudSun, Sprout, Warehouse } from 'lucide-react'

import { ConditionSignalsPanel } from '@/components/dashboard/condition-signals-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getServerSessionOrRedirect } from '@/lib/auth/server'
import { getFarmerGuideData } from '@/lib/services/dashboard-service'

function describeExperience(yearsFarming: number | null) {
  if (yearsFarming === null || yearsFarming === undefined) {
    return 'Experience not set yet'
  }

  if (yearsFarming < 3) {
    return `${yearsFarming} year(s) farming, beginner-focused guidance enabled`
  }

  return `${yearsFarming} year(s) farming experience recorded`
}

export default async function LearnPage() {
  const { supabase, user } = await getServerSessionOrRedirect()
  const guideData = await getFarmerGuideData({
    supabase,
    userId: user.id,
  })

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-sm shadow-emerald-100 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
              Learning center
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Teach the farmer what to do and when to do it
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              This page uses built-in farming rules plus your records to explain whether conditions
              look favorable, what warning signs matter, and what actions make sense next.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <p className="font-semibold">{guideData.region ?? 'Region not set yet'}</p>
            <p className="mt-1 text-emerald-800">{describeExperience(guideData.yearsFarming)}</p>
          </div>
        </div>
      </section>

      <ConditionSignalsPanel
        description="Farmers should be able to tell if this is a good moment to push ahead, proceed carefully, or protect against loss. These signals are the first version of that guidance."
        signals={guideData.conditionSignals}
        title="Should I act now or wait?"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <BookOpen className="h-5 w-5 text-emerald-700" />
              Recommended learning modules
            </CardTitle>
            <CardDescription>
              These are populated from your current farm profile, crop types, livestock types, storage
              status, and weather signals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {guideData.modules.map((module) => (
              <article
                key={module.id}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                      {module.category}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">{module.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {module.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                      Favorable signals
                    </p>
                    <div className="mt-3 space-y-2">
                      {module.favorableSignals.map((signal) => (
                        <p key={signal} className="text-sm leading-6 text-emerald-950">
                          {signal}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-amber-700">
                      Caution signals
                    </p>
                    <div className="mt-3 space-y-2">
                      {module.cautionSignals.map((signal) => (
                        <p key={signal} className="text-sm leading-6 text-amber-950">
                          {signal}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      What to do next
                    </p>
                    <div className="mt-3 space-y-2">
                      {module.nextSteps.map((step) => (
                        <p key={step} className="text-sm leading-6 text-slate-700">
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Records to keep
                    </p>
                    <div className="mt-3 space-y-2">
                      {module.recordsToKeep.map((record) => (
                        <p key={record} className="text-sm leading-6 text-slate-700">
                          {record}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CloudSun className="h-5 w-5 text-emerald-700" />
                How to use this
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
              <p>
                Check this page at the start of the week, after a strong weather change, and before
                major activities like spraying, harvesting, or vaccination.
              </p>
              <p>
                The signals become more believable when you keep crop moisture, health status, logbook
                entries, and storage checks current.
              </p>
              <p>
                This is rule-based guidance, which makes it safer and easier to verify than pure AI
                advice for critical farm decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
            <CardHeader>
              <CardTitle className="text-base">Next best actions</CardTitle>
              <CardDescription>
                These routes make the learning center more accurate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickLink href="/dashboard/crops" icon={<Sprout className="h-4 w-4" />}>
                Update crop moisture and health
              </QuickLink>
              <QuickLink href="/dashboard/logbook" icon={<BookOpen className="h-4 w-4" />}>
                Add a weekly farm log entry
              </QuickLink>
              <QuickLink href="/dashboard/storage" icon={<Warehouse className="h-4 w-4" />}>
                Review storage quality
              </QuickLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function QuickLink({
  children,
  href,
  icon,
}: {
  children: string
  href: string
  icon: ReactNode
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="w-full justify-between border-emerald-200 bg-white hover:bg-emerald-50"
    >
      <Link href={href}>
        <span className="flex items-center gap-2">
          {icon}
          {children}
        </span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  )
}
