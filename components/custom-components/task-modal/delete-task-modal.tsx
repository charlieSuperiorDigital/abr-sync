'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface DeleteTaskModalProps {
  children: React.ReactNode
  title: string
}

export function DeleteTaskModal({
  children,
  title,
}: DeleteTaskModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('Task')

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShouldShowModal(false)
    }
  }

  const handleShowModal = () => {
    setShouldShowModal(true)
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      // Handle delete logic here
      setShouldShowModal(false)
    } catch (error) {
      console.error('Error deleting task:', error)
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
            aria-label="Delete Task"
          >
            <span className="p-2 group-hover:text-white">
              <Trash2 className="w-4 h-4" />
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
              <h3 className="text-lg mb-2 font-bold">
                {t('confirm-delete-title')}
              </h3>
              <p className="text-sm mb-4">
                {t('confirm-delete-description')}
              </p>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShouldShowModal(false)}
                  className="p-2 rounded-full transition-colors duration-200 hover:bg-black hover:text-white w-32"
                  disabled={isLoading}
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 rounded-full transition-colors duration-200 bg-black text-white hover:bg-gray-800 w-32"
                  disabled={isLoading}
                >
                  {isLoading ? t('deleting') : t('delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
