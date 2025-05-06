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
import { MessageSquareMore, PanelTop, ChevronDown, Trash2, Pencil } from 'lucide-react'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'

import { Task, TaskRelation } from '@/app/types/task'
import { EditTaskModal } from '@/components/custom-components/task-modal/edit-task-modal'
import { ConfirmTaskDoneModal } from '@/components/custom-components/task-modal/confirm-task-done-modal'
import * as deleteTaskModal from '@/components/custom-components/task-modal/delete-task-modal'

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

interface TaskRow extends Task {
  subRows?: {
    id: string;
    details: React.ReactNode;
  }[];
}

export default function CreatedByMe() {
  // Get tasks data from context
  const { createdTasks, isLoadingCreated, errorCreated } = useTasksContext()
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [hiddenRows, setHiddenRows] = useState<Record<string, boolean>>({})

  // Transform API tasks to app task format and filter for non-completed tasks only
  const tasks = createdTasks
    ? createdTasks
      .filter(task =>
        task.status?.toLowerCase() !== 'done' && task.status?.toLowerCase() !== 'completed'
      )
    : []

  const toggleRow = (taskId: string) => {
    // Toggle expanded state
    setExpandedRows(prev => {
      const newState = {
        ...prev,
        [taskId]: !prev[taskId]
      };
      
      // If we're expanding the row, hide the original row
      // If we're collapsing, show the original row again
      setHiddenRows(prevHidden => ({
        ...prevHidden,
        [taskId]: !prev[taskId] // Hide if expanding, show if collapsing
      }));
      
      return newState;
    });
  }

  const columns: ColumnDef<TaskRow>[] = [
    {
      accessorKey: 'id',
      header: 'Task ID',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <ChevronDown
            className={`w-4 h-4 ${expandedRows[row.original.id] ? 'rotate-180' : ''} transform transition-transform`}
            onClick={(e) => {
              e.stopPropagation()
              toggleRow(row.original.id)
            }}
          />
          <span>{row.original.id}</span>
        </div>
      ),
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
  console.log('tasks', tasks)

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
          onRowClick={(row) => toggleRow(row.id)}
          hiddenRows={hiddenRows}
          getSubRows={(row) => expandedRows[row.id] ? [
            {
              id: `${row.id}-details`,
              details: (
                <div
                  className="px-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleRow(row.id)
                  }}
                >

                  <div className='py-6'>
                    {/* Title and ID */}
                    <div className="flex flex-row justify-between flex-2">
                      <div className="flex gap-8 items-center">
                        <h2 className="text-xl font-bold">{row.title}</h2>
                        <span className="font-medium">ID #{row.id}</span>
                        <span 
                          className={`font-medium px-2 py-1 rounded-full text-white ${
                            typeof row.priority === 'string' 
                              ? 'bg-slate-500' 
                              : row.priority.variant === 'danger' 
                                ? 'bg-red-600' 
                                : row.priority.variant === 'success' 
                                  ? 'bg-[#0F6C40]' 
                                  : row.priority.variant === 'slate' 
                                    ? 'bg-[#6E6E6E]' 
                                    : 'bg-amber-500'
                          }`}
                        >
                          {typeof row.priority === 'string' ? row.priority : row.priority.text}
                        </span>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <button className="bg-black text-white px-4 py-2 rounded-full">
                          {row.status === 'open' ? 'Mark as done' : 'Done'}
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-200">
                          <Pencil className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>



                  {/* Main information */}
                  <div className='py-4 border-t border-slate-200 flex flex-row gap-10'>
                    {/* Name and contact info row */}
                    <div className='flex flex-col gap-3 mb-4'>
                      <div>
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="text-sm text-black">NAME:</div>
                            <div className="font-semibold text-black underline">{row.title}</div>
                          </div>
                        
                        <div>
                          <div className="text-sm text-black">REPRESENTATIVE:</div>
                          <div>REPRESENTATIVE NAME</div>
                        </div>
                        <div className="flex items-center gap-3">
                        <ContactInfo/>
                      </div>
                      </div>
                      </div>
                      {/* Description */}
                      <div className="mb-4">
                        <div className="text-sm text-black mb-1">DESCRIPTION</div>
                        <div className="text-sm">{row.description || ""}</div>
                      </div>
                    </div>
                    

                    
                    {/* Task details in grid layout */}
                    <div className="grid grid-cols-2 gap-10">
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="text-sm text-black">CREATED BY:</div>
                          <div>{row.createdByUser?.firstName + ' ' + row.createdByUser?.lastName}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-black">CREATED DATE:</div>
                          <div>{new Date(row.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="text-sm text-black">ASSIGNEE:</div>
                          <div>{row.assignedUser?.firstName + ' ' + row.assignedUser?.lastName}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-black">DUE DATE:</div>
                          <div>{new Date(row.dueDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ] : []}
        />
      )}
    </div>
  )
}
