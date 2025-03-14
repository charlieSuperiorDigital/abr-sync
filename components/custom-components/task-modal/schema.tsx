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
    priority: z.enum(TaskPriorities),
    taskTitle: z.string().min(1, { message: 'Task title is required' }),
    description: z.string().optional(),
    location: z.string().min(1, { message: 'Location is required' }),
    type: z.enum(TaskTypes),
    dueDate: z.string().optional(),
    time: z.string().optional(),
    assignToUser: z.string().optional(),
    assignToRoles: z.array(z.enum(TaskRoles)).optional(),
    assignToMe: z.boolean().optional(),
    recurringFrequency: z.enum(RecurringFrequencies).optional(),
    recurringDays: z.array(z.enum(DaysOfWeek)).optional()
  })
}

export type TaskFormData = z.infer<
  Awaited<ReturnType<typeof getTaskFormSchema>>
>
