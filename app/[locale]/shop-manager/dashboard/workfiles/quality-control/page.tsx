'use client'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import { useGetWorkfiles } from '@/app/api/hooks/useGetWorkfiles'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import { Opportunity } from '@/app/types/opportunity'
import { QualityControlStatus, WorkfileApiResponse } from '@/app/types/workfile'
import { formatDate } from '@/app/utils/date-utils'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import QCChecklistBottomSheet from '@/components/custom-components/qc-checklist-modal'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardCheck, ClipboardPlus, MessageSquareMore } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'

export default function QualityControl() {
  const { data: session } = useSession();
  const tenantId = session?.user?.tenantId;


  const { opportunities: allOpportunities, isLoading: isOpportunitiesLoading } = useGetOpportunities({ tenantId: tenantId || '' });
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQCChecklistOpen, setIsQCChecklistOpen] = useState(false);
  const [selectedQCWorkfile, setSelectedQCWorkfile] = useState<WorkfileApiResponse | null>(null);
  const [selectedWorkfile, setSelectedWorkfile] = useState<WorkfileApiResponse | null>(null);

  const { qualityControl: qcWorkfiles, isLoading, error } = useGetWorkfiles({ tenantId: tenantId || '' });

  const handleRowClick = useCallback((workfile: WorkfileApiResponse) => {
    setSelectedWorkfile(workfile);
    // Find the matching opportunity by opportunityId
    if (allOpportunities && workfile.workfile.opportunityId) {
      const foundRaw = allOpportunities.find((opp) => opp.opportunityId === workfile.workfile.opportunityId);
      setSelectedOpportunity(foundRaw ? mapApiResponseToOpportunity(foundRaw) : null);
    } else {
      setSelectedOpportunity(null);
    }
    setIsModalOpen(true);
  }, [allOpportunities]);

  const handleContactClick = useCallback((workfile: WorkfileApiResponse) => {
    // Handle contact info click
    console.log('Contact clicked for workfile:', workfile.workfile.id)
  }, [])

  const handleTaskClick = useCallback((workfile: WorkfileApiResponse) => {
    // Handle task button click
    console.log('Task clicked for workfile:', workfile.workfile.id)
  }, [])

  const handleQCChecklistClick = useCallback((workfile: WorkfileApiResponse, e: React.MouseEvent) => {
    e.stopPropagation()
    // Open QC checklist modal
    setSelectedQCWorkfile(workfile)
    setIsQCChecklistOpen(true)
  }, [])

  const columns: ColumnDef<WorkfileApiResponse, any>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.workfile.id || '---'}</span>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.workfile.opportunity.vehicle.make || 'No Make'}
          model={row.original.workfile.opportunity.vehicle.model || 'No Model'}
          year={String(row.original.workfile.opportunity.vehicle.year) || 'No Year'}
          imageUrl={`https://picsum.photos/seed/${row.original.workfile.opportunityId}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.workfile.opportunity.vehicle.owner.firstName + ' ' + row.original.workfile.opportunity.vehicle.owner.lastName || '---'}
        </span>
      ),
    },
    // // {
    // //   accessorKey: 'qualityControl.status',
    // //   header: 'QC Status',
    // //   cell: ({ row }) => {
    // //     const status = row.original.workfile. || QualityControlStatus.AWAITING;
    // //     return (
    // //       <div className="flex gap-2 items-center">
    // //         <StatusBadge 
    // //           variant={status === QualityControlStatus.COMPLETED ? 'success' : 'warning'} 
    // //           size="sm"
    // //         >
    // //           {status}
    // //         </StatusBadge>
    // //         {status === QualityControlStatus.AWAITING && (
    // //           <DarkButton 
    // //             buttonText="QC Checklist" 
    // //             buttonIcon={<ClipboardCheck size={16} />}
    // //             onClick={(e) => handleQCChecklistClick(row.original, e)}
    // //           />
    // //         )}
    // //       </div>
    // //     );
    // //   },
    // // },
    // {
    //   accessorKey: 'opportunity.qualityControl.completionDate',
    //   header: 'QC Date',
    //   cell: ({ row }) => (
    //     <span className="whitespace-nowrap">
    //       {formatDate(row.original.qualityControl?.completionDate) || '---'}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: 'estimatedCompletionDate',
    //   header: 'ECD',
    //   cell: ({ row }) => (
    //     <span className="whitespace-nowrap">
    //       {formatDate(row.original.estimatedCompletionDate) || '---'}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: 'qualityControl.assignedTo',
    //   header: 'QC Assigned To',
    //   cell: ({ row }) => (
    //     <span className="whitespace-nowrap">
    //       {row.original.qualityControl?.assignedTo || '---'}
    //     </span>
    //   ),
    // },
    // {
    //   id: 'lastCommDate',
    //   header: 'Last Comm Date',
    //   cell: ({ row }) => (
    //     <span className="whitespace-nowrap">{formatDate(row.original.updatedAt)}</span>
    //   ),
    // },
    // {
    //   header: 'Summary',
    //   cell: ({ row }) => (
    //     <RoundButtonWithTooltip 
    //       buttonIcon={<MessageSquareMore className="w-5 h-5" />}
    //       tooltipText={row.original.opportunity.summary || 'No summary available'}
    //     />
    //   ),
    // },
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

  if (isLoading || isOpportunitiesLoading) {
    return <div className="flex justify-center items-center h-64">Loading workfiles...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64">Error loading workfiles: {error.message}</div>;
  }

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
        title={selectedOpportunity ? `${selectedOpportunity.vehicle?.year || ''} ${selectedOpportunity.vehicle?.make || ''} ${selectedOpportunity.vehicle?.model || ''}` : ''}
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
