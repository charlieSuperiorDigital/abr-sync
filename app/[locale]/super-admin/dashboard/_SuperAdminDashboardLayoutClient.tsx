"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FolderOpen, User, ChartLine, SquareUserRound, ShoppingCart } from "lucide-react";
import EditProfileModal from "@/app/components/custom-components/edit-profile-modal/edit-profile-modal";
import SideBarIconGroup from "../../custom-components/sidebar-icon-group";
import RoleGuard from "@/app/components/RoleGuard";

export default function SuperAdminDashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  return (
    <RoleGuard allowedRoles={['superadmin']}>
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
            <div className="flex flex-col space-y-4">
              <SideBarIconGroup
                link={'/super-admin/dashboard'}
                icons={[{ newNotificationsQuantity: 0, Icon: ChartLine }]}
                label="Reports"
                expanded={isNavExpanded}
              />
              <SideBarIconGroup
                link={'/super-admin/dashboard/tenants'}
                icons={[{ newNotificationsQuantity: 0, Icon: SquareUserRound }]}
                label="Tenants"
                expanded={isNavExpanded}
              />
              <SideBarIconGroup
                link={'/super-admin/dashboard/fees'}
                icons={[{ newNotificationsQuantity: 0, Icon: ShoppingCart }]}
                label="Store"
                expanded={isNavExpanded}
              />
              {/* <SideBarIconGroup
                link={'/super-admin/dashboard/workfiles'}
                icons={[{ newNotificationsQuantity: 0, Icon: FolderOpen }]}
                label="Workfiles"
                expanded={isNavExpanded}
              /> */}
            </div>
            <div className="flex flex-col space-y-4">
              <div
                className="cursor-pointer"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <SideBarIconGroup
                  link={'/shop-manager/dashboard/user-profile'}
                  icons={[{ newNotificationsQuantity: 0, Icon: User }]}
                  label="Users"
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
