import { time } from 'console'
import { z } from 'zod'

export function getTaskFormSchema(t?: (key: string) => string) {
  return z.object({
    priority: z.enum(['Urgent', 'High', 'Medium', 'Low']).optional(),
    taskTitle: z
      .string(),
    description: z.string().optional(),
    location: z.enum(['location a', 'location b']).optional(),
    type: z.enum(['One-time', 'Recurring', 'Automated']).optional(),
    dueDate: z.string().optional(),
    time: z.string().optional(),
    assignToUser: z.string().optional(),
    
    
  })
}

export type TaskFormData = z.infer<
  Awaited<ReturnType<typeof getTaskFormSchema>>
>
