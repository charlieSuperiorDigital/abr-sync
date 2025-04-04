'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CustomInput } from '../inputs/custom-input'
import { Task } from '@/app/types/task'
import { Task as ApiTask } from '@/app/api/functions/tasks'
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
import { useTenant } from '@/app/context/TenantProvider'
import { Location } from '@/app/types/location'
import { useUsers } from '@/app/context/UsersProvider'
import { useUpdateTask } from '@/app/api/hooks/useUpdateTask'
import { UpdateTaskPayload } from '@/app/api/functions/tasks'

// Extended task type to handle both Task and ApiTask properties
interface ExtendedTask {
  id?: string;
  tenantId?: string;
  title?: string;
  description?: string;
  status?: string;
  assignedTo?: string;
  assignedUser?: any; // Using any to avoid conflicts between different User types
  workfileId?: string;
  workfile?: any;
  locationId?: string;
  location?: any;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  priority?: string | {
    variant: 'danger' | 'warning' | 'success' | 'slate';
    text: 'Urgent' | 'High' | 'Normal' | 'Low';
  };
  type?: string;
  endDate?: string;
  roles?: string;
  createdBy?: string;
  createdByUser?: any;
  
  // Additional fields that might be in either interface
  dueDateTime?: string;
  recurringFrequency?: string;
  recurringDays?: string[];
  recurringEndDateTime?: string;
  assignedToRoles?: string[];
  timezone?: string;
}

interface EditTaskModalProps {
  children: React.ReactNode
  title: string
  taskId: string
  task?: Task | ApiTask
}

