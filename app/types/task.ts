import { TaskType } from "@/components/custom-components/task-modal/schema"
import { User } from "./user"
import { Location } from "./location"

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

export interface Workfile {
  id: string
  opportunityId: string
  opportunity: any | null
  status: string
  dropDate: string
  estimatedCompletionDate: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  tenantId: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'completed' | 'archived' | 'New'
  assignedTo: string
  assignedUser?: User
  workfileId?: string
  workfile?: Workfile
  locationId?: string
  location?: Location
  opportunityId?: string
  opportunity?: any
  dueDate: string
  createdAt: string
  updatedAt: string
  priority: string | {
    variant: 'danger' | 'warning' | 'success' | 'slate'
    text: 'Urgent' | 'High' | 'Normal' | 'Low'
  }
  type: string | number
  endDate?: string
  roles?: string
  createdBy: string
  createdByUser?: User
  
  // Additional fields from previous interface that might still be needed
  dueDateTime?: string
  relatedTo?: TaskRelation[]
  email?: string
  phone?: string
  message?: string
  warningMessage?: string
  assignedToRoles?: string[]
  lastUpdatedDate?: string
  completedDate?: string
  attachments?: TaskAttachment[]
  comments?: TaskComment[]
  estimatedHours?: number
  template?: string
  recurrence?: 'Every Day' | 'Every Week' | 'Every Month' | 'Every Year' | 'Custom'
  recurringFrequency?: string
  recurringDays?: string[]
  recurringEndDateTime?: string
  timezone?: string
}
