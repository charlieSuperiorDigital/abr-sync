import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import type React from 'react'

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
      <h1 className="text-3xl font-semibold tracking-tight px-5 my-7">Tasks</h1>

      <DraggableNav navItems={_taskNavItems} />

      <main className=" w-full">{children}</main>
    </div>
  )
}
