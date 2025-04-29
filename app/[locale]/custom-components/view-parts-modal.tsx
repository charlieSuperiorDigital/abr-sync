'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp, Clock, Clock1, MessageSquareText } from 'lucide-react'
import { Workfile } from '@/app/types/workfile'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { TenantPartOrder } from '@/app/types/parts'
import { useGetPartsByOpportunityId } from '@/app/api/hooks/useParts';
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import RoundButtonWithTooltip from './round-button-with-tooltip'

interface ViewPartsModalProps {
  children: React.ReactNode
  opportunityId: string
}

// Sample data types for the tables
interface OverviewPart {
  type: "Aftermarket" | "OEM" | "Hazardous Waste" | "Paint Materials" | "Others";
  description: string;
  repairOrderQuantity: number;
  purchaseOrderQuantity: number;
  invoiceQuantity: number;
  partsReturned: number;
}

interface DetailedPart {
  damageLine: number;
  description: string;
  status: string;
  type: "Aftermarket" | "OEM" | "Hazardous Waste" | "Paint Materials" | "Others";
  ordered: number;
  vendor: string;
  orderQuantity: number;
  receivedQuantity: number;
  returnQuantity: number;
}

interface VendorInfo {
  vendorName: string
  contact: string
  leadTime: string
  discount: string
  rating: string
  lastOrder: string
  representative: string
  lastCommunicationDate: string
  repairOrderQuantity: number
  purchaseOrderQuantity: number
  invoiceQuantity: number
  contactInfo: {
    person: {
      name: string
      role: string
      address: string
      company: string
      preferredContactType: string
    }
    insurance: {
      company: string
      representative: string
      pendingEstimates: number
      pendingReimbursements: number
      updates: string
    }
    communicationLogs: any[]
    emailContacts: {
      email: string
      isPrimary: boolean
    }[]
    attachmentOptions: any[]
  }
}

const vendorData: VendorInfo[] = [
  {
    vendorName: "AutoParts Co.",
    contact: "janesmith@autoparts.com | (555) 123-4567",
    leadTime: "2 days",
    discount: "5%",
    rating: "4.5",
    lastOrder: "2025-04-18",
    representative: "Jane Smith",
    lastCommunicationDate: "2025-04-20",
    repairOrderQuantity: 12,
    purchaseOrderQuantity: 10,
    invoiceQuantity: 8,
    contactInfo: {
      person: {
        name: "Jane Smith",
        role: "Vendor Representative",
        address: "123 Vendor St, City, State",
        company: "AutoParts Co.",
        preferredContactType: "Email"
      },
      insurance: {
        company: "Vendor Insurance",
        representative: "Vendor Rep",
        pendingEstimates: 0,
        pendingReimbursements: 0,
        updates: "-"
      },
      communicationLogs: [],
      emailContacts: [
        { email: "janesmith@autoparts.com", isPrimary: true }
      ],
      attachmentOptions: []
    }
  },
  {
    vendorName: "Premium Vendors Inc.",
    contact: "johndoe@premiumvendors.com | (555) 987-6543",
    leadTime: "3 days",
    discount: "10%",
    rating: "4.8",
    lastOrder: "2025-04-17",
    representative: "John Doe",
    lastCommunicationDate: "2025-04-18",
    repairOrderQuantity: 5,
    purchaseOrderQuantity: 5,
    invoiceQuantity: 4,
    contactInfo: {
      person: {
        name: "John Doe",
        role: "Vendor Representative",
        address: "456 Supplier Ave, City, State",
        company: "Premium Vendors Inc.",
        preferredContactType: "Phone"
      },
      insurance: {
        company: "Vendor Insurance",
        representative: "Vendor Rep",
        pendingEstimates: 0,
        pendingReimbursements: 0,
        updates: "-"
      },
      communicationLogs: [],
      emailContacts: [
        { email: "johndoe@premiumvendors.com", isPrimary: true }
      ],
      attachmentOptions: []
    }
  }
  // Add more objects as needed
];

