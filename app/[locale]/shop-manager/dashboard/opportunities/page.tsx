import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { OpportunityResponse } from '@/app/api/functions/opportunities'
import { getOpportunityByIdAction } from '@/app/api/server-actions/getOpportunityById'
import { isValidDate } from '@/app/utils/is-valid-date'
import { getServerSession } from 'next-auth'
import { categorizeOpportunities } from './utils/categorizeOpportunities'
import OpportunitiesContent from './components/opportunities-content'

export default async function OpportunitiesPage() {
  const session = await getServerSession(authOptions)
  const tenantId = session?.user?.tenantId
  if (!tenantId) {
    return <div className="flex justify-center p-8">Information Denied</div>
  }
  const opportunities: OpportunityResponse[] =
    await getOpportunityByIdAction(tenantId)

  const categorizedOpportunities = categorizeOpportunities(opportunities)

  return (
    <OpportunitiesContent categorizedOpportunities={categorizedOpportunities} />
  )
}
