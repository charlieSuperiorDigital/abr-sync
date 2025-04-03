'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { Task as ApiTask } from '@/app/api/functions/tasks'
import { useTasksContext } from '../layout'

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
  RelatedToCell,
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

import { Task } from '@/app/types/task'
import { EditTaskModal } from '@/components/custom-components/task-modal/edit-task-modal'
import * as deleteTaskModal from '@/components/custom-components/task-modal/delete-task-modal'

// Function to map API task format to app task format
const mapApiTaskToAppTask = (apiTask: ApiTask): Task => {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    priority: {
      variant: getPriorityVariant(apiTask.priority),
      text: apiTask.priority as any
    },
    createdBy: apiTask.assignedUser?.name || 'Unknown',
    createdDate: apiTask.createdAt,
    dueDateTime: apiTask.dueDate,
    relatedTo: [],
    email: '',
    phone: '',
    message: '',
    status: apiTask.status as any,
    assignedTo: apiTask.assignedTo
  };
};

// Helper function to determine priority variant
const getPriorityVariant = (priority: string): 'danger' | 'warning' | 'success' | 'slate' => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'danger';
    case 'high':
      return 'warning';
    case 'normal':
      return 'success';
    case 'low':
    default:
      return 'slate';
  }
};

export default function MyTasks() {
  // Get tasks data from context
  const { assignedTasks, isLoadingAssigned, errorAssigned } = useTasksContext()
  
  // Transform API tasks to app task format and filter out completed tasks
  const tasks = assignedTasks 
    ? assignedTasks
        .map(mapApiTaskToAppTask)
        .filter(task => 
          task.status?.toLowerCase() !== 'completed'
        )
    : []

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
        currentUser={''}
      />,
    },
    {
      accessorKey: 'createdDate',
      header: 'Created Date',
      cell: ({ row }) => 
      <FriendlyDateCell date={row.original.createdDate || ''} 
      />,
      
    },
    {
      accessorKey: 'dueDateTime',
      header: 'DUE',
      cell: ({ row }) => 
      <FriendlyDateCell   
        date={row.original.dueDateTime} 
        variant='due' 
      />,
      
    },
    {
      accessorKey: 'relatedTo',
      header: 'Related To',
      cell: ({ row }) => <RelatedToCell relatedObjects={row.original.relatedTo} />,
      
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="flex justify-end items-center space-x-2">
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
          {
            label: 'Delete',
            onClick: () => console.log('Delete Task:', row.original.id),
            variant: 'secondary',
            icon: 'delete',
            _component: 
              <deleteTaskModal.DeleteTaskModal 
              title={'Are you sure you want to delete this task?'}
              children={undefined} 
              />
          },
          {
            label: 'Edit',
            onClick: () => console.log('Edit Task:', row.original.id),
            variant: 'secondary',
            icon: 'edit',
            _component: 
              <EditTaskModal 
                title={'Edit Task'}
                taskId={row.original.id}
                children={undefined} 
              />
          }

        ]}
      />,
    }
    
  ]

  return (
    <div className="w-full">
      {isLoadingAssigned ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading tasks...</p>
        </div>
      ) : errorAssigned ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">{errorAssigned.message}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={tasks}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 30, 40, 50]}
          showPageSize={true}
        />
      )}
    </div>
  )
}
