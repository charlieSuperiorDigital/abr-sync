'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  AutoCell,
  StatusBadgeCell,
  SummaryCell,
  UploadTimeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus, Car, Plus } from 'lucide-react'
import { Opportunity, OpportunityStatus } from '@/app/types/opportunity'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useState, useCallback } from 'react'
import { useOpportunityStore } from '@/app/stores/opportunity-store'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { showPickupToast } from '@/app/utils/toast-utils'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'

export default function TotalLossOpportunities() {
  const { getOpportunitiesByStatus, setSelectedOpportunity, selectedOpportunity, archiveOpportunity, updateOpportunity } = useOpportunityStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pickupConfirmation, setPickupConfirmation] = useState<{ isOpen: boolean; opportunity: Opportunity | null }>({
    isOpen: false,
    opportunity: null
  })

  const handleRowClick = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsModalOpen(true)
  }, [setSelectedOpportunity])

  const handlePickupConfirm = useCallback(() => {
    if (pickupConfirmation.opportunity) {
      // First update the pickup date
      updateOpportunity(pickupConfirmation.opportunity.opportunityId, {
        pickedUpDate: new Date().toISOString()
      })
      // Then archive the opportunity
      archiveOpportunity(pickupConfirmation.opportunity.opportunityId)
      showPickupToast(pickupConfirmation.opportunity)
      console.log('Marking opportunity as picked up:', pickupConfirmation.opportunity.opportunityId)
    }
  }, [pickupConfirmation.opportunity, updateOpportunity, archiveOpportunity])

  const handlePickupClick = useCallback((opportunity: Opportunity) => {
    setPickupConfirmation({
      isOpen: true,
      opportunity
    })
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const columns: ColumnDef<Opportunity, any>[] = [
    {
      accessorKey: 'insurance.claimNumber',
      header: 'Claim',
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={row.original.vehicle.year}
          imageUrl={`https://picsum.photos/seed/${row.original.opportunityId}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.owner.name}
        </span>
      ),
    },
    {
      accessorKey: 'insurance.company',
      header: 'Insurance',
      cell: ({ row }) => (
        <span className={`whitespace-nowrap font-bold ${row.original.insurance.company === 'PROGRESSIVE' ? 'text-blue-700' : ''}`}>
          {row.original.insurance.company.toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: 'numberOfCommunications',
      header: '# OF COMMUNICATIONS',
      cell: ({ row }) => {
        const communicationLogs = row.original.logs?.filter(log => 
          log.type.toLowerCase().includes('call') || 
          log.type.toLowerCase().includes('email') || 
          log.type.toLowerCase().includes('message')
        ) || []
        
        return (
          <span className="whitespace-nowrap">
            {communicationLogs.length}
          </span>
        )
      }
    },
    {
      accessorKey: 'timeTracking',
      header: 'Time Tracking',
    },
    {
      accessorKey: 'finalBill',
      header: 'Final Bill',
      cell: ({ row }) => {
        const amount = row.original.finalBill?.amount
        return (
          <span className="whitespace-nowrap">
            {amount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount) : '---'}
          </span>
        )
      }
    },
    {
      header: 'Summary',
      cell: ({ row }) => <SummaryCell text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' />,
    },
    {
      id: 'pickup',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DarkButton
            buttonText="Mark as Picked Up"
            buttonIcon={<Car className="w-4 h-4 mr-2" />}
            onClick={(e) => {
              e.stopPropagation()
              handlePickupClick(row.original)
            }}
          />
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div 
          data-testid="contact-info" 
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            console.log('Contact clicked for opportunity:', row.original.opportunityId)
          }}
        >
          <ContactInfo />
        </div>
      ),
    },
    {
      id: 'task',
      header: 'Task',
      cell: ({ row }) => (
        <div
        onClick={(e) => {
          e.stopPropagation()
        }}
        >

          <NewTaskModal
            title="New Task"
            defaultRelation={
              {
                id: row.original.opportunityId,
                type: 'opportunity'
              }
            }
            children={
              <Plus className="w-5 h-5 m-auto" />
            }
          />
        </div>
      ),
    },
  ]

  const opportunities = getOpportunitiesByStatus(OpportunityStatus.TotalLoss)

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={opportunities}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />
      <BottomSheetModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedOpportunity ? `${selectedOpportunity.vehicle.year} ${selectedOpportunity.vehicle.make} ${selectedOpportunity.vehicle.model}` : ''}
      >
        {selectedOpportunity && <OpportunityModal opportunity={selectedOpportunity} />}
      </BottomSheetModal>
      <ConfirmationModal
        isOpen={pickupConfirmation.isOpen}
        onClose={() => setPickupConfirmation({ isOpen: false, opportunity: null })}
        onConfirm={handlePickupConfirm}
        title="Mark Vehicle as Picked Up"
        description="Are you sure you want to mark this vehicle as picked up? This will archive the opportunity and record the pickup date."
        confirmText="Mark as Picked Up"
        confirmIcon={Car}
      />
    </div>
  )
}
