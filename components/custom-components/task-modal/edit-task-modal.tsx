'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
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
import { useTaskStore } from '@/app/stores/task-store'

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
  const { getTaskById } = useTaskStore()

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShouldShowModal(false)
    }
  }

  const handleShowModal = () => {
    const task = getTaskById(taskId)
    console.log('Task loaded:', task)
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
      recurringFrequency: undefined,
      recurringDays: undefined
    },
  })

  const watchType = watch('type')

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsLoading(true)
      
      // Map priority to the correct format
      const priorityMap = {
        Urgent: { variant: 'danger', text: 'Urgent' },
        High: { variant: 'warning', text: 'High' },
        Normal: { variant: 'success', text: 'Normal' },
        Low: { variant: 'slate', text: 'Low' }
      } as const

      // Create task from form data
      const taskUpdate = {
        priority: priorityMap[data.priority],
        title: data.taskTitle,
        description: data.description || '',
        location: data.location,
        template: data.template,
        due: data.dueDate,
        assignedTo: data.assignToMe ? 'currentUserId' : data.assignToUser, // TODO: Get currentUserId from auth context
        lastUpdatedDate: new Date().toISOString(),
        // Add recurring task properties if type is Recurring
        ...(data.type === 'Recurring' && {
          recurringFrequency: data.recurringFrequency,
          recurringDays: data.recurringDays,
        })
      }
      
      console.log('Task update object:', {
        formData: data,
        processedUpdate: taskUpdate
      })
      
      // Commented for development
      // updateTask(taskId, taskUpdate)
      // setShouldShowModal(false)
      
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
                          name="time"
                          render={({ field }) => (
                            <CustomInput
                              label={t('time')}
                              type="time"
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
