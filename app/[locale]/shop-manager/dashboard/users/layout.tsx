'use client'
import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import * as React from 'react'
import { Plus } from 'lucide-react'
import { NewUserModal } from '@/components/custom-components/user-modal/new-user-modal'
import { useUsers } from '@/app/context/UsersProvider'
import { useSession } from 'next-auth/react'
import UsersProvider from '@/app/context/UsersProvider'
import { TenantProvider, useTenant } from '@/app/context/TenantProvider'

function UsersLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const { tenant, isLoading: isTenantLoading } = useTenant()
  const { usersQuantity, isLoading: isUsersLoading, error } = useUsers({
    tenantId: tenant?.id
  })

  const taskNavItems: NavItem[] = [
    { id: 'body-techs', label: 'Body Techs', count: usersQuantity.bodyTechs },
    { id: 'paint-techs', label: 'Paint Techs', count: usersQuantity.paintTechs },
    { id: 'csr', label: 'CSR', count: usersQuantity.csrs },
    { id: 'managers', label: 'Managers', count: usersQuantity.managers },
    { id: 'admins', label: 'Admins', count: usersQuantity.admins },
  ]

  if (error) {
    return <div className="text-center text-red-500">Error loading users: {error.message}</div>
  }

  const isLoading = isTenantLoading || isUsersLoading;

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex items-center justify-between px-5 my-7">
        <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        {tenant && (
          <NewUserModal
            title="Add User"
            children={
              <Plus className="w-5 h-5 m-auto" />
            }
          />
        )}
      </div>
      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading users...</div>
      ) : (
        <>
          <div className="px-5">
            <DraggableNav navItems={taskNavItems} defaultTab='body-techs' />
          </div>
          <main className="w-full">{children}</main>
        </>
      )}
    </div>
  )
}

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <UsersProvider>
        <UsersLayoutContent>{children}</UsersLayoutContent>
      </UsersProvider>
    </TenantProvider>
  )
}
