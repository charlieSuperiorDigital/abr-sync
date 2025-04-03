'use client'
import {
  Archive,
  ClipboardList,
  FolderOpen,
  Mail,
  Search,
  Settings,
  SquareUser,
  TrendingUp,
  TruckIcon,
  User,
} from 'lucide-react'
import Image from 'next/image'
import SideBarIconGroup from '../../custom-components/sidebar-icon-group'
import React, { useState } from 'react'
import ProtectedRoute from '@/app/components/auth/protected-route'
import EditProfileModal from '@/app/components/custom-components/edit-profile-modal/edit-profile-modal'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <aside className="w-16 bg-black text-white flex flex-col px-2 py-5 items-center ">
          <Image
            src="/auto-360-logo.png"
            alt="Logo"
            width={70}
            height={70}
            className="object-contain mb-8 mt-3"
          />
          <nav className="flex flex-col justify-between items-center h-full py-2 w-[45px]">
            <div className="space-y-4 flex flex-col">
              {/* Gotta change those icons, they dont match the design */}

              <SideBarIconGroup
                link={'/shop-manager/dashboard/tasks'}
                icons={[{ newNotificationsQuantity: 0, Icon: ClipboardList }]}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/opportunities'}
                icons={[{ newNotificationsQuantity: 2, Icon: Mail }]}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/workfiles'}
                icons={[{ newNotificationsQuantity: 2, Icon: FolderOpen }]}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/parts-management'}
                icons={[
                  { newNotificationsQuantity: 2, Icon: Settings },
                  {
                    newNotificationsQuantity: 2,
                    Icon: TruckIcon,
                    hasWarning: true,
                  },
                  { newNotificationsQuantity: 2, Icon: TruckIcon },
                ]}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/insurances-and-vehicle-owners'}
                icons={[{ newNotificationsQuantity: 2, Icon: SquareUser }]}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/ai'}
                icons={[{ newNotificationsQuantity: 2, Icon: TrendingUp }]}
              />
            </div>
            <div className="space-y-4 flex flex-col">
              <SideBarIconGroup
                link={'/shop-manager/dashboard/search'}
                icons={[{ newNotificationsQuantity: 0, Icon: Search }]}
              />
              <div 
                className="cursor-pointer"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <SideBarIconGroup
                  link={'/shop-manager/dashboard/user-profile'}
                  icons={[{ newNotificationsQuantity: 0, Icon: User }]}
                />
              </div>
            </div>
          </nav>
        </aside>
        <main className="flex min-h-screen flex-col py-8 w-full">{children}</main>
      </div>
      
      <EditProfileModal 
        open={isProfileModalOpen} 
        onOpenChange={setIsProfileModalOpen} 
      />
    </ProtectedRoute>
  )
}
