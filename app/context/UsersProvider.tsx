'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useGetUsersByTenant } from '../api/hooks/useGetUsersByTenant'
import { User, getUserFullName } from '../types/user'
import { useTenant } from './TenantProvider'

interface UsersContextType {
  users: User[]
  usersForSelect: { value: string; label: string; avatar?: string }[]
  isLoading: boolean
  error: Error | null
  totalCount: number
  currentPage: number
}

const UsersContext = createContext<UsersContextType>({
  users: [],
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
    perPage: 100 // Fetch a larger number to have all users available
  })

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
    } else if (!isLoading && tenant?.id) {
      console.log(`No users found for tenant ${tenant.name} (${tenant.id})`)
    }
  }, [users, tenant, isLoading, totalCount])

  return (
    <UsersContext.Provider value={{ 
      users, 
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
