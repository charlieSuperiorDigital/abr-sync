'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CustomInput } from '../inputs/custom-input'
import { CustomTextarea } from '../inputs/custom-textarea'
import { Task } from '@/app/types/task'
import { Task as ApiTask } from '@/app/api/functions/tasks'
import { 
  getTaskFormSchema,
  TaskFormData,
  TaskPriority,
  TaskType,
  TaskTypes,
  TaskRoles,
  RecurringFrequencies,
  DaysOfWeek,
  RecurringFrequency,
  DayOfWeek,
  TaskRole,
  TaskPriorities
} from './schema'
import { useTranslations } from 'next-intl'
import { Pencil, Plus } from 'lucide-react'
import { CustomSelect } from '../selects/custom-select'
import { CustomButtonSelect, CustomButtonSelectField } from '../selects/custom-button-select'
import { Checkbox } from '@/components/ui/checkbox'
import { createLocalISOString } from '@/lib/utils/date'
import { useGetTenant } from '@/app/api/hooks/useGetTenant'
import { Location } from '@/app/types/location'
import { useGetUsersByTenant } from '@/app/api/hooks/useGetUsersByTenant'
import useUpdateTask from '@/app/api/hooks/useUpdateTask'
import { UpdateTaskPayload } from '@/app/api/functions/tasks'
import { useSession } from 'next-auth/react'
import { getUserFullName } from '@/app/types/user'
import { toast } from 'react-toastify'

// Extended task type to handle both Task and ApiTask properties
interface ExtendedTask {
  id?: string;
  tenantId?: string;
  title?: string;
  description?: string;
  status?: string;
  assignedTo?: string;
  assignedUser?: any; // Using any to avoid conflicts between different User types
  workfileId?: string;
  workfile?: any;
  locationId?: string;
  location?: any;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  priority?: string | {
    variant: 'danger' | 'warning' | 'success' | 'slate';
    text: 'Urgent' | 'High' | 'Normal' | 'Low';
  };
  type?: string | number;
  endDate?: string;
  roles?: string;
  createdBy?: string;
  createdByUser?: any;
  
  // Additional fields that might be in either interface
  dueDateTime?: string;
  recurringFrequency?: string;
  recurringDays?: string[];
  recurringEndDateTime?: string;
  assignedToRoles?: string[];
  timezone?: string;
  
  // Recurring task specific fields
  recurringType?: number;
  weekDays?: number;
  monthDays?: number;
  customDays?: string[];
}

interface EditTaskModalProps {
  children: React.ReactNode
  title: string
  taskId: string
  task?: Task | ApiTask
}

