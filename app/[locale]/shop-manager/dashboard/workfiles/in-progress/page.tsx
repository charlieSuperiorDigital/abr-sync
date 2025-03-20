'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
  StatusBadgeCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus, Calendar, Check, MessageSquareMore } from 'lucide-react'
import { Workfile, WorkfileStatus } from '@/app/types/workfile'
import { useState, useCallback, useEffect } from 'react'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import { useOpportunityStore } from '@/app/stores/opportunity-store'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import { formatDate, calculateDaysUntil } from '@/app/utils/date-utils'
import { formatCurrency } from '@/app/utils/currency-utils'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'

export default function InProgress() {
  const { getWorkfilesByStatus, setSelectedWorkfile, selectedWorkfile } = useWorkfileStore()
  const { getOpportunityById, setSelectedOpportunity, selectedOpportunity } = useOpportunityStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const inProgressWorkfiles = getWorkfilesByStatus(WorkfileStatus.InProgress)

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

  const handleContactClick = useCallback((workfile: Workfile) => {
    // Handle contact info click
    console.log('Contact clicked for workfile:', workfile.workfileId)
  }, [])

  const handleTaskClick = useCallback((workfile: Workfile) => {
    // Handle task button click
    console.log('Task clicked for workfile:', workfile.workfileId)
  }, [])

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
      accessorKey: 'isInRental',
      header: 'In Rental',
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.isInRental ? (
            <StatusBadgeCell status="YES" variant="success" />
          ) : (
            <StatusBadgeCell status="NO" variant="danger" />
          )}
        </div>
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
      accessorKey: 'estimatedCompletionDate',
      header: 'ECD',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {calculateDaysUntil(row.original.estimatedCompletionDate)}
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
      accessorKey: 'insurance.company',
      header: 'Insurance',
      cell: ({ row }) => (
        <span className={`whitespace-nowrap font-bold ${row.original.insurance.company === 'PROGRESSIVE' ? 'text-blue-700' : ''}`}>
          {row.original.insurance.company.toUpperCase()}
        </span>
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
      id: 'task',
      header: 'Add Task',
      cell: ({ row }) => (
        <div 
          data-testid="task-button" 
          className="cursor-pointer hover:text-blue-600 transition-colors"
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

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={inProgressWorkfiles}
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