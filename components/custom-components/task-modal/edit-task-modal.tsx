'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CustomInput } from '../inputs/custom-input'
import { useTaskStore } from '@/app/stores/task-store'
import { Task } from '@/app/types/task'
import { 
  getTaskFormSchema,
  TaskFormData,
  TaskPriority,
  TaskTypes,
  TaskRoles,
  RecurringFrequencies,
  DaysOfWeek,
  RecurringFrequency,
  DayOfWeek,
  TaskRole,
  TaskPriorities
} from './schema'
import { useTranslations } from 'next-intl'
import { Pencil, Plus } from 'lucide-react'
import { CustomSelect } from '../selects/custom-select'
import { CustomButtonSelect, CustomButtonSelectField } from '../selects/custom-button-select'
import { Checkbox } from '@/components/ui/checkbox'
import { createLocalISOString } from '@/lib/utils/date'

interface EditTaskModalProps {
  children: React.ReactNode
  title: string
  taskId: string
}

export function EditTaskModal({
  children,
  title,
  taskId,
}: EditTaskModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('Task')
  const validationMessage = useTranslations('Validation')
  const { getTaskById, updateTask } = useTaskStore()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(getTaskFormSchema()),
  })

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShouldShowModal(false)
    }
  }

  const handleShowModal = async () => {
    const task = getTaskById(taskId)
    if (!task) {
      console.error(`Task with ID ${taskId} not found`)
      return
    }

    // Split datetime into date and time components
    const dueDate = task.dueDateTime.split('T')[0]
    const dueTime = task.dueDateTime.split('T')[1].slice(0, 5) // Get HH:mm

    // Split recurring end datetime if present
    let recurringEndDate, recurringEndTime
    if (task.recurringEndDateTime) {
      recurringEndDate = task.recurringEndDateTime.split('T')[0]
      recurringEndTime = task.recurringEndDateTime.split('T')[1].slice(0, 5)
    }

    // Map the priority variant back to the form's priority type
    const priorityMap = {
      danger: 'Urgent',
      warning: 'High',
      success: 'Normal',
      slate: 'Low'
    } as const

    // Filter out any invalid roles and replace with valid ones
    const validRoles = (task.assignedToRoles || []).filter(role => 
      TaskRoles.includes(role as TaskRole)
    ) as TaskRole[]

    // If we filtered out all roles, default to 'All'
    if (validRoles.length === 0 && task.assignedToRoles && task.assignedToRoles.length > 0) {
      validRoles.push('All')
    }

    // Reset form with task data
    reset({
      template: task.template || '',
      priority: priorityMap[task.priority.variant] as TaskPriority,
      taskTitle: task.title,
      description: task.description,
      type: task.type || 'One-time',
      dueDate,
      dueTime,
      location: task.location || '',
      assignToUser: task.assignedTo || '',
      assignToRoles: validRoles,
      // Set recurring task fields if applicable
      ...(task.type === 'Recurring' && {
        recurringFrequency: task.recurringFrequency as RecurringFrequency,
        recurringDays: task.recurringDays as DayOfWeek[],
        recurringEndDate: recurringEndDate || '',
        recurringEndTime: recurringEndTime || ''
      })
    })

    setShouldShowModal(true)
  }

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
      
      // Handle recurring end date/time if present
      let recurringEndDateTime
      if (data.type === 'Recurring' && data.recurringEndDate && data.recurringEndTime) {
        recurringEndDateTime = createLocalISOString(data.recurringEndDate, data.recurringEndTime)
      }
      
      // Update task
      const currentTask = getTaskById(taskId)
      if (!currentTask) {
        throw new Error(`Task with ID ${taskId} not found`)
      }

      // Update task with form data
      const updatedTask: Task = {
        ...currentTask,
        priority: priorityMap[data.priority],
        title: data.taskTitle,
        description: data.description || '',
        dueDateTime,
        lastUpdatedDate: new Date().toISOString(),
        location: data.location,
        type: data.type,
        template: data.template,
        assignedTo: data.assignToUser,
        assignedToRoles: data.assignToRoles,
        // Add recurring task properties if type is Recurring
        ...(data.type === 'Recurring' && {
          recurringFrequency: data.recurringFrequency,
          recurringDays: data.recurringDays,
          recurringEndDateTime,
          timezone: 'UTC' // Default to UTC until we implement location-based timezones
        })
      }

      // Update task in store
      updateTask(taskId, updatedTask)
      setShouldShowModal(false)

    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up form when modal closes
  useEffect(() => {
    if (!shouldShowModal) {
      reset()
    }
  }, [shouldShowModal, reset])

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
        <div className="flex items-center">
          <button
            onClick={() => handleShowModal()}
            className="flex items-center rounded-full transition-colors duration-200 hover:bg-black group"
            aria-label="Edit Task"
          >
            <span className="p-2 group-hover:text-white">
              <Pencil className="w-4 h-4" />
            </span>
          </button>
        </div>
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
              <form onSubmit={(e) => {
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
                }}  className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold">Template</label>
                  <Controller
                    control={control}
                    name="template"
                    render={({ field }) => (
                      <CustomSelect
                        placeholder="Select"
                        options={[
                          { value: 'template1', label: 'Template 1' },
                          { value: 'template2', label: 'Template 2' },
                        ]}
                        value={field.value ? [field.value] : []}
                        onChange={(values) => field.onChange(values[0] || '')}
                      />
                    )}
                  />
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
                                  value: '234567',
                                  label: 'Aiden Moore',
                                  avatar: '/placeholder.svg',
                                },
                                {
                                  value: '345678',
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
                            {errors.assignToUser && (
                              <p className="text-sm text-red-500 mt-1">{errors.assignToUser.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShouldShowModal(false)}
                    className="p-2 rounded-full transition-colors duration-200 hover:bg-black hover:text-white w-32"
                    disabled={isSubmitting}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="p-2 rounded-full transition-colors duration-200 bg-black text-white hover:bg-gray-800 w-32"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('saving') : t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
