import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import SuperAdminDashboardLayoutClient from './_SuperAdminDashboardLayoutClient'
import type { NextLayoutProps } from 'next'

export default async function SuperAdminDashboardLayout({ children, params }: NextLayoutProps) {
  const { locale } = await params;
  const session = await getServerSession(authOptions)
  
  // Check if user is authenticated
  if (!session) {
    redirect(`/${locale}/login`)
  }
  
  console.log('SuperAdminDashboardLayout session:', session)
  const roles = session?.user?.roles || []
  if (!roles.includes('superadmin')) {
    redirect(`/${locale}/no-permission`)
  }
  return <SuperAdminDashboardLayoutClient>{children}</SuperAdminDashboardLayoutClient>
}