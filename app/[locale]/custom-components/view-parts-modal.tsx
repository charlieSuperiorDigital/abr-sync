'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { Workfile } from '@/app/types/workfile'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ColumnDef } from '@tanstack/react-table'

interface ViewPartsModalProps {
  children: React.ReactNode
  workfile: Workfile
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

export function ViewPartsModal({
  children,
  workfile
}: ViewPartsModalProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    parts: true,
    partsByVendor: true
  })

  // Sample data for tables
  const overviewData: OverviewPart[] = [
    { partNumber: 'PN-1000', description: 'Front Bumper Assembly', quantity: 1, unitPrice: 120, vendor: 'Superior Auto Parts', status: 'In Stock' },
    { partNumber: 'PN-1001', description: 'Headlight Assembly (Left)', quantity: 2, unitPrice: 135, vendor: 'Superior Auto Parts', status: 'On Order' },
    { partNumber: 'PN-1002', description: 'Fender Panel (Right)', quantity: 3, unitPrice: 150, vendor: 'AutoZone', status: 'Backordered' },
    { partNumber: 'PN-1003', description: 'Hood Latch', quantity: 4, unitPrice: 165, vendor: 'NAPA Auto Parts', status: 'Shipped' },
    { partNumber: 'PN-1004', description: 'Radiator Support', quantity: 5, unitPrice: 180, vendor: 'O\'Reilly', status: 'Delivered' }
  ]

  const partsData: DetailedPart[] = [
    { partId: 'ID-2000', manufacturer: 'Toyota', category: 'Engine', weight: '2.5 kg', dimensions: '10″ × 8″ × 4″', warranty: '1 year' },
    { partId: 'ID-2001', manufacturer: 'Honda', category: 'Body', weight: '3.7 kg', dimensions: '11″ × 9″ × 5″', warranty: '2 years' },
    { partId: 'ID-2002', manufacturer: 'Ford', category: 'Electrical', weight: '4.9 kg', dimensions: '12″ × 10″ × 6″', warranty: '3 years' },
    { partId: 'ID-2003', manufacturer: 'BMW', category: 'Suspension', weight: '6.1 kg', dimensions: '13″ × 11″ × 7″', warranty: '4 years' },
    { partId: 'ID-2004', manufacturer: 'Mercedes', category: 'Interior', weight: '7.3 kg', dimensions: '14″ × 12″ × 8″', warranty: '5 years' },
    { partId: 'ID-2005', manufacturer: 'Audi', category: 'Brakes', weight: '8.5 kg', dimensions: '15″ × 13″ × 9″', warranty: '6 years' }
  ]

  const vendorData: VendorInfo[] = [
    { vendorName: 'AutoZone', contact: 'John Smith', leadTime: '2 days', discount: '0%', rating: '★★★★★', lastOrder: 'Yesterday' },
    { vendorName: 'NAPA Auto Parts', contact: 'Sarah Johnson', leadTime: '3 days', discount: '5%', rating: '★★★★☆', lastOrder: 'Last week' },
    { vendorName: 'O\'Reilly', contact: 'Mike Williams', leadTime: '4 days', discount: '10%', rating: '★★★☆☆', lastOrder: '2 weeks ago' },
    { vendorName: 'Advance Auto', contact: 'Lisa Brown', leadTime: '5 days', discount: '15%', rating: '★★☆☆☆', lastOrder: 'Last month' }
  ]

  // Column definitions for tables
  const overviewColumns: ColumnDef<OverviewPart, any>[] = [
    { accessorKey: 'partNumber', header: 'Part Number' },
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
                    <DataTable
                      columns={overviewColumns}
                      data={overviewData}
                      className="w-full"
                    />
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
                    <DataTable
                      columns={partsColumns}
                      data={partsData}
                      className="w-full"
                    />
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
                    <DataTable
                      columns={vendorColumns}
                      data={vendorData}
                      className="w-full"
                    />
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
