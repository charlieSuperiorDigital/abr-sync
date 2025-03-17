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
  'Recurring',
  'Automated'
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

export function getTaskFormSchema(t?: (key: string) => string) {
  return z.object({
    template: z.string().optional(),
    priority: z.enum(TaskPriorities).refine(
      (val) => TaskPriorities.includes(val),
      { message: t?.('priority-required') || 'Priority is required' }
    ),
    taskTitle: z.string().min(1, { 
      message: t?.('task-title-required') || 'Task title is required' 
    }),
    description: z.string().optional(),
    location: z.string().min(1, { 
      message: t?.('location-required') || 'Location is required' 
    }),
    type: z.enum(TaskTypes).refine(
      (val) => TaskTypes.includes(val),
      { message: t?.('task-type-required') || 'Task type is required' }
    ),
    dueDate: z.string().min(1, {
      message: t?.('due-date-required') || 'Due date is required'
    }),
    time: z.string().optional(),
    assignToUser: z.string().optional(),
    assignToRoles: z.array(z.enum(TaskRoles)).optional(),
    assignToMe: z.boolean().optional(),
    recurringFrequency: z.enum(RecurringFrequencies).optional(),
    recurringDays: z.array(z.enum(DaysOfWeek)).optional(),
    recurringEndDate: z.string().optional(),
    recurringEndTime: z.string().optional()
  }).refine(
    (data) => {
      if (data.type === 'Recurring') {
        return (
          !!data.recurringFrequency && 
          (data.recurringDays?.length ?? 0) > 0 &&
          !!data.recurringEndDate &&
          !!data.recurringEndTime
        )
      }
      return true
    },
    {
      message: t?.('recurring-fields-required') || 'Frequency, days, end date and time are required for recurring tasks',
      path: ['type'] // This will show the error on the type field
    }
  )
}

export type TaskFormData = z.infer<
  Awaited<ReturnType<typeof getTaskFormSchema>>
>
