// This file represents the in-progress route
'use client';

import { DataTable } from '@/components/custom-components/custom-table/data-table';
import { VehicleCell } from '@/components/custom-components/custom-table/table-cells';
import ContactInfo from '@/app/[locale]/custom-components/contact-info';
import { mockWorkOrders } from '@/app/mocks/workfiles';

export default function InProgress() {
  // Define the cell rendering functions separately
  const renderVehicleCell = ({ row }: { row: any }) => (
    <VehicleCell
      make={row.original.Vehicle.make}
      model={row.original.Vehicle.model}
      year={row.original.Vehicle.year}
      imageUrl={row.original.Vehicle.imageUrl}
    />
  );

  const columns = [
    {
      accessorKey: 'RepairOrder',
      header: 'RO #',
    },
    {
      accessorKey: 'Vehicle',
      header: 'Vehicle',
      cell: renderVehicleCell,
    },
    {
      accessorKey: 'Owner',
      header: 'Owner',
      cell: ({ row }: { row: any }) => row.original.Owner.name,
    },
    {
      accessorKey: 'Estimate',
      header: 'Estimate',
      cell: () => <span></span>, // Empty for now
    },
    {
      accessorKey: 'inRental',
      header: 'In Rental',
      cell: ({ row }: { row: any }) => (row.original.inRental ? 'Yes' : 'No'),
    },
    {
      accessorKey: 'inDate',
      header: 'In Date',
      cell: ({ row }: { row: any }) => new Date(row.original.inDate).toLocaleDateString(),
    },
    {
      accessorKey: 'ECD',
      header: 'ECD',
      cell: ({ row }: { row: any }) => new Date(row.original.ECD).toLocaleDateString(),
    },
    {
      accessorKey: 'InsuranceProvider',
      header: 'Insurance',
      cell: ({ row }: { row: any }) => row.original.InsuranceProvider.name,
    },
    {
      accessorKey: 'lastCommunicationDate',
      header: 'Last Comm. Date',
      cell: ({ row }: { row: any }) => new Date(row.original.lastCommunicationDate).toLocaleDateString(),
    },
    {
      accessorKey: 'summary',
      header: 'Summary',
      cell: () => <span></span>, // Empty for now
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }: { row: any }) => <ContactInfo {...row.original.Owner} />, // Assuming ContactInfo takes Owner props
    },
    {
      accessorKey: 'addTask',
      header: 'Add New Task',
      cell: ({ row }: { row: any }) => (
        <button onClick={() => console.log(row.original)}>Add Task</button>
      ),
    },
  ];

  // Filter the mockWorkOrders to only include those with QualityCheck.state as 'In Progress'
  const filteredWorkOrders = mockWorkOrders.filter(order => order.QualityCheck.state === 'In Progress');

  return <DataTable columns={columns} data={filteredWorkOrders} />;
}