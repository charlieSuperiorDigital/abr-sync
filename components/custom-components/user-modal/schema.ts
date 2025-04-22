import { z } from 'zod'
import { UserRole, ModuleAccess, CommunicationAccess, NotificationType, NotificationCategory, Language } from '@/app/types/user'

export const userFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole),
  hourlyRate: z.number().min(0, 'Hourly rate must be greater than or equal to 0'),
  isActive: z.boolean(),
  preferredLanguage: z.nativeEnum(Language),
  moduleAccess: z.array(z.nativeEnum(ModuleAccess)),
  communicationAccess: z.array(z.nativeEnum(CommunicationAccess)),
  notificationType: z.nativeEnum(NotificationType),
  notificationCategories: z.array(z.nativeEnum(NotificationCategory)),
  locations: z.array(z.string()),
})

export const editUserFormSchema = userFormSchema.omit({ password: true })

export type UserFormData = z.infer<typeof userFormSchema>
export type EditUserFormData = z.infer<typeof editUserFormSchema>

export const UserRoleOptions = Object.entries(UserRole).map(([key, value]) => ({
  label: value,
  value: value
}))

export const LanguageOptions = Object.values(Language)

export const NotificationTypeOptions = Object.values(NotificationType)
