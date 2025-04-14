import { Task } from '../types/task';
import { Location } from '../types/location';
import { Tenant } from '../types/tenant';

export function mapTasksData(data: any): Task {
  // Convert location string to Location object if needed
  const locationObj: Location | undefined = typeof data.location === 'string' 
    ? { 
        id: '', 
        tenantId: '', 
        tenant: createMockTenant(), 
        name: data.location, 
        address: '', 
        phone: '', 
        email: '', 
        createdAt: '', 
        updatedAt: '' 
      } 
    : data.location;

  return {
    id: data.id,
    tenantId: data.tenantId || '',
    priority: data.priority,
    title: data.title,
    description: data.description,
    createdBy: data.createdBy,
    createdAt: data.createdAt || data.createdDate || '',
    updatedAt: data.updatedAt || data.lastUpdatedDate || '',
    dueDate: data.dueDate || data.dueDateTime || '',
    dueDateTime: data.dueDateTime,
    relatedTo: data.relatedTo || [],
    warningMessage: data.warningMessage,
    email: data.email || '',
    phone: data.phone || '',
    message: data.message || '',
    status: data.status || 'open',
    assignedTo: data.assignedTo || '',
    assignedToRoles: data.assignedToRoles || [],
    lastUpdatedDate: data.lastUpdatedDate,
    location: locationObj,
    type: data.type || 'One-time',
    template: data.template
  }
}

// Helper function to create a mock Tenant object
const createMockTenant = (): Tenant => ({
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  logoUrl: '',
  cccApiKey: '',
  isActive: false,
  createdAt: '',
  updatedAt: '',
  users: [],
  payments: [],
  locations: []
});

// Helper function to create a Location object
const createLocation = (name: string): Location => ({
  id: '',
  tenantId: '',
  tenant: createMockTenant(),
  name,
  address: '',
  phone: '',
  email: '',
  createdAt: '',
  updatedAt: ''
});

