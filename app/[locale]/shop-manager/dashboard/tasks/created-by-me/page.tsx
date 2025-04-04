'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { Task as ApiTask } from '@/app/api/functions/tasks'
import { useTasksContext } from '@/app/context/tasks-context'

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

import { Task, TaskRelation } from '@/app/types/task'
import { EditTaskModal } from '@/components/custom-components/task-modal/edit-task-modal'
import { ConfirmTaskDoneModal } from '@/components/custom-components/task-modal/confirm-task-done-modal'
import * as deleteTaskModal from '@/components/custom-components/task-modal/delete-task-modal'

// Function to map API task format to app task format
const mapApiTaskToAppTask = (apiTask: ApiTask): Task => {
  // Convert priority string to object format if needed
  const priorityObj = typeof apiTask.priority === 'string'
    ? {
      variant: getPriorityVariant(apiTask.priority),
      text: apiTask.priority as 'Urgent' | 'High' | 'Normal' | 'Low'
    }
    : apiTask.priority;

  return {
    id: apiTask.id,
    tenantId: apiTask.tenantId || '',
    title: apiTask.title,
    description: apiTask.description,
    priority: priorityObj,
    createdBy: apiTask.createdBy || '',
    createdByUser: apiTask.createdByUser,
    createdAt: apiTask.createdAt,
    updatedAt: apiTask.updatedAt,
    dueDate: apiTask.dueDate,
    dueDateTime: apiTask.dueDate, // For backward compatibility
    status: apiTask.status as 'open' | 'in_progress' | 'completed' | 'archived',
    assignedTo: apiTask.assignedTo,
    assignedUser: apiTask.assignedUser,
    workfileId: apiTask.workfileId,
    workfile: apiTask.workfile,
    locationId: apiTask.locationId,
    location: apiTask.location,
    type: apiTask.type || 'One-time',
    endDate: apiTask.endDate,
    roles: apiTask.roles,
    // Default values for backward compatibility
    relatedTo: [] as TaskRelation[],
    email: '',
    phone: '',
    message: ''
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

export default function CreatedByMe() {
  // Get tasks data from context
  const { createdTasks, isLoadingCreated, errorCreated } = useTasksContext()

  // Transform API tasks to app task format and filter for non-completed tasks only
  const tasks = createdTasks 
    ? createdTasks
        .map(mapApiTaskToAppTask)
        .filter(task => 
          task.status?.toLowerCase() !== 'done' && task.status?.toLowerCase() !== 'completed'
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
      cell: ({ row }) => {
        const priority = row.original.priority;
        const variant = typeof priority === 'string'
          ? getPriorityVariant(priority)
          : priority.variant;
        const text = typeof priority === 'string'
          ? priority
          : priority.text;

        return (
          <PriorityBadgeCell
            variant={variant}
            priority={text}
          />
        );
      }
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
      accessorKey: 'assignedTo',
      header: 'Assigned To',
      cell: ({ row }) =>
        <CreatedByCell
          createdBy={(row.original.assignedUser?.firstName! + ' ' + row.original.assignedUser?.lastName) || ''}
          currentUser={''}
        />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
      cell: ({ row }) =>
        <FriendlyDateCell date={row.original.createdAt || ''}
        />,

    },
    {
      accessorKey: 'dueDate',
      header: 'DUE',
      cell: ({ row }) =>
        <FriendlyDateCell
          date={row.original.dueDate}
          variant='due'
        />,

    },
    {
      accessorKey: 'relatedTo',
      header: 'Related To',
      cell: ({ row }) => {
        const relatedObjects = row.original.relatedTo || [];
        return <RelatedToCell relatedObjects={relatedObjects as any} />;
      },

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
      cell: ({ row }) => (
        <ConfirmTaskDoneModal 
          taskId={row.original.id} 
          taskTitle={row.original.title}
        />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        // Get the original API task for this row
        const originalApiTask = createdTasks?.find(task => task.id === row.original.id);
        
        return (
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
                    task={originalApiTask || row.original}
                    children={undefined}
                  />
              }
            ]}
          />
        );
      }
    }
  ]

  return (
    <div className="w-full">
      {isLoadingCreated ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading tasks...</p>
        </div>
      ) : errorCreated ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">{errorCreated.message}</p>
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
