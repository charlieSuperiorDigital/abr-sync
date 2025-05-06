'use client'

import { useSession } from 'next-auth/react'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import TotalLossOpportunities from './total-loss'

export default function TotalLossPage() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  
  const { totalLossOpportunities } = useGetOpportunities({ 
    tenantId: tenantId!
  })

  return <TotalLossOpportunities totalLossOpportunities={totalLossOpportunities || []} />
}
