"use client";
import { useState } from "react";
import Image from "next/image";
import { FolderOpen, User, Users, ChartLine, Layers } from "lucide-react";
import EditProfileModal from "@/app/components/custom-components/edit-profile-modal/edit-profile-modal";
import SideBarIconGroup from "../../custom-components/sidebar-icon-group";
import RoleGuard from "@/app/components/RoleGuard";

export default function SuperAdminDashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  return (
    <RoleGuard allowedRoles={['superadmin']}>
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
                link={'/super-admin/dashboard'}
                icons={[{ newNotificationsQuantity: 0, Icon: ChartLine }]}
              />
              <SideBarIconGroup
                link={'/super-admin/dashboard/tenants'}
                icons={[{ newNotificationsQuantity: 0, Icon: Layers }]}
              />
              <SideBarIconGroup
                link={'/super-admin/dashboard/fees'}
                icons={[{ newNotificationsQuantity: 0, Icon: Users }]}
              />
              {/* <SideBarIconGroup
                link={'/super-admin/dashboard/workfiles'}
                icons={[{ newNotificationsQuantity: 0, Icon: FolderOpen }]}
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
