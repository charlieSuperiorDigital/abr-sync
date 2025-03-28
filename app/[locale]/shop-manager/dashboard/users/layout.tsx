'use client'
import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import type React from 'react'
import { Plus } from 'lucide-react'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { useUserStore } from '@/app/stores/user-store'

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const _currentUserIdMock = '123456'
  const users = useUserStore(state => state.users)

  // Calculate counts
  const bodyTechsCount = users.filter(user => 
    user.role === 'BodyTech' && user.isActive
  ).length

  const _taskNavItems: NavItem[] = [
    { id: 'body-techs', label: 'Body Techs', count: bodyTechsCount },
  ]

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex items-center justify-between px-5 my-7">
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        <NewTaskModal
          title="New Task"
          defaultRelation={undefined}
          children={
            <Plus className="w-5 h-5 m-auto" />
          }
        />
      </div>
      <div className="px-5">
        <DraggableNav navItems={_taskNavItems} defaultTab='body-techs' />
      </div>
      <main className=" w-full">{children}</main>
    </div>
  )
}
