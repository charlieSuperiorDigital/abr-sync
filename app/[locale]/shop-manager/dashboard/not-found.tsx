import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardNotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Page not found</h2>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  )
}
