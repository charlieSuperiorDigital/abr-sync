'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { Workfile } from '@/app/types/workfile'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { TenantPartOrder } from '@/app/types/parts'
import { useGetPartsByOpportunityId } from '@/app/api/hooks/useParts';

interface ViewPartsModalProps {
  children: React.ReactNode
  opportunityId: string
}

// Sample data types for the tables
interface OverviewPart {
  partNumber: string
  description: string
  quantity: number
  unitPrice: number
  vendor: string
  status: string
}

interface DetailedPart {
  partId: string
  manufacturer: string
  category: string
  weight: string
  dimensions: string
  warranty: string
}

interface VendorInfo {
  vendorName: string
  contact: string
  leadTime: string
  discount: string
  rating: string
  lastOrder: string
}

/**
 * A modal component that displays a detailed view of a part order.
 * It shows an overview of the order, as well as detailed tables of the parts and vendors.
 * The tables are toggleable, and the modal can be closed with a button or by clicking outside of it.
 *
 * @param {React.ReactNode} children - The content to be displayed inside the modal.
 * @param {string} opportunityId - The opportunity ID to be displayed.
 * @returns {React.ReactElement} - A JSX element representing the modal.
 */
export function ViewPartsModal({
  children,
  opportunityId
}: ViewPartsModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Fetch parts group by opportunityId
  const {  isLoading, error, returnPartsWithOpportunityId } = useGetPartsByOpportunityId(opportunityId);

  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    parts: true,
    partsByVendor: true
  })

  const parts = returnPartsWithOpportunityId(opportunityId);

  // Sample data for tables


  // Column definitions for tables
  const overviewColumns: ColumnDef<OverviewPart, any>[] = [
    { accessorKey: 'type', header: 'TYPE' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'quantity', header: 'Quantity' },
    { 
      accessorKey: 'unitPrice', 
      header: 'Unit Price',
      cell: ({ row }) => `$${row.original.unitPrice.toFixed(2)}`
    },
    { accessorKey: 'vendor', header: 'Vendor' },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold
          ${row.original.status === 'In Stock' ? 'bg-green-100 text-green-800' : 
            row.original.status === 'On Order' ? 'bg-blue-100 text-blue-800' : 
            row.original.status === 'Backordered' ? 'bg-yellow-100 text-yellow-800' : 
            row.original.status === 'Shipped' ? 'bg-purple-100 text-purple-800' : 
            'bg-gray-100 text-gray-800'}`
        }>
          {row.original.status}
        </span>
      )
    }
  ]

  const partsColumns: ColumnDef<DetailedPart, any>[] = [
    { accessorKey: 'partId', header: 'Part ID' },
    { accessorKey: 'manufacturer', header: 'Manufacturer' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'weight', header: 'Weight' },
    { accessorKey: 'dimensions', header: 'Dimensions' },
    { accessorKey: 'warranty', header: 'Warranty' }
  ]

  const vendorColumns: ColumnDef<VendorInfo, any>[] = [
    { accessorKey: 'vendorName', header: 'Vendor Name' },
    { accessorKey: 'contact', header: 'Contact' },
    { accessorKey: 'leadTime', header: 'Lead Time' },
    { accessorKey: 'discount', header: 'Discount' },
    { accessorKey: 'rating', header: 'Rating' },
    { accessorKey: 'lastOrder', header: 'Last Order' }
  ]

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  const handleShowModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShouldShowModal(true)
    // Delay setting isAnimating to true to allow the initial render with translateX(100%)
    setTimeout(() => {
      setIsAnimating(true)
    }, 10)
  }

  const closeModal = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setShouldShowModal(false)
    }, 300) // Match this with the transition duration
  }

  const toggleSection = (section: 'overview' | 'parts' | 'partsByVendor') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const SectionHeader = ({ 
    title, 
    isExpanded, 
    onToggle 
  }: { 
    title: string, 
    isExpanded: boolean, 
    onToggle: () => void 
  }) => (
    <div 
      className="flex justify-between items-center p-4 bg-gray-100 rounded-md cursor-pointer"
      onClick={onToggle}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </div>
  )

  return (
    <>
      {/* Button wrapper with enhanced click handling */}
      <div 
        onClick={handleShowModal}
        onMouseDown={(e) => e.stopPropagation()}
        className="inline-block"
      >
        {children}
      </div>

      {shouldShowModal && (
        <div
          className="flex fixed inset-0 z-50 justify-end transition-opacity duration-300 bg-black/50"
          style={{ opacity: isAnimating ? 1 : 0 }}
          onClick={handleOverlayClick}
        >
          <div 
            className="bg-white w-[90%] h-full overflow-y-auto py-6 flex flex-col shadow-xl transition-transform duration-300 ease-out"
            style={{ transform: isAnimating ? 'translateX(0)' : 'translateX(100%)' }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="pl-4 text-2xl font-bold">Parts</h1>
              <button
                onClick={closeModal}
                className="p-2 mr-6 rounded-full hover:bg-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 space-y-6">
              {/* Overview Section */}
              <div className="rounded-md border">
                <SectionHeader 
                  title="Overview" 
                  isExpanded={expandedSections.overview} 
                  onToggle={() => toggleSection('overview')} 
                />
                
                {expandedSections.overview && (
                  <div className="">
                    {/* <DataTable
                      columns={overviewColumns}
                      data={overviewData}
                      className="w-full"
                    /> */}
                  </div>
                )}
              </div>

              {/* Parts Section */}
              <div className="rounded-md border">
                <SectionHeader 
                  title="Parts" 
                  isExpanded={expandedSections.parts} 
                  onToggle={() => toggleSection('parts')} 
                />
                
                {expandedSections.parts && (
                  <div className="">
                    {/* <DataTable
                      columns={partsColumns}
                      data={partsData}
                      className="w-full"
                    /> */}
                  </div>
                )}
              </div>

              {/* Parts by Vendor Section */}
              <div className="rounded-md border">
                <SectionHeader 
                  title="Parts by Vendor" 
                  isExpanded={expandedSections.partsByVendor} 
                  onToggle={() => toggleSection('partsByVendor')} 
                />
                
                {expandedSections.partsByVendor && (
                  <div className="">
                    {/* <DataTable
                      columns={vendorColumns}
                      data={vendorData}
                      className="w-full"
                    /> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
