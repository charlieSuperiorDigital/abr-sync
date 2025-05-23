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
import React, { useState } from "react";
import EditProfileModal from "@/app/components/custom-components/edit-profile-modal/edit-profile-modal";
import RoleGuard from "@/app/components/RoleGuard";

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={['shopmanager', 'admin', 'salesrep', 'estimator', 'shopowner', 'manager', 'technician']}>
      <div className="flex max-h-screen">
        <aside className="flex flex-col items-center px-2 py-5 w-16 text-white bg-black">
          <Image
            src="/auto-360-logo.png"
            alt="Logo"
            width={70}
            height={70}
            className="object-contain mt-3 mb-8"
          />
          <nav className="flex flex-col justify-between items-center h-full py-2 w-[45px]">
            <div className="flex flex-col space-y-4">
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
               <SideBarIconGroup
                link={'/shop-manager/dashboard/users'}
                icons={[{ newNotificationsQuantity: 0, Icon: User }]}
              />
            </div>
            <div className="flex flex-col space-y-4">
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
        <main className="flex flex-col py-8 w-full min-h-screen">{children}</main>
      </div>
      <EditProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </RoleGuard>
  );
}
