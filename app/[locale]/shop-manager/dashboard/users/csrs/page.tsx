'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ActionsCell, AutoCell, FriendlyDateCell } from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { User, AVAILABLE_LOCATIONS, Location, UserRole } from '@/app/types/user'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { UserCircle2 } from 'lucide-react'
import { LocationSelect } from '@/components/custom-components/selects/location-select'
import { useUsers } from '@/app/context/UsersProvider'
import { EditUserModal } from '@/components/custom-components/user-modal/edit-user-modal'

export default function CSRs() {
  const { csrs, isLoading } = useUsers()

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
            selectedLocations={(row.original.locations || []).filter(loc => 
              AVAILABLE_LOCATIONS.includes(loc as Location)
            ) as Location[]}
            onLocationsChange={(locations: Location[]) => {
              // Ensure only valid locations are saved
              const validLocations = locations.filter(loc => 
                AVAILABLE_LOCATIONS.includes(loc as Location)
              ) as Location[]

              // TODO: Implement updateUser API call
              console.log('Update user locations:', {
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
              // TODO: Implement updateUser API call
              console.log('Update user locations:', {
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
          id: 'actions',
          cell: ({ row }) => (
            <ActionsCell
              actions={[
                {
                  label: 'Edit',
                  onClick: () => console.log('Edit Task:', row.original.id),
                  variant: 'secondary',
                  icon: 'edit',
                  _component:
                    <EditUserModal
                      title="Edit User"
                      user={row.original}
                    />
                },
              ]}
            />
          ),
        },
  ]

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading users...</div>
      ) : (
        <DataTable<User, any>
          columns={columns}
          data={csrs}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      )}
    </div>
  )
}
