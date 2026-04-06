'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BookText,
  LineChart as LineChartIcon,
  NotebookPen,
  ShieldAlert,
  Sprout,
  TrendingUp,
  Warehouse,
} from 'lucide-react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DASHBOARD_CHART_COLORS } from '@/lib/constants/dashboard'
import type { DashboardOverviewData, RecommendationPriority } from '@/lib/types/farm'

interface DashboardOverviewProps {
  data: DashboardOverviewData
}

const recommendationStyles: Record<
  RecommendationPriority,
  { container: string; badge: string; label: string }
> = {
  critical: {
    container: 'border-rose-300 bg-rose-50/80',
    badge: 'bg-rose-700 text-white',
    label: 'Critical',
  },
  high: {
    container: 'border-orange-200 bg-orange-50/80',
    badge: 'bg-orange-600 text-white',
    label: 'High',
  },
  medium: {
    container: 'border-amber-200 bg-amber-50/80',
    badge: 'bg-amber-500 text-white',
    label: 'Medium',
  },
  low: {
    container: 'border-sky-200 bg-sky-50/80',
    badge: 'bg-sky-600 text-white',
    label: 'Low',
  },
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-emerald-200/70 bg-white/90 p-6 shadow-sm shadow-emerald-100 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
              Farm command center
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Run the farm with better visibility
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                SmartFarmer SKACE now combines operational tracking, field-risk guidance, market signals, and a novice-friendly playbook in one server-driven dashboard.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Active crops" value={`${data.stats.activeCrops}`} tone="emerald" />
            <StatCard label="Tracked area" value={`${data.stats.trackedArea} ha`} tone="teal" />
            <StatCard label="Livestock" value={`${data.stats.livestock}`} tone="amber" />
            <StatCard label="Revenue" value={`ZMW ${data.stats.totalRevenue}`} tone="sky" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <AlertTriangle className="h-5 w-5 text-emerald-700" />
                Priority recommendations
              </CardTitle>
              <CardDescription>
                Action-oriented alerts based on real crop, livestock, storage, and weather fields.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recommendations.length === 0 ? (
                <EmptyCardText>
                  No urgent recommendations right now. Keep logging farm activities so the system can continue learning from your patterns.
                </EmptyCardText>
              ) : (
                data.recommendations.map((recommendation) => {
                  const styles = recommendationStyles[recommendation.priority]

                  return (
                    <article
                      key={recommendation.id}
                      className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm ${styles.container}`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}>
                            {styles.label}
                          </span>
                          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                            {recommendation.sourceLabel}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {recommendation.title}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {recommendation.description}
                          </p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {recommendation.actionItems.map((item) => (
                            <div
                              key={item}
                              className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-slate-700"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  )
                })
              )}
            </CardContent>
          </Card>

          <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-emerald-700" />
                Performance signal
              </CardTitle>
              <CardDescription>
                Trend lines combine crop health, livestock health, and logging rhythm into a simple seasonal snapshot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={290}>
                <LineChart data={data.performanceData}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      borderColor: '#d1fae5',
                      backgroundColor: '#ffffff',
                    }}
                  />
                  <Line
                    dataKey="yield"
                    name="Yield readiness"
                    stroke="#0f9f6e"
                    strokeWidth={3}
                    dot={{ fill: '#0f9f6e', r: 4 }}
                    activeDot={{ r: 6 }}
                    type="monotone"
                  />
                  <Line
                    dataKey="health"
                    name="Health confidence"
                    stroke="#0e7490"
                    strokeWidth={3}
                    dot={{ fill: '#0e7490', r: 4 }}
                    activeDot={{ r: 6 }}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldAlert className="h-5 w-5 text-emerald-700" />
                  Field guide
                </CardTitle>
                <CardDescription>
                  Crop-specific disease and pest reference pulled from the knowledge library.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.knowledgeCards.length === 0 ? (
                  <EmptyCardText>
                    Add crop records to unlock disease and pest guidance tailored to what you are growing.
                  </EmptyCardText>
                ) : (
                  data.knowledgeCards.map((card) => (
                    <div key={card.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{card.name}</h3>
                          <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                            {card.affects_crop_type} | {card.type}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                          {card.severity ?? 'Moderate'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {card.description ?? 'Field risk reference for this crop type.'}
                      </p>
                      <div className="mt-3 grid gap-2">
                        <MiniList label="Symptoms" value={card.symptoms?.slice(0, 3).join(', ') ?? 'Not listed'} />
                        <MiniList
                          label="Prevention"
                          value={card.prevention_methods?.slice(0, 3).join(', ') ?? 'Not listed'}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 text-emerald-700" />
                  Starter playbook
                </CardTitle>
                <CardDescription>
                  Clear next steps for newer farmers and for farms with missing operational data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.playbook.map((step) => (
                  <div key={step.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h3 className="font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                    <Button
                      asChild
                      variant="ghost"
                      className="mt-2 px-0 text-emerald-700 hover:bg-transparent hover:text-emerald-900"
                    >
                      <Link href={step.href}>
                        {step.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
            <CardHeader>
              <CardTitle className="text-base">Crop distribution</CardTitle>
              <CardDescription>Which crop types are currently represented in your records.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.cropsDistribution}
                    innerRadius={56}
                    outerRadius={88}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {data.cropsDistribution.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={DASHBOARD_CHART_COLORS[index % DASHBOARD_CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      borderColor: '#d1fae5',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {data.cropsDistribution.map((crop, index) => (
                  <div key={crop.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            DASHBOARD_CHART_COLORS[index % DASHBOARD_CHART_COLORS.length],
                        }}
                      />
                      {crop.name}
                    </div>
                    <span className="font-semibold text-slate-900">{crop.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
            <CardHeader>
              <CardTitle className="text-base">Market pulse</CardTitle>
              <CardDescription>Current commodity price signals from recent records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.marketHighlights.map((market) => (
                <div key={market.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{market.name}</h3>
                      <p className="text-sm text-slate-500">
                        {market.date} | {market.unit ?? 'unit'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">ZMW {market.currentPrice}</p>
                      <p
                        className={`text-sm ${
                          market.trend === 'up'
                            ? 'text-emerald-700'
                            : market.trend === 'down'
                              ? 'text-rose-700'
                              : 'text-slate-500'
                        }`}
                      >
                        {market.percentChange > 0 ? '+' : ''}
                        {market.percentChange}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
              <CardDescription>Fast routes for the most important daily tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction href="/dashboard/crops" icon={<Sprout className="h-4 w-4" />}>
                Manage crop records
              </QuickAction>
              <QuickAction href="/dashboard/logbook" icon={<NotebookPen className="h-4 w-4" />}>
                Update logbook
              </QuickAction>
              <QuickAction href="/dashboard/storage" icon={<Warehouse className="h-4 w-4" />}>
                Review storage
              </QuickAction>
              <QuickAction href="/dashboard/analytics" icon={<TrendingUp className="h-4 w-4" />}>
                Open analytics
              </QuickAction>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookText className="h-5 w-5 text-emerald-700" />
                Recent logbook entries
              </CardTitle>
              <CardDescription>
                Recent operational notes help expose patterns and support smarter recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recentLogs.length === 0 ? (
                <EmptyCardText>
                  No farm logs yet. Add weather, activity, harvest, or observation notes to build stronger insights.
                </EmptyCardText>
              ) : (
                data.recentLogs.map((log) => (
                  <div key={log.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{log.log_type}</p>
                        <p className="text-sm text-slate-500">{log.log_date}</p>
                      </div>
                      {log.harvest_quantity_kg ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                          {log.harvest_quantity_kg} kg
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {log.activity_description}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'emerald' | 'teal' | 'amber' | 'sky'
}) {
  const styles = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    teal: 'border-teal-200 bg-teal-50 text-teal-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    sky: 'border-sky-200 bg-sky-50 text-sky-900',
  }[tone]

  return (
    <div className={`rounded-2xl border px-4 py-3 ${styles}`}>
      <p className="text-xs uppercase tracking-[0.16em] opacity-75">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function QuickAction({
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

function MiniList({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <p className="text-sm leading-6 text-slate-600">
      <span className="font-semibold text-slate-900">{label}:</span> {value}
    </p>
  )
}

function EmptyCardText({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-sm text-emerald-900">
      {children}
    </div>
  )
}
