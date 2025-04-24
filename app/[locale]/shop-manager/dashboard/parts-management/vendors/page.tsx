'use client'

import * as React from 'react'
import {
  StatusBadgeCell,
  VehicleCell,
  SummaryCell,
} from '@/components/custom-components/custom-table/table-cells'
import { useState } from 'react'
import { vendorDetailsMockData, VendorDetail } from '@/app/mocks/parts-management'
import { vendorsMockData } from '@/app/mocks/vendors'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus, Phone, Mail, ChevronDown, AlertCircle } from 'lucide-react'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetAllPartsFromTenant, useGetTenantPartOrders } from '@/app/api/hooks/useParts'
import { useSession } from 'next-auth/react'
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
import { formatDate } from '@/app/utils/date-utils'

interface Vendor {
  vendorId: string
  name: string
  representative: string
  roCompleted: number
  roInProgress: number
  pendingReturns: number
  spentPerMonth: number
  spentPerWeek: number
  refundAmount: number
  refundPartsCount: number
  totalAmount: number
  lastCommunicationDate: string
  summary: string
  contactInfo: {
    phone: string
    email: string
  }
  hasUpdates?: boolean
}

export default function Vendors() {
  const { data: session } = useSession();
  const { getUniqueVendors : vendorsList } = useGetAllPartsFromTenant(session?.user.tenantId!)
  const { 
    ordersWithPartsToBeReceived,
    calculateOrderToOrderParts, 
    calculateOrderToReceiveParts, 
    calculateOrderTotalParts,
    isLoading: isLoadingOrders
  } = useGetTenantPartOrders({
    tenantId: session?.user?.tenantId || ''
  });
  
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [vendorDetails] = useState<VendorDetail[]>(vendorDetailsMockData)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
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
            <TableHead className="font-semibold text-black whitespace-nowrap">UPDATES</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">NAME</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">REPRESENTATIVE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">RO COMP.</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">RO IN PROG.</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">PENDING RETURNS</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">SPENT/MONTH</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">SPENT/WEEK</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">REFUND</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">TOTAL AMOUNT</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">LAST COMM. DATE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">SUMMARY</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">CONTACT</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendorsList().map((vendor: Vendor) => (
            <React.Fragment key={vendor.vendorId}>
              <TableRow 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleRow(vendor.vendorId)}
              >
                <TableCell>
                  {vendor.hasUpdates ? 
                    <div className="flex justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div> : 
                    null
                  }
                </TableCell>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.representative}</TableCell>
                <TableCell>{vendor.roCompleted}</TableCell>
                <TableCell>{vendor.roInProgress}</TableCell>
                <TableCell>{vendor.pendingReturns}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency(vendor.spentPerMonth)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency(vendor.spentPerWeek)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency(vendor.refundAmount)} · {vendor.refundPartsCount} Parts
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency(vendor.totalAmount)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(vendor.lastCommunicationDate)}
                </TableCell>
                <TableCell>
                  <SummaryCell text={vendor.summary} />
                </TableCell>
                <TableCell>
                  {vendor.contactInfo ? (
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
                  ) : (
                    <span className="text-gray-500">No contact info</span>
                  )}
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
                          id: vendor.vendorId,
                          type: 'vehicle'
                        }
                      }
                      children={
                        <Plus className="w-5 h-5 m-auto" />
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
              
              {expandedRows[vendor.vendorId] && (
                <TableRow key={`expanded-${vendor.vendorId}`}>
                  <TableCell colSpan={14} className="p-0 border-0">
                    <div className="bg-gray-100 rounded-md">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr>
                              <th key="th-updates" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">UPDATES</th>
                              <th key="th-ro" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">RO #</th>
                              <th key="th-vehicle" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">VEHICLE</th>
                              <th key="th-ordered" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">ORDERED</th>
                              <th key="th-assigned-tech" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">ASSIGNED TECH</th>
                              <th key="th-to-order" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">TO ORDER</th>
                              <th key="th-to-receive" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">TO RECEIVE</th>
                              <th key="th-total" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">TOTAL</th>
                              <th key="th-estimate" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">ESTIMATE</th>
                              <th key="th-ecd" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">ECD</th>
                              <th key="th-expected" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">EXPECTED</th>
                              <th key="th-view-parts" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">VIEW PARTS</th>
                              <th key="th-task" className="py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-300">TASK</th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-100 divide-y divide-gray-200">
                            {isLoadingOrders ? (
                              <tr>
                                <td colSpan={13} className="py-6 text-center text-gray-500 bg-gray-300">
                                  Loading orders...
                                </td>
                              </tr>
                            ) : ordersWithPartsToBeReceived?.filter(order => 
                              // Filter orders related to this vendor
                              order.partsOrders.some(part => 
                                part.vendor.id === vendor.vendorId || 
                                part.vendor.name.toLowerCase().includes(vendor.name.toLowerCase())
                              )
                            ).length === 0 ? (
                              <tr>
                                <td colSpan={13} className="py-6 text-center text-gray-500 bg-gray-300">
                                  No orders found for this vendor
                                </td>
                              </tr>
                            ) : (
                              ordersWithPartsToBeReceived?.filter(order => 
                                // Filter orders related to this vendor
                                order.partsOrders.some(part => 
                                  part.vendor.id === vendor.vendorId || 
                                  part.vendor.name.toLowerCase().includes(vendor.name.toLowerCase())
                                )
                              ).map((order) => (
                                <tr key={order.opportunityId}>
                                  <td className="py-4 text-sm font-medium bg-gray-300 whitespace-nowrap">
                                    {/* Updates indicator */}
                                    {order.partsOrders.some(p => p.hasUpdates) && (
                                      <div className="flex justify-center">
                                        <AlertCircle className="w-4 h-4 text-amber-500" />
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {order.roNumber}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    <VehicleCell
                                      make={order.vehicle.make}
                                      model={order.vehicle.model}
                                      year={order.vehicle.year}
                                    />
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {/* Ordered date - using last communication date as fallback */}
                                    {formatDate(order.partsOrders[0]?.lastCommunicationDate || '')}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {order.assignedTech?.name || '---'}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {calculateOrderToOrderParts(order)}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {calculateOrderToReceiveParts(order)}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {calculateOrderTotalParts(order)}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {formatCurrency(order.estimateAmount)}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {formatDate(order.estimatedCompletionDate || '')}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {/* Expected delivery date - not available */}
                                    ---
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    <div className="flex justify-center">
                                      <ViewPartsModal opportunityId={order.opportunityId}>
                                        <DarkButton 
                                          buttonText="View Parts" 
                                        />
                                      </ViewPartsModal>
                                    </div>
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation()
                                      }}
                                    >
                                      <NewTaskModal
                                        title="New Task"
                                        defaultRelation={{
                                          id: order.opportunityId,
                                          type: 'opportunity'
                                        }}
                                        children={
                                          <Plus className="w-5 h-5 m-auto" />
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
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
function useParts(): { getUniqueVendors: any } {
  throw new Error('Function not implemented.')
}

