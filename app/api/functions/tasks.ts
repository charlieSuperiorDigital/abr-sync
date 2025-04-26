import apiService from '@/app/utils/apiService'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Interface for task creation request payload
 */
export interface TaskCreateVM {
  tenantId: string
  title: string
  description: string
  status: string
  assignedTo: string
  workfileId: string
  locationId: string
  dueDate: string | Date
  priority: string
  type: number
  endDate: string | Date
  roles: string
  recurringType: number
  weekDays: number
  monthDays: number
  customDays: string[]
}

/**
 * Interface for task response payload
 */
export interface Task {
  id: string
  tenantId: string
  title: string
  description: string
  status: string
  assignedTo: string
  assignedUser: any
  workfileId: string
  workfile: any
  locationId: string
  location: any
  dueDate: string
  createdAt: string
  updatedAt: string
  priority: string
  type: string
  endDate: string
  roles: string
  createdBy: string
  createdByUser?: any
  recurringType: number
  weekDays: number
  monthDays: number
  customDays: string[]
}

/**
 * Creates a new task by sending a POST request to the API
 * @param taskData - The task data to be created
 * @returns Promise with the API response
 */
export async function createTask(taskData: TaskCreateVM): Promise<any> {
  try {
    const response = await apiService.post<any>('/Task', taskData)
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } else {
      return {
        success: false,
        error: response.data,
        status: response.status
      }
    }
  } catch (error) {
    console.error('Error creating task:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    }
  }
}

/**
 * Fetches all tasks for a specific tenant
 * @param tenantId - The tenant ID to fetch tasks for (optional, uses default if not provided)
 * @returns Promise with the API response containing an array of tasks
 */
export async function getTasksByTenant(tenantId?: string): Promise<any> {
  // Use the provided tenant ID or fall back to the default
  const targetTenantId = tenantId || "2A9B6E40-5ACB-40A0-8E2B-D559B4829FA0"
  
  try {
    const response = await apiService.get<Task[]>(`/Task/List/${targetTenantId}`)
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } else {
      return {
        success: false,
        error: response.data,
        status: response.status
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    }
  }
}

/**
 * Fetches all tasks assigned to a specific user
 * @param userId - The user ID to fetch tasks for
 * @returns Promise with the API response containing an array of tasks
 */
export async function getTasksByAssignedUser(userId: string): Promise<any> {
  try {
    console.log('Fetching tasks assigned to user:', userId)
    const response = await apiService.get<Task[]>(`/Task/ListByAssignedUser/${userId}`)
    console.log('Response:', response)
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } else {
      return {
        success: false,
        error: response.data,
        status: response.status
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    }
  }
}

/**
 * Fetches all tasks created by a specific user
 * @param userId - The user ID who created the tasks
 * @returns Promise with the API response containing an array of tasks
 */
export async function getTasksByCreator(userId: string): Promise<any> {
  try {
    const response = await apiService.get<Task[]>(`/Task/ListByCreatedBy/${userId}`)
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } else {
      return {
        success: false,
        error: response.data,
        status: response.status
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    }
  }
}

/**
 * Fetches a single task by its ID
 * @param taskId - The ID of the task to fetch
 * @returns Promise with the API response containing a single task
 */
export async function getTaskById(taskId: string): Promise<any> {
  try {
    const response = await apiService.get<Task>(`/Task/${taskId}`)
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } else {
      return {
        success: false,
        error: response.data,
        status: response.status
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    }
  }
}

export async function markTaskasDone(taskId: string): Promise<any> {
  try {
    return await updateTask({
      id: taskId,
      status: 'done'
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    }
  }
}

export interface UpdateTaskPayload {
  id: string;
  tenantId?: string;
  title?: string;
  description?: string;
  status?: string;
  assignedTo?: string;
  workfileId?: string;
  locationId?: string;
  dueDate?: string;
  priority?: string;
  type?: number;
  endDate?: string;
  roles?: string;
  assignedToRoles?: string[];
  recurringFrequency?: string;
  recurringDays?: string[];
  recurringEndDateTime?: string;
  timezone?: string;
  completedDate?: string;
  lastUpdatedDate?: string;
  recurringType?: number;
  weekDays?: number;
  monthDays?: number;
  customDays?: string[];
}

export async function updateTask(taskData: UpdateTaskPayload): Promise<any> {
  try {
    const response = await apiService.put(`/Task`, taskData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } else {
      return {
        success: false,
        error: response.data,
        status: response.status
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    }
  }
}