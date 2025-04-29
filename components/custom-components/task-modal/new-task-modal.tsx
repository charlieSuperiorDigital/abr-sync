'use client'

import { TaskCreateVM } from '@/app/api/functions/tasks'
import { useGetTenant } from '@/app/api/hooks/useGetTenant'
import { useGetUsersByTenant } from '@/app/api/hooks/useGetUsersByTenant'
import { Location } from '@/app/types/location'
import { getUserFullName } from '@/app/types/user'
import { Button } from '@/components/ui/button'
import { createLocalISOString } from '@/lib/utils/date'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { CustomInput } from '../inputs/custom-input'
import { CustomTextarea } from '../inputs/custom-textarea'
import { OpportunityInfoCard } from '../opportunity-info-card/opportunity-info-card'
import { CustomButtonSelectField } from '../selects/custom-button-select'
import { CustomSelect } from '../selects/custom-select'
import {
  DayOfWeek,
  DaysOfWeek,
  getTaskFormSchema,
  RecurringFrequencies,
  RecurringFrequency,
  TaskFormData,
  TaskPriorities,
  TaskPriority,
  TaskType,
  TaskTypes
} from './schema'
import { TASK_TEMPLATES } from './mock-tasks-templates'
import { useCreateTask } from '@/app/api/hooks/useTasks'

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

  const [locations, setLocations] = useState<{ value: string, label: string }[]>([])

  // Add function to handle template selection
  const handleTemplateChange = (templateId: string) => {
    if (!templateId) {
      // Clear form if empty selection
      reset({
        template: '',
        priority: 'Normal' as TaskPriority,
        taskTitle: '',
        description: '',
        type: 'One-time' as TaskType,
        dueDate: '',
        dueTime: '',
        location: '',
        assignToUser: '',
        assignToMe: false,
        recurringFrequency: undefined,
        recurringDays: undefined,
        recurringEndDate: '',
        recurringEndTime: ''
      });
      return;
    }

    // Find the selected template
    const selectedTemplate = TASK_TEMPLATES.find(template => template.id === templateId);
    if (selectedTemplate) {
      // Create form data from template
      const formData = {
        ...selectedTemplate.data,
        template: templateId,
        // Keep location and assignToUser empty for user to select
        location: '',
        assignToUser: ''
      };

      // Ensure recurringDays is set for weekly recurring tasks
      if (formData.type === 'Recurring' && formData.recurringFrequency === 'Every Week' && (!formData.recurringDays || formData.recurringDays.length === 0)) {
        // Default to weekdays if not specified
        formData.recurringDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[];
      }

      // Ensure recurringEndDate and recurringEndTime are set for all recurring tasks
      if (formData.type === 'Recurring' && (!formData.recurringEndDate || !formData.recurringEndTime)) {
        // Default to 1 year from now if not specified
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        formData.recurringEndDate = oneYearFromNow.toISOString().split('T')[0];
        formData.recurringEndTime = '17:00';
      }

      // Populate form with template data
      reset(formData);

      // Log for debugging
      console.log('Template selected:', selectedTemplate.name);
      console.log('Form data after template selection:', formData);
    }
  };

  // Initialize form before any effects that use form functions
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
      priority: 'Normal' as TaskPriority,
      taskTitle: '',
      description: '',
      location: '',
      type: 'One-time' as TaskType,
      dueDate: '',
      dueTime: '',
      assignToUser: '',
      assignToMe: false,
      recurringFrequency: undefined,
      recurringDays: undefined,
      recurringEndDate: '',
      recurringEndTime: ''
    },
  })


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
        tenantId: session?.user?.tenantId || '', // Get tenant ID from session
        title: data.taskTitle,
        description: data.description || '',
        status: 'open',
        assignedTo: data.assignToUser || '', // Default if empty
        workfileId: defaultRelation?.type === 'workfile' ? defaultRelation.id : '82A58EFE-7B8E-41A4-BE2A-6ABCE7A23359',
        locationId: data.location || '', // No default location ID
        dueDate: new Date(dueDateTime).toISOString(),
        priority: data.priority,
        type: Number(data.type === 'Recurring' ? 1 : 0), // 0 for One-time, 1 for Recurring
        endDate: data.type === 'Recurring' && data.recurringEndDate && data.recurringEndTime
          ? new Date(createLocalISOString(data.recurringEndDate, data.recurringEndTime)).toISOString()
          : new Date(dueDateTime).toISOString(),
        roles: '', // No longer using assignToRoles
        recurringType: 0, // Default value
        weekDays: 0, // Default value
        monthDays: 0, // Default value
        customDays: [] // Default value
      }

      // Handle recurring task specific fields
      if (data.type === 'Recurring' && data.recurringFrequency) {
        // Map recurring frequency to recurringType
        switch (data.recurringFrequency) {
          case 'Every Day':
            taskCreateData.recurringType = 0; // 0 for daily
            break;
          case 'Every Week':
            taskCreateData.recurringType = 1; // 1 for weekly
            // Convert selected days to bitwise representation
            if (data.recurringDays && data.recurringDays.length > 0) {
              let weekDaysBitwise = 0;
              data.recurringDays.forEach(day => {
                switch (day) {
                  case 'Sunday': weekDaysBitwise |= 1; break; // 2^0 = 1
                  case 'Monday': weekDaysBitwise |= 2; break; // 2^1 = 2
                  case 'Tuesday': weekDaysBitwise |= 4; break; // 2^2 = 4
                  case 'Wednesday': weekDaysBitwise |= 8; break; // 2^3 = 8
                  case 'Thursday': weekDaysBitwise |= 16; break; // 2^4 = 16
                  case 'Friday': weekDaysBitwise |= 32; break; // 2^5 = 32
                  case 'Saturday': weekDaysBitwise |= 64; break; // 2^6 = 64
                }
              });
              taskCreateData.weekDays = weekDaysBitwise;
            }
            break;
          case 'Every Month':
            taskCreateData.recurringType = 2; // 2 for monthly
            // For monthly tasks, we need to set monthDays
            // This would require additional UI to select days of month
            // For now, default to the day of month from the due date
            const dueDay = new Date(dueDateTime).getDate();
            taskCreateData.monthDays = 1 << (dueDay - 1); // Set bit for the due day
            break;
          case 'Every Year':
            taskCreateData.recurringType = 3; // 3 for yearly
            // For yearly tasks, we need to set customDays
            // Default to the due date for yearly recurrence
            taskCreateData.customDays = [new Date(dueDateTime).toISOString()];
            break;
          case 'Custom':
            taskCreateData.recurringType = 4; // 4 for custom
            // For custom tasks, we would need UI to select specific dates
            // For now, default to the due date
            taskCreateData.customDays = [new Date(dueDateTime).toISOString()];
            break;
        }
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
                        options={TASK_TEMPLATES.map(template => ({
                          value: template.id,
                          label: template.name
                        }))}
                        value={field.value ? [field.value] : []}
                        onChange={(values) => {
                          field.onChange(values[0] || '')
                          handleTemplateChange(values[0] || '')
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
                        <CustomTextarea
                          label={t('description')}
                          rows={5}
                          error={errors.description?.message}
                          className="text-left min-h-[120px] text-base"
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

                          {/* Only show weekdays selection for Weekly or Custom recurring tasks */}
                          {(watch('recurringFrequency') === 'Every Week' || watch('recurringFrequency') === 'Custom') && (
                            <>
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
                            </>
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
                  <div className="grid grid-cols-1 gap-6">
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
                                onChange={(values) => {
                                  field.onChange(values[0] || '')
                                }}
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                // Use the current user's ID from the session
                                if (session?.user?.userId) {
                                  field.onChange(session.user.userId)
                                }
                              }}
                              className="px-4 py-2 mt-2 text-base font-semibold text-black bg-gray-200 rounded-md transition-colors hover:bg-gray-300"
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
