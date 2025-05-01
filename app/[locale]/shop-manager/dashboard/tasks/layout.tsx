'use client'
import { useGetTasksByAssignedUser, useGetTasksByCreator } from '@/app/api/hooks/useTasks'
import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useGetUserTabOrder } from '@/app/api/hooks/useGetUserTabOrder'
import { useUpdateUserTabOrder } from '@/app/api/hooks/useUpdateUserTabOrder'
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

  // Define the base nav items
  const baseNavItems: NavItem[] = [
    { id: 'my-tasks', label: 'My Tasks', count: myTasksCount },
    { id: 'created-by-me', label: 'Created By Me', count: createdByMeCount },
    { id: 'completed-tasks', label: 'Completed Tasks', count: completedTasksCount },
  ]

  // Get user's preferred tab order
  // Get user's preferred tab order
  const { tabOrder } = useGetUserTabOrder({
    userId,
    pageName: 'tasks',
    enabled: !!userId
  })

  // Setup tab order update mutation
  const { updateTabOrder } = useUpdateUserTabOrder({
    userId,
    pageName: 'tasks',
  })

  // Order the nav items according to user's preference or use default order
  const taskNavItems = tabOrder
    ? [...baseNavItems].sort((a, b) => {
        const aIndex = tabOrder.indexOf(a.id)
        const bIndex = tabOrder.indexOf(b.id)
        return aIndex - bIndex
      })
    : baseNavItems

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
          <DraggableNav 
            navItems={taskNavItems} 
            defaultTab={tabOrder?.[0] || 'my-tasks'}
            onReorder={(reorderedItems) => {
              // Extract the IDs in the new order
              const newOrder = reorderedItems.map(item => item.id)
              // Update the tab order in the database
              updateTabOrder(newOrder)
            }}
          />
        </div>
        <main className="w-full px-[20px]">{children}</main>
      </div>
    </TasksContext.Provider>
  )
}
