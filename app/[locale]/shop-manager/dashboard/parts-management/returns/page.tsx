'use client'

import * as React from 'react'
import {
  StatusBadgeCell,
  VehicleCell,
  SummaryCell,
} from '@/components/custom-components/custom-table/table-cells'
import { useState, useCallback, useEffect } from 'react'
import { returnsMockData, vendorDetailsMockData, VendorDetail } from '@/app/mocks/parts-management'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus, ChevronDown, Printer, Phone, Mail } from 'lucide-react'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import DateTimePicker from '@/app/[locale]/custom-components/date-time-picker'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSession } from 'next-auth/react'
import { usePartsOnReturnStatus, useUpdatePartOrder } from '@/app/api/hooks/useParts'
import { toast } from 'react-toastify'
import { Part } from '@/app/types/parts'

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
  const { data: session } = useSession();
  // Replace useGetTenantPartOrders with usePartsOnReturnStatus for production data
  const { parts: data, isLoading } = usePartsOnReturnStatus();

  const { updatePartOrder, isLoading: isUpdatingStatus } = useUpdatePartOrder();

  if (isLoading) return <div>Loading...</div>;
  
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const [vendorDetails] = useState<VendorDetail[]>(vendorDetailsMockData)

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

  const handleRefundStatusChange = useCallback(
    async (partOrderId: string, insuranceApprovalStatusName: string) => {
      try {
        await updatePartOrder(
          { partOrderId, data: { insuranceApprovalStatus: 1, insuranceApprovalStatusName } },
          {
            onSuccess: () => toast.success('Status updated successfully!'),
            onError: (error: any) => toast.error('Failed to update status: ' + (error?.message || 'Unknown error')),
          }
        );
      } catch (error: any) {
        toast.error('Failed to update status: ' + (error?.message || 'Unknown error'));
      }
    },
    [updatePartOrder]
  );

  const handleDateChange = useCallback((returnId: string, field: 'pickedUpDate' | 'returnedDate', newDate: Date) => {
    // setData(prevData => 
    //   prevData.map(item => 
    //     item.returnId === returnId 
    //       ? { ...item, [field]: newDate.toISOString() } 
    //       : item
    //   )
    // );
  }, []);

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-black whitespace-nowrap">RO</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">VEHICLE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">RECEIVED</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">PICKED-UP</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">RETURNED</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">REFUND STATUS</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">AMOUNT</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">VENDOR</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">PRINT CHECK</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: Part) => (
            <React.Fragment key={item.id}>
              <TableRow 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleRow(item.id)}
              >
                <TableCell className="font-medium">{item.roNumber || '---'}</TableCell>
                <TableCell>
                  <VehicleCell
                    make={item.vehicle.make}
                    model={item.vehicle.model}
                    year={item.vehicle.year.toString()}
                    // imageUrl={item.vehicle.imageUrl}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(item.receivedDate)}
                </TableCell>
                <TableCell>
                  <div className="date-picker-container" onClick={(e) => e.stopPropagation()}>
                    <DateTimePicker
                      value={item.returnPickupDate}
                      editable={true}
                      onOk={(date: Date) => handleDateChange(item.id, 'pickedUpDate', date)}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="date-picker-container" onClick={(e) => e.stopPropagation()}>
                    <DateTimePicker
                      value={item.returnDate}
                      editable={true}
                      onOk={(date: Date) => handleDateChange(item.id, 'returnedDate', date)}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative dropdown-container" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="inline-flex justify-between items-center px-4 py-2 w-full text-sm font-medium bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === item.returnId ? null : item.returnId);
                      }}
                    >
                      <span className={item.refundStatus === 'pending' ? 'text-amber-600' : 'text-green-600'}>
                        {item.refundStatus === 'pending' ? 'Pending Refund' : 'Refund Complete'}
                      </span>
                      <ChevronDown className="ml-2 w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openDropdownId === item.id && (
                      <div className="absolute right-0 z-50 mt-2 w-full bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <button
                            className="block px-4 py-2 w-full text-sm text-left text-amber-600 hover:bg-gray-100"
                            role="menuitem"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRefundStatusChange(item.id, 'Pending Refund');
                            }}
                          >
                            Pending Refund
                          </button>
                          <button
                            className="block px-4 py-2 w-full text-sm text-left text-green-600 hover:bg-gray-100"
                            role="menuitem"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRefundStatusChange(item.id, 'Refund Complete');
                            }}
                          >
                            Refund Complete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency(item.refundAmount)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.vendor}
                </TableCell>
                <TableCell>
                  <DarkButton 
                    buttonText="Print Check" 
                    onClick={(e) => { 
                      e.stopPropagation();
                      console.log('print check for', item.id) 
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <NewTaskModal
                      title="New Task"
                      defaultRelation={
                        {
                          id: item.returnId,
                          type: 'opportunity'
                        }
                      }
                      children={
                        <Plus className="m-auto w-5 h-5" />
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
              
              {expandedRows[item.id] && (
                <TableRow key={`expanded-${item.id}`}>
                  <TableCell colSpan={10} className="p-0 border-0">
                    <div className="bg-gray-100 rounded-md">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">NAME</th>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">REPRESENTATIVE</th>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">TO ORDER</th>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">TO RECEIVE</th>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">TO RETURN</th>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">TOTAL</th>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">TOTAL AMOUNT</th>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">LAST COMM. DATE</th>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">SUMMARY</th>
                              <th className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">CONTACT INFO</th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-100 divide-y divide-gray-200">
                            {vendorDetails.map((vendor) => (
                              <tr key={vendor.vendorDetailId}>
                                <td className="py-4 text-sm font-medium whitespace-nowrap bg-gray-300">
                                  {vendor.name}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {vendor.representative}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {vendor.toOrder}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {vendor.toReceive}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {vendor.toReturn}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {vendor.total}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {formatCurrency(vendor.totalAmount)}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {formatDate(vendor.lastCommunicationDate)}
                                </td>
                                <td className="py-4 text-sm text-gray-700 bg-gray-300">
                                  <SummaryCell text={vendor.summary} />
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  <div className="flex space-x-2">
                                    <a 
                                      href={`tel:${vendor.contactInfo.phone}`} 
                                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Phone className="w-4 h-4" />
                                    </a>
                                    <a 
                                      href={`mailto:${vendor.contactInfo.email}`} 
                                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Mail className="w-4 h-4" />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
