'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { mockTasks, MyTasks } from './mock/mock-data'
import {
  AutoCell,
  ContactMethodCell,
  PriorityBadgeCell,
  StatusBadgeCell,
  SummaryCell,
  UploadTimeCell,
  VehicleCell,
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
    },
    {
      accessorKey: 'description',
      header: 'Description',
      
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
    },
    {
      accessorKey: 'createdDate',
      header: 'Created Date',
      
    },
    {
      accessorKey: 'due',
      header: 'DUE',
      
    },
    {
      accessorKey: 'relatedTo',
      header: 'Related To',
      
    },
    {
      header: 'Summary',
      cell: ({ row }) => <SummaryCell />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ContactMethodCell
          email={row.original.email}
          phone={row.original.phone}
          messages={row.original.message}
        />
      ),
    },
    
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
