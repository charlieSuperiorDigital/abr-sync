'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        <h2 className="text-lg font-semibold">Something went wrong!</h2>
        <p className="text-sm">{error.message}</p>
      </div>
      <Button
        onClick={reset}
        variant="outline"
      >
        Try again
      </Button>
    </div>
  )
}
