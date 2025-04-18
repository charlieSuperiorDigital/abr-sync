import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import type { NextLayoutProps } from 'next'
import { CalendarDays, Cloud, Sun, UserCircle, CloudRain } from 'lucide-react';
import { TimeDisplay } from './components/TimeDisplay';

export default async function TechnicianPainterDashboardLayout({
  children,
  params,
}: NextLayoutProps) {
  const session = await getServerSession(authOptions)
  
  // Check if user is authenticated
  if (!session) {
    const { locale } = await params;
    redirect(`/${locale}/login`)
  }
  
  const roles = session?.user?.roles || []
  // Only allow technicians (painttech or bodytech)
  if (!roles.includes('painttech') && !roles.includes('bodytech')) {
    const { locale } = await params;
    redirect(`/${locale}/no-permission`)
  }

  // Get user info
  const userName = session?.user ? `${session.user.firstName} ${session.user.lastName}` : 'Technician';
  // You could use session?.user?.image for an avatar if available

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="flex sticky top-0 z-30 justify-between items-center px-6 py-8 bg-white border-b border-gray-200">
        <div className="flex gap-4 items-center">
          <span className="mr-2 text-2xl font-bold">Workfiles</span>
          <span className="flex items-center px-4 py-2 text-lg font-semibold text-white bg-red-600 rounded-full">
            <CalendarDays size={16} className="mr-3" />
            2 CARS LEAVING IN 3 DAYS
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="flex items-center px-2 py-1 text-lg font-semibold text-white bg-black rounded-full">
            <CloudRain size={16} className="mr-1" />
            HEAVY RAIN
            <span className="ml-2">46 F</span>
            <span className="mx-2">MON, 10/17</span>
          </span>
          <span className="flex items-center px-2 py-1 text-lg font-semibold text-black bg-gray-200 rounded-full">
            <Sun size={16} className="mr-1" />
            SUNNY
            <span className="ml-2">49 F</span>
            <span className="mx-2">TUE, 10/18</span>
          </span>
          <span className="flex items-center px-2 py-1 text-lg font-semibold text-black bg-gray-200 rounded-full">
            <Cloud size={16} className="mr-1" />
            CLOUDY
            <span className="ml-2">47 F</span>
            <span className="mx-2">WED, 10/19</span>
          </span>
          <TimeDisplay />
          <span className="flex gap-2 items-center ml-4">
            <span className="flex justify-center items-center w-7 h-7 bg-gray-300 rounded-full">
              <UserCircle size={20} />
            </span>
            <span className="text-lg font-semibold">{userName}</span>
          </span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
