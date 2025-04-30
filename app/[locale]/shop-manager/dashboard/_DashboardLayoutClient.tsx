"use client";
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
} from "lucide-react";
import Image from "next/image";
import SideBarIconGroup from "../../custom-components/sidebar-icon-group";
import React, { useState, useEffect, useRef } from "react";
import EditProfileModal from "@/app/components/custom-components/edit-profile-modal/edit-profile-modal";
import RoleGuard from "@/app/components/RoleGuard";

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <RoleGuard allowedRoles={['shopmanager', 'admin', 'salesrep', 'estimator', 'shopowner', 'manager', 'technician']}>
      <div className="flex max-h-screen relative">
        <aside 
          className="fixed h-full z-10 overflow-hidden bg-black"
          onMouseEnter={() => setIsNavExpanded(true)}
          onMouseLeave={() => setIsNavExpanded(false)}
          style={{ 
            width: isNavExpanded ? '300px' : '75px',
            transition: 'width 150ms ease-in-out'
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
            <div className="flex flex-col space-y-2">
              {/* Gotta change those icons, they dont match the design */}
              <SideBarIconGroup
                link={'/shop-manager/dashboard/tasks'}
                icons={[{ newNotificationsQuantity: 0, Icon: ClipboardList }]}
                label="Tasks"
                expanded={isNavExpanded}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/opportunities'}
                icons={[{ newNotificationsQuantity: 2, Icon: Mail }]}
                label="Opportunities"
                expanded={isNavExpanded}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/workfiles'}
                icons={[{ newNotificationsQuantity: 2, Icon: FolderOpen }]}
                label="Workfiles"
                expanded={isNavExpanded}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/parts-management'}
                icons={[
                  { newNotificationsQuantity: 2, Icon: Settings, label: 'Settings' },
                  {
                    newNotificationsQuantity: 2,
                    Icon: TruckIcon,
                    hasWarning: true,
                    label: 'Delivery Issues'
                  },
                  { newNotificationsQuantity: 2, Icon: TruckIcon, label: 'Shipments' },
                ]}
                label="Parts Management"
                expanded={isNavExpanded}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/insurances-and-vehicle-owners'}
                icons={[{ newNotificationsQuantity: 2, Icon: SquareUser }]}
                label="Insurances & Owners"
                expanded={isNavExpanded}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/ai'}
                icons={[{ newNotificationsQuantity: 2, Icon: TrendingUp }]}
                label="AI"
                expanded={isNavExpanded}
              />
              <SideBarIconGroup
                link={'/shop-manager/dashboard/users'}
                icons={[{ newNotificationsQuantity: 0, Icon: User }]}
                label="Users"
                expanded={isNavExpanded}
              />
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
        <main className="flex flex-col py-8 w-full min-h-screen pl-16">{children}</main>
      </div>
      <EditProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </RoleGuard>
  );
}
