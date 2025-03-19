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
    relatedTo: data.relatedTo,
    warningMessage: data.warningMessage,
    email: data.email,
    phone: data.phone,
    message: data.message,
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
    relatedTo: 'Repair Request #45678',
    email: 'customer@example.com',
    phone: '555-0123',
    message: 'Vehicle needs immediate inspection',
    status: 'open',
    location: 'Bay Area Shop',
    type: 'One-time'
  },
  {
    id: '000002',
    priority: { variant: 'warning', text: 'High' },
    title: 'Schedule Vehicle Inspection',
    description: 'New vehicle arrived for damage assessment',
    createdBy: 'Jane Doe',
    createdDate: '2025-03-16',
    dueDateTime: '2025-03-19T10:00:00.000Z',
    relatedTo: 'Vehicle #89012',
    email: 'fleet@example.com',
    phone: '555-0124',
    message: 'Complete inspection needed',
    status: 'open',
    location: 'Downtown Shop',
    type: 'One-time'
  },
  {
    id: '000003',
    priority: { variant: 'success', text: 'Normal' },
    title: 'Update Inventory Records',
    description: 'Monthly inventory check and update',
    createdBy: 'Mike Johnson',
    createdDate: '2025-03-17',
    dueDateTime: '2025-03-20T16:00:00.000Z',
    relatedTo: 'Inventory #2025-03',
    email: 'inventory@example.com',
    phone: '555-0125',
    message: 'Regular inventory update',
    status: 'in_progress',
    location: 'Main Warehouse',
    type: 'Recurring',
    recurringFrequency: 'Every Month',
    recurringDays: ['Monday'],
    recurringEndDateTime: '2025-12-31T16:00:00.000Z',
    timezone: 'UTC'
  },
  {
    id: '000004',
    priority: { variant: 'slate', text: 'Low' },
    title: 'Equipment Maintenance Check',
    description: 'Routine equipment maintenance',
    createdBy: 'Sarah Wilson',
    createdDate: '2025-03-17',
    dueDateTime: '2025-03-21T09:00:00.000Z',
    relatedTo: 'Equipment #12345',
    email: 'maintenance@example.com',
    phone: '555-0126',
    message: 'Regular maintenance task',
    status: 'open',
    location: 'Workshop A',
    type: 'Recurring',
    recurringFrequency: 'Every Week',
    recurringDays: ['Wednesday'],
    recurringEndDateTime: '2025-06-30T09:00:00.000Z',
    timezone: 'UTC'
  }
]