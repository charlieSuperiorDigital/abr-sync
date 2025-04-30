import { DayOfWeek, RecurringFrequency, TaskPriority, TaskType } from "./schema";

export const TASK_TEMPLATES = [
  {
    id: 'template-none',
    name: '[NONE] No Template',
    data: {
      priority: 'Normal' as TaskPriority,
      taskTitle: '',
      description: '',
      type: 'One-time' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '09:00',
      location: '',
      assignToUser: ''
    }
  },
  {
    id: 'template-1',
    name: '[DAILY] Daily Vehicle Inspection',
    data: {
      priority: 'Normal' as TaskPriority,
      taskTitle: 'Daily Vehicle Inspection',
      description: 'Perform a comprehensive inspection of the vehicle including: fluid levels, tire pressure, lights, and general condition.',
      type: 'Recurring' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '09:00',
      recurringFrequency: 'Every Day' as RecurringFrequency,
      recurringDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[],
      recurringEndDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0], // 3 months from now
      recurringEndTime: '17:00'
    }
  },
  {
    id: 'template-2',
    name: '[MONTHLY] Monthly Maintenance Check',
    data: {
      priority: 'High' as TaskPriority,
      taskTitle: 'Monthly Maintenance Check',
      description: 'Conduct a thorough maintenance check including: engine diagnostics, brake inspection, and all major systems.',
      type: 'Recurring' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '10:00',
      recurringFrequency: 'Every Month' as RecurringFrequency,
      recurringEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 year from now
      recurringEndTime: '17:00'
    }
  },
  {
    id: 'template-3',
    name: '[ONE-TIME] Urgent Repair Request',
    data: {
      priority: 'Urgent' as TaskPriority,
      taskTitle: 'Urgent Repair Request',
      description: 'Address critical repair issue immediately. Verify parts availability and schedule technician.',
      type: 'One-time' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '14:00'
    }
  },
  {
    id: 'template-4',
    name: '[YEARLY] Annual Christmas Service Special',
    data: {
      priority: 'Normal' as TaskPriority,
      taskTitle: 'Annual Christmas Service Special',
      description: 'Prepare and execute the annual Christmas service special promotion. Includes comprehensive vehicle check and holiday discount.',
      type: 'Recurring' as TaskType,
      dueDate: new Date(new Date().getFullYear(), 11, 15).toISOString().split('T')[0], // December 15th
      dueTime: '09:00',
      recurringFrequency: 'Every Year' as RecurringFrequency,
      recurringEndDate: new Date(new Date().getFullYear() + 5, 11, 25).toISOString().split('T')[0], // 5 years from now, December 25th
      recurringEndTime: '17:00'
    }
  },
  {
    id: 'template-5',
    name: '[CUSTOM] Quarterly Staff Training',
    data: {
      priority: 'High' as TaskPriority,
      taskTitle: 'Quarterly Staff Training',
      description: 'Conduct quarterly staff training on new procedures, safety protocols, and customer service standards.',
      type: 'Recurring' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '13:00',
      recurringFrequency: 'Custom' as RecurringFrequency,
      // Set three specific dates for the year
      customDays: [
        new Date(new Date().getFullYear(), 2, 15).toISOString(), // March 15th
        new Date(new Date().getFullYear(), 6, 15).toISOString(), // July 15th
        new Date(new Date().getFullYear(), 10, 15).toISOString() // November 15th
      ],
      recurringEndDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0], // End of year
      recurringEndTime: '17:00'
    }
  }
];
