import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import type { NextLayoutProps } from 'next'

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
  
  return <div>{children}</div>
}
