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
import { Task } from '@/app/types/task'
import { OpportunityInfoCard } from '../opportunity-info-card/opportunity-info-card'
import { useCreateTask } from '@/app/api/hooks/useCreateTask'
import { TaskCreateVM } from '@/app/api/functions/tasks'
import { toast } from 'react-toastify'
import { useGetUsersByTenant } from '@/app/api/hooks/useGetUsersByTenant'
import { useGetTenant } from '@/app/api/hooks/useGetTenant'
import { Location } from '@/app/types/location'
import { useSession } from 'next-auth/react'
import { getUserFullName } from '@/app/types/user'

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
  const { createTask, isLoading: isCreatingTask, error: createTaskError } = useCreateTask()
  
  // Get session for tenant ID
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  
  // Use hooks directly instead of providers
  const { users, isLoading: isLoadingUsers, totalCount } = useGetUsersByTenant({
    tenantId: tenantId!,
    page: 1,
    perPage: 100 // Fetch a larger number to have all users available
  })
  
  const { tenant, locations: tenantLocations, isLoading: isLoadingTenant } = useGetTenant({
    tenantId: tenantId!
  })
  
  // Transform users into format needed for select components
  const usersForSelect = users.map(user => ({
    value: user.id,
    label: getUserFullName(user),
    avatar: '/placeholder.svg' // Default avatar, could be replaced with actual user avatar
  }))
  
  const [locations, setLocations] = useState<{value: string, label: string}[]>([])

  // Initialize form before any effects that use form functions
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

  // Debug users data
  useEffect(() => {
    console.log('Users for select in task modal:', usersForSelect)
    console.log('Total users available:', totalCount)
    console.log('Is loading users:', isLoadingUsers)
  }, [usersForSelect, totalCount, isLoadingUsers])

  // Process locations for dropdown when tenant data is available
  useEffect(() => {
    // This effect will run whenever tenantLocations changes
    if (tenantLocations && tenantLocations.length > 0) {
      console.log(`Processing ${tenantLocations.length} locations for dropdown`)
      
      const locationOptions = tenantLocations.map((location: Location) => ({
        value: location.id,
        label: location.address || location.name || 'Unknown location'
      }))
      
      setLocations(locationOptions)
      console.log('Locations processed for dropdown:', locationOptions)
      
      // If form has no location selected yet and we have locations, set the first one as default
      if (locationOptions.length > 0) {
        const formLocation = watch('location')
        if (!formLocation) {
          console.log('Setting default location:', locationOptions[0].value)
          setValue('location', locationOptions[0].value)
        }
      }
    } else {
      console.log('No locations available from tenant context')
      // Clear locations if tenant locations are empty
      setLocations([])
    }
  }, [tenantLocations, setValue, watch])

  // Force re-fetch locations when modal is opened
  useEffect(() => {
    if (shouldShowModal) {
      console.log('Modal opened, checking for locations')
      if (tenantLocations && tenantLocations.length > 0) {
        console.log(`Modal has ${tenantLocations.length} locations available`)
      }
    }
  }, [shouldShowModal, tenantLocations])

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Prevent modal from closing when backdrop is clicked
    e.stopPropagation();
  }

  const handleShowModal = () => {
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
      
      // Create API task data
      const taskCreateData: TaskCreateVM = {
        tenantId: data.tenantId!, // Default tenant ID
        title: data.taskTitle,
        description: data.description || '',
        status: 'open',
        assignedTo:  data.assignToUser!, // Default if empty
        workfileId: defaultRelation?.type === 'workfile' ? defaultRelation.id : '82A58EFE-7B8E-41A4-BE2A-6ABCE7A23359',
        locationId: data.location || 'C8AF6E95-020C-4102-A5ED-EEF8CACC0093', // Use selected location or default
        dueDate: new Date(dueDateTime).toISOString(),
        priority: data.priority,
        type: data.type,
        endDate: data.type === 'Recurring' && data.recurringEndDate && data.recurringEndTime
          ? new Date(createLocalISOString(data.recurringEndDate, data.recurringEndTime)).toISOString()
          : new Date(dueDateTime).toISOString(),
        roles: data.assignToRoles ? data.assignToRoles.join(',') : ''
      }
      
      // Log form data for debugging
      console.log('Form submission:', {
        rawFormData: data,
        apiTaskData: taskCreateData
      })
      
      // Call the API to create the task
      createTask(taskCreateData, {
        onSuccess: (response) => {
          if (response.success) {
            toast.success("Task created successfully");
            setShouldShowModal(false);
          } else {
            toast.error("Failed to create task: " + (response.error || "Unknown error"));
          }
        },
        onError: (error) => {
          console.error('Error creating task:', error);
          toast.error("Failed to create task: " + (error instanceof Error ? error.message : "Unknown error"));
        }
      });
      
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error("Failed to process form: " + (error instanceof Error ? error.message : "Unknown error"));
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
          className="flex justify-center items-center w-8 h-8 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
          aria-label="New Task"
        >
          {children}
        </button>
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
              {defaultRelation?.type === 'opportunity' && (
                <OpportunityInfoCard opportunityId={defaultRelation.id} />
              )}
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
                className="mt-6 space-y-6"
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
                    <p className="mt-1 text-sm text-red-500">{errors.template.message}</p>
                  )}
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
                    {errors.priority && (
                      <p className="mt-1 text-sm text-red-500">{errors.priority.message}</p>
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
                            placeholder={isLoadingTenant ? t('loading-locations') : t('location-placeholder')}
                            options={locations.length > 0 ? locations : [{ value: '', label: t('no-locations-available') }]}
                            value={field.value ? [field.value] : []}
                            onChange={(values) => field.onChange(values[0] || '')}
                            // isDisabled={isLoadingTenant}
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
                      {errors.type && (
                        <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
                      )}
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
                          {errors.recurringFrequency && (
                            <p className="mt-1 text-sm text-red-500">{errors.recurringFrequency.message}</p>
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
                            <p className="mt-1 text-sm text-red-500">{errors.recurringDays.message}</p>
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
                            <p className="mt-1 text-sm text-red-500">{errors.recurringEndDate.message}</p>
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
                            <p className="mt-1 text-sm text-red-500">{errors.recurringEndTime.message}</p>
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
                      {errors.assignToRoles && (
                        <p className="mt-1 text-sm text-red-500">{errors.assignToRoles.message}</p>
                      )}
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
                          </>
                        )}
                      />
                      {errors.assignToUser && (
                        <p className="mt-1 text-sm text-red-500">{errors.assignToUser.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-end mt-8">
                  <Button
                    type="button"
                    onClick={() => setShouldShowModal(false)}
                    className="p-2 w-32 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
                    disabled={isSubmitting}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="p-2 w-32 text-white bg-black rounded-full transition-colors duration-200 hover:bg-gray-800"
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
