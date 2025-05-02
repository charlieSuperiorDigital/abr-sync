'use client'

import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export interface NavItem {
  id: string
  label: string
  count: number
}

interface DraggableNavProps {
  navItems?: NavItem[]
  defaultTab?: string
  onReorder?: (items: NavItem[]) => void
  onTabChange?: (tabId: string) => void // Add this callback
}

export default function DraggableNav({
  navItems,
  defaultTab,
  onReorder,
  onTabChange, // Add this prop
}: DraggableNavProps) {
  const [items, setItems] = useState<NavItem[]>([])
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Memoize this function to prevent unnecessary re-renders
  const updateUrlWithoutReload = useCallback(
    (tabId: string) => {
      // Use window.history.pushState to update URL without triggering navigation
      const params = new URLSearchParams(searchParams?.toString())
      const tabValue = tabId === '2nd-call' ? 'second-call' : tabId
      params.set('tab', tabValue)

      // Update URL without causing a navigation/reload
      window.history.pushState(null, '', `${pathname}?${params.toString()}`)
    },
    [pathname, searchParams]
  )

  useEffect(() => {
    if (navItems) {
      // Preserve the current order when updating counts
      if (items.length > 0) {
        const updatedItems = items.map((item) => {
          const updatedItem = navItems.find((navItem) => navItem.id === item.id)
          return updatedItem ? { ...item, count: updatedItem.count } : item
        })
        setItems(updatedItems)
      } else {
        setItems(navItems)
      }
    }
  }, [navItems])

  // This effect only runs once on initial load or when items change
  useEffect(() => {
    // Get active tab from search parameters
    const tabFromParams = searchParams?.get('tab')

    if (tabFromParams && items.some((item) => item.id === tabFromParams)) {
      setActiveTab(tabFromParams)
      // Notify parent component about the active tab
      onTabChange?.(tabFromParams)
    } else if (defaultTab && items.some((item) => item.id === defaultTab)) {
      setActiveTab(defaultTab)
      updateUrlWithoutReload(defaultTab)
      onTabChange?.(defaultTab)
    } else if (items.length > 0) {
      // Fallback to first item if no tab is selected
      setActiveTab(items[0].id)
      updateUrlWithoutReload(items[0].id)
      onTabChange?.(items[0].id)
    }
  }, [items, defaultTab, searchParams, updateUrlWithoutReload, onTabChange])

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
    // Save order to cookie for local persistence
    document.cookie = `navOrder=${encodeURIComponent(JSON.stringify(items))}; max-age=${60 * 60 * 24 * 365}; path=/`
    // Notify parent component of the new order
    onReorder?.(items)
  }

  const handleClick = (id: string) => {
    if (activeTab === id) return // Don't do anything if clicking the same tab

    setActiveTab(id)
    updateUrlWithoutReload(id)

    // Notify parent component about the tab change
    onTabChange?.(id)
  }

  return (
    <nav className="w-full border-b border-gray-200">
      <div className="flex overflow-x-auto items-center space-x-1">
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
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
