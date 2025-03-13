'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'

interface TaskModalProps {
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
}

export default function TaskModal({
  children,
  isOpen,
  onOpenChange,
  title,
}: TaskModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShouldShowModal(false)
    }
  }

  const handleShowModal = () => {
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
				<section>
              		<h3 className="text-lg mb-2 font-bold">Task Information</h3>
				</section>

              <div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setShouldShowModal(false)}
                    className="px-8 py-2 border rounded-3xl w-64"
                  >
                    Cancel
                  </button>
                  <button className="px-8 py-2 bg-black text-white rounded-3xl w-64 ">
                    Save
                  </button>
                </div>
              </div>
			  
            </div>

          </div>
        </div>
      )}
    </>
  )
}
