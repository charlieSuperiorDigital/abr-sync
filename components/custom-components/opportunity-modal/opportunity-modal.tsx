import { Opportunity, GetOpportunityByIdApiResponse } from '@/app/types/opportunity'
import { Button } from '@/components/ui/button'
import { Printer, Mail, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ContactData, ContactPerson, Insurance, EmailContact, AttachmentOption, ContactMethod, CommunicationLog } from '@/app/types/contact-info.types'
import { useGetOpportunityById, useGetOpportunityLogs } from '@/app/api/hooks/useOpportunities'
import { useGetQualityCheck } from '@/app/api/hooks/useQualityCheck'
import { useCall } from '@/app/context/call-context'
import CallDurationBadge from '@/app/[locale]/custom-components/calls/call-maker'

interface OpportunityModalProps {
  opportunityId: string
  workfileId?: string
}

// Types for logs
interface LogUser {
  id: string
  name: string
  profilePicture?: string
}

interface LogEntry {
  type: string
  date: string
  user: string | LogUser
  // ...other fields as needed
}

const OpportunityModal = ({ opportunityId, workfileId }: OpportunityModalProps) => {
  const { opportunity, isLoading: isLoadingOpportunity, error } = useGetOpportunityById(opportunityId)
  const { qualityCheck, isLoading: isLoadingQualityControl } = useGetQualityCheck({
    workfileId: workfileId || '',
    enabled: !!workfileId
  })
  const { logs, isLoading: isLoadingLogs } = useGetOpportunityLogs(opportunityId)
  const { status: CallSatus } = useCall()
  // Ensure logs is always an array
  const safeLogs: LogEntry[] = Array.isArray(logs) ? logs : []

  // Loading state
  if (isLoadingOpportunity) {
    return (
      <div className="p-4 space-y-4">
        <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex gap-2">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="w-full h-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full h-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full h-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !opportunity) {
    return (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-red-500">Error Loading Opportunity</h3>
        <p className="mt-2 text-gray-600">
          {error ? `${error}` : 'Could not load opportunity details.'}
        </p>
        <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  // const qcItems: { label: string; checked: boolean }[] = [
  //   { label: 'SIGNATURE', checked: opportunity.status === 'Estimate' },
  //   { label: 'PRE-SCAN', checked: opportunity.preScanCompleted || false },
  //   { label: 'POST-SCAN', checked: opportunity.postScanCompleted || false },
  //   { label: 'SUBLETS', checked: opportunity.subletsCompleted || false },
  //   { label: 'FINAL QC', checked: opportunity.qcCompleted || false }
  // ]

  // Format date helper
  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Format time helper
  const formatTime = (date: string | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Helper to safely get owner properties
  const getOwnerProp = (owner: any, prop: string, fallback = '') => {
    if (typeof owner === 'object' && owner !== null)
      return owner[prop] ?? fallback
    return prop === 'name' ? owner || fallback : fallback
  }

  // Email attachments
  const attachments: AttachmentOption[] = [
    { id: '1', name: 'Estimate.pdf', size: '1.2 MB', category: 'Estimate', email: '', isPrimary: false },
    { id: '2', name: 'Vehicle_Photos.zip', size: '3.5 MB', category: 'Photos', email: '', isPrimary: false },
    { id: '3', name: 'Insurance_Approval.pdf', size: '0.8 MB', category: 'Insurance', email: '', isPrimary: false }
  ]

  // Function to handle attachment selection
  const handleAttachmentToggle = (attachmentId: string) => {
    console.log(`Toggled attachment ${attachmentId}`)
  }

  return (
    <div className="overflow-y-auto">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex flex-row gap-2 items-center mb-2">
            <h2 className="text-xl font-bold">
              {opportunity.vehicle?.exteriorColor || ''} {opportunity.vehicle?.make || ''} {opportunity.vehicle?.year || ''}
            </h2>
            <h2 className="ml-6 text-xl">
              {opportunity.roNumber ? ` RO #${opportunity.roNumber}` : `   ${opportunity.id}`}
            </h2>
            {/* <div className="flex flex-wrap gap-2 items-center mb-2 ml-6">
              {opportunity.priority === 'High' && (
                <span className="px-2 py-1 text-xs text-white bg-red-500 rounded">
                  HIGH PRIORITY
                </span>
              )}
              <span className="px-2 py-1 text-xs text-white bg-green-500 rounded">OPEN OPPORTUNITY</span>
              {opportunity.inRental && (
                <span className="px-2 py-1 text-xs text-white bg-blue-500 rounded">IN RENTAL</span>
              )}
              {opportunity.insurance?.name && (
                <span className="px-2 py-1 text-xs text-white bg-purple-500 rounded">{opportunity.insurance.name.toUpperCase()}</span>
              )}
              {opportunity.insurance?.approved && (
                <span className="px-2 py-1 text-xs text-white bg-gray-500 rounded">APPROVED BY INSURANCE</span>
              )}
            </div> */}

          </div>

          {/* Photo Section */}


        </div>
        <div className="flex gap-2">
          {CallSatus === 'calling' && <CallDurationBadge />}
          <Button variant="outline" size="sm">
            <Mail className="mr-1 w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-1 w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-1 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-0 p-0">
        {/* First Column - Photo, Estimate, Tech, Estimator, and Logs */}
        <div className="p-0 space-y-0 border-r border-gray-300">
          <div className="border-b border-gray-300">
            <div className="space-y-2">
              {/* Vehicle Info */}
              <div className="flex gap-4 mt-2 rounded-lg">
                {/* {opportunity.vehicle?.photos && opportunity.vehicle.photos.length > 0 ? (
                  <img
                    src={opportunity.vehicle.photos[0].url}
                    alt={`${opportunity.vehicle?.year || ''} ${opportunity.vehicle?.make || ''} ${opportunity.vehicle?.model || ''}`}
                    className="object-cover w-48 h-48"
                  />
                ) : (
                  <div className="flex justify-center items-center w-48 h-32 bg-gray-100 rounded-lg">
                    <span className="text-gray-400">No photo available</span>
                  </div>
                )} */}
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="font-semibold">Estimate: </span>
                    {/* <span>{opportunity.estimateAmount ? `$ ${formatCurrency(opportunity.estimateAmount)}` : 'No Estimate Amount'}</span> */}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Tech: </span>
                    {/* <span>{opportunity.assignedTech?.name || 'Unassigned'}</span> */}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Est: </span>
                    <span>{opportunity.estimator?.name || 'Unassigned'}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    {opportunity.vehicle?.damageDescription || ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="mt-2">
            <div className="p-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Logs</h3>
                {isLoadingLogs && (
                  <div className="w-4 h-4 rounded-full border-b-2 border-gray-400 animate-spin"></div>
                )}
              </div>
              <div className="space-y-2">
                {isLoadingLogs ? (
                  <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="text-sm text-left text-gray-800">
                      <tr>
                        <th className="pb-2 text-sm">TYPE</th>
                        <th className="pb-2">DATE</th>
                        <th className="pb-2">USER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeLogs.map((log, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-2">{log.type}</td>
                          <td className="py-2">
                            {new Date(log.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-2">
                            {typeof log.user === 'object' && log.user !== null
                              ? log.user.name
                              : log.user || 'Unknown'}
                          </td>
                        </tr>
                      ))}
                      {safeLogs.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-2 text-center text-gray-500"
                          >
                            No logs available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Second Column - Owner, Adjuster, Attachments, Last Communication */}
        <div className="p-0 space-y-0 border-r border-gray-300">
          <div>
            <div className="p-0 px-2">
              <div className="mb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4 items-center">
                    <h3 className="font-semibold">
                      {getOwnerProp(opportunity.vehicle?.owner.firstName, 'name', 'Unknown')},
                      Vehicle Owner
                    </h3>
                    <ContactInfo
                      preferredContactMethod={ContactMethod.phone}
                      contactData={{
                        person: {
                          name: opportunity.vehicle?.owner ? `${opportunity.vehicle.owner.firstName} ${opportunity.vehicle.owner.lastName}` : '',
                          role: 'Vehicle Owner',
                          address: '',
                          company: getOwnerProp(
                            opportunity.vehicle?.owner.company,
                            'company',
                            ''
                          ),
                          preferredContactType: 'phone',
                        },
                        insurance: {
                          company: opportunity.insurance?.name || '',
                          representative: opportunity.insurance?.adjuster || '',
                          pendingEstimates: 0,
                          pendingReimbursements: 0,
                          updates: '',
                        },
                        communicationLogs: [],
                        emailContacts: [
                          {
                            email: getOwnerProp(opportunity.vehicle?.owner, 'email', ''),
                            isPrimary: true,
                          },
                        ],
                        attachmentOptions: [],
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {getOwnerProp(opportunity.vehicle?.owner, 'phone', '')}
                    {getOwnerProp(opportunity.vehicle?.owner, 'secondaryPhone', '') &&
                      ` / ${getOwnerProp(opportunity.vehicle?.owner, 'secondaryPhone', '')}`}
                    <br />
                    {getOwnerProp(opportunity.vehicle?.owner, 'email', '')}
                    {getOwnerProp(opportunity.vehicle?.owner, 'company', '') && (
                      <>
                        <br />
                        Company:{' '}
                        {getOwnerProp(opportunity.vehicle?.owner, 'company', '')}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Adjuster</h3>
                <p className="text-sm text-gray-600">
                  {opportunity.insurance?.adjuster || ''}
                  {opportunity.insurance?.adjusterPhone && (
                    <>
                      <br />
                      Phone: {opportunity.insurance?.adjusterPhone}
                    </>
                  )}
                  {opportunity.insurance?.adjusterEmail && (
                    <>
                      <br />
                      Email: {opportunity.insurance?.adjusterEmail}
                    </>
                  )}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Attachments</h3>
                {/* <div className="flex gap-2">
                  {opportunity.attachments?.map((attachment) => (
                    <Button key={attachment.id} variant="outline" size="sm">
                      {attachment.type}
                    </Button>
                  ))}
                  {(!opportunity.attachments || opportunity.attachments.length === 0) && (
                    <span className="text-sm text-gray-500">No attachments available</span>
                  )}
                </div> */}
              </div>

              <div>
                <div className="flex justify-between items-center mt-8 mb-2">
                  <h3 className="font-semibold">Last Communication Summary</h3>
                  <span className="text-sm text-gray-500">
                    Last updated {opportunity.updatedAt ? 'on ' + formatDate(opportunity.updatedAt) : '---'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  {opportunity.summary ? (
                    <p>{opportunity.summary}</p>
                  ) : (
                    <p className="text-gray-500">No recent communications</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Column - QC Checklist, Parts, Repair Plan */}
        <div className="p-0 space-y-0 border-r border-gray-300">
          <div>
            <div className="p-0 px-2">
              <h3 className="mb-2 font-semibold">QC Checklist</h3>
              {/* <div className="space-y-2">
                {qcItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div
                      className={`w-4 h-4 border rounded-sm flex items-center justify-center ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                    >
                      {item.checked && (
                        <span className="text-xs text-white">✓</span>
                      )}
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          <div>
            <div className="p-0 px-2">
              <h3 className="mt-8 mb-2 font-semibold">Parts</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>ON EST.</span>
                  <div className="flex gap-2">
                    <span>{opportunity.partsOrders?.length || 0}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>CORES</span>
                  <div className="flex gap-2">
                    <span className="text-red-500">
                      {/* {opportunity.parts?.cores || 0} */}
                    </span>
                    <span className="text-red-500">
                      {/* ${formatCurrency(opportunity.parts?.coresAmount || 0)} */}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>TOTAL RETURNS</span>
                  <div className="flex gap-2">
                    {/* <span>{opportunity.parts?.returns || 0}</span> */}
                    <span>
                      {/* ${formatCurrency(opportunity.parts?.returnsAmount || 0)} */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="p-0 px-2">
              <h3 className="mt-8 mb-2 font-semibold">Repair Plan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>REPAIRS STARTED</span>
                  <span>{formatDate(opportunity.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>REPAIRS IN PROGRESS</span>
                  <span>{formatDate(opportunity.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>REPAIRS COMPLETED</span>
                  <span>{formatDate(undefined)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VEHICLE OUT</span>
                  <span>{formatDate(undefined)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpportunityModal
