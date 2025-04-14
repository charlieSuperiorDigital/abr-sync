'use client'
import React, { createContext, useContext, useEffect, useMemo } from 'react'
import { useGetOpportunities } from '../api/hooks/useGetOpportunities'
import { useSession } from 'next-auth/react'
import { OpportunityResponse } from '../api/functions/opportunities'

interface OpportunitiesContextType {
  opportunities: OpportunityResponse[]
  newOpportunities: OpportunityResponse[]
  estimateOpportunities: OpportunityResponse[]
  secondCallOpportunities: OpportunityResponse[]
  totalLossOpportunities: OpportunityResponse[]
  archivedOpportunities: OpportunityResponse[]
  opportunitiesQuantity: {
    new: number
    estimate: number
    secondCall: number
    totalLoss: number
    archived: number
  }
  isLoading: boolean
  error: Error | null
}

const OpportunitiesContext = createContext<OpportunitiesContextType>({
  opportunities: [],
  newOpportunities: [],
  estimateOpportunities: [],
  secondCallOpportunities: [],
  totalLossOpportunities: [],
  archivedOpportunities: [],
  opportunitiesQuantity: {
    new: 0,
    estimate: 0,
    secondCall: 0,
    totalLoss: 0,
    archived: 0
  },
  isLoading: false,
  error: null
})

export const useOpportunities = () => useContext(OpportunitiesContext)

interface OpportunitiesProviderProps {
  children: React.ReactNode
}

export const OpportunitiesProvider = ({ children }: OpportunitiesProviderProps) => {
  const { data: session } = useSession()

  // Wait for session to be loaded before fetching opportunities
  const { 
    opportunities, 
    newOpportunities,
    estimateOpportunities,
    secondCallOpportunities,
    totalLossOpportunities,
    archivedOpportunities,
    isLoading: isOpportunitiesLoading, 
    error 
  } = useGetOpportunities({
    tenantId: session?.user.tenantId!
  })

  // Memoize the opportunities quantity object
  const opportunitiesQuantity = useMemo(() => ({
    new: newOpportunities.length,
    estimate: estimateOpportunities.length,
    secondCall: secondCallOpportunities.length,
    totalLoss: totalLossOpportunities.length,
    archived: archivedOpportunities.length
  }), [newOpportunities, estimateOpportunities, secondCallOpportunities, totalLossOpportunities, archivedOpportunities])

  // Combine loading states
  const isLoading = !session || isOpportunitiesLoading

  // Log opportunities data when it changes
  useEffect(() => {
    if (session?.user.tenantId) {
      console.log(`Tenant ID from session for opportunities: ${session.user.tenantId}`)
    }
    
    if (opportunities && opportunities.length > 0) {
      console.log(`Loaded ${opportunities.length} opportunities for tenant ${session?.user.tenantId}`)
    } else if (!isLoading && session?.user.tenantId) {
      console.log(`No opportunities found for tenant ${session?.user.tenantId}`)
    }
  }, [opportunities, session, isLoading])

  return (
    <OpportunitiesContext.Provider value={{ 
      opportunities: opportunities || [], 
      newOpportunities,
      estimateOpportunities,
      secondCallOpportunities,
      totalLossOpportunities,
      archivedOpportunities,
      opportunitiesQuantity,
      isLoading, 
      error 
    }}>
      {children}
    </OpportunitiesContext.Provider>
  )
}

export default OpportunitiesProvider
