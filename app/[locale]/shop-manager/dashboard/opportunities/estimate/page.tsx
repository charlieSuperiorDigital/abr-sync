'use client'

import { useSession } from 'next-auth/react'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import EstimateOpportunities from './estimates'

export default function EstimatePage() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  
  const { estimateOpportunities } = useGetOpportunities({ 
    tenantId: tenantId!
  })

  return <EstimateOpportunities estimates={estimateOpportunities || []} />
}
