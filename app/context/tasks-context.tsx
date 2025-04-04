'use client'

import { Task as ApiTask } from '@/app/api/functions/tasks'
import { createContext, useContext } from 'react'

// Create a context to share task data with child pages
export interface TasksContextType {
  assignedTasks: ApiTask[]
  createdTasks: ApiTask[]
  isLoadingAssigned: boolean
  isLoadingCreated: boolean
  errorAssigned: Error | null
  errorCreated: Error | null
}

export const TasksContext = createContext<TasksContextType | undefined>(undefined)

export const useTasksContext = () => {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider')
  }
  return context
}
