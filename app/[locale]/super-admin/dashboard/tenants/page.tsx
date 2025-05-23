'use client'

import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, UserCircle2 } from 'lucide-react'
import { FriendlyDateCell, StatusBadgeCell, UserAvatarCell } from '@/components/custom-components/custom-table/table-cells'
import { useGetTenantList } from '@/app/api/hooks/useGetTenantList'
import { TenantListItem } from '@/app/types/tenant'
import { CustomButton } from '@/components/custom-components/buttons/custom-button'

// Default revenue value for tenants (since it's not in the API response)
const DEFAULT_REVENUE = 0

// Fallback data for when the API returns an error
const fallbackTenants: TenantListItem[] = [
  {
    id: '1',
    name: 'Demo Tenant',
    email: 'demo@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    logoUrl: '',
    cccApiKey: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    onboardedById: null,
    onboardedByName: null,
    trialPeriod: true,
    discount: 10,
    promoCode: 'DEMO2025',
    locationCount: 1,
    lastPaymentDate: new Date().toISOString(),
    revenue: 5000
  }
]

export default function Tenants() {
  // Set whether to show only active tenants
  const onlyActives = true;

  const params = useParams();
  const locale = params?.locale || 'en';
  const router = useRouter();
  
  // Fetch tenant list data
  const { tenants, isLoading, isError } = useGetTenantList({
    onlyActives,
    enabled: true
  })
  
  // Only use fallback data if explicitly requested
  // For empty data from API, show empty table
  const displayTenants = isError ? fallbackTenants : (tenants || [])

  // Define the columns for the tenants table
  const columns: ColumnDef<TenantListItem>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        // Safely access name with null check
        const name = row.original.name || 'Unknown';
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-[22px] w-[22px]">
              {row.original.logoUrl ? (
                <AvatarImage src={row.original.logoUrl} alt={name} />
              ) : null}
              <AvatarFallback>
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-base font-semibold leading-none">{name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{row.original.email}</div>;
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{row.original.phone}</div>;
      },
    },
    {
      accessorKey: 'locationCount',
      header: 'Locations',
      cell: ({ row }) => {
        return <div className="text-center font-medium">{row.original.locationCount}</div>;
      },
    },
    {
      accessorKey: 'fees',
      header: 'Fees',
      cell: ({ row }) => {
        // Placeholder value since fees aren't in the API response
        return <div className="font-medium">$299.99</div>;
      },
    },
    {
      accessorKey: 'lastPaymentDate',
      header: 'Last Payment',
      cell: ({ row }) => {
        // Convert null to undefined for the FriendlyDateCell component
        const date = row.original.lastPaymentDate || undefined;
        return <FriendlyDateCell date={date} />;
      },
    },
    {
      accessorKey: 'revenue',
      header: 'Revenue',
      cell: ({ row }) => {
        return <div className="font-medium">${(row.original.revenue || DEFAULT_REVENUE).toLocaleString()}</div>;
      },
    },
    {
      accessorKey: 'onboardedByName',
      header: 'Onboarded By',
      cell: ({ row }) => {
        if (!row.original.onboardedByName) {
          return <div className="text-muted-foreground">-</div>;
        }
        return (
          <UserAvatarCell 
            name={row.original.onboardedByName} 
            avatarUrl={`https://i.pravatar.cc/150?u=${row.original.onboardedById}`} 
          />
        );
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
        );
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
        );
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
        );
      },
    },
  ]

  return (
    <div className="w-full">
        <div className='flex justify-between items-center p-5'>
          <h1 className="text-3xl font-semibold">Tenants</h1>
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center  transition-colors duration-200 hover:bg-black hover:border-black group" 
            onClick={() => router.push(`/${locale}/super-admin/dashboard/tenants/register`)}
          >
            <Plus size={18} className="group-hover:text-white" />
          </button>
        </div>
      {isLoading ? (
        <div className="text-center p-10 text-muted-foreground">Loading tenants...</div>
      ) : (
        <>
          {isError && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              <p className="font-medium">Unable to fetch tenant data from the API</p>
              <p className="text-sm">Showing fallback data for demonstration purposes.</p>
            </div>
          )}
          
          {!isError && tenants && tenants.length === 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
              <p className="font-medium">No tenants found</p>
              <p className="text-sm">There are no {onlyActives ? 'active ' : ''}tenants in the system.</p>
            </div>
          )}
          
          <DataTable<TenantListItem, any>
            columns={columns}
            data={displayTenants}
            pageSize={10}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </>
      )}
    </div>
  )
}