'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { AutoCell, FriendlyDateCell } from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useUserStore } from '@/app/stores/user-store'
import { User, AVAILABLE_LOCATIONS, Location } from '@/app/types/user'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { UserCircle2 } from 'lucide-react'
import { LocationSelect } from '@/app/components/custom-components/location-select'


export default function BodyTechs() {
  const users = useUserStore(state => state.users)
  const updateUser = useUserStore(state => state.updateUser)
  const bodyTechs = users.filter(user => user.role === 'BodyTech')

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-[22px] w-[22px]">
            <AvatarImage 
              src={row.original.avatar} 
              alt={row.original.fullName} 
            />
            <AvatarFallback>
              <UserCircle2 className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="text-base font-semibold leading-none">{row.original.fullName}</div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.email}</div>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.phoneNumber}</div>
      ),
    },
    {
      accessorKey: 'locations',
      header: 'Locations',
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <LocationSelect
            selectedLocations={row.original.locations.filter(loc => 
              AVAILABLE_LOCATIONS.includes(loc as Location)
            ) as Location[]}
            onLocationsChange={(locations) => {
              
              // Ensure only valid locations are saved
              const validLocations = locations.filter(loc => 
                AVAILABLE_LOCATIONS.includes(loc as Location)
              ) as Location[]

              updateUser({
                ...row.original,
                locations: validLocations,
                updatedAt: new Date().toISOString()
              })
            }}
          />
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Access',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            id={`active-${row.original.id}`}
            checked={row.original.isActive}
            onCheckedChange={(checked) => {
              updateUser({
                ...row.original,
                isActive: checked as boolean,
                updatedAt: new Date().toISOString()
              })
            }}
            className={cn(
              "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
              "border-muted"
            )}
          />
          <Label 
            htmlFor={`active-${row.original.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Active Access
          </Label>
        </div>
      ),
    },
    {
      accessorKey: 'lastLoginAt',
      header: 'Last Login',
      cell: ({ row }) => (
        <FriendlyDateCell date={row.original.lastLoginAt || ''} />
      ),
    },
  ]

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={bodyTechs}
        pageSize={10}
        showPageSize={true}
        pageSizeOptions={[5, 10, 20, 50]}
        
      />
    </div>
  )
}
