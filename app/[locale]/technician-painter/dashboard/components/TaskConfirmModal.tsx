import React from 'react';
import { X } from 'lucide-react';

interface TaskConfirmModalProps {
  isOpen: boolean;
  taskId: string;
  onCancel: () => void;
  onConfirm: (taskId: string) => void;
}

const TaskConfirmModal: React.FC<TaskConfirmModalProps> = ({
  isOpen,
  taskId,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Confirm Task Completion</h3>
          <button 
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="mb-2 text-gray-700">
            Are you sure you want to mark this task as complete?
          </p>
          <p className="text-sm text-gray-500">
            This action will update the status of the task.
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(taskId)}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskConfirmModal; 