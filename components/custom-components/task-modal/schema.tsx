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

export type TaskRole = typeof TaskRoles[number]
export type TaskPriority = typeof TaskPriorities[number]
export type TaskType = typeof TaskTypes[number]

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
    assignToMe: z.boolean().optional()
  })
}

export type TaskFormData = z.infer<
  Awaited<ReturnType<typeof getTaskFormSchema>>
>
