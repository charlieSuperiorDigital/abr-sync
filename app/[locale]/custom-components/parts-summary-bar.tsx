'use client'
import React, { useState } from 'react'

interface PartsSummaryBarProps {
  draftInvoices: number
  backorders: number
  pending: number
  changes: number
  missed: number
  inToday: number
  returns: number
  draftInvoicesWarning?: boolean
  backordersWarning?: boolean
  pendingWarning?: boolean
  changesWarning?: boolean
  missedWarning?: boolean
  inTodayWarning?: boolean
  returnsWarning?: boolean
}

const SimpleTooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 px-2 py-1 mb-2 text-sm text-gray-900 whitespace-nowrap bg-white rounded-xl -translate-x-1/2">
          {text}
        </div>
      )}
    </div>
  );
};

const WarningBubble = () => (
  <span className="flex right-0 bottom-0 flex-col justify-center items-center ml-2 w-5 h-5 text-sm bg-red-600 rounded-full text-align-middle">
    !
  </span>
);

const PartsSummaryBar = ({
  draftInvoices = 0,
  backorders = 0,
  pending = 0,
  changes = 0,
  missed = 0,
  inToday = 0,
  returns = 0,
  draftInvoicesWarning = false,
  backordersWarning = false,
  pendingWarning = false,
  changesWarning = false,
  missedWarning = false,
  inTodayWarning = false,
  returnsWarning = false,
}: PartsSummaryBarProps) => {
  return (
    <div className='px-8 w-full'>
      <div className="flex justify-around items-center px-6 py-1 my-8 w-full text-white bg-black rounded-3xl">
        <div className="flex gap-2 justify-center items-center">
          <SimpleTooltip text="Draft invoices pending approval">
            <span className="text-sm">DRAFT INV.</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">{draftInvoices}</span>
          {draftInvoicesWarning && <WarningBubble />}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Parts currently on backorder status">
            <span className="text-sm">BACKORDER</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">{backorders}</span>
          {backordersWarning && <WarningBubble />}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Parts awaiting vendor response or shipment">
            <span className="text-sm">PENDING</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">{pending}</span>
          {pendingWarning && <WarningBubble />}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Recent modifications to parts orders">
            <span className="text-sm">CHANGES</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">{changes}</span>
          {changesWarning && <WarningBubble />}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Parts that missed their expected delivery date">
            <span className="text-sm">MISSED</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">{missed}</span>
          {missedWarning && <WarningBubble />}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex relative gap-2 items-center">
          <SimpleTooltip text="Parts expected to arrive today">
            <span className="text-sm">IN TODAY</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">{inToday}</span>
          {inTodayWarning && <WarningBubble />}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Parts marked for return to vendor">
            <span className="text-sm">RETURNS</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">{returns}</span>
          {returnsWarning && <WarningBubble />}
        </div>
      </div>
    </div>
  )
}

export default PartsSummaryBar