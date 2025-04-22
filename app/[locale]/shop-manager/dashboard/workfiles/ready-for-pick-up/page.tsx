'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus, Calendar, Check, MessageSquareMore, CheckCircle } from 'lucide-react'
import { Workfile, WorkfileStatus } from '@/app/types/workfile'
import { useState, useCallback, useEffect } from 'react'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import { useOpportunityStore } from '@/app/stores/opportunity-store'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import { formatDate } from '@/app/utils/date-utils'
import { formatCurrency } from '@/app/utils/currency-utils'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'

export default function ReadyForPickup() {
  const { getWorkfilesByStatus, setSelectedWorkfile, selectedWorkfile } = useWorkfileStore()
  const { getOpportunityById, setSelectedOpportunity, selectedOpportunity } = useOpportunityStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const readyWorkfiles = getWorkfilesByStatus(WorkfileStatus.ReadyForPickup)

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

  const handleCompleteClick = useCallback((workfile: Workfile, e: React.MouseEvent) => {
    e.stopPropagation()
    // Handle complete button click - would transition to Archived status
    console.log('Complete clicked for workfile:', workfile.workfileId)
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
          year={row.original.vehicle.year.toString()}
          imageUrl={row.original.vehicle.vehiclePicturesUrls[0] || `https://picsum.photos/seed/${row.original.workfileId}/200/100`}
        />
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
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.owner.name}
        </span>
      ),
    },
    {
      accessorKey: 'qualityControl.completionDate',
      header: 'QC Date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDate(row.original.qualityControl?.completionDate) || '---'}
        </span>
      ),
    },
    {
      accessorKey: 'pickupDate',
      header: 'Pick-up',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDate(row.original.pickupDate) || '---'}
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
          buttonIcon={<MessageSquareMore className="w-5 h-5" />}
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

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={readyWorkfiles}
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
