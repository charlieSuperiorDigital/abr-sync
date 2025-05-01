'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus, Calendar, Check, MessageSquareMore, CheckCircle } from 'lucide-react'
import { WorkfilesByTenantIdResponse } from '@/app/types/workfile'
import { useState, useCallback } from 'react'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import { formatDate } from '@/app/utils/date-utils'
import { formatCurrency } from '@/app/utils/currency-utils'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useGetWorkfilesByTenantId } from '@/app/api/hooks/useWorkfiles'
import { useSession } from 'next-auth/react'

export default function ReadyForPickup() {
  const { data: session } = useSession()
  const { readyForPickup, isLoading } = useGetWorkfilesByTenantId({ tenantId: session?.user?.tenantId! })
  const [selectedWorkfile, setSelectedWorkfile] = useState<WorkfilesByTenantIdResponse | null>(null)
  const [modalState, setModalState] = useState<{ isOpen: boolean; opportunityId: string | null }>({
    isOpen: false,
    opportunityId: null
  })

  const handleRowClick = useCallback((workfile: WorkfilesByTenantIdResponse) => {
    setSelectedWorkfile(workfile)
    setModalState({
      isOpen: true,
      opportunityId: workfile.opportunityId
    })
  }, [])

  const handleContactClick = useCallback((workfile: WorkfilesByTenantIdResponse) => {
    // Handle contact info click
    console.log('Contact clicked for workfile:', workfile.id)
  }, [])

  const handleTaskClick = useCallback((workfile: WorkfilesByTenantIdResponse) => {
    // Handle task button click
    console.log('Task clicked for workfile:', workfile.id)
  }, [])

  const handleModalOpenChange = useCallback((open: boolean) => {
    setModalState(prev => ({ ...prev, isOpen: open }))
  }, [])

  const handleCompleteClick = useCallback((workfile: WorkfilesByTenantIdResponse, e: React.MouseEvent) => {
    e.stopPropagation()
    // Handle complete button click - would transition to Archived status
    console.log('Complete clicked for workfile:', workfile.id)
  }, [])

  const columns: ColumnDef<WorkfilesByTenantIdResponse, any>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.opportunity.roNumber || '---'}</span>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.opportunity.vehicle.make}
          model={row.original.opportunity.vehicle.model}
          year={row.original.opportunity.vehicle.year.toString()}
          imageUrl={row.original.opportunity.vehicle.vehiclePicturesUrls[0] || `https://picsum.photos/seed/${row.original.id}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'estimateAmount',
      header: 'Estimate',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {/* {formatCurrency(row.original.estimateAmount)} */}
          PLACEHOLDER
        </span>
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.opportunity.vehicle.owner ? 
            `${row.original.opportunity.vehicle.owner.firstName} ${row.original.opportunity.vehicle.owner.lastName}` : 
            'Owner Name'}
        </span>
      ),
    },
    {
      accessorKey: 'qualityControl.completionDate',
      header: 'QC Date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {/* {formatDate(row.original.qualityControl?.completionDate) || '---'} */}
          PLACEHOLDER
        </span>
      ),
    },
    {
      accessorKey: 'pickupDate',
      header: 'Pick-up',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {/* {formatDate(row.original.pickupDate) || '---'} */}
          PLACEHOLDER
        </span>
      ),
    },
    {
      id: 'lastCommDate',
      header: 'Last Comm Date',
      cell: ({ row }) => (
        // <span className="whitespace-nowrap">{formatDate(row.original.lastUpdatedDate)}</span>
        <span className="whitespace-nowrap">PLACEHOLDER</span>
      ),
    },
    {
      header: 'Summary',
      cell: ({ row }) => (
        <RoundButtonWithTooltip 
          buttonIcon={<MessageSquareMore className="w-5 h-5" />}
          tooltipText={row.original.opportunity.summary || 'No summary available'}
        />
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
            handleContactClick(row.original)
          }}
        >
          <ContactInfo />
        </div>
      ),
    },
    {
      id: 'complete',
      header: 'Complete',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DarkButton
            buttonText="Complete"
            buttonIcon={<CheckCircle size={16} />}
            onClick={(e) => handleCompleteClick(row.original, e)}
          />
        </div>
      ),
    },
    {
      id: 'task',
      header: 'Add Task',
      cell: ({ row }) => (
        <div 
          data-testid="task-button" 
          className="transition-colors cursor-pointer hover:text-blue-600"
          onClick={(e) => {
            e.stopPropagation()
            handleTaskClick(row.original)
          }}
        >
          <ClipboardPlus size={18} />
        </div>
      ),
    },
  ]

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading workfiles...</div>
  }

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={readyForPickup || []}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />

      <BottomSheetModal
        isOpen={modalState.isOpen}
        onOpenChange={handleModalOpenChange}
        title={selectedWorkfile ? `${selectedWorkfile.opportunity.vehicle.year} ${selectedWorkfile.opportunity.vehicle.make} ${selectedWorkfile.opportunity.vehicle.model}` : ''}
      >
        {modalState.opportunityId && <OpportunityModal opportunityId={modalState.opportunityId} workfileId={selectedWorkfile?.id} />}
      </BottomSheetModal>
    </div>
  )
}
