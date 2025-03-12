import DraggableNav, {
  NavItem,
} from '@/components/custom-components/draggable-nav/draggable-nav'
import type React from 'react'

export default function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <DraggableNav />
      <main className=" w-full">{children}</main>
    </div>
  )
}
