'use client'

import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import DateTimePicker from '@/app/[locale]/custom-components/date-time-picker'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import { useGetWorkfilesByTenantId } from '@/app/api/hooks/useWorkfiles'
import { Workfile } from '@/app/types/workfile'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { ColumnDef } from '@tanstack/react-table'
import { Check, ClipboardPlus, MessageSquareMore } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'

export default function Upcoming() {
  const { data: session } = useSession()
  const { workfiles } = useGetWorkfilesByTenantId({ tenantId: session?.user?.tenantId! })
  const [modalState, setModalState] = useState<{ isOpen: boolean; opportunityId: string | null }>({
    isOpen: false,
    opportunityId: null
  })

  const upcomingWorkfiles = workfiles?.filter(w => w.status.toLowerCase() === 'upcoming') || []

  const handleRowClick = useCallback((workfile: any) => {
    setModalState({
      isOpen: true,
      opportunityId: workfile.opportunity.id
    })
  }, [])

  const handleContactClick = useCallback((workfile: any) => {
    // Handle contact info click
    console.log('Contact clicked for workfile:', workfile.id)
  }, [])

  const handleTaskClick = useCallback((workfile: any) => {
    // Handle task button click
    console.log('Task clicked for workfile:', workfile.id)
  }, [])

  const handleModalOpenChange = useCallback((open: boolean) => {
    setModalState(prev => ({ ...prev, isOpen: open }))
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
  }, [])

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
      cell: ({ row }) => {
        // Check if vehicle exists
        if (!row.original.vehicle) {
          return (
            <VehicleCell
              make="---"
              model="---"
              year="---"
              imageUrl={`https://picsum.photos/seed/${row.original.workfileId || 'default'}/200/100`}
            />
          )
        }
        
        return (
          <VehicleCell
            make={row.original.vehicle.make || '---'}
            model={row.original.vehicle.model || '---'}
            year={row.original.vehicle.year?.toString() || '---'}
            imageUrl={row.original.vehicle.vehiclePicturesUrls?.[0] || `https://picsum.photos/seed/${row.original.workfileId || 'default'}/200/100`}
          />
        )
      },
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => {
        // Check if owner exists
        if (!row.original.owner) {
          return <span className="whitespace-nowrap">---</span>
        }
        
        return (
          <span className="whitespace-nowrap">
            {row.original.owner.name || '---'}
          </span>
        )
      },
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
        <DateTimePicker
          value={row.original.dropDate}
          editable={!row.original.dropDate}
          onOk={(date: Date) => console.log(date)}
        />
      ),
    },
    {
      accessorKey: 'technician',
      header: 'TECHNICIAN',
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
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
            <span className="flex items-center text-green-600">
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
        data={upcomingWorkfiles}
        onRowClick={handleRowClick}
      />

      {/* Bottom Sheet Modal for Opportunity Details */}
      {modalState.isOpen && modalState.opportunityId && (
        <BottomSheetModal
          isOpen={modalState.isOpen}
          onOpenChange={handleModalOpenChange}
          title="Opportunity Details"
        >
          <OpportunityModal opportunityId={modalState.opportunityId} />
        </BottomSheetModal>
      )}
    </div>
  )
}
function handleCheckInClick(workfileId: string): any {
  throw new Error('Function not implemented.')
}

