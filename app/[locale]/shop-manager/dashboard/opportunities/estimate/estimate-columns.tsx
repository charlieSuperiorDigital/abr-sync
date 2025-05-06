// src/app/[locale]/components/estimate-opportunities/estimateColumns.tsx

import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ContactData, ContactMethod } from '@/app/types/contact-info.types'
import { OpportunityResponse } from '@/app/types/opportunities'
import {
  AutoCell,
  SummaryCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'

type GetEstimateColumnsProps = {
  handleContactClick: (opportunity: OpportunityResponse) => void
  PdfPreviewComponent: React.ComponentType
}

export const getEstimateColumns = ({
  handleContactClick,
  PdfPreviewComponent,
}: GetEstimateColumnsProps): ColumnDef<OpportunityResponse, any>[] => {
  return [
    {
      accessorKey: 'roNumber',
      header: 'RO Number',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {/* {row.original.roNumber || '---'} */}
          {row.original.opportunityId || '---'}
        </span>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicleMake}
          model={row.original.vehicleModel}
          year={String(row.original.vehicleYear)}
          imageUrl={`https://picsum.photos/seed/${row.original.opportunityId}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'file',
      header: 'FILE',
      cell: ({ row }) => (
        // Renderiza el componente dinámico pasado como prop
        <PdfPreviewComponent />
      ),
    },
    {
      accessorKey: 'parts',
      header: 'PARTS',
      cell: ({ row }) => {
        // const parts = row.original.parts
        // if (!parts) return '---'

        return (
          <div className="flex gap-2 items-center">
            {/* <span>{parts.count}</span> */}
            <span>{"16"}</span>
           
              <StatusBadge
                variant="success"
                size="sm"
              >
                {"ORDERED"}
              </StatusBadge>
            
          </div>
          // <div className="flex gap-2 items-center">
          //   <span>{parts.count}</span>
          //   {parts.warning && (
          //     <StatusBadge
          //       variant={parts.warning === 'ORDERED' ? 'success' : 'danger'}
          //       size="sm"
          //     >
          //       {parts.warning}
          //     </StatusBadge>
          //   )}
          // </div>
        )
      },
    },
    {
      accessorKey: 'isInRental',
      header: 'In Rental',
      cell: ({ row }) => ( <AutoCell /> ),
      // cell: ({ row }) => (row.original.inRental ? <AutoCell /> : null),
    },
    {
      accessorKey: 'priority',
      header: 'PRIORITY',
      // Assuming priority is a simple value display
    },
    {
      header: 'Summary',
      cell: ({ row }) => (
        <SummaryCell text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
      ),
    },
    {
      accessorKey: 'warning',
      header: 'Warning',
      cell: ({ row }) => {
        // // const warning = row.original.warning
        // // if (!warning || !warning.message) return null

        // // let variant: 'warning' | 'danger' | 'pending'
        // // let text: string

        // // if (warning.type === 'MISSING_VOR') {
        // //   variant = 'danger'
        // //   text = 'OVERDUE'
        // // } else if (warning.type === 'UPDATED_IN_CCC') {
        // //   variant = 'warning'
        // //   text = 'URGENT'
        // // } else {
        // //   variant = 'pending'
        // //   text = 'PENDING'
        // // }

        // return (
        //   <div title={warning.message}>
        //     <StatusBadge
        //       variant={variant}
        //       size="sm"
        //       className="whitespace-nowrap"
        //     >
        //       {text}
        //     </StatusBadge>
        //   </div>
        // )
        return (
          <div title={'warning.message'}>
            <StatusBadge
              variant={'danger'}
              size="sm"
              className="whitespace-nowrap"
            >
              {'OVERDUE'}
            </StatusBadge>
          </div>
        )
      },
    },
    {
      accessorKey: 'insuranceApproval',
      header: 'INSURANCE APPROVAL',
      cell: ({ row }) => {
        
        if (row.original.opportunityStatus === undefined) {
          return (
            <StatusBadge variant="pending" size="sm">
              PENDING APPROVAL
            </StatusBadge>
          )
        }
        return (
          <StatusBadge
            variant={row.original.opportunityStatus === 'APPROVED' ? 'success' : 'danger'}
            size="sm"
          >
            {row.original.opportunityStatus === 'APPROVED' ? 'APPROVED' : 'REJECTED'}
          </StatusBadge>
        )
      },
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => {
      

        // Determine preferred contact method based on opportunity data
        let preferredContactMethod
        if (row.original.ownerEmail) preferredContactMethod = ContactMethod.email
        else if (row.original.ownerPhone) preferredContactMethod = ContactMethod.phone
        else preferredContactMethod = ContactMethod.message

        const contactData: ContactData = {
          person: {
            name: row.original.ownerFirstName + " " + row.original.ownerLastName,
            role: "Test Company Representative",
            address: "123 Test St, Test City, Test State 12345",
            company: "Test Company",
            preferredContactType: preferredContactMethod,
            // name: row.original.ownerFirstName + " " + row.original.ownerLastName,
            // role: row.original.owner.company 
            //   ? `${row.original.owner.company} Representative`
            //   : 'Vehicle Owner',
            // address: `${row.original.ownerAddress}, ${row.original.owner}, ${row.original.ownerState} ${row.original.ownerZip}`,
            // company: row.original.owner.company || 'N/A',
            // preferredContactType: preferredContactMethod,
          },
          insurance: {
            company: row.original.insuranceName,
            representative: row.original.insuranceProvider || 'Not Assigned',
            pendingEstimates: 1,
            pendingReimbursements: 0,
            updates:
              row.original.opportunityStatus === undefined
                ? 'Pending Approval'
                : row.original.opportunityStatus === 'APPROVED'
                  ? 'Estimate Approved'
                  : 'Estimate Rejected',
          },
          communicationLogs: [],
          // communicationLogs: (row.original.logs || []).map((log) => ({
          //   ...log,
          //   isAutomatic: log.type === 'email',
          // })),
          emailContacts: [
            {
              email: row.original.ownerEmail || 'No email provided',
              isPrimary: true,
            },
            {
              email: row.original.insuranceAdjusterEmail || 'No adjuster email',
              isPrimary: false,
            },
          ].filter(
            (contact) =>
              contact.email !== 'No email provided' &&
              contact.email !== 'No adjuster email'
          ),
          attachmentOptions: [
            {
              id: '1',
              name: 'Estimate.pdf',
              category: 'Estimate',
              size: '1.2 MB',
              checked: false,
              email: row.original.ownerEmail || 'No email provided',
              isPrimary: true,
            },
            {
              id: '2',
              name: 'Vehicle_Photos.zip',
              category: 'Photos',
              size: '3.5 MB',
              checked: false,
              email: row.original.ownerEmail || 'No email provided',
              isPrimary: true,
            },
          ],
        }

        return (
          <div
            data-testid="contact-info"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation() // Prevent row click
              handleContactClick(row.original)
            }}
          >
            <ContactInfo
              preferredContactMethod={preferredContactMethod}
              contactData={contactData}
            />
          </div>
        )
      },
    },
    {
      id: 'task',
      header: 'Task',
      cell: ({ row }) => (
        <div
          onClick={(e) => {
            e.stopPropagation() // Prevent row click
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
  ]
}
