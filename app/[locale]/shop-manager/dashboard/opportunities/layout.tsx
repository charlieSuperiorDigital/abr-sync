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
  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: 'new-opportunities', label: 'New Opportunities', count: opportunitiesQuantity.new },
    { id: 'second-call', label: 'Second Call', count: opportunitiesQuantity.secondCall },
    { id: 'estimate', label: 'Estimate', count: opportunitiesQuantity.estimate },
    { id: 'total-loss', label: 'Total Loss', count: opportunitiesQuantity.totalLoss },
    { id: 'archive', label: 'Archive', count: opportunitiesQuantity.archived },
  ])


  return (
    <div className="flex flex-col w-full min-h-screen">
      <h1 className="px-5 my-7 text-3xl font-semibold tracking-tight">Opportunities</h1>
      {isLoading ? (
        <div className="flex justify-center p-8">Loading opportunities...</div>
      ) : (
        <>
          <DraggableNav navItems={navItems} />
          <main className="w-full">{children}</main>
        </>
      )}
    </div>
  )
}
