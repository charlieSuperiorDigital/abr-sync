'use client'

import * as React from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { UserFormData, userFormSchema, UserRoleOptions, LanguageOptions, NotificationTypeOptions } from './schema'
import { CustomInput } from '../inputs/custom-input'
import { CustomSelect } from '../selects/custom-select'
import { CustomButtonSelect } from '../selects/custom-button-select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/app/stores/user-store'
import { User, ModuleAccess, CommunicationAccess, NotificationCategory, Language, NotificationType, Location } from '@/app/types/user'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserCircle2 } from 'lucide-react'

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
  const validationMessage = useTranslations('Validation')
  const addUser = useUserStore((state) => state.addUser)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      isActive: true,
      preferredLanguage: Language.English,
      moduleAccess: [],
      communicationAccess: [],
      notificationType: NotificationType.Both,
      notificationCategories: [],
      locations: [],
      hourlyRate: 0
    }
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true)

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 6),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}`,
        locations: data.locations as Location[],
      }

      addUser(newUser)
      reset()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <div className="space-y-4">
              <div className="flex justify-start">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt="Preview" />
                  <AvatarFallback>
                    <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <CustomInput
                label={t('full-name')}
                {...register('fullName')}
                error={errors.fullName?.message}
              />

              <CustomInput
                label={t('email')}
                {...register('email')}
                error={errors.email?.message}
              />

              <CustomInput
                label={t('phone')}
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
              />

              <CustomInput
                label={t('password')}
                type="password"
                {...register('password')}
                error={errors.password?.message}
              />

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label={t('role')}
                    options={UserRoleOptions}
                    value={field.value ? [field.value] : []}
                    onChange={(values) => field.onChange(values[0])}
                    error={errors.role?.message}
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

              <div className="flex items-center space-x-2">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="active-access"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="active-access">{t('active')}</Label>
              </div>

              <Controller
                name="preferredLanguage"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>{t('language')}</Label>
                    <CustomButtonSelect
                      options={LanguageOptions}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </div>
                )}
              />

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
                              ? [...field.value.filter(cat => cat !== NotificationCategory.All), NotificationCategory.WorkfileECD]
                              : field.value.filter(cat => cat !== NotificationCategory.WorkfileECD)
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
      </DialogContent>
    </Dialog>
  )
}
