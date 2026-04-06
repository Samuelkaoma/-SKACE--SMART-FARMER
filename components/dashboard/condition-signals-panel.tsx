import { CloudSun, ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ConditionSignal } from '@/lib/types/farm'

const signalStyles = {
  favorable: {
    badge: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-200',
    icon: ShieldCheck,
    iconClass: 'text-emerald-700',
    label: 'Favorable',
  },
  watch: {
    badge: 'bg-amber-100 text-amber-900',
    border: 'border-amber-200',
    icon: CloudSun,
    iconClass: 'text-amber-700',
    label: 'Watch',
  },
  risky: {
    badge: 'bg-rose-100 text-rose-900',
    border: 'border-rose-200',
    icon: TriangleAlert,
    iconClass: 'text-rose-700',
    label: 'Risky',
  },
} as const

export function ConditionSignalsPanel({
  description,
  signals,
  title,
}: {
  description: string
  signals: ConditionSignal[]
  title: string
}) {
  return (
    <Card className="border-emerald-200/80 shadow-sm shadow-emerald-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <ShieldAlert className="h-5 w-5 text-emerald-700" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-3">
        {signals.map((signal) => {
          const styles = signalStyles[signal.status]
          const Icon = styles.icon

          return (
            <article
              key={signal.id}
              className={`rounded-[1.5rem] border bg-white p-4 ${styles.border}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{signal.summary}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
                  <Icon className={`h-5 w-5 ${styles.iconClass}`} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}>
                  {styles.label}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {signal.reasons.map((reason) => (
                  <p key={reason} className="text-sm leading-6 text-slate-600">
                    {reason}
                  </p>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Next step</p>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-800">
                  {signal.nextStep}
                </p>
              </div>
            </article>
          )
        })}
      </CardContent>
    </Card>
  )
}
