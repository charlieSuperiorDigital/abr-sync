// opportunityColumns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Opportunity } from '@/app/types/opportunity'
import { Archive, Plus } from 'lucide-react'
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

interface OpportunityColumnDependencies {
  handleContactClick: (opportunity: Opportunity) => void
  handleArchiveClick: (opportunity: Opportunity) => void
  formatDate: (date: string | undefined) => string
  archiveConfirmationOpportunityId: string | undefined
}

// Function that returns the column definitions
export const getOpportunityColumns = (
  deps: OpportunityColumnDependencies
): ColumnDef<Opportunity>[] => {
  const {
    handleContactClick,
    handleArchiveClick,
    formatDate,

    archiveConfirmationOpportunityId,
  } = deps

  return [
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={row.original.vehicle.year.toString()}
          imageUrl={
            row.original.vehicle.photos &&
            row.original.vehicle.photos.length > 0
              ? row.original.vehicle.photos[0].url
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
      accessorKey: 'insurance.company',
      header: 'Insurance',
      cell: ({ row }) => (
        <span
          className={`whitespace-nowrap font-bold ${row.original.insurance.company === 'PROGRESSIVE' ? 'text-blue-700' : ''}`}
        >
          {row.original.insurance.company.toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.owner.name}</span>
      ),
    },
    {
      accessorKey: 'isInRental',
      header: 'In Rental',
      cell: ({ row }) =>
        row.original.isInRental ? (
          <StatusBadge variant="success" size="sm">
            YES
          </StatusBadge>
        ) : (
          <StatusBadge variant="neutral" size="sm">
            NO
          </StatusBadge>
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
        const warning = row.original.parts?.warning
        if (!warning) return null

        let variant: 'warning' | 'danger' = 'warning'
        let text: string = ''

        if (warning === 'ORDERED') {
          variant = 'warning'
          text = 'ORDERED'
        } else if (warning === 'UPDATED') {
          variant = 'danger'
          text = 'UPDATED'
        } else {
          return null
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
        )
      },
    },
    {
      id: 'uploadDeadline',
      header: 'Upload Deadline',
      cell: ({ row }) =>
        row.original.uploadDeadline ? (
          <UploadTimeCell deadline={row.original.uploadDeadline} />
        ) : (
          <span className="text-gray-400">---</span>
        ),
    },
    {
      id: 'lastCommDate',
      header: 'Last Communication',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDate(row.original.lastUpdatedDate)}
        </span>
      ),
    },
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
