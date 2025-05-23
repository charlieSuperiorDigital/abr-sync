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
import { TasksContext, TasksContextType } from '@/app/context/tasks-context'


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
    .filter(task => task.status?.toLowerCase() !== 'done' && task.status?.toLowerCase() !== 'completed')
    .length

  const completedTasksCount = [
    ...assignedTasks.filter(task => 
      task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed'
    ),
    ...createdTasks.filter(task => 
      (task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed') && 
      !assignedTasks.some(assignedTask => assignedTask.id === task.id)
    )
  ].length

  const createdByMeCount = createdTasks
    .filter(task => task.status?.toLowerCase() !== 'done' && task.status?.toLowerCase() !== 'completed')
    .length

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
        <div className="flex justify-between items-center px-5 my-7">
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <NewTaskModal
            title="New Task"
            defaultRelation={undefined}
            children={
              <Plus className="m-auto w-5 h-5" />
            }
          />
        </div>
        <div className="px-5">
          <DraggableNav navItems={taskNavItems} defaultTab='my-tasks' />
        </div>
        <main className="w-full">{children}</main>
      </div>
    </TasksContext.Provider>
  )
}
