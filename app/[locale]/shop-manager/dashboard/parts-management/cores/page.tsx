'use client'

import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
import { TenantPartOrder } from '@/app/api/functions/parts'
import { useGetTenantPartOrders } from '@/app/api/hooks/useParts'
import { VendorDetail, vendorDetailsMockData } from '@/app/mocks/parts-management'
import { workfiles } from '@/app/mocks/workfiles_new'
import {
  SummaryCell,
  VehicleCell
} from '@/components/custom-components/custom-table/table-cells'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Mail, Phone, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import * as React from 'react'
import { useState } from 'react'


export default function ToOrder() {
  const { data: session } = useSession();
  const {
    ordersWithCoreParts: data,
    isLoading,
    calculateOrderTotalParts,
    calculateOrderToOrderParts,
    calculateOrderToReceiveParts,
    calculateOrderToReturnParts } = useGetTenantPartOrders({
      tenantId: session?.user?.tenantId || ''
    });

  if (isLoading) return <div>Loading...</div>;

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [vendorDetails] = useState<VendorDetail[]>(vendorDetailsMockData)

  const toggleRow = (orderId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  // Find a workfile by RO number
  const findWorkfileByRoNumber = (roNumber: string) => {
    return workfiles.find(workfile => workfile.roNumber === roNumber) || workfiles[0];
  }


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="font-semibold text-black whitespace-nowrap">UPDATES</TableHead> */}
            <TableHead className="font-semibold text-black whitespace-nowrap">RO #</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">VEHICLE</TableHead>
            {/* <TableHead className="font-semibold text-black whitespace-nowrap">DESCRIPTION</TableHead> */}
            {/* <TableHead className="font-semibold text-black whitespace-nowrap">PRICE</TableHead> */}
            <TableHead className="font-semibold text-black whitespace-nowrap">VIEW PARTS</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">TASK</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((opportunity: TenantPartOrder) => (
            <React.Fragment key={opportunity.opportunityId}>
              <TableRow
                key={opportunity.opportunityId}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleRow(opportunity.opportunityId)}
              >
                {/* <TableCell>{opportunity.hasUpdate} </TableCell> */}
                <TableCell>{opportunity.roNumber}</TableCell>
                <TableCell>
                  <VehicleCell
                    make={opportunity.vehicle.make}
                    model={opportunity.vehicle.model}
                    year={opportunity.vehicle.year}
                    // imageUrl={opportunity.vehicle.imageUrl}
                  />
                </TableCell>
                {/* <TableCell>{opportunity.core?.description}</TableCell> */}
                {/* <TableCell>{formatCurrency(opportunity.core?.price)}</TableCell> */}
                <TableCell>
                  <ViewPartsModal partOrder={opportunity}>
                    <DarkButton buttonText="View Parts" />
                  </ViewPartsModal>
                </TableCell>
                <TableCell>
                  <NewTaskModal
                    title="New Task"
                    defaultRelation={{
                      id: opportunity.opportunityId,
                      type: 'opportunity'
                    }}
                    children={
                      <Plus className="m-auto w-5 h-5" />
                    }
                  />
                </TableCell>
                <TableCell>
                  <ViewPartsModal partOrder={opportunity}>
                    <DarkButton buttonText="View Parts" />
                  </ViewPartsModal>
                </TableCell>
                <TableCell>
                  <NewTaskModal
                    title="New Task"
                    defaultRelation={{
                      id: opportunity.opportunityId,
                      type: 'opportunity'
                    }}
                    children={
                      <Plus className="m-auto w-5 h-5" />
                    }
                  />
                </TableCell>
              </TableRow>

              {expandedRows[opportunity.opportunityId] && (
                <TableRow key={`expanded-${opportunity.opportunityId}`}>
                  <TableCell colSpan={10} className="p-0 border-0">
                    <div className="bg-gray-100 rounded-md">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-400">
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
                            {opportunity.partsOrders.map((order) => (
                              <tr key={order.partsOrderId}>
                                <td className="py-4 text-sm font-medium whitespace-nowrap bg-gray-300">
                                  {order.vendor.name}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {order.vendor.contactName}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {order.partsToOrderCount}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {order.partsToReceiveCount}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {order.partsToReturnCount}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {order.partsToOrderCount + order.partsToReceiveCount + order.partsToReturnCount}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {formatCurrency(order.totalAmount)}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {formatDate(order.lastCommunicationDate)}
                                </td>
                                <td className="py-4 text-sm text-gray-700 bg-gray-300">
                                  <SummaryCell text="N/A" />
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  <div className="flex space-x-2">
                                    <a
                                      href={`tel:${'123-123-1234'}`}
                                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Phone className="w-4 h-4" />
                                    </a>
                                    <a
                                      href={`mailto:${'vendor@mail.com'}`}
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
