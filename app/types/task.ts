
export interface TaskComment {
  id: string
  text: string
  createdBy: string
  createdDate: string
}

export interface TaskAttachment {
  id: string
  url: string
  type: string
  name: string
  size: number
  uploadedDate: string
}

export interface TaskRelation {
  type: 'opportunity' | 'workfile' | 'vehicle' | 'customer'
  id: string
  title?: string
}


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
  priority: string | {
    variant: 'danger' | 'warning' | 'success' | 'slate'
    text: 'Urgent' | 'High' | 'Normal' | 'Low'
  }
  type: string
  endDate: string
  roles: string
  createdBy: string
  createdByUser?: any
  recurringType: number
  weekDays: number
  monthDays: number
  customDays: string[]

  // Additional fields needed by components, need to be implemented on backend
  dueDateTime?: string
  relatedTo?: TaskRelation[]
  email?: string
  phone?: string
  message?: string
  opportunityId?: string
  opportunity?: any
  warningMessage?: string
}

export interface TaskDay {
  id: string
  taskId: string
  status: number
  taskDate: string
}

export interface GetTaskByIdApiResponse {
  task: Task
  taskDays: TaskDay[]
}
