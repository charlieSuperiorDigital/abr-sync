'use client'

import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import { useOpportunityStore } from '@/app/stores/opportunity-store'
import { OpportunityStatus } from '@/app/types/opportunity'
import { useEffect, useState } from 'react'

// Calculate initial counts based on workflow stages
const getStatusCounts = (getOpportunitiesByStatus: (status: OpportunityStatus) => any[]) => {
  return {
    [OpportunityStatus.New]: getOpportunitiesByStatus(OpportunityStatus.New).length,
    [OpportunityStatus.SecondCall]: getOpportunitiesByStatus(OpportunityStatus.SecondCall).length,
    [OpportunityStatus.Estimate]: getOpportunitiesByStatus(OpportunityStatus.Estimate).length,
    [OpportunityStatus.TotalLoss]: getOpportunitiesByStatus(OpportunityStatus.TotalLoss).length,
    [OpportunityStatus.Archived]: getOpportunitiesByStatus(OpportunityStatus.Archived).length,
  }
}

export default function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getOpportunitiesByStatus, opportunities } = useOpportunityStore()
  
  // Initialize with actual counts instead of zeros
  const initialCounts = getStatusCounts(getOpportunitiesByStatus)
  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: 'new-opportunities', label: 'New Opportunities', count: initialCounts[OpportunityStatus.New] },
    { id: 'second-call', label: 'Second Call', count: initialCounts[OpportunityStatus.SecondCall] },
    { id: 'estimate', label: 'Estimate', count: initialCounts[OpportunityStatus.Estimate] },
    { id: 'total-loss', label: 'Total Loss', count: initialCounts[OpportunityStatus.TotalLoss] },
    { id: 'archive', label: 'Archive', count: initialCounts[OpportunityStatus.Archived] },
  ])

  useEffect(() => {
    const counts = getStatusCounts(getOpportunitiesByStatus)
    
    // Order matches our workflow: New → 2nd Call → Estimate → Total Loss → Archive
    const items: NavItem[] = [
      { id: 'new-opportunities', label: 'New Opportunities', count: counts[OpportunityStatus.New] },
      { id: 'second-call', label: 'Second Call', count: counts[OpportunityStatus.SecondCall] },
      { id: 'estimate', label: 'Estimate', count: counts[OpportunityStatus.Estimate] },
      { id: 'total-loss', label: 'Total Loss', count: counts[OpportunityStatus.TotalLoss] },
      { id: 'archive', label: 'Archive', count: counts[OpportunityStatus.Archived] },
    ]
    setNavItems(items)
  }, [getOpportunitiesByStatus, opportunities]) // Re-run when opportunities change

  return (
    <div className="flex flex-col w-full min-h-screen">
      <h1 className="text-3xl font-semibold tracking-tight px-5 my-7">Opportunities</h1>
      <DraggableNav navItems={navItems} />
      <main className="w-full">{children}</main>
    </div>
  )
}
