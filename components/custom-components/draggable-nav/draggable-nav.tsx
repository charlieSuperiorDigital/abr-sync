'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export interface NavItem {
  id: string
  label: string
  count: number
}

interface DraggableNavProps {
  navItems?: NavItem[]
  defaultTab?: string
}

export default function DraggableNav({ navItems, defaultTab }: DraggableNavProps) {
  const [items, setItems] = useState<NavItem[]>([])
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (navItems) {
      // Preserve the current order when updating counts
      if (items.length > 0) {
        const updatedItems = items.map(item => {
          const updatedItem = navItems.find(navItem => navItem.id === item.id);
          return updatedItem ? { ...item, count: updatedItem.count } : item;
        });
        setItems(updatedItems);
      } else {
        setItems(navItems);
        // Use defaultTab if provided, otherwise use first item
        setActiveTab(defaultTab || navItems[0].id);
      }
    }
  }, [navItems, defaultTab])

  useEffect(() => {
    const currentTab = pathname.split('/').pop()
    if (currentTab && items.some((item) => item.id === currentTab)) {
      setActiveTab(currentTab)
    } else if (defaultTab && items.some((item) => item.id === defaultTab)) {
      setActiveTab(defaultTab)
      router.push(defaultTab)
    }
  }, [pathname, items, defaultTab])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedItem === null) return

    const newItems = [...items]
    const draggedItemContent = newItems[draggedItem]
    newItems.splice(draggedItem, 1)
    newItems.splice(index, 0, draggedItemContent)

    setItems(newItems)
    setDraggedItem(index)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    document.cookie = `navOrder=${encodeURIComponent(JSON.stringify(items))}; max-age=${60 * 60 * 24 * 365}; path=/`
  }

  const handleClick = (id: string) => {

    const pageName = pathname.split('/')[4]
    
    if (id === '2nd-call') id = 'second-call'
    setActiveTab(id)
    router.push(`/en/shop-manager/dashboard/${pageName}/${id}`)
  }

  return (
    <nav className="w-full  border-b border-gray-200">
      <div className="flex items-center space-x-1 overflow-x-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center group cursor-move select-none
              ${draggedItem === index ? 'opacity-50' : ''}`}
          >
            <button
              onClick={() => handleClick(item.id)}
              className={`relative px-4 py-2 transition-colors focus:outline-none
                ${activeTab === item.id ? 'font-semibold' : ''}`}
            >
              <span className="whitespace-nowrap">
                {item.label} • {item.count}
              </span>
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></span>
              )}
            </button>
            {index < items.length - 1 && (
              <div className="w-1 h-1 rounded-full bg-gray-300" />
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
