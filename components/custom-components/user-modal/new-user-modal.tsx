'use client'

import * as React from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { UserFormData, userFormSchema, UserRoleOptions, LanguageOptions, NotificationTypeOptions } from './schema'
import { CustomInput } from '../inputs/custom-input'

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

interface NewUserModalProps {
  children: React.ReactNode
  title: string
}

export function NewUserModal({
  children,
  title
}: NewUserModalProps) {
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

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true)

      // Create new user object from form data
      const newUser: User = {
          id: String(Math.floor(Math.random() * 1000000)).padStart(6, '0'), // Generate 6-digit ID like tasks
          firstName: '',
          lastName: '',
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          role: data.role,
          hourlyRate: data.hourlyRate,
          isActive: data.isActive,
          preferredLanguage: data.preferredLanguage,
          moduleAccess: data.moduleAccess as ModuleAccess[],
          communicationAccess: data.communicationAccess as CommunicationAccess[],
          notificationType: data.notificationType as NotificationType,
          notificationCategories: data.notificationCategories as NotificationCategory[],
          locations: data.locations as Location[],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}`,
          passwordHash: '',
          isVerified: false,
          verificationCode: null,
          tenantId: '',
          passwordResetValidity: '',
          tempPasswordResetCode: '',
          googleSSOId: null,
          facebookSSOId: null,
          appleSSOId: null,
          roles: '',
          invitations: [],
          tenantRoles: [],
          lastLoginAt: ''
      }

      // Log both raw form data and processed user object for debugging
      console.log('Form submission:', {
        rawFormData: data,
        processedUser: newUser
      })

      // Add user to store
      addUser(newUser)
      reset()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create user:', error)
    } finally {
      setIsLoading(false)
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <Label className="font-semibold">{t('communication')}</Label>
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
                    <Label className="font-semibold">{t('notifications')}</Label>
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
