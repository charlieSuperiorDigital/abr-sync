'use client'

import OpportunitiesContent from './components/opportunities-content'
import { useSession } from 'next-auth/react'

export default function OpportunitiesPage() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId

  if (!tenantId) {
    return <div>Please Login</div>
  }

  return <OpportunitiesContent tenantId={tenantId} />
}
