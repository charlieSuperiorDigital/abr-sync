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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt="Preview" />
              <AvatarFallback>
                <UserCircle2 className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CustomInput
                label={t('full-name')}
                {...register('fullName')}
                error={errors.fullName?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <CustomInput
            label={t('password')}
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="grid grid-cols-2 gap-4">
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
          </div>

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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label>{t('modules')}</Label>
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
            <Label>{t('communication')}</Label>
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

          <div className="space-y-2">
            <Label>{t('notifications')}</Label>
            <Controller
              name="notificationType"
              control={control}
              render={({ field }) => (
                <CustomButtonSelect
                  options={NotificationTypeOptions}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('saving') : t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
