'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  AutoCell,
  StatusBadgeCell,
  SummaryCell,
  UploadTimeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ContactData, ContactMethod } from '@/app/types/contact-info.types'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus, Paperclip, Plus } from 'lucide-react'
import { Opportunity, OpportunityStatus, PartsWarningStatus } from '@/app/types/opportunity'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useGetOpportunities } from '@/app/api/hooks/useGetOpportunities'
import dynamic from "next/dynamic";
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge';
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'

const PdfPreview = dynamic(() => import("@/app/[locale]/custom-components/pdf-preview"), {
  ssr: false,
});

export default function EstimateOpportunities() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  const { estimateOpportunities, isLoading } = useGetOpportunities({ tenantId: tenantId! })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)

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

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const columns: ColumnDef<Opportunity, any>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO Number',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.roNumber || '---'}</span>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={String(row.original.vehicle.year)}
          imageUrl={`https://picsum.photos/seed/${row.original.opportunityId}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'file',
      header: 'FILE',
      cell: ({ row }) => (
        <PdfPreview  />
      )
    },
    {
      accessorKey: 'parts',
      header: 'PARTS',
      cell: ({ row }) => {
        const parts = row.original.parts
        if (!parts) return '---'
        
        return (
          <div className="flex gap-2 items-center">
            <span>{parts.count}</span>
            {parts.warning && (
              <StatusBadge
                variant={parts.warning === 'ORDERED' ? 'success' : 'danger'}
                size="sm"
              >
                {parts.warning}
              </StatusBadge>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'isInRental',
      header: 'In Rental',
      cell: ({ row }) => (row.original.isInRental ? <AutoCell /> : null),
    },
    {
      accessorKey: 'priority',
      header: 'PRIORITY'
    },
    {
      header: 'Summary',
      cell: ({ row }) => <SummaryCell text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' />,
    },
    {
      accessorKey: 'warning',
      header: 'Warning',
      cell: ({ row }) => {
        const warning = row.original.warning;
        if (!warning || !warning.message) return null;

        // Determine variant and text based on warning type
        let variant: 'warning' | 'danger' | 'pending';
        let text: string;

        if (warning.type === 'MISSING_VOR') {
          variant = 'danger';
          text = 'OVERDUE';
        } else if (warning.type === 'UPDATED_IN_CCC') {
          variant = 'warning';
          text = 'URGENT';
        } else {
          variant = 'pending';
          text = 'PENDING';
        }

        return (
          <div title={warning.message}>
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
      accessorKey: 'insuranceApproval',
      header: 'INSURANCE APPROVAL',
      cell: ({ row }) => {
        const insurance = row.original.insurance;
        if (insurance.approved === undefined) {
          return (
            <StatusBadge variant="pending" size="sm">
              PENDING APPROVAL
            </StatusBadge>
          );
        }
        return (
          <StatusBadge
            variant={insurance.approved ? 'success' : 'danger'}
            size="sm"
          >
            {insurance.approved ? 'APPROVED' : 'REJECTED'}
          </StatusBadge>
        );
      }
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => {
        const opportunity = row.original;
        const owner = opportunity.owner;
        const insurance = opportunity.insurance;
        
        // Determine preferred contact method based on opportunity data
        let preferredContactMethod;
        if (owner.email) preferredContactMethod = ContactMethod.email;
        else if (owner.phone) preferredContactMethod = ContactMethod.phone;
        else preferredContactMethod = ContactMethod.message;

        const contactData: ContactData = {
          person: {
            name: owner.name,
            role: owner.company ? `${owner.company} Representative` : 'Vehicle Owner',
            address: `${owner.address}, ${owner.city}, ${owner.state} ${owner.zip}`,
            company: owner.company || 'N/A',
            preferredContactType: preferredContactMethod
          },
          insurance: {
            company: insurance.company,
            representative: insurance.representative || 'Not Assigned',
            pendingEstimates: 1, // Default to 1 since this is an active opportunity
            pendingReimbursements: 0, // Could be updated based on actual data
            updates: insurance.approved === undefined ? 'Pending Approval' :
                    insurance.approved ? 'Estimate Approved' : 'Estimate Rejected'
          },
          communicationLogs: (opportunity.logs || []).map(log => ({
            ...log,
            isAutomatic: log.type === 'email' // Assume emails are automatic, other types are manual
          })),
          emailContacts: [
            {
              email: owner.email || 'No email provided',
              isPrimary: true
            },
            {
              email: insurance.adjusterEmail || 'No adjuster email',
              isPrimary: false
            }
          ].filter(contact => contact.email !== 'No email provided' && contact.email !== 'No adjuster email'),
          attachmentOptions: [
            {
              name: 'Estimate',
              category: 'Documents',
              checked: false
            },
            {
              name: 'Vehicle Photos',
              category: 'Images',
              checked: false
            }
          ]
        };

        return (
          <div 
            data-testid="contact-info" 
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              handleContactClick(opportunity)
            }}
          >
            <ContactInfo 
              preferredContactMethod={preferredContactMethod}
              contactData={contactData}
            />
          </div>
        );
      },
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
  ]

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading opportunities...</div>
  }

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={estimateOpportunities.map(mapApiResponseToOpportunity)}
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
    </div>
  )
}
