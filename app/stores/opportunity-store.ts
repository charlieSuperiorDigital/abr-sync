import { create } from 'zustand'
import { Opportunity } from '../types/opportunity'
import { opportunities } from '../mocks/opportunities_new'
import { useWorkfileStore } from './workfile-store'

interface OpportunityStore {
  opportunities: Opportunity[]
  selectedOpportunity: Opportunity | null
  setSelectedOpportunity: (opportunity: Opportunity | null) => void
  updateOpportunity: (opportunityId: string, updates: Partial<Opportunity>) => void
  addOpportunity: (opportunity: Opportunity) => void
  removeOpportunity: (opportunityId: string) => void
  // Filter opportunities by workflow state
  getOpportunitiesByStatus: (status: "New" | "2nd Call" | "Estimate" | "Total Loss" | "Upcoming" | "Archived") => Opportunity[]
  // Get opportunity by ID
  getOpportunityById: (opportunityId: string) => Opportunity | undefined
  // Get opportunities that need follow-up (in 2nd Call status)
  getFollowUpOpportunities: () => Opportunity[]
  // Get opportunities with upcoming drop dates
  getUpcomingDrops: () => Opportunity[]
  // Get opportunities ready for workfile creation
  getReadyForWorkfile: () => Opportunity[]
  // Create workfile from opportunity
  createWorkfileFromOpportunity: (opportunityId: string) => void
  // Check if opportunity has passed upload deadline
  checkUploadDeadline: (opportunityId: string) => { passed: boolean; remainingTime: number | null }
  // Get opportunities with weather impact on paint work
  getWeatherImpactedOpportunities: () => Opportunity[]
}

export const useOpportunityStore = create<OpportunityStore>((set, get) => ({
  opportunities: opportunities,
  selectedOpportunity: null,

  setSelectedOpportunity: (opportunity) => set({ selectedOpportunity: opportunity }),

  updateOpportunity: (opportunityId, updates) =>
    set((state) => ({
      opportunities: state.opportunities.map((opp) =>
        opp.opportunityId === opportunityId ? { ...opp, ...updates } : opp
      ),
      selectedOpportunity:
        state.selectedOpportunity?.opportunityId === opportunityId
          ? { ...state.selectedOpportunity, ...updates }
          : state.selectedOpportunity,
    })),

  addOpportunity: (opportunity) =>
    set((state) => ({
      opportunities: [...state.opportunities, opportunity],
    })),

  removeOpportunity: (opportunityId) =>
    set((state) => ({
      opportunities: state.opportunities.filter(
        (opp) => opp.opportunityId !== opportunityId
      ),
      selectedOpportunity:
        state.selectedOpportunity?.opportunityId === opportunityId
          ? null
          : state.selectedOpportunity,
    })),

  getOpportunitiesByStatus: (status) => {
    return get().opportunities.filter((opp) => opp.status === status)
  },

  getOpportunityById: (opportunityId) => {
    return get().opportunities.find((opp) => opp.opportunityId === opportunityId)
  },

  getFollowUpOpportunities: () => {
    return get().opportunities.filter((opp) => opp.status === "2nd Call")
  },

  getUpcomingDrops: () => {
    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    return get().opportunities.filter((opp) => {
      if (!opp.dropDate || opp.status !== "New") return false
      const dropDate = new Date(opp.dropDate)
      return dropDate <= in24Hours && dropDate >= now
    })
  },

  getReadyForWorkfile: () => {
    return get().opportunities.filter((opp) => {
      // Check if opportunity is in the right state
      if (opp.status !== "Estimate") return false
      
      // Check if insurance is approved
      if (!opp.insurance.approved) return false
      
      // Check if all required inspections are complete
      if (!opp.isVoilComplete || !opp.is4CornersComplete) return false
      
      return true
    })
  },

  createWorkfileFromOpportunity: (opportunityId) => {
    const opportunity = get().getOpportunityById(opportunityId)
    if (!opportunity) return

    // Only create workfile if opportunity is in the right state
    if (opportunity.status !== "Estimate" || !opportunity.insurance.approved) return

    const workfileStore = useWorkfileStore.getState()
    
    // Create new workfile
    const workfile = {
      workfileId: `WF${Date.now()}`,
      opportunityId: opportunity.opportunityId,
      status: "Upcoming" as const,
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
      vehicle: opportunity.vehicle,
      customer: opportunity.customer,
      insurance: opportunity.insurance,
      inDate: new Date().toISOString(),
      estimatedCompletionDate: opportunity.estimatedCompletionDate,
      estimateAmount: opportunity.estimateAmount,
      isVoilComplete: opportunity.isVoilComplete,
      is4CornersComplete: opportunity.is4CornersComplete,
      weatherImpact: opportunity.weatherImpact,
    }

    // Add workfile to store
    workfileStore.addWorkfile(workfile)

    // Update opportunity status
    get().updateOpportunity(opportunityId, { status: "Upcoming" })
  },

  checkUploadDeadline: (opportunityId) => {
    const opportunity = get().getOpportunityById(opportunityId)
    if (!opportunity?.dropDate) return { passed: false, remainingTime: null }

    const now = new Date()
    const dropDate = new Date(opportunity.dropDate)
    const deadline = new Date(dropDate.getTime() + 24 * 60 * 60 * 1000)
    const remainingTime = deadline.getTime() - now.getTime()

    return {
      passed: remainingTime <= 0,
      remainingTime: Math.max(0, remainingTime),
    }
  },

  getWeatherImpactedOpportunities: () => {
    return get().opportunities.filter((opp) => 
      opp.weatherImpact?.affectsPaint && 
      (opp.status === "Estimate" || opp.status === "Upcoming")
    )
  },
}))
