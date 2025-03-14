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
import { CustomInput } from '../inputs/custom-input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/app/stores/task-store'
import { Task } from '@/app/types/task'

interface NewTaskModalProps {
  children: React.ReactNode
  title: string
}

export function NewTaskModal({
  children,
  title,
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
    resolver: zodResolver(getTaskFormSchema(validationMessage)),
    defaultValues: {
      template: '',
      priority: 'Normal' as TaskPriority,
      taskTitle: '',
      description: '',
      location: '',
      type: 'One-time' as TaskType,
      dueDate: '',
      time: '',
      assignToUser: '',
      assignToRoles: [],
      assignToMe: false,
      recurringFrequency: 'Every Day',
      recurringDays: []
    },
  })

  const watchType = watch('type')

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsLoading(true)
      
      // Create task from form data
      const mockTask: Task = {
        id: '473829',
        priority: {
            variant: 'danger',
            text: 'URGENT'
        },
        title: 'Insurance Documentation Validation',
        description: 'Verify all paperwork required by the insurance provider',
        createdBy: 'Charlie Thompson',
        due: '2025-03-12',
        relatedTo: 'Insurance, Progressive',
        email: 'charliethompson@xpto.com',
        phone: '123-456-7890',
        message: '27',
        assignedTo: '123456'
      }
      
      console.log('Adding task:', mockTask)
      addTask(mockTask)
      console.log('Task added successfully')
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
        <div className="flex items-center">
          <button
            onClick={() => handleShowModal()}
            className="flex items-center rounded-full transition-colors duration-200 hover:bg-black group"
            aria-label="New Task"
          >
            <span className="p-2 group-hover:text-white">
              {children}
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
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Form submit event triggered');
                  const result = handleSubmit((data) => {
                    console.log('Form validation passed, data:', data);
                    return onSubmit(data);
                  }, (errors) => {
                    console.error('Form validation failed:', errors);
                  })(e);
                  console.log('Form submission result:', result);
                }} 
                className="space-y-6"
              >
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
                          <div>
                            <CustomSelect
                              options={[
                                { value: 'location a', label: 'Location A' },
                                { value: 'location b', label: 'Location B' },
                              ]}
                              value={[field.value]}
                              onChange={(value) => field.onChange(value[0])}
                            />
                            {errors.location && (
                              <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                            )}
                          </div>
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
                          name="time"
                          render={({ field }) => (
                            <CustomInput
                              label={t('time')}
                              type="time"
                              error={errors.time?.message}
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
                          <CustomSelect
                            placeholder={t('select-user')}
                            options={[
                              {
                                value: 'Alexander Walker',
                                label: 'Alexander Walker',
                                avatar: '/placeholder.svg',
                              },
                              {
                                value: 'Aiden Moore',
                                label: 'Aiden Moore',
                                avatar: '/placeholder.svg',
                              },
                              {
                                value: 'James Davis',
                                label: 'James Davis',
                                avatar: '/placeholder.svg',
                              },
                            ]}
                            value={field.value ? [field.value] : []}
                            onChange={(values) => field.onChange(values[0] || '')}
                          />
                        )}
                      />
                      {errors.assignToUser && (
                        <p className="text-sm text-red-500 mt-1">{errors.assignToUser.message}</p>
                      )}
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
