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
    variant: 'danger' | 'warning' | 'success' | 'slate'
    text: 'Urgent' | 'High' | 'Normal' | 'Low'
  }
  title: string
  description: string
  createdBy: string
  createdDate?: string
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
  estimatedHours?: number
  location?: string
  template?: string
}
