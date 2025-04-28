'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus, MessageSquareMore, ChevronDown, Calendar } from 'lucide-react'
import { Workfile, WorkfileStatus, SubletStatus, SubletType } from '@/app/types/workfile'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import RoundButtonWithTooltip from '@/app/[locale]/custom-components/round-button-with-tooltip'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { formatDate } from '@/app/utils/date-utils'
import DateTimePicker from '@/app/[locale]/custom-components/date-time-picker'

export default function Sublets() {
  const { workfiles, setSelectedWorkfile, selectedWorkfile, updateWorkfile } = useWorkfileStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [datePickerOpen, setDatePickerOpen] = useState<string | null>(null)
  
  // Get all workfiles that have sublet information
  const workfilesWithSublets = workfiles.filter(workfile => workfile.sublet);

  const handleRowClick = useCallback((workfile: Workfile) => {
    setSelectedWorkfile(workfile)
    setIsModalOpen(true)
  }, [setSelectedWorkfile])

  const handleContactClick = useCallback((workfile: Workfile) => {
    // Handle contact info click
    console.log('Contact clicked for workfile:', workfile.workfileId)
  }, [])

  const handleTaskClick = useCallback((workfile: Workfile) => {
    // Handle task button click
    console.log('Task clicked for workfile:', workfile.workfileId)
  }, [])

  const handleStatusChange = useCallback((workfile: Workfile, newStatus: SubletStatus) => {
    // Handle status change
    console.log(`Status changed for workfile ${workfile.workfileId} from ${workfile.sublet?.status} to ${newStatus}`)
    
    // Update the workfile's sublet status in the Zustand store
    if (workfile.sublet) {
      updateWorkfile(workfile.workfileId, {
        sublet: {
          ...workfile.sublet,
          status: newStatus
        }
      });
    }
    
    // Close the dropdown
    setOpenDropdownId(null);
  }, [updateWorkfile])

  const handleDueDateChange = useCallback((workfile: Workfile, newDate: string) => {
    // Handle due date change
    console.log(`Due date changed for workfile ${workfile.workfileId} from ${workfile.sublet?.dueDate} to ${newDate}`)
    
    // Update the workfile's sublet due date in the Zustand store
    if (workfile.sublet) {
      updateWorkfile(workfile.workfileId, {
        sublet: {
          ...workfile.sublet,
          dueDate: newDate
        }
      });
    }
    
    // Close the date picker
    setDatePickerOpen(null);
  }, [updateWorkfile])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setOpenDropdownId(null);
        }
      }
      if (datePickerOpen !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest('.date-picker-container')) {
          setDatePickerOpen(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId, datePickerOpen]);

  // Helper function to get the appropriate variant for the status badge
  const getStatusVariant = (type: SubletType) => {
    switch (type) {
      case SubletType.ALIGN:
        return 'info'
      case SubletType.AC:
        return 'forest'
      case SubletType.FIX:
        return 'warning'
      case SubletType.CALIBRATION:
        return 'success'
      default:
        return 'default'
    }
  }

  // Helper function to get the appropriate color for the status text
  const getStatusTextColor = (status: SubletStatus) => {
    switch (status) {
      case SubletStatus.OPEN:
        return 'text-gray-600'
      case SubletStatus.IN_PROGRESS:
        return 'text-red-600'  // Changed from amber to red
      case SubletStatus.DONE:
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const columns: ColumnDef<Workfile, any>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.roNumber || '---'}</span>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={row.original.vehicle.year.toString()}
          imageUrl={row.original.vehicle.vehiclePicturesUrls[0] || `https://picsum.photos/seed/${row.original.workfileId}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.owner.name}
        </span>
      ),
    },
    {
      accessorKey: 'sublet',
      header: 'Type and Status',
      cell: ({ row }) => {
        if (!row.original.sublet) return null;
        
        return (
          <div className="flex items-center space-x-2">
            {/* Type Badges - Fixed width container */}
            <div className="w-40 flex flex-wrap gap-1">
              {row.original.sublet.type.map((type, index) => (
                <StatusBadge 
                  key={index}
                  variant={getStatusVariant(type)}
                  size="sm"
                >
                  {type}
                </StatusBadge>
              ))}
            </div>
            
            {/* Status Dropdown - Fixed width */}
            <div className="dropdown-container relative w-36">
              <button
                type="button"
                className="inline-flex justify-between items-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdownId(openDropdownId === row.original.workfileId ? null : row.original.workfileId);
                }}
              >
                <span className={getStatusTextColor(row.original.sublet.status)}>
                  {row.original.sublet.status}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              
              {/* Dropdown Menu */}
              {openDropdownId === row.original.workfileId && (
                <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {Object.values(SubletStatus).map((status) => (
                      <button
                        key={status}
                        className={`w-full text-left block px-4 py-2 text-sm ${
                          row.original.sublet?.status === status
                            ? 'bg-gray-100'
                            : 'hover:bg-gray-100'
                        } ${getStatusTextColor(status)}`}
                        role="menuitem"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(row.original, status);
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'sublet.dropOffDate',
      header: 'Drop Off Date',
      cell: ({ row }) => (
        <DateTimePicker
          value={row.original.sublet?.dropOffDate}
          editable={!row.original.sublet?.dropOffDate}
          onOk={(date: Date) => console.log(date)}
        />
      ),
    },
    {
      accessorKey: 'sublet.dueDate',
      header: 'Due Date',
      cell: ({ row }) => (
        <div className="date-picker-container relative">
          <div 
            className="flex items-center cursor-pointer hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setDatePickerOpen(datePickerOpen === row.original.workfileId ? null : row.original.workfileId);
            }}
          >
            <span className="whitespace-nowrap mr-2">
              {formatDate(row.original.sublet?.dueDate) || '---'}
            </span>
            <Calendar className="h-4 w-4" />
          </div>
          
          {/* Date Picker */}
          {datePickerOpen === row.original.workfileId && (
            <div className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-50">
              <input 
                type="date" 
                className="border border-gray-300 rounded-md p-2"
                defaultValue={row.original.sublet?.dueDate ? new Date(row.original.sublet.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  // Set time to end of day (5:00 PM)
                  newDate.setHours(17, 0, 0, 0);
                  handleDueDateChange(row.original, newDate.toISOString());
                }}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Summary',
      cell: ({ row }) => (
        <RoundButtonWithTooltip 
          buttonIcon={<MessageSquareMore className="h-5 w-5" />}
          tooltipText={row.original.lastCommunicationSummary || 'No summary available'}
        />
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div 
          data-testid="contact-info" 
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handleContactClick(row.original)
          }}
        >
          <ContactInfo />
        </div>
      ),
    },
    {
      id: 'task',
      header: 'Add Task',
      cell: ({ row }) => (
        <div 
          data-testid="task-button" 
          className="cursor-pointer hover:text-blue-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            handleTaskClick(row.original)
          }}
        >
          <ClipboardPlus size={18} />
        </div>
      ),
    },
  ]

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={workfilesWithSublets}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />
    </div>
  )
}
