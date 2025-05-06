'use client'

import { useGetTenantList } from '@/app/api/hooks/useTenant'
import { TenantListItem } from '@/app/types/tenant'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  FriendlyDateCell,
  StatusBadgeCell,
  UserAvatarCell,
} from '@/components/custom-components/custom-table/table-cells'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { C } from 'vitest/dist/chunks/reporters.d.CqBhtcTq.js'
import { CustomDialog } from '../../components/custom-dialog'
import { set } from 'date-fns'
import { CustomDialogTitle } from '../../components/custom-dialo-title'
import { CustomCheckbox } from '@/components/custom-components/checkbox/custom-checkbox'
import { CustomSelect } from '@/components/custom-components/selects/custom-select'
import { CustomInput } from '@/components/custom-components/inputs/custom-input'
import { CustomDialogFooter } from '../../components/custom-dailog-footer'

// Default revenue value for tenants (since it's not in the API response)
const DEFAULT_REVENUE = 0

// Fallback data for when the API returns an error

type Props = {
  tenants: TenantListItem[]
}

export default function TenantDashboard({ tenants }: Props) {
  const [tenantsList, setTenantsList] = useState<TenantListItem[]>(tenants)
  const [selectedTenant, setSelectedTenant] = useState<TenantListItem | null>(
    null
  )
  const [openDialog, setOpenDialog] = useState(false)
  const [discount, setDiscount] = useState<string>('')

  const params = useParams()
  const locale = params?.locale || 'en'
  const router = useRouter()

  const handleRowClick = (tenant: TenantListItem) => {
    setOpenDialog(true)
    setSelectedTenant(tenant)
  }
  useEffect(() => {
    if (selectedTenant) {
      setDiscount(selectedTenant.discount?.toString() || '')
    } else {
      setDiscount('')
    }
  }, [selectedTenant])

  const columns: ColumnDef<TenantListItem>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        // Safely access name with null check
        const name = row.original.name || 'Unknown'
        return (
          <div className="flex gap-3 items-center">
            <Avatar className="h-[22px] w-[22px]">
              {row.original.logoUrl ? (
                <AvatarImage src={row.original.logoUrl} alt={name} />
              ) : null}
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-base font-semibold leading-none">{name}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{row.original.email}</div>
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{row.original.phone}</div>
      },
    },
    {
      accessorKey: 'locationCount',
      header: 'Locations',
      cell: ({ row }) => {
        return (
          <div className="font-medium text-center">
            {row.original.locationCount}
          </div>
        )
      },
    },
    {
      accessorKey: 'fees',
      header: 'Fees',
      cell: ({ row }) => {
        // Placeholder value since fees aren't in the API response
        return <div className="font-medium">$299.99</div>
      },
    },
    {
      accessorKey: 'lastPaymentDate',
      header: 'Last Payment',
      cell: ({ row }) => {
        // Convert null to undefined for the FriendlyDateCell component
        const date = row.original.lastPaymentDate || undefined
        return <FriendlyDateCell date={date} />
      },
    },
    {
      accessorKey: 'revenue',
      header: 'Revenue',
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            ${(row.original.revenue || DEFAULT_REVENUE).toLocaleString()}
          </div>
        )
      },
    },
    {
      accessorKey: 'onboardedByName',
      header: 'Onboarded By',
      cell: ({ row }) => {
        if (!row.original.onboardedByName) {
          return <div className="text-muted-foreground">-</div>
        }
        return (
          <UserAvatarCell
            name={row.original.onboardedByName}
            avatarUrl={`https://i.pravatar.cc/150?u=${row.original.onboardedById}`}
          />
        )
      },
    },
    {
      accessorKey: 'trialPeriod',
      header: 'Trial Period',
      cell: ({ row }) => {
        return row.original.trialPeriod ? (
          <StatusBadgeCell status="Trial User" variant="warning" />
        ) : (
          <div className="text-muted-foreground">No</div>
        )
      },
    },
    {
      accessorKey: 'discount',
      header: 'Discount',
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {row.original.discount > 0 ? `${row.original.discount}%` : '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'promoCode',
      header: 'Promo Code',
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground">
            {row.original.promoCode || '-'}
          </div>
        )
      },
    },
  ]

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    const numericRegex = /^\d*$/
    if (newValue === '' || numericRegex.test(newValue)) {
      setDiscount(newValue)
    }
  }
  const handleCancel = () => {}
  const handleSave = () => {}

  return (
    <div className="w-full">
      <div className="flex justify-between items-center p-5">
        <h1 className="text-3xl font-semibold">Tenants</h1>
        <button
          className="flex justify-center items-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-black hover:border-black group"
          onClick={() =>
            router.push(`/${locale}/super-admin/dashboard/tenants/register`)
          }
        >
          <Plus size={18} className="group-hover:text-white" />
        </button>
      </div>

      <DataTable<TenantListItem, any>
        columns={columns}
        data={tenantsList}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        onRowClick={handleRowClick}
      />
      <CustomDialog isOpen={openDialog} onOpenChange={setOpenDialog}>
        <CustomDialogTitle
          icon={selectedTenant?.logoUrl}
          subtitle={
            <div className="flex  gap-8 mt-2 text-black">
              <span className="text-[18px]">{selectedTenant?.email}</span>
              <span className="text-[18px]">{selectedTenant?.phone}</span>
            </div>
          }
        >
          {selectedTenant?.name}
        </CustomDialogTitle>
        <div className=" flex gap-8 mb-4">
          <p className="text-[15px]">
            FEES:<span className="text-[18px] font-semibold">$x</span>
          </p>
          <p className="text-[15px]">
            LAST PAYMENT:
            <span className="text-[18px] font-semibold">Aug 28,2024</span>{' '}
          </p>
          <p className="text-[15px]">
            REVENUE:
            <span className="text-[18px] font-semibold">
              {selectedTenant?.revenue}
            </span>
          </p>
        </div>
        <div className="mb-4">
          <CustomCheckbox variant="default" checked={true} label="Trial User" />
        </div>
        <div className="mb-4">
          <CustomSelect
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ]}
            placeholder="Select Promocode"
          />
        </div>
        <div className="mb-10">
          <CustomInput
            label="Discount"
            value={discount}
            onChange={handleDiscountChange}
          />
        </div>
        <CustomDialogFooter
          onCancel={handleCancel}
          onSave={handleSave}
          cancelText="Cancel"
          saveText="Save"
        />
      </CustomDialog>
    </div>
  )
}
