// opportunityColumns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { OpportunityResponse } from '@/app/types/opportunities'
import {
  Archive, Plus
} from 'lucide-react'
import {
  SummaryCell,
  UploadTimeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import DateTimePicker from '@/app/[locale]/custom-components/date-time-picker'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'

export interface OpportunityColumnDependencies {
  handleContactClick: (opportunity: OpportunityResponse) => void
  handleArchiveClick: (opportunity: OpportunityResponse) => void
  handleTaskClick: (opportunity: OpportunityResponse) => void
  formatDate: (date: string | undefined) => string
  archiveConfirmationOpportunityId: string | undefined
}

// Function that returns the column definitions
export function getOpportunityColumns({
  handleContactClick,
  handleArchiveClick,
  handleTaskClick,
  formatDate,
  archiveConfirmationOpportunityId,
}: OpportunityColumnDependencies): ColumnDef<OpportunityResponse>[] {
  return [
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicleMake}
          model={row.original.vehicleModel}
          year={row.original.vehicleYear.toString()}
          imageUrl={
            row.original.vehiclePhotos &&
            row.original.vehiclePhotos.length > 0
              ? row.original.vehiclePhotos[0].url
              : `https://picsum.photos/seed/${row.original.opportunityId}/200/100`
          }
        />
      ),
    },
    {
      accessorKey: 'insurance.claimNumber',
      header: 'Claim',
    },
    {
      accessorKey: 'insuranceName',
      header: 'Insurance',
      cell: ({ row }) => (
        <span
          className={`whitespace-nowrap font-bold ${row.original.insuranceName === 'PROGRESSIVE' ? 'text-blue-700' : ''}`}
        >
          {row.original.insuranceName.toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.ownerFirstName} {row.original.ownerLastName}</span>
      ),
    },
    // {
    //   accessorKey: 'isInRental',
    //   header: 'In Rental',
    //   cell: ({ row }) =>
    //     row.original.isInRental ? (
    //       <StatusBadge variant="success" size="sm">
    //         YES
    //       </StatusBadge>
    //     ) : (
    //       <StatusBadge variant="neutral" size="sm">
    //         NO
    //       </StatusBadge>
    //     ),
    // },
    // {
    //   accessorKey: 'dropDate',
    //   header: 'Drop Date',
    //   cell: ({ row }) => (
    //     <DateTimePicker
    //       value={row.original.dropDate}
    //       editable={false}
    //       onOk={(date: Date) => console.log(date)}
    //     />
    //   ),
    // },
    // {
    //   accessorKey: 'parts.warning',
    //   header: 'Parts',
    //   cell: ({ row }) => {
    //     const warning = row.original.parts?.warning
    //     if (!warning) return null

    //     let variant: 'warning' | 'danger' = 'warning'
    //     let text: string = ''

    //     if (warning === 'ORDERED') {
    //       variant = 'warning'
    //       text = 'ORDERED'
    //     } else if (warning === 'UPDATED') {
    //       variant = 'danger'
    //       text = 'UPDATED'
    //     } else {
    //       return null
    //     }

    //     return (
    //       <div>
    //         <StatusBadge
    //           variant={variant}
    //           size="sm"
    //           className="whitespace-nowrap"
    //         >
    //           {text}
    //         </StatusBadge>
    //       </div>
    //     )
    //   },
    // },
    // {
    //   id: 'uploadDeadline',
    //   header: 'Upload Deadline',
    //   cell: ({ row }) =>
    //     row.original.uploadDeadline ? (
    //       <UploadTimeCell deadline={row.original.uploadDeadline} />
    //     ) : (
    //       <span className="text-gray-400">---</span>
    //     ),
    // },
    // {
    //   id: 'lastCommDate',
    //   header: 'Last Communication',
    //   cell: ({ row }) => (
    //     <span className="whitespace-nowrap">
    //       {formatDate(row.original.lastUpdatedDate)}
    //     </span>
    //   ),
    // },
    {
      header: 'Summary',
      cell: ({ row }) => (
        <SummaryCell
          text={
            row.original.lastCommunicationSummary ||
            'No communication summary available.'
          }
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
          <ContactInfo selectedOpportunity={row.original} />
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
            defaultRelation={{
              id: row.original.opportunityId,
              type: 'opportunity',
            }}
            children={<Plus className="m-auto w-5 h-5" />}
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
            buttonText={
              archiveConfirmationOpportunityId === row.original.opportunityId
                ? 'Archiving...'
                : 'Archive'
            }
            buttonIcon={
              archiveConfirmationOpportunityId ===
              row.original.opportunityId ? undefined : (
                <Archive className="mr-2 w-4 h-4" />
              )
            }
            onClick={(e) => {
              e.stopPropagation()
              handleArchiveClick(row.original)
            }}
          />
        </div>
      ),
    },
  ]
}
