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
    location: 'Main Shop'
  },
  {
    id: '000002',
    priority: { variant: 'warning', text: 'High' },
    title: 'Schedule Customer Follow-up',
    description: 'Follow up on estimate approval and schedule repair',
    createdBy: 'Sarah Johnson',
    createdDate: '2025-03-16',
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
    location: 'Main Shop'
  },
  {
    id: '000003',
    priority: { variant: 'success', text: 'Normal' },
    title: 'Daily Vehicle Inspection Report',
    description: 'Complete inspection reports for vehicles in service',
    createdBy: '123456',
    createdDate: '2025-03-16',
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
    location: 'Service Bay'
  },
  {
    id: '000004',
    priority: { variant: 'slate', text: 'Low' },
    title: 'Update Customer Contact Information',
    description: 'Review and update customer database',
    createdBy: 'Emma Davis',
    createdDate: '2025-03-17',
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
    location: 'Office'
  },
  {
    id: '000005',
    priority: { variant: 'danger', text: 'Urgent' },
    title: 'Parts Order Follow-up',
    description: 'Urgent parts needed for repair completion',
    createdBy: 'Tom Brown',
    createdDate: '2025-03-17',
    dueDateTime: '2025-03-18T12:00:00.000Z',
    relatedTo: [
      {
        type: 'opportunity',
        id: 'OPP567891'
      },
      {
        type: 'opportunity',
        id: 'OPP456789'
      }
    ],
    email: 'tom.b@example.com',
    phone: '555-0127',
    message: 'Critical parts needed for customer vehicle',
    status: 'in_progress',
    assignedTo: '123456',
    assignedToRoles: ['Parts Manager'],
    lastUpdatedDate: '2025-03-17T10:30:00.000Z',
    type: 'One-time',
    location: 'Parts Department'
  },
  {
    id: '000006',
    priority: { variant: 'warning', text: 'High' },
    title: 'Quality Control Check',
    description: 'Final inspection before delivery',
    createdBy: '123456',
    createdDate: '2025-03-17',
    dueDateTime: '2025-03-18T15:00:00.000Z',
    relatedTo: [
      {
        type: 'opportunity',
        id: 'OPP456789'
      }
    ],
    email: 'alice.g@example.com',
    phone: '555-0128',
    message: 'Vehicle ready for final inspection',
    status: 'open',
    assignedTo: '123456',
    assignedToRoles: ['QC Inspector'],
    lastUpdatedDate: '2025-03-17T11:00:00.000Z',
    type: 'One-time',
    location: 'QC Bay'
  },
  // {
  //   id: '000007',
  //   priority: { variant: 'success', text: 'Normal' },
  //   title: 'Weekly Team Meeting',
  //   description: 'Review ongoing projects and assignments',
  //   createdBy: 'John Smith',
  //   createdDate: '2025-03-17',
  //   dueDateTime: '2025-03-22T10:00:00.000Z',
  //   relatedTo: [
  //     {
  //       type: 'opportunity',
  //       id: 'OPP123456'
  //     },
  //     {
  //       type: 'opportunity',
  //       id: 'OPP567890'
  //     },
  //     {
  //       type: 'opportunity',
  //       id: 'OPP234567'
  //     }
  //   ],
  //   email: 'john.s@example.com',
  //   phone: '555-0129',
  //   message: 'Weekly progress review and planning',
  //   status: 'open',
  //   assignedTo: 'John Smith',
  //   assignedToRoles: ['Manager', 'CSR', 'Technician'],
  //   lastUpdatedDate: '2025-03-17T09:15:00.000Z',
  //   type: 'Recurring',
  //   recurrence: 'Every Week',
  //   location: 'Conference Room'
  // },
  // {
  //   id: '000008',
  //   priority: { variant: 'slate', text: 'Low' },
  //   title: 'Equipment Maintenance Check',
  //   description: 'Monthly maintenance of shop equipment',
  //   createdBy: 'Mike Wilson',
  //   createdDate: '2025-03-17',
  //   dueDateTime: '2025-03-31T16:00:00.000Z',
  //   relatedTo: [
  //     {
  //       type: 'opportunity',
  //       id: 'OPP901234'
  //     }
  //   ],
  //   email: 'mike.w@example.com',
  //   phone: '555-0125',
  //   message: 'Regular equipment maintenance schedule',
  //   status: 'open',
  //   assignedTo: 'Mike Wilson',
  //   assignedToRoles: ['Technician'],
  //   lastUpdatedDate: '2025-03-17T09:30:00.000Z',
  //   type: 'Recurring',
  //   recurrence: 'Every Month',
  //   location: 'Service Bay'
  // },
  // {
  //   id: '000009',
  //   priority: { variant: 'success', text: 'Normal' },
  //   title: 'Customer Satisfaction Survey',
  //   description: 'Send and review customer feedback',
  //   createdBy: 'Sarah Johnson',
  //   createdDate: '2025-03-17',
  //   dueDateTime: '2025-03-20T17:00:00.000Z',
  //   relatedTo: [
  //     {
  //       type: 'opportunity',
  //       id: 'OPP567890'
  //     },
  //     {
  //       type: 'opportunity',
  //       id: 'OP-2025-0013'
  //     }
  //   ],
  //   email: 'sarah.j@example.com',
  //   phone: '555-0124',
  //   message: 'Follow up on customer satisfaction',
  //   status: 'open',
  //   assignedTo: 'Sarah Johnson',
  //   assignedToRoles: ['CSR'],
  //   lastUpdatedDate: '2025-03-17T10:00:00.000Z',
  //   type: 'One-time',
  //   location: 'Office'
  // },
  // {
  //   id: '000010',
  //   priority: { variant: 'warning', text: 'High' },
  //   title: 'Insurance Claim Documentation',
  //   description: 'Complete and submit insurance documentation',
  //   createdBy: 'Emma Davis',
  //   createdDate: '2025-03-17',
  //   dueDateTime: '2025-03-19T15:00:00.000Z',
  //   relatedTo: [
  //     {
  //       type: 'opportunity',
  //       id: 'OPP123456'
  //     },
  //     {
  //       type: 'opportunity',
  //       id: 'OPP234567'
  //     }
  //   ],
  //   email: 'emma.d@example.com',
  //   phone: '555-0126',
  //   message: 'Insurance documentation needed for claim',
  //   status: 'in_progress',
  //   assignedTo: 'Emma Davis',
  //   assignedToRoles: ['Admin', 'Insurance Coordinator'],
  //   lastUpdatedDate: '2025-03-17T11:30:00.000Z',
  //   type: 'One-time',
  //   location: 'Office'
  // },
  // {
  //   id: '000011',
  //   priority: { variant: 'danger', text: 'Urgent' },
  //   title: 'Safety Inspection Alert',
  //   description: 'Critical safety issue requires immediate attention',
  //   createdBy: 'Tom Brown',
  //   createdDate: '2025-03-17',
  //   dueDateTime: '2025-03-18T09:00:00.000Z',
  //   relatedTo: [
  //     {
  //       type: 'opportunity',
  //       id: 'OPP456789'
  //     },
  //     {
  //       type: 'opportunity',
  //       id: 'OPP901234'
  //     },
  //     {
  //       type: 'opportunity',
  //       id: 'OP-2025-0011'
  //     }
  //   ],
  //   email: 'tom.b@example.com',
  //   phone: '555-0127',
  //   message: 'Immediate safety inspection required',
  //   status: 'open',
  //   assignedTo: 'Tom Brown',
  //   assignedToRoles: ['Safety Inspector', 'Technician'],
  //   lastUpdatedDate: '2025-03-17T08:00:00.000Z',
  //   type: 'One-time',
  //   location: 'Service Bay'
  // }
];