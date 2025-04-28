'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetTasksByAssignedUser } from '@/app/api/hooks/useGetTasksByAssignedUser'
import { markTaskasDone } from '@/app/api/functions/tasks'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { format, isToday, isTomorrow, addDays, isPast, isWithinInterval } from 'date-fns'

// Priority levels with corresponding styling
const PRIORITY_STYLES = {
  HIGH: 'bg-red-500 text-white',
  NORMAL: 'bg-green-500 text-white',
  LOW: 'bg-blue-500 text-white',
}

export default function TaskSidebar() {
  const { data: session } = useSession()
  const userId = session?.user?.userId || ''
  
  const { tasks, isLoading, error } = useGetTasksByAssignedUser({
    userId,
    enabled: !!userId
  })

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})

  // Handle marking a task as done
  const handleMarkAsDone = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const result = await markTaskasDone(taskId)
      if (result.success) {
        setCompletedTasks(prev => ({
          ...prev,
          [taskId]: true
        }))
      }
    } catch (error) {
      console.error('Error marking task as done:', error)
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
        return `Due ${format(date, 'MMM d')} (overdue)`
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
      <div className="p-4 w-72 h-full min-h-screen bg-gray-100 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Tasks</h2>
        <div className="animate-pulse">
          <div className="mb-4 h-24 bg-gray-200 rounded-md"></div>
          <div className="mb-4 h-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 w-72 h-full min-h-screen bg-gray-100 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Tasks</h2>
        <div className="text-red-500">Error loading tasks</div>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto p-4 w-72 h-full min-h-screen bg-white border-r-2 border-gray-200 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Tasks</h2>
      
      {tasks.length === 0 ? (
        <div className="text-gray-500">No tasks assigned</div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isDone = task.status === 'done' || completedTasks[task.id]
            
            return (
              <div 
                key={task.id} 
                className="p-4 bg-white rounded-md border-l-4 border-gray-300 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                    
                    <h3 className="mb-1 text-lg font-bold">{task.title}</h3>
                    <p className="mb-3 text-sm text-gray-700">{task.description}</p>
                    
                    {task.workfile?.vehicle && (
                      <div className="flex items-center mt-2 mb-2">
                        {task.workfile.vehicle.imageUrl ? (
                          <Image 
                            src={task.workfile.vehicle.imageUrl} 
                            alt={`${task.workfile.vehicle.make} ${task.workfile.vehicle.model}`}
                            width={40}
                            height={40}
                            className="mr-2 rounded-sm"
                          />
                        ) : (
                          <div className="flex justify-center items-center mr-2 w-10 h-10 bg-gray-200 rounded-sm">
                            <span className="text-xs text-gray-500">No img</span>
                          </div>
                        )}
                        <span className="text-sm">
                          {task.workfile.vehicle.year} {task.workfile.vehicle.make}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Created by {task.createdByUser?.name || 'Unknown'} {task.createdAt ? format(new Date(task.createdAt), 'MMM d') : ''}
                    </div>
                  </div>
                </div>
                
                {!isDone && (
                  <button
                    onClick={(e) => handleMarkAsDone(task.id, e)}
                    className="flex gap-1 items-center px-3 py-1 mt-3 text-sm text-white bg-black rounded-full transition-colors hover:bg-gray-800"
                  >
                    <Check size={14} /> Done
                  </button>
                )}
                
                {isDone && (
                  <div className="flex gap-1 items-center px-3 py-1 mt-3 text-sm text-gray-700 bg-gray-200 rounded-full">
                    <Check size={14} /> Done
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
