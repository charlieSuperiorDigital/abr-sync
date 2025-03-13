import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import type React from 'react'

export default function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const defaultItems: NavItem[] = [
    { id: 'new-opportunities', label: 'New Opportunities', count: 72 },
    { id: 'estimate', label: 'Estimate', count: 30 },
    { id: 'second-call', label: 'Second Call', count: 2 },
    { id: 'total-loss', label: 'Total Loss', count: 3 },
    { id: 'archive', label: 'Archive', count: 6 },
  ]


  return (
    <div className="flex flex-col w-full min-h-screen">
      <h1 className="text-3xl font-semibold tracking-tight px-5 my-7">Opportunities</h1>
      <DraggableNav
        navItems={defaultItems}
      />
      <main className=" w-full">{children}</main>
    </div>
  )
}
