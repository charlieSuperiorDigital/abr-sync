'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus, Calendar, Check, MessageSquareMore } from 'lucide-react'
import { Workfile, WorkfileStatus } from '@/app/types/workfile'
import { useState, useCallback, useEffect } from 'react'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import { useOpportunityStore } from '@/app/stores/opportunity-store'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'

export default function Upcoming() {
  const { getWorkfilesByStatus, setSelectedWorkfile, selectedWorkfile, checkInVehicle, updateWorkfile } = useWorkfileStore()
  const { getOpportunityById, setSelectedOpportunity, selectedOpportunity } = useOpportunityStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const upcomingWorkfiles = getWorkfilesByStatus(WorkfileStatus.Upcoming)

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

  const handleCheckInClick = useCallback((workfileId: string) => {
    checkInVehicle(workfileId)
  }, [checkInVehicle])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
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
      accessorKey: 'isVoilComplete',
      header: 'VOIL',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.isVoilComplete ? 'Complete' : 'Pending'}
        </span>
      ),
    },
    {
      accessorKey: 'is4CornersComplete',
      header: '4 COR.',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.is4CornersComplete ? 'Complete' : 'Pending'}
        </span>
      ),
    },
    {
      accessorKey: 'estimateAmount',
      header: 'EST.',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          ${row.original.estimateAmount?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      accessorKey: 'parts',
      header: 'PARTS PRE-ORD.',
      cell: ({ row }) => {
        const allPartsOrdered = row.original.parts?.list.every(
          part => part.status === "Ordered" || part.status === "Received"
        );
        return (
          <span className="whitespace-nowrap">
            {allPartsOrdered ? 'Yes' : 'No'}
          </span>
        );
      },
    },
    {
      accessorKey: 'dropDate',
      header: 'DROP DATE',
      cell: ({ row }) => (
        <span className="whitespace-nowrap flex items-center">
          <Calendar size={14} className="mr-1" />
          {formatDate(row.original.dropDate)}
        </span>
      ),
    },
    {
      accessorKey: 'technician',
      header: 'TECHNICIAN',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.technician?.avatar && (
            <img 
              src={row.original.technician.avatar} 
              alt="" 
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="whitespace-nowrap">
            {row.original.technician?.name || '---'}
          </span>
        </div>
      ),
    },
    {
      id: 'checkIn',
      header: 'Check-In',
      cell: ({ row }) => (
        <div 
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {row.original.isVehicleCheckedIn ? (
            <span className="text-green-600 flex items-center">
              <Check size={16} className="mr-1" />
              Checked In
            </span>
          ) : (
            <DarkButton
              buttonText="Check In"
              buttonIcon={<Check className="w-4 h-4" />}
              onClick={() => handleCheckInClick(row.original.workfileId)}
            />
          )}
        </div>
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
      <h1 className="text-2xl font-bold mb-6">Upcoming Workfiles</h1>
      <DataTable
        columns={columns}
        data={upcomingWorkfiles}
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
