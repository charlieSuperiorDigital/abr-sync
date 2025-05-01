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

import { Task } from '@/app/types/task'
import { EditTaskModal } from '@/components/custom-components/task-modal/edit-task-modal'
import { ReopenTaskModal } from '@/components/custom-components/task-modal/reopen-task-modal'
import { DuplicateTaskModal } from '@/components/custom-components/task-modal/duplicate-task-modal'
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
    relatedTo: [],
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

export default function CompletedTasks() {
  // Get tasks data from context
  const { assignedTasks, createdTasks, isLoadingAssigned, isLoadingCreated, errorAssigned, errorCreated } = useTasksContext()
  
  // State to track expanded rows and hidden rows
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [hiddenRows, setHiddenRows] = useState<Record<string, boolean>>({})
  
  // Function to toggle row expansion
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
  
  // Transform API tasks to app task format and filter for completed tasks only
  const assignedCompletedTasks = assignedTasks 
    ? assignedTasks
        .map(mapApiTaskToAppTask)
        .filter(task => 
          task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed'
        )
    : []
    
  const createdCompletedTasks = createdTasks 
    ? createdTasks
        .map(mapApiTaskToAppTask)
        .filter(task => 
          task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed'
        )
    : []
    
  // Combine both arrays and remove duplicates based on task ID
  const combinedTasks = [...assignedCompletedTasks]
  
  // Add created tasks that aren't already in the assigned tasks list
  createdCompletedTasks.forEach(createdTask => {
    if (!combinedTasks.some(task => task.id === createdTask.id)) {
      combinedTasks.push(createdTask)
    }
  })
  
  const tasks = combinedTasks

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'id',
      header: 'Task ID',
      cell: ({ row }) => {
        return (
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
        )
      },
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
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => 
      <CreatedByCell 
        createdBy={row.original.createdBy} 
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
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <ReopenTaskModal 
            taskId={row.original.id}
            taskTitle={row.original.title}
          />
          <DuplicateTaskModal 
            task={row.original}
          />
        </div>
      ),
    }
    
  ]

  return (
    <div className="w-full">
      {(isLoadingAssigned || isLoadingCreated) ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading tasks...</p>
        </div>
      ) : (errorAssigned || errorCreated) ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">{errorAssigned?.message || errorCreated?.message}</p>
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
                      
                      <div>
                        <div className="text-sm text-gray-500">Priority:</div>
                        <div>{typeof row.priority === 'string' ? row.priority : row.priority.text}</div>
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
