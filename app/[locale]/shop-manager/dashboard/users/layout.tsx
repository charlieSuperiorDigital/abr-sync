'use client'
import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import type React from 'react'
import { Plus } from 'lucide-react'
import { NewUserModal } from '@/components/custom-components/user-modal/new-user-modal'
import { UserRole } from '@/app/types/user'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { useUserStore } from '@/app/stores/user-store'

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const _currentUserIdMock = '123456'
  const users = useUserStore(state => state.users)

  // Calculate counts for each role
  const bodyTechsCount = users.filter(user => 
    user.role === 'BodyTech' && user.isActive
  ).length
  const paintTechsCount = users.filter(user => 
    user.role === 'PaintTech' && user.isActive
  ).length
  const csrCount = users.filter(user => 
    user.role === 'CSR' && user.isActive
  ).length
  const estimatorsCount = users.filter(user => 
    user.role === 'Estimator' && user.isActive
  ).length
  const partManagersCount = users.filter(user => 
    user.role === 'PartManager' && user.isActive
  ).length
  const shopManagersCount = users.filter(user => 
    user.role === 'ShopManager' && user.isActive
  ).length
  const shopOwnersCount = users.filter(user => 
    user.role === 'ShopOwner' && user.isActive
  ).length
  const techniciansCount = users.filter(user => 
    user.role === 'Technician' && user.isActive
  ).length
  const adminsCount = users.filter(user => 
    user.role === 'Admin' && user.isActive
  ).length

  const _taskNavItems: NavItem[] = [
    { id: 'body-techs', label: 'Body Techs', count: bodyTechsCount },
    { id: 'paint-techs', label: 'Paint Techs', count: paintTechsCount },
    { id: 'csr', label: 'CSR', count: csrCount },
    { id: 'estimators', label: 'Estimators', count: estimatorsCount },
    { id: 'part-managers', label: 'Part Managers', count: partManagersCount },
    { id: 'shop-managers', label: 'Shop Managers', count: shopManagersCount },
    { id: 'shop-owners', label: 'Shop Owners', count: shopOwnersCount },
    { id: 'technicians', label: 'Technicians', count: techniciansCount },
    { id: 'admins', label: 'Admins', count: adminsCount },
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
      <main className="w-full">{children}</main>
    </div>
  )
}
