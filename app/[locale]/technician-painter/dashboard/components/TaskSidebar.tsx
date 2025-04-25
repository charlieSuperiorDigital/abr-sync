'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetTasksByAssignedUser } from '@/app/api/hooks/useGetTasksByAssignedUser'
import { markTaskasDone } from '@/app/api/functions/tasks'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { format, isToday, isTomorrow, addDays, isPast, isWithinInterval } from 'date-fns'
import TaskConfirmModal from './TaskConfirmModal'
import { toast } from 'react-toastify'

// Priority levels with corresponding styling
const PRIORITY_STYLES = {
  HIGH: 'bg-red-500 text-white',
  NORMAL: 'bg-green-500 text-white',
  LOW: 'bg-blue-500 text-white',
}

const mockTasks=[
  {
    id: '1126241234',
    title: 'Engine Maintenance Check',
    description: 'Check engine oil, coolant, and other fluids',
    status: 'In Progress',
    vehicleImageUrl: 'https://picsum.photos/200',
    vehicleName: 'Toyota Camry',
    priority: 'High',
    dueDate: '2024-01-01',
    createdAt: '2024-01-01',
    createdBy: 'John Doe',
  },
  {
    id: '1126241235',
    title: 'Oil Change',
    description: 'Change engine oil and filter',
    status: 'In Progress',
    vehicleImageUrl: 'https://picsum.photos/200',
    vehicleName: 'Toyota Camry',
    priority: 'Medium',
    dueDate: '2024-01-01',
    createdAt: '2024-01-01',
    createdBy: 'John Doe',
  },
  {
    id: '11262df41236',
    title: 'Workshop Cleaning',
    description: 'Clean and organize workshop area, dispose of waste materials, sweep floors, wipe down surfaces and ensure tools are properly stored.',
    status: 'In Progress',

    priority: 'Low',
    dueDate: '2024-01-01',
    createdAt: '2024-01-01',
    createdBy: 'John Doe',
  },
  {
    id: '112624hnsder1234',
    title: 'Engine Maintenance Check',
    description: 'Check engine oil, coolant, and other fluids',
    status: 'In Progress',
    vehicleImageUrl: 'https://picsum.photos/200',
    vehicleName: 'Toyota Camry',
    priority: 'High',
    dueDate: '2024-01-01',
    createdAt: '2024-01-01',
    createdBy: 'John Doe',
  },
  {
    id: '1126241fd235',
    title: 'Oil Change',
    description: 'Change engine oil and filter',
    status: 'In Progress',
    vehicleImageUrl: 'https://picsum.photos/200',
    vehicleName: 'Toyota Camry',
    priority: 'Medium',
    dueDate: '2024-01-01',
    createdAt: '2024-01-01',
    createdBy: 'John Doe',
  },
  {
    id: '112624xcv1236',
    title: 'Workshop Cleaning',
    description: 'Clean and organize workshop area, dispose of waste materials, sweep floors, wipe down surfaces and ensure tools are properly stored.',
    status: 'In Progress',

    priority: 'Low',
    dueDate: '2024-01-01',
    createdAt: '2024-01-01',
    createdBy: 'John Doe',
  },
  {
    id: '1126776241234',
    title: 'Engine Maintenance Check',
    description: 'Check engine oil, coolant, and other fluids',
    status: 'In Progress',
    vehicleImageUrl: 'https://picsum.photos/200',
    vehicleName: 'Toyota Camry',
    priority: 'High',
    dueDate: '2024-01-01',
    createdAt: '2024-01-01',
    createdBy: 'John Doe',
  },
  {
    id: '1126243451235',
    title: 'Oil Change',
    description: 'Change engine oil and filter',
    status: 'In Progress',
    vehicleImageUrl: 'https://picsum.photos/200',
    vehicleName: 'Toyota Camry',
    priority: 'Medium',
    dueDate: '2024-01-01',
    createdAt: '2024-01-01',
    createdBy: 'John Doe',
  },
  {
    id: '1126as241236',
    title: 'Workshop Cleaning',
    description: 'Clean and organize workshop area, dispose of waste materials, sweep floors, wipe down surfaces and ensure tools are properly stored.',
    status: 'In Progress',

    priority: 'Low',
    dueDate: '2024-01-01',
    createdAt: '2024-01-01',
    createdBy: 'John Doe',
  },
]


