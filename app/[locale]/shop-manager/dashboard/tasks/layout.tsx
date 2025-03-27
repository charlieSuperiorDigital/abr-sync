'use client'
import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import type React from 'react'
import { Plus } from 'lucide-react'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { useTaskStore } from '@/app/stores/task-store'

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const _currentUserIdMock = '123456'
  const tasks = useTaskStore(state => state.tasks)

  // Calculate counts
  const myTasksCount = tasks.filter(task => 
    task.assignedTo === _currentUserIdMock && task.status !== 'completed'
  ).length

  const createdByMeCount = tasks.filter(task => 
    task.createdBy === _currentUserIdMock
  ).length

  const completedTasksCount = tasks.filter(task => 
    task.status === 'completed'
  ).length

  const _taskNavItems: NavItem[] = [
    { id: 'my-tasks', label: 'My Tasks', count: myTasksCount },
    { id: 'created-by-me', label: 'Created By Me', count: createdByMeCount },
    { id: 'completed-tasks', label: 'Completed Tasks', count: completedTasksCount },
  ]

  return (
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
        <DraggableNav navItems={_taskNavItems} defaultTab='my-tasks' />
      </div>
      <main className=" w-full">{children}</main>
    </div>
  )
}
