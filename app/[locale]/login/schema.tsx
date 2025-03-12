import { z } from 'zod'

export function getLoginFormSchema(t?: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, { message: t ? t('errorEmailRequired') : 'Email is required' })
      .email({ message: t ? t('errorEmail') : 'Invalid email address' }),
    password: z.string().min(1, {
      message: t ? t('errorPasswordRequired') : 'Password is required ',
    }),
  })
}

export type LoginFormData = z.infer<
  Awaited<ReturnType<typeof getLoginFormSchema>>
>
