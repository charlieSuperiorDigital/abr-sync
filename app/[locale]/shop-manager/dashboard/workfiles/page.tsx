'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Workfiles({ params }: { params?: { locale: string } }) {
  const router = useRouter()
  const locale = params?.locale || 'en'

  useEffect(() => {
    // Client-side redirect to in-progress
    router.replace(`/${locale}/shop-manager/dashboard/workfiles/in-progress`)
  }, [router, locale])

  // Return empty div while redirecting
  return <div></div>
}
