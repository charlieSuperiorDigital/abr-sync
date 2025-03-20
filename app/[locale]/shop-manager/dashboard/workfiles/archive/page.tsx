'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { MessageSquareMore, Archive as ArchiveIcon } from 'lucide-react'
import { Workfile, WorkfileStatus } from '@/app/types/workfile'
import { useState, useCallback, useEffect } from 'react'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import { useOpportunityStore } from '@/app/stores/opportunity-store'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'

export default function Archive() {
  const { getWorkfilesByStatus, setSelectedWorkfile, selectedWorkfile, updateWorkfile } = useWorkfileStore()
  const { getOpportunityById, setSelectedOpportunity, selectedOpportunity } = useOpportunityStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const archivedWorkfiles = getWorkfilesByStatus(WorkfileStatus.Archived)

  // When a workfile is selected, find the related opportunity
  useEffect(() => {
    if (selectedWorkfile) {
      const relatedOpportunity = getOpportunityById(selectedWorkfile.opportunityId)
      if (relatedOpportunity) {
        setSelectedOpportunity(relatedOpportunity)
      }
    }
  }, [selectedWorkfile, getOpportunityById, setSelectedOpportunity])

  const handleRowClick = useCallback((workfile: Workfile) => {
    setSelectedWorkfile(workfile)
    setIsModalOpen(true)
  }, [setSelectedWorkfile])

  const handleUnarchive = useCallback((e: React.MouseEvent, workfile: Workfile) => {
    e.stopPropagation()
    // Update workfile status to Ready for Pickup
    updateWorkfile(workfile.workfileId, {
      status: WorkfileStatus.ReadyForPickup
    })
    console.log('Unarchived workfile:', workfile.workfileId)
  }, [updateWorkfile])

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
  const hasRentalVehicle = (workfile: Workfile) => {
    return workfile.isInRental === true;
  }

  const columns: ColumnDef<Workfile, any>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.roNumber || '---'}</span>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={row.original.vehicle.year}
          imageUrl={row.original.vehicle.vehiclePicturesUrls[0] || `https://picsum.photos/seed/${row.original.workfileId}/200/100`}
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
      accessorKey: 'estimateAmount',
      header: 'Estimate',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatCurrency(row.original.estimateAmount)}
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
          {formatDate(row.original.inDate)}
        </span>
      ),
    },
    {
      accessorKey: 'insurance.company',
      header: 'Insurance',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.insurance?.company || '---'}
        </span>
      ),
    },
    {
      id: 'lastCommDate',
      header: 'Last Comm Date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDate(row.original.lastUpdatedDate)}</span>
      ),
    },
    {
      header: 'Summary',
      cell: ({ row }) => (
        <RoundButtonWithTooltip 
          buttonIcon={<MessageSquareMore className="h-5 w-5" />}
          tooltipText={row.original.lastCommunicationSummary || 'No summary available'}
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
            buttonIcon={<ArchiveIcon className="h-4 w-4" />}
          />
        </span>
      ),
    },
  ]

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={archivedWorkfiles}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />

      <BottomSheetModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedWorkfile ? `${selectedWorkfile.vehicle.year} ${selectedWorkfile.vehicle.make} ${selectedWorkfile.vehicle.model}` : ''}
      >
        {selectedOpportunity && <OpportunityModal opportunity={selectedOpportunity} />}
      </BottomSheetModal>
    </div>
  )
}
