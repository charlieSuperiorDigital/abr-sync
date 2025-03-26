import { Task } from '../types/task';

export function mapTasksData(data: any): Task {
  return {
    id: data.id,
    priority: data.priority,
    title: data.title,
    description: data.description,
    createdBy: data.createdBy,
    createdDate: data.createdDate,
    dueDateTime: data.dueDateTime,
    relatedTo: data.relatedTo || [],
    warningMessage: data.warningMessage,
    email: data.email || '',
    phone: data.phone || '',
    message: data.message || '',
    status: data.status || 'open',
    assignedTo: data.assignedTo,
    assignedToRoles: data.assignedToRoles || [],
    lastUpdatedDate: data.lastUpdatedDate,
    location: data.location,
    type: data.type || 'One-time',
    template: data.template
  }
}

export const mockTasks: Task[] = [
  {
    id: '000001',
    priority: { variant: 'danger', text: 'Urgent' },
    title: 'Review Urgent Repair Request',
    description: 'Customer reported severe damage, needs immediate attention',
    createdBy: 'John Smith',
    createdDate: '2025-03-15',
    dueDateTime: '2025-03-18T14:30:00.000Z',
    relatedTo: [{
      type: 'opportunity',
      id: '45678',
      title: 'Repair Request'
    }],
    email: 'customer@example.com',
    phone: '555-0123',
    message: 'Vehicle needs immediate inspection',
    status: 'open',
    assignedTo: 'John Smith',
    assignedToRoles: ['CSR', 'Technician'],
    lastUpdatedDate: '2025-03-15T10:00:00.000Z',
    type: 'One-time',
    location: 'Main Shop'
  },
  {
    id: '000002',
    priority: { variant: 'warning', text: 'High' },
    title: 'Follow up on Parts Order',
    description: 'Check status of ordered parts for vehicle repair',
    createdBy: 'Jane Doe',
    createdDate: '2025-03-16',
    dueDateTime: '2025-03-19T15:00:00.000Z',
    relatedTo: [{
      type: 'workfile',
      id: '89012',
      title: 'Parts Order WF-89012'
    }],
    email: 'parts@supplier.com',
    phone: '555-0456',
    message: 'Parts order pending confirmation',
    status: 'in_progress',
    assignedTo: 'Jane Doe',
    assignedToRoles: ['Parts Manager'],
    lastUpdatedDate: '2025-03-16T11:30:00.000Z',
    type: 'One-time',
    location: 'Parts Department'
  }
]