'use client'

import * as React from 'react'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUpdateTask } from '@/app/api/hooks/useUpdateTask'

interface ConfirmTaskDoneModalProps {
  taskId: string
  taskTitle: string
  onComplete?: () => void
}

export function ConfirmTaskDoneModal({
  taskId,
  taskTitle,
  onComplete
}: ConfirmTaskDoneModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { updateTaskAsync, isLoading } = useUpdateTask()
  const t = useTranslations('Task')

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleMarkAsDone = async () => {
    try {
      console.log('Marking task as done:', taskId)
      const result = await updateTaskAsync({
        id: taskId,
        status: 'done'
      })
      
      console.log('Mark as done result:', result)
      
      if (result.success) {
        console.log('Task marked as done successfully')
        setIsOpen(false)
        if (onComplete) {
          onComplete()
        }
      } else {
        console.error('Failed to mark task as done:', result.error)
      }
    } catch (error) {
      console.error('Error marking task as done:', error)
    }
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-3 py-1 text-sm font-medium text-black bg-white border border-black rounded-full hover:bg-black hover:text-white transition-colors duration-200"
      >
        {t('done')}
      </button>

      {isOpen && (
        <div
          className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('mark-task-as-done')}</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-base mb-2">{t('are-you-sure-mark-done')}</p>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{taskTitle}</span>
              </div>
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 border border-black rounded-full transition-colors duration-200 hover:bg-gray-100"
                disabled={isLoading}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleMarkAsDone}
                className="flex-1 py-2 text-white bg-black rounded-full transition-colors duration-200 hover:bg-gray-800 flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('processing')}
                  </>
                ) : (
                  t('mark-as-done')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ConfirmTaskDoneModal
