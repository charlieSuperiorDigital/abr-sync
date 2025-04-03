'use client'
import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import type React from 'react'
import { Plus } from 'lucide-react'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { useSession } from 'next-auth/react'
import { useGetTasksByAssignedUser } from '@/app/api/hooks/useGetTasksByAssignedUser'
import { useGetTasksByCreator } from '@/app/api/hooks/useGetTasksByCreator'
import { Task as ApiTask } from '@/app/api/functions/tasks'
import { Task } from '@/app/types/task'
import { createContext, useContext } from 'react'

// Create a context to share task data with child pages
export interface TasksContextType {
  assignedTasks: ApiTask[]
  createdTasks: ApiTask[]
  isLoadingAssigned: boolean
  isLoadingCreated: boolean
  errorAssigned: Error | null
  errorCreated: Error | null
}

export const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function useTasksContext() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider')
  }
  return context
}

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the current authenticated user
  const { data: session, status } = useSession()
  const userId = session?.user?.userId || "341d96d2-a419-4c7a-a651-b8d54b71ace0" // Default ID as fallback

  // Fetch tasks assigned to the current user
  const { 
    tasks: assignedTasks, 
    isLoading: isLoadingAssigned, 
    error: errorAssigned 
  } = useGetTasksByAssignedUser({
    userId,
    enabled: true
  })

  // Fetch tasks created by the current user
  const { 
    tasks: createdTasks, 
    isLoading: isLoadingCreated, 
    error: errorCreated 
  } = useGetTasksByCreator({
    userId,
    enabled: true
  })

  // Calculate counts
  const myTasksCount = assignedTasks
    .filter(task => task.status?.toLowerCase() !== 'completed')
    .length

  const completedTasksCount = assignedTasks
    .filter(task => task.status?.toLowerCase() === 'completed')
    .length

  const createdByMeCount = createdTasks.length

  const taskNavItems: NavItem[] = [
    { id: 'my-tasks', label: 'My Tasks', count: myTasksCount },
    { id: 'created-by-me', label: 'Created By Me', count: createdByMeCount },
    { id: 'completed-tasks', label: 'Completed Tasks', count: completedTasksCount },
  ]

  // Context value to share with child pages
  const contextValue: TasksContextType = {
    assignedTasks,
    createdTasks,
    isLoadingAssigned,
    isLoadingCreated,
    errorAssigned,
    errorCreated
  }

  return (
    <TasksContext.Provider value={contextValue}>
      <div className="flex flex-col w-full min-h-screen">
        <div className="flex items-center justify-between px-5 my-7">
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <NewTaskModal
            title="New Task"
            defaultRelation={undefined}
            children={
              <Plus className="w-5 h-5 m-auto" />
            }
          />
        </div>
        <div className="px-5">
          <DraggableNav navItems={taskNavItems} defaultTab='my-tasks' />
        </div>
        <main className=" w-full">{children}</main>
      </div>
    </TasksContext.Provider>
  )
}
