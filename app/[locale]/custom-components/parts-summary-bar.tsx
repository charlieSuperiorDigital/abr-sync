'use client'
import React, { useState } from 'react'
import { useGetAllPartsFromTenant } from '@/app/api/hooks/useParts';
import { useSession } from 'next-auth/react';



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

// Small loading spinner for inline use
const InlineLoader = () => (
  <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const PartsSummaryBar = () => {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  const { partsCount, isLoading, debugLog } = useGetAllPartsFromTenant(tenantId!);

  return (
    <div className='px-8 w-full'>
      <div className="flex justify-around items-center px-6 py-1 my-8 w-full text-white bg-black rounded-3xl">
        <div className="flex gap-2 justify-center items-center">
          <SimpleTooltip text="Draft invoices pending approval">
            <span className="text-sm cursor-pointer" onClick={debugLog}>DRAFT INV.</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">
            {isLoading ? <InlineLoader /> : `XY`}
          </span>
          {/* {props.draftInvoicesWarning && <WarningBubble />} */}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Parts currently on backorder status">
            <span className="text-sm">BACKORDER</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">
            {isLoading ? <InlineLoader /> : partsCount.backorder}
          </span>
          {/* {props.backordersWarning && <WarningBubble />} */}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Parts awaiting vendor response or shipment">
            <span className="text-sm">PENDING</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">
            {isLoading ? <InlineLoader /> : partsCount.pending}
          </span>
          {/* {props.pendingWarning && <WarningBubble />} */}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Recent modifications to parts orders">
            <span className="text-sm">CHANGES</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">
            {isLoading ? <InlineLoader /> : `XY`}
          </span>
          {/* {props.changesWarning && <WarningBubble />} */}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Parts that missed their expected delivery date">
            <span className="text-sm">MISSED</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">
            {isLoading ? <InlineLoader /> : partsCount.missed}
          </span>
          {/* {props.missedWarning && <WarningBubble />} */}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex relative gap-2 items-center">
          <SimpleTooltip text="Parts expected to arrive today">
            <span className="text-sm">IN TODAY</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">
            {isLoading ? <InlineLoader /> : partsCount.inToday}
          </span>
          {/* {props.inTodayWarning && <WarningBubble />} */}
        </div>
        <div className="w-px h-4 bg-white"></div>

        <div className="flex gap-2 items-center">
          <SimpleTooltip text="Parts marked for return to vendor">
            <span className="text-sm">RETURNS</span>
          </SimpleTooltip>
          <span className="text-sm font-semibold">
            {isLoading ? <InlineLoader /> : partsCount.returns}
          </span>
          {/* {props.returnsWarning && <WarningBubble />} */}
        </div>
      </div>
    </div>
  )
}

export default PartsSummaryBar