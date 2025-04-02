'use client'

import * as React from 'react'
import {
  StatusBadgeCell,
  VehicleCell,
  SummaryCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { toOrderMockData, vendorDetailsMockData, VendorDetail } from '@/app/mocks/parts-management'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { Phone, Mail, ChevronDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
import { workfiles } from '@/app/mocks/workfiles_new'

interface PartsOrder {
  orderId: string
  roNumber: string
  vehicle: {
    make: string
    model: string
    year: number
    imageUrl?: string
  }
  partsCount: number
  assignedTech: string
  status: string
  lastUpdated: string
  neededByDate: string
  vendor: string
  priority: 'high' | 'medium' | 'low'
}

export default function ToOrder() {
  const [data] = useState<PartsOrder[]>(toOrderMockData)
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
            <TableHead className="font-semibold text-black whitespace-nowrap">UPDATES</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">RO #</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">VEHICLE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">TO ORDER</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">TO RECEIVE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">TOTAL</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">ASSIGNED TECH</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">ESTIMATE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">ECD</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">VIEW PARTS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((order) => (
            <React.Fragment key={order.orderId}>
              <TableRow 
                key={order.orderId} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleRow(order.orderId)}
              >
                <TableCell></TableCell>
                <TableCell>{order.roNumber}</TableCell>
                <TableCell>
                  <VehicleCell
                    make={order.vehicle.make}
                    model={order.vehicle.model}
                    year={order.vehicle.year}
                    imageUrl={order.vehicle.imageUrl}
                  />
                </TableCell>
                <TableCell>{order.partsCount}</TableCell>
                <TableCell>0</TableCell>
                <TableCell>{order.partsCount}</TableCell>
                <TableCell>{order.assignedTech}</TableCell>
                <TableCell>$0</TableCell>
                <TableCell>{formatDate(order.neededByDate)}</TableCell>
                <TableCell>
                  <ViewPartsModal workfile={findWorkfileByRoNumber(order.roNumber)}>
                    <DarkButton 
                      buttonText="View Parts" 
                    />
                  </ViewPartsModal>
                </TableCell>
              </TableRow>
              
              {/* Expanded vendor details */}
              {expandedRows[order.orderId] && (
                <TableRow key={`expanded-${order.orderId}`}>
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
