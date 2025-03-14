import { Opportunity } from '@/app/types/opportunity'
import { Button } from '@/components/ui/button'
import { Printer, Mail, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface OpportunityModalProps {
  opportunity: Opportunity
}

const OpportunityModal = ({ opportunity }: OpportunityModalProps) => {
  const qcItems: { label: string; checked: boolean }[] = [
    { label: 'SIGNATURE', checked: opportunity.status === 'Estimate' },
    { label: 'PRE-SCAN', checked: opportunity.preScanCompleted || false },
    { label: 'POST-SCAN', checked: opportunity.postScanCompleted || false },
    { label: 'SUBLETS', checked: opportunity.subletsCompleted || false },
    { label: 'FINAL QC', checked: opportunity.qcCompleted || false }
  ]

  // Format date helper
  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Format time helper
  const formatTime = (date: string | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className='flex flex-row items-center gap-2 mb-2'>
            <h2 className="text-xl font-bold">
              {opportunity.vehicle.exteriorColor} {opportunity.vehicle.make} {opportunity.vehicle.year}

            </h2>
            <h2 className=" ml-6 text-xl font-bold">
              {opportunity.roNumber ? ` RO #${opportunity.roNumber}` : `   ${opportunity.opportunityId}`}

            </h2>
            <div className="flex items-center gap-2 mb-2 flex-wrap ml-6">
              {opportunity.priority === 'High' && (
                <span className="bg-red-500 text-white px-2 py-1 text-xs rounded">HIGH PRIORITY</span>
              )}
              <span className="bg-green-500 text-white px-2 py-1 text-xs rounded">OPEN OPPORTUNITY</span>
              {opportunity.isInRental && (
                <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">IN RENTAL</span>
              )}
              {opportunity.insurance.company && (
                <span className="bg-purple-500 text-white px-2 py-1 text-xs rounded">{opportunity.insurance.company.toUpperCase()}</span>
              )}
              {opportunity.insurance.approved && (
                <span className="bg-gray-500 text-white px-2 py-1 text-xs rounded">APPROVED BY INSURANCE</span>
              )}
            </div>

          </div>

          <div className="mt-2 flex gap-4 border border-gray-700 p-4 rounded-lg">
            {opportunity.vehicle.photos && opportunity.vehicle.photos.length > 0 ? (
              <img
                src={opportunity.vehicle.photos[0].url}
                alt={`${opportunity.vehicle.year} ${opportunity.vehicle.make} ${opportunity.vehicle.model}`}
                className="w-48 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No photo available</span>
              </div>
            )}
            <div className="flex-1">
              <div className="mb-2">
                <span className="font-semibold">Estimate: </span>
                <span>${opportunity.estimateAmount ? formatCurrency(opportunity.estimateAmount) : '---'}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Tech: </span>
                <span>{opportunity.assignedTech?.name || 'Unassigned'}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Est: </span>
                <span>{opportunity.estimator?.estimatorName || 'Unassigned'}</span>
              </div>
              <p className="text-gray-700 text-sm mt-2">
                {opportunity.vehicle.damageDescription}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-1" />
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-1" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Owner & Insurance */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {opportunity.owner.name}, Vehicle Owner
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {opportunity.owner.phone}
                  {opportunity.owner.secondaryPhone && ` / ${opportunity.owner.secondaryPhone}`}
                  <br />
                  {opportunity.owner.email}<br />
                  {opportunity.owner.address}
                  {opportunity.owner.city && `, ${opportunity.owner.city}`}
                  {opportunity.owner.state && `, ${opportunity.owner.state}`}
                  {opportunity.owner.zip && ` ${opportunity.owner.zip}`}
                  {opportunity.owner.company && <><br />Company: {opportunity.owner.company}</>}
                </p>

                <h3 className="font-semibold mb-2">
                  Insurance Details
                </h3>
                <p className="text-sm text-gray-600">
                  {opportunity.insurance.company}<br />
                  Rep: {opportunity.insurance.representative}<br />
                  {opportunity.insurance.adjuster && <>Adjuster: {opportunity.insurance.adjuster}<br /></>}
                  {opportunity.insurance.adjusterPhone && <>Phone: {opportunity.insurance.adjusterPhone}<br /></>}
                  {opportunity.insurance.adjusterEmail && <>Email: {opportunity.insurance.adjusterEmail}</>}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Attachments</h3>
                <div className="flex gap-2">
                  {opportunity.attachments?.map((attachment) => (
                    <Button key={attachment.id} variant="outline" size="sm">{attachment.type}</Button>
                  )) || (
                    <>
                      <Button variant="outline" size="sm">Estimate</Button>
                      <Button variant="outline" size="sm">Greet Drop-Off</Button>
                      <Button variant="outline" size="sm">Damage On Estimate</Button>
                      <Button variant="outline" size="sm">Supplement</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Logs</h3>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="pb-2">TYPE</th>
                    <th className="pb-2">DATE</th>
                    <th className="pb-2">USER</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunity.logs?.slice(0, 3).map((log, index) => (
                    <tr key={index}>
                      <td className="py-2">{log.type}</td>
                      <td className="py-2">{formatDate(log.date)} {formatTime(log.date)}</td>
                      <td className="py-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                        {log.user}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={3} className="py-2 text-center text-gray-500">No logs available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Last Communication */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Last Communication Summary</h3>
              <span className="text-sm text-gray-500">
                Last updated {opportunity.lastUpdatedDate ? 'on ' + formatDate(opportunity.lastUpdatedDate) : '---'}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              {opportunity.lastCommunicationSummary ? (
                <p>{opportunity.lastCommunicationSummary}</p>
              ) : (
                <p className="text-gray-500">No recent communications</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* QC Checklist */}
          <div>
            <h3 className="font-semibold mb-2">QC Checklist</h3>
            <div className="space-y-2">
              {qcItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {item.checked && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parts */}
          <div>
            <h3 className="font-semibold mb-2">Parts</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>ON EST.</span>
                <div className="flex gap-2">
                  <span>{opportunity.parts?.total || 0}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>CORES</span>
                <div className="flex gap-2">
                  <span className="text-red-500">{opportunity.parts?.cores || 0}</span>
                  <span className="text-red-500">${formatCurrency(opportunity.parts?.coresAmount || 0)}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>TOTAL RETURNS</span>
                <div className="flex gap-2">
                  <span>{opportunity.parts?.returns || 0}</span>
                  <span>${formatCurrency(opportunity.parts?.returnsAmount || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Repair Plan */}
          <div>
            <h3 className="font-semibold mb-2">Repair Plan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>REPAIRS STARTED</span>
                <span>{formatDate(opportunity.repairStartDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>REPAIRS IN PROGRESS</span>
                <span>{formatDate(opportunity.repairInProgressDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>REPAIRS COMPLETED</span>
                <span>{formatDate(opportunity.repairCompletedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>VEHICLE OUT</span>
                <span>{formatDate(opportunity.vehicleOutDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpportunityModal
