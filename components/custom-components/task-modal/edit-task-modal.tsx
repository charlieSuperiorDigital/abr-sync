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

    // Set form values
    setValue('priority', priorityMap[task.priority.variant] as TaskPriority)
    setValue('taskTitle', task.title)
    setValue('description', task.description)
    setValue('type', task.type || 'One-time')
    setValue('dueDate', dueDate)
    setValue('dueTime', dueTime)
    setValue('location', task.location || '')
    setValue('assignToUser', task.assignedTo || '')
    setValue('assignToRoles', (task.assignedToRoles || []) as TaskRole[])
    setValue('assignToMe', task.assignedTo === 'currentUserId') // TODO: Get from auth context

    // Set recurring task fields if applicable
    if (task.type === 'Recurring') {
      setValue('recurringFrequency', task.recurringFrequency as RecurringFrequency)
      setValue('recurringDays', task.recurringDays as DayOfWeek[])
      setValue('recurringEndDate', recurringEndDate || '')
      setValue('recurringEndTime', recurringEndTime || '')
    }

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
      type: 'One-time',
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
        assignedTo: data.assignToMe ? 'currentUserId' : data.assignToUser, // TODO: Get currentUserId from auth context
        assignedToRoles: data.assignToRoles as TaskRole[],
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            options={[
                              { value: 'location a', label: 'Location A' },
                              { value: 'location b', label: 'Location B' },
                            ]}
                            value={[field.value]}
                            onChange={(value) => field.onChange(value[0])}
                          />
                        )}
                      />
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
                        )}
                      />
                      <div className="mt-2">
                        <Controller
                          control={control}
                          name="assignToMe"
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="assignToMe"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <label htmlFor="assignToMe" className="text-sm font-medium">
                                {t('assign-to-me')}
                              </label>
                            </div>
                          )}
                        />
                      </div>
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
