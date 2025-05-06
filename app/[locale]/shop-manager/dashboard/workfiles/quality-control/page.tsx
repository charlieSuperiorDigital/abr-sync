'use client'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import { useGetWorkfilesByTenantId } from '@/app/api/hooks/useWorkfiles'
import { OpportunityResponse } from '@/app/types/opportunities'
import { WorkfilesByTenantIdResponse } from '@/app/types/workfile'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell
} from '@/components/custom-components/custom-table/table-cells'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import QCChecklistBottomSheet from '@/components/custom-components/qc-checklist-modal'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'

export default function QualityControl() {
  const { data: session } = useSession();
  const tenantId = session?.user?.tenantId;

  const { opportunities: allOpportunities, isLoading: isOpportunitiesLoading } = useGetOpportunities({ tenantId: tenantId || '' });
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityResponse | null>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; opportunityId: string | null }>({
    isOpen: false,
    opportunityId: null
  })
  const [isQCChecklistOpen, setIsQCChecklistOpen] = useState(false);
  const [selectedQCWorkfile, setSelectedQCWorkfile] = useState<WorkfilesByTenantIdResponse | null>(null);
  const [selectedWorkfile, setSelectedWorkfile] = useState<WorkfilesByTenantIdResponse | null>(null);

  const { qualityControl, isLoading } = useGetWorkfilesByTenantId({ tenantId: tenantId || '' });

  const handleRowClick = useCallback((workfile: WorkfilesByTenantIdResponse) => {
    setSelectedWorkfile(workfile);
    setModalState({
      isOpen: true,
      opportunityId: workfile.opportunityId
    })
  }, [])

  const handleModalOpenChange = useCallback((open: boolean) => {
    setModalState(prev => ({ ...prev, isOpen: open }))
  }, [])

  const handleContactClick = useCallback((workfile: WorkfilesByTenantIdResponse) => {
    // Handle contact info click
    console.log('Contact clicked for workfile:', workfile.id)
  }, [])

  const handleTaskClick = useCallback((workfile: WorkfilesByTenantIdResponse) => {
    // Handle task button click
    console.log('Task clicked for workfile:', workfile.id)
  }, [])

  const handleQCChecklistClick = useCallback((workfile: WorkfilesByTenantIdResponse, e: React.MouseEvent) => {
    e.stopPropagation()
    // Open QC checklist modal
    setSelectedQCWorkfile(workfile)
    setIsQCChecklistOpen(true)
  }, [])

  const columns: ColumnDef<WorkfilesByTenantIdResponse, any>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.opportunity.roNumber || '---'}</span>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.opportunity.vehicle?.make || '---'}
          model={row.original.opportunity.vehicle?.model || '---'}
          year={row.original.opportunity.vehicle?.year.toString() || '---'}
          imageUrl={row.original.opportunity.vehicle?.vehiclePicturesUrls[0] || `https://picsum.photos/seed/${row.original.id}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.opportunity.vehicle?.owner ? 
            `${row.original.opportunity.vehicle.owner.firstName} ${row.original.opportunity.vehicle.owner.lastName}` : 
            'Owner Name'}
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

  if (!qualityControl || qualityControl.length === 0) {
    return <div className="flex justify-center items-center h-64">No workfiles found.</div>;
  }

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={qualityControl}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />

      {/* Opportunity Details Modal */}
      <BottomSheetModal
        isOpen={modalState.isOpen}
        onOpenChange={handleModalOpenChange}
        title={selectedWorkfile ? `${selectedWorkfile.opportunity.vehicle?.year} ${selectedWorkfile.opportunity.vehicle?.make} ${selectedWorkfile.opportunity.vehicle?.model}` : ''}
      >
        {modalState.opportunityId && <OpportunityModal opportunityId={modalState.opportunityId} workfileId={selectedWorkfile?.id} />}
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
