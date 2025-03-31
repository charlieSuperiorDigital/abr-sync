'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState, useCallback, useEffect } from 'react'
import { returnsMockData } from '@/app/mocks/parts-management'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus, ChevronDown, Printer } from 'lucide-react'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import DateTimePicker from '@/app/[locale]/custom-components/date-time-picker'

interface PartsReturn {
  returnId: string
  roNumber: string
  vehicle: {
    make: string
    model: string
    year: number
    imageUrl?: string
  }
  receivedDate: string
  pickedUpDate: string
  returnedDate: string
  refundStatus: 'pending' | 'approved' | 'rejected' | 'completed'
  refundAmount: number
  vendor: string
}

export default function Returns() {
  const [data, setData] = useState<PartsReturn[]>(returnsMockData)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setOpenDropdownId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  const handleRefundStatusChange = useCallback((returnId: string, newStatus: 'pending' | 'completed') => {
    setData(prevData => 
      prevData.map(item => 
        item.returnId === returnId 
          ? { ...item, refundStatus: newStatus === 'pending' ? 'pending' : 'approved' } 
          : item
      )
    );
    setOpenDropdownId(null);
  }, []);

  const handleDateChange = useCallback((returnId: string, field: 'pickedUpDate' | 'returnedDate', newDate: Date) => {
    setData(prevData => 
      prevData.map(item => 
        item.returnId === returnId 
          ? { ...item, [field]: newDate.toISOString() } 
          : item
      )
    );
  }, []);

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const columns: ColumnDef<PartsReturn, any>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.roNumber || '---'}</span>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'VEHICLE',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={row.original.vehicle.year}
          imageUrl={row.original.vehicle.imageUrl}
        />
      ),
    },
    {
      accessorKey: 'receivedDate',
      header: 'RECEIVED',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDate(row.original.receivedDate)}
        </span>
      ),
    },
    {
      accessorKey: 'pickedUpDate',
      header: 'PICKED-UP',
      cell: ({ row }) => (
        <div className="date-picker-container">
          <DateTimePicker
            value={row.original.pickedUpDate}
            editable={true}
            onOk={(date: Date) => handleDateChange(row.original.returnId, 'pickedUpDate', date)}
          />
        </div>
      ),
    },
    {
      accessorKey: 'returnedDate',
      header: 'RETURNED',
      cell: ({ row }) => (
        <div className="date-picker-container">
          <DateTimePicker
            value={row.original.returnedDate}
            editable={true}
            onOk={(date: Date) => handleDateChange(row.original.returnId, 'returnedDate', date)}
          />
        </div>
      ),
    },
    {
      accessorKey: 'refundStatus',
      header: 'REFUND STATUS',
      cell: ({ row }) => {
        const status = row.original.refundStatus === 'pending' ? 'Pending Refund' : 'Refund Complete';
        const textColor = row.original.refundStatus === 'pending' ? 'text-amber-600' : 'text-green-600';
        
        return (
          <div className="relative dropdown-container">
            <button
              type="button"
              className="inline-flex justify-between items-center px-4 py-2 w-full text-sm font-medium bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdownId(openDropdownId === row.original.returnId ? null : row.original.returnId);
              }}
            >
              <span className={textColor}>
                {status}
              </span>
              <ChevronDown className="ml-2 w-4 h-4" />
            </button>
            
            {/* Dropdown Menu */}
            {openDropdownId === row.original.returnId && (
              <div className="absolute right-0 z-50 mt-2 w-full bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    className="block px-4 py-2 w-full text-sm text-left text-amber-600 hover:bg-gray-100"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefundStatusChange(row.original.returnId, 'pending');
                    }}
                  >
                    Pending Refund
                  </button>
                  <button
                    className="block px-4 py-2 w-full text-sm text-left text-green-600 hover:bg-gray-100"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefundStatusChange(row.original.returnId, 'completed');
                    }}
                  >
                    Refund Complete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'refundAmount',
      header: 'AMOUNT',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.refundAmount)}
        </span>
      ),
    },
    {
      accessorKey: 'vendor',
      header: 'VENDOR',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.vendor}
        </span>
      ),
    },
    {
      accessorKey: 'printCheck',
      header: '',
      cell: ({ row }) => (
        <DarkButton 
          buttonText="Print Check" 
          onClick={() => { console.log('print check for', row.original.returnId) }} 
       />
      ),
    },
    {
      id: 'task',
      header: '',
      cell: ({ row }) => (
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <NewTaskModal
            title="New Task"
            defaultRelation={
              {
                id: row.original.returnId,
                type: 'opportunity'
              }
            }
            children={
              <Plus className="m-auto w-5 h-5" />
            }
          />
        </div>
      ),
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
