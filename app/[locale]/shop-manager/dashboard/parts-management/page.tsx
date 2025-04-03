'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PartsManagementPage({ params }: { params?: { locale: string } }) {
  const router = useRouter()
  const locale = params?.locale || 'en'

  useEffect(() => {
    // Client-side redirect to to-order
    router.replace(`/${locale}/shop-manager/dashboard/parts-management/to-order`)
  }, [router, locale])

  // Return empty div while redirecting
  return <div></div>
}