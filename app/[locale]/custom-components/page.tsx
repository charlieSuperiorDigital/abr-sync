'use client'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import { CustomCheckbox } from '@/components/custom-components/checkbox/custom-checkbox'
import { ColorPicker } from '@/components/custom-components/color-picker/custom-color-picker'
import {
  CustomRadioGroup,
  CustomRadioGroupItem,
} from '@/components/custom-components/custom-radio-button/custom-radio-button'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import DraggableNav from '@/components/custom-components/draggable-nav/draggable-nav'

import {
  CustomSelect,
  Option,
} from '@/components/custom-components/selects/custom-select'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import { SyntheticEvent, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  ActionsCell,
  DateCell,
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from './contact-info'
import { ReactNode } from 'react'
import UserImageAndName from './user-image-and-name'
import CarImageAndName from './car-image-and-name'
import DarkButton from './dark-button'
import { Apple, Archive, Mail, Phone } from 'lucide-react'
import RoundButtonWithTooltip from './round-button-with-tooltip'
import Section from './section'
import { DatePicker, Button as RsuiteButton } from 'rsuite'

const technicians: Option[] = [
  { value: 'alexander', label: 'Alexander Walker', avatar: '/placeholder.svg' },
  { value: 'aiden', label: 'Aiden Moore', avatar: '/placeholder.svg' },
  { value: 'james', label: 'James Davis', avatar: '/placeholder.svg' },
  { value: 'noah', label: 'Noah Brown', avatar: '/placeholder.svg' },
  { value: 'mason', label: 'Mason Lewis', avatar: '/placeholder.svg' },
  { value: 'jack', label: 'Jack Lourens', avatar: '/placeholder.svg' },
  { value: 'sam', label: 'Sam Moore', avatar: '/placeholder.svg' },
  { value: 'lucas', label: 'Lucas Jackson', avatar: '/placeholder.svg' },
]

const insurance: Option[] = [
  { value: 'progressive', label: 'Progressive' },
  { value: 'allstate', label: 'AllState' },
  { value: 'sellpay', label: 'SellPay' },
  { value: 'geico', label: 'Geico' },
]

const roles: Option[] = [
  { value: 'estimator', label: 'Estimator' },
  { value: 'csr', label: 'CSR' },
  { value: 'tech', label: 'Tech' },
  { value: 'paint-tech', label: 'Paint Tech' },
  { value: 'parts-manager', label: 'Parts Manager' },
  { value: 'shop-manager', label: 'Shop Manager' },
  { value: 'shop-owner', label: 'Shop Owner' },
  { value: 'other', label: 'Other' },
]

export interface Vehicle {
  id: string
  vin: string
  make: string
  model: string
  year: number
  color: string
  licensePlate: string
  imageUrl: string

  owner: {
    id: string
    name: string
    email: string
    phone: string
  }

  claim: {
    number: string
    type: 'collision' | 'comprehensive' | 'liability'
    status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'denied'
    description: string
  }

  service: {
    type: 'repair' | 'maintenance' | 'inspection'
    description: string
    estimatedCost: number
    actualCost: number
  }

  status:
  | 'incoming'
  | 'in_shop'
  | 'waiting_for_parts'
  | 'in_progress'
  | 'ready_for_pickup'
  | 'delivered'
  incomingDate: string
  estimatedCompletionDate: string
  actualCompletionDate: string | null
  lastUpdated: string
}


const data: Vehicle[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  vin: `1HGBH41JXMN10${i.toString().padStart(4, '0')}`,
  make: ['Volkswagen', 'BMW', 'Toyota', 'Honda', 'Nissan'][i % 5],
  model: ['Golf', 'X3', 'Sienna', 'Accord', 'Pathfinder'][i % 5],
  year: 2017 + (i % 7),
  color: ['Red', 'Blue', 'White', 'Black', 'Silver'][i % 5],
  licensePlate: `ABC${i.toString().padStart(3, '0')}`,
  imageUrl:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qjCM6QpEFgbg1bWW46LMhC08E8E1Km.png',
  owner: {
    id: `OWN${i.toString().padStart(3, '0')}`,
    name: [
      'Aiden Moore',
      'Harper White',
      'Tom Roberts',
      'Charlie Thompson',
      'George Brown',
    ][i % 5],
    email: `owner${i}@example.com`,
    phone: `(555) ${i.toString().padStart(3, '0')}-${(i * 7).toString().padStart(4, '0')}`,
  },
  claim: {
    number: `24-${58495058 + i}`,
    type: ['collision', 'comprehensive', 'liability'][i % 3] as
      | 'collision'
      | 'comprehensive'
      | 'liability',
    status: ['pending', 'approved', 'in_progress', 'completed', 'denied'][
      i % 5
    ] as 'pending' | 'approved' | 'in_progress' | 'completed' | 'denied',
    description: `Claim description for vehicle ${i + 1}`,
  },
  service: {
    type: ['repair', 'maintenance', 'inspection'][i % 3] as
      | 'repair'
      | 'maintenance'
      | 'inspection',
    description: `Service description for vehicle ${i + 1}`,
    estimatedCost: Math.round(Math.random() * 5000 + 500),
    actualCost: Math.round(Math.random() * 5000 + 500),
  },
  status: [
    'incoming',
    'in_shop',
    'waiting_for_parts',
    'in_progress',
    'ready_for_pickup',
    'delivered',
  ][i % 6] as
    | 'incoming'
    | 'in_shop'
    | 'waiting_for_parts'
    | 'in_progress'
    | 'ready_for_pickup'
    | 'delivered',
  incomingDate: new Date(2023, 8, 15 + (i % 15)).toISOString(),
  estimatedCompletionDate: new Date(2023, 8, 20 + (i % 15)).toISOString(),
  actualCompletionDate:
    i % 3 === 0 ? new Date(2023, 8, 22 + (i % 15)).toISOString() : null,
  lastUpdated: new Date(2023, 8, 23, 12, 34 + i).toISOString(),
}))

