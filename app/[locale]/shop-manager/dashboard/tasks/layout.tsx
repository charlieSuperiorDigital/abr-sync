'use client'
import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import type React from 'react'
import { Plus } from 'lucide-react'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const _taskNavItems: NavItem[] = [
    { id: 'my-tasks', label: 'My Tasks', count: 72 },
    { id: 'created-by-me', label: 'Created By Me', count: 30 },
    { id: 'completed-tasks', label: 'Completed Tasks', count: 2 },
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

      <DraggableNav navItems={_taskNavItems} />

      <main className=" w-full">{children}</main>
    </div>
  )
}
