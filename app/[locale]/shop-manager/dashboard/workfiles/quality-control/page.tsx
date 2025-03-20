// This file represents the quality-control route

'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus, Calendar, Check, MessageSquareMore, ClipboardCheck } from 'lucide-react'
import { Workfile, WorkfileStatus, QualityControlStatus } from '@/app/types/workfile'
import { useState, useCallback, useEffect } from 'react'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import { useOpportunityStore } from '@/app/stores/opportunity-store'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { formatDate } from '@/app/utils/date-utils'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import QCChecklistBottomSheet from '@/components/custom-components/qc-checklist-modal'

export default function QualityControl() {
  const { getWorkfilesByStatus, setSelectedWorkfile, selectedWorkfile } = useWorkfileStore()
  const { getOpportunityById, setSelectedOpportunity, selectedOpportunity } = useOpportunityStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isQCChecklistOpen, setIsQCChecklistOpen] = useState(false)
  const [selectedQCWorkfile, setSelectedQCWorkfile] = useState<Workfile | null>(null)

  const qcWorkfiles = getWorkfilesByStatus(WorkfileStatus.QC)

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

  const handleQCChecklistClick = useCallback((workfile: Workfile, e: React.MouseEvent) => {
    e.stopPropagation()
    // Open QC checklist modal
    setSelectedQCWorkfile(workfile)
    setIsQCChecklistOpen(true)
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
      accessorKey: 'qualityControl.status',
      header: 'QC Status',
      cell: ({ row }) => {
        const status = row.original.qualityControl?.status || QualityControlStatus.AWAITING;
        return (
          <div className="flex items-center gap-2">
            <StatusBadge 
              variant={status === QualityControlStatus.COMPLETED ? 'success' : 'warning'} 
              size="sm"
            >
              {status}
            </StatusBadge>
            {status === QualityControlStatus.AWAITING && (
              <DarkButton 
                buttonText="QC Checklist" 
                buttonIcon={<ClipboardCheck size={16} />}
                onClick={(e) => handleQCChecklistClick(row.original, e)}
              />
            )}
          </div>
        );
      },
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
      accessorKey: 'estimatedCompletionDate',
      header: 'ECD',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDate(row.original.estimatedCompletionDate) || '---'}
        </span>
      ),
    },
    {
      accessorKey: 'qualityControl.assignedTo',
      header: 'QC Assigned To',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.qualityControl?.assignedTo || '---'}
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
        data={qcWorkfiles}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />

      {/* Opportunity Details Modal */}
      <BottomSheetModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedWorkfile ? `${selectedWorkfile.vehicle.year} ${selectedWorkfile.vehicle.make} ${selectedWorkfile.vehicle.model}` : ''}
      >
        {selectedOpportunity && <OpportunityModal opportunity={selectedOpportunity} />}
      </BottomSheetModal>

      {/* QC Checklist Modal */}
      <QCChecklistBottomSheet
        workfile={selectedQCWorkfile}
        isOpen={isQCChecklistOpen}
        onOpenChange={setIsQCChecklistOpen}
      />
    </div>
  )
}
