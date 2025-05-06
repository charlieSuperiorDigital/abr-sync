'use client'

import * as React from 'react'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUpdateTask } from '@/app/api/hooks/useTasks'

interface ReopenTaskModalProps {
  taskId: string
  taskTitle: string
  onComplete?: () => void
}

export function ReopenTaskModal({
  taskId,
  taskTitle,
  onComplete
}: ReopenTaskModalProps) {
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

  const handleReopenTask = async () => {
    try {
      console.log('Reopening task:', taskId)
      const result = await updateTaskAsync({
        id: taskId,
        status: 'open'
      })
      
      console.log('Reopen task result:', result)
      
      if (result && result.status === 'open') {
        console.log('Task reopened successfully')
        setIsOpen(false)
        if (onComplete) {
          onComplete()
        }
      } else {
        console.error('Failed to reopen task')
      }
    } catch (error) {
      console.error('Error reopening task:', error)
    }
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-3 py-1 text-sm font-medium text-black bg-white rounded-full border border-black transition-colors duration-200 hover:bg-black hover:text-white"
      >
        {t('reopen')}
      </button>

      {isOpen && (
        <div
          className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <div className="p-6 w-full max-w-md bg-white rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('reopen-task')}</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="mb-2 text-base">{t('are-you-sure-reopen')}</p>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{taskTitle}</span>
              </div>
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 rounded-full border border-black transition-colors duration-200 hover:bg-gray-100"
                disabled={isLoading}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleReopenTask}
                className="flex flex-1 justify-center items-center py-2 text-white bg-black rounded-full transition-colors duration-200 hover:bg-gray-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="mr-2 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('processing')}
                  </>
                ) : (
                  t('reopen')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ReopenTaskModal
