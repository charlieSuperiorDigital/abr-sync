import { z } from 'zod'

export const TaskRoles = [
  'All',
  'Estimators',
  'Parts Managers',
  'CSR',
  'Shop Managers',
  'Technicians',
  'Painters'
] as const

export const TaskPriorities = [
  'Urgent',
  'High',
  'Normal',
  'Low'
] as const

export const TaskTypes = [
  'One-time',
  'Recurring'
] as const

export const RecurringFrequencies = [
  'Every Day',
  'Every Week',
  'Every Month',
  'Every Year',
  'Custom'
] as const

export const DaysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const

export type TaskRole = typeof TaskRoles[number]
export type TaskPriority = typeof TaskPriorities[number]
export type TaskType = typeof TaskTypes[number]
export type RecurringFrequency = typeof RecurringFrequencies[number]
export type DayOfWeek = typeof DaysOfWeek[number]

export function getTaskFormSchema() {
  return z.object({
    template: z.string().optional(),
    tenantId: z.string().optional(),
    priority: z.enum(TaskPriorities, {
      required_error: 'Priority is required',
      invalid_type_error: 'Please select a valid priority'
    }),
    taskTitle: z.string().min(1, { 
      message: 'Task title is required' 
    }),
    description: z.string().optional(),
    location: z.string().min(1, { 
      message: 'Location is required' 
    }),
    type: z.enum(TaskTypes, {
      required_error: 'Task type is required',
      invalid_type_error: 'Please select a valid task type'
    }),
    dueDate: z.string().min(1, {
      message: 'Due date is required'
    }),
    dueTime: z.string().min(1, {
      message: 'Due time is required'
    }),
    assignToUser: z.string().min(1, {
      message: 'User assignment is required'
    }),
    assignToRoles: z.array(z.enum(TaskRoles)).optional(),
    assignToMe: z.boolean().optional(),
    recurringFrequency: z.enum(RecurringFrequencies).optional(),
    recurringDays: z.array(z.enum(DaysOfWeek)).optional(),
    recurringEndDate: z.string().optional(),
    recurringEndTime: z.string().optional()
  }).refine(
    (data) => {
      if (data.type === 'Recurring') {
        // Basic validation for all recurring types
        if (!data.recurringFrequency || !data.recurringEndDate || !data.recurringEndTime) {
          return false;
        }
        
        // Specific validation based on recurring frequency
        switch (data.recurringFrequency) {
          case 'Every Week':
            // Weekly tasks need weekdays selected
            return (data.recurringDays?.length ?? 0) > 0;
          case 'Every Day':
          case 'Every Month':
          case 'Every Year':
          case 'Custom':
            // These types don't require recurringDays
            return true;
          default:
            return false;
        }
      }
      return true;
    },
    {
      message: 'Frequency, days, end date and time are required for recurring tasks',
      path: ['type']
    }
  )
}

export type TaskFormData = z.infer<ReturnType<typeof getTaskFormSchema>>
