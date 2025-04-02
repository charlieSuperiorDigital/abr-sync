// This file represents the insurance-approvals-needed route
'use client'

import * as React from 'react'
import {
  StatusBadgeCell,
  VehicleCell,
  SummaryCell,
} from '@/components/custom-components/custom-table/table-cells'
import { useState } from 'react'
import { invoicesMockData, vendorDetailsMockData, VendorDetail } from '@/app/mocks/parts-management'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus, Phone, Mail, ChevronDown } from 'lucide-react'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
import { workfiles } from '@/app/mocks/workfiles_new'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PartsInsuranceApproval {
  invoiceId: string
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
  invoiceNumber: string
  amount: number
  approvalStatus: 'pending' | 'approved' | 'rejected'
  estimator?: string
  toReceive?: number
  total?: number
  ecd?: string
  expected?: string
}

export default function InsuranceApprovalsNeeded() {
  const [data] = useState<PartsInsuranceApproval[]>(invoicesMockData)
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

  // Find a workfile by RO number
  const findWorkfileByRoNumber = (roNumber: string) => {
    return workfiles.find(workfile => workfile.roNumber === roNumber) || workfiles[0];
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-black whitespace-nowrap">RO #</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">VEHICLE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">AMOUNT</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">INSURANCE APPROVAL STATUS</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">ORDERED</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">ESTIMATOR</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">TO RECEIVE</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">TOTAL</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">ECD</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">EXPECTED</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap">VIEW PARTS</TableHead>
            <TableHead className="font-semibold text-black whitespace-nowrap"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((invoice) => (
            <React.Fragment key={invoice.invoiceId}>
              <TableRow 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleRow(invoice.invoiceId)}
              >
                <TableCell className="font-medium">{invoice.roNumber}</TableCell>
                <TableCell>
                  <VehicleCell
                    make={invoice.vehicle.make}
                    model={invoice.vehicle.model}
                    year={invoice.vehicle.year}
                    imageUrl={invoice.vehicle.imageUrl}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell>
                  <StatusBadgeCell
                    variant={
                      invoice.approvalStatus === 'approved'
                        ? 'success'
                        : invoice.approvalStatus === 'rejected'
                        ? 'danger'
                        : 'warning'
                    }
                    status={invoice.approvalStatus.toUpperCase()}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(invoice.lastUpdated)}
                </TableCell>
                <TableCell className="whitespace-nowrap">{invoice.estimator || 'N/A'}</TableCell>
                <TableCell className="whitespace-nowrap">{invoice.toReceive || 0}</TableCell>
                <TableCell className="whitespace-nowrap">{invoice.total || invoice.partsCount}</TableCell>
                <TableCell className="whitespace-nowrap">{invoice.ecd || 'N/A'}</TableCell>
                <TableCell className="whitespace-nowrap">{invoice.expected || 'N/A'}</TableCell>
                <TableCell>
                  <ViewPartsModal workfile={findWorkfileByRoNumber(invoice.roNumber)}>
                    <DarkButton 
                      buttonText="View Parts" 
                    />
                  </ViewPartsModal>
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
                          id: invoice.invoiceId,
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
              
              {expandedRows[invoice.invoiceId] && (
                <TableRow key={`expanded-${invoice.invoiceId}`}>
                  <TableCell colSpan={12} className="p-0 border-0">
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