// Define task templates
const TASK_TEMPLATES = [
  {
    id: 'template-none',
    name: '[NONE] No Template',
    data: {
      priority: 'Normal' as TaskPriority,
      taskTitle: '',
      description: '',
      type: 'One-time' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '09:00',
      location: '',
      assignToUser: ''
    }
  },
  {
    id: 'template-1',
    name: '[DAILY] Daily Vehicle Inspection',
    data: {
      priority: 'Normal' as TaskPriority,
      taskTitle: 'Daily Vehicle Inspection',
      description: 'Perform a comprehensive inspection of the vehicle including: fluid levels, tire pressure, lights, and general condition.',
      type: 'Recurring' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '09:00',
      recurringFrequency: 'Every Day' as RecurringFrequency,
      recurringDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[],
      recurringEndDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0], // 3 months from now
      recurringEndTime: '17:00'
    }
  },
  {
    id: 'template-2',
    name: '[MONTHLY] Monthly Maintenance Check',
    data: {
      priority: 'High' as TaskPriority,
      taskTitle: 'Monthly Maintenance Check',
      description: 'Conduct a thorough maintenance check including: engine diagnostics, brake inspection, and all major systems.',
      type: 'Recurring' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '10:00',
      recurringFrequency: 'Every Month' as RecurringFrequency,
      recurringEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 year from now
      recurringEndTime: '17:00'
    }
  },
  {
    id: 'template-3',
    name: '[ONE-TIME] Urgent Repair Request',
    data: {
      priority: 'Urgent' as TaskPriority,
      taskTitle: 'Urgent Repair Request',
      description: 'Address critical repair issue immediately. Verify parts availability and schedule technician.',
      type: 'One-time' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '14:00'
    }
  },
  {
    id: 'template-4',
    name: '[YEARLY] Annual Christmas Service Special',
    data: {
      priority: 'Normal' as TaskPriority,
      taskTitle: 'Annual Christmas Service Special',
      description: 'Prepare and execute the annual Christmas service special promotion. Includes comprehensive vehicle check and holiday discount.',
      type: 'Recurring' as TaskType,
      dueDate: new Date(new Date().getFullYear(), 11, 15).toISOString().split('T')[0], // December 15th
      dueTime: '09:00',
      recurringFrequency: 'Every Year' as RecurringFrequency,
      recurringEndDate: new Date(new Date().getFullYear() + 5, 11, 25).toISOString().split('T')[0], // 5 years from now, December 25th
      recurringEndTime: '17:00'
    }
  },
  {
    id: 'template-5',
    name: '[CUSTOM] Quarterly Staff Training',
    data: {
      priority: 'High' as TaskPriority,
      taskTitle: 'Quarterly Staff Training',
      description: 'Conduct quarterly staff training on new procedures, safety protocols, and customer service standards.',
      type: 'Recurring' as TaskType,
      dueDate: new Date().toISOString().split('T')[0], // Today's date
      dueTime: '13:00',
      recurringFrequency: 'Custom' as RecurringFrequency,
      // Set three specific dates for the year
      customDays: [
        new Date(new Date().getFullYear(), 2, 15).toISOString(), // March 15th
        new Date(new Date().getFullYear(), 6, 15).toISOString(), // July 15th
        new Date(new Date().getFullYear(), 10, 15).toISOString() // November 15th
      ],
      recurringEndDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0], // End of year
      recurringEndTime: '17:00'
    }
  }
];

