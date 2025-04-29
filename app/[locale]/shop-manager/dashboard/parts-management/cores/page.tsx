'use client'

import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
// import { TenantPartOrder } from '@/app/api/functions/parts'
import { useGetTenantPartOrders } from '@/app/api/hooks/useParts'
import { VendorDetail, vendorDetailsMockData } from '@/app/mocks/parts-management'
import { PartsOrderSummary, TenantPartOrder } from '@/app/types/parts'
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
import { AlertCircle, Mail, Phone, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import * as React from 'react'
import { useState } from 'react'


export default function ToOrder() {
  const { data: session } = useSession();
  const {
    ordersWithCoreParts: data,
    isLoading
  } = useGetTenantPartOrders({
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
    // return workfiles.find(workfile => workfile.roNumber === roNumber) || workfiles[0];
  }


  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-black whitespace-nowrap">UPDATES</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">RO #</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">VEHICLE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">DESCRIPTION</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">PRICE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">VIEW PARTS</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">TASK</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.flatMap((opportunity: TenantPartOrder) => 
            opportunity.partsOrders.flatMap(partsOrder => 
              partsOrder.coreParts.map(corePart => (
                <React.Fragment key={`${opportunity.opportunityId}-${partsOrder.partsOrderId}-${corePart.id}`}>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleRow(`${opportunity.opportunityId}-${partsOrder.partsOrderId}-${corePart.id}`)}
                  >
                    <TableCell>
                      {/* Updates indicator - empty for now */}
                      {partsOrder.hasUpdates && <AlertCircle className="w-4 h-4 text-amber-500" />}
                    </TableCell>
                    <TableCell>{opportunity.roNumber}</TableCell>
                    <TableCell>
                      <VehicleCell
                        make={opportunity.vehicle.make}
                        model={opportunity.vehicle.model}
                        year={opportunity.vehicle.year}
                      />
                    </TableCell>
                    <TableCell>
                      {corePart.description}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(corePart.unitPrice)}
                    </TableCell>
                    <TableCell>
                      <ViewPartsModal opportunityId={opportunity.opportunityId}>
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
                          <Plus className="w-5 h-5 m-auto" />
                        }
                      />
                    </TableCell>
                  </TableRow>

                  {expandedRows[`${opportunity.opportunityId}-${partsOrder.partsOrderId}-${corePart.id}`] && (
                    <TableRow key={`expanded-${opportunity.opportunityId}-${partsOrder.partsOrderId}-${corePart.id}`}>
                      <TableCell colSpan={7} className="p-0 border-0">
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
                                <tr>
                                  <td className="py-4 text-sm font-medium bg-gray-300 whitespace-nowrap">
                                    {partsOrder.vendor.name}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {partsOrder.vendor.contactName}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {partsOrder.partsToOrderCount}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {partsOrder.partsToReceiveCount}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {partsOrder.partsToReturnCount}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {partsOrder.partsToOrderCount + partsOrder.partsToReceiveCount + partsOrder.partsToReturnCount}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {formatCurrency(partsOrder.totalAmount)}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {formatDate(partsOrder.lastCommunicationDate)}
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300">
                                    <SummaryCell text={partsOrder.summary} />
                                  </td>
                                  <td className="py-4 text-sm text-gray-700 bg-gray-300 whitespace-nowrap">
                                    {partsOrder.vendor.contactPhone && partsOrder.vendor.contactEmail && (
                                      <div className="flex space-x-2">
                                        <a
                                          href={`tel:${partsOrder.vendor.contactPhone}`}
                                          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Phone className="w-4 h-4" />
                                        </a>
                                        <a
                                          href={`mailto:${partsOrder.vendor.contactEmail}`}
                                          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Mail className="w-4 h-4" />
                                        </a>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}
