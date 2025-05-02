import type React from 'react'
import { getServerSession } from 'next-auth'
import { getOpportunityByIdAction } from '@/app/api/server-actions/getOpportunityById'
import { categorizeOpportunities } from './utils/categorizeOpportunities'
import ClientOpportunitiesLayout from './components/client-layout'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'

export default async function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const tenantId = session?.user?.tenantId

  if (!tenantId) {
    return (
      <div className="flex flex-col w-full min-h-screen">
        <h1 className="px-5 my-7 text-3xl font-semibold tracking-tight">
          Opportunities
        </h1>
        <div className="flex justify-center p-8">
          Please log in to view opportunities
        </div>
      </div>
    )
  }

  let opportunities = []
  try {
    opportunities = await getOpportunityByIdAction(tenantId)
  } catch (error) {
    console.error('Error fetching opportunities:', error)

    return (
      <div className="flex flex-col w-full min-h-screen">
        <h1 className="px-5 my-7 text-3xl font-semibold tracking-tight">
          Opportunities
        </h1>
        <div className="flex justify-center p-8">
          Error loading opportunities
        </div>
      </div>
    )
  }

  const categorizedOpportunities = categorizeOpportunities(opportunities)

  const opportunitiesQuantity = {
    new: categorizedOpportunities.new.length,
    estimate: categorizedOpportunities.estimate.length,
    secondCall: categorizedOpportunities.secondCall.length,
    totalLoss: categorizedOpportunities.totalLoss.length,
    archived: categorizedOpportunities.archived.length,
  }

  return (
    <ClientOpportunitiesLayout
      opportunitiesQuantity={opportunitiesQuantity}
      isLoading={false}
    >
      {children}
    </ClientOpportunitiesLayout>
  )
}
