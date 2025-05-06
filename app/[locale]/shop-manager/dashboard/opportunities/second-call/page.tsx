'use client'

import { useSession } from 'next-auth/react'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import SecondCallOpportunities from './second-call'

export default function SecondCallPage() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  
  const { secondCallOpportunities } = useGetOpportunities({ 
    tenantId: tenantId!
  })

  return <SecondCallOpportunities secondCalls={secondCallOpportunities || []} />
}
