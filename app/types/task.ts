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

export interface Task {
  id: string
  priority: {
    variant: 'default' | 'danger' | 'warning' | 'neutral' | 'slate' | 'info' | 'success' | 'forest' | 'dark'
    text: string
  }
  title: string
  description: string
  createdBy: string
  createdDate: string
  due: string
  relatedTo: string
  email: string
  phone: string
  message: string
  warningMessage?: string
  status?: 'open' | 'in_progress' | 'completed' | 'archived'
  assignedTo?: string
  lastUpdatedDate?: string
  completedDate?: string
  attachments?: TaskAttachment[]
  comments?: TaskComment[]
  estimatedHours?: number // Optional field for repair tasks
}
