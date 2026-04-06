'use client'

import { RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="rounded-[2rem] border border-rose-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
        Dashboard error
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-900">
        We couldn&apos;t load the farm dashboard.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        {error.message || 'An unexpected error occurred while preparing your dashboard.'}
      </p>
      <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700" onClick={reset}>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}
