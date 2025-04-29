'use client'

import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import DateTimePicker from '@/app/[locale]/custom-components/date-time-picker'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import { Opportunity } from '@/app/types/opportunity'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  SummaryCell,
  UploadTimeCell,
  VehicleCell
} from '@/components/custom-components/custom-table/table-cells'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { ColumnDef } from '@tanstack/react-table'
import { Archive, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

export default function NewOpportunities() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  const { newOpportunities, isLoading } = useGetOpportunities({ tenantId: tenantId! })
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [archiveConfirmation, setArchiveConfirmation] = useState<{ isOpen: boolean; opportunity: Opportunity | null }>({
    isOpen: false,
    opportunity: null
  })
  const [missingFields, setMissingFields] = useState<string[]>([])

  // Check for missing fields in the API response
  useEffect(() => {
    if (newOpportunities && newOpportunities.length > 0) {
      const firstOpportunity = newOpportunities[0]
      const expectedFields = [
        'opportunityId', 'opportunityStatus', 'opportunityCreatedAt', 'opportunityUpdatedAt',
        'insuranceName', 'insuranceProvider', 'insuranceClaimNumber', 'insurancePolicyNumber',
        'vehicleMake', 'vehicleModel', 'vehicleYear', 'vehicleVin',
        'ownerFirstName', 'ownerLastName', 'ownerEmail', 'ownerPhone'
      ]

      const missing = expectedFields.filter(field =>
        !(field in firstOpportunity) ||
        firstOpportunity[field as keyof typeof firstOpportunity] === undefined ||
        firstOpportunity[field as keyof typeof firstOpportunity] === null
      )

      if (missing.length > 0) {
        console.warn('Missing fields in API response:', missing)
        setMissingFields(missing)
      }
    }
  }, [newOpportunities])

  const handleRowClick = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsModalOpen(true)
  }, [setSelectedOpportunity])

  const handleContactClick = useCallback((opportunity: Opportunity) => {
    // Handle contact info click based on opportunity state
    console.log('Contact clicked for opportunity:', opportunity.opportunityId)
  }, [])

  const handleTaskClick = useCallback((opportunity: Opportunity) => {
    // Handle task button click based on opportunity state
    console.log('Task clicked for opportunity:', opportunity.opportunityId)
  }, [])

  // const handleArchiveConfirm = useCallback(() => {
  //   if (archiveConfirmation.opportunity) {
  //     archiveOpportunity(archiveConfirmation.opportunity.opportunityId)
  //     console.log('Archiving opportunity:', archiveConfirmation.opportunity.opportunityId)
  //   }
  // }, [archiveConfirmation.opportunity, archiveOpportunity])

  const handleArchiveClick = useCallback((opportunity: Opportunity) => {
    setArchiveConfirmation({
      isOpen: true,
      opportunity
    })
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const columns: ColumnDef<Opportunity>[] = [
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
        make={row.original.vehicle.make}
        model={row.original.vehicle.model}
        year={row.original.vehicle.year.toString()}
        imageUrl={row.original.vehicle.photos && row.original.vehicle.photos.length > 0
          ? row.original.vehicle.photos[0].url
          : `https://picsum.photos/seed/${row.original.opportunityId}/200/100`}
      />
      ),
    },
    {
      accessorKey: 'insurance.claimNumber',
      header: 'Claim',
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
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.owner.name}
        </span>
      ),
    },
    {
      accessorKey: 'isInRental',
      header: 'In Rental',
      cell: ({ row }) => (
        row.original.isInRental ? (
          <StatusBadge variant="success" size="sm">
            YES
          </StatusBadge>
        ) : (
          <StatusBadge variant="neutral" size="sm">
            NO
          </StatusBadge>
        )
      ),
    },
    {
      accessorKey: 'dropDate',
      header: 'Drop Date',
      cell: ({ row }) => (
        <DateTimePicker
          value={row.original.dropDate}
          editable={false}
          onOk={(date: Date) => console.log(date)}
        />
      ),
    },
    {
      accessorKey: 'parts.warning',
      header: 'Parts',
      cell: ({ row }) => {
        const warning = row.original.parts?.warning;
        if (!warning) return null;

        // Determine variant and text based on warning type
        let variant: 'warning' | 'danger';
        let text: string;

        if (warning === 'ORDERED') {
          variant = 'warning';
          text = 'ORDERED';
        } else if (warning === 'UPDATED') {
          variant = 'danger';
          text = 'UPDATED';
        } else {
          return null; // No warning display for other cases
        }

        return (
          <div>
            <StatusBadge
              variant={variant}
              size="sm"
              className="whitespace-nowrap"
            >
              {text}
            </StatusBadge>
          </div>
        );
      },
    },
    {
      id: 'uploadDeadline',
      header: 'Upload Deadline',
      cell: ({ row }) => (
        row.original.uploadDeadline ? (
          <UploadTimeCell deadline={row.original.uploadDeadline} />
        ) : (
          <span className="text-gray-400">---</span>
        )
      ),
    },
    {
      id: 'lastCommDate',
      header: 'Last Communication',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDate(row.original.lastUpdatedDate)}</span>
      ),
    },
    {
      header: 'Summary',
      cell: ({ row }) => <SummaryCell text={row.original.lastCommunicationSummary || 'No communication summary available.'} />,
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
              <Plus className="m-auto w-5 h-5" />
            }
          />
        </div>
      ),
    },
    {
      id: 'archive',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DarkButton
            buttonText="Archive"
            buttonIcon={<Archive className="mr-2 w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation()
              handleArchiveClick(row.original)
            }}
          />
        </div>
      ),
    },
  ]



  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading opportunities...</div>
  }

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={newOpportunities.map(mapApiResponseToOpportunity)}
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
        isOpen={archiveConfirmation.isOpen}
        onClose={() => setArchiveConfirmation({ isOpen: false, opportunity: null })}
        onConfirm={() => {}}
        // onConfirm={handleArchiveConfirm}
        title="Archive Opportunity"
        description="Are you sure you want to archive this opportunity? You can unarchive it later if needed."
        confirmText="Archive"
        confirmIcon={Archive}
      />
    </div>
  )
}
