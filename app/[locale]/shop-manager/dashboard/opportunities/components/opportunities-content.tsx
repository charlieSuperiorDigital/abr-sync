'use client'

import { OpportunityResponse } from '@/app/api/functions/opportunities'
import { useSearchParams } from 'next/navigation'
import NewOpportunities from '../new-opportunities/new-opportunities'
import EstimateOpportunities from '../estimate/estimates'
import SecondCallOpportunities from '../second-call/second-call'
import TotalLossOpportunities from '../total-loss/total-loss'
import ArchivedOpportunities from '../archive/archive'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'

type Props = {
  tenantId: string
}

export default function OpportunitiesContent({ tenantId }: Props) {
  const searchParams = useSearchParams()
  const activeTab = searchParams?.get('tab') || 'new-opportunities'
  const {
    newOpportunities,
    estimateOpportunities,
    secondCallOpportunities,
    totalLossOpportunities,
    archivedOpportunities,
  } = useGetOpportunities({ tenantId })

  return (
    <div className="w-full">
      {activeTab === 'new-opportunities' && (
        <NewOpportunities newOpportunities={newOpportunities} />
      )}
      {activeTab === 'estimate' && (
        <EstimateOpportunities estimates={estimateOpportunities} />
      )}
      {activeTab === 'second-call' && (
        <SecondCallOpportunities secondCalls={secondCallOpportunities} />
      )}
      {activeTab === 'total-loss' && (
        <TotalLossOpportunities totalLoss={totalLossOpportunities} />
      )}
      {activeTab === 'archive' && (
        <ArchivedOpportunities archived={archivedOpportunities} />
      )}
    </div>
  )
}
