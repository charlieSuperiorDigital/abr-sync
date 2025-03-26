import { TaskType } from "@/components/custom-components/task-modal/schema"

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
  priority: {
    variant: 'danger' | 'warning' | 'success' | 'slate'
    text: 'Urgent' | 'High' | 'Normal' | 'Low'
  }
  title: string
  description: string
  createdBy: string
  createdDate?: string
  dueDateTime: string
  relatedTo: TaskRelation[]
  email: string
  phone: string
  message: string
  warningMessage?: string
  status?: 'open' | 'in_progress' | 'completed' | 'archived'
  assignedTo?: string
  assignedToRoles?: string[]
  lastUpdatedDate?: string
  completedDate?: string
  attachments?: TaskAttachment[]
  comments?: TaskComment[]
  estimatedHours?: number
  location?: string
  type?: TaskType
  template?: string
  recurrence?: 'Every Day' | 'Every Week' | 'Every Month' | 'Every Year' | 'Custom'
  // Recurring task properties
  recurringFrequency?: string
  recurringDays?: string[]
  recurringEndDateTime?: string
  timezone?: string
}
