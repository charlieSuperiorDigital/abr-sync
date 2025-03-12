import * as z from 'zod'

export const accountFormSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine((val) => val === true, 'You must accept the terms'),
    privacy: z
      .boolean()
      .refine((val) => val === true, 'You must accept the privacy policy'),
    authorized: z
      .boolean()
      .refine((val) => val === true, 'You must confirm authorization'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type AccountFormValues = z.infer<typeof accountFormSchema>
