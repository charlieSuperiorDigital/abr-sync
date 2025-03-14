'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { CustomSelect } from '../selects/custom-select'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { getTaskFormSchema, TaskFormData } from './schema'
import { CustomInput } from '../inputs/custom-input'
import Link from 'next/link'

interface DeleteTaskModalProps {
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
}

export default function DeleteTaskModal({
  children,
  isOpen,
  onOpenChange,
  title,
}: DeleteTaskModalProps) {
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
        <div className="flex items-center">
          <button
            onClick={() => handleShowModal()}
            className={`flex items-center rounded-full transition-colors duration-100 group
                       hover:bg-black`}
            aria-label="Contact Information"
          >
            <span className="p-2 hover:text-white">
              <Trash2 className={`w-4 h-4 `} />
            </span>
          </button>
        </div>
        <div className="flex items-center"></div>
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
                <Plus className="w-6 h-6 rotate-45 " />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <h3 className="text-lg mb-2 font-bold">
                ID 307815 • Parts Vendor Confirmation
              </h3>
              <p className="text-sm mb-4">
                Confirm the parts vendor for the 2018 Toyota Camry
              </p>

              <form
                onSubmit={() => {
                  console.log('submit')
                }}
              >
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
                      Delete
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
