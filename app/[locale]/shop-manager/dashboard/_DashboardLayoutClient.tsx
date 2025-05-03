'use client'
import {
  AlarmClock,
  Archive,
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
import React, { useState, useEffect, useRef } from 'react'
import EditProfileModal from '@/app/components/custom-components/edit-profile-modal/edit-profile-modal'
import RoleGuard from '@/app/components/RoleGuard'
import { CallProvider } from '@/app/context/call-context'
import { CallReceiver } from '../../custom-components/calls/call-receiver'
import svgIcon from '../../custom-components/SVGIcon'
import { SVGProps } from 'react'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isNavExpanded, setIsNavExpanded] = useState(false)

  return (
    <RoleGuard
      allowedRoles={[
        'shopmanager',
        'admin',
        'salesrep',
        'estimator',
        'shopowner',
        'manager',
        'technician',
      ]}
    >
      <div className="flex max-h-screen relative">
        <aside
          className="fixed h-full z-10 overflow-hidden bg-black"
          onMouseEnter={() => setIsNavExpanded(true)}
          onMouseLeave={() => setIsNavExpanded(false)}
          style={{
            width: isNavExpanded ? '300px' : '75px',
            transition: 'width 150ms ease-in-out',
          }}
        >
          <div className="flex flex-col items-center px-2 py-5 text-white h-full">
            <Image
              src="/auto-360-logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="object-contain mt-3 mb-8"
            />
            <nav className="flex flex-col justify-between h-full py-2 w-full">
              <div className="flex flex-col">
                {/* Gotta change those icons, they dont match the design */}
                <SideBarIconGroup
                  link={'/shop-manager/dashboard/tasks'}
                  icons={[{ newNotificationsQuantity: 0, Icon: function NoteIcon(props: SVGProps<SVGSVGElement>) { return svgIcon({ src: '/note.text.svg', className: props.className }) } }]} // Using a named function component that satisfies the expected type
                  label="Tasks"
                  expanded={isNavExpanded}
                />
                <SideBarIconGroup
                  link={'/shop-manager/dashboard/opportunities'}
                  icons={[
                    { newNotificationsQuantity: 2, Icon: Mail, label: 'Opportunities' },
                    { newNotificationsQuantity: 0, Icon: function MailIcon(props: SVGProps<SVGSVGElement>) { return svgIcon({ src: '/envelope.badge.fill.svg', className: props.className }) }, label: 'Email Updates' }
                  ]}
                  label="Opportunities"
                  expanded={isNavExpanded}
                />
                <SideBarIconGroup
                  link={'/shop-manager/dashboard/workfiles'}
                  icons={[
                    { newNotificationsQuantity: 2, Icon: FolderOpen, label: 'Workfiles' },
                    { newNotificationsQuantity: 0, Icon: AlarmClock , label: 'ECD In 3 Days' }
                  ]}
                  label="Workfiles"
                  expanded={isNavExpanded}
                />
                <SideBarIconGroup
                  link={'/shop-manager/dashboard/parts-management'}
                  icons={[
                    {
                      newNotificationsQuantity: 2,
                      Icon: Settings,
                      label: 'Parts To Order',
                    },
                    {
                      newNotificationsQuantity: 2,
                      Icon: Settings,
                      hasWarning: true,
                      label: 'Tech Needs Parts',
                    },
                    {
                      newNotificationsQuantity: 2,
                      Icon: function TruckIcon(props: SVGProps<SVGSVGElement>) { return svgIcon({ src: '/truck.svg', className: props.className }) },
                      label: 'Parts Today',
                    },
                    {
                      newNotificationsQuantity: 2,
                      Icon: function TruckIcon(props: SVGProps<SVGSVGElement>) { return svgIcon({ src: '/truck.svg', className: props.className }) },
                      label: 'Parts Missed',
                    },
                  ]}
                  label="Parts Management"
                  expanded={isNavExpanded}
                />
                <SideBarIconGroup
                  link={'/shop-manager/dashboard/insurances-and-vehicle-owners'}
                  icons={[{ newNotificationsQuantity: 2, Icon: function SquareUserIcon(props: SVGProps<SVGSVGElement>) { return svgIcon({ src: '/rectangle.stack.person.crop.fill.svg', className: props.className }) } }]}
                  label="Customers, Insurances & Vendors"
                  expanded={isNavExpanded}
                />
                <SideBarIconGroup
                  link={'/shop-manager/dashboard/ai'}
                  icons={[{ newNotificationsQuantity: 2, Icon: function TrendingUpIcon(props: SVGProps<SVGSVGElement>) { return svgIcon({ src: '/ai.svg', className: props.className }) } }]}
                  label="Reports Chat"
                  expanded={isNavExpanded}
                />
                {/* <SideBarIconGroup
                  link={'/shop-manager/dashboard/users'}
                  icons={[{ newNotificationsQuantity: 0, Icon: User }]}
                  label="Users"
                  expanded={isNavExpanded}
                /> */}
              </div>

              <div className="flex flex-col space-y-4">
                <SideBarIconGroup
                  link={'/shop-manager/dashboard/search'}
                  icons={[{ newNotificationsQuantity: 0, Icon: Search }]}
                  label="Search"
                  expanded={isNavExpanded}
                />
                <div
                  className="cursor-pointer"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  <SideBarIconGroup
                    link={'/shop-manager/dashboard/user-profile'}
                    icons={[{ newNotificationsQuantity: 0, Icon: User }]}
                    label="Profile"
                    expanded={isNavExpanded}
                  />
                </div>
              </div>
            </nav>
          </div>
        </aside>
        <main className="flex flex-col py-8 w-full min-h-screen pl-16">
          <CallReceiver />
          {children}
        </main>
      </div>
      <EditProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </RoleGuard>
  )
}

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CallProvider>
      <DashboardContent>{children}</DashboardContent>
    </CallProvider>
  )
}
