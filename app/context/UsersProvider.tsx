'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useGetUsersByTenant } from '../api/hooks/useGetUsersByTenant'
import { User, getUserFullName, UserRole } from '../types/user'
import { useTenant } from './TenantProvider'

interface UsersContextType {
  users: User[]
  bodyTechs: User[]
  paintTechs: User[]
  csrs: User[]
  managers: User[]
  admins: User[]
  usersQuantity: {
    bodyTechs: number
    paintTechs: number
    csrs: number
    managers: number
    admins: number
  }
  usersForSelect: { value: string; label: string; avatar?: string }[]
  isLoading: boolean
  error: Error | null
  totalCount: number
  currentPage: number
}

const UsersContext = createContext<UsersContextType>({
  users: [],
  bodyTechs: [],
  paintTechs: [],
  csrs: [],
  managers: [],
  admins: [],
  usersQuantity: {
    bodyTechs: 0,
    paintTechs: 0,
    csrs: 0,
    managers: 0,
    admins: 0
  },
  usersForSelect: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 0
})

export const useUsers = () => useContext(UsersContext)

interface UsersProviderProps {
  children: React.ReactNode
}

export const UsersProvider = ({ children }: UsersProviderProps) => {
  const { tenant, isLoading: isTenantLoading } = useTenant()

  // Wait for tenant to be loaded before fetching users
  const { 
    users, 
    isLoading: isUsersLoading, 
    error, 
    totalCount,
    currentPage
  } = useGetUsersByTenant({
    tenantId: tenant?.id!,
    page: 1,
    perPage: 100 // Fetch all users since we need them for counts
  })

  // Helper function to check if user has role
  const hasRole = (user: User, role: UserRole) => {
    try {
      const roles = JSON.parse(user.roles)
      return roles.includes(role) && user.isActive
    } catch {
      console.warn(`Failed to parse roles for user ${user.firstName} ${user.lastName}:`, user.roles)
      return false
    }
  }

  // Format phone number to (XXX) XXX-XXXX
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  }

  // Ensure users have required fields
  const processedUsers = users.map(user => ({
    ...user,
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
    phoneNumber: formatPhoneNumber(user.phoneNumber || ''),
    locations: user.locations || [],
    isActive: user.isActive ?? true
  }))

  // Categorize users by role
  const bodyTechs = processedUsers.filter(user => hasRole(user, UserRole.BodyTech))
  const paintTechs = processedUsers.filter(user => hasRole(user, UserRole.PaintTech))
  const csrs = processedUsers.filter(user => hasRole(user, UserRole.CSR) || hasRole(user, UserRole.SalesRep))
  const managers = processedUsers.filter(user => {
    return hasRole(user, UserRole.ShopManager) || 
           hasRole(user, UserRole.ShopOwner) || 
           hasRole(user, UserRole.PartManager)
  })
  const admins = processedUsers.filter(user => {
    return hasRole(user, UserRole.Admin) || 
           hasRole(user, UserRole.SuperAdmin)
  })

  // Calculate quantities
  const usersQuantity = {
    bodyTechs: bodyTechs.length,
    paintTechs: paintTechs.length,
    csrs: csrs.length,
    managers: managers.length,
    admins: admins.length
  }

  // Transform users into format needed for select components
  const usersForSelect = users.map(user => ({
    value: user.id,
    label: getUserFullName(user),
    avatar: '/placeholder.svg' // Default avatar, could be replaced with actual user avatar
  }))

  // Combine loading states
  const isLoading = isTenantLoading || isUsersLoading;

  // Log users data when it changes
  useEffect(() => {
    if (tenant?.id) {
      console.log(`Tenant loaded: ${tenant.name} (${tenant.id})`)
    }
    
    if (users.length > 0) {
      console.log(`Loaded ${users.length} users for tenant ${tenant?.name} (total: ${totalCount})`)
      console.log('Users by role:', usersQuantity)
    } else if (!isLoading && tenant?.id) {
      console.log(`No users found for tenant ${tenant.name} (${tenant.id})`)
    }
  }, [users, tenant, isLoading, totalCount, usersQuantity])

  return (
    <UsersContext.Provider value={{ 
      users, 
      bodyTechs,
      paintTechs,
      csrs,
      managers,
      admins,
      usersQuantity,
      usersForSelect, 
      isLoading, 
      error, 
      totalCount,
      currentPage
    }}>
      {children}
    </UsersContext.Provider>
  )
}

export default UsersProvider
