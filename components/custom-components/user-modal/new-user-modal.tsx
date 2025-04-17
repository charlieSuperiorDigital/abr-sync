'use client'

import * as React from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { UserFormData, userFormSchema, UserRoleOptions, LanguageOptions, NotificationTypeOptions } from './schema'
import { CustomInput } from '../inputs/custom-input'
import type { RegisterResponse } from '@/app/api/functions/authentication'
import { useRegister } from '@/app/api/hooks/useRegister'
import { useUpdateUser } from '@/app/api/hooks/useUpdateUser'


import { CustomSelect } from '../selects/custom-select'
import { CustomButtonSelect, CustomButtonSelectField } from '../selects/custom-button-select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/app/stores/user-store'
import { User, ModuleAccess, CommunicationAccess, NotificationCategory, Language, NotificationType, Location } from '@/app/types/user'
import { Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserCircle2 } from 'lucide-react'
import { CustomMaskedInput } from '../inputs/custom-masked-input'
import { useTenant } from '@/app/context/TenantProvider'

interface NewUserModalProps {
  children: React.ReactNode
  title: string
}

export function NewUserModal({
  children,
  title
}: NewUserModalProps) {
  const { tenant } = useTenant()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('User')
  const addUser = useUserStore((state) => state.addUser)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  const validationMessage = useTranslations('Validation')
  

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: undefined,
      hourlyRate: 0,
      isActive: true,
      preferredLanguage: Language.English,
      moduleAccess: [],
      communicationAccess: [],
      notificationType: undefined,
      notificationCategories: [],
      locations: []
    }
  })

  const { register: registerUser } = useRegister()
  const { updateUser } = useUpdateUser()

  const onSubmit = async (data: UserFormData) => {
    console.log('Form submitted with data:', data)
    try {
      if (!tenant?.id) {
        throw new Error('No tenant selected. Please try again.')
      }
      setIsLoading(true)

      // Split full name into first and last name
      const nameParts = data.fullName.trim().split(/\s+/)
      if (nameParts.length < 2) {
        throw new Error('Please enter both first and last name')
      }
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ')

      // Validate name parts
      if (!firstName || !lastName) {
        throw new Error('Both first and last name are required')
      }

      // Register the user first
      console.log('Attempting to register user with:', { firstName, lastName, email: data.email, role: data.role })
      let registerResponse: RegisterResponse
      try {
        const registerResult = await new Promise<RegisterResponse>((resolve, reject) => {
          registerUser(
            {
              tenantId: tenant?.id,
              firstName,
              lastName,
              email: data.email,
              password: data.password,
              confirmPassword: data.password,
              ssoToken: '',
              roles: [data.role] // Convert the single role to an array
            },
            {
              onSuccess: (data) => resolve(data),
              onError: (error) => reject(error)
            }
          )
        })

        if (!registerResult || !registerResult.userId) {
          throw new Error('Registration failed - no user ID returned')
        }

        registerResponse = registerResult
      } catch (error) {
        console.error('Registration failed:', error)
        throw new Error('Failed to register user. Please try again.')
      }



      // Update the user with additional information
      await new Promise((resolve, reject) => {
        updateUser(
          {
            userId: registerResponse.userId,
            data: {
              preferredLanguage: data.preferredLanguage,
              phoneNumber: data.phoneNumber,
              hourlyRate: data.hourlyRate,
              modules: data.moduleAccess?.length || 0,
              communication: data.communicationAccess?.length || 0,
              notificationType: data.notificationType as unknown as number,
              notification: data.notificationCategories?.length || 0,
            }
          },
          {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error)
          }
        )
      })

      // Log success
      console.log('User created and updated successfully')

      // Reset form
      reset()
      setIsOpen(false)
      setIsLoading(false)
    } catch (error) {
      console.error('Error creating user:', error)
      setIsLoading(false)
      // Re-throw the error to trigger form error state
      throw error
    }
  }

  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscapeKey)
    return () => window.removeEventListener('keydown', handleEscapeKey)
  }, [])

  return (
    <>
      <div className="flex items-center h-full">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
        >
          {children}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 ">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={handleSubmit(
                onSubmit,
                (formErrors) => {
                  console.log('Form validation errors:', formErrors)
                }
              )} 
              className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" alt="Profile picture" />
                      <AvatarFallback>
                        <UserCircle2 className="h-20 w-20" />
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <CustomInput
                    label={t('full-name')}
                    type="text"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                  />

                  <CustomInput
                    label={t('email')}
                    type="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <CustomMaskedInput
                        label={t('phone')}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.phoneNumber?.message}
                      />
                    )}
                  />

                  <CustomInput
                    label={t('password')}
                    type="password"
                    error={errors.password?.message}
                    {...register('password')}
                  />

                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        placeholder={t('role')}
                        options={UserRoleOptions}
                        value={field.value ? [field.value] : []}
                        onChange={(values) => field.onChange(values[0])}
                        
                      />
                    )}
                  />

                  <CustomInput
                    label={t('hourly-rate')}
                    type="number"
                    min={0}
                    step={0.01}
                    {...register('hourlyRate', { valueAsNumber: true })}
                    error={errors.hourlyRate?.message}
                  />

                  <div className="space-y-2">
                    <Label className="font-semibold">Program Language</Label>
                    <Controller
                      name="preferredLanguage"
                      control={control}
                      render={({ field }) => (
                        <CustomButtonSelectField
                          field={field}
                          options={LanguageOptions}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Modules</Label>
                    <Controller
                      name="moduleAccess"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(ModuleAccess).map((module) => (
                            <div key={module} className="flex items-center space-x-2">
                              <Checkbox
                                id={`module-${module}`}
                                checked={field.value.includes(module)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, module]
                                    : field.value.filter((m: ModuleAccess) => m !== module)
                                  field.onChange(newValue)
                                }}
                              />
                              <Label htmlFor={`module-${module}`}>{module}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">{t('communication.title')}</Label>
                    <Controller
                      name="communicationAccess"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(CommunicationAccess).map((access) => (
                            <div key={access} className="flex items-center space-x-2">
                              <Checkbox
                                id={`communication-${access}`}
                                checked={field.value.includes(access)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, access]
                                    : field.value.filter((a: CommunicationAccess) => a !== access)
                                  field.onChange(newValue)
                                }}
                              />
                              <Label htmlFor={`communication-${access}`}>{access}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex flex-row space-x-4">
                    <Label className="font-semibold">{t('notifications.title')}</Label>
                    <Controller
                      name="notificationType"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-sms"
                              checked={field.value === NotificationType.SMS || field.value === NotificationType.Both}
                              onCheckedChange={(checked) => {
                                const emailChecked = field.value === NotificationType.Email || field.value === NotificationType.Both
                                if (checked) {
                                  field.onChange(emailChecked ? NotificationType.Both : NotificationType.SMS)
                                } else {
                                  field.onChange(emailChecked ? NotificationType.Email : '')
                                }
                              }}
                            />
                            <Label htmlFor="notification-sms">SMS</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-email"
                              checked={field.value === NotificationType.Email || field.value === NotificationType.Both}
                              onCheckedChange={(checked) => {
                                const smsChecked = field.value === NotificationType.SMS || field.value === NotificationType.Both
                                if (checked) {
                                  field.onChange(smsChecked ? NotificationType.Both : NotificationType.Email)
                                } else {
                                  field.onChange(smsChecked ? NotificationType.SMS : '')
                                }
                              }}
                            />
                            <Label htmlFor="notification-email">Email</Label>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Controller
                      name="notificationCategories"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-all"
                              checked={field.value.includes(NotificationCategory.All)}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? [NotificationCategory.All] : [])
                              }}
                            />
                            <Label htmlFor="notification-all">All</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="notification-workfile"
                              checked={field.value.includes(NotificationCategory.WorkfileECD)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value.filter((cat: NotificationCategory) => cat !== NotificationCategory.All), NotificationCategory.WorkfileECD]
                                  : field.value.filter((cat: NotificationCategory) => cat !== NotificationCategory.WorkfileECD)
                                field.onChange(newValue)
                              }}
                            />
                            <Label htmlFor="notification-workfile">Workfile ECD</Label>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full transition-colors duration-200 hover:bg-black hover:text-white w-32"
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      type="submit"
                      className="p-2 rounded-full transition-colors duration-200 bg-black text-white hover:bg-gray-800 w-32"
                    >
                      {isLoading ? t('saving') : t('save')}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
