'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
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
  useQueryParams?: boolean
}

export default function DraggableNav({
  navItems,
  defaultTab,
  onReorder,
  useQueryParams = false,
}: DraggableNavProps) {
  const [items, setItems] = useState<NavItem[]>([])
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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
        // Use defaultTab if provided, otherwise use first item
        setActiveTab(defaultTab || navItems[0].id)
      }
    }
  }, [navItems, defaultTab])

  useEffect(() => {
    if (useQueryParams) {
      // Check for type in query params
      const typeParam = searchParams?.get('type')
      if (
        typeParam &&
        items.some(
          (item) =>
            item.id === typeParam ||
            (item.id === 'second-call' && typeParam === '2nd-call')
        )
      ) {
        setActiveTab(typeParam)
      } else if (defaultTab && items.some((item) => item.id === defaultTab)) {
        setActiveTab(defaultTab)
        // Create a new URL with the query parameter
        const params = new URLSearchParams(searchParams?.toString())
        params.set('type', defaultTab)
        router.push(`${pathname}?${params.toString()}`)
      }
    } else {
      // Original path-based logic
      const currentTab = pathname?.split('/').pop()
      if (currentTab && items.some((item) => item.id === currentTab)) {
        setActiveTab(currentTab)
      } else if (defaultTab && items.some((item) => item.id === defaultTab)) {
        setActiveTab(defaultTab)
        router.push(`${pathname}/${defaultTab}`)
      }
    }
  }, [pathname, searchParams, items, defaultTab, useQueryParams, router])

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
    let tabId = id
    if (id === '2nd-call') tabId = 'second-call'

    setActiveTab(tabId)

    if (useQueryParams) {
      const params = new URLSearchParams(searchParams?.toString())
      params.set('type', tabId)
      router.push(`${pathname}?${params.toString()}`)
    } else {
      const pageName = pathname?.split('/')[4]
      router.push(`/en/shop-manager/dashboard/${pageName}/${tabId}`)
    }
  }

  return (
    <nav className="px-5 w-full border-b border-gray-200">
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
