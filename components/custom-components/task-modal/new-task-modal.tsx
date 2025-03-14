'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { CustomSelect } from '../selects/custom-select'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  getTaskFormSchema, 
  TaskFormData, 
  TaskRoles,
  TaskPriorities,
  TaskTypes,
  TaskRole,
  TaskPriority,
  TaskType
} from './schema'
import { CustomInput } from '../inputs/custom-input'
import { Checkbox } from '@/components/ui/checkbox'

interface NewTaskModalProps {
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
}

export default function NewTaskModal({
  children,
  isOpen,
  onOpenChange,
  title,
}: NewTaskModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const validationMessage = useTranslations('Validation')
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(getTaskFormSchema(validationMessage)),
    defaultValues: {
      template: '',
      priority: 'Low',
      taskTitle: '',
      description: '',
      location: '',
      type: 'One-time',
      dueDate: '',
      time: '',
      assignToUser: '',
      assignToRoles: [],
      assignToMe: false
    },
  })

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShouldShowModal(false)
    }
  }

  const handleShowModal = () => {
    setShouldShowModal(true)
  }

  const onSubmit = (data: TaskFormData) => {
    console.log('Form data:', data)
    // Handle form submission
    setShouldShowModal(false)
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

  const buttonStyles = {
    base: "px-4 py-2 rounded-full transition-colors duration-200",
    selected: "bg-black text-white",
    unselected: "bg-gray-100 hover:bg-black hover:text-white"
  }

  return (
    <>
      <div onClick={() => handleShowModal()}>
        {children}
      </div>

      {shouldShowModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{title}</h2>
              <button onClick={() => setShouldShowModal(false)} className="p-1">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="text-sm text-gray-600 mb-6">
                To link this task to a specific subject, make sure to start from the relevant screen, such as
                Vehicle Owner, Opportunity, Workfiles, or Vendor.
              </div>

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
                  <h3 className="text-lg font-bold mb-4">Task Information</h3>
                  
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Priority</label>
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <div className="flex w-full gap-2">
                          {TaskPriorities.map((priority) => (
                            <button
                              key={priority}
                              type="button"
                              onClick={() => field.onChange(priority)}
                              className={`${buttonStyles.base} flex-1 ${
                                field.value === priority 
                                  ? buttonStyles.selected 
                                  : buttonStyles.unselected
                              }`}
                            >
                              {priority}
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <Controller
                      control={control}
                      name="taskTitle"
                      render={({ field }) => (
                        <CustomInput
                          label="Task title"
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
                          label="Task description"
                          type="text"
                          error={errors.description?.message}
                          {...field}
                        />
                      )}
                    />

                    <div>
                      <label className="block mb-2 font-semibold">Location</label>
                      <Controller
                        control={control}
                        name="location"
                        render={({ field }) => (
                          <CustomSelect
                            placeholder="Select"
                            options={[
                              { value: 'location1', label: 'Location 1' },
                              { value: 'location2', label: 'Location 2' },
                            ]}
                            value={field.value ? [field.value] : []}
                            onChange={(values) => field.onChange(values[0] || '')}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">Task type</h3>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <div className="flex w-full gap-2">
                        {TaskTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            className={`${buttonStyles.base} flex-1 ${
                              field.value === type 
                                ? buttonStyles.selected 
                                : buttonStyles.unselected
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Controller
                        control={control}
                        name="dueDate"
                        render={({ field }) => (
                          <CustomInput
                            label="Due Date"
                            type="date"
                            {...field}
                            placeholder="Due Date"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Controller
                        control={control}
                        name="time"
                        render={({ field }) => (
                          <CustomInput
                            label="Time"
                            type="time"
                            {...field}
                            placeholder="Time"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">Assign to</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Assign to roles</h4>
                      <Controller
                        control={control}
                        name="assignToRoles"
                        render={({ field }) => (
                          <div className="space-y-2">
                            {TaskRoles.map((role) => (
                              <div key={role} className="flex items-center space-x-2">
                                <Checkbox
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
                                <label>{role}</label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Assign to user</h4>
                      <Controller
                        control={control}
                        name="assignToUser"
                        render={({ field }) => (
                          <CustomSelect
                            placeholder="Select"
                            options={[
                              { value: 'user1', label: 'User 1' },
                              { value: 'user2', label: 'User 2' },
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
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <label>Assign to me</label>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShouldShowModal(false)}
                    className="px-8 py-2 rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors duration-200 w-64"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 w-64"
                    disabled={isSubmitting}
                  >
                    Save
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
