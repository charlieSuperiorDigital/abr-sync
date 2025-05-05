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
 * Interface for GetTaskById API response
 */
export interface GetTaskByIdApiResponse {
  task: Task
  taskDays: any[]
}

/**
 * Creates a new task by sending a POST request to the API
 * @param taskData - The task data to be created
 * @returns Promise with the created task
 */
export async function createTask(taskData: TaskCreateVM): Promise<Task> {
  try {
    const response = await apiService.post<Task>('/Task', taskData)
    return response.data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

/**
 * Fetches all tasks for a specific tenant
 * @param tenantId - The tenant ID to fetch tasks for (optional, uses default if not provided)
 * @returns Promise with an array of tasks
 */
export async function getTasksByTenant(tenantId?: string): Promise<Task[]> {
  // Use the provided tenant ID or fall back to the default
  const targetTenantId = tenantId || "2A9B6E40-5ACB-40A0-8E2B-D559B4829FA0"
  
  try {
    const response = await apiService.get<Task[]>(`/Task/List/${targetTenantId}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching tasks by tenant:', error)
    throw error
  }
}

/**
 * Fetches all tasks assigned to a specific user
 * @param userId - The user ID to fetch tasks for
 * @returns Promise with an array of tasks
 */
export async function getTasksByAssignedUser(userId: string): Promise<Task[]> {
  try {
    console.log('Fetching tasks assigned to user:', userId)
    const response = await apiService.get<Task[]>(`/Task/ListByAssignedUser/${userId}`)
    console.log('Response:', response)
    return response.data
  } catch (error: any) {
    console.error('Error fetching tasks by assigned user:', error)
    throw error
  }
}

/**
 * Fetches all tasks created by a specific user
 * @param userId - The user ID who created the tasks
 * @returns Promise with an array of tasks
 */
export async function getTasksByCreator(userId: string): Promise<Task[]> {
  try {
    const response = await apiService.get<Task[]>(`/Task/ListByCreatedBy/${userId}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching tasks by creator:', error)
    throw error
  }
}

/**
 * Fetches a single task by its ID
 * @param taskId - The ID of the task to fetch
 * @returns Promise with a task and its associated task days
 */
export async function getTaskById(taskId: string): Promise<GetTaskByIdApiResponse> {
  try {
    const response = await apiService.get<GetTaskByIdApiResponse>(`/Task/${taskId}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching task by ID:', error)
    throw error
  }
}

export async function markTaskasDone(taskId: string): Promise<Task> {
  try {
    return await updateTask({
      id: taskId,
      status: 'done'
    });
  } catch (error: any) {
    console.error('Error marking task as done:', error)
    throw error
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

export async function updateTask(taskData: UpdateTaskPayload): Promise<Task> {
  try {
    const response = await apiService.put<Task>(`/Task`, taskData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating task:', error)
    throw error
  }
}