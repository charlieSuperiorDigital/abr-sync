'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { mockTasks, MyTasks } from './mock/mock-data'
import {
  ActionButtonCell,
  ActionsCell,
  AutoCell,
  ContactMethodCell,
  CreatedByCell,
  DateCell,
  DescriptionCell,
  FriendlyDateCell,
  PriorityBadgeCell,
  StatusBadgeCell,
  SummaryCell,
  TitleCell,
  UploadTimeCell,
  VehicleCell,
  WarningCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { MessageSquareMore, PanelTop } from 'lucide-react'

export default function NewOpportunities() {
  const columns: ColumnDef<MyTasks>[] = [
    {
      accessorKey: 'id',
      header: 'Task ID',
      
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => 
      <PriorityBadgeCell 
        variant={row.original.priority.variant}
        priority={row.original.priority.text} 
      />,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <TitleCell title={row.original.title} />,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <DescriptionCell description={row.original.description} />,
      
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => 
      <CreatedByCell 
        createdBy={row.original.createdBy} 
        currentUser={'Charlie Thompson'}//To Do: Get Current User
      />,
    },
    {
      accessorKey: 'createdDate',
      header: 'Created Date',
      cell: ({ row }) => 
      <FriendlyDateCell date={row.original.createdDate} 
      />,
      
    },
    {
      accessorKey: 'due',
      header: 'DUE',
      cell: ({ row }) => 
      <FriendlyDateCell   
        date={row.original.due} 
        variant='due' 
      />,
      
    },
    {
      accessorKey: 'relatedTo',
      header: 'Related To',
      
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-2">
          <WarningCell
            message={row.original.warningMessage || ''}
          />
          <ContactMethodCell
            email={row.original.email}
            phone={row.original.phone}
            messages={row.original.message}
          />
        </div>
      ),
    },
    {
      id: 'done',
      header: '',
      cell: ({ row }) => 
        <ActionButtonCell
        label='Done'
        onClick={() => console.log('Done Task:', row.original.id)}
        />
      
      ,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => 
      <ActionsCell
        actions={[
          {
            label: 'Delete',
            onClick: () => console.log('Delete Task:', row.original.id),
            variant: 'secondary',
            icon: 'delete'},
          {
            label: 'Edit',
            onClick: () => console.log('Edit Task:', row.original.id),
            variant: 'secondary',
            icon: 'edit'
          }
        ]}
      />,
    }
    
  ]
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={mockTasks}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
