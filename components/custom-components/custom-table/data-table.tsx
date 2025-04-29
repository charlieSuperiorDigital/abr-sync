'use client'

import * as React from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { PaginationControls } from './pagination-controls'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  className?: string
  pageSize?: number
  pageSizeOptions?: number[]
  showPageSize?: boolean
  getSubRows?: (row: TData) => {
    id: string;
    details: React.ReactNode;
  }[]
  /**
   * Optional Tailwind or CSS class for table row height, e.g. 'h-20' for 80px.
   */
  rowHeightClass?: string
  /**
   * Controls visibility of PaginationControls. Default: true
   */
  showPaginationControls?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  className,
  pageSize: initialPageSize = 10,
  pageSizeOptions,
  showPageSize,
  getSubRows,
  rowHeightClass = '',
  showPaginationControls = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pageIndex, setPageIndex] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(initialPageSize)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  })

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'whitespace-nowrap text-black font-semibold',
                      header.column.getCanSort() && 'cursor-pointer select-none'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex gap-2 items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <div className="w-4">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      rowHeightClass,
                      onRowClick && 'cursor-pointer hover:bg-muted/50'
                    )}
                    onClick={(e) => {
                      // Check if the click was on a button or link
                      const target = e.target as HTMLElement
                      const isButton = target.tagName === 'BUTTON' || 
                        target.closest('button') || 
                        target.closest('a')
                      
                      if (!isButton) {
                        onRowClick?.(row.original)
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={rowHeightClass}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {getSubRows && getSubRows(row.original).map((subRow) => (
                    <TableRow key={subRow.id} className={cn('bg-gray-50', rowHeightClass)}>
                      <TableCell colSpan={columns.length} className={rowHeightClass}>
                        {subRow.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPaginationControls && (
        <PaginationControls
          pageCount={table.getPageCount()}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageSizeOptions={pageSizeOptions}
          showPageSize={showPageSize}
        />
      )}
    </div>
  )
}
