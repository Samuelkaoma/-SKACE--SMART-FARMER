'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FlaskConical } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

export function LoadDemoFarmButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    const confirmed = window.confirm(
      'Load a full demo farm and replace your current crop, livestock, storage, logbook, recommendation, and notification records for this user?',
    )

    if (!confirmed) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/demo-farm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replaceExisting: true,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; summary?: { landHectares: number } }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Failed to load demo farm.')
      }

      toast.success(
        `Demo farm loaded with ${payload?.summary?.landHectares ?? 0} hectares of sample data.`,
      )
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load demo farm.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className="w-full justify-between border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
      disabled={isLoading}
      onClick={handleClick}
      type="button"
      variant="outline"
    >
      <span className="flex items-center gap-2">
        <FlaskConical className="h-4 w-4" />
        {isLoading ? 'Loading demo farm...' : 'Load demo farm'}
      </span>
      <span className="text-xs uppercase tracking-[0.16em] text-emerald-700">Simulate</span>
    </Button>
  )
}
