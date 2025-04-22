'use client'
import { User } from '@/app/types/user'
import { createContext, useContext } from 'react'

interface UsersContextType {
  users: User[]
  isLoading: boolean
  error: Error | null
}

export const UsersContext = createContext<UsersContextType>({
  users: [],
  isLoading: false,
  error: null
})

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}