export function EditTaskModal({
  children,
  title,
  taskId,
  task
}: EditTaskModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [originalTask, setOriginalTask] = useState<ExtendedTask | null>(null)
  const t = useTranslations('Task')
  const validationMessage = useTranslations('Validation')
  
  // Get session for tenant ID
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  
  // Use hooks directly instead of providers
  const { tenant, locations: tenantLocations, isLoading: isLoadingTenant } = useGetTenant({
    tenantId: tenantId!
  })
  
  const { users, isLoading: isLoadingUsers, totalCount } = useGetUsersByTenant({
    tenantId: tenantId!,
    page: 1,
    perPage: 100 // Fetch a larger number to have all users available
  })

  // Initialize the update task hook
  const { updateTaskAsync, isLoading: isUpdating, isError, error } = useUpdateTask()

  const [locations, setLocations] = useState<{value: string, label: string}[]>([])
  const [usersForSelect, setUsersForSelect] = useState<any[]>([])

  // Transform users into format needed for select components
  useEffect(() => {
    if (users) {
      const usersForSelect = users.map(user => ({
        value: user.id,
        label: getUserFullName(user),
        avatar: '/placeholder.svg' // Default avatar, could be replaced with actual user avatar
      }))
      setUsersForSelect(usersForSelect)
    }
  }, [users])

  // Process locations for dropdown when tenant data is available
  useEffect(() => {
    if (tenantLocations && tenantLocations.length > 0) {
      const locationOptions = tenantLocations.map((location: Location) => ({
        value: location.id,
        label: location.address
      }))
      setLocations(locationOptions)
    }
  }, [tenantLocations])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(getTaskFormSchema()),
    defaultValues: {
      template: '',
      tenantId: '',
      priority: 'Normal' as TaskPriority,
      taskTitle: '',
      description: '',
      location: '',
      type: 'One-time',
      dueDate: '',
      dueTime: '',
      assignToUser: '',
      assignToRoles: [],
      recurringFrequency: undefined,
      recurringDays: [],
      recurringEndDate: '',
      recurringEndTime: '',
    }
  })

  const watchType = watch('type')

  useEffect(() => {
    // This ensures the form doesn't try to validate fields that aren't relevant
    // based on the current task type
    reset(undefined, { 
      keepValues: true, 
      keepDirty: true,
      keepErrors: false,
      keepTouched: false,
      keepDefaultValues: true,
      keepIsSubmitted: false,
      keepIsValid: false,
      keepSubmitCount: false,
    })
  }, [watchType, reset])

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay, not on modal content
    if (e.target === e.currentTarget) {
      setShouldShowModal(false)
    }
  }

  const handleShowModal = async () => {
    if (!task) {
      console.error(`Task with ID ${taskId} not found`)
      toast.error(`Task with ID ${taskId} not found. Please try again.`)
      return
    }

    try {
      // Cast task to ExtendedTask to handle all possible properties
      const extendedTask = task as ExtendedTask
      
      // Log task data for debugging
      console.log('Task data received:', extendedTask)
      
      // Ensure task has an ID
      if (!extendedTask.id) {
        console.error('Task is missing ID property')
        toast.error('Task data is incomplete. Please try again.')
        return
      }
      
      setOriginalTask(extendedTask)
      
      // Extract date and time from dueDate or dueDateTime
      let dueDate = '', dueTime = '00:00'
      
      if (extendedTask.dueDateTime) {
        const parts = extendedTask.dueDateTime.split('T')
        dueDate = parts[0]
        dueTime = parts[1]?.slice(0, 5) || '00:00'
      } else if (extendedTask.dueDate) {
        const parts = extendedTask.dueDate.split('T')
        dueDate = parts[0]
        dueTime = parts[1]?.slice(0, 5) || '00:00'
      }

      // Extract recurring end date and time if present
      let recurringEndDate = '', recurringEndTime = ''
      if (extendedTask.recurringEndDateTime) {
        const parts = extendedTask.recurringEndDateTime.split('T')
        recurringEndDate = parts[0]
        recurringEndTime = parts[1]?.slice(0, 5) || '00:00'
      } else if (extendedTask.endDate && extendedTask.type === 'Recurring') {
        const parts = extendedTask.endDate.split('T')
        recurringEndDate = parts[0]
        recurringEndTime = parts[1]?.slice(0, 5) || '00:00'
      }

      // Map priority to form values
      let priorityValue: TaskPriority = 'Normal'
      
      if (typeof extendedTask.priority === 'string') {
        // Try to map string priority to enum value
        priorityValue = extendedTask.priority as TaskPriority
      } else if (extendedTask.priority && typeof extendedTask.priority === 'object' && 'text' in extendedTask.priority) {
        // Extract text from priority object
        priorityValue = extendedTask.priority.text as TaskPriority
      }

      // Determine task type
      const taskType = typeof extendedTask.type === 'number' 
        ? (extendedTask.type === 1 ? 'Recurring' : 'One-time') 
        : (extendedTask.type || 'One-time');

      // Determine recurring frequency based on recurringType if available
      let recurringFrequency: RecurringFrequency = 'Every Day';
      if (extendedTask.recurringFrequency) {
        recurringFrequency = extendedTask.recurringFrequency as RecurringFrequency;
      } else if (extendedTask.recurringType !== undefined) {
        switch (extendedTask.recurringType) {
          case 0: recurringFrequency = 'Every Day'; break;
          case 1: recurringFrequency = 'Every Week'; break;
          case 2: recurringFrequency = 'Every Month'; break;
          case 3: recurringFrequency = 'Every Year'; break;
          case 4: recurringFrequency = 'Custom'; break;
          default: recurringFrequency = 'Every Day';
        }
      }

      // Convert weekDays bitwise to array of day names if available
      let recurringDays: DayOfWeek[] = [];
      if (extendedTask.recurringDays && Array.isArray(extendedTask.recurringDays)) {
        recurringDays = extendedTask.recurringDays as DayOfWeek[];
      } else if (extendedTask.weekDays !== undefined && taskType === 'Recurring' && recurringFrequency === 'Every Week') {
        const weekDaysBitwise = extendedTask.weekDays;
        if ((weekDaysBitwise & 1) !== 0) recurringDays.push('Sunday');
        if ((weekDaysBitwise & 2) !== 0) recurringDays.push('Monday');
        if ((weekDaysBitwise & 4) !== 0) recurringDays.push('Tuesday');
        if ((weekDaysBitwise & 8) !== 0) recurringDays.push('Wednesday');
        if ((weekDaysBitwise & 16) !== 0) recurringDays.push('Thursday');
        if ((weekDaysBitwise & 32) !== 0) recurringDays.push('Friday');
        if ((weekDaysBitwise & 64) !== 0) recurringDays.push('Saturday');
      }

      // Reset form with task data
      reset({
        priority: priorityValue,
        taskTitle: extendedTask.title || '',
        description: extendedTask.description || '',
        type: taskType as any,
        dueDate: dueDate,
        dueTime: dueTime,
        location: extendedTask.locationId || '',
        assignToUser: extendedTask.assignedTo || '',
        assignToRoles: (extendedTask.assignedToRoles || []) as TaskRole[],
        tenantId: extendedTask.tenantId || '',
        // Set recurring task fields if applicable
        ...(taskType === 'Recurring' && {
          recurringFrequency: recurringFrequency,
          recurringDays: recurringDays,
          recurringEndDate: recurringEndDate,
          recurringEndTime: recurringEndTime,
        })
      })
      
      setShouldShowModal(true)
    } catch (error) {
      console.error('Error processing task data:', error)
      toast.error('Error processing task data. Please try again.')
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submission started')
    console.log('Current form values:', watch())
    
    const formValues = watch();
    
    // Handle validation for recurring tasks
    if (formValues.type === 'Recurring') {
      console.log('Recurring task detected, ensuring all required fields are set')
      
      // Ensure recurring frequency is set
      if (!formValues.recurringFrequency) {
        setValue('recurringFrequency', 'Every Day', { shouldValidate: false })
      }
      
      // Ensure recurring days is set (required for Weekly frequency)
      if (!formValues.recurringDays || formValues.recurringDays.length === 0) {
        setValue('recurringDays', ['Monday'], { shouldValidate: false })
      }
      
      // Ensure recurring end date is set
      if (!formValues.recurringEndDate) {
        setValue('recurringEndDate', formValues.dueDate, { shouldValidate: false })
      }
      
      // Ensure recurring end time is set
      if (!formValues.recurringEndTime) {
        setValue('recurringEndTime', formValues.dueTime, { shouldValidate: false })
      }
      
      console.log('After setting recurring values:', watch())
    }
    // Handle validation for one-time tasks
    else if (formValues.type === 'One-time') {
      console.log('One-time task detected, setting temporary recurring values for validation')
      setValue('recurringFrequency', 'Every Day', { shouldValidate: false })
      setValue('recurringDays', ['Monday'], { shouldValidate: false })
      setValue('recurringEndDate', formValues.dueDate, { shouldValidate: false })
      setValue('recurringEndTime', formValues.dueTime, { shouldValidate: false })
      console.log('After setting temporary values:', watch())
    }
    
    handleSubmit(
      (data) => {
        console.log('Form validation passed. Form data:', data)
        return onSubmit(data)
      },
      (errors) => {
        console.error('Form validation failed:', errors)
        console.error('Current form values when validation failed:', watch())
      }
    )(e)
  }

  const onSubmit = async (data: TaskFormData) => {
    console.log('onSubmit function called');
    console.log('Form data submitted:', data);
    try {
      console.log('Starting task update process...')
      setIsLoading(true)

      if (!originalTask) {
        console.error('No original task data available')
        return
      }

      if (!originalTask.id) {
        console.error('Task ID is missing')
        return
      }

      console.log('Original task data:', originalTask)
      console.log('Form data submitted:', data)

      // Combine date and time into ISO string preserving local time
      const dueDate = createLocalISOString(data.dueDate, data.dueTime)
      console.log('Combined due date and time:', dueDate)
      
      // Handle recurring end date/time if present
      let recurringEndDateTime
      if (data.type === 'Recurring' && data.recurringEndDate && data.recurringEndTime) {
        recurringEndDateTime = createLocalISOString(data.recurringEndDate, data.recurringEndTime)
        console.log('Combined recurring end date and time:', recurringEndDateTime)
      }
      
      // Create updated task object
      const updatedTask: UpdateTaskPayload = {
        id: originalTask.id,
        tenantId: session?.user?.tenantId || originalTask.tenantId || '', // Use session tenant ID or original task's tenant ID
        priority: data.priority,
        title: data.taskTitle,
        description: data.description || '',
        dueDate,
        locationId: data.location,
        type: data.type === 'Recurring' ? 1 : 0, // 0 for One-time, 1 for Recurring
        assignedTo: data.assignToUser || '', // Default if empty
        roles: '', // No longer using assignToRoles
        recurringType: 0, // Default value
        weekDays: 0, // Default value
        monthDays: 0, // Default value
        customDays: [], // Default value
        endDate: data.type === 'One-time' ? dueDate : undefined, // Set endDate for one-time tasks to match dueDate
        status: originalTask.status || 'open' // Preserve original status or default to 'open'
      }
      
      // Add recurring task properties if type is Recurring
      if (data.type === 'Recurring' && data.recurringFrequency) {
        // Map recurring frequency to recurringType
        switch (data.recurringFrequency) {
          case 'Every Day':
            updatedTask.recurringType = 0; // 0 for daily
            break;
          case 'Every Week':
            updatedTask.recurringType = 1; // 1 for weekly
            // Convert selected days to bitwise representation
            if (data.recurringDays && data.recurringDays.length > 0) {
              let weekDaysBitwise = 0;
              data.recurringDays.forEach(day => {
                switch (day) {
                  case 'Sunday': weekDaysBitwise |= 1; break; // 2^0 = 1
                  case 'Monday': weekDaysBitwise |= 2; break; // 2^1 = 2
                  case 'Tuesday': weekDaysBitwise |= 4; break; // 2^2 = 4
                  case 'Wednesday': weekDaysBitwise |= 8; break; // 2^3 = 8
                  case 'Thursday': weekDaysBitwise |= 16; break; // 2^4 = 16
                  case 'Friday': weekDaysBitwise |= 32; break; // 2^5 = 32
                  case 'Saturday': weekDaysBitwise |= 64; break; // 2^6 = 64
                }
              });
              updatedTask.weekDays = weekDaysBitwise;
            }
            break;
          case 'Every Month':
            updatedTask.recurringType = 2; // 2 for monthly
            // For monthly tasks, we need to set monthDays
            // If we have the original monthDays value, use it, otherwise default to the due date
            if (originalTask.monthDays) {
              updatedTask.monthDays = originalTask.monthDays;
            } else {
              const dueDay = new Date(dueDate).getDate();
              updatedTask.monthDays = 1 << (dueDay - 1); // Set bit for the due day
            }
            break;
          case 'Every Year':
            updatedTask.recurringType = 3; // 3 for yearly
            // For yearly tasks, we need to set customDays
            // Default to the due date for yearly recurrence
            updatedTask.customDays = [new Date(dueDate).toISOString()];
            break;
          case 'Custom':
            updatedTask.recurringType = 4; // 4 for custom
            // For custom tasks, we would need UI to select specific dates
            // For now, default to the due date
            updatedTask.customDays = [new Date(dueDate).toISOString()];
            break;
        }
        
        // Add the recurring end date
        if (recurringEndDateTime) {
          updatedTask.endDate = recurringEndDateTime;
        }
        
        // Keep these fields for backward compatibility
        updatedTask.recurringFrequency = data.recurringFrequency;
        updatedTask.recurringDays = data.recurringDays;
        updatedTask.recurringEndDateTime = recurringEndDateTime;
        updatedTask.timezone = 'UTC'; // Default to UTC until we implement location-based timezones
      }

      console.log('Full updated task object:', updatedTask)

      // Filter out unchanged fields
      const changedFields: UpdateTaskPayload = {
        id: originalTask.id // Always include the ID
      }
      
      // Compare and keep only changed fields
      Object.entries(updatedTask).forEach(([key, value]) => {
        const originalKey = key as keyof ExtendedTask
        
        // Handle priority specially since it can be a string or object
        if (key === 'priority') {
          // Always include priority in the changed fields to ensure it gets updated
          (changedFields as any)[key] = value;
          console.log('Priority field updated to:', String(value));
        } 
        // Handle date fields - compare only the date part
        else if (key === 'dueDate' && originalTask.dueDate) {
          if (new Date(originalTask.dueDate).toDateString() !== new Date(value as string).toDateString()) {
            (changedFields as any)[key] = value
            console.log(`Field '${key}' changed from '${originalTask.dueDate}' to '${value}'`)
          }
        }
        // For recurring task specific fields, always include them if the task is recurring
        else if (['recurringType', 'weekDays', 'monthDays', 'customDays', 'endDate'].includes(key) && 
                 data.type === 'Recurring') {
          (changedFields as any)[key] = value
          console.log(`Field '${key}' set to '${value}'`)
        }
        // For all other fields, do a simple comparison
        else if (originalTask[originalKey] !== value && key !== 'id') {
          (changedFields as any)[key] = value
          console.log(`Field '${key}' changed from '${originalTask[originalKey]}' to '${value}'`)
        }
      })

      console.log('Changed fields:', changedFields)

      // Log the API payload
      console.log('API payload:', changedFields)
      
      // Only proceed if there are changes to submit
      if (Object.keys(changedFields).length <= 1) {
        console.log('No changes detected, skipping update')
        toast.info('No changes detected')
        setShouldShowModal(false)
        return
      }

      console.log('Calling updateTaskAsync with:', changedFields)
      const result = await updateTaskAsync(changedFields)
      console.log('Update task result:', result)
      
      if (result.success) {
        console.log('Task updated successfully!')
        setShouldShowModal(false)
      } else {
        console.error('Error updating task:', result.error)
        // Keep modal open to allow user to try again
      }

    } catch (error) {
      console.error('Error updating task:', error)
      // Keep modal open to allow user to try again
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

  // Add function to handle template selection
  const handleTemplateChange = (templateId: string) => {
    if (!templateId) {
      // If no template is selected, reload the original task data
      handleShowModal();
      return;
    }

    // Find the selected template
    const selectedTemplate = TASK_TEMPLATES.find(template => template.id === templateId);
    if (selectedTemplate) {
      // Create form data from template
      const formData = {
        ...selectedTemplate.data,
        template: templateId,
        // Keep the original task's location and assignToUser if available
        location: watch('location') || '',
        assignToUser: watch('assignToUser') || '',
        tenantId: originalTask?.tenantId || ''
      };

      // Ensure recurringDays is set for weekly recurring tasks
      if (formData.type === 'Recurring' && formData.recurringFrequency === 'Every Week' && (!formData.recurringDays || formData.recurringDays.length === 0)) {
        // Default to weekdays if not specified
        formData.recurringDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[];
      }

      // Ensure recurringEndDate and recurringEndTime are set for all recurring tasks
      if (formData.type === 'Recurring' && (!formData.recurringEndDate || !formData.recurringEndTime)) {
        // Default to 1 year from now if not specified
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        formData.recurringEndDate = oneYearFromNow.toISOString().split('T')[0];
        formData.recurringEndTime = '17:00';
      }

      // Populate form with template data
      reset(formData);
      
      // Log for debugging
      console.log('Template selected:', selectedTemplate.name);
      console.log('Form data after template selection:', formData);
    }
  };

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
          className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
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
              <form 
                onSubmit={handleFormSubmit} 
                className="space-y-6"
              >
                <div>
                  <label className="block mb-2 font-semibold">Template</label>
                  <Controller
                    control={control}
                    name="template"
                    render={({ field }) => (
                      <CustomSelect
                        placeholder="Select"
                        options={TASK_TEMPLATES.map(template => ({
                          value: template.id,
                          label: template.name
                        }))}
                        value={field.value ? [field.value] : []}
                        onChange={(values) => {
                          handleTemplateChange(values[0] || '')
                          field.onChange(values[0] || '')
                        }}
                      />
                    )}
                  />
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-bold">{t('task-information')}</h3>
                  
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
                        <CustomTextarea
                          label={t('description')}
                          rows={5}
                          error={errors.description?.message}
                          className="text-left min-h-[120px] text-base"
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
                            placeholder={isLoadingTenant ? t('loading-locations') : t('location-placeholder')}
                            options={locations.length > 0 ? locations : [{ value: '', label: t('no-locations-available') }]}
                            value={field.value ? [field.value] : []}
                            onChange={(values) => field.onChange(values[0] || '')}
                            // isDisabled={isLoadingTenant}
                          />
                        )}
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
                      )}
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
                        <div className="flex flex-col gap-4 mt-4 w-full">
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
                          {errors.recurringFrequency && (
                            <p className="mt-1 text-sm text-red-500">{errors.recurringFrequency.message}</p>
                          )}
                          
                          {/* Only show weekdays selection for Weekly or Custom recurring tasks */}
                          {(watch('recurringFrequency') === 'Every Week' || watch('recurringFrequency') === 'Custom') && (
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
                          )}
                          {errors.recurringDays && (
                            <p className="mt-1 text-sm text-red-500">{errors.recurringDays.message}</p>
                          )}
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
                          name="dueTime"
                          render={({ field }) => (
                            <CustomInput
                              label={t('time')}
                              type="time"
                              error={errors.dueTime?.message}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-bold">{t('assign-to')}</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="mb-6">
                      <h4 className="mb-2 font-semibold">{t('assign-to-user')}</h4>
                      <Controller
                        control={control}
                        name="assignToUser"
                        render={({ field }) => (
                          <>
                            {isLoadingUsers ? (
                              <div className="w-full px-4 py-2 text-left rounded-full bg-[#E3E3E3] flex items-center">
                                <span className="text-gray-500">{t('loading-users')}</span>
                              </div>
                            ) : (
                              <CustomSelect
                                key={usersForSelect.length} // Force re-render when options change
                                placeholder={t('select-user')}
                                options={usersForSelect || []}
                                value={field.value ? [field.value] : []}
                                onChange={(values) => field.onChange(values[0] || '')}
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                // Use the current user's ID from the session
                                if (session?.user?.userId) {
                                  field.onChange(session.user.userId)
                                }
                              }}
                              className="px-4 py-2 mt-2 text-base font-semibold text-black bg-gray-200 rounded-md transition-colors hover:bg-gray-300"
                            >
                              {t('assign-to-me')}
                            </button>
                            {errors.assignToUser && (
                              <p className="mt-1 text-sm text-red-500">{errors.assignToUser.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {isError && (
                  <div className="p-4 text-white bg-red-500 rounded-md">
                    <p className="font-semibold">Error updating task:</p>
                    <p>{error?.message || 'Unknown error occurred'}</p>
                  </div>
                )}

                <div className="flex gap-4 justify-end mt-8">
                  <button
                    type="button"
                    onClick={() => setShouldShowModal(false)}
                    className="p-2 w-32 rounded-full transition-colors duration-200 hover:bg-black hover:text-white"
                    disabled={isSubmitting || isLoading || isUpdating}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex justify-center items-center p-2 w-32 text-white bg-black rounded-full transition-colors duration-200 hover:bg-gray-800"
                    disabled={isSubmitting || isLoading || isUpdating}
                  >
                    {isSubmitting || isLoading || isUpdating ? (
                      <>
                        <svg className="mr-2 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('saving')}
                      </>
                    ) : t('save')}
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
