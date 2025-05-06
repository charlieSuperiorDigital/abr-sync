'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { MessageSquareMore, Archive as ArchiveIcon } from 'lucide-react'
import { WorkfilesByTenantIdResponse } from '@/app/types/workfile'
import { useState, useCallback } from 'react'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useGetWorkfilesByTenantId } from '@/app/api/hooks/useWorkfiles'
import { useSession } from 'next-auth/react'

export default function Archive() {
  const { data: session } = useSession()
  const { archived, isLoading } = useGetWorkfilesByTenantId({ tenantId: session?.user?.tenantId! })
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

  const handleModalOpenChange = useCallback((open: boolean) => {
    setModalState(prev => ({ ...prev, isOpen: open }))
  }, [])

  const handleUnarchive = useCallback((e: React.MouseEvent, workfile: WorkfilesByTenantIdResponse) => {
    e.stopPropagation()
    // Update workfile status to Ready for Pickup - would need API implementation
    console.log('Unarchived workfile:', workfile.id)
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '---'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Helper to check if a workfile has a rental vehicle
  const hasRentalVehicle = (workfile: WorkfilesByTenantIdResponse) => {
    return workfile.opportunity.inRental === true;
  }

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
          make={row.original.opportunity.vehicle?.make || '---'}
          model={row.original.opportunity.vehicle?.model || '---'}
          year={row.original.opportunity.vehicle?.year.toString() || '---'}
          imageUrl={row.original.opportunity.vehicle?.vehiclePicturesUrls[0] || `https://picsum.photos/seed/${row.original.id}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.opportunity?.vehicle?.owner ? 
            `${row.original.opportunity.vehicle.owner.firstName} ${row.original.opportunity.vehicle.owner.lastName}` : 
            'Owner Name'}
        </span>
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
      id: 'inRental',
      header: 'In Rental',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {hasRentalVehicle(row.original) ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'inDate',
      header: 'In Date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDate(row.original.opportunity.inDate)}
        </span>
      ),
    },
    {
      accessorKey: 'insurance.company',
      header: 'Insurance',
      cell: ({ row }) => {
        // Safely handle the insurance property which might be null
        const insurance = row.original.opportunity.insurance;
        return (
          <span className="whitespace-nowrap">
            {insurance ? insurance : '---'}
          </span>
        );
      },
    },
    {
      id: 'lastCommDate',
      header: 'Last Comm Date',
      cell: ({ row }) => (
        // <span className="whitespace-nowrap">{formatDate(row.original.updatedAt)}</span>
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
      id: 'unarchive',
      header: 'Unarchive',
      cell: ({ row }) => (
        <span onClick={(e) => handleUnarchive(e, row.original)}>
          <DarkButton 
            buttonText="Unarchive" 
            buttonIcon={<ArchiveIcon className="w-4 h-4" />}
          />
        </span>
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
        data={archived || []}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />

      <BottomSheetModal
        isOpen={modalState.isOpen}
        onOpenChange={handleModalOpenChange}
        title={selectedWorkfile ? `${selectedWorkfile.opportunity.vehicle?.year} ${selectedWorkfile.opportunity.vehicle?.make} ${selectedWorkfile.opportunity.vehicle?.model}` : ''}
      >
        {modalState.opportunityId && <OpportunityModal opportunityId={modalState.opportunityId} workfileId={selectedWorkfile?.id} />}
      </BottomSheetModal>
    </div>
  )
}
