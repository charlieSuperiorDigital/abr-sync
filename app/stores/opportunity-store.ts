import { create } from 'zustand'
import { Opportunity, OpportunityStatus, RepairStage } from '../types/opportunities'
import { opportunities } from '../mocks/opportunities_new'
import { useWorkfileStore } from './workfile-store'
import { WorkfileStatus } from '../types/workfile'

export interface OpportunityStore {
  opportunities: Opportunity[]
  selectedOpportunity: Opportunity | null
  setSelectedOpportunity: (opportunity: Opportunity | null) => void
  updateOpportunity: (opportunityId: string, updates: Partial<Opportunity>) => void
  addOpportunity: (opportunity: Opportunity) => void
  removeOpportunity: (opportunityId: string) => void
  archiveOpportunity: (opportunityId: string) => void
  unarchiveOpportunity: (opportunityId: string) => void
  // Filter opportunities by workflow state
  getOpportunitiesByStatus: (status: OpportunityStatus) => Opportunity[]
  // Get counts for all opportunity statuses
  getOpportunityStatusCounts: () => Record<OpportunityStatus, number>
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
  // Get archived opportunities
  getArchivedOpportunities: () => Opportunity[]
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

  archiveOpportunity: (opportunityId) =>
    set((state) => ({
      opportunities: state.opportunities.map((opp) =>
        opp.opportunityId === opportunityId
          ? { ...opp, isArchived: true }
          : opp
      ),
      selectedOpportunity:
        state.selectedOpportunity?.opportunityId === opportunityId
          ? { ...state.selectedOpportunity, isArchived: true }
          : state.selectedOpportunity,
    })),

  unarchiveOpportunity: (opportunityId) =>
    set((state) => ({
      opportunities: state.opportunities.map((opp) =>
        opp.opportunityId === opportunityId
          ? { ...opp, isArchived: false }
          : opp
      ),
      selectedOpportunity:
        state.selectedOpportunity?.opportunityId === opportunityId
          ? { ...state.selectedOpportunity, isArchived: false }
          : state.selectedOpportunity,
    })),

  getOpportunitiesByStatus: (status) => {
    // For Archived status, return all archived opportunities
    if (status === OpportunityStatus.Archived) {
      return get().opportunities.filter((opp) => opp.isArchived)
    }
    // For other statuses, return non-archived opportunities with matching status
    return get().opportunities.filter((opp) => !opp.isArchived && opp.status === status)
  },

  getOpportunityStatusCounts: () => {
    const opportunities = get().opportunities
    const counts = Object.values(OpportunityStatus).reduce((acc, status) => {
      // For Archived status, count all archived opportunities
      if (status === OpportunityStatus.Archived) {
        acc[status] = opportunities.filter(opp => opp.isArchived).length
      } else {
        // For other statuses, count non-archived opportunities with matching status
        acc[status] = opportunities.filter(opp => !opp.isArchived && opp.status === status).length
      }
      return acc
    }, {} as Record<OpportunityStatus, number>)
    return counts
  },

  getOpportunityById: (opportunityId) => {
    return get().opportunities.find((opp) => opp.opportunityId === opportunityId)
  },

  getFollowUpOpportunities: () => {
    return get().opportunities.filter((opp) => !opp.isArchived && opp.status === OpportunityStatus.SecondCall)
  },

  getUpcomingDrops: () => {
    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    return get().opportunities.filter((opp) => {
      if (!opp.dropDate || opp.status !== OpportunityStatus.New || opp.isArchived) return false
      const dropDate = new Date(opp.dropDate)
      return dropDate <= in24Hours && dropDate >= now
    })
  },

  getReadyForWorkfile: () => {
    return get().opportunities.filter((opp) => {
      // Check if opportunity is in the right state
      if (opp.status !== OpportunityStatus.Estimate || opp.isArchived) return false
      
      // Check if insurance is approved
      if (!opp.insurance.approved) return false
      
      // Check if all required inspections are complete
      if (!opp.isVoilComplete || !opp.is4CornersComplete) return false
      
      return true
    })
  },

  createWorkfileFromOpportunity: (opportunityId) => {
    const opportunity = get().getOpportunityById(opportunityId)
    if (!opportunity || opportunity.isArchived) return

    // Only create workfile if opportunity is in the right state
    if (opportunity.status !== OpportunityStatus.Estimate || !opportunity.insurance.approved) return

    const workfileStore = useWorkfileStore.getState()
    
    // Create new workfile
    const workfile = {
      workfileId: `WF${Date.now()}`,
      opportunityId: opportunity.opportunityId,
      roNumber: opportunity.roNumber,
      status: WorkfileStatus.Upcoming,
      createdDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
      vehicle: opportunity.vehicle,
      owner: opportunity.owner,
      insurance: {
        ...opportunity.insurance,
        adjuster: opportunity.insurance.adjuster,
        adjusterPhone: opportunity.insurance.adjusterPhone,
        adjusterEmail: opportunity.insurance.adjusterEmail,
      },
      inDate: opportunity.vehicleInDate || new Date().toISOString(),
      estimatedCompletionDate: opportunity.estimatedCompletionDate,
      estimateAmount: opportunity.estimateAmount,
      estimateSource: opportunity.estimateSource,
      estimateVersion: opportunity.estimateVersion,
      estimateHours: opportunity.estimateHours,
      isVoilComplete: opportunity.isVoilComplete,
      is4CornersComplete: opportunity.is4CornersComplete,
      weatherImpact: opportunity.weatherImpact,
      location: opportunity.location,
      repairPhase: opportunity.repairPhase || "Not Started",
    }

    // Add workfile to store
    // workfileStore.addWorkfile(workfile)

    // Update opportunity status and stage
    get().updateOpportunity(opportunityId, { 
      status: OpportunityStatus.Upcoming,
      stage: RepairStage.RepairOrder
    })
  },

  checkUploadDeadline: (opportunityId) => {
    const opportunity = get().getOpportunityById(opportunityId)
    if (!opportunity?.dropDate || opportunity.isArchived) return { passed: false, remainingTime: null }

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
      !opp.isArchived &&
      opp.weatherImpact?.affectsPaint && 
      (opp.status === OpportunityStatus.Estimate || opp.status === OpportunityStatus.Upcoming)
    )
  },

  getArchivedOpportunities: () => {
    return get().opportunities.filter((opp) => opp.isArchived)
  },
}))
