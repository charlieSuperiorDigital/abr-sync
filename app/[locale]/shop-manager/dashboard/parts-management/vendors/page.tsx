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
  const [data] = useState<Vendor[]>(vendorsMockData)
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
          {data.map((vendor) => (
            <React.Fragment key={vendor.vendorId}>
              <TableRow 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleRow(vendor.vendorId)}
              >
                <TableCell>
                  {vendor.hasUpdates ? 
                    <div className="flex justify-center">
                      <AlertCircle className="text-amber-500 w-5 h-5" />
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
                        <Plus className="m-auto w-5 h-5" />
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
                            {vendorDetails.map((detail) => (
                              <tr key={detail.vendorDetailId}>
                                <td className="py-4 text-sm font-medium whitespace-nowrap bg-gray-300">
                                  {detail.name}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {detail.representative}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {detail.toOrder}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {detail.toReceive}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {detail.toReturn}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {detail.total}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {formatCurrency(detail.totalAmount)}
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  {formatDate(detail.lastCommunicationDate)}
                                </td>
                                <td className="py-4 text-sm text-gray-700 bg-gray-300">
                                  <SummaryCell text={detail.summary} />
                                </td>
                                <td className="py-4 text-sm text-gray-700 whitespace-nowrap bg-gray-300">
                                  <div className="flex space-x-2">
                                    <a 
                                      href={`tel:${detail.contactInfo.phone}`} 
                                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Phone className="w-4 h-4" />
                                    </a>
                                    <a 
                                      href={`mailto:${detail.contactInfo.email}`} 
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
