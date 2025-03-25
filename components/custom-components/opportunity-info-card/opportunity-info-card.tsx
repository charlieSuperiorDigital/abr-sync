'use client'

import { useOpportunityStore } from '@/app/stores/opportunity-store'
import { Car, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { StatusBadge } from '../status-badge/status-badge'
import { OpportunityStatus } from '@/app/types/opportunity'

interface OpportunityInfoCardProps {
  opportunityId: string
}

export function OpportunityInfoCard({ opportunityId }: OpportunityInfoCardProps) {
  const { getOpportunityById } = useOpportunityStore()
  const opportunity = getOpportunityById(opportunityId)

  if (!opportunity) return null

  return (
    <div className="bg-[#E3E3E3] p-6 rounded-lg space-y-6">
      <h3 className="font-body font-semibold text-lg leading-none tracking-normal">Linked File</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {opportunity.vehicle.photos?.[0] && (
            <img
              src={opportunity.vehicle.photos[0].url}
              alt={`${opportunity.vehicle.year} ${opportunity.vehicle.make}`}
              className="w-12 h-12 object-cover rounded-lg"
            />
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">
              {opportunity.vehicle.year} {opportunity.vehicle.make}
            </span>
            <Car className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge variant="slate" className="text-sm">
            {opportunity.status}
          </StatusBadge>
          {(opportunity.status === OpportunityStatus.New || opportunity.status === OpportunityStatus.SecondCall) && (
            <StatusBadge variant="success" className="text-sm">
              OPEN: OPPORTUNITY
            </StatusBadge>
          )}
          
          {/* {opportunity.warning && (
            <span className="text-red-500 text-2xl">!</span>
          )} */}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-24 gap-y-6">
        <div className="space-y-6">
          <div>
            <div className="text-xs font-medium leading-none uppercase tracking-normal text-500 mb-1">CLAIM:</div>
            <div className="font-medium">{opportunity.insurance.claimNumber}</div>
          </div>
          <div>
            <div className="text-xs font-medium leading-none uppercase tracking-normal text-500 mb-1">DROP DATE:</div>
            <div className="font-medium">
              {opportunity.dropDate ? format(new Date(opportunity.dropDate), 'M-dd-yy') : 'Not set'}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-xs font-medium leading-none uppercase tracking-normal text-500 mb-1">VEHICLE OWNER:</div>
            <div className="font-medium">{opportunity.owner.name}</div>
          </div>
          <div>
            <div className="text-xs font-medium leading-none uppercase tracking-normal text-500 mb-1">INSURANCE:</div>
            <div className="font-medium">{opportunity.insurance.company}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-xs font-medium leading-none uppercase tracking-normal text-500 mb-1">LAST COMMUNICATION:</div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {opportunity.lastCommunicationSummary
                  ? format(new Date(opportunity.lastUpdatedDate), 'MMM dd h:mm a')
                  : 'No communication yet'}
              </span>
              <MessageSquare className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
