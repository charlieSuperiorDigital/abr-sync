'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Tasks({ params }: { params?: { locale: string } }) {
  const router = useRouter()
  const locale = params?.locale || 'en'

  useEffect(() => {
    // Client-side redirect to my-tasks
    router.replace(`/${locale}/shop-manager/dashboard/tasks/my-tasks`)
  }, [router, locale])

  // Return empty div while redirecting
  return <div className="w-full min-h-screen"></div>
}
