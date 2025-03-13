'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { CustomSelect } from '../selects/custom-select'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { getTaskFormSchema, TaskFormData } from './schema'
import { CustomInput } from '../inputs/custom-input'

interface EditTaskModalProps {
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
}

export default function EditTaskModal({
  children,
  isOpen,
  onOpenChange,
  title,
}: EditTaskModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)

  const t = useTranslations('Login')
  const validationMessage = useTranslations('Validation')
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(getTaskFormSchema(validationMessage)),
    defaultValues: {
      priority: 'Low',
    },
  })

  const handleOverlayClick = (e: React.MouseEvent) => {
    console.log('overlay click')
    if (e.target === e.currentTarget) {
      setShouldShowModal(false)
    }
  }

  const handleShowModal = () => {
    console.log('show modal')
    setShouldShowModal(true)
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
        <div className="flex items-center mr-3">
          <button
            onClick={() => handleShowModal()}
            className={`flex items-center rounded-full transition-colors duration-100 group
                       hover:bg-black`}
            aria-label="Contact Information"
          >
            <span className="p-2 hover:text-white">
              <Pencil className={`w-4 h-4 `} />
            </span>
          </button>
        </div>
        <div className="flex items-center mr-3"></div>
      </div>

      {shouldShowModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{title}</h2>
              <button onClick={() => setShouldShowModal(false)} className="p-1">
                <Plus className="w-6 h-6 rotate-45 " />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {/* 

					Fields
					
					Task Information
					Priority
						Urgent
						High
						Normal
						Low
					Task Title
					Task Description
					Location

					Task Type
						One-Time
						Recurring
						Automated
					Due Date
					Time
					Assign to user
					Assign to roles
						All
						Estimators
						Parts Managers
						CSR
						Shop Managers
						Tecnicians
						Painters

				 */}

              <h3 className="text-lg mb-2 font-bold">Task Information</h3>

              <form
                onSubmit={() => {
                  console.log('submit')
                }}
              >
                <div className="mt-8">
                  <label htmlFor="priority">Priority</label>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <CustomSelect
                        options={[
                          { value: 'urgent', label: 'Urgent' },
                          { value: 'high', label: 'High' },
                          { value: 'normal', label: 'Normal' },
                          { value: 'low', label: 'Low' },
                        ]}
                      />
                    )}
                  />
                </div>

                <div className="mt-8">
                  <Controller
                    control={control}
                    name="taskTitle"
                    render={({ field }) => (
                      <CustomInput
                        label="Task Title"
                        type="text"
                        {...field}
                        placeholder="Task Title"
                      />
                    )}
                  />
                </div>

                <div className="mt-8">
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <CustomInput
                        label="Description"
                        type="text"
                        {...field}
                        placeholder="Description"
                      />
                    )}
                  />
                </div>

                <div className="mt-8">
                  <label htmlFor="location">Location</label>
                  <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <CustomSelect
                        // multiSelect={true} //Having trouble with multiselect (error on depth)
                        options={[
                          {
                            value: 'location a',
                            label:
                              'Birch, Birch1521 W Birch St, Chicago, IL 60607',
                          },
                          {
                            value: 'location b',
                            label: 'Clark, 2034 N Clark St, Chicago, IL 60614',
                          },
                        ]}
                      />
                    )}
                  />
                </div>

                <hr />

                <h3 className="text-lg mb-2 font-bold mt-8">Task Type</h3>

                <div className="mt-8">
                  <label className="mb-8" htmlFor="type">
                    Task Type
                  </label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <CustomSelect
                        options={[
                          { value: 'One-Time', label: 'One-time' },
                          { value: 'Recurring', label: 'Recurring' },
                          { value: 'Automated', label: 'Automated' },
                        ]}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mt-8">
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
                  <div className="mt-8">
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

                <hr />

                <h3 className="text-lg mb-2 font-bold mt-8">Assign to</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mt-8">
                    <label htmlFor="assignToUser">Assign to User</label>
                    <Controller
                      control={control}
                      name="assignToUser"
                      render={({ field }) => (
                        <CustomSelect
                          //multiSelect={true} //Having trouble with multiselect (error on depth)
                          options={[
                            {
                              value: 'Alexander Walker',
                              label: 'Alexander Walker',
                            },
                            { value: 'Aiden Moore', label: 'Aiden Moore' },
                            { value: 'James Davis', label: 'James Davis' },
                          ]}
                        />
                      )}
                    />
                  </div>

                  <div className="mt-8">
                    <label htmlFor="assignToRoles">Assign to Roles</label>
                    <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                          />
                          <span className="ml-2">All</span>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                          />
                          <span className="ml-2">Estimators</span>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                          />
                          <span className="ml-2">Parts Managers</span>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                          />
                          <span className="ml-2">CSR</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                          />
                          <span className="ml-2">Shop Managers</span>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                          />
                          <span className="ml-2">Technicians</span>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 accent-black"
                          />
                          <span className="ml-2">Painters</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between">
                    <button
                      onClick={() => setShouldShowModal(false)}
                      className="px-8 py-2 border rounded-3xl w-64"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-8 py-2 bg-black text-white rounded-3xl w-64 "
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
