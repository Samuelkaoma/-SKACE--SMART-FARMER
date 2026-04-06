import { Card, CardContent } from '@/components/ui/card'

export function DashboardLoadingState() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-emerald-200 bg-white/90 p-8">
        <div className="h-4 w-32 animate-pulse rounded-full bg-emerald-100" />
        <div className="mt-4 h-10 w-64 animate-pulse rounded-xl bg-slate-100" />
        <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card className="border-emerald-200/80">
            <CardContent className="space-y-3 pt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </CardContent>
          </Card>
          <Card className="border-emerald-200/80">
            <CardContent className="pt-6">
              <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-emerald-200/80">
            <CardContent className="pt-6">
              <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
            </CardContent>
          </Card>
          <Card className="border-emerald-200/80">
            <CardContent className="space-y-3 pt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
