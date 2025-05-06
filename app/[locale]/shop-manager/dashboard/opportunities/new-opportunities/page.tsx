'use client'

import { useSession } from 'next-auth/react'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import NewOpportunities from './new-opportunities'

export default function NewOpportunitiesPage() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  
  const { newOpportunities } = useGetOpportunities({ 
    tenantId: tenantId!
  })

  return <NewOpportunities newOpportunities={newOpportunities || []} />
}
