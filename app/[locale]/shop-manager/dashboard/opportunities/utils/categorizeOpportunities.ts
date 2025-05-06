import { OpportunityResponse } from '@/app/types/opportunities'
import { isValidDate } from '@/app/utils/is-valid-date'

interface CategorizedOpportunities {
  new: OpportunityResponse[]
  estimate: OpportunityResponse[]
  secondCall: OpportunityResponse[]
  totalLoss: OpportunityResponse[]
  archived: OpportunityResponse[]
}
export const categorizeOpportunities = (
  opportunities: OpportunityResponse[]
): CategorizedOpportunities => {
  const result: CategorizedOpportunities = {
    new: [],
    estimate: [],
    secondCall: [],
    totalLoss: [],
    archived: [],
  }

  opportunities.forEach((opportunity) => {
    const status = opportunity.opportunityStatus.toLowerCase()
    // const typeOfLoss = opportunity.insuranceTypeOfLoss.toLowerCase()
    // const isSecondCall =
    //   isValidDate(opportunity._1stCall) && isValidDate(opportunity._2ndCall)

    if (status === 'new') {
      result.new.push(opportunity)
    }
    if (status === 'estimate') {
      result.estimate.push(opportunity)
    }
    if (status === 'second-call') {
      result.secondCall.push(opportunity)
    }
    if (status === 'total-loss') {
      result.totalLoss.push(opportunity)
    }
    if (status === 'archived') {
      result.archived.push(opportunity)
    }
  })

  return result
}
