import * as z from 'zod'

export const cccIntegrationSchema = z.object({
  apiKey: z
    .string()
    .min(1, 'API Key is required')
    .min(8, 'API Key must be at least 8 characters')
    .regex(/^[A-Za-z0-9]+$/, 'API Key must contain only letters and numbers'),
  adminEmail: z
    .string()
    .min(1, 'Admin email is required')
    .email('Please enter a valid email address'),
  adminPassword: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
})

export type CCCIntegrationFormData = z.infer<typeof cccIntegrationSchema>
