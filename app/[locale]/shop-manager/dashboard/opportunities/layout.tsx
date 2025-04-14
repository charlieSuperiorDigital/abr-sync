'use client'

import { useOpportunities } from '@/app/context/OpportunitiesProvider'
import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import { useState } from 'react'


export default function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { opportunitiesQuantity, isLoading } = useOpportunities();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <button onClick={() => console.log(opportunitiesQuantity)} className="fixed right-4 bottom-4 px-4 py-2 text-white bg-blue-500 rounded">DEBUG</button>
      <h1 className="px-5 my-7 text-3xl font-semibold tracking-tight">Opportunities</h1>
      {isLoading ? (
        <div className="flex justify-center p-8">Loading opportunities...</div>
      ) : (
        <>
          <DraggableNav navItems={[
            { id: 'new-opportunities', label: 'New Opportunities', count: opportunitiesQuantity.new },
            { id: 'second-call', label: 'Second Call', count: opportunitiesQuantity.secondCall },
            { id: 'estimate', label: 'Estimate', count: opportunitiesQuantity.estimate },
            { id: 'total-loss', label: 'Total Loss', count: opportunitiesQuantity.totalLoss },
            { id: 'archive', label: 'Archive', count: opportunitiesQuantity.archived },
          ]} />
          <main className="w-full">{children}</main>
        </>
      )}
    </div>
  )
}