const overviewData: OverviewPart[] = [
  { type: "OEM", description: "Front Bumper", repairOrderQuantity: 2, purchaseOrderQuantity: 2, invoiceQuantity: 2, partsReturned: 0 },
  { type: "Aftermarket", description: "Rear Mirror", repairOrderQuantity: 1, purchaseOrderQuantity: 1, invoiceQuantity: 1, partsReturned: 0 },
  { type: "Paint Materials", description: "Primer Set", repairOrderQuantity: 3, purchaseOrderQuantity: 3, invoiceQuantity: 3, partsReturned: 0 },
  { type: "Hazardous Waste", description: "Solvent Waste", repairOrderQuantity: 1, purchaseOrderQuantity: 1, invoiceQuantity: 1, partsReturned: 1 },
  { type: "OEM", description: "Headlight Assembly", repairOrderQuantity: 2, purchaseOrderQuantity: 2, invoiceQuantity: 2, partsReturned: 0 },
  { type: "Others", description: "Fasteners Kit", repairOrderQuantity: 5, purchaseOrderQuantity: 5, invoiceQuantity: 5, partsReturned: 0 },
  { type: "Aftermarket", description: "Side Skirt", repairOrderQuantity: 1, purchaseOrderQuantity: 1, invoiceQuantity: 1, partsReturned: 0 }
];

