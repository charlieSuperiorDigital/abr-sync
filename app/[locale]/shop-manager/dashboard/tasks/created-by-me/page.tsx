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
import { MessageSquareMore, PanelTop, ChevronDown, Trash2, Pencil, Printer, NotepadText, Mail, Phone, MessageSquare, MessagesSquare, Paperclip } from 'lucide-react'
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
      .map(mapApiTaskToAppTask)
      .filter(task =>
        task.status?.toLowerCase() !== 'done' && task.status?.toLowerCase() !== 'completed'
      )
    : []

  tasks.map(task => {
    task.relatedTo = [{
      type: 'workfile',
      id: task.workfileId || '',
      title: task.workfile?.id || ''
    }]
  })  

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
                  {/* Check if task is related to opportunity or workfile */}
                  {row.relatedTo && row.relatedTo.some(rel => 
                    rel.type === 'opportunity' || rel.type === 'workfile'
                  ) ? (  
                    // Special expanded row for opportunity or workfile related tasks
                    <div className="py-0 -mx-4 bg-white">
                      {/* Header with BMW info and status badges */}
                      <div className="bg-white p-4 border-b border-slate-200">
                        <div className="flex items-center justify-between max-w-[97%]">
                          <div className="flex gap-2 items-center">
                            <h2 className="text-[20px] font-bold">{row.title}</h2>
                            <div className="flex items-center space-x-2">
                              <span className="text-[20px] font-medium">RO #{row.id || ''}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 px-2">
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">HIGH PRIORITY</span>
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">IN RENTAL</span>
                            <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">PROGRESSIVE</span>
                          </div>
                          <div className="flex items-center">
                            <NotepadText className='color-black'/>
                            <Printer className='color-black'/>
                            <Mail className='color-black'/>
                          </div>
                        </div>
                      </div>

                      {/* Main content section with car details and owner info */}
                      <div className="flex col-4">
                        {/* Left side - Car image and details */}
                        <div className="flex-1.5 pr-4 max-w-[740px]">
                          <div className="flex border-b border-slate-200">
                            {/* Car image */}
                            <div className="w-1/3 pr-4">
                              <img 
                                src="https://via.placeholder.com/300x200/e0e0e0/808080?text=BMW+Image" 
                                alt="Blue BMW 2016" 
                                className="w-full h-auto rounded-md border border-gray-200"
                              />
                            </div>
                            
                            {/* Car details */}
                            <div className="w-2/3 py-2">
                              <div className="mb-3 flex items-center">
                                <div className="text-xs text-gray-500">Estimate $:</div>
                                <div className="text-lg font-bold">$2,395.49</div>
                              </div>
                              
                              <div className="flex mb-3">
                                <div className="w-1/2 flex items-center">
                                  <div className="text-xs text-gray-500">Tech:</div>
                                  <div className="flex items-center">
                                    <div className="w-5 h-5 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-xs">AM</div>
                                    <span className="text-sm">Aiden Moore</span>
                                  </div>
                                </div>
                                <div className="w-1/2 flex items-center">
                                  <div className="text-xs text-gray-500">Est:</div>
                                  <div className="flex items-center">
                                    <div className="w-5 h-5 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-xs">EM</div>
                                    <span className="text-sm">Elliot Matt</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-gray-500">The vehicle was involved in a minor collision in a parking lot. The vehicle sustained damage to the rear bumper when it was struck by another car while reversing out of a parking space.</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mb-2 p-3">
                            <h3 className="text-md font-bold">Logs</h3>
                            <div className="text-xs underline cursor-pointer">View all</div>
                          </div>
                          <div className="rounded-md overflow-hidden">
                            {/* Table header */}
                            <div className="grid grid-cols-3 text-gray-500 border-b">
                              <div className="py-3 px-4 text-xs font-medium">TYPE</div>
                              <div className="py-3 px-4 text-xs font-medium">DATE</div>
                              <div className="py-3 px-4 text-xs font-medium">USER</div>
                            </div>
                            
                            {/* Table rows */}
                            <div className="divide-y">
                              {/* Row 1 */}
                              <div className="grid grid-cols-3 hover:bg-gray-50">
                                <div className="py-3 px-4 text-sm">Received Parts</div>
                                <div className="py-3 px-4 text-sm">Aug 15 12:30PM</div>
                                <div className="py-3 px-4 flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-xs">AM</div>
                                  <span className="text-sm">Aiden Moore</span>
                                </div>
                              </div>
                              
                              {/* Row 2 */}
                              <div className="grid grid-cols-3 hover:bg-gray-50">
                                <div className="py-3 px-4 text-sm">Estimate Update</div>
                                <div className="py-3 px-4 text-sm">Aug 14 12:30PM</div>
                                <div className="py-3 px-4 flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-xs">AM</div>
                                  <span className="text-sm">Aiden Moore</span>
                                </div>
                              </div>
                              
                              {/* Row 3 */}
                              <div className="grid grid-cols-3 hover:bg-gray-50">
                                <div className="py-3 px-4 text-sm">Parts Ordered</div>
                                <div className="py-3 px-4 text-sm">Aug 12 12:30PM</div>
                                <div className="py-3 px-4 text-sm">System Update</div>
                              </div>
                              
                              {/* Row 4 */}
                              <div className="grid grid-cols-3 hover:bg-gray-50">
                                <div className="py-3 px-4 text-sm">Scheduling Delivery</div>
                                <div className="py-3 px-4 text-sm">Aug 4 12:30PM</div>
                                <div className="py-3 px-4 text-sm">System Update</div>
                              </div>
                              
                              {/* Row 5 */}
                              <div className="grid grid-cols-3 hover:bg-gray-50">
                                <div className="py-3 px-4 text-sm flex items-center">
                                  <span>1st Call - CSR Call</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                </div>
                                <div className="py-3 px-4 text-sm">Aug 5 12:30PM</div>
                                <div className="py-3 px-4 flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-xs">EM</div>
                                  <span className="text-sm">Elliot Matt</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right side */}
                        <div className="flex-1 pr-4">
                          <div className="mt-4">
                            <div className="flex items-center mb-2 justify-between">
                              <h3 className="text-md font-bold">Jane Doe, Vehicle Owner</h3>
                              <div className="flex space-x-2 items-center">
                                <NotepadText className='color-black w-[15px] h-[15px]'/>
                                <Phone className='color-black w-[15px] h-[15px]'/>
                                <Mail className='color-black w-[15px] h-[15px]'/>
                                <button className="bg-black rounded-full p-1 flex items-center justify-center">
                                  <MessagesSquare className='w-[15px] h-[15px] color-white'/>
                                  <span className="text-xs text-white">PREF.</span>
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex">
                                <span className="text-[12px]">(555) 123-4567 janedoe@gmail.com 123 Elm Street, Springfield, IL 62704</span>
                              </div>
                              <div className="flex">
                                <span className="text-[12px]">Insurance: Progressive janedoe@gmail.com 123 Elm Street, Springfield, IL 62704</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between py-2">
                            <div>
                              <span className="text-[12px] font-semibold">Insurance: William Green, Progressive</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <NotepadText className='color-black w-[12px] h-[12px]'/>
                              <Phone className='color-black w-[12px] h-[12px]'/>
                              <Mail className='color-black w-[12px] h-[12px]'/>
                              <MessagesSquare className='color-black w-[12px] h-[12px]'/>
                            </div>
                          </div>
                          
                          {/* Attachments */}
                          <div className="mt-4">
                            <h3 className="text-md font-bold mb-2">Attachments</h3>
                            <div className="flex space-x-2 bg-color-[#DDDDDD]">
                              <div className="flex items-center space-x-1 text-xs">
                                <span className="">Estimate</span>
                                <Paperclip className="w-[12px] h-[12px]"/>
                              </div>
                              <div className="flex items-center space-x-1 text-xs">
                                <span className="">Drop-Off</span>
                                <Paperclip className="w-[12px] h-[12px]"/>
                              </div>
                              <div className="flex items-center space-x-1 text-xs">
                                <span className="">Damage On Estimate</span>
                                <Paperclip className="w-[12px] h-[12px]"/>
                              </div>
                              <div className="flex items-center space-x-1 text-xs">
                                <span className="">Supplement</span>
                                <Paperclip className="w-[12px] h-[12px]"/>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-[12px] font-bold">Last Communication Summary</h3>
                              <div className="flex items-center text-[12px] text-gray-500">
                                Last updated 2 min ago
                                <button className="ml-2 p-1 rounded-full hover:bg-gray-100">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex">
                                <div className="text-[12px]">Issure reported</div>
                                <div className="text-[12px]">Client reported a dent on the rear bumper.</div>
                              </div>
                              
                              <div className="flex">
                                <div className="text-[12px]">Repair estimate</div>
                                <div className="text-[12px]">Estimated repair time is 3 days, with a preliminary cost of $2,395.49</div>
                              </div>
                              
                              <div className="flex flex-col">
                                <div className="text-[12px]">Next steps</div>
                                <div className="text-[12px]">Assessment: Complete client interview to gather more details.</div>
                                <div className="text-[12px]">Approval: Obtain client approval for the final estimate after evaluation.</div>
                                <div className="text-[12px]">Additional Services: Offered paint touch-up, which the client accepted.</div>
                                <div className="text-[12px]">Follow-Up: Email the detailed estimate by 5/23/2025, 2:00 PM. Confirm drop-off for 5/24/2025, 9:00 AM. Finalize rental car arrangements.</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Right final side - QC Checklist */}
                        <div className="flex-1 pr-4 max-w-[239px]">
                          <div className="border border-gray-200 rounded-md p-3">
                            <h3 className="text-md font-bold mb-2">QC Checklist</h3>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-500 rounded-sm mr-2 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-xs">SIGNATURE</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-500 rounded-sm mr-2 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-xs">PRE-SCAN</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-gray-200 rounded-sm mr-2"></div>
                                <span className="text-xs">POST-SCAN</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-gray-200 rounded-sm mr-2"></div>
                                <span className="text-xs">TABLET</span>
                              </div>
                            </div>
                            
                            <h3 className="text-md font-bold mt-4 mb-2">Parts</h3>
                            <div>
                              <div className="flex justify-between text-xs">
                                <span>ON EST.</span>
                                <span>38</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>CORE$</span>
                                <span>1</span>
                                <span className="text-red-500">$159.29</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span>TOTAL RETURNING</span>
                                <span>3</span>
                                <span className="text-red-500">$1,398.39</span>
                              </div>
                            </div>
                            
                            <h3 className="text-md font-bold mt-4 mb-2">Repair Plan</h3>
                            <div className="text-xs">
                              <div>VEHICLE IN</div>
                              <div className="font-bold">AUG 20, 2023</div>
                              <div className="mt-1">REPAIR STARTED</div>
                              <div className="font-bold">AUG 22, 2023</div>
                              <div className="mt-1">PROMISED DATE</div>
                              <div className="font-bold">AUG 25, 2023</div>
                            </div>
                          </div>
                          
                          </div>
                        </div>
                      </div>
                  ) : (
                    // Original expanded row for other tasks
                    <>
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
                    </>
                  )}
                </div>
              )
            }
          ] : []}
        />
      )}
    </div>
  )
}
