'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetTasksByAssignedUser } from '@/app/api/hooks/useGetTasksByAssignedUser'
import { useUpdateTask } from '@/app/api/hooks/useUpdateTask'
import { Check, Loader2 } from 'lucide-react'
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

  const { updateTaskAsync, isLoading: isUpdating } = useUpdateTask()
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
    if (!taskId) return
    
    try {
      const currentDate = new Date().toISOString()
      
      // Update task with status, completedDate and lastUpdatedDate
      const result = await updateTaskAsync({
        id: taskId,
        status: 'completed',
        completedDate: currentDate,
        lastUpdatedDate: currentDate
      })
      
      if (result?.success) {
        // Update completed tasks state
        setCompletedTasks(prev => ({
          ...prev,
          [taskId]: true
        }))
        
        // Show success toast
        toast.success('Task marked as completed successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        throw new Error(result?.error || 'Failed to update task')
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
    } finally {
      setIsConfirmModalOpen(false)
      setSelectedTaskId(null)
    }
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
  const getPriorityStyle = (priority: string | { variant: string, text: string }) => {
    if (typeof priority === 'object' && priority.variant) {
      // Handle object priority
      const variantMap: Record<string, string> = {
        danger: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        success: 'bg-green-500 text-white', 
        slate: 'bg-blue-500 text-white'
      }
      return variantMap[priority.variant] || 'bg-gray-500 text-white'
    }
    
    // Handle string priority
    const upperPriority = (typeof priority === 'string' ? priority : 'NORMAL').toUpperCase()
    return PRIORITY_STYLES[upperPriority as keyof typeof PRIORITY_STYLES] || 'bg-gray-500 text-white'
  }

  // Format priority text for display
  const formatPriorityText = (priority: string | { variant: string, text: string }): string => {
    if (typeof priority === 'object' && priority.text) {
      return priority.text.toUpperCase()
    }
    return (typeof priority === 'string' ? priority : 'Normal').toUpperCase()
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
      
      {incompleteTasks?.length === 0 ? (
        <div className="text-gray-500">No tasks assigned</div>
      ) : (
        <div className="space-y-4">
          {incompleteTasks?.map((task) => {
            const isDone = task.status === 'completed' || completedTasks[task.id]
            
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
                        {formatPriorityText(task.priority)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                    
                    <h3 className="mb-1 text-lg font-bold">{task.title}</h3>
                    <p className="mb-3 text-sm text-gray-700">{task.description}</p>
                  </div>
                </div>
                
                {!isDone && (
                  <button
                    onClick={(e) => handleDoneClick(task.id, e)}
                    className="flex items-center gap-1 px-3 py-1 mt-3 text-sm text-white transition-colors bg-black rounded-full hover:bg-gray-800"
                    disabled={isUpdating && selectedTaskId === task.id}
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
                       Created by {task.createdByUser?.firstName || 'Unknown'} {task.createdAt ? format(new Date(task.createdAt), 'MMM d') : ''}
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
        isLoading={isUpdating}
      />
    </div>
  )
}