const detailedPartsData: DetailedPart[] = [
  { damageLine: 1, description: "Front Bumper", status: "Ordered", type: "OEM", ordered: 2, vendor: "AutoParts Co.", orderQuantity: 2, receivedQuantity: 2, returnQuantity: 0 },
  { damageLine: 2, description: "Rear Mirror", status: "Received", type: "Aftermarket", ordered: 1, vendor: "Premium Vendors Inc.", orderQuantity: 1, receivedQuantity: 1, returnQuantity: 0 },
  { damageLine: 3, description: "Primer Set", status: "Invoiced", type: "Paint Materials", ordered: 3, vendor: "Paint Supplies Ltd.", orderQuantity: 3, receivedQuantity: 3, returnQuantity: 0 },
  { damageLine: 4, description: "Solvent Waste", status: "Returned", type: "Hazardous Waste", ordered: 1, vendor: "Waste Management", orderQuantity: 1, receivedQuantity: 1, returnQuantity: 1 },
  { damageLine: 5, description: "Headlight Assembly", status: "Ordered", type: "OEM", ordered: 2, vendor: "AutoParts Co.", orderQuantity: 2, receivedQuantity: 2, returnQuantity: 0 },
  { damageLine: 6, description: "Fasteners Kit", status: "Received", type: "Others", ordered: 5, vendor: "Hardware Hub", orderQuantity: 5, receivedQuantity: 5, returnQuantity: 0 },
  { damageLine: 7, description: "Side Skirt", status: "Ordered", type: "Aftermarket", ordered: 1, vendor: "Premium Vendors Inc.", orderQuantity: 1, receivedQuantity: 1, returnQuantity: 0 }
];

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
  const { isLoading, error, parts } = useGetPartsByOpportunityId(opportunityId);

  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    parts: true,
    partsByVendor: true
  })




  // Column definitions for tables
  const overviewColumns: ColumnDef<OverviewPart, any>[] = [
    { accessorKey: 'type', header: 'TYPE' },
    { accessorKey: 'description', header: 'DESCRIPTION' },
    { accessorKey: 'repairOrderQuantity', header: 'REPAIR ORDER QTY.' },
    { accessorKey: 'purchaseOrderQuantity', header: 'PURCHASE ORDER QTY' },
    { accessorKey: 'invoiceQuantity', header: 'INVOICE QTY' },
    { accessorKey: 'partsReturned', header: 'PARTS RETURNED' },
  ]

  const partsColumns: ColumnDef<DetailedPart, any>[] = [
    { accessorKey: 'damageLine', header: 'LINE' },
    { accessorKey: 'description', header: 'DESCRIPTION' },
    { accessorKey: 'status', header: 'STATUS' },
    { accessorKey: 'type', header: 'TYPE' },
    { accessorKey: 'ordered', header: 'ORDERED' },
    { accessorKey: 'vendor', header: 'VENDOR' },
    { accessorKey: 'orderQuantity', header: 'ORDER QTY' },
    { accessorKey: 'receivedQuantity', header: 'RECEIVED QTY.' },
    { accessorKey: 'returnQuantity', header: 'RETURN QTY.' },
  ]

  const vendorColumns: ColumnDef<VendorInfo, any>[] = [
    { accessorKey: 'vendorName', header: 'NAME' },
    { accessorKey: 'representative', header: 'REPRESENTATIVE' },
    {
      accessorKey: 'lastCommunicationDate', header: 'LAST COMMUNICATION DATE · SUMMARY',
      cell: ({ row }) => (
        <div className="flex flex-col px-2 w-full">
          <div className="flex flex-row justify-between items-center w-full">
            <span className="text-gray-500">{row.original.lastCommunicationDate}</span>
            {/* <MessageSquareText className="w-5 h-5" /> */}
            <RoundButtonWithTooltip
              buttonIcon={<MessageSquareText className="w-4 h-4" />}
              tooltipText='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros bibendum, nec eleifend sem facilisis.'
            />
          </div>
          <span className="ml-2 max-w-[40ch] text-gray-500 truncate">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros bibendum, nec eleifend sem facilisis.</span>
        </div>
      )
    },
    { accessorKey: 'repairOrderQuantity', header: 'REPAIR ORDER QTY' },
    { accessorKey: 'purchaseOrderQuantity', header: 'PURCHASE ORDER QTY.' },
    { accessorKey: 'invoiceQuantity', header: 'INVOICE QTY.' },
    {
      id: 'contactInfo',
      header: '',
      cell: ({ row }) => (
        <ContactInfo contactData={row.original.contactInfo} />
      )
    }
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
      className="flex justify-between items-center p-4 pl-4 rounded-md cursor-pointer"
      onClick={onToggle}
    >
      <h2 className="text-2xl font-bold">{title}</h2>
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
            className="bg-white w-[90%] pl-4 h-full overflow-y-auto py-6 flex flex-col shadow-xl transition-transform duration-300 ease-out"
            style={{ transform: isAnimating ? 'translateX(0)' : 'translateX(100%)' }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-row items-center">
                <h1 className="pl-4 text-2xl font-bold">Parts</h1>
                <Clock className="mr-2 ml-5 w-5 h-5" color='green' />
                <span className='text-green-500'>Last Updated in CCC {`Yesterday at 12:35 PM`} </span>
              </div>
              <div className="flex flex-row items-center">
                {/* Item count bar */}
                <div className="flex flex-row items-center px-4 py-2 bg-black rounded-full">
                  <div className="flex flex-row items-center">
                    <span className="text-white">TOTAL PARTS</span>
                    <span className="ml-2 text-white">{`XY`}</span>
                  </div>
                  <span className="mx-4 text-white">|</span>
                  <div className="flex flex-row items-center">
                    <span className="text-white">PARTS TO ORDER</span>
                    <span className="ml-2 text-white">{`XY`}</span>
                  </div>
                  <span className="mx-4 text-white">|</span>
                  <div className="flex flex-row items-center">
                    <span className="text-white">PARTS RECEIVED</span>
                    <span className="ml-2 text-white">{`XY`}</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 mr-6 rounded-full hover:bg-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 space-y-6">
              {/* Modal Title */}
              <div className="pb-2 pl-4">
                <h1 className="text-4xl font-bold">Parts</h1>
              </div>
              {/* Overview Section */}
              <div className="">
                <SectionHeader
                  title="Overview"
                  isExpanded={expandedSections.overview}
                  onToggle={() => toggleSection('overview')}
                />
                {expandedSections.overview && (
                  <div className="pl-4">
                    <DataTable
                      columns={overviewColumns}
                      data={overviewData}
                      className="w-full"
                      rowHeightClass="h-14"
                      showPaginationControls={false}
                    />
                  </div>
                )}
              </div>

              {/* Parts Section */}
              <div className="">
                <SectionHeader
                  title="Parts"
                  isExpanded={expandedSections.parts}
                  onToggle={() => toggleSection('parts')}
                />
                {expandedSections.parts && (
                  <div className="pl-4">
                    <DataTable
                      columns={partsColumns}
                      data={detailedPartsData}
                      className="w-full"
                      rowHeightClass="h-14"
                    />
                  </div>
                )}
              </div>

              {/* Parts by Vendor Section */}
              <div className="">
                <SectionHeader
                  title="Parts by Vendor"
                  isExpanded={expandedSections.partsByVendor}
                  onToggle={() => toggleSection('partsByVendor')}
                />
                {expandedSections.partsByVendor && (
                  <div className="pl-4">
                    <DataTable
                      columns={vendorColumns}
                      data={vendorData}
                      className="w-full"
                      rowHeightClass="h-14"
                      showPaginationControls={false}
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
