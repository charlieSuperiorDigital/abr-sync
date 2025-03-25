'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { CustomSelect } from '../selects/custom-select'
import { CustomButtonSelect, CustomButtonSelectField } from '../selects/custom-button-select'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  getTaskFormSchema,
  TaskFormData,
  TaskPriorities,
  TaskTypes,
  TaskRoles,
  TaskPriority,
  TaskType,
  RecurringFrequencies,
  DaysOfWeek
} from './schema'
import { createLocalISOString } from '@/lib/utils/date'
import { CustomInput } from '../inputs/custom-input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/app/stores/task-store'
import { Task } from '@/app/types/task'

interface NewTaskModalProps {
  children: React.ReactNode
  title: string
  defaultRelation?: {
    type: 'opportunity' | 'workfile' | 'vehicle' | 'customer'
    id: string
    title?: string
  }
}

export function NewTaskModal({
  children,
  title,
  defaultRelation
}: NewTaskModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('Task')
  const validationMessage = useTranslations('Validation')
  const addTask = useTaskStore((state) => state.addTask)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShouldShowModal(false)
    }
  }

  const handleShowModal = () => {
    setShouldShowModal(true)
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(getTaskFormSchema()),
    defaultValues: {
      template: '',
      priority: 'Normal' as TaskPriority,
      taskTitle: '',
      description: '',
      location: '',
      type: 'One-time' as TaskType,
      dueDate: '',
      dueTime: '',
      assignToUser: '',
      assignToRoles: [],
      assignToMe: false,
      recurringFrequency: undefined,
      recurringDays: undefined,
      recurringEndDate: '',
      recurringEndTime: ''
    },
  })

  const watchType = watch('type')

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsLoading(true)
      
      // Map priority to the correct task variants
      const priorityMap = {
        Urgent: { variant: 'danger', text: 'Urgent' },
        High: { variant: 'warning', text: 'High' },
        Normal: { variant: 'success', text: 'Normal' },
        Low: { variant: 'slate', text: 'Low' }
      } as const

      // Combine date and time into ISO string preserving local time
      const dueDateTime = createLocalISOString(data.dueDate, data.dueTime)
      
      // Generate 6-digit task ID starting from 000000
      const taskId = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
      
      // Create task from form data
      const newTask: Task = {
        id: taskId,
        priority: priorityMap[data.priority],
        title: data.taskTitle,
        description: data.description || '',
        createdBy: 'Current User', // TODO: Get from auth context
        createdDate: new Date().toISOString().slice(0, 10),
        dueDateTime,
        relatedTo: defaultRelation ? [defaultRelation] : 
          (data.template ? [{
            type: data.template.split(':')[0] as 'opportunity' | 'workfile' | 'vehicle' | 'customer',
            id: data.template.split(':')[1],
            title: data.taskTitle // We can update this later with actual related item title
          }] : []),
        email: '',  // TODO: Get from contact info
        phone: '',  // TODO: Get from contact info
        message: '',
        status: 'open', // Initial status as per requirements
        location: data.location,
        type: data.type,
        template: data.template,
        assignedTo: data.assignToUser, // TODO: Get currentUserId from auth context
        assignedToRoles: data.assignToRoles,
        lastUpdatedDate: new Date().toISOString(),
        // Add recurring task properties if type is Recurring
        ...(data.type === 'Recurring' && {
          recurringFrequency: data.recurringFrequency,
          recurringDays: data.recurringDays,
          recurringEndDateTime: data.recurringEndDate && data.recurringEndTime 
            ? createLocalISOString(data.recurringEndDate, data.recurringEndTime)
            : undefined,
          timezone: 'UTC' // Default to UTC until we implement location-based timezones
        })
      }
      
      // Log both raw form data and processed task object for debugging
      console.log('Form submission:', {
        rawFormData: data,
        processedTask: newTask
      })
      
      // Add task to store
      addTask(newTask)
      setShouldShowModal(false)
      
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShouldShowModal(false)
      }
    }

    window.addEventListener('keydown', handleEscapeKey)
    return () => window.removeEventListener('keydown', handleEscapeKey)
  }, [])

  return (
    <>
      <div className="flex items-center h-full">
        <button
          onClick={() => handleShowModal()}
          className="flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
          aria-label="New Task"
        >
          {children}
        </button>
      </div>

      {shouldShowModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                type="button"
                onClick={() => setShouldShowModal(false)}
                className="p-2 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  console.log('Form submission started')
                  handleSubmit(
                    (data) => {
                      console.log('Form validation passed. Form data:', {
                        ...data,
                        type: data.type,
                        recurring: data.type === 'Recurring' ? {
                          frequency: data.recurringFrequency,
                          days: data.recurringDays,
                          endDate: data.recurringEndDate,
                          endTime: data.recurringEndTime,
                          // TODO: Add end date and time settings
                        } : undefined,
                        assignedTo: data.assignToUser,
                        roles: data.assignToRoles
                      })
                      return onSubmit(data)
                    },
                    (errors) => {
                      console.error('Form validation failed:', {
                        formErrors: errors,
                        formValues: watch(),
                        type: watch('type'),
                        recurring: watch('type') === 'Recurring' ? {
                          frequency: watch('recurringFrequency'),
                          days: watch('recurringDays'),
                          endDate: watch('recurringEndDate'),
                          endTime: watch('recurringEndTime')
                        } : undefined
                      })
                    }
                  )(e)
                }} 
                className="space-y-6"
              >
                <div>
                  <label className="block mb-2 font-semibold">{t('template')}</label>
                  <Controller
                    control={control}
                    name="template"
                    render={({ field }) => (
                      <CustomSelect
                        placeholder={t('template-placeholder')}
                        options={[
                          // TODO: Get from template store
                          { value: 'template1', label: 'Template 1' },
                          { value: 'template2', label: 'Template 2' },
                        ]}
                        value={field.value ? [field.value] : []}
                        onChange={(values) => {
                          field.onChange(values[0] || '')
                        }}
                      />
                    )}
                  />
                  {errors.template && (
                    <p className="text-sm text-red-500 mt-1">{errors.template.message}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">{t('task-information')}</h3>
                  
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">{t('priority')}</label>
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <CustomButtonSelectField
                          field={field}
                          options={TaskPriorities}
                        />
                      )}
                    />
                    {errors.priority && (
                      <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Controller
                      control={control}
                      name="taskTitle"
                      render={({ field }) => (
                        <CustomInput
                          label={t('task-title')}
                          type="text"
                          error={errors.taskTitle?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <CustomInput
                          label={t('description')}
                          type="text"
                          error={errors.description?.message}
                          {...field}
                        />
                      )}
                    />

                    <div>
                      <label className="block mb-2 font-semibold">{t('location')}</label>
                      <Controller
                        control={control}
                        name="location"
                        render={({ field }) => (
                          <CustomSelect
                            placeholder={t('location-placeholder')}
                            options={[
                              // TODO: Get from location store
                              { value: 'location1', label: 'Location 1' },
                              { value: 'location2', label: 'Location 2' },
                            ]}
                            value={field.value ? [field.value] : []}
                            onChange={(values) => field.onChange(values[0] || '')}
                          />
                        )}
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold">{t('task-type')}</label>
                      <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                          <CustomButtonSelectField
                            field={field}
                            options={TaskTypes}
                          />
                        )}
                      />
                      {errors.type && (
                        <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
                      )}
                    </div>

                    {watchType === 'Recurring' && (
                      <>
                        <div className="flex flex-col gap-4 w-full mt-4">
                          <Controller
                            control={control}
                            name="recurringFrequency"
                            render={({ field }) => (
                              <CustomButtonSelectField
                                field={field}
                                options={RecurringFrequencies}
                              />
                            )}
                          />
                          {errors.recurringFrequency && (
                            <p className="text-sm text-red-500 mt-1">{errors.recurringFrequency.message}</p>
                          )}
                          <Controller
                            control={control}
                            name="recurringDays"
                            render={({ field }) => (
                              <CustomButtonSelectField
                                field={field}
                                options={DaysOfWeek}
                                multiple
                              />
                            )}
                          />
                          {errors.recurringDays && (
                            <p className="text-sm text-red-500 mt-1">{errors.recurringDays.message}</p>
                          )}
                          <Controller
                            control={control}
                            name="recurringEndDate"
                            render={({ field }) => (
                              <CustomInput
                                label={t('recurring-end-date')}
                                type="date"
                                error={errors.recurringEndDate?.message}
                                {...field}
                              />
                            )}
                          />
                          {errors.recurringEndDate && (
                            <p className="text-sm text-red-500 mt-1">{errors.recurringEndDate.message}</p>
                          )}
                          <Controller
                            control={control}
                            name="recurringEndTime"
                            render={({ field }) => (
                              <CustomInput
                                label={t('recurring-end-time')}
                                type="time"
                                error={errors.recurringEndTime?.message}
                                {...field}
                              />
                            )}
                          />
                          {errors.recurringEndTime && (
                            <p className="text-sm text-red-500 mt-1">{errors.recurringEndTime.message}</p>
                          )}
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 font-semibold">{t('due-date')}</label>
                        <Controller
                          control={control}
                          name="dueDate"
                          render={({ field }) => (
                            <CustomInput
                              label={t('due-date')}
                              type="date"
                              error={errors.dueDate?.message}
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold">{t('time')}</label>
                        <Controller
                          control={control}
                          name="dueTime"
                          render={({ field }) => (
                            <CustomInput
                              label={t('time')}
                              type="time"
                              error={errors.dueTime?.message}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">{t('assign-to')}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">{t('assign-to-roles')}</h4>
                      <Controller
                        control={control}
                        name="assignToRoles"
                        render={({ field }) => (
                          <div className="space-y-2">
                            {TaskRoles.map((role) => (
                              <div key={role} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`role-${role}`}
                                  checked={field.value?.includes(role)}
                                  onCheckedChange={(checked) => {
                                    const currentRoles = field.value || []
                                    if (checked) {
                                      field.onChange([...currentRoles, role])
                                    } else {
                                      field.onChange(currentRoles.filter(r => r !== role))
                                    }
                                  }}
                                />
                                <label htmlFor={`role-${role}`} className="text-sm font-medium">
                                  {role}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                      {errors.assignToRoles && (
                        <p className="text-sm text-red-500 mt-1">{errors.assignToRoles.message}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('assign-to-user')}</h4>
                      <Controller
                        control={control}
                        name="assignToUser"
                        render={({ field }) => (
                          <>
                            <CustomSelect
                              placeholder={t('select-user')}
                              options={[
                                {
                                  value: '123456',
                                  label: 'Alexander Walker',
                                  avatar: '/placeholder.svg',
                                },
                                {
                                  value: '12345',
                                  label: 'Aiden Moore',
                                  avatar: '/placeholder.svg',
                                },
                                {
                                  value: '4444',
                                  label: 'James Davis',
                                  avatar: '/placeholder.svg',
                                },
                              ]}
                              value={field.value ? [field.value] : []}
                              onChange={(values) => field.onChange(values[0] || '')}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange('123456')
                              }}
                              className="mt-2 font-semibold text-black underline"
                            >
                              {t('assign-to-me')}
                            </button>
                          </>
                        )}
                      />
                      {errors.assignToUser && (
                        <p className="text-sm text-red-500 mt-1">{errors.assignToUser.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    type="button"
                    onClick={() => setShouldShowModal(false)}
                    className="p-2 rounded-full transition-colors duration-200 hover:bg-black hover:text-white w-32"
                    disabled={isSubmitting}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="p-2 rounded-full transition-colors duration-200 bg-black text-white hover:bg-gray-800 w-32"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('saving') : t('save')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