// Column definitions
const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: 'vin',
    header: 'VIN',
  },
  {
    accessorKey: 'vehicle',
    header: 'Vehicle',
    cell: ({ row }) => (
      <VehicleCell
        make={row.original.make}
        model={row.original.model}
        year={row.original.year}
        imageUrl={row.original.imageUrl}
      />
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadgeCell
        status={row.original.status}
        variant={
          row.original.status === 'delivered'
            ? 'forest'
            : row.original.status === 'waiting_for_parts'
              ? 'danger'
              : 'default'
        }
      />
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <ActionsCell
        actions={[
          {
            label: 'Call',
            onClick: () => console.log('Call', row.original.owner.phone),
            _component: <Phone className="w-4 h-4" />,
            variant: 'default'
          },
          {
            label: 'Email',
            onClick: () => console.log('Email', row.original.owner.email),
            _component: <Mail className="w-4 h-4" />,
            variant: 'default'
          },
        ]}
      />
    ),
  },
]

export default function Home() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false);






  const handleOk = (date: Date|null) => {
    setLoading(true); // Show loading indicator

    // Simulate an async task (e.g., API call)
    setTimeout(() => {
      console.log("Selected Date:", date);
      setLoading(false); // Hide loading after task is complete
    }, 2000);
  };




  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-h1">Components</h1>
        <CustomCheckbox id="unchecked" />
        <label
          htmlFor="unchecked"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Unchecked
        </label>
      </div>
      <StatusBadge variant="warning" size="lg">
        Status
      </StatusBadge>

      <Section title="Contact Info" description="You can set any of those icons as the preferred contact method using the prop">
        <ContactInfo />
      </Section>

      <Section title="Date Picker" >
        <DatePicker
          format="MM/dd/yyyy hh:mm"
          // appearance='subtle'
          showMeridiem
          onOk={handleOk}
          renderValue={date => date?.toLocaleString()}

        />
      </Section>

      <Section title="User picture + text">
        <UserImageAndName image="https://picsum.photos/200" name="John Doe" />
      </Section>

      <Section title="Car Info" description="You can set the prop as true if the car is in rental to show the small green car icon">
        <CarImageAndName image="https://picsum.photos/200" name="Palio Fire 2013" isInRental={true} />
      </Section>

      <Section title="Dark Button" description='Pass the onClick function as a prop. The icon is an option prop.'>
        <DarkButton
          buttonText='Click me!'
          onClick={() => console.log('Clicked!')}
          buttonIcon={<Archive className=" text-purple-600" />}
        />
        <DarkButton
          buttonText='Click me!'
          onClick={() => console.log('Clicked!')}
        />
      </Section>

      <Section title="Round Button With Tooltip">
        <RoundButtonWithTooltip
          onClick={() => console.log('Clicked!')}
          buttonIcon={<Archive className=" text-purple-600" />}
          tooltipText="This is a tooltip"
        />
      </Section>

      <div className="p-8 max-w-4xl mx-auto ">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Single Select with Avatars */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Technician</label>
            <CustomSelect
              placeholder="Select Technician"
              options={technicians}
              onChange={(values) => console.log('Selected technician:', values)}
            />
          </div>

          {/* Single Select Insurance */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Insurance</label>
            <CustomSelect
              placeholder="Select Insurance"
              options={insurance}
              onChange={(values) => console.log('Selected insurance:', values)}
            />
          </div>

          {/* Single Select Roles */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role</label>
            <CustomSelect
              placeholder="Select Role"
              options={roles}
              onChange={(values) => console.log('Selected role:', values)}
            />
          </div>

          {/* Multi Select Users */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Users</label>
            <CustomSelect
              placeholder="Select User"
              options={technicians}
              multiSelect
              onChange={(values) => console.log('Selected users:', values)}
            />
          </div>
        </div>
      </div>
      <div>
        <ColorPicker
          onChange={(rowIndex, colorId) => {
            console.log(`Row ${rowIndex} selected color: ${colorId}`)
          }}
        />
      </div>
      <div className="flex items-center gap-4">
        <CustomRadioGroup defaultValue="default">
          <CustomRadioGroupItem value="" />
        </CustomRadioGroup>

        <CustomRadioGroup defaultValue="selected">
          <CustomRadioGroupItem value="selected" checked />
        </CustomRadioGroup>

        <CustomRadioGroup defaultValue="disabled">
          <CustomRadioGroupItem value="disabled" variant="disabled" disabled />
        </CustomRadioGroup>

        <CustomRadioGroup>
          <CustomRadioGroupItem value="error" variant="error" />
        </CustomRadioGroup>
      </div>
      <div className=" w-full mx-auto max-w-4xl p-8">
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <BottomSheetModal title="Example" isOpen={open} onOpenChange={setOpen}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-blue-200" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Vehicles </h3>
                <p className="text-sm text-gray-500">Expand</p>
              </div>
            </div>

            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg bg-gray-100 flex items-center justify-center"
                >
                  Content {i + 1}
                </div>
              ))}
            </div>
          </div>
        </BottomSheetModal>

        <DraggableNav />

        <div className="container py-10">
          <DataTable
            columns={columns}
            data={data}
            onRowClick={(row) => console.log('Row clicked:', row)}
            pageSize={10}
            pageSizeOptions={[5, 10, 20, 30, 40, 50]}
            showPageSize={true}
          />
        </div>
      </div>
    </div>
  )
}
