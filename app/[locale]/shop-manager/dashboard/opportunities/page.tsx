'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OpportunitiesPage({ params }: { params?: { locale: string } }) {
  const router = useRouter()
  const locale = params?.locale || 'en'

  useEffect(() => {
    // Client-side redirect to new-opportunities
    router.replace(`/${locale}/shop-manager/dashboard/opportunities/new-opportunities`)
  }, [router, locale])

  // Return empty div while redirecting
  return <div></div>
}