export function EditTaskModal({
  children,
  title,
  taskId,
  task
}: EditTaskModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [originalTask, setOriginalTask] = useState<ExtendedTask | null>(null)
  const t = useTranslations('Task')
  const validationMessage = useTranslations('Validation')
  const { tenant, locations: tenantLocations, isLoading: isLoadingTenant } = useTenant()
  const { usersForSelect, isLoading: isLoadingUsers, totalCount } = useUsers()
  const [locations, setLocations] = useState<{value: string, label: string}[]>([])
  const { updateTaskAsync, isLoading: isUpdating, isError, error } = useUpdateTask()

  // Debug users data
  useEffect(() => {
    console.log('Users for select in edit task modal:', usersForSelect)
    console.log('Total users available:', totalCount)
    console.log('Is loading users:', isLoadingUsers)
  }, [usersForSelect, totalCount, isLoadingUsers])

  // Process locations for dropdown when tenant data is available
  useEffect(() => {
    if (tenantLocations && tenantLocations.length > 0) {
      const locationOptions = tenantLocations.map((location: Location) => ({
        value: location.id,
        label: location.address
      }))
      setLocations(locationOptions)
    }
  }, [tenantLocations])

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
    defaultValues: {
      template: '',
      tenantId: '',
      priority: 'Normal' as TaskPriority,
      taskTitle: '',
      description: '',
      location: '',
      type: 'One-time',
      dueDate: '',
      dueTime: '',
      assignToUser: '',
      assignToRoles: [],
      recurringFrequency: undefined,
      recurringDays: undefined,
      recurringEndDate: '',
      recurringEndTime: ''
    },
  })

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShouldShowModal(false)
    }
  }

  const handleShowModal = async () => {
    if (!task) {
      console.error(`Task with ID ${taskId} not found`)
      return
    }

    // Cast task to ExtendedTask to handle all possible properties
    const extendedTask = task as ExtendedTask
    setOriginalTask(extendedTask)
    
    // Extract date and time from dueDate or dueDateTime
    let dueDate = '', dueTime = '00:00'
    
    if (extendedTask.dueDateTime) {
      const parts = extendedTask.dueDateTime.split('T')
      dueDate = parts[0]
      dueTime = parts[1]?.slice(0, 5) || '00:00'
    } else if (extendedTask.dueDate) {
      const parts = extendedTask.dueDate.split('T')
      dueDate = parts[0]
      dueTime = parts[1]?.slice(0, 5) || '00:00'
    }

    // Extract recurring end date and time if present
    let recurringEndDate = '', recurringEndTime = ''
    if (extendedTask.recurringEndDateTime) {
      const parts = extendedTask.recurringEndDateTime.split('T')
      recurringEndDate = parts[0]
      recurringEndTime = parts[1]?.slice(0, 5) || '00:00'
    }

    // Map priority to form values
    let priorityValue: TaskPriority = 'Normal'
    
    if (typeof extendedTask.priority === 'string') {
      // Try to map string priority to enum value
      priorityValue = extendedTask.priority as TaskPriority
    } else if (extendedTask.priority && typeof extendedTask.priority === 'object' && 'text' in extendedTask.priority) {
      // Extract text from priority object
      priorityValue = extendedTask.priority.text as TaskPriority
    }

    // Reset form with task data
    reset({
      priority: priorityValue,
      taskTitle: extendedTask.title || '',
      description: extendedTask.description || '',
      type: extendedTask.type as any || 'One-time',
      dueDate: dueDate,
      dueTime: dueTime,
      location: extendedTask.locationId || '',
      assignToUser: extendedTask.assignedTo || '',
      assignToRoles: (extendedTask.assignedToRoles || []) as TaskRole[],
      tenantId: extendedTask.tenantId || '',
      // Set recurring task fields if applicable
      ...(extendedTask.type === 'Recurring' && {
        recurringFrequency: (extendedTask.recurringFrequency || 'Every Day') as RecurringFrequency,
        recurringDays: (extendedTask.recurringDays || []) as DayOfWeek[],
        recurringEndDate: recurringEndDate,
        recurringEndTime: recurringEndTime,
      })
    })
    
    setShouldShowModal(true)
  }

  const watchType = watch('type')

  const onSubmit = async (data: TaskFormData) => {
    try {
      console.log('Starting task update process...')
      setIsLoading(true)

      if (!originalTask) {
        console.error('No original task data available')
        return
      }

      if (!originalTask.id) {
        console.error('Task ID is missing')
        return
      }

      console.log('Original task data:', originalTask)
      console.log('Form data submitted:', data)

      // Map priority to the correct task variants
      const priorityMap: Record<TaskPriority, { variant: 'danger' | 'warning' | 'success' | 'slate', text: TaskPriority }> = {
        'Urgent': { variant: 'danger', text: 'Urgent' },
        'High': { variant: 'warning', text: 'High' },
        'Normal': { variant: 'success', text: 'Normal' },
        'Low': { variant: 'slate', text: 'Low' }
      }

      // Combine date and time into ISO string preserving local time
      const dueDate = createLocalISOString(data.dueDate, data.dueTime)
      console.log('Combined due date and time:', dueDate)
      
      // Handle recurring end date/time if present
      let recurringEndDateTime
      if (data.type === 'Recurring' && data.recurringEndDate && data.recurringEndTime) {
        recurringEndDateTime = createLocalISOString(data.recurringEndDate, data.recurringEndTime)
        console.log('Combined recurring end date and time:', recurringEndDateTime)
      }
      
      // Create updated task object
      const updatedTask: UpdateTaskPayload = {
        id: originalTask.id,
        priority: data.priority,
        title: data.taskTitle,
        description: data.description || '',
        dueDate,
        locationId: data.location,
        type: data.type,
        assignedTo: data.assignToUser,
        assignedToRoles: data.assignToRoles as string[],
      }
      
      // Add recurring task properties if type is Recurring
      if (data.type === 'Recurring') {
        updatedTask.recurringFrequency = data.recurringFrequency;
        updatedTask.recurringDays = data.recurringDays;
        updatedTask.recurringEndDateTime = recurringEndDateTime;
        updatedTask.timezone = 'UTC'; // Default to UTC until we implement location-based timezones
      }

      console.log('Full updated task object:', updatedTask)

      // Filter out unchanged fields
      const changedFields: UpdateTaskPayload = {
        id: originalTask.id // Always include the ID
      }
      
      // Compare and keep only changed fields
      Object.entries(updatedTask).forEach(([key, value]) => {
        const originalKey = key as keyof ExtendedTask
        
        // Handle priority specially since it can be a string or object
        if (key === 'priority') {
          const originalPriority = originalTask.priority
          const newPriority = value
          
          if (typeof originalPriority === 'string' && originalPriority !== newPriority) {
            changedFields[key as keyof UpdateTaskPayload] = newPriority
            console.log(`Field '${key}' changed from '${originalPriority}' to '${newPriority}'`)
          } else if (typeof originalPriority === 'object' && 'text' in originalPriority && 
                    originalPriority.text !== newPriority) {
            changedFields[key as keyof UpdateTaskPayload] = newPriority
            console.log(`Field '${key}' changed from '${originalPriority.text}' to '${newPriority}'`)
          }
        } 
        // Handle date fields - compare only the date part
        else if (key === 'dueDate' && originalTask.dueDate) {
          if (new Date(originalTask.dueDate).toDateString() !== new Date(value as string).toDateString()) {
            changedFields[key as keyof UpdateTaskPayload] = value
            console.log(`Field '${key}' changed from '${originalTask.dueDate}' to '${value}'`)
          }
        }
        // For all other fields, do a simple comparison
        else if (originalTask[originalKey] !== value && key !== 'id') {
          changedFields[key as keyof UpdateTaskPayload] = value
          console.log(`Field '${key}' changed from '${originalTask[originalKey]}' to '${value}'`)
        }
      })

      // Log the changed fields
      console.log('Task ID:', originalTask.id)
      console.log('Changed fields:', changedFields)
      
      // Only proceed if there are changes to submit
      if (Object.keys(changedFields).length <= 1) {
        console.log('No changes detected, skipping update')
        setShouldShowModal(false)
        return
      }
      
      console.log('Submitting changes to API...')
      const result = await updateTaskAsync(changedFields)
      console.log('API response:', result)
      
      if (result.success) {
        console.log('Task updated successfully!')
        setShouldShowModal(false)
      } else {
        console.error('Error updating task:', result.error)
        // Keep modal open to allow user to try again
      }

    } catch (error) {
      console.error('Error updating task:', error)
      // Keep modal open to allow user to try again
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
          className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
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
                  <h3 className="mb-4 text-lg font-bold">{t('task-information')}</h3>
                  
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
                            placeholder={isLoadingTenant ? t('loading-locations') : t('location-placeholder')}
                            options={locations.length > 0 ? locations : [{ value: '', label: t('no-locations-available') }]}
                            value={field.value ? [field.value] : []}
                            onChange={(values) => field.onChange(values[0] || '')}
                            isDisabled={isLoadingTenant}
                          />
                        )}
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
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
                        <div className="flex flex-col gap-4 mt-4 w-full">
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
                  <h3 className="mb-4 text-lg font-bold">{t('assign-to')}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="mb-2 font-semibold">{t('assign-to-roles')}</h4>
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
                    <div className="mb-6">
                      <h4 className="mb-2 font-semibold">{t('assign-to-user')}</h4>
                      <Controller
                        control={control}
                        name="assignToUser"
                        render={({ field }) => (
                          <>
                            {isLoadingUsers ? (
                              <div className="w-full px-4 py-2 text-left rounded-full bg-[#E3E3E3] flex items-center">
                                <span className="text-gray-500">{t('loading-users')}</span>
                              </div>
                            ) : (
                              <CustomSelect
                                key={usersForSelect.length} // Force re-render when options change
                                placeholder={t('select-user')}
                                options={usersForSelect || []}
                                value={field.value ? [field.value] : []}
                                onChange={(values) => field.onChange(values[0] || '')}
                              />
                            )}
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
                              <p className="mt-1 text-sm text-red-500">{errors.assignToUser.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {isError && (
                  <div className="p-4 text-white bg-red-500 rounded-md">
                    <p className="font-semibold">Error updating task:</p>
                    <p>{error?.message || 'Unknown error occurred'}</p>
                  </div>
                )}

                <div className="flex gap-4 justify-end mt-8">
                  <button
                    type="button"
                    onClick={() => setShouldShowModal(false)}
                    className="p-2 w-32 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
                    disabled={isSubmitting || isLoading || isUpdating}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex justify-center items-center p-2 w-32 text-white bg-black rounded-full transition-colors duration-200 hover:bg-gray-800"
                    disabled={isSubmitting || isLoading || isUpdating}
                  >
                    {isSubmitting || isLoading || isUpdating ? (
                      <>
                        <svg className="mr-2 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('saving')}
                      </>
                    ) : t('save')}
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
