import { Task } from '../types/task';

export function mapTasksData(data: any): Task {
  return {
    id: data.id,
    priority: data.priority,
    title: data.title,
    description: data.description,
    createdBy: data.createdBy,
    createdDate: data.createdDate,
    due: data.due,
    relatedTo: data.relatedTo,
    warningMessage: data.warningMessage,
    email: data.email,
    phone: data.phone,
    message: data.message,
  }
}

export const mockTasks: Task[] = [
  {
    id: '473829',
    priority: {
      variant: 'danger',
      text: 'Urgent'
    },
    title: 'Insurance Documentation Validation',
    description: 'Verify all paperwork required by the insurance provider',
    createdBy: 'Charlie Thompson',
    createdDate: '2025-03-15',
    due: '2025-03-12',
    relatedTo: 'Insurance, Progressive',
    email: 'charliethompson@xpto.com',
    phone: '123-456-7890',
    message: '27',
    assignedTo: '123456'
  },
  {
    id: '473830',
    priority: {
      variant: 'warning',
      text: 'High'
    },
    title: 'Parts Order Follow-up',
    description: 'Contact supplier about delayed parts delivery',
    createdBy: 'Sarah Wilson',
    createdDate: '2025-03-14',
    due: '2025-03-14',
    relatedTo: 'Parts, Order #45678',
    email: 'sarahwilson@xpto.com',
    phone: '123-456-7891',
    message: '15',
    assignedTo: '123456'
  },
  {
    id: '473831',
    priority: {
      variant: 'success',
      text: 'Normal'
    },
    title: 'Customer Update Call',
    description: 'Weekly progress update call with customer',
    createdBy: 'Mike Davis',
    createdDate: '2025-03-13',
    due: '2025-03-15',
    relatedTo: 'Customer Relations',
    email: 'mikedavis@xpto.com',
    phone: '123-456-7892',
    message: '8',
    assignedTo: '123456'
  },
  {
    id: '473832',
    priority: {
      variant: 'success',
      text: 'Normal'
    },
    title: 'Quality Check',
    description: 'Perform final quality inspection',
    createdBy: 'Emily Brown',
    createdDate: '2025-03-12',
    due: '2025-03-16',
    relatedTo: 'Quality Control',
    email: 'emilybrown@xpto.com',
    phone: '123-456-7893',
    message: '12',
    assignedTo: '123456'
  },
  {
    id: '473833',
    priority: {
      variant: 'slate',
      text: 'Low'
    },
    title: 'Update Documentation',
    description: 'Update repair documentation with recent changes',
    createdBy: 'Tom Clark',
    createdDate: '2025-03-11',
    due: '2025-03-17',
    relatedTo: 'Documentation',
    email: 'tomclark@xpto.com',
    phone: '123-456-7894',
    message: '5',
    assignedTo: '123456'
  }
]