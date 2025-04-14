'use client'

import { Search as SearchIcon } from 'lucide-react'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { AutoCell, StatusBadgeCell, SummaryCell, UploadTimeCell, VehicleCell } from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { OpportunityResponse } from '@/app/api/functions/opportunities'
import { WorkfileApiResponse } from '@/app/types/workfile'
import { useSession } from 'next-auth/react'
import { useGetOpportunities } from '@/app/api/hooks/useGetOpportunities'
import { useGetWorkfiles } from '@/app/api/hooks/useGetWorkfiles'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SearchPage() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId

  // Get opportunities and workfiles data
  const {
    newOpportunities,
    estimateOpportunities,
    secondCallOpportunities,
    totalLossOpportunities,
    archivedOpportunities,
    error: opportunitiesError
  } = useGetOpportunities({ tenantId: tenantId! })
  const {
    upcoming,
    inProgress,
    qualityControl,
    readyForPickup,
    sublets,
    labor,
    reports,
    archive,
    error: workfilesError
  } = useGetWorkfiles({ tenantId: tenantId! })

  // Combine all opportunities and workfiles
  const allOpportunities = [...(newOpportunities || []), ...(estimateOpportunities || []), ...(secondCallOpportunities || []), ...(totalLossOpportunities || []), ...(archivedOpportunities || [])]
  const allWorkfiles = [...(upcoming || []), ...(inProgress || []), ...(qualityControl || []), ...(readyForPickup || []), ...(sublets || []), ...(labor || []), ...(reports || []), ...(archive || [])]

  const [searchTerm, setSearchTerm] = useState('')

  // Type guard to check if a row is an OpportunityResponse
  const isOpportunity = (row: OpportunityResponse | WorkfileApiResponse): row is OpportunityResponse => {
    return (row as OpportunityResponse).opportunityId !== undefined;
  };

  // Type guard to check if a row is a WorkfileApiResponse
  const isWorkfile = (row: OpportunityResponse | WorkfileApiResponse): row is WorkfileApiResponse => {
    return (row as WorkfileApiResponse).id !== undefined;
  };

  const searchFields = (row: OpportunityResponse | WorkfileApiResponse) => {
    if (isOpportunity(row)) {
      return [
        row.opportunityId,
        row.opportunityStatus,
        row.vehicleMake,
        row.vehicleModel,
        row.vehicleYear.toString(),
        row.vehicleVin,
        row.insuranceName,
        row.insuranceClaimNumber,
        row.insurancePolicyNumber,
        `${row.ownerFirstName} ${row.ownerLastName}`,
        row.ownerPhone,
        row.ownerEmail,
        row.ownerAddress
      ];
    } else if (isWorkfile(row)) {
      return [
        row.id,
        row.status,
        row.opportunity.vehicleId,
        row.opportunity.vehicleId,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ];
    }
    return [];
  };

  const matchesSearch = (row: OpportunityResponse | WorkfileApiResponse) => {
    if (!searchTerm) return false
    const searchLower = searchTerm.toLowerCase()
    return searchFields(row).some(field =>
      field && field.toString().toLowerCase().includes(searchLower)
    )
  }

  // Filter opportunities and workfiles separately
  const filteredOpportunities = allOpportunities.filter(matchesSearch as (row: OpportunityResponse) => boolean)
  const filteredWorkfiles = allWorkfiles.filter(matchesSearch as (row: WorkfileApiResponse) => boolean)

  // Only show results when searching
  const showResults = searchTerm !== ''

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const columns: ColumnDef<OpportunityResponse>[] = [
    {
      accessorKey: 'opportunityId',
      header: 'Opportunity ID',
      cell: ({ row }) => <AutoCell  />
    },
    {
      accessorKey: 'opportunityStatus',
      header: 'Status',
      cell: ({ row }) => <StatusBadgeCell status={row.original.opportunityStatus} />
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          year={row.original.vehicleYear.toString()}
          make={row.original.vehicleMake}
          model={row.original.vehicleModel}
          imageUrl={row.original.vehiclePhotos?.[0]?.url}
        />
      )
    },
    {
      accessorKey: 'insurance',
      header: 'Insurance',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span>{row.original.insuranceName}</span>
          <span className="text-sm text-muted-foreground">
            {row.original.insuranceClaimNumber}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span>{`${row.original.ownerFirstName} ${row.original.ownerLastName}`}</span>
          <span className="text-sm text-muted-foreground">
            {row.original.ownerPhone}
          </span>
        </div>
      )
    },
    {
      header: 'Summary',
      cell: ({ row }) => <SummaryCell text={row.original.lastCommunicationSummary || 'No communication summary available.'} />
    },
  ]

  const workfileColumns: ColumnDef<WorkfileApiResponse>[] = [
    {
      accessorKey: 'id',
      header: 'Workfile ID',
      cell: ({ row }) => <AutoCell  />
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadgeCell status={row.original.status} />
    },
    {
      accessorKey: 'opportunity',
      header: 'Opportunity',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span>{row.original.opportunityId}</span>
          <span className="text-sm text-muted-foreground">
            {row.original.opportunity.status}
          </span>
        </div>
      )
    },
    {
      header: 'Vehicle',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span>{row.original.opportunity.vehicleId}</span>
          <span className="text-sm text-muted-foreground">
            {row.original.opportunity.vehicleId}
          </span>
        </div>
      )
    },
    {
      header: 'Insurance',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span>---</span>
          <span className="text-sm text-muted-foreground">---</span>
        </div>
      )
    },
    {
      header: 'Owner',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span>---</span>
          <span className="text-sm text-muted-foreground">---</span>
        </div>
      )
    },
    {
      header: 'Summary',
      cell: ({ row }) => <SummaryCell text="No communication summary available." />
    },
  ]

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Search</h1>
        <div className="p-2 w-full bg-gray-200 rounded-lg">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleClearSearch} disabled={!searchTerm}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {showResults && (
        <>
          {filteredOpportunities.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Opportunities</h2>
              <DataTable
                data={filteredOpportunities}
                columns={columns}
              />
            </div>
          )}

          {filteredWorkfiles.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">Workfiles</h2>
              <DataTable
                data={filteredWorkfiles}
                columns={workfileColumns}
              />
            </div>
          )}

          {filteredOpportunities.length === 0 && filteredWorkfiles.length === 0 && (
            <div className="py-8 text-center">
              <p>No results found for "{searchTerm}"</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Helper function to format dates
function formatDate(date: string | undefined): string {
  if (!date) return '---'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
