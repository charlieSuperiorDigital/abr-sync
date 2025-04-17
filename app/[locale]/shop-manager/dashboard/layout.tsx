import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import type { NextLayoutProps } from 'next'
import DashboardLayoutClient from './_DashboardLayoutClient'

export default async function DashboardLayout({ children, params }: NextLayoutProps) {
  const { locale } = await params;
  const session = await getServerSession(authOptions)
  
  // Check if user is authenticated
  if (!session) {
    redirect(`/${locale}/login`)
  }
  
  const roles = session?.user?.roles || []
  // Only deny access if user has one of these roles
  const forbiddenRoles = ['superadmin', 'painttech', 'bodytech']
  if (roles.some(role => forbiddenRoles.includes(role))) {
    redirect(`/${locale}/no-permission`)
  }
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