export const mockTasks: Task[] = [
  {
    id: '000001',
    tenantId: '',
    priority: { variant: 'danger', text: 'Urgent' },
    title: 'Review Urgent Repair Request',
    description: 'Customer reported severe damage, needs immediate attention',
    createdBy: 'John Smith',
    createdAt: '2025-03-15',
    updatedAt: '2025-03-15T10:00:00.000Z',
    dueDate: '2025-03-18T14:30:00.000Z',
    dueDateTime: '2025-03-18T14:30:00.000Z',
    relatedTo: [
      {
        type: 'opportunity',
        id: 'OPP123456'
      }
    ],
    email: 'customer@example.com',
    phone: '555-0123',
    message: 'Vehicle needs immediate inspection',
    status: 'open',
    assignedTo: '123456',
    assignedToRoles: ['CSR', 'Technician'],
    lastUpdatedDate: '2025-03-15T10:00:00.000Z',
    type: 'One-time',
    location: createLocation('Main Shop')
  },
  {
    id: '000002',
    tenantId: '',
    priority: { variant: 'warning', text: 'High' },
    title: 'Schedule Customer Follow-up',
    description: 'Follow up on estimate approval and schedule repair',
    createdBy: 'Sarah Johnson',
    createdAt: '2025-03-16',
    updatedAt: '2025-03-16T11:30:00.000Z',
    dueDate: '2025-03-19T16:00:00.000Z',
    dueDateTime: '2025-03-19T16:00:00.000Z',
    relatedTo: [
      {
        type: 'opportunity',
        id: 'OPP234567'
      }
    ],
    email: 'sarah.j@example.com',
    phone: '555-0124',
    message: 'Customer requested evening callback',
    status: 'completed',
    assignedTo: '123456',
    assignedToRoles: ['CSR'],
    lastUpdatedDate: '2025-03-16T11:30:00.000Z',
    type: 'One-time',
    location: createLocation('Main Shop')
  },
  {
    id: '000003',
    tenantId: '',
    priority: { variant: 'success', text: 'Normal' },
    title: 'Daily Vehicle Inspection Report',
    description: 'Complete inspection reports for vehicles in service',
    createdBy: '123456',
    createdAt: '2025-03-16',
    updatedAt: '2025-03-16T09:00:00.000Z',
    dueDate: '2025-03-16T17:00:00.000Z',
    dueDateTime: '2025-03-16T17:00:00.000Z',
    relatedTo: [
      {
        type: 'opportunity',
        id: 'OPP123456'
      },
      {
        type: 'opportunity',
        id: 'OPP901234'
      }
    ],
    email: 'mike.w@example.com',
    phone: '555-0125',
    message: 'Daily inspection report due by end of shift',
    status: 'open',
    assignedTo: 'Mike Wilson',
    assignedToRoles: ['Technician'],
    lastUpdatedDate: '2025-03-16T09:00:00.000Z',
    type: 'Recurring',
    recurrence: 'Every Day',
    location: createLocation('Service Bay')
  },
  {
    id: '000004',
    tenantId: '',
    priority: { variant: 'slate', text: 'Low' },
    title: 'Update Customer Contact Information',
    description: 'Review and update customer database',
    createdBy: 'Emma Davis',
    createdAt: '2025-03-17',
    updatedAt: '2025-03-17T09:00:00.000Z',
    dueDate: '2025-03-24T17:00:00.000Z',
    dueDateTime: '2025-03-24T17:00:00.000Z',
    relatedTo: [
      {
        type: 'opportunity',
        id: 'OP-2025-0011'
      }
    ],
    email: 'emma.d@example.com',
    phone: '555-0126',
    message: 'Regular database maintenance task',
    status: 'open',
    assignedTo: '123456',
    assignedToRoles: ['Admin'],
    lastUpdatedDate: '2025-03-17T09:00:00.000Z',
    type: 'One-time',
    location: createLocation('Office')
  },
  {
    id: '000005',
    tenantId: '',
    priority: { variant: 'danger', text: 'Urgent' },
    title: 'Parts Order Follow-up',
    description: 'Urgent parts needed for repair completion',
    createdBy: 'Tom Brown',
    createdAt: '2025-03-17',
    updatedAt: '2025-03-17T10:30:00.000Z',
    dueDate: '2025-03-18T12:00:00.000Z',
    dueDateTime: '2025-03-18T12:00:00.000Z',
    relatedTo: [
      {
        type: 'opportunity',
        id: 'OPP567891'
      },
      {
        type: 'opportunity',
        id: 'OPP234567'
      }
    ],
    email: 'tom.b@example.com',
    phone: '555-0127',
    message: 'Parts needed for customer vehicle',
    status: 'in_progress',
    assignedTo: 'Tom Brown',
    assignedToRoles: ['Parts Manager'],
    lastUpdatedDate: '2025-03-17T10:30:00.000Z',
    type: 'One-time',
    location: createLocation('Parts Department')
  },
  {
    id: '000006',
    tenantId: '',
    priority: { variant: 'warning', text: 'High' },
    title: 'Quality Control Check',
    description: 'Final inspection before customer delivery',
    createdBy: 'Alex White',
    createdAt: '2025-03-17',
    updatedAt: '2025-03-17T11:00:00.000Z',
    dueDate: '2025-03-19T15:00:00.000Z',
    dueDateTime: '2025-03-19T15:00:00.000Z',
    relatedTo: [
      {
        type: 'opportunity',
        id: 'OPP456789'
      }
    ],
    email: 'alex.w@example.com',
    phone: '555-0128',
    message: 'Complete QC checklist before delivery',
    status: 'open',
    assignedTo: 'Alex White',
    assignedToRoles: ['QC Inspector'],
    lastUpdatedDate: '2025-03-17T11:00:00.000Z',
    type: 'One-time',
    location: createLocation('QC Bay')
  }
];