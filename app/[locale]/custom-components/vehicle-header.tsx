import { Phone, Printer, X, MessageSquare } from 'lucide-react'
import { StatusBadgeCell } from '@/components/custom-components/custom-table/table-cells'
import CallDurationBadge from './calls/call-maker'
import { useCall } from '@/app/context/call-context'

type Props = {
  carModel: string
  roNumber: string
  priority: string
  status: string
  rentalStatus: string
  insuranceCompany: string
  insuranceStatus: string
}

export default function VehicleHeader({
  carModel,
  roNumber,
  priority,
  status,
  rentalStatus,
  insuranceCompany,
  insuranceStatus,
}: Props) {
  const { status: CallSatus } = useCall()
  return (
    <header className="w-full py-2 px-4">
      <div className="flex items-center justify-between gap-2 overflow-x-auto whitespace-nowrap">
        <div className="flex-shrink-0 flex items-center gap-2">
          <h1 className="text-lg font-bold md:text-xl">{carModel}</h1>
          <span className="text-gray-700 font-medium">{roNumber}</span>
          <StatusBadgeCell status={priority} variant="forest" />
          <StatusBadgeCell status={status} variant="forest" />
          <StatusBadgeCell status={rentalStatus} variant="forest" />
          <StatusBadgeCell status={insuranceCompany} variant="forest" />
          <StatusBadgeCell status={insuranceStatus} variant="forest" />
        </div>
        <div className="flex-shrink-0 flex items-center gap-3">
          {CallSatus === 'calling' && <CallDurationBadge />}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <Printer className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </header>
  )
}