export default function TaskSidebar() {
  const { data: session } = useSession()
  const userId = session?.user?.userId || ''
  
  const { incompleteTasks, isLoading, error } = useGetTasksByAssignedUser({
    userId,
    enabled: !!userId
  })

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  // Open the confirmation modal when the Done button is clicked
  const handleDoneClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedTaskId(taskId)
    setIsConfirmModalOpen(true)
  }

  // Handle confirmation modal cancel
  const handleConfirmCancel = () => {
    setIsConfirmModalOpen(false)
    setSelectedTaskId(null)
  }

  // Handle marking a task as done after confirmation
  const handleConfirmMarkAsDone = async (taskId: string) => {
    setIsConfirmModalOpen(false)
    
    try {
      // For now, just log the task ID and show a success toast
      console.log('Task completed:', taskId)
      
      // Mock API call (replace with real API call later)
      // const result = await markTaskasDone(taskId)
      const result = { success: true }
      
      if (result.success) {
        // Update completed tasks state
        setCompletedTasks(prev => ({
          ...prev,
          [taskId]: true
        }))
        
        // Show success toast with standard configuration
        toast.success('Task marked as completed successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      console.error('Error marking task as done:', error)
      toast.error('Failed to mark task as completed', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
    
    setSelectedTaskId(null)
  }

  // Format the due date in a user-friendly way
  const formatDueDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      
      if (isToday(date)) {
        return 'Due today'
      } else if (isTomorrow(date)) {
        return 'Due tomorrow'
      } else if (isPast(date)) {
        return `Due ${format(date, 'MMM d')}`
      } else if (isWithinInterval(date, { 
        start: addDays(new Date(), 2), 
        end: addDays(new Date(), 3) 
      })) {
        return `Due ${format(date, 'MMM d')} (${Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days)`
      }
      
      return `Due ${format(date, 'MMM d')}`
    } catch (e) {
      return 'Due date unknown'
    }
  }

  // Get priority style class
  const getPriorityStyle = (priority: string) => {
    const upperPriority = priority.toUpperCase()
    return PRIORITY_STYLES[upperPriority as keyof typeof PRIORITY_STYLES] || 'bg-gray-500 text-white'
  }

  if (isLoading) {
    return (
      <div className="h-full min-h-screen p-4 bg-gray-100 shadow-md w-72">
        <h2 className="mb-4 text-2xl font-bold">Tasks</h2>
        <div className="animate-pulse">
          <div className="h-24 mb-4 bg-gray-200 rounded-md"></div>
          <div className="h-24 mb-4 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full min-h-screen p-4 bg-gray-100 shadow-md w-72">
        <h2 className="mb-4 text-2xl font-bold">Tasks</h2>
        <div className="text-red-500">Error loading tasks</div>
      </div>
    )
  }

  return (
    <div className="h-full min-h-screen py-4 overflow-y-auto bg-white border-r-2 border-gray-200 shadow-md w-72">
      <h2 className="px-4 mt-8 mb-4 text-2xl font-bold">Tasks</h2>
      
      {incompleteTasks.length === 0 ? (
        <div className="text-gray-500">No tasks assigned</div>
      ) : (
        <div className="space-y-4">
          {incompleteTasks.map((task) => {
            const isDone = task.status === 'done' || completedTasks[task.id]
            
            return (
              <div 
                key={task.id} 
                className="p-4 bg-white border-b-2 border-gray-300 "
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold rounded-full text-md">
                        {task.id}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityStyle(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                    
                    <h3 className="mb-1 text-lg font-bold">{task.title}</h3>
                    <p className="mb-3 text-sm text-gray-700">{task.description}</p>
                    
                    {/* {task.vehicle && (
                      <div className="flex items-center p-3 mt-2 mb-2 bg-gray-200">
                        {task.vehicleImageUrl ? (
                          <Image 
                            src={task.vehicleImageUrl} 
                            alt={`${task.vehicleName}`}
                            width={40}
                            height={40}
                            className="mr-2 rounded-sm"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 mr-2 bg-gray-200 rounded-sm">
                            <span className="text-xs text-gray-500">No img</span>
                          </div>
                        )}
                        <span className="text-sm">
                          {task.vehicleName}
                        </span>
                      </div>
                    )} */}
                    
                   
                  </div>
                </div>
                
                {!isDone && (
                  <button
                    onClick={(e) => handleDoneClick(task.id, e)}
                    className="flex items-center gap-1 px-3 py-1 mt-3 text-sm text-white transition-colors bg-black rounded-full hover:bg-gray-800"
                  >
                    <Check size={14} /> Done
                  </button>
                )}
                
                {isDone && (
                  <div className="flex items-center gap-1 px-3 py-1 mt-3 text-sm text-gray-700 bg-gray-200 rounded-full">
                    <Check size={14} /> Done
                  </div>
                )}
                 <div className="mt-2 text-sm text-gray-500">
                      Created by {task.createdBy || 'Unknown'} {task.createdAt ? format(new Date(task.createdAt), 'MMM d') : ''}
                    </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Confirmation Modal */}
      <TaskConfirmModal
        isOpen={isConfirmModalOpen}
        taskId={selectedTaskId || ''}
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmMarkAsDone}
      />
    </div>
  )
}
