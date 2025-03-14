'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'

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
import ContactInfo from '@/app/[locale]/custom-components/contact-info'

import { mockTasks } from '../../../../../mocks/tasks.mock'
import { useTaskStore } from '@/app/stores/task-store'
import { Task } from '@/app/types/task'
import EditTaskModal from '@/components/custom-components/task-modal/edit-task-modal'
import DeleteTaskModal from '@/components/custom-components/task-modal/delete-task-modal'

export default function NewOpportunities() {
  
  const { getTasksByAssignee } = useTaskStore()
  
  
  const columns: ColumnDef<Task>[] = [
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
          <div 
                    data-testid="contact-info" 
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      // handleContactClick(row.original)
                    }}
                  >
                    <ContactInfo />
                  </div>
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
          // {
          //   label: 'Delete',
          //   onClick: () => console.log('Delete Task:', row.original.id),
          //   variant: 'secondary',
          //   icon: 'delete'},
          {
            label: 'Delete',
            onClick: () => console.log('Delete Task:', row.original.id),
            variant: 'secondary',
            icon: 'delete',
            _component: 
              <DeleteTaskModal 
              title={'Are you sure you want to delete this task?'}
              children={undefined} 
              isOpen={false} 
              onOpenChange={function (open: boolean): void {
              throw new Error('Function not implemented.')
            } }/>
          },
          {
            label: 'Edit',
            onClick: () => console.log('Edit Task:', row.original.id),
            variant: 'secondary',
            icon: 'edit',
            _component: 
              <EditTaskModal 
              title={'Edit Task'}
              children={undefined} 
              isOpen={false} 
              onOpenChange={function (open: boolean): void {
              throw new Error('Function not implemented.')
            } }/>
          }

        ]}
      />,
    }
    
  ]




  //get tasks from the store
  const tasks = getTasksByAssignee('123456');

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={tasks}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
