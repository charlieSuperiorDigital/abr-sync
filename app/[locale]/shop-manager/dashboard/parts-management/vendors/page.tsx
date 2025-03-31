'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  SummaryCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { vendorsMockData } from '@/app/mocks/vendors'
import { Vendor } from '@/app/types/vendor'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus, AlertCircle, Phone, Mail } from 'lucide-react'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'

export default function Vendors() {
  const [data] = useState<Vendor[]>(vendorsMockData)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const columns: ColumnDef<Vendor, any>[] = [
    {
      accessorKey: 'hasUpdates',
      header: 'UPDATES',
      cell: ({ row }) => (
        row.original.hasUpdates ? 
          <div className="flex justify-center">
            <AlertCircle className="text-amber-500 w-5 h-5" />
          </div> : 
          null
      ),
    },
    {
      accessorKey: 'name',
      header: 'NAME',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'representative',
      header: 'REPRESENTATIVE',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.representative}</span>
      ),
    },
    {
      accessorKey: 'roCompleted',
      header: 'RO COMP.',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.roCompleted}</span>
      ),
    },
    {
      accessorKey: 'roInProgress',
      header: 'RO IN PROG.',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.roInProgress}</span>
      ),
    },
    {
      accessorKey: 'pendingReturns',
      header: 'PENDING RETURNS',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.pendingReturns}</span>
      ),
    },
    {
      accessorKey: 'spentPerMonth',
      header: 'SPENT/MONTH',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatCurrency(row.original.spentPerMonth)}</span>
      ),
    },
    {
      accessorKey: 'spentPerWeek',
      header: 'SPENT/WEEK',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatCurrency(row.original.spentPerWeek)}</span>
      ),
    },
    {
      accessorKey: 'refund',
      header: 'REFUND',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatCurrency(row.original.refundAmount)} · {row.original.refundPartsCount} Parts
        </span>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'TOTAL AMOUNT',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatCurrency(row.original.totalAmount)}</span>
      ),
    },
    {
      accessorKey: 'lastCommunicationDate',
      header: 'LAST COMM. DATE',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDate(row.original.lastCommunicationDate)}</span>
      ),
    },
    {
      accessorKey: 'summary',
      header: 'SUMMARY',
      cell: ({ row }) => <SummaryCell text={row.original.summary} />,
    },
    {
      accessorKey: 'contactInfo',
      header: '',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <a 
            href={`tel:${row.original.contactInfo.phone}`} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-4 h-4" />
          </a>
          <a 
            href={`mailto:${row.original.contactInfo.email}`} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
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
                id: row.original.vendorId,
                type: "vehicle"
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
