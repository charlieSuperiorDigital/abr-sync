'use client'

import * as React from 'react'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Task } from '@/app/types/task'
import { useCreateTask } from '@/app/api/hooks/useTasks'

interface DuplicateTaskModalProps {
  task: Task
  onComplete?: () => void
}

export function DuplicateTaskModal({
  task,
  onComplete
}: DuplicateTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { createTaskAsync, isLoading } = useCreateTask()
  const t = useTranslations('Task')

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleDuplicateTask = async () => {
    try {

            // here we'll ccreate a new task with the same data as the original
      const newTaskData = {
        title: `${task.title} #2`,
        description: task.description,
        dueDate: task.dueDate,
        priority: typeof task.priority === 'object' ? task.priority.text : task.priority,
        assignedTo: task.assignedTo || '',
        workfileId: task.workfileId || '',
        locationId: task.locationId || '',
        //  0 for One-time, 1 for Recurring
        type: typeof task.type === 'string' ? (task.type === 'Recurring' ? 1 : 0) : (task.type || 0),
        status: 'open', 
        tenantId: task.tenantId , 
        endDate: task.endDate || '',
        roles: task.roles || '',

     
        weekDays: task.weekDays || 0,
        monthDays: task.monthDays || 0,
        customDays: task.customDays || []
      }
      
      const result = await createTaskAsync(newTaskData)
      
      
      if (result.success) {
        setIsOpen(false)
        if (onComplete) {
          onComplete()
        }
      } else {
        console.error('Failed to duplicate task:', result.error)
      }
    } catch (error) {
      console.error('Error duplicating task:', error)
    }
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-3 py-1 ml-2 text-sm font-medium text-white bg-black rounded-full border border-black transition-colors duration-200 hover:bg-gray-800"
      >
        {t('duplicate')}
      </button>

      {isOpen && (
        <div
          className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <div className="p-6 w-full max-w-md bg-white rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('duplicate-task')}</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="mb-2 text-base">{t('are-you-sure-duplicate')}</p>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{task.title}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{t('duplicate-task-note')}</p>
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
                onClick={handleDuplicateTask}
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
                  t('duplicate')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DuplicateTaskModal
