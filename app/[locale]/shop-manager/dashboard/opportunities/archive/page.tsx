'use client'

import { useSession } from 'next-auth/react'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import ArchivedOpportunities from './archive'

export default function ArchivePage() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  
  const { archivedOpportunities } = useGetOpportunities({ 
    tenantId: tenantId!
  })

  return <ArchivedOpportunities archived={archivedOpportunities || []} />
}
