'use client'

import { OpportunityResponse } from '@/app/api/functions/opportunities'
import { useSearchParams } from 'next/navigation'
import NewOpportunities from '../new-opportunities/new-opportunities'
import EstimateOpportunities from '../estimate/estimates'
import SecondCallOpportunities from '../second-call/page'
import TotalLossOpportunities from '../total-loss/page'
import ArchivedOpportunities from '../archive/page'

type CategorizedOpportunities = {
  new: OpportunityResponse[]
  estimate: OpportunityResponse[]
  secondCall: OpportunityResponse[]
  totalLoss: OpportunityResponse[]
  archived: OpportunityResponse[]
}

export default function OpportunitiesContent({
  categorizedOpportunities,
}: {
  categorizedOpportunities: CategorizedOpportunities
}) {
  const searchParams = useSearchParams()
  const activeTab = searchParams?.get('tab') || 'new-opportunities'

  return (
    <div className="w-full">
      {activeTab === 'new-opportunities' && (
        <NewOpportunities newOpportunities={categorizedOpportunities.new} />
      )}
      {activeTab === 'estimate' && (
        <EstimateOpportunities estimates={categorizedOpportunities.estimate} />
      )}
      {activeTab === 'second-call' && (
        <SecondCallOpportunities
          secondCalls={categorizedOpportunities.secondCall}
        />
      )}
      {activeTab === 'total-loss' && (
        <TotalLossOpportunities
          totalLoss={categorizedOpportunities.totalLoss}
        />
      )}
      {activeTab === 'archive' && (
        <ArchivedOpportunities archived={categorizedOpportunities.archived} />
      )}
    </div>
  )
}
